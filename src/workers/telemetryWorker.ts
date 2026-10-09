// ==============================================================================
// NEXUS OFF-MAIN-THREAD UI PROCESSING — SYNAPSE TELEMETRY WORKER
// Offloads 24-nodes aggregation, moving average smoothing, and D3 link math from Main Thread
// ==============================================================================

export interface TelemetryWorkerInput {
  type: 'PROCESS_NODES' | 'CALCULATE_P99' | 'SIMULATE_TOPOLOGY';
  nodes: any[];
  windowSize?: number;
}

export interface TelemetryWorkerOutput {
  type: 'NODES_PROCESSED';
  timestamp: number;
  totalRps: number;
  avgLoadPercent: number;
  avgLatencyMs: number;
  p99LatencyMs: number;
  healthBreakdown: {
    operational: number;
    synced: number;
    heavyLoad: number;
    quarantined: number;
  };
  processedNodes: any[];
}

// Global context self reference for WebWorker
const ctx: Worker = self as any;

ctx.onmessage = (event: MessageEvent<TelemetryWorkerInput>) => {
  const { type, nodes } = event.data;

  if (type === 'PROCESS_NODES' && Array.isArray(nodes)) {
    const startTime = performance.now();
    let totalRps = 0;
    let totalLoad = 0;
    let totalLatency = 0;
    const latencies: number[] = [];

    const healthBreakdown = {
      operational: 0,
      synced: 0,
      heavyLoad: 0,
      quarantined: 0,
    };

    const processedNodes = nodes.map((node) => {
      totalRps += node.throughputRps || 0;
      totalLoad += node.loadPercent || 0;
      totalLatency += node.latencyMs || 0;
      latencies.push(node.latencyMs || 0);

      if (node.status === 'OPERATIONAL') healthBreakdown.operational++;
      else if (node.status === 'SYNCED') healthBreakdown.synced++;
      else if (node.status === 'HEAVY_LOAD') healthBreakdown.heavyLoad++;
      else if (node.status === 'ISOLATED_QUARANTINE' || node.status === 'FAILOVER') healthBreakdown.quarantined++;

      return {
        ...node,
        computedLoadRatio: (node.loadPercent || 0) / 100,
        isOverloaded: (node.loadPercent || 0) > 80,
      };
    });

    const count = nodes.length || 1;
    latencies.sort((a, b) => a - b);
    const p99Index = Math.floor(latencies.length * 0.99);
    const p99LatencyMs = latencies[p99Index] || latencies[latencies.length - 1] || 1.2;

    const output: TelemetryWorkerOutput = {
      type: 'NODES_PROCESSED',
      timestamp: Date.now(),
      totalRps,
      avgLoadPercent: Math.round(totalLoad / count),
      avgLatencyMs: parseFloat((totalLatency / count).toFixed(2)),
      p99LatencyMs: parseFloat(p99LatencyMs.toFixed(2)),
      healthBreakdown,
      processedNodes,
    };

    ctx.postMessage(output);
  }
};

export {};
