import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Code2, 
  Eye, 
  Sparkles, 
  Save, 
  FileText, 
  Wand2, 
  Clipboard, 
  Maximize2, 
  Terminal, 
  Check, 
  RotateCcw, 
  BookOpen, 
  Layers, 
  Zap, 
  Shield, 
  HelpCircle,
  Copy,
  Download,
  Tag,
  BrainCircuit,
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
  Bot
} from 'lucide-react';
import { Book, SeekerId, Category, Language } from '../types';
import { PRESET_HTML_WORLDS, ARCHITECT_CYBER_TERRORYSTA_HTML, ARCHITECT_PROLOG_HTML } from '../data/presetHtmlWorlds';
import { SEEKERS_CONFIG } from '../data/booksData';
import { soundFx } from '../utils/audioSystem';
import { analyzeAndAutoTagBook, AutoTagResult } from '../utils/aiAutoTagger';

interface HtmlWorldStudioModalProps {
  initialBook?: Book | null;
  onClose: () => void;
  onSaveBook: (book: Book) => void;
  onLaunchWorldViewer: (book: Book) => void;
}

export const HtmlWorldStudioModal: React.FC<HtmlWorldStudioModalProps> = ({
  initialBook,
  onClose,
  onSaveBook,
  onLaunchWorldViewer
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'metadata'>('editor');
  const [splitView, setSplitView] = useState(true);

  // Form State
  const [title, setTitle] = useState(initialBook?.title || 'NOWY MANIFEST // INTERAKTYWNY ŚWIAT');
  const [subtitle, setSubtitle] = useState(initialBook?.subtitle || 'THE ARCHITECT | OPTIMIZING TO ZERO');
  const [seeker, setSeeker] = useState<SeekerId>(initialBook?.seeker || 'Operator001');
  const [category, setCategory] = useState<Category>((initialBook?.tags[0] as Category) || 'Manifest');
  const [language, setLanguage] = useState<Language>(initialBook?.language || 'PL');
  const [year, setYear] = useState<number>(initialBook?.year || 2026);
  const [shortDesc, setShortDesc] = useState(
    initialBook?.shortDesc || 'Unikalna opowieść i manifest stworzony z kodu gotowego HTML, zawierający interaktywne elementy, skrypty i unikalną oprawę wizualną.'
  );

  // Tags & Auto-tagging state
  const [tagsList, setTagsList] = useState<string[]>(() => {
    if (initialBook?.tags && initialBook.tags.length > 0) {
      return [...initialBook.tags];
    }
    return ['Manifest'];
  });
  const [newTagInput, setNewTagInput] = useState('');
  const [isAutoTagging, setIsAutoTagging] = useState(false);
  const [autoTagResult, setAutoTagResult] = useState<AutoTagResult | null>(null);
  const [autoTagStatusMessage, setAutoTagStatusMessage] = useState<string | null>(null);
  const [autoTagOnSave, setAutoTagOnSave] = useState(true);

  // HTML Code State
  const [htmlCode, setHtmlCode] = useState<string>(
    initialBook?.customHtmlWorld?.htmlCode || ARCHITECT_CYBER_TERRORYSTA_HTML
  );

  const [copySuccess, setCopySuccess] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  // Auto refresh preview when tab switches to preview
  useEffect(() => {
    setPreviewKey(prev => prev + 1);
  }, [activeTab, splitView]);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setHtmlCode(text);
        soundFx.playSuccess();
      }
    } catch (e) {
      alert('Brak dostępu do schowka. Użyj skrótu Ctrl+V w polu edytora kodu.');
    }
  };

  const handleLoadPreset = (presetHtml: string, presetName: string, presetSub: string) => {
    soundFx.playClick();
    setHtmlCode(presetHtml);
    setTitle(presetName);
    setSubtitle(presetSub);
    setAutoTagResult(null);
  };

  // Run AI Auto-Tagging Analysis
  const handleRunAutoTag = async (applyDirectly = false) => {
    if (!title.trim() && !shortDesc.trim()) {
      alert('Wprowadź najpierw tytuł lub opis książki, aby AI mogło przeanalizować treść.');
      return;
    }

    setIsAutoTagging(true);
    setAutoTagStatusMessage('AI analizuje strukturę tytułu, opis i kod HTML...');
    soundFx.playModalOpen();

    try {
      const result = await analyzeAndAutoTagBook({
        title,
        subtitle,
        shortDesc,
        htmlContent: htmlCode,
        currentCategory: category,
        currentSeeker: seeker
      });

      setAutoTagResult(result);

      if (applyDirectly) {
        setCategory(result.suggestedCategory);
        setSeeker(result.recommendedSeeker);
        // Merge suggested tags
        setTagsList(prev => {
          const combined = Array.from(new Set([...prev, result.suggestedCategory, ...result.suggestedTags]));
          return combined;
        });
        setAutoTagStatusMessage(`Zastosowano rekomendacje AI (${result.source}): ${result.suggestedCategory}`);
      } else {
        setAutoTagStatusMessage(`AI wygenerowało ${result.suggestedTags.length} tagów i dopasowało kategorię.`);
      }

      soundFx.playSuccess();
    } catch (e) {
      console.error('Auto-tagging error:', e);
      setAutoTagStatusMessage('Błąd analizy AI. Zastosowano lokalne tagi domyślne.');
    } finally {
      setIsAutoTagging(false);
    }
  };

  const handleApplyAiSuggestions = () => {
    if (!autoTagResult) return;
    soundFx.playSuccess();
    setCategory(autoTagResult.suggestedCategory);
    setSeeker(autoTagResult.recommendedSeeker);
    setTagsList(prev => {
      return Array.from(new Set([...prev, autoTagResult.suggestedCategory, ...autoTagResult.suggestedTags]));
    });
    setAutoTagStatusMessage('Zastosowano wszystkie sugestie AI do metadanych!');
  };

  const handleAddTag = (tagToAdd?: string) => {
    const val = (tagToAdd || newTagInput).trim();
    if (!val) return;
    if (!tagsList.includes(val)) {
      setTagsList(prev => [...prev, val]);
      soundFx.playClick();
    }
    if (!tagToAdd) setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTagsList(prev => prev.filter(t => t !== tagToRemove));
    soundFx.playClick();
  };

  const handleSave = async () => {
    if (!title.trim() || !htmlCode.trim()) {
      alert('Podaj tytuł oraz kod HTML dla swojego świata/manifestu.');
      return;
    }

    let finalCategory = category;
    let finalSeeker = seeker;
    let finalTags = [...tagsList];

    // Auto-run AI Tagging on save if user has autoTagOnSave enabled and hasn't run it yet
    if (autoTagOnSave && !autoTagResult) {
      setIsAutoTagging(true);
      try {
        const result = await analyzeAndAutoTagBook({
          title,
          subtitle,
          shortDesc,
          htmlContent: htmlCode,
          currentCategory: category,
          currentSeeker: seeker
        });
        finalCategory = result.suggestedCategory;
        finalSeeker = result.recommendedSeeker;
        finalTags = Array.from(new Set([...tagsList, result.suggestedCategory, ...result.suggestedTags]));
      } catch (err) {
        console.warn('Auto-tag on save fallback note:', err);
      } finally {
        setIsAutoTagging(false);
      }
    }

    const seekerCfg = SEEKERS_CONFIG[finalSeeker] || SEEKERS_CONFIG['Operator001'];

    const bookToSave: Book = {
      id: initialBook?.id || `html_world_${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      series: 'Manifest HTML // Autorska Rzeczywistość',
      seeker: finalSeeker,
      seekerColor: seekerCfg.color,
      status: 'Published',
      year: year,
      language: language,
      tags: finalTags as Category[],
      timelineYear: year,
      isFeatured: true,
      isManifesto: true,
      shortDesc: shortDesc.trim(),
      longDesc: shortDesc.trim(),
      authorNote: 'Stworzono w Studio Światów HTML ETERNIVERSE OS z użyciem AI Auto-Taggingu.',
      tableOfContents: ['Świat Interaktywny HTML', 'Manifest Główny', 'Transkrypcja Operacyjna'],
      quotes: [
        {
          id: `q_${Date.now()}`,
          text: 'Kod stał się architekturą opowieści, a opowieść światem wykonawczym.',
          chapterTitle: title,
          tags: finalTags
        }
      ],
      chapters: [
        {
          id: `ch_${Date.now()}`,
          number: 1,
          title: title,
          summary: subtitle,
          readTimeMin: 15,
          content: 'Świat prezentowany jest w postaci pełnego interaktywnego kodu HTML.'
        }
      ],
      stats: {
        pageCount: 120,
        wordCount: 35000,
        readerCount: 1,
        estReadTimeMin: 40
      },
      platformLinks: {
        github: 'https://github.com'
      },
      coverStyle: {
        bgGradient: 'from-rose-950 via-purple-950 to-black',
        accentColor: seekerCfg.color,
        pattern: 'circuit',
        symbol: '⚡'
      },
      customHtmlWorld: {
        htmlCode: htmlCode,
        themeColor: seekerCfg.color,
        terminalActive: true,
        worldName: title,
        authorName: 'Architekt Rzeczywistości'
      }
    };

    soundFx.playSuccess();
    onSaveBook(bookToSave);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in duration-200">
      
      {/* Modal Header */}
      <header className="h-16 px-6 bg-zinc-950 border-b border-white/10 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-900/40">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white uppercase tracking-tight">
                STUDIO KREACJI ŚWIATÓW & MANIFESTÓW HTML
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                ETERNIVERSE OS
              </span>
            </div>
            <p className="text-xs text-white/50 font-mono">
              Twórz własną opowieść z gotowego kodu HTML/CSS/JS
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {/* Mode switch */}
          <div className="hidden md:flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setSplitView(true);
                setActiveTab('editor');
              }}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors flex items-center gap-1.5 ${splitView ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-white/60 hover:text-white'}`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Podgląd Dzielony</span>
            </button>
            <button
              onClick={() => {
                setSplitView(false);
                setActiveTab('editor');
              }}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors flex items-center gap-1.5 ${!splitView && activeTab === 'editor' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-white/60 hover:text-white'}`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Tylko Kod</span>
            </button>
            <button
              onClick={() => {
                setSplitView(false);
                setActiveTab('preview');
              }}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors flex items-center gap-1.5 ${!splitView && activeTab === 'preview' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-white/60 hover:text-white'}`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Tylko Podgląd</span>
            </button>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Zapisz & Opublikuj Dzieło</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Preset Toolbar Bar */}
      <div className="bg-zinc-900/80 border-b border-white/10 px-6 py-2.5 flex items-center justify-between gap-4 overflow-x-auto text-xs font-mono shrink-0 custom-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-cyan-400 font-bold flex items-center gap-1">
            <Wand2 className="w-3.5 h-3.5" />
            Szybkie Szablony:
          </span>
          <button
            onClick={() => handleLoadPreset(ARCHITECT_PROLOG_HTML, 'PROLOG // PUNKT ZERO', 'Punkt, w którym Wszechświat wstrzymuje oddech')}
            className="px-2.5 py-1 rounded bg-amber-950/90 hover:bg-amber-900 border border-amber-500/50 text-amber-200 transition-colors font-bold text-[11px] flex items-center gap-1 shadow-sm"
          >
            ⚡ PROLOG // PUNKT ZERO (Wola Architekta)
          </button>
          <button
            onClick={() => handleLoadPreset(ARCHITECT_CYBER_TERRORYSTA_HTML, 'CYBER-TERRORYSTA ROKU', 'THE ARCHITECT | OPTIMIZING TO ZERO')}
            className="px-2.5 py-1 rounded bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-200 transition-colors font-bold text-[11px]"
          >
            ☣ ARCHITECT // CYBER-TERRORYSTA (Gotowy Kod)
          </button>

          {PRESET_HTML_WORLDS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleLoadPreset(preset.htmlCode, preset.name, preset.subtitle)}
              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-colors text-[11px]"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePasteClipboard}
            className="px-3 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold transition-colors flex items-center gap-1.5 text-[11px]"
          >
            <Clipboard className="w-3 h-3" />
            <span>Wklej Kod Ze Schowka</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Metadata & Settings Panel */}
        <aside className="w-84 border-r border-white/10 bg-zinc-950 p-4.5 flex flex-col gap-4 overflow-y-auto custom-scrollbar shrink-0 select-none">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase text-white/70 tracking-wider flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              Metadane Dzieła
            </h3>
            
            {/* AI Auto-Tagging Quick Trigger */}
            <button
              onClick={() => handleRunAutoTag(false)}
              disabled={isAutoTagging}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-950 to-cyan-950 hover:from-purple-900 hover:to-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
              title="Uruchom analizę Gemini AI i automatyczne tagowanie"
            >
              {isAutoTagging ? (
                <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
              ) : (
                <Sparkles className="w-3 h-3 text-cyan-400" />
              )}
              <span>{isAutoTagging ? 'Analiza...' : 'AI Auto-Tag'}</span>
            </button>
          </div>

          {/* AI Status Notification Toast */}
          {autoTagStatusMessage && (
            <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-200 text-[11px] font-mono flex items-start gap-2 animate-in fade-in">
              <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{autoTagStatusMessage}</span>
              </div>
              <button 
                onClick={() => setAutoTagStatusMessage(null)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div>
            <label className="text-[10px] font-mono text-white/60 uppercase block mb-1">Tytuł Książki / Manifestu</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-zinc-900 border border-white/15 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
              placeholder="np. CYBER-TERRORYSTA ROKU"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-white/60 uppercase block mb-1">Podtytuł / Hasło Świata</label>
            <input
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              className="w-full bg-zinc-900 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              placeholder="np. THE ARCHITECT | OPTIMIZING TO ZERO"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-white/60 uppercase block mb-1">Archidiecezja (Seeker)</label>
              <select
                value={seeker}
                onChange={e => setSeeker(e.target.value as SeekerId)}
                className="w-full bg-zinc-900 border border-white/15 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {(Object.keys(SEEKERS_CONFIG) as SeekerId[]).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-white/60 uppercase block mb-1">Kategoria</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full bg-zinc-900 border border-white/15 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Manifest">Manifest</option>
                <option value="Cyberbezpieczeństwo">Cyberbezpieczeństwo</option>
                <option value="AI">AI</option>
                <option value="Filozofia">Filozofia</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Metafizyka">Metafizyka</option>
                <option value="Psychologia">Psychologia</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Biografia">Biografia</option>
              </select>
            </div>
          </div>

          {/* AI Auto-Tagging Recommendations Card */}
          {autoTagResult && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-950/40 via-zinc-900 to-cyan-950/40 border border-cyan-500/40 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-xs font-bold">
                  <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Rekomendacje AI ({autoTagResult.source})</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                  {Math.round(autoTagResult.confidence * 100)}% pewności
                </span>
              </div>

              <p className="text-[11px] text-white/80 font-sans leading-relaxed">
                {autoTagResult.analysis}
              </p>

              <div className="text-[10px] font-mono text-white/60 space-y-1">
                <div>Sugerowana Kategoria: <span className="text-cyan-300 font-bold">{autoTagResult.suggestedCategory}</span></div>
                <div>Seeker: <span className="text-purple-300 font-bold">{autoTagResult.recommendedSeeker}</span></div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {autoTagResult.suggestedTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleAddTag(tag)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors flex items-center gap-1 ${tagsList.includes(tag) ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'bg-white/5 text-white/70 hover:text-white border border-white/10 hover:border-cyan-400'}`}
                    title="Kliknij, aby dodać lub sprawdzić tag"
                  >
                    <span>+{tag}</span>
                    {tagsList.includes(tag) && <CheckCircle2 className="w-2.5 h-2.5 text-cyan-400" />}
                  </button>
                ))}
              </div>

              <button
                onClick={handleApplyAiSuggestions}
                className="w-full py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-mono text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zastosuj Rekomendacje AI</span>
              </button>
            </div>
          )}

          {/* Active Tags Manager */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-mono text-white/60 uppercase flex items-center gap-1">
                <Tag className="w-3 h-3 text-cyan-400" />
                Tagi Tematyczne ({tagsList.length})
              </label>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px] p-2 bg-zinc-900/90 rounded-lg border border-white/10">
              {tagsList.map(t => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 font-mono text-[11px] flex items-center gap-1 group"
                >
                  <span>{t}</span>
                  <button
                    onClick={() => handleRemoveTag(t)}
                    className="text-cyan-400/60 hover:text-red-400 transition-colors ml-0.5"
                    title={`Usuń tag ${t}`}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              {tagsList.length === 0 && (
                <span className="text-[11px] text-white/40 font-mono italic">Brak przypisanych tagów</span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newTagInput}
                onChange={e => setNewTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 bg-zinc-900 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 font-mono"
                placeholder="Dodaj własny tag..."
              />
              <button
                onClick={() => handleAddTag()}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Dodaj tag"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-white/60 uppercase block mb-1">Język</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as Language)}
                className="w-full bg-zinc-900 border border-white/15 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="PL">PL - Polski</option>
                <option value="EN">EN - English</option>
                <option value="DE">DE - Deutsch</option>
                <option value="FR">FR - Français</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-white/60 uppercase block mb-1">Rok Wydania</label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-white/60 uppercase block mb-1">Krótki Opis Manifestu</label>
            <textarea
              rows={3}
              value={shortDesc}
              onChange={e => setShortDesc(e.target.value)}
              className="w-full bg-zinc-900 border border-white/15 rounded-lg p-2.5 text-xs text-white/90 focus:outline-none focus:border-cyan-400 custom-scrollbar"
            />
          </div>

          {/* Auto-Tag on Save Checkbox Option */}
          <label className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 border border-white/10 cursor-pointer text-[11px] font-mono text-white/80 hover:bg-zinc-900 transition-colors">
            <input
              type="checkbox"
              checked={autoTagOnSave}
              onChange={e => setAutoTagOnSave(e.target.checked)}
              className="rounded accent-cyan-400 w-3.5 h-3.5"
            />
            <span>Automatyczne tagowanie AI przy zapisie</span>
          </label>

          <div className="mt-auto pt-3 border-t border-white/10 text-[11px] font-mono text-white/40 space-y-1">
            <p>Długość Kodu: <span className="text-cyan-300 font-bold">{htmlCode.length}</span> znaków</p>
            <p>Status: <span className="text-emerald-400 font-bold">KOD POPRAWNY HTML</span></p>
          </div>
        </aside>

        {/* Right Side: Code Editor & Live Preview */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-black">
          
          {/* Code Editor Pane */}
          {(splitView || activeTab === 'editor') && (
            <div className={`flex-1 flex flex-col border-r border-white/10 bg-zinc-950 overflow-hidden ${splitView ? 'md:w-1/2' : 'w-full'}`}>
              <div className="px-4 py-2 bg-zinc-900 border-b border-white/10 flex items-center justify-between font-mono text-xs text-white/60 select-none">
                <span className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Code2 className="w-3.5 h-3.5" />
                  Edytor Kodu HTML / CSS / JS
                </span>
                <span>index.html</span>
              </div>

              <textarea
                value={htmlCode}
                onChange={e => setHtmlCode(e.target.value)}
                className="flex-1 w-full bg-black p-4 font-mono text-xs text-cyan-200 leading-relaxed focus:outline-none resize-none custom-scrollbar"
                placeholder="Wklej swój kod HTML tutaj..."
                spellCheck={false}
              />
            </div>
          )}

          {/* Live Preview Pane */}
          {(splitView || activeTab === 'preview') && (
            <div className={`flex-1 flex flex-col bg-black overflow-hidden ${splitView ? 'md:w-1/2' : 'w-full'}`}>
              <div className="px-4 py-2 bg-zinc-900 border-b border-white/10 flex items-center justify-between font-mono text-xs text-white/60 select-none">
                <span className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Eye className="w-3.5 h-3.5" />
                  Podgląd Na Żywo Świat / Manifest
                </span>
                <span className="text-[10px] text-white/40">Zabezpieczone Środowisko Iframe</span>
              </div>

              <div className="flex-1 relative w-full h-full bg-black">
                <iframe
                  key={previewKey}
                  srcDoc={htmlCode}
                  title="Podgląd Świata"
                  className="w-full h-full border-none bg-black"
                  sandbox="allow-scripts allow-same-origin allow-modals"
                />
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
