import React, { useState } from 'react';
import { useNexus, ActiveView } from '../context/NexusContext';
import {
  Keyboard,
  X,
  Search,
  Radio,
  Target,
  Network,
  LayoutDashboard,
  FolderGit2,
  Database,
  Cpu,
  Globe,
  Brain,
  Scroll,
  MessageSquare,
  UserCheck,
  History,
  Sparkles,
  Command,
  PanelLeftClose,
  Volume2,
  Globe2,
  Flame,
  ArrowRight,
  Zap,
  ShieldCheck,
  CornerDownLeft
} from 'lucide-react';

interface ShortcutDefinition {
  id: string;
  category: 'NAVIGATION' | 'INTERFACE' | 'ACTIONS';
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
  keys: string[];
  secondaryKeys?: string[];
  targetView?: ActiveView;
  actionType?: 'SIDEBAR' | 'BELLA' | 'LANGUAGE' | 'SOUND' | 'SEARCH' | 'ESCAPE';
  icon: React.ElementType;
  badgeColor?: string;
}

export const KeyboardShortcutsModal: React.FC = () => {
  const {
    isCheatSheetOpen,
    setIsCheatSheetOpen,
    language,
    currentView,
    setCurrentView,
    toggleSidebar,
    setShowBellaOverlay,
    setLanguage,
    soundEnabled,
    setSoundEnabled,
    playCyberSound,
    triggerHaptic
  } = useNexus();

  const [filterQuery, setFilterQuery] = useState('');

  if (!isCheatSheetOpen) return null;

  const shortcuts: ShortcutDefinition[] = [
    // PRIMARY NAVIGATION MODULES
    {
      id: 'feed',
      category: 'NAVIGATION',
      title: 'Builder Feed',
      titleEn: 'Builder Feed',
      desc: 'Transmisja projektów, posty i współpraca architektów',
      descEn: 'Live broadcast, builder posts & architect collaboration',
      keys: ['F'],
      secondaryKeys: ['Alt', 'F'],
      targetView: 'FEED',
      icon: Radio,
      badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40'
    },
    {
      id: 'missions',
      category: 'NAVIGATION',
      title: 'Tablica Misji',
      titleEn: 'Mission Board',
      desc: 'Otwarte wyzwania, zlecenia, bounties i rekrutacja',
      descEn: 'Open quests, architectural bounties & missions',
      keys: ['M'],
      secondaryKeys: ['Alt', 'M'],
      targetView: 'MISSIONS',
      icon: Target,
      badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40'
    },
    {
      id: 'map',
      category: 'NAVIGATION',
      title: 'Mapa Rodziny (HUD)',
      titleEn: 'Family Neural Map',
      desc: 'Interaktywna topologia węzłów i relacji ekosystemu',
      descEn: 'Interactive neural topology HUD and node relations',
      keys: ['N'],
      secondaryKeys: ['Alt', 'N'],
      targetView: 'MAP',
      icon: Network,
      badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-950/40'
    },
    {
      id: 'dashboard',
      category: 'NAVIGATION',
      title: 'Centrum Operacji',
      titleEn: 'Command Dashboard',
      desc: 'Główny pulpit telemetryczny, wskaźniki i status Nexusa',
      descEn: 'Primary operations center, metrics & Nexus status',
      keys: ['D'],
      secondaryKeys: ['Alt', 'D'],
      targetView: 'DASHBOARD',
      icon: LayoutDashboard
    },
    {
      id: 'projects',
      category: 'NAVIGATION',
      title: 'Hub Projektów',
      titleEn: 'Project Hub',
      desc: 'Repozytoria, aktywne klastry i repozytoria kodu',
      descEn: 'Project repositories, active clusters & code repos',
      keys: ['P'],
      secondaryKeys: ['Alt', 'P'],
      targetView: 'PROJECTS',
      icon: FolderGit2
    },
    {
      id: 'memory',
      category: 'NAVIGATION',
      title: 'Nexus Memory',
      titleEn: 'Nexus Memory RFC Base',
      desc: 'Żywe repozytorium RFC, protokoły i aksjomaty wiedzy',
      descEn: 'Living RFC repository, technical protocols & knowledge',
      keys: ['R'],
      secondaryKeys: ['Alt', 'R'],
      targetView: 'MEMORY',
      icon: Database
    },
    {
      id: 'council',
      category: 'NAVIGATION',
      title: 'Rada AI (7 Agentów)',
      titleEn: 'AI Council Chamber',
      desc: 'Wielogłosowa ocena architektury i audyty synaptyczne',
      descEn: 'Multi-agent architectural consensus & synapse audits',
      keys: ['C'],
      secondaryKeys: ['Alt', 'C'],
      targetView: 'AI_COUNCIL',
      icon: Cpu,
      badgeColor: 'text-pink-400 border-pink-500/40 bg-pink-950/40'
    },
    {
      id: 'worlds',
      category: 'NAVIGATION',
      title: 'Światy Nexusa',
      titleEn: 'Nexus Worlds',
      desc: 'Katalog sub-światów i domen federacji (9 domen)',
      descEn: 'Directory of federation sub-worlds (9 domains)',
      keys: ['W'],
      secondaryKeys: ['Alt', 'W'],
      targetView: 'WORLDS',
      icon: Globe
    },
    {
      id: 'bella',
      category: 'NAVIGATION',
      title: 'State Bella AI Node',
      titleEn: 'State Bella AI Node',
      desc: 'Model kognitywny, logika decyzyjna i podpowiedzi',
      descEn: 'Cognitive model, decision logic & AI guidance',
      keys: ['B'],
      secondaryKeys: ['Alt', 'B'],
      targetView: 'BELLA',
      icon: Brain
    },
    {
      id: 'code',
      category: 'NAVIGATION',
      title: 'Kodeks Architekta',
      titleEn: 'The Nexus Code',
      desc: '7 Świętych Zasad, Przymierze i Przysięga Architekta',
      descEn: 'The 7 Sacred Tenets & Sovereign Builder Oath',
      keys: ['K'],
      secondaryKeys: ['Alt', 'K'],
      targetView: 'CODE',
      icon: Scroll
    },
    {
      id: 'rooms',
      category: 'NAVIGATION',
      title: 'Pokoje Współpracy',
      titleEn: 'Family Rooms',
      desc: 'Pokoje narad, kanały synaptyczne i dyskusje live',
      descEn: 'Collaboration rooms, synaptic channels & live chat',
      keys: ['E'],
      secondaryKeys: ['Alt', 'E'],
      targetView: 'ROOMS',
      icon: MessageSquare
    },
    {
      id: 'architects',
      category: 'NAVIGATION',
      title: 'Katalog Architektów',
      titleEn: 'Architect Directory',
      desc: 'Profile członków rodziny, synergie i węzły Brotherhood',
      descEn: 'Family directory, synergy matches & Brotherhood nodes',
      keys: ['U'],
      secondaryKeys: ['Alt', 'U'],
      targetView: 'ARCHITECTS',
      icon: UserCheck
    },
    {
      id: 'genesis',
      category: 'NAVIGATION',
      title: 'Genesis Timeline',
      titleEn: 'Genesis Timeline',
      desc: 'Oś czasu ewolucji Nexusa od Początku do Przyszłości',
      descEn: 'Timeline of Nexus evolution from Inception onwards',
      keys: ['G'],
      secondaryKeys: ['Alt', 'G'],
      targetView: 'GENESIS',
      icon: History
    },
    {
      id: 'audit',
      category: 'NAVIGATION',
      title: 'Ścieżka Audytu & Węzły',
      titleEn: 'Node & Microservice Audit',
      desc: 'Rejestr telemetryczny, autoryzacja tokenu węzła i audyt mikroserwisów',
      descEn: 'Node identity token audit, telemetry and microservice security',
      keys: ['A'],
      secondaryKeys: ['Alt', 'A'],
      targetView: 'AUDIT',
      icon: ShieldCheck,
      badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40'
    },

    // INTERFACE & SYSTEM SHORTCUTS
    {
      id: 'sidebar',
      category: 'INTERFACE',
      title: 'Schowaj / Pokaż Menu Boczne',
      titleEn: 'Toggle Sidebar Menu',
      desc: 'Ukrywa lub rozwija boczny pasek nawigacji',
      descEn: 'Collapses or expands the main left navigation drawer',
      keys: ['Ctrl', 'B'],
      secondaryKeys: ['⌘', 'B'],
      actionType: 'SIDEBAR',
      icon: PanelLeftClose,
      badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40'
    },
    {
      id: 'cheat-sheet',
      category: 'INTERFACE',
      title: 'Karta Skrótów (Cheat Sheet)',
      titleEn: 'Keyboard Shortcuts Cheat Sheet',
      desc: 'Otwiera lub zamyka ten przewodnik po skrótach',
      descEn: 'Opens or closes this interactive shortcuts matrix',
      keys: ['?'],
      secondaryKeys: ['Ctrl', '/'],
      icon: Keyboard,
      badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-950/40'
    },
    {
      id: 'bella-overlay',
      category: 'INTERFACE',
      title: 'Asystentka State Bella (Overlay)',
      titleEn: 'State Bella AI Assistant Overlay',
      desc: 'Szybkie wywołanie asystentki kognitywnej AI w oknie',
      descEn: 'Quick modal summon for cognitive AI suggestions',
      keys: ['Ctrl', 'Space'],
      secondaryKeys: ['⌘', 'K'],
      actionType: 'BELLA',
      icon: Sparkles,
      badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40'
    },
    {
      id: 'escape',
      category: 'INTERFACE',
      title: 'Zamknij Okna & Overlays',
      titleEn: 'Close Modals & Overlays',
      desc: 'Zamyka aktywne modale, karty szczegółów lub Cheat Sheet',
      descEn: 'Dismisses open modal dialogs, drawers, or Cheat Sheet',
      keys: ['Esc'],
      actionType: 'ESCAPE',
      icon: X
    },
    {
      id: 'language-toggle',
      category: 'ACTIONS',
      title: 'Przełącz Język (PL / EN)',
      titleEn: 'Toggle Interface Language (PL / EN)',
      desc: 'Błyskawiczne przełączanie języka interfejsu',
      descEn: 'Instant language toggle across the portal',
      keys: ['L'],
      actionType: 'LANGUAGE',
      icon: Globe2
    },
    {
      id: 'sound-toggle',
      category: 'ACTIONS',
      title: 'Włącz / Wyłącz Efekty Audio FX',
      titleEn: 'Toggle Cyber Audio Effects',
      desc: 'Wycisza lub odblokowuje dźwięki telemetryczne',
      descEn: 'Mutes or unmutes reactive interface sound effects',
      keys: ['S'],
      actionType: 'SOUND',
      icon: Volume2
    },
    {
      id: 'global-search',
      category: 'ACTIONS',
      title: 'Szukaj w Nexus (Search Focus)',
      titleEn: 'Global Search Focus',
      desc: 'Aktywuje pasek wyszukiwania projektów i misji',
      descEn: 'Focuses the top search bar for instant filtering',
      keys: ['/'],
      actionType: 'SEARCH',
      icon: Search
    }
  ];

  const filteredShortcuts = shortcuts.filter(s => {
    const q = filterQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      s.titleEn.toLowerCase().includes(q) ||
      s.desc.toLowerCase().includes(q) ||
      s.descEn.toLowerCase().includes(q) ||
      s.keys.some(k => k.toLowerCase().includes(q)) ||
      (s.secondaryKeys && s.secondaryKeys.some(k => k.toLowerCase().includes(q)))
    );
  });

  const handleShortcutClick = (shortcut: ShortcutDefinition) => {
    playCyberSound('click');
    triggerHaptic();

    if (shortcut.targetView) {
      setCurrentView(shortcut.targetView);
      setIsCheatSheetOpen(false);
      return;
    }

    if (shortcut.actionType === 'SIDEBAR') {
      toggleSidebar();
      setIsCheatSheetOpen(false);
      return;
    }

    if (shortcut.actionType === 'BELLA') {
      setIsCheatSheetOpen(false);
      setShowBellaOverlay(true);
      return;
    }

    if (shortcut.actionType === 'LANGUAGE') {
      setLanguage(language === 'PL' ? 'EN' : 'PL');
      return;
    }

    if (shortcut.actionType === 'SOUND') {
      setSoundEnabled(!soundEnabled);
      return;
    }

    if (shortcut.actionType === 'SEARCH') {
      setIsCheatSheetOpen(false);
      setTimeout(() => {
        const input = document.getElementById('global-search-input') as HTMLInputElement | null;
        input?.focus();
      }, 100);
      return;
    }

    if (shortcut.actionType === 'ESCAPE') {
      setIsCheatSheetOpen(false);
    }
  };

  const navList = filteredShortcuts.filter(s => s.category === 'NAVIGATION');
  const interfaceList = filteredShortcuts.filter(s => s.category === 'INTERFACE' || s.category === 'ACTIONS');

  return (
    <div
      id="keyboard-shortcuts-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => {
        setIsCheatSheetOpen(false);
        playCyberSound('click');
      }}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#070b14]/98 border-2 border-cyan-400/60 rounded-2xl shadow-[0_0_60px_rgba(0,240,255,0.25)] flex flex-col overflow-hidden text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Glowing Header */}
        <div className="bg-gradient-to-r from-cyan-950/70 via-[#0a0f1d] to-purple-950/60 p-5 border-b border-cyan-500/25 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Keyboard className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cyber font-bold text-base sm:text-lg text-white tracking-wider flex items-center gap-2">
                  <span>NEXUS COMMAND MATRIX</span>
                  <span className="text-cyan-400">//</span>
                  <span className="text-cyan-300 text-xs sm:text-sm font-mono-tech">
                    {language === 'PL' ? 'KARTA SKRÓTÓW' : 'CHEAT SHEET'}
                  </span>
                </h2>
                <span className="hidden sm:inline px-2 py-0.5 rounded text-[9px] font-mono-tech bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  GLOBAL KEYS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {language === 'PL'
                  ? 'Błyskawiczna nawigacja po modułach i kontrola systemu za pomocą klawiatury'
                  : 'Fast module navigation & system controls with global keyboard shortcuts'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-cyan-500/20 text-[11px] font-mono-tech text-slate-400">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                ESC
              </kbd>
              <span>to close</span>
            </div>
            <button
              id="shortcuts-close-btn"
              onClick={() => {
                setIsCheatSheetOpen(false);
                playCyberSound('click');
              }}
              className="p-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-400 text-slate-400 hover:text-white transition-all"
              title="Close Cheat Sheet (Esc)"
            >
              <X className="w-5 h-5 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Search / Filter Bar */}
        <div className="px-5 py-3 bg-[#0a0e19] border-b border-cyan-500/15 flex items-center gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/70" />
            <input
              id="shortcuts-filter-input"
              type="text"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              placeholder={
                language === 'PL'
                  ? 'Filtruj skróty (np. feed, misje, mapa, sidebar, ctrl)...'
                  : 'Filter shortcuts (e.g. feed, missions, map, sidebar, ctrl)...'
              }
              className="w-full bg-[#0d1424] border border-cyan-500/20 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 font-sans transition-all"
              autoFocus
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-cyan-300"
              >
                ✕
              </button>
            )}
          </div>
          <div className="text-[11px] font-mono-tech text-cyan-400/80 shrink-0">
            <span>{filteredShortcuts.length} {language === 'PL' ? 'skrótów' : 'shortcuts'}</span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {/* SECTION 1: GLOBAL NAVIGATION MODULES */}
          {navList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="font-cyber font-bold text-xs uppercase tracking-wider text-cyan-300">
                    {language === 'PL' ? 'GŁÓWNA NAWIGACJA (MODUŁY)' : 'PRIMARY MODULE NAVIGATION'}
                  </span>
                </div>
                <span className="text-[10px] font-mono-tech text-slate-400">
                  {language === 'PL' ? 'Jednoliterowe klawisze lub Alt + Klawisz' : 'Single key or Alt + Key'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {navList.map(item => {
                  const Icon = item.icon;
                  const isCurrent = currentView === item.targetView;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleShortcutClick(item)}
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 group relative ${
                        isCurrent
                          ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.15)] text-white'
                          : 'bg-[#0b101c] border-slate-800/80 hover:border-cyan-500/40 hover:bg-[#0f1627] text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                            isCurrent
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                              : 'bg-black/50 border-slate-700 text-slate-400 group-hover:border-cyan-500/40 group-hover:text-cyan-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-cyber font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                              {language === 'PL' ? item.title : item.titleEn}
                            </span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded text-[8px] font-mono-tech bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate font-sans">
                            {language === 'PL' ? item.desc : item.descEn}
                          </p>
                        </div>
                      </div>

                      {/* Keys Display */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.secondaryKeys && (
                          <div className="hidden lg:flex items-center gap-1 opacity-70">
                            {item.secondaryKeys.map((k, i) => (
                              <kbd
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-black/60 border border-slate-700 text-[10px] font-mono-tech text-slate-300 font-semibold"
                              >
                                {k}
                              </kbd>
                            ))}
                            <span className="text-[10px] text-slate-500">/</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          {item.keys.map((k, i) => (
                            <kbd
                              key={i}
                              className={`px-2 py-1 rounded font-mono-tech text-xs font-bold shadow-md transition-all ${
                                isCurrent
                                  ? 'bg-cyan-400 text-black border border-cyan-300 shadow-[0_0_8px_#00f0ff]'
                                  : 'bg-[#121a2d] text-cyan-300 border border-cyan-500/30 group-hover:border-cyan-400 group-hover:bg-cyan-950/80'
                              }`}
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: INTERFACE & SYSTEM ACTIONS */}
          {interfaceList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <Command className="w-4 h-4 text-purple-400" />
                  <span className="font-cyber font-bold text-xs uppercase tracking-wider text-purple-300">
                    {language === 'PL' ? 'KONTROLA INTERFEJSU & SYSTEM' : 'INTERFACE & SYSTEM CONTROLS'}
                  </span>
                </div>
                <span className="text-[10px] font-mono-tech text-slate-400">
                  {language === 'PL' ? 'Kombinacje klawiszy systemowych' : 'System key combinations'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {interfaceList.map(item => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleShortcutClick(item)}
                      className="w-full text-left p-3 rounded-xl border border-slate-800/80 hover:border-purple-500/40 bg-[#0b101c] hover:bg-[#0f1627] transition-all duration-150 flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-black/50 border border-slate-700 text-slate-400 group-hover:border-purple-500/40 group-hover:text-purple-300 transition-all">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <span className="font-cyber font-bold text-xs text-white group-hover:text-purple-300 transition-colors">
                            {language === 'PL' ? item.title : item.titleEn}
                          </span>
                          <p className="text-[11px] text-slate-400 truncate font-sans">
                            {language === 'PL' ? item.desc : item.descEn}
                          </p>
                        </div>
                      </div>

                      {/* Keys Display */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.secondaryKeys && (
                          <div className="hidden lg:flex items-center gap-1 opacity-70">
                            {item.secondaryKeys.map((k, i) => (
                              <kbd
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-black/60 border border-slate-700 text-[10px] font-mono-tech text-slate-300 font-semibold"
                              >
                                {k}
                              </kbd>
                            ))}
                            <span className="text-[10px] text-slate-500">/</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          {item.keys.map((k, i) => (
                            <kbd
                              key={i}
                              className="px-2 py-1 rounded bg-[#151226] text-purple-300 border border-purple-500/30 group-hover:border-purple-400 group-hover:bg-purple-950/80 font-mono-tech text-xs font-bold shadow-md transition-all"
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredShortcuts.length === 0 && (
            <div className="text-center py-12 space-y-3">
              <Keyboard className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="font-cyber text-sm text-slate-400">
                {language === 'PL' ? 'Nie znaleziono skrótów dla podanego zapytania.' : 'No shortcuts matching your search query.'}
              </p>
              <button
                onClick={() => setFilterQuery('')}
                className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-xs font-mono-tech"
              >
                {language === 'PL' ? 'Wyczyść filtr' : 'Clear filter'}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Proactive Tips Footer */}
        <div className="p-4 bg-gradient-to-r from-[#080d19] via-[#090b14] to-[#0d0919] border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-tech text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              {language === 'PL'
                ? 'Wskazówka: Skróty jednolitrowe (F, M, N...) działają zawsze, gdy nie piszesz w polach tekstowych.'
                : 'Pro-tip: Single-key navigation (F, M, N...) is active whenever you are not typing in input fields.'}
            </span>
          </div>

          <button
            onClick={() => setIsCheatSheetOpen(false)}
            className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs transition-colors shrink-0 shadow-[0_0_12px_rgba(0,240,255,0.3)]"
          >
            {language === 'PL' ? 'ZAMKNIJ PRZEWODNIK' : 'CLOSE MATRIX'}
          </button>
        </div>
      </div>
    </div>
  );
};
