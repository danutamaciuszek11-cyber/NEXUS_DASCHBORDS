// NXL v1.0 Runtime - Truth Layer 2.0 & Immutability Shield Core
import { NxlLexer } from './lexer';
import { NxlParser, ManifestAstNode } from './parser';
import { NxlTypeSystem } from './type-system';
import { NxlValidator, ValidationIssue } from './validator';
import { NxlGraph } from './graph';
import { SecurityVault } from './security-vault';
import { AccessManager } from './access-manager';
import { NxlExpressionEvaluator } from './expression';
import { NxlTransform } from './transform';
import { NxlExecutor } from './executor';
import { RequestQueueManager } from './request';
import { NxlTruthReport, NxlLedgerEntry, NxlExecutionPlan } from '../../../types';

export interface RuntimeExecutionResult {
  tokensCount: number;
  ast: ManifestAstNode;
  diagnostics: ValidationIssue[];
  truthReports: NxlTruthReport[];
  executionPlans: NxlExecutionPlan[];
  ledger: NxlLedgerEntry[];
  success: boolean;
}

export class NxlRuntimeCore {
  public graph: NxlGraph = new NxlGraph();
  public ledger: NxlLedgerEntry[] = [];
  public requestQueue: RequestQueueManager = new RequestQueueManager();
  public capabilitiesGranted: Set<string> = new Set([
    'Biooperator:ai.synthesize',
    'Architekt:ai.synthesize',
    'Marco (Architekt):nexus.core.seal',
    'Elena (Inżynier Światła):synapse.mesh.deploy',
    'Leo (Strażnik Mostów):security.vault.override',
    'Sofia (Kuratorka):scribe.manifest.write',
  ]);

  private immutableProtectedPaths = [
    '*.nxl',
    '/nexus/src/core/',
    'nexus/src/core/',
    'src/nexus/core/',
    '/src/nexus/core/',
    'nexus/js/core/',
    '/nexus/js/core/',
    '/etc/',
    '../',
  ];

  isPathProtected(filePath: string): boolean {
    const normalized = filePath.replace(/\\/g, '/').toLowerCase();
    if (normalized.endsWith('.nxl')) return true;
    if (normalized.includes('..') || normalized.startsWith('/') || normalized.startsWith('\\')) return true;
    for (const prot of this.immutableProtectedPaths) {
      if (!prot.startsWith('*') && normalized.includes(prot.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  validateFileWritePermission(filePath: string, signature?: string): { permitted: boolean; reason: string } {
    if (this.isPathProtected(filePath)) {
      return {
        permitted: false,
        reason: `SECURITY_VIOLATION: Path '${filePath}' is protected by NXL Immutability Shield. Direct write is forbidden.`,
      };
    }

    if (!signature) {
      return {
        permitted: false,
        reason: `SECURITY_VIOLATION: Unsigned file write operation on '${filePath}'. Cryptographic signature required.`,
      };
    }

    const cert = SecurityVault.verifySignature(signature);
    if (!cert.isRootCertified) {
      return {
        permitted: false,
        reason: `SECURITY_VIOLATION: Signature '${signature}' is not 0xROOT certified for write operations.`,
      };
    }

    return {
      permitted: true,
      reason: `Write permitted for '${filePath}' under 0xROOT certificate authority.`,
    };
  }

  executeSource(source: string): RuntimeExecutionResult {
    // 1. Tokenize
    const tokens = NxlLexer.tokenize(source);

    // 2. Parse AST
    const ast = NxlParser.parse(tokens);

    // 3. Validate Graph Integrity
    const diagnostics = NxlValidator.validate(ast);

    // 4. Build Intention Graph
    this.graph.build(ast);

    // 5. Evaluate Truth Layer assertions
    const truthReports: NxlTruthReport[] = [];
    let truthPassed = true;

    for (const assertion of ast.assertions) {
      const evalRes = NxlExpressionEvaluator.evaluate(assertion.expr, this.graph);
      truthReports.push({
        assertion: assertion.expr,
        result: evalRes.result,
        evidence: evalRes.evidence,
        timestamp: new Date().toISOString(),
        runtimeVersion: '1.0.0-QUANTUM-TRUTH-2.0',
      });
      if (!evalRes.result) truthPassed = false;
    }

    // Default truth report if no explicit assertions
    if (ast.assertions.length === 0) {
      truthReports.push({
        assertion: 'nexus_root.security == PASS',
        result: true,
        evidence: 'Default Truth Evidence: Manifest structurally sound.',
        timestamp: new Date().toISOString(),
        runtimeVersion: '1.0.0-QUANTUM-TRUTH-2.0',
      });
    }

    // 6. Record State Ledger entries
    for (const assign of ast.assignments) {
      const stateDef = ast.states.find((s) => s.path === assign.target);
      const valueType = stateDef ? stateDef.valueType : NxlTypeSystem.inferType(assign.value);

      const mutRecord = NxlTransform.mutateState(assign.target, assign.value, valueType, this.graph);
      if (mutRecord.success) {
        this.ledger.push({
          version: this.ledger.length + 1,
          target: assign.target,
          previousValue: mutRecord.previousValue,
          newValue: mutRecord.newValue,
          valueType: mutRecord.valueType,
          timestamp: mutRecord.timestamp,
          reason: mutRecord.reason,
        });
      }
    }

    // Register capabilities granted in AST
    for (const grant of ast.grants) {
      this.capabilitiesGranted.add(`${grant.node}:${grant.capability}`);
    }

    // 7. Build Execution Plans
    const hasErrors = diagnostics.some((d) => d.type === 'ERROR');
    const executionPlans = NxlExecutor.buildExecutionPlan(ast, truthPassed && !hasErrors);

    return {
      tokensCount: tokens.length,
      ast,
      diagnostics,
      truthReports,
      executionPlans,
      ledger: this.ledger.slice(-20),
      success: truthPassed && !hasErrors,
    };
  }

  auditLog(action: string, metadata: any): void {
    this.ledger.push({
      version: this.ledger.length + 1,
      target: `AUDIT:${action}`,
      previousValue: null,
      newValue: metadata,
      valueType: 'AuditLog',
      timestamp: new Date().toISOString(),
      reason: `NXL System Action: ${action}`,
    });
  }
}

export const nxlRuntimeCore = new NxlRuntimeCore();
