import React, { useState } from 'react';
import { Download, Share2, X, Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { soundFx } from '../utils/audioSystem';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={() => {
          soundFx.playClick();
          install();
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        title="Zainstaluj NexusBook jako aplikację PWA"
      >
        <Download className="w-3.5 h-3.5 text-black" />
        <span className="hidden sm:inline">INSTALUJ PWA</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => {
            soundFx.playClick();
            setShowIOSGuide(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 font-mono text-xs font-bold transition-all cursor-pointer"
          title="Zainstaluj na iOS"
        >
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">PWA iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-cyan-500/40 p-6 shadow-2xl space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>Instalacja PWA na iOS</span>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-white/60 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-slate-300 text-[11px] leading-relaxed">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 font-bold">1</span>
                  <p>Dotknij przycisku <strong>Udostępnij (Share)</strong> na dolnym pasku przeglądarki Safari.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 font-bold">2</span>
                  <p>Przewiń w dół i wybierz <strong>Do ekranu początkowego (Add to Home Screen)</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 font-bold">3</span>
                  <p>Kliknij <strong>Dodaj</strong> w prawym górnym rogu. Aplikacja NexusBook będzie działać offline!</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-colors cursor-pointer"
              >
                Rozumiem
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
