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
          console.error(e);
        }
        onUpdate(cloudList);
      }
    }, (err) => {
      console.warn('Firestore user_collections snapshot error:', err);
    });
  } catch (e) {
    console.warn('Failed to subscribe to cloud collections:', e);
    return () => {};
  }
}

export async function syncCollectionToCloud(col: BookCollection): Promise<void> {
  try {
    const docRef = doc(db, 'user_collections', col.id);
    await setDoc(docRef, col);
  } catch (e) {
    console.warn('Failed to save collection to cloud (saved locally):', e);
  }
}

export async function removeCollectionFromCloud(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'user_collections', id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Failed to delete collection from cloud:', e);
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
      console.warn('Firestore bookmarks snapshot error (using local cache):', err);
    });
  } catch (e) {
    console.warn('Failed to subscribe to cloud bookmarks:', e);
    return () => {};
  }
}

export async function syncBookmarkToCloud(bookmark: ChapterBookmark): Promise<void> {
  try {
    const docRef = doc(db, 'bookmarks', bookmark.id);
    await setDoc(docRef, bookmark);
  } catch (e) {
    console.warn('Failed to save bookmark to cloud (saved locally):', e);
  }
}

export async function removeBookmarkFromCloud(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'bookmarks', id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Failed to delete bookmark from cloud (deleted locally):', e);
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
      console.warn('Firestore annotations snapshot error:', err);
    });
  } catch (e) {
    console.warn('Failed to subscribe to cloud annotations:', e);
    return () => {};
  }
}

export async function syncAnnotationToCloud(annotation: BookAnnotation): Promise<void> {
  try {
    const docRef = doc(db, 'annotations', annotation.id);
    await setDoc(docRef, annotation);
  } catch (e) {
    console.warn('Failed to save annotation to cloud:', e);
  }
}

export async function removeAnnotationFromCloud(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'annotations', id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Failed to delete annotation from cloud:', e);
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
    console.warn('Failed to fetch custom books from Firestore:', e);
    return [];
  }
}

export async function saveCustomBookToCloud(book: Book): Promise<void> {
  try {
    const docRef = doc(db, 'custom_books', book.id);
    await setDoc(docRef, book);
  } catch (e) {
    console.warn('Failed to save custom book to Firestore:', e);
  }
}

export async function deleteCustomBookFromCloud(bookId: string): Promise<void> {
  try {
    const docRef = doc(db, 'custom_books', bookId);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Failed to delete custom book from Firestore:', e);
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
    console.warn('Failed to sync pilot profile to Firestore:', e);
  }
}
