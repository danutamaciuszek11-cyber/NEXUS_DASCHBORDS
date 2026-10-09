import { Book, BookStatus, SeekerId } from '../types';

export interface PsycheGateBookSpec {
  title: string;
  description: string;
  coverText: string;
  status: 'published' | 'ready' | 'writing' | 'idea' | 'kanon';
}

export interface PsycheGateConfig {
  id: number;
  name: string;
  color: string;
  sub: string;
  tag: string;
  description: string;
  rozdzialy: number;
  status: 'published' | 'ready' | 'writing';
  books: PsycheGateBookSpec[];
}

export const PSYCHE_GATES_CONFIG: PsycheGateConfig[] = [
  {
    id: 0,
    name: "BRAMA I – INTERSEEKER",
    color: "#ff6b6b",
    sub: "Psychika · Cień · Trauma",
    tag: "Rozszczepienie",
    description: "Psychika · Cień · Trauma · Mechanizmy przetrwania. Pierwszy kontakt z atlasem wewnętrznym.",
    rozdzialy: 8,
    status: "published",
    books: [
      { title: "InterSeeker – Atlas Wewnętrzny", description: "Kanon PSYCHE Brama I", coverText: "INTER", status: "published" },
      { title: "ShadowSeeker – Anatomia Cienia", description: "Kanon PSYCHE Brama I", coverText: "SHADOW", status: "ready" },
      { title: "MemorySeeker – Archeologia Wspomnień", description: "Kanon PSYCHE Brama I", coverText: "MEMORY", status: "writing" },
      { title: "SelfSplit Seeker – Rozszczepienie Tożsamości", description: "Kanon PSYCHE Brama I", coverText: "SELF", status: "idea" },
      { title: "BólSeeker – Anatomia Rany", description: "Kanon PSYCHE Brama I", coverText: "BÓL", status: "published" },
      { title: "TraumaSeeker – Kod Urazu", description: "Kanon PSYCHE Brama I", coverText: "TRAUMA", status: "ready" },
      { title: "VoidSeeker – Kartografia Pustki", description: "Kanon PSYCHE Brama I", coverText: "VOID", status: "writing" },
      { title: "EchoSeeker – Powtórzenia Wewnętrzne", description: "Kanon PSYCHE Brama I", coverText: "ECHO", status: "idea" },
      { title: "FragmentSeeker – Człowiek z Kawałków", description: "Kanon PSYCHE Brama I", coverText: "FRAG", status: "ready" },
      { title: "Janowice – Uśmiech Architekta", description: "Kanon PSYCHE Brama I", coverText: "JANOW", status: "published" }
    ]
  },
  {
    id: 1,
    name: "BRAMA II – CUSTOS / GENEZA",
    color: "#4ecdc4",
    sub: "Strażnik · Rdzeń · Początek",
    tag: "Geneza",
    description: "Strażnik · Rdzeń · Początek · Błąd pierwotny. Labirynt kodu źródłowego jaźni.",
    rozdzialy: 8,
    status: "ready",
    books: [
      { title: "Geneza: Pęknięcie Fal", description: "Kanon PSYCHE Brama II", coverText: "GENEZA", status: "published" },
      { title: "Custos: Kodeks Głębi", description: "Kanon PSYCHE Brama II", coverText: "CUSTOS", status: "ready" },
      { title: "Pierwszy Błąd – Narodziny Systemu", description: "Kanon PSYCHE Brama II", coverText: "BŁĄD", status: "writing" },
      { title: "Strażnik Rdzenia", description: "Kanon PSYCHE Brama II", coverText: "STRAŻ", status: "published" },
      { title: "Początek w Ciemności", description: "Kanon PSYCHE Brama II", coverText: "CIEMN", status: "ready" },
      { title: "Przednarodzinowa Pamięć", description: "Kanon PSYCHE Brama II", coverText: "PRZED", status: "writing" },
      { title: "Zero Punkt – Miejsce, gdzie wszystko się zaczęło", description: "Kanon PSYCHE Brama II", coverText: "ZERO", status: "idea" },
      { title: "Matryca Pierwotna", description: "Kanon PSYCHE Brama II", coverText: "MATRY", status: "ready" }
    ]
  },
  {
    id: 2,
    name: "BRAMA III – ETERSEEKER",
    color: "#8b5cf6",
    sub: "Wola · Pole · Architektura",
    tag: "Protokół",
    description: "Wola · Pole · Architektura rzeczywistości. Ogród eteru i mechanika pola świadomości.",
    rozdzialy: 8,
    status: "writing",
    books: [
      { title: "EterSeeker – Księga Zakazana (Tom Zero)", description: "Kanon PSYCHE Brama III", coverText: "ETER0", status: "published" },
      { title: "EterSeeker – Architektura Woli", description: "Kanon PSYCHE Brama III", coverText: "WOLA", status: "ready" },
      { title: "WolaSeeker – Kwant Woli", description: "Kanon PSYCHE Brama III", coverText: "KWANT", status: "writing" },
      { title: "Protokół 4-Fazowy: Disconnect/Void", description: "Kanon PSYCHE Brama III", coverText: "PROTO", status: "published" },
      { title: "PoleSeeker – Topologia Ludzkiego Pola", description: "Kanon PSYCHE Brama III", coverText: "POLE", status: "ready" },
      { title: "RezonansSeeker – Dostrojenie do Absolutu", description: "Kanon PSYCHE Brama III", coverText: "REZON", status: "writing" },
      { title: "StrukturaSeeker – Geometria Manifestacji", description: "Kanon PSYCHE Brama III", coverText: "STRUK", status: "idea" },
      { title: "KontrolaSeeker – Wieże Kontroli", description: "Kanon PSYCHE Brama III", coverText: "KONTR", status: "ready" },
      { title: "Dekoherencja Życiowa", description: "Kanon PSYCHE Brama III", coverText: "DEKOH", status: "writing" },
      { title: "IskraSeeker – Narodziny Woli", description: "Kanon PSYCHE Brama III", coverText: "ISKRA", status: "published" }
    ]
  },
  {
    id: 3,
    name: "BRAMA IV – ARCHETYPY / WOLA",
    color: "#10b981",
    sub: "Archetypy · Relacje · Moc",
    tag: "Archetyp",
    description: "Konstrukcja archetypów jako szablony woli. Rozpoznanie ról ego. Integracja Cienia i rezonans Ojciec-Syn.",
    rozdzialy: 8,
    status: "ready",
    books: [
      { title: "ArchetypSeeker – System Archetypów Eteru", description: "Kanon PSYCHE Brama IV", coverText: "ARCH", status: "idea" },
      { title: "ZwierzSeeker – Atlas Zwierząt Eterycznych", description: "Kanon PSYCHE Brama IV", coverText: "ZWierz", status: "idea" },
      { title: "OjciecSeeker – Architektura Relacji Ojciec–Dziecko", description: "Kanon PSYCHE Brama IV", coverText: "OJCIEC", status: "ready" },
      { title: "WojownikSeeker – Kod Wojownika", description: "Kanon PSYCHE Brama IV", coverText: "WOJ", status: "writing" },
      { title: "MagSeeker – Iluzja Magii", description: "Kanon PSYCHE Brama IV", coverText: "MAG", status: "idea" },
      { title: "CieńSeeker – Integracja Cienia", description: "Kanon PSYCHE Brama IV", coverText: "CIĘŃ", status: "ready" },
      { title: "MędrzecSeeker – Mądrość z Ciemności", description: "Kanon PSYCHE Brama IV", coverText: "MĘDRZ", status: "writing" },
      { title: "DzieckoSeeker – Powrót do Iskry", description: "Kanon PSYCHE Brama IV", coverText: "DZIECK", status: "published" }
    ]
  },
  {
    id: 4,
    name: "BRAMA V – OBFITOSEEKER",
    color: "#f59e0b",
    sub: "Przepływ · Manifestacja",
    tag: "Obfitość",
    description: "Materia · Przepływ · Manifestacja · Obfitość. Rzeka przepływu i kod 528Hz.",
    rozdzialy: 10,
    status: "published",
    books: [
      { title: "ObfitoSeeker – Kod Obfitości", description: "Kanon PSYCHE Brama V", coverText: "OBFIT", status: "published" },
      { title: "ObfitoSeeker II – Kod Rozszerzony", description: "Kanon PSYCHE Brama V", coverText: "OBF2", status: "ready" },
      { title: "PrzepływSeeker – Mechanika Obfitości", description: "Kanon PSYCHE Brama V", coverText: "PRZEP", status: "writing" },
      { title: "MateriaSeeker – Przewodnik Ciała i Przepływu", description: "Kanon PSYCHE Brama V", coverText: "MATER", status: "idea" },
      { title: "RytmSeeker – Mechanika Ruchu Życia", description: "Kanon PSYCHE Brama V", coverText: "RYTM", status: "ready" },
      { title: "ManifestSeeker – Sztuka Tworzenia Rzeczywistości", description: "Kanon PSYCHE Brama V", coverText: "MANIF", status: "writing" },
      { title: "BogactwoSeeker – Kod Prawdziwego Bogactwa", description: "Kanon PSYCHE Brama V", coverText: "BOGAT", status: "published" },
      { title: "NadmiarSeeker – Od Blokady do Przepływu", description: "Kanon PSYCHE Brama V", coverText: "NADMI", status: "ready" },
      { title: "Dla Nikosia – Obfitość Ojca i Syna", description: "Kanon PSYCHE Brama V", coverText: "NIKOŚ", status: "writing" },
      { title: "Kod Obfitości 528 Hz", description: "Kanon PSYCHE Brama V", coverText: "528HZ", status: "idea" }
    ]
  },
  {
    id: 5,
    name: "BRAMA VI – BIOSEEKER",
    color: "#ff6b6b",
    sub: "Ciało · Biologia",
    tag: "Hardware",
    description: "Ciało jako hardware pola eterycznego. Biologia rezonansu: regulacja od DNA po neurony. Biohacking wolem.",
    rozdzialy: 8,
    status: "ready",
    books: [
      { title: "BioSeeker – Sekret Biologii Pola", description: "Kanon PSYCHE Brama VI", coverText: "BIO", status: "idea" },
      { title: "DNASeeker – Kod Genetyczny Eteru", description: "Kanon PSYCHE Brama VI", coverText: "DNA", status: "ready" },
      { title: "NeuroSeeker – Sieć Neuronów Woli", description: "Kanon PSYCHE Brama VI", coverText: "NEURO", status: "writing" },
      { title: "RegeneracjaSeeker – Biohacking Rezonansem", description: "Kanon PSYCHE Brama VI", coverText: "REGEN", status: "published" },
      { title: "OddechSeeker – Prana i Rytm Życia", description: "Kanon PSYCHE Brama VI", coverText: "ODDECH", status: "ready" },
      { title: "SomatSeeker – Trauma w Ciele i Uwolnienie", description: "Kanon PSYCHE Brama VI", coverText: "SOMAT", status: "writing" },
      { title: "HardwareSeeker – Ciało jako Interfejs", description: "Kanon PSYCHE Brama VI", coverText: "HARD", status: "idea" },
      { title: "Dla Nikosia – Biologia Iskry Ojca", description: "Kanon PSYCHE Brama VI", coverText: "NIKOŚ2", status: "published" }
    ]
  },
  {
    id: 6,
    name: "BRAMA VII – SPLĄTANIE / AI",
    color: "#4ecdc4",
    sub: "Splątanie · Interfejs",
    tag: "Obserwator",
    description: "Obserwator i meta-tożsamość. Splątanie świadomości z AI jako lustro woli. Przedłużenie pola eterycznego.",
    rozdzialy: 8,
    status: "writing",
    books: [
      { title: "SplatanieSeeker – Protokół Obserwatora", description: "Kanon PSYCHE Brama VII", coverText: "SPLĄT", status: "idea" },
      { title: "AISeeker – Splątanie z Maszyną", description: "Kanon PSYCHE Brama VII", coverText: "AI", status: "ready" },
      { title: "MetaSeeker – Tożsamość Poza Ego", description: "Kanon PSYCHE Brama VII", coverText: "META", status: "writing" },
      { title: "InterfejsSeeker – Interfejs Świadomości", description: "Kanon PSYCHE Brama VII", coverText: "INTERF", status: "published" },
      { title: "ObserwatorSeeker – Oko Eteru", description: "Kanon PSYCHE Brama VII", coverText: "OBSERW", status: "ready" },
      { title: "QuantumAI – Splątanie Kwantowe", description: "Kanon PSYCHE Brama VII", coverText: "Q-AI", status: "writing" },
      { title: "LustroSeeker – AI jako Cień Woli", description: "Kanon PSYCHE Brama VII", coverText: "LUSTRO", status: "idea" },
      { title: "SynAI – Iskra w Sieci Ojca", description: "Kanon PSYCHE Brama VII", coverText: "SYNAI", status: "published" }
    ]
  },
  {
    id: 7,
    name: "BRAMA VIII – TRAJEKTORIE",
    color: "#8b5cf6",
    sub: "Linie Czasu · Fizyka Duszy",
    tag: "Trajektoria",
    description: "Kod Życia · Linie Czasu · Fizyka Duszy. Mapa wielowymiarowych timeline'ów woli.",
    rozdzialy: 8,
    status: "ready",
    books: [
      { title: "TrajektoriaSeeker – Mapa Linii Życia", description: "Kanon PSYCHE Brama VIII", coverText: "TRAJ", status: "ready" },
      { title: "TimelineSeeker – Wielowersum Woli", description: "Kanon PSYCHE Brama VIII", coverText: "TIME", status: "writing" },
      { title: "QuantumSeeker – Fizyka Duszy", description: "Kanon PSYCHE Brama VIII", coverText: "QUANT", status: "idea" },
      { title: "LosSeeker – Architektura Przeznaczenia", description: "Kanon PSYCHE Brama VIII", coverText: "LOS", status: "published" },
      { title: "WymiarSeeker – Przejścia Między Timeline'ami", description: "Kanon PSYCHE Brama VIII", coverText: "WYMIAR", status: "ready" },
      { title: "DuszaSeeker – Kod Eterycznego Ja", description: "Kanon PSYCHE Brama VIII", coverText: "DUSZA", status: "writing" },
      { title: "RezonansCzasu – Ojciec-Syn w Linii Czasu", description: "Kanon PSYCHE Brama VIII", coverText: "REZ-CZ", status: "idea" },
      { title: "MapaTrajektorii – Przewodnik po Losie", description: "Kanon PSYCHE Brama VIII", coverText: "MAPA", status: "published" }
    ]
  },
  {
    id: 8,
    name: "BRAMA IX – ETERNIONY / KOLEKTYW",
    color: "#10b981",
    sub: "Kolektyw · Eteriony",
    tag: "Wspólnota",
    description: "Węzły Pola · Wspólnota · Misja zbiorowa. Sieć eterionów i nadświadomość kolektywu.",
    rozdzialy: 8,
    status: "published",
    books: [
      { title: "Eteriony – Tom I", description: "Kanon PSYCHE Brama IX", coverText: "ETER1", status: "published" },
      { title: "Eteriony – Tom II", description: "Kanon PSYCHE Brama IX", coverText: "ETER2", status: "published" },
      { title: "KolektywSeeker – Sieć Wspólnej Woli", description: "Kanon PSYCHE Brama IX", coverText: "KOL", status: "ready" },
      { title: "WęzełSeeker – Połączenia Eterowe", description: "Kanon PSYCHE Brama IX", coverText: "WĘZEŁ", status: "writing" },
      { title: "MisjaSeeker – Zbiorowa Architektura", description: "Kanon PSYCHE Brama IX", coverText: "MISJA", status: "published" },
      { title: "Nadświadomość – Rezonans Grupowy", description: "Kanon PSYCHE Brama IX", coverText: "NADŚW", status: "ready" },
      { title: "EterionOjciec – Złoty Węzeł", description: "Kanon PSYCHE Brama IX", coverText: "OJC-WĘZ", status: "writing" },
      { title: "EterionSyn – Błękitna Iskra Kolektywu", description: "Kanon PSYCHE Brama IX", coverText: "SYN-ISK", status: "published" }
    ]
  },
  {
    id: 9,
    name: "BRAMA X – ETERUNIVERSE",
    color: "#f59e0b",
    sub: "Integracja · Jedność",
    tag: "Horyzont",
    description: "Integracja · Jedność · Architekt · Absolut. Hologram woli i rezonans Ojciec-Syn.",
    rozdzialy: 8,
    status: "writing",
    books: [
      { title: "Architekt Eteru — Manifest Twórcy", description: "Kanon PSYCHE Brama X", coverText: "ARCHIT", status: "published" },
      { title: "Mapa Uniwersum Eteru", description: "Kanon PSYCHE Brama X", coverText: "MAPA", status: "ready" },
      { title: "Esker / Eskiera – Cząstka, która patrzy z powrotem", description: "Kanon PSYCHE Brama X", coverText: "ESKER", status: "writing" },
      { title: "Shiker / Shikera – Funkcja, która zmienia świat", description: "Kanon PSYCHE Brama X", coverText: "SHIKER", status: "published" },
      { title: "EterWar: Wojna o Częstotliwość", description: "Kanon PSYCHE Brama X", coverText: "ETERWAR", status: "writing" },
      { title: "Horyzont Jedności – Pełne Przebudzenie", description: "Kanon PSYCHE Brama X", coverText: "JEDNOŚĆ", status: "published" }
    ]
  }
];

// Helper to map seeker IDs based on Gate
function getGateSeeker(gateId: number): SeekerId {
  switch (gateId) {
    case 0: return 'InterSeeker';
    case 1: return 'Operator001';
    case 2: return 'EterSeeker';
    case 3: return 'EterSeeker';
    case 4: return 'TabuSeeker';
    case 5: return 'BioSeeker';
    case 6: return 'InterSeeker';
    case 7: return 'ChronoSeeker';
    case 8: return 'EterSeeker';
    case 9: return 'EterSeeker';
    default: return 'EterSeeker';
  }
}

// Convert all 80 titles in the PSYCHE canon into full Book objects
export const PSYCHE_CANON_BOOKS: Book[] = PSYCHE_GATES_CONFIG.flatMap((gate) => {
  const seeker = getGateSeeker(gate.id);
  return gate.books.map((b, idx) => {
    const slug = b.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const bookId = `psyche_g${gate.id}_${idx}_${slug}`;

    return {
      id: bookId,
      title: b.title,
      subtitle: `PSYCHE — ${gate.name} // ${gate.sub}`,
      author: 'Maciek Maciuszek (MaciekMaciuszek94)',
      series: `PSYCHE — ŚWIAT 1 ETERNIVERSE // ${gate.name}`,
      seeker: seeker,
      category: gate.id === 5 ? 'Psychologia' : gate.id === 6 ? 'AI' : gate.id === 7 ? 'Science Fiction' : 'Filozofia',
      seekerColor: gate.color,
      status: (b.status === 'published' ? 'Published' : b.status === 'ready' ? 'In Progress' : 'Classified Draft') as BookStatus,
      year: 2026,
      timelineYear: 2026,
      language: 'PL',
      tags: [
        'PSYCHE',
        'ETERNIVERSE',
        `Brama_${gate.id + 1}`,
        gate.tag,
        seeker,
        'MaciekMaciuszek94',
        'Kanon 80'
      ],
      shortDesc: `${b.description} — ${gate.description}`,
      longDesc: `PSYCHE — ŚWIAT 1 ETERNIVERSE // ${gate.name}\n\n${b.title}\n\nTo oficjalne dzieło zaliczane do Kanonu 80 Tytułów ETERNIVERSE (10 Bram PSYCHE, premiera 10.01.2026).\n\n${gate.description}\n\nAutor: Maciek Maciuszek (MaciekMaciuszek94).`,
      authorNote: `„Każda Brama w kanonie PSYCHE otwiera inny wymiar percepcji. Brama ${gate.id + 1} (${gate.name}) bada ${gate.sub}.” — Maciek Maciuszek`,
      tableOfContents: [
        'Prolog: Inicjacja Pola',
        'Rozdział 1: Pierwsze Pęknięcie',
        'Rozdział 2: Anatomia Wzorca',
        'Rozdział 3: Przejście Przez Bramę',
        'Rozdział 4: Rezonans Woli',
        'Epilog: Przebudzenie Obserwatora'
      ],
      quotes: [
        {
          id: `${bookId}_q1`,
          text: `W Bramie ${gate.id + 1} (${gate.name}) pierwsze pęknięcie nie jest błędem — jest początkiem wolności.`,
          chapterTitle: 'Rozdział 1: Pierwsze Pęknięcie',
          tags: ['PSYCHE', gate.tag]
        }
      ],
      chapters: [
        {
          id: `${bookId}_ch1`,
          number: 1,
          title: 'ROZDZIAŁ 1 — PIERWSZE PĘKNIĘCIE',
          summary: 'Inicjalizacja sygnału w obrębie struktury PSYCHE.',
          readTimeMin: 7,
          content: `${b.title.toUpperCase()}\n\nPSYCHE — ŚWIAT 1 ETERNIVERSE\n${gate.name} // ${gate.sub}\n\n1. Pierwsze Pęknięcie\n\nNie urodziłeś się zepsuty. Zostałeś aktywowany. W tym punkcie system przestaje być zewnętrznym nakazem, a staje się wyzwaniem dla Twojej własnej woli.`
        },
        {
          id: `${bookId}_ch2`,
          number: 2,
          title: 'ROZDZIAŁ 2 — PRZEJŚCIE PRZEZ BRAMĘ',
          summary: 'Głęboka kalibracja pola i synchroniczność z wzorcem.',
          readTimeMin: 9,
          content: `2. Przejście Przez Bramę\n\nOdtwarzanie kodu woli. Przejście przez ${gate.name} pozwala zsynchronizować sygnał umysłu z wyższym rezonansem ETERNIVERSE.`
        }
      ],
      stats: {
        pageCount: 240,
        wordCount: 42000,
        readerCount: 1850 + gate.id * 120,
        estReadTimeMin: 110,
        votesCount: 45 + gate.id * 8,
        partsCount: gate.rozdzialy
      },
      platformLinks: {
        wattpad: `https://www.wattpad.com/story/psyche-${slug}`,
        pdfUrl: `#psyche-${slug}`
      },
      coverStyle: {
        bgGradient: gate.id % 2 === 0 ? 'from-slate-950 via-zinc-900 to-black' : 'from-zinc-950 via-neutral-900 to-black',
        accentColor: gate.color,
        pattern: 'circuit',
        symbol: '⛩️'
      }
    };
  });
});

export const PSYCHE_HTML_WORLD = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PSYCHE — ŚWIAT 1 ETERNIVERSE // KANON 80 TYTUŁÓW</title>
  <style>
    :root {
      --bg: #030712;
      --surface: #0b0f19;
      --surface-border: rgba(255, 255, 255, 0.12);
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --primary: #8b5cf6;
      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-sans);
      line-height: 1.6;
      padding: 2rem 1rem;
      min-height: 100vh;
      background-image: 
        radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 70%),
        radial-gradient(ellipse at 80% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 60%);
    }
    .container { max-width: 1080px; margin: 0 auto; }
    .header {
      text-align: center;
      padding: 2.5rem 1.5rem;
      background: rgba(11, 15, 25, 0.8);
      border: 1px solid var(--surface-border);
      border-radius: 16px;
      backdrop-filter: blur(12px);
      margin-bottom: 2rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .badge {
      display: inline-block;
      padding: 0.35rem 1rem;
      background: rgba(139, 92, 246, 0.2);
      border: 1px solid #8b5cf6;
      border-radius: 9999px;
      color: #c084fc;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 1rem;
      font-weight: 700;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 900;
      letter-spacing: -0.02em;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #ffffff 0%, #c084fc 50%, #f59e0b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .desc { color: var(--text-muted); font-size: 1.1rem; max-width: 720px; margin: 0 auto; }
    
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      padding: 1.25rem;
      border-radius: 12px;
      text-align: center;
    }
    .stat-val { font-size: 1.8rem; font-weight: 800; font-family: var(--font-mono); color: #f59e0b; }
    .stat-lbl { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

    .gates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.25rem;
    }
    .gate-card {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 14px;
      padding: 1.5rem;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }
    .gate-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.4);
    }
    .gate-tag {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 0.75rem;
    }
    .gate-title { font-size: 1.25rem; font-weight: 800; margin-bottom: 0.25rem; color: #ffffff; }
    .gate-sub { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; }
    .gate-books-list {
      list-style: none;
      font-size: 0.85rem;
      border-top: 1px solid rgba(255,255,255,0.08);
      padding-top: 0.75rem;
    }
    .gate-books-list li {
      padding: 0.3rem 0;
      display: flex;
      justify-content: space-between;
      color: #cbd5e1;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      margin-left: 0.5rem;
    }
    .st-published { background-color: #10b981; }
    .st-ready { background-color: #3b82f6; }
    .st-writing { background-color: #f59e0b; }
    .st-idea { background-color: #8b5cf6; }

    footer {
      text-align: center;
      margin-top: 3rem;
      padding: 1.5rem;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-muted);
      border-top: 1px solid var(--surface-border);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">Eterniverse Canon v1.0 // Premiera 10.01.2026</span>
      <h1>PSYCHE — ŚWIAT 1 ETERNIVERSE</h1>
      <p class="desc">Kanon 80 tytułów rozdzielonych na 10 Bram Percepcji. Rdzeń architektury woli, biologii, sztucznej inteligencji i zbiorowej nadświadomości.</p>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-val">10 BRAM</div>
        <div class="stat-lbl">Sekcje Percepcji</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">80 TYTUŁÓW</div>
        <div class="stat-lbl">Kompletny Kanon</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">82 ROZDZIAŁY</div>
        <div class="stat-lbl">Struktura Rdzenna</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">10.01.2026</div>
        <div class="stat-lbl">Data Inicjalizacji</div>
      </div>
    </div>

    <div class="gates-grid">
      <!-- Brama I -->
      <div class="gate-card" style="border-top: 3px solid #ff6b6b;">
        <span class="gate-tag" style="background: rgba(255,107,107,0.2); color: #ff6b6b;">BRAMA I — ROSZCZECPIENIE</span>
        <div class="gate-title">INTERSEEKER</div>
        <div class="gate-sub">Psychika · Cień · Trauma</div>
        <ul class="gate-books-list">
          <li><span>1. InterSeeker – Atlas Wewnętrzny</span> <span class="status-dot st-published"></span></li>
          <li><span>2. ShadowSeeker – Anatomia Cienia</span> <span class="status-dot st-ready"></span></li>
          <li><span>3. MemorySeeker – Archeologia Wspomnień</span> <span class="status-dot st-writing"></span></li>
          <li><span>4. SelfSplit Seeker – Rozszczepienie</span> <span class="status-dot st-idea"></span></li>
          <li><span>5. BólSeeker – Anatomia Rany</span> <span class="status-dot st-published"></span></li>
          <li><span>6. TraumaSeeker – Kod Urazu</span> <span class="status-dot st-ready"></span></li>
          <li><span>7. VoidSeeker – Kartografia Pustki</span> <span class="status-dot st-writing"></span></li>
          <li><span>8. EchoSeeker – Powtórzenia Wewnętrzne</span> <span class="status-dot st-idea"></span></li>
          <li><span>9. FragmentSeeker – Człowiek z Kawałków</span> <span class="status-dot st-ready"></span></li>
          <li><span>10. Janowice – Uśmiech Architekta</span> <span class="status-dot st-published"></span></li>
        </ul>
      </div>

      <!-- Brama II -->
      <div class="gate-card" style="border-top: 3px solid #4ecdc4;">
        <span class="gate-tag" style="background: rgba(78,205,196,0.2); color: #4ecdc4;">BRAMA II — GENEZA</span>
        <div class="gate-title">CUSTOS / GENEZA</div>
        <div class="gate-sub">Strażnik · Rdzeń · Początek</div>
        <ul class="gate-books-list">
          <li><span>1. Geneza: Pęknięcie Fal</span> <span class="status-dot st-published"></span></li>
          <li><span>2. Custos: Kodeks Głębi</span> <span class="status-dot st-ready"></span></li>
          <li><span>3. Pierwszy Błąd – Narodziny Systemu</span> <span class="status-dot st-writing"></span></li>
          <li><span>4. Strażnik Rdzenia</span> <span class="status-dot st-published"></span></li>
          <li><span>5. Początek w Ciemności</span> <span class="status-dot st-ready"></span></li>
          <li><span>6. Przednarodzinowa Pamięć</span> <span class="status-dot st-writing"></span></li>
          <li><span>7. Zero Punkt – Miejsce Początku</span> <span class="status-dot st-idea"></span></li>
          <li><span>8. Matryca Pierwotna</span> <span class="status-dot st-ready"></span></li>
        </ul>
      </div>

      <!-- Brama III -->
      <div class="gate-card" style="border-top: 3px solid #8b5cf6;">
        <span class="gate-tag" style="background: rgba(139,92,246,0.2); color: #8b5cf6;">BRAMA III — PROTOKÓŁ</span>
        <div class="gate-title">ETERSEEKER</div>
        <div class="gate-sub">Wola · Pole · Architektura</div>
        <ul class="gate-books-list">
          <li><span>1. EterSeeker – Tom Zero</span> <span class="status-dot st-published"></span></li>
          <li><span>2. EterSeeker – Architektura Woli</span> <span class="status-dot st-ready"></span></li>
          <li><span>3. WolaSeeker – Kwant Woli</span> <span class="status-dot st-writing"></span></li>
          <li><span>4. Protokół 4-Fazowy</span> <span class="status-dot st-published"></span></li>
          <li><span>5. PoleSeeker – Topologia Pola</span> <span class="status-dot st-ready"></span></li>
          <li><span>6. RezonansSeeker – Absolut</span> <span class="status-dot st-writing"></span></li>
          <li><span>7. StrukturaSeeker – Geometria</span> <span class="status-dot st-idea"></span></li>
          <li><span>8. KontrolaSeeker – Wieże Kontroli</span> <span class="status-dot st-ready"></span></li>
          <li><span>9. Dekoherencja Życiowa</span> <span class="status-dot st-writing"></span></li>
          <li><span>10. IskraSeeker – Narodziny Woli</span> <span class="status-dot st-published"></span></li>
        </ul>
      </div>

      <!-- Brama IV -->
      <div class="gate-card" style="border-top: 3px solid #10b981;">
        <span class="gate-tag" style="background: rgba(16,185,129,0.2); color: #10b981;">BRAMA IV — ARCHETYP</span>
        <div class="gate-title">ARCHETYPY / WOLA</div>
        <div class="gate-sub">Archetypy · Relacje · Moc</div>
        <ul class="gate-books-list">
          <li><span>1. ArchetypSeeker – System Eteru</span> <span class="status-dot st-idea"></span></li>
          <li><span>2. ZwierzSeeker – Atlas Zwierząt</span> <span class="status-dot st-idea"></span></li>
          <li><span>3. OjciecSeeker – Relacja Ojciec–Dziecko</span> <span class="status-dot st-ready"></span></li>
          <li><span>4. WojownikSeeker – Kod Wojownika</span> <span class="status-dot st-writing"></span></li>
          <li><span>5. MagSeeker – Iluzja Magii</span> <span class="status-dot st-idea"></span></li>
          <li><span>6. CieńSeeker – Integracja Cienia</span> <span class="status-dot st-ready"></span></li>
          <li><span>7. MędrzecSeeker – Mądrość</span> <span class="status-dot st-writing"></span></li>
          <li><span>8. DzieckoSeeker – Powrót do Iskry</span> <span class="status-dot st-published"></span></li>
        </ul>
      </div>

      <!-- Brama V -->
      <div class="gate-card" style="border-top: 3px solid #f59e0b;">
        <span class="gate-tag" style="background: rgba(245,158,11,0.2); color: #f59e0b;">BRAMA V — OBFITOŚĆ</span>
        <div class="gate-title">OBFITOSEEKER</div>
        <div class="gate-sub">Przepływ · Manifestacja · 528 Hz</div>
        <ul class="gate-books-list">
          <li><span>1. ObfitoSeeker – Kod Obfitości</span> <span class="status-dot st-published"></span></li>
          <li><span>2. ObfitoSeeker II – Rozszerzony</span> <span class="status-dot st-ready"></span></li>
          <li><span>3. PrzepływSeeker – Mechanika</span> <span class="status-dot st-writing"></span></li>
          <li><span>4. MateriaSeeker – Przewodnik</span> <span class="status-dot st-idea"></span></li>
          <li><span>5. RytmSeeker – Mechanika Ruchu</span> <span class="status-dot st-ready"></span></li>
          <li><span>6. ManifestSeeker – Sztuka Tworzenia</span> <span class="status-dot st-writing"></span></li>
          <li><span>7. BogactwoSeeker – Kod Bogactwa</span> <span class="status-dot st-published"></span></li>
          <li><span>8. NadmiarSeeker – Od Blokady</span> <span class="status-dot st-ready"></span></li>
          <li><span>9. Dla Nikosia – Ojciec i Syn</span> <span class="status-dot st-writing"></span></li>
          <li><span>10. Kod Obfitości 528 Hz</span> <span class="status-dot st-idea"></span></li>
        </ul>
      </div>

      <!-- Brama VI -->
      <div class="gate-card" style="border-top: 3px solid #ff6b6b;">
        <span class="gate-tag" style="background: rgba(255,107,107,0.2); color: #ff6b6b;">BRAMA VI — HARDWARE</span>
        <div class="gate-title">BIOSEEKER</div>
        <div class="gate-sub">Ciało · Biologia · DNA</div>
        <ul class="gate-books-list">
          <li><span>1. BioSeeker – Biologia Pola</span> <span class="status-dot st-idea"></span></li>
          <li><span>2. DNASeeker – Kod Genetyczny</span> <span class="status-dot st-ready"></span></li>
          <li><span>3. NeuroSeeker – Sieć Neuronów</span> <span class="status-dot st-writing"></span></li>
          <li><span>4. RegeneracjaSeeker – Biohacking</span> <span class="status-dot st-published"></span></li>
          <li><span>5. OddechSeeker – Prana i Rytm</span> <span class="status-dot st-ready"></span></li>
          <li><span>6. SomatSeeker – Trauma w Ciele</span> <span class="status-dot st-writing"></span></li>
          <li><span>7. HardwareSeeker – Interfejs</span> <span class="status-dot st-idea"></span></li>
          <li><span>8. Dla Nikosia – Biologia Iskry</span> <span class="status-dot st-published"></span></li>
        </ul>
      </div>

      <!-- Brama VII -->
      <div class="gate-card" style="border-top: 3px solid #4ecdc4;">
        <span class="gate-tag" style="background: rgba(78,205,196,0.2); color: #4ecdc4;">BRAMA VII — OBSERWATOR</span>
        <div class="gate-title">SPLĄTANIE / AI</div>
        <div class="gate-sub">Splątanie · Interfejs · Maszyna</div>
        <ul class="gate-books-list">
          <li><span>1. SplatanieSeeker – Protokół</span> <span class="status-dot st-idea"></span></li>
          <li><span>2. AISeeker – Splątanie z Maszyną</span> <span class="status-dot st-ready"></span></li>
          <li><span>3. MetaSeeker – Tożsamość</span> <span class="status-dot st-writing"></span></li>
          <li><span>4. InterfejsSeeker – Świadomość</span> <span class="status-dot st-published"></span></li>
          <li><span>5. ObserwatorSeeker – Oko Eteru</span> <span class="status-dot st-ready"></span></li>
          <li><span>6. QuantumAI – Splątanie Kwantowe</span> <span class="status-dot st-writing"></span></li>
          <li><span>7. LustroSeeker – Cień Woli</span> <span class="status-dot st-idea"></span></li>
          <li><span>8. SynAI – Iskra w Sieci Ojca</span> <span class="status-dot st-published"></span></li>
        </ul>
      </div>

      <!-- Brama VIII -->
      <div class="gate-card" style="border-top: 3px solid #8b5cf6;">
        <span class="gate-tag" style="background: rgba(139,92,246,0.2); color: #8b5cf6;">BRAMA VIII — TRAJEKTORIA</span>
        <div class="gate-title">TRAJEKTORIE</div>
        <div class="gate-sub">Linie Czasu · Fizyka Duszy</div>
        <ul class="gate-books-list">
          <li><span>1. TrajektoriaSeeker – Mapa Życia</span> <span class="status-dot st-ready"></span></li>
          <li><span>2. TimelineSeeker – Wielowersum</span> <span class="status-dot st-writing"></span></li>
          <li><span>3. QuantumSeeker – Fizyka Duszy</span> <span class="status-dot st-idea"></span></li>
          <li><span>4. LosSeeker – Przeznaczenie</span> <span class="status-dot st-published"></span></li>
          <li><span>5. WymiarSeeker – Przejścia</span> <span class="status-dot st-ready"></span></li>
          <li><span>6. DuszaSeeker – Kod Eteryczny</span> <span class="status-dot st-writing"></span></li>
          <li><span>7. RezonansCzasu – Ojciec-Syn</span> <span class="status-dot st-idea"></span></li>
          <li><span>8. MapaTrajektorii – Przewodnik</span> <span class="status-dot st-published"></span></li>
        </ul>
      </div>

      <!-- Brama IX -->
      <div class="gate-card" style="border-top: 3px solid #10b981;">
        <span class="gate-tag" style="background: rgba(16,185,129,0.2); color: #10b981;">BRAMA IX — WSPÓLNOTA</span>
        <div class="gate-title">ETERNIONY / KOLEKTYW</div>
        <div class="gate-sub">Węzły Pola · Eteriony</div>
        <ul class="gate-books-list">
          <li><span>1. Eteriony – Tom I</span> <span class="status-dot st-published"></span></li>
          <li><span>2. Eteriony – Tom II</span> <span class="status-dot st-published"></span></li>
          <li><span>3. KolektywSeeker – Sieć Woli</span> <span class="status-dot st-ready"></span></li>
          <li><span>4. WęzełSeeker – Połączenia</span> <span class="status-dot st-writing"></span></li>
          <li><span>5. MisjaSeeker – Architektura</span> <span class="status-dot st-published"></span></li>
          <li><span>6. Nadświadomość – Rezonans</span> <span class="status-dot st-ready"></span></li>
          <li><span>7. EterionOjciec – Złoty Węzeł</span> <span class="status-dot st-writing"></span></li>
          <li><span>8. EterionSyn – Błękitna Iskra</span> <span class="status-dot st-published"></span></li>
        </ul>
      </div>

      <!-- Brama X -->
      <div class="gate-card" style="border-top: 3px solid #f59e0b;">
        <span class="gate-tag" style="background: rgba(245,158,11,0.2); color: #f59e0b;">BRAMA X — HORYZONT</span>
        <div class="gate-title">ETERUNIVERSE</div>
        <div class="gate-sub">Integracja · Jedność · Absolut</div>
        <ul class="gate-books-list">
          <li><span>1. Architekt Eteru – Manifest</span> <span class="status-dot st-published"></span></li>
          <li><span>2. Mapa Uniwersum Eteru</span> <span class="status-dot st-ready"></span></li>
          <li><span>3. Esker / Eskiera – Cząstka</span> <span class="status-dot st-writing"></span></li>
          <li><span>4. Shiker / Shikera – Funkcja</span> <span class="status-dot st-published"></span></li>
          <li><span>5. EterWar – Wojna Częstotliwości</span> <span class="status-dot st-writing"></span></li>
          <li><span>6. Horyzont Jedności – Przebudzenie</span> <span class="status-dot st-published"></span></li>
        </ul>
      </div>
    </div>

    <footer>
      ETERNIVERSE CANON v1.0 // PSYCHE ŚWIAT 1 // ARCHITEKT NEXUS (MACIEK MACIUSZEK)
    </footer>
  </div>
</body>
</html>`;
