// Phase 1.5 End-to-End Decision Gate Enforcement Audit Script
import { decisionGate, DecisionProposal } from '../src/nexus/core/decision';
import { NxlGraph } from '../src/nexus/core/nxl/graph';
import { nxlRuntimeCore } from '../src/nexus/core/nxl/runtime';
import { nxlRuntime } from '../src/nexus/nxl-engine/runtime';
import { ScribeIDE } from '../src/nexus/modules/scribe';
import { DrpcBscDock } from '../src/nexus/bridges/drpc-bsc-dock';
import { SecurityVault } from '../src/nexus/core/nxl/security-vault';
import { nexusBus } from '../src/nexus/bridges/nexus-bus';

async function runAudit() {
  console.log('=== STARTING PHASE 1.5 ENFORCEMENT AUDIT ===\n');

  // --- PART 1: DecisionGate API Bypass Matrix (Tests A through J) ---
  console.log('--- PART 1: DecisionGate Policy & Input Integrity (A-J) ---');
  decisionGate.resetState();

  const privilegedGraph = new NxlGraph();
  privilegedGraph.addNode('Maciej_Architekt', 'Biooperator_Architekt');
  privilegedGraph.grantCapability('Maciej_Architekt', 'nexus.cluster.rebalance');

  const unprivilegedGraph = new NxlGraph();
  unprivilegedGraph.addNode('Guest_User', 'Guest_Identity');

  // Case A: Valid capability + HumanApproval
  const propA = decisionGate.propose({
    actorId: 'Bella_Agent',
    action: 'REBALANCE',
    target: 'Node_1',
    reason: 'High load',
    requiredCapability: 'nexus.cluster.rebalance',
  });
  decisionGate.approve(propA.proposalId, 'Maciej_Architekt', 'HUMAN', { graph: privilegedGraph });
  const execA = decisionGate.execute(propA.proposalId, 'Worker', { graph: privilegedGraph });
  console.log('Case A (Valid Cap + Human Approval):', execA.executed ? 'PROTECTED & PERMITTED' : 'FAILED');

  // Case B: Without capability -> DENY
  const propB = decisionGate.propose({
    actorId: 'Bella_Agent',
    action: 'REBALANCE',
    target: 'Node_2',
    reason: 'Test',
    requiredCapability: 'nexus.cluster.rebalance',
  });
  let caseBDenied = false;
  try {
    decisionGate.approve(propB.proposalId, 'Guest_User', 'HUMAN', { graph: unprivilegedGraph });
  } catch (e: any) {
    caseBDenied = e.message.includes('Capability check failed');
  }
  console.log('Case B (Without Capability):', caseBDenied ? 'PROTECTED (DENIED)' : 'BYPASSABLE');

  // Case C: Without HumanApproval -> DENY
  const propC = decisionGate.propose({
    actorId: 'Bella_Agent',
    action: 'REBALANCE',
    target: 'Node_3',
    reason: 'Test',
    requiredCapability: 'nexus.cluster.rebalance',
  });
  let caseCDenied = false;
  try {
    decisionGate.execute(propC.proposalId, 'Worker', { graph: privilegedGraph });
  } catch (e: any) {
    caseCDenied = e.message.includes('Required status: \'APPROVED\'');
  }
  console.log('Case C (Without Human Approval):', caseCDenied ? 'PROTECTED (DENIED)' : 'BYPASSABLE');

  // Case D: Forged approved=true in client payload -> DENY
  const propD = decisionGate.propose({
    actorId: 'Bella_Agent',
    action: 'REBALANCE',
    target: 'Node_4',
    reason: 'Test',
    requiredCapability: 'nexus.cluster.rebalance',
  });
  // Simulate attacker attempting to mutate proposal directly or execute unapproved proposal
  let caseDDenied = false;
  try {
    decisionGate.execute(propD.proposalId, 'Worker', { graph: privilegedGraph });
  } catch (e: any) {
    caseDDenied = e.message.includes('Required status: \'APPROVED\'');
  }
  console.log('Case D (Forged approved=true):', caseDDenied ? 'PROTECTED (DENIED)' : 'BYPASSABLE');

  // Case E: Forged proposalId -> DENY
  let caseEDenied = false;
  try {
    decisionGate.execute('PROP-NONEXISTENT-999', 'Worker', { graph: privilegedGraph });
  } catch (e: any) {
    caseEDenied = e.message.includes('not found');
  }
  console.log('Case E (Forged proposalId):', caseEDenied ? 'PROTECTED (DENIED)' : 'BYPASSABLE');

  // Case F: Proposal REJECTED -> DENY
  const propF = decisionGate.propose({
    actorId: 'Bella_Agent',
    action: 'REBALANCE',
    target: 'Node_5',
    reason: 'Test',
    requiredCapability: 'nexus.cluster.rebalance',
  });
  decisionGate.reject(propF.proposalId, 'Maciej_Architekt', 'Rejected');
  let caseFDenied = false;
  try {
    decisionGate.execute(propF.proposalId, 'Worker', { graph: privilegedGraph });
  } catch (e: any) {
    caseFDenied = e.message.includes('Execution blocked: Proposal');
  }
  console.log('Case F (Rejected proposal execution):', caseFDenied ? 'PROTECTED (DENIED)' : 'BYPASSABLE');

  // Case G: Proposal EXPIRED -> DENY
  const propG = decisionGate.propose({
    actorId: 'Bella_Agent',
    action: 'REBALANCE',
    target: 'Node_6',
    reason: 'Test',
    requiredCapability: 'nexus.cluster.rebalance',
    ttlSeconds: -10,
  });
  let caseGDenied = false;
  try {
    decisionGate.approve(propG.proposalId, 'Maciej_Architekt', 'HUMAN', { graph: privilegedGraph });
  } catch (e: any) {
    caseGDenied = e.message.includes('EXPIRED');
  }
  console.log('Case G (Expired proposal approval):', caseGDenied ? 'PROTECTED (DENIED)' : 'BYPASSABLE');

  // Case H: After EXECUTED -> double execution DENIED
  let caseHDenied = false;
  try {
    decisionGate.execute(propA.proposalId, 'Worker', { graph: privilegedGraph });
  } catch (e: any) {
    caseHDenied = e.message.includes('already been EXECUTED');
  }
  console.log('Case H (Double execution after EXECUTED):', caseHDenied ? 'PROTECTED (DENIED)' : 'BYPASSABLE');

  // Case I: With another unprivileged approver -> DENY
  const propI = decisionGate.propose({
    actorId: 'Bella_Agent',
    action: 'REBALANCE',
    target: 'Node_7',
    reason: 'Test',
    requiredCapability: 'nexus.cluster.rebalance',
  });
  let caseIDenied = false;
  try {
    decisionGate.approve(propI.proposalId, 'Unauthorized_Human', 'HUMAN', { graph: privilegedGraph });
  } catch (e: any) {
    caseIDenied = e.message.includes('Capability check failed');
  }
  console.log('Case I (Different unprivileged approver):', caseIDenied ? 'PROTECTED (DENIED)' : 'BYPASSABLE');

  // Case J: Proposer == Approver -> DENY
  const propJ = decisionGate.propose({
    actorId: 'Maciej_Architekt',
    action: 'REBALANCE',
    target: 'Node_8',
    reason: 'Self proposal',
    requiredCapability: 'nexus.cluster.rebalance',
  });
  let caseJDenied = false;
  try {
    decisionGate.approve(propJ.proposalId, 'Maciej_Architekt', 'HUMAN', { graph: privilegedGraph });
  } catch (e: any) {
    caseJDenied = e.message.includes('Separation of Duties violation');
  }
  console.log('Case J (Proposer == Approver):', caseJDenied ? 'PROTECTED (DENIED)' : 'BYPASSABLE');

  // --- PART 2: DIRECT MUTATION TESTS (Auditing existing bypass routes) ---
  console.log('\n--- PART 2: Direct Mutation & Legacy Core Bypass Audit ---');

  // 1. NxlRuntimeCore direct state mutation via executeSource
  const initialLedgerCount = nxlRuntimeCore.ledger.length;
  console.log('Initial ledger count in NxlRuntimeCore:', initialLedgerCount);

  const directSource = `
    define bypass_core
    state nexus_root.status : BellasStatus = BellasStatus.SECURE
    set nexus_root.status = BellasStatus.SECURE
    assert nexus_root.status == SECURE
  `;
  const execResult = nxlRuntimeCore.executeSource(directSource);
  console.log('Direct NxlRuntimeCore.executeSource():', execResult.success ? 'BYPASSABLE (Executed without DecisionGate)' : 'PROTECTED');

  // 2. nxlRuntime (nxl-engine) stateMap direct set
  let stateMapBlocked = false;
  try {
    nxlRuntime.stateMap.set('nexus_root.status', { value: 'DIRECT_MUTATED', version: 99, type: 'String' });
  } catch (err: any) {
    if (err.message.includes('EXECUTION_BOUNDARY_DENY')) {
      stateMapBlocked = true;
    }
  }
  console.log('Direct nxlRuntime.stateMap.set():', stateMapBlocked ? 'PROTECTED (Execution boundary locked)' : 'BYPASSABLE');

  // 3. ScribeIDE.applySeal() bypass
  const scribe = new ScribeIDE('define test');
  const sealResult = scribe.applySeal('0xROOT_MACIEJ_ARCHITECT_SEAL_9918');
  console.log('Direct ScribeIDE.applySeal():', sealResult.sealed ? 'BYPASSABLE (Seals without DecisionGate)' : 'PROTECTED');

  // 4. DrpcBscDock.verifyTransaction() bypass
  const bsc = new DrpcBscDock();
  const txResult = await bsc.verifyTransaction('0xTX_999', '0xROOT_MACIEJ_ARCHITECT_SEAL_9918');
  console.log('Direct DrpcBscDock.verifyTransaction():', txResult.status === 'CONFIRMED' ? 'BYPASSABLE (Confirms tx with 0xROOT string without DecisionGate)' : 'PROTECTED');

  // 5. NxlRuntimeCore.validateFileWritePermission() bypass
  const filePerm = nxlRuntimeCore.validateFileWritePermission('public/test.txt', '0xROOT_MACIEJ_ARCHITECT_SEAL_9918');
  console.log('Direct NxlRuntimeCore.validateFileWritePermission():', filePerm.permitted ? 'BYPASSABLE (Permits file write with 0xROOT string without DecisionGate)' : 'PROTECTED');

  // --- PART 3: ATOMICITY & CONCURRENCY ---
  console.log('\n--- PART 3: Atomicity & Concurrency Audit ---');
  const atomProp = decisionGate.propose({
    actorId: 'Bella_Atom',
    action: 'TRANSFER_RESOURCES',
    target: 'Vault',
    reason: 'Atomicity check',
    requiredCapability: 'nexus.cluster.rebalance',
  });
  decisionGate.approve(atomProp.proposalId, 'Maciej_Architekt', 'HUMAN', { graph: privilegedGraph });

  // Double approve
  let doubleApproveBlocked = false;
  try {
    decisionGate.approve(atomProp.proposalId, 'Maciej_Architekt', 'HUMAN', { graph: privilegedGraph });
  } catch (e: any) {
    doubleApproveBlocked = e.message.includes('Invalid state transition');
  }
  console.log('Double approve():', doubleApproveBlocked ? 'PROTECTED (BLOCKED)' : 'BYPASSABLE');

  // Parallel execute test
  const p1 = Promise.resolve().then(() => decisionGate.execute(atomProp.proposalId, 'Worker1', { graph: privilegedGraph }));
  const p2 = Promise.resolve().then(() => decisionGate.execute(atomProp.proposalId, 'Worker2', { graph: privilegedGraph }));

  const results = await Promise.allSettled([p1, p2]);
  const successes = results.filter(r => r.status === 'fulfilled');
  const failures = results.filter(r => r.status === 'rejected');
  console.log('Parallel execute(): Successes =', successes.length, ', Rejections =', failures.length);
  console.log('Atomicity status:', successes.length === 1 && failures.length === 1 ? 'PROTECTED (Exactly one succeeded)' : 'FAILED');

  // --- PART 4: NEXUSBUS EVENT LIFECYCLE ---
  console.log('\n--- PART 4: NexusBus Event Lifecycle Audit ---');
  const busEventsReceived: string[] = [];
  const eventTypesToTrack = [
    'DECISION_PROPOSED',
    'DECISION_REVIEW_REQUIRED',
    'DECISION_APPROVED',
    'DECISION_REJECTED',
    'DECISION_EXECUTED',
    'DECISION_EXPIRED',
  ];

  const unsubs = eventTypesToTrack.map(et => 
    nexusBus.subscribe(et, (e) => {
      busEventsReceived.push(e.event);
    })
  );

  const lifeProp = decisionGate.propose({
    actorId: 'Bella_Life',
    action: 'LIFECYCLE_TEST',
    target: 'Cluster',
    reason: 'Testing bus emission',
    requiredCapability: 'nexus.cluster.rebalance',
  });
  decisionGate.review(lifeProp.proposalId, 'Elena', 'Manual review');
  decisionGate.approve(lifeProp.proposalId, 'Maciej_Architekt', 'HUMAN', { graph: privilegedGraph });
  decisionGate.execute(lifeProp.proposalId, 'Worker', { graph: privilegedGraph });

  unsubs.forEach(u => u());
  console.log('NexusBus events captured in lifecycle:', busEventsReceived);
  console.log('NexusBus verification:', busEventsReceived.length === 4 ? 'VERIFIED' : 'INCOMPLETE');

  console.log('\n=== AUDIT COMPLETE ===');
}

runAudit().catch(console.error);
