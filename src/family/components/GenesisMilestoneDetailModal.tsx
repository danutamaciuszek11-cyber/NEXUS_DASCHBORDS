import React from 'react';
import { useNexus } from '../context/NexusContext';
import { GenesisMilestone } from '../types';
import {
  X,
  History,
  Sparkles,
  Flame,
  Globe,
  Users,
  Shield,
  Layers,
  Brain,
  Calendar,
  Zap,
  BookOpen,
  ExternalLink,
  Code2,
  Award,
  CheckCircle2,
  Quote,
  Cpu,
  ArrowUpRight
} from 'lucide-react';

interface GenesisMilestoneDetailModalProps {
  milestone: GenesisMilestone | null;
  onClose: () => void;
}

export const GenesisMilestoneDetailModal: React.FC<GenesisMilestoneDetailModalProps> = ({
  milestone,
  onClose
}) => {
  const {
    architects,
    worlds,
    projects,
    memoryDocs,
    language,
    playCyberSound,
    triggerHaptic,
    setActiveArchitectModalId,
    setActiveProjectId,
    setActiveWorldSlug,
    endorseGenesisMilestone
  } = useNexus();

  if (!milestone) return null;

  // Resolve linked entities
  const linkedArchitects = architects.filter(a => milestone.architectsInvolved.includes(a.id) || milestone.architectsInvolved.includes(a.handle));
  const linkedWorld = worlds.find(w => w.slug === milestone.worldSlug);
  const linkedProjects = projects.filter(p => milestone.projectIds?.includes(p.id) || milestone.projectIds?.includes(p.slug));
  const linkedMemoryDoc = memoryDocs.find(m => m.id === milestone.memoryDocId);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'CORE':
        return 'text-cyan-400 bg-cyan-950/80 border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]';
      case 'AI':
        return 'text-purple-400 bg-purple-950/80 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]';
      case 'WORLD':
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
      case 'COMMUNITY':
        return 'text-amber-400 bg-amber-950/80 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
      case 'GOVERNANCE':
        return 'text-rose-400 bg-rose-950/80 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
      default:
        return 'text-cyan-400 bg-cyan-950/80 border-cyan-500/40';
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-6 h-6 text-amber-400" />;
      case 'Brain':
        return <Brain className="w-6 h-6 text-purple-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-purple-300 animate-pulse" />;
      case 'Globe':
        return <Globe className="w-6 h-6 text-emerald-400" />;
      case 'Users':
        return <Users className="w-6 h-6 text-amber-400" />;
      case 'Shield':
        return <Shield className="w-6 h-6 text-rose-400" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-cyan-400" />;
      default:
        return <History className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#070b14] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] p-6 space-y-6 text-slate-100">
        
        {/* Top Header HUD */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-cyan-500/20">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl border ${getCategoryColor(milestone.category)}`}>
              {renderIcon(milestone.icon)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 text-xs font-mono-tech font-bold rounded bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 tracking-wider">
                  {milestone.epoch}
                </span>
                <span className="px-2.5 py-0.5 text-[11px] font-mono-tech rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
                  {milestone.category}
                </span>
                {milestone.significanceTag && (
                  <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 font-semibold uppercase">
                    ⚡ {milestone.significanceTag}
                  </span>
                )}
              </div>
              <h2 className="font-cyber font-bold text-xl sm:text-2xl text-white mt-1.5 tracking-wide">
                {milestone.title}
              </h2>
              {milestone.subtitle && (
                <p className="text-xs font-mono-tech text-cyan-300/80 mt-0.5">
                  {milestone.subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              playCyberSound('click');
              if (typeof onClose === 'function') onClose();
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timestamp & Impact Metrics HUD Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#0b101d] border border-cyan-500/20 text-xs font-mono-tech">
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">{language === 'PL' ? 'Data Rekordu' : 'Record Date'}</span>
            <div className="flex items-center gap-1.5 text-white font-bold mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{milestone.date}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase block">{language === 'PL' ? 'Współczynnik Wpływu' : 'Impact Score'}</span>
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold mt-0.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>{milestone.impactScore || 95} / 100</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase block">{language === 'PL' ? 'Architekci Genesis' : 'Genesis Architects'}</span>
            <div className="flex items-center gap-1.5 text-purple-300 font-bold mt-0.5">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>{milestone.architectsInvolved.length} {language === 'PL' ? 'Twórców' : 'Builders'}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase block">{language === 'PL' ? 'Poparcie Społeczności' : 'Endorsements'}</span>
            <div className="flex items-center gap-1.5 text-amber-300 font-bold mt-0.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>⚡ {milestone.endorsedByCount || 42}</span>
            </div>
          </div>
        </div>

        {/* Historical Narrative */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono-tech uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>{language === 'PL' ? 'Kronika Historyczna & Narracja' : 'Historical Chronicle & Narrative'}</span>
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed font-sans bg-[#0a0e19] p-4 rounded-xl border border-cyan-500/15">
            {milestone.longNarrative || milestone.description}
          </p>
        </div>

        {/* Historical Quote (If Present) */}
        {milestone.quote && (
          <div className="relative p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 via-purple-950/20 to-cyan-950/30 border border-cyan-500/30 space-y-2">
            <Quote className="w-5 h-5 text-cyan-400/50 absolute top-3 right-3" />
            <p className="text-xs font-sans italic text-cyan-200 pr-6">
              "{milestone.quote.text}"
            </p>
            <p className="text-[11px] font-mono-tech text-cyan-400 font-bold text-right">
              — {milestone.quote.author}
            </p>
          </div>
        )}

        {/* Key Deliverables & Artifacts */}
        {milestone.keyDeliverables && milestone.keyDeliverables.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono-tech uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'PL' ? 'Kluczowe Rezultaty & Artefakty' : 'Key Deliverables & Artifacts'}</span>
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {milestone.keyDeliverables.map((deliv, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0a0f1b] border border-emerald-500/20 text-xs font-mono-tech text-slate-300"
                >
                  <Code2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{deliv}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Linked World Section */}
        {linkedWorld && (
          <div className="space-y-2">
            <h3 className="text-xs font-mono-tech uppercase text-purple-400 tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              <span>{language === 'PL' ? 'Kolebka Światowa (Origin World)' : 'Originating Nexus World'}</span>
            </h3>
            <div
              onClick={() => {
                setActiveWorldSlug(linkedWorld.slug);
                playCyberSound('click');
                if (typeof onClose === 'function') onClose();
              }}
              className="p-3.5 rounded-xl bg-[#090e18] border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold">
                  {linkedWorld.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-cyber font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                    {linkedWorld.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono-tech">
                    {linkedWorld.tagline}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        )}

        {/* Participating Early Architects */}
        {linkedArchitects.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono-tech uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{language === 'PL' ? 'Architekci Założyciele' : 'Participating Early Architects'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {linkedArchitects.map(arch => (
                <div
                  key={arch.id}
                  onClick={() => {
                    setActiveArchitectModalId(arch.id);
                    playCyberSound('click');
                    if (typeof onClose === 'function') onClose();
                  }}
                  className="p-2.5 rounded-xl bg-[#0a0f1c] border border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-950/30 transition-all cursor-pointer flex items-center gap-3 group"
                >
                  <img
                    src={arch.avatar}
                    alt={arch.name}
                    className="w-9 h-9 rounded-xl object-cover border border-cyan-500/40"
                  />
                  <div className="overflow-hidden">
                    <p className="font-cyber text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                      {arch.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono-tech truncate">
                      @{arch.handle} • {arch.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Groundbreaking Projects Spawned */}
        {linkedProjects.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono-tech uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              <span>{language === 'PL' ? 'Zapoczątkowane Projekty' : 'Groundbreaking Projects Spawned'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {linkedProjects.map(proj => (
                <div
                  key={proj.id}
                  onClick={() => {
                    setActiveProjectId(proj.id);
                    playCyberSound('click');
                    if (typeof onClose === 'function') onClose();
                  }}
                  className="p-3 rounded-xl bg-[#0a0f1d] border border-amber-500/25 hover:border-amber-400 hover:bg-amber-950/20 transition-all cursor-pointer space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-cyber font-bold text-xs text-white group-hover:text-amber-300">
                      {proj.title}
                    </h4>
                    <span className="px-1.5 py-0.5 text-[9px] font-mono-tech rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                      {proj.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono-tech line-clamp-1">
                    {proj.tagline}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attached RFC / Memory Document */}
        {linkedMemoryDoc && (
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-300 font-mono-tech text-xs font-bold">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>{linkedMemoryDoc.title}</span>
              </div>
              <span className="text-[10px] font-mono-tech text-slate-400">{linkedMemoryDoc.version}</span>
            </div>
            <p className="text-xs text-slate-300 font-sans line-clamp-2">
              {linkedMemoryDoc.summary}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-cyan-500/20 flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={() => {
              if (milestone.id) endorseGenesisMilestone(milestone.id);
              triggerHaptic();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-400 hover:bg-amber-950/50 text-xs font-cyber tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>
              {language === 'PL' ? 'Poprzyj Rekord Genesis' : 'Endorse Genesis Record'} (⚡ {milestone.endorsedByCount || 42})
            </span>
          </button>

          <button
            onClick={() => {
              playCyberSound('click');
              if (typeof onClose === 'function') onClose();
            }}
            className="px-5 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/80 hover:text-white text-xs font-cyber tracking-wider transition-all"
          >
            {language === 'PL' ? 'Zamknij Podgląd' : 'Close Chronicle'}
          </button>
        </div>

      </div>
    </div>
  );
};
