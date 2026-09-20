import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  FileText, 
  Headphones, 
  Share2, 
  Sparkles, 
  Clock, 
  Calendar, 
  Globe, 
  Github, 
  ExternalLink, 
  User, 
  List, 
  Quote as QuoteIcon, 
  Music, 
  Image as ImageIcon, 
  Maximize2, 
  Check, 
  ChevronRight,
  TrendingUp,
  Layers,
  Zap,
  Highlighter,
  MessageSquare,
  Plus,
  Trash2,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { Book, BookAnnotation, BookCollection } from '../types';
import { SEEKERS_CONFIG, SAMPLE_BOOKS } from '../data/booksData';
import { generateSvgQrCode } from '../utils/qrGenerator';
import { soundFx } from '../utils/audioSystem';
import { getAnnotationsForBook, addAnnotation, deleteAnnotation } from '../utils/annotationStorage';
import { isChapterBookmarked, toggleChapterBookmark } from '../utils/bookmarkStorage';
import { cacheBookOffline } from '../utils/offlineBookCache';

interface BookDetailModalProps {
  book: Book | null;
  collections?: BookCollection[];
  onToggleBookInCollection?: (collectionId: string, bookId: string) => void;
  onOpenCollectionsModal?: () => void;
  onClose: () => void;
  onLaunchFullscreenReader: (book: Book, chapterId?: string) => void;
  onOpenPdf: (book: Book) => void;
  onOpenAudio: (book: Book) => void;
  onSelectRelatedBook: (book: Book) => void;
  onOpenHtmlWorld?: (book: Book) => void;
  onOpenEditorialStudio?: (book: Book) => void;
  onBookmarksChange?: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  collections = [],
  onToggleBookInCollection,
  onOpenCollectionsModal,
  onClose,
  onLaunchFullscreenReader,
  onOpenPdf,
  onOpenAudio,
  onSelectRelatedBook,
  onOpenHtmlWorld,
  onOpenEditorialStudio,
  onBookmarksChange
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'chapters' | 'quotes' | 'collections' | 'notes' | 'playlist' | 'gallery' | 'related'>('overview');
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);

  // Annotations state for this book
  const [annotations, setAnnotations] = useState<BookAnnotation[]>(() => book ? getAnnotationsForBook(book.id) : []);

  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>(() => {
    if (!book) return {};
    const map: Record<string, boolean> = {};
    book.chapters.forEach(ch => {
      map[ch.id] = isChapterBookmarked(book.id, ch.id);
    });
    return map;
  });

  React.useEffect(() => {
    if (book) {
      cacheBookOffline(book);
    }
  }, [book]);

  const handleToggleChapterBookmark = (ch: typeof book.chapters[0]) => {
    if (!book) return;
    soundFx.playClick();
    const res = toggleChapterBookmark({
      bookId: book.id,
      bookTitle: book.title,
      seeker: book.seeker,
      seekerColor: book.seekerColor,
      chapterId: ch.id,
      chapterNumber: ch.number,
      chapterTitle: ch.title,
      previewText: ch.content.slice(0, 140).trim() + '...'
    });
    setBookmarkedMap(prev => ({ ...prev, [ch.id]: res.isBookmarked }));
    onBookmarksChange?.();
  };
  
  // New manual note form inside modal tab
  const [newSelectedText, setNewSelectedText] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [newChapterId, setNewChapterId] = useState(book?.chapters[0]?.id || '');
  const [newColor, setNewColor] = useState<'yellow' | 'cyan' | 'purple' | 'emerald'>('purple');

  if (!book) return null;

  const refreshAnnotations = () => {
    setAnnotations(getAnnotationsForBook(book.id));
  };

  const handleAddManualNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSelectedText.trim()) return;
    const ch = book.chapters.find(c => c.id === newChapterId) || book.chapters[0];
    addAnnotation({
      bookId: book.id,
      chapterId: ch.id,
      chapterNumber: ch.number,
      chapterTitle: ch.title,
      selectedText: newSelectedText.trim(),
      note: newNoteText.trim() || undefined,
      color: newColor
    });
    soundFx.playHighlightNote();
    refreshAnnotations();
    setNewSelectedText('');
    setNewNoteText('');
  };

  const handleDeleteAnnotation = (id: string) => {
    soundFx.playDelete();
    deleteAnnotation(id);
    refreshAnnotations();
  };

  const seekerCfg = SEEKERS_CONFIG[book.seeker];
  const accentColor = book.seekerColor || seekerCfg.color;

  const qrSvg = generateSvgQrCode(`https://nexusbook.eterniverse.os/node/${book.id}`, 140, accentColor);

  const relatedBooks = (book.relatedBookIds || [])
    .map(id => SAMPLE_BOOKS.find(b => b.id === id))
    .filter((b): b is Book => b !== undefined);

  const handleCopyQuote = (id: string, text: string) => {
    soundFx.playClick();
    navigator.clipboard.writeText(`"${text}" — NEXUSBOOK (${book.title})`);
    setCopiedQuoteId(id);
    setTimeout(() => setCopiedQuoteId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-md p-0 md:p-4 overflow-hidden animate-in fade-in duration-300">
      
      {/* Click outside backdrop */}
      <div 
        className="absolute inset-0" 
        onClick={() => {
          soundFx.playModalClose();
          onClose();
        }}
      />

      {/* Main Expansion Drawer Box */}
      <div 
        className="relative z-10 w-full lg:w-[85vw] xl:w-[75vw] max-w-6xl h-full md:h-[94vh] md:rounded-3xl bg-slate-950 border border-white/10 shadow-2xl flex flex-col overflow-hidden"
        style={{
          boxShadow: `0 0 40px ${accentColor}25`
        }}
      >
        {/* Top Header Drawer Bar */}
        <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span 
              className="p-2 rounded-xl text-xl font-bold bg-slate-950 border border-white/10"
              style={{ color: accentColor }}
            >
              {book.coverStyle.symbol}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold tracking-widest bg-slate-900 border"
                  style={{ color: accentColor, borderColor: `${accentColor}40` }}
                >
                  {book.seeker}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {book.series || 'Kanon ETERNIVERSE'}
                </span>
                {book.author && (
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                    Autor: {book.author}
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold font-mono text-white tracking-wide">
                {book.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenEditorialStudio && (
              <button
                onClick={() => {
                  soundFx.playModalOpen();
                  onOpenEditorialStudio(book);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/50 text-cyan-300 hover:text-white shadow-lg shadow-cyan-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Otwórz pełny panel redakcyjno-wydawniczy dzieła"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>EDITORIAL STUDIO</span>
              </button>
            )}

            {book.customHtmlWorld && onOpenHtmlWorld && (
              <button
                onClick={() => {
                  soundFx.playModalOpen();
                  onOpenHtmlWorld(book);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-black bg-gradient-to-r from-red-950 via-zinc-900 to-cyan-950 border border-red-500/50 hover:border-cyan-400 text-red-300 hover:text-white shadow-lg transition-all flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-red-400 animate-pulse" />
                <span>OTWÓRZ ŚWIAT HTML</span>
              </button>
            )}

            <button
              onClick={() => {
                soundFx.playClick();
                onLaunchFullscreenReader(book);
              }}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-black shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: accentColor }}
            >
              <Maximize2 className="w-4 h-4" />
              <span>PEŁNY EKRAN CZYTNIKA</span>
            </button>

            <button
              onClick={() => {
                soundFx.playModalClose();
                onClose();
              }}
              className="p-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Rail */}
        <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-slate-900/40 overflow-x-auto custom-scrollbar font-mono text-xs">
          {[
            { id: 'overview', label: 'PRZEGLĄD & OPIS', icon: FileText },
            { id: 'chapters', label: `ROZDZIAŁY (${book.chapters.length})`, icon: List },
            { id: 'quotes', label: `CYTATY (${book.quotes.length})`, icon: QuoteIcon },
            { id: 'collections', label: `KOLEKCJE (${collections.filter(c => c.bookIds.includes(book.id)).length})`, icon: Bookmark },
            { id: 'notes', label: `NOTATKI & ZAKREŚLENIA (${annotations.length})`, icon: Highlighter },
            { id: 'playlist', label: 'PLAYLISTA & AUDIO', icon: Music },
            { id: 'gallery', label: 'GALERIA & ART', icon: ImageIcon },
            { id: 'related', label: `POWIĄZANE (${relatedBooks.length})`, icon: Layers }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap font-medium
                  ${isActive 
                    ? 'bg-slate-900 text-white font-bold border' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}
                `}
                style={{
                  borderColor: isActive ? accentColor : 'transparent',
                  color: isActive ? accentColor : undefined
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar space-y-8">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Full Cover + QR + Stats */}
              <div className="space-y-6">
                {/* Visual Cover Display */}
                <div 
                  className="w-full h-80 rounded-2xl border border-white/20 p-6 flex flex-col justify-between items-center text-center relative overflow-hidden shadow-2xl group"
                  style={{
                    background: book.coverImageUrl ? undefined : `radial-gradient(circle at 50% 30%, ${accentColor}30, #050811 85%)`
                  }}
                >
                  {book.coverImageUrl ? (
                    <>
                      <img 
                        src={book.coverImageUrl} 
                        alt={book.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                      <div className="relative z-10 w-full flex justify-end">
                        <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-mono text-cyan-300 border border-cyan-400/40">
                          ASSET COVER
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-5xl font-mono text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                      {book.coverStyle.symbol}
                    </div>
                  )}

                  <div className="relative z-10">
                    <h3 className="text-xl md:text-2xl font-extrabold font-mono text-white tracking-widest uppercase drop-shadow-md">
                      {book.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-200 mt-1 drop-shadow">
                      {book.subtitle}
                    </p>
                  </div>
                  <div className="relative z-10 flex items-center justify-between w-full text-xs font-mono text-slate-300 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <span>ROK: {book.year}</span>
                    <span>JĘZYK: {book.language}</span>
                  </div>
                </div>

                {/* Telemetry Stats Card */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3 font-mono text-xs">
                  <div className="text-[10px] uppercase text-slate-400 tracking-widest">
                    STATYSTYKI MODUŁU
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                      <span className="text-slate-400 text-[10px]">STRONY</span>
                      <p className="text-lg font-bold text-white">{book.stats.pageCount}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                      <span className="text-slate-400 text-[10px]">SŁOWA</span>
                      <p className="text-lg font-bold text-cyan-400">{book.stats.wordCount.toLocaleString()}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                      <span className="text-slate-400 text-[10px]">{book.stats.partsCount ? 'ODSŁONY' : 'CZYTELNICY'}</span>
                      <p className="text-lg font-bold text-amber-400">{book.stats.readerCount.toLocaleString()}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                      <span className="text-slate-400 text-[10px]">SZAC. CZAS</span>
                      <p className="text-lg font-bold text-purple-400">{book.stats.estReadTimeMin} min</p>
                    </div>
                    {book.stats.partsCount !== undefined && (
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-cyan-500/20">
                        <span className="text-cyan-400 text-[10px]">CZĘŚCI</span>
                        <p className="text-lg font-bold text-cyan-300">{book.stats.partsCount}</p>
                      </div>
                    )}
                    {book.stats.votesCount !== undefined && (
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/20">
                        <span className="text-amber-400 text-[10px]">GŁOSY</span>
                        <p className="text-lg font-bold text-amber-300">★ {book.stats.votesCount}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Code Matrix Generator Node */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col items-center text-center space-y-3">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    KOD QR SYNCHRONIZACJI URZĄDZEŃ
                  </span>
                  <div 
                    className="p-2 bg-slate-950 rounded-xl border border-white/10"
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                  />
                  <p className="text-[10px] font-mono text-slate-500">
                    Zeskanuj, aby kontynuować czytanie na smartfonie.
                  </p>
                </div>
              </div>

              {/* Right 2 Columns: Long Description, Author Notes, TOC */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onLaunchFullscreenReader(book);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-mono text-xs font-bold text-black shadow-lg transition-all hover:brightness-110"
                    style={{ backgroundColor: accentColor }}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>CZYTAJ W CZYTNIKU</span>
                  </button>

                  {book.platformLinks.pdfUrl && (
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onOpenPdf(book);
                      }}
                      className="px-4 py-3 rounded-xl bg-slate-900 border border-white/10 hover:border-blue-500/50 text-slate-200 hover:text-blue-400 text-xs font-mono flex items-center gap-2 transition-all"
                    >
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span>OTWÓRZ PDF</span>
                    </button>
                  )}

                  {book.platformLinks.audioUrl && (
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onOpenAudio(book);
                      }}
                      className="px-4 py-3 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-500/50 text-slate-200 hover:text-amber-400 text-xs font-mono flex items-center gap-2 transition-all"
                    >
                      <Headphones className="w-4 h-4 text-amber-400" />
                      <span>SŁUCHAJ AUDIO</span>
                    </button>
                  )}
                </div>

                {/* Long Description */}
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                  <h4 className="text-xs font-mono uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    OPIS ARCHIWALNY
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-sans">
                    {book.longDesc}
                  </p>
                </div>

                {/* Author Notes */}
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/20 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                  <h4 className="text-xs font-mono uppercase text-emerald-400 tracking-widest flex items-center gap-2">
                    <User className="w-4 h-4" />
                    NOTA AUTORA
                  </h4>
                  <p className="text-sm italic text-slate-300 leading-relaxed">
                    "{book.authorNote}"
                  </p>
                </div>

                {/* Table of Contents Preview */}
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                  <h4 className="text-xs font-mono uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <List className="w-4 h-4 text-purple-400" />
                    SPIS TREŚCI & STRUKTURA
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs">
                    {book.tableOfContents.map((item, idx) => (
                      <div 
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950 border border-white/5 text-slate-300 flex items-center gap-3 hover:border-white/20 transition-colors"
                      >
                        <span className="w-6 h-6 rounded-lg bg-slate-900 text-slate-400 flex items-center justify-center font-bold text-[10px]">
                          0{idx + 1}
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* External Platforms Bar */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-mono text-slate-400">ZEWNĘTRZNE PLATFORMY:</span>
                  <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                    {book.platformLinks.amazon && (
                      <a 
                        href={book.platformLinks.amazon} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-amber-400 hover:bg-white/5 transition-colors flex items-center gap-1.5"
                      >
                        <Globe className="w-3.5 h-3.5" /> Amazon
                      </a>
                    )}
                    {book.platformLinks.wattpad && (
                      <a 
                        href={book.platformLinks.wattpad} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-orange-400 hover:bg-white/5 transition-colors flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Wattpad
                      </a>
                    )}
                    {book.platformLinks.github && (
                      <a 
                        href={book.platformLinks.github} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-slate-200 hover:bg-white/5 transition-colors flex items-center gap-1.5"
                      >
                        <Github className="w-3.5 h-3.5" /> GitHub
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: CHAPTERS */}
          {activeTab === 'chapters' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 font-mono text-xs text-slate-400">
                <span>WYBIERZ ROZDZIAŁ DO CZYTANIA:</span>
                <span>OGÓŁEM ROZDZIAŁÓW: {book.chapters.length}</span>
              </div>

              {book.chapters.map((ch) => {
                const bookmarked = !!bookmarkedMap[ch.id];
                return (
                  <div 
                    key={ch.id}
                    className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/50 transition-all space-y-3 group"
                  >
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold shrink-0">
                          ROZDZIAŁ 0{ch.number}
                        </span>
                        <h3 className="text-lg font-bold font-mono text-white group-hover:text-cyan-300 transition-colors truncate">
                          {ch.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Bookmark Button */}
                        <button
                          onClick={() => handleToggleChapterBookmark(ch)}
                          className={`p-2 rounded-xl border font-mono text-xs flex items-center gap-1.5 transition-all ${
                            bookmarked
                              ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                              : 'bg-slate-950 border-white/10 text-slate-400 hover:text-amber-300 hover:border-amber-500/40'
                          }`}
                          title={bookmarked ? 'Rozdział zapisany w zakładkach' : 'Zapisz ten rozdział w zakładkach'}
                        >
                          {bookmarked ? (
                            <>
                              <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                              <span className="hidden sm:inline text-[11px]">ZAPISANO</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-4 h-4" />
                              <span className="hidden sm:inline text-[11px]">ZAKŁADKA</span>
                            </>
                          )}
                        </button>

                        {/* Read Chapter Button */}
                        <button
                          onClick={() => {
                            soundFx.playClick();
                            onLaunchFullscreenReader(book, ch.id);
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-950 border border-white/10 hover:border-cyan-500/50 text-cyan-400 font-mono text-xs flex items-center gap-2 transition-all"
                        >
                          <span>CZYTAJ</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {ch.summary && (
                      <p className="text-xs text-slate-300 font-sans">
                        {ch.summary}
                      </p>
                    )}

                    <div className="pt-2 text-[11px] font-mono text-slate-500 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {ch.readTimeMin} min czytania
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB: QUOTES */}
          {activeTab === 'quotes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {book.quotes.map((q) => (
                <div 
                  key={q.id}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <QuoteIcon className="w-6 h-6 text-purple-400 opacity-60" />
                    <p className="text-sm font-sans italic text-slate-200 leading-relaxed">
                      "{q.text}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-xs text-slate-400">
                    <span>{q.chapterTitle || 'Cytat Archiwalny'}</span>

                    <button
                      onClick={() => handleCopyQuote(q.id, q.text)}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 hover:border-purple-500/50 text-slate-300 hover:text-purple-300 transition-all flex items-center gap-1.5 text-[11px]"
                    >
                      {copiedQuoteId === q.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>SKOPIOWANO</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>KOPIUJ CYTAT</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: COLLECTIONS */}
          {activeTab === 'collections' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-mono font-bold text-purple-300 flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-purple-400" />
                    PRZYNALEŻNOŚĆ DO KOLEKCJI AUTORSKICH
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 font-sans">
                    Przypisuj tę księgę do wielu spersonalizowanych zbiorów wiedzy i tematycznych dossier.
                  </p>
                </div>

                {onOpenCollectionsModal && (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onOpenCollectionsModal();
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-lg shrink-0"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Zarządzaj Wszystkimi Zbiorami</span>
                  </button>
                )}
              </div>

              {collections.length === 0 ? (
                <div className="p-10 rounded-3xl bg-slate-900/40 border border-dashed border-white/10 text-center font-mono text-xs text-slate-400 space-y-3">
                  <Bookmark className="w-10 h-10 opacity-30 text-purple-400 mx-auto" />
                  <p className="text-sm text-white/70">Nie utworzono jeszcze żadnej kolekcji.</p>
                  {onOpenCollectionsModal && (
                    <button
                      onClick={onOpenCollectionsModal}
                      className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs"
                    >
                      + Stwórz pierwszą kolekcję
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {collections.map((col) => {
                    const isIncluded = col.bookIds.includes(book.id);
                    return (
                      <div
                        key={col.id}
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                          isIncluded
                            ? 'bg-purple-950/30 border-purple-500/50 shadow-lg'
                            : 'bg-slate-900/40 border-white/10 opacity-70 hover:opacity-100 hover:border-white/20'
                        }`}
                        style={{ borderLeftWidth: '4px', borderLeftColor: col.color }}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-sm text-white">{col.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                              {col.bookIds.length} {col.bookIds.length === 1 ? 'pozycja' : 'pozycji'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-sans line-clamp-2">
                            {col.description || 'Brak opisu kolekcji'}
                          </p>
                          {col.notes && (
                            <p className="text-[11px] text-amber-300/80 font-sans italic line-clamp-1 pt-1">
                              "{col.notes}"
                            </p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                          <span className={`text-[11px] font-mono font-bold flex items-center gap-1.5 ${
                            isIncluded ? 'text-emerald-400' : 'text-slate-500'
                          }`}>
                            {isIncluded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>W TEJ KOLEKCJI</span>
                              </>
                            ) : (
                              <span>NIEPRZYPISANA</span>
                            )}
                          </span>

                          {onToggleBookInCollection && (
                            <button
                              onClick={() => {
                                if (isIncluded) {
                                  soundFx.playRemoveFromCollection();
                                } else {
                                  soundFx.playAddToCollection();
                                }
                                onToggleBookInCollection(col.id, book.id);
                              }}
                              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                isIncluded
                                  ? 'bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900/80 hover:text-white'
                                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                              }`}
                            >
                              {isIncluded ? (
                                <>
                                  <X className="w-3.5 h-3.5" />
                                  <span>Usuń ze zbioru</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Dodaj do zbioru</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: NOTES & ANNOTATIONS */}
          {activeTab === 'notes' && (
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Form to manual add note/quote */}
              <form onSubmit={handleAddManualNote} className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-purple-300 font-bold">
                    <Plus className="w-4 h-4 text-purple-400" />
                    <span>DODAJ NOWĄ NOTATKĘ / ZAKREŚLENIE OSOBISTE</span>
                  </div>
                  <span className="text-[10px] text-slate-400">PAMIĘĆ LOKALNA BROWSERA</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Wybierz Rozdział:</label>
                    <select
                      value={newChapterId}
                      onChange={(e) => setNewChapterId(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-purple-500"
                    >
                      {book.chapters.map(ch => (
                        <option key={ch.id} value={ch.id}>
                          Rozdział 0{ch.number}: {ch.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Kolor Akcentu:</label>
                    <div className="flex items-center gap-2 pt-1">
                      {(['purple', 'cyan', 'yellow', 'emerald'] as const).map((col) => (
                        <button
                          type="button"
                          key={col}
                          onClick={() => setNewColor(col)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold border transition-all ${
                            newColor === col ? 'ring-2 ring-white scale-105' : 'opacity-60 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: col === 'purple' ? '#a855f720' : col === 'cyan' ? '#06b6d420' : col === 'yellow' ? '#eab30820' : '#10b98120',
                            color: col === 'purple' ? '#c084fc' : col === 'cyan' ? '#22d3ee' : col === 'yellow' ? '#fde047' : '#6ee7b7',
                            borderColor: col === 'purple' ? '#a855f7' : col === 'cyan' ? '#06b6d4' : col === 'yellow' ? '#eab308' : '#10b981'
                          }}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Zakreślony Cytat / Fragment Tekstu (*):</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Wklej lub wpisz cytat z rozdziału..."
                    value={newSelectedText}
                    onChange={(e) => setNewSelectedText(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Twój Komentarz / Przemyślenie:</label>
                  <input
                    type="text"
                    placeholder="Wpisz opcjonalną reflexję..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ZAPISZ NOTATKĘ W ARCHIWUM</span>
                  </button>
                </div>
              </form>

              {/* List of accumulated annotations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-xs border-b border-white/10 pb-2">
                  <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Highlighter className="w-4 h-4 text-purple-400" />
                    <span>ZAKREŚLENIA TEKSTOWE DLA KSIĄŻKI ({annotations.length})</span>
                  </span>
                  <button
                    onClick={() => onLaunchFullscreenReader(book)}
                    className="text-cyan-400 hover:underline text-[11px] flex items-center gap-1"
                  >
                    <span>Otwórz w Czytniku</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {annotations.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-900/40 border border-white/5 text-center font-mono text-xs text-slate-400 space-y-2">
                    <Bookmark className="w-8 h-8 opacity-30 text-purple-400 mx-auto" />
                    <p>Brak zapisanych notatek dla tej pozycji.</p>
                    <p className="text-[10px] text-slate-500">
                      Użyj formularza powyżej lub zaznacz tekst bezpośrednio podczas lektury w Pełnym Ekranie Czytnika.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {annotations.map((anno) => (
                      <div 
                        key={anno.id} 
                        className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-2.5 relative group"
                      >
                        <div className="flex items-center justify-between font-mono text-xs">
                          <button
                            onClick={() => {
                              soundFx.playClick();
                              onLaunchFullscreenReader(book, anno.chapterId);
                            }}
                            className="font-bold text-purple-300 hover:text-purple-200 hover:underline flex items-center gap-1.5"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Rozdział 0{anno.chapterNumber}: {anno.chapterTitle}</span>
                          </button>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500">
                              {new Date(anno.createdAt).toLocaleDateString('pl-PL')}
                            </span>
                            <button
                              onClick={() => handleDeleteAnnotation(anno.id)}
                              className="text-rose-400 hover:text-rose-300 p-1"
                              title="Usuń notatkę"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <blockquote className="italic font-sans text-xs text-slate-200 border-l-2 border-purple-500 pl-3 py-1 bg-black/40 rounded-r-lg">
                          "{anno.selectedText}"
                        </blockquote>

                        {anno.note && (
                          <div className="font-sans text-xs text-slate-300 flex items-start gap-2 bg-slate-950 p-3 rounded-xl border border-white/5">
                            <MessageSquare className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                            <span>{anno.note}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB: PLAYLIST */}
          {activeTab === 'playlist' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-mono font-bold text-amber-400 flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    PLAYLISTA AMBIENTOWA ETERNIVERSE
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Ścieżka dźwiękowa rekomendowana do lektury książki.
                  </p>
                </div>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenAudio(book);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-mono font-bold text-xs flex items-center gap-2 hover:bg-amber-400 transition-colors shadow-lg"
                >
                  <Headphones className="w-4 h-4" />
                  <span>OTWÓRZ ODTWARZACZ</span>
                </button>
              </div>

              <div className="space-y-2">
                {(book.playlist || []).map((track, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/20 font-mono text-xs text-slate-300 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded bg-slate-950 text-slate-500 flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-white">{track.title}</p>
                        <p className="text-[10px] text-slate-400">{track.artist}</p>
                      </div>
                    </div>
                    <span className="text-slate-500">{track.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {(book.gallery || [
                { id: 'g1', title: 'Holodruk Okładki', caption: 'Matryca wizualna', svgGradient: [accentColor, '#000000'], patternType: 'cyber' as const }
              ]).map((g) => (
                <div 
                  key={g.id}
                  className="rounded-2xl bg-slate-900 border border-white/10 overflow-hidden space-y-3 p-4"
                >
                  <div 
                    className="w-full h-52 rounded-xl border border-white/10 flex items-center justify-center text-center p-4 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${g.svgGradient[0]}40, ${g.svgGradient[1]})`
                    }}
                  >
                    <span className="font-mono text-2xl font-bold text-white drop-shadow-md">
                      {g.title}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs font-bold text-white">{g.title}</h4>
                    <p className="text-xs text-slate-400">{g.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: RELATED */}
          {activeTab === 'related' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {relatedBooks.map((rel) => (
                <div 
                  key={rel.id}
                  onClick={() => {
                    soundFx.playClick();
                    onSelectRelatedBook(rel);
                  }}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/50 cursor-pointer transition-all flex items-center gap-4 group"
                >
                  <div 
                    className="w-16 h-20 rounded-xl border border-white/10 flex items-center justify-center text-xl font-mono text-white shrink-0"
                    style={{ backgroundColor: `${rel.seekerColor}30` }}
                  >
                    {rel.coverStyle.symbol}
                  </div>
                  <div className="space-y-1">
                    <span 
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border"
                      style={{ color: rel.seekerColor, borderColor: `${rel.seekerColor}40` }}
                    >
                      {rel.seeker}
                    </span>
                    <h4 className="font-mono text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{rel.shortDesc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
