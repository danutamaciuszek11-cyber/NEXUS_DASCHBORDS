import { ChapterBookmark } from '../types';
import { syncBookmarkToCloud, removeBookmarkFromCloud } from './firestoreSync';

const STORAGE_KEY = 'nexusbook_chapter_bookmarks';

export function getStoredBookmarks(): ChapterBookmark[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load bookmarks from localStorage:', e);
    return [];
  }
}

export function saveStoredBookmarks(bookmarks: ChapterBookmark[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to save bookmarks to localStorage:', e);
  }
}

export function isChapterBookmarked(bookId: string, chapterId: string): boolean {
  const bookmarks = getStoredBookmarks();
  return bookmarks.some(b => b.bookId === bookId && b.chapterId === chapterId);
}

export function toggleChapterBookmark(
  bookmarkData: Omit<ChapterBookmark, 'id' | 'createdAt'>
): { isBookmarked: boolean; bookmarks: ChapterBookmark[] } {
  const all = getStoredBookmarks();
  const existingIndex = all.findIndex(
    b => b.bookId === bookmarkData.bookId && b.chapterId === bookmarkData.chapterId
  );

  let updated: ChapterBookmark[];
  let isBookmarked: boolean;

  if (existingIndex >= 0) {
    const removedItem = all[existingIndex];
    updated = all.filter((_, idx) => idx !== existingIndex);
    isBookmarked = false;
    if (removedItem) {
      removeBookmarkFromCloud(removedItem.id).catch(console.error);
    }
  } else {
    const newBookmark: ChapterBookmark = {
      ...bookmarkData,
      id: `bm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now()
    };
    updated = [newBookmark, ...all];
    isBookmarked = true;
    syncBookmarkToCloud(newBookmark).catch(console.error);
  }

  saveStoredBookmarks(updated);
  return { isBookmarked, bookmarks: updated };
}

export function deleteBookmark(id: string): ChapterBookmark[] {
  const all = getStoredBookmarks();
  const updated = all.filter(b => b.id !== id);
  saveStoredBookmarks(updated);
  removeBookmarkFromCloud(id).catch(console.error);
  return updated;
}
