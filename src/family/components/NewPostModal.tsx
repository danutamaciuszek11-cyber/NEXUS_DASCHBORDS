import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import { X, Radio, Code, Sparkles, Send } from 'lucide-react';
import { FeedCategory } from '../types';

export const NewPostModal: React.FC<{ isOpen: boolean; onClose?: () => void }> = ({
  isOpen,
  onClose = () => {}
}) => {
  const { addFeedPost, playCyberSound, triggerHaptic, language } = useNexus();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<FeedCategory>('UPDATE');
  const [hasCode, setHasCode] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLang, setCodeLang] = useState('typescript');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addFeedPost({
      title: title.trim(),
      content: content.trim(),
      category,
      tags: ['nexus', category.toLowerCase()],
      codeSnippet: hasCode && codeSnippet.trim() ? { language: codeLang, code: codeSnippet.trim() } : undefined
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
            <Radio className="w-5 h-5 text-cyan-400" />
            <h3 className="font-cyber font-bold text-base text-white">
              {language === 'PL' ? 'NOWY WPIS W BUILDER FEED' : 'NEW BUILDER UPDATE'}
            </h3>
          </div>
          <button onClick={() => { if (typeof onClose === 'function') onClose(); }} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono-tech">
          <div className="space-y-1">
            <label className="text-slate-400">Tytuł Wpisu *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="np. Wdrożenie nowego synaptycznego routingu"
              className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Kategoria</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as FeedCategory)}
              className="w-full bg-[#0d131f] border border-cyan-500/20 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
            >
              <option value="UPDATE">UPDATE</option>
              <option value="IDEA">IDEA</option>
              <option value="PROJECT">PROJECT</option>
              <option value="QUESTION">QUESTION</option>
              <option value="DISCOVERY">DISCOVERY</option>
              <option value="RELEASE">RELEASE</option>
              <option value="CODE">CODE</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Treść Wpisu *</label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Opisz postęp, odkrycie lub zadaj pytanie..."
              className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none font-sans"
            />
          </div>

          {/* Toggle Code Snippet */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hasCode}
                onChange={e => setHasCode(e.target.checked)}
                className="rounded border-cyan-500/40 text-cyan-500 focus:ring-0"
              />
              <span>Dołącz fragment kodu źródłowego (Code Snippet)</span>
            </label>

            {hasCode && (
              <div className="space-y-2 p-3 rounded-xl bg-[#06080e] border border-cyan-500/20">
                <input
                  type="text"
                  value={codeLang}
                  onChange={e => setCodeLang(e.target.value)}
                  placeholder="Język (np. typescript, python, rust, solidity)"
                  className="w-full bg-[#0d131f] border border-cyan-500/20 rounded-lg px-2.5 py-1 text-[11px] text-cyan-300 focus:outline-none"
                />
                <textarea
                  rows={4}
                  value={codeSnippet}
                  onChange={e => setCodeSnippet(e.target.value)}
                  placeholder="// Wklej kod źródłowy..."
                  className="w-full bg-[#0d131f] border border-cyan-500/20 rounded-lg p-2.5 text-xs text-cyan-200 font-mono-tech focus:outline-none"
                />
              </div>
            )}
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
              Opublikuj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
