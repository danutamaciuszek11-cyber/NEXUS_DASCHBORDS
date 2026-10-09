import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import { X, Database, Sparkles, Send, FileText } from 'lucide-react';
import { MemoryCategory } from '../types';

export const NewDocModal: React.FC<{ isOpen: boolean; onClose?: () => void }> = ({
  isOpen,
  onClose = () => {}
}) => {
  const { addMemoryDoc, currentArchitect, playCyberSound, triggerHaptic, language } = useNexus();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<MemoryCategory>('RFC');
  const [tags, setTags] = useState('architecture, rfc, protocol');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addMemoryDoc({
      title: title.trim(),
      category,
      summary: summary.trim() || title.trim(),
      content: content.trim(),
      authorId: currentArchitect.id,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      version: '1.0.0'
    });

    playCyberSound('success');
    triggerHaptic();
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl p-6 rounded-2xl bg-[#090d16] border border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.2)] space-y-5">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h3 className="font-cyber font-bold text-base text-white">
              {language === 'PL' ? 'DODAJ NOWY DOKUMENT RFC DO PAMIĘCI' : 'SUBMIT NEW MEMORY RFC'}
            </h3>
          </div>
          <button onClick={() => { if (typeof onClose === 'function') onClose(); }} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono-tech">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-slate-400">Tytuł Dokumentu *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="np. RFC-012: Dynamic Synapse Balancing"
                className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Kategoria</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as MemoryCategory)}
                className="w-full bg-[#0d131f] border border-cyan-500/20 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
              >
                <option value="RFC">RFC</option>
                <option value="PROTOCOL">PROTOCOL</option>
                <option value="ARCHITECTURE">ARCHITECTURE</option>
                <option value="VISION">VISION</option>
                <option value="GUIDE">GUIDE</option>
                <option value="LORE">LORE</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Streszczenie (Executive Summary)</label>
            <input
              type="text"
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Krótki abstrakt dokumentu..."
              className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Pełna Treść Specyfikacji (Markdown / Text) *</label>
            <textarea
              required
              rows={8}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="# 1. WPROWADZENIE&#10;&#10;Opis założeń i specyfikacja techniczna..."
              className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Tagi (oddzielone przecinkami)</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="synapse, websocket, security, ai"
              className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => { if (typeof onClose === 'function') onClose(); }}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              Zapisz w Nexus Memory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
