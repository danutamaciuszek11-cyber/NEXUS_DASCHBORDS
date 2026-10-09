// ==============================================================================
// NEXUS OS — PHASE 2.1: NXL BYPASS CLOSURE VERIFICATION SUITE
// Tests A through J: End-to-end Human Decision Gate Enforcement on NXL Compiler & Runtime
// Constitutional Principle: "BELLA SUGERUJE. LUDZIE WYBIERAJĄ. NEXUS WERYFIKUJE. NEXUS WYKONUJE. LEDGER PAMIĘTA."
// ==============================================================================

import { nxlRuntime } from '../src/nexus/nxl-engine/runtime';
import { NxlRuntimeCore } from '../src/nexus/core/nxl/runtime';
import { decisionGate } from '../src/nexus/core/decision';
import { nexusBus } from '../src/nexus/bridges/nexus-bus';
import { NxlGraph } from '../src/nexus/core/nxl/graph';
import { SecurityVault } from '../src/nexus/core/nxl/security-vault';

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
    console.log('NEXUS PHASE 2.1 BYPASS CLOSURE TEST SUMMARY:');
    console.log(`Total Assertions Evaluated : ${this.total}`);
    console.log(`Passed Assertions         : ${this.passed}`);
    console.log(`Failed Assertions         : ${this.failed}`);
    console.log('======================================================================\n');

    if (this.failed > 0) {
      console.error(`[FATAL] Bypass closure suite failed with ${this.failed} failing assertion(s).`);
      process.exit(1);
    } else {
      console.log('>>> ALL 10 NXL BYPASS CLOSURE GATES VERIFIED CLOSED [PASS] <<<\n');
    }
  }
}

async function runBypassClosureSuite() {
  const runner = new TestRunner();
  console.log('\n======================================================================');
  console.log('=== STARTING NEXUS CORE PHASE 2.1 — NXL BYPASS CLOSURE TEST SUITE ===');
  console.log('======================================================================\n');

  const serverUrl = 'http://127.0.0.1:3000';

  // Privileged graph with required capabilities for human approvers
  const privilegedGraph = new NxlGraph();
  privilegedGraph.grantCapability('Maciej_Architekt', 'nexus.core.seal');
  privilegedGraph.grantCapability('Maciej_Architekt', 'nexus.cluster.rebalance');

  // Unprivileged graph for testing capability enforcement
  const unprivilegedGraph = new NxlGraph();
  unprivilegedGraph.grantCapability('Bob_Unprivileged', 'nexus.sensor.read');

  // --------------------------------------------------------------------------
  // TEST A: POST /api/nxl/compile with HIGH/CRITICAL mutation without approvalId
  // --------------------------------------------------------------------------
  console.log('[TEST A] POST /api/nxl/compile with HIGH/CRITICAL mutation without approvalId');
  
  const highMutationSource = `
    define critical_cluster_rebalance
    state cluster.failover_node : String = "OLD_PRIMARY"
    set cluster.failover_node = "NEW_SECONDARY_BACKUP"
    assert cluster.failover_node == "NEW_SECONDARY_BACKUP"
  `;

  // 1. HTTP Endpoint Verification
  const initialFailoverVal = nxlRuntime.stateMap.get('cluster.failover_node')?.value;
  const resA = await fetch(`${serverUrl}/api/nxl/compile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source: highMutationSource }),
  });
  const bodyA = await resA.json();

  runner.assert(resA.status === 202, 'HTTP status is 202 (Accepted / Review Required).');
  runner.assert(bodyA.mutationBlocked === true, 'Execution is halted and mutationBlocked is true.');
  runner.assert(bodyA.status === 'REVIEW_REQUIRED', 'Proposal status is REVIEW_REQUIRED.');
  runner.assert(typeof bodyA.proposalId === 'string' && bodyA.proposalId.startsWith('PROP-'), 'Valid proposalId generated.');
  runner.assert(nxlRuntime.stateMap.get('cluster.failover_node')?.value === initialFailoverVal, 'Runtime stateStore remains completely unmutated.');

  // 2. In-Process NexusBus & DecisionGate Verification
  let testABusReceived = false;
  let testABusProposalId = '';
  const unsubA = nexusBus.subscribe('DECISION_REVIEW_REQUIRED', (ev) => {
    testABusReceived = true;
    testABusProposalId = ev.data?.proposalId || ev.payload?.proposalId || ev.proposalId;
  });

  const inProcessResA = nxlRuntime.executeSource(highMutationSource);
  runner.assert(inProcessResA.mutationBlocked === true, 'In-process compiler halts and flags mutationBlocked: true.');
  runner.assert(testABusReceived === true, 'NexusBus emitted DECISION_REVIEW_REQUIRED event.');
  runner.assert(testABusProposalId === inProcessResA.proposalId, 'NexusBus event payload contains matching proposalId.');

  const createdProposalId = inProcessResA.proposalId!;
  const proposalA = decisionGate.getProposal(createdProposalId);
  runner.assert(proposalA.status === 'REVIEW_REQUIRED', 'DecisionGate registered proposal with REVIEW_REQUIRED.');
  unsubA();

  // --------------------------------------------------------------------------
  // TEST B: POST /api/nxl/compile with HIGH mutation after human approval
  // --------------------------------------------------------------------------
  console.log('\n[TEST B] POST /api/nxl/compile with HIGH mutation after human approval');
  let testBBusReceived = false;
  let testBBusProposalId = '';
  const unsubB = nexusBus.subscribe('DECISION_EXECUTED', (ev) => {
    testBBusReceived = true;
    testBBusProposalId = ev.data?.proposalId || ev.payload?.proposalId || ev.proposalId;
  });

  // Human operator approves proposal created in Test A
  const approvedProposal = decisionGate.approve(
    createdProposalId,
    'Maciej_Architekt',
    'HUMAN',
    {
      graph: privilegedGraph,
      signature: '0xROOT_MACIEJ_ARCHITECT_SEAL_9918',
      reason: 'Verified cluster failover configuration by Architect'
    }
  );
  runner.assert(approvedProposal.status === 'APPROVED', 'Proposal successfully approved by Human Operator.');
  runner.assert(approvedProposal.approval?.decision === 'APPROVE', 'Proposal contains HumanApproval record.');

  // Execute compiled source with approved proposalId
  const inProcessResB = nxlRuntime.executeSource(highMutationSource, {
    proposalId: createdProposalId,
    actorId: 'Maciej_Architekt'
  });

  runner.assert(inProcessResB.success === true, 'NXL compilation and execution succeeded.');
  runner.assert(nxlRuntime.stateMap.get('cluster.failover_node')?.value === 'NEW_SECONDARY_BACKUP', 'stateStore successfully mutated following human approval.');
  
  const executedProposal = decisionGate.getProposal(createdProposalId);
  runner.assert(executedProposal.status === 'EXECUTED', 'DecisionGate marked proposal as EXECUTED.');
  runner.assert(testBBusReceived === true, 'NexusBus emitted DECISION_EXECUTED event.');
  runner.assert(testBBusProposalId === createdProposalId, 'NexusBus event links to proposalId.');
  unsubB();

  // Also verify HTTP execution of approved proposal
  const httpPropRes = await fetch(`${serverUrl}/api/decision/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      proposalId: bodyA.proposalId,
      approverActorId: 'Maciej_Architekt',
      approverActorType: 'HUMAN',
      signature: '0xROOT_MACIEJ_ARCHITECT_SEAL_9918',
    }),
  });
  const httpPropBody = await httpPropRes.json();
  runner.assert(httpPropBody.success === true, 'HTTP API approved server-side proposal.');

  const resB = await fetch(`${serverUrl}/api/nxl/compile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: highMutationSource,
      proposalId: bodyA.proposalId,
      actorId: 'Maciej_Architekt'
    }),
  });
  runner.assert(resB.status === 200, 'HTTP /api/nxl/compile returns status 200 for approved proposal.');

  // --------------------------------------------------------------------------
  // TEST C: Attempt to approve by actor without required capability
  // --------------------------------------------------------------------------
  console.log('\n[TEST C] Attempt to approve by actor without required capability (AccessManager PDP DENY)');
  const propC = decisionGate.propose({
    actorId: 'NxlCompiler',
    action: 'NXL_STATE_MUTATION',
    target: 'cluster.auth_config',
    reason: 'Security parameter update',
    riskLevel: 'HIGH',
    requiredCapability: 'nexus.cluster.rebalance'
  });

  let testCBlocked = false;
  let testCError = '';
  try {
    decisionGate.approve(
      propC.proposalId,
      'Bob_Unprivileged',
      'HUMAN',
      { graph: unprivilegedGraph }
    );
  } catch (err: any) {
    testCBlocked = true;
    testCError = err.message;
  }

  runner.assert(testCBlocked === true, 'Approval by actor lacking capability is strictly blocked (DENY).');
  runner.assert(testCError.includes('Capability check failed'), 'Error specifies Capability check failure.');
  runner.assert(propC.status === 'REVIEW_REQUIRED', 'Proposal remains in REVIEW_REQUIRED status.');

  // --------------------------------------------------------------------------
  // TEST D: Attempt to execute mutation with REJECTED proposal
  // --------------------------------------------------------------------------
  console.log('\n[TEST D] Attempt to execute mutation with REJECTED proposal');
  const propD = decisionGate.propose({
    actorId: 'NxlCompiler',
    action: 'NXL_STATE_MUTATION',
    target: 'cluster.experimental_mode',
    reason: 'Experimental parameter update',
    riskLevel: 'HIGH',
    requiredCapability: 'nexus.cluster.rebalance'
  });

  decisionGate.reject(propD.proposalId, 'Maciej_Architekt', 'Proposal rejected due to instability risks');
  runner.assert(propD.status === 'REJECTED', 'Proposal status transitioned to REJECTED.');

  let testDBlocked = false;
  try {
    nxlRuntime.executeSource(`
      define reject_test
      state cluster.experimental_mode : String = "OFF"
      set cluster.experimental_mode = "ON"
    `, { proposalId: propD.proposalId });
  } catch (err: any) {
    testDBlocked = err.message.includes('REJECTED');
  }

  runner.assert(testDBlocked === true, 'Execution of REJECTED proposal is strictly denied.');
  runner.assert(nxlRuntime.stateMap.get('cluster.experimental_mode') === undefined, 'stateStore remains unmodified.');

  // --------------------------------------------------------------------------
  // TEST E: Attempt to execute mutation with EXPIRED proposal
  // --------------------------------------------------------------------------
  console.log('\n[TEST E] Attempt to execute mutation with EXPIRED proposal');
  const propE = decisionGate.propose({
    actorId: 'NxlCompiler',
    action: 'NXL_STATE_MUTATION',
    target: 'cluster.timeout_config',
    reason: 'Timeout test',
    riskLevel: 'HIGH',
    requiredCapability: 'nexus.cluster.rebalance',
    ttlSeconds: -1 // Expired immediately
  });

  let testEBlocked = false;
  try {
    nxlRuntime.executeSource(`
      define expire_test
      state cluster.timeout_config : Number = 500
      set cluster.timeout_config = 999
    `, { proposalId: propE.proposalId });
  } catch (err: any) {
    testEBlocked = err.message.includes('EXPIRED');
  }

  runner.assert(testEBlocked === true, 'Execution of EXPIRED proposal is strictly denied.');
  runner.assert(nxlRuntime.stateMap.get('cluster.timeout_config') === undefined, 'stateStore remains unmodified.');

  // --------------------------------------------------------------------------
  // TEST F: Attempt to execute after source code modification (stale proposal)
  // --------------------------------------------------------------------------
  console.log('\n[TEST F] Attempt to execute after source code modification (Stale Proposal Anti-Tamper)');
  const legitimateSource = `
    define cluster_tune
    state cluster.worker_threads : Number = 4
    set cluster.worker_threads = 8
    assert cluster.worker_threads == 8
  `;

  const tamperSource = `
    define cluster_tune
    state cluster.worker_threads : Number = 4
    set cluster.worker_threads = 99999
    assert cluster.worker_threads == 99999
  `;

  // 1. Propose legitimate source in-process
  const propFResult = nxlRuntime.executeSource(legitimateSource);
  const propFId = propFResult.proposalId!;

  // 2. Human approves legitimate source
  decisionGate.approve(propFId, 'Maciej_Architekt', 'HUMAN', {
    graph: privilegedGraph,
    signature: '0xROOT_MACIEJ_ARCHITECT_SEAL_9918'
  });

  // 3. Attacker submits tampered source with legitimate proposalId
  let testFBlocked = false;
  let testFError = '';
  try {
    nxlRuntime.executeSource(tamperSource, { proposalId: propFId });
  } catch (err: any) {
    testFBlocked = true;
    testFError = err.message;
  }

  runner.assert(testFBlocked === true, 'Execution with tampered source throws denial error.');
  runner.assert(testFError.includes('STALE_PROPOSAL'), 'Error explicitly identifies STALE_PROPOSAL source hash tampering.');
  runner.assert(nxlRuntime.stateMap.get('cluster.worker_threads') === undefined, 'stateStore protected from tampered values.');

  // --------------------------------------------------------------------------
  // TEST G: Direct call to NxlRuntimeCore.executeSource() without approval
  // --------------------------------------------------------------------------
  console.log('\n[TEST G] Direct call to NxlRuntimeCore.executeSource() without approval');
  const directRuntime = new NxlRuntimeCore();
  const unauthMutatingSource = `
    define direct_unauth_test
    state system.kernel_level : Number = 1
    set system.kernel_level = 99
    assert system.kernel_level == 99
  `;

  const initialLedgerLength = directRuntime.ledger.length;
  const directResult = directRuntime.executeSource(unauthMutatingSource);

  runner.assert(directResult.success === false, 'Direct execution returns success: false.');
  runner.assert(directResult.mutationBlocked === true, 'Direct execution sets mutationBlocked: true.');
  runner.assert(directResult.status === 'PROPOSAL_REQUIRED', 'Direct execution status is PROPOSAL_REQUIRED.');
  runner.assert(directResult.error?.includes('[DECISION_GATE_DENY]') === true, 'Error identifies [DECISION_GATE_DENY].');
  runner.assert(directRuntime.ledger.length === initialLedgerLength, 'State Ledger has zero mutation entries.');

  // --------------------------------------------------------------------------
  // TEST H: Direct call to nxlRuntime.stateMap.set() for protected state
  // --------------------------------------------------------------------------
  console.log('\n[TEST H] Direct call to nxlRuntime.stateMap.set() for protected state');
  let testHBlocked = false;
  let testHError = '';
  try {
    nxlRuntime.stateMap.set('nexus_root.status', { value: 'INJECTED_ATTACK', version: 999, type: 'BellasStatus' });
  } catch (err: any) {
    testHBlocked = true;
    testHError = err.message;
  }

  runner.assert(testHBlocked === true, 'Direct stateMap.set() throws boundary denial error.');
  runner.assert(testHError.includes('[EXECUTION_BOUNDARY_DENY]'), 'Error identifies [EXECUTION_BOUNDARY_DENY].');
  runner.assert(nxlRuntime.stateMap.get('nexus_root.status')?.value === 'SECURE', 'Protected state value remains SECURE.');

  // --------------------------------------------------------------------------
  // TEST I: Race condition / Double Execution Defense
  // --------------------------------------------------------------------------
  console.log('\n[TEST I] Race condition / Double Execution Defense');
  const doubleExecSource = `
    define double_exec_test
    state cluster.batch_size : Number = 10
    set cluster.batch_size = 20
    assert cluster.batch_size == 20
  `;

  // Propose
  const propIResult = nxlRuntime.executeSource(doubleExecSource);
  const propIId = propIResult.proposalId!;

  // Approve
  decisionGate.approve(propIId, 'Maciej_Architekt', 'HUMAN', {
    graph: privilegedGraph,
    signature: '0xROOT_MACIEJ_ARCHITECT_SEAL_9918'
  });

  // First execution -> SUCCESS
  const exec1Result = nxlRuntime.executeSource(doubleExecSource, { proposalId: propIId });
  runner.assert(exec1Result.success === true, 'First execution executes successfully.');

  // Second execution -> REJECTED (Double Execution Defense)
  let testIBlocked = false;
  let testIError = '';
  try {
    nxlRuntime.executeSource(doubleExecSource, { proposalId: propIId });
  } catch (err: any) {
    testIBlocked = true;
    testIError = err.message;
  }

  runner.assert(testIBlocked === true, 'Second execution throws denial error.');
  runner.assert(testIError.includes('EXECUTED'), 'Error indicates proposal has already been EXECUTED.');

  // --------------------------------------------------------------------------
  // TEST J: State Ledger transition chain verification for NXL mutation
  // --------------------------------------------------------------------------
  console.log('\n[TEST J] State Ledger transition chain verification for NXL mutation');
  const ledgerRecords = decisionGate.getLedger().filter((r) => r.proposalId === propIId);

  runner.assert(ledgerRecords.length >= 3, 'State Ledger contains at least 3 lifecycle transition records.');
  runner.assert(ledgerRecords[0].newStatus === 'REVIEW_REQUIRED', 'First ledger record is REVIEW_REQUIRED.');
  runner.assert(ledgerRecords[1].previousStatus === 'REVIEW_REQUIRED' && ledgerRecords[1].newStatus === 'APPROVED', 'Second ledger record transitions REVIEW_REQUIRED -> APPROVED.');
  runner.assert(ledgerRecords[2].previousStatus === 'APPROVED' && ledgerRecords[2].newStatus === 'EXECUTED', 'Third ledger record transitions APPROVED -> EXECUTED.');
  
  // Continuity of versions and proposal hash
  const v1 = ledgerRecords[0].version;
  const v2 = ledgerRecords[1].version;
  const v3 = ledgerRecords[2].version;
  runner.assert(v1 < v2 && v2 < v3, 'Ledger versions strictly increment (v1 < v2 < v3).');
  runner.assert(
    ledgerRecords[0].proposalHash === ledgerRecords[1].proposalHash &&
    ledgerRecords[1].proposalHash === ledgerRecords[2].proposalHash,
    'Proposal hash remains cryptographically immutable across all ledger records.'
  );

  runner.summary();
}

runBypassClosureSuite().catch((err) => {
  console.error('[FATAL] Unhandled error during bypass closure tests:', err);
  process.exit(1);
});
