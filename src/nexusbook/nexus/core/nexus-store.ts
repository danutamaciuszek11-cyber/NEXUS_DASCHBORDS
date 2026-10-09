/**
 * NEXUS CENTRALIZED STATE MANAGEMENT SYSTEM
 * =======================================================
 * Zcentralizowany, przewidywalny magazyn stanu aplikacji Nexus.
 * Łączy architekturę Zustand (reaktywność React) z mostem zdarzeń Pub/Sub (NexusBus)
 * oraz rejestratorem telemetrii (NexusLogger).
 * 
 * Umożliwia modułom (zarówno komponentom React, jak i mikro-węzłom Vanilla TS)
 * przewidywalny odczyt, subskrypcję i modyfikację stanu całego ekosystemu.
 */

import { create } from 'zustand';
import { PilotProfile, CreatorSoulProfile, Book, Category } from '../../types';
import { nexusBus } from './nexus-bus';
import { nexusLogger } from '../../services/loggerService';
import { 
  dockToNexus as dockToNexusFn, 
  DockingResult, 
  ProcessedBlock, 
  fetchLast10Blocks, 
  getProcessedBlocks 
} from '../../lib/nexusBnbDock';

export type NexusModalType = 
  | 'ECOSYSTEM_HUB'
  | 'DATABASE_STATUS'
  | 'DIAGNOSTICS'
  | 'SHORTCUTS'
  | 'EDITORIAL_STUDIO'
  | 'HTML_STUDIO'
  | 'HTML_WORLD_VIEWER'
  | 'ASSET_LIBRARY'
  | 'IMPORT'
  | 'EXPORT'
  | 'QUOTE_OF_DAY'
  | 'BNB_BLOCK_CHART'
  | 'REALTIME_COLLAB'
  | 'KINO_STUDIO';

export type DiagnosticsTabType = 'TELEMETRY' | 'NODE_TOKEN' | 'INTEGRATION' | 'ARCHIVE' | 'DIAGNOSTICS';

export interface BnbDockingState {
  status: 'ODŁĄCZONY' | 'DOKOWANIE' | 'SPLĄTANY' | 'BŁĄD_ŁĄCZA';
  nodeToken: string;
  chainId: number;
  blockNumber: string;
  address: string;
  oracle: string;
  frequency: string;
  fidelity: number;
  latencyMs?: number;
  balanceBNB?: string;
  timestamp: number;
}

export interface NexusState {
  // 1. Stan Dokowania BNB Chain & Konsensusu Węzła
  bnbDocking: BnbDockingState;
  isDatabaseConnected: boolean;

  // 2. Tożsamość Pilota i Creator Soul
  pilotProfile: PilotProfile | null;
  creatorSoulProfile: CreatorSoulProfile | null;

  // 3. Kontekst Czytnika i Treści
  activeBook: Book | null;
  activeChapterId: string | null;
  activeCategory: Category | string;
  searchQuery: string;
  soundEnabled: boolean;

  // 4. Przestrzeń Robocza i Modale
  activeModal: NexusModalType | null;
  modalPayload: any;
  diagnosticsTab: DiagnosticsTabType;

  // 5. Telemetria & Błędy
  errorCount: number;
  totalBusEvents: number;

  // 6. Historia Przetworzonych Bloków (Recharts Graph Engine)
  processedBlocks: ProcessedBlock[];
  isFetchingBlocks: boolean;

  // ==========================================
  // PREDICTABLE STATE ACTIONS (DISPATCHERS)
  // ==========================================

  // Akcje Sieciowe & BNB Chain
  dockBnbNode: (nodeToken?: string) => Promise<DockingResult>;
  disconnectBnbNode: () => void;
  setDatabaseConnected: (connected: boolean) => void;
  setBnbDockingState: (patch: Partial<BnbDockingState>) => void;
  fetchProcessedBlocks: () => Promise<ProcessedBlock[]>;

  // Akcje Tożsamości
  setPilotProfile: (profile: PilotProfile | null) => void;
  setCreatorSoulProfile: (profile: CreatorSoulProfile | null) => void;

  // Akcje Czytnika i Audio
  setActiveBook: (book: Book | null, chapterId?: string | null) => void;
  setActiveCategory: (category: Category | string) => void;
  setSearchQuery: (query: string) => void;
  setSoundEnabled: (enabled: boolean) => void;

  // Akcje Modali i Workspace
  openModal: (modal: NexusModalType, payload?: any) => void;
  closeModal: () => void;
  setDiagnosticsTab: (tab: DiagnosticsTabType) => void;
  openDiagnostics: (tab?: DiagnosticsTabType) => void;
  openEcosystemHub: () => void;
  openBlockChart: () => void;
  openCollabHub: (tab?: 'dashboard' | 'kino' | 'scribe') => void;
  openKinoStudio: () => void;

  // Akcje Telemetrii
  updateErrorCount: (count: number) => void;
  incrementEventCount: () => void;
  
  // Reset stanu roboczego
  resetWorkspace: () => void;
}

// Inicjalizacja profili z pamięci trwałej (Local-First Sovereign Cache)
const initialCreatorSoul: CreatorSoulProfile | null = (() => {
  try {
    const saved = localStorage.getItem('nexusbook_creator_soul_profile');
    if (saved) return JSON.parse(saved);
  } catch {
    // safe fallback
  }
  return null;
})();

const initialPilotProfile: PilotProfile | null = (() => {
  try {
    const saved = localStorage.getItem('nexusbook_quantum_pilot_profile');
    if (saved) return JSON.parse(saved);
  } catch {
    // safe fallback
  }
  return null;
})();

const initialSoundEnabled = (() => {
  try {
    const saved = localStorage.getItem('nexus_user_config');
    if (saved) return JSON.parse(saved).soundEnabled ?? true;
  } catch {
    // safe fallback
  }
  return true;
})();

/**
 * Główny Zcentralizowany Magazyn Stanu Nexus (Zustand Store)
 */
export const useNexusStore = create<NexusState>((set, get) => ({
  // Stan początkowy
  bnbDocking: {
    status: 'ODŁĄCZONY',
    nodeToken: 'NEXUS-BNB-734LLM-NODE',
    chainId: 56,
    blockNumber: '0',
    address: '0x6c5755e9e278fA2bC3A49f84974724c88e68b1B7',
    oracle: 'APRO-ORACLE-ACTIVE',
    frequency: '528Hz',
    fidelity: 0.9998,
    latencyMs: 0,
    balanceBNB: '0.00',
    timestamp: Date.now()
  },
  isDatabaseConnected: false,

  pilotProfile: initialPilotProfile,
  creatorSoulProfile: initialCreatorSoul,

  activeBook: null,
  activeChapterId: null,
  activeCategory: 'Wszystkie',
  searchQuery: '',
  soundEnabled: initialSoundEnabled,

  activeModal: null,
  modalPayload: null,
  diagnosticsTab: 'DIAGNOSTICS',

  errorCount: 0,
  totalBusEvents: 0,

  processedBlocks: getProcessedBlocks(),
  isFetchingBlocks: false,

  // ==========================================
  // DISPATCHERS / MUTATIONS
  // ==========================================

  dockBnbNode: async (customNodeToken?: string) => {
    const targetToken = customNodeToken || get().bnbDocking.nodeToken || 'NEXUS-BNB-734LLM-NODE';
    
    // Ustaw stan na DOKOWANIE
    set((state) => ({
      bnbDocking: {
        ...state.bnbDocking,
        status: 'DOKOWANIE',
        nodeToken: targetToken,
        timestamp: Date.now()
      }
    }));

    nexusBus.emit('nexus:state_change', 'store', {
      key: 'bnbDocking.status',
      value: 'DOKOWANIE',
      nodeToken: targetToken
    });

    nexusLogger.info('BLOCKCHAIN', 'NexusStore', `Inicjalizacja dokowania do węzła BNB: ${targetToken}`);

    try {
      const result = await dockToNexusFn(targetToken);

      const updatedBnbState: BnbDockingState = {
        status: result.status,
        nodeToken: result.nodeToken || targetToken,
        chainId: result.chainId || 56,
        blockNumber: String(result.blockNumber || '0'),
        address: result.address || '0x6c5755e9e278fA2bC3A49f84974724c88e68b1B7',
        oracle: result.oracle || 'APRO-ORACLE-ACTIVE',
        frequency: result.frequency || '528Hz',
        fidelity: result.fidelity ?? 0.9998,
        latencyMs: result.latencyMs,
        balanceBNB: result.balanceBNB,
        timestamp: result.timestamp || Date.now()
      };

      set({ bnbDocking: updatedBnbState });

      // Emisja do mostu zdarzeń Pub/Sub
      nexusBus.emit('nexus:state_change', 'store', {
        key: 'bnbDocking',
        value: updatedBnbState
      });

      nexusBus.emit('nexus:bnb_docked', 'store', updatedBnbState);

      nexusLogger.info('BLOCKCHAIN', 'NexusStore', `Węzeł splątany pomyślnie z blokiem #${updatedBnbState.blockNumber}`, updatedBnbState);

      return result;
    } catch (err: any) {
      const errorState: BnbDockingState = {
        ...get().bnbDocking,
        status: 'BŁĄD_ŁĄCZA',
        timestamp: Date.now()
      };

      set({ bnbDocking: errorState });

      nexusBus.emit('nexus:state_change', 'store', {
        key: 'bnbDocking.status',
        value: 'BŁĄD_ŁĄCZA',
        error: err?.message
      });

      nexusLogger.error('BLOCKCHAIN', 'NexusStore', 'Błąd podczas dokowania węzła BNB', err);
      throw err;
    }
  },

  disconnectBnbNode: () => {
    set((state) => ({
      bnbDocking: {
        ...state.bnbDocking,
        status: 'ODŁĄCZONY',
        timestamp: Date.now()
      }
    }));

    nexusBus.emit('nexus:state_change', 'store', {
      key: 'bnbDocking.status',
      value: 'ODŁĄCZONY'
    });

    nexusLogger.info('BLOCKCHAIN', 'NexusStore', 'Węzeł BNB został rozłączony z konsensusem');
  },

  setDatabaseConnected: (connected: boolean) => {
    if (get().isDatabaseConnected === connected) return;
    set({ isDatabaseConnected: connected });

    nexusBus.emit('nexus:state_change', 'store', {
      key: 'isDatabaseConnected',
      value: connected
    });
  },

  setBnbDockingState: (patch: Partial<BnbDockingState>) => {
    set((state) => ({
      bnbDocking: { ...state.bnbDocking, ...patch }
    }));
  },

  setPilotProfile: (profile: PilotProfile | null) => {
    try {
      if (profile) {
        localStorage.setItem('nexusbook_quantum_pilot_profile', JSON.stringify(profile));
      } else {
        localStorage.removeItem('nexusbook_quantum_pilot_profile');
      }
    } catch (e) {
      nexusLogger.warn('STORAGE', 'NexusStore', 'Błąd zapisu profilu pilota w localStorage', e);
    }

    set({ pilotProfile: profile });

    nexusBus.emit('nexus:state_change', 'store', {
      key: 'pilotProfile',
      value: profile
    });
    nexusBus.emit('nexus:pilot_updated', 'store', profile);
  },

  setCreatorSoulProfile: (profile: CreatorSoulProfile | null) => {
    try {
      if (profile) {
        localStorage.setItem('nexusbook_creator_soul_profile', JSON.stringify(profile));
      } else {
        localStorage.removeItem('nexusbook_creator_soul_profile');
      }
    } catch (e) {
      nexusLogger.warn('STORAGE', 'NexusStore', 'Błąd zapisu profilu Creator Soul w localStorage', e);
    }

    set({ creatorSoulProfile: profile });

    nexusBus.emit('nexus:state_change', 'store', {
      key: 'creatorSoulProfile',
      value: profile
    });
  },

  setActiveBook: (book: Book | null, chapterId: string | null = null) => {
    set({ activeBook: book, activeChapterId: chapterId });

    nexusBus.emit('nexus:state_change', 'store', {
      key: 'activeBook',
      bookId: book?.id,
      chapterId
    });
  },

  setActiveCategory: (category: Category | string) => {
    set({ activeCategory: category });

    nexusBus.emit('nexus:state_change', 'store', {
      key: 'activeCategory',
      value: category
    });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setSoundEnabled: (enabled: boolean) => {
    try {
      const current = JSON.parse(localStorage.getItem('nexus_user_config') || '{}');
      localStorage.setItem('nexus_user_config', JSON.stringify({ ...current, soundEnabled: enabled }));
    } catch {
      // safe fallback
    }

    set({ soundEnabled: enabled });

    nexusBus.emit('nexus:state_change', 'store', {
      key: 'soundEnabled',
      value: enabled
    });
  },

  openModal: (modal: NexusModalType, payload: any = null) => {
    set({ activeModal: modal, modalPayload: payload });

    nexusBus.emit('nexus:modal_opened', 'store', { modal, payload });
  },

  closeModal: () => {
    const prev = get().activeModal;
    set({ activeModal: null, modalPayload: null });

    if (prev) {
      nexusBus.emit('nexus:modal_closed', 'store', { modal: prev });
    }
  },

  setDiagnosticsTab: (tab: DiagnosticsTabType) => {
    set({ diagnosticsTab: tab });
  },

  openDiagnostics: (tab: DiagnosticsTabType = 'DIAGNOSTICS') => {
    set({ 
      activeModal: 'DATABASE_STATUS', 
      diagnosticsTab: tab 
    });
    nexusBus.emit('nexus:modal_opened', 'store', { modal: 'DATABASE_STATUS', tab });
  },

  openEcosystemHub: () => {
    set({ activeModal: 'ECOSYSTEM_HUB' });
    nexusBus.emit('nexus:modal_opened', 'store', { modal: 'ECOSYSTEM_HUB' });
  },

  fetchProcessedBlocks: async () => {
    set({ isFetchingBlocks: true });
    try {
      const blocks = await fetchLast10Blocks();
      set({ processedBlocks: blocks, isFetchingBlocks: false });
      nexusBus.emit('nexus:state_change', 'store', {
        key: 'processedBlocks',
        count: blocks.length,
        latest: blocks[blocks.length - 1]?.blockNumber
      });
      return blocks;
    } catch (err) {
      set({ isFetchingBlocks: false });
      throw err;
    }
  },

  openBlockChart: () => {
    set({ activeModal: 'BNB_BLOCK_CHART' });
    nexusBus.emit('nexus:modal_opened', 'store', { modal: 'BNB_BLOCK_CHART' });
    get().fetchProcessedBlocks().catch(() => {});
  },

  openCollabHub: (tab: 'dashboard' | 'kino' | 'scribe' = 'dashboard') => {
    set({ activeModal: 'REALTIME_COLLAB', modalPayload: { defaultTab: tab } });
    nexusBus.emit('nexus:modal_opened', 'store', { modal: 'REALTIME_COLLAB', tab });
  },

  openKinoStudio: () => {
    set({ activeModal: 'KINO_STUDIO' });
    nexusBus.emit('nexus:modal_opened', 'store', { modal: 'KINO_STUDIO' });
  },

  updateErrorCount: (count: number) => {
    set({ errorCount: count });
  },

  incrementEventCount: () => {
    set((state) => ({ totalBusEvents: state.totalBusEvents + 1 }));
  },

  resetWorkspace: () => {
    set({
      activeModal: null,
      modalPayload: null,
      activeBook: null,
      activeChapterId: null,
      searchQuery: ''
    });
  }
}));

/**
 * Vanilla API dla modułów nienależących do React (np. NexusNode, usugi TS, worker, konsola deweloperska)
 */
export const nexusStore = {
  getState: useNexusStore.getState,
  setState: useNexusStore.setState,
  subscribe: useNexusStore.subscribe,
  
  // Bezpośrednie wywołania akcji
  dockBnbNode: (nodeToken?: string) => useNexusStore.getState().dockBnbNode(nodeToken),
  disconnectBnbNode: () => useNexusStore.getState().disconnectBnbNode(),
  setPilotProfile: (p: PilotProfile | null) => useNexusStore.getState().setPilotProfile(p),
  openModal: (modal: NexusModalType, payload?: any) => useNexusStore.getState().openModal(modal, payload),
  closeModal: () => useNexusStore.getState().closeModal(),
  openDiagnostics: (tab?: DiagnosticsTabType) => useNexusStore.getState().openDiagnostics(tab),
  openBlockChart: () => useNexusStore.getState().openBlockChart(),
  openCollabHub: (tab?: 'dashboard' | 'kino' | 'scribe') => useNexusStore.getState().openCollabHub(tab),
  openKinoStudio: () => useNexusStore.getState().openKinoStudio(),
  fetchProcessedBlocks: () => useNexusStore.getState().fetchProcessedBlocks(),
};

// =========================================================================
// BI-DIRECTIONAL EVENT BRIDGE: NEXUS BUS <-> CENTRALIZED STORE
// =========================================================================

// 1. Zwiększanie licznika zdarzeń przy każdym pulsie w magistrali
nexusBus.subscribe('*', () => {
  useNexusStore.getState().incrementEventCount();
}, 'nexus-store-event-counter');

// 2. Nasłuch na żądania dokowania z dowolnego klocka zewnętrznego
nexusBus.subscribe('nexus:request_dock', (event) => {
  const token = event.payload?.nodeToken;
  useNexusStore.getState().dockBnbNode(token).catch(() => {});
}, 'nexus-store-dock-listener');

// 3. Nasłuch na żądania otwarcia modali ze strony mikro-węzłów
nexusBus.subscribe('nexus:request_modal', (event) => {
  const { modal, payload } = event.payload || {};
  if (modal) {
    useNexusStore.getState().openModal(modal, payload);
  }
}, 'nexus-store-modal-listener');

// 4. Synchronizacja licznika błędów z loggerem
nexusLogger.subscribe(() => {
  const stats = nexusLogger.getStats();
  useNexusStore.getState().updateErrorCount(stats.errorCount + stats.fatalCount);
});

// Udostępnienie instancji w globalnym oknie przeglądarki dla celów diagnostycznych i konsoli
if (typeof window !== 'undefined') {
  (window as any).__NEXUS_STORE__ = nexusStore;
  (window as any).__NEXUS_BUS__ = nexusBus;
}
