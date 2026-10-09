import React, { useState, useEffect } from 'react';
import { ZipAnalysisReport, NexusAuditLogEntry, CicdDeploymentReport } from '../types';
import { ZipAnalyzerNode } from '../nexus/nxl-engine/zipAnalyzer';
import {
  Archive,
  UploadCloud,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Lock,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Terminal,
  RefreshCw,
  XCircle,
  Play,
  Shield,
  FileCode2,
  Check
} from 'lucide-react';

export const ZipAnalyzerView: React.FC = () => {
  const [report, setReport] = useState<ZipAnalysisReport | null>(null);
  const [deploymentReport, setDeploymentReport] = useState<CicdDeploymentReport | null>(null);
  const [auditLogs, setAuditLogs] = useState<NexusAuditLogEntry[]>([]);
  const [auditFilter, setAuditFilter] = useState<string>('ALL');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ANALYZER' | 'CICD_PIPELINE' | 'AUDIT_LOG'>('ANALYZER');
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Fetch live Nexus Audit Logs
  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/nexus/audit-log?limit=50');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.auditLogs)) {
          setAuditLogs(data.auditLogs);
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);
    setDeploymentReport(null);
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const localReport = await ZipAnalyzerNode.analyzeBuffer(arrayBuffer, file.name);
        setReport(localReport);
        fetchAuditLogs();
      } catch (err: any) {
        setErrorMessage(`Błąd analizy pakietu: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Run Real-time ZIP Package Analysis via API
  const handleRunSampleTest = async (withThreat: boolean, attackVector: boolean = false) => {
    setIsLoading(true);
    setErrorMessage(null);
    setDeploymentReport(null);
    try {
      const res = await fetch('/api/zip/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sampleThreat: withThreat,
          attackVector,
          fileName: attackVector
            ? 'nxl_trojan_exploit_payload.zip'
            : withThreat
            ? 'simulated_nxl_core_override.zip'
            : 'quantum_verified_package_v1.zip'
        })
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && Array.isArray(data.files)) {
          setReport(data);
          fetchAuditLogs();
          return;
        }
      }
      // Local fallback
      const sample = attackVector
        ? await ZipAnalyzerNode.createAttackTestZip()
        : await ZipAnalyzerNode.createSampleZip(withThreat);
      const localReport = await ZipAnalyzerNode.analyzeBuffer(
        sample.buffer,
        attackVector
          ? 'nxl_trojan_exploit_payload.zip'
          : withThreat
          ? 'simulated_nxl_core_override.zip'
          : 'quantum_verified_package_v1.zip'
      );
      setReport(localReport);
      fetchAuditLogs();
    } catch {
      const sample = attackVector
        ? await ZipAnalyzerNode.createAttackTestZip()
        : await ZipAnalyzerNode.createSampleZip(withThreat);
      const localReport = await ZipAnalyzerNode.analyzeBuffer(
        sample.buffer,
        attackVector
          ? 'nxl_trojan_exploit_payload.zip'
          : withThreat
          ? 'simulated_nxl_core_override.zip'
          : 'quantum_verified_package_v1.zip'
      );
      setReport(localReport);
      fetchAuditLogs();
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Quantum CI/CD v3.1.0 Deployment Pipeline Test
  const handleTriggerCicdDeployment = async (simulateAttack: boolean = false) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/ci-cd/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simulateAttack,
          fileName: simulateAttack ? 'unauthorized_core_override.zip' : 'verified_quantum_bundle_v3.1.0.zip'
        })
      });

      const data = await res.json();
      if (data.report) {
        setReport(data.report);
      }
      setDeploymentReport(data);
      fetchAuditLogs();
    } catch (err: any) {
      setErrorMessage(`CI/CD Pipeline Error: ${err.message}`);
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
            fetchAuditLogs();
            return;
          }
        }
      }
      const sampleThreat = await ZipAnalyzerNode.createSampleZip(true);
      const threatReport = await ZipAnalyzerNode.analyzeBuffer(sampleThreat.buffer, 'synapse_node_threat_attempt.zip');
      setReport(threatReport);
      fetchAuditLogs();
    } catch {
      const sampleThreat = await ZipAnalyzerNode.createSampleZip(true);
      const threatReport = await ZipAnalyzerNode.analyzeBuffer(sampleThreat.buffer, 'synapse_node_threat_attempt.zip');
      setReport(threatReport);
      fetchAuditLogs();
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAuditLogs = auditLogs.filter(log => {
    if (auditFilter === 'ALL') return true;
    if (auditFilter === 'VIOLATIONS') return log.protocol === 'NXL_SECURITY_VIOLATION' || log.status === 'BLOCKED';
    if (auditFilter === 'SUCCESS') return log.status === 'SUCCESS' || log.status === 'AUTHORIZED';
    return true;
  });

  return (
    <div className="space-y-6 font-mono-tech">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#090C16] border border-[#00E5FF]/30 shadow-[0_0_30px_rgba(0,229,255,0.08)]">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-base tracking-wider uppercase">
                Nexus Quantum CI/CD v3.1.0 & NXL v1.0 Security Shield
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00D9A6]/10 text-[#00D9A6] border border-[#00D9A6]/30">
                ZipAnalyzerNode ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Automatyczna walidacja wszystkich wdrożeń ZIP. Próby nadpisania rdzenia NXL lub iniekcji skryptów są natychmiast blokowane przez protokół <strong className="text-[#FF3B5C]">NXL_SECURITY_VIOLATION</strong>.
            </p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#05070D] border border-[#121827]">
          <button
            onClick={() => setActiveTab('ANALYZER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'ANALYZER'
                ? 'bg-[#00E5FF] text-[#05070D] shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                : 'text-[#64748B] hover:text-white'
            }`}
          >
            ZIP Analyzer
          </button>
          <button
            onClick={() => setActiveTab('CICD_PIPELINE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'CICD_PIPELINE'
                ? 'bg-[#00E5FF] text-[#05070D] shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                : 'text-[#64748B] hover:text-white'
            }`}
          >
            Quantum CI/CD Pipeline
          </button>
          <button
            onClick={() => {
              setActiveTab('AUDIT_LOG');
              fetchAuditLogs();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'AUDIT_LOG'
                ? 'bg-[#00E5FF] text-[#05070D] shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                : 'text-[#64748B] hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Nexus Audit Log ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {/* Quick Action Triggers */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          onClick={() => handleTriggerCicdDeployment(false)}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-xl bg-[#00D9A6]/15 hover:bg-[#00D9A6]/25 text-[#00D9A6] border border-[#00D9A6]/40 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(0,217,166,0.15)]"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>CI/CD Deploy: Czysty Pakiet (Pass)</span>
        </button>

        <button
          onClick={() => handleTriggerCicdDeployment(true)}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-xl bg-[#FF3B5C]/15 hover:bg-[#FF3B5C]/25 text-[#FF3B5C] border border-[#FF3B5C]/50 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(255,59,92,0.2)]"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Symuluj Atak / Nadpisanie Rdzenia (NXL_SECURITY_VIOLATION)</span>
        </button>

        <button
          onClick={() => handleRunSampleTest(true, false)}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-xl bg-[#FBBF24]/15 hover:bg-[#FBBF24]/25 text-[#FBBF24] border border-[#FBBF24]/40 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Test Override *.nxl</span>
        </button>

        <button
          onClick={() => handleMassAnalysis()}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-[#00E5FF] hover:bg-[#00c2d6] text-[#05070D] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all ml-auto"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Masowa Analiza Klastra (24 Synapse + 16 CI/CD)</span>
        </button>
      </div>

      {/* CI/CD Pipeline Status Display */}
      {deploymentReport && (
        <div className={`p-5 rounded-2xl border transition-all ${
          deploymentReport.status === 'DEPLOYED'
            ? 'bg-[#00D9A6]/5 border-[#00D9A6]/40 shadow-[0_0_30px_rgba(0,217,166,0.1)]'
            : 'bg-[#FF3B5C]/10 border-[#FF3B5C]/50 shadow-[0_0_30px_rgba(255,59,92,0.15)]'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#121827]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                deploymentReport.status === 'DEPLOYED'
                  ? 'bg-[#00D9A6]/20 text-[#00D9A6] border border-[#00D9A6]/40'
                  : 'bg-[#FF3B5C]/20 text-[#FF3B5C] border border-[#FF3B5C]/40'
              }`}>
                {deploymentReport.status === 'DEPLOYED' ? '✓' : '✕'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold text-sm tracking-wider uppercase">
                    {deploymentReport.pipelineVersion} // WDROŻENIE
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    deploymentReport.status === 'DEPLOYED'
                      ? 'bg-[#00D9A6]/20 text-[#00D9A6] border border-[#00D9A6]'
                      : 'bg-[#FF3B5C]/20 text-[#FF3B5C] border border-[#FF3B5C]'
                  }`}>
                    {deploymentReport.status === 'DEPLOYED' ? 'STATUS: DEPLOYED (SEALED)' : 'STATUS: BLOCKED BY NXL_SECURITY_VIOLATION'}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Pakiet: <strong className="text-white">{deploymentReport.packageName || deploymentReport.zipReport?.fileName}</strong> | Czas: {deploymentReport.durationMs}ms | Walidator: <strong className="text-[#00E5FF]">{deploymentReport.validatorNode}</strong>
                </p>
              </div>
            </div>

            {deploymentReport.signatureSeal && (
              <div className="px-3 py-1.5 rounded-lg bg-[#05070D] border border-[#00D9A6]/30 text-[#00D9A6] text-xs flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                <span>Pieczęć: {deploymentReport.signatureSeal}</span>
              </div>
            )}
          </div>

          {/* CI/CD Stages Breadcrumbs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-4">
            {[
              { id: 'STAGE_PACKAGE_RECEIVE', label: '1. Odbiór Pakietu' },
              { id: 'STAGE_ZIP_ANALYZER_NODE', label: '2. ZipAnalyzerNode' },
              { id: 'STAGE_STATIC_ANALYSIS', label: '3. NXL Immutability' },
              { id: 'STAGE_NXL_TRUTH_EVAL', label: '4. Weryfikacja Prawdy' },
              { id: 'STAGE_CONTAINER_IMMUTABILITY_SEAL', label: '5. Pieczęć 0xROOT' }
            ].map((st, idx) => {
              const isDone = deploymentReport.stagesCompleted?.includes(st.id) || (deploymentReport.status === 'DEPLOYED');
              const isFailedStage = !deploymentReport.stagesCompleted?.includes(st.id) && deploymentReport.status !== 'DEPLOYED';

              return (
                <div
                  key={st.id}
                  className={`p-2.5 rounded-lg border text-center text-xs transition-all ${
                    isDone
                      ? 'bg-[#00D9A6]/10 border-[#00D9A6]/40 text-[#00D9A6]'
                      : isFailedStage && idx === (deploymentReport.stagesCompleted?.length || 0)
                      ? 'bg-[#FF3B5C]/20 border-[#FF3B5C] text-[#FF3B5C] animate-pulse font-bold'
                      : 'bg-[#05070D] border-[#121827] text-[#475569]'
                  }`}
                >
                  <div className="text-[10px] font-bold block opacity-70">ETAP {idx + 1}</div>
                  <div className="font-semibold truncate mt-0.5">{st.label}</div>
                  <div className="text-[9px] mt-1">
                    {isDone ? 'ZWALIDOWANY ✓' : isFailedStage && idx === (deploymentReport.stagesCompleted?.length || 0) ? 'ZABLOKOWANY ✕' : 'POMINIĘTY'}
                  </div>
                </div>
              );
            })}
          </div>

          {deploymentReport.error && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#FF3B5C]/20 border border-[#FF3B5C] text-[#FF3B5C] text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold uppercase tracking-wider">NXL_SECURITY_VIOLATION INTERCEPT</div>
                <div className="mt-0.5">{deploymentReport.error}</div>
                {deploymentReport.auditLogId && (
                  <div className="mt-1.5 text-[10px] text-[#FBBF24]">
                    Zdarzenie zarejestrowane w Nexus Audit Log [ID: {deploymentReport.auditLogId}]
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Tabs Content */}
      {activeTab === 'ANALYZER' && (
        <div className="space-y-6">
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
            className={`rounded-2xl p-8 border-2 border-dashed text-center transition-all bg-[#090C16] ${
              dragActive
                ? 'border-[#00E5FF] bg-[#00E5FF]/10 shadow-[0_0_30px_rgba(0,229,255,0.2)]'
                : 'border-[#1A2234] hover:border-[#00E5FF]/40'
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
              <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] mx-auto flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                <UploadCloud className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-wider">
                  Upuść pakiet ZIP lub kliknij, aby załadować
                </p>
                <p className="text-xs text-[#94A3B8] mt-1 max-w-lg mx-auto">
                  ZipAnalyzerNode dokona natychmiastowej dekompresji w pamięci, sprawdzając integralność NXL, brak prób nadpisania rdzenia oraz brak złośliwych skryptów.
                </p>
              </div>
            </label>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-[#FF3B5C]/15 border border-[#FF3B5C]/40 text-[#FF3B5C] text-xs font-mono flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 text-[#FF3B5C]" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Analysis Report View */}
          {report && report.files && (
            <div className="bg-[#090C16] rounded-2xl p-6 border border-[#1A2234] space-y-5 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              {/* Summary Cards */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#121827]">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-white text-base font-mono">{report.fileName}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase ${
                      report.threatsIntercepted === 0
                        ? 'bg-[#00D9A6]/20 text-[#00D9A6] border border-[#00D9A6]/40'
                        : 'bg-[#FF3B5C]/20 text-[#FF3B5C] border border-[#FF3B5C]/40'
                    }`}>
                      {report.threatsIntercepted === 0 ? 'CLEAN (PASS)' : 'NXL_SECURITY_VIOLATION (BLOCKED)'}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] font-mono mt-1">
                    ID Raportu: <strong className="text-white">{report.id}</strong> | Timestamp: {new Date(report.timestamp).toLocaleTimeString()} | Protokół: <strong className="text-[#00E5FF]">{report.violationProtocol || 'NXL_V1'}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-[#05070D] border border-[#121827] text-center min-w-[90px]">
                    <span className="text-[#64748B] block text-[9px] uppercase font-bold">PLIKI</span>
                    <span className="text-white font-bold text-sm">{report.totalFiles}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#05070D] border border-[#121827] text-center min-w-[120px]">
                    <span className="text-[#64748B] block text-[9px] uppercase font-bold">ZAGROŻENIA NXL</span>
                    <span className={`font-bold text-sm ${report.threatsIntercepted > 0 ? 'text-[#FF3B5C]' : 'text-[#00D9A6]'}`}>
                      {report.threatsIntercepted} BLOCKED
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#05070D] border border-[#121827] text-center min-w-[90px]">
                    <span className="text-[#64748B] block text-[9px] uppercase font-bold">ROZMIAR</span>
                    <span className="text-[#00E5FF] font-bold text-sm">{(report.totalSize / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              </div>

              {/* Blocked Reasons Notice */}
              {report.blockedReasons && report.blockedReasons.length > 0 && (
                <div className="p-3.5 rounded-xl bg-[#FF3B5C]/15 border border-[#FF3B5C]/40 text-[#FF3B5C] text-xs space-y-1">
                  <div className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>WYKRYTE NARUSZENIA PROTOKOŁU BEZPIECZEŃSTWA:</span>
                  </div>
                  {report.blockedReasons.map((r, i) => (
                    <div key={i} className="text-[11px] pl-5">• {r}</div>
                  ))}
                </div>
              )}

              {/* Files Details Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
                    Analiza Wewnętrzna Plików w Archiwum
                  </h3>
                  <span className="text-[10px] text-[#64748B]">Weryfikowane przez ZipAnalyzerNode</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#121827]">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="bg-[#05070D] border-b border-[#121827] text-[#64748B] text-[10px] uppercase">
                        <th className="py-2.5 px-3.5">ŚCIEŻKA PLIKU</th>
                        <th className="py-2.5 px-3">ROZMIAR</th>
                        <th className="py-2.5 px-3">SUMA KONTROLNA</th>
                        <th className="py-2.5 px-3">AKCJA OSŁONY NXL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#121827] bg-[#090C16]">
                      {(report.files || []).map((f, i) => (
                        <tr key={i} className="hover:bg-[#0C101C] transition-colors">
                          <td className="py-2.5 px-3.5 text-slate-200">
                            <div className="flex items-center gap-2">
                              <FileText className={`w-4 h-4 ${f.isProtected ? 'text-[#FF3B5C]' : 'text-[#64748B]'}`} />
                              <span className={f.isProtected ? 'text-[#FF3B5C] font-bold' : 'text-slate-200'}>
                                {f.name}
                              </span>
                            </div>
                            {f.threatReason && (
                              <div className="text-[10px] text-[#FF3B5C] pl-6 mt-0.5">
                                ↳ {f.threatReason}
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-[#94A3B8]">{(f.size / 1024).toFixed(2)} KB</td>
                          <td className="py-2.5 px-3 text-[#64748B] text-[11px]">{f.checksum || '0xSHA256'}</td>
                          <td className="py-2.5 px-3">
                            {f.action === 'BLOCKED_IMMUTABLE_NXL' ? (
                              <span className="px-2 py-0.5 rounded bg-[#FF3B5C]/20 text-[#FF3B5C] border border-[#FF3B5C]/40 font-bold text-[10px]">
                                BLOCKED (NXL_SECURITY_VIOLATION)
                              </span>
                            ) : f.action === 'ISOLATED' ? (
                              <span className="px-2 py-0.5 rounded bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/40 font-bold text-[10px]">
                                ISOLATED SCRIPT
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-[#00D9A6]/20 text-[#00D9A6] border border-[#00D9A6]/40 text-[10px]">
                                ALLOWED ✓
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
      )}

      {/* CI/CD Pipeline Visual Tab */}
      {activeTab === 'CICD_PIPELINE' && (
        <div className="bg-[#090C16] rounded-2xl p-6 border border-[#1A2234] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#121827]">
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">
                Architektura Potoku Nexus Quantum CI/CD v3.1.0
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1">
                Każdy pakiet ZIP jest poddawany analizie w locie przez węzeł <strong className="text-[#00E5FF]">ZipAnalyzerNode</strong>.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTriggerCicdDeployment(false)}
                className="px-3 py-1.5 rounded-lg bg-[#00D9A6] text-[#05070D] font-bold text-xs uppercase cursor-pointer"
              >
                Uruchom Test Czysty
              </button>
              <button
                onClick={() => handleTriggerCicdDeployment(true)}
                className="px-3 py-1.5 rounded-lg bg-[#FF3B5C] text-white font-bold text-xs uppercase cursor-pointer"
              >
                Uruchom Test Zagrożenia
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#05070D] border border-[#121827] space-y-2">
              <div className="text-[10px] text-[#00E5FF] font-bold uppercase tracking-wider">WARSTWA 1</div>
              <div className="text-white font-bold text-sm">Walidacja ZipAnalyzerNode</div>
              <p className="text-xs text-[#94A3B8]">
                Inspekcja dekompresyjna, skanowanie rozszerzeń niebezpiecznych (`.sh`, `.bat`, `.exe`) oraz weryfikacja sum SHA256.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#05070D] border border-[#121827] space-y-2">
              <div className="text-[10px] text-[#00D9A6] font-bold uppercase tracking-wider">WARSTWA 2</div>
              <div className="text-white font-bold text-sm">NXL Immutability Shield</div>
              <p className="text-xs text-[#94A3B8]">
                Blokada modyfikacji plików `*.nxl`, `nexus/src/core/`, `genesis.nxl` i zamrożenie mapy stanów jądra.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#05070D] border border-[#121827] space-y-2">
              <div className="text-[10px] text-[#FBBF24] font-bold uppercase tracking-wider">WARSTWA 3</div>
              <div className="text-white font-bold text-sm">Nexus Audit Log</div>
              <p className="text-xs text-[#94A3B8]">
                Rejestracja każdego incydentu <strong className="text-[#FF3B5C]">NXL_SECURITY_VIOLATION</strong> z kryptograficznym ID w dzienniku audytu.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === 'AUDIT_LOG' && (
        <div className="bg-[#090C16] rounded-2xl p-6 border border-[#1A2234] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#121827]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">
                  Nexus Audit Log // Dziennik Zdarzeń Bezpieczeństwa
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Wszystkie operacje CI/CD oraz incydenty naruszeń NXL_SECURITY_VIOLATION
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[#05070D] p-1 rounded-lg border border-[#121827] text-xs">
                <button
                  onClick={() => setAuditFilter('ALL')}
                  className={`px-2.5 py-1 rounded ${auditFilter === 'ALL' ? 'bg-[#00E5FF] text-[#05070D] font-bold' : 'text-[#64748B]'}`}
                >
                  WSZYSTKIE ({auditLogs.length})
                </button>
                <button
                  onClick={() => setAuditFilter('VIOLATIONS')}
                  className={`px-2.5 py-1 rounded ${auditFilter === 'VIOLATIONS' ? 'bg-[#FF3B5C] text-white font-bold' : 'text-[#FF3B5C]'}`}
                >
                  NARUSZENIA (VIOLATIONS)
                </button>
                <button
                  onClick={() => setAuditFilter('SUCCESS')}
                  className={`px-2.5 py-1 rounded ${auditFilter === 'SUCCESS' ? 'bg-[#00D9A6] text-[#05070D] font-bold' : 'text-[#00D9A6]'}`}
                >
                  SUKCESY
                </button>
              </div>

              <button
                onClick={fetchAuditLogs}
                className="p-2 rounded-lg bg-[#05070D] border border-[#121827] text-[#64748B] hover:text-white cursor-pointer"
                title="Odśwież Audyt"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
            {filteredAuditLogs.length === 0 ? (
              <div className="p-8 text-center text-[#64748B] text-xs">
                Brak wpisów audytowych dla wybranego filtra.
              </div>
            ) : (
              filteredAuditLogs.map((log) => {
                const isViolation = log.protocol === 'NXL_SECURITY_VIOLATION' || log.status === 'BLOCKED' || log.severity === 'CRITICAL';

                return (
                  <div
                    key={log.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isViolation
                        ? 'bg-[#FF3B5C]/10 border-[#FF3B5C]/40 text-[#FF3B5C]'
                        : 'bg-[#05070D] border-[#121827] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#121827]/60">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          isViolation
                            ? 'bg-[#FF3B5C] text-white'
                            : 'bg-[#00D9A6]/20 text-[#00D9A6] border border-[#00D9A6]/40'
                        }`}>
                          {log.action}
                        </span>
                        <span className="font-mono text-[#64748B] text-[11px]">{log.id}</span>
                        <span className="text-[10px] text-[#94A3B8]">[{log.authority}]</span>
                      </div>
                      <span className="text-[10px] text-[#64748B] font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="text-xs pt-2 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-[#64748B]">PROTOKÓŁ:</span>
                        <strong className={isViolation ? 'text-[#FF3B5C]' : 'text-[#00E5FF]'}>
                          {log.protocol}
                        </strong>
                        <span className="text-[#64748B] ml-2">CEL:</span>
                        <span className="text-white">{log.target || 'NEXUS CLUSTER'}</span>
                        <span className="text-[#64748B] ml-2">STATUS:</span>
                        <span className={`font-bold ${isViolation ? 'text-[#FF3B5C]' : 'text-[#00D9A6]'}`}>
                          {log.status}
                        </span>
                      </div>

                      {log.details && (
                        <div className="mt-2 p-2 rounded bg-[#000]/40 border border-[#121827] text-[11px] text-[#94A3B8] overflow-x-auto">
                          <pre className="whitespace-pre-wrap">{JSON.stringify(log.details, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
