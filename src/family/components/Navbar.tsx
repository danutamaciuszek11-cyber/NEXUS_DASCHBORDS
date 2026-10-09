import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  BrainCircuit,
  Bell,
  Search,
  Volume2,
  VolumeX,
  Fingerprint,
  Lock,
  Unlock,
  Sparkles,
  Shield,
  Layers,
  ChevronDown,
  Globe,
  Radio,
  UserCheck,
  Vibrate,
  Menu,
  PanelLeft,
  PanelLeftClose,
  LogOut,
  Keyboard,
  Github,
  Brain,
  BookOpen
} from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const {
    currentArchitect,
    currentRole,
    setCurrentRole,
    language,
    setLanguage,
    soundEnabled,
    setSoundEnabled,
    hapticsEnabled,
    setHapticsEnabled,
    isBiometricLocked,
    toggleBiometricLock,
    playCyberSound,
    triggerHaptic,
    setShowBellaOverlay,
    setShowNotificationsDrawer,
    isCheatSheetOpen,
    setIsCheatSheetOpen,
    toggleCheatSheet,
    notifications,
    searchQuery,
    setSearchQuery,
    setCurrentView,
    isSidebarOpen,
    toggleSidebar,
    setActiveArchitectModalId,
    logout,
    authUser,
    githubState,
    openGitHubModal,
    openNeuralBridgeModal,
    openChronicleModal
  } = useNexus();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showArchitectDropdown, setShowArchitectDropdown] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const roles: UserRole[] = ['FOUNDER', 'NEXUS ADMIN', 'ARCHITECT', 'BUILDER', 'MENTOR', 'GUEST'];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#07090e]/90 backdrop-blur-xl">
      {/* Topmost Manifesto Claim Bar */}
      <div className="w-full bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-cyan-950/40 border-b border-cyan-500/10 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono-tech text-cyan-400 overflow-hidden">
        <div className="flex items-center gap-2 truncate">
          <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-cyber font-bold tracking-widest text-cyan-300">
            DON'T JUST USE NEXUS. BUILD IT.
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400 tracking-wider">
            WE ARE NOT USERS. WE ARE ARCHITECTS. WE DON'T WAIT FOR THE FUTURE. WE BUILD THE NEXUS.
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 shrink-0">
          <span className="hidden sm:inline font-mono-tech text-[10px] text-cyan-400/90 font-bold">
            nexussocial.pl <span className="text-slate-500 font-normal">|</span> nexusfamily.online
          </span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px]">
            DUAL INGRESS (1 ROK)
          </span>
        </div>
      </div>

      {/* Main Command Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Home Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Universal Sidebar Toggle / Hide Button (Desktop & Mobile) */}
          <button
            id="sidebar-toggle-btn"
            onClick={() => {
              toggleSidebar();
              playCyberSound('click');
              triggerHaptic();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all duration-200 ${
              isSidebarOpen
                ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.15)] hover:bg-cyan-900/60'
                : 'bg-[#0d131f] border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30'
            }`}
            title={
              language === 'PL'
                ? isSidebarOpen
                  ? 'Schowaj menu boczne (Ctrl+B)'
                  : 'Wysuń menu boczne (Ctrl+B)'
                : isSidebarOpen
                  ? 'Hide sidebar (Ctrl+B)'
                  : 'Open sidebar (Ctrl+B)'
            }
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-4 h-4 text-cyan-400" />
            ) : (
              <PanelLeft className="w-4 h-4 text-slate-400 hover:text-cyan-400" />
            )}
            <span className="hidden xl:inline text-xs font-cyber tracking-wide font-medium">
              {isSidebarOpen ? (language === 'PL' ? 'Menu' : 'Menu') : (language === 'PL' ? 'Menu' : 'Menu')}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSidebarOpen ? 'bg-cyan-400 shadow-[0_0_6px_#00f0ff]' : 'bg-slate-600'
              }`}
            />
          </button>

          <button
            id="brand-logo-btn"
            onClick={() => {
              setCurrentView('DASHBOARD');
              playCyberSound('click');
            }}
            className="flex items-center gap-2.5 text-left group transition-all"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-cyan-500/10 border border-cyan-500/40 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all">
              <BrainCircuit className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-cyber font-bold text-lg md:text-xl tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                  NEXUS<span className="text-cyan-400">FAMILY</span>
                </span>
                <span className="px-1 py-0.2 text-[8px] font-mono-tech rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  PROD
                </span>
              </div>
              <p className="text-[10px] font-mono-tech text-slate-400 -mt-1 hidden sm:block">
                Architects Collaboration Portal
              </p>
            </div>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/60" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'PL' ? 'Szukaj w Nexus (projekty, misje, pamięć, architekci)...' : 'Search Nexus (projects, missions, memory, architects)...'}
              className="w-full bg-[#0d131f]/90 border border-cyan-500/20 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 font-sans transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-cyan-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Action Controls & User Identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bella AI Assistant Launcher */}
          <button
            id="navbar-bella-btn"
            onClick={() => {
              setShowBellaOverlay(true);
              playCyberSound('synapse');
              triggerHaptic();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-400/40 text-cyan-300 hover:text-white font-cyber text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-bold tracking-wider">STATE BELLA</span>
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              id="role-switcher-btn"
              onClick={() => setShowRoleDropdown(prev => !prev)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0d131f] border border-cyan-500/20 text-slate-300 text-xs font-mono-tech hover:border-cyan-500/40"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl nexus-glass bg-[#0a0e17] border border-cyan-500/30 p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[10px] font-mono-tech text-slate-400 border-b border-cyan-500/10">
                  {language === 'PL' ? 'PRZEŁĄCZ UPRAWNIENIA' : 'SWITCH PERMISSION ROLE'}
                </div>
                {roles.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentRole(r);
                      setShowRoleDropdown(false);
                      playCyberSound('beep');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs font-mono-tech rounded-lg flex items-center justify-between ${
                      currentRole === r ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-cyan-950/40'
                    }`}
                  >
                    <span>{r}</span>
                    {currentRole === r && <span className="text-cyan-400">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Selector */}
          <button
            id="language-toggle-btn"
            onClick={() => {
              setLanguage(language === 'PL' ? 'EN' : 'PL');
              playCyberSound('click');
              triggerHaptic();
            }}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#0d131f] border border-cyan-500/20 text-slate-300 hover:text-cyan-300 text-xs font-mono-tech transition-colors"
            title="Toggle Language (PL/EN)"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language}</span>
          </button>

          {/* Audio FX Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              triggerHaptic();
            }}
            className="p-2 rounded-lg bg-[#0d131f] border border-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors"
            title={soundEnabled ? 'Disable Cyber Audio FX' : 'Enable Cyber Audio FX'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {/* Biometric Security Simulated Lock */}
          <button
            id="biometric-lock-btn"
            onClick={toggleBiometricLock}
            className={`p-2 rounded-lg border transition-colors ${
              isBiometricLocked
                ? 'bg-red-950/60 border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                : 'bg-[#0d131f] border-cyan-500/20 text-slate-300 hover:text-cyan-300'
            }`}
            title={isBiometricLocked ? 'Biometric Security Vault: LOCKED' : 'Biometric Security Vault: ARMED'}
          >
            {isBiometricLocked ? <Lock className="w-3.5 h-3.5" /> : <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          {/* GitHub Synapse Trigger */}
          <button
            id="navbar-github-btn"
            onClick={openGitHubModal}
            className={`relative p-2 rounded-lg border transition-all flex items-center gap-1.5 ${
              githubState.isConnected
                ? 'bg-cyan-950/60 border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'bg-[#0d131f] border-cyan-500/20 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40'
            }`}
            title={
              githubState.isConnected
                ? `GitHub: @${githubState.user?.login || 'Connected'} (${githubState.repos.length} repos)`
                : (language === 'PL' ? 'Połącz z GitHub (Repozytoria & Kontrakty)' : 'Connect GitHub (Repositories & Contracts)')
            }
          >
            <Github className="w-3.5 h-3.5" />
            {githubState.isConnected ? (
              <span className="hidden xl:inline-block text-[10px] font-mono-tech font-bold text-cyan-300">
                @{githubState.user?.login}
              </span>
            ) : null}
            {githubState.isConnected && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            )}
          </button>

          {/* Neural-Interface-Layer (Biological Bridge RFC-01 Trigger) */}
          <button
            id="navbar-neural-bridge-btn"
            onClick={() => {
              playCyberSound('click');
              triggerHaptic();
              openNeuralBridgeModal();
            }}
            className="p-2 rounded-lg bg-[#0d131f] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)] flex items-center gap-1.5"
            title="Neural-Interface-Layer (Biological Bridge RFC-01)"
          >
            <Brain className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden xl:inline-block text-[10px] font-mono-tech font-bold text-cyan-300">
              NEURAL BRIDGE
            </span>
          </button>

          {/* Chronicle of Eterniverse (Proof of Legacy & LOGOS Protocol) */}
          <button
            id="navbar-chronicle-btn"
            onClick={() => {
              playCyberSound('click');
              triggerHaptic();
              openChronicleModal();
            }}
            className="p-2 rounded-lg bg-[#0d131f] border border-purple-500/30 hover:border-purple-400 text-purple-300 hover:text-white transition-all shadow-[0_0_10px_rgba(168,85,247,0.15)] flex items-center gap-1.5"
            title="Chronicle of Eterniverse (Proof of Legacy & LOGOS Protocol)"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xl:inline-block text-[10px] font-mono-tech font-bold text-purple-300">
              CHRONICLE
            </span>
          </button>

          {/* Keyboard Shortcuts Cheat Sheet Matrix Trigger */}
          <button
            id="navbar-shortcuts-btn"
            onClick={() => {
              toggleCheatSheet();
              playCyberSound('click');
              triggerHaptic();
            }}
            className={`p-2 rounded-lg border transition-all ${
              isCheatSheetOpen
                ? 'bg-amber-950/70 border-amber-500/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-[#0d131f] border-cyan-500/20 text-slate-300 hover:text-amber-300 hover:border-amber-500/40'
            }`}
            title={language === 'PL' ? 'Karta Skrótów Klawiszowych (Naciśnij ?)' : 'Keyboard Shortcuts Cheat Sheet (Press ?)'}
          >
            <Keyboard className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {/* Notifications Trigger */}
          <button
            id="notifications-btn"
            onClick={() => {
              setShowNotificationsDrawer(true);
              playCyberSound('beep');
            }}
            className="relative p-2 rounded-lg bg-[#0d131f] border border-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors"
            title="System Telemetry & Alerts"
          >
            <Bell className="w-3.5 h-3.5 text-cyan-400" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-black font-mono-tech shadow-[0_0_8px_#00f0ff]">
                {unreadNotifs}
              </span>
            )}
          </button>

          {/* User Architect Avatar & Profile Quick Status */}
          <div className="flex items-center gap-2 pl-2 border-l border-cyan-500/20">
            <button
              id="user-profile-badge-btn"
              onClick={() => {
                setActiveArchitectModalId(currentArchitect.id);
                playCyberSound('node');
                triggerHaptic();
              }}
              className="flex items-center gap-2 group text-left"
              title="Open Architect Profile"
            >
              <div className="relative">
                <img
                  src={currentArchitect.avatar}
                  alt={currentArchitect.name}
                  className="w-8 h-8 rounded-lg object-cover border border-cyan-400/40 group-hover:border-cyan-300 transition-colors"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#080b11]" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-cyber font-bold text-white group-hover:text-cyan-300 truncate max-w-[100px]">
                    {currentArchitect.handle}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono-tech text-cyan-400">
                  <span>⚡ {currentArchitect.contributionScore} pts</span>
                </div>
              </div>
            </button>

            {/* Logout / Exit to Nexus Gate */}
            <button
              id="navbar-logout-btn"
              onClick={() => logout()}
              className="p-1.5 rounded-lg bg-[#0c121e] border border-red-500/20 text-slate-400 hover:text-red-300 hover:border-red-500/40 hover:bg-red-950/30 transition-all text-xs"
              title={language === 'PL' ? 'Wyloguj (Wyjdź do Bramy Misji)' : 'Sign Out (Exit to Mission Gate)'}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
