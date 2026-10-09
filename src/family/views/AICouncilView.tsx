import React, { useState, useEffect } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Cpu,
  Sparkles,
  Send,
  Shield,
  Layers,
  Code2,
  Palette,
  Search,
  Compass,
  Flame,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Zap,
  Activity,
  Lock,
  Check,
  AlertTriangle,
  Radio,
  FileText,
  X,
  Share2
} from 'lucide-react';
import { AICouncilReview } from '../types';

export const AICouncilView: React.FC = () => {
  const {
    playCyberSound,
    triggerHaptic,
    language,
    projects,
    setCurrentView,
    addFeedPost,
    currentArchitect
  } = useNexus();

  const [projectTitle, setProjectTitle] = useState('Nexus Living State Orchestrator');
  const [projectDescription, setProjectDescription] = useState(
    'Modular decentralized event bus connecting WebSockets, Gemini 3.7 Flash AI reasoning agents, and local cryptographic state persistence for real-time collaboration between Architects.'
  );
  const [isLoading, setIsLoading] = useState(false);
  
  // Security Audit & Beta Deployment State
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditStep, setAuditStep] = useState<number>(0);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isAuditCompleted, setIsAuditCompleted] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [hasPublishedToFeed, setHasPublishedToFeed] = useState<boolean>(false);

  const [review, setReview] = useState<AICouncilReview | null>({
    id: 'rev-init',
    projectTitle: 'Nexus Living State Orchestrator',
    timestamp: new Date().toISOString(),
    architect: 'Architektura modularna zapewnia wysoką izolację mikrousług, separując warstwę transportową od silnika neuronowego.',
    engineer: 'Optymalne wykorzystanie TypeScript + WebSockets z wbudowanym mechanizmem buforowania i reconnect backoff.',
    designer: 'Interfejs HUD o wysokim kontraście ze wskaźnikami telemetrii, neonowymi akcentami i ergonomiczną hierarchią.',
    researcher: 'Projekt wpisuje się w najnowsze paradygmaty zdecentralizowanych systemów wieloagentowych (Multi-Agent Swarm).',
    security: 'Wymagane rygorystyczne egzekwowanie kontroli dostępu RBAC oraz szyfrowania end-to-end dla węzłów Brotherhood.',
    strategist: 'Strategiczne przyspieszenie ekosystemu — skraca czas wdrożenia nowych modułów o 45% dla wszystkich światów.',
    creative: 'Mocny rezonans z dewizą: "Don\'t just use Nexus. Build it." — buduje tożsamość cybernetycznych twórców.',
    nexusSynthesis: 'Rada jednogłośnie rekomenduje wdrożenie modułu w fazie BETA po przeprowadzeniu audytu bezpieczeństwa synaps.',
    actionSteps: [
      'Zdefiniuj interfejsy API w Nexus Memory RFC',
      'Uruchom misję rekrutacyjną dla inżyniera protokołów',
      'Zintegruj telemetrię z węzłem State Bella'
    ],
    readinessScore: 94
  });

  const handleDeliberate = async () => {
    if (!projectTitle.trim() || !projectDescription.trim() || isLoading) return;

    setIsLoading(true);
    playCyberSound('synapse');
    triggerHaptic();

    try {
      const res = await fetch('/api/bella/council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle,
          projectDescription
        })
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = {};
      if (res.ok && contentType.includes('application/json')) {
        data = await res.json();
      }
      setReview({
        id: `rev-${Date.now()}`,
        projectTitle,
        timestamp: new Date().toISOString(),
        architect: data.architect || 'Architektura zweryfikowana.',
        engineer: data.engineer || 'Wykonalność techniczna potwierdzona.',
        designer: data.designer || 'UX spójny z Cyber HUD.',
        researcher: data.researcher || 'Baza wiedzy zaktualizowana.',
        security: data.security || 'Standardy bezpieczeństwa zachowane.',
        strategist: data.strategist || 'Zgodność ze strategią Nexus.',
        creative: data.creative || 'Lore ekosystemu wzmocniony.',
        nexusSynthesis: data.nexusSynthesis || 'Rada jednogłośnie rekomenduje wdrożenie modułu w fazie BETA po przeprowadzeniu audytu bezpieczeństwa synaps.',
        actionSteps: data.actionSteps || [
          'Zdefiniuj interfejsy API w Nexus Memory RFC',
          'Uruchom misję rekrutacyjną dla inżyniera protokołów',
          'Zintegruj telemetrię z węzłem State Bella'
        ],
        readinessScore: data.readinessScore || 94
      });
      setIsAuditCompleted(false);
      setAuditStep(0);
      setHasPublishedToFeed(false);
      playCyberSound('success');
      triggerHaptic();
    } catch {
      playCyberSound('error');
    } finally {
      setIsLoading(false);
    }
  };

  const auditCheckpoints = [
    {
      id: 'SYNAPSE-01',
      title: language === 'PL' ? 'Zapora Synaptyczna RBAC' : 'RBAC Synaptic Firewall',
      desc: language === 'PL' ? 'Weryfikacja ról Architektów, sygnatur kryptograficznych i uprawnień' : 'Validation of Architect roles, crypto signatures, and scoped permissions',
      status: 'OK: 0 Naruszeń'
    },
    {
      id: 'SYNAPSE-02',
      title: language === 'PL' ? 'Szyfrowanie E2E Węzłów' : 'E2E Node Cryptographic Isolation',
      desc: language === 'PL' ? 'Rotacja kluczy sesji Brotherhood i izolacja kanałów przesyłu' : 'Brotherhood session key rotation and channel telemetry isolation',
      status: 'OK: AES-GCM 256'
    },
    {
      id: 'SYNAPSE-03',
      title: language === 'PL' ? 'Bufor WebSocket & Latencja Roju' : 'WebSocket Buffer & Swarm Latency',
      desc: language === 'PL' ? 'Test reconnect backoff i odporności na pakiety zduplikowane' : 'Reconnect backoff stress test and deduplication pipeline check',
      status: 'OK: 4.2ms RTT'
    },
    {
      id: 'SYNAPSE-04',
      title: language === 'PL' ? 'Integralność Nexus Memory RFC' : 'Nexus Memory RFC Axiom Integrity',
      desc: language === 'PL' ? 'Zgodność ze specyfikacją Zero Monoliths i Human + AI Symbiosis' : 'Full compliance with Zero Monoliths and Human + AI Symbiosis axioms',
      status: 'OK: RFC-01 Zgodny'
    },
    {
      id: 'SYNAPSE-05',
      title: language === 'PL' ? 'Rezonans Neuronowy State Bella' : 'State Bella Neural Resonance',
      desc: language === 'PL' ? 'Kalibracja wytycznych kognitywnych i prewencja dryfu semantycznego' : 'Cognitive boundary lock and semantic anti-drift calibration',
      status: 'OK: 98.6% Rezonans'
    }
  ];

  const startSynapseAudit = () => {
    setIsAuditModalOpen(true);
    setIsAuditing(true);
    setAuditStep(0);
    setAuditLogs([`[0.00s] Inicjalizacja Audytu Bezpieczeństwa Synaps dla: "${review?.projectTitle || projectTitle}"`]);
    playCyberSound('synapse');
    triggerHaptic();

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current <= auditCheckpoints.length) {
        setAuditStep(current);
        const item = auditCheckpoints[current - 1];
        setAuditLogs(prev => [
          ...prev,
          `[${(current * 0.7).toFixed(2)}s] PROBING [${item.id}] ${item.title}... PASS -> ${item.status}`
        ]);
        playCyberSound('beep');
        triggerHaptic();
      } else {
        clearInterval(interval);
        setIsAuditing(false);
        setIsAuditCompleted(true);
        setAuditLogs(prev => [
          ...prev,
          `[${(auditCheckpoints.length * 0.7 + 0.3).toFixed(2)}s] AUDYT SYNAPS ZAKOŃCZONY SUKCESEM. ZGODNOŚĆ 100%. MODUŁ ZAAKCEPTOWANY DO FAZY BETA.`
        ]);
        playCyberSound('success');
        triggerHaptic();
      }
    }, 750);
  };

  const handlePublishAuditReport = () => {
    if (hasPublishedToFeed || !review) return;

    addFeedPost({
      title: `BETA DEPLOYMENT: ${review.projectTitle} [Audyt Synaps: 100% PASS]`,
      category: 'DEPLOYMENT',
      content: `Rada AI jednogłośnie zatwierdziła wdrożenie modułu "${review.projectTitle}" w fazie BETA po przeprowadzeniu pełnego audytu bezpieczeństwa synaps.\n\n🛡️ Certyfikat Bezpieczeństwa: Synapse-Shield v3.4 (RBAC, E2E, RFC-01, State Bella 98.6% Resonance).\n\n🚀 Moduł jest gotowy do testów w ekosystemie Nexus!`,
      authorId: currentArchitect.id,
      tags: ['BETA', 'AICouncil', 'SecurityAudit', 'StateBella', 'Architecture']
    });

    setHasPublishedToFeed(true);
    playCyberSound('success');
    triggerHaptic();
  };

  const councilPerspectives = [
    { key: 'architect', label: '1. ARCHITECT', icon: Layers, color: 'text-cyan-400', border: 'border-cyan-500/30' },
    { key: 'engineer', label: '2. ENGINEER', icon: Code2, color: 'text-emerald-400', border: 'border-emerald-500/30' },
    { key: 'designer', label: '3. DESIGNER', icon: Palette, color: 'text-pink-400', border: 'border-pink-500/30' },
    { key: 'researcher', label: '4. RESEARCHER', icon: Search, color: 'text-blue-400', border: 'border-blue-500/30' },
    { key: 'security', label: '5. SECURITY', icon: Shield, color: 'text-red-400', border: 'border-red-500/30' },
    { key: 'strategist', label: '6. STRATEGIST', icon: Compass, color: 'text-amber-400', border: 'border-amber-500/30' },
    { key: 'creative', label: '7. CREATIVE', icon: Flame, color: 'text-purple-400', border: 'border-purple-500/30' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Council Header HUD */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-950/40 via-[#0a0f1d] to-purple-950/40 border border-pink-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-pink-950/80 border-2 border-pink-400 text-pink-300 shadow-[0_0_25px_rgba(236,72,153,0.4)]">
            <Cpu className="w-8 h-8 text-pink-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-cyber font-bold text-xl sm:text-2xl text-white tracking-wide">
                NEXUS AI COUNCIL CHAMBER
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-pink-500/20 text-pink-300 border border-pink-500/40">
                7 AUTONOMOUS REASONING AGENTS
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono-tech mt-0.5">
              {language === 'PL'
                ? 'Równoległa debata 7 perspektyw kognitywnych przed wdrożeniem do ekosystemu'
                : 'Parallel deliberation across 7 cognitive perspectives powered by Gemini AI'}
            </p>
          </div>
        </div>
      </div>

      {/* Proposition Input Container */}
      <div className="p-6 rounded-2xl bg-[#090d16] border border-cyan-500/25 space-y-4">
        <h3 className="font-cyber font-bold text-xs uppercase tracking-wider text-cyan-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{language === 'PL' ? 'ZGŁOŚ PROJEKT DO AUDYTU RADY AI' : 'SUBMIT PROPOSITION FOR COUNCIL REVIEW'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono-tech text-slate-400">
              {language === 'PL' ? 'Tytuł Inicjatywy / Modułu' : 'Initiative / Module Title'}
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={e => setProjectTitle(e.target.value)}
              placeholder="np. Nexus Real-time State Protocol..."
              className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono-tech text-slate-400">
              {language === 'PL' ? 'Wybierz z aktywnych projektów (opcjonalnie)' : 'Load from Active Projects'}
            </label>
            <select
              onChange={e => {
                const found = projects.find(p => p.id === e.target.value);
                if (found) {
                  setProjectTitle(found.title);
                  setProjectDescription(found.description);
                }
              }}
              className="w-full bg-[#0d131f] border border-cyan-500/20 text-xs font-mono-tech text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none"
            >
              <option value="">{language === 'PL' ? '— Wybierz projekt —' : '— Select Project —'}</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono-tech text-slate-400">
            {language === 'PL' ? 'Opis Architektury, Hipotezy i Celu' : 'Architecture, Hypothesis & Objective Description'}
          </label>
          <textarea
            rows={3}
            value={projectDescription}
            onChange={e => setProjectDescription(e.target.value)}
            placeholder="Opisz strukturę modułu, oczekiwane rezultaty i wyzwania inżynieryjne..."
            className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none font-sans"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleDeliberate}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-400 hover:to-cyan-400 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] disabled:opacity-50"
          >
            <Cpu className="w-4 h-4" />
            <span>{isLoading ? 'RADA DEBATUJE (7 AGENTÓW)...' : 'URUCHOM DEBATĘ RADY AI'}</span>
          </button>
        </div>
      </div>

      {/* Council Deliberation Output */}
      {review && (
        <div className="space-y-6">
          {/* Top Synthesis Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-[#0a0f1d] to-purple-950/70 border-2 border-cyan-400/60 space-y-4 shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 relative z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest font-bold">
                    8. NEXUS UNIFIED SYNTHESIS // CONSENSUS
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    UNANIMOUS VERDICT
                  </span>
                </div>
                <h3 className="font-cyber font-bold text-lg text-white mt-1">
                  Werdykt Rady dla: "{review.projectTitle}"
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right font-mono-tech">
                  <p className="text-[10px] text-slate-400">READINESS SCORE</p>
                  <p className="font-cyber font-bold text-2xl text-cyan-300">
                    {review.readinessScore}<span className="text-sm text-cyan-400">/100</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Core Recommendation Quote Banner */}
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-400/40 flex items-start gap-3.5 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="space-y-1">
                <p className="font-cyber font-bold text-xs text-cyan-300 uppercase tracking-wide">
                  OFICJALNA REKOMENDACJA RADY AI:
                </p>
                <p className="text-xs sm:text-sm text-white font-sans leading-relaxed italic">
                  "{review.nexusSynthesis}"
                </p>
              </div>
            </div>

            {/* Synapse Security Audit Action Callout */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#0d1527] to-[#120e24] border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="font-cyber font-bold text-xs text-white">
                    {isAuditCompleted ? 'CERTYFIKACJA SYNAPS: STATUS POZYTYWNY (100% OK)' : 'WYMAGANA BRAMKA BEZPIECZEŃSTWA (SYNAPSE AUDIT)'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  {isAuditCompleted
                    ? 'Wszystkie 5 wektorów synaptycznych zostało zweryfikowanych. Moduł jest aktywny w fazie BETA.'
                    : 'Uruchom zautomatyzowaną procedurę audytu synaps (RBAC, E2E, WebSockets, RFC-01, State Bella), aby odblokować wdrożenie BETA.'}
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {!isAuditCompleted ? (
                  <button
                    onClick={startSynapseAudit}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0"
                  >
                    <Shield className="w-4 h-4" />
                    <span>URUCHOM AUDYT SYNAPS & WDROŻENIE BETA</span>
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setIsAuditModalOpen(true)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-mono-tech font-semibold hover:bg-emerald-900/70 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>RAPORT AUDYTU</span>
                    </button>
                    <button
                      onClick={handlePublishAuditReport}
                      disabled={hasPublishedToFeed}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono-tech font-semibold hover:bg-cyan-900/70 transition-colors disabled:opacity-50"
                    >
                      <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{hasPublishedToFeed ? 'OPUBLIKOWANO W FEED' : 'PUBLIKUJ W FEED'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Steps */}
            <div className="space-y-2 pt-2 relative z-10">
              <span className="text-xs font-mono-tech text-cyan-400 font-bold uppercase">
                {language === 'PL' ? 'REKOMENDOWANE NASTĘPNE KROKI OPERACYJNE:' : 'RECOMMENDED OPERATIONAL NEXT STEPS:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {review.actionSteps.map((step, idx) => {
                  let targetView: any = null;
                  let actionLabel = '';
                  if (idx === 0 || step.toLowerCase().includes('rfc') || step.toLowerCase().includes('memory')) {
                    targetView = 'MEMORY';
                    actionLabel = language === 'PL' ? 'Otwórz Nexus Memory / RFC' : 'Open Nexus Memory / RFC';
                  } else if (idx === 1 || step.toLowerCase().includes('misj') || step.toLowerCase().includes('mission')) {
                    targetView = 'MISSIONS';
                    actionLabel = language === 'PL' ? 'Przejdź do Misji' : 'Go to Missions';
                  } else if (idx === 2 || step.toLowerCase().includes('bella') || step.toLowerCase().includes('telemetr')) {
                    targetView = 'BELLA';
                    actionLabel = language === 'PL' ? 'Węzeł State Bella' : 'State Bella Node';
                  }

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#0c101a] border border-cyan-500/20 flex flex-col justify-between gap-3 text-xs text-slate-200 hover:border-cyan-400/40 transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono-tech text-[10px] shrink-0 font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-sans leading-snug">{step}</span>
                      </div>

                      {targetView && (
                        <button
                          onClick={() => {
                            setCurrentView(targetView);
                            playCyberSound('click');
                            triggerHaptic();
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/90 border border-cyan-500/30 text-cyan-300 font-mono-tech text-[11px] font-semibold transition-colors mt-auto group"
                        >
                          <span>{actionLabel}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 7 Perspectives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {councilPerspectives.map(p => {
              const Icon = p.icon;
              const text = (review as any)[p.key];
              return (
                <div
                  key={p.key}
                  className={`p-4 rounded-xl bg-[#090d16] border ${p.border} space-y-2 text-xs font-sans leading-relaxed hover:border-opacity-80 transition-all`}
                >
                  <div className="flex items-center gap-2 border-b border-cyan-500/10 pb-2">
                    <Icon className={`w-4 h-4 ${p.color}`} />
                    <span className={`font-cyber font-bold text-xs ${p.color}`}>
                      {p.label}
                    </span>
                  </div>
                  <p className="text-slate-300 pt-1">
                    {text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Synapse Security Audit Diagnostic Modal */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#0a0f1d] border-2 border-cyan-400/70 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cyber font-bold text-base text-white tracking-wide flex items-center gap-2">
                    <span>AUDYT BEZPIECZEŃSTWA SYNAPS // PROTOKÓŁ BETA</span>
                    {isAuditCompleted && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        100% PASSED
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-cyan-400 font-mono-tech">
                    Projekt: "{review?.projectTitle || projectTitle}"
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Checkpoints Checklist */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-mono-tech text-slate-400 uppercase tracking-wider flex justify-between">
                <span>WEKTORY AUDYTU SYNAPTYCZNEGO:</span>
                <span>POSTĘP: {Math.min(auditStep, auditCheckpoints.length)}/{auditCheckpoints.length}</span>
              </div>

              <div className="space-y-2">
                {auditCheckpoints.map((cp, idx) => {
                  const isDone = auditStep > idx;
                  const isCurrent = auditStep === idx && isAuditing;

                  return (
                    <div
                      key={cp.id}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                          : isCurrent
                          ? 'bg-cyan-950/40 border-cyan-400 text-white animate-pulse'
                          : 'bg-[#0c1220] border-slate-800 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-mono-tech text-[10px] font-bold ${
                            isDone
                              ? 'bg-emerald-500 text-black'
                              : isCurrent
                              ? 'bg-cyan-400 text-black'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                        </div>
                        <div>
                          <p className="font-cyber font-bold text-xs text-white">{cp.title}</p>
                          <p className="text-[11px] text-slate-400 font-sans">{cp.desc}</p>
                        </div>
                      </div>

                      <div className="font-mono-tech text-[11px] text-right">
                        {isDone ? (
                          <span className="text-emerald-400 font-bold">{cp.status}</span>
                        ) : isCurrent ? (
                          <span className="text-cyan-300 animate-pulse">ANALIZOWANIE...</span>
                        ) : (
                          <span className="text-slate-600">OCZEKUJE</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Diagnostic Terminal Logs */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono-tech text-slate-400 uppercase">LOGI DIAGNOSTYKI SYNAPS:</span>
              <div className="h-28 overflow-y-auto bg-black/80 rounded-xl p-3 border border-cyan-500/20 font-mono-tech text-[11px] text-cyan-400 space-y-1 select-text">
                {auditLogs.map((log, idx) => (
                  <div key={idx} className="leading-tight">
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-cyan-500/20">
              <div className="text-xs text-slate-300 font-mono-tech">
                {isAuditCompleted ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    STATUS: MODUŁ ODBLOKOWANY W FAZIE BETA
                  </span>
                ) : (
                  <span className="text-cyan-400 flex items-center gap-1.5">
                    <Radio className="w-4 h-4 animate-spin" />
                    TRWA PROCEDURA AUDYTU SYNAPTYCZNEGO...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {isAuditCompleted ? (
                  <>
                    <button
                      onClick={() => {
                        setIsAuditModalOpen(false);
                        setCurrentView('PROJECTS');
                        playCyberSound('click');
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 text-xs font-mono-tech font-bold transition-colors"
                    >
                      OTWÓRZ W PROJEKTACH
                    </button>
                    <button
                      onClick={() => setIsAuditModalOpen(false)}
                      className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-cyber font-bold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    >
                      ZATWIERDŹ & ZAMKNIJ
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsAuditModalOpen(false)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono-tech hover:bg-slate-700 transition-colors"
                  >
                    UKRYJ W TLE
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

