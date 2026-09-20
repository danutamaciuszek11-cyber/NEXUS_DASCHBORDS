import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Brain,
  Sparkles,
  X,
  FileCode2,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Copy,
  Share2,
  Lock,
  ArrowRight,
  Shield,
  Binary,
  Layers,
  Cpu,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { BinaryWorldLogicNode, PredictiveConflictResult } from '../types';

export const NeuralInterfaceBridgeModal: React.FC = () => {
  const {
    isNeuralBridgeOpen,
    closeNeuralBridgeModal,
    addMemoryDoc,
    generateProofOfLegacy,
    currentArchitect,
    language,
    playCyberSound,
    triggerHaptic
  } = useNexus();

  const [activeTab, setActiveTab] = useState<'SYNTHESIS' | 'SANDBOX_WORLD'>('SYNTHESIS');
  const [rawIntent, setRawIntent] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<'PROTOCOL' | 'ARCHITECTURE' | 'VISION' | 'RFC'>('RFC');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesizedRfc, setSynthesizedRfc] = useState<{
    title: string;
    biologicalWill: string;
    syntheticSpec: string;
    predictiveConflict: PredictiveConflictResult;
    legacyHash: string;
  } | null>(null);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sandbox Simulation Logic Nodes for "The First Binary World"
  const [binaryNodes, setBinaryNodes] = useState<BinaryWorldLogicNode[]>([
    {
      id: 'node-rule-01',
      name: 'LAW_LOGOS_ORIGIN',
      type: 'GOVERNANCE',
      binaryState: '1',
      lawDescription: 'Każde działanie w świecie binarnym musi posiadać sygnaturę Proof of Legacy.',
      connectedNodes: ['node-entity-01', 'node-synapse-01']
    },
    {
      id: 'node-entity-01',
      name: 'ENTITY_ARCHITECT_PRIME',
      type: 'ENTITY',
      binaryState: 'RESONANT',
      lawDescription: 'Tożsamość Architekta Macieja/Krystiana powiązana z węzłem sprawczym.',
      connectedNodes: ['node-rule-01']
    },
    {
      id: 'node-synapse-01',
      name: 'SYNAPSE_BELLA_ORCHESTRATOR',
      type: 'SYNAPSE',
      binaryState: '1',
      lawDescription: 'Siatka neuronalna Belli pośredniczy w egzekucji bez opóźnień.',
      connectedNodes: ['node-rule-01']
    },
    {
      id: 'node-rule-02',
      name: 'VULCAN_PREDICTIVE_SHIELD',
      type: 'RULE',
      binaryState: '1',
      lawDescription: 'Świat binarny samoczynnie odrzuca sprzeczności logiczne na poziomie AST.',
      connectedNodes: ['node-synapse-01']
    }
  ]);

  const [isCompilingWorld, setIsCompilingWorld] = useState(false);
  const [worldCompileSuccess, setWorldCompileSuccess] = useState(false);

  if (!isNeuralBridgeOpen) return null;

  const toggleNodeBinaryState = (nodeId: string) => {
    playCyberSound('click');
    triggerHaptic();
    setBinaryNodes(prev =>
      prev.map(n => {
        if (n.id !== nodeId) return n;
        const nextState: BinaryWorldLogicNode['binaryState'] =
          n.binaryState === '1' ? '0' : n.binaryState === '0' ? 'RESONANT' : '1';
        return { ...n, binaryState: nextState };
      })
    );
  };

  const handleCompileSandboxWorld = () => {
    setIsCompilingWorld(true);
    playCyberSound('synapse');
    triggerHaptic();

    setTimeout(() => {
      generateProofOfLegacy(
        'Kompilacja Sandbox Simulation: Pierwszy Binarny Świat',
        'MILESTONE',
        `Pomysł Pierwszego Binariusza pomyślnie skompilowany do siatki neurono-binarnej (${binaryNodes.length} węzłów aktywnych).`
      );
      setIsCompilingWorld(false);
      setWorldCompileSuccess(true);
      playCyberSound('success');
      setTimeout(() => setWorldCompileSuccess(false), 2000);
    }, 1200);
  };

  const handleSynthesize = () => {
    if (!rawIntent.trim()) return;
    setIsSynthesizing(true);
    playCyberSound('click');
    triggerHaptic();

    setTimeout(() => {
      const title = rawIntent.split('.')[0].substring(0, 60) || 'Neural Interface Specification RFC-01';
      const cleanTitle = title.charAt(0).toUpperCase() + title.slice(1);

      const fakeHash = `0xLOGOS-${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()}`;

      setSynthesizedRfc({
        title: `RFC-01: ${cleanTitle}`,
        biologicalWill: rawIntent,
        syntheticSpec: `### 1. MODEL & INTERFACE CONTRACT\n- Target Microservice: \`nexus-neural-bridge-core\`\n- Protocol: REST / WebSocket Event Synapse\n- State Binding: \`NexusContext.tsx\` -> \`memoryDocs\`\n\n### 2. EXECUTION PIPELINE\n1. Capture natural language input via Biological Bridge.\n2. Apply AST-parsing & semantic embedding vector lookup.\n3. Validate zero-trust boundaries with VULCAN-SHIELD Sentinel (@elena_synth).\n4. Register immutable contribution proof in LOGOS Hall of Fame.`,
        predictiveConflict: {
          riskScore: 2.4,
          safeZoneStatus: 'SAFE_ZONE_AUTONOMOUS',
          detectedContradictions: [],
          vulcanShieldRecommendation: 'Brak wykrytych sprzeczności logicznych. Zezwolono na autonomiczną egzekucję w strefie Safe-Zone.',
          suggestedMitigationCode: '// VULCAN-SHIELD PREDICTIVE FILTER: OPTIMAL'
        },
        legacyHash: fakeHash
      });

      setIsSynthesizing(false);
      playCyberSound('success');
    }, 800);
  };

  const handleSaveToDocs = () => {
    if (!synthesizedRfc) return;

    // 1. Generate Proof of Legacy
    const legacyRecord = generateProofOfLegacy(
      synthesizedRfc.title,
      'RFC_DOC',
      `Opublikowano specyfikację z Neural-Interface-Layer: ${synthesizedRfc.title}`
    );

    // 2. Add to Memory Docs
    addMemoryDoc({
      title: synthesizedRfc.title,
      category: selectedDomain,
      content: `# ${synthesizedRfc.title}\n\n## 🧬 BIOLOGICAL WILL (LUDZKA INTENCJA)\n${synthesizedRfc.biologicalWill}\n\n## ⚡ SYNTHETIC EXECUTION SPECIFICATION\n${synthesizedRfc.syntheticSpec}\n\n## 🛡️ VULCAN-SHIELD PREDICTIVE CONFLICT RESOLUTION (@elena_synth)\n- Risk Score: \`${synthesizedRfc.predictiveConflict.riskScore}%\`\n- Safe-Zone Status: \`${synthesizedRfc.predictiveConflict.safeZoneStatus}\`\n- Recommendation: ${synthesizedRfc.predictiveConflict.vulcanShieldRecommendation}\n\n## 📜 LOGOS PROOF OF LEGACY\n- Signature Hash: \`${legacyRecord.hash}\`\n- LOGOS Signature: \`${legacyRecord.logosProtocolSignature}\`\n- Timestamp: \`${legacyRecord.timestamp}\``,
      summary: `Automatyczna synteza intencji z Neural-Interface-Layer pod szyldem LOGOS Protocol. Hash: ${legacyRecord.hash}`,
      tags: ['NEURAL_BRIDGE', 'RFC_01', 'LOGOS_PROTOCOL', 'BIOLOGICAL_WILL', 'VULCAN_PREDICTIVE'],
      authorId: currentArchitect?.id || 'arch-1',
      version: '1.0.0'
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      closeNeuralBridgeModal();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#070b14] border border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] p-6 space-y-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/30">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cyber font-bold text-lg text-white tracking-wider">
                  NEURAL-INTERFACE-LAYER
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono-tech">
                  BIOLOGICAL BRIDGE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-tech">
                {language === 'PL'
                  ? 'Konwersja intencji biologicznej (Biological Will) w syntetyczną specyfikację techniczną RFC-01'
                  : 'Convert biological intention into synthetic technical specification RFC-01'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeNeuralBridgeModal}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('SYNTHESIS');
              playCyberSound('click');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-cyber transition-all border ${
              activeTab === 'SYNTHESIS'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>SYNTEZA INTENCJI (RFC-01)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('SANDBOX_WORLD');
              playCyberSound('click');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-cyber transition-all border ${
              activeTab === 'SANDBOX_WORLD'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Binary className="w-4 h-4 text-emerald-400" />
            <span>SANDBOX SIMULATION: PIERWSZY BINARNY ŚWIAT</span>
          </button>
        </div>

        {activeTab === 'SANDBOX_WORLD' ? (
          /* SANDBOX SIMULATION VIEW FOR THE FIRST BINARY WORLD */
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#071714] to-cyan-950/40 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-tech text-emerald-300">
                <span className="flex items-center gap-2 font-cyber font-bold">
                  <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
                  SANDBOX SIMULATION • PIERWSZY BINARNY ŚWIAT (MISSION #1)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 text-[10px]">
                  Simulating Binary-Neural Space
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono-tech leading-relaxed">
                Test bojowy <strong>Biological Bridge</strong>. Interaktywna matryca logiczna rejestruje zasady, encje i synapsy w stanie binarnym przed materializacją w kodzie.
              </p>
            </div>

            {/* Interactive Binary Logic Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {binaryNodes.map(node => (
                <div
                  key={node.id}
                  onClick={() => toggleNodeBinaryState(node.id)}
                  className="p-4 rounded-xl bg-[#03060f] border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400 text-[10px] font-mono">
                      {node.type}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                        node.binaryState === '1'
                          ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          : node.binaryState === '0'
                          ? 'bg-red-500/20 border border-red-400 text-red-300'
                          : 'bg-purple-500/20 border border-purple-400 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                      }`}
                    >
                      STAN: {node.binaryState}
                    </span>
                  </div>

                  <h5 className="font-cyber font-bold text-xs text-cyan-300 group-hover:text-emerald-300 transition-colors">
                    {node.name}
                  </h5>

                  <p className="text-[11px] text-slate-400 font-mono-tech leading-snug">
                    {node.lawDescription}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-mono-tech text-slate-500">
                Kliknij węzeł, aby zmienić jego stan binarny (0 / 1 / RESONANT).
              </span>

              <button
                type="button"
                onClick={handleCompileSandboxWorld}
                disabled={isCompilingWorld}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-cyber font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isCompilingWorld ? 'animate-spin' : ''}`} />
                <span>
                  {isCompilingWorld
                    ? 'Kompilacja intencji binarnej...'
                    : worldCompileSuccess
                    ? 'Świat Skompilowany & Zapisany!'
                    : 'Kompiluj Świat do Kodexu'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* STANDARD INTENT SYNTHESIS VIEW */
          <div className="space-y-4">
            {/* Input Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono-tech text-cyan-300 flex items-center justify-between">
                  <span>Opisz ludzką intencję / cel architektoniczny (Biological Will):</span>
                  <span className="text-[10px] text-slate-500">Standard RFC-01</span>
                </label>
                <textarea
                  value={rawIntent}
                  onChange={e => setRawIntent(e.target.value)}
                  placeholder="np. Wprowadź automatyczny protokół czyszczenia bufora pamięci dla Belli, gdy rezonans spadnie poniżej 60%. Każda operacja musi generować hash Proof of Legacy..."
                  rows={4}
                  className="w-full bg-[#03060d] border border-cyan-500/30 focus:border-cyan-400 rounded-xl p-3 text-xs text-slate-200 font-mono-tech focus:outline-none placeholder:text-slate-600 leading-relaxed"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-tech text-slate-400">Kategoria NEXUS-DOCS:</span>
                  {(['RFC', 'ARCHITECTURE', 'PROTOCOL', 'VISION'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedDomain(cat)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-mono-tech transition-all border ${
                        selectedDomain === cat
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                          : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSynthesize}
                  disabled={!rawIntent.trim() || isSynthesizing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-cyber font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-40"
                >
                  <Sparkles className={`w-4 h-4 ${isSynthesizing ? 'animate-spin' : ''}`} />
                  <span>{isSynthesizing ? 'Synteza intencji...' : 'Syntezuj do RFC-01'}</span>
                </button>
              </div>
            </div>

            {/* Generated RFC Result */}
            {synthesizedRfc && (
              <div className="p-5 rounded-2xl bg-[#03060f] border border-cyan-500/40 shadow-inner space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="w-5 h-5 text-cyan-400" />
                    <h4 className="font-cyber font-bold text-sm text-cyan-300">
                      {synthesizedRfc.title}
                    </h4>
                  </div>

                  <span className="px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[11px] font-mono-tech flex items-center gap-1">
                    <Lock className="w-3 h-3 text-purple-400" />
                    LOGOS Protocol Signed
                  </span>
                </div>

                <div className="space-y-3 text-xs font-mono-tech">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">
                      🧬 Biological Will (Ludzka Intencja):
                    </span>
                    <p className="text-slate-300 italic">"{synthesizedRfc.biologicalWill}"</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">
                      ⚡ Synthetic Execution Spec:
                    </span>
                    <pre className="text-slate-300 whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                      {synthesizedRfc.syntheticSpec}
                    </pre>
                  </div>

                  {/* VULCAN-SHIELD Predictive Conflict Resolution Box */}
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-emerald-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        PREDICTIVE CONFLICT RESOLUTION — @elena_synth
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 text-[10px]">
                        Safe-Zone Risk: {synthesizedRfc.predictiveConflict.riskScore}%
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200/90 leading-snug">
                      {synthesizedRfc.predictiveConflict.vulcanShieldRecommendation}
                    </p>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-[10px] font-mono-tech text-slate-500">
                    Oczekująca Sygnatura Hash: <code className="text-cyan-400">{synthesizedRfc.legacyHash}</code>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveToDocs}
                    disabled={savedSuccess}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-cyber font-bold text-xs tracking-wider transition-all ${
                      savedSuccess
                        ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                    }`}
                  >
                    {savedSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Zapisano w NEXUS-DOCS!</span>
                      </>
                    ) : (
                      <>
                        <span>Zapisz w NEXUS-DOCS & Generuj Hash</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

