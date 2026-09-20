// NXL v1.0 Parser - AST Construction Engine
import { Token } from './lexer';

export interface AstNode {
  type: string;
  [key: string]: any;
}

export interface ManifestAstNode extends AstNode {
  type: 'manifest';
  defines: string[];
  nodes: { id: string; identity?: string; signature?: string }[];
  relations: { source: string; target: string; bidirectional: boolean; type?: string }[];
  states: { path: string; valueType: string; initialValue?: any }[];
  assignments: { target: string; value: any }[];
  capabilities: { id: string; description?: string }[];
  grants: { node: string; capability: string }[];
  policies: { id: string; effect: 'permit' | 'deny'; node: string; capability: string }[];
  assertions: { expr: string }[];
}

export class NxlParser {
  static parse(tokens: Token[]): ManifestAstNode {
    const ast: ManifestAstNode = {
      type: 'manifest',
      defines: [],
      nodes: [],
      relations: [],
      states: [],
      assignments: [],
      capabilities: [],
      grants: [],
      policies: [],
      assertions: [],
    };

    let i = 0;

    while (i < tokens.length) {
      const token = tokens[i];

      if (token.type === 'KEYWORD') {
        switch (token.value) {
          case 'define': {
            if (i + 1 < tokens.length && tokens[i + 1].type === 'IDENTIFIER') {
              ast.defines.push(tokens[i + 1].value);
              i += 2;
            } else {
              i++;
            }
            break;
          }
          case 'node': {
            // node NodeName : IDENTITY(identity_string) SIGNATURE(sig)
            if (i + 1 < tokens.length && tokens[i + 1].type === 'IDENTIFIER') {
              const nodeObj: { id: string; identity?: string; signature?: string } = {
                id: tokens[i + 1].value,
              };
              i += 2;
              while (i < tokens.length && tokens[i].value !== 'node' && tokens[i].value !== 'relate' && tokens[i].value !== 'state' && tokens[i].value !== 'set' && tokens[i].value !== 'grant' && tokens[i].value !== 'policy' && tokens[i].value !== 'assert' && tokens[i].value !== 'capability') {
                if (tokens[i].type === 'IDENTIFIER' && tokens[i].value === 'IDENTITY' && i + 2 < tokens.length && tokens[i + 1].value === '(') {
                  nodeObj.identity = tokens[i + 2].value;
                  i += 4; // IDENTITY ( val )
                } else if (tokens[i].type === 'IDENTIFIER' && tokens[i].value === 'SIGNATURE' && i + 2 < tokens.length && tokens[i + 1].value === '(') {
                  nodeObj.signature = tokens[i + 2].value;
                  i += 4;
                } else if (tokens[i].value === ':') {
                  i++;
                } else {
                  break;
                }
              }
              ast.nodes.push(nodeObj);
            } else {
              i++;
            }
            break;
          }
          case 'relate': {
            // relate NodeA -> NodeB OR relate NodeA <-> NodeB
            if (i + 3 < tokens.length && tokens[i + 1].type === 'IDENTIFIER') {
              const source = tokens[i + 1].value;
              const op = tokens[i + 2].value;
              const target = tokens[i + 3].value;
              ast.relations.push({
                source,
                target,
                bidirectional: op === '<->',
                type: 'DIRECT_SYNAPSE',
              });
              i += 4;
            } else {
              i++;
            }
            break;
          }
          case 'state': {
            // state path.name : Type = InitialVal
            if (i + 3 < tokens.length && (tokens[i + 1].type === 'IDENTIFIER' || tokens[i + 1].type === 'STRING')) {
              const pathStr = tokens[i + 1].value;
              let valueType = 'String';
              let initialVal: any = null;

              if (tokens[i + 2].value === ':') {
                valueType = tokens[i + 3].value;
                i += 4;
                if (i < tokens.length && tokens[i].value === '=') {
                  initialVal = tokens[i + 1]?.value;
                  i += 2;
                }
              } else {
                i += 2;
              }
              ast.states.push({ path: pathStr, valueType, initialValue: initialVal });
            } else {
              i++;
            }
            break;
          }
          case 'set': {
            // set path = value
            if (i + 3 < tokens.length && tokens[i + 1].type === 'IDENTIFIER' && tokens[i + 2].value === '=') {
              const target = tokens[i + 1].value;
              const valToken = tokens[i + 3];
              ast.assignments.push({
                target,
                value: valToken.value,
              });
              i += 4;
            } else {
              i++;
            }
            break;
          }
          case 'capability': {
            // capability ai.synthesize
            if (i + 1 < tokens.length) {
              ast.capabilities.push({ id: tokens[i + 1].value });
              i += 2;
            } else {
              i++;
            }
            break;
          }
          case 'grant': {
            // grant NodeName -> capability_name
            if (i + 3 < tokens.length && tokens[i + 2].value === '->') {
              ast.grants.push({
                node: tokens[i + 1].value,
                capability: tokens[i + 3].value,
              });
              i += 4;
            } else {
              i++;
            }
            break;
          }
          case 'policy': {
            // policy policy_name { permit / deny Node -> capability }
            if (i + 1 < tokens.length) {
              const policyId = tokens[i + 1].value;
              i += 2;
              let effect: 'permit' | 'deny' = 'permit';
              let node = '';
              let capability = '';

              while (i < tokens.length && tokens[i].value !== '}') {
                if (tokens[i].value === 'permit' || tokens[i].value === 'deny') {
                  effect = tokens[i].value as any;
                  if (i + 3 < tokens.length) {
                    node = tokens[i + 1].value;
                    capability = tokens[i + 3].value;
                    i += 4;
                  } else {
                    i++;
                  }
                } else {
                  i++;
                }
              }
              if (tokens[i]?.value === '}') i++;
              ast.policies.push({ id: policyId, effect, node, capability });
            } else {
              i++;
            }
            break;
          }
          case 'assert': {
            // assert expression
            let exprStr = '';
            i++;
            while (i < tokens.length && tokens[i].line === tokens[i - 1].line) {
              exprStr += (exprStr ? ' ' : '') + tokens[i].value;
              i++;
            }
            if (exprStr) {
              ast.assertions.push({ expr: exprStr });
            }
            break;
          }
          default:
            i++;
            break;
        }
      } else {
        i++;
      }
    }

    return ast;
  }
}
