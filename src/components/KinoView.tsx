import React, { useEffect, useRef, useState } from 'react';
import { Film, Play, Pause, Sparkles, Sliders, Volume2, Maximize2 } from 'lucide-react';

export const KinoView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [glowSpeed, setGlowSpeed] = useState<number>(1.0);
  const [particleCount, setParticleCount] = useState<number>(80);
  const [currentMode, setCurrentMode] = useState<'wave' | 'pulse' | 'synapse' | 'genesis'>('genesis');

  useEffect(() => {
    let isMounted = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas.parentElement || !isMounted) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 420;
    };

    window.addEventListener('resize', handleResize);

    // Particle Array
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
    }> = [];

    const colors = ['#06b6d4', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * glowSpeed,
        vy: (Math.random() - 0.5) * glowSpeed,
        alpha: Math.random() * 0.7 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let step = 0;

    const render = () => {
      if (!isMounted) return;

      step += 0.02 * glowSpeed;
      ctx.fillStyle = 'rgba(5, 5, 8, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Mode 1: Pulse Rings
      if (currentMode === 'pulse' || currentMode === 'synapse') {
        const centerX = width / 2;
        const centerY = height / 2;

        for (let r = 1; r <= 4; r++) {
          const radius = (step * 40 * r) % (Math.min(width, height) / 2);
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(6, 182, 212, ${1 - radius / (Math.min(width, height) / 2)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Mode 3: Genesis Cyberpunk Industrial Wave
      if (currentMode === 'genesis') {
        const centerY = height / 2;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        for (let x = 0; x < width; x += 4) {
          const y = centerY + Math.sin(x * 0.02 + step * 1.5) * 55 * Math.cos(x * 0.005 + step * 0.8);
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.9)';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, centerY);
        for (let x = 0; x < width; x += 4) {
          const y = centerY - Math.sin(x * 0.015 + step * 1.2) * 35;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Render Particles
      particles.forEach((p) => {
        p.x += p.vx * glowSpeed;
        p.y += p.vy * glowSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      if (isPlaying && isMounted) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, glowSpeed, particleCount, currentMode]);

  return (
    <div className="space-y-6">
      {/* Kino Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base font-sans">Kino — Audiowizualny Węzeł Projekcji Canvas</h2>
            <p className="text-xs text-slate-400">Symulacja fal widmowych i cząsteczek kwantowych zsynchronizowana z impulsami NXL Event Bus</p>
          </div>
        </div>

        {/* Projection Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pauza Projekcji' : 'Odtwarzaj Projekcję'}</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            {(['genesis', 'pulse', 'wave', 'synapse'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setCurrentMode(m)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold capitalize transition-all ${
                  currentMode === m
                    ? m === 'genesis'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                      : 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m === 'genesis' ? 'Płyta GENESIS' : m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas Display Frame */}
      <div className="nx-glass-card rounded-2xl p-2 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/90 border border-amber-500/50 text-xs font-mono text-amber-300 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.25)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>
            {currentMode === 'genesis'
              ? 'PŁYTA GENESIS // MACIEJ MACIUSZEK — NIE TYLKO NARZĘDZIE!'
              : `PROJEKCJA AKTYWNA: MODE ${currentMode.toUpperCase()}`}
          </span>
        </div>

        <canvas ref={canvasRef} className="w-full h-[420px] rounded-xl bg-[#050508] block" />
      </div>

      {/* Projection Parameters Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-300">
            <span>Prędkość Impulsu Światła</span>
            <span className="text-cyan-300 font-bold">{glowSpeed}x</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.1"
            value={glowSpeed}
            onChange={(e) => setGlowSpeed(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-300">
            <span>Gęstość Cząsteczek Kwantowych</span>
            <span className="text-emerald-300 font-bold">{particleCount} Cząstek</span>
          </div>
          <input
            type="range"
            min="20"
            max="200"
            step="10"
            value={particleCount}
            onChange={(e) => setParticleCount(parseInt(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
