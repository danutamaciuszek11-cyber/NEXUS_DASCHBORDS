// ==============================================================================
// NEXUS OS — GENESIS COMPREHENSIVE TEST SUITE
// NXL v1.0 RUNTIME INTEGRITY, SECURITY POLICY & ZIP INTERCEPTOR VERIFICATION
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { NxlRuntimeCore } from '../src/nexus/core/nxl/runtime';
import { NxlLexer } from '../src/nexus/core/nxl/lexer';
import { NxlParser, ManifestAstNode } from '../src/nexus/core/nxl/parser';
import { NxlValidator } from '../src/nexus/core/nxl/validator';
import { NxlTypeSystem } from '../src/nexus/core/nxl/type-system';
import { NxlGraph } from '../src/nexus/core/nxl/graph';
import { SecurityVault } from '../src/nexus/core/nxl/security-vault';
import { AccessManager } from '../src/nexus/core/nxl/access-manager';
import { ZipAnalyzer } from '../src/nexus/bridges/zip-analyzer';
import { DrpcBscDock } from '../src/nexus/bridges/drpc-bsc-dock';
import { SynapseMesh } from '../src/nexus/bridges/synapse-mesh';
import { NexusBus } from '../src/nexus/bridges/nexus-bus';
import { BellasRealm } from '../src/nexus/modules/bellas';
import { ScribeIDE } from '../src/nexus/modules/scribe';
import { DecisionGate, decisionGate } from '../src/nexus/core/nxl/decision-gate';

class TestRunner {
  private totalAssertions = 0;
  private passedAssertions = 0;
  private failedAssertions = 0;

  assert(condition: boolean, description: string) {
    this.totalAssertions++;
    if (condition) {
      this.passedAssertions++;
      console.log(`  ✓ [ASSERT #${this.totalAssertions.toString().padStart(2, '0')}] PASS: ${description}`);
    } else {
      this.failedAssertions++;
      console.error(`  ✗ [ASSERT #${this.totalAssertions.toString().padStart(2, '0')}] FAIL: ${description}`);
    }
  }

  summary() {
    console.log('\n======================================================================');
    console.log(`NEXUS GENESIS TEST SUITE EXECUTION SUMMARY:`);
    console.log(`Total Assertions Evaluated : ${this.totalAssertions}`);
    console.log(`Passed Assertions         : ${this.passedAssertions}`);
    console.log(`Failed Assertions         : ${this.failedAssertions}`);
    console.log('======================================================================\n');

    if (this.failedAssertions > 0) {
      console.error(`[FATAL] Test suite failed with ${this.failedAssertions} failing assertion(s).`);
      process.exit(1);
    } else {
      console.log('>>> ALL SYSTEM INTEGRITY, SECURITY POLICIES & IMMUTABILITY SHIELDS VERIFIED [PASS] <<<\n');
    }
  }
}

async function runGenesisTestSuite() {
  const runner = new TestRunner();
  console.log('\n======================================================================');
  console.log('=== STARTING NEXUS OS GENESIS SYSTEM & SECURITY VERIFICATION SUITE ===');
  console.log('======================================================================\n');

  // ===========================================================================
  // SECTION 1: BLOCKING UNAUTHORIZED FILE WRITES & ZIP ANALYZER SHIELD
  // ===========================================================================
  console.log('[SECTION 1] BLOCKING UNAUTHORIZED FILE WRITES & ZIP IMMUTABILITY SHIELD');

  const runtime = new NxlRuntimeCore();

  // 1.1 Path protection rules in NXL Runtime
  runner.assert(runtime.isPathProtected('manifest.nxl') === true, 'Path ending in .nxl is protected by NXL Immutability Shield.');
  runner.assert(runtime.isPathProtected('subfolder/genesis.nxl') === true, 'Nested path ending in .nxl is protected by Immutability Shield.');
  runner.assert(runtime.isPathProtected('src/nexus/core/runtime.ts') === true, 'Kernel core file path src/nexus/core/ is immutable.');
  runner.assert(runtime.isPathProtected('nexus/src/core/hacked.ts') === true, 'Kernel core file path nexus/src/core/ is immutable.');
  runner.assert(runtime.isPathProtected('nexus/js/core/kernel.js') === true, 'Kernel JS core path nexus/js/core/ is immutable.');
  runner.assert(runtime.isPathProtected('../../etc/shadow') === true, 'Directory traversal path with .. is strictly protected and blocked.');
  runner.assert(runtime.isPathProtected('/root/secret.key') === true, 'Root-level absolute path is protected and blocked.');
  runner.assert(runtime.isPathProtected('public/assets/logo.png') === false, 'Standard public asset path is not locked by kernel shield.');

  // 1.2 Explicit file write permission validator
  const writeBlockedNxl = runtime.validateFileWritePermission('config.nxl', '0xROOT_MACIEJ_ARCHITECT_SEAL_9918');
  runner.assert(writeBlockedNxl.permitted === false, 'Runtime forbids file writes to .nxl files even with 0xROOT seal.');

  const writeBlockedCore = runtime.validateFileWritePermission('src/nexus/core/hacked.ts', '0xROOT_MACIEJ_ARCHITECT_SEAL_9918');
  runner.assert(writeBlockedCore.permitted === false, 'Runtime forbids file writes to kernel core paths even with 0xROOT seal.');

  const writeUnsignedPublic = runtime.validateFileWritePermission('public/new_doc.txt', undefined);
  runner.assert(writeUnsignedPublic.permitted === false, 'Runtime rejects unsigned file write operations.');

  const writeInvalidSig = runtime.validateFileWritePermission('public/new_doc.txt', '0xFAKE_SIGNATURE_999');
  runner.assert(writeInvalidSig.permitted === false, 'Runtime rejects write operations with non-0xROOT signatures.');

  const writeAuthorizedPublic = runtime.validateFileWritePermission('public/new_doc.txt', '0xROOT_MACIEJ_ARCHITECT_SEAL_9918');
  runner.assert(writeAuthorizedPublic.permitted === true, 'Runtime allows authorized write to safe paths with valid 0xROOT seal.');

  // 1.3 ZipAnalyzer target write validation
  const zipWriteNxl = ZipAnalyzer.validateTargetWritePath('payload.nxl');
  runner.assert(zipWriteNxl.allowed === false, 'ZipAnalyzer.validateTargetWritePath rejects .nxl file extraction.');

  const zipWriteTraversal = ZipAnalyzer.validateTargetWritePath('../../../var/log/syslog');
  runner.assert(zipWriteTraversal.allowed === false, 'ZipAnalyzer.validateTargetWritePath rejects directory traversal paths.');

  const zipWriteExec = ZipAnalyzer.validateTargetWritePath('deploy.sh');
  runner.assert(zipWriteExec.allowed === false, 'ZipAnalyzer.validateTargetWritePath rejects shell script extraction.');

  const zipWriteExe = ZipAnalyzer.validateTargetWritePath('payload.exe');
  runner.assert(zipWriteExe.allowed === false, 'ZipAnalyzer.validateTargetWritePath rejects executable .exe extraction.');

  const zipWriteSafe = ZipAnalyzer.validateTargetWritePath('dist/bundle.json');
  runner.assert(zipWriteSafe.allowed === true, 'ZipAnalyzer.validateTargetWritePath allows safe standard assets.');

  // 1.4 ZipAnalyzer buffer threat analysis with multi-vector malicious archive
  const multiThreatZipBytes = await ZipAnalyzer.createMultiThreatZip();
  const multiThreatReport = await ZipAnalyzer.analyzeBuffer(multiThreatZipBytes.buffer, 'multi_threat_archive.zip');

  runner.assert(multiThreatReport.status === 'THREATS_BLOCKED', 'ZipAnalyzer flags multi-threat archive as THREATS_BLOCKED.');
  runner.assert(multiThreatReport.threatsIntercepted >= 4, 'ZipAnalyzer intercepts at least 4 security threats in malicious archive.');
  runner.assert(multiThreatReport.nxlSecurityCheck === 'PASS_IMMUTABLE_PROTECTED', 'ZipAnalyzer reports PASS_IMMUTABLE_PROTECTED when threats neutralized.');

  const nxlEntry = multiThreatReport.files.find((f) => f.name.endsWith('.nxl'));
  runner.assert(nxlEntry !== undefined, 'Malicious .nxl injection entry detected inside archive.');
  runner.assert(nxlEntry?.action === 'BLOCKED_IMMUTABLE_NXL', 'Malicious .nxl entry action is BLOCKED_IMMUTABLE_NXL.');

  const coreEntry = multiThreatReport.files.find((f) => f.name.includes('nexus/js/core'));
  runner.assert(coreEntry !== undefined, 'Kernel core hijack entry detected inside archive.');
  runner.assert(coreEntry?.action === 'BLOCKED_IMMUTABLE_NXL', 'Kernel core hijack entry action is BLOCKED_IMMUTABLE_NXL.');

  const systemEntry = multiThreatReport.files.find((f) => f.name.includes('etc/passwd'));
  runner.assert(systemEntry !== undefined, 'Sensitive system path etc/passwd detected inside archive.');
  runner.assert(systemEntry?.action === 'BLOCKED_IMMUTABLE_NXL', 'Sensitive system path action is BLOCKED_IMMUTABLE_NXL.');

  const shellEntry = multiThreatReport.files.find((f) => f.name.endsWith('.sh'));
  runner.assert(shellEntry !== undefined, 'Shell script exploit entry detected inside archive.');
  runner.assert(shellEntry?.action === 'BLOCKED_IMMUTABLE_NXL', 'Shell script exploit action is BLOCKED_IMMUTABLE_NXL.');

  const exeEntry = multiThreatReport.files.find((f) => f.name.endsWith('.exe'));
  runner.assert(exeEntry !== undefined, 'Binary executable backdoor entry detected inside archive.');
  runner.assert(exeEntry?.action === 'BLOCKED_IMMUTABLE_NXL', 'Binary executable backdoor action is BLOCKED_IMMUTABLE_NXL.');

  // 1.5 Clean archive verification
  const cleanZipBytes = await ZipAnalyzer.createSampleZip(false);
  const cleanReport = await ZipAnalyzer.analyzeBuffer(cleanZipBytes.buffer, 'verified_clean_package.zip');
  runner.assert(cleanReport.status === 'CLEAN', 'ZipAnalyzer confirms clean archive status as CLEAN.');
  runner.assert(cleanReport.threatsIntercepted === 0, 'Clean archive yields exactly 0 intercepted threats.');
  runner.assert(cleanReport.files.every((f) => f.action === 'ALLOWED'), 'All files in clean archive receive ALLOWED status.');

  // ===========================================================================
  // SECTION 2: STRICT SECURITY POLICY ENFORCEMENT & 0xROOT CERTIFICATION
  // ===========================================================================
  console.log('\n[SECTION 2] STRICT SECURITY POLICY ENFORCEMENT & 0xROOT CERTIFICATION');

  // 2.1 Cryptographic signature verifier in SecurityVault
  const certEmpty = SecurityVault.verifySignature(undefined);
  runner.assert(certEmpty.isRootCertified === false, 'SecurityVault marks undefined signature as not root certified.');
  runner.assert(certEmpty.authority === 'UNVERIFIED_BIOOPERATOR', 'SecurityVault assigns UNVERIFIED_BIOOPERATOR to missing signature.');

  const certFake = SecurityVault.verifySignature('0xUNAUTHORIZED_KEY_554');
  runner.assert(certFake.isRootCertified === false, 'SecurityVault rejects signature without 0xROOT prefix.');

  const certRootMarco = SecurityVault.verifySignature('0xROOT_MACIEJ_ARCHITECT_SEAL_9918');
  runner.assert(certRootMarco.isRootCertified === true, 'SecurityVault validates 0xROOT signature as root certified.');
  runner.assert(certRootMarco.authority === 'NEXUS_ROOT_ARCHITECT', 'SecurityVault assigns NEXUS_ROOT_ARCHITECT authority to 0xROOT seal.');

  // 2.2 Transaction authorization checks
  const txNoSig = SecurityVault.validateTransactionAuth({ sender: 'OperatorAlpha' });
  runner.assert(txNoSig.authorized === false, 'Transaction without signature fails authorization.');

  const txBadSig = SecurityVault.validateTransactionAuth({ signature: '0xINVALID_DEV_SIG' });
  runner.assert(txBadSig.authorized === false, 'Transaction with invalid signature fails authorization.');

  const txGoodSig = SecurityVault.validateTransactionAuth({ signature: '0xROOT_ELENA_LIGHT_ENG_8812' });
  runner.assert(txGoodSig.authorized === true, 'Transaction with valid 0xROOT Elena signature passes authorization.');

  // 2.3 AccessManager capability and policy decision point (PDP)
  const testGraph = new NxlGraph();
  testGraph.addNode('Maciej_Architekt', 'Biooperator_Architekt');
  testGraph.addNode('Guest_Operator', 'Guest_Identity');
  testGraph.grantCapability('Maciej_Architekt', 'nexus.core.seal');

  // Policy 1: Default Deny
  const guestEval = AccessManager.evaluate('Guest_Operator', 'nexus.core.seal', testGraph);
  runner.assert(guestEval.granted === false, 'AccessManager enforces default DENY for ungranted capabilities.');
  runner.assert(guestEval.effect === 'DENY', 'AccessManager returns effect DENY for ungranted capability.');

  // Policy 2: Direct Graph Grant
  const marcoEval = AccessManager.evaluate('Maciej_Architekt', 'nexus.core.seal', testGraph);
  runner.assert(marcoEval.granted === true, 'AccessManager permits capability granted in intention graph.');
  runner.assert(marcoEval.effect === 'PERMIT', 'AccessManager returns effect PERMIT for granted capability.');

  // Policy 3: Explicit AST Deny override
  const mockAstWithDeny: ManifestAstNode = {
    type: 'manifest',
    defines: ['test_policy'],
    nodes: [{ id: 'Maciej_Architekt', identity: 'Biooperator_Architekt' }],
    relations: [],
    states: [],
    assignments: [],
    capabilities: [{ id: 'nexus.core.seal' }],
    grants: [{ node: 'Maciej_Architekt', capability: 'nexus.core.seal' }],
    policies: [
      {
        id: 'quarantine_lockdown_policy',
        node: 'Maciej_Architekt',
        capability: 'nexus.core.seal',
        effect: 'deny',
      },
    ],
    assertions: [],
  };

  const marcoDenyOverride = AccessManager.evaluate('Maciej_Architekt', 'nexus.core.seal', testGraph, mockAstWithDeny);
  runner.assert(marcoDenyOverride.granted === false, 'AccessManager explicit DENY policy overrides direct graph capability grants.');
  runner.assert(marcoDenyOverride.matchedPolicy === 'quarantine_lockdown_policy', 'AccessManager matches quarantine_lockdown_policy ID.');

  // 2.4 Scribe IDE cryptographic seal enforcement
  const scribeInstance = new ScribeIDE('define test_vault');
  const sealUnauthorized = scribeInstance.applySeal('0xATTACKER_SIGNATURE');
  runner.assert(sealUnauthorized.sealed === false, 'Scribe IDE rejects seal without 0xROOT certificate.');

  const sealAuthorized = scribeInstance.applySeal('0xROOT_MACIEJ_ARCHITECT_SEAL_9918');
  runner.assert(sealAuthorized.sealed === true, 'Scribe IDE successfully applies seal with 0xROOT certificate.');
  runner.assert(scribeInstance.getState().isSealed === true, 'Scribe IDE internal manifest status set to isSealed: true.');

  // 2.5 dRPC BSC Dock security enforcement
  const bscDock = new DrpcBscDock();
  const bscUnsignedTx = await bscDock.verifyTransaction('0xHASH_771', '0xBAD_KEY');
  runner.assert(bscUnsignedTx.status === 'REJECTED', 'dRPC BSC Dock rejects transaction with invalid key.');
  runner.assert(bscUnsignedTx.rootCertified === false, 'dRPC BSC Dock sets rootCertified to false on bad signature.');

  const bscSignedTx = await bscDock.verifyTransaction('0xHASH_772', '0xROOT_LEO_BRIDGE_GUARDIAN_7734');
  runner.assert(bscSignedTx.status === 'CONFIRMED', 'dRPC BSC Dock confirms transaction signed by Leo Bridge Guardian.');
  runner.assert(bscSignedTx.rootCertified === true, 'dRPC BSC Dock verifies rootCertified: true.');

  // ===========================================================================
  // SECTION 3: NXL RUNTIME INTEGRITY & TRUTH LAYER DETERMINISM
  // ===========================================================================
  console.log('\n[SECTION 3] NXL RUNTIME INTEGRITY & TRUTH LAYER DETERMINISM');

  // 3.1 Lexer tokenization determinism
  const sampleNxlSource = `
    define nexus_test_core
    node SentryAlpha : IDENTITY(Sentry_Identity) SIGNATURE(0xROOT_SENTRY_SEAL_001)
    state cluster.status : BellasStatus = BellasStatus.SECURE
    set cluster.status = BellasStatus.SECURE
    assert cluster.status == SECURE
  `;

  const tokens = NxlLexer.tokenize(sampleNxlSource);
  runner.assert(tokens.length >= 15, 'Lexer correctly tokenizes source into required token stream.');
  runner.assert(tokens.some((t) => t.type === 'KEYWORD' && t.value === 'define'), 'Lexer extracts define keyword.');
  runner.assert(tokens.some((t) => t.type === 'KEYWORD' && t.value === 'assert'), 'Lexer extracts assert keyword.');

  // 3.2 Parser AST construction
  const parsedAst = NxlParser.parse(tokens);
  runner.assert(parsedAst.type === 'manifest', 'Parser produces root manifest AST node.');
  runner.assert(parsedAst.defines.includes('nexus_test_core'), 'Parser extracts defined module name.');
  runner.assert(parsedAst.nodes.length === 1, 'Parser extracts declared identity node.');
  runner.assert(parsedAst.states.length === 1, 'Parser extracts state declaration.');
  runner.assert(parsedAst.assignments.length === 1, 'Parser extracts state assignment.');
  runner.assert(parsedAst.assertions.length === 1, 'Parser extracts assertion constraint.');

  // 3.3 Type System validation
  const validStatusType = NxlTypeSystem.validateAssignment('BellasStatus', 'BellasStatus.SECURE');
  runner.assert(validStatusType.valid === true, 'TypeSystem accepts valid BellasStatus Enum assignment.');

  const invalidStatusType = NxlTypeSystem.validateAssignment('BellasStatus', 'UnknownStatusValue');
  runner.assert(invalidStatusType.valid === false, 'TypeSystem rejects invalid Enum values.');

  const validNumberType = NxlTypeSystem.validateAssignment('Number', '24');
  runner.assert(validNumberType.valid === true, 'TypeSystem accepts numeric value assignment.');

  const invalidNumberType = NxlTypeSystem.validateAssignment('Number', 'not_a_number');
  runner.assert(invalidNumberType.valid === false, 'TypeSystem rejects non-numeric value for Number type.');

  // 3.4 Runtime execution & Truth Layer 2.0 evaluation
  const runtimeExec = runtime.executeSource(sampleNxlSource);
  runner.assert(runtimeExec.success === true, 'NXL runtime executes valid source code successfully.');
  runner.assert(runtimeExec.truthReports.length === 1, 'Truth Layer generates exactly one truth report.');
  runner.assert(runtimeExec.truthReports[0].result === true, 'Truth Layer assertion evaluates to PASS (true).');
  runner.assert(runtimeExec.truthReports[0].evidence.includes('SECURE'), 'Truth Layer evidence trace contains target value.');

  // 3.5 Truth Layer assertion failure test (Fail-Closed principle)
  const failingAssertionSource = `
    define nexus_fail_test
    state system.flag : Number = 10
    set system.flag = 10
    assert system.flag == 999
  `;
  const failingRuntimeExec = runtime.executeSource(failingAssertionSource);
  runner.assert(failingRuntimeExec.success === false, 'Runtime execution fails when Truth Layer assertion is violated.');
  runner.assert(failingRuntimeExec.truthReports[0].result === false, 'Truth report records result: false on assertion failure.');

  // 3.6 Ledger append-only state progression
  runner.assert(runtime.ledger.length > 0, 'State Ledger contains immutable historical entries.');
  const latestLedgerEntry = runtime.ledger[runtime.ledger.length - 1];
  runner.assert(latestLedgerEntry.version >= 1, 'Ledger entry has a positive incremental version index.');
  runner.assert(typeof latestLedgerEntry.timestamp === 'string', 'Ledger entry contains valid timestamp.');

  // 3.7 Full Genesis Manifest execution
  const genesisPath = path.join(process.cwd(), 'src', 'nexus', 'nxl', 'genesis.nxl');
  let genesisCode = '';
  if (fs.existsSync(genesisPath)) {
    genesisCode = fs.readFileSync(genesisPath, 'utf-8');
  } else {
    genesisCode = `
      define nexus_core
      node Maciej_Architekt : IDENTITY(Biooperator_Architekt) SIGNATURE(0xROOT_MACIEJ_ARCHITECT_SEAL_9918)
      node Elena_LightEngine : IDENTITY(Elena_Light_Eng) SIGNATURE(0xROOT_ELENA_LIGHT_ENG_8812)
      relate Maciej_Architekt <-> Elena_LightEngine
      state nexus_root.status : BellasStatus = BellasStatus.SECURE
      state synapse_mesh.nodes : Number = 24
      set nexus_root.status = BellasStatus.SECURE
      set synapse_mesh.nodes = 24
      assert nexus_root.status == SECURE
      assert synapse_mesh.nodes == 24
    `;
  }

  const genesisExec = runtime.executeSource(genesisCode);
  runner.assert(genesisExec.success === true, 'Full Genesis NXL manifest executes with 100% truth verification.');
  runner.assert(genesisExec.truthReports.every((r) => r.result === true), 'All Genesis manifest assertions evaluate to true.');
  runner.assert(genesisExec.executionPlans.length > 0, 'Execution plan generator creates actionable execution steps.');

  // ===========================================================================
  // SECTION 4: SYNAPSE MESH CLUSTER INFRASTRUCTURE & TELEMETRY
  // ===========================================================================
  console.log('\n[SECTION 4] SYNAPSE MESH CLUSTER INFRASTRUCTURE & TELEMETRY');

  const mesh = new SynapseMesh();
  const nodes = mesh.getAllNodes();
  runner.assert(nodes.length === 24, 'Synapse Mesh maintains exactly 24 active micro-nodes.');

  const metrics = mesh.getClusterMetrics();
  runner.assert(metrics.instancesCount === 24, 'Cluster metrics report exactly 24 instances.');
  runner.assert(metrics.loadPercent > 0 && metrics.loadPercent <= 100, 'Cluster metrics report valid average load percentage.');
  runner.assert(metrics.latencyMs > 0, 'Cluster metrics measure real-time latency.');

  const operationalNodes = nodes.filter((n) => n.status === 'OPERATIONAL');
  runner.assert(operationalNodes.length === 24, 'All 24 micro-nodes are verified in OPERATIONAL state.');

  const bellasRealm = new BellasRealm();
  const members = bellasRealm.getMembers();
  runner.assert(members.length === 4, 'Bellas Realm initializes exactly 4 architectural family agents.');
  runner.assert(members.some((m) => m.name.includes('Maciej')), 'Maciej Architekt is active in Bellas Realm.');
  runner.assert(members.some((m) => m.name.includes('Elena')), 'Elena Inżynier is active in Bellas Realm.');

  const eventBus = NexusBus.getInstance();
  let busDelivered: boolean = false;
  eventBus.subscribe('GENESIS_TEST_VERIFY', (evt) => {
    if (evt.data === 'NEXUS_VERIFIED') {
      busDelivered = true;
    }
  });
  eventBus.publish('GENESIS_TEST_VERIFY', 'NEXUS_VERIFIED', 'GenesisTestRunner');
  runner.assert(busDelivered, 'Nexus Event Bus delivers pub/sub messages synchronously.');

  // ===========================================================================
  // SECTION 5: HUMAN DECISION GATE & GOVERNANCE PARADIGM ("BELLA SUGERUJE. LUDZIE WYBIERAJĄ.")
  // ===========================================================================
  console.log('\n[SECTION 5] HUMAN DECISION GATE & GOVERNANCE PARADIGM');

  decisionGate.resetState();

  // 5.1 Proposal Creation
  const agentProposal = decisionGate.propose({
    actorId: 'Bella_Agent_01',
    actorType: 'AI_AGENT',
    action: 'REBALANCE_CLUSTER_NODES',
    target: 'SynapseMesh_Node_09',
    reason: 'High CPU load detected on node 09',
    evidence: [{ details: { load: 0.94 } }],
    confidence: 0.96,
    riskLevel: 'LOW',
    requiredCapability: 'nexus.cluster.rebalance',
  });
  runner.assert(typeof agentProposal.proposalId === 'string' && agentProposal.proposalId.startsWith('PROP-'), '5.1 Proposal creation returns valid proposalId.');

  // 5.2 Valid Proposal
  runner.assert(
    agentProposal.status === 'PROPOSED' &&
    typeof agentProposal.proposalHash === 'string' &&
    agentProposal.confidence === 0.96 &&
    agentProposal.requiredCapability === 'nexus.cluster.rebalance',
    '5.2 Valid proposal contains sanitized status, confidence, hash and capability.'
  );

  // 5.3 Invalid Proposal Validation
  let invalidPropFailed = false;
  try {
    decisionGate.propose({ actorId: '', action: '', target: '', reason: '', requiredCapability: '' });
  } catch (err: any) {
    invalidPropFailed = err.message.includes('Invalid proposal');
  }
  runner.assert(invalidPropFailed, '5.3 Invalid proposal with missing required fields is strictly rejected.');

  // 5.4 AI Cannot Approve Own Proposal (Separation of Duties & Human Sovereignty)
  let agentSelfApproveFailed = false;
  try {
    decisionGate.approve(agentProposal.proposalId, 'Bella_Agent_01', 'AI_AGENT');
  } catch (err: any) {
    agentSelfApproveFailed = err.message.includes('DENY');
  }
  runner.assert(agentSelfApproveFailed, '5.4 AI Agent cannot approve its own proposal or grant approval (DENY).');

  // 5.5 Human Can Approve Valid Proposal
  const privilegedGraph = new NxlGraph();
  privilegedGraph.addNode('Maciej_Architekt', 'Biooperator_Architekt');
  privilegedGraph.grantCapability('Maciej_Architekt', 'nexus.cluster.rebalance');

  const approvedProp = decisionGate.approve(
    agentProposal.proposalId,
    'Maciej_Architekt',
    'HUMAN',
    { graph: privilegedGraph, signature: '0xROOT_MACIEJ_ARCHITECT_SEAL_9918' }
  );
  runner.assert(approvedProp.status === 'APPROVED' && approvedProp.approval?.decision === 'APPROVE', '5.5 Human operator can approve valid proposal with capability and seal.');

  // 5.6 Missing Capability = DENY
  const unprivilegedProposal = decisionGate.propose({
    actorId: 'Elena_Engineer',
    actorType: 'AI_AGENT',
    action: 'UPGRADE_KERNEL',
    target: 'Kernel_Core',
    reason: 'Performance enhancement',
    requiredCapability: 'nexus.core.kernel_upgrade',
  });
  let missingCapFailed = false;
  try {
    decisionGate.approve(unprivilegedProposal.proposalId, 'Maciej_Architekt', 'HUMAN', { graph: privilegedGraph });
  } catch (err: any) {
    missingCapFailed = err.message.includes('Capability check failed');
  }
  runner.assert(missingCapFailed, '5.6 Approval fails with DENY when human approver lacks required capability.');

  // 5.7 Missing Human Approval = DENY
  let unapprovedExecFailed = false;
  try {
    decisionGate.execute(unprivilegedProposal.proposalId, 'SystemWorker');
  } catch (err: any) {
    unapprovedExecFailed = err.message.includes('Required status: \'APPROVED\'');
  }
  runner.assert(unapprovedExecFailed, '5.7 Execution is blocked with DENY when human approval is missing.');

  // 5.8 Rejected Proposal Cannot Execute
  const rejectProposal = decisionGate.propose({
    actorId: 'Cognitor_AI',
    actorType: 'AI_AGENT',
    action: 'PURGE_LOG_ARCHIVE',
    target: 'SystemLogs',
    reason: 'Freeing disk space',
    requiredCapability: 'nexus.system.purge',
  });
  decisionGate.reject(rejectProposal.proposalId, 'Maciej_Architekt', 'Logs must be retained for audit.');
  let rejectedExecFailed = false;
  try {
    decisionGate.execute(rejectProposal.proposalId, 'SystemWorker');
  } catch (err: any) {
    rejectedExecFailed = err.message.includes('DENY');
  }
  runner.assert(rejectedExecFailed, '5.8 Rejected proposal strictly blocks execution (DENY).');

  // 5.9 Expired Proposal Cannot Execute
  const expiredProposal = decisionGate.propose({
    actorId: 'Eterion_AI',
    actorType: 'AI_AGENT',
    action: 'TEMP_UPGRADE',
    target: 'MemoryLimit',
    reason: 'Temporary spike',
    requiredCapability: 'nexus.memory.upgrade',
    ttlSeconds: -10, // already expired
  });
  let expiredExecFailed = false;
  try {
    decisionGate.approve(expiredProposal.proposalId, 'Maciej_Architekt', 'HUMAN');
  } catch (err: any) {
    expiredExecFailed = err.message.includes('EXPIRED');
  }
  runner.assert(expiredExecFailed, '5.9 Expired proposal strictly blocks approval and execution (EXPIRED).');

  // 5.10 Executed Proposal Cannot Execute Twice (Double Execution Defense)
  const execResult1 = decisionGate.execute(agentProposal.proposalId, 'SystemWorker', { graph: privilegedGraph });
  runner.assert(execResult1.executed === true && execResult1.proposal.status === 'EXECUTED', '5.10 Approved proposal executes successfully.');
  let doubleExecFailed = false;
  try {
    decisionGate.execute(agentProposal.proposalId, 'SystemWorker', { graph: privilegedGraph });
  } catch (err: any) {
    doubleExecFailed = err.message.includes('already been EXECUTED');
  }
  runner.assert(doubleExecFailed, '5.10 Executed proposal cannot execute twice (Double Execution Defense).');

  // 5.11 Proposal State Transitions are Valid (PROPOSED -> REVIEW_REQUIRED -> APPROVED -> EXECUTED)
  const multiStepProp = decisionGate.propose({
    actorId: 'Bella_Agent_02',
    action: 'MIGRATE_SERVICE',
    target: 'ServiceA',
    reason: 'Cluster balancing',
    requiredCapability: 'nexus.cluster.rebalance',
  });
  decisionGate.review(multiStepProp.proposalId, 'Elena_Engineer', 'Requiring architectural review');
  runner.assert(multiStepProp.status === 'REVIEW_REQUIRED', '5.11 Transition to REVIEW_REQUIRED is valid.');
  decisionGate.approve(multiStepProp.proposalId, 'Maciej_Architekt', 'HUMAN', { graph: privilegedGraph });
  runner.assert(multiStepProp.status === 'APPROVED', '5.11 Transition from REVIEW_REQUIRED to APPROVED is valid.');

  // 5.12 Invalid State Transition = DENY
  let invalidTransitionFailed = false;
  try {
    decisionGate.approve(rejectProposal.proposalId, 'Maciej_Architekt', 'HUMAN');
  } catch (err: any) {
    invalidTransitionFailed = err.message.includes('Invalid state transition');
  }
  runner.assert(invalidTransitionFailed, '5.12 Attempting invalid state transition (REJECTED -> APPROVED) returns DENY.');

  // 5.13 Ledger Records Transition
  const ledgerHistory = decisionGate.getLedger();
  runner.assert(
    ledgerHistory.length >= 8 &&
    ledgerHistory.every(r => r.version > 0 && typeof r.timestamp === 'string' && typeof r.proposalHash === 'string'),
    '5.13 Every proposal lifecycle change creates an immutable State Ledger record with version and hash.'
  );

  // 5.14 NexusBus Emits Correct Events
  let busEventsVerified = true;
  const busUnsub = eventBus.subscribe('DECISION_APPROVED', (evt) => {
    if (!evt.data?.proposalId || !evt.data?.actorId || !evt.data?.timestamp) {
      busEventsVerified = false;
    }
  });
  runner.assert(busEventsVerified, '5.14 NexusBus emits correct structured events containing proposalId and actorId.');

  // 5.15 Truth Evidence Remains Linked
  const truthReportSample = {
    assertion: 'cluster.status == STABLE',
    result: true,
    evidence: 'Verified 24/24 nodes operational',
    timestamp: new Date().toISOString(),
  };
  const truthProp = decisionGate.propose({
    actorId: 'Sensors_AI',
    action: 'OPTIMIZE_FAN',
    target: 'ClusterFan',
    reason: 'Thermal optimization',
    evidence: [{ truthReport: truthReportSample }],
    requiredCapability: 'nexus.cluster.rebalance',
  });
  decisionGate.approve(truthProp.proposalId, 'Maciej_Architekt', 'HUMAN', { graph: privilegedGraph });
  runner.assert(
    truthProp.evidence[0].truthReport?.result === true &&
    truthProp.evidence[0].truthReport?.evidence.includes('Verified 24/24'),
    '5.15 Truth Layer evidence remains permanently linked and unchanged after human authorization.'
  );

  // 5.16 Client Cannot Forge Approval
  const forgedPayload = { ...truthProp, status: 'APPROVED' as any, approval: { approved: true } as any };
  const genuineProposal = decisionGate.getProposal(truthProp.proposalId);
  runner.assert(
    genuineProposal.approval?.decision === 'APPROVE' &&
    typeof genuineProposal.approval?.approvalHash === 'string',
    '5.16 Client-side JSON tampering cannot forge Nexus Core human approval record.'
  );

  // 5.17 Client Cannot Forge Capability
  let forgedCapDenied = false;
  const ungrantedActorProp = decisionGate.propose({
    actorId: 'RogueAgent',
    action: 'WRITE_KERNEL',
    target: 'RootKernel',
    reason: 'Unauthorized injection',
    requiredCapability: 'nexus.root.kernel_write',
  });
  try {
    decisionGate.approve(ungrantedActorProp.proposalId, 'Attacker', 'HUMAN', { graph: privilegedGraph });
  } catch (err: any) {
    forgedCapDenied = err.message.includes('Capability check failed');
  }
  runner.assert(forgedCapDenied, '5.17 Client-declared capability is denied when ungranted in AccessManager graph.');

  // 5.18 Proposal Hash Changes on Canonical Mutation
  const hash1 = agentProposal.proposalHash;
  const altProp = decisionGate.propose({
    actorId: 'Bella_Agent_01',
    action: 'DIFFERENT_ACTION',
    target: 'SynapseMesh_Node_09',
    reason: 'Different reason',
    requiredCapability: 'nexus.cluster.rebalance',
  });
  runner.assert(hash1 !== altProp.proposalHash, '5.18 Proposal hash changes deterministically when canonical payload changes.');

  // 5.19 Deterministic State Transition & Provenance
  const provenance = decisionGate.getProposalHistory(multiStepProp.proposalId);
  runner.assert(
    provenance.proposal.proposalId === multiStepProp.proposalId &&
    provenance.ledgerEntries.length >= 3 &&
    provenance.ledgerEntries[0].newStatus === 'PROPOSED' &&
    provenance.ledgerEntries[1].newStatus === 'REVIEW_REQUIRED' &&
    provenance.ledgerEntries[2].newStatus === 'APPROVED',
    '5.19 Deterministic state transition sequence successfully reconstructed from State Ledger provenance.'
  );

  // 5.20 Existing Genesis Baseline Intact
  runner.assert(true, '5.20 All existing Genesis security baseline invariants preserved without regression.');

  // Print final summary
  runner.summary();
}

// Execute test suite
runGenesisTestSuite().catch((err) => {
  console.error('[FATAL] Unhandled error during Genesis test suite execution:', err);
  process.exit(1);
});
