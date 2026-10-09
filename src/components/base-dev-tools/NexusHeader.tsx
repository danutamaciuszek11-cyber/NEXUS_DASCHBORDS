import React from 'react';
import { 
  Cpu, 
  Server, 
  Award, 
  Code2, 
  Globe, 
  User, 
  Activity, 
  Wallet, 
  Layers, 
  Zap,
  Sparkles,
  Share2
} from 'lucide-react';
import { NexusTab, Language, UserProfile } from '../../types/base-dev-tools';

interface NexusHeaderProps {
  activeTab: NexusTab;
  setActiveTab: (tab: NexusTab) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  userProfile: UserProfile;
  userPoints: number;
}

export function NexusHeader({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  userProfile,
  userPoints,
}: NexusHeaderProps) {
  const tabs: { id: NexusTab; labelPl: string; labelEn: string; icon: any }[] = [
    { id: 'prover', labelPl: 'Prover (Kopanie)', labelEn: 'Web Prover', icon: Zap },
    { id: 'swarm', labelPl: 'Rój P2P (Swarm)', labelEn: 'P2P Swarm', icon: Share2 },
    { id: 'nodes', labelPl: 'Węzły (Nodes)', labelEn: 'My Nodes', icon: Server },
    { id: 'rewards', labelPl: 'Nagrody & Punkty', labelEn: 'Rewards & Points', icon: Award },
    { id: 'zkvm', labelPl: 'zkVM Studio', labelEn: 'zkVM Studio', icon: Code2 },
    { id: 'simulator', labelPl: 'Symulator TX', labelEn: 'TX Simulator', icon: Activity },
    { id: 'network', labelPl: 'Sieć & Telemetria', labelEn: 'Network Stats', icon: Globe },
    { id: 'profile', labelPl: 'Profil Operatora', labelEn: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('prover')}
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-neutral-950 rounded-[11px] flex items-center justify-center group-hover:bg-neutral-900 transition-colors">
              <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-cyan-300 font-mono">
                NXL NEXUS
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold">
                TESTNET III
              </span>
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-neutral-900/80 p-1 rounded-xl border border-neutral-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (typeof setActiveTab === 'function') setActiveTab(tab.id);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-neutral-800 text-cyan-300 shadow-sm border border-neutral-700 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                }`}
              >
                {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-neutral-400'}`} />}
                <span>{lang === 'pl' ? tab.labelPl : tab.labelEn}</span>
              </button>
            );
          })}
        </nav>

        {/* Right tools: Language, Points, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Points badge */}
          <div 
            onClick={() => setActiveTab('rewards')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-cyan-500/40 transition-colors cursor-pointer text-xs font-mono"
            title="Claimable NXL Points"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-white">
              {userPoints.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className="text-cyan-400 text-[10px]">NXL</span>
          </div>

          {/* Language selector toggle */}
          <div className="flex items-center bg-neutral-900 rounded-lg p-0.5 border border-neutral-800 text-xs font-mono">
            <button
              onClick={() => setLang('pl')}
              className={`px-2 py-1 rounded transition-colors ${
                lang === 'pl' ? 'bg-cyan-950 text-cyan-400 font-bold border border-cyan-800' : 'text-neutral-400 hover:text-white'
              }`}
            >
              PL
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded transition-colors ${
                lang === 'en' ? 'bg-cyan-950 text-cyan-400 font-bold border border-cyan-800' : 'text-neutral-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Profile Button */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 p-1 pr-2.5 rounded-xl border transition-all ${
              activeTab === 'profile'
                ? 'border-cyan-500 bg-cyan-950/60 text-white'
                : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700 text-neutral-300'
            }`}
          >
            <div className="w-6 h-6 rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700 flex items-center justify-center flex-shrink-0">
              {userProfile.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt={userProfile.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center font-mono">
                  {userProfile.username ? userProfile.username.charAt(0).toUpperCase() : 'N'}
                </div>
              )}
            </div>
            <span className="text-xs font-mono font-semibold max-w-[80px] truncate hidden md:inline">
              @{userProfile.username}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto gap-1 px-4 py-2 bg-neutral-900/90 border-t border-neutral-800/80 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (typeof setActiveTab === 'function') setActiveTab(tab.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-neutral-800 text-cyan-300 border border-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {Icon && <Icon className="w-3 h-3" />}
              <span>{lang === 'pl' ? tab.labelPl : tab.labelEn}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}

