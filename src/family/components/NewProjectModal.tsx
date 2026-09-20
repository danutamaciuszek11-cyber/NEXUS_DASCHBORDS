import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import { X, FolderGit2, Sparkles, Send, Layers } from 'lucide-react';
import { ProjectStatus } from '../types';

export const NewProjectModal: React.FC<{ isOpen: boolean; onClose?: () => void }> = ({
  isOpen,
  onClose = () => {}
}) => {
  const { worlds, addProject, currentArchitect, playCyberSound, triggerHaptic, language } = useNexus();

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [worldSlug, setWorldSlug] = useState(worlds[0]?.slug || 'nexus-ai');
  const [status, setStatus] = useState<ProjectStatus>('IDEA');
  const [bounty, setBounty] = useState(250);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addProject({
      title: title.trim(),
      tagline: tagline.trim() || title.trim(),
      description: description.trim(),
      worldSlug,
      ownerId: currentArchitect.id,
      status,
      tasks: [
        {
          id: `task-${Date.now()}-1`,
          title: 'Definicja założeń architektonicznych i RFC',
          assigneeId: currentArchitect.id,
          status: 'DONE',
          priority: 'HIGH'
        },
        {
          id: `task-${Date.now()}-2`,
          title: 'Budowa rdzenia modułu i integracja z API',
          status: 'IN_PROGRESS',
          priority: 'CRITICAL'
        }
      ],
      milestones: [
        { id: 'm1', title: 'Faza 1: Prototyp & Walidacja', date: '2025-Q3', status: 'IN_PROGRESS' },
        { id: 'm2', title: 'Faza 2: Integracja ekosystemowa', date: '2025-Q4', status: 'UPCOMING' }
      ],
      teamIds: [currentArchitect.id],
      contributionBounty: bounty,
      repoUrl: '',
      liveDemoUrl: ''
    });

    playCyberSound('success');
    triggerHaptic();
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl p-6 rounded-2xl bg-[#090d16] border border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.2)] space-y-5">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-cyber font-bold text-base text-white">
              {language === 'PL' ? 'ZGŁOŚ NOWY PROJEKT / REPOZYTORIUM' : 'PROPOSE NEW PROJECT'}
            </h3>
          </div>
          <button onClick={() => { if (typeof onClose === 'function') onClose(); }} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono-tech">
          <div className="space-y-1">
            <label className="text-slate-400">Tytuł Projektu *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="np. Nexus Decentralized Identity Layer"
              className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Krótki slogan (Tagline)</label>
            <input
              type="text"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              placeholder="np. Suwerenne uwierzytelnianie synaptyczne"
              className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-400">Świat Nexusa</label>
              <select
                value={worldSlug}
                onChange={e => setWorldSlug(e.target.value)}
                className="w-full bg-[#0d131f] border border-cyan-500/20 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
              >
                {worlds.map(w => (
                  <option key={w.id} value={w.slug}>{w.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Początkowy Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ProjectStatus)}
                className="w-full bg-[#0d131f] border border-cyan-500/20 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
              >
                <option value="IDEA">IDEA</option>
                <option value="PROTOTYPE">PROTOTYPE</option>
                <option value="BUILDING">BUILDING</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Opis Architektury & Celów *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Opisz specyfikację, użyte technologie i harmonogram..."
              className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none font-sans"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                if (typeof onClose === 'function') onClose();
              }}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              Utwórz Projekt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
