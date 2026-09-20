// NXL v1.0 Intention Graph Materializer
import { ManifestAstNode } from './parser';

export interface GraphNode {
  id: string;
  identity?: string;
  signature?: string;
  capabilities: Set<string>;
  neighbors: Set<string>;
}

export class NxlGraph {
  private nodes: Map<string, GraphNode> = new Map();
  private stateMemory: Map<string, any> = new Map();

  build(ast: ManifestAstNode): void {
    this.nodes.clear();

    // Materialize nodes
    for (const n of ast.nodes) {
      this.nodes.set(n.id, {
        id: n.id,
        identity: n.identity,
        signature: n.signature,
        capabilities: new Set(),
        neighbors: new Set(),
      });
    }

    // Materialize relations
    for (const rel of ast.relations) {
      const src = this.nodes.get(rel.source);
      const tgt = this.nodes.get(rel.target);
      if (src && tgt) {
        src.neighbors.add(tgt.id);
        if (rel.bidirectional) {
          tgt.neighbors.add(src.id);
        }
      }
    }

    // Materialize grants
    for (const g of ast.grants) {
      const node = this.nodes.get(g.node);
      if (node) {
        node.capabilities.add(g.capability);
      }
    }

    // Initialize state graph memory
    for (const s of ast.states) {
      this.stateMemory.set(s.path, s.initialValue ?? null);
    }

    for (const a of ast.assignments) {
      this.stateMemory.set(a.target, a.value);
    }
  }

  getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  addNode(id: string, identity?: string, signature?: string): GraphNode {
    const node: GraphNode = {
      id,
      identity,
      signature,
      capabilities: new Set(),
      neighbors: new Set(),
    };
    this.nodes.set(id, node);
    return node;
  }

  grantCapability(nodeId: string, capability: string): void {
    let node = this.nodes.get(nodeId);
    if (!node) {
      node = this.addNode(nodeId);
    }
    node.capabilities.add(capability);
  }

  addRelation(sourceId: string, targetId: string, bidirectional = true): void {
    let src = this.nodes.get(sourceId);
    if (!src) src = this.addNode(sourceId);

    let tgt = this.nodes.get(targetId);
    if (!tgt) tgt = this.addNode(targetId);

    src.neighbors.add(tgt.id);
    if (bidirectional) {
      tgt.neighbors.add(src.id);
    }
  }

  getAllNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  getState(path: string): any {
    return this.stateMemory.get(path);
  }

  setState(path: string, value: any): void {
    this.stateMemory.set(path, value);
  }

  hasCapability(nodeId: string, capability: string): boolean {
    const node = this.nodes.get(nodeId);
    return node ? node.capabilities.has(capability) : false;
  }
}
