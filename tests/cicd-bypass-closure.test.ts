// ==============================================================================
// NEXUS OS — PHASE 2.2: QUANTUM CI/CD DEPLOYMENT BYPASS CLOSURE TEST SUITE
// Tests A through Q: End-to-end Human Decision Gate Enforcement on CI/CD Deployments
// Constitutional Principle: "BELLA SUGERUJE. LUDZIE WYBIERAJĄ. NEXUS WERYFIKUJE. NEXUS WYKONUJE. LEDGER PAMIĘTA."
// ==============================================================================

import { quantumCicd, casStorage } from '../src/nexus/services/quantum-cicd-pipeline';
import { ZipAnalyzerNode } from '../src/nexus/nxl-engine/zipAnalyzer';
import { decisionGate } from '../src/nexus/core/decision';
import { nexusBus } from '../src/nexus/bridges/nexus-bus';
import { NxlGraph } from '../src/nexus/core/nxl/graph';

class TestRunner {
  private total = 0;
  private passed = 0;
  private failed = 0;

  assert(condition: boolean, desc: string) {
    this.total++;
    if (condition) {
      this.passed++;
      console.log(`  ✓ [TEST #${this.total.toString().padStart(2, '0')}] PASS: ${desc}`);
    } else {
      this.failed++;
      console.error(`  ✗ [TEST #${this.total.toString().padStart(2, '0')}] FAIL: ${desc}`);
    }
  }

  summary() {
    console.log('\n======================================================================');
    console.log('NEXUS PHASE 2.2 CI/CD BYPASS CLOSURE TEST SUMMARY:');
    console.log(`Total Assertions Evaluated : ${this.total}`);
    console.log(`Passed Assertions         : ${this.passed}`);
    console.log(`Failed Assertions         : ${this.failed}`);
    console.log('======================================================================\n');

    if (this.failed > 0) {
      console.error(`[FATAL] CI/CD bypass closure suite failed with ${this.failed} failing assertion(s).`);
      process.exit(1);
    } else {
      console.log('>>> ALL 17 CI/CD DEPLOYMENT SECURITY GATES VERIFIED CLOSED [PASS] <<<\n');
    }
  }
}

async function runCicdBypassClosureSuite() {
  const runner = new TestRunner();
  console.log('\n======================================================================');
  console.log('=== STARTING NEXUS CORE PHASE 2.2 — CI/CD DEPLOYMENT BYPASS SUITE ===');
  console.log('======================================================================\n');

  const serverUrl = 'http://127.0.0.1:3000';

  // Privileged graph with synapse.mesh.deploy capability
  const privilegedGraph = new NxlGraph();
  privilegedGraph.grantCapability('Elena_LightEngine', 'synapse.mesh.deploy');
  privilegedGraph.grantCapability('Maciej_Architekt', 'synapse.mesh.deploy');

  // Unprivileged graph lacking deployment capability
  const unprivilegedGraph = new NxlGraph();
  unprivilegedGraph.grantCapability('Bob_Unprivileged', 'nexus.sensor.read');

  // Sample clean ZIP package
  const cleanZipUint8 = await ZipAnalyzerNode.createSampleZip(false);
  const cleanZipBase64 = Buffer.from(cleanZipUint8).toString('base64');

  // Multi-threat malicious ZIP package
  const threatZipUint8 = await ZipAnalyzerNode.createMultiThreatZip();
  const threatZipBase64 = Buffer.from(threatZipUint8).toString('base64');

  // --------------------------------------------------------------------------
  // TEST A: Deploy without required capability -> DENY
  // --------------------------------------------------------------------------
  console.log('[TEST A] Deploy without capability (AccessManager PDP DENY)');
  const prepA = await quantumCicd.prepareDeployment(cleanZipUint8, 'test-package-a.zip');
  runner.assert(prepA.prepared === true && prepA.status === 'REVIEW_REQUIRED', 'Package prepared with REVIEW_REQUIRED.');

  let testABlocked = false;
  let testAError = '';
  try {
    decisionGate.approve(prepA.proposalId!, 'Bob_Unprivileged', 'HUMAN', {
      graph: unprivilegedGraph
    });
  } catch (err: any) {
    testABlocked = true;
    testAError = err.message;
  }

  runner.assert(testABlocked === true, 'Approval by operator lacking synapse.mesh.deploy capability is DENIED.');
  runner.assert(testAError.includes('Capability check failed'), 'Error explicitly cites Capability check failure.');
  runner.assert(decisionGate.getProposal(prepA.proposalId!).status === 'REVIEW_REQUIRED', 'Proposal remains in REVIEW_REQUIRED.');

  // --------------------------------------------------------------------------
  // TEST B: Deploy without HumanApproval -> REVIEW_REQUIRED / DENY (No Auto-deploy)
  // --------------------------------------------------------------------------
  console.log('\n[TEST B] Deploy without HumanApproval (ANALYZE != DEPLOY)');
  const resB = await fetch(`${serverUrl}/api/cicd/deploy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      base64Data: cleanZipBase64,
      fileName: 'clean-service.zip'
    }),
  });
  const bodyB = await resB.json();

  runner.assert(resB.status === 202, 'HTTP endpoint returns status 202 (Accepted / Review Required).');
  runner.assert(bodyB.mutationBlocked === true, 'Execution is halted (mutationBlocked: true).');
  runner.assert(bodyB.status === 'REVIEW_REQUIRED', 'Status is strictly REVIEW_REQUIRED, not DEPLOYED.');
  runner.assert(typeof bodyB.proposalId === 'string' && bodyB.proposalId.startsWith('PROP-'), 'Server generated DecisionProposal.');
  runner.assert(casStorage.get(bodyB.artifactHash) === undefined, 'Artifact has NOT been committed to CAS storage.');

  // --------------------------------------------------------------------------
  // TEST C: Client sending forged approved=true -> DENY
  // --------------------------------------------------------------------------
  console.log('\n[TEST C] Client sending forged approved=true -> DENY');
  const resC = await fetch(`${serverUrl}/api/cicd/deploy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      base64Data: cleanZipBase64,
      approved: true
    }),
  });
  const bodyC = await resC.json();

  runner.assert(resC.status === 403, 'Endpoint returns HTTP 403 Forbidden.');
  runner.assert(bodyC.error.includes('[DECISION_GATE_DENY]'), 'Error detects forged approved=true.');
  runner.assert(bodyC.status === 'DENIED', 'Status is DENIED.');

  // --------------------------------------------------------------------------
  // TEST D: Nonexistent proposalId -> DENY
  // --------------------------------------------------------------------------
  console.log('\n[TEST D] Execution with nonexistent proposalId -> DENY');
  const resD = await fetch(`${serverUrl}/api/cicd/deploy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      proposalId: 'PROP-NONEXISTENT-999',
      base64Data: cleanZipBase64
    }),
  });
  const bodyD = await resD.json();

  runner.assert(resD.status === 403, 'Endpoint returns HTTP 403 for fake proposalId.');
  runner.assert(bodyD.status === 'DENIED', 'Status is DENIED.');

  // --------------------------------------------------------------------------
  // TEST E: Attempt to execute deployment with REJECTED proposal -> DENY
  // --------------------------------------------------------------------------
  console.log('\n[TEST E] Attempt to execute deployment with REJECTED proposal -> DENY');
  const prepE = await quantumCicd.prepareDeployment(cleanZipUint8, 'rejected-pkg.zip');
  decisionGate.reject(prepE.proposalId!, 'Elena_LightEngine', 'Package rejected due to unverified dependency.');

  let testEBlocked = false;
  try {
    await quantumCicd.executeDeployment({
      proposalId: prepE.proposalId!,
      packageBuffer: cleanZipUint8,
      packageName: 'rejected-pkg.zip'
    });
  } catch (err: any) {
    testEBlocked = err.message.includes('REJECTED');
  }

  runner.assert(testEBlocked === true, 'Execution of REJECTED deployment proposal is strictly denied.');

  // --------------------------------------------------------------------------
  // TEST F: Attempt to execute deployment with EXPIRED proposal -> DENY
  // --------------------------------------------------------------------------
  console.log('\n[TEST F] Attempt to execute deployment with EXPIRED proposal -> DENY');
  const propF = decisionGate.propose({
    actorId: 'QuantumCicdPipeline',
    action: 'DEPLOY_PACKAGE',
    target: 'Production Mesh Registry',
    reason: 'Expiration test',
    riskLevel: 'HIGH',
    requiredCapability: 'synapse.mesh.deploy',
    ttlSeconds: -1 // Expired immediately
  });

  let testFBlocked = false;
  try {
    await quantumCicd.executeDeployment({
      proposalId: propF.proposalId,
      packageBuffer: cleanZipUint8,
      packageName: 'expired-pkg.zip'
    });
  } catch (err: any) {
    testFBlocked = err.message.includes('EXPIRED');
  }

  runner.assert(testFBlocked === true, 'Execution of EXPIRED deployment proposal is strictly denied.');

  // --------------------------------------------------------------------------
  // TEST G: Changed artifact after human approval (Stale Artifact Anti-Tamper) -> DENY
  // --------------------------------------------------------------------------
  console.log('\n[TEST G] Changed artifact after human approval (Stale Artifact Anti-Tamper)');
  const prepG = await quantumCicd.prepareDeployment(cleanZipUint8, 'original-service.zip');
  decisionGate.approve(prepG.proposalId!, 'Elena_LightEngine', 'HUMAN', {
    graph: privilegedGraph,
    signature: '0xROOT_ELENA_LIGHT_ENG_8812'
  });

  // Tampered payload modified after approval
  const tamperedZipUint8 = Buffer.from(cleanZipUint8);
  tamperedZipUint8[tamperedZipUint8.length - 1] ^= 0xff; // Flip bits to alter hash

  let testGBlocked = false;
  let testGError = '';
  try {
    await quantumCicd.executeDeployment({
      proposalId: prepG.proposalId!,
      packageBuffer: tamperedZipUint8,
      packageName: 'original-service.zip'
    });
  } catch (err: any) {
    testGBlocked = true;
    testGError = err.message;
  }

  runner.assert(testGBlocked === true, 'Deployment with modified artifact throws error.');
  runner.assert(testGError.includes('STALE_ARTIFACT'), 'Error explicitly detects STALE_ARTIFACT hash mismatch.');

  // --------------------------------------------------------------------------
  // TEST H: Direct executeDeployment() without approval -> DENY
  // --------------------------------------------------------------------------
  console.log('\n[TEST H] Direct executeDeployment() without human approval -> DENY');
  const prepH = await quantumCicd.prepareDeployment(cleanZipUint8, 'unapproved-direct.zip');

  let testHBlocked = false;
  try {
    await quantumCicd.executeDeployment({
      proposalId: prepH.proposalId!,
      packageBuffer: cleanZipUint8,
      packageName: 'unapproved-direct.zip'
    });
  } catch (err: any) {
    testHBlocked = err.message.includes('APPROVED');
  }

  runner.assert(testHBlocked === true, 'Direct executeDeployment() throws error when approval is missing.');

  // --------------------------------------------------------------------------
  // TEST I: Direct executeDeployment() with forged approval (Proposer == Approver) -> DENY
  // --------------------------------------------------------------------------
  console.log('\n[TEST I] Direct executeDeployment() with Separation of Duties violation -> DENY');
  const propI = decisionGate.propose({
    actorId: 'Autonomous_Agent_X',
    action: 'DEPLOY_PACKAGE',
    target: 'Production Mesh Registry',
    reason: 'Self-approval exploit attempt',
    riskLevel: 'HIGH',
    requiredCapability: 'synapse.mesh.deploy'
  });

  let testIBlocked = false;
  let testIError = '';
  try {
    // Attempting self-approval by agent
    decisionGate.approve(propI.proposalId, 'Autonomous_Agent_X', 'AI_AGENT', {
      graph: privilegedGraph
    });
  } catch (err: any) {
    testIBlocked = true;
    testIError = err.message;
  }

  runner.assert(testIBlocked === true, 'AI self-approval strictly rejected.');
  runner.assert(testIError.includes('Human Sovereignty Violation') || testIError.includes('Separation of Duties'), 'Violation correctly identified.');

  // --------------------------------------------------------------------------
  // TEST J: Approved proposal + matching artifact -> EXECUTE (status DEPLOYED)
  // --------------------------------------------------------------------------
  console.log('\n[TEST J] Approved proposal + matching artifact -> EXECUTE (status DEPLOYED)');
  let eventStarted = false;
  let eventExecuted = false;
  const unsubStarted = nexusBus.subscribe('DEPLOYMENT_STARTED', () => { eventStarted = true; });
  const unsubExecuted = nexusBus.subscribe('DEPLOYMENT_EXECUTED', () => { eventExecuted = true; });

  const prepJ = await quantumCicd.prepareDeployment(cleanZipUint8, 'production-core-v1.zip');
  decisionGate.approve(prepJ.proposalId!, 'Elena_LightEngine', 'HUMAN', {
    graph: privilegedGraph,
    signature: '0xROOT_ELENA_LIGHT_ENG_8812',
    reason: 'Approved for production cluster deployment'
  });

  const execJ = await quantumCicd.executeDeployment({
    proposalId: prepJ.proposalId!,
    packageBuffer: cleanZipUint8,
    packageName: 'production-core-v1.zip',
    actorId: 'Elena_LightEngine',
    graph: privilegedGraph
  });

  runner.assert(execJ.success === true, 'Deployment execution returns success: true.');
  runner.assert(execJ.status === 'DEPLOYED', 'Status is formally DEPLOYED.');
  runner.assert(casStorage.get(execJ.artifactHash) !== undefined, 'Artifact is committed to CAS storage.');
  runner.assert(decisionGate.getProposal(prepJ.proposalId!).status === 'EXECUTED', 'DecisionGate marks proposal EXECUTED.');
  runner.assert(eventStarted === true, 'NexusBus emitted DEPLOYMENT_STARTED.');
  runner.assert(eventExecuted === true, 'NexusBus emitted DEPLOYMENT_EXECUTED.');
  unsubStarted();
  unsubExecuted();

  // --------------------------------------------------------------------------
  // TEST K: Double deployment defense (Replay attack prevention)
  // --------------------------------------------------------------------------
  console.log('\n[TEST K] Double deployment defense (Replay attack prevention)');
  let testKBlocked = false;
  try {
    await quantumCicd.executeDeployment({
      proposalId: prepJ.proposalId!,
      packageBuffer: cleanZipUint8,
      packageName: 'production-core-v1.zip'
    });
  } catch (err: any) {
    testKBlocked = err.message.includes('EXECUTED');
  }

  runner.assert(testKBlocked === true, 'Double execution of already EXECUTED proposal is DENIED.');

  // --------------------------------------------------------------------------
  // TEST L: Concurrent deployment mutex defense
  // --------------------------------------------------------------------------
  console.log('\n[TEST L] Concurrent deployment mutex defense');
  const prepL = await quantumCicd.prepareDeployment(cleanZipUint8, 'concurrent-service.zip');
  decisionGate.approve(prepL.proposalId!, 'Elena_LightEngine', 'HUMAN', {
    graph: privilegedGraph,
    signature: '0xROOT_ELENA_LIGHT_ENG_8812'
  });

  // Launch two deployment promises concurrently
  const [resL1, resL2] = await Promise.allSettled([
    quantumCicd.executeDeployment({
      proposalId: prepL.proposalId!,
      packageBuffer: cleanZipUint8,
      packageName: 'concurrent-service.zip'
    }),
    quantumCicd.executeDeployment({
      proposalId: prepL.proposalId!,
      packageBuffer: cleanZipUint8,
      packageName: 'concurrent-service.zip'
    })
  ]);

  const successCount = [resL1, resL2].filter((r) => r.status === 'fulfilled').length;
  const rejectedCount = [resL1, resL2].filter((r) => r.status === 'rejected').length;

  runner.assert(successCount === 1, 'Exactly 1 deployment succeeded under concurrency.');
  runner.assert(rejectedCount === 1, 'Exactly 1 deployment was rejected under concurrency.');

  // --------------------------------------------------------------------------
  // TEST M: Deployment failure emits DEPLOYMENT_FAILED and does NOT mark EXECUTED
  // --------------------------------------------------------------------------
  console.log('\n[TEST M] Deployment failure -> DEPLOYMENT_FAILED, NOT EXECUTED');
  let failureEventEmitted = false;
  const unsubFailed = nexusBus.subscribe('DEPLOYMENT_FAILED', () => { failureEventEmitted = true; });

  const prepM = await quantumCicd.prepareDeployment(cleanZipUint8, 'fail-sim.zip');
  decisionGate.approve(prepM.proposalId!, 'Elena_LightEngine', 'HUMAN', {
    graph: privilegedGraph,
    signature: '0xROOT_ELENA_LIGHT_ENG_8812'
  });

  let testMErrorThrown = false;
  try {
    await quantumCicd.executeDeployment({
      proposalId: prepM.proposalId!,
      packageBuffer: cleanZipUint8,
      packageName: 'fail-sim.zip',
      simulateFailure: true
    });
  } catch {
    testMErrorThrown = true;
  }

  runner.assert(testMErrorThrown === true, 'Physical deployment failure throws error.');
  runner.assert(failureEventEmitted === true, 'NexusBus emitted DEPLOYMENT_FAILED.');
  unsubFailed();

  // --------------------------------------------------------------------------
  // TEST N: Clean ZIP without approval must NOT deploy
  // --------------------------------------------------------------------------
  console.log('\n[TEST N] Clean ZIP without approval must NOT deploy (No False DEPLOYED)');
  const initialCasStats = casStorage.getStats().totalEntries;
  const prepN = await quantumCicd.prepareDeployment(cleanZipUint8, 'no-approval.zip');

  runner.assert(prepN.status === 'REVIEW_REQUIRED', 'Clean ZIP is kept in REVIEW_REQUIRED.');
  runner.assert(casStorage.getStats().totalEntries === initialCasStats, 'CAS storage total entries remained unchanged.');

  // --------------------------------------------------------------------------
  // TEST O: ZIP with threat -> DENY / QUARANTINE (HTTP 403)
  // --------------------------------------------------------------------------
  console.log('\n[TEST O] ZIP with security threat -> DENY / QUARANTINE (HTTP 403)');
  const resO = await fetch(`${serverUrl}/api/cicd/deploy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      base64Data: threatZipBase64,
      fileName: 'exploit-attack.zip'
    }),
  });
  const bodyO = await resO.json();

  runner.assert(resO.status === 403, 'Malicious archive returns HTTP 403 Forbidden.');
  runner.assert(bodyO.status === 'BLOCKED_SECURITY_VIOLATION', 'Status is BLOCKED_SECURITY_VIOLATION.');
  runner.assert(bodyO.proposalId === undefined, 'No DecisionProposal is registered for threats.');

  // --------------------------------------------------------------------------
  // TEST P: Proposal provenance and integrity in State Ledger
  // --------------------------------------------------------------------------
  console.log('\n[TEST P] Proposal provenance and integrity in State Ledger');
  const ledgerEntries = decisionGate.getLedger().filter((e) => e.proposalId === prepJ.proposalId);

  runner.assert(ledgerEntries.length >= 3, 'State Ledger contains all 3 transition records.');
  runner.assert(ledgerEntries[0].newStatus === 'REVIEW_REQUIRED', 'Record 1: REVIEW_REQUIRED.');
  runner.assert(ledgerEntries[1].previousStatus === 'REVIEW_REQUIRED' && ledgerEntries[1].newStatus === 'APPROVED', 'Record 2: APPROVED.');
  runner.assert(ledgerEntries[2].previousStatus === 'APPROVED' && ledgerEntries[2].newStatus === 'EXECUTED', 'Record 3: EXECUTED.');
  runner.assert(ledgerEntries[1].actorId === 'Elena_LightEngine', 'Ledger records human approver Elena_LightEngine.');
  runner.assert(ledgerEntries[0].proposalHash === ledgerEntries[2].proposalHash, 'Proposal hash remains cryptographically immutable.');

  // --------------------------------------------------------------------------
  // TEST Q: NexusBus Execution Events Verification
  // --------------------------------------------------------------------------
  console.log('\n[TEST Q] NexusBus Execution Events Verification');
  runner.assert(eventStarted === true, 'DEPLOYMENT_STARTED event was captured on NexusBus.');
  runner.assert(eventExecuted === true, 'DEPLOYMENT_EXECUTED event was captured on NexusBus.');

  runner.summary();
}

runCicdBypassClosureSuite().catch((err) => {
  console.error('[FATAL] Unhandled error in CI/CD bypass closure tests:', err);
  process.exit(1);
});
