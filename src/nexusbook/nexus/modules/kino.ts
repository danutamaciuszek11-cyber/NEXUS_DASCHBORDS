/**
 * KINO MODULE: Projekcja Audiowizualna Canvas & Syntezator Harmoniczny
 * ======================================================================
 * Zaawansowany, czyszczony silnik projekcji w natywnym HTML5 Canvas API (60 FPS).
 * Opiekun modułu: Sofia Bellas (Narrative / Kino Curator).
 * 
 * Funkcjonalności:
 * 1. Interaktywny panel kontroli odtwarzania mediów (Play / Pause / Seekbar / Track switching / Mute).
 * 2. 4 dynamiczne tryby wizualizacji: Cyber-Wave Resonance, Quantum Particle Flux, Bio-Spectral Bars, Neural Synapse Vortex.
 * 3. Pełna interakcja użytkownika na płótnie Canvas:
 *    - Ruch / przeciąganie myszą moduluje częstotliwość fali, cutoff filtru i gęstość cząstek.
 *    - Kliknięcie generuje falę uderzeniową (shockwave) i wyzwala harmoniczny syntezator dźwiękowy.
 * 4. Integracja w czasie rzeczywistym z Mostem Zdarzeń (Nexus Bus) i synchronizacja parametrów.
 */

import { NexusNode } from '../core/nexus-node';
import { nexusBus } from '../core/nexus-bus';

export type KinoVisualizerMode = 
  | 'CYBER_WAVE' 
  | 'QUANTUM_PARTICLES' 
  | 'BIO_SPECTRAL' 
  | 'NEURAL_VORTEX';

export interface KinoTrack {
  id: string;
  title: string;
  author: string;
  durationSec: number;
  baseHue: number;
  bpm: number;
}

export const KINO_PRESET_TRACKS: KinoTrack[] = [
  { id: 'track-1', title: 'Prolog: Punkt Zero (Resonans Próżni)', author: 'Sofia Bellas • ETERNIVERSE Lab', durationSec: 245, baseHue: 190, bpm: 72 },
  { id: 'track-2', title: 'Cyber-Terrorysta: Architektura Cienia', author: 'Elena & Marco Bellas', durationSec: 312, baseHue: 145, bpm: 90 },
  { id: 'track-3', title: 'Algorytm Pola: Strażnik Konsensusu', author: 'Leo Bellas • Scribe Archive', durationSec: 198, baseHue: 40, bpm: 60 },
  { id: 'track-4', title: 'Kwantowe Splątanie BNB #734LLM', author: 'Nexus Core Ensemble', durationSec: 280, baseHue: 275, bpm: 84 },
];

export class KinoNode extends NexusNode {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animFrameId: number | null = null;

  // Visualizer States
  private visualizerMode: KinoVisualizerMode = 'CYBER_WAVE';
  private waveHue: number = 190;
  private waveSpeed: number = 0.02;
  private particleIntensity: number = 1.0;
  private activeMessage: string = 'KINO NEXUS // STRUMIEŃ SYGNAŁU W CZASIE RZECZYWISTYM';
  
  // Media Playback State
  private isPlaying: boolean = false;
  private currentTrackIdx: number = 0;
  private playbackTimeSec: number = 0;
  private volume: number = 0.8;
  private isMuted: boolean = false;
  private playbackInterval: any = null;

  // Interactive Mouse Coordinates & Waves
  private mouseX: number = 400;
  private mouseY: number = 180;
  private isMouseDown: boolean = false;
  private clickRipples: Array<{ x: number; y: number; radius: number; maxRadius: number; alpha: number; hue: number }> = [];

  // Dynamic Particles
  private particles: Array<{ 
    x: number; 
    y: number; 
    radius: number; 
    vx: number; 
    vy: number; 
    alpha: number;
    hueOffset: number;
  }> = [];

  // Web Audio Synthesizer
  private audioCtx: AudioContext | null = null;
  private oscNode: OscillatorNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;

  constructor() {
    super({
      id: 'node-kino',
      name: '🎬 Kino (Audiovisual Projection & Synth Engine)',
      icon: '🎬',
      description: 'Natywny silnik 60 FPS HTML5 Canvas z dynamicznym sterowaniem odtwarzaniem mediów, syntezatorem i modulacją fali.',
      bellasOwner: 'Sofia Bellas',
      version: '2.0.0-pro',
      status: 'ONLINE',
    });
  }

  protected setupSubscriptions(): void {
    // Nasłuchuj na impulsy od Scribe oraz Bellas
    this.listen('scribe:dispatch', (evt) => {
      if (evt.payload && evt.payload.message) {
        this.triggerProjectionEvent(evt.payload.message, 210, 2.5);
      }
    });

    this.listen('bellas:pulse', (evt) => {
      const msg = `IMPULS BELLAS: ${evt.payload?.memberName || 'Węzeł'} (${evt.payload?.role || 'Architekt'})`;
      this.triggerProjectionEvent(msg, 45, 3.0);
    });

    this.listen('kino:scene_trigger', (evt) => {
      if (evt.payload && evt.payload.hue !== undefined) {
        this.waveHue = evt.payload.hue;
      }
      if (evt.payload?.message) {
        this.activeMessage = evt.payload.message;
        this.updateBannerText();
      }
    });

    this.listen('kino:playback_control', (evt) => {
      if (evt.payload?.action === 'play') this.playMedia();
      if (evt.payload?.action === 'pause') this.pauseMedia();
      if (evt.payload?.action === 'seek' && typeof evt.payload.time === 'number') {
        this.seekMedia(evt.payload.time);
      }
    });
  }

  public mount(targetElement: HTMLElement): void {
    super.mount(targetElement);
    this.initCanvas();
    this.startAnimationLoop();
    this.initAudioSynth();
  }

  public unmount(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }
    this.stopAudioSynth();
    this.canvas = null;
    this.ctx = null;
    super.unmount();
  }

  public render(): void {
    if (!this.container) return;

    const currentTrack = KINO_PRESET_TRACKS[this.currentTrackIdx] || KINO_PRESET_TRACKS[0];
    const progressPct = ((this.playbackTimeSec / currentTrack.durationSec) * 100).toFixed(1);

    this.container.innerHTML = `
      <div class="nx-card p-5 space-y-4 bg-slate-950/90 border border-emerald-500/30 rounded-2xl shadow-2xl">
        
        <!-- Kino Controls Header & Modes -->
        <div class="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/10">
          <div class="flex items-center gap-3">
            <div class="text-3xl p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">🎬</div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-sm tracking-wider uppercase text-emerald-400">Silnik Kina Nexus v2.0</h3>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30">SOFIA BELLAS</span>
              </div>
              <p class="text-xs text-slate-400">Interaktywny odtwarzacz mediów // Natywny Canvas 60 FPS // Modulacja Syntezatora</p>
            </div>
          </div>

          {/* Visualizer Mode Selectors */}
          <div class="flex flex-wrap items-center gap-1.5">
            <button id="kino-mode-wave" class="px-2.5 py-1 text-xs rounded-lg font-mono transition-all ${this.visualizerMode === 'CYBER_WAVE' ? 'bg-cyan-500 text-black font-bold' : 'bg-white/5 text-cyan-300 border border-cyan-500/30 hover:bg-white/10'}">
              🌊 Fala Harmoniczna
            </button>
            <button id="kino-mode-particles" class="px-2.5 py-1 text-xs rounded-lg font-mono transition-all ${this.visualizerMode === 'QUANTUM_PARTICLES' ? 'bg-emerald-500 text-black font-bold' : 'bg-white/5 text-emerald-300 border border-emerald-500/30 hover:bg-white/10'}">
              ✨ Cząstki Kwantowe
            </button>
            <button id="kino-mode-bars" class="px-2.5 py-1 text-xs rounded-lg font-mono transition-all ${this.visualizerMode === 'BIO_SPECTRAL' ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 text-amber-300 border border-amber-500/30 hover:bg-white/10'}">
              📊 Widmo Spektralne
            </button>
            <button id="kino-mode-vortex" class="px-2.5 py-1 text-xs rounded-lg font-mono transition-all ${this.visualizerMode === 'NEURAL_VORTEX' ? 'bg-purple-500 text-black font-bold' : 'bg-white/5 text-purple-300 border border-purple-500/30 hover:bg-white/10'}">
              🌀 Wir Synaptyczny
            </button>
          </div>
        </div>

        <!-- Interactive Canvas Area -->
        <div class="relative w-full h-[360px] bg-[#020408] rounded-xl border border-emerald-500/20 overflow-hidden shadow-2xl flex items-center justify-center cursor-crosshair group">
          <canvas id="kino-canvas" class="w-full h-full block"></canvas>

          <!-- Floating Interaction Guide -->
          <div class="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur border border-white/10 text-[10px] font-mono text-slate-400 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
            🖱️ Przesuń kursor: Modulacja częstotliwości • Kliknij: Fala uderzeniowa & Synteza
          </div>

          <!-- Live Banner Overlay -->
          <div class="absolute bottom-3 left-3 right-3 p-2.5 bg-black/75 backdrop-blur-md border border-white/10 rounded-lg flex items-center justify-between pointer-events-none">
            <div class="flex items-center gap-2 text-xs font-mono text-emerald-300 truncate">
              <span class="w-2 h-2 rounded-full ${this.isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}"></span>
              <span id="kino-banner-text" class="truncate">${this.activeMessage}</span>
            </div>
            <div class="text-[10px] text-slate-400 font-mono shrink-0 flex items-center gap-2">
              <span id="kino-coords-text">POS: [400, 180]</span>
              <span>•</span>
              <span class="text-emerald-400">${this.visualizerMode}</span>
            </div>
          </div>
        </div>

        <!-- Media Playback Control Bar -->
        <div class="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
          
          {/* Track Info & Time */}
          <div class="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 min-w-0">
              <span class="text-emerald-400 font-bold">▶ ODTWARZACZ:</span>
              <span id="kino-track-title" class="text-white font-semibold truncate">${currentTrack.title}</span>
              <span class="text-slate-400 text-[10px]">(${currentTrack.author})</span>
            </div>
            <div class="text-slate-300 shrink-0 font-mono">
              <span id="kino-current-time">${this.formatTime(this.playbackTimeSec)}</span> / 
              <span id="kino-total-time">${this.formatTime(currentTrack.durationSec)}</span>
            </div>
          </div>

          {/* Interactive Seekbar */}
          <div class="flex items-center gap-3">
            <input 
              id="kino-seekbar" 
              type="range" 
              min="0" 
              max="${currentTrack.durationSec}" 
              value="${this.playbackTimeSec}"
              class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 hover:accent-emerald-300 transition-all"
            />
          </div>

          {/* Transport Buttons & Color Presets */}
          <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
            
            <div class="flex items-center gap-2">
              <button id="kino-btn-prev" class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-all text-xs font-mono" title="Poprzedni utwór">
                ⏮️ Poprzedni
              </button>
              
              <button id="kino-btn-toggle" class="px-4 py-2 rounded-xl ${this.isPlaying ? 'bg-amber-500 hover:bg-amber-400 text-black' : 'bg-emerald-500 hover:bg-emerald-400 text-black'} font-bold font-mono text-xs flex items-center gap-1.5 transition-all shadow-lg">
                <span id="kino-play-icon">${this.isPlaying ? '⏸️ Wstrzymaj' : '▶️ Odtwórz'}</span>
              </button>

              <button id="kino-btn-next" class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-all text-xs font-mono" title="Następny utwór">
                ⏭️ Następny
              </button>

              <button id="kino-btn-stop" class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-all text-xs font-mono" title="Zatrzymaj">
                ⏹️ Stop
              </button>
            </div>

            {/* Presets Trigger Bar */}
            <div class="flex flex-wrap items-center gap-1.5">
              <button id="kino-preset-blue" class="px-2.5 py-1 text-[11px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-lg hover:bg-cyan-500/30 font-mono transition-all">
                Błękit Próżni
              </button>
              <button id="kino-preset-emerald" class="px-2.5 py-1 text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg hover:bg-emerald-500/30 font-mono transition-all">
                Zieleń Rdzenia
              </button>
              <button id="kino-preset-amber" class="px-2.5 py-1 text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg hover:bg-amber-500/30 font-mono transition-all">
                Bursztyn Bellas
              </button>
              <button id="kino-preset-violet" class="px-2.5 py-1 text-[11px] bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-lg hover:bg-purple-500/30 font-mono transition-all">
                Purpura Kwantowa
              </button>
            </div>

          </div>
        </div>

      </div>
    `;

    this.initCanvas();
    this.attachEventListeners();
  }

  private initCanvas(): void {
    if (!this.container) return;
    this.canvas = this.container.querySelector('#kino-canvas') as HTMLCanvasElement;
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();

    // Spawn 50 particles
    this.particles = [];
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * (this.canvas.width || 800),
        y: Math.random() * (this.canvas.height || 360),
        radius: Math.random() * 2.5 + 0.8,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        alpha: Math.random() * 0.7 + 0.3,
        hueOffset: Math.random() * 40 - 20,
      });
    }
  }

  private resizeCanvas(): void {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width || 800;
    this.canvas.height = rect.height || 360;
  }

  private initAudioSynth(): void {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    } catch {
      // safe fallback
    }
  }

  private triggerSynthNote(freq: number, duration = 0.3): void {
    if (!this.audioCtx) {
      this.initAudioSynth();
    }
    if (!this.audioCtx) return;

    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      osc.type = this.visualizerMode === 'CYBER_WAVE' ? 'sine' : this.visualizerMode === 'BIO_SPECTRAL' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + duration);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 3, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // ignore
    }
  }

  private stopAudioSynth(): void {
    if (this.audioCtx) {
      try {
        this.audioCtx.close().catch(() => {});
      } catch {}
      this.audioCtx = null;
    }
  }

  public playMedia(): void {
    this.isPlaying = true;
    if (this.playbackInterval) clearInterval(this.playbackInterval);
    
    this.playbackInterval = setInterval(() => {
      const currentTrack = KINO_PRESET_TRACKS[this.currentTrackIdx] || KINO_PRESET_TRACKS[0];
      this.playbackTimeSec += 1;
      if (this.playbackTimeSec >= currentTrack.durationSec) {
        this.nextTrack();
      } else {
        this.updatePlaybackUI();
      }
    }, 1000);

    this.triggerProjectionEvent(`ODTWARZANIE: ${KINO_PRESET_TRACKS[this.currentTrackIdx].title}`, this.waveHue, 2.0);
    this.updatePlayButton();
    this.triggerSynthNote(220, 0.4);
  }

  public pauseMedia(): void {
    this.isPlaying = false;
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }
    this.triggerProjectionEvent('WSTRZYMANO ODTWARZANIE', this.waveHue, 1.0);
    this.updatePlayButton();
  }

  public stopMedia(): void {
    this.isPlaying = false;
    this.playbackTimeSec = 0;
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }
    this.triggerProjectionEvent('ZATRZYMANO KINO NEXUS', this.waveHue, 1.0);
    this.updatePlaybackUI();
    this.updatePlayButton();
  }

  public seekMedia(seconds: number): void {
    const currentTrack = KINO_PRESET_TRACKS[this.currentTrackIdx] || KINO_PRESET_TRACKS[0];
    this.playbackTimeSec = Math.max(0, Math.min(seconds, currentTrack.durationSec));
    this.updatePlaybackUI();
    this.triggerSynthNote(300 + (this.playbackTimeSec * 2), 0.15);
  }

  public nextTrack(): void {
    this.currentTrackIdx = (this.currentTrackIdx + 1) % KINO_PRESET_TRACKS.length;
    this.playbackTimeSec = 0;
    const track = KINO_PRESET_TRACKS[this.currentTrackIdx];
    this.waveHue = track.baseHue;
    this.updatePlaybackUI();
    this.triggerProjectionEvent(`UTWÓR: ${track.title}`, track.baseHue, 2.5);
  }

  public prevTrack(): void {
    this.currentTrackIdx = (this.currentTrackIdx - 1 + KINO_PRESET_TRACKS.length) % KINO_PRESET_TRACKS.length;
    this.playbackTimeSec = 0;
    const track = KINO_PRESET_TRACKS[this.currentTrackIdx];
    this.waveHue = track.baseHue;
    this.updatePlaybackUI();
    this.triggerProjectionEvent(`UTWÓR: ${track.title}`, track.baseHue, 2.5);
  }

  public setVisualizerMode(mode: KinoVisualizerMode): void {
    this.visualizerMode = mode;
    this.render();
  }

  private updatePlaybackUI(): void {
    if (!this.container) return;
    const currentTrack = KINO_PRESET_TRACKS[this.currentTrackIdx] || KINO_PRESET_TRACKS[0];

    const seekbar = this.container.querySelector('#kino-seekbar') as HTMLInputElement;
    if (seekbar) {
      seekbar.max = String(currentTrack.durationSec);
      seekbar.value = String(this.playbackTimeSec);
    }

    const currTimeEl = this.container.querySelector('#kino-current-time');
    if (currTimeEl) currTimeEl.textContent = this.formatTime(this.playbackTimeSec);

    const totalTimeEl = this.container.querySelector('#kino-total-time');
    if (totalTimeEl) totalTimeEl.textContent = this.formatTime(currentTrack.durationSec);

    const titleEl = this.container.querySelector('#kino-track-title');
    if (titleEl) titleEl.textContent = currentTrack.title;
  }

  private updatePlayButton(): void {
    const iconEl = this.container?.querySelector('#kino-play-icon');
    if (iconEl) {
      iconEl.textContent = this.isPlaying ? '⏸️ Wstrzymaj' : '▶️ Odtwórz';
    }
  }

  private updateBannerText(): void {
    const bannerEl = this.container?.querySelector('#kino-banner-text');
    if (bannerEl) bannerEl.textContent = this.activeMessage;
  }

  private formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  public triggerProjectionEvent(message: string, hue: number, intensity: number): void {
    this.activeMessage = message;
    this.waveHue = hue;
    this.particleIntensity = intensity;
    this.updateBannerText();

    // Emit event back to Bridge for Pub/Sub
    this.emit('kino:scene_trigger', {
      message,
      hue,
      visualizerMode: this.visualizerMode,
      timestamp: Date.now(),
    });
  }

  private attachEventListeners(): void {
    if (!this.container) return;

    // Transport buttons
    this.container.querySelector('#kino-btn-toggle')?.addEventListener('click', () => {
      if (this.isPlaying) this.pauseMedia();
      else this.playMedia();
    });

    this.container.querySelector('#kino-btn-stop')?.addEventListener('click', () => {
      this.stopMedia();
    });

    this.container.querySelector('#kino-btn-next')?.addEventListener('click', () => {
      this.nextTrack();
    });

    this.container.querySelector('#kino-btn-prev')?.addEventListener('click', () => {
      this.prevTrack();
    });

    // Seekbar input
    this.container.querySelector('#kino-seekbar')?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.seekMedia(Number(target.value));
    });

    // Visualizer Mode buttons
    this.container.querySelector('#kino-mode-wave')?.addEventListener('click', () => this.setVisualizerMode('CYBER_WAVE'));
    this.container.querySelector('#kino-mode-particles')?.addEventListener('click', () => this.setVisualizerMode('QUANTUM_PARTICLES'));
    this.container.querySelector('#kino-mode-bars')?.addEventListener('click', () => this.setVisualizerMode('BIO_SPECTRAL'));
    this.container.querySelector('#kino-mode-vortex')?.addEventListener('click', () => this.setVisualizerMode('NEURAL_VORTEX'));

    // Color Presets
    this.container.querySelector('#kino-preset-blue')?.addEventListener('click', () => {
      this.triggerProjectionEvent('TRYB KINA: BŁĘKIT PRÓŻNI', 190, 1.8);
      this.triggerSynthNote(440, 0.25);
    });

    this.container.querySelector('#kino-preset-emerald')?.addEventListener('click', () => {
      this.triggerProjectionEvent('TRYB KINA: ZIELEŃ RDZENIA', 145, 2.0);
      this.triggerSynthNote(528, 0.25);
    });

    this.container.querySelector('#kino-preset-amber')?.addEventListener('click', () => {
      this.triggerProjectionEvent('TRYB KINA: BURSZTYN BELLAS', 40, 2.4);
      this.triggerSynthNote(659, 0.25);
    });

    this.container.querySelector('#kino-preset-violet')?.addEventListener('click', () => {
      this.triggerProjectionEvent('TRYB KINA: PURPURA KWANTOWA', 275, 2.8);
      this.triggerSynthNote(784, 0.25);
    });

    // Canvas Interactive Events (Mouse Move, Drag, Click)
    if (this.canvas) {
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas?.getBoundingClientRect();
        if (!rect) return;
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;

        const coordsEl = this.container?.querySelector('#kino-coords-text');
        if (coordsEl) coordsEl.textContent = `POS: [${Math.round(this.mouseX)}, ${Math.round(this.mouseY)}]`;

        if (this.isMouseDown) {
          // Dynamic synth note during drag
          const freq = 150 + (this.mouseX / (rect.width || 800)) * 600;
          this.triggerSynthNote(freq, 0.08);
        }
      });

      this.canvas.addEventListener('mousedown', (e) => {
        this.isMouseDown = true;
        const rect = this.canvas?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.clickRipples.push({
          x,
          y,
          radius: 5,
          maxRadius: 120,
          alpha: 1.0,
          hue: this.waveHue
        });

        // Add 15 burst particles at click location
        for (let i = 0; i < 15; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 4 + 2;
          this.particles.push({
            x,
            y,
            radius: Math.random() * 3 + 1,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1.0,
            hueOffset: Math.random() * 30 - 15
          });
        }

        const noteFreq = 200 + (x / (rect.width || 800)) * 700;
        this.triggerSynthNote(noteFreq, 0.35);
        this.particleIntensity = Math.min(3.5, this.particleIntensity + 0.8);
      });

      window.addEventListener('mouseup', () => {
        this.isMouseDown = false;
      });
    }
  }

  private startAnimationLoop(): void {
    let step = 0;

    const renderFrame = () => {
      if (!this.ctx || !this.canvas || !this.isMounted) return;

      step += this.isPlaying ? this.waveSpeed * 1.5 : this.waveSpeed * 0.7;
      const w = this.canvas.width;
      const h = this.canvas.height;

      // Dynamic mouse influence
      const normMouseX = this.mouseX / w;
      const normMouseY = this.mouseY / h;

      // 1. Soft background clear with motion trail
      this.ctx.fillStyle = 'rgba(2, 4, 8, 0.28)';
      this.ctx.fillRect(0, 0, w, h);

      // 2. Render Selected Visualizer Mode
      if (this.visualizerMode === 'CYBER_WAVE') {
        this.renderCyberWaves(w, h, step, normMouseX, normMouseY);
      } else if (this.visualizerMode === 'QUANTUM_PARTICLES') {
        this.renderQuantumField(w, h, step);
      } else if (this.visualizerMode === 'BIO_SPECTRAL') {
        this.renderBioSpectralBars(w, h, step, normMouseX);
      } else if (this.visualizerMode === 'NEURAL_VORTEX') {
        this.renderNeuralVortex(w, h, step);
      }

      // 3. Render Click Shockwaves / Ripples
      this.renderShockwaves();

      // 4. Render and update floating particles
      this.renderParticles(w, h);

      // Decay intensity
      if (this.particleIntensity > 1.0) {
        this.particleIntensity -= 0.015;
      }

      this.animFrameId = requestAnimationFrame(renderFrame);
    };

    renderFrame();
  }

  private renderCyberWaves(w: number, h: number, step: number, normX: number, normY: number): void {
    if (!this.ctx) return;
    this.ctx.lineWidth = 2.5;

    for (let wave = 0; wave < 4; wave++) {
      this.ctx.beginPath();
      const currentHue = (this.waveHue + wave * 20) % 360;
      this.ctx.strokeStyle = `hsla(${currentHue}, 100%, 60%, ${0.35 + wave * 0.15})`;

      const freqMod = 0.008 + (normX * 0.012);
      const ampMod = (45 + (1 - normY) * 50) * (this.isPlaying ? 1.3 : 0.8);

      for (let x = 0; x < w; x += 4) {
        const y =
          h / 2 +
          Math.sin(x * freqMod + step + wave) * ampMod * Math.cos(step * 0.4) +
          Math.sin(x * 0.025 - step * 1.2) * 20;

        if (x === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();
    }
  }

  private renderQuantumField(w: number, h: number, step: number): void {
    if (!this.ctx) return;
    
    // Connect particles within proximity
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 90) {
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `hsla(${this.waveHue}, 100%, 70%, ${(1 - dist / 90) * 0.3})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }

  private renderBioSpectralBars(w: number, h: number, step: number, normX: number): void {
    if (!this.ctx) return;
    const barCount = 36;
    const barWidth = w / barCount;

    for (let i = 0; i < barCount; i++) {
      const heightFactor = this.isPlaying 
        ? Math.abs(Math.sin(step * 2 + i * 0.35)) * 0.85 + (Math.cos(i * 0.5) * 0.15)
        : Math.abs(Math.sin(step * 0.8 + i * 0.2)) * 0.3;

      const barH = Math.max(8, heightFactor * (h * 0.75) * (1 + normX * 0.4));
      const x = i * barWidth;
      const y = h - barH;

      const grad = this.ctx.createLinearGradient(0, y, 0, h);
      grad.addColorStop(0, `hsl(${(this.waveHue + i * 4) % 360}, 100%, 65%)`);
      grad.addColorStop(1, 'rgba(5, 10, 20, 0.9)');

      this.ctx.fillStyle = grad;
      this.ctx.fillRect(x + 2, y, barWidth - 4, barH);
    }
  }

  private renderNeuralVortex(w: number, h: number, step: number): void {
    if (!this.ctx) return;
    const cx = this.mouseX;
    const cy = this.mouseY;

    for (let ring = 0; ring < 5; ring++) {
      const radius = 30 + ring * 28 + Math.sin(step * 2 + ring) * 12;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `hsla(${(this.waveHue + ring * 30) % 360}, 100%, 65%, ${0.5 - ring * 0.08})`;
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();
    }
  }

  private renderShockwaves(): void {
    if (!this.ctx) return;

    for (let i = this.clickRipples.length - 1; i >= 0; i--) {
      const r = this.clickRipples[i];
      r.radius += 3.5;
      r.alpha -= 0.025;

      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        this.clickRipples.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `hsla(${r.hue}, 100%, 70%, ${r.alpha})`;
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();
    }
  }

  private renderParticles(w: number, h: number): void {
    if (!this.ctx) return;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * this.particleIntensity;
      p.y += p.vy * this.particleIntensity;

      // Wrap around bounds
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const particleHue = (this.waveHue + p.hueOffset + 360) % 360;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${particleHue}, 100%, 75%, ${p.alpha})`;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = `hsl(${particleHue}, 100%, 50%)`;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Clean up excess temporary particles
      if (this.particles.length > 50 && i >= 50) {
        p.alpha -= 0.01;
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }
  }
}
