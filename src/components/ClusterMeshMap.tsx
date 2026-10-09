import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { SynapseNodeStatus } from '../types';
import { Server, RefreshCw, Zap, Activity, CheckSquare, Square, Layers, ShieldCheck } from 'lucide-react';

interface ClusterMeshMapProps {
  nodes: SynapseNodeStatus[];
  selectedNodeIds?: string[];
  onToggleSelectNode?: (nodeId: string) => void;
  onSelectAllNodes?: () => void;
  onDeselectAllNodes?: () => void;
  onBatchRestart?: () => void;
  isRestarting?: boolean;
  restartProgress?: number;
  restartingNodeIds?: string[];
}

interface D3Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  protocol: 'gRPC' | 'REST' | 'NXL-NATIVE';
  status: SynapseNodeStatus['status'];
  loadPercent: number;
  throughputRps: number;
  latencyMs: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: string | D3Node;
  target: string | D3Node;
  latencyMs: number;
}

export const ClusterMeshMap: React.FC<ClusterMeshMapProps> = ({
  nodes,
  selectedNodeIds = [],
  onToggleSelectNode = (_: string) => {},
  onSelectAllNodes = () => {},
  onDeselectAllNodes = () => {},
  onBatchRestart = () => {},
  isRestarting = false,
  restartProgress = 0,
  restartingNodeIds = [],
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 800, height: 420 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Resize observer for fluid layout
  useEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === 'undefined') return;
    try {
      const observer = new ResizeObserver((entries) => {
        if (!entries || !entries[0]) return;
        const { width } = entries[0].contentRect;
        if (width > 0) {
          setDimensions({ width, height: Math.max(380, Math.min(500, Math.round(width * 0.48))) });
        }
      });
      observer.observe(containerRef.current);
      return () => {
        try {
          observer.disconnect();
        } catch {}
      };
    } catch (e) {
      console.warn('ResizeObserver warning:', e);
    }
  }, []);

  // Prepare D3 simulation graph data
  const graphData = useMemo(() => {
    const d3Nodes: D3Node[] = nodes.map((n) => ({
      id: n.nodeId,
      name: n.name,
      protocol: n.protocol,
      status: n.status,
      loadPercent: n.loadPercent,
      throughputRps: n.throughputRps,
      latencyMs: n.latencyMs,
    }));

    // Create realistic mesh interconnect links between topology zones
    const d3Links: D3Link[] = [];
    const len = d3Nodes.length;
    for (let i = 0; i < len; i++) {
      // Connect ring neighbor
      const nextIdx = (i + 1) % len;
      const latRing = parseFloat(((d3Nodes[i].latencyMs + d3Nodes[nextIdx].latencyMs) / 2).toFixed(2));
      d3Links.push({ source: d3Nodes[i].id, target: d3Nodes[nextIdx].id, latencyMs: latRing });

      // Connect cross-hub links for mesh resilience
      const crossIdx = (i + 8) % len;
      const latCross = parseFloat(((d3Nodes[i].latencyMs + d3Nodes[crossIdx].latencyMs) / 2 + 0.15).toFixed(2));
      d3Links.push({ source: d3Nodes[i].id, target: d3Nodes[crossIdx].id, latencyMs: latCross });
    }

    return { nodes: d3Nodes, links: d3Links };
  }, [nodes]);

  // Render D3 Force Simulation into SVG
  useEffect(() => {
    if (!svgRef.current) return;

    const width = dimensions.width;
    const height = dimensions.height;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous scene

    // Defs for gradients & filters
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter').attr('id', 'node-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g').attr('class', 'main-group');

    // Create D3 Force Simulation
    const simulation = d3
      .forceSimulation<D3Node>(graphData.nodes)
      .force(
        'link',
        d3
          .forceLink<D3Node, D3Link>(graphData.links)
          .id((d) => d.id)
          .distance(65)
      )
      .force('charge', d3.forceManyBody().strength(-180))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide(28));

    // Draw Links
    const linkGroup = g.append('g').attr('class', 'links');
    const links = linkGroup
      .selectAll('line')
      .data(graphData.links)
      .enter()
      .append('line')
      .attr('stroke', (d: D3Link) => {
        if (d.latencyMs < 1.1) return 'rgba(16, 185, 129, 0.35)'; // Emerald
        if (d.latencyMs < 1.4) return 'rgba(6, 182, 212, 0.4)';  // Cyan
        if (d.latencyMs < 1.7) return 'rgba(245, 158, 11, 0.45)'; // Amber
        return 'rgba(244, 63, 94, 0.5)';                         // Rose
      })
      .attr('stroke-width', (d: D3Link) => (d.latencyMs < 1.2 ? 1.5 : 2.2))
      .attr('stroke-dasharray', (d: D3Link) => (d.latencyMs >= 1.5 ? '4,4' : 'none'));

    // Draw Nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const node = nodeGroup
      .selectAll('g')
      .data(graphData.nodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .on('click', (_, d: D3Node) => {
        onToggleSelectNode(d.id);
      })
      .on('mouseenter', (_, d: D3Node) => {
        setHoveredNodeId(d.id);
      })
      .on('mouseleave', () => {
        setHoveredNodeId(null);
      });

    // Outer Selection Halo
    node
      .append('circle')
      .attr('r', 20)
      .attr('fill', 'none')
      .attr('stroke', (d: D3Node) => {
        if (restartingNodeIds.includes(d.id)) return '#f59e0b'; // Amber pulsing
        if (selectedNodeIds.includes(d.id)) return '#22d3ee';   // Cyan highlight
        return 'none';
      })
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', (d: D3Node) => (restartingNodeIds.includes(d.id) ? '3,3' : 'none'))
      .attr('class', (d: D3Node) => (restartingNodeIds.includes(d.id) ? 'animate-spin' : ''));

    // Node Circle Base
    node
      .append('circle')
      .attr('r', 14)
      .attr('fill', (d: D3Node) => {
        if (restartingNodeIds.includes(d.id)) return '#451a03';
        if (d.loadPercent >= 80) return '#4c0519';
        if (d.loadPercent >= 65) return '#451a03';
        if (d.loadPercent >= 45) return '#083344';
        return '#022c22';
      })
      .attr('stroke', (d: D3Node) => {
        if (restartingNodeIds.includes(d.id)) return '#f59e0b';
        if (d.loadPercent >= 80) return '#f43f5e';
        if (d.loadPercent >= 65) return '#f59e0b';
        if (d.loadPercent >= 45) return '#06b6d4';
        return '#10b981';
      })
      .attr('stroke-width', 2)
      .attr('filter', 'url(#node-glow)');

    // Inner Node Text (Node Index Number)
    node
      .append('text')
      .text((d: D3Node) => d.id.replace('SYNAPSE-NODE-', ''))
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#f8fafc')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold');

    // Node Hover Tooltip Title
    node.append('title').text(
      (d: D3Node) =>
        `${d.id} (${d.name})\nObciążenie: ${d.loadPercent}%\nOpóźnienie: ${d.latencyMs} ms\nPrzepustowość: ${d.throughputRps} RPS\nProtokół: ${d.protocol}`
    );

    // Tick Handler
    simulation.on('tick', () => {
      // Constrain nodes to bounds
      const padding = 25;
      graphData.nodes.forEach((d) => {
        d.x = Math.max(padding, Math.min(width - padding, d.x || width / 2));
        d.y = Math.max(padding, Math.min(height - padding, d.y || height / 2));
      });

      links
        .attr('x1', (d: D3Link) => (d.source as D3Node).x || 0)
        .attr('y1', (d: D3Link) => (d.source as D3Node).y || 0)
        .attr('x2', (d: D3Link) => (d.target as D3Node).x || 0)
        .attr('y2', (d: D3Link) => (d.target as D3Node).y || 0);

      node.attr('transform', (d: D3Node) => `translate(${d.x || 0},${d.y || 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [graphData, dimensions, selectedNodeIds, restartingNodeIds]);

  const allSelected = selectedNodeIds.length === nodes.length;

  return (
    <div className="nx-glass-card rounded-2xl p-5 border border-cyan-500/30 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-cyan-950/20 space-y-4">
      {/* Visual Cluster Map Header Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-sans">
                Interaktywna Mapa Klastra Synapse Mesh (D3 Topology)
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-semibold">
                Graph Force Simulation
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Wizualizacja topologii 24 mikrowęzłów z kodowaniem opóźnień połączeń synaptycznych oraz wybiórczym restartem klastrów.
            </p>
          </div>
        </div>

        {/* Action Controls for Batch Cluster Restart */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          <button
            onClick={() => {
              if (allSelected) {
                onDeselectAllNodes?.();
              } else {
                onSelectAllNodes?.();
              }
            }}
            disabled={isRestarting}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {allSelected ? <CheckSquare className="w-3.5 h-3.5 text-cyan-400" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
            <span>{allSelected ? 'Odznacz Wszystkie' : 'Zaznacz 24 Węzły'}</span>
          </button>

          <button
            onClick={() => onBatchRestart?.()}
            disabled={isRestarting || selectedNodeIds.length === 0}
            className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all ${
              isRestarting
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                : selectedNodeIds.length > 0
                ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRestarting ? 'animate-spin text-amber-400' : ''}`} />
            <span>
              {isRestarting
                ? `Rolling Restart (${restartProgress}%)...`
                : `Batch Cluster Restart (${selectedNodeIds.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* Restart Progress Bar Banner */}
      {isRestarting && (
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 text-xs font-mono text-amber-200 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Protokół Rolling Restart: Sekwencyjne przeładowanie wybranych {selectedNodeIds.length} instancji Synapse Mesh</span>
            </span>
            <strong className="text-amber-300 font-bold">{restartProgress}%</strong>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-amber-500/30">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${restartProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* D3 Simulation SVG Stage */}
      <div
        ref={containerRef}
        className="w-full bg-[#04060d] rounded-xl border border-slate-800/80 overflow-hidden relative"
        style={{ minHeight: '380px' }}
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full block"
        />

        {/* Legend Overlay at bottom left */}
        <div className="absolute bottom-3 left-3 p-2.5 rounded-xl bg-slate-950/80 backdrop-blur border border-slate-800 text-[10px] font-mono text-slate-300 space-y-1.5 shadow-lg">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Legenda Opóźnień Krawędzi</div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-emerald-400 inline-block rounded" />
            <span>&lt; 1.1 ms (Pico-Latency)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-cyan-400 inline-block rounded" />
            <span>1.1 - 1.4 ms (Nominalne)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-amber-400 inline-block rounded" />
            <span>1.4 - 1.7 ms (Bifurkacja)</span>
          </div>
        </div>

        {/* Selected Count Indicator Overlay top right */}
        <div className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 backdrop-blur border border-cyan-500/40 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Zaznaczone do Restartu: <strong className="text-white font-bold">{selectedNodeIds.length} / 24</strong></span>
        </div>
      </div>
    </div>
  );
};
