// NXL v1.0 Human Decision Gate Types & Contracts
// Constitutional Law: "BELLA SUGERUJE. LUDZIE WYBIERAJĄ."

export type DecisionStatus =
  | 'PROPOSED'
  | 'REVIEW_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'EXECUTED'
  | 'FAILED';

export type ActorType = 'HUMAN' | 'AI_AGENT' | 'SYSTEM';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DecisionEvidence {
  truthReportId?: string;
  truthReport?: {
    assertion: string;
    result: boolean;
    evidence: string;
    timestamp: string;
    runtimeVersion?: string;
  };
  sourceState?: {
    key: string;
    value: any;
    version: number;
  };
  details?: Record<string, any>;
}

export interface CanonicalPayload {
  proposalId: string;
  actorId: string;
  action: string;
  target: string;
  requiredCapability: string;
  createdAt: string;
}

export interface CryptographicSignatureInterface {
  canonicalPayload: string;
  hash: string;
  signature: string;
  publicKey?: string;
  labelType: 'IDENTITY_LABEL' | 'CRYPTOGRAPHIC_SIGNATURE';
  verify(): boolean;
}

export interface DecisionProposal {
  proposalId: string;
  actorId: string;
  actorType: ActorType;
  action: string;
  target: string;
  reason: string;
  evidence: DecisionEvidence[];
  confidence: number;
  riskLevel: RiskLevel;
  alternatives: string[];
  requiredCapability: string;
  createdAt: string;
  expiresAt: string;
  status: DecisionStatus;
  proposalHash: string;

  // Approval tracking
  approval?: HumanApproval;
  
  // Execution tracking
  executorActorId?: string;
  executedAt?: string;
  executionResult?: any;
  failureReason?: string;
}

export interface HumanApproval {
  approvalId: string;
  proposalId: string;
  humanActorId: string;
  decision: 'APPROVE' | 'REJECT';
  reason: string;
  timestamp: string;
  capabilityUsed: string;
  approvalHash: string;
  signatureLabel?: string;
}

export interface DecisionLedgerRecord {
  version: number;
  proposalId: string;
  previousStatus: DecisionStatus | 'NONE';
  newStatus: DecisionStatus;
  actorId: string;
  reason: string;
  timestamp: string;
  proposalHash: string;
}

export interface ProposeParams {
  actorId: string;
  actorType?: ActorType;
  action: string;
  target: string;
  reason: string;
  evidence?: DecisionEvidence[];
  confidence?: number;
  riskLevel?: RiskLevel;
  alternatives?: string[];
  requiredCapability: string;
  ttlSeconds?: number;
}
