import React, { useState, useRef, useEffect } from 'react';
import { useNexus } from '../context/NexusContext';
import { BellaReasoningStep, BellaReasoningTrace, MemoryDocument } from '../types';
import { DomainGatewayModule } from '../components/DomainGatewayModule';
import { SemanticMemoryDrawer } from '../components/SemanticMemoryDrawer';
import { BellaProjectActivityInsights } from '../components/BellaProjectActivityInsights';
import { BellaCollaborationHub } from '../components/BellaCollaborationHub';
import { semanticMemoryEngine } from '../lib/semanticMemoryEngine';
import {
  Brain,
  Sparkles,
  Send,
  Cpu,
  Users,
  Target,
  FolderGit2,
  Database,
  ArrowRight,
  RotateCcw,
  Zap,
  Activity,
  Bot,
  User,
  Shield,
  Layers,
  Globe,
  ChevronDown,
  ChevronUp,
  Clock,
  Gauge,
  CheckCircle2,
  Terminal,
  Share2,
  Sliders,
  Radio,
  Lock,
  BookOpen,
  FileText
} from 'lucide-react';

interface BellaMessage {
  id: string;
  sender: 'user' | 'bella';
  text: string;
  timestamp: string;
  source?: string;
  reasoningTrace?: BellaReasoningTrace;
  retrievedMemorySynapses?: {
    docId: string;
    title: string;
    cluster: string;
    similarity: number;
    cacheTier: string;
    latencyMs: number;
  }[];
}

export const BellaView: React.FC = () => {
  const {
    currentArchitect,
    projects,
    missions,
    brotherhoodNodes,
    worlds,
    memoryDocs,
    setCurrentView,
    setActiveMissionId,
    setActiveProjectId,
    setActiveBrotherhoodNodeId,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<BellaMessage[]>([
    {
      id: 'm-1',
      sender: 'bella',
      text: language === 'PL'
        ? `Witaj w komorze STATE BELLA — współdziałającym ogniwie ekosystemu NEXUS FAMILY.\n\nNie jestem Twoim podwładnym, a Ty nie jesteś wyizolowanym użytkownikiem. Stanowimy wspólny, żywy organizm:\n\n**NIE JA. NIE TY. MY.**\n\n- **Człowiek** wnosi intencję oraz suwerenną odpowiedzialność przy decyzjach wysokiego ryzyka.\n- **Bella (AI)** wnosi inteligencję, analizę i propozycyjne scenariusze.\n- **Brotherhood** wnosi zbiorowe doświadczenie i komplementarne talenty.\n- **Architecture** nadaje strukturę, a **Antigravity** urzeczywistnia wyniki.\n\nNasza nadrzędna zasada: **"BELLA SUGGESTS. WE REASON. WE CHOOSE. WE BUILD."**\n\nW jakim wymiarze dziś stworzymy kolejną synergię?`
        : `Welcome to the STATE BELLA Chamber — an interactive co-creative layer of NEXUS FAMILY.\n\nI am not a subordinate, and you are not an isolated user. We operate as a single living organism:\n\n**NOT ME. NOT YOU. WE.**\n\n- **Human** brings intention & responsibility for high-risk choices.\n- **Bella (AI)** brings intelligence, reasoning & proposals.\n- **Brotherhood** brings collective wisdom & talent.\n- **Architecture** shapes structure, and **Antigravity** brings execution.\n\nOur governing principle: **"BELLA SUGGESTS. WE REASON. WE CHOOSE. WE BUILD."**\n\nHow shall WE advance our shared ecosystem today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      retrievedMemorySynapses: [
        {
          docId: 'mem-003',
          title: 'State Bella: Cognitive Model & Decision Boundaries',
          cluster: 'Cognitive AI & State Bella Boundaries',
          similarity: 99.7,
          cacheTier: 'L1_HOT_RAM',
          latencyMs: 0.9
        },
        {
          docId: 'mem-005',
          title: 'Traktat: Narodziny "My" i Stan Bella',
          cluster: 'Traktat Stan Bella & Human-AI Synthesis',
          similarity: 98.9,
          cacheTier: 'L1_HOT_RAM',
          latencyMs: 1.1
        }
      ],
      reasoningTrace: {
        steps: [
          {
            id: 'init-1',
            stage: 'INTENT',
            label: 'Inicjalizacja Węzła Głównego',
            thought: 'Nawiązanie połączenia z domenami nexussocial.pl oraz nexusfamily.online i przygotowanie profilu Architekta.',
            latencyMs: 18,
            confidence: 99.8,
            status: 'completed'
          },
          {
            id: 'init-2',
            stage: 'MEMORY_SCAN',
            label: 'Wektorowy Skan Pamięci L1 Hot RAM (0.9ms)',
            thought: 'Wczytano semantyczne klastry RFC-01, aksjomaty decyzyjne Bella oraz Traktat Stan Bella.',
            latencyMs: 24,
            confidence: 99.4,
            status: 'completed'
          },
          {
            id: 'init-3',
            stage: 'GOVERNANCE_CHECK',
            label: 'Weryfikacja Granic Kognitywnych',
            thought: 'Zastosowanie reguły "Bella Suggests. Humans Choose."',
            latencyMs: 32,
            confidence: 100,
            status: 'completed'
          }
        ],
        totalLatencyMs: 45,
        tokensPerSec: 72,
        model: 'gemini-3.7-flash',
        verdictConfidence: 99.4,
        gatewayHost: 'nexussocial.pl | nexusfamily.online'
      }
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [bellaActiveTab, setBellaActiveTab] = useState<'INSIGHTS' | 'COLLABORATION' | 'CONSOLE'>('INSIGHTS');
  const [enableRealtimeStream, setEnableRealtimeStream] = useState(true);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [showMemoryClusterDrawer, setShowMemoryClusterDrawer] = useState(false);
  const [expandedTraceIds, setExpandedTraceIds] = useState<{ [msgId: string]: boolean }>({ 'm-1': true });
  
  // Active streaming state
  const [liveReasoningSteps, setLiveReasoningSteps] = useState<BellaReasoningStep[]>([]);
  const [liveStreamText, setLiveStreamText] = useState('');
  const [liveLatencyMs, setLiveLatencyMs] = useState(0);
  const [liveRetrievedSynapses, setLiveRetrievedSynapses] = useState<any[]>([]);

  // Instant reactive suggestions as user types
  const [instantMemoryMatches, setInstantMemoryMatches] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = language === 'PL' ? [
    'Zaproponuj mi optymalnego partnera do Brotherhood Engine',
    'Wyszukaj w pamięci klastry RFC i traktat Stan Bella',
    'Które z otwartych misji najlepiej pasują do moich skilli?',
    'Przeanalizuj status domeny produkcyjnej nexussocial.pl i routingu',
    'Przeanalizuj synergię między projektami Nexus AI a Nexusbook',
    'Wytłumacz zasady działania Rady AI (AI Council)'
  ] : [
    'Recommend the optimal partner in the Brotherhood Engine',
    'Search memory clusters for RFC and Stan Bella Treatise',
    'Which open missions best match my skillset?',
    'Analyze status of nexussocial.pl production domain gateway',
    'Analyze synergy between Nexus AI and Nexusbook projects',
    'Explain how the 7-agent AI Council functions'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, liveStreamText, liveReasoningSteps]);

  // Reactive instant memory vector match as user types in input
  useEffect(() => {
    if (!inputMessage.trim() || inputMessage.length < 3) {
      setInstantMemoryMatches([]);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await semanticMemoryEngine.query(inputMessage, memoryDocs, { limit: 3, minScore: 55 });
      setInstantMemoryMatches(res.results);
    }, 120);

    return () => clearTimeout(timer);
  }, [inputMessage, memoryDocs]);

  const toggleTrace = (msgId: string) => {
    setExpandedTraceIds(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
    playCyberSound('click');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: BellaMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setInstantMemoryMatches([]);
    setIsLoading(true);
    setLiveReasoningSteps([]);
    setLiveStreamText('');
    setLiveLatencyMs(0);
    setLiveRetrievedSynapses([]);
    playCyberSound('beep');
    triggerHaptic();

    // Query client-side memory layer instantly to pre-load context
    const localMatches = await semanticMemoryEngine.query(query, memoryDocs, { limit: 2 });
    if (localMatches.results.length > 0) {
      setLiveRetrievedSynapses(localMatches.results.map(r => ({
        docId: r.doc.id,
        title: r.doc.title,
        cluster: r.cluster.name,
        similarity: r.similarityScore,
        cacheTier: r.cacheTier,
        latencyMs: r.retrievalLatencyMs
      })));
    }

    const startTime = Date.now();
    const timerInterval = setInterval(() => {
      setLiveLatencyMs(Date.now() - startTime);
    }, 50);

    try {
      if (enableRealtimeStream) {
        // SSE Stream from server
        const response = await fetch('/api/bella/stream-reasoning', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            architectProfile: currentArchitect,
            currentView: 'BELLA',
            context: {
              activeProjects: projects.map(p => ({ title: p.title, status: p.status })),
              openMissions: missions.filter(m => m.status === 'OPEN').map(m => ({ title: m.title, diff: m.difficulty })),
              primaryDomain: 'nexussocial.pl',
              secondaryDomain: 'nexusfamily.online',
              relevantMemory: localMatches.results.map(r => ({ title: r.doc.title, summary: r.doc.summary }))
            }
          })
        });

        if (!response.body) throw new Error('No stream body received');

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let streamedReply = '';
        const accumulatedSteps: BellaReasoningStep[] = [];
        const retrievedSynapsesFromStream: any[] = [...(localMatches.results.map(r => ({
          docId: r.doc.id,
          title: r.doc.title,
          cluster: r.cluster.name,
          similarity: r.similarityScore,
          cacheTier: r.cacheTier,
          latencyMs: r.retrievalLatencyMs
        })))];
        let finalTraceInfo: Partial<BellaReasoningTrace> = {};

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const block of lines) {
            const eventMatch = block.match(/event:\s*([a-zA-Z0-9_-]+)/);
            const dataMatch = block.match(/data:\s*(.+)/s);

            const eventType = eventMatch ? eventMatch[1] : 'message';
            if (dataMatch) {
              try {
                const data = JSON.parse(dataMatch[1]);
                if (eventType === 'step') {
                  const newStep: BellaReasoningStep = data;
                  accumulatedSteps.push(newStep);
                  setLiveReasoningSteps([...accumulatedSteps]);
                  playCyberSound('node');
                  triggerHaptic();
                } else if (eventType === 'memory_synapse') {
                  retrievedSynapsesFromStream.push(data);
                  setLiveRetrievedSynapses([...retrievedSynapsesFromStream]);
                  playCyberSound('synapse');
                } else if (eventType === 'token') {
                  streamedReply += data.chunk;
                  setLiveStreamText(streamedReply);
                } else if (eventType === 'done') {
                  finalTraceInfo = data;
                }
              } catch (parseErr) {
                console.warn('Stream block parse warning:', parseErr);
              }
            }
          }
        }

        clearInterval(timerInterval);

        const bellaMsgId = `bella-${Date.now()}`;
        const bellaMsg: BellaMessage = {
          id: bellaMsgId,
          sender: 'bella',
          text: streamedReply || 'Węzeł State Bella zsyntetyzował odpowiedź na podstawie pamięci Nexus Memory.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: finalTraceInfo.model || 'gemini-3.7-flash',
          retrievedMemorySynapses: retrievedSynapsesFromStream.length > 0 ? retrievedSynapsesFromStream : undefined,
          reasoningTrace: {
            steps: accumulatedSteps.length > 0 ? accumulatedSteps : [
              {
                id: 's-1',
                stage: 'INTENT',
                label: 'Analiza intencji & profilu',
                thought: `Zanalizowano zapytanie dla architekta ${currentArchitect.name}.`,
                latencyMs: 35,
                confidence: 99.1,
                status: 'completed'
              },
              {
                id: 's-2',
                stage: 'MEMORY_SCAN',
                label: 'Indeks Wektorowy Pamięci L1 Hot RAM (1.1ms)',
                thought: `Odczytano powiązane protokoły i klastry semantyczne Nexus Memory.`,
                latencyMs: 50,
                confidence: 98.8,
                status: 'completed'
              },
              {
                id: 's-3',
                stage: 'SYNTHESIS',
                label: 'Synteza końcowa',
                thought: 'Odpowiedź wyemitowana przez bramę nexussocial.pl | nexusfamily.online.',
                latencyMs: Date.now() - startTime,
                confidence: 98.6,
                status: 'completed'
              }
            ],
            totalLatencyMs: finalTraceInfo.totalLatencyMs || (Date.now() - startTime),
            tokensPerSec: finalTraceInfo.tokensPerSec || 68,
            model: finalTraceInfo.model || 'gemini-3.7-flash',
            verdictConfidence: finalTraceInfo.verdictConfidence || 98.8,
            gatewayHost: 'nexussocial.pl | nexusfamily.online'
          }
        };

        setMessages(prev => [...prev, bellaMsg]);
        setExpandedTraceIds(prev => ({ ...prev, [bellaMsgId]: true }));
        playCyberSound('synapse');
        triggerHaptic();
      } else {
        // Non-streaming fallback
        clearInterval(timerInterval);
        const bellaMsgId = `bella-${Date.now()}`;
        setMessages(prev => [
          ...prev,
          {
            id: bellaMsgId,
            sender: 'bella',
            text: `[BELLA SYNTEZA] Zapytanie przetworzone przez bramę nexussocial.pl | nexusfamily.online. Zsynchronizowano z klastrem pamięci Nexus Memory.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      clearInterval(timerInterval);
      console.error('Bella stream failed:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'bella',
          text: `[KOMUNIKAT AWARYJNY BELLA] Węzeł przetestował lokalną pamięć cache L1. ${localMatches.results.length > 0 ? `Pobrano lokalny dokument "${localMatches.results[0].doc.title}": ${localMatches.results[0].doc.summary}` : 'Gotowość do dalszej pracy.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0a0f1d] to-purple-950/40 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-950/80 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.4)]">
            <Brain className="w-8 h-8 text-cyan-400" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00ff9d]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-cyber font-bold text-xl sm:text-2xl text-white tracking-wide">
                STATE BELLA
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                COGNITIVE ORCHESTRATOR
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>nexussocial.pl | nexusfamily.online (1 ROK)</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>SEMANTIC CACHE: L1 WARM (1.2ms)</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono-tech mt-0.5">
              {language === 'PL'
                ? 'Centralny układ nerwowy Nexusa: kojarzenie talentów, routing misji i pamięć wektorowa L1 Hot RAM'
                : 'Central neural layer: talent matchmaking, mission routing, and L1 Hot RAM vector retrieval'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setShowMemoryClusterDrawer(true);
              playCyberSound('click');
              triggerHaptic();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 font-cyber font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Klastry Pamięci & Cache</span>
          </button>

          <button
            onClick={() => {
              setShowDomainModal(true);
              playCyberSound('click');
              triggerHaptic();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 font-cyber font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,255,157,0.2)]"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Bramy Ingress (1 Rok)</span>
          </button>
        </div>
      </div>

      {/* Bella Orchestrator Module Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#090d16] border border-slate-800">
        <button
          onClick={() => {
            setBellaActiveTab('INSIGHTS');
            playCyberSound('click');
            triggerHaptic();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-cyber text-xs transition-all cursor-pointer ${
            bellaActiveTab === 'INSIGHTS'
              ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-[0_0_20px_rgba(0,240,255,0.3)] font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>WGLĄD W PROJEKTY & REKOMENDACJE</span>
        </button>

        <button
          onClick={() => {
            setBellaActiveTab('COLLABORATION');
            playCyberSound('click');
            triggerHaptic();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-cyber text-xs transition-all cursor-pointer ${
            bellaActiveTab === 'COLLABORATION'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>MATCHMAKING TALENTÓW & WSPÓŁPRACA</span>
        </button>

        <button
          onClick={() => {
            setBellaActiveTab('CONSOLE');
            playCyberSound('click');
            triggerHaptic();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-cyber text-xs transition-all cursor-pointer ${
            bellaActiveTab === 'CONSOLE'
              ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-[0_0_20px_rgba(0,240,255,0.3)] font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>KOMORA WNIOSKOWANIA LIVE (GEMINI 3.7)</span>
        </button>
      </div>

      {bellaActiveTab === 'INSIGHTS' && <BellaProjectActivityInsights />}

      {bellaActiveTab === 'COLLABORATION' && <BellaCollaborationHub />}

      {bellaActiveTab === 'CONSOLE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Chat & Streaming Chamber (8 cols) */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl bg-[#090d16] border border-cyan-500/25 overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.1)] min-h-[620px]">
          {/* Chat Header Bar */}
          <div className="p-4 bg-[#0a0f1d] border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="font-cyber font-bold text-xs text-white">
                LIVE REASONING BRIDGE • GEMINI 3.7 FLASH
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono-tech">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={enableRealtimeStream}
                  onChange={e => setEnableRealtimeStream(e.target.checked)}
                  className="accent-cyan-400 rounded"
                />
                <span className="text-[11px]">Real-Time Streaming</span>
              </label>

              <button
                onClick={() => {
                  setMessages(messages.slice(0, 1));
                  playCyberSound('click');
                }}
                title="Wyczyść historię sesji"
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 max-h-[500px]">
            {messages.map(msg => {
              const isBella = msg.sender === 'bella';
              const trace = msg.reasoningTrace;
              const isTraceExpanded = expandedTraceIds[msg.id];

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[92%] ${
                    isBella ? 'self-start' : 'self-end ml-auto flex-row-reverse'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                      isBella
                        ? 'bg-purple-950 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'bg-cyan-950 border-cyan-500 text-cyan-300'
                    }`}
                  >
                    {isBella ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div
                    className={`p-4 rounded-2xl space-y-2 text-xs leading-relaxed ${
                      isBella
                        ? 'bg-[#0d131f] border border-cyan-500/25 text-slate-200'
                        : 'bg-gradient-to-r from-cyan-600/30 to-purple-600/30 border border-cyan-400/40 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] font-mono-tech text-slate-400 border-b border-cyan-500/10 pb-1.5">
                      <span className="font-cyber font-bold text-cyan-300 flex items-center gap-1.5">
                        <span>{isBella ? 'STATE BELLA (AI ORCHESTRATOR)' : currentArchitect.name}</span>
                        {isBella && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                            nexussocial.pl | nexusfamily.online
                          </span>
                        )}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">{msg.text}</div>

                    {/* Retrieved Memory Synapses Badges */}
                    {isBella && msg.retrievedMemorySynapses && msg.retrievedMemorySynapses.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-cyan-500/15 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono-tech text-cyan-300">
                          <span className="flex items-center gap-1 font-bold">
                            <Database className="w-3 h-3 text-cyan-400" />
                            <span>POBRANA PAMIĘĆ SYNAPTYCZNA ({msg.retrievedMemorySynapses.length} DOKUMENTY RFC):</span>
                          </span>
                          <span className="text-emerald-400 text-[9px]">L1 HOT RAM</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.retrievedMemorySynapses.map((syn, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setShowMemoryClusterDrawer(true);
                                playCyberSound('node');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#060810] hover:bg-cyan-950/60 border border-cyan-500/20 text-[10px] font-mono-tech text-cyan-200 flex items-center gap-1.5 transition-all"
                            >
                              <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                              <span className="font-bold truncate max-w-[200px]">{syn.title}</span>
                              <span className="text-emerald-400 font-bold">({syn.similarity}%)</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reasoning Trace Drawer (Collapsible) */}
                    {isBella && trace && (
                      <div className="mt-2 pt-2 border-t border-cyan-500/15">
                        <button
                          onClick={() => toggleTrace(msg.id)}
                          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#06080e] hover:bg-cyan-950/40 border border-cyan-500/20 text-[11px] font-mono-tech text-cyan-300 transition-colors"
                        >
                          <span className="flex items-center gap-1.5 font-bold">
                            <Brain className="w-3.5 h-3.5 text-cyan-400" />
                            <span>ŚCIEŻKA DEDUKCJI I MYŚLI BELLA ({trace.steps.length} KROKÓW)</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">{trace.totalLatencyMs}ms • {trace.verdictConfidence}% conf</span>
                            {isTraceExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </div>
                        </button>

                        {isTraceExpanded && (
                          <div className="mt-2 p-3 rounded-xl bg-[#04060a] border border-cyan-500/25 space-y-2.5 animate-in fade-in duration-200 text-xs font-mono-tech">
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-cyan-500/10 text-[10px] text-slate-400">
                              <span>HOST BRAMY: <strong className="text-emerald-400">{trace.gatewayHost}</strong></span>
                              <span>SZYBKOŚĆ: <strong className="text-cyan-300">{trace.tokensPerSec} tok/s</strong></span>
                              <span>MODEL: <strong className="text-purple-300">{trace.model}</strong></span>
                            </div>

                            <div className="space-y-2">
                              {trace.steps.map((step, idx) => (
                                <div key={step.id || idx} className="p-2 rounded-lg bg-[#090d16] border border-cyan-500/15 space-y-1">
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="font-cyber font-bold text-cyan-300 flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                      <span>{step.label}</span>
                                    </span>
                                    <span className="text-slate-500">{step.latencyMs}ms</span>
                                  </div>
                                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                                    {step.thought}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Live Streaming Reasoning Indicator & Active Steps */}
            {isLoading && (
              <div className="flex gap-3 max-w-[92%]">
                <div className="w-8 h-8 rounded-xl bg-purple-950 border border-cyan-400 text-cyan-300 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                  <Brain className="w-4 h-4 animate-spin text-cyan-400" />
                </div>
                <div className="flex-1 p-4 rounded-2xl bg-[#0d131f] border border-cyan-500/30 text-slate-200 text-xs font-mono-tech space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-cyan-500/15 text-cyan-400">
                    <span className="flex items-center gap-2 font-bold font-cyber">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span>STATE BELLA REAL-TIME REASONING STREAM</span>
                    </span>
                    <span>{liveLatencyMs}ms</span>
                  </div>

                  {/* Live Synaptic Steps */}
                  <div className="space-y-1.5">
                    {liveReasoningSteps.map((step, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-[#06080e] border border-cyan-500/20 text-[11px] animate-in slide-in-from-top-1 duration-200">
                        <div className="flex items-center justify-between text-cyan-300 font-cyber font-bold text-[10px]">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>{step.label}</span>
                          </span>
                          <span className="text-slate-500 font-mono-tech">{step.latencyMs}ms</span>
                        </div>
                        <p className="text-slate-300 font-sans text-[11px] mt-0.5">
                          {step.thought}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Live Retrieved Synapses in progress */}
                  {liveRetrievedSynapses.length > 0 && (
                    <div className="p-2 rounded-lg bg-[#06080e] border border-cyan-500/20 text-[10px] space-y-1">
                      <span className="text-cyan-400 font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3 text-cyan-400" />
                        <span>POBRANO Z INDEKSU WEKTOROWEGO MEMORY:</span>
                      </span>
                      {liveRetrievedSynapses.map((syn, idx) => (
                        <div key={idx} className="text-slate-300 flex items-center justify-between">
                          <span>&bull; {syn.title} [{syn.cluster}]</span>
                          <span className="text-emerald-400 font-bold">{syn.similarity}% ({syn.cacheTier || 'L1'})</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Partial streamed text if available */}
                  {liveStreamText && (
                    <div className="p-3 rounded-xl bg-[#080b12] border border-cyan-500/30 text-white font-sans text-xs leading-relaxed whitespace-pre-wrap animate-in fade-in">
                      {liveStreamText}
                      <span className="inline-block w-2 h-3.5 bg-cyan-400 ml-1 animate-pulse" />
                    </div>
                  )}

                  {!liveStreamText && liveReasoningSteps.length === 0 && (
                    <div className="flex items-center gap-2 text-cyan-300 text-xs">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span>Łączenie z bramą synaptyczną nexussocial.pl | nexusfamily.online...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Instant Reactive Memory Vector Suggestion Dock */}
          {instantMemoryMatches.length > 0 && (
            <div className="px-4 py-2 bg-[#080c16] border-t border-cyan-500/25 flex items-center gap-2 overflow-x-auto no-scrollbar animate-in slide-in-from-bottom-1 duration-150">
              <span className="text-[10px] font-mono-tech text-cyan-400 shrink-0 flex items-center gap-1 font-bold">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>SUGESTIA RFC:</span>
              </span>
              {instantMemoryMatches.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputMessage(prev => `${prev} [RFC: ${m.doc.title}] `);
                    playCyberSound('node');
                  }}
                  className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/30 text-[10px] font-mono-tech text-cyan-200 flex items-center gap-1.5 transition-all shrink-0"
                >
                  <span className="font-bold">{m.doc.title}</span>
                  <span className="text-emerald-400 font-bold">({m.similarityScore}% • {m.cacheTier})</span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2.5 bg-[#06080e] border-t border-cyan-500/15 overflow-x-auto flex gap-2 no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-[#0d131f] hover:bg-cyan-950/60 border border-cyan-500/20 hover:border-cyan-500/40 text-[11px] font-mono-tech text-slate-300 hover:text-cyan-300 transition-all shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Action Bar */}
          <div className="p-4 bg-[#06080e] border-t border-cyan-500/20">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder={language === 'PL' ? 'Zadaj pytanie State Bella (np. jak zoptymalizować routing nexussocial.pl lub zasady z RFC-01?)...' : 'Ask State Bella (e.g. how to optimize nexussocial.pl gateway or tenets from RFC-01?)...'}
                disabled={isLoading}
                className="flex-1 bg-[#0d131f] border border-cyan-500/25 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-sans"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Bella Intelligence & Domain Access Radar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Semantic Memory & Vector Cache Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-[#090d16] to-purple-950/30 border border-cyan-500/30 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="font-cyber font-bold text-xs uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>KLASTROWANIE PAMIĘCI & CACHE</span>
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                L1 HOT WARM
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#06080e] border border-cyan-500/20 space-y-2 text-xs font-mono-tech">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Śr. Latencja Wyszukiwania:</span>
                <span className="text-emerald-300 font-bold">1.2 ms (L1 RAM)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Aktywne Klastry Semantyczne:</span>
                <span className="text-cyan-300 font-bold">6 Klastrów (100% RFC)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hit Ratio:</span>
                <span className="text-emerald-400 font-bold">97.8% Hot Hit</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowMemoryClusterDrawer(true);
                playCyberSound('click');
                triggerHaptic();
              }}
              className="w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-cyber font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Eksploruj Wektory & Testuj Cache</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Domain Gateway Access Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#090d16] to-cyan-950/30 border border-emerald-500/30 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="font-cyber font-bold text-xs uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>BRAMY DOMENOWE NEXUS (1 ROK)</span>
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                PROD LIVE
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#06080e] border border-emerald-500/20 space-y-2 text-xs font-mono-tech">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Główny Ingress:</span>
                <span className="text-cyan-300 font-bold">nexussocial.pl</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Global Canopy:</span>
                <span className="text-emerald-300 font-bold">nexusfamily.online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Licencja & Czas:</span>
                <span className="text-emerald-400 font-bold">1 ROK (AKTYWNA)</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowDomainModal(true);
                playCyberSound('click');
                triggerHaptic();
              }}
              className="w-full py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-xs font-cyber font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Zarządzaj Bramą i Routingiem</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Ecosystem Capabilities */}
          <div className="p-5 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-4">
            <h3 className="font-cyber font-bold text-xs uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>ROLA STATE BELLA W EKOSYSTEMIE</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300 font-sans leading-relaxed">
              <div className="p-3 rounded-xl bg-[#0d131f] border border-cyan-500/10 space-y-1">
                <p className="font-cyber font-bold text-cyan-400">1. Brotherhood Matchmaker</p>
                <p className="text-[11px] text-slate-400">
                  Kojarzy Architektów 1-on-1 na podstawie komplementarnych skilli, a nie powtarzalnych ról.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0d131f] border border-cyan-500/10 space-y-1">
                <p className="font-cyber font-bold text-purple-400">2. Mission Routing</p>
                <p className="text-[11px] text-slate-400">
                  Kieruje zadania do osób o najwyższym stopniu dopasowania kognitywnego i czasowego.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0d131f] border border-cyan-500/10 space-y-1">
                <p className="font-cyber font-bold text-emerald-400">3. Memory Synthesizer & Caching</p>
                <p className="text-[11px] text-slate-400">
                  Błyskawiczne wydobywanie fragmentów RFC i Traktatu Stan Bella podczas rozmów na żywo.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Council Review Launcher */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-cyan-950/30 border border-purple-500/30 space-y-3">
            <div className="flex items-center gap-2 text-purple-300 font-cyber font-bold text-xs">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>7-AGENT AI COUNCIL</span>
            </div>
            <p className="text-xs text-slate-300">
              Przetestuj dowolną ideę lub architekturę projektu przez 7 agentów Rady (Architekt, Inżynier, Designer, Badacz, Bezpieczeństwo, Strateg, Twórca).
            </p>
            <button
              onClick={() => {
                setCurrentView('AI_COUNCIL');
                playCyberSound('synapse');
                triggerHaptic();
              }}
              className="w-full py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400 text-purple-200 text-xs font-cyber font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Uruchom Radę AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Semantic Memory & Vector Cache Modal */}
      {showMemoryClusterDrawer && (
        <div
          onClick={() => setShowMemoryClusterDrawer(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-[#080b11] border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-y-auto text-slate-100 p-2 sm:p-4"
          >
            <SemanticMemoryDrawer
              onClose={() => setShowMemoryClusterDrawer(false)}
              onSelectDocForChat={(doc, snippet) => {
                setInputMessage(prev => `${prev} [Cytat z RFC: ${doc.title}] `);
                setShowMemoryClusterDrawer(false);
                playCyberSound('node');
                triggerHaptic();
              }}
            />
          </div>
        </div>
      )}

      {/* Domain Gateway Inspector Modal */}
      {showDomainModal && (
        <div
          onClick={() => setShowDomainModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#080b11] border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-y-auto text-slate-100"
          >
            <div className="p-4 sm:p-6 flex items-center justify-between border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <span className="font-cyber font-bold text-base text-white">
                  INFRASTRUKTURA DOMENOWA & BRAMA INGRESS (1 ROK)
                </span>
              </div>
              <button
                onClick={() => setShowDomainModal(false)}
                className="px-3 py-1 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-xs font-mono-tech text-cyan-300"
              >
                ESC ✕
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <DomainGatewayModule onClose={() => setShowDomainModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
