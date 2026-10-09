import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Target,
  Sparkles,
  Award,
  Calendar,
  Users,
  CheckCircle2,
  X,
  Zap,
  ArrowRight,
  Shield,
  Clock,
  Briefcase,
  Code2,
  Bot,
  UserCheck,
  Send,
  Flame,
  Check
} from 'lucide-react';

export const MissionDetailModal: React.FC = () => {
  const {
    activeMissionId,
    setActiveMissionId,
    missions,
    architects,
    worlds,
    currentArchitect,
    applyForMission,
    assignMissionApplicant,
    completeMission,
    playCyberSound,
    triggerHaptic,
    language,
    setShowBellaOverlay
  } = useNexus();

  const [pitchInput, setPitchInput] = useState('');
  const [showPitchBox, setShowPitchBox] = useState(false);

  if (!activeMissionId) return null;

  const mission = missions.find(m => m.id === activeMissionId);
  if (!mission) return null;

  const creator = architects.find(a => a.id === mission.createdBy);
  const claimedBy = architects.find(a => a.id === mission.claimedById);
  const world = worlds.find(w => w.slug === mission.worldSlug);
  const applicantArchitects = architects.filter(a => (mission.applicants || []).includes(a.id));
  const recommendedArchitects = architects.filter(a => mission.recommendedArchitectIds?.includes(a.id));

  const isCreator = mission.createdBy === currentArchitect.id || currentArchitect.role === 'FOUNDER' || currentArchitect.role === 'NEXUS ADMIN';
  const isApplicant = (mission.applicants || []).includes(currentArchitect.id);
  const isClaimedByMe = mission.claimedById === currentArchitect.id;
  const isCompleted = mission.status === 'COMPLETED';

  const handleApply = () => {
    applyForMission(mission.id, pitchInput.trim() || undefined);
    setPitchInput('');
    setShowPitchBox(false);
  };

  const getDifficultyColor = (diff: string) => {
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

  return (
    <div
      id="mission-detail-modal"
      onClick={() => {
        setActiveMissionId(null);
        playCyberSound('click');
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl nexus-glass border border-cyan-400/50 bg-[#090d16]/95 flex flex-col justify-between shadow-[0_0_60px_rgba(0,240,255,0.25)] overflow-hidden"
      >
        {/* Modal Top Header */}
        <div className="p-5 border-b border-cyan-500/20 bg-[#06080e]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400 text-cyan-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cyber font-bold text-base sm:text-lg text-white tracking-wide">
                  {mission.title}
                </h3>
                <span className={`px-2 py-0.5 text-[9px] font-mono-tech rounded border ${getDifficultyColor(mission.difficulty)}`}>
                  {mission.difficulty}
                </span>
                <span className={`px-2 py-0.5 text-[9px] font-mono-tech rounded border ${
                  mission.status === 'OPEN'
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                    : mission.status === 'IN_PROGRESS'
                    ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                    : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
                }`}>
                  {mission.status}
                </span>
              </div>
              <p className="text-[11px] font-mono-tech text-slate-400">
                World: {world?.name || mission.worldSlug} • Deadline: {mission.deadline}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveMissionId(null);
              playCyberSound('click');
            }}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-300 text-xs sm:text-sm font-sans">
          {/* Mission Objective & Bounty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0d131f] border border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-400 font-mono-tech text-xs mb-1">
                <Award className="w-4 h-4" />
                <span>REWARD SCORE</span>
              </div>
              <p className="font-cyber font-bold text-xl text-white">
                +{mission.rewardScore} <span className="text-cyan-400 text-xs font-mono-tech">PTS</span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0d131f] border border-cyan-500/20">
              <div className="flex items-center gap-2 text-purple-400 font-mono-tech text-xs mb-1">
                <Shield className="w-4 h-4" />
                <span>MISSION LEAD</span>
              </div>
              <p className="font-cyber text-sm text-slate-200 truncate">
                {creator?.name || 'Nexus Core Admin'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0d131f] border border-cyan-500/20">
              <div className="flex items-center gap-2 text-emerald-400 font-mono-tech text-xs mb-1">
                <Clock className="w-4 h-4" />
                <span>STATUS / ASSIGNED TO</span>
              </div>
              <p className="font-cyber text-sm text-slate-200 truncate">
                {claimedBy ? claimedBy.name : 'Open for enlistment'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-cyber font-bold text-xs uppercase tracking-wider text-cyan-300">
              {language === 'PL' ? 'OPIS MISJI & CEL OPERACYJNY' : 'MISSION BRIEF & OBJECTIVE'}
            </h4>
            <div className="p-4 rounded-xl bg-[#0c101a] border border-cyan-500/20 text-slate-200 leading-relaxed">
              {mission.description}
            </div>
          </div>

          {/* Required Specializations & Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-cyber font-bold text-xs uppercase tracking-wider text-purple-300">
                {language === 'PL' ? 'WYMAGANE SPECJALIZACJE' : 'REQUIRED SPECIALIZATIONS'}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {mission.requiredSpecializations.map(spec => (
                  <span
                    key={spec}
                    className="px-2.5 py-1 text-[11px] font-mono-tech rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-cyber font-bold text-xs uppercase tracking-wider text-cyan-300">
                {language === 'PL' ? 'KLUCZOWE KOMPETENCJE' : 'REQUIRED SKILLS'}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {mission.requiredSkills.map(skill => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-[11px] font-mono-tech rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bella Matchmaker Analysis */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-cyan-950/40 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-300 font-cyber font-bold text-xs">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>STATE BELLA NEURAL RECOMMENDATION</span>
              </div>
              <button
                onClick={() => {
                  setShowBellaOverlay(true);
                  playCyberSound('synapse');
                }}
                className="text-[10px] font-mono-tech text-cyan-400 hover:text-white underline"
              >
                Consult Bella
              </button>
            </div>
            <p className="text-xs text-slate-300">
              {language === 'PL'
                ? `Bella zidentyfikowała ${recommendedArchitects.length} pasujących Architektów z profilami synergicznymi dla tej misji.`
                : `Bella identified ${recommendedArchitects.length} matching Architects with synergistic skill profiles for this mission.`}
            </p>
            {recommendedArchitects.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {recommendedArchitects.map(arch => (
                  <div
                    key={arch.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0b0f19] border border-cyan-500/20 text-[11px] font-mono-tech"
                  >
                    <img src={arch.avatar} alt={arch.name} className="w-5 h-5 rounded-full object-cover border border-cyan-400" />
                    <span className="text-slate-200">{arch.name}</span>
                    <span className="text-cyan-400">({arch.specializations[0]})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Enlisted Applicants & Creator Assignment */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-cyber font-bold text-xs uppercase tracking-wider text-slate-300">
                {language === 'PL' ? 'ZGŁOSZENI ARCHITEKCI & APELACJE' : 'ENLISTED ARCHITECTS & PITCHES'} ({applicantArchitects.length})
              </h4>
              {isCreator && (
                <span className="text-[10px] font-mono-tech text-purple-300">
                  CREATOR / ADMIN CONTROL
                </span>
              )}
            </div>

            {applicantArchitects.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-[#090d16] border border-cyan-500/10">
                {language === 'PL' ? 'Brak zgłoszeń. Bądź pierwszym Architektem, który podejmie to wyzwanie.' : 'No applicants yet. Be the first Architect to step forward.'}
              </p>
            ) : (
              <div className="space-y-2.5">
                {applicantArchitects.map(applicant => {
                  const details = mission.applicantDetails?.find(d => d.architectId === applicant.id);
                  const isAssigned = mission.claimedById === applicant.id;

                  return (
                    <div
                      key={applicant.id}
                      className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                        isAssigned
                          ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          : 'bg-[#0c101a] border-cyan-500/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={applicant.avatar}
                            alt={applicant.name}
                            className="w-9 h-9 rounded-xl object-cover border border-cyan-400"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-cyber font-bold text-xs text-white">{applicant.name}</p>
                              <span className="text-[10px] font-mono-tech text-cyan-400">@{applicant.handle}</span>
                              <span className="text-[9px] font-mono-tech px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                                {applicant.role}
                              </span>
                            </div>
                            <p className="text-[10px] font-mono-tech text-slate-400">
                              {applicant.specializations.join(', ')} • ⚡ {applicant.contributionScore} pts
                            </p>
                          </div>
                        </div>

                        {/* Assignment Status or Creator Assign Button */}
                        <div>
                          {isAssigned ? (
                            <span className="px-3 py-1 text-[10px] font-mono-tech font-bold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              ASSIGNED
                            </span>
                          ) : isCreator && !isCompleted ? (
                            <button
                              onClick={() => {
                                assignMissionApplicant(mission.id, applicant.id);
                                playCyberSound('success');
                                triggerHaptic();
                              }}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-black font-cyber font-bold text-[10px] transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>{language === 'PL' ? 'Przydziel Zadanie' : 'Assign Mission'}</span>
                            </button>
                          ) : null}
                        </div>
                      </div>

                      {/* Pitch Content */}
                      {details?.pitch && (
                        <div className="p-2.5 rounded-lg bg-[#070a12] border border-cyan-500/10 text-slate-300 text-xs">
                          <span className="text-[10px] font-mono-tech text-cyan-400 font-bold block mb-0.5">
                            PITCH / PLAN REALIZACJI:
                          </span>
                          <p className="font-sans leading-relaxed">{details.pitch}</p>
                        </div>
                      )}

                      {/* Bella Rationale */}
                      {details?.bellaRationale && (
                        <div className="flex items-center gap-2 text-[11px] font-mono-tech text-purple-300">
                          <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>Bella: {details.bellaRationale}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Enlist Pitch Input Box */}
          {showPitchBox && !isApplicant && (
            <div className="p-4 rounded-xl bg-[#0b101c] border border-cyan-500/30 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-cyber font-bold text-xs text-white">
                  {language === 'PL' ? 'Twój pitch i deklaracja wykonania:' : 'Your pitch & execution strategy:'}
                </span>
                <span className="text-[10px] font-mono-tech text-slate-400">Optional</span>
              </div>
              <textarea
                value={pitchInput}
                onChange={e => setPitchInput(e.target.value)}
                placeholder={language === 'PL' ? 'Opisz swoje doświadczenie z tym stosem technologicznym lub proponowaną architekturę rozwiązania...' : 'Describe your relevant experience or proposed technical architecture...'}
                className="w-full h-20 bg-[#070b13] border border-cyan-500/20 focus:border-cyan-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowPitchBox(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs font-mono-tech"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 text-black font-cyber font-bold text-xs hover:bg-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'PL' ? 'Wyślij Zgłoszenie' : 'Submit Pitch'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-cyan-500/20 bg-[#06080e]/90 flex items-center justify-between gap-3">
          <button
            onClick={() => setActiveMissionId(null)}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs font-mono-tech transition-colors"
          >
            {language === 'PL' ? 'Zamknij' : 'Close'}
          </button>

          <div className="flex items-center gap-2">
            {!isCompleted && isClaimedByMe && (
              <button
                onClick={() => completeMission(mission.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400 text-emerald-300 text-xs font-cyber font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'PL' ? 'Oznacz jako ukończone (+bounty)' : 'Mark as Completed (+bounty)'}</span>
              </button>
            )}

            {!isCompleted && !isApplicant && !showPitchBox && (
              <button
                onClick={() => {
                  setShowPitchBox(true);
                  playCyberSound('beep');
                  triggerHaptic();
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]"
              >
                <Zap className="w-4 h-4" />
                <span>{language === 'PL' ? 'Zgłoś się do misji' : 'Enlist for Mission'}</span>
              </button>
            )}

            {!isCompleted && isApplicant && !isClaimedByMe && (
              <span className="px-4 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono-tech text-xs">
                {language === 'PL' ? '✓ Zgłoszenie zarejestrowane' : '✓ Enlistment Registered'}
              </span>
            )}

            {isCompleted && (
              <span className="px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono-tech text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {language === 'PL' ? 'Misja zrealizowana' : 'Mission Completed'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

