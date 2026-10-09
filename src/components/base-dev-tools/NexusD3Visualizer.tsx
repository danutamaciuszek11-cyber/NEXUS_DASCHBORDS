import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Activity, 
  Cpu, 
  Server, 
  Zap, 
  RefreshCw, 
  Play, 
  Pause, 
  Sparkles, 
  Sliders, 
  Layers, 
  PieChart, 
  BarChart3, 
  Radio, 
  HardDrive,
  Info,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { Language } from '../../types/base-dev-tools';

export interface StreamDataPoint {
  time: number;
  gpuCycles: number;
  vpsCycles: number;
  cliCycles: number;
  webCycles: number;
  totalThroughput: number;
  activeBatchProofs: number;
}

export interface NodeProver {
  id: string;
  name: string;
  location: string;
  type: 'gpu' | 'vps' | 'cli' | 'web';
  baseThroughput: number;
  currentThroughput: number;
  hardware: string;
  latencyMs: number;
  totalCycleContribution: number;
  status: 'active' | 'proving' | 'bursting';
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface NexusD3VisualizerProps {
  lang: Language;
  onProofInjected?: (cycles: number) => void;
  externalBurstTrigger?: number;
}

export function NexusD3Visualizer({ lang, onProofInjected, externalBurstTrigger }: NexusD3VisualizerProps) {
  // Chart refs
  const chartRef = useRef<SVGSVGElement | null>(null);
  const topologyRef = useRef<SVGSVGElement | null>(null);
  const nodeBarsRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) chartRef.current.innerHTML = '';
      if (topologyRef.current) topologyRef.current.innerHTML = '';
      if (nodeBarsRef.current) nodeBarsRef.current.innerHTML = '';
    };
  }, []);

  // States
  const [chartMode, setChartMode] = useState<'stacked' | 'lines'>('stacked');
  const [timeWindowSec, setTimeWindowSec] = useState<30 | 60 | 120>(60);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-gpu1');
  const [burstToast, setBurstToast] = useState<string | null>(null);
  const [cumulativeCyclesSession, setCumulativeCyclesSession] = useState<number>(482900000);

  // Connected nodes definition
  const [nodes, setNodes] = useState<NodeProver[]>([
    {
      id: 'node-relay',
      name: 'NXL zkVM Relay Core',
      location: 'Global Hub (Zurich)',
      type: 'vps',
      baseThroughput: 0,
      currentThroughput: 0,
      hardware: 'Distributed Consensus Engine',
      latencyMs: 1,
      totalCycleContribution: 1250000000,
      status: 'active'
    },
    {
      id: 'node-gpu1',
      name: 'RTX 4090 Rig #1',
      location: 'Tokyo, JP',
      type: 'gpu',
      baseThroughput: 7400000,
      currentThroughput: 7420000,
      hardware: 'NVIDIA RTX 4090 24GB',
      latencyMs: 18,
      totalCycleContribution: 84210000,
      status: 'proving'
    },
    {
      id: 'node-gpu2',
      name: 'H100 Tensor Cluster',
      location: 'US-East (Virginia)',
      type: 'gpu',
      baseThroughput: 11200000,
      currentThroughput: 11250000,
      hardware: 'NVIDIA H100 PCIe 80GB',
      latencyMs: 24,
      totalCycleContribution: 154200000,
      status: 'proving'
    },
    {
      id: 'node-vps1',
      name: 'Frankfurt EPYC Node',
      location: 'Frankfurt, DE',
      type: 'vps',
      baseThroughput: 3100000,
      currentThroughput: 3120000,
      hardware: 'AMD EPYC 7763 16-Core',
      latencyMs: 12,
      totalCycleContribution: 38900000,
      status: 'proving'
    },
    {
      id: 'node-vps2',
      name: 'Warsaw Prover VPS',
      location: 'Warsaw, PL',
      type: 'vps',
      baseThroughput: 2800000,
      currentThroughput: 2850000,
      hardware: 'AMD Ryzen 9 7950X Dedicated',
      latencyMs: 15,
      totalCycleContribution: 32100000,
      status: 'proving'
    },
    {
      id: 'node-cli1',
      name: 'London Dedicated CLI',
      location: 'London, UK',
      type: 'cli',
      baseThroughput: 1650000,
      currentThroughput: 1680000,
      hardware: 'Intel Core i9-13900K',
      latencyMs: 21,
      totalCycleContribution: 19800000,
      status: 'proving'
    },
    {
      id: 'node-cli2',
      name: 'Singapore Worker',
      location: 'Singapore, SG',
      type: 'cli',
      baseThroughput: 1420000,
      currentThroughput: 1410000,
      hardware: 'Apple M2 Max (12-Core)',
      latencyMs: 38,
      totalCycleContribution: 16400000,
      status: 'proving'
    },
    {
      id: 'node-web1',
      name: 'Local Browser Prover',
      location: 'Client (WebAssembly)',
      type: 'web',
      baseThroughput: 720000,
      currentThroughput: 740000,
      hardware: 'WebAssembly Multi-Threaded Engine',
      latencyMs: 4,
      totalCycleContribution: 8400000,
      status: 'proving'
    }
  ]);

  // Initial stream points
  const [dataPoints, setDataPoints] = useState<StreamDataPoint[]>(() => {
    const now = Date.now();
    const count = 40;
    return Array.from({ length: count }, (_, i) => {
      const t = now - (count - 1 - i) * 1000;
      const gpu = 18600000 + Math.sin(i * 0.4) * 1200000 + (Math.random() - 0.5) * 600000;
      const vps = 5900000 + Math.cos(i * 0.35) * 400000 + (Math.random() - 0.5) * 200000;
      const cli = 3100000 + Math.sin(i * 0.5) * 250000 + (Math.random() - 0.5) * 150000;
      const web = 720000 + (Math.random() - 0.5) * 60000;
      const total = Math.round(gpu + vps + cli + web);
      return {
        time: t,
        gpuCycles: Math.round(gpu),
        vpsCycles: Math.round(vps),
        cliCycles: Math.round(cli),
        webCycles: Math.round(web),
        totalThroughput: total,
        activeBatchProofs: Math.floor(Math.random() * 4) + 12
      };
    });
  });

  // Current real-time summary calculations
  const latestPoint = dataPoints[dataPoints.length - 1] || {
    gpuCycles: 18600000,
    vpsCycles: 5900000,
    cliCycles: 3100000,
    webCycles: 720000,
    totalThroughput: 28320000,
    activeBatchProofs: 14
  };

  // Trigger Burst Event
  const triggerProofBurst = (burstCycles: number = 28000000) => {
    const burstMsg = lang === 'pl'
      ? `Wygenerowano impuls dowodzenia zk-STARK: +${(burstCycles / 1000000).toFixed(1)}M cykli!`
      : `zk-STARK Proof Batch Burst Injected: +${(burstCycles / 1000000).toFixed(1)}M Cycles!`;
    
    setBurstToast(burstMsg);
    setTimeout(() => setBurstToast(null), 3500);

    setCumulativeCyclesSession(prev => prev + burstCycles);
    if (typeof onProofInjected === 'function') onProofInjected(burstCycles);

    // Update node current throughputs dynamically
    setNodes(prev => prev.map(n => {
      if (n.type === 'gpu') {
        return {
          ...n,
          currentThroughput: Math.round(n.baseThroughput * 2.2),
          totalCycleContribution: n.totalCycleContribution + Math.round(burstCycles * 0.6),
          status: 'bursting'
        };
      }
      if (n.type === 'vps') {
        return {
          ...n,
          currentThroughput: Math.round(n.baseThroughput * 1.5),
          totalCycleContribution: n.totalCycleContribution + Math.round(burstCycles * 0.25),
          status: 'bursting'
        };
      }
      return n;
    }));

    // Inject immediately into stream
    setDataPoints(prev => {
      const now = Date.now();
      const last = prev[prev.length - 1];
      const spikedGpu = Math.round((last ? last.gpuCycles : 18000000) + burstCycles * 0.65);
      const spikedVps = Math.round((last ? last.vpsCycles : 5900000) + burstCycles * 0.25);
      const spikedCli = Math.round((last ? last.cliCycles : 3100000) + burstCycles * 0.08);
      const spikedWeb = Math.round((last ? last.webCycles : 720000) + burstCycles * 0.02);
      const spikedTotal = spikedGpu + spikedVps + spikedCli + spikedWeb;

      return [
        ...prev.slice(1),
        {
          time: now,
          gpuCycles: spikedGpu,
          vpsCycles: spikedVps,
          cliCycles: spikedCli,
          webCycles: spikedWeb,
          totalThroughput: spikedTotal,
          activeBatchProofs: 24
        }
      ];
    });

    // Settle back down after 4 seconds
    setTimeout(() => {
      setNodes(prev => prev.map(n => ({
        ...n,
        status: n.id === 'node-relay' ? 'active' : 'proving'
      })));
    }, 4000);
  };

  // Watch external burst trigger if passed
  useEffect(() => {
    if (externalBurstTrigger && externalBurstTrigger > 0) {
      triggerProofBurst(externalBurstTrigger);
    }
  }, [externalBurstTrigger]);

  // Main real-time interval ticker (1 second)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = Date.now();

      // Fluctuate nodes with natural noise
      setNodes(prevNodes => prevNodes.map(node => {
        if (node.id === 'node-relay') return node;
        const noise = (Math.random() - 0.5) * 0.07;
        const target = node.status === 'bursting' 
          ? Math.max(node.baseThroughput, node.currentThroughput * 0.88)
          : Math.round(node.baseThroughput * (1 + noise));
        
        return {
          ...node,
          currentThroughput: target,
          totalCycleContribution: node.totalCycleContribution + Math.round(target / 10)
        };
      }));

      // Generate new stream point
      setDataPoints(prev => {
        const last = prev[prev.length - 1];
        const gpuBase = 18500000 + Math.sin(now / 4000) * 1100000 + (Math.random() - 0.5) * 500000;
        const vpsBase = 5900000 + Math.cos(now / 3500) * 350000 + (Math.random() - 0.5) * 180000;
        const cliBase = 3100000 + Math.sin(now / 2800) * 220000 + (Math.random() - 0.5) * 120000;
        const webBase = 730000 + (Math.random() - 0.5) * 45000;

        // If decaying from burst
        const gpu = Math.round(last && last.gpuCycles > gpuBase * 1.2 ? last.gpuCycles * 0.85 : gpuBase);
        const vps = Math.round(last && last.vpsCycles > vpsBase * 1.2 ? last.vpsCycles * 0.88 : vpsBase);
        const cli = Math.round(cliBase);
        const web = Math.round(webBase);
        const total = gpu + vps + cli + web;

        setCumulativeCyclesSession(acc => acc + total);

        const maxPoints = timeWindowSec;
        const sliced = prev.length >= maxPoints ? prev.slice(prev.length - maxPoints + 1) : prev;

        return [
          ...sliced,
          {
            time: now,
            gpuCycles: gpu,
            vpsCycles: vps,
            cliCycles: cli,
            webCycles: web,
            totalThroughput: total,
            activeBatchProofs: Math.floor(Math.random() * 5) + 12
          }
        ];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeWindowSec]);

  // ==========================================
  // D3 CHART 1: Real-Time Cycles Stream Chart
  // ==========================================
  useEffect(() => {
    if (!chartRef.current || dataPoints.length === 0) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const width = chartRef.current.clientWidth || 700;
    const height = 240;
    const margin = { top: 24, right: 36, bottom: 32, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    if (innerWidth <= 0 || innerHeight <= 0) return;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale
    const extent = d3.extent(dataPoints, (d: StreamDataPoint) => d.time);
    const xMin = extent[0] ?? (Date.now() - timeWindowSec * 1000);
    const xMax = extent[1] ?? Date.now();
    const xScale = d3.scaleTime().domain([new Date(xMin), new Date(xMax)]).range([0, innerWidth]);

    // Maximum value for Y
    const maxThroughput: number = d3.max(dataPoints, (d: StreamDataPoint) => d.totalThroughput) ?? 35000000;
    const yScale = d3.scaleLinear().domain([0, maxThroughput * 1.15]).range([innerHeight, 0]);

    // Defs for gradients & filters
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter').attr('id', 'neon-glow').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Layer Gradients
    const createGrad = (id: string, color: string, op1: number, op2: number) => {
      const grad = defs.append('linearGradient').attr('id', id).attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
      grad.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', op1);
      grad.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', op2);
    };

    createGrad('grad-gpu', '#a855f7', 0.6, 0.05);
    createGrad('grad-vps', '#06b6d4', 0.6, 0.05);
    createGrad('grad-cli', '#10b981', 0.6, 0.05);
    createGrad('grad-web', '#f59e0b', 0.6, 0.05);
    createGrad('grad-total', '#38bdf8', 0.4, 0.0);

    // Subtle horizontal gridlines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.12)
      .call(
        d3.axisLeft(yScale)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#38bdf8')
      .attr('stroke-dasharray', '2,2');

    if (chartMode === 'stacked') {
      // D3 Stack generator
      type SeriesKey = 'webCycles' | 'cliCycles' | 'vpsCycles' | 'gpuCycles';
      const stack = d3.stack<StreamDataPoint>()
        .keys(['webCycles', 'cliCycles', 'vpsCycles', 'gpuCycles'])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

      const series = stack(dataPoints);

      const colors: Record<SeriesKey, { stroke: string; fill: string }> = {
        webCycles: { stroke: '#f59e0b', fill: 'url(#grad-web)' },
        cliCycles: { stroke: '#10b981', fill: 'url(#grad-cli)' },
        vpsCycles: { stroke: '#06b6d4', fill: 'url(#grad-vps)' },
        gpuCycles: { stroke: '#a855f7', fill: 'url(#grad-gpu)' }
      };

      const areaGen = d3.area<d3.SeriesPoint<StreamDataPoint>>()
        .x(d => xScale(d.data.time))
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]))
        .curve(d3.curveMonotoneX);

      series.forEach(s => {
        const key = s.key as SeriesKey;
        const pathData = areaGen(s) || '';
        g.append('path')
          .attr('fill', colors[key].fill)
          .attr('d', pathData);

        // Border line on top of each stack
        const lineGen = d3.line<d3.SeriesPoint<StreamDataPoint>>()
          .x(d => xScale(d.data.time))
          .y(d => yScale(d[1]))
          .curve(d3.curveMonotoneX);

        const lineData = lineGen(s) || '';
        g.append('path')
          .attr('fill', 'none')
          .attr('stroke', colors[key].stroke)
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.8)
          .attr('d', lineData);
      });
    } else {
      // Individual Line Mode
      const drawLine = (key: keyof StreamDataPoint, color: string, width: number) => {
        const line = d3.line<StreamDataPoint>()
          .x(d => xScale(d.time))
          .y(d => yScale(d[key] as number))
          .curve(d3.curveMonotoneX);

        const linePath = line(dataPoints) || '';
        g.append('path')
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', width)
          .attr('d', linePath);
      };

      drawLine('totalThroughput', '#38bdf8', 2.5);
      drawLine('gpuCycles', '#a855f7', 1.8);
      drawLine('vpsCycles', '#06b6d4', 1.5);
      drawLine('cliCycles', '#10b981', 1.5);
      drawLine('webCycles', '#f59e0b', 1.2);
    }

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3.axisBottom(xScale)
          .ticks(Math.max(3, Math.floor(innerWidth / 90)))
          .tickFormat((d: any) => {
            try {
              const dt = new Date(d);
              return dt.toTimeString().split(' ')[0] || '';
            } catch {
              return '';
            }
          })
      )
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Y Axis
    g.append('g')
      .call(
        d3.axisLeft(yScale)
          .ticks(4)
          .tickFormat((d: any) => `${(Number(d) / 1000000).toFixed(1)}M`)
      )
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    g.selectAll('.domain').attr('stroke', '#334155');
    g.selectAll('.tick line').attr('stroke', '#334155');

    // Latest live pulse dot
    const lastP = dataPoints[dataPoints.length - 1];
    if (lastP) {
      const px = xScale(lastP.time);
      const py = yScale(lastP.totalThroughput);

      g.append('circle')
        .attr('cx', px)
        .attr('cy', py)
        .attr('r', 10)
        .attr('fill', 'none')
        .attr('stroke', '#38bdf8')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.5);

      g.append('circle')
        .attr('cx', px)
        .attr('cy', py)
        .attr('r', 5)
        .attr('fill', '#38bdf8')
        .attr('stroke', '#082f49')
        .attr('stroke-width', 2);
    }

  }, [dataPoints, chartMode, timeWindowSec]);

  // ==========================================
  // D3 CHART 2: Force Topology & Flying Proof Packets
  // ==========================================
  useEffect(() => {
    if (!topologyRef.current) return;

    const svg = d3.select(topologyRef.current);
    svg.selectAll('*').remove();

    const width = topologyRef.current.clientWidth || 360;
    const height = 240;

    const g = svg.append('g');

    // Simulation nodes setup
    const simNodes = nodes.map(d => ({ ...d }));

    const links = simNodes
      .filter(n => n.id !== 'node-relay')
      .map(n => ({ source: n.id, target: 'node-relay' }));

    const simulation = d3.forceSimulation(simNodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(68))
      .force('charge', d3.forceManyBody().strength(-110))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(22));

    // Links render
    const linkGroup = g.append('g').attr('class', 'links');
    const linkLines = linkGroup
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3,3');

    // Animated Flying Proof Packet Particles
    const particleGroup = g.append('g').attr('class', 'particles');
    const packetData = links.map(l => ({
      sourceId: (l.source as any).id || l.source,
      progress: Math.random()
    }));

    const particles = particleGroup
      .selectAll('circle')
      .data(packetData)
      .join('circle')
      .attr('r', 3)
      .attr('fill', '#38bdf8')
      .attr('opacity', 0.9);

    // Nodes render
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const nodeItems = nodeGroup
      .selectAll('g')
      .data(simNodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(
        d3.drag<any, any>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on('click', (_, d: any) => {
        setSelectedNodeId(d.id);
      });

    // Node circles with colors
    nodeItems.append('circle')
      .attr('r', (d: any) => (d.id === 'node-relay' ? 18 : d.type === 'gpu' ? 13 : d.type === 'vps' ? 11 : 9))
      .attr('fill', (d: any) => {
        if (d.id === 'node-relay') return '#0284c7';
        if (d.status === 'bursting') return '#f43f5e';
        if (d.type === 'gpu') return '#8b5cf6';
        if (d.type === 'vps') return '#06b6d4';
        if (d.type === 'cli') return '#10b981';
        return '#f59e0b';
      })
      .attr('stroke', (d: any) => (selectedNodeId === d.id ? '#ffffff' : '#090d16'))
      .attr('stroke-width', (d: any) => (selectedNodeId === d.id ? 2.5 : 1.5));

    // Relay badge icon text
    nodeItems.filter((d: any) => d.id === 'node-relay')
      .append('text')
      .text('zk')
      .attr('text-anchor', 'middle')
      .attr('dy', '4px')
      .attr('fill', '#ffffff')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold');

    // Label underneath
    nodeItems.append('text')
      .text((d: any) => (d.id === 'node-relay' ? 'RELAY' : d.name.split(' ')[0]))
      .attr('text-anchor', 'middle')
      .attr('y', (d: any) => (d.id === 'node-relay' ? 26 : 18))
      .attr('fill', (d: any) => (selectedNodeId === d.id ? '#38bdf8' : '#94a3b8'))
      .attr('font-size', '9px')
      .attr('font-family', 'monospace');

    // Animation Loop for Packet Flow
    let animationFrameId: number;
    const animatePackets = () => {
      packetData.forEach(p => {
        p.progress = (p.progress + 0.018) % 1.0;
      });

      particles.attr('transform', (p: any) => {
        const sourceNode = simNodes.find(n => n.id === p.sourceId);
        const targetNode = simNodes.find(n => n.id === 'node-relay');
        if (!sourceNode || !targetNode || sourceNode.x === undefined || targetNode.x === undefined) {
          return 'translate(0,0)';
        }
        const curX = sourceNode.x + (targetNode.x - sourceNode.x) * p.progress;
        const curY = sourceNode.y + (targetNode.y - sourceNode.y) * p.progress;
        return `translate(${curX},${curY})`;
      });

      animationFrameId = requestAnimationFrame(animatePackets);
    };

    animatePackets();

    simulation.on('tick', () => {
      linkLines
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodeItems.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodes, selectedNodeId]);

  // ==========================================
  // D3 CHART 3: Node Prover Throughput Leaderboard
  // ==========================================
  useEffect(() => {
    if (!nodeBarsRef.current) return;

    const svg = d3.select(nodeBarsRef.current);
    svg.selectAll('*').remove();

    const activeWorkers = nodes.filter(n => n.id !== 'node-relay').sort((a, b) => b.currentThroughput - a.currentThroughput);

    const width = nodeBarsRef.current.clientWidth || 360;
    const height = 240;
    const margin = { top: 12, right: 75, bottom: 20, left: 110 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    if (innerWidth <= 0 || innerHeight <= 0) return;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const maxThroughput: number = d3.max(activeWorkers, (d: NodeProver) => d.currentThroughput) ?? 12000000;
    const xScale = d3.scaleLinear().domain([0, maxThroughput * 1.05]).range([0, innerWidth]);
    const yScale = d3.scaleBand().domain(activeWorkers.map(d => d.name)).range([0, innerHeight]).padding(0.24);

    // Bars
    g.selectAll('.bar')
      .data(activeWorkers)
      .join('rect')
      .attr('class', 'bar')
      .attr('y', (d: any) => yScale(d.name) ?? 0)
      .attr('height', yScale.bandwidth())
      .attr('x', 0)
      .attr('width', (d: any) => Math.max(4, xScale(d.currentThroughput)))
      .attr('rx', 4)
      .attr('fill', (d: any) => {
        if (d.status === 'bursting') return '#f43f5e';
        if (d.type === 'gpu') return '#8b5cf6';
        if (d.type === 'vps') return '#06b6d4';
        if (d.type === 'cli') return '#10b981';
        return '#f59e0b';
      })
      .attr('opacity', (d: any) => (selectedNodeId === d.id ? 1 : 0.85))
      .attr('cursor', 'pointer')
      .on('click', (_, d: any) => setSelectedNodeId(d.id));

    // Value Labels on right of bars
    g.selectAll('.val-label')
      .data(activeWorkers)
      .join('text')
      .attr('class', 'val-label')
      .attr('x', (d: any) => xScale(d.currentThroughput) + 6)
      .attr('y', (d: any) => (yScale(d.name) ?? 0) + yScale.bandwidth() / 2 + 3.5)
      .text((d: any) => `${(d.currentThroughput / 1000000).toFixed(2)} M/s`)
      .attr('fill', '#cbd5e1')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold');

    // Left Node Name Labels
    g.selectAll('.name-label')
      .data(activeWorkers)
      .join('text')
      .attr('class', 'name-label')
      .attr('x', -8)
      .attr('y', (d: any) => (yScale(d.name) ?? 0) + yScale.bandwidth() / 2 + 3.5)
      .attr('text-anchor', 'end')
      .text((d: any) => (d.name.length > 14 ? d.name.slice(0, 13) + '..' : d.name))
      .attr('fill', (d: any) => (selectedNodeId === d.id ? '#38bdf8' : '#94a3b8'))
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('cursor', 'pointer')
      .on('click', (_, d: any) => setSelectedNodeId(d.id));

  }, [nodes, selectedNodeId]);

  // Currently selected node object
  const activeSelectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || nodes[1];
  }, [nodes, selectedNodeId]);

  return (
    <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-5 sm:p-7 text-white space-y-6 shadow-2xl">
      {/* Toast Notification for Burst */}
      {burstToast && (
        <div className="flex items-center gap-3 bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border border-cyan-500/50 p-3.5 rounded-xl text-cyan-200 text-xs sm:text-sm shadow-lg animate-pulse">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-semibold">{burstToast}</span>
        </div>
      )}

      {/* Top Header & Telemetry Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-850 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-neutral-100 flex items-center gap-2">
                <span>
                  {lang === 'pl' 
                    ? 'D3.js: Przepustowość Dowodzenia zkVM w Czasie Rzeczywistym' 
                    : 'D3.js Real-Time zk-Proof Cycle Generation & Node Throughput'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono">
                  LIVE STREAM
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                {lang === 'pl'
                  ? 'Wektorowa telemetria D3.js: agregacja cykli składania dowodów zk-STARK i throughput podłączonych węzłów.'
                  : 'High-frequency D3.js telemetry monitoring streaming zk-STARK cycle folding and distributed prover throughput.'}
              </p>
            </div>
          </div>
        </div>

        {/* Live Metrics Quick Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-xl font-mono">
            <span className="text-neutral-500 text-[10px] uppercase block tracking-wider">
              {lang === 'pl' ? 'Przepustowość Sieci' : 'Aggregated Throughput'}
            </span>
            <span className="text-cyan-400 font-extrabold text-sm sm:text-base">
              {(latestPoint.totalThroughput / 1000000).toFixed(2)} Mc/s
            </span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-xl font-mono">
            <span className="text-neutral-500 text-[10px] uppercase block tracking-wider">
              {lang === 'pl' ? 'Wygenerowane Cykle' : 'Session Cycles Proved'}
            </span>
            <span className="text-purple-400 font-extrabold text-sm sm:text-base">
              {(cumulativeCyclesSession / 1000000).toFixed(1)} M
            </span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-xl font-mono">
            <span className="text-neutral-500 text-[10px] uppercase block tracking-wider">
              {lang === 'pl' ? 'Węzły Prover' : 'Active Prover Mesh'}
            </span>
            <span className="text-emerald-400 font-extrabold text-sm sm:text-base">
              {nodes.length - 1} Connected
            </span>
          </div>
        </div>
      </div>

      {/* Stream Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900/50 p-2.5 rounded-xl border border-neutral-800/80">
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs font-mono">
            <button
              onClick={() => setChartMode('stacked')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                chartMode === 'stacked' 
                  ? 'bg-neutral-800 text-cyan-400 shadow-sm font-semibold' 
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{lang === 'pl' ? 'Stos Warstw (Area)' : 'Stacked Area'}</span>
            </button>
            <button
              onClick={() => setChartMode('lines')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                chartMode === 'lines' 
                  ? 'bg-neutral-800 text-cyan-400 shadow-sm font-semibold' 
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{lang === 'pl' ? 'Linie (Multi-Series)' : 'Multi-Line'}</span>
            </button>
          </div>

          {/* Time Resolution */}
          <div className="hidden sm:flex items-center bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs font-mono text-neutral-400">
            <span className="px-2 text-[10px] uppercase text-neutral-500">Window:</span>
            {([30, 60, 120] as const).map(w => (
              <button
                key={w}
                onClick={() => setTimeWindowSec(w)}
                className={`px-2 py-0.5 rounded transition-all ${
                  timeWindowSec === w ? 'bg-neutral-800 text-white font-bold' : 'hover:text-neutral-200'
                }`}
              >
                {w}s
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Pause & Burst Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-1.5 text-xs font-mono py-1.5 px-3 rounded-lg border transition-all ${
              isPaused 
                ? 'bg-amber-950/70 border-amber-500/50 text-amber-300' 
                : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? (lang === 'pl' ? 'Wznów' : 'Resume') : (lang === 'pl' ? 'Wstrzymaj' : 'Pause')}</span>
          </button>

          <button
            onClick={() => triggerProofBurst(32000000)}
            className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>{lang === 'pl' ? 'Impuls Dowodu (+32M Cykli)' : 'Simulate Proof Burst (+32M)'}</span>
          </button>
        </div>
      </div>

      {/* Main D3 Area / Multi-line Chart */}
      <div className="bg-neutral-900/60 rounded-xl p-4 sm:p-5 border border-neutral-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-neutral-300 uppercase tracking-wider font-semibold">
              {lang === 'pl' ? 'Strumień Cykli Dowodzenia zkVM (Cycles/s)' : 'Real-Time zkVM Cycle Folding Stream'}
            </span>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-purple-350">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              GPU Rig ({(latestPoint.gpuCycles / 1000000).toFixed(1)}M)
            </span>
            <span className="flex items-center gap-1.5 text-cyan-350">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              Cloud VPS ({(latestPoint.vpsCycles / 1000000).toFixed(1)}M)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-350">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              CLI Worker ({(latestPoint.cliCycles / 1000000).toFixed(1)}M)
            </span>
            <span className="flex items-center gap-1.5 text-amber-350">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              Web Local ({(latestPoint.webCycles / 1000).toFixed(0)}k)
            </span>
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <svg ref={chartRef} className="w-full h-60" />
        </div>
      </div>

      {/* Two Column Grid: Force Mesh & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* D3 Topology Network Force Graph */}
        <div className="bg-neutral-900/60 rounded-xl p-4 sm:p-5 border border-neutral-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-mono text-neutral-300 uppercase tracking-wider font-semibold">
                {lang === 'pl' ? 'D3 Topologia Węzłów Prover & Pakiety Dowodów' : 'Node Mesh Topology & Proof Packets'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
              Drag & Inspect
            </span>
          </div>

          <div className="w-full h-56 flex items-center justify-center overflow-hidden">
            <svg ref={topologyRef} className="w-full h-full" />
          </div>

          <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between text-[10px] font-mono text-neutral-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Relay Hub
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> GPU Nodes
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> VPS Nodes
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> CLI Nodes
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Web Node
            </span>
          </div>
        </div>

        {/* D3 Real-Time Throughput Leaderboard */}
        <div className="bg-neutral-900/60 rounded-xl p-4 sm:p-5 border border-neutral-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-neutral-300 uppercase tracking-wider font-semibold">
                {lang === 'pl' ? 'Ranking Przepustowości Węzłów' : 'Prover Throughput Leaderboard'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              {nodes.length - 1} Active Provers
            </span>
          </div>

          <div className="w-full h-56 overflow-hidden">
            <svg ref={nodeBarsRef} className="w-full h-full" />
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-400">
            <span>Dynamic D3 Linear Scale</span>
            <span className="text-emerald-400">Autoscaling with Proof Bursts</span>
          </div>
        </div>
      </div>

      {/* Node Inspector Card (Selected from D3 graph or leaderboard) */}
      {activeSelectedNode && (
        <div className="p-4 sm:p-5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full ${
                activeSelectedNode.type === 'gpu' ? 'bg-purple-400' :
                activeSelectedNode.type === 'vps' ? 'bg-cyan-400' :
                activeSelectedNode.type === 'cli' ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
              <h4 className="font-bold text-sm text-neutral-100 font-mono">
                {activeSelectedNode.name}
              </h4>
              <span className="text-xs text-neutral-500 font-mono">
                ({activeSelectedNode.location})
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-neutral-400">Latency: <span className="text-cyan-400">{activeSelectedNode.latencyMs}ms</span></span>
              <span className="text-neutral-400">Status: <span className="text-emerald-400 uppercase">{activeSelectedNode.status}</span></span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-850">
              <span className="text-neutral-500 block text-[10px] uppercase">Current Speed</span>
              <span className="text-cyan-400 font-bold text-sm">
                {(activeSelectedNode.currentThroughput / 1000000).toFixed(2)} Mc/s
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-850">
              <span className="text-neutral-500 block text-[10px] uppercase">Hardware Rig</span>
              <span className="text-white truncate block" title={activeSelectedNode.hardware}>
                {activeSelectedNode.hardware}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-850">
              <span className="text-neutral-500 block text-[10px] uppercase">Total Contributed</span>
              <span className="text-purple-400 font-bold text-sm">
                {(activeSelectedNode.totalCycleContribution / 1000000).toFixed(1)} M cycles
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-850">
              <span className="text-neutral-500 block text-[10px] uppercase">zkVM Architecture</span>
              <span className="text-emerald-400 font-bold text-sm">
                RISC-V 32IM (zk-STARK)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* zk-Proof Folding Pipeline Telemetry */}
      <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
          <span className="uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            {lang === 'pl' ? 'Etapy Cyklu Składania Dowodu zk-STARK' : 'zk-STARK Proof Generation Pipeline'}
          </span>
          <span className="text-cyan-400">128-bit Post-Quantum Conjectured</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px] font-mono">
          <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-neutral-400">1. AET Trace Rows</span>
              <span className="text-emerald-400 font-bold">100%</span>
            </div>
            <div className="w-full bg-neutral-850 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-full" />
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-neutral-400">2. NTT / FFT Poly</span>
              <span className="text-cyan-400 font-bold">96%</span>
            </div>
            <div className="w-full bg-neutral-850 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full w-[96%]" />
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-neutral-400">3. FRI Merkle Query</span>
              <span className="text-purple-400 font-bold">88%</span>
            </div>
            <div className="w-full bg-neutral-850 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-400 h-full w-[88%]" />
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-neutral-400">4. STARK Folding</span>
              <span className="text-amber-400 font-bold">Active</span>
            </div>
            <div className="w-full bg-neutral-850 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full w-[65%] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

