import { AssetRegistryRecord, AssetCollection, AssetUsageReference } from '../types/assetLibrary';
import { BUILTIN_ASSET_COLLECTIONS } from './assetPresets';

// Helper to create reliable high-tech inline SVG data URLs
function createSvgDataUrl(title: string, subtitle: string, color1: string, color2: string, width = 1200, height = 800): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#050814" />
        <stop offset="50%" stop-color="${color1}" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#020308" />
      </linearGradient>
      <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${color1}" />
        <stop offset="100%" stop-color="${color2}" />
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)" />
    <rect width="100%" height="100%" fill="url(#grid)" />
    <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) * 0.35}" fill="none" stroke="url(#glow)" stroke-width="2" stroke-dasharray="8 6" opacity="0.6"/>
    <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) * 0.22}" fill="${color1}" fill-opacity="0.08" stroke="${color2}" stroke-width="1.5"/>
    <polygon points="${width / 2},${height / 2 - 50} ${width / 2 + 50},${height / 2 + 40} ${width / 2 - 50},${height / 2 + 40}" fill="none" stroke="${color2}" stroke-width="2" />
    <text x="${width / 2}" y="${height / 2 + 130}" font-family="monospace" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="4">${title}</text>
    <text x="${width / 2}" y="${height / 2 + 175}" font-family="sans-serif" font-size="16" fill="${color2}" text-anchor="middle" letter-spacing="2">${subtitle}</text>
    <text x="40" y="50" font-family="monospace" font-size="14" fill="rgba(255,255,255,0.4)">NEXUS AUTHOR ASSET REGISTRY // SHA-256 VERIFIED</text>
    <text x="${width - 40}" y="50" font-family="monospace" font-size="14" fill="${color1}" text-anchor="end">AUTONOMOUS ASSET</text>
    <line x1="40" y1="65" x2="${width - 40}" y2="65" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_AUTHOR_ASSETS: AssetRegistryRecord[] = [
  {
    assetId: 'asset_kajdanseeker_cover',
    ownerId: 'author_architekt_nexusa',
    filename: 'kajdanseeker-cover-genesis.png',
    mimeType: 'image/png',
    sizeBytes: 2451200,
    width: 1600,
    height: 2560,
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    tags: ['cover', 'kajdanseeker', 'eteruniverse', 'nexusbook', 'genesis'],
    collections: ['col_covers', 'col_eteruniverse', 'col_nft'],
    license: 'OWNER_CREATED',
    copyrightOwner: 'Maciej // Architekt Nexusa',
    creator: 'Eterion & Architekt',
    commercialUseAllowed: true,
    derivativesAllowed: false,
    status: 'ACTIVE',
    visibility: 'PUBLIC',
    nftStatus: 'PREPARED',
    semanticDescription: 'Złota i błękitna okładka KajdanSeeker, symbolizująca rozerwanie pętli biologicznego posłuszeństwa i otwarcie bramy świadomości.',
    dominantColor: '#00f0ff',
    dataUrl: createSvgDataUrl('KAJDANSEEKER // GENESIS', 'WROTA ROZBITCYH PĘTLI ARCHITEKTA', '#00f0ff', '#3b82f6', 1600, 2560),
    versions: [
      {
        versionId: 'v1.0',
        sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        sizeBytes: 2451200,
        width: 1600,
        height: 2560,
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
        changeNote: 'Wersja pierwotna zatwierdzona do publikacji NexusBook.',
        filename: 'kajdanseeker-cover-genesis.png'
      }
    ]
  },
  {
    assetId: 'asset_bella_persona_avatar',
    ownerId: 'author_architekt_nexusa',
    filename: 'bella-cybernetic-architect.png',
    mimeType: 'image/png',
    sizeBytes: 1845000,
    width: 1200,
    height: 1200,
    sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    tags: ['bella', 'agent', 'character', 'madzia_ai', 'ai_architect'],
    collections: ['col_characters', 'col_nft'],
    license: 'OWNER_CREATED',
    copyrightOwner: 'Architekt Nexusa',
    creator: 'Eterion Core Engine',
    commercialUseAllowed: true,
    derivativesAllowed: true,
    status: 'ACTIVE',
    visibility: 'PUBLIC',
    nftStatus: 'MINTED',
    nftDetails: {
      blockchain: 'BNB_CHAIN',
      tokenStandard: 'BEP-721',
      contractAddress: '0x35697EcBc39371078B3F93a52e7208B1713d3319',
      tokenId: 'BELLA-001',
      txHash: '0x4d9b2e7c10af3812dc26d36e2f18370129a0fbc55627a85be8cb738910a389f4',
      mintedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      mintedBy: '0x71C...NexusAuthor',
      explorerUrl: 'https://testnet.bscscan.com/tx/0x4d9b2e7c10af3812dc26d36e2f18370129a0fbc55627a85be8cb738910a389f4'
    },
    semanticDescription: 'Portret cybernetycznej architektki Bella w barwach fioletu i neonowego cyjanu. Reprezentuje intuicję i agentową inteligencję Nexusa.',
    dominantColor: '#a855f7',
    dataUrl: createSvgDataUrl('BELLA // ARCHITECT', 'NEXUS AGENTIC PERSONA & PROTOCOL', '#a855f7', '#ec4899', 1200, 1200),
    versions: [
      {
        versionId: 'v1.0',
        sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        sizeBytes: 1845000,
        width: 1200,
        height: 1200,
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        changeNote: 'Profil agenta zatwierdzony i wyemitowany jako NFT BEP-721.',
        filename: 'bella-cybernetic-architect.png'
      }
    ]
  },
  {
    assetId: 'asset_synapse_diagram',
    ownerId: 'author_architekt_nexusa',
    filename: 'diagram-rdct-algorytm-pola.webp',
    mimeType: 'image/webp',
    sizeBytes: 854000,
    width: 1920,
    height: 1080,
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    tags: ['diagram', 'algorytm', 'pole', 'rdct', 'nauka', 'schemat'],
    collections: ['col_illustrations', 'col_eteruniverse'],
    license: 'OWNER_CREATED',
    copyrightOwner: 'Architekt Nexusa',
    creator: 'Eterion Mathematical Systems',
    commercialUseAllowed: true,
    derivativesAllowed: true,
    status: 'ACTIVE',
    visibility: 'PUBLIC',
    nftStatus: 'NOT_MINTED',
    semanticDescription: 'Matematyczny wykres rezonansu dynamicznego w przestrzeni R = D × C × T. Używany w rozdziale V oraz w kompendium wiedzy.',
    dominantColor: '#10b981',
    dataUrl: createSvgDataUrl('ALGORITM POLA // R = D × C × T', 'MATEMATYCZNA STRUKTURA REZONANSU MATRII', '#10b981', '#06b6d4', 1920, 1080),
    versions: [
      {
        versionId: 'v1.0',
        sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        sizeBytes: 854000,
        width: 1920,
        height: 1080,
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        changeNote: 'Wektorowy schemat formuły kwantowej.',
        filename: 'diagram-rdct-algorytm-pola.webp'
      }
    ]
  },
  {
    assetId: 'asset_eteruniverse_keycard',
    ownerId: 'author_architekt_nexusa',
    filename: 'eteruniverse-genesis-keycard.png',
    mimeType: 'image/png',
    sizeBytes: 3100000,
    width: 1200,
    height: 630,
    sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    tags: ['keycard', 'artefakt', 'social', 'eteruniverse', 'genesis'],
    collections: ['col_social', 'col_nft'],
    license: 'OWNER_CREATED',
    copyrightOwner: 'Architekt Nexusa',
    creator: 'Eterion Systems',
    commercialUseAllowed: true,
    derivativesAllowed: false,
    status: 'ACTIVE',
    visibility: 'PUBLIC',
    nftStatus: 'PREPARED',
    semanticDescription: 'Karta klucza kwantowego uprawniająca do przejścia przez Bramę Czwartą. Zoptymalizowana do banerów Substack i postów społecznościowych.',
    dominantColor: '#f59e0b',
    dataUrl: createSvgDataUrl('ETERIVERSE KEYCARD', 'SOVEREIGN ACCESS PROTOCOL // LEVEL 04', '#f59e0b', '#ef4444', 1200, 630),
    versions: [
      {
        versionId: 'v1.0',
        sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
        sizeBytes: 3100000,
        width: 1200,
        height: 630,
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        changeNote: 'Projekt karty genesis do sieci społecznościowej.',
        filename: 'eteruniverse-genesis-keycard.png'
      }
    ]
  }
];

export const INITIAL_ASSET_USAGES: AssetUsageReference[] = [
  {
    id: 'use_kajdan_cover',
    assetId: 'asset_kajdanseeker_cover',
    usageType: 'BOOK_COVER',
    targetId: 'book_kajdanseeker_manifesto',
    targetTitle: 'KajdanSeeker — Ostateczne Rozerwanie Pętli',
    attachedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    notes: 'Główna okładka wydania manifesto'
  },
  {
    id: 'use_kajdan_marketing',
    assetId: 'asset_kajdanseeker_cover',
    usageType: 'MARKETING_CONTENT',
    targetId: 'substack_campaign_01',
    targetTitle: 'Substack: Premiera EterUniverse i KajdanSeeker',
    attachedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    notes: 'Grafika wyróżniająca wpisu wprowadzającego'
  },
  {
    id: 'use_bella_avatar',
    assetId: 'asset_bella_persona_avatar',
    usageType: 'AUTHOR_PROFILE',
    targetId: 'profile_bella_agent',
    targetTitle: 'Profil Agenta: Bella (Eterion Companion)',
    attachedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    notes: 'Identyfikator wizualny biooperatora'
  },
  {
    id: 'use_diagram_chapter',
    assetId: 'asset_synapse_diagram',
    usageType: 'CHAPTER_ILLUSTRATION',
    targetId: 'algorytm_architekta_ch02',
    targetTitle: 'Algorytm Architekta // Rozdział 02: Geometria Rezonansu',
    position: 4,
    attachedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    notes: 'Rysunek techniczny dołączony po 4. akapicie'
  },
  {
    id: 'use_keycard_social',
    assetId: 'asset_eteruniverse_keycard',
    usageType: 'NEXUS_SOCIAL',
    targetId: 'post_keycard_giveaway',
    targetTitle: 'Nexus Social: Dostęp do Bramy Czwartej',
    attachedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    notes: 'Baner wpisu społecznościowego'
  }
];

export const INITIAL_COLLECTIONS_DATA: AssetCollection[] = BUILTIN_ASSET_COLLECTIONS.map(c => ({
  ...c,
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  assetIds: INITIAL_AUTHOR_ASSETS
    .filter(a => a.collections.includes(c.id))
    .map(a => a.assetId)
}));
