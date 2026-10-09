import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNexus } from '../context/NexusContext';
import { GenesisMilestone } from '../types';
import { GenesisMilestoneDetailModal } from '../components/GenesisMilestoneDetailModal';
import { NewGenesisMilestoneModal } from '../components/NewGenesisMilestoneModal';
import {
  History,
  Sparkles,
  Flame,
  Globe,
  Users,
  Shield,
  Layers,
  Brain,
  Calendar,
  Zap,
  Search,
  Filter,
  Plus,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Eye,
  BookOpen,
  Code2,
  Award,
  CheckCircle2,
  Activity,
  Cpu,
  ArrowRight,
  Compass,
  Share2
} from 'lucide-react';

export const GenesisView: React.FC = () => {
  const {
    genesisMilestones,
    architects,
    worlds,
    projects,
    language,
    playCyberSound,
    triggerHaptic,
    setActiveArchitectModalId,
    setActiveProjectId,
    setActiveWorldSlug,
    endorseGenesisMilestone
  } = useNexus();

  // Component State
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'CHRONO_STREAM' | 'NEURAL_MATRIX' | 'EPOCH_SCRUBBER'>('CHRONO_STREAM');
  const [activeEpochIndex, setActiveEpochIndex] = useState<number>(0);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(false);
  const [inspectedMilestone, setInspectedMilestone] = useState<GenesisMilestone | null>(null);
  const [isProposeModalOpen, setIsProposeModalOpen] = useState<boolean>(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background Canvas Particle & Neural Laser Network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(0, 240, 255, ' : 'rgba(168, 85, 247, ',
      alpha: Math.random() * 0.5 + 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render subtle cyber grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render particles & connecting laser synapses
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Filtered milestones
  const filteredMilestones = useMemo(() => {
    return genesisMilestones.filter(m => {
      const matchesCategory = selectedCategory === 'ALL' || m.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesText =
        m.title.toLowerCase().includes(q) ||
        m.epoch.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (m.subtitle && m.subtitle.toLowerCase().includes(q)) ||
        (m.significanceTag && m.significanceTag.toLowerCase().includes(q)) ||
        m.architectsInvolved.some(a => a.toLowerCase().includes(q));

      return matchesCategory && matchesText;
    });
  }, [genesisMilestones, selectedCategory, searchQuery]);

  // Autoplay Scrubber Effect
  useEffect(() => {
    let interval: any;
    if (isAutoplay && filteredMilestones.length > 0) {
      interval = setInterval(() => {
        setActiveEpochIndex(prev => {
          const next = (prev + 1) % filteredMilestones.length;
          playCyberSound('synapse');
          return next;
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isAutoplay, filteredMilestones.length, playCyberSound]);

  // Category Colors
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'CORE':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]';
      case 'AI':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
      case 'WORLD':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
      case 'COMMUNITY':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
      case 'GOVERNANCE':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]';
      default:
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Brain':
        return <Brain className="w-5 h-5 text-purple-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-emerald-400" />;
      case 'Users':
        return <Users className="w-5 h-5 text-amber-400" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-rose-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-cyan-400" />;
      default:
        return <History className="w-5 h-5 text-cyan-400" />;
    }
  };

  const activeScrubberMilestone = filteredMilestones[activeEpochIndex] || filteredMilestones[0];

  return (
    <div className="relative min-h-screen bg-[#050811] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans overflow-hidden">
      
      {/* Background Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* HERO HUD HEADER */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#070d1d]/90 via-[#0a1228]/90 to-[#0d0a20]/90 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.15)] backdrop-blur-xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-950/90 text-cyan-400 border border-cyan-500/40 text-[11px] font-mono-tech font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                  <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>NEXUS CHRONICLE ENGINE v4.0</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30 text-[10px] font-mono-tech">
                  {genesisMilestones.length} {language === 'PL' ? 'KROKÓW GENESIS' : 'GENESIS STEPS'}
                </span>
              </div>

              <h1 className="font-cyber font-extrabold text-2xl sm:text-4xl text-white tracking-wide">
                NEXUS GENESIS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-amber-400">// LIVING TIMELINE</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-3xl leading-relaxed">
                {language === 'PL'
                  ? 'Interaktywna ksiega genezy ekosystemu Nexus. Prześledź ewolucję pierwotnych światów, przełomowych projektów, sojuszy architektów oraz historycznych decyzji Rady.'
                  : 'Interactive chronicle tracing the historical evolution of sovereign worlds, groundbreaking projects, founding architect alliances, and foundational covenants.'}
              </p>
            </div>

            {/* Action & View Mode Switcher */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  playCyberSound('click');
                  triggerHaptic();
                  setIsProposeModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-cyan-500 text-white font-cyber font-bold text-xs tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-cyan-200" />
                <span>{language === 'PL' ? 'PROPOZYCJA REKORDU GENESIS' : 'PROPOSE GENESIS RECORD'}</span>
              </button>

              {/* View Mode Tabs */}
              <div className="flex items-center bg-[#070b16] p-1 rounded-2xl border border-cyan-500/30 text-xs font-mono-tech">
                <button
                  onClick={() => {
                    setViewMode('CHRONO_STREAM');
                    playCyberSound('click');
                  }}
                  className={`flex-1 px-3 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    viewMode === 'CHRONO_STREAM'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.3)] font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>{language === 'PL' ? 'KRONIKA' : 'STREAM'}</span>
                </button>

                <button
                  onClick={() => {
                    setViewMode('NEURAL_MATRIX');
                    playCyberSound('click');
                  }}
                  className={`flex-1 px-3 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    viewMode === 'NEURAL_MATRIX'
                      ? 'bg-purple-950 text-purple-300 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)] font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{language === 'PL' ? 'MACIERZ' : 'MATRIX'}</span>
                </button>

                <button
                  onClick={() => {
                    setViewMode('EPOCH_SCRUBBER');
                    playCyberSound('click');
                  }}
                  className={`flex-1 px-3 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    viewMode === 'EPOCH_SCRUBBER'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)] font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{language === 'PL' ? 'SCRUBBER' : 'SCRUBBER'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Ecosystem KPI Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 mt-6 border-t border-cyan-500/20 text-xs font-mono-tech">
            <div className="p-3 rounded-xl bg-[#080f20]/80 border border-cyan-500/20">
              <span className="text-slate-400 text-[10px] uppercase block">{language === 'PL' ? 'Liczba Epok' : 'Total Epochs'}</span>
              <span className="text-lg font-cyber font-bold text-cyan-300 mt-0.5 block">{genesisMilestones.length}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#080f20]/80 border border-emerald-500/20">
              <span className="text-slate-400 text-[10px] uppercase block">{language === 'PL' ? 'Kolebki Świata' : 'Originated Worlds'}</span>
              <span className="text-lg font-cyber font-bold text-emerald-400 mt-0.5 block">{worlds.length}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#080f20]/80 border border-amber-500/20">
              <span className="text-slate-400 text-[10px] uppercase block">{language === 'PL' ? 'Pionierzy Genesis' : 'Founding Architects'}</span>
              <span className="text-lg font-cyber font-bold text-amber-400 mt-0.5 block">{architects.length}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#080f20]/80 border border-purple-500/20">
              <span className="text-slate-400 text-[10px] uppercase block">{language === 'PL' ? 'Zapoczątkowane Projekty' : 'Groundbreaking Builds'}</span>
              <span className="text-lg font-cyber font-bold text-purple-400 mt-0.5 block">{projects.length}</span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-[#080f20]/80 border border-rose-500/20">
              <span className="text-slate-400 text-[10px] uppercase block">{language === 'PL' ? 'Spójność Synaptyczna' : 'Synaptic Alignment'}</span>
              <span className="text-lg font-cyber font-bold text-rose-400 mt-0.5 block">99.8%</span>
            </div>
          </div>
        </div>

        {/* SEARCH & CATEGORY FILTER BAR */}
        <div className="p-4 rounded-2xl bg-[#070c1a]/90 border border-cyan-500/20 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'PL' ? 'Szukaj w kronice genesis (epoka, tytuł, architekt, projekt)...' : 'Search genesis chronicle (epoch, title, architect, project)...'}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0a1024] border border-cyan-500/30 text-white font-mono-tech text-xs placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-mono-tech">
            {['ALL', 'CORE', 'AI', 'WORLD', 'COMMUNITY', 'GOVERNANCE'].map(cat => {
              const count = cat === 'ALL'
                ? genesisMilestones.length
                : genesisMilestones.filter(m => m.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    playCyberSound('click');
                  }}
                  className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)] font-bold'
                      : 'bg-[#090f22] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-black/40 text-slate-300">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* VIEW MODE 1: CHRONO STREAM */}
        {viewMode === 'CHRONO_STREAM' && (
          <div className="relative space-y-8">
            
            {/* Timeline Spine Line */}
            <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-cyan-500 via-purple-500 to-amber-500 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.4)] z-0 transform -translate-x-1/2" />

            {filteredMilestones.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#070b18] border border-cyan-500/20 space-y-3 font-mono-tech">
                <History className="w-8 h-8 text-cyan-400 mx-auto animate-bounce" />
                <p className="text-slate-300 text-sm">
                  {language === 'PL' ? 'Brak wpisów pasujących do kryteriów wyszukiwania.' : 'No genesis milestones match your current query filter.'}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-cyber hover:bg-cyan-900/80 transition-all"
                >
                  {language === 'PL' ? 'Resetuj Filtry' : 'Reset Filters'}
                </button>
              </div>
            ) : (
              filteredMilestones.map((milestone, idx) => {
                const isEven = idx % 2 === 0;
                const isHovered = hoveredNodeId === milestone.id;

                // Resolved entities
                const milestoneArchitects = architects.filter(a => milestone.architectsInvolved.includes(a.id) || milestone.architectsInvolved.includes(a.handle));
                const milestoneWorld = worlds.find(w => w.slug === milestone.worldSlug);
                const milestoneProjects = projects.filter(p => milestone.projectIds?.includes(p.id) || milestone.projectIds?.includes(p.slug));

                return (
                  <div
                    key={milestone.id || idx}
                    onMouseEnter={() => setHoveredNodeId(milestone.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
                  >
                    
                    {/* Node Dot on Central Spine */}
                    <div className="absolute left-4 md:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-[#060a14] transition-all cursor-pointer ${
                        isHovered
                          ? 'scale-125 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.8)]'
                          : 'border-purple-500/80 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${
                          milestone.category === 'CORE' ? 'bg-cyan-400' :
                          milestone.category === 'AI' ? 'bg-purple-400' :
                          milestone.category === 'WORLD' ? 'bg-emerald-400' :
                          milestone.category === 'COMMUNITY' ? 'bg-amber-400' : 'bg-rose-400'
                        } animate-ping`} />
                      </div>
                    </div>

                    {/* Milestone Card (Alternating Left/Right) */}
                    <div className={`pl-12 md:pl-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:col-start-2 md:pl-12'}`}>
                      <div className={`group relative p-6 rounded-2xl bg-[#080d1e]/90 border transition-all duration-300 ${
                        isHovered
                          ? 'border-cyan-400/80 shadow-[0_0_30px_rgba(0,240,255,0.25)] bg-[#0b122a]'
                          : 'border-cyan-500/20 hover:border-cyan-500/40 shadow-lg'
                      }`}>
                        
                        {/* Top Metadata Header */}
                        <div className={`flex items-center gap-2 flex-wrap mb-3 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                          <span className="px-2.5 py-0.5 text-xs font-mono-tech font-bold rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                            {milestone.epoch}
                          </span>
                          <span className={`px-2.5 py-0.5 text-[11px] font-mono-tech rounded border ${getCategoryBadgeClass(milestone.category)}`}>
                            {milestone.category}
                          </span>
                          <span className="text-[11px] font-mono-tech text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-cyan-400" />
                            {milestone.date}
                          </span>
                        </div>

                        {/* Title & Subtitle */}
                        <h3 className="font-cyber font-bold text-lg sm:text-xl text-white group-hover:text-cyan-300 transition-colors">
                          {milestone.title}
                        </h3>
                        {milestone.subtitle && (
                          <p className="text-xs font-mono-tech text-cyan-300/80 mt-0.5">
                            {milestone.subtitle}
                          </p>
                        )}

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-slate-300 font-sans mt-3 leading-relaxed">
                          {milestone.description}
                        </p>

                        {/* Participating Architects */}
                        {milestoneArchitects.length > 0 && (
                          <div className={`mt-4 pt-3 border-t border-cyan-500/15 flex items-center gap-2 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                            <span className="text-[10px] font-mono-tech uppercase text-slate-400">
                              {language === 'PL' ? 'Twórcy:' : 'Builders:'}
                            </span>
                            <div className="flex items-center -space-x-2">
                              {milestoneArchitects.map(arch => (
                                <img
                                  key={arch.id}
                                  src={arch.avatar}
                                  alt={arch.name}
                                  title={`${arch.name} (${arch.role})`}
                                  onClick={e => {
                                    e.stopPropagation();
                                    setActiveArchitectModalId(arch.id);
                                    playCyberSound('click');
                                  }}
                                  className="w-7 h-7 rounded-full border border-cyan-400 hover:scale-125 hover:z-30 transition-all cursor-pointer object-cover"
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Linked World & Groundbreaking Projects */}
                        <div className={`mt-3 flex items-center gap-2 flex-wrap text-xs font-mono-tech ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                          {milestoneWorld && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setActiveWorldSlug(milestoneWorld.slug);
                                playCyberSound('click');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-purple-950/70 border border-purple-500/30 text-purple-300 hover:border-purple-400 flex items-center gap-1 transition-all"
                            >
                              <Globe className="w-3 h-3 text-purple-400" />
                              <span>{milestoneWorld.name}</span>
                            </button>
                          )}

                          {milestoneProjects.map(p => (
                            <button
                              key={p.id}
                              onClick={e => {
                                e.stopPropagation();
                                setActiveProjectId(p.id);
                                playCyberSound('click');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-500/30 text-amber-300 hover:border-amber-400 flex items-center gap-1 transition-all"
                            >
                              <Cpu className="w-3 h-3 text-amber-400" />
                              <span>{p.title}</span>
                            </button>
                          ))}
                        </div>

                        {/* Card Footer Actions */}
                        <div className={`mt-4 pt-3 border-t border-cyan-500/15 flex items-center gap-3 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                          <button
                            onClick={() => {
                              endorseGenesisMilestone(milestone.id);
                              triggerHaptic();
                            }}
                            className="px-3 py-1 rounded-lg bg-amber-950/50 border border-amber-500/30 text-amber-300 hover:bg-amber-900/60 text-[11px] font-mono-tech flex items-center gap-1 transition-all"
                          >
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span>⚡ {milestone.endorsedByCount || 1}</span>
                          </button>

                          <button
                            onClick={() => {
                              playCyberSound('click');
                              setInspectedMilestone(milestone);
                            }}
                            className="px-3.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 hover:text-white text-[11px] font-cyber tracking-wider flex items-center gap-1 transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                          >
                            <Eye className="w-3 h-3 text-cyan-400" />
                            <span>{language === 'PL' ? 'INSPEKCJA KRONIKI' : 'INSPECT DEEP CHRONICLE'}</span>
                          </button>
                        </div>

                      </div>
                    </div>

                  </div>
                );
              })
            )}

          </div>
        )}

        {/* VIEW MODE 2: NEURAL MATRIX GRAPH */}
        {viewMode === 'NEURAL_MATRIX' && (
          <div className="p-6 rounded-3xl bg-[#060a16] border border-cyan-500/30 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h3 className="font-cyber font-bold text-base text-white">
                  {language === 'PL' ? 'SYNAPTYCZNA MACIERZ POWIĄZAŃ GENESIS' : 'GENESIS SYNAPTIC NODE MATRIX'}
                </h3>
              </div>
              <p className="text-xs font-mono-tech text-slate-400">
                {language === 'PL' ? 'Kliknij dowolny węzeł, aby zbadać powiązane światy, architektów i projekty.' : 'Click any milestone node to highlight connected entities.'}
              </p>
            </div>

            {/* Visual Node Grid Map */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMilestones.map(m => {
                const isSelected = inspectedMilestone?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      playCyberSound('click');
                      setInspectedMilestone(m);
                    }}
                    className={`p-5 rounded-2xl bg-[#090f23] border cursor-pointer transition-all hover:scale-[1.02] space-y-3 ${
                      isSelected
                        ? 'border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.4)] bg-[#0e1635]'
                        : 'border-cyan-500/20 hover:border-cyan-400/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-[10px] font-mono-tech font-bold rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                        {m.epoch}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-mono-tech rounded border ${getCategoryBadgeClass(m.category)}`}>
                        {m.category}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/30 shrink-0">
                        {renderIcon(m.icon)}
                      </div>
                      <div>
                        <h4 className="font-cyber font-bold text-sm text-white">
                          {m.title}
                        </h4>
                        <p className="text-[11px] font-mono-tech text-slate-400">
                          {m.date}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-sans line-clamp-2">
                      {m.description}
                    </p>

                    <div className="pt-2 border-t border-cyan-500/15 flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
                      <span>{m.architectsInvolved.length} Architektów</span>
                      <span className="text-amber-400 font-bold">⚡ {m.endorsedByCount || 1} Poparć</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW MODE 3: EPOCH SCRUBBER */}
        {viewMode === 'EPOCH_SCRUBBER' && activeScrubberMilestone && (
          <div className="p-6 rounded-3xl bg-[#060a16] border border-amber-500/30 space-y-6">
            
            {/* Scrubber Controls */}
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-amber-500/20">
              <div>
                <span className="text-[10px] font-mono-tech text-amber-400 uppercase tracking-widest block">
                  {language === 'PL' ? 'KROK OSIA ZASILANY CZASEM' : 'EPOCH STEPPER & TIME MACHINE'}
                </span>
                <h3 className="font-cyber font-bold text-lg text-white mt-0.5">
                  {activeScrubberMilestone.epoch} — {activeScrubberMilestone.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveEpochIndex(prev => Math.max(0, prev - 1));
                    playCyberSound('click');
                  }}
                  disabled={activeEpochIndex === 0}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-40 hover:border-amber-400 hover:text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    setIsAutoplay(!isAutoplay);
                    playCyberSound('click');
                  }}
                  className={`px-4 py-2 rounded-xl border font-cyber text-xs flex items-center gap-2 transition-all ${
                    isAutoplay
                      ? 'bg-amber-950 text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-400'
                  }`}
                >
                  {isAutoplay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isAutoplay ? 'PAUSE CHRONICLE' : 'AUTOPLAY CHRONICLE'}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveEpochIndex(prev => Math.min(filteredMilestones.length - 1, prev + 1));
                    playCyberSound('click');
                  }}
                  disabled={activeEpochIndex === filteredMilestones.length - 1}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-40 hover:border-amber-400 hover:text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Horizontal Epoch Scrubber Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={Math.max(0, filteredMilestones.length - 1)}
                value={activeEpochIndex}
                onChange={e => {
                  setActiveEpochIndex(parseInt(e.target.value));
                  playCyberSound('click');
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono-tech text-slate-400">
                <span>{filteredMilestones[0]?.epoch}</span>
                <span>{filteredMilestones[Math.floor(filteredMilestones.length / 2)]?.epoch}</span>
                <span>{filteredMilestones[filteredMilestones.length - 1]?.epoch}</span>
              </div>
            </div>

            {/* Active Epoch Spotlight Card */}
            <div className="p-6 rounded-2xl bg-[#090f23] border border-amber-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 text-xs font-mono-tech font-bold">
                  {activeScrubberMilestone.epoch}
                </span>
                <span className="text-xs font-mono-tech text-slate-400">
                  {activeScrubberMilestone.date}
                </span>
              </div>

              <h2 className="font-cyber font-extrabold text-2xl text-white">
                {activeScrubberMilestone.title}
              </h2>
              {activeScrubberMilestone.subtitle && (
                <p className="text-xs font-mono-tech text-amber-300">
                  {activeScrubberMilestone.subtitle}
                </p>
              )}

              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {activeScrubberMilestone.longNarrative || activeScrubberMilestone.description}
              </p>

              <div className="pt-4 border-t border-amber-500/20 flex items-center justify-between">
                <button
                  onClick={() => setInspectedMilestone(activeScrubberMilestone)}
                  className="px-5 py-2 rounded-xl bg-amber-950 text-amber-300 border border-amber-400 text-xs font-cyber hover:bg-amber-900 transition-all flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>{language === 'PL' ? 'OTWÓRZ PEŁNY WPIS' : 'INSPECT DEEP RECORD'}</span>
                </button>

                <span className="text-xs font-mono-tech text-slate-400">
                  ⚡ {activeScrubberMilestone.endorsedByCount || 1} Poparć
                </span>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL DIALOGS */}
      <GenesisMilestoneDetailModal
        milestone={inspectedMilestone}
        onClose={() => setInspectedMilestone(null)}
      />

      <NewGenesisMilestoneModal
        isOpen={isProposeModalOpen}
        onClose={() => setIsProposeModalOpen(false)}
      />

    </div>
  );
};
