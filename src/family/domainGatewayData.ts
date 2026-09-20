import { DomainGatewayInfo, DomainProbeResult } from './types';

export const PRIMARY_REGISTERED_DOMAIN = 'nexussocial.pl';
export const SECONDARY_REGISTERED_DOMAIN = 'nexusfamily.online';

export const REGISTERED_DOMAINS_LIST = [
  {
    domain: 'nexussocial.pl',
    role: 'PRIMARY_PROD_INGRESS',
    label: 'Główna Domena Produkcyjna',
    period: 'Aktywna (Wykupiona)',
    expires: '2027-09-01',
    description: 'Centralny Ingress społecznościowy, brama API, feed i połączenia wektorowe State Bella'
  },
  {
    domain: 'nexusfamily.online',
    role: 'GLOBAL_FAMILY_CANOPY',
    label: 'Globalny Portal Rodziny Nexus',
    period: 'Wykupiona na 1 ROK (Aktywna)',
    expires: '2027-09-01',
    description: 'Globalny punkt dostępowy federacji, Brotherhood Engine, autoryzacja tożsamości suwerennej i portal ekosystemu'
  }
];

export const DOMAIN_GATEWAY_REGISTRY: DomainGatewayInfo[] = [
  {
    domain: 'nexussocial.pl',
    isRegistered: true, // Oficjalnie wykupiona i zarejestrowana domena
    registrationPeriod: '1 ROK (AKTYWNA)',
    domainRole: 'PRIMARY_PROD_INGRESS',
    status: 'ACTIVE_PROD',
    dnsStatus: 'VERIFIED',
    sslStatus: 'ACTIVE_TLS_1_3',
    worldSlug: 'nexus-social',
    worldName: 'NEXUSSOCIAL',
    canonicalUrl: 'https://nexussocial.pl',
    gatewayRoute: '/',
    primaryOwner: 'Krystian (Nexus Founder)',
    monthlyBandwidth: '124.8 GB',
    latencyAvg: '24ms',
    features: [
      'Główny Węzeł Produkcyjny (Primary Root Ingress)',
      'Brama WebSocket & State Bella Real-Time Synapse Stream',
      'Certyfikat Wildcard TLS 1.3 Let\'s Encrypt',
      'Reverse-Proxy dla wszystkich 9 Światów Nexusa',
      'High-Signal Social Graph & Feed API'
    ]
  },
  {
    domain: 'nexusfamily.online',
    isRegistered: true, // Oficjalnie wykupiona i zarejestrowana na 1 ROK
    registrationPeriod: '1 ROK (AKTYWNA)',
    domainRole: 'GLOBAL_FAMILY_CANOPY',
    status: 'ACTIVE_PROD',
    dnsStatus: 'VERIFIED',
    sslStatus: 'ACTIVE_TLS_1_3',
    worldSlug: 'nexus-family-core',
    worldName: 'NEXUS FAMILY GLOBAL',
    canonicalUrl: 'https://nexusfamily.online',
    gatewayRoute: '/',
    primaryOwner: 'Krystian (Nexus Founder) & Nexus Council',
    monthlyBandwidth: '98.5 GB',
    latencyAvg: '21ms',
    features: [
      'Wykupiona na 1 ROK — Globalny Węzeł Federacji Rodziny',
      'Dostęp do Brotherhood Engine & Mapy HUD Architektów',
      'Lustrzana brama Ingress & State Bella Global Routing',
      'Scentralizowany rejestr tożsamości Sovereign Identity',
      'TLS 1.3 / HTTP-3 QUIC Enabled'
    ]
  },
  {
    domain: 'nexusai.pl',
    isRegistered: false,
    domainRole: 'WORLD_SUBPATH_GATEWAY',
    status: 'RESERVED_ROUTING',
    dnsStatus: 'ROUTING_SUBPATH',
    sslStatus: 'INHERITED_GATEWAY',
    worldSlug: 'nexus-ai',
    worldName: 'NEXUS AI',
    canonicalUrl: 'https://nexussocial.pl/ai',
    gatewayRoute: '/ai',
    primaryOwner: 'Tomasz Wolski & Krystian',
    monthlyBandwidth: '86.4 GB',
    latencyAvg: '32ms',
    features: [
      'Strumieniowanie State Bella Reasoning Stream',
      'Izba 7-Agent AI Council',
      'Wektorowa pamięć synaptyczna',
      'Przekierowanie przez nexussocial.pl/ai oraz nexusfamily.online/ai'
    ]
  },
  {
    domain: 'nexusdev.pl',
    isRegistered: false,
    domainRole: 'WORLD_SUBPATH_GATEWAY',
    status: 'RESERVED_ROUTING',
    dnsStatus: 'ROUTING_SUBPATH',
    sslStatus: 'INHERITED_GATEWAY',
    worldSlug: 'nexus-dev-hub',
    worldName: 'NEXUS DEV HUB',
    canonicalUrl: 'https://nexussocial.pl/dev',
    gatewayRoute: '/dev',
    primaryOwner: 'Elena Rostova & Marcus Zero',
    monthlyBandwidth: '64.1 GB',
    latencyAvg: '28ms',
    features: [
      'Repozytoria kodu i mikroserwisy',
      'Brotherhood Node Workspaces Core',
      'Cyber HUD UI System',
      'Przekierowanie przez nexussocial.pl/dev oraz nexusfamily.online/dev'
    ]
  },
  {
    domain: 'nexusbook.pl',
    isRegistered: false,
    domainRole: 'WORLD_SUBPATH_GATEWAY',
    status: 'RESERVED_ROUTING',
    dnsStatus: 'ROUTING_SUBPATH',
    sslStatus: 'INHERITED_GATEWAY',
    worldSlug: 'nexusbook',
    worldName: 'NEXUSBOOK',
    canonicalUrl: 'https://nexussocial.pl/book',
    gatewayRoute: '/book',
    primaryOwner: 'Aria Bennett & Maciej Maciuszek',
    monthlyBandwidth: '42.0 GB',
    latencyAvg: '26ms',
    features: [
      'Cyfrowa biblioteka & Traktaty filozoficzne',
      'Wydanie papierowe "Stan Bella" w 14 krajach',
      'Czytnik immersyjny z ambient audio',
      'Przekierowanie przez nexussocial.pl/book oraz nexusfamily.online/book'
    ]
  },
  {
    domain: 'nexuscomics.pl',
    isRegistered: false,
    domainRole: 'WORLD_SUBPATH_GATEWAY',
    status: 'RESERVED_ROUTING',
    dnsStatus: 'ROUTING_SUBPATH',
    sslStatus: 'INHERITED_GATEWAY',
    worldSlug: 'nexus-comics',
    worldName: 'NEXUS COMICS',
    canonicalUrl: 'https://nexussocial.pl/comics',
    gatewayRoute: '/comics',
    primaryOwner: 'Valeria Vance',
    monthlyBandwidth: '95.2 GB',
    latencyAvg: '35ms',
    features: [
      'Infinite Canvas Comic Reader',
      'Cyberpunk Graphic Novels (The First Synthesis)',
      'Synchronizacja ścieżki dźwiękowej',
      'Przekierowanie przez nexussocial.pl/comics'
    ]
  },
  {
    domain: 'nexusweb3.pl',
    isRegistered: false,
    domainRole: 'WORLD_SUBPATH_GATEWAY',
    status: 'RESERVED_ROUTING',
    dnsStatus: 'ROUTING_SUBPATH',
    sslStatus: 'INHERITED_GATEWAY',
    worldSlug: 'nexus-web3',
    worldName: 'NEXUS WEB3',
    canonicalUrl: 'https://nexussocial.pl/web3',
    gatewayRoute: '/web3',
    primaryOwner: 'Marcus Zero',
    monthlyBandwidth: '31.5 GB',
    latencyAvg: '40ms',
    features: [
      'Soulbound Builder Pass Credentials',
      'Escrow Bounties & Smart Contracts',
      'Sovereign Identity Registry',
      'Przekierowanie przez nexussocial.pl/web3'
    ]
  },
  {
    domain: 'nexuspathseeker.pl',
    isRegistered: false,
    domainRole: 'WORLD_SUBPATH_GATEWAY',
    status: 'RESERVED_ROUTING',
    dnsStatus: 'ROUTING_SUBPATH',
    sslStatus: 'INHERITED_GATEWAY',
    worldSlug: 'nexus-pathseeker',
    worldName: 'NEXUS PATHSEEKER',
    canonicalUrl: 'https://nexussocial.pl/pathseeker',
    gatewayRoute: '/pathseeker',
    primaryOwner: 'Tomasz Wolski & Aria Bennett',
    monthlyBandwidth: '18.9 GB',
    latencyAvg: '29ms',
    features: [
      'Skill Tree Radar & Mentorship Trails',
      'Kwalifikacja inicjatów do rangi Architekta',
      'Przekierowanie przez nexussocial.pl/pathseeker'
    ]
  },
  {
    domain: 'nexusmedia.pl',
    isRegistered: false,
    domainRole: 'WORLD_SUBPATH_GATEWAY',
    status: 'RESERVED_ROUTING',
    dnsStatus: 'ROUTING_SUBPATH',
    sslStatus: 'INHERITED_GATEWAY',
    worldSlug: 'nexus-media',
    worldName: 'NEXUS MEDIA',
    canonicalUrl: 'https://nexussocial.pl/media',
    gatewayRoute: '/media',
    primaryOwner: 'Dorian Vance',
    monthlyBandwidth: '78.4 GB',
    latencyAvg: '31ms',
    features: [
      'Nexus Radio Synapse (432Hz Cyber Ambient)',
      'Soundtracki i audycje wideo',
      'Przekierowanie przez nexussocial.pl/media'
    ]
  },
  {
    domain: 'nexusacademy.pl',
    isRegistered: false,
    domainRole: 'WORLD_SUBPATH_GATEWAY',
    status: 'RESERVED_ROUTING',
    dnsStatus: 'ROUTING_SUBPATH',
    sslStatus: 'INHERITED_GATEWAY',
    worldSlug: 'nexus-academy',
    worldName: 'NEXUS ACADEMY',
    canonicalUrl: 'https://nexussocial.pl/academy',
    gatewayRoute: '/academy',
    primaryOwner: 'Aria Bennett & Tomasz Wolski',
    monthlyBandwidth: '26.8 GB',
    latencyAvg: '27ms',
    features: [
      'Warsztaty budowania z AI',
      'Masterclasses & Bootcamps',
      'Przekierowanie przez nexussocial.pl/academy'
    ]
  }
];

export const INITIAL_PROBE_RESULT: DomainProbeResult = {
  domain: 'nexussocial.pl',
  timestamp: new Date().toISOString(),
  httpStatus: 200,
  responseTimeMs: 24,
  dnsResolvedIp: '185.199.108.153 (Cloud Ingress)',
  tlsVersion: 'TLS 1.3 / ChaCha20-Poly1305',
  isLive: true,
  activeNodes: 9,
  isRegistered: true,
  registrationPeriod: '1 ROK (AKTYWNA)',
  ingressMode: 'DIRECT_PROD_DOMAIN'
};
