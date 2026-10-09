import './index.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Sparkles, 
  Calendar, 
  BarChart2, 
  Sliders, 
  Shuffle, 
  Menu, 
  X, 
  Layers, 
  Terminal, 
  Grid, 
  CheckCircle2, 
  Zap,
  Tag,
  Clock,
  ArrowUp,
  Plus,
  Bookmark,
  FolderPlus
} from 'lucide-react';
import { Book, SeekerId, Language, Category, UserDashboardConfig, SystemStats, BookCollection, PilotProfile, CreatorSoulProfile, ChapterBookmark } from './types';
import { SAMPLE_BOOKS, SEEKERS_CONFIG, INITIAL_SYSTEM_STATS } from './data/booksData';
import { INITIAL_COLLECTIONS } from './data/collectionsData';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BookCard } from './components/BookCard';
import { BookDetailModal } from './components/BookDetailModal';
import { FullscreenReader } from './components/FullscreenReader';
import { AudioPlayerWidget } from './components/AudioPlayerWidget';
import { PDFViewerModal } from './components/PDFViewerModal';
import { TimelineView } from './components/TimelineView';
import { StatsDashboard } from './components/StatsDashboard';
import { CustomDashboardModal } from './components/CustomDashboardModal';
import { CollectionsModal } from './components/CollectionsModal';
import { QuoteOfDayModal } from './components/QuoteOfDayModal';
import { QRModal } from './components/QRModal';
import { QuantumLoginModal } from './components/QuantumLoginModal';
import { NeuralContentArchitectModal } from './components/NeuralContentArchitectModal';
import { CreatorSoulEngineModal } from './components/CreatorSoulEngineModal';
import { HtmlWorldStudioModal } from './components/HtmlWorldStudioModal';
import { HtmlWorldViewerModal } from './components/HtmlWorldViewerModal';
import { BookImportModal } from './components/BookImportModal';
import { AuthorAssetLibraryModal } from './components/assetLibrary/AuthorAssetLibraryModal';
import { NexusBookEditorialStudioModal } from './components/editorial/NexusBookEditorialStudioModal';
import { KinoStudioModal } from './components/KinoStudioModal';
import { RolePermissionModal } from './components/RolePermissionModal';
import { PREDEFINED_BELLAS_ROLES, BellasRoleId, hasPermission, NexusPermission } from './data/bellasRoles';
import { GuestRestrictionModal } from './components/GuestRestrictionModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { DatabaseStatusModal } from './components/DatabaseStatusModal';
import { NexusEcosystemHubModal } from './components/NexusEcosystemHubModal';
import { NexusCollabHubModal } from './components/NexusCollabHubModal';
import { OfflineBanner } from './components/OfflineBanner';
import { BiooperatorGuideWidget } from './components/BiooperatorGuideWidget';
import { safeSaveCustomBooks, getStoredCustomBooks, isBuiltInSampleBookId } from './utils/customBooksStorage';
import { dockToNexus } from './lib/nexusBnbDock';
import { soundFx } from './utils/audioSystem';
import { getStoredBookmarks, deleteBookmark } from './utils/bookmarkStorage';
import { getCachedBooksOffline } from './utils/offlineBookCache';
import { 
  initializeDatabaseConnection, 
  subscribeDatabaseState, 
  DatabaseState 
} from './lib/firebase';
import { 
  subscribeToCloudBookmarks, 
  removeBookmarkFromCloud, 
  fetchCustomBooksFromCloud, 
  saveCustomBookToCloud,
  savePilotProfileToCloud,
  syncCollectionToCloud,
  syncBookmarkToCloud
} from './utils/firestoreSync';
import { saveStoredBookmarks } from './utils/bookmarkStorage';
import { getStoredReadChapters, saveStoredReadChapters } from './utils/readingProgress';
import { NexusArchivePackage } from './utils/nexusArchive';
import { NexusErrorBoundary } from './components/NexusErrorBoundary';
import { NexusErrorToastContainer } from './components/NexusErrorToastContainer';
import { NexusBlockChartModal } from './components/NexusBlockChartModal';
import { nexusLogger } from './services/loggerService';
import { useNexusStore } from './store';

export default function NexusBookApp() {
  // Centralized Nexus Store Subscription
  const activeModal = useNexusStore((s) => s.activeModal);
  const closeModal = useNexusStore((s) => s.closeModal);
  const modalPayload = useNexusStore((s) => s.modalPayload);
  const [showCollabHub, setShowCollabHub] = useState(false);

  // Creator Soul Profile State
  const [creatorProfile, setCreatorProfile] = useState<CreatorSoulProfile | null>(() => {
    try {
      const saved = localStorage.getItem('nexusbook_creator_soul_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      nexusLogger.error('STORAGE', 'App', 'Błąd odczytu profilu Creator Soul', e);
    }
    return null;
  });
  const [showCreatorSoulEngine, setShowCreatorSoulEngine] = useState(false);

  const handleSaveCreatorProfile = (profile: CreatorSoulProfile) => {
    setCreatorProfile(profile);
    try {
      localStorage.setItem('nexusbook_creator_soul_profile', JSON.stringify(profile));
    } catch (e) {
      nexusLogger.error('STORAGE', 'App', 'Błąd zapisu profilu Creator Soul', e);
    }
  };


  // Quantum Pilot Authentication State
  const [pilotProfile, setPilotProfile] = useState<PilotProfile | null>(() => {
    try {
      const saved = localStorage.getItem('nexusbook_pilot_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });
  const [showQuantumLogin, setShowQuantumLogin] = useState(false);
  const [showNeuralArchitect, setShowNeuralArchitect] = useState(false);
  const [showKinoStudio, setShowKinoStudio] = useState(false);

  // Role Permission RBAC State
  const [showRolePermissionModal, setShowRolePermissionModal] = useState(false);
  const [permissionCheckData, setPermissionCheckData] = useState<{
    permission: NexusPermission;
    actionTitle: string;
    actionDescription: string;
    requiredRoleName?: string;
  } | null>(null);

  // Guest Mode Access Control
  const [showGuestRestriction, setShowGuestRestriction] = useState(false);
  const [guestBlockedAction, setGuestBlockedAction] = useState<{ title: string; description: string } | null>(null);

  const requireRolePermission = (
    permission: NexusPermission,
    actionTitle: string,
    actionDesc: string,
    onAllowed: () => void,
    requiredRoleName?: string
  ) => {
    const roleId = pilotProfile?.designatorName ? pilotProfile.designatorName.toLowerCase() : (pilotProfile?.role || 'guest');
    const allowed = hasPermission(roleId, permission);
    if (!allowed) {
      soundFx.playWarning?.();
      setPermissionCheckData({
        permission,
        actionTitle,
        actionDescription: actionDesc,
        requiredRoleName
      });
      setShowRolePermissionModal(true);
      return;
    }
    onAllowed();
  };

  const handleSwitchBellasRole = (roleKey: BellasRoleId) => {
    const bRole = PREDEFINED_BELLAS_ROLES[roleKey];
    if (!bRole) return;

    const updatedProfile: PilotProfile = {
      designatorName: bRole.name,
      vesselClass: bRole.assignedNodeName,
      missionObjectives: bRole.quote,
      specializations: bRole.permissions.map(p => `#${p}`),
      avatarUrl: bRole.avatar,
      neuralSyncPct: 99.8,
      encryptionKey: `AES-Q256-BELLAS-${roleKey.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      authenticated: true,
      authenticatedAt: Date.now(),
      isGuest: false,
      role: (roleKey === 'marco' || roleKey === 'architect') ? 'ARCHITECT' : roleKey === 'leo' ? 'PILOT' : roleKey === 'sofia' ? 'CHRONICLER' : 'SENTINEL',
      email: `${roleKey}@bellas.eterniverse.nexus`,
      authProvider: 'quantum_seed',
      clearanceLevel: bRole.clearanceLevel,
      connectedPortals: []
    };

    handleSavePilot(updatedProfile);
  };

  const requireFullAccess = (actionTitle: string, actionDesc: string, onAllowed: () => void) => {
    if (pilotProfile?.isGuest || !pilotProfile?.authenticated) {
      soundFx.playWarning?.();
      setGuestBlockedAction({
        title: actionTitle,
        description: actionDesc
      });
      setShowGuestRestriction(true);
      return;
    }
    onAllowed();
  };

  // HTML Worlds & Manifests State (with Offline Persistence)
  const [booksList, setBooksList] = useState<Book[]>(() => {
    try {
      const customBooks = getStoredCustomBooks();
      const mergedMap = new Map<string, Book>();

      // Master SAMPLE_BOOKS first
      SAMPLE_BOOKS.forEach(sb => mergedMap.set(sb.id, sb));

      // Merge custom/user books
      customBooks.forEach(cb => mergedMap.set(cb.id, cb));

      return Array.from(mergedMap.values());
    } catch (e) {
      console.error('Error initializing books list:', e);
    }
    return SAMPLE_BOOKS;
  });

  const [showHtmlStudio, setShowHtmlStudio] = useState(false);
  const [studioEditBook, setStudioEditBook] = useState<Book | null>(null);
  const [activeHtmlWorldBook, setActiveHtmlWorldBook] = useState<Book | null>(null);

  const handleSaveHtmlWorldBook = (savedBook: Book) => {
    if (pilotProfile?.isGuest) {
      requireFullAccess('Zapis Świata HTML', 'W trybie gościa zapisywanie nowych światów HTML jest zablokowane.', () => {});
      return;
    }
    setBooksList(prev => {
      const exists = prev.some(b => b.id === savedBook.id);
      const updated = exists ? prev.map(b => b.id === savedBook.id ? savedBook : b) : [savedBook, ...prev];
      safeSaveCustomBooks(updated);
      return updated;
    });
    // Sync to Cloud Firestore
    saveCustomBookToCloud(savedBook).catch(console.error);
    setShowHtmlStudio(false);
    setActiveHtmlWorldBook(savedBook);
  };

  const handleImportBook = (newBook: Book) => {
    if (pilotProfile?.isGuest) {
      requireFullAccess('Import Książki', 'W trybie gościa dodawanie nowych publikacji do bazy danych jest zablokowane.', () => {});
      return;
    }
    setBooksList(prev => {
      const merged = [newBook, ...prev.filter(b => b.id !== newBook.id)];
      safeSaveCustomBooks(merged);
      return merged;
    });
    saveCustomBookToCloud(newBook).catch(console.error);
  };

  const handleImportMultipleBooks = (newBooks: Book[]) => {
    if (pilotProfile?.isGuest) {
      requireFullAccess('Import Wielu Książek', 'W trybie gościa importowanie pakietów dzieł do bazy danych jest zablokowane.', () => {});
      return;
    }
    setBooksList(prev => {
      const newIds = new Set(newBooks.map(b => b.id));
      const filtered = prev.filter(b => !newIds.has(b.id));
      const merged = [...newBooks, ...filtered];
      safeSaveCustomBooks(merged);
      return merged;
    });
    newBooks.forEach(b => saveCustomBookToCloud(b).catch(console.error));
  };

  const handleSavePilot = useCallback((profile: PilotProfile) => {
    setPilotProfile(profile);
    useNexusStore.getState().setPilotProfile(profile);
    try {
      localStorage.setItem('nexusbook_pilot_profile', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
    // Sync to Cloud Firestore
    savePilotProfileToCloud(profile).catch(console.error);
  }, []);

  const handleLogoutPilot = useCallback(() => {
    setPilotProfile(null);
    useNexusStore.getState().setPilotProfile(null);
    try {
      localStorage.removeItem('nexusbook_pilot_profile');
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleCloseQuantumLogin = useCallback(() => {
    setShowQuantumLogin(false);
  }, []);
  // Dashboard User Config state
  const [userConfig, setUserConfig] = useState<UserDashboardConfig>({
    defaultSeekerFilter: 'ALL',
    soundEnabled: true,
    ambientLightMode: 'dark',
    pinnedBookIds: [],
    quickShortcuts: [],
    showParticles: true,
    hapticsEnabled: true
  });

  // User Collections State
  const [collections, setCollections] = useState<BookCollection[]>(() => {
    try {
      const saved = localStorage.getItem('nexusbook_collections');
      if (saved) {
        const parsed: BookCollection[] = JSON.parse(saved);
        // Ensure all built-in collections & Wattpad series exist
        INITIAL_COLLECTIONS.forEach(ic => {
          const idx = parsed.findIndex(c => c.id === ic.id);
          if (idx === -1) {
            parsed.push(ic);
          } else {
            // Keep series metadata fresh
            parsed[idx] = {
              ...ic,
              ...parsed[idx],
              type: ic.type || parsed[idx].type,
              status: ic.status || parsed[idx].status,
              totalExpected: ic.totalExpected || parsed[idx].totalExpected,
              universe: ic.universe || parsed[idx].universe,
              bookIds: Array.from(new Set([...(parsed[idx].bookIds || []), ...ic.bookIds]))
            };
          }
        });
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COLLECTIONS;
  });

  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [showCollectionsModal, setShowCollectionsModal] = useState(false);
  const [worksFilter, setWorksFilter] = useState<'ALL' | 'PUBLISHED' | 'CUSTOM'>('ALL');

  // Sync collections to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nexusbook_collections', JSON.stringify(collections));
    } catch (e) {
      console.error(e);
    }
  }, [collections]);

  // Collection Action Handlers
  const handleCreateCollection = (newCol: Omit<BookCollection, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (pilotProfile?.isGuest) {
      requireFullAccess('Tworzenie Kolekcji', 'W trybie gościa tworzenie własnych zestawów i kolekcji jest zablokowane.', () => {});
      return;
    }
    const created: BookCollection = {
      ...newCol,
      id: `col_${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setCollections(prev => [...prev, created]);
  };

  const handleUpdateCollection = (id: string, updates: Partial<BookCollection>) => {
    if (pilotProfile?.isGuest) {
      requireFullAccess('Edycja Kolekcji', 'W trybie gościa modyfikowanie kolekcji jest zablokowane.', () => {});
      return;
    }
    setCollections(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c));
  };

  const handleDeleteCollection = (id: string) => {
    if (pilotProfile?.isGuest) {
      requireFullAccess('Usuwanie Kolekcji', 'W trybie gościa usuwanie kolekcji jest zablokowane.', () => {});
      return;
    }
    setCollections(prev => prev.filter(c => c.id !== id));
    if (activeCollectionId === id) setActiveCollectionId(null);
  };

  const handleToggleBookInCollection = (collectionId: string, bookId: string) => {
    setCollections(prev => prev.map(c => {
      if (c.id !== collectionId) return c;
      const exists = c.bookIds.includes(bookId);
      const newBookIds = exists ? c.bookIds.filter(b => b !== bookId) : [...c.bookIds, bookId];
      return { ...c, bookIds: newBookIds, updatedAt: Date.now() };
    }));
  };

  const handleRemoveBookFromCollection = (collectionId: string, bookId: string) => {
    setCollections(prev => prev.map(c => {
      if (c.id !== collectionId) return c;
      return { ...c, bookIds: c.bookIds.filter(b => b !== bookId), updatedAt: Date.now() };
    }));
  };

  const handleReorderBookInCollection = (collectionId: string, fromIndex: number, toIndex: number) => {
    setCollections(prev => prev.map(c => {
      if (c.id !== collectionId) return c;
      const newBookIds = [...c.bookIds];
      const [moved] = newBookIds.splice(fromIndex, 1);
      newBookIds.splice(toIndex, 0, moved);
      return { ...c, bookIds: newBookIds, updatedAt: Date.now() };
    }));
  };

  // Navigation & Filter state
  const [activeSeeker, setActiveSeeker] = useState<SeekerId | 'ALL'>('ALL');
  const [activeFormat, setActiveFormat] = useState<'all' | 'manifesto' | 'pdf' | 'audio' | 'author_notes'>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile Sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Active Modals state
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [fullscreenReaderBook, setFullscreenReaderBook] = useState<{ book: Book; chapterId?: string } | null>(null);
  const [activeAudioBook, setActiveAudioBook] = useState<Book | null>(null);
  const [activePdfBook, setActivePdfBook] = useState<Book | null>(null);
  const [activeQrBook, setActiveQrBook] = useState<Book | null>(null);
  const [showDashboardConfig, setShowDashboardConfig] = useState(false);
  const [showQuoteOfDay, setShowQuoteOfDay] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAuthorAssetLibrary, setShowAuthorAssetLibrary] = useState(false);
  const [showEditorialStudio, setShowEditorialStudio] = useState(false);
  const [editorialStudioBook, setEditorialStudioBook] = useState<Book | null>(null);

  const handleOpenEditorialStudio = (book?: Book) => {
    requireFullAccess(
      'NexusBook Editorial Studio',
      'W trybie gościa redakcja dzieł, edycja manifestów oraz publikacja są zablokowane dla ochrony spójności bazy danych.',
      () => {
        if (book) {
          setEditorialStudioBook(book);
        } else if (booksList.length > 0) {
          setEditorialStudioBook(booksList[0]);
        } else {
          setEditorialStudioBook(null);
        }
        setShowEditorialStudio(true);
      }
    );
  };

  const handleSaveEditorialWork = (updatedBook: Book, isPublished: boolean) => {
    setBooksList(prev => {
      const idx = prev.findIndex(b => b.id === updatedBook.id);
      let next: Book[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = updatedBook;
      } else {
        next = [updatedBook, ...prev];
      }
      safeSaveCustomBooks(next);
      return next;
    });

    if (selectedBook && selectedBook.id === updatedBook.id) {
      setSelectedBook(updatedBook);
    }
    if (editorialStudioBook && editorialStudioBook.id === updatedBook.id) {
      setEditorialStudioBook(updatedBook);
    }

    saveCustomBookToCloud(updatedBook).catch(console.error);
  };

  // Chapter Bookmarks & Reading Progress State
  const [progressVersion, setProgressVersion] = useState(0);
  const [bookmarks, setBookmarks] = useState<ChapterBookmark[]>(() => getStoredBookmarks());

  // Archive Import Handler
  const handleImportArchive = (importedPkg: NexusArchivePackage, mode: 'merge' | 'replace') => {
    const { 
      customBooks = [], 
      collections: importedCols = [], 
      bookmarks: importedBookmarks = [], 
      readChapters = [], 
      pilotProfile: importedPilot, 
      userConfig: importedConfig 
    } = importedPkg.data;

    // 1. Update Books
    setBooksList(prev => {
      let updated: Book[];
      if (mode === 'replace') {
        const nonCustom = prev.filter(b => isBuiltInSampleBookId(b.id));
        updated = [...customBooks, ...nonCustom];
      } else {
        const merged = [...prev];
        customBooks.forEach(cb => {
          const idx = merged.findIndex(b => b.id === cb.id);
          if (idx >= 0) merged[idx] = cb;
          else merged.unshift(cb);
        });
        updated = merged;
      }
      safeSaveCustomBooks(updated);
      return updated;
    });

    // Sync imported custom books to Cloud Firestore
    customBooks.forEach(b => {
      saveCustomBookToCloud(b).catch(console.error);
    });

    // 2. Update Collections
    setCollections(prev => {
      let nextCols: BookCollection[];
      if (mode === 'replace') {
        nextCols = importedCols;
      } else {
        const map = new Map<string, BookCollection>();
        prev.forEach(c => map.set(c.id, c));
        importedCols.forEach(c => map.set(c.id, c));
        nextCols = Array.from(map.values());
      }
      try {
        localStorage.setItem('nexusbook_collections', JSON.stringify(nextCols));
      } catch (e) {
        console.error(e);
      }
      nextCols.forEach(c => {
        syncCollectionToCloud(c).catch(console.error);
      });
      return nextCols;
    });

    // 3. Update Bookmarks
    if (importedBookmarks && importedBookmarks.length > 0) {
      setBookmarks(prev => {
        let nextBms: ChapterBookmark[];
        if (mode === 'replace') {
          nextBms = importedBookmarks;
        } else {
          const map = new Map<string, ChapterBookmark>();
          prev.forEach(b => map.set(b.id, b));
          importedBookmarks.forEach(b => map.set(b.id, b));
          nextBms = Array.from(map.values());
        }
        saveStoredBookmarks(nextBms);
        nextBms.forEach(bm => {
          syncBookmarkToCloud(bm).catch(console.error);
        });
        return nextBms;
      });
    }

    // 4. Update Read Chapters / Reading Progress
    if (readChapters && readChapters.length > 0) {
      const currentRead = getStoredReadChapters();
      const combined = mode === 'replace' ? readChapters : Array.from(new Set([...currentRead, ...readChapters]));
      saveStoredReadChapters(combined);
      setProgressVersion(v => v + 1);
    }

    // 5. Update Pilot Profile & User Config
    if (importedPilot) {
      handleSavePilot(importedPilot);
    }
    if (importedConfig) {
      setUserConfig(prev => ({ ...prev, ...importedConfig }));
    }
  };

  // Firestore Database Connection State
  const [dbState, setDbState] = useState<DatabaseState | null>(null);
  const [showDatabaseStatus, setShowDatabaseStatus] = useState(false);
  const [diagnosticsInitialTab, setDiagnosticsInitialTab] = useState<'TELEMETRY' | 'NODE_TOKEN' | 'INTEGRATION' | 'ARCHIVE' | 'DIAGNOSTICS'>('NODE_TOKEN');
  const [showNexusEcosystemHub, setShowNexusEcosystemHub] = useState(false);

  const handleOpenDiagnostics = (tab: 'TELEMETRY' | 'NODE_TOKEN' | 'INTEGRATION' | 'ARCHIVE' | 'DIAGNOSTICS' = 'DIAGNOSTICS') => {
    setDiagnosticsInitialTab(tab);
    setShowDatabaseStatus(true);
  };

  useEffect(() => {
    // 1. Initialize Firestore connection & node telemetry
    initializeDatabaseConnection().catch((err) => {
      nexusLogger.warn('STORAGE', 'App', 'Uwaga przy inicjalizacji bazy Firestore', { error: err });
    });

    // 1b. Initialize Viem Quantum Docking to BNB Chain via Centralized Store
    useNexusStore.getState().dockBnbNode().catch((err) => {
      nexusLogger.warn('BLOCKCHAIN', 'App', 'Uwaga przy dokowaniu łańcucha BNB', { error: err });
    });

    // 2. Subscribe to live database connection status
    const unsubDb = subscribeDatabaseState((state) => {
      setDbState(state);
      useNexusStore.getState().setDatabaseConnected(state.isConnected);
    });

    // 3. Subscribe to real-time cloud bookmarks in Firestore
    const unsubBookmarks = subscribeToCloudBookmarks((cloudBookmarks) => {
      if (cloudBookmarks && cloudBookmarks.length > 0) {
        setBookmarks(cloudBookmarks);
      }
    });

    // 4. Fetch custom books & manifests from Firestore
    fetchCustomBooksFromCloud().then((cloudBooks) => {
      if (cloudBooks && cloudBooks.length > 0) {
        setBooksList((prev) => {
          const merged = [...prev];
          cloudBooks.forEach((cb) => {
            const idx = merged.findIndex(b => b.id === cb.id);
            if (idx >= 0) merged[idx] = cb;
            else merged.unshift(cb);
          });
          return merged;
        });
      }
    }).catch(console.error);

    return () => {
      unsubDb();
      unsubBookmarks();
    };
  }, []);

  const refreshBookmarks = () => {
    setBookmarks(getStoredBookmarks());
    setProgressVersion(v => v + 1);
  };

  const handleSelectBookmark = (bookId: string, chapterId: string) => {
    const targetBook = booksList.find(b => b.id === bookId);
    if (targetBook) {
      soundFx.playModalOpen();
      if (selectedBook) setSelectedBook(null);
      setFullscreenReaderBook({ book: targetBook, chapterId });
    }
  };

  const handleDeleteBookmark = (id: string) => {
    const updated = deleteBookmark(id);
    setBookmarks(updated);
  };

  // Search input ref
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Keyboard Navigation Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input element
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        soundFx.playClick();
        searchInputRef.current?.focus();
      } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        soundFx.playModalOpen();
        setShowShortcutsModal(prev => !prev);
      } else if (e.key.toLowerCase() === 'r') {
        soundFx.playClick();
        handleRandomBook();
      } else if (e.key.toLowerCase() === 'm') {
        setUserConfig(prev => {
          const next = !prev.soundEnabled;
          soundFx.enabled = next;
          if (next) soundFx.playClick();
          return { ...prev, soundEnabled: next };
        });
      } else if (e.key.toLowerCase() === 'f') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      } else if (e.key.toLowerCase() === 'h') {
        soundFx.playModalOpen();
        setStudioEditBook(null);
        setShowHtmlStudio(true);
      } else if (e.key.toLowerCase() === 'd') {
        soundFx.playModalOpen();
        setShowDatabaseStatus(prev => !prev);
      } else if (e.key.toLowerCase() === 'a') {
        soundFx.playModalOpen();
        setShowAuthorAssetLibrary(prev => !prev);
      } else if (e.key.toLowerCase() === 'e') {
        soundFx.playModalOpen();
        setShowNexusEcosystemHub(prev => !prev);
      } else if (e.key.toLowerCase() === 'c') {
        soundFx.playModalOpen();
        setShowCollectionsModal(true);
      } else if (e.key.toLowerCase() === 'q') {
        soundFx.playModalOpen();
        setShowQuoteOfDay(true);
      } else if (e.key === '0') {
        soundFx.playClick();
        setActiveSeeker('ALL');
      } else if (e.key === '1') {
        soundFx.playClick();
        setActiveSeeker('Operator001');
      } else if (e.key === '2') {
        soundFx.playClick();
        setActiveSeeker('InterSeeker');
      } else if (e.key === '3') {
        soundFx.playClick();
        setActiveSeeker('TabuSeeker');
      } else if (e.key === '4') {
        soundFx.playClick();
        setActiveSeeker('BioSeeker');
      } else if (e.key === '5') {
        soundFx.playClick();
        setActiveSeeker('ChronoSeeker');
      } else if (e.key === '6') {
        soundFx.playClick();
        setActiveSeeker('EterSeeker');
      } else if (e.key === 'Escape') {
        // Close modals
        if (showShortcutsModal) setShowShortcutsModal(false);
        else if (fullscreenReaderBook) setFullscreenReaderBook(null);
        else if (selectedBook) setSelectedBook(null);
        else if (activeHtmlWorldBook) setActiveHtmlWorldBook(null);
        else if (showHtmlStudio) setShowHtmlStudio(false);
        else if (showAuthorAssetLibrary) setShowAuthorAssetLibrary(false);
        else if (activePdfBook) setActivePdfBook(null);
        else if (activeAudioBook) setActiveAudioBook(null);
        else if (activeQrBook) setActiveQrBook(null);
        else if (showQuoteOfDay) setShowQuoteOfDay(false);
        else if (showDashboardConfig) setShowDashboardConfig(false);
        else if (showCollectionsModal) setShowCollectionsModal(false);
        else if (showQuantumLogin) setShowQuantumLogin(false);
        else if (showNeuralArchitect) setShowNeuralArchitect(false);
        else if (showCreatorSoulEngine) setShowCreatorSoulEngine(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    showShortcutsModal, 
    fullscreenReaderBook, 
    selectedBook, 
    activeHtmlWorldBook,
    showHtmlStudio,
    showAuthorAssetLibrary,
    activePdfBook, 
    activeAudioBook, 
    activeQrBook, 
    showQuoteOfDay, 
    showDashboardConfig, 
    showCollectionsModal, 
    showQuantumLogin, 
    showNeuralArchitect, 
    showCreatorSoulEngine,
    booksList
  ]);

  // Sync soundFx config
  useEffect(() => {
    soundFx.enabled = userConfig.soundEnabled;
    soundFx.haptics = userConfig.hapticsEnabled;
  }, [userConfig.soundEnabled, userConfig.hapticsEnabled]);

  // Calculate Book Counts by Seeker
  const bookCountsBySeeker = React.useMemo(() => {
    const counts: Record<string, number> = { ALL: booksList.length };
    booksList.forEach(b => {
      counts[b.seeker] = (counts[b.seeker] || 0) + 1;
    });
    return counts;
  }, [booksList]);

  // Filter books catalog based on active criteria
  const filteredBooks = React.useMemo(() => {
    return booksList.filter(book => {
      // Collection Filter
      if (activeCollectionId) {
        const activeCol = collections.find(c => c.id === activeCollectionId);
        if (!activeCol || !activeCol.bookIds.includes(book.id)) {
          return false;
        }
      }

      // Works Status / Scope Filter (Moje dzieła / Opublikowane / Wszystkie)
      if (worksFilter === 'PUBLISHED' && book.status !== 'Published') {
        return false;
      }
      if (worksFilter === 'CUSTOM' && !book.isCustom && !book.id.startsWith('wp-') && !book.id.startsWith('custom-')) {
        return false;
      }

      // Seeker Filter
      if (activeSeeker !== 'ALL' && book.seeker !== activeSeeker) {
        return false;
      }

      // Format Filter
      if (activeFormat === 'manifesto' && !book.isManifesto) return false;
      if (activeFormat === 'pdf' && !book.platformLinks.pdfUrl) return false;
      if (activeFormat === 'audio' && !book.platformLinks.audioUrl) return false;
      if (activeFormat === 'author_notes' && !book.authorNote) return false;

      // Language Filter
      if (selectedLanguage !== 'ALL' && book.language !== selectedLanguage) {
        return false;
      }

      // Category Filter
      if (selectedCategory !== 'ALL' && !book.tags.includes(selectedCategory)) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = book.title.toLowerCase().includes(q);
        const matchesSub = (book.subtitle || '').toLowerCase().includes(q);
        const matchesDesc = book.shortDesc.toLowerCase().includes(q);
        const matchesSeries = (book.series || '').toLowerCase().includes(q);
        const matchesTag = book.tags.some(t => t.toLowerCase().includes(q));
        const matchesQuote = book.quotes.some(quote => quote.text.toLowerCase().includes(q));
        const matchesChapter = book.chapters.some(ch => ch.title.toLowerCase().includes(q));

        if (!matchesTitle && !matchesSub && !matchesDesc && !matchesSeries && !matchesTag && !matchesQuote && !matchesChapter) {
          return false;
        }
      }

      return true;
    });
  }, [booksList, activeSeeker, activeFormat, selectedLanguage, selectedCategory, searchQuery, activeCollectionId, collections, worksFilter]);

  // Random Book Picker Handler
  const handleRandomBook = () => {
    const randomIdx = Math.floor(Math.random() * booksList.length);
    setSelectedBook(booksList[randomIdx]);
  };

  // Active Seeker color accent
  const activeColor = activeSeeker !== 'ALL' ? SEEKERS_CONFIG[activeSeeker].color : '#00f0ff';

  // Theme container classes based on ambientLightMode
  const ambientThemeClass = {
    dark: 'bg-slate-950 text-slate-100',
    oled: 'bg-black text-white',
    cinema: 'bg-[#08080f] text-slate-200',
    light: 'bg-[#0f172a] text-slate-100'
  }[userConfig.ambientLightMode];

  return (
    <div className={`min-h-screen relative font-sans ${ambientThemeClass} transition-colors duration-500 overflow-x-hidden selection:bg-cyan-500 selection:text-black`}>
      
      {/* 1. Procedural Background Canvas */}
      <BackgroundCanvas 
        primaryColor={activeColor} 
        showParticles={userConfig.showParticles}
      />

      {/* 2. System Header */}
      <Header
        onSearchFocus={() => searchInputRef.current?.focus()}
        onRandomBookClick={handleRandomBook}
        onQuoteOfDayClick={() => setShowQuoteOfDay(true)}
        onOpenDashboardConfig={() => setShowDashboardConfig(true)}
        onOpenQuantumLogin={() => setShowQuantumLogin(true)}
        onOpenNeuralArchitect={() => setShowNeuralArchitect(true)}
        onOpenCreatorSoulEngine={() => setShowCreatorSoulEngine(true)}
        onOpenAuthorAssetLibrary={() => requireFullAccess(
          'Nexus Author Asset Library',
          'W trybie gościa wgrywanie grafik i rejestracja sum SHA-256 są zablokowane dla ochrony integralności bazy.',
          () => setShowAuthorAssetLibrary(true)
        )}
        onOpenEditorialStudio={() => handleOpenEditorialStudio()}
        onOpenImportModal={() => requireFullAccess(
          'Import Dzieł (PDF / Substack)',
          'W trybie gościa importowanie zewnętrznych tomów i manifestów jest zablokowane.',
          () => setShowImportModal(true)
        )}
        onOpenShortcuts={() => setShowShortcutsModal(true)}
        onOpenDatabaseStatus={() => handleOpenDiagnostics('NODE_TOKEN')}
        onOpenDiagnostics={() => handleOpenDiagnostics('DIAGNOSTICS')}
        onOpenCollabHub={() => setShowCollabHub(true)}
        onOpenKinoStudio={() => setShowKinoStudio(true)}
        onOpenRolePermissions={() => setShowRolePermissionModal(true)}
        isDatabaseConnected={dbState?.isConnected ?? false}
        currentPilot={pilotProfile}
        soundEnabled={userConfig.soundEnabled}
        onToggleSound={() => setUserConfig(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
        ambientMode={userConfig.ambientLightMode}
        onChangeAmbientMode={(mode) => setUserConfig(prev => ({ ...prev, ambientLightMode: mode }))}
        activeSeekerColor={activeColor}
      />

      {/* Main Body Container with Sidebar + Content Rail */}
      <div className="flex relative z-10">
        
        {/* 3. Left Sticky Sidebar */}
        <Sidebar
          activeSeeker={activeSeeker}
          onSelectSeeker={setActiveSeeker}
          activeFormat={activeFormat}
          onSelectFormat={setActiveFormat}
          bookCountsBySeeker={bookCountsBySeeker}
          collections={collections}
          activeCollectionId={activeCollectionId}
          onSelectCollectionFilter={setActiveCollectionId}
          onOpenCollectionsModal={() => requireFullAccess(
            'Kolekcje Dzieł Nexusa',
            'W trybie gościa tworzenie i zarządzanie kolekcjami są zablokowane.',
            () => setShowCollectionsModal(true)
          )}
          bookmarks={bookmarks}
          onSelectBookmark={handleSelectBookmark}
          onDeleteBookmark={handleDeleteBookmark}
          onOpenQuantumLogin={() => setShowQuantumLogin(true)}
          onOpenNeuralArchitect={() => setShowNeuralArchitect(true)}
          onOpenCreatorSoulEngine={() => setShowCreatorSoulEngine(true)}
          onOpenAuthorAssetLibrary={() => requireFullAccess(
            'Nexus Author Asset Library',
            'W trybie gościa wgrywanie grafik i rejestracja sum SHA-256 są zablokowane dla ochrony integralności bazy.',
            () => setShowAuthorAssetLibrary(true)
          )}
          onOpenEditorialStudio={() => handleOpenEditorialStudio()}
          onOpenKinoStudio={() => setShowKinoStudio(true)}
          onOpenHtmlStudio={() => requireFullAccess(
            'Nexus HTML World Studio',
            'W trybie gościa tworzenie i edycja nowych światów HTML są zablokowane.',
            () => {
              setStudioEditBook(null);
              setShowHtmlStudio(true);
            }
          )}
          onOpenImportModal={() => requireFullAccess(
            'Import Dzieł (PDF / Substack)',
            'W trybie gościa importowanie zewnętrznych tomów i manifestów jest zablokowane.',
            () => setShowImportModal(true)
          )}
          onOpenNexusEcosystem={() => setShowNexusEcosystemHub(true)}
          onOpenCollabHub={() => setShowCollabHub(true)}
          onOpenShortcuts={() => setShowShortcutsModal(true)}
          onOpenDatabaseStatus={() => setShowDatabaseStatus(true)}
          isDatabaseConnected={dbState?.isConnected ?? false}
          currentPilot={pilotProfile}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* 4. Main Scrollable Content Area */}
        <main className="flex-1 p-4 md:p-8 space-y-10 max-w-7xl mx-auto min-w-0">
          
          {/* Mobile Sidebar Toggle Button */}
          <div className="lg:hidden flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-white/10 font-mono text-xs">
            <button
              onClick={() => {
                soundFx.playClick();
                setIsMobileSidebarOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-cyan-400 font-bold"
            >
              <Menu className="w-4 h-4" />
              <span>BRAMY WIEDZY & MENU</span>
            </button>
            <span className="text-slate-400">
              {activeSeeker === 'ALL' ? 'Wszystkie' : activeSeeker}
            </span>
          </div>

          {/* HERO SECTION - BOLD TYPOGRAPHY DISCIPLINE */}
          <section className="relative rounded-2xl p-6 sm:p-10 border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col justify-between min-h-[220px]">
            
            {/* Grid background decoration */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Ambient Radial Accent */}
            <div 
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: activeColor }}
            />

            <div className="relative z-10 space-y-2">
              <h1 className="text-6xl sm:text-[80px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 select-none">
                NEXUSBOOK
              </h1>
              <p className="text-sm sm:text-base font-light tracking-[0.35em] sm:tracking-[0.4em] uppercase text-blue-400 font-mono">
                Central Knowledge Archive • Powered by ETERNIVERSE OS
              </p>
            </div>

            {/* Quick Hero Telemetry Bar */}
            <div className="relative z-10 mt-8 flex flex-wrap gap-6 sm:gap-10 text-[10px] font-mono text-white/50 uppercase tracking-widest pt-4 border-t border-white/10">
              <div>
                Total_Volumes: <span className="text-white font-bold">{filteredBooks.length}</span>
              </div>
              <div>
                Active_Gate: <span className="font-bold" style={{ color: activeColor }}>{activeSeeker}</span>
              </div>
              <div>
                Access_Points: <span className="text-white font-bold">GLOBAL_GRID</span>
              </div>
              <div className="hidden sm:block">
                Security_Level: <span className="text-emerald-400 font-bold">LOCKED</span>
              </div>
              <button
                onClick={handleRandomBook}
                className="ml-auto text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5 font-bold"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>[ RANDOM_BOOK ]</span>
              </button>
            </div>
          </section>

          {/* SEARCH & FILTERS TOOLBAR */}
          <section className="space-y-4">
            
            {/* SERIE & MOJE DZIEŁA (WATTPAD & ETERNIVERSE CORE) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-cyan-950/40 border border-purple-500/20 shadow-xl space-y-3 font-mono">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                
                {/* View Modes: Wszystkie dzieła | Opublikowane | Moje dzieła */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-white/40 uppercase font-bold mr-1">DZIEŁA:</span>
                  {[
                    { id: 'ALL', label: 'Wszystkie dzieła', count: booksList.length },
                    { id: 'PUBLISHED', label: 'Opublikowane', count: booksList.filter(b => b.status === 'Published').length },
                    { id: 'CUSTOM', label: 'Moje dzieła', count: booksList.filter(b => b.isCustom || b.id.startsWith('wp-')).length }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        soundFx.playClick();
                        setWorksFilter(tab.id as 'ALL' | 'PUBLISHED' | 'CUSTOM');
                      }}
                      className={`px-3 py-1 rounded-lg text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
                        worksFilter === tab.id
                          ? 'bg-purple-600 text-white font-bold shadow-md'
                          : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className="text-[9px] opacity-60">({tab.count})</span>
                    </button>
                  ))}
                </div>

                {/* Create Series Button */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setShowCollectionsModal(true);
                  }}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[11px] font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Stwórz serię</span>
                </button>
              </div>

              {/* Series Quick Selector Pills */}
              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 pt-0.5">
                <span className="text-[10px] text-purple-400 uppercase font-bold shrink-0 flex items-center gap-1">
                  <Bookmark className="w-3 h-3" />
                  <span>SERIA:</span>
                </span>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActiveCollectionId(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] shrink-0 transition-all cursor-pointer ${
                    activeCollectionId === null
                      ? 'bg-cyan-500 text-black font-bold shadow-sm'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  Wszystkie serie
                </button>

                {collections.filter(c => c.universe || c.type || c.id.startsWith('col_')).map((col) => {
                  const isSelected = activeCollectionId === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => {
                        soundFx.playClick();
                        setActiveCollectionId(isSelected ? null : col.id);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] shrink-0 transition-all flex items-center gap-1.5 border cursor-pointer ${
                        isSelected
                          ? 'bg-purple-900/80 border-purple-400 text-purple-200 font-bold shadow-md'
                          : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                      style={{ borderLeftColor: col.color, borderLeftWidth: '3px' }}
                    >
                      <span className="truncate">{col.name}</span>
                      {col.type && (
                        <span className="text-[8px] text-purple-300 px-1 py-0.2 rounded bg-purple-950/80">
                          {col.type}
                        </span>
                      )}
                      <span className="text-[9px] opacity-60">
                        • {col.totalExpected ? `${col.bookIds.length}/${col.totalExpected}` : `${col.bookIds.length}`} dzieł
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Selected Series Showcase Banner */}
            {activeCollectionId && (() => {
              const activeCol = collections.find(c => c.id === activeCollectionId);
              if (!activeCol) return null;
              return (
                <div 
                  className="p-5 rounded-2xl border border-purple-500/30 relative overflow-hidden font-mono shadow-2xl animate-in fade-in duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${activeCol.color}22 0%, #030712 100%)`
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] px-2 py-0.5 rounded bg-purple-900/60 border border-purple-400/40 text-purple-300 font-bold uppercase">
                          {activeCol.type || 'SERIA ARCHIWUM'}
                        </span>
                        {activeCol.status && (
                          <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-900/60 border border-cyan-400/40 text-cyan-300 font-bold">
                            • {activeCol.status}
                          </span>
                        )}
                        {activeCol.totalExpected && (
                          <span className="text-[9px] px-2 py-0.5 rounded bg-amber-900/60 border border-amber-400/40 text-amber-300 font-bold">
                            {activeCol.totalExpected} dzieł (kanon)
                          </span>
                        )}
                        {activeCol.universe && (
                          <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white/80">
                            {activeCol.universe}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        <span>{activeCol.name}</span>
                      </h3>

                      {activeCol.description && (
                        <p className="text-xs text-white/70 font-sans leading-relaxed pt-1">
                          {activeCol.description}
                        </p>
                      )}

                      {activeCol.totalExpected && (
                        <div className="pt-2 max-w-lg">
                          <div className="flex justify-between text-[10px] text-white/50 mb-1 font-mono">
                            <span>Wczytane pozycje w systemie:</span>
                            <span className="font-bold text-cyan-400">
                              {activeCol.bookIds.length} / {activeCol.totalExpected} ({Math.round((activeCol.bookIds.length / activeCol.totalExpected) * 100)}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                              style={{ width: `${Math.min(100, Math.round((activeCol.bookIds.length / activeCol.totalExpected) * 100))}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setShowCollectionsModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Zarządzaj Serią
                      </button>
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setActiveCollectionId(null);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Wyczyść filtr</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Global Search Input Bar */}
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Global Query: titles, quotes, series, tags, chapters... (Press /)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none font-mono text-xs text-white placeholder-white/30 shadow-inner transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Pills Rail */}
            <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              
              {/* Language Filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase text-white/30 mr-1 font-bold">LANGUAGE:</span>
                {(['ALL', 'PL', 'EN', 'DE', 'FR'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedLanguage(lang);
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                      selectedLanguage === lang
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'
                    }`}
                  >
                    {lang === 'ALL' ? 'ALL' : lang}
                  </button>
                ))}
              </div>

              {/* Category / Tag Filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase text-white/30 mr-1 font-bold">CATEGORY:</span>
                {(['ALL', 'AI', 'Filozofia', 'Psychologia', 'Science Fiction', 'Manifest', 'Biografia'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedCategory(cat as Category | 'ALL');
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                      selectedCategory === cat
                        ? 'bg-blue-500 text-black font-bold shadow-md'
                        : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'
                    }`}
                  >
                    {cat === 'ALL' ? 'ALL' : cat}
                  </button>
                ))}
              </div>

            </div>
          </section>

          {/* MAIN BOOK GRID SECTION */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-cyan-400" />
                <span>KARTOTEKA KSIĄŻEK ARCHIWUM ({filteredBooks.length})</span>
              </span>

              {(activeSeeker !== 'ALL' || selectedLanguage !== 'ALL' || selectedCategory !== 'ALL' || searchQuery || activeCollectionId) && (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActiveSeeker('ALL');
                    setSelectedLanguage('ALL');
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                    setActiveCollectionId(null);
                  }}
                  className="text-cyan-400 hover:underline text-[11px]"
                >
                  [Resetuj filtry]
                </button>
              )}
            </div>

            {filteredBooks.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-white/10 space-y-4 font-mono">
                <p className="text-lg text-slate-400">Brak dzieł spełniających podane kryteria wyszukiwania.</p>
                <button
                  onClick={() => {
                    setActiveSeeker('ALL');
                    setSelectedLanguage('ALL');
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                    setActiveCollectionId(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs"
                >
                  POKAŻ WSZYSTKIE KSIĄŻKI
                </button>
              </div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredBooks.map((book, index) => (
                    <motion.div
                      key={`${book.id}_${progressVersion}`}
                      layout
                      initial={{ opacity: 0, y: 24, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      transition={{ 
                        duration: 0.35, 
                        ease: [0.22, 1, 0.36, 1],
                        delay: Math.min(index * 0.04, 0.3)
                      }}
                    >
                      <BookCard
                        book={book}
                        collections={collections}
                        onToggleBookInCollection={handleToggleBookInCollection}
                        onOpenBook={(b) => setSelectedBook(b)}
                        onOpenPdf={(b) => setActivePdfBook(b)}
                        onOpenAudio={(b) => setActiveAudioBook(b)}
                        onOpenQr={(b) => setActiveQrBook(b)}
                        onOpenHtmlWorld={(b) => setActiveHtmlWorldBook(b)}
                        onOpenEditorialStudio={(b) => handleOpenEditorialStudio(b)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </section>

          {/* TIMELINE SECTION ("OŚ CZASU") */}
          <section className="pt-6">
            <TimelineView
              books={booksList}
              onSelectBook={(b) => setSelectedBook(b)}
            />
          </section>

          {/* TELEMETRY & DATA INSIGHTS PANEL ("PANEL STATYSTYK") */}
          <section className="pt-6">
            <StatsDashboard 
              stats={INITIAL_SYSTEM_STATS} 
              books={booksList}
              bookmarks={bookmarks}
            />
          </section>

          {/* FOOTER */}
          <footer className="pt-12 pb-6 border-t border-white/10 font-mono text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-white font-bold">NEXUSBOOK ARCHIVE OS</span> • Powered by ETERNIVERSE
            </div>
            <div className="flex items-center gap-4">
              <span>SYSTEM: OK</span>
              <span>UTC: {new Date().toISOString().substring(11, 16)}</span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-white/30 text-slate-300"
                title="Do góry"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </footer>

        </main>
      </div>

      {/* MODALS & DRAWERS */}
      
      {/* Expanded Book Detail Drawer */}
      <BookDetailModal
        book={selectedBook}
        collections={collections}
        onToggleBookInCollection={handleToggleBookInCollection}
        onOpenCollectionsModal={() => setShowCollectionsModal(true)}
        onClose={() => setSelectedBook(null)}
        onLaunchFullscreenReader={(b, chId) => {
          setSelectedBook(null);
          setFullscreenReaderBook({ book: b, chapterId: chId });
        }}
        onOpenPdf={(b) => setActivePdfBook(b)}
        onOpenAudio={(b) => setActiveAudioBook(b)}
        onSelectRelatedBook={(b) => setSelectedBook(b)}
        onOpenHtmlWorld={(b) => setActiveHtmlWorldBook(b)}
        onOpenEditorialStudio={(b) => handleOpenEditorialStudio(b)}
        onBookmarksChange={refreshBookmarks}
      />

      {/* NexusBook Editorial & Publishing Studio Modal */}
      {showEditorialStudio && editorialStudioBook && (
        <NexusErrorBoundary moduleName="NexusBookEditorialStudio">
          <NexusBookEditorialStudioModal
            isOpen={showEditorialStudio}
            book={editorialStudioBook}
            onClose={() => {
              setShowEditorialStudio(false);
              setEditorialStudioBook(null);
            }}
            onSaveWork={handleSaveEditorialWork}
          />
        </NexusErrorBoundary>
      )}

      {/* HTML World Dedicated Live Viewer Modal */}
      {activeHtmlWorldBook && (
        <NexusErrorBoundary moduleName="HtmlWorldViewer">
          <HtmlWorldViewerModal
            book={activeHtmlWorldBook}
            onClose={() => setActiveHtmlWorldBook(null)}
            onOpenStudioForBook={(b) => {
              setActiveHtmlWorldBook(null);
              setStudioEditBook(b);
              setShowHtmlStudio(true);
            }}
          />
        </NexusErrorBoundary>
      )}

      {/* HTML World Creator Studio Modal */}
      {showHtmlStudio && (
        <NexusErrorBoundary moduleName="HtmlWorldStudio">
          <HtmlWorldStudioModal
            initialBook={studioEditBook}
            onClose={() => {
              setShowHtmlStudio(false);
              setStudioEditBook(null);
            }}
            onSaveBook={handleSaveHtmlWorldBook}
            onLaunchWorldViewer={(b) => {
              setShowHtmlStudio(false);
              setActiveHtmlWorldBook(b);
            }}
          />
        </NexusErrorBoundary>
      )}

      {/* Fullscreen Reader Modal */}
      {fullscreenReaderBook && (
        <NexusErrorBoundary moduleName="FullscreenReader">
          <FullscreenReader
            book={fullscreenReaderBook.book}
            initialChapterId={fullscreenReaderBook.chapterId}
            onClose={() => setFullscreenReaderBook(null)}
            onBookmarksChange={refreshBookmarks}
            onProgressChange={refreshBookmarks}
          />
        </NexusErrorBoundary>
      )}

      {/* Audio Player Widget */}
      {activeAudioBook && (
        <AudioPlayerWidget
          book={activeAudioBook}
          onClose={() => setActiveAudioBook(null)}
        />
      )}

      {/* PDF Viewer Modal */}
      {activePdfBook && (
        <PDFViewerModal
          book={activePdfBook}
          onClose={() => setActivePdfBook(null)}
        />
      )}

      {/* QR Code Matrix Generator Modal */}
      {activeQrBook && (
        <QRModal
          book={activeQrBook}
          onClose={() => setActiveQrBook(null)}
        />
      )}

      {/* Quote of the Day Modal */}
      {showQuoteOfDay && (
        <QuoteOfDayModal
          books={booksList}
          onOpenBook={(b) => setSelectedBook(b)}
          onClose={() => setShowQuoteOfDay(false)}
        />
      )}

      {/* Custom Dashboard Config Modal */}
      {showDashboardConfig && (
        <CustomDashboardModal
          config={userConfig}
          onSaveConfig={setUserConfig}
          onClose={() => setShowDashboardConfig(false)}
        />
      )}

      {/* Collections Management Modal */}
      {showCollectionsModal && (
        <CollectionsModal
          collections={collections}
          allBooks={booksList}
          activeCollectionId={activeCollectionId}
          onSelectCollectionFilter={(colId) => {
            setActiveCollectionId(colId);
            if (colId) {
              setActiveSeeker('ALL');
              setActiveFormat('all');
            }
          }}
          onCreateCollection={handleCreateCollection}
          onUpdateCollection={handleUpdateCollection}
          onDeleteCollection={handleDeleteCollection}
          onToggleBookInCollection={handleToggleBookInCollection}
          onRemoveBookFromCollection={handleRemoveBookFromCollection}
          onReorderBookInCollection={handleReorderBookInCollection}
          onOpenBook={(b) => setSelectedBook(b)}
          onClose={() => setShowCollectionsModal(false)}
        />
      )}

      {/* Quantum Traversal Login / Pilot Auth Modal */}
      {showQuantumLogin && (
        <QuantumLoginModal
          currentPilot={pilotProfile}
          onSavePilot={handleSavePilot}
          onLogoutPilot={handleLogoutPilot}
          onClose={handleCloseQuantumLogin}
        />
      )}

      {/* Guest Mode Guard Restriction Modal */}
      {showGuestRestriction && (
        <GuestRestrictionModal
          actionTitle={guestBlockedAction?.title}
          actionDescription={guestBlockedAction?.description}
          onOpenLogin={() => {
            setShowGuestRestriction(false);
            setShowQuantumLogin(true);
          }}
          onClose={() => setShowGuestRestriction(false)}
        />
      )}

      {/* NexusBook Neural Content Architect Modal */}
      {showNeuralArchitect && (
        <NeuralContentArchitectModal
          onClose={() => setShowNeuralArchitect(false)}
        />
      )}

      {/* NexusBook Creator Soul Engine Modal */}
      {showCreatorSoulEngine && (
        <CreatorSoulEngineModal
          currentProfile={creatorProfile}
          onSaveProfile={handleSaveCreatorProfile}
          onClose={() => setShowCreatorSoulEngine(false)}
          books={SAMPLE_BOOKS}
        />
      )}

      {/* Nexus Author Asset Library Modal */}
      {showAuthorAssetLibrary && (
        <AuthorAssetLibraryModal
          isOpen={showAuthorAssetLibrary}
          onClose={() => setShowAuthorAssetLibrary(false)}
          allBooks={booksList}
          onBookUpdated={(updatedBook) => {
            setBooksList(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
            if (selectedBook?.id === updatedBook.id) {
              setSelectedBook(updatedBook);
            }
          }}
          onBooksUpdated={(updatedBooks) => {
            const updatedMap = new Map(updatedBooks.map(b => [b.id, b]));
            setBooksList(prev => prev.map(b => updatedMap.get(b.id) || b));
            if (selectedBook && updatedMap.has(selectedBook.id)) {
              setSelectedBook(updatedMap.get(selectedBook.id)!);
            }
          }}
          onOpenBook={(bookId) => {
            const b = booksList.find(book => book.id === bookId);
            if (b) {
              setSelectedBook(b);
            }
          }}
        />
      )}

      {/* Panel Importu Książek i Materiałów (PDF / Substack / Wattpad / TXT) */}
      <BookImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportBook={handleImportBook}
        onImportMultipleBooks={handleImportMultipleBooks}
        onOpenReader={(book, chapterId) => {
          setSelectedBook(null);
          setFullscreenReaderBook({ book, chapterId });
        }}
        onOpenHtmlWorld={(book) => {
          setSelectedBook(null);
          setActiveHtmlWorldBook(book);
        }}
      />

      {/* NexusBook Firestore Database Status & Sync Modal */}
      <DatabaseStatusModal
        isOpen={showDatabaseStatus}
        onClose={() => setShowDatabaseStatus(false)}
        bookmarksCount={bookmarks.length}
        customBooksCount={booksList.filter(b => b.id.startsWith('html_world_') || b.customHtmlWorld).length}
        booksList={booksList}
        collections={collections}
        bookmarks={bookmarks}
        onImportArchive={handleImportArchive}
        initialTab={diagnosticsInitialTab}
        onForceSync={() => {
          refreshBookmarks();
          fetchCustomBooksFromCloud().then((cloudBooks) => {
            if (cloudBooks && cloudBooks.length > 0) {
              setBooksList((prev) => {
                const merged = [...prev];
                cloudBooks.forEach((cb) => {
                  const idx = merged.findIndex(b => b.id === cb.id);
                  if (idx >= 0) merged[idx] = cb;
                  else merged.unshift(cb);
                });
                return merged;
              });
            }
          });
        }}
      />

      {/* Nexus Ecosystem & Synapse Core Hub Modal */}
      <NexusEcosystemHubModal
        isOpen={showNexusEcosystemHub}
        onClose={() => setShowNexusEcosystemHub(false)}
        books={booksList}
      />

      {/* Nexus Real-Time Multi-User Collaboration Hub (Dashboard, Kino, Scribe) */}
      <NexusCollabHubModal
        isOpen={showCollabHub || activeModal === 'REALTIME_COLLAB'}
        initialTab={(modalPayload?.defaultTab as any) || 'dashboard'}
        onClose={() => {
          setShowCollabHub(false);
          if (activeModal === 'REALTIME_COLLAB') closeModal();
        }}
      />

      {/* Kino Nexus Audiovisual Studio Modal (Sofia Bellas Engine) */}
      <KinoStudioModal
        isOpen={showKinoStudio || activeModal === 'KINO_STUDIO'}
        currentRole={pilotProfile?.designatorName || pilotProfile?.role}
        onRequestRoleChange={() => setShowQuantumLogin(true)}
        onClose={() => {
          setShowKinoStudio(false);
          if (activeModal === 'KINO_STUDIO') closeModal();
        }}
      />

      {/* Role Permission RBAC Restriction & Management Studio Modal */}
      {showRolePermissionModal && (
        <RolePermissionModal
          isOpen={showRolePermissionModal}
          requiredPermission={permissionCheckData?.permission}
          requiredRoleName={permissionCheckData?.requiredRoleName}
          actionTitle={permissionCheckData?.actionTitle}
          actionDescription={permissionCheckData?.actionDescription}
          currentRole={pilotProfile?.designatorName || pilotProfile?.role}
          onSwitchRole={handleSwitchBellasRole}
          onOpenLogin={() => {
            setShowRolePermissionModal(false);
            setShowQuantumLogin(true);
          }}
          onClose={() => {
            setShowRolePermissionModal(false);
            setPermissionCheckData(null);
          }}
        />
      )}

      {/* Nexus BNB Chain Client Blocks Graph Modal (Recharts) */}
      <NexusBlockChartModal
        isOpen={activeModal === 'BNB_BLOCK_CHART'}
        onClose={() => closeModal()}
      />

      {/* Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

      {/* Offline Status & Cache Telemetry Banner */}
      <OfflineBanner onSelectBook={(b) => setSelectedBook(b)} />

      {/* Nexus Eterion Guide for Biooperator (Bottom-Right Corner) */}
      <BiooperatorGuideWidget
        pilotProfile={pilotProfile}
        activeBook={selectedBook}
        totalBooksCount={booksList.length}
        bookmarksCount={bookmarks.length}
      />

      {/* Centralized Nexus Error & Telemetry Toast Pipeline */}
      <NexusErrorToastContainer 
        onOpenDiagnostics={() => handleOpenDiagnostics('DIAGNOSTICS')} 
      />

    </div>
  );
}
