import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Users,
  Brain,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquare,
  FileText,
  Plus,
  Shield,
  Search,
  ExternalLink,
  Bot
} from 'lucide-react';
import { ArchitectMatchSection } from '../components/ArchitectMatchSection';
import { BrotherhoodNodeDetail } from '../components/BrotherhoodNodeDetail';

export const BrotherhoodView: React.FC = () => {
  const {
    brotherhoodNodes,
    activeBrotherhoodNodeId,
    setActiveBrotherhoodNodeId,
    architects,
    currentArchitect,
    handleBrotherhoodDecision,
    setShowBellaOverlay,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  // If a Brotherhood Node is currently active (e.g. just accepted or clicked),
  // immediately render the dedicated Brotherhood Node detailed view!
  if (activeBrotherhoodNodeId) {
    return (
      <BrotherhoodNodeDetail
        nodeId={activeBrotherhoodNodeId}
        onBack={() => {
          setActiveBrotherhoodNodeId(null);
          playCyberSound('click');
        }}
      />
    );
  }

  const [activeTab, setActiveTab] = useState<'MATCHMAKER' | 'NODES'>('MATCHMAKER');
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'SUGGESTED'>('ALL');

  const myNodes = brotherhoodNodes.filter(
    node => node.architect1Id === currentArchitect.id || node.architect2Id === currentArchitect.id
  );

  const filteredNodes = myNodes.filter(node => {
    if (filter === 'ACTIVE') return node.status === 'ACTIVE';
    if (filter === 'SUGGESTED') return node.status === 'SUGGESTED';
    return true;
  });

  const getPartner = (node: typeof brotherhoodNodes[0]) => {
    const partnerId = node.architect1Id === currentArchitect.id ? node.architect2Id : node.architect1Id;
    return architects.find(a => a.id === partnerId) || architects[1];
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top View Toggle */}
      <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-[#090d16] border border-purple-500/20 max-w-md">
        <button
          onClick={() => {
            setActiveTab('MATCHMAKER');
            playCyberSound('synapse');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-cyber font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'MATCHMAKER'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-black shadow-[0_0_15px_rgba(168,85,247,0.3)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'PL' ? 'Dopasowania Belli' : 'AI Matchmaker'}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('NODES');
            playCyberSound('click');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-cyber font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'NODES'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-black shadow-[0_0_15px_rgba(168,85,247,0.3)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{language === 'PL' ? `Węzły Brotherhood (${myNodes.length})` : `My Nodes (${myNodes.length})`}</span>
        </button>
      </div>

      {activeTab === 'MATCHMAKER' ? (
        <ArchitectMatchSection />
      ) : (
        <div className="space-y-6">
          {/* Brotherhood Header HUD */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#0a0f1d] to-cyan-950/40 border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-950/80 border-2 border-purple-400 text-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.4)]">
                <Users className="w-8 h-8 text-purple-400" />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-cyber font-bold text-xl sm:text-2xl text-white tracking-wide">
                    BROTHERHOOD ENGINE
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    1-ON-1 SOVEREIGN NODES
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono-tech mt-0.5">
                  {language === 'PL'
                    ? 'Elitarne parowanie komplementarnych Architektów sterowane przez State Bella'
                    : 'Elite 1-on-1 complementary pairing orchestrated by State Bella'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('MATCHMAKER');
                  playCyberSound('synapse');
                  triggerHaptic();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)]"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'PL' ? 'Znajdź nowego partnera przez AI' : 'Find New Partner via AI'}</span>
              </button>
            </div>
          </div>

          {/* Philosophy Axiom Box */}
          <div className="p-4 rounded-xl bg-[#090d16] border border-cyan-500/20 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0d131f] border border-cyan-500/10">
              <Brain className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-cyber font-bold text-white text-xs">Komplementarność</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Łączymy inżyniera z designerem, twórcę lore z programistą AI — nie powielamy tych samych ról.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0d131f] border border-purple-500/10">
              <Shield className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-cyber font-bold text-white text-xs">Prywatna Przestrzeń Robocza</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Każdy Brotherhood Node posiada prywatny kanał, wspólną tablicę zadań i notatki RFC.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0d131f] border border-emerald-500/10">
              <Bot className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-cyber font-bold text-white text-xs">Bella jako Co-Mediator</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Bella generuje sprinty, rozwiązuje blokady i podpowiada optymalne punkty integracji.
                </p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2">
            <div className="flex items-center gap-2">
              {(['ALL', 'ACTIVE', 'SUGGESTED'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setFilter(tab);
                    playCyberSound('click');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-all ${
                    filter === tab
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-purple-950/20'
                  }`}
                >
                  {tab === 'ALL' && (language === 'PL' ? 'Wszystkie węzły' : 'All Nodes')}
                  {tab === 'ACTIVE' && (language === 'PL' ? 'Aktywne węzły' : 'Active Nodes')}
                  {tab === 'SUGGESTED' && (language === 'PL' ? 'Sugerowane przez Bellę' : 'Suggested Pairs')}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono-tech text-slate-400">
              {filteredNodes.length} {language === 'PL' ? 'Węzłów' : 'Nodes'}
            </span>
          </div>

          {/* Nodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNodes.map(node => {
              const partner = getPartner(node);
              const completedTasks = node.sharedTasks.filter(t => t.completed).length;
              const totalTasks = node.sharedTasks.length;

              return (
                <div
                  key={node.id}
                  className="p-5 rounded-2xl bg-[#090d16] border border-cyan-500/20 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4 group shadow-lg"
                >
                  <div className="space-y-3">
                    {/* Node Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="relative flex -space-x-2">
                          <img
                            src={currentArchitect.avatar}
                            alt={currentArchitect.name}
                            className="w-10 h-10 rounded-xl object-cover border-2 border-cyan-400 z-10"
                          />
                          <img
                            src={partner.avatar}
                            alt={partner.name}
                            className="w-10 h-10 rounded-xl object-cover border-2 border-purple-400 z-0"
                          />
                        </div>
                        <div>
                          <h3 className="font-cyber font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                            {currentArchitect.name} × {partner.name}
                          </h3>
                          <p className="text-[11px] font-mono-tech text-slate-400">
                            {partner.specializations.join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {node.matchScore}% MATCH
                        </span>
                        <span className={`text-[9px] font-mono-tech mt-1 ${
                          node.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          ● {node.status}
                        </span>
                      </div>
                    </div>

                    {/* Rationale by Bella */}
                    <div className="p-3 rounded-xl bg-[#0d131f] border border-cyan-500/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-cyan-400">
                        <Bot className="w-3.5 h-3.5" />
                        <span>BELLA SYNERGY RATIONALE</span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {node.complementaryRationale}
                      </p>
                    </div>

                    {/* Metrics */}
                    {node.status === 'ACTIVE' && (
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
                        <div className="p-2 rounded-lg bg-[#06080e] border border-cyan-500/10 flex items-center justify-between">
                          <span className="text-slate-400 text-[10px]">TASKS</span>
                          <span className="text-cyan-300 font-bold">{completedTasks}/{totalTasks}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-[#06080e] border border-cyan-500/10 flex items-center justify-between">
                          <span className="text-slate-400 text-[10px]">MESSAGES</span>
                          <span className="text-purple-300 font-bold">{node.messages.length}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Node Actions */}
                  <div className="pt-3 border-t border-cyan-500/10 flex items-center justify-between gap-2">
                    {node.status === 'SUGGESTED' ? (
                      <>
                        <button
                          onClick={() => handleBrotherhoodDecision(node.id, 'DECLINE')}
                          className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white text-xs font-mono-tech transition-colors"
                        >
                          {language === 'PL' ? 'Odrzuć' : 'Decline'}
                        </button>
                        <button
                          onClick={() => handleBrotherhoodDecision(node.id, 'ACCEPT')}
                          className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>{language === 'PL' ? 'Aktywuj Brotherhood Node' : 'Activate Node'}</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveBrotherhoodNodeId(node.id);
                          playCyberSound('synapse');
                          triggerHaptic();
                        }}
                        className="w-full py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400 text-purple-200 text-xs font-cyber font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>{language === 'PL' ? 'Otwórz prywatny Workspace' : 'Open Workspace'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

