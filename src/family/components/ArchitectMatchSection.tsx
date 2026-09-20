import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
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
  MessageSquare,
  RefreshCw,
  Info,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { ArchitectMatchSuggestion } from '../types';

export const ArchitectMatchSection: React.FC = () => {
  const {
    architectMatches,
    brotherhoodNodes,
    architects,
    currentArchitect,
    handleMatchDecision,
    runArchitectMatchmaking,
    isMatchingLoading,
    setActiveBrotherhoodNodeId,
    setCurrentView,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const [customGoal, setCustomGoal] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'SUGGESTED' | 'ACCEPTED' | 'POSTPONED'>('ALL');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  const filteredMatches = architectMatches.filter(m => {
    if (filter === 'ALL') return true;
    return m.status === filter;
  });

  const getArchitect = (id: string) => {
    return architects.find(a => a.id === id) || architects[1];
  };

  const handleRecalculate = (e: React.FormEvent) => {
    e.preventDefault();
    runArchitectMatchmaking(customGoal.trim() || undefined);
  };

  return (
    <div className="space-y-6">
      {/* HUD Matchmaker Control Center */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#0a0f1d] to-cyan-950/60 border border-purple-500/30 relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-mono-tech rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
                <Bot className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>STATE BELLA NEURAL SYNAPSE</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                PROBABILISTIC AI MATCHING
              </span>
            </div>

            <h2 className="font-cyber font-bold text-xl sm:text-2xl text-white tracking-wide flex items-center gap-2">
              <span>ARCHITECT MATCH ENGINE</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>

            <p className="text-xs text-slate-300 font-mono-tech max-w-2xl leading-relaxed">
              {language === 'PL'
                ? 'Bella analizuje Twój profil (specjalizacje, umiejętności, aktywne projekty i styl pracy), aby wytypować najbardziej komplementarnych Architektów do suwerennych węzłów Brotherhood.'
                : 'Bella analyzes your architect profile (skills, active projects, vision, work style) to discover top complementary partners for sovereign Brotherhood nodes.'}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#090d16]/80 border border-purple-500/20 backdrop-blur-md">
            <div className="text-center px-2">
              <span className="text-xs font-mono-tech text-slate-400 block">PROFILES SCANNED</span>
              <span className="text-lg font-cyber font-bold text-cyan-400">{architects.length}</span>
            </div>
            <div className="w-[1px] h-8 bg-purple-500/20" />
            <div className="text-center px-2">
              <span className="text-xs font-mono-tech text-slate-400 block">TOP MATCHES</span>
              <span className="text-lg font-cyber font-bold text-purple-400">{architectMatches.length}</span>
            </div>
          </div>
        </div>

        {/* AI Disclaimer Axiom Bar */}
        <div className="mt-5 pt-4 border-t border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono-tech text-[11px]">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong className="text-cyan-300">Zasada Belli:</strong> &quot;Bella sugeruje. Ludzie decydują.&quot; Rekomendacje mają charakter wsparcia kognitywnego.
            </span>
          </div>

          <button
            onClick={() => runArchitectMatchmaking()}
            disabled={isMatchingLoading}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-mono-tech transition-all shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isMatchingLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isMatchingLoading ? 'Przetwarzanie synaps...' : 'Przelicz dopasowania AI'}</span>
          </button>
        </div>

        {/* Custom Query Search Form */}
        <form onSubmit={handleRecalculate} className="mt-4 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
            <input
              type="text"
              value={customGoal}
              onChange={e => setCustomGoal(e.target.value)}
              placeholder={language === 'PL' ? 'Np.: Szukam eksperta Web3 i Rust do modułu Nexus Security...' : 'E.g., Looking for a Web3 & Rust engineer for Nexus Security...'}
              className="w-full bg-[#070b13] border border-purple-500/30 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isMatchingLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'PL' ? 'Dopasuj pod ten cel' : 'Find Target Synergy'}</span>
          </button>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2">
        <div className="flex items-center gap-2">
          {(['ALL', 'SUGGESTED', 'ACCEPTED', 'POSTPONED'] as const).map(tab => (
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
              {tab === 'ALL' && (language === 'PL' ? 'Wszystkie propozycje' : 'All Proposals')}
              {tab === 'SUGGESTED' && (language === 'PL' ? 'Oczekujące' : 'Pending AI Match')}
              {tab === 'ACCEPTED' && (language === 'PL' ? 'Zaakceptowane' : 'Accepted Nodes')}
              {tab === 'POSTPONED' && (language === 'PL' ? 'Odłożone' : 'Postponed')}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono-tech text-slate-400">
          {filteredMatches.length} {language === 'PL' ? 'Rekomendacji' : 'Suggestions'}
        </span>
      </div>

      {/* Matches Grid */}
      <div className="space-y-4">
        {filteredMatches.map(match => {
          const architect = getArchitect(match.architectId);
          const isExpanded = expandedMatchId === match.id;

          return (
            <div
              key={match.id}
              className={`p-6 rounded-2xl bg-[#090d16] border transition-all space-y-5 shadow-xl relative overflow-hidden ${
                match.status === 'ACCEPTED'
                  ? 'border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.1)]'
                  : match.status === 'DECLINED'
                  ? 'border-slate-800 opacity-60'
                  : 'border-purple-500/30 hover:border-cyan-400/50'
              }`}
            >
              {/* Score Glow Ribbon */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent pointer-events-none" />

              {/* Match Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={architect.avatar}
                      alt={architect.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 border-2 border-[#090d16]" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-cyber font-bold text-lg text-white">{architect.name}</h3>
                      <span className="text-xs font-mono-tech text-cyan-400">@{architect.handle}</span>
                      <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {architect.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans line-clamp-1">{architect.bio}</p>
                    <div className="flex items-center gap-2 text-[11px] font-mono-tech text-slate-400">
                      <span className="text-purple-300">{architect.aiProfile.archetype}</span>
                      <span>•</span>
                      <span>{architect.specializations.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Compatibility Metric HUD */}
                <div className="flex items-center gap-4 self-end md:self-auto">
                  <div className="text-right">
                    <span className="text-[10px] font-mono-tech text-slate-400 block">SYNERGY SCORE</span>
                    <div className="flex items-center gap-1.5 justify-end">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <span className="font-cyber font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                        {match.compatibilityScore}%
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 text-[10px] font-mono-tech font-bold rounded-lg border ${
                      match.status === 'ACCEPTED'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : match.status === 'DECLINED'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : match.status === 'POSTPONED'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse'
                    }`}
                  >
                    ● {match.status}
                  </span>
                </div>
              </div>

              {/* Brief Executive Rationale */}
              <div className="p-3.5 rounded-xl bg-[#0d131f] border border-cyan-500/15 flex items-start gap-3">
                <Bot className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] font-mono-tech text-cyan-400 font-bold tracking-wider uppercase">
                    Bella Executive Rationale
                  </span>
                  <p className="text-xs text-slate-200 font-sans leading-relaxed">
                    {match.briefRationale}
                  </p>
                </div>
              </div>

              {/* 6-Dimension Score Breakdown HUD */}
              {match.dimensionScores && (
                <div className="p-4 rounded-xl bg-[#070b13] border border-purple-500/20 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono-tech">
                    <span className="text-purple-300 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>PROFIL ANALIZY 6-WYMIAROWEJ (BROTHERHOOD ENGINE)</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Komplementarność wielowektorowa</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {[
                      { label: 'Kompetencje', score: match.dimensionScores.competencies, color: 'from-purple-500 to-indigo-500' },
                      { label: 'Projekty & Światy', score: match.dimensionScores.projects, color: 'from-cyan-500 to-blue-500' },
                      { label: 'Zainteresowania', score: match.dimensionScores.interests, color: 'from-amber-500 to-orange-500' },
                      { label: 'Cele Strategiczne', score: match.dimensionScores.goals, color: 'from-emerald-500 to-teal-500' },
                      { label: 'Styl Pracy', score: match.dimensionScores.workStyle, color: 'from-pink-500 to-rose-500' },
                      { label: 'Doświadczenie', score: match.dimensionScores.experience, color: 'from-violet-500 to-purple-500' },
                    ].map(dim => (
                      <div key={dim.label} className="p-2 rounded-lg bg-[#0b101c] border border-slate-800 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400 mb-1">
                          <span className="truncate">{dim.label}</span>
                          <span className="text-white font-bold">{dim.score}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${dim.color}`}
                            style={{ width: `${dim.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6-Dimensional Justification Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {/* 1. Competency */}
                <div className="p-3 rounded-xl bg-[#070b13] border border-purple-500/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-purple-300 font-bold">
                    <Code2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>KOMPLEMENTARNOŚĆ KOMPETENCJI</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {match.dimensions.competencyMatch}
                  </p>
                </div>

                {/* 2. Project Synergy */}
                <div className="p-3 rounded-xl bg-[#070b13] border border-cyan-500/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-cyan-300 font-bold">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SYNERGIA PROJEKTOWA & ŚWIATY</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {match.dimensions.projectSynergy}
                  </p>
                </div>

                {/* 3. Interest Alignment */}
                <div className="p-3 rounded-xl bg-[#070b13] border border-amber-500/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-amber-300 font-bold">
                    <Brain className="w-3.5 h-3.5 text-amber-400" />
                    <span>WSPÓLNA WIZJA & ZAINTERESOWANIA</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {match.dimensions.interestAlignment}
                  </p>
                </div>

                {/* 4. Strategic Goals */}
                <div className="p-3 rounded-xl bg-[#070b13] border border-emerald-500/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-emerald-300 font-bold">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ZBIEŻNOŚĆ CELÓW STRATEGICZNYCH</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {match.dimensions.goalAlignment || match.dimensions.goalsSynergy || 'Zbieżność celów w zakresie suwerenności technologii i rozwoju infrastruktury Nexus.'}
                  </p>
                </div>

                {/* 5. Work Style */}
                <div className="p-3 rounded-xl bg-[#070b13] border border-pink-500/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-pink-300 font-bold">
                    <Zap className="w-3.5 h-3.5 text-pink-400" />
                    <span>DOPASOWANIE STYLU PRACY</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {match.dimensions.workStyleComplementarity}
                  </p>
                </div>

                {/* 6. Experience & Seniority */}
                <div className="p-3 rounded-xl bg-[#070b13] border border-violet-500/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-violet-300 font-bold">
                    <Shield className="w-3.5 h-3.5 text-violet-400" />
                    <span>DOŚWIADCZENIE & RANGA</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {match.dimensions.experienceSynergy || match.dimensions.experienceBalance || 'Harmonijny transfer wiedzy i komplementarność poziomów zaawansowania.'}
                  </p>
                </div>
              </div>

              {/* Pair Project Proposal Blueprint */}
              {match.pairProjectProposal && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-[#0d131f] to-cyan-950/30 border border-cyan-500/30 space-y-2 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-cyan-500/15 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                        PROPOZYCJA WSPÓLNEGO PROJEKTU BROTHERHOOD
                      </span>
                      {match.pairProjectProposal.worldSlug && (
                        <span className="text-[10px] font-mono-tech text-slate-400">
                          Świat: <strong className="text-purple-300">{match.pairProjectProposal.worldSlug}</strong>
                        </span>
                      )}
                    </div>
                    {match.pairProjectProposal.estimatedTimeline && (
                      <span className="text-[10px] font-mono-tech text-amber-400">
                        {match.pairProjectProposal.estimatedTimeline}
                      </span>
                    )}
                  </div>

                  <h4 className="font-cyber font-bold text-sm text-white">
                    {match.pairProjectProposal.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {match.pairProjectProposal.description}
                  </p>

                  {(match.pairProjectProposal.targetDeliverable || match.pairProjectProposal.deliverables) && (
                    <div className="pt-1 flex items-center gap-2 text-[11px] font-mono-tech text-slate-400 flex-wrap">
                      <span className="text-cyan-400 font-bold">Cel wdrożeniowy:</span>
                      <span className="text-slate-200">
                        {match.pairProjectProposal.targetDeliverable || match.pairProjectProposal.deliverables?.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Roles & First Action Pill */}
              <div className="p-3 rounded-xl bg-[#0b101c] border border-cyan-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono-tech">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-400 text-[11px]">SUGEROWANE ROLE:</span>
                  {match.suggestedRoles.map(role => (
                    <span key={role} className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px]">
                      {role}
                    </span>
                  ))}
                </div>

                <div className="text-slate-300 text-[11px] flex items-center gap-1.5">
                  <span className="text-cyan-400 font-bold">REKOMENDOWANY PIERWSZY KROK:</span>
                  <span className="text-slate-200">{match.suggestedFirstAction}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-cyan-500/10 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  {match.status !== 'ACCEPTED' && (
                    <>
                      <button
                        onClick={() => handleMatchDecision(match.id, 'DECLINED')}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-700 text-slate-400 hover:text-rose-300 hover:border-rose-500/40 text-xs font-mono-tech transition-colors flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{language === 'PL' ? 'Odrzuć' : 'Decline'}</span>
                      </button>

                      <button
                        onClick={() => handleMatchDecision(match.id, 'POSTPONED')}
                        className="px-3.5 py-1.5 rounded-xl border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 text-xs font-mono-tech transition-colors flex items-center gap-1.5"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{language === 'PL' ? 'Odłóż na później' : 'Postpone'}</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {match.status === 'ACCEPTED' ? (
                    <button
                      onClick={() => {
                        const existingNode = brotherhoodNodes.find(
                          n => (n.architect1Id === currentArchitect.id && n.architect2Id === match.architectId) ||
                               (n.architect2Id === currentArchitect.id && n.architect1Id === match.architectId)
                        );
                        if (existingNode) {
                          setActiveBrotherhoodNodeId(existingNode.id);
                        }
                        setCurrentView('BROTHERHOOD');
                        playCyberSound('synapse');
                        triggerHaptic();
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400 text-emerald-200 text-xs font-cyber font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    >
                      <Check className="w-4 h-4" />
                      <span>{language === 'PL' ? 'Przejdź do Workspace Brotherhood' : 'Open Brotherhood Workspace'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMatchDecision(match.id, 'ACCEPTED')}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_20px_rgba(168,85,247,0.35)] flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>{language === 'PL' ? 'Zaakceptuj & Aktywuj Węzeł' : 'Accept & Activate Node'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
