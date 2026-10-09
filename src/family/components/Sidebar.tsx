import React from 'react';
import { useNexus, ActiveView } from '../context/NexusContext';
import {
  LayoutDashboard,
  Brain,
  Users,
  Network,
  Globe,
  FolderGit2,
  Target,
  Database,
  Radio,
  Cpu,
  MessageSquare,
  UserCheck,
  History,
  Scroll,
  Sliders,
  Sparkles,
  KeyRound,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Flame,
  X,
  PanelLeftClose,
  Compass,
  Keyboard
} from 'lucide-react';

interface NavItem {
  id: ActiveView;
  label: string;
  labelEn: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
  shortcutKey?: string;
  category: 'CORE' | 'ARCHITECTURE' | 'COMMUNITY' | 'FOUNDATION';
}

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen: propIsOpen,
  onClose: propOnClose
}) => {
  const {
    currentView,
    setCurrentView,
    language,
    playCyberSound,
    triggerHaptic,
    missions,
    brotherhoodNodes,
    chatRooms,
    accessRequests,
    currentRole,
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar,
    toggleCheatSheet
  } = useNexus();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isSidebarOpen;
  const onClose = () => {
    if (typeof propOnClose === 'function') {
      propOnClose();
    }
    setIsSidebarOpen(false);
    playCyberSound('click');
    triggerHaptic();
  };

  const openMissionsCount = missions.filter(m => m.status === 'OPEN').length;
  const suggestedBrotherhoodCount = brotherhoodNodes.filter(b => b.status === 'SUGGESTED').length;
  const pendingRequestsCount = accessRequests.filter(r => r.status === 'PENDING').length;

  const navItems: NavItem[] = [
    // CORE
    { id: 'DASHBOARD', label: 'Centrum Operacji', labelEn: 'Command Dashboard', icon: LayoutDashboard, category: 'CORE', shortcutKey: 'D' },
    { id: 'BELLA', label: 'State Bella AI', labelEn: 'State Bella AI', icon: Brain, category: 'CORE', badge: 'AI', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', shortcutKey: 'B' },
    { id: 'BROTHERHOOD', label: 'Brotherhood Engine', labelEn: 'Brotherhood Engine', icon: Users, category: 'CORE', badge: suggestedBrotherhoodCount > 0 ? `${suggestedBrotherhoodCount} New` : undefined, badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { id: 'MAP', label: 'Mapa Rodziny (HUD)', labelEn: 'Family Neural Map', icon: Network, category: 'CORE', shortcutKey: 'N' },

    // ARCHITECTURE
    { id: 'WORLDS', label: 'Światy Nexusa', labelEn: 'Nexus Worlds', icon: Globe, category: 'ARCHITECTURE', badge: '9', shortcutKey: 'W' },
    { id: 'PROJECTS', label: 'Hub Projektów', labelEn: 'Project Hub', icon: FolderGit2, category: 'ARCHITECTURE', shortcutKey: 'P' },
    { id: 'MISSIONS', label: 'Tablica Misji', labelEn: 'Mission Board', icon: Target, category: 'ARCHITECTURE', badge: openMissionsCount > 0 ? `${openMissionsCount}` : undefined, badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', shortcutKey: 'M' },
    { id: 'MEMORY', label: 'Nexus Memory', labelEn: 'Nexus Memory Base', icon: Database, category: 'ARCHITECTURE', shortcutKey: 'R' },

    // COMMUNITY
    { id: 'FEED', label: 'Builder Feed', labelEn: 'Builder Feed', icon: Radio, category: 'COMMUNITY', shortcutKey: 'F' },
    { id: 'AI_COUNCIL', label: 'Rada AI (7 Agentów)', labelEn: 'AI Council Chamber', icon: Cpu, category: 'COMMUNITY', badge: '7-AI', badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30', shortcutKey: 'C' },
    { id: 'ROOMS', label: 'Pokoje Współpracy', labelEn: 'Family Rooms', icon: MessageSquare, category: 'COMMUNITY', shortcutKey: 'E' },
    { id: 'ARCHITECTS', label: 'Katalog Architektów', labelEn: 'Architect Directory', icon: UserCheck, category: 'COMMUNITY', shortcutKey: 'U' },

    // FOUNDATION
    { id: 'GENESIS', label: 'Genesis Timeline', labelEn: 'Genesis Timeline', icon: History, category: 'FOUNDATION', shortcutKey: 'G' },
    { id: 'CODE', label: 'Kodeks Architekta', labelEn: 'The Nexus Code', icon: Scroll, category: 'FOUNDATION', badge: 'Oath', badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', shortcutKey: 'K' },
    { id: 'AUDIT', label: 'Ścieżka Audytu & Węzły', labelEn: 'Node & Microservice Audit', icon: ShieldCheck, category: 'FOUNDATION', badge: 'Node', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', shortcutKey: 'A' },
    { id: 'REQUEST_ACCESS', label: 'Dołącz / Zaproszenia', labelEn: 'Request Access / Invites', icon: KeyRound, category: 'FOUNDATION' },
    { id: 'ADMIN', label: 'Nexus Control', labelEn: 'Admin Control Center', icon: Sliders, category: 'FOUNDATION', badge: pendingRequestsCount > 0 && (currentRole === 'FOUNDER' || currentRole === 'NEXUS ADMIN') ? `${pendingRequestsCount}` : undefined, badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30' }
  ];

  const handleNavClick = (viewId: ActiveView) => {
    setCurrentView(viewId);
    playCyberSound('click');
    triggerHaptic();
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const categories = ['CORE', 'ARCHITECTURE', 'COMMUNITY', 'FOUNDATION'] as const;

  return (
    <>
      {/* Mobile Backdrop (slides away on hide / mobile click) */}
      {isOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={() => { if (typeof onClose === 'function') onClose(); }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          title={language === 'PL' ? 'Kliknij, aby zamknąć menu' : 'Click to close menu'}
        />
      )}

      {/* Main Cyber Slide-Out / Collapsible Sidebar */}
      <aside
        id="nexus-main-sidebar"
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 sm:w-72 bg-[#080b11]/98 border-r border-cyan-500/20 backdrop-blur-2xl flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out overflow-y-auto ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Top Header of Sidebar with Hide / Collapse button */}
        <div className="sticky top-0 z-10 bg-[#080b11]/95 backdrop-blur-md px-4 py-3 border-b border-cyan-500/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-cyber font-bold text-xs uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              {language === 'PL' ? 'Nawigacja' : 'Navigation'}
            </span>
          </div>

          {/* Quick Collapse Button */}
          <button
            id="sidebar-hide-action-btn"
            onClick={() => { if (typeof onClose === 'function') onClose(); }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/20 hover:border-cyan-400/50 text-cyan-300 hover:text-white text-[11px] font-mono-tech transition-all group"
            title={language === 'PL' ? 'Schowaj menu boczne (Ctrl+B)' : 'Hide sidebar (Ctrl+B)'}
          >
            <PanelLeftClose className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-cyan-400" />
            <span>{language === 'PL' ? 'Schowaj' : 'Hide'}</span>
          </button>
        </div>

        {/* Navigation Modules */}
        <div className="p-3.5 space-y-5 flex-1">
          {categories.map(cat => {
            const items = navItems.filter(item => item.category === cat);
            return (
              <div key={cat} className="space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-mono-tech uppercase tracking-widest text-cyan-400/60 flex items-center justify-between">
                  <span>{cat}</span>
                  <span className="text-[9px] text-slate-600">//</span>
                </div>

                <div className="space-y-0.5">
                  {items.map(item => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`nav-item-${item.id.toLowerCase()}`}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-cyber tracking-wide transition-all duration-150 group relative ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500/25 to-purple-500/15 text-cyan-200 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.15)] font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-cyan-950/35 hover:border-cyan-500/25 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                              isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_#00f0ff]' : 'text-slate-500 group-hover:text-cyan-400'
                            }`}
                          />
                          <span className="truncate">
                            {language === 'PL' ? item.label : item.labelEn}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.shortcutKey && (
                            <kbd
                              className={`hidden group-hover:inline-block px-1.5 py-0.2 text-[9px] font-mono-tech rounded border transition-all ${
                                isActive
                                  ? 'bg-cyan-400 text-black border-cyan-300 font-bold'
                                  : 'bg-black/60 text-cyan-300/80 border-cyan-500/30'
                              }`}
                              title={language === 'PL' ? `Skrót klawiszowy: [ ${item.shortcutKey} ]` : `Keyboard shortcut: [ ${item.shortcutKey} ]`}
                            >
                              {item.shortcutKey}
                            </kbd>
                          )}
                          {item.badge && (
                            <span
                              className={`px-1.5 py-0.5 text-[9px] font-mono-tech rounded border ${
                                item.badgeColor || 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer: Sovereign Formula & Quick Shortcut */}
        <div className="p-3 m-3 rounded-xl bg-gradient-to-br from-cyan-950/40 via-purple-950/20 to-[#0d131f] border border-cyan-500/25 text-xs font-mono-tech text-slate-400 space-y-2">
          <div className="flex items-center justify-between text-cyan-300 font-cyber font-bold text-[11px]">
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              <span>NEXUS FORMULA</span>
            </div>
            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-900/40 text-cyan-300 border border-cyan-500/30">
              CTRL+B
            </span>
          </div>
          <p className="text-[10px] text-slate-300 leading-tight">
            HUMAN + AI + ARCHITECTURE + COLLABORATION = NEXUS
          </p>
          <div className="pt-2 border-t border-cyan-500/10 flex flex-col gap-1 text-[9px]">
            <div className="flex items-center justify-between text-slate-400">
              <span>BELLA SUGGESTS</span>
              <span className="text-purple-300 font-semibold font-mono-tech">WE CHOOSE & BUILD</span>
            </div>
            <div className="text-center py-0.5 rounded bg-purple-950/40 border border-purple-500/30 text-purple-300 font-cyber font-bold tracking-wider">
              NIE JA. NIE TY. MY.
            </div>
          </div>

          {/* Quick Cheat Sheet Button */}
          <button
            id="sidebar-cheat-sheet-btn"
            onClick={() => {
              toggleCheatSheet();
              playCyberSound('click');
              triggerHaptic();
            }}
            className="w-full mt-2 pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[10px] text-cyan-300 hover:text-white group/cs transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-amber-400 group-hover/cs:scale-110 transition-transform" />
              <span className="font-cyber font-semibold tracking-wider">
                {language === 'PL' ? 'KARTA SKRÓTÓW' : 'CHEAT SHEET'}
              </span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-amber-500/40 text-amber-300 text-[9px] font-bold">
              ?
            </kbd>
          </button>
        </div>
      </aside>
    </>
  );
};
