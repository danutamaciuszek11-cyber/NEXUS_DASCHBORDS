import React, { useState, useEffect } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Activity,
  Sparkles,
  Bot,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  Layers,
  ArrowRight,
  RefreshCw,
  FolderGit2,
  Gauge,
  SlidersHorizontal,
  Plus,
  ExternalLink,
  ShieldAlert,
  Clock,
  Compass,
  FileCode2
} from 'lucide-react';
import { ProjectActivityAudit, BellaOrchestratorRecommendation } from '../types';

export const BellaProjectActivityInsights: React.FC = () => {
  const {
    projects,
    architects,
    worlds,
    currentArchitect,
    projectHealthReport,
    isAnalyzingProjectActivity,
    analyzeProjectActivity,
    suggestCollaborationsForProject,
    setActiveProjectId,
    setCurrentView,
    createBrotherhoodNode,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const [selectedWorld, setSelectedWorld] = useState<string>('ALL');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PROJECTS' | 'SYNERGIES' | 'ACTIONS'>('OVERVIEW');

  // Trigger initial analysis if not yet run
  useEffect(() => {
    if (!projectHealthReport && !isAnalyzingProjectActivity && projects.length > 0) {
      analyzeProjectActivity(selectedWorld === 'ALL' ? undefined : selectedWorld);
    }
  }, []);

  const handleRefreshAudit = () => {
    analyzeProjectActivity(selectedWorld === 'ALL' ? undefined : selectedWorld);
  };

  const handleWorldFilterChange = (worldSlug: string) => {
    setSelectedWorld(worldSlug);
    analyzeProjectActivity(worldSlug === 'ALL' ? undefined : worldSlug);
  };

  const getArchitect = (id: string) => {
    return architects.find(a => a.id === id) || architects[0];
  };

  const filteredProjects = selectedWorld === 'ALL'
    ? projects
    : projects.filter(p => p.worldSlug === selectedWorld);

  const audits = projectHealthReport?.projectAudits || [];

  return (
    <div className="space-y-6">
      {/* Top Intelligence HUD Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-[#0a0f1d] to-purple-950/50 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-mono-tech rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>STATE BELLA PROJECT INTELLIGENCE</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                ACTIVITY & SYNERGY RADAR
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>AUTONOMOUS GAP DETECTION</span>
              </span>
            </div>

            <h2 className="font-cyber font-bold text-xl sm:text-2xl text-white tracking-wide flex items-center gap-3">
              <span>PROJECT ACTIVITY & INSIGHTS ENGINE</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>

            <p className="text-xs text-slate-300 font-mono-tech max-w-2xl leading-relaxed">
              {language === 'PL'
                ? 'Bella analizuje postępy zadań, rytm commitów, zapotrzebowanie na umiejętności oraz wąskie gardła we wszystkich projektach ekosystemu Nexus, rekomendując komplementarnych współpracowników i optymalizacje.'
                : 'Bella evaluates task throughput, cadence, skill deficits, and bottlenecks across Nexus projects, recommending complementary architect collaborators and strategic optimizations.'}
            </p>
          </div>

          {/* Action Trigger */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefreshAudit}
              disabled={isAnalyzingProjectActivity}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-cyber font-bold text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzingProjectActivity ? 'animate-spin' : ''}`} />
              <span>{isAnalyzingProjectActivity ? 'ANALIZOWANIE...' : 'GŁĘBOKI AUDYT AI'}</span>
            </button>
          </div>
        </div>

        {/* Global Ecosystem Pulse KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-[#080d1a]/80 border border-cyan-500/20">
            <span className="text-[10px] font-mono-tech text-slate-400 block mb-1 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-cyan-400" />
              <span>ECOSYSTEM HEALTH</span>
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-cyber font-bold text-cyan-300">
                {projectHealthReport?.ecosystemHealthScore || 91}%
              </span>
              <span className="text-[10px] font-mono-tech text-emerald-400 font-bold">OPTIMAL</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#080d1a]/80 border border-purple-500/20">
            <span className="text-[10px] font-mono-tech text-slate-400 block mb-1 flex items-center gap-1">
              <FolderGit2 className="w-3 h-3 text-purple-400" />
              <span>ACTIVE PROJECTS</span>
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-cyber font-bold text-purple-300">
                {projectHealthReport?.activeProjectsCount || projects.length}
              </span>
              <span className="text-[10px] font-mono-tech text-slate-400">NODES</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#080d1a]/80 border border-emerald-500/20">
            <span className="text-[10px] font-mono-tech text-slate-400 block mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>COMPLETED TASKS</span>
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-cyber font-bold text-emerald-300">
                {projectHealthReport?.totalCompletedTasks || 18}
              </span>
              <span className="text-[10px] font-mono-tech text-slate-400">EPOCH 3</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#080d1a]/80 border border-amber-500/20">
            <span className="text-[10px] font-mono-tech text-slate-400 block mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-amber-400" />
              <span>ACTIVITY VELOCITY</span>
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-cyber font-bold text-amber-300">
                {projectHealthReport?.activityVelocity || 'ACCELERATING'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bella Executive Summary Notice */}
      {projectHealthReport?.executiveSummary && (
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-start gap-3">
          <Bot className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-cyber font-bold text-purple-200">
                SYNTEZA ORKIESTRATORA BELLA
              </span>
              <span className="text-[10px] font-mono-tech text-slate-400">
                {projectHealthReport.analyzedAt ? new Date(projectHealthReport.analyzedAt).toLocaleTimeString() : 'Przed chwilą'}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {projectHealthReport.executiveSummary}
            </p>
          </div>
        </div>
      )}

      {/* World Filter & Sub-Nav Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        {/* World Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono-tech text-slate-400 mr-1 flex items-center gap-1">
            <Compass className="w-3 h-3" /> ŚWIAT:
          </span>
          <button
            onClick={() => handleWorldFilterChange('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-mono-tech transition-all ${
              selectedWorld === 'ALL'
                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            WSZYSTKIE ({projects.length})
          </button>
          {worlds.map(w => (
            <button
              key={w.slug}
              onClick={() => handleWorldFilterChange(w.slug)}
              className={`px-3 py-1 rounded-lg text-xs font-mono-tech transition-all ${
                selectedWorld === w.slug
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {w.name}
            </button>
          ))}
        </div>

        {/* View mode buttons */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3 py-1 text-xs font-cyber rounded-lg transition-all ${
              activeTab === 'OVERVIEW'
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AUDYTY PROJEKTÓW
          </button>
          <button
            onClick={() => setActiveTab('SYNERGIES')}
            className={`px-3 py-1 text-xs font-cyber rounded-lg transition-all ${
              activeTab === 'SYNERGIES'
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SYNERGIE MIĘDZYPROJEKTOWE ({projectHealthReport?.crossProjectSynergies?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('ACTIONS')}
            className={`px-3 py-1 text-xs font-cyber rounded-lg transition-all ${
              activeTab === 'ACTIONS'
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            DZIAŁANIA PRIORYTETOWE ({projectHealthReport?.priorityActionItems?.length || 0})
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {audits.length > 0 ? (
            audits.map((audit) => {
              const project = projects.find(p => p.id === audit.projectId);
              const isStalled = audit.activityStatus === 'STALLED';
              const needsAttention = audit.activityStatus === 'NEEDS_ATTENTION';

              return (
                <div
                  key={audit.projectId}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isStalled
                      ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400'
                      : needsAttention
                      ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                      : 'bg-[#0a0f1d] border-cyan-500/20 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Project Title & Status Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 uppercase">
                            {audit.worldSlug}
                          </span>
                          <span className={`px-2 py-0.5 text-[9px] font-mono-tech rounded border uppercase ${
                            audit.activityStatus === 'OPTIMAL'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : audit.activityStatus === 'ACCELERATING'
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                              : audit.activityStatus === 'NEEDS_ATTENTION'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}>
                            {audit.activityStatus}
                          </span>
                        </div>
                        <h3 className="font-cyber font-bold text-base text-white">
                          {audit.title}
                        </h3>
                      </div>

                      {/* Health Score Pill */}
                      <div className="text-right">
                        <span className="text-[10px] font-mono-tech text-slate-400 block">HEALTH SCORE</span>
                        <span className={`text-lg font-cyber font-bold ${
                          audit.healthScore > 85 ? 'text-emerald-400' : audit.healthScore > 70 ? 'text-cyan-400' : 'text-amber-400'
                        }`}>
                          {audit.healthScore}%
                        </span>
                      </div>
                    </div>

                    {/* Completion Bar & Tasks Summary */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400">
                        <span>Postęp Epoki (Zadania)</span>
                        <span className="text-cyan-300 font-bold">{audit.completionPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${audit.completionPercentage}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-mono-tech text-slate-400 pt-1">
                        <span>Ukończone: <strong className="text-emerald-400">{audit.tasksSummary?.done || 0}</strong></span>
                        <span>W trakcie: <strong className="text-cyan-400">{audit.tasksSummary?.inProgress || 0}</strong></span>
                        <span>Do podjęcia: <strong className="text-amber-400">{audit.tasksSummary?.todo || 0}</strong></span>
                      </div>
                    </div>

                    {/* Detected Skill Gaps (Bella AI Diagnosis) */}
                    {audit.detectedSkillGaps && audit.detectedSkillGaps.length > 0 && (
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <span className="text-[10px] font-mono-tech text-amber-400 flex items-center gap-1 font-bold">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          <span>ZIDENTYFIKOWANE LUKI KOMPETENCYJNE:</span>
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {audit.detectedSkillGaps.map((gap, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-amber-500/10 text-amber-300 border border-amber-500/30"
                            >
                              + {gap}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Collaborators by Bella */}
                    {audit.suggestedCollaborators && audit.suggestedCollaborators.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono-tech text-purple-300 flex items-center gap-1.5 font-bold">
                            <Bot className="w-3.5 h-3.5 text-cyan-400" />
                            <span>REKOMENDOWANY ARCHITEKT DO WSPÓŁPRACY:</span>
                          </span>
                        </div>

                        {audit.suggestedCollaborators.map((sug, idx) => {
                          const cand = getArchitect(sug.architectId);
                          return (
                            <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#080d1a] p-2.5 rounded-lg border border-purple-500/20">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={cand.avatar}
                                  alt={cand.name}
                                  className="w-8 h-8 rounded-lg object-cover border border-purple-400/40"
                                />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-cyber font-bold text-white">{cand.name}</span>
                                    <span className="text-[10px] font-mono-tech text-slate-400">@{cand.handle}</span>
                                    <span className="text-[10px] font-mono-tech px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                                      {sug.matchScore}% FIT
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">
                                    {sug.fitReason}
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  suggestCollaborationsForProject(audit.projectId);
                                  playCyberSound('synapse');
                                  triggerHaptic();
                                }}
                                className="px-2.5 py-1 text-[10px] font-cyber font-bold rounded bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/40 transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                              >
                                <span>Zaproponuj Duet</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Bottleneck Warning */}
                    {audit.bottleneckNotice && (
                      <div className="flex items-center gap-2 text-[11px] font-mono-tech text-rose-300 bg-rose-500/10 px-3 py-2 rounded-lg border border-rose-500/30">
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{audit.bottleneckNotice}</span>
                      </div>
                    )}

                    {/* Bella Recommendations */}
                    {audit.bellaRecommendations && audit.bellaRecommendations.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-wider block">
                          Zalecenia Belli:
                        </span>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {audit.bellaRecommendations.map((rec, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-1.5">
                              <span className="text-cyan-400 mt-0.5">▪</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        setActiveProjectId(audit.projectId);
                        playCyberSound('click');
                      }}
                      className="text-xs font-cyber text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Szczegóły Projektu</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => {
                        suggestCollaborationsForProject(audit.projectId);
                        playCyberSound('click');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono-tech text-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      <span>Skan Współpracowników</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800">
              <Bot className="w-12 h-12 text-cyan-400 mx-auto mb-3 animate-pulse" />
              <h3 className="font-cyber font-bold text-white text-base">Inicjalizacja Węzła Analizy Belli</h3>
              <p className="text-xs text-slate-400 font-mono-tech max-w-md mx-auto mt-1 mb-4">
                Kliknij przycisk poniżej, aby uruchomić pierwszy pełny skan projektów i wykryć luki kompetencyjne.
              </p>
              <button
                onClick={handleRefreshAudit}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-cyber font-bold text-xs cursor-pointer"
              >
                Rozpocznij Audyt Projektów
              </button>
            </div>
          )}
        </div>
      )}

      {/* Synergies Tab */}
      {activeTab === 'SYNERGIES' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-slate-300">
            State Bella wykryła potencjał unifikacji modularnych struktur danych i wzajemnej wymiany zasobów między następującymi projektami:
          </div>

          {projectHealthReport?.crossProjectSynergies && projectHealthReport.crossProjectSynergies.length > 0 ? (
            projectHealthReport.crossProjectSynergies.map((syn, idx) => {
              const projA = projects.find(p => p.id === syn.projectAId);
              const projB = projects.find(p => p.id === syn.projectBId);

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#0a0f1d] border border-purple-500/30 hover:border-purple-500/60 transition-all space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      CROSS-PROJECT SYNERGY
                    </span>
                    <h3 className="font-cyber font-bold text-base text-white">
                      {syn.synergyTitle}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div>
                      <span className="text-[10px] font-mono-tech text-slate-400 block mb-1">PROJEKT A:</span>
                      <strong className="text-sm font-cyber text-cyan-300">{projA?.title || 'Projekt A'}</strong>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{projA?.description}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-tech text-slate-400 block mb-1">PROJEKT B:</span>
                      <strong className="text-sm font-cyber text-purple-300">{projB?.title || 'Projekt B'}</strong>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{projB?.description}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono-tech text-cyan-400 font-bold block">
                      SZANSA TECHNOLOGICZNA:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {syn.opportunity}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs text-purple-300">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{syn.recommendedAction}</span>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentView('BROTHERHOOD');
                        playCyberSound('click');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-cyber font-bold transition-all cursor-pointer shrink-0"
                    >
                      Otwórz Węzeł Brotherhood
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800">
              <Compass className="w-10 h-10 text-purple-400 mx-auto mb-2 opacity-60" />
              <p className="text-xs text-slate-400 font-mono-tech">
                Brak zarejestrowanych konfliktów. Uruchom głęboki audyt, aby przeskanować powiązania semantyczne.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Priority Action Items Tab */}
      {activeTab === 'ACTIONS' && (
        <div className="space-y-3">
          {projectHealthReport?.priorityActionItems && projectHealthReport.priorityActionItems.length > 0 ? (
            projectHealthReport.priorityActionItems.map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-xl bg-[#0a0f1d] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    act.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' :
                    act.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.2 text-[9px] font-mono-tech rounded uppercase ${
                        act.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                        act.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                        'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                      }`}>
                        {act.severity}
                      </span>
                      <span className="text-[10px] font-mono-tech text-slate-400 uppercase">
                        TYP: {act.actionType}
                      </span>
                    </div>
                    <h4 className="font-cyber font-bold text-sm text-white mt-1">
                      {act.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {act.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {act.actionType === 'COLLABORATE' && (
                    <button
                      onClick={() => {
                        if (act.targetProjectId) {
                          suggestCollaborationsForProject(act.targetProjectId);
                        }
                        playCyberSound('click');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-cyber font-bold text-xs cursor-pointer flex items-center gap-1"
                    >
                      <span>Skanuj Partnerów</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  {act.actionType === 'MISSION' && (
                    <button
                      onClick={() => {
                        setCurrentView('MISSIONS');
                        playCyberSound('click');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-cyber font-bold text-xs cursor-pointer flex items-center gap-1"
                    >
                      <span>Otwórz Tablicę Misji</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-60" />
              <p className="text-xs text-slate-400 font-mono-tech">
                Wszystkie projekty operują w zrównoważonym tempie bez krytycznych alertów.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
