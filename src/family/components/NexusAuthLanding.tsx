import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  ShieldCheck,
  Zap,
  Sparkles,
  Lock,
  ArrowRight,
  Code2,
  Cpu,
  Globe2,
  Users2,
  Flame,
  CheckCircle2,
  Terminal,
  Activity,
  User,
  Layers,
  Fingerprint
} from 'lucide-react';

export const NexusAuthLanding: React.FC = () => {
  const {
    loginWithGoogle,
    loginWithFirebaseGoogle,
    loginWithArchitect,
    autoLoginEnabled,
    setAutoLoginEnabled,
    architects,
    language,
    setLanguage,
    soundEnabled,
    setSoundEnabled,
    playCyberSound,
    triggerHaptic,
    telemetry
  } = useNexus();

  const [customEmail, setCustomEmail] = useState('laciatyplas@gmail.com');
  const [customName, setCustomName] = useState('Krystian (Nexus Founder)');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedArchId, setSelectedArchId] = useState<string>('arch-1');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState<'IDLE' | 'VERIFYING_GOOGLE' | 'SYNAPSE_SYNC' | 'AUTHORIZED'>('IDLE');

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthStep('VERIFYING_GOOGLE');
    playCyberSound('synapse');
    triggerHaptic();

    try {
      await loginWithFirebaseGoogle();
      setAuthStep('AUTHORIZED');
      playCyberSound('success');
      triggerHaptic();
    } catch {
      setTimeout(() => {
        setAuthStep('SYNAPSE_SYNC');
        playCyberSound('node');

        setTimeout(() => {
          setAuthStep('AUTHORIZED');
          playCyberSound('success');
          triggerHaptic();

          setTimeout(() => {
            loginWithGoogle({
              email: customEmail.trim() || 'laciatyplas@gmail.com',
              name: customName.trim() || 'Krystian (Nexus Founder)',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
              handle: `@${(customEmail.split('@')[0] || 'krystian').toLowerCase().replace(/[^a-z0-9_]/g, '')}`
            });
          }, 350);
        }, 500);
      }, 600);
    }
  };

  const handleArchitectDirectLogin = (archId: string) => {
    setIsAuthenticating(true);
    setAuthStep('SYNAPSE_SYNC');
    playCyberSound('node');
    triggerHaptic();

    setTimeout(() => {
      setAuthStep('AUTHORIZED');
      playCyberSound('success');

      setTimeout(() => {
        loginWithArchitect(archId);
      }, 350);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-black">
      {/* Background Cyber Grid & Neural Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[160px]" />
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px]" />
        
        {/* Subtle Matrix / Circuit Line Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(0, 240, 255, 0.4) 2%, transparent 0%), linear-gradient(to right, rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px, 80px 80px, 80px 80px'
          }}
        />
      </div>

      {/* Top Cyber HUD Bar */}
      <header className="relative z-20 border-b border-cyan-500/20 bg-[#060911]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Cpu className="w-5 h-5 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cyber font-black text-lg tracking-wider text-white">NEXUS</span>
              <span className="text-xs px-2 py-0.5 rounded font-mono-tech tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                FAMILY
              </span>
            </div>
            <p className="text-[10px] font-mono-tech text-slate-400">
              [CIVILIZATION ARCHITECTURE SUITE // GATE 01]
            </p>
          </div>
        </div>

        {/* System Status & Utility Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono-tech">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>BELLA SYNAPSE ONLINE (99.4%)</span>
          </div>

          <button
            onClick={() => {
              const next = language === 'PL' ? 'EN' : 'PL';
              setLanguage(next);
              playCyberSound('click');
            }}
            className="px-2.5 py-1 rounded-lg bg-[#0c121e] border border-cyan-500/25 text-xs font-mono-tech text-cyan-300 hover:border-cyan-400 hover:text-white transition-colors"
            title="Toggle Language"
          >
            {language}
          </button>
        </div>
      </header>

      {/* Main Authentication & Mission Canvas */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-10 gap-8 items-center justify-center">
        
        {/* Left Column: The Sovereign Mission & Manifesto */}
        <div className="flex-1 flex flex-col justify-center space-y-6 max-w-2xl">
          {/* Restricted Entrance Notice */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 text-xs font-mono-tech w-fit backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {language === 'PL'
                ? 'WYMAGANA AUTORYZACJA ARCHITEKTA • PRZYSTĘP DO SYSTEMU'
                : 'ARCHITECT AUTHORIZATION REQUIRED • ACCESS GATE'}
            </span>
          </div>

          {/* Primary Statement: "Architekci to Budowniczowie" */}
          <div>
            <h1 className="font-cyber font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              {language === 'PL' ? (
                <>
                  Architekci to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200">Budowniczowie.</span>
                  <br />
                  <span className="text-slate-200 font-bold text-2xl sm:text-3xl lg:text-4xl">
                    To nie miejsce scrollowania. To kuźnia tworzenia.
                  </span>
                </>
              ) : (
                <>
                  Architects are <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200">Builders.</span>
                  <br />
                  <span className="text-slate-200 font-bold text-2xl sm:text-3xl lg:text-4xl">
                    Not a feed to scroll. A forge to create.
                  </span>
                </>
              )}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-4 font-sans max-w-xl">
              {language === 'PL'
                ? 'Nexus Family to suwerenna platforma dla ludzi czynu — inżynierów, designerów, badaczy i myślicieli budujących fundamenty 9 Światów Cyfrowej Cywilizacji. 0% pustego szumu algorytmicznego, 100% głębokiej pracy, kodu, misji i realnego wkładu.'
                : 'Nexus Family is a sovereign platform for makers — engineers, designers, researchers, and thinkers building the foundation of 9 Digital Civilization Worlds. 0% feed noise, 100% deep focus, code, missions, and tangible contribution.'}
            </p>
          </div>

          {/* 4 Core Civilization Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-3.5 rounded-xl bg-[#090d16]/80 border border-cyan-500/20 hover:border-cyan-400/40 transition-colors">
              <div className="flex items-center gap-2.5 text-cyan-300 font-cyber font-bold text-xs">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>{language === 'PL' ? 'Twórz, nie konsumuj' : 'Build, Never Consume'}</span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-1.5 leading-normal">
                {language === 'PL'
                  ? 'Każda interakcja ma cel: commits, misje, projekty, dokumenty RFC i patenty.'
                  : 'Every interaction yields output: commits, bounties, projects, RFC docs, and patents.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090d16]/80 border border-purple-500/20 hover:border-purple-400/40 transition-colors">
              <div className="flex items-center gap-2.5 text-purple-300 font-cyber font-bold text-xs">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>{language === 'PL' ? 'State Bella (Human + AI)' : 'State Bella (Human + AI)'}</span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-1.5 leading-normal">
                {language === 'PL'
                  ? 'Orkiestracja talentów i parowanie 1-on-1: Bella sugeruje, Człowiek decyduje.'
                  : 'Talent orchestration & 1-on-1 pairing: Bella suggests, Humans choose.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090d16]/80 border border-emerald-500/20 hover:border-emerald-400/40 transition-colors">
              <div className="flex items-center gap-2.5 text-emerald-300 font-cyber font-bold text-xs">
                <Globe2 className="w-4 h-4 text-emerald-400" />
                <span>{language === 'PL' ? '9 Światów Cywilizacji' : '9 Civilization Worlds'}</span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-1.5 leading-normal">
                {language === 'PL'
                  ? 'Od Dev Hub po Bio-Sintezę, Sztukę i Wolne Systemy Operacyjne.'
                  : 'From Dev Hub to Bio-Synthesis, Art, and Sovereign Operating Systems.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090d16]/80 border border-amber-500/20 hover:border-amber-400/40 transition-colors">
              <div className="flex items-center gap-2.5 text-amber-300 font-cyber font-bold text-xs">
                <Users2 className="w-4 h-4 text-amber-400" />
                <span>{language === 'PL' ? 'Brotherhood Engine' : 'Brotherhood Engine'}</span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-1.5 leading-normal">
                {language === 'PL'
                  ? 'Współpraca komplementarnych inżynierów w tandemach zamiast samotnej walki.'
                  : 'Complementary talent pairings in sovereign nodes instead of solo grind.'}
              </p>
            </div>
          </div>

          {/* Real-time Telemetry strip */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono-tech text-slate-400 pt-2 border-t border-cyan-500/15">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{telemetry.activeArchitects} {language === 'PL' ? 'Architektów Online' : 'Architects Online'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-400">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>9 {language === 'PL' ? 'Światów Aktywnych' : 'Worlds Active'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'PL' ? '0% Reklam / 100% Suwerenności' : '0% Ads / 100% Sovereign'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Google Authentication Gate */}
        <div className="w-full lg:w-[440px]">
          <div className="rounded-2xl bg-[#080c16]/95 border border-cyan-500/30 p-6 sm:p-7 shadow-[0_0_50px_rgba(0,240,255,0.15)] backdrop-blur-2xl relative overflow-hidden">
            
            {/* Top Gate Status Bar */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-cyber font-bold text-white tracking-wider">
                  {language === 'PL' ? 'BRAMA UWIERZYTELNIANIA' : 'AUTHENTICATION GATE'}
                </span>
              </div>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                GOOGLE AUTH v2.4
              </span>
            </div>

            {/* Authentication Progress State Overlay */}
            {isAuthenticating ? (
              <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-950/90 border border-cyan-400/60 shadow-[0_0_30px_rgba(0,240,255,0.5)] animate-pulse">
                  <Cpu className="w-8 h-8 text-cyan-300 animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-cyber font-bold text-white tracking-wider">
                    {authStep === 'VERIFYING_GOOGLE' && (language === 'PL' ? 'WERYFIKACJA KONTA GOOGLE...' : 'VERIFYING GOOGLE ACCOUNT...')}
                    {authStep === 'SYNAPSE_SYNC' && (language === 'PL' ? 'SYNCHRONIZACJA SYNAPSY ARCHITEKTA...' : 'SYNCHRONIZING ARCHITECT SYNAPSE...')}
                    {authStep === 'AUTHORIZED' && (language === 'PL' ? 'DOSTĘP PRZYZNANY. WEJŚCIE DO NEXUSA...' : 'ACCESS GRANTED. ENTERING NEXUS...')}
                  </h3>
                  <p className="text-xs text-cyan-400 font-mono-tech mt-1">
                    {customEmail || 'laciatyplas@gmail.com'}
                  </p>
                </div>
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-300"
                    style={{
                      width: authStep === 'VERIFYING_GOOGLE' ? '35%' : authStep === 'SYNAPSE_SYNC' ? '75%' : '100%'
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                
                {/* Primary Google Login Button */}
                <div>
                  <button
                    id="google-signin-btn"
                    onClick={handleGoogleSignIn}
                    className="w-full relative group overflow-hidden flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-sans font-semibold text-sm shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(0,240,255,0.4)] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {/* Official Multi-colored Google Icon SVG */}
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>
                      {language === 'PL' ? 'Zaloguj automatycznie przez Google' : 'Sign in automatically with Google'}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-auto text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <div className="flex items-center justify-between mt-2.5 px-1">
                    <span className="text-[11px] text-slate-400 font-mono-tech flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {language === 'PL' ? 'Wykryto konto:' : 'Detected account:'}{' '}
                      <strong className="text-cyan-300 font-semibold">{customEmail}</strong>
                    </span>

                    <button
                      onClick={() => setIsCustomizing(!isCustomizing)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-200 underline font-mono-tech"
                    >
                      {isCustomizing ? (language === 'PL' ? 'Zamknij' : 'Close') : (language === 'PL' ? 'Zmień' : 'Change')}
                    </button>
                  </div>
                </div>

                {/* Custom Google Account Editor Accordion */}
                {isCustomizing && (
                  <div className="p-3 rounded-xl bg-[#0d131f] border border-cyan-500/20 space-y-2.5 text-xs animate-in fade-in">
                    <div>
                      <label className="block text-slate-300 text-[11px] font-mono-tech mb-1">
                        {language === 'PL' ? 'Adres Google Email' : 'Google Email Address'}
                      </label>
                      <input
                        type="email"
                        value={customEmail}
                        onChange={e => setCustomEmail(e.target.value)}
                        placeholder="twoj.email@gmail.com"
                        className="w-full px-3 py-1.5 rounded-lg bg-[#070a10] border border-cyan-500/30 text-white font-mono-tech text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-[11px] font-mono-tech mb-1">
                        {language === 'PL' ? 'Nazwisko / Alias Architekta' : 'Architect Name / Alias'}
                      </label>
                      <input
                        type="text"
                        value={customName}
                        onChange={e => setCustomName(e.target.value)}
                        placeholder="Twój pseudonim"
                        className="w-full px-3 py-1.5 rounded-lg bg-[#070a10] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                )}

                {/* Auto-Login Checkbox Toggle */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
                  <input
                    id="auto-login-checkbox"
                    type="checkbox"
                    checked={autoLoginEnabled}
                    onChange={e => {
                      setAutoLoginEnabled(e.target.checked);
                      playCyberSound('click');
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-cyan-400/40 bg-black text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-cyan-500"
                  />
                  <label htmlFor="auto-login-checkbox" className="text-xs text-slate-300 leading-snug cursor-pointer select-none">
                    <span className="font-semibold text-white">
                      {language === 'PL' ? 'Automatyczne logowanie Google' : 'Auto-Login with Google'}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-0.5">
                      {language === 'PL'
                        ? 'Zapamiętaj sesję i pomijaj ekran blokady przy kolejnych wizytach.'
                        : 'Persist session and bypass this gate on future visits.'}
                    </span>
                  </label>
                </div>

                {/* Divider: Alternate Architect Keys */}
                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-cyan-500/20 w-full" />
                  <span className="bg-[#080c16] px-3 text-[10px] font-mono-tech text-slate-400 uppercase tracking-widest flex-shrink-0">
                    {language === 'PL' ? 'lub wybierz profil Architekta' : 'or select Architect key'}
                  </span>
                </div>

                {/* Quick Architect Identity Switcher */}
                <div className="space-y-2">
                  <p className="text-[11px] font-mono-tech text-slate-400">
                    {language === 'PL' ? 'Dostęp bezpośredni dla Zarejestrowanych Architektów:' : 'Direct Key for Verified Architects:'}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cyan-500/30">
                    {architects.slice(0, 6).map(arch => (
                      <button
                        key={arch.id}
                        id={`arch-key-btn-${arch.id}`}
                        onClick={() => handleArchitectDirectLogin(arch.id)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all group ${
                          selectedArchId === arch.id
                            ? 'bg-cyan-950/60 border-cyan-400/60 text-white shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                            : 'bg-[#0a0f1a] border-cyan-500/15 hover:border-cyan-400/40 text-slate-300'
                        }`}
                      >
                        <img
                          src={arch.avatar}
                          alt={arch.name}
                          className="w-7 h-7 rounded-lg object-cover border border-cyan-500/30"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-white truncate group-hover:text-cyan-300">
                            {arch.name ? arch.name.split(' ')[0] : 'Architect'}
                          </p>
                          <p className="text-[9px] font-mono-tech text-cyan-400 truncate">
                            {arch.role}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bottom Legal & Security Signature */}
                <div className="pt-2 border-t border-cyan-500/15 text-center">
                  <p className="text-[10px] font-mono-tech text-slate-400 leading-normal">
                    {language === 'PL'
                      ? 'NEXUS SOVEREIGNTY PROTOCOL • 100% SZYFROWANA SESJA'
                      : 'NEXUS SOVEREIGNTY PROTOCOL • 100% ENCRYPTED SESSION'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer System Strip */}
      <footer className="relative z-10 border-t border-cyan-500/15 bg-[#04060a]/90 px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono-tech text-slate-400 gap-2">
        <div className="flex items-center gap-2 text-cyan-400">
          <Terminal className="w-3.5 h-3.5" />
          <span>NEXUS FAMILY v2.6.0 // ARCHITECTS & BUILDERS FORGE</span>
        </div>

        <div className="flex items-center gap-4">
          <span>{language === 'PL' ? 'Zasada 0: Tworzenie > Konsumpcja' : 'Rule 0: Creation > Consumption'}</span>
          <span>•</span>
          <span>{language === 'PL' ? 'Bella sugeruje. Człowiek decyduje.' : 'Bella suggests. Humans decide.'}</span>
        </div>
      </footer>
    </div>
  );
};
