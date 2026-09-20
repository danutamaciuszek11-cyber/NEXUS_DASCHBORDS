// NXL v1.0 Access Manager & Policy Decision Point (PDP)
import { NxlGraph } from './graph';
import { ManifestAstNode } from './parser';

export interface PolicyEvaluationResult {
  granted: boolean;
  effect: 'PERMIT' | 'DENY';
  matchedPolicy?: string;
  reason: string;
}

export class AccessManager {
  static evaluate(nodeId: string, capability: string, graph: NxlGraph, ast?: ManifestAstNode): PolicyEvaluationResult {
    // 1. Check explicit Deny policies in AST
    if (ast && ast.policies) {
      for (const pol of ast.policies) {
        if (pol.node === nodeId && pol.capability === capability) {
          if (pol.effect === 'deny') {
            return {
              granted: false,
              effect: 'DENY',
              matchedPolicy: pol.id,
              reason: `Explicit DENY policy '${pol.id}' blocks node '${nodeId}' from '${capability}'.`,
            };
          }
          if (pol.effect === 'permit') {
            return {
              granted: true,
              effect: 'PERMIT',
              matchedPolicy: pol.id,
              reason: `Explicit PERMIT policy '${pol.id}' granted node '${nodeId}' capability '${capability}'.`,
            };
          }
        }
      }
    }

    // 2. Check Graph capability grants
    const hasCap = graph.hasCapability(nodeId, capability);
    if (hasCap) {
      return {
        granted: true,
        effect: 'PERMIT',
        reason: `Capability '${capability}' directly granted to node '${nodeId}'.`,
      };
    }

    // Default Deny
    return {
      granted: false,
      effect: 'DENY',
      reason: `Default DENY: Node '${nodeId}' does not possess capability '${capability}'.`,
    };
  }
}
