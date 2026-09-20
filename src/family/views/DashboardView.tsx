import React from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Brain,
  Zap,
  Target,
  Users,
  FolderGit2,
  Globe,
  Radio,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Flame,
  Shield,
  Clock,
  Compass,
  Cpu
} from 'lucide-react';
import { NexusCoreVisualizer } from '../components/NexusCoreVisualizer';

export const DashboardView: React.FC = () => {
  const {
    currentArchitect,
    telemetry,
    missions,
    projects,
    worlds,
    brotherhoodNodes,
    feedPosts,
    setCurrentView,
    setActiveMissionId,
    setActiveProjectId,
    setActiveBrotherhoodNodeId,
    setShowBellaOverlay,
    setShowOnboardingModal,
    openNeuralBridgeModal,
    openChronicleModal,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const openMissions = missions.filter(m => m.status === 'OPEN').slice(0, 3);
  const activeProjects = projects.filter(p => p.status === 'BUILDING' || p.status === 'PROTOTYPE').slice(0, 3);
  const suggestedBrotherhood = brotherhoodNodes.filter(b => b.status === 'SUGGESTED')[0];
  const recentPosts = feedPosts.slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Nexus Core HUD */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-[#0a0f1d] via-[#070a12] to-[#120b22] p-6 shadow-[0_0_40px_rgba(0,240,255,0.1)]">
        {/* Living Synaptic Background Visualizer */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <NexusCoreVisualizer />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono-tech flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                NEXUS OPERATING SYSTEM v2.5
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono-tech">
                SOVEREIGN LAYER
              </span>
              {!currentArchitect.oathSigned && (
                <button
                  onClick={() => {
                    setCurrentView('CODE');
                    playCyberSound('beep');
                  }}
                  className="px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono-tech hover:bg-amber-500/30 transition-all flex items-center gap-1"
                >
                  <Flame className="w-3 h-3 text-amber-400" />
                  Sign Nexus Oath (+300 pts)
                </button>
              )}
            </div>

            <div>
              <h1 className="font-cyber font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-wide leading-tight">
                {language === 'PL' ? 'Witamy w Rodzinie Architektów' : 'Welcome to the Family of Architects'}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base font-sans mt-2 max-w-2xl leading-relaxed">
                {language === 'PL'
                  ? 'NEXUS nie jest zwykłym produktem — to zamknięty ekosystem budowany przez elitarne umysły. Projektuj moduły, podejmuj misje i twórz synergie w Brotherhood Engine.'
                  : 'NEXUS is not a standard product — it is a sovereign collective ecosystem built by elite minds. Architect modules, claim missions, and forge synergies in the Brotherhood Engine.'}
              </p>
            </div>

            {/* Quick Action Matrix */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="dash-bella-btn"
                onClick={() => {
                  setShowBellaOverlay(true);
                  playCyberSound('synapse');
                  triggerHaptic();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-cyber font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-102"
              >
                <Sparkles className="w-4 h-4" />
                <span>CONSULT STATE BELLA AI</span>
              </button>

              <button
                id="dash-missions-btn"
                onClick={() => {
                  setCurrentView('MISSIONS');
                  playCyberSound('click');
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0e1626] hover:bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-cyber transition-all"
              >
                <Target className="w-4 h-4 text-cyan-400" />
                <span>OPEN MISSIONS ({openMissions.length})</span>
              </button>

              <button
                id="dash-brotherhood-btn"
                onClick={() => {
                  setCurrentView('BROTHERHOOD');
                  playCyberSound('click');
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0e1626] hover:bg-purple-950/50 border border-purple-500/30 text-purple-300 text-xs font-cyber transition-all"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>BROTHERHOOD ENGINE</span>
              </button>

              <button
                id="dash-neural-bridge-btn"
                onClick={() => {
                  openNeuralBridgeModal();
                  playCyberSound('click');
                  triggerHaptic();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0e1626] hover:bg-teal-950/50 border border-teal-500/40 text-teal-300 text-xs font-cyber transition-all shadow-[0_0_15px_rgba(20,184,166,0.2)]"
              >
                <Brain className="w-4 h-4 text-teal-400" />
                <span>NEURAL BRIDGE (RFC-01)</span>
              </button>

              <button
                id="dash-chronicle-btn"
                onClick={() => {
                  openChronicleModal();
                  playCyberSound('click');
                  triggerHaptic();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0e1626] hover:bg-amber-950/50 border border-amber-500/40 text-amber-300 text-xs font-cyber transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              >
                <FolderGit2 className="w-4 h-4 text-amber-400" />
                <span>CHRONICLE OF ETERNIVERSE</span>
              </button>
            </div>
          </div>

          {/* Telemetry Radar Block */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-[#080c14]/90 border border-cyan-500/20 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2">
              <span className="text-[11px] font-mono-tech text-cyan-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                SYSTEM TELEMETRY
              </span>
              <span className="text-[10px] font-mono-tech text-emerald-400">
                CORE: {telemetry.coreHealth.toFixed(1)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono-tech">
              <div className="p-2.5 rounded-lg bg-[#0d131f] border border-cyan-500/10">
                <p className="text-slate-400 text-[10px]">ACTIVE BUILDERS</p>
                <p className="text-base font-bold text-white font-cyber mt-0.5">{telemetry.activeArchitects}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0d131f] border border-cyan-500/10">
                <p className="text-slate-400 text-[10px]">SYNAPSE FLASHES/M</p>
                <p className="text-base font-bold text-cyan-400 font-cyber mt-0.5">{telemetry.synapticFlashesPerMin}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0d131f] border border-cyan-500/10">
                <p className="text-slate-400 text-[10px]">TOTAL PROJECTS</p>
                <p className="text-base font-bold text-purple-400 font-cyber mt-0.5">{projects.length}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0d131f] border border-cyan-500/10">
                <p className="text-slate-400 text-[10px]">CONTRIBUTION PTS</p>
                <p className="text-base font-bold text-amber-400 font-cyber mt-0.5">{currentArchitect.contributionScore}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PARADYGMAT NEXUS: ORGANIZM "MY" */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#070b16] to-cyan-950/40 border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.15)] space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-purple-500/20 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-cyber text-purple-300 font-bold">
              <Compass className="w-4 h-4 text-purple-400" />
              <span>PARADYGMAT NEXUS • ORGANIZM "MY"</span>
            </div>
            <h3 className="text-lg sm:text-xl font-cyber font-extrabold text-white tracking-wide">
              NIE JA. NIE TY. MY.
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-tech">
            <span className="px-3 py-1 rounded-lg bg-purple-900/60 border border-purple-400/50 text-purple-200 font-bold">
              BELLA SUGGESTS. WE REASON. WE CHOOSE. WE BUILD.
            </span>
          </div>
        </div>

        {/* Dynamic Horizontal Flow Pipeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-1 text-center font-mono-tech text-xs">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-1 flex flex-col justify-between">
            <span className="text-[10px] text-cyan-400 font-bold">1. INTENCJA</span>
            <span className="text-slate-200 text-[11px]">HUMAN + AI + BROTHERHOOD</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/30 space-y-1 flex flex-col justify-between">
            <span className="text-[10px] text-purple-400 font-bold">2. SYNTEZA</span>
            <span className="text-slate-200 text-[11px]">ANALIZA / DIALOG</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-teal-500/30 space-y-1 flex flex-col justify-between">
            <span className="text-[10px] text-teal-400 font-bold">3. REKOMENDACJA</span>
            <span className="text-slate-200 text-[11px]">PROPOZYCJE BELLI</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-1 flex flex-col justify-between">
            <span className="text-[10px] text-amber-400 font-bold">4. VERIFICATION</span>
            <span className="text-slate-200 text-[11px]">WERYFIKACJA / EGIDA</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-1 flex flex-col justify-between">
            <span className="text-[10px] text-emerald-400 font-bold">5. DECYZJA</span>
            <span className="text-slate-200 text-[11px]">WSPÓLNA DECYZJA</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-1 flex flex-col justify-between">
            <span className="text-[10px] text-indigo-400 font-bold">6. EXECUTION</span>
            <span className="text-slate-200 text-[11px]">ANTIGRAVITY</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-pink-500/30 space-y-1 col-span-2 sm:col-span-1 flex flex-col justify-between">
            <span className="text-[10px] text-pink-400 font-bold">7. EFEKT</span>
            <span className="text-slate-200 text-[11px]">REALIZACJA (MY)</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 font-mono-tech leading-relaxed border-t border-purple-500/15 pt-2">
          <strong className="text-purple-300 font-cyber">HUMAN + AI + ARCHITECTURE + COLLABORATION = NEXUS.</strong> Człowiek wnosi intencję i bierze odpowiedzialność przy decyzjach wysokiego ryzyka. AI wnosi inteligencję. Brotherhood wnosi doświadczenie. Architecture nadaje strukturę. Collaboration tworzy wynik.
        </p>
      </div>

      {/* Suggested Brotherhood Match Highlight (if available) */}
      {suggestedBrotherhood && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-cyan-950/30 to-purple-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-950 border border-purple-400 text-purple-300 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cyber font-bold text-xs text-purple-300 uppercase tracking-wider">
                  STATE BELLA SUGGESTION: BROTHERHOOD COMPATIBILITY ({suggestedBrotherhood.matchScore}%)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {suggestedBrotherhood.complementaryRationale}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveBrotherhoodNodeId(suggestedBrotherhood.id);
              playCyberSound('synapse');
              triggerHaptic();
            }}
            className="shrink-0 px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400 text-purple-200 text-xs font-cyber transition-all flex items-center gap-1.5"
          >
            <span>Inspect Node & Pair</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Grid: Worlds, Missions, Projects, Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Nexus Worlds & Active Projects (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Nexus Worlds Quick Matrix */}
          <div className="p-5 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h3 className="font-cyber font-bold text-sm text-white tracking-wide">
                  {language === 'PL' ? 'ŚWIATY NEXUSA' : 'NEXUS WORLDS'} ({worlds.length})
                </h3>
              </div>
              <button
                onClick={() => {
                  setCurrentView('WORLDS');
                  playCyberSound('click');
                }}
                className="text-xs font-mono-tech text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>{language === 'PL' ? 'Zobacz wszystkie' : 'View all'}</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {worlds.slice(0, 3).map(w => (
                <div
                  key={w.id}
                  onClick={() => {
                    setCurrentView('WORLDS');
                    playCyberSound('click');
                  }}
                  className="p-3 rounded-xl bg-[#0d131f] border border-cyan-500/15 hover:border-cyan-500/40 hover:bg-cyan-950/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-cyber font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                      {w.name}
                    </span>
                    <span className="text-[9px] font-mono-tech px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/20">
                      {w.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 font-sans">
                    {w.tagline}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-cyan-500/10 flex items-center justify-between text-[10px] font-mono-tech text-slate-500">
                    <span>{w.modules.length} Modules</span>
                    <span className="text-cyan-400">⚡ {w.contributionPoints} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Projects Hub Snippet */}
          <div className="p-5 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-purple-400" />
                <h3 className="font-cyber font-bold text-sm text-white tracking-wide">
                  {language === 'PL' ? 'AKTYWNE PROJEKTY ARCHITEKTÓW' : 'ACTIVE BUILDER PROJECTS'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setCurrentView('PROJECTS');
                  playCyberSound('click');
                }}
                className="text-xs font-mono-tech text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <span>{language === 'PL' ? 'Otwórz Hub' : 'Open Hub'}</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {activeProjects.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setActiveProjectId(p.id);
                    playCyberSound('click');
                  }}
                  className="p-3.5 rounded-xl bg-[#0d131f] border border-purple-500/15 hover:border-purple-500/40 hover:bg-purple-950/20 transition-all cursor-pointer group flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-cyber font-bold text-xs text-white group-hover:text-purple-300 transition-colors">
                        {p.title}
                      </span>
                      <span className="text-[9px] font-mono-tech px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
                        {p.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate font-sans">
                      {p.tagline}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <span className="text-[11px] font-mono-tech text-cyan-400">
                      +{p.contributionBounty} pts
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mission Board & Builder Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Mission Board Snippet */}
          <div className="p-5 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <h3 className="font-cyber font-bold text-sm text-white tracking-wide">
                  {language === 'PL' ? 'TABLICA MISJI' : 'MISSION BOARD'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setCurrentView('MISSIONS');
                  playCyberSound('click');
                }}
                className="text-xs font-mono-tech text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>{language === 'PL' ? 'Wszystkie misje' : 'All missions'}</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {openMissions.map(m => (
                <div
                  key={m.id}
                  onClick={() => {
                    setActiveMissionId(m.id);
                    playCyberSound('click');
                  }}
                  className="p-3 rounded-xl bg-[#0d131f] border border-emerald-500/15 hover:border-emerald-500/40 hover:bg-emerald-950/20 transition-all cursor-pointer group space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-cyber font-bold text-xs text-white group-hover:text-emerald-300 transition-colors truncate">
                      {m.title}
                    </span>
                    <span className="text-[10px] font-mono-tech text-emerald-400 shrink-0 font-bold">
                      +{m.rewardScore} pts
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
                    <span>Diff: {m.difficulty}</span>
                    <span>Deadline: {m.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Builder Stream Snippet */}
          <div className="p-5 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="font-cyber font-bold text-sm text-white tracking-wide">
                  {language === 'PL' ? 'LIVE BUILDER STREAM' : 'LIVE BUILDER STREAM'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setCurrentView('FEED');
                  playCyberSound('click');
                }}
                className="text-xs font-mono-tech text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Feed</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {recentPosts.map(post => (
                <div
                  key={post.id}
                  className="p-3 rounded-xl bg-[#0d131f] border border-cyan-500/10 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
                    <span className="text-cyan-300 font-cyber font-semibold">{post.title}</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/20">{post.category}</span>
                  </div>
                  <p className="text-slate-300 text-xs font-sans line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[10px] font-mono-tech text-slate-400">
                    <span>⚡ {post.reactions.synapse}</span>
                    <span>🛠️ {post.reactions.built}</span>
                    <span>💡 {post.reactions.spark}</span>
                    <span>💬 {post.comments.length}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
