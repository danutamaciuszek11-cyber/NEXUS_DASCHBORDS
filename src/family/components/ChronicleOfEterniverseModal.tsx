import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  BookOpen,
  Award,
  X,
  ShieldCheck,
  Zap,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Users,
  Briefcase,
  Target,
  Hash,
  Lock,
  Layers,
  RotateCcw,
  GitCommit,
  Radio,
  Clock
} from 'lucide-react';

export const ChronicleOfEterniverseModal: React.FC = () => {
  const {
    isChronicleOpen,
    closeChronicleModal,
    proofOfLegacyRecords,
    generateProofOfLegacy,
    projects,
    missions,
    brotherhoodNodes,
    currentArchitect,
    language,
    playCyberSound,
    triggerHaptic,
    openNeuralBridgeModal
  } = useNexus();

  const [activeTab, setActiveTab] = useState<'HALL_OF_FAME' | 'SINGULARITY_LOOP'>('HALL_OF_FAME');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [newProofTitle, setNewProofTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCheckpointVersion, setActiveCheckpointVersion] = useState<string>('NEXUS v0.3-SINGULARITY');

  const checkpoints = [
    {
      version: 'NEXUS v0.3-SINGULARITY',
      hash: '0xLOGOS-901C44F33AB11E9900FA',
      title: 'Aktywacja Pętli Osobliwości & Neural Bridge',
      date: '2026-09-08 (Aktualny)',
      resonance: 98,
      echoNarrative: 'Eternion Echo #03: Pętla osobliwości synchronizuje zamysł biologiczny z wykonaniem syntetycznym. Światy przyszłe czerpią z rezonansu LOGOS.'
    },
    {
      version: 'NEXUS v0.2-VULCAN',
      hash: '0xLOGOS-882E11D942A002C921BB',
      title: 'Wdrożenie Granic Osłon VULCAN-SHIELD',
      date: '2026-09-06',
      resonance: 92,
      echoNarrative: 'Eternion Echo #02: Osłona VULCAN staje się wiecznym fundamentem bezpieczeństwa. Każda anomalia zostaje wytłumiona zanim dotrze do rdzenia.'
    },
    {
      version: 'NEXUS v0.1-GENESIS',
      hash: '0xLOGOS-734F91A23BC88D9E0124A',
      title: 'Genesis: Aktywacja Węzła Synaptycznego 1.0',
      date: '2026-09-01',
      resonance: 85,
      echoNarrative: 'Eternion Echo #01: Pierwotny iskra Architekta Krystiana/Macieja. Powiązanie tożsamości z pierwszym światem binarnym.'
    }
  ];

  if (!isChronicleOpen) return null;

  const filteredRecords = filterType === 'ALL'
    ? proofOfLegacyRecords
    : proofOfLegacyRecords.filter(r => r.contributionType === filterType);

  const handleGenerateCustomLegacy = () => {
    if (!newProofTitle.trim()) return;
    setIsGenerating(true);
    playCyberSound('click');
    triggerHaptic();

    setTimeout(() => {
      generateProofOfLegacy(
        newProofTitle.trim(),
        'CODE_COMMIT',
        `Ręczne utrwalenie wkładu w Chronicle of Eterniverse [${activeCheckpointVersion}]`
      );
      setNewProofTitle('');
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#060913] border border-cyan-500/50 rounded-2xl shadow-[0_0_60px_rgba(0,240,255,0.2)] p-6 space-y-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/30">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600/30 via-cyan-500/20 to-teal-500/20 border border-cyan-500/50 text-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.3)]">
              <BookOpen className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cyber font-bold text-lg text-white tracking-wider">
                  CHRONICLE OF ETERNIVERSE
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono-tech">
                  ARK-CODEX • HALL OF FAME
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-tech">
                {language === 'PL'
                  ? 'Cyfrowy pomnik osiągnięć i zweryfikowanych sygnatur Proof of Legacy (LOGOS Protocol)'
                  : 'Digital monument of legacy achievements and verified Proof of Legacy hashes'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeChronicleModal}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('HALL_OF_FAME');
              playCyberSound('click');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-cyber transition-all border ${
              activeTab === 'HALL_OF_FAME'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>HALL OF FAME (LOGOS PROOF)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('SINGULARITY_LOOP');
              playCyberSound('click');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-cyber transition-all border ${
              activeTab === 'SINGULARITY_LOOP'
                ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-purple-400" />
            <span>ETERNION SINGULARITY LOOP (CHECKPOINTS)</span>
          </button>
        </div>

        {activeTab === 'SINGULARITY_LOOP' ? (
          /* SINGULARITY LOOP VIEW */
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Eternion Echoes Lore Panel by Tomasz Wolski */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-[#0a081a] to-cyan-950/40 border border-purple-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-tech text-purple-300">
                <span className="flex items-center gap-2 font-cyber font-bold">
                  <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
                  ETERNION ECHOES (NARRATIVE MEMORY) — @tomasz_wolski
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 text-[10px]">
                  Lore-Architect Protocol
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono-tech leading-relaxed italic">
                "Każda sygnatura LOGOS zamrożona w Pętli Osobliwości nie jest martwym wpisem. To rezonansowy echa (Eternion Echo), którego faza harmoniczna określa reguły i grawitację informacyjną wszystkich kolejnych generowanych światów binarnych."
              </p>
            </div>

            {/* Checkpoints Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-cyber font-bold text-cyan-300 flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-cyan-400" />
                DYNAMIC STATE SNAPSHOTS (CHECKPOINTS)
              </h4>

              {checkpoints.map(cp => (
                <div
                  key={cp.version}
                  className={`p-4 rounded-xl border transition-all space-y-3 ${
                    activeCheckpointVersion === cp.version
                      ? 'bg-[#0a1224] border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                      : 'bg-[#03060f] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-purple-950 border border-purple-500/40 text-purple-300 font-mono-tech text-xs font-bold">
                        {cp.version}
                      </span>
                      <h5 className="font-cyber font-bold text-sm text-white">
                        {cp.title}
                      </h5>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono-tech">
                      <span className="text-slate-400">{cp.date}</span>
                      {activeCheckpointVersion === cp.version ? (
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-[10px] font-bold">
                          AKTYWNY CHECKPOINT
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCheckpointVersion(cp.version);
                            playCyberSound('click');
                            triggerHaptic();
                          }}
                          className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-all"
                        >
                          Przywróć Stan (Inspect)
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 font-mono-tech bg-slate-950/60 p-2.5 rounded-lg border border-slate-900">
                    <strong className="text-purple-400">Rezonans Echa:</strong> {cp.echoNarrative}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-500 pt-1">
                    <span>Hash LOGOS: <code className="text-cyan-400">{cp.hash}</code></span>
                    <span>Wskaźnik Rezonansu Systemu: <strong className="text-emerald-400">{cp.resonance}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* HALL OF FAME VIEW */
          <div className="space-y-6">
            {/* Dashboard Status Update Widget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#0a1120] to-[#0d1628] border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                ACTIVE PROJECTS
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-bold">
                8 Projekty
              </span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono-tech">
              3 Kluczowe Eterniverse (Core Engine, Docs, Bridge) + 5 wspierających.
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-cyan-400 h-full w-[88%]" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-[#0d1024] to-[#121332] border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-tech text-purple-400">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-purple-400" />
                OPEN MISSIONS
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300 font-bold">
                1 Główna
              </span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono-tech">
              "Pierwszy Binarny Świat" — Zintegrowany wektor operacyjny.
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-purple-400 h-full w-[100%]" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-[#081a18] to-[#0a2420] border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-tech text-emerald-400">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                BROTHERHOOD NODES
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-bold">
                5 Węzłów
              </span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono-tech">
              Masa krytyczna sieci: <strong className="text-emerald-400">95% Stabilności</strong>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-full w-[95%]" />
            </div>
          </div>
        </div>

        {/* Generate Legacy Entry Box */}
        <div className="p-4 rounded-xl bg-[#090f1e] border border-cyan-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-cyber font-bold text-cyan-300 tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              UTRWAL NOWY PROOF OF LEGACY (LOGOS PROTOCOL)
            </h4>
            <button
              type="button"
              onClick={() => {
                closeChronicleModal();
                openNeuralBridgeModal();
              }}
              className="text-[11px] font-mono-tech text-purple-300 hover:text-purple-200 underline flex items-center gap-1"
            >
              <span>Użyj Neural Bridge (RFC-01)</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={newProofTitle}
              onChange={e => setNewProofTitle(e.target.value)}
              placeholder="Wpisz osiągnięcie lub wkład (np. Integracja modułu VULCAN-SHIELD Sentinel)..."
              className="w-full bg-[#03060f] border border-cyan-500/30 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-cyan-200 font-mono-tech focus:outline-none"
            />
            <button
              type="button"
              onClick={handleGenerateCustomLegacy}
              disabled={!newProofTitle.trim() || isGenerating}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs tracking-wider shrink-0 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] disabled:opacity-50"
            >
              {isGenerating ? 'Utrwalanie...' : 'Wygeneruj Proof Hash'}
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-mono-tech text-slate-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            REJESTR HALL OF FAME ({filteredRecords.length})
          </span>

          <div className="flex items-center gap-2">
            {['ALL', 'MILESTONE', 'RFC_DOC', 'CODE_COMMIT', 'LORE', 'EVALUATION'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-tech transition-all border ${
                  filterType === type
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Records Stream */}
        <div className="space-y-3">
          {filteredRecords.map(record => (
            <div
              key={record.id}
              className="p-4 rounded-xl bg-[#03060d] border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2 group"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono-tech font-bold uppercase">
                    {record.contributionType}
                  </span>
                  <h5 className="font-cyber font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {record.title}
                  </h5>
                </div>

                <span className="text-[10px] font-mono-tech text-slate-500">
                  {new Date(record.timestamp).toLocaleString()}
                </span>
              </div>

              <p className="text-xs text-slate-400 font-mono-tech">
                {record.details}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900/80 text-[11px] font-mono-tech">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">
                    Architekt: <strong className="text-cyan-400">@{record.architectHandle}</strong> ({record.architectName})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono flex items-center gap-1">
                    <Hash className="w-3 h-3 text-cyan-400" />
                    {record.hash}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300 text-[10px] font-mono flex items-center gap-1">
                    <Lock className="w-3 h-3 text-purple-400" />
                    {record.logosProtocolSignature}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
      </div>
    </div>
  );
};
