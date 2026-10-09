/**
 * NEXUS-CORE: Silnik Budynku (Engine)
 * Odpowiedzialny za zarządzanie pamięcią, mikrowęzłami i powiązaniami Rodziny Bellas.
 */

import { NexusNode } from './nexus-node';
import { nexusBus, NexusEvent } from './nexus-bus';

export interface BellasMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'ACTIVE' | 'SYNCHRONIZING' | 'MEDITATING';
  assignedNodeId: string;
  quote: string;
}

export class NexusCore {
  private static instance: NexusCore;
  private registeredNodes: Map<string, NexusNode> = new Map();
  private activeView: 'building' | string = 'building';
  private familyRoster: BellasMember[] = [
    {
      id: 'marco',
      name: 'Marco Bellas',
      role: 'Główny Architekt Rdzenia',
      avatar: '🏛️',
      status: 'ACTIVE',
      assignedNodeId: 'node-dashboard',
      quote: 'Budynek to żywa stała fizyczna. Dbajmy o czystość węzłów.',
    },
    {
      id: 'elena',
      name: 'Elena Bellas',
      role: 'Inżynier Światła & Atomic CSS',
      avatar: '⚡',
      status: 'ACTIVE',
      assignedNodeId: 'node-manifesto',
      quote: 'Światło w próżni definiuje przestrzeń bez zbytecznego długu technicznego.',
    },
    {
      id: 'leo',
      name: 'Leo Bellas',
      role: 'Strażnik Mostów & Pamięci',
      avatar: '🛡️',
      status: 'SYNCHRONIZING',
      assignedNodeId: 'node-scribe',
      quote: 'Lekkie impulsy na Moście łączą klocki bez narzutu ciężkich frameworków.',
    },
    {
      id: 'sofia',
      name: 'Sofia Bellas',
      role: 'Kuratorka Narracji & Kina',
      avatar: '🎬',
      status: 'ACTIVE',
      assignedNodeId: 'node-kino',
      quote: 'Kino przetwarza fali światła w czasie rzeczywistym natywnym silnikiem Canvas.',
    },
  ];

  private startTime = Date.now();

  private constructor() {
    this.listenToSystemBridge();
  }

  public static getInstance(): NexusCore {
    if (!NexusCore.instance) {
      NexusCore.instance = new NexusCore();
    }
    return NexusCore.instance;
  }

  public registerNode(node: NexusNode): void {
    this.registeredNodes.set(node.metadata.id, node);
    nexusBus.emit('nexus:system', 'core', {
      type: 'NODE_REGISTERED',
      nodeId: node.metadata.id,
      name: node.metadata.name,
    });
  }

  public getNode(nodeId: string): NexusNode | undefined {
    return this.registeredNodes.get(nodeId);
  }

  public getAllNodes(): NexusNode[] {
    return Array.from(this.registeredNodes.values());
  }

  public getFamilyRoster(): BellasMember[] {
    return [...this.familyRoster];
  }

  public getUptimeSeconds(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  public triggerBellasPulse(memberId: string, customPulse?: string): void {
    const member = this.familyRoster.find((m) => m.id === memberId);
    if (!member) return;

    member.status = 'ACTIVE';

    nexusBus.emit('bellas:pulse', member.assignedNodeId, {
      memberId: member.id,
      memberName: member.name,
      role: member.role,
      pulseMessage: customPulse || member.quote,
      timestamp: Date.now(),
    });
  }

  private listenToSystemBridge(): void {
    nexusBus.subscribe('*', (evt: NexusEvent) => {
      // Rejestracja aktywności w telemetrii rodziny
      if (evt.channel === 'bellas:pulse') {
        const member = this.familyRoster.find((m) => m.id === evt.payload?.memberId);
        if (member) {
          member.status = 'ACTIVE';
        }
      }
    }, 'nexus-core');
  }
}

export const nexusCore = NexusCore.getInstance();
