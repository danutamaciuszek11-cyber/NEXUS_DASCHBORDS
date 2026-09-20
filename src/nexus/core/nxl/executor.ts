// NXL v1.0 Execution Plan Generator & Dispatcher
import { ManifestAstNode } from './parser';
import { NxlExecutionPlan } from '../../../types';

export class NxlExecutor {
  static buildExecutionPlan(ast: ManifestAstNode, truthPassed: boolean): NxlExecutionPlan[] {
    const plans: NxlExecutionPlan[] = [];

    for (const grant of ast.grants) {
      plans.push({
        id: `EP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        intent: `Capability Grant Exec: ${grant.node} -> ${grant.capability}`,
        authority: grant.node,
        capability: grant.capability,
        truthStatus: truthPassed ? 'PASS' : 'FAIL',
        capabilityStatus: 'GRANTED',
        status: truthPassed ? 'DISPATCHED' : 'REJECTED',
        targetAdapter: grant.capability.startsWith('ai.') ? 'GEMINI_AI_ADAPTER' : 'SYNAPSE_MESH_DISPATCHER',
        timestamp: new Date().toISOString(),
      });
    }

    return plans;
  }
}
