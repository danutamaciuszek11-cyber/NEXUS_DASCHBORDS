import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Share2, 
  Zap, 
  Layers, 
  Server, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  RefreshCw, 
  Terminal, 
  Wifi, 
  Radio, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Laptop, 
  Check, 
  Send, 
  Eye,
  Sliders,
  AlertTriangle,
  RotateCcw,
  Compass,
  Gauge
} from 'lucide-react';
import { Language, SwarmPeer, DistributedTaskState, ProofShard, RoutingStrategy } from '../../types/base-dev-tools';
import { swarmCoordinator, SwarmStatus, SwarmPacketLog } from '../../utils/base-dev-tools/p2pSwarmMesh';

interface NexusSwarmProps {
  lang: Language;
  onNavigateTab?: (tab: any) => void;
}

export function NexusSwarm({ lang, onNavigateTab }: NexusSwarmProps) {
  const [status, setStatus] = useState<SwarmStatus>('connecting');
  const [peers, setPeers] = useState<SwarmPeer[]>([]);
  const [packetLogs, setPacketLogs] = useState<SwarmPacketLog[]>([]);
  const [currentTask, setCurrentTask] = useState<DistributedTaskState | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [traceSize, setTraceSize] = useState<number>(1048576); // 1M rows default
  const [routingStrategy, setRoutingStrategy] = useState<RoutingStrategy>('dynamic-score');
  const [isSimulatingFailover, setIsSimulatingFailover] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize and subscribe to P2P Swarm Mesh
  useEffect(() => {
    swarmCoordinator.init(11420000, true);

    const unsubStatus = swarmCoordinator.subscribeStatus(setStatus);
    const unsubPeers = swarmCoordinator.subscribePeers(setPeers);
    const unsubTask = swarmCoordinator.subscribeTask(setCurrentTask);
    const unsubStrategy = swarmCoordinator.subscribeStrategy(setRoutingStrategy);
    const unsubLogs = swarmCoordinator.subscribeLogs(() => {
      setPacketLogs([...swarmCoordinator.getPacketLogs()]);
    });

    setPacketLogs([...swarmCoordinator.getPacketLogs()]);
    setRoutingStrategy(swarmCoordinator.getRoutingStrategy());

    return () => {
      unsubStatus();
      unsubPeers();
      unsubTask();
      unsubStrategy();
      unsubLogs();
    };
  }, []);

  // Total Swarm Hashrate
  const totalSwarmHashrate = peers.reduce((sum, p) => (p.dataChannelState === 'open' ? sum + p.hashrate : sum), 0);

  // Handle strategy change
  const handleStrategyChange = (newStrategy: RoutingStrategy) => {
    setRoutingStrategy(newStrategy);
    swarmCoordinator.setRoutingStrategy(newStrategy);
  };

  // Disconnect / Reconnect peer toggle
  const handleTogglePeerConnection = (peer: SwarmPeer) => {
    if (peer.dataChannelState === 'open') {
      swarmCoordinator.triggerPeerDisconnection(peer.id);
    } else {
      swarmCoordinator.reconnectPeer(peer.id);
    }
  };

  // Automated Failover Test Scenario:
  // Dispatches 1M proof, and 450ms into calculation, intentionally drops the node processing Shard #3!
  const handleRunFailoverTest = () => {
    setIsSimulatingFailover(true);
    setIsDispatching(true);

    // 1. Dispatch 1M-Row Distributed Proof
    const task = swarmCoordinator.dispatchDistributedProof(traceSize);

    // 2. Drop peer for Shard 3 halfway through
    setTimeout(() => {
      const targetShard = task.shards[2] || task.shards[1];
      if (targetShard && targetShard.assignedPeerId) {
        swarmCoordinator.triggerPeerDisconnection(targetShard.assignedPeerId);
      }

      setTimeout(() => {
        setIsDispatching(false);
        setIsSimulatingFailover(false);
      }, 2000);
    }, 550);
  };

  // Interactive 2D Mesh Topology Canvas Rendering with Failover arcs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Background cyber grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Orbital rings
      [90, 160, 230].forEach((radius, i) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = i === 1 ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.06)';
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      const otherPeers = peers.filter(p => !p.isLocal);
      const peerCount = otherPeers.length;

      // Calculate node positions
      const peerPositions = otherPeers.map((peer, idx) => {
        const angle = (idx / Math.max(1, peerCount)) * Math.PI * 2 + time * 0.12;
        const radius = 145 + Math.sin(time + idx) * 12;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        return { peer, x, y };
      });

      // Draw P2P WebRTC connection lines
      peerPositions.forEach((pos1, i) => {
        const isFailed = pos1.peer.dataChannelState !== 'open' || pos1.peer.iceState === 'failed';

        // Line to center (Local Node)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(pos1.x, pos1.y);
        ctx.strokeStyle = isFailed ? 'rgba(239, 68, 68, 0.4)' : 'rgba(6, 182, 212, 0.35)';
        ctx.lineWidth = isFailed ? 1.0 : 1.5;
        if (isFailed) ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated traveling packets
        if (!isFailed) {
          const packetOffset = (time * 1.5 + i * 0.4) % 1;
          const packetX = centerX + (pos1.x - centerX) * packetOffset;
          const packetY = centerY + (pos1.y - centerY) * packetOffset;

          ctx.beginPath();
          ctx.arc(packetX, packetY, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#22d3ee';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Peer-to-Peer interconnections (mesh edges)
        const nextPeer = peerPositions[(i + 1) % peerPositions.length];
        if (nextPeer) {
          ctx.beginPath();
          ctx.moveTo(pos1.x, pos1.y);
          ctx.lineTo(nextPeer.x, nextPeer.y);
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Draw Remote Peer Nodes
      peerPositions.forEach(({ peer, x, y }) => {
        const isFailed = peer.dataChannelState !== 'open' || peer.iceState === 'failed';

        // Outer glow
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.strokeStyle = isFailed ? '#ef4444' : '#06b6d4';
        ctx.lineWidth = 2;
        if (isFailed) {
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 10;
        }
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Inner status dot
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = isFailed ? '#ef4444' : '#34d399';
        ctx.fill();

        // Score / Region Label
        ctx.fillStyle = isFailed ? '#fca5a5' : '#f8fafc';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(peer.region, x, y - 22);

        ctx.fillStyle = isFailed ? '#ef4444' : '#94a3b8';
        ctx.font = '9px monospace';
        if (isFailed) {
          ctx.fillText('ICE DROPPED', x, y + 26);
        } else {
          ctx.fillText(`Score: ${peer.routingScore || 0} · ${peer.latencyMs}ms`, x, y + 26);
        }
      });

      // Center Local Node (This Device with WebGPU)
      const centerPulse = Math.sin(time * 3) * 4;

      ctx.beginPath();
      ctx.arc(centerX, centerY, 32 + centerPulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 24, 0, Math.PI * 2);
      ctx.fillStyle = '#082f49';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LOCAL PROVER (YOU)', centerX, centerY + 42);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '10px monospace';
      ctx.fillText('WebGPU Direct 11.4M c/s', centerX, centerY + 56);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [peers]);

  const handleStart1MTraceProof = () => {
    setIsDispatching(true);
    swarmCoordinator.dispatchDistributedProof(traceSize);
    setTimeout(() => setIsDispatching(false), 2200);
  };

  return (
    <div className="space-y-8">
      {/* Hero Swarm Protocol Card */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-950 border border-neutral-800 text-white shadow-2xl p-6 sm:p-10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                {lang === 'pl' ? 'P2P SWARM MESH PROTOCOL V4' : 'P2P SWARM MESH PROTOCOL V4'}
              </span>

              <span className="text-xs text-neutral-400 font-mono bg-neutral-900 px-2.5 py-0.5 rounded-lg border border-neutral-800 flex items-center gap-1">
                <Radio className="w-3 h-3 text-cyan-400" />
                STUN: stun.l.google.com:19302
              </span>

              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-800/80 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                WebRTC DataChannels: {peers.filter(p => p.dataChannelState === 'open').length} Active
              </span>

              <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-lg border border-cyan-800/80 font-bold flex items-center gap-1">
                <Compass className="w-3 h-3 text-cyan-400" />
                Router: {routingStrategy.toUpperCase()}
              </span>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-mono">
                {lang === 'pl' ? 'ŁĄCZNA MOC ROJU P2P (SWARM HASHRATE)' : 'TOTAL SWARM AGGREGATED HASHRATE'}
              </div>
              <div className="flex items-baseline gap-3 mt-1 flex-wrap">
                <span className="text-4xl sm:text-6xl font-black tracking-tight font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-300">
                  {(totalSwarmHashrate / 1000000).toFixed(2)} Mc/s
                </span>
                <span className="text-lg font-mono text-cyan-400 font-semibold">
                  cycles/sec ({totalSwarmHashrate.toLocaleString()} c/s)
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
              {lang === 'pl'
                ? 'Inteligentny Router Zadań rozdziela shardowane poddrzewa Merkle na podstawie bieżącego pingu i mocy GPU (Mc/s). Wbudowany mechanizm Auto-Failover natychmiast przekierowuje shardy w przypadku zerwania ICE.'
                : 'Intelligent Task Router shards Merkle subtrees based on real-time peer latency and GPU throughput (Mc/s). Auto-Failover automatically redirects in-flight computations if a peer drops connection.'}
            </p>
          </div>

          {/* Action Buttons & Trace Size */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 min-w-[280px]">
            <button
              onClick={handleStart1MTraceProof}
              disabled={isDispatching || (currentTask && currentTask.status === 'computing')}
              className="flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all transform active:scale-95 shadow-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white hover:from-purple-500 hover:to-cyan-400 shadow-purple-900/30 disabled:opacity-50"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>
                {currentTask && currentTask.status === 'computing'
                  ? (lang === 'pl' ? 'Kalkulacja w Roju...' : 'Computing in Swarm...')
                  : (lang === 'pl' ? 'Składaj Dowód 1M Wierszy' : 'Prove 1M-Row Trace')}
              </span>
            </button>

            {/* Interactive Failover Test Button */}
            <button
              onClick={handleRunFailoverTest}
              disabled={isDispatching || isSimulatingFailover}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition-all bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 text-amber-300 disabled:opacity-50"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'pl' ? '💥 Testuj Auto-Failover (Zerwanie ICE)' : '💥 Test Auto-Failover Recovery'}</span>
            </button>

            <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300">
              <span className="text-neutral-500">{lang === 'pl' ? 'Ślad:' : 'Trace:'}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setTraceSize(524288)}
                  className={`px-2 py-0.5 rounded text-[11px] ${traceSize === 524288 ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
                >
                  512k
                </button>
                <button
                  onClick={() => setTraceSize(1048576)}
                  className={`px-2 py-0.5 rounded text-[11px] ${traceSize === 1048576 ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
                >
                  1M
                </button>
                <button
                  onClick={() => setTraceSize(2097152)}
                  className={`px-2 py-0.5 rounded text-[11px] ${traceSize === 2097152 ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
                >
                  2M
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Router Strategy Controls Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-neutral-900 text-sm sm:text-base">
              {lang === 'pl' ? 'Inteligentny Router Zadań zk-STARK (Routing Strategy)' : 'zk-STARK Intelligent Task Router'}
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-500">
            Multi-Factor Scoring Engine: <strong className="text-purple-600">Active</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => handleStrategyChange('dynamic-score')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              routingStrategy === 'dynamic-score'
                ? 'bg-purple-50 border-purple-500 shadow-sm'
                : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
              <span>🧠 Dynamic Weighted Score</span>
              {routingStrategy === 'dynamic-score' && <Check className="w-4 h-4 text-purple-600" />}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Hashrate Mc/s ÷ (√Ping × Obciążenie). Optymalny miks wydajności.
            </p>
          </button>

          <button
            onClick={() => handleStrategyChange('lowest-ping')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              routingStrategy === 'lowest-ping'
                ? 'bg-cyan-50 border-cyan-500 shadow-sm'
                : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
              <span>⚡ Lowest Latency First</span>
              {routingStrategy === 'lowest-ping' && <Check className="w-4 h-4 text-cyan-600" />}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Priorytet dla węzłów o najniższym RTT (&lt;15ms) z kanałami direct ICE.
            </p>
          </button>

          <button
            onClick={() => handleStrategyChange('max-gpu')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              routingStrategy === 'max-gpu'
                ? 'bg-blue-50 border-blue-500 shadow-sm'
                : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
              <span>🚀 Max GPU Power First</span>
              {routingStrategy === 'max-gpu' && <Check className="w-4 h-4 text-blue-600" />}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Maksymalny Mc/s dla klastrów WebGPU WGSL v4.2.
            </p>
          </button>

          <button
            onClick={() => handleStrategyChange('round-robin')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              routingStrategy === 'round-robin'
                ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
              <span>⚖️ Round-Robin Balancing</span>
              {routingStrategy === 'round-robin' && <Check className="w-4 h-4 text-emerald-600" />}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Równomierne rozdzielanie shardów kolejno po wszystkich peerach.
            </p>
          </button>
        </div>
      </div>

      {/* Grid: 2D Interactive Mesh Topology + Distributed Workload Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: 2D Interactive Canvas Topology Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-neutral-950 rounded-3xl border border-neutral-800 p-6 shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80 mb-4">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-base">
                {lang === 'pl' ? 'Topologia Siatki P2P WebRTC (Live Mesh)' : 'Live WebRTC P2P Mesh Topology'}
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800">
              {peers.filter(p => p.dataChannelState === 'open').length} / {peers.length} Online
            </span>
          </div>

          {/* Canvas */}
          <div className="relative w-full h-[360px] flex items-center justify-center overflow-hidden rounded-2xl bg-neutral-900/40 border border-neutral-900">
            <canvas
              ref={canvasRef}
              width={640}
              height={360}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="pt-4 border-t border-neutral-900 mt-4 flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>Direct P2P DataChannels · Zero server relay latency</span>
            <span className="text-emerald-400 font-semibold">Auto-Failover Guard: ENABLED</span>
          </div>
        </div>

        {/* Right: Distributed zk-STARK 1M-Row Slicing Visualizer (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm flex flex-col justify-between space-y-4 text-neutral-900">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-neutral-900 text-base">
                  {lang === 'pl' ? 'Rozproszone Składanie Dowodu STARK' : 'Distributed STARK Shard Engine'}
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                1M TRACE SHARDING
              </span>
            </div>

            <p className="text-xs text-neutral-500 mt-2">
              {lang === 'pl'
                ? 'Ślad 1,048,576 wierszy wykonania RISC-V podzielony na 4 shardy na podstawie routingu GPU/Ping:'
                : '1,048,576 execution rows partitioned into 4 parallel shards routed by GPU/Latency scores:'}
            </p>

            {/* Shard list */}
            <div className="space-y-3 mt-4">
              {currentTask ? (
                currentTask.shards.map((shard) => (
                  <div key={shard.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-neutral-800">{shard.label}</span>
                      <div className="flex items-center gap-1.5">
                        {shard.status === 're-routing' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 animate-pulse flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            RE-ROUTING
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          shard.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : shard.status === 're-routing'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-cyan-100 text-cyan-800'
                        }`}>
                          {shard.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 rounded-full ${
                          shard.status === 're-routing'
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                            : 'bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500'
                        }`}
                        style={{ width: `${shard.progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                      <span>Peer: {shard.assignedPeerName.split(' ')[0]}</span>
                      {shard.previousPeerName && (
                        <span className="text-amber-600 font-semibold flex items-center gap-0.5 text-[10px]">
                          <RotateCcw className="w-3 h-3" />
                          Failover ({shard.previousPeerName.split(' ')[0]} ➔ {shard.assignedPeerName.split(' ')[0]})
                        </span>
                      )}
                      {shard.subMerkleRoot ? (
                        <span className="text-emerald-600 font-semibold">{shard.subMerkleRoot.slice(0, 10)}... ({shard.computeTimeMs}ms)</span>
                      ) : (
                        <span>Computing polynomial...</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-neutral-200 rounded-2xl space-y-3">
                  <Layers className="w-8 h-8 text-neutral-400 mx-auto" />
                  <div className="text-xs text-neutral-500 font-medium">
                    {lang === 'pl' ? 'Brak aktywnego zadania. Kliknij przycisk powyżej, by uruchomić podział 1M wierszy.' : 'No active swarm proof. Click button above to slice 1M-row trace.'}
                  </div>
                  <button
                    onClick={handleStart1MTraceProof}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                  >
                    {lang === 'pl' ? 'Uruchom test 1M wierszy' : 'Start 1M-Row Test'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Aggregation summary result banner */}
          {currentTask && currentTask.status === 'completed' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  DOWÓD 1M SKOMPILOWANY!
                </span>
                <span className="font-extrabold text-emerald-700 bg-emerald-200/80 px-2 py-0.5 rounded text-[11px]">
                  {currentTask.speedupVsSingleNode}x SZYBCIEJ
                </span>
              </div>
              <div className="text-[11px] text-emerald-800">
                Czas w roju: <strong>{currentTask.totalExecutionTimeMs} ms</strong> (vs ~9,200 ms na 1 CPU)
              </div>
              <div className="text-[10px] text-neutral-500 truncate">
                Master Root: {currentTask.masterProofHash}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connected Swarm Peers Roster & Real-time WebRTC Packet Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Peers Roster & Routing Health Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-neutral-900 text-base">
                {lang === 'pl' ? 'Tabela Routingu & Zdrowia Węzłów Roju' : 'Swarm Node Health & Routing Table'}
              </h3>
            </div>
            <span className="text-xs font-mono text-neutral-500">
              {peers.length} {lang === 'pl' ? 'węzłów w sieci mesh' : 'mesh peers'}
            </span>
          </div>

          <div className="divide-y divide-neutral-100 overflow-x-auto">
            {peers.map((peer) => {
              const isFailed = peer.dataChannelState !== 'open' || peer.iceState === 'failed';

              return (
                <div key={peer.id} className="py-3 flex items-center justify-between text-xs gap-3 font-mono">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isFailed
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : peer.isLocal 
                        ? 'bg-cyan-500 text-neutral-950 font-mono shadow-md shadow-cyan-200'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {isFailed ? '⚠️' : peer.isLocal ? 'TY' : peer.region.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                        <span>{peer.name}</span>
                        {peer.isLocal && (
                          <span className="text-[10px] bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded font-mono font-semibold">
                            LOCAL (YOU)
                          </span>
                        )}
                        {isFailed && (
                          <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-semibold">
                            ICE FAILED
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-2">
                        <span>{peer.region}</span>
                        <span>·</span>
                        <span className="text-cyan-600 font-semibold">{peer.engine}</span>
                        <span>·</span>
                        <span className={peer.latencyMs > 50 ? 'text-amber-600' : 'text-emerald-600 font-semibold'}>
                          Ping: {peer.latencyMs}ms
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-purple-700 flex items-center justify-end gap-1">
                        <Gauge className="w-3.5 h-3.5" />
                        <span>Score: {peer.routingScore || 0}</span>
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {(peer.hashrate / 1000000).toFixed(1)} Mc/s · {peer.shardsProcessed} shards
                      </div>
                    </div>

                    {!peer.isLocal && (
                      <button
                        onClick={() => handleTogglePeerConnection(peer)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          isFailed
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                            : 'bg-neutral-100 hover:bg-red-50 text-neutral-600 hover:text-red-700 border border-neutral-200'
                        }`}
                        title={isFailed ? 'Reconnect Peer' : 'Simulate ICE Disconnection'}
                      >
                        {isFailed ? 'Połącz' : 'Rozłącz ICE'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time WebRTC Packet Logs (5 cols) */}
        <div className="lg:col-span-5 bg-neutral-950 rounded-3xl border border-neutral-800 p-6 shadow-2xl flex flex-col justify-between h-[420px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-neutral-400 text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-mono">
                <Terminal className="w-4 h-4" />
                <span>ROUTER_&_WEBRTC_PACKET_AUDIT</span>
              </div>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE MESH
              </span>
            </div>

            <div className="space-y-1.5 mt-3 overflow-y-auto max-h-[300px] pr-2 font-mono text-[11px]">
              {packetLogs.map((log) => (
                <div key={log.id} className="leading-relaxed flex items-start gap-1.5">
                  <span className="text-neutral-600">[{log.timestamp}]</span>
                  <span className={`px-1 py-0.2 rounded text-[10px] ${
                    log.type.includes('FAILOVER') || log.type.includes('ICE') ? 'bg-amber-950 text-amber-400 border border-amber-800/60' :
                    log.direction === 'in' ? 'bg-cyan-950 text-cyan-400' :
                    log.direction === 'out' ? 'bg-purple-950 text-purple-400' :
                    'bg-neutral-800 text-neutral-400'
                  }`}>
                    {log.direction.toUpperCase()}
                  </span>
                  <span className="text-neutral-300 truncate">
                    <strong className={log.type.includes('FAILOVER') ? 'text-amber-300' : 'text-neutral-200'}>{log.type}</strong>: {log.details}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-neutral-500 border-t border-neutral-900 pt-2 flex justify-between font-mono">
            <span>ICE Candidates: Host + Srflx Validated</span>
            <span className="text-cyan-400">Router Heartbeat: 1500ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

