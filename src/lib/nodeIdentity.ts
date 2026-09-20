import { db, doc, setDoc } from './firebase';

export const NEXUS_NODE_TOKEN = 'NEXUS-BNB-734LLM-NODE';

export interface NexusNodeContract {
  name: string;
  symbol: string;
  standard: string;
  status: 'ACTIVE' | 'SYNCHRONIZED' | 'DEPLOYED';
  network: string;
  fingerprint: string;
}

export interface NexusServiceAuth {
  id: string;
  name: string;
  category: 'AI_AGENT' | 'COMMERCE' | 'INFRASTRUCTURE' | 'GOVERNANCE' | 'SECURITY';
  status: 'AUTHORIZED' | 'PENDING' | 'CONNECTED';
  permissions: string[];
  protocol: string;
}

export interface NexusNodeIdentity {
  token: string;
  network: string;
  role: string;
  clearanceLevel: string;
  ecosystem: string;
  nodeType: string;
  authorizedServices: NexusServiceAuth[];
  activeContracts: NexusNodeContract[];
  registeredAt: number;
  lastHeartbeat: number;
}

export const NODE_SERVICES: NexusServiceAuth[] = [
  {
    id: 'BELLAS_AI',
    name: 'BELLAS Agent Family & Orchestrator',
    category: 'AI_AGENT',
    status: 'AUTHORIZED',
    permissions: ['READ_MANIFESTS', 'WRITE_TELEMETRY', 'DISPATCH_TASKS', 'INVOKE_TOOLS'],
    protocol: 'REST / WEBSOCKET / SSE'
  },
  {
    id: 'MADZIA_AI',
    name: 'MADZIA AI Intelligence Engine',
    category: 'AI_AGENT',
    status: 'AUTHORIZED',
    permissions: ['ANALYZE_BOOKS', 'GENERATE_CHAPTERS', 'CROSS_SEEKER_SYNAPSE'],
    protocol: 'GRPC / REST'
  },
  {
    id: 'MADZIA_SHOP',
    name: 'MADZIA SHOP Commerce & Fulfillment Gateway',
    category: 'COMMERCE',
    status: 'AUTHORIZED',
    permissions: ['ASSET_TO_PRODUCT', 'MOCKUP_SYNC', 'PRICING_CONTRACTS'],
    protocol: 'WEBHOOK / SECURE_API'
  },
  {
    id: 'AEGIS_DEFENSE',
    name: 'AEGIS Quantum Security & Sentinel',
    category: 'SECURITY',
    status: 'AUTHORIZED',
    permissions: ['AUDIT_SIGNATURES', 'RATE_LIMIT_ENFORCE', 'VERIFY_TOKENS'],
    protocol: 'MUTUAL_TLS / TOKEN_AUTH'
  },
  {
    id: 'NEURAL_LINK',
    name: 'NEURAL LINK Synaptic Core',
    category: 'INFRASTRUCTURE',
    status: 'AUTHORIZED',
    permissions: ['PILOT_TELEMETRY', 'QUANTUM_SEED_VALIDATION', 'STREAM_STATE'],
    protocol: 'REALTIME_DATA_BUS'
  },
  {
    id: 'NEXUS_OS',
    name: 'NEXUS OS Root Ecosystem Kernel',
    category: 'INFRASTRUCTURE',
    status: 'AUTHORIZED',
    permissions: ['ROOT_COORDINATION', 'MULTI_APP_ROUTING', 'PERMISSION_ESCROW'],
    protocol: 'UNIFIED_NEXUS_GATEWAY'
  },
  {
    id: 'NEXUS_LEX',
    name: 'NEXUS LEX Arbitration & Protocol Rules',
    category: 'GOVERNANCE',
    status: 'AUTHORIZED',
    permissions: ['POLICY_VALIDATION', 'CONTENT_CLEARANCE', 'CREATOR_COPYRIGHT'],
    protocol: 'DETERMINISTIC_RULES'
  }
];

export const NODE_CONTRACTS: NexusNodeContract[] = [
  {
    name: 'NEXUS PASS ORACLE',
    symbol: 'NEX-PASS',
    standard: 'BEP-721 / ERC-721',
    status: 'SYNCHRONIZED',
    network: 'BNB Smart Chain (Mainnet/Testnet)',
    fingerprint: '0x734aLLM9b8...c721_node'
  },
  {
    name: 'CREATOR SOUL ENGINE ESCROW',
    symbol: 'NEX-SOUL',
    standard: 'BEP-20 / ERC-20',
    status: 'ACTIVE',
    network: 'BNB Smart Chain',
    fingerprint: '0x992bSOUL8e...c020_escrow'
  },
  {
    name: 'NEXUS AGENT ESCROW DISPATCH',
    symbol: 'NEX-ESCROW',
    standard: 'SMART_CONTRACT_V3',
    status: 'DEPLOYED',
    network: 'BNB Smart Chain',
    fingerprint: '0x448cNODE73...c734_dispatch'
  }
];

export const CURRENT_NODE_IDENTITY: NexusNodeIdentity = {
  token: NEXUS_NODE_TOKEN,
  network: 'BNB Smart Chain (734LLM Matrix)',
  role: 'MASTER_ARCHITECT_CORE_NODE',
  clearanceLevel: 'LEVEL_OMEGA_ARCHITECT',
  ecosystem: 'ETERNIVERSE / NEXUS',
  nodeType: 'LLM_QUANTUM_ORCHESTRATOR',
  authorizedServices: NODE_SERVICES,
  activeContracts: NODE_CONTRACTS,
  registeredAt: 1772535000000,
  lastHeartbeat: Date.now()
};

/**
 * Persists the authorized node token identity in Firestore
 */
export async function registerNodeIdentityInCloud(): Promise<boolean> {
  try {
    const nodeDocRef = doc(db, 'node_authorizations', NEXUS_NODE_TOKEN);
    const now = Date.now();
    await setDoc(nodeDocRef, {
      nodeToken: NEXUS_NODE_TOKEN,
      role: CURRENT_NODE_IDENTITY.role,
      status: 'AUTHORIZED',
      ecosystem: CURRENT_NODE_IDENTITY.ecosystem,
      network: CURRENT_NODE_IDENTITY.network,
      clearanceLevel: CURRENT_NODE_IDENTITY.clearanceLevel,
      authorizedServices: CURRENT_NODE_IDENTITY.authorizedServices.map(s => s.id),
      contracts: CURRENT_NODE_IDENTITY.activeContracts.map(c => c.name),
      issuedAt: 1772535000000,
      lastActiveAt: now,
    }, { merge: true });

    // Also update telemetry with node token reference
    const telemetryDocRef = doc(db, 'system_telemetry', 'nexus_live_node');
    await setDoc(telemetryDocRef, {
      nodeToken: NEXUS_NODE_TOKEN,
      authorizedNode: true,
      lastPingAt: now,
    }, { merge: true });

    return true;
  } catch (err) {
    console.warn('Node registration warning (local memory preserved):', err);
    return false;
  }
}

/**
 * Returns canonical authorization headers for microservices & external agents
 */
export function getNodeAuthHeaders(): Record<string, string> {
  return {
    'Authorization': `Bearer ${NEXUS_NODE_TOKEN}`,
    'X-Nexus-Node-Token': NEXUS_NODE_TOKEN,
    'X-Nexus-Network': 'BNB-734LLM',
    'X-Nexus-Clearance': 'LEVEL_OMEGA_ARCHITECT',
    'X-Nexus-Node-Role': 'MASTER_ARCHITECT_CORE_NODE'
  };
}

/**
 * Validates whether a token matches the authorized node token
 */
export function verifyNodeToken(token: string): boolean {
  return token.trim() === NEXUS_NODE_TOKEN;
}

/**
 * Ready-to-copy code snippets for integrating microservices and AI agents
 */
export function getNodeIntegrationSnippets() {
  return {
    curl: `curl -X POST https://api.nexus-ecosystem.io/v1/synapse \\
  -H "Authorization: Bearer ${NEXUS_NODE_TOKEN}" \\
  -H "X-Nexus-Node-Token: ${NEXUS_NODE_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{"action": "PING", "node": "${NEXUS_NODE_TOKEN}"}'`,

    nodeFetch: `// Node.js / TypeScript Microservice Request
import { getNodeAuthHeaders } from './lib/nodeIdentity';

const response = await fetch('https://api.nexus-ecosystem.io/v1/agents/dispatch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${NEXUS_NODE_TOKEN}',
    'X-Nexus-Node-Token': '${NEXUS_NODE_TOKEN}'
  },
  body: JSON.stringify({ agent: 'BELLAS_AI', prompt: 'Coordinate chapter manifest' })
});`,

    pythonAgent: `# Python / FastAPI Agent Authorization Middleware
from fastapi import Request, HTTPException

NEXUS_NODE_TOKEN = "${NEXUS_NODE_TOKEN}"

async def verify_nexus_node(request: Request):
    auth_header = request.headers.get("Authorization")
    node_token = request.headers.get("X-Nexus-Node-Token")
    if node_token != NEXUS_NODE_TOKEN and auth_header != f"Bearer {NEXUS_NODE_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized Nexus Node")
    return True`,

    viemBnb: `// NEXUS BNB CHAIN - TypeScript / Viem / Wagmi Docking
import { createPublicClient, http } from 'viem';
import { bsc, bscTestnet } from 'viem/chains';

export const nexusClient = createPublicClient({
  chain: bsc, // or bscTestnet
  transport: http('https://binance.llamarpc.com')
});

// Nexus Splątanie Handshake
export async function dockToNexus(nodeToken: string = '${NEXUS_NODE_TOKEN}') {
  const blockNumber = await nexusClient.getBlockNumber();
  console.log('[NEXUS-BNB] Splątanie z blokiem:', blockNumber);
  return {
    status: 'SPLĄTANY',
    nodeToken,
    chainId: bsc.id,
    oracle: 'APRO-ORACLE-528HZ'
  };
}`
  };
}
