import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Users,
  Sparkles,
  Bot,
  Zap,
  Check,
  X,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Brain,
  Code2,
  Compass,
  FolderGit2,
  MessageSquare,
  SlidersHorizontal,
  RefreshCw,
  ExternalLink,
  Target,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { ArchitectMatchSuggestion, ProjectCollaborationSuggestion } from '../types';

export const BellaCollaborationHub: React.FC = () => {
  const {
    architectMatches,
    projectCollaborationSuggestions,
    projects,
    architects,
    currentArchitect,
    brotherhoodNodes,
    handleMatchDecision,
    handleCollaborationDecision,
    runArchitectMatchmaking,
    analyzeArchitectPair,
    isMatchingLoading,
    setActiveBrotherhoodNodeId,
    setCurrentView,
    createBrotherhoodNode,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const [activeTab, setActiveTab] = useState<'ARCHITECT_PAIRS' | 'PROJECT_COLLABS' | 'PAIR_LAB'>('ARCHITECT_PAIRS');
  const [customGoal, setCustomGoal] = useState('');
  const [matchFilter, setMatchFilter] = useState<'ALL' | 'SUGGESTED' | 'ACCEPTED' | 'POSTPONED'>('ALL');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  // Pairwise Lab State
  const [labArch1Id, setLabArch1Id] = useState<string>(currentArchitect.id);
  const [labArch2Id, setLabArch2Id] = useState<string>(
    architects.find(a => a.id !== currentArchitect.id)?.id || architects[1]?.id || ''
  );
  const [isAnalyzingPair, setIsAnalyzingPair] = useState<boolean>(false);
  const [pairAnalysisResult, setPairAnalysisResult] = useState<any | null>(null);

  const getArchitect = (id: string) => {
    return architects.find(a => a.id === id) || architects[0];
  };

  const getProject = (id: string) => {
    return projects.find(p => p.id === id) || projects[0];
  };

  const filteredMatches = architectMatches.filter(m => {
    if (matchFilter === 'ALL') return true;
    return m.status === matchFilter;
  });

  const handleRunMatchmaking = (e: React.FormEvent) => {
    e.preventDefault();
    runArchitectMatchmaking(customGoal.trim() || undefined);
  };

  const handleRunPairLab = async () => {
    if (!labArch1Id || !labArch2Id || labArch1Id === labArch2Id) return;
    setIsAnalyzingPair(true);
    playCyberSound('synapse');
    try {
      const result = await analyzeArchitectPair(labArch1Id, labArch2Id);
      setPairAnalysisResult(result);
      playCyberSound('success');
      triggerHaptic();
    } catch (e) {
      console.warn('Pair analysis failed:', e);
    } finally {
      setIsAnalyzingPair(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hub Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#0a0f1d] to-cyan-950/60 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-mono-tech rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>STATE BELLA MATCHMAKER</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                COMPLEMENTARY SKILLS & GOALS
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                BELLA SUGGESTS. WE REASON. WE CHOOSE. WE BUILD.
              </span>
            </div>

            <h2 className="font-cyber font-bold text-xl sm:text-2xl text-white tracking-wide flex items-center gap-3">
              <span>COLLABORATION & SYNERGY ENGINE</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>

            <p className="text-xs text-slate-300 font-mono-tech max-w-2xl leading-relaxed">
              {language === 'PL'
                ? 'Bella analizuje profile architektów (umiejętności, zainteresowania, styl pracy i cele) oraz bieżące potrzeby projektów w celu rekomendowania zbalansowanych duetów i wsparcia kluczowych modułów ekosystemu.'
                : 'Bella evaluates architect profiles (skills, interests, cadence, and goals) and project requirements to suggest complementary pairs and accelerate ecosystem initiatives.'}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#090d16]/80 border border-purple-500/20 backdrop-blur-md">
            <div className="text-center px-2">
              <span className="text-[10px] font-mono-tech text-slate-400 block">PROFILES</span>
              <span className="text-lg font-cyber font-bold text-cyan-400">{architects.length}</span>
            </div>
            <div className="w-[1px] h-8 bg-purple-500/20" />
            <div className="text-center px-2">
              <span className="text-[10px] font-mono-tech text-slate-400 block">DUET MATCHES</span>
              <span className="text-lg font-cyber font-bold text-purple-400">{architectMatches.length}</span>
            </div>
            <div className="w-[1px] h-8 bg-purple-500/20" />
            <div className="text-center px-2">
              <span className="text-[10px] font-mono-tech text-slate-400 block">PROJECT LEADS</span>
              <span className="text-lg font-cyber font-bold text-emerald-400">{projectCollaborationSuggestions.length}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Goal Filter Prompt */}
        <form onSubmit={handleRunMatchmaking} className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            placeholder="Wprowadź cel lub poszukiwane umiejętności (np. 'Szukamy specjalisty od WebGL/Three.js do wizualizatora node-canvas')..."
            className="flex-1 bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 rounded-xl px-4 py-2 text-xs font-mono-tech text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isMatchingLoading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-cyber font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isMatchingLoading ? 'animate-spin' : ''}`} />
            <span>{isMatchingLoading ? 'KALIBRACJA...' : 'PRZELICZ SYNERGIE'}</span>
          </button>
        </form>
      </div>

      {/* Sub-Nav Mode Selector */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('ARCHITECT_PAIRS')}
          className={`px-4 py-2 rounded-xl text-xs font-cyber transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'ARCHITECT_PAIRS'
              ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>DOPASOWANIA ARCHITEKTÓW (DUETY BROTHERHOOD)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-950 border border-purple-400/40">
            {filteredMatches.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('PROJECT_COLLABS')}
          className={`px-4 py-2 rounded-xl text-xs font-cyber transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'PROJECT_COLLABS'
              ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>WSPARCIE PROJEKTÓW (POTRZEBY & LUKI)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-950 border border-purple-400/40">
            {projectCollaborationSuggestions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('PAIR_LAB')}
          className={`px-4 py-2 rounded-xl text-xs font-cyber transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'PAIR_LAB'
              ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>LABORATORIUM SYNERGII 1-ON-1</span>
        </button>
      </div>

      {/* Tab 1: Architect Pairs (Brotherhood Matchmaking) */}
      {activeTab === 'ARCHITECT_PAIRS' && (
        <div className="space-y-4">
          {/* Status filter */}
          <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400">
            <div className="flex items-center gap-2">
              <span>Status:</span>
              {(['ALL', 'SUGGESTED', 'ACCEPTED', 'POSTPONED'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setMatchFilter(s)}
                  className={`px-2.5 py-1 rounded text-xs transition-all ${
                    matchFilter === s
                      ? 'bg-cyan-500 text-black font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-purple-300">
              Motto: „Bella sugeruje. Człowiek decyduje.”
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredMatches.map(match => {
              const partner = getArchitect(match.architectId);
              const isExpanded = expandedMatchId === match.id;

              return (
                <div
                  key={match.id}
                  className="p-5 rounded-2xl bg-[#0a0f1d] border border-slate-800 hover:border-purple-500/40 transition-all space-y-4"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Partner info */}
                    <div className="flex items-center gap-3.5">
                      <img
                        src={partner.avatar}
                        alt={partner.name}
                        className="w-12 h-12 rounded-xl object-cover border border-cyan-400/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-cyber font-bold text-base text-white">{partner.name}</h3>
                          <span className="text-xs font-mono-tech text-slate-400">@{partner.handle}</span>
                          <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {partner.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {match.briefRationale}
                        </p>
                      </div>
                    </div>

                    {/* Compatibility Score badge & Action buttons */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] font-mono-tech text-slate-400 block">KOMPATYBILNOŚĆ</span>
                        <span className="text-xl font-cyber font-bold text-cyan-400">
                          {match.compatibilityScore}%
                        </span>
                      </div>

                      {match.status === 'SUGGESTED' && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              handleMatchDecision(match.id, 'ACCEPTED');
                              playCyberSound('success');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-cyber font-bold text-xs transition-all flex items-center gap-1 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Zaakceptuj Duet</span>
                          </button>
                          <button
                            onClick={() => {
                              handleMatchDecision(match.id, 'POSTPONED');
                              playCyberSound('click');
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                            title="Odłóż na później"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              handleMatchDecision(match.id, 'DECLINED');
                              playCyberSound('beep');
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                            title="Odrzuć"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {match.status === 'ACCEPTED' && (
                        <span className="px-3 py-1 text-xs font-mono-tech rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>WĘZEŁ BROTHERHOOD AKTYWNY</span>
                        </span>
                      )}

                      {match.status === 'POSTPONED' && (
                        <span className="px-2.5 py-1 text-xs font-mono-tech rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          ODŁOŻONE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 6-Dimension Score Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-800/80">
                    <div className="p-2.5 rounded-lg bg-[#080d1a] border border-slate-800">
                      <span className="text-[10px] font-mono-tech text-slate-400 block">KOMPETENCJE</span>
                      <strong className="text-sm font-cyber text-cyan-300">
                        {match.dimensionScores?.competencies || 92}%
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#080d1a] border border-slate-800">
                      <span className="text-[10px] font-mono-tech text-slate-400 block">PROJEKTY</span>
                      <strong className="text-sm font-cyber text-purple-300">
                        {match.dimensionScores?.projects || 90}%
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#080d1a] border border-slate-800">
                      <span className="text-[10px] font-mono-tech text-slate-400 block">ZAINTERESOWANIA</span>
                      <strong className="text-sm font-cyber text-emerald-300">
                        {match.dimensionScores?.interests || 94}%
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#080d1a] border border-slate-800">
                      <span className="text-[10px] font-mono-tech text-slate-400 block">CELE</span>
                      <strong className="text-sm font-cyber text-amber-300">
                        {match.dimensionScores?.goals || 91}%
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#080d1a] border border-slate-800">
                      <span className="text-[10px] font-mono-tech text-slate-400 block">STYL PRACY</span>
                      <strong className="text-sm font-cyber text-pink-300">
                        {match.dimensionScores?.workStyle || 89}%
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#080d1a] border border-slate-800">
                      <span className="text-[10px] font-mono-tech text-slate-400 block">DOŚWIADCZENIE</span>
                      <strong className="text-sm font-cyber text-indigo-300">
                        {match.dimensionScores?.experience || 93}%
                      </strong>
                    </div>
                  </div>

                  {/* Toggle Detailed Dimensions View */}
                  <div className="pt-2">
                    <button
                      onClick={() => setExpandedMatchId(isExpanded ? null : match.id)}
                      className="text-xs font-mono-tech text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Zwiń analizę 6D i propozycję RFC' : 'Rozwiń szczegółową analizę 6D & propozycję projektu'}</span>
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-4 rounded-xl bg-[#080d1a] border border-purple-500/20 space-y-4 animate-in fade-in">
                        {/* 6D details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-cyan-400 font-bold block mb-0.5">Synergia Kompetencji:</span>
                            <p className="text-slate-300">{match.dimensions.competencyMatch}</p>
                          </div>
                          <div>
                            <span className="text-purple-400 font-bold block mb-0.5">Zbieżność Projektowa:</span>
                            <p className="text-slate-300">{match.dimensions.projectSynergy}</p>
                          </div>
                          <div>
                            <span className="text-emerald-400 font-bold block mb-0.5">Wspólne Zainteresowania:</span>
                            <p className="text-slate-300">{match.dimensions.interestAlignment}</p>
                          </div>
                          <div>
                            <span className="text-amber-400 font-bold block mb-0.5">Zgodność Celów i Eposu:</span>
                            <p className="text-slate-300">{match.dimensions.goalAlignment || 'Zbieżne cele długofalowe'}</p>
                          </div>
                          <div>
                            <span className="text-pink-400 font-bold block mb-0.5">Komplementarność Stylu Pracy:</span>
                            <p className="text-slate-300">{match.dimensions.workStyleComplementarity}</p>
                          </div>
                          <div>
                            <span className="text-indigo-400 font-bold block mb-0.5">Synergia Doświadczenia:</span>
                            <p className="text-slate-300">{match.dimensions.experienceSynergy || 'Równowaga wiedzy domenowej'}</p>
                          </div>
                        </div>

                        {/* Proposed Project Space */}
                        {match.pairProjectProposal && (
                          <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-500/30 space-y-1">
                            <span className="text-[10px] font-mono-tech text-purple-300 font-bold block">
                              PROPOZYCJA WSPÓLNEJ PRZESTRZENI PROJEKTOWEJ BELLI:
                            </span>
                            <h4 className="font-cyber font-bold text-white text-sm">
                              {match.pairProjectProposal.title}
                            </h4>
                            <p className="text-xs text-slate-300">
                              {match.pairProjectProposal.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono-tech text-slate-400 pt-1">
                              <span>Świat: <strong className="text-cyan-300">{match.pairProjectProposal.worldSlug}</strong></span>
                              <span>Cel: <strong className="text-purple-300">{match.pairProjectProposal.targetDeliverable}</strong></span>
                              <span>Czas: <strong className="text-emerald-300">{match.pairProjectProposal.estimatedTimeline}</strong></span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Project Collaboration Suggestions */}
      {activeTab === 'PROJECT_COLLABS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-slate-300">
            Bella analizuje aktywne projekty i zgłasza architektów, których unikalne specjalizacje natychmiast uzupełniają wąskie gardła i kamienie milowe projektu:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectCollaborationSuggestions.map(collab => {
              const project = getProject(collab.projectId);
              const architect = getArchitect(collab.architectId);

              return (
                <div
                  key={collab.id}
                  className="p-5 rounded-2xl bg-[#0a0f1d] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 uppercase block mb-1">
                          PROJEKT: {project.title}
                        </span>
                        <h4 className="font-cyber font-bold text-white text-base">
                          {architect.name}
                        </h4>
                        <span className="text-xs font-mono-tech text-slate-400">
                          @{architect.handle} • {architect.role}
                        </span>
                      </div>

                      <span className="px-2.5 py-1 text-xs font-cyber font-bold rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        {collab.compatibilityScore}% FIT
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {collab.rationale}
                    </p>

                    {/* Complementary skills */}
                    {collab.complementarySkills && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono-tech text-slate-400 block">KOMPLEMENTARNE SKILLE:</span>
                        <div className="flex flex-wrap gap-1">
                          {collab.complementarySkills.map((s, i) => (
                            <span key={i} className="px-2 py-0.2 text-[10px] font-mono-tech rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Project alignment */}
                    {collab.projectAlignment && (
                      <div className="text-xs text-purple-300 bg-purple-950/30 p-2.5 rounded-lg border border-purple-500/20">
                        <strong className="block text-[10px] font-mono-tech text-purple-400 mb-0.5">ZADANIE DO OBJĘCIA:</strong>
                        {collab.projectAlignment}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    {collab.status === 'SUGGESTED' ? (
                      <>
                        <button
                          onClick={() => {
                            handleCollaborationDecision(collab.id, 'ACCEPTED');
                            playCyberSound('success');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-cyber font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Dołącz do Zespołu</span>
                        </button>
                        <button
                          onClick={() => {
                            handleCollaborationDecision(collab.id, 'POSTPONED');
                            playCyberSound('click');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-mono-tech transition-all cursor-pointer"
                        >
                          Odłóż
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-mono-tech text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>WSPÓŁPRACA ZAAKCEPTOWANA</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Pairwise Synergy Lab */}
      {activeTab === 'PAIR_LAB' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-cyan-500/30 space-y-4">
            <h3 className="font-cyber font-bold text-base text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              <span>INTERAKTYWNE LABORATORIUM SYNERGII DWÓCH ARCHITEKTÓW</span>
            </h3>
            <p className="text-xs text-slate-300 font-mono-tech">
              Wybierz dwóch dowolnych Architektów z ekosystemu. Bella uruchomi dedykowany model wnioskowania 6D i oceni ich kompatybilność, zbieżne cele, punkty tarcia oraz zaproponuje strukturę wspólnego projektu.
            </p>

            {/* Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-mono-tech text-slate-400 block mb-1">ARCHITEKT 1:</label>
                <select
                  value={labArch1Id}
                  onChange={(e) => setLabArch1Id(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono-tech text-white focus:outline-none focus:border-cyan-400"
                >
                  {architects.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} (@{a.handle}) - {a.specializations?.[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono-tech text-slate-400 block mb-1">ARCHITEKT 2:</label>
                <select
                  value={labArch2Id}
                  onChange={(e) => setLabArch2Id(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono-tech text-white focus:outline-none focus:border-cyan-400"
                >
                  {architects.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} (@{a.handle}) - {a.specializations?.[0]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleRunPairLab}
              disabled={isAnalyzingPair || labArch1Id === labArch2Id}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-cyber font-bold text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isAnalyzingPair ? 'animate-spin' : ''}`} />
              <span>{isAnalyzingPair ? 'URUCHAMIANIE MATRYCY 6D...' : 'ANALIZUJ SYNERGIĘ DUETU'}</span>
            </button>
          </div>

          {/* Results display */}
          {pairAnalysisResult && (
            <div className="p-6 rounded-2xl bg-[#080d1a] border border-purple-500/40 space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono-tech text-purple-400 block">WYNIK ANALIZY 6D:</span>
                  <h3 className="text-xl font-cyber font-bold text-white">
                    {getArchitect(labArch1Id).name} × {getArchitect(labArch2Id).name}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-mono-tech text-slate-400 block">OGÓLNA SYNERGIA</span>
                    <span className="text-2xl font-cyber font-bold text-cyan-400">
                      {pairAnalysisResult.overallScore || pairAnalysisResult.compatibilityScore || 95}%
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      createBrotherhoodNode(labArch2Id, pairAnalysisResult.recommendedProjectSpace);
                      setCurrentView('BROTHERHOOD');
                      playCyberSound('success');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-cyber font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    <Check className="w-4 h-4" />
                    <span>Aktywuj Węzeł Brotherhood</span>
                  </button>
                </div>
              </div>

              {/* 6D breakdown */}
              {pairAnalysisResult.dimensionScores && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {Object.entries(pairAnalysisResult.dimensionScores).map(([dim, score]) => (
                    <div key={dim} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] font-mono-tech text-slate-400 block uppercase">{dim}</span>
                      <strong className="text-lg font-cyber text-cyan-300">{Number(score)}%</strong>
                    </div>
                  ))}
                </div>
              )}

              {/* Strengths & Guidance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pairAnalysisResult.synergyStrengths && (
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <span className="text-xs font-cyber font-bold text-emerald-400 block">
                      MOCNE STRONY DUETU:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {pairAnalysisResult.synergyStrengths.map((str: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 mt-0.5">✓</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {pairAnalysisResult.potentialFrictionPoints && (
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <span className="text-xs font-cyber font-bold text-amber-400 block">
                      KALIBRACJA TEMPA I WSPÓŁPRACY:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {pairAnalysisResult.potentialFrictionPoints.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-400 mt-0.5">⚠</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bella guidance quote */}
              {pairAnalysisResult.bellaGuidance && (
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-start gap-3">
                  <Bot className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-cyber font-bold text-purple-300 block mb-0.5">
                      WSKAZÓWKA STATE BELLI:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      "{pairAnalysisResult.bellaGuidance}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
