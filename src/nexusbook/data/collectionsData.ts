import { BookCollection } from '../types';
import { WATTPAD_SERIES_COLLECTIONS } from './wattpadBooks';

export const INITIAL_COLLECTIONS: BookCollection[] = [
  {
    id: 'col_architekt_kanon',
    name: 'Dzieła Architekta // Protokół Woli & Oporu',
    description: 'Fundamentalny kanon dzieł i manifestów Architekta Nexusa: Etherseeker, Trylogia Eternionów, ReligioSeeker, Synapseeker, Architektura Oporu oraz Cyber-Terrorysta.',
    color: '#ffd700',
    icon: 'Sparkles',
    imageUrl: '/src/assets/images/col_architekt_logo_1790475988559.jpg',
    coverUrl: '/src/assets/images/col_architekt_logo_1790475988559.jpg',
    notes: 'Kanon absolutny — manifesty niepodległości twórczej i suwerenności myśli w epoce Wielkiej Kakofonii.',
    bookIds: ['interfaceseeker-interfejs-swiadomosci', 'soulgrid-siec-duszy', 'memoryseeker-archeologia-wspomnien', 'resourceseeker-czlowiek-to-nie-zasob', 'bolseeker-anatomia-rany', 'mutoseeker-kod-mutacji', 'custos-kodeks-glebi', 'breathcode-kod-oddechu', 'selfsplitseeker-rozszczepienie-tozsamosci', 'trajektoriaseeker-mapa-linii-zycia', 'humanseeker-kod-zaginionej-sily', 'eatseeker-kod-konsumcji', 'safeseeker-odzyskiwanie-glosu', 'slaveseeker-ewolucja-niewolnictwa', 'kajdanseeker-pierwsze-kajdany', 'system-seeker-tom-1', 'system-seeker-tom-2', 'archetypy-eteru-tom-1', 'nutoseeker-tom-1', 'nutoseeker-tom-2', 'nutoseeker-tom-3', 'obfitoseeker-tom-2', 'tabuseeker-tom-1', 'pole-ciszy', 'eterwar-dlaczego-ludzie-boja-sie-ai', 'matryca-pierwotna', 'etherseeker-architektura-woli', 'eterniony-tom-1', 'eterniony-tom-2', 'eterniony-tom-3', 'religioseeker-droga-wolnej-duchowosci', 'synapseeker-architektura-polaczenia', 'architektura-oporu-kakofonia', 'prolog-punkt-zero', 'cyber-terrorysta-01'],
    createdAt: Date.now() - 86400000 * 40,
    updatedAt: Date.now()
  },
  {
    id: 'col_psyche_kanon_80',
    name: 'PSYCHE — ŚWIAT 1 ETERNIVERSE (10 BRAM)',
    description: 'Kanon 80 tytułów ETERNIVERSE podzielonych na 10 Bram Percepcji (Psychika, Geneza, Eter, Archetypy, Obfitość, Hardware, AI, Trajektorie, Kolektyw, Eteruniverse).',
    color: '#8b5cf6',
    icon: 'Grid',
    imageUrl: '/src/assets/images/col_psyche_logo_1790476000595.jpg',
    coverUrl: '/src/assets/images/col_psyche_logo_1790476000595.jpg',
    notes: 'Inicjalizacja kanonu PSYCHE: 10.01.2026. 80 tytułów, 82 rozdziały, pełna spójność architektury woli.',
    bookIds: [
      'psyche_g0_0_interseeker-atlas-wewn-trzny', 'psyche_g0_1_shadowseeker-anatomia-cienia', 'psyche_g0_9_janowice-u-miech-architekta',
      'psyche_g1_0_geneza-p-kni-cie-fal', 'psyche_g1_1_custos-kodeks-g-bi', 'psyche_g1_7_matryca-pierwotna',
      'psyche_g2_0_eterseeker-ksi-ga-zakazana-tom-zero', 'psyche_g2_1_eterseeker-architektura-woli',
      'psyche_g3_0_archetypseeker-system-archetyp-w-eteru', 'psyche_g3_7_dzieckoseeker-powr-t-do-iskry',
      'psyche_g4_0_obfitoseeker-kod-obfito-ci', 'psyche_g4_9_kod-obfito-ci-528-hz',
      'psyche_g5_0_bioseeker-sekret-biologii-pola', 'psyche_g5_3_regeneracjaseeker-biohacking-rezonansem',
      'psyche_g6_0_splatanieseeker-protok-bserwatora', 'psyche_g6_3_interfejsseeker-interfejs-wiadomo-ci',
      'psyche_g7_0_trajektoriaseeker-mapa-linii-ycia', 'psyche_g7_3_losseeker-architektura-przeznaczenia',
      'psyche_g8_0_eteriony-tom-i', 'psyche_g8_1_eteriony-tom-ii',
      'psyche_g9_0_architekt-eteru-manifest-tw-rcy', 'psyche_g9_5_horyzont-jedno-ci-pe-ne-przebudzenie'
    ],
    createdAt: Date.now() - 86400000 * 50,
    updatedAt: Date.now()
  },
  ...WATTPAD_SERIES_COLLECTIONS,
  {
    id: 'col_suwerennosc',
    name: 'Suwerenność Intelektualna',
    description: 'Manifesty autonomii twórczej i etyki tworzenia wolnych dzieł.',
    color: '#a855f7',
    icon: 'Shield',
    imageUrl: '/src/assets/images/col_suwerennosc_logo_1790476008641.jpg',
    coverUrl: '/src/assets/images/col_suwerennosc_logo_1790476008641.jpg',
    notes: 'Kanon obowiązkowy dla każdego twórcy w archiwum NexusBook.',
    bookIds: ['system-seeker-tom-1', 'archetypy-eteru-tom-1', 'nutoseeker-tom-1', 'obfitoseeker-tom-2', 'tabuseeker-tom-1', 'pole-ciszy', 'etherseeker-architektura-woli', 'religioseeker-droga-wolnej-duchowosci', 'eterniony-tom-1', 'eterniony-tom-2', 'eterniony-tom-3', 'synapseeker-architektura-polaczenia', 'architektura-oporu-kakofonia', 'cyber-terrorysta-01', 'operator-01'],
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 5
  },
  {
    id: 'col_ai_cyber',
    name: 'AI & Cyber-Filozofia',
    description: 'Traktaty i analizy emergencji sztucznej inteligencji oraz koegzystencji.',
    color: '#3b82f6',
    icon: 'Cpu',
    imageUrl: '/src/assets/images/col_ai_cyber_logo_1790476019430.jpg',
    coverUrl: '/src/assets/images/col_ai_cyber_logo_1790476019430.jpg',
    notes: 'Głębokie studium relacji umysłu biologicznego i cyfrowego.',
    bookIds: ['eterniony-tom-1', 'eterniony-tom-2', 'eterniony-tom-3', 'synapseeker-architektura-polaczenia', 'inter-01', 'chrono-01'],
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 2
  },
  {
    id: 'col_metafizyka',
    name: 'Eteryczna Metafizyka',
    description: 'Rozważania o multiwersum, rezonansie i niewidzialnych strukturach.',
    color: '#06b6d4',
    icon: 'Sparkles',
    imageUrl: '/src/assets/images/col_metafizyka_logo_1790476033583.jpg',
    coverUrl: '/src/assets/images/col_metafizyka_logo_1790476033583.jpg',
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
