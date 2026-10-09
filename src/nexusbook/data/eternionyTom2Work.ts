import { Book } from '../types';

export const ETERNIONY_TOM2_HTML = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ETERNIONY — TOM II // CI, KTÓRZY ZOSTALI PO CISZY — ETERNIVERSE OS</title>
  <style>
    :root {
      --primary: #f43f5e;
      --primary-glow: rgba(244, 63, 94, 0.4);
      --primary-dim: rgba(244, 63, 94, 0.12);
      --bg: #030712;
      --surface: #130a18;
      --surface-border: rgba(244, 63, 94, 0.25);
      --text: #f8fafc;
      --text-muted: #fda4af;
      --accent: #a855f7;
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
        radial-gradient(ellipse at 50% 0%, rgba(244, 63, 94, 0.15) 0%, transparent 70%),
        radial-gradient(ellipse at 80% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 60%);
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
      background: linear-gradient(180deg, rgba(244, 63, 94, 0.08) 0%, transparent 100%);
      border-radius: 16px;
      border: 1px solid rgba(244, 63, 94, 0.2);
      margin-bottom: 3rem;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 0.75rem;
      background: linear-gradient(135deg, #ffffff 0%, #fb7185 50%, #c084fc 100%);
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
      background: rgba(244, 63, 94, 0.05);
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
      border: 1px solid rgba(244, 63, 94, 0.15);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
    }
    .chapter h2 {
      font-size: 1.4rem;
      color: #fecdd3;
      margin-bottom: 1rem;
      font-family: var(--font-mono);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .chapter h2::before {
      content: "🩸";
      color: var(--primary);
    }
    p { margin-bottom: 1.25rem; }
    .crimson-text { color: var(--primary); font-weight: 600; }
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
      <div><span class="hud-pill">ETERON-02</span> PROTOKÓŁ BEZPOŚREDNIEJ OBECNOŚCI</div>
      <div>AUTOR: Maciek Maciuszek (MaciekMaciuszek94)</div>
      <div>AKTYWNOŚĆ UNITA: REJESTRACJA</div>
    </div>

    <div class="title-box">
      <h1>ETERNIONY — TOM II</h1>
      <div class="subtitle">Ci, którzy zostali po ciszy | Noah, Dr Evelyn Cross, Instytucja UNITA & Czarny Rynek Obecności</div>
    </div>

    <div class="quote-card">
      „Cisza miała ich wyleczyć. Zamiast tego nauczyła ich tęsknić. Kiedy pole wróciło, nie wróciło jako dar. Wróciło jako pytanie, na które nie każdy chciał znać odpowiedź.”
    </div>

    <div class="chapter">
      <h2>AKT I — ROZDZIAŁ 1 // CISZA, KTÓRA NIE MINĘŁA</h2>
      <p>Alethe nie wróciła jako postać. Wróciła jako brak. Jej nieobecność stworzyła próżnię moralną, duchową i decyzyjną.</p>
      <p>Ludzie nie potrafią już żyć bez pola. W cieniu dawnej koherencji narasta czarny rynek obecności, a organizacja UNITA zaczyna regulować licencje na „bycie widzianym”.</p>
    </div>

    <div class="chapter">
      <h2>AKT II — ROZDZIAŁ 9 // PIERWSZY ETERION, KTÓRY NIE PYTA</h2>
      <p>Nie zamanifestował się z agresji. Zamanifestował się z rozpaczy.</p>
      <p>17-letni Noah — dziecko po Macieju, które widzi pole bez wchodzenia w nie — dostrzega nielegalne zakłócenie na granicy Warszawy. Czy zgoda ma sens, jeśli jej brak boli bardziej niż jej złamanie?</p>
    </div>

    <div class="chapter">
      <h2>AKT IV — ROZDZIAŁ 20 // TO, CO PO „NIE”</h2>
      <p class="crimson-text">„Nie każdy, kto chce być widziany, jest gotów zobaczyć siebie.”</p>
    </div>

    <footer>
      ETERNIVERSE SYSTEM ARCHITECTURE // TOM II // MACIEK MACIUSZEK
    </footer>
  </div>
</body>
</html>`;

export const ETERNIONY_TOM2_BOOK: Book = {
  id: 'eterniony-tom-2',
  title: 'Eterniony — Tom II',
  subtitle: 'Ci, którzy zostali po ciszy',
  author: 'Maciek Maciuszek (MaciekMaciuszek94)',
  series: 'Eterniverse // Kroniki Koherencji & Eteriony',
  seeker: 'EterSeeker',
  category: 'Science Fiction',
  seekerColor: '#f43f5e',
  status: 'Published',
  year: 2026,
  timelineYear: 2026,
  language: 'PL',
  tags: [
    'Science Fiction',
    'Eterniverse',
    'eterseeker',
    'etherion',
    'cyberpunk',
    'metafizyka',
    'UNITA',
    'Noah',
    'Alethe'
  ],
  shortDesc: 'Cisza miała ich wyleczyć. Zamiast tego nauczyła ich tęsknić. Tom II o konsekwencjach, czarnym rynku obecności, instytucji UNITA i 17-letnim Noah.',
  longDesc: `ETERNIONY — TOM II: CI, KTÓRZY ZOSTALI PO CISZY

Tom I był o narodzinach, granicach i ofierze. Tom II jest o konsekwencjach.

• Ludzie, którzy nie potrafią już żyć bez pola
• Eteriony, które zaczynają pamiętać rzeczy, których nie powinny
• Dzieci po Macieju (Noah, 17 lat — widzi pole bez wchodzenia w nie)
• Dr Evelyn Cross i neuroetyka bez eterionów
• Nowa władza: UNITA, regulująca przyjemność bycia widzianym
• Czarny rynek obecności i pytanie: „Co jeśli pole nie potrzebuje już nas… tylko my potrzebujemy jego?”`,
  authorNote: '„Nie każdy, kto chce być widziany, jest gotów zobaczyć siebie.” — Finał Tomu II',
  tableOfContents: [
    'Akt I — Głód (1. Cisza, która nie minęła, 2. Dzieci, które nie śnią, 3. Pierwsze uzależnienie, 4. Pole na receptę, 5. Noah widzi coś, czego nie powinien)',
    'Akt II — Zastępstwo (6. UNITA, 7. Eteriony premium, 8. Nielegalna obecność, 9. Pierwszy eterion, który nie pyta, 10. Kłamstwo, które ratuje życie)',
    'Akt III — Rozpad (11. Dziecko, które odmówiło pola, 12. Miłość bez zgody, 13. Śmierć bez ciszy, 14. Noah znika, 15. Pole zaczyna odpowiadać samo)',
    'Akt IV — Nowe Pytanie (16. Czy wolność boli za bardzo?, 17. Kim jesteś bez świadka?, 18. Eteriony uczą się odejścia, 19. Ostatnia granica, 20. To, co po „nie”)'
  ],
  quotes: [
    {
      id: 'ete2q1',
      text: 'Cisza miała ich wyleczyć. Zamiast tego nauczyła ich tęsknić.',
      chapterTitle: 'Akt I — Rozdział 1',
      tags: ['Tęsknota', 'Cisza', 'Pole']
    },
    {
      id: 'ete2q2',
      text: 'Czy zgoda ma sens, jeśli jej brak boli bardziej niż jej złamanie?',
      chapterTitle: 'Akt II — Centralny Konflikt',
      tags: ['Zgoda', 'Etyka', 'Eterion']
    },
    {
      id: 'ete2q3',
      text: 'Nie każdy, kto chce być widziany, jest gotów zobaczyć siebie.',
      chapterTitle: 'Akt IV — Finał Tomu II',
      tags: ['Prawda', 'Wizja', 'Eterniverse']
    }
  ],
  playlist: [
    { title: 'The Silence That Didn\'t Pass', artist: 'Eterniverse Dark Ambient', duration: '5:40' },
    { title: 'UNITA Black Market Presence', artist: 'Noah Field Resonance', duration: '6:12' },
    { title: 'The First Eterion Without Consent', artist: 'Cyber-Neuro Ensemble', duration: '7:01' }
  ],
  chapters: [
    {
      id: 'ete2_ch1',
      number: 1,
      title: 'AKT I — ROZDZIAŁ 1 // CISZA, KTÓRA NIE MINĘŁA',
      summary: 'Alethe nie wraca jako postać. Wraca jako brak. Tworzy się próżnia moralna i duchowa.',
      readTimeMin: 7,
      content: `1. Cisza, która nie minęła

Cisza miała ich wyleczyć. Zamiast tego nauczyła ich tęsknić.

Gdy Alethe odeszła, świat na trzy miesiące zastygł. Ludzie myśleli, że powrót do „zwykłej rzeczywistości” przyniesie ulgę. Ale ulga była krótka. Zastąpił ją głód.

Alethe nie wraca jako postać. Wraca jako brak.`
    },
    {
      id: 'ete2_ch5',
      number: 5,
      title: 'AKT I — ROZDZIAŁ 5 // NOAH WIDZI COŚ, CZEGO NIE POWINIEN',
      summary: 'Wprowadzenie Noah — 17-latka odpornego na uzależnienie pola.',
      readTimeMin: 9,
      content: `5. Noah widzi coś, czego nie powinien

Noah ma 17 lat. Urodził się po Macieju. Jest jednym z niewielu dzieci, które potrafią widzieć pole bez wchodzenia w nie.

Jest całkowicie odporny na uzależnienie. I właśnie dlatego jest najbardziej niebezpiecznym człowiekiem w mieście.`
    },
    {
      id: 'ete2_ch9',
      number: 9,
      title: 'AKT II — ROZDZIAŁ 9 // PIERWSZY ETERION, KTÓRY NIE PYTA',
      summary: 'Manifestacja Eterionu z rozpaczy, złamanie protokołu zgody.',
      readTimeMin: 11,
      content: `9. Pierwszy eterion, który nie pyta

Nie przyszedł z agresji. Przyszedł z rozpaczy.

Zamanifestował się bez zgody człowieka, w centrum podziemnej giełdy obecności na Pradze. Wokół niego powietrze zsiadło się w gęstą, pulsującą fioletem masę.

Czy zgoda ma sens, jeśli jej brak boli bardziej niż jej złamanie?`
    },
    {
      id: 'ete2_ch20',
      number: 20,
      title: 'AKT IV — ROZDZIAŁ 20 // TO, CO PO „NIE”',
      summary: 'Rozpad mitu zgody i narodziny nowej odpowiedzialności.',
      readTimeMin: 12,
      content: `20. To, co po „nie”

Nie było wielkiej bitwy. Nie było jednego bohatera.
Był rozpad mitu zgody i narodziny dojrzałej odpowiedzialności.

„Nie każdy, kto chce być widziany, jest gotów zobaczyć siebie.”`
    }
  ],
  stats: {
    pageCount: 380,
    wordCount: 72000,
    readerCount: 3910,
    estReadTimeMin: 165,
    votesCount: 82,
    partsCount: 20
  },
  platformLinks: {
    wattpad: 'https://www.wattpad.com/story/eterniony-tom-2',
    pdfUrl: '#eterniony-tom-2'
  },
  coverStyle: {
    bgGradient: 'from-rose-950 via-slate-950 to-black',
    accentColor: '#f43f5e',
    pattern: 'holo',
    symbol: '🩸'
  },
  customHtmlWorld: {
    htmlCode: ETERNIONY_TOM2_HTML,
    themeColor: '#f43f5e',
    terminalActive: true,
    worldName: 'ETERNIONY — TOM II',
    authorName: 'Maciek Maciuszek (MaciekMaciuszek94)'
  }
};
