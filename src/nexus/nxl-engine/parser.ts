// NXL v1.0 Parser - Constructs Abstract Syntax Tree (AST)
import { NxlToken, NxlAstNode, NxlDiagnostic } from '../../types';

export class NxlParser {
  private tokens: NxlToken[];
  private pos = 0;
  public diagnostics: NxlDiagnostic[] = [];

  constructor(tokens: NxlToken[]) {
    this.tokens = tokens;
  }

  private peek(): NxlToken | undefined {
    return this.tokens[this.pos];
  }

  private consume(): NxlToken | undefined {
    return this.tokens[this.pos++];
  }

  private matchKeyword(val: string): boolean {
    const tok = this.peek();
    return tok?.type === 'KEYWORD' && tok.value === val;
  }

  public parse(): NxlAstNode {
    const ast: NxlAstNode = {
      type: 'manifest',
      defines: [] as string[],
      nodes: [] as any[],
      relations: [] as any[],
      states: [] as any[],
      enums: [] as any[],
      assignments: [] as any[],
      rules: [] as any[],
      transforms: [] as any[],
      capabilities: [] as any[],
      grants: [] as any[],
      policies: [] as any[],
      assertions: [] as any[],
      imports: [] as any[],
    };

    while (this.pos < this.tokens.length) {
      const tok = this.peek();
      if (!tok) break;

      if (tok.type === 'KEYWORD') {
        switch (tok.value) {
          case 'define':
            this.consume(); // consume 'define'
            const defId = this.consume();
            if (defId) ast.defines.push(defId.value);
            break;

          case 'node':
            this.consume();
            const nodeId = this.consume()?.value || 'unknown';
            let identity: string | undefined;
            let signature: string | undefined;
            let protectedNode = false;

            // Check for identity binding : IDENTITY(...) or PROTECTED(...)
            if (this.peek()?.value === ':') {
              this.consume(); // ':'
              const tag = this.consume()?.value;
              if (tag === 'PROTECTED') {
                protectedNode = true;
              } else if (tag === 'IDENTITY' && this.peek()?.value === '(') {
                this.consume(); // '('
                identity = this.consume()?.value;
                if (this.peek()?.value === ',') this.consume();
                if (this.peek()?.value === 'SIGNATURE' && this.tokens[this.pos + 1]?.value === '(') {
                  this.consume(); // SIGNATURE
                  this.consume(); // (
                  signature = this.consume()?.value;
                  if (this.peek()?.value === ')') this.consume();
                }
                if (this.peek()?.value === ')') this.consume();
              }
            }

            // Check for 'at "location"'
            let location = 'local';
            if (this.matchKeyword('at')) {
              this.consume(); // 'at'
              location = this.consume()?.value || 'local';
            }

            ast.nodes.push({
              id: nodeId,
              identity,
              signature,
              protected: protectedNode,
              location
            });
            break;

          case 'relate':
            this.consume();
            const fromNode = this.consume()?.value;
            const opTok = this.consume(); // '->' or '<->'
            const toNode = this.consume()?.value;
            if (fromNode && opTok && toNode) {
              ast.relations.push({
                from: fromNode,
                to: toNode,
                operator: opTok.value,
                directed: opTok.value === '->'
              });
            }
            break;

          case 'state':
            this.consume();
            const statePath = this.consume()?.value;
            let typeName = 'String';
            if (this.peek()?.value === ':') {
              this.consume(); // ':'
              typeName = this.consume()?.value || 'String';
            }
            ast.states.push({ path: statePath, valueType: typeName });
            break;

          case 'enum':
            this.consume();
            const enumName = this.consume()?.value;
            const members: string[] = [];
            if (this.peek()?.value === '{') {
              this.consume(); // '{'
              while (this.peek() && this.peek()?.value !== '}') {
                const mem = this.consume();
                if (mem && mem.type === 'IDENTIFIER') members.push(mem.value);
                if (this.peek()?.value === ',') this.consume();
              }
              if (this.peek()?.value === '}') this.consume();
            }
            ast.enums.push({ name: enumName, members });
            break;

          case 'set':
            this.consume();
            const targetState = this.consume()?.value;
            if (this.peek()?.value === '=') this.consume();
            const valTok = this.consume();
            ast.assignments.push({
              target: targetState,
              value: valTok?.value,
              rawType: valTok?.type
            });
            break;

          case 'when':
            this.consume();
            // Collect condition tokens until 'emit' or 'execute'
            let condExpr = '';
            while (this.peek() && !['emit', 'execute'].includes(this.peek()?.value || '')) {
              condExpr += this.consume()?.value + ' ';
            }
            const actionType = this.peek()?.value;
            this.consume(); // 'emit' or 'execute'
            let actionTarget = '';
            while (this.peek() && this.peek()?.line === tok.line) {
              actionTarget += this.consume()?.value;
            }
            ast.rules.push({
              condition: condExpr.trim(),
              actionType,
              actionTarget: actionTarget.trim()
            });
            break;

          case 'transform':
            this.consume();
            const transformTarget = this.consume()?.value;
            let fromVal: any = null;
            let toVal: any = null;

            if (this.matchKeyword('from')) {
              this.consume();
              fromVal = this.consume()?.value;
            }
            if (this.matchKeyword('to')) {
              this.consume();
              // read rest of line for expression
              let exprStr = '';
              const lineNum = tok.line;
              while (this.peek() && this.peek()?.line === lineNum) {
                exprStr += this.consume()?.value + ' ';
              }
              toVal = exprStr.trim();
            }
            ast.transforms.push({
              target: transformTarget,
              from: fromVal,
              to: toVal
            });
            break;

          case 'capability':
            this.consume();
            const capId = this.consume()?.value;
            ast.capabilities.push({ id: capId });
            break;

          case 'grant':
            this.consume();
            const grantedNode = this.consume()?.value;
            if (this.peek()?.value === '->') this.consume();
            const grantedCap = this.consume()?.value;
            ast.grants.push({ node: grantedNode, capability: grantedCap });
            break;

          case 'policy':
            this.consume();
            const policyName = this.consume()?.value;
            const policyRules: any[] = [];
            if (this.peek()?.value === '{') {
              this.consume();
              while (this.peek() && this.peek()?.value !== '}') {
                const ruleTok = this.consume();
                if (ruleTok && ['permit', 'deny', 'restrict'].includes(ruleTok.value)) {
                  let ruleStr = ruleTok.value + ' ';
                  while (this.peek() && !['permit', 'deny', 'restrict', '}'].includes(this.peek()?.value || '')) {
                    ruleStr += this.consume()?.value + ' ';
                  }
                  policyRules.push(ruleStr.trim());
                }
              }
              if (this.peek()?.value === '}') this.consume();
            }
            ast.policies.push({ name: policyName, rules: policyRules });
            break;

          case 'assert':
            this.consume();
            let assertExpr = '';
            const aLine = tok.line;
            while (this.peek() && this.peek()?.line === aLine) {
              assertExpr += this.consume()?.value + ' ';
            }
            ast.assertions.push({ expr: assertExpr.trim() });
            break;

          case 'import':
            this.consume();
            const modName = this.consume()?.value;
            let alias = modName;
            if (this.matchKeyword('as')) {
              this.consume();
              alias = this.consume()?.value || modName;
            }
            ast.imports.push({ module: modName, alias });
            break;

          default:
            this.consume();
            break;
        }
      } else {
        this.consume();
      }
    }

    return ast;
  }
}
