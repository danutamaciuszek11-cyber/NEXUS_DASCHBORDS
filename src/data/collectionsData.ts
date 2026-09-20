import { BookCollection } from '../types';
import { WATTPAD_SERIES_COLLECTIONS } from './wattpadBooks';

export const INITIAL_COLLECTIONS: BookCollection[] = [
  ...WATTPAD_SERIES_COLLECTIONS,
  {
    id: 'col_suwerennosc',
    name: 'Suwerenność Intelektualna',
    description: 'Manifesty autonomii twórczej i etyki tworzenia wolnych dzieł.',
    color: '#a855f7',
    icon: 'Shield',
    notes: 'Kanon obowiązkowy dla każdego twórcy w archiwum NexusBook.',
    bookIds: ['cyber-terrorysta-01', 'operator-01'],
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 5
  },
  {
    id: 'col_ai_cyber',
    name: 'AI & Cyber-Filozofia',
    description: 'Traktaty i analizy emergencji sztucznej inteligencji oraz koegzystencji.',
    color: '#3b82f6',
    icon: 'Cpu',
    notes: 'Głębokie studium relacji umysłu biologicznego i cyfrowego.',
    bookIds: ['inter-01', 'chrono-01'],
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 2
  },
  {
    id: 'col_metafizyka',
    name: 'Eteryczna Metafizyka',
    description: 'Rozważania o multiwersum, rezonansie i niewidzialnych strukturach.',
    color: '#06b6d4',
    icon: 'Sparkles',
    notes: 'Zbiór tekstów o najwyższym poziomie abstrakcji i percepcji.',
    bookIds: ['eter-01', 'spirit-01', 'mirror-01'],
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 1
  }
];

export const DEFAULT_DASHBOARD_MODULES = [
  { id: 'hero_banner', label: 'Baner Główny & Telemetria', enabled: true, description: 'Nagłówek archiwum z parametrami OS i statystykami.' },
  { id: 'quote_of_day', label: 'Cytat Dnia / Synapsa', enabled: true, description: 'Inspirujący cytat i aforyzm ze zbioru NexusBook.' },
  { id: 'custom_collections', label: 'Moje Kolekcje & Autorskie Zbiory', enabled: true, description: 'Spersonalizowane zbiory książek stworzone przez użytkownika.' },
  { id: 'featured_books', label: 'Wyróżnione Arcydzieła', enabled: true, description: 'Główne wydania i polecane dzieła w systemie.' },
  { id: 'recently_added', label: 'Ostatnio Dodane & Wszystkie Dzieła', enabled: true, description: 'Kolekcja kart książkowych z filtrowaniem i wyszukiwarką.' },
  { id: 'series_seekers', label: 'Spektrum Brama-Seekerów', enabled: true, description: 'Przegląd 8 ścieżek tematycznych i ich unikalnych energii.' },
  { id: 'chrono_timeline', label: 'Chrono-Oś Czasu (ChronoSeeker)', enabled: true, description: 'Trajektoria wydań w latach 2024-2027+ w fioletowym motywie.' },
  { id: 'telemetry_stats', label: 'Panel Telemetrii & Analityki', enabled: true, description: 'Metryki stron, słów, czytelników i ekosystemu zewnętrznego.' }
] as const;
