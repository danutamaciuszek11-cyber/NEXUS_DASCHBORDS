// NXL v1.0 Synapse Mesh Registry & 24 Micro-Node Dispatcher
import { ClusterInstance } from '../../types';
import { nexusBus } from './nexus-bus';

export interface SynapseNodeStatus {
  nodeId: string;
  name: string;
  protocol: 'gRPC' | 'REST' | 'NXL-NATIVE';
  status: 'OPERATIONAL' | 'SYNCED' | 'HEAVY_LOAD' | 'FAILOVER';
  loadPercent: number;
  throughputRps: number;
  latencyMs: number;
  lastHeartbeat: string;
}

export class SynapseMesh {
  private static readonly NODE_COUNT = 24;
  private nodes: Map<string, SynapseNodeStatus> = new Map();

  constructor() {
    this.initialize24Nodes();
  }

  private initialize24Nodes(): void {
    for (let i = 1; i <= SynapseMesh.NODE_COUNT; i++) {
      const nodeId = `SYNAPSE-NODE-${i.toString().padStart(2, '0')}`;
      this.nodes.set(nodeId, {
        nodeId,
        name: `Synapse Micro-Node #${i}`,
        protocol: i % 2 === 0 ? 'gRPC' : 'REST',
        status: 'OPERATIONAL',
        loadPercent: Math.floor(35 + Math.random() * 30),
        throughputRps: Math.floor(180 + Math.random() * 60),
        latencyMs: parseFloat((0.8 + Math.random() * 0.5).toFixed(2)),
        lastHeartbeat: new Date().toISOString(),
      });
    }
  }

  getAllNodes(): SynapseNodeStatus[] {
    return Array.from(this.nodes.values());
  }

  getNode(nodeId: string): SynapseNodeStatus | undefined {
    return this.nodes.get(nodeId);
  }

  dispatchTask(taskName: string, payload: any): { dispatchedTo: string; status: string } {
    // Select node with lowest load
    const available = this.getAllNodes().sort((a, b) => a.loadPercent - b.loadPercent);
    const selected = available[0] || this.nodes.get('SYNAPSE-NODE-01')!;

    selected.loadPercent = Math.min(100, selected.loadPercent + 2);
    selected.throughputRps += 10;
    selected.lastHeartbeat = new Date().toISOString();

    const result = {
      dispatchedTo: selected.nodeId,
      status: `DISPATCHED_OK via ${selected.protocol}`,
    };

    nexusBus.publish('SYNAPSE_TASK_DISPATCHED', { taskName, ...result }, selected.nodeId);
    return result;
  }

  getClusterMetrics(): ClusterInstance {
    const nodes = this.getAllNodes();
    const avgLoad = Math.round(nodes.reduce((sum, n) => sum + n.loadPercent, 0) / nodes.length);
    const totalRps = nodes.reduce((sum, n) => sum + n.throughputRps, 0);
    const avgLatency = parseFloat((nodes.reduce((sum, n) => sum + n.latencyMs, 0) / nodes.length).toFixed(2));

    return {
      id: 'MESH-24-CLUSTER',
      name: 'Microservice Synapse Mesh Registry',
      type: 'Synapse Mesh',
      status: 'OPERATIONAL',
      instancesCount: SynapseMesh.NODE_COUNT,
      commitCount: 890,
      xpPoints: 4800,
      guardian: 'Architekt Wiktor & Eterion',
      loadPercent: avgLoad,
      throughputRps: totalRps,
      latencyMs: avgLatency,
      version: '1.0.0-QUANTUM',
    };
  }
}

export const synapseMesh = new SynapseMesh();
