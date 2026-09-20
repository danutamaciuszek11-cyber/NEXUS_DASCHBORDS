import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Layers, 
  Cpu, 
  Clock, 
  ShieldCheck, 
  Download, 
  X, 
  Terminal, 
  RefreshCw,
  Sparkles,
  Zap
} from 'lucide-react';
import { Book } from '../types';
import { 
  BatchMigrationProgress, 
  BatchMigratorController 
} from '../utils/batchMigrator';
import { soundFx } from '../utils/audioSystem';

interface BatchMigrationModalProps {
  isOpen: boolean;
  progress: BatchMigrationProgress | null;
  controller: BatchMigratorController | null;
  onClose: () => void;
  onCommitBooksToLibrary: (books: Book[]) => void;
}

export const BatchMigrationModal: React.FC<BatchMigrationModalProps> = ({
  isOpen,
  progress,
  controller,
  onClose,
  onCommitBooksToLibrary
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'queue' | 'logs'>('matrix');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'logs') {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [progress?.logMessages?.length, activeTab]);

  if (!isOpen || !progress) return null;

  const isCompleted = progress.isCompleted;
  const successfulBooks = progress.items.filter(i => i.book !== null).map(i => i.book!);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-lg animate-fade-in">
      <div className="w-full max-w-6xl h-[92vh] bg-slate-950 border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-900/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  94-BOOK BATCH MIGRATOR // KNOWLEDGE ENGINE
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  isCompleted 
                    ? 'bg-emerald-950 border-emerald-500/60 text-emerald-300' 
                    : progress.isPaused 
                    ? 'bg-amber-950 border-amber-500/60 text-amber-300' 
                    : 'bg-cyan-950 border-cyan-500/60 text-cyan-300 animate-pulse'
                }`}>
                  {isCompleted ? 'UKOŃCZONO 100%' : progress.isPaused ? 'WSTRZYMANO' : 'PRZETWARZANIE CHUNKÓW'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Partycja: Chunk {progress.currentChunkIndex}/{progress.totalChunks} • Rozmiar okna: {progress.chunkSize} równoległych tomów • Pamięć V8 zwolniona
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {controller && !isCompleted && (
              <>
                {progress.isPaused ? (
                  <button
                    onClick={() => controller.resume()}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <Play className="w-3.5 h-3.5" />
                    WZNÓW
                  </button>
                ) : (
                  <button
                    onClick={() => controller.pause()}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    PAUZA
                  </button>
                )}

                <button
                  onClick={() => controller.cancel()}
                  className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  PRZERWIJ
                </button>
              </>
            )}

            <button
              onClick={() => {
                soundFx.playModalClose();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Progress Bar & Live Metrics Ribbon */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-900/40 space-y-3 shrink-0">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Postęp globalny:</span>
              <span className="text-cyan-400 font-bold text-sm">
                {progress.processedFiles} / {progress.totalFiles} tomów ({progress.overallPercentage}%)
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Czas: <strong className="text-white">{progress.elapsedSeconds}s</strong>
              </span>
              {!isCompleted && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  ETA: <strong className="text-white">~{progress.estimatedSecondsRemaining}s</strong>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                Prędkość: <strong className="text-white">{progress.processingRateBooksPerMin} tomów/min</strong>
              </span>
            </div>
          </div>

          {/* Animated Gradient Bar */}
          <div className="w-full h-3 bg-slate-950 rounded-full border border-white/10 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-purple-500 transition-all duration-300 relative"
              style={{ width: `${progress.overallPercentage}%` }}
            >
              {!isCompleted && !progress.isPaused && (
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              )}
            </div>
          </div>

          {/* KPI Mini-Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            <div className="bg-slate-950/80 border border-white/5 rounded-xl p-2 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">SUKCES</span>
              <span className="text-sm font-bold font-mono text-emerald-400">{progress.successCount}</span>
            </div>
            <div className="bg-slate-950/80 border border-white/5 rounded-xl p-2 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">BŁĘDY</span>
              <span className="text-sm font-bold font-mono text-red-400">{progress.failedCount}</span>
            </div>
            <div className="bg-slate-950/80 border border-white/5 rounded-xl p-2 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">SŁOWA OGÓŁEM</span>
              <span className="text-sm font-bold font-mono text-cyan-300">{progress.totalWords.toLocaleString()}</span>
            </div>
            <div className="bg-slate-950/80 border border-white/5 rounded-xl p-2 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">ROZDZIAŁY</span>
              <span className="text-sm font-bold font-mono text-purple-300">{progress.totalChapters}</span>
            </div>
            <div className="bg-slate-950/80 border border-white/5 rounded-xl p-2 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 font-mono block">ETAP CHUNKU</span>
              <span className="text-xs font-bold font-mono text-amber-300 truncate block">
                {progress.currentStage}
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs: 94 Matrix | Active Queue | Live Terminal */}
        <div className="px-4 sm:px-6 py-2 border-b border-white/10 bg-slate-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('matrix');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'matrix' ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              MACIERZ 94 TOMÓW
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('queue');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'queue' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              KOLEJKA DOKUMENTÓW ({progress.items.length})
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('logs');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'logs' ? 'bg-emerald-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              LOGI TERMINALA ({progress.logMessages.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => controller?.downloadReport()}
              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 text-slate-300 text-xs font-mono flex items-center gap-1 cursor-pointer transition-all"
            >
              <Download className="w-3 h-3 text-cyan-400" />
              RAPORT JSON
            </button>

            {isCompleted && successfulBooks.length > 0 && (
              <button
                onClick={() => {
                  soundFx.playSuccess();
                  onCommitBooksToLibrary(successfulBooks);
                  onClose();
                }}
                className="px-3.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                ZAPISZ {successfulBooks.length} KSIĄG W BIBLIOTECE
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: 94 Matrix Grid View */}
        {activeTab === 'matrix' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col">
            <div className="mb-3 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Kliknij węzeł tomu w macierzy, aby podejrzeć status i wyekstrahowane rozdziały:</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Sukces</span>
                <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded bg-cyan-400 animate-pulse" /> W toku</span>
                <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded bg-slate-800" /> W kolejce</span>
                <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded bg-red-500" /> Błąd</span>
              </div>
            </div>

            {/* Matrix 94 items grid */}
            <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-1.5 p-3 rounded-2xl bg-slate-900/50 border border-white/10">
              {progress.items.map((it, idx) => {
                const isSelected = selectedItemIndex === idx;
                let bgClass = 'bg-slate-800/80 text-slate-400 border-white/5 hover:border-white/30';

                if (it.status === 'success') {
                  bgClass = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-900/30';
                } else if (it.status === 'processing') {
                  bgClass = 'bg-cyan-500 text-black font-bold border-white animate-pulse shadow-md shadow-cyan-500/40';
                } else if (it.status === 'failed') {
                  bgClass = 'bg-red-950 text-red-300 border-red-500';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedItemIndex(idx);
                    }}
                    className={`h-9 rounded-lg border font-mono text-[10px] flex flex-col items-center justify-center transition-all cursor-pointer relative ${bgClass} ${
                      isSelected ? 'ring-2 ring-cyan-400 scale-105 z-10' : ''
                    }`}
                    title={`${it.fileName} (${it.status})`}
                  >
                    <span>{idx + 1}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Node Details Drawer */}
            {selectedItemIndex !== null && progress.items[selectedItemIndex] && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-2 text-xs font-mono">
                {(() => {
                  const sel = progress.items[selectedItemIndex];
                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-400">
                          TOM #{sel.index} // {sel.fileName}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sel.status === 'success' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                          sel.status === 'processing' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' :
                          sel.status === 'failed' ? 'bg-red-950 text-red-300 border border-red-500/40' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {sel.status.toUpperCase()} • {sel.stage}
                        </span>
                      </div>

                      {sel.book && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-slate-300">
                          <div>
                            <span className="text-slate-500 block text-[10px]">TYTUŁ DZIEŁA</span>
                            <strong className="text-white">{sel.book.title}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">SEEKER // KATEGORIA</span>
                            <span style={{ color: sel.seekerColor || '#ffd700' }} className="font-bold">
                              {sel.seeker || sel.book.seeker}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">STATYSTYKI TEKSTU</span>
                            <span>{sel.extractedWords.toLocaleString()} słów • {sel.extractedChapters} rozdziałów</span>
                          </div>
                        </div>
                      )}

                      {sel.errorReason && (
                        <div className="text-red-400 text-xs bg-red-950/40 p-2 rounded border border-red-500/30">
                          Powód błędu: {sel.errorReason}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Queue List View */}
        {activeTab === 'queue' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-2">
            {progress.items.map((it) => (
              <div 
                key={it.index}
                className="p-3 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-[10px]">
                    #{it.index}
                  </span>
                  <div className="truncate">
                    <h4 className="text-white font-bold truncate">{it.fileName}</h4>
                    <p className="text-[10px] text-slate-500 truncate">
                      {it.extractedWords > 0 ? `${it.extractedWords} słów • ${it.extractedChapters} rozdz.` : 'Oczekiwanie w kolejce...'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {it.status === 'processing' && (
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] flex items-center gap-1 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" /> {it.stage}
                    </span>
                  )}
                  {it.status === 'success' && (
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Gotowy
                    </span>
                  )}
                  {it.status === 'failed' && (
                    <span className="px-2 py-0.5 rounded bg-red-950 border border-red-500/40 text-red-300 text-[10px] flex items-center gap-1 font-bold">
                      <AlertTriangle className="w-3 h-3" /> Błąd
                    </span>
                  )}
                  {it.status === 'pending' && (
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-500 text-[10px]">
                      Kolejka
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Terminal Console Output */}
        {activeTab === 'logs' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar bg-black/70 font-mono text-[11px] text-slate-300 space-y-1.5">
            {progress.logMessages.map((log, idx) => (
              <div 
                key={idx}
                className={`leading-relaxed ${
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'warn' ? 'text-amber-400' :
                  log.type === 'success' ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                <span className="text-slate-600 mr-2">[{log.timestamp}]</span>
                {log.text}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}

        {/* Bottom Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Optymalizacja Pamięci V8: Płynne zwalnianie buforów i nieblokujący render UI.</span>
          </div>

          <div className="flex items-center gap-2">
            {isCompleted ? (
              <button
                onClick={() => {
                  soundFx.playSuccess();
                  onCommitBooksToLibrary(successfulBooks);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                ZATWIERDŹ {successfulBooks.length} KSIĄG W NEXUSIE
              </button>
            ) : (
              <button
                onClick={() => {
                  soundFx.playModalClose();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-all cursor-pointer"
              >
                ZAMKNIJ OKNO (PROCES W TLE)
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
