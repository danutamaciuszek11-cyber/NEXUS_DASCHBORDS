import { ChapterNote } from '../types';

const STORAGE_KEY = 'nexusbook_chapter_notes';

export function getStoredChapterNotes(): ChapterNote[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load chapter notes from localStorage:', e);
    return [];
  }
}

export function saveStoredChapterNotes(notes: ChapterNote[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save chapter notes to localStorage:', e);
  }
}

export function getNotesForBook(bookId: string): ChapterNote[] {
  const all = getStoredChapterNotes();
  return all.filter(n => n.bookId === bookId);
}

export function getNotesForChapter(bookId: string, chapterId: string): ChapterNote[] {
  const all = getStoredChapterNotes();
  return all.filter(n => n.bookId === bookId && n.chapterId === chapterId);
}

export function addChapterNote(
  data: Omit<ChapterNote, 'id' | 'createdAt' | 'updatedAt'>
): ChapterNote {
  const all = getStoredChapterNotes();
  const now = Date.now();
  const newNote: ChapterNote = {
    ...data,
    id: `note_${now}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: now,
    updatedAt: now
  };
  const updated = [newNote, ...all];
  saveStoredChapterNotes(updated);
  return newNote;
}

export function updateChapterNote(id: string, content: string): ChapterNote[] {
  const all = getStoredChapterNotes();
  const now = Date.now();
  const updated = all.map(n => n.id === id ? { ...n, content: content.trim(), updatedAt: now } : n);
  saveStoredChapterNotes(updated);
  return updated;
}

export function deleteChapterNote(id: string): ChapterNote[] {
  const all = getStoredChapterNotes();
  const updated = all.filter(n => n.id !== id);
  saveStoredChapterNotes(updated);
  return updated;
}
