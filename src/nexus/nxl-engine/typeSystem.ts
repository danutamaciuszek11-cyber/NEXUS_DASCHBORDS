// NXL v1.0 Type System & Static Evaluator
import { NxlAstNode, NxlDiagnostic } from '../../types';

export class NxlTypeSystem {
  public static check(ast: NxlAstNode): NxlDiagnostic[] {
    const diagnostics: NxlDiagnostic[] = [];
    const declaredTypes = new Map<string, string>(); // statePath -> TypeName
    const declaredEnums = new Map<string, string[]>(); // EnumName -> Members

    // 1. Register Enums
    for (const e of ast.enums) {
      if (declaredEnums.has(e.name)) {
        diagnostics.push({
          level: 'ERROR',
          message: `Duplicate Enum declaration: '${e.name}'`,
          hint: 'Enum names must be unique across the manifest scope.'
        });
      } else {
        declaredEnums.set(e.name, e.members);
      }
    }

    // 2. Register State Types
    for (const s of ast.states) {
      declaredTypes.set(s.path, s.valueType);
    }

    // 3. Validate Assignments (set state = value)
    for (const assign of ast.assignments) {
      if (!declaredTypes.has(assign.target)) {
        diagnostics.push({
          level: 'WARNING',
          message: `Implicit state declaration for '${assign.target}'`,
          hint: `Explicitly declare type: 'state ${assign.target} : Type'`
        });
        continue;
      }

      const expectedType = declaredTypes.get(assign.target)!;
      const rawVal = assign.value;

      if (expectedType === 'Number' && isNaN(Number(rawVal))) {
        diagnostics.push({
          level: 'ERROR',
          message: `Type Mismatch on '${assign.target}': Expected Number, got '${rawVal}'`,
          hint: `Number values must be numeric literals.`
        });
      } else if (expectedType === 'Boolean' && !['true', 'false'].includes(rawVal)) {
        diagnostics.push({
          level: 'ERROR',
          message: `Type Mismatch on '${assign.target}': Expected Boolean, got '${rawVal}'`,
          hint: `Boolean values must be 'true' or 'false'.`
        });
      } else if (declaredEnums.has(expectedType)) {
        // Check Enum value, e.g. "BellasStatus.SECURE" or "SECURE"
        const members = declaredEnums.get(expectedType)!;
        const cleanVal = rawVal.includes('.') ? rawVal.split('.')[1] : rawVal;
        if (!members.includes(cleanVal)) {
          diagnostics.push({
            level: 'ERROR',
            message: `Invalid Enum member '${rawVal}' for Enum '${expectedType}'`,
            hint: `Allowed members for ${expectedType}: [${members.join(', ')}]`
          });
        }
      }
    }

    // 4. Validate Node References in Relations
    const declaredNodeIds = new Set(ast.nodes.map((n: any) => n.id));
    for (const rel of ast.relations) {
      if (!declaredNodeIds.has(rel.from)) {
        diagnostics.push({
          level: 'ERROR',
          message: `Unknown target node in relation: '${rel.from}'`,
          hint: `Declare node '${rel.from}' before using in 'relate ${rel.from} -> ${rel.to}'`
        });
      }
      if (!declaredNodeIds.has(rel.to)) {
        diagnostics.push({
          level: 'ERROR',
          message: `Unknown target node in relation: '${rel.to}'`,
          hint: `Declare node '${rel.to}' before using in 'relate ${rel.from} -> ${rel.to}'`
        });
      }
    }

    return diagnostics;
  }
}
