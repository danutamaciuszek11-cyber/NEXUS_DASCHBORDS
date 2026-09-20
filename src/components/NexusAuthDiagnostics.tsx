import React, { useEffect, useState } from 'react';
import { NexusAuthDiagnosticsData, getAuthDiagnostics } from '../core/firebase';
import { eventBus } from '../core/event-bus';
import { Shield, AlertTriangle, CheckCircle, Activity, Globe, X } from 'lucide-react';

interface NexusAuthDiagnosticsProps {
  onClose?: () => void;
  inline?: boolean;
}

export const NexusAuthDiagnostics: React.FC<NexusAuthDiagnosticsProps> = ({ onClose, inline = false }) => {
  const [diag, setDiag] = useState<NexusAuthDiagnosticsData>(getAuthDiagnostics());

  useEffect(() => {
    const unsub = eventBus.on<NexusAuthDiagnosticsData>('auth:diagnostics', (data) => {
      setDiag({ ...data });
    });
    setDiag(getAuthDiagnostics());
    return () => {
      if (typeof unsub === 'function') {
        try { unsub(); } catch {}
      }
    };
  }, []);

  const content = (
    <div className="font-mono-tech space-y-4">
      <div className="flex items-center justify-between border-b border-[#1A2234] pb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#00E5FF]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            NEXUS AUTH DIAGNOSTICS
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
            ENV: DEV/PREVIEW
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="text-[#64748B] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Provider */}
        <div className="p-2.5 bg-[#05070D] border border-[#121827] rounded">
          <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">AUTH PROVIDER</span>
          <span className="text-white font-bold">{diag.provider}</span>
        </div>

        {/* Initialization */}
        <div className="p-2.5 bg-[#05070D] border border-[#121827] rounded">
          <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">AUTH INITIALIZED</span>
          <span className="flex items-center gap-1.5 font-bold text-[#00D9A6]">
            <CheckCircle className="w-3.5 h-3.5" />
            {diag.initialized}
          </span>
        </div>

        {/* Config Status */}
        <div className="p-2.5 bg-[#05070D] border border-[#121827] rounded">
          <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">CONFIG STATUS</span>
          <span className={`font-bold ${diag.configStatus === 'OK' ? 'text-[#00D9A6]' : 'text-[#FF3B5C]'}`}>
            {diag.configStatus} (Project: {diag.projectId})
          </span>
        </div>

        {/* Current User */}
        <div className="p-2.5 bg-[#05070D] border border-[#121827] rounded">
          <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">CURRENT USER</span>
          <span className={`font-bold truncate block ${diag.currentUser === 'UNAUTHENTICATED' ? 'text-[#94A3B8]' : 'text-[#00E5FF]'}`}>
            {diag.currentUser}
          </span>
        </div>

        {/* Auth State */}
        <div className="p-2.5 bg-[#05070D] border border-[#121827] rounded">
          <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">AUTH STATE</span>
          <span className={`font-bold flex items-center gap-1.5 ${
            diag.authState === 'AUTHENTICATED'
              ? 'text-[#00D9A6]'
              : diag.authState === 'AUTH_ERROR'
              ? 'text-[#FF3B5C]'
              : diag.authState === 'AUTH_LOADING'
              ? 'text-[#00E5FF]'
              : 'text-[#94A3B8]'
          }`}>
            <Activity className="w-3.5 h-3.5" />
            {diag.authState}
          </span>
        </div>

        {/* Last Auth Event */}
        <div className="p-2.5 bg-[#05070D] border border-[#121827] rounded">
          <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">LAST AUTH EVENT</span>
          <span className="text-[#A855F7] font-bold truncate block">{diag.lastEvent}</span>
        </div>
      </div>

      {/* Last Auth Error */}
      <div className="p-2.5 bg-[#05070D] border border-[#121827] rounded">
        <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">LAST AUTH ERROR</span>
        {diag.lastError ? (
          <div className="space-y-1 mt-1">
            <span className="text-xs font-bold text-[#FF3B5C] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              {diag.lastError}
            </span>
            {diag.lastErrorFriendly && (
              <p className="text-[11px] text-[#CBD5E1]">{diag.lastErrorFriendly}</p>
            )}
          </div>
        ) : (
          <span className="text-xs text-[#64748B] font-mono-tech mt-1 block">None (No errors recorded)</span>
        )}
      </div>

      {/* Domain Verification Notice */}
      <div className="p-2.5 bg-[#05070D] border border-[#121827] rounded">
        <div className="flex items-center justify-between text-[10px] text-[#64748B] uppercase tracking-wider mb-1">
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-[#00E5FF]" />
            CURRENT HOSTNAME
          </span>
          <span className={diag.isDomainAuthorizedGuess ? 'text-[#00D9A6]' : 'text-amber-400'}>
            {diag.isDomainAuthorizedGuess ? 'LOCAL / FIREBASE HOST' : 'EXTERNAL / CLOUD RUN'}
          </span>
        </div>
        <div className="text-xs text-[#CBD5E1] break-all bg-[#090C16] p-1.5 rounded border border-[#1A2234]">
          {diag.currentDomain}
        </div>
        {!diag.isDomainAuthorizedGuess && (
          <div className="text-[10px] text-[#94A3B8] mt-1.5 leading-relaxed">
            Wymóg Firebase dla logowania Google: Domena <code className="text-[#00E5FF]">{diag.currentDomain}</code> musi znajdować się w konsoli Firebase &rarr; Authentication &rarr; Settings &rarr; Authorized domains.
          </div>
        )}
      </div>
    </div>
  );

  if (inline) {
    return <div className="bg-[#090C16] border border-[#1A2234] rounded-xl p-4">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#090C16] border border-[#00E5FF]/40 rounded-xl p-5 max-w-lg w-full shadow-[0_0_40px_rgba(0,229,255,0.2)]">
        {content}
      </div>
    </div>
  );
};
