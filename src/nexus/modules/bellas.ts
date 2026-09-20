// NXL v1.0 Bellas Family Node (Marco, Elena, Leo, Sofia)
import { BellasMember } from '../../types';
import { nexusBus } from '../bridges/nexus-bus';

export class BellasRealm {
  private members: Map<string, BellasMember> = new Map([
    [
      'marco',
      {
        id: 'marco',
        name: 'Marco (Architekt)',
        role: 'Marco (Architekt)',
        aura: 'emerald',
        status: 'ACTIVE',
        signature: '0xROOT_MARCO_ARCHITECT_SEAL_9918',
        lastPulse: new Date().toISOString(),
      },
    ],
    [
      'elena',
      {
        id: 'elena',
        name: 'Elena (Inżynier Światła)',
        role: 'Elena (Inżynier Światła)',
        aura: 'cyan',
        status: 'SYNCED',
        signature: '0xROOT_ELENA_LIGHT_ENG_8812',
        lastPulse: new Date().toISOString(),
      },
    ],
    [
      'leo',
      {
        id: 'leo',
        name: 'Leo (Strażnik Mostów)',
        role: 'Leo (Strażnik Mostów)',
        aura: 'amber',
        status: 'ACTIVE',
        signature: '0xROOT_LEO_BRIDGE_GUARDIAN_7734',
        lastPulse: new Date().toISOString(),
      },
    ],
    [
      'sofia',
      {
        id: 'sofia',
        name: 'Sofia (Kuratorka)',
        role: 'Sofia (Kuratorka)',
        aura: 'rose',
        status: 'CONTEMPLATION',
        signature: '0xROOT_SOFIA_CURATOR_6621',
        lastPulse: new Date().toISOString(),
      },
    ],
  ]);

  getMembers(): BellasMember[] {
    return Array.from(this.members.values());
  }

  getMember(id: string): BellasMember | undefined {
    return this.members.get(id);
  }

  updateStatus(id: string, newStatus: 'ACTIVE' | 'CONTEMPLATION' | 'SYNCED'): BellasMember {
    const member = this.members.get(id);
    if (!member) throw new Error(`Bellas family member '${id}' not found.`);

    member.status = newStatus;
    member.lastPulse = new Date().toISOString();

    nexusBus.publish('BELLAS_MEMBER_UPDATED', member, 'BellasRealm');
    return member;
  }

  simulateHouseAlertness(): { houseStatus: string; synchronizedCount: number } {
    const members = this.getMembers();
    const activeOrSynced = members.filter((m) => m.status === 'ACTIVE' || m.status === 'SYNCED');

    return {
      houseStatus: activeOrSynced.length === 4 ? 'FULL_HARMONY_SECURE' : 'CONTEMPLATIVE_GUARDED',
      synchronizedCount: activeOrSynced.length,
    };
  }
}

export const bellasRealm = new BellasRealm();
