import React from 'react';
import { 
  Globe, 
  Activity, 
  Server, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Layers, 
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Language } from '../../types/base-dev-tools';

interface NexusNetworkProps {
  lang: Language;
}

export function NexusNetwork({ lang }: NexusNetworkProps) {
  const globalRegions = [
    { name: 'Europe (Frankfurt, Warsaw, London)', nodes: '78,410', share: '36%', status: 'optimal' },
    { name: 'North America (US-East, US-West)', nodes: '71,200', share: '33%', status: 'optimal' },
    { name: 'Asia-Pacific (Tokyo, Singapore)', nodes: '49,800', share: '23%', status: 'optimal' },
    { name: 'Latin America & Other', nodes: '18,990', share: '8%', status: 'active' },
  ];

  const recentGlobalProofs = [
    { block: 4198210, prover: '0x94b1...e201', task: 'riscv::keccak_fri', cycles: '524,288', gas: '0.0001 NXL', time: '1s ago' },
    { block: 4198209, prover: '0x3219...bb40', task: 'riscv::matrix_mul', cycles: '262,144', gas: '0.0001 NXL', time: '3s ago' },
    { block: 4198208, prover: '0xaa42...99f1', task: 'riscv::sha256_tree', cycles: '131,072', gas: '0.0001 NXL', time: '6s ago' },
    { block: 4198207, prover: '0xfe01...1842', task: 'riscv::fib_stark', cycles: '65,536', gas: '0.0001 NXL', time: '8s ago' },
    { block: 4198206, prover: '0x71C...49b2', task: 'riscv::keccak_fri', cycles: '131,072', gas: '0.0001 NXL', time: '12s ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Global Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs uppercase font-mono font-semibold">
              {lang === 'pl' ? 'Globalna Moc Sieci' : 'Global Network Hashrate'}
            </span>
            <Activity className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">
            14.82 Gc/s
          </div>
          <p className="text-xs text-neutral-500">
            14,820,000,000 cycles/sec
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs uppercase font-mono font-semibold">
              {lang === 'pl' ? 'Aktywne Węzły Na Świecie' : 'Active Provers Worldwide'}
            </span>
            <Server className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">
            218,400+
          </div>
          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Decentralized across 84 countries
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs uppercase font-mono font-semibold">
              {lang === 'pl' ? 'Zweryfikowane Dowody' : 'Verified Proofs Total'}
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">
            48,219,304
          </div>
          <p className="text-xs text-neutral-500">
            Finalized on NXL Layer 1 Rollup
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs uppercase font-mono font-semibold">
              {lang === 'pl' ? 'Czas Bloku & Epoka' : 'Block Time & Epoch'}
            </span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">
            400 ms <span className="text-xs text-neutral-400 font-normal">/ Ep. 14</span>
          </div>
          <p className="text-xs text-neutral-500">
            Sub-second deterministic finality
          </p>
        </div>
      </div>

      {/* Epoch Progress & Network Health */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
          <div>
            <h3 className="font-bold text-neutral-900 text-base">
              {lang === 'pl' ? 'Postęp Epoki Testnetowej #14' : 'Testnet Epoch #14 Progression'}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Target Difficulty: 0x0000ffff3a91c · Next adjustment in 4,820 blocks
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-lg border border-cyan-200">
            68.4% Completed
          </span>
        </div>

        <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
          <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 w-[68.4%] rounded-full transition-all duration-500" />
        </div>
      </div>

      {/* Regional Node Distribution & Proof Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regions */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Globe className="w-5 h-5 text-cyan-600" />
            <h3 className="font-bold text-neutral-900 text-base">
              {lang === 'pl' ? 'Geograficzne Rozmieszczenie Węzłów' : 'Geographic Node Distribution'}
            </h3>
          </div>

          <div className="space-y-3">
            {globalRegions.map((reg) => (
              <div key={reg.name} className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    {reg.name}
                  </div>
                  <div className="text-[11px] font-mono text-neutral-500 mt-0.5">
                    {reg.nodes} active compute provers
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-neutral-800">{reg.share}</span>
                  <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Optimal latency</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Live Proofs Stream */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-neutral-900 text-base">
                {lang === 'pl' ? 'Najnowsze Globalne Dowody' : 'Live Global Proof Stream'}
              </h3>
            </div>
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              SYNCED
            </span>
          </div>

          <div className="divide-y divide-neutral-100 overflow-hidden font-mono text-xs">
            {recentGlobalProofs.map((p) => (
              <div key={p.block} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-neutral-900">
                    <span className="font-bold text-cyan-700">#{p.block}</span>
                    <span className="text-neutral-400">·</span>
                    <span className="text-[11px] text-neutral-600">{p.task}</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Prover: {p.prover} · {p.cycles} cycles
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-neutral-600">{p.gas}</span>
                  <div className="text-[10px] text-neutral-400">{p.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

