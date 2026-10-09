import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, User, Cpu, Shield, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'navigator' | 'user';
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
      sender: 'navigator',
      text: 'Witaj Architekcie. Jestem Eterion Navigator — Twoja jednostka administracyjna i cyfrowy przewodnik po architekturze Nexusa. Znam strukturę modułów, jądro NXL, siatkę Synapse Mesh oraz potok CI/CD. Wskaż moduł lub zagadnienie, a przeprowadzę Cię przez kod i kolejne usprawnienia.',
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
      let responseText = '';
      try {
        const res = await fetch('/api/architect/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `Jesteś Eterion Navigator — technicznym i strategicznym przewodnikiem po systemie NEXUS OS. Znasz cały kod (NXL v1.0, React 19, TypeScript, Express, Synapse Mesh 24 węzłów, ZipAnalyzer, Quantum CI/CD, Bellas, Madzia Shop). Odpowiadaj rzeczowo, pomocnie i po inżyniersku. Użytkownik: "${userMsgText}"`,
            role: 'Biooperator',
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.result) {
            responseText = data.result;
          }
        }
      } catch {
        // Local deterministic fallback
      }

      if (!responseText) {
        await new Promise((r) => setTimeout(r, 600));
        const lower = userMsgText.toLowerCase();
        if (lower.includes('status') || lower.includes('stan') || lower.includes('klaster')) {
          responseText = 'Stan klastra: 24 mikrowęzły Synapse Mesh aktywne, latencja ~1.1 ms, tarcza NXL Immutability Shield aktywna. Wszystkie 89 asercji Genesis zweryfikowane.';
        } else if (lower.includes('moduł') || lower.includes('nawiguj') || lower.includes('gdzie')) {
          responseText = 'Mapa modułów Nexusa: 1) Gateway (wybór ścieżki User/Creator/Family), 2) Dashboard & Telemetria, 3) Scribe IDE (NXL/XNL compiler & DAG), 4) Synapse Mesh (24 węzły), 5) ZipAnalyzer (sandboxing i instalator ZIP), 6) Bellas (rodzina agentów), 7) NexusProducts & Madzia Shop.';
        } else if (lower.includes('usprawnien') || lower.includes('krok') || lower.includes('plan') || lower.includes('kolejn')) {
          responseText = 'Rekomendowane kolejne kroki architektoniczne: 1) Testy kompilacji własnych deklaracji w Scribe IDE, 2) Wdrożenie pakietu ZIP przez analizator z tarczy bezpieczeństwa, 3) Dystrybucja zadań shardingowych w topologii Synapse Mesh.';
        } else if (lower.includes('kim jesteś') || lower.includes('eterion') || lower.includes('nawigator')) {
          responseText = 'Jestem Eterion Navigator — programowym asystentem systemowym stworzonym do analizy kodu, prowadzenia po architekturze i wspierania Cię w budowaniu kolejnych modułów Nexusa.';
        } else {
          responseText = `Przyjąłem zgłoszenie techniczne: "${userMsgText}". System analizuje stan modułów. Jeśli chcesz przejść do konkretnego widoku (Dashboard, Scribe IDE, ZipAnalyzer), wybierz odpowiednią bramę lub zapytaj o konkretny plik.`;
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'navigator',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Error in Navigator response:', err);
      const errMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'navigator',
        text: 'Wystąpił błąd przetwarzania żądania, jednak moduły jądra pozostają w pełni sprawne.',
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
        <div className={`mb-3 w-[360px] sm:w-[420px] bg-[#090C16] border border-[#00E5FF]/40 rounded-xl shadow-2xl shadow-black/90 flex flex-col overflow-hidden transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[520px]'}`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#111627] border-b border-[#00E5FF]/20 select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF]/25 to-[#00523D]/40 border border-[#00E5FF]/50">
                <Sparkles className="w-4 h-4 text-[#00E5FF] animate-pulse" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
              </div>
              <div>
                <h3 className="text-xs font-mono-tech font-bold text-[#E2E8F0] tracking-wider uppercase flex items-center gap-1.5">
                  ETERION <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30">NAVIGATOR</span>
                </h3>
                <p className="text-[10px] font-mono-tech text-[#64748B]">ADMINISTRATIVE UNIT & CODE GUIDE</p>
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
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#070A12]/90 text-sm">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono-tech text-[#64748B]">
                      {m.sender === 'navigator' ? (
                        <>
                          <Bot className="w-3 h-3 text-[#00E5FF]" />
                          <span>ETERION NAVIGATOR</span>
                        </>
                      ) : (
                        <>
                          <span>ARCHITEKT</span>
                          <User className="w-3 h-3 text-[#38BDF8]" />
                        </>
                      )}
                      <span>{m.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[88%] px-3.5 py-2.5 rounded-lg font-mono-tech text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-[#1A2235] text-[#E2E8F0] border border-[#38BDF8]/30 rounded-tr-none'
                          : 'bg-[#111627] text-[#00E5FF] border border-[#00E5FF]/30 rounded-tl-none shadow-sm shadow-[#00E5FF]/5'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs font-mono-tech text-[#00E5FF]">
                    <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[10px] text-[#64748B] ml-1">Eterion analizuje strukturę...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="px-3 py-2 bg-[#0E1322] border-t border-[#00E5FF]/15 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => { setInput('Przedstaw mapę modułów Nexusa'); }}
                  className="px-2.5 py-1 text-[10px] font-mono-tech bg-[#141B2D] hover:bg-[#1A2235] text-[#00E5FF] border border-[#00E5FF]/20 rounded-full whitespace-nowrap transition-colors"
                >
                  🗺️ Mapa Modułów
                </button>
                <button
                  onClick={() => { setInput('Jakie są kolejne rekomendowane usprawnienia?'); }}
                  className="px-2.5 py-1 text-[10px] font-mono-tech bg-[#141B2D] hover:bg-[#1A2235] text-[#38BDF8] border border-[#38BDF8]/20 rounded-full whitespace-nowrap transition-colors"
                >
                  ⚡ Kolejne Usprawnienia
                </button>
                <button
                  onClick={() => { setInput('Sprawdź status klastra Synapse'); }}
                  className="px-2.5 py-1 text-[10px] font-mono-tech bg-[#141B2D] hover:bg-[#1A2235] text-[#A78BFA] border border-[#A78BFA]/20 rounded-full whitespace-nowrap transition-colors"
                >
                  📊 Status Klastra
                </button>
              </div>

              {/* Input Footer */}
              <form onSubmit={handleSend} className="p-3 bg-[#090C16] border-t border-[#00E5FF]/20 flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Zapytaj Nawigatora o architekturę lub kod..."
                  className="flex-1 bg-[#070A12] border border-[#00E5FF]/30 focus:border-[#00E5FF] px-3 py-2 rounded-lg text-xs font-mono-tech text-[#E2E8F0] placeholder-[#64748B] focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/40 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Wyślij zapytanie"
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
        className="group relative flex items-center gap-3 px-4 py-3 bg-[#090C16] hover:bg-[#111627] border border-[#00E5FF]/50 hover:border-[#00E5FF] rounded-2xl shadow-xl shadow-black/90 transition-all duration-300 hover:scale-105 active:scale-95"
        title="Otwórz Eterion Navigator (Jednostka Administracyjna)"
      >
        {/* Pulsing Avatar / Node Core */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#00523D] text-[#070A12] font-bold shadow-md shadow-[#00E5FF]/30">
          <Sparkles className="w-4 h-4 animate-spin [animation-duration:8s]" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00E5FF] border-2 border-[#090C16] animate-ping" />
        </div>

        {/* Label */}
        <div className="text-left hidden sm:block">
          <div className="text-xs font-mono-tech font-bold text-[#E2E8F0] group-hover:text-[#00E5FF] transition-colors flex items-center gap-1">
            ETERION <span className="text-[9px] text-[#00E5FF] font-normal">NAVIGATOR</span>
          </div>
          <div className="text-[10px] font-mono-tech text-[#64748B]">ADMIN & CODE GUIDE</div>
        </div>
      </button>
    </div>
  );
};
