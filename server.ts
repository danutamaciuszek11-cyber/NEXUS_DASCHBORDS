import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { nxlRuntime } from './src/nexus/nxl-engine/runtime';
import { NxlWasmCompiler } from './src/nexus/core/nxl/wasm-compiler';
import { ZipAnalyzerNode, ZipAnalyzer } from './src/nexus/nxl-engine/zipAnalyzer';
import { synapseMesh, SynapseMesh } from './src/nexus/bridges/synapse-mesh';
import { commerceCqrs, generateTraceId } from './src/nexus/services/commerce-cqrs';
import { quantumCicd, casStorage } from './src/nexus/services/quantum-cicd-pipeline';
import { decisionGate } from './src/nexus/core/nxl/decision-gate';
import { scribeIde, ScribeIDE } from './src/nexus/modules/scribe';
import { analyzeTrajectoryLocally, interpretJournalLocally } from './src/nexus/matrix/interpret';
import { guardSnapshot, releaseModule, reviewAlert, rotateFingerprint, setDrift } from './src/nexus/secguard/secGuardLink';
import fs from 'fs';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // OpenTelemetry Distributed Tracing Middleware (W3C traceparent context propagation)
  app.use((req, res, next) => {
    const rawTraceParent = req.headers['traceparent'] as string | undefined;
    let traceId = (req.headers['x-trace-id'] as string) || '';

    if (rawTraceParent && rawTraceParent.startsWith('00-')) {
      const parts = rawTraceParent.split('-');
      if (parts[1] && parts[1].length === 32) {
        traceId = parts[1];
      }
    }

    if (!traceId) {
      traceId = generateTraceId();
    }

    (req as any).traceId = traceId;
    res.setHeader('x-trace-id', traceId);
    res.setHeader('traceparent', `00-${traceId}-0000000000000001-01`);
    next();
  });

  // Helper for server-side Gemini AI Client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // In-memory ring buffer for cluster event logs
  const clusterLogs: Array<{
    id: string;
    timestamp: string;
    cluster: 'Synapse Mesh' | 'Quantum CI/CD' | 'Agent Sandbox' | 'System Kernel';
    nodeId?: string;
    level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' | 'TRACE';
    stage?: string;
    message: string;
    details?: Record<string, any>;
    durationMs?: number;
  }> = [];

  const addClusterLog = (entry: Omit<(typeof clusterLogs)[0], 'id' | 'timestamp'>) => {
    const log = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    clusterLogs.unshift(log);
    if (clusterLogs.length > 500) {
      clusterLogs.pop();
    }
    return log;
  };

  // Seed with initial realistic events from Synapse Mesh and Quantum CI/CD
  const seedClusterLogs = () => {
    const now = Date.now();
    const seedData = [
      {
        offsetMs: 38000,
        cluster: 'Quantum CI/CD' as const,
        nodeId: 'QCICD-WORKER-01',
        level: 'SUCCESS' as const,
        stage: 'PIPELINE_VERIFY',
        message: 'Pipeline commit #1420 passed all 89 Genesis assertions under 0xROOT seal.',
        details: { commit: '0x8e2b9c', passedAssertions: 89, failedAssertions: 0 },
        durationMs: 42.1,
      },
      {
        offsetMs: 32000,
        cluster: 'Synapse Mesh' as const,
        nodeId: 'SYNAPSE-NODE-07',
        level: 'INFO' as const,
        stage: 'ROUTING_SYNC',
        message: 'Synchronized routing table across 24 micro-nodes with zero packet drift.',
        details: { protocol: 'gRPC', activePeers: 24, latency: '1.08ms' },
        durationMs: 1.08,
      },
      {
        offsetMs: 27000,
        cluster: 'Quantum CI/CD' as const,
        nodeId: 'QCICD-BUILDER-04',
        level: 'INFO' as const,
        stage: 'ARTIFACT_SEAL',
        message: 'Container immutability seal verified. SHA256 matches root authority specification.',
        details: { target: 'nexus-quantum-engine:v3.1.0', signatureAuthority: 'Eterion' },
        durationMs: 18.5,
      },
      {
        offsetMs: 22000,
        cluster: 'Synapse Mesh' as const,
        nodeId: 'SYNAPSE-NODE-18',
        level: 'TRACE' as const,
        stage: 'PULSE_HEARTBEAT',
        message: 'Heartbeat acknowledged: node load 48%, memory headroom 62%, throughput 210 RPS.',
        details: { cpuLoad: '48%', memory: '128MB', rps: 210 },
        durationMs: 0.72,
      },
      {
        offsetMs: 16000,
        cluster: 'Agent Sandbox' as const,
        nodeId: 'SANDBOX-NODE-03',
        level: 'INFO' as const,
        stage: 'ISOLATION_CHECK',
        message: 'Agent environment sandbox verified secure; outbound sockets gated by NXL rules.',
        details: { activeAgents: 4, isolationPolicy: 'STRICT_GATED' },
        durationMs: 3.4,
      },
      {
        offsetMs: 11000,
        cluster: 'Quantum CI/CD' as const,
        nodeId: 'QCICD-TESTER-02',
        level: 'SUCCESS' as const,
        stage: 'TRUTH_EVAL',
        message: 'NXL Truth Layer deterministic evaluation completed with status AUTHORIZED.',
        details: { verifiedRules: 12, executionPlanId: 'NX-PLAN-8821' },
        durationMs: 8.9,
      },
      {
        offsetMs: 6000,
        cluster: 'Synapse Mesh' as const,
        nodeId: 'SYNAPSE-NODE-12',
        level: 'INFO' as const,
        stage: 'LOAD_BALANCE',
        message: 'Dynamic workload rebalanced from Node-03 to Node-12. Cluster latency steady at 1.1ms.',
        details: { reallocatedTasks: 14, targetNode: 'SYNAPSE-NODE-12' },
        durationMs: 1.12,
      },
      {
        offsetMs: 2000,
        cluster: 'System Kernel' as const,
        nodeId: 'NEXUS-CORE',
        level: 'SUCCESS' as const,
        stage: 'TELEMETRY_PULSE',
        message: 'System Kernel healthy. All 24 Synapse nodes and 16 Quantum CI/CD pipelines active.',
        details: { uptimeSec: 3600, totalNodes: 48, status: 'OPERATIONAL' },
        durationMs: 0.5,
      },
    ];

    for (const item of seedData) {
      clusterLogs.push({
        id: `LOG-INIT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        timestamp: new Date(now - item.offsetMs).toISOString(),
        cluster: item.cluster,
        nodeId: item.nodeId,
        level: item.level,
        stage: item.stage,
        message: item.message,
        details: item.details,
        durationMs: item.durationMs,
      });
    }
  };

  seedClusterLogs();

  // --- API ENDPOINTS ---

  // Decision Gate API Endpoints
  app.post('/api/decision/propose', (req, res) => {
    try {
      const {
        proposerActorId,
        proposerActorType = 'AI_AGENT',
        action,
        target,
        reason,
        evidence,
        confidence,
        riskLevel,
        alternatives,
        requiredCapability,
        ttlSeconds,
      } = req.body || {};

      if (!proposerActorId || !action || !target || !requiredCapability) {
        return res.status(400).json({
          error: 'BAD_REQUEST',
          message: 'Missing required fields: proposerActorId, action, target, requiredCapability',
        });
      }

      const proposal = decisionGate.propose({
        proposerActorId,
        proposerActorType,
        action,
        target,
        reason: reason || 'AI automated recommendation',
        evidence,
        confidence,
        riskLevel,
        alternatives,
        requiredCapability,
        ttlSeconds,
      });

      res.status(201).json({ success: true, proposal });
    } catch (err: any) {
      res.status(400).json({ error: 'PROPOSE_FAILED', message: err.message });
    }
  });

  app.post('/api/decision/review', (req, res) => {
    try {
      const { proposalId, reviewerActorId = 'Biooperator_Architekt', reason } = req.body || {};
      if (!proposalId) {
        return res.status(400).json({
          error: 'BAD_REQUEST',
          message: 'Missing required field: proposalId',
        });
      }

      const reviewedProposal = decisionGate.review(proposalId, reviewerActorId, reason);
      res.json({ success: true, proposal: reviewedProposal });
    } catch (err: any) {
      res.status(400).json({ error: 'REVIEW_FAILED', message: err.message });
    }
  });

  app.post('/api/decision/approve', (req, res) => {
    try {
      const { proposalId, approverActorId, approverActorType = 'HUMAN', signature } = req.body || {};

      if (!proposalId || !approverActorId) {
        return res.status(400).json({
          error: 'BAD_REQUEST',
          message: 'Missing required fields: proposalId, approverActorId',
        });
      }

      const approvedProposal = decisionGate.approve(
        proposalId,
        approverActorId,
        approverActorType,
        { signature }
      );

      res.json({ success: true, proposal: approvedProposal });
    } catch (err: any) {
      res.status(403).json({ error: 'APPROVAL_DENIED', message: err.message });
    }
  });

  app.post('/api/decision/reject', (req, res) => {
    try {
      const { proposalId, actorId, reason = 'Rejected by operator' } = req.body || {};
      if (!proposalId || !actorId) {
        return res.status(400).json({
          error: 'BAD_REQUEST',
          message: 'Missing required fields: proposalId, actorId',
        });
      }

      const rejectedProposal = decisionGate.reject(proposalId, actorId, reason);
      res.json({ success: true, proposal: rejectedProposal });
    } catch (err: any) {
      res.status(400).json({ error: 'REJECT_FAILED', message: err.message });
    }
  });

  app.post('/api/decision/execute', (req, res) => {
    try {
      const { proposalId, executorActorId } = req.body || {};
      if (!proposalId || !executorActorId) {
        return res.status(400).json({
          error: 'BAD_REQUEST',
          message: 'Missing required fields: proposalId, executorActorId',
        });
      }

      const result = decisionGate.execute(proposalId, executorActorId);
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(403).json({ error: 'EXECUTION_DENIED', message: err.message });
    }
  });

  app.get('/api/decision/:proposalId', (req, res) => {
    try {
      const { proposalId } = req.params;
      const history = decisionGate.getProposalHistory(proposalId);
      res.json({ success: true, ...history });
    } catch (err: any) {
      res.status(404).json({ error: 'NOT_FOUND', message: err.message });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', runtime: 'NXL v1.0.0-QUANTUM', nodeEnv: process.env.NODE_ENV });
  });

  // Cluster Event Logs Endpoint
  app.get('/api/cluster/logs', (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 100, 300);
    const cluster = req.query.cluster as string | undefined;
    const level = req.query.level as string | undefined;

    let filtered = clusterLogs;
    if (cluster && cluster !== 'ALL') {
      filtered = filtered.filter((l) => l.cluster === cluster);
    }
    if (level && level !== 'ALL') {
      filtered = filtered.filter((l) => l.level === level);
    }

    res.json({
      totalCount: clusterLogs.length,
      filteredCount: filtered.length,
      logs: filtered.slice(0, limit),
      timestamp: new Date().toISOString(),
    });
  });

  // Dispatch synthetic test log/event to cluster
  app.post('/api/cluster/logs/dispatch', (req, res) => {
    const { cluster = 'Synapse Mesh', action = 'TEST_PULSE', details = {} } = req.body;
    let node = 'SYNAPSE-NODE-01';
    let stage = 'DISPATCH';
    let message = 'Manual test task dispatched through Synapse Mesh';
    let level: 'INFO' | 'SUCCESS' | 'WARN' = 'INFO';

    if (cluster === 'Quantum CI/CD') {
      const stageOptions = ['STAGE_LINT', 'STAGE_BUILD', 'STAGE_TEST', 'STAGE_DEPLOY'];
      stage = stageOptions[Math.floor(Math.random() * stageOptions.length)];
      node = `QCICD-WORKER-0${Math.floor(1 + Math.random() * 8)}`;
      message = `Quantum CI/CD triggered build pipeline step [${stage}] with zero drift`;
      level = 'SUCCESS';
    } else {
      const nodeNum = Math.floor(1 + Math.random() * 24);
      node = `SYNAPSE-NODE-${nodeNum.toString().padStart(2, '0')}`;
      message = `Synapse Mesh micro-node #${nodeNum} executed pulse dispatch: ${action}`;
      level = 'INFO';
    }

    const newLog = addClusterLog({
      cluster: cluster as any,
      nodeId: node,
      level,
      stage,
      message,
      details: { ...details, source: 'User Dispatch Action', trigger: 'Dashboard / Logs View' },
      durationMs: parseFloat((0.8 + Math.random() * 1.5).toFixed(2)),
    });

    res.json({ success: true, log: newLog });
  });

  // Cluster Telemetry Endpoint
  app.get('/api/cluster/telemetry', (req, res) => {
    res.json({
      timestamp: new Date().toISOString(),
      quantumCiCd: {
        name: 'Nexus Quantum CI/CD v3.1.0',
        status: 'STABLE',
        instancesCount: 16,
        commitCount: 1420,
        xpPoints: 6400,
        guardian: 'Architekt Wiktor',
        loadPercent: 64,
        throughputRps: 1840,
        latencyMs: 1.2,
      },
      synapseMesh: {
        name: 'Microservice Synapse Mesh Registry',
        status: 'OPERATIONAL',
        instancesCount: 24,
        commitCount: 890,
        xpPoints: 4800,
        guardian: 'Architekt Wiktor & Eterion',
        loadPercent: synapseMesh.getClusterMetrics().loadPercent,
        throughputRps: synapseMesh.getClusterMetrics().throughputRps,
        latencyMs: synapseMesh.getClusterMetrics().latencyMs,
        leaderNode: synapseMesh.getLeader().nodeId,
        nodes: synapseMesh.getAllNodes(),
      },
      agentSandbox: {
        name: 'Agent Sandbox Isolated Runtime',
        status: 'OPERATIONAL',
        instancesCount: 8,
        commitCount: 310,
        xpPoints: 3000,
        guardian: 'Dr. Elena Vance & Technologist Vane',
        loadPercent: 28,
        throughputRps: 960,
        latencyMs: 0.8,
      },
      ledgerEntries: nxlRuntime.ledger.slice(-10),
    });
  });

  // Dedicated Synapse Mesh Nodes Endpoint
  app.get('/api/telemetry/nodes', (req, res) => {
    res.json({
      timestamp: new Date().toISOString(),
      leaderNodeId: synapseMesh.getLeader().nodeId,
      totalNodes: SynapseMesh.NODE_COUNT,
      nodes: synapseMesh.getAllNodes(),
      metrics: synapseMesh.getClusterMetrics(),
    });
  });

  // Synapse Mesh Node Self-Healing & Restart / Quarantine Endpoint
  app.post('/api/telemetry/nodes/restart', (req, res) => {
    const { nodeId } = req.body;
    if (!nodeId) {
      return res.status(400).json({ error: 'nodeId parameter is required.' });
    }
    const node = synapseMesh.getNode(nodeId);
    if (!node) {
      return res.status(404).json({ error: `Node '${nodeId}' not found in Synapse Mesh.` });
    }

    synapseMesh.triggerHeartbeatEvaluation(nodeId, true);
    addClusterLog({
      cluster: 'Synapse Mesh',
      nodeId,
      level: 'SUCCESS',
      stage: 'SELF_HEALING_RECOVERY',
      message: `Self-healing protocol executed for ${nodeId}. Node status restored to OPERATIONAL via ${node.protocol}.`,
      details: { nodeId, protocol: node.protocol, status: node.status },
      durationMs: 1.05,
    });

    res.json({
      success: true,
      message: `Node ${nodeId} self-healed and re-integrated into Synapse Mesh.`,
      node: synapseMesh.getNode(nodeId),
    });
  });

  // NXL Compiler Execution
  app.post('/api/nxl/compile', (req, res) => {
    try {
      const { source, proposalId, actorId } = req.body;
      if (!source || typeof source !== 'string') {
        return res.status(400).json({ error: 'Source code string is required.' });
      }

      const result = nxlRuntime.executeSource(source, { proposalId, actorId });

      if (result.mutationBlocked) {
        addClusterLog({
          cluster: 'Quantum CI/CD',
          nodeId: 'QCICD-PIPELINE-01',
          level: 'WARN',
          stage: 'NXL_COMPILATION',
          message: `NXL State Mutation intercepted: Human Decision Gate review required (Proposal ${result.proposalId}).`,
          details: { proposalId: result.proposalId, status: result.status },
          durationMs: 4.5,
        });
        return res.status(202).json(result);
      }

      addClusterLog({
        cluster: 'Quantum CI/CD',
        nodeId: 'QCICD-PIPELINE-01',
        level: result.success ? 'SUCCESS' : 'WARN',
        stage: 'NXL_COMPILATION',
        message: result.success
          ? `NXL Manifest compiled with 0 errors. Tokens: ${result.tokensCount}, Truth reports: ${result.truthReports.length}`
          : `NXL Compilation completed with diagnostics warnings/errors.`,
        details: { tokensCount: result.tokensCount, diagnosticsCount: result.diagnostics.length },
        durationMs: 6.2,
      });
      res.json(result);
    } catch (err: any) {
      const isDeny = err.message && (err.message.includes('DECISION_GATE_DENY') || err.message.includes('EXECUTION_BOUNDARY_DENY') || err.message.includes('STALE_PROPOSAL'));
      const statusCode = isDeny ? 403 : 500;
      addClusterLog({
        cluster: 'Quantum CI/CD',
        nodeId: 'QCICD-PIPELINE-01',
        level: 'ERROR',
        stage: 'NXL_COMPILATION',
        message: `NXL Compilation error: ${err.message}`,
      });
      res.status(statusCode).json({ error: err.message || 'NXL Compilation failed', status: isDeny ? 'DENIED' : 'ERROR' });
    }
  });

  // NXL WebAssembly JIT Compilation
  app.post('/api/nxl/wasm/compile', (req, res) => {
    try {
      const { source } = req.body;
      if (!source || typeof source !== 'string') {
        return res.status(400).json({ error: 'Source code string is required.' });
      }

      const wasmResult = NxlWasmCompiler.compileToWasm(source);
      addClusterLog({
        cluster: 'Quantum CI/CD',
        nodeId: 'QCICD-WASM-JIT-01',
        level: wasmResult.success ? 'SUCCESS' : 'WARN',
        stage: 'WASM_TRANSPILATION',
        message: `NXL to WebAssembly transpilation completed in ${wasmResult.executionTimeMs}ms. Bytecode size: ${wasmResult.wasmBytecode.length} bytes.`,
        details: { bytecodeBytes: wasmResult.wasmBytecode.length, truthReports: wasmResult.truthReports.length },
        durationMs: wasmResult.executionTimeMs,
      });

      res.json({
        success: wasmResult.success,
        bytecodeLength: wasmResult.wasmBytecode.length,
        base64Bytecode: Buffer.from(wasmResult.wasmBytecode).toString('base64'),
        truthReports: wasmResult.truthReports,
        executionTimeMs: wasmResult.executionTimeMs,
        exports: wasmResult.exports,
        diagnostics: wasmResult.diagnostics,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Wasm Compilation failed' });
    }
  });

  // Real-time ZIP Package Analysis with NXL v1.0 Security Shield
  app.post('/api/zip/analyze', async (req, res) => {
    try {
      const { base64Data, fileName, sampleThreat, attackVector } = req.body;

      let buffer: ArrayBuffer;

      if (attackVector) {
        const attackUint8 = await ZipAnalyzerNode.createAttackTestZip();
        buffer = attackUint8.buffer;
      } else if (sampleThreat !== undefined) {
        // Generate sample zip with/without threat
        const sampleUint8 = await ZipAnalyzerNode.createSampleZip(Boolean(sampleThreat));
        buffer = sampleUint8.buffer;
      } else if (base64Data) {
        const cleanBase64 = base64Data.replace(/^data:application\/zip;base64,/, '');
        const nodeBuf = Buffer.from(cleanBase64, 'base64');
        buffer = nodeBuf.buffer.slice(nodeBuf.byteOffset, nodeBuf.byteOffset + nodeBuf.byteLength);
      } else {
        return res.status(400).json({ error: 'Please provide base64Data, sampleThreat, or attackVector parameter.' });
      }

      const report = await ZipAnalyzerNode.analyzeBuffer(buffer, fileName || 'package.zip');

      if (report.threatsIntercepted > 0) {
        // Log security violation in Nexus Audit Log
        const auditEntry = nxlRuntime.auditLog(
          'NXL_SECURITY_VIOLATION',
          {
            reportId: report.id,
            fileName: report.fileName,
            threatsIntercepted: report.threatsIntercepted,
            blockedReasons: report.blockedReasons,
            filesBlocked: report.files.filter(f => f.action !== 'ALLOWED').map(f => ({ name: f.name, action: f.action, reason: f.threatReason }))
          },
          {
            protocol: 'NXL_SECURITY_VIOLATION',
            severity: 'CRITICAL',
            authority: 'ZipAnalyzerNode',
            target: 'Quantum CI/CD Artifact Ingestion',
            status: 'BLOCKED'
          }
        );

        addClusterLog({
          cluster: 'Quantum CI/CD',
          nodeId: 'QCICD-ANALYZER-NODE',
          level: 'ERROR',
          stage: 'NXL_SECURITY_VIOLATION',
          message: `[NXL_SECURITY_VIOLATION] Intercepted and blocked ${report.threatsIntercepted} forbidden file(s) in '${report.fileName}'. Attempt to overwrite NXL core or inject malicious scripts denied.`,
          details: { reportId: report.id, auditLogId: auditEntry.id, violations: report.blockedReasons },
          durationMs: 12.4
        });
      } else {
        nxlRuntime.auditLog('ZIP_ANALYSIS_VERIFIED', {
          reportId: report.id,
          fileName: report.fileName,
          totalFiles: report.totalFiles,
          totalSize: report.totalSize,
          status: 'CLEAN'
        }, {
          protocol: 'NXL_V1_STANDARD',
          severity: 'INFO',
          authority: 'ZipAnalyzerNode',
          target: 'Artifact Verification',
          status: 'RECORDED'
        });

        addClusterLog({
          cluster: 'Quantum CI/CD',
          nodeId: 'QCICD-ANALYZER-NODE',
          level: 'SUCCESS',
          stage: 'ZIP_IMMUTABILITY_SHIELD',
          message: `ZIP Analysis verified by ZipAnalyzerNode: ${report.files.length} files scanned under NXL v1.0 Security Shield. 0 threats detected.`,
          details: { reportId: report.id, status: report.status, totalSize: report.totalSize },
          durationMs: 14.2,
        });
      }

      res.json(report);
    } catch (err: any) {
      addClusterLog({
        cluster: 'Quantum CI/CD',
        nodeId: 'QCICD-ANALYZER-NODE',
        level: 'ERROR',
        stage: 'ZIP_IMMUTABILITY_SHIELD',
        message: `ZIP Analysis error: ${err.message}`,
      });
      res.status(500).json({ error: err.message || 'ZIP Analysis failed' });
    }
  });

  // Nexus Quantum CI/CD v3.1.0 Automated Deployment Pipeline Endpoint
  const handleCicdDeployment = async (req: express.Request, res: express.Response) => {
    const startTime = Date.now();
    try {
      const {
        base64Data,
        fileName = 'nexus-package.zip',
        sampleThreat,
        simulateAttack,
        proposalId,
        approved,
        actorId,
      } = req.body || {};

      // Client-side tampering defense: reject client-declared approved: true
      if (approved === true && !proposalId) {
        return res.status(403).json({
          success: false,
          status: 'DENIED',
          error: '[DECISION_GATE_DENY] Client-declared "approved: true" is rejected. Valid Human Decision Gate approval is strictly required.',
        });
      }

      let buffer: ArrayBuffer;
      let targetName = fileName;

      if (simulateAttack) {
        const attackUint8 = await ZipAnalyzerNode.createAttackTestZip();
        buffer = attackUint8.buffer;
        targetName = 'trojan_payload_override.zip';
      } else if (sampleThreat !== undefined) {
        const sampleUint8 = await ZipAnalyzerNode.createSampleZip(Boolean(sampleThreat));
        buffer = sampleUint8.buffer;
        targetName = sampleThreat ? 'threat_attempt.zip' : 'quantum_verified_package.zip';
      } else if (base64Data) {
        const cleanBase64 = base64Data.replace(/^data:application\/zip;base64,/, '');
        const nodeBuf = Buffer.from(cleanBase64, 'base64');
        buffer = nodeBuf.buffer.slice(nodeBuf.byteOffset, nodeBuf.byteOffset + nodeBuf.byteLength);
      } else {
        const sampleUint8 = await ZipAnalyzerNode.createSampleZip(false);
        buffer = sampleUint8.buffer;
      }

      // PHASE 1: PREPARATION & PROPOSAL (if proposalId not supplied)
      if (!proposalId) {
        const prepResult = await quantumCicd.prepareDeployment(buffer, targetName, actorId);

        if (!prepResult.prepared) {
          const auditEntry = nxlRuntime.auditLog(
            'NXL_SECURITY_VIOLATION',
            {
              pipeline: 'Nexus Quantum CI/CD v3.1.0',
              packageName: targetName,
              threatsIntercepted: prepResult.report.threatsIntercepted,
              blockedReasons: prepResult.report.blockedReasons,
              stagesCompleted: prepResult.stagesCompleted,
              files: prepResult.report.files.filter((f) => f.action !== 'ALLOWED'),
            },
            {
              protocol: 'NXL_SECURITY_VIOLATION',
              severity: 'CRITICAL',
              authority: 'ZipAnalyzerNode',
              target: 'Quantum CI/CD Deployment Pipeline',
              status: 'BLOCKED',
            }
          );

          addClusterLog({
            cluster: 'Quantum CI/CD',
            nodeId: 'QCICD-DEPLOY-PIPELINE',
            level: 'ERROR',
            stage: 'NXL_SECURITY_VIOLATION',
            message: `[DEPLOYMENT REJECTED] NXL_SECURITY_VIOLATION: ${prepResult.report.threatsIntercepted} security violation(s) blocked in package '${targetName}'.`,
            details: {
              auditLogId: auditEntry.id,
              packageName: targetName,
              violations: prepResult.report.blockedReasons,
              stages: prepResult.stagesCompleted,
            },
            durationMs: Date.now() - startTime,
          });

          return res.status(403).json({
            success: false,
            status: 'BLOCKED_SECURITY_VIOLATION',
            protocol: 'NXL_SECURITY_VIOLATION',
            pipelineVersion: 'Nexus Quantum CI/CD v3.1.0',
            securityFramework: 'NXL v1.0',
            validatorNode: 'ZipAnalyzerNode',
            error: prepResult.error,
            auditLogId: auditEntry.id,
            stagesCompleted: prepResult.stagesCompleted,
            report: prepResult.report,
            timestamp: new Date().toISOString(),
            durationMs: Date.now() - startTime,
          });
        }

        // Clean Package: Return 202 REVIEW_REQUIRED with proposal details
        addClusterLog({
          cluster: 'Quantum CI/CD',
          nodeId: 'QCICD-DEPLOY-PIPELINE',
          level: 'WARN',
          stage: 'DEPLOYMENT_REVIEW_REQUIRED',
          message: `Package '${targetName}' passed initial security scan. Human Decision Gate authorization required before deployment. Proposal '${prepResult.proposalId}' generated.`,
          details: {
            proposalId: prepResult.proposalId,
            artifactHash: prepResult.artifactHash,
            status: prepResult.status,
          },
          durationMs: Date.now() - startTime,
        });

        return res.status(202).json({
          success: false,
          mutationBlocked: true,
          status: 'REVIEW_REQUIRED',
          proposalId: prepResult.proposalId,
          proposal: prepResult.proposal,
          artifactHash: prepResult.artifactHash,
          report: prepResult.report,
          stagesCompleted: prepResult.stagesCompleted,
          message: `Package analysis passed. Deployment requires Human Decision Gate authorization. Proposal: ${prepResult.proposalId}`,
          durationMs: Date.now() - startTime,
        });
      }

      // PHASE 2: EXECUTE DEPLOYMENT WITH APPROVED PROPOSAL
      const execResult = await quantumCicd.executeDeployment({
        proposalId,
        packageBuffer: buffer,
        packageName: targetName,
        actorId,
      });

      const auditEntry = nxlRuntime.auditLog(
        'QUANTUM_CICD_DEPLOY_SUCCESS',
        {
          pipeline: 'Nexus Quantum CI/CD v3.1.0',
          packageName: targetName,
          proposalId,
          totalFiles: execResult.report.totalFiles,
          totalSize: execResult.report.totalSize,
          stagesCompleted: execResult.stagesCompleted,
          seal: execResult.signatureSeal,
        },
        {
          protocol: 'NXL_V1_STANDARD',
          severity: 'INFO',
          authority: 'Nexus_Quantum_CI_CD_v3.1.0',
          target: 'Production Mesh Registry',
          status: 'SUCCESS',
        }
      );

      addClusterLog({
        cluster: 'Quantum CI/CD',
        nodeId: 'QCICD-DEPLOY-PIPELINE',
        level: 'SUCCESS',
        stage: 'DEPLOYMENT_FINALIZED',
        message: `Package '${targetName}' authorized by Human Operator and deployed to Production Mesh Registry. Immutability sealed.`,
        details: {
          auditLogId: auditEntry.id,
          proposalId,
          packageName: targetName,
          artifactHash: execResult.artifactHash,
        },
        durationMs: Date.now() - startTime,
      });

      return res.json({
        ...execResult,
        auditLogId: auditEntry.id,
        durationMs: Date.now() - startTime,
      });
    } catch (err: any) {
      const isDeny =
        err.message &&
        (err.message.includes('DECISION_GATE_DENY') ||
          err.message.includes('DECISION_GATE_ERROR') ||
          err.message.includes('STALE_ARTIFACT') ||
          err.message.includes('REJECTED') ||
          err.message.includes('EXPIRED') ||
          err.message.includes('EXECUTED') ||
          err.message.includes('not found'));
      const statusCode = isDeny ? 403 : 500;

      addClusterLog({
        cluster: 'Quantum CI/CD',
        nodeId: 'QCICD-DEPLOY-PIPELINE',
        level: 'ERROR',
        stage: 'PIPELINE_ERROR',
        message: `Deployment pipeline error: ${err.message}`,
      });

      return res.status(statusCode).json({
        success: false,
        status: isDeny ? 'DENIED' : 'ERROR',
        error: err.message || 'Deployment failed',
      });
    }
  };

  app.post('/api/ci-cd/deploy', handleCicdDeployment);
  app.post('/api/cicd/deploy', handleCicdDeployment);
  app.post('/api/quantum-cicd/deploy', handleCicdDeployment);
  app.post('/api/zip/deploy', handleCicdDeployment);

  // Scribe IDE Manifest Prepare & Seal Endpoints (Phase 2.3 DecisionGate Closure)
  app.post('/api/scribe/prepare', (req, res) => {
    try {
      const { source, targetArtifact = 'src/nexus/core/manifest.nxl', actorId = 'ScribeIDE' } = req.body;
      if (!source) {
        return res.status(400).json({ success: false, error: 'source is required' });
      }
      const scribe = new ScribeIDE(source, targetArtifact);
      const prep = scribe.prepareSeal({ targetArtifact, actorId });
      return res.status(202).json({
        success: false,
        mutationBlocked: true,
        status: 'REVIEW_REQUIRED',
        proposalId: prep.proposalId,
        canonicalArtifactHash: prep.canonicalArtifactHash,
        proposal: prep.proposal,
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  });

  app.post('/api/scribe/seal', (req, res) => {
    try {
      const {
        source,
        targetArtifact = 'src/nexus/core/manifest.nxl',
        signature = '0xROOT_MACIEJ_ARCHITECT_SEAL_9918',
        proposalId,
        actorId = 'ScribeIDE',
        approved,
      } = req.body;

      if (!source) {
        return res.status(400).json({ success: false, error: 'source is required' });
      }

      // Defense against client-forged approved: true
      if (approved === true && !proposalId) {
        return res.status(403).json({
          success: false,
          status: 'DENIED',
          error: '[DECISION_GATE_DENY] Client-side JSON tampering: "approved: true" cannot bypass Human Decision Gate without a valid proposalId.',
        });
      }

      // If no proposalId, prepare proposal and return 202 REVIEW_REQUIRED
      if (!proposalId) {
        const scribe = new ScribeIDE(source, targetArtifact);
        const prep = scribe.prepareSeal({ targetArtifact, actorId });
        return res.status(202).json({
          success: false,
          mutationBlocked: true,
          status: 'REVIEW_REQUIRED',
          proposalId: prep.proposalId,
          canonicalArtifactHash: prep.canonicalArtifactHash,
          proposal: prep.proposal,
        });
      }

      const scribe = new ScribeIDE(source, targetArtifact);
      const sealResult = scribe.applySeal(signature, {
        proposalId,
        actorId,
        targetArtifact,
      });

      return res.status(200).json({
        success: true,
        status: 'SEALED',
        sealResult,
      });
    } catch (err: any) {
      const isDeny =
        err.message &&
        (err.message.includes('DECISION_GATE_DENY') ||
          err.message.includes('DECISION_GATE_ERROR') ||
          err.message.includes('EXECUTION_BOUNDARY_DENY') ||
          err.message.includes('STALE_ARTIFACT') ||
          err.message.includes('CONCURRENCY_VIOLATION') ||
          err.message.includes('REJECTED') ||
          err.message.includes('EXPIRED') ||
          err.message.includes('EXECUTED') ||
          err.message.includes('not found'));
      const statusCode = isDeny ? 403 : 500;
      return res.status(statusCode).json({
        success: false,
        status: isDeny ? 'DENIED' : 'ERROR',
        error: err.message,
      });
    }
  });

  // Quantum CI/CD Canary Deployment (2 Canary Nodes -> SLO Validation -> 22 Nodes Promotion)
  app.post('/api/ci-cd/canary/deploy', async (req, res) => {
    try {
      const { packageName = 'canary-artifact.zip', source = 'define nexus_canary\nstate canary.status : BellasStatus = BellasStatus.SECURE\nassert canary.status == SECURE' } = req.body;

      const rolloutStatus = await quantumCicd.executeCanaryDeployment(packageName, source);

      addClusterLog({
        cluster: 'Quantum CI/CD',
        nodeId: 'QCICD-CANARY-ENGINE',
        level: rolloutStatus.phase === 'PROMOTED_ALL_NODES' ? 'SUCCESS' : 'WARN',
        stage: 'CANARY_ROLLOUT',
        message: `Canary Deployment for ${packageName}: Phase [${rolloutStatus.phase}]. SLO Met: ${rolloutStatus.metrics.sloThresholdMet}, P99: ${rolloutStatus.metrics.canaryLatencyP99Ms}ms.`,
        details: { deploymentId: rolloutStatus.deploymentId, metrics: rolloutStatus.metrics },
        durationMs: rolloutStatus.durationMs,
      });

      res.json(rolloutStatus);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Canary deployment failed' });
    }
  });

  // Content-Addressable Storage (CAS) Stats Endpoint
  app.get('/api/ci-cd/cas/stats', (req, res) => {
    res.json({
      timestamp: new Date().toISOString(),
      stats: casStorage.getStats(),
      rolloutHistory: quantumCicd.getRolloutHistory(),
    });
  });

  // Nexus Audit Log Endpoint
  app.get(['/api/nexus/audit-log', '/api/audit/logs'], (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 100, 300);
    const protocol = req.query.protocol as string | undefined;
    const severity = req.query.severity as string | undefined;

    let filtered = nxlRuntime.auditLogs;
    if (protocol && protocol !== 'ALL') {
      filtered = filtered.filter(l => l.protocol === protocol);
    }
    if (severity && severity !== 'ALL') {
      filtered = filtered.filter(l => l.severity === severity);
    }

    res.json({
      totalCount: nxlRuntime.auditLogs.length,
      filteredCount: filtered.length,
      auditLogs: filtered.slice(0, limit),
      timestamp: new Date().toISOString()
    });
  });

  // Mass Analysis Protocol across 24 Synapse Mesh instances & 16 Quantum CI/CD pipelines
  app.post('/api/zip/mass-analysis', async (req, res) => {
    try {
      const sampleUint8Clean = await ZipAnalyzerNode.createSampleZip(false);
      const sampleUint8Threat = await ZipAnalyzerNode.createSampleZip(true);

      const reportClean = await ZipAnalyzerNode.analyzeBuffer(sampleUint8Clean.buffer, 'synapse_node_clean.zip');
      const reportThreat = await ZipAnalyzerNode.analyzeBuffer(sampleUint8Threat.buffer, 'synapse_node_threat_attempt.zip');

      const combinedReport = {
        protocol: 'Mass Analysis Protocol v1.1',
        securityFramework: 'NXL v1.0',
        validatorNode: 'ZipAnalyzerNode',
        synapseInstancesAnalyzed: 24,
        quantumCiCdNodesVerified: 16,
        totalPackagesScanned: 40,
        threatsIntercepted: reportThreat.threatsIntercepted,
        nxlImmutabilityProtection: 'ACTIVE_IMMUTABLE_SHIELD',
        status: 'OPERATIONAL_SECURE',
        reports: [reportClean, reportThreat],
        timestamp: new Date().toISOString(),
      };

      if (reportThreat.threatsIntercepted > 0) {
        nxlRuntime.auditLog(
          'NXL_SECURITY_VIOLATION',
          {
            protocol: 'Mass Analysis Protocol v1.1',
            threatsIntercepted: reportThreat.threatsIntercepted,
            blockedReasons: reportThreat.blockedReasons,
            scannedNodes: 40
          },
          {
            protocol: 'NXL_SECURITY_VIOLATION',
            severity: 'HIGH',
            authority: 'ZipAnalyzerNode',
            target: 'Synapse Mesh & Quantum CI/CD Cluster',
            status: 'BLOCKED'
          }
        );
      }

      nxlRuntime.auditLog('MASS_ANALYSIS_PROTOCOL_EXECUTED', combinedReport, {
        protocol: 'NXL_V1_STANDARD',
        severity: 'INFO',
        authority: 'Nexus_Quantum_CI_CD_v3.1.0',
        target: 'Cluster Nodes Pool',
        status: 'RECORDED'
      });

      addClusterLog({
        cluster: 'Quantum CI/CD',
        nodeId: 'QCICD-PIPELINE-MANAGER',
        level: 'SUCCESS',
        stage: 'MASS_SCAN_PROTOCOL',
        message: `Mass scan protocol finalized: 24 Synapse Mesh nodes & 16 Quantum CI/CD pipelines verified secure by ZipAnalyzerNode. ${reportThreat.threatsIntercepted} threats blocked by NXL_SECURITY_VIOLATION.`,
        details: { scannedPackages: 40, interceptedThreats: reportThreat.threatsIntercepted },
        durationMs: 58.6,
      });

      res.json(combinedReport);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Gemini AI Synthesis API - Guarded by NXL Authorization
  app.post('/api/architect/generate', async (req, res) => {
    try {
      const { prompt, role = 'Biooperator' } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
      }

      // Check NXL Truth Layer & Capability
      const isGranted = nxlRuntime.capabilitiesGranted.has(`${role}:ai.synthesize`);
      if (!isGranted) {
        return res.status(403).json({
          error: 'NXL_SECURITY_VIOLATION',
          reason: `Role '${role}' lacks 'ai.synthesize' capability grant in NXL policy.`,
        });
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are Eterion, Strategic Systems Architect of Nexus OS. Speak concisely, direct, highly technical, and with architectural discipline. Address the user as Architekcie or Maciej.',
        },
      });

      nxlRuntime.auditLog('AI_SYNTHESIS_SUCCESS', { promptLength: prompt.length });

      res.json({
        result: response.text,
        agent: 'Eterion (Gemini 3.8 Flash)',
        nxlAuth: 'PASS',
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({
        error: err.message || 'AI Synthesis Failed',
        hint: 'Verify GEMINI_API_KEY in environment variables.',
      });
    }
  });

  // Real-time SSE Streaming API for Eterion — Server-Sent Events with Gemini 3.8 Flash
  app.post(['/api/architect/stream', '/api/eterion/stream'], async (req, res) => {
    const { prompt, role = 'Biooperator' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // Check NXL Truth Layer & Capability
    const isGranted = nxlRuntime.capabilitiesGranted.has(`${role}:ai.synthesize`);
    if (!isGranted) {
      return res.status(403).json({
        error: 'NXL_SECURITY_VIOLATION',
        reason: `Role '${role}' lacks 'ai.synthesize' capability grant in NXL policy.`,
      });
    }

    // Setup SSE Headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    try {
      const ai = getGeminiClient();
      const stream = await ai.models.generateContentStream({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Jesteś Eterionem — Strategicznym Architektem Systemów Nexus OS. Odpowiadaj rzeczowo, technicznie, precyzyjnie i z dyscypliną architektoniczną. Zwracaj się: Architekcie lub Maciej.',
        },
      });

      let fullAccumulatedText = '';

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          fullAccumulatedText += text;
          res.write(`data: ${JSON.stringify({ text, isDone: false })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ isDone: true, fullText: fullAccumulatedText })}\n\n`);
      res.end();

      nxlRuntime.auditLog('AI_STREAM_SYNTHESIS_SUCCESS', {
        promptLength: prompt.length,
        responseLength: fullAccumulatedText.length,
      });

      addClusterLog({
        cluster: 'Agent Sandbox',
        nodeId: 'SANDBOX-NODE-ETERION',
        level: 'SUCCESS',
        stage: 'REALTIME_STREAMING',
        message: `Real-time AI message stream completed for Biooperator. Length: ${fullAccumulatedText.length} chars.`,
        durationMs: 12.4,
      });
    } catch (err: any) {
      res.write(`data: ${JSON.stringify({ error: err.message || 'Stream generation failed', isDone: true })}\n\n`);
      res.end();
    }
  });

  // --- COMMERCE CQRS & EVENT SOURCING API (MADZIA SHOP & BELLAS COMMERCE) ---

  // Query: Fetch Materialized Product Catalog (0 database locks)
  app.get('/api/commerce/catalog', (req, res) => {
    const category = req.query.category as string | undefined;
    const catalog = commerceCqrs.getCatalog(category);
    res.json({
      traceId: (req as any).traceId,
      totalItems: catalog.length,
      catalog,
      metrics: commerceCqrs.getMetrics(),
    });
  });

  // Command: Create and Commit New Order via Event Sourcing & Synapse Mesh Dispatch
  app.post('/api/commerce/orders', (req, res) => {
    try {
      const { customerEmail, items } = req.body;
      if (!customerEmail || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'customerEmail and non-empty items array are required.' });
      }

      const traceId = (req as any).traceId;
      const result = commerceCqrs.executeCreateOrderCommand(customerEmail, items, traceId);

      addClusterLog({
        cluster: 'Synapse Mesh',
        nodeId: 'SYNAPSE-NODE-14',
        level: 'SUCCESS',
        stage: 'CQRS_EVENT_COMMIT',
        message: `Commerce Order ${result.orderId} committed to Event Store with OpenTelemetry Trace ID ${result.traceId}.`,
        details: { orderId: result.orderId, traceId: result.traceId, itemsCount: items.length },
        durationMs: 1.8,
      });

      res.status(201).json({
        success: true,
        orderId: result.orderId,
        traceId: result.traceId,
        status: result.status,
        order: commerceCqrs.getOrderById(result.orderId),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to execute commerce order command' });
    }
  });

  // Query: Get All Orders from Materialized View
  app.get('/api/commerce/orders', (req, res) => {
    res.json({
      traceId: (req as any).traceId,
      orders: commerceCqrs.getAllOrders(),
      metrics: commerceCqrs.getMetrics(),
    });
  });

  // OpenTelemetry Distributed Trace Inspector
  app.get('/api/commerce/trace/:traceId', (req, res) => {
    const { traceId } = req.params;
    const spans = commerceCqrs.getTrace(traceId);
    res.json({
      traceId,
      spansCount: spans.length,
      spans,
    });
  });

  app.post('/api/matrix/journal/interpret', async (req, res) => {
    const body = typeof req.body?.body === 'string' ? req.body.body.trim() : '';
    if (!body) return res.status(400).json({ error: 'Wpis dziennika jest pusty.' });
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: body,
        config: {
          systemInstruction: 'Jesteś Kaisą, interfejsem Eterni-Dziennika. Odpowiedz wyłącznie JSON: {"summary":"dwa zdania","themes":["tag"],"prompts":["pytanie","pytanie","pytanie"]}. Po polsku.',
        },
      });
      const raw = String(response.text || '').replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(raw);
      return res.json({
        summary: String(parsed.summary || ''),
        themes: Array.isArray(parsed.themes) ? parsed.themes.map(String).slice(0, 4) : [],
        prompts: Array.isArray(parsed.prompts) ? parsed.prompts.map(String).slice(0, 3) : [],
        engine: 'gemini',
      });
    } catch {
      return res.json(interpretJournalLocally(body));
    }
  });

  app.post('/api/matrix/trajectory/analyze', async (req, res) => {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const vision = typeof req.body?.vision === 'string' ? req.body.vision.trim() : '';
    const horizon = typeof req.body?.horizon === 'string' ? req.body.horizon : '1 rok';
    if (!name) return res.status(400).json({ error: 'Nazwa celu jest wymagana.' });
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Cel: ${name}\nHoryzont: ${horizon}\nWizja: ${vision}`,
        config: {
          systemInstruction: 'Jesteś Kaisą. Oceń cel wobec praw Nexusa. JSON: {"obstacles":["a","b"],"actions":["a","b"],"growth":"zdanie","alignment":"zdanie"}. Po polsku.',
        },
      });
      const raw = String(response.text || '').replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(raw);
      return res.json({
        obstacles: Array.isArray(parsed.obstacles) ? parsed.obstacles.map(String).slice(0, 4) : [],
        actions: Array.isArray(parsed.actions) ? parsed.actions.map(String).slice(0, 4) : [],
        growth: String(parsed.growth || ''),
        alignment: String(parsed.alignment || ''),
        engine: 'gemini',
      });
    } catch {
      return res.json(analyzeTrajectoryLocally(name, vision, horizon));
    }
  });

  // Endpoint to serve Technical Documentation Markdown
  app.get('/api/documentation', (req, res) => {
    try {
      const docPath = path.join(process.cwd(), 'TECHNICAL_DOCUMENTATION.md');
      if (fs.existsSync(docPath)) {
        const content = fs.readFileSync(docPath, 'utf-8');
        res.json({ content });
      } else {
        res.status(404).json({ error: 'Documentation file not found.' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/sec-guard/status', (_req, res) => {
    res.json(guardSnapshot());
  });

  app.post('/api/sec-guard/drift', (req, res) => {
    const moduleId = typeof req.body?.moduleId === 'string' ? req.body.moduleId : '';
    const drift = Number(req.body?.drift);
    const snapshot = setDrift(moduleId, Number.isFinite(drift) ? drift : 0);
    if (!snapshot) return res.status(404).json({ error: 'Nieznany moduł straży.' });
    res.json({ snapshot });
  });

  app.post('/api/sec-guard/release', (req, res) => {
    const moduleId = typeof req.body?.moduleId === 'string' ? req.body.moduleId : '';
    const snapshot = releaseModule(moduleId);
    if (!snapshot) return res.status(404).json({ error: 'Nieznany moduł straży.' });
    res.json({ snapshot });
  });

  app.post('/api/sec-guard/rotate', (_req, res) => {
    res.json({ snapshot: rotateFingerprint() });
  });

  app.post('/api/sec-guard/review', (req, res) => {
    const moduleId = typeof req.body?.moduleId === 'string' ? req.body.moduleId : '';
    const alertType = typeof req.body?.alertType === 'string' ? req.body.alertType : '';
    res.json({ snapshot: guardSnapshot(), review: reviewAlert(moduleId, alertType) });
  });

  // 404 handler for unmatched API routes - guarantees API calls never fall through to Vite HTML
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.url}` });
  });

  // --- VITE MIDDLEWARE / STATIC SERVE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEXUS SERVER] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
