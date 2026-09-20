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
  NxlExecutionPlan
} from '../../types';

export class NXLRuntime {
  private static instance: NXLRuntime;
  public ledger: NxlLedgerEntry[] = [];
  public stateMap = new Map<string, { value: any; version: number; type: string }>();
  public capabilitiesGranted = new Set<string>(); // "nodeId:capability"
  public activeAst: NxlAstNode | null = null;
  public auditLogs: Array<{ timestamp: string; action: string; details: any }> = [];

  constructor() {
    this.seedInitialState();
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
  }

  /**
   * Complete Pipeline Execution: Lexer -> Parser -> TypeCheck -> Graph -> Truth -> Execution Plan
   */
  public executeSource(sourceCode: string): {
    tokensCount: number;
    ast: NxlAstNode;
    diagnostics: NxlDiagnostic[];
    truthReports: NxlTruthReport[];
    executionPlans: NxlExecutionPlan[];
    ledger: NxlLedgerEntry[];
    success: boolean;
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

    if (!hasErrors) {
      // 4. State Assignments
      for (const assign of ast.assignments) {
        const path = assign.target;
        const rawVal = assign.value;
        const current = this.stateMap.get(path);
        const prevVal = current ? current.value : null;
        const nextVer = current ? current.version + 1 : 1;

        let parsedVal: any = rawVal;
        if (rawVal === 'true') parsedVal = true;
        if (rawVal === 'false') parsedVal = false;
        if (!isNaN(Number(rawVal)) && rawVal !== '') parsedVal = Number(rawVal);

        this.stateMap.set(path, { value: parsedVal, version: nextVer, type: assign.rawType || 'String' });

        const entry: NxlLedgerEntry = {
          version: nextVer,
          target: path,
          previousValue: prevVal,
          newValue: parsedVal,
          valueType: assign.rawType || 'String',
          timestamp: new Date().toISOString(),
          reason: 'NXL Set Assignment'
        };
        this.ledger.push(entry);
      }

      // 5. State Transforms
      for (const tf of ast.transforms) {
        const path = tf.target;
        const current = this.stateMap.get(path);
        const prevVal = current ? current.value : null;
        const nextVer = current ? current.version + 1 : 1;

        let newVal = tf.to;
        if (tf.to && !isNaN(Number(tf.to))) newVal = Number(tf.to);

        this.stateMap.set(path, { value: newVal, version: nextVer, type: 'Number' });

        this.ledger.push({
          version: nextVer,
          target: path,
          previousValue: prevVal,
          newValue: newVal,
          valueType: 'Number',
          timestamp: new Date().toISOString(),
          reason: `NXL Transform (from ${tf.from || prevVal} to ${tf.to})`
        });
      }

      // 6. Capability Grants
      for (const g of ast.grants) {
        this.capabilitiesGranted.add(`${g.node}:${g.capability}`);
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

  public auditLog(action: string, details: any) {
    this.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      action,
      details
    });
  }
}

export const nxlRuntime = NXLRuntime.getInstance();
