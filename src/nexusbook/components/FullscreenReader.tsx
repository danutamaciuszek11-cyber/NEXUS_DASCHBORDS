import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Highlighter,
  Trash2,
  Plus,
  Check,
  Edit3,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Circle,
  FileText,
  Save,
  Clock,
  List,
  Layers,
  Search,
  BookOpen,
  Brain
} from 'lucide-react';
import { PetlaLoopModal } from './PetlaLoopModal';
import { Book, Chapter, BookAnnotation, ChapterNote } from '../types';
import { soundFx } from '../utils/audioSystem';
import { getAnnotationsForBook, addAnnotation, deleteAnnotation } from '../utils/annotationStorage';
import { isChapterBookmarked, toggleChapterBookmark } from '../utils/bookmarkStorage';
import { 
  getNotesForBook, 
  getNotesForChapter, 
  addChapterNote, 
  deleteChapterNote, 
  updateChapterNote 
} from '../utils/chapterNotesStorage';
import { 
  isChapterRead, 
  toggleChapterRead, 
  getBookReadingProgress 
} from '../utils/readingProgress';
import { cacheBookOffline } from '../utils/offlineBookCache';

interface FullscreenReaderProps {
  book: Book;
  initialChapterId?: string;
  onClose: () => void;
  onBookmarksChange?: () => void;
  onProgressChange?: () => void;
}

export const FullscreenReader: React.FC<FullscreenReaderProps> = ({
  book,
  initialChapterId,
  onClose,
  onBookmarksChange,
  onProgressChange
}) => {
  const [currentChapterIdx, setCurrentChapterIdx] = useState(() => {
    if (initialChapterId) {
      const idx = book.chapters.findIndex(c => c.id === initialChapterId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [readerTheme, setReaderTheme] = useState<'dark' | 'oled' | 'sepia' | 'matrix'>('dark');
  const [ambientAudio, setAmbientAudio] = useState(false);

  // Annotations & Highlights state
  const [annotations, setAnnotations] = useState<BookAnnotation[]>(() => getAnnotationsForBook(book.id));
  const [selectedText, setSelectedText] = useState<string>('');
  const [annoColor, setAnnoColor] = useState<'yellow' | 'cyan' | 'purple' | 'emerald'>('yellow');
  const [annoNote, setAnnoNote] = useState('');
  const [showSelectionToolbar, setShowSelectionToolbar] = useState(false);

  // Chapter Notes state
  const [chapterNotes, setChapterNotes] = useState<ChapterNote[]>(() => getNotesForBook(book.id));
  const [newNoteInput, setNewNoteInput] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'notes' | 'highlights' | 'chapters'>('notes');
  const [noteSearch, setNoteSearch] = useState('');
  const [showPetlaModal, setShowPetlaModal] = useState(false);

  const chapter: Chapter = book.chapters[currentChapterIdx] || book.chapters[0];
  
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => 
    isChapterBookmarked(book.id, chapter.id)
  );

  const [isRead, setIsRead] = useState<boolean>(() => 
    isChapterRead(book.id, chapter.id)
  );

  const [progressData, setProgressData] = useState(() => 
    getBookReadingProgress(book)
  );

  useEffect(() => {
    cacheBookOffline(book);
  }, [book]);

  useEffect(() => {
    setIsBookmarked(isChapterBookmarked(book.id, chapter.id));
    setIsRead(isChapterRead(book.id, chapter.id));
  }, [book.id, chapter.id]);

  const refreshNotesAndAnnotations = () => {
    setAnnotations(getAnnotationsForBook(book.id));
    setChapterNotes(getNotesForBook(book.id));
    setProgressData(getBookReadingProgress(book));
  };

  const handleToggleBookmark = () => {
    soundFx.playClick();
    const res = toggleChapterBookmark({
      bookId: book.id,
      bookTitle: book.title,
      seeker: book.seeker,
      seekerColor: book.seekerColor,
      chapterId: chapter.id,
      chapterNumber: chapter.number,
      chapterTitle: chapter.title,
      previewText: chapter.content.slice(0, 140).trim() + '...'
    });
    setIsBookmarked(res.isBookmarked);
    setProgressData(getBookReadingProgress(book));
    onBookmarksChange?.();
    onProgressChange?.();
  };

  const handleToggleRead = () => {
    soundFx.playClick();
    const nowRead = toggleChapterRead(book.id, chapter.id);
    setIsRead(nowRead);
    setProgressData(getBookReadingProgress(book));
    onProgressChange?.();
  };

  // Add a new text note for the current chapter
  const handleAddChapterNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;

    soundFx.playHighlightNote();
    addChapterNote({
      bookId: book.id,
      bookTitle: book.title,
      chapterId: chapter.id,
      chapterNumber: chapter.number,
      chapterTitle: chapter.title,
      content: newNoteInput.trim()
    });

    setNewNoteInput('');
    refreshNotesAndAnnotations();
  };

  const handleSaveEditNote = (noteId: string) => {
    if (!editingNoteContent.trim()) return;
    soundFx.playClick();
    updateChapterNote(noteId, editingNoteContent);
    setEditingNoteId(null);
    refreshNotesAndAnnotations();
  };

  const handleDeleteChapterNote = (noteId: string) => {
    soundFx.playDelete();
    deleteChapterNote(noteId);
    refreshNotesAndAnnotations();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSelectionToolbar) {
          setShowSelectionToolbar(false);
        } else if (showDrawer) {
          setShowDrawer(false);
        } else {
          soundFx.playModalClose();
          onClose();
        }
      } else if (e.key === 'ArrowRight') {
        if (currentChapterIdx < book.chapters.length - 1) {
          soundFx.playPageTurn();
          setCurrentChapterIdx(prev => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentChapterIdx > 0) {
          soundFx.playPageTurn();
          setCurrentChapterIdx(prev => prev - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapterIdx, book.chapters.length, onClose, showSelectionToolbar, showDrawer]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length >= 2) {
      const txt = selection.toString().trim();
      setSelectedText(txt);
      setShowSelectionToolbar(true);
    }
  };

  const handleSaveAnnotation = () => {
    if (!selectedText) return;
    addAnnotation({
      bookId: book.id,
      chapterId: chapter.id,
      chapterNumber: chapter.number,
      chapterTitle: chapter.title,
      selectedText,
      note: annoNote.trim() || undefined,
      color: annoColor
    });
    soundFx.playHighlightNote();
    refreshNotesAndAnnotations();
    setSelectedText('');
    setAnnoNote('');
    setShowSelectionToolbar(false);
    window.getSelection()?.removeAllRanges();
  };

  const handleDeleteAnnotation = (id: string) => {
    soundFx.playDelete();
    deleteAnnotation(id);
    refreshNotesAndAnnotations();
  };

  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-loose',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose'
  };

  const themeClasses = {
    dark: 'bg-slate-950 text-slate-200 border-white/10',
    oled: 'bg-black text-white border-zinc-800',
    sepia: 'bg-[#181410] text-[#e8d8c8] border-[#382c20]',
    matrix: 'bg-[#03140c] text-[#00ff88] border-[#00ff88]/30 font-mono'
  };

  const colorBadgeStyles: Record<'yellow' | 'cyan' | 'purple' | 'emerald', { bg: string, text: string, border: string }> = {
    yellow: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40' },
    cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/40' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/40' },
    emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' }
  };

  const handleNextChapter = () => {
    if (currentChapterIdx < book.chapters.length - 1) {
      soundFx.playPageTurn();
      setCurrentChapterIdx(prev => prev + 1);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIdx > 0) {
      soundFx.playPageTurn();
      setCurrentChapterIdx(prev => prev - 1);
    }
  };

  const toggleAmbientSound = () => {
    const nextState = !ambientAudio;
    setAmbientAudio(nextState);
    soundFx.toggleAmbientHum(nextState);
  };

  const currentChapterNotes = chapterNotes.filter(n => n.chapterId === chapter.id);
  const currentChapterAnnotations = annotations.filter(a => a.chapterId === chapter.id);

  // Filtered notes for drawer search
  const filteredDrawerNotes = chapterNotes.filter(n => {
    if (!noteSearch.trim()) return true;
    const q = noteSearch.toLowerCase();
    return n.content.toLowerCase().includes(q) || n.chapterTitle.toLowerCase().includes(q);
  });

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${themeClasses[readerTheme]} transition-colors duration-300`}>
      
      {/* Reader Top Controls */}
      <div className="p-3.5 sm:p-4 border-b flex items-center justify-between backdrop-blur-md bg-black/50 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playModalClose();
              if (ambientAudio) soundFx.toggleAmbientHum(false);
              onClose();
            }}
            className="p-2 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            title="Zamknij Czytnik (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                {book.title} • {book.seeker}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                {progressData.percentage}% przeczytane
              </span>
            </div>
            <h2 className="text-sm font-bold font-mono text-white truncate max-w-md">
              Rozdział 0{chapter.number}: {chapter.title}
            </h2>
          </div>
        </div>

        {/* Reader Customization & Notes Toolbar */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          
          {/* Mark as Read Toggle */}
          <button
            onClick={handleToggleRead}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs transition-all cursor-pointer ${
              isRead
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'border-white/10 text-slate-300 hover:bg-white/10 hover:border-emerald-500/40'
            }`}
            title={isRead ? 'Oznaczono jako przeczytany' : 'Oznacz ten rozdział jako przeczytany'}
          >
            {isRead ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="hidden md:inline">PRZECZYTANY</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-slate-400" />
                <span className="hidden md:inline">OZNACZ PRZECZYTANY</span>
              </>
            )}
          </button>

          {/* Chapter Bookmark Action */}
          <button
            onClick={handleToggleBookmark}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                : 'border-white/10 text-slate-300 hover:bg-white/10 hover:border-amber-500/40'
            }`}
            title={isBookmarked ? 'Rozdział zapisany w zakładkach' : 'Dodaj ten rozdział do zakładek'}
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                <span className="hidden md:inline">ZAKŁADKA</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-slate-400" />
                <span className="hidden md:inline">ZAPISZ ZAKŁADKĘ</span>
              </>
            )}
          </button>

          {/* Notes & Highlights Drawer Toggle */}
          <button
            onClick={() => {
              soundFx.playClick();
              setShowDrawer(!showDrawer);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs transition-all cursor-pointer ${
              showDrawer 
                ? 'bg-purple-950 border-purple-500 text-purple-300 font-bold' 
                : 'border-white/10 text-slate-300 hover:bg-white/10'
            }`}
            title="Panel Notatek i Zakreśleń"
          >
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">NOTATKI</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-900/80 text-white font-bold text-[10px]">
              {chapterNotes.length}
            </span>
          </button>

          {/* Behavioral Loop Mapper Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              setShowPetlaModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/40 bg-purple-950/60 hover:bg-purple-900 text-purple-200 font-mono text-xs font-bold transition-all shadow-md shadow-purple-950/50 cursor-pointer"
            title="Otwórz Mapę Pętli Nawykowej (Synapseeker Rozdział 3)"
          >
            <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="hidden sm:inline">PĘTLA D3</span>
          </button>

          {/* Ambient Sound */}
          <button
            onClick={toggleAmbientSound}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              ambientAudio ? 'bg-cyan-950 border-cyan-500 text-cyan-400' : 'border-white/10 text-slate-400'
            }`}
            title="Szum Ambientowy ETERNIVERSE"
          >
            {ambientAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Font Size Selector */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-white/10 rounded-xl p-1 font-mono text-xs">
            {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
              <button
                key={sz}
                onClick={() => {
                  soundFx.playClick();
                  setFontSize(sz);
                }}
                className={`px-2 py-1 rounded-lg uppercase cursor-pointer ${
                  fontSize === sz ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Theme Selector */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-white/10 rounded-xl p-1 font-mono text-xs">
            {(['dark', 'oled', 'sepia', 'matrix'] as const).map((th) => (
              <button
                key={th}
                onClick={() => {
                  soundFx.playClick();
                  setReaderTheme(th);
                }}
                className={`px-2 py-1 rounded-lg uppercase cursor-pointer ${
                  readerTheme === th ? 'bg-white/20 font-bold text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {th}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Reader Progress Bar (Reading Progress & Chapter Navigation) */}
      <div className="w-full h-1.5 bg-white/5 relative">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300 shadow-[0_0_12px_#00f0ff]" 
          style={{ width: `${progressData.percentage}%` }}
        />
      </div>

      {/* Main Reader Layout Container */}
      <div className="flex-1 relative flex overflow-hidden">
        
        {/* Prose Text Container */}
        <div 
          onMouseUp={handleTextSelection}
          className="flex-1 overflow-y-auto p-6 md:p-14 custom-scrollbar max-w-4xl mx-auto w-full space-y-8 select-text"
        >
          
          {/* Chapter Title Banner */}
          <div className="border-b border-white/10 pb-6 space-y-2 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs text-cyan-400 uppercase tracking-widest">
                ROZDZIAŁ 0{chapter.number} / {book.chapters.length}
              </span>
              <div className="flex items-center gap-2 text-xs">
                {isRead && (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Przeczytano</span>
                  </span>
                )}
                {isBookmarked && (
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Zakładka aktywna</span>
                  </span>
                )}
              </div>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-wide">
              {chapter.title}
            </h1>
            {chapter.summary && (
              <p className="text-sm italic text-slate-400">
                {chapter.summary}
              </p>
            )}
          </div>

          {/* Chapter Prose Text Body */}
          <div className={`space-y-6 font-sans ${fontSizeClasses[fontSize]} text-justify tracking-normal whitespace-pre-line`}>
            {chapter.content}
          </div>

          {/* Chapter Notes Section for Current Chapter */}
          <div className="mt-14 pt-8 border-t border-white/10 font-mono space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-purple-400 font-bold">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span>NOTATKI DO TEGO ROZDZIAŁU ({currentChapterNotes.length})</span>
              </div>
              <span className="text-[10px] text-white/40">Zapisywane w pamięci lokalnej</span>
            </div>

            {/* Form to Add a Text Note */}
            <form onSubmit={handleAddChapterNote} className="space-y-2">
              <div className="relative">
                <textarea
                  rows={2}
                  placeholder={`Wpisz notatkę do Rozdziału 0${chapter.number}: ${chapter.title}...`}
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 hover:border-purple-500/40 focus:border-purple-500 rounded-2xl p-3 text-xs text-white placeholder-white/30 outline-none font-sans"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newNoteInput.trim()}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Dodaj notatkę do rozdziału</span>
                </button>
              </div>
            </form>

            {/* Current Chapter Notes List */}
            {currentChapterNotes.length > 0 && (
              <div className="space-y-2 pt-2">
                {currentChapterNotes.map((note) => (
                  <div 
                    key={note.id}
                    className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2"
                  >
                    <div className="flex items-center justify-between text-[10px] text-white/40">
                      <span className="flex items-center gap-1 text-purple-300 font-bold">
                        <Clock className="w-3 h-3" />
                        {new Date(note.createdAt).toLocaleString('pl-PL')}
                      </span>

                      <div className="flex items-center gap-2">
                        {editingNoteId !== note.id ? (
                          <>
                            <button
                              onClick={() => {
                                setEditingNoteId(note.id);
                                setEditingNoteContent(note.content);
                              }}
                              className="text-white/60 hover:text-white flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edytuj</span>
                            </button>
                            <button
                              onClick={() => handleDeleteChapterNote(note.id)}
                              className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Usuń</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="text-white/60 hover:text-white"
                          >
                            Anuluj
                          </button>
                        )}
                      </div>
                    </div>

                    {editingNoteId === note.id ? (
                      <div className="space-y-2 pt-1">
                        <textarea
                          rows={3}
                          value={editingNoteContent}
                          onChange={(e) => setEditingNoteContent(e.target.value)}
                          className="w-full bg-black/60 border border-purple-400 rounded-xl p-2.5 text-xs text-white font-sans outline-none"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleSaveEditNote(note.id)}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" />
                            <span>Zapisz</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-white/90 font-sans whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Chapter Highlights Display */}
          {currentChapterAnnotations.length > 0 && (
            <div className="mt-8 pt-8 border-t border-white/10 font-mono space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-400 font-bold">
                <Highlighter className="w-4 h-4" />
                <span>ZAKREŚLENIA TEKSTU W TYM ROZDZIALE ({currentChapterAnnotations.length})</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {currentChapterAnnotations.map((anno) => {
                  const style = colorBadgeStyles[anno.color];
                  return (
                    <div 
                      key={anno.id} 
                      className={`p-3 rounded-xl border ${style.bg} ${style.border} text-xs space-y-1.5 relative group`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${style.text}`}>
                          CYTAT #{anno.id.slice(-4)}
                        </span>
                        <button
                          onClick={() => handleDeleteAnnotation(anno.id)}
                          className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 transition-opacity p-1"
                          title="Usuń zakreślenie"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <blockquote className="italic border-l-2 border-current pl-2 text-white/90 font-sans">
                        "{anno.selectedText}"
                      </blockquote>
                      {anno.note && (
                        <div className="text-white/70 text-[11px] font-sans flex items-start gap-1 bg-black/40 p-2 rounded-lg">
                          <MessageSquare className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                          <span>{anno.note}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Pagination & Progress Controls */}
          <div className="pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <button
              onClick={handlePrevChapter}
              disabled={currentChapterIdx === 0}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                currentChapterIdx === 0 
                  ? 'opacity-30 border-white/10 text-slate-600 cursor-not-allowed'
                  : 'border-white/10 hover:border-white/30 text-white bg-slate-900'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>POPRZEDNI ROZDZIAŁ</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleRead}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isRead
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
                }`}
              >
                {isRead ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5" />}
                <span>{isRead ? 'Rozdział przeczytany' : 'Oznacz jako przeczytany'}</span>
              </button>

              <span className="text-slate-400">
                UKOŃCZONO: {progressData.percentage}%
              </span>
            </div>

            <button
              onClick={handleNextChapter}
              disabled={currentChapterIdx === book.chapters.length - 1}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                currentChapterIdx === book.chapters.length - 1
                  ? 'opacity-30 border-white/10 text-slate-600 cursor-not-allowed'
                  : 'border-white/10 hover:border-white/30 text-white bg-slate-900'
              }`}
            >
              <span>NASTĘPNY ROZDZIAŁ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Side Drawer for Notes, Highlights & Chapter Index */}
        {showDrawer && (
          <div className="w-80 md:w-96 border-l border-purple-500/30 bg-slate-950/98 backdrop-blur-xl p-4 flex flex-col h-full font-mono text-xs animate-in slide-in-from-right duration-200 shrink-0 z-20">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>ARCHIWUM ROZDZIAŁÓW</span>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-white/60 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl mb-3">
              <button
                onClick={() => setDrawerTab('notes')}
                className={`flex-1 py-1.5 rounded-lg text-center font-bold text-[11px] transition-all cursor-pointer ${
                  drawerTab === 'notes' ? 'bg-purple-600 text-white shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                Notatki ({chapterNotes.length})
              </button>
              <button
                onClick={() => setDrawerTab('highlights')}
                className={`flex-1 py-1.5 rounded-lg text-center font-bold text-[11px] transition-all cursor-pointer ${
                  drawerTab === 'highlights' ? 'bg-purple-600 text-white shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                Zakreślenia ({annotations.length})
              </button>
              <button
                onClick={() => setDrawerTab('chapters')}
                className={`flex-1 py-1.5 rounded-lg text-center font-bold text-[11px] transition-all cursor-pointer ${
                  drawerTab === 'chapters' ? 'bg-purple-600 text-white shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                Spis Treści
              </button>
            </div>

            {/* TAB 1: ALL CHAPTER NOTES */}
            {drawerTab === 'notes' && (
              <div className="flex-1 flex flex-col min-h-0 space-y-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                  <input
                    type="text"
                    placeholder="Szukaj w notatkach..."
                    value={noteSearch}
                    onChange={(e) => setNoteSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 outline-none"
                  />
                </div>

                {filteredDrawerNotes.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-white/40 space-y-2">
                    <MessageSquare className="w-8 h-8 opacity-40 text-purple-400" />
                    <p className="text-xs">Brak notatek.</p>
                    <p className="text-[10px] text-white/30">Użyj formularza pod treścią rozdziału, aby dodać pierwszą notatkę.</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
                    {filteredDrawerNotes.map((note) => (
                      <div 
                        key={note.id}
                        className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 hover:border-purple-500/50 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <button
                            onClick={() => {
                              const cIdx = book.chapters.findIndex(c => c.id === note.chapterId);
                              if (cIdx >= 0) {
                                soundFx.playPageTurn();
                                setCurrentChapterIdx(cIdx);
                              }
                            }}
                            className="font-bold text-purple-300 hover:underline text-left truncate max-w-[180px]"
                          >
                            Rozdz. 0{note.chapterNumber}: {note.chapterTitle}
                          </button>
                          <button
                            onClick={() => handleDeleteChapterNote(note.id)}
                            className="text-rose-400 hover:text-rose-300 p-1"
                            title="Usuń"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-white/90 text-xs font-sans whitespace-pre-wrap leading-relaxed">
                          {note.content}
                        </p>
                        <div className="text-[9px] text-white/30 text-right">
                          {new Date(note.createdAt).toLocaleDateString('pl-PL')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: TEXT HIGHLIGHTS */}
            {drawerTab === 'highlights' && (
              <div className="flex-1 overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
                {annotations.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-white/40 space-y-2">
                    <Bookmark className="w-8 h-8 opacity-40 text-purple-400" />
                    <p className="text-xs">Brak zakreśleń w tej książce.</p>
                    <p className="text-[10px] text-white/30">Zaznacz dowolny tekst w czytniku, aby go zapisać.</p>
                  </div>
                ) : (
                  annotations.map((anno) => {
                    const style = colorBadgeStyles[anno.color];
                    return (
                      <div 
                        key={anno.id} 
                        className={`p-3 rounded-xl border ${style.bg} ${style.border} space-y-2 relative group`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <button
                            onClick={() => {
                              const cIdx = book.chapters.findIndex(c => c.id === anno.chapterId);
                              if (cIdx >= 0) {
                                soundFx.playPageTurn();
                                setCurrentChapterIdx(cIdx);
                              }
                            }}
                            className={`font-bold uppercase ${style.text} hover:underline`}
                          >
                            Rozdział 0{anno.chapterNumber}
                          </button>
                          <button
                            onClick={() => handleDeleteAnnotation(anno.id)}
                            className="text-rose-400 hover:text-rose-300 p-1"
                            title="Usuń"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <blockquote className="italic text-white/90 text-[11px] font-sans border-l-2 border-current pl-2 line-clamp-3">
                          "{anno.selectedText}"
                        </blockquote>
                        {anno.note && (
                          <p className="text-white/70 text-[11px] font-sans bg-black/50 p-2 rounded-lg">
                            💬 {anno.note}
                          </p>
                        )}
                        <div className="text-[9px] text-white/40 text-right">
                          {new Date(anno.createdAt).toLocaleDateString('pl-PL')}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 3: CHAPTERS INDEX & PROGRESS */}
            {drawerTab === 'chapters' && (
              <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                {book.chapters.map((ch, idx) => {
                  const chIsCurrent = idx === currentChapterIdx;
                  const chIsRead = isChapterRead(book.id, ch.id);
                  const chIsBm = isChapterBookmarked(book.id, ch.id);
                  const chNotesCount = chapterNotes.filter(n => n.chapterId === ch.id).length;

                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        soundFx.playPageTurn();
                        setCurrentChapterIdx(idx);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        chIsCurrent
                          ? 'bg-purple-600/30 border-purple-500 text-white font-bold'
                          : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs truncate">
                          0{ch.number}. {ch.title}
                        </div>
                        <div className="text-[10px] text-white/40 flex items-center gap-2 mt-0.5">
                          <span>{ch.readTimeMin} min</span>
                          {chNotesCount > 0 && (
                            <span className="text-purple-300">💬 {chNotesCount}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {chIsRead && (
                          <span title="Przeczytany">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          </span>
                        )}
                        {chIsBm && (
                          <span title="Zakładka">
                            <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </div>

      {/* Floating Selection Toolbar (Appears when text is selected) */}
      {showSelectionToolbar && selectedText && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-lg bg-slate-900/95 border border-purple-500/50 shadow-2xl rounded-2xl p-4 backdrop-blur-xl font-mono text-xs space-y-3 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2 text-purple-300 font-bold">
              <Highlighter className="w-4 h-4 text-purple-400" />
              <span>DODAJ ZAKREŚLENIE I CYTAT</span>
            </div>
            <button
              onClick={() => {
                setShowSelectionToolbar(false);
                setSelectedText('');
              }}
              className="text-white/50 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <blockquote className="text-[11px] italic font-sans text-white/80 bg-black/40 p-2 rounded-lg line-clamp-2">
            "{selectedText}"
          </blockquote>

          {/* Color Picker Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase text-white/50">Kolor:</span>
            {(['yellow', 'cyan', 'purple', 'emerald'] as const).map((col) => (
              <button
                key={col}
                onClick={() => setAnnoColor(col)}
                className={`px-2 py-1 rounded-lg text-[10px] uppercase font-bold border transition-all cursor-pointer ${
                  annoColor === col ? 'scale-105 border-white ring-2 ring-white/20' : 'opacity-60 hover:opacity-100'
                } ${colorBadgeStyles[col].bg} ${colorBadgeStyles[col].text} ${colorBadgeStyles[col].border}`}
              >
                {col}
              </button>
            ))}
          </div>

          {/* Personal Note Input */}
          <div className="space-y-1">
            <input
              type="text"
              placeholder="Opcjonalny komentarz do cytatu..."
              value={annoNote}
              onChange={(e) => setAnnoNote(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => {
                setShowSelectionToolbar(false);
                setSelectedText('');
              }}
              className="px-3 py-1.5 rounded-xl border border-white/10 text-white/60 hover:text-white text-[11px] cursor-pointer"
            >
              Anuluj
            </button>
            <button
              onClick={handleSaveAnnotation}
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-lg shadow-purple-500/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ZAPISZ ZAKREŚLENIE</span>
            </button>
          </div>
        </div>
      )}

      {/* Pętla Loop Behavioral Mapper Modal */}
      <PetlaLoopModal
        isOpen={showPetlaModal}
        onClose={() => setShowPetlaModal(false)}
        chapterTitle={`Rozdział 0${chapter.number}: ${chapter.title}`}
        bookTitle={book.title}
        bookId={book.id}
      />

    </div>
  );
};
