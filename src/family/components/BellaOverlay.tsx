import React, { useState, useRef, useEffect } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Brain,
  Sparkles,
  Send,
  X,
  Zap,
  Layers,
  Search,
  Users,
  Compass,
  FileText,
  RotateCcw,
  Bot,
  User,
  ExternalLink
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bella';
  text: string;
  timestamp: string;
  source?: string;
}

export const BellaOverlay: React.FC = () => {
  const {
    showBellaOverlay,
    setShowBellaOverlay,
    currentArchitect,
    currentView,
    language,
    playCyberSound,
    triggerHaptic,
    setCurrentView,
    projects,
    missions,
    brotherhoodNodes
  } = useNexus();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'bella',
      text: language === 'PL'
        ? `Witaj w komorze State Bella — warstwie inteligencji społecznościowej i koordynacji NEXUS FAMILY.\n\nNie jestem zwykłym chatbotem. Analizuję sygnały, łączę kompetencje, rekomenduję współpracę w Brotherhood Engine i syntetyzuję pamięć Nexusa.\n\n*Bella sugeruje. Człowiek decyduje.* W czym mogę dziś wesprzeć Twoją architekturę?`
        : `Welcome to State Bella — the social intelligence and cognitive orchestration layer of NEXUS FAMILY.\n\nI analyze ecosystem signals, match complementary talents in the Brotherhood Engine, and synthesize Nexus Memory.\n\n*Bella suggests. Humans choose.* How may I assist your architecture today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = language === 'PL' ? [
    'Znajdź mi projekt, do którego mogę dołączyć',
    'Potrzebuję developera z komplementarnymi skillami',
    'Z kim mogę stworzyć nowy projekt?',
    'Co aktualnie buduje Nexus?',
    'Co wydarzyło się ostatnio w rodzinie?',
    'Wytłumacz protokół Brotherhood Engine'
  ] : [
    'Find me a project I can contribute to',
    'I need a developer with complementary skills',
    'Who is my optimal Brotherhood match?',
    'What is Nexus currently building?',
    'What happened recently in the Family?',
    'Explain the Brotherhood Engine protocol'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!showBellaOverlay) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    playCyberSound('beep');
    triggerHaptic();

    try {
      const res = await fetch('/api/bella/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          architectProfile: currentArchitect,
          currentView,
          context: {
            activeProjectsCount: projects.length,
            openMissionsCount: missions.filter(m => m.status === 'OPEN').length,
            brotherhoodNodesCount: brotherhoodNodes.length
          }
        })
      });

      const data = await res.json();
      const bellaMsg: ChatMessage = {
        id: `bella-${Date.now()}`,
        sender: 'bella',
        text: data.reply || (language === 'PL' ? 'Węzeł Bella zsyntetyzował odpowiedź.' : 'State Bella synthesized a response.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source
      };

      setMessages(prev => [...prev, bellaMsg]);
      playCyberSound('synapse');
      triggerHaptic();
    } catch (err: any) {
      console.error('Bella error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'bella',
        text: language === 'PL'
          ? `[SYNAPSE DISSONANCE] Nastąpiło chwilowe zakłócenie sieci: ${err?.message || 'Błąd połączenia'}. Przełączam na lokalny węzeł Bella.`
          : `[SYNAPSE DISSONANCE] Neural connection error: ${err?.message || 'Connection lost'}. Fallback active.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
      playCyberSound('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="bella-overlay-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-3xl h-[85vh] max-h-[750px] rounded-2xl nexus-glass border border-cyan-400/40 bg-[#090d16]/95 flex flex-col justify-between shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden">
        {/* Decorative scanline & glow */}
        <div className="absolute inset-0 scanline-effect pointer-events-none opacity-40" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-4 border-b border-cyan-500/20 bg-[#06080e]/90">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cyber font-bold text-base text-white tracking-wider">
                  STATE BELLA
                </h3>
                <span className="px-1.5 py-0.5 text-[9px] font-mono-tech rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  AI ORCHESTRATOR
                </span>
              </div>
              <p className="text-[11px] font-mono-tech text-slate-400">
                AI Orchestrator / Mentor / Matchmaker / Memory Layer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="bella-overlay-clear-btn"
              onClick={() => {
                setMessages([messages[0]]);
                playCyberSound('click');
              }}
              className="p-2 text-slate-400 hover:text-cyan-300 transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              id="bella-overlay-close-btn"
              onClick={() => {
                setShowBellaOverlay(false);
                playCyberSound('click');
              }}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg bg-[#0e1422] border border-cyan-500/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-sm">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bella' && (
                <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600/30 to-purple-600/30 border border-cyan-400/40 text-cyan-100 rounded-br-none shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                    : 'bg-[#0e1422]/90 border border-cyan-500/20 text-slate-200 rounded-bl-none shadow-lg'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                  {msg.text}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono-tech text-slate-500">
                  <span>{msg.timestamp}</span>
                  {msg.source && <span className="text-cyan-400/80">⚡ {msg.source}</span>}
                </div>
              </div>

              {msg.sender === 'user' && (
                <img
                  src={currentArchitect.avatar}
                  alt="User"
                  className="w-8 h-8 rounded-lg object-cover border border-cyan-400/40 shrink-0 mt-0.5"
                />
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-xs font-mono-tech text-cyan-400">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Brain className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-[#0e1422]/80 border border-cyan-500/20 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                <span>{language === 'PL' ? 'State Bella analizuje układ synaptyczny...' : 'State Bella synthesizing neural response...'}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Carousel */}
        <div className="p-2.5 border-t border-cyan-500/10 bg-[#06080e]/80 overflow-x-auto flex gap-2 no-scrollbar">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-[#0d131f] hover:bg-cyan-950/50 border border-cyan-500/20 hover:border-cyan-400/50 text-[11px] font-mono-tech text-cyan-300 transition-all truncate max-w-[280px]"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#080b11] border-t border-cyan-500/20">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="bella-chat-input"
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder={language === 'PL' ? 'Zadaj pytanie o projekty, architektów, pamięć lub misje...' : 'Ask Bella about projects, architects, memory, or missions...'}
              className="flex-1 bg-[#0d131f] border border-cyan-500/30 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans"
            />
            <button
              id="bella-send-btn"
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-cyber font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'PL' ? 'Wyślij' : 'Send'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
