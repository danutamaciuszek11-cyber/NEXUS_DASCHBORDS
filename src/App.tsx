import React, { useState, useEffect, useRef } from 'react';
import { nexusCore, NexusCoreState } from './core/nexus-core';
import { moduleRegistry } from './core/module-registry';
import { eventBus } from './core/event-bus';
import { NexusModule, SystemLogEntry, ModuleConflict } from './core/types';
import { ModuleCard } from './components/ModuleCard';
import { EmptyModuleSlot } from './components/EmptyModuleSlot';
import { SystemTerminal } from './components/SystemTerminal';
import { SystemNav } from './components/SystemNav';
import { ModuleModal } from './components/ModuleModal';
import { ContextMenu } from './components/ContextMenu';
import { ZipInstallModal } from './components/ZipInstallModal';
import { BatchInstallModal, BatchQueueItem } from './components/BatchInstallModal';
import { XnlEditorModal } from './components/XnlEditorModal';
import { AdminPanel } from './components/AdminPanel';
import { NexusGateway } from './components/NexusGateway';
import { NexusProductsView } from './components/NexusProductsView';
import { NexusFamilyView } from './components/NexusFamilyView';
import { DashboardView } from './components/DashboardView';
import { BellasCompanion } from './components/BellasCompanion';
import { XnlParser } from './xnl/xnl-parser';
import { NXLRuntime, nxlRuntime } from './nexus/nxl-engine/runtime';
import { NexusZipManager } from './core/zip/zip-manager';
import { ImageManager } from './core/image-manager';
import { storage } from './core/storage';
import { auth, logoutUser, subscribeToAuth, NexusAuthState } from './core/firebase';
import { User } from 'firebase/auth';
import { LoginModal } from './components/LoginModal';
import { NexusAuthDiagnostics } from './components/NexusAuthDiagnostics';
import { MatrixShell } from './nexus/matrix/MatrixShell';
import { SecGuardPanel } from './nexus/secguard/SecGuardPanel';

export type SortCriteria = 'Name' | 'Status' | 'Install Date';
export type ViewMode = 'gateway' | 'user' | 'creator' | 'family' | 'dashboard' | 'matrix' | 'secguard';

export default function App() {
  const [coreState, setCoreState] = useState<NexusCoreState>(nexusCore.getState());
  const [modules, setModules] = useState<NexusModule[]>([]);
  const [sortBy, setSortBy] = useState<SortCriteria>('Install Date');
  const [viewMode, setViewMode] = useState<ViewMode>('gateway');
  const [logs, setLogs] = useState<SystemLogEntry[]>([]);
  const [selectedModule, setSelectedModule] = useState<NexusModule | null>(null);
  const [contextMenuState, setContextMenuState] = useState<{
    x: number;
    y: number;
    module: NexusModule;
  } | null>(null);

  // ZIP Installation flow state
  const [isInstalling, setIsInstalling] = useState(false);
  const [installStep, setInstallStep] = useState<string>('PACKAGE RECEIVED');
  const [installError, setInstallError] = useState<string | undefined>(undefined);
  const [installConflict, setInstallConflict] = useState<ModuleConflict | undefined>(undefined);

  // Batch ZIP Installation state
  const [batchQueue, setBatchQueue] = useState<BatchQueueItem[]>([]);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [isBatchComplete, setIsBatchComplete] = useState(false);

  // Admin Core state
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isDraggingZip, setIsDraggingZip] = useState(false);

  // XNL State
  const [xnlCode, setXnlCode] = useState<string>('');
  const [showXnlModal, setShowXnlModal] = useState(false);
  const [nxlStatus, setNxlStatus] = useState<{ success: boolean; message: string; timestamp: string }>({
    success: true,
    message: 'NXL v1.0 // HEALTHY',
    timestamp: new Date().toLocaleTimeString(),
  });

  useEffect(() => {
    try {
      const res = nxlRuntime.executeSource(xnlCode);
      setNxlStatus({
        success: res.success,
        message: res.success ? 'NXL RUNTIME HEALTHY' : 'NXL RUNTIME FAULT',
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (e: any) {
      setNxlStatus({
        success: false,
        message: e.message || 'NXL FAULT',
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  }, [xnlCode]);

  // Dashboard & NXL v1.0 Telemetry State
  const [telemetry, setTelemetry] = useState<{
    quantumCiCd: import('./types').ClusterInstance;
    synapseMesh: import('./types').ClusterInstance;
    agentSandbox: import('./types').ClusterInstance;
    ledgerEntries: import('./types').NxlLedgerEntry[];
  }>({
    quantumCiCd: {
      id: 'cluster-qcicd-01',
      name: 'Quantum CI/CD Pipeline',
      type: 'Quantum CI/CD',
      status: 'STABLE',
      instancesCount: 4,
      commitCount: 142,
      xpPoints: 4800,
      guardian: 'Aegis Security Sentinel',
      loadPercent: 32,
      throughputRps: 1250,
      latencyMs: 14,
      version: 'v3.1.0-NXL',
    },
    synapseMesh: {
      id: 'cluster-synapse-mesh',
      name: 'Synapse Event Mesh',
      type: 'Synapse Mesh',
      status: 'SYNCED',
      instancesCount: 24,
      commitCount: 890,
      xpPoints: 9200,
      guardian: 'Leo (Strażnik Mostów)',
      loadPercent: 48,
      throughputRps: 4800,
      latencyMs: 8,
      version: 'v1.0.0-PROD',
    },
    agentSandbox: {
      id: 'cluster-agent-sandbox',
      name: 'Agent Multi-Sandbox',
      type: 'Agent Sandbox',
      status: 'OPERATIONAL',
      instancesCount: 8,
      commitCount: 312,
      xpPoints: 3400,
      guardian: 'Sofia (Kuratorka)',
      loadPercent: 28,
      throughputRps: 920,
      latencyMs: 22,
      version: 'v2.4.0',
    },
    ledgerEntries: NXLRuntime.getInstance().ledger,
  });

  const handleRefreshTelemetry = () => {
    setTelemetry((prev) => ({
      quantumCiCd: {
        ...prev.quantumCiCd,
        instancesCount: Math.floor(3 + Math.random() * 4),
        throughputRps: Math.floor(1000 + Math.random() * 500),
        latencyMs: Math.floor(10 + Math.random() * 10),
      },
      synapseMesh: {
        ...prev.synapseMesh,
        instancesCount: 24,
        throughputRps: Math.floor(4500 + Math.random() * 500),
        latencyMs: Math.floor(5 + Math.random() * 8),
      },
      agentSandbox: {
        ...prev.agentSandbox,
        instancesCount: Math.floor(6 + Math.random() * 4),
        throughputRps: Math.floor(800 + Math.random() * 300),
        latencyMs: Math.floor(18 + Math.random() * 10),
      },
      ledgerEntries: [...NXLRuntime.getInstance().ledger],
    }));
    eventBus.emit('log', {
      tag: 'TELEMETRY',
      message: 'NEXUS CLUSTER TELEMETRY & NXL v1.0 RUNTIME REFRESHED',
      level: 'success',
    });
  };

  const handleRunMassAnalysis = () => {
    eventBus.emit('log', {
      tag: 'NXL v1.0',
      message: 'EXECUTING NXL GENESIS PIPELINE & TRUTH LAYER VALIDATION...',
      level: 'info',
    });
    try {
      const res = NXLRuntime.getInstance().executeSource(`
        define nexus_core
        state nexus_root.status : BellasStatus = BellasStatus.SECURE
        state synapse_mesh.nodes : Number = 24
        assert nexus_root.status == SECURE
        assert synapse_mesh.nodes == 24
      `);
      eventBus.emit('log', {
        tag: 'NXL v1.0',
        message: `GENESIS PIPELINE SUCCESS: ${res.truthReports.length} assertions verified. Ledger size: ${res.ledger.length}`,
        level: 'success',
      });
      setTelemetry((prev) => ({ ...prev, ledgerEntries: [...res.ledger] }));
    } catch (e: any) {
      eventBus.emit('log', {
        tag: 'NXL v1.0',
        message: `Pipeline execution error: ${e.message}`,
        level: 'error',
      });
    }
  };

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [authState, setAuthState] = useState<NexusAuthState>('AUTH_LOADING');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showAuthDiagnostics, setShowAuthDiagnostics] = useState<boolean>(false);

  // Hidden file inputs for context menu actions
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const zipInputRef = useRef<HTMLInputElement | null>(null);
  const targetModuleForActionRef = useRef<NexusModule | null>(null);

  useEffect(() => {
    // 1. Listen to logs
    const unsubLog = eventBus.on<Omit<SystemLogEntry, 'id' | 'timestamp'>>('log', (data) => {
      const entry: SystemLogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        tag: data.tag,
        message: data.message,
        level: data.level || 'info',
      };
      setLogs((prev) => [...prev.slice(-120), entry]);
    });

    // 2. Listen to core state updates
    const unsubCore = eventBus.on<NexusCoreState>('core:state', (st) => {
      setCoreState(st);
      if (st.adminMode !== undefined) {
        setShowAdminPanel(st.adminMode);
      }
    });

    // 3. Listen to registry updates
    const unsubReg = eventBus.on<NexusModule[]>('registry:updated', (allMods) => {
      setModules(allMods);
      setXnlCode(XnlParser.generateDefaultXnl(allMods.map((m) => m.id)));
    });

    // 4. Listen to Auth changes with real state and diagnostics tracking
    const unsubAuth = subscribeToAuth((usr, state) => {
      setCurrentUser(usr);
      setAuthState(state);
    });

    // 5. Global Shortcut Listener for CTRL+SHIFT+A (Admin Core toggle)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        const nextState = nexusCore.toggleAdminMode();
        setShowAdminPanel(nextState);
      } else if (e.key === 'Escape') {
        nexusCore.setAdminMode(false);
        setShowAdminPanel(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Boot the core
    nexusCore.boot().then(() => {
      const initialMods = moduleRegistry.getAll();
      setModules(initialMods);
      setXnlCode(XnlParser.generateDefaultXnl(initialMods.map((m) => m.id)));
    }).catch((err) => {
      console.warn('[NEXUS BOOT WARNING]', err);
    });

    return () => {
      if (typeof unsubLog === 'function') {
        try { unsubLog(); } catch (err) { console.warn('unsubLog err', err); }
      }
      if (typeof unsubCore === 'function') {
        try { unsubCore(); } catch (err) { console.warn('unsubCore err', err); }
      }
      if (typeof unsubReg === 'function') {
        try { unsubReg(); } catch (err) { console.warn('unsubReg err', err); }
      }
      if (typeof unsubAuth === 'function') {
        try { unsubAuth(); } catch (err) { console.warn('unsubAuth err', err); }
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle Zip file installation with full pipeline and duplicate resolution
  const handleInstallZip = async (file: File | Blob, forceOverwrite: boolean = false) => {
    setIsInstalling(true);
    setInstallError(undefined);
    setInstallConflict(undefined);
    setInstallStep('PACKAGE RECEIVED');

    try {
      const result = await nexusCore.installZipModule(
        file,
        (step) => setInstallStep(step),
        forceOverwrite
      );

      if (result.success && result.module) {
        const extractedModule = result.module;

        // 1. Explicitly persist to IndexedDB storage
        try {
          await storage.saveModule(extractedModule);
          await storage.savePackageBlob(extractedModule.id, file);
        } catch (dbErr) {
          console.warn('[STORAGE NOTICE] Direct storage write fallback:', dbErr);
        }

        // 2. State updates with real extracted module
        const allMods = moduleRegistry.getAll();
        setModules(allMods);
        setSelectedModule(extractedModule);

        // Update XNL blueprint with newly installed module
        try {
          setXnlCode(XnlParser.generateDefaultXnl(allMods.map((m) => m.id)));
        } catch (e) {
          // ignore
        }

        eventBus.emit('log', {
          tag: 'ZIP DEPLOY',
          message: `REAL EXTRACTION APPLIED: [${extractedModule.name}] READY WITH ${Object.keys(extractedModule.files || {}).length} FILES`,
          level: 'success',
        });

        // Close install modal after brief confirmation display
        setTimeout(() => {
          setIsInstalling(false);
          setInstallStep('PACKAGE RECEIVED');
        }, 500);
      } else {
        if (result.conflict) {
          setInstallConflict(result.conflict);
        } else {
          setInstallError(result.error || 'Failed to extract and install module package.');
        }
      }
    } catch (err: any) {
      setInstallError(err.message || 'Unexpected failure during module extraction');
    }
  };

  // Handle batch ZIP installation queue sequentially
  const handleBatchInstall = async (files: File[]) => {
    const zipFiles = files.filter(f => f.name.endsWith('.zip') || f.type.includes('zip'));
    if (zipFiles.length === 0) return;

    if (zipFiles.length === 1) {
      await handleInstallZip(zipFiles[0]);
      return;
    }

    const items: BatchQueueItem[] = zipFiles.map(f => ({
      id: Math.random().toString(),
      name: f.name,
      file: f,
      status: 'pending',
    }));

    setBatchQueue(items);
    setShowBatchModal(true);
    setIsBatchComplete(false);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      setBatchQueue(prev => prev.map((it, idx) => idx === i ? { ...it, status: 'installing' } : it));

      const result = await nexusCore.installZipModule(
        item.file,
        () => {},
        true
      );

      if (result.success) {
        setBatchQueue(prev => prev.map((it, idx) => idx === i ? { ...it, status: 'success' } : it));
        eventBus.emit('log', {
          tag: 'BATCH',
          message: `BATCH ITEM INSTALLED: ${item.name}`,
          level: 'success',
        });
      } else {
        setBatchQueue(prev => prev.map((it, idx) => idx === i ? { ...it, status: 'error', error: result.error || 'Installation fault' } : it));
        eventBus.emit('log', {
          tag: 'BATCH ERROR',
          message: `BATCH ITEM FAILED (${item.name}): ${result.error}`,
          level: 'error',
        });
      }
    }

    setIsBatchComplete(true);
    setModules(await moduleRegistry.getAll());
  };

  // Generate Sample ZIP on the fly and install it
  const handleTestSampleZip = async () => {
    try {
      eventBus.emit('log', {
        tag: 'GENERATOR',
        message: 'COMPILING SYNTHETIC NEXUS AUDIO MATRIX MODULE...',
        level: 'info',
      });
      const blob = await NexusZipManager.createSampleZip(
        'nexus-audio-matrix',
        'NEXUS AUDIO MATRIX',
        '#00E5FF',
        'Real-time frequency visualizer and decentralized acoustic telemetry bus.',
        'AUDIO'
      );
      await handleInstallZip(blob);
    } catch (e: any) {
      eventBus.emit('log', {
        tag: 'ERROR',
        message: `Sample compilation failed: ${e.message}`,
        level: 'error',
      });
    }
  };

  // Add Image to Module
  const handleAddImage = async (moduleId: string, file: File) => {
    if (!ImageManager.validateImageFile(file)) {
      eventBus.emit('log', {
        tag: 'IMAGE ERROR',
        message: 'Unsupported format. Allowed: PNG, JPG, JPEG, WEBP, SVG.',
        level: 'error',
      });
      return;
    }
    const dataUrl = await ImageManager.fileToDataUrl(file);
    await moduleRegistry.addModuleImage(moduleId, dataUrl);
  };

  // Export module directly as ZIP
  const handleExportModuleZip = async (m: NexusModule) => {
    eventBus.emit('log', {
      tag: 'EXPORT',
      message: `MODULE COLLECTED: [${m.name}]`,
      level: 'info',
    });
    eventBus.emit('log', {
      tag: 'ZIP',
      message: 'WRITING PACKAGE WITH MANIFEST & ASSETS...',
      level: 'info',
    });
    await NexusZipManager.exportZip(m, true);
    eventBus.emit('log', {
      tag: 'EXPORT',
      message: 'COMPLETE',
      level: 'success',
    });
  };

  // Context Menu handlers
  const handleContextMenu = (e: React.MouseEvent, module: NexusModule) => {
    e.preventDefault();
    setContextMenuState({
      x: e.clientX,
      y: e.clientY,
      module,
    });
  };

  const handleApplyXnl = (newXnl: string) => {
    setXnlCode(newXnl);
    try {
      const res = nxlRuntime.executeSource(newXnl);
      setNxlStatus({
        success: res.success,
        message: res.success ? 'NXL RUNTIME HEALTHY' : 'NXL RUNTIME FAULT',
        timestamp: new Date().toLocaleTimeString(),
      });
      const parsed = XnlParser.parse(newXnl);
      eventBus.emit('log', {
        tag: 'XNL',
        message: `PARSED ${parsed.modules.length} MODULES IN DECLARATIVE TREE. NXL Health: ${res.success ? 'SUCCESS' : 'ERROR'}`,
        level: res.success ? 'success' : 'error',
      });
    } catch (e: any) {
      setNxlStatus({
        success: false,
        message: e.message,
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  };

  // Sort modules according to user selection
  const sortedModules = [...modules].sort((a, b) => {
    if (sortBy === 'Name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'Status') {
      return a.status.localeCompare(b.status);
    }
    return b.installedAt - a.installedAt;
  });

  const isUser = viewMode === 'user';
  const isCreator = viewMode === 'creator';
  const isFamily = viewMode === 'family';
  const isMatrix = viewMode === 'matrix';
  const activeAccentColor = isMatrix ? '#ffd700' : isCreator ? '#00D9A6' : isFamily ? '#A855F7' : '#00E5FF';

  return (
    <div
      className="min-h-screen bg-[#05070D] text-[#E2E8F0] nexus-grid-bg flex flex-col selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]"
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items && Array.from(e.dataTransfer.items).some((i) => (i as DataTransferItem).kind === 'file' || (i as DataTransferItem).type?.includes('zip'))) {
          setIsDraggingZip(true);
        }
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingZip(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingZip(false);
        const files = Array.from(e.dataTransfer.files || []).map(f => f as File).filter(
          (f) => f.name.endsWith('.zip') || f.type.includes('zip')
        );
        if (files.length === 1) {
          handleInstallZip(files[0]);
        } else if (files.length > 1) {
          handleBatchInstall(files);
        }
      }}
    >
      {isDraggingZip && (
        <div className="fixed inset-0 z-50 bg-[#00D9A6]/15 backdrop-blur-md border-4 border-dashed border-[#00D9A6] flex items-center justify-center pointer-events-none animate-pulse">
          <div className="bg-[#090C16] border-2 border-[#00D9A6] px-10 py-8 rounded-2xl shadow-[0_0_60px_rgba(0,217,166,0.6)] text-center">
            <div className="text-4xl mb-3">📦</div>
            <div className="text-white text-xl font-bold font-mono-tech tracking-widest uppercase">
              DROP MODULE PACKAGE
            </div>
            <div className="text-xs text-[#00D9A6] font-mono-tech mt-2">
              RELEASE *.ZIP TO INITIATE NEXUS INSTALLATION PIPELINE
            </div>
          </div>
        </div>
      )}
      {/* Top System Header */}
      <header
        id="nexus-top-header"
        className="w-full bg-[#070A12]/95 border-b sticky top-0 z-40 backdrop-blur-md transition-colors duration-300"
        style={{
          borderBottomColor: isFamily ? 'rgba(168, 85, 247, 0.3)' : isCreator ? 'rgba(0, 217, 166, 0.3)' : 'rgba(0, 229, 255, 0.3)',
          boxShadow: `0 4px 20px ${isFamily ? 'rgba(168, 85, 247, 0.08)' : isCreator ? 'rgba(0, 217, 166, 0.08)' : 'rgba(0, 229, 255, 0.08)'}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Main Title & Global Navigation Links */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewMode('gateway')}>
              <span
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: activeAccentColor,
                  boxShadow: `0 0 12px ${activeAccentColor}`,
                }}
              />
              <h1 className="text-xl md:text-2xl font-bold tracking-[0.18em] text-white font-sans uppercase">
                NEXUS <span className="text-xs font-mono-tech ml-1 px-1.5 py-0.5 rounded" style={{ color: activeAccentColor, backgroundColor: isMatrix ? 'rgba(255,215,0,0.1)' : isFamily ? 'rgba(168,85,247,0.1)' : isCreator ? 'rgba(0,217,166,0.1)' : 'rgba(0,229,255,0.1)' }}>{isMatrix ? 'MATRYCA' : isFamily ? 'FAMILY' : isCreator ? 'CREATOR' : isUser ? 'USER' : 'CORE'}</span>
              </h1>
            </div>

            {/* Navigation Bar: CORE / DASHBOARD / USER / CREATOR / FAMILY / NETWORK / ABOUT */}
            <nav className="flex items-center gap-1.5 text-xs font-mono-tech">
              <button
                onClick={() => setViewMode('gateway')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer uppercase ${
                  viewMode === 'gateway'
                    ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#090C16]'
                }`}
              >
                CORE
              </button>

              <button
                onClick={() => setViewMode('user')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer uppercase ${
                  viewMode === 'user'
                    ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#090C16]'
                }`}
              >
                USER
              </button>
              <button
                onClick={() => setViewMode('creator')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer uppercase ${
                  viewMode === 'creator'
                    ? 'bg-[#00D9A6]/20 text-[#00D9A6] border border-[#00D9A6]/40 shadow-[0_0_15px_rgba(0,217,166,0.3)]'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#090C16]'
                }`}
              >
                CREATOR
              </button>
              <button
                onClick={() => setViewMode('family')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer uppercase ${
                  viewMode === 'family'
                    ? 'bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#090C16]'
                }`}
              >
                FAMILY
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer uppercase ${
                  viewMode === 'matrix'
                    ? 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#090C16]'
                }`}
              >
                MATRYCA
              </button>
              <button
                onClick={() => setViewMode('secguard')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer uppercase ${
                  viewMode === 'secguard'
                    ? 'bg-cyan-400/20 text-cyan-200 border border-cyan-300/40'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#090C16]'
                }`}
              >
                STRAŻ
              </button>
              <button
                onClick={() => {
                  eventBus.emit('log', {
                    tag: 'NETWORK',
                    message: 'NEXUS Decentralized Mesh Network: 24 nodes online, zero latency telemetry active.',
                    level: 'info',
                  });
                }}
                className="px-2.5 py-1 rounded text-[#94A3B8] hover:text-white hover:bg-[#090C16] transition-all cursor-pointer uppercase"
              >
                NETWORK
              </button>
              <button
                onClick={() => {
                  eventBus.emit('log', {
                    tag: 'ABOUT',
                    message: 'NEXUS Ecosystem v3.5 // One Core. Three Paths. One Nexus. Architect: Maciej / Eterion.',
                    level: 'info',
                  });
                }}
                className="px-2.5 py-1 rounded text-[#94A3B8] hover:text-white hover:bg-[#090C16] transition-all cursor-pointer uppercase"
              >
                ABOUT
              </button>
            </nav>
          </div>

          {/* System Control Badges & Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* NEXUS ADMIN CORE trigger button */}
            <button
              id="nexus-admin-core-toggle"
              onClick={() => {
                const nextState = nexusCore.toggleAdminMode();
                setShowAdminPanel(nextState);
              }}
              className="px-3 py-1.5 rounded bg-[#A855F7]/15 border border-[#A855F7]/60 hover:border-[#A855F7] text-[#A855F7] text-[11px] font-mono-tech tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.15)]"
            >
              <span className="w-2 h-2 rounded-full bg-[#A855F7] shadow-[0_0_6px_#A855F7]" />
              <span>ADMIN CORE</span>
            </button>

            {/* XNL Architecture button */}
            <button
              id="xnl-editor-toggle"
              onClick={() => setShowXnlModal(true)}
              className="px-3 py-1.5 rounded bg-[#090C16] border border-[#A855F7]/40 hover:border-[#A855F7] text-[#A855F7] text-[11px] font-mono-tech tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>&lt;/&gt;</span>
              <span>XNL</span>
            </button>

            {/* Test Sample Zip Generator */}
            <button
              id="quick-sample-install"
              onClick={handleTestSampleZip}
              className="px-3 py-1.5 rounded bg-[#090C16] border text-[11px] font-mono-tech tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
              style={{
                borderColor: `${activeAccentColor}66`,
                color: activeAccentColor,
              }}
            >
              <span>+</span>
              <span>SAMPLE ZIP</span>
            </button>

            {/* Real Firebase Authentication & User State */}
            {currentUser ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-[#090C16] border border-[#00D9A6]/40 rounded">
                <span className="w-2 h-2 rounded-full bg-[#00D9A6] shadow-[0_0_6px_#00D9A6]" />
                <span
                  className="text-[11px] font-mono-tech text-white max-w-[130px] truncate"
                  title={currentUser.email || currentUser.uid}
                >
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  id="auth-logout-btn"
                  onClick={() => logoutUser()}
                  className="text-[10px] font-mono-tech text-[#64748B] hover:text-[#FF3B5C] ml-1 uppercase cursor-pointer"
                >
                  DISCONNECT
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="google-signin-btn"
                  onClick={() => setShowLoginModal(true)}
                  className="px-3 py-1.5 rounded border text-[11px] font-mono-tech tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                  style={{
                    backgroundColor: `${activeAccentColor}15`,
                    borderColor: activeAccentColor,
                    color: activeAccentColor,
                    boxShadow: `0 0 12px ${activeAccentColor}33`,
                  }}
                >
                  <span>LOGIN</span>
                </button>
              </div>
            )}

            {/* Auth Diagnostics trigger */}
            <button
              id="nexus-auth-diag-trigger-btn"
              onClick={() => setShowAuthDiagnostics(true)}
              className="px-2.5 py-1.5 rounded bg-[#090C16] border border-[#A855F7]/40 text-[#A855F7] hover:border-[#A855F7] text-[10px] font-mono-tech tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1"
              title="Otwórz panel NEXUS AUTH DIAGNOSTICS"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" />
              <span className="hidden sm:inline">AUTH DIAG</span>
            </button>

            {/* NEXUS NODE badge */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[#090C16] rounded text-[11px] font-mono-tech transition-colors"
              style={{
                borderColor: `${activeAccentColor}66`,
                borderWidth: '1px',
                color: activeAccentColor,
              }}
            >
              <span
                className="status-dot active"
                style={{ backgroundColor: activeAccentColor }}
              />
              <span>NEXUS NODE #01</span>
            </div>
          </div>
        </div>

        {/* System Status Bar */}
        <div
          id="nexus-system-status-bar"
          className="bg-[#05070D] border-t border-[#101522] px-4 py-2"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 text-[11px] font-mono-tech">
            <div className="flex items-center gap-4">
              <span
                className="flex items-center gap-1.5 transition-colors"
                style={{ color: activeAccentColor }}
              >
                <span
                  className="status-dot active"
                  style={{ backgroundColor: activeAccentColor }}
                />
                CORE ONLINE ({viewMode.toUpperCase()} PATH)
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="flex items-center gap-1.5 text-white">
                <span className="status-dot bg-[#A855F7]" />
                MODULES {modules.length < 10 ? `0${modules.length}` : modules.length}
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="flex items-center gap-1.5 text-[#00D9A6]">
                <span className="status-dot bg-[#00D9A6]" />
                SYSTEM READY
              </span>
              <span className="text-[#64748B]">•</span>
              <span
                className="flex items-center gap-1.5 cursor-pointer transition-colors"
                style={{ color: nxlStatus.success ? '#00D9A6' : '#FF3B5C' }}
                title={`NXL Runtime Status: ${nxlStatus.message} @ ${nxlStatus.timestamp}`}
              >
                <span
                  className="status-dot animate-pulse"
                  style={{ backgroundColor: nxlStatus.success ? '#00D9A6' : '#FF3B5C' }}
                />
                NXL: {nxlStatus.success ? 'HEALTHY' : 'FAULT'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[#64748B]">
              <span>ACTIVE ZONE: <strong className="uppercase" style={{ color: activeAccentColor }}>{viewMode}</strong></span>
              <span>//</span>
              <button
                onClick={() => moduleRegistry.resetToDefaults()}
                className="hover:text-white transition-colors cursor-pointer uppercase"
                title="Reset to initial default system modules"
              >
                RESTORE DEFAULTS
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Operating Workspace */}
      <main className="flex-1 w-full flex flex-col">
        {viewMode === 'gateway' && (
          <NexusGateway
            onSelectUser={() => setViewMode('user')}
            onSelectCreator={() => setViewMode('creator')}
            onSelectFamily={() => setViewMode('family')}
          />
        )}

        {viewMode === 'dashboard' && (
          <DashboardView
            telemetry={telemetry}
            onRunMassAnalysis={handleRunMassAnalysis}
            onRefreshTelemetry={handleRefreshTelemetry}
            xpPoints={14200}
          />
        )}

        {viewMode === 'user' && (
          <NexusProductsView
            onBackToGateway={() => setViewMode('gateway')}
            onSwitchToTools={() => setViewMode('creator')}
          />
        )}

        {viewMode === 'secguard' && <SecGuardPanel />}

        {viewMode === 'matrix' && (
          <MatrixShell
            userId={currentUser?.uid || null}
            displayName={currentUser?.displayName || currentUser?.email || null}
            onOpenScribe={() => setShowXnlModal(true)}
          />
        )}

        {viewMode === 'family' && (
          <NexusFamilyView
            onBackToGateway={() => setViewMode('gateway')}
            onSwitchToCreator={() => setViewMode('creator')}
            onSwitchToUser={() => setViewMode('user')}
          />
        )}

        {viewMode === 'creator' && (
          <div className="max-w-7xl w-full mx-auto px-4 py-6 flex flex-col gap-6 flex-1">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setViewMode('gateway')}
                className="px-3 py-1.5 rounded-lg bg-[#090C16] hover:bg-[#121827] border border-[#00D9A6]/30 text-[#00D9A6] text-xs font-mono-tech flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>← POWRÓT DO NEXUS GATEWAY</span>
              </button>
              <div className="text-xs font-mono-tech text-[#64748B]">
                NEXUS CREATOR // LOCAL NODE WORKSPACE
              </div>
            </div>

            {/* Module Grid Section */}
            <section id="nexus-module-grid" className="w-full">
              {/* Module Grid Header with Sorting Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-[#121827]">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono-tech text-[#00D9A6] tracking-widest uppercase font-bold">
                    // CENTRAL MODULE ARCHIVE
                  </span>
                  <span className="text-[10px] font-mono-tech text-[#64748B]">
                    ({modules.length} REGISTERED)
                  </span>
                </div>

                {/* Sorting Dropdown & Instructions */}
                <div className="flex items-center gap-3">
                  <button
                    id="install-module-zip-btn"
                    onClick={() => zipInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-[#090C16] hover:bg-[#121827] border border-[#00D9A6]/60 text-[#00D9A6] text-xs font-mono-tech flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_12px_rgba(0,217,166,0.2)] hover:shadow-[0_0_18px_rgba(0,217,166,0.4)]"
                  >
                    <span>+ INSTALUJ MODUŁ ZIP</span>
                  </button>

                  <div className="flex items-center gap-2 bg-[#090C16] border border-[#00D9A6]/30 hover:border-[#00D9A6]/60 px-3 py-1 rounded transition-colors">
                    <span className="text-[10px] font-mono-tech text-[#64748B] uppercase tracking-wider">
                      SORT BY:
                    </span>
                    <select
                      id="module-sort-dropdown"
                      value={sortBy}
                      onChange={(e) => {
                        const newSort = e.target.value as SortCriteria;
                        setSortBy(newSort);
                        eventBus.emit('log', {
                          tag: 'REGISTRY',
                          message: `MODULE ARCHIVE SORT ORDER: [${newSort.toUpperCase()}]`,
                          level: 'info',
                        });
                      }}
                      className="bg-transparent text-[11px] font-mono-tech text-[#00D9A6] focus:outline-none cursor-pointer pr-1"
                    >
                      <option value="Name" className="bg-[#090C16] text-[#E2E8F0]">Name</option>
                      <option value="Status" className="bg-[#090C16] text-[#E2E8F0]">Status</option>
                      <option value="Install Date" className="bg-[#090C16] text-[#E2E8F0]">Install Date</option>
                    </select>
                  </div>

                  <div className="text-[11px] font-mono-tech text-[#64748B] hidden lg:block">
                    HOVER FOR 4-IMAGE SEQUENCE • RIGHT CLICK FOR CONTEXT
                  </div>
                </div>
              </div>

              {/* Dynamic Responsive Module Grid: 3-col on desktop, 2-col on tablet, 1-col on mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {sortedModules.map((mod) => (
                  <ModuleCard
                    key={mod.id}
                    module={mod}
                    onOpen={(m) => setSelectedModule(m)}
                    onContextMenu={handleContextMenu}
                    onAddImage={handleAddImage}
                    onDropZipOnCard={(file) => handleInstallZip(file)}
                  />
                ))}

                {/* Native NEXUS Empty Module Slot for ZIP installation */}
                <EmptyModuleSlot
                  onDropZip={(file) => handleInstallZip(file)}
                  onDropFiles={(files) => handleBatchInstall(files)}
                  onSelectZip={() => {
                    zipInputRef.current?.click();
                  }}
                  onGenerateSample={handleTestSampleZip}
                />
              </div>
            </section>

            {/* Collapsible System Terminal at Bottom */}
            <section className="mt-auto pt-2">
              <SystemTerminal
                logs={logs}
                onClear={() => setLogs([])}
              />
            </section>
          </div>
        )}
      </main>

      {/* Bottom System Navigation (BELLA OS concept) */}
      <SystemNav
        activeSection={coreState.activeSection}
        onSelectSection={(sec) => nexusCore.setActiveSection(sec)}
      />

      {/* Module Sandboxed Execution Modal */}
      <ModuleModal
        module={selectedModule}
        onClose={() => setSelectedModule(null)}
      />

      {/* Contextual Menu on Right Click */}
      {contextMenuState && (
        <ContextMenu
          x={contextMenuState.x}
          y={contextMenuState.y}
          module={contextMenuState.module}
          onClose={() => setContextMenuState(null)}
          onOpen={() => setSelectedModule(contextMenuState.module)}
          onReload={() => {
            moduleRegistry.updateStatus(contextMenuState.module.id, 'OPERATIONAL');
            eventBus.emit('log', {
              tag: 'MODULE',
              message: `${contextMenuState.module.name} OPERATIONAL`,
              level: 'info',
            });
          }}
          onExportZip={() => handleExportModuleZip(contextMenuState.module)}
          onReplaceZip={() => {
            targetModuleForActionRef.current = contextMenuState.module;
            zipInputRef.current?.click();
          }}
          onAddImages={() => {
            targetModuleForActionRef.current = contextMenuState.module;
            imageInputRef.current?.click();
          }}
          onViewInfo={() => setSelectedModule(contextMenuState.module)}
          onRemove={() => moduleRegistry.remove(contextMenuState.module.id)}
        />
      )}

      {/* ZIP Installation Pipeline Modal */}
      {isInstalling && (
        <ZipInstallModal
          currentStep={installStep}
          error={installError}
          conflict={installConflict}
          onReplace={() => {
            if (installConflict) {
              handleInstallZip(installConflict.pendingFile, true);
            }
          }}
          onClose={() => {
            setIsInstalling(false);
            setInstallConflict(undefined);
          }}
        />
      )}

      {/* Hidden NEXUS ADMIN CORE Modal */}
      {showAdminPanel && (
        <AdminPanel
          modules={modules}
          currentUser={currentUser}
          onTriggerLogin={() => setShowLoginModal(true)}
          onClose={() => {
            nexusCore.setAdminMode(false);
            setShowAdminPanel(false);
          }}
          onOpenModule={(m) => {
            setSelectedModule(m);
            setShowAdminPanel(false);
          }}
          onReplaceZip={(m) => {
            targetModuleForActionRef.current = m;
            zipInputRef.current?.click();
          }}
          onAddImages={(m) => {
            targetModuleForActionRef.current = m;
            imageInputRef.current?.click();
          }}
        />
      )}

      {/* XNL Declarative UI Modal */}
      {showXnlModal && (
        <XnlEditorModal
          xnlCode={xnlCode}
          onApply={handleApplyXnl}
          onClose={() => setShowXnlModal(false)}
        />
      )}

      {/* Hidden File Input for Image Addition via Context Menu */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0] && targetModuleForActionRef.current) {
            handleAddImage(targetModuleForActionRef.current.id, e.target.files[0]);
          }
          e.target.value = '';
        }}
      />

      {/* Batch ZIP Installation Modal */}
      {showBatchModal && (
        <BatchInstallModal
          queue={batchQueue}
          isComplete={isBatchComplete}
          onClose={() => {
            setShowBatchModal(false);
            setBatchQueue([]);
          }}
        />
      )}

      {/* Hidden File Input for ZIP Selection via Context Menu */}
      <input
        ref={zipInputRef}
        type="file"
        multiple
        accept=".zip,application/zip,application/x-zip-compressed"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files as FileList);
            if (files.length === 1) {
              handleInstallZip(files[0]);
            } else {
              handleBatchInstall(files);
            }
          }
          e.target.value = '';
        }}
      />

      {/* Real Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onOpenDiagnostics={() => setShowAuthDiagnostics(true)}
      />

      {/* Real Auth Diagnostics Modal */}
      {showAuthDiagnostics && (
        <NexusAuthDiagnostics onClose={() => setShowAuthDiagnostics(false)} />
      )}

      {/* Bella Resident Companion in Bottom Right Corner */}
      <BellasCompanion />
    </div>
  );
}
