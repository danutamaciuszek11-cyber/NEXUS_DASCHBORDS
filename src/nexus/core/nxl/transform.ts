// NXL v1.0 State Mutation & Transform Engine with Ledger Tracking
import { NxlGraph } from './graph';
import { NxlTypeSystem } from './type-system';

export interface StateTransformRecord {
  target: string;
  previousValue: any;
  newValue: any;
  valueType: string;
  timestamp: string;
  success: boolean;
  reason: string;
}

export class NxlTransform {
  static mutateState(targetPath: string, newValue: any, valueType: string, graph: NxlGraph): StateTransformRecord {
    const prevVal = graph.getState(targetPath) ?? null;

    // Validate type
    const typeCheck = NxlTypeSystem.validateAssignment(valueType, newValue);
    if (!typeCheck.valid) {
      return {
        target: targetPath,
        previousValue: prevVal,
        newValue: null,
        valueType,
        timestamp: new Date().toISOString(),
        success: false,
        reason: typeCheck.errorMessage || 'Type validation failed.',
      };
    }

    // Apply state mutation
    graph.setState(targetPath, newValue);

    return {
      target: targetPath,
      previousValue: prevVal,
      newValue,
      valueType,
      timestamp: new Date().toISOString(),
      success: true,
      reason: 'State mutation applied cleanly in Intention Graph.',
    };
  }
}
