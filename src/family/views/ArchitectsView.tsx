import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Users,
  Search,
  Filter,
  Shield,
  Award,
  Zap,
  ExternalLink,
  Sparkles,
  Compass,
  ArrowRight,
  Bot,
  UserPlus,
  Edit3,
  Check,
  Activity,
  Code2,
  FolderGit2,
  Layers
} from 'lucide-react';
import { Specialization, Architect } from '../types';
import { ArchitectMatchSection } from '../components/ArchitectMatchSection';
import { ArchitectProfileModal } from '../components/ArchitectProfileModal';
import { ArchitectProfileEditorModal } from '../components/ArchitectProfileEditorModal';

const ALL_SPECS: Specialization[] = [
  'CODE',
  'AI',
  'DESIGN',
  'ARCHITECTURE',
  'ENGINEERING',
  'RESEARCH',
  'INFRASTRUCTURE',
  'SECURITY',
  'WEB3',
  'WRITING',
  'COMMUNITY',
  'CREATIVE'
];

export const ArchitectsView: React.FC = () => {
  const {
    architects,
    currentArchitect,
    updateArchitectProfile,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const [activeTab, setActiveTab] = useState<'DIRECTORY' | 'MATCHMAKER'>('DIRECTORY');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpec, setSelectedSpec] = useState<string>('ALL');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('ALL');

  // Modals
  const [detailArchitectId, setDetailArchitectId] = useState<string | null>(null);
  const [editingArchitect, setEditingArchitect] = useState<Architect | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const filteredArchitects = architects.filter(a => {
    const matchesSearch =
      (a.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.handle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.pseudonym || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.bio || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.skills || []).some(s => (s || '').toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSpec = selectedSpec === 'ALL' || (a.specializations || []).includes(selectedSpec as any);
    const matchesAvailability = selectedAvailability === 'ALL' || a.availability === selectedAvailability;
    
    return matchesSearch && matchesSpec && matchesAvailability;
  });

  const handleOpenDetail = (archId: string) => {
    setDetailArchitectId(archId);
    playCyberSound('node');
    triggerHaptic();
  };

  const handleOpenCreateNew = () => {
    setEditingArchitect(null);
    setIsEditorOpen(true);
    playCyberSound('click');
    triggerHaptic();
  };

  const handleOpenEdit = (arch: Architect) => {
    setEditingArchitect(arch);
    setIsEditorOpen(true);
    playCyberSound('click');
    triggerHaptic();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top View Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#090d16] border border-cyan-500/20 max-w-md">
          <button
            onClick={() => {
              setActiveTab('DIRECTORY');
              playCyberSound('click');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-cyber font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'DIRECTORY'
                ? 'bg-gradient-to-r from-amber-500 to-cyan-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{language === 'PL' ? 'Katalog Architektów' : 'Directory'} ({architects.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('MATCHMAKER');
              playCyberSound('synapse');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-cyber font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'MATCHMAKER'
                ? 'bg-gradient-to-r from-amber-500 to-cyan-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'PL' ? 'Dopasowania Belli' : 'AI Matchmaker'}</span>
          </button>
        </div>

        {/* Create Profile / Join Family Button */}
        <button
          onClick={handleOpenCreateNew}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-95 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]"
        >
          <UserPlus className="w-4 h-4" />
          <span>{language === 'PL' ? 'Zarejestruj Nowy Profil' : 'Create Architect Profile'}</span>
        </button>
      </div>

      {activeTab === 'MATCHMAKER' ? (
        <ArchitectMatchSection />
      ) : (
        <div className="space-y-6">
          {/* MY CURRENT PROFILE HERO CARD */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0c1220] via-[#0e1628] to-[#120e24] border border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Avatar with Cyber Ring */}
                <div
                  onClick={() => handleOpenDetail(currentArchitect.id)}
                  className="relative group cursor-pointer shrink-0"
                  title="Click to view full profile"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-500 via-cyan-400 to-purple-500 shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform">
                    <img
                      src={currentArchitect.avatar}
                      alt={currentArchitect.name}
                      className="w-full h-full object-cover rounded-2xl bg-[#090d16]"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#080b11] shadow-[0_0_8px_#34d399]" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      TWOJA TOŻSAMOŚĆ (YOU)
                    </span>
                    <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40">
                      {currentArchitect.role}
                    </span>
                    <span className="text-[10px] font-mono-tech text-emerald-400">
                      ● {currentArchitect.availability}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="font-cyber font-bold text-xl sm:text-2xl text-white">
                      {currentArchitect.name}
                    </h3>
                    <span className="text-xs font-mono-tech text-cyan-400">@{currentArchitect.handle}</span>
                    {currentArchitect.pseudonym && (
                      <span className="text-xs text-amber-300 font-mono-tech">
                        &quot;{currentArchitect.pseudonym}&quot;
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 font-sans max-w-2xl line-clamp-2 leading-relaxed">
                    {currentArchitect.bio}
                  </p>

                  {/* Specializations list */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(currentArchitect.specializations || []).map(spec => (
                      <span
                        key={spec}
                        className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-purple-950/70 text-purple-300 border border-purple-500/30"
                      >
                        {spec}
                      </span>
                    ))}
                    {(currentArchitect.skills || []).slice(0, 3).map(sk => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-cyan-950/70 text-cyan-300 border border-cyan-500/30"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons & Quick Stats */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
                <div className="p-3 rounded-2xl bg-[#080b11]/80 border border-cyan-500/20 text-center space-y-0.5">
                  <p className="text-[9px] font-mono-tech text-slate-400 uppercase">CONTRIBUTION</p>
                  <p className="font-cyber font-bold text-base text-amber-300">⚡ {currentArchitect.contributionScore}</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#080b11]/80 border border-cyan-500/20 text-center space-y-0.5">
                  <p className="text-[9px] font-mono-tech text-slate-400 uppercase">ACTIVITY PULSE</p>
                  <p className="font-cyber font-bold text-base text-cyan-300">{currentArchitect.activityLevel || 90}%</p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleOpenDetail(currentArchitect.id)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                  >
                    <span>{language === 'PL' ? 'Otwórz Profil' : 'View Full Profile'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(currentArchitect)}
                    className="px-4 py-2 rounded-xl bg-[#090d16] hover:bg-slate-800 border border-cyan-500/30 text-slate-200 font-cyber font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'PL' ? 'Edytuj Mój Profil' : 'Edit Profile'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filter, Search & Availability Matrix */}
          <div className="p-4 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={language === 'PL' ? 'Szukaj Architekta (imię, handle, skill, bio)...' : 'Search Architect by name, handle, skill, bio...'}
                  className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Availability Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
                <span className="text-[10px] font-mono-tech text-slate-500 uppercase mr-1">Status:</span>
                {['ALL', 'AVAILABLE', 'BUILDING', 'DEEP_FOCUS'].map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      setSelectedAvailability(st);
                      playCyberSound('click');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-tech transition-all shrink-0 ${
                      selectedAvailability === st
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold'
                        : 'bg-[#0d131f] text-slate-400 border border-cyan-500/10 hover:text-white'
                    }`}
                  >
                    {st === 'ALL' ? 'ALL STATUS' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Specializations Filter Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-cyan-500/10">
              <span className="text-[10px] font-mono-tech text-slate-500 uppercase mr-1">Specjalizacja:</span>
              <button
                onClick={() => {
                  setSelectedSpec('ALL');
                  playCyberSound('click');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-mono-tech transition-all shrink-0 ${
                  selectedSpec === 'ALL'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400 font-bold'
                    : 'bg-[#0d131f] text-slate-400 border border-cyan-500/10 hover:text-white'
                }`}
              >
                WSZYSTKIE ({architects.length})
              </button>
              {ALL_SPECS.map(sp => (
                <button
                  key={sp}
                  onClick={() => {
                    setSelectedSpec(sp);
                    playCyberSound('click');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-mono-tech transition-all shrink-0 ${
                    selectedSpec === sp
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400 font-bold'
                      : 'bg-[#0d131f] text-slate-400 border border-cyan-500/10 hover:text-white'
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          {/* Architects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArchitects.map(arch => {
              const isMe = arch.id === currentArchitect.id;
              return (
                <div
                  key={arch.id}
                  onClick={() => handleOpenDetail(arch.id)}
                  className={`p-5 rounded-2xl bg-[#090d16] border transition-all flex flex-col justify-between space-y-4 shadow-lg cursor-pointer hover:scale-[1.01] ${
                    isMe ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]' : 'border-cyan-500/20 hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Profile Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={arch.avatar}
                            alt={arch.name}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-cyan-400"
                          />
                          <span
                            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-[#080b11] ${
                              arch.availability === 'AVAILABLE'
                                ? 'bg-emerald-400'
                                : arch.availability === 'BUILDING'
                                ? 'bg-cyan-400'
                                : arch.availability === 'DEEP_FOCUS'
                                ? 'bg-purple-400'
                                : 'bg-slate-500'
                            }`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-cyber font-bold text-sm text-white">{arch.name}</h3>
                            {isMe && <span className="px-1.5 py-0.2 text-[8px] font-mono-tech rounded bg-cyan-500/20 text-cyan-300">YOU</span>}
                          </div>
                          <p className="text-[11px] font-mono-tech text-cyan-400">@{arch.handle}</p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-amber-950/70 text-amber-300 border border-amber-500/30">
                        {arch.role}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed">
                      {arch.bio}
                    </p>

                    {/* Specializations & AI Archetype */}
                    <div className="p-3 rounded-xl bg-[#0d131f] border border-cyan-500/10 space-y-1.5 text-xs font-mono-tech">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="flex items-center gap-1 text-[10px]">
                          <Bot className="w-3 h-3 text-cyan-400" /> Archetype:
                        </span>
                        <span className="text-cyan-300 text-[11px] font-semibold truncate max-w-[150px]">
                          {arch.aiProfile?.archetype || 'Neural Synthesist'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-[10px]">CONTRIBUTION:</span>
                        <span className="text-amber-400 font-bold">⚡ {arch.contributionScore} pts</span>
                      </div>
                    </div>

                    {/* Skills Badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(arch.specializations || []).slice(0, 2).map(sp => (
                        <span
                          key={sp}
                          className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-purple-950/60 text-purple-300 border border-purple-500/30"
                        >
                          {sp}
                        </span>
                      ))}
                      {(arch.skills || []).slice(0, 3).map(sk => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-[#0b0f18] border border-cyan-500/15 text-slate-300"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-cyan-500/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono-tech text-slate-500 flex items-center gap-1">
                      <FolderGit2 className="w-3 h-3" />
                      <span>{(arch.projects || []).length} Projects</span>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(arch.id);
                      }}
                      className="flex items-center gap-1 text-xs font-cyber text-cyan-400 hover:text-white"
                    >
                      <span>{language === 'PL' ? 'Podgląd' : 'View Profile'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredArchitects.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-[#090d16] border border-cyan-500/10 space-y-3">
              <Users className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-cyber text-slate-400">Nie znaleziono architektów spełniających podane kryteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSpec('ALL');
                  setSelectedAvailability('ALL');
                }}
                className="px-4 py-2 rounded-xl bg-[#0d131f] border border-cyan-500/20 text-cyan-300 text-xs font-mono-tech"
              >
                Wyczyść Filtry
              </button>
            </div>
          )}
        </div>
      )}

      {/* Detail Profile Modal */}
      <ArchitectProfileModal
        architectId={detailArchitectId}
        isOpen={Boolean(detailArchitectId)}
        onClose={() => setDetailArchitectId(null)}
        onEdit={(arch) => {
          setDetailArchitectId(null);
          handleOpenEdit(arch);
        }}
      />

      {/* Profile Editor Modal */}
      <ArchitectProfileEditorModal
        architectToEdit={editingArchitect}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSaved={(savedArch) => {
          setDetailArchitectId(savedArch.id);
        }}
      />
    </div>
  );
};
