import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Globe, 
  User, 
  Share2, 
  Briefcase, 
  Search, 
  Copy, 
  Check, 
  Wand2, 
  Users, 
  Feather, 
  Image as ImageIcon, 
  Send, 
  Radio, 
  Lightbulb, 
  Target, 
  Zap, 
  Flame, 
  Layers, 
  Cpu, 
  Bookmark,
  Compass,
  Download
} from 'lucide-react';
import { soundFx } from '../utils/audioSystem';

interface NeuralContentArchitectModalProps {
  onClose: () => void;
  onAddGeneratedBookToLibrary?: (bookData: any) => void;
}

export type ArchitectMode = 'author' | 'worldbuilder' | 'character' | 'content' | 'business' | 'research';

export const NeuralContentArchitectModal: React.FC<NeuralContentArchitectModalProps> = ({
  onClose,
  onAddGeneratedBookToLibrary
}) => {
  // Wizard & Creation Flow State
  const [activeTab, setActiveTab] = useState<'creation' | 'social' | 'intelligence' | 'visual' | 'publication' | 'scratchpad'>('creation');
  const [selectedMode, setSelectedMode] = useState<ArchitectMode>('author');
  
  // Human Scratchpad state
  const [humanScratchpad, setHumanScratchpad] = useState<string>(() => {
    try {
      return localStorage.getItem('nexusbook_human_scratchpad') || '';
    } catch {
      return '';
    }
  });
  const [scratchpadSaved, setScratchpadSaved] = useState<boolean>(false);
  
  // 3-Step Guided Wizard State
  const [step1Goal, setStep1Goal] = useState<string>('stworzyć dzieło');
  const [step2Role, setStep2Role] = useState<string>('pisarz');
  const [step3Result, setStep3Result] = useState<string>('książka');

  // Input fields for prompt generation
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [voiceStyle, setVoiceStyle] = useState<string>('filmowy');
  const [visualStyle, setVisualStyling] = useState<string>('cyberpunk');
  const [targetPlatform, setTargetPlatform] = useState<string>('Amazon KDP & Ebook');
  
  // Specific Sub-option choices
  const [genreOption, setGenreOption] = useState<string>('Sci-Fi / Cyberpunk');
  const [worldAspect, setWorldAspect] = useState<string>('Historia & Technologia');
  const [characterArchetype, setCharacterArchetype] = useState<string>('Buntownik z Traumą');
  const [contentType, setContentType] = useState<string>('Scenariusz Wideo / Podcast');

  // Social connection query
  const [collaboratorQuery, setCollaboratorQuery] = useState<string>('potrzebuję redaktora i ilustratora do powieści sci-fi');

  // Generation result & state
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesisOutput, setSynthesisOutput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Keyboard shortcut ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSynthesizing) {
        soundFx.playModalClose();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isSynthesizing]);

  const handleRunSynthesis = async () => {
    soundFx.playExport();
    setIsSynthesizing(true);
    setSynthesisOutput('');

    const fullPrompt = customPrompt.trim() 
      ? customPrompt 
      : `Stwórz wizję dla [Tryb: ${selectedMode}], Kategoria: ${genreOption || worldAspect || characterArchetype}, Cel: ${step1Goal}, Rola: ${step2Role}, Rezultat: ${step3Result}.`;

    try {
      const response = await fetch('/api/architect/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: selectedMode,
          userRole: step2Role,
          goal: step1Goal,
          resultType: step3Result,
          prompt: fullPrompt,
          voiceStyle,
          visualStyle,
          targetPlatform
        })
      });

      const data = await response.json();
      if (data && data.success && data.result) {
        setSynthesisOutput(data.result);
        soundFx.playClick();
      } else {
        throw new Error('Fallback trigger');
      }
    } catch (err) {
      // Local Client-side High-Grade Neural Generator Fallback
      setSynthesisOutput(generateClientSynthesis(
        selectedMode,
        step2Role,
        step1Goal,
        step3Result,
        fullPrompt,
        voiceStyle,
        visualStyle,
        targetPlatform,
        genreOption
      ));
      soundFx.playClick();
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleCopyOutput = () => {
    if (!synthesisOutput) return;
    navigator.clipboard.writeText(synthesisOutput);
    soundFx.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMarkdown = () => {
    if (!synthesisOutput) return;
    soundFx.playExport();
    const blob = new Blob([synthesisOutput], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusbook_architect_${selectedMode}_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 md:p-6 overflow-hidden animate-in fade-in duration-300 font-sans select-none">
      
      {/* Background Neon Aura */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-6xl h-[92vh] bg-slate-950/90 border border-purple-500/30 rounded-2xl shadow-[0_0_80px_rgba(112,0,255,0.25)] overflow-hidden flex flex-col">
        
        {/* Top Header Bar */}
        <header className="px-6 py-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-cyan-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white uppercase font-mono bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                  NEXUSBOOK NEURAL ARCHITECT
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 border border-purple-500/50 text-purple-300 font-bold">
                  v2.5 AI STUDIO
                </span>
              </div>
              <p className="text-[11px] font-mono text-cyan-400 tracking-wider">
                CREATE. CONNECT. DISCOVER. EVOLVE.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playModalClose();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer"
            title="Zamknij (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Creator-First Philosophy Banner */}
        <div className="bg-gradient-to-r from-purple-950/90 via-slate-900 to-cyan-950/90 border-b border-purple-500/30 px-6 py-2 flex items-center justify-between text-xs font-mono shrink-0">
          <div className="flex items-center gap-2 text-purple-200 font-medium">
            <Feather className="w-4 h-4 text-cyan-400 shrink-0" />
            <span><strong>CREATOR-FIRST PHILOSOPHY:</strong> AI to wsparcie i doradca — całą treść, styl i emocje tworzy <strong>CZŁOWIEK</strong>.</span>
          </div>
          <span className="text-[10px] text-cyan-300 font-bold hidden md:inline bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
            HUMAN-CENTERED AI CO-PILOT
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="px-6 py-2.5 bg-slate-900/50 border-b border-white/10 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0 font-mono text-xs">
          {[
            { id: 'creation', label: '01. CORE CREATION MODES', icon: Wand2 },
            { id: 'social', label: '02. SOCIAL ENGINE', icon: Users },
            { id: 'intelligence', label: '03. CREATIVE INTELLIGENCE', icon: Feather },
            { id: 'visual', label: '04. VISUAL SYNTHESIS', icon: ImageIcon },
            { id: 'publication', label: '05. PUBLICATION & BRAND', icon: Bookmark },
            { id: 'scratchpad', label: '06. BRULION PISARZA (HUMAN DRAFT)', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`px-4 py-2 rounded-xl border font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30 scale-102'
                    : 'bg-slate-900/80 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Main Body Grid: Sidebar & Output */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-[440px_1fr]">
          
          {/* LEFT CONTROL PANEL */}
          <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar border-b lg:border-b-0 lg:border-r border-white/10 space-y-6 bg-slate-950/60 font-sans">
            
            {/* 3-STEP USER CREATION FLOW (WIZARD) */}
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-purple-300 font-bold uppercase tracking-wider">
                <Target className="w-4 h-4 text-purple-400" />
                <span>USER CREATION FLOW (INICJACJA INTENCJI)</span>
              </div>

              {/* Step 1: Goal */}
              <div>
                <label className="block text-[10px] text-slate-400 uppercase mb-1">1. Jaki jest cel?</label>
                <select
                  value={step1Goal}
                  onChange={(e) => setStep1Goal(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="stworzyć dzieło">Stworzyć dzieło (Książka / Świat)</option>
                  <option value="zdobyć odbiorców">Zdobyć odbiorców (Social / Newsletter)</option>
                  <option value="znaleźć współpracowników">Znaleźć współpracowników (Networking)</option>
                  <option value="zbudować markę">Zbudować markę osobistą</option>
                  <option value="nauczyć się">Nauczyć się / Zrobić research</option>
                  <option value="sprzedać produkt">Sprzedać produkt / Ofertę</option>
                  <option value="stworzyć społeczność">Stworzyć społeczność twórczą</option>
                </select>
              </div>

              {/* Step 2: Role */}
              <div>
                <label className="block text-[10px] text-slate-400 uppercase mb-1">2. Kim jest użytkownik?</label>
                <select
                  value={step2Role}
                  onChange={(e) => setStep2Role(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="pisarz">Pisarz / Author</option>
                  <option value="twórca światów">Twórca światów / World Builder</option>
                  <option value="artysta">Artysta / Ilustrator</option>
                  <option value="przedsiębiorca">Przedsiębiorca / Marka</option>
                  <option value="badacz">Badacz / Edukator</option>
                  <option value="twórca internetowy">Twórca Internetowy / Content Creator</option>
                  <option value="programista">Programista / Inżynier</option>
                </select>
              </div>

              {/* Step 3: Result */}
              <div>
                <label className="block text-[10px] text-slate-400 uppercase mb-1">3. Jaki rezultat ma powstać?</label>
                <select
                  value={step3Result}
                  onChange={(e) => setStep3Result(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="książka">Książka / Powieść / Poradnik</option>
                  <option value="uniwersum">Uniwersum / World Bible</option>
                  <option value="artykuł">Artykuł / Newsletter / Post</option>
                  <option value="projekt społeczności">Społeczność / Grupa</option>
                  <option value="biznes">Biznes / Pitch Deck / Oferta</option>
                  <option value="kampania">Kampania Marketingowa</option>
                </select>
              </div>
            </div>

            {/* TAB CONTENT: 01. CORE CREATION MODES */}
            {activeTab === 'creation' && (
              <div className="space-y-5">
                <div className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-cyan-400" />
                  <span>WYBIERZ TRYB ARCHITEKTA:</span>
                </div>

                {/* 6 Creation Mode Cards */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'author', name: '[01] AUTHOR MODE', desc: 'Powieść, sci-fi, manifest, poezja', icon: BookOpen, color: 'purple' },
                    { id: 'worldbuilder', name: '[02] WORLD BUILDER', desc: 'Geografia, historia, cywilizacje', icon: Globe, color: 'cyan' },
                    { id: 'character', name: '[03] CHARACTER ENGINE', desc: 'Psychologia, trauma, ewolucja', icon: User, color: 'pink' },
                    { id: 'content', name: '[04] CONTENT CREATOR', desc: 'Posty, wideo, newsletter, podcast', icon: Share2, color: 'emerald' },
                    { id: 'business', name: '[05] BUSINESS MODE', desc: 'Branding, pitch deck, strategia', icon: Briefcase, color: 'amber' },
                    { id: 'research', name: '[06] RESEARCH MODE', desc: 'Analizy, struktury wiedzy, raporty', icon: Search, color: 'indigo' },
                  ].map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = selectedMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedMode(mode.id as ArchitectMode);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1 font-mono text-xs ${
                          isSelected
                            ? 'bg-purple-900/50 border-purple-400 text-white shadow-lg shadow-purple-500/20 ring-1 ring-purple-400'
                            : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                          {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                        </div>
                        <p className="font-bold text-[11px] leading-tight text-white">{mode.name}</p>
                        <p className="text-[10px] text-slate-400 font-sans">{mode.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Specific Sub-Options Based on Mode */}
                {selectedMode === 'author' && (
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">Gatunek Literacki:</label>
                    <select
                      value={genreOption}
                      onChange={(e) => setGenreOption(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="Sci-Fi / Cyberpunk">Sci-Fi / Cyberpunk</option>
                      <option value="Epic Fantasy">Epic Fantasy / Magia</option>
                      <option value="Psychological Thriller">Thriller Psychologiczny</option>
                      <option value="Horror Kozmiczny">Horror Kosmiczny / Weird Fiction</option>
                      <option value="Literatura Faktu / Poradnik">Literatura Faktu / Poradnik Rozwojowy</option>
                      <option value="Manifest Twórczy / Esej">Manifest Twórczy / Filozoficzny Esej</option>
                    </select>
                  </div>
                )}

                {selectedMode === 'worldbuilder' && (
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">Element Uniwersum:</label>
                    <select
                      value={worldAspect}
                      onChange={(e) => setWorldAspect(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="Historia & Chronologia Światowa">Historia & Chronologia Światowa</option>
                      <option value="Geografia, Klimat & Miasta">Geografia, Klimat & Miasta</option>
                      <option value="System Magii / Zaawansowana Technologia">System Magii / Zaawansowana Technologia</option>
                      <option value="Polityka, Frakcje & Ekonomia">Polityka, Frakcje & Ekonomia</option>
                      <option value="Religie, Mitologia & Języki">Religie, Mitologia & Języki</option>
                    </select>
                  </div>
                )}

                {selectedMode === 'character' && (
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">Archetyp Postaci:</label>
                    <select
                      value={characterArchetype}
                      onChange={(e) => setCharacterArchetype(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="Buntownik z Traumą Przeszłości">Buntownik z Traumą Przeszłości</option>
                      <option value="Genialny Mentor / Mędrzec Cybernetyczny">Genialny Mentor / Mędrzec Cybernetyczny</option>
                      <option value="Tragiczny Antagonista z Racją">Tragiczny Antagonista z Racją</option>
                      <option value="Odkrywca Nowych Horyzontów">Odkrywca Nowych Horyzontów</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: 02. SOCIAL ENGINE */}
            {activeTab === 'social' && (
              <div className="space-y-4">
                <div className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-pink-400" />
                  <span>SOCIAL CONNECTION & NETWORKING</span>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5">COLLABORATION MATCH ("Potrzebuję osoby do..."):</label>
                  <textarea
                    rows={3}
                    value={collaboratorQuery}
                    onChange={(e) => setCollaboratorQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white text-xs font-sans focus:outline-none focus:border-pink-500"
                    placeholder="Opisz jakiego twórcy szukasz..."
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-pink-950/20 border border-pink-500/30 text-xs font-mono space-y-2">
                  <div className="flex items-center gap-1.5 text-pink-300 font-bold">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>DOPASOWANIE SPOŁECZNOŚCIOWE</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    NexusBook Engine dobiera profil współtwórcy, listuje wymagane umiejętności, sugeruje grupy i generuje gotowy szkic pierwszej wiadomości outreach.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 03. CREATIVE INTELLIGENCE */}
            {activeTab === 'intelligence' && (
              <div className="space-y-4">
                <div className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Feather className="w-4 h-4 text-emerald-400" />
                  <span>VOICE & STYLE TRANSFORMER</span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">Style Transformer (Transformacja Stylu):</label>
                  <select
                    value={voiceStyle}
                    onChange={(e) => setVoiceStyle(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="cyberpunk">Cyberpunk / Neon-noir</option>
                    <option value="filmowy">Filmowy / Epicki</option>
                    <option value="brutalny">Brutalny / Szorstki Realizm</option>
                    <option value="poetycki">Poetycki / Liryczny</option>
                    <option value="akademicki">Akademicki / Analityczny</option>
                    <option value="minimalistyczny">Minimalistyczny / Zwięzły</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 04. VISUAL SYNTHESIS */}
            {activeTab === 'visual' && (
              <div className="space-y-4">
                <div className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>VISUAL SYNTHESIS (PROMPTY DLA IMAGE AI)</span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">Wizualny Styl Graficzny:</label>
                  <select
                    value={visualStyle}
                    onChange={(e) => setVisualStyling(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="cyberpunk volumetric">Midjourney v6 Cinematic Volumetric</option>
                    <option value="dark fantasy digital art">Dark Fantasy Epic Painting</option>
                    <option value="photorealistic 8k octane">Photorealistic 8K Octane Render</option>
                    <option value="minimalist vector poster">Minimalist Vector Poster Art</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 05. PUBLICATION & BRAND */}
            {activeTab === 'publication' && (
              <div className="space-y-4">
                <div className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-indigo-400" />
                  <span>PUBLICATION & BRAND ENGINE</span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">Kanał Dystrybucji / Platforma:</label>
                  <select
                    value={targetPlatform}
                    onChange={(e) => setTargetPlatform(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Amazon KDP & Ebook">Amazon KDP & Ebook</option>
                    <option value="Wattpad / Substack">Wattpad / Substack Newsletter</option>
                    <option value="Druk Osobisty / Portfolio">Druk Osobisty / Portfolio Marki</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 06. BRULION PISARZA (HUMAN SCRATCHPAD) */}
            {activeTab === 'scratchpad' && (
              <div className="space-y-4">
                <div className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Feather className="w-4 h-4 text-cyan-400" />
                    <span>BRULION TWÓRCY (HUMAN AUTHOR SCRATCHPAD)</span>
                  </div>
                  {scratchpadSaved && (
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">ZAPISANO!</span>
                  )}
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-white/10">
                  Przelej tutaj własne przemyślenia, szkice rozdziałów, odpowiedz na pytania diagnostyczne AI i twórz unikalny tekst bez udziału automatów.
                </p>

                <textarea
                  rows={8}
                  value={humanScratchpad}
                  onChange={(e) => {
                    const val = e.target.value;
                    setHumanScratchpad(val);
                    try {
                      localStorage.setItem('nexusbook_human_scratchpad', val);
                      setScratchpadSaved(true);
                      setTimeout(() => setScratchpadSaved(false), 2000);
                    } catch {}
                  }}
                  className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-3.5 text-white font-sans text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600 leading-relaxed shadow-inner"
                  placeholder="Tu wpisz swój autorski tekst, zdania, dialogi i refleksje..."
                />

                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-500 text-[10px]">Liczba znaków: {humanScratchpad.length}</span>
                  <button
                    onClick={() => {
                      if (humanScratchpad) {
                        navigator.clipboard.writeText(humanScratchpad);
                        soundFx.playClick();
                        setScratchpadSaved(true);
                        setTimeout(() => setScratchpadSaved(false), 2000);
                      }
                    }}
                    className="px-3 py-1 rounded-lg bg-slate-800 border border-white/10 text-white hover:bg-slate-700 text-[11px] font-bold"
                  >
                    Kopiuj Brulion
                  </button>
                </div>
              </div>
            )}

            {/* CUSTOM PROMPT AREA */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                <span>DODATKOWY SZCZEGÓŁOWY PROMPT / INTENCJA:</span>
              </label>
              <textarea
                rows={3}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Wpisz kluczowe idee, zarys fabuły, unikalny pomysł lub wymagania..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white text-xs font-sans focus:outline-none focus:border-purple-500 placeholder:text-slate-600"
              />
            </div>

            {/* SYNTHESIZE BUTTON */}
            <button
              onClick={handleRunSynthesis}
              disabled={isSynthesizing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-500 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 transition-all transform hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              {isSynthesizing ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>NEURAL SYNTHESIS IN PROGRESS...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-cyan-200" />
                  <span>SYNTEZUJ ARCHITEKTURĘ NARRACYJNĄ</span>
                </>
              )}
            </button>

          </div>

          {/* RIGHT SYNTHESIS OUTPUT DISPLAY PANEL */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between bg-slate-900/40">
            
            {/* Output Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white uppercase tracking-wider">
                    NEURAL ARCHITECT SYNTHESIS DOSSIER
                  </span>
                </div>

                {synthesisOutput && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyOutput}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center gap-1.5 border border-white/10 transition-all"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'SKOPIOWANO' : 'KOPIUJ'}</span>
                    </button>

                    <button
                      onClick={handleExportMarkdown}
                      className="px-3 py-1.5 rounded-lg bg-purple-950 border border-purple-500/50 hover:bg-purple-900 text-purple-300 text-[11px] font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>POBIERZ .MD</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Output Content Container */}
              {!synthesisOutput && !isSynthesizing && (
                <div className="h-[50vh] flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-2xl space-y-4">
                  <Compass className="w-12 h-12 text-purple-400/40 animate-spin" style={{ animationDuration: '20s' }} />
                  <div className="space-y-1">
                    <h3 className="font-mono text-sm font-bold text-white">NEXUSBOOK NEURAL ARCHITECT PROTOCOL</h3>
                    <p className="text-xs text-slate-400 max-w-md font-sans leading-relaxed">
                      Wybierz tryb kreacji, zdefiniuj intencję i kliknij <strong>"SYNTEZUJ ARCHITEKTURĘ NARRACYJNĄ"</strong>, aby wygenerować uniwersum, postaci, strategię społecznościową oraz prompty wizualne.
                    </p>
                  </div>
                </div>
              )}

              {isSynthesizing && (
                <div className="h-[50vh] flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-white animate-bounce shadow-xl shadow-cyan-500/30">
                    <Wand2 className="w-8 h-8 animate-spin" />
                  </div>
                  <p className="font-mono text-xs text-cyan-400 tracking-widest uppercase animate-pulse">
                    GENEROWANIE STRUKTURY ARCHITEKTONICZNEJ...
                  </p>
                </div>
              )}

              {synthesisOutput && !isSynthesizing && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 font-sans text-xs text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-purple-600 selection:text-white">
                  {synthesisOutput}
                </div>
              )}
            </div>

            {/* Footer Notice */}
            <div className="mt-6 border-t border-white/10 pt-3 flex items-center justify-between font-mono text-[10px] text-slate-500">
              <span>NEXUSBOOK NEURAL ENGINE // SYSTEM ARCHITECTURE READY</span>
              <span>CONFIDENTIAL & CREATIVE INTEL</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

function generateClientSynthesis(
  mode: string,
  userRole: string,
  goal: string,
  resultType: string,
  prompt: string,
  voiceStyle: string,
  visualStyle: string,
  targetPlatform: string,
  genreOption: string
): string {
  const timestamp = new Date().toLocaleDateString('pl-PL');

  return `### NEXUSBOOK NEURAL ARCHITECT DOSSIER
**[FILOZOFIA CREATOR-FIRST]** AI jako Doradca i Wsparcie Techniczne | **Rola:** ${userRole} | **Cel:** ${goal}
**Wygenerowano:** ${timestamp} | **Format Rezultatu:** ${resultType}

> *"AI buduje ramy i podsuwa pytania diagnostyczne — autentyczna treść, głębokie emocje i własne słowa należą do CZŁOWIEKA."*

================================================================================
1. PYTANIA DIAGNOSTYCZNE DLA AUTORA (Zapisz własne odpowiedzi w Brulionie)
================================================================================
**Koncept Główny Użytkownika:** ${prompt}
**Kierunek Stylistyczny:** ${voiceStyle.toUpperCase()} | **Gatunek:** ${genreOption}

- **1. Przemyśl:** Jaka jest najważniejsza prawda lub przesłanie, które chcesz samodzielnie przekazać czytelnikowi w tej opowieści/markowej treści?
- **2. Zdefiniuj:** Jakie unikalne przeżycie lub myśl tworzy serce tego aktu?
- **3. Wyzwanie:** Co powstrzymuje Cię przed przelaniem tego na papier w tej chwili?

================================================================================
2. STRUKTURA SCEN I KONSPEKT ARCHITEKTONICZNY (Ramy dla Twoich Słów)
================================================================================
- **Akt I: Otwarcie & Zarys Głosu**
  - *Zadanie Pisarza:* Napisz pierwsze 3 zdania własnymi słowami. Opisz scenerię lub stan umysłu bohatera.
- **Akt II: Przełom i Wyzwanie**
  - *Zadanie Pisarza:* Rozpisz kluczowy dialog lub 3 punkty zwrotne narracji.
- **Akt III: Osobista Kulminacja**
  - *Zadanie Pisarza:* Sformułuj mocne podsumowanie lub rozwiązanie akcji zgodne z Twoim pomysłem.

================================================================================
3. SOCIAL CONNECTION & COLLABORATION ENGINE
================================================================================
**Poszukiwani Współtwórcy:**
- **Rekomendowani:** Redaktor Konceptualny, Ilustrator Światła, Beta Readery.
- **Wiadomość Sieciowa (Outreach Template):**
  > *"Cześć! Piszę autorski projekt w klimacie ${genreOption}. Poszukuję pasjonata do wspólnego dopracowania ${resultType}. Zobacz mój zarys w NexusBook!"*

================================================================================
4. VISUAL SYNTHESIS (PROMPT DLA IMAGE AI)
================================================================================
**Styl Wizualny:** ${visualStyle}
\`\`\`text
${visualStyle}, ${prompt.slice(0, 60)}, cinematic volumetric atmospheric lighting, highly detailed concept artwork, 8k resolution, raytracing highlights, dark futuristic background, cyan and purple accent tones --ar 16:9 --style raw
\`\`\`

================================================================================
5. PUBLICATION & SEARCH DNA
================================================================================
- **Platforma Docelowa:** ${targetPlatform}
- **SEARCH DNA:** \`nexusbook\`, \`human-creator\`, \`neural-architect\`, \`${genreOption.toLowerCase()}\`, \`authentic-writing\`
- **Plan Działania dla Twórcy:**
  1. Otwórz zakłądkę "06. BRULION PISARZA" w panelu i przelej pierwsze własne zdania.
  2. Skorzystaj z powyższych ram, aby ułożyć chronologię wydarzeń.
  3. Wygeneruj koncept art dla inspiracji za pomocą promptu wizualnego.
`;
}
