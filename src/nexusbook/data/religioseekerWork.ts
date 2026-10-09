import { Book } from '../types';

export const RELIGIOSEEKER_HTML = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RELIGIOSEEKER // WEJŚCIE W SUWERENNĄ DUCHOWOŚĆ — ETERNIVERSE OS</title>
  <style>
    :root {
      --primary: #f59e0b;
      --primary-glow: rgba(245, 158, 11, 0.4);
      --primary-dim: rgba(245, 158, 11, 0.12);
      --bg: #030712;
      --surface: #0f111a;
      --surface-border: rgba(245, 158, 11, 0.25);
      --text: #f8fafc;
      --text-muted: #fcd34d;
      --accent: #ef4444;
      --accent-glow: rgba(239, 68, 68, 0.4);
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
        radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.15) 0%, transparent 70%),
        radial-gradient(ellipse at 80% 80%, rgba(239, 68, 68, 0.08) 0%, transparent 60%);
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
      background: linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, transparent 100%);
      border-radius: 16px;
      border: 1px solid rgba(245, 158, 11, 0.2);
      margin-bottom: 3rem;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 0.75rem;
      background: linear-gradient(135deg, #ffffff 0%, #fcd34d 50%, #f59e0b 100%);
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
      background: rgba(245, 158, 11, 0.05);
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
      border: 1px solid rgba(245, 158, 11, 0.15);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
    }
    .chapter h2 {
      font-size: 1.4rem;
      color: #fef3c7;
      margin-bottom: 1rem;
      font-family: var(--font-mono);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .chapter h2::before {
      content: "🔥";
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
      <div><span class="hud-pill">SPIRITSEEKER</span> MAPA WŁASNEJ WIARY</div>
      <div>AUTOR: Maciek Maciuszek (MaciekMaciuszek94)</div>
      <div>SERIA: RELIGIOSEEKER PROTOCOL</div>
    </div>

    <div class="title-box">
      <h1>RELIGIOSEEKER</h1>
      <div class="subtitle">Droga Wolnej Duchowości, Rozpad Systemu i Odkrycie Prawdziwej Woli</div>
      <div class="meta-tags">
        <span class="tag">#wiara</span>
        <span class="tag">#duchowość</span>
        <span class="tag">#przebudzenie</span>
        <span class="tag">#świadomość</span>
        <span class="tag">#metafizyka</span>
        <span class="tag">#wola</span>
        <span class="tag">#pole</span>
        <span class="tag">#eterniverse</span>
      </div>
    </div>

    <div class="quote-card">
      „Ta książka nie pyta, w co wierzysz. Ta książka pyta: dlaczego jeszcze w to wierzysz? To nie jest książka o religii. To jest książka o człowieku, który przeżył wszystkie religie — i przestał potrzebować którejkolwiek.”
    </div>

    <div class="chapter">
      <h2>PROLOG // KIEDY PRZESTAJESZ WIERZYĆ W ICH BOGA</h2>
      <p>Kiedy przestajesz wierzyć w ich Boga, zaczynasz słyszeć siebie.</p>
      <p>Chrzest: pierwszy stempel, który nie był mój. Dziecko w religijnej klatce. Pierwsze pęknięcie: „To nie jest moja prawda”. Bunt. Pytanie, które zmienia życie: <span class="primary-text">„A jeśli cały czas patrzyłem w złym kierunku?”</span></p>
    </div>

    <div class="chapter">
      <h2>ROZDZIAŁ 1 — CISZA, KTÓRA ZABIJA DZIECKO</h2>
      <p>Bóg nigdy do mnie nie mówił. A ja przez lata myślałem, że to moja wina. Nie pamiętam momentu, w którym zacząłem się modlić. Pamiętam momenty, w których nic się nie wydarzyło.</p>
      <p>Klęczałem. Składałem ręce. Powtarzałem słowa, których nie rozumiałem. Dorośli mówili: „Bóg słyszy”. A ja słyszałem tylko własny oddech i skrzypienie ławki.</p>
      <p>Kościół nie był dla mnie miejscem wiary. Był miejscem ciszy. Nie tej dobrej. Tej, która wchodzi w głowę i zaczyna mówić twoim głosem: <span class="accent-text">„Może nie jesteś dość dobry”</span>.</p>
    </div>

    <div class="chapter">
      <h2>ROZDZIAŁ 2 — OŚRODEK, KTÓRY MIAŁ MNIE NAPRAWIĆ</h2>
      <p>Nie trafiłem tam, bo byłem zły. Trafiłem tam, bo system nie wiedział, co zrobić z ciszą we mnie. Ośrodek nie wyglądał jak więzienie. I to było najgorsze. Ściany czyste. Zasady jasne. Uśmiechy wyćwiczone.</p>
      <p>Tam wszystko miało sens — oprócz człowieka. Liczyło się posłuszeństwo, nie prawda. Wina, nie zrozumienie. Modlitwa nie była rozmową. Była narzędziem kontroli.</p>
    </div>

    <div class="chapter">
      <h2>ROZDZIAŁ 3 — ŚMIERĆ OJCA I PUSTE NIEBO</h2>
      <p>Kiedy umarł mój ojciec, nikt nie powiedział mi, co mam czuć. Za to wszyscy mówili, w co mam wierzyć. Słuchałem formułek na pogrzebie i czułem tylko fałsz.</p>
      <p>Śmierć ojca nie zabiła mnie. Ona zabiła iluzję. Iluzję, że ktoś tam na górze wszystko ogarnia. Zostałem sam, ale z odpowiedzialnością za własne myślenie.</p>
    </div>

    <div class="chapter">
      <h2>ROZDZIAŁ 4 — UCIECZKA W SYSTEMY (PUŁAPKA ŚWIATŁA)</h2>
      <p>Człowiek bez wiary nie zostaje pusty. Zostaje głodny sensu. Wszedłem w ezoterykę, karczowanie wibracji, prawo przyciągania. Ale i tam znalazłem ten sam mechanizm: wina znowu była moja, tylko pod inna nazwą.</p>
      <p>Wyszedłem z tego z jednym zdaniem: <span class="primary-text">„Jeśli prawda nie działa w najgorszym momencie życia — to nie jest prawda.”</span></p>
    </div>

    <footer>
      ETERNIVERSE SYSTEM ARCHITECTURE // SPIRITSEEKER PROTOCOL // RELIGIOSEEKER
    </footer>
  </div>
</body>
</html>`;

export const RELIGIOSEEKER_BOOK: Book = {
  id: 'religioseeker-droga-wolnej-duchowosci',
  title: 'RELIGIOSEEKER',
  subtitle: 'Droga Wolnej Duchowości, Rozpad Systemu i Odkrycie Prawdziwej Woli',
  author: 'Maciek Maciuszek (MaciekMaciuszek94)',
  series: 'Eteruniverse - Świat Ducha // SpiritSeeker Protocol',
  seeker: 'SpiritSeeker',
  category: 'Metafizyka',
  seekerColor: '#f59e0b',
  status: 'Published',
  year: 2026,
  timelineYear: 2026,
  language: 'PL',
  tags: [
    'ateizm',
    'duchowość',
    'energia',
    'innerjourney',
    'mentalhealth',
    'metafizyka',
    'newperspective',
    'pole',
    'prawdziwahistoria',
    'przebudzenie',
    'przemiana',
    'psychologia',
    'religia',
    'selfhelp',
    'wiara',
    'świadomość',
    'życie'
  ],
  shortDesc: 'Osobisty manifest i historia przejścia od przymusu wiary, przez ośrodek wychowawczy i śmierć ojca, aż do odrzucenia dogmatów i budowy suwerennej duchowości opartej na Woli i wierze w siebie.',
  longDesc: `Ta książka nie pyta, w co wierzysz.
Ta książka pyta: dlaczego jeszcze w to wierzysz?

Nie ma tu kaznodziei. Nie ma guru. Nie ma aniołów z piór i demonów z rogami.
Jest człowiek. Jest ból. Jest wola, która nie chce umrzeć.

RELIGIOSEEKER to wejście w to, o czym milczysz przed sobą: wątpliwości, załamania, sekundy, w których modlitwa nie działa - i te, w których działa za mocno.

To nie jest religia. To nie jest ateizm. To nie jest teologia.
To jest mapa. Twoja. Do rzeczy, które w tobie żyją, nawet jeśli udajesz, że nie.

ReligioSeeker to prawdziwa historia drogi od dziecięcego przymusu wiary, ośrodka wychowawczego, śmierci ojca, buntu i ezoteryki, aż do odnalezienia prawdziwej woli i wiary w siebie.`,
  authorNote: '„To nie jest książka o religii. To jest książka o człowieku, który przeżył wszystkie religie — i przestał potrzebować którejkolwiek.” — Maciek Maciuszek',
  tableOfContents: [
    'Prolog — „Kiedy przestajesz wierzyć w ich Boga, zaczynasz słyszeć siebie.”',
    'Rozdział 1 — Cisza, która zabija dziecko',
    'Rozdział 2 — Ośrodek, który miał mnie naprawić',
    'Rozdział 3 — Śmierć ojca i puste niebo',
    'Rozdział 4 — Ucieczka w systemy (Pułapka światła)',
    'Rozdział 5 — Dokument, który rozwalił mi głowę',
    'Rozdział 6 — Ezoteryka i anomalie',
    'Rozdział 7 — Najważniejsza lekcja',
    'Rozdział 8 — Dlaczego religie pękają',
    'Rozdział 9 — Bóg jako metafora',
    'Rozdział 10 — Dusza bez religii',
    'Rozdział 11 — Wola — prawdziwa moc',
    'Rozdział 12 — Anatomia mojego rdzenia',
    'Rozdział 13 — Prawda, której nie oszukasz',
    'Rozdział 14 — Reset: Rytuał Zero',
    'Rozdział 15 — 7 fundamentów wiary w siebie',
    'Rozdział 16 — Ciało jako jedyny kościół',
    'Rozdział 17 — Twój osobisty system',
    'Rozdział 18 — Kim staje się świadomy człowiek',
    'Rozdział 19 — Dlaczego ludzie boją się takich jak my',
    'Rozdział 20 — Człowiek jako Religia'
  ],
  quotes: [
    {
      id: 'relq1',
      text: 'Ta książka nie pyta, w co wierzysz. Ta książka pyta: dlaczego jeszcze w to wierzysz?',
      chapterTitle: 'Prolog',
      tags: ['Duchowość', 'Wiara', 'ReligioSeeker']
    },
    {
      id: 'relq2',
      text: 'Kościół nie był dla mnie miejscem wiary. Był miejscem ciszy. Pierwszą raną religii nie jest kłamstwo — jest nią wstyd.',
      chapterTitle: 'Rozdział 1 — Cisza, która zabija dziecko',
      tags: ['Cisza', 'Wstyd', 'Rozpad']
    },
    {
      id: 'relq3',
      text: 'Jeśli prawda nie działa w najgorszym momencie życia — to nie jest prawda.',
      chapterTitle: 'Rozdział 4 — Ucieczka w systemy',
      tags: ['Prawda', 'Wola', 'Pewność']
    }
  ],
  playlist: [
    { title: 'Silence in the Temple', artist: 'SpiritSeeker Ambient', duration: '5:04' },
    { title: 'Breaking the Dogma', artist: 'Eterniverse Resonance', duration: '6:12' },
    { title: 'The Power of Unbroken Will', artist: 'Bio-Frequency Synthesis', duration: '4:58' }
  ],
  chapters: [
    {
      id: 'rel_prolog',
      number: 0,
      title: 'PROLOG - „Kiedy przestajesz wierzyć w ich Boga, zaczynasz słyszeć siebie.”',
      summary: 'Dziecięcy przymus wiary, chrzest jako obcy stempel, pierwsze pęknięcie i fundamentalne pytanie o prawdziwy kierunek poszukiwań.',
      readTimeMin: 5,
      content: `Ta książka nie pyta, w co wierzysz.
Ta książka pyta: dlaczego jeszcze w to wierzysz?

Nie ma tu kaznodziei. Nie ma guru. Nie ma aniołów z piór i demonów z rogami.
Jest człowiek. Jest ból. Jest wola, która nie chce umrzeć.

RELIGIOSEEKER to wejście w to, o czym milczysz przed sobą:
wątpliwości, załamania, sekundy, w których modlitwa nie działa - i te, w których działa za mocno.

To nie jest religia. To nie jest ateizm. To nie jest teologia.
To jest mapa. Twoja. Do rzeczy, które w tobie żyją, nawet jeśli udajesz, że nie.

Jeśli szukasz pocieszenia - wyjdź.
Jeśli szukasz prawdy - wejdź.

Ta książka nie uzdrawia. Ona otwiera.
I kiedy otwiera - nie da się już wrócić do starej wersji siebie.

PROLOG - „Kiedy przestajesz wierzyć w ich Boga, zaczynasz słyszeć siebie.”
- Chrzest: pierwszy stempel, który nie był mój
- Dziecko w religijnej klatce
- Pierwsze pęknięcie: „To nie jest moja prawda”
- Bunt
- Pytanie, które zmienia życie: „A jeśli cały czas patrzyłem w złym kierunku?”`
    },
    {
      id: 'rel_ch1',
      number: 1,
      title: 'ROZDZIAŁ 1 - CISZA, KTÓRA ZABIJA DZIECKO',
      summary: 'Bóg nigdy nie odpowiadał. Klęczenie w kościelnej ławce, samotność dziecka i narodziny pierwszego wstydu.',
      readTimeMin: 8,
      content: `Bóg nigdy do mnie nie mówił.
A ja przez lata myślałem, że to moja wina.

Nie pamiętam momentu, w którym zacząłem się modlić.
Pamiętam momenty, w których nic się nie wydarzyło.

Klęczałem. Składałem ręce. Powtarzałem słowa, których nie rozumiałem.
Dorośli mówili: „Bóg słyszy”.
A ja słyszałem tylko własny oddech i skrzypienie ławki.

Byłem dzieckiem.
I już wtedy nauczyłem się jednej rzeczy:
jeśli pytasz za dużo - jesteś problemem.

Kościół nie był dla mnie miejscem wiary.
Był miejscem ciszy. Nie tej dobrej.
Tej, która wchodzi w głowę i zaczyna mówić twoim głosem:
„Może nie jesteś dość dobry.”
„Może źle się modlisz.”
„Może Bóg milczy, bo ty jesteś zepsuty.”

To jest pierwsza rana, jaką religia zadaje dziecku.
Nie kłamstwo.
Wstyd.

Nikt mnie nie pytał, czy chcę wierzyć.
Zostałem ochrzczony, zanim nauczyłem się mówić.
Dostałem Boga, zanim dostałem wybór.
Wmawiano mi, że to miłość.
Ale miłość nie zaczyna się od przymusu.

Każda niedziela wyglądała tak samo: ubrać się, iść, klęknąć, słuchać, wyjść.
Bez rozmowy. Bez miejsca na pytanie.
A pytania we mnie rosły.

Dlaczego Bóg kocha wszystkich, ale ciągle grozi?
Dlaczego mówi się o miłości, a straszy piekłem?
Dlaczego mam ufać komuś, kto nigdy się nie odzywa?

Nie zadawałem ich na głos.
Bo dzieci szybko uczą się, że cisza jest bezpieczniejsza niż prawda.

Najgorsze nie było to, że Bóg milczał.
Najgorsze było to, że nikt nie słuchał.

Dorośli mieli odpowiedzi. Zawsze gotowe. Zawsze te same.
A ja nie potrzebowałem odpowiedzi.
Potrzebowałem, żeby ktoś powiedział: „Widzę, że coś w tobie pęka.”

Ale zamiast tego słyszałem: „Módl się.” „Zaufaj.” „Nie kwestionuj.”

Tak rodzi się pierwszy rozpad. Nie bunt. Rozszczepienie.
Na zewnątrz grzeczne dziecko.
W środku samotność, której nikt nie nazwał.

Dziś wiem jedno: To nie była cisza Boga.
To była cisza systemu, który nie przewidział dzieci z wrażliwością.
System działał poprawnie. To ja byłem „niekompatybilny”.

I wtedy, bardzo wcześnie, bardzo cicho, bardzo głęboko pojawiła się myśl, której nie wolno było mieć:
„A jeśli to nie ja jestem zepsuty?”
„A jeśli to nie ze mną jest problem?”

To nie był jeszcze bunt. To był pierwszy impuls wolności.
I od tego momentu wszystko zaczęło się rozpadać.`
    },
    {
      id: 'rel_ch2',
      number: 2,
      title: 'ROZDZIAŁ 2 - OŚRODEK, KTÓRY MIAŁ MNIE NAPRAWIĆ',
      summary: 'Trzy lata w ośrodku wychowawczym. Modlitwa jako kara, wina jako narzędzie i narodziny nowej uważności.',
      readTimeMin: 10,
      content: `Nie trafiłem tam, bo byłem zły.
Trafiłem tam, bo system nie wiedział, co zrobić z ciszą we mnie.

Jedna decyzja. Jedno podpalenie. Jedna chwila, w której byłem bardziej zagubiony niż winny.
Koledze dali kuratora. Mnie zabrali na trzy lata.

Mówili: „To dla twojego dobra.”
Zawsze tak mówią, zanim zabiorą ci wybór.

Ośrodek nie wyglądał jak więzienie. I to było najgorsze.
Ściany czyste. Zasady jasne. Uśmiechy wyćwiczone.
System perfekcyjny. Człowiek - nieistotny.

Dzień zaczynał się o szóstej. Zimna woda. Modlitwa. Funkcje. Praca. Lekcje. Cisza.
Nie cisza spokoju. Cisza kontroli.

Tam wszystko miało sens - oprócz człowieka.
Liczyło się posłuszeństwo, nie prawda. Wina, nie zrozumienie.

Modlitwa nie była rozmową. Była narzędziem.
Źle się zachowałeś? Módl się.
Masz emocje? Módl się.
Zadajesz pytania? Módl się więcej.
To nie była wiara. To był trening uległości.

Najszybciej zrozumiałem jedną rzecz: słabość jest walutą.
Kto ją pokazywał - przegrywał. Kto ją chował - przeżywał.
Więc schowałem wszystko.
Stałem się cichy. Wycofany. Niewidzialny.

Grałem chłopaka, który „ma wyjebane”.
Bo w takim miejscu uczucia są zaproszeniem do ataku.
Tam nie uczysz się ufać. Tam uczysz się czytać ludzi szybciej niż oni czytają ciebie.

W nocy, kiedy świat gasł, a korytarze oddychały ciężko, leżałem i patrzyłem w sufit.
I pierwszy raz w życiu poczułem coś dziwnego. Nie strach. Nie złość. Uważność.

Jakby mózg, pozbawiony hałasu, zaczął działać ostrzej.
Jakby presja zamiast łamać - skupiała.
Zrozumiałem, że samotność nie zabija. Samotność kalibruje.

Największe kłamstwo ośrodka brzmiało: „Naprawiamy.”
Nie. Oni formatowali.
Ale ja nie dałem się skasować. Ja się zapisałem inaczej.
Zbierając dane. Obserwując reakcje. Ucząc się, kiedy milczeć, a kiedy patrzeć.

System boi się ludzi, którzy nie reagują automatycznie.
Kiedy wyszedłem po trzech latach, wyszedłem z filtrem prawdy i jedną raną: jeśli Bóg był w tym systemie - to milczał razem z nim.`
    },
    {
      id: 'rel_ch3',
      number: 3,
      title: 'ROZDZIAŁ 3 - ŚMIERĆ OJCA I PUSTE NIEBO',
      summary: 'Śmierć ojca, fałsz pogrzebowych formułek i pęknięcie dojrzałej iluzji opiekuńczego nieba.',
      readTimeMin: 9,
      content: `Kiedy umarł mój ojciec, nikt nie powiedział mi, co mam czuć.
Za to wszyscy mówili, w co mam wierzyć.

Telefon zadzwonił zwyczajnie. Bez dramatycznej muzyki. Bez zapowiedzi.
Jedno zdanie. Kilka sekund ciszy. I świat, który nie zatrzymał się ani na moment.

Ojciec nie był świętym. Nie był potworem. Był człowiekiem, który miał swoje demony i swoje milczenia.
I nagle go nie było.

Pamiętam pogrzeb. Kościół pełen ludzi, którzy przyszli „bo wypada”.
Ksiądz mówiący gotowe formułki: „Bóg tak chciał.” „Pan powołał go do siebie.” „Taka była Jego wola.”
Słuchałem tego i czułem tylko jedno: fałsz.
Nie bunt. Nie gniew. Fałsz, który śmierdział tanim pocieszeniem.

Patrzyłem na trumnę i nie czułem obecności Boga. Czułem pustkę.
I po raz pierwszy w życiu nie bałem się jej nazwać.

Gdzie był Bóg, kiedy mój ojciec gasł?
Dlaczego milczał, kiedy najbardziej go potrzebowałem?
Dostałem zakaz pytania: „Nie myśl tak.” „To grzech.” „Musisz zaufać.”

Ale ja już nie potrafiłem ufać w ciemno. Wiara po prostu przestała działać.
Jeśli Bóg istnieje tylko wtedy, gdy wszystko idzie dobrze — to nie jest Bóg. To jest bajka dla spokojnych ludzi.

Śmierć ojca zabiła iluzję. Zostałem sam, ale z czymś nowym: z odpowiedzialnością za własne myślenie.
„Jeśli Bóg istnieje - to musi być większy niż religia. A jeśli nie - to ja muszę nauczyć się żyć bez niego.”`
    },
    {
      id: 'rel_ch4',
      number: 4,
      title: 'ROZDZIAŁ 4 - UCIECZKA W SYSTEMY (PUŁAPKA ŚWIATŁA)',
      summary: 'Wpadnięcie w sidła popularnej ezoteryki, wibracji, znalezienie nowej formy poczucia winy i ostateczne odrzucenie powierzchownych doktryn.',
      readTimeMin: 10,
      content: `Kiedy przestałem wierzyć w ich Boga, nie stałem się wolny.
Stałem się łatwym celem.

Człowiek bez wiary nie zostaje pusty. Zostaje głodny sensu.
A głodnych sensu świat karmi najszybciej.

Najpierw przyszły książki. „Prawo przyciągania.” „Myśl pozytywnie.” „Wibracje.” „Sekret.”
Obiecywali wszystko, czego wtedy potrzebowałem: że ból ma sens, że strata to lekcja, że życie mnie nagrodzi.

Potem przyszła ezoteryka. Karty. Znaki. Synchronizacje. Pole. Przebudzenie.
Ludzie mówili: „Nie myśl za dużo.” „Zaufaj energii.” „Puść.”
I przez chwilę... działało. Czułem się lżejszy. Czułem, że wiem więcej niż inni.
Bo ego, które cierpiało latami, nagle dostało narkotyk: poczucie wyjątkowości.

Problem był jeden. Im więcej „duchowości”, tym mniej odpowiedzialności.
Zamiast działać - interpretowałem. Zamiast konfrontować się z bólem - obudowywałem go symbolami.

Kiedy coś się nie udawało, słyszałem: „Źle wibrujesz.” „Masz blokady.”
Czyli znowu - wina była moja. Tylko tym razem nie krzyczał ksiądz. Krzyczało „światło”.
Religia karała grzechem. Ezoteryka karała niedoskonałością. Inne opakowanie. Ten sam mechanizm.

Zrozumiałem to w momencie, kiedy siedziałem sam i pomyślałem:
„Jeśli wszystko zależy od energii... to dlaczego ja nadal cierpię?”

Systemy nie lubią ludzi, którzy pytają. Wyszedłem z tego z jednym zdaniem:
„Jeśli prawda nie działa w najgorszym momencie życia — to nie jest prawda.”
Ezoteryka dała mi język. Ale nie dała mi kręgosłupa. A ja potrzebowałem kręgosłupa.`
    }
  ],
  stats: {
    pageCount: 280,
    wordCount: 52000,
    readerCount: 114,
    estReadTimeMin: 140,
    votesCount: 88,
    partsCount: 20
  },
  platformLinks: {
    wattpad: 'https://www.wattpad.com/story/religioseeker',
    pdfUrl: '#religioseeker'
  },
  coverStyle: {
    bgGradient: 'from-amber-950 via-red-950 to-black',
    accentColor: '#f59e0b',
    pattern: 'brutalist',
    symbol: '🔥'
  },
  customHtmlWorld: {
    htmlCode: RELIGIOSEEKER_HTML,
    themeColor: '#f59e0b',
    terminalActive: true,
    worldName: 'RELIGIOSEEKER',
    authorName: 'Maciek Maciuszek (MaciekMaciuszek94)'
  }
};
