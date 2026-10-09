// NXL v1.0 Graph Integrity Validator & Cycle Detector
import { ManifestAstNode } from './parser';

export interface ValidationIssue {
  type: 'ERROR' | 'WARNING';
  code: string;
  message: string;
}

export class NxlValidator {
  static validate(ast: ManifestAstNode): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const nodeIds = new Set(ast.nodes.map((n) => n.id));

    // 1. Check relations for non-existent nodes
    for (const rel of ast.relations) {
      if (!nodeIds.has(rel.source)) {
        issues.push({
          type: 'ERROR',
          code: 'UNDEFINED_NODE',
          message: `Relation references non-existent source node '${rel.source}'.`,
        });
      }
      if (!nodeIds.has(rel.target)) {
        issues.push({
          type: 'ERROR',
          code: 'UNDEFINED_NODE',
          message: `Relation references non-existent target node '${rel.target}'.`,
        });
      }
    }

    // 2. Check for self-referential or circular relation loops
    const adj = new Map<string, string[]>();
    for (const id of nodeIds) adj.set(id, []);
    for (const rel of ast.relations) {
      if (adj.has(rel.source)) {
        adj.get(rel.source)!.push(rel.target);
      }
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();

    const hasCycle = (u: string): boolean => {
      visited.add(u);
      recStack.add(u);

      const neighbors = adj.get(u) || [];
      for (const v of neighbors) {
        if (!visited.has(v)) {
          if (hasCycle(v)) return true;
        } else if (recStack.has(v)) {
          return true;
        }
      }

      recStack.delete(u);
      return false;
    };

    for (const id of nodeIds) {
      if (!visited.has(id)) {
        if (hasCycle(id)) {
          issues.push({
            type: 'WARNING',
            code: 'CIRCULAR_GRAPH_LOOP',
            message: `Circular dependency loop detected starting at node '${id}'.`,
          });
          break;
        }
      }
    }

    // 3. Check grants reference existing nodes
    for (const grant of ast.grants) {
      if (!nodeIds.has(grant.node)) {
        issues.push({
          type: 'ERROR',
          code: 'UNBOUND_GRANT',
          message: `Capability grant target '${grant.node}' does not exist as a defined node.`,
        });
      }
    }

    return issues;
  }
}
