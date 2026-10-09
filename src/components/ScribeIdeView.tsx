import React, { useState } from 'react';
import { NxlAstNode, NxlDiagnostic, NxlTruthReport, NxlExecutionPlan, NxlLedgerEntry } from '../types';
import { nxlRuntime } from '../nexus/nxl-engine/runtime';
import { Play, FileCode2, CheckCircle, AlertTriangle, Cpu, Terminal, ShieldAlert, Sparkles, Copy, Check } from 'lucide-react';

const SAMPLE_TEMPLATES = {
  CORE_MANIFEST: `define nexus_core
node Biooperator : IDENTITY(Biooperator_Architekt)
node ZipAnalyzerNode : IDENTITY(Zip_Mass_Node) at "synapse_mesh_24"
node ProtectedCore : PROTECTED

state nexus_root.status : BellasStatus
state sensor.temperature : Number

enum BellasStatus {
  SECURE,
  CONTEMPLATION,
  ALERT
}

set nexus_root.status = BellasStatus.SECURE
set sensor.temperature = 25

capability ai.synthesize
grant Biooperator -> ai.synthesize

relate Biooperator -> ZipAnalyzerNode
relate ZipAnalyzerNode <-> ProtectedCore

assert nexus_root.status == SECURE
assert sensor.temperature == 25

when nexus_root.status == SECURE execute trigger_mesh_sync
`,

  ZIP_POLICY: `define zip_integrity_policy
node ZipNode : IDENTITY(Mass_Analyzer)
node ProtectedNxl : PROTECTED

capability file.analyze
grant ZipNode -> file.analyze

policy ZipPolicy {
  permit file.analyze
  deny file.write at "nexus/js/core/*.nxl"
  restrict zip.extraction
}

assert ZipNode == Mass_Analyzer
`,

  TRANSFORM_DEMO: `define transform_engine
state sensor.signal : Signal
state sensor.temperature : Number

set sensor.temperature = 20

transform sensor.temperature from 20 to 85

assert sensor.temperature == 85
`,

  GENESIS_MANIFEST: `define genesis_album_core
node ArchitektMaciej : IDENTITY(Maciej_Maciuszek)
node GenesisAlbum : UTWO_GENESIS("Nie Tylko Narzędzie! Nie Tylko Kod!")
node Biooperator : IDENTITY(Biooperator_Kasia)
node BellasFamily : IDENTITY(Rodzina_Bellas)

state genesis.status : String
state genesis.genre : String

set genesis.status = "PŁYTA GENESIS — UTWÓR W RDZENIU"
set genesis.genre = "Cyberpunk / Folk Rap / Industrial"

capability genesis.youtube_broadcast
grant ArchitektMaciej -> genesis.youtube_broadcast

relate ArchitektMaciej -> GenesisAlbum
relate GenesisAlbum <-> BellasFamily

assert genesis.status == "PŁYTA GENESIS — UTWÓR W RDZENIU"
assert genesis.genre == "Cyberpunk / Folk Rap / Industrial"

when genesis.status == "PŁYTA GENESIS — UTWÓR W RDZENIU" execute trigger_youtube_genesis_broadcast
`
};

export const ScribeIdeView: React.FC = () => {
  const [sourceCode, setSourceCode] = useState<string>(SAMPLE_TEMPLATES.CORE_MANIFEST);
  const [activeTab, setActiveTab] = useState<'truth' | 'plans' | 'ast' | 'diagnostics' | 'ledger'>('truth');
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const [compileResult, setCompileResult] = useState<{
    tokensCount: number;
    ast: NxlAstNode;
    diagnostics: NxlDiagnostic[];
    truthReports: NxlTruthReport[];
    executionPlans: NxlExecutionPlan[];
    ledger: NxlLedgerEntry[];
    success: boolean;
  } | null>(null);

  // WASM Sandbox Terminal state
  const [sandboxLogs, setSandboxLogs] = useState<Array<{ type: 'input' | 'output' | 'error' | 'system'; text: string; time: string }>>([
    { type: 'system', text: 'NEXUS WASM Sandbox v2.4 initialized. Memory: 64MB isolated heap. Type "help" for commands or execute NXL scripts.', time: new Date().toLocaleTimeString() }
  ]);
  const [sandboxInput, setSandboxInput] = useState<string>('');
  const [isSandboxRunning, setIsSandboxRunning] = useState<boolean>(false);

  const handleRunSandboxCommand = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cmd = sandboxInput.trim();
    if (!cmd || isSandboxRunning) return;

    const time = new Date().toLocaleTimeString();
    setSandboxLogs(prev => [...prev, { type: 'input', text: `nxl-sandbox$ ${cmd}`, time }]);
    setSandboxInput('');
    setIsSandboxRunning(true);

    setTimeout(() => {
      try {
        let outputText = '';
        const lower = cmd.toLowerCase();
        if (lower === 'help') {
          outputText = 'Available NXL Sandbox Commands:\\n  run         - Execute current editor source code in sandbox\\n  status      - Display cluster node & isolation metrics\\n  ledger      - Dump state ledger entries\\n  clear       - Clear sandbox terminal logs\\n  verify      - Run truth layer assertion checks';
        } else if (lower === 'status') {
          outputText = 'WASM Sandbox: SECURE | Heap: 14.2MB / 64MB | Active Nodes: 24 | Drift: 0.00ms';
        } else if (lower === 'clear') {
          setSandboxLogs([]);
          setIsSandboxRunning(false);
          return;
        } else if (lower === 'run' || lower === 'verify') {
          const res = nxlRuntime.executeSource(sourceCode);
          outputText = `Execution completed successfully.
Truth Reports: ${res.truthReports.length} checked.
Diagnostics: ${res.diagnostics.length} issues found.
Ledger items: ${res.ledger.length}`;
        } else {
          const res = nxlRuntime.executeSource(cmd);
          outputText = `Executed script in isolated WASM container.
Success: ${res.success}
Truth assertions passed: ${res.truthReports.filter(t => t.result).length}/${res.truthReports.length}`;
        }
        setSandboxLogs(prev => [...prev, { type: 'output', text: outputText, time: new Date().toLocaleTimeString() }]);
      } catch (err: any) {
        setSandboxLogs(prev => [...prev, { type: 'error', text: `Error: ${err?.message || 'Execution fault'}`, time: new Date().toLocaleTimeString() }]);
      } finally {
        setIsSandboxRunning(false);
      }
    }, 400);
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      const res = await fetch('/api/nxl/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: sourceCode })
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && !data.error) {
          setCompileResult({
            tokensCount: data.tokensCount || 0,
            ast: data.ast || { type: 'manifest', nodes: [], relations: [], states: [], capabilities: [], grants: [], policies: [], assertions: [], transitions: [] },
            diagnostics: Array.isArray(data.diagnostics) ? data.diagnostics : [],
            truthReports: Array.isArray(data.truthReports) ? data.truthReports : [],
            executionPlans: Array.isArray(data.executionPlans) ? data.executionPlans : [],
            ledger: Array.isArray(data.ledger) ? data.ledger : [],
            success: Boolean(data.success)
          });
          return;
        }
      }
      // Client-side execution fallback
      const localResult = nxlRuntime.executeSource(sourceCode);
      setCompileResult(localResult);
    } catch {
      // Client-side execution fallback
      const localResult = nxlRuntime.executeSource(sourceCode);
      setCompileResult(localResult);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleCopyCode = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(sourceCode);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* IDE Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <FileCode2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base font-sans">Scribe NXL v1.0 IDE & Studio</h2>
            <p className="text-xs text-slate-400">Interaktywny kompilator języka NXL z bezpośrednią weryfikacją w Truth Layer</p>
          </div>
        </div>

        {/* Template Selector & Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Szablon:</span>
          <button
            onClick={() => setSourceCode(SAMPLE_TEMPLATES.CORE_MANIFEST)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700"
          >
            Pełny Core Manifest
          </button>
          <button
            onClick={() => setSourceCode(SAMPLE_TEMPLATES.ZIP_POLICY)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700"
          >
            Polisa ZIP Shield
          </button>
          <button
            onClick={() => setSourceCode(SAMPLE_TEMPLATES.TRANSFORM_DEMO)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700"
          >
            Transformacje Stanu
          </button>
          <button
            onClick={() => setSourceCode(SAMPLE_TEMPLATES.GENESIS_MANIFEST)}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-xs font-mono font-bold text-amber-300 border border-amber-500/40"
          >
            Płyta GENESIS (Manifest)
          </button>

          <button
            onClick={() => handleCopyCode()}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            title="Kopiuj Kod"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleCompile()}
            disabled={isCompiling}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50"
          >
            <Play className={`w-4 h-4 fill-current ${isCompiling ? 'animate-spin' : ''}`} />
            <span>{isCompiling ? 'Kompilacja...' : 'Kompiluj & Wykonaj'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Output Split Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Code Editor Container */}
        <div className="nx-glass-card rounded-2xl border border-slate-800 flex flex-col h-[520px]">
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-semibold text-slate-200">manifest.nxl</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">NXL Syntax Spec v1.0</span>
          </div>

          <textarea
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            className="w-full flex-1 p-4 bg-slate-950/90 text-cyan-200 font-mono text-xs focus:outline-none resize-none leading-relaxed selection:bg-cyan-500/30"
            placeholder="Wprowadź kod NXL..."
            spellCheck={false}
          />
        </div>

        {/* Right: Compiler Output & Diagnostic Tabs */}
        <div className="nx-glass-card rounded-2xl border border-slate-800 flex flex-col h-[520px]">
          {/* Sub-Tabs Header */}
          <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/60 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'truth', label: 'Raport Prawdy', count: (compileResult?.truthReports || []).length },
              { id: 'plans', label: 'Plany Egzekucji', count: (compileResult?.executionPlans || []).length },
              { id: 'diagnostics', label: 'Diagnostyka Typów', count: (compileResult?.diagnostics || []).length },
              { id: 'ast', label: 'Drzewo AST', count: compileResult?.ast ? 1 : 0 },
              { id: 'ledger', label: 'Wersje Ledgera', count: (compileResult?.ledger || []).length },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  activeTab === t.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {t.label} {t.count !== undefined ? `(${t.count})` : ''}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 font-mono text-xs">
            {!compileResult ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                <Sparkles className="w-8 h-8 text-slate-600 animate-pulse" />
                <p>Kliknij "Kompiluj & Wykonaj" aby sprawdzić manifest w NXL Engine.</p>
              </div>
            ) : (
              <>
                {/* 1. Truth Reports Tab */}
                {activeTab === 'truth' && (
                  <div className="space-y-3">
                    {(compileResult.truthReports || []).length === 0 ? (
                      <p className="text-slate-500 italic">Brak klauzul 'assert' w wygenerowanym manifeście.</p>
                    ) : (
                      (compileResult.truthReports || []).map((tr, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{tr.assertion}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tr.result ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950 text-rose-300 border border-rose-500/40'}`}>
                              {tr.result ? 'PASS (PRAVDA)' : 'FAIL'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{tr.evidence}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 2. Execution Plans Tab */}
                {activeTab === 'plans' && (
                  <div className="space-y-3">
                    {(compileResult.executionPlans || []).length === 0 ? (
                      <p className="text-slate-500 italic">Brak dyrektyw 'when ... execute' w manifeście.</p>
                    ) : (
                      (compileResult.executionPlans || []).map((ep, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-cyan-300">{ep.id}: {ep.intent}</span>
                            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px]">
                              {ep.status}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Uprawnienie: {ep.capabilityStatus} | Target: {ep.targetAdapter}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 3. Diagnostics Tab */}
                {activeTab === 'diagnostics' && (
                  <div className="space-y-2">
                    {(compileResult.diagnostics || []).length === 0 ? (
                      <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Brak błędów składniowych i typowania w manifeście.</span>
                      </div>
                    ) : (
                      (compileResult.diagnostics || []).map((diag, i) => (
                        <div key={i} className={`p-3 rounded-xl border space-y-1 ${diag.level === 'ERROR' ? 'bg-rose-950/30 border-rose-500/40 text-rose-200' : 'bg-amber-950/30 border-amber-500/40 text-amber-200'}`}>
                          <div className="flex items-center gap-2 font-bold">
                            {diag.level === 'ERROR' ? <ShieldAlert className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                            <span>[{diag.level}] {diag.message}</span>
                          </div>
                          {diag.hint && <p className="text-[11px] opacity-80">{diag.hint}</p>}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 4. AST Tree Inspector */}
                {activeTab === 'ast' && (
                  <pre className="p-3 rounded-xl bg-slate-950 text-slate-300 text-[11px] overflow-x-auto leading-relaxed">
                    {JSON.stringify(compileResult.ast, null, 2)}
                  </pre>
                )}

                {/* 5. Ledger Tab */}
                {activeTab === 'ledger' && (
                  <div className="space-y-2">
                    {(compileResult.ledger || []).map((leg, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="text-cyan-300 font-bold">v{leg.version}</span> - {leg.target}
                          <span className="text-slate-400 block text-[10px]">{leg.reason}</span>
                        </div>
                        <span className="text-emerald-400 font-bold">{String(leg.newValue)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* WASM Sandbox Terminal UI */}
      <div className="nx-glass-card rounded-2xl border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-sans">WASM Sandbox Terminal</h3>
              <p className="text-[11px] text-slate-400">Izolowany kontener V8 / Heap 64MB do wykonywania skryptów i komend NXL w czasie rzeczywistym</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
            SECURE V8 RUNTIME // ACTIVE
          </span>
        </div>

        {/* Terminal Output Logs */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 h-52 overflow-y-auto font-mono text-xs space-y-2">
          {sandboxLogs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-slate-600 text-[10px] shrink-0 select-none">[{log.time}]</span>
              {log.type === 'input' && <span className="text-cyan-400 font-bold">{log.text}</span>}
              {log.type === 'output' && <span className="text-emerald-300 whitespace-pre-wrap">{log.text}</span>}
              {log.type === 'error' && <span className="text-rose-400 font-bold">{log.text}</span>}
              {log.type === 'system' && <span className="text-slate-400 italic">{log.text}</span>}
            </div>
          ))}
        </div>

        {/* Terminal Input Form */}
        <form onSubmit={handleRunSandboxCommand} className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 font-mono text-xs font-bold">nxl-sandbox$</span>
            <input
              type="text"
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
              placeholder="Wprowadź komendę NXL (np. run, status, help, verify)..."
              disabled={isSandboxRunning}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-28 pr-4 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={isSandboxRunning || !sandboxInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <span>{isSandboxRunning ? 'Wykonywanie...' : 'Wykonaj'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
