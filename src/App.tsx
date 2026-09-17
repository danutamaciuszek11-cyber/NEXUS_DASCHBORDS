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
import { XnlEditorModal } from './components/XnlEditorModal';
import { AdminPanel } from './components/AdminPanel';
import { NexusGateway } from './components/NexusGateway';
import { NexusProductsView } from './components/NexusProductsView';
import { NexusFamilyView } from './components/NexusFamilyView';
import { NexusNetworkModal } from './components/NexusNetworkModal';
import { NexusAboutModal } from './components/NexusAboutModal';
import { BellasCompanion } from './components/BellasCompanion';
import { XnlParser } from './xnl/xnl-parser';
import { NexusZipManager } from './core/zip/zip-manager';
import { ImageManager } from './core/image-manager';
import { auth, loginWithGoogle, logoutUser } from './core/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';

export type SortCriteria = 'Name' | 'Status' | 'Install Date';
export type ViewMode = 'gateway' | 'user' | 'creator' | 'family';

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

  // Admin Core state
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // XNL State
  const [xnlCode, setXnlCode] = useState<string>('');
  const [showXnlModal, setShowXnlModal] = useState(false);

  // Network & About Modals
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

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

    // 4. Listen to Auth changes
    const unsubAuth = onAuthStateChanged(auth, (usr) => {
      setCurrentUser(usr);
    });

    // 5. Global Shortcut Listener for CTRL+SHIFT+A (Admin Core toggle)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        const nextState = nexusCore.toggleAdminMode();
        setShowAdminPanel(nextState);
      } else if (e.key === 'Escape' && showAdminPanel) {
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
    });

    return () => {
      unsubLog();
      unsubCore();
      unsubReg();
      unsubAuth();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAdminPanel]);

  // Handle Zip file installation with full pipeline and duplicate resolution
  const handleInstallZip = async (file: File | Blob, forceOverwrite: boolean = false) => {
    setIsInstalling(true);
    setInstallError(undefined);
    setInstallConflict(undefined);
    setInstallStep('PACKAGE RECEIVED');

    const result = await nexusCore.installZipModule(
      file,
      (step) => setInstallStep(step),
      forceOverwrite
    );

    if (!result.success) {
      if (result.conflict) {
        setInstallConflict(result.conflict);
      } else {
        setInstallError(result.error);
      }
    }
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
    const parsed = XnlParser.parse(newXnl);
    eventBus.emit('log', {
      tag: 'XNL',
      message: `PARSED ${parsed.modules.length} MODULES IN DECLARATIVE TREE`,
      level: 'success',
    });
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
  const activeAccentColor = isCreator ? '#00D9A6' : isFamily ? '#A855F7' : '#00E5FF';

  return (
    <div className="min-h-screen bg-[#05070D] text-[#E2E8F0] nexus-grid-bg flex flex-col selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
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
                NEXUS <span className="text-xs font-mono-tech ml-1 px-1.5 py-0.5 rounded" style={{ color: activeAccentColor, backgroundColor: isFamily ? 'rgba(168,85,247,0.1)' : isCreator ? 'rgba(0,217,166,0.1)' : 'rgba(0,229,255,0.1)' }}>{isFamily ? 'FAMILY' : isCreator ? 'CREATOR' : isUser ? 'USER' : 'CORE'}</span>
              </h1>
            </div>

            {/* Navigation Bar: CORE / USER / CREATOR / FAMILY / NETWORK / ABOUT */}
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
                onClick={() => setShowNetworkModal(true)}
                className="px-2.5 py-1 rounded text-[#94A3B8] hover:text-[#00E5FF] hover:bg-[#090C16] transition-all cursor-pointer uppercase"
              >
                NETWORK
              </button>
              <button
                onClick={() => setShowAboutModal(true)}
                className="px-2.5 py-1 rounded text-[#94A3B8] hover:text-[#A855F7] hover:bg-[#090C16] transition-all cursor-pointer uppercase"
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

            {/* User Identity / Firebase Auth */}
            {currentUser ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-[#090C16] border border-[#00D9A6]/40 rounded">
                <span className="w-2 h-2 rounded-full bg-[#00D9A6] shadow-[0_0_6px_#00D9A6]" />
                <span className="text-[11px] font-mono-tech text-white max-w-[120px] truncate">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={() => logoutUser()}
                  className="text-[10px] font-mono-tech text-[#64748B] hover:text-[#FF3B5C] ml-1 uppercase cursor-pointer"
                >
                  DISCONNECT
                </button>
              </div>
            ) : (
              <button
                id="google-signin-btn"
                onClick={() => loginWithGoogle()}
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
            )}

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

        {viewMode === 'user' && (
          <NexusProductsView
            onBackToGateway={() => setViewMode('gateway')}
            onSwitchToTools={() => setViewMode('creator')}
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

      {/* Hidden File Input for ZIP Selection via Context Menu */}
      <input
        ref={zipInputRef}
        type="file"
        accept=".zip,application/zip,application/x-zip-compressed"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleInstallZip(e.target.files[0]);
          }
          e.target.value = '';
        }}
      />

      {/* Decentralized Mesh Network Modal */}
      {showNetworkModal && (
        <NexusNetworkModal onClose={() => setShowNetworkModal(false)} />
      )}

      {/* Ecosystem Architecture & Manifest Modal */}
      {showAboutModal && (
        <NexusAboutModal onClose={() => setShowAboutModal(false)} />
      )}

      {/* Bella Resident Companion in Bottom Right Corner */}
      <BellasCompanion />
    </div>
  );
}
