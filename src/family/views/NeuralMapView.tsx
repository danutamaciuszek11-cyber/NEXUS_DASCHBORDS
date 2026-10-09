import React, { useState, useRef, useEffect } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Network,
  Globe,
  Users,
  Sparkles,
  Search,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  FolderGit2,
  Bot,
  Zap,
  ArrowRight
} from 'lucide-react';

interface NodePoint {
  id: string;
  type: 'ARCHITECT' | 'WORLD' | 'PROJECT' | 'BELLA' | 'BROTHERHOOD';
  name: string;
  subtitle: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  avatar?: string;
  connections: string[];
  rawObject?: any;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

export const NeuralMapView: React.FC = () => {
  const {
    architects,
    worlds,
    projects,
    missions,
    brotherhoodNodes,
    setActiveProjectId,
    setActiveWorldSlug,
    setActiveBrotherhoodNodeId,
    setCurrentView,
    setShowBellaOverlay,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodePoint | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'ARCHITECT' | 'WORLD' | 'PROJECT' | 'BROTHERHOOD'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Zoom & Pan state
  const [transform, setTransform] = useState<{ x: number; y: number; scale: number }>({
    x: 0,
    y: 0,
    scale: 1.0
  });
  const transformRef = useRef(transform);
  transformRef.current = transform;

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleZoom = (factor: number) => {
    setTransform(prev => {
      const nextScale = Math.min(Math.max(prev.scale * factor, 0.4), 2.5);
      return { ...prev, scale: nextScale };
    });
    playCyberSound('click');
  };

  const handleResetView = () => {
    setTransform({ x: 0, y: 0, scale: 1.0 });
    setSelectedNode(null);
    playCyberSound('beep');
    triggerHaptic();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = 620);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 620;
    };
    window.addEventListener('resize', handleResize);

    // Initialize Background Particles
    const particles: Particle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.5 ? '#00f0ff' : '#a855f7'
    }));

    // Build Node Topology Graph
    const nodes: NodePoint[] = [];

    // 1. Central Core Node: State Bella AI
    nodes.push({
      id: 'node-bella',
      type: 'BELLA',
      name: 'STATE BELLA AI',
      subtitle: 'Neural Nexus Core',
      x: width / 2,
      y: height / 2,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      radius: 28,
      color: '#00f0ff',
      connections: []
    });

    // 2. Nexus Worlds Nodes
    worlds.forEach((w, i) => {
      const angle = (i / worlds.length) * Math.PI * 2;
      const dist = 180 + (i % 2) * 35;
      const x = width / 2 + Math.cos(angle) * dist;
      const y = height / 2 + Math.sin(angle) * dist;
      nodes.push({
        id: `world-${w.slug}`,
        type: 'WORLD',
        name: w.name,
        subtitle: `${w.modules.length} Modułów • ${w.status}`,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: 19,
        color: '#a855f7',
        connections: ['node-bella'],
        rawObject: w
      });
    });

    // 3. Projects Nodes
    projects.forEach((p, i) => {
      const parentWorld = nodes.find(n => n.id === `world-${p.worldSlug}`) || nodes[0];
      const angle = (i / Math.max(projects.length, 1)) * Math.PI * 2;
      const dist = 60 + (i % 3) * 25;
      const x = parentWorld.x + Math.cos(angle) * dist;
      const y = parentWorld.y + Math.sin(angle) * dist;
      nodes.push({
        id: `proj-${p.id}`,
        type: 'PROJECT',
        name: p.title,
        subtitle: p.status,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 15,
        color: '#10b981',
        connections: [parentWorld.id, 'node-bella'],
        rawObject: p
      });
    });

    // 4. Architects Nodes
    architects.forEach((a, i) => {
      const angle = (i / architects.length) * Math.PI * 2;
      const dist = 250 + (i % 2) * 45;
      const x = width / 2 + Math.cos(angle) * dist;
      const y = height / 2 + Math.sin(angle) * dist;

      // Find connections to worlds/projects
      const architectConnections = ['node-bella'];

      // Add project connections
      projects.filter(pr => pr.ownerId === a.id || pr.architectIds?.includes(a.id)).forEach(pr => {
        architectConnections.push(`proj-${pr.id}`);
      });

      // Add world connections
      worlds.filter(w => w.leadArchitectIds.includes(a.id)).forEach(w => {
        architectConnections.push(`world-${w.slug}`);
      });

      nodes.push({
        id: `arch-${a.id}`,
        type: 'ARCHITECT',
        name: a.name,
        subtitle: `${a.role} • ${a.specializations[0] || 'CODE'}`,
        avatar: a.avatar,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: 16,
        color: '#f59e0b',
        connections: Array.from(new Set(architectConnections)),
        rawObject: a
      });
    });

    // 5. Brotherhood Pair Nodes
    brotherhoodNodes.forEach((bNode, i) => {
      const arch1 = nodes.find(n => n.id === `arch-${bNode.architect1Id}`);
      const arch2 = nodes.find(n => n.id === `arch-${bNode.architect2Id}`);

      let bx = width / 2;
      let by = height / 2;

      if (arch1 && arch2) {
        bx = (arch1.x + arch2.x) / 2 + (i % 2 === 0 ? 30 : -30);
        by = (arch1.y + arch2.y) / 2 + (i % 2 === 0 ? -30 : 30);
      }

      const bConnections = ['node-bella'];
      if (arch1) {
        bConnections.push(arch1.id);
        arch1.connections.push(`bnode-${bNode.id}`);
      }
      if (arch2) {
        bConnections.push(arch2.id);
        arch2.connections.push(`bnode-${bNode.id}`);
      }

      const partner1 = architects.find(a => a.id === bNode.architect1Id)?.name || 'Architect 1';
      const partner2 = architects.find(a => a.id === bNode.architect2Id)?.name || 'Architect 2';

      nodes.push({
        id: `bnode-${bNode.id}`,
        type: 'BROTHERHOOD',
        name: `${partner1} × ${partner2}`,
        subtitle: `Match: ${bNode.matchScore}% • Status: ${bNode.status}`,
        x: bx,
        y: by,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        radius: 18,
        color: '#ec4899',
        connections: bConnections,
        rawObject: bNode
      });
    });

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const { x: panX, y: panY, scale } = transformRef.current;

      ctx.save();
      ctx.translate(panX + (width / 2) * (1 - scale), panY + (height / 2) * (1 - scale));
      ctx.scale(scale, scale);

      // Cyber Grid Background Lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let gx = -width; gx < width * 2; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, -height);
        ctx.lineTo(gx, height * 2);
        ctx.stroke();
      }
      for (let gy = -height; gy < height * 2; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-width, gy);
        ctx.lineTo(width * 2, gy);
        ctx.stroke();
      }

      // Draw Background Floating Ambient Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -width || p.x > width * 2) p.vx *= -1;
        if (p.y < -height || p.y > height * 2) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.6 + Math.sin(frame * 0.03 + p.x) * 0.4);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Update positions & bounds damping
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 40 || n.x > width - 40) n.vx *= -1;
        if (n.y < 40 || n.y > height - 40) n.vy *= -1;
      });

      // Draw Connection Synapses (Edges)
      nodes.forEach(source => {
        source.connections.forEach(targetId => {
          const target = nodes.find(n => n.id === targetId);
          if (!target) return;

          const isHighlight =
            selectedNode && (selectedNode.id === source.id || selectedNode.id === target.id);

          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);

          if (isHighlight) {
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.9)';
            ctx.lineWidth = 2.5;
          } else {
            ctx.strokeStyle = source.type === 'ARCHITECT' && target.type === 'ARCHITECT'
              ? 'rgba(245, 158, 11, 0.25)'
              : 'rgba(0, 240, 255, 0.08)';
            ctx.lineWidth = 1;
          }
          ctx.stroke();

          // Animated energy pulse particle traveling along synapse
          if (isHighlight || (frame + source.x) % 90 < 45) {
            const progress = ((frame * 0.012) + (source.x * 0.01)) % 1;
            const px = source.x + (target.x - source.x) * progress;
            const py = source.y + (target.y - source.y) * progress;
            ctx.beginPath();
            ctx.arc(px, py, isHighlight ? 4 : 2, 0, Math.PI * 2);
            ctx.fillStyle = isHighlight ? '#00f0ff' : 'rgba(168, 85, 247, 0.8)';
            ctx.shadowBlur = isHighlight ? 12 : 4;
            ctx.shadowColor = '#00f0ff';
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });

      // Draw Nodes
      nodes.forEach(n => {
        const matchesFilter = filterType === 'ALL' || filterType === n.type;
        const matchesSearch = searchQuery === '' ||
          (n.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (n.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase());
        const isSelected = selectedNode?.id === n.id;
        const opacity = (matchesFilter && matchesSearch) ? 1.0 : 0.2;

        ctx.globalAlpha = opacity;

        // Outer Glow Aura
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + (isSelected ? 10 : 4), 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}${isSelected ? '65' : '18'}`;
        ctx.fill();

        // Core Node Circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.type === 'BELLA' ? '#070a14' : '#090d18';
        ctx.strokeStyle = n.color;
        ctx.lineWidth = isSelected ? 3.5 : 1.5;
        ctx.stroke();
        ctx.fill();

        // Node Title
        ctx.fillStyle = isSelected ? '#00f0ff' : '#ffffff';
        ctx.font = `${isSelected ? 'bold 11px' : '10px'} "Space Grotesk", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(n.name, n.x, n.y + n.radius + 13);

        ctx.globalAlpha = 1.0;
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    // Coordinate conversion
    const screenToWorld = (screenX: number, screenY: number) => {
      const { x: panX, y: panY, scale } = transformRef.current;
      const originX = panX + (width / 2) * (1 - scale);
      const originY = panY + (height / 2) * (1 - scale);
      return {
        x: (screenX - originX) / scale,
        y: (screenY - originY) / scale
      };
    };

    // Mouse & Touch Pan/Select
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX - transformRef.current.x, y: e.clientY - transformRef.current.y };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y
      }));
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const worldPos = screenToWorld(clickX, clickY);

      const hit = nodes.find(n => {
        const dist = Math.hypot(n.x - worldPos.x, n.y - worldPos.y);
        return dist <= n.radius + 8;
      });

      if (hit) {
        setSelectedNode(hit);
        playCyberSound('synapse');
        triggerHaptic();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      setTransform(prev => {
        const nextScale = Math.min(Math.max(prev.scale * zoomFactor, 0.4), 2.5);
        return { ...prev, scale: nextScale };
      });
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [architects, worlds, projects, brotherhoodNodes, selectedNode, filterType, searchQuery, playCyberSound, triggerHaptic]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Map HUD Header */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-cyan-950/40 via-[#0a0f1d] to-purple-950/40 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_35px_rgba(0,240,255,0.15)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950/80 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.4)]">
            <Network className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-cyber font-bold text-xl sm:text-2xl text-white tracking-wide">
                FAMILY NEURAL MAP (HUD)
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                CYBERPUNK TOPOLOGY
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono-tech mt-0.5">
              {language === 'PL'
                ? 'Dynamiczna interaktywna mapa sieci: Architekci • Światy • Projekty • Węzły Brotherhood • State Bella'
                : 'Living neural topology: Architects • Worlds • Projects • Brotherhood Nodes • State Bella'}
            </p>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyan-400/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Highlight node..."
              className="bg-[#0d131f] border border-cyan-500/20 text-xs text-white rounded-xl pl-8 pr-3 py-1.5 focus:border-cyan-400 focus:outline-none w-36 sm:w-44 font-mono-tech"
            />
          </div>

          {(['ALL', 'ARCHITECT', 'WORLD', 'PROJECT', 'BROTHERHOOD'] as const).map(type => (
            <button
              key={type}
              onClick={() => {
                setFilterType(type);
                playCyberSound('click');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono-tech transition-all ${
                filterType === type
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'bg-[#0d131f] text-slate-400 border border-cyan-500/10 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Display */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#05070d] shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-[620px] cursor-grab active:cursor-grabbing" />

        {/* Floating Legend */}
        <div className="absolute top-4 left-4 p-3.5 rounded-2xl bg-[#080c16]/90 border border-cyan-500/20 backdrop-blur-md text-[11px] font-mono-tech text-slate-300 space-y-2 pointer-events-none shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
            <span>STATE BELLA (AI Core)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <span>WORLDS ({worlds.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>PROJECTS ({projects.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>ARCHITECTS ({architects.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_6px_#ec4899]" />
            <span>BROTHERHOOD NODES ({brotherhoodNodes.length})</span>
          </div>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#080c16]/90 border border-cyan-500/30 backdrop-blur-md p-1.5 rounded-2xl text-xs font-mono-tech shadow-lg">
          <button
            onClick={() => handleZoom(1.2)}
            className="p-1.5 rounded-xl bg-[#0d131f] hover:bg-cyan-500/20 text-cyan-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="px-1.5 text-[11px] text-slate-300 font-bold">
            {Math.round(transform.scale * 100)}%
          </span>
          <button
            onClick={() => handleZoom(0.8)}
            className="p-1.5 rounded-xl bg-[#0d131f] hover:bg-cyan-500/20 text-cyan-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="p-1.5 rounded-xl bg-[#0d131f] hover:bg-purple-500/20 text-purple-300 transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Node Inspector Drawer */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 max-w-sm w-full p-5 rounded-2xl bg-[#080c16]/95 border border-cyan-400/50 backdrop-blur-xl shadow-[0_0_35px_rgba(0,240,255,0.3)] animate-in fade-in slide-in-from-bottom-3 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className="px-2 py-0.5 text-[9px] font-mono-tech rounded uppercase font-bold"
                  style={{ backgroundColor: `${selectedNode.color}22`, color: selectedNode.color }}
                >
                  {selectedNode.type}
                </span>
                <h3 className="font-cyber font-bold text-base text-white mt-1">
                  {selectedNode.name}
                </h3>
                <p className="text-xs font-mono-tech text-slate-400">{selectedNode.subtitle}</p>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* Detailed metadata */}
            {selectedNode.rawObject && (
              <div className="p-3 rounded-xl bg-[#0c101a] border border-cyan-500/15 text-xs text-slate-300 space-y-1">
                {selectedNode.type === 'WORLD' && (
                  <>
                    <p className="text-cyan-400 font-mono-tech font-bold">{selectedNode.rawObject.tagline}</p>
                    <p className="text-slate-400 text-[11px] line-clamp-2">{selectedNode.rawObject.description}</p>
                  </>
                )}
                {selectedNode.type === 'PROJECT' && (
                  <>
                    <p className="text-emerald-400 font-mono-tech font-bold">World: {selectedNode.rawObject.worldSlug}</p>
                    <p className="text-slate-400 text-[11px] line-clamp-2">{selectedNode.rawObject.description || selectedNode.rawObject.tagline}</p>
                  </>
                )}
                {selectedNode.type === 'ARCHITECT' && (
                  <>
                    <p className="text-amber-400 font-mono-tech font-bold">
                      Skills: {selectedNode.rawObject.skills?.join(', ') || 'Code & Systems'}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Contribution Score: {selectedNode.rawObject.contributionScore} pts
                    </p>
                  </>
                )}
              </div>
            )}

            <div className="pt-2 border-t border-cyan-500/15 flex items-center gap-2">
              {selectedNode.type === 'BELLA' && (
                <button
                  onClick={() => {
                    setShowBellaOverlay(true);
                    playCyberSound('synapse');
                  }}
                  className="w-full py-2 rounded-xl bg-cyan-500 text-black font-cyber font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                  Consult Bella AI
                </button>
              )}

              {selectedNode.type === 'WORLD' && (
                <button
                  onClick={() => {
                    setActiveWorldSlug(selectedNode.id.replace('world-', ''));
                    setCurrentView('WORLDS');
                    playCyberSound('click');
                  }}
                  className="w-full py-2 rounded-xl bg-purple-600 text-white font-cyber font-bold text-xs shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                >
                  Explore World
                </button>
              )}

              {selectedNode.type === 'PROJECT' && (
                <button
                  onClick={() => {
                    const pid = selectedNode.id.replace('proj-', '');
                    setActiveProjectId(pid);
                    setCurrentView('PROJECTS');
                    playCyberSound('click');
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-500 text-black font-cyber font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Inspect Project
                </button>
              )}

              {selectedNode.type === 'ARCHITECT' && (
                <button
                  onClick={() => {
                    setCurrentView('ARCHITECTS');
                    playCyberSound('click');
                  }}
                  className="w-full py-2 rounded-xl bg-amber-500 text-black font-cyber font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  View Architect Dossier
                </button>
              )}

              {selectedNode.type === 'BROTHERHOOD' && (
                <button
                  onClick={() => {
                    const bId = selectedNode.id.replace('bnode-', '');
                    setActiveBrotherhoodNodeId(bId);
                    setCurrentView('BROTHERHOOD');
                    playCyberSound('synapse');
                  }}
                  className="w-full py-2 rounded-xl bg-pink-500 text-black font-cyber font-bold text-xs shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                >
                  Open Brotherhood Workspace
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
