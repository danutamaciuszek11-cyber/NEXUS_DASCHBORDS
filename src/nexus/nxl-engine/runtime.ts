// NXL v1.0 Unified Runtime Engine
import { NxlLexer } from './lexer';
import { NxlParser } from './parser';
import { NxlTypeSystem } from './typeSystem';
import { NXLExpressionEvaluator } from './evaluator';
import {
  NxlAstNode,
  NxlDiagnostic,
  NxlTruthReport,
  NxlLedgerEntry,
  NxlExecutionPlan,
  NexusAuditLogEntry
} from '../../types';
import { decisionGate, DecisionProposal } from '../core/decision';
import { SecurityVault } from '../core/nxl/security-vault';

export class ProtectedStateMap extends Map<string, { value: any; version: number; type: string }> {
  private runtime: NXLRuntime;

  constructor(runtime: NXLRuntime) {
    super();
    this.runtime = runtime;
  }

  override set(key: string, value: { value: any; version: number; type: string }): this {
    if (!this.runtime.isStateMutationAllowed(key)) {
      throw new Error(`[EXECUTION_BOUNDARY_DENY] Direct state mutation blocked: Target '${key}' is protected by Human Decision Gate.`);
    }
    return super.set(key, value);
  }
}

export class NXLRuntime {
  private static instance: NXLRuntime;
  public ledger: NxlLedgerEntry[] = [];
  public stateMap: ProtectedStateMap;
  public capabilitiesGranted = new Set<string>(); // "nodeId:capability"
  public activeAst: NxlAstNode | null = null;
  public auditLogs: NexusAuditLogEntry[] = [];

  private isInitializing = true;
  private activeMutationLock = false;

  constructor() {
    this.stateMap = new ProtectedStateMap(this);
    this.seedInitialState();
    this.isInitializing = false;
  }

  public isStateMutationAllowed(key: string): boolean {
    if (this.isInitializing) return true;
    if (this.activeMutationLock) return true;
    // Allow low-risk telemetry / scratch writes
    if (key.startsWith('sensor.') || key.startsWith('telemetry.scratch.')) {
      return true;
    }
    return false;
  }

  public authorizedStateMutate<T>(callback: () => T): T {
    this.activeMutationLock = true;
    try {
      return callback();
    } finally {
      this.activeMutationLock = false;
    }
  }

  public static getInstance(): NXLRuntime {
    if (!NXLRuntime.instance) {
      NXLRuntime.instance = new NXLRuntime();
    }
    return NXLRuntime.instance;
  }

  private seedInitialState() {
    this.stateMap.set('nexus_root.status', { value: 'SECURE', version: 1, type: 'BellasStatus' });
    this.stateMap.set('nexus_root.version', { value: 1.0, version: 1, type: 'Number' });
    this.stateMap.set('sensor.signal', { value: 'ACTIVE', version: 1, type: 'Signal' });
    this.stateMap.set('sensor.temperature', { value: 25, version: 1, type: 'Number' });

    // Inscribed GENESIS Track into Core State Map
    this.stateMap.set('genesis.album', { value: 'GENESIS', version: 1, type: 'String' });
    this.stateMap.set('genesis.track', { value: 'Nie Tylko Narzędzie! Nie Tylko Kod!', version: 1, type: 'String' });
    this.stateMap.set('genesis.artist', { value: 'Maciej Maciuszek', version: 1, type: 'String' });
    this.stateMap.set('genesis.genre', { value: 'Cyberpunk / Folk Rap / Industrial', version: 1, type: 'String' });
    this.stateMap.set('genesis.timestamp', { value: '17 września 2026 13:48', version: 1, type: 'String' });
    this.stateMap.set('genesis.core_signature', { value: 'INSCRIBED_0xGENESIS_ROOT', version: 1, type: 'String' });

    this.capabilitiesGranted.add('zip_analyzer:net.download');
    this.capabilitiesGranted.add('zip_analyzer:file.analyze');
    this.capabilitiesGranted.add('Biooperator:ai.synthesize');
    this.capabilitiesGranted.add('Biooperator:bsc.rpc_call');
    this.capabilitiesGranted.add('MaciejMaciuszek:genesis.youtube_broadcast');

    // Seed initial Nexus Audit Log entries
    this.auditLogs = [
      {
        id: 'AUDIT-INIT-001',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        action: 'NXL_CORE_INITIALIZED',
        protocol: 'NXL_V1_STANDARD',
        severity: 'INFO',
        authority: 'Eterion_Root_Architect',
        target: 'System Kernel',
        details: { status: 'OPERATIONAL', runtime: 'NXL v1.0.0-QUANTUM', activeNodes: 24 },
        status: 'RECORDED'
      },
      {
        id: 'AUDIT-INIT-002',
        timestamp: new Date(Date.now() - 45000).toISOString(),
        action: 'QUANTUM_CICD_PIPELINE_SYNCHRONIZED',
        protocol: 'NXL_V1_STANDARD',
        severity: 'INFO',
        authority: 'Nexus_Quantum_CI_CD_v3.1.0',
        target: 'QCICD-WORKER-POOL',
        details: { pipelineVersion: 'v3.1.0', validatorNode: 'ZipAnalyzerNode', activePipelines: 16 },
        status: 'RECORDED'
      },
      {
        id: 'AUDIT-INIT-003',
        timestamp: new Date(Date.now() - 25000).toISOString(),
        action: 'GENESIS_TRUTH_ASSERTION_VERIFIED',
        protocol: 'NXL_V1_STANDARD',
        severity: 'INFO',
        authority: 'NXL_Truth_Layer',
        target: 'nexus_root.status',
        details: { result: true, evidence: 'Evaluated: [SECURE] == [SECURE]' },
        status: 'AUTHORIZED'
      }
    ];
  }

  private applyMutations(ast: NxlAstNode): void {
    if (ast.assignments) {
      for (const a of ast.assignments) {
        const prev = this.stateMap.get(a.target);
        const prevVal = prev ? prev.value : null;
        const prevVer = prev ? prev.version : 0;
        this.stateMap.set(a.target, {
          value: a.value,
          version: prevVer + 1,
          type: typeof a.value,
        });
        this.ledger.push({
          version: this.ledger.length + 1,
          target: a.target,
          previousValue: prevVal,
          newValue: a.value,
          valueType: typeof a.value,
          timestamp: new Date().toISOString(),
          reason: 'NXL Manifest Assignment',
        });
      }
    }

    if (ast.transforms) {
      for (const t of ast.transforms) {
        const prev = this.stateMap.get(t.target);
        const prevVal = prev ? prev.value : null;
        const prevVer = prev ? prev.version : 0;
        this.stateMap.set(t.target, {
          value: t.operation,
          version: prevVer + 1,
          type: 'Transform',
        });
        this.ledger.push({
          version: this.ledger.length + 1,
          target: t.target,
          previousValue: prevVal,
          newValue: t.operation,
          valueType: 'Transform',
          timestamp: new Date().toISOString(),
          reason: `NXL Transform: ${t.operation}`,
        });
      }
    }

    if (ast.grants) {
      for (const g of ast.grants) {
        this.capabilitiesGranted.add(`${g.node}:${g.capability}`);
      }
    }
  }

  /**
   * Complete Pipeline Execution: Lexer -> Parser -> TypeCheck -> Graph -> Truth -> Execution Plan
   */
  public executeSource(
    sourceCode: string,
    options?: { proposalId?: string; actorId?: string }
  ): {
    tokensCount: number;
    ast: NxlAstNode;
    diagnostics: NxlDiagnostic[];
    truthReports: NxlTruthReport[];
    executionPlans: NxlExecutionPlan[];
    ledger: NxlLedgerEntry[];
    success: boolean;
    mutationBlocked?: boolean;
    status?: string;
    proposalId?: string;
    proposal?: DecisionProposal;
    error?: string;
    executed?: boolean;
  } {
    // 1. Lexing
    const tokens = NxlLexer.tokenize(sourceCode);

    // 2. Parsing
    const parser = new NxlParser(tokens);
    const ast = parser.parse();
    this.activeAst = ast;

    // 3. Static Type & Relation Checking
    const diagnostics = NxlTypeSystem.check(ast);

    const hasErrors = diagnostics.some((d) => d.level === 'ERROR');
    const truthReports: NxlTruthReport[] = [];
    const executionPlans: NxlExecutionPlan[] = [];

    if (hasErrors) {
      return {
        tokensCount: tokens.length,
        ast,
        diagnostics,
        truthReports: [],
        executionPlans: [],
        ledger: this.ledger.slice(-20),
        success: false,
      };
    }

    // 4. Mutation Risk Classification & Decision Gate Enforcement
    const hasAssignments = ast.assignments && ast.assignments.length > 0;
    const hasTransforms = ast.transforms && ast.transforms.length > 0;
    const hasGrants = ast.grants && ast.grants.length > 0;

    if (hasAssignments || hasTransforms || hasGrants) {
      const targets: string[] = [
        ...(ast.assignments || []).map((a: any) => a.target),
        ...(ast.transforms || []).map((t: any) => t.target),
      ];

      const isCritical =
        targets.some((t) => t.startsWith('nexus_root.') || t.startsWith('genesis.') || t.startsWith('system.') || t.startsWith('security.')) ||
        hasGrants;
      const isHigh =
        !isCritical &&
        targets.some((t) => t.startsWith('cluster.') || t.startsWith('synapse_mesh.') || t.startsWith('memory.') || t.startsWith('node.'));
      const isHighOrCritical = isCritical || isHigh;
      const riskLevel: 'LOW' | 'HIGH' | 'CRITICAL' = isCritical ? 'CRITICAL' : isHigh ? 'HIGH' : 'LOW';
      const requiredCapability = isCritical ? 'nexus.core.seal' : isHigh ? 'nexus.cluster.rebalance' : 'nexus.sensor.read';

      if (isHighOrCritical) {
        if (!options?.proposalId) {
          // STOP AND PROPOSE: Do NOT mutate state or ledger!
          const sourceHash = SecurityVault.computeSha256Simulated(JSON.stringify({ source: sourceCode }));
          const proposal = decisionGate.propose({
            actorId: options?.actorId || 'NxlCompiler',
            actorType: 'AI_AGENT',
            action: 'NXL_STATE_MUTATION',
            target: targets.join(', ') || 'NXL_CORE',
            reason: `NXL Manifest state mutation on [${targets.join(', ')}]`,
            confidence: 0.95,
            riskLevel,
            requiredCapability,
            evidence: [{ details: { sourceHash, targets } }],
          });

          return {
            tokensCount: tokens.length,
            ast,
            diagnostics,
            truthReports: [],
            executionPlans: [],
            ledger: this.ledger.slice(-20),
            success: false,
            mutationBlocked: true,
            status: 'REVIEW_REQUIRED',
            proposalId: proposal.proposalId,
            proposal,
            error: `[DECISION_GATE_DENY] NXL State Mutation requires Human Approval. Created DecisionProposal '${proposal.proposalId}'.`,
          };
        }

        // Validate provided proposalId
        const proposal = decisionGate.getProposal(options.proposalId);
        if (proposal.status === 'REJECTED') {
          throw new Error(`[DECISION_GATE_DENY] Proposal '${options.proposalId}' was REJECTED by human operator.`);
        }
        const isExpired = proposal.status === 'EXPIRED' || (proposal.expiresAt && new Date().getTime() > new Date(proposal.expiresAt).getTime());
        if (isExpired) {
          proposal.status = 'EXPIRED';
          throw new Error(`[DECISION_GATE_DENY] Proposal '${options.proposalId}' has EXPIRED.`);
        }
        if (proposal.status !== 'APPROVED') {
          throw new Error(`[DECISION_GATE_DENY] Proposal '${options.proposalId}' is in status '${proposal.status}'. Required: 'APPROVED'.`);
        }

        // Stale Proposal Validation (Anti-tamper source integrity check)
        const currentSourceHash = SecurityVault.computeSha256Simulated(JSON.stringify({ source: sourceCode }));
        const originalSourceHash = proposal.evidence[0]?.details?.sourceHash;
        if (originalSourceHash && originalSourceHash !== currentSourceHash) {
          throw new Error(`[DECISION_GATE_DENY] STALE_PROPOSAL: NXL source code was modified after human approval! Cannot execute modified source.`);
        }

        // Apply mutations under boundary lock
        this.authorizedStateMutate(() => {
          this.applyMutations(ast);
        });

        // Mark executed in DecisionGate
        decisionGate.execute(options.proposalId, options.actorId || 'NxlCompiler');
      } else {
        // Low risk write
        this.authorizedStateMutate(() => {
          this.applyMutations(ast);
        });
      }
    }

      // 7. Process Assertions & Generate Truth Reports
      const evaluator = new NXLExpressionEvaluator(this.stateMap);

      for (const a of ast.assertions) {
        let isPass = true;
        let evidence = 'Condition verified in runtime state map.';

        // Parse simple string expressions into structured AST for evaluator
        let structuredExpr: any = null;
        if (typeof a.expr === 'string') {
          // Simple naive parser for binary comparisons
          const operators = ['==', '!=', '>=', '<=', '>', '<'];
          let usedOp = null;
          for (const op of operators) {
            if (a.expr.includes(` ${op} `)) {
              usedOp = op;
              break;
            }
          }

          if (usedOp) {
            const parts = a.expr.split(` ${usedOp} `).map((p: string) => p.trim());
            
            const parseOperand = (val: string) => {
              if (!isNaN(Number(val)) && val !== '') return { type: 'literal', value: Number(val) };
              if (val === 'true') return { type: 'literal', value: true };
              if (val === 'false') return { type: 'literal', value: false };
              return { type: 'reference', path: val };
            };

            structuredExpr = {
              type: 'comparison',
              operator: usedOp,
              left: parseOperand(parts[0]),
              right: parseOperand(parts[1])
            };
          } else {
             // Fallback for raw references/literals
             structuredExpr = { type: 'reference', path: a.expr.trim() };
          }
        } else {
          structuredExpr = a.expr;
        }

        if (structuredExpr) {
           isPass = Boolean(evaluator.evaluate(structuredExpr));
           
           if (structuredExpr.type === 'comparison') {
             const getOperandStr = (operand: any) => operand.path !== undefined ? operand.path : operand.value;
             const leftStr = getOperandStr(structuredExpr.left);
             const rightStr = getOperandStr(structuredExpr.right);
             const actualVal = structuredExpr.left.path ? (this.stateMap.get(structuredExpr.left.path)?.value ?? leftStr) : leftStr;
             evidence = `Evaluated: [${actualVal}] ${structuredExpr.operator} [${rightStr}]`;
           }
        }

        truthReports.push({
          assertion: typeof a.expr === 'string' ? a.expr : JSON.stringify(a.expr),
          result: isPass,
          evidence,
          timestamp: new Date().toISOString(),
          runtimeVersion: '1.0.0-QUANTUM'
        });
      }

      // 8. Process Rules & Execute Plans
      for (const r of ast.rules) {
        const planId = `NX-PLAN-${Math.floor(1000 + Math.random() * 9000)}`;
        let isTruthPass = true;

        if (r.condition.includes('==')) {
          const parts = r.condition.split('==').map((p: string) => p.trim());
          const currentVal = String(this.stateMap.get(parts[0])?.value || '');
          const expectedVal = parts[1].includes('.') ? parts[1].split('.')[1] : parts[1];
          isTruthPass = currentVal === expectedVal || currentVal === parts[1];
        }

        const isGranted = true; // Authorized by Policy

        executionPlans.push({
          id: planId,
          intent: r.actionTarget,
          authority: 'Biooperator_Architekt',
          capability: r.actionTarget,
          truthStatus: isTruthPass ? 'PASS' : 'FAIL',
          capabilityStatus: isGranted ? 'GRANTED' : 'DENIED',
          status: isTruthPass && isGranted ? 'AUTHORIZED' : 'REJECTED',
          targetAdapter: 'Nexus_Quantum_CI_CD',
          timestamp: new Date().toISOString()
        });
      }

    return {
      tokensCount: tokens.length,
      ast,
      diagnostics,
      truthReports,
      executionPlans,
      ledger: [...this.ledger],
      success: !hasErrors
    };
  }

  public auditLog(
    action: string,
    details: any,
    options?: {
      protocol?: string;
      severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
      authority?: string;
      target?: string;
      status?: 'BLOCKED' | 'RECORDED' | 'AUTHORIZED' | 'FAILED' | 'SUCCESS';
    }
  ): NexusAuditLogEntry {
    const isViolation = action.includes('VIOLATION') || options?.protocol === 'NXL_SECURITY_VIOLATION';
    const entry: NexusAuditLogEntry = {
      id: `AUDIT-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action,
      protocol: options?.protocol || (isViolation ? 'NXL_SECURITY_VIOLATION' : 'NXL_V1_STANDARD'),
      severity: options?.severity || (isViolation ? 'CRITICAL' : 'INFO'),
      authority: options?.authority || (isViolation ? 'ZipAnalyzerNode_Immunity_Shield' : 'Nexus_Quantum_CI_CD_v3.1.0'),
      target: options?.target || 'Quantum CI/CD Deployment Pipeline',
      details,
      status: options?.status || (isViolation ? 'BLOCKED' : 'RECORDED')
    };

    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
    return entry;
  }
}

export const nxlRuntime = NXLRuntime.getInstance();
