import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  FolderGit2,
  Users,
  CheckCircle2,
  ExternalLink,
  Github,
  X,
  Cpu,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';

export const ProjectDetailModal: React.FC = () => {
  const {
    activeProjectId,
    setActiveProjectId,
    projects,
    architects,
    worlds,
    setCurrentView,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TASKS' | 'DOCS' | 'CHANGELOG'>('OVERVIEW');

  if (!activeProjectId) return null;

  const project = projects.find(p => p.id === activeProjectId);
  if (!project) return null;

  const lead = architects.find(a => a.id === project.ownerId) || architects[0];
  const teamArchitects = architects.filter(a => (project.architectIds || []).includes(a.id));
  const world = worlds.find(w => w.slug === project.worldSlug);

  const completedTasks = project.tasks?.filter(t => t.status === 'DONE').length || 0;
  const totalTasks = project.tasks?.length || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div
      id="project-detail-modal"
      onClick={() => {
        setActiveProjectId(null);
        playCyberSound('click');
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl nexus-glass border border-cyan-400/50 bg-[#090d16]/95 flex flex-col justify-between shadow-[0_0_60px_rgba(0,240,255,0.25)] overflow-hidden"
      >
        {/* Modal Top Header */}
        <div className="p-5 border-b border-cyan-500/20 bg-[#06080e]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400 text-cyan-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cyber font-bold text-base sm:text-lg text-white tracking-wide">
                  {project.title}
                </h3>
                <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  {project.status}
                </span>
                {world && (
                  <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-purple-950/60 text-purple-300 border border-purple-500/30 hidden sm:inline">
                    {world.name}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono-tech text-slate-400">
                Lead: {lead?.name || 'Krystian Nexus'} • Updated: {new Date(project.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveProjectId(null);
                setCurrentView('AI_COUNCIL');
                playCyberSound('synapse');
                triggerHaptic();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-300 text-xs font-cyber transition-all"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>AI Council Review</span>
            </button>
            <button
              onClick={() => {
                setActiveProjectId(null);
                playCyberSound('click');
              }}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 px-5 py-2 border-b border-cyan-500/10 bg-[#080b11]/80">
          {(['OVERVIEW', 'TASKS', 'DOCS', 'CHANGELOG'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                playCyberSound('click');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-all ${
                activeTab === tab
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200 font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto font-sans">
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-5">
              {/* Description */}
              <div className="p-4 rounded-xl bg-[#0d131f] border border-cyan-500/20">
                <h4 className="font-cyber font-bold text-xs text-cyan-300 uppercase tracking-wider mb-1.5">
                  Project Architectural Blueprint:
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {project.description}
                </p>
              </div>

              {/* Progress Meter */}
              <div className="p-4 rounded-xl bg-[#0d131f] border border-cyan-500/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-tech">
                  <span className="text-slate-400">Implementation Progress:</span>
                  <span className="text-cyan-300 font-bold">{progressPercent}% Complete</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Team Roster */}
              <div className="space-y-2">
                <h4 className="font-cyber font-bold text-xs text-cyan-300 uppercase tracking-wider">
                  Assigned Architects ({teamArchitects.length}):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {teamArchitects.map(a => (
                    <div key={a.id} className="p-3 rounded-xl bg-[#0d131f] border border-cyan-500/10 flex items-center gap-3">
                      <img src={a.avatar} alt={a.name} className="w-10 h-10 rounded-lg object-cover border border-cyan-500/30" />
                      <div className="truncate">
                        <div className="font-cyber font-bold text-xs text-white">{a.name}</div>
                        <div className="text-[10px] font-mono-tech text-cyan-400">{a.handle}</div>
                        <div className="text-[9px] font-mono-tech text-slate-500 truncate">{a.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roadmap Milestones */}
              <div className="space-y-2">
                <h4 className="font-cyber font-bold text-xs text-cyan-300 uppercase tracking-wider">
                  Roadmap & Milestones:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(project.roadmap || []).map((rm, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#0d131f] border border-cyan-500/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${rm.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                        <span className={`font-sans ${rm.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {rm.milestone}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono-tech text-cyan-400">{rm.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'TASKS' && (
            <div className="space-y-3">
              <h4 className="font-cyber font-bold text-xs text-cyan-300 uppercase tracking-wider">
                Active Project Tasks ({(project.tasks || []).length}):
              </h4>
              <div className="space-y-2">
                {(project.tasks || []).map(t => (
                  <div key={t.id} className="p-3.5 rounded-xl bg-[#0d131f] border border-cyan-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className={`w-4 h-4 ${t.status === 'DONE' ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span className={`text-xs font-sans ${t.status === 'DONE' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {t.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/20">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'DOCS' && (
            <div className="p-4 rounded-xl bg-[#0d131f] border border-cyan-500/20 text-xs sm:text-sm text-slate-300 font-mono-tech whitespace-pre-wrap leading-relaxed">
              {project.documentation || `## ${project.title} Architectural Specification\n\n- Architecture: Modular micro-frontend with State Bella synchronization layer.\n- Security: Encrypted P2P synapting mesh.\n- Contribution: Open for code, review, and AI prompts.`}
            </div>
          )}

          {activeTab === 'CHANGELOG' && (
            <div className="space-y-3">
              {(project.changelog || []).map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#0d131f] border border-cyan-500/10 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-cyan-400 font-mono-tech text-[11px]">
                    <span className="font-bold">{c.version}</span>
                    <span className="text-slate-400">{c.date}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 font-sans">
                    {(c.changes || []).map((ch, ci) => (
                      <li key={ci} className="text-xs">{ch}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-500/20 bg-[#06080e]/90 flex items-center justify-between text-xs font-mono-tech text-slate-400">
          <div className="flex items-center gap-2">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300"
              >
                <Github className="w-4 h-4" />
                <span>Repository</span>
              </a>
            )}
          </div>
          <button
            onClick={() => setActiveProjectId(null)}
            className="px-4 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 font-cyber"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
