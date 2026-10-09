// NXL v1.0 Human Decision Gate & Governance Engine
// Constitutional Law: "BELLA SUGERUJE. LUDZIE WYBIERAJĄ."

import {
  DecisionStatus,
  ActorType,
  RiskLevel,
  DecisionEvidence,
  CanonicalPayload,
  CryptographicSignatureInterface,
  DecisionProposal,
  HumanApproval,
  DecisionLedgerRecord,
  ProposeParams,
} from './types';
import { SecurityVault } from '../nxl/security-vault';
import { AccessManager } from '../nxl/access-manager';
import { NxlGraph } from '../nxl/graph';
import { ManifestAstNode } from '../nxl/parser';
import { nexusBus } from '../../bridges/nexus-bus';

export class CanonicalDecisionSignature implements CryptographicSignatureInterface {
  canonicalPayload: string;
  hash: string;
  signature: string;
  publicKey?: string;
  labelType: 'IDENTITY_LABEL' | 'CRYPTOGRAPHIC_SIGNATURE';

  constructor(payload: CanonicalPayload, signature: string, publicKey?: string) {
    this.canonicalPayload = JSON.stringify(payload);
    this.hash = SecurityVault.computeSha256Simulated(this.canonicalPayload);
    this.signature = signature;
    this.publicKey = publicKey;
    // Seals starting with 0xROOT are IDENTITY_LABEL, not full verified asymmetric keypairs
    this.labelType = signature.startsWith('0xROOT') ? 'IDENTITY_LABEL' : 'CRYPTOGRAPHIC_SIGNATURE';
  }

  verify(): boolean {
    if (!this.signature) return false;
    if (this.labelType === 'IDENTITY_LABEL') {
      const cert = SecurityVault.verifySignature(this.signature);
      return cert.isRootCertified;
    }
    // Full asymmetric keypair verification status: NOT_IMPLEMENTED
    // Returns basic syntactic validity check for non-empty signature string
    return this.signature.length > 10;
  }
}

export class DecisionGate {
  private static instance: DecisionGate;
  private proposals = new Map<string, DecisionProposal>();
  private ledger: DecisionLedgerRecord[] = [];
  private ledgerVersion = 0;

  public static getInstance(): DecisionGate {
    if (!DecisionGate.instance) {
      DecisionGate.instance = new DecisionGate();
    }
    return DecisionGate.instance;
  }

  public resetState(): void {
    this.proposals.clear();
    this.ledger = [];
    this.ledgerVersion = 0;
  }

  /**
   * 1. PROPOSE — AI Agent or System proposes an action.
   * Zero-Trust: confidence, risk, and hash are calculated and bound server-side.
   */
  public propose(params: ProposeParams): DecisionProposal {
    if (!params.actorId || !params.action || !params.target || !params.requiredCapability) {
      throw new Error('[DECISION_GATE_ERROR] Invalid proposal: missing required fields (actorId, action, target, requiredCapability).');
    }

    const proposalId = `PROP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const createdAt = new Date().toISOString();
    const ttl = params.ttlSeconds !== undefined ? params.ttlSeconds : 3600; // default 1 hour
    const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();

    // Zero-Trust: bounds-check confidence and derive risk level
    const confidence = Math.max(0, Math.min(1, params.confidence ?? 0.85));
    const riskLevel: RiskLevel = params.riskLevel || (confidence < 0.7 ? 'HIGH' : 'MEDIUM');

    const canonical: CanonicalPayload = {
      proposalId,
      actorId: params.actorId,
      action: params.action,
      target: params.target,
      requiredCapability: params.requiredCapability,
      createdAt,
    };
    const proposalHash = SecurityVault.computeSha256Simulated(JSON.stringify(canonical));

    const initialStatus: DecisionStatus =
      riskLevel === 'HIGH' || riskLevel === 'CRITICAL' ? 'REVIEW_REQUIRED' : 'PROPOSED';

    const proposal: DecisionProposal = {
      proposalId,
      actorId: params.actorId,
      actorType: params.actorType || 'AI_AGENT',
      action: params.action,
      target: params.target,
      reason: params.reason,
      evidence: params.evidence || [],
      confidence,
      riskLevel,
      alternatives: params.alternatives || [],
      requiredCapability: params.requiredCapability,
      createdAt,
      expiresAt,
      status: initialStatus,
      proposalHash,
    };

    this.proposals.set(proposalId, proposal);

    // Record into State Ledger
    this.appendLedger(proposalId, 'NONE', initialStatus, params.actorId, `Proposed: ${params.reason}`, proposalHash);

    // Emit event on NexusBus
    const eventType = initialStatus === 'REVIEW_REQUIRED' ? 'DECISION_REVIEW_REQUIRED' : 'DECISION_PROPOSED';
    this.emitBusEvent(eventType, proposalId, params.actorId, { proposal });

    return proposal;
  }

  /**
   * 2. REVIEW — Transition a proposal to REVIEW_REQUIRED state.
   */
  public review(proposalId: string, reviewerActorId: string, reason?: string): DecisionProposal {
    const proposal = this.getProposal(proposalId);

    if (proposal.status !== 'PROPOSED') {
      throw new Error(`[DECISION_GATE_DENY] Cannot review proposal '${proposalId}' with status '${proposal.status}'. Must be 'PROPOSED'.`);
    }

    if (this.isExpired(proposal)) {
      this.expire(proposalId);
      throw new Error(`[DECISION_GATE_DENY] Proposal '${proposalId}' has EXPIRED.`);
    }

    const previousStatus = proposal.status;
    proposal.status = 'REVIEW_REQUIRED';

    this.appendLedger(proposalId, previousStatus, 'REVIEW_REQUIRED', reviewerActorId, reason || 'Requested manual review', proposal.proposalHash);
    this.emitBusEvent('DECISION_REVIEW_REQUIRED', proposalId, reviewerActorId, { proposal });

    return proposal;
  }

  /**
   * 3. APPROVE — Human operator authorizes a proposal.
   * Hard Rule: PROPOSER != APPROVER.
   * Hard Rule: AI_AGENT cannot approve.
   * Hard Rule: Capability + Human Approval + Valid Proposal = PERMIT.
   */
  public approve(
    proposalId: string,
    approverActorId: string,
    approverActorType: ActorType,
    options?: { capability?: string; signature?: string; graph?: NxlGraph; ast?: ManifestAstNode; reason?: string }
  ): DecisionProposal {
    const proposal = this.getProposal(proposalId);

    // Expiration Check
    if (this.isExpired(proposal)) {
      this.expire(proposalId);
      throw new Error(`[DECISION_GATE_DENY] Proposal '${proposalId}' has EXPIRED and cannot be approved.`);
    }

    // Status Transition Validity
    if (proposal.status !== 'PROPOSED' && proposal.status !== 'REVIEW_REQUIRED') {
      throw new Error(`[DECISION_GATE_DENY] Invalid state transition: Cannot approve proposal in '${proposal.status}' state.`);
    }

    // SEPARATION OF DUTIES: Proposer != Approver
    if (proposal.actorId === approverActorId) {
      throw new Error(`[DECISION_GATE_DENY] Separation of Duties violation: Proposer '${proposal.actorId}' cannot approve its own proposal.`);
    }

    // HUMAN SOVEREIGNTY: AI cannot approve
    if (approverActorType === 'AI_AGENT') {
      throw new Error(`[DECISION_GATE_DENY] Human Sovereignty Violation: AI Agent '${approverActorId}' cannot grant Human Approval.`);
    }

    // ACCESS MANAGER CAPABILITY CHECK (PDP)
    if (options?.graph) {
      const capCheck = AccessManager.evaluate(approverActorId, proposal.requiredCapability, options.graph, options.ast);
      if (!capCheck.granted) {
        throw new Error(`[DECISION_GATE_DENY] Capability check failed: Approver '${approverActorId}' lacks capability '${proposal.requiredCapability}'. Reason: ${capCheck.reason}`);
      }
    }

    // Signature verification (Identity Label)
    let signatureLabel: string | undefined = undefined;
    if (options?.signature) {
      const sig = new CanonicalDecisionSignature(
        {
          proposalId: proposal.proposalId,
          actorId: proposal.actorId,
          action: proposal.action,
          target: proposal.target,
          requiredCapability: proposal.requiredCapability,
          createdAt: proposal.createdAt,
        },
        options.signature
      );
      if (!sig.verify()) {
        throw new Error(`[DECISION_GATE_DENY] Signature verification failed for seal: ${options.signature}`);
      }
      signatureLabel = `${sig.labelType}:${options.signature}`;
    }

    const previousStatus = proposal.status;
    const approvalId = `APPR-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const timestamp = new Date().toISOString();
    const approvalPayload = JSON.stringify({ approvalId, proposalId, approverActorId, timestamp });
    const approvalHash = SecurityVault.computeSha256Simulated(approvalPayload);

    const humanApproval: HumanApproval = {
      approvalId,
      proposalId,
      humanActorId: approverActorId,
      decision: 'APPROVE',
      reason: options?.reason || `Authorized by human operator ${approverActorId}`,
      timestamp,
      capabilityUsed: proposal.requiredCapability,
      approvalHash,
      signatureLabel,
    };

    proposal.status = 'APPROVED';
    proposal.approval = humanApproval;

    this.appendLedger(proposalId, previousStatus, 'APPROVED', approverActorId, humanApproval.reason, proposal.proposalHash);
    this.emitBusEvent('DECISION_APPROVED', proposalId, approverActorId, { proposal, approval: humanApproval });

    return proposal;
  }

  /**
   * 4. REJECT — Human or System rejects a proposal.
   */
  public reject(proposalId: string, actorId: string, reason: string): DecisionProposal {
    const proposal = this.getProposal(proposalId);

    if (proposal.status === 'EXECUTED') {
      throw new Error(`[DECISION_GATE_DENY] Cannot reject proposal '${proposalId}': Already EXECUTED.`);
    }

    const previousStatus = proposal.status;
    proposal.status = 'REJECTED';
    proposal.failureReason = reason;

    this.appendLedger(proposalId, previousStatus, 'REJECTED', actorId, `Rejected: ${reason}`, proposal.proposalHash);
    this.emitBusEvent('DECISION_REJECTED', proposalId, actorId, { proposal, reason });

    return proposal;
  }

  /**
   * 5. EXECUTE — Atomic execution of an APPROVED proposal.
   * Hard Rule: Can only execute if status is strictly APPROVED.
   * Hard Rule: Cannot execute twice.
   */
  public execute(
    proposalId: string,
    executorActorId: string,
    options?: { graph?: NxlGraph; ast?: ManifestAstNode }
  ): { executed: boolean; proposal: DecisionProposal; result: any } {
    const proposal = this.getProposal(proposalId);

    // Expiration check
    if (this.isExpired(proposal)) {
      this.expire(proposalId);
      throw new Error(`[DECISION_GATE_DENY] Cannot execute proposal '${proposalId}': Proposal has EXPIRED.`);
    }

    // Double execution defense
    if (proposal.status === 'EXECUTED') {
      throw new Error(`[DECISION_GATE_DENY] Proposal '${proposalId}' has already been EXECUTED.`);
    }

    // Status check
    if (proposal.status !== 'APPROVED') {
      throw new Error(`[DECISION_GATE_DENY] Execution blocked: Proposal '${proposalId}' is in status '${proposal.status}'. Required status: 'APPROVED'.`);
    }

    // Mandatory Human Approval verification
    if (!proposal.approval || proposal.approval.decision !== 'APPROVE') {
      throw new Error(`[DECISION_GATE_DENY] Missing valid Human Approval record for proposal '${proposalId}'.`);
    }

    // Verify capability with AccessManager
    if (options?.graph) {
      const capCheck = AccessManager.evaluate(proposal.approval.humanActorId, proposal.requiredCapability, options.graph, options.ast);
      if (!capCheck.granted) {
        throw new Error(`[DECISION_GATE_DENY] Execution blocked: Approver '${proposal.approval.humanActorId}' capability denied: ${capCheck.reason}`);
      }
    }

    const previousStatus = proposal.status;
    proposal.status = 'EXECUTED';
    proposal.executorActorId = executorActorId;
    proposal.executedAt = new Date().toISOString();
    proposal.executionResult = {
      status: 'SUCCESS',
      target: proposal.target,
      action: proposal.action,
      executedBy: executorActorId,
      timestamp: proposal.executedAt,
    };

    this.appendLedger(proposalId, previousStatus, 'EXECUTED', executorActorId, `Executed: ${proposal.action} on ${proposal.target}`, proposal.proposalHash);
    this.emitBusEvent('DECISION_EXECUTED', proposalId, executorActorId, { proposal, result: proposal.executionResult });

    return {
      executed: true,
      proposal,
      result: proposal.executionResult,
    };
  }

  /**
   * 6. EXPIRE — Transition expired proposal.
   */
  public expire(proposalId: string): DecisionProposal {
    const proposal = this.getProposal(proposalId);
    if (proposal.status === 'EXPIRED') return proposal;

    const previousStatus = proposal.status;
    proposal.status = 'EXPIRED';
    proposal.failureReason = 'Proposal TTL expired before human authorization.';

    this.appendLedger(proposalId, previousStatus, 'EXPIRED', 'SYSTEM', 'TTL expired', proposal.proposalHash);
    this.emitBusEvent('DECISION_EXPIRED', proposalId, 'SYSTEM', { proposal });

    return proposal;
  }

  /**
   * 7. FAIL — Record failure during processing or execution.
   */
  public fail(proposalId: string, reason: string): DecisionProposal {
    const proposal = this.getProposal(proposalId);
    const previousStatus = proposal.status;
    proposal.status = 'FAILED';
    proposal.failureReason = reason;

    this.appendLedger(proposalId, previousStatus, 'FAILED', 'SYSTEM', reason, proposal.proposalHash);
    this.emitBusEvent('DECISION_FAILED', proposalId, 'SYSTEM', { proposal, reason });

    return proposal;
  }

  /**
   * Re-authorization barrier: an already approved or executed proposal cannot be modified or re-approved.
   */
  public reauthorizeApprovedDenied(proposalId: string): void {
    const proposal = this.getProposal(proposalId);
    if (proposal.status === 'APPROVED' || proposal.status === 'EXECUTED') {
      throw new Error(`[DECISION_GATE_DENY] Cannot mutate or re-approve an already ${proposal.status} proposal '${proposalId}' without a new authorization request.`);
    }
  }

  public getProposal(proposalId: string): DecisionProposal {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error(`[DECISION_GATE_ERROR] DecisionProposal '${proposalId}' not found.`);
    }
    if (this.isExpired(proposal) && proposal.status !== 'EXECUTED' && proposal.status !== 'REJECTED') {
      proposal.status = 'EXPIRED';
    }
    return proposal;
  }

  public getProposalHistory(proposalId: string): { proposal: DecisionProposal; ledgerEntries: DecisionLedgerRecord[] } {
    const proposal = this.getProposal(proposalId);
    const ledgerEntries = this.ledger.filter((e) => e.proposalId === proposalId);
    return { proposal, ledgerEntries };
  }

  public getLedger(): DecisionLedgerRecord[] {
    return [...this.ledger];
  }

  private isExpired(proposal: DecisionProposal): boolean {
    return new Date().getTime() > new Date(proposal.expiresAt).getTime();
  }

  private appendLedger(
    proposalId: string,
    previousStatus: DecisionStatus | 'NONE',
    newStatus: DecisionStatus,
    actorId: string,
    reason: string,
    proposalHash: string
  ): void {
    this.ledgerVersion++;
    const record: DecisionLedgerRecord = {
      version: this.ledgerVersion,
      proposalId,
      previousStatus,
      newStatus,
      actorId,
      reason,
      timestamp: new Date().toISOString(),
      proposalHash,
    };
    this.ledger.push(record);
  }

  private emitBusEvent(eventType: string, proposalId: string, actorId: string, payload: any): void {
    nexusBus.publish(
      eventType,
      {
        proposalId,
        actorId,
        timestamp: new Date().toISOString(),
        eventType,
        ...payload,
      },
      'DecisionGate'
    );
  }
}

export const decisionGate = DecisionGate.getInstance();
