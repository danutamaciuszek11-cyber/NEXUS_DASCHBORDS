import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import { X, Target, Award, Sparkles, Calendar, Briefcase, Zap, Shield, Code2, Plus } from 'lucide-react';
import { MissionDifficulty, Specialization } from '../types';

export const NewMissionModal: React.FC<{ isOpen: boolean; onClose?: () => void }> = ({
  isOpen,
  onClose = () => {}
}) => {
  const { worlds, projects, addMission, currentArchitect, architects, playCyberSound, triggerHaptic, language } = useNexus();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [worldSlug, setWorldSlug] = useState(worlds[0]?.slug || 'nexus-dev-hub');
  const [projectId, setProjectId] = useState<string>('');
  const [difficulty, setDifficulty] = useState<MissionDifficulty>('ADEPT');
  const [rewardScore, setRewardScore] = useState(250);
  const [deadline, setDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [skillsInput, setSkillsInput] = useState('TypeScript, React, AI');
  const [selectedSpecializations, setSelectedSpecializations] = useState<Specialization[]>(['CODE', 'ENGINEERING']);

  if (!isOpen) return null;

  const allSpecializations: Specialization[] = [
    'CODE',
    'DESIGN',
    'AI',
    'SECURITY',
    'ARCHITECTURE',
    'CREATIVE',
    'MUSIC',
    'RESEARCH',
    'ENGINEERING'
  ];

  const toggleSpecialization = (spec: Specialization) => {
    setSelectedSpecializations(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
    playCyberSound('click');
  };

  const setQuickDeadline = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setDeadline(d.toISOString().split('T')[0]);
    playCyberSound('beep');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const parsedSkills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

    // Bella AI Neural Recommendation logic for auto-matching candidate architects
    const recommendedArchitectIds = architects
      .filter(a => a.id !== currentArchitect.id)
      .map(arch => {
        let score = 0;
        // Specializations overlap
        const specMatches = (arch.specializations || []).filter(s => selectedSpecializations.includes(s)).length;
        score += specMatches * 25;
        // Skills overlap
        const skillMatches = (arch.skills || []).filter(sk =>
          parsedSkills.some(ps => ps.toLowerCase() === sk.toLowerCase())
        ).length;
        score += skillMatches * 20;
        // World alignment
        if ((arch.worlds || []).includes(worldSlug)) score += 15;
        // Contribution activity
        if (arch.contributionScore > 3000) score += 10;

        return { id: arch.id, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.id);

    addMission({
      title: title.trim(),
      description: description.trim(),
      worldSlug,
      projectId: projectId || undefined,
      difficulty,
      rewardScore: Number(rewardScore) || 200,
      requiredSpecializations: selectedSpecializations.length > 0 ? selectedSpecializations : ['CODE'],
      requiredSkills: parsedSkills.length > 0 ? parsedSkills : ['TypeScript'],
      deadline: deadline || '2026-10-15',
      createdBy: currentArchitect.id,
      status: 'OPEN',
      applicants: [],
      applicantDetails: [],
      recommendedArchitectIds
    });

    playCyberSound('success');
    triggerHaptic();

    // Reset form
    setTitle('');
    setDescription('');
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const availableProjects = projects.filter(p => !worldSlug || p.worldSlug === worldSlug);

  return (
    <div
      id="new-mission-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl bg-[#090d16]/95 border border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.25)] flex flex-col justify-between overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-emerald-500/20 bg-[#06080e]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-400 text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cyber font-bold text-base sm:text-lg text-white tracking-wide">
                {language === 'PL' ? 'OBUDŹ NOWĄ MISJĘ / BOUNTY' : 'POST NEW MISSION & BOUNTY'}
              </h3>
              <p className="text-[11px] font-mono-tech text-emerald-400/80">
                {language === 'PL'
                  ? 'Zdefiniuj cel, kryteria oraz nagrodę. Bella dopasuje architektów.'
                  : 'Define objective, skills, deadline, and reward. Bella matches relevant architects.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (typeof onClose === 'function') onClose();
              playCyberSound('click');
            }}
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs font-mono-tech text-slate-300">
          {/* Mission Title */}
          <div className="space-y-1">
            <label className="text-slate-300 font-cyber text-xs uppercase flex items-center gap-1.5">
              <span>{language === 'PL' ? 'Tytuł Misji *' : 'Mission Title *'}</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={
                language === 'PL'
                  ? 'np. Optymalizacja silnika fizyki node\'ów dla Nexus Games'
                  : 'e.g. Build WebGL Living Node Visualizer for Nexus Family'
              }
              className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none font-sans"
            />
          </div>

          {/* World & Optional Project Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-cyber text-xs uppercase">
                {language === 'PL' ? 'Świat Nexusa' : 'Nexus World'}
              </label>
              <select
                value={worldSlug}
                onChange={e => {
                  setWorldSlug(e.target.value);
                  setProjectId('');
                }}
                className="w-full bg-[#0d131f] border border-cyan-500/20 rounded-xl px-3 py-2 text-slate-200 focus:outline-none font-sans text-xs"
              >
                {worlds.map(w => (
                  <option key={w.id} value={w.slug}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-cyber text-xs uppercase flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'PL' ? 'Powiązany Projekt (Opcjonalnie)' : 'Linked Project (Optional)'}</span>
              </label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full bg-[#0d131f] border border-cyan-500/20 rounded-xl px-3 py-2 text-slate-200 focus:outline-none font-sans text-xs"
              >
                <option value="">-- {language === 'PL' ? 'Brak powiązanego projektu' : 'None / Standalone'} --</option>
                {availableProjects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Difficulty & Reward & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-cyber text-xs uppercase">
                {language === 'PL' ? 'Trudność' : 'Difficulty'}
              </label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as MissionDifficulty)}
                className="w-full bg-[#0d131f] border border-cyan-500/20 rounded-xl px-3 py-2 text-slate-200 focus:outline-none font-sans text-xs"
              >
                <option value="INITIATE">INITIATE (Podstawowy)</option>
                <option value="ADEPT">ADEPT (Średni)</option>
                <option value="ARCHITECT">ARCHITECT (Zaawansowany)</option>
                <option value="MASTERMIND">MASTERMIND (Ekspercki)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-cyber text-xs uppercase flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'PL' ? 'Nagroda Bounty (PTS)' : 'Bounty Bounty (PTS)'}</span>
              </label>
              <input
                type="number"
                min={50}
                max={5000}
                step={50}
                value={rewardScore}
                onChange={e => setRewardScore(Number(e.target.value))}
                className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-emerald-400 rounded-xl px-3.5 py-2 text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-cyber text-xs uppercase flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'PL' ? 'Termin (Deadline)' : 'Deadline'}</span>
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-emerald-400 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Deadline Presets */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-[10px] text-slate-500">Preset Deadline:</span>
            <button
              type="button"
              onClick={() => setQuickDeadline(7)}
              className="px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-[10px] text-cyan-300 hover:border-cyan-400"
            >
              +1 Week
            </button>
            <button
              type="button"
              onClick={() => setQuickDeadline(14)}
              className="px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-[10px] text-cyan-300 hover:border-cyan-400"
            >
              +2 Weeks
            </button>
            <button
              type="button"
              onClick={() => setQuickDeadline(30)}
              className="px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-[10px] text-cyan-300 hover:border-cyan-400"
            >
              +1 Month
            </button>
          </div>

          {/* Required Specializations */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-cyber text-xs uppercase">
              {language === 'PL' ? 'Wymagane Specjalizacje Architekta' : 'Required Architect Specializations'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allSpecializations.map(spec => {
                const isSelected = selectedSpecializations.includes(spec);
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => toggleSpecialization(spec)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg transition-all border flex items-center gap-1 ${
                      isSelected
                        ? 'bg-purple-950/80 border-purple-400 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                        : 'bg-[#0d131f] border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{spec}</span>
                    {isSelected && <Sparkles className="w-3 h-3 text-purple-300" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Required Skills Input */}
          <div className="space-y-1">
            <label className="text-slate-300 font-cyber text-xs uppercase flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'PL' ? 'Kluczowe Umiejętności (Oddzielone Przecinkami)' : 'Required Skills (Comma Separated)'}</span>
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={e => setSkillsInput(e.target.value)}
              placeholder="np. React, TypeScript, WebGL, Tailwind, Smart Contracts"
              className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-emerald-400 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Detailed Brief */}
          <div className="space-y-1">
            <label className="text-slate-300 font-cyber text-xs uppercase">
              {language === 'PL' ? 'Opis Zakresu Prac & Kryteria Akceptacji *' : 'Mission Brief & Deliverables *'}
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={
                language === 'PL'
                  ? 'Opisz dokładnie cel zadania, wymagane rezultaty i kryteria akceptacji przez Radę Architektów...'
                  : 'Describe the exact objective, expected deliverables, and acceptance criteria...'
              }
              className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-emerald-400 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none font-sans text-xs resize-none"
            />
          </div>

          {/* Bella AI Matchmaker Notice */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/40 via-[#0d1322] to-cyan-950/40 border border-purple-500/30 flex items-center gap-2.5 text-purple-200 text-xs">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
            <span>
              {language === 'PL'
                ? 'Bella po opublikowaniu automatycznie przeanalizuje profile 7 Architektów i wyselekcjonuje najskuteczniejszy zespół.'
                : 'Upon posting, Bella will immediately analyze all Architect profiles and highlight top neural matches.'}
            </span>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-cyan-500/20 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                if (typeof onClose === 'function') onClose();
                playCyberSound('click');
              }}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white"
            >
              {language === 'PL' ? 'Anuluj' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" />
              <span>{language === 'PL' ? 'Opublikuj Misję' : 'Post Mission'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

