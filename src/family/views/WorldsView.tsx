import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import { DOMAIN_GATEWAY_REGISTRY } from '../domainGatewayData';
import { DomainGatewayModule } from '../components/DomainGatewayModule';
import { NewWorldModal } from '../components/NewWorldModal';
import {
  Globe,
  Layers,
  Users,
  Target,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Shield,
  Code2,
  Cpu,
  BookOpen,
  Gamepad2,
  Film,
  Lock,
  Vote,
  Compass,
  Radio,
  Network,
  CheckCircle2,
  Plus,
  FileText,
  MessageSquare,
  Send,
  UserPlus,
  Zap,
  Check
} from 'lucide-react';

export const WorldsView: React.FC = () => {
  const {
    worlds,
    architects,
    projects,
    missions,
    memoryDocs,
    feedPosts,
    currentArchitect,
    addRoadmapToWorld,
    addModuleToWorld,
    updateWorld,
    addFeedPost,
    setActiveProjectId,
    setActiveMissionId,
    setCurrentView,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const [selectedWorldSlug, setSelectedWorldSlug] = useState<string>(worlds[0]?.slug || 'nexus-ai');
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [showNewWorldModal, setShowNewWorldModal] = useState(false);

  // World Tabs & Sub-sections state
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ROADMAP' | 'DOCS' | 'FEED' | 'ARCHITECTS'>('OVERVIEW');

  // Inline forms state
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);
  const [newModName, setNewModName] = useState('');
  const [newModDesc, setNewModDesc] = useState('');
  const [newModStatus, setNewModStatus] = useState<'PLANNED' | 'DEVELOPMENT' | 'STABLE'>('DEVELOPMENT');

  const [showAddRoadmapForm, setShowAddRoadmapForm] = useState(false);
  const [newPhase, setNewPhase] = useState('');
  const [newPhaseTitle, setNewPhaseTitle] = useState('');
  const [newPhaseDesc, setNewPhaseDesc] = useState('');
  const [newPhaseStatus, setNewPhaseStatus] = useState<'DONE' | 'ACTIVE' | 'UPCOMING'>('ACTIVE');

  // World Feed post state
  const [worldPostContent, setWorldPostContent] = useState('');

  const selectedWorld = worlds.find(w => w.slug === selectedWorldSlug) || worlds[0];
  const worldProjects = projects.filter(p => p.worldSlug === selectedWorld?.slug);
  const worldMissions = missions.filter(m => m.worldSlug === selectedWorld?.slug);
  const worldDocs = memoryDocs.filter(d => d.worldSlug === selectedWorld?.slug);
  const worldPosts = feedPosts.filter(p => p.worldSlug === selectedWorld?.slug);

  const leads = architects.filter(a => selectedWorld?.leadArchitectIds?.includes(a.id));
  const members = architects.filter(a => selectedWorld?.memberIds?.includes(a.id));

  // Find domain info for selected world
  const domainInfo = DOMAIN_GATEWAY_REGISTRY.find(d => d.worldSlug === selectedWorld?.slug) || DOMAIN_GATEWAY_REGISTRY[0];

  const getWorldIcon = (slug: string) => {
    switch (slug) {
      case 'nexus-ai':
        return Cpu;
      case 'nexusbook':
        return BookOpen;
      case 'nexus-comics':
        return Film;
      case 'nexus-dev-hub':
        return Code2;
      case 'nexus-academy':
        return Compass;
      case 'nexus-games':
        return Gamepad2;
      case 'nexus-media':
        return Film;
      case 'nexus-security':
        return Lock;
      case 'nexus-dao':
        return Vote;
      default:
        return Globe;
    }
  };

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModName.trim() || !selectedWorld) return;
    addModuleToWorld(selectedWorld.slug, {
      name: newModName.trim(),
      description: newModDesc.trim() || 'Moduł subsystemu.',
      status: newModStatus
    });
    setNewModName('');
    setNewModDesc('');
    setShowAddModuleForm(false);
  };

  const handleAddRoadmapStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhaseTitle.trim() || !selectedWorld) return;
    addRoadmapToWorld(selectedWorld.slug, {
      phase: newPhase.trim() || `FAZA ${selectedWorld.roadmap.length + 1}`,
      title: newPhaseTitle.trim(),
      description: newPhaseDesc.trim() || 'Opis nowej fazy rozwoju.',
      status: newPhaseStatus
    });
    setNewPhase('');
    setNewPhaseTitle('');
    setNewPhaseDesc('');
    setShowAddRoadmapForm(false);
  };

  const handlePostToWorldFeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!worldPostContent.trim() || !selectedWorld) return;

    addFeedPost({
      authorId: currentArchitect.id,
      category: 'UPDATE',
      title: `Aktualizacja Świata [${selectedWorld.name}]`,
      content: worldPostContent.trim(),
      worldSlug: selectedWorld.slug,
      tags: ['NexusWorld', selectedWorld.slug]
    });

    setWorldPostContent('');
    playCyberSound('synapse');
    triggerHaptic();
  };

  const handleToggleLeadArchitect = (architectId: string) => {
    if (!selectedWorld) return;
    const isCurrentlyLead = selectedWorld.leadArchitectIds.includes(architectId);
    let updatedLeads = isCurrentlyLead
      ? selectedWorld.leadArchitectIds.filter(id => id !== architectId)
      : [...selectedWorld.leadArchitectIds, architectId];

    if (updatedLeads.length === 0) updatedLeads = [currentArchitect.id];

    updateWorld(selectedWorld.slug, { leadArchitectIds: updatedLeads });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Worlds Header HUD */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-950/50 via-[#0a0f1d] to-cyan-950/50 border border-purple-500/30 shadow-[0_0_35px_rgba(168,85,247,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-950/80 border-2 border-purple-400 text-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.4)]">
            <Globe className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-cyber font-bold text-xl sm:text-2xl text-white tracking-wide">
                NEXUS WORLDS ({worlds.length})
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                ECOSYSTEM CANOPY
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>nexussocial.pl & nexusfamily.online (1 ROK)</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono-tech mt-0.5">
              {language === 'PL'
                ? 'Suwerenne obszary tematyczne budowane i zarządzane dynamicznie przez Architektów'
                : 'Sovereign thematic worlds constructed dynamically by Nexus Architects'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Create New World Button */}
          <button
            onClick={() => {
              setShowNewWorldModal(true);
              playCyberSound('click');
              triggerHaptic();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-black font-cyber font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(168,85,247,0.35)]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{language === 'PL' ? 'UTWÓRZ NOWY ŚWIAT' : 'CREATE NEW WORLD'}</span>
          </button>

          {/* Domain Ingress Manager button */}
          <button
            onClick={() => {
              setShowDomainModal(true);
              playCyberSound('click');
              triggerHaptic();
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-mono-tech flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(0,255,157,0.15)]"
          >
            <Network className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'PL' ? 'Brama Domen & Canopy' : 'Domain Gateway'}</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('BELLA');
              playCyberSound('synapse');
            }}
            className="px-3.5 py-2 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono-tech flex items-center gap-2 transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>State Bella Reasoning</span>
          </button>
        </div>
      </div>

      {/* World Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {worlds.map(w => {
          const Icon = getWorldIcon(w.slug);
          const isSelected = selectedWorld?.slug === w.slug;
          const isMainDomain = w.slug === 'nexus-social';
          return (
            <button
              key={w.id}
              onClick={() => {
                setSelectedWorldSlug(w.slug);
                playCyberSound('click');
                triggerHaptic();
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-cyber transition-all shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-500/30 to-cyan-500/20 text-white border border-purple-400 font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-[#090d16] text-slate-400 hover:text-white border border-cyan-500/15 hover:bg-cyan-950/20'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-slate-500'}`} />
              <span>{w.name}</span>
              {isMainDomain && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#00ff9d]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected World Focus Container */}
      {selectedWorld && (
        <div className="space-y-6">
          {/* World Hero Card & Navigation Sub-Tabs */}
          <div className="p-6 rounded-2xl bg-[#090d16] border border-cyan-500/25 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cyber font-bold text-xl sm:text-2xl text-white">
                    {selectedWorld.name}
                  </h3>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono-tech rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                    {selectedWorld.status}
                  </span>
                </div>
                <p className="text-xs font-mono-tech text-cyan-400 mt-1">
                  {selectedWorld.tagline}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-[#0d131f] border border-cyan-500/20 text-xs font-mono-tech text-cyan-300">
                  ⚡ {selectedWorld.contributionPoints} World Contribution Pts
                </div>
              </div>
            </div>

            {/* Domain Ingress strip */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#0d1527] to-[#0b101c] border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono-tech">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-400">Brama Ingress:</span>
                <span className="text-cyan-300 font-bold">{domainInfo.canonicalUrl}</span>
              </div>

              <div className="flex items-center gap-2">
                {domainInfo.isRegistered ? (
                  <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    PROD WYKUPIONA (nexussocial.pl)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    SUBŚCIEŻKA ROUTOWANA PRZEZ NEXUSSOCIAL.PL
                  </span>
                )}
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
              {selectedWorld.description}
            </p>

            {/* World Navigation Sub-Tabs */}
            <div className="pt-2 border-t border-cyan-500/15 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'OVERVIEW', label: 'Przegląd & Moduły', icon: Layers },
                { id: 'ROADMAP', label: `Roadmap (${selectedWorld.roadmap.length})`, icon: Target },
                { id: 'DOCS', label: `Dokumentacja RFC (${worldDocs.length})`, icon: FileText },
                { id: 'FEED', label: `Activity Feed (${worldPosts.length})`, icon: MessageSquare },
                { id: 'ARCHITECTS', label: `Architekci (${leads.length + members.length})`, icon: Users }
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      playCyberSound('click');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono-tech transition-all shrink-0 ${
                      active
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                        : 'bg-[#0d131f] text-slate-400 hover:text-white border border-cyan-500/10'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-purple-400' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: OVERVIEW & MODULES */}
          {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Modules & Roadmap summary */}
              <div className="lg:col-span-8 space-y-6">
                {/* Modules Matrix */}
                <div className="p-6 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-cyber font-bold text-sm uppercase tracking-wider text-purple-300 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span>{language === 'PL' ? 'AKTYWNE MODUŁY I PODSYSTEMY' : 'SUBSYSTEM MODULES'} ({selectedWorld.modules.length})</span>
                    </h4>

                    <button
                      onClick={() => setShowAddModuleForm(!showAddModuleForm)}
                      className="px-3 py-1 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/30 text-purple-300 text-xs font-mono-tech flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'PL' ? 'Dodaj Moduł' : 'Add Module'}</span>
                    </button>
                  </div>

                  {/* Add Module Inline Form */}
                  {showAddModuleForm && (
                    <form onSubmit={handleAddModule} className="p-4 rounded-xl bg-[#0d131f] border border-purple-500/30 space-y-3 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          value={newModName}
                          onChange={e => setNewModName(e.target.value)}
                          placeholder="Nazwa modułu..."
                          className="bg-[#080b12] border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                        />
                        <select
                          value={newModStatus}
                          onChange={e => setNewModStatus(e.target.value as any)}
                          className="bg-[#080b12] border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono-tech"
                        >
                          <option value="PLANNED">PLANNED</option>
                          <option value="DEVELOPMENT">DEVELOPMENT</option>
                          <option value="STABLE">STABLE</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={newModDesc}
                        onChange={e => setNewModDesc(e.target.value)}
                        placeholder="Opis odpowiedzialności modułu..."
                        className="w-full bg-[#080b12] border border-purple-500/20 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddModuleForm(false)}
                          className="px-3 py-1 rounded-lg border border-slate-700 text-slate-400 text-xs font-mono-tech"
                        >
                          Anuluj
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-cyber font-bold text-xs"
                        >
                          Zapisz Moduł
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedWorld.modules.map(mod => (
                      <div
                        key={mod.id}
                        className="p-3.5 rounded-xl bg-[#0d131f] border border-cyan-500/15 hover:border-cyan-500/40 space-y-1.5 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-cyber font-bold text-xs text-white">{mod.name}</span>
                          <span className={`px-1.5 py-0.5 text-[9px] font-mono-tech rounded border ${
                            mod.status === 'STABLE'
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                              : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
                          }`}>
                            {mod.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans leading-snug">
                          {mod.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Projects & Missions */}
              <div className="lg:col-span-4 space-y-6">
                {/* Associated Projects */}
                <div className="p-5 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-cyber font-bold text-xs uppercase tracking-wider text-purple-300">
                      POWIĄZANE PROJEKTY ({worldProjects.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {worldProjects.length === 0 ? (
                      <p className="text-xs font-mono-tech text-slate-500 py-2">Brak bezpośrednio przypisanych projektów.</p>
                    ) : (
                      worldProjects.map(proj => (
                        <div
                          key={proj.id}
                          onClick={() => {
                            setActiveProjectId(proj.id);
                            playCyberSound('click');
                          }}
                          className="p-3 rounded-xl bg-[#0d131f] border border-purple-500/15 hover:border-purple-500/40 cursor-pointer transition-all space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-cyber font-bold text-xs text-white">{proj.title}</span>
                            <span className="text-[9px] font-mono-tech text-purple-400">{proj.status}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{proj.tagline}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* World Missions */}
                <div className="p-5 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-3">
                  <h4 className="font-cyber font-bold text-xs uppercase tracking-wider text-emerald-300">
                    OTWARTE MISJE W ŚWIECIE ({worldMissions.length})
                  </h4>
                  <div className="space-y-2">
                    {worldMissions.length === 0 ? (
                      <p className="text-xs font-mono-tech text-slate-500 py-2">Brak otwartych misji w tym świecie.</p>
                    ) : (
                      worldMissions.map(mis => (
                        <div
                          key={mis.id}
                          onClick={() => {
                            setActiveMissionId(mis.id);
                            playCyberSound('click');
                          }}
                          className="p-3 rounded-xl bg-[#0d131f] border border-emerald-500/15 hover:border-emerald-500/40 cursor-pointer transition-all space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-cyber font-bold text-xs text-white truncate">{mis.title}</span>
                            <span className="text-[10px] font-mono-tech text-emerald-400">+{mis.rewardScore} pts</span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono-tech">Diff: {mis.difficulty}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROADMAP */}
          {activeTab === 'ROADMAP' && (
            <div className="p-6 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-cyber font-bold text-base text-white">
                    STRATEGICZNY ROADMAP ŚWIATA
                  </h4>
                  <p className="text-xs font-mono-tech text-slate-400">
                    Kroki milowe ewolucji obszaru {selectedWorld.name}
                  </p>
                </div>

                <button
                  onClick={() => setShowAddRoadmapForm(!showAddRoadmapForm)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 text-xs font-mono-tech flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'PL' ? 'Dodaj Kamień Milowy' : 'Add Roadmap Phase'}</span>
                </button>
              </div>

              {/* Add Roadmap Step Inline Form */}
              {showAddRoadmapForm && (
                <form onSubmit={handleAddRoadmapStep} className="p-4 rounded-xl bg-[#0d131f] border border-cyan-500/30 space-y-3 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={newPhase}
                      onChange={e => setNewPhase(e.target.value)}
                      placeholder="Np. FAZA III"
                      className="bg-[#080b12] border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs text-cyan-300 focus:outline-none font-mono-tech"
                    />
                    <input
                      type="text"
                      required
                      value={newPhaseTitle}
                      onChange={e => setNewPhaseTitle(e.target.value)}
                      placeholder="Tytuł kamienia milowego..."
                      className="bg-[#080b12] border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-cyber font-bold"
                    />
                    <select
                      value={newPhaseStatus}
                      onChange={e => setNewPhaseStatus(e.target.value as any)}
                      className="bg-[#080b12] border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono-tech"
                    >
                      <option value="UPCOMING">UPCOMING</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    value={newPhaseDesc}
                    onChange={e => setNewPhaseDesc(e.target.value)}
                    placeholder="Opis rezultatu i alokacji zasobów w tej fazie..."
                    className="w-full bg-[#080b12] border border-cyan-500/20 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddRoadmapForm(false)}
                      className="px-3 py-1 rounded-lg border border-slate-700 text-slate-400 text-xs font-mono-tech"
                    >
                      Anuluj
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs"
                    >
                      Dodaj Faza
                    </button>
                  </div>
                </form>
              )}

              {/* Roadmap Timeline List */}
              <div className="space-y-3">
                {selectedWorld.roadmap.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#0c101a] border border-cyan-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="font-mono-tech text-[10px] font-bold px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30 shrink-0">
                        {step.phase}
                      </span>
                      <div className="space-y-0.5">
                        <p className="font-cyber font-bold text-sm text-white">{step.title}</p>
                        <p className="text-xs text-slate-300 font-sans">{step.description}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono-tech px-2.5 py-1 rounded-lg border shrink-0 ${
                      step.status === 'DONE'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                        : step.status === 'ACTIVE'
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
                        : 'bg-slate-900 text-slate-500 border-slate-700'
                    }`}>
                      ● {step.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTATION (RFCs) */}
          {activeTab === 'DOCS' && (
            <div className="p-6 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-cyber font-bold text-base text-white">
                    DOKUMENTACJA I PROTORY RFC ŚWIATA ({worldDocs.length})
                  </h4>
                  <p className="text-xs font-mono-tech text-slate-400">
                    Baza wiedzy i standardy architektoniczne powiązane ze światem {selectedWorld.name}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCurrentView('MEMORY');
                    playCyberSound('click');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/30 text-purple-300 text-xs font-mono-tech flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Otwórz Nexus Memory</span>
                </button>
              </div>

              {worldDocs.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#0c101a] border border-slate-800 text-center space-y-2">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-mono-tech text-slate-400">
                    Brak opublikowanych dokumentów RFC przypisanych bezpośrednio do tego Świata.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Możesz dodać dokument w sekcji Nexus Memory z powiązaniem do tagu <code className="text-purple-300">{selectedWorld.slug}</code>.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {worldDocs.map(doc => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl bg-[#0c101a] border border-purple-500/20 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                          {doc.category}
                        </span>
                        <span className="text-[10px] font-mono-tech text-slate-500">{doc.version}</span>
                      </div>
                      <h5 className="font-cyber font-bold text-sm text-white">{doc.title}</h5>
                      <p className="text-xs text-slate-300 line-clamp-2">{doc.summary}</p>
                      <div className="pt-2 border-t border-purple-500/10 flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
                        <span>Tagi: {doc.tags.join(', ')}</span>
                        {doc.verifiedByBella && (
                          <span className="text-cyan-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            <span>Bella Verified</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ACTIVITY FEED */}
          {activeTab === 'FEED' && (
            <div className="p-6 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-cyber font-bold text-base text-white">
                    STRUMIEŃ AKTYWNOŚCI ŚWIATA ({worldPosts.length})
                  </h4>
                  <p className="text-xs font-mono-tech text-slate-400">
                    Wpisy, aktualizacje i posty opublikowane w kontekście {selectedWorld.name}
                  </p>
                </div>
              </div>

              {/* Quick Post Input */}
              <form onSubmit={handlePostToWorldFeed} className="p-4 rounded-2xl bg-[#0c101a] border border-purple-500/25 space-y-3">
                <span className="text-xs font-mono-tech text-purple-300 font-bold uppercase flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                  <span>Opublikuj aktualizację w tym Świecie</span>
                </span>
                <textarea
                  rows={2}
                  required
                  value={worldPostContent}
                  onChange={e => setWorldPostContent(e.target.value)}
                  placeholder={`Podziel się postępem lub nowością ze świata ${selectedWorld.name}...`}
                  className="w-full bg-[#080b12] border border-purple-500/30 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 text-black font-cyber font-bold text-xs flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Opublikuj Update</span>
                  </button>
                </div>
              </form>

              {/* World Feed Posts List */}
              <div className="space-y-4">
                {worldPosts.length === 0 ? (
                  <p className="text-xs font-mono-tech text-slate-500 py-4 text-center">
                    Brak dedykowanych wpisów dla tego świata. Bądź pierwszym, który opublikuje aktualizację!
                  </p>
                ) : (
                  worldPosts.map(post => {
                    const author = architects.find(a => a.id === post.authorId) || architects[0];
                    return (
                      <div
                        key={post.id}
                        className="p-4 rounded-2xl bg-[#0c101a] border border-cyan-500/15 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <p className="font-cyber font-bold text-xs text-white">{author.name}</p>
                              <p className="text-[10px] font-mono-tech text-cyan-400">{post.timestamp}</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                            {post.category}
                          </span>
                        </div>
                        <h5 className="font-cyber font-bold text-sm text-slate-100">{post.title}</h5>
                        <p className="text-xs text-slate-300 leading-relaxed">{post.content}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ARCHITECTS */}
          {activeTab === 'ARCHITECTS' && (
            <div className="p-6 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-cyber font-bold text-base text-white">
                    ZESPÓŁ I LIDERZY ARCHITEKTURY
                  </h4>
                  <p className="text-xs font-mono-tech text-slate-400">
                    Osoby odpowiedzialne za ewolucję obszaru {selectedWorld.name}
                  </p>
                </div>
              </div>

              {/* Lead Architects */}
              <div className="space-y-3">
                <span className="text-xs font-mono-tech text-purple-300 font-bold uppercase block">
                  Liderzy Świata (Lead Architects)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {architects.map(arch => {
                    const isLead = selectedWorld.leadArchitectIds.includes(arch.id);
                    return (
                      <div
                        key={arch.id}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                          isLead
                            ? 'bg-purple-950/40 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                            : 'bg-[#0c101a] border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={arch.avatar} alt={arch.name} className="w-10 h-10 rounded-xl object-cover border border-purple-400/40" />
                          <div>
                            <p className="font-cyber font-bold text-xs text-white">{arch.name}</p>
                            <p className="text-[10px] font-mono-tech text-cyan-400">{arch.role}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleLeadArchitect(arch.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-tech border transition-colors ${
                            isLead
                              ? 'bg-purple-500/20 text-purple-300 border-purple-400'
                              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          {isLead ? 'LEAD ●' : '+ Wyznacz'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Domain Gateway Inspector Modal */}
      {showDomainModal && (
        <div
          onClick={() => setShowDomainModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#080b11] border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-y-auto text-slate-100"
          >
            <div className="p-4 sm:p-6 flex items-center justify-between border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <span className="font-cyber font-bold text-base text-white">
                  INFRASTRUKTURA DOMENOWA & BRAMA INGRESS
                </span>
              </div>
              <button
                onClick={() => setShowDomainModal(false)}
                className="px-3 py-1 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-xs font-mono-tech text-cyan-300"
              >
                ESC ✕
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <DomainGatewayModule onClose={() => setShowDomainModal(false)} />
            </div>
          </div>
        </div>
      )}

      {/* New World Modal */}
      <NewWorldModal
        isOpen={showNewWorldModal}
        onClose={() => setShowNewWorldModal(false)}
      />
    </div>
  );
};
