import React, { useState } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  FileText, 
  Headphones, 
  Github, 
  Globe, 
  Share2,
  Bookmark,
  Check,
  Plus,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Book, BookCollection, BookProgressData } from '../types';
import { SEEKERS_CONFIG } from '../data/booksData';
import { soundFx } from '../utils/audioSystem';
import { getBookReadingProgress } from '../utils/readingProgress';

interface BookCardProps {
  book: Book;
  collections?: BookCollection[];
  progress?: BookProgressData;
  onToggleBookInCollection?: (collectionId: string, bookId: string) => void;
  onOpenBook: (book: Book) => void;
  onOpenPdf: (book: Book) => void;
  onOpenAudio: (book: Book) => void;
  onOpenQr: (book: Book) => void;
  onOpenHtmlWorld?: (book: Book) => void;
  onOpenEditorialStudio?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  collections = [],
  progress,
  onToggleBookInCollection,
  onOpenBook,
  onOpenPdf,
  onOpenAudio,
  onOpenQr,
  onOpenHtmlWorld,
  onOpenEditorialStudio
}) => {
  const [showColMenu, setShowColMenu] = useState(false);
  const seekerCfg = SEEKERS_CONFIG[book.seeker];
  const accentColor = book.seekerColor || seekerCfg.color;

  const readingProgress = progress || getBookReadingProgress(book);

  return (
    <div 
      className="group relative bg-white/5 border border-white/10 rounded-xl p-4 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 shadow-xl flex flex-col justify-between"
    >
      {/* Top Accent Neon Bar */}
      <div 
        className="h-1 w-full rounded-t-xl transition-all duration-300 group-hover:h-1.5 absolute top-0 left-0"
        style={{ backgroundColor: accentColor }}
      />

      <div className="space-y-3 pt-1">
        {/* Cover + Meta Row */}
        <div className="flex gap-4 items-start">
          {/* Cover Visual */}
          <div 
            onClick={() => {
              soundFx.playModalOpen();
              onOpenBook(book);
            }}
            className="w-24 h-36 bg-[#1a1a1a] rounded overflow-hidden shadow-2xl relative shrink-0 border border-white/10 cursor-pointer flex flex-col justify-between p-2 text-center group-hover:scale-105 transition-transform"
            style={{
              background: book.coverImageUrl ? `url(${book.coverImageUrl}) center/cover no-repeat` : `radial-gradient(circle at 50% 30%, ${accentColor}33, #0a0a0a 90%)`
            }}
          >
            {book.coverImageUrl && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] hover:bg-black/20 transition-colors" />
            )}
            <div className="text-right relative z-10">
              {book.customHtmlWorld ? (
                <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/40 font-bold uppercase tracking-wider animate-pulse">
                  HTML WORLD
                </span>
              ) : (
                <span className="text-[9px] font-mono text-white/50">{book.year}</span>
              )}
            </div>
            <div className="my-auto relative z-10">
              {!book.coverImageUrl && (
                <span className="text-2xl drop-shadow block" style={{ color: accentColor }}>
                  {book.coverStyle.symbol}
                </span>
              )}
              <span className="text-[10px] font-bold font-mono text-white uppercase line-clamp-2 leading-tight mt-1 drop-shadow-md">
                {book.title}
              </span>
            </div>
            <div className="text-left relative z-10 flex items-center justify-between">
              <span className="text-[8px] font-mono text-white/60 uppercase">{book.language}</span>
              {book.coverAssetId && (
                <span className="text-[7px] font-mono text-cyan-300 bg-cyan-950/80 px-1 rounded border border-cyan-500/40">
                  ASSET
                </span>
              )}
            </div>
          </div>

          {/* Book Content Details */}
          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="uppercase font-bold tracking-wider truncate" style={{ color: accentColor }}>
                {book.seeker}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {book.stats.partsCount !== undefined && (
                  <span className="text-[9px] px-1 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                    {book.stats.partsCount} cz.
                  </span>
                )}
                <span className="text-white/40">{book.stats.pageCount} str.</span>
              </div>
            </div>

            {/* Series Label if present */}
            {book.series && (
              <div className="pt-0.5">
                <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950/70 border border-purple-500/30 text-purple-300 truncate max-w-full font-semibold">
                  {book.series}
                </span>
              </div>
            )}

            <h3 
              onClick={() => {
                soundFx.playModalOpen();
                onOpenBook(book);
              }}
              className="text-base font-bold leading-tight text-white hover:text-blue-300 transition-colors cursor-pointer line-clamp-2"
            >
              {book.title}
            </h3>

            {book.subtitle && (
              <p className="text-[11px] font-mono text-white/50 line-clamp-1">
                {book.subtitle}
              </p>
            )}

            {book.author && (
              <p className="text-[10px] font-mono text-cyan-300/90 flex items-center gap-1">
                <span className="text-white/40">Autor:</span>
                <span className="font-semibold text-cyan-200">{book.author}</span>
              </p>
            )}

            {/* Wattpad Community Stats (Votes & Views) */}
            {(book.stats.votesCount !== undefined || (book.stats.readerCount && book.stats.readerCount > 0)) && (
              <div className="flex items-center gap-2 pt-0.5 font-mono text-[9px] text-white/50">
                {book.stats.votesCount !== undefined && (
                  <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20">
                    <span>★</span>
                    <span>{book.stats.votesCount}</span>
                  </span>
                )}
                {book.stats.readerCount !== undefined && book.stats.readerCount > 0 && (
                  <span className="flex items-center gap-1 text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/20">
                    <span>👁</span>
                    <span>{book.stats.readerCount.toLocaleString()}</span>
                  </span>
                )}
                {book.platformLinks?.wattpad && (
                  <a
                    href={book.platformLinks.wattpad}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[9px] text-orange-400 hover:text-orange-300 underline uppercase ml-auto flex items-center gap-1"
                    title="Otwórz na Wattpad"
                  >
                    <span>Wattpad</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            )}

            <p className="text-xs text-white/60 line-clamp-2 pt-1 font-sans">
              {book.shortDesc}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 pt-1">
              {book.tags.slice(0, 3).map((t) => (
                <span 
                  key={t}
                  className="text-[8px] px-1.5 py-0.5 border border-white/10 rounded uppercase font-mono text-white/40"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Reading Progress Indicator */}
        <div className="pt-2 font-mono">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-white/40 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>Postęp czytania</span>
            </span>
            {readingProgress.isCompleted ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40 text-[9px]">
                <CheckCircle2 className="w-3 h-3" />
                <span>UKOŃCZONO 100%</span>
              </span>
            ) : (
              <span className="text-white/60 text-[9px]">
                <strong className={readingProgress.percentage > 0 ? "text-cyan-300 font-bold" : "text-white/40"}>
                  {readingProgress.percentage}%
                </strong>
                {readingProgress.totalChapters > 0 && (
                  <span className="text-white/30 ml-1">
                    ({readingProgress.completedChaptersCount}/{readingProgress.totalChapters} rozdz.)
                  </span>
                )}
              </span>
            )}
          </div>

          <div className="w-full h-1.5 bg-black/40 border border-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                readingProgress.isCompleted 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                  : readingProgress.percentage > 0
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                    : 'bg-transparent'
              }`}
              style={{ width: `${Math.max(readingProgress.percentage, 0)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actions Row */}
      <div className="mt-3 pt-3 border-t border-white/10 space-y-2 relative">
        {book.customHtmlWorld && onOpenHtmlWorld && (
          <button
            onClick={() => {
              soundFx.playModalOpen();
              onOpenHtmlWorld(book);
            }}
            className="w-full py-2 bg-gradient-to-r from-red-950 via-zinc-900 to-cyan-950 border border-red-500/50 hover:border-cyan-400 text-white text-[10px] font-mono font-black uppercase rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 group-hover:text-cyan-300 transition-colors">
              OTWÓRZ INTERAKTYWNY ŚWIAT HTML
            </span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playModalOpen();
              onOpenBook(book);
            }}
            className="flex-1 py-1.5 text-black text-[10px] font-bold uppercase rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
            style={{ backgroundColor: accentColor }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>OTWÓRZ MODUŁ CZYTANIA</span>
          </button>

          {/* Quick Add to Collection Dropdown Button */}
          {collections.length > 0 && onToggleBookInCollection && (
            <div className="relative">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowColMenu(!showColMenu);
                }}
                className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Dodaj do kolekcji"
              >
                <Bookmark className="w-4 h-4 text-purple-400" />
              </button>

              {showColMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-48 rounded-xl bg-slate-950 border border-purple-500/40 shadow-2xl p-2 z-30 font-mono text-xs animate-in fade-in duration-200">
                  <div className="text-[9px] uppercase text-purple-400 font-bold px-2 py-1 border-b border-white/10 mb-1">
                    Kolekcje ({collections.length})
                  </div>
                  <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                    {collections.map((col) => {
                      const inCol = col.bookIds.includes(book.id);
                      return (
                        <button
                          key={col.id}
                          onClick={() => {
                            if (inCol) {
                              soundFx.playRemoveFromCollection();
                            } else {
                              soundFx.playAddToCollection();
                            }
                            onToggleBookInCollection(col.id, book.id);
                          }}
                          className={`w-full text-left p-1.5 rounded flex items-center justify-between text-[10px] transition-colors cursor-pointer ${
                            inCol ? 'bg-purple-950/80 text-purple-300 font-bold' : 'text-white/70 hover:bg-white/10'
                          }`}
                        >
                          <span className="truncate">{col.name}</span>
                          {inCol ? <Check className="w-3 h-3 text-emerald-400 shrink-0" /> : <Plus className="w-3 h-3 text-white/30 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Links Toolbar */}
        <div className="flex items-center gap-1 flex-wrap text-[10px] font-mono">
          {book.platformLinks.pdfUrl && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenPdf(book);
              }}
              className="p-1 px-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="PDF"
            >
              <FileText className="w-3 h-3 text-blue-400" />
              <span>PDF</span>
            </button>
          )}

          {book.platformLinks.audioUrl && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenAudio(book);
              }}
              className="p-1 px-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="Audiobook"
            >
              <Headphones className="w-3 h-3 text-amber-400" />
              <span>AUDIO</span>
            </button>
          )}

          {book.platformLinks.amazon && (
            <a
              href={book.platformLinks.amazon}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick()}
              className="p-1 px-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-1"
            >
              <Globe className="w-3 h-3 text-amber-400" />
              <span>AMAZON</span>
            </a>
          )}

          {book.platformLinks.wattpad && (
            <a
              href={book.platformLinks.wattpad}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick()}
              className="p-1 px-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3 text-orange-400" />
              <span>WATTPAD</span>
            </a>
          )}

          {book.platformLinks.github && (
            <a
              href={book.platformLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick()}
              className="p-1 px-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-1"
            >
              <Github className="w-3 h-3 text-cyan-400" />
              <span>CODE</span>
            </a>
          )}

          {onOpenEditorialStudio && (
            <button
              onClick={() => {
                soundFx.playModalOpen();
                onOpenEditorialStudio(book);
              }}
              className="p-1 px-2 rounded bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900 text-cyan-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="Editorial Studio // Edytuj dzieło"
            >
              <span>EDYTUJ</span>
            </button>
          )}

          <button
            onClick={() => {
              soundFx.playClick();
              onOpenQr(book);
            }}
            className="p-1 px-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-1 ml-auto cursor-pointer"
            title="QR Code"
          >
            <Share2 className="w-3 h-3 text-cyan-400" />
            <span>QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
