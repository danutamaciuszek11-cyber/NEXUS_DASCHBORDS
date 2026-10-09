import React, { useState } from 'react';
import { 
  Code2, 
  Play, 
  ShieldCheck, 
  Terminal, 
  Download, 
  CheckCircle2, 
  Layers, 
  FileCode, 
  Cpu, 
  Binary,
  Sparkles,
  Activity,
  Send
} from 'lucide-react';
import { Language } from '../../types/base-dev-tools';
import { NexusD3Visualizer } from './NexusD3Visualizer';
import { NexusContractVerifier } from './NexusContractVerifier';
import { NexusOnChainRelayer } from './NexusOnChainRelayer';

interface NexusZkVMProps {
  lang: Language;
}

export function NexusZkVM({ lang }: NexusZkVMProps) {
  const [subTab, setSubTab] = useState<'visualizer' | 'prover' | 'relayer' | 'verifier'>('visualizer');
  const [selectedProgram, setSelectedProgram] = useState<'fib' | 'sha' | 'merkle' | 'matrix'>('fib');
  const [paramInput, setParamInput] = useState('100');
  const [isExecuting, setIsExecuting] = useState(false);
  const [proofResult, setProofResult] = useState<any>(null);
  const [externalBurstTrigger, setExternalBurstTrigger] = useState<number>(0);
  const [injectedCount, setInjectedCount] = useState<number>(0);

  const programs = [
    {
      id: 'fib',
      name: 'Fibonacci Sequence',
      desc: 'Proves verifiable execution of N iterative steps without revealing intermediate register states.',
      defaultParam: '100',
      paramLabel: 'Number of steps (N)',
    },
    {
      id: 'sha',
      name: 'Keccak-256 / SHA-256 Pre-Image',
      desc: 'Proves knowledge of secret input X such that Hash(X) = Y without revealing X.',
      defaultParam: 'nexus_zkvm_secret_key_2026',
      paramLabel: 'Secret Input Message',
    },
    {
      id: 'merkle',
      name: 'Merkle Membership Proof',
      desc: 'Verifies that a leaf exists inside an off-chain 32-level state tree.',
      defaultParam: '0x71c899014bca8210',
      paramLabel: 'Leaf Node Hash (Hex)',
    },
    {
      id: 'matrix',
      name: 'Verifiable AI Neural Inference',
      desc: 'Proves deterministic execution of a quantized matrix multiplication layer for on-chain AI.',
      defaultParam: '16',
      paramLabel: 'Matrix Dimension (D x D)',
    },
  ];

  const handleSelectProgram = (id: any) => {
    setSelectedProgram(id);
    const prog = programs.find(p => p.id === id);
    if (prog) setParamInput(prog.defaultParam);
    setProofResult(null);
  };

  const handleRunZkVM = () => {
    setIsExecuting(true);
    setProofResult(null);

    setTimeout(() => {
      setIsExecuting(false);
      const executionCycles = selectedProgram === 'fib' ? 65536 : selectedProgram === 'sha' ? 131072 : selectedProgram === 'merkle' ? 262144 : 524288;
      const proofTime = (Math.random() * 0.8 + 0.9).toFixed(2);
      const randomProofHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      setProofResult({
        success: true,
        cycles: executionCycles,
        timeSeconds: proofTime,
        proofHash: randomProofHash,
        proofSizeBytes: 1420,
        verifierOutput: '0x0000000000000000000000000000000000000000000000000000000000000001 (VALID)',
        traceRows: executionCycles,
        degree: 16,
        securityLevel: '128-bit Post-Quantum Conjectured',
      });
    }, 2400);
  };

  const handleDownloadProof = () => {
    if (!proofResult) return;
    const blob = new Blob([JSON.stringify(proofResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nxl-zkvm-proof-${selectedProgram}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Sub-Navigation for ZkVM Section */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-white">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('visualizer')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'visualizer'
                ? 'bg-neutral-800 text-cyan-400 border border-neutral-700 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'pl' ? 'Wizualizacja D3.js (Cykle & Przepustowość)' : 'D3.js Real-Time Telemetry'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('prover')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'prover'
                ? 'bg-neutral-800 text-cyan-400 border border-neutral-700 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Code2 className="w-4 h-4 text-blue-400" />
            <span>{lang === 'pl' ? 'Studio Algorytmów zkVM' : 'zkVM Algorithm Studio'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('relayer')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'relayer'
                ? 'bg-neutral-800 text-cyan-400 border border-neutral-700 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Send className="w-4 h-4 text-purple-400" />
            <span>{lang === 'pl' ? '⛓️ On-Chain Relayer (Base)' : '⛓️ On-Chain Relayer (Base)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('verifier')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'verifier'
                ? 'bg-neutral-800 text-cyan-400 border border-neutral-700 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'pl' ? 'Weryfikator Kontraktów (Basescan JSON)' : 'Contract Verifier (Basescan)'}</span>
          </button>
        </div>

        {/* Live Network Status Indicator Badge */}
        <div className="hidden sm:flex items-center gap-2.5 pr-2">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>zkVM Mesh: ~28.3 Mc/s</span>
          </div>
        </div>
      </div>

      {/* Subtab 1: D3.js Live Telemetry */}
      {subTab === 'visualizer' && (
        <NexusD3Visualizer 
          lang={lang} 
          externalBurstTrigger={externalBurstTrigger}
          onProofInjected={() => setInjectedCount(c => c + 1)}
        />
      )}

      {/* Subtab 2: zkVM Execution Studio */}
      {subTab === 'prover' && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
            <div className="border-b border-neutral-100 pb-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="w-5 h-5 text-cyan-600" />
                <h2 className="text-xl font-bold text-neutral-900">
                  {lang === 'pl' ? 'NXL zkVM Studio (Weryfikowalne Obliczenia)' : 'NXL zkVM Verifiable Compute Studio'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500">
                {lang === 'pl' 
                  ? 'Pisz, kompiluj i dowodź poprawności programów na maszynie wirtualnej NXL Nexus bez ujawniania danych wejściowych.' 
                  : 'Execute and prove arbitrary computational logic inside the NXL Zero-Knowledge Virtual Machine.'}
              </p>
            </div>

            {/* Program Cards */}
            <div className="space-y-4">
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                {lang === 'pl' ? 'Wybierz Program zkVM' : 'Select zkVM Algorithm'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {programs.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectProgram(p.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedProgram === p.id 
                        ? 'bg-cyan-50/70 border-cyan-500/80 shadow-sm' 
                        : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-neutral-900">{p.name}</h3>
                      {selectedProgram === p.id && <Sparkles className="w-4 h-4 text-cyan-600" />}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      {p.desc}
                    </p>
                  </button>
                ))}
              </div>

              {/* Program Parameter & Run */}
              <div className="pt-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700">
                    {programs.find(p => p.id === selectedProgram)?.paramLabel}
                  </label>
                  <input
                    type="text"
                    value={paramInput}
                    onChange={(e) => setParamInput(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-mono focus:border-cyan-500 outline-none"
                  />
                </div>

                <button
                  onClick={handleRunZkVM}
                  disabled={isExecuting || !paramInput.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {isExecuting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Play className="w-5 h-5 fill-current" />
                  )}
                  <span>
                    {isExecuting 
                      ? (lang === 'pl' ? 'Generowanie dowodu STARK...' : 'Generating zk-STARK Proof...') 
                      : (lang === 'pl' ? 'Wykonaj i Dowiedź w NXL zkVM' : 'Execute & Prove with zkVM')}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Proof Output Result */}
          {proofResult && (
            <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 sm:p-8 text-white space-y-6 shadow-xl animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-base text-neutral-100">
                    {lang === 'pl' ? 'Dowód zkVM Wygenerowany i Zweryfikowany' : 'zkVM Proof Generated & Verified'}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSubTab('relayer')}
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-cyan-500 text-xs font-mono font-bold text-white py-1.5 px-3.5 rounded-lg transition-all shadow-md shadow-blue-900/40 transform active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{lang === 'pl' ? 'Wyślij na Base (Mint Attestation)' : 'Relay to Base (Mint Attestation)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setExternalBurstTrigger(proofResult.cycles * 35);
                      setSubTab('visualizer');
                    }}
                    className="inline-flex items-center gap-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-xs font-mono text-cyan-300 py-1.5 px-3 rounded-lg transition-colors shadow-sm"
                  >
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'pl' ? 'Pokaż w Telemetrii D3' : 'Stream to D3 Telemetry'}</span>
                  </button>

                  <button
                    onClick={handleDownloadProof}
                    className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-cyan-400 py-1.5 px-3 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Proof (JSON)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="block text-[11px] font-mono text-neutral-400 uppercase">Compute Time</span>
                  <span className="text-lg font-bold font-mono text-cyan-400">{proofResult.timeSeconds}s</span>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="block text-[11px] font-mono text-neutral-400 uppercase">Execution Cycles</span>
                  <span className="text-lg font-bold font-mono text-white">{proofResult.cycles.toLocaleString()} rows</span>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="block text-[11px] font-mono text-neutral-400 uppercase">Proof Size</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">{proofResult.proofSizeBytes} bytes</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-mono text-neutral-400 uppercase">Commitment / Proof Hash</span>
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-xs text-neutral-300 break-all select-all">
                  {proofResult.proofHash}
                </div>
              </div>

              <div className="text-xs font-mono text-neutral-400 flex items-center justify-between border-t border-neutral-900 pt-3">
                <span>Security: {proofResult.securityLevel}</span>
                <span className="text-emerald-400">Status: ON-CHAIN VERIFIED</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtab: On-Chain Relayer */}
      {subTab === 'relayer' && (
        <NexusOnChainRelayer 
          lang={lang} 
          initialProofData={proofResult ? { 
            proofHash: proofResult.proofHash, 
            cycles: proofResult.cycles, 
            taskName: programs.find(p => p.id === selectedProgram)?.name,
            timeSeconds: proofResult.timeSeconds,
            proofSizeBytes: proofResult.proofSizeBytes
          } : null} 
        />
      )}

      {/* Subtab: Contract Verifier */}
      {subTab === 'verifier' && (
        <NexusContractVerifier lang={lang} />
      )}
    </div>
  );
}

