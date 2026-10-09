import { ImagePresetDefinition } from '../types/assetLibrary';

export const IMAGE_PRESETS: ImagePresetDefinition[] = [
  {
    id: 'NEXUSBOOK_COVER',
    name: 'NexusBook Okładka',
    width: 1600,
    height: 2560,
    aspectRatio: '1:1.6',
    description: 'Złoty standard okładki książki cyfrowej / e-booka NexusBook.'
  },
  {
    id: 'SOCIAL_POST',
    name: 'Nexus Social Post',
    width: 1200,
    height: 630,
    aspectRatio: '1.91:1',
    description: 'Format uniwersalny dla wpisów Substack, X, Facebook i LinkedIn.'
  },
  {
    id: 'SOCIAL_STORY',
    name: 'Pionowa Relacja (Story/Reel)',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'Pionowy format 9:16 dla relacji wideo, TikTok i Instagram.'
  },
  {
    id: 'YOUTUBE_THUMBNAIL',
    name: 'Miniatura Wideo (16:9)',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    description: 'Panoramiczny format YouTube i Nexus Media Stream.'
  },
  {
    id: 'COMIC_PANEL',
    name: 'Kadr Komiksu / Kwadrat',
    width: 1200,
    height: 1200,
    aspectRatio: '1:1',
    description: 'Kwadratowy kadr NexusComics i galeria grafik.'
  },
  {
    id: 'AUTHOR_AVATAR',
    name: 'Awatar Autora / Pilot',
    width: 512,
    height: 512,
    aspectRatio: '1:1',
    description: 'Kompaktowy, wyostrzony profil biooperatora i autora.'
  },
  {
    id: 'PRINT_HIGH_RES',
    name: 'Druk DTP (A4 300 DPI)',
    width: 2480,
    height: 3508,
    aspectRatio: '1:1.414',
    description: 'Pełna rozdzielczość 300 DPI do druku fizycznego manifestu.'
  }
];

export const BUILTIN_ASSET_COLLECTIONS = [
  {
    id: 'col_covers',
    name: 'Book Covers',
    description: 'Główne i alternatywne okładki dla dzieł NexusBook',
    icon: 'BookOpen',
    color: '#3b82f6', // blue
    isBuiltin: true
  },
  {
    id: 'col_characters',
    name: 'Characters & Personas',
    description: 'Postacie, biooperatorzy, Bella, Madzia AI i awatary',
    icon: 'User',
    color: '#ec4899', // pink
    isBuiltin: true
  },
  {
    id: 'col_eteruniverse',
    name: 'EterUniverse Core',
    description: 'Artefakty, bramy kwantowe i krajobrazy kosmiczne',
    icon: 'Sparkles',
    color: '#8b5cf6', // purple
    isBuiltin: true
  },
  {
    id: 'col_illustrations',
    name: 'Illustrations & Diagrams',
    description: 'Schematy, wykresy, ilustracje rozdziałowe i infografiki',
    icon: 'Image',
    color: '#10b981', // emerald
    isBuiltin: true
  },
  {
    id: 'col_social',
    name: 'Social Media & Banners',
    description: 'Materiały promocyjne, banery Substack i grafiki kanałów',
    icon: 'Share2',
    color: '#f59e0b', // amber
    isBuiltin: true
  },
  {
    id: 'col_nft',
    name: 'NFT Candidates',
    description: 'Wyselekcjonowane dzieła przygotowane do mintu na BNB Chain',
    icon: 'Gem',
    color: '#00f0ff', // cyan
    isBuiltin: true
  }
];
