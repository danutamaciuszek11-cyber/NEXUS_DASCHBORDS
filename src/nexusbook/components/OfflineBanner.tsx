import React, { useState } from 'react';
import { WifiOff, ShieldCheck, Database, BookOpen, MessageSquare, X, HardDrive } from 'lucide-react';
import { useOnlineStatus } from '../utils/useOnlineStatus';
import { getOfflineCacheStats, getCachedBooksOffline } from '../utils/offlineBookCache';
import { getStoredChapterNotes } from '../utils/chapterNotesStorage';
import { getStoredBookmarks } from '../utils/bookmarkStorage';
import { Book } from '../types';

interface OfflineBannerProps {
  onSelectBook?: (book: Book) => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ onSelectBook }) => {
  const { isOnline } = useOnlineStatus();
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  if (isOnline && !showOfflineModal) return null;

  const stats = getOfflineCacheStats();
  const notesCount = getStoredChapterNotes().length;
  const bookmarksCount = getStoredBookmarks().length;
  const cachedBooks = getCachedBooksOffline();

  return (
    <>
      {/* Floating Offline Notification Pill */}
      {!isOnline && (
        <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3 p-3 px-4 rounded-2xl bg-amber-950/90 border border-amber-500/50 shadow-2xl backdrop-blur-xl font-mono text-xs text-amber-200 animate-in slide-in-from-bottom">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <WifiOff className="w-4 h-4 text-amber-400" />
            <span className="font-bold">TRYB OFFLINE</span>
          </div>

          <span className="text-amber-200/70 hidden sm:inline">•</span>
          <span className="text-[11px] text-amber-200/80 hidden sm:inline">
            Dostępna lokalna pamięć podręczna ETERNIVERSE
          </span>

          <button
            onClick={() => setShowOfflineModal(true)}
            className="ml-2 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-[10px] transition-colors cursor-pointer"
          >
            ZARZĄDZAJ PAMIĘCIĄ
          </button>
        </div>
      )}

      {/* Offline Storage Status Modal */}
      {showOfflineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-950 border border-amber-500/40 p-6 shadow-2xl font-mono text-xs space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <HardDrive className="w-5 h-5 text-amber-400" />
                <span>PAMIĘĆ PODRĘCZNA OFFLINE (SERVICE WORKER & STORAGE)</span>
              </div>
              <button
                onClick={() => setShowOfflineModal(false)}
                className="text-white/60 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Telemetry */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-center">
                <span className="text-[10px] text-white/40 uppercase">Książki Offline</span>
                <p className="text-lg font-bold text-cyan-400">{cachedBooks.length}</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-center">
                <span className="text-[10px] text-white/40 uppercase">Notatki</span>
                <p className="text-lg font-bold text-purple-400">{notesCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-center">
                <span className="text-[10px] text-white/40 uppercase">Zakładki</span>
                <p className="text-lg font-bold text-amber-400">{bookmarksCount}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p>
                Wszystkie otwarte tomy, treść rozdziałów, notatki tekstowe oraz zakreślenia są trwale buforowane w magazynie lokalnym i pamięci podręcznej Service Workera. Możesz kontynuować lekturę bez aktywnego połączenia internetowego.
              </p>
            </div>

            {/* Offline Books Quick Access List */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase text-white/50 tracking-wider">
                Książki gotowe do czytania offline:
              </span>
              <div className="max-h-48 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                {cachedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/40 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="text-white font-bold truncate">{book.title}</div>
                      <div className="text-[10px] text-white/40">{book.seeker} • {book.chapters.length} rozdz.</div>
                    </div>
                    {onSelectBook && (
                      <button
                        onClick={() => {
                          setShowOfflineModal(false);
                          onSelectBook(book);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black font-bold text-[10px] transition-colors shrink-0 cursor-pointer"
                      >
                        CZYTAJ
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowOfflineModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
