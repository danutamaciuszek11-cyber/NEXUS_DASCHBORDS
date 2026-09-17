import React from 'react';
import { ModuleConflict } from '../core/types';

interface ZipInstallModalProps {
  currentStep: string;
  error?: string;
  conflict?: ModuleConflict;
  onReplace?: () => void;
  onClose: () => void;
}

const ORDERED_STAGES = [
  'PACKAGE RECEIVED',
  'VALIDATING ZIP',
  'VALIDATING MANIFEST',
  'EXTRACTING FILES',
  'REGISTERING MODULE',
  'GENERATING TILE',
  'MODULE READY',
];

export const ZipInstallModal: React.FC<ZipInstallModalProps> = ({
  currentStep,
  error,
  conflict,
  onReplace = () => {},
  onClose = () => {},
}) => {
  const isComplete = currentStep === 'MODULE READY';
  const hasError = !!error && !conflict;
  const isConflict = !!conflict;

  const currentIdx = ORDERED_STAGES.indexOf(currentStep);
  const progressPercent = hasError
    ? 100
    : isConflict
    ? 75
    : isComplete
    ? 100
    : Math.max(12, Math.round(((currentIdx + 1) / ORDERED_STAGES.length) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-[#05070D]/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-[#090C16] border border-[#00E5FF]/40 rounded-xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_25px_rgba(0,229,255,0.15)] font-mono-tech">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#121827]">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                hasError
                  ? 'bg-[#FF3B5C] shadow-[0_0_8px_#FF3B5C]'
                  : isConflict
                  ? 'bg-[#FBBF24] shadow-[0_0_8px_#FBBF24]'
                  : 'bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]'
              }`}
            />
            <h3 className="text-white text-xs font-bold tracking-[0.2em] uppercase">
              NEXUS PACKAGE ENGINE
            </h3>
          </div>
          {(isComplete || hasError || isConflict) && (
            <button
              onClick={onClose}
              className="text-[#64748B] hover:text-white text-xs cursor-pointer px-1.5 py-0.5"
            >
              ✕
            </button>
          )}
        </div>

        {/* Global Progress Bar */}
        <div className="mb-5 bg-[#05070D] border border-[#121827] rounded-full h-2 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              hasError
                ? 'bg-[#FF3B5C]'
                : isConflict
                ? 'bg-[#FBBF24]'
                : isComplete
                ? 'bg-[#00D9A6] shadow-[0_0_10px_#00D9A6]'
                : 'bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Conflict UI: Module Already Installed */}
        {isConflict && conflict && (
          <div className="p-4 bg-[#0C101C] border border-[#FBBF24]/50 rounded-lg text-left my-4 space-y-3">
            <div className="flex items-center gap-2 text-[#FBBF24] text-xs font-bold uppercase tracking-wider">
              <span>⚠</span> MODULE ALREADY INSTALLED
            </div>
            <div className="text-[11px] text-[#94A3B8] space-y-1">
              <div>
                ID: <strong className="text-white">{conflict.existingModule.id}</strong>
              </div>
              <div>
                NAME: <strong className="text-white">{conflict.existingModule.name}</strong>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#121827]">
                <div className="bg-[#05070D] p-2 rounded border border-[#121827]">
                  <span className="text-[9px] text-[#64748B] block">VERSION INSTALLED:</span>
                  <span className="text-[#00E5FF] font-bold text-xs">{conflict.existingModule.version}</span>
                </div>
                <div className="bg-[#05070D] p-2 rounded border border-[#121827]">
                  <span className="text-[9px] text-[#64748B] block">VERSION PACKAGE:</span>
                  <span className="text-[#00D9A6] font-bold text-xs">{conflict.newManifest.version}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                id="conflict-replace-btn"
                onClick={onReplace}
                className="flex-1 py-2 rounded bg-[#FBBF24] text-[#05070D] hover:bg-[#FBBF24]/90 text-xs font-bold tracking-wider uppercase cursor-pointer"
              >
                UPDATE MODULE
              </button>
              <button
                id="conflict-cancel-btn"
                onClick={onClose}
                className="flex-1 py-2 rounded bg-[#090C16] border border-[#121827] text-[#94A3B8] hover:text-white text-xs font-bold tracking-wider uppercase cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Visual Stages List */}
        {!isConflict && (
          <div className="space-y-2.5 my-4">
            {ORDERED_STAGES.map((stageName, idx) => {
              const isDone = (currentIdx > idx && !hasError) || isComplete;
              const isCurrent = currentStep === stageName && !hasError;

              let badgeBg = 'bg-[#0C101C]';
              let borderColor = 'border-[#121827]';
              let textColor = 'text-[#475569]';
              let indicator = `${idx + 1}`;

              if (isDone) {
                badgeBg = 'bg-[#00D9A6]/10';
                borderColor = 'border-[#00D9A6]/40';
                textColor = 'text-[#00D9A6]';
                indicator = '✓';
              } else if (isCurrent) {
                badgeBg = 'bg-[#00E5FF]/15';
                borderColor = 'border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.2)]';
                textColor = 'text-[#00E5FF]';
                indicator = '●';
              }

              return (
                <div
                  key={stageName}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${badgeBg} ${borderColor}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                        isDone
                          ? 'text-[#00D9A6]'
                          : isCurrent
                          ? 'text-[#00E5FF] animate-pulse'
                          : 'text-[#475569]'
                      }`}
                    >
                      {indicator}
                    </div>
                    <span className={`text-[11px] tracking-wider uppercase font-semibold ${textColor}`}>
                      {stageName}
                    </span>
                  </div>

                  <div className="text-[10px]">
                    {isCurrent && (
                      <span className="text-[#00E5FF] flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" />
                        EXECUTING...
                      </span>
                    )}
                    {isDone && <span className="text-[#00D9A6] font-bold">COMPLETED</span>}
                    {!isDone && !isCurrent && <span className="text-[#334155]">QUEUED</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Error notification */}
        {hasError && (
          <div className="p-3.5 bg-[#FF3B5C]/10 border border-[#FF3B5C]/40 rounded-lg text-[#FF3B5C] text-xs leading-relaxed mt-4">
            <div className="font-bold flex items-center gap-2 mb-1">
              <span>✕</span> [ PIPELINE FAILURE ]
            </div>
            <div>{error}</div>
          </div>
        )}

        {/* Action Button */}
        {(isComplete || hasError) && !isConflict && (
          <button
            id="close-install-modal-btn"
            onClick={onClose}
            className={`w-full mt-4 py-2.5 rounded text-xs tracking-widest uppercase font-bold transition-all cursor-pointer ${
              hasError
                ? 'bg-[#FF3B5C]/20 border border-[#FF3B5C] text-[#FF3B5C] hover:bg-[#FF3B5C] hover:text-white'
                : 'bg-[#00E5FF] text-[#05070D] hover:bg-[#00E5FF]/90 shadow-[0_0_20px_rgba(0,229,255,0.4)]'
            }`}
          >
            {hasError ? 'DISMISS PIPELINE' : '● MODULE READY — ENTER SUBSYSTEM'}
          </button>
        )}
      </div>
    </div>
  );
};
