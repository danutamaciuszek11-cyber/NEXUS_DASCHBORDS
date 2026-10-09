import { Book } from '../types';

export const ETHERSEEKER_HTML = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ETHERSEEKER // ARCHITEKTURA WOLI — ETERNIVERSE OS</title>
  <style>
    :root {
      --primary: #ffd700;
      --primary-glow: rgba(255, 215, 0, 0.4);
      --primary-dim: rgba(255, 215, 0, 0.12);
      --bg: #030712;
      --surface: #0e0c1a;
      --surface-border: rgba(255, 215, 0, 0.25);
      --text: #f8fafc;
      --text-muted: #fef08a;
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
        radial-gradient(ellipse at 50% 0%, rgba(255, 215, 0, 0.12) 0%, transparent 70%),
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
      background: linear-gradient(180deg, rgba(255, 215, 0, 0.08) 0%, transparent 100%);
      border-radius: 16px;
      border: 1px solid rgba(255, 215, 0, 0.2);
      margin-bottom: 3rem;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 0.75rem;
      background: linear-gradient(135deg, #ffffff 0%, #fde047 50%, #a855f7 100%);
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
      background: rgba(255, 215, 0, 0.05);
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
      border: 1px solid rgba(255, 215, 0, 0.15);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
    }
    .chapter h2 {
      font-size: 1.4rem;
      color: #fef08a;
      margin-bottom: 1rem;
      font-family: var(--font-mono);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .chapter h2::before {
      content: "⚡";
      color: var(--primary);
    }
    p { margin-bottom: 1.25rem; }
    .gold-text { color: var(--primary); font-weight: 600; }
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
      <div><span class="hud-pill">ETHERSEEKER</span> ARCHITEKTURA WOLI</div>
      <div>AUTOR: Maciek Maciuszek (MaciekMaciuszek94)</div>
      <div>STAN: SYSTEM OPERACYJNY</div>
    </div>

    <div class="title-box">
      <h1>ETHERSEEKER: ARCHITEKTURA WOLI</h1>
      <div class="subtitle">Jak działa człowiek, gdy budzi się w nim prawdziwa siła. Od Woli Biologicznej do Woli Rdzennej.</div>
    </div>

    <div class="quote-card">
      „Czym różni się »życie intencją« od »życia konstrukcją«? Intencja to życzenie. Konstrukcja to układ scalony, w którym wola staje się niepodważalną falą w polu.”
    </div>

    <div class="chapter">
      <h2>PROLOG // DLACZEGO TWOJA WOLA NIE DZIAŁAŁA DO TEJ PORY</h2>
      <p>Trzy systemy sterowały Twoim życiem bez Twojej zgody: przetrwanie biologiczne, automatyzm emocjonalny oraz narzucona narracja otoczenia.</p>
      <p>Rozróżniamy trzy poziomy: <span class="gold-text">Wola Biologiczna</span> (reakcja na lęk), <span class="gold-text">Wola Emocjonalna</span> (poszukiwanie ulgi) oraz <span class="gold-text">Wola Rdzenna</span> (architektura pola).</p>
    </div>

    <div class="chapter">
      <h2>MODUŁ I — ROZDZIAŁ 3 // WOLA RDZENNA</h2>
      <p>Wola Rdzenna to nie cecha charakteru. To częstotliwość koherencji. Tylko 3% ludzi przechodzi z trybu reaktora w stan Architekta.</p>
      <p>W momencie aktywacji punktu zero wola przestaje walczyć z chaosem — zaczyna go nadawać.</p>
    </div>

    <div class="chapter">
      <h2>MODUŁ V — PROTOKOŁY MOCY</h2>
      <p><strong>Protokół Resetu Woli (5 min):</strong> Awaryjne wyłączenie reaktywności limbicznej i przywrócenie spójności sygnału.</p>
      <p><strong>Protokół Architekta (10 min):</strong> Inicjalizacja nowej linii czasowej i nakładanie kodu działania na kod intencji.</p>
    </div>

    <footer>
      ETERNIVERSE SYSTEM ARCHITECTURE // ETHERSEEKER PROTOCOL // MACIEK MACIUSZEK
    </footer>
  </div>
</body>
</html>`;

export const ETHERSEEKER_BOOK: Book = {
  id: 'etherseeker-architektura-woli',
  title: 'ETHERSEEKER',
  subtitle: 'Architektura Woli & Jak Działa Człowiek w Polu',
  author: 'Maciek Maciuszek (MaciekMaciuszek94)',
  series: 'Eterniverse // Architektura Woli Protocol',
  seeker: 'EterSeeker',
  category: 'Filozofia',
  seekerColor: '#ffd700',
  status: 'Published',
  year: 2026,
  timelineYear: 2026,
  language: 'PL',
  tags: [
    'Filozofia',
    'Eterniverse',
    'Wola',
    'Architekt',
    'Świadomość',
    'Metafizyka',
    'etherseeker',
    'eterseeker',
    'koherencja',
    'neuroplastyczność'
  ],
  shortDesc: 'Jak działa człowiek, gdy budzi się w nim prawdziwa siła. Nowy model naukowy i behawioralny: Wola Biologiczna, Emocjonalna i Rdzenna oraz operacje na polu.',
  longDesc: `ETHERSEEKER: ARCHITEKTURA WOLI
Jak działa człowiek, gdy budzi się w nim prawdziwa siła.

Rozkodowanie trzech systemów sterujących życiem bez zgody człowieka. Przejście od „życia intencją” do „życia konstrukcją”.

Kompletny podręcznik operacyjny obejmujący 6 Modułów, 18 Rozdziałów oraz Protokoły Resetu, Architekta i Mocy.`,
  authorNote: '„Wola Rdzenna to nie siła woli, którą zmuszasz się do wstawania rano. Wola Rdzenna to częstotliwość, która załamuje falę prawdopodobieństwa w polu.” — Maciek Maciuszek',
  tableOfContents: [
    'Prolog: Dlaczego Twoja wola nie działała do tej pory',
    'Moduł I: Trzy Filary Woli (Wola Biologiczna, Emocjonalna, Rdzenna)',
    'Moduł II: Anatomia Decyzji (7 sekund, ścieżka automatyczna, Kod Zgody)',
    'Moduł III: System Architekta (Kim jest Architekt Woli, 6 blokad, Stan Koherencji)',
    'Moduł IV: Operacje na Polu (Załamanie Fali, Przebudowa tożsamości)',
    'Moduł V: Praktyki i Protokoły (Protokół Resetu 5 min, Architekta 10 min, Mocy 30 min)',
    'Moduł VI: Wola a Przyszłość Człowieka (Ewolucja w erze AI)',
    'Epilog: Kiedy stajesz się własnym systemem operacyjnym'
  ],
  quotes: [
    {
      id: 'ethq1',
      text: 'Intencja to życzenie. Konstrukcja to układ scalony, w którym wola staje się niepodważalną falą w polu.',
      chapterTitle: 'Prolog — Dlaczego Twoja wola nie działała do tej pory',
      tags: ['Wola', 'Konstrukcja', 'Pole']
    },
    {
      id: 'ethq2',
      text: '95% Twoich wyborów nigdy nie należało do Ciebie. Należały do skrótów biologii i lęku.',
      chapterTitle: 'Rozdział 4 — Skąd naprawdę biorą się decyzje',
      tags: ['Decyzja', 'Automatyzm']
    },
    {
      id: 'ethq3',
      text: 'Nie każdy, kto chce być widziany, jest gotów zobaczyć siebie.',
      chapterTitle: 'Moduł III — Stan Koherencji',
      tags: ['Koherencja', 'Prawda']
    }
  ],
  playlist: [
    { title: 'Biological Will Reset', artist: 'Etherseeker Soundscape', duration: '5:00' },
    { title: 'Architect State Synchronization', artist: 'Eterniverse Resonance Core', duration: '10:00' },
    { title: 'Wave Collapse & Power Protocol', artist: 'Quantum Field Audio', duration: '15:30' }
  ],
  chapters: [
    {
      id: 'eth_polog',
      number: 0,
      title: 'PROLOG — DLACZEGO TWOJA WOLA NIE DZIAŁAŁA DO TEJ PORY',
      summary: 'Trzy systemy sterujące, wola biologiczna, emocjonalna i rdzenna oraz mechanika fal decyzji.',
      readTimeMin: 6,
      content: `PROLOG — Dlaczego Twoja wola nie działała do tej pory

• Trzy systemy, które sterowały Twoim życiem bez Twojej zgody.
• Czym jest „wola biologiczna”, „wola emocjonalna” i „wola rdzenna”.
• Czym różni się „życie intencją” od „życia konstrukcją”.
• Wprowadzenie do mechaniki pola: jak decyzje tworzą fale.`
    },
    {
      id: 'eth_ch1',
      number: 1,
      title: 'ROZDZIAŁ 1 — WOLA BIOLOGICZNA',
      summary: 'Układ nerwowy jako system operacyjny przetrwania i reset limbiczny.',
      readTimeMin: 8,
      content: `ROZDZIAŁ 1 — Wola Biologiczna

• Jak ciało decyduje za Ciebie, zanim pomyślisz.
• Układ nerwowy jako „system operacyjny przetrwania”.
• Lęk jako język ciała, nie umysłu.
• Reset układu limbicznego — biologiczna podstawa wolności.`
    },
    {
      id: 'eth_ch3',
      number: 3,
      title: 'ROZDZIAŁ 3 — WOLA RDZENNA',
      summary: 'Wola jako częstotliwość, aktywacja punktu zero i stan Architekta.',
      readTimeMin: 10,
      content: `ROZDZIAŁ 3 — Wola Rdzenna

• Wola jako częstotliwość, nie cecha charakteru.
• Dlaczego tylko 3% ludzi wchodzi w Wolę Rdzenną.
• Jak rodzi się stan „architekta” zamiast „reaktora”.
• Aktywacja punktu zero — moment, w którym wola przebija chaos.`
    },
    {
      id: 'eth_ch13',
      number: 13,
      title: 'ROZDZIAŁ 13 — PROTOKÓŁ RESETU WOLI (5 MINUT)',
      summary: 'Awaryjna sekwencja stabilizacyjna i wyłączenie reaktywności.',
      readTimeMin: 5,
      content: `ROZDZIAŁ 13 — Protokół Resetu Woli (5 minut)

1. Zatrzymaj ruch fizyczny. Usiądź prosto.
2. Odłącz wzrok od ekranów. Zamknij oczy na 30 sekund.
3. Obserwuj napięcie w klatce piersiowej bez próby jego zmiany.
4. Powiedz w myślach: „To jest impuls przetrwania. Nie jest moją decyzją.”
5. Przenieś uwagę na punkt zero w centrum ciała. Przywróć kierunek.`
    },
    {
      id: 'eth_epilog',
      number: 18,
      title: 'EPILOG — KIEDY STAJESZ SIĘ WŁASNYM SYSTEMEM OPERACYJNYM',
      summary: 'Ostatnia lekcja Woli i wybór własnej linii życia.',
      readTimeMin: 7,
      content: `EPILOG — Kiedy stajesz się własnym systemem operacyjnym

• Ostatnia lekcja Woli.
• Jak działa życie, gdy wola staje się fundamentem.
• Wyzwanie dla czytelnika: wybór linii życia.`
    }
  ],
  stats: {
    pageCount: 310,
    wordCount: 58000,
    readerCount: 3820,
    estReadTimeMin: 140,
    votesCount: 94,
    partsCount: 18
  },
  platformLinks: {
    wattpad: 'https://www.wattpad.com/story/etherseeker-architektura-woli',
    pdfUrl: '#etherseeker'
  },
  coverStyle: {
    bgGradient: 'from-amber-950 via-slate-950 to-black',
    accentColor: '#ffd700',
    pattern: 'circuit',
    symbol: '⚡'
  },
  customHtmlWorld: {
    htmlCode: ETHERSEEKER_HTML,
    themeColor: '#ffd700',
    terminalActive: true,
    worldName: 'ETHERSEEKER',
    authorName: 'Maciek Maciuszek (MaciekMaciuszek94)'
  }
};
