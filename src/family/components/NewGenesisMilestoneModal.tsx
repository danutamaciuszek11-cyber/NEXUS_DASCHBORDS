import React, { useState } from 'react';
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
  Plus,
  Zap,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface NewGenesisMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewGenesisMilestoneModal: React.FC<NewGenesisMilestoneModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    architects,
    worlds,
    projects,
    addGenesisMilestone,
    language,
    playCyberSound,
    triggerHaptic,
    currentArchitect
  } = useNexus();

  const [epoch, setEpoch] = useState('Epoch 4.2');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<'CORE' | 'WORLD' | 'AI' | 'COMMUNITY' | 'GOVERNANCE'>('CORE');
  const [significanceTag, setSignificanceTag] = useState('SYSTEM EVOLUTION');
  const [icon, setIcon] = useState('Sparkles');
  const [description, setDescription] = useState('');
  const [longNarrative, setLongNarrative] = useState('');
  const [worldSlug, setWorldSlug] = useState(worlds[0]?.slug || 'nexus-core');
  const [selectedArchitects, setSelectedArchitects] = useState<string[]>([currentArchitect.id]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [keyDeliverablesInput, setKeyDeliverablesInput] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState(currentArchitect.name);
  const [impactScore, setImpactScore] = useState(90);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const deliverables = keyDeliverablesInput
      .split(',')
      .map(d => d.trim())
      .filter(Boolean);

    const newMilestone: Omit<GenesisMilestone, 'id'> = {
      epoch,
      date,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      category,
      significanceTag: significanceTag.trim() || undefined,
      icon,
      description: description.trim(),
      longNarrative: longNarrative.trim() || description.trim(),
      worldSlug,
      architectsInvolved: selectedArchitects,
      projectIds: selectedProjects,
      keyDeliverables: deliverables.length > 0 ? deliverables : undefined,
      quote: quoteText.trim() ? { text: quoteText.trim(), author: quoteAuthor.trim() || currentArchitect.name } : undefined,
      impactScore,
      endorsedByCount: 1,
      nodeCoordinates: { x: 50 + Math.floor(Math.random() * 20), y: 50 + Math.floor(Math.random() * 20) }
    };

    addGenesisMilestone(newMilestone);
    playCyberSound('success');
    triggerHaptic();
    if (typeof onClose === 'function') onClose();
  };

  const toggleArchitect = (id: string) => {
    setSelectedArchitects(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const toggleProject = (id: string) => {
    setSelectedProjects(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#070b14] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] p-6 space-y-6 text-slate-100">
        
        {/* Header HUD */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-cyber font-bold text-lg sm:text-xl text-white tracking-wide">
                {language === 'PL' ? 'PROPOZYCJA WPISU GENESIS' : 'PROPOSE GENESIS RECORD'}
              </h2>
              <p className="text-xs font-mono-tech text-cyan-300/80">
                {language === 'PL' ? 'Uwiecznij historyczny kamień milowy w żywej kronice Nexusa' : 'Immortalize a historical milestone in Nexus living chronicle'}
              </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono-tech uppercase text-cyan-400 mb-1">
                {language === 'PL' ? 'Nazwa Epoki (Epoch)' : 'Epoch Label'}
              </label>
              <input
                type="text"
                value={epoch}
                onChange={e => setEpoch(e.target.value)}
                placeholder="np. Epoch 4.2"
                required
                className="w-full px-3 py-2 rounded-xl bg-[#0b101e] border border-cyan-500/30 text-white font-mono-tech text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-tech uppercase text-cyan-400 mb-1">
                {language === 'PL' ? 'Data Wydarzenia' : 'Record Date'}
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#0b101e] border border-cyan-500/30 text-white font-mono-tech text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-tech uppercase text-cyan-400 mb-1">
                {language === 'PL' ? 'Kategoria' : 'Category'}
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b101e] border border-cyan-500/30 text-white font-mono-tech text-xs focus:border-cyan-400 focus:outline-none"
              >
                <option value="CORE">CORE (System Base)</option>
                <option value="AI">AI (State Bella & Synapses)</option>
                <option value="WORLD">WORLD (Sovereign Domains)</option>
                <option value="COMMUNITY">COMMUNITY (Architects & Guilds)</option>
                <option value="GOVERNANCE">GOVERNANCE (Oath & Councils)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-tech uppercase text-cyan-400 mb-1">
                {language === 'PL' ? 'Tytuł Rekordu' : 'Record Title'}
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="np. Narodziny Autonomicznego Synapsera"
                required
                className="w-full px-3 py-2 rounded-xl bg-[#0b101e] border border-cyan-500/30 text-white font-mono-tech text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-tech uppercase text-cyan-400 mb-1">
                {language === 'PL' ? 'Podtytuł / Hasło' : 'Subtitle / Tagline'}
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="np. Integracja 7 Perspektyw Kognitywnych"
                className="w-full px-3 py-2 rounded-xl bg-[#0b101e] border border-cyan-500/30 text-white font-mono-tech text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono-tech uppercase text-cyan-400 mb-1">
                {language === 'PL' ? 'Tag Znaczenia' : 'Significance Tag'}
              </label>
              <input
                type="text"
                value={significanceTag}
                onChange={e => setSignificanceTag(e.target.value)}
                placeholder="np. PARADIGM SHIFT"
                className="w-full px-3 py-2 rounded-xl bg-[#0b101e] border border-cyan-500/30 text-white font-mono-tech text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-tech uppercase text-cyan-400 mb-1">
                {language === 'PL' ? 'Ikona Węzła' : 'Node Icon'}
              </label>
              <select
                value={icon}
                onChange={e => setIcon(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b101e] border border-cyan-500/30 text-white font-mono-tech text-xs focus:border-cyan-400 focus:outline-none"
              >
                <option value="Sparkles">Sparkles (Płomień Innowacji)</option>
                <option value="Flame">Flame (Pierwotny Ogień)</option>
                <option value="Brain">Brain (Moduł Kognitywny)</option>
                <option value="Globe">Globe (Kolebka Światowa)</option>
                <option value="Users">Users (Sojusz Architektów)</option>
                <option value="Shield">Shield (Przysięga & Ochrona)</option>
                <option value="Layers">Layers (Systemowy Fundament)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono-tech uppercase text-cyan-400 mb-1">
                {language === 'PL' ? 'Współczynnik Wpływu (1-100)' : 'Impact Score (1-100)'}
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={impactScore}
                onChange={e => setImpactScore(parseInt(e.target.value) || 90)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b101e] border border-cyan-500/30 text-white font-mono-tech text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-tech uppercase text-cyan-400 mb-1">
              {language === 'PL' ? 'Krótki Opis Synopsis' : 'Short Synopsis'}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Krótkie podsumowanie wydarzenia widoczne na karcie osi czasu..."
              required
              className="w-full px-3 py-2 rounded-xl bg-[#0b101e] border border-cyan-500/30 text-white font-mono-tech text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-tech uppercase text-cyan-400 mb-1">
              {language === 'PL' ? 'Pełna Narracja Historyczna' : 'Detailed Long Narrative'}
            </label>
            <textarea
              rows={4}
              value={longNarrative}
              onChange={e => setLongNarrative(e.target.value)}
              placeholder="Szczegółowa historia, kontekst architektoniczny i bezpośredni wpływ na ekosystem..."
              className="w-full px-3 py-2 rounded-xl bg-[#0b101e] border border-cyan-500/30 text-white font-mono-tech text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Select Origin World */}
          <div>
            <label className="block text-xs font-mono-tech uppercase text-purple-400 mb-1">
              {language === 'PL' ? 'Powiązany Świat Origin' : 'Origin World'}
            </label>
            <select
              value={worldSlug}
              onChange={e => setWorldSlug(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0b101e] border border-purple-500/30 text-white font-mono-tech text-xs focus:border-purple-400 focus:outline-none"
            >
              {worlds.map(w => (
                <option key={w.slug} value={w.slug}>
                  {w.name} ({w.slug})
                </option>
              ))}
            </select>
          </div>

          {/* Select Architects Involved */}
          <div>
            <label className="block text-xs font-mono-tech uppercase text-cyan-400 mb-1">
              {language === 'PL' ? 'Zaangażowani Architekci' : 'Participating Architects'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 bg-[#080d1a] border border-cyan-500/20 rounded-xl">
              {architects.map(arch => {
                const isSelected = selectedArchitects.includes(arch.id);
                return (
                  <div
                    key={arch.id}
                    onClick={() => toggleArchitect(arch.id)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono-tech cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                        : 'bg-[#0b101e] border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <span className="truncate">{arch.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Select Spawned Projects */}
          <div>
            <label className="block text-xs font-mono-tech uppercase text-amber-400 mb-1">
              {language === 'PL' ? 'Zapoczątkowane Projekty' : 'Groundbreaking Projects Spawned'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-[#080d1a] border border-amber-500/20 rounded-xl">
              {projects.map(proj => {
                const isSelected = selectedProjects.includes(proj.id);
                return (
                  <div
                    key={proj.id}
                    onClick={() => toggleProject(proj.id)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono-tech cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-amber-950/80 border-amber-400 text-amber-300'
                        : 'bg-[#0b101e] border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <span className="truncate">{proj.title}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deliverables Input */}
          <div>
            <label className="block text-xs font-mono-tech uppercase text-emerald-400 mb-1">
              {language === 'PL' ? 'Kluczowe Rezultaty (oddzielone przecinkami)' : 'Key Deliverables (comma separated)'}
            </label>
            <input
              type="text"
              value={keyDeliverablesInput}
              onChange={e => setKeyDeliverablesInput(e.target.value)}
              placeholder="np. RFC-001 Oath Specification, Core Kernel Build, AI Router Microservice"
              className="w-full px-3 py-2 rounded-xl bg-[#0b101e] border border-emerald-500/30 text-white font-mono-tech text-xs focus:border-emerald-400 focus:outline-none"
            />
          </div>

          {/* Quote Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-tech uppercase text-cyan-400 mb-1">
                {language === 'PL' ? 'Cytat Historyczny' : 'Historical Quote'}
              </label>
              <input
                type="text"
                value={quoteText}
                onChange={e => setQuoteText(e.target.value)}
                placeholder="np. Kiedy system przestaje być narzędziem..."
                className="w-full px-3 py-2 rounded-xl bg-[#0b101e] border border-cyan-500/30 text-white font-mono-tech text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-tech uppercase text-cyan-400 mb-1">
                {language === 'PL' ? 'Autor Cytatu' : 'Quote Author'}
              </label>
              <input
                type="text"
                value={quoteAuthor}
                onChange={e => setQuoteAuthor(e.target.value)}
                placeholder={currentArchitect.name}
                className="w-full px-3 py-2 rounded-xl bg-[#0b101e] border border-cyan-500/30 text-white font-mono-tech text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-cyan-500/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                playCyberSound('click');
                if (typeof onClose === 'function') onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-cyber tracking-wider"
            >
              {language === 'PL' ? 'Anuluj' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-cyber font-bold text-xs tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-cyan-300" />
              <span>{language === 'PL' ? 'UWIEECZNIJ REKORD GENESIS' : 'RECORD GENESIS MILESTONE'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
