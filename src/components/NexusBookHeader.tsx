import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Shuffle, 
  Sparkles, 
  Sliders, 
  Search, 
  Terminal, 
  Activity,
  Maximize2,
  Compass,
  UserCheck,
  Wand2,
  HelpCircle,
  Keyboard,
  Database,
  Network,
  WifiOff,
  UploadCloud,
  Image as ImageIcon
} from 'lucide-react';
import { soundFx } from '../utils/audioSystem';
import { PilotProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { useOnlineStatus } from '../utils/useOnlineStatus';

interface HeaderProps {
  onSearchFocus: () => void;
  onRandomBookClick: () => void;
  onQuoteOfDayClick: () => void;
  onOpenDashboardConfig: () => void;
  onOpenQuantumLogin: () => void;
  onOpenNeuralArchitect: () => void;
  onOpenCreatorSoulEngine?: () => void;
  onOpenAuthorAssetLibrary?: () => void;
  onOpenEditorialStudio?: () => void;
  onOpenImportModal?: () => void;
  onOpenNexusEcosystem?: () => void;
  onOpenShortcuts?: () => void;
  onOpenDatabaseStatus?: () => void;
  isDatabaseConnected?: boolean;
  currentPilot: PilotProfile | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  ambientMode: 'dark' | 'oled' | 'cinema' | 'light';
  onChangeAmbientMode: (mode: 'dark' | 'oled' | 'cinema' | 'light') => void;
  activeSeekerColor?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchFocus,
  onRandomBookClick,
  onQuoteOfDayClick,
  onOpenDashboardConfig,
  onOpenQuantumLogin,
  onOpenNeuralArchitect,
  onOpenCreatorSoulEngine,
  onOpenAuthorAssetLibrary,
  onOpenEditorialStudio,
  onOpenImportModal,
  onOpenNexusEcosystem,
  onOpenShortcuts,
  onOpenDatabaseStatus,
  isDatabaseConnected = true,
  currentPilot,
  soundEnabled,
  onToggleSound,
  ambientMode,
  onChangeAmbientMode,
  activeSeekerColor = '#00f0ff'
}) => {

  const { isOnline } = useOnlineStatus();
  const [timeStr, setTimeStr] = useState('');
  const [utcStr, setUtcStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setUtcStr(now.toISOString().substring(11, 19) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFullscreen = () => {
    soundFx.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="sticky top-0 z-40 h-[60px] border-b border-white/10 bg-black/40 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between transition-colors duration-300">
      
      {/* Left branding & search */}
      <div className="flex items-center gap-6 flex-1">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-mono font-black text-sm text-white shadow-lg transition-transform hover:scale-105 shrink-0"
            style={{ boxShadow: `0 0 12px ${activeSeekerColor}66` }}
          >
            NX
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black tracking-tighter text-white leading-none">NEXUSBOOK</h1>
            <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Eterniverse OS v.1.0</p>
          </div>
        </div>

        {/* High-Contrast Search Bar */}
        <div className="relative w-full max-w-[360px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-[10px] font-mono pointer-events-none">
            [ SEARCH ]
          </span>
          <input
            type="text"
            placeholder="Titles, Quotes, Tags... (/)"
            onFocus={() => {
              soundFx.playClick();
              onSearchFocus();
            }}
            className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-24 pr-4 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all"
          />
        </div>
      </div>

      {/* Right Controls & Status */}
      <div className="flex items-center gap-4">
        
        {/* Live Clock & Sync Node */}
        <div className="hidden lg:flex items-center gap-3 font-mono text-[10px] text-white/40">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="uppercase tracking-wider">SYNCED WITH ETERNIVERSE CORE</span>
          <span className="text-white/20">|</span>
          <span className="text-white font-bold">{timeStr}</span>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Random Book */}
          <button
            onClick={() => {
              soundFx.playClick();
              onRandomBookClick();
            }}
            className="p-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all"
            title="Random Book [R]"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Quote of the Day */}
          <button
            onClick={() => {
              soundFx.playClick();
              onQuoteOfDayClick();
            }}
            className="p-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-purple-400 hover:text-purple-300 transition-all"
            title="Quote of the Day"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              soundFx.playClick();
            }}
            className={`p-1.5 rounded-md border transition-all ${
              soundEnabled
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-400'
                : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
            }`}
            title={soundEnabled ? 'Audio FX Enabled' : 'Audio FX Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Ambient Lighting Mode */}
          <button
            onClick={() => {
              soundFx.playClick();
              const modes: ('dark' | 'oled' | 'cinema' | 'light')[] = ['dark', 'oled', 'cinema', 'light'];
              const nextIdx = (modes.indexOf(ambientMode) + 1) % modes.length;
              onChangeAmbientMode(modes[nextIdx]);
            }}
            className="p-1.5 rounded-md bg-white/5 border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all uppercase text-[10px] font-mono flex items-center gap-1"
            title={`Ambient Mode: ${ambientMode}`}
          >
            {ambientMode === 'light' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={handleFullscreen}
            className="p-1.5 rounded-md bg-white/5 border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all"
            title="Fullscreen Mode"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Creator Soul Engine Launcher */}
          <button
            onClick={() => {
              soundFx.playModalOpen();
              onOpenCreatorSoulEngine?.();
            }}
            className="px-3 py-1 rounded-md bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-mono font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20 border border-cyan-400/50 cursor-pointer"
            title="NexusBook Creator Soul Engine - Identity & Space"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
            <span className="hidden lg:inline uppercase tracking-wider">SOUL ENGINE</span>
          </button>

          {/* NexusBook Neural Content Architect Launcher */}
          <button
            onClick={() => {
              soundFx.playModalOpen();
              onOpenNeuralArchitect();
            }}
            className="px-3 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-purple-300 font-mono font-bold text-[11px] flex items-center gap-1.5 transition-all border border-purple-500/40 cursor-pointer"
            title="NexusBook Neural Content Architect - AI Studio"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline uppercase tracking-wider">AI ARCHITECT</span>
          </button>

          {/* NexusBook Editorial Studio Launcher */}
          <button
            onClick={() => {
              soundFx.playModalOpen();
              onOpenEditorialStudio?.();
            }}
            className="px-2.5 py-1 rounded-md bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 font-mono font-bold text-[11px] flex items-center gap-1.5 transition-all border border-cyan-400/60 shadow-md shadow-cyan-950/40 cursor-pointer"
            title="NexusBook Editorial & Publishing Studio - Redakcja dzieł, okładki, manifest, publikacja"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline uppercase tracking-wider">EDITORIAL STUDIO</span>
          </button>

          {/* Nexus Author Asset Library Launcher */}
          <button
            onClick={() => {
              soundFx.playModalOpen();
              onOpenAuthorAssetLibrary?.();
            }}
            className="px-2.5 py-1 rounded-md bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 text-cyan-300 font-mono font-bold text-[11px] flex items-center gap-1.5 transition-all border border-cyan-400/50 shadow-md shadow-cyan-950/40 cursor-pointer"
            title="Nexus Author Asset Library - Lokalna biblioteka grafik autora i rejestr SHA-256"
          >
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline uppercase tracking-wider">ASSET LIBRARY</span>
          </button>

          {/* Panel Importu PDF / Substack */}
          <button
            onClick={() => {
              soundFx.playModalOpen();
              onOpenImportModal?.();
            }}
            className="px-2.5 py-1 rounded-md bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 font-mono font-bold text-[11px] flex items-center gap-1.5 transition-all border border-cyan-500/50 shadow-md shadow-cyan-950/40 cursor-pointer"
            title="Importuj pliki PDF, Substack i Wattpad do NexusBook"
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden md:inline uppercase tracking-wider">IMPORT PDF</span>
          </button>

          {/* Quantum Pilot Gateway Button */}
          <button
            onClick={() => {
              soundFx.playModalOpen();
              onOpenQuantumLogin();
            }}
            className={`px-2.5 py-1 rounded-md border text-[11px] font-mono flex items-center gap-1.5 transition-all shadow-lg ${
              currentPilot?.authenticated
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-cyan-500/20 font-bold'
                : 'bg-gradient-to-r from-purple-900/60 to-pink-900/60 border-pink-500/50 text-white hover:border-cyan-400 hover:text-cyan-300'
            }`}
            title="Quantum Traversal - Panel Logowania Pilota"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
            <span className="hidden md:inline uppercase tracking-wider">
              {currentPilot?.authenticated ? currentPilot.designatorName : 'QUANTUM ACCESS'}
            </span>
          </button>

          {/* Dashboard Config */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenDashboardConfig();
            }}
            className="p-1.5 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/50 text-white/70 hover:text-emerald-400 transition-all"
            title="Configure Dashboard"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Database & Node Token Status Button */}
          <button
            onClick={() => {
              soundFx.playModalOpen();
              onOpenDatabaseStatus?.();
            }}
            className={`px-2 py-1 rounded-md border text-[11px] font-mono flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              isDatabaseConnected
                ? 'bg-emerald-950/60 border-emerald-500/40 hover:border-emerald-400 text-emerald-300 shadow-emerald-950/30'
                : 'bg-red-950/60 border-red-500/40 text-red-300'
            }`}
            title="Węzeł: NEXUS-BNB-734LLM-NODE | Baza Danych Firestore & Telemetria"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline text-[10px] font-bold tracking-wider">
              {isDatabaseConnected ? 'NODE: BNB-734' : 'DB: OFFLINE'}
            </span>
            <span className={`w-1.5 h-1.5 rounded-full ${isDatabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
          </button>

          {/* Nexus Synapse Core (Ecosystem Hub) Button */}
          <button
            onClick={() => {
              soundFx.playModalOpen();
              onOpenNexusEcosystem?.();
            }}
            className="px-2 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all shadow-sm flex items-center gap-1.5 font-mono text-[11px] cursor-pointer"
            title="NEXUS SYNAPSE CORE — Ekosystem (BELLAS, MADZIA SHOP, AEGIS) [Skrót: E]"
          >
            <Network className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden xl:inline text-[10px] font-bold">SYNAPSE [E]</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Offline Status Badge */}
          {!isOnline && (
            <div 
              className="px-2 py-1 rounded-md bg-amber-950/80 border border-amber-500/50 text-amber-300 font-mono text-[10px] font-bold flex items-center gap-1.5 animate-pulse"
              title="Tryb Offline: Działasz na lokalnej pamięci podręcznej Service Workera"
            >
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">OFFLINE</span>
            </div>
          )}

          {/* Keyboard Shortcuts Help */}
          <button
            onClick={() => {
              soundFx.playModalOpen();
              onOpenShortcuts?.();
            }}
            className="p-1.5 rounded-md bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all flex items-center gap-1 font-mono text-[11px]"
            title="Keyboard Shortcuts [?]"
          >
            <Keyboard className="w-4 h-4" />
            <span className="hidden xl:inline text-[10px] font-bold">SKRÓTY [?]</span>
          </button>
        </div>

      </div>

    </header>
  );
};
