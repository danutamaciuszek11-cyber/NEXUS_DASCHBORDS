// ==============================================================================
// NEXUS REACT 19 — SERVER ACTIONS & ASSET PRELOADING RPC LAYER
// Typed Server Actions for querying nodes, triggering self-healing, and NXL evaluation
// ==============================================================================

import { preload } from 'react-dom';
import { SynapseNodeStatus, ClusterInstance } from '../types';

/**
 * Preloads critical cluster assets and telemetry endpoints using React 19 Asset Loading APIs
 */
export function preloadClusterResources(): void {
  try {
    // Preload API endpoints and style assets
    if (typeof preload === 'function') {
      preload('/api/telemetry/nodes', { as: 'fetch' });
      preload('/api/cluster/telemetry', { as: 'fetch' });
      preload('/api/cluster/logs', { as: 'fetch' });
    }
  } catch (err) {
    // Non-critical in non-supporting contexts
  }
}

/**
 * Server Action: Fetch real-time status of all 24 Synapse Mesh nodes
 */
export async function fetchSynapseNodesAction(): Promise<{
  leaderNodeId: string;
  totalNodes: number;
  nodes: SynapseNodeStatus[];
  metrics: ClusterInstance;
}> {
  const response = await fetch('/api/telemetry/nodes', {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Synapse Mesh state: HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Server Action: Execute Self-Healing Restart on a degraded or quarantined node
 */
export async function restartSynapseNodeAction(nodeId: string): Promise<{
  success: boolean;
  message: string;
  node: SynapseNodeStatus;
}> {
  const response = await fetch('/api/telemetry/nodes/restart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodeId }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown server error' }));
    throw new Error(err.error || `Node restart failed: HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Server Action: Compile NXL source via WebAssembly JIT on server or client
 */
export async function compileNxlWasmAction(source: string): Promise<{
  success: boolean;
  bytecodeLength: number;
  base64Bytecode: string;
  truthReports: any[];
  executionTimeMs: number;
  exports: string[];
}> {
  const response = await fetch('/api/nxl/wasm/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source }),
  });

  if (!response.ok) {
    throw new Error(`NXL Wasm compilation action failed: HTTP ${response.status}`);
  }

  return response.json();
}
