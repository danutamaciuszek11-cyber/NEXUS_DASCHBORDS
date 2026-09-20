import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Radio, 
  User, 
  Plus, 
  Check, 
  Compass, 
  LogOut,
  Flame,
  Key
} from 'lucide-react';
import { PilotProfile } from '../types';
import { soundFx } from '../utils/audioSystem';
import { NEXUS_NODE_TOKEN } from '../lib/nodeIdentity';

interface QuantumLoginModalProps {
  currentPilot: PilotProfile | null;
  onSavePilot: (pilot: PilotProfile) => void;
  onLogoutPilot: () => void;
  onClose: () => void;
}

export const QuantumLoginModal: React.FC<QuantumLoginModalProps> = ({
  currentPilot,
  onSavePilot,
  onLogoutPilot,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Form states initialized with existing pilot or defaults
  const [designatorName, setDesignatorName] = useState(currentPilot?.designatorName || 'Elias Thorne');
  const [vesselClass, setVesselClass] = useState(currentPilot?.vesselClass || 'Nebula Drifter v.4');
  const [missionObjectives, setMissionObjectives] = useState(
    currentPilot?.missionObjectives || 'Exploration of ancient cosmic archives & deep space archives.'
  );
  const [specializations, setSpecializations] = useState<string[]>(
    currentPilot?.specializations || ['#Quantum-Navigation', '#Void-Engineering', '#Bio-Luminescence']
  );
  const [newTagInput, setNewTagInput] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    currentPilot?.avatarUrl || 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=600'
  );

  const [isLaunching, setIsLaunching] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);

  // Canvas particle animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
    }[] = [];

    const colors = ['#ff007a', '#00f2ff', '#7000ff', '#00ff8c', '#ffaa00'];

    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const particleCount = window.innerWidth < 768 ? 60 : 140;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.5 + 1,
          speedX: (Math.random() - 0.5) * 0.6,
          speedY: (Math.random() - 0.5) * 0.6,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.6 + 0.2
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      particles.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= dx * 0.02;
          p.y -= dy * 0.02;
        }
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    initCanvas();
    animate();

    window.addEventListener('resize', initCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', initCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Keyboard shortcut ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLaunching) {
        soundFx.playModalClose();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isLaunching]);

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    let formatted = newTagInput.trim();
    if (!formatted.startsWith('#')) formatted = `#${formatted}`;
    if (!specializations.includes(formatted)) {
      soundFx.playClick();
      setSpecializations([...specializations, formatted]);
    }
    setNewTagInput('');
    setShowAddTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    soundFx.playClick();
    setSpecializations(specializations.filter(t => t !== tagToRemove));
  };

  const handleIgniteEngine = () => {
    if (isLaunching) return;
    soundFx.playExport(); // High tech sound
    setIsLaunching(true);
    setLaunchProgress(0);

    const interval = setInterval(() => {
      setLaunchProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          const profile: PilotProfile = {
            designatorName: designatorName || 'Elias Thorne',
            vesselClass: vesselClass || 'Nebula Drifter',
            missionObjectives: missionObjectives || 'Deep Space Traversal',
            specializations: specializations.length > 0 ? specializations : ['#Quantum-Navigation'],
            avatarUrl: avatarUrl,
            neuralSyncPct: 98.8,
            encryptionKey: 'AES-Q256-' + Math.floor(1000 + Math.random() * 9000),
            authenticated: true,
            authenticatedAt: Date.now()
          };

          onSavePilot(profile);
          soundFx.playModalOpen();
          onClose();
          return 100;
        }
        return prev + 15;
      });
    }, 90);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#030307] font-sans select-none animate-in fade-in duration-300">
      
      {/* Background Deep Space Particles & Wallpaper */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Deep Space Cosmic Nebula Background Overlays */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(3, 3, 7, 0.7), rgba(3, 3, 7, 0.95)), url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=2048')`
        }}
      />

      <div className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none animate-pulse" />

      {/* Main Quantum Frame Box */}
      <div className="relative z-10 w-[95vw] max-w-[1100px] max-h-[90vh] md:h-[85vh] bg-white/[0.02] backdrop-blur-2xl border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-md overflow-hidden grid grid-cols-1 md:grid-cols-[380px_1fr]">
        
        {/* Top Cyan/Pink Linear Laser Border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-pink-500 z-30" />

        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playModalClose();
            onClose();
          }}
          className="absolute top-4 right-4 z-40 p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-950/40 transition-all cursor-pointer"
          title="Zamknij Terminal Logowania (ESC)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* --- LEFT COMMAND PANEL --- */}
        <aside className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-white/10 flex flex-col gap-8 bg-white/[0.01] font-mono text-xs relative overflow-y-auto">
          
          {/* Orbital Avatar Section */}
          <div className="relative w-[210px] h-[210px] mx-auto shrink-0 mt-2">
            {/* Outer Ring 1 (Dashed Clockwise) */}
            <div className="absolute inset-0 border border-cyan-400/30 border-dashed rounded-full animate-[spin_20s_linear_infinite]" />
            {/* Inner Ring 2 (Pink Counter Clockwise) */}
            <div className="absolute inset-3 border border-pink-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            
            {/* Center Avatar Container */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_30px_rgba(0,242,255,0.3)] group cursor-pointer">
              <img 
                src={avatarUrl} 
                alt="Pilot Avatar"
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold text-cyan-300">
                ZMIEŃ AVATAR
              </div>
            </div>
          </div>

          {/* Avatar URL Quick Swapper */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-cyan-400/70 block">AVATAR STREAM URL:</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1 text-[10px] font-mono text-white/80 focus:outline-none focus:border-cyan-400"
              placeholder="https://..."
            />
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[9px] text-cyan-400 uppercase tracking-widest block">System Status</span>
              <span className="text-[12px] text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Operational
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-cyan-400 uppercase tracking-widest block">Neural Sync</span>
              <span className="text-[12px] text-white font-bold">98.4%</span>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-cyan-400 uppercase tracking-widest block">Data Packets</span>
              <span className="text-[12px] text-white font-bold">12,401 ms</span>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-cyan-400 uppercase tracking-widest block">Encryption</span>
              <span className="text-[12px] text-purple-300 font-bold">AES-Q256</span>
            </div>
          </div>

          {/* Node Authorization Token Badge */}
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 font-mono space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between text-emerald-400 text-[10px] font-bold">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                <span>NEXUS NODE TOKEN</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 rounded border border-emerald-500/40 text-emerald-300">
                AUTHORIZED
              </span>
            </div>
            <div className="text-[11px] font-bold text-white tracking-wider truncate select-all bg-black/60 px-2 py-1 rounded border border-white/5">
              {NEXUS_NODE_TOKEN}
            </div>
            <div className="text-[9px] text-emerald-300/70">
              Autoryzacja mikroserwisów, AI i kontraktów BNB
            </div>
          </div>

          {/* Active Pilot Info or Terminal Notice */}
          {currentPilot?.authenticated ? (
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  PILOT ZALOGOWANY
                </span>
              </div>
              <p className="text-[11px] text-white font-sans font-medium">
                Kryptonim: <strong className="text-cyan-400">{currentPilot.designatorName}</strong>
              </p>
              <button
                onClick={() => {
                  soundFx.playDelete();
                  onLogoutPilot();
                }}
                className="w-full mt-2 py-1.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Wyloguj Pilota</span>
              </button>
            </div>
          ) : (
            <div className="mt-auto text-[9px] text-white/40 leading-relaxed font-mono border-t border-white/10 pt-4">
              <span className="text-pink-400 font-bold">[TERMINAL_MSG]:</span> AUTHENTICATE PILOT IDENTITY TO INITIATE SLIPSTREAM MANEUVER. ENSURE BIOMETRIC SIGNATURE IS WITHIN ACCEPTABLE DEVIATION PARAMETERS.
            </div>
          )}

        </aside>

        {/* --- RIGHT TRAJECTORY PANEL --- */}
        <section className="p-8 md:p-14 overflow-y-auto custom-scrollbar flex flex-col justify-between">
          
          <div>
            {/* Header Title */}
            <header className="mb-10 space-y-2 font-mono">
              <div className="flex items-center gap-2 text-emerald-400 text-xs tracking-widest uppercase">
                <Compass className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
                <span>// DEEP SPACE REGISTRY & AUTH GATEWAY</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none bg-gradient-to-br from-white via-cyan-300 to-pink-500 bg-clip-text text-transparent">
                Quantum<br />Traversal
              </h1>
            </header>

            {/* Input Form Fields */}
            <div className="space-y-8 font-sans">
              
              {/* Row 1: Designator Name & Vessel Class */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Designator Name */}
                <div className="relative group">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-2 group-focus-within:text-cyan-400 transition-colors">
                    DESIGNATOR NAME / NAZWA PILOTA
                  </label>
                  <input
                    type="text"
                    value={designatorName}
                    onChange={(e) => setDesignatorName(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 py-2.5 text-white font-sans text-lg focus:outline-none focus:border-cyan-400 shadow-none focus:shadow-[0_10px_20px_-10px_rgba(0,242,255,0.3)] transition-all"
                    placeholder="Wpisz nazwę pilota..."
                  />
                </div>

                {/* Vessel Class */}
                <div className="relative group">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-2 group-focus-within:text-cyan-400 transition-colors">
                    VESSEL CLASS / KLASA STATKU
                  </label>
                  <input
                    type="text"
                    value={vesselClass}
                    onChange={(e) => setVesselClass(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 py-2.5 text-white font-sans text-lg focus:outline-none focus:border-cyan-400 shadow-none focus:shadow-[0_10px_20px_-10px_rgba(0,242,255,0.3)] transition-all"
                    placeholder="np. Nebula Drifter v.4"
                  />
                </div>

              </div>

              {/* Row 2: Mission Objectives */}
              <div className="relative group">
                <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-2 group-focus-within:text-cyan-400 transition-colors">
                  MISSION OBJECTIVES / CELE MISJI W KOSMOSIE
                </label>
                <input
                  type="text"
                  value={missionObjectives}
                  onChange={(e) => setMissionObjectives(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 py-2.5 text-white font-sans text-lg focus:outline-none focus:border-cyan-400 shadow-none focus:shadow-[0_10px_20px_-10px_rgba(0,242,255,0.3)] transition-all"
                  placeholder="Zdefiniuj swoją podróż przez otchłań..."
                />
              </div>

              {/* Specialization Tags */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-3">
                  INTERSTELLAR SPECIALIZATIONS / SPECJALIZACJE
                </label>
                
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  {specializations.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3.5 py-1.5 rounded-full border border-purple-500/60 bg-purple-950/40 text-purple-300 hover:bg-purple-600 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 group"
                      onClick={() => handleRemoveTag(tag)}
                      title="Kliknij, aby usunąć tag"
                    >
                      <span>{tag}</span>
                      <X className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                    </span>
                  ))}

                  {/* Add New Skill Tag */}
                  {showAddTag ? (
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-amber-500/60 rounded-full px-3 py-1">
                      <input
                        type="text"
                        autoFocus
                        placeholder="#Nawigacja"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddTag();
                          if (e.key === 'Escape') setShowAddTag(false);
                        }}
                        className="bg-transparent border-none text-amber-300 text-xs font-mono focus:outline-none w-28"
                      />
                      <button
                        onClick={handleAddTag}
                        className="text-amber-400 hover:text-white"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setShowAddTag(true);
                      }}
                      className="px-3.5 py-1.5 rounded-full border border-amber-500/60 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black font-bold transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Skill</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Launch Action Footer Button */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            
            <button
              onClick={handleIgniteEngine}
              disabled={isLaunching}
              className="relative bg-white hover:bg-cyan-400 text-black font-black uppercase tracking-[3px] text-sm px-10 py-4 transition-all duration-300 shadow-2xl hover:shadow-[0_20px_40px_rgba(0,242,255,0.4)] disabled:opacity-50 cursor-pointer group"
              style={{
                clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)'
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-600 group-hover:text-black transition-colors" />
                <span>{isLaunching ? `LAUNCHING ${launchProgress}%` : 'IGNITE ENGINE'}</span>
              </span>
              
              {/* Ready Badge Overlay */}
              <span className="absolute -top-4 right-0 font-mono text-[9px] text-emerald-400 tracking-wider uppercase font-bold">
                READY
              </span>
            </button>

            {/* Progress / Timer line */}
            <div className="flex-1 hidden sm:flex items-center gap-4 font-mono text-[10px] text-pink-400">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-white/20 via-pink-500 to-transparent" />
              <span>0.003s TO LAUNCH</span>
            </div>

          </div>

        </section>

      </div>

    </div>
  );
};
