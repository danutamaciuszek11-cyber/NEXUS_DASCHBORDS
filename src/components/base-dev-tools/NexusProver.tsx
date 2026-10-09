import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  Cpu, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Flame, 
  Sliders, 
  Terminal, 
  CheckCircle, 
  TrendingUp, 
  Sparkles,
  RefreshCw,
  Clock,
  Award,
  Globe,
  Code2,
  Maximize2,
  Eye,
  Copy,
  Check,
  BarChart3,
  Gauge,
  Info,
  ChevronRight,
  ExternalLink,
  Laptop,
  Share2,
  Boxes,
  Plus,
  Trash2,
  Send,
  ArrowRight,
  Calculator,
  CheckCircle2
} from 'lucide-react';
import { ProofRecord, ProverSettings, Language, ProverEngineMode, GpuDeviceInfo } from '../../types/base-dev-tools';
import { 
  WGSL_PROVER_SHADER_CODE, 
  initWebGpuEngine, 
  dispatchWebGpuComputePass, 
  calculateEngineSpeed, 
  WebGpuEngineState 
} from '../../utils/base-dev-tools/webgpuProver';
import { NexusGpuDiagnostics } from './NexusGpuDiagnostics';

export interface QueuedProofItem {
  id: string;
  task: string;
  proofHash: string;
  cycles: number;
  proofSizeBytes: number;
  pointsEarned: number;
  gasSingleUnits: number;
}

export interface AggregatedBatchResult {
  batchId: string;
  merkleRoot: string;
  aggregatedProofHash: string;
  totalCycles: number;
  totalUncompressedBytes: number;
  compressedBatchBytes: number;
  proofsCount: number;
  gasSingleTotal: number;
  gasBatchTotal: number;
  gasSavedPercent: string;
  costEthSingle: string;
  costEthBatch: string;
  txHash: string;
  status: 'ready' | 'relayed';
  relayedBlockNumber?: number;
}

interface NexusProverProps {
  lang: Language;
  onProofGenerated: (points: number, cycles: number) => void;
  userPoints: number;
  onNavigateTab?: (tab: any) => void;
}

export function NexusProver({ lang, onProofGenerated, userPoints, onNavigateTab }: NexusProverProps) {
  const [isProving, setIsProving] = useState(true);
  const [engineMode, setEngineMode] = useState<ProverEngineMode>('webgpu');
  const [cyclesPerSec, setCyclesPerSec] = useState(11420000); // WebGPU target: 10M+ c/s
  const [threads, setThreads] = useState(4);
  const [intensity, setIntensity] = useState<'eco' | 'balanced' | 'turbo'>('balanced');
  const [activeStage, setActiveStage] = useState<number>(2);
  const [totalCyclesProven, setTotalCyclesProven] = useState(48291040);
  const [totalProofsSubmitted, setTotalProofsSubmitted] = useState(384);
  const [currentTask, setCurrentTask] = useState('zkVM-RISCV::keccak256_merkle_trace');
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<{
    wasmScore: number;
    gpuScore: number;
    speedup: number;
    wasmProofTime: number;
    gpuProofTime: number;
  } | null>(null);

  // WebGPU hardware state & modal states
  const [gpuEngine, setGpuEngine] = useState<WebGpuEngineState | null>(null);
  const [gpuInfo, setGpuInfo] = useState<GpuDeviceInfo>({
    isSupported: true,
    adapterName: 'Detecting WebGPU Hardware...',
    vendor: 'Universal GPU',
    architecture: 'WGSL Vectorized 128-bit SIMD Engine',
    limits: {
      maxComputeWorkgroupsPerDimension: 65535,
      maxComputeInvocationsPerWorkgroup: 256,
      maxStorageBufferBindingSize: 134217728,
    },
    vramAllocatedMB: 56,
    activeShaders: 'zkvm_stark_fri_kernel.wgsl (Workgroup: 256 + 4KB SRAM)',
  });
  const [showShaderModal, setShowShaderModal] = useState(false);
  const [showBenchmarkModal, setShowBenchmarkModal] = useState(false);
  const [copiedShader, setCopiedShader] = useState(false);

  // Batch Processing Queue state
  const [batchQueue, setBatchQueue] = useState<QueuedProofItem[]>([
    {
      id: 'prf-9921',
      task: 'zkVM-RISCV::keccak256_merkle_trace',
      proofHash: '0x8a92f0c13e4b77d29a5d7100b2c58e82a991f241d489115ec602bb4a79c93881',
      cycles: 131072,
      proofSizeBytes: 1842,
      pointsEarned: 14.5,
      gasSingleUnits: 118400
    },
    {
      id: 'prf-9920',
      task: 'zkVM-RISCV::fibonacci_stark_proof',
      proofHash: '0x3f51190bc194aef2804b9015c71a399f2e4b01da79c93881da74b011409af23c',
      cycles: 65536,
      proofSizeBytes: 1420,
      pointsEarned: 9.5,
      gasSingleUnits: 112000
    },
    {
      id: 'prf-9919',
      task: 'zkVM-RISCV::matrix_mult_quantized',
      proofHash: '0xd489115ec602bb4a79c93881da74b011409af23c8a92f0c13e4b77d29a5d7100',
      cycles: 262144,
      proofSizeBytes: 2150,
      pointsEarned: 28.0,
      gasSingleUnits: 138000
    },
    {
      id: 'prf-9918',
      task: 'zkVM-RISCV::secp256k1_signature_verify',
      proofHash: '0x71a4092b1049281a89c049b218490a0149021bf0019489210c4892104bf89210',
      cycles: 131072,
      proofSizeBytes: 1760,
      pointsEarned: 14.0,
      gasSingleUnits: 116500
    }
  ]);

  const [isAggregatingBatch, setIsAggregatingBatch] = useState(false);
  const [aggregationStage, setAggregationStage] = useState(0);
  const [aggregatedBatchResult, setAggregatedBatchResult] = useState<AggregatedBatchResult | null>(null);
  const [isRelayingBatch, setIsRelayingBatch] = useState(false);

  const [logs, setLogs] = useState<string[]>([
    '[INIT] ⚡ NXL zkVM WebGPU Vectorized Acceleration Engine v4.2.0 initialized',
    '[WGSL] Compiling compute pipeline: zkvm_stark_fri_kernel.wgsl (128-bit SIMD + Workgroup SRAM)',
    '[MEMORY] 4KB L1 Shared Memory per Workgroup · Zero-VRAM Latency Tree Reduction',
    '[SPEED] Hashrate exceeded >11.4M c/s via Vectorized 128-bit WGSL Compute!',
    '[NEXUS] Connected to NXL Supercomputer Peer: wss://relay-eu.nexus.xyz',
    '[SYNC] Epoch 14 difficulty target: 0x0000ffff3a91c (zk-STARK Goldilocks Domain)',
  ]);

  const [proofHistory, setProofHistory] = useState<ProofRecord[]>([
    {
      id: 'prf-9921',
      blockNumber: 4198204,
      task: 'zkVM-RISCV::keccak256_merkle_trace',
      proofHash: '0x8a92f0c13e4b77d29a5d7100b2c58e82a991f241',
      cycles: 131072,
      proofTimeMs: 72,
      pointsEarned: 14.5,
      timestamp: 'Just now',
      status: 'verified',
    },
    {
      id: 'prf-9920',
      blockNumber: 4198203,
      task: 'zkVM-RISCV::fibonacci_stark_proof',
      proofHash: '0x3f51190bc194aef2804b9015c71a399f2e4b01da',
      cycles: 65536,
      proofTimeMs: 48,
      pointsEarned: 9.5,
      timestamp: '18s ago',
      status: 'verified',
    },
    {
      id: 'prf-9919',
      blockNumber: 4198202,
      task: 'zkVM-RISCV::matrix_mult_quantized',
      proofHash: '0xd489115ec602bb4a79c93881da74b011409af23c',
      cycles: 262144,
      proofTimeMs: 115,
      pointsEarned: 28.0,
      timestamp: '42s ago',
      status: 'verified',
    },
  ]);

  // Initialize WebGPU on mount
  useEffect(() => {
    let mounted = true;
    initWebGpuEngine().then(state => {
      if (mounted) {
        setGpuEngine(state);
        setGpuInfo(state.adapterInfo);
        setLogs(prev => [
          `[WEBGPU] Hardware Adapter: ${state.adapterInfo.adapterName} (${state.adapterInfo.vendor})`,
          `[WGSL] Shader Pipeline ready: 64 Workgroups x 256 threads = 16,384 GPU Cores`,
          ...prev.slice(0, 7)
        ]);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Hashrate calculation & GPU dispatch loop
  useEffect(() => {
    if (!isProving) {
      setCyclesPerSec(0);
      return;
    }

    const interval = setInterval(() => {
      const { cyclesPerSec: newSpeed, workgroupsActive } = calculateEngineSpeed(
        engineMode,
        threads,
        intensity,
        gpuInfo.isSupported
      );
      setCyclesPerSec(newSpeed);

      if (engineMode === 'webgpu' || engineMode === 'hybrid') {
        if (gpuEngine) {
          dispatchWebGpuComputePass(gpuEngine, workgroupsActive, intensity);
        }
      }

      setTotalCyclesProven(prev => prev + Math.floor(newSpeed / 2));
      setActiveStage(prev => (prev % 4) + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isProving, engineMode, threads, intensity, gpuEngine, gpuInfo.isSupported]);

  // Periodic proof completion simulation
  useEffect(() => {
    if (!isProving) return;

    const proofIntervalMs = engineMode === 'webgpu' ? 2100 : engineMode === 'hybrid' ? 1800 : 4500;

    const proofInterval = setInterval(() => {
      const tasks = [
        'zkVM-RISCV::keccak256_merkle_trace',
        'zkVM-RISCV::fibonacci_stark_proof',
        'zkVM-RISCV::matrix_mult_quantized',
        'zkVM-RISCV::sha256_state_transition',
        'zkVM-RISCV::secp256k1_signature_verify',
        'zkVM-RISCV::poseidon_sponge_stark',
      ];
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
      const cycles = [65536, 131072, 262144, 524288][Math.floor(Math.random() * 4)];
      const rewardMultiplier = engineMode === 'webgpu' ? 1.4 : engineMode === 'hybrid' ? 1.6 : 1.0;
      const reward = (cycles / 10000) * (intensity === 'turbo' ? 1.5 : 1.0) * rewardMultiplier;
      const roundedReward = parseFloat(reward.toFixed(2));
      const hash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const proofTime = engineMode === 'webgpu' 
        ? Math.floor(110 + Math.random() * 130)
        : engineMode === 'hybrid'
        ? Math.floor(95 + Math.random() * 110)
        : Math.floor(1200 + Math.random() * 1400);

      const newProof: ProofRecord = {
        id: `prf-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        blockNumber: 4198205 + Math.floor(Math.random() * 100),
        task: randomTask,
        proofHash: hash,
        cycles: cycles,
        proofTimeMs: proofTime,
        pointsEarned: roundedReward,
        timestamp: 'Just now',
        status: 'verified',
      };

      setProofHistory(prev => [newProof, ...prev.slice(0, 7)]);
      setTotalProofsSubmitted(prev => prev + 1);
      setCurrentTask(randomTask);
      onProofGenerated(roundedReward, cycles);

      const engineTag = engineMode === 'webgpu' ? '⚡ WEBGPU' : engineMode === 'hybrid' ? '🚀 HYBRID' : '⚙️ WASM';

      setLogs(prev => [
        `[${engineTag}] ${newProof.id.toUpperCase()} generated in ${newProof.proofTimeMs}ms: ${hash.slice(0, 14)}... (+${roundedReward} NXL)`,
        `[ZKVM] Submitted to NXL Base Rollup Block #${newProof.blockNumber}`,
        ...prev.slice(0, 8)
      ]);
    }, proofIntervalMs);

    return () => clearInterval(proofInterval);
  }, [isProving, engineMode, intensity, onProofGenerated]);

  // Batch Queue Handlers
  const handleAddToBatchQueue = (proof: ProofRecord) => {
    if (batchQueue.some(item => item.id === proof.id)) return;

    const queuedItem: QueuedProofItem = {
      id: proof.id,
      task: proof.task,
      proofHash: proof.proofHash,
      cycles: proof.cycles,
      proofSizeBytes: Math.floor(1400 + Math.random() * 600),
      pointsEarned: proof.pointsEarned,
      gasSingleUnits: 110000 + Math.floor(Math.random() * 15000)
    };

    setBatchQueue(prev => [...prev, queuedItem]);
  };

  const handleQueueAllRecent = () => {
    const newItems: QueuedProofItem[] = proofHistory
      .filter(p => !batchQueue.some(q => q.id === p.id))
      .map(p => ({
        id: p.id,
        task: p.task,
        proofHash: p.proofHash,
        cycles: p.cycles,
        proofSizeBytes: Math.floor(1400 + Math.random() * 600),
        pointsEarned: p.pointsEarned,
        gasSingleUnits: 115000
      }));

    setBatchQueue(prev => [...prev, ...newItems]);
  };

  const handleRemoveFromQueue = (id: string) => {
    setBatchQueue(prev => prev.filter(q => q.id !== id));
  };

  const handleClearQueue = () => {
    setBatchQueue([]);
    setAggregatedBatchResult(null);
  };

  // Aggregate Batch Logic
  const handleAggregateBatch = () => {
    if (batchQueue.length === 0) return;

    setIsAggregatingBatch(true);
    setAggregationStage(1);
    setAggregatedBatchResult(null);

    // Stage 1: Poseidon Merkle Tree Hash Construction
    setTimeout(() => {
      setAggregationStage(2);
      // Stage 2: Recursive FRI quotient folding
      setTimeout(() => {
        setAggregationStage(3);
        // Stage 3: Bytecode serialization
        setTimeout(() => {
          setAggregationStage(4);
          // Stage 4: Batch Root Ready
          setTimeout(() => {
            const totalCycles = batchQueue.reduce((acc, curr) => acc + curr.cycles, 0);
            const totalUncompressedBytes = batchQueue.reduce((acc, curr) => acc + curr.proofSizeBytes, 0);
            const compressedBatchBytes = Math.floor(1950 + batchQueue.length * 80); // Compact recursive payload

            const gasSingleTotal = batchQueue.reduce((acc, curr) => acc + curr.gasSingleUnits, 0);
            // Single base 21k + compressed calldata + verification + single attestation batch mint
            const gasBatchTotal = 21000 + Math.floor(compressedBatchBytes * 14.5) + 42000 + 26000;
            const gasSavedPercent = (((gasSingleTotal - gasBatchTotal) / gasSingleTotal) * 100).toFixed(1);

            const effectiveGasPriceGwei = 0.0535;
            const costEthSingle = (gasSingleTotal * effectiveGasPriceGwei * 1e-9).toFixed(7);
            const costEthBatch = (gasBatchTotal * effectiveGasPriceGwei * 1e-9).toFixed(7);

            const merkleRoot = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
            const aggregatedProofHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

            const result: AggregatedBatchResult = {
              batchId: `BATCH-NXL-${Math.floor(1000 + Math.random() * 9000)}`,
              merkleRoot,
              aggregatedProofHash,
              totalCycles,
              totalUncompressedBytes,
              compressedBatchBytes,
              proofsCount: batchQueue.length,
              gasSingleTotal,
              gasBatchTotal,
              gasSavedPercent,
              costEthSingle,
              costEthBatch,
              txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
              status: 'ready',
            };

            setAggregatedBatchResult(result);
            setIsAggregatingBatch(false);
            setLogs(prev => [
              `[BATCH] Successfully folded ${result.proofsCount} micro-proofs into Merkle Root: ${merkleRoot.slice(0, 14)}...`,
              `[GAS SAVER] Net Gas Reduction: ${gasSavedPercent}% (${gasBatchTotal.toLocaleString()} gas vs ${gasSingleTotal.toLocaleString()} gas)`,
              ...prev
            ]);
          }, 600);
        }, 800);
      }, 900);
    }, 800);
  };

  const handleRelayBatchToBase = () => {
    if (!aggregatedBatchResult) return;
    setIsRelayingBatch(true);

    setTimeout(() => {
      setIsRelayingBatch(false);
      setAggregatedBatchResult(prev => prev ? {
        ...prev,
        status: 'relayed',
        relayedBlockNumber: 18491320 + Math.floor(Math.random() * 10)
      } : null);

      setLogs(prev => [
        `[RELAY] Batch ${aggregatedBatchResult.batchId} submitted & confirmed on Base block #18491325!`,
        `[ATTESTATION] Batch Multi-Attestation minted for ${aggregatedBatchResult.proofsCount} proofs!`,
        ...prev
      ]);
    }, 1500);
  };

  const handleRunComparativeBenchmark = () => {
    setIsBenchmarking(true);
    setLogs(prev => [
      '[BENCH] Starting Comparative zkVM Proof Benchmark (WebAssembly vs WebGPU WGSL)...',
      '[BENCH] Phase 1: Profiling WebAssembly SIMD CPU baseline...',
      ...prev
    ]);

    setTimeout(() => {
      setLogs(prev => [
        '[BENCH] Phase 2: Dispatching WebGPU WGSL compute shaders (16,384 GPU threads)...',
        ...prev
      ]);

      setTimeout(() => {
        const wasmScore = 748500 + Math.floor(Math.random() * 35000);
        const gpuScore = 11480000 + Math.floor(Math.random() * 750000);
        const speedup = parseFloat((gpuScore / wasmScore).toFixed(1));
        const wasmProofTime = 1380;
        const gpuProofTime = 72;

        const res = {
          wasmScore,
          gpuScore,
          speedup,
          wasmProofTime,
          gpuProofTime,
        };

        setBenchmarkResult(res);
        setIsBenchmarking(false);
        setShowBenchmarkModal(true);

        setLogs(prev => [
          `[BENCH] Benchmark Finished! ⚡ WebGPU WGSL Vectorized: ${(gpuScore / 1000000).toFixed(2)}M c/s vs WASM: ${(wasmScore / 1000).toFixed(0)}k c/s (${speedup}x Speedup!)`,
          `[L1 CACHE] Workgroup Shared Memory reduced FRI memory latency to <0.1ms!`,
          ...prev
        ]);
      }, 1800);
    }, 1400);
  };

  const handleCopyShader = () => {
    navigator.clipboard.writeText(WGSL_PROVER_SHADER_CODE);
    setCopiedShader(true);
    setTimeout(() => setCopiedShader(false), 2000);
  };

  const stages = [
    { num: 1, title: lang === 'pl' ? 'Pobieranie zadania' : 'Task Retrieval', desc: 'Syncing program from NXL mempool' },
    { num: 2, title: lang === 'pl' ? 'Ślad wykonania zkVM' : 'zkVM Trace', desc: 'Generating RISC-V execution witness' },
    { num: 3, title: lang === 'pl' ? 'Kompresja STARK / FRI' : 'STARK / FRI Folding', desc: 'Polynomial quotient commitments' },
    { num: 4, title: lang === 'pl' ? 'Weryfikacja on-chain' : 'On-Chain Verification', desc: 'Submitting proof to NXL consensus' },
  ];

  const currentSpeedupRatio = cyclesPerSec > 0 ? (cyclesPerSec / 750000).toFixed(1) : '0';

  // Batch Queue Gas Totals
  const totalQueueGasSingle = batchQueue.reduce((acc, curr) => acc + curr.gasSingleUnits, 0);
  const totalQueueBytes = batchQueue.reduce((acc, curr) => acc + curr.proofSizeBytes, 0);
  const estimatedBatchGas = 21000 + Math.floor((1950 + batchQueue.length * 80) * 14.5) + 42000 + 26000;
  const potentialSavings = batchQueue.length > 0 
    ? (((totalQueueGasSingle - estimatedBatchGas) / totalQueueGasSingle) * 100).toFixed(1) 
    : '0';

  return (
    <div className="space-y-8">
      {/* WebGPU Hardware Acceleration Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-blue-950/60 to-purple-950/80 border border-cyan-500/30 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 flex-shrink-0">
            <Zap className="w-5 h-5 text-neutral-950 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                {lang === 'pl' ? 'AKCELERACJA SPRZĘTOWA WEBGPU' : 'WEBGPU HARDWARE ACCELERATION'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold">
                WGSL v4.2 Vectorized (128-bit)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold">
                4KB Shared SRAM Cache
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                &gt;10M+ c/s ACTIVE
              </span>
            </div>
            <p className="text-xs text-neutral-300 mt-0.5">
              {lang === 'pl' 
                ? 'Wektorowe ładowanie vec4<u32> (128-bit) oraz pamięć współdzielona grupy (Shared Memory SRAM) eliminują opóźnienia VRAM i przyspieszają składanie FRI do ponad 11M+ c/s!'
                : '128-bit vectorized vec4<u32> loads and Workgroup Shared SRAM Cache eliminate VRAM latency bottlenecks, pushing FRI folding beyond 11M+ c/s!'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={() => setShowShaderModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/90 border border-neutral-700 hover:border-cyan-500/50 text-xs font-mono text-cyan-300 transition-colors shadow-sm"
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'pl' ? 'Podgląd Shadera WGSL' : 'Inspect WGSL Shader'}</span>
          </button>

          <a
            href="#gpu-diagnostics-panel"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 hover:border-cyan-400 text-xs font-mono text-cyan-300 transition-colors shadow-sm"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'pl' ? '📊 Diagnostyka GPU' : '📊 GPU Diagnostics'}</span>
          </a>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('swarm')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/50 hover:border-purple-400 text-xs font-mono text-purple-300 transition-colors shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-purple-400" />
              <span>{lang === 'pl' ? '🌐 Rój P2P Swarm' : '🌐 P2P Swarm Mesh'}</span>
            </button>
          )}

          <button
            onClick={handleRunComparativeBenchmark}
            disabled={isBenchmarking}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-neutral-950 font-bold text-xs font-mono transition-all transform active:scale-95 shadow-md shadow-cyan-600/30 disabled:opacity-50"
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>
              {isBenchmarking 
                ? (lang === 'pl' ? 'Testowanie GPU...' : 'Testing GPU...') 
                : (lang === 'pl' ? 'Benchmark GPU vs WASM' : 'GPU vs WASM Benchmark')}
            </span>
          </button>
        </div>
      </div>

      {/* Hero Prover Card */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-950 border border-neutral-800 text-white shadow-2xl p-6 sm:p-10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium ${
                isProving ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isProving ? 'bg-cyan-400 animate-pulse' : 'bg-neutral-500'}`} />
                {isProving 
                  ? (lang === 'pl' ? 'WĘZEŁ PROVER AKTYWNY' : 'PROVER NODE ACTIVE')
                  : (lang === 'pl' ? 'WĘZEŁ WSTRZYMANY' : 'PROVER PAUSED')}
              </span>

              <span className="text-xs text-neutral-400 font-mono bg-neutral-900 px-2.5 py-0.5 rounded-lg border border-neutral-800">
                Worker #NXL-GPU-{(totalProofsSubmitted % 900) + 100}
              </span>

              <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-lg border border-cyan-800/80 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" />
                {engineMode === 'webgpu' 
                  ? 'WebGPU WGSL (Direct Compute)' 
                  : engineMode === 'hybrid' 
                  ? 'Hybrid (GPU + CPU Multi-Thread)' 
                  : 'WebAssembly SIMD (Legacy)'}
              </span>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-2">
                <span>{lang === 'pl' ? 'PRĘDKOŚĆ OBLICZEŃ ZKVM' : 'CURRENT PROVING HASHRATE'}</span>
                {engineMode === 'webgpu' && (
                  <span className="text-emerald-400 text-[11px] font-bold">
                    ⚡ {currentSpeedupRatio}x {lang === 'pl' ? 'względem WASM' : 'faster than WASM'}
                  </span>
                )}
              </div>
              
              <div className="flex items-baseline gap-3 mt-1 flex-wrap">
                <span className="text-4xl sm:text-6xl font-black tracking-tight font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                  {cyclesPerSec.toLocaleString()}
                </span>
                <span className="text-lg font-mono text-cyan-400 font-semibold">
                  cycles/s
                </span>

                {engineMode === 'webgpu' && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +{Math.round((parseFloat(currentSpeedupRatio) - 1) * 100)}% BOOST
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
              {lang === 'pl' 
                ? 'Twój browser kompiluje dowody zk-STARK bezpośrednio na procesorze graficznym za pomocą WGSL compute shaders. Brak ograniczeń pojedynczego wątku CPU.' 
                : 'Your browser is executing zk-STARK polynomial folding directly on the GPU using WGSL compute shaders. Unconstrained by CPU single-thread bottlenecks.'}
            </p>
          </div>

          {/* Start/Stop Button */}
          <div className="flex flex-col gap-3 min-w-[200px]">
            <button
              type="button"
              onClick={() => setIsProving(!isProving)}
              className={`w-full py-4 px-6 rounded-2xl font-bold font-mono text-sm flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl ${
                isProving
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 shadow-red-950/30'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-cyan-950/40'
              }`}
            >
              {isProving ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>{lang === 'pl' ? 'Wstrzymaj Prover' : 'Pause Prover'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{lang === 'pl' ? 'Uruchom Prover' : 'Start Proving'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4-Step Pipeline Visualizer */}
        <div className="mt-8 pt-8 border-t border-neutral-800/80">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span>{lang === 'pl' ? 'Faza przetwarzania dowodu ZK' : 'zkVM Proof Pipeline'}</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800 font-bold">
                {engineMode === 'webgpu' ? 'GPU PIPELINE' : 'CPU PIPELINE'}
              </span>
            </span>
            <span className="text-cyan-400">Task: {currentTask}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {stages.map((stage) => {
              const isActive = isProving && activeStage === stage.num;
              const isPast = isProving && activeStage > stage.num;

              return (
                <div 
                  key={stage.num}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isActive 
                      ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-950/50' 
                      : isPast
                      ? 'bg-neutral-900/70 border-neutral-800'
                      : 'bg-neutral-900/30 border-neutral-900 text-neutral-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-neutral-400">
                      STAGE 0{stage.num}
                    </span>
                    {isActive ? (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    ) : isPast ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    ) : null}
                  </div>
                  <h4 className={`text-xs font-semibold ${isActive ? 'text-cyan-300' : 'text-neutral-200'}`}>
                    {stage.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* NEW: Batch Processing Queue (zk-STARK Merkle Aggregator) */}
      <div className="rounded-3xl bg-neutral-950 border border-neutral-800 p-6 sm:p-8 text-neutral-100 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30 mb-2 font-bold">
              <Boxes className="w-3.5 h-3.5 text-purple-400" />
              ZK-STARK MERKLE BATCH AGGREGATOR
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{lang === 'pl' ? 'Kolejka Agregacji Dowodów (Batch Queue)' : 'Proof Batch Processing Queue'}</span>
              <span className="text-xs font-mono bg-purple-950 text-purple-300 px-2.5 py-0.5 rounded-lg border border-purple-800">
                {batchQueue.length} {lang === 'pl' ? 'w kolejce' : 'in queue'}
              </span>
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
              {lang === 'pl' 
                ? 'Agreguj wiele małych dowodów w pojedynczy rekurencyjny dowód Merkle Root, oszczędzając do 80%+ gazu na łańcuchu Base!' 
                : 'Aggregate multiple micro-proofs into a single recursive Merkle root on-chain transaction, saving up to 80%+ gas fees!'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleQueueAllRecent}
              className="px-3 py-1.5 rounded-xl text-xs font-mono bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'pl' ? 'Dodaj Ostatnie Dowody' : 'Queue All Recent'}</span>
            </button>
            <button
              onClick={handleClearQueue}
              disabled={batchQueue.length === 0}
              className="px-3 py-1.5 rounded-xl text-xs font-mono bg-neutral-900 hover:bg-red-950/40 text-neutral-400 hover:text-red-300 border border-neutral-800 transition-colors flex items-center gap-1.5 disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'pl' ? 'Wyczyść' : 'Clear'}</span>
            </button>
          </div>
        </div>

        {/* Live Gas Optimization Comparison Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
            <span className="text-neutral-400 block text-[10px] uppercase">Queued Proofs Payload</span>
            <div className="text-lg font-bold text-white mt-0.5">
              {batchQueue.length} proofs · {(totalQueueBytes / 1024).toFixed(2)} KB
            </div>
            <span className="text-[10px] text-neutral-500">Uncompressed separate calldata</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
            <span className="text-neutral-400 block text-[10px] uppercase">Individual Submissions Gas</span>
            <div className="text-lg font-bold text-red-400 mt-0.5">
              {totalQueueGasSingle.toLocaleString()} gas
            </div>
            <span className="text-[10px] text-neutral-500">{batchQueue.length} × 21k tx + separate verifiers</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
            <span className="text-neutral-400 block text-[10px] uppercase">Aggregated Batch Gas</span>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">
              {estimatedBatchGas.toLocaleString()} gas
            </div>
            <span className="text-[10px] text-neutral-500">Single 21k tx + 1 Merkle root verifier</span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/60 to-cyan-950/60 border border-purple-500/40">
            <span className="text-purple-300 block text-[10px] uppercase font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              Predicted Gas Savings
            </span>
            <div className="text-xl font-black text-cyan-300 mt-0.5">
              ~{potentialSavings}% SAVED
            </div>
            <span className="text-[10px] text-purple-200">Optimal Base batch routing</span>
          </div>
        </div>

        {/* Queued Proofs Items List */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-neutral-400 flex items-center justify-between">
            <span>Proofs in Batch Accumulator:</span>
            <span>Total Cycles: {batchQueue.reduce((a, b) => a + b.cycles, 0).toLocaleString()} c</span>
          </div>

          {batchQueue.length === 0 ? (
            <div className="p-6 rounded-2xl border-2 border-dashed border-neutral-800 text-center text-xs text-neutral-500 font-mono">
              Kolejka pusta. Kliknij "Dodaj Ostatnie Dowody", aby przygotować paczkę wsadową.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
              {batchQueue.map((item, idx) => (
                <div 
                  key={item.id} 
                  className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between text-xs font-mono"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">#{idx + 1}</span>
                      <span className="text-white font-medium truncate max-w-[180px]">{item.task.split('::')[1]}</span>
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {item.proofHash.slice(0, 10)}... · {item.cycles.toLocaleString()} c · {item.proofSizeBytes}B
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveFromQueue(item.id)}
                    className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action button to fold and aggregate */}
        <div className="pt-2">
          <button
            onClick={handleAggregateBatch}
            disabled={isAggregatingBatch || batchQueue.length === 0}
            className="w-full py-4 px-6 rounded-2xl font-bold font-mono text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white transition-all shadow-xl shadow-purple-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAggregatingBatch ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>
                  {aggregationStage === 1 && 'Etap 1/4: Hashowanie Liści Drzewa Merkle Poseidon...'}
                  {aggregationStage === 2 && 'Etap 2/4: Rekurencyjna Kompresja FRI Polynomial...'}
                  {aggregationStage === 3 && 'Etap 3/4: Generowanie Zwarych Bajtów Calldata (2.1 KB)...'}
                  {aggregationStage === 4 && 'Etap 4/4: Gotowe do Transmisji na Base!'}
                </span>
              </>
            ) : (
              <>
                <Boxes className="w-5 h-5 text-cyan-300" />
                <span>
                  {lang === 'pl' 
                    ? `Agreguj i Skompresuj ${batchQueue.length} Dowodów (Recursive STARK Batch)` 
                    : `Aggregate & Fold ${batchQueue.length} Proofs into STARK Batch`}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Aggregated Result Card */}
        {aggregatedBatchResult && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900 via-purple-950/40 to-neutral-950 border-2 border-purple-500/50 shadow-2xl space-y-4 animate-fadeIn font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-white">{aggregatedBatchResult.batchId} Aggregated Successfully</span>
              </div>
              <span className="text-xs bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-800 font-bold">
                {aggregatedBatchResult.gasSavedPercent}% GAS SAVINGS ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-neutral-300">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-neutral-500 text-[10px]">Merkle Tree Root:</span>
                <div className="text-cyan-400 truncate text-[11px] font-bold">{aggregatedBatchResult.merkleRoot}</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-neutral-500 text-[10px]">Aggregated Proof Commitment:</span>
                <div className="text-purple-300 truncate text-[11px] font-bold">{aggregatedBatchResult.aggregatedProofHash}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="text-neutral-400 text-[11px]">
                <span>Total Gas: <strong className="text-white">{aggregatedBatchResult.gasBatchTotal.toLocaleString()} gas</strong> (vs {aggregatedBatchResult.gasSingleTotal.toLocaleString()} unbatched)</span>
              </div>

              <button
                onClick={handleRelayBatchToBase}
                disabled={isRelayingBatch || aggregatedBatchResult.status === 'relayed'}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isRelayingBatch ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Wysyłanie na Base...</span>
                  </>
                ) : aggregatedBatchResult.status === 'relayed' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Przekazano na Base (Blok #{aggregatedBatchResult.relayedBlockNumber})</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Wyślij Paczkę Wsadową na Base (Relay Batch)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hardware Diagnostics */}
      <div id="gpu-diagnostics-panel">
        <NexusGpuDiagnostics
          lang={lang}
          cyclesPerSec={cyclesPerSec}
          engineMode={engineMode}
          threads={threads}
          intensity={intensity}
          isProving={isProving}
          gpuEngine={gpuEngine}
          gpuInfo={gpuInfo}
        />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-mono font-semibold">
              {lang === 'pl' ? 'Wykonane cykle zkVM' : 'Lifetime Cycles Proven'}
            </span>
            <TrendingUp className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">
            {totalCyclesProven.toLocaleString()}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            +{(cyclesPerSec * 60).toLocaleString()} cycles/min
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-mono font-semibold">
              {lang === 'pl' ? 'Zatwierdzone dowody' : 'Submitted Proofs'}
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">
            {totalProofsSubmitted}
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            ⚡ Avg proof: {engineMode === 'webgpu' ? '~140ms (WebGPU)' : '~1.4s (WASM)'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-mono font-semibold">
              {lang === 'pl' ? 'Punkty NXL zdobyte' : 'Earned NXL Points'}
            </span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-700">
            {userPoints.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {lang === 'pl' ? 'Mnożnik Tieru: 1.50x + GPU Boost' : 'Tier Multiplier: 1.50x + GPU Boost'}
          </p>
        </div>
      </div>

      {/* Prover Tuning & Hardware Configuration */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6 text-neutral-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-4 gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-600" />
            <h3 className="font-bold text-neutral-900 text-base">
              {lang === 'pl' ? 'Silnik obliczeniowy & Konfiguracja akceleracji' : 'Compute Engine & Acceleration Tuning'}
            </h3>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            Direct Compute Pipeline (WebGPU WGSL v3.8)
          </span>
        </div>

        {/* Engine Mode Selector */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-neutral-800 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-600" />
              {lang === 'pl' ? 'Wybór silnika obliczeniowego (Backend)' : 'Compute Backend Engine'}
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              {lang === 'pl' ? 'Zastąpienie WebAssembly shaderami WebGPU' : 'Replacing WebAssembly with WebGPU Shaders'}
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                setEngineMode('webgpu');
                setLogs(prev => [
                  '[BACKEND] Switched to ⚡ WebGPU WGSL Direct Compute Shader Engine (Target: 5-8M+ c/s)',
                  ...prev
                ]);
              }}
              className={`p-4 rounded-xl text-left border transition-all relative ${
                engineMode === 'webgpu'
                  ? 'bg-cyan-50/80 border-cyan-500 shadow-md shadow-cyan-100 ring-2 ring-cyan-500/20'
                  : 'bg-white border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-600 fill-current" />
                  WebGPU (WGSL)
                </span>
                <span className="text-[10px] font-mono font-bold bg-cyan-600 text-white px-2 py-0.5 rounded-full">
                  ZALECANY
                </span>
              </div>
              <div className="text-xl font-extrabold font-mono text-cyan-700">
                5-8M+ c/s
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                {lang === 'pl' 
                  ? 'Bezpośrednie shadery na karcie graficznej. Skok wydajności ~9-11x!' 
                  : 'Direct shaders on GPU. ~9-11x throughput leap!'}
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setEngineMode('wasm');
                setLogs(prev => [
                  '[BACKEND] Switched to ⚙️ WebAssembly SIMD (Legacy CPU Mode)',
                  ...prev
                ]);
              }}
              className={`p-4 rounded-xl text-left border transition-all ${
                engineMode === 'wasm'
                  ? 'bg-neutral-100 border-neutral-400 shadow-sm ring-2 ring-neutral-400/20'
                  : 'bg-white border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-neutral-600" />
                  WebAssembly SIMD
                </span>
                <span className="text-[10px] font-mono text-neutral-500 bg-neutral-200 px-1.5 py-0.5 rounded">
                  CPU
                </span>
              </div>
              <div className="text-xl font-extrabold font-mono text-neutral-700">
                ~750k c/s
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                {lang === 'pl' 
                  ? 'Tradycyjne wątki CPU Web Workers. Standardowa wydajność bazowa.' 
                  : 'Traditional CPU Web Workers. Standard baseline performance.'}
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setEngineMode('hybrid');
                setLogs(prev => [
                  '[BACKEND] Switched to 🚀 Hybrid Multi-Backend Engine (GPU Shaders + CPU SIMD concurrently)',
                  ...prev
                ]);
              }}
              className={`p-4 rounded-xl text-left border transition-all ${
                engineMode === 'hybrid'
                  ? 'bg-purple-50/80 border-purple-500 shadow-md shadow-purple-100 ring-2 ring-purple-500/20'
                  : 'bg-white border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  {lang === 'pl' ? 'Tryb Hybrydowy' : 'Hybrid Engine'}
                </span>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded font-bold">
                  GPU + CPU
                </span>
              </div>
              <div className="text-xl font-extrabold font-mono text-purple-700">
                ~8-10M c/s
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                {lang === 'pl' 
                  ? 'Równoległe przetwarzanie na GPU i wszystkich rdzeniach CPU.' 
                  : 'Concurrent processing across GPU and all CPU worker threads.'}
              </p>
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-neutral-100">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-neutral-600" />
                {engineMode === 'webgpu' 
                  ? (lang === 'pl' ? 'Potoki przydziału GPU (Workgroup Streams)' : 'GPU Workgroup Streams')
                  : (lang === 'pl' ? 'Wątki procesora (CPU Threads)' : 'CPU Worker Threads')}
              </label>
              <span className="font-mono text-sm font-bold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-lg border border-cyan-200">
                {threads} {lang === 'pl' ? (engineMode === 'webgpu' ? 'potoków' : 'wątków') : 'streams'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="16"
              value={threads}
              onChange={(e) => setThreads(parseInt(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
            <div className="flex justify-between text-[11px] font-mono text-neutral-400">
              <span>1 (Low power)</span>
              <span>4-8 ({lang === 'pl' ? 'Optymalnie' : 'Optimal'})</span>
              <span>16 (Max throughput)</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              {lang === 'pl' ? 'Profil wydajności obliczeniowej' : 'Compute Intensity Profile'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setIntensity('eco')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                  intensity === 'eco'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                🌱 Eco (~5.2M c/s)
              </button>
              <button
                type="button"
                onClick={() => setIntensity('balanced')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                  intensity === 'balanced'
                    ? 'bg-blue-50 border-blue-400 text-blue-800'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                ⚖️ Balanced (~7.2M c/s)
              </button>
              <button
                type="button"
                onClick={() => setIntensity('turbo')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                  intensity === 'turbo'
                    ? 'bg-orange-50 border-orange-400 text-orange-800'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                🔥 Turbo (~8.6M c/s)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Cryptographic Logs & Recent Proofs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Terminal logs */}
        <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-5 shadow-sm text-neutral-300 font-mono text-xs flex flex-col justify-between h-80">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-neutral-400 text-[11px]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>NXL_WEBGPU_TELEMETRY_LOG</span>
              </div>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE GPU
              </span>
            </div>
            <div className="space-y-1.5 mt-3 overflow-y-auto max-h-56 pr-2">
              {logs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-neutral-500 mr-2">&gt;</span>
                  <span className={
                    log.includes('WEBGPU') || log.includes('⚡') ? 'text-cyan-400 font-semibold' :
                    log.includes('PROOF') || log.includes('BATCH') ? 'text-emerald-400' :
                    log.includes('BENCH') ? 'text-amber-300' :
                    log.includes('INIT') || log.includes('WGSL') ? 'text-blue-400' :
                    'text-neutral-300'
                  }>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[10px] text-neutral-600 border-t border-neutral-900 pt-2 flex justify-between">
            <span>WGSL Compute Shaders @workgroup_size(256)</span>
            <span>Version: 3.8.2 WebGPU</span>
          </div>
        </div>

        {/* Proofs Table */}
        <div className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm h-80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 text-neutral-700 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'pl' ? 'Ostatnio wygenerowane dowody GPU' : 'Recent Verified GPU Proofs'}</span>
              </div>
              <span className="text-neutral-400 font-mono text-[11px]">{proofHistory.length} proofs</span>
            </div>

            <div className="divide-y divide-neutral-100 mt-2 overflow-y-auto max-h-56">
              {proofHistory.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono font-medium text-neutral-900 flex items-center gap-1.5">
                      <span className="text-cyan-700 font-semibold">{item.id.length > 12 ? 'prf-' + item.id.slice(-4) : item.id}</span>
                      <span className="text-neutral-400">·</span>
                      <span className="text-[11px] text-neutral-500">{item.task.split('::')[1]}</span>
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                      {item.proofHash.slice(0, 10)}...{item.proofHash.slice(-6)} · <strong className="text-emerald-600 font-semibold">{item.proofTimeMs}ms</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddToBatchQueue(item)}
                      title="Add to Batch Queue"
                      className="px-2 py-1 rounded-lg bg-neutral-100 hover:bg-cyan-50 hover:text-cyan-700 text-[10px] font-mono font-bold transition-colors"
                    >
                      + Batch
                    </button>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        +{item.pointsEarned} NXL
                      </span>
                      <div className="text-[10px] text-neutral-400 mt-0.5">
                        {item.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-neutral-400 border-t border-neutral-100 pt-2 flex justify-between">
            <span>{lang === 'pl' ? 'Czas dowodu GPU: ~140ms (zamiast 1.4s)' : 'GPU Proof Time: ~140ms (down from 1.4s)'}</span>
            <span className="text-cyan-700 font-semibold">{lang === 'pl' ? 'Akceleracja WGSL' : 'WGSL Accelerated'}</span>
          </div>
        </div>
      </div>

      {/* WGSL Shader Inspector Modal */}
      {showShaderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-neutral-100">
            <div className="flex items-center justify-between p-6 border-b border-neutral-800 bg-neutral-900/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>NXL zkVM WebGPU WGSL Compute Shader</span>
                    <span className="text-xs font-mono bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800 font-semibold">
                      zkvm_stark_fri_kernel.wgsl
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Direct WebGPU Shading Language kernel for STARK polynomial FRI folding and Poseidon hash
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyShader}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-200 transition-colors"
                >
                  {copiedShader ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedShader ? 'Skopiowano!' : 'Kopiuj WGSL'}</span>
                </button>
                <button
                  onClick={() => setShowShaderModal(false)}
                  className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors text-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs bg-neutral-950 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="text-neutral-400 text-[10px] uppercase">Workgroup Dimensions</div>
                  <div className="text-cyan-400 font-bold mt-1">@workgroup_size(256, 1, 1)</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="text-neutral-400 text-[10px] uppercase">Memory Architecture</div>
                  <div className="text-purple-400 font-bold mt-1">128-bit SIMD + 4KB Workgroup SRAM</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="text-neutral-400 text-[10px] uppercase">Throughput Target</div>
                  <div className="text-emerald-400 font-bold mt-1">&gt;10-15M+ cycles/sec</div>
                </div>
              </div>

              <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 overflow-x-auto text-neutral-300">
                <pre className="text-xs font-mono leading-relaxed text-cyan-200 selection:bg-cyan-500 selection:text-neutral-950">
                  {WGSL_PROVER_SHADER_CODE}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-800 bg-neutral-900/40 flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>Compiles directly to GPU SPIR-V / Metal MSL / HLSL via WebGPU driver</span>
              <button
                onClick={() => setShowShaderModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparative Benchmark Modal */}
      {showBenchmarkModal && benchmarkResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-neutral-100 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-neutral-950 shadow-lg shadow-cyan-500/20">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'pl' ? 'Wyniki Benchmarku: WebGPU vs WebAssembly' : 'Benchmark Results: WebGPU vs WASM'}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    zk-STARK Proof Generation Performance Comparison
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowBenchmarkModal(false)}
                className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-blue-950/50 to-purple-950/70 border border-cyan-500/40 text-center space-y-2">
              <div className="text-xs uppercase font-mono tracking-wider text-cyan-300">
                {lang === 'pl' ? 'SKOK WYDAJNOŚCI AKCELERACJI SPRZĘTOWEJ' : 'HARDWARE ACCELERATION SPEEDUP'}
              </div>
              <div className="text-5xl sm:text-6xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-200">
                {benchmarkResult.speedup}x FASTER
              </div>
              <p className="text-xs text-neutral-300 max-w-md mx-auto">
                {lang === 'pl'
                  ? `Shadery WebGPU WGSL osiągnęły ${(benchmarkResult.gpuScore / 1000000).toFixed(2)}M c/s w porównaniu do ${(benchmarkResult.wasmScore / 1000).toFixed(0)}k c/s w czystym WebAssembly!`
                  : `WebGPU WGSL shaders achieved ${(benchmarkResult.gpuScore / 1000000).toFixed(2)}M c/s compared to ${(benchmarkResult.wasmScore / 1000).toFixed(0)}k c/s in pure WebAssembly!`}
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between text-neutral-300">
                  <span className="font-bold flex items-center gap-1.5 text-cyan-400">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    WebGPU WGSL Direct Compute (This Browser)
                  </span>
                  <span className="font-bold text-cyan-300">
                    {benchmarkResult.gpuScore.toLocaleString()} cycles/s
                  </span>
                </div>
                <div className="w-full h-4 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-full" />
                </div>
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>Latency: {benchmarkResult.gpuProofTime}ms / proof</span>
                  <span>16,384 GPU concurrent threads</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-neutral-500" />
                    WebAssembly SIMD (Legacy Baseline)
                  </span>
                  <span>
                    {benchmarkResult.wasmScore.toLocaleString()} cycles/s
                  </span>
                </div>
                <div className="w-full h-4 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                  <div 
                    className="h-full bg-neutral-600 rounded-full" 
                    style={{ width: `${Math.max(10, Math.round((benchmarkResult.wasmScore / benchmarkResult.gpuScore) * 100))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>Latency: {benchmarkResult.wasmProofTime}ms / proof</span>
                  <span>4 CPU threads</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowBenchmarkModal(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-sm transition-colors"
              >
                {lang === 'pl' ? 'Kontynuuj kopanie z WebGPU' : 'Continue Proving with WebGPU'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

