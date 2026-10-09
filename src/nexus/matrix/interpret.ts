import { MATRIX_LAWS } from './canon';

export type JournalReading = {
  summary: string;
  themes: string[];
  prompts: string[];
  engine: 'gemini' | 'local';
};

export type TrajectoryReading = {
  obstacles: string[];
  actions: string[];
  growth: string;
  alignment: string;
  engine: 'gemini' | 'local';
};

export function interpretJournalLocally(body: string): JournalReading {
  const clean = body.replace(/\s+/g, ' ').trim();
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
  const summary = (sentences.slice(0, 2).join(' ') || clean).slice(0, 360);
  const lowered = clean.toLowerCase();
  const themes = MATRIX_LAWS.filter((law) => lowered.includes(law.code.toLowerCase().slice(0, 6))).map((law) => law.id);
  if (!themes.includes('B2')) themes.push('B2');
  if (!themes.includes('B5')) themes.push('B5');
  return {
    summary: summary || 'Wpis jest pusty. Obserwacja czeka na słowo.',
    themes: themes.slice(0, 4),
    prompts: [
      'Co w tym wpisie jest obserwacją, a co jest lękiem?',
      'Które prawo Nexusa ten zapis wzmacnia?',
      'Jaki jeden ruch zostawiasz Nikodemowi?',
    ],
    engine: 'local',
  };
}

export function analyzeTrajectoryLocally(name: string, vision: string, horizon: string): TrajectoryReading {
  return {
    obstacles: ['Rozproszenie uwagi między bramami.', 'Horyzont bez jednego dowodu wykonania.'],
    actions: [
      `Nazwij pierwszy dowód celu „${name || 'wektor'}" w ciągu 7 dni.`,
      `Trzymaj horyzont: ${horizon || '1 rok'}.`,
    ],
    growth: vision
      ? `Wizja poszerza obserwację: ${vision.slice(0, 180)}`
      : 'Cel bez wizji zostaje tylko nazwą.',
    alignment: 'Rezonans z Prawem Intencji (B5) i Prawem Przejścia (B6).',
    engine: 'local',
  };
}
