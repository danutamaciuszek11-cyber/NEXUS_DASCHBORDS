import React from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  Globe, 
  FileText, 
  Users, 
  Layers, 
  ExternalLink, 
  Github, 
  Share2, 
  Sparkles, 
  TrendingUp, 
  BarChart2
} from 'lucide-react';
import { SystemStats } from '../types';

interface StatsDashboardProps {
  stats: SystemStats;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  const platformLinks = [
    { label: 'Amazon', count: '8 Dzieł', icon: Globe, color: 'text-amber-400', url: 'https://amazon.com' },
    { label: 'Wattpad', count: '12 Dzieł', icon: ExternalLink, color: 'text-orange-400', url: 'https://wattpad.com' },
    { label: 'Pinterest', count: '45 Boardów', icon: Share2, color: 'text-rose-400', url: 'https://pinterest.com' },
    { label: 'Substack', count: '3.4k Subskrybentów', icon: FileText, color: 'text-purple-400', url: 'https://substack.com' },
    { label: 'GitHub', count: '18 Repozytoriów', icon: Github, color: 'text-cyan-400', url: 'https://github.com' },
    { label: 'ORCID', count: 'ID 0000-0002-984', icon: Sparkles, color: 'text-emerald-400', url: 'https://orcid.org' }
  ];

  return (
    <div className="w-full rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-6 md:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-[10px] uppercase tracking-widest">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <BarChart2 className="w-3.5 h-3.5" />
          <span>TELEMETRY METRICS & KNOWLEDGE SYSTEM STATS</span>
        </div>
        <span className="text-white/40">REAL-TIME MONITOR</span>
      </div>

      {/* Main Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 font-mono">
        
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-white/40 text-[9px] uppercase tracking-wider">
            <span>BOOKS</span>
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white tracking-tighter">{stats.totalBooks}</p>
          <span className="text-[9px] text-white/30 uppercase">Vault Collection</span>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-emerald-400 text-[9px] uppercase tracking-wider">
            <span>PUBLISHED</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-black text-emerald-400 tracking-tighter">{stats.publishedCount}</p>
          <span className="text-[9px] text-white/30 uppercase">Active Masterpieces</span>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-purple-400 text-[9px] uppercase tracking-wider">
            <span>DRAFTS</span>
            <Lock className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-black text-purple-400 tracking-tighter">{stats.draftsCount}</p>
          <span className="text-[9px] text-white/30 uppercase">Prototypes</span>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-amber-400 text-[9px] uppercase tracking-wider">
            <span>LANGUAGES</span>
            <Globe className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-black text-amber-400 tracking-tighter">{stats.languagesCount}</p>
          <span className="text-[9px] text-white/30 uppercase">PL / EN / DE / FR</span>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-blue-400 text-[9px] uppercase tracking-wider">
            <span>PAGES</span>
            <FileText className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-black text-blue-400 tracking-tighter">{stats.totalPages.toLocaleString()}</p>
          <span className="text-[9px] text-white/30 uppercase">Total Volume</span>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-cyan-400 text-[9px] uppercase tracking-wider">
            <span>WORDS</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-black text-cyan-400 tracking-tighter">{stats.totalWords.toLocaleString()}</p>
          <span className="text-[9px] text-white/30 uppercase">Reconstruction</span>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-rose-400 text-[9px] uppercase tracking-wider">
            <span>READERS</span>
            <Users className="w-3.5 h-3.5" />
          </div>
          <p className="text-2xl font-black text-rose-400 tracking-tighter">{stats.totalReaders.toLocaleString()}</p>
          <span className="text-[9px] text-white/30 uppercase">Active Seekers</span>
        </div>

      </div>

      {/* External Platforms Metrics Grid */}
      <div className="pt-2">
        <div className="text-[9px] font-mono uppercase text-white/40 tracking-widest mb-3">
          EXTERNAL ECOSYSTEM INTEGRATION
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          {platformLinks.map((plat) => {
            const Icon = plat.icon;
            return (
              <a 
                key={plat.label}
                href={plat.url}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 flex flex-col space-y-1 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white group-hover:text-blue-300 transition-colors text-xs">{plat.label}</span>
                  <Icon className={`w-3.5 h-3.5 ${plat.color}`} />
                </div>
                <span className="text-[10px] text-white/40">{plat.count}</span>
              </a>
            );
          })}
        </div>
      </div>

    </div>
  );
};
