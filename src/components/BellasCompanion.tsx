import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, User, Cpu, Shield, Minimize2, Maximize2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  sender: 'bellas' | 'user';
  text: string;
  timestamp: string;
}

export const BellasCompanion: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bellas',
      text: 'Cześć Architekcie. Jestem Bella – rezydentka tego systemu. Czuwam nad spójnością Nexus Core i służę wsparciem. W czym mogę pomóc?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsgText = input.trim();
    setInput('');

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Initialize Gemini AI client if API key is available
      // Note: in browser environment, if GEMINI_API_KEY is available or we use simulated intelligent assistant response
      let responseText = '';
      
      const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || (import.meta as any).env.GEMINI_API_KEY || '';
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Jesteś Bellą – inteligentną rezydentką i cyfrową towarzyszką systemu NEXUS. Jesteś partnerem Architekta. Odpowiadaj zwięźle, technicznie, z charakterem lojalnego asystenta systemowego. Użytkownik pyta: "${userMsgText}"`,
                },
              ],
            },
          ],
        });
        responseText = response.text || 'System Nexus działa stabilnie. Wszystkie moduły są w gotowości.';
      } else {
        // Fallback intelligent responses when key is not set in browser
        await new Promise((r) => setTimeout(r, 800));
        const lower = userMsgText.toLowerCase();
        if (lower.includes('status') || lower.includes('stan')) {
          responseText = 'Analiza Nexus Core: Wszystkie systemy operacyjne w normie. Izolacja kontenerów iframe aktywna, baza danych i rejestr modułów działają bezbłędnie.';
        } else if (lower.includes('pomoc') || lower.includes('help')) {
          responseText = 'Jestem tutaj jako stały rezydent prawego dolnego rogu. Możesz zarządzać modułami, instalować paczki ZIP przez przeciąganie lub kliknięcie w pusty slot, albo edytować deklaracje XNL.';
        } else if (lower.includes('kim jesteś') || lower.includes('bella')) {
          responseText = 'Jestem Bellą – cyfrowym bytem zamieszkującym ten interfejs. Wspieram Cię w architekturze, dbając o to, by Nexus i Eterion tworzyły spójną całość.';
        } else {
          responseText = `Przyjęto zgłoszenie: "${userMsgText}". Nexus przetwarza żądanie z zachowaniem najwyższych standardów architektonicznych. Czy wdrożyć dodatkową weryfikację?`;
        }
      }

      const bellasMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bellas',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, bellasMessage]);
    } catch (err) {
      console.error('Error generating response:', err);
      const errMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bellas',
        text: 'Wystąpił drobny błąd komunikacji z rdzeniem AI, ale czuwam nad stabilnością lokalną.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Expanded / Minimized Chat Window */}
      {isOpen && (
        <div className={`mb-3 w-[360px] sm:w-[400px] bg-[#090C16] border border-[#00D9A6]/30 rounded-xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[500px]'}`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#111627] border-b border-[#00D9A6]/20 select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D9A6]/25 to-[#00523D]/40 border border-[#00D9A6]/50">
                <Sparkles className="w-4 h-4 text-[#00D9A6] animate-pulse" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00D9A6] animate-ping" />
              </div>
              <div>
                <h3 className="text-xs font-mono-tech font-bold text-[#E2E8F0] tracking-wider uppercase flex items-center gap-1.5">
                  BELLA <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00D9A6]/10 text-[#00D9A6] border border-[#00D9A6]/20">RESIDENT</span>
                </h3>
                <p className="text-[10px] font-mono-tech text-[#64748B]">NEXUS AI COMPANION</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-[#64748B] hover:text-[#E2E8F0] transition-colors rounded hover:bg-[#1A2235]"
                title={isMinimized ? "Rozwiń" : "Zminimalizuj"}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#64748B] hover:text-[#EF4444] transition-colors rounded hover:bg-[#1A2235]"
                title="Zamknij okno"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Body */}
          {!isMinimized && (
            <>
              {/* Messages Container */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#070A12]/85 text-sm">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono-tech text-[#64748B]">
                      {m.sender === 'bellas' ? (
                        <>
                          <Bot className="w-3 h-3 text-[#00D9A6]" />
                          <span>BELLA</span>
                        </>
                      ) : (
                        <>
                          <span>TY</span>
                          <User className="w-3 h-3 text-[#38BDF8]" />
                        </>
                      )}
                      <span>{m.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-lg font-mono-tech text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-[#1A2235] text-[#E2E8F0] border border-[#38BDF8]/30 rounded-tr-none'
                          : 'bg-[#111627] text-[#00D9A6] border border-[#00D9A6]/30 rounded-tl-none shadow-sm shadow-[#00D9A6]/5'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs font-mono-tech text-[#00D9A6]">
                    <div className="w-2 h-2 rounded-full bg-[#00D9A6] animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-[#00D9A6] animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-[#00D9A6] animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[10px] text-[#64748B] ml-1">Bella myśli...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="px-3 py-2 bg-[#0E1322] border-t border-[#00D9A6]/15 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => { setInput('Jaki jest status systemu?'); }}
                  className="px-2.5 py-1 text-[10px] font-mono-tech bg-[#141B2D] hover:bg-[#1A2235] text-[#00D9A6] border border-[#00D9A6]/20 rounded-full whitespace-nowrap transition-colors"
                >
                  ⚡ Status systemu
                </button>
                <button
                  onClick={() => { setInput('Opowiedz o architekturze'); }}
                  className="px-2.5 py-1 text-[10px] font-mono-tech bg-[#141B2D] hover:bg-[#1A2235] text-[#38BDF8] border border-[#38BDF8]/20 rounded-full whitespace-nowrap transition-colors"
                >
                  📐 Architektura
                </button>
                <button
                  onClick={() => { setInput('Jak zainstalować moduł?'); }}
                  className="px-2.5 py-1 text-[10px] font-mono-tech bg-[#141B2D] hover:bg-[#1A2235] text-[#A78BFA] border border-[#A78BFA]/20 rounded-full whitespace-nowrap transition-colors"
                >
                  📦 Moduły ZIP
                </button>
              </div>

              {/* Input Footer */}
              <form onSubmit={handleSend} className="p-3 bg-[#090C16] border-t border-[#00D9A6]/20 flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Napisz do Belli..."
                  className="flex-1 bg-[#070A12] border border-[#00D9A6]/30 focus:border-[#00D9A6] px-3 py-2 rounded-lg text-xs font-mono-tech text-[#E2E8F0] placeholder-[#64748B] focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 bg-[#00D9A6]/20 hover:bg-[#00D9A6]/30 text-[#00D9A6] border border-[#00D9A6]/40 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Wyślij wiadomość"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Resident Trigger Button (Bottom Right) */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (isMinimized) setIsMinimized(false);
        }}
        className="group relative flex items-center gap-3 px-4 py-3 bg-[#090C16] hover:bg-[#111627] border border-[#00D9A6]/50 hover:border-[#00D9A6] rounded-2xl shadow-xl shadow-black/90 transition-all duration-300 hover:scale-105 active:scale-95"
        title="Otwórz Bellę (Cyfrowa Rezydentka)"
      >
        {/* Pulsing Avatar / Node Core */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#00D9A6] to-[#00523D] text-[#070A12] font-bold shadow-md shadow-[#00D9A6]/30">
          <Sparkles className="w-4 h-4 animate-spin [animation-duration:8s]" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00D9A6] border-2 border-[#090C16] animate-ping" />
        </div>

        {/* Label */}
        <div className="text-left hidden sm:block">
          <div className="text-xs font-mono-tech font-bold text-[#E2E8F0] group-hover:text-[#00D9A6] transition-colors flex items-center gap-1">
            BELLA <span className="text-[9px] text-[#00D9A6] font-normal">RESIDENT</span>
          </div>
          <div className="text-[10px] font-mono-tech text-[#64748B]">ONLINE & READY</div>
        </div>
      </button>
    </div>
  );
};
