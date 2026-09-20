import React, { useState, useEffect } from 'react';
import { 
  Quote as QuoteIcon, 
  Sparkles, 
  Shuffle, 
  BookOpen, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Book } from '../types';
import { 
  QuoteWithAttribution, 
  getDailyQuote, 
  getRandomQuote, 
  formatQuoteForSharing 
} from '../utils/quoteHelper';
import { soundFx } from '../utils/audioSystem';

interface QuoteOfTheDayProps {
  books: Book[];
  onOpenBook: (book: Book) => void;
  onOpenFullQuotesExplorer?: () => void;
}

export const QuoteOfTheDay: React.FC<QuoteOfTheDayProps> = ({
  books,
  onOpenBook,
  onOpenFullQuotesExplorer
}) => {
  const [currentQuote, setCurrentQuote] = useState<QuoteWithAttribution | null>(null);
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize with the canonical daily quote
  useEffect(() => {
    if (books.length > 0 && !currentQuote) {
      const daily = getDailyQuote(books);
      setCurrentQuote(daily);
    }
  }, [books, currentQuote]);

  const handleShuffle = () => {
    soundFx.playClick();
    setIsAnimating(true);
    setTimeout(() => {
      const nextQuote = getRandomQuote(books, currentQuote?.id);
      if (nextQuote) {
        setCurrentQuote(nextQuote);
      }
      setIsAnimating(false);
    }, 180);
  };

  const handleCopy = () => {
    if (!currentQuote) return;
    soundFx.playClick();
    const formatted = formatQuoteForSharing(currentQuote);
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  if (!currentQuote) return null;

  const accentColor = currentQuote.seekerColor || '#00f0ff';
  const todayFormatted = new Date().toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <section className="relative rounded-2xl p-6 sm:p-8 border border-white/10 bg-slate-950/70 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-500">
      {/* Radiant Background Glow */}
      <div 
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: accentColor }}
      />
      <div 
        className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-15 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: accentColor }}
      />

      {/* Decorative top accent line */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-stretch justify-between gap-6">
        
        {/* Left/Main Column: Quote Text & Attribution */}
        <div className="flex-1 space-y-4">
          
          {/* Header Badge */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] uppercase text-cyan-400 font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>CYTAT DNIA • {todayFormatted}</span>
            </div>

            <div 
              className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold border"
              style={{
                borderColor: `${accentColor}40`,
                backgroundColor: `${accentColor}15`,
                color: accentColor
              }}
            >
              WROTA: {currentQuote.seeker}
            </div>

            {currentQuote.chapterTitle && (
              <span className="text-[10px] font-mono text-white/40 hidden sm:inline">
                {currentQuote.chapterTitle}
              </span>
            )}
          </div>

          {/* Quotation Body */}
          <div className={`relative pl-6 sm:pl-8 py-1 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            <QuoteIcon 
              className="absolute left-0 top-0 w-5 h-5 opacity-40"
              style={{ color: accentColor }}
            />
            
            <blockquote className="text-base sm:text-lg md:text-xl font-medium font-serif italic text-white/95 leading-relaxed tracking-wide">
              „{currentQuote.text}”
            </blockquote>
          </div>

          {/* Book & Author Attribution Card */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-[11px]">AUTOR:</span>
                <span className="text-white font-bold tracking-wide">
                  {currentQuote.bookAuthor}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-[11px] truncate">
                <span className="text-white/40">KSIĘGA:</span>
                <span 
                  onClick={() => {
                    soundFx.playModalOpen();
                    onOpenBook(currentQuote.book);
                  }}
                  className="hover:underline cursor-pointer font-semibold"
                  style={{ color: accentColor }}
                  title="Kliknij, aby otworzyć tę książkę"
                >
                  {currentQuote.bookTitle}
                </span>
                {currentQuote.year && (
                  <span className="text-white/30">({currentQuote.year})</span>
                )}
              </div>
            </div>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/15 text-white/80 hover:text-white transition-all text-[11px] flex items-center gap-1.5 cursor-pointer font-bold"
                title="Kopiuj cytat z atrybucją"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">SKOPIOWANO</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>KOPIUJ</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShuffle}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-purple-500/20 hover:border-purple-500/40 text-purple-300 transition-all text-[11px] flex items-center gap-1.5 cursor-pointer font-bold"
                title="Wylosuj inny cytat z archiwum"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>LOSUJ INNY</span>
              </button>
            </div>

          </div>

        </div>

        {/* Right Column: Source Book Action Card */}
        <div className="w-full md:w-56 shrink-0 flex flex-col justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <div className="space-y-1.5">
            <div className="text-[9px] font-mono uppercase text-white/40 font-bold tracking-wider">
              ŹRÓDŁO CYTATU
            </div>
            <div className="text-xs font-bold text-white font-mono line-clamp-2">
              {currentQuote.bookTitle}
            </div>
            {currentQuote.bookSubtitle && (
              <div className="text-[10px] font-mono text-white/50 line-clamp-1">
                {currentQuote.bookSubtitle}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40 pt-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
              <span>{currentQuote.book.stats.pageCount} stron</span>
              <span>•</span>
              <span>{currentQuote.book.language}</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <button
              onClick={() => {
                soundFx.playModalOpen();
                onOpenBook(currentQuote.book);
              }}
              className="w-full py-2 px-3 rounded-lg text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
              style={{
                backgroundColor: accentColor,
                color: '#000000'
              }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>CZYTAJ KSIĘGĘ</span>
            </button>

            {onOpenFullQuotesExplorer && (
              <button
                onClick={() => {
                  soundFx.playModalOpen();
                  onOpenFullQuotesExplorer();
                }}
                className="w-full py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-[10px] font-mono uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>WSZYSTKIE CYTATY</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
