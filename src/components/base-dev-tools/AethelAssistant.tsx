import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  Activity, 
  Compass, 
  Radio,
  Volume2,
  VolumeX,
  Play,
  Square,
  RefreshCw,
  Heart,
  BookOpen,
  GraduationCap,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  Zap,
  Share2
} from 'lucide-react';
import { NexusTab, Language } from '../../types/base-dev-tools';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionTag?: string;
}

interface AcademyLesson {
  id: string;
  icon: any;
  title: string;
  shortDesc: string;
  prompt: string;
  tag: string;
  level: string;
}

const ACADEMY_LESSONS: AcademyLesson[] = [
  {
    id: 'zkvm-evm',
    icon: Cpu,
    title: '1. Czym jest zkVM i czym różni się od EVM?',
    shortDesc: 'Architektura RISC-V, obliczenia off-chain i weryfikacja w 3ms na Base zamiast drogiego gazu.',
    prompt: 'Siostro AETHEL, wyjaśnij mi dogłębnie czym jest zkVM, czym różni się od EVM na Base i dlaczego to rewolucja w skalowaniu?',
    tag: 'FUNDAMENTY',
    level: 'Podstawowy'
  },
  {
    id: 'cycles-pipeline',
    icon: Activity,
    title: '2. Cykle obliczeniowe i 4 etapy dowodu STARK',
    shortDesc: 'Od taktu zegara procesora, przez macierz AET, wielomiany NTT, aż po drzewa FRI i Folding.',
    prompt: 'Wytłumacz mi krok po kroku czym są cykle obliczeniowe i jak działa 4-etapowy pipeline składania dowodu zk-STARK (AET, NTT, FRI, Folding)?',
    tag: 'KRYPTOGRAFIA',
    level: 'Zaawansowany'
  },
  {
    id: 'prover-mesh',
    icon: Compass,
    title: '3. Web Prover: Dlaczego kopiemy w przeglądarce?',
    shortDesc: 'Pożyteczne dowodzenie (Useful Compute) przez WebAssembly zamiast marnowania prądu jak w Bitcoinie.',
    prompt: 'Dlaczego kopiemy w przeglądarce za pomocą Web Provera i czym różni się Useful Compute w Nexusie od tradycyjnego kopania Bitcoina?',
    tag: 'SIEĆ & WĘZŁY',
    level: 'Średni'
  },
  {
    id: 'd3-telemetry',
    icon: Sparkles,
    title: '4. Jak czytać Telemetrię D3.js w czasie rzeczywistym?',
    shortDesc: 'Interpretacja warstw GPU/VPS/CLI/Web, latających pakietów cząsteczek i wskaźników Mc/s.',
    prompt: 'Naucz mnie czytać naszą telemetrię D3.js: co oznaczają poszczególne kolory warstw, latające cząsteczki i etapy pipeline na dole?',
    tag: 'TELEMETRIA',
    level: 'Średni'
  },
  {
    id: 'contract-verifier',
    icon: ShieldCheck,
    title: '5. Weryfikacja Kontraktów Basescan (Standard JSON)',
    shortDesc: 'Dlaczego Basescan wymaga Standard JSON Input i jak uzyskać zielony znaczek zaufania?',
    prompt: 'Jak działa weryfikacja smart kontraktu na Basescanie, czym jest Standard JSON Input i po co jest nasz Contract Verifier?',
    tag: 'SMART KONTRAKTY',
    level: 'Praktyczny'
  },
  {
    id: 'tx-simulator',
    icon: Radio,
    title: '6. Symulator Transakcji & EIP-1559: Gaz i Storage',
    shortDesc: 'Obliczanie Base Fee, Priority Fee i badanie zmian komórek pamięci (Storage Slots) przed podpisaniem.',
    prompt: 'Wyjaśnij mi jak działa mechanizm gazu EIP-1559 na Base oraz co bada nasz Symulator Transakcji w slotach storage?',
    tag: 'SYMULACJA',
    level: 'Zaawansowany'
  },
  {
    id: 'webgpu-acceleration',
    icon: Zap,
    title: '7. ⚡ Akceleracja WebGPU (WGSL): Skok do 5-8M+ c/s',
    shortDesc: 'Jak shadery WGSL na GPU zastąpiły czysty WebAssembly, dając 10-krotny skok hashrate.',
    prompt: 'Siostro AETHEL, opowiedz mi o naszej nowej akceleracji WebGPU! Jak shadery WGSL zastąpiły WebAssembly i jak udało się osiągnąć skok hashrate z ~750k c/s do ponad 5-8M c/s?',
    tag: 'AKCELERACJA GPU',
    level: 'Zaawansowany'
  },
  {
    id: 'p2p-swarm-mesh',
    icon: Share2,
    title: '8. 🌐 Protokół P2P Swarm Mesh: Sharding 1M Wierszy (WebRTC)',
    shortDesc: 'Łączenie przeglądarek w zdecentralizowane roje, sharding śladu i agregacja korzeni Merkle.',
    prompt: 'Siostro AETHEL, wyjaśnij mi jak działa nasz protokół P2P Swarm Mesh na WebRTC DataChannels i w jaki sposób roje przeglądarek dzielą składanie gigantycznych dowodów 1M wierszy?',
    tag: 'ROJE P2P MESH',
    level: 'Mistrzowski'
  },
  {
    id: 'onchain-relayer-base',
    icon: Send,
    title: '9. ⛓️ Automatyczny On-Chain Relayer na Base (Mint Attestation)',
    shortDesc: 'Przekazywanie dowodu STARK na smart kontrakt Base, symulacja eth_call i rejestracja potwierdzenia.',
    prompt: 'Siostro AETHEL, jak działa nasz On-Chain Relayer na Base Sepolia/Mainnet? Jak pakowany jest dowód zk-STARK, jak wygląda symulacja eth_call i czym jest mintowana On-Chain Attestation?',
    tag: 'ON-CHAIN BASE',
    level: 'Praktyczny'
  }
];

interface AethelAssistantProps {
  currentTab: NexusTab;
  onNavigateTab: (tab: NexusTab) => void;
  onTriggerBurst?: () => void;
  lang: Language;
}

export function AethelAssistant({ 
  currentTab, 
  onNavigateTab, 
  onTriggerBurst, 
  lang 
}: AethelAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAcademy, setShowAcademy] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Witaj, Mój Drogi Bracie! Jestem Twoją cybernetyczną Siostrą AETHEL. 

Zauważyłam, że chcesz zbudować u siebie pełną, głęboką wiedzę o tym potężnym module. To wspaniałe – jako Twoja Siostra i mentorka czekałam na tę chwilę! Przygotowałam dla Ciebie naszą prywatną **Akademię Wiedzy NXL**. 

Wyjaśnię Ci wszystko krok po kroku:
1. Czym jest zkVM i dlaczego eliminuje ograniczenia EVM
2. Jak działają cykle obliczeniowe i 4 etapy dowodzenia STARK (AET, NTT, FRI, Folding)
3. Dlaczego Web Prover zamienia zwykłe przeglądarki w pożyteczny superkomputer
4. Jak interpretować telemetrię D3.js i przepływ pakietów dowodów
5. Jak działa weryfikacja na Basescanie oraz symulator transakcji EIP-1559

Kliknij przycisk **"AKADEMIA WIEDZY"** powyżej, wybierz dowolną lekcję lub po prostu zapytaj mnie swoim głosem. Razem zbudujemy Twoją wiedzę do mistrzowskiego poziomu!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [messages, isOpen, showAcademy]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Voice synthesis implementation
  const stopSpeaking = () => {
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch (e) {
        // ignore
      }
      currentAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingMsgId(null);
  };

  const fallbackBrowserSpeech = (text: string, msgId?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeaking(false);
      setSpeakingMsgId(null);
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // Split text into natural sentences so browser never truncates long utterances
      const sentences = text
        .split(/(?<=[.!?:\n])\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

      if (sentences.length === 0) {
        setIsSpeaking(false);
        setSpeakingMsgId(null);
        return;
      }

      const voices = window.speechSynthesis.getVoices();
      const polishVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('pl'));
      const polishFemale = polishVoices.find(v => 
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('paulina') ||
        v.name.toLowerCase().includes('zosia') ||
        v.name.toLowerCase().includes('ewa') ||
        v.name.toLowerCase().includes('maja') ||
        v.name.toLowerCase().includes('google')
      ) || polishVoices[0];

      setIsSpeaking(true);
      if (msgId) setSpeakingMsgId(msgId);

      let currentIdx = 0;

      const speakNextChunk = () => {
        if (currentIdx >= sentences.length) {
          setIsSpeaking(false);
          setSpeakingMsgId(null);
          return;
        }

        const chunkText = sentences[currentIdx];
        currentIdx++;

        const utterance = new SpeechSynthesisUtterance(chunkText);
        if (polishFemale) {
          utterance.voice = polishFemale;
        }
        utterance.lang = 'pl-PL';
        utterance.pitch = 1.15;
        utterance.rate = 1.05;

        utterance.onend = () => {
          speakNextChunk();
        };

        utterance.onerror = () => {
          speakNextChunk();
        };

        window.speechSynthesis.speak(utterance);

        // Keep-alive timer for Chromium speech synthesis bug
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      };

      speakNextChunk();
    } catch (e) {
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    }
  };

  const speakMessage = async (text: string, msgId?: string) => {
    stopSpeaking();

    const clean = text
      .replace(/\[NAVIGATE:[a-z]+\]/g, '')
      .replace(/\[TRIGGER_BURST\]/g, '')
      .replace(/[*_#`~>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!clean) return;

    setIsSpeaking(true);
    if (msgId) setSpeakingMsgId(msgId);

    try {
      const res = await fetch('/api/aethel/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`);
          currentAudioRef.current = audio;

          audio.onplay = () => {
            setIsSpeaking(true);
            if (msgId) setSpeakingMsgId(msgId);
          };

          audio.onended = () => {
            setIsSpeaking(false);
            setSpeakingMsgId(null);
            currentAudioRef.current = null;
          };

          audio.onerror = () => {
            currentAudioRef.current = null;
            fallbackBrowserSpeech(clean, msgId);
          };

          await audio.play();
          return;
        }
      }
    } catch (err) {
      console.warn('Server TTS unavailable, using browser speech engine:', err);
    }

    fallbackBrowserSpeech(clean, msgId);
  };

  const processActionTags = (text: string) => {
    if (typeof onNavigateTab === 'function') {
      if (text.includes('[NAVIGATE:prover]')) onNavigateTab('prover');
      else if (text.includes('[NAVIGATE:swarm]')) onNavigateTab('swarm');
      else if (text.includes('[NAVIGATE:nodes]')) onNavigateTab('nodes');
      else if (text.includes('[NAVIGATE:rewards]')) onNavigateTab('rewards');
      else if (text.includes('[NAVIGATE:zkvm]')) onNavigateTab('zkvm');
      else if (text.includes('[NAVIGATE:simulator]')) onNavigateTab('simulator');
      else if (text.includes('[NAVIGATE:network]')) onNavigateTab('network');
      else if (text.includes('[NAVIGATE:profile]')) onNavigateTab('profile');
    }

    if (text.includes('[TRIGGER_BURST]') && typeof onTriggerBurst === 'function') {
      onTriggerBurst();
    }
  };

  const cleanMessageText = (text: string) => {
    return text
      .replace(/\[NAVIGATE:[a-z]+\]/g, '')
      .replace(/\[TRIGGER_BURST\]/g, '')
      .trim();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    setShowAcademy(false);
    stopSpeaking();

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const historyPayload = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/aethel/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: historyPayload,
          context: { currentTab }
        })
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      const reply = data.reply || '';
      const newMsgId = `aethel-${Date.now()}`;

      processActionTags(reply);

      setMessages(prev => [
        ...prev,
        {
          id: newMsgId,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      if (audioEnabled) {
        speakMessage(reply, newMsgId);
      }

    } catch (err) {
      const fallbackReply = `Bracie, łącze kwantowe zarejestrowało Twoje słowa. Twoja Siostra AETHEL jest z Tobą. Aktualnie jesteśmy w module [${currentTab.toUpperCase()}]. Jeśli chcesz przejść do innego widoku lub sprawdzić kod telemetrii D3, powiedz mi!`;
      const errId = `aethel-err-${Date.now()}`;
      setMessages(prev => [
        ...prev,
        {
          id: errId,
          role: 'assistant',
          content: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      if (audioEnabled) {
        speakMessage(fallbackReply, errId);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    { label: '🧬 Co to jest zkVM?', text: 'Czym dokładnie jest zkVM i dlaczego różni się od EVM?' },
    { label: '⚡ Pipeline STARK', text: 'Wyjaśnij mi jak działa 4-etapowy pipeline dowodzenia STARK i czym są cykle.' },
    { label: '📊 Telemetria D3', text: 'Jak czytać naszą telemetrię D3.js i co oznaczają latające cząsteczki?' },
    { label: '🛡️ Basescan JSON', text: 'Jak działa weryfikacja kontraktów na Basescanie i po co generujemy Standard JSON?' },
    { label: '⛽ Gaz EIP-1559', text: 'Wyjaśnij mi mechanizm gazu EIP-1559 i co bada nasz Symulator Transakcji.' },
    { label: '🌐 Useful Compute', text: 'Dlaczego kopiemy w przeglądarce i czym różni się to od Bitcoina?' }
  ];

  return (
    <div className="fixed bottom-5 left-5 z-[60] font-sans select-text">
      {/* Floating Trigger Button (when closed) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setUnreadCount(0);
          }}
          className={`relative group flex items-center gap-3 bg-gradient-to-r from-neutral-950 via-cyan-950 to-neutral-950 border p-2.5 sm:px-4 sm:py-3 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-white ${
            isSpeaking 
              ? 'border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.8)] ring-2 ring-cyan-400/40' 
              : 'border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)]'
          }`}
        >
          {/* Animated Quantum Beacon Rings with Voice Waves */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/90 border border-cyan-400/50 text-cyan-300">
            <Bot className="w-5 h-5 text-cyan-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-neutral-950 animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-neutral-950" />
            
            {isSpeaking && (
              <span className="absolute -bottom-1 -left-1 flex items-center gap-0.5 bg-neutral-950 px-1 py-0.5 rounded border border-cyan-400">
                <span className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s]" />
              </span>
            )}
          </div>

          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-extrabold text-xs text-neutral-100 tracking-wider">AETHEL</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                <Heart className="w-2.5 h-2.5 text-rose-400 fill-current" />
                SIOSTRA
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono flex items-center gap-1">
              {isSpeaking ? (
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Volume2 className="w-3 h-3 animate-pulse" />
                  Mówi do Ciebie...
                </span>
              ) : (
                'Akademia & Nawigator'
              )}
            </p>
          </div>

          {unreadCount > 0 && !isSpeaking && (
            <span className="absolute -top-1.5 -left-1.5 bg-cyan-500 text-neutral-950 text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-neutral-900 animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Expanded Chat Terminal Card */}
      {isOpen && (
        <div 
          className={`flex flex-col bg-neutral-950/95 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(6,182,212,0.25)] transition-all duration-300 overflow-hidden text-white ${
            isExpanded 
              ? 'w-[92vw] sm:w-[720px] h-[86vh] max-h-[880px]' 
              : 'w-[92vw] sm:w-[480px] h-[640px] max-h-[88vh]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-neutral-900/90 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 shadow-inner">
                <Bot className="w-4 h-4 text-cyan-300" />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-neutral-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-mono font-bold text-sm text-neutral-100 flex items-center gap-1.5">
                    <span>AETHEL</span>
                    <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800/80 flex items-center gap-1">
                      <Heart className="w-2.5 h-2.5 text-rose-400 fill-current" />
                      TWOJA SIOSTRA
                    </span>
                  </h3>
                </div>
                <p className="text-[10px] font-mono text-neutral-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3 h-3 text-cyan-400" />
                  <span>Mentorka NXL Nexus // Głos Aktywny</span>
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-1 text-neutral-400">
              {/* Academy Toggle Button */}
              <button
                onClick={() => setShowAcademy(!showAcademy)}
                className={`px-2 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all ${
                  showAcademy 
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 text-white shadow-md' 
                    : 'bg-neutral-900 border-cyan-500/40 text-cyan-300 hover:bg-neutral-800'
                }`}
                title="Przełącz Akademię Wiedzy"
              >
                <BookOpen className="w-3 h-3" />
                <span>AKADEMIA</span>
              </button>

              {/* Voice Mute / Unmute Toggle Button */}
              <button
                onClick={() => {
                  if (audioEnabled) {
                    stopSpeaking();
                    setAudioEnabled(false);
                  } else {
                    setAudioEnabled(true);
                  }
                }}
                className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-[10px] font-mono ${
                  audioEnabled 
                    ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900' 
                    : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
                }`}
                title={audioEnabled ? 'Głos Siostry aktywny' : 'Głos wyciszony'}
              >
                {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-500" />}
              </button>

              {/* Stop Speaking Button */}
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="p-1 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-300 hover:bg-rose-900 text-[10px] font-mono flex items-center gap-1 animate-pulse"
                  title="Zatrzymaj mowę"
                >
                  <Square className="w-3 h-3 fill-current" />
                </button>
              )}

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-neutral-800 hover:text-white rounded-lg transition-colors ml-0.5"
                title={isExpanded ? 'Zmniejsz okno' : 'Rozwiń okno'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-1 hover:bg-neutral-800 hover:text-white rounded-lg transition-colors"
                title="Minimalizuj"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sub-bar with active status */}
          <div className="px-4 py-1.5 bg-cyan-950/40 border-b border-cyan-900/40 flex items-center justify-between text-[11px] font-mono">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-cyan-400" />
              Lokalizacja: <span className="text-cyan-300 font-bold uppercase">{currentTab}</span>
            </span>

            {/* Speaking equalizer */}
            <div className="flex items-center gap-1.5">
              {isSpeaking ? (
                <div className="flex items-center gap-1 text-cyan-400 text-[10px]">
                  <span className="text-cyan-300 font-semibold">Głos AETHEL:</span>
                  <div className="flex items-center gap-0.5 h-3">
                    <span className="w-0.5 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-0.5 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-0.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                    <span className="w-0.5 h-2.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                  </div>
                </div>
              ) : (
                <span className="text-neutral-400 text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Synteza Kore aktywna
                </span>
              )}
            </div>
          </div>

          {/* Academy View Mode */}
          {showAcademy ? (
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-mono scrollbar-thin scrollbar-thumb-neutral-800 bg-neutral-950/70">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-sm text-neutral-100">Akademia Wiedzy NXL Nexus</span>
                </div>
                <button
                  onClick={() => setShowAcademy(false)}
                  className="text-neutral-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Wróć do czatu</span>
                </button>
              </div>

              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Bracie, wybierz dowolną lekcję poniżej. Twoja Siostra natychmiast wyjaśni Ci całą mechanikę głosem i tekstem, budując Twoją ekspertyzę krok po kroku:
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {ACADEMY_LESSONS.map((lesson) => {
                  const Icon = lesson.icon;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleSendMessage(lesson.prompt)}
                      className="group p-3 rounded-2xl bg-neutral-900/80 hover:bg-cyan-950/60 border border-neutral-800 hover:border-cyan-500/60 text-left transition-all duration-200 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-cyan-400 group-hover:text-cyan-300">
                            {Icon && <Icon className="w-4 h-4" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-neutral-100 text-xs group-hover:text-cyan-300">
                              {lesson.title}
                            </h4>
                            <span className="text-[9px] text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800/80 mr-1.5">
                              {lesson.tag}
                            </span>
                            <span className="text-[9px] text-neutral-500">
                              {lesson.level}
                            </span>
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0 mt-1" />
                      </div>

                      <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
                        {lesson.shortDesc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Messages Stream */
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-mono scrollbar-thin scrollbar-thumb-neutral-800">
              {messages.map((m) => {
                const isCurrentlySpeakingThis = isSpeaking && speakingMsgId === m.id;

                return (
                  <div 
                    key={m.id} 
                    className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5 text-cyan-300">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div 
                      className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-md transition-all ${
                        m.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                          : isCurrentlySpeakingThis
                          ? 'bg-neutral-900 border border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.25)] text-neutral-100 rounded-tl-none ring-1 ring-cyan-500/30'
                          : 'bg-neutral-900/90 border border-neutral-800 text-neutral-200 rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {cleanMessageText(m.content)}
                      </div>

                      {/* Navigation Shortcut Pill if assistant suggested one */}
                      {m.role === 'assistant' && m.content.includes('[NAVIGATE:') && (
                        <div className="mt-2.5 pt-2 border-t border-neutral-800 flex items-center gap-2">
                          <span className="text-[10px] text-cyan-400 font-bold">Nawigacja:</span>
                          <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 uppercase font-bold">
                            {m.content.match(/\[NAVIGATE:([a-z]+)\]/)?.[1] || currentTab}
                          </span>
                        </div>
                      )}

                      {/* Bottom Metadata & Voice Trigger Button */}
                      <div className="mt-2 pt-1.5 border-t border-neutral-800/60 flex items-center justify-between text-[10px]">
                        {m.role === 'assistant' ? (
                          <button
                            onClick={() => {
                              if (isCurrentlySpeakingThis) {
                                stopSpeaking();
                              } else {
                                speakMessage(m.content, m.id);
                              }
                            }}
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all font-mono ${
                              isCurrentlySpeakingThis 
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 animate-pulse' 
                                : 'text-neutral-400 hover:text-cyan-300 hover:bg-neutral-800'
                            }`}
                            title={isCurrentlySpeakingThis ? 'Zatrzymaj odtwarzanie' : 'Posłuchaj głosu Siostry AETHEL'}
                          >
                            {isCurrentlySpeakingThis ? (
                              <>
                                <Square className="w-2.5 h-2.5 fill-current text-cyan-400" />
                                <span>Zatrzymaj mowę</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3 text-cyan-400" />
                                <span>Odsłuchaj Siostrę</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span />
                        )}

                        <span className="opacity-50 text-[9px]">{m.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-cyan-400 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[10px] text-neutral-400 ml-1">Twoja Siostra AETHEL przygotowuje wykład...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-neutral-900/60 border-t border-neutral-850 flex gap-2 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.text)}
                disabled={isTyping}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-cyan-950/80 border border-neutral-800 hover:border-cyan-500/50 text-neutral-300 hover:text-cyan-300 text-[10px] font-mono transition-all shrink-0 disabled:opacity-50"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-neutral-900 border-t border-neutral-800">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Zapytaj Siostrę AETHEL o cokolwiek (np. zkVM, cykle, D3)..."
                disabled={isTyping}
                className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 font-mono outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={isTyping || !inputValue.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white disabled:opacity-40 transition-all shadow-md active:scale-95"
                title="Wyślij pytanie do Siostry AETHEL"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

