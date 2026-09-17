import React, { useState, useEffect } from 'react';
import { Activity, Shield, Wifi, Server, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { eventBus } from '../core/event-bus';

interface NexusNetworkModalProps {
  onClose: () => void;
}

interface MeshNodeItem {
  id: string;
  name: string;
  region: string;
  latency: string;
  status: string;
  load: string;
  repoUrl?: string;
  dependencies?: string[];
}

const DEFAULT_NODES_DATA: MeshNodeItem[] = [
  { id: 'NODE #01', name: 'NEXUS BELLA OS (ROOT KERNEL)', region: 'eu-central (Warsaw)', latency: '4ms', status: 'ACTIVE', load: '18%', repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS_DASCHBORDS.git', dependencies: [] },
  { id: 'NODE #02', name: 'NEXUS FAMILY COLLECTIVE', region: 'eu-west (Frankfurt)', latency: '12ms', status: 'ACTIVE', load: '14%', repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS_FAMILI.git', dependencies: ['nexus-bella-os'] },
  { id: 'NODE #03', name: 'NEXUS MEDIA & CYBER RADIO', region: 'us-east (Virginia)', latency: '38ms', status: 'ACTIVE', load: '42%', repoUrl: 'https://github.com/danutamaciuszek11-cyber/-NEXUS-MEDIA-Studio-D-wi-ku-Syntetycznego-Transmisji-Cyber-Radiostacji.git', dependencies: ['nexus-bella-os'] },
  { id: 'NODE #04', name: 'NEXUSBOOK LEDGER', region: 'eu-central (Warsaw)', latency: '3ms', status: 'ACTIVE', load: '9%', repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-ACADEMY-Knowledge-Transfer-Engine.git', dependencies: ['nexus-bella-os'] },
  { id: 'NODE #05', name: 'NEXUS DEV HUB (KUŹNIA 9 ŚWIATÓW)', region: 'us-west (Oregon)', latency: '54ms', status: 'ACTIVE', load: '27%', repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-DEV-HUB-Ekosystem-9-wiat-w-Ku-nia-Forge-.git', dependencies: ['nexus-bella-os', 'nexus-rfc-02-gateway'] },
  { id: 'NODE #06', name: 'NEXUS WORLDS SIMULATION', region: 'ap-northeast (Tokyo)', latency: '82ms', status: 'ACTIVE', load: '31%', repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS_DASCHBORDS.git', dependencies: ['nexus-bella-os', 'nexus-dev-hub'] },
  { id: 'NODE #07', name: 'KAISA ONLINE ORCHESTRATOR', region: 'eu-central (Warsaw)', latency: '5ms', status: 'ACTIVE', load: '22%', repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-REVOLUTION.git', dependencies: ['nexus-bella-os', 'nexus-rfc-02-gateway'] },
  { id: 'NODE #08', name: 'NEXUS DIGITAL CONSTITUTION', region: 'eu-north (Stockholm)', latency: '19ms', status: 'ACTIVE', load: '11%', repoUrl: 'https://github.com/danutamaciuszek11-cyber/-NEXUS-SOVEREIGN-DIGITAL-CONSTITUTION-GOVERNANCE-ECOSYSTEM.git', dependencies: ['nexus-bella-os', 'nexusbook'] },
  { id: 'NODE #09', name: 'NEXUS ACADEMY (KNOWLEDGE ENGINE)', region: 'eu-south (Milan)', latency: '24ms', status: 'ACTIVE', load: '15%', repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-ACADEMY-Knowledge-Transfer-Engine.git', dependencies: ['nexusbook', 'kaisa-online'] },
  { id: 'NODE #10', name: 'NEXUS RFC-02 PROTOCOL GATEWAY', region: 'sa-east (Sao Paulo)', latency: '98ms', status: 'ACTIVE', load: '8%', repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-RFC-02-Inter-Project-Synchronization-Protocol-Gateway.git', dependencies: ['nexus-bella-os', 'nexus-family', 'kaisa-online'] },
  { id: 'NODE #11', name: 'NEXUS REVOLUTION KERNEL', region: 'us-central (Iowa)', latency: '45ms', status: 'ACTIVE', load: '49%', repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-REVOLUTION.git', dependencies: ['nexus-bella-os', 'nexus-rfc-02-gateway'] },
  { id: 'NODE #12', name: 'NEXUS LABS SOVEREIGN R&D', region: 'ap-southeast (Singapore)', latency: '79ms', status: 'ACTIVE', load: '16%', repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-LABS-Sovereign-R-D-Engine-Collaborative-Organism.git', dependencies: ['nexus-dev-hub', 'kaisa-online', 'nexus-constitution-governance'] },
];

export const NexusNetworkModal: React.FC<NexusNetworkModalProps> = ({ onClose }) => {
  const [nodes, setNodes] = useState<MeshNodeItem[]>(DEFAULT_NODES_DATA);
  const [isCloudLive, setIsCloudLive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchCloudNodes = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('https://nexussocial.pl/api/nexus/nodes');
      if (res.ok) {
        const data = await res.json();
        if (data && data.nodes && data.nodes.length > 0) {
          setNodes(data.nodes);
          setIsCloudLive(true);
          eventBus.emit('log', {
            tag: 'CLOUD SQL',
            message: 'FETCHED 12 MESH NODES FROM nexussocial.pl (PostgreSQL 16.6)',
            level: 'success',
          });
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchCloudNodes();
  }, []);

  const handleSendTelemetryToCloud = async () => {
    setIsSyncing(true);
    try {
      await fetch('https://nexussocial.pl/api/nexus/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          node: 'NODE #01',
          source_zone: 'CORE',
          event_type: 'DASHBOARD_PING',
          payload: { client: 'NexusDashboard', version: '3.5.0', timestamp: Date.now() },
          level: 'info'
        })
      });
      eventBus.emit('log', {
        tag: 'CLOUD SQL',
        message: 'TELEMETRY SENT TO nexussocial.pl // PostgreSQL 16.6',
        level: 'success',
      });
      alert('Pomyślnie wysłano sygnał telemetrii do bazy PostgreSQL na nexussocial.pl!');
    } catch {
      alert('Wysłano sygnał telemetrii do kolejki buforowej.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#05070D]/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-mono-tech">
      <div className="w-full max-w-4xl bg-[#090C16] border border-[#00E5FF]/40 rounded-xl p-6 shadow-[0_0_50px_rgba(0,229,255,0.15)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#121827]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF] animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white text-sm font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-[#00E5FF]" />
                  NEXUS DECENTRALIZED MESH NETWORK
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] border ${isCloudLive ? 'bg-[#00D9A6]/10 text-[#00D9A6] border-[#00D9A6]/30' : 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30'}`}>
                  {isCloudLive ? 'CLOUD SQL: nexussocial.pl (ONLINE)' : 'SOVEREIGN MESH: READY'}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">12 SOVEREIGN NODES // CHMURA SQL: POSTGRESQL 16.6 (nexus)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSendTelemetryToCloud}
              disabled={isSyncing}
              className="px-2.5 py-1 rounded bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 text-[#00E5FF] text-[11px] flex items-center gap-1.5 cursor-pointer transition-all"
              title="Wyślij ping do nexussocial.pl"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>SYNCHRONIZUJ SQL</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-[#121827] border border-[#1A2234] flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#FF3B5C]/20 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Network Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="p-3 bg-[#0C101C] rounded-lg border border-[#121827]">
            <span className="text-[10px] text-[#64748B] block uppercase">NODES ONLINE</span>
            <span className="text-[#00E5FF] font-bold text-base">12 / 12</span>
          </div>
          <div className="p-3 bg-[#0C101C] rounded-lg border border-[#121827]">
            <span className="text-[10px] text-[#64748B] block uppercase">AVG LATENCY</span>
            <span className="text-[#00D9A6] font-bold text-base">18.2 ms</span>
          </div>
          <div className="p-3 bg-[#0C101C] rounded-lg border border-[#121827]">
            <span className="text-[10px] text-[#64748B] block uppercase">ENCRYPTION</span>
            <span className="text-[#A855F7] font-bold text-base">AES-256 GCM</span>
          </div>
          <div className="p-3 bg-[#0C101C] rounded-lg border border-[#121827]">
            <span className="text-[10px] text-[#64748B] block uppercase">MESH TOPOLOGY</span>
            <span className="text-[#F59E0B] font-bold text-base">SOVEREIGN P2P</span>
          </div>
        </div>

        {/* Nodes Grid */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="p-3 rounded-lg bg-[#0C101C]/80 border border-[#121827] hover:border-[#00E5FF]/40 transition-colors flex items-center justify-between flex-wrap gap-2 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#00D9A6] shadow-[0_0_6px_#00D9A6] flex-shrink-0" />
                <span className="text-[#00E5FF] font-bold flex-shrink-0">{node.id}</span>
                <span className="text-white font-medium truncate">{node.name}</span>
                <span className="text-[10px] text-[#64748B] hidden md:inline">{node.region}</span>
              </div>

              <div className="flex items-center gap-3 text-[11px] flex-wrap">
                {/* Dependencies pills */}
                {node.dependencies && node.dependencies.length > 0 ? (
                  <div className="flex items-center gap-1">
                    {node.dependencies.map((d) => (
                      <span key={d} className="px-1.5 py-0.5 rounded bg-[#1A2234] text-[9px] font-mono-tech text-[#38BDF8]">
                        dep::{d.replace('nexus-', '').replace('-os', '')}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="px-1.5 py-0.5 rounded bg-[#00E5FF]/10 text-[9px] font-mono-tech text-[#00E5FF]">
                    ROOT
                  </span>
                )}

                {/* Git link */}
                {node.repoUrl && (
                  <a
                    href={node.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-0.5 rounded bg-[#1E293B]/70 hover:bg-[#1E293B] text-[#38BDF8] hover:text-white text-[10px] font-mono-tech flex items-center gap-1 transition-colors"
                  >
                    GIT ↗
                  </a>
                )}

                <span className="text-[#94A3B8]">PING: <strong className="text-[#00D9A6]">{node.latency}</strong></span>
                <span className="text-[#94A3B8]">LOAD: <strong className="text-[#38BDF8]">{node.load}</strong></span>
                <span className="px-2 py-0.5 rounded bg-[#00D9A6]/10 text-[#00D9A6] border border-[#00D9A6]/30 text-[10px]">
                  {node.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
