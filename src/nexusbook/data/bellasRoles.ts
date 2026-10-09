/**
 * BELLAS FAMILY ROSTER & ROLE-BASED ACCESS CONTROL (RBAC) MATRIX
 * ===============================================================
 * Predefiniowane role tożsamości w architekturze Nexus & Eterniverse.
 * Zapewnia granulowaną kontrolę uprawnień do modułów, węzłów i zasobów.
 */

export type BellasRoleId = 
  | 'architect'
  | 'engineer'
  | 'curator'
  | 'sentinel'
  | 'guest'
  | 'marco'
  | 'elena'
  | 'leo'
  | 'sofia';

export type NexusPermission = 
  | 'admin:all'
  | 'config:manage'
  | 'modules:manage'
  | 'nodes:manage'
  | 'eventbus:manage'
  | 'eventbus:broadcast'
  | 'nodes:performance'
  | 'nodes:diagnostics'
  | 'kino:curate'
  | 'kino:playback'
  | 'scribe:write'
  | 'scribe:decree'
  | 'manifesto:edit'
  | 'light:theme'
  | 'bridge:broadcast'
  | 'bridge:view'
  | 'vault:unlock'
  | 'bnb:dock'
  | 'archive:import'
  | 'archive:export'
  | 'editorial:publish'
  | 'telemetry:view'
  | 'media:manage'
  | 'security:audit';

export interface BellasRoleDefinition {
  id: BellasRoleId;
  name: string;
  title: string;
  roleDescription: string;
  avatar: string;
  clearanceLevel: number; // 1 to 5
  color: string;
  badge: string;
  assignedNodeId: string;
  assignedNodeName: string;
  quote: string;
  permissions: NexusPermission[];
  allowedModules: string[];
  restrictedModules: string[];
  primaryScope: string;
}

export const PREDEFINED_BELLAS_ROLES: Record<BellasRoleId, BellasRoleDefinition> = {
  architect: {
    id: 'architect',
    name: 'Architekt Systemowy',
    title: 'Główny Architekt Rdzenia & Modułów (Omega Clearance)',
    roleDescription: 'Nadzór nad kluczowymi konfiguracjami systemowymi, zarządzenie modułami rdzenia, węzłami konsensusu i zasobami bazy danych.',
    avatar: '🏛️',
    clearanceLevel: 5,
    color: '#00f0ff',
    badge: 'LEVEL 5 • CORE ARCHITECT',
    assignedNodeId: 'node-dashboard',
    assignedNodeName: '🏛️ Konfiguracja Rdzenia & Modułów Nexus',
    quote: 'Łączymy idee, kod, informacje i działanie w spójną architekturę całego ekosystemu.',
    primaryScope: 'Zarządzanie konfiguracją rdzenia, modułami, węzłami i uprawnieniami globalnymi.',
    permissions: [
      'admin:all',
      'config:manage',
      'modules:manage',
      'nodes:manage',
      'kino:curate',
      'kino:playback',
      'scribe:write',
      'scribe:decree',
      'manifesto:edit',
      'light:theme',
      'eventbus:manage',
      'eventbus:broadcast',
      'nodes:performance',
      'nodes:diagnostics',
      'bridge:broadcast',
      'bridge:view',
      'vault:unlock',
      'bnb:dock',
      'archive:import',
      'archive:export',
      'editorial:publish',
      'telemetry:view',
      'media:manage',
      'security:audit'
    ],
    allowedModules: ['dashboard', 'config', 'modules', 'nodes', 'manifesto', 'scribe', 'kino', 'vault', 'bnb', 'editorial', 'telemetry', 'eventbus', 'collab'],
    restrictedModules: []
  },
  engineer: {
    id: 'engineer',
    name: 'Inżynier Systemowy',
    title: 'Inżynier Magistrali Zdarzeń & Wydajności (Event Bus Engineer)',
    roleDescription: 'Nadzór nad Magistralą Zdarzeń (Nexus Event Bus / Bridge), telemetrią sieciową, wydajnością węzłów i diagnostyką wydajnościową.',
    avatar: '⚡',
    clearanceLevel: 4,
    color: '#a855f7',
    badge: 'LEVEL 4 • EVENT BUS & PERFORMANCE ENGINEER',
    assignedNodeId: 'node-eventbus',
    assignedNodeName: '⚡ Magistrala Zdarzeń & Diagnostyka Węzłów',
    quote: 'Przewidywalne impulsy na magistrali gwarantują zerowy opór i perfekcyjną synchronizację zdarzeń.',
    primaryScope: 'Nadzór nad Event Busem (NexusBus), telemetrią, opóźnieniami sieciowymi i wydajnością renderowania.',
    permissions: [
      'eventbus:manage',
      'eventbus:broadcast',
      'nodes:performance',
      'nodes:diagnostics',
      'telemetry:view',
      'light:theme',
      'bridge:broadcast',
      'bridge:view',
      'archive:export',
      'nodes:manage'
    ],
    allowedModules: ['eventbus', 'telemetry', 'nodes', 'light', 'bridge', 'collab', 'dashboard'],
    restrictedModules: ['vault', 'scribe:decree', 'config:core']
  },
  curator: {
    id: 'curator',
    name: 'Kustosz / Kurator',
    title: 'Kurator Mediów & Kancelarii (Kino & Scribe Curator)',
    roleDescription: 'Zarządzanie modułem projekcji audiowizualnej "Kino Canvas 60 FPS", redagowanie dekretów w Kancelarii "Scribe" oraz publikacja treści.',
    avatar: '🎬',
    clearanceLevel: 3,
    color: '#10b981',
    badge: 'LEVEL 3 • KINO & SCRIBE CURATOR',
    assignedNodeId: 'node-kino',
    assignedNodeName: '🎬 Studio Projekcji Kino & Kancelaria Scribe',
    quote: 'Narracja, światło i dźwięk tworzą żywy przekaz tożsamości architektonicznej.',
    primaryScope: 'Zarządzanie modułami Kino (Canvas / Media) oraz Scribe (Kancelaria & Dekrety editorialne).',
    permissions: [
      'kino:curate',
      'kino:playback',
      'scribe:write',
      'scribe:decree',
      'editorial:publish',
      'media:manage',
      'archive:import',
      'archive:export',
      'bridge:view',
      'telemetry:view'
    ],
    allowedModules: ['kino', 'scribe', 'editorial', 'media', 'archive', 'collab'],
    restrictedModules: ['vault', 'config:core', 'eventbus:manage']
  },
  sentinel: {
    id: 'sentinel',
    name: 'Strażnik Bezpieczeństwa',
    title: 'Strażnik Skarbca & Audytu (AEGIS Sentinel)',
    roleDescription: 'Nadzór nad skarbcem AEGIS, audytem bezpieczeństwa, weryfikacją tożsamości i logami dostępu.',
    avatar: '🛡️',
    clearanceLevel: 4,
    color: '#f59e0b',
    badge: 'LEVEL 4 • AEGIS SECURITY SENTINEL',
    assignedNodeId: 'node-vault',
    assignedNodeName: '🛡️ Skarbiec AEGIS & Logi Audytowe',
    quote: 'Bezpieczeństwo ma pierwszeństwo przed wygodą — chronimy suwerenność węzła.',
    primaryScope: 'Nadzór nad skarbcem kryptograficznym AEGIS i audytem uprawnień.',
    permissions: [
      'vault:unlock',
      'security:audit',
      'telemetry:view',
      'bridge:view',
      'archive:export'
    ],
    allowedModules: ['vault', 'telemetry', 'security', 'collab'],
    restrictedModules: ['config:core', 'kino:curate']
  },
  guest: {
    id: 'guest',
    name: 'Gość Obserwator',
    title: 'Profil Obserwatora (Tylko Odczyt)',
    roleDescription: 'Dostęp w trybie podglądu do czytnika manifestów i odtwarzacza Kina bez możliwości edycji konfiguracji.',
    avatar: '👁️‍🗨️',
    clearanceLevel: 1,
    color: '#94a3b8',
    badge: 'LEVEL 1 • GUEST OBSERVER',
    assignedNodeId: 'node-reader',
    assignedNodeName: 'Czytnik Manifestów',
    quote: 'Obserwacja bez ingerencji w stan węzłów.',
    primaryScope: 'Podgląd odczytowy publicznych zasobów i transmisji.',
    permissions: [
      'kino:playback',
      'bridge:view',
      'telemetry:view'
    ],
    allowedModules: ['reader', 'kino', 'telemetry'],
    restrictedModules: ['vault', 'bnb', 'scribe:decree', 'scribe:write', 'manifesto:edit', 'editorial:publish', 'archive:import', 'config:manage', 'eventbus:manage']
  },
  marco: {
    id: 'marco',
    name: 'Marco Bellas',
    title: 'Główny Architekt Rdzenia (Marco)',
    roleDescription: 'Pełny dostęp administracyjny do wszystkich węzłów, protokołów konsensusu i skarbca AEGIS.',
    avatar: '🏛️',
    clearanceLevel: 5,
    color: '#00f0ff',
    badge: 'LEVEL 5 • CORE ARCHITECT',
    assignedNodeId: 'node-dashboard',
    assignedNodeName: '🏛️ Pulpit Rdzenia & Zarządzanie Węzłami',
    quote: 'Budynek to żywa stała fizyczna. Dbajmy o czystość węzłów i zero długu technicznego.',
    primaryScope: 'Pełne zarządzanie architekturą rodziny Bellas.',
    permissions: [
      'admin:all',
      'config:manage',
      'modules:manage',
      'nodes:manage',
      'kino:curate',
      'kino:playback',
      'scribe:write',
      'scribe:decree',
      'manifesto:edit',
      'light:theme',
      'eventbus:manage',
      'eventbus:broadcast',
      'nodes:performance',
      'nodes:diagnostics',
      'bridge:broadcast',
      'bridge:view',
      'vault:unlock',
      'bnb:dock',
      'archive:import',
      'archive:export',
      'editorial:publish',
      'telemetry:view',
      'media:manage',
      'security:audit'
    ],
    allowedModules: ['dashboard', 'manifesto', 'scribe', 'kino', 'vault', 'bnb', 'editorial', 'telemetry', 'collab'],
    restrictedModules: []
  },
  elena: {
    id: 'elena',
    name: 'Elena Bellas',
    title: 'Inżynier Światła & Atomic CSS',
    roleDescription: 'Zarządzanie stylistyką, manifestami wizualnymi, silnikiem barw próżni i biblioteką assetów.',
    avatar: '⚡',
    clearanceLevel: 3,
    color: '#a855f7',
    badge: 'LEVEL 3 • LIGHT & CSS ENGINEER',
    assignedNodeId: 'node-manifesto',
    assignedNodeName: '⚡ Manifest & Silnik Światła CSS',
    quote: 'Światło w próżni definiuje przestrzeń bez zbytecznego długu wizualnego.',
    primaryScope: 'Zarządzanie silnikiem wyglądu, schematami barwnymi i assetami.',
    permissions: [
      'manifesto:edit',
      'light:theme',
      'kino:playback',
      'bridge:view',
      'archive:export',
      'telemetry:view'
    ],
    allowedModules: ['manifesto', 'assets', 'light', 'kino', 'collab'],
    restrictedModules: ['vault', 'scribe:decree', 'bnb']
  },
  leo: {
    id: 'leo',
    name: 'Leo Bellas',
    title: 'Strażnik Mostów & Pamięci (Bridge Keeper)',
    roleDescription: 'Zarządzanie Magistralą Zdarzeń (Nexus Bus), kancelarią dekretów Scribe, logami telemetrii i archiwum.',
    avatar: '🛡️',
    clearanceLevel: 4,
    color: '#f59e0b',
    badge: 'LEVEL 4 • BRIDGE & MEMORY KEEPER',
    assignedNodeId: 'node-scribe',
    assignedNodeName: '🛡️ Kancelaria Scribe & Most Zdarzeń',
    quote: 'Lekkie impulsy na Moście łączą klocki w czasie rzeczywistym bez zbędnego narzutu.',
    primaryScope: 'Zarządzanie zdarzeniami na moście i archiwum dekretów.',
    permissions: [
      'scribe:write',
      'scribe:decree',
      'eventbus:manage',
      'bridge:broadcast',
      'bridge:view',
      'archive:import',
      'archive:export',
      'telemetry:view',
      'bnb:dock'
    ],
    allowedModules: ['scribe', 'dashboard', 'telemetry', 'archive', 'bnb', 'collab'],
    restrictedModules: ['kino:broadcast']
  },
  sofia: {
    id: 'sofia',
    name: 'Sofia Bellas',
    title: 'Kuratorka Narracji & Kina (Kino Curator)',
    roleDescription: 'Sterowanie projekcją Kina 60 FPS Canvas, odtwarzanie mediów, synteza fal dźwiękowych i redakcja światów.',
    avatar: '🎬',
    clearanceLevel: 3,
    color: '#10b981',
    badge: 'LEVEL 3 • KINO & NARRATIVE CURATOR',
    assignedNodeId: 'node-kino',
    assignedNodeName: '🎬 Kino Audiowizualne & Projekcja Canvas',
    quote: 'Kino przetwarza fale światła i dźwięku w czasie rzeczywistym natywnym silnikiem Canvas.',
    primaryScope: 'Nadzór nad studiem projekcji Kino i dystrybucją redakcyjną.',
    permissions: [
      'kino:curate',
      'kino:playback',
      'editorial:publish',
      'bridge:view',
      'telemetry:view',
      'media:manage'
    ],
    allowedModules: ['kino', 'editorial', 'collab', 'media'],
    restrictedModules: ['vault', 'bnb', 'scribe:decree']
  }
};

/**
 * Sprawdza czy dany profil posiada określone uprawnienie
 */
export function hasPermission(
  roleId: string | undefined | null, 
  permission: NexusPermission
): boolean {
  if (!roleId) return false;
  const normalized = roleId.toLowerCase();
  
  let roleKey: BellasRoleId = 'guest';
  if (normalized in PREDEFINED_BELLAS_ROLES) {
    roleKey = normalized as BellasRoleId;
  } else if (normalized === 'architect' || normalized === 'pilot' || normalized === 'admin') {
    roleKey = 'architect';
  } else if (normalized === 'engineer' || normalized === 'developer') {
    roleKey = 'engineer';
  } else if (normalized === 'curator') {
    roleKey = 'curator';
  } else if (normalized === 'sentinel' || normalized === 'security') {
    roleKey = 'sentinel';
  }

  const def = PREDEFINED_BELLAS_ROLES[roleKey];
  if (!def) return false;
  if (def.permissions.includes('admin:all')) return true;
  return def.permissions.includes(permission);
}

/**
 * Sprawdza czy profil ma dostęp do wybranego modułu
 */
export function canAccessModule(
  roleId: string | undefined | null,
  moduleName: string
): boolean {
  if (!roleId) return false;
  const def = getRoleDefinition(roleId);
  if (def.permissions.includes('admin:all')) return true;
  if (def.restrictedModules.includes(moduleName)) return false;
  return def.allowedModules.includes(moduleName) || def.allowedModules.includes('*');
}

/**
 * Zwraca definicję roli na podstawie identyfikatora lub domyślny profil
 */
export function getRoleDefinition(roleId?: string | null): BellasRoleDefinition {
  if (!roleId) return PREDEFINED_BELLAS_ROLES.architect; // Default active role is Architect
  const normalized = roleId.toLowerCase();
  if (normalized in PREDEFINED_BELLAS_ROLES) {
    return PREDEFINED_BELLAS_ROLES[normalized as BellasRoleId];
  }
  if (normalized === 'architect' || normalized === 'pilot' || normalized === 'admin') return PREDEFINED_BELLAS_ROLES.architect;
  if (normalized === 'engineer' || normalized === 'developer') return PREDEFINED_BELLAS_ROLES.engineer;
  if (normalized === 'curator') return PREDEFINED_BELLAS_ROLES.curator;
  if (normalized === 'sentinel' || normalized === 'security') return PREDEFINED_BELLAS_ROLES.sentinel;
  if (roleId === 'CHRONICLER') return PREDEFINED_BELLAS_ROLES.leo;
  if (roleId === 'SENTINEL') return PREDEFINED_BELLAS_ROLES.sentinel;
  return PREDEFINED_BELLAS_ROLES.architect;
}

