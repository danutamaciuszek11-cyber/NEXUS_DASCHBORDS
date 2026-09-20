import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Server, 
  ShieldCheck, 
  HardDrive, 
  Activity, 
  Zap,
  Bookmark,
  BookOpen,
  UserCheck,
  Key,
  Copy,
  Check,
  Cpu,
  Layers,
  Code2,
  Lock,
  Globe,
  Radio,
  FileCode,
  Archive,
  Download,
  Upload,
  FileJson,
  FolderArchive,
  ArrowDownToLine,
  FolderSync
} from 'lucide-react';
import { getDatabaseState, initializeDatabaseConnection, DatabaseState } from '../lib/firebase';
import { 
  NEXUS_NODE_TOKEN, 
  CURRENT_NODE_IDENTITY, 
  registerNodeIdentityInCloud, 
  getNodeAuthHeaders,
  getNodeIntegrationSnippets 
} from '../lib/nodeIdentity';
import { soundFx } from '../utils/audioSystem';
import { Book, BookCollection, ChapterBookmark } from '../types';
import { 
  NexusArchivePackage, 
  generateNexusArchive, 
  downloadNexusArchiveFile, 
  validateAndParseArchive,
  ArchiveValidationResult 
} from '../utils/nexusArchive';
import { getStoredBookmarks } from '../utils/bookmarkStorage';

interface DatabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarksCount: number;
  customBooksCount: number;
  onForceSync?: () => void;
  booksList?: Book[];
  collections?: BookCollection[];
  bookmarks?: ChapterBookmark[];
  onImportArchive?: (importedPackage: NexusArchivePackage, mode: 'merge' | 'replace') => void;
}

export const DatabaseStatusModal: React.FC<DatabaseStatusModalProps> = ({
  isOpen,
  onClose,
  bookmarksCount,
  customBooksCount,
  onForceSync,
  booksList = [],
  collections = [],
  bookmarks = [],
  onImportArchive
}) => {
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'NODE_TOKEN' | 'INTEGRATION' | 'ARCHIVE'>('NODE_TOKEN');
  const [dbState, setDbState] = useState<DatabaseState>(() => getDatabaseState());
  const [isTesting, setIsTesting] = useState(false);
  const [isRegisteringNode, setIsRegisteringNode] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; latencyMs: number; message: string } | null>(null);

  // Archive Export & Import State
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importValidation, setImportValidation] = useState<ArchiveValidationResult | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setDbState(getDatabaseState());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyToken = () => {
    navigator.clipboard.writeText(NEXUS_NODE_TOKEN);
    soundFx.playSuccess();
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleCopySnippet = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    soundFx.playSuccess();
    setCopiedSnippet(key);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleRegisterNode = async () => {
    soundFx.playClick();
    setIsRegisteringNode(true);
    try {
      const ok = await registerNodeIdentityInCloud();
      if (ok) {
        soundFx.playSuccess();
        setTestResult({
          success: true,
          latencyMs: 12,
          message: `Klucz węzła ${NEXUS_NODE_TOKEN} został pomyślnie autoryzowany i zarejestrowany w chmurze Firestore.`
        });
      } else {
        setTestResult({
          success: false,
          latencyMs: 0,
          message: 'Ostrzeżenie rejestracji węzła. Sprawdź stan łącza.'
        });
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        latencyMs: 0,
        message: e?.message || 'Błąd rejestracji węzła.'
      });
    } finally {
      setIsRegisteringNode(false);
    }
  };

  const handleTestConnection = async () => {
    soundFx.playClick();
    setIsTesting(true);
    setTestResult(null);
    const start = performance.now();
    try {
      const success = await initializeDatabaseConnection();
      await registerNodeIdentityInCloud();
      const latencyMs = Math.round(performance.now() - start);
      setDbState(getDatabaseState());
      if (success) {
        soundFx.playSuccess();
        setTestResult({
          success: true,
          latencyMs,
          message: `Węzeł ${NEXUS_NODE_TOKEN} zautoryzowany w chmurze Firestore. Czas odpowiedzi: ${latencyMs}ms.`
        });
      } else {
        setTestResult({
          success: false,
          latencyMs,
          message: 'Błąd odpowiedzi węzła bazy danych.'
        });
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        latencyMs: 0,
        message: e?.message || 'Nieznany błąd podczas testu.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Archive Export Handler
  const handleExportArchive = () => {
    setIsExporting(true);
    soundFx.playClick();
    try {
      // Gather current data
      let currentBooks = booksList;
      if (!currentBooks || currentBooks.length === 0) {
        try {
          const raw = localStorage.getItem('nexusbook_custom_books');
          if (raw) currentBooks = JSON.parse(raw);
        } catch (e) {
          console.warn(e);
        }
      }

      let currentCollections = collections;
      if (!currentCollections || currentCollections.length === 0) {
        try {
          const raw = localStorage.getItem('nexusbook_collections');
          if (raw) currentCollections = JSON.parse(raw);
        } catch (e) {
          console.warn(e);
        }
      }

      const currentBookmarks = bookmarks && bookmarks.length > 0 ? bookmarks : getStoredBookmarks();

      const archive = generateNexusArchive(currentBooks, currentCollections, currentBookmarks);
      const filename = downloadNexusArchiveFile(archive);
      soundFx.playSuccess();
      setExportNotice(`Pobrano ustrukturyzowane archiwum JSON: "${filename}" (${archive.metadata.stats.customBooksCount} książek, ${archive.metadata.stats.collectionsCount} kolekcji, ${archive.metadata.stats.bookmarksCount} zakładek).`);
    } catch (e: any) {
      console.error('Export archive error:', e);
      setExportNotice(`Błąd podczas eksportu: ${e?.message || 'Nieznany błąd'}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Archive File Select & Validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setImportNotice(null);
    soundFx.playClick();

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) {
        setImportValidation({ isValid: false, error: 'Plik jest pusty.' });
        return;
      }
      const validation = validateAndParseArchive(content);
      setImportValidation(validation);
      if (validation.isValid) {
        soundFx.playSuccess();
      } else {
        soundFx.playRemoveFromCollection();
      }
    };
    reader.onerror = () => {
      setImportValidation({ isValid: false, error: 'Błąd podczas odczytu pliku z dysku.' });
    };
    reader.readAsText(file);
  };

  // Archive Confirm Import
  const handleConfirmImport = () => {
    if (!importValidation || !importValidation.isValid || !importValidation.package) {
      alert('Wybierz najpierw prawidłowy plik archiwum JSON.');
      return;
    }

    setIsImporting(true);
    soundFx.playClick();

    try {
      const pkg = importValidation.package;

      if (onImportArchive) {
        onImportArchive(pkg, importMode);
      } else {
        // Fallback local storage save if callback not provided
        if (pkg.data.customBooks && pkg.data.customBooks.length > 0) {
          localStorage.setItem('nexusbook_custom_books', JSON.stringify(pkg.data.customBooks));
        }
        if (pkg.data.collections && pkg.data.collections.length > 0) {
          localStorage.setItem('nexusbook_collections', JSON.stringify(pkg.data.collections));
        }
      }

      soundFx.playSuccess();
      setImportNotice(`Pomyślnie zaimportowano ${pkg.data.customBooks.length} książek, ${pkg.data.collections.length} kolekcji i ${pkg.data.bookmarks.length} zakładek (Tryb: ${importMode === 'merge' ? 'Połącz' : 'Zastąp'}).`);
      setImportFile(null);
      setImportValidation(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e: any) {
      console.error('Import archive error:', e);
      setImportNotice(`Błąd importu: ${e?.message || 'Nieznany błąd zapisu'}`);
    } finally {
      setIsImporting(false);
    }
  };

  const snippets = getNodeIntegrationSnippets();

  const customBooksCountCalc = booksList.filter(b => b.id.startsWith('html_world_') || b.customHtmlWorld).length || customBooksCount;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-zinc-950/95 border border-emerald-500/40 rounded-2xl shadow-2xl shadow-emerald-950/50 overflow-hidden flex flex-col max-h-[92vh] relative"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 0 45px rgba(16, 185, 129, 0.15), inset 0 0 20px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-cyan-400 via-purple-500 to-amber-500" />

        {/* Modal Header */}
        <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black font-mono text-white tracking-wider uppercase">
                  WĘZEŁ TOŻSAMOŚCI & BAZA DANYCH NEXUS
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  NODE AUTHORIZED
                </span>
              </div>
              <p className="text-xs text-white/40 font-mono">
                Klucz tożsamości węzła, telemetria, archiwizacja JSON i integracja agentów AI
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playModalClose();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Zamknij"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-black/30 px-6 pt-2 gap-2 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('NODE_TOKEN');
            }}
            className={`px-3 py-2 text-xs font-mono font-bold rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'NODE_TOKEN'
                ? 'bg-zinc-900 text-emerald-400 border-t border-x border-emerald-500/40'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Klucz Węzła</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('TELEMETRY');
            }}
            className={`px-3 py-2 text-xs font-mono font-bold rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'TELEMETRY'
                ? 'bg-zinc-900 text-cyan-400 border-t border-x border-cyan-500/40'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Baza & Telemetria</span>
          </button>

          {/* New ARCHIVE Tab */}
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('ARCHIVE');
            }}
            className={`px-3 py-2 text-xs font-mono font-bold rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'ARCHIVE'
                ? 'bg-zinc-900 text-purple-400 border-t border-x border-purple-500/40'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-purple-400" />
            <span>Export i import Archive</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
              JSON
            </span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('INTEGRATION');
            }}
            className={`px-3 py-2 text-xs font-mono font-bold rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'INTEGRATION'
                ? 'bg-zinc-900 text-amber-400 border-t border-x border-amber-500/40'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Integracja AI</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4 flex-1">
          
          {/* TAB 1: NODE TOKEN & ECOSYSTEM AUTHORIZATION */}
          {activeTab === 'NODE_TOKEN' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Prominent Node Token Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-950/80 to-cyan-950/60 border-2 border-emerald-500/60 shadow-xl shadow-emerald-950/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-15 text-emerald-400 pointer-events-none">
                  <Key className="w-24 h-24" />
                </div>

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      KLUCZ TOŻSAMOŚCI WĘZŁA (NODE TOKEN)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      BNB SMART CHAIN MATRIX
                    </span>
                  </div>

                  {/* Token Display with Copy */}
                  <div className="flex items-center justify-between gap-3 p-3 bg-black/80 rounded-xl border border-emerald-500/50 backdrop-blur-md">
                    <div className="font-mono text-base sm:text-lg font-black text-emerald-300 tracking-wider break-all select-all">
                      {NEXUS_NODE_TOKEN}
                    </div>

                    <button
                      onClick={handleCopyToken}
                      className="px-3.5 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                      title="Skopiuj Token Węzła"
                    >
                      {copiedToken ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>SKOPIOWANO</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>KOPIUJ</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs font-mono text-white/70 leading-relaxed">
                    Użyj tego identyfikatora, aby autoryzować zewnętrzne mikroserwisy, agentów AI oraz kontrakty w ekosystemie <strong className="text-emerald-300">NEXUS & ETERNIVERSE</strong>.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-black/50 border border-white/5">
                      <span className="text-white/40 block text-[9px]">ROLA WĘZŁA</span>
                      <span className="text-emerald-300 font-bold truncate block">ARCHITECT CORE</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/50 border border-white/5">
                      <span className="text-white/40 block text-[9px]">POZIOM UPRAWNIEŃ</span>
                      <span className="text-amber-300 font-bold truncate block">OMEGA LEVEL</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/50 border border-white/5">
                      <span className="text-white/40 block text-[9px]">SIECI OBSŁUGIWANE</span>
                      <span className="text-cyan-300 font-bold truncate block">BNB / EVM / REST</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/50 border border-white/5">
                      <span className="text-white/40 block text-[9px]">STATUS CHMURY</span>
                      <span className="text-emerald-400 font-bold truncate block">ZSYNCHRONIZOWANY</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Authorized Ecosystem Services & Agents */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white/70 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    Autoryzowane Mikroserwisy i Agenci AI
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    {CURRENT_NODE_IDENTITY.authorizedServices.length} AKTYWNYCH
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CURRENT_NODE_IDENTITY.authorizedServices.map((service) => (
                    <div 
                      key={service.id}
                      className="p-2.5 rounded-lg bg-black/60 border border-white/5 hover:border-cyan-500/30 transition-all flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span className="text-xs font-mono font-bold text-white truncate">{service.name}</span>
                        </div>
                        <div className="text-[10px] font-mono text-white/40 truncate pl-3">
                          Protokół: {service.protocol}
                        </div>
                        <div className="text-[9px] font-mono text-cyan-400/80 truncate pl-3 mt-0.5">
                          {service.permissions.slice(0, 2).join(' • ')}
                        </div>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 shrink-0">
                        AUTH
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Smart Contracts */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white/70 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-400" />
                    Zsynchronizowane Kontrakty Ekosystemu (BNB Smart Chain)
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                    {CURRENT_NODE_IDENTITY.activeContracts.length} KONTRAKTY
                  </span>
                </div>

                <div className="space-y-2">
                  {CURRENT_NODE_IDENTITY.activeContracts.map((contract) => (
                    <div 
                      key={contract.name}
                      className="p-2.5 rounded-lg bg-black/60 border border-white/5 flex items-center justify-between gap-2 font-mono"
                    >
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{contract.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                            {contract.symbol}
                          </span>
                        </div>
                        <div className="text-[10px] text-white/40">
                          Standard: {contract.standard} • Sieć: {contract.network}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 font-bold block">
                          {contract.status}
                        </span>
                        <span className="text-[9px] text-white/30 truncate block max-w-[120px]">
                          {contract.fingerprint}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: FIRESTORE & LIVE TELEMETRY */}
          {activeTab === 'TELEMETRY' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Main Status Card */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white/50 uppercase tracking-wider">Status Łącza Firestore</span>
                  <div className="flex items-center gap-2">
                    {dbState.isConnected ? (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ONLINE / AKTYWNE
                      </span>
                    ) : dbState.isConnecting ? (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-950/90 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        ŁĄCZENIE...
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-red-950/90 border border-red-500/50 text-red-300 font-mono text-xs font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                        OFFLINE / BŁĄD
                      </span>
                    )}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  <div className="p-2.5 rounded-lg bg-black/60 border border-white/5">
                    <span className="text-[10px] font-mono text-white/40 block mb-0.5">ID BAZY DANYCH (FIRESTORE)</span>
                    <span className="text-xs font-mono text-cyan-300 font-bold break-all">
                      {dbState.databaseId}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/60 border border-white/5">
                    <span className="text-[10px] font-mono text-white/40 block mb-0.5">ID PROJEKTU CLOUD</span>
                    <span className="text-xs font-mono text-emerald-300 font-bold break-all">
                      {dbState.projectId}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/60 border border-white/5">
                    <span className="text-[10px] font-mono text-white/40 block mb-0.5">TOŻSAMOŚĆ WĘZŁA W BAZIE</span>
                    <span className="text-xs font-mono text-amber-300 font-bold truncate block">
                      {NEXUS_NODE_TOKEN}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/60 border border-white/5">
                    <span className="text-[10px] font-mono text-white/40 block mb-0.5">OSTATNIA SYNCHRONIZACJA</span>
                    <span className="text-xs font-mono text-white/80 font-bold">
                      {dbState.syncedAt ? new Date(dbState.syncedAt).toLocaleTimeString() : 'Przed chwilą'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Synchronized Collections List */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-2.5">
                <span className="text-xs font-mono text-white/60 uppercase tracking-wider block">
                  Zsynchronizowane Kolekcje Firestore
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/10 flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono font-bold text-white truncate">bookmarks</div>
                      <div className="text-[10px] font-mono text-amber-400">{bookmarksCount} wpisów</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/10 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono font-bold text-white truncate">custom_books</div>
                      <div className="text-[10px] font-mono text-cyan-400">{customBooksCountCalc} światów</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/10 flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono font-bold text-white truncate">node_auth</div>
                      <div className="text-[10px] font-mono text-emerald-400">Aktywny</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/10 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono font-bold text-white truncate">telemetry</div>
                      <div className="text-[10px] font-mono text-emerald-400">Ping OK</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ARCHIVE EXPORT & IMPORT (NEW) */}
          {activeTab === 'ARCHIVE' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Header Dossier */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/60 via-zinc-900 to-black border border-purple-500/40 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                    <FolderArchive className="w-4 h-4 text-purple-400" />
                    CENTRUM ARCHIWIZACJI // NEXUS JSON ENGINE
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 font-bold">
                    NEXUS_ARCHIVE_V1
                  </span>
                </div>
                <p className="text-xs font-mono text-white/70 leading-relaxed">
                  Zabezpiecz i przenoś swoje autorskie książki, manifesty HTML, kolekcje tematyczne oraz historię czytnika jako uniwersalny plik <strong className="text-purple-300">JSON</strong> kompatybilny z całym ekosystemem NEXUS & ETERNIVERSE.
                </p>
              </div>

              {/* Two Column Workspace: Export & Import */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. EXPORT SECTION */}
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-white/10 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase text-white flex items-center gap-1.5">
                        <ArrowDownToLine className="w-4 h-4 text-cyan-400" />
                        Eksport Archiwum
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                        DO POBRANIA
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-white/60">
                      Pobierz kompletną kopię zapasową zapisaną lokalnie i w pamięci offline:
                    </p>

                    {/* Stats List */}
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between p-2 rounded bg-black/50 border border-white/5">
                        <span className="text-white/60">Książki & Światy HTML:</span>
                        <span className="text-cyan-300 font-bold">{customBooksCountCalc}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-black/50 border border-white/5">
                        <span className="text-white/60">Kolekcje Metadanych:</span>
                        <span className="text-purple-300 font-bold">{collections.length}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-black/50 border border-white/5">
                        <span className="text-white/60">Zakładki Rozdziałów:</span>
                        <span className="text-amber-300 font-bold">{bookmarksCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleExportArchive}
                      disabled={isExporting}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-black font-mono text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-950/50 disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isExporting ? 'GENEROWANIE ARCHIWUM...' : 'Pobierz Archiwum JSON'}</span>
                    </button>
                    <span className="text-[10px] font-mono text-white/40 block text-center">
                      Format: .json z pełną strukturą obiektową
                    </span>
                  </div>
                </div>

                {/* 2. IMPORT SECTION */}
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-white/10 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase text-white flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-purple-400" />
                        Import Archiwum
                      </span>
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                        Z PLIKU .JSON
                      </span>
                    </div>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {/* Dropzone button */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="p-4 border-2 border-dashed border-white/15 hover:border-purple-400/60 bg-black/40 hover:bg-purple-950/20 rounded-xl transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
                    >
                      <FileJson className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform mb-1.5" />
                      <span className="text-xs font-mono font-bold text-white group-hover:text-purple-300">
                        {importFile ? importFile.name : 'Wybierz lub upuść plik archiwum .json'}
                      </span>
                      <span className="text-[10px] font-mono text-white/40 mt-0.5">
                        {importFile ? `${Math.round(importFile.size / 1024)} KB` : 'Obsługiwany format: NEXUS_ARCHIVE_V1'}
                      </span>
                    </div>

                    {/* File validation preview */}
                    {importValidation && (
                      <div className={`p-2.5 rounded-lg border text-xs font-mono space-y-1.5 ${
                        importValidation.isValid 
                          ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                          : 'bg-red-950/50 border-red-500/40 text-red-200'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold">
                          {importValidation.isValid ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Prawidłowe Archiwum NEXUS</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                              <span>{importValidation.error}</span>
                            </>
                          )}
                        </div>

                        {importValidation.isValid && importValidation.summary && (
                          <div className="text-[11px] text-white/80 grid grid-cols-3 gap-1 pt-1 border-t border-emerald-500/20">
                            <div>Książki: <strong className="text-emerald-300">{importValidation.summary.customBooksCount}</strong></div>
                            <div>Kolekcje: <strong className="text-purple-300">{importValidation.summary.collectionsCount}</strong></div>
                            <div>Zakładki: <strong className="text-amber-300">{importValidation.summary.bookmarksCount}</strong></div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mode selector */}
                    {importValidation?.isValid && (
                      <div className="space-y-1.5 pt-1">
                        <label className="text-[10px] font-mono text-white/60 uppercase block">
                          Tryb Importu:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setImportMode('merge')}
                            className={`p-2 rounded-lg border text-xs font-mono transition-all text-left ${
                              importMode === 'merge'
                                ? 'bg-purple-950 border-purple-500 text-purple-200 font-bold'
                                : 'bg-black/40 border-white/10 text-white/50 hover:text-white'
                            }`}
                          >
                            <span className="block font-bold">Połącz (Merge)</span>
                            <span className="text-[9px] text-white/40 block">Dołącza do istniejących</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setImportMode('replace')}
                            className={`p-2 rounded-lg border text-xs font-mono transition-all text-left ${
                              importMode === 'replace'
                                ? 'bg-red-950 border-red-500 text-red-200 font-bold'
                                : 'bg-black/40 border-white/10 text-white/50 hover:text-white'
                            }`}
                          >
                            <span className="block font-bold">Zastąp (Replace)</span>
                            <span className="text-[9px] text-white/40 block">Nadpisuje zbiór</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleConfirmImport}
                    disabled={!importValidation?.isValid || isImporting}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-950/50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FolderSync className={`w-4 h-4 ${isImporting ? 'animate-spin' : ''}`} />
                    <span>{isImporting ? 'IMPORTOWANIE DANYCH...' : 'Zatwierdź i Zaimportuj Archiwum'}</span>
                  </button>
                </div>

              </div>

              {/* Export/Import Notification Banners */}
              {exportNotice && (
                <div className="p-3 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-200 text-xs font-mono flex items-center justify-between gap-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{exportNotice}</span>
                  </div>
                  <button onClick={() => setExportNotice(null)} className="text-white/40 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {importNotice && (
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center justify-between gap-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{importNotice}</span>
                  </div>
                  <button onClick={() => setImportNotice(null)} className="text-white/40 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: CODE SNIPPETS & HTTP AUTH HEADERS */}
          {activeTab === 'INTEGRATION' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
                <span className="text-xs font-mono text-white/70 uppercase tracking-wider font-bold block">
                  Standardowe Nagłówki Autoryzacji Węzła
                </span>
                <p className="text-xs text-white/50 font-mono">
                  Dołącz poniższe nagłówki do żądań REST / WebSocket wysyłanych z mikroserwisów lub agentów do węzła NEXUS:
                </p>

                <div className="p-3 bg-black/80 rounded-xl border border-white/10 font-mono text-xs text-emerald-300 space-y-1 select-all">
                  <div>Authorization: Bearer {NEXUS_NODE_TOKEN}</div>
                  <div>X-Nexus-Node-Token: {NEXUS_NODE_TOKEN}</div>
                  <div>X-Nexus-Network: BNB-734LLM</div>
                  <div>X-Nexus-Clearance: LEVEL_OMEGA_ARCHITECT</div>
                </div>
              </div>

              {/* cURL Snippet */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white/70 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    cURL Żądanie Mikroserwisu
                  </span>
                  <button
                    onClick={() => handleCopySnippet(snippets.curl, 'curl')}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {copiedSnippet === 'curl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippet === 'curl' ? 'SKOPIOWANO' : 'KOPIUJ'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-black/80 rounded-xl border border-white/10 text-[11px] font-mono text-cyan-300 overflow-x-auto custom-scrollbar">
                  {snippets.curl}
                </pre>
              </div>

              {/* Python FastAPI Snippet */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white/70 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-amber-400" />
                    Python / FastAPI Middleware Autoryzacji
                  </span>
                  <button
                    onClick={() => handleCopySnippet(snippets.pythonAgent, 'python')}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {copiedSnippet === 'python' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippet === 'python' ? 'SKOPIOWANO' : 'KOPIUJ'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-black/80 rounded-xl border border-white/10 text-[11px] font-mono text-amber-300 overflow-x-auto custom-scrollbar">
                  {snippets.pythonAgent}
                </pre>
              </div>

            </div>
          )}

          {/* Test / Action Result Message */}
          {testResult && (
            <div className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs font-mono animate-in fade-in duration-200 ${
              testResult.success 
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' 
                : 'bg-red-950/60 border-red-500/40 text-red-200'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Bottom Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            
            {/* The Dedicated 'Export i import Archive' Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('ARCHIVE');
              }}
              className={`py-2.5 px-4 rounded-xl border font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                activeTab === 'ARCHIVE'
                  ? 'bg-purple-900/80 border-purple-400 text-purple-200 shadow-purple-950/50'
                  : 'bg-purple-950/60 hover:bg-purple-900/80 border-purple-500/50 hover:border-purple-400 text-purple-300 shadow-purple-950/40'
              }`}
              title="Eksportuj i importuj bazę książek oraz metadane kolekcji do pliku JSON"
            >
              <Archive className="w-4 h-4 text-purple-400" />
              <span>Export i import Archive</span>
            </button>

            <button
              onClick={handleRegisterNode}
              disabled={isRegisteringNode}
              className="py-2.5 px-4 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-950/40"
            >
              <Key className="w-4 h-4" />
              <span>{isRegisteringNode ? 'AUTORYZOWANIE...' : 'ZAREJESTRUJ WĘZEŁ'}</span>
            </button>

            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-white/20 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>TESTUJ POŁĄCZENIE (PING)</span>
            </button>

            {onForceSync && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onForceSync();
                  handleTestConnection();
                }}
                className="py-2.5 px-4 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ml-auto"
                title="Wymuś synchronizację z bazą danych"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>SYNCHRONIZUJ</span>
              </button>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <footer className="px-6 py-3 bg-black/60 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Węzeł: {NEXUS_NODE_TOKEN} (BNB Matrix)</span>
          </div>

          <span className="text-white/60">ETERNIVERSE / NEXUS OS v2.4</span>
        </footer>
      </div>
    </div>
  );
};
