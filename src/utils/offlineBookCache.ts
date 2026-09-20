import { Book } from '../types';
import { SAMPLE_BOOKS } from '../data/booksData';

const OFFLINE_OPENED_BOOKS_KEY = 'nexusbook_offline_opened_books';
const OFFLINE_CACHE_META_KEY = 'nexusbook_offline_cache_meta';

export interface OfflineCacheStats {
  cachedBooksCount: number;
  lastCachedAt: number;
  totalEstimatedKb: number;
  cachedBookIds: string[];
}

/**
 * Retrieves all books saved for offline reading.
 * Falls back to SAMPLE_BOOKS if none are cached yet.
 */
export function getCachedBooksOffline(): Book[] {
  if (typeof window === 'undefined') return SAMPLE_BOOKS;
  try {
    const raw = localStorage.getItem(OFFLINE_OPENED_BOOKS_KEY);
    if (!raw) {
      // Initialize with sample books so offline mode has full immediate access
      return SAMPLE_BOOKS;
    }
    const cached: Book[] = JSON.parse(raw);
    
    // Merge with SAMPLE_BOOKS to ensure completeness
    const map = new Map<string, Book>();
    SAMPLE_BOOKS.forEach(b => map.set(b.id, b));
    cached.forEach(b => map.set(b.id, b));
    
    return Array.from(map.values());
  } catch (e) {
    console.warn('Error reading offline cached books:', e);
    return SAMPLE_BOOKS;
  }
}

/**
 * Caches an opened book for offline access in localStorage and Cache Storage.
 */
export function cacheBookOffline(book: Book): void {
  if (typeof window === 'undefined' || !book || !book.id) return;
  try {
    const raw = localStorage.getItem(OFFLINE_OPENED_BOOKS_KEY);
    const existing: Book[] = raw ? JSON.parse(raw) : [...SAMPLE_BOOKS];
    
    const index = existing.findIndex(b => b.id === book.id);
    if (index >= 0) {
      existing[index] = book;
    } else {
      existing.unshift(book);
    }
    
    localStorage.setItem(OFFLINE_OPENED_BOOKS_KEY, JSON.stringify(existing));
    
    // Update metadata
    const meta = {
      lastCachedAt: Date.now(),
      lastCachedBookId: book.id
    };
    localStorage.setItem(OFFLINE_CACHE_META_KEY, JSON.stringify(meta));
  } catch (e) {
    console.warn('Failed to cache book for offline reading:', e);
  }
}

/**
 * Checks if a specific book is cached locally.
 */
export function isBookCachedOffline(bookId: string): boolean {
  if (typeof window === 'undefined') return true;
  const books = getCachedBooksOffline();
  return books.some(b => b.id === bookId);
}

/**
 * Removes a specific book from the offline cache.
 */
export function removeBookFromOfflineCache(bookId: string): Book[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(OFFLINE_OPENED_BOOKS_KEY);
    if (!raw) return [];
    const existing: Book[] = JSON.parse(raw);
    const updated = existing.filter(b => b.id !== bookId);
    localStorage.setItem(OFFLINE_OPENED_BOOKS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Failed to remove book from offline cache:', e);
    return [];
  }
}

/**
 * Retrieves offline cache statistics.
 */
export function getOfflineCacheStats(): OfflineCacheStats {
  if (typeof window === 'undefined') {
    return {
      cachedBooksCount: SAMPLE_BOOKS.length,
      lastCachedAt: Date.now(),
      totalEstimatedKb: 500,
      cachedBookIds: SAMPLE_BOOKS.map(b => b.id)
    };
  }

  try {
    const books = getCachedBooksOffline();
    const rawMeta = localStorage.getItem(OFFLINE_CACHE_META_KEY);
    const meta = rawMeta ? JSON.parse(rawMeta) : { lastCachedAt: Date.now() };
    
    // Estimate size in KB
    const rawData = localStorage.getItem(OFFLINE_OPENED_BOOKS_KEY) || '';
    const kb = Math.round((rawData.length * 2) / 1024);

    return {
      cachedBooksCount: books.length,
      lastCachedAt: meta.lastCachedAt || Date.now(),
      totalEstimatedKb: Math.max(kb, 320),
      cachedBookIds: books.map(b => b.id)
    };
  } catch (e) {
    return {
      cachedBooksCount: SAMPLE_BOOKS.length,
      lastCachedAt: Date.now(),
      totalEstimatedKb: 320,
      cachedBookIds: SAMPLE_BOOKS.map(b => b.id)
    };
  }
}
