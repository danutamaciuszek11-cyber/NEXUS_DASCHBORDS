import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot 
} from '../lib/firebase';
import { ChapterBookmark, BookAnnotation, Book, PilotProfile, BookCollection } from '../types';
import { getStoredBookmarks, saveStoredBookmarks } from './bookmarkStorage';
import { getStoredAnnotations, saveStoredAnnotations } from './annotationStorage';
import { nexusLogger } from '../services/loggerService';

// ==========================================
// CUSTOM COLLECTIONS FIRESTORE SYNC
// ==========================================

export function subscribeToCloudCollections(
  onUpdate: (collections: BookCollection[]) => void
): () => void {
  try {
    const colRef = collection(db, 'user_collections');
    return onSnapshot(colRef, (snapshot) => {
      const cloudList: BookCollection[] = [];
      snapshot.forEach((d) => {
        cloudList.push(d.data() as BookCollection);
      });

      if (cloudList.length > 0) {
        // Sort by updatedAt
        cloudList.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        try {
          localStorage.setItem('nexusbook_collections', JSON.stringify(cloudList));
        } catch (e) {
          nexusLogger.error('STORAGE', 'firestoreSync', 'Błąd zapisu kolekcji do localStorage', e);
        }
        onUpdate(cloudList);
      }
    }, (err) => {
      nexusLogger.warn('STORAGE', 'firestoreSync', 'Błąd nasłuchu user_collections w Firestore (użyto cache)', { error: err });
    });
  } catch (e) {
    nexusLogger.warn('STORAGE', 'firestoreSync', 'Nie udało się zasubskrybować kolekcji w chmurze', { error: e });
    return () => {};
  }
}

export async function syncCollectionToCloud(col: BookCollection): Promise<void> {
  try {
    const docRef = doc(db, 'user_collections', col.id);
    await setDoc(docRef, col);
  } catch (e) {
    nexusLogger.warn('STORAGE', 'firestoreSync', 'Zapis kolekcji do chmury nie powiódł się (zapisano lokalnie)', { error: e, colId: col.id });
  }
}

export async function removeCollectionFromCloud(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'user_collections', id);
    await deleteDoc(docRef);
  } catch (e) {
    nexusLogger.warn('STORAGE', 'firestoreSync', 'Usuwanie kolekcji z chmury nie powiodło się', { error: e, id });
  }
}

// ==========================================
// BOOKMARKS FIRESTORE SYNC
// ==========================================

export function subscribeToCloudBookmarks(
  onUpdate: (bookmarks: ChapterBookmark[]) => void
): () => void {
  try {
    const colRef = collection(db, 'bookmarks');
    return onSnapshot(colRef, (snapshot) => {
      const cloudList: ChapterBookmark[] = [];
      snapshot.forEach((d) => {
        cloudList.push(d.data() as ChapterBookmark);
      });

      // Sort by newest
      cloudList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      if (cloudList.length > 0) {
        saveStoredBookmarks(cloudList);
        onUpdate(cloudList);
      }
    }, (err) => {
      nexusLogger.warn('STORAGE', 'firestoreSync', 'Błąd nasłuchu zakładek w chmurze (działa pamięć podręczna)', { error: err });
    });
  } catch (e) {
    nexusLogger.warn('STORAGE', 'firestoreSync', 'Nie udało się zasubskrybować zakładek w chmurze', { error: e });
    return () => {};
  }
}

export async function syncBookmarkToCloud(bookmark: ChapterBookmark): Promise<void> {
  try {
    const docRef = doc(db, 'bookmarks', bookmark.id);
    await setDoc(docRef, bookmark);
  } catch (e) {
    nexusLogger.warn('STORAGE', 'firestoreSync', 'Zapis zakładki do chmury nie powiódł się (zapisano lokalnie)', { error: e, bookmarkId: bookmark.id });
  }
}

export async function removeBookmarkFromCloud(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'bookmarks', id);
    await deleteDoc(docRef);
  } catch (e) {
    nexusLogger.warn('STORAGE', 'firestoreSync', 'Usuwanie zakładki z chmury nie powiodło się (usunięto lokalnie)', { error: e, id });
  }
}

// ==========================================
// ANNOTATIONS FIRESTORE SYNC
// ==========================================

export function subscribeToCloudAnnotations(
  onUpdate: (annotations: BookAnnotation[]) => void
): () => void {
  try {
    const colRef = collection(db, 'annotations');
    return onSnapshot(colRef, (snapshot) => {
      const cloudList: BookAnnotation[] = [];
      snapshot.forEach((d) => {
        cloudList.push(d.data() as BookAnnotation);
      });
      if (cloudList.length > 0) {
        saveStoredAnnotations(cloudList);
        onUpdate(cloudList);
      }
    }, (err) => {
      nexusLogger.warn('STORAGE', 'firestoreSync', 'Błąd nasłuchu adnotacji w chmurze', { error: err });
    });
  } catch (e) {
    nexusLogger.warn('STORAGE', 'firestoreSync', 'Nie udało się zasubskrybować adnotacji w chmurze', { error: e });
    return () => {};
  }
}

export async function syncAnnotationToCloud(annotation: BookAnnotation): Promise<void> {
  try {
    const docRef = doc(db, 'annotations', annotation.id);
    await setDoc(docRef, annotation);
  } catch (e) {
    nexusLogger.warn('STORAGE', 'firestoreSync', 'Zapis adnotacji do chmury nie powiódł się', { error: e, id: annotation.id });
  }
}

export async function removeAnnotationFromCloud(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'annotations', id);
    await deleteDoc(docRef);
  } catch (e) {
    nexusLogger.warn('STORAGE', 'firestoreSync', 'Usuwanie adnotacji z chmury nie powiodło się', { error: e, id });
  }
}

// ==========================================
// CUSTOM BOOKS & HTML WORLDS FIRESTORE SYNC
// ==========================================

export async function fetchCustomBooksFromCloud(): Promise<Book[]> {
  try {
    const colRef = collection(db, 'custom_books');
    const snapshot = await getDocs(colRef);
    const books: Book[] = [];
    snapshot.forEach((d) => {
      books.push(d.data() as Book);
    });
    return books;
  } catch (e) {
    nexusLogger.warn('STORAGE', 'firestoreSync', 'Nie udało się pobrać custom dzieł z Firestore', { error: e });
    return [];
  }
}

export async function saveCustomBookToCloud(book: Book): Promise<void> {
  try {
    const docRef = doc(db, 'custom_books', book.id);
    await setDoc(docRef, book);
  } catch (e) {
    nexusLogger.warn('STORAGE', 'firestoreSync', 'Zapis custom książki do Firestore nie powiódł się', { error: e, bookId: book.id });
  }
}

export async function deleteCustomBookFromCloud(bookId: string): Promise<void> {
  try {
    const docRef = doc(db, 'custom_books', bookId);
    await deleteDoc(docRef);
  } catch (e) {
    nexusLogger.warn('STORAGE', 'firestoreSync', 'Usuwanie custom książki z Firestore nie powiodło się', { error: e, bookId });
  }
}

// ==========================================
// PILOT PROFILE FIRESTORE SYNC
// ==========================================

export async function savePilotProfileToCloud(profile: PilotProfile): Promise<void> {
  try {
    const docId = (profile as any).id || profile.designatorName?.replace(/[^a-zA-Z0-9_-]/g, '_') || 'active_pilot';
    const docRef = doc(db, 'pilot_profiles', docId);
    await setDoc(docRef, profile, { merge: true });
  } catch (e) {
    nexusLogger.warn('STORAGE', 'firestoreSync', 'Synchronizacja profilu pilota z Firestore nie powiodła się', { error: e });
  }
}
