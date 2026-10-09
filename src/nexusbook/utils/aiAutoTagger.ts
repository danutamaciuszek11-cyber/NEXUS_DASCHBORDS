import { Category, SeekerId } from '../types';

export interface AutoTagResult {
  suggestedCategory: Category;
  suggestedTags: string[];
  recommendedSeeker: SeekerId;
  confidence: number;
  analysis: string;
  keywords: string[];
  source: string;
}

export interface AutoTagPayload {
  title: string;
  subtitle?: string;
  shortDesc?: string;
  htmlContent?: string;
  currentCategory?: Category;
  currentSeeker?: SeekerId;
}

/**
 * Calls server-side Gemini API or local heuristic engine to auto-tag and categorize a book.
 */
export async function analyzeAndAutoTagBook(payload: AutoTagPayload): Promise<AutoTagResult> {
  try {
    const res = await fetch('/api/books/auto-tag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return {
          suggestedCategory: data.suggestedCategory as Category,
          suggestedTags: data.suggestedTags || [data.suggestedCategory, 'Manifest'],
          recommendedSeeker: data.recommendedSeeker as SeekerId,
          confidence: data.confidence ?? 0.9,
          analysis: data.analysis || 'Analiza semantyczna AI została pomyślnie ukończona.',
          keywords: data.keywords || [],
          source: data.source || 'gemini-ai'
        };
      }
    }
  } catch (err) {
    console.warn('Network request to /api/books/auto-tag failed, applying client heuristic fallback:', err);
  }

  // Client-side fallback if server is unreachable
  return clientFallbackAutoTag(payload);
}

function clientFallbackAutoTag(payload: AutoTagPayload): AutoTagResult {
  const combined = `${payload.title} ${payload.subtitle || ''} ${payload.shortDesc || ''} ${payload.htmlContent || ''}`.toLowerCase();

  let category: Category = payload.currentCategory || 'Manifest';
  let seeker: SeekerId = payload.currentSeeker || 'Operator001';
  const tags: string[] = ['Manifest'];

  if (combined.includes('dopamin') || combined.includes('biolog') || combined.includes('opór') || combined.includes('hormez') || combined.includes('ciało') || combined.includes('hartowan')) {
    category = 'Psychologia';
    seeker = 'BioSeeker';
    tags.push('Neurobiologia', 'Biologiczny Opór', 'Dopamina', 'Hormeza');
  } else if (combined.includes('cyber') || combined.includes('terroryz') || combined.includes('bezpiecz') || combined.includes('zero')) {
    category = 'Cyberbezpieczeństwo';
    seeker = 'Operator001';
    tags.push('Cyberbezpieczeństwo', 'Architektura Zero', 'Suwerenność Cyfrowa');
  } else if (combined.includes('ai') || combined.includes('sztuczn') || combined.includes('neural') || combined.includes('model')) {
    category = 'AI';
    seeker = 'Operator001';
    tags.push('AI', 'Sieci Neuronowe', 'Autonomia Maszynowa');
  } else if (combined.includes('filozof') || combined.includes('sens') || combined.includes('świadomoś')) {
    category = 'Filozofia';
    seeker = 'MirrorSeeker';
    tags.push('Filozofia', 'Świadomość', 'Epistemologia');
  } else if (combined.includes('duch') || combined.includes('dusza') || combined.includes('metafizyk') || combined.includes('kwant')) {
    category = 'Metafizyka';
    seeker = 'SpiritSeeker';
    tags.push('Metafizyka', 'Dynamika Kwantowa', 'Transcendencja');
  } else if (combined.includes('kosmos') || combined.includes('science') || combined.includes('czas')) {
    category = 'Science Fiction';
    seeker = 'ChronoSeeker';
    tags.push('Science Fiction', 'Futuryzm', 'Czasoprzestrzeń');
  } else if (combined.includes('psycholog') || combined.includes('umysł') || combined.includes('emocj')) {
    category = 'Psychologia';
    seeker = 'MirrorSeeker';
    tags.push('Psychologia', 'Archetypy', 'Autodiagnostyka');
  }

  if (payload.title && payload.title.length > 3) {
    tags.push(payload.title.slice(0, 20));
  }

  return {
    suggestedCategory: category,
    suggestedTags: Array.from(new Set(tags)).slice(0, 5),
    recommendedSeeker: seeker,
    confidence: 0.85,
    analysis: `Zastosowano lokalną heurystykę kategoryzacji. Wiodący temat: ${category}.`,
    keywords: [category.toLowerCase(), 'manifest', 'kod html'],
    source: 'local-heuristic'
  };
}
