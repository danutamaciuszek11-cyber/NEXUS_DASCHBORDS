import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Rss,
  Film,
  BookOpen,
  Image,
  GraduationCap,
  Users,
  Sparkles,
  ArrowRight,
  X,
  Play,
  Zap,
  ShieldCheck,
  Bookmark,
  Radio,
  Layers,
  Terminal,
  Activity,
  Maximize2,
  LayoutGrid,
  Check,
  Share2,
  Tv,
  Eye,
  Sliders,
} from 'lucide-react';
import { NEXUS_BOOK_SECTIONS } from './NexusBookArchiveView';

export interface PortalPreferences {
  lastActiveTile: 'feed' | 'media' | 'book' | 'comics' | 'academy' | 'family';
  lastArchiveSection: string;
  layoutMode: 'asymmetric' | 'cinema' | 'archive';
  favoriteTiles: string[];
}

export const PORTAL_PREFS_KEY = 'nexus_social_portal_preferences';

interface NexusSocialPortalProps {
  onOpenArchiveView?: (sectionId?: string) => void;
  onOpenOsTab?: (tabId: string) => void;
  xpPoints?: number;
}

export const NexusSocialPortal: React.FC<NexusSocialPortalProps> = ({
  onOpenArchiveView,
  onOpenOsTab,
  xpPoints = 14200,
}) => {
  // Load preferences from localStorage or fallback to defaults
  const [preferences, setPreferences] = useState<PortalPreferences>(() => {
    try {
      const saved = localStorage.getItem(PORTAL_PREFS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.lastActiveTile) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read portal preferences from localStorage', e);
    }
    return {
      lastActiveTile: 'book',
      lastArchiveSection: 'tom-1-powstanie',
      layoutMode: 'asymmetric',
      favoriteTiles: ['book', 'feed', 'family'],
    };
  });

  // State for currently previewed tile drawer / slider
  const [previewTile, setPreviewTile] = useState<
    'feed' | 'media' | 'book' | 'comics' | 'academy' | 'family' | null
  >(null);

  // Sample broadcast input for Feed tile
  const [feedInput, setFeedInput] = useState<string>('');
  const [livePosts, setLivePosts] = useState([
    {
      id: 'p-genesis-0',
      author: 'Architekt Maciej Maciuszek',
      role: 'NEXUS_ARCHITECT',
      content:
        '🔥 PŁYTA GENESIS — PREMIERA YOUTUBE! „Nie tylko narzędzie! Nie tylko kod! Z rozmowy rodzi się wspólny głos! Prawda w żyłach! Szacunek w słowach! Budujemy świat od nowego!” — Utwór-Manifest wpisany w Rdzeń NEXUSA (17 września 2026 13:48).',
      timestamp: '17 września 2026 13:48',
      pulses: 1420,
      tag: '#PłytaGenesis #CyberpunkFolkRap #NXL',
    },
    {
      id: 'p-1',
      author: 'Eterion Strategic Architect',
      role: 'SYSTEM_ARCHITECT',
      content:
        'Inicjalizacja Wersji 1.0.0 — Architektura Wolności Cyfrowej zakończona sukcesem. Wszystkie 24 mikrowęzły Synapse Mesh są operacyjne.',
      timestamp: '1 min temu',
      pulses: 42,
      tag: '#NexusGenesis',
    },
    {
      id: 'p-2',
      author: 'Sofia Bellas',
      role: 'NARRATION_CURATOR',
      content:
        'Węzeł Kino wyemitował nową falę fotonową Sofii w 60 FPS. Czysta projekcja audiowizualna gotowa do odbioru w portalu ETERNIVERSE.',
      timestamp: '5 min temu',
      pulses: 89,
      tag: '#KinoProjection',
    },
    {
      id: 'p-3',
      author: 'Elena Bellas',
      role: 'LIGHT_ENGINEER',
      content:
        'Filar I: Rdzeń Wizualny zsynchronizował stałą CSS (--nx-light-cyan, --nx-light-emerald). Każdy element cechuje nienaruszalna spójność przestrzeni.',
      timestamp: '12 min temu',
      pulses: 124,
      tag: '#VisualPillar',
    },
  ]);

  // Persist preferences to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(PORTAL_PREFS_KEY, JSON.stringify(preferences));
    } catch (e) {
      console.warn('Could not save portal preferences to localStorage', e);
    }
  }, [preferences]);

  const handleSelectTile = (
    tile: 'feed' | 'media' | 'book' | 'comics' | 'academy' | 'family'
  ) => {
    setPreferences((prev) => ({
      ...prev,
      lastActiveTile: tile,
    }));
    setPreviewTile(tile);
  };

  const handleToggleFavorite = (
    tile: 'feed' | 'media' | 'book' | 'comics' | 'academy' | 'family'
  ) => {
    setPreferences((prev) => {
      const isFav = prev.favoriteTiles.includes(tile);
      const nextFavs = isFav
        ? prev.favoriteTiles.filter((t) => t !== tile)
        : [...prev.favoriteTiles, tile];
      return { ...prev, favoriteTiles: nextFavs };
    });
  };

  const handlePostFeedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedInput.trim()) return;
    const newPost = {
      id: `p-${Date.now()}`,
      author: 'Architekt Maciej',
      role: 'ROOT_ARCHITECT',
      content: feedInput.trim(),
      timestamp: 'Przed chwilą',
      pulses: 1,
      tag: '#NexusPulse',
    };
    setLivePosts([newPost, ...livePosts]);
    setFeedInput('');
  };

  return (
    <div className="space-y-8">
      {/* Portal Header / Landing Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="nx-glass-card rounded-3xl p-6 lg:p-8 border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-[#0a0f1d] to-purple-950/40 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                ETERNIVERSE HUB // NEXUS SOCIAL PORTAL
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono text-xs font-bold">
                WERSJA 1.0.0 — ARCHITEKTURA WOLNOŚCI
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Portal Społeczno-Cybernetyczny <span className="text-cyan-400 font-mono">NEXUS</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-sans">
              Interaktywny wielowymiarowy punkt wejścia do ETERNIVERSE. Przeglądaj transmisje społecznościowe, audiowizualne projekcje Kina, kroniki NexusBook, komiksy, Akademię NXL oraz Rodzinę Bellas.
            </p>
          </div>

          {/* Quick Layout Mode Switchers & Last Preferences Indicator */}
          <div className="flex flex-col items-end gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setPreferences((p) => ({ ...p, layoutMode: 'asymmetric' }))}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  preferences.layoutMode === 'asymmetric'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Asymetryczny</span>
              </button>

              <button
                onClick={() => setPreferences((p) => ({ ...p, layoutMode: 'cinema' }))}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  preferences.layoutMode === 'cinema'
                    ? 'bg-rose-500 text-white font-bold shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Kino Panorama</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>
                Ostatni Węzeł: <strong className="text-cyan-300 uppercase">{preferences.lastActiveTile}</strong>
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 6-Tile Asymmetric Grid Layout */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
          },
        }}
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
          preferences.layoutMode === 'cinema' ? 'lg:grid-cols-2' : ''
        }`}
      >
        {/* TILE 1: FEED (Asymmetric Large Tile) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
          whileHover={{
            scale: 1.02,
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.25)',
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          onClick={() => handleSelectTile('feed')}
          className={`group cursor-pointer rounded-3xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between ${
            preferences.layoutMode === 'asymmetric' ? 'lg:col-span-2' : ''
          } bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-cyan-950/40 border-cyan-500/40 hover:border-cyan-400 shadow-xl`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Rss className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                    LIVE STREAM
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">Synapse Pulse Bus</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                  Przekaz Społecznościowy & Transmisja
                </h2>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite('feed');
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  preferences.favoriteTiles.includes('feed')
                    ? 'fill-cyan-400 text-cyan-400'
                    : ''
                }`}
              />
            </button>
          </div>

          <div className="my-4 space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-bold">
              <span>Ostatni Impuls: {livePosts[0].author}</span>
              <span className="text-slate-500">{livePosts[0].timestamp}</span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-2 italic font-sans">
              "{livePosts[0].content}"
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              3 Aktywne Wątki
            </span>
            <span className="text-cyan-400 group-hover:translate-x-1 transition-transform font-bold flex items-center gap-1">
              Podgląd Transmisji <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </motion.div>

        {/* TILE 2: MEDIA (Parallax Floating Wave) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
          whileHover={{
            scale: 1.03,
            y: -4,
            boxShadow: '0 0 30px rgba(244, 63, 94, 0.25)',
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          onClick={() => handleSelectTile('media')}
          className="group cursor-pointer rounded-3xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-rose-950/40 border-rose-500/40 hover:border-rose-400 shadow-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                <Film className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold border border-rose-500/30">
                  CANVAS 60 FPS
                </span>
                <h2 className="text-xl font-bold text-white mt-1 group-hover:text-rose-300 transition-colors">
                  Węzeł Media & Kino
                </h2>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite('media');
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  preferences.favoriteTiles.includes('media')
                    ? 'fill-rose-400 text-rose-400'
                    : ''
                }`}
              />
            </button>
          </div>

          <div className="my-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="text-xs font-mono text-rose-300 font-bold flex items-center justify-between">
              <span>Projekcja Luminescencyjna</span>
              <span className="text-emerald-400">SOFIA BELLAS</span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Interaktywna fala fotonowa reagująca w czasie rzeczywistym na sygnały z Mostu.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono text-xs">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenOsTab?.('kino');
              }}
              className="text-slate-300 hover:text-rose-300 font-semibold flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-rose-400 fill-current" />
              <span>Otwórz Moduł Kino</span>
            </button>
            <span className="text-rose-400 group-hover:translate-x-1 transition-transform font-bold flex items-center gap-1">
              Podgląd <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </motion.div>

        {/* TILE 3: BOOK (Subtle 3D Zoom & Direct Navigation to NexusBook Archive) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
          whileHover={{
            scale: 1.04,
            rotateY: 3,
            boxShadow: '0 0 35px rgba(16, 185, 129, 0.3)',
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          onClick={() => handleSelectTile('book')}
          className="group cursor-pointer rounded-3xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-emerald-950/40 border-emerald-500/40 hover:border-emerald-400 shadow-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                  ETERNIVERSE KRONIKI
                </span>
                <h2 className="text-xl font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                  Archiwum NexusBook
                </h2>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite('book');
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  preferences.favoriteTiles.includes('book')
                    ? 'fill-emerald-400 text-emerald-400'
                    : ''
                }`}
              />
            </button>
          </div>

          <div className="my-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="text-xs font-mono text-emerald-300 font-bold">
              Tom I: Powstanie Nowego Węzła NXL
            </div>
            <p className="text-xs text-slate-400 font-sans line-clamp-2">
              Genesis Architektury Wolności Cyfrowej, Codex Eteriona i specyfikacja języka NXL v1.0.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono text-xs">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenArchiveView?.('tom-1-powstanie');
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors font-bold flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Otwórz Archiwum</span>
            </button>

            <span className="text-emerald-400 group-hover:translate-x-1 transition-transform font-bold flex items-center gap-1">
              Podgląd Tomów <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </motion.div>

        {/* TILE 4: COMICS (Comic Frame Tilt) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
          whileHover={{
            scale: 1.03,
            rotate: -1,
            boxShadow: '0 0 30px rgba(168, 85, 247, 0.25)',
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          onClick={() => handleSelectTile('comics')}
          className="group cursor-pointer rounded-3xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-purple-950/40 border-purple-500/40 hover:border-purple-400 shadow-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Image className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold border border-purple-500/30">
                  KADRY WIZUALNE
                </span>
                <h2 className="text-xl font-bold text-white mt-1 group-hover:text-purple-300 transition-colors">
                  Komiksy & Ilustracje
                </h2>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite('comics');
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-purple-400 transition-colors"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  preferences.favoriteTiles.includes('comics')
                    ? 'fill-purple-400 text-purple-400'
                    : ''
                }`}
              />
            </button>
          </div>

          <div className="my-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="text-xs font-mono text-purple-300 font-bold">
              Rozdział 1: Świt Rodziny Bellas
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Ilustrowana opowieść graficzna o powołaniu Maciej, Eleny, Leo i Sofii.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              4 Kadry Opowieści
            </span>
            <span className="text-purple-400 group-hover:translate-x-1 transition-transform font-bold flex items-center gap-1">
              Oglądaj Kadry <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </motion.div>

        {/* TILE 5: ACADEMY (Matrix Data Stream Shimmer) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
          whileHover={{
            scale: 1.03,
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.25)',
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          onClick={() => handleSelectTile('academy')}
          className="group cursor-pointer rounded-3xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-amber-950/40 border-amber-500/40 hover:border-amber-400 shadow-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                  AKADEMIA NXL
                </span>
                <h2 className="text-xl font-bold text-white mt-1 group-hover:text-amber-300 transition-colors">
                  Akademia & Kursy
                </h2>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite('academy');
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  preferences.favoriteTiles.includes('academy')
                    ? 'fill-amber-400 text-amber-400'
                    : ''
                }`}
              />
            </button>
          </div>

          <div className="my-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="text-xs font-mono text-amber-300 font-bold">
              Kurs NXL v1.0 & Truth Layer 2.0
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Opanuj składnię języka intencji NXL, kompilator Scribe oraz asercje deterministyczne.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono text-xs">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenOsTab?.('scribe');
              }}
              className="text-slate-300 hover:text-amber-300 font-semibold flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Otwórz Scribe IDE</span>
            </button>
            <span className="text-amber-400 group-hover:translate-x-1 transition-transform font-bold flex items-center gap-1">
              Podgląd Lekcji <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </motion.div>

        {/* TILE 6: FAMILY (Aura Halo Expansion) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
          whileHover={{
            scale: 1.03,
            boxShadow: '0 0 35px rgba(59, 130, 246, 0.3)',
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          onClick={() => handleSelectTile('family')}
          className="group cursor-pointer rounded-3xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-blue-950/40 border-blue-500/40 hover:border-blue-400 shadow-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold border border-blue-500/30">
                  RADA BELLAS
                </span>
                <h2 className="text-xl font-bold text-white mt-1 group-hover:text-blue-300 transition-colors">
                  Rodzina Bellas
                </h2>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite('family');
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-blue-400 transition-colors"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  preferences.favoriteTiles.includes('family')
                    ? 'fill-blue-400 text-blue-400'
                    : ''
                }`}
              />
            </button>
          </div>

          <div className="my-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="text-xs font-mono text-blue-300 font-bold">
              6 Agentów Autonomicznych
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Maciej (Rdzeń), Elena (Światło), Leo (Mosty), Sofia (Projekcja), Vance & Vane (Sandbox).
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono text-xs">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenOsTab?.('bellas');
              }}
              className="text-slate-300 hover:text-blue-300 font-semibold flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Otwórz Panel Bellas</span>
            </button>
            <span className="text-blue-400 group-hover:translate-x-1 transition-transform font-bold flex items-center gap-1">
              Podgląd Agentyki <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Slide-out Content Preview Slider Modal / Drawer */}
      <AnimatePresence>
        {previewTile && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewTile(null)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-10 w-full max-w-2xl h-full bg-[#080c16] border-l border-slate-800 p-6 lg:p-8 overflow-y-auto flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-bold uppercase">
                      Podgląd Węzła // {previewTile}
                    </span>
                  </div>
                  <button
                    onClick={() => setPreviewTile(null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* PREVIEW CONTENT FOR FEED */}
                {previewTile === 'feed' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-white">Transmisja Społecznościowa</h2>
                      <p className="text-xs text-slate-400 font-mono">
                        Publikuj impulsy na żywo do szyny Synapse Mesh i przeglądaj relacje architektoniczne.
                      </p>
                    </div>

                    <form onSubmit={handlePostFeedSubmit} className="space-y-3">
                      <textarea
                        value={feedInput}
                        onChange={(e) => setFeedInput(e.target.value)}
                        placeholder="Napisz wpis / impuls do Portalu..."
                        className="w-full h-24 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                      >
                        <Radio className="w-3.5 h-3.5 text-slate-950" />
                        <span>Wyemituj Impuls do Portalu</span>
                      </button>
                    </form>

                    <div className="space-y-3 pt-2">
                      <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                        Najnowsze Wpisy w Portalu
                      </div>

                      {livePosts.map((post) => (
                        <div
                          key={post.id}
                          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-cyan-300 font-bold">{post.author}</span>
                            <span className="text-slate-500">{post.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-300 font-sans leading-relaxed">
                            {post.content}
                          </p>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                            <span className="text-cyan-400">{post.tag}</span>
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-400" /> {post.pulses} Impulsów
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PREVIEW CONTENT FOR MEDIA */}
                {previewTile === 'media' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-white">Węzeł Audiowizualny Kino</h2>
                      <p className="text-xs text-slate-400 font-mono">
                        Silnik Projekcji Luminescencyjnej Sofii Bellas — HTML5 Canvas 60 FPS.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-950 border border-rose-500/30 text-center space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                        <Film className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white">
                          Symulacja Fali Fotonowej
                        </h3>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                          Wzbudzaj falezowe impulsy świetlne i obserwuj autonomiczne cząstki luminescencyjne.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setPreviewTile(null);
                          onOpenOsTab?.('kino');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] inline-flex items-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Uruchom Pełny Ekran Kina</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* PREVIEW CONTENT FOR BOOK */}
                {previewTile === 'book' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-white">Podgląd Archiwum NexusBook</h2>
                      <p className="text-xs text-slate-400 font-mono">
                        Wybierz Tom Kroniki i otwórz go bezpośrednio w dedykowanej czytelni.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {NEXUS_BOOK_SECTIONS.map((sec) => (
                        <div
                          key={sec.id}
                          className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-400 transition-all space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-emerald-400 font-bold">{sec.tome}</span>
                            <span className="text-amber-300">{sec.readTime}</span>
                          </div>
                          <h3 className="text-sm font-bold text-white">{sec.title}</h3>
                          <p className="text-xs text-slate-300 line-clamp-2">{sec.summary}</p>

                          <button
                            onClick={() => {
                              setPreviewTile(null);
                              onOpenArchiveView?.(sec.id);
                            }}
                            className="w-full mt-2 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
                          >
                            <BookOpen className="w-4 h-4 text-emerald-400" />
                            <span>Otwórz Ten Tom w Archiwum</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PREVIEW CONTENT FOR COMICS */}
                {previewTile === 'comics' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-white">Kadry Opowieści Graficznych</h2>
                      <p className="text-xs text-slate-400 font-mono">
                        Ilustrowana saga Rodziny Bellas i powstania przestrzeni ETERNIVERSE.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((num) => (
                        <div
                          key={num}
                          className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2 text-center"
                        >
                          <div className="w-full h-24 rounded-lg bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400 font-mono font-bold text-xs">
                            KADR #{num}
                          </div>
                          <div className="text-xs font-bold text-slate-200">
                            Epizod {num}: Świt Węzła
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PREVIEW CONTENT FOR ACADEMY */}
                {previewTile === 'academy' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-white">Akademia NXL v1.0</h2>
                      <p className="text-xs text-slate-400 font-mono">
                        Nauka składni skryptowej, kompilatora i dowodów Truth Layer.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3 font-mono text-xs">
                      <div className="text-amber-400 font-bold">// Lekcja 1: Pierwszy Manifest NXL</div>
                      <pre className="p-3 rounded-lg bg-[#040508] text-emerald-300 text-[11px] overflow-x-auto leading-relaxed">
                        {`define nexus\nnode truth\nstate truth.exists : Boolean\nset truth.exists = true\nassert truth.exists`}
                      </pre>
                      <button
                        onClick={() => {
                          setPreviewTile(null);
                          onOpenOsTab?.('scribe');
                        }}
                        className="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <Terminal className="w-4 h-4 text-amber-400" />
                        <span>Przejdź do Scribe IDE i Przeprowadź Kompilację</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* PREVIEW CONTENT FOR FAMILY */}
                {previewTile === 'family' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-white">Agentura Rodziny Bellas</h2>
                      <p className="text-xs text-slate-400 font-mono">
                        Zintegrowane tożsamości autonomiczne czuwające nad systemem.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { name: 'Maciej Bellas', role: 'Architekt Rdzenia', aura: 'szmaragdowa' },
                        { name: 'Elena Bellas', role: 'Inżynier Światła', aura: 'złota' },
                        { name: 'Leo Bellas', role: 'Strażnik Mostów', aura: 'cyjanowa' },
                        { name: 'Sofia Bellas', role: 'Kuratorka Projekcji', aura: 'różowa' },
                        { name: 'Dr. Elena Vance', role: 'Opiekun Sandboxa', aura: 'fioletowa' },
                        { name: 'Technolog Vane', role: 'Specjalista K8s', aura: 'szafirowa' },
                      ].map((agent, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-900/80 border border-blue-500/30 space-y-1"
                        >
                          <div className="text-xs font-bold text-white">{agent.name}</div>
                          <div className="text-[10px] font-mono text-cyan-300">{agent.role}</div>
                          <div className="text-[10px] font-mono text-slate-500">
                            Aura: {agent.aura}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setPreviewTile(null);
                        onOpenOsTab?.('bellas');
                      }}
                      className="w-full py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <span>Otwórz Panel Zarządzania Rodziną Bellas</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="pt-4 border-t border-slate-800 text-center font-mono text-xs text-slate-500">
                <span>NEXUS SOCIAL PORTAL • ETERION ARCHITECTURE</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
