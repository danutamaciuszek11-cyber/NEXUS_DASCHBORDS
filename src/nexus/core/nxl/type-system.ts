// NXL v1.0 Type System - Static Type Checker & Anti-Implicit Conversion Engine

export type NxlPrimitiveType = 'Number' | 'String' | 'Boolean' | 'Enum' | 'Any';

export interface TypeDefinition {
  name: string;
  kind: NxlPrimitiveType;
  allowedValues?: string[];
}

export interface TypeCheckResult {
  valid: boolean;
  expectedType: string;
  actualType: string;
  errorMessage?: string;
}

export class NxlTypeSystem {
  private static registeredTypes: Map<string, TypeDefinition> = new Map([
    ['Number', { name: 'Number', kind: 'Number' }],
    ['String', { name: 'String', kind: 'String' }],
    ['Boolean', { name: 'Boolean', kind: 'Boolean' }],
    ['BellasStatus', { name: 'BellasStatus', kind: 'Enum', allowedValues: ['SECURE', 'ACTIVE', 'CONTEMPLATION', 'WARNING', 'RESTRICTED'] }],
    ['ClusterState', { name: 'ClusterState', kind: 'Enum', allowedValues: ['OPERATIONAL', 'STABLE', 'SYNCED', 'FAILOVER'] }],
    ['SecurityLevel', { name: 'SecurityLevel', kind: 'Enum', allowedValues: ['ROOT_IMMUTABLE', 'HIGH', 'EVALUATION', 'ISOLATED'] }],
  ]);

  static registerEnum(name: string, values: string[]): void {
    this.registeredTypes.set(name, {
      name,
      kind: 'Enum',
      allowedValues: values,
    });
  }

  static inferType(value: any): string {
    if (typeof value === 'boolean' || value === 'true' || value === 'false') return 'Boolean';
    if (typeof value === 'number' || (!isNaN(Number(value)) && String(value).trim() !== '')) return 'Number';
    if (typeof value === 'string') {
      // Check if matches known Enum
      for (const [typeName, def] of this.registeredTypes.entries()) {
        if (def.kind === 'Enum' && def.allowedValues?.includes(value)) {
          return typeName;
        }
      }
      return 'String';
    }
    return 'Any';
  }

  static validateAssignment(targetType: string, value: any): TypeCheckResult {
    const actualType = this.inferType(value);
    const expectedDef = this.registeredTypes.get(targetType);

    if (!expectedDef) {
      // Dynamic enum or fallback check
      if (actualType === 'String' || actualType === targetType) {
        return { valid: true, expectedType: targetType, actualType };
      }
    }

    if (expectedDef?.kind === 'Enum') {
      const strVal = String(value).replace(/^.*?\./, ''); // handle Enum.VALUE syntax
      if (expectedDef.allowedValues?.includes(strVal)) {
        return { valid: true, expectedType: targetType, actualType: expectedDef.name };
      }
      return {
        valid: false,
        expectedType: `${targetType} (${expectedDef.allowedValues?.join(' | ')})`,
        actualType: String(value),
        errorMessage: `Implicit type coercion rejected: Value '${value}' is not a valid member of Enum ${targetType}.`,
      };
    }

    if (targetType === 'Number' && actualType !== 'Number') {
      return {
        valid: false,
        expectedType: 'Number',
        actualType,
        errorMessage: `Implicit type coercion rejected: Cannot assign ${actualType} to strict Number.`,
      };
    }

    if (targetType === 'Boolean' && actualType !== 'Boolean') {
      return {
        valid: false,
        expectedType: 'Boolean',
        actualType,
        errorMessage: `Implicit type coercion rejected: Cannot assign ${actualType} to strict Boolean.`,
      };
    }

    return { valid: true, expectedType: targetType, actualType };
  }
}
