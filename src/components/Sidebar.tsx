import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Headphones, 
  UserCheck, 
  Grid,
  Bookmark,
  BookmarkCheck,
  Trash2,
  FolderPlus,
  Sparkles,
  Shield,
  Cpu,
  Flame,
  Star,
  Zap,
  Hourglass,
  Wand2,
  Database,
  Network,
  UploadCloud,
  Image as ImageIcon
} from 'lucide-react';
import { SeekerId, BookCollection, PilotProfile, ChapterBookmark } from '../types';
import { SEEKERS_CONFIG } from '../data/booksData';
import { soundFx } from '../utils/audioSystem';

interface SidebarProps {
  activeSeeker: SeekerId | 'ALL';
  onSelectSeeker: (seeker: SeekerId | 'ALL') => void;
  activeFormat: 'all' | 'manifesto' | 'pdf' | 'audio' | 'author_notes';
  onSelectFormat: (format: 'all' | 'manifesto' | 'pdf' | 'audio' | 'author_notes') => void;
  bookCountsBySeeker: Record<string, number>;
  collections?: BookCollection[];
  activeCollectionId?: string | null;
  onSelectCollectionFilter?: (colId: string | null) => void;
  onOpenCollectionsModal?: () => void;
  bookmarks?: ChapterBookmark[];
  onSelectBookmark?: (bookId: string, chapterId: string) => void;
  onDeleteBookmark?: (id: string) => void;
  onOpenQuantumLogin?: () => void;
  onOpenNeuralArchitect?: () => void;
  onOpenCreatorSoulEngine?: () => void;
  onOpenAuthorAssetLibrary?: () => void;
  onOpenEditorialStudio?: () => void;
  onOpenHtmlStudio?: () => void;
  onOpenImportModal?: () => void;
  onOpenNexusEcosystem?: () => void;
  onOpenShortcuts?: () => void;
  onOpenDatabaseStatus?: () => void;
  isDatabaseConnected?: boolean;
  currentPilot?: PilotProfile | null;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSeeker,
  onSelectSeeker,
  activeFormat,
  onSelectFormat,
  bookCountsBySeeker,
  collections = [],
  activeCollectionId = null,
  onSelectCollectionFilter = (_colId: string | null) => {},
  onOpenCollectionsModal = () => {},
  bookmarks = [],
  onSelectBookmark = (_bookId: string, _chapterId: string) => {},
  onDeleteBookmark = (_id: string) => {},
  onOpenQuantumLogin,
  onOpenNeuralArchitect,
  onOpenCreatorSoulEngine,
  onOpenAuthorAssetLibrary,
  onOpenEditorialStudio,
  onOpenHtmlStudio,
  onOpenImportModal,
  onOpenNexusEcosystem,
  onOpenShortcuts,
  onOpenDatabaseStatus,
  isDatabaseConnected = true,
  currentPilot,
  isOpenMobile,
  onCloseMobile
}) => {
  const [seekersExpanded, setSeekersExpanded] = useState(true);
  const [collectionsExpanded, setCollectionsExpanded] = useState(true);
  const [bookmarksExpanded, setBookmarksExpanded] = useState(true);

  const seekerDotColors: Record<SeekerId, string> = {
    InterSeeker: 'bg-blue-500',
    EterSeeker: 'bg-amber-500',
    BioSeeker: 'bg-emerald-500',
    TabuSeeker: 'bg-red-600',
    ChronoSeeker: 'bg-purple-500',
    MirrorSeeker: 'bg-slate-300',
    SpiritSeeker: 'bg-cyan-400',
    ObfitoSeeker: 'bg-orange-500',
    Operator001: 'bg-gray-500'
  };

  const handleSeekerClick = (id: SeekerId | 'ALL') => {
    soundFx.playClick();
    onSelectCollectionFilter(null);
    onSelectSeeker(id);
    onSelectFormat('all');
    if (window.innerWidth < 1024) onCloseMobile();
  };

  const handleFormatClick = (format: 'all' | 'manifesto' | 'pdf' | 'audio' | 'author_notes') => {
    soundFx.playClick();
    onSelectCollectionFilter(null);
    onSelectFormat(format);
    if (window.innerWidth < 1024) onCloseMobile();
  };

  const handleCollectionClick = (colId: string) => {
    soundFx.playClick();
    if (activeCollectionId === colId) {
      onSelectCollectionFilter(null);
    } else {
      onSelectCollectionFilter(colId);
    }
    if (window.innerWidth < 1024) onCloseMobile();
  };

  const renderIcon = (iconName: string, className = 'w-3.5 h-3.5') => {
    switch (iconName) {
      case 'Shield': return <Shield className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Hourglass': return <Hourglass className={className} />;
      case 'Star': return <Star className={className} />;
      case 'Zap': return <Zap className={className} />;
      default: return <Bookmark className={className} />;
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed lg:sticky top-[60px] left-0 z-40 h-[calc(100vh-60px)] w-[220px] 
        bg-black/20 backdrop-blur-md border-r border-white/10 
        flex flex-col transition-transform duration-300 ease-in-out overflow-y-auto custom-scrollbar select-none shrink-0
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-black tracking-tighter text-white leading-none">NEXUSBOOK</h1>
          <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase mt-1">Eterniverse OS v.1.0</p>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          
          {/* Neural Content Architect & Creator Soul Engine Banners */}
          <div className="px-2 pb-2 space-y-2">
            <button
              onClick={() => {
                soundFx.playModalOpen();
                onOpenHtmlStudio?.();
                if (isOpenMobile) onCloseMobile();
              }}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-red-950 via-zinc-900 to-cyan-950 border border-red-500/50 hover:border-red-400 text-left transition-all shadow-md group cursor-pointer"
            >
              <div className="flex items-center justify-between font-mono text-xs text-white font-bold">
                <span className="flex items-center gap-1.5 text-red-300 group-hover:text-cyan-300 transition-colors">
                  <Zap className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                  KREATOR ŚWIATÓW HTML
                </span>
                <span className="text-[9px] px-1 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30">
                  NEW
                </span>
              </div>
              <p className="text-[9px] text-white/50 font-sans leading-tight mt-0.5">
                Kreator Manifestów z kodu HTML
              </p>
            </button>

            <button
              onClick={() => {
                soundFx.playModalOpen();
                onOpenCreatorSoulEngine?.();
                if (isOpenMobile) onCloseMobile();
              }}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-cyan-950 via-slate-900 to-purple-950 border border-cyan-500/50 hover:border-cyan-300 text-left transition-all shadow-lg shadow-cyan-950/40 group cursor-pointer"
            >
              <div className="flex items-center justify-between font-mono text-xs text-white font-bold mb-1">
                <span className="flex items-center gap-1.5 text-cyan-300 group-hover:text-white transition-colors">
                  <Sparkles className="w-4 h-4 text-cyan-400 group-hover:animate-pulse" />
                  CREATOR SOUL ENGINE
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  SOUL DNA
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-sans leading-tight">
                Tożsamość, Przestrzeń Wystawowa & Visual DNA
              </p>
            </button>

            <button
              onClick={() => {
                soundFx.playModalOpen();
                onOpenNeuralArchitect?.();
                if (isOpenMobile) onCloseMobile();
              }}
              className="w-full p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30 hover:border-purple-400 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between font-mono text-xs text-white font-bold">
                <span className="flex items-center gap-1.5 text-purple-300 group-hover:text-white transition-colors">
                  <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                  NEURAL ARCHITECT
                </span>
                <span className="text-[9px] px-1 py-0.5 rounded bg-purple-950 text-purple-300">
                  AI CO-PILOT
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                soundFx.playModalOpen();
                onOpenEditorialStudio?.();
                if (isOpenMobile) onCloseMobile();
              }}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-cyan-950 via-slate-900 to-purple-950 border border-cyan-500/50 hover:border-cyan-300 text-left transition-all shadow-md group cursor-pointer"
            >
              <div className="flex items-center justify-between font-mono text-xs text-white font-bold">
                <span className="flex items-center gap-1.5 text-cyan-300 group-hover:text-white transition-colors">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  EDITORIAL STUDIO
                </span>
                <span className="text-[9px] px-1 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  REDAKCJA
                </span>
              </div>
              <p className="text-[9px] text-white/50 font-sans leading-tight mt-0.5">
                Panel wydawniczy, okładki, wersje i manifest
              </p>
            </button>

            <button
              onClick={() => {
                soundFx.playModalOpen();
                onOpenImportModal?.();
                if (isOpenMobile) onCloseMobile();
              }}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 border border-cyan-500/50 hover:border-cyan-300 text-left transition-all shadow-md group cursor-pointer"
            >
              <div className="flex items-center justify-between font-mono text-xs text-white font-bold">
                <span className="flex items-center gap-1.5 text-cyan-300 group-hover:text-white transition-colors">
                  <UploadCloud className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  IMPORT PDF / SUBSTACK
                </span>
                <span className="text-[9px] px-1 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  AUTO
                </span>
              </div>
              <p className="text-[9px] text-white/50 font-sans leading-tight mt-0.5">
                Upuść pliki PDF i zasil NexusBook
              </p>
            </button>
          </div>


          {/* Main Library Selection */}
          <div>
            <p className="text-[10px] font-mono text-white/30 uppercase mb-3 px-2 tracking-widest">Global Vault</p>
            <button
              onClick={() => handleSeekerClick('ALL')}
              className={`
                w-full flex items-center justify-between p-2 rounded-lg font-mono text-xs transition-colors
                ${activeSeeker === 'ALL' && activeFormat === 'all' && !activeCollectionId
                  ? 'bg-white/10 text-white font-bold border border-white/20'
                  : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'}
              `}
            >
              <div className="flex items-center gap-2.5">
                <Grid className="w-4 h-4 text-blue-400" />
                <span>Wszystkie Dzieła</span>
              </div>
              <span className="text-[10px] font-mono text-white/40 px-1.5 py-0.5 rounded bg-white/5">
                {bookCountsBySeeker.ALL || 0}
              </span>
            </button>
          </div>

          {/* User Collections & Series Section */}
          <div>
            <div className="flex items-center justify-between mb-2 px-2">
              <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Serie & Kolekcje ({collections.length})</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenCollectionsModal();
                  }}
                  className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
                  title="Zarządzaj Kolekcjami & Seriami"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCollectionsExpanded(!collectionsExpanded)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  {collectionsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {collectionsExpanded && (
              <ul className="space-y-1 text-xs font-mono">
                {collections.map((col) => {
                  const isActive = activeCollectionId === col.id;
                  return (
                    <li key={col.id}>
                      <button
                        onClick={() => handleCollectionClick(col.id)}
                        className={`
                          w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left
                          ${isActive
                            ? 'bg-purple-950/70 border border-purple-500/40 text-purple-200 font-bold shadow-sm'
                            : 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent'}
                        `}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span style={{ color: col.color }}>{renderIcon(col.icon)}</span>
                          <span className="truncate">{col.name}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {col.type && (
                            <span className="text-[8px] font-mono text-purple-300 px-1 py-0.2 rounded bg-purple-900/40 border border-purple-500/30">
                              {col.type === 'Sekwencyjna' ? 'SEKW' : 'SERIA'}
                            </span>
                          )}
                          <span className="text-[9px] font-mono text-white/50 px-1.5 py-0.5 rounded bg-white/5 shrink-0">
                            {col.totalExpected ? `${col.bookIds.length}/${col.totalExpected}` : col.bookIds.length}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Chapter Bookmarks Section */}
          <div>
            <div className="flex items-center justify-between mb-2 px-2">
              <div className="flex items-center gap-1.5">
                <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                <p className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                  Zakładki ({bookmarks.length})
                </p>
              </div>
              <button
                onClick={() => setBookmarksExpanded(!bookmarksExpanded)}
                className="text-white/40 hover:text-white transition-colors"
                title={bookmarksExpanded ? 'Zwiń zakładki' : 'Rozwiń zakładki'}
              >
                {bookmarksExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>

            {bookmarksExpanded && (
              <div className="space-y-1">
                {bookmarks.length === 0 ? (
                  <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-[11px] font-mono text-amber-300/60 leading-relaxed">
                    Brak zakładek. Zapisuj rozdziały w czytniku, aby szybko tu wracać.
                  </div>
                ) : (
                  <ul className="space-y-1 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                    {bookmarks.map((bm) => (
                      <li key={bm.id} className="group relative">
                        <div
                          className="w-full flex items-start justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-amber-950/40 border border-white/5 hover:border-amber-500/40 transition-all text-left cursor-pointer"
                          onClick={() => {
                            soundFx.playClick();
                            onSelectBookmark(bm.bookId, bm.chapterId);
                            if (window.innerWidth < 1024) onCloseMobile();
                          }}
                        >
                          <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-center gap-1.5">
                              <span 
                                className="w-1.5 h-1.5 rounded-full shrink-0" 
                                style={{ backgroundColor: bm.seekerColor || '#f59e0b' }} 
                              />
                              <span className="text-xs font-mono font-bold text-white truncate group-hover:text-amber-200">
                                {bm.bookTitle}
                              </span>
                            </div>
                            <p className="text-[11px] font-mono text-amber-400/90 truncate mt-0.5 pl-3">
                              R0{bm.chapterNumber}: {bm.chapterTitle}
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              soundFx.playDelete();
                              onDeleteBookmark(bm.id);
                            }}
                            className="absolute right-2 top-2 p-1 rounded hover:bg-red-950/80 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Usuń zakładkę"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Archive Gates (Seekers) */}
          <div>
            <div className="flex items-center justify-between mb-3 px-2">
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Archive Gates</p>
              <button
                onClick={() => setSeekersExpanded(!seekersExpanded)}
                className="text-white/40 hover:text-white transition-colors"
              >
                {seekersExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>

            {seekersExpanded && (
              <ul className="space-y-1 text-sm font-medium">
                {(Object.keys(SEEKERS_CONFIG) as SeekerId[]).map((seekerId) => {
                  const cfg = SEEKERS_CONFIG[seekerId];
                  const isActive = activeSeeker === seekerId && activeFormat === 'all';
                  const count = bookCountsBySeeker[seekerId] || 0;
                  const dotColorClass = seekerDotColors[seekerId] || 'bg-blue-500';

                  return (
                    <li key={seekerId}>
                      <button
                        onClick={() => handleSeekerClick(seekerId)}
                        className={`
                          w-full flex items-center justify-between p-2 rounded-lg transition-colors font-sans text-xs
                          ${isActive
                            ? 'bg-white/10 text-white font-bold border border-white/20 shadow-sm'
                            : 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent'}
                        `}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className={`w-2 h-2 rounded-full ${dotColorClass} shrink-0`} />
                          <span className="truncate">{cfg.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-white/40 px-1.5 py-0.5 rounded bg-white/5">
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Resource Type */}
          <div>
            <p className="text-[10px] font-mono text-white/30 uppercase mb-3 px-2 tracking-widest">Resource Type</p>
            <ul className="space-y-1 text-xs text-white/60 font-mono">
              <li>
                <button
                  onClick={() => handleFormatClick('manifesto')}
                  className={`w-full text-left py-1.5 px-2 rounded-md hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors ${activeFormat === 'manifesto' ? 'text-white font-bold bg-white/10' : ''}`}
                >
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>Manifestos</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleFormatClick('pdf')}
                  className={`w-full text-left py-1.5 px-2 rounded-md hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors ${activeFormat === 'pdf' ? 'text-white font-bold bg-white/10' : ''}`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>PDF Vault</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleFormatClick('audio')}
                  className={`w-full text-left py-1.5 px-2 rounded-md hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors ${activeFormat === 'audio' ? 'text-white font-bold bg-white/10' : ''}`}
                >
                  <Headphones className="w-3.5 h-3.5 text-amber-400" />
                  <span>Audio Archives</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleFormatClick('author_notes')}
                  className={`w-full text-left py-1.5 px-2 rounded-md hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors ${activeFormat === 'author_notes' ? 'text-white font-bold bg-white/10' : ''}`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Author Notes</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Author Asset Library Link */}
          <div className="pt-2">
            <button
              onClick={() => {
                soundFx.playModalOpen();
                onOpenAuthorAssetLibrary?.();
                if (isOpenMobile) onCloseMobile();
              }}
              className="w-full py-2 px-2.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 hover:border-cyan-400 flex items-center justify-between text-xs font-mono text-cyan-300 transition-all cursor-pointer group shadow-sm"
            >
              <span className="flex items-center gap-2 truncate">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate font-bold">BIBLIOTEKA GRAFIK</span>
              </span>
              <span className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold shrink-0">
                <span className="px-1 py-0.5 rounded bg-cyan-950 border border-cyan-500/50 text-[9px]">SHA-256</span>
              </span>
            </button>
          </div>

          {/* Database Live Telemetry Link */}
          <div className="pt-2">
            <button
              onClick={() => {
                soundFx.playModalOpen();
                onOpenDatabaseStatus?.();
                if (isOpenMobile) onCloseMobile();
              }}
              className={`w-full py-2 px-2.5 rounded-lg border flex items-center justify-between text-xs font-mono transition-all cursor-pointer group ${
                isDatabaseConnected
                  ? 'bg-emerald-950/30 hover:bg-emerald-950/60 border-emerald-500/30 hover:border-emerald-400 text-emerald-300'
                  : 'bg-red-950/30 hover:bg-red-950/60 border-red-500/30 text-red-300'
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Węzeł & Baza Firestore</span>
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold shrink-0">
                <span className={`w-1.5 h-1.5 rounded-full ${isDatabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                <span>{isDatabaseConnected ? 'BNB-734' : 'OFFLINE'}</span>
              </span>
            </button>
          </div>

          {/* Nexus Synapse Core (Ecosystem Hub) Link */}
          <div className="pt-2">
            <button
              onClick={() => {
                soundFx.playModalOpen();
                onOpenNexusEcosystem?.();
                if (isOpenMobile) onCloseMobile();
              }}
              className="w-full py-2 px-2.5 rounded-lg bg-gradient-to-r from-cyan-950/40 to-emerald-950/40 hover:from-cyan-950/70 hover:to-emerald-950/70 border border-cyan-500/40 hover:border-cyan-400 flex items-center justify-between text-xs font-mono text-cyan-300 transition-all cursor-pointer group shadow-sm"
            >
              <span className="flex items-center gap-2 truncate">
                <Network className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" />
                <span className="truncate font-bold">NEXUS SYNAPSE CORE</span>
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>LINKED</span>
              </span>
            </button>
          </div>

          {/* Quick HUD Shortcuts Guide Link */}
          <div className="pt-2">
            <button
              onClick={() => {
                soundFx.playModalOpen();
                onOpenShortcuts?.();
                if (isOpenMobile) onCloseMobile();
              }}
              className="w-full py-2 px-2.5 rounded-lg bg-cyan-950/30 hover:bg-cyan-950/60 border border-cyan-500/20 hover:border-cyan-400/50 flex items-center justify-between text-xs font-mono text-cyan-300 transition-all cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Skróty Klawiszy</span>
              </span>
              <kbd className="px-1.5 py-0.5 bg-black rounded text-[10px] text-cyan-400 border border-cyan-500/40">
                ?
              </kbd>
            </button>
          </div>

        </nav>

        {/* User / Pilot Profile Badge */}
        <div 
          onClick={() => {
            soundFx.playModalOpen();
            onOpenQuantumLogin?.();
          }}
          className="p-4 bg-white/5 border-t border-white/10 font-mono hover:bg-white/10 transition-all cursor-pointer group"
          title="Otwórz Quantum Traversal Portal Logowania"
        >
          <div className="flex items-center gap-3">
            {currentPilot?.avatarUrl ? (
              <img 
                src={currentPilot.avatarUrl} 
                alt="Pilot Avatar"
                className="w-8 h-8 rounded-full border border-cyan-400 object-cover shrink-0 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-black text-white shrink-0 group-hover:scale-105 transition-transform">
                NX
              </div>
            )}
            <div className="truncate flex-1">
              <p className="text-xs font-bold text-white group-hover:text-cyan-300 truncate transition-colors">
                {currentPilot?.authenticated ? currentPilot.designatorName : 'Quantum Pilot'}
              </p>
              <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {currentPilot?.authenticated ? 'Authenticated' : 'Click to Login'}
              </p>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};
