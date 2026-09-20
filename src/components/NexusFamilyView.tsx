import React, { useState } from 'react';
import { Shield, Cpu, Zap, Terminal, Layers, ArrowLeft, ExternalLink, Code2, Lock, GitBranch, Server, Activity, Users, Compass, Globe, Radio, Database, HardDrive, CheckCircle2 } from 'lucide-react';
import { eventBus } from '../core/event-bus';
import { nexusCore, NexusCoreState } from '../core/nexus-core';

interface NexusFamilyViewProps {
  onBackToGateway: () => void;
  onSwitchToCreator: () => void;
  onSwitchToUser: () => void;
}

export const NexusFamilyView: React.FC<NexusFamilyViewProps> = ({
  onBackToGateway = () => {},
  onSwitchToCreator = () => {},
  onSwitchToUser = () => {},
}) => {
  const [coreState] = useState<NexusCoreState>(nexusCore.getState());
  const [activeMainTab, setActiveMainTab] = useState<'ARCHITECTS' | 'BELLAS_CORE' | 'STATE_BELLA' | 'COMMS'>('ARCHITECTS');
  const [architectSubTab, setArchitectSubTab] = useState<'MAP' | 'PROJECTS' | 'MISSIONS' | 'BROTHERHOOD' | 'CATALOG' | 'COLLAB'>('MAP');
  const [bellasSubTab, setBellasSubTab] = useState<'KERNELS' | 'ORCHESTRATION' | 'RUNTIME' | 'ZIP' | 'DEPENDENCIES' | 'PERMISSIONS' | 'NODE' | 'BRIDGE' | 'TELEMETRY' | 'SERVICES'>('KERNELS');

  const handleProtocolAction = (actionName: string) => {
    eventBus.emit('log', {
      tag: 'FAMILY & BELLAS CORE',
      message: `EXECUTING PROTOCOL: [${actionName.toUpperCase()}]`,
      level: 'success',
    });
    alert(`Protokół systemowy [${actionName}] został pomyślnie wykonany w BELLAS CORE.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 w-full flex flex-col gap-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#A855F7]/30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToGateway}
            className="px-3 py-1.5 rounded-lg bg-[#090C16] hover:bg-[#121827] border border-[#A855F7]/40 text-[#A855F7] text-xs font-mono-tech flex items-center gap-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>POWRÓT DO GATEWAY</span>
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7] shadow-[0_0_12px_#A855F7]" />
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider uppercase font-sans">
                RODZINA NEXUS & BELLAS CORE
              </h2>
              <a
                href="https://github.com/danutamaciuszek11-cyber/NEXUS_FAMILI.git"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded bg-[#121827] border border-[#A855F7]/40 text-[#A855F7] hover:text-white text-[11px] font-mono-tech flex items-center gap-1.5 transition-colors"
                title="Oficjalne repozytorium NEXUS_FAMILI"
              >
                <GitBranch className="w-3 h-3 text-[#A855F7]" />
                <span>NEXUS_FAMILI.git ↗</span>
              </a>
            </div>
            <p className="text-xs font-mono-tech text-[#94A3B8] mt-0.5">
              Strefa Architektów oraz Chroniony Silnik Infrastrukturalny Bellas Core // BRAMA 03: WSPÓŁTWORZĘ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchToCreator}
            className="px-3 py-1.5 rounded-lg bg-[#00D9A6]/10 hover:bg-[#00D9A6]/20 border border-[#00D9A6]/40 text-[#00D9A6] text-xs font-mono-tech uppercase cursor-pointer transition-all"
          >
            NEXUS CREATOR
          </button>
          <button
            onClick={onSwitchToUser}
            className="px-3 py-1.5 rounded-lg bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-mono-tech uppercase cursor-pointer transition-all"
          >
            NEXUS USER
          </button>
        </div>
      </div>

      {/* Main Pillars Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { id: 'ARCHITECTS', label: '🏛️ NEXUS FAMILY — ARCHITECTS', desc: 'Mapa, Projekty, Misje & Brotherhood', color: '#A855F7' },
          { id: 'BELLAS_CORE', label: '⚙️ BELLAS CORE ENGINE', desc: 'AI Kernels, Runtime, ZIP & Bridge', color: '#00E5FF' },
          { id: 'STATE_BELLA', label: '📊 STATE BELLA & METRICS', desc: 'Stan Systemu i Telemetria', color: '#00D9A6' },
          { id: 'COMMS', label: '💬 PRZESTRZEŃ KOMUNIKACJI', desc: 'Kanały Architektów i Koordynacja', color: '#FF3B5C' },
        ].map((pillar) => {
          const isActive = activeMainTab === pillar.id;
          return (
            <button
              key={pillar.id}
              onClick={() => setActiveMainTab(pillar.id as any)}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-[#A855F7]/15 border-[#A855F7]/80 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                  : 'bg-[#090C16] hover:bg-[#121827] border-[#1A2234]'
              }`}
            >
              <div>
                <div className="text-xs font-mono-tech font-bold text-white mb-1">{pillar.label}</div>
                <div className="text-[11px] text-[#94A3B8] font-mono-tech">{pillar.desc}</div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] font-mono-tech uppercase" style={{ color: pillar.color }}>
                  {isActive ? '// ACTIVE ZONE' : 'CLICK TO SWITCH'}
                </span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pillar.color, boxShadow: `0 0 8px ${pillar.color}` }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: NEXUS FAMILY — ARCHITECTS */}
      {activeMainTab === 'ARCHITECTS' && (
        <div className="space-y-6">
          {/* Sub-tabs for Architects */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#121827]">
            {[
              { id: 'MAP', label: 'Mapa Rodziny' },
              { id: 'PROJECTS', label: 'Projekty' },
              { id: 'MISSIONS', label: 'Misje' },
              { id: 'BROTHERHOOD', label: 'Brotherhood' },
              { id: 'CATALOG', label: 'Katalog Architektów' },
              { id: 'COLLAB', label: 'Współpraca' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setArchitectSubTab(st.id as any)}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono-tech uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  architectSubTab === st.id
                    ? 'bg-[#A855F7] text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'bg-[#090C16] hover:bg-[#121827] text-[#94A3B8] border border-[#1A2234]'
                }`}
              >
                {st.id === 'MAP' && '🌐 '}
                {st.id === 'PROJECTS' && '📁 '}
                {st.id === 'MISSIONS' && '🎯 '}
                {st.id === 'BROTHERHOOD' && '🛡️ '}
                {st.id === 'CATALOG' && '👥 '}
                {st.id === 'COLLAB' && '🤝 '}
                {st.label}
              </button>
            ))}
          </div>

          <div className="bg-[#090C16] border border-[#A855F7]/30 rounded-2xl p-6 relative overflow-hidden">
            {architectSubTab === 'MAP' && (
              <div className="space-y-4">
                <div className="text-xs font-mono-tech text-[#A855F7] uppercase tracking-widest">// MAPA RODZINY & TOPOLOGIA WĘZŁÓW</div>
                <h3 className="text-xl font-bold text-white">Globalna Topologia Ekosystemu Nexus</h3>
                <p className="text-sm text-[#94A3B8]">
                  Wizualizacja powiązań między węzłami regionalnymi, instancjami Nexus Core oraz agentami Bella rozproszonymi w sieci Mesh.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-[#05070D] p-4 rounded-xl border border-[#1A2234]">
                    <div className="text-xs font-mono-tech text-[#00E5FF] mb-1">NODE ALPHA // EUROPE</div>
                    <div className="text-xs text-[#94A3B8]">Status: Synchronizowany // Latency: 12ms</div>
                  </div>
                  <div className="bg-[#05070D] p-4 rounded-xl border border-[#1A2234]">
                    <div className="text-xs font-mono-tech text-[#00D9A6] mb-1">NODE BETA // AMERICAS</div>
                    <div className="text-xs text-[#94A3B8]">Status: Online // Latency: 45ms</div>
                  </div>
                  <div className="bg-[#05070D] p-4 rounded-xl border border-[#1A2234]">
                    <div className="text-xs font-mono-tech text-[#A855F7] mb-1">NODE GAMMA // ASIA PACIFIC</div>
                    <div className="text-xs text-[#94A3B8]">Status: Standby // Latency: 88ms</div>
                  </div>
                </div>
              </div>
            )}

            {architectSubTab === 'PROJECTS' && (
              <div className="space-y-4">
                <div className="text-xs font-mono-tech text-[#A855F7] uppercase tracking-widest">// PROJEKTY ARCHITEKTONICZNE</div>
                <h3 className="text-xl font-bold text-white">Aktywne Inicjatywy Systemowe</h3>
                <div className="space-y-3 pt-2">
                  <div className="p-4 bg-[#05070D] rounded-xl border border-[#1A2234] flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">Nexus Brand Vision & Madzia Shop Integration</div>
                      <div className="text-xs text-[#94A3B8]">Automatyczna materializacja assetów na produkty fizyczne (print-on-demand).</div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#00D9A6]/10 border border-[#00D9A6]/30 text-[#00D9A6] text-xs font-mono-tech">ACTIVE (92%)</span>
                  </div>
                  <div className="p-4 bg-[#05070D] rounded-xl border border-[#1A2234] flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">Bella OS Autonomous Voice Agent</div>
                      <div className="text-xs text-[#94A3B8]">Rozszerzenie interfejsu głosowego w czasie rzeczywistym z modelem Gemini Live.</div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-mono-tech">DEVELOPMENT</span>
                  </div>
                </div>
              </div>
            )}

            {architectSubTab === 'MISSIONS' && (
              <div className="space-y-4">
                <div className="text-xs font-mono-tech text-[#A855F7] uppercase tracking-widest">// MISJE I CELE STRATEGICZNE</div>
                <h3 className="text-xl font-bold text-white">Aktualny Sprint Architektów</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-[#05070D] rounded-xl border border-[#1A2234]">
                    <div className="text-xs font-mono-tech text-[#A855F7] mb-1">MISSION #01 // ZERO LATENCY MESH</div>
                    <p className="text-xs text-[#94A3B8]">Optymalizacja czasu ładowania paczek ZIP w lokalnym węźle poniżej 150ms.</p>
                  </div>
                  <div className="p-4 bg-[#05070D] rounded-xl border border-[#1A2234]">
                    <div className="text-xs font-mono-tech text-[#00E5FF] mb-1">MISSION #02 // SECURE RBAC AUDIT</div>
                    <p className="text-xs text-[#94A3B8]">Weryfikacja reguł bezpieczeństwa dla ról użytkowników i administratorów.</p>
                  </div>
                </div>
              </div>
            )}

            {architectSubTab === 'BROTHERHOOD' && (
              <div className="space-y-4">
                <div className="text-xs font-mono-tech text-[#A855F7] uppercase tracking-widest">// BROTHERHOOD & TRUST RING</div>
                <h3 className="text-xl font-bold text-white">Krąg Zaufania i Spójności</h3>
                <p className="text-sm text-[#94A3B8]">
                  Wspólnota architektów oparta na kryptograficznym potwierdzaniu tożsamości kluczy sesyjnych oraz wspólnym kodeksie etycznym kodu.
                </p>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleProtocolAction('Brotherhood Ping')} className="px-4 py-2 rounded-xl bg-[#A855F7] text-white text-xs font-mono-tech uppercase cursor-pointer">
                    WYŚLIJ PING DO BROTHERHOOD
                  </button>
                </div>
              </div>
            )}

            {architectSubTab === 'CATALOG' && (
              <div className="space-y-4">
                <div className="text-xs font-mono-tech text-[#A855F7] uppercase tracking-widest">// KATALOG ARCHITEKTÓW</div>
                <h3 className="text-xl font-bold text-white">Autoryzowani Twórcy Systemu</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 bg-[#05070D] rounded-xl border border-[#1A2234]">
                    <div className="text-xs font-bold text-white">Maciej (Architekt Nexus)</div>
                    <div className="text-[11px] text-[#A855F7] font-mono-tech">Główny Wizjoner & Core Systems</div>
                  </div>
                  <div className="p-3.5 bg-[#05070D] rounded-xl border border-[#1A2234]">
                    <div className="text-xs font-bold text-white">Eterion (AI Architect)</div>
                    <div className="text-[11px] text-[#00E5FF] font-mono-tech">Strategia i Logika Agentowa</div>
                  </div>
                  <div className="p-3.5 bg-[#05070D] rounded-xl border border-[#1A2234]">
                    <div className="text-xs font-bold text-white">Bella (OS Intelligence)</div>
                    <div className="text-[11px] text-[#00D9A6] font-mono-tech">Orkiestracja i Runtime</div>
                  </div>
                </div>
              </div>
            )}

            {architectSubTab === 'COLLAB' && (
              <div className="space-y-4">
                <div className="text-xs font-mono-tech text-[#A855F7] uppercase tracking-widest">// WSPÓŁPRACA I PROTOKOŁY ZESPOŁOWE</div>
                <h3 className="text-xl font-bold text-white">Kanały Współtworzenia</h3>
                <p className="text-sm text-[#94A3B8]">
                  Wszystkie zmiany w architekturze wymagają dwustronnego zatwierdzenia przez protokół Consensus.
                </p>
                <button onClick={() => handleProtocolAction('Consensus Check')} className="px-4 py-2 rounded-xl bg-[#A855F7] text-white text-xs font-mono-tech uppercase cursor-pointer">
                  SPRAWDŹ STAN KONSENSUSU
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: NEXUS FAMILY — BELLAS CORE */}
      {activeMainTab === 'BELLAS_CORE' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-mono-tech flex items-center gap-3">
            <Lock className="w-5 h-5 flex-shrink-0" />
            <div>
              <strong>CHRONIONA STREFA INFRASTRUKTURALNA:</strong> Zwykli użytkownicy nie mają dostępu do tego poziomu. Tutaj rezyduje silnik Bellas Core zarządzający rdzeniem Nexus.
            </div>
          </div>

          {/* Sub-tabs for Bellas Core */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#121827]">
            {[
              { id: 'KERNELS', label: 'AI Kernels' },
              { id: 'ORCHESTRATION', label: 'Orchestration' },
              { id: 'RUNTIME', label: 'Module Runtime' },
              { id: 'ZIP', label: 'ZIP Loader' },
              { id: 'DEPENDENCIES', label: 'Dependency Layer' },
              { id: 'PERMISSIONS', label: 'Permissions' },
              { id: 'NODE', label: 'Local Node' },
              { id: 'BRIDGE', label: 'Network Bridge' },
              { id: 'TELEMETRY', label: 'Telemetry' },
              { id: 'SERVICES', label: 'System Services' },
            ].map((bt) => (
              <button
                key={bt.id}
                onClick={() => setBellasSubTab(bt.id as any)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono-tech uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  bellasSubTab === bt.id
                    ? 'bg-[#00E5FF] text-[#05070D] font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                    : 'bg-[#090C16] hover:bg-[#121827] text-[#94A3B8] border border-[#1A2234]'
                }`}
              >
                {bt.label}
              </button>
            ))}
          </div>

          <div className="bg-[#090C16] border border-[#00E5FF]/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/5 rounded-bl-full pointer-events-none" />

            {bellasSubTab === 'KERNELS' && (
              <div className="space-y-4">
                <div className="text-xs font-mono-tech text-[#00E5FF] uppercase tracking-widest">// BELLAS CORE // AI KERNELS</div>
                <h3 className="text-xl font-bold text-white">Warstwa Jąder Modelowych AI</h3>
                <p className="text-sm text-[#94A3B8]">Zarządzanie połączeniami z modelem Gemini, buforowanie promptów oraz optymalizacja tokenów.</p>
                <div className="p-4 bg-[#05070D] rounded-xl border border-[#1A2234] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono-tech text-white font-bold">Primary Kernel: Gemini 2.5 Flash</div>
                    <div className="text-[11px] text-[#00D9A6]">Status: Active // Latency: 180ms // Token Usage: Optimised</div>
                  </div>
                  <button onClick={() => handleProtocolAction('AI Kernel Refresh')} className="px-3 py-1.5 rounded bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-mono-tech uppercase cursor-pointer">RESTART KERNEL</button>
                </div>
              </div>
            )}

            {bellasSubTab === 'ORCHESTRATION' && (
              <div className="space-y-4">
                <div className="text-xs font-mono-tech text-[#00E5FF] uppercase tracking-widest">// BELLAS CORE // ORCHESTRATION</div>
                <h3 className="text-xl font-bold text-white">System Orkiestracji Procesów</h3>
                <p className="text-sm text-[#94A3B8]">Koordynacja zadań asynchronicznych, kolejkowanie eventów oraz harmonogramowanie cron.</p>
              </div>
            )}

            {bellasSubTab === 'RUNTIME' && (
              <div className="space-y-4">
                <div className="text-xs font-mono-tech text-[#00E5FF] uppercase tracking-widest">// BELLAS CORE // MODULE RUNTIME</div>
                <h3 className="text-xl font-bold text-white">Środowisko Uruchomieniowe Modułów</h3>
                <p className="text-sm text-[#94A3B8]">Bezpieczny sandboks do wykonywania kodu załadowanych modułów w czasie rzeczywistym.</p>
              </div>
            )}

            {bellasSubTab === 'ZIP' && (
              <div className="space-y-4">
                <div className="text-xs font-mono-tech text-[#00E5FF] uppercase tracking-widest">// BELLAS CORE // ZIP LOADER</div>
                <h3 className="text-xl font-bold text-white">Zaawansowany Loader Pakietów ZIP</h3>
                <p className="text-sm text-[#94A3B8]">Weryfikacja manifestów, rozpakowywanie w locie oraz automatyczne generowanie kafelków modułów.</p>
              </div>
            )}

            {bellasSubTab === 'DEPENDENCIES' && (
              <div className="space-y-4">
                <div className="text-xs font-mono-tech text-[#00E5FF] uppercase tracking-widest">// BELLAS CORE // DEPENDENCY LAYER</div>
                <h3 className="text-xl font-bold text-white">Warstwa Zależności i Bibliotek</h3>
                <p className="text-sm text-[#94A3B8]">Zarządzanie pakietami NPM, wersjami bibliotek współdzielonych oraz kontrola konfliktu typów.</p>
              </div>
            )}

            {bellasSubTab === 'PERMISSIONS' && (
              <div className="space-y-4">
                <div className="text-xs font-mono-tech text-[#00E5FF] uppercase tracking-widest">// BELLAS CORE // PERMISSIONS & RBAC</div>
                <h3 className="text-xl font-bold text-white">Kontrola Dostępu i Uprawnień</h3>
                <p className="text-sm text-[#94A3B8]">Egzekwowanie zasad Least Privilege dla poszczególnych stref i ról użytkowników.</p>
              </div>
            )}

            {bellasSubTab === 'NODE' && (
              <div className="space-y-4">
                <div className="text-xs font-mono-tech text-[#00E5FF] uppercase tracking-widest">// BELLAS CORE // LOCAL NODE</div>
                <h3 className="text-xl font-bold text-white">Lokalny Węzeł Systemowy (Nexus Node)</h3>
                <p className="text-sm text-[#94A3B8]">Obsługa operacji offline, buforowanie lokalne w IndexedDB oraz synchronizacja stanu.</p>
              </div>
            )}

            {bellasSubTab === 'BRIDGE' && (
              <div className="space-y-4">
                <div className="text-xs font-mono-tech text-[#00E5FF] uppercase tracking-widest">// BELLAS CORE // NETWORK BRIDGE</div>
                <h3 className="text-xl font-bold text-white">Most Sieciowy i Komunikacja Międzywęzłowa</h3>
                <p className="text-sm text-[#94A3B8]">Przesyłanie komunikatów między instancjami w chmurze a węzłami lokalnymi.</p>
              </div>
            )}

            {bellasSubTab === 'TELEMETRY' && (
              <div className="space-y-4">
                <div className="text-xs font-mono-tech text-[#00E5FF] uppercase tracking-widest">// BELLAS CORE // TELEMETRY</div>
                <h3 className="text-xl font-bold text-white">Telemetria i Diagnostyka Systemu</h3>
                <p className="text-sm text-[#94A3B8]">Monitorowanie zużycia pamięci, liczby błędów runtime oraz wydajności Event Bus w czasie rzeczywistym.</p>
              </div>
            )}

            {bellasSubTab === 'SERVICES' && (
              <div className="space-y-4">
                <div className="text-xs font-mono-tech text-[#00E5FF] uppercase tracking-widest">// BELLAS CORE // SYSTEM SERVICES</div>
                <h3 className="text-xl font-bold text-white">Usługi systemowe w tle</h3>
                <p className="text-sm text-[#94A3B8]">Zarządzanie daemonami systemowymi, autozapisem, backupami oraz integracją z chmurą.</p>
                <button onClick={() => handleProtocolAction('Reboot System Services')} className="px-4 py-2 rounded-xl bg-[#00E5FF] text-[#05070D] font-bold text-xs font-mono-tech uppercase cursor-pointer">
                  RESTART USŁUG SYSTEMOWYCH
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: STATE BELLA */}
      {activeMainTab === 'STATE_BELLA' && (
        <div className="bg-[#090C16] border border-[#00D9A6]/30 rounded-2xl p-6 space-y-4">
          <div className="text-xs font-mono-tech text-[#00D9A6] uppercase tracking-widest">// STATE BELLA & REAL-TIME METRICS</div>
          <h3 className="text-xl font-bold text-white">Stan Systemu Bella OS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#05070D] rounded-xl border border-[#1A2234]">
              <div className="text-xs text-[#94A3B8]">Core Engine Status</div>
              <div className="text-lg font-bold text-[#00D9A6] mt-1">OPERATIONAL</div>
            </div>
            <div className="p-4 bg-[#05070D] rounded-xl border border-[#1A2234]">
              <div className="text-xs text-[#94A3B8]">Active AI Agents</div>
              <div className="text-lg font-bold text-[#00E5FF] mt-1">3 KERNELS RUNNING</div>
            </div>
            <div className="p-4 bg-[#05070D] rounded-xl border border-[#1A2234]">
              <div className="text-xs text-[#94A3B8]">Storage Synchronization</div>
              <div className="text-lg font-bold text-[#A855F7] mt-1">100% SYNCED</div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: COMMS SPACE */}
      {activeMainTab === 'COMMS' && (
        <div className="bg-[#090C16] border border-[#FF3B5C]/30 rounded-2xl p-6 space-y-4">
          <div className="text-xs font-mono-tech text-[#FF3B5C] uppercase tracking-widest">// PRZESTRZEŃ KOMUNIKACJI ARCHITEKTÓW</div>
          <h3 className="text-xl font-bold text-white">Kanał Koordynacyjny Nexus Brotherhood</h3>
          <p className="text-sm text-[#94A3B8]">Bezpieczny kanał szyfrowany dla architektów i współtwórców ekosystemu.</p>
          <div className="p-4 bg-[#05070D] rounded-xl border border-[#1A2234] space-y-3 font-mono-tech text-xs">
            <div className="text-[#64748B]">[06:45] SYSTEM: Eterion zsynchronizował węzeł lokalny z Nexus Core.</div>
            <div className="text-[#00E5FF]">[06:50] MACIEJ: Rozpoczynamy wdrażanie Bellas Core sub-sistemów.</div>
            <div className="text-[#00D9A6]">[06:55] BELLA OS: Wszystkie 10 sub-modułów infrastrukturalnych w stanie gotowości.</div>
          </div>
        </div>
      )}
    </div>
  );
};

