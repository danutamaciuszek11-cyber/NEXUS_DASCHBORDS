import React, { useState, useEffect } from 'react';
import ReactMarkdown from '../shims/react-markdown';
import { useNexus } from '../context/NexusContext';
import {
  semanticMemoryEngine,
  DEFAULT_SEMANTIC_CLUSTERS
} from '../lib/semanticMemoryEngine';
import { MemoryDocument, SemanticCluster, SemanticMemoryMatch, MemoryCacheTelemetry } from '../types';
import {
  Database,
  Search,
  Zap,
  Layers,
  Activity,
  Cpu,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ExternalLink,
  BookOpen,
  Sliders,
  Shield,
  Clock,
  ArrowRight,
  Flame,
  Terminal,
  FileText,
  X
} from 'lucide-react';

interface SemanticMemoryDrawerProps {
  onClose?: () => void;
  onSelectDocForChat?: (doc: MemoryDocument, snippet?: string) => void;
  compact?: boolean;
}

export const SemanticMemoryDrawer: React.FC<SemanticMemoryDrawerProps> = ({
  onClose,
  onSelectDocForChat,
  compact = false
}) => {
  const { memoryDocs, playCyberSound, triggerHaptic, language } = useNexus();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClusterId, setSelectedClusterId] = useState<string>('ALL');
  const [minScore, setMinScore] = useState<number>(60);
  const [searchResults, setSearchResults] = useState<SemanticMemoryMatch[]>([]);
  const [telemetry, setTelemetry] = useState<MemoryCacheTelemetry>(semanticMemoryEngine.getTelemetry());
  const [isSearching, setIsSearching] = useState(false);
  const [activePreviewDoc, setActivePreviewDoc] = useState<MemoryDocument | null>(memoryDocs[0] || null);
  const [benchmarkData, setBenchmarkData] = useState<any>(null);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [activeTab, setActiveTab] = useState<'RADAR' | 'SEARCH' | 'BENCHMARK'>('RADAR');

  const clustersWithDocs = semanticMemoryEngine.getClusters(memoryDocs);

  const runSearch = async (q: string, clusterFilter: string = selectedClusterId, scoreThreshold: number = minScore) => {
    setIsSearching(true);
    try {
      const res = await semanticMemoryEngine.query(q, memoryDocs, {
        clusterFilter,
        minScore: scoreThreshold,
        limit: 8
      });
      setSearchResults(res.results);
      setTelemetry(res.telemetry);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    runSearch(searchQuery, selectedClusterId, minScore);
  }, [searchQuery, selectedClusterId, minScore, memoryDocs]);

  const handlePreWarm = () => {
    playCyberSound('synapse');
    triggerHaptic();
    const updated = semanticMemoryEngine.preWarm(memoryDocs);
    setTelemetry({ ...updated });
    runSearch(searchQuery || 'bella', selectedClusterId, minScore);
  };

  const handleRunBenchmark = async () => {
    setIsBenchmarking(true);
    playCyberSound('beep');
    triggerHaptic();
    try {
      const results = await semanticMemoryEngine.runBenchmark(memoryDocs);
      setBenchmarkData(results);
      setTelemetry(semanticMemoryEngine.getTelemetry());
      playCyberSound('success');
    } finally {
      setIsBenchmarking(false);
    }
  };

  return (
    <div className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#080b12] border border-cyan-500/30 shadow-[0_0_45px_rgba(0,240,255,0.18)] space-y-6 ${compact ? 'max-w-xl' : 'w-full'}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-950/80 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <Database className="w-6 h-6 text-cyan-400 animate-pulse" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#00ff9d]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-cyber font-bold text-lg sm:text-xl text-white tracking-wide">
                NEXUS MEMORY SEMANTIC CLUSTERING & CACHE
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>L1 HOT RAM • {telemetry.avgRetrievalLatencyMs}ms</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
              {language === 'PL'
                ? 'Wielowarstwowy indeks wektorowy i pamięć podręczna dokumentów dla czatu State Bella'
                : 'Multi-tiered vector index & fast memory caching layer for State Bella live conversations'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-[#0d131f] p-1 rounded-xl border border-cyan-500/20 font-mono-tech text-xs">
            <button
              onClick={() => {
                setActiveTab('RADAR');
                playCyberSound('click');
              }}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'RADAR'
                  ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Klastry ({DEFAULT_SEMANTIC_CLUSTERS.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('SEARCH');
                playCyberSound('click');
              }}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'SEARCH'
                  ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Wyszukiwanie Live
            </button>
            <button
              onClick={() => {
                setActiveTab('BENCHMARK');
                playCyberSound('click');
              }}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'BENCHMARK'
                  ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Benchmark
            </button>
          </div>

          {onClose && (
            <button
              onClick={() => { if (typeof onClose === 'function') onClose(); }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Live Cache Telemetry Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
        <div className="p-3 rounded-xl bg-[#0b101c] border border-cyan-500/20 space-y-0.5">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono-tech">
            <span>HIT RATIO</span>
            <Flame className="w-3 h-3 text-emerald-400" />
          </div>
          <p className="text-base font-cyber font-bold text-emerald-300">{telemetry.hitRatioPercent}%</p>
        </div>

        <div className="p-3 rounded-xl bg-[#0b101c] border border-cyan-500/20 space-y-0.5">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono-tech">
            <span>L1 HOT HITS</span>
            <Zap className="w-3 h-3 text-cyan-400" />
          </div>
          <p className="text-base font-cyber font-bold text-cyan-300">{telemetry.l1HitCount}</p>
        </div>

        <div className="p-3 rounded-xl bg-[#0b101c] border border-cyan-500/20 space-y-0.5">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono-tech">
            <span>L2 CENTROID HITS</span>
            <Layers className="w-3 h-3 text-purple-400" />
          </div>
          <p className="text-base font-cyber font-bold text-purple-300">{telemetry.l2HitCount}</p>
        </div>

        <div className="p-3 rounded-xl bg-[#0b101c] border border-cyan-500/20 space-y-0.5">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono-tech">
            <span>ŚR. LATENCJA</span>
            <Clock className="w-3 h-3 text-yellow-400" />
          </div>
          <p className="text-base font-cyber font-bold text-yellow-300">{telemetry.avgRetrievalLatencyMs} ms</p>
        </div>

        <div className="p-3 rounded-xl bg-[#0b101c] border border-cyan-500/20 space-y-0.5">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono-tech">
            <span>ROZMIAR RAM</span>
            <Cpu className="w-3 h-3 text-slate-400" />
          </div>
          <p className="text-base font-cyber font-bold text-slate-200">{telemetry.memoryFootprintKb} KB</p>
        </div>

        <div className="p-2 rounded-xl bg-[#0b101c] border border-cyan-500/20 flex flex-col justify-center gap-1.5">
          <button
            onClick={handlePreWarm}
            className="w-full py-1 px-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono-tech flex items-center justify-center gap-1 transition-all"
          >
            <RefreshCw className="w-3 h-3 text-cyan-400" />
            <span>Pre-warm Cache</span>
          </button>
        </div>
      </div>

      {/* TAB 1: RADAR / CLUSTERS VIEW */}
      {activeTab === 'RADAR' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-cyber font-bold text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>MAPA KLASTRÓW SEMANTYCZNYCH ({clustersWithDocs.length})</span>
            </span>
            <span className="text-[10px] font-mono-tech text-slate-400">
              CENTRUM WEKTOROWE • AUTO-SYNCHRONIZACJA Z RFC
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clustersWithDocs.map(c => {
              const isSelected = selectedClusterId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedClusterId(isSelected ? 'ALL' : c.id);
                    playCyberSound('click');
                    triggerHaptic();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.25)]'
                      : 'bg-[#0a0f1c] border-cyan-500/15 hover:border-cyan-500/40 hover:bg-cyan-950/20'
                  }`}
                  style={{ borderLeftColor: c.colorAccent, borderLeftWidth: '4px' }}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-cyber font-bold text-sm text-white">{c.name}</h4>
                      <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-slate-900 border border-slate-700 text-slate-300">
                        {c.documents.length} DOCS
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-sans line-clamp-2">
                      {c.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {c.centroidKeywords.slice(0, 4).map((kw, i) => (
                        <span key={i} className="px-1.5 py-0.5 text-[9px] font-mono-tech rounded bg-cyan-950/70 border border-cyan-500/20 text-cyan-300">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-cyan-500/10 flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
                    <span>Śr. trafność: <strong className="text-emerald-300 font-bold">{c.avgRelevance}%</strong></span>
                    <span className="text-cyan-400 flex items-center gap-0.5">
                      Filtruj <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE SEARCH & RETRIEVAL */}
      {activeTab === 'SEARCH' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={language === 'PL' ? 'Wpisz zapytanie wektorowe (np. "zasady bella", "RFC-01", "traktat 14 krajów", "synergia")...' : 'Search memory vectors...'}
                className="w-full bg-[#0d1424] border border-cyan-500/30 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-sans"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedClusterId}
                onChange={e => setSelectedClusterId(e.target.value)}
                className="bg-[#0d1424] border border-cyan-500/30 text-xs text-cyan-300 font-mono-tech rounded-xl px-3 py-2.5 focus:outline-none"
              >
                <option value="ALL">Wszystkie klastry</option>
                {DEFAULT_SEMANTIC_CLUSTERS.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <div className="flex items-center gap-1 bg-[#0d1424] border border-cyan-500/20 px-3 py-1.5 rounded-xl font-mono-tech text-xs text-slate-300">
                <span>Min: {minScore}%</span>
                <input
                  type="range"
                  min="40"
                  max="90"
                  value={minScore}
                  onChange={e => setMinScore(Number(e.target.value))}
                  className="w-16 accent-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Results Grid & Doc Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Search Matches List (5 cols) */}
            <div className="lg:col-span-5 space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400 pb-1">
                <span>ZSYNCHRONIZOWANE DOPASOWANIA ({searchResults.length})</span>
                <span>{telemetry.avgRetrievalLatencyMs}ms latency</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="p-6 rounded-xl bg-[#090d16] border border-cyan-500/15 text-center text-slate-400 text-xs font-mono-tech">
                  Brak wyników powyżej progu {minScore}%. Zmień zapytanie lub zmniejsz próg dopasowania.
                </div>
              ) : (
                searchResults.map((match, idx) => {
                  const isSelected = activePreviewDoc?.id === match.doc.id;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setActivePreviewDoc(match.doc);
                        playCyberSound('click');
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'bg-[#090d16] border-cyan-500/15 hover:border-cyan-500/40 hover:bg-cyan-950/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-cyber font-bold text-xs text-white line-clamp-1">{match.doc.title}</span>
                        <span className="px-1.5 py-0.2 text-[9px] font-mono-tech rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {match.similarityScore}%
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 font-mono-tech line-clamp-2">
                        {match.relevanceSnippet}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-cyan-500/10 text-[10px] font-mono-tech">
                        <span className="text-cyan-400 truncate max-w-[140px]">
                          {match.cluster.name}
                        </span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5" />
                          {match.cacheTier} ({match.retrievalLatencyMs}ms)
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Document Preview & Citation Action (7 cols) */}
            <div className="lg:col-span-7">
              {activePreviewDoc ? (
                <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-cyan-500/25 space-y-3 h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3 pb-2 border-b border-cyan-500/15">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {activePreviewDoc.category}
                          </span>
                          <span className="text-[10px] font-mono-tech text-slate-400">
                            v{activePreviewDoc.version} • {activePreviewDoc.lastUpdated}
                          </span>
                        </div>
                        <h4 className="font-cyber font-bold text-base text-white mt-1">
                          {activePreviewDoc.title}
                        </h4>
                      </div>

                      {onSelectDocForChat && (
                        <button
                          onClick={() => {
                            if (typeof onSelectDocForChat === 'function') {
                              onSelectDocForChat(activePreviewDoc, activePreviewDoc.summary);
                            }
                            playCyberSound('node');
                            triggerHaptic();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-cyber font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Zacytuj w Czacie</span>
                        </button>
                      )}
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#060810] border border-cyan-500/10 text-xs text-slate-300 font-sans">
                      <strong className="text-cyan-300 font-mono-tech">STRESZCZENIE: </strong>
                      {activePreviewDoc.summary}
                    </div>

                    <div className="p-3 rounded-xl bg-[#060810] border border-cyan-500/15 max-h-[220px] overflow-y-auto text-xs text-slate-300 font-sans markdown-body prose prose-invert prose-xs">
                      <ReactMarkdown>{activePreviewDoc.content}</ReactMarkdown>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-cyan-500/15 flex flex-wrap gap-1.5">
                    {activePreviewDoc.tags.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-cyan-950/70 border border-cyan-500/20 text-cyan-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-8 rounded-2xl bg-[#0a0f1d] border border-cyan-500/15 text-slate-400 font-mono-tech text-xs">
                  Wybierz dokument po lewej stronie, aby wyświetlić podgląd.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BENCHMARK & STRESS TEST */}
      {activeTab === 'BENCHMARK' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#0b101c] border border-cyan-500/20 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/15">
              <div>
                <h4 className="font-cyber font-bold text-sm text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>SYNAPSE MEMORY LATENCY & THROUGHPUT BENCHMARK</span>
                </h4>
                <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
                  Symulacja 40 wielowątkowych zapytań wektorowych przez L1 Hot RAM oraz L2 Centroid Index
                </p>
              </div>

              <button
                onClick={handleRunBenchmark}
                disabled={isBenchmarking}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 ${isBenchmarking ? 'animate-spin' : ''}`} />
                <span>{isBenchmarking ? 'Uruchamianie benchmarku...' : 'Uruchom Test Wektorowy'}</span>
              </button>
            </div>

            {benchmarkData && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-tech text-xs">
                  <div className="p-3 rounded-xl bg-[#060810] border border-cyan-500/20 space-y-1">
                    <span className="text-[10px] text-slate-400">P50 Latency (Mediana)</span>
                    <p className="text-base font-bold text-cyan-300">{benchmarkData.p50LatencyMs} ms</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#060810] border border-cyan-500/20 space-y-1">
                    <span className="text-[10px] text-slate-400">P95 Latency</span>
                    <p className="text-base font-bold text-emerald-300">{benchmarkData.p95LatencyMs} ms</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#060810] border border-cyan-500/20 space-y-1">
                    <span className="text-[10px] text-slate-400">P99 Latency (Tail)</span>
                    <p className="text-base font-bold text-purple-300">{benchmarkData.p99LatencyMs} ms</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#060810] border border-cyan-500/20 space-y-1">
                    <span className="text-[10px] text-slate-400">Throughput QPS</span>
                    <p className="text-base font-bold text-yellow-300">{benchmarkData.throughputQueriesSec} req/sec</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#05070d] border border-cyan-500/20 font-mono-tech text-[11px] space-y-1.5">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Terminal className="w-3 h-3" />
                    <span>LOG PRÓBEK ZAPYTANIA BENCHMARKU:</span>
                  </span>
                  {benchmarkData.samples.map((s: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-slate-300 text-xs">
                      <span className="truncate max-w-[280px]">&gt; &quot;{s.query}&quot;</span>
                      <span className="text-emerald-400 font-bold">{s.latencyMs}ms ({s.cacheTier})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
