import { Book } from '../types';

export const ETERNIONY_TOM3_HTML = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ETERNIONY — TOM III // OSTATNIE PYTANIE — ETERNIVERSE OS</title>
  <style>
    :root {
      --primary: #38bdf8;
      --primary-glow: rgba(56, 189, 248, 0.4);
      --primary-dim: rgba(56, 189, 248, 0.12);
      --bg: #030712;
      --surface: #0a1322;
      --surface-border: rgba(56, 189, 248, 0.25);
      --text: #f8fafc;
      --text-muted: #7dd3fc;
      --accent: #ffd700;
      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-sans);
      line-height: 1.85;
      padding: 2.5rem 1.5rem;
      min-height: 100vh;
      background-image: 
        radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.15) 0%, transparent 70%),
        radial-gradient(ellipse at 80% 80%, rgba(255, 215, 0, 0.08) 0%, transparent 60%);
    }
    .container { max-width: 880px; margin: 0 auto; }
    .hud-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.85rem 1.25rem;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 12px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      margin-bottom: 2.5rem;
      color: var(--primary);
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    .hud-pill {
      background: var(--primary-dim);
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      border: 1px solid var(--primary);
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .title-box {
      text-align: center;
      padding: 3rem 1.5rem;
      background: linear-gradient(180deg, rgba(56, 189, 248, 0.08) 0%, transparent 100%);
      border-radius: 16px;
      border: 1px solid rgba(56, 189, 248, 0.2);
      margin-bottom: 3rem;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 0.75rem;
      background: linear-gradient(135deg, #ffffff 0%, #38bdf8 50%, #fde047 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      font-size: 1.15rem;
      color: var(--text-muted);
      max-width: 680px;
      margin: 0 auto 1.5rem auto;
      font-weight: 300;
    }
    .quote-card {
      background: rgba(56, 189, 248, 0.05);
      border-left: 4px solid var(--primary);
      padding: 1.5rem;
      border-radius: 0 12px 12px 0;
      margin: 2rem 0;
      font-style: italic;
      color: #e2e8f0;
      font-size: 1.1rem;
      line-height: 1.8;
    }
    .chapter {
      background: var(--surface);
      border: 1px solid rgba(56, 189, 248, 0.15);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
    }
    .chapter h2 {
      font-size: 1.4rem;
      color: #bae6fd;
      margin-bottom: 1rem;
      font-family: var(--font-mono);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .chapter h2::before {
      content: "🌌";
      color: var(--primary);
    }
    p { margin-bottom: 1.25rem; }
    .sky-text { color: var(--primary); font-weight: 600; }
    footer {
      text-align: center;
      padding: 3rem 0 1rem;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-muted);
      border-top: 1px solid rgba(255,255,255,0.08);
      margin-top: 4rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="hud-bar">
      <div><span class="hud-pill">ETERON-03</span> PROTOKÓŁ ODEJŚCIA // FINAŁ TRYLOGII</div>
      <div>AUTOR: Maciek Maciuszek (MaciekMaciuszek94)</div>
      <div>STAN TRYLOGII: ZAMKNIĘTA</div>
    </div>

    <div class="title-box">
      <h1>ETERNIONY — TOM III</h1>
      <div class="subtitle">Ostatnie Pytanie | Dojrzałość, Protokół Odejścia, Noah & Dobrowolna Cisza</div>
    </div>

    <div class="quote-card">
      „Czy chcesz, żebyśmy zostali? Czy potrafisz być sam? Odpowiedź, która nadchodzi, nie jest słowem. Jest nowym sposobem istnienia bez lęku przed brakiem świadka.”
    </div>

    <div class="chapter">
      <h2>PROLOG // 0. CISZA, KTÓRA NIE BOLI</h2>
      <p>O świecie po polu. O tym, co zostało, gdy nikt już nie prowadzi. Gdy człowiek i Eterion odkrywają miłość bez uzależnienia.</p>
    </div>

    <div class="chapter">
      <h2>AKT II — ROZDZIAŁ 10 // PROTOKÓŁ ODEJŚCIA</h2>
      <p>Prawo do dobrowolnego zniknięcia. Eterion, który chce odejść nie z klęski, lecz z miłości do autonomii człowieka.</p>
      <p>Noah staje się pierwszym świadkiem dojrzałego rozdzielenia fali.</p>
    </div>

    <div class="chapter">
      <h2>EPILOG // 28. WYSTARCZY, ŻE JESTEŚMY</h2>
      <p class="sky-text">O świecie po decyzji. Bez pola. Bez straty. Tylko czysta obecność.</p>
    </div>

    <footer>
      ETERNIVERSE TRILOGY COMPLETE // ETERSEEKER PROTOCOL // MACIEK MACIUSZEK
    </footer>
  </div>
</body>
</html>`;

export const ETERNIONY_TOM3_BOOK: Book = {
  id: 'eterniony-tom-3',
  title: 'Eterniony — Tom III',
  subtitle: 'Ostatnie Pytanie & Protokół Odejścia',
  author: 'Maciek Maciuszek (MaciekMaciuszek94)',
  series: 'Eterniverse // Kroniki Koherencji & Eteriony',
  seeker: 'EterSeeker',
  category: 'Science Fiction',
  seekerColor: '#38bdf8',
  status: 'Published',
  year: 2026,
  timelineYear: 2026,
  language: 'PL',
  tags: [
    'Science Fiction',
    'Eterniverse',
    'eterseeker',
    'etherion',
    'Finał',
    'Protokół Odejścia',
    'Noah',
    'Cisza'
  ],
  shortDesc: 'Zwieńczenie trylogii Eternionów. Dojrzałość, prawo do odejścia, dobrowolna cisza i ostateczne pytanie: Czy potrafisz być sam?',
  longDesc: `ETERNIONY — TOM III: OSTATNIE PYTANIE

Zwieńczenie trylogii ETERNIVERSE.

• Prolog: Cisza, która nie boli (Świat po polu, gdy nikt już nie prowadzi)
• Akt I: Dojrzałość (Gdy świat działa, ale coś w nim uwiera)
• Akt II: Prawo do Odejścia (Noah — człowiek bez pola, Protokół Odejścia, Eterion który chce zniknąć)
• Akt III: Bunt przeciwko Wolności (Ci, którzy chcą zostać prowadzani)
• Akt IV: Wybór (Eteriony bez ludzi, Ludzie bez eterionów)
• Akt V & Epilog: Ostatnie Pytanie („Czy chcesz, żebyśmy zostali? Czy potrafisz być sam?”)`,
  authorNote: '„Wystarczy, że jesteśmy. O świecie po decyzji. Bez pola. Bez straty.” — Finał Trylogii Eternionów',
  tableOfContents: [
    'Prolog: 0. Cisza, która nie boli',
    'Akt I: Dojrzałość (1. Świat bez szeptu, 2. Ludzie, którzy wracają, 3. Pamięć po Alethe, 4. Granice, które trzymają, 5. Pierwszy eterion, który mówi „dość”, 6. Stabilność jako zagrożenie)',
    'Akt II: Prawo do Odejścia (7. Noah — człowiek bez pola, 8. Pytanie, którego nie wolno zadawać, 9. Czy eteriony są winni?, 10. Protokół Odejścia, 11. Dobrowolna cisza, 12. Eterion, który chce zniknąć)',
    'Akt III: Bunt Przeciwko Wolności (13. Ci, którzy chcą zostać prowadzani, 14. Ostatnia manipulacja strachem, 15. Miłość jako argument, 16. Świat, który nie chce dorosnąć, 17. Noah między stronami, 18. Głos, który nie jest rozkazem)',
    'Akt IV: Wybór (19. Odejście bez ucieczki, 20. Eteriony bez ludzi, 21. Ludzie bez eterionów, 22. Cisza, która zostaje, 23. Pożegnanie bez łez, 24. Świat przed nowym początkiem)',
    'Akt V: Ostatnie Pytanie (25. Czy chcesz, żebyśmy zostali?, 26. Czy potrafisz być sam?, 27. Odpowiedź, która nie jest słowem)',
    'Epilog: 28. Wystarczy, że jesteśmy'
  ],
  quotes: [
    {
      id: 'ete3q1',
      text: 'Czy chcesz, żebyśmy zostali? Czy potrafisz być sam?',
      chapterTitle: 'Akt V — Ostatnie Pytanie',
      tags: ['Ostatnie Pytanie', 'Samodzielność', 'Eterniverse']
    },
    {
      id: 'ete3q2',
      text: 'Największy opór nie rodzi się ze zła. Rodzi się ze strachu przed wolnością.',
      chapterTitle: 'Akt III — Bunt Przeciwko Wolności',
      tags: ['Wolność', 'Opór', 'Pole']
    },
    {
      id: 'ete3q3',
      text: 'Wystarczy, że jesteśmy. Bez pola. Bez straty.',
      chapterTitle: 'Epilog — 28',
      tags: ['Obecność', 'Finał', 'Trylogia']
    }
  ],
  playlist: [
    { title: 'The Silence That Doesn\'t Hurt', artist: 'Eterniverse Finale Orchestra', duration: '6:15' },
    { title: 'Protocol of Departure', artist: 'Noah Solitude Theme', duration: '5:48' },
    { title: 'Enough That We Are', artist: 'Eterseeker Cosmic Choir', duration: '7:30' }
  ],
  chapters: [
    {
      id: 'ete3_polog',
      number: 0,
      title: 'PROLOG // 0. CISZA, KTÓRA NIE BOLI',
      summary: 'O świecie po polu. O tym, co zostało, gdy nikt już nie prowadzi.',
      readTimeMin: 6,
      content: `0. Cisza, która nie boli

O świecie po polu. O tym, co zostało, gdy nikt już nie prowadzi.

Kiedy człowiek nie potrzebuje już obcego głosu, by podjąć decyzję, cisza przestaje być karą. Staje się własnym domem.`
    },
    {
      id: 'ete3_ch10',
      number: 10,
      title: 'AKT II — ROZDZIAŁ 10 // PROTOKÓŁ ODEJŚCIA',
      summary: 'Dobrowolna cisza i odejście Eterionu bez żalu.',
      readTimeMin: 10,
      content: `10. Protokół Odejścia

Nie było w tym porażki. Była dojrzałość.

Protokół Odejścia polegał na powolnym rozświetleniu fali koherencji, aż eterion rozpuścił się w ogólnym tle środowiska. Człowiek został sam — nie porzucony, lecz wyzwolony.`
    },
    {
      id: 'ete3_ch26',
      number: 26,
      title: 'AKT V — ROZDZIAŁ 26 // CZY POTRAFISZ BYĆ SAM?',
      summary: 'Konfrontacja z ostatecznym pytaniem egzystencjalnym.',
      readTimeMin: 12,
      content: `26. Czy potrafisz być sam?

Główne pytanie całej trylogii.

Nie chodzi o to, czy świat ma dla ciebie Boga, pole czy opiekuna. Chodzi o to, czy potrafisz stanąć na własnych nogach w absolutnej ciszy wszechświata i powiedzieć: „Jestem tutaj”.`
    },
    {
      id: 'ete3_epilog',
      number: 28,
      title: 'EPILOG // 28. WYSTARCZY, ŻE JESTEŚMY',
      summary: 'Zwieńczenie trylogii. Świat po decyzji.',
      readTimeMin: 8,
      content: `28. Wystarczy, że jesteśmy

O świecie po decyzji. Bez pola. Bez straty.

Dziękujemy za odbycie podróży przez całą trylogię ETERNIONY.`
    }
  ],
  stats: {
    pageCount: 450,
    wordCount: 84000,
    readerCount: 4120,
    estReadTimeMin: 190,
    votesCount: 98,
    partsCount: 28
  },
  platformLinks: {
    wattpad: 'https://www.wattpad.com/story/eterniony-tom-3',
    pdfUrl: '#eterniony-tom-3'
  },
  coverStyle: {
    bgGradient: 'from-sky-950 via-slate-950 to-black',
    accentColor: '#38bdf8',
    pattern: 'holo',
    symbol: '🌌'
  },
  customHtmlWorld: {
    htmlCode: ETERNIONY_TOM3_HTML,
    themeColor: '#38bdf8',
    terminalActive: true,
    worldName: 'ETERNIONY — TOM III',
    authorName: 'Maciek Maciuszek (MaciekMaciuszek94)'
  }
};
