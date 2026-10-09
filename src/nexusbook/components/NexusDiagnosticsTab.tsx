import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  Bug, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Search, 
  Filter, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  Zap,
  Play
} from 'lucide-react';
import { nexusLogger } from '../services/loggerService';
import { NexusLogEntry, LogLevel, LogCategory, LoggerStats } from '../types';
import { soundFx } from '../utils/audioSystem';

export const NexusDiagnosticsTab: React.FC = () => {
  const [logs, setLogs] = useState<NexusLogEntry[]>([]);
  const [stats, setStats] = useState<LoggerStats>(() => nexusLogger.getStats());
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'ALL' | 'ERROR_AND_FATAL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<LogCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Odświeżanie logów z bufora serwisu
  const refreshLogs = () => {
    setLogs(nexusLogger.getLogs({
      level: selectedLevel,
      category: selectedCategory,
      searchTerm
    }));
    setStats(nexusLogger.getStats());
  };

  useEffect(() => {
    refreshLogs();
    // Subskrypcja nowych zdarzeń w czasie rzeczywistym
    const unsubscribe = nexusLogger.subscribe(() => {
      refreshLogs();
    });
    return () => unsubscribe();
  }, [selectedLevel, selectedCategory, searchTerm]);

  const handleCopySingle = (entry: NexusLogEntry) => {
    soundFx.playClick();
    navigator.clipboard.writeText(JSON.stringify(entry, null, 2));
    setCopiedLogId(entry.id);
    setTimeout(() => setCopiedLogId(null), 2000);
  };

  const handleCopyAll = () => {
    soundFx.playSuccess();
    navigator.clipboard.writeText(nexusLogger.exportAsJson());
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleClear = () => {
    if (confirm('Czy na pewno chcesz wyczyścić bufor telemetrii i dziennik awarii?')) {
      soundFx.playDelete();
      nexusLogger.clearLogs();
      refreshLogs();
    }
  };

  const handleTriggerProbe = (type: 'warn' | 'error' | 'fatal') => {
    soundFx.playClick();
    nexusLogger.triggerDiagnosticProbe(type);
    refreshLogs();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150 font-mono text-xs">
      
      {/* 1. Header Metrics Card */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between">
          <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Wszystkie Logi</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-black text-white">{stats.totalLogs}</span>
            <span className="text-[10px] text-white/40">wpisów</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 flex flex-col justify-between">
          <span className="text-[10px] text-red-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> Błędy & Fatal
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-black text-red-300">{stats.errorCount + stats.fatalCount}</span>
            <span className="text-[10px] text-red-400/60">krytycznych</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex flex-col justify-between">
          <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Ostrzeżenia
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-black text-amber-300">{stats.warnCount}</span>
            <span className="text-[10px] text-amber-400/60">uwag</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex flex-col justify-between">
          <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <Info className="w-3 h-3" /> Informacyjne
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-black text-cyan-300">{stats.infoCount}</span>
            <span className="text-[10px] text-cyan-400/60">zdarzeń</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <Bug className="w-3 h-3" /> Debug
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-black text-slate-300">{stats.debugCount}</span>
            <span className="text-[10px] text-slate-500">śladów</span>
          </div>
        </div>
      </div>

      {/* 2. Controls & Actions Toolbar */}
      <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/10 space-y-3">
        
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white text-xs tracking-wider uppercase">
              REJESTRATOR BŁĘDÓW I TELEMETRII
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Sonda diagnostyczna do testów */}
            <div className="flex items-center rounded-lg border border-white/15 bg-black/40 p-0.5">
              <span className="text-[10px] text-white/40 px-2 py-0.5 hidden sm:inline">PROBA:</span>
              <button
                type="button"
                onClick={() => handleTriggerProbe('warn')}
                className="px-2 py-1 rounded text-[10px] text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
                title="Wyślij testowe ostrzeżenie"
              >
                +Warn
              </button>
              <button
                type="button"
                onClick={() => handleTriggerProbe('error')}
                className="px-2 py-1 rounded text-[10px] text-red-300 hover:bg-red-500/20 font-bold transition-all cursor-pointer"
                title="Wyślij testowy błąd"
              >
                +Error
              </button>
              <button
                type="button"
                onClick={() => handleTriggerProbe('fatal')}
                className="px-2 py-1 rounded text-[10px] text-rose-200 bg-rose-950/60 hover:bg-rose-900/80 font-bold transition-all cursor-pointer"
                title="Wyślij testowy błąd krytyczny (Fatal)"
              >
                +Fatal
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyAll}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              title="Kopiuj wszystkie logi w formacie JSON"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'SKOPIOWANO' : 'KOPIUJ JSON'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playExport();
                nexusLogger.downloadLogsAsFile();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Pobierz plik diagnostyczny JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>POBIERZ .JSON</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-950/60 text-white/50 hover:text-red-400 border border-white/10 transition-all cursor-pointer"
              title="Wyczyść wszystkie logi"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-white/10">
          
          {/* Level Filter Buttons */}
          <div className="sm:col-span-6 flex flex-wrap gap-1 items-center">
            {(['ALL', 'ERROR_AND_FATAL', 'WARN', 'INFO', 'DEBUG'] as const).map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setSelectedLevel(lvl);
                }}
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? lvl === 'ERROR_AND_FATAL'
                      ? 'bg-red-500 text-white shadow-sm'
                      : lvl === 'WARN'
                        ? 'bg-amber-500 text-black shadow-sm'
                        : lvl === 'INFO'
                          ? 'bg-cyan-500 text-black shadow-sm'
                          : lvl === 'DEBUG'
                            ? 'bg-slate-600 text-white'
                            : 'bg-emerald-500 text-black shadow-sm'
                    : 'bg-black/40 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {lvl === 'ALL' ? 'WSZYSTKIE' : lvl === 'ERROR_AND_FATAL' ? 'BŁĘDY & FATAL' : lvl}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={e => {
                soundFx.playClick();
                setSelectedCategory(e.target.value as any);
              }}
              className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1 text-white text-[11px] font-mono focus:border-cyan-400 outline-none cursor-pointer"
            >
              <option value="ALL">Kategoria: WSZYSTKIE</option>
              <option value="CORE">CORE (Rdzeń)</option>
              <option value="UI">UI (Interfejs)</option>
              <option value="AUTH">AUTH (Autoryzacja)</option>
              <option value="STORAGE">STORAGE (Pamięć)</option>
              <option value="NETWORK">NETWORK (Sieć)</option>
              <option value="AUDIO">AUDIO (Dźwięk)</option>
              <option value="AI">AI (Modele & Agenty)</option>
              <option value="BLOCKCHAIN">BLOCKCHAIN (Węzły)</option>
              <option value="EDITORIAL">EDITORIAL (Wydawnictwo)</option>
              <option value="SYSTEM">SYSTEM (Przeglądarka)</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="sm:col-span-3 relative">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Szukaj w logach..."
              className="w-full bg-black/60 border border-white/15 rounded-lg pl-8 pr-2.5 py-1 text-white text-[11px] font-mono placeholder:text-white/30 focus:border-cyan-400 outline-none"
            />
          </div>

        </div>
      </div>

      {/* 3. Logs List View */}
      <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden divide-y divide-white/5 max-h-[420px] overflow-y-auto custom-scrollbar">
        {logs.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Activity className="w-8 h-8 text-white/20 mx-auto" />
            <div className="text-white/40 text-xs">Brak logów odpowiadających wybranym filtrom.</div>
            <div className="text-white/20 text-[10px]">Wszystkie podsystemy pracują prawidłowo.</div>
          </div>
        ) : (
          logs.map(log => {
            const isExpanded = expandedLogId === log.id;
            const isCopied = copiedLogId === log.id;
            const isFatal = log.level === 'FATAL';
            const isError = log.level === 'ERROR';
            const isWarn = log.level === 'WARN';
            const isInfo = log.level === 'INFO';

            const badgeBg = isFatal
              ? 'bg-red-950 text-red-300 border border-red-500/60'
              : isError
                ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                : isWarn
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                  : isInfo
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border border-white/10';

            return (
              <div
                key={log.id}
                className={`p-3 transition-colors ${
                  isFatal
                    ? 'bg-red-950/20 hover:bg-red-950/30'
                    : isError
                      ? 'bg-rose-950/10 hover:bg-rose-950/20'
                      : isWarn
                        ? 'bg-amber-950/10 hover:bg-amber-950/20'
                        : 'hover:bg-white/5'
                }`}
              >
                {/* Single Log Row */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${badgeBg}`}>
                      {log.level}
                    </span>

                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-white/50 text-[9px] border border-white/5 shrink-0">
                      {log.category}:{log.module}
                    </span>

                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="text-white text-xs leading-snug break-words">
                        {log.userFriendlyMessage || log.message}
                      </div>
                      {log.userFriendlyMessage && log.userFriendlyMessage !== log.message && (
                        <div className="text-[10px] text-white/40 truncate">
                          Techniczny: {log.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {log.count && log.count > 1 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[9px] font-bold">
                        x{log.count}
                      </span>
                    )}

                    <span className="text-[10px] text-white/40">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopySingle(log)}
                      className="p-1 text-white/40 hover:text-cyan-300 transition-colors cursor-pointer"
                      title="Kopiuj wpis JSON"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
                      title="Szczegóły techniczne"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="mt-2.5 pt-2.5 border-t border-white/10 space-y-2 text-[10px] select-text">
                    <div className="bg-black/60 p-2.5 rounded-lg border border-white/10 space-y-1.5 overflow-x-auto">
                      <div>
                        <span className="text-white/40 uppercase font-bold">ID:</span>{' '}
                        <span className="text-cyan-300">{log.id}</span>
                      </div>
                      <div>
                        <span className="text-white/40 uppercase font-bold">CZAS:</span>{' '}
                        <span className="text-white/70">{new Date(log.timestamp).toISOString()}</span>
                      </div>
                      <div>
                        <span className="text-white/40 uppercase font-bold">URL:</span>{' '}
                        <span className="text-white/70">{log.url || '/'}</span>
                      </div>
                      <div>
                        <span className="text-white/40 uppercase font-bold">KOMUNIKAT:</span>{' '}
                        <span className="text-white">{log.message}</span>
                      </div>

                      {log.details && (
                        <div>
                          <span className="text-white/40 uppercase font-bold block mb-0.5">DETAILS:</span>
                          <pre className="text-amber-200/90 whitespace-pre-wrap text-[9px] bg-black/40 p-1.5 rounded">
                            {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      )}

                      {log.stack && (
                        <div>
                          <span className="text-red-400 uppercase font-bold block mb-0.5">STACK TRACE:</span>
                          <pre className="text-red-300/80 whitespace-pre-wrap text-[9px] bg-black/40 p-1.5 rounded max-h-36 overflow-y-auto">
                            {log.stack}
                          </pre>
                        </div>
                      )}

                      {log.componentStack && (
                        <div>
                          <span className="text-cyan-400 uppercase font-bold block mb-0.5">COMPONENT STACK:</span>
                          <pre className="text-cyan-200/80 whitespace-pre-wrap text-[9px] bg-black/40 p-1.5 rounded max-h-36 overflow-y-auto">
                            {log.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info Notice */}
      <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5 text-[11px] text-white/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Wszystkie krytyczne błędy są automatycznie archiwizowane w lokalnej pamięci podręcznej powypadkowej.</span>
        </div>
        <span className="text-white/30 hidden sm:inline">NEXUS TELEMETRY v2.4</span>
      </div>

    </div>
  );
};
