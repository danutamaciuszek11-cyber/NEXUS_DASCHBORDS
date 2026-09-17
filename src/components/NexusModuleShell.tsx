import React, { useState, Component } from 'react';
import { NexusModule } from '../core/types';
import { ModuleLoader } from '../core/module-loader';
import { moduleRegistry } from '../core/module-registry';

interface NexusModuleShellProps {
  module: NexusModule | null;
  onClose: () => void;
}

class ModuleErrorBoundary extends Component {
  state = { hasError: false, error: null as Error | null };
  props!: { children: React.ReactNode; accent: string };
  setState!: (state: any) => void;

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('NexusModuleShell Error Boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 h-full flex flex-col items-center justify-center text-center bg-[#070A12]">
          <div className="w-16 h-16 rounded-2xl bg-[#FF3B5C]/15 border border-[#FF3B5C]/30 flex items-center justify-center text-[#FF3B5C] text-2xl mb-4">
            ⚠️
          </div>
          <h3 className="text-lg font-bold text-white mb-2 uppercase font-mono-tech">MODULE RUNTIME ERROR</h3>
          <p className="text-xs text-[#94A3B8] max-w-md mb-6 font-mono-tech">
            {this.state.error?.message || 'Wystąpił nieoczekiwany błąd wewnątrz izolowanego kontenera NexusModuleShell. Nexus Core i Bellas Core pozostały w pełni nienaruszone.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 rounded-xl bg-[#090C16] border border-[#FF3B5C]/40 text-[#FF3B5C] text-xs font-mono-tech uppercase tracking-wider cursor-pointer hover:bg-[#FF3B5C]/10 transition-colors"
          >
            RESETUJ KONTENER MODUŁU
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const NexusModuleShell: React.FC<NexusModuleShellProps> = ({ module, onClose = () => {} }) => {
  const [activeTab, setActiveTab] = useState<'app' | 'manifest' | 'files'>('app');
  const [uiMode, setUiMode] = useState<'window' | 'panel' | 'fullscreen'>('window');

  if (!module) return null;

  const entryUrl = ModuleLoader.loadModuleEntryPoint(module);
  const accent = module.accent || '#00E5FF';
  const capabilityAPI = moduleRegistry.getCapabilityAPI(module.id);

  const containerClasses =
    uiMode === 'fullscreen'
      ? 'fixed inset-0 z-50 bg-[#05070D] flex flex-col overflow-hidden animate-fadeIn'
      : uiMode === 'panel'
      ? 'fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-[#090C16] border-l border-[#1A2234] flex flex-col overflow-hidden shadow-[-20px_0_50px_rgba(0,0,0,0.9)] animate-fadeIn'
      : 'fixed inset-0 z-50 bg-[#05070D]/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fadeIn';

  const innerWindowClasses =
    uiMode === 'fullscreen' || uiMode === 'panel'
      ? 'w-full h-full flex flex-col bg-[#090C16] overflow-hidden'
      : 'w-full max-w-5xl h-[88vh] bg-[#090C16] border rounded-xl flex flex-col overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]';

  return (
    <div className={containerClasses}>
      <div
        className={innerWindowClasses}
        style={{ borderColor: `${accent}60`, boxShadow: `0 0 30px ${accent}20` }}
      >
        {/* NexusModuleShell Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0C101C] border-b border-[#121827]">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-3 h-3 rounded-full animate-pulse flex-shrink-0"
              style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wider font-mono-tech uppercase truncate">
                  {module.name}
                </h2>
                <span className="px-1.5 py-0.5 rounded bg-[#121827] border border-[#1A2234] text-[10px] text-[#00E5FF] font-mono-tech">
                  v{module.version || '1.0.0'}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] font-mono-tech truncate">
                NEXUS RUNTIME SHELL // NODE: {module.node || 'NODE #01'} // STATUS: {module.status}
              </p>
            </div>
          </div>

          {/* Subsystem Window Controls & UI Modes */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex bg-[#05070D] p-0.5 rounded border border-[#121827]">
              <button
                onClick={() => setUiMode('window')}
                className={`px-2.5 py-1 text-[10px] font-mono-tech rounded transition-colors cursor-pointer ${
                  uiMode === 'window' ? 'bg-[#0C101C] text-[#00E5FF]' : 'text-[#64748B] hover:text-white'
                }`}
                title="Window Mode"
              >
                WIN
              </button>
              <button
                onClick={() => setUiMode('panel')}
                className={`px-2.5 py-1 text-[10px] font-mono-tech rounded transition-colors cursor-pointer ${
                  uiMode === 'panel' ? 'bg-[#0C101C] text-[#00E5FF]' : 'text-[#64748B] hover:text-white'
                }`}
                title="Panel Mode"
              >
                PANEL
              </button>
              <button
                onClick={() => setUiMode('fullscreen')}
                className={`px-2.5 py-1 text-[10px] font-mono-tech rounded transition-colors cursor-pointer ${
                  uiMode === 'fullscreen' ? 'bg-[#0C101C] text-[#00E5FF]' : 'text-[#64748B] hover:text-white'
                }`}
                title="Fullscreen Mode"
              >
                FULL
              </button>
            </div>

            {/* View Switchers */}
            <div className="flex bg-[#05070D] p-0.5 rounded border border-[#121827]">
              <button
                onClick={() => setActiveTab('app')}
                className={`px-3 py-1 text-xs font-mono-tech rounded transition-colors cursor-pointer ${
                  activeTab === 'app' ? 'bg-[#121827] text-white shadow' : 'text-[#64748B] hover:text-white'
                }`}
              >
                APP
              </button>
              <button
                onClick={() => setActiveTab('manifest')}
                className={`px-3 py-1 text-xs font-mono-tech rounded transition-colors cursor-pointer ${
                  activeTab === 'manifest' ? 'bg-[#121827] text-white shadow' : 'text-[#64748B] hover:text-white'
                }`}
              >
                MANIFEST
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`px-3 py-1 text-xs font-mono-tech rounded transition-colors cursor-pointer ${
                  activeTab === 'files' ? 'bg-[#121827] text-white shadow' : 'text-[#64748B] hover:text-white'
                }`}
              >
                FILES
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#121827] border border-[#1A2234] flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#FF3B5C]/20 hover:border-[#FF3B5C]/40 transition-colors cursor-pointer"
              title="Close Module Shell"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Window Content with Error Boundary & Capability API Bridge */}
        <div className="flex-1 bg-[#05070D] relative overflow-hidden">
          <ModuleErrorBoundary accent={accent}>
            {activeTab === 'app' && (
              <iframe
                src={entryUrl}
                title={module.name}
                sandbox={module.shellConfig?.sandbox || "allow-scripts allow-forms allow-same-origin"}
                className="w-full h-full border-0 bg-[#070A12]"
              />
            )}

            {activeTab === 'manifest' && (
              <div className="p-6 h-full overflow-y-auto font-mono-tech text-xs text-[#38BDF8]">
                <div className="text-[#64748B] mb-2">// NEXUS RUNTIME MODULE CONTRACT & CAPABILITY BRIDGE</div>
                <pre className="bg-[#090C16] p-4 rounded border border-[#121827] text-[#00E5FF] overflow-x-auto">
                  {JSON.stringify(
                    {
                      moduleId: module.id,
                      name: module.name,
                      version: module.version,
                      description: module.description,
                      entry: module.entry,
                      type: 'nexus-module',
                      ui: { mode: uiMode },
                      capabilities: ['storage', 'ai', 'events', 'bellas-core'],
                      permissions: ['read', 'execute'],
                      node: module.node,
                      category: module.category,
                      installedAt: new Date(module.installedAt).toISOString(),
                      filesCount: module.files ? Object.keys(module.files).length : 0,
                      capabilityAPIBridge: {
                        activeModuleId: capabilityAPI.moduleId,
                        services: ['ai', 'storage', 'events', 'bellasCore'],
                      },
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="p-6 h-full overflow-y-auto font-mono-tech text-xs">
                <div className="text-[#64748B] mb-3">// ISOLATED SANDBOX FILE HIERARCHY</div>
                <div className="space-y-1">
                  {module.files &&
                    Object.keys(module.files).map((filename) => (
                      <div
                        key={filename}
                        className="p-2 rounded bg-[#090C16] border border-[#121827] flex items-center justify-between"
                      >
                        <span className="text-[#94A3B8]">{filename}</span>
                        <span className="text-[10px] text-[#00E5FF]">
                          {filename.endsWith('.svg') || filename.endsWith('.png') || filename.endsWith('.jpg')
                            ? 'IMAGE ASSET'
                            : filename === module.entry
                            ? 'PRIMARY RUNTIME ENTRY'
                            : 'SANDBOXED SCRIPT'}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </ModuleErrorBoundary>
        </div>
      </div>
    </div>
  );
};
