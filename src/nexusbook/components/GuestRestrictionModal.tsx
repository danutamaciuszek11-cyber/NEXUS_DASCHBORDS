import React from 'react';
import { ShieldAlert, LogIn, X, Eye, Lock } from 'lucide-react';
import { soundFx } from '../utils/audioSystem';

interface GuestRestrictionModalProps {
  actionTitle?: string;
  actionDescription?: string;
  onOpenLogin: () => void;
  onClose: () => void;
}

export const GuestRestrictionModal: React.FC<GuestRestrictionModalProps> = ({
  actionTitle = 'Operacja w Rejestrze Nexusa',
  actionDescription = 'W trybie gościa dostęp do modyfikacji, publikacji oraz zapisu danych jest zablokowany.',
  onOpenLogin,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-[#090a12] border border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.25)] p-6 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        {/* Close button */}
        <button
          onClick={() => {
            soundFx.playModalClose();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          title="Zamknij powiadomienie"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                OD S T Ę P   Z A B L O K O W A N Y
              </span>
            </div>
            <h2 className="text-base font-bold text-white tracking-wide mt-1">
              Ograniczenie Trybu Gościa [READ-ONLY]
            </h2>
          </div>
        </div>

        {/* Action context details */}
        <div className="rounded-xl bg-amber-950/30 border border-amber-500/20 p-4 mb-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Akcja: {actionTitle}</span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed font-sans">
            {actionDescription}
          </p>
          <div className="text-[11px] font-mono text-amber-300/70 border-t border-amber-500/20 pt-2 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>W trybie gościa możesz swobodnie czytać i eksplorować archiwum.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              soundFx.playModalOpen();
              onOpenLogin();
            }}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Zaloguj się jako Pilot</span>
          </button>

          <button
            onClick={() => {
              soundFx.playModalClose();
              onClose();
            }}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-mono text-xs transition-colors cursor-pointer"
          >
            Kontynuuj jako Gość
          </button>
        </div>
      </div>
    </div>
  );
};
