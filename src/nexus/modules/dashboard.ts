// NXL v1.0 Heartbeat Monitor & Cluster Dashboard Data Aggregator
import { synapseMesh } from '../bridges/synapse-mesh';
import { nexusBus } from '../bridges/nexus-bus';
import { bellasRealm } from './bellas';
import { nxlRuntimeCore } from '../core/nxl/runtime';

export interface DashboardTelemetryOverview {
  timestamp: string;
  busPulseRps: number;
  synapseMeshNodesCount: number;
  activeSynapseNodes: number;
  avgMeshLoadPercent: number;
  totalThroughputRps: number;
  avgLatencyMs: number;
  bellasHarmonyStatus: string;
  securityShieldStatus: string;
  totalLedgerEntries: number;
  recentEvents: any[];
}

export class DashboardMonitor {
  getTelemetryOverview(): DashboardTelemetryOverview {
    const meshMetrics = synapseMesh.getClusterMetrics();
    const busMetrics = nexusBus.getMetrics();
    const bellasHarmony = bellasRealm.simulateHouseAlertness();

    return {
      timestamp: new Date().toISOString(),
      busPulseRps: busMetrics.currentRps,
      synapseMeshNodesCount: meshMetrics.instancesCount,
      activeSynapseNodes: 24,
      avgMeshLoadPercent: meshMetrics.loadPercent,
      totalThroughputRps: meshMetrics.throughputRps,
      avgLatencyMs: meshMetrics.latencyMs,
      bellasHarmonyStatus: bellasHarmony.houseStatus,
      securityShieldStatus: 'ACTIVE_IMMUTABLE_SHIELD_0xROOT',
      totalLedgerEntries: nxlRuntimeCore.ledger.length,
      recentEvents: nexusBus.getHistory().slice(-10),
    };
  }
}

export const dashboardMonitor = new DashboardMonitor();
