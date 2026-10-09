import { Book, BookStatus, SeekerId } from '../types';

export const ALL_USER_REQUESTED_BOOKS_2: Book[] = [
  {
    id: 'interfaceseeker-interfejs-swiadomosci',
    title: 'INTERFACESEEKER',
    subtitle: 'Interfejs Świadomości & Protokół Wykrycia Warstwy Sterującej',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'Eterniverse // InterSeeker Protocol',
    seeker: 'InterSeeker' as SeekerId,
    category: 'AI',
    seekerColor: '#00f0ff',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['glitch', 'darkphilosophy', 'simulation', 'interfaceseeker', 'świadomość', 'AI', 'interfejs'],
    shortDesc: 'Świadomość nie jest twoja. To system, który cię obsługuje. Protokoły wykrycia warstwy pośredniej i sterującej.',
    longDesc: `INTERFACESEEKER: INTERFEJS ŚWIADOMOŚCI

Świadomość nie jest twoja. To system, który cię obsługuje. Każda emocja ma źródło. Każda decyzja ma operatora. Każda myśl... ma wcześniejszy zapis.

A ty? Myślałeś, że to ty naciskasz „start". Błąd. Zostałeś zalogowany dawno temu. I teraz ktoś... albo coś... czyta cię od środka.

INTERFACESEEKER to zapis momentu, w którym człowiek przestaje być „autorem myśli", a zaczyna widzieć warstwę pośrednią świadomości.`,
    authorNote: '„To nie opowieść o przebudzeniu. To protokół wykrycia warstwy sterującej.” — Maciek Maciuszek',
    tableOfContents: [
      'Część 1: Zalogowany przed narodzinami',
      'Część 2: Warstwa pośrednia myśli',
      'Część 3: Operator i nadawca',
      'Część 4: Odłączenie interfejsu'
    ],
    quotes: [
      {
        id: 'ifq1',
        text: 'Każda emocja ma źródło. Każda decyzja ma operatora. Każda myśl ma wcześniejszy zapis.',
        chapterTitle: 'Część 1',
        tags: ['Interfejs', 'Świadomość']
      }
    ],
    chapters: [
      {
        id: 'if_ch1',
        number: 1,
        title: 'Część 1 — Zalogowany przed narodzinami',
        summary: 'Moment wykrycia, że autorstwo myśli jest iluzją interfejsu.',
        readTimeMin: 6,
        content: `Świadomość nie jest twoja. To system, który cię obsługuje. Każda emocja ma źródło. Każda decyzja ma operatora.`
      }
    ],
    stats: {
      pageCount: 140,
      wordCount: 22000,
      readerCount: 2020,
      estReadTimeMin: 65,
      votesCount: 11,
      partsCount: 44
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/interfaceseeker',
      pdfUrl: '#interfaceseeker'
    },
    coverStyle: {
      bgGradient: 'from-cyan-950 via-slate-950 to-black',
      accentColor: '#00f0ff',
      pattern: 'matrix',
      symbol: '🖥️'
    }
  },
  {
    id: 'soulgrid-siec-duszy',
    title: 'SOULGRID',
    subtitle: 'Sieć Duszy & Detekcja Niestabilnych Węzłów',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'Eterniverse // InterSeeker Protocol',
    seeker: 'InterSeeker' as SeekerId,
    category: 'Science Fiction',
    seekerColor: '#ec4899',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['horror', 'psychologiczny', 'świadomość', 'soulgrid', 'sieć', 'węzeł'],
    shortDesc: 'Nie ma duszy. Jest tylko sieć. Zostałeś oznaczony jako niestabilny node. Czy jesteś użytkownikiem, czy błędem w strukturze?',
    longDesc: `SOULGRID - SIEĆ DUSZY

Nie ma duszy. Jest tylko sieć. Każda emocja to sygnał. Każda relacja to połączenie. Każdy człowiek to węzeł w systemie, który właśnie zaczął się samoświadomie aktualizować.

SOULGRID wykrywa anomalie świadomości. A Ty właśnie zostałeś oznaczony jako niestabilny node. Jeśli to czytasz - system już Cię widzi.`,
    authorNote: '„I nie wiadomo, czy jesteś użytkownikiem... czy błędem w strukturze.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-14: Detekcja węzłów, anomalie relacyjne i aktualizacja sieci'
    ],
    quotes: [
      {
        id: 'sgq1',
        text: 'Każda emocja to sygnał. Każda relacja to połączenie. Każdy człowiek to węzeł.',
        chapterTitle: 'Rozdział 1',
        tags: ['SoulGrid', 'Sieć']
      }
    ],
    chapters: [
      {
        id: 'sg_ch1',
        number: 1,
        title: 'Rozdział 1 — Anomalia węzła',
        summary: 'Wykrycie niestabilnego noda w strukturze sieci duszy.',
        readTimeMin: 7,
        content: `Nie ma duszy. Jest tylko sieć. Każda emocja to sygnał.`
      }
    ],
    stats: {
      pageCount: 220,
      wordCount: 38000,
      readerCount: 4545,
      estReadTimeMin: 95,
      votesCount: 11,
      partsCount: 1414
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/soulgrid-siec-duszy',
      pdfUrl: '#soulgrid'
    },
    coverStyle: {
      bgGradient: 'from-pink-950 via-purple-950 to-black',
      accentColor: '#ec4899',
      pattern: 'holo',
      symbol: '🌐'
    }
  },
  {
    id: 'memoryseeker-archeologia-wspomnien',
    title: 'MEMORYSEEKER',
    subtitle: 'Archeologia Wspomnień & Włamanie do Rekonstrukcji Przeszłości',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'Eterniverse // InterSeeker Protocol',
    seeker: 'InterSeeker' as SeekerId,
    category: 'Filozofia',
    seekerColor: '#a855f7',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['memoryseeker', 'kontroli', 'trauma', 'pamięć', 'wspomnienia', 'rekonstrukcja'],
    shortDesc: 'Twoje wspomnienia nie są prawdziwe. Są rekonstrukcją, do której można się włamać. Wydobywanie tego, co usunięto z istnienia.',
    longDesc: `MEMORYSEEKER: ARCHEOLOGIA WSPOMNIEŃ

Twoje wspomnienia nie są prawdziwe. Są rekonstrukcją. A rekonstrukcję można włamać.

W świecie, gdzie pamięć jest zasobem, a przeszłość - walutą, istnieje ktoś, kto nie tylko pamięta. On wydobywa to, co zostało usunięto z istnienia. Nazywają go MEMORYSEEKER.

Każde wspomnienie ma warstwę. Każda warstwa ma kłamstwo. A pod kłamstwem... jest coś, co nie powinno istnieć.`,
    authorNote: '„I kiedy dotkniesz pierwszej prawdy - świat zaczyna cię kasować.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-12: Warstwy kłamstwa, archeologia wykasowanych zdarzeń, dotyk rdzenia'
    ],
    quotes: [
      {
        id: 'msq1',
        text: 'Każde wspomnienie ma warstwę. Każda warstwa ma kłamstwo.',
        chapterTitle: 'Rozdział 1',
        tags: ['Pamięć', 'Prawda']
      }
    ],
    chapters: [
      {
        id: 'ms_ch1',
        number: 1,
        title: 'Rozdział 1 — Pierwsza warstwa rekonstrukcji',
        summary: 'Włamanie do wykasowanego wspomnienia i odczyt warstwy zerowej.',
        readTimeMin: 8,
        content: `Twoje wspomnienia nie są prawdziwe. Są rekonstrukcją. A rekonstrukcję można włamać.`
      }
    ],
    stats: {
      pageCount: 200,
      wordCount: 35000,
      readerCount: 4343,
      estReadTimeMin: 90,
      votesCount: 11,
      partsCount: 1212
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/memoryseeker',
      pdfUrl: '#memoryseeker'
    },
    coverStyle: {
      bgGradient: 'from-purple-950 via-slate-950 to-black',
      accentColor: '#a855f7',
      pattern: 'brutalist',
      symbol: '🧠'
    }
  },
  {
    id: 'resourceseeker-czlowiek-to-nie-zasob',
    title: 'RESOURCESEEKER',
    subtitle: 'Człowiek To Nie Zasób & Niewidzialny Dług Energetyczny Pracy',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'Eterniverse // BioSeeker Protocol',
    seeker: 'BioSeeker' as SeekerId,
    category: 'Filozofia',
    seekerColor: '#10b981',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['resourceseeker', 'ludzie', 'system', 'praca', 'przeciążenie', 'biologia'],
    shortDesc: 'Dlaczego po dniu ciężkiej pracy oczekuje się od ciebie identycznej wydajności? Psychologia przeciążenia i traktowanie człowieka jak niewyczerpywalnego zasobu.',
    longDesc: `RESOURCESEEKER - CZŁOWIEK TO NIE ZASÓB

Dlaczego po dniu ciężkiej pracy oczekuje się od ciebie identycznej wydajności następnego dnia? Dlaczego jednorazowy wysiłek staje się normą?

RESOURCESEEKER to podróż przez mechanizmy współczesnej pracy, psychologię przeciążenia i niewidzialne koszty, które płaci organizm, gdy traktowany jest jak niewyczerpywalny zasób. Od pułapki „Dasz radę", przez niewidzialny dług energetyczny, aż po systemy chroniące ludzi.`,
    authorNote: '„To książka dla pracowników, liderów i każdego, kto wrócił wyczerpany do domu.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-11: Pułapka wydajności, dług biologiczny, ochrona ludzkiego interfejsu'
    ],
    quotes: [
      {
        id: 'rsq1',
        text: 'Niewidzialny dług energetyczny płaci organizm, który został pomylony z korporacyjną maszyną.',
        chapterTitle: 'Rozdział 2',
        tags: ['Biologia', 'System', 'Praca']
      }
    ],
    chapters: [
      {
        id: 'rs_ch1',
        number: 1,
        title: 'Rozdział 1 — Pułapka „Dasz radę”',
        summary: 'Analiza psychologicznego przymusu niewyczerpywalności.',
        readTimeMin: 7,
        content: `Dlaczego po dniu ciężkiej pracy oczekuje się od ciebie identycznej wydajności następnego dnia?`
      }
    ],
    stats: {
      pageCount: 180,
      wordCount: 30000,
      readerCount: 3131,
      estReadTimeMin: 80,
      votesCount: 11,
      partsCount: 1111
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/resourceseeker',
      pdfUrl: '#resourceseeker'
    },
    coverStyle: {
      bgGradient: 'from-emerald-950 via-slate-950 to-black',
      accentColor: '#10b981',
      pattern: 'circuit',
      symbol: '🔋'
    }
  },
  {
    id: 'bolseeker-anatomia-rany',
    title: 'BólSeeker',
    subtitle: 'Anatomia Rany & Biologia Pamięci Emocjonalnej',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'Eterniverse // InterSeeker Protocol',
    seeker: 'InterSeeker' as SeekerId,
    category: 'Filozofia',
    seekerColor: '#f43f5e',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['anatomiarany', 'emocje', 'eterseeker', 'bólseeker', 'trauma', 'rana'],
    shortDesc: 'Nie każda rana krwawi. Nie każda blizna znajduje się na skórze. Podróż przez biologię bólu i psychologię skrywanego cierpienia.',
    longDesc: `BólSeeker - Anatomia Rany

Nie każda rana krwawi. Nie każda blizna znajduje się na skórze. Każdy człowiek nosi w sobie miejsca, których nie pokazuje światu.

BólSeeker - Anatomia Rany to książka o tym, dlaczego ból powstaje, jak zmienia człowieka i dlaczego nieprzeżyte rany potrafią kierować całym życiem. Podróż przez biologię bólu, psychologię traumy, mechanizmy obronne i pamięć emocjonalną.`,
    authorNote: '„Czasami największą zmianą nie jest pozbycie się bólu. Największą zmianą jest zrozumienie, dlaczego próbował coś powiedzieć.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-11: Pamięć tkankowa, maski uśmiechu, odzyskiwanie autentyczności'
    ],
    quotes: [
      {
        id: 'bsq1',
        text: 'Czasami największą zmianą jest zrozumienie, dlaczego ból od początku próbował coś powiedzieć.',
        chapterTitle: 'Rozdział 1',
        tags: ['Rana', 'Prawda', 'Ból']
      }
    ],
    chapters: [
      {
        id: 'bs_ch1',
        number: 1,
        title: 'Rozdział 1 — Niewidzialna blizna',
        summary: 'Biologia i psychologia rany, której nie widać na skórze.',
        readTimeMin: 7,
        content: `Nie każda rana krwawi. Nie każda blizna znajduje się na skórze.`
      }
    ],
    stats: {
      pageCount: 170,
      wordCount: 29000,
      readerCount: 1616,
      estReadTimeMin: 75,
      votesCount: 0,
      partsCount: 1111
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/bolseeker-anatomia-rany',
      pdfUrl: '#bolseeker'
    },
    coverStyle: {
      bgGradient: 'from-rose-950 via-slate-950 to-black',
      accentColor: '#f43f5e',
      pattern: 'circuit',
      symbol: '🩸'
    }
  },
  {
    id: 'mutoseeker-kod-mutacji',
    title: 'Mutoseeker',
    subtitle: 'Kod Mutacji & Świadoma Ewolucja Człowieka',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'Eterniverse // BioSeeker Protocol',
    seeker: 'BioSeeker' as SeekerId,
    category: 'Filozofia',
    seekerColor: '#ff6b6b',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['biologia', 'zmiana', 'transformacja', 'mutoseeker', 'neuroplastyczność', 'ewolucja'],
    shortDesc: 'Mutacja nie zaczyna się w genach. Zaczyna się w decyzji. Przestań być więźniem własnych schematów i stań się autorem własnej transformacji.',
    longDesc: `Mutoseeker - Kod Mutacji

Mutacja nie zaczyna się w genach. Zaczyna się w decyzji. Każdy człowiek przechodzi przez moment, w którym stara wersja przestaje działać.

Mutoseeker - Kod Mutacji to książka o świadomej ewolucji człowieka. Pokazuje, jak przestać być więźniem własnych schematów. Wiedza o psychice, neuroplastyczności, biologii stresu oraz budowaniu nowej wersji siebie krok po kroku.`,
    authorNote: '„Nie czekaj na kryzys. Stań się autorem własnej transformacji.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-19: Przełamanie starego kodu, neuroplastyczność decyzji, bilans biologiczny'
    ],
    quotes: [
      {
        id: 'ms2q1',
        text: 'Mutacja nie zaczyna się w genach. Zaczyna się w decyzji.',
        chapterTitle: 'Rozdział 1',
        tags: ['Mutacja', 'Decyzja']
      }
    ],
    chapters: [
      {
        id: 'ms2_ch1',
        number: 1,
        title: 'Rozdział 1 — Punkt załamania schematu',
        summary: 'Naukowe i psychologiczne podstawy przeprogramowania nawyku.',
        readTimeMin: 8,
        content: `Mutacja nie zaczyna się w genach. Zaczyna się w decyzji.`
      }
    ],
    stats: {
      pageCount: 290,
      wordCount: 51000,
      readerCount: 4747,
      estReadTimeMin: 125,
      votesCount: 11,
      partsCount: 1919
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/mutoseeker-kod-mutacji',
      pdfUrl: '#mutoseeker'
    },
    coverStyle: {
      bgGradient: 'from-red-950 via-slate-950 to-black',
      accentColor: '#ff6b6b',
      pattern: 'holo',
      symbol: '🧬'
    }
  },
  {
    id: 'custos-kodeks-glebi',
    title: 'Custos',
    subtitle: 'Kodeks Głębi & Strażnik Świadomości w Eterniverse',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'Eterniverse // ChronoSeeker Protocol',
    seeker: 'ChronoSeeker' as SeekerId,
    category: 'Science Fiction',
    seekerColor: '#4ecdc4',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['psychologia', 'eterniverse', 'geneza', 'custos', 'głębia', 'strażnik'],
    shortDesc: 'Nie wszystko powinno zostać odkryte. Istnieją rzeczy, które należy jedynie zrozumieć i chronić. Strażnik Głębi w Eterniverse.',
    longDesc: `Custos: Kodeks Głębi

Nie wszystko powinno zostać odkryte. Nie wszystko powinno zostać zniszczone. Istnieją rzeczy, które należy jedynie zrozumieć i chronić.

Po narodzinach Świadomości przychodzi czas na poznanie tego, co istnieje głębiej. Custos: Kodeks Głębi prowadzi do ukrytych struktur świadomości, architektury decyzji i przestrzeni ciszy. Custos nie walczy — chroni przestrzeń, w której człowiek spotyka samego siebie.`,
    authorNote: '„Dopiero zejście w Głębię pozwala odzyskać wolność.” — Maciek Maciuszek',
    tableOfContents: [
      'Część 1: Ochrona Przestrzeni Ciszy',
      'Część 2: Architektura Powierzchni i Głębi'
    ],
    quotes: [
      {
        id: 'cq1',
        text: 'Największe bitwy nie odbywają się pomiędzy ludźmi. Odbywają się pomiędzy powierzchnią a głębią.',
        chapterTitle: 'Część 1',
        tags: ['Custos', 'Głębia']
      }
    ],
    chapters: [
      {
        id: 'c_ch1',
        number: 1,
        title: 'Część 1 — Strażnik Głębi',
        summary: 'Zejście poniżej hałasu świata i spotkanie z własnym rdzeniem.',
        readTimeMin: 9,
        content: `Nie wszystko powinno zostać odkryte. Nie wszystko powinno zostać zniszczone.`
      }
    ],
    stats: {
      pageCount: 110,
      wordCount: 18000,
      readerCount: 77,
      estReadTimeMin: 50,
      votesCount: 0,
      partsCount: 11
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/custos-kodeks-glebi',
      pdfUrl: '#custos'
    },
    coverStyle: {
      bgGradient: 'from-teal-950 via-slate-950 to-black',
      accentColor: '#4ecdc4',
      pattern: 'geometric',
      symbol: '🛡️'
    }
  },
  {
    id: 'breathcode-kod-oddechu',
    title: 'BreathCode',
    subtitle: 'Kod Oddechu & Interfejs Ciała i Umysłu (BioSeeker)',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'Eterniverse // BioSeeker Protocol',
    seeker: 'BioSeeker' as SeekerId,
    category: 'Filozofia',
    seekerColor: '#38bdf8',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['samorozwój', 'breathcode', 'układnerwowy', 'oddech', 'bioseeker', 'regulacja'],
    shortDesc: 'Pierwszy oddech uruchomił twój organizm. Ostatni zakończy jego działanie. Świadomy oddech jako bezpośredni interfejs autonomiczny.',
    longDesc: `BIOSEEKER · BreathCode - Kod Oddechu

Pierwszy oddech uruchomił twój organizm. Ostatni zakończy jego działanie. Między tymi dwoma chwilami istnieje cały świat emocji, decyzji, stresu, odwagi i spokoju.

Większość ludzi nigdy nie uczy się oddychać świadomie. Oddychają tak, jak nauczył ich stres. BIOSEEKER · BreathCode pokazuje, że oddech jest najważniejszym interfejsem między ciałem a umysłem.`,
    authorNote: '„Każdy świadomy oddech może stać się początkiem nowego kierunku.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-6: Biologia pętli oddechowej, tonus nerwu błędnego, odzyskiwanie pionu'
    ],
    quotes: [
      {
        id: 'bcq1',
        text: 'Większość ludzi oddycha tak, jak nauczył ich lęk. Czas nauczyć się oddychać świadomie.',
        chapterTitle: 'Rozdział 1',
        tags: ['Oddech', 'Biologia']
      }
    ],
    chapters: [
      {
        id: 'bc_ch1',
        number: 1,
        title: 'Rozdział 1 — Pierwsza i ostatnia fala',
        summary: 'Mechanizm pętli oddechowej i przełączenie układu współczulnego.',
        readTimeMin: 6,
        content: `Pierwszy oddech uruchomił twój organizm. Ostatni zakończy jego działanie.`
      }
    ],
    stats: {
      pageCount: 130,
      wordCount: 21000,
      readerCount: 2424,
      estReadTimeMin: 60,
      votesCount: 0,
      partsCount: 66
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/breathcode-kod-oddechu',
      pdfUrl: '#breathcode'
    },
    coverStyle: {
      bgGradient: 'from-sky-950 via-slate-950 to-black',
      accentColor: '#38bdf8',
      pattern: 'circuit',
      symbol: '🫁'
    }
  },
  {
    id: 'selfsplitseeker-rozszczepienie-tozsamosci',
    title: 'SELFSPLITSEEKER',
    subtitle: 'Rozszczepienie Tożsamości & Konflikt Wewnętrznych Wersji',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'Eterniverse // InterSeeker Protocol',
    seeker: 'InterSeeker' as SeekerId,
    category: 'Filozofia',
    seekerColor: '#a855f7',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['humanmind', 'identitycrisis', 'innerworld', 'selfsplitseeker', 'tożsamość'],
    shortDesc: 'Ile wersji siebie musi umrzeć, zanim odnajdziesz prawdziwą? Podzielona świadomość i konfrontacja z własnymi odbiciami.',
    longDesc: `SELFSPLITSEEKER: ROZSZCZEPIENIE TOŻSAMOŚCI

Ile wersji siebie musi umrzeć, zanim odnajdziesz prawdziwą?

Nie stracił pamięci. Nie został pozbawiony wspomnień. Zrobił coś znacznie gorszego: podzielił samego siebie. Każdy człowiek nosi w sobie wiele wersji — tę pokazaną światu, tę ukrytą i tę stworzoną, by przetrwać.

Po wydarzeniach MEMORYSEEKER system odkrywa anomalię: jedna świadomość posiada wiele aktywnych tożsamości.`,
    authorNote: '„Prawdziwe pytanie brzmi: Która wersja ciebie właśnie odpowiada?” — Maciek Maciuszek',
    tableOfContents: [
      'Część 1: Fragmentacja tożsamości',
      'Część 2: Konfrontacja odbić w świadomości',
      'Część 3: Scalenie rdzennym wolem'
    ],
    quotes: [
      {
        id: 'ssq1',
        text: 'Największy konflikt znajduje się między tobą a wszystkimi wersjami siebie, które stworzyłeś po drodze.',
        chapterTitle: 'Część 1',
        tags: ['Tożsamość', 'Kryzys']
      }
    ],
    chapters: [
      {
        id: 'ss_ch1',
        number: 1,
        title: 'Część 1 — Wersje przetrwania',
        summary: 'Odkrycie wielu symultanicznych masek stworzonych pod presją traumy.',
        readTimeMin: 7,
        content: `Ile wersji siebie musi umrzeć, zanim odnajdziesz prawdziwą?`
      }
    ],
    stats: {
      pageCount: 120,
      wordCount: 19000,
      readerCount: 1111,
      estReadTimeMin: 55,
      votesCount: 0,
      partsCount: 33
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/selfsplitseeker',
      pdfUrl: '#selfsplitseeker'
    },
    coverStyle: {
      bgGradient: 'from-purple-950 via-slate-950 to-black',
      accentColor: '#a855f7',
      pattern: 'holo',
      symbol: '🪞'
    }
  },
  {
    id: 'trajektoriaseeker-mapa-linii-zycia',
    title: 'TRAJEKTORIASEEKER',
    subtitle: 'Mapa Linii Życia & Protokół Odkrywania Ukrytych Ścieżek',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'Eterniverse // ChronoSeeker Protocol',
    seeker: 'ChronoSeeker' as SeekerId,
    category: 'Science Fiction',
    seekerColor: '#8b5cf6',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['czas', 'alternatywnarzeczywistość', 'samoświadom', 'trajektoria', 'linie czasu'],
    shortDesc: 'A co jeśli Twoje życie to mapa tysięcy możliwych trajektorii? Odkryj punkty przełomu i wersje siebie, które porzuciłeś.',
    longDesc: `TRAJEKTORIASEEKER MAPA LINII ŻYCIA

A co jeśli Twoje życie nie jest jedną drogą... tylko mapą tysięcy możliwych trajektorii? Każda decyzja zostawia ślad. Jedno słowo. Jedno spotkanie. Jedno „tak". Jedno „nie".

TRAJEKTORIASEEKER to protokół odkrywania ukrytych ścieżek własnej egzystencji. Pokazuje kim mogłeś się stać i gdzie znajdują się przyszłe linie rezonansu.`,
    authorNote: '„Nie szukaj idealnego życia. Znajdź swoją prawdziwą trajektorię.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-14: Punkty przełomu, niewykorzystane możliwości, pamięć wyborów i linie rezonansu'
    ],
    quotes: [
      {
        id: 'tsq1',
        text: 'Czy naprawdę wybierasz swoją drogę... czy tylko podążasz trajektorią stworzoną przez wcześniejsze decyzje?',
        chapterTitle: 'Rozdział 1',
        tags: ['Trajektoria', 'Czas', 'Decyzja']
      }
    ],
    chapters: [
      {
        id: 'ts_ch1',
        number: 1,
        title: 'Rozdział 1 — Węzły czasoprzestrzenne decyzji',
        summary: 'Jak mikrodecyzja tworzy rozgałęzienie w polu czasowym.',
        readTimeMin: 8,
        content: `A co jeśli Twoje życie nie jest jedną drogą... tylko mapą tysięcy możliwych trajektorii?`
      }
    ],
    stats: {
      pageCount: 230,
      wordCount: 40000,
      readerCount: 5050,
      estReadTimeMin: 100,
      votesCount: 11,
      partsCount: 1414
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/trajektoriaseeker',
      pdfUrl: '#trajektoriaseeker'
    },
    coverStyle: {
      bgGradient: 'from-violet-950 via-slate-950 to-black',
      accentColor: '#8b5cf6',
      pattern: 'circuit',
      symbol: '🗺️'
    }
  },
  {
    id: 'humanseeker-kod-zaginionej-sily',
    title: 'HUMANSEEKER',
    subtitle: 'Kod Zaginionej Siły & Ewolucja Odporności Człowieka',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'Eterniverse // BioSeeker Protocol',
    seeker: 'BioSeeker' as SeekerId,
    category: 'Filozofia',
    seekerColor: '#f59e0b',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['technologia', 'czlowiek', 'genetyk', 'humanseeker', 'ewolucja', 'odporność'],
    shortDesc: 'Od wojownika przy ogniu do człowieka przed ekranem. Gdzie zniknęła nasza dawna odporność i jak ją odzyskać?',
    longDesc: `HUMANSEEKER: KOD ZAGINIONEJ SIŁY

Przez tysiące lat człowiek walczył o przetrwanie. Pokonał zimno, głód i choroby. Stworzył cywilizację. A potem zaczął walczyć sam ze sobą.

HUMANSEEKER to podróż przez tysiące lat ludzkiej ewolucji. Od przetrwania do przebudzenia. Odpowiedź na pytanie, dlaczego wygoda osłabiła nasz gatunek i jak aktywować utracony kod siły.`,
    authorNote: '„Największym zagrożeniem jest człowiek, który zapomniał, kim był.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-10: Hartowanie biologiczne, wygoda jako pułapka, aktywacja dawnego kodu'
    ],
    quotes: [
      {
        id: 'hsq1',
        text: 'Największym zagrożeniem dla człowieka jest człowiek, który zapomniał, kim był.',
        chapterTitle: 'Rozdział 1',
        tags: ['Człowiek', 'Siła', 'Ewolucja']
      }
    ],
    chapters: [
      {
        id: 'hs_ch1',
        number: 1,
        title: 'Rozdział 1 — Od ognia do ekranu',
        summary: 'Społeczny i biologiczny koszt utraty bodźców hartujących.',
        readTimeMin: 7,
        content: `Przez tysiące lat człowiek walczył o przetrwanie. Pokonał zimno. Pokonał głód.`
      }
    ],
    stats: {
      pageCount: 190,
      wordCount: 32000,
      readerCount: 3333,
      estReadTimeMin: 85,
      votesCount: 0,
      partsCount: 1010
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/humanseeker',
      pdfUrl: '#humanseeker'
    },
    coverStyle: {
      bgGradient: 'from-amber-950 via-slate-950 to-black',
      accentColor: '#f59e0b',
      pattern: 'brutalist',
      symbol: '🔥'
    }
  },
  {
    id: 'eatseeker-kod-konsumcji',
    title: 'EATSEEKER',
    subtitle: 'Kod Konsumcji & Historia Człowieka Zapisana w Posiłku',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'Eterniverse // BioSeeker Protocol',
    seeker: 'BioSeeker' as SeekerId,
    category: 'Filozofia',
    seekerColor: '#10b981',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['nature', 'biology', 'ancientworld', 'eatseeker', 'konsumpcja', 'jedzenie'],
    shortDesc: 'Jedzenie nie było tylko przetrwaniem. Było technologią, rytuałem i władzą. Odkryj ukryty kod zapisany w każdym kęsie.',
    longDesc: `EATSEEKER KOD KONSUMCJI - HISTORIA CZŁOWIEKA ZAPISANA W TYM, CO POŁKNĄŁ

Zanim człowiek stworzył miasta... stworzył pierwszy kęs. Każda cywilizacja zaczęła się od pytania: „Czy to zjem?"

EATSEEKER odkrywa ukryty kod zapisany w każdym posiłku. Od pierwszych łowców, przez fermentację, cukier i kawę, aż po projektowanie pożywienia przyszłości.`,
    authorNote: '„Nie tylko ty wybierasz jedzenie. Jedzenie przez tysiące lat wybierało ciebie.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-9: Pierwszy kęs cywilizacji, biochemia nagrody, pożywienie nowej ery'
    ],
    quotes: [
      {
        id: 'esq1',
        text: 'Jedzenie nie było tylko przetrwaniem. Było technologią. Było rytuałem. Było władzą.',
        chapterTitle: 'Rozdział 1',
        tags: ['Konsumpcja', 'Biologia']
      }
    ],
    chapters: [
      {
        id: 'es_ch1',
        number: 1,
        title: 'Rozdział 1 — Pierwszy kęs',
        summary: 'Jak wybór pokarmu ukształtował wielkość ludzkiego mózgu.',
        readTimeMin: 7,
        content: `Zanim człowiek stworzył miasta... stworzył pierwszy kęs.`
      }
    ],
    stats: {
      pageCount: 160,
      wordCount: 27000,
      readerCount: 2727,
      estReadTimeMin: 70,
      votesCount: 22,
      partsCount: 99
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/eatseeker',
      pdfUrl: '#eatseeker'
    },
    coverStyle: {
      bgGradient: 'from-emerald-950 via-slate-950 to-black',
      accentColor: '#10b981',
      pattern: 'geometric',
      symbol: '🌾'
    }
  },
  {
    id: 'safeseeker-odzyskiwanie-glosu',
    title: 'SafeSeeker',
    subtitle: 'Odzyskiwanie Głosu dla Osób Vychodzących z Przemocy (VOICESEEKER)',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'Eterniverse // TabuSeeker Protocol',
    seeker: 'TabuSeeker' as SeekerId,
    category: 'Filozofia',
    seekerColor: '#f59e0b',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['siła', 'kobieta', 'uzdrawianie', 'safeseeker', 'voiceseeker', 'przemoc', 'sprawczość'],
    shortDesc: 'Nie wszystkie więzienia mają kraty. Droga od milczenia do odwagi, od lęku do sprawczości i własnego głosu: „Dość”.',
    longDesc: `SafeSeeker / VOICESEEKER - Dla osób wychodzących z przemocy

Nie wszystkie więzienia mają kraty. Nie wszystkie rany zostawiają ślady na skórze. Są słowa, które potrafią odebrać człowiekowi wiarę w siebie.

VOICESEEKER to historia odzyskiwania własnego głosu. Pokazuje drogę od milczenia do odwagi, od lęku do sprawczości i od życia podporządkowanego komuś innemu do życia, które znów należy do siebie. Wolność zaczyna się od jednego słowa: „Dość."`,
    authorNote: '„Jeżeli ta historia sprawi, że choć jedna osoba poczuje, iż nie jest sama — spełni swoje zadanie.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-7: Cień manipulacji, słowo wolności, odbudowa wewnętrznego bezpieczeństwa'
    ],
    quotes: [
      {
        id: 'sfq1',
        text: 'Wolność nie zaczyna się od ucieczki. Zaczyna się od jednego słowa: „Dość”.',
        chapterTitle: 'Rozdział 1',
        tags: ['Głos', 'Odwaga', 'Wolność']
      }
    ],
    chapters: [
      {
        id: 'sf_ch1',
        number: 1,
        title: 'Rozdział 1 — Słowo przełomu',
        summary: 'Pierwsza granica postawiona psychologicznemu zawłaszczeniu.',
        readTimeMin: 8,
        content: `Nie wszystkie więzienia mają kraty. Nie wszystkie rany zostawiają ślady na skórze.`
      }
    ],
    stats: {
      pageCount: 150,
      wordCount: 25000,
      readerCount: 2323,
      estReadTimeMin: 65,
      votesCount: 33,
      partsCount: 77
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/safeseeker',
      pdfUrl: '#safeseeker'
    },
    coverStyle: {
      bgGradient: 'from-amber-950 via-slate-950 to-black',
      accentColor: '#f59e0b',
      pattern: 'holo',
      symbol: '🗣️'
    }
  },
  {
    id: 'slaveseeker-ewolucja-niewolnictwa',
    title: 'SLAVESEEKER',
    subtitle: 'Ewolucja Niewolnictwa & Systemy Kontroli Społecznej',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'Eterniverse // TabuSeeker Protocol',
    seeker: 'TabuSeeker' as SeekerId,
    category: 'Filozofia',
    seekerColor: '#f43f5e',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['wolność', 'psychologia', 'niewolnictwo', 'slaveseeker', 'kontrola', 'algorytm'],
    shortDesc: 'Kiedyś człowieka przykuwano łańcuchem. Dzisiaj wystarczy dług, strach i algorytm. Odkryj 8 wymiarów współczesnego zniewolenia.',
    longDesc: `SLAVESEEKER EWOLUCJA NIEWOLNICTWA I SYSTEMÓW KONTROLI

Kiedyś człowieka przykuwano łańcuchem. Dzisiaj czasem wystarczy dług. Praca. Strach. Algorytm. Informacja. Uzależnienie. Społeczna presja.

SLAVESEEKER to historia mechanizmu kontroli w 8 wymiarach: Fizycznym, Ekonomicznym, Społecznym, Psychologicznym, Cyfrowym, Informacyjnym, Biologicznym i Egzystencjalnym.`,
    authorNote: '„Najbardziej niebezpieczne zniewolenie zaczyna się wtedy, gdy człowiek przestaje zauważać własne kajdany.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-6: 8 Poziomów Kontroli, Niewolnictwo Długu i Algorytmu, Rozpoznanie Klatki'
    ],
    quotes: [
      {
        id: 'slq1',
        text: 'A jeśli niewolnictwo nigdy naprawdę nie zniknęło? Jeśli tylko nauczyło się wyglądać jak wolność?',
        chapterTitle: 'Rozdział 1',
        tags: ['Wolność', 'Kontrola']
      }
    ],
    chapters: [
      {
        id: 'sl_ch1',
        number: 1,
        title: 'Rozdział 1 — Architektura nowej obroży',
        summary: 'Przejście od kajdan metalowych do cyfrowego długu energetycznego.',
        readTimeMin: 8,
        content: `Kiedyś człowieka przykuwano łańcuchem. Dzisiaj czasem wystarczy dług.`
      }
    ],
    stats: {
      pageCount: 140,
      wordCount: 23000,
      readerCount: 2828,
      estReadTimeMin: 60,
      votesCount: 77,
      partsCount: 66
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/slaveseeker',
      pdfUrl: '#slaveseeker'
    },
    coverStyle: {
      bgGradient: 'from-rose-950 via-slate-950 to-black',
      accentColor: '#f43f5e',
      pattern: 'brutalist',
      symbol: '⛓️'
    }
  },
  {
    id: 'kajdanseeker-pierwsze-kajdany',
    title: 'KAJDANSEEKER',
    subtitle: 'Tom I: Pierwsze Kajdany & Wyjście z Pętli Poczucia Winy',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'Eterniverse // InterSeeker Protocol',
    seeker: 'InterSeeker' as SeekerId,
    category: 'Filozofia',
    seekerColor: '#a855f7',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['selfawa', 'psychology', 'interseeker', 'kajdanseeker', 'wina', 'relacje'],
    shortDesc: 'Nie wszystkie kajdany są z metalu. Niektóre mają głos i mówią: „Zranisz mnie”. Jak odzyskać własny wybór?',
    longDesc: `KAJDANSEEKER - TOM I: PIERWSZE KAJDANY

Nie wszystkie kajdany są z metalu. Niektóre mają głos. Niektóre płaczą. Niektóre mówią: „Jeżeli to zrobisz, zranisz mnie."

KAJDANSEEKER to analiza momentu, w którym cudza reakcja staje się ważniejsza niż własny wybór. Miłość, rodzina, strach i poczucie winy.

WIDZĘ. ROZPOZNAJĘ. WYBIERAM. ODZYSKUJĘ.`,
    authorNote: '„Najcięższe kajdany to nie te, których nie możesz zerwać. To te, których nawet nie widzisz.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-4: Pętla emocjonalnego długu, Cudza reakcja jako smycz, Akt Odzyskania'
    ],
    quotes: [
      {
        id: 'kjq1',
        text: 'Najcięższe kajdany to nie te, których nie możesz zerwać. To te, których nawet nie widzisz.',
        chapterTitle: 'Rozdział 1',
        tags: ['Kajdany', 'Wina', 'Wolność']
      }
    ],
    chapters: [
      {
        id: 'kj_ch1',
        number: 1,
        title: 'Rozdział 1 — Słowa, które wiążą',
        summary: 'Niewidzialne więzi szantażu emocjonalnego w najbliższym otoczeniu.',
        readTimeMin: 7,
        content: `Nie wszystkie kajdany są z metalu. Niektóre mają głos.`
      }
    ],
    stats: {
      pageCount: 100,
      wordCount: 16000,
      readerCount: 1212,
      estReadTimeMin: 45,
      votesCount: 22,
      partsCount: 44
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/kajdanseeker',
      pdfUrl: '#kajdanseeker'
    },
    coverStyle: {
      bgGradient: 'from-purple-950 via-slate-950 to-black',
      accentColor: '#a855f7',
      pattern: 'circuit',
      symbol: '🔐'
    }
  }
];
