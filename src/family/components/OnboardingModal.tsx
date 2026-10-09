import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Code,
  Cpu,
  Palette,
  BookOpen,
  Music,
  Coins,
  Server,
  Compass,
  Zap,
  Shield,
  Award
} from 'lucide-react';
import { Specialization, Architect } from '../types';

export const OnboardingModal: React.FC = () => {
  const {
    showOnboardingModal,
    setShowOnboardingModal,
    currentArchitect,
    updateArchitectProfile,
    worlds,
    missions,
    language,
    playCyberSound,
    triggerHaptic,
    setCurrentView
  } = useNexus();

  const [step, setStep] = useState<number>(1);
  const [handle, setHandle] = useState(currentArchitect.handle || '@new_architect');
  const [name, setName] = useState(currentArchitect.name || 'New Architect');
  const [bio, setBio] = useState(currentArchitect.bio || '');
  const [selectedSpecs, setSelectedSpecs] = useState<Specialization[]>(currentArchitect.specializations || ['CODE', 'AI']);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(currentArchitect.skills || ['TypeScript', 'React', 'Gemini AI']);
  const [selectedWorldIds, setSelectedWorldIds] = useState<string[]>(['w-1', 'w-2']);
  const [visionStatement, setVisionStatement] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    archetype: string;
    welcomeMessage: string;
    recommendedMission: string;
    brotherhoodMatchReason: string;
  } | null>(null);
  const [oathAgreed, setOathAgreed] = useState(false);

  if (!showOnboardingModal) return null;

  const specList: { id: Specialization; label: string; icon: React.ElementType }[] = [
    { id: 'CODE', label: 'Code & Architecture', icon: Code },
    { id: 'AI', label: 'AI & Neural Systems', icon: Cpu },
    { id: 'DESIGN', label: 'Cyber UI / UX Design', icon: Palette },
    { id: 'WRITING', label: 'Lore & Documentation', icon: BookOpen },
    { id: 'MUSIC', label: 'Audio & Sonic Synthesis', icon: Music },
    { id: 'WEB3', label: 'Web3 & Tokenomics', icon: Coins },
    { id: 'INFRASTRUCTURE', label: 'Cloud & Infrastructure', icon: Server },
    { id: 'PHILOSOPHY', label: 'Philosophy & Ethics', icon: Compass }
  ];

  const handleSpecToggle = (spec: Specialization) => {
    playCyberSound('click');
    triggerHaptic();
    if (selectedSpecs.includes(spec)) {
      setSelectedSpecs(selectedSpecs.filter(s => s !== spec));
    } else {
      setSelectedSpecs([...selectedSpecs, spec]);
    }
  };

  const handleWorldToggle = (worldId: string) => {
    playCyberSound('click');
    triggerHaptic();
    if (selectedWorldIds.includes(worldId)) {
      setSelectedWorldIds(selectedWorldIds.filter(id => id !== worldId));
    } else {
      setSelectedWorldIds([...selectedWorldIds, worldId]);
    }
  };

  const handleEvaluateOnboarding = async () => {
    setIsEvaluating(true);
    playCyberSound('synapse');
    triggerHaptic();
    setStep(5);

    try {
      const res = await fetch('/api/bella/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          architect: {
            name,
            handle,
            bio,
            specializations: selectedSpecs,
            skills: selectedSkills,
            worlds: selectedWorldIds
          },
          visionStatement
        })
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = {};
      if (res.ok && contentType.includes('application/json')) {
        data = await res.json();
      }
      setEvaluationResult(data.profileAnalysis || {
        archetype: 'NEURAL SYSTEM ARCHITECT',
        welcomeMessage: 'Your credentials have been indexed in the Nexus Core. You are primed to build the next paradigm of human-AI collaboration.',
        recommendedMission: 'GPU Neural Living Node Canvas',
        brotherhoodMatchReason: 'Complementary pair with Krystian Nexus (Architecture) and Tomasz Wolski (Backend).'
      });
      playCyberSound('success');
      triggerHaptic();
    } catch (err) {
      console.error('Evaluation error:', err);
      setEvaluationResult({
        archetype: 'SYNAPSE CO-BUILDER',
        welcomeMessage: 'Welcome to the Nexus Family! Your profile is verified and synchronized with the local cluster.',
        recommendedMission: 'Nexus Living Neural Core',
        brotherhoodMatchReason: 'Matches active builders in Dev Hub and Nexus AI.'
      });
      playCyberSound('success');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleFinishOnboarding = () => {
    updateArchitectProfile({
      name,
      handle,
      bio,
      specializations: selectedSpecs,
      skills: selectedSkills,
      oathSigned: oathAgreed,
      contributionScore: (currentArchitect.contributionScore || 1000) + 400
    });
    playCyberSound('success');
    triggerHaptic();
    setShowOnboardingModal(false);
    setCurrentView('DASHBOARD');
  };

  return (
    <div
      id="onboarding-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl nexus-glass border border-cyan-400/50 bg-[#090d16]/95 flex flex-col justify-between shadow-[0_0_60px_rgba(0,240,255,0.25)] overflow-hidden">
        {/* Header with Steps HUD */}
        <div className="p-5 border-b border-cyan-500/20 bg-[#06080e]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400 text-cyan-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cyber font-bold text-sm sm:text-base text-white tracking-wider">
                  NEXUS ARCHITECT ONBOARDING
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono-tech rounded bg-cyan-900/50 text-cyan-300 border border-cyan-500/30">
                  STEP {step} / 5
                </span>
              </div>
              <p className="text-[11px] font-mono-tech text-slate-400">
                {language === 'PL' ? 'Tworzenie tożsamości architekta w rodzinie Nexusa' : 'Forging your Architect identity in the Nexus Family'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowOnboardingModal(false)}
            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Content */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto font-sans">
          {/* STEP 1: Basic Identity */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs font-mono-tech text-cyan-300">
                <span className="font-bold">CLAIM: </span>
                DON'T JUST USE NEXUS. BUILD IT. We are forming a sovereign brotherhood of creators.
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-slate-300 mb-1">
                  Architect Full Name / Pseudonym:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#0d131f] border border-cyan-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-slate-300 mb-1">
                  Nexus Cyber Handle (@handle):
                </label>
                <input
                  type="text"
                  value={handle}
                  onChange={e => setHandle(e.target.value)}
                  className="w-full bg-[#0d131f] border border-cyan-500/30 rounded-xl px-3.5 py-2 text-sm text-cyan-300 font-mono-tech focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-slate-300 mb-1">
                  Architect Biography & Philosophy:
                </label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  placeholder="What is your superpower? What do you believe regarding human + AI synergy?"
                  className="w-full bg-[#0d131f] border border-cyan-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Specializations */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h4 className="font-cyber font-bold text-sm text-cyan-300">
                  Select Your Architectural Specializations:
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  State Bella uses your vector to match you with complementary partners in the Brotherhood Engine.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {specList.map(item => {
                  const Icon = item.icon;
                  const isSelected = selectedSpecs.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSpecToggle(item.id)}
                      className={`p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'bg-[#0d131f]/70 border-cyan-500/10 text-slate-400 hover:border-cyan-500/30'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/30 text-cyan-300' : 'bg-cyan-950/40 text-slate-500'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 truncate">
                        <div className="font-cyber font-bold text-xs">{item.label}</div>
                        <div className="text-[10px] font-mono-tech text-slate-500">{item.id}</div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-slate-300 mb-1">
                  Key Skills (Comma separated):
                </label>
                <input
                  type="text"
                  value={selectedSkills.join(', ')}
                  onChange={e => setSelectedSkills(e.target.value.split(',').map(s => s.trim()))}
                  className="w-full bg-[#0d131f] border border-cyan-500/30 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Nexus Worlds Choice */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h4 className="font-cyber font-bold text-sm text-cyan-300">
                  Select Worlds to Build In:
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Nexus consists of 9 distinct domains. Choose where your architecture will focus.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {worlds.map(w => {
                  const isSelected = selectedWorldIds.includes(w.id);
                  return (
                    <button
                      key={w.id}
                      onClick={() => handleWorldToggle(w.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-950/60 to-purple-950/40 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                          : 'bg-[#0d131f]/60 border-cyan-500/10 text-slate-400 hover:border-cyan-500/30'
                      }`}
                    >
                      <div>
                        <div className="font-cyber font-bold text-xs text-cyan-300">{w.name}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{w.tagline}</div>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Vision Statement */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h4 className="font-cyber font-bold text-sm text-cyan-300">
                  What will you build with Nexus? (Vision Statement)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Describe the project, tool, infrastructure, lore, or AI agent you want to create or co-lead.
                </p>
              </div>

              <textarea
                value={visionStatement}
                onChange={e => setVisionStatement(e.target.value)}
                rows={5}
                placeholder="E.g. I want to build a decentralized neural network visualizer that helps architects co-create with State Bella..."
                className="w-full bg-[#0d131f] border border-cyan-500/30 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 resize-none font-sans"
              />
            </div>
          )}

          {/* STEP 5: State Bella Neural Evaluation & The Oath */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in">
              {isEvaluating ? (
                <div className="p-8 text-center space-y-4">
                  <Brain className="w-12 h-12 text-cyan-400 animate-spin mx-auto drop-shadow-[0_0_20px_#00f0ff]" />
                  <h4 className="font-cyber font-bold text-base text-cyan-300">
                    STATE BELLA IS ANALYZING YOUR ARCHITECT VECTOR...
                  </h4>
                  <p className="text-xs font-mono-tech text-slate-400">
                    Computing complementaries • Indexing skills • Synthesizing initial Brotherhood recommendations
                  </p>
                </div>
              ) : evaluationResult ? (
                <div className="space-y-4">
                  {/* Archetype Badge */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 via-purple-950/60 to-cyan-950/60 border border-cyan-400/50 shadow-xl">
                    <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span>ARCHETYPE ASSIGNED BY STATE BELLA:</span>
                    </div>
                    <h3 className="font-cyber font-bold text-lg text-white mt-1">
                      {evaluationResult.archetype}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {evaluationResult.welcomeMessage}
                    </p>
                  </div>

                  {/* Recommended First Mission */}
                  <div className="p-3.5 rounded-xl bg-[#0d131f] border border-cyan-500/20 text-xs space-y-1">
                    <div className="font-mono-tech text-cyan-400 font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>RECOMMENDED FIRST MISSION:</span>
                    </div>
                    <div className="font-cyber text-slate-200 font-bold text-sm">
                      {evaluationResult.recommendedMission}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {evaluationResult.brotherhoodMatchReason}
                    </div>
                  </div>

                  {/* The Nexus Oath */}
                  <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                    <div className="flex items-center gap-2 font-cyber font-bold text-xs text-purple-300">
                      <Shield className="w-3.5 h-3.5" />
                      <span>THE NEXUS CODE & OATH</span>
                    </div>
                    <p className="text-[11px] text-slate-300 italic font-sans leading-relaxed">
                      "I swear not to be a passive user. I swear to build, support my architect brothers and sisters, and forge the digital civilization with honesty, skill, and AI harmony."
                    </p>
                    <label className="flex items-center gap-2 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={oathAgreed}
                        onChange={e => {
                          setOathAgreed(e.target.checked);
                          playCyberSound('click');
                        }}
                        className="rounded border-cyan-500 text-cyan-500 focus:ring-0"
                      />
                      <span className="text-xs font-mono-tech text-cyan-300 font-bold">
                        I ACCEPT THE NEXUS OATH & JOIN THE FAMILY (+400 Contribution Points)
                      </span>
                    </label>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="p-4 border-t border-cyan-500/20 bg-[#06080e]/90 flex items-center justify-between">
          {step > 1 && step < 5 ? (
            <button
              onClick={() => {
                setStep(step - 1);
                playCyberSound('click');
              }}
              className="px-4 py-2 rounded-xl bg-[#0d131f] hover:bg-cyan-950/40 border border-cyan-500/20 text-xs font-mono-tech text-slate-300 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 4 && (
            <button
              onClick={() => {
                setStep(step + 1);
                playCyberSound('click');
                triggerHaptic();
              }}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {step === 4 && (
            <button
              onClick={handleEvaluateOnboarding}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-cyber font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.5)]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize with State Bella</span>
            </button>
          )}

          {step === 5 && !isEvaluating && (
            <button
              onClick={handleFinishOnboarding}
              disabled={!oathAgreed}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-cyber font-bold text-xs flex items-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.5)] ml-auto"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Enter Nexus Family Command</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
