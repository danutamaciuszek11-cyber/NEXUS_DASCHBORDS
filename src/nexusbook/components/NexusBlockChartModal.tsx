import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import {
  X,
  RefreshCw,
  Activity,
  Layers,
  Zap,
  Clock,
  ExternalLink,
  Copy,
  Check,
  BarChart2,
  ShieldCheck,
  Database,
  Radio,
  TrendingUp,
  Download
} from 'lucide-react';
import { useNexusStore } from '../store';
import { ProcessedBlock } from '../nexus';
import { soundFx } from '../utils/audioSystem';

interface NexusBlockChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ChartMetric = 'BLOCK_NUMBER' | 'LATENCY' | 'TX_COUNT';

export const NexusBlockChartModal: React.FC<NexusBlockChartModalProps> = ({
  isOpen,
  onClose
}) => {
  const bnbDocking = useNexusStore((s) => s.bnbDocking);
  const processedBlocks = useNexusStore((s) => s.processedBlocks);
  const isFetchingBlocks = useNexusStore((s) => s.isFetchingBlocks);
  const fetchProcessedBlocks = useNexusStore((s) => s.fetchProcessedBlocks);

  const [activeMetric, setActiveMetric] = useState<ChartMetric>('BLOCK_NUMBER');
  const [autoSync, setAutoSync] = useState<boolean>(false);
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // Pobierz ostatnie 10 bloków posortowanych rosnąco dla osi wykresu
  const last10Blocks: ProcessedBlock[] = useMemo(() => {
    if (!processedBlocks || processedBlocks.length === 0) {
      return [];
    }
    // Ostatnie 10 bloków posortowanych rosnąco według numeru bloku
    const sorted = [...processedBlocks].sort((a, b) => a.blockNumber - b.blockNumber);
    return sorted.slice(-10);
  }, [processedBlocks]);

  // Pobierz bloki przy pierwszym otwarciu modalu jeśli jest ich mniej niż 10
  useEffect(() => {
    if (isOpen && last10Blocks.length < 10 && !isFetchingBlocks) {
      fetchProcessedBlocks().catch((err) => {
        console.warn('[NEXUS-BLOCK-CHART] Auto-fetch error:', err);
      });
    }
  }, [isOpen, last10Blocks.length, isFetchingBlocks, fetchProcessedBlocks]);

  // Auto-synchronizacja co 3 sekundy (odpowiada interwałowi bloku BSC)
  useEffect(() => {
    if (!isOpen || !autoSync) return;

    const interval = setInterval(() => {
      fetchProcessedBlocks().catch(() => {});
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, autoSync, fetchProcessedBlocks]);

  // Obsługa klawisza Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Ręczne odświeżenie
  const handleRefresh = useCallback(async () => {
    soundFx.playClick();
    try {
      await fetchProcessedBlocks();
      soundFx.playSuccess();
    } catch {
      // safe fallback handled in store
    }
  }, [fetchProcessedBlocks]);

  const handleCopyBlock = useCallback((blockNum: number) => {
    navigator.clipboard.writeText(blockNum.toString());
    setCopiedBlock(blockNum.toString());
    soundFx.playClick();
    setTimeout(() => setCopiedBlock(null), 1800);
  }, []);

  const handleCopyJson = useCallback(() => {
    const dataStr = JSON.stringify(last10Blocks, null, 2);
    navigator.clipboard.writeText(dataStr);
    setCopiedJson(true);
    soundFx.playClick();
    setTimeout(() => setCopiedJson(false), 2000);
  }, [last10Blocks]);

  // Metryki zbiorcze
  const metrics = useMemo(() => {
    if (last10Blocks.length === 0) {
      return {
        latestBlock: bnbDocking.blockNumber || '---',
        avgLatency: bnbDocking.latencyMs || 25,
        totalTx: 0,
        spanSeconds: 30
      };
    }
    const latest = last10Blocks[last10Blocks.length - 1];
    const totalLatency = last10Blocks.reduce((acc, b) => acc + (b.latencyMs || 0), 0);
    const avgLatency = Math.round(totalLatency / last10Blocks.length);
    const totalTx = last10Blocks.reduce((acc, b) => acc + (b.txCount || 0), 0);
    return {
      latestBlock: latest.blockNumber.toLocaleString(),
      avgLatency,
      totalTx,
      spanSeconds: last10Blocks.length * 3
    };
  }, [last10Blocks, bnbDocking]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="nexus-block-chart-modal-backdrop" 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          id="nexus-block-chart-modal-container"
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-5xl bg-zinc-950 border border-zinc-800/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-zinc-100"
          role="dialog"
          aria-modal="true"
          aria-labelledby="nexus-block-chart-title"
        >
          {/* HEADER */}
          <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-gradient-to-r from-zinc-900/90 via-zinc-950 to-zinc-900/60 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="nexus-block-chart-title" className="text-base sm:text-lg font-bold font-mono tracking-wide text-zinc-100">
                    NEXUS CLIENT // RECENT BLOCKS
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                    BSC CHAIN ID: 56
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Telemetria ostatnich 10 bloków przetworzonych przez <span className="text-cyan-300 font-mono">nexusClient (Viem)</span>
                </p>
              </div>
            </div>

            {/* HEADER ACTIONS */}
            <div className="flex items-center gap-2">
              {/* Auto Sync Toggle */}
              <button
                id="block-chart-auto-sync-btn"
                type="button"
                onClick={() => {
                  setAutoSync(!autoSync);
                  soundFx.playClick();
                }}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                  autoSync
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-950/40'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
                title="Automatyczne pobieranie co 3 sekundy (czas bloku BSC)"
              >
                <Radio className={`w-3.5 h-3.5 ${autoSync ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
                <span className="hidden sm:inline">Auto-Sync (3s)</span>
              </button>

              {/* Refresh Button */}
              <button
                id="block-chart-refresh-btn"
                type="button"
                onClick={handleRefresh}
                disabled={isFetchingBlocks}
                className="px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                title="Pobierz najnowsze bloki przez nexusClient"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isFetchingBlocks ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Odśwież</span>
              </button>

              {/* Close Button */}
              <button
                id="block-chart-close-btn"
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                }}
                className="w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Zamknij okno"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CONTENT BODY */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* ARCHITECT DIRECTIVES BANNER: ZASADA 01 & ZASADA 02 */}
            <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wider">ZASADA 01: PRYMAT PRAWDY TECHNICZNEJ</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                      FAKT &gt; HIPOTEZA
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Metryki on-chain pochodzą bezpośrednio z RPC. W przypadku estymacji brakujące dane są oznaczane jako Hipoteza — brak zmyślonej telemetrii.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                <span className="px-2.5 py-1 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  AEGIS MASTER GATE: AKTYWNA
                </span>
              </div>
            </div>

            {/* KPI STATS ROW */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" /> Najnowszy Blok
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-bold font-mono text-cyan-300">
                    #{metrics.latestBlock}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono mt-1">
                  Węzeł: {bnbDocking.nodeToken}
                </span>
              </div>

              <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> Średni Czas Bloku
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-bold font-mono text-emerald-300">
                    ~3.0s
                  </span>
                  <span className="text-[10px] text-emerald-500 font-mono">BSC PoSA</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono mt-1">
                  Okno 10 bloków (~30s)
                </span>
              </div>

              <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Średnia Latencja RPC
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-bold font-mono text-amber-300">
                    {metrics.avgLatency} ms
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono mt-1">
                  Brama: /api/bnb/rpc
                </span>
              </div>

              <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-400" /> Stan Konsensusu
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className={`text-base sm:text-lg font-bold font-mono ${
                    bnbDocking.status === 'SPLĄTANY' ? 'text-emerald-400' : 'text-zinc-400'
                  }`}>
                    {bnbDocking.status}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
                </div>
                <span className="text-[10px] text-zinc-500 font-mono mt-1">
                  Wyrocznia: {bnbDocking.oracle}
                </span>
              </div>
            </div>

            {/* CHART CONTROLS & SWITCHER */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                  <button
                    id="metric-tab-block-number"
                    type="button"
                    onClick={() => {
                      setActiveMetric('BLOCK_NUMBER');
                      soundFx.playClick();
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
                      activeMetric === 'BLOCK_NUMBER'
                        ? 'bg-cyan-950 border border-cyan-500/40 text-cyan-300 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Wykres Bloków (Recharts)
                    </span>
                  </button>

                  <button
                    id="metric-tab-latency"
                    type="button"
                    onClick={() => {
                      setActiveMetric('LATENCY');
                      soundFx.playClick();
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
                      activeMetric === 'LATENCY'
                        ? 'bg-amber-950 border border-amber-500/40 text-amber-300 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      Opóźnienie (ms)
                    </span>
                  </button>

                  <button
                    id="metric-tab-tx-count"
                    type="button"
                    onClick={() => {
                      setActiveMetric('TX_COUNT');
                      soundFx.playClick();
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
                      activeMetric === 'TX_COUNT'
                        ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      Transakcje / Blok
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <span>Próbka:</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-cyan-300 font-semibold">
                    {last10Blocks.length} bloków
                  </span>
                </div>
              </div>

              {/* RECHARTS VISUALIZATION CONTAINER */}
              <div className="h-64 sm:h-72 w-full pt-2">
                {last10Blocks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-500 font-mono gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                    <span>Inicjalizacja pobierania bloków przez nexusClient...</span>
                  </div>
                ) : activeMetric === 'BLOCK_NUMBER' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={last10Blocks}
                      margin={{ top: 10, right: 20, left: 20, bottom: 25 }}
                    >
                      <defs>
                        <linearGradient id="blockNumberGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis
                        dataKey="blockNumber"
                        tickLine={false}
                        stroke="#71717a"
                        tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'monospace' }}
                        tickFormatter={(val) => `#${Number(val).toLocaleString()}`}
                        dy={10}
                      />
                      <YAxis
                        dataKey="blockNumber"
                        domain={[(dataMin: number) => dataMin - 1, (dataMax: number) => dataMax + 1]}
                        tickLine={false}
                        stroke="#71717a"
                        tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'monospace' }}
                        tickFormatter={(val) => `#${Number(val).toLocaleString()}`}
                        width={90}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#09090b',
                          borderColor: '#27272a',
                          borderRadius: '0.75rem',
                          color: '#f4f4f5',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                        }}
                        labelFormatter={(label) => `Numer Bloku: #${Number(label).toLocaleString()}`}
                        formatter={(val: any) => [
                          `#${Number(val).toLocaleString()}`,
                          'Numer Bloku (BSC)'
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="blockNumber"
                        stroke="#06b6d4"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#blockNumberGradient)"
                        activeDot={{ r: 6, fill: '#22d3ee', stroke: '#0891b2', strokeWidth: 2 }}
                        isAnimationActive={true}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : activeMetric === 'LATENCY' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={last10Blocks}
                      margin={{ top: 10, right: 20, left: 10, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis
                        dataKey="blockNumber"
                        tickLine={false}
                        stroke="#71717a"
                        tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'monospace' }}
                        tickFormatter={(val) => `#${Number(val).toLocaleString()}`}
                        dy={10}
                      />
                      <YAxis
                        dataKey="latencyMs"
                        tickLine={false}
                        stroke="#71717a"
                        tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'monospace' }}
                        tickFormatter={(val) => `${val} ms`}
                        width={60}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#09090b',
                          borderColor: '#27272a',
                          borderRadius: '0.75rem',
                          color: '#f4f4f5',
                          fontFamily: 'monospace',
                          fontSize: '12px'
                        }}
                        labelFormatter={(label) => `Blok #${Number(label).toLocaleString()}`}
                        formatter={(val: any) => [`${val} ms`, 'Opóźnienie Zapytania RPC']}
                      />
                      <ReferenceLine y={metrics.avgLatency} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: `Śr: ${metrics.avgLatency}ms`, fill: '#fbbf24', fontSize: 11, fontFamily: 'monospace' }} />
                      <Bar
                        dataKey="latencyMs"
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={true}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={last10Blocks}
                      margin={{ top: 10, right: 20, left: 10, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis
                        dataKey="blockNumber"
                        tickLine={false}
                        stroke="#71717a"
                        tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'monospace' }}
                        tickFormatter={(val) => `#${Number(val).toLocaleString()}`}
                        dy={10}
                      />
                      <YAxis
                        dataKey="txCount"
                        tickLine={false}
                        stroke="#71717a"
                        tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'monospace' }}
                        tickFormatter={(val) => `${val} tx`}
                        width={60}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#09090b',
                          borderColor: '#27272a',
                          borderRadius: '0.75rem',
                          color: '#f4f4f5',
                          fontFamily: 'monospace',
                          fontSize: '12px'
                        }}
                        labelFormatter={(label) => `Blok #${Number(label).toLocaleString()}`}
                        formatter={(val: any) => [`${val} transakcji`, 'Liczba Tx']}
                      />
                      <Bar
                        dataKey="txCount"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={true}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* TABULAR BREAKDOWN OF THE LAST 10 BLOCKS */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs sm:text-sm font-mono font-bold text-zinc-200">
                    Rejestr Ostatnich 10 Bloków w Pamięci
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="px-2 py-1 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-mono text-zinc-300 flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Kopiuj dane JSON"
                  >
                    {copiedJson ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Skopiowano</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Kopiuj JSON</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="p-2.5 pl-4">#</th>
                      <th className="p-2.5">Numer Bloku</th>
                      <th className="p-2.5">Klasyfikacja Prawdy</th>
                      <th className="p-2.5">Czas Przetworzenia</th>
                      <th className="p-2.5">Latencja</th>
                      <th className="p-2.5">Transakcje (RPC)</th>
                      <th className="p-2.5">Gaz</th>
                      <th className="p-2.5">Źródło</th>
                      <th className="p-2.5 pr-4 text-right">Eksplorator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {[...last10Blocks].reverse().map((b, idx) => {
                      const isLatest = idx === 0;
                      const isFakt = b.classification === 'FAKT' || b.source === 'RPC';
                      return (
                        <tr
                          key={b.blockNumber}
                          className={`hover:bg-zinc-800/40 transition-colors ${
                            isLatest ? 'bg-cyan-950/20 text-cyan-200 font-semibold' : ''
                          }`}
                        >
                          <td className="p-2.5 pl-4 text-zinc-500">{10 - idx}</td>
                          <td className="p-2.5 font-bold flex items-center gap-2">
                            <span className={isLatest ? 'text-cyan-400' : 'text-zinc-100'}>
                              {b.blockNumberFormatted || `#${b.blockNumber.toLocaleString()}`}
                            </span>
                            {isLatest && (
                              <span className="px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-[9px] text-cyan-300">
                                NAJNOWSZY
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleCopyBlock(b.blockNumber)}
                              className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded"
                              title="Kopiuj numer bloku"
                            >
                              {copiedBlock === b.blockNumber.toString() ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </td>
                          <td className="p-2.5">
                            {isFakt ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold">
                                FAKT
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[10px] font-bold" title={b.notes}>
                                HIPOTEZA
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 text-zinc-400">{b.processedAt}</td>
                          <td className="p-2.5">
                            <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                              b.latencyMs < 50
                                ? 'bg-emerald-950/70 border border-emerald-500/30 text-emerald-300'
                                : b.latencyMs < 150
                                ? 'bg-amber-950/70 border border-amber-500/30 text-amber-300'
                                : 'bg-red-950/70 border border-red-500/30 text-red-300'
                            }`}>
                              {b.latencyMs} ms
                            </span>
                          </td>
                          <td className="p-2.5">
                            {typeof b.txCount === 'number' ? (
                              <span className="text-zinc-200">{b.txCount} tx</span>
                            ) : (
                              <span className="text-zinc-600 text-[10px] italic">— [BRAK RPC]</span>
                            )}
                          </td>
                          <td className="p-2.5 text-zinc-400">
                            {b.gasUsed || <span className="text-zinc-600 text-[10px] italic">—</span>}
                          </td>
                          <td className="p-2.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">
                              {b.source}
                            </span>
                          </td>
                          <td className="p-2.5 pr-4 text-right">
                            <a
                              href={`https://bscscan.com/block/${b.blockNumber}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline"
                            >
                              <span>BscScan</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-3.5 sm:p-4 border-t border-zinc-800/80 bg-zinc-950 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>nexusClient Viem v2.56.3 &middot; Brama Proxy BSC /api/bnb/rpc</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                }}
                className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 transition-all cursor-pointer font-medium"
              >
                Zamknij
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
