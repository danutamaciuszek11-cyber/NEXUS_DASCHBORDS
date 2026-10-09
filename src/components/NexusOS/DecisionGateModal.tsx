import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, Clock, Cpu, Lock, FileText, ArrowRight } from 'lucide-react';
import { DecisionProposal } from '../../nexus/core/decision/types';

interface DecisionGateModalProps {
  proposal: DecisionProposal | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (proposalId: string, approverActorId: string, signature: string) => void;
  onReject: (proposalId: string, actorId: string, reason: string) => void;
}

export const DecisionGateModal: React.FC<DecisionGateModalProps> = ({
  proposal,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [approverSeal, setApproverSeal] = useState('0xROOT_MACIEJ_ARCHITECT_SEAL_9918');

  if (!isOpen || !proposal) return null;

  const handleApprove = () => {
    onApprove(proposal.proposalId, 'Maciej_Architekt', approverSeal);
    onClose();
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    onReject(proposal.proposalId, 'Maciej_Architekt', rejectReason);
    setIsRejecting(false);
    setRejectReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-[#090C16] border border-[#00E5FF]/40 rounded-2xl shadow-[0_0_35px_rgba(0,229,255,0.2)] overflow-hidden font-mono-tech flex flex-col text-white">
        
        {/* Header / Constitutional Banner */}
        <div className="bg-gradient-to-r from-[#00E5FF]/15 via-[#A855F7]/15 to-[#00D9A6]/15 border-b border-[#00E5FF]/30 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider text-white">HUMAN DECISION GATE</h2>
              <p className="text-[10px] text-[#00E5FF] tracking-widest uppercase">
                BELLA SUGERUJE. LUDZIE WYBIERAJĄ.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-white/5 border border-white/10"
          >
            ESC
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">

          {/* Section 1: AI SUGGESTION */}
          <div className="border border-[#A855F7]/30 bg-[#A855F7]/5 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#A855F7]/20 pb-2">
              <span className="text-xs font-bold text-[#A855F7] flex items-center gap-2">
                <Cpu className="w-4 h-4" /> // 1. AI SUGGESTION (REKOMENDACJA SYSTEMOWA)
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${
                proposal.riskLevel === 'CRITICAL' || proposal.riskLevel === 'HIGH'
                  ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                  : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
              }`}>
                RYZYKO: {proposal.riskLevel}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">// AKTOR PROPONUJĄCY:</span>
                <span className="text-white font-semibold">{proposal.actorId} ({proposal.actorType})</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">// AKCJA I CEL:</span>
                <span className="text-[#00E5FF] font-semibold">{proposal.action} &rarr; {proposal.target}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block">// UZASADNIENIE (REASON):</span>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed bg-black/40 p-2.5 rounded border border-white/5">
                {proposal.reason}
              </p>
            </div>

            {proposal.evidence && proposal.evidence.length > 0 && (
              <div>
                <span className="text-[10px] text-slate-400 block">// DOWODY & EVIDENCE TRACE:</span>
                <div className="text-[11px] text-slate-300 mt-1 bg-black/50 p-2 rounded border border-white/5 space-y-1">
                  {proposal.evidence.map((ev, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-[#00D9A6]" />
                      <span>{ev.truthReport?.assertion || JSON.stringify(ev.details || {})}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-400">Pewność modelu (Confidence):</span>
              <span className="text-[#00D9A6] font-bold">{(proposal.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Wymagane uprawnienie (Capability):</span>
              <span className="text-cyan-300 font-bold">{proposal.requiredCapability}</span>
            </div>
          </div>

          {/* Section 2: HUMAN DECISION */}
          <div className="border border-[#00E5FF]/40 bg-[#00E5FF]/5 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#00E5FF]/20 pb-2">
              <span className="text-xs font-bold text-[#00E5FF] flex items-center gap-2">
                <Lock className="w-4 h-4" /> // 2. HUMAN DECISION (SUWERENNY WYBÓR CZŁOWIEKA)
              </span>
              <span className="text-[10px] text-slate-400">STATUS: {proposal.status}</span>
            </div>

            <p className="text-[11px] text-slate-300">
              Zgodnie z regułą Separation of Duties: Proposer != Approver. Decyzja nie zostanie wykonana bez zatwierdzenia przez Biooperatora.
            </p>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">PIECZĘĆ AUTORYZACYJNA (AUTHORIZATION SEAL):</label>
              <input
                type="text"
                value={approverSeal}
                onChange={(e) => setApproverSeal(e.target.value)}
                className="w-full bg-black/60 border border-[#00E5FF]/30 rounded px-2.5 py-1.5 text-xs text-[#00E5FF] focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            {isRejecting ? (
              <div className="space-y-2 pt-2">
                <label className="text-[10px] text-rose-400 block">PODAJ POWÓD ODRZUCENIA (REJECTION REASON):</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Wpisz powód odrzucenia wniosku..."
                  className="w-full bg-black/70 border border-rose-500/40 rounded p-2 text-xs text-white focus:outline-none"
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsRejecting(false)}
                    className="px-3 py-1 text-xs rounded bg-white/5 hover:bg-white/10 text-slate-300"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!rejectReason.trim()}
                    className="px-3 py-1 text-xs rounded bg-rose-600 hover:bg-rose-500 text-white font-bold disabled:opacity-50"
                  >
                    Zatwierdź Odrzucenie
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsRejecting(true)}
                  className="px-4 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>ODRZUĆ (REJECT)</span>
                </button>
                <button
                  onClick={handleApprove}
                  className="px-5 py-2 rounded-lg bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 border border-[#00E5FF] text-[#00E5FF] hover:text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>AUTORYZUJ I WYKONAJ (APPROVE)</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
