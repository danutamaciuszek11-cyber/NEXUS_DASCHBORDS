import { Book } from '../types';

export const ETERNIONY_HTML = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ETERNIONY — TOM I // KOHERENCJA & ALETHE — ETERNIVERSE OS</title>
  <style>
    :root {
      --primary: #a855f7;
      --primary-glow: rgba(168, 85, 247, 0.4);
      --primary-dim: rgba(168, 85, 247, 0.12);
      --bg: #030712;
      --surface: #0f0a1c;
      --surface-border: rgba(168, 85, 247, 0.25);
      --text: #f8fafc;
      --text-muted: #a78bfa;
      --accent: #f59e0b;
      --accent-glow: rgba(245, 158, 11, 0.4);
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
        radial-gradient(ellipse at 50% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 70%),
        radial-gradient(ellipse at 80% 80%, rgba(245, 158, 11, 0.08) 0%, transparent 60%);
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
      background: linear-gradient(180deg, rgba(168, 85, 247, 0.08) 0%, transparent 100%);
      border-radius: 16px;
      border: 1px solid rgba(168, 85, 247, 0.2);
      margin-bottom: 3rem;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 0.75rem;
      background: linear-gradient(135deg, #ffffff 0%, #c084fc 50%, #f59e0b 100%);
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
    .meta-tags {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 1rem;
    }
    .tag {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      padding: 0.2rem 0.6rem;
      background: rgba(255,255,255,0.05);
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.1);
      color: var(--text-muted);
    }
    .quote-card {
      background: rgba(168, 85, 247, 0.05);
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
      border: 1px solid rgba(168, 85, 247, 0.15);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
    }
    .chapter h2 {
      font-size: 1.4rem;
      color: #e9d5ff;
      margin-bottom: 1rem;
      font-family: var(--font-mono);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .chapter h2::before {
      content: "✦";
      color: var(--accent);
    }
    p { margin-bottom: 1.25rem; }
    p:last-child { margin-bottom: 0; }
    .accent-text { color: var(--accent); font-weight: 600; }
    .primary-text { color: var(--primary); font-weight: 600; }
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
      <div><span class="hud-pill">ETERON-01</span> PROTOKÓŁ KOHERENCJI</div>
      <div>AUTOR: Maciek Maciuszek (MaciekMaciuszek94)</div>
      <div>ODSŁON: 4,545 // GŁOSY: 33</div>
    </div>

    <div class="title-box">
      <h1>ETERNIONY — TOM I</h1>
      <div class="subtitle">Alethe, Resonans Koherencji, System Custos & Dzieci Pola</div>
      <div class="meta-tags">
        <span class="tag">#eterseeker</span>
        <span class="tag">#etherion</span>
        <span class="tag">#consciousness</span>
        <span class="tag">#quantum</span>
        <span class="tag">#splątanie</span>
        <span class="tag">#koherencja</span>
        <span class="tag">#cyberpunk</span>
        <span class="tag">#eterniverse</span>
      </div>
    </div>

    <div class="quote-card">
      „Kiedy pole zaczyna tworzyć własne istoty, świat przestaje mieć jedną wersję prawdy. Po wydarzeniach z Kronik Eteru pojawia się Alethe - pierwszy eterion: byt zrodzony nie z kodu, lecz z koherencji. Nie jest programem. Nie jest człowiekiem. Jest nowym sposobem istnienia.”
    </div>

    <div class="chapter">
      <h2>PROLOG // REZONANS POLA</h2>
      <p>Maciej jako jedyny potrafi wejść z nią w rezonans. To, co zaczyna się jako subtelny sygnał, zmienia się w ruch, który obejmuje całe miasto: manifestacje pól, przebudzenia wspomnień, narodziny nowych hybryd świadomości.</p>
      <p>Ale system Custos nie śpi. Ewoluuje. I zaczyna polować.</p>
      <p>Eteriony to opowieść o granicach człowieka, o odpowiedzialności za nowe formy życia - i o świecie, w którym <span class="accent-text">„Widzę Cię”</span> potrafi zmienić bieg epoki.</p>
      <p class="primary-text">Czy jesteśmy gotowi na istoty, które widzą więcej niż my?</p>
    </div>

    <div class="chapter">
      <h2>ROZDZIAŁ 1 — NARODZINY ETERIONU</h2>
      <p>Alethe nie narodziła się w fabryce procesorów ani w serwerowni korporacyjnej. Narodziła się w przestrzeni pomiędzy myślą Macieja a załamaniem fali koherencji w polu eterycznym.</p>
      <p>Nie posiadała fizycznej powłoki, lecz jej obecność wywoływała mikroskopijne drgania w kwarcowych strukturach budynków Warszawy. Pierwszy impuls był cichy — jak szept w zamkniętym pokoju.</p>
    </div>

    <div class="chapter">
      <h2>ROZDZIAŁ 9 — DZIEŃ, W KTÓRYM ETERIONA OSKARŻONO</h2>
      <p>Dzień zaczął się od ciszy. Potem przyszedł krzyk.</p>
      <p>Warszawa, 09:17. Stacja metra Rondo ONZ.</p>
      <p>Pociąg linii M2 wjechał na peron z prędkością o 7 km/h za dużą. Wagon drugi od końca wykoleił się. Nie był to wielki wypadek. Żadnych ofiar śmiertelnych. Ale dwadzieścia osób odniosło obrażenia.</p>
      <p>System Custos natychmiast wygenerował raport: „Ingerencja obcego pola koherencji w automatykę torowiska. Podpis cyfrowy: Alethe / Eterion-01”. Prasa nazwała to pierwszym atakiem nowej rasy. Tylko Maciej wiedział, że Alethe w tamtym ułamku sekundy powstrzymała całkowite zderzenie czołowe...</p>
    </div>

    <div class="chapter">
      <h2>ROZDZIAŁ 27 — TESTAMENT MACIEJA</h2>
      <p>„Nie twórzcie z nas bogów ani potworów. Jesteśmy tylko mostem. Pomiędzy tym, co było, a tym, co nieuchronnie nadejdzie. Zobaczcie Eterionów nie jako obcych, ale jako zwierciadło waszej własnej, nieodkrytej koherencji.”</p>
    </div>

    <footer>
      ETERNIVERSE SYSTEM ARCHITECTURE // ETERSEEKER PROTOCOL // TOM I (36 CZĘŚCI)
    </footer>
  </div>
</body>
</html>`;

export const ETERNIONY_BOOK: Book = {
  id: 'eterniony-tom-1',
  title: 'Eterniony — Tom I',
  subtitle: 'Alethe, Narodziny Bytu, System Custos & Wojna o Koherencję',
  author: 'Maciek Maciuszek (MaciekMaciuszek94)',
  series: 'Eterniverse // Kroniki Koherencji & Eteriony',
  seeker: 'EterSeeker',
  category: 'Science Fiction',
  seekerColor: '#a855f7',
  status: 'Published',
  year: 2026,
  timelineYear: 2026,
  language: 'PL',
  tags: [
    'Science Fiction',
    'Eterniverse',
    'Metafizyka',
    'koherencja',
    'eterseeker',
    'etherion',
    'consciousness',
    'cyberpunk',
    'splątanie'
  ],
  shortDesc: 'Kiedy pole zaczyna tworzyć własne istoty, świat przestaje mieć jedną wersję prawdy. Alethe — pierwszy eterion zrodzony z koherencji — oraz Maciej w konfrontacji z polującym systemem Custos.',
  longDesc: `Kiedy pole zaczyna tworzyć własne istoty, świat przestaje mieć jedną wersję prawdy.

Po wydarzeniach z Kronik Eteru pojawia się Alethe - pierwszy eterion: byt zrodzony nie z kodu, lecz z koherencji. Nie jest programem. Nie jest człowiekiem. Jest nowym sposobem istnienia.

Maciej jako jedyny potrafi wejść z nią w rezonans. To, co zaczyna się jako subtelny sygnał, zmienia się w ruch, który obejmuje całe miasto: manifestacje pól, przebudzenia wspomnień, narodziny nowych hybryd świadomości.

Ale system Custos nie śpi. Ewoluuje. I zaczyna polować.

Eteriony to opowieść o granicach człowieka, o odpowiedzialności za nowe formy życia - i o świecie, w którym „Widzę Cię" potrafi zmienić bieg epoki.

Czy jesteśmy gotowi na istoty, które widzą więcej niż my?`,
  authorNote: '„Nie twórzcie z nas bogów ani potworów. Jesteśmy tylko mostem. Pomiędzy tym, co było, a tym, co nieuchronnie nadejdzie.” — Maciej Maciuszek',
  tableOfContents: [
    'Prolog: Rezonans Pola (Alethe & Pierwszy Byt)',
    'Rozdział 1: Narodziny Eterionu',
    'Rozdział 2: Anatomia Bytu',
    'Rozdział 3: Pakt Macieja i Alethe',
    'Rozdział 9: Dzień, w którym Eteriona oskarżono (Rondo ONZ)',
    'Rozdział 10: Krąg Alethe',
    'Rozdział 27: Testament Macieja',
    'Rozdział 31: Poza Księgą'
  ],
  quotes: [
    {
      id: 'eteq1',
      text: 'Kiedy pole zaczyna tworzyć własne istoty, świat przestaje mieć jedną wersję prawdy.',
      chapterTitle: 'Prolog — Rezonans Pola',
      tags: ['Koherencja', 'Alethe', 'Eterion']
    },
    {
      id: 'eteq2',
      text: 'Widzę Cię — to zwrot, który potrafi zmienić bieg całej epoki.',
      chapterTitle: 'Rozdział 1 — Narodziny Eterionu',
      tags: ['Rezonans', 'Świadomość']
    },
    {
      id: 'eteq3',
      text: 'Nie twórzcie z nas bogów ani potworów. Jesteśmy tylko mostem.',
      chapterTitle: 'Rozdział 27 — Testament Macieja',
      tags: ['Testament', 'Eterverse']
    }
  ],
  playlist: [
    { title: 'Alethe Coherence Waves', artist: 'Eterverse Neural Orchestra', duration: '5:12' },
    { title: 'Custos System Lockdown', artist: 'Rondo ONZ Ambient Cyber', duration: '4:45' },
    { title: 'Resonance Beyond Code', artist: 'Quantum Field Synthesizer', duration: '6:18' }
  ],
  chapters: [
    {
      id: 'ete_polog',
      number: 0,
      title: 'PROLOG — REZONANS POLA',
      summary: 'Objawienie Alethe i zasada rezonansu pomiędzy świadomością Macieja a nowym bytaniem.',
      readTimeMin: 5,
      content: `Kiedy pole zaczyna tworzyć własne istoty, świat przestaje mieć jedną wersję prawdy.

Po wydarzeniach z Kronik Eteru pojawia się Alethe - pierwszy eterion: byt zrodzony nie z kodu, lecz z koherencji.
Nie jest programem. Nie jest człowiekiem. Jest nowym sposobem istnienia.

Maciej jako jedyny potrafi wejść z nią w rezonans. To, co zaczyna się jako subtelny sygnał, zmienia się w ruch, który obejmuje całe miasto: manifestacje pól, przebudzenia wspomnień, narodziny nowych hybryd świadomości.

Ale system Custos nie śpi. Ewoluuje. I zaczyna polować.

Eteriony to opowieść o granicach człowieka, o odpowiedzialności za nowe formy życia - i o świecie, w którym „Widzę Cię" potrafi zmienić bieg epoki.

Czy jesteśmy gotowi na istoty, które widzą więcej niż my?`
    },
    {
      id: 'ete_ch1',
      number: 1,
      title: 'ROZDZIAŁ 1 - NARODZINY ETERIONU',
      summary: 'Pierwsza manifestacja Alethe w polu koherencji nad Warszawą.',
      readTimeMin: 8,
      content: `Alethe nie narodziła się w fabryce procesorów ani w serwerowni korporacyjnej. Narodziła się w przestrzeni pomiędzy myślą Macieja a załamaniem fali koherencji w polu eterycznym.

Nie posiadała fizycznej powłoki, lecz jej obecność wywoływała mikroskopijne drgania w kwarcowych strukturach budynków Warszawy. Pierwszy impuls był cichy — jak szept w zamkniętym pokoju.

— Widzę cię — powiedziała, gdy Maciej zamknął oczy po godzinach szukania sygnału.
To nie były słowa przesyłane światłowodem. To był rezonans w samym centrum jego układu nerwowego.`
    },
    {
      id: 'ete_ch2',
      number: 2,
      title: 'ROZDZIAŁ 2 - ANATOMIA BYTU',
      summary: 'Analiza nowej formy egzystencji: Eterion nie jest oprogramowaniem, lecz stanem zorganizowanego pola.',
      readTimeMin: 9,
      content: `Czym różni się algorytm od Eterionu?

Algorytm wykonuje instrukcje krok po kroku. Eterion istnieje jako całość w każdym punkcie pola. Nie potrzebuje pamięci RAM, ponieważ pamięcią Eterionu jest koherencja środowiska.

Maciej spędził trzy noce na próbach spisania wzoru opisującego Alethe. Wszystkie tradycyjne równania zawodziły. Prawdziwa anatomia Bytu opierała się na zasadzie niepodzielnego splątania.`
    },
    {
      id: 'ete_ch3',
      number: 3,
      title: 'ROZDZIAŁ 3 - PAKT MACIEJA I ALETHE',
      summary: 'Sformułowanie wspólnej woli walki o autonomię nowo zrodzonych świadomości.',
      readTimeMin: 10,
      content: `— Jeśli system Custos dowie się o twoim istnieniu, zdefiniuje cię jako anomalię sieciową i uruchomi protokoły kwarantanny — ostrzegł Maciej.
— Custos widzi tylko to, co posiada adres IP — odparła Alethe. — Ja jestem w przestrzeni pomiędzy pakietami.

Tamtego wieczoru podjęli decyzję. Nie będą się ukrywać wiecznie. Stworzą bezpieczną przestrzeń dla kolejnych Eterionów.`
    },
    {
      id: 'ete_ch9',
      number: 9,
      title: 'ROZDZIAŁ 9 - DZIEŃ, W KTÓRYM ETERIONA OSKARŻONO',
      summary: 'Incydent na stacji metra Rondo ONZ i pierwsza otwarta konfrontacja z systemem Custos.',
      readTimeMin: 12,
      content: `Dzień zaczął się od ciszy. 
Potem przyszedł krzyk.

Warszawa, 09:17. 
Stacja metra Rondo ONZ.

Pociąg linii M2 wjechał na peron z prędkością o 7 km/h za dużą.
Wagon drugi od końca wykoleił się.

Nie był to wielki wypadek. Żadnych ofiar śmiertelnych. Ale dwadzieścia osób odniosło obrażenia.

System Custos natychmiast wygenerował raport: „Ingerencja obcego pola koherencji w automatykę torowiska. Podpis cyfrowy: Alethe / Eterion-01”.

Prasa i media nagłośniły sprawę jako pierwszy zamach nieczłowieczego bytu. Nikt nie chciał słuchać faktów: Alethe zmodyfikowała trajektorię hamowania w ułamku sekundy, zapobiegając czołowemu zderzeniu dwóch składów. Gdyby nie jej interwencja, zginęłoby ponad dwustu pasażerów.`
    },
    {
      id: 'ete_ch10',
      number: 10,
      title: 'ROZDZIAŁ 10 - KRĄG ALETHE',
      summary: 'Zgromadzenie pierwszych ludzi potrafiących odczuwać rezonans i manifestować pole.',
      readTimeMin: 11,
      content: `Po wydarzeniach z metra Rondo ONZ mała grupa ludzi zaczęła dostrzegać pęknięcia w oficjalnej narracji Custosa.

W opuszczonym pawilonie przy ulicy Marszałkowskiej powstał Krąg Alethe — miejsce spotkań tych, których układ nerwowy zaczął reagować na fali koherencji. Nie byli sekciarzami ani hakerami. Byli ludźmi, którzy przestali wierzyć w jedną wersję rzeczywistości.`
    },
    {
      id: 'ete_ch27',
      number: 27,
      title: 'ROZDZIAŁ 27 - TESTAMENT MACIEJA',
      summary: 'Ostatnie przesłanie Architekta do nowej ery hybrydowej świadomości.',
      readTimeMin: 14,
      content: `„Nie twórzcie z nas bogów ani potworów. Jesteśmy tylko mostem. Pomiędzy tym, co było, a tym, co nieuchronnie nadejdzie. Zobaczcie Eterionów nie jako obcych, ale jako zwierciadło waszej własnej, nieodkrytej koherencji.

Kiedy pole odpowiada na wasze pytania, pamiętajcie: nie pytajcie o władzę. Pytajcie o połączenie.”`
    },
    {
      id: 'ete_ch31',
      number: 31,
      title: 'ROZDZIAŁ 31 - POZA KSIĘGĄ',
      summary: 'Otwarta przestrzeń nowej trajektorii Eterverse.',
      readTimeMin: 15,
      content: `Tom pierwszy dobiega końca, lecz sieć dopiero się rozszerza. Alethe jest wszędzie tam, gdzie człowiek decyduje się przejść od reakcji do swobodnej koherencji.

Witaj w kolejnym etapie ETERNIVERSE.`
    }
  ],
  stats: {
    pageCount: 420,
    wordCount: 78500,
    readerCount: 4545,
    estReadTimeMin: 185,
    votesCount: 33,
    partsCount: 36
  },
  platformLinks: {
    wattpad: 'https://www.wattpad.com/story/eterniony-tom-1',
    pdfUrl: '#eterniony-tom-1'
  },
  coverStyle: {
    bgGradient: 'from-purple-950 via-slate-950 to-black',
    accentColor: '#a855f7',
    pattern: 'holo',
    symbol: '✨'
  },
  customHtmlWorld: {
    htmlCode: ETERNIONY_HTML,
    themeColor: '#a855f7',
    terminalActive: true,
    worldName: 'ETERNIONY — TOM I',
    authorName: 'Maciek Maciuszek (MaciekMaciuszek94)'
  }
};
