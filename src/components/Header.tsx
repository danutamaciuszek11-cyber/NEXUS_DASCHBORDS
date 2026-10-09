import React, { useEffect, useState } from 'react';
import { Cpu, ShieldCheck, Zap, Activity, Radio, Terminal } from 'lucide-react';

interface HeaderProps {
  xpPoints: number;
  totalInstances: number;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ xpPoints, totalInstances, activeTab }) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [pulsePing, setPulsePing] = useState<number>(1.2);

  useEffect(() => {
    const update = () => {
      setTimeStr(new Date().toLocaleTimeString('pl-PL', { hour12: false }));
      setPulsePing(Number((1.0 + Math.random() * 0.4).toFixed(2)));
    };
    update();
    const timer = setInterval(update, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-cyan-500/20 bg-[#070913]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & System Name */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#070913]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-wider text-white font-mono">
                NEXUS <span className="text-cyan-400">OS</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                v1.0.0-QUANTUM
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans flex items-center gap-1.5">
              <span>Architektura Nexusa</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 inline" /> IMMUTABLE NXL SHIELD
              </span>
            </p>
          </div>
        </div>

        {/* Telemetry Stats Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Synapse Mesh:</span>
            <span className="text-cyan-300 font-bold">{totalInstances} Instancji</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Doświadczenie XP:</span>
            <span className="text-amber-300 font-bold">{xpPoints.toLocaleString()} XP</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Opóźnienie:</span>
            <span className="text-emerald-300 font-bold">{pulsePing} ms</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-xs font-mono text-cyan-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>{timeStr}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
