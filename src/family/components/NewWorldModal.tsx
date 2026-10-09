import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Globe,
  X,
  Plus,
  Sparkles,
  Layers,
  Users,
  Compass,
  Cpu,
  Code2,
  Lock,
  BookOpen,
  Film,
  Gamepad2,
  Radio,
  Shield,
  Zap
} from 'lucide-react';

interface NewWorldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewWorldModal: React.FC<NewWorldModalProps> = ({ isOpen, onClose }) => {
  const { architects, addWorld, playCyberSound, triggerHaptic, language } = useNexus();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'OPERATIONAL' | 'INCUBATING' | 'SCALING'>('INCUBATING');
  const [iconName, setIconName] = useState('Globe');
  const [colorAccent, setColorAccent] = useState('#a855f7');
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>(['arch-1']);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(['arch-1', 'arch-2']);

  // Initial Subsystem Module
  const [moduleName, setModuleName] = useState('Core Subsystem Alpha');
  const [moduleDesc, setModuleDesc] = useState('Węzeł bazowy modułu dla nowego świata.');

  // Initial Strategic Roadmap
  const [roadmapPhase, setRoadmapPhase] = useState('FAZA I');
  const [roadmapTitle, setRoadmapTitle] = useState('Inicjalizacja Węzła');
  const [roadmapDesc, setRoadmapDesc] = useState('Konfiguracja architektury i weryfikacja bramy ingress.');

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!slug || slug === val.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, -1)) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    }
  };

  const toggleLead = (id: string) => {
    setSelectedLeadIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleMember = (id: string) => {
    setSelectedMemberIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    addWorld({
      slug: finalSlug,
      name: name.trim(),
      tagline: tagline.trim() || 'Dedykowana przestrzeń cyber-architektury w Nexusie',
      description: description.trim() || 'Nowy suwerenny świat stworzony dynamicznie przez Architektów Nexusa.',
      iconName,
      colorAccent,
      status,
      leadArchitectIds: selectedLeadIds.length > 0 ? selectedLeadIds : ['arch-1'],
      memberIds: selectedMemberIds,
      projectIds: [],
      modules: [
        {
          id: `mod-${Date.now()}`,
          name: moduleName.trim() || 'Infrastruktura Bazowa',
          description: moduleDesc.trim() || 'Moduł początkowy.',
          status: 'DEVELOPMENT'
        }
      ],
      roadmap: [
        {
          phase: roadmapPhase.trim() || 'FAZA I',
          title: roadmapTitle.trim() || 'Genesis Świata',
          description: roadmapDesc.trim() || 'Definicja protokołów i alokacja zasobów.',
          status: 'ACTIVE'
        }
      ]
    });

    playCyberSound('success');
    triggerHaptic();
    if (typeof onClose === 'function') onClose();
  };

  const iconsList = [
    { name: 'Globe', Icon: Globe },
    { name: 'Cpu', Icon: Cpu },
    { name: 'Code2', Icon: Code2 },
    { name: 'Shield', Icon: Shield },
    { name: 'Lock', Icon: Lock },
    { name: 'BookOpen', Icon: BookOpen },
    { name: 'Film', Icon: Film },
    { name: 'Gamepad2', Icon: Gamepad2 },
    { name: 'Compass', Icon: Compass },
    { name: 'Radio', Icon: Radio },
    { name: 'Sparkles', Icon: Sparkles }
  ];

  const colorsList = [
    { label: 'Purple Neon', hex: '#a855f7' },
    { label: 'Cyan Cyber', hex: '#00f0ff' },
    { label: 'Emerald Tech', hex: '#10b981' },
    { label: 'Amber Flame', hex: '#f59e0b' },
    { label: 'Rose Matrix', hex: '#f43f5e' }
  ];

  return (
    <div
      onClick={() => { if (typeof onClose === 'function') onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#080b12] border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.25)] overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-purple-500/20 flex items-center justify-between bg-gradient-to-r from-purple-950/40 via-[#0a0f1d] to-cyan-950/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-950 border border-purple-400/50 text-purple-300">
              <Globe className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-cyber font-bold text-lg text-white">
                {language === 'PL' ? 'KREACJA NOWEGO ŚWIATA NEXUSA' : 'CREATE NEW NEXUS WORLD'}
              </h3>
              <p className="text-xs font-mono-tech text-purple-300">
                {language === 'PL'
                  ? 'Dynamiczna rezerwacja obszaru tematycznego bez konieczności rebuilda'
                  : 'Dynamic world creation supporting instant live ecosystem expansion'}
              </p>
            </div>
          </div>
          <button
            onClick={() => { if (typeof onClose === 'function') onClose(); }}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono-tech text-purple-300 font-bold uppercase">
                {language === 'PL' ? 'Nazwa Świata' : 'World Name'} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={handleNameChange}
                placeholder="Np. Nexus Bio-Tech, Nexus Quantum"
                className="w-full bg-[#0d131f] border border-purple-500/30 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono-tech text-cyan-300 font-bold uppercase">
                {language === 'PL' ? 'Identyfikator Slug' : 'Slug Identifier'}
              </label>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="nexus-bio-tech"
                className="w-full bg-[#0d131f] border border-cyan-500/30 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-cyan-300 font-mono-tech placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono-tech text-slate-300 font-bold uppercase">
              Tagline (Krótki Slogan)
            </label>
            <input
              type="text"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              placeholder="Np. Fuzja biologii, AI i synaps cybernetycznych"
              className="w-full bg-[#0d131f] border border-purple-500/20 focus:border-purple-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono-tech text-slate-300 font-bold uppercase">
              Opis i Manifest Świata
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Opisz misję, cele oraz zakres tematyczny nowego Świata..."
              className="w-full bg-[#0d131f] border border-purple-500/20 focus:border-purple-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
            />
          </div>

          {/* Status, Icon, Color Accent */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono-tech text-slate-300 font-bold uppercase">
                Status Świata
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full bg-[#0d131f] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono-tech"
              >
                <option value="INCUBATING">INCUBATING (Inkubacja)</option>
                <option value="OPERATIONAL">OPERATIONAL (Operacyjny)</option>
                <option value="SCALING">SCALING (Skalowanie)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono-tech text-slate-300 font-bold uppercase">
                Akcent Kolorystyczny
              </label>
              <div className="flex items-center gap-2 pt-1">
                {colorsList.map(c => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setColorAccent(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      colorAccent === c.hex ? 'scale-125 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'border-transparent opacity-70'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono-tech text-slate-300 font-bold uppercase">
                Symbol / Ikona
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {iconsList.map(({ name: iName, Icon }) => (
                  <button
                    key={iName}
                    type="button"
                    onClick={() => setIconName(iName)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      iconName === iName
                        ? 'bg-purple-950 text-purple-300 border-purple-400'
                        : 'bg-[#0d131f] text-slate-500 border-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lead Architects Selection */}
          <div className="space-y-2 pt-2 border-t border-purple-500/15">
            <label className="text-xs font-mono-tech text-cyan-300 font-bold uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Liderzy Architektury (Lead Architects)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {architects.slice(0, 6).map(arch => {
                const isSelected = selectedLeadIds.includes(arch.id);
                return (
                  <button
                    key={arch.id}
                    type="button"
                    onClick={() => toggleLead(arch.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                      isSelected
                        ? 'bg-purple-950/60 border-purple-400 text-white font-bold'
                        : 'bg-[#0d131f] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <img src={arch.avatar} alt={arch.name} className="w-5 h-5 rounded-md object-cover" />
                    <span className="truncate">{arch.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Initial Module & Initial Roadmap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-purple-500/15">
            <div className="space-y-2 p-3 rounded-2xl bg-[#0c101a] border border-cyan-500/20">
              <span className="text-[11px] font-mono-tech text-cyan-300 font-bold uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Początkowy Moduł Subsystemu</span>
              </span>
              <input
                type="text"
                value={moduleName}
                onChange={e => setModuleName(e.target.value)}
                placeholder="Nazwa modułu"
                className="w-full bg-[#080b12] border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono-tech"
              />
              <input
                type="text"
                value={moduleDesc}
                onChange={e => setModuleDesc(e.target.value)}
                placeholder="Krótki opis modułu"
                className="w-full bg-[#080b12] border border-cyan-500/20 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
              />
            </div>

            <div className="space-y-2 p-3 rounded-2xl bg-[#0c101a] border border-purple-500/20">
              <span className="text-[11px] font-mono-tech text-purple-300 font-bold uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Początkowy Kamień Milowy (Roadmap)</span>
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={roadmapPhase}
                  onChange={e => setRoadmapPhase(e.target.value)}
                  placeholder="FAZA I"
                  className="w-24 bg-[#080b12] border border-purple-500/30 rounded-xl px-2.5 py-1.5 text-xs text-purple-300 focus:outline-none font-mono-tech"
                />
                <input
                  type="text"
                  value={roadmapTitle}
                  onChange={e => setRoadmapTitle(e.target.value)}
                  placeholder="Genesis Świata"
                  className="flex-1 bg-[#080b12] border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-cyber font-bold"
                />
              </div>
              <input
                type="text"
                value={roadmapDesc}
                onChange={e => setRoadmapDesc(e.target.value)}
                placeholder="Opis fazy strategicznej"
                className="w-full bg-[#080b12] border border-purple-500/20 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-purple-500/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => { if (typeof onClose === 'function') onClose(); }}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs font-mono-tech"
            >
              Anuluj
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_20px_rgba(168,85,247,0.35)] flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>{language === 'PL' ? 'Uruchom Nowy Świat' : 'Deploy World'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
