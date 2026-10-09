import { Book, BookProgressData } from '../types';
import { getStoredBookmarks } from './bookmarkStorage';

const READ_CHAPTERS_STORAGE_KEY = 'nexusbook_read_chapters';

// Stored as a map or array of strings: "bookId::chapterId"
export function getStoredReadChapters(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(READ_CHAPTERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load read chapters from localStorage:', e);
    return [];
  }
}

export function saveStoredReadChapters(keys: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(READ_CHAPTERS_STORAGE_KEY, JSON.stringify(keys));
  } catch (e) {
    console.error('Failed to save read chapters to localStorage:', e);
  }
}

export function isChapterRead(bookId: string, chapterId: string): boolean {
  const readList = getStoredReadChapters();
  const key = `${bookId}::${chapterId}`;
  return readList.includes(key);
}

export function toggleChapterRead(bookId: string, chapterId: string): boolean {
  const readList = getStoredReadChapters();
  const key = `${bookId}::${chapterId}`;
  const exists = readList.includes(key);

  let updated: string[];
  if (exists) {
    updated = readList.filter(k => k !== key);
  } else {
    updated = [...readList, key];
  }

  saveStoredReadChapters(updated);
  return !exists;
}

export function markChapterAsRead(bookId: string, chapterId: string): void {
  const readList = getStoredReadChapters();
  const key = `${bookId}::${chapterId}`;
  if (!readList.includes(key)) {
    saveStoredReadChapters([...readList, key]);
  }
}

export function markChapterAsUnread(bookId: string, chapterId: string): void {
  const readList = getStoredReadChapters();
  const key = `${bookId}::${chapterId}`;
  if (readList.includes(key)) {
    saveStoredReadChapters(readList.filter(k => k !== key));
  }
}

export function getBookReadingProgress(book: Book): BookProgressData {
  if (!book || !book.chapters || book.chapters.length === 0) {
    return {
      bookId: book?.id || '',
      readChapterIds: [],
      bookmarkedChapterIds: [],
      totalChapters: 0,
      completedChaptersCount: 0,
      percentage: 0,
      isCompleted: false
    };
  }

  const readList = getStoredReadChapters();
  const bookmarks = getStoredBookmarks();

  const readChapterIds = book.chapters
    .filter(ch => readList.includes(`${book.id}::${ch.id}`))
    .map(ch => ch.id);

  const bookmarkedChapterIds = book.chapters
    .filter(ch => bookmarks.some(b => b.bookId === book.id && b.chapterId === ch.id))
    .map(ch => ch.id);

  // A chapter counts as completed if it is read OR bookmarked
  const completedSet = new Set([...readChapterIds, ...bookmarkedChapterIds]);
  const completedChaptersCount = completedSet.size;
  const totalChapters = book.chapters.length;
  const percentage = Math.round((completedChaptersCount / totalChapters) * 100);
  const isCompleted = completedChaptersCount >= totalChapters && totalChapters > 0;

  return {
    bookId: book.id,
    readChapterIds,
    bookmarkedChapterIds,
    totalChapters,
    completedChaptersCount,
    percentage,
    isCompleted
  };
}

export function getAllBooksProgress(books: Book[]): Record<string, BookProgressData> {
  const map: Record<string, BookProgressData> = {};
  books.forEach(b => {
    map[b.id] = getBookReadingProgress(b);
  });
  return map;
}
