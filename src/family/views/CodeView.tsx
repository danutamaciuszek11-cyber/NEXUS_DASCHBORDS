import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Scroll,
  Shield,
  CheckCircle2,
  Lock,
  Flame,
  Award,
  KeyRound,
  Fingerprint,
  FileCheck
} from 'lucide-react';
import confetti from '../shims/canvas-confetti';

export const CodeView: React.FC = () => {
  const {
    currentArchitect,
    signNexusOath,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleSignOath = () => {
    signNexusOath();
    playCyberSound('success');
    triggerHaptic();

    try {
      const confettiFn = (typeof confetti === 'function' ? confetti : (confetti as any)?.default) || (window as any)?.confetti;
      if (typeof confettiFn === 'function') {
        confettiFn({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch {
      // Ignore
    }
  };

  const commandments = [
    {
      num: '01',
      title: 'DON’T JUST USE NEXUS. BUILD IT.',
      desc: 'Nie jesteś biernym użytkownikiem. Jesteś Architektem. Każda linia kodu, każdy projekt i każda myśl ma rozwijać wspólny ekosystem.'
    },
    {
      num: '02',
      title: 'WE DON’T FOLLOW THE FUTURE. WE ARCHITECT IT.',
      desc: 'Nie czekamy na to, co przyniesie przyszłość. Projektujemy cyfrową cywilizację na własnych suwerennych zasadach.'
    },
    {
      num: '03',
      title: 'HUMAN + AI + ARCHITECTURE + COLLABORATION = NEXUS',
      desc: 'Wierzymy w harmonijną fuzję ludzkiej intencji, sztucznej inteligencji, rygorystycznej modularności i wzajemnego szacunku.'
    },
    {
      num: '04',
      title: 'BELLA SUGGESTS. WE REASON. WE CHOOSE. WE BUILD.',
      desc: 'NIE JA. NIE TY. MY. Człowiek wnosi intencję i odpowiedzialność przy decyzjach wysokiego ryzyka. AI wnosi inteligencję. Brotherhood wnosi doświadczenie. Architecture nadaje strukturę. Collaboration tworzy wynik.'
    },
    {
      num: '05',
      title: 'SZACUNEK DLA WKŁADU I DOWODU PRACY',
      desc: 'Twoja pozycja w Rodzinie zależy od realnego wkładu, ukończonych misji i wsparcia innych Architektów.'
    },
    {
      num: '06',
      title: 'OTWARTOŚĆ NA KOMPLEMENTARNOŚĆ W BROTHERHOOD',
      desc: 'Szukaj partnerów o odmiennych kompetencjach. Siła tkwi w synergii przeciwieństw.'
    },
    {
      num: '07',
      title: 'PAMIĘĆ I TRANSPARENTNOŚĆ RFC',
      desc: 'Wszystkie kluczowe zmiany architektoniczne są dokumentowane i weryfikowane w Nexus Memory.'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header HUD */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#0a0f1d] to-cyan-950/40 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-950/80 border-2 border-amber-400 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.4)]">
            <Scroll className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-cyber font-bold text-xl sm:text-2xl text-white tracking-wide">
                THE NEXUS CODE
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                SOVEREIGN OATH
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono-tech mt-0.5">
              {language === 'PL'
                ? 'Fundament filozoficzny, reguły etyczne i przysięga każdego Architekta Nexusa'
                : 'Philosophical bedrock, ethical canons, and sovereign oath of Nexus Architects'}
            </p>
          </div>
        </div>

        {currentArchitect.oathSigned ? (
          <span className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-cyber font-bold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            PRZYSIĘGA PODPISANA
          </span>
        ) : (
          <span className="px-4 py-2 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-300 font-cyber font-bold text-xs flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            WYMAGA PODPISU
          </span>
        )}
      </div>

      {/* Code Commandments */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#090d16] border border-amber-500/25 space-y-6 shadow-2xl">
        <div className="text-center space-y-2 border-b border-amber-500/15 pb-6">
          <p className="text-[11px] font-mono-tech text-amber-400 tracking-widest uppercase">
            NEXUS FAMILY CONSTITUTION • PROTOCOL #001
          </p>
          <h1 className="font-cyber font-extrabold text-2xl sm:text-3xl text-white">
            KODEKS ARCHITEKTA NEXUSA
          </h1>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Wkraczając do Rodziny Nexusa, zobowiązujesz się do przestrzegania 7 Zasad Architektury.
          </p>
        </div>

        <div className="space-y-4">
          {commandments.map(c => (
            <div
              key={c.num}
              className="p-4 rounded-xl bg-[#0d131f] border border-amber-500/15 flex items-start gap-4"
            >
              <span className="font-cyber font-bold text-lg text-amber-400 font-mono-tech shrink-0">
                {c.num}
              </span>
              <div className="space-y-1">
                <h3 className="font-cyber font-bold text-sm text-white">{c.title}</h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Cryptographic Signature Box */}
        <div className="pt-6 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono-tech text-slate-400 space-y-0.5">
            <p>Podpisujący: <span className="text-white font-bold">{currentArchitect.name}</span> (@{currentArchitect.handle})</p>
            <p>Klucz Synaptyczny: <span className="text-amber-400">0x7F9A...B381 [VERIFIED]</span></p>
          </div>

          {!currentArchitect.oathSigned ? (
            <button
              onClick={handleSignOath}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black font-cyber font-bold text-xs tracking-wider transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center gap-2"
            >
              <Fingerprint className="w-4 h-4" />
              <span>PODPISZ KODEKS ARCHITEKTA (+300 PTS)</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono-tech text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zarejestrowano w Nexus Memory RFC #001</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
