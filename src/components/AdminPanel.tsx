import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { ShieldAlert, Terminal } from 'lucide-react';
import { NexusModule } from '../core/types';
import { moduleRegistry } from '../core/module-registry';
import { NexusZipManager } from '../core/zip/zip-manager';
import { eventBus } from '../core/event-bus';
import { NexusAuthDiagnostics } from './NexusAuthDiagnostics';

interface AdminPanelProps {
  modules: NexusModule[];
  currentUser?: User | null;
  onTriggerLogin?: () => void;
  onClose: () => void;
  onOpenModule: (m: NexusModule) => void;
  onReplaceZip: (m: NexusModule) => void;
  onAddImages: (m: NexusModule) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  modules,
  currentUser = null,
  onTriggerLogin = () => {},
  onClose = () => {},
  onOpenModule = (_: any) => {},
  onReplaceZip = (_: any) => {},
  onAddImages = (_: any) => {},
}) => {
  const [activeTab, setActiveTab] = useState<'MODULES' | 'REGISTRY' | 'PACKAGES' | 'STORAGE' | 'AUDIT LOG' | 'SYSTEM' | 'DIAGNOSTICS'>('MODULES');
  const [selectedModuleId, setSelectedModuleId] = useState<string>(modules[0]?.id || '');
  const [editingModule, setEditingModule] = useState<NexusModule | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [roundTripStatus, setRoundTripStatus] = useState<string | null>(null);
  const [adminAuditLogs, setAdminAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'AUDIT LOG') {
      fetch('/api/nexus/audit-log?limit=100')
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d.auditLogs)) setAdminAuditLogs(d.auditLogs);
        })
        .catch(() => {});
    }
  }, [activeTab]);

  // Section 15 & 16: Guard Admin Core against unauthenticated access
  if (!currentUser) {
    return (
      <div
        id="nexus-admin-core-modal"
        className="fixed inset-0 z-50 bg-[#05070D]/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-mono-tech"
      >
        <div className="w-full max-w-md bg-[#090C16] border border-[#FF3B5C]/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(255,59,92,0.25)] text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#FF3B5C]/10 border border-[#FF3B5C]/40 mx-auto flex items-center justify-center text-[#FF3B5C] shadow-[0_0_20px_rgba(255,59,92,0.2)]">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-[0.2em]">
              NEXUS ADMIN CORE // ACCESS RESTRICTED
            </h2>
            <div className="inline-block mt-2 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#FF3B5C]/15 border border-[#FF3B5C] text-[#FF3B5C]">
              ODMOWA DOSTĘPU: UŻYTKOWNIK NIEUWIERZYTELNIONY
            </div>
            <p className="text-xs text-[#94A3B8] mt-3 leading-relaxed">
              Zarządzanie jądrem NEXUS, instalacja binarna modułów oraz modyfikacja rejestru wymagają aktywnej autoryzacji Firebase. Skrót CTRL + SHIFT + A nie stanowi obejścia zabezpieczeń.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              id="admin-auth-login-trigger"
              onClick={() => {
                onClose();
                onTriggerLogin();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#00E5FF] hover:bg-[#00c2d6] text-[#05070D] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)]"
            >
              ZALOGUJ SIĘ DO FIREBASE AUTH
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 px-4 rounded-xl bg-[#0C101C] hover:bg-[#121827] border border-[#1A2234] text-[#64748B] hover:text-white text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              ZAMKNIJ [ESC]
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentMod = modules.find((m) => m.id === selectedModuleId) || modules[0];

  const handleExportModule = async (m: NexusModule) => {
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

  const handleExportBackup = async () => {
    eventBus.emit('log', {
      tag: 'EXPORT',
      message: `COMPILING ALL ${modules.length} MODULES INTO NEXUS-MODULE-BACKUP.zip`,
      level: 'info',
    });
    await NexusZipManager.exportBackup(modules);
    eventBus.emit('log', {
      tag: 'EXPORT',
      message: 'BACKUP CREATED SUCCESSFULLY',
      level: 'success',
    });
  };

  const handleRoundTripTest = async (m: NexusModule) => {
    setRoundTripStatus('Testing round-trip import/export...');
    eventBus.emit('log', {
      tag: 'TEST',
      message: `STARTING ROUND-TRIP TEST ON [${m.name}]...`,
      level: 'info',
    });
    const res = await NexusZipManager.testModuleRoundTrip(m);
    setRoundTripStatus(res.details);
    eventBus.emit('log', {
      tag: 'TEST',
      message: res.details,
      level: res.success ? 'success' : 'error',
    });
  };

  const handleDuplicate = async (m: NexusModule) => {
    const dupId = `${m.id}-copy-${Math.floor(Math.random() * 1000)}`;
    const duplicate: NexusModule = {
      ...m,
      id: dupId,
      name: `${m.name} (CLONE)`,
      node: `NODE #${modules.length + 1 < 10 ? '0' + (modules.length + 1) : modules.length + 1}`,
      installedAt: Date.now(),
    };
    await moduleRegistry.register(duplicate, true);
    setSelectedModuleId(dupId);
  };

  const handleDelete = async (id: string) => {
    await moduleRegistry.remove(id);
    setDeleteConfirmId(null);
    if (selectedModuleId === id) {
      setSelectedModuleId(modules[0]?.id || '');
    }
  };

  return (
    <div
      id="nexus-admin-core-modal"
      className="fixed inset-0 z-50 bg-[#05070D]/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="w-full max-w-5xl h-[88vh] bg-[#090C16] border border-[#A855F7]/50 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(168,85,247,0.2)] flex flex-col font-mono-tech overflow-hidden">
        {/* Admin Header */}
        <div className="px-6 py-4 border-b border-[#121827] bg-[#0C101C] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#A855F7] shadow-[0_0_10px_#A855F7] animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white text-sm md:text-base font-bold tracking-[0.2em] uppercase">
                  NEXUS ADMIN CORE
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#A855F7]/20 border border-[#A855F7] text-[#A855F7] font-bold">
                  ADMIN MODE ● ACTIVE
                </span>
              </div>
              <div className="text-[10px] text-[#64748B] mt-0.5">
                CENTRAL SYSTEM CONTROLLER // REGISTRY, PACKAGES & LIFECYCLE MANAGEMENT
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="admin-export-backup-btn"
              onClick={handleExportBackup}
              className="px-3 py-1.5 rounded bg-[#A855F7]/10 border border-[#A855F7] hover:bg-[#A855F7] hover:text-[#05070D] text-[#A855F7] text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>⇩</span>
              <span>BACKUP ALL MODULES</span>
            </button>
            <button
              id="exit-admin-mode-btn"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded bg-[#FF3B5C]/15 border border-[#FF3B5C]/50 hover:bg-[#FF3B5C] hover:text-white text-[#FF3B5C] text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              EXIT ADMIN MODE [ESC]
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#121827] bg-[#070A12] px-6">
          {(['MODULES', 'REGISTRY', 'PACKAGES', 'STORAGE', 'AUDIT LOG', 'SYSTEM', 'DIAGNOSTICS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-[11px] font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                activeTab === tab
                  ? 'border-[#A855F7] text-[#A855F7] bg-[#A855F7]/10'
                  : 'border-transparent text-[#64748B] hover:text-[#E2E8F0]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'MODULES' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Module List (Left Column) */}
              <div className="lg:col-span-5 bg-[#05070D] border border-[#121827] rounded-lg p-3 flex flex-col h-full overflow-hidden">
                <div className="text-[10px] text-[#64748B] uppercase tracking-wider pb-2 border-b border-[#121827] flex justify-between">
                  <span>REGISTERED MODULES ({modules.length})</span>
                  <span>STATUS</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 mt-2 pr-1">
                  {modules.map((m) => {
                    const isSelected = m.id === currentMod?.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          setSelectedModuleId(m.id);
                          setEditingModule(null);
                          setRoundTripStatus(null);
                        }}
                        className={`p-2.5 rounded border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-[#A855F7]/15 border-[#A855F7] text-white shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                            : 'bg-[#090C16] border-[#121827] text-[#94A3B8] hover:bg-[#0C101C]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: m.accent || '#00E5FF' }}
                          />
                          <span className="font-bold text-[12px] truncate">{m.name}</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded border border-[#121827] bg-[#05070D] shrink-0 text-[#00D9A6]">
                          {m.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Module Details & Admin Controls (Right Column) */}
              {currentMod && (
                <div className="lg:col-span-7 bg-[#05070D] border border-[#121827] rounded-lg p-5 flex flex-col justify-between overflow-y-auto">
                  <div>
                    <div className="flex items-start justify-between gap-3 border-b border-[#121827] pb-3 mb-4">
                      <div>
                        <div className="text-[10px] text-[#A855F7] font-bold uppercase tracking-wider">
                          // MODULE INSPECTOR
                        </div>
                        <h3 className="text-white text-lg font-bold mt-0.5">{currentMod.name}</h3>
                        <div className="text-[11px] text-[#64748B] mt-0.5">
                          ID: <span className="text-[#00E5FF]">{currentMod.id}</span> • VERSION: {currentMod.version} • {currentMod.node}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenModule(currentMod)}
                          className="px-3 py-1.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#05070D] text-[10px] font-bold uppercase cursor-pointer"
                        >
                          OPEN
                        </button>
                        <button
                          onClick={() => handleExportModule(currentMod)}
                          className="px-3 py-1.5 rounded bg-[#00D9A6]/10 border border-[#00D9A6] text-[#00D9A6] hover:bg-[#00D9A6] hover:text-[#05070D] text-[10px] font-bold uppercase cursor-pointer"
                        >
                          EXPORT ZIP
                        </button>
                      </div>
                    </div>

                    {/* Metadata & Actions Grid */}
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] text-[#64748B] uppercase block mb-1">DESCRIPTION:</span>
                        <p className="text-[12px] text-[#94A3B8] bg-[#090C16] p-2.5 rounded border border-[#121827]">
                          {currentMod.description}
                        </p>
                      </div>

                      {/* Image Preview & Asset Admin */}
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-[#64748B] uppercase mb-1.5">
                          <span>MODULE IMAGES ({currentMod.images.length}/4):</span>
                          <button
                            onClick={() => onAddImages(currentMod)}
                            className="text-[#00E5FF] hover:underline cursor-pointer"
                          >
                            + ADD IMAGE
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {currentMod.images.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative group aspect-video bg-[#090C16] border border-[#121827] rounded overflow-hidden"
                            >
                              <img src={img} alt="preview" className="w-full h-full object-cover" />
                              <button
                                onClick={() => moduleRegistry.removeModuleImage(currentMod.id, idx)}
                                className="absolute top-1 right-1 w-4 h-4 rounded bg-[#FF3B5C] text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                title="Remove image"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technical Lifecycle Controls */}
                      <div className="pt-2">
                        <span className="text-[10px] text-[#64748B] uppercase block mb-2">
                          LIFECYCLE & PACKAGE ACTIONS:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <button
                            onClick={() => onReplaceZip(currentMod)}
                            className="p-2 rounded bg-[#090C16] border border-[#121827] hover:border-[#00E5FF] text-[11px] text-[#E2E8F0] hover:text-[#00E5FF] transition-colors cursor-pointer"
                          >
                            REPLACE ZIP
                          </button>
                          <button
                            onClick={() => handleDuplicate(currentMod)}
                            className="p-2 rounded bg-[#090C16] border border-[#121827] hover:border-[#A855F7] text-[11px] text-[#E2E8F0] hover:text-[#A855F7] transition-colors cursor-pointer"
                          >
                            DUPLICATE
                          </button>
                          <button
                            onClick={() => {
                              moduleRegistry.updateStatus(currentMod.id, 'OPERATIONAL');
                              eventBus.emit('log', {
                                tag: 'MODULE',
                                message: `${currentMod.name} RELOADED`,
                                level: 'info',
                              });
                            }}
                            className="p-2 rounded bg-[#090C16] border border-[#121827] hover:border-[#00D9A6] text-[11px] text-[#E2E8F0] hover:text-[#00D9A6] transition-colors cursor-pointer"
                          >
                            RELOAD
                          </button>
                          <button
                            onClick={() => handleRoundTripTest(currentMod)}
                            className="p-2 rounded bg-[#090C16] border border-[#121827] hover:border-[#FBBF24] text-[11px] text-[#E2E8F0] hover:text-[#FBBF24] transition-colors cursor-pointer"
                          >
                            ROUND-TRIP TEST
                          </button>
                        </div>

                        {roundTripStatus && (
                          <div className="mt-3 p-2 bg-[#090C16] border border-[#FBBF24]/30 rounded text-[11px] text-[#FBBF24]">
                            {roundTripStatus}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone: Delete with confirmation */}
                  <div className="mt-6 pt-4 border-t border-[#121827] flex items-center justify-between">
                    {deleteConfirmId === currentMod.id ? (
                      <div className="flex items-center gap-2 w-full justify-between bg-[#FF3B5C]/10 p-2 rounded border border-[#FF3B5C]/40">
                        <span className="text-[11px] text-[#FF3B5C] font-bold">CONFIRM PURGE MODULE?</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(currentMod.id)}
                            className="px-2.5 py-1 rounded bg-[#FF3B5C] text-white text-[10px] font-bold cursor-pointer"
                          >
                            YES, PURGE
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2.5 py-1 rounded bg-[#090C16] text-[#94A3B8] text-[10px] cursor-pointer"
                          >
                            CANCEL
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(currentMod.id)}
                        className="px-3 py-1.5 rounded bg-[#FF3B5C]/10 border border-[#FF3B5C]/30 text-[#FF3B5C] hover:bg-[#FF3B5C] hover:text-white text-[10px] font-bold uppercase transition-all cursor-pointer ml-auto"
                      >
                        DELETE MODULE
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'REGISTRY' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A855F7] font-bold uppercase tracking-wider">
                  DYNAMIC RUNTIME REGISTRY (module-registry.json)
                </span>
                <span className="text-[11px] text-[#64748B]">VERSION 1.0.0</span>
              </div>
              <pre className="p-4 bg-[#05070D] border border-[#121827] rounded-lg text-[11px] text-[#00E5FF] leading-relaxed overflow-x-auto max-h-[55vh]">
                {JSON.stringify(
                  {
                    version: '1.0.0',
                    modules: modules.map((m) => ({
                      id: m.id,
                      name: m.name,
                      version: m.version,
                      status: m.status,
                      entry: m.entry,
                      node: m.node,
                      category: m.category,
                      installedAt: m.installedAt,
                    })),
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}

          {activeTab === 'PACKAGES' && (
            <div className="space-y-4">
              <div className="text-xs text-[#A855F7] font-bold uppercase tracking-wider">
                PACKAGE & ZIP OPERATIONS
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#05070D] border border-[#121827] rounded-lg space-y-3">
                  <h4 className="text-white text-xs font-bold uppercase">SYSTEM BACKUP ARCHIVE</h4>
                  <p className="text-[11px] text-[#94A3B8]">
                    Bundles all currently registered modules, assets, manifests, and registry.json into a monolithic NEXUS-MODULE-BACKUP.zip package.
                  </p>
                  <button
                    onClick={handleExportBackup}
                    className="w-full py-2 bg-[#A855F7]/20 border border-[#A855F7] hover:bg-[#A855F7] hover:text-[#05070D] text-[#A855F7] text-xs font-bold uppercase rounded transition-all cursor-pointer"
                  >
                    GENERATE SYSTEM BACKUP
                  </button>
                </div>

                <div className="p-4 bg-[#05070D] border border-[#121827] rounded-lg space-y-3">
                  <h4 className="text-white text-xs font-bold uppercase">RESTORE DEFAULT OS MODULES</h4>
                  <p className="text-[11px] text-[#94A3B8]">
                    Re-seeds native default NEXUS operating modules (BELLA OS, FAMILY, MEDIA FORGE, NEXUSBOOK, DEV HUB, WORLDS).
                  </p>
                  <button
                    onClick={() => moduleRegistry.resetToDefaults()}
                    className="w-full py-2 bg-[#FF3B5C]/15 border border-[#FF3B5C]/50 hover:bg-[#FF3B5C] hover:text-white text-[#FF3B5C] text-xs font-bold uppercase rounded transition-all cursor-pointer"
                  >
                    RESET RUNTIME TO DEFAULTS
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'STORAGE' && (
            <div className="space-y-4">
              <div className="text-xs text-[#A855F7] font-bold uppercase tracking-wider">
                INDEXEDDB: NEXUS_DB ARCHITECTURE
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-[#05070D] border border-[#121827] rounded-lg">
                  <span className="text-[10px] text-[#64748B] block">STORE 01</span>
                  <strong className="text-white text-sm">modules</strong>
                  <div className="text-xs text-[#00E5FF] mt-1">{modules.length} entries</div>
                </div>
                <div className="p-4 bg-[#05070D] border border-[#121827] rounded-lg">
                  <span className="text-[10px] text-[#64748B] block">STORE 02</span>
                  <strong className="text-white text-sm">moduleFiles</strong>
                  <div className="text-xs text-[#00D9A6] mt-1">Virtual In-Memory FS</div>
                </div>
                <div className="p-4 bg-[#05070D] border border-[#121827] rounded-lg">
                  <span className="text-[10px] text-[#64748B] block">STORE 03</span>
                  <strong className="text-white text-sm">moduleImages</strong>
                  <div className="text-xs text-[#A855F7] mt-1">4-Image Hover Slots</div>
                </div>
                <div className="p-4 bg-[#05070D] border border-[#121827] rounded-lg">
                  <span className="text-[10px] text-[#64748B] block">STORE 04</span>
                  <strong className="text-white text-sm">settings</strong>
                  <div className="text-xs text-[#94A3B8] mt-1">Key-Value Configs</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'AUDIT LOG' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A855F7] font-bold uppercase tracking-wider">
                  NEXUS AUDIT LOG // NXL v1.0 SECURITY VIOLATIONS & CI/CD PIPELINES
                </span>
                <button
                  onClick={() => {
                    fetch('/api/nexus/audit-log?limit=100')
                      .then((r) => r.json())
                      .then((d) => {
                        if (Array.isArray(d.auditLogs)) setAdminAuditLogs(d.auditLogs);
                      })
                      .catch(() => {});
                  }}
                  className="px-2 py-1 rounded bg-[#121827] text-white text-[10px] uppercase font-bold hover:bg-[#1E293B]"
                >
                  ODŚWIEŻ
                </button>
              </div>

              <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                {adminAuditLogs.length === 0 ? (
                  <div className="p-6 text-center text-[#64748B] text-xs">
                    Brak zdarzeń audytowych.
                  </div>
                ) : (
                  adminAuditLogs.map((item) => {
                    const isViolation = item.protocol === 'NXL_SECURITY_VIOLATION' || item.status === 'BLOCKED' || item.severity === 'CRITICAL';
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border text-xs font-mono ${
                          isViolation
                            ? 'bg-[#FF3B5C]/10 border-[#FF3B5C]/40 text-[#FF3B5C]'
                            : 'bg-[#05070D] border-[#121827] text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-1 border-b border-[#121827]">
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                              isViolation ? 'bg-[#FF3B5C] text-white' : 'bg-[#00D9A6]/20 text-[#00D9A6]'
                            }`}>
                              {item.action}
                            </span>
                            <span className="text-[#64748B] text-[10px]">{item.id}</span>
                          </div>
                          <span className="text-[10px] text-[#64748B]">{new Date(item.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="pt-2 text-[11px] space-y-1">
                          <div>PROTOKÓŁ: <strong className={isViolation ? 'text-[#FF3B5C]' : 'text-[#00E5FF]'}>{item.protocol}</strong></div>
                          {item.details && (
                            <pre className="p-2 rounded bg-[#000]/30 text-[10px] text-[#94A3B8] overflow-x-auto whitespace-pre-wrap">
                              {JSON.stringify(item.details, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'SYSTEM' && (
            <div className="space-y-4">
              <div className="text-xs text-[#A855F7] font-bold uppercase tracking-wider">
                XNL ARCHITECTURE SPECIFICATION
              </div>
              <pre className="p-4 bg-[#05070D] border border-[#121827] rounded-lg text-[11px] text-[#A855F7] leading-relaxed overflow-x-auto">
{`<nexus-admin>
    <registry version="1.0.0" activeModules="${modules.length}" />
    <package-manager engine="NexusZipManager" offline="true" />
    <module-list mode="dynamic">
${modules.map((m) => `        <module id="${m.id}" version="${m.version}" status="${m.status}" />`).join('\n')}
    </module-list>
    <storage target="IndexedDB" dbName="NEXUS_DB" />
    <system-log level="verbose" />
</nexus-admin>`}
              </pre>
            </div>
          )}

          {activeTab === 'DIAGNOSTICS' && (
            <div className="space-y-4">
              <NexusAuthDiagnostics inline />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
