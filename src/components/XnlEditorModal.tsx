import React, { useState, useEffect } from 'react';
import { XnlParser } from '../xnl/xnl-parser';
import { nxlRuntime } from '../nexus/nxl-engine/runtime';
import { NxlTruthReport, NxlDiagnostic } from '../types';
import { CheckCircle, ShieldAlert, AlertTriangle, Cpu, Zap, Activity } from 'lucide-react';

interface XnlEditorModalProps {
  xnlCode: string;
  onApply: (newXnl: string) => void;
  onClose: () => void;
}

const NXL_TEMPLATES = [
  {
    name: 'Genesis Cluster (NXL v1.0)',
    code: `define nexus_genesis_cluster
state nexus_root.status : BellasStatus = BellasStatus.SECURE
state synapse_mesh.nodes : Number = 24
assert nexus_root.status == SECURE
assert synapse_mesh.nodes == 24`,
  },
  {
    name: 'Quantum Pipeline (NXL v1.0)',
    code: `define quantum_pipeline
state pipeline.throughput : Number = 1250
state pipeline.latency : Number = 14
assert pipeline.throughput > 1000
assert pipeline.latency < 25`,
  },
  {
    name: 'Agent Sandbox Mesh (NXL v1.0)',
    code: `define agent_mesh
state agent.sandbox : String = "ISOLATED"
state agent.instances : Number = 8
assert agent.sandbox == "ISOLATED"
assert agent.instances >= 4`,
  },
  {
    name: 'Standard XML Layout',
    code: `<nexus-layout>
  <module id="nexus-core" node="NODE #01" status="OPERATIONAL" version="2.4.0"/>
  <module id="bellas-core" node="NODE #02" status="SECURE" version="1.8.2"/>
</nexus-layout>`,
  },
];

interface LiveValidationResult {
  success: boolean;
  diagnostics: NxlDiagnostic[];
  truthReports: NxlTruthReport[];
  tokensCount?: number;
}

export const XnlEditorModal: React.FC<XnlEditorModalProps> = ({ xnlCode, onApply = (_: any) => {}, onClose = () => {} }) => {
  const [code, setCode] = useState(xnlCode);
  const [validationResult, setValidationResult] = useState<LiveValidationResult>({ success: true, diagnostics: [], truthReports: [] });
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);

  // Live validation effect as user types
  useEffect(() => {
    if (!isLiveActive) return;
    try {
      const res = nxlRuntime.executeSource(code);
      setValidationResult({
        success: res.success,
        diagnostics: res.diagnostics || [],
        truthReports: res.truthReports || [],
        tokensCount: res.tokensCount || code.split(/\s+/).length,
      });
    } catch (e: any) {
      setValidationResult({
        success: false,
        diagnostics: [{ level: 'ERROR', message: e.message || 'Fatal parse exception in runtime engine' }],
        truthReports: [],
      });
    }
  }, [code, isLiveActive]);

  const handleValidateAndApply = () => {
    try {
      const res = nxlRuntime.executeSource(code);
      if (!res.success && res.diagnostics.some(d => d.level === 'ERROR')) {
        return;
      }
      onApply(code);
      onClose();
    } catch (e: any) {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#05070D]/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-4xl bg-[#090C16] border border-[#A855F7]/60 rounded-2xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.25)] font-mono flex flex-col h-[88vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#121827] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-white text-sm font-bold tracking-wider uppercase font-sans">
                XNL & NXL v1.0 Architecture Studio — Live Validator
              </h3>
              <p className="text-[11px] text-slate-400">Analiza składni i asercji Truth Layer w czasie rzeczywistym</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLiveActive(!isLiveActive)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                isLiveActive ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              <Activity className="w-3 h-3 animate-pulse" />
              <span>LIVE VALIDATE: {isLiveActive ? 'ON' : 'OFF'}</span>
            </button>
            <button onClick={onClose} className="text-[#64748B] hover:text-white cursor-pointer px-2 py-1">✕</button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 overflow-hidden">
          {/* Template Library Sidebar */}
          <div className="md:col-span-1 bg-[#05070D] border border-slate-800 rounded-xl p-3 flex flex-col overflow-y-auto">
            <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-2 pb-1.5 border-b border-slate-800 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>NXL v1.0 Templates</span>
            </div>
            <div className="space-y-1.5 flex-1">
              {NXL_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.name}
                  onClick={() => setCode(tmpl.code)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 hover:bg-purple-500/10 text-[11px] text-slate-200 transition-all cursor-pointer truncate"
                  title={tmpl.name}
                >
                  {tmpl.name}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800 leading-relaxed">
              Kliknij szablon, aby wczytać go do edytora i uruchomić walidację.
            </div>
          </div>

          {/* Editor & Diagnostics Area */}
          <div className="md:col-span-3 flex flex-col h-full space-y-3 overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Edytor kodu deklaratywnego NXL / XNL:</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-400">Tokens: {validationResult.tokensCount || 0}</span>
                {validationResult.success && validationResult.diagnostics.length === 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> SYNTAX VALID
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-[10px] font-mono text-rose-300 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> {validationResult.diagnostics.length} ISSUES
                  </span>
                )}
              </div>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-cyan-400 font-mono focus:outline-none focus:border-purple-500 resize-none selection:bg-purple-500/30 leading-relaxed shadow-inner"
              spellCheck={false}
            />

            {/* Live Diagnostics & Truth Assertions Box */}
            <div className="h-36 bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-y-auto space-y-2 font-mono text-xs">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800 pb-1 flex items-center justify-between">
                <span>Real-time Runtime Diagnostics & Truth Assertions</span>
                <span className="text-purple-400">NXL ENGINE v2.4</span>
              </div>
              
              {validationResult.diagnostics.length === 0 && validationResult.truthReports.length === 0 ? (
                <div className="text-emerald-400 flex items-center gap-2 py-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Wszystkie reguły składniowe i asercje Truth Layer zostały pomyślnie zweryfikowane.</span>
                </div>
              ) : (
                <>
                  {validationResult.diagnostics.map((diag, i) => (
                    <div key={i} className={`p-2 rounded-lg border text-[11px] flex items-start gap-2 ${
                      diag.level === 'ERROR' ? 'bg-rose-950/30 border-rose-500/40 text-rose-200' : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    }`}>
                      {diag.level === 'ERROR' ? <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />}
                      <div>
                        <span className="font-bold">[{diag.level}]</span> {diag.message}
                        {diag.hint && <span className="block text-[10px] opacity-80 mt-0.5">{diag.hint}</span>}
                      </div>
                    </div>
                  ))}
                  {validationResult.truthReports.map((tr, i) => (
                    <div key={`tr-${i}`} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] flex items-center justify-between text-slate-300">
                      <span className="font-mono text-cyan-300">assert {tr.assertion}</span>
                      <span className={tr.result ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {tr.result ? 'PASS [TRUE]' : 'FAIL [FALSE]'}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded cursor-pointer font-mono"
          >
            ANULUJ
          </button>
          <button
            onClick={handleValidateAndApply}
            className="px-5 py-2.5 text-xs bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer font-mono flex items-center gap-2 transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            <span>ZATWIERDZ I ZASTOSUJ NXL</span>
          </button>
        </div>
      </div>
    </div>
  );
};

