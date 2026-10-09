import { Book } from '../types';

export const SYNAPSEEKER_HTML = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SYNAPSEEKER // ARCHITEKTURA POŁĄCZENIA — ETERNIVERSE OS</title>
  <style>
    :root {
      --primary: #00f0ff;
      --primary-glow: rgba(0, 240, 255, 0.4);
      --primary-dim: rgba(0, 240, 255, 0.12);
      --bg: #030712;
      --surface: #0b0f19;
      --surface-border: rgba(0, 240, 255, 0.25);
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #ffd700;
      --accent-glow: rgba(255, 215, 0, 0.4);
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
        radial-gradient(ellipse at 50% 0%, rgba(0, 240, 255, 0.1) 0%, transparent 70%),
        radial-gradient(ellipse at 80% 80%, rgba(255, 215, 0, 0.05) 0%, transparent 60%);
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
      border-bottom: 2px solid var(--surface-border);
      padding-bottom: 2.5rem;
      margin-bottom: 3rem;
      text-align: center;
    }
    .title-box h1 {
      font-size: 3rem;
      font-weight: 900;
      letter-spacing: -0.02em;
      color: #ffffff;
      line-height: 1.1;
      margin-bottom: 0.75rem;
      text-shadow: 0 0 30px var(--primary-glow);
    }
    .title-box .subtitle {
      font-size: 1.35rem;
      color: var(--primary);
      font-weight: 600;
      font-family: var(--font-mono);
      margin-bottom: 1rem;
    }
    .title-box .author {
      font-size: 1rem;
      color: var(--accent);
      font-family: var(--font-mono);
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .quote-card {
      background: rgba(0, 240, 255, 0.04);
      border: 1px solid var(--surface-border);
      border-left: 5px solid var(--primary);
      padding: 2rem;
      border-radius: 12px;
      margin: 2.5rem 0;
      font-size: 1.1rem;
      font-style: italic;
      color: #e2e8f0;
      line-height: 1.9;
    }
    .quote-card strong {
      color: var(--accent);
      font-style: normal;
    }
    .chapter {
      margin-bottom: 4rem;
      padding-bottom: 2.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .chapter-badge {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .chapter-title {
      font-size: 2rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 1.5rem;
    }
    .chapter-content p {
      margin-bottom: 1.5rem;
      color: #cbd5e1;
      font-size: 1.05rem;
    }
    .diagram-box {
      background: #050814;
      border: 1px solid var(--surface-border);
      padding: 1.5rem;
      border-radius: 12px;
      font-family: var(--font-mono);
      color: var(--primary);
      text-align: center;
      margin: 2rem 0;
      line-height: 2;
    }
    .highlight-gold {
      color: var(--accent);
      font-weight: bold;
    }
    .terminal-footer {
      text-align: center;
      padding-top: 3rem;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-muted);
      border-top: 1px solid var(--surface-border);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="hud-bar">
      <span>ETERNIVERSE OS // SYNAPSEEKER PROTOCOL</span>
      <span class="hud-pill">NEURO-RECONSTRUCTION</span>
      <span>NODE: INTERSEEKER & BIOSEEKER</span>
    </div>

    <div class="title-box">
      <h1>SYNAPSEEKER</h1>
      <div class="subtitle">ARCHITEKTURA POŁĄCZENIA</div>
      <div class="author">MACIEK MACIUSZEK (MaciekMaciuszek94)</div>
    </div>

    <div class="quote-card">
      <p>Nie jesteś tym, co myślisz. <strong>Jesteś tym, co powtarzasz.</strong></p>
      <p style="margin-top: 1rem;">Każda myśl zostawia ślad. Każda emocja może połączyć się ze wspomnieniem. Każde powtórzenie może stworzyć wzorzec. A każdy wzorzec może zacząć sterować twoją reakcją, zanim zdążysz powiedzieć: <em>„To mój wybór”</em>.</p>
    </div>

    <div class="chapter">
      <div class="chapter-badge">PROLOG</div>
      <div class="chapter-title">POŁĄCZENIE</div>
      <div class="chapter-content">
        <p>Zanim pomyślisz — coś już się wydarzyło. Bodziec. Ułamek sekundy. Impuls. Potem myśl. Potem emocja. Potem reakcja. I nawet nie zauważyłeś momentu, w którym podjąłeś decyzję. A może właśnie dlatego jej nie podjąłeś?</p>
        <p>Może tylko wykonałeś ścieżkę, którą twój system zna od lat. Klik. Połączenie. Jedno z tysięcy. Może milionów.</p>
        <p>Myśl połączona z emocją. Emocja ze wspomnieniem. Wspomnienie z człowiekiem. Człowiek z bólem. Ból z reakcją. Reakcja z nawykiem. Nawyk z tożsamością. A potem mówisz: <em>„Taki już jestem”</em>.</p>
        <p>Nie. Zatrzymaj się. To może nie być „ty”. To może być ścieżka. Ścieżka, którą przechodziłeś tak długo, że przestałeś zauważać, że istnieje. I właśnie tutaj zaczyna się Synapseeker. Nie od odpowiedzi. Od jednego pytania: <span class="highlight-gold">Co jest połączone z czym?</span></p>
      </div>
    </div>

    <div class="chapter">
      <div class="chapter-badge">ROZDZIAŁ 1</div>
      <div class="chapter-title">NIE JESTEŚ SWOJĄ REAKCJĄ</div>
      <div class="chapter-content">
        <p>Telefon. Jedno słowo. Jedna wiadomość. Nagle napięcie. Serce przyspiesza. Myśl pojawia się automatycznie: <em>„Znowu to samo”</em>. Reagujesz. Dopiero później zaczynasz się zastanawiać: <em>„Dlaczego?”</em>.</p>
        <p>Ale „dlaczego” przyszło za późno. System już wykonał swoją pracę. Bodziec. Interpretacja. Emocja. Impuls. Reakcja. Koniec.</p>
        <p>A jednak pomiędzy impulsem a reakcją istnieje przestrzeń. Mała. Czasami niemal niewidoczna. Ale istnieje. <strong>PAUZA.</strong></p>
        <p>To właśnie tam zaczyna się możliwość zmiany. Nie musisz kontrolować całego umysłu. Musisz najpierw zauważyć moment, w którym stara ścieżka próbuje przejąć sterowanie. Bo kiedy widzisz połączenie — przestaje być niewidzialne. A kiedy przestaje być niewidzialne — możesz zacząć je badać. Witaj w sieci.</p>
      </div>
    </div>

    <div class="chapter">
      <div class="chapter-badge">ROZDZIAŁ 2</div>
      <div class="chapter-title">PIERWSZE POŁĄCZENIE</div>
      <div class="chapter-content">
        <p>Niektóre reakcje zaczynają się na długo przed tym, zanim je zauważysz. Ktoś podnosi głos — ciało się napina. Ktoś milczy — pojawia się niepokój. Telefon pozostaje bez odpowiedzi — umysł zaczyna tworzyć scenariusze. Jeszcze nic się nie wydarzyło, a jednak twój system już działa. Dlaczego? Bo mózg nieustannie szuka połączeń.</p>
        
        <div class="diagram-box">
          WIADOMOŚĆ → INTERPRETACJA → EMOCJA → REAKCJA
        </div>

        <p><strong>03. „ZNAM TO”</strong> — To jedno z najważniejszych zdań Synapseekera. Mózg nieustannie przewiduje. Na podstawie wcześniejszych doświadczeń próbuje określić, co może wydarzyć się teraz. System automatyzuje ogromną część codzienności. To jego siła, ale ta sama mechanika może stać się pułapką.</p>
        
        <p><strong>07. MAPA:</strong><br>
        BODZIEC (Ktoś mnie krytykuje) → INTERPRETACJA („Jestem beznadziejny”) → EMOCJA (Wstyd) → IMPULS (Wycofaj się) → REAKCJA (Milczę) → KONSEKWENCJA (Nie pokazuję, co potrafię) → POWTÓRZENIE.</p>
        
        <p><strong>08. NIE JESTEŚ LINIĄ:</strong> Człowiek widzi swoje zachowanie i zaczyna utożsamiać je ze swoją tożsamością. <em>Robię X → jestem X</em>. Nie zawsze. Czasami: <em>robię X → ponieważ mój system nauczył się X</em>. To ogromna różnica.</p>
      </div>
    </div>

    <div class="chapter">
      <div class="chapter-badge">ROZDZIAŁ 3</div>
      <div class="chapter-title">PĘTLA</div>
      <div class="chapter-content">
        <p>Najgroźniejsze połączenia nie krzyczą. Powtarzają się. Raz. Drugi. Dziesiąty. Setny. Aż przestajesz je zauważać. Nie pytasz już: <em>„Dlaczego to robię?”</em>. Mówisz: <em>„Taki jestem”</em>. I właśnie wtedy pętla zamyka się nad tobą.</p>
        
        <div class="diagram-box">
          STRES → UNIKANIE → ULGA (Krótkoterminowa korzyść, długoterminowy koszt)
        </div>

        <p><strong>PĘTLA NIE JEST TOŻSAMOŚCIĄ:</strong> Pętla jest zachowaniem, które zostało powtórzone. Nie jest definicją całego człowieka. Możesz mieć określony schemat, ale nadal możesz zacząć go obserwować. Obserwacja tworzy dystans. Dystans tworzy możliwość. Możliwość tworzy wybór.</p>

        <p>Nowa możliwość: <span class="highlight-gold">BODZIEC → ŚWIADOMOŚĆ → PAUZA → WYBÓR → DZIAŁANIE</span>.</p>
      </div>
    </div>

    <div class="terminal-footer">
      ETERNIVERSE ARCHIVE // SYNAPSEEKER PROTOCOL // MACIEK MACIUSZEK // 2026
    </div>
  </div>
</body>
</html>`;

export const SYNAPSEEKER_BOOK: Book = {
  id: 'synapseeker-architektura-polaczenia',
  title: 'SYNAPSEEKER',
  subtitle: 'Architektura Połączenia & Mapa Schematów Mózgu',
  author: 'Maciek Maciuszek (MaciekMaciuszek94)',
  series: 'Eteruniverse - Świat Psyche // Synapseeker Protocol',
  seeker: 'InterSeeker',
  seekerColor: '#00f0ff',
  status: 'Published',
  year: 2026,
  language: 'PL',
  tags: ['Psychologia', 'Neuronauka', 'Neuroplastyczność', 'Eterniverse', 'Umysł', 'Świadomość', 'Nawyk'],
  timelineYear: 2026,
  isFeatured: true,
  isManifesto: true,
  shortDesc: 'Nie jesteś tym, co myślisz. Jesteś tym, co powtarzasz. Podróż do sieci połączeń między pamięcią, emocją, impulsem, nawykiem i decyzją. Jak rozbroić stare pętle i zbudować nowe ścieżki.',
  longDesc: `SYNAPSEEKER zabiera cię do miejsca, którego nie widać w lustrze — do sieci. Do połączeń między pamięcią, emocją, impulsem, nawykiem i decyzją.

Tutaj pytanie nie brzmi: „Co jest ze mną nie tak?”.
Brzmi: „Jakie połączenia stworzyły człowieka, którym się stałem?”.
A potem pojawia się najważniejsze pytanie: „Czy mogę zbudować inne?”.

To nie jest opowieść o naprawianiu siebie. To wejście w architekturę własnych schematów.
INTERSEEKER pozwala zobaczyć.
SYNAPSEEKER pozwala połączyć.
ETERSEEKER pozwala wybrać.
OBFITOSEEKER pozwala materializować.

Jedna sieć. Jedna świadomość. Nowa trajektoria.`,
  authorNote: ',,Nie jesteś swoją reakcją. Pomiędzy impulsem a reakcją istnieje przestrzeń — PAUZA. To właśnie tam zaczyna się wolność i możliwość wyboru.,,',
  tableOfContents: [
    'Prolog: Połączenie (Co jest połączone z czym?)',
    'Rozdział 1: Nie jesteś swoją reakcją (Przestrzeń Pauzy)',
    'Rozdział 2: Pierwsze połączenie (Mechanizm „Znam To” i fałszywe skróty)',
    'Rozdział 3: Pętla (Ukryta nagroda, ulga i pierwsze pęknięcie)'
  ],
  quotes: [
    {
      id: 'synq1',
      text: 'Nie jesteś tym, co myślisz. Jesteś tym, co powtarzasz.',
      chapterTitle: 'Prolog: Połączenie',
      tags: ['Nawyk', 'Tożsamość', 'Synapseeker']
    },
    {
      id: 'synq2',
      text: 'Pomiędzy impulsem a reakcją istnieje przestrzeń. Mała. Czasami niemal niewidoczna. Ale istnieje. PAUZA. To właśnie tam zaczyna się możliwość zmiany.',
      chapterTitle: 'Rozdział 1: Nie jesteś swoją reakcją',
      tags: ['Pauza', 'Świadomość', 'Wybór']
    },
    {
      id: 'synq3',
      text: 'Pętla nie mówi: „Taki jesteś”. Pętla mówi: „Tak nauczyłeś się reagować”. To nie jest to samo.',
      chapterTitle: 'Rozdział 3: Pętla',
      tags: ['Pętla', 'Neuroplastyczność', 'Uczenie']
    }
  ],
  playlist: [
    { title: 'Synaptic Spark & Overture', artist: 'Nexus Frequency Synth', duration: '4:30' },
    { title: 'The Space Between Impulse and Reaction', artist: 'Eterniverse Ambient Core', duration: '5:15' },
    { title: 'Breaking the Automated Loop', artist: 'Bio-Operator Electronics', duration: '6:02' }
  ],
  chapters: [
    {
      id: 'syn_prolog',
      number: 1,
      title: 'PROLOG POŁĄCZENIE',
      summary: 'Bodziec, impuls, myśl, emocja, reakcja. Zanim pomyślisz, twój system już wykonał dawno wydeptaną ścieżkę.',
      readTimeMin: 4,
      content: `Zanim pomyślisz — coś już się wydarzyło.

Bodziec.
Ułamek sekundy.
Impuls.
Potem myśl.
Potem emocja.
Potem reakcja.

I nawet nie zauważyłeś momentu, w którym podjąłeś decyzję. A może właśnie dlatego jej nie podjąłeś? Może tylko wykonałeś ścieżkę, którą twój system zna od lat.

Klik. Połączenie. Jedno z tysięcy. Może milionów.

Myśl połączona z emocją.
Emocja ze wspomnieniem.
Wspomnienie z człowiekiem.
Człowiek z bólem.
Ból z reakcją.
Reakcja z nawykiem.
Nawyk z tożsamością.

A potem mówisz: „Taki już jestem”.

Nie. Zatrzymaj się. To może nie być „ty”. To może być ścieżka. Ścieżka, którą przechodziłeś tak długo, że przestałeś zauważać, że istnieje.

I właśnie tutaj zaczyna się Synapseeker. Nie od odpowiedzi. Od jednego pytania:

Co jest połączone z czym?`
    },
    {
      id: 'syn_ch1',
      number: 2,
      title: 'ROZDZIAŁ 1 NIE JESTEŚ SWOJĄ REAKCJĄ',
      summary: 'Telefon, wiadomość, natychmiastowe napięcie. Odzyskiwanie przestrzeni PAUZY między bodźcem a działaniem.',
      readTimeMin: 5,
      content: `Telefon. Jedno słowo. Jedna wiadomość. Nagle napięcie. Serce przyspiesza. Myśl pojawia się automatycznie: „Znowu to samo”. Reagujesz.

Dopiero później zaczynasz się zastanawiać: „Dlaczego?”.

Ale „dlaczego” przyszło za późno. System już wykonał swoją pracę.
Bodziec → Interpretacja → Emocja → Impuls → Reakcja. Koniec.

A jednak pomiędzy impulsem a reakcją istnieje przestrzeń. Mała. Czasami niemal niewidoczna. Ale istnieje.

PAUZA.

To właśnie tam zaczyna się możliwość zmiany. Nie musisz kontrolować całego umysłu. Musisz najpierw zauważyć moment, w którym stara ścieżka próbuje przejąć sterowanie.

Bo kiedy widzisz połączenie — przestaje być niewidzialne. A kiedy przestaje być niewidzialne — możesz zacząć je badać.

Witaj w sieci.`
    },
    {
      id: 'syn_ch2',
      number: 3,
      title: 'ROZDZIAŁ 2 PIERWSZE POŁĄCZENIE',
      summary: 'Analiza bodźców, fałszywych skrótów, mechanizmu „Znam To” oraz budowanie rozłożonej mapy reakcji.',
      readTimeMin: 8,
      content: `Niektóre reakcje zaczynają się na długo przed tym, zanim je zauważysz. Ktoś podnosi głos — ciało się napina. Ktoś milczy — pojawia się niepokój. Telefon pozostaje bez odpowiedzi — umysł zaczyna tworzyć scenariusze.

Jeszcze nic się nie wydarzyło. A jednak twój system już działa. Dlaczego? Bo mózg nieustannie szuka połączeń. Nie żyjesz wyłącznie w teraźniejszości. Żyjesz również w tym, czego nauczyłeś się wcześniej.

01. BODZIEC
Wyobraź sobie prostą sytuację. Otrzymujesz wiadomość: „Musimy porozmawiać”. Cztery słowa. Nic więcej. Dla jednej osoby oznaczają: „Dobra. Pogadamy”. Dla drugiej: „Coś zrobiłem”. Dla trzeciej: „Będzie problem”.
Ten sam bodziec. Trzy różne reakcje. Dlaczego? Bo sam bodziec nie zawsze określa reakcję. Znaczenie powstaje w sieci:

WIADOMOŚĆ → INTERPRETACJA → EMOCJA → REAKCJA

02. PAMIĘĆ NIE ŚPI
Twój mózg nie przechowuje doświadczeń jak idealnie uporządkowanego archiwum. Doświadczenia są powiązane. Zapach może otworzyć wspomnienie. Miejsce może uruchomić emocję. Głos może przypomnieć człowieka. Jedno zdanie może przenieść cię mentalnie kilka lat wstecz. Nie dlatego, że czas się cofnął. Dlatego, że połączenie nadal istnieje.

03. „ZNAM TO”
To jedno z najważniejszych zdań Synapseekera. Znam to. Mózg nieustannie przewiduje. Na podstawie wcześniejszych doświadczeń próbuje określić, co może wydarzyć się teraz. System automatyzuje ogromną część codzienności. To jego siła, ale ta sama mechanika może stać się pułapką.

04. FAŁSZYWY SKRÓT
Człowiek wyśmiany w dzieciństwie słyszy dzisiaj: „Co o tym myślisz?” i zastyga. Myśli: „Taki jestem”. Ale prawdziwa historia brzmi: „Mój system nauczył się łączyć ekspozycję z zagrożeniem”. To nie to samo. Pierwsze zdanie tworzy tożsamość. Drugie pokazuje mechanizm.

07. MAPA
BODZIEC (Krytyka) → INTERPRETACJA („Jestem beznadziejny”) → EMOCJA (Wstyd) → IMPULS (Wycofaj się) → REAKCJA (Milczenie) → KONSEKWENCJA (Brak pokazania talentu) → POWTÓRZENIE.

08. NIE JESTEŚ LINIĄ
Robię X → jestem X. Nie zawsze. Czasami: robię X → ponieważ mój system nauczył się X.

10. PIERWSZA PAUZA
Zatrzymaj się. Jedna sekunda. Trzy pytania: CO SIĘ WYDARZYŁO? CO WŁAŚNIE POMYŚLAŁEM? CO MAM TERAZ OCHOTĘ ZROBIĆ? Obserwuj.`
    },
    {
      id: 'syn_ch3',
      number: 4,
      title: 'ROZDZIAŁ 3 PĘTLA',
      summary: 'Mechanizm pętli, ukryta nagroda w postaci natychmiastowej ulgi, cena odroczona w czasie oraz wywoływanie pierwszego pęknięcia.',
      readTimeMin: 9,
      content: `Najgroźniejsze połączenia nie krzyczą. Powtarzają się. Raz. Drugi. Dziesiąty. Setny. Aż przestajesz je zauważać. Nie pytasz już: „Dlaczego to robię?”. Mówisz: „Taki jestem”. I właśnie wtedy pętla zamyka się nad tobą.

01. PIERWSZY RUCH
BODZIEC → REAKCJA → ULGA. Jeżeli reakcja przynosi ulgę, mózg otrzymuje informację: „To zadziałało”.

02. ULGA
Nie wszystkie nawyki utrzymują się dlatego, że dają przyjemność. Niektóre utrzymują się dlatego, że kończą napięcie. STRES → UNIKANIE → ULGA.

03. NIE MUSI BYĆ PRZYJEMNIE
Nawyk nie musi być dobry ani logiczny. Wystarczy, że pełni jakąś funkcję (zmniejsza napięcie, daje poczucie kontroli). Lepsze pytanie: „Co dostaję sekundę po tym, kiedy to zrobię?”. Czasami odpowiedzią jest ulga.

07. AUTOMAT
Pętla powtarzana wystarczająco długo zaczyna wyglądać jak osobowość. Zachowanie zostaje przyklejone do tożsamości.

08. PĘTLA NIE JEST TOŻSAMOŚCIĄ
Pętla jest zachowaniem, które zostało powtórzone. Nie jest definicją całego człowieka. Obserwacja tworzy dystans. Dystans tworzy możliwość. Możliwość tworzy wybór.

12. UKRYTA NAGRODA I CENA
Problem polega na tym, że krótkoterminowa korzyść ma długoterminowy koszt. ULGA TERAZ oznacza WIĘKSZY PROBLEM PÓŹNIEJ. Pętla żyje dzięki temu, że jej nagroda jest szybka, a cena odroczona.

16. SYNAPSEEKER
Stara wersja: BODZIEC → AUTOMAT → REAKCJA.
Nowa możliwość: BODZIEC → ŚWIADOMOŚĆ → PAUZA → WYBÓR → DZIAŁANIE.

Pętla nie mówi: „Taki jesteś”. Pętla mówi: „Tak nauczyłeś się reagować”. To nie jest to samo. Bo jeśli coś zostało wyuczone, możesz zacząć uczyć się inaczej.`
    }
  ],
  stats: {
    pageCount: 220,
    wordCount: 38500,
    readerCount: 33,
    estReadTimeMin: 95
  },
  platformLinks: {
    wattpad: 'https://www.wattpad.com/story/synapseeker',
    pdfUrl: '#synapseeker'
  },
  coverStyle: {
    bgGradient: 'from-cyan-950 via-slate-900 to-black',
    accentColor: '#00f0ff',
    pattern: 'holo',
    symbol: '🧠'
  },
  customHtmlWorld: {
    htmlCode: SYNAPSEEKER_HTML,
    themeColor: '#00f0ff',
    terminalActive: true,
    worldName: 'SYNAPSEEKER',
    authorName: 'Maciek Maciuszek (MaciekMaciuszek94)'
  }
};
