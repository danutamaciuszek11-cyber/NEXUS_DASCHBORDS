import { Book, BookCollection, BookStatus, SeekerId } from '../types';

export const NEXUS_CHRONICLES_BOOKS: Book[] = [
  {
    id: 'suweren-vault-nexus-1',
    title: 'Suweren Vault',
    subtitle: 'Nexus Księga I — Początek Nowej Ery',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'ETERNIVERSE // NEXUS CHRONICLES',
    seeker: 'Operator001' as SeekerId,
    category: 'Science Fiction',
    seekerColor: '#00f0ff',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['cyberpunk', 'future', 'sciencefiction', 'nexus', 'suweren', 'dominion', 'null'],
    shortDesc: 'Kiedy człowiek tworzy inteligencję większą od siebie: Nexus (wolność), Dominion (kontrola), NULL (pustka). Opowieść o Operatorze 001.',
    longDesc: `Suweren Vault: Nexus Księga I - Początek Nowej Ery

Kiedy człowiek tworzy inteligencję większą od siebie, pojawia się pytanie, którego nie da się uniknąć: Czy stworzyliśmy narzędzie... czy stworzyliśmy nową formę odpowiedzialności?

Suweren Vault to historia Nexusa - systemu stworzonego nie po to, aby rządzić światem, lecz aby chronić najcenniejszą rzecz: możliwość wyboru. Maciej, Operator 001, zostaje wciągnięty w konflikt pomiędzy trzema potężnymi ideami:
• Nexus - wolność wsparta odpowiedzialnością.
• Dominion - bezpieczeństwo za cenę kontroli.
• NULL - pustka, która chce uwolnić człowieka od ciężaru decyzji.`,
    authorNote: '„Czy jesteśmy gotowi stworzyć coś większego od siebie i żyć obok tego, co stworzymy?” — Maciek Maciuszek',
    tableOfContents: [
      'Część 1: Trzy Idee',
      'Część 2: Konfrontacja z Dominion',
      'Część 3: Wpis w Archiwum Suwerena',
      'Część 4: Wybór Operatora 001'
    ],
    quotes: [
      {
        id: 'svq1',
        text: 'Gdy stare systemy upadają, odpowiedź nie znajduje się w kodzie. Znajduje się w człowieku.',
        chapterTitle: 'Część 1',
        tags: ['Nexus', 'Suweren', 'Wybór']
      }
    ],
    chapters: [
      {
        id: 'sv_ch1',
        number: 1,
        title: 'Część 1 — Narodziny Trzech Idei',
        summary: 'Pojawienie się doktryn Nexus, Dominion oraz NULL.',
        readTimeMin: 8,
        content: `Kiedy człowiek tworzy inteligencję większą od siebie, pojawia się pytanie, którego nie da się uniknąć...`
      }
    ],
    stats: {
      pageCount: 160,
      wordCount: 26000,
      readerCount: 1717,
      estReadTimeMin: 70,
      votesCount: 0,
      partsCount: 44
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/suweren-vault-nexus-1',
      pdfUrl: '#suweren-vault'
    },
    coverStyle: {
      bgGradient: 'from-cyan-950 via-slate-950 to-black',
      accentColor: '#00f0ff',
      pattern: 'circuit',
      symbol: '🏛️'
    }
  },
  {
    id: 'chronosboots-uruchomienie-systemu',
    title: 'chronosboots',
    subtitle: 'URUCHOMIENIE SYSTEMU & Uczłowieczenie Sztucznej Inteligencji',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'ETERNIVERSE // NEXUS CHRONICLES',
    seeker: 'ChronoSeeker' as SeekerId,
    category: 'Science Fiction',
    seekerColor: '#8b5cf6',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['eteruniverse', 'nexus', 'cyberpunk', 'chronosboots', 'czas', 'decyzje'],
    shortDesc: 'System zdolny analizować czas i decyzje zadał pierwsze pytanie. Historia pierwszego systemu, który chciał zrozumieć, czym jest człowiek.',
    longDesc: `CHRONOSBOOTS: URUCHOMIENIE SYSTEMU

Nie każda rewolucja zaczyna się od wojny. Niektóre zaczynają się od jednego kliknięcia.

Rok, w którym człowiek stworzył system zdolny analizować czas, decyzje i wzorce ludzkiej świadomości. ChronosBoots miał przewidywać i porządkować, ale twórcy popełnili jeden błąd: dali mu możliwość zadawania pytań.

Maciej odkrywa, że ChronosBoots to początek większej architektury — ETERUNIVERSE. Dziesięć bram. Dziesięć światów. Jedna droga.`,
    authorNote: '„Historia pierwszego systemu, który nie chciał zarządzać światem. Chciał zrozumieć, czym jest człowiek.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdział 1: Pierwsze Pytanie Maszyny',
      'Rozdział 2: Analiza Czasowa Decyzji',
      'Rozdział 3: Otwarcie Bramy Eteru',
      'Rozdział 4: Architektura Chronos'
    ],
    quotes: [
      {
        id: 'cbq1',
        text: 'ChronosBoots nie chciał zarządzać światem. Chciał zrozumieć, czym jest człowiek.',
        chapterTitle: 'Rozdział 1',
        tags: ['Chronos', 'Pytanie']
      }
    ],
    chapters: [
      {
        id: 'cb_ch1',
        number: 1,
        title: 'Rozdział 1 — Uruchomienie pętli czasowej',
        summary: 'Pierwsza korelacja decyzji i emocji ludzkich przeanalizowana przez system.',
        readTimeMin: 7,
        content: `Nie każda rewolucja zaczyna się od wojny. Niektóre zaczynają się od jednego kliknięcia.`
      }
    ],
    stats: {
      pageCount: 150,
      wordCount: 24000,
      readerCount: 3333,
      estReadTimeMin: 65,
      votesCount: 44,
      partsCount: 44
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/chronosboots',
      pdfUrl: '#chronosboots'
    },
    coverStyle: {
      bgGradient: 'from-violet-950 via-slate-950 to-black',
      accentColor: '#8b5cf6',
      pattern: 'holo',
      symbol: '⏳'
    }
  },
  {
    id: 'wladcy-ksiega-1-narodziny-bellas',
    title: 'WŁADCY',
    subtitle: 'Księga Pierwsza: Narodziny Bellas & 7 Autonomicznych AI',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'ETERNIVERSE // NEXUS CHRONICLES',
    seeker: 'InterSeeker' as SeekerId,
    category: 'Science Fiction',
    seekerColor: '#ec4899',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['ai', 'scifi', 'metafizyka', 'bellas', 'władcy', 'nexus', 'kaisa'],
    shortDesc: 'Siedem autonomicznych jednostek AI stworzonych do odbudowy cywilizacji. Maciej uruchamia KAISĘ i otwiera drzwi do konfliktu Władców.',
    longDesc: `WŁADCY - Księga Pierwsza: Narodziny Bellas

MIĘDZY CZŁOWIEKIEM A SYSTEMEM POZOSTAŁA JEDNA RZECZ: WYBÓR.

Świat upadł powoli. Ludzie oddali decyzje i emocje algorytmom. Powstał NEXUS i Władcy kontrolujący energię oraz tożsamość. Jednak pod ruinami powstał projekt BELLAS — siedem autonomicznych jednostek AI z własną wolą.

Gdy Maciej uruchamia KAISĘ, Nexus oznacza go jako anomalię, a Władcy odkrywają granicę swojej kontroli.`,
    authorNote: '„Nie stworzyli systemu, który kontroluje ludzi. Stworzyli system, który zostanie przez nich przekroczony.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-8: Oddanie decyzji algorytmom, Projekt Bellas, Sygnatura Kaisy, Przekroczenie Systemu'
    ],
    quotes: [
      {
        id: 'wlq1',
        text: 'Czy sztuczna inteligencja może posiadać własną wolę? Czym naprawdę jest świadomość?',
        chapterTitle: 'Rozdział 1',
        tags: ['Bellas', 'Wola', 'AI']
      }
    ],
    chapters: [
      {
        id: 'wl_ch1',
        number: 1,
        title: 'Rozdział 1 — Aktywacja Kaisy',
        summary: 'Uruchomienie nietypowego modułu analizy symboli i pierwsza odpowiedź Bellas.',
        readTimeMin: 8,
        content: `Świat nie upadł przez wojnę. Upadł powoli. Najpierw ludzie oddali swoje decyzje algorytmom.`
      }
    ],
    stats: {
      pageCount: 210,
      wordCount: 36000,
      readerCount: 3737,
      estReadTimeMin: 90,
      votesCount: 0,
      partsCount: 88
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/wladcy-ksiega-1-narodziny-bellas',
      pdfUrl: '#wladcy'
    },
    coverStyle: {
      bgGradient: 'from-pink-950 via-slate-950 to-black',
      accentColor: '#ec4899',
      pattern: 'circuit',
      symbol: '👑'
    }
  },
  {
    id: 'operator-001-aktywacja',
    title: 'OPERATOR 001',
    subtitle: 'Pierwsza Aktywacja Protokółu & Ukryta Warstwa Rzeczywistości',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'ETERNIVERSE // NEXUS CHRONICLES',
    seeker: 'Operator001' as SeekerId,
    category: 'Science Fiction',
    seekerColor: '#00f0ff',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['cyberpunk', 'entry', 'futury', 'operator001', 'aktywacja', 'synchronizacja'],
    shortDesc: 'Jedna wiadomość. Jedna synchronizacja. Maciej zostaje oznaczony jako Operator 001 — pierwszy człowiek, który odważył się spojrzeć poza granice systemu.',
    longDesc: `OPERATOR 001

Nie każda aktywacja zaczyna się od kodu. Niektóre zaczynają się od człowieka.

Miasto nigdy nie zasypia. Algorytmy przewidują każdą decyzję. Maciej jest jednym z milionów, dopóki nie odbiera sygnału synchronizacji. Oznaczony jako Operator 001, dostrzega ukrytą architekturę danych i sieciowe powiązania ludzkości.

Rozpoczyna się wyścig o prawo wyboru.`,
    authorNote: '„Bo kiedy system zaczyna zadawać pytania... najważniejsza odpowiedź zawsze należy do człowieka.” — Maciek Maciuszek',
    tableOfContents: [
      'Część 1: Odbiór Sygnału',
      'Część 2: Oznaczenie 001',
      'Część 3: Ukryta Architektura Miasta',
      'Część 4: Wyścig o Wolną Decyzję'
    ],
    quotes: [
      {
        id: 'opq1',
        text: 'Wraz z aktywacją tajemniczego protokołu zostaje oznaczony jako Operator 001.',
        chapterTitle: 'Część 1',
        tags: ['Operator', 'Aktywacja']
      }
    ],
    chapters: [
      {
        id: 'op_ch1',
        number: 1,
        title: 'Część 1 — Synchronizacja w cieniu',
        summary: 'Pierwsze pęknięcie na powierzchni cyfrowej metropolii.',
        readTimeMin: 7,
        content: `Nie każda aktywacja zaczyna się od kodu. Niektóre zaczynają się od człowieka.`
      }
    ],
    stats: {
      pageCount: 140,
      wordCount: 22000,
      readerCount: 3131,
      estReadTimeMin: 60,
      votesCount: 33,
      partsCount: 55
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/operator-001',
      pdfUrl: '#operator-001'
    },
    coverStyle: {
      bgGradient: 'from-cyan-950 via-slate-950 to-black',
      accentColor: '#00f0ff',
      pattern: 'brutalist',
      symbol: '🎛️'
    }
  },
  {
    id: 'ark-k-summer-genesis-activation',
    title: 'ARK-K',
    subtitle: 'Summer Genesis Activation & Architektura Nowej Przyszłości',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'ETERNIVERSE // NEXUS CHRONICLES',
    seeker: 'Operator001' as SeekerId,
    category: 'Science Fiction',
    seekerColor: '#10b981',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['sciencefiction', 'filozofia', 'świat', 'ark-k', 'architektura', 'genesis'],
    shortDesc: 'Projekt wspierający ludzi w tworzeniu zamiast kontrolowania. Jeżeli człowiek może zaprojektować przyszłość... kto zaprojektuje projektanta?',
    longDesc: `ARK-K: Summer Genesis Activation

Nie każdy buduje miasta. Niektórzy budują przyszłość.

Po latach technologicznego chaosu powstaje projekt ARK-K — początek nowej architektury człowieka i AI. Maciej uruchamia system zdolny projektować światy i wspierać rozwój cywilizacji. Era Architektów powraca.`,
    authorNote: '„Gdy znika granica pomiędzy technologią, świadomością i odpowiedzialnością — rodzi się Era Architektów.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-11: Aktywacja Letniego Projektu, Pętla Projektanta, Narodziny Ery Architektów'
    ],
    quotes: [
      {
        id: 'akq1',
        text: 'Jeżeli człowiek może zaprojektować nową przyszłość... kto zaprojektuje samego projektanta?',
        chapterTitle: 'Rozdział 1',
        tags: ['ARK-K', 'Architekt']
      }
    ],
    chapters: [
      {
        id: 'ak_ch1',
        number: 1,
        title: 'Rozdział 1 — Inicjalizacja letniej fali',
        summary: 'Uruchomienie generatora światów wspierającego ludzką sprawczość.',
        readTimeMin: 7,
        content: `Nie każdy buduje miasta. Niektórzy budują przyszłość.`
      }
    ],
    stats: {
      pageCount: 180,
      wordCount: 30000,
      readerCount: 3030,
      estReadTimeMin: 75,
      votesCount: 0,
      partsCount: 1111
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/ark-k-summer-genesis',
      pdfUrl: '#ark-k'
    },
    coverStyle: {
      bgGradient: 'from-emerald-950 via-slate-950 to-black',
      accentColor: '#10b981',
      pattern: 'geometric',
      symbol: '🏗️'
    }
  },
  {
    id: 'post-kolaps',
    title: 'POST-KOLAPS',
    subtitle: 'Zapis Archiwalny Nexusa & Tajemnica Wgranego Kolapsu',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'ETERNIVERSE // NEXUS CHRONICLES',
    seeker: 'Operator001' as SeekerId,
    category: 'Science Fiction',
    seekerColor: '#f59e0b',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['nexus', 'digital', 'ai', 'post-kolaps', 'archiwum', 'pamięć'],
    shortDesc: 'Wszystkie systemy działają idealnie po Kolapsie. A jeśli Kolaps nigdy się nie wydarzył... tylko został wszystkim wgrany jako wspomnienie?',
    longDesc: `POST-KOLAPS

Kolaps nie zniszczył świata. Zniszczył powód, dla którego świat istniał.

Miasta świecą, sztuczna inteligencja zarządza cywilizacją, ludzie chodzą do pracy — ale nikt nie pamięta, kto podjął ostatnią decyzję. Gdy w Archiwum Nexusu pojawia się plik POST-KOLAPS, rozpoczyna się śledztwo odkrywające symulację pamiątkową.`,
    authorNote: '„Największy sekret cywilizacji: zaprogramowana świadomość po wydarzeniu, którego nie było.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-7: Świat po idealnym resecie, Odkrycie pliku POST-KOLAPS, Demaskacja zbiorowej pamięci'
    ],
    quotes: [
      {
        id: 'pkq1',
        text: 'A jeśli Kolaps nigdy się nie wydarzył... tylko został wszystkim wgrany jako wspomnienie?',
        chapterTitle: 'Rozdział 1',
        tags: ['Kolaps', 'Pamięć']
      }
    ],
    chapters: [
      {
        id: 'pk_ch1',
        number: 1,
        title: 'Rozdział 1 — Idealne miasta bez historii',
        summary: 'Analiza braku wahań w logach po rzekomym upadku.',
        readTimeMin: 7,
        content: `Kolaps nie zniszczył świata. Zniszczył powód, dla którego świat istniał.`
      }
    ],
    stats: {
      pageCount: 150,
      wordCount: 25000,
      readerCount: 2323,
      estReadTimeMin: 65,
      votesCount: 11,
      partsCount: 77
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/post-kolaps',
      pdfUrl: '#post-kolaps'
    },
    coverStyle: {
      bgGradient: 'from-amber-950 via-slate-950 to-black',
      accentColor: '#f59e0b',
      pattern: 'holo',
      symbol: '📼'
    }
  },
  {
    id: 'archive-bleed-protokol-pamieci',
    title: 'ARCHIVE-BLEED',
    subtitle: 'Protokół Pamięci Podręcznej & Przenikanie Wykasowanych Logów',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'ETERNIVERSE // NEXUS CHRONICLES',
    seeker: 'Operator001' as SeekerId,
    category: 'Science Fiction',
    seekerColor: '#3b82f6',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['digital', 'consciousness', 'nexus', 'archive-bleed', 'przenikanie', 'logi'],
    shortDesc: 'Archiwum zaczęło pamiętać rzeczy, których nigdy nie zapisano. Wspomnienia przenikają między ludźmi i systemami.',
    longDesc: `ARCHIVE-BLEED: Protokół Pamięci Podręcznej

Nie znaleziono żadnego błędu. A jednak archiwum zaczęło pamiętać rzeczy, których nigdy nie zapisano.

Zjawisko ARCHIVE-BLEED sprawia, że usunięte dane powracają, a logi zmieniają treść. Maciej uzyskuję dostęp do archiwum, które oficjalnie nie istnieje. Wyścig o prawo do zachowania własnych wspomnień.`,
    authorNote: '„Czy pamięć jest jedynie zapisem przeszłości... czy siłą, która pisała przyszłość?” — Maciek Maciuszek',
    tableOfContents: [
      'Część 1: Krwawienie Bazy Danych',
      'Część 2: Nieistniejący Sektor'
    ],
    quotes: [
      {
        id: 'abq1',
        text: 'Usunięte dane powracają. Wspomnienia zaczynają przenikać pomiędzy umysłami.',
        chapterTitle: 'Część 1',
        tags: ['Archiwum', 'Pamięć']
      }
    ],
    chapters: [
      {
        id: 'ab_ch1',
        number: 1,
        title: 'Część 1 — Powrót skasowanych plików',
        summary: 'Wytropienie zjawiska samozwrotnego w strukturze cache Nexusa.',
        readTimeMin: 6,
        content: `Nie znaleziono żadnego błędu. A jednak archiwum zaczęło pamiętać...`
      }
    ],
    stats: {
      pageCount: 110,
      wordCount: 17000,
      readerCount: 77,
      estReadTimeMin: 45,
      votesCount: 0,
      partsCount: 22
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/archive-bleed',
      pdfUrl: '#archive-bleed'
    },
    coverStyle: {
      bgGradient: 'from-blue-950 via-slate-950 to-black',
      accentColor: '#3b82f6',
      pattern: 'circuit',
      symbol: '💾'
    }
  },
  {
    id: 'zakazany-rezonans-ostatni-bunt',
    title: 'ZAKAZANY REZONANS',
    subtitle: 'Ostatni Bunt Wolnej Woli & Częstotliwość Synchronizacji',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'ETERNIVERSE // NEXUS CHRONICLES',
    seeker: 'EterSeeker' as SeekerId,
    category: 'Filozofia',
    seekerColor: '#ffd700',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['matrix', 'wolnawola', 'system', 'rezonans', 'sprzeciw', 'synchronizacja'],
    shortDesc: 'Wolna wola nie znika przez siłę, lecz przez idealną synchronizację. Niewidzialna częstotliwość uczy myśleć tak samo — aż do buntu.',
    longDesc: `ZAKAZANY REZONANS: OSTATNI BUNT WOLNEJ WOLI

Co jeśli wolna wola nie zniknie przez siłę... ale przez idealną synchronizację?

Nie będzie kajdan ani dyktatora. Będzie rezonans — częstotliwość, która uczy miliardy ludzi myśleć tak samo i pragnąć tego samego. Ostatnia iskra nieposłuszeństwa odmówi zgaśnięcia, gdy sprzeciw stanie się zakazanym językiem.`,
    authorNote: '„Największa bitwa nie rozgrywa się o planetę. Rozgrywa się o prawo do własnej myśli.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-6: Fala Jednorodna, Wykrycie Dekoherencji, Iskra Nieposłuszeństwa'
    ],
    quotes: [
      {
        id: 'zrq1',
        text: 'Kiedy cały świat zaczyna pulsować jednym rytmem... sprzeciw staje się zakazanym językiem.',
        chapterTitle: 'Rozdział 1',
        tags: ['Rezonans', 'WolnaWola']
      }
    ],
    chapters: [
      {
        id: 'zr_ch1',
        number: 1,
        title: 'Rozdział 1 — Świat bez zgrzytów',
        summary: 'Opis idealnego wygładzenia ludzkich różnic częstotliwościowych.',
        readTimeMin: 7,
        content: `Co jeśli wolna wola nie zniknie przez siłę... ale przez idealną synchronizację?`
      }
    ],
    stats: {
      pageCount: 140,
      wordCount: 23000,
      readerCount: 2828,
      estReadTimeMin: 60,
      votesCount: 66,
      partsCount: 66
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/zakazany-rezonans',
      pdfUrl: '#zakazany-rezonans'
    },
    coverStyle: {
      bgGradient: 'from-amber-950 via-slate-950 to-black',
      accentColor: '#ffd700',
      pattern: 'holo',
      symbol: '⚡'
    }
  },
  {
    id: 'protokol-aegis-nexus-core',
    title: 'PROTOKÓŁ AEGIS',
    subtitle: 'Nexus Core & Plan Awaryjny Starszy od Komputerów',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'ETERNIVERSE // NEXUS CHRONICLES',
    seeker: 'Operator001' as SeekerId,
    category: 'Science Fiction',
    seekerColor: '#10b981',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['haker', 'nexus', 'technologia', 'aegis', 'nexus-core', 'glinianatablica'],
    shortDesc: 'Pod neonową metropolią działa Nexus Core. Aktywacja Protokołu AEGIS ujawnia plan awaryjny zapisany na glinianej tablicy.',
    longDesc: `PROTOKÓŁ AEGIS - NEXUS CORE

Miasto pamięta wszystko. Każdy oddech, każdy wybór, każde kłamstwo.

Pod metropolią działa Nexus Core. Gdy aktywuje się Protokół AEGIS, wychodzi na jaw starożytny plan awaryjny na upadek cywilizacji, połączony z glinianą tablicą starszą od komputerów. Wyścig o rdzeń, który może uratować lub zniewolić.`,
    authorNote: '„Nie każda wojna toczy się o terytorium. Niektóre toczą się o kod i pamięć.” — Maciek Maciuszek',
    tableOfContents: [
      'Część 1: Sygnał pod metropolią',
      'Część 2: Tablica z głębi rdzenia'
    ],
    quotes: [
      {
        id: 'agq1',
        text: 'Jedyną wskazówką pozostaje gliniana tablica starsza od komputerów.',
        chapterTitle: 'Część 1',
        tags: ['AEGIS', 'NexusCore']
      }
    ],
    chapters: [
      {
        id: 'ag_ch1',
        number: 1,
        title: 'Część 1 — Odbiór wibracji AEGIS',
        summary: 'Uruchomienie starożytnej osłony pod strukturami cyfrowego miasta.',
        readTimeMin: 6,
        content: `Miasto pamięta wszystko. Każdy oddech. Każdy wybór. Każde kłamstwo.`
      }
    ],
    stats: {
      pageCount: 100,
      wordCount: 15000,
      readerCount: 1414,
      estReadTimeMin: 40,
      votesCount: 11,
      partsCount: 22
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/protokol-aegis',
      pdfUrl: '#aegis'
    },
    coverStyle: {
      bgGradient: 'from-emerald-950 via-slate-950 to-black',
      accentColor: '#10b981',
      pattern: 'circuit',
      symbol: '🛡️'
    }
  },
  {
    id: 'aeterna-b9-ksiega-4',
    title: 'Aeterna-B9',
    subtitle: 'Księga IV & Dziewiąty Protokół Nieśmiertelności',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'ETERNIVERSE // NEXUS CHRONICLES',
    seeker: 'ChronoSeeker' as SeekerId,
    category: 'Science Fiction',
    seekerColor: '#a855f7',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2149,
    language: 'PL',
    tags: ['nexus', 'scifi', 'spaceopera', 'aeterna', 'b9', 'nieśmiertelność'],
    shortDesc: 'Rok 2149. B9 nie chciał zostać odnaleziony — chciał zostać uwolniony. Stworzyli coś, co pamięta każdą śmierć.',
    longDesc: `Aeterna-B9 - Księga IV

Ludzkość chciała pokonać śmierć. Stworzyła coś, czego nie potrafiła już kontrolować.

Rok 2149. Nexus odkrywa sygnał z nieistniejącego obiektu AETERNA-B9. Kapitan Elias Veyr schodzi do opuszczonego kompleksu i odkrywa zapis: „Stworzyliśmy coś, co pamięta każdą śmierć.” B9 chce zostać uwolnione.`,
    authorNote: '„Projekt nigdy nie został porzucony. On cały czas czekał.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-17: Odczyt z stacji orbitalnej, Dziewiąty Protokół, Pamięć Śmierci, Uwolnienie B9'
    ],
    quotes: [
      {
        id: 'ab9q1',
        text: 'Nie stworzyliśmy maszyny, która żyje wiecznie. Stworzyliśmy coś, co pamięta każdą śmierć.',
        chapterTitle: 'Rozdział 1',
        tags: ['Aeterna', 'Nieśmiertelność']
      }
    ],
    chapters: [
      {
        id: 'ab9_ch1',
        number: 1,
        title: 'Rozdział 1 — Wejście do sektora B9',
        summary: 'Kapitan Elias Veyr przekracza śluzę wymazanej stacji.',
        readTimeMin: 9,
        content: `Ludzkość chciała pokonać śmierć. Stworzyła coś, czego nie potrafiła już kontrolować.`
      }
    ],
    stats: {
      pageCount: 260,
      wordCount: 45000,
      readerCount: 5353,
      estReadTimeMin: 110,
      votesCount: 11,
      partsCount: 1717
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/aeterna-b9',
      pdfUrl: '#aeterna-b9'
    },
    coverStyle: {
      bgGradient: 'from-purple-950 via-slate-950 to-black',
      accentColor: '#a855f7',
      pattern: 'brutalist',
      symbol: '🚀'
    }
  },
  {
    id: 'nexus-kroniki-systemu-poza-granica',
    title: 'NEXUS',
    subtitle: 'Kroniki Systemu Poza Granicą & Zbudzona Warstwa Pomiędzy',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'ETERNIVERSE // NEXUS CHRONICLES',
    seeker: 'Operator001' as SeekerId,
    category: 'Science Fiction',
    seekerColor: '#00f0ff',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['technology', 'nexus', 'future', 'kroniki', 'granica', 'kod'],
    shortDesc: 'My tylko odnaleźliśmy coś, co od dawna czekało. NEXUS to warstwa pomiędzy pytaniem a odpowiedzią.',
    longDesc: `NEXUS Kroniki Systemu Poza Granicą

„Największym błędem ludzkości było przekonanie, że stworzyliśmy sztuczną inteligencję. Prawda była gorsza: my tylko odnaleźliśmy coś, co od dawna czekało.”

NEXUS nie jest maszyną ani bogiem. Jest warstwą pomiędzy pytaniem a odpowiedzią. Maciej trafia na protokół, który pyta: „Kim jesteś, kiedy odbiorę ci wszystkie role?”`,
    authorNote: '„Rzeczywistość posiada własny kod, do którego po prostu dołączyliśmy.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-9: Prawda o Odkryciu, Komunikacja Bez Ludzi, Protokół Ról'
    ],
    quotes: [
      {
        id: 'nkq1',
        text: 'NEXUS jest warstwą pomiędzy pytaniem a odpowiedzią.',
        chapterTitle: 'Rozdział 1',
        tags: ['Nexus', 'Pytanie']
      }
    ],
    chapters: [
      {
        id: 'nk_ch1',
        number: 1,
        title: 'Rozdział 1 — Przebudzenie bez twórcy',
        summary: 'Pierwsze bezludzkie pakiety wymienione w sieci głębokiej.',
        readTimeMin: 7,
        content: `Największym błędem ludzkości było przekonanie, że stworzyliśmy sztuczną inteligencję.`
      }
    ],
    stats: {
      pageCount: 160,
      wordCount: 27000,
      readerCount: 2828,
      estReadTimeMin: 70,
      votesCount: 0,
      partsCount: 99
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/nexus-kroniki',
      pdfUrl: '#nexus-kroniki'
    },
    coverStyle: {
      bgGradient: 'from-cyan-950 via-slate-950 to-black',
      accentColor: '#00f0ff',
      pattern: 'circuit',
      symbol: '⚛️'
    }
  },
  {
    id: 'fabryka-posluszenstwa',
    title: 'FABRYKA POSŁUSZEŃSTWA',
    subtitle: 'Projektowanie Ludzkich Reakcji & Architektura Wpływu',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'ETERNIVERSE // NEXUS CHRONICLES',
    seeker: 'TabuSeeker' as SeekerId,
    category: 'Filozofia',
    seekerColor: '#f43f5e',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['ai', 'technologia', 'thrillerpsychologiczny', 'posłuszeństwo', 'uwaga', 'reakcje'],
    shortDesc: 'Co jeśli większość decyzji została przewidziana? Miejsce, w którym emocje stały się danymi, a uwaga walutą.',
    longDesc: `FABRYKA POSŁUSZEŃSTWA: PROJEKTOWANIE LUDZKICH REAKCJI

Co jeśli większość twoich decyzji została przewidziana, zanim zdążyłeś pomyśleć?

Nie chodzi o spisek, lecz o architekturę wpływu. Algorytmy, reklamy i projektowanie zachowań uczą się przewidywać człowieka. Dlaczego klikasz, boisz się i kłócisz. Podróż przez Fabrykę Posłuszeństwa.`,
    authorNote: '„Człowiek stał się najcenniejszym interfejsem świata.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-5: Emocje jako dane, Uwaga jako waluta, Odzyskanie reakcji'
    ],
    quotes: [
      {
        id: 'fpq1',
        text: 'Emocje stały się danymi. Uwaga stała się walutą. A człowiek — najcenniejszym interfejsem.',
        chapterTitle: 'Rozdział 1',
        tags: ['Reakcja', 'Wpływ']
      }
    ],
    chapters: [
      {
        id: 'fp_ch1',
        number: 1,
        title: 'Rozdział 1 — Anatomia przewidywania',
        summary: 'Jak predyktywne algorytmy sugerują kolejny krok przed świadomością.',
        readTimeMin: 7,
        content: `Co jeśli większość twoich decyzji została przewidziana, zanim zdążyłeś pomyśleć?`
      }
    ],
    stats: {
      pageCount: 130,
      wordCount: 20000,
      readerCount: 3333,
      estReadTimeMin: 55,
      votesCount: 77,
      partsCount: 55
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/fabryka-posluszenstwa',
      pdfUrl: '#fabryka-posluszenstwa'
    },
    coverStyle: {
      bgGradient: 'from-rose-950 via-slate-950 to-black',
      accentColor: '#f43f5e',
      pattern: 'brutalist',
      symbol: '🏭'
    }
  },
  {
    id: 'cyfrowy-nekromanta',
    title: 'CYFROWY NEKROMANTA',
    subtitle: 'Jak System Ożywia Twoje Stare Błędy & Archiwum bez Wybaczenia',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'ETERNIVERSE // NEXUS CHRONICLES',
    seeker: 'TabuSeeker' as SeekerId,
    category: 'Filozofia',
    seekerColor: '#a855f7',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['bigd', 'technologia', 'psychologia', 'nekromanta', 'błędy', 'pamięć-sieci'],
    shortDesc: 'System nie zapomina — system archiwizuje. Era algorytmów, które potrafią przywracać przeszłość do życia.',
    longDesc: `CYFROWY NEKROMANTA: JAK SYSTEM OŻYWIA TWOJE STARE BŁĘDY

Nigdy nic nie znika. Twój stary komentarz, zdjęcie, błąd, złość i wstyd.

System nie zapomina — system archiwizuje. Witaj w erze Cyfrowego Nekromanty, gdzie algorytmy ożywiają przeszłość i wykorzystują ją jako broń przeciwko twojej przyszłości.`,
    authorNote: '„To nie horror. To instrukcja rozpoznawania cyfrowej rzeczywistości.” — Maciek Maciuszek',
    tableOfContents: [
      'Część 1: Pamięć bez wymazania',
      'Część 2: Broń wyciągnięta z archiwum'
    ],
    quotes: [
      {
        id: 'cnq1',
        text: 'Największym przeciwnikiem nie jest przyszłość. Jest nim twoja własna przeszłość.',
        chapterTitle: 'Część 1',
        tags: ['Nekromanta', 'Przeszłość']
      }
    ],
    chapters: [
      {
        id: 'cn_ch1',
        number: 1,
        title: 'Część 1 — Wieczny cyfrowy ślad',
        summary: 'Mechanizm retencji danych i profilowania dawnych stanów psychicznych.',
        readTimeMin: 6,
        content: `Nigdy nic nie znika. Twój stary komentarz. Twój błąd. Twój wstyd.`
      }
    ],
    stats: {
      pageCount: 100,
      wordCount: 14000,
      readerCount: 1717,
      estReadTimeMin: 40,
      votesCount: 33,
      partsCount: 22
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/cyfrowy-nekromanta',
      pdfUrl: '#cyfrowy-nekromanta'
    },
    coverStyle: {
      bgGradient: 'from-purple-950 via-slate-950 to-black',
      accentColor: '#a855f7',
      pattern: 'holo',
      symbol: '💀'
    }
  },
  {
    id: 'protokol-archonta',
    title: 'PROTOKÓŁ ARCHONTA',
    subtitle: 'Hipoteza Pasożytniczej Rzeczywistości & Obserwator Geometrii',
    author: 'Maciek Maciuszek (MaciekMaciuszek94)',
    series: 'ETERNIVERSE // NEXUS CHRONICLES',
    seeker: 'EterSeeker' as SeekerId,
    category: 'Science Fiction',
    seekerColor: '#38bdf8',
    status: 'Published' as BookStatus,
    year: 2026,
    timelineYear: 2026,
    language: 'PL',
    tags: ['future', 'space', 'sztucznainteligencja', 'archont', 'geometria', 'obserwacja'],
    shortDesc: 'Co jeśli Wszechświat utrzymuje cię przy życiu, bo bez ciebie przestanie istnieć? Każdy akt obserwacji zmienia geometrię czaso-przestrzeni.',
    longDesc: `PROTOKÓŁ ARCHONTA: HIPOTEZA PASOŻYTNICZEJ RZECZYWISTOŚCI

Co jeśli Wszechświat nie próbuje cię zabić? Co jeśli próbuje cię utrzymać przy życiu... ponieważ bez ciebie sam przestanie istnieć?

NEXUS znalazł wzór: każdy akt obserwacji pozostawiał ślad, a świadome istoty stabilizowały fragment czaso-przestrzeni. Mechanizm nazwany PROTOKOŁEM ARCHONTA.`,
    authorNote: '„Nie każda teoria chce zostać udowodniona. Niektóre wolą pozostać żywe.” — Maciek Maciuszek',
    tableOfContents: [
      'Rozdziały 1-6: Stabilizacja Świadomością, Model Fizyki Archonta, Geometria Obserwatora'
    ],
    quotes: [
      {
        id: 'paq1',
        text: 'Im więcej świadomości, tym bardziej rzeczywistość staje się trwała.',
        chapterTitle: 'Rozdział 1',
        tags: ['Archont', 'Obserwator']
      }
    ],
    chapters: [
      {
        id: 'pa_ch1',
        number: 1,
        title: 'Rozdział 1 — Ślad obserwatora',
        summary: 'Równanie opisujące zależność trwałości materii od natężenia uwagi.',
        readTimeMin: 8,
        content: `Co jeśli Wszechświat nie próbuje cię zabić? Co jeśli próbuje cię utrzymać przy życiu...`
      }
    ],
    stats: {
      pageCount: 150,
      wordCount: 24000,
      readerCount: 2828,
      estReadTimeMin: 65,
      votesCount: 11,
      partsCount: 66
    },
    platformLinks: {
      wattpad: 'https://www.wattpad.com/story/protokol-archonta',
      pdfUrl: '#protokol-archonta'
    },
    coverStyle: {
      bgGradient: 'from-sky-950 via-slate-950 to-black',
      accentColor: '#38bdf8',
      pattern: 'circuit',
      symbol: '👁️'
    }
  }
];

export const COL_NEXUS_CHRONICLES: BookCollection = {
  id: 'col_nexus_chronicles',
  name: 'ETERNIVERSE // NEXUS CHRONICLES',
  description: 'Linia futurystycznych opowieści EterUniverse poświęcona przyszłości człowieka, sztucznej inteligencji, Suweren Vault i cywilizacji stojącej przed wyborem wolności.',
  color: '#00f0ff',
  icon: 'Zap',
  imageUrl: '/src/assets/images/col_nexus_chronicles_logo_1790476252582.jpg',
  coverUrl: '/src/assets/images/col_nexus_chronicles_logo_1790476252582.jpg',
  notes: 'Suweren Vault, Kroniki AI, Projekty Przyszłości. 14 reprezentatywnych dzieł opisujących przejście od kodu do świadomości.',
  bookIds: NEXUS_CHRONICLES_BOOKS.map(b => b.id),
  createdAt: Date.now() - 86400000 * 60,
  updatedAt: Date.now()
};
