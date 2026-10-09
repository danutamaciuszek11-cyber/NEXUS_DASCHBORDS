import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  ChevronRight,
  Sparkles,
  Terminal,
  Activity
} from 'lucide-react';
import { nexusLogger } from '../services/loggerService';
import { NexusLogEntry } from '../types';
import { soundFx } from '../utils/audioSystem';

interface ToastItem {
  id: string;
  entry: NexusLogEntry;
  createdAt: number;
  expiresAt: number;
  isExpanded: boolean;
  copied: boolean;
}

interface NexusErrorToastContainerProps {
  onOpenDiagnostics?: () => void;
}

export const NexusErrorToastContainer: React.FC<NexusErrorToastContainerProps> = ({
  onOpenDiagnostics
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    // Subskrypcja zdarzeń telemetrii Nexusa
    const unsubscribe = nexusLogger.subscribe((entry: NexusLogEntry) => {
      // Wyświetlamy toasty tylko dla wpisów wymagających powiadomienia lub błędów
      if (!entry.notifyUser && entry.level !== 'ERROR' && entry.level !== 'FATAL') {
        return;
      }

      // Ignorujemy błędy HMR
      if (entry.message.includes('[vite] failed to connect')) return;

      setToasts(prev => {
        // Sprawdzamy czy podobny toast już istnieje (deduplikacja w locie)
        const existingIdx = prev.findIndex(t => 
          t.entry.module === entry.module && 
          t.entry.message === entry.message
        );

        const duration = entry.level === 'FATAL' ? 12000 : entry.level === 'ERROR' ? 8000 : 5000;
        const now = Date.now();

        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            entry: {
              ...entry,
              count: (updated[existingIdx].entry.count || 1) + 1
            },
            expiresAt: now + duration
          };
          return updated;
        }

        // Dźwiękowy impuls ostrzegawczy
        if (entry.level === 'FATAL' || entry.level === 'ERROR') {
          try {
            soundFx.playDelete();
          } catch {
            // ignore
          }
        }

        const newToast: ToastItem = {
          id: entry.id,
          entry,
          createdAt: now,
          expiresAt: now + duration,
          isExpanded: false,
          copied: false
        };

        // Trzymamy maksymalnie 4 jednoczesne toasty
        return [newToast, ...prev.slice(0, 3)];
      });
    });

    // Pętla sprawdzająca wygaśnięcie toastów
    const timer = setInterval(() => {
      if (isHoveredRef.current) return;
      const now = Date.now();
      setToasts(prev => prev.filter(t => t.expiresAt > now));
    }, 500);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleExpand = (id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, isExpanded: !t.isExpanded } : t));
  };

  const copyToastDetails = (toast: ToastItem) => {
    const payload = JSON.stringify({
      timestamp: new Date(toast.entry.timestamp).toISOString(),
      level: toast.entry.level,
      category: toast.entry.category,
      module: toast.entry.module,
      message: toast.entry.message,
      userFriendlyMessage: toast.entry.userFriendlyMessage,
      details: toast.entry.details,
      stack: toast.entry.stack
    }, null, 2);

    navigator.clipboard.writeText(payload);
    setToasts(prev => prev.map(t => t.id === toast.id ? { ...t, copied: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === toast.id ? { ...t, copied: false } : t));
    }, 2000);
  };

  if (toasts.length === 0) return null;

  return (
    <aside 
      aria-label="Powiadomienia systemowe Nexusa"
      className="fixed bottom-5 right-5 z-[99999] flex flex-col gap-2.5 max-w-md w-[calc(100vw-2.5rem)] pointer-events-auto"
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; }}
    >
      {toasts.map(toast => {
        const { entry, isExpanded, copied } = toast;
        const isFatal = entry.level === 'FATAL';
        const isError = entry.level === 'ERROR';
        const isWarn = entry.level === 'WARN';

        // Kolorystyka i obramowanie w zależności od poziomu błędu
        const borderStyle = isFatal 
          ? 'border-red-500 bg-red-950/90 text-red-100 shadow-red-900/30' 
          : isError 
            ? 'border-rose-500/80 bg-slate-950/95 text-rose-100 shadow-rose-950/40' 
            : 'border-amber-500/70 bg-slate-950/95 text-amber-100 shadow-amber-950/40';

        const iconColor = isFatal 
          ? 'text-red-400' 
          : isError 
            ? 'text-rose-400' 
            : 'text-amber-400';

        return (
          <div
            key={toast.id}
            className={`p-3.5 sm:p-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform translate-y-0 ${borderStyle}`}
          >
            <div className="flex items-start justify-between gap-3">
              {/* Ikona i Status */}
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <div className="mt-0.5 shrink-0">
                  {isFatal ? (
                    <ShieldAlert className={`w-5 h-5 ${iconColor} animate-pulse`} />
                  ) : isError ? (
                    <AlertTriangle className={`w-5 h-5 ${iconColor}`} />
                  ) : (
                    <Info className={`w-5 h-5 ${iconColor}`} />
                  )}
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/10 text-white">
                      {entry.category}:{entry.module}
                    </span>
                    <span className={`font-mono text-[10px] font-bold ${iconColor}`}>
                      [{entry.level}]
                    </span>
                    {(entry.count && entry.count > 1) && (
                      <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[9px] font-bold">
                        x{entry.count}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-sans font-medium text-white/95 leading-snug break-words">
                    {entry.userFriendlyMessage || entry.message}
                  </p>
                </div>
              </div>

              {/* Zamknij */}
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="text-white/60 hover:text-white p-1 rounded hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                title="Zamknij powiadomienie"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Rozwinięcie szczegółów */}
            {isExpanded && (
              <div className="mt-2.5 pt-2.5 border-t border-white/15 font-mono text-[10px] space-y-2 select-text">
                <div className="text-white/70 break-all bg-black/50 p-2 rounded border border-white/10">
                  <div className="text-cyan-300 font-bold mb-1">RAW MESSAGE:</div>
                  <div>{entry.message}</div>
                  {entry.stack && (
                    <div className="mt-1.5 text-slate-400 max-h-24 overflow-y-auto whitespace-pre-wrap text-[9px]">
                      {entry.stack}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dolny pasek akcji */}
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => toggleExpand(toast.id)}
                className="text-white/70 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Terminal className="w-3 h-3 text-cyan-400" />
                <span>{isExpanded ? 'ZWIŃ KOD' : 'SZCZEGÓŁY TECHNICZNE'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyToastDetails(toast)}
                  className="text-cyan-300 hover:text-cyan-100 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Kopiuj JSON diagnostyczny"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'SKOPIOWANO' : 'KOPIUJ'}</span>
                </button>

                {onOpenDiagnostics && (
                  <button
                    type="button"
                    onClick={() => {
                      dismissToast(toast.id);
                      onOpenDiagnostics();
                    }}
                    className="text-amber-300 hover:text-amber-100 flex items-center gap-1 font-bold cursor-pointer transition-colors"
                  >
                    <Activity className="w-3 h-3" />
                    <span>KONSOLA DIAGNOSTYCZNA</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </aside>
  );
};
