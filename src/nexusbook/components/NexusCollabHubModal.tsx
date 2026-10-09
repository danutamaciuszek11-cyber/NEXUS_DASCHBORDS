import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Radio,
  Users,
  Film,
  FileEdit,
  Activity,
  Send,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  Sliders,
  User,
  Shield,
  Palette,
  Maximize2
} from 'lucide-react';
import {
  collaborationService,
  CollabConnectionStatus
} from '../services/collaborationService';
import {
  CollabPeer,
  CollabRole,
  CollabTab,
  CollabPulseEvent,
  CollabKinoScene,
  CollabCanvasPing,
  CollabScribeNote,
  CollabNodeStatus
} from '../types/collab';
import { soundFx } from '../utils/audioSystem';

interface NexusCollabHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: CollabTab;
}

export const NexusCollabHubModal: React.FC<NexusCollabHubModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'dashboard'
}) => {
  const [activeTab, setActiveTab] = useState<CollabTab>(initialTab);
  const [connStatus, setConnStatus] = useState<CollabConnectionStatus>('CONNECTING');
  const [myPeerId, setMyPeerId] = useState<string>('');
  const [peers, setPeers] = useState<CollabPeer[]>([]);
  const [telemetry, setTelemetry] = useState(collaborationService.getState().telemetry);
  const [nodes, setNodes] = useState<CollabNodeStatus[]>([]);
  const [recentPulses, setRecentPulses] = useState<CollabPulseEvent[]>([]);
  const [kinoScene, setKinoScene] = useState<CollabKinoScene>(collaborationService.getState().kinoScene);
  const [recentCanvasPings, setRecentCanvasPings] = useState<CollabCanvasPing[]>([]);
  const [scribeNotes, setScribeNotes] = useState<CollabScribeNote[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ noteId: string; peerName: string }[]>([]);

  // User Profile Customization
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileName, setProfileName] = useState(collaborationService.getMyProfile().name);
  const [profileRole, setProfileRole] = useState<CollabRole>(collaborationService.getMyProfile().role);
  const [profileColor, setProfileColor] = useState(collaborationService.getMyProfile().color);

  // Pulse Form State
  const [pulseMessage, setPulseMessage] = useState('');
  const [pulseChannel, setPulseChannel] = useState('bellas:pulse');

  // Scribe State
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<CollabScribeNote['category']>('DEKRET');

  // Kino Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const activePingsRef = useRef<Array<CollabCanvasPing & { radius: number; alpha: number }>>([]);

  // Connect on modal open
  useEffect(() => {
    if (!isOpen) return;

    collaborationService.connect();

    const unsub = collaborationService.subscribe((state) => {
      setConnStatus(state.status);
      setMyPeerId(state.myPeerId);
      setPeers(state.peers);
      setTelemetry(state.telemetry);
      setNodes(state.nodes);
      setRecentPulses(state.recentPulses);
      setKinoScene(state.kinoScene);
      setRecentCanvasPings(state.recentCanvasPings);
      setScribeNotes(state.scribeNotes);
      setTypingUsers(state.typingUsers);

      if (!selectedNoteId && state.scribeNotes.length > 0) {
        setSelectedNoteId(state.scribeNotes[0].id);
      }
    });

    const unsubPing = collaborationService.onCanvasPing((ping) => {
      activePingsRef.current.push({
        ...ping,
        radius: 4,
        alpha: 1.0
      });
      soundFx.playClick();
    });

    return () => {
      unsub();
      unsubPing();
    };
  }, [isOpen]);

  // Sync active tab with server
  const handleTabChange = (tab: CollabTab) => {
    soundFx.playClick();
    setActiveTab(tab);
    collaborationService.setActiveTab(tab);
  };

  // Save profile updates
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    collaborationService.updateProfile({
      name: profileName.trim(),
      role: profileRole,
      color: profileColor,
      avatar: profileRole === 'ARCHITECT' ? '🏛️' : profileRole === 'OPERATOR' ? '⚡' : '🔮'
    });
    setShowProfileEdit(false);
    soundFx.playSuccess();
  };

  // Trigger pulse in Dashboard
  const handleSendPulse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pulseMessage.trim()) return;
    collaborationService.triggerDashboardPulse(pulseChannel, pulseMessage.trim());
    setPulseMessage('');
    soundFx.playSuccess();
  };

  // Kino Scene Change
  const handleSelectScene = (
    mode: CollabKinoScene['mode'],
    hue: number,
    title: string,
    intensity = 2.5
  ) => {
    soundFx.playClick();
    collaborationService.triggerKinoScene(mode, hue, title, intensity);
  };

  // Canvas interaction
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    collaborationService.sendCanvasPing(x, y);
  };

  // Kino Canvas Animation Loop
  useEffect(() => {
    if (!isOpen || activeTab !== 'kino') {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; alpha: number }> = [];
    const count = 48;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * (canvas.width || 800),
        y: Math.random() * (canvas.height || 360),
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.6 + 0.4
      });
    }

    const render = () => {
      const w = (canvas.width = canvas.clientWidth || 800);
      const h = (canvas.height = canvas.clientHeight || 360);

      step += kinoScene.waveSpeed;

      // Dark background trail
      ctx.fillStyle = 'rgba(4, 7, 12, 0.28)';
      ctx.fillRect(0, 0, w, h);

      // Multi-layer Sine Waves
      ctx.lineWidth = 2.5;
      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        const waveHue = (kinoScene.hue + wave * 25) % 360;
        ctx.strokeStyle = `hsla(${waveHue}, 100%, 65%, ${0.35 + wave * 0.15})`;

        for (let x = 0; x < w; x += 6) {
          const y =
            h / 2 +
            Math.sin(x * 0.007 + step + wave) * 45 * Math.cos(step * 0.6) +
            Math.sin(x * 0.015 - step) * 25;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Floating Particles
      particles.forEach((p) => {
        p.x += p.vx * kinoScene.particleIntensity;
        p.y += p.vy * kinoScene.particleIntensity;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${kinoScene.hue}, 100%, 75%, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsl(${kinoScene.hue}, 100%, 50%)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Active Collaborative Ripple Pings from Users
      for (let i = activePingsRef.current.length - 1; i >= 0; i--) {
        const ping = activePingsRef.current[i];
        const px = ping.x * w;
        const py = ping.y * h;

        ctx.beginPath();
        ctx.arc(px, py, ping.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ping.peerColor || '#00f0ff';
        ctx.lineWidth = 2;
        ctx.globalAlpha = ping.alpha;
        ctx.shadowBlur = 15;
        ctx.shadowColor = ping.peerColor || '#00f0ff';
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw User Name Tag
        ctx.font = 'bold 11px JetBrains Mono, monospace';
        ctx.fillStyle = ping.peerColor || '#fff';
        ctx.fillText(ping.peerName, px + 8, py - 8);

        ctx.globalAlpha = 1.0;

        ping.radius += 1.8;
        ping.alpha -= 0.02;

        if (ping.alpha <= 0) {
          activePingsRef.current.splice(i, 1);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, activeTab, kinoScene]);

  // Scribe Actions
  const activeNote = scribeNotes.find((n) => n.id === selectedNoteId);

  const handleCreateNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() && !newNoteContent.trim()) return;

    collaborationService.createScribeNote(
      newNoteTitle.trim() || 'Nowy Dekret',
      newNoteContent.trim(),
      newNoteCategory
    );

    setNewNoteTitle('');
    setNewNoteContent('');
    setIsCreatingNote(false);
    soundFx.playSuccess();
  };

  const handleNoteContentChange = (content: string) => {
    if (!activeNote) return;
    collaborationService.updateScribeNote(activeNote.id, activeNote.title, content, activeNote.category);
    collaborationService.sendTyping(activeNote.id, true);
  };

  const handleNoteTitleChange = (title: string) => {
    if (!activeNote) return;
    collaborationService.updateScribeNote(activeNote.id, title, activeNote.content, activeNote.category);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć tę notę ze współdzielonej bazy?')) {
      collaborationService.deleteScribeNote(id);
      soundFx.playDelete();
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
      }
    }
  };

  if (!isOpen) return null;

  const peersOnDashboard = peers.filter((p) => p.activeTab === 'dashboard');
  const peersOnKino = peers.filter((p) => p.activeTab === 'kino');
  const peersOnScribe = peers.filter((p) => p.activeTab === 'scribe');

  return (
    <div className="fixed inset-0 z-[125] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-5 animate-fadeIn font-sans">
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-stone-900 border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-200">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-stone-950 via-cyan-950/30 to-stone-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  NEXUS REAL-TIME COLLABORATION HUB
                </h2>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 ${
                    connStatus === 'CONNECTED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : connStatus === 'CONNECTING'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${connStatus === 'CONNECTED' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                  {connStatus === 'CONNECTED' ? 'WS: POŁĄCZONY' : connStatus === 'CONNECTING' ? 'ŁĄCZENIE...' : 'ROZŁĄCZONY'}
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono">
                Współbieżna praca w czasie rzeczywistym // Pulpit Bellas • Strumień Kina • Kancelaria Scribe
              </p>
            </div>
          </div>

          {/* Right Header Presence Bar & Close */}
          <div className="flex items-center gap-3">
            {/* Peer Avatars Display */}
            <div className="hidden sm:flex items-center gap-1.5 bg-black/50 border border-white/10 px-3 py-1.5 rounded-xl">
              <Users className="w-3.5 h-3.5 text-cyan-400 mr-1" />
              <span className="text-xs font-mono font-bold text-white">{peers.length}</span>
              <span className="text-[10px] text-stone-400 font-mono">online:</span>
              <div className="flex -space-x-1.5 overflow-hidden ml-1">
                {peers.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    title={`${p.name} (${p.role}) - W widoku: ${p.activeTab}`}
                    className="w-6 h-6 rounded-full border border-black flex items-center justify-center text-[11px] shadow-sm cursor-pointer"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.avatar || '⚡'}
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Customization Trigger */}
            <button
              onClick={() => {
                soundFx.playClick();
                setShowProfileEdit(!showProfileEdit);
              }}
              className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1.5 border border-white/10 transition-colors"
              title="Dostosuj tożsamość węzła"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">{profileName}</span>
            </button>

            <button
              onClick={() => {
                soundFx.playModalClose();
                onClose();
              }}
              className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Edit Drawer (Dropdown) */}
        {showProfileEdit && (
          <div className="px-6 py-3 bg-black/80 border-b border-cyan-500/30 animate-fadeIn">
            <form onSubmit={handleSaveProfile} className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-cyan-400 font-bold">TWOJA TOŻSAMOŚĆ W SIECI:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-400">Pseudonim:</span>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="px-2 py-1 rounded bg-stone-900 border border-white/20 text-white font-mono text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-400">Rola:</span>
                  <select
                    value={profileRole}
                    onChange={(e) => setProfileRole(e.target.value as CollabRole)}
                    className="px-2 py-1 rounded bg-stone-900 border border-white/20 text-white font-mono text-xs focus:border-cyan-400 outline-none"
                  >
                    <option value="ARCHITECT">🏛️ ARCHITECT</option>
                    <option value="OPERATOR">⚡ OPERATOR</option>
                    <option value="SEEKER">🔮 SEEKER</option>
                    <option value="ENGINEER">🛠️ ENGINEER</option>
                    <option value="GUEST">👁️ GUEST</option>
                  </select>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-400">Kolor:</span>
                  <input
                    type="color"
                    value={profileColor}
                    onChange={(e) => setProfileColor(e.target.value)}
                    className="w-6 h-6 rounded bg-transparent border-none cursor-pointer"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold font-mono text-xs transition-colors"
              >
                Zastosuj w Sieci
              </button>
            </form>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-black/40 border-b border-white/10 overflow-x-auto text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>🏛️ Pulpit Kolaboracyjny</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 font-mono">
                {peersOnDashboard.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange('kino')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
                activeTab === 'kino'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-emerald-400" />
              <span>🎬 Strumień Kina (Live Stream)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 font-mono">
                {peersOnKino.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange('scribe')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
                activeTab === 'scribe'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5 text-amber-400" />
              <span>🖋️ Notatnik i Dekrety Scribe</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-300 font-mono">
                {peersOnScribe.length}
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-stone-400">
            <span>Uptime: <strong className="text-white">{telemetry.uptimeSeconds}s</strong></span>
            <span>•</span>
            <span>Przepustowość: <strong className="text-cyan-400">{telemetry.throughputPerMin} evt/min</strong></span>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: COLLABORATIVE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Telemetry Metrics Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-black/50 border border-cyan-500/30">
                  <div className="text-[10px] uppercase font-mono text-stone-400">PRZEPUSTOWOŚĆ MOŚTU</div>
                  <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
                    {telemetry.throughputPerMin} <span className="text-xs text-stone-400 font-normal">evt/min</span>
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Suma impulsów: {telemetry.totalEventsEmitted}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/50 border border-emerald-500/30">
                  <div className="text-[10px] uppercase font-mono text-stone-400">WĘZŁY NA ŻYWO (PEERS)</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    {peers.length} <span className="text-xs text-stone-400 font-normal">klientów</span>
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Twój identyfikator: {myPeerId ? myPeerId.slice(-6) : 'init'}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/50 border border-amber-500/30">
                  <div className="text-[10px] uppercase font-mono text-stone-400">NOTY W KANCELARII SCRIBE</div>
                  <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                    {scribeNotes.length} <span className="text-xs text-stone-400 font-normal">dekretów</span>
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Zsynchronizowane ze wszystkimi</div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/50 border border-purple-500/30">
                  <div className="text-[10px] uppercase font-mono text-stone-400">PROJEKCJA KINA</div>
                  <div className="text-lg font-bold font-mono text-purple-300 mt-1 truncate">
                    {kinoScene.mode}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5 truncate">Autor: {kinoScene.lastTriggeredBy}</div>
                </div>
              </div>

              {/* Grid: Live Micro-Nodes Status & Impulses Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left: Synchronized Micro-Nodes */}
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
                      <span>🧩 Współdzielone Mikrowęzły (Stan w Pamięci Serwera)</span>
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      LIVE CONSENSUS
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {nodes.map((node) => (
                      <div
                        key={node.id}
                        className="p-3 bg-stone-950/80 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-xl">{node.icon}</div>
                          <div>
                            <div className="font-bold text-xs text-white">{node.name}</div>
                            <div className="text-[10px] text-stone-400">
                              Opiekun: <span className="text-amber-400 font-mono">{node.bellasOwner}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              node.status === 'ONLINE'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {node.status}
                          </span>
                          <button
                            onClick={() => {
                              const newStatus = node.status === 'ONLINE' ? 'SYNCHRONIZING' : 'ONLINE';
                              collaborationService.toggleNodeStatus(node.id, newStatus);
                              soundFx.playClick();
                            }}
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-[10px] font-mono text-stone-300 border border-white/10"
                            title="Przełącz status węzła na żywo"
                          >
                            Przełącz
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Send Direct Pulse Form */}
                  <form onSubmit={handleSendPulse} className="pt-3 border-t border-white/10 space-y-2.5">
                    <label className="text-xs font-bold text-stone-300 flex items-center justify-between">
                      <span>Rozgłoś Impuls do Wszystkich Węzłów:</span>
                      <span className="text-[10px] font-mono text-cyan-400">WebSocket Broadcast</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={pulseChannel}
                        onChange={(e) => setPulseChannel(e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg bg-stone-900 border border-white/15 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                      >
                        <option value="bellas:pulse">⚡ bellas:pulse</option>
                        <option value="nexus:system">🌐 nexus:system</option>
                        <option value="kino:stream">🎬 kino:stream</option>
                        <option value="scribe:notes">🖋️ scribe:notes</option>
                      </select>
                      <input
                        type="text"
                        value={pulseMessage}
                        onChange={(e) => setPulseMessage(e.target.value)}
                        placeholder="Wpisz treść impulsu..."
                        className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/15 text-xs text-white placeholder:text-stone-500 focus:border-cyan-400 outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!pulseMessage.trim()}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 shadow"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Wyślij</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right: Live Pulses Feed & Connected Users Roster */}
                <div className="space-y-4">
                  {/* Connected Collaborators Cards */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <h4 className="font-bold text-xs uppercase font-mono text-stone-300 flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <span>Uczestnicy Sesji ({peers.length})</span>
                      </h4>
                      <span className="text-[10px] text-stone-500 font-mono">Brak opóźnień</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                      {peers.map((peer) => {
                        const isMe = peer.id === myPeerId;
                        return (
                          <div
                            key={peer.id}
                            className={`p-2 rounded-xl bg-stone-950/80 border flex items-center justify-between ${
                              isMe ? 'border-cyan-500/40 bg-cyan-950/20' : 'border-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold"
                                style={{ backgroundColor: peer.color }}
                              >
                                {peer.avatar || '⚡'}
                              </div>
                              <div className="truncate">
                                <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                                  <span>{peer.name}</span>
                                  {isMe && <span className="text-[9px] text-cyan-400 font-mono">(Ty)</span>}
                                </div>
                                <div className="text-[10px] text-stone-400 font-mono">{peer.role}</div>
                              </div>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 font-mono text-stone-300">
                              {peer.activeTab}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Realtime Pulses Feed */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <h4 className="font-bold text-xs uppercase font-mono text-stone-300 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        <span>Dziennik Impulsów Czasu Rzeczywistego</span>
                      </h4>
                      <span className="text-[10px] text-stone-500 font-mono">Real-time Stream</span>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 text-xs">
                      {recentPulses.length === 0 ? (
                        <div className="p-4 text-center text-stone-500 text-xs italic">
                          Brak ostatnich impulsów. Wyślij pierwszy impuls powyżej!
                        </div>
                      ) : (
                        recentPulses.map((pulse) => (
                          <div
                            key={pulse.id}
                            className="p-2.5 rounded-xl bg-stone-950/80 border border-white/5 flex items-start justify-between gap-2"
                          >
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded"
                                  style={{
                                    backgroundColor: `${pulse.authorColor}22`,
                                    color: pulse.authorColor,
                                    border: `1px solid ${pulse.authorColor}44`
                                  }}
                                >
                                  {pulse.author}
                                </span>
                                <span className="text-[10px] font-mono text-stone-400">#{pulse.channel}</span>
                              </div>
                              <p className="text-stone-200 text-xs leading-relaxed">{pulse.message}</p>
                            </div>
                            <span className="text-[9px] font-mono text-stone-500 shrink-0">
                              {new Date(pulse.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: COLLABORATIVE KINO STREAM */}
          {activeTab === 'kino' && (
            <div className="space-y-5">
              {/* Kino Stream Controls Toolbar */}
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎬</div>
                  <div>
                    <h3 className="font-bold text-sm text-emerald-400 tracking-wide uppercase">
                      Kino Synchronizowane w Sieci (60 FPS Canvas)
                    </h3>
                    <p className="text-xs text-stone-400">
                      Wszyscy widzowie widzą tę samą scenę. Kliknij na płótno, aby wysłać sygnał cząsteczkowy.
                    </p>
                  </div>
                </div>

                {/* Preset Scene Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleSelectScene('VOID_BLUE', 190, 'TRYB KINA: BŁĘKIT PRÓŻNI', 1.5)}
                    className="px-2.5 py-1 text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-lg hover:bg-cyan-500/30 font-mono transition-all"
                  >
                    Błękit Próżni
                  </button>
                  <button
                    onClick={() => handleSelectScene('CORE_EMERALD', 145, 'TRYB KINA: ZIELEŃ RDZENIA', 1.8)}
                    className="px-2.5 py-1 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg hover:bg-emerald-500/30 font-mono transition-all"
                  >
                    Zieleń Rdzenia
                  </button>
                  <button
                    onClick={() => handleSelectScene('BELLAS_AMBER', 40, 'TRYB KINA: BURSZTYN BELLAS', 2.0)}
                    className="px-2.5 py-1 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg hover:bg-amber-500/30 font-mono transition-all"
                  >
                    Bursztyn Bellas
                  </button>
                  <button
                    onClick={() => handleSelectScene('QUANTUM_VIOLET', 270, 'TRYB KINA: PURPURA KWANTOWA', 2.2)}
                    className="px-2.5 py-1 text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-lg hover:bg-purple-500/30 font-mono transition-all"
                  >
                    Purpura Kwantowa
                  </button>
                  <button
                    onClick={() => handleSelectScene('SUPERNOVA', Math.floor(Math.random() * 360), 'RĘCZNY ROZBLYSK SUPERNOVA', 3.5)}
                    className="px-3 py-1 text-xs bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold rounded-lg hover:opacity-90 font-mono transition-all shadow"
                  >
                    ⚡ Impuls Supernowej
                  </button>
                </div>
              </div>

              {/* Interactive Shared Canvas Area */}
              <div className="relative w-full h-[380px] bg-[#03060a] rounded-2xl border border-emerald-500/30 overflow-hidden shadow-2xl flex items-center justify-center cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="w-full h-full block"
                />

                {/* Top-Right Audience Badge */}
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/70 backdrop-blur border border-white/10 rounded-xl flex items-center gap-2 pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-white">
                    {peersOnKino.length} Widzów w Kina
                  </span>
                </div>

                {/* Bottom Overlay Live Stream Banner */}
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/70 backdrop-blur border border-white/10 rounded-xl flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="truncate">{kinoScene.title}</span>
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono shrink-0">
                    Ostatni impuls: <strong className="text-white">{kinoScene.lastTriggeredBy}</strong>
                  </div>
                </div>
              </div>

              {/* Click instruction hint banner */}
              <div className="p-3 rounded-xl bg-stone-950/60 border border-white/5 flex items-center justify-between text-xs text-stone-400 font-mono">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Interakcja: Kliknij w dowolne miejsce płótna Kina, by wysłać falę cząstek ze swoim podpisem i kolorem.</span>
                </span>
                <span className="text-emerald-400/80">LATENCY: &lt; 50ms</span>
              </div>
            </div>
          )}

          {/* TAB 3: COLLABORATIVE SCRIBE NOTES */}
          {activeTab === 'scribe' && (
            <div className="space-y-4">
              
              {/* Header Action Bar */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                    <span>🖋️ Kancelaria Architekta & Współdzielone Dekrety</span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Wspólne tworzenie i edycja dekretów architektonicznych z natychmiastowym rozgłoszeniem WebSocket.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreatingNote(!isCreatingNote)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isCreatingNote ? 'Zamknij Formularz' : 'Nowy Dekret'}</span>
                </button>
              </div>

              {/* New Note Form */}
              {isCreatingNote && (
                <form
                  onSubmit={handleCreateNoteSubmit}
                  className="p-5 rounded-2xl bg-black/60 border border-amber-500/40 space-y-3 animate-fadeIn"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-amber-300">
                      NOWY DEKRET ARCHITEKTONICZNY:
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      Autor: {profileName} ({profileRole})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        placeholder="Tytuł dekretu..."
                        className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-xs text-white focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <select
                        value={newNoteCategory}
                        onChange={(e) => setNewNoteCategory(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-xs text-white font-mono focus:border-amber-400 outline-none"
                      >
                        <option value="DEKRET">📜 DEKRET</option>
                        <option value="INSTRUKCJA">🛠️ INSTRUKCJA</option>
                        <option value="IMPULS">⚡ IMPULS</option>
                        <option value="NOTATKA">📝 NOTATKA</option>
                      </select>
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Wpisz treść dyspozycji architektonicznej..."
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-xs text-white focus:border-amber-400 outline-none resize-none font-mono"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingNote(false)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-stone-300"
                    >
                      Anuluj
                    </button>
                    <button
                      type="submit"
                      disabled={!newNoteTitle.trim() && !newNoteContent.trim()}
                      className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono flex items-center gap-1.5 shadow"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Opublikuj w Sieci</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Scribe Two-Column Layout: Notes List vs Live Editor */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[360px]">
                
                {/* Notes List Column */}
                <div className="lg:col-span-5 space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {scribeNotes.length === 0 ? (
                    <div className="p-6 text-center text-xs text-stone-500 border border-white/5 rounded-2xl bg-black/30">
                      Brak zarejestrowanych dekretów. Utwórz pierwszy dekret powyżej!
                    </div>
                  ) : (
                    scribeNotes.map((note) => {
                      const isSelected = note.id === selectedNoteId;
                      let badgeClass = 'bg-amber-950 text-amber-300 border-amber-500/40';
                      if (note.category === 'DEKRET') badgeClass = 'bg-rose-950 text-rose-300 border-rose-500/40';
                      if (note.category === 'INSTRUKCJA') badgeClass = 'bg-cyan-950 text-cyan-300 border-cyan-500/40';
                      if (note.category === 'IMPULS') badgeClass = 'bg-emerald-950 text-emerald-300 border-emerald-500/40';

                      const isBeingEdited = typingUsers.some((u) => u.noteId === note.id);

                      return (
                        <div
                          key={note.id}
                          onClick={() => {
                            soundFx.playClick();
                            setSelectedNoteId(note.id);
                          }}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                            isSelected
                              ? 'bg-stone-800/90 border-amber-400 shadow-lg'
                              : 'bg-black/40 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${badgeClass}`}>
                                {note.category}
                              </span>
                              <span className="font-bold text-white truncate max-w-[140px]">{note.title}</span>
                            </div>
                            <span className="text-[10px] text-stone-500 font-mono">
                              {new Date(note.updatedAt).toLocaleTimeString()}
                            </span>
                          </div>

                          <p className="text-[11px] text-stone-300 line-clamp-2 font-mono">
                            {note.content}
                          </p>

                          <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono pt-1 border-t border-white/5">
                            <span>Autor: <strong className="text-stone-300">{note.author}</strong></span>
                            {isBeingEdited && (
                              <span className="text-amber-400 flex items-center gap-1 font-bold animate-pulse">
                                <Zap className="w-3 h-3" />
                                <span>Edytowane...</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Active Note Live Editor Column */}
                <div className="lg:col-span-7">
                  {activeNote ? (
                    <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-4 flex flex-col h-full justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                          <span className="text-xs font-mono font-bold text-stone-300 uppercase">
                            EDYCJA DEKRETU W CZASIE RZECZYWISTYM
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-emerald-400 font-mono">
                              Zapisany w Pamięci Serwera
                            </span>
                            <button
                              onClick={() => handleDeleteNote(activeNote.id)}
                              className="p-1 rounded text-stone-500 hover:text-rose-400 transition-colors"
                              title="Usuń dekret"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Title input */}
                        <div>
                          <label className="text-[10px] font-mono text-stone-400 uppercase block mb-1">
                            Tytuł:
                          </label>
                          <input
                            type="text"
                            value={activeNote.title}
                            onChange={(e) => handleNoteTitleChange(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-sm font-bold text-white focus:border-amber-400 outline-none font-mono"
                          />
                        </div>

                        {/* Live collaborative textarea */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] font-mono text-stone-400 uppercase">
                              Treść Dekretu:
                            </label>
                            {typingUsers
                              .filter((u) => u.noteId === activeNote.id)
                              .map((u, i) => (
                                <span key={i} className="text-[10px] text-amber-400 font-mono animate-pulse">
                                  ✍️ {u.peerName} pisze...
                                </span>
                              ))}
                          </div>
                          <textarea
                            rows={8}
                            value={activeNote.content}
                            onChange={(e) => handleNoteContentChange(e.target.value)}
                            className="w-full p-3 rounded-xl bg-stone-900 border border-white/15 text-xs text-white focus:border-amber-400 outline-none font-mono leading-relaxed resize-none"
                          />
                        </div>
                      </div>

                      {/* Footer Note Info */}
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-stone-500">
                        <span>Autor: {activeNote.author} ({activeNote.authorRole})</span>
                        <span>Ostatnia modyfikacja: {activeNote.updatedBy || activeNote.author} ({new Date(activeNote.updatedAt).toLocaleTimeString()})</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-black/30 border border-white/5 text-center text-xs text-stone-500 h-full flex flex-col items-center justify-center space-y-2">
                      <FileEdit className="w-8 h-8 text-stone-600" />
                      <span>Wybierz notę z listy po lewej stronie, aby przeglądać i edytować wspólnie na żywo.</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-3 bg-black/60 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>NEXUS REAL-TIME PROTOCOL v2.0 // WS PATH: <strong className="text-white">/ws/nexus</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <span>Połączeni współpracownicy: <strong className="text-emerald-400">{peers.length}</strong></span>
            <button
              onClick={() => {
                soundFx.playModalClose();
                onClose();
              }}
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Zamknij
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
