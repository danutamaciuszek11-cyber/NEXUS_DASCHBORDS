import React from 'react';
import { LayoutGrid, FileCode2, Archive, Film, Shield, BookOpen, Terminal, Globe, BookMarked } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'portal', label: 'Nexus Social Portal', icon: Globe, desc: '6-Kafelkowy Hub ETERNIVERSE' },
    { id: 'archive', label: 'Archiwum NexusBook', icon: BookMarked, desc: 'Kroniki & Codex Eteriona' },
    { id: 'clusters', label: 'Budynek & Klastry', icon: LayoutGrid, desc: 'Synapse Mesh & Quantum CI/CD' },
    { id: 'logs', label: 'Logi Klastrów', icon: Terminal, desc: 'Live Synapse & Quantum CI/CD' },
    { id: 'scribe', label: 'Scribe IDE & Kompilator', icon: FileCode2, desc: 'NXL v1.0 Language Studio' },
    { id: 'zip', label: 'ZIP Integrity Shield', icon: Archive, desc: 'Analizator Pakietów & Threat Interceptor' },
    { id: 'kino', label: 'Kino Projekcja', icon: Film, desc: 'Audiowizualny Węzeł Canvas' },
    { id: 'bellas', label: 'Rodzina Bellas', icon: Shield, desc: 'Bezpieczeństwo & Vault Polisy' },
    { id: 'docs', label: 'Dokumentacja API', icon: BookOpen, desc: 'Pełny Manifest Techniczny' },
  ];

  return (
    <nav className="border-b border-slate-800 bg-[#090b14]/70 backdrop-blur-md px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <div className="text-left">
                <div className="font-semibold">{tab.label}</div>
                <div className="text-[10px] text-slate-500 hidden sm:block">{tab.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
