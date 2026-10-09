import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
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

export type NexusAuthState = 'AUTH_LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'AUTH_ERROR';

export interface NexusAuthDiagnosticsData {
  provider: string;
  initialized: 'OK' | 'FAILED';
  configStatus: 'OK' | 'MISSING_CONFIG';
  projectId: string;
  authDomain: string;
  currentDomain: string;
  isDomainAuthorizedGuess: boolean;
  currentUser: string;
  userUid: string | null;
  authState: NexusAuthState;
  lastEvent: string;
  lastError: string | null;
  lastErrorFriendly: string | null;
  timestamp: string;
}

// Log initialization event
eventBus.emit('log', {
  tag: 'AUTH',
  message: '[AUTH] INITIALIZING Firebase Authentication SDK...',
  level: 'info',
});

// 1. Initialize Firebase SDK once
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const googleProvider = new GoogleAuthProvider();

// Configure persistence to keep user authenticated across browser refreshes
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('[AUTH PERSISTENCE]', err);
  });
}

// Global in-memory diagnostics state
let diagnostics: NexusAuthDiagnosticsData = {
  provider: 'Firebase Authentication',
  initialized: 'OK',
  configStatus: Boolean(firebaseConfig.apiKey && firebaseConfig.projectId) ? 'OK' : 'MISSING_CONFIG',
  projectId: firebaseConfig.projectId || 'UNKNOWN',
  authDomain: firebaseConfig.authDomain || 'UNKNOWN',
  currentDomain: typeof window !== 'undefined' ? window.location.hostname : 'localhost',
  isDomainAuthorizedGuess: typeof window !== 'undefined'
    ? (window.location.hostname === 'localhost' ||
       window.location.hostname === '127.0.0.1' ||
       window.location.hostname.endsWith('firebaseapp.com') ||
       window.location.hostname.endsWith('web.app'))
    : true,
  currentUser: 'UNAUTHENTICATED',
  userUid: null,
  authState: 'AUTH_LOADING',
  lastEvent: '[AUTH] INITIALIZING',
  lastError: null,
  lastErrorFriendly: null,
  timestamp: new Date().toISOString(),
};

function updateDiagnostics(partial: Partial<NexusAuthDiagnosticsData>) {
  diagnostics = {
    ...diagnostics,
    ...partial,
    timestamp: new Date().toISOString(),
  };
  eventBus.emit('auth:diagnostics', diagnostics);
}

export function getAuthDiagnostics(): NexusAuthDiagnosticsData {
  return { ...diagnostics };
}

// Emit Provider Ready
eventBus.emit('log', {
  tag: 'AUTH',
  message: '[AUTH] PROVIDER READY: Firebase Client SDK online.',
  level: 'info',
});
updateDiagnostics({ lastEvent: '[AUTH] PROVIDER READY' });

export function mapAuthError(code: string, message?: string): { friendly: string; technical: string } {
  const technical = code || 'auth/unknown-error';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return {
        friendly: 'LOGOWANIE NIEUDANE: Nieprawidłowy e-mail lub hasło.',
        technical,
      };
    case 'auth/operation-not-allowed':
      return {
        friendly: 'METODA LOGOWANIA WYŁĄCZONA: Dostawca (Email/Password) nie jest włączony w konsoli Firebase.',
        technical,
      };
    case 'auth/unauthorized-domain':
      return {
        friendly: `DOMENA NIEAUTORYZOWANA: Domena ${typeof window !== 'undefined' ? window.location.hostname : 'bieżąca'} nie jest dodana do 'Authorized domains' w konsoli Firebase Authentication.`,
        technical,
      };
    case 'auth/popup-blocked':
      return {
        friendly: 'OKNO POPUP ZABLOKOWANE: Przeglądarka zablokowała wyskakujące okno logowania Google. Zezwól na wyskakujące okienka.',
        technical,
      };
    case 'auth/popup-closed-by-user':
      return {
        friendly: 'LOGOWANIE ANULOWANE: Okno uwierzytelniania zostało zamknięte przez użytkownika.',
        technical,
      };
    case 'auth/email-already-in-use':
      return {
        friendly: 'KONTO ISTNIEJE: Ten adres e-mail jest już zarejestrowany w systemie.',
        technical,
      };
    case 'auth/weak-password':
      return {
        friendly: 'SŁABE HASŁO: Hasło musi składać się z co najmniej 6 znaków.',
        technical,
      };
    case 'auth/invalid-email':
      return {
        friendly: 'NIEPRAWIDŁOWY E-MAIL: Wprowadzono niepoprawny format adresu e-mail.',
        technical,
      };
    case 'auth/network-request-failed':
      return {
        friendly: 'BŁĄD SIECI: Brak połączenia z serwerami uwierzytelniania Firebase.',
        technical,
      };
    case 'auth/too-many-requests':
      return {
        friendly: 'ZBYT WIELE PRÓB: Konto zostało tymczasowo zablokowane ze względów bezpieczeństwa. Spróbuj później.',
        technical,
      };
    default:
      return {
        friendly: `BŁĄD UWIERZYTELNIANIA: ${message || 'Wystąpił błąd podczas logowania.'}`,
        technical,
      };
  }
}

/**
 * Real Email & Password Sign-In
 */
export async function signInWithEmail(email: string, pass: string): Promise<{ user: User | null; error?: { friendly: string; technical: string } }> {
  eventBus.emit('log', {
    tag: 'AUTH',
    message: `[AUTH] LOGIN ATTEMPT: Email credentials for ${email}`,
    level: 'info',
  });
  updateDiagnostics({
    lastEvent: '[AUTH] LOGIN ATTEMPT',
    lastError: null,
    lastErrorFriendly: null,
  });

  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    eventBus.emit('log', {
      tag: 'AUTH',
      message: `[AUTH] LOGIN SUCCESS: User ${cred.user.email} (${cred.user.uid}) authenticated.`,
      level: 'success',
    });
    updateDiagnostics({
      currentUser: cred.user.email || cred.user.uid,
      userUid: cred.user.uid,
      authState: 'AUTHENTICATED',
      lastEvent: '[AUTH] LOGIN SUCCESS',
      lastError: null,
      lastErrorFriendly: null,
    });
    return { user: cred.user };
  } catch (err: any) {
    const mapped = mapAuthError(err.code, err.message);
    eventBus.emit('log', {
      tag: 'AUTH',
      message: `[AUTH] LOGIN FAILED: ${mapped.technical} - ${mapped.friendly}`,
      level: 'error',
    });
    updateDiagnostics({
      authState: 'AUTH_ERROR',
      lastEvent: '[AUTH] LOGIN FAILED',
      lastError: mapped.technical,
      lastErrorFriendly: mapped.friendly,
    });
    return { user: null, error: mapped };
  }
}

/**
 * Real Email & Password Registration
 */
export async function signUpWithEmail(email: string, pass: string): Promise<{ user: User | null; error?: { friendly: string; technical: string } }> {
  eventBus.emit('log', {
    tag: 'AUTH',
    message: `[AUTH] REGISTRATION ATTEMPT: New account for ${email}`,
    level: 'info',
  });
  updateDiagnostics({
    lastEvent: '[AUTH] LOGIN ATTEMPT',
    lastError: null,
    lastErrorFriendly: null,
  });

  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    eventBus.emit('log', {
      tag: 'AUTH',
      message: `[AUTH] LOGIN SUCCESS: Account created for ${cred.user.email}`,
      level: 'success',
    });
    updateDiagnostics({
      currentUser: cred.user.email || cred.user.uid,
      userUid: cred.user.uid,
      authState: 'AUTHENTICATED',
      lastEvent: '[AUTH] LOGIN SUCCESS',
      lastError: null,
      lastErrorFriendly: null,
    });
    return { user: cred.user };
  } catch (err: any) {
    const mapped = mapAuthError(err.code, err.message);
    eventBus.emit('log', {
      tag: 'AUTH',
      message: `[AUTH] LOGIN FAILED: ${mapped.technical} - ${mapped.friendly}`,
      level: 'error',
    });
    updateDiagnostics({
      authState: 'AUTH_ERROR',
      lastEvent: '[AUTH] LOGIN FAILED',
      lastError: mapped.technical,
      lastErrorFriendly: mapped.friendly,
    });
    return { user: null, error: mapped };
  }
}

/**
 * Real Google Sign-In with popup
 */
export async function loginWithGoogle(): Promise<{ user: User | null; error?: { friendly: string; technical: string } }> {
  eventBus.emit('log', {
    tag: 'AUTH',
    message: '[AUTH] LOGIN ATTEMPT: Initiating Google OAuth popup flow...',
    level: 'info',
  });
  updateDiagnostics({
    lastEvent: '[AUTH] LOGIN ATTEMPT',
    lastError: null,
    lastErrorFriendly: null,
  });

  try {
    const result = await signInWithPopup(auth, googleProvider);
    eventBus.emit('log', {
      tag: 'AUTH',
      message: `[AUTH] LOGIN SUCCESS: Google Account ${result.user.email} (${result.user.uid})`,
      level: 'success',
    });
    updateDiagnostics({
      currentUser: result.user.email || result.user.uid,
      userUid: result.user.uid,
      authState: 'AUTHENTICATED',
      lastEvent: '[AUTH] LOGIN SUCCESS',
      lastError: null,
      lastErrorFriendly: null,
    });
    return { user: result.user };
  } catch (err: any) {
    const mapped = mapAuthError(err.code, err.message);
    eventBus.emit('log', {
      tag: 'AUTH',
      message: `[AUTH] LOGIN FAILED: ${mapped.technical} - ${mapped.friendly}`,
      level: 'error',
    });
    updateDiagnostics({
      authState: 'AUTH_ERROR',
      lastEvent: '[AUTH] LOGIN FAILED',
      lastError: mapped.technical,
      lastErrorFriendly: mapped.friendly,
    });
    return { user: null, error: mapped };
  }
}

/**
 * Real Logout function
 */
export async function logoutUser(): Promise<void> {
  eventBus.emit('log', {
    tag: 'AUTH',
    message: '[AUTH] LOGOUT: Terminating session on Firebase...',
    level: 'info',
  });
  await signOut(auth);
  eventBus.emit('log', {
    tag: 'AUTH',
    message: '[AUTH] LOGOUT: Session terminated successfully.',
    level: 'success',
  });
  updateDiagnostics({
    currentUser: 'UNAUTHENTICATED',
    userUid: null,
    authState: 'UNAUTHENTICATED',
    lastEvent: '[AUTH] LOGOUT',
    lastError: null,
    lastErrorFriendly: null,
  });
}

/**
 * Global Real Auth State Listener Wrapper
 */
export function subscribeToAuth(
  onState: (user: User | null, state: NexusAuthState, diag: NexusAuthDiagnosticsData) => void
): () => void {
  let initialPass = true;
  return onAuthStateChanged(
    auth,
    (user) => {
      const state: NexusAuthState = user ? 'AUTHENTICATED' : 'UNAUTHENTICATED';
      const eventName = initialPass
        ? (user ? '[AUTH] SESSION RESTORED' : '[AUTH] PROVIDER READY')
        : (user ? '[AUTH] LOGIN SUCCESS' : '[AUTH] LOGOUT');

      if (initialPass && user) {
        eventBus.emit('log', {
          tag: 'AUTH',
          message: `[AUTH] SESSION RESTORED: User ${user.email || user.uid} session active from local persistence.`,
          level: 'success',
        });
      }

      initialPass = false;

      updateDiagnostics({
        currentUser: user ? (user.email || user.uid) : 'UNAUTHENTICATED',
        userUid: user ? user.uid : null,
        authState: state,
        lastEvent: eventName,
      });

      onState(user, state, getAuthDiagnostics());
    },
    (err: any) => {
      const mapped = mapAuthError(err.code, err.message);
      updateDiagnostics({
        authState: 'AUTH_ERROR',
        lastEvent: '[AUTH] LOGIN FAILED',
        lastError: mapped.technical,
        lastErrorFriendly: mapped.friendly,
      });
      onState(null, 'AUTH_ERROR', getAuthDiagnostics());
    }
  );
}

export { onAuthStateChanged };

// Firestore synchronization for authenticated users
export async function syncModuleToCloud(userId: string, module: NexusModule): Promise<void> {
  if (!userId || userId === 'UNAUTHENTICATED') return;
  try {
    const docRef = doc(db, 'users', userId, 'modules', module.id);
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
  if (!userId || userId === 'UNAUTHENTICATED') return;
  try {
    const docRef = doc(db, 'users', userId, 'modules', moduleId);
    await deleteDoc(docRef);
  } catch (e: any) {
    console.warn('[FIRESTORE DELETE ERROR]', e);
  }
}

export async function fetchUserModulesFromCloud(userId: string): Promise<Partial<NexusModule>[]> {
  if (!userId || userId === 'UNAUTHENTICATED') return [];
  try {
    const snapshot = await getDocs(collection(db, 'users', userId, 'modules'));
    const modules: Partial<NexusModule>[] = [];
    snapshot.forEach((d) => {
      modules.push(d.data() as Partial<NexusModule>);
    });
    return modules;
  } catch (e) {
    console.warn('[FIRESTORE FETCH ERROR]', e);
    return [];
  }
}
