import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNexus } from '../context/NexusContext';
import { Activity, Zap, Cpu, Sparkles, Shield, Maximize2, Radio, Globe, Layers } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  targetRadius: number;
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
  nodeType: 'core' | 'world' | 'architect' | 'synapse';
  label?: string;
}

export const NexusCoreVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { telemetry, playCyberSound, triggerHaptic, language, setCurrentView } = useNexus();

  const [activeMode, setActiveMode] = useState<'NEURAL' | 'WORLDS' | 'SWARM' | 'MATRIX'>('NEURAL');
  const [expandedNode, setExpandedNode] = useState<{ title: string; category: string; stats: string; details: string } | null>(null);
  const [pulseCount, setPulseCount] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number; isDown: boolean; touchRadius: number }>({
    x: 0,
    y: 0,
    isDown: false,
    touchRadius: 60
  });

  // Initialize Particles based on active mode
  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const centerX = width / 2;
    const centerY = height / 2;

    const colors = ['#00f0ff', '#a855f7', '#00ff9d', '#3b82f6', '#ec4899'];
    const worldLabels = ['NEXUS AI', 'DEV HUB', 'NEXUSBOOK', 'COMICS', 'WEB3', 'SOCIAL', 'PATHSEEKER', 'MEDIA', 'ACADEMY'];

    // 1. Central Core Node
    particles.push({
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      radius: 36,
      targetRadius: 36,
      color: '#00f0ff',
      alpha: 1,
      orbitRadius: 0,
      orbitAngle: 0,
      orbitSpeed: 0,
      nodeType: 'core',
      label: 'NEXUS CORE'
    });

    // 2. Worlds & Architect Nodes (Ring 1 & 2)
    const ring1Count = activeMode === 'WORLDS' ? 9 : 8;
    const ring1Radius = Math.min(width, height) * 0.28;

    for (let i = 0; i < ring1Count; i++) {
      const angle = (i / ring1Count) * Math.PI * 2;
      particles.push({
        x: centerX + Math.cos(angle) * ring1Radius,
        y: centerY + Math.sin(angle) * ring1Radius,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 14,
        targetRadius: 14,
        color: colors[i % colors.length],
        alpha: 0.9,
        orbitRadius: ring1Radius,
        orbitAngle: angle,
        orbitSpeed: 0.003 + (i % 2 === 0 ? 0.001 : -0.001),
        nodeType: 'world',
        label: worldLabels[i % worldLabels.length]
      });
    }

    // 3. Synaptic / Swarm background filaments
    const swarmCount = activeMode === 'SWARM' ? 45 : 25;
    const ring2Radius = Math.min(width, height) * 0.42;

    for (let j = 0; j < swarmCount; j++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = ring1Radius + Math.random() * (ring2Radius - ring1Radius);
      particles.push({
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: 3 + Math.random() * 4,
        targetRadius: 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.4 + Math.random() * 0.4,
        orbitRadius: dist,
        orbitAngle: angle,
        orbitSpeed: (Math.random() * 0.004 + 0.001) * (j % 2 === 0 ? 1 : -1),
        nodeType: 'synapse',
        label: `SYN-${j + 1}`
      });
    }

    particlesRef.current = particles;
  }, [activeMode]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight || 360);

    initParticles(width, height);

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentRect.width && entry.contentRect.height) {
          width = canvas.width = entry.contentRect.width;
          height = canvas.height = entry.contentRect.height;
          initParticles(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Draw subtle cyber grid & concentric radar circles
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.07)';
      ctx.lineWidth = 1;

      // Radar rings
      const rings = [0.18, 0.28, 0.42];
      rings.forEach(r => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.min(width, height) * r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Axis HUD lines
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(centerX, 20);
      ctx.lineTo(centerX, height - 20);
      ctx.moveTo(20, centerY);
      ctx.lineTo(width - 20, centerY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      const particles = particlesRef.current;

      // 2. Update and draw connections (Neural Synapses)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Orbit update
        if (p1.nodeType !== 'core') {
          p1.orbitAngle += p1.orbitSpeed;
          p1.x = centerX + Math.cos(p1.orbitAngle) * p1.orbitRadius;
          p1.y = centerY + Math.sin(p1.orbitAngle) * p1.orbitRadius;
        }

        // Mouse / Touch repulsion & attraction
        const dx = mouseRef.current.x - p1.x;
        const dy = mouseRef.current.y - p1.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distToMouse < mouseRef.current.touchRadius) {
          const force = (mouseRef.current.touchRadius - distToMouse) / mouseRef.current.touchRadius;
          p1.x -= (dx / distToMouse) * force * 6;
          p1.y -= (dy / distToMouse) * force * 6;
          p1.radius = p1.targetRadius * 1.35;
        } else {
          p1.radius += (p1.targetRadius - p1.radius) * 0.1;
        }

        // Draw connections to neighboring nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          const maxDist = p1.nodeType === 'core' || p2.nodeType === 'core' ? 170 : 90;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = p1.nodeType === 'core' ? `rgba(0, 240, 255, ${alpha * 1.5})` : `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = p1.nodeType === 'core' ? 1.5 : 0.8;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            // Synapse energy pulse packet
            if (time % 80 === 0 && Math.random() > 0.6) {
              const packetPos = (time % 60) / 60;
              const px = p1.x + (p2.x - p1.x) * packetPos;
              const py = p1.y + (p2.y - p1.y) * packetPos;
              ctx.beginPath();
              ctx.arc(px, py, 2.5, 0, Math.PI * 2);
              ctx.fillStyle = '#00ff9d';
              ctx.shadowColor = '#00ff9d';
              ctx.shadowBlur = 10;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      // 3. Draw Nodes with Neon Glow & Labels
      particles.forEach((p, idx) => {
        ctx.save();

        const pulse = Math.sin(time * 0.04 + idx) * 0.2 + 1;
        const currentRadius = p.radius * pulse;

        // Glow
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.nodeType === 'core' ? 30 + Math.sin(time * 0.05) * 15 : 12;

        // Core Gradient Fill
        if (p.nodeType === 'core') {
          const grad = ctx.createRadialGradient(p.x, p.y, 4, p.x, p.y, currentRadius);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.3, '#00f0ff');
          grad.addColorStop(1, 'rgba(0, 110, 255, 0.4)');
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = p.color;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Cyber Outer Ring
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.nodeType === 'core' ? 2 : 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius + 5, 0, Math.PI * 2);
        ctx.stroke();

        // Node Label
        if (p.label && (p.nodeType === 'core' || p.nodeType === 'world')) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#e2e8f0';
          ctx.font = p.nodeType === 'core' ? 'bold 12px "Chakra Petch", sans-serif' : '10px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(p.label, p.x, p.y + currentRadius + 16);
        }

        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
    };
  }, [initParticles]);

  // Touch and Click interaction handler
  const handleInteraction = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    mouseRef.current.x = x;
    mouseRef.current.y = y;

    // Check hit on any particle
    const clickedParticle = particlesRef.current.find(p => {
      const dist = Math.hypot(p.x - x, p.y - y);
      return dist < p.radius + 15;
    });

    playCyberSound('node');
    triggerHaptic();
    setPulseCount(prev => prev + 1);

    if (clickedParticle) {
      if (clickedParticle.nodeType === 'core') {
        setExpandedNode({
          title: 'NEXUS CORE NEURAL HUB',
          category: 'CENTRAL SYNAPSE',
          stats: `${telemetry.activeArchitects} Architects • ${telemetry.synapticFlashesPerMin} Synapses/min • ${telemetry.coreHealth}% Health`,
          details: 'Central operating bridge orchestrating human architects and State Bella AI intelligence. Real-time node telemetry synchronized.'
        });
      } else if (clickedParticle.nodeType === 'world') {
        setExpandedNode({
          title: clickedParticle.label || 'NEXUS WORLD',
          category: 'SOVEREIGN DOMAIN',
          stats: `Active module • Synchronized with Nexus Core`,
          details: 'Click to explore the modules, lead architects, active project roadmap, and documentation for this world.'
        });
      } else {
        setExpandedNode({
          title: `SYNAPSE NODE [${clickedParticle.label}]`,
          category: 'DATA STREAM',
          stats: `Latency < 2ms • Encrypted P2P`,
          details: 'Live data filament linking active builder workspaces and State Bella memory shards.'
        });
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handlePointerLeave = () => {
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      id="nexus-core-visualizer-container"
      className="relative w-full h-[360px] md:h-[420px] rounded-2xl nexus-glass border border-cyan-500/20 overflow-hidden shadow-2xl flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handlePointerLeave}
    >
      {/* Background Cyber HUD Grid Lines & Scanlines */}
      <div className="absolute inset-0 nexus-grid-bg opacity-40 pointer-events-none" />
      <div className="absolute inset-0 scanline-effect pointer-events-none" />

      {/* Top HUD Telemetry Bar */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-cyan-500/10 bg-[#080b11]/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cyber font-bold tracking-wider text-xs md:text-sm text-cyan-300">
                NEXUS LIVING NEURAL CORE
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono-tech rounded bg-cyan-900/50 text-cyan-300 border border-cyan-500/20">
                v4.0 ACTIVE
              </span>
            </div>
            <p className="text-[11px] font-mono-tech text-slate-400 hidden sm:block">
              {language === 'PL' ? 'Interaktywny węzeł nerwowy ekosystemu' : 'Interactive neural ecosystem node'}
            </p>
          </div>
        </div>

        {/* HUD Mode Switchers */}
        <div className="flex items-center gap-1 bg-[#0d131f] p-1 rounded-xl border border-cyan-500/20">
          {(['NEURAL', 'WORLDS', 'SWARM', 'MATRIX'] as const).map(mode => (
            <button
              key={mode}
              id={`core-mode-btn-${mode.toLowerCase()}`}
              onClick={() => {
                setActiveMode(mode);
                playCyberSound('click');
                triggerHaptic();
              }}
              className={`px-2.5 py-1 text-[10px] md:text-xs font-mono-tech rounded-lg transition-all duration-200 ${
                activeMode === mode
                  ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_12px_rgba(0,240,255,0.5)]'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <canvas
        ref={canvasRef}
        id="nexus-core-canvas"
        className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        onPointerDown={e => handleInteraction(e.clientX, e.clientY)}
        onPointerMove={handlePointerMove}
      />

      {/* Bottom Live Metrics & HUD Overlay */}
      <div className="relative z-10 flex flex-wrap items-center justify-between p-3 md:p-4 border-t border-cyan-500/10 bg-[#080b11]/80 backdrop-blur-md text-xs font-mono-tech gap-3">
        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-slate-400">Synapses:</span>
            <span className="text-cyan-300 font-bold">{telemetry.synapticFlashesPerMin}/min</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Core Health:</span>
            <span className="text-emerald-300 font-bold">{telemetry.coreHealth.toFixed(1)}%</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400">Throughput:</span>
            <span className="text-purple-300 font-bold">{telemetry.networkThroughput}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
            {language === 'PL' ? 'Dotknij węzła, aby rozwinąć' : 'Tap node to expand telemetry'}
          </span>
          <button
            id="view-full-map-btn"
            onClick={() => {
              setCurrentView('MAP');
              playCyberSound('beep');
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-cyber rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 transition-all duration-200"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{language === 'PL' ? 'Pełna Mapa' : 'Full Map'}</span>
          </button>
        </div>
      </div>

      {/* Expanded Node Telemetry Card (Opens on Touch/Click) */}
      {expandedNode && (
        <div className="absolute top-16 right-4 z-20 w-72 md:w-80 p-4 rounded-xl nexus-glass border border-cyan-400/40 shadow-2xl bg-[#090d16]/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[9px] font-mono-tech px-1.5 py-0.5 rounded bg-cyan-900/50 text-cyan-300 border border-cyan-500/30">
                {expandedNode.category}
              </span>
              <h4 className="font-cyber font-bold text-sm text-cyan-200 mt-1">
                {expandedNode.title}
              </h4>
            </div>
            <button
              onClick={() => setExpandedNode(null)}
              className="text-slate-400 hover:text-cyan-300 p-1 text-xs"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-2 font-sans leading-relaxed">
            {expandedNode.details}
          </p>
          <div className="mt-3 pt-2 border-t border-cyan-500/10 flex items-center justify-between text-[10px] font-mono-tech text-cyan-400">
            <span>{expandedNode.stats}</span>
          </div>
        </div>
      )}
    </div>
  );
};
