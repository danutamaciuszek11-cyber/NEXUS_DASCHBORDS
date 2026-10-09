import React, { useState } from 'react';
import { 
  Server, 
  Plus, 
  Terminal, 
  Copy, 
  Check, 
  RefreshCw, 
  HardDrive, 
  Cpu, 
  ShieldCheck, 
  Radio, 
  Trash2, 
  ExternalLink,
  Laptop,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { NodeInfo, Language } from '../../types/base-dev-tools';

interface NexusNodesProps {
  lang: Language;
}

export function NexusNodes({ lang }: NexusNodesProps) {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeType, setNewNodeType] = useState<'cli' | 'docker' | 'vps'>('cli');

  const [nodes, setNodes] = useState<NodeInfo[]>([
    {
      id: 'node-web-01',
      name: 'Local Browser Prover (This Device)',
      type: 'web',
      status: 'proving',
      cyclesPerSec: 7240000,
      totalProofs: 384,
      uptime: '4h 12m',
      architecture: 'WebGPU WGSL Compute (Direct GPU Acceleration)',
      threads: 4,
      lastPing: 'Just now',
      engineMode: 'webgpu',
    },
    {
      id: 'node-cli-449',
      name: 'Frankfurt Dedicated VPS #01',
      type: 'vps',
      status: 'active',
      cyclesPerSec: 2840000,
      totalProofs: 2491,
      uptime: '3d 18h',
      architecture: 'Linux x86_64 (AMD EPYC 32-core)',
      threads: 16,
      lastPing: '1s ago',
    },
    {
      id: 'node-gpu-881',
      name: 'Rig-Worker RTX 4090 GPU Node',
      type: 'cli',
      status: 'active',
      cyclesPerSec: 8910000,
      totalProofs: 11240,
      uptime: '11d 04h',
      architecture: 'CUDA / RISC-V Accelerator v2',
      threads: 24,
      lastPing: '500ms ago',
    },
  ]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;

    const newWorker: NodeInfo = {
      id: `node-${newNodeType}-${Math.floor(100 + Math.random() * 900)}`,
      name: newNodeName.trim(),
      type: newNodeType,
      status: 'syncing',
      cyclesPerSec: newNodeType === 'vps' ? 3200000 : 1800000,
      totalProofs: 0,
      uptime: 'Just started',
      architecture: newNodeType === 'docker' ? 'Docker Container (Linux/AMD64)' : 'Linux x86_64',
      threads: 8,
      lastPing: 'Connecting...',
    };

    setNodes(prev => [...prev, newWorker]);
    setNewNodeName('');
    setShowAddModal(false);
  };

  const handleDeleteNode = (id: string) => {
    if (id === 'node-web-01') {
      alert(lang === 'pl' ? 'Nie można usunąć głównego węzła przeglądarkowego!' : 'Cannot delete local browser node!');
      return;
    }
    setNodes(prev => prev.filter(n => n.id !== id));
  };

  const totalComputeHashrate = nodes.reduce((acc, curr) => acc + (curr.status === 'offline' ? 0 : curr.cyclesPerSec), 0);
  const totalProofsAllNodes = nodes.reduce((acc, curr) => acc + curr.totalProofs, 0);

  const cliInstallScript = `curl -sSf https://cli.nexus.xyz/install.sh | NXL_NODE_ID=nxl-operator-live sh`;
  const dockerCommand = `docker run -d --restart always --name nxl-prover -e NODE_KEY=nxl_live_token_7781 nexusxyz/nexus-prover:latest`;

  return (
    <div className="space-y-8">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-mono font-semibold">
              {lang === 'pl' ? 'Podłączone Węzły' : 'Connected Nodes'}
            </span>
            <Server className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">
            {nodes.length} <span className="text-sm font-normal text-neutral-400">({nodes.filter(n => n.status !== 'offline').length} online)</span>
          </div>
          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            100% network sync
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-mono font-semibold">
              {lang === 'pl' ? 'Łączna moc obliczeniowa' : 'Aggregate Hashrate'}
            </span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-700">
            {(totalComputeHashrate / 1000000).toFixed(2)} MHz
          </div>
          <p className="text-xs text-neutral-500 mt-1 font-mono">
            {totalComputeHashrate.toLocaleString()} cycles/s
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-mono font-semibold">
              {lang === 'pl' ? 'Wszystkie dostarczone dowody' : 'Total Contributed Proofs'}
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">
            {totalProofsAllNodes.toLocaleString()}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Across {nodes.length} active workers
          </p>
        </div>
      </div>

      {/* Nodes list */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-cyan-600" />
              {lang === 'pl' ? 'Węzły Obliczeniowe NXL Prover' : 'NXL Prover Node Fleet'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {lang === 'pl' 
                ? 'Zarządzaj swoimi lokalnymi instancjami przeglądarkowymi, workerami CLI i serwerami VPS.' 
                : 'Monitor and coordinate your browser web nodes, CLI daemons, and dedicated VPS compute nodes.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'pl' ? 'Dodaj Nowy Węzeł' : 'Connect New Node'}</span>
          </button>
        </div>

        <div className="divide-y divide-neutral-100">
          {nodes.map((node) => (
            <div key={node.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  node.type === 'web' 
                    ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' 
                    : node.type === 'vps'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {node.type === 'web' ? <Laptop className="w-5 h-5" /> : <Server className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-neutral-900 text-sm">
                      {node.name}
                    </h3>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
                      {node.type}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium font-mono ${
                      node.status === 'proving' ? 'text-cyan-600' : 'text-emerald-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${node.status === 'proving' ? 'bg-cyan-500 animate-pulse' : 'bg-emerald-500'}`} />
                      {node.status}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 mt-1 font-mono">
                    {node.architecture} · {node.threads} threads · Uptime: {node.uptime}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100">
                <div className="text-left md:text-right">
                  <div className="text-xs font-mono font-bold text-neutral-900">
                    {node.cyclesPerSec.toLocaleString()} cycles/s
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">
                    {node.totalProofs.toLocaleString()} proofs submitted
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteNode(node.id)}
                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title={lang === 'pl' ? 'Usuń węzeł' : 'Remove node'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick CLI & Docker Connection Instructions */}
      <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 sm:p-8 text-white space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm text-neutral-200">
              {lang === 'pl' ? 'Uruchomienie Węzła CLI / Serwera VPS' : 'CLI & Docker Prover Installation'}
            </h3>
          </div>
          <span className="text-xs text-cyan-400 font-mono">NXL CLI v3.4.1</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>{lang === 'pl' ? '1. Linux / macOS Bash (Jednolinijkowiec):' : '1. Linux / macOS One-Liner:'}</span>
              <button
                onClick={() => handleCopy(cliInstallScript, 'bash')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copiedCmd === 'bash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'bash' ? 'Copied!' : 'Copy Command'}</span>
              </button>
            </div>
            <div className="bg-neutral-900 p-3 rounded-xl font-mono text-xs text-neutral-300 overflow-x-auto border border-neutral-800">
              {cliInstallScript}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>{lang === 'pl' ? '2. Kontener Docker (w tle na VPS):' : '2. Docker Daemon (Background VPS):'}</span>
              <button
                onClick={() => handleCopy(dockerCommand, 'docker')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copiedCmd === 'docker' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'docker' ? 'Copied!' : 'Copy Command'}</span>
              </button>
            </div>
            <div className="bg-neutral-900 p-3 rounded-xl font-mono text-xs text-neutral-300 overflow-x-auto border border-neutral-800">
              {dockerCommand}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding node */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-neutral-900 text-base">
                {lang === 'pl' ? 'Zarejestruj Nowy Węzeł' : 'Register New Node'}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddNode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  {lang === 'pl' ? 'Nazwa Węzła / Maszyny' : 'Node Label / Hostname'}
                </label>
                <input
                  type="text"
                  required
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  placeholder="e.g. Warsaw-Worker-02"
                  className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  {lang === 'pl' ? 'Typ Środowiska' : 'Environment Type'}
                </label>
                <select
                  value={newNodeType}
                  onChange={(e) => setNewNodeType(e.target.value as any)}
                  className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-sm bg-neutral-50 focus:border-cyan-500 outline-none"
                >
                  <option value="cli">CLI Native Binary (Rust/C++)</option>
                  <option value="vps">Dedicated Cloud VPS (Ubuntu/Debian)</option>
                  <option value="docker">Docker Container</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                >
                  {lang === 'pl' ? 'Anuluj' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white"
                >
                  {lang === 'pl' ? 'Utwórz Węzeł' : 'Create Node'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

