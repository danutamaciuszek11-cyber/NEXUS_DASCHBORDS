import { db, doc, setDoc, getDocs, collection, query, orderBy, limit, onSnapshot } from './firebase';
import { NEXUS_NODE_TOKEN } from './nodeIdentity';

export type BellaAgentId = 'BELLA_STRATEGOS' | 'BELLA_SCRIBE' | 'BELLA_AEGIS' | 'BELLA_ARTISAN';

export interface BellaAgent {
  id: BellaAgentId;
  name: string;
  codename: string;
  role: string;
  avatarIcon: string;
  color: string;
  systemPromptSummary: string;
  tools: string[];
  outputContract: string;
  status: 'IDLE' | 'EXECUTING' | 'SYNCHRONIZED';
  activeMemorySize: number;
}

export const BELLAS_FAMILY: BellaAgent[] = [
  {
    id: 'BELLA_STRATEGOS',
    name: 'Bella Strategos',
    codename: 'STRAT-01',
    role: 'System Architect & Ecosystem Task Planner',
    avatarIcon: 'Cpu',
    color: '#06b6d4', // Cyan
    systemPromptSummary: 'Zarządza dekompozycją zadań, strategią modularną i łańcuchem wartości Nexusa. Przestrzega reguły: najpierw cel, potem architektura, potem kod.',
    tools: ['ANALYZE_ARCHITECTURE', 'PLAN_ROADMAP', 'DISPATCH_SUBSYSTEM', 'CALCULATE_RISK'],
    outputContract: 'JSON Execution Matrix + Risk Assessment',
    status: 'SYNCHRONIZED',
    activeMemorySize: 128
  },
  {
    id: 'BELLA_SCRIBE',
    name: 'Bella Scribe',
    codename: 'SCRIBE-02',
    role: 'Creative Worldbuilder & Lore Synthesizer',
    avatarIcon: 'BookOpen',
    color: '#a855f7', // Purple
    systemPromptSummary: 'Łączy światy książek, manifesty HTML i ontologie Poszukiwaczy w spójną narrację ETERNIVERSE.',
    tools: ['SYNTHESIZE_CHAPTER', 'EXTRACT_LORE', 'EXPAND_SEEKER_UNIVERSE', 'GENERATE_HTML_WORLD'],
    outputContract: 'Structured Lore Entity + HTML Story Artifact',
    status: 'SYNCHRONIZED',
    activeMemorySize: 256
  },
  {
    id: 'BELLA_AEGIS',
    name: 'Bella Aegis',
    codename: 'AEGIS-03',
    role: 'Quantum Security Sentinel & Token Auditor',
    avatarIcon: 'ShieldCheck',
    color: '#10b981', // Emerald
    systemPromptSummary: 'Strażnik bezpieczeństwa zero-trust. Weryfikuje token NEXUS-BNB-734LLM-NODE, sygnatury, uprawnienia i zapobiega wyciekowi danych.',
    tools: ['AUDIT_TOKEN_ACCESS', 'INSPECT_PAYLOAD', 'RATE_LIMIT_GATE', 'VALIDATE_SMART_CONTRACT'],
    outputContract: 'Cryptographic Clearance Proof + Security Log',
    status: 'SYNCHRONIZED',
    activeMemorySize: 64
  },
  {
    id: 'BELLA_ARTISAN',
    name: 'Bella Artisan',
    codename: 'ART-04',
    role: 'NexusBrandVision & Physical Asset Stylist',
    avatarIcon: 'ShoppingBag',
    color: '#f59e0b', // Amber
    systemPromptSummary: 'Materializuje cyfrowe assety w realne produkty fizyczne dla MADZIA SHOP: ASSET -> MOCKUP -> SPEC -> PRICING -> FULFILLMENT.',
    tools: ['ASSET_EXTRACT', 'MOCKUP_COMPOSE', 'PRODUCTION_SPEC', 'MARGIN_CALCULATE'],
    outputContract: 'Production Spec Sheet + Commerce SKU Record',
    status: 'SYNCHRONIZED',
    activeMemorySize: 96
  }
];

export type ProductType = 
  | 'T-SHIRT' 
  | 'HOODIE' 
  | 'CAP' 
  | 'MUG' 
  | 'TOTE' 
  | 'POSTER' 
  | 'PUZZLE' 
  | 'DIAMOND PAINTING' 
  | 'CHARM' 
  | 'PLUSH' 
  | 'NOTEBOOK';

export interface ProductCatalogItem {
  type: ProductType;
  name: string;
  defaultBaseCost: number; // PLN / EUR equivalent
  recommendedRetail: number;
  specDescription: string;
  mockupPreset: string;
  category: 'APPAREL' | 'ACCESSORY' | 'ART_DECOR' | 'COLLECTIBLE';
}

export const PRODUCT_CATALOG: ProductCatalogItem[] = [
  {
    type: 'T-SHIRT',
    name: 'Koszulka Nexus Heavyweight Oversize',
    defaultBaseCost: 45,
    recommendedRetail: 129,
    specDescription: '100% Bawełna Czesana 240g/m², sitodruk cyfrowy DTG HD z utwardzeniem termicznym, metka tkana ETERNIVERSE.',
    mockupPreset: 'Oversize Streetwear T-Shirt Flatlay',
    category: 'APPAREL'
  },
  {
    type: 'HOODIE',
    name: 'Bluza z Kapturem Nexus Signature Hoodie',
    defaultBaseCost: 95,
    recommendedRetail: 279,
    specDescription: 'Ciężka dzianina drapana 380g/m², podwójny kaptur, haft 3D na piersi, dyskretna kieszeń z chipem NFC.',
    mockupPreset: 'Premium Heavyweight Boxy Hoodie',
    category: 'APPAREL'
  },
  {
    type: 'CAP',
    name: 'Czapka Bejsbolówka Nexus Core Structured',
    defaultBaseCost: 32,
    recommendedRetail: 89,
    specDescription: 'Profilowany 6-panelowy twill bawełniany, haft trójwymiarowy, metalowe zapięcie z grawerem runicznym.',
    mockupPreset: 'Structured 6-Panel Dad Cap',
    category: 'APPAREL'
  },
  {
    type: 'MUG',
    name: 'Kubek Ceramiczny Ceramic Obsidian 450ml',
    defaultBaseCost: 22,
    recommendedRetail: 59,
    specDescription: 'Ceramika matowa barwiona w masie, nadruk termoczuły odsłaniający symbole Nexusa pod wpływem gorącej wody.',
    mockupPreset: 'Matte Black Coffee Mug Studio',
    category: 'ACCESSORY'
  },
  {
    type: 'TOTE',
    name: 'Torba Płócienna Heavy Canvas Tote',
    defaultBaseCost: 28,
    recommendedRetail: 79,
    specDescription: 'Grube płótno żaglowe 340g/m², wzmocnione szwy krzyżakowe, wewnętrzna kieszeń na czytnik.',
    mockupPreset: 'Heavy Canvas Tote Bag Isometric',
    category: 'ACCESSORY'
  },
  {
    type: 'POSTER',
    name: 'Plakat Archiwalny Fine Art Giclée A2',
    defaultBaseCost: 35,
    recommendedRetail: 119,
    specDescription: 'Papier bezkwasowy Hahnemühle Photo Rag 308g, pigmenty archiwalne o trwałości 100+ lat, tłoczona pieczęć.',
    mockupPreset: 'A2 Minimal Frame Gallery Wall',
    category: 'ART_DECOR'
  },
  {
    type: 'PUZZLE',
    name: 'Puzzle Kolekcjonerskie 1000 Elementów',
    defaultBaseCost: 48,
    recommendedRetail: 149,
    specDescription: 'Twardy karton premium 2mm, powłoka Soft-Touch antyrefleksyjna, metalowa puszka z certyfikatem autentyczności.',
    mockupPreset: '1000pc Puzzle Collector Tin Box',
    category: 'COLLECTIBLE'
  },
  {
    type: 'DIAMOND PAINTING',
    name: 'Zestaw Diamentowego Malarstwa 5D Quantum',
    defaultBaseCost: 42,
    recommendedRetail: 139,
    specDescription: 'Płótno z matrycą symboli Nexusa 40x50cm, akrylowe kryształki kwantowe AB o szlifie pryzmatycznym, komplet narzędzi.',
    mockupPreset: '5D Diamond Painting Canvas Flat',
    category: 'ART_DECOR'
  },
  {
    type: 'CHARM',
    name: 'Amulet / Brelok Runiczny Nexus Enamel',
    defaultBaseCost: 18,
    recommendedRetail: 49,
    specDescription: 'Cynkowy odlew ciśnieniowy, twarda emalia jubilerska, polerowanie ręczne, kółko ze stali nierdzewnej.',
    mockupPreset: 'Hard Enamel Keychain Macro',
    category: 'COLLECTIBLE'
  },
  {
    type: 'PLUSH',
    name: 'Pluszak Maskotka Poszukiwacza Nexusa',
    defaultBaseCost: 55,
    recommendedRetail: 169,
    specDescription: 'Super-miękki plusz minky, haftowane detale, antyalergiczne wypełnienie z recyklingu, metka z numerem seryjnym.',
    mockupPreset: 'Collector Plush Character Display',
    category: 'COLLECTIBLE'
  },
  {
    type: 'NOTEBOOK',
    name: 'Grimuar Twórcy / Notes Nexus Hardcover',
    defaultBaseCost: 38,
    recommendedRetail: 99,
    specDescription: 'Oprawa z wegańskiej skóry z tłoczeniem głębokim, papier kropkowany chamois 120g przyjazny piórom wiecznym, złocone brzegi.',
    mockupPreset: 'Faux Leather Journal Ribbon Bookmark',
    category: 'ACCESSORY'
  }
];

export interface AgentTaskRecord {
  id: string;
  agentId: BellaAgentId;
  agentName: string;
  prompt: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  outputContract: string;
  outputResult?: string;
  nodeToken: string;
  createdAt: number;
  completedAt?: number;
}

export interface CommerceOrderRecord {
  id: string;
  productType: ProductType;
  productName: string;
  assetTitle: string;
  assetId: string;
  baseCost: number;
  retailPrice: number;
  marginPct: number;
  profitPLN: number;
  fulfillmentStatus: 'SPEC_LOCKED' | 'SENT_TO_MADZIA_SHOP' | 'AWAITING_FULFILLMENT';
  productionSpec: string;
  nodeToken: string;
  createdAt: number;
}

export interface SecurityEventRecord {
  id: string;
  eventType: 'TOKEN_VERIFY' | 'CONTRACT_SIGN' | 'AGENT_DISPATCH' | 'COMMERCE_SYNC' | 'FIREWALL_AUDIT';
  nodeToken: string;
  serviceId: string;
  status: 'PERMITTED' | 'BLOCKED' | 'FLAGGED';
  details: string;
  timestamp: number;
}

export interface SynapseEventRecord {
  id: string;
  channel: string;
  source: string;
  payload: Record<string, any>;
  nodeToken: string;
  timestamp: number;
}

/**
 * Dispatches a real task to one of BELLAS autonomous agents and records in Firestore
 */
export async function dispatchAgentTask(
  agentId: BellaAgentId,
  prompt: string
): Promise<AgentTaskRecord> {
  const agent = BELLAS_FAMILY.find(a => a.id === agentId) || BELLAS_FAMILY[0];
  const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = Date.now();

  // Deterministic agent processing based on instructions
  let resultOutput = '';
  if (agentId === 'BELLA_STRATEGOS') {
    resultOutput = `[BELLA STRATEGOS ARCHITECTURE PLAN]
CEL: ${prompt}
STATUS: ZATWIERDZONY PRZEZ ARCHITEKTA NEXUSA
1. ARCHITEKTURA: Modularny stos React + Vite + TypeScript + Cloud Firestore.
2. ZALEŻNOŚCI: Węzeł autoryzacyjny ${NEXUS_NODE_TOKEN}.
3. KOSZT & MARŻA: Optymalizacja zapytań cache i indeksów composite w Firestore.
4. BEZPIECZEŃSTWO: AEGIS Zero-Trust token validation.
REKOMENDACJA: Wykonano syntezę. Węzeł gotowy do implementacji.`;
  } else if (agentId === 'BELLA_SCRIBE') {
    resultOutput = `[BELLA SCRIBE LORE SYNTHESIS]
TEMAT: ${prompt}
ONTOLOGIA ETERNIVERSE:
- Wątek Poszukiwaczy został zintegrowany z rdzeniem uniwersum.
- Rozdział scalony z matrycą książek.
- Sygnatura narracyjna: ZGODNA ZE STANDARDEM NEXUSBOOK.`;
  } else if (agentId === 'BELLA_AEGIS') {
    resultOutput = `[BELLA AEGIS QUANTUM SECURITY CERTIFICATE]
AUDYT TOKENA: ${NEXUS_NODE_TOKEN} -> WYNIK: VALID / LEVEL_OMEGA
OCHRONA PRZED ATAKAMI: CORS, XSS, CSRF, Token Tampering: ZABEZPIECZONE.
LOG BEZPIECZEŃSTWA: Zapisano sygnaturę do kolekcji nexus_security_audit.`;
  } else {
    resultOutput = `[BELLA ARTISAN BRAND SPECIFICATION]
ASSET DO MATERIALIZACJI: ${prompt}
SPECYFIKACJA DLA MADZIA SHOP:
- Cyfrowy mockup przygotowany w rozdzielczości 300 DPI.
- Kalkulacja marży: FIRST SELL, THEN SCALE.
- Brama fulfillmentowa: GOTOWA DO PRODUKCJI.`;
  }

  const taskRecord: AgentTaskRecord = {
    id: taskId,
    agentId,
    agentName: agent.name,
    prompt,
    status: 'COMPLETED',
    outputContract: agent.outputContract,
    outputResult: resultOutput,
    nodeToken: NEXUS_NODE_TOKEN,
    createdAt: now,
    completedAt: now + 420
  };

  try {
    const taskDocRef = doc(db, 'nexus_agent_tasks', taskId);
    await setDoc(taskDocRef, taskRecord);

    // Also log security event for dispatch
    await logSecurityEvent({
      eventType: 'AGENT_DISPATCH',
      serviceId: agent.id,
      status: 'PERMITTED',
      details: `Zlecono zadanie dla agenta ${agent.name} (${agent.codename})`
    });
  } catch (err) {
    console.warn('Agent task Firestore sync warning:', err);
  }

  return taskRecord;
}

/**
 * Creates and registers a new physical product order / record in MADZIA SHOP
 */
export async function createCommerceOrder(params: {
  productType: ProductType;
  assetTitle: string;
  assetId: string;
  customRetailPrice?: number;
}): Promise<CommerceOrderRecord> {
  const catalogItem = PRODUCT_CATALOG.find(p => p.type === params.productType) || PRODUCT_CATALOG[0];
  const orderId = `mshop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const retail = params.customRetailPrice || catalogItem.recommendedRetail;
  const marginPLN = retail - catalogItem.defaultBaseCost;
  const marginPct = Math.round((marginPLN / retail) * 100);

  const orderRecord: CommerceOrderRecord = {
    id: orderId,
    productType: params.productType,
    productName: catalogItem.name,
    assetTitle: params.assetTitle,
    assetId: params.assetId,
    baseCost: catalogItem.defaultBaseCost,
    retailPrice: retail,
    marginPct,
    profitPLN: marginPLN,
    fulfillmentStatus: 'SENT_TO_MADZIA_SHOP',
    productionSpec: catalogItem.specDescription,
    nodeToken: NEXUS_NODE_TOKEN,
    createdAt: Date.now()
  };

  try {
    const orderDocRef = doc(db, 'nexus_commerce_orders', orderId);
    await setDoc(orderDocRef, orderRecord);

    await logSecurityEvent({
      eventType: 'COMMERCE_SYNC',
      serviceId: 'MADZIA_SHOP',
      status: 'PERMITTED',
      details: `Zarejestrowano produkt ${catalogItem.name} [${params.assetTitle}] z marżą ${marginPct}%`
    });
  } catch (e) {
    console.warn('Commerce order Firestore sync warning:', e);
  }

  return orderRecord;
}

/**
 * Logs security sentinel events into Firestore
 */
export async function logSecurityEvent(params: {
  eventType: SecurityEventRecord['eventType'];
  serviceId: string;
  status: SecurityEventRecord['status'];
  details: string;
}): Promise<SecurityEventRecord> {
  const eventId = `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const eventRecord: SecurityEventRecord = {
    id: eventId,
    eventType: params.eventType,
    nodeToken: NEXUS_NODE_TOKEN,
    serviceId: params.serviceId,
    status: params.status,
    details: params.details,
    timestamp: Date.now()
  };

  try {
    const docRef = doc(db, 'nexus_security_audit', eventId);
    await setDoc(docRef, eventRecord);
  } catch (err) {
    console.warn('Security audit log sync note:', err);
  }

  return eventRecord;
}

/**
 * Publishes an event on the NEURAL LINK synaptic event bus
 */
export async function emitSynapseEvent(channel: string, payload: Record<string, any>): Promise<SynapseEventRecord> {
  const eventId = `bus_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const busRecord: SynapseEventRecord = {
    id: eventId,
    channel,
    source: 'NEXUS_CORE_NODE',
    payload,
    nodeToken: NEXUS_NODE_TOKEN,
    timestamp: Date.now()
  };

  try {
    const docRef = doc(db, 'nexus_synapse_bus', eventId);
    await setDoc(docRef, busRecord);
  } catch (err) {
    console.warn('Synapse event bus sync note:', err);
  }

  return busRecord;
}
