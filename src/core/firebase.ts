import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { NexusModule } from './types';
import { eventBus } from './event-bus';

// Initialize Firebase SDK
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { onAuthStateChanged };
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    eventBus.emit('log', {
      tag: 'AUTH',
      message: `USER IDENTIFIED: ${result.user.email}`,
      level: 'success',
    });
    return result.user;
  } catch (err: any) {
    eventBus.emit('log', {
      tag: 'AUTH ERROR',
      message: err.message || 'Google Auth aborted',
      level: 'error',
    });
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
  eventBus.emit('log', {
    tag: 'AUTH',
    message: 'USER SESSION TERMINATED',
    level: 'info',
  });
}

// Sync modules to Firestore if user is authenticated
export async function syncModuleToCloud(userId: string, module: NexusModule): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'modules', module.id);
    // Don't sync huge raw zip binaries directly, sync metadata & images
    const modulePayload = {
      id: module.id,
      name: module.name,
      version: module.version,
      description: module.description,
      entry: module.entry,
      icon: module.icon || '',
      images: module.images.slice(0, 4),
      accent: module.accent,
      status: module.status,
      node: module.node,
      category: module.category,
      installedAt: module.installedAt,
      packageType: module.packageType,
      updatedAt: serverTimestamp(),
    };
    await setDoc(docRef, modulePayload, { merge: true });
  } catch (e: any) {
    console.warn('[FIRESTORE SYNC ERROR]', e);
  }
}

export async function deleteModuleFromCloud(userId: string, moduleId: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'modules', moduleId);
    await deleteDoc(docRef);
  } catch (e: any) {
    console.warn('[FIRESTORE DELETE ERROR]', e);
  }
}

export async function fetchUserModulesFromCloud(userId: string): Promise<Partial<NexusModule>[]> {
  try {
    const snapshot = await getDocs(collection(db, 'users', userId, 'modules'));
    const modules: Partial<NexusModule>[] = [];
    snapshot.forEach((doc) => {
      modules.push(doc.data() as Partial<NexusModule>);
    });
    return modules;
  } catch (e) {
    console.warn('[FIRESTORE FETCH ERROR]', e);
    return [];
  }
}
