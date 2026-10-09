import React, { useState, useEffect, useMemo } from 'react';
import { ClusterInstance, NxlLedgerEntry, SynapseNodeStatus, NexusSessionSnapshot } from '../types';
import { ClusterMeshMap } from './ClusterMeshMap';
import { preloadClusterResources } from '../actions/clusterActions';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  Cpu,
  Server,
  Bot,
  Send,
  Sparkles,
  Activity,
  ShieldCheck,
  Zap,
  RefreshCw,
  CheckCircle2,
  Download,
  Camera,
  BookmarkCheck,
  RotateCcw,
  Layers,
  Gauge,
  Wifi,
  Clock,
  Info,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface DashboardViewProps {
  telemetry: {
    quantumCiCd: ClusterInstance;
    synapseMesh: ClusterInstance;
    agentSandbox: ClusterInstance;
    ledgerEntries: NxlLedgerEntry[];
  };
  onRunMassAnalysis?: () => void;
  onRefreshTelemetry?: () => void;
  xpPoints?: number;
  onSaveSnapshot?: () => NexusSessionSnapshot | null;
  snapshotLoadedInfo?: { timestamp: string; xp: number; savedAtFormatted?: string } | null;
  onClearSnapshot?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  telemetry,
  onRunMassAnalysis = () => {},
  onRefreshTelemetry = () => {},
  xpPoints = 14200,
  onSaveSnapshot,
  snapshotLoadedInfo,
  onClearSnapshot = () => {},
}) => {
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(false);
  const [role, setRole] = useState<string>('Biooperator');
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  // Heatmap interactive state
  const [hoveredNode, setHoveredNode] = useState<SynapseNodeStatus | null>(null);
  const [selectedNode, setSelectedNode] = useState<SynapseNodeStatus | null>(null);

  // Snapshot interactive state
  const [snapshotSuccess, setSnapshotSuccess] = useState<boolean>(false);
  const [lastSavedSnapshotTime, setLastSavedSnapshotTime] = useState<string | null>(null);
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);

  // Batch Cluster Restart & D3 Topology State
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [isRestarting, setIsRestarting] = useState<boolean>(false);
  const [restartProgress, setRestartProgress] = useState<number>(0);
  const [restartingNodeIds, setRestartingNodeIds] = useState<string[]>([]);

  // NXL Performance Benchmark Suite State
  const [benchmarkData, setBenchmarkData] = useState([
    { name: 'AST Parse', latency: 4.2, throughput: 2400 },
    { name: 'Truth Assertion', latency: 8.5, throughput: 1850 },
    { name: 'Ledger Mutation', latency: 2.1, throughput: 4200 },
    { name: 'WASM Heap Stress', latency: 18.6, throughput: 920 },
    { name: 'Mesh Broadcast', latency: 12.4, throughput: 1450 },
  ]);
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const handleRunBenchmark = () => {
    setIsBenchmarking(true);
    setTimeout(() => {
      setBenchmarkData([
        { name: 'AST Parse', latency: Number((3.5 + Math.random() * 2).toFixed(1)), throughput: Math.floor(2200 + Math.random() * 400) },
        { name: 'Truth Assertion', latency: Number((7.0 + Math.random() * 3).toFixed(1)), throughput: Math.floor(1700 + Math.random() * 300) },
        { name: 'Ledger Mutation', latency: Number((1.8 + Math.random() * 1).toFixed(1)), throughput: Math.floor(4000 + Math.random() * 500) },
        { name: 'WASM Heap Stress', latency: Number((15.0 + Math.random() * 5).toFixed(1)), throughput: Math.floor(850 + Math.random() * 200) },
        { name: 'Mesh Broadcast', latency: Number((10.0 + Math.random() * 4).toFixed(1)), throughput: Math.floor(1350 + Math.random() * 300) },
      ]);
      setIsBenchmarking(false);
    }, 600);
  };

  // On mount check local snapshot metadata for immediate visual feedback and preload server resources
  useEffect(() => {
    preloadClusterResources();
    try {
      const raw = localStorage.getItem('nexus_telemetry_snapshot');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.savedAtFormatted) {
          setLastSavedSnapshotTime(parsed.savedAtFormatted);
        } else if (parsed?.timestamp) {
          setLastSavedSnapshotTime(new Date(parsed.timestamp).toLocaleTimeString('pl-PL'));
        }
      }
    } catch {
      // Non-blocking catch
    }
  }, []);

  const handleExportSessionData = () => {
    const exportPayload = {
      metadata: {
        appName: 'NEXUS OS — Architektura & System NXL v1.0',
        systemVersion: '1.0.0-QUANTUM',
        exportTimestamp: new Date().toISOString(),
        architectAuthority: 'Eterion Strategic Systems Architect',
        userRole: role,
        status: 'OPERATIONAL_IMMUTABLE',
      },
      clusterMetrics: {
        totalInstances:
          telemetry.quantumCiCd.instancesCount +
          telemetry.synapseMesh.instancesCount +
          telemetry.agentSandbox.instancesCount,
        totalThroughputRps:
          telemetry.quantumCiCd.throughputRps +
          telemetry.synapseMesh.throughputRps +
          telemetry.agentSandbox.throughputRps,
        averageLatencyMs: Number(
          (
            (telemetry.quantumCiCd.latencyMs +
              telemetry.synapseMesh.latencyMs +
              telemetry.agentSandbox.latencyMs) /
            3
          ).toFixed(2)
        ),
      },
      telemetry: {
        quantumCiCd: telemetry.quantumCiCd,
        synapseMesh: telemetry.synapseMesh,
        agentSandbox: telemetry.agentSandbox,
        ledgerEntries: telemetry.ledgerEntries,
      },
    };

    const jsonString = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `nexus-telemetry-session-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    anchor.click();
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3500);
  };

  const handleSnapshotState = () => {
    let result: NexusSessionSnapshot | null = null;
    if (onSaveSnapshot) {
      result = onSaveSnapshot();
    } else {
      // Direct local fallback
      try {
        const now = new Date();
        const payload: NexusSessionSnapshot = {
          timestamp: now.toISOString(),
          savedAtFormatted: now.toLocaleTimeString('pl-PL', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          xpPoints,
          telemetry,
        };
        localStorage.setItem('nexus_telemetry_snapshot', JSON.stringify(payload));
        result = payload;
      } catch (e) {
        console.error('Failed to save snapshot to localStorage:', e);
      }
    }

    if (result) {
      setSnapshotSuccess(true);
      const timeStr = result.savedAtFormatted || new Date().toLocaleTimeString('pl-PL');
      setLastSavedSnapshotTime(timeStr);
      setSnapshotToast(`Snapshot zapisany w localStorage: ${result.xpPoints.toLocaleString()} XP • Stan 24 mikrowęzłów utrwalony.`);
      setTimeout(() => setSnapshotSuccess(false), 3500);
      setTimeout(() => setSnapshotToast(null), 5000);
    }
  };

  // Synapse Mesh 24 microservice instances for the Heatmap Grid
  const synapseNodes: SynapseNodeStatus[] = useMemo(() => {
    if (telemetry.synapseMesh.nodes && telemetry.synapseMesh.nodes.length === 24) {
      return telemetry.synapseMesh.nodes;
    }

    // Realistic deterministically distributed loads for Synapse Mesh 24 instances
    const loadProfile = [
      38, 42, 51, 64, 48, 55, 72, 39,
      44, 58, 62, 53, 41, 79, 47, 50,
      36, 68, 45, 59, 34, 76, 49, 52
    ];

    return Array.from({ length: 24 }, (_, i) => {
      const idx = i + 1;
      const num = idx.toString().padStart(2, '0');
      const load = loadProfile[i] ?? (40 + (i * 3) % 45);
      const isGrpc = idx % 2 === 0;
      const status: SynapseNodeStatus['status'] =
        load >= 75 ? 'HEAVY_LOAD' : load >= 50 ? 'SYNCED' : 'OPERATIONAL';
      return {
        nodeId: `SYNAPSE-NODE-${num}`,
        name: `Synapse Micro-Node #${idx}`,
        protocol: isGrpc ? 'gRPC' : 'REST',
        status,
        loadPercent: load,
        throughputRps: 175 + Math.round(load * 2.8),
        latencyMs: parseFloat((0.82 + (load / 100) * 0.65).toFixed(2)),
        lastHeartbeat: new Date(Date.now() - (24 - idx) * 2500).toISOString(),
      };
    });
  }, [telemetry.synapseMesh]);

  // Sync selectedNodeIds with synapseNodes on initial load
  useEffect(() => {
    if (synapseNodes.length > 0 && selectedNodeIds.length === 0) {
      setSelectedNodeIds(synapseNodes.map((n) => n.nodeId));
    }
  }, [synapseNodes]);

  const handleToggleSelectNode = (nodeId: string) => {
    if (isRestarting) return;
    setSelectedNodeIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  const handleSelectAllNodes = () => {
    if (isRestarting) return;
    setSelectedNodeIds(synapseNodes.map((n) => n.nodeId));
  };

  const handleDeselectAllNodes = () => {
    if (isRestarting) return;
    setSelectedNodeIds([]);
  };

  const handleBatchRestart = () => {
    if (isRestarting || selectedNodeIds.length === 0) return;

    setIsRestarting(true);
    setRestartProgress(0);

    const totalToRestart = selectedNodeIds.length;
    const batchSize = Math.max(1, Math.ceil(totalToRestart / 4));
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = Math.min(100, currentStep * 25);
      setRestartProgress(progress);

      const startIndex = (currentStep - 1) * batchSize;
      const activeBatch = selectedNodeIds.slice(startIndex, startIndex + batchSize);
      setRestartingNodeIds(activeBatch);

      if (currentStep >= 4 || progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsRestarting(false);
          setRestartProgress(100);
          setRestartingNodeIds([]);
          onRefreshTelemetry();
          setSnapshotToast(
            `[BATCH CLUSTER RESTART]: Przeładowano pomyślnie ${totalToRestart} instancji Synapse Mesh. Topologia zsynchronizowana!`
          );
          setTimeout(() => setSnapshotToast(null), 5000);
        }, 600);
      }
    }, 800);
  };

  // Color coding palette for heatmap
  const getNodeColorConfig = (load: number) => {
    if (load < 45) {
      return {
        bg: 'bg-emerald-950/60 hover:bg-emerald-900/90',
        border: 'border-emerald-500/40 hover:border-emerald-400',
        text: 'text-emerald-300',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        indicator: 'bg-emerald-400',
        glow: 'shadow-[0_0_12px_rgba(16,185,129,0.2)]',
        category: 'Optymalne (<45%)',
      };
    }
    if (load < 65) {
      return {
        bg: 'bg-cyan-950/60 hover:bg-cyan-900/90',
        border: 'border-cyan-500/40 hover:border-cyan-400',
        text: 'text-cyan-300',
        badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        indicator: 'bg-cyan-400',
        glow: 'shadow-[0_0_12px_rgba(6,182,212,0.2)]',
        category: 'Zbalansowane (45-65%)',
      };
    }
    if (load < 80) {
      return {
        bg: 'bg-amber-950/60 hover:bg-amber-900/90',
        border: 'border-amber-500/40 hover:border-amber-400',
        text: 'text-amber-300',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        indicator: 'bg-amber-400',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.2)]',
        category: 'Podwyższone (65-80%)',
      };
    }
    return {
      bg: 'bg-rose-950/60 hover:bg-rose-900/90',
      border: 'border-rose-500/40 hover:border-rose-400',
      text: 'text-rose-300',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      indicator: 'bg-rose-400',
      glow: 'shadow-[0_0_12px_rgba(244,63,94,0.25)]',
      category: 'Szczytowe (>80%)',
    };
  };

  // Node currently displayed in the live inspector bar
  const activeInspectedNode = hoveredNode || selectedNode || synapseNodes[11] || synapseNodes[0];

  // Speak text in real-time using Web Speech API
  const speakRealTimeMessage = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !isVoiceEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pl-PL';
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis warning:', e);
    }
  };

  const handleAiConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || aiLoading) return;

    setAiLoading(true);
    setIsStreaming(true);
    setAiResponse('');

    try {
      // First try real-time SSE stream endpoint
      const response = await fetch('/api/eterion/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, role }),
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.slice(6));
                if (parsed.text) {
                  accumulated += parsed.text;
                  setAiResponse(accumulated);
                } else if (parsed.fullText) {
                  accumulated = parsed.fullText;
                  setAiResponse(accumulated);
                } else if (parsed.error) {
                  accumulated += `\n[BŁĄD DOKTRYNY NXL]: ${parsed.error}`;
                  setAiResponse(accumulated);
                }
              } catch {}
            }
          }
        }

        if (accumulated && isVoiceEnabled) {
          speakRealTimeMessage(accumulated);
        }
      } else {
        // Fallback to standard synchronous endpoint
        const res = await fetch('/api/architect/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: aiPrompt, role }),
        });
        const data = await res.json();
        const text = data.result || data.error || '[ODPOWIEDŹ ARCHITEKTA]: Brak danych zwrotnych.';
        setAiResponse(text);
        if (isVoiceEnabled) speakRealTimeMessage(text);
      }
    } catch (err: any) {
      setAiResponse(`[BŁĄD SIECI]: ${err.message}`);
    } finally {
      setAiLoading(false);
      setIsStreaming(false);
    }
  };

  const clusters = [
    {
      data: telemetry.quantumCiCd,
      icon: Cpu,
      color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
    },
    {
      data: telemetry.synapseMesh,
      icon: Server,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    },
    {
      data: telemetry.agentSandbox,
      icon: Bot,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    },
  ];

  // Distribution counts for heatmap legend
  const optimalCount = synapseNodes.filter((n) => n.loadPercent < 45).length;
  const balancedCount = synapseNodes.filter((n) => n.loadPercent >= 45 && n.loadPercent < 65).length;
  const elevatedCount = synapseNodes.filter((n) => n.loadPercent >= 65 && n.loadPercent < 80).length;
  const highCount = synapseNodes.filter((n) => n.loadPercent >= 80).length;

  return (
    <div className="space-y-6">
      {/* Auto-load Session Resume Alert Banner */}
      {(snapshotLoadedInfo || snapshotToast) && (
        <div className="p-3.5 px-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between gap-4 flex-wrap text-xs font-mono text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <BookmarkCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>
              {snapshotToast ? (
                snapshotToast
              ) : (
                <>
                  <strong className="text-white">Sesja Wznowiona ze Snapshotu:</strong> Przywrócono stan telemetrii oraz{' '}
                  <strong className="text-amber-300">{(snapshotLoadedInfo?.xp || xpPoints).toLocaleString()} XP</strong>
                  {snapshotLoadedInfo?.savedAtFormatted && (
                    <span className="text-slate-400 ml-1.5">(Zapis: {snapshotLoadedInfo.savedAtFormatted})</span>
                  )}
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onRefreshTelemetry?.()}
              className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-mono transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Pobierz Live z Serwera</span>
            </button>
            {onClearSnapshot && (
              <button
                onClick={() => onClearSnapshot?.()}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[11px] font-mono transition-colors"
                title="Wyczyść zapisany snapshot z localStorage"
              >
                Resetuj Snapshot
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Welcome Banner */}
      <div className="nx-glass-card rounded-2xl p-6 relative overflow-hidden border border-cyan-500/30 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/40">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Cpu className="w-64 h-64 text-cyan-400" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>NEXUS OS — Architektura Budynku & Klastrów</span>
          </div>

          <h2 className="text-2xl font-bold text-white font-sans">
            Witaj, Architekcie. Gotowy na synchronizację z NXL v1.0?
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Twój ekosystem operuje w architekturze klastrowej Synapse Mesh ({telemetry.synapseMesh.instancesCount} węzłów) oraz Quantum CI/CD ({telemetry.quantumCiCd.instancesCount} instancji).
            Wszystkie operacje modyfikacji stanu i weryfikacji pakietów ZIP przebiegają przez **NXL Truth Layer** oraz osłonę **Immutable Shield**.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => onRunMassAnalysis?.()}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs flex items-center gap-2 hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Uruchom Protokół Masowej Analizy ZIP</span>
            </button>

            {/* Snapshot State Button */}
            <button
              onClick={() => handleSnapshotState()}
              className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-2 border transition-all ${
                snapshotSuccess
                  ? 'bg-amber-500/25 border-amber-500/70 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                  : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-300 hover:text-amber-200'
              }`}
              title="Zapisz bieżącą konfigurację telemetrii oraz punkty XP do localStorage z funkcją auto-load"
            >
              {snapshotSuccess ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-amber-400" />
                  <span>Snapshot Saved!</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Snapshot State</span>
                </>
              )}
            </button>

            <button
              onClick={() => onRefreshTelemetry?.()}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>Odśwież Telemetrię Klastrów</span>
            </button>

            <button
              onClick={() => handleExportSessionData()}
              className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-2 border transition-all ${
                exportSuccess
                  ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/40 text-emerald-300 hover:text-emerald-200'
              }`}
              title="Pobierz pełny zrzut stanu telemetrii klastrów do pliku JSON dla analizy offline"
            >
              {exportSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Wyeksportowano JSON</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Export Session Data</span>
                </>
              )}
            </button>

            {lastSavedSnapshotTime && (
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 ml-auto">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Ostatni Snapshot: <strong className="text-slate-200">{lastSavedSnapshotTime}</strong></span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cluster Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {clusters.map((c, i) => {
          const Icon = c.icon;
          const d = c.data;
          return (
            <div key={i} className={`nx-glass-card rounded-2xl p-5 border bg-gradient-to-br ${c.color} space-y-4`}>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {d.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-base">{d.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Opiekun: {d.guardian}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">INSTANCJE</span>
                  <span className="text-slate-200 font-bold text-sm">{d.instancesCount} Mikrowęzłów</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">PRZEPUSTOWOŚĆ</span>
                  <span className="text-cyan-300 font-bold text-sm">{d.throughputRps} RPS</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">DOŚWIADCZENIE</span>
                  <span className="text-amber-300 font-bold text-sm">{d.xpPoints} XP</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">OPÓŹNIENIE</span>
                  <span className="text-emerald-300 font-bold text-sm">{d.latencyMs} ms</span>
                </div>
              </div>

              {/* Load Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Obciążenie Klastra</span>
                  <span className="font-bold text-cyan-300">{d.loadPercent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${d.loadPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* INTERACTIVE D3 CLUSTER MESH TOPOLOGY MAP */}
      <ClusterMeshMap
        nodes={synapseNodes}
        selectedNodeIds={selectedNodeIds}
        onToggleSelectNode={handleToggleSelectNode}
        onSelectAllNodes={handleSelectAllNodes}
        onDeselectAllNodes={handleDeselectAllNodes}
        onBatchRestart={handleBatchRestart}
        isRestarting={isRestarting}
        restartProgress={restartProgress}
        restartingNodeIds={restartingNodeIds}
      />

      {/* SYNAPSE MESH MICROSERVICE INSTANCES HEATMAP GRID */}
      <div className="nx-glass-card rounded-2xl p-5 md:p-6 border border-emerald-500/30 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-emerald-950/20 space-y-5">
        {/* Heatmap Section Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-800/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-sans">
                  Siatka Mapy Ciepła Mikrousług Synapse Mesh
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-semibold">
                  24 Instancje Live
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kodowana kolorami mapa obciążenia mikrowęzłów. Najedź kursorem na instancję, aby zobaczyć statystyki w czasie rzeczywistym.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>Śr. obciążenie:</span>
              <strong className="text-cyan-300">{telemetry.synapseMesh.loadPercent}%</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>Śr. opóźnienie:</span>
              <strong className="text-emerald-300">{telemetry.synapseMesh.latencyMs} ms</strong>
            </div>
          </div>
        </div>

        {/* Live Node Hover / Inspector Details Bar */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono transition-all">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-slate-400 uppercase tracking-wider text-[10px]">
                {hoveredNode ? 'Najechana Instancja Mikrousługi' : 'Wybrana Instancja (Podgląd Telemetrii)'}:
              </span>
              <strong className="text-white text-sm font-bold">{activeInspectedNode.nodeId}</strong>
              <span className="text-slate-400">({activeInspectedNode.name})</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
                Protokół: <strong className="text-cyan-300">{activeInspectedNode.protocol}</strong>
              </span>
              <span
                className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                  activeInspectedNode.status === 'HEAVY_LOAD'
                    ? 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                    : activeInspectedNode.status === 'SYNCED'
                    ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                    : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                }`}
              >
                {activeInspectedNode.status}
              </span>
            </div>
          </div>

          {/* Stats Grid for hovered instance */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
            <div>
              <span className="text-[10px] text-slate-500 block">OBCIĄŻENIE CPU</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span
                  className={`text-base font-bold ${
                    activeInspectedNode.loadPercent >= 80
                      ? 'text-rose-400'
                      : activeInspectedNode.loadPercent >= 65
                      ? 'text-amber-400'
                      : activeInspectedNode.loadPercent >= 45
                      ? 'text-cyan-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {activeInspectedNode.loadPercent}%
                </span>
                <span className="text-[10px] text-slate-400">wykorzystania</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    activeInspectedNode.loadPercent >= 80
                      ? 'bg-rose-500'
                      : activeInspectedNode.loadPercent >= 65
                      ? 'bg-amber-500'
                      : activeInspectedNode.loadPercent >= 45
                      ? 'bg-cyan-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${activeInspectedNode.loadPercent}%` }}
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block">PRZEPUSTOWOŚĆ</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-base font-bold text-cyan-300">{activeInspectedNode.throughputRps}</span>
                <span className="text-[10px] text-slate-400">RPS</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Stabilne zbuforowanie</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block">CZAS ODPOWIEDZI</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-base font-bold text-emerald-300">{activeInspectedNode.latencyMs}</span>
                <span className="text-[10px] text-slate-400">ms</span>
              </div>
              <span className="text-[10px] text-emerald-400/80 mt-1 block">NXL Low-Jitter</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block">PAMIĘĆ & DRYF</span>
              <div className="text-xs text-slate-200 font-semibold mt-0.5">
                128 MB <span className="text-slate-500 font-normal">| 0.00ms dryfu</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block truncate">
                Puls: {new Date(activeInspectedNode.lastHeartbeat).toLocaleTimeString('pl-PL')}
              </span>
            </div>
          </div>
        </div>

        {/* The 24-Microservice Heatmap Grid */}
        <div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 sm:gap-2.5">
            {synapseNodes.map((node, index) => {
              const cfg = getNodeColorConfig(node.loadPercent);
              const isHovered = hoveredNode?.nodeId === node.nodeId;
              const isSelected = selectedNode?.nodeId === node.nodeId;

              return (
                <button
                  key={node.nodeId}
                  type="button"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setSelectedNode(node)}
                  className={`group relative p-2.5 rounded-xl border transition-all duration-200 text-left font-mono flex flex-col justify-between h-[82px] cursor-pointer outline-none ${
                    cfg.bg
                  } ${cfg.border} ${
                    isHovered || isSelected
                      ? 'scale-[1.06] z-20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                      : 'hover:scale-[1.03]'
                  }`}
                  title={`${node.nodeId} (${node.name})\nObciążenie: ${node.loadPercent}%\nPrzepustowość: ${node.throughputRps} RPS\nOpóźnienie: ${node.latencyMs} ms\nProtokół: ${node.protocol}\nStatus: ${node.status}`}
                >
                  {/* Top line: Node index + pulse dot */}
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors">
                      #{(index + 1).toString().padStart(2, '0')}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${cfg.indicator} group-hover:scale-125 transition-transform`} />
                  </div>

                  {/* Center Load Metric */}
                  <div className="my-0.5">
                    <div className={`text-sm sm:text-base font-bold ${cfg.text} tracking-tight`}>
                      {node.loadPercent}%
                    </div>
                  </div>

                  {/* Bottom line: RPS & Mini latency indicator */}
                  <div className="flex items-center justify-between w-full text-[9px] text-slate-400">
                    <span>{node.throughputRps}rps</span>
                    <span className="text-slate-500 font-mono">{node.latencyMs}ms</span>
                  </div>

                  {/* Active highlight corner accent */}
                  {(isHovered || isSelected) && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-slate-950" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Heatmap Legend & Summary Statistics */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold">Legenda Obciążenia:</span>
            
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Optymalne (&lt;45%): <strong>{optimalCount}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Zbalansowane (45-65%): <strong>{balancedCount}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Podwyższone (65-80%): <strong>{elevatedCount}</strong></span>
            </div>

            {highCount > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>Szczytowe (&gt;80%): <strong>{highCount}</strong></span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="text-slate-500">Routing:</span>
            <span className="text-cyan-300 font-bold">100% Deterministic</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold">Zero Drift Mesh</span>
          </div>
        </div>
      </div>

      {/* AI Architect Assistant & Live Ledger Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gemini AI Architect Interface */}
        <div className="nx-glass-card rounded-2xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Konsultacja Architektoniczna (Eterion)</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1 border transition-all ${
                    isVoiceEnabled
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-300'
                  }`}
                  title={isVoiceEnabled ? 'Odczytywanie głosem włączone (Web Speech API)' : 'Włącz odczytywanie wiadomości w czasie rzeczywistym'}
                >
                  {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{isVoiceEnabled ? 'Głos: ON' : 'Głos: OFF'}</span>
                </button>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Gemini 3.8 Flash (Live Stream)
                </span>
              </div>
            </div>

            <form onSubmit={handleAiConsultation} className="mt-4 space-y-3">
              <div className="flex gap-2">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="Biooperator">Biooperator (Główny)</option>
                  <option value="Audytor">Audytor Security</option>
                  <option value="Guest">Guest (Brak Grants)</option>
                </select>

                <input
                  type="text"
                  placeholder="Zapytaj Eteriona o architekturę, spójność NXL lub pakiety ZIP..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />

                <button
                  type="submit"
                  disabled={aiLoading}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {aiLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Wyślij</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {(aiResponse !== null || isStreaming) && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-slate-200 space-y-2">
                <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Synteza Eteriona
                  </span>
                  {isStreaming && (
                    <span className="text-[10px] text-emerald-400 animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      STRUMIENIOWANIE NA ŻYWO
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {aiResponse}
                  {isStreaming && <span className="inline-block w-2 h-3.5 bg-cyan-400 ml-0.5 animate-pulse align-middle" />}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Live NXL State Ledger History */}
        <div className="nx-glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-sm">Historia Modyfikacji Stanu (State Ledger)</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Wersje: <strong className="text-cyan-300">{(telemetry?.ledgerEntries || []).length}</strong>
            </span>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {(telemetry?.ledgerEntries || []).length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 text-center">Brak zapisów w Ledgerze. Uruchom skrypt w Scribe IDE.</p>
            ) : (
              (telemetry?.ledgerEntries || []).map((entry, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-mono flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold">
                        v{entry.version}
                      </span>
                      <span className="text-slate-200 font-semibold">{entry.target}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {entry.reason} ({entry.previousValue ?? 'null'} → <strong className="text-emerald-400">{String(entry.newValue)}</strong>)
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* NXL Performance Benchmark Suite & Latency Impact Chart */}
        <div className="nx-glass-card rounded-2xl p-5 border border-slate-800 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-bold text-white text-sm">NXL Performance Benchmark Suite</h3>
                <p className="text-[11px] text-slate-400">Pomiar opóźnień (Latency ms) i przepustowości (RPS) dla różnych workloadów sandboksa</p>
              </div>
            </div>
            <button
              onClick={handleRunBenchmark}
              disabled={isBenchmarking}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 cursor-pointer font-mono"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBenchmarking ? 'animate-spin' : ''}`} />
              <span>{isBenchmarking ? 'Trwa benchmark...' : 'Uruchom Benchmark Suite'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Chart Area */}
            <div className="lg:col-span-2 h-[240px] w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090C16', borderColor: '#1A2234', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                    itemStyle={{ color: '#00E5FF' }}
                  />
                  <Bar dataKey="latency" name="Latency (ms)" fill="#00E5FF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="throughput" name="Throughput (RPS)" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Benchmark Summary Stats */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Średnie Opóźnienie</div>
                <div className="text-lg font-bold text-cyan-300">
                  {(benchmarkData.reduce((acc, cur) => acc + cur.latency, 0) / benchmarkData.length).toFixed(1)} ms
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Maksymalny Throughput</div>
                <div className="text-lg font-bold text-emerald-400">
                  {Math.max(...benchmarkData.map(d => d.throughput))} RPS
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Status Izolacji V8</div>
                <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
                  ZERO DRIFT MESH
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
