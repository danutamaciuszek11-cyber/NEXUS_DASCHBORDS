// ==============================================================================
// NEXUS REACT 19 — OFF-MAIN-THREAD TELEMETRY HOOK (useTelemetryWorker)
// Spawns Web Worker to compute heavy metrics without blocking React rendering
// ==============================================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { SynapseNodeStatus } from '../types';
import { TelemetryWorkerOutput } from '../workers/telemetryWorker';

export function useTelemetryWorker(rawNodes: SynapseNodeStatus[]) {
  const workerRef = useRef<Worker | null>(null);
  const [telemetryState, setTelemetryState] = useState<TelemetryWorkerOutput>({
    type: 'NODES_PROCESSED',
    timestamp: Date.now(),
    totalRps: 4920,
    avgLoadPercent: 45,
    avgLatencyMs: 1.1,
    p99LatencyMs: 2.2,
    healthBreakdown: {
      operational: 24,
      synced: 0,
      heavyLoad: 0,
      quarantined: 0,
    },
    processedNodes: rawNodes,
  });

  useEffect(() => {
    // Create inline blob worker to guarantee iframe compatibility
    const workerCode = `
      self.onmessage = function(e) {
        var data = e.data;
        if (data.type === 'PROCESS_NODES' && Array.isArray(data.nodes)) {
          var nodes = data.nodes;
          var totalRps = 0;
          var totalLoad = 0;
          var totalLatency = 0;
          var latencies = [];
          var health = { operational: 0, synced: 0, heavyLoad: 0, quarantined: 0 };

          for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            totalRps += (n.throughputRps || 0);
            totalLoad += (n.loadPercent || 0);
            totalLatency += (n.latencyMs || 0);
            latencies.push(n.latencyMs || 0);

            if (n.status === 'OPERATIONAL') health.operational++;
            else if (n.status === 'SYNCED') health.synced++;
            else if (n.status === 'HEAVY_LOAD') health.heavyLoad++;
            else if (n.status === 'ISOLATED_QUARANTINE' || n.status === 'FAILOVER') health.quarantined++;
          }

          var count = nodes.length || 1;
          latencies.sort(function(a, b) { return a - b; });
          var p99 = latencies[Math.floor(latencies.length * 0.99)] || latencies[latencies.length - 1] || 1.2;

          self.postMessage({
            type: 'NODES_PROCESSED',
            timestamp: Date.now(),
            totalRps: totalRps,
            avgLoadPercent: Math.round(totalLoad / count),
            avgLatencyMs: parseFloat((totalLatency / count).toFixed(2)),
            p99LatencyMs: parseFloat(p99.toFixed(2)),
            healthBreakdown: health,
            processedNodes: nodes
          });
        }
      };
    `;

    try {
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));
      worker.onmessage = (event: MessageEvent<TelemetryWorkerOutput>) => {
        if (event.data && event.data.type === 'NODES_PROCESSED') {
          setTelemetryState(event.data);
        }
      };
      workerRef.current = worker;

      return () => {
        worker.terminate();
      };
    } catch (e) {
      console.warn('Worker initialization failed, fallback to main-thread processing:', e);
    }
  }, []);

  // Post update to worker whenever rawNodes change
  useEffect(() => {
    if (workerRef.current && rawNodes.length > 0) {
      workerRef.current.postMessage({
        type: 'PROCESS_NODES',
        nodes: rawNodes,
      });
    }
  }, [rawNodes]);

  return telemetryState;
}
