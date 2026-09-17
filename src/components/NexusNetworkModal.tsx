import React from 'react';
import { Activity, Shield, Wifi, Server, CheckCircle2, X } from 'lucide-react';

interface NexusNetworkModalProps {
  onClose: () => void;
}

const NODES_DATA = [
  { id: 'NODE #01', name: 'NEXUS BELLA CORE', region: 'eu-central (Warsaw)', latency: '4ms', status: 'ACTIVE', load: '18%' },
  { id: 'NODE #02', name: 'FAMILY COLLECTIVE', region: 'eu-west (Frankfurt)', latency: '12ms', status: 'ACTIVE', load: '14%' },
  { id: 'NODE #03', name: 'MEDIA SYNTH MATRIX', region: 'us-east (Virginia)', latency: '38ms', status: 'ACTIVE', load: '42%' },
  { id: 'NODE #04', name: 'NEXUSBOOK LEDGER', region: 'eu-central (Warsaw)', latency: '3ms', status: 'ACTIVE', load: '9%' },
  { id: 'NODE #05', name: 'DEV HUB WASM BOX', region: 'us-west (Oregon)', latency: '54ms', status: 'ACTIVE', load: '27%' },
  { id: 'NODE #06', name: 'WORLDS SIMULATION', region: 'ap-northeast (Tokyo)', latency: '82ms', status: 'ACTIVE', load: '31%' },
  { id: 'NODE #07', name: 'KAISA ORCHESTRATOR', region: 'eu-central (Warsaw)', latency: '5ms', status: 'ACTIVE', load: '22%' },
  { id: 'NODE #08', name: 'P2P ZERO-TRUST EDGE', region: 'eu-north (Stockholm)', latency: '19ms', status: 'ACTIVE', load: '11%' },
  { id: 'NODE #09', name: 'NEURAL ROUTER #09', region: 'eu-south (Milan)', latency: '24ms', status: 'ACTIVE', load: '15%' },
  { id: 'NODE #10', name: 'CRYPTO VAULT MESH', region: 'sa-east (Sao Paulo)', latency: '98ms', status: 'ACTIVE', load: '8%' },
  { id: 'NODE #11', name: 'AI INFERENCE CLOUD', region: 'us-central (Iowa)', latency: '45ms', status: 'ACTIVE', load: '49%' },
  { id: 'NODE #12', name: 'ETERNIVERSE RELAY', region: 'ap-southeast (Singapore)', latency: '79ms', status: 'ACTIVE', load: '16%' },
];

export const NexusNetworkModal: React.FC<NexusNetworkModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#05070D]/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-mono-tech">
      <div className="w-full max-w-4xl bg-[#090C16] border border-[#00E5FF]/40 rounded-xl p-6 shadow-[0_0_50px_rgba(0,229,255,0.15)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#121827]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF] animate-pulse" />
            <div>
              <h3 className="text-white text-sm font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                <Wifi className="w-4 h-4 text-[#00E5FF]" />
                NEXUS DECENTRALIZED MESH NETWORK
              </h3>
              <p className="text-[11px] text-[#64748B]">12 SOVEREIGN NODES ONLINE // ZERO-TRUST PROTOCOL ACTIVE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#121827] border border-[#1A2234] flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#FF3B5C]/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
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
          {NODES_DATA.map((node) => (
            <div
              key={node.id}
              className="p-3 rounded-lg bg-[#0C101C]/80 border border-[#121827] hover:border-[#00E5FF]/40 transition-colors flex items-center justify-between flex-wrap gap-2 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#00D9A6] shadow-[0_0_6px_#00D9A6]" />
                <span className="text-[#00E5FF] font-bold">{node.id}</span>
                <span className="text-white">{node.name}</span>
                <span className="text-[10px] text-[#64748B]">{node.region}</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
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
