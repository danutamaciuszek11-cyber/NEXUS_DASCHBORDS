import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  limit,
  where,
  Firestore
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(firebaseApp);

// Initialize Firestore (handling custom databaseId if configured)
export const db: Firestore = (firebaseConfig as any).firestoreDatabaseId
  ? getFirestore(firebaseApp, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(firebaseApp);

export interface DatabaseState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  currentUser: User | null;
  databaseId: string;
  projectId: string;
  nodeToken: string;
  syncedAt: number | null;
}

// Initial state
let dbState: DatabaseState = {
  isConnected: false,
  isConnecting: true,
  error: null,
  currentUser: null,
  databaseId: (firebaseConfig as any).firestoreDatabaseId || '(default)',
  projectId: firebaseConfig.projectId || '',
  nodeToken: 'NEXUS-BNB-734LLM-NODE',
  syncedAt: null,
};

const listeners = new Set<(state: DatabaseState) => void>();

export function getDatabaseState(): DatabaseState {
  return { ...dbState };
}

export function subscribeDatabaseState(callback: (state: DatabaseState) => void): () => void {
  listeners.add(callback);
  callback(getDatabaseState());
  return () => {
    listeners.delete(callback);
  };
}

function notifyStateChange() {
  const current = getDatabaseState();
  listeners.forEach(cb => {
    try {
      cb(current);
    } catch (e) {
      console.error('Error in database state subscriber:', e);
    }
  });
}

// Auto-authenticate anonymously and ping database telemetry
let initPromise: Promise<boolean> | null = null;

export async function initializeDatabaseConnection(): Promise<boolean> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      dbState = { ...dbState, isConnecting: true, error: null };
      notifyStateChange();

      // Listen for auth state
      onAuthStateChanged(auth, (user) => {
        dbState = { ...dbState, currentUser: user };
        notifyStateChange();
      });

      // Sign in anonymously if not signed in
      if (!auth.currentUser) {
        try {
          await signInAnonymously(auth);
        } catch (authErr: any) {
          console.warn('Anonymous auth note (continuing with direct Firestore access):', authErr);
        }
      }

      // Ping telemetry document in Firestore to test write/read connection and register Node Token
      const telemetryDocRef = doc(db, 'system_telemetry', 'nexus_live_node');
      const nodeAuthRef = doc(db, 'node_authorizations', 'NEXUS-BNB-734LLM-NODE');
      const now = Date.now();
      
      await setDoc(telemetryDocRef, {
        status: 'ONLINE',
        lastConnectedAt: now,
        databaseId: dbState.databaseId,
        projectId: dbState.projectId,
        nodeToken: 'NEXUS-BNB-734LLM-NODE',
        network: 'BNB-734LLM',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'ServerNode',
      }, { merge: true });

      // Ensure Node Authorization descriptor exists in Firestore
      await setDoc(nodeAuthRef, {
        nodeToken: 'NEXUS-BNB-734LLM-NODE',
        role: 'MASTER_ARCHITECT_CORE_NODE',
        status: 'AUTHORIZED',
        network: 'BNB Smart Chain (734LLM Matrix)',
        ecosystem: 'ETERNIVERSE / NEXUS',
        clearanceLevel: 'LEVEL_OMEGA_ARCHITECT',
        authorizedServices: [
          'BELLAS_AI',
          'MADZIA_SHOP',
          'MADZIA_AI',
          'AEGIS_DEFENSE',
          'NEURAL_LINK',
          'NEXUS_OS',
          'NEXUS_LEX'
        ],
        contracts: [
          'NEXUS_PASS_ORACLE',
          'CREATOR_SOUL_ENGINE_ESCROW',
          'NEXUS_AGENT_ESCROW_DISPATCH'
        ],
        lastPingAt: now,
        verifiedAt: now
      }, { merge: true });

      dbState = {
        ...dbState,
        isConnected: true,
        isConnecting: false,
        error: null,
        nodeToken: 'NEXUS-BNB-734LLM-NODE',
        syncedAt: now,
      };
      notifyStateChange();
      return true;
    } catch (err: any) {
      console.error('Firestore connection error:', err);
      dbState = {
        ...dbState,
        isConnected: false,
        isConnecting: false,
        error: err?.message || 'Nie udało się nawiązać połączenia z bazą danych.',
      };
      notifyStateChange();
      return false;
    }
  })();

  return initPromise;
}

export {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  where
};
