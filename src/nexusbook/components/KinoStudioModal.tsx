import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Square,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  Zap,
  Activity,
  Waves,
  Disc,
  Radio,
  Share2,
  Maximize2,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';
import { soundFx } from '../utils/audioSystem';
import { KINO_PRESET_TRACKS, KinoTrack, KinoVisualizerMode } from '../nexus/modules/kino';
import { nexusBus } from '../nexus/core/nexus-bus';
import { hasPermission, BellasRoleId } from '../data/bellasRoles';

interface KinoStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole?: string | null;
  onRequestRoleChange?: () => void;
}

export const KinoStudioModal: React.FC<KinoStudioModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onRequestRoleChange
}) => {
  if (!isOpen) return null;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Playback States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [visualizerMode, setVisualizerMode] = useState<KinoVisualizerMode>('CYBER_WAVE');
  const [waveHue, setWaveHue] = useState(190);
  const [particleIntensity, setParticleIntensity] = useState(1.0);
  const [activeMessage, setActiveMessage] = useState('KINO NEXUS // STRUMIEŃ SYGNAŁU SOFII BELLAS');

  // Mouse coordinates on canvas
  const [mousePos, setMousePos] = useState({ x: 400, y: 190 });
  const isMouseDownRef = useRef(false);
  const shockwavesRef = useRef<Array<{ x: number; y: number; radius: number; maxRadius: number; alpha: number; hue: number }>>([]);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; radius: number; alpha: number; hueOffset: number }>>([]);

  const currentTrack = KINO_PRESET_TRACKS[currentTrackIdx] || KINO_PRESET_TRACKS[0];

  // Synth Note Trigger
  const triggerSynthTone = useCallback((freq: number, duration = 0.25) => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = visualizerMode === 'CYBER_WAVE' ? 'sine' : visualizerMode === 'BIO_SPECTRAL' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, now + duration);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 3.5, now);

      const targetGain = volume * 0.1;
      gain.gain.setValueAtTime(targetGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // safe audio fallback
    }
  }, [isMuted, visualizerMode, volume]);

  // Init Particles
  useEffect(() => {
    particlesRef.current = [];
    for (let i = 0; i < 60; i++) {
      particlesRef.current.push({
        x: Math.random() * 800,
        y: Math.random() * 400,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 2.5 + 0.8,
        alpha: Math.random() * 0.7 + 0.3,
        hueOffset: Math.random() * 40 - 20
      });
    }
  }, []);

  // Playback Timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev + 1 >= currentTrack.durationSec) {
            setCurrentTrackIdx((idx) => (idx + 1) % KINO_PRESET_TRACKS.length);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentTrack.durationSec]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;

    const render = () => {
      step += isPlaying ? 0.03 : 0.015;
      const w = canvas.width;
      const h = canvas.height;

      // Soft Trail Background Clear
      ctx.fillStyle = 'rgba(2, 4, 10, 0.28)';
      ctx.fillRect(0, 0, w, h);

      const normX = mousePos.x / (w || 1);
      const normY = mousePos.y / (h || 1);

      // Mode 1: Cyber Wave Resonance
      if (visualizerMode === 'CYBER_WAVE') {
        ctx.lineWidth = 2.5;
        for (let wave = 0; wave < 4; wave++) {
          ctx.beginPath();
          const hue = (waveHue + wave * 22) % 360;
          ctx.strokeStyle = `hsla(${hue}, 100%, 65%, ${0.35 + wave * 0.15})`;

          const freq = 0.007 + normX * 0.012;
          const amp = (45 + (1 - normY) * 55) * (isPlaying ? 1.3 : 0.8);

          for (let x = 0; x < w; x += 4) {
            const y =
              h / 2 +
              Math.sin(x * freq + step + wave) * amp * Math.cos(step * 0.4) +
              Math.sin(x * 0.02 - step) * 20;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } 
      // Mode 2: Quantum Particle Flux
      else if (visualizerMode === 'QUANTUM_PARTICLES') {
        const parts = particlesRef.current;
        for (let i = 0; i < parts.length; i++) {
          for (let j = i + 1; j < parts.length; j++) {
            const p1 = parts[i];
            const p2 = parts[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 85) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `hsla(${waveHue}, 100%, 70%, ${(1 - dist / 85) * 0.35})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }
      // Mode 3: Bio Spectral Bars
      else if (visualizerMode === 'BIO_SPECTRAL') {
        const barCount = 38;
        const barW = w / barCount;
        for (let i = 0; i < barCount; i++) {
          const heightMult = isPlaying
            ? Math.abs(Math.sin(step * 2.5 + i * 0.35)) * 0.85 + Math.cos(i * 0.4) * 0.15
            : Math.abs(Math.sin(step * 0.8 + i * 0.2)) * 0.25;

          const barH = Math.max(8, heightMult * (h * 0.78) * (1 + normX * 0.4));
          const x = i * barW;
          const y = h - barH;

          const grad = ctx.createLinearGradient(0, y, 0, h);
          grad.addColorStop(0, `hsl(${(waveHue + i * 4) % 360}, 100%, 65%)`);
          grad.addColorStop(1, 'rgba(5, 10, 25, 0.95)');

          ctx.fillStyle = grad;
          ctx.fillRect(x + 2, y, barW - 4, barH);
        }
      }
      // Mode 4: Neural Synapse Vortex
      else if (visualizerMode === 'NEURAL_VORTEX') {
        const cx = mousePos.x;
        const cy = mousePos.y;
        for (let ring = 0; ring < 6; ring++) {
          const radius = 25 + ring * 26 + Math.sin(step * 2.2 + ring) * 12;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${(waveHue + ring * 28) % 360}, 100%, 65%, ${0.5 - ring * 0.07})`;
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }
      }

      // Render Click Ripples / Shockwaves
      const ripples = shockwavesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 3.5;
        r.alpha -= 0.025;
        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${r.hue}, 100%, 75%, ${r.alpha})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Render and Update Floating Particles
      const parts = particlesRef.current;
      parts.forEach((p) => {
        p.x += p.vx * particleIntensity;
        p.y += p.vy * particleIntensity;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const particleHue = (waveHue + p.hueOffset + 360) % 360;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particleHue}, 100%, 75%, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsl(${particleHue}, 100%, 50%)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Intensity decay
      if (particleIntensity > 1.0) {
        setParticleIntensity((prev) => Math.max(1.0, prev - 0.015));
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, visualizerMode, waveHue, particleIntensity, mousePos]);

  // Canvas Mouse Interactions
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (isMouseDownRef.current) {
      const freq = 160 + (x / rect.width) * 550;
      triggerSynthTone(freq, 0.08);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isMouseDownRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    shockwavesRef.current.push({
      x,
      y,
      radius: 4,
      maxRadius: 130,
      alpha: 1.0,
      hue: waveHue
    });

    // Particle Burst
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 1,
        alpha: 1.0,
        hueOffset: Math.random() * 30 - 15
      });
    }

    setParticleIntensity((prev) => Math.min(3.5, prev + 0.8));
    const noteFreq = 220 + (x / rect.width) * 600;
    triggerSynthTone(noteFreq, 0.35);
  };

  const handleCanvasMouseUp = () => {
    isMouseDownRef.current = false;
  };

  // Playback Handlers
  const handleTogglePlay = () => {
    soundFx.playClick();
    if (!isPlaying) {
      triggerSynthTone(330, 0.3);
      nexusBus.emit('kino:scene_trigger', 'kino-modal', {
        message: `ODTWARZANIE: ${currentTrack.title}`,
        hue: waveHue,
        timestamp: Date.now()
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    soundFx.playClick();
    setIsPlaying(false);
    setPlaybackTime(0);
  };

  const handleNext = () => {
    soundFx.playClick();
    const nextIdx = (currentTrackIdx + 1) % KINO_PRESET_TRACKS.length;
    setCurrentTrackIdx(nextIdx);
    setPlaybackTime(0);
    const tr = KINO_PRESET_TRACKS[nextIdx];
    setWaveHue(tr.baseHue);
    triggerSynthTone(tr.baseHue * 2, 0.25);
  };

  const handlePrev = () => {
    soundFx.playClick();
    const prevIdx = (currentTrackIdx - 1 + KINO_PRESET_TRACKS.length) % KINO_PRESET_TRACKS.length;
    setCurrentTrackIdx(prevIdx);
    setPlaybackTime(0);
    const tr = KINO_PRESET_TRACKS[prevIdx];
    setWaveHue(tr.baseHue);
    triggerSynthTone(tr.baseHue * 2, 0.25);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setPlaybackTime(val);
    triggerSynthTone(200 + val * 2, 0.1);
  };

  const handleSelectPreset = (hue: number, title: string, intensity = 2.2) => {
    soundFx.playClick();
    setWaveHue(hue);
    setParticleIntensity(intensity);
    setActiveMessage(title);
    triggerSynthTone(hue * 2.2, 0.35);
    nexusBus.emit('kino:scene_trigger', 'kino-modal', { message: title, hue, timestamp: Date.now() });
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#030712] border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950/40 via-cyan-950/20 to-transparent border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/10">
              🎬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  KINO NEXUS STUDIO
                </span>
                <span className="text-xs font-mono text-stone-400">SOFIA BELLAS ENGINE</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5 flex items-center gap-2">
                <span>Interaktywny Silnik Projekcji & Mediasfery</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playModalClose();
                onClose();
              }}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Top Controls: Mode Selectors & Presets */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-black/50 border border-white/10">
            {/* Visualizer Modes */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mr-1">TRYB PROJEKCJI:</span>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setVisualizerMode('CYBER_WAVE');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                  visualizerMode === 'CYBER_WAVE'
                    ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-white/5 text-cyan-300 border border-cyan-500/30 hover:bg-white/10'
                }`}
              >
                <Waves className="w-3.5 h-3.5" />
                <span>Fala Harmoniczna</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setVisualizerMode('QUANTUM_PARTICLES');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                  visualizerMode === 'QUANTUM_PARTICLES'
                    ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-white/5 text-emerald-300 border border-emerald-500/30 hover:bg-white/10'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cząstki Kwantowe</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setVisualizerMode('BIO_SPECTRAL');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                  visualizerMode === 'BIO_SPECTRAL'
                    ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                    : 'bg-white/5 text-amber-300 border border-amber-500/30 hover:bg-white/10'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Widmo Spektralne</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setVisualizerMode('NEURAL_VORTEX');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                  visualizerMode === 'NEURAL_VORTEX'
                    ? 'bg-purple-500 text-black font-bold shadow-md shadow-purple-500/20'
                    : 'bg-white/5 text-purple-300 border border-purple-500/30 hover:bg-white/10'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Wir Synaptyczny</span>
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => handleSelectPreset(190, 'TRYB KINA: BŁĘKIT PRÓŻNI', 1.8)}
                className="px-2.5 py-1 text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-lg hover:bg-cyan-500/30 font-mono transition-all"
              >
                Błękit Próżni
              </button>
              <button
                onClick={() => handleSelectPreset(145, 'TRYB KINA: ZIELEŃ RDZENIA', 2.0)}
                className="px-2.5 py-1 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg hover:bg-emerald-500/30 font-mono transition-all"
              >
                Zieleń Rdzenia
              </button>
              <button
                onClick={() => handleSelectPreset(40, 'TRYB KINA: BURSZTYN BELLAS', 2.4)}
                className="px-2.5 py-1 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg hover:bg-amber-500/30 font-mono transition-all"
              >
                Bursztyn Bellas
              </button>
              <button
                onClick={() => handleSelectPreset(275, 'TRYB KINA: PURPURA KWANTOWA', 2.8)}
                className="px-2.5 py-1 text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-lg hover:bg-purple-500/30 font-mono transition-all"
              >
                Purpura Kwantowa
              </button>
            </div>
          </div>

          {/* Interactive 60 FPS HTML5 Canvas */}
          <div className="relative w-full h-[360px] sm:h-[420px] bg-[#02050b] rounded-3xl border border-emerald-500/30 overflow-hidden shadow-2xl flex items-center justify-center cursor-crosshair group">
            <canvas
              ref={canvasRef}
              width={880}
              height={420}
              onMouseMove={handleCanvasMouseMove}
              onMouseDown={handleCanvasMouseDown}
              onMouseUp={handleCanvasMouseUp}
              className="w-full h-full block"
            />

            {/* Interaction Hint Overlay */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur border border-white/10 text-xs font-mono text-stone-300 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Interakcja: Przesuwaj kursor, by modulować fali dźwięku i światła • Kliknij, aby wyzwolić falę uderzeniową</span>
            </div>

            {/* Live Message & Telemetry Bar */}
            <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2.5 text-xs font-mono text-emerald-300 truncate">
                <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-stone-500'}`} />
                <span className="truncate font-semibold">{activeMessage}</span>
              </div>
              <div className="text-[10px] text-stone-400 font-mono shrink-0 flex items-center gap-3">
                <span>POS: [{Math.round(mousePos.x)}, {Math.round(mousePos.y)}]</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">{visualizerMode}</span>
              </div>
            </div>
          </div>

          {/* Media Playback Transport Controller */}
          <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-4 shadow-xl">
            
            {/* Track Info & Scrubber */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-lg shrink-0">
                  <Disc className={`w-5 h-5 text-emerald-400 ${isPlaying ? 'animate-spin' : ''}`} />
                </div>
                <div className="truncate">
                  <div className="text-white font-bold truncate text-sm">{currentTrack.title}</div>
                  <div className="text-stone-400 text-xs truncate">{currentTrack.author} • BPM: {currentTrack.bpm}</div>
                </div>
              </div>

              <div className="text-xs font-mono text-stone-300 shrink-0 self-end sm:self-auto bg-stone-900/80 px-3 py-1 rounded-lg border border-white/5">
                <span className="text-emerald-400 font-bold">{formatTime(playbackTime)}</span> / {formatTime(currentTrack.durationSec)}
              </div>
            </div>

            {/* Seekbar Slider */}
            <div className="relative flex items-center">
              <input
                type="range"
                min="0"
                max={currentTrack.durationSec}
                value={playbackTime}
                onChange={handleSeek}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 hover:accent-emerald-300 transition-all"
              />
            </div>

            {/* Buttons Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              
              {/* Transport Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 transition-all"
                  title="Poprzedni utwór"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={handleTogglePlay}
                  className={`px-5 py-2.5 rounded-2xl ${
                    isPlaying 
                      ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20' 
                      : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
                  } font-bold font-mono text-xs flex items-center gap-2 transition-all`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Wstrzymaj</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Odtwórz</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 transition-all"
                  title="Następny utwór"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={handleStop}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 transition-all"
                  title="Zatrzymaj"
                >
                  <Square className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2.5 text-stone-300 text-xs font-mono">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-24 h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <span className="w-8 text-right">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
