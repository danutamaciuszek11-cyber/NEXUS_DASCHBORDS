/**
 * NEXUS PETLA LOOP STORAGE & BEHAVIORAL MAPPER UTILITY
 * ===================================================
 * Przechowywanie i zarządzanie wzorcami pętli nawykowych (Bodziec -> Myśl -> Emocja -> Impuls -> Działanie -> Nagroda)
 * z wsparciem dla własnych schematów, oceną cieni i protokołem PAUZY.
 */

export interface LoopNodeData {
  id: 'trigger' | 'thought' | 'emotion' | 'impulse' | 'action' | 'reward';
  label: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

export interface PetlaPattern {
  id: string;
  bookId: string;
  chapterId?: string;
  chapterTitle?: string;
  name: string;
  description: string;
  trigger: string;       // BODZIEC
  thought: string;       // MYŚL
  emotion: string;       // EMOCJA
  impulse: string;       // IMPULS
  action: string;        // DZIAŁANIE
  reward: string;        // NAGRODA / ULGA
  longTermCost: string;  // DŁUGOTERMINOWA CENA
  pauseStrategy: string; // PROTOKÓŁ PAUZY (jak przerwać pętlę)
  severity: number;      // 1-10 (wpływ na życie)
  shortTermRelief: number; // 1-10 (siła natychmiastowej ulgi)
  longTermCostRating: number; // 1-10 (wysokość ceny)
  createdAt: number;
  updatedAt: number;
  isPreset?: boolean;
}

const STORAGE_KEY = 'nexusbook_petla_patterns';

export const DEFAULT_CHAPTER_PRESETS: PetlaPattern[] = [
  {
    id: 'preset_unikanie_stresu',
    bookId: 'synapseeker-architektura-polaczenia',
    chapterId: 'syn_ch3',
    chapterTitle: 'Rozdział 3: Pętla',
    name: 'Pętla Unikania Stresu & Prokrastynacji',
    description: 'Nawykowe uciekanie od trudnego zadania w natychmiastowe rozproszenie dla chwilowej ulgi.',
    trigger: 'Trudny projekt lub e-mail wymagający skupienia',
    thought: '„To jest za trudne, nie dam rady zrobić tego idealnie”',
    emotion: 'Niepokój, lęk przed porażką, przytłoczenie',
    impulse: 'Chęć natychmiastowego obniżenia napięcia emocjonalnego',
    action: 'Otwarcie portalu społecznościowego lub powiadomień w telefonie',
    reward: 'Natychmiastowa ulga, ucieczka od przykrego emocjonalnie zadania',
    longTermCost: 'Poczucie winy, spadek samooceny, nawarstwiające się opóźnienia',
    pauseStrategy: 'Między Impulsem a Działaniem: Weź 3 głębokie oddechy, wypowiedz w myśli: „To tylko niepokój, nie zagrożenie” i pracuj przez 2 minuty.',
    severity: 8,
    shortTermRelief: 9,
    longTermCostRating: 8,
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now(),
    isPreset: true
  },
  {
    id: 'preset_automatyczna_krytyka',
    bookId: 'synapseeker-architektura-polaczenia',
    chapterId: 'syn_ch2',
    chapterTitle: 'Rozdział 2: Pierwsze Połączenie',
    name: 'Pętla Obronnej Reakcji na Krytykę',
    description: 'Mechanizm zastygania lub milczenia pod wpływem uwagi lub oceny ze strony otoczenia.',
    trigger: 'Usłyszenie surowej uwagi lub negatywnego feedbacku',
    thought: '„Znowu zawiodłem, nikt mnie nie docenia”',
    emotion: 'Wstyd, ukłucie żalu, złość',
    impulse: 'Pragnienie zablokowania dostępu do własnych emocji i izolacji',
    action: 'Milczenie, wycofanie się z rozmowy, zamykanie się w sobie',
    reward: 'Uniknięcie dalszej konfrontacji i ochrony przed kolejnym ciosem',
    longTermCost: 'Samotność, brak zbudowania autentycznego porozumienia, utrwalanie poczucia krzywdy',
    pauseStrategy: 'Rozpoznanie „Znam to”: Zauważ ściśnięcie w klatce piersiowej. Zadaj pytanie: „Czy ta uwaga definiuje całą moją wartość?”',
    severity: 7,
    shortTermRelief: 7,
    longTermCostRating: 9,
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now(),
    isPreset: true
  },
  {
    id: 'preset_tania_dopamina',
    bookId: 'synapseeker-architektura-polaczenia',
    chapterId: 'syn_ch1',
    chapterTitle: 'Rozdział 1: Nie Jesteś Swoją Reakcją',
    name: 'Pętla Taniej Dopaminy i Mikro-Ucieczek',
    description: 'Odruchowe sięganie po cyfrowy bodziec przy pierwszym ułamku ciszy lub nudy.',
    trigger: 'Ułamek sekundy przestoju (oczekiwanie na światłach, winda, chwila ciszy)',
    thought: '„Muszę sprawdzić co nowego, coś ominę”',
    emotion: 'Lekka nudność, mikro-niepokój, głód bodźców',
    impulse: 'Automatyczny ruch dłoni w stronę kieszeni',
    action: 'Odblokowanie ekranu i bezrefleksyjne przewijanie feedu',
    reward: 'Gwałtowny wyrzut dopaminy, szybkie zagłuszenie pustki',
    longTermCost: 'Atrofia uwagi, ciągły przebodźcowany umysł, niemożność głębokiej pracy',
    pauseStrategy: 'Reguła 10 Sekund: Gdy dłoń sięga po telefon, pozwól dłoni zastygnąć na 10 sekund i poczuj dotyk stóp na podłożu.',
    severity: 6,
    shortTermRelief: 8,
    longTermCostRating: 7,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now(),
    isPreset: true
  }
];

export function getStoredPatterns(): PetlaPattern[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CHAPTER_PRESETS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Merge user custom patterns with presets
      const userCustoms = parsed.filter((p: PetlaPattern) => !p.isPreset);
      return [...DEFAULT_CHAPTER_PRESETS, ...userCustoms];
    }
    return DEFAULT_CHAPTER_PRESETS;
  } catch (e) {
    console.warn('Failed to load Petla patterns from localStorage:', e);
    return DEFAULT_CHAPTER_PRESETS;
  }
}

export function savePattern(pattern: PetlaPattern): PetlaPattern[] {
  try {
    const current = getStoredPatterns();
    const existingIdx = current.findIndex(p => p.id === pattern.id);
    let updated: PetlaPattern[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = { ...pattern, updatedAt: Date.now() };
    } else {
      updated = [{ ...pattern, createdAt: Date.now(), updatedAt: Date.now() }, ...current];
    }
    
    // Save only user patterns or full combined list if small
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save Petla pattern to localStorage:', e);
    return getStoredPatterns();
  }
}

export function deletePattern(patternId: string): PetlaPattern[] {
  try {
    const current = getStoredPatterns();
    const filtered = current.filter(p => p.id !== patternId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    console.error('Failed to delete Petla pattern:', e);
    return getStoredPatterns();
  }
}
