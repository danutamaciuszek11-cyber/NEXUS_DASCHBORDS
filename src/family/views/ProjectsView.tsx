import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import { eventBus } from '../../core/event-bus';
import {
  FolderGit2,
  Plus,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Cpu,
  Layers,
  Globe,
  Github,
  CheckSquare,
  Square,
  Archive,
  Trash2,
  RefreshCw,
  AlertTriangle,
  X,
  ChevronDown,
  Check,
  RotateCcw,
  CheckCheck
} from 'lucide-react';
import { ProjectStatus } from '../types';

export const ProjectsView: React.FC<{ onOpenNewProjectModal?: () => void }> = ({
  onOpenNewProjectModal = () => {}
}) => {
  const {
    projects,
    worlds,
    architects,
    setActiveProjectId,
    setCurrentView,
    playCyberSound,
    triggerHaptic,
    language,
    githubState,
    openGitHubModal,
    deleteProjects,
    archiveProjects,
    batchUpdateProjectStatus
  } = useNexus();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorldFilter, setSelectedWorldFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [showStatusMenu, setShowStatusMenu] = useState<boolean>(false);

  const statuses: ProjectStatus[] = ['IDEA', 'PROTOTYPE', 'BUILDING', 'BETA', 'LIVE', 'PAUSED', 'ARCHIVED'];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tagline || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWorld = selectedWorldFilter === 'ALL' || p.worldSlug === selectedWorldFilter;
    const matchesStatus = selectedStatusFilter === 'ALL'
      ? (showArchived ? true : (p.status !== 'ARCHIVED' && !p.isArchived))
      : (selectedStatusFilter === 'ARCHIVED' ? (p.status === 'ARCHIVED' || p.isArchived) : p.status === selectedStatusFilter);
    return matchesSearch && matchesWorld && matchesStatus;
  });

  const archivedCount = projects.filter(p => p.status === 'ARCHIVED' || p.isArchived).length;
  const allVisibleSelected = filteredProjects.length > 0 && filteredProjects.every(p => selectedProjectIds.includes(p.id));
  const someVisibleSelected = filteredProjects.some(p => selectedProjectIds.includes(p.id)) && !allVisibleSelected;

  const toggleSelectProject = (id: string) => {
    setSelectedProjectIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      const visibleIds = new Set(filteredProjects.map(p => p.id));
      setSelectedProjectIds(prev => prev.filter(id => !visibleIds.has(id)));
    } else {
      const combined = Array.from(new Set([...selectedProjectIds, ...filteredProjects.map(p => p.id)]));
      setSelectedProjectIds(combined);
    }
  };

  const selectedProjects = projects.filter(p => selectedProjectIds.includes(p.id));
  const allSelectedArchived = selectedProjects.length > 0 && selectedProjects.every(p => p.status === 'ARCHIVED' || p.isArchived);

  const handleBulkArchive = () => {
    archiveProjects(selectedProjectIds, !allSelectedArchived);
    setSelectedProjectIds([]);
  };

  const handleBulkStatusChange = (newStatus: ProjectStatus) => {
    batchUpdateProjectStatus(selectedProjectIds, newStatus);
    setShowStatusMenu(false);
  };

  const handleBulkDelete = () => {
    handleBulkDeleteConfirm();
  };

  const handleBulkDeleteConfirm = () => {
    deleteProjects(selectedProjectIds);
    setSelectedProjectIds([]);
    setShowDeleteConfirm(false);
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'IDEA': return 'bg-cyan-950/70 text-cyan-300 border-cyan-500/30';
      case 'PROTOTYPE': return 'bg-blue-950/70 text-blue-300 border-blue-500/30';
      case 'BUILDING': return 'bg-amber-950/70 text-amber-300 border-amber-500/30';
      case 'BETA': return 'bg-purple-950/70 text-purple-300 border-purple-500/30';
      case 'LIVE': return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30';
      case 'PAUSED': return 'bg-slate-800 text-slate-300 border-slate-600';
      case 'ARCHIVED': return 'bg-zinc-800/80 text-zinc-400 border-zinc-600/40';
      default: return 'bg-purple-950/70 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      {/* Header HUD */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#0a0f1d] to-cyan-950/40 border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-950/80 border-2 border-purple-400 text-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.4)]">
            <FolderGit2 className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-cyber font-bold text-xl sm:text-2xl text-white tracking-wide">
                PROJECT HUB
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                ACTIVE REPOSITORIES
              </span>
              {selectedProjectIds.length > 0 && (
                <span className="px-2.5 py-0.5 text-[10px] font-mono-tech rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400 animate-pulse">
                  {selectedProjectIds.length} {language === 'PL' ? 'zaznaczonych' : 'selected'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 font-mono-tech mt-0.5">
              {language === 'PL'
                ? 'Centralny rejestr inicjatyw, modułów i architektur rozwijanych przez Rodzinę'
                : 'Central registry of initiatives, modules and architectures developed by the Family'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              openGitHubModal();
              playCyberSound('click');
              triggerHaptic();
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-cyber font-bold transition-all cursor-pointer ${
              githubState.isConnected
                ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                : 'bg-[#090d16] border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300'
            }`}
          >
            <Github className="w-4 h-4 text-cyan-400" />
            <span>
              {githubState.isConnected
                ? (githubState.user?.login ? `@${githubState.user.login} (${githubState.repos.length})` : 'GitHub Połączony')
                : (language === 'PL' ? 'Synapsa GitHub' : 'GitHub Synapse')}
            </span>
          </button>

          <button
            onClick={() => {
              if (typeof onOpenNewProjectModal === 'function') {
                onOpenNewProjectModal();
              }
              playCyberSound('beep');
              triggerHaptic();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'PL' ? 'Zgłoś Nowy Projekt' : 'Propose New Project'}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#090d16] border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'PL' ? 'Filtruj projekty po nazwie lub tagu...' : 'Filter projects by title or keywords...'}
            className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Quick Select All Button */}
          <button
            onClick={() => {
              toggleSelectAllVisible();
              playCyberSound('click');
              triggerHaptic();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono-tech transition-all cursor-pointer ${
              allVisibleSelected
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                : someVisibleSelected
                ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400'
                : 'bg-[#0d131f] border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
            }`}
            title={language === 'PL' ? 'Zaznacz lub odznacz wszystkie widoczne projekty' : 'Select or deselect all visible projects'}
          >
            {allVisibleSelected ? (
              <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
            ) : someVisibleSelected ? (
              <CheckSquare className="w-3.5 h-3.5 text-cyan-400 opacity-60" />
            ) : (
              <Square className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>
              {allVisibleSelected
                ? (language === 'PL' ? 'Odznacz widoczne' : 'Deselect visible')
                : (language === 'PL' ? `Zaznacz (${filteredProjects.length})` : `Select all (${filteredProjects.length})`)}
            </span>
          </button>

          {/* Show Archived Toggle */}
          <button
            onClick={() => {
              setShowArchived(!showArchived);
              playCyberSound('click');
              triggerHaptic();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono-tech transition-all cursor-pointer ${
              showArchived
                ? 'bg-amber-950/70 border-amber-500/50 text-amber-300'
                : 'bg-[#0d131f] border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'PL' ? 'Archiwum' : 'Archived'} {archivedCount > 0 ? `(${archivedCount})` : ''}
            </span>
          </button>

          {/* World Filter */}
          <select
            value={selectedWorldFilter}
            onChange={e => setSelectedWorldFilter(e.target.value)}
            className="bg-[#0d131f] border border-cyan-500/20 text-xs font-mono-tech text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="ALL">{language === 'PL' ? 'Wszystkie światy' : 'All Worlds'}</option>
            {worlds.map(w => (
              <option key={w.id} value={w.slug}>{w.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            className="bg-[#0d131f] border border-cyan-500/20 text-xs font-mono-tech text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="ALL">{language === 'PL' ? 'Wszystkie statusy' : 'All Statuses'}</option>
            {statuses.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(proj => {
          const owner = architects.find(a => a.id === proj.ownerId) || architects[0];
          const world = worlds.find(w => w.slug === proj.worldSlug);
          const completedTasks = proj.tasks.filter(t => t.status === 'DONE').length;
          const totalTasks = proj.tasks.length;
          const isSelected = selectedProjectIds.includes(proj.id);
          const isArchived = proj.isArchived || proj.status === 'ARCHIVED';

          return (
            <div
              key={proj.id}
              onClick={() => {
                setActiveProjectId(proj.id);
                playCyberSound('click');
                triggerHaptic();
              }}
              className={`relative p-5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between space-y-4 group shadow-lg ${
                isSelected
                  ? 'bg-cyan-950/25 border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.25)] ring-1 ring-cyan-400/50'
                  : isArchived
                  ? 'bg-[#080b12] border border-zinc-700/50 opacity-80 hover:opacity-100 hover:border-zinc-500'
                  : 'bg-[#090d16] border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-cyan-950/10'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  {/* Select Checkbox & Title */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectProject(proj.id);
                        playCyberSound('click');
                        triggerHaptic();
                      }}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_12px_rgba(0,240,255,0.5)]'
                          : 'border-slate-600 hover:border-cyan-400 bg-[#0d131f] text-transparent hover:text-cyan-400/40'
                      }`}
                      title={isSelected ? 'Odznacz' : 'Zaznacz'}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-cyber font-bold text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
                        {proj.title}
                      </h3>
                      <p className="text-[11px] font-mono-tech text-cyan-400/80 truncate">
                        {world?.name || proj.worldSlug}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isArchived && (
                      <span className="px-1.5 py-0.5 text-[8px] font-mono-tech rounded bg-amber-950/80 text-amber-300 border border-amber-500/40">
                        ARCHIVED
                      </span>
                    )}
                    <span className={`px-2 py-0.5 text-[9px] font-mono-tech rounded border ${getStatusColor(proj.status)}`}>
                      {proj.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed">
                  {proj.tagline}
                </p>

                {/* Progress / Tasks */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
                    <span>TASKS PROGRESS</span>
                    <span className="text-cyan-300">{completedTasks}/{totalTasks} ({totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#0d131f] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${totalTasks ? (completedTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Meta & Lead */}
              <div className="pt-3 border-t border-cyan-500/10 flex items-center justify-between text-xs font-mono-tech">
                <div className="flex items-center gap-2">
                  <img src={owner.avatar} alt={owner.name} className="w-5 h-5 rounded-full object-cover border border-cyan-500/30" />
                  <span className="text-slate-300 text-[11px] truncate max-w-[100px]">{owner.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  {proj.id === 'base-dev-tools' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        eventBus.emit('navigate', { view: 'devtools' });
                      }}
                      className="px-4 py-1.5 rounded bg-[#A855F7]/10 hover:bg-[#A855F7]/20 border border-[#A855F7]/30 text-[#A855F7] text-xs font-mono-tech uppercase cursor-pointer transition-all"
                    >
                      URUCHOM KONTENER
                    </button>
                  )}
                  <span className="text-cyan-400 font-bold">+{proj.contributionBounty} pts</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-3">
          <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-cyber font-bold text-base text-slate-300">
            {language === 'PL' ? 'Brak projektów spełniających kryteria' : 'No projects match criteria'}
          </h3>
          <p className="text-xs text-slate-400 font-mono-tech max-w-md mx-auto">
            {language === 'PL'
              ? 'Spróbuj zmienić filtry lub wyczyść wyszukiwanie, aby wyświetlić więcej projektów.'
              : 'Try changing your filters or clear your search to see more repositories.'}
          </p>
        </div>
      )}

      {/* Floating Bulk Action Toolbar */}
      {selectedProjectIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94vw] max-w-3xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-3 sm:p-4 rounded-2xl bg-[#0a0f1d]/95 backdrop-blur-md border-2 border-cyan-500/50 shadow-[0_0_35px_rgba(0,240,255,0.35)] flex flex-wrap items-center justify-between gap-3">
            {/* Selection Info */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center text-cyan-300">
                <CheckCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-cyber font-bold text-xs sm:text-sm text-white">
                    {selectedProjectIds.length} {language === 'PL' ? 'Zaznaczonych Projektów' : 'Projects Selected'}
                  </span>
                  <span className="text-[10px] font-mono-tech text-cyan-400/80">
                    ({Math.round((selectedProjectIds.length / projects.length) * 100)}% {language === 'PL' ? 'zasobów' : 'of total'})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono-tech">
                  <button
                    onClick={() => {
                      toggleSelectAllVisible();
                      playCyberSound('click');
                    }}
                    className="text-cyan-400 hover:text-cyan-200 underline cursor-pointer"
                  >
                    {allVisibleSelected
                      ? (language === 'PL' ? 'Odznacz widoczne' : 'Deselect visible')
                      : (language === 'PL' ? 'Zaznacz wszystkie widoczne' : 'Select all visible')}
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    onClick={() => {
                      setSelectedProjectIds([]);
                      playCyberSound('click');
                    }}
                    className="text-slate-400 hover:text-slate-200 underline cursor-pointer"
                  >
                    {language === 'PL' ? 'Wyczyść wybór' : 'Clear selection'}
                  </button>
                </div>
              </div>
            </div>

            {/* Batch Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Archive / Unarchive Button */}
              <button
                onClick={() => {
                  handleBulkArchive();
                  playCyberSound('node');
                  triggerHaptic();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-950/70 hover:bg-amber-900 border border-amber-500/50 text-amber-300 font-cyber font-bold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer"
                title={allSelectedArchived ? 'Przywróć ze skrytki archiwalnej' : 'Zarchiwizuj zaznaczone projekty'}
              >
                {allSelectedArchived ? (
                  <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                ) : (
                  <Archive className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>
                  {allSelectedArchived
                    ? (language === 'PL' ? 'Przywróć' : 'Restore')
                    : (language === 'PL' ? 'Archiwizuj' : 'Archive')}
                </span>
              </button>

              {/* Change Status Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowStatusMenu(!showStatusMenu);
                    playCyberSound('click');
                    triggerHaptic();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-cyber font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{language === 'PL' ? 'Zmień Status' : 'Change Status'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showStatusMenu ? 'rotate-180' : ''}`} />
                </button>

                {showStatusMenu && (
                  <div className="absolute bottom-full mb-2 right-0 sm:left-0 w-52 rounded-2xl bg-[#090d16] border border-cyan-500/40 shadow-[0_0_30px_rgba(0,240,255,0.3)] p-1.5 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2.5 py-1 text-[10px] font-mono-tech text-cyan-400/70 uppercase border-b border-cyan-500/20 mb-1">
                      {language === 'PL' ? 'Ustaw status dla wybranych' : 'Set status for selected'}
                    </div>
                    {statuses.map(st => (
                      <button
                        key={st}
                        onClick={() => handleBulkStatusChange(st)}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-mono-tech text-left hover:bg-cyan-950/70 hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        <span className={`px-2 py-0.5 rounded border text-[10px] ${getStatusColor(st)}`}>
                          {st}
                        </span>
                        {selectedProjects.every(p => p.status === st) && (
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => {
                  setShowDeleteConfirm(true);
                  playCyberSound('beep');
                  triggerHaptic();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-cyber font-bold text-xs transition-all shadow-[0_0_15px_rgba(244,63,94,0.25)] cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>{language === 'PL' ? 'Usuń' : 'Delete'}</span>
              </button>

              {/* Close / Dismiss Selection */}
              <button
                onClick={() => {
                  setSelectedProjectIds([]);
                  playCyberSound('click');
                  triggerHaptic();
                }}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                title={language === 'PL' ? 'Wyczyść zaznaczenie' : 'Clear selection'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          onClick={() => setShowDeleteConfirm(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-lg p-6 rounded-3xl bg-[#090d16] border-2 border-rose-500/60 shadow-[0_0_50px_rgba(244,63,94,0.35)] space-y-5"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border-2 border-rose-500/60 flex items-center justify-center text-rose-400 shrink-0 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-cyber font-bold text-lg text-white">
                  {language === 'PL'
                    ? `Potwierdź Usunięcie Projektów (${selectedProjectIds.length})`
                    : `Confirm Bulk Project Deletion (${selectedProjectIds.length})`}
                </h3>
                <p className="text-xs text-slate-300 font-mono-tech leading-relaxed">
                  {language === 'PL'
                    ? `Czy na pewno chcesz usunąć trwale ${selectedProjectIds.length} projektów z rejestru NEXUS? Ta operacja jest nieodwracalna i usunie przypisane repozytoria oraz logi zadań.`
                    : `Are you sure you want to permanently delete ${selectedProjectIds.length} projects from the NEXUS registry? This action is irreversible.`}
                </p>
              </div>
            </div>

            {/* Selected Projects List Preview */}
            <div className="max-h-40 overflow-y-auto rounded-xl bg-[#06080d] border border-rose-500/20 p-3 space-y-2">
              {selectedProjects.map(p => (
                <div key={p.id} className="flex items-center justify-between text-xs font-mono-tech border-b border-slate-800/60 pb-1.5 last:border-0 last:pb-0">
                  <span className="text-slate-200 font-bold truncate max-w-[280px]">{p.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] border ${getStatusColor(p.status)}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-cyber text-slate-300 transition-all cursor-pointer"
              >
                {language === 'PL' ? 'Anuluj' : 'Cancel'}
              </button>

              <button
                onClick={() => {
                  handleBulkDelete();
                  playCyberSound('beep');
                  triggerHaptic();
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-cyber font-bold text-xs transition-all shadow-[0_0_20px_rgba(244,63,94,0.4)] cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>
                  {language === 'PL'
                    ? `Usuń ${selectedProjectIds.length} projektów`
                    : `Permanently Delete (${selectedProjectIds.length})`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
