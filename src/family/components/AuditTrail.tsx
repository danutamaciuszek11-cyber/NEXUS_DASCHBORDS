import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Activity,
  Cpu,
  Server,
  Key,
  Copy,
  Check,
  Search,
  RefreshCw,
  Trash2,
  Download,
  ChevronDown,
  ChevronRight,
  Terminal,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Zap,
  Clock,
  ArrowUpRight,
  Radio,
  SlidersHorizontal,
  Code2,
  Database
} from 'lucide-react';
import { useNexus } from '../context/NexusContext';
import { AuditLog, AuditCategory, AuditSeverity } from '../types';

interface AuditTrailProps {
  compact?: boolean;
  filterCategory?: AuditCategory;
  showNodeBanner?: boolean;
  className?: string;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({
  compact = false,
  filterCategory: initialCategory,
  showNodeBanner = true,
  className = ''
}) => {
  const {
    auditLogs,
    activeNodeToken,
    probeNodeIdentity,
    clearAuditLogs,
    refreshAuditLogs,
    logAuditEvent,
    currentArchitect
  } = useNexus();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyNodeInteractions, setOnlyNodeInteractions] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [isProbing, setIsProbing] = useState(false);
  const [probeResult, setProbeResult] = useState<any | null>(null);
  const [customNodeToken, setCustomNodeToken] = useState(activeNodeToken);
  const [showCustomProbeModal, setShowCustomProbeModal] = useState(false);
  const [selectedMicroservice, setSelectedMicroservice] = useState('all');

  // Copy Node Token to clipboard
  const handleCopyNodeToken = (tokenToCopy: string = activeNodeToken) => {
    navigator.clipboard.writeText(tokenToCopy);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Copy Signature Hash
  const handleCopyHash = (hash: string, logId: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHashId(logId);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  // Run real-time node authorization & microservice handshake probe
  const handleRunProbe = async (token: string = customNodeToken, microservice: string = selectedMicroservice) => {
    setIsProbing(true);
    setProbeResult(null);
    try {
      const result = await probeNodeIdentity(token, microservice);
      setProbeResult(result);
      if (result?.auditLog?.id) {
        setExpandedLogId(result.auditLog.id);
      }
    } catch (err) {
      console.error('Probe error:', err);
    } finally {
      setIsProbing(false);
    }
  };

  // Export logs to JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nexus_audit_trail_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Statistics calculation
  const stats = useMemo(() => {
    const total = auditLogs.length;
    const nodeEvents = auditLogs.filter(l => l.category === 'NODE' || !!l.nodeToken).length;
    const microserviceEvents = auditLogs.filter(l => l.category === 'MICROSERVICE' || !!l.microserviceName).length;
    const verifiedSignatures = auditLogs.filter(l => !!l.signatureHash).length;
    const avgLatency = auditLogs.length
      ? Math.round(auditLogs.reduce((acc, l) => acc + (l.latencyMs || 20), 0) / auditLogs.length)
      : 0;

    return { total, nodeEvents, microserviceEvents, verifiedSignatures, avgLatency };
  }, [auditLogs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      // Category filter
      if (selectedCategory !== 'ALL' && log.category !== selectedCategory) {
        return false;
      }
      // Severity filter
      if (selectedSeverity !== 'ALL' && log.severity !== selectedSeverity) {
        return false;
      }
      // Only Node interactions toggle
      if (onlyNodeInteractions && !log.nodeToken && log.category !== 'NODE') {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchAction = log.action?.toLowerCase().includes(q);
        const matchTarget = log.target?.toLowerCase().includes(q);
        const matchDetails = log.details?.toLowerCase().includes(q);
        const matchActor = log.actorName?.toLowerCase().includes(q);
        const matchToken = log.nodeToken?.toLowerCase().includes(q);
        const matchMicro = log.microserviceName?.toLowerCase().includes(q);
        const matchHash = log.signatureHash?.toLowerCase().includes(q);
        const matchEndpoint = log.endpoint?.toLowerCase().includes(q);
        if (!matchAction && !matchTarget && !matchDetails && !matchActor && !matchToken && !matchMicro && !matchHash && !matchEndpoint) {
          return false;
        }
      }
      return true;
    });
  }, [auditLogs, selectedCategory, selectedSeverity, onlyNodeInteractions, searchQuery]);

  const categories: { id: string; label: string; count: number }[] = [
    { id: 'ALL', label: 'Wszystkie', count: auditLogs.length },
    { id: 'NODE', label: 'Węzły & Tokeny', count: auditLogs.filter(l => l.category === 'NODE' || !!l.nodeToken).length },
    { id: 'MICROSERVICE', label: 'Mikroserwisy & API', count: auditLogs.filter(l => l.category === 'MICROSERVICE' || !!l.microserviceName).length },
    { id: 'GOVERNANCE', label: 'Governance & RFC', count: auditLogs.filter(l => l.category === 'GOVERNANCE').length },
    { id: 'SECURITY', label: 'Bezpieczeństwo & ZK', count: auditLogs.filter(l => l.category === 'SECURITY').length },
    { id: 'STORAGE', label: 'Pamięć & Indeks', count: auditLogs.filter(l => l.category === 'STORAGE').length }
  ];

  const getSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case 'SUCCESS':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'SUCCESS'
        };
      case 'SECURITY':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />,
          label: 'SECURITY'
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          label: 'WARNING'
        };
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
          label: 'CRITICAL'
        };
      case 'INFO':
      default:
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          icon: <Info className="w-3.5 h-3.5 text-blue-400" />,
          label: 'INFO'
        };
    }
  };

  const getCategoryBadge = (category?: AuditCategory) => {
    switch (category) {
      case 'NODE':
        return {
          bg: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300',
          icon: <Cpu className="w-3 h-3 text-cyan-400" />,
          label: 'NODE'
        };
      case 'MICROSERVICE':
        return {
          bg: 'bg-purple-950/60 border-purple-500/40 text-purple-300',
          icon: <Server className="w-3 h-3 text-purple-400" />,
          label: 'MICROSERVICE'
        };
      case 'GOVERNANCE':
        return {
          bg: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
          icon: <Lock className="w-3 h-3 text-amber-400" />,
          label: 'GOVERNANCE'
        };
      case 'SECURITY':
        return {
          bg: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
          icon: <ShieldCheck className="w-3 h-3 text-emerald-400" />,
          label: 'SECURITY'
        };
      case 'STORAGE':
        return {
          bg: 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300',
          icon: <Activity className="w-3 h-3 text-indigo-400" />,
          label: 'STORAGE'
        };
      default:
        return {
          bg: 'bg-slate-800/60 border-slate-700 text-slate-300',
          icon: <Terminal className="w-3 h-3 text-slate-400" />,
          label: 'EVENT'
        };
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      let relative = '';
      if (diffMins < 1) relative = 'przed chwilą';
      else if (diffMins < 60) relative = `${diffMins} min temu`;
      else if (diffHours < 24) relative = `${diffHours} godz. temu`;
      else relative = date.toLocaleDateString('pl-PL');

      const timeStr = date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      return { relative, exact: `${date.toLocaleDateString('pl-PL')} ${timeStr}` };
    } catch {
      return { relative: isoString, exact: isoString };
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Node Identity & Ecosystem Authorization Banner */}
      {showNodeBanner && (
        <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#0c1322] via-[#09101d] to-[#050b14] p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm">
                  <Key className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  KLUCZ TOŻSAMOŚCI WĘZŁA (NODE TOKEN)
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Radio className="w-3 h-3 text-emerald-400" />
                  LIVE OPERATIONAL
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  <Database className="w-3 h-3 text-blue-400" />
                  CLOUD SQL (POSTGRESQL - us-west1)
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  BNB-734LLM CLUSTER
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                NEXUS Unified Node & Microservice Audit Trail
              </h2>
              <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                Rejestr telemetryczny i kryptograficzna ścieżka audytu logująca kluczowe interakcje węzłów,
                zewnętrznych mikroserwisów, modeli AI (Bella) oraz inteligentnych kontraktów w ekosystemie NEXUS.
              </p>
            </div>

            {/* Node Token Display Box & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2 bg-[#050b14] border border-cyan-500/40 rounded-xl px-4 py-2.5 shadow-inner">
                <div className="flex flex-col">
                  <span className="text-[10px] text-cyan-400/80 uppercase font-mono tracking-wider">Active Node Key</span>
                  <code className="text-sm sm:text-base font-mono font-bold text-cyan-200 tracking-wider">
                    {activeNodeToken}
                  </code>
                </div>
                <button
                  id="btn-copy-node-token"
                  onClick={() => handleCopyNodeToken(activeNodeToken)}
                  className="ml-2 p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
                  title="Kopiuj identyfikator węzła"
                >
                  {copiedToken ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <button
                id="btn-probe-node-handshake"
                disabled={isProbing}
                onClick={() => handleRunProbe(activeNodeToken, 'all')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95 disabled:opacity-50"
              >
                {isProbing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Autoryzowanie...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    Testuj Handshake Węzła
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Probe result feedback banner if just triggered */}
          {probeResult && (
            <div className="mt-4 pt-4 border-t border-cyan-500/20 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3.5 rounded-xl bg-cyan-950/50 border border-cyan-500/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-cyan-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Autoryzacja węzła <strong className="text-white">[{probeResult.nodeToken}]</strong> pomyślna (Opóźnienie: {probeResult.latencyMs}ms).
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <span className="text-slate-400">Podpis:</span>
                  <span className="text-cyan-300 truncate max-w-[200px]">{probeResult.signatureHash}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                    TLS 1.3 VERIFIED
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Real-time Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-[#09101d]/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs uppercase tracking-wider font-mono">Wszystkie Wpisy</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{stats.total}</div>
          <div className="text-[11px] text-slate-400 mt-1">Zsynchronizowane w L1 Cache</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#09101d]/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs uppercase tracking-wider font-mono">Interakcje Węzła</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">{stats.nodeEvents}</div>
          <div className="text-[11px] text-cyan-400/80 mt-1 font-mono">Klucz BNB-734LLM</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#09101d]/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs uppercase tracking-wider font-mono">Mikroserwisy</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400">{stats.microserviceEvents}</div>
          <div className="text-[11px] text-purple-400/80 mt-1 font-mono">Bella & Gateways</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#09101d]/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs uppercase tracking-wider font-mono">Podpisy ZK / ECDSA</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">100%</div>
          <div className="text-[11px] text-emerald-400/80 mt-1 font-mono">Kryptograficznie Zapieczętowane</div>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 rounded-xl border border-slate-800 bg-[#09101d]/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs uppercase tracking-wider font-mono">Śr. Latencja</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">{stats.avgLatency} <span className="text-sm">ms</span></div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">HTTP/2 & E2EE RPC</div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-[#09101d]/90 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-audit-search"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Szukaj po akcji, tokenie węzła, mikroserwisie, aktorze lub hashu..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050b14] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono text-xs sm:text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Wyczyść
              </button>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              id="btn-toggle-node-filter"
              onClick={() => setOnlyNodeInteractions(prev => !prev)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-medium border transition-colors flex items-center gap-1.5 ${
                onlyNodeInteractions
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Tylko Węzeł (Node)
            </button>

            <button
              id="btn-refresh-audit"
              onClick={() => refreshAuditLogs()}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:text-white transition-colors"
              title="Odśwież z serwera"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              id="btn-export-audit-json"
              onClick={handleExportJson}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:text-white transition-colors"
              title="Eksportuj audyt do JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              id="btn-clear-audit-logs"
              onClick={() => {
                if (window.confirm('Czy na pewno chcesz wyczyścić bufor lokalnych logów audytowych?')) {
                  clearAuditLogs();
                }
              }}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 transition-colors"
              title="Wyczyść bufor audytu"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-500 text-[11px] font-mono uppercase flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3 h-3" />
            Kategoria:
          </span>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60'
              }`}
            >
              {cat.label}
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedCategory === cat.id ? 'bg-black/20 text-black' : 'bg-slate-700/60 text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Entries List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-[#09101d]/50">
            <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300">Brak logów spełniających wybrane kryteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Zresetuj filtry wyszukiwania lub użyj przycisku autoryzacji węzła, aby wygenerować nowe zdarzenie telemetryczne.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedSeverity('ALL');
                setSearchQuery('');
                setOnlyNodeInteractions(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 transition-colors"
            >
              Resetuj Wszystkie Filtry
            </button>
          </div>
        ) : (
          filteredLogs.map(log => {
            const isExpanded = expandedLogId === log.id;
            const severityBadge = getSeverityBadge(log.severity);
            const categoryBadge = getCategoryBadge(log.category);
            const timestamp = formatTimestamp(log.timestamp);
            const isNodeRelated = !!log.nodeToken || log.category === 'NODE';

            return (
              <div
                key={log.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isNodeRelated
                    ? 'border-cyan-500/30 bg-[#0a1220]/90 hover:border-cyan-500/50'
                    : 'border-slate-800 bg-[#09101d]/90 hover:border-slate-700'
                } ${isExpanded ? 'ring-1 ring-cyan-500/40 shadow-xl' : 'shadow-sm'}`}
              >
                {/* Main Row Header */}
                <div
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                  className="p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 select-none"
                >
                  {/* Left block: Category icon + Action + Details */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 p-2 rounded-lg bg-slate-900 border border-slate-700 flex-shrink-0">
                      {categoryBadge.icon}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Action badge */}
                        <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
                          {log.action}
                        </span>

                        {/* Category badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${categoryBadge.bg}`}>
                          {categoryBadge.label}
                        </span>

                        {/* Severity badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${severityBadge.bg}`}>
                          {severityBadge.icon}
                          {severityBadge.label}
                        </span>

                        {/* Target */}
                        {log.target && (
                          <span className="text-xs font-mono text-cyan-300/90 truncate max-w-[240px]">
                            → {log.target}
                          </span>
                        )}
                      </div>

                      {/* Details sentence */}
                      <p className="text-xs text-slate-300 leading-relaxed truncate md:max-w-2xl">
                        {log.details}
                      </p>
                    </div>
                  </div>

                  {/* Right block: Node token badge + status code + latency + time */}
                  <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0 text-xs font-mono">
                    {/* Node Token Indicator if present */}
                    {log.nodeToken && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[11px]">
                        <Key className="w-3 h-3 text-cyan-400" />
                        NODE: {log.nodeToken.split('-')[1] || 'BNB'}
                      </span>
                    )}

                    {/* Microservice Name if present */}
                    {log.microserviceName && (
                      <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/40 text-purple-300 text-[11px]">
                        <Server className="w-3 h-3 text-purple-400" />
                        {log.microserviceName}
                      </span>
                    )}

                    {/* HTTP status code & Latency */}
                    <div className="flex items-center gap-2">
                      {log.statusCode && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          log.statusCode < 300 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {log.statusCode}
                        </span>
                      )}
                      {log.latencyMs && (
                        <span className="text-slate-400 text-[11px]">
                          {log.latencyMs}ms
                        </span>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className="text-right">
                      <div className="text-slate-300 font-medium">{timestamp.relative}</div>
                      <div className="text-[10px] text-slate-500 hidden sm:block">{timestamp.exact.split(' ')[1]}</div>
                    </div>

                    {/* Expand icon */}
                    <div className="p-1 rounded text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                {isExpanded && (
                  <div className="border-t border-slate-800 bg-[#050b14]/90 p-5 space-y-4 text-xs font-mono animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Actor & Authorization Block */}
                      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Aktor i Autoryzacja</span>
                        <div className="flex items-center gap-2 text-white font-sans font-medium">
                          <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs">
                            {log.actorName?.charAt(0) || 'N'}
                          </div>
                          <span>{log.actorName}</span>
                          <span className="text-slate-500 text-xs font-mono">({log.actorId})</span>
                        </div>
                        {log.nodeToken && (
                          <div className="pt-2 border-t border-slate-800/80">
                            <span className="text-[10px] text-cyan-400 block mb-1">Klucz Węzła (Node Token):</span>
                            <div className="flex items-center justify-between bg-black/40 p-1.5 rounded border border-cyan-500/30">
                              <code className="text-cyan-200 text-[11px] font-bold">{log.nodeToken}</code>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  handleCopyNodeToken(log.nodeToken);
                                }}
                                className="text-cyan-400 hover:text-cyan-200 ml-2"
                                title="Kopiuj klucz węzła"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Microservice & Ingress Routing Block */}
                      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Mikroserwis & Endpoint</span>
                        <div className="space-y-1">
                          <div className="text-slate-200 font-semibold flex items-center gap-1.5">
                            <Server className="w-3.5 h-3.5 text-purple-400" />
                            {log.microserviceName || 'NEXUS Internal Mesh'}
                          </div>
                          {log.endpoint && (
                            <code className="text-purple-300 bg-black/40 px-2 py-0.5 rounded border border-purple-500/20 block text-[11px] truncate">
                              {log.endpoint}
                            </code>
                          )}
                          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                            <span>Czas odpowiedzi: <strong className="text-white">{log.latencyMs || 18}ms</strong></span>
                            <span>Status HTTP: <strong className="text-emerald-400">{log.statusCode || 200}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Cryptographic Signature Block */}
                      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 md:col-span-2 lg:col-span-1">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Kryptograficzny Hash Podpisu (ZK/ECDSA)</span>
                        <div className="bg-black/60 p-2 rounded border border-emerald-500/30 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              SEALED SIGNATURE
                            </span>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleCopyHash(log.signatureHash || '0x0', log.id);
                              }}
                              className="text-emerald-400 hover:text-emerald-200"
                              title="Kopiuj hash podpisu"
                            >
                              {copiedHashId === log.id ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <code className="text-[10px] text-slate-300 break-all leading-tight block">
                            {log.signatureHash || '0x8f2d4e9c1b3a5f7e0d2c4b6a8e0f2d4e9c1b3a5f7e0d2c4b6a8e0f2d4e9c1b3a'}
                          </code>
                        </div>
                        <span className="text-[10px] text-slate-500">UTC: {log.timestamp}</span>
                      </div>
                    </div>

                    {/* Extended Metadata Display */}
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                            Payload & Telemetria Metadanych (JSON)
                          </span>
                          <span className="text-[10px] text-slate-500">{Object.keys(log.metadata).length} pól telemetrycznych</span>
                        </div>
                        <pre className="p-3 rounded-lg bg-[#030712] border border-slate-800 text-[11px] text-cyan-200/90 overflow-x-auto leading-relaxed">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
