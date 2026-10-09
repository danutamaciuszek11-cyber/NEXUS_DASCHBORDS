import fs from 'node:fs';
import path from 'node:path';

const decoder = new TextDecoder('windows-1250');
const root = 'c:\\Users\\immortales\\Desktop\\KSIĄŻKI_ODZYSKANE\\KSIĄŻKI';

const sources = [
  ['GENEZA 2.rtf', 'geneza-2-dziecko-systemu', 'EterSeeker', '#ffd700'],
  ['TOM II — TOTALNA STRATA.rtf', 'tabuseeker-tom-2', 'TabuSeeker', '#ff0055'],
  ['TOM III — SYSTEMOWA ARCHITEKTURA KŁAMSTWA.rtf', 'tabuseeker-tom-3', 'TabuSeeker', '#ff0055'],
  ['TABUSEEKER TOM 1.rtf', 'tabuseeker-tom-1', 'TabuSeeker', '#ff0055'],
  ['TABUSEEKER TOM 2.rtf', 'tabuseeker-tom-2', 'TabuSeeker', '#ff0055'],
  ['TABUSEEKER TOM 3.rtf', 'tabuseeker-tom-3', 'TabuSeeker', '#ff0055'],
  ['Instrukcja wyjścia ze świata reakcji.rtf', 'poza-3d-instrukcja-wyjscia', 'SpiritSeeker', '#f8fafc'],
  ['SPLĄTANIE.rtf', 'splatanie-ksiega-7', 'EterSeeker', '#ffd700'],
  ['THETA-SEEKER.rtf', 'theta-seeker', 'EterSeeker', '#ffd700'],
  ['CIEŃ CYFROWY.rtf', 'cien-cyfrowy-amazon', 'InterSeeker', '#c084fc'],
  ['Dokument 2.rtf', 'tozsamosc-cyfrowa', 'InterSeeker', '#00f0ff'],
  ['TOŻSAMOŚĆ CYFROWA.rtf', 'tozsamosc-cyfrowa', 'InterSeeker', '#00f0ff'],
  ['TOŻSAMOŚĆ CYFROWACYFROWYMOMENT ODDANIA.txt', 'moment-oddania', 'InterSeeker', '#c084fc'],
  ['UKRYTE MECHANIZMY WŁADZY.rtf', 'ukryte-mechanizmy-wladzy', 'TabuSeeker', '#ff0055'],
  ['zapiski.rtf', 'zapiski-architekta', 'Operator001', '#94a3b8'],
  ['interfejsa swiadomości.rtf', 'interfaceseeker-interfejs-swiadomosci', 'InterSeeker', '#00f0ff'],
];

function decodeRtf(input) {
  const parts = [];
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
      if (!dest.length) dest.push(1);
      i++;
      continue;
    }
    if (c === '\\') {
      const next = input[i + 1];
      if (next === '\\' || next === '{' || next === '}') {
        if (dest[dest.length - 1]) parts.push(next);
        i += 2;
        continue;
      }
      if (next === "'") {
        const hex = input.slice(i + 2, i + 4);
        if (dest[dest.length - 1] && /^[0-9a-fA-F]{2}$/.test(hex)) {
          parts.push(decoder.decode(Buffer.from(hex, 'hex')));
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
        while (j < input.length && /\d/.test(input[j])) num += input[j++];
        if (input[j] === '?' || input[j] === ' ') j++;
        if (dest[dest.length - 1] && num) {
          let code = sign * Number(num);
          if (code < 0) code += 65536;
          parts.push(String.fromCharCode(code));
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
      const skip = new Set(['fonttbl', 'colortbl', 'stylesheet', 'info', 'pict', 'object', 'header', 'footer', 'headerf', 'footerf']);
      if (word === '*' || skip.has(word)) dest[dest.length - 1] = 0;
      else if ((word === 'par' || word === 'line') && dest[dest.length - 1]) parts.push('\n');
      else if (word === 'tab' && dest[dest.length - 1]) parts.push('\t');
      else if ((word === 'ldblquote' || word === 'rdblquote') && dest[dest.length - 1]) parts.push('"');
      else if ((word === 'lquote' || word === 'rquote') && dest[dest.length - 1]) parts.push("'");
      else if (word === 'emdash' && dest[dest.length - 1]) parts.push('—');
      else if (word === 'endash' && dest[dest.length - 1]) parts.push('–');
      else if (word === 'bullet' && dest[dest.length - 1]) parts.push('•');
      i = j;
      continue;
    }
    if (c === '\r' || c === '\n') {
      i++;
      continue;
    }
    if (dest[dest.length - 1]) parts.push(c);
    i++;
  }
  return parts
    .join('')
    .replace(/\u0000/g, '')
    .replace(/^\*Riched20[^\n]*\n?/, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function readSource(name) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) return '';
  if (name.endsWith('.txt')) {
    const buf = fs.readFileSync(file);
    const asUtf = buf.toString('utf8');
    if (asUtf.includes('\uFFFD') || /[¿¯¹æ]/.test(asUtf.slice(0, 80))) return decoder.decode(buf).trim();
    return asUtf.trim();
  }
  if (name.endsWith('.md')) return fs.readFileSync(file, 'utf8').trim();
  return decodeRtf(fs.readFileSync(file).toString('latin1'));
}

const isHead = (line) =>
  /^(WSTĘP|PROLOG|EPILOG|ROZDZIAŁ|ROZDZIAL|CZĘŚĆ|CZESC|KSIĘGA|KSIEGA)(\s|$)/i.test(line) && line.length < 140;

function splitChapters(text) {
  const chunks = [];
  let title = 'Otwarcie';
  const body = [];
  const flush = () => {
    const content = body.join('\n').trim();
    body.length = 0;
    if (content.length > 80) chunks.push({ title, content });
  };
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (isHead(line)) {
      flush();
      title = line;
      continue;
    }
    body.push(raw);
  }
  flush();
  if (!chunks.length && text.length > 80) chunks.push({ title: 'Tekst', content: text });
  return chunks;
}

function words(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function esc(text) {
  return text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function titleFrom(name, text) {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l && l !== '---' && !l.startsWith('*'));
  const named = lines.find((l) => l.length > 3 && l.length < 80 && !/^(Dobrze|Jedziemy|Tak —|Kaisa)/.test(l));
  if (name.includes('CIEŃ')) return 'CIEŃ CYFROWY';
  if (name.includes('MOMENT')) return 'Moment oddania';
  if (name.includes('TOŻSAMOŚĆ') || name.startsWith('Dokument')) return 'TOŻSAMOŚĆ CYFROWA';
  if (name.includes('TOTALNA') || name.includes('TOM 2')) return 'TABUSEEKER — TOM II: TOTALNA STRATA';
  if (name.includes('KŁAMSTWA') || name.includes('TOM 3')) return 'TABUSEEKER — TOM III: SYSTEMOWA ARCHITEKTURA KŁAMSTWA';
  if (name.includes('TOM 1')) return 'TABUSEEKER — TOM I: BRAK JEDYNEK';
  if (name.includes('GENEZA')) return 'GENEZA II — DZIECKO SYSTEMU';
  if (name.includes('THETA')) return 'THETA-SEEKER';
  if (name.includes('SPLĄTANIE')) return 'SPLĄTANIE';
  if (name.includes('Instrukcja')) return 'POZA 3D — Instrukcja wyjścia ze świata reakcji';
  if (name.includes('UKRYTE')) return 'UKRYTE MECHANIZMY WŁADZY';
  if (name.includes('zapiski')) return 'Zapiski';
  if (name.includes('interfejsa')) return 'INTERFACESEEKER — Interfejs świadomości';
  return named || name;
}

const seenText = new Set();
const books = [];

for (const [name, id, seeker, color] of sources) {
  const text = readSource(name);
  const key = text.slice(0, 400);
  if (text.length < 200) {
    console.log('POMINIĘTO', name, 'znaków', text.length);
    continue;
  }
  if (seenText.has(key)) {
    console.log('DUPLIKAT', name);
    continue;
  }
  seenText.add(key);
  if (books.some((b) => b.id === id)) {
    console.log('ID JUŻ JEST', name, id);
    continue;
  }
  const chapters = splitChapters(text);
  const title = titleFrom(name, text);
  const totalWords = chapters.reduce((n, ch) => n + words(ch.content), 0);
  books.push({ id, title, seeker, color, chapters, totalWords, source: name });
  console.log('KSIĄŻKA', title, 'rozdziały', chapters.length, 'słowa', totalWords);
}

const body = books
  .map((book) => {
    const chapters = book.chapters
      .map((ch, index) => {
        const mins = Math.max(1, Math.round(words(ch.content) / 200));
        return `    {
      id: '${book.id}-ch-${index}',
      number: ${index},
      title: ${JSON.stringify(ch.title)},
      summary: ${JSON.stringify(ch.content.replace(/\s+/g, ' ').slice(0, 140))},
      readTimeMin: ${mins},
      content: \`${esc(ch.content)}\`
    }`;
      })
      .join(',\n');
    const toc = book.chapters.map((ch) => JSON.stringify(ch.title)).join(', ');
    const quote = book.chapters[0].content.replace(/\s+/g, ' ').slice(0, 180);
    return `  {
    id: '${book.id}',
    title: ${JSON.stringify(book.title)},
    subtitle: 'Odzyskany rękopis z archiwum KSIĄŻKI_ODZYSKANE',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'Eterniverse — dzieła odzyskane',
    seeker: '${book.seeker}',
    seekerColor: '${book.color}',
    status: 'Published',
    year: 2026,
    language: 'PL',
    tags: ['Odzyskane', 'Eterniverse', ${JSON.stringify(book.title)}],
    timelineYear: 2026,
    shortDesc: ${JSON.stringify(book.chapters[0].content.replace(/\s+/g, ' ').slice(0, 220))},
    longDesc: ${JSON.stringify(book.chapters.map((ch) => ch.title).join(' · '))},
    authorNote: 'Tekst odzyskany z pliku ${book.source.replace(/'/g, "\\'")}.',
    tableOfContents: [${toc}],
    quotes: [{ id: '${book.id}-q1', text: ${JSON.stringify(quote)}, chapterTitle: ${JSON.stringify(book.chapters[0].title)} }],
    chapters: [
${chapters}
    ],
    stats: {
      pageCount: ${Math.max(1, Math.round(book.totalWords / 250))},
      wordCount: ${book.totalWords},
      readerCount: 0,
      estReadTimeMin: ${Math.max(1, Math.round(book.totalWords / 200))},
      votesCount: 0,
      partsCount: ${book.chapters.length}
    },
    platformLinks: {},
    coverStyle: {
      bgGradient: 'from-slate-950 via-zinc-900 to-black',
      accentColor: '${book.color}',
      pattern: 'circuit',
      symbol: '▣'
    }
  }`;
  })
  .join(',\n');

const out = `import { Book } from '../types';

export const RECOVERED_BOOKS: Book[] = [
${body}
];
`;

const target = path.resolve('src/nexusbook/data/recoveredBooks.ts');
fs.writeFileSync(target, out, 'utf8');
console.log('ZAPISANO', target, 'książek', books.length, 'bajtów', out.length);
