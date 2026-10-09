import React, { useState } from 'react';
import ReactMarkdown from '../shims/react-markdown';
import { useNexus } from '../context/NexusContext';
import { SemanticMemoryDrawer } from '../components/SemanticMemoryDrawer';
import { semanticMemoryEngine } from '../lib/semanticMemoryEngine';
import {
  Database,
  Plus,
  Search,
  BookOpen,
  Shield,
  Tag,
  CheckCircle2,
  FileText,
  Bot,
  ArrowRight,
  Sparkles,
  Zap,
  Layers,
  Activity,
  Cpu
} from 'lucide-react';

export const MemoryView: React.FC<{ onOpenNewDocModal?: () => void }> = ({
  onOpenNewDocModal = () => {}
}) => {
  const {
    memoryDocs,
    architects,
    worlds,
    addMemoryDoc,
    setCurrentView,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const [viewMode, setViewMode] = useState<'STANDARD' | 'CLUSTERING_ENGINE'>('STANDARD');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeDocId, setActiveDocId] = useState<string>(memoryDocs[0]?.id || '');

  const categories = ['ALL', 'PROTOCOL', 'ARCHITECTURE', 'VISION', 'RFC', 'GUIDE', 'LORE'] as const;

  const filteredDocs = memoryDocs.filter(d => {
    const matchesSearch = (d.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.summary || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.tags || []).some(t => (t || '').toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'ALL' || d.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const activeDoc = memoryDocs.find(d => d.id === activeDocId) || filteredDocs[0];
  const author = architects.find(a => a.id === activeDoc?.authorId);
  const telemetry = semanticMemoryEngine.getTelemetry();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Memory HUD Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0a0f1d] to-purple-950/40 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950/80 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.4)]">
            <Database className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-cyber font-bold text-xl sm:text-2xl text-white tracking-wide">
                NEXUS MEMORY
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                LIVING RFC REPOSITORY
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>SEMANTIC CACHE: {telemetry.avgRetrievalLatencyMs}ms (L1 WARM)</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono-tech mt-0.5">
              {language === 'PL'
                ? 'Baza wiedzy, protokoły architektoniczne i klastry semantyczne zweryfikowane przez State Bella'
                : 'Living memory base, architectural protocols, and semantic clusters verified by State Bella'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#0d131f] p-1 rounded-xl border border-cyan-500/20 font-mono-tech text-xs">
            <button
              onClick={() => {
                setViewMode('STANDARD');
                playCyberSound('click');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'STANDARD'
                  ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dokumenty RFC
            </button>
            <button
              onClick={() => {
                setViewMode('CLUSTERING_ENGINE');
                playCyberSound('click');
                triggerHaptic();
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'CLUSTERING_ENGINE'
                  ? 'bg-gradient-to-r from-cyan-500/40 to-purple-600/40 text-cyan-200 font-bold border border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Silnik Klastrowania & Cache</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (typeof onOpenNewDocModal === 'function') {
                onOpenNewDocModal();
              }
              playCyberSound('beep');
              triggerHaptic();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)]"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'PL' ? 'Dodaj RFC / Protokół' : 'Submit New RFC'}</span>
          </button>
        </div>
      </div>

      {viewMode === 'CLUSTERING_ENGINE' ? (
        <SemanticMemoryDrawer
          onSelectDocForChat={(doc) => {
            setCurrentView('BELLA');
            playCyberSound('node');
            triggerHaptic();
          }}
        />
      ) : (
        <>
          {/* Category Pills & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-b border-cyan-500/15 pb-3">
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    playCyberSound('click');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono-tech transition-all shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold'
                      : 'bg-[#0d131f] text-slate-400 border border-cyan-500/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={language === 'PL' ? 'Szukaj w pamięci...' : 'Search Memory...'}
                className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Two Column Layout: Doc List & Active Doc Reader */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Document List (4 cols) */}
            <div className="lg:col-span-4 space-y-3 max-h-[700px] overflow-y-auto pr-1">
              {filteredDocs.map(doc => {
                const isSelected = activeDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setActiveDocId(doc.id);
                      playCyberSound('click');
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-cyan-950/30 border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                        : 'bg-[#090d16] border-cyan-500/15 hover:border-cyan-500/30 hover:bg-cyan-950/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                        {doc.category}
                      </span>
                      <span className="text-[10px] font-mono-tech text-slate-500">v{doc.version}</span>
                    </div>

                    <h3 className="font-cyber font-bold text-xs text-white line-clamp-1">
                      {doc.title}
                    </h3>

                    <p className="text-[11px] text-slate-400 line-clamp-2 font-sans">
                      {doc.summary}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-500 pt-1">
                      <span>{doc.lastUpdated}</span>
                      {doc.verifiedByBella && (
                        <span className="text-cyan-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Bella Verified
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Document Reader (8 cols) */}
            <div className="lg:col-span-8">
              {activeDoc ? (
                <div className="p-6 rounded-2xl bg-[#090d16] border border-cyan-500/25 space-y-6">
                  {/* Document Header */}
                  <div className="border-b border-cyan-500/20 pb-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono-tech">
                          {activeDoc.category} // v{activeDoc.version}
                        </span>
                        {activeDoc.verifiedByBella && (
                          <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono-tech flex items-center gap-1">
                            <Bot className="w-3 h-3" /> BELLA VERIFIED RFC
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono-tech text-slate-400">
                        Updated: {activeDoc.lastUpdated}
                      </span>
                    </div>

                    <h1 className="font-cyber font-bold text-xl sm:text-2xl text-white">
                      {activeDoc.title}
                    </h1>

                    <p className="text-xs sm:text-sm font-sans text-cyan-200/90 leading-relaxed italic bg-[#0d131f] p-3 rounded-xl border border-cyan-500/15">
                      "{activeDoc.summary}"
                    </p>
                  </div>

                  {/* Document Body */}
                  <div className="space-y-4 text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="font-cyber font-bold text-lg sm:text-xl text-cyan-300 pt-3 pb-1 border-b border-cyan-500/20 mb-3">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="font-cyber font-bold text-base sm:text-lg text-white pt-3 pb-1 mb-2">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="font-cyber font-semibold text-sm sm:text-base text-cyan-200 pt-2 pb-1 mb-1.5">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-slate-300 leading-relaxed mb-3">
                            {children}
                          </p>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-cyan-400 pl-3.5 py-1.5 my-3 text-slate-300 italic bg-cyan-950/20 rounded-r-lg">
                            {children}
                          </blockquote>
                        ),
                        ul: ({ children }) => (
                          <ul className="space-y-1.5 my-2.5 pl-2 list-none">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="space-y-1.5 my-2.5 pl-2 list-none counter-reset-item">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="flex items-start gap-2 text-slate-300 text-xs sm:text-sm">
                            <span className="text-cyan-400 font-mono-tech select-none font-bold mt-0.5">•</span>
                            <div className="leading-relaxed">{children}</div>
                          </li>
                        ),
                        strong: ({ children }) => (
                          <strong className="text-cyan-200 font-semibold">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="text-slate-200 italic">{children}</em>
                        ),
                        hr: () => (
                          <hr className="my-4 border-cyan-500/20" />
                        ),
                        code: ({ children }) => (
                          <code className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono-tech text-xs">
                            {children}
                          </code>
                        )
                      }}
                    >
                      {activeDoc.content}
                    </ReactMarkdown>
                  </div>

                  {/* Tags */}
                  <div className="pt-4 border-t border-cyan-500/15 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono-tech text-slate-400">Tags:</span>
                    {activeDoc.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-[#0d131f] border border-cyan-500/15 text-[11px] font-mono-tech text-cyan-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 font-mono-tech text-xs">
                  No document selected.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

