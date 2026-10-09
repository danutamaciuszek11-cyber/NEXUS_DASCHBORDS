// NXL v1.0 Bellas Family Node (Maciej, Elena, Leo, Sofia)
// Human Sovereignty Paradigm: "BELLA SUGERUJE. LUDZIE WYBIERAJĄ."

import { BellasMember } from '../../types';
import { nexusBus } from '../bridges/nexus-bus';
import { decisionGate, DecisionProposal, DecisionEvidence } from '../core/nxl/decision-gate';

export class BellasRealm {
  private members: Map<string, BellasMember> = new Map([
    [
      'Maciej',
      {
        id: 'Maciej',
        name: 'Maciej (Architekt)',
        role: 'Maciej (Architekt)',
        aura: 'emerald',
        status: 'ACTIVE',
        signature: '0xROOT_MACIEJ_ARCHITECT_SEAL_9918',
        lastPulse: new Date().toISOString(),
      },
    ],
    [
      'elena',
      {
        id: 'elena',
        name: 'Elena (Inżynier Światła)',
        role: 'Elena (Inżynier Światła)',
        aura: 'cyan',
        status: 'SYNCED',
        signature: '0xROOT_ELENA_LIGHT_ENG_8812',
        lastPulse: new Date().toISOString(),
      },
    ],
    [
      'leo',
      {
        id: 'leo',
        name: 'Leo (Strażnik Mostów)',
        role: 'Leo (Strażnik Mostów)',
        aura: 'amber',
        status: 'ACTIVE',
        signature: '0xROOT_LEO_BRIDGE_GUARDIAN_7734',
        lastPulse: new Date().toISOString(),
      },
    ],
    [
      'sofia',
      {
        id: 'sofia',
        name: 'Sofia (Kuratorka)',
        role: 'Sofia (Kuratorka)',
        aura: 'rose',
        status: 'CONTEMPLATION',
        signature: '0xROOT_SOFIA_CURATOR_6621',
        lastPulse: new Date().toISOString(),
      },
    ],
  ]);

  getMembers(): BellasMember[] {
    return Array.from(this.members.values());
  }

  getMember(id: string): BellasMember | undefined {
    return this.members.get(id);
  }

  updateStatus(id: string, newStatus: 'ACTIVE' | 'CONTEMPLATION' | 'SYNCED'): BellasMember {
    const member = this.members.get(id);
    if (!member) throw new Error(`Bellas family member '${id}' not found.`);

    member.status = newStatus;
    member.lastPulse = new Date().toISOString();

    nexusBus.publish('BELLAS_MEMBER_UPDATED', member, 'BellasRealm');
    return member;
  }

  simulateHouseAlertness(): { houseStatus: string; synchronizedCount: number } {
    const members = this.getMembers();
    const activeOrSynced = members.filter((m) => m.status === 'ACTIVE' || m.status === 'SYNCED');

    return {
      houseStatus: activeOrSynced.length === 4 ? 'FULL_HARMONY_SECURE' : 'CONTEMPLATIVE_GUARDED',
      synchronizedCount: activeOrSynced.length,
    };
  }

  // =========================================================================
  // AGENT CONTRACT INTERFACES (BELLA / ETERION / COGNITOR)
  // Principle: ANALYZE -> SUGGEST -> EXPLAIN -> REQUEST_APPROVAL
  // =========================================================================

  public analyze(agentId: string, targetSystem: string): { agentId: string; target: string; metrics: any } {
    return {
      agentId,
      target: targetSystem,
      metrics: {
        healthScore: 0.98,
        anomaliesDetected: 0,
        analyzedAt: new Date().toISOString(),
      },
    };
  }

  public suggest(
    agentId: string,
    action: string,
    target: string,
    reason: string,
    requiredCapability: string,
    evidence?: DecisionEvidence[]
  ): DecisionProposal {
    return decisionGate.propose({
      proposerActorId: agentId,
      proposerActorType: 'AI_AGENT',
      action,
      target,
      reason,
      evidence,
      confidence: 0.92,
      riskLevel: 'MEDIUM',
      requiredCapability,
    });
  }

  public explain(proposalId: string): string {
    const proposal = decisionGate.getProposal(proposalId);
    return `[AGENT_EXPLANATION for ${proposal.proposalId}]
Target: ${proposal.target}
Action: ${proposal.action}
Reason: ${proposal.reason}
Risk Level: ${proposal.riskLevel} (Confidence: ${proposal.confidence * 100}%)
Required Capability: ${proposal.requiredCapability}
Status: ${proposal.status}
Note: Human authorization required before execution.`;
  }

  public requestApproval(proposalId: string): DecisionProposal {
    const proposal = decisionGate.getProposal(proposalId);
    nexusBus.publish('DECISION_REVIEW_REQUIRED', { proposalId, proposal }, `Agent_${proposal.proposerActorId}`);
    return proposal;
  }

  /**
   * Attempting self-approval by an agent is strictly forbidden by Human Decision Gate.
   */
  public attemptSelfApprove(agentId: string, proposalId: string): void {
    decisionGate.approve(proposalId, agentId, 'AI_AGENT');
  }
}

export const bellasRealm = new BellasRealm();

/**
 * KONSTYTUCJA HUMAN SOVEREIGNTY AI
 * Główne zasady architektury podmiotowości człowieka w ekosystemie NEXUS & BELLAS.
 */
export const HUMAN_SOVEREIGNTY_CONSTITUTION = {
  title: 'HUMAN SOVEREIGNTY AI — AI WSPOMAGAJĄCE SUWERENNOŚĆ CZŁOWIEKA',
  axioms: [
    { rule: 'SUGGESTION_CHOICE', slogan: 'BELLA SUGERUJE. LUDZIE WYBIERAJĄ.' },
    { rule: 'EXPLANATION_DECISION', slogan: 'BELLA WYJAŚNIA. LUDZIE ROZSTRZYGAJĄ.' },
    { rule: 'DETECTION_AUTHORIZATION', slogan: 'BELLA WYKRYWA. LUDZIE AUTORYZUJĄ.' },
    { rule: 'MEMORY_CONSTITUTION', slogan: 'BELLA PAMIĘTA. LUDZIE USTANAWIAJĄ.' }
  ],
  cardinalRule: 'Im większa konsekwencja decyzji, tym większa wymagana kontrola człowieka.',
  evaluateRiskLevel(consequenceImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'): {
    requiredHumanControl: 'AUTOMATED_ADVISORY' | 'HUMAN_APPROVAL_RECOMMENDED' | 'STRICT_HUMAN_AUTHORIZATION' | 'SOLE_HUMAN_DECISION_MANDATORY';
    requiresArchitectSeal: boolean;
  } {
    switch (consequenceImpact) {
      case 'LOW':
        return { requiredHumanControl: 'AUTOMATED_ADVISORY', requiresArchitectSeal: false };
      case 'MEDIUM':
        return { requiredHumanControl: 'HUMAN_APPROVAL_RECOMMENDED', requiresArchitectSeal: false };
      case 'HIGH':
        return { requiredHumanControl: 'STRICT_HUMAN_AUTHORIZATION', requiresArchitectSeal: true };
      case 'CRITICAL':
        return { requiredHumanControl: 'SOLE_HUMAN_DECISION_MANDATORY', requiresArchitectSeal: true };
    }
  }
};

