/**
 * NXL EXPRESSION EVALUATOR v1.0
 * Rozwiązuje wyrażenia arytmetyczne, logiczne i referencje stanowe.
 */
export class NXLExpressionEvaluator {
  private stateMap: Map<string, any>;

  constructor(stateMap: Map<string, any> = new Map()) {
    this.stateMap = stateMap;
  }

  public evaluate(expr: any): any {
    if (!expr) return null;

    if (expr.type === 'literal') {
      return expr.value;
    }

    if (expr.type === 'reference') {
      if (this.stateMap.has(expr.path)) {
        const stateNode = this.stateMap.get(expr.path);
        // If stateMap stores object like { value: any, version: number, type: string }
        if (stateNode && typeof stateNode === 'object' && 'value' in stateNode) {
          return stateNode.value;
        }
        return stateNode;
      }
      // Jeśli to referencja do Enuma (np. Signal.ACTIVE)
      if (expr.path.includes('.')) {
        const parts = expr.path.split('.');
        return parts[parts.length - 1];
      }
      return expr.path;
    }

    if (expr.type === 'comparison') {
      const left = this.evaluate(expr.left);
      const right = this.evaluate(expr.right);

      switch (expr.operator) {
        case '==': return left === right;
        case '!=': return left !== right;
        case '>': return Number(left) > Number(right);
        case '<': return Number(left) < Number(right);
        case '>=': return Number(left) >= Number(right);
        case '<=': return Number(left) <= Number(right);
        default: return false;
      }
    }

    if (expr.type === 'binaryExpression') {
      const left = this.evaluate(expr.left);
      const right = this.evaluate(expr.right);

      switch (expr.operator) {
        case 'AND': return Boolean(left) && Boolean(right);
        case 'OR': return Boolean(left) || Boolean(right);
        case '+': return Number(left) + Number(right);
        case '-': return Number(left) - Number(right);
        case '*': return Number(left) * Number(right);
        case '/': return Number(right) !== 0 ? Number(left) / Number(right) : 0;
        default: return null;
      }
    }

    return null;
  }
}
