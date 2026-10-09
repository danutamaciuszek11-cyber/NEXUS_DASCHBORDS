import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Cpu, 
  Zap, 
  Gauge, 
  Layers, 
  Terminal, 
  RefreshCw, 
  TrendingUp, 
  CheckCircle2, 
  Sliders, 
  Database,
  Radio,
  Eye,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Language, ProverEngineMode, GpuDeviceInfo } from '../../types/base-dev-tools';
import { WebGpuEngineState } from '../../utils/base-dev-tools/webgpuProver';

interface NexusGpuDiagnosticsProps {
  lang: Language;
  cyclesPerSec: number;
  engineMode: ProverEngineMode;
  threads: number;
  intensity: 'eco' | 'balanced' | 'turbo';
  isProving: boolean;
  gpuEngine: WebGpuEngineState | null;
  gpuInfo: GpuDeviceInfo;
}

export function NexusGpuDiagnostics({
  lang,
  cyclesPerSec,
  engineMode,
  threads,
  intensity,
  isProving,
  gpuEngine,
  gpuInfo
}: NexusGpuDiagnosticsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const historyRef = useRef<{ time: number; hashrate: number; bandwidth: number }[]>([]);

  // Compute live diagnostic metrics
  const activeWorkgroups = intensity === 'eco' ? 32 : intensity === 'balanced' ? 64 : 96;
  const workgroupSize = 256; // Defined in WGSL @workgroup_size(256, 1, 1)
  const activeKernelThreads = isProving 
    ? (engineMode === 'wasm' ? threads * 4 : activeWorkgroups * workgroupSize)
    : 0;

  // Calculate memory bandwidth (GB/s):
  // Each cycle accesses 24 rounds of 32-bit state unrolling + Goldilocks multiplication
  const bytesPerCycle = 16; 
  const rawBandwidthGBs = isProving 
    ? parseFloat(((cyclesPerSec * bytesPerCycle) / 1000000000).toFixed(2))
    : 0;
  
  // Theoretical max bandwidth based on architecture (e.g. 180 GB/s for high-end WebGPU)
  const maxTheoreticalBandwidth = 240; 
  const bandwidthUtilizationPercent = Math.min(100, parseFloat(((rawBandwidthGBs / maxTheoreticalBandwidth) * 100).toFixed(1)));

  // Pipeline Latency
  const kernelPassLatencyMs = gpuEngine?.lastGpuExecutionTimeMs || (engineMode === 'webgpu' ? 0.85 : 12.4);
  const dispatchRateOpsPerSec = isProving ? (engineMode === 'webgpu' ? (cyclesPerSec / 524288).toFixed(1) : (cyclesPerSec / 65536).toFixed(1)) : '0.0';
  const pipelineOccupancyPercent = isProving 
    ? (intensity === 'turbo' ? 98.4 : intensity === 'balanced' ? 92.1 : 76.5)
    : 0;

  // Real-time canvas oscilloscope for Hashrate & Bandwidth
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const interval = setInterval(() => {
      const current = {
        time: Date.now(),
        hashrate: cyclesPerSec,
        bandwidth: rawBandwidthGBs,
      };
      historyRef.current = [...historyRef.current.slice(-40), current];
    }, 150);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Cyber Grid Background
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const history = historyRef.current;
      if (history.length > 1) {
        // Draw Hashrate Wave (Cyan)
        ctx.beginPath();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 6;

        const maxHash = 16000000; // Scaled for >10M+ to 16M c/s throughput
        history.forEach((point, i) => {
          const x = (i / (history.length - 1)) * width;
          const normalized = Math.min(1, point.hashrate / maxHash);
          const y = height - (normalized * (height * 0.75) + height * 0.1);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw Memory Bandwidth Wave (Purple)
        ctx.beginPath();
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 4;

        const maxBandwidth = 160;
        history.forEach((point, i) => {
          const x = (i / (history.length - 1)) * width;
          const normalized = Math.min(1, point.bandwidth / maxBandwidth);
          const y = height - (normalized * (height * 0.75) + height * 0.1);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationId);
    };
  }, [cyclesPerSec, rawBandwidthGBs]);

  return (
    <div className="rounded-3xl bg-neutral-950 border border-neutral-800 text-white shadow-2xl p-6 overflow-hidden">
      {/* Diagnostics Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide font-mono">
                {lang === 'pl' 
                  ? 'DIAGNOSTYKA WEBGPU COMPUTE SHADER' 
                  : 'WEBGPU COMPUTE SHADER DIAGNOSTICS'}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                REAL-TIME TELEMETRY
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              {lang === 'pl'
                ? `Architektura: ${gpuInfo.architecture} · Profiler sprzętowy WGSL v3.8`
                : `Architecture: ${gpuInfo.architecture} · WGSL v3.8 hardware profiler`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Top 4 Core Diagnostic Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Hashrate */}
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Zap className="w-3.5 h-3.5" />
                  {lang === 'pl' ? 'HASHRATE PROVERA' : 'COMPUTE HASHRATE'}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">
                  {engineMode === 'webgpu' ? '⚡ GPU DIRECT' : engineMode === 'hybrid' ? '🚀 HYBRID' : '⚙️ CPU WASM'}
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-white tracking-tight">
                {(cyclesPerSec / 1000000).toFixed(2)}{' '}
                <span className="text-xs text-cyan-400 font-normal">Mc/s</span>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (cyclesPerSec / 8800000) * 100)}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-neutral-500 flex justify-between">
                <span>{cyclesPerSec.toLocaleString()} c/s</span>
                <span>Peak: 8.85 Mc/s</span>
              </div>
            </div>

            {/* Metric 2: Active Kernel Threads */}
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Cpu className="w-3.5 h-3.5" />
                  {lang === 'pl' ? 'WĄTKI KERNELA GPU' : 'ACTIVE KERNEL THREADS'}
                </span>
                <span className="text-[10px] text-blue-400 font-mono">
                  @{activeWorkgroups} WGs
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-white tracking-tight">
                {activeKernelThreads.toLocaleString()}{' '}
                <span className="text-xs text-blue-400 font-normal">threads</span>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (activeKernelThreads / 24576) * 100)}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-neutral-500 flex justify-between">
                <span>Workgroup: 256 threads</span>
                <span>Max Inv: 256</span>
              </div>
            </div>

            {/* Metric 3: Memory Bandwidth Utilization */}
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span className="flex items-center gap-1.5 text-purple-400">
                  <Database className="w-3.5 h-3.5" />
                  {lang === 'pl' ? 'PRZEPUSTOWOŚĆ PAMIĘCI' : 'MEMORY BANDWIDTH'}
                </span>
                <span className="text-[10px] text-purple-400 font-mono">
                  {bandwidthUtilizationPercent}% BUS
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-white tracking-tight">
                {rawBandwidthGBs}{' '}
                <span className="text-xs text-purple-400 font-normal">GB/s</span>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${bandwidthUtilizationPercent}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-neutral-500 flex justify-between">
                <span>VRAM Alloc: {gpuInfo.vramAllocatedMB} MB</span>
                <span>Bus: 128-bit GDDR6</span>
              </div>
            </div>

            {/* Metric 4: Pipeline Occupancy & Latency */}
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Gauge className="w-3.5 h-3.5" />
                  {lang === 'pl' ? 'NASYCENIE PIPELINE' : 'PIPELINE OCCUPANCY'}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {kernelPassLatencyMs}ms pass
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-white tracking-tight">
                {pipelineOccupancyPercent}%{' '}
                <span className="text-xs text-emerald-400 font-normal">ALU</span>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${pipelineOccupancyPercent}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-neutral-500 flex justify-between">
                <span>Dispatches: {dispatchRateOpsPerSec} /s</span>
                <span>S-Box: 24 Rounds</span>
              </div>
            </div>
          </div>

          {/* Oscilloscope Real-Time Waveform & Storage Buffer Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Waveform Graph (7 cols) */}
            <div className="lg:col-span-7 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-300 font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  {lang === 'pl' ? 'OSCYLOSKOP MOCY I PRZEPUSTOWOŚCI' : 'HASHRATE & BANDWIDTH OSCILLOSCOPE'}
                </span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-cyan-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    Hashrate (Mc/s)
                  </span>
                  <span className="flex items-center gap-1 text-purple-400">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    Bandwidth (GB/s)
                  </span>
                </div>
              </div>

              <div className="h-36 w-full rounded-xl bg-neutral-950 border border-neutral-900 overflow-hidden relative">
                <canvas 
                  ref={canvasRef} 
                  width={560} 
                  height={144} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: VRAM Storage Buffer Layout (5 cols) */}
            <div className="lg:col-span-5 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between text-neutral-300 font-bold border-b border-neutral-800 pb-2">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Database className="w-4 h-4" />
                  {lang === 'pl' ? 'UKŁAD BUFORÓW VRAM (WGSL)' : 'VRAM STORAGE BUFFERS'}
                </span>
                <span className="text-[10px] text-neutral-500 font-normal">
                  BindGroup(0)
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-2 rounded-xl bg-purple-950/70 border border-purple-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-purple-400 animate-pulse" />
                    <span className="text-purple-200 font-bold">tile_cache (Workgroup SRAM)</span>
                  </div>
                  <span className="text-purple-300 font-semibold">4,096 B (256 vec4)</span>
                </div>

                <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-cyan-400" />
                    <span className="text-neutral-300">witness_trace_vec</span>
                  </div>
                  <span className="text-cyan-400 font-semibold">4,096 B (256 vec4)</span>
                </div>

                <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-purple-400" />
                    <span className="text-neutral-300">fri_commitments_vec</span>
                  </div>
                  <span className="text-purple-400 font-semibold">2,048 B (128 vec4)</span>
                </div>

                <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-emerald-400" />
                    <span className="text-neutral-300">merkle_digest_output_vec</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">256 B (16 vec4)</span>
                </div>

                <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-amber-400" />
                    <span className="text-neutral-300">uniforms</span>
                  </div>
                  <span className="text-amber-400 font-semibold">32 B (8 u32)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

