import { Chapter, Category, SeekerId } from '../types';

export interface SubstackCleanedResult {
  title: string;
  subtitle: string;
  author: string;
  publishedDate?: string;
  cleanedHtml: string;
  cleanedText: string;
  chapters: Chapter[];
  stats: {
    wordCount: number;
    estReadTimeMin: number;
    removedElementsCount: number;
    removedBoilerplates: string[];
  };
  htmlWorldCode: string;
}

/**
 * Strips Substack tracking query parameters from URLs
 */
function cleanUrlTracking(url: string): string {
  try {
    const parsed = new URL(url);
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'r', 'triedRedirect'];
    trackingParams.forEach(p => parsed.searchParams.delete(p));
    return parsed.toString();
  } catch {
    return url.replace(/[?&](utm_[^&=]+|r=[^&=]+)=[^&#]*/g, '');
  }
}

/**
 * Cleans Substack HTML and extracts core content, metadata, and generates Nexus-compatible HTML
 */
export function processSubstackContent(rawInput: string, fallbackTitle = 'SUBSTACK ARTICLE'): SubstackCleanedResult {
  let removedCount = 0;
  const removedBoilerplates: string[] = [];

  // Check if input is HTML or Markdown/Plain Text
  const isHtml = /<[a-z][\s\S]*>/i.test(rawInput);

  let title = '';
  let subtitle = '';
  let author = 'Architekt Nexusa';
  let publishedDate: string | undefined;
  let cleanedBodyHtml = '';
  let cleanedText = '';

  if (isHtml && typeof window !== 'undefined' && window.DOMParser) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawInput, 'text/html');

    // 1. Extract Title
    const titleEl = 
      doc.querySelector('h1.post-title') || 
      doc.querySelector('h1.entry-title') || 
      doc.querySelector('h1') || 
      doc.querySelector('meta[property="og:title"]');
    
    if (titleEl) {
      if (titleEl.tagName.toLowerCase() === 'meta') {
        title = (titleEl as HTMLMetaElement).content || '';
      } else {
        title = titleEl.textContent || '';
      }
      // Clean up " - by [Author] - Substack" suffix
      title = title.replace(/\s*[-–—]\s*by\s+.*$/i, '').replace(/\s*[-–—]\s*Substack\s*$/i, '').trim();
    }

    // 2. Extract Subtitle
    const subtitleEl = 
      doc.querySelector('h3.subtitle') || 
      doc.querySelector('.subtitle') || 
      doc.querySelector('h2.subtitle') || 
      doc.querySelector('meta[property="og:description"]');
    
    if (subtitleEl) {
      if (subtitleEl.tagName.toLowerCase() === 'meta') {
        subtitle = (subtitleEl as HTMLMetaElement).content || '';
      } else {
        subtitle = subtitleEl.textContent || '';
      }
    }

    // 3. Extract Author
    const authorEl = doc.querySelector('.byline a') || doc.querySelector('.post-author') || doc.querySelector('meta[name="author"]');
    if (authorEl) {
      const authStr = authorEl.tagName.toLowerCase() === 'meta' 
        ? (authorEl as HTMLMetaElement).content 
        : authorEl.textContent;
      if (authStr && authStr.trim()) {
        author = authStr.trim();
      }
    }

    // 4. Extract Date
    const timeEl = doc.querySelector('time') || doc.querySelector('.post-date');
    if (timeEl) {
      publishedDate = timeEl.getAttribute('datetime') || timeEl.textContent?.trim() || undefined;
    }

    // 5. Identify core content container
    const contentContainer = 
      doc.querySelector('.body.markup') || 
      doc.querySelector('.available-content') || 
      doc.querySelector('article') || 
      doc.querySelector('.post-content') || 
      doc.body;

    // 6. Remove Substack Noise & Boilerplate Elements
    const noiseSelectors = [
      '.subscription-widget-wrap',
      '.subscribe-widget',
      '.button-wrapper',
      '.subscribe-btn',
      '.post-footer',
      '.comments-section',
      '.share-dialog',
      '.restack-action',
      '.like-button-container',
      '.pencraft',
      '.sidecar',
      '.header-with-anchor-widget',
      'form.newsletter-form',
      '.footnote-anchor',
      '.post-meta',
      'script',
      'style',
      'iframe[src*="substack"]',
      'iframe[src*="youtube"]:not([title])'
    ];

    noiseSelectors.forEach(sel => {
      const matched = contentContainer.querySelectorAll(sel);
      matched.forEach(node => {
        node.remove();
        removedCount++;
      });
    });

    // 7. Clean and filter paragraph text for promotional boilerplate phrases
    const paragraphs = contentContainer.querySelectorAll('p, blockquote, div');
    const promotionalPhrases = [
      /thanks for reading/i,
      /dziękuję za przeczytanie/i,
      /subscribe to get new posts/i,
      /subskrybuj, aby nie przegapić/i,
      /share this post/i,
      /udostępnij ten wpis/i,
      /pledge your support/i,
      /zostań płatnym subskrybentem/i,
      /leave a comment/i,
      /napisz komentarz/i,
      /read in the substack app/i,
      /czytaj w aplikacji substack/i,
      /upgrade to paid/i
    ];

    paragraphs.forEach(p => {
      const txt = p.textContent?.trim() || '';
      for (const rx of promotionalPhrases) {
        if (rx.test(txt) && txt.length < 250) {
          removedBoilerplates.push(txt.slice(0, 50) + '...');
          p.remove();
          removedCount++;
          break;
        }
      }
    });

    // Clean tracking from all links
    const links = contentContainer.querySelectorAll('a');
    links.forEach(a => {
      const href = a.getAttribute('href');
      if (href) {
        a.setAttribute('href', cleanUrlTracking(href));
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });

    cleanedBodyHtml = contentContainer.innerHTML.trim();
    cleanedText = contentContainer.textContent?.replace(/\s+/g, ' ').trim() || '';
  } else {
    // Plain text / Markdown fallback parser
    let processed = rawInput;

    // Extract title from Markdown # Header
    const titleMatch = processed.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      title = titleMatch[1].trim();
      processed = processed.replace(/^#\s+.+$/m, '').trim();
    }

    // Strip known Substack phrases
    const plainNoise = [
      /Thanks for reading.*$/gim,
      /Dziękuję za przeczytanie.*$/gim,
      /Subscribe to get full access.*$/gim,
      /Subskrybuj, aby otrzymać dostęp.*$/gim,
      /Share this post.*$/gim,
      /Udostępnij ten wpis.*$/gim,
      /\[Read in app\].*$/gim,
      /\[Czytaj w aplikacji\].*$/gim
    ];

    plainNoise.forEach(rx => {
      if (rx.test(processed)) {
        removedCount++;
        processed = processed.replace(rx, '');
      }
    });

    cleanedText = processed.trim();
    cleanedBodyHtml = processed
      .split(/\n\n+/)
      .map(p => `<p class="mb-4 leading-relaxed">${p.trim()}</p>`)
      .join('\n');
  }

  // Fallbacks if title or subtitle were empty
  if (!title) {
    title = fallbackTitle.toUpperCase();
  }
  if (!subtitle) {
    subtitle = `Zintegrowana publikacja z Substack // ${author}`;
  }

  // Words & Reading Time Calculations
  const wordCount = cleanedText.split(/\s+/).filter(Boolean).length;
  const estReadTimeMin = Math.max(1, Math.ceil(wordCount / 180));

  // Break content into Nexus chapters based on headings or dividers
  const chapters = splitSubstackIntoChapters(cleanedBodyHtml, cleanedText, title);

  // Generate interactive Nexus HTML World document
  const htmlWorldCode = generateNexusHtmlWorldDoc({
    title,
    subtitle,
    author,
    publishedDate,
    bodyHtml: cleanedBodyHtml,
    wordCount,
    estReadTimeMin
  });

  return {
    title,
    subtitle,
    author,
    publishedDate,
    cleanedHtml: cleanedBodyHtml,
    cleanedText,
    chapters,
    stats: {
      wordCount,
      estReadTimeMin,
      removedElementsCount: removedCount,
      removedBoilerplates
    },
    htmlWorldCode
  };
}

/**
 * Splits cleaned Substack content into structured Chapters for NexusBook
 */
function splitSubstackIntoChapters(html: string, text: string, defaultTitle: string): Chapter[] {
  const chapters: Chapter[] = [];

  // If HTML contains <h2> or <h3> headings, divide by them
  const headingRegex = /<h[23][^>]*>(.*?)<\/h[23]>/gi;
  let match: RegExpExecArray | null;
  const headingIndices: { title: string; index: number }[] = [];

  while ((match = headingRegex.exec(html)) !== null) {
    const cleanTitle = match[1].replace(/<[^>]+>/g, '').trim();
    headingIndices.push({
      title: cleanTitle,
      index: match.index
    });
  }

  if (headingIndices.length > 1) {
    for (let i = 0; i < headingIndices.length; i++) {
      const current = headingIndices[i];
      const nextIndex = i + 1 < headingIndices.length ? headingIndices[i + 1].index : html.length;
      const sectionHtml = html.slice(current.index, nextIndex);
      const plainSectionText = sectionHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const words = plainSectionText.split(/\s+/).filter(Boolean).length;

      chapters.push({
        id: `ch_${Date.now()}_${i + 1}`,
        number: i + 1,
        title: current.title || `Część 0${i + 1}`,
        summary: plainSectionText.slice(0, 160) + '...',
        readTimeMin: Math.max(1, Math.ceil(words / 180)),
        content: plainSectionText
      });
    }
  } else {
    // Fallback: Split by double newline or keep as single unified chapter
    const paragraphs = text.split(/\n\n+/);
    if (paragraphs.length > 10) {
      // Chunk into ~400 word sub-chapters
      let curWords: string[] = [];
      let chNumber = 1;

      for (let i = 0; i < paragraphs.length; i++) {
        const p = paragraphs[i].trim();
        curWords.push(p);
        const count = curWords.join(' ').split(/\s+/).length;

        if (count >= 350 || i === paragraphs.length - 1) {
          const content = curWords.join('\n\n');
          const words = content.split(/\s+/).filter(Boolean).length;
          chapters.push({
            id: `ch_${Date.now()}_${chNumber}`,
            number: chNumber,
            title: chNumber === 1 ? 'Prolog // Wprowadzenie' : `Rozdział 0${chNumber}`,
            summary: content.slice(0, 160) + '...',
            readTimeMin: Math.max(1, Math.ceil(words / 180)),
            content
          });
          curWords = [];
          chNumber++;
        }
      }
    } else {
      chapters.push({
        id: `ch_${Date.now()}_1`,
        number: 1,
        title: defaultTitle || 'Część Główna',
        summary: text.slice(0, 160) + '...',
        readTimeMin: Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 180)),
        content: text
      });
    }
  }

  return chapters;
}

/**
 * Generates an immersive, standalone Nexus HTML World page for the Substack article
 */
export function generateNexusHtmlWorldDoc(params: {
  title: string;
  subtitle: string;
  author: string;
  publishedDate?: string;
  bodyHtml: string;
  wordCount: number;
  estReadTimeMin: number;
}): string {
  const { title, subtitle, author, publishedDate, bodyHtml, wordCount, estReadTimeMin } = params;

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | ETERNIVERSE OS</title>
  <style>
    :root {
      --bg: #030712;
      --card-bg: rgba(15, 23, 42, 0.7);
      --accent: #00f0ff;
      --accent-gold: #ffd700;
      --text: #e2e8f0;
      --text-muted: #94a3b8;
      --border: rgba(255, 255, 255, 0.12);
      --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
      --font-body: system-ui, -apple-system, sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      line-height: 1.75;
      padding: 2rem 1rem;
      display: flex;
      justify-content: center;
      min-height: 100vh;
      background-image: 
        radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 240, 255, 0.15), transparent),
        radial-gradient(ellipse 60% 40% at 50% 120%, rgba(255, 215, 0, 0.08), transparent);
    }

    .container {
      width: 100%;
      max-width: 820px;
    }

    .header-hud {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1rem;
      margin-bottom: 2rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--accent);
      letter-spacing: 0.1em;
    }

    .badge {
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid var(--accent);
      color: var(--accent);
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      font-weight: bold;
    }

    h1.post-title {
      font-size: 2.25rem;
      font-weight: 800;
      line-height: 1.25;
      margin-bottom: 0.75rem;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      text-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
    }

    p.subtitle {
      font-size: 1.15rem;
      color: var(--text-muted);
      margin-bottom: 2rem;
      font-weight: 400;
      border-left: 3px solid var(--accent-gold);
      padding-left: 1rem;
    }

    .meta-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 2.5rem;
      padding: 0.75rem 1rem;
      background: var(--card-bg);
      border-radius: 8px;
      border: 1px solid var(--border);
    }

    .meta-item span {
      color: #fff;
      font-weight: bold;
    }

    .content {
      font-size: 1.05rem;
      color: #cbd5e1;
    }

    .content p {
      margin-bottom: 1.5rem;
      text-align: justify;
    }

    .content h2, .content h3 {
      color: #ffffff;
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 0.5rem;
    }

    .content blockquote {
      border-left: 4px solid var(--accent);
      background: rgba(0, 240, 255, 0.05);
      padding: 1rem 1.25rem;
      margin: 1.75rem 0;
      font-style: italic;
      color: #f1f5f9;
      border-radius: 0 8px 8px 0;
    }

    .content ul, .content ol {
      margin-bottom: 1.5rem;
      padding-left: 1.5rem;
    }

    .content li {
      margin-bottom: 0.5rem;
    }

    .content a {
      color: var(--accent);
      text-decoration: underline;
      text-underline-offset: 4px;
    }

    .footer-terminal {
      margin-top: 3.5rem;
      padding: 1.5rem;
      background: #000000;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--accent);
    }

    .terminal-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px dashed rgba(0, 240, 255, 0.3);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-hud">
      <div class="badge">NEXUSBOOK // SUBSTACK ARCHIVE NODE</div>
      <div>ETERNIVERSE OS v2.4</div>
    </div>

    <h1 class="post-title">${title}</h1>
    ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}

    <div class="meta-bar">
      <div class="meta-item">AUTOR: <span>${author}</span></div>
      ${publishedDate ? `<div class="meta-item">DATA: <span>${publishedDate}</span></div>` : ''}
      <div class="meta-item">OBJĘTOŚĆ: <span>${wordCount} SŁÓW</span></div>
      <div class="meta-item">CZAS CZYTANIA: <span>~${estReadTimeMin} MIN</span></div>
    </div>

    <div class="content">
      ${bodyHtml}
    </div>

    <div class="footer-terminal">
      <div class="terminal-header">
        <span>// ETERION BINARY GUARDIAN</span>
        <span>STATUS: PERSISTED</span>
      </div>
      <div>
        ,,Każde słowo prawdy wyrywa przestrzeń z rąk chaosu. Nexus chroni myśl nienaruszoną.,,
      </div>
    </div>
  </div>
</body>
</html>`;
}
