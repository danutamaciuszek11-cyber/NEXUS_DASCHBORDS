import { Book, SeekerId } from '../types';
import { SEEKERS_CONFIG } from '../data/booksData';

export interface QuoteWithAttribution {
  id: string;
  text: string;
  bookId: string;
  bookTitle: string;
  bookSubtitle?: string;
  bookAuthor: string;
  seeker: SeekerId;
  seekerColor: string;
  chapterTitle: string;
  tags: string[];
  year?: number;
  book: Book;
}

/**
 * Returns formatted author for a book adhering to Nexus canonical hierarchy
 */
export function getBookAuthor(book: Book): string {
  if (book.customHtmlWorld?.authorName) {
    return book.customHtmlWorld.authorName;
  }
  if (book.seeker === 'Operator001') {
    return 'Architekt Nexusa (Operator 001)';
  }
  const seekerName = SEEKERS_CONFIG[book.seeker]?.name || book.seeker;
  return `Architekt Nexusa • ${seekerName}`;
}

/**
 * Extracts all available quotes across all books in the library with complete attribution
 */
export function getAllQuotesFromBooks(books: Book[]): QuoteWithAttribution[] {
  const result: QuoteWithAttribution[] = [];

  books.forEach((book) => {
    const author = getBookAuthor(book);
    const seekerCfg = SEEKERS_CONFIG[book.seeker];
    const accentColor = book.seekerColor || seekerCfg?.color || '#00f0ff';

    if (book.quotes && book.quotes.length > 0) {
      book.quotes.forEach((q, idx) => {
        result.push({
          id: q.id || `${book.id}_q_${idx}`,
          text: q.text,
          bookId: book.id,
          bookTitle: book.title,
          bookSubtitle: book.subtitle,
          bookAuthor: author,
          seeker: book.seeker,
          seekerColor: accentColor,
          chapterTitle: q.chapterTitle || book.chapters[0]?.title || 'Kanon Dzieła',
          tags: q.tags || book.tags || [],
          year: book.year,
          book
        });
      });
    } else if (book.chapters && book.chapters.length > 0) {
      // Fallback extract initial thought or short excerpt if no explicit quotes array
      const firstChapter = book.chapters[0];
      const preview = firstChapter.summary || firstChapter.content.slice(0, 180).trim() + '...';
      result.push({
        id: `${book.id}_ch_excerpt`,
        text: preview,
        bookId: book.id,
        bookTitle: book.title,
        bookSubtitle: book.subtitle,
        bookAuthor: author,
        seeker: book.seeker,
        seekerColor: accentColor,
        chapterTitle: firstChapter.title,
        tags: book.tags || [],
        year: book.year,
        book
      });
    }
  });

  return result;
}

/**
 * Deterministically retrieves the Quote of the Day based on calendar date
 */
export function getDailyQuote(books: Book[]): QuoteWithAttribution | null {
  const allQuotes = getAllQuotesFromBooks(books);
  if (allQuotes.length === 0) return null;

  const today = new Date();
  // YYYYMMDD string converted to numeric seed
  const seedString = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash * 31 + seedString.charCodeAt(i)) % 1000000;
  }

  const index = Math.abs(hash) % allQuotes.length;
  return allQuotes[index];
}

/**
 * Retrieves a random quote from available books, avoiding previous if possible
 */
export function getRandomQuote(books: Book[], excludeId?: string): QuoteWithAttribution | null {
  const allQuotes = getAllQuotesFromBooks(books);
  if (allQuotes.length === 0) return null;
  if (allQuotes.length === 1) return allQuotes[0];

  const pool = excludeId ? allQuotes.filter(q => q.id !== excludeId) : allQuotes;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || allQuotes[0];
}

/**
 * Formats quote with full author and book attribution for clipboard and sharing
 */
export function formatQuoteForSharing(quote: QuoteWithAttribution): string {
  return `"${quote.text}"\n\n— ${quote.bookAuthor}\nKsięga: ${quote.bookTitle}${quote.bookSubtitle ? ` (${quote.bookSubtitle})` : ''}\nRozdział: ${quote.chapterTitle}\nWrota: ${quote.seeker} • Archiwum NEXUSBOOK`;
}
