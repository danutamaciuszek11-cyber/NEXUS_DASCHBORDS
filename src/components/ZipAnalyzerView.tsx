import React, { useState } from 'react';
import { ZipAnalysisReport } from '../types';
import { ZipAnalyzer } from '../nexus/nxl-engine/zipAnalyzer';
import { Archive, UploadCloud, ShieldAlert, CheckCircle2, FileText, Lock, Play, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ZipAnalyzerView: React.FC = () => {
  const [report, setReport] = useState<ZipAnalysisReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const localReport = await ZipAnalyzer.analyzeBuffer(arrayBuffer, file.name);
        setReport(localReport);
      } catch (err: any) {
        setErrorMessage(`Błąd analizy pakietu: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleRunSampleTest = async (withThreat: boolean) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/zip/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sampleThreat: withThreat,
          fileName: withThreat ? 'simulated_nxl_threat_override.zip' : 'clean_package_v1.zip'
        })
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && Array.isArray(data.files)) {
          setReport(data);
          return;
        }
      }
      // Local fallback
      const sample = await ZipAnalyzer.createSampleZip(withThreat);
      const report = await ZipAnalyzer.analyzeBuffer(
        sample.buffer,
        withThreat ? 'simulated_nxl_threat_override.zip' : 'clean_package_v1.zip'
      );
      setReport(report);
    } catch {
      // Local fallback
      const sample = await ZipAnalyzer.createSampleZip(withThreat);
      const report = await ZipAnalyzer.analyzeBuffer(
        sample.buffer,
        withThreat ? 'simulated_nxl_threat_override.zip' : 'clean_package_v1.zip'
      );
      setReport(report);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMassAnalysis = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/zip/mass-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && Array.isArray(data.reports) && data.reports.length > 0) {
          const selectedReport = data.reports[1] || data.reports[0];
          if (selectedReport && Array.isArray(selectedReport.files)) {
            setReport(selectedReport);
            return;
          }
        }
      }
      // Local fallback for mass analysis
      const sampleThreat = await ZipAnalyzer.createSampleZip(true);
      const threatReport = await ZipAnalyzer.analyzeBuffer(sampleThreat.buffer, 'synapse_node_threat_attempt.zip');
      setReport(threatReport);
    } catch {
      // Local fallback
      const sampleThreat = await ZipAnalyzer.createSampleZip(true);
      const threatReport = await ZipAnalyzer.analyzeBuffer(sampleThreat.buffer, 'synapse_node_threat_attempt.zip');
      setReport(threatReport);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base font-sans">ZIP Integrity Shield & Mass Analyzer</h2>
            <p className="text-xs text-slate-400">
              Analizuj pakiety archiwalne w czasie rzeczywistym pod kątem dyrektywy **Immutable NXL Protection**
            </p>
          </div>
        </div>

        {/* Test Quick Triggers */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleRunSampleTest(false)}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Test Czystego Pakietu</span>
          </button>

          <button
            onClick={() => handleRunSampleTest(true)}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-xs font-mono text-amber-300 border border-amber-500/40 flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Simulate NXL Override Threat</span>
          </button>

          <button
            onClick={() => handleMassAnalysis()}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Masowa Analiza (24 Węzły)</span>
          </button>
        </div>
      </div>

      {/* Upload Drag & Drop Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
          }
        }}
        className={`nx-glass-card rounded-2xl p-8 border-2 border-dashed text-center transition-all ${
          dragActive
            ? 'border-cyan-400 bg-cyan-500/10'
            : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        <input
          type="file"
          accept=".zip"
          id="zip-upload-input"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        <label htmlFor="zip-upload-input" className="cursor-pointer space-y-3 block">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
            <UploadCloud className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Upuść plik ZIP lub kliknij, aby załadować</p>
            <p className="text-xs text-slate-400 mt-1">
              JSZip przeanalizuje zawartość i zweryfikuje, czy żadne pliki nie próbują nadpisać rdzenia `.nxl`
            </p>
          </div>
        </label>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Analysis Report View */}
      {report && report.files && (
        <div className="nx-glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
          {/* Summary Cards */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-lg font-mono">{report.fileName}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                  report.status === 'CLEAN'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                }`}>
                  {report.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                ID Raportu: {report.id} | Wykonano: {new Date(report.timestamp).toLocaleTimeString()}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-slate-500 block text-[10px]">PLIKÓW W ARCHIWUM</span>
                <span className="text-white font-bold text-sm">{report.totalFiles}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-slate-500 block text-[10px]">ZAGROŻEŃ PRZECHWYCONO</span>
                <span className={`font-bold text-sm ${report.threatsIntercepted > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {report.threatsIntercepted}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-slate-500 block text-[10px]">ROZMIAR RAZEM</span>
                <span className="text-cyan-300 font-bold text-sm">{(report.totalSize / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          </div>

          {/* Files Details Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider text-slate-400">
              Szczegóły Zawartości Archiwum
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[10px]">
                    <th className="py-2 px-3">NAZWA PLIKU</th>
                    <th className="py-2 px-3">ROZMIAR</th>
                    <th className="py-2 px-3">OCHRONA NXL</th>
                    <th className="py-2 px-3">AKCJA OSŁONY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {(report.files || []).map((f, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="py-2.5 px-3 flex items-center gap-2 text-slate-200">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span>{f.name}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">{(f.size / 1024).toFixed(2)} KB</td>
                      <td className="py-2.5 px-3">
                        {f.isProtected ? (
                          <span className="text-rose-400 flex items-center gap-1 font-bold">
                            <Lock className="w-3.5 h-3.5" /> CHRONIONY RDZEŃ
                          </span>
                        ) : (
                          <span className="text-slate-500">Zwykły zasób</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        {f.action === 'BLOCKED_IMMUTABLE_NXL' ? (
                          <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 font-bold">
                            BLOCKED (IMMUTABLE NXL SHIELD)
                          </span>
                        ) : f.action === 'ISOLATED' ? (
                          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">
                            ISOLATED EXECUTABLE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                            ALLOWED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
