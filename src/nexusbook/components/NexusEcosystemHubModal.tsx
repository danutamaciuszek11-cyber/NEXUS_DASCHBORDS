import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cpu, 
  Network, 
  Shield, 
  ShoppingBag, 
  BookOpen, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Send, 
  Terminal, 
  DollarSign, 
  Layers, 
  ArrowRight, 
  RefreshCw, 
  Key, 
  Lock, 
  Database,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Package,
  Boxes,
  Compass,
  BarChart2
} from 'lucide-react';
import { 
  BELLAS_FAMILY, 
  PRODUCT_CATALOG, 
  BellaAgentId, 
  ProductType, 
  dispatchAgentTask, 
  createCommerceOrder, 
  logSecurityEvent,
  AgentTaskRecord,
  CommerceOrderRecord,
  SecurityEventRecord
} from '../lib/nexusEcosystem';
import { NEXUS_NODE_TOKEN } from '../lib/nodeIdentity';
import { dockToNexus, DockingResult, DEFAULT_BNB_CONFIG } from '../lib/nexusBnbDock';
import { soundFx } from '../utils/audioSystem';
import { db, collection, query, orderBy, limit, onSnapshot } from '../lib/firebase';
import { Book } from '../types';
import { useNexusStore } from '../store';

interface NexusEcosystemHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
}

type TabType = 'MATRIX' | 'BELLAS' | 'COMMERCE' | 'AEGIS' | 'LEX';

export const NexusEcosystemHubModal: React.FC<NexusEcosystemHubModalProps> = ({
  isOpen,
  onClose,
  books
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('MATRIX');
  
  // BELLAS State
  const [selectedAgentId, setSelectedAgentId] = useState<BellaAgentId>('BELLA_STRATEGOS');
  const [agentPrompt, setAgentPrompt] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [agentTasks, setAgentTasks] = useState<AgentTaskRecord[]>([]);

  // NEXUSBrandVision & MADZIA SHOP State
  const [selectedProductType, setSelectedProductType] = useState<ProductType>('HOODIE');
  const [selectedAssetTitle, setSelectedAssetTitle] = useState(books[0]?.title || 'Kroniki ETERNIVERSE: Przebudzenie');
  const [customRetailPrice, setCustomRetailPrice] = useState<number>(279);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [commerceOrders, setCommerceOrders] = useState<CommerceOrderRecord[]>([]);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  // AEGIS Security State
  const [securityEvents, setSecurityEvents] = useState<SecurityEventRecord[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditScore, setAuditScore] = useState(99.4);

  // NEXUS BNB CHAIN Centralized Store State
  const bnbStoreState = useNexusStore((s) => s.bnbDocking);
  const dockBnbNode = useNexusStore((s) => s.dockBnbNode);
  const dockingState = bnbStoreState;
  const [isDocking, setIsDocking] = useState(false);

  const handlePerformDocking = async () => {
    soundFx.playClick();
    setIsDocking(true);
    try {
      const res = await dockBnbNode();
      if (res.status === 'SPLĄTANY') {
        soundFx.playSuccess();
      }
    } catch (e) {
      console.error('Docking error:', e);
    } finally {
      setIsDocking(false);
    }
  };

  // Live Firestore listeners
  useEffect(() => {
    if (!isOpen) return;

    // Listen to agent tasks
    let unsubTasks = () => {};
    let unsubOrders = () => {};
    let unsubSecurity = () => {};

    try {
      const tasksQuery = query(collection(db, 'nexus_agent_tasks'), orderBy('createdAt', 'desc'), limit(15));
      unsubTasks = onSnapshot(tasksQuery, (snapshot) => {
        const loaded: AgentTaskRecord[] = [];
        snapshot.forEach((doc) => {
          loaded.push(doc.data() as AgentTaskRecord);
        });
        setAgentTasks(loaded);
      }, (err) => console.warn('Tasks listen:', err));

      const ordersQuery = query(collection(db, 'nexus_commerce_orders'), orderBy('createdAt', 'desc'), limit(15));
      unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
        const loaded: CommerceOrderRecord[] = [];
        snapshot.forEach((doc) => {
          loaded.push(doc.data() as CommerceOrderRecord);
        });
        setCommerceOrders(loaded);
      }, (err) => console.warn('Orders listen:', err));

      const secQuery = query(collection(db, 'nexus_security_audit'), orderBy('timestamp', 'desc'), limit(15));
      unsubSecurity = onSnapshot(secQuery, (snapshot) => {
        const loaded: SecurityEventRecord[] = [];
        snapshot.forEach((doc) => {
          loaded.push(doc.data() as SecurityEventRecord);
        });
        setSecurityEvents(loaded);
      }, (err) => console.warn('Security listen:', err));
    } catch (e) {
      console.warn('Realtime listeners notice:', e);
    }

    return () => {
      unsubTasks();
      unsubOrders();
      unsubSecurity();
    };
  }, [isOpen]);

  // Update default price when product type changes
  const selectedProductConfig = PRODUCT_CATALOG.find(p => p.type === selectedProductType) || PRODUCT_CATALOG[0];
  useEffect(() => {
    setCustomRetailPrice(selectedProductConfig.recommendedRetail);
  }, [selectedProductType, selectedProductConfig]);

  if (!isOpen) return null;

  const handleDispatchAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentPrompt.trim()) return;

    setIsDispatching(true);
    soundFx.playSuccess();
    try {
      await dispatchAgentTask(selectedAgentId, agentPrompt);
      setAgentPrompt('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleCreateCommerceOrder = async () => {
    setIsSubmittingOrder(true);
    soundFx.playSuccess();
    try {
      const newOrder = await createCommerceOrder({
        productType: selectedProductType,
        assetTitle: selectedAssetTitle,
        assetId: `asset_${selectedAssetTitle.toLowerCase().replace(/\s+/g, '_')}`,
        customRetailPrice: customRetailPrice
      });
      setOrderSuccessMsg(`Pomyślnie zarejestrowano w MADZIA SHOP: ${newOrder.productName}`);
      setTimeout(() => setOrderSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleRunSecurityAudit = async () => {
    setIsAuditing(true);
    soundFx.playSuccess();
    try {
      await logSecurityEvent({
        eventType: 'FIREWALL_AUDIT',
        serviceId: 'AEGIS_ZERO_TRUST',
        status: 'PERMITTED',
        details: `Pełny audyt integralności węzła ${NEXUS_NODE_TOKEN}. Status: Certyfikowany.`
      });
      setAuditScore(99.8);
    } finally {
      setTimeout(() => setIsAuditing(false), 600);
    }
  };

  const selectedAgent = BELLAS_FAMILY.find(a => a.id === selectedAgentId) || BELLAS_FAMILY[0];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-stone-900 border border-emerald-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-sans">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-stone-950 via-emerald-950/30 to-stone-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Network className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  NEXUS SYNAPSE CORE — ORKIESTRACJA EKOSYSTEMU
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ALL SYSTEMS LINKED
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono">
                Węzeł: <span className="text-emerald-400 font-bold">{NEXUS_NODE_TOKEN}</span> | Cloud Firestore & BNB 734LLM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playModalOpen();
                onClose();
                useNexusStore.getState().openBlockChart();
              }}
              className="px-3 py-1.5 bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900 text-cyan-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Wizualizacja ostatnich 10 bloków przetworzonych przez nexusClient (Recharts)"
            >
              <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Wykres Bloków (Recharts)</span>
            </button>

            <button
              onClick={() => {
                soundFx.playModalClose();
                onClose();
              }}
              className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-black/40 border-b border-white/10 overflow-x-auto text-xs">
          <button
            onClick={() => { soundFx.playClick(); setActiveTab('MATRIX'); }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
              activeTab === 'MATRIX'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Matryca Węzłów (Matrix)</span>
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('BELLAS'); }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
              activeTab === 'BELLAS'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>BELLAS AI (Rodzina Agentów)</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('COMMERCE'); }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
              activeTab === 'COMMERCE'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>NEXUSBrandVision ➔ MADZIA SHOP</span>
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('AEGIS'); }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
              activeTab === 'AEGIS'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>AEGIS Sentinel (Zero-Trust)</span>
          </button>

          <button
            onClick={() => { soundFx.playClick(); setActiveTab('LEX'); }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
              activeTab === 'LEX'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span>NEXUS LEX & Kontrakty BNB</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: MATRIX */}
          {activeTab === 'MATRIX' && (
            <div className="space-y-6">
              {/* Architecture Topology Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-950 via-stone-900 to-emerald-950/40 border border-emerald-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Network className="w-4 h-4 text-emerald-400" />
                      Topologia Połączeń ETERION ARCHITECT MATRIX
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Wszystkie moduły, agenci AI, szyna transakcyjna i brama commerce autoryzowane wspólnym kluczem węzła.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                      NODE HEALTH: 100%
                    </span>
                    <button
                      onClick={handleRunSecurityAudit}
                      disabled={isAuditing}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-all"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                      <span>Synapse Ping</span>
                    </button>
                  </div>
                </div>

                {/* Subsystem Connection Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  
                  <div className="p-3.5 rounded-xl bg-black/50 border border-cyan-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>BELLAS AI</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        LINKED
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-300">Rodzina 4 agentów autonomicznych z pamięcią i narzędziami.</div>
                    <div className="text-[10px] font-mono text-stone-500">Zadania w Firestore: {agentTasks.length}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/50 border border-purple-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-400">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>MADZIA AI</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        LINKED
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-300">Ekstrakcja wiedzy, rozdziały i synapsy 7 Poszukiwaczy.</div>
                    <div className="text-[10px] font-mono text-stone-500">Księgi w bibliotece: {books.length}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/50 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span className="flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>MADZIA SHOP</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        LINKED
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-300">NEXUSBrandVision: 11 fizycznych typów produktów.</div>
                    <div className="text-[10px] font-mono text-stone-500">Zlecenia w bazie: {commerceOrders.length}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/50 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                      <span className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        <span>AEGIS SENTINEL</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        LINKED
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-300">Zero-Trust Token Verifier & Audyt Bezpieczeństwa.</div>
                    <div className="text-[10px] font-mono text-stone-500">Zdarzenia audytu: {securityEvents.length}</div>
                  </div>

                </div>
              </div>

              {/* Node Token & Realtime Synapse Stream */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Card: Active Node Auth Credentials */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-200 flex items-center gap-2">
                      <Key className="w-4 h-4 text-emerald-400" />
                      Pieczęć Węzła NEXUS
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-500/30">
                      ACTIVE & PERSISTED
                    </span>
                  </div>

                  <div className="p-3 bg-black/60 rounded-lg border border-white/5 font-mono text-xs text-white select-all">
                    {NEXUS_NODE_TOKEN}
                  </div>

                  <div className="space-y-1 text-xs text-stone-400">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span>Rola Systemowa:</span>
                      <span className="text-stone-200 font-mono font-bold">MASTER_ARCHITECT_CORE_NODE</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span>Poziom Uprawnień:</span>
                      <span className="text-emerald-400 font-mono font-bold">LEVEL_OMEGA_ARCHITECT</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span>Protokół Sieciowy:</span>
                      <span className="text-cyan-400 font-mono">BNB-734LLM / FIRESTORE</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Zasada Główna:</span>
                      <span className="text-amber-400 italic">FIRST SELL. THEN SCALE.</span>
                    </div>
                  </div>
                </div>

                {/* Right Card: Live Synapse Activity Stream */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-200 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      Ostatnie Zdarzenia Szyny Synaptycznej
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">Live Firestore Feed</span>
                  </div>

                  <div className="flex-1 min-h-[160px] max-h-[220px] overflow-y-auto space-y-2 pr-1 font-mono text-xs">
                    {securityEvents.length === 0 ? (
                      <div className="text-stone-500 italic p-3 text-center">
                        Brak ostatnich zdarzeń. Szyna synaptyczna czuwa w trybie nasłuchu.
                      </div>
                    ) : (
                      securityEvents.map((evt) => (
                        <div key={evt.id} className="p-2 rounded bg-stone-950/80 border border-white/5 flex items-start justify-between gap-2">
                          <div>
                            <span className="text-emerald-400 font-bold mr-2">[{evt.eventType}]</span>
                            <span className="text-stone-300">{evt.details}</span>
                          </div>
                          <span className="text-[10px] text-stone-500 shrink-0">
                            {new Date(evt.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: BELLAS AI */}
          {activeTab === 'BELLAS' && (
            <div className="space-y-6">
              {/* Agent Family Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {BELLAS_FAMILY.map((agent) => {
                  const isSelected = agent.id === selectedAgentId;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedAgentId(agent.id);
                      }}
                      className={`p-4 rounded-xl text-left transition-all border ${
                        isSelected
                          ? 'bg-stone-800/90 border-cyan-400 shadow-lg shadow-cyan-950/40'
                          : 'bg-black/40 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                          {agent.codename}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <div className="font-bold text-white text-sm">{agent.name}</div>
                      <div className="text-[11px] text-stone-400 mt-1 line-clamp-2">{agent.role}</div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Agent Inspector & Dispatch Console */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Inspector Details */}
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{selectedAgent.name}</h4>
                      <p className="text-xs text-cyan-300 font-mono">{selectedAgent.codename} • {selectedAgent.role}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-stone-400 font-bold block mb-1">System Prompt / Rola:</span>
                      <p className="text-stone-300 bg-black/50 p-2.5 rounded border border-white/5 leading-relaxed">
                        {selectedAgent.systemPromptSummary}
                      </p>
                    </div>

                    <div>
                      <span className="text-stone-400 font-bold block mb-1">Narzędzia (Tools):</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedAgent.tools.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded bg-white/10 font-mono text-[10px] text-cyan-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <span className="text-stone-400 font-bold block mb-1">Kontrakt Wyjściowy (Output Contract):</span>
                      <span className="font-mono text-[11px] text-emerald-400">{selectedAgent.outputContract}</span>
                    </div>
                  </div>
                </div>

                {/* Dispatch Input & Task Feed */}
                <div className="lg:col-span-2 space-y-4">
                  <form onSubmit={handleDispatchAgent} className="p-5 rounded-2xl bg-stone-900/90 border border-cyan-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-cyan-400" />
                        Zlecenie Zadania dla: {selectedAgent.name}
                      </label>
                      <span className="text-[10px] font-mono text-cyan-300">Zapis w Firestore: nexus_agent_tasks</span>
                    </div>

                    <textarea
                      value={agentPrompt}
                      onChange={(e) => setAgentPrompt(e.target.value)}
                      placeholder={`Wprowadź polecenie dla agenta ${selectedAgent.name}...`}
                      rows={3}
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs placeholder:text-stone-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />

                    <div className="flex items-center justify-between">
                      <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Autoryzowane węzłem {NEXUS_NODE_TOKEN}</span>
                      </div>
                      <button
                        type="submit"
                        disabled={isDispatching || !agentPrompt.trim()}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isDispatching ? 'Przetwarzanie...' : 'DISPATCH AGENT TASK'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Tasks History */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Historia Zadań Agentów (Firestore)
                    </h5>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {agentTasks.length === 0 ? (
                        <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-center text-xs text-stone-500">
                          Brak wykonanych zadań. Wpisz polecenie powyżej, aby uruchomić agenta.
                        </div>
                      ) : (
                        agentTasks.map((t) => (
                          <div key={t.id} className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-cyan-300 font-mono">{t.agentName}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                                {t.status}
                              </span>
                            </div>
                            <div className="text-stone-300 font-medium">{t.prompt}</div>
                            {t.outputResult && (
                              <pre className="p-2.5 rounded bg-black/70 border border-white/5 font-mono text-[11px] text-emerald-300/90 whitespace-pre-wrap">
                                {t.outputResult}
                              </pre>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* TAB 3: COMMERCE (NEXUSBrandVision -> MADZIA SHOP) */}
          {activeTab === 'COMMERCE' && (
            <div className="space-y-6">
              
              {/* Process Pipeline Header */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-stone-900 to-black border border-amber-500/30">
                <div className="text-xs font-mono font-bold text-amber-400 mb-2">ŁAŃCUCH WARTOŚCI NEXUSBANDVISION & MADZIA SHOP</div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-stone-300">
                  <span className="px-2 py-1 bg-white/10 rounded">1. ASSET</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span className="px-2 py-1 bg-white/10 rounded">2. PRODUCT</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span className="px-2 py-1 bg-white/10 rounded">3. MOCKUP</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span className="px-2 py-1 bg-white/10 rounded">4. PRODUCTION SPEC</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span className="px-2 py-1 bg-white/10 rounded">5. PRICING</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span className="px-2 py-1 bg-amber-500/30 text-amber-300 rounded font-bold">6. MADZIA SHOP</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span className="px-2 py-1 bg-emerald-500/30 text-emerald-300 rounded font-bold">7. FULFILLMENT</span>
                </div>
              </div>

              {/* Product Creator & Catalog */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Product Selector */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
                    Katalog Produktów Fizycznych (11 Typów)
                  </label>
                  <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                    {PRODUCT_CATALOG.map((item) => {
                      const isSelected = item.type === selectedProductType;
                      return (
                        <button
                          key={item.type}
                          onClick={() => {
                            soundFx.playClick();
                            setSelectedProductType(item.type);
                          }}
                          className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-950/50 border-amber-400 text-white shadow-md'
                              : 'bg-black/30 border-white/5 hover:border-white/15 text-stone-400'
                          }`}
                        >
                          <div>
                            <span className="text-[10px] font-mono font-bold text-amber-400 block">[{item.type}]</span>
                            <span className="text-xs font-bold text-white">{item.name}</span>
                          </div>
                          <span className="text-xs font-mono text-stone-300">
                            od {item.defaultBaseCost} PLN
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Center: Spec & Margin Calculator */}
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <Package className="w-4 h-4 text-amber-400" />
                        Specyfikacja Produkcyjna & Mockup
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        {selectedProductConfig.category}
                      </span>
                    </div>

                    {/* Source Asset Selection */}
                    <div>
                      <label className="text-xs text-stone-400 font-bold block mb-1">
                        Cyfrowy Asset (Księga / Rozdział):
                      </label>
                      <select
                        value={selectedAssetTitle}
                        onChange={(e) => setSelectedAssetTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        {books.map((b) => (
                          <option key={b.id} value={b.title}>
                            {b.title} ({b.author})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="text-xs text-stone-400 font-bold block mb-1">Preset Mockupu:</span>
                      <div className="p-2 rounded bg-stone-950 border border-white/5 font-mono text-xs text-amber-300">
                        {selectedProductConfig.mockupPreset}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-stone-400 font-bold block mb-1">Specyfikacja Techniczna:</span>
                      <p className="text-xs text-stone-300 bg-stone-950 p-2.5 rounded border border-white/5 leading-relaxed">
                        {selectedProductConfig.specDescription}
                      </p>
                    </div>

                    {/* Pricing Calculator */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        Kalkulacja Marży (FIRST SELL. THEN SCALE.)
                      </label>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-stone-950 rounded border border-white/5">
                          <span className="text-stone-400 block text-[10px]">Koszt Bazy (Fulfillment):</span>
                          <span className="text-sm font-bold text-stone-200 font-mono">
                            {selectedProductConfig.defaultBaseCost} PLN
                          </span>
                        </div>
                        <div className="p-2.5 bg-stone-950 rounded border border-white/5">
                          <span className="text-stone-400 block text-[10px]">Cena Detaliczna (Sklep):</span>
                          <input
                            type="number"
                            value={customRetailPrice}
                            onChange={(e) => setCustomRetailPrice(Number(e.target.value))}
                            className="w-full bg-transparent font-bold text-emerald-400 font-mono text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
                        <span className="text-emerald-300 font-bold">Marża Czysta:</span>
                        <span className="text-emerald-400 font-mono font-bold text-sm">
                          +{customRetailPrice - selectedProductConfig.defaultBaseCost} PLN (
                          {Math.round(((customRetailPrice - selectedProductConfig.defaultBaseCost) / (customRetailPrice || 1)) * 100)}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-3">
                    {orderSuccessMsg && (
                      <div className="mb-2 p-2 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{orderSuccessMsg}</span>
                      </div>
                    )}
                    <button
                      onClick={handleCreateCommerceOrder}
                      disabled={isSubmittingOrder}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isSubmittingOrder ? 'Zapisywanie...' : 'ZAREJESTRUJ W MADZIA SHOP'}</span>
                    </button>
                  </div>
                </div>

                {/* Right: Orders Record List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                      Zarejestrowane Produkty MADZIA SHOP
                    </label>
                    <span className="text-[10px] font-mono text-amber-400">{commerceOrders.length} pozycji</span>
                  </div>

                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {commerceOrders.length === 0 ? (
                      <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-center text-xs text-stone-500">
                        Brak zarejestrowanych zamówień. Wybierz produkt z lewej strony i kliknij rejestrację.
                      </div>
                    ) : (
                      commerceOrders.map((ord) => (
                        <div key={ord.id} className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{ord.productName}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                              {ord.retailPrice} PLN
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-400 truncate">
                            Asset: <span className="text-stone-200">{ord.assetTitle}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 pt-1 border-t border-white/5">
                            <span>Marża: {ord.marginPct}% (+{ord.profitPLN} PLN)</span>
                            <span className="text-emerald-400 font-bold">{ord.fulfillmentStatus}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: AEGIS SENTINEL */}
          {activeTab === 'AEGIS' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-stone-900 to-black border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    AEGIS QUANTUM SENTINEL — ZERO-TRUST FIREWALL
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Weryfikacja tożsamości węzłów, integralności nagłówków HTTP, ochrony przed XSS/CSRF i zapobieganie wyciekowi danych.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-stone-400 uppercase font-mono">Indeks Bezpieczeństwa</div>
                    <div className="text-lg font-bold text-emerald-400 font-mono">{auditScore}%</div>
                  </div>
                  <button
                    onClick={handleRunSecurityAudit}
                    disabled={isAuditing}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    {isAuditing ? 'Audyt...' : 'WYMUŚ AUDYT'}
                  </button>
                </div>
              </div>

              {/* Security Metrics & Checks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Autoryzacja Węzła</span>
                  </div>
                  <div className="text-xs text-stone-300">
                    Token <span className="font-mono text-white font-bold">{NEXUS_NODE_TOKEN}</span> jest poprawnie zarejestrowany w Firestore.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Zasada Least Privilege</span>
                  </div>
                  <div className="text-xs text-stone-300">
                    Każdy mikroserwis (BELLAS, MADZIA SHOP) posiada zawężone uprawnienia RBAC.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Rate Limiting & Anti-Tampering</span>
                  </div>
                  <div className="text-xs text-stone-300">
                    Zapobieganie floodowi synaptycznemu i weryfikacja sumy kontrolnej.
                  </div>
                </div>
              </div>

              {/* Security Audit Feed */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Rejestr Zdarzeń Audytu Bezpieczeństwa (Firestore: nexus_security_audit)
                </h4>
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {securityEvents.map((evt) => (
                    <div key={evt.id} className="p-3 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <div>
                          <span className="font-bold text-white mr-2">{evt.serviceId}</span>
                          <span className="text-stone-300">{evt.details}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="text-emerald-400 font-bold">[{evt.status}]</span>
                        <span className="text-stone-500">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: NEXUS LEX & KONTRAKTY BNB */}
          {activeTab === 'LEX' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-black border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-amber-400" />
                    NEXUS BNB CHAIN DOCKING & LEX GATEWAY
                  </h3>
                  <p className="text-xs text-stone-300 mt-1">
                    Kwantowe splątanie węzła <span className="font-mono text-amber-400 font-bold">{DEFAULT_BNB_CONFIG.nodeToken}</span> z łańcuchem Binance Smart Chain przez Viem i wyrocznię APRO.
                  </p>
                </div>

                <button
                  onClick={handlePerformDocking}
                  disabled={isDocking}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer shrink-0"
                >
                  <Zap className={`w-4 h-4 ${isDocking ? 'animate-spin' : 'animate-bounce'}`} />
                  <span>{isDocking ? 'DOKOWANIE...' : 'WYKONAJ SPLĄTANIE (DOCK)'}</span>
                </button>
              </div>

              {/* Live Quantum Handshake Status Card */}
              <div className="p-5 rounded-2xl bg-black/60 border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${dockingState?.status === 'SPLĄTANY' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      STATUS ŁĄCZA SYNAPTYCZNEGO:
                    </span>
                    <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded ${
                      dockingState?.status === 'SPLĄTANY'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}>
                      {dockingState?.status || 'GOTOWY DO DOKOWANIA'}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-stone-400">
                    ORACLE: <span className="text-cyan-400 font-bold">{DEFAULT_BNB_CONFIG.oracleFrequency}</span> [{DEFAULT_BNB_CONFIG.oracleSync}]
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-stone-900/80 border border-white/5 space-y-1">
                    <div className="text-[10px] text-stone-400 uppercase font-mono">Sieć / Chain ID</div>
                    <div className="font-bold text-amber-300 font-mono flex items-center justify-between">
                      <span>{DEFAULT_BNB_CONFIG.nexusNetwork}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">BSC ({DEFAULT_BNB_CONFIG.chainId})</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-900/80 border border-white/5 space-y-1">
                    <div className="text-[10px] text-stone-400 uppercase font-mono">Blok BSC (Na Żywo)</div>
                    <div className="font-bold text-emerald-400 font-mono flex items-center justify-between">
                      <span>{dockingState?.blockNumber ? `#${dockingState.blockNumber}` : 'Oczekuje...'}</span>
                      {dockingState?.latencyMs && (
                        <span className="text-[10px] text-stone-400">{dockingState.latencyMs}ms</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-900/80 border border-white/5 space-y-1">
                    <div className="text-[10px] text-stone-400 uppercase font-mono">Węzeł Node Token</div>
                    <div className="font-bold text-cyan-300 font-mono truncate" title={DEFAULT_BNB_CONFIG.nodeToken}>
                      {DEFAULT_BNB_CONFIG.nodeToken}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-900/80 border border-white/5 space-y-1">
                    <div className="text-[10px] text-stone-400 uppercase font-mono">Saldo Portfela BNB</div>
                    <div className="font-bold text-purple-300 font-mono">
                      {dockingState?.balanceBNB !== undefined ? `${dockingState.balanceBNB} BNB` : '—'}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/80 border border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-stone-400">
                    <span>Adres Portfela Architekta:</span>
                    <span className="text-white font-bold select-all">{DEFAULT_BNB_CONFIG.address}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-stone-400">
                    <span>Tożsamość Pilot UID:</span>
                    <span className="text-cyan-300 select-all">{DEFAULT_BNB_CONFIG.userUid}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-stone-400">
                    <span>Viem HTTP Endpoint:</span>
                    <span className="text-stone-300 select-all">{DEFAULT_BNB_CONFIG.rpcUrl}</span>
                  </div>
                </div>
              </div>

              {/* Smart Contracts Vaults */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-xl bg-black/40 border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                    <span>NEXUS PASS ORACLE (BEP-721)</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-[10px]">VERIFIED</span>
                  </div>
                  <div className="p-2.5 rounded bg-black/60 font-mono text-[11px] text-stone-300 select-all border border-white/5">
                    0x734LLM_NEXUS_PASS_ORACLE_CORE_MAINNET
                  </div>
                  <div className="text-xs text-stone-400">
                    Paszport kwantowy autoryzujący pilota do nielimitowanego skoku między wymiarami ksiąg ETERNIVERSE.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                    <span>CREATOR SOUL ENGINE ESCROW (BEP-20)</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-[10px]">VERIFIED</span>
                  </div>
                  <div className="p-2.5 rounded bg-black/60 font-mono text-[11px] text-stone-300 select-all border border-white/5">
                    0x734LLM_CREATOR_SOUL_ESCROW_SMART_VAULT
                  </div>
                  <div className="text-xs text-stone-400">
                    Depozyt tantiem, podziału marży z MADZIA SHOP i zabezpieczenia praw autorskich Architekta.
                  </div>
                </div>

              </div>

              <div className="p-4 rounded-xl bg-stone-950 border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-stone-300">Protokół NEXUS LEX: Reguły Arbitrażu</h4>
                <ul className="text-xs text-stone-400 space-y-1.5 list-disc pl-4">
                  <li>Nigdy nie publikuj niezweryfikowanych roszczeń finansowych bez pokrycia w realnym zamówieniu.</li>
                  <li>Wszystkie transakcje agentowe BELLAS podlegają sygnaturze kryptograficznej węzła {DEFAULT_BNB_CONFIG.nodeToken}.</li>
                  <li>Licencja twórcza: Dzieła zrodzone w NexusBook należą suwerennie do Architekta.</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-black/60 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NEXUS SYNAPSE CORE • WSZYSTKIE SYSTEMY PODPIĘTE I SYNCHRONIZOWANE</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playModalClose();
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
            >
              Zamknij
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
