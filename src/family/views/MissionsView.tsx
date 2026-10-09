import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Target,
  Plus,
  Search,
  Filter,
  Award,
  Clock,
  CheckCircle2,
  Zap,
  Shield,
  ArrowRight,
  Sparkles,
  Bot,
  UserCheck,
  Calendar,
  Code2,
  Users,
  Flame
} from 'lucide-react';
import { MissionDifficulty } from '../types';

export const MissionsView: React.FC<{ onOpenNewMissionModal?: () => void }> = ({
  onOpenNewMissionModal = () => {}
}) => {
  const {
    missions,
    worlds,
    architects,
    currentArchitect,
    applyForMission,
    setActiveMissionId,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'ALL' | 'BELLA_MATCHED' | 'MY_ENLISTED' | 'CREATED_BY_ME'>('ALL');

  const filteredMissions = missions.filter(m => {
    const matchesSearch =
      (m.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.requiredSkills || []).some(s => (s || '').toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDiff = selectedDifficulty === 'ALL' || m.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === 'ALL' || m.status === selectedStatus;

    let matchesTab = true;
    if (activeTab === 'BELLA_MATCHED') {
      matchesTab = (m.recommendedArchitectIds || []).includes(currentArchitect.id);
    } else if (activeTab === 'MY_ENLISTED') {
      matchesTab = (m.applicants || []).includes(currentArchitect.id) || m.claimedById === currentArchitect.id;
    } else if (activeTab === 'CREATED_BY_ME') {
      matchesTab = m.createdBy === currentArchitect.id;
    }

    return matchesSearch && matchesDiff && matchesStatus && matchesTab;
  });

  const difficulties: MissionDifficulty[] = ['INITIATE', 'ADEPT', 'ARCHITECT', 'MASTERMIND'];

  const getDifficultyColor = (diff: MissionDifficulty) => {
    switch (diff) {
      case 'INITIATE':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
      case 'ADEPT':
        return 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40';
      case 'ARCHITECT':
        return 'bg-purple-950/60 text-purple-300 border-purple-500/40';
      case 'MASTERMIND':
        return 'bg-amber-950/60 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  const bellaRecommendedForUserCount = missions.filter(m =>
    (m.recommendedArchitectIds || []).includes(currentArchitect.id)
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header HUD */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-[#0a0f1d] to-purple-950/40 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            <Target className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-cyber font-bold text-xl sm:text-2xl text-white tracking-wide">
                NEXUS MISSION BOARD
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" />
                ACTIVE BOUNTIES
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono-tech mt-0.5">
              {language === 'PL'
                ? 'Podejmuj zadania taktyczne, buduj moduły i zdobywaj punkty wkładu z analizą Belli AI'
                : 'Claim tactical missions, architect modules, and build contribution points guided by Bella AI'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (typeof onOpenNewMissionModal === 'function') {
                onOpenNewMissionModal();
              }
              playCyberSound('beep');
              triggerHaptic();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'PL' ? 'Dodaj Nową Misję' : 'Post New Mission'}</span>
          </button>
        </div>
      </div>

      {/* Bella AI Matchmaker Feature Ribbon */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#0b0f1a] to-cyan-950/50 border border-purple-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-900/60 border border-purple-400 text-purple-300 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cyber font-bold text-xs text-purple-200 uppercase tracking-wider">
                STATE BELLA NEURAL MATCHMAKER
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono-tech rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans">
              {language === 'PL'
                ? `Bella wyselekcjonowała ${bellaRecommendedForUserCount} misji dopasowanych do Twojej specjalizacji (${currentArchitect.specializations?.[0] || 'Inżynieria'}).`
                : `Bella identified ${bellaRecommendedForUserCount} active missions tailored for your profile (${currentArchitect.specializations?.[0] || 'Engineering'}).`}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveTab('BELLA_MATCHED');
            playCyberSound('synapse');
            triggerHaptic();
          }}
          className="px-3.5 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/70 border border-purple-400 text-purple-200 text-xs font-mono-tech transition-all shrink-0 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{language === 'PL' ? 'Pokaż Sugestie Belli' : 'View Bella Matches'} ({bellaRecommendedForUserCount})</span>
        </button>
      </div>

      {/* Navigation Tabs & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyan-500/10">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => {
                setActiveTab('ALL');
                playCyberSound('click');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-tech transition-all border ${
                activeTab === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'bg-[#0d131f] text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {language === 'PL' ? 'Wszystkie Misje' : 'All Missions'} ({missions.length})
            </button>

            <button
              onClick={() => {
                setActiveTab('BELLA_MATCHED');
                playCyberSound('synapse');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-tech transition-all border flex items-center gap-1.5 ${
                activeTab === 'BELLA_MATCHED'
                  ? 'bg-purple-900/50 text-purple-200 border-purple-400 font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-[#0d131f] text-slate-400 border-slate-800 hover:text-purple-300'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'PL' ? 'Rekomendowane Przez Bellę' : 'Bella Suggested'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-purple-500/30 text-[10px] text-purple-200">
                {bellaRecommendedForUserCount}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('MY_ENLISTED');
                playCyberSound('click');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-tech transition-all border ${
                activeTab === 'MY_ENLISTED'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-[#0d131f] text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {language === 'PL' ? 'Moje Zgłoszenia' : 'My Enlisted'}
            </button>

            <button
              onClick={() => {
                setActiveTab('CREATED_BY_ME');
                playCyberSound('click');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-tech transition-all border ${
                activeTab === 'CREATED_BY_ME'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-[#0d131f] text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {language === 'PL' ? 'Utworzone Przeze Mnie' : 'Posted By Me'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="bg-[#0d131f] border border-cyan-500/20 text-xs font-mono-tech text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="ALL">{language === 'PL' ? 'Trudność: Wszystkie' : 'Difficulty: All'}</option>
              {difficulties.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-[#0d131f] border border-cyan-500/20 text-xs font-mono-tech text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="ALL">{language === 'PL' ? 'Status: Wszystkie' : 'Status: All'}</option>
              <option value="OPEN">OPEN (Otwarte)</option>
              <option value="IN_PROGRESS">IN_PROGRESS (W realizacji)</option>
              <option value="COMPLETED">COMPLETED (Ukończone)</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              language === 'PL'
                ? 'Szukaj misji (tytuł, wymagane umiejętności, specyfikacja)...'
                : 'Search missions by title, required skills, or specifications...'
            }
            className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-sans"
          />
        </div>
      </div>

      {/* Missions Grid */}
      {filteredMissions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#090d16] border border-cyan-500/10 space-y-3">
          <Target className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-cyber font-bold text-sm text-slate-400">
            {language === 'PL' ? 'Brak misji spełniających kryteria' : 'No missions found matching filters'}
          </h3>
          <p className="text-xs font-mono-tech text-slate-500 max-w-md mx-auto">
            {language === 'PL'
              ? 'Zmień wybrane filtry lub opublikuj nową misję dla Architektów sieci.'
              : 'Try clearing your search query or post a new mission to enlist Nexus architects.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map(mis => {
            const world = worlds.find(w => w.slug === mis.worldSlug);
            const creator = architects.find(a => a.id === mis.createdBy);
            const isApplicant = (mis.applicants || []).includes(currentArchitect.id);
            const isClaimedByMe = mis.claimedById === currentArchitect.id;
            const isBellaRecommended = (mis.recommendedArchitectIds || []).includes(currentArchitect.id);
            const recommendedArchitects = architects.filter(a => (mis.recommendedArchitectIds || []).includes(a.id));

            return (
              <div
                key={mis.id}
                onClick={() => {
                  setActiveMissionId(mis.id);
                  playCyberSound('click');
                  triggerHaptic();
                }}
                className={`p-5 rounded-2xl bg-[#090d16] border transition-all cursor-pointer flex flex-col justify-between space-y-4 group shadow-lg ${
                  isBellaRecommended
                    ? 'border-purple-500/40 hover:border-purple-400 bg-gradient-to-b from-[#0e0c1a] to-[#090d16]'
                    : 'border-emerald-500/20 hover:border-emerald-400/50 hover:bg-emerald-950/10'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Title & Difficulty */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-cyber font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {mis.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] font-mono-tech text-emerald-400/90 mt-0.5">
                        <span>World: {world?.name || mis.worldSlug}</span>
                        <span>•</span>
                        <span className="text-slate-400">Deadline: {mis.deadline}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-mono-tech rounded border shrink-0 ${getDifficultyColor(mis.difficulty)}`}>
                      {mis.difficulty}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed">
                    {mis.description}
                  </p>

                  {/* Specializations & Skills tags */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex flex-wrap gap-1">
                      {mis.requiredSpecializations?.map(spec => (
                        <span
                          key={spec}
                          className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-purple-950/50 border border-purple-500/30 text-purple-300"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {mis.requiredSkills.slice(0, 3).map(sk => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-[#0d131f] border border-cyan-500/20 text-slate-300"
                        >
                          {sk}
                        </span>
                      ))}
                      {mis.requiredSkills.length > 3 && (
                        <span className="text-[10px] font-mono-tech text-slate-500">
                          +{mis.requiredSkills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bella AI Neural Recommendation Badge */}
                  {recommendedArchitects.length > 0 && (
                    <div className="p-2 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-center justify-between text-[10px] font-mono-tech text-purple-300">
                      <div className="flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">
                          Bella Match: {recommendedArchitects.map(a => a.name.split(' ')[0]).join(', ')}
                        </span>
                      </div>
                      <span className="text-cyan-400 font-bold shrink-0">94% Fit</span>
                    </div>
                  )}
                </div>

                {/* Bottom Meta & Action */}
                <div className="pt-3 border-t border-cyan-500/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-tech">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Award className="w-3.5 h-3.5" />
                      <span>+{mis.rewardScore} pts</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">
                        {mis.applicants.length} {language === 'PL' ? 'chętnych' : 'enlisted'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </div>

                  {/* Enlistment Status Ribbon */}
                  <div className="flex items-center justify-between text-[10px] font-mono-tech pt-1">
                    <span className="text-slate-400 truncate">
                      Lead: {creator?.name || 'Nexus Core'}
                    </span>

                    {isClaimedByMe ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                        ASSIGNED TO YOU
                      </span>
                    ) : isApplicant ? (
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        ✓ ENLISTED
                      </span>
                    ) : mis.status === 'OPEN' ? (
                      <span className="text-cyan-400 group-hover:underline flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Express Interest
                      </span>
                    ) : (
                      <span className="text-slate-500 uppercase">{mis.status}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

