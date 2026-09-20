// NXL v1.0 Lexer - Tokenizer with Line & Column Tracking
import { NxlToken } from '../../types';

export const KEYWORDS = [
  'define', 'node', 'relate', 'state', 'enum', 'set', 'when',
  'emit', 'transform', 'from', 'to', 'execute', 'capability',
  'grant', 'policy', 'permit', 'deny', 'restrict', 'assert',
  'import', 'as', 'export', 'module', 'at', 'only_if'
];

export class NxlLexer {
  static tokenize(source: string): NxlToken[] {
    const tokens: NxlToken[] = [];
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

        // Skip comments starting with #
        if (char === '#') {
          break; // Rest of line is comment
        }

        // Multi-char operators
        if (col + 2 <= line.length) {
          const threeChar = line.slice(col, col + 3);
          if (threeChar === '<->') {
            tokens.push({ type: 'OPERATOR', value: '<->', line: lineIdx + 1, column: col + 1 });
            col += 3;
            continue;
          }
        }

        if (col + 1 <= line.length) {
          const twoChar = line.slice(col, col + 2);
          if (['->', '==', '!=', '>=', '<='].includes(twoChar)) {
            tokens.push({ type: 'OPERATOR', value: twoChar, line: lineIdx + 1, column: col + 1 });
            col += 2;
            continue;
          }
        }

        // Single-char punctuation / operators
        if ([':', '=', '>', '<', '{', '}', '(', ')', '.', ',', '+', '-', '*', '/'].includes(char)) {
          tokens.push({ type: 'PUNCT', value: char, line: lineIdx + 1, column: col + 1 });
          col++;
          continue;
        }

        // String Literals "..."
        if (char === '"' || char === "'") {
          const quote = char;
          let strVal = '';
          const startCol = col + 1;
          col++;
          while (col < line.length && line[col] !== quote) {
            strVal += line[col];
            col++;
          }
          col++; // Skip closing quote
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

          if (KEYWORDS.includes(idStr.toLowerCase())) {
            tokens.push({ type: 'KEYWORD', value: idStr.toLowerCase(), line: lineIdx + 1, column: startCol });
          } else if (['AND', 'OR', 'NOT'].includes(idStr.toUpperCase())) {
            tokens.push({ type: 'OPERATOR', value: idStr.toUpperCase(), line: lineIdx + 1, column: startCol });
          } else if (['true', 'false'].includes(idStr.toLowerCase())) {
            tokens.push({ type: 'BOOLEAN', value: idStr.toLowerCase(), line: lineIdx + 1, column: startCol });
          } else {
            tokens.push({ type: 'IDENTIFIER', value: idStr, line: lineIdx + 1, column: startCol });
          }
          continue;
        }

        // Unknown character fallback
        col++;
      }
    }

    return tokens;
  }
}
