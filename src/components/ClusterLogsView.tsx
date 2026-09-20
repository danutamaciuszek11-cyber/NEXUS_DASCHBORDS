import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Terminal,
  Activity,
  Radio,
  Cpu,
  Server,
  Play,
  Pause,
  Download,
  Trash2,
  Search,
  ArrowDown,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Layers,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Zap,
} from 'lucide-react';
import { ClusterLogEntry, ClusterType, LogLevel } from '../types';
import { nexusBus } from '../nexus/bridges/nexus-bus';

export const ClusterLogsView: React.FC = () => {
  const [logs, setLogs] = useState<ClusterLogEntry[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);
  const [dispatchLoading, setDispatchLoading] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Fetch logs from API
  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/cluster/logs?limit=250');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data.logs)) {
          setLogs((prev) => {
            const existingIds = new Set(prev.map((l) => l.id));
            const newItems = data.logs.filter((l: ClusterLogEntry) => !existingIds.has(l.id));
            if (newItems.length === 0) return prev;
            return [...newItems, ...prev].slice(0, 300);
          });
        }
      }
    } catch {
      // Ignore network errors in background
    }
  };

  // Initial fetch and polling when streaming is active
  useEffect(() => {
    fetchLogs();
    if (!isStreaming) return;

    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, [isStreaming]);

  // Subscribe to live Nexus Bus event pulses
  useEffect(() => {
    const unsubscribe = nexusBus.subscribe('*', (pulse) => {
      if (!isStreaming) return;

      const cluster: ClusterType =
        pulse.nodeSource?.includes('SYNAPSE') || pulse.nodeSource === 'SynapseMesh'
          ? 'Synapse Mesh'
          : pulse.nodeSource?.includes('QCICD')
          ? 'Quantum CI/CD'
          : 'System Kernel';

      const newEntry: ClusterLogEntry = {
        id: pulse.id || `BUS-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: pulse.timestamp || new Date().toISOString(),
        cluster,
        nodeId: pulse.nodeSource || 'SYNAPSE-BUS',
        level: 'TRACE',
        stage: 'EVENT_PULSE',
        message: `Bus Event: [${pulse.event}] dispatched across cluster mesh`,
        details: pulse.data,
        durationMs: 0.9,
      };

      setLogs((prev) => [newEntry, ...prev.slice(0, 299)]);
    });

    return () => unsubscribe();
  }, [isStreaming]);

  // Auto-scroll when new logs arrive if enabled
  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // Dispatch synthetic event to cluster
  const handleDispatchTask = async (cluster: 'Synapse Mesh' | 'Quantum CI/CD') => {
    setDispatchLoading(true);
    try {
      const res = await fetch('/api/cluster/logs/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cluster,
          action: cluster === 'Quantum CI/CD' ? 'TRIGGER_PIPELINE_STEP' : 'PULSE_TASK_ROUTING',
          details: { initiatedBy: 'Biooperator_Architekt', timestamp: new Date().toISOString() },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.log) {
          setLogs((prev) => [data.log, ...prev]);
        }
      }
    } catch (err: any) {
      console.error('Failed to dispatch test task', err);
    } finally {
      setDispatchLoading(false);
    }
  };

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedCluster !== 'ALL' && log.cluster !== selectedCluster) {
        return false;
      }
      if (selectedLevel !== 'ALL' && log.level !== selectedLevel) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const msg = (log.message || '').toLowerCase();
        const node = (log.nodeId || '').toLowerCase();
        const stage = (log.stage || '').toLowerCase();
        const cluster = (log.cluster || '').toLowerCase();
        return msg.includes(q) || node.includes(q) || stage.includes(q) || cluster.includes(q);
      }
      return true;
    });
  }, [logs, selectedCluster, selectedLevel, searchQuery]);

  // Copy single log
  const handleCopyLog = (log: ClusterLogEntry) => {
    const text = `[${log.timestamp}] [${log.level}] [${log.cluster}] [${log.nodeId || 'N/A'}] ${log.message}`;
    navigator.clipboard.writeText(text);
    setCopiedLogId(log.id);
    setTimeout(() => setCopiedLogId(null), 2000);
  };

  // Export current filtered logs to JSON
  const handleExportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-cluster-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice('Pobrano plik JSON z logami klastra.');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const levelBadgeClasses = (level: LogLevel) => {
    switch (level) {
      case 'SUCCESS':
        return 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300';
      case 'INFO':
        return 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300';
      case 'WARN':
        return 'bg-amber-950/80 border-amber-500/40 text-amber-300';
      case 'ERROR':
        return 'bg-rose-950/80 border-rose-500/40 text-rose-300';
      case 'TRACE':
        return 'bg-purple-950/80 border-purple-500/40 text-purple-300';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const clusterBadgeClasses = (cluster: ClusterType) => {
    switch (cluster) {
      case 'Synapse Mesh':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Quantum CI/CD':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Agent Sandbox':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'System Kernel':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  // Metrics calculations
  const errorCount = logs.filter((l) => l.level === 'ERROR').length;
  const warnCount = logs.filter((l) => l.level === 'WARN').length;
  const successCount = logs.filter((l) => l.level === 'SUCCESS').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="nx-glass-card rounded-2xl p-5 md:p-6 border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-sans">
                Strumień Logów Klastrów (Cluster Logs Stream)
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-[11px] font-mono font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {isStreaming ? 'LIVE STREAM' : 'STRUMIEŃ WSTRZYMANY'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Telemetria zdarzeń w czasie rzeczywistym dla Synapse Mesh (24 mikrowęzły) i Quantum CI/CD (16 instancji).
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 border transition-all ${
              isStreaming
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Wstrzymaj</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Wznów</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleDispatchTask('Synapse Mesh')}
            disabled={dispatchLoading}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Wyślij zadanie testowe przez router Synapse Mesh"
          >
            <Server className="w-3.5 h-3.5" />
            <span>Impuls Synapse</span>
          </button>

          <button
            onClick={() => handleDispatchTask('Quantum CI/CD')}
            disabled={dispatchLoading}
            className="px-3.5 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Wygeneruj zdarzenie pipeline Quantum CI/CD"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Krok CI/CD</span>
          </button>

          <button
            onClick={() => handleExportLogs()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Pobierz aktualną listę logów jako plik JSON"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Eksportuj</span>
          </button>

          <button
            onClick={() => handleClearLogs()}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-700 text-slate-400 text-xs transition-colors"
            title="Wyczyść bufor logów"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="nx-glass-card rounded-xl p-3.5 border border-slate-800 bg-slate-900/60">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Przechwycone Zdarzenia</div>
          <div className="text-lg font-bold font-mono text-white mt-1 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>{logs.length}</span>
            <span className="text-xs text-slate-500 font-normal">wpisów</span>
          </div>
        </div>

        <div className="nx-glass-card rounded-xl p-3.5 border border-slate-800 bg-slate-900/60">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Asercje / Sukcesy</div>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>{successCount}</span>
            <span className="text-xs text-slate-500 font-normal">zweryfikowano</span>
          </div>
        </div>

        <div className="nx-glass-card rounded-xl p-3.5 border border-slate-800 bg-slate-900/60">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Ostrzeżenia & Tarcza</div>
          <div className="text-lg font-bold font-mono text-amber-400 mt-1 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{warnCount}</span>
            <span className="text-xs text-slate-500 font-normal">neutralizacji</span>
          </div>
        </div>

        <div className="nx-glass-card rounded-xl p-3.5 border border-slate-800 bg-slate-900/60">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Krytyczne Błędy</div>
          <div className="text-lg font-bold font-mono text-rose-400 mt-1 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            <span>{errorCount}</span>
            <span className="text-xs text-slate-500 font-normal">{errorCount === 0 ? 'optymalny' : 'wymaga uwagi'}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="nx-glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-[280px]">
          {/* Cluster filter */}
          <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-xl p-1 text-xs font-mono">
            {['ALL', 'Synapse Mesh', 'Quantum CI/CD', 'Agent Sandbox'].map((cl) => (
              <button
                key={cl}
                onClick={() => setSelectedCluster(cl)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedCluster === cl
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cl === 'ALL' ? 'Wszystkie Klastry' : cl}
              </button>
            ))}
          </div>

          {/* Level filter */}
          <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-xl p-1 text-xs font-mono">
            {['ALL', 'INFO', 'SUCCESS', 'WARN', 'ERROR', 'TRACE'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Search bar & Auto-scroll toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filtruj (np. NODE-12, PIPELINE)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-colors ${
              autoScroll
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Automatyczne przewijanie na dół okna"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auto-scroll</span>
          </button>
        </div>
      </div>

      {/* Terminal View */}
      <div className="rounded-2xl border border-slate-800 bg-[#060812] shadow-2xl overflow-hidden font-mono text-xs">
        {/* Terminal Header Window Chrome */}
        <div className="px-4 py-3 bg-[#0a0d1a] border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[11px] text-slate-400 font-mono ml-2">
              nexus-cluster.log • tail -n {filteredLogs.length}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <span>Widocznych: {filteredLogs.length} z {logs.length}</span>
            <span className="text-cyan-400 font-semibold">BUF: OK</span>
          </div>
        </div>

        {/* Terminal Content Stream */}
        <div
          ref={terminalContainerRef}
          className="p-4 space-y-1.5 max-h-[620px] overflow-y-auto divide-y divide-slate-900/60"
        >
          {filteredLogs.length === 0 ? (
            <div className="text-center py-16 text-slate-500 space-y-2">
              <Activity className="w-8 h-8 mx-auto text-slate-600 animate-pulse" />
              <p>Brak logów pasujących do wybranych kryteriów filtrowania.</p>
              <button
                onClick={() => {
                  setSelectedCluster('ALL');
                  setSelectedLevel('ALL');
                  setSearchQuery('');
                }}
                className="text-xs text-cyan-400 hover:underline"
              >
                Zresetuj filtry
              </button>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              const hasDetails = log.details && Object.keys(log.details).length > 0;

              return (
                <div
                  key={log.id}
                  className="pt-1.5 pb-1 px-2 rounded-lg hover:bg-slate-900/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap flex-1">
                      {/* Expand toggle */}
                      {hasDetails ? (
                        <button
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="p-0.5 text-slate-500 hover:text-cyan-400 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                      ) : (
                        <span className="w-3.5 inline-block" />
                      )}

                      {/* Timestamp */}
                      <span className="text-slate-500 text-[11px] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString('pl-PL', {
                          hour12: false,
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                        .{new Date(log.timestamp).getMilliseconds().toString().padStart(3, '0')}
                      </span>

                      {/* Level Badge */}
                      <span
                        className={`px-1.5 py-0.2 rounded border text-[10px] font-bold ${levelBadgeClasses(
                          log.level
                        )}`}
                      >
                        {log.level}
                      </span>

                      {/* Cluster Badge */}
                      <span
                        className={`px-1.5 py-0.2 rounded border text-[10px] font-semibold ${clusterBadgeClasses(
                          log.cluster
                        )}`}
                      >
                        {log.cluster}
                      </span>

                      {/* Node ID */}
                      {log.nodeId && (
                        <span className="text-cyan-400 font-bold text-[11px] bg-cyan-950/40 px-1 rounded border border-cyan-900/40">
                          {log.nodeId}
                        </span>
                      )}

                      {/* Stage Pill */}
                      {log.stage && (
                        <span className="text-slate-400 text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded">
                          {log.stage}
                        </span>
                      )}

                      {/* Message */}
                      <span className="text-slate-200 text-xs break-all flex-1">
                        {log.message}
                      </span>
                    </div>

                    {/* Right side: duration & copy button */}
                    <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      {log.durationMs !== undefined && (
                        <span className="text-[10px] text-slate-500">
                          {log.durationMs}ms
                        </span>
                      )}

                      <button
                        onClick={() => handleCopyLog(log)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                        title="Skopiuj log"
                      >
                        {copiedLogId === log.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded JSON Details View */}
                  {isExpanded && hasDetails && (
                    <div className="mt-2 ml-6 p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto space-y-1">
                      <div className="text-[10px] text-cyan-400 font-bold uppercase">Szczegóły zdarzenia (Payload):</div>
                      <pre className="text-slate-300">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
};
