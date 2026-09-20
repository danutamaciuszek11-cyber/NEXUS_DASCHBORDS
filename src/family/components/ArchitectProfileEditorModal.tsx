import React, { useState, useEffect } from 'react';
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
  Code2,
  Palette,
  Brain,
  Layers,
  Cpu,
  Terminal,
  Activity,
  Plus,
  Trash2,
  Check,
  Image,
  Link,
  Sliders,
  Compass
} from 'lucide-react';
import { Specialization, Architect, UserRole, PortfolioItem } from '../types';

interface ArchitectProfileEditorModalProps {
  architectToEdit?: Architect | null; // null for Create New mode
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (architect: Architect) => void;
}

const ALL_SPECIALIZATIONS: { id: Specialization; label: string; icon: any }[] = [
  { id: 'CODE', label: 'CODE', icon: Code2 },
  { id: 'AI', label: 'AI & NEURAL', icon: Brain },
  { id: 'DESIGN', label: 'DESIGN & UI', icon: Palette },
  { id: 'ARCHITECTURE', label: 'ARCHITECTURE', icon: Layers },
  { id: 'ENGINEERING', label: 'ENGINEERING', icon: Cpu },
  { id: 'RESEARCH', label: 'RESEARCH', icon: Compass },
  { id: 'INFRASTRUCTURE', label: 'INFRASTRUCTURE', icon: Terminal },
  { id: 'SECURITY', label: 'SECURITY', icon: Shield },
  { id: 'COMMUNITY', label: 'COMMUNITY', icon: Users },
  { id: 'WEB3', label: 'WEB3', icon: Globe },
  { id: 'WRITING', label: 'WRITING & RFC', icon: Edit3 },
  { id: 'MUSIC', label: 'MUSIC & AUDIO', icon: Sparkles },
  { id: 'VIDEO', label: 'VIDEO & MEDIA', icon: Sparkles },
  { id: 'MARKETING', label: 'MARKETING', icon: Zap },
  { id: 'PHILOSOPHY', label: 'PHILOSOPHY', icon: Brain },
  { id: 'EDUCATION', label: 'EDUCATION', icon: Award },
  { id: 'FINANCE', label: 'FINANCE', icon: Award },
  { id: 'CREATIVE', label: 'CREATIVE', icon: Palette },
  { id: 'OTHER', label: 'OTHER', icon: Sliders }
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80'
];

export const ArchitectProfileEditorModal: React.FC<ArchitectProfileEditorModalProps> = ({
  architectToEdit,
  isOpen,
  onClose,
  onSaved
}) => {
  const {
    architects,
    currentArchitect,
    projects,
    worlds,
    updateArchitectProfile,
    updateSpecificArchitect,
    createArchitectProfile,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const isCreateMode = !architectToEdit;

  // Form State
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [pseudonym, setPseudonym] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState<UserRole>('ARCHITECT');
  const [availability, setAvailability] = useState<'AVAILABLE' | 'BUILDING' | 'DEEP_FOCUS' | 'OFFLINE'>('AVAILABLE');
  const [specializations, setSpecializations] = useState<Specialization[]>(['CODE']);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [selectedWorlds, setSelectedWorlds] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([]);
  const [activityLevel, setActivityLevel] = useState<number>(85);
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  const [contributionScore, setContributionScore] = useState<number>(1000);
  
  // Portfolio
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [newPortfolioTitle, setNewPortfolioTitle] = useState('');
  const [newPortfolioUrl, setNewPortfolioUrl] = useState('');
  const [newPortfolioDesc, setNewPortfolioDesc] = useState('');

  // AI Profile
  const [aiArchetype, setAiArchetype] = useState('Neural Synthesist');
  const [aiModel, setAiModel] = useState('Gemini 2.5 Flash / Pro');
  const [aiCollabStyle, setAiCollabStyle] = useState('Modular architecture & asynchronous high-tempo execution.');
  const [aiPairings, setAiPairings] = useState('Core Systems Architects, UI Alchemists, Creative Lore Masters');
  const [aiResonance, setAiResonance] = useState(92);

  // Active sub-tab in editor
  const [editorTab, setEditorTab] = useState<'BASIC' | 'SPECIALIZATIONS' | 'PROJECTS_WORLDS' | 'PORTFOLIO' | 'AI_PROFILE'>('BASIC');

  // Load existing data when opened
  useEffect(() => {
    if (architectToEdit) {
      setName(architectToEdit.name || '');
      setHandle(architectToEdit.handle || '');
      setPseudonym(architectToEdit.pseudonym || '');
      setAvatar(architectToEdit.avatar || PRESET_AVATARS[0]);
      setBio(architectToEdit.bio || '');
      setRole(architectToEdit.role || 'ARCHITECT');
      setAvailability(architectToEdit.availability || 'AVAILABLE');
      setSpecializations(architectToEdit.specializations || ['CODE']);
      setSkills(architectToEdit.skills || []);
      setInterests(architectToEdit.interests || []);
      setSelectedWorlds(architectToEdit.worlds || []);
      setSelectedProjects(architectToEdit.projects || []);
      setSelectedCollaborators(architectToEdit.collaborators || []);
      setActivityLevel(architectToEdit.activityLevel || 85);
      setCompletedTasks(architectToEdit.completedTasks || 0);
      setContributionScore(architectToEdit.contributionScore || 1000);
      setPortfolio(architectToEdit.portfolio || []);
      setAiArchetype(architectToEdit.aiProfile?.archetype || 'Neural Synthesist');
      setAiModel(architectToEdit.aiProfile?.model || 'Gemini 2.5 Flash / Pro');
      setAiCollabStyle(architectToEdit.aiProfile?.collaborationStyle || '');
      setAiPairings(architectToEdit.aiProfile?.recommendedPairings || '');
      setAiResonance(architectToEdit.aiProfile?.resonance || 92);
    } else {
      // Defaults for new architect
      setName('');
      setHandle('');
      setPseudonym('');
      setAvatar(PRESET_AVATARS[0]);
      setBio('');
      setRole('ARCHITECT');
      setAvailability('AVAILABLE');
      setSpecializations(['CODE', 'AI']);
      setSkills(['TypeScript', 'React', 'AI Orchestration']);
      setInterests(['Neural Networks', 'Cyber-Architecture']);
      setSelectedWorlds(['nexus-dev-hub']);
      setSelectedProjects([]);
      setSelectedCollaborators([]);
      setActivityLevel(80);
      setCompletedTasks(0);
      setContributionScore(500);
      setPortfolio([]);
      setAiArchetype('Neural Synthesist');
      setAiModel('Gemini 2.5 Flash');
      setAiCollabStyle('Modular architecture & asynchronous high-tempo execution.');
      setAiPairings('Core Architects & Visual Engineers');
      setAiResonance(90);
    }
  }, [architectToEdit, isOpen]);

  if (!isOpen) return null;

  // Tag Handlers
  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    if ('preventDefault' in e) e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills(prev => [...prev, skillInput.trim()]);
      setSkillInput('');
      playCyberSound('click');
    }
  };

  const handleRemoveSkill = (sk: string) => {
    setSkills(prev => prev.filter(s => s !== sk));
    playCyberSound('click');
  };

  const handleAddInterest = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    if ('preventDefault' in e) e.preventDefault();
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests(prev => [...prev, interestInput.trim()]);
      setInterestInput('');
      playCyberSound('click');
    }
  };

  const handleRemoveInterest = (int: string) => {
    setInterests(prev => prev.filter(i => i !== int));
    playCyberSound('click');
  };

  const toggleSpecialization = (spec: Specialization) => {
    setSpecializations(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
    playCyberSound('click');
  };

  const toggleWorld = (wSlug: string) => {
    setSelectedWorlds(prev =>
      prev.includes(wSlug) ? prev.filter(s => s !== wSlug) : [...prev, wSlug]
    );
    playCyberSound('click');
  };

  const toggleProject = (pId: string) => {
    setSelectedProjects(prev =>
      prev.includes(pId) ? prev.filter(s => s !== pId) : [...prev, pId]
    );
    playCyberSound('click');
  };

  const toggleCollaborator = (archId: string) => {
    setSelectedCollaborators(prev =>
      prev.includes(archId) ? prev.filter(s => s !== archId) : [...prev, archId]
    );
    playCyberSound('click');
  };

  const handleAddPortfolioItem = () => {
    if (!newPortfolioTitle.trim()) return;
    const newItem: PortfolioItem = {
      title: newPortfolioTitle.trim(),
      url: newPortfolioUrl.trim() || '#',
      description: newPortfolioDesc.trim() || 'Artefakt projektu w ekosystemie Nexus',
      tags: ['Nexus']
    };
    setPortfolio(prev => [...prev, newItem]);
    setNewPortfolioTitle('');
    setNewPortfolioUrl('');
    setNewPortfolioDesc('');
    playCyberSound('success');
    triggerHaptic();
  };

  const handleRemovePortfolioItem = (index: number) => {
    setPortfolio(prev => prev.filter((_, i) => i !== index));
    playCyberSound('click');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !handle.trim()) {
      alert(language === 'PL' ? 'Proszę podać Imię oraz Pseudonim / Handle.' : 'Please enter Name and Handle.');
      return;
    }

    const cleanHandle = handle.trim().replace(/^@/, '').toLowerCase();

    const profileData: Omit<Architect, 'id'> = {
      name: name.trim(),
      handle: cleanHandle,
      pseudonym: pseudonym.trim() || cleanHandle,
      avatar: avatar || PRESET_AVATARS[0],
      bio: bio.trim() || 'Architekt w rodzinie Nexus.',
      role,
      availability,
      specializations: specializations.length > 0 ? specializations : ['CODE'],
      skills: skills.length > 0 ? skills : ['System Architecture'],
      interests: interests.length > 0 ? interests : ['Cybernetics'],
      worlds: selectedWorlds.length > 0 ? selectedWorlds : ['nexus-dev-hub'],
      projects: selectedProjects,
      collaborators: selectedCollaborators,
      activityLevel: Number(activityLevel) || 85,
      completedTasks: Number(completedTasks) || 0,
      contributionScore: Number(contributionScore) || 500,
      portfolio,
      aiProfile: {
        archetype: aiArchetype.trim() || 'Neural Synthesist',
        model: aiModel,
        collaborationStyle: aiCollabStyle.trim() || 'Async modular execution',
        recommendedPairings: aiPairings.trim() || 'Core Architects',
        resonance: Number(aiResonance) || 90
      },
      joinedEpoch: architectToEdit?.joinedEpoch || 'Epoch 1.1',
      oathSigned: true
    };

    if (isCreateMode) {
      const newId = createArchitectProfile(profileData);
      const createdObj = { ...profileData, id: newId };
      if (typeof onSaved === 'function') onSaved(createdObj);
    } else {
      if (architectToEdit.id === currentArchitect.id) {
        updateArchitectProfile(profileData);
      } else {
        updateSpecificArchitect(architectToEdit.id, profileData);
      }
      if (typeof onSaved === 'function') onSaved({ ...profileData, id: architectToEdit.id });
    }

    playCyberSound('success');
    triggerHaptic();
    if (typeof onClose === 'function') onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl bg-[#080b11] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden text-slate-100">
        
        {/* Header Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-cyan-400 to-purple-500" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-cyan-500/20 bg-[#0e1422] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cyber font-bold text-base sm:text-xl text-white tracking-wide">
                {isCreateMode
                  ? (language === 'PL' ? 'NOWY PROFIL ARCHITEKTA' : 'CREATE ARCHITECT PROFILE')
                  : (language === 'PL' ? `EDYCJA PROFILU: ${name || architectToEdit?.name}` : `EDIT PROFILE: ${name || architectToEdit?.name}`)}
              </h2>
              <p className="text-xs text-slate-400 font-mono-tech">
                {isCreateMode
                  ? 'Zarejestruj nową tożsamość twórcy w rodzinie Nexus'
                  : 'Zarządzaj swoimi kompetencjami, artefaktami i statusem'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playCyberSound('click');
              if (typeof onClose === 'function') onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-cyan-500/30 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex border-b border-cyan-500/20 bg-[#0a0f1d] px-4 sm:px-6 overflow-x-auto no-scrollbar gap-1">
          {[
            { id: 'BASIC', label: language === 'PL' ? '1. Tożsamość & Bio' : '1. Identity & Bio', icon: User },
            { id: 'SPECIALIZATIONS', label: language === 'PL' ? '2. Specjalizacje & Skille' : '2. Skills & Specializations', icon: Code2 },
            { id: 'PROJECTS_WORLDS', label: language === 'PL' ? '3. Światy & Metryki' : '3. Worlds & Metrics', icon: Globe },
            { id: 'AI_PROFILE', label: language === 'PL' ? '4. Profil AI & Bella' : '4. AI Profile', icon: Bot },
            { id: 'PORTFOLIO', label: language === 'PL' ? '5. Portfolio' : '5. Portfolio', icon: Layers }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = editorTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setEditorTab(tab.id as any);
                  playCyberSound('click');
                }}
                className={`flex items-center gap-2 py-3 px-3 border-b-2 text-xs font-cyber font-bold transition-all shrink-0 ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-h-[60vh]">
          
          {/* TAB 1: BASIC IDENTITY */}
          {editorTab === 'BASIC' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Avatar Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono-tech text-cyan-300 flex items-center gap-1.5 uppercase">
                  <Image className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Avatar Architekta (URL lub Wybierz Preset)</span>
                </label>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-500 via-cyan-400 to-purple-500 shrink-0">
                    <img
                      src={avatar || PRESET_AVATARS[0]}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover rounded-2xl bg-[#090d16]"
                    />
                  </div>
                  <input
                    type="url"
                    value={avatar}
                    onChange={e => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                {/* Preset Avatars Bar */}
                <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar">
                  {PRESET_AVATARS.map((pAv, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setAvatar(pAv);
                        playCyberSound('click');
                      }}
                      className={`w-10 h-10 rounded-xl overflow-hidden shrink-0 border-2 transition-transform hover:scale-105 ${
                        avatar === pAv ? 'border-cyan-400 scale-105 ring-2 ring-cyan-400/40' : 'border-slate-700 opacity-60'
                      }`}
                    >
                      <img src={pAv} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Handle Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono-tech text-slate-300 uppercase">Imię i Nazwisko / Real Identity *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="np. Krystian Nexus"
                    className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono-tech text-slate-300 uppercase">Pseudonim / Handle (@handle) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono-tech text-cyan-400">@</span>
                    <input
                      type="text"
                      required
                      value={handle}
                      onChange={e => setHandle(e.target.value)}
                      placeholder="nexus_prime"
                      className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl pl-8 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Pseudonym Title & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono-tech text-slate-300 uppercase">Alias Wyświetlany / Pseudonym</label>
                  <input
                    type="text"
                    value={pseudonym}
                    onChange={e => setPseudonym(e.target.value)}
                    placeholder="np. Prime Architect"
                    className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono-tech text-slate-300 uppercase">Rola w Rodzinie Nexus</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl p-3 text-xs text-amber-300 font-bold focus:outline-none"
                  >
                    <option value="FOUNDER">FOUNDER</option>
                    <option value="NEXUS ADMIN">NEXUS ADMIN</option>
                    <option value="ARCHITECT">ARCHITECT</option>
                    <option value="BUILDER">BUILDER</option>
                    <option value="MENTOR">MENTOR</option>
                    <option value="AI">AI ENTITY</option>
                    <option value="GUEST">GUEST</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono-tech text-slate-300 uppercase">Status Dostępności</label>
                  <select
                    value={availability}
                    onChange={e => setAvailability(e.target.value as any)}
                    className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl p-3 text-xs text-cyan-300 font-bold focus:outline-none"
                  >
                    <option value="AVAILABLE">● AVAILABLE (Gotowy na sprinty)</option>
                    <option value="BUILDING">● BUILDING (W trakcie budowy)</option>
                    <option value="DEEP_FOCUS">● DEEP FOCUS (Głębokie skupienie)</option>
                    <option value="OFFLINE">● OFFLINE</option>
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-slate-300 uppercase">Manifest / Bio Architekta</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Opisz swoją wizję, czym się zajmujesz w Nexusie, jakie technologie rozwijasz..."
                  className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: SPECIALIZATIONS & SKILLS */}
          {editorTab === 'SPECIALIZATIONS' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Specializations selection */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono-tech text-amber-300 flex items-center gap-1.5 uppercase">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kategorie Specjalizacji (Zaznacz wszystkie pasujące)</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {ALL_SPECIALIZATIONS.map(item => {
                    const isSelected = specializations.includes(item.id);
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleSpecialization(item.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-cyber font-bold flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                            : 'bg-[#0d131f] border-cyan-500/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.label}</span>
                        {isSelected && <Check className="w-3 h-3 ml-auto text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skills Tag Input */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono-tech text-cyan-300 flex items-center gap-1.5 uppercase">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Umiejętności Techniczne (Wpisz i naciśnij Enter)</span>
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="np. React 19, WebGL, Gemini API, Rust..."
                    className="flex-1 bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs"
                  >
                    Dodaj
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#090d16] border border-cyan-500/15 min-h-[48px]">
                  {skills.map(sk => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 text-xs font-mono-tech rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5"
                    >
                      <span>{sk}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(sk)}
                        className="text-cyan-400 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {skills.length === 0 && (
                    <span className="text-xs text-slate-500 font-mono-tech">Brak dodanych umiejętności.</span>
                  )}
                </div>
              </div>

              {/* Interests Tag Input */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono-tech text-purple-300 flex items-center gap-1.5 uppercase">
                  <Brain className="w-3.5 h-3.5 text-purple-400" />
                  <span>Zainteresowania & Obszary Badań</span>
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={e => setInterestInput(e.target.value)}
                    onKeyDown={handleAddInterest}
                    placeholder="np. Kognitywistyka, Haptyka, Cyber-Architektura..."
                    className="flex-1 bg-[#0d131f] border border-purple-500/20 focus:border-purple-400 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-cyber font-bold text-xs"
                  >
                    Dodaj
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#090d16] border border-purple-500/15 min-h-[48px]">
                  {interests.map(it => (
                    <span
                      key={it}
                      className="px-2.5 py-1 text-xs font-mono-tech rounded-lg bg-purple-950/80 text-purple-300 border border-purple-500/30 flex items-center gap-1.5"
                    >
                      <span>{it}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(it)}
                        className="text-purple-400 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS, WORLDS & METRICS */}
          {editorTab === 'PROJECTS_WORLDS' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Activity Level & Score Sliders */}
              <div className="p-4 rounded-2xl bg-[#0d131f] border border-cyan-500/20 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-tech">
                    <span className="text-cyan-300 uppercase font-bold flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <span>Poziom Aktywności (Activity Level): {activityLevel}%</span>
                    </span>
                    <span className="text-slate-400">{activityLevel > 80 ? 'Hyper-Focus' : activityLevel > 50 ? 'Active' : 'Moderate'}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={activityLevel}
                    onChange={e => setActivityLevel(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-mono-tech text-slate-400 uppercase">Ukończone Zadania (Tasks)</label>
                    <input
                      type="number"
                      min={0}
                      value={completedTasks}
                      onChange={e => setCompletedTasks(Number(e.target.value))}
                      className="w-full bg-[#090d16] border border-cyan-500/20 rounded-xl p-2.5 text-xs text-emerald-300 font-cyber font-bold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono-tech text-slate-400 uppercase">Punkty Wkładu (Contribution Score)</label>
                    <input
                      type="number"
                      min={0}
                      value={contributionScore}
                      onChange={e => setContributionScore(Number(e.target.value))}
                      className="w-full bg-[#090d16] border border-cyan-500/20 rounded-xl p-2.5 text-xs text-amber-300 font-cyber font-bold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Worlds Selection */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono-tech text-amber-300 flex items-center gap-1.5 uppercase">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>Afiliacja ze Światami Nexusa</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {worlds.map(w => {
                    const isSelected = selectedWorlds.includes(w.slug) || selectedWorlds.includes(w.id);
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => toggleWorld(w.slug)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-white'
                            : 'bg-[#0d131f] border-cyan-500/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="text-xs font-cyber font-bold">{w.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Projects Assignment */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono-tech text-cyan-300 flex items-center gap-1.5 uppercase">
                  <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Projekty Przypisane do Profilu</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {projects.map(p => {
                    const isSelected = selectedProjects.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleProject(p.id)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-white'
                            : 'bg-[#0d131f] border-cyan-500/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-cyber font-bold">{p.title}</p>
                          <span className="text-[10px] font-mono-tech text-cyan-400">{p.status}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Collaborators Selection */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono-tech text-purple-300 flex items-center gap-1.5 uppercase">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>Współpracownicy w Rodzinie</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {architects
                    .filter(a => !architectToEdit || a.id !== architectToEdit.id)
                    .map(a => {
                      const isSelected = selectedCollaborators.includes(a.id);
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => toggleCollaborator(a.id)}
                          className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                            isSelected
                              ? 'bg-purple-500/20 border-purple-400 text-white'
                              : 'bg-[#0d131f] border-cyan-500/10 text-slate-400'
                          }`}
                        >
                          <img src={a.avatar} alt={a.name} className="w-6 h-6 rounded-lg object-cover" />
                          <span className="text-xs font-mono-tech truncate">{a.name}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI PROFILE */}
          {editorTab === 'AI_PROFILE' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-4">
                <div className="flex items-center gap-2 text-purple-300">
                  <Bot className="w-5 h-5 text-purple-400" />
                  <h3 className="font-cyber font-bold text-sm uppercase">State Bella & Neural Synergy Configuration</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono-tech text-slate-300 uppercase">Archetyp Kognitywny AI</label>
                    <input
                      type="text"
                      value={aiArchetype}
                      onChange={e => setAiArchetype(e.target.value)}
                      placeholder="np. Supreme Sovereign, Visual Alchemist..."
                      className="w-full bg-[#0d131f] border border-purple-500/20 focus:border-purple-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono-tech text-slate-300 uppercase">Preferowany Model AI</label>
                    <select
                      value={aiModel}
                      onChange={e => setAiModel(e.target.value)}
                      className="w-full bg-[#0d131f] border border-purple-500/20 focus:border-purple-400 rounded-xl p-3 text-xs text-cyan-300 font-bold focus:outline-none"
                    >
                      <option value="Gemini 2.5 Flash / Pro">Gemini 2.5 Flash / Pro (Recommended)</option>
                      <option value="Claude 3.7 Sonnet">Claude 3.7 Sonnet</option>
                      <option value="DeepSeek R1 / V3">DeepSeek R1 / V3</option>
                      <option value="GPT-4o Omnimodal">GPT-4o Omnimodal</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono-tech text-slate-300 uppercase">Styl Współpracy (Collaboration Style)</label>
                  <input
                    type="text"
                    value={aiCollabStyle}
                    onChange={e => setAiCollabStyle(e.target.value)}
                    placeholder="np. Macro-architectural vision, high-agency delegation"
                    className="w-full bg-[#0d131f] border border-purple-500/20 focus:border-purple-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono-tech text-slate-300 uppercase">Rekomendowane Parowania (Pairings)</label>
                  <input
                    type="text"
                    value={aiPairings}
                    onChange={e => setAiPairings(e.target.value)}
                    placeholder="np. Systems Engineers, AI Researchers, Creative Lore Masters"
                    className="w-full bg-[#0d131f] border border-purple-500/20 focus:border-purple-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono-tech text-slate-300">
                    <span>Rezonans Kognitywny Belli: {aiResonance}%</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={100}
                    value={aiResonance}
                    onChange={e => setAiResonance(Number(e.target.value))}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PORTFOLIO */}
          {editorTab === 'PORTFOLIO' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Add New Portfolio Item */}
              <div className="p-4 rounded-2xl bg-[#0d131f] border border-cyan-500/20 space-y-3">
                <h4 className="text-xs font-cyber font-bold text-cyan-300 uppercase flex items-center gap-2">
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Dodaj Nowy Projekt do Portfolio</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newPortfolioTitle}
                    onChange={e => setNewPortfolioTitle(e.target.value)}
                    placeholder="Tytuł projektu / RFC / Artefaktu..."
                    className="bg-[#090d16] border border-cyan-500/20 focus:border-cyan-400 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newPortfolioUrl}
                    onChange={e => setNewPortfolioUrl(e.target.value)}
                    placeholder="URL (np. https://github.com/... lub #)"
                    className="bg-[#090d16] border border-cyan-500/20 focus:border-cyan-400 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <textarea
                  rows={2}
                  value={newPortfolioDesc}
                  onChange={e => setNewPortfolioDesc(e.target.value)}
                  placeholder="Krótki opis artefaktu i wkładu architektonicznego..."
                  className="w-full bg-[#090d16] border border-cyan-500/20 focus:border-cyan-400 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />

                <button
                  type="button"
                  disabled={!newPortfolioTitle.trim()}
                  onClick={handleAddPortfolioItem}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-cyber font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Dodaj do Listy Portfolio</span>
                </button>
              </div>

              {/* Existing Portfolio Items */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono-tech text-slate-400 uppercase">Aktualne Pozycje Portfolio ({portfolio.length})</h4>
                <div className="space-y-2">
                  {portfolio.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#090d16] border border-cyan-500/15 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-cyber font-bold text-xs text-white">{item.title}</span>
                          {item.url && item.url !== '#' && (
                            <span className="text-[10px] font-mono-tech text-cyan-400 truncate max-w-xs">{item.url}</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{item.description}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemovePortfolioItem(idx)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {portfolio.length === 0 && (
                    <p className="text-xs text-slate-500 font-mono-tech">Brak dodanych pozycji w portfolio.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form Action Controls */}
          <div className="pt-4 border-t border-cyan-500/20 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                playCyberSound('click');
                if (typeof onClose === 'function') onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-[#0d131f] hover:bg-slate-800 text-slate-300 font-cyber text-xs transition-colors"
            >
              {language === 'PL' ? 'Anuluj' : 'Cancel'}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-cyan-400 to-purple-500 hover:opacity-90 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              >
                <Check className="w-4 h-4" />
                <span>
                  {isCreateMode
                    ? (language === 'PL' ? 'Utwórz i Dołącz do Nexusa' : 'Create & Join Nexus')
                    : (language === 'PL' ? 'Zapisz Zmiany w Profilu' : 'Save Profile Changes')}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
