import React, { useState } from 'react';
import { BellasMember } from '../types';
import { Shield, Lock, Key, UserCheck, ShieldAlert, Sparkles, CheckCircle2, Terminal } from 'lucide-react';

export const BellasView: React.FC = () => {
  const [bellasMembers] = useState<BellasMember[]>([
    {
      id: 'marco',
      name: 'Marco Bellas',
      role: 'Marco (Architekt)',
      aura: 'cyan',
      status: 'ACTIVE',
      signature: '0x8F9A...B31E',
      lastPulse: 'Przed chwilą',
    },
    {
      id: 'elena',
      name: 'Elena Bellas',
      role: 'Elena (Inżynier Światła)',
      aura: 'emerald',
      status: 'ACTIVE',
      signature: '0x1C4D...70A2',
      lastPulse: '2 sekundy temu',
    },
    {
      id: 'leo',
      name: 'Leo Bellas',
      role: 'Leo (Strażnik Mostów)',
      aura: 'amber',
      status: 'SYNCED',
      signature: '0x992B...F81D',
      lastPulse: '1 sekundę temu',
    },
    {
      id: 'sofia',
      name: 'Sofia Bellas',
      role: 'Sofia (Kuratorka)',
      aura: 'rose',
      status: 'CONTEMPLATION',
      signature: '0x43EE...A091',
      lastPulse: '5 sekund temu',
    },
  ]);

  const [activePolicies] = useState([
    { name: 'ImmutableCorePolicy', effect: 'DENY', target: 'file.write at nexus/js/core/*.nxl', reason: 'Bezpieczeństwo Rdzenia' },
    { name: 'MassAnalysisPolicy', effect: 'PERMIT', target: 'zip.analyze at synapse_mesh_*', reason: 'Autoryzowana Analiza' },
    { name: 'GeminiAiSynthesisPolicy', effect: 'PERMIT', target: 'ai.synthesize for Biooperator', reason: 'Zgoda Architekta' },
  ]);

  const auraStyles = {
    cyan: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-400',
    emerald: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400',
    amber: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400',
    rose: 'from-rose-500/20 to-pink-500/10 border-rose-500/40 text-rose-400',
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base font-sans">Rodzina Bellas & NXL Security Vault</h2>
            <p className="text-xs text-slate-400">Certyfikowane węzły tożsamości, certyfikaty cyfrowe oraz egzekwowanie polis bezpieczeństwa</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>VAULT STATUS: SECURE</span>
          </span>
        </div>
      </div>

      {/* Bellas Family Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bellasMembers.map((m) => (
          <div key={m.id} className={`nx-glass-card rounded-2xl p-5 border bg-gradient-to-br ${auraStyles[m.aura]} space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-sm">
                {m.name[0]}
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950/80 border border-slate-800 text-slate-300">
                {m.status}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-white text-sm">{m.name}</h3>
              <p className="text-xs text-slate-400">{m.role}</p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-1 font-mono text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Podpis SHA-256:</span>
                <span className="text-slate-200 font-bold">{m.signature}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Ostatni Impuls:</span>
                <span className="text-cyan-300">{m.lastPulse}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security Policies Table */}
      <div className="nx-glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Lock className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-white text-sm">Aktywne Polisy i Zgody NXL Vault</h3>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {activePolicies.map((p, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{p.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    p.effect === 'PERMIT'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  }`}>
                    {p.effect}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">{p.target}</p>
              </div>

              <span className="text-slate-500 text-[11px]">{p.reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
