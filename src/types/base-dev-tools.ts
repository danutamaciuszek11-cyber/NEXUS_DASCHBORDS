export type NexusTab = 'prover' | 'swarm' | 'nodes' | 'rewards' | 'zkvm' | 'simulator' | 'network' | 'profile';

export type Language = 'pl' | 'en';

export type ProverEngineMode = 'webgpu' | 'wasm' | 'hybrid';

export type RoutingStrategy = 'dynamic-score' | 'lowest-ping' | 'max-gpu' | 'round-robin';

export interface SwarmPeer {
  id: string;
  name: string;
  region: string;
  isLocal?: boolean;
  hashrate: number;
  latencyMs: number;
  connectionType: 'webrtc-direct' | 'webrtc-relay' | 'local';
  dataChannelState: 'open' | 'connecting' | 'closed' | 'reconnecting' | 'ice-failed';
  shardsProcessed: number;
  engine: 'WebGPU (WGSL)' | 'WebAssembly SIMD' | 'Hybrid';
  routingScore?: number;
  activeShardsCount?: number;
  iceState?: 'connected' | 'checking' | 'failed' | 'disconnected';
  lastHeartbeat?: number;
}

export interface ProofShard {
  id: number;
  label: string;
  startRow: number;
  endRow: number;
  totalRows: number;
  assignedPeerId: string;
  assignedPeerName: string;
  status: 'pending' | 'computing' | 'completed' | 'aggregating' | 're-routing' | 'failed';
  progressPercent: number;
  subMerkleRoot?: string;
  computeTimeMs?: number;
  previousPeerName?: string;
  failoverCount?: number;
}

export interface FailoverEvent {
  id: string;
  timestamp: string;
  shardId: number;
  shardLabel: string;
  failedPeerId: string;
  failedPeerName: string;
  backupPeerId: string;
  backupPeerName: string;
  reason: string;
  timeToRecoverMs: number;
}

export interface DistributedTaskState {
  taskId: string;
  name: string;
  totalRows: number;
  shards: ProofShard[];
  status: 'idle' | 'slicing' | 'dispatching' | 'computing' | 'aggregating' | 'completed';
  routingStrategy?: RoutingStrategy;
  failoverEvents?: FailoverEvent[];
  startedAt?: number;
  completedAt?: number;
  totalExecutionTimeMs?: number;
  masterProofHash?: string;
  speedupVsSingleNode?: number;
}

export interface GpuDeviceInfo {
  isSupported: boolean;
  adapterName: string;
  vendor: string;
  architecture: string;
  limits?: {
    maxComputeWorkgroupsPerDimension: number;
    maxComputeInvocationsPerWorkgroup: number;
    maxStorageBufferBindingSize: number;
  };
  vramAllocatedMB: number;
  activeShaders: string;
}

export interface NodeInfo {
  id: string;
  name: string;
  type: 'web' | 'cli' | 'docker' | 'vps';
  status: 'active' | 'proving' | 'syncing' | 'idle' | 'offline';
  cyclesPerSec: number;
  totalProofs: number;
  uptime: string;
  architecture: string;
  threads: number;
  lastPing: string;
  engineMode?: ProverEngineMode;
}

export interface ProofRecord {
  id: string;
  blockNumber: number;
  task: string;
  proofHash: string;
  cycles: number;
  proofTimeMs: number;
  pointsEarned: number;
  timestamp: string;
  status: 'verified' | 'submitting' | 'pending';
}

export interface NetworkTelemetry {
  globalCyclesPerSec: number;
  activeNodesGlobal: number;
  totalProofsVerified: number;
  currentEpoch: number;
  epochProgressPercent: number;
  difficulty: string;
  blockHeight: number;
  avgBlockTime: string;
}

export interface ProverSettings {
  threads: number;
  intensity: 'eco' | 'balanced' | 'turbo';
  autoStart: boolean;
  batterySaver: boolean;
  logsVerbosity: 'minimal' | 'detailed' | 'debug';
}

export interface UserProfile {
  username: string;
  avatarUrl: string;
  bio: string;
  walletAddress?: string;
  role?: string;
  farcasterHandle?: string;
  githubHandle?: string;
  joinedDate?: string;
  nxlTier: 'Genesis' | 'Titanium' | 'Diamond' | 'Platinum' | 'Gold' | 'Standard';
  totalPoints: number;
  referralCode: string;
  referralsCount: number;
}

export const DEFAULT_NEXUS_PROFILE: UserProfile = {
  username: 'nxl_operator_01',
  avatarUrl: '',
  bio: 'Contributing compute to the NXL Nexus zkVM verifiable internet. Operating browser and VPS prover nodes.',
  walletAddress: '0x71C...49b2',
  role: 'Nexus Prover Node Operator',
  farcasterHandle: 'nexusdev',
  githubHandle: 'nxl-nexus',
  joinedDate: 'Testnet Epoch 14',
  nxlTier: 'Diamond',
  totalPoints: 148290,
  referralCode: 'NXL-NEXUS-778',
  referralsCount: 12,
};
