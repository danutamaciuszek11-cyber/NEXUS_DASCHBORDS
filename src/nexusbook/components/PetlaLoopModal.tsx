import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  RotateCcw,
  Sparkles,
  Zap,
  Flame,
  Shield,
  Plus,
  Trash2,
  Save,
  Copy,
  Check,
  Edit3,
  HelpCircle,
  Activity,
  Layers,
  ArrowRight,
  BookmarkCheck,
  AlertTriangle,
  Brain,
  Info
} from 'lucide-react';
import * as d3 from 'd3';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import {
  PetlaPattern,
  getStoredPatterns,
  savePattern,
  deletePattern,
  DEFAULT_CHAPTER_PRESETS
} from '../utils/petlaLoopStorage';
import { soundFx } from '../utils/audioSystem';

interface PetlaLoopModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterTitle?: string;
  bookTitle?: string;
  bookId?: string;
}

interface NodePosition {
  id: 'trigger' | 'thought' | 'emotion' | 'impulse' | 'action' | 'reward';
  label: string;
  subLabel: string;
  color: string;
  angle: number;
  x: number;
  y: number;
  textVal: string;
}

export const PetlaLoopModal: React.FC<PetlaLoopModalProps> = ({
  isOpen,
  onClose,
  chapterTitle = 'Rozdział 3: Pętla',
  bookTitle = 'SYNAPSEEKER',
  bookId = 'synapseeker-architektura-polaczenia'
}) => {
  const [patterns, setPatterns] = useState<PetlaPattern[]>(getStoredPatterns);
  const [selectedPatternId, setSelectedPatternId] = useState<string>(
    patterns[0]?.id || 'preset_unikanie_stresu'
  );
  
  const currentPattern = patterns.find(p => p.id === selectedPatternId) || patterns[0] || DEFAULT_CHAPTER_PRESETS[0];

  const [activeStepId, setActiveStepId] = useState<string>('impulse');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<'visual' | 'editor' | 'analytics'>('visual');

  // Form edit states
  const [formData, setFormData] = useState<PetlaPattern>(currentPattern);

  // D3 SVG Container Ref
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (currentPattern) {
      setFormData(currentPattern);
    }
  }, [selectedPatternId]);

  // Sync back pattern updates when editing
  const handleFormChange = (field: keyof PetlaPattern, val: any) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSaveCurrentPattern = () => {
    soundFx.playSuccess();
    const updated = savePattern(formData);
    setPatterns(updated);
    setIsEditing(false);
  };

  const handleCreateNewPattern = () => {
    soundFx.playClick();
    const newId = `custom_loop_${Date.now()}`;
    const newPat: PetlaPattern = {
      id: newId,
      bookId,
      chapterTitle,
      name: 'Własny Schemat Nawytowy',
      description: 'Opis mojej własnej pętli automatycznej reakcji',
      trigger: 'Określ bodziec zewnętrzny lub wewnętrzny',
      thought: 'Co automatycznie pojawia się w głowie?',
      emotion: 'Jaką emocję odczuwasz w ciele?',
      impulse: 'Pragnienie natychmiastowej reakcji',
      action: 'Nawykowe zachowanie / ucieczka',
      reward: 'Co dostajesz sekundę po zrobieniu tego?',
      longTermCost: 'Jaka jest odroczona cena?',
      pauseStrategy: 'Protokół PAUZY: Jak zatrzymać ten automatyczny cykl?',
      severity: 5,
      shortTermRelief: 7,
      longTermCostRating: 6,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPreset: false
    };
    const updated = savePattern(newPat);
    setPatterns(updated);
    setSelectedPatternId(newId);
    setFormData(newPat);
    setIsEditing(true);
  };

  const handleDeleteCurrent = () => {
    if (formData.isPreset) return;
    soundFx.playClick();
    const updated = deletePattern(formData.id);
    setPatterns(updated);
    if (updated.length > 0) {
      setSelectedPatternId(updated[0].id);
      setFormData(updated[0]);
    }
  };

  const handleCopySummary = () => {
    soundFx.playClick();
    const summaryText = `🧠 NEXUS BEHAVIORAL LOOP MAPPER // ${formData.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. BODZIEC (Trigger): ${formData.trigger}
2. MYŚL (Thought): ${formData.thought}
3. EMOCJA (Emotion): ${formData.emotion}
4. IMPULS (Impulse): ${formData.impulse}  <-- 🛑 [PUNKT PAUZY]
5. DZIAŁANIE (Action): ${formData.action}
6. NAGRODA / ULGA: ${formData.reward}
----------------------------------------
⚠️ DŁUGOTERMINOWA CENA: ${formData.longTermCost}
✦ PROTOKÓŁ PAUZY: ${formData.pauseStrategy}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Wygenerowano w NexusBook // ETERSEEKER PROTOCOL`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // D3 Rendering Logic for Circular Loop Diagram
  useEffect(() => {
    if (!isOpen || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 580;
    const height = 480;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 165;

    const stepsData = [
      { id: 'trigger', label: '1. BODZIEC', subLabel: 'Trigger', color: '#f59e0b', textVal: formData.trigger },
      { id: 'thought', label: '2. MYŚL', subLabel: 'Thought', color: '#00f0ff', textVal: formData.thought },
      { id: 'emotion', label: '3. EMOCJA', subLabel: 'Emotion', color: '#f43f5e', textVal: formData.emotion },
      { id: 'impulse', label: '4. IMPULS', subLabel: 'Impulse', color: '#a855f7', textVal: formData.impulse },
      { id: 'action', label: '5. DZIAŁANIE', subLabel: 'Action', color: '#10b981', textVal: formData.action },
      { id: 'reward', label: '6. ULGA', subLabel: 'Reward', color: '#ffd700', textVal: formData.reward }
    ];

    const nodes: NodePosition[] = stepsData.map((d, i) => {
      // Angles start from top (-90 deg = -PI/2) and go clockwise
      const angle = (i * 2 * Math.PI) / stepsData.length - Math.PI / 2;
      return {
        ...d,
        id: d.id as any,
        angle,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    // Create defs for gradients and markers
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Arrow markers
    nodes.forEach(node => {
      defs.append('marker')
        .attr('id', `arrow-${node.id}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', node.color);
    });

    // Draw main circular ring guide
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255, 255, 255, 0.08)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6,6');

    // Draw connecting Curved Arcs between consecutive nodes
    nodes.forEach((node, i) => {
      const nextNode = nodes[(i + 1) % nodes.length];
      
      // Calculate arc path
      const dx = nextNode.x - node.x;
      const dy = nextNode.y - node.y;
      const dr = radius * 1.05; // curvature radius

      // Offset start and end to avoid overlapping node circles (node r = 32)
      const offset = 34;
      const angleToNext = Math.atan2(dy, dx);
      const startX = node.x + offset * Math.cos(angleToNext);
      const startY = node.y + offset * Math.sin(angleToNext);
      const endX = nextNode.x - offset * Math.cos(angleToNext);
      const endY = nextNode.y - offset * Math.sin(angleToNext);

      const path = svg.append('path')
        .attr('d', `M${startX},${startY} A${dr},${dr} 0 0,1 ${endX},${endY}`)
        .attr('fill', 'none')
        .attr('stroke', node.color)
        .attr('stroke-width', activeStepId === node.id ? 3.5 : 2)
        .attr('stroke-opacity', activeStepId === node.id ? 0.9 : 0.4)
        .attr('marker-end', `url(#arrow-${node.id})`);

      if (activeStepId === node.id) {
        path.attr('filter', 'url(#glow)');
      }
    });

    // Draw PAUSE BREAKPOINT Marker between IMPULS (3) and DZIAŁANIE (4)
    const impulseNode = nodes[3];
    const actionNode = nodes[4];
    const midX = (impulseNode.x + actionNode.x) / 2;
    const midY = (impulseNode.y + actionNode.y) / 2;

    const pauseGroup = svg.append('g')
      .attr('transform', `translate(${midX}, ${midY})`)
      .style('cursor', 'pointer')
      .on('click', () => {
        soundFx.playClick();
        setActiveStepId('impulse');
      });

    pauseGroup.append('circle')
      .attr('r', 16)
      .attr('fill', '#030712')
      .attr('stroke', '#a855f7')
      .attr('stroke-width', 2)
      .attr('filter', 'url(#glow)');

    pauseGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#a855f7')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'monospace')
      .text('🛑');

    pauseGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '26px')
      .attr('fill', '#e9d5ff')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'sans-serif')
      .text('PUNKT PAUZY');

    // Draw Central Pulse Info Node
    const centerGroup = svg.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    centerGroup.append('circle')
      .attr('r', 65)
      .attr('fill', '#0b0f19')
      .attr('stroke', 'rgba(168, 85, 247, 0.3)')
      .attr('stroke-width', 1.5);

    centerGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-12px')
      .attr('fill', '#a855f7')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'monospace')
      .text('CYKL PĘTLI');

    centerGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '8px')
      .attr('fill', '#f8fafc')
      .attr('font-size', '13px')
      .attr('font-weight', '800')
      .text(formData.name.slice(0, 18) + (formData.name.length > 18 ? '...' : ''));

    centerGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '26px')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .text(`Poziom Wpływu: ${formData.severity}/10`);

    // Draw Interactive Nodes
    const nodeGroups = svg.selectAll('.node-group')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node-group')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        soundFx.playClick();
        setActiveStepId(d.id);
      });

    // Outer ring animation for active node
    nodeGroups.append('circle')
      .attr('r', d => d.id === activeStepId ? 36 : 30)
      .attr('fill', '#030712')
      .attr('stroke', d => d.color)
      .attr('stroke-width', d => d.id === activeStepId ? 3 : 1.5)
      .attr('filter', d => d.id === activeStepId ? 'url(#glow)' : null);

    // Inner filled core
    nodeGroups.append('circle')
      .attr('r', d => d.id === activeStepId ? 22 : 18)
      .attr('fill', d => d.color)
      .attr('fill-opacity', d => d.id === activeStepId ? 0.35 : 0.15);

    // Node Number / Step Label
    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-2px')
      .attr('fill', '#ffffff')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'monospace')
      .text((d, i) => `${i + 1}`);

    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '10px')
      .attr('fill', d => d.color)
      .attr('font-size', '9px')
      .attr('font-weight', 'bold')
      .text(d => d.subLabel);

    // Node Outer Text Labels
    nodeGroups.append('text')
      .attr('text-anchor', d => Math.cos(d.angle) > 0.1 ? 'start' : Math.cos(d.angle) < -0.1 ? 'end' : 'middle')
      .attr('dx', d => Math.cos(d.angle) * 44)
      .attr('dy', d => Math.sin(d.angle) * 22 + 4)
      .attr('fill', '#f1f5f9')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(d => d.label);

  }, [isOpen, activeStepId, formData, selectedPatternId]);

  if (!isOpen) return null;

  // Radar Data for Recharts
  const radarData = [
    { subject: 'Poziom Wpływu', A: formData.severity * 10, fullMark: 100 },
    { subject: 'Szybka Ulga', A: formData.shortTermRelief * 10, fullMark: 100 },
    { subject: 'Długofalowy Koszt', A: formData.longTermCostRating * 10, fullMark: 100 },
    { subject: 'Automatyzm', A: 85, fullMark: 100 },
    { subject: 'Moc Pauzy', A: Math.max(10, 100 - formData.severity * 8), fullMark: 100 }
  ];

  const barData = [
    { name: '1. Bodziec', value: 40, color: '#f59e0b' },
    { name: '2. Myśl', value: 60, color: '#00f0ff' },
    { name: '3. Emocja', value: 80, color: '#f43f5e' },
    { name: '4. Impuls', value: 95, color: '#a855f7' },
    { name: '5. Działanie', value: 70, color: '#10b981' },
    { name: '6. Ulga', value: 90, color: '#ffd700' }
  ];

  const getStepDetail = (stepId: string) => {
    switch (stepId) {
      case 'trigger':
        return {
          title: '1. BODZIEC (Trigger)',
          color: 'text-amber-400',
          bgColor: 'bg-amber-950/30 border-amber-500/30',
          value: formData.trigger,
          field: 'trigger' as keyof PetlaPattern,
          explanation: 'Zewnętrzne zdarzenie lub wewnętrzny sygnał sensoryczny/pamięciowy, który wywołuje pierwszą iskierkę w sieci neuronowej.'
        };
      case 'thought':
        return {
          title: '2. MYŚL (Thought)',
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-950/30 border-cyan-500/30',
          value: formData.thought,
          field: 'thought' as keyof PetlaPattern,
          explanation: 'Błyskawiczna, automatyczna interpretacja sytuacyjna oparta na wydeptanych wcześniej schematach („Znam to”).'
        };
      case 'emotion':
        return {
          title: '3. EMOCJA (Emotion)',
          color: 'text-rose-400',
          bgColor: 'bg-rose-950/30 border-rose-500/30',
          value: formData.emotion,
          field: 'emotion' as keyof PetlaPattern,
          explanation: 'Odpowiedź psychosomatyczna w ciele (napięcie w klatce piersiowej, przyspieszone tętno, ścisk w żołądku).'
        };
      case 'impulse':
        return {
          title: '4. IMPULS (Impulse) — PUNKT PAUZY 🛑',
          color: 'text-purple-400',
          bgColor: 'bg-purple-950/40 border-purple-500/50',
          value: formData.impulse,
          field: 'impulse' as keyof PetlaPattern,
          explanation: 'Gwałtowna potrzeba zredukowania napięcia emocjonalnego. TO JEST JEDYNY MOMENT, W KTÓRYM MŻESZ WPROWADZIĆ PAUZĘ!'
        };
      case 'action':
        return {
          title: '5. DZIAŁANIE (Action)',
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-950/30 border-emerald-500/30',
          value: formData.action,
          field: 'action' as keyof PetlaPattern,
          explanation: 'Widoczne zachowanie, ucieczka, zamykanie się w sobie lub sięganie po nawykowy zamiennik.'
        };
      case 'reward':
        return {
          title: '6. NAGRODA / ULGA (Reward)',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-950/30 border-yellow-500/30',
          value: formData.reward,
          field: 'reward' as keyof PetlaPattern,
          explanation: 'Szybkie usunięcie przykrego napięcia. Mózg rejestruje: „To zadziałało!” i wzmacnia to połączenie na przyszłość.'
        };
      default:
        return {
          title: '4. IMPULS (Impulse)',
          color: 'text-purple-400',
          bgColor: 'bg-purple-950/30 border-purple-500/30',
          value: formData.impulse,
          field: 'impulse' as keyof PetlaPattern,
          explanation: 'Potrzeba zredukowania napięcia.'
        };
    }
  };

  const activeStep = getStepDetail(activeStepId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-950 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-950">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                  PĘTLA // MAPA SCHEMATÓW BEHAWIORALNYCH
                </h2>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/30 rounded-full">
                  D3.js Interactive
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Konstrukcja automatycznego cyklu reakcji z analizą <span className="text-purple-300 font-mono font-bold">{chapterTitle}</span> ({bookTitle})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL NAVBAR / PATTERN SELECTOR */}
        <div className="px-4 sm:px-6 py-3 bg-slate-900/40 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          
          {/* Pattern Picker */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            <span className="text-xs font-mono text-slate-400 whitespace-nowrap">SCHEMAT:</span>
            {patterns.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedPatternId(p.id);
                  setFormData(p);
                  setIsEditing(false);
                }}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 border ${
                  p.id === selectedPatternId
                    ? 'bg-purple-600/30 border-purple-500 text-purple-200 shadow-md shadow-purple-950'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {p.isPreset ? <Zap className="w-3 h-3 text-amber-400" /> : <Edit3 className="w-3 h-3 text-cyan-400" />}
                <span>{p.name}</span>
              </button>
            ))}

            <button
              onClick={handleCreateNewPattern}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50 flex items-center gap-1 font-mono"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>NOWA PĘTLA</span>
            </button>
          </div>

          {/* View Tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveViewTab('visual')}
              className={`px-3 py-1 text-xs rounded-lg font-mono transition-colors flex items-center gap-1.5 ${
                activeViewTab === 'visual'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>DIAGRAM D3</span>
            </button>
            <button
              onClick={() => setActiveViewTab('editor')}
              className={`px-3 py-1 text-xs rounded-lg font-mono transition-colors flex items-center gap-1.5 ${
                activeViewTab === 'editor'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>EDYTOR & PAUZA</span>
            </button>
            <button
              onClick={() => setActiveViewTab('analytics')}
              className={`px-3 py-1 text-xs rounded-lg font-mono transition-colors flex items-center gap-1.5 ${
                activeViewTab === 'analytics'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>ANALITYKA RECHARTS</span>
            </button>
          </div>

        </div>

        {/* MODAL MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          
          {/* TAB 1: VISUAL D3 DIAGRAM VIEW */}
          {activeViewTab === 'visual' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: D3 Interactive SVG Canvas */}
              <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center relative min-h-[460px]">
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
                  <span className="text-[11px] font-mono text-purple-300">INTERAKTYWNY CYKL D3.JS</span>
                </div>

                <svg
                  ref={svgRef}
                  width="100%"
                  height="450"
                  viewBox="0 0 580 480"
                  className="w-full h-auto max-w-[580px] drop-shadow-xl"
                />

                <div className="text-center text-xs text-slate-500 mt-2 font-mono">
                  ✦ Kliknij dowolny węzeł na kole, aby zobaczyć szczegóły danego etapu lub zmodyfikować opis.
                </div>
              </div>

              {/* Right Column: Active Node Detail & Pause Protocol */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Active Node Detail Card */}
                <div className={`p-5 rounded-2xl border ${activeStep.bgColor} transition-all space-y-3`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-bold font-mono tracking-wide ${activeStep.color}`}>
                      {activeStep.title}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-black/40 text-slate-300 font-mono">
                      Krok {['trigger', 'thought', 'emotion', 'impulse', 'action', 'reward'].indexOf(activeStepId) + 1} / 6
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    {activeStep.explanation}
                  </p>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Obecna treść w schemacie:</span>
                    {isEditing ? (
                      <textarea
                        value={formData[activeStep.field] as string}
                        onChange={(e) => handleFormChange(activeStep.field, e.target.value)}
                        className="w-full text-xs font-sans text-slate-200 bg-slate-900 border border-slate-700 rounded-lg p-2 focus:outline-none focus:border-purple-500"
                        rows={2}
                      />
                    ) : (
                      <p className="text-sm font-medium text-slate-100">
                        "{formData[activeStep.field] as string}"
                      </p>
                    )}
                  </div>
                </div>

                {/* PAUSE PROTOCOL HERO BOX */}
                <div className="bg-gradient-to-br from-purple-950/60 via-slate-900 to-black p-5 rounded-2xl border border-purple-500/40 space-y-3 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="flex items-center gap-2 text-purple-300 font-mono font-bold text-xs uppercase tracking-wider">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span>PROTOKÓŁ PAUZY (Rozdział 3)</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {formData.pauseStrategy}
                  </p>

                  <div className="p-3 bg-black/60 rounded-xl border border-purple-500/20 text-[11px] text-purple-200 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Zasada Architekta:</strong> „Nie walcz z reakcją. Zauważ moment IMPULSU, zrób 1 sekundę pauzy i świadomie wybierz inną trajektorię.”
                    </span>
                  </div>
                </div>

                {/* Długoterminowa Cena */}
                <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>DŁUGOTERMINOWA CENA SCHEMATU</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {formData.longTermCost}
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: FULL EDITOR & PAUSE MAPPER */}
          {activeViewTab === 'editor' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">EDYTOR PĘTLI NAWYKOWEJ</h3>
                  <p className="text-xs text-slate-400">Edytuj poszczególne etapy, ustaw wskaźniki i zdefiniuj swoją strategię PAUZY.</p>
                </div>

                <div className="flex items-center gap-2">
                  {!formData.isPreset && (
                    <button
                      onClick={handleDeleteCurrent}
                      className="px-3 py-1.5 text-xs rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 hover:bg-rose-900/50 flex items-center gap-1 font-mono"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>USUŃ</span>
                    </button>
                  )}

                  <button
                    onClick={handleSaveCurrentPattern}
                    className="px-4 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>ZAPISZ SCHEMAT</span>
                  </button>
                </div>
              </div>

              {/* General Info inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Nazwa Pętli</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full text-xs font-bold text-slate-100 bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Krótki Opis Sytuacji</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    className="w-full text-xs text-slate-200 bg-slate-900 border border-slate-700 rounded-lg p-2.5 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* 6 Steps Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* 1. BODZIEC */}
                <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-400">1. BODZIEC (Trigger)</span>
                  <textarea
                    value={formData.trigger}
                    onChange={(e) => handleFormChange('trigger', e.target.value)}
                    className="w-full text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg p-2.5 focus:border-amber-500"
                    rows={3}
                  />
                </div>

                {/* 2. MYŚL */}
                <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-xl space-y-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">2. MYŚL (Thought)</span>
                  <textarea
                    value={formData.thought}
                    onChange={(e) => handleFormChange('thought', e.target.value)}
                    className="w-full text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg p-2.5 focus:border-cyan-500"
                    rows={3}
                  />
                </div>

                {/* 3. EMOCJA */}
                <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-2">
                  <span className="text-xs font-mono font-bold text-rose-400">3. EMOCJA (Emotion)</span>
                  <textarea
                    value={formData.emotion}
                    onChange={(e) => handleFormChange('emotion', e.target.value)}
                    className="w-full text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg p-2.5 focus:border-rose-500"
                    rows={3}
                  />
                </div>

                {/* 4. IMPULS */}
                <div className="p-4 bg-purple-950/30 border border-purple-500/40 rounded-xl space-y-2">
                  <span className="text-xs font-mono font-bold text-purple-300">4. IMPULS (Impulse) 🛑</span>
                  <textarea
                    value={formData.impulse}
                    onChange={(e) => handleFormChange('impulse', e.target.value)}
                    className="w-full text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg p-2.5 focus:border-purple-500"
                    rows={3}
                  />
                </div>

                {/* 5. DZIAŁANIE */}
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
                  <span className="text-xs font-mono font-bold text-emerald-400">5. DZIAŁANIE (Action)</span>
                  <textarea
                    value={formData.action}
                    onChange={(e) => handleFormChange('action', e.target.value)}
                    className="w-full text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg p-2.5 focus:border-emerald-500"
                    rows={3}
                  />
                </div>

                {/* 6. NAGRODA */}
                <div className="p-4 bg-yellow-950/20 border border-yellow-500/30 rounded-xl space-y-2">
                  <span className="text-xs font-mono font-bold text-yellow-400">6. ULGA / NAGRODA</span>
                  <textarea
                    value={formData.reward}
                    onChange={(e) => handleFormChange('reward', e.target.value)}
                    className="w-full text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg p-2.5 focus:border-yellow-500"
                    rows={3}
                  />
                </div>

              </div>

              {/* Pause Strategy & Cost */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-950/40 border border-purple-500/40 rounded-xl space-y-2">
                  <label className="text-xs font-mono font-bold text-purple-300 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span>PROTOKÓŁ PAUZY (Jak przerwać pętlę?)</span>
                  </label>
                  <textarea
                    value={formData.pauseStrategy}
                    onChange={(e) => handleFormChange('pauseStrategy', e.target.value)}
                    className="w-full text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg p-2.5 focus:border-purple-500"
                    rows={3}
                  />
                </div>

                <div className="p-4 bg-rose-950/30 border border-rose-500/30 rounded-xl space-y-2">
                  <label className="text-xs font-mono font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>DŁUGOTERMINOWA CENA PĘTLI</span>
                  </label>
                  <textarea
                    value={formData.longTermCost}
                    onChange={(e) => handleFormChange('longTermCost', e.target.value)}
                    className="w-full text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg p-2.5 focus:border-rose-500"
                    rows={3}
                  />
                </div>
              </div>

              {/* Severity Sliders */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>Siła Wpływu na Życie:</span>
                    <span className="text-purple-300 font-bold">{formData.severity} / 10</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={formData.severity}
                    onChange={(e) => handleFormChange('severity', parseInt(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>Szybka Ulga (Krótkoterminowa):</span>
                    <span className="text-amber-300 font-bold">{formData.shortTermRelief} / 10</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={formData.shortTermRelief}
                    onChange={(e) => handleFormChange('shortTermRelief', parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>Długoterminowy Koszt:</span>
                    <span className="text-rose-300 font-bold">{formData.longTermCostRating} / 10</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={formData.longTermCostRating}
                    onChange={(e) => handleFormChange('longTermCostRating', parseInt(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: RECHARTS ANALYTICS VIEW */}
          {activeViewTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              
              {/* Radar Chart */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <span>PROFIL NAPIĘCIA I ULGI (RADAR)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Wizualizacja balansu pomiędzy natychmiastową ulgą a długoterminowym kosztem schematu.
                  </p>
                </div>

                <div className="w-full h-64 my-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                      <Radar
                        name="Schemat"
                        dataKey="A"
                        stroke="#a855f7"
                        fill="#a855f7"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
                  ✦ Wysoki wskaźnik <strong>Szybkiej Ulgi</strong> w połączeniu z wysokim <strong>Długofalowym Kosztem</strong> to klasyczny objaw uzależniającej pętli automatycznej.
                </div>
              </div>

              {/* Bar Chart: Intensity Across Steps */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>INTENSYWNOŚĆ ETAPÓW PĘTLI</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Narastanie ciśnienia psychobiologicznego na poszczególnych stadiach cyklu.
                  </p>
                </div>

                <div className="w-full h-64 my-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#64748b" domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-500/20 text-xs text-purple-200">
                  🛑 <strong>PUNKT PRZEŁAMANIA:</strong> W etapie 4 (Impuls) ciśnienie osiąga maksimum. To optymalny moment na wdrożenie 1-sekundowej PAUZY.
                </div>
              </div>

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>SYNAPSEEKER // ETERSEEKER PROTOCOL</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3.5 py-1.5 text-xs font-mono rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'SKOPIOWANO' : 'KOPIUJ RAPORT PĘTLI'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-colors"
            >
              ZAMKNIJ
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
