import { BookAnnotation } from '../types';
import { syncAnnotationToCloud, removeAnnotationFromCloud } from './firestoreSync';

const STORAGE_KEY = 'nexusbook_annotations';

export function getStoredAnnotations(): BookAnnotation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load annotations from localStorage:', e);
    return [];
  }
}

export function saveStoredAnnotations(annotations: BookAnnotation[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
  } catch (e) {
    console.error('Failed to save annotations to localStorage:', e);
  }
}

export function getAnnotationsForBook(bookId: string): BookAnnotation[] {
  const all = getStoredAnnotations();
  return all.filter(a => a.bookId === bookId);
}

export function addAnnotation(annotation: Omit<BookAnnotation, 'id' | 'createdAt'>): BookAnnotation {
  const all = getStoredAnnotations();
  const newAnno: BookAnnotation = {
    ...annotation,
    id: `anno_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: Date.now()
  };
  const updated = [newAnno, ...all];
  saveStoredAnnotations(updated);
  syncAnnotationToCloud(newAnno).catch(console.error);
  return newAnno;
}

export function deleteAnnotation(id: string): BookAnnotation[] {
  const all = getStoredAnnotations();
  const updated = all.filter(a => a.id !== id);
  saveStoredAnnotations(updated);
  removeAnnotationFromCloud(id).catch(console.error);
  return updated;
}

export function updateAnnotation(id: string, updates: Partial<Pick<BookAnnotation, 'note' | 'color'>>): BookAnnotation[] {
  const all = getStoredAnnotations();
  const updated = all.map(a => a.id === id ? { ...a, ...updates } : a);
  saveStoredAnnotations(updated);
  const target = updated.find(a => a.id === id);
  if (target) {
    syncAnnotationToCloud(target).catch(console.error);
  }
  return updated;
}
