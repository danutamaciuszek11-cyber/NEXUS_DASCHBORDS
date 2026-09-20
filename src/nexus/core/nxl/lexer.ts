// NXL v1.0 Lexer - Atomic Tokenizer with Line & Column Tracking
export interface Token {
  type: 'KEYWORD' | 'IDENTIFIER' | 'NUMBER' | 'STRING' | 'OPERATOR' | 'PUNCT' | 'BOOLEAN';
  value: string;
  line: number;
  column: number;
}

export const KEYWORDS = [
  'node', 'relate', 'state', 'type', 'when', 'emit', 'transform',
  'execute', 'capability', 'grant', 'policy', 'identity', 'permit',
  'deny', 'assert', 'define', 'set', 'enum', 'from', 'to', 'restrict',
  'import', 'as', 'export', 'module', 'at', 'only_if'
];

export class NxlLexer {
  static tokenize(source: string): Token[] {
    const tokens: Token[] = [];
    const lines = source.split('\n');

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      let col = 0;

      while (col < line.length) {
        const char = line[col];

        // Skip whitespace
        if (/\s/.test(char)) {
          col++;
          continue;
        }

        // Skip comments starting with # or //
        if (char === '#' || (char === '/' && line[col + 1] === '/')) {
          break;
        }

        // Multi-char operators (<->, ->, ==, !=, >=, <=)
        if (col + 2 <= line.length && line.slice(col, col + 3) === '<->') {
          tokens.push({ type: 'OPERATOR', value: '<->', line: lineIdx + 1, column: col + 1 });
          col += 3;
          continue;
        }

        if (col + 1 <= line.length) {
          const twoChar = line.slice(col, col + 2);
          if (['->', '==', '!=', '>=', '<='].includes(twoChar)) {
            tokens.push({ type: 'OPERATOR', value: twoChar, line: lineIdx + 1, column: col + 1 });
            col += 2;
            continue;
          }
        }

        // Single-char punctuation & operators
        if ([':', '=', '>', '<', '{', '}', '(', ')', '.', ',', '+', '-', '*', '/'].includes(char)) {
          tokens.push({ type: 'PUNCT', value: char, line: lineIdx + 1, column: col + 1 });
          col++;
          continue;
        }

        // String Literals "..." or '...'
        if (char === '"' || char === "'") {
          const quote = char;
          let strVal = '';
          const startCol = col + 1;
          col++;
          while (col < line.length && line[col] !== quote) {
            if (line[col] === '\\' && col + 1 < line.length) {
              strVal += line[col + 1];
              col += 2;
            } else {
              strVal += line[col];
              col++;
            }
          }
          col++; // skip closing quote
          tokens.push({ type: 'STRING', value: strVal, line: lineIdx + 1, column: startCol });
          continue;
        }

        // Numbers
        if (/[0-9]/.test(char)) {
          let numStr = '';
          const startCol = col + 1;
          while (col < line.length && /[0-9\.]/.test(line[col])) {
            numStr += line[col];
            col++;
          }
          tokens.push({ type: 'NUMBER', value: numStr, line: lineIdx + 1, column: startCol });
          continue;
        }

        // Identifiers or Keywords
        if (/[a-zA-Z_]/.test(char)) {
          let idStr = '';
          const startCol = col + 1;
          while (col < line.length && /[a-zA-Z0-9_\-\.]/.test(line[col])) {
            idStr += line[col];
            col++;
          }

          const lower = idStr.toLowerCase();
          if (KEYWORDS.includes(lower)) {
            tokens.push({ type: 'KEYWORD', value: lower, line: lineIdx + 1, column: startCol });
          } else if (['AND', 'OR', 'NOT'].includes(idStr.toUpperCase())) {
            tokens.push({ type: 'OPERATOR', value: idStr.toUpperCase(), line: lineIdx + 1, column: startCol });
          } else if (['true', 'false'].includes(lower)) {
            tokens.push({ type: 'BOOLEAN', value: lower, line: lineIdx + 1, column: startCol });
          } else {
            tokens.push({ type: 'IDENTIFIER', value: idStr, line: lineIdx + 1, column: startCol });
          }
          continue;
        }

        col++;
      }
    }

    return tokens;
  }
}
