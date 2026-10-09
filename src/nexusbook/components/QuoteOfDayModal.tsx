import React, { useState, useMemo } from 'react';
import { 
  X, 
  Quote as QuoteIcon, 
  Shuffle, 
  Share2, 
  Check, 
  Sparkles, 
  BookOpen, 
  Search,
  ChevronRight,
  ExternalLink,
  Layers
} from 'lucide-react';
import { Book } from '../types';
import { 
  QuoteWithAttribution, 
  getAllQuotesFromBooks, 
  formatQuoteForSharing 
} from '../utils/quoteHelper';
import { soundFx } from '../utils/audioSystem';

interface QuoteOfDayModalProps {
  books: Book[];
  onClose: () => void;
  onOpenBook: (book: Book) => void;
}

export const QuoteOfDayModal: React.FC<QuoteOfDayModalProps> = ({ 
  books, 
  onClose,
  onOpenBook 
}) => {
  const allQuotes = useMemo(() => getAllQuotesFromBooks(books), [books]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'featured' | 'browse'>('featured');

  const filteredQuotes = useMemo(() => {
    if (!searchQuery.trim()) return allQuotes;
    const q = searchQuery.toLowerCase();
    return allQuotes.filter(quote => 
      quote.text.toLowerCase().includes(q) ||
      quote.bookTitle.toLowerCase().includes(q) ||
      quote.bookAuthor.toLowerCase().includes(q) ||
      quote.seeker.toLowerCase().includes(q) ||
      quote.chapterTitle.toLowerCase().includes(q)
    );
  }, [allQuotes, searchQuery]);

  const activeQuote: QuoteWithAttribution | undefined = filteredQuotes[currentIdx] || filteredQuotes[0] || allQuotes[0];

  const handleNextQuote = () => {
    soundFx.playClick();
    if (filteredQuotes.length > 0) {
      setCurrentIdx((prev) => (prev + 1) % filteredQuotes.length);
    }
  };

  const handleCopy = (qToCopy?: QuoteWithAttribution) => {
    const target = qToCopy || activeQuote;
    if (!target) return;
    soundFx.playClick();
    const text = formatQuoteForSharing(target);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const accentColor = activeQuote?.seekerColor || '#00f0ff';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-300">
      
      <div 
        className="w-full max-w-2xl rounded-3xl bg-slate-950 border border-white/15 shadow-2xl p-6 md:p-8 space-y-6 relative overflow-hidden my-auto"
        style={{
          boxShadow: `0 0 40px ${accentColor}25`
        }}
      >
        {/* Background ambient glow */}
        <div 
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: accentColor }}
        />

        {/* Header */}
        <div className="flex items-center justify-between font-mono text-xs border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>CYTAT DNIA & SYNAPSY WIEDZY ({allQuotes.length})</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setViewMode('featured');
                }}
                className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold transition-all ${
                  viewMode === 'featured' ? 'bg-cyan-500 text-black shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                Główny
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setViewMode('browse');
                }}
                className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold transition-all ${
                  viewMode === 'browse' ? 'bg-cyan-500 text-black shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                Katalog ({filteredQuotes.length})
              </button>
            </div>

            <button
              onClick={() => {
                soundFx.playModalClose();
                onClose();
              }}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {viewMode === 'featured' && activeQuote && (
          <div className="space-y-6">
            {/* Quote Card */}
            <div className="p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-white/10 space-y-5 relative">
              <QuoteIcon 
                className="w-10 h-10 opacity-35"
                style={{ color: accentColor }}
              />

              <blockquote className="text-lg md:text-xl font-serif italic text-white/95 leading-relaxed font-medium">
                „{activeQuote.text}”
              </blockquote>

              {/* Attribution Section */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[11px]">AUTOR:</span>
                    <span className="font-bold text-white">{activeQuote.bookAuthor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <span className="text-white/40 text-[11px]">KSIĘGA:</span>
                    <span className="font-semibold" style={{ color: accentColor }}>
                      {activeQuote.bookTitle}
                    </span>
                    {activeQuote.year && <span className="text-white/40">({activeQuote.year})</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span 
                    className="text-[10px] px-2.5 py-1 rounded-full uppercase font-bold border"
                    style={{
                      borderColor: `${accentColor}40`,
                      backgroundColor: `${accentColor}15`,
                      color: accentColor
                    }}
                  >
                    {activeQuote.seeker}
                  </span>
                  <span className="text-[10px] px-2 py-1 rounded bg-black/50 border border-white/10 text-slate-400">
                    {activeQuote.chapterTitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs pt-1">
              <button
                onClick={handleNextQuote}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-purple-500/50 text-slate-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer font-bold"
              >
                <Shuffle className="w-4 h-4 text-purple-400" />
                <span>LOSUJ INNY CYTAT</span>
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => {
                    soundFx.playModalOpen();
                    onOpenBook(activeQuote.book);
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>OTWÓRZ KSIĘGĘ</span>
                </button>

                <button
                  onClick={() => handleCopy(activeQuote)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? 'SKOPIOWANO' : 'KOPIUJ Z ATRYBUCJĄ'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'browse' && (
          <div className="space-y-4">
            {/* Search filter in quote catalogue */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Szukaj w cytatach, autorach, księgach i wrotach..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentIdx(0);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 outline-none font-mono text-xs text-white placeholder-white/40"
              />
            </div>

            {/* List of quotes */}
            <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {filteredQuotes.length === 0 ? (
                <div className="p-8 text-center text-white/50 font-mono text-xs">
                  Brak cytatów odpowiadających zapytaniu.
                </div>
              ) : (
                filteredQuotes.map((q, idx) => (
                  <div 
                    key={q.id || idx}
                    className="p-4 rounded-xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/40 transition-all space-y-2 group"
                  >
                    <p className="text-sm font-serif italic text-white/90">
                      „{q.text}”
                    </p>
                    <div className="flex items-center justify-between font-mono text-[11px] pt-2 border-t border-white/5">
                      <div className="truncate space-x-1.5">
                        <span className="text-white font-bold">{q.bookAuthor}</span>
                        <span className="text-white/40">•</span>
                        <span className="text-cyan-300">{q.bookTitle}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleCopy(q)}
                          className="p-1 px-2 rounded bg-white/5 hover:bg-white/15 text-white/70 hover:text-white text-[10px]"
                          title="Kopiuj"
                        >
                          Kopiuj
                        </button>
                        <button
                          onClick={() => {
                            soundFx.playModalOpen();
                            onOpenBook(q.book);
                            onClose();
                          }}
                          className="p-1 px-2 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-black font-bold text-[10px]"
                        >
                          Czytaj
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
