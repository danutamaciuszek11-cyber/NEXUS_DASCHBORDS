import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  X,
  User,
  Shield,
  Award,
  Zap,
  Bot,
  Globe,
  FolderGit2,
  CheckCircle2,
  Users,
  ExternalLink,
  Sparkles,
  Edit3,
  ArrowRight,
  Code2,
  Palette,
  Brain,
  Layers,
  Cpu,
  Share2,
  Terminal,
  Activity,
  Compass,
  Star,
  Check,
  Copy,
  Plus
} from 'lucide-react';
import { Specialization, Architect } from '../types';

interface ArchitectProfileModalProps {
  architectId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (architect: Architect) => void;
}

const ALL_SPECIALIZATIONS: { id: Specialization; label: string; icon: any; color: string; bg: string; border: string }[] = [
  { id: 'CODE', label: 'CODE', icon: Code2, color: 'text-cyan-400', bg: 'bg-cyan-950/60', border: 'border-cyan-500/40' },
  { id: 'AI', label: 'AI & NEURAL', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-950/60', border: 'border-purple-500/40' },
  { id: 'DESIGN', label: 'DESIGN & UI', icon: Palette, color: 'text-pink-400', bg: 'bg-pink-950/60', border: 'border-pink-500/40' },
  { id: 'ARCHITECTURE', label: 'ARCHITECTURE', icon: Layers, color: 'text-amber-400', bg: 'bg-amber-950/60', border: 'border-amber-500/40' },
  { id: 'ENGINEERING', label: 'ENGINEERING', icon: Cpu, color: 'text-emerald-400', bg: 'bg-emerald-950/60', border: 'border-emerald-500/40' },
  { id: 'RESEARCH', label: 'RESEARCH', icon: Compass, color: 'text-blue-400', bg: 'bg-blue-950/60', border: 'border-blue-500/40' },
  { id: 'INFRASTRUCTURE', label: 'INFRASTRUCTURE', icon: Terminal, color: 'text-teal-400', bg: 'bg-teal-950/60', border: 'border-teal-500/40' },
  { id: 'SECURITY', label: 'SECURITY', icon: Shield, color: 'text-red-400', bg: 'bg-red-950/60', border: 'border-red-500/40' },
  { id: 'COMMUNITY', label: 'COMMUNITY', icon: Users, color: 'text-green-400', bg: 'bg-green-950/60', border: 'border-green-500/40' },
  { id: 'WEB3', label: 'WEB3 & PROTOCOL', icon: Globe, color: 'text-indigo-400', bg: 'bg-indigo-950/60', border: 'border-indigo-500/40' },
  { id: 'WRITING', label: 'WRITING & RFC', icon: Edit3, color: 'text-yellow-400', bg: 'bg-yellow-950/60', border: 'border-yellow-500/40' },
  { id: 'CREATIVE', label: 'CREATIVE LORE', icon: Sparkles, color: 'text-rose-400', bg: 'bg-rose-950/60', border: 'border-rose-500/40' }
];

export const ArchitectProfileModal: React.FC<ArchitectProfileModalProps> = ({
  architectId,
  isOpen,
  onClose,
  onEdit
}) => {
  const {
    architects,
    currentArchitect,
    setCurrentArchitectId,
    projects,
    worlds,
    brotherhoodNodes,
    updateArchitectProfile,
    updateSpecificArchitect,
    setActiveBrotherhoodNodeId,
    setCurrentView,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CAPABILITIES' | 'PROJECTS' | 'AI_PROFILE' | 'PORTFOLIO' | 'NETWORK'>('OVERVIEW');
  const [copiedHandle, setCopiedHandle] = useState(false);

  if (!isOpen || !architectId) return null;

  const architect = architects.find(a => a.id === architectId);
  if (!architect) return null;

  const isMe = architect.id === currentArchitect.id;

  const architectProjects = projects.filter(p =>
    (architect.projects || []).includes(p.id) || (p.architectIds || []).includes(architect.id)
  );

  const architectWorlds = worlds.filter(w =>
    (architect.worlds || []).includes(w.slug) || (architect.worlds || []).includes(w.id)
  );

  const collaboratorList = architects.filter(a =>
    (architect.collaborators || []).includes(a.id)
  );

  const activeBrotherhood = brotherhoodNodes.find(
    n => n.architect1Id === architect.id || n.architect2Id === architect.id
  );

  const handleCopyHandle = () => {
    navigator.clipboard.writeText(`@${architect.handle}`);
    setCopiedHandle(true);
    playCyberSound('beep');
    triggerHaptic();
    setTimeout(() => setCopiedHandle(false), 2000);
  };

  const handleAvailabilityChange = (status: 'AVAILABLE' | 'BUILDING' | 'DEEP_FOCUS' | 'OFFLINE') => {
    if (isMe) {
      updateArchitectProfile({ availability: status });
    } else {
      updateSpecificArchitect(architect.id, { availability: status });
    }
    playCyberSound('click');
    triggerHaptic();
  };

  const getStatusColor = (availability: string) => {
    switch (availability) {
      case 'AVAILABLE':
        return 'bg-emerald-400 text-emerald-300 border-emerald-500/40';
      case 'BUILDING':
        return 'bg-cyan-400 text-cyan-300 border-cyan-500/40';
      case 'DEEP_FOCUS':
        return 'bg-purple-400 text-purple-300 border-purple-500/40';
      default:
        return 'bg-slate-500 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div
      onClick={() => {
        playCyberSound('click');
        if (typeof onClose === 'function') onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl bg-[#080b11] border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden text-slate-100"
      >
        
        {/* Top Decorative Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-cyan-500 to-purple-500" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-cyan-500/20 bg-gradient-to-b from-[#0e1422] to-[#080b11] relative">
          <button
            onClick={() => {
              playCyberSound('click');
              if (typeof onClose === 'function') onClose();
            }}
            className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-cyan-500/30 transition-all z-10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pr-8">
            <div className="flex items-center gap-4">
              {/* Avatar with Status Ring */}
              <div className="relative group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-500 via-cyan-400 to-purple-500 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                  <img
                    src={architect.avatar}
                    alt={architect.name}
                    className="w-full h-full object-cover rounded-2xl bg-[#090d16]"
                  />
                </div>
                <span
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#080b11] ${
                    architect.availability === 'AVAILABLE'
                      ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
                      : architect.availability === 'BUILDING'
                      ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]'
                      : architect.availability === 'DEEP_FOCUS'
                      ? 'bg-purple-400 shadow-[0_0_10px_#c084fc]'
                      : 'bg-slate-500'
                  }`}
                  title={`Status: ${architect.availability}`}
                />
              </div>

              {/* Names, Pseudonym, Badges */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-cyber font-bold text-lg sm:text-2xl text-white tracking-wide">
                    {architect.name}
                  </h2>
                  {architect.pseudonym && (
                    <span className="text-xs text-amber-300 font-mono-tech px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/30">
                      &quot;{architect.pseudonym}&quot;
                    </span>
                  )}
                  {isMe && (
                    <span className="px-2 py-0.5 text-[9px] font-cyber font-bold rounded bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                      ACTIVE IDENTITY
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopyHandle}
                    className="flex items-center gap-1 text-xs font-mono-tech text-cyan-400 hover:text-cyan-300 transition-colors group"
                    title="Click to copy handle"
                  >
                    <span>@{architect.handle}</span>
                    {copiedHandle ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                    )}
                  </button>
                  <span className="text-slate-600">•</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                    {architect.role}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[10px] font-mono-tech text-slate-400">
                    Joined: {architect.joinedEpoch || 'Genesis'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              {/* Availability Dropdown / Status */}
              <div className="flex items-center gap-1.5 bg-[#0d131f] border border-cyan-500/20 px-3 py-1.5 rounded-xl text-xs font-mono-tech">
                <span className="text-slate-400 text-[10px]">STATUS:</span>
                <select
                  value={architect.availability}
                  onChange={e => handleAvailabilityChange(e.target.value as any)}
                  className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="AVAILABLE" className="bg-[#0d131f] text-emerald-400">● AVAILABLE</option>
                  <option value="BUILDING" className="bg-[#0d131f] text-cyan-400">● BUILDING</option>
                  <option value="DEEP_FOCUS" className="bg-[#0d131f] text-purple-400">● DEEP FOCUS</option>
                  <option value="OFFLINE" className="bg-[#0d131f] text-slate-400">● OFFLINE</option>
                </select>
              </div>

              {/* Edit Profile Button */}
              {onEdit && (
                <button
                  onClick={() => {
                    playCyberSound('click');
                    triggerHaptic();
                    if (typeof onEdit === 'function') onEdit(architect);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isMe ? (language === 'PL' ? 'Edytuj Profil' : 'Edit Profile') : (language === 'PL' ? 'Zarządzaj Profilem' : 'Manage Profile')}</span>
                </button>
              )}

              {/* Switch to this profile identity */}
              {!isMe && (
                <button
                  onClick={() => {
                    setCurrentArchitectId(architect.id);
                    playCyberSound('synapse');
                    triggerHaptic();
                  }}
                  className="px-3 py-2 rounded-xl border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 font-cyber font-bold text-xs transition-all"
                  title="Switch active user identity to this architect"
                >
                  {language === 'PL' ? 'Przełącz Tożsamość' : 'Switch Persona'}
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
            <div className="p-2.5 rounded-xl bg-[#090d16] border border-amber-500/20 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-mono-tech text-slate-400 uppercase">CONTRIBUTION</p>
                <p className="font-cyber font-bold text-sm text-amber-300">⚡ {architect.contributionScore} pts</p>
              </div>
              <Award className="w-4 h-4 text-amber-400 opacity-60" />
            </div>

            <div className="p-2.5 rounded-xl bg-[#090d16] border border-cyan-500/20 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-mono-tech text-slate-400 uppercase">ACTIVITY LEVEL</p>
                <p className="font-cyber font-bold text-sm text-cyan-300">{architect.activityLevel || 85}%</p>
              </div>
              <Activity className="w-4 h-4 text-cyan-400 opacity-60" />
            </div>

            <div className="p-2.5 rounded-xl bg-[#090d16] border border-emerald-500/20 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-mono-tech text-slate-400 uppercase">COMPLETED TASKS</p>
                <p className="font-cyber font-bold text-sm text-emerald-300">{architect.completedTasks || 0}</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 opacity-60" />
            </div>

            <div className="p-2.5 rounded-xl bg-[#090d16] border border-purple-500/20 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-mono-tech text-slate-400 uppercase">ACTIVE PROJECTS</p>
                <p className="font-cyber font-bold text-sm text-purple-300">{(architect.projects || []).length} Nodes</p>
              </div>
              <FolderGit2 className="w-4 h-4 text-purple-400 opacity-60" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-cyan-500/20 bg-[#0a0f1d] px-4 sm:px-6 overflow-x-auto no-scrollbar gap-1">
          {[
            { id: 'OVERVIEW', label: language === 'PL' ? 'Przegląd' : 'Overview', icon: User },
            { id: 'CAPABILITIES', label: language === 'PL' ? 'Specjalizacje & Skille' : 'Specializations & Skills', icon: Code2 },
            { id: 'PROJECTS', label: language === 'PL' ? 'Światy & Projekty' : 'Worlds & Projects', icon: Globe },
            { id: 'AI_PROFILE', label: language === 'PL' ? 'Profil AI & Bella' : 'AI Profile & Synergy', icon: Bot },
            { id: 'PORTFOLIO', label: language === 'PL' ? 'Portfolio' : 'Portfolio', icon: Layers },
            { id: 'NETWORK', label: language === 'PL' ? 'Współpracownicy' : 'Collaborators', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  playCyberSound('click');
                  triggerHaptic();
                }}
                className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-cyber font-bold transition-all shrink-0 ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-h-[60vh]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Bio / Architectural Manifesto */}
              <div className="p-5 rounded-2xl bg-[#0d131f] border border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-cyber font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{language === 'PL' ? 'MANIFEST & BIOGRAFIA ARCHITEKTA' : 'ARCHITECTURAL BIO & MANIFESTO'}</span>
                  </h3>
                  <span className="text-[10px] font-mono-tech text-slate-500">SYNAPSE CERTIFIED</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                  {architect.bio || 'Ten architekt nie dodał jeszcze publicznego manifestu.'}
                </p>
              </div>

              {/* Activity Level Meter */}
              <div className="p-5 rounded-2xl bg-[#0d131f] border border-cyan-500/20 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-cyber font-bold text-slate-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>SYNAPTIC ACTIVITY PULSE</span>
                  </span>
                  <span className="font-mono-tech text-cyan-300 font-bold">{architect.activityLevel || 85}% ENGAGEMENT</span>
                </div>
                <div className="w-full h-3 bg-[#080b11] rounded-full overflow-hidden border border-cyan-500/20 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-cyan-400 to-purple-500 shadow-[0_0_12px_rgba(0,240,255,0.5)] transition-all duration-500"
                    style={{ width: `${architect.activityLevel || 85}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-500">
                  <span>Dormant</span>
                  <span>Steady Flow</span>
                  <span>Hyper-Focus</span>
                  <span>Sovereign (Maximum)</span>
                </div>
              </div>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Specialization Highlights */}
                <div className="p-4 rounded-2xl bg-[#0d131f] border border-purple-500/20 space-y-2.5">
                  <h4 className="text-xs font-cyber font-bold text-purple-300 uppercase flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>GŁÓWNE SPECJALIZACJE</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(architect.specializations || []).map(spec => (
                      <span
                        key={spec}
                        className="px-2.5 py-1 text-[10px] font-mono-tech rounded-lg bg-purple-950/60 text-purple-300 border border-purple-500/30 font-bold"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Archetype Preview */}
                <div className="p-4 rounded-2xl bg-[#0d131f] border border-cyan-500/20 space-y-2.5">
                  <h4 className="text-xs font-cyber font-bold text-cyan-300 uppercase flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AI ARCHETYPE & COLLABORATION</span>
                  </h4>
                  <div className="space-y-1 text-xs">
                    <p className="font-semibold text-white">{architect.aiProfile?.archetype || 'Neural Synthesist'}</p>
                    <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                      {architect.aiProfile?.collaborationStyle || 'Modularna architektura i szybkie prototypowanie'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SPECIALIZATIONS & SKILLS */}
          {activeTab === 'CAPABILITIES' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Specialization Categories Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-cyber font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>KATEGORIE SPECJALIZACJI W EKOSYSTEMIE NEXUS</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {ALL_SPECIALIZATIONS.map(item => {
                    const isSelected = (architect.specializations || []).includes(item.id);
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? `${item.bg} ${item.border} ${item.color} shadow-[0_0_15px_rgba(0,0,0,0.4)]`
                            : 'bg-[#090d16]/50 border-cyan-500/10 text-slate-500 opacity-40'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-cyber font-bold truncate">{item.label}</span>
                        {isSelected && <Check className="w-3 h-3 ml-auto shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Technical & Operational Skills */}
              <div className="p-5 rounded-2xl bg-[#0d131f] border border-cyan-500/20 space-y-3">
                <h3 className="text-xs font-cyber font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>POTWIERDZONE UMIEJĘTNOŚCI TECHNICZNE ({architect.skills?.length || 0})</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(architect.skills || []).map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-xl bg-[#090d16] border border-cyan-500/30 text-cyan-300 font-mono-tech text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{skill}</span>
                    </span>
                  ))}
                  {(!architect.skills || architect.skills.length === 0) && (
                    <span className="text-slate-500 text-xs font-mono-tech">Brak dodanych umiejętności.</span>
                  )}
                </div>
              </div>

              {/* Research & Intellectual Interests */}
              <div className="p-5 rounded-2xl bg-[#0d131f] border border-purple-500/20 space-y-3">
                <h3 className="text-xs font-cyber font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                  <Brain className="w-3.5 h-3.5 text-purple-400" />
                  <span>OBSZARY ZAINTERESOWAŃ & BADAŃ ({architect.interests?.length || 0})</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(architect.interests || []).map(interest => (
                    <span
                      key={interest}
                      className="px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 font-mono-tech text-xs flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>{interest}</span>
                    </span>
                  ))}
                  {(!architect.interests || architect.interests.length === 0) && (
                    <span className="text-slate-500 text-xs font-mono-tech">Brak dodanych zainteresowań.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS & WORLDS */}
          {activeTab === 'PROJECTS' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Worlds Affiliation */}
              <div className="space-y-3">
                <h3 className="text-xs font-cyber font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>AFILIACJA ZE ŚWIATAMI NEXUSA ({architectWorlds.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {architectWorlds.map(w => (
                    <div
                      key={w.id}
                      className="p-3.5 rounded-xl bg-[#0d131f] border border-amber-500/20 hover:border-amber-500/50 transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-cyber font-bold text-xs text-white truncate">{w.name}</span>
                        <span className="text-[9px] font-mono-tech px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                          WORLD
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{w.description}</p>
                    </div>
                  ))}
                  {architectWorlds.length === 0 && (
                    <p className="text-xs text-slate-500 font-mono-tech col-span-full">Brak przypisanych światów.</p>
                  )}
                </div>
              </div>

              {/* Active Projects */}
              <div className="space-y-3">
                <h3 className="text-xs font-cyber font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                  <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>PROJEKTY ARCHITEKTA ({architectProjects.length})</span>
                </h3>
                <div className="space-y-3">
                  {architectProjects.map(proj => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-xl bg-[#0d131f] border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-cyber font-bold text-sm text-white">{proj.title}</h4>
                          <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                            {proj.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 max-w-xl">{proj.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-mono-tech text-amber-400 font-bold">⚡ {proj.contributionBounty || 250} pts</span>
                      </div>
                    </div>
                  ))}
                  {architectProjects.length === 0 && (
                    <p className="text-xs text-slate-500 font-mono-tech">Brak aktywnych projektów w profilu.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI PROFILE & SYNERGY */}
          {activeTab === 'AI_PROFILE' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Primary AI Profile */}
              <div className="p-5 rounded-2xl bg-[#0d131f] border border-purple-500/30 space-y-4 shadow-[0_0_25px_rgba(168,85,247,0.15)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-400 animate-pulse" />
                    <h3 className="font-cyber font-bold text-sm text-white uppercase">
                      BELLA NEURAL PROFILE & COGNITIVE RESONANCE
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono-tech rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    RESONANCE: {architect.aiProfile?.resonance || 94}%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-[#090d16] border border-purple-500/20 space-y-1">
                    <p className="text-[10px] font-mono-tech text-slate-400 uppercase">ARCHETYP KOGNITYWNY</p>
                    <p className="font-cyber font-bold text-sm text-purple-300">
                      {architect.aiProfile?.archetype || 'Supreme Sovereign'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#090d16] border border-purple-500/20 space-y-1">
                    <p className="text-[10px] font-mono-tech text-slate-400 uppercase">PREFEROWANY MODEL AI</p>
                    <p className="font-mono-tech font-bold text-xs text-cyan-300">
                      {architect.aiProfile?.model || 'Gemini 2.5 Flash / Pro Hybrid'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-mono-tech text-slate-400">STYL WSPÓŁPRACY & METODYKA:</p>
                  <div className="p-3 rounded-xl bg-[#090d16] border border-purple-500/15 text-xs text-slate-200">
                    {architect.aiProfile?.collaborationStyle || 'Decentralized async collaboration with high-agency execution.'}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-mono-tech text-slate-400">REKOMENDOWANE PAROWANIA Z INNYMI ARCHITEKTAMI:</p>
                  <div className="p-3 rounded-xl bg-[#090d16] border border-cyan-500/15 text-xs text-cyan-200">
                    {architect.aiProfile?.recommendedPairings || 'Core Systems Architects, Creative Lore Masters, and Visual Alchemists.'}
                  </div>
                </div>
              </div>

              {/* Secondary AI Profiles list if available */}
              {architect.aiProfiles && architect.aiProfiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-cyber font-bold text-slate-300 uppercase">DODATKOWE PROFILE AI AGENTÓW</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {architect.aiProfiles.map(aip => (
                      <div key={aip.id} className="p-3.5 rounded-xl bg-[#0d131f] border border-cyan-500/20 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-cyber font-bold text-xs text-white">{aip.name}</span>
                          <span className="text-[9px] font-mono-tech text-cyan-400">{aip.model}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{aip.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PORTFOLIO */}
          {activeTab === 'PORTFOLIO' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-cyber font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>PORTFOLIO PRAC & ARTEFAKTÓW ARCHITEKTA ({(architect.portfolio || []).length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(architect.portfolio || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#0d131f] border border-cyan-500/20 hover:border-amber-400/50 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-cyber font-bold text-sm text-white">{item.title}</h4>
                        {item.url && item.url !== '#' && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded-lg text-cyan-400 hover:text-white hover:bg-cyan-950 transition-all"
                            title="Open Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.description}</p>
                    </div>

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2 border-t border-cyan-500/10">
                        {item.tags.map((t, tidx) => (
                          <span
                            key={tidx}
                            className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-amber-950/40 text-amber-300 border border-amber-500/20"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {(!architect.portfolio || architect.portfolio.length === 0) && (
                  <div className="p-8 text-center text-slate-500 font-mono-tech text-xs col-span-full rounded-2xl bg-[#0d131f] border border-cyan-500/10">
                    Brak dodanych elementów portfolio. Kliknij &quot;Edytuj Profil&quot; aby dodać swoje projekty i linki.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: NETWORK & COLLABORATORS */}
          {activeTab === 'NETWORK' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Brotherhood Node Status */}
              {activeBrotherhood && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/50 via-[#0d131f] to-cyan-950/50 border border-purple-500/30 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono-tech text-purple-400 font-bold uppercase">AKTYWNY WĘZEŁ BROTHERHOOD</span>
                    <p className="font-cyber font-bold text-sm text-white">Połączony z partnerem operacyjnym</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveBrotherhoodNodeId(activeBrotherhood.id);
                      setCurrentView('BROTHERHOOD');
                      if (typeof onClose === 'function') onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-cyber font-bold text-xs transition-all"
                  >
                    Otwórz Węzeł
                  </button>
                </div>
              )}

              {/* Collaborators List */}
              <div className="space-y-3">
                <h3 className="text-xs font-cyber font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>BLISCY WSPÓŁPRACOWNICY W NEXUSIE ({collaboratorList.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {collaboratorList.map(collab => (
                    <div
                      key={collab.id}
                      className="p-3.5 rounded-xl bg-[#0d131f] border border-cyan-500/20 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={collab.avatar}
                          alt={collab.name}
                          className="w-10 h-10 rounded-xl object-cover border border-cyan-400"
                        />
                        <div>
                          <p className="font-cyber font-bold text-xs text-white">{collab.name}</p>
                          <p className="text-[10px] font-mono-tech text-cyan-400">@{collab.handle}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                        {collab.role}
                      </span>
                    </div>
                  ))}
                  {collaboratorList.length === 0 && (
                    <p className="text-xs text-slate-500 font-mono-tech col-span-full">Brak zarejestrowanych współpracowników.</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-cyan-500/20 bg-[#0a0f1d] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-tech text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>{architect.oathSigned ? 'Nexus Family Oath: PODPISANA I ZWERYFIKOWANA' : 'Nexus Oath: Niepodpisana'}</span>
          </div>
          <button
            onClick={() => {
              playCyberSound('click');
              if (typeof onClose === 'function') onClose();
            }}
            className="px-5 py-2 rounded-xl bg-[#0d131f] hover:bg-slate-800 border border-cyan-500/30 text-white font-cyber font-bold text-xs transition-all w-full sm:w-auto"
          >
            {language === 'PL' ? 'Zamknij Podgląd' : 'Close View'}
          </button>
        </div>
      </div>
    </div>
  );
};
