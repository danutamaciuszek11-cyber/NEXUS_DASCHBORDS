import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  KeyRound,
  Shield,
  Sparkles,
  Send,
  CheckCircle2,
  Lock,
  ArrowRight,
  Code,
  Cpu,
  Flame
} from 'lucide-react';
import { Specialization } from '../types';

export const RequestAccessView: React.FC = () => {
  const {
    submitAccessRequest,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [selectedSpecs, setSelectedSpecs] = useState<Specialization[]>(['CODE', 'AI']);
  const [whyJoin, setWhyJoin] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const availableSpecs: Specialization[] = ['CODE', 'AI', 'DESIGN', 'WRITING', 'MUSIC', 'WEB3', 'RESEARCH', 'ARCHITECTURE'];

  const toggleSpec = (spec: Specialization) => {
    if (selectedSpecs.includes(spec)) {
      setSelectedSpecs(selectedSpecs.filter(s => s !== spec));
    } else {
      setSelectedSpecs([...selectedSpecs, spec]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !whyJoin.trim()) return;

    submitAccessRequest({
      fullName: name.trim(),
      email: email.trim(),
      handle: handle.trim() || name.toLowerCase().replace(/\s+/g, ''),
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      interests: skills.split(',').map(s => s.trim()).filter(Boolean),
      specializations: selectedSpecs,
      targetWorlds: ['world-code', 'world-cyber'],
      proposal: (bio.trim() + (portfolioUrl.trim() ? ` [Portfolio: ${portfolioUrl.trim()}]` : '')).trim() || 'Nexus builder contribution proposal',
      whyNexus: whyJoin.trim()
    });

    setIsSubmitted(true);
    playCyberSound('success');
    triggerHaptic();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      {/* Header HUD */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#0a0f1d] to-cyan-950/40 border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-950/80 border-2 border-purple-400 text-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.4)]">
            <KeyRound className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-cyber font-bold text-xl sm:text-2xl text-white tracking-wide">
                JOIN THE ARCHITECTS
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                APPLICATION GATEWAY
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono-tech mt-0.5">
              {language === 'PL'
                ? 'NEXUS FAMILY to zamknięty krąg. Zgłoś swoją kandydaturę lub wprowadź kod zaproszenia.'
                : 'NEXUS FAMILY is an invite & merit gated brotherhood. Apply for access or redeem an invite.'}
            </p>
          </div>
        </div>
      </div>

      {isSubmitted ? (
        <div className="p-8 rounded-2xl bg-[#090d16] border border-cyan-400 text-center space-y-4 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
          <div className="w-16 h-16 mx-auto rounded-full bg-cyan-950 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center shadow-[0_0_20px_#00f0ff]">
            <CheckCircle2 className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="font-cyber font-bold text-xl text-white">
            ZGŁOSZENIE ZOSTAŁO PRZYJĘTE
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-md mx-auto leading-relaxed">
            Twoja aplikacja została zarejestrowana w węźle weryfikacyjnym State Bella oraz przesłana do Moderatora Rodziny.
            Otrzymasz powiadomienie po weryfikacji.
          </p>
          <div className="pt-2">
            <span className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono-tech">
              STATUS: PENDING REVIEW
            </span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-[#090d16] border border-cyan-500/25 space-y-6 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono-tech text-slate-400">
                Imię i Nazwisko / Pseudonim *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="np. Aleksander Vane"
                className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono-tech text-slate-400">
                Adres E-mail *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="arch@nexusfamily.com"
                className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono-tech text-slate-400">
                Uchwyt / Handle (@)
              </label>
              <input
                type="text"
                value={handle}
                onChange={e => setHandle(e.target.value)}
                placeholder="np. cyber_arch"
                className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono-tech text-slate-400">
                Kod Zaproszenia (jeśli posiadasz)
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value)}
                placeholder="NEXUS-INV-XXXX"
                className="w-full bg-[#0d131f] border border-purple-500/30 focus:border-purple-400 rounded-xl px-3.5 py-2 text-xs text-purple-300 placeholder-slate-500 focus:outline-none font-mono-tech"
              />
            </div>
          </div>

          {/* Specializations selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono-tech text-slate-400">
              Główne Specjalizacje Architektoniczne
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSpecs.map(sp => {
                const isSelected = selectedSpecs.includes(sp);
                return (
                  <button
                    type="button"
                    key={sp}
                    onClick={() => toggleSpec(sp)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono-tech transition-all ${
                      isSelected
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400 font-bold'
                        : 'bg-[#0d131f] text-slate-400 border border-cyan-500/10 hover:text-white'
                    }`}
                  >
                    {sp}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono-tech text-slate-400">
              Umiejętności Techniczne (oddzielone przecinkami)
            </label>
            <input
              type="text"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="TypeScript, Python, LLM Tuning, UI Ergonomics, Smart Contracts..."
              className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono-tech text-slate-400">
              Dlaczego chcesz współtworzyć NEXUS i co chcesz zbudować? *
            </label>
            <textarea
              required
              rows={4}
              value={whyJoin}
              onChange={e => setWhyJoin(e.target.value)}
              placeholder="Opisz swoje doświadczenie, wizję oraz konkretny moduł lub świat, w który chcesz włożyć swój wkład..."
              className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono-tech text-slate-400">
              Link do Portfolio / GitHub / Projektów
            </label>
            <input
              type="url"
              value={portfolioUrl}
              onChange={e => setPortfolioUrl(e.target.value)}
              placeholder="https://github.com/twoj-profil"
              className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-black font-cyber font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>PRZEŚLIJ APLIKACJĘ DO RADY ARCHITEKTÓW</span>
          </button>
        </form>
      )}
    </div>
  );
};
