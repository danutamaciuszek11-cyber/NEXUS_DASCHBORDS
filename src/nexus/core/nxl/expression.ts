// NXL v1.0 Mathematical & Logical Expression Evaluator
import { NxlGraph } from './graph';

export interface EvaluationResult {
  result: boolean;
  leftValue: any;
  rightValue: any;
  evidence: string;
}

export class NxlExpressionEvaluator {
  static evaluate(exprStr: string, graph: NxlGraph): EvaluationResult {
    const trimmed = exprStr.trim();

    // Check operators: ==, !=, >=, <=, >, <
    const operators = ['==', '!=', '>=', '<=', '>', '<'];
    let op = '';
    let leftRaw = '';
    let rightRaw = '';

    for (const o of operators) {
      if (trimmed.includes(o)) {
        op = o;
        const parts = trimmed.split(o);
        leftRaw = parts[0].trim();
        rightRaw = parts[1].trim();
        break;
      }
    }

    if (!op) {
      // Boolean literal or single variable check
      const val = this.resolveValue(trimmed, graph);
      const boolRes = Boolean(val);
      return {
        result: boolRes,
        leftValue: val,
        rightValue: null,
        evidence: `Unary expression '${trimmed}' evaluated to ${boolRes}`,
      };
    }

    const leftVal = this.resolveValue(leftRaw, graph);
    const rightVal = this.resolveValue(rightRaw, graph);

    const cleanLeft = String(leftVal).replace(/^.*?\./, '');
    const cleanRight = String(rightVal).replace(/^.*?\./, '');

    let res = false;
    switch (op) {
      case '==':
        res = cleanLeft === cleanRight;
        break;
      case '!=':
        res = cleanLeft !== cleanRight;
        break;
      case '>=':
        res = Number(leftVal) >= Number(rightVal);
        break;
      case '<=':
        res = Number(leftVal) <= Number(rightVal);
        break;
      case '>':
        res = Number(leftVal) > Number(rightVal);
        break;
      case '<':
        res = Number(leftVal) < Number(rightVal);
        break;
    }

    return {
      result: res,
      leftValue: leftVal,
      rightValue: rightVal,
      evidence: `Expression [${exprStr}] evaluated: (${leftVal} ${op} ${rightVal}) => ${res}`,
    };
  }

  private static resolveValue(token: string, graph: NxlGraph): any {
    // 1. Check graph state first
    const graphState = graph.getState(token);
    if (graphState !== undefined) return graphState;

    // 2. Check if enum notation like BellasStatus.SECURE
    if (token.includes('.')) {
      const parts = token.split('.');
      return parts[1] || parts[0];
    }

    // 3. Clean quotes if string
    if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
      return token.slice(1, -1);
    }

    // 4. Number literal
    if (!isNaN(Number(token))) {
      return Number(token);
    }

    // 5. Boolean literal
    if (token === 'true') return true;
    if (token === 'false') return false;

    return token;
  }
}
