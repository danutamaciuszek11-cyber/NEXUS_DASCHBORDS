declare module 'd3' {
  export interface SimulationNodeDatum {
    index?: number;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
  }

  export interface SimulationLinkDatum<NodeDatum extends SimulationNodeDatum = SimulationNodeDatum> {
    source: NodeDatum | string | number;
    target: NodeDatum | string | number;
    index?: number;
  }

  export function select(selector: any): any;
  export function selectAll(selector: any): any;
  export function forceSimulation<NodeDatum extends SimulationNodeDatum = SimulationNodeDatum>(nodes?: NodeDatum[]): any;
  export function forceLink<NodeDatum extends SimulationNodeDatum = SimulationNodeDatum, LinkDatum = any>(links?: LinkDatum[]): any;
  export function forceManyBody(): any;
  export function forceCenter(x?: number, y?: number): any;
  export function forceCollide(radius?: number | ((d: any) => number)): any;
  export function drag(): any;
}
