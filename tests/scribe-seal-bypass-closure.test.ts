// Phase 2.3 Scribe IDE Root Seal & Code Mutation Bypass Closure Test Suite
// Constitutional Law: "BELLA SUGERUJE. LUDZIE WYBIERAJĄ. NEXUS WERYFIKUJE. NEXUS WYKONUJE. LEDGER PAMIĘTA."

import { ScribeIDE } from '../src/nexus/modules/scribe';
import { nxlRuntimeCore } from '../src/nexus/core/nxl/runtime';
import { SecurityVault } from '../src/nexus/core/nxl/security-vault';
import { decisionGate } from '../src/nexus/core/decision';
import { NxlGraph } from '../src/nexus/core/nxl/graph';
import { nexusBus } from '../src/nexus/bridges/nexus-bus';

class ScribeTestRunner {
  private total = 0;
  private passed = 0;
  private failed = 0;

  assert(condition: boolean, message: string) {
    this.total++;
    if (condition) {
      this.passed++;
      console.log(`  ✓ [TEST #${String(this.total).padStart(2, '0')}] PASS: ${message}`);
    } else {
      this.failed++;
      console.error(`  ✗ [TEST #${String(this.total).padStart(2, '0')}] FAIL: ${message}`);
    }
  }

  summary() {
    console.log('\n======================================================================');
    console.log('NEXUS PHASE 2.3 SCRIBE ROOT SEAL BYPASS CLOSURE TEST SUMMARY:');
    console.log(`Total Assertions Evaluated : ${this.total}`);
    console.log(`Passed Assertions         : ${this.passed}`);
    console.log(`Failed Assertions         : ${this.failed}`);
    console.log('======================================================================\n');
    if (this.failed > 0) {
      process.exit(1);
    }
  }
}

async function runTestSuite() {
  const runner = new ScribeTestRunner();
  console.log('======================================================================');
  console.log('=== STARTING NEXUS CORE PHASE 2.3 — SCRIBE SEAL BYPASS SUITE ===');
  console.log('======================================================================\n');

  // Setup intention graphs for access control
  const privilegedGraph = new NxlGraph();
  privilegedGraph.addNode('Maciej_Architekt', 'Biooperator_Architekt');
  privilegedGraph.grantCapability('Maciej_Architekt', 'nexus.core.seal');

  const unprivilegedGraph = new NxlGraph();
  unprivilegedGraph.addNode('Operator_Junior', 'Biooperator_Junior');

  const manifestSource = `
    define nexus_production_manifest
    node ProductionKernel : IDENTITY(Kernel_Identity) SIGNATURE(0xROOT_KERNEL_01)
    state nexus_root.status : BellasStatus = BellasStatus.SECURE
    set nexus_root.status = BellasStatus.SECURE
    assert nexus_root.status == SECURE
  `;

  // --------------------------------------------------------------------------
  // [TEST A] applySeal() without approval -> DENY
  // --------------------------------------------------------------------------
  console.log('[TEST A] applySeal() without approval (AI SUGGESTION != SEAL)');
  {
    const scribe = new ScribeIDE(manifestSource, 'src/nexus/core/manifest.nxl');

    // 1. Direct applySeal call without proposalId
    const directResult = scribe.applySeal('0xROOT_MACIEJ_ARCHITECT_SEAL_9918');
    runner.assert(directResult.sealed === false, 'Direct applySeal() without proposalId is DENIED.');
    runner.assert(directResult.status === 'DENIED', 'Status is strictly DENIED.');
    runner.assert(directResult.reason?.includes('requires an approved DecisionProposal') === true, 'Reason explicitly cites DecisionProposal requirement.');
    runner.assert(scribe.getState().isSealed === false, 'Scribe manifest state remains unsealed.');

    // 2. HTTP endpoint /api/scribe/seal without proposalId returns 202 REVIEW_REQUIRED
    try {
      const resp = await fetch('http://localhost:3000/api/scribe/seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: manifestSource,
          targetArtifact: 'src/nexus/core/manifest.nxl',
          signature: '0xROOT_MACIEJ_ARCHITECT_SEAL_9918',
        }),
      });
      const data = await resp.json();
      runner.assert(resp.status === 202, 'HTTP endpoint returns status 202 (Accepted / Review Required).');
      runner.assert(data.mutationBlocked === true, 'HTTP endpoint flags mutationBlocked: true.');
      runner.assert(typeof data.proposalId === 'string' && data.proposalId.startsWith('PROP-'), 'HTTP endpoint returns generated proposalId.');
    } catch (e: any) {
      runner.assert(false, `HTTP request failed: ${e.message}`);
    }
  }

  // --------------------------------------------------------------------------
  // [TEST B] applySeal() without capability (AccessManager PDP DENY)
  // --------------------------------------------------------------------------
  console.log('\n[TEST B] applySeal() without capability (AccessManager PDP DENY)');
  {
    const scribe = new ScribeIDE(manifestSource, 'src/nexus/core/manifest.nxl');
    const prep = scribe.prepareSeal({ targetArtifact: 'src/nexus/core/manifest.nxl' });

    let capDenied = false;
    let capReason = '';
    try {
      decisionGate.approve(prep.proposalId, 'Operator_Junior', 'HUMAN', {
        graph: unprivilegedGraph,
        signature: '0xROOT_MACIEJ_ARCHITECT_SEAL_9918',
      });
    } catch (e: any) {
      capDenied = e.message.includes('Capability check failed');
      capReason = e.message;
    }

    runner.assert(capDenied, 'Approval by operator lacking nexus.core.seal capability is strictly DENIED.');
    runner.assert(capReason.includes('nexus.core.seal'), 'Error explicitly cites nexus.core.seal capability failure.');

    const prop = decisionGate.getProposal(prep.proposalId);
    runner.assert(prop.status === 'REVIEW_REQUIRED', 'Proposal remains in REVIEW_REQUIRED state.');
  }

  // --------------------------------------------------------------------------
  // [TEST C] Client sending forged approved=true -> DENY
  // --------------------------------------------------------------------------
  console.log('\n[TEST C] Client sending forged approved=true -> DENY');
  {
    try {
      const resp = await fetch('http://localhost:3000/api/scribe/seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: manifestSource,
          targetArtifact: 'src/nexus/core/manifest.nxl',
          signature: '0xROOT_MACIEJ_ARCHITECT_SEAL_9918',
          approved: true, // Forged client-side flag
        }),
      });
      const data = await resp.json();
      runner.assert(resp.status === 403, 'Endpoint returns HTTP 403 Forbidden for forged approved=true.');
      runner.assert(data.error?.includes('Client-side JSON tampering') === true, 'Error identifies client-side JSON tampering attempt.');
      runner.assert(data.status === 'DENIED', 'Status is strictly DENIED.');
    } catch (e: any) {
      runner.assert(false, `HTTP request failed: ${e.message}`);
    }
  }

  // --------------------------------------------------------------------------
  // [TEST D] Fake 0xROOT string -> DENY / nie jest podpisem
  // --------------------------------------------------------------------------
  console.log('\n[TEST D] Fake 0xROOT string -> DENY / nie jest podpisem');
  {
    const scribe = new ScribeIDE(manifestSource);
    const uncert = scribe.applySeal('0xATTACKER_INVALID_SIGNATURE');
    runner.assert(uncert.sealed === false, 'applySeal rejects signature without 0xROOT prefix.');
    runner.assert(uncert.reason?.includes('REJECTED') === true, 'Rejection reason states valid authority certificate required.');

    // Verify 0xROOT is classified as IDENTITY_LABEL and asymmetric crypto is NOT_IMPLEMENTED
    const cert = SecurityVault.verifySignature('0xROOT_MACIEJ_ARCHITECT_SEAL_9918');
    runner.assert(cert.labelType === 'IDENTITY_LABEL', '0xROOT signature is explicitly classified as IDENTITY_LABEL.');
    runner.assert(cert.cryptoVerificationStatus === 'NOT_IMPLEMENTED', 'Cryptographic signature is explicitly marked NOT_IMPLEMENTED.');
  }

  // --------------------------------------------------------------------------
  // [TEST E] Attempt to seal with REJECTED proposal -> DENY
  // --------------------------------------------------------------------------
  console.log('\n[TEST E] Attempt to seal with REJECTED proposal -> DENY');
  {
    const scribe = new ScribeIDE(manifestSource, 'src/nexus/core/manifest.nxl');
    const prep = scribe.prepareSeal();
    decisionGate.reject(prep.proposalId, 'Maciej_Architekt', 'Security audit rejected manifest changes.');

    let rejBlocked = false;
    try {
      scribe.applySeal('0xROOT_MACIEJ_ARCHITECT_SEAL_9918', {
        proposalId: prep.proposalId,
        graph: privilegedGraph,
      });
    } catch (e: any) {
      rejBlocked = e.message.includes('REJECTED');
    }
    runner.assert(rejBlocked, 'applySeal() on REJECTED proposal throws denial error.');
    runner.assert(scribe.getState().isSealed === false, 'Manifest remains unsealed.');
  }

  // --------------------------------------------------------------------------
  // [TEST F] Attempt to seal with EXPIRED proposal -> DENY
  // --------------------------------------------------------------------------
  console.log('\n[TEST F] Attempt to seal with EXPIRED proposal -> DENY');
  {
    const canonicalHash = SecurityVault.computeSha256Simulated(manifestSource);
    const expProp = decisionGate.propose({
      actorId: 'ScribeIDE',
      actorType: 'AI_AGENT',
      action: 'SCRIBE_APPLY_SEAL',
      target: 'src/nexus/core/manifest.nxl',
      reason: 'Expired seal test',
      requiredCapability: 'nexus.core.seal',
      ttlSeconds: -10, // already expired
      evidence: [{ details: { canonicalArtifactHash: canonicalHash, targetArtifact: 'src/nexus/core/manifest.nxl' } }],
    });

    let expBlocked = false;
    try {
      const scribe = new ScribeIDE(manifestSource, 'src/nexus/core/manifest.nxl');
      scribe.applySeal('0xROOT_MACIEJ_ARCHITECT_SEAL_9918', {
        proposalId: expProp.proposalId,
        graph: privilegedGraph,
      });
    } catch (e: any) {
      expBlocked = e.message.includes('EXPIRED');
    }
    runner.assert(expBlocked, 'applySeal() on EXPIRED proposal throws denial error.');
  }

  // --------------------------------------------------------------------------
  // [TEST G] Changed artifact after approval -> STALE_ARTIFACT / DENY
  // --------------------------------------------------------------------------
  console.log('\n[TEST G] Changed artifact after approval -> STALE_ARTIFACT / DENY');
  {
    const scribe = new ScribeIDE(manifestSource, 'src/nexus/core/manifest.nxl');
    const prep = scribe.prepareSeal();

    decisionGate.approve(prep.proposalId, 'Maciej_Architekt', 'HUMAN', {
      graph: privilegedGraph,
      signature: '0xROOT_MACIEJ_ARCHITECT_SEAL_9918',
    });

    // Attacker alters source code after human operator approved original source
    const tamperedSource = manifestSource + '\n// INJECTED BACKDOOR CODE';
    const tamperedScribe = new ScribeIDE(tamperedSource, 'src/nexus/core/manifest.nxl');

    let staleBlocked = false;
    let staleReason = '';
    try {
      tamperedScribe.applySeal('0xROOT_MACIEJ_ARCHITECT_SEAL_9918', {
        proposalId: prep.proposalId,
        graph: privilegedGraph,
      });
    } catch (e: any) {
      staleBlocked = e.message.includes('STALE_ARTIFACT');
      staleReason = e.message;
    }

    runner.assert(staleBlocked, 'applySeal() on modified artifact throws STALE_ARTIFACT denial.');
    runner.assert(staleReason.includes('STALE_ARTIFACT'), 'Error explicitly identifies canonical hash mismatch.');
  }

  // --------------------------------------------------------------------------
  // [TEST H] Direct file mutation -> DENY
  // --------------------------------------------------------------------------
  console.log('\n[TEST H] Direct file mutation -> DENY');
  {
    // 1. Direct write to protected kernel core path
    let coreWriteBlocked = false;
    try {
      nxlRuntimeCore.executeFileWrite('src/nexus/core/hacked.ts', 'malicious code', {
        signature: '0xROOT_MACIEJ_ARCHITECT_SEAL_9918',
      });
    } catch (e: any) {
      coreWriteBlocked = e.message.includes('EXECUTION_BOUNDARY_DENY');
    }
    runner.assert(coreWriteBlocked, 'Direct executeFileWrite to kernel core path throws EXECUTION_BOUNDARY_DENY.');

    // 2. Direct write to protected .nxl file
    let nxlWriteBlocked = false;
    try {
      nxlRuntimeCore.executeFileWrite('system.nxl', 'malicious code', {
        signature: '0xROOT_MACIEJ_ARCHITECT_SEAL_9918',
      });
    } catch (e: any) {
      nxlWriteBlocked = e.message.includes('EXECUTION_BOUNDARY_DENY');
    }
    runner.assert(nxlWriteBlocked, 'Direct executeFileWrite to *.nxl file throws EXECUTION_BOUNDARY_DENY.');

    // 3. validateFileWritePermission on unprotected public path without proposalId
    const publicWrite = nxlRuntimeCore.validateFileWritePermission('public/test.txt', '0xROOT_MACIEJ_ARCHITECT_SEAL_9918');
    runner.assert(publicWrite.permitted === false, 'validateFileWritePermission rejects write without DecisionGate proposal.');
    runner.assert(publicWrite.reason.includes('DECISION_GATE_DENY'), 'Reason cites DECISION_GATE_DENY requirement.');
  }

  // --------------------------------------------------------------------------
  // [TEST I] Direct manifest mutation on sealed manifest -> DENY
  // --------------------------------------------------------------------------
  console.log('\n[TEST I] Direct manifest mutation on sealed manifest -> DENY');
  {
    const scribe = new ScribeIDE(manifestSource, 'src/nexus/core/manifest.nxl');
    const prep = scribe.prepareSeal();
    decisionGate.approve(prep.proposalId, 'Maciej_Architekt', 'HUMAN', {
      graph: privilegedGraph,
      signature: '0xROOT_MACIEJ_ARCHITECT_SEAL_9918',
    });
    scribe.applySeal('0xROOT_MACIEJ_ARCHITECT_SEAL_9918', {
      proposalId: prep.proposalId,
      graph: privilegedGraph,
    });

    runner.assert(scribe.getState().isSealed === true, 'Manifest is sealed.');

    let mutateBlocked = false;
    try {
      scribe.setSource('define hacked_manifest');
    } catch (e: any) {
      mutateBlocked = e.message.includes('EXECUTION_BOUNDARY_DENY');
    }
    runner.assert(mutateBlocked, 'Calling setSource() on sealed manifest throws EXECUTION_BOUNDARY_DENY.');

    let directMutateBlocked = false;
    try {
      scribe.mutateManifestDirect('define hacked_manifest');
    } catch (e: any) {
      directMutateBlocked = e.message.includes('EXECUTION_BOUNDARY_DENY');
    }
    runner.assert(directMutateBlocked, 'Calling mutateManifestDirect() on sealed manifest throws EXECUTION_BOUNDARY_DENY.');
  }

  // --------------------------------------------------------------------------
  // [TEST J] Direct seal mutation -> DENY
  // --------------------------------------------------------------------------
  console.log('\n[TEST J] Direct seal mutation -> DENY');
  {
    const scribe = new ScribeIDE(manifestSource);
    let directSealBlocked = false;
    try {
      scribe.setSealDirect(true);
    } catch (e: any) {
      directSealBlocked = e.message.includes('EXECUTION_BOUNDARY_DENY');
    }
    runner.assert(directSealBlocked, 'Calling setSealDirect() throws EXECUTION_BOUNDARY_DENY.');
  }

  // --------------------------------------------------------------------------
  // [TEST K] Valid human approval + capability + matching artifact -> EXECUTE
  // --------------------------------------------------------------------------
  console.log('\n[TEST K] Valid human approval + capability + matching artifact -> EXECUTE');
  {
    const scribe = new ScribeIDE(manifestSource, 'src/nexus/core/manifest.nxl');
    const prep = scribe.prepareSeal();
    runner.assert(prep.status === 'REVIEW_REQUIRED', 'prepareSeal returns REVIEW_REQUIRED.');

    const approvedProposal = decisionGate.approve(prep.proposalId, 'Maciej_Architekt', 'HUMAN', {
      graph: privilegedGraph,
      signature: '0xROOT_MACIEJ_ARCHITECT_SEAL_9918',
      reason: 'Authorized 0xROOT architectural seal after code review.',
    });
    runner.assert(approvedProposal.status === 'APPROVED', 'Proposal status transitioned to APPROVED.');

    const sealResult = scribe.applySeal('0xROOT_MACIEJ_ARCHITECT_SEAL_9918', {
      proposalId: prep.proposalId,
      actorId: 'ScribeIDE',
      graph: privilegedGraph,
    });

    runner.assert(sealResult.sealed === true, 'applySeal() returns sealed: true.');
    runner.assert(sealResult.status === 'SEALED', 'Status is strictly SEALED.');
    runner.assert(scribe.getState().isSealed === true, 'Scribe state isSealed is true.');
    runner.assert(scribe.getState().sealSignature === '0xROOT_MACIEJ_ARCHITECT_SEAL_9918', 'Seal signature correctly inscribed.');

    const finalProp = decisionGate.getProposal(prep.proposalId);
    runner.assert(finalProp.status === 'EXECUTED', 'DecisionGate marks proposal as EXECUTED.');
  }

  // --------------------------------------------------------------------------
  // [TEST L] Double seal execution -> DENY (No Replay)
  // --------------------------------------------------------------------------
  console.log('\n[TEST L] Double seal execution -> DENY (No Replay)');
  {
    const scribe = new ScribeIDE(manifestSource, 'src/nexus/core/manifest.nxl');
    const prep = scribe.prepareSeal();
    decisionGate.approve(prep.proposalId, 'Maciej_Architekt', 'HUMAN', {
      graph: privilegedGraph,
      signature: '0xROOT_MACIEJ_ARCHITECT_SEAL_9918',
    });
    scribe.applySeal('0xROOT_MACIEJ_ARCHITECT_SEAL_9918', {
      proposalId: prep.proposalId,
      graph: privilegedGraph,
    });

    // Attempt second execution with same proposalId
    let doubleBlocked = false;
    try {
      const secondScribe = new ScribeIDE(manifestSource, 'src/nexus/core/manifest.nxl');
      secondScribe.applySeal('0xROOT_MACIEJ_ARCHITECT_SEAL_9918', {
        proposalId: prep.proposalId,
        graph: privilegedGraph,
      });
    } catch (e: any) {
      doubleBlocked = e.message.includes('already been EXECUTED');
    }
    runner.assert(doubleBlocked, 'Double seal execution with already EXECUTED proposal is DENIED.');
  }

  // --------------------------------------------------------------------------
  // [TEST M] Concurrent seal attempts -> exactly one execution
  // --------------------------------------------------------------------------
  console.log('\n[TEST M] Concurrent seal attempts -> exactly one execution');
  {
    const scribe = new ScribeIDE(manifestSource, 'src/nexus/core/manifest.nxl');
    const prep = scribe.prepareSeal();
    decisionGate.approve(prep.proposalId, 'Maciej_Architekt', 'HUMAN', {
      graph: privilegedGraph,
      signature: '0xROOT_MACIEJ_ARCHITECT_SEAL_9918',
    });

    const p1 = Promise.resolve().then(() =>
      scribe.applySeal('0xROOT_MACIEJ_ARCHITECT_SEAL_9918', {
        proposalId: prep.proposalId,
        graph: privilegedGraph,
      })
    );
    const p2 = Promise.resolve().then(() =>
      scribe.applySeal('0xROOT_MACIEJ_ARCHITECT_SEAL_9918', {
        proposalId: prep.proposalId,
        graph: privilegedGraph,
      })
    );

    const settled = await Promise.allSettled([p1, p2]);
    const successes = settled.filter((s) => s.status === 'fulfilled');
    const failures = settled.filter((s) => s.status === 'rejected');

    runner.assert(successes.length === 1, 'Exactly one concurrent seal attempt succeeded.');
    runner.assert(failures.length === 1, 'Exactly one concurrent seal attempt was blocked.');
  }

  // --------------------------------------------------------------------------
  // [TEST N] Failed commit -> FAILED, not EXECUTED
  // --------------------------------------------------------------------------
  console.log('\n[TEST N] Failed commit -> FAILED, not EXECUTED');
  {
    const failingSource = `
      define failing_manifest
      state cluster.node : Number = 10
      set cluster.node = 10
      assert cluster.node == 999
    `;
    const scribe = new ScribeIDE(failingSource, 'src/nexus/core/manifest.nxl');

    let prepFailed = false;
    try {
      scribe.prepareSeal();
    } catch (e: any) {
      prepFailed = e.message.includes('SCRIBE_LINT_ERROR');
    }
    runner.assert(prepFailed, 'prepareSeal() throws error when manifest fails Truth assertions.');

    const res = scribe.applySeal('0xROOT_MACIEJ_ARCHITECT_SEAL_9918');
    runner.assert(res.sealed === false, 'applySeal() returns sealed: false on diagnostics error.');
    runner.assert(res.status === 'FAILED', 'Status is strictly FAILED.');
  }

  // --------------------------------------------------------------------------
  // [TEST O] Ledger provenance -> VERIFIED
  // --------------------------------------------------------------------------
  console.log('\n[TEST O] Ledger provenance -> VERIFIED');
  {
    const scribe = new ScribeIDE(manifestSource, 'src/nexus/core/manifest.nxl');
    const prep = scribe.prepareSeal();
    decisionGate.approve(prep.proposalId, 'Maciej_Architekt', 'HUMAN', {
      graph: privilegedGraph,
      signature: '0xROOT_MACIEJ_ARCHITECT_SEAL_9918',
      reason: 'Ledger provenance verification approval',
    });
    scribe.applySeal('0xROOT_MACIEJ_ARCHITECT_SEAL_9918', {
      proposalId: prep.proposalId,
      graph: privilegedGraph,
    });

    const provenance = decisionGate.getProposalHistory(prep.proposalId);
    runner.assert(provenance.ledgerEntries.length >= 3, 'State Ledger contains all lifecycle transition entries.');
    runner.assert(provenance.ledgerEntries[0].newStatus === 'REVIEW_REQUIRED', 'Record 1: REVIEW_REQUIRED.');
    runner.assert(provenance.ledgerEntries[1].newStatus === 'APPROVED', 'Record 2: APPROVED.');
    runner.assert(provenance.ledgerEntries[2].newStatus === 'EXECUTED', 'Record 3: EXECUTED.');
    runner.assert(provenance.proposal.approval?.humanActorId === 'Maciej_Architekt', 'Ledger confirms human approver Maciej_Architekt.');

    const auditLogs = nxlRuntimeCore.ledger.filter(
      (l) => l.target === 'AUDIT:SCRIBE_SEAL_APPLIED' && (l.newValue as any)?.proposalId === prep.proposalId
    );
    runner.assert(auditLogs.length > 0, 'NxlRuntimeCore State Ledger contains SCRIBE_SEAL_APPLIED audit record.');
  }

  // --------------------------------------------------------------------------
  // [TEST P] NexusBus events -> VERIFIED
  // --------------------------------------------------------------------------
  console.log('\n[TEST P] NexusBus events -> VERIFIED');
  {
    const eventsCaptured: string[] = [];
    const unsub1 = nexusBus.subscribe('SEAL_EXECUTION_STARTED', (e) => eventsCaptured.push(e.event));
    const unsub2 = nexusBus.subscribe('SEAL_EXECUTED', (e) => eventsCaptured.push(e.event));

    const scribe = new ScribeIDE(manifestSource, 'src/nexus/core/manifest.nxl');
    const prep = scribe.prepareSeal();
    decisionGate.approve(prep.proposalId, 'Maciej_Architekt', 'HUMAN', {
      graph: privilegedGraph,
      signature: '0xROOT_MACIEJ_ARCHITECT_SEAL_9918',
    });
    scribe.applySeal('0xROOT_MACIEJ_ARCHITECT_SEAL_9918', {
      proposalId: prep.proposalId,
      graph: privilegedGraph,
    });

    unsub1();
    unsub2();

    runner.assert(eventsCaptured.includes('SEAL_EXECUTION_STARTED'), 'SEAL_EXECUTION_STARTED event emitted on NexusBus.');
    runner.assert(eventsCaptured.includes('SEAL_EXECUTED'), 'SEAL_EXECUTED event emitted on NexusBus.');
  }

  runner.summary();
}

runTestSuite().catch((err) => {
  console.error('[FATAL ERROR] Test suite aborted:', err);
  process.exit(1);
});
