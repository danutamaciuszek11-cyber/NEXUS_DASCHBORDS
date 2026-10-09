// NEXUS OS TypeScript System Types

export type BellasRole = 'Maciej (Architekt)' | 'Elena (Inżynier Światła)' | 'Leo (Strażnik Mostów)' | 'Sofia (Kuratorka)';

export interface BellasMember {
  id: string;
  name: string;
  role: BellasRole;
  aura: 'emerald' | 'cyan' | 'amber' | 'rose';
  status: 'ACTIVE' | 'CONTEMPLATION' | 'SYNCED';
  signature: string;
  lastPulse: string;
}

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

export interface ClusterInstance {
  id: string;
  name: string;
  type: 'Quantum CI/CD' | 'Synapse Mesh' | 'Agent Sandbox';
  status: 'STABLE' | 'OPERATIONAL' | 'SYNCED' | 'WARNING';
  instancesCount: number;
  commitCount: number;
  xpPoints: number;
  guardian: string;
  loadPercent: number;
  throughputRps: number;
  latencyMs: number;
  version: string;
  nodes?: SynapseNodeStatus[];
}

export interface NexusSessionSnapshot {
  timestamp: string;
  savedAtFormatted: string;
  xpPoints: number;
  role?: string;
  telemetry: {
    quantumCiCd: ClusterInstance;
    synapseMesh: ClusterInstance;
    agentSandbox: ClusterInstance;
    ledgerEntries: NxlLedgerEntry[];
  };
}

export interface NxlToken {
  type: string;
  value: string;
  line: number;
  column: number;
}

export interface NxlAstNode {
  type: string;
  [key: string]: any;
}

export interface NxlDiagnostic {
  level: 'ERROR' | 'WARNING' | 'INFO';
  message: string;
  line?: number;
  column?: number;
  hint?: string;
}

export interface NxlTruthReport {
  assertion: string;
  result: boolean;
  evidence: string;
  timestamp: string;
  runtimeVersion: string;
}

export interface NxlLedgerEntry {
  version: number;
  target: string;
  previousValue: any;
  newValue: any;
  valueType: string;
  timestamp: string;
  reason: string;
}

export interface NxlExecutionPlan {
  id: string;
  intent: string;
  authority: string;
  capability: string;
  truthStatus: 'PASS' | 'FAIL';
  capabilityStatus: 'GRANTED' | 'DENIED';
  status: 'PENDING' | 'AUTHORIZED' | 'DISPATCHED' | 'REJECTED';
  targetAdapter: string;
  timestamp: string;
}

export interface ZipAnalysisFileEntry {
  name: string;
  size: number;
  compressedSize: number;
  isNxlFile: boolean;
  isProtected: boolean;
  action: 'ALLOWED' | 'BLOCKED_IMMUTABLE_NXL' | 'ISOLATED';
  checksum?: string;
  threatReason?: string;
}

export interface ZipAnalysisReport {
  id: string;
  sourceUrl?: string;
  fileName?: string;
  totalFiles: number;
  totalSize: number;
  threatsIntercepted: number;
  status: 'CLEAN' | 'THREATS_BLOCKED' | 'FAILED';
  files: ZipAnalysisFileEntry[];
  timestamp: string;
  nxlSecurityCheck: 'PASS_IMMUTABLE_PROTECTED' | 'FAIL' | 'BLOCKED_VIOLATION';
  violationProtocol?: 'NXL_SECURITY_VIOLATION' | 'NONE';
  blockedReasons?: string[];
}

export interface NexusAuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  protocol: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  authority: string;
  target?: string;
  details: any;
  status: 'BLOCKED' | 'RECORDED' | 'AUTHORIZED' | 'FAILED' | 'SUCCESS';
}

export interface CicdDeploymentReport {
  deploymentId?: string;
  pipelineVersion: 'Nexus Quantum CI/CD v3.1.0';
  securityFramework: 'NXL v1.0';
  validatorNode: 'ZipAnalyzerNode';
  status: 'DEPLOYED' | 'BLOCKED_SECURITY_VIOLATION' | 'FAILED';
  packageName: string;
  stagesCompleted: string[];
  violationProtocol?: 'NXL_SECURITY_VIOLATION' | 'NONE';
  auditLogId?: string;
  zipReport?: ZipAnalysisReport;
  signatureSeal?: string;
  timestamp: string;
  durationMs: number;
  error?: string;
}

export interface EventPulse {
  id: string;
  event: string;
  data: any;
  timestamp: string;
  nodeSource?: string;
}

export type ClusterType = 'Synapse Mesh' | 'Quantum CI/CD' | 'Agent Sandbox' | 'System Kernel';
export type LogLevel = 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' | 'TRACE';

export interface ClusterLogEntry {
  id: string;
  timestamp: string;
  cluster: ClusterType;
  nodeId?: string;
  level: LogLevel;
  stage?: string;
  message: string;
  details?: Record<string, any>;
  durationMs?: number;
}
