import fs from 'node:fs';

const decoder = new TextDecoder('windows-1250');

function decodeRtf(input) {
  let out = '';
  let i = 0;
  const dest = [1];
  while (i < input.length) {
    const c = input[i];
    if (c === '{') {
      dest.push(dest[dest.length - 1]);
      i++;
      continue;
    }
    if (c === '}') {
      dest.pop();
      if (dest.length === 0) dest.push(1);
      i++;
      continue;
    }
    if (c === '\\') {
      const next = input[i + 1];
      if (next === '\\' || next === '{' || next === '}') {
        if (dest[dest.length - 1]) out += next;
        i += 2;
        continue;
      }
      if (next === "'") {
        const hex = input.slice(i + 2, i + 4);
        if (dest[dest.length - 1] && /^[0-9a-fA-F]{2}$/.test(hex)) {
          out += decoder.decode(Buffer.from(hex, 'hex'));
        }
        i += 4;
        continue;
      }
      if (next === 'u' && (input[i + 2] === '-' || /\d/.test(input[i + 2] || ''))) {
        let j = i + 2;
        let sign = 1;
        if (input[j] === '-') {
          sign = -1;
          j++;
        }
        let num = '';
        while (j < input.length && /\d/.test(input[j])) {
          num += input[j];
          j++;
        }
        if (input[j] === '?' || input[j] === ' ') j++;
        if (dest[dest.length - 1] && num) {
          let code = sign * Number(num);
          if (code < 0) code += 65536;
          out += String.fromCharCode(code);
        }
        i = j;
        continue;
      }
      let j = i + 1;
      while (j < input.length && /[a-zA-Z]/.test(input[j])) j++;
      const word = input.slice(i + 1, j);
      if (input[j] === '-') j++;
      while (j < input.length && /\d/.test(input[j])) j++;
      if (input[j] === ' ') j++;
      const skip = new Set([
        'fonttbl',
        'colortbl',
        'stylesheet',
        'info',
        'pict',
        'object',
        'header',
        'footer',
        'headerf',
        'footerf',
        'xe',
        'tc',
        'nonshppict',
        'shppict',
      ]);
      if (word === '*') dest[dest.length - 1] = 0;
      else if (skip.has(word)) dest[dest.length - 1] = 0;
      else if (word === 'par' || word === 'line') {
        if (dest[dest.length - 1]) out += '\n';
      } else if (word === 'tab') {
        if (dest[dest.length - 1]) out += '\t';
      } else if (word === 'emdash') {
        if (dest[dest.length - 1]) out += '—';
      } else if (word === 'endash') {
        if (dest[dest.length - 1]) out += '–';
      } else if (word === 'lquote' || word === 'rquote') {
        if (dest[dest.length - 1]) out += "'";
      } else if (word === 'ldblquote' || word === 'rdblquote') {
        if (dest[dest.length - 1]) out += '"';
      } else if (word === 'bullet') {
        if (dest[dest.length - 1]) out += '•';
      }
      i = j;
      continue;
    }
    if (c === '\r' || c === '\n') {
      i++;
      continue;
    }
    if (dest[dest.length - 1]) out += c;
    i++;
  }
  return out
    .replace(/\u0000/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const files = process.argv.slice(2);
for (const file of files) {
  const raw = fs.readFileSync(file);
  const text = decodeRtf(raw.toString('latin1'));
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const heads = lines.filter((l) =>
    /^(WSTĘP|PROLOG|EPILOG|ROZDZIAŁ|ROZDZIAL|CZĘŚĆ|CZESC|TOM |KSIĘGA|KSIEGA|DODATEK)/i.test(l),
  );
  console.log('\n==== ' + file.split('\\').pop());
  console.log('chars', text.length, 'words', text.split(/\s+/).length, 'heads', heads.length);
  console.log(lines.slice(0, 8).join(' | '));
  console.log(heads.slice(0, 40).join('\n'));
}
