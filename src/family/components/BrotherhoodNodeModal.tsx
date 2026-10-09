import React, { useState, useEffect } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Users,
  Brain,
  Sparkles,
  Send,
  CheckSquare,
  Square,
  Plus,
  X,
  FileText,
  MessageSquare,
  Layers,
  Award,
  Zap,
  Clock,
  Shield,
  Bot,
  ArrowLeft,
  Github,
  GitBranch,
  ExternalLink,
  Code2,
  FolderGit2,
  Download,
  Trash2,
  Edit3,
  Compass,
  Check,
  Flame,
  FileCode
} from 'lucide-react';
import { BrotherhoodTask } from '../types';

export const BrotherhoodNodeModal: React.FC = () => {
  const {
    activeBrotherhoodNodeId,
    setActiveBrotherhoodNodeId,
    currentView,
    brotherhoodNodes,
    architects,
    currentArchitect,
    sendBrotherhoodMessage,
    addBrotherhoodTask,
    deleteBrotherhoodTask,
    toggleBrotherhoodTask,
    updateBrotherhoodNotes,
    updateBrotherhoodProjectSpace,
    addBrotherhoodMilestone,
    toggleBrotherhoodMilestone,
    addBrotherhoodFile,
    githubState,
    setIsGitHubModalOpen,
    language,
    playCyberSound,
    triggerHaptic
  } = useNexus();

  const [activeTab, setActiveTab] = useState<'WORKSPACE' | 'PROJECT_SPACE' | 'CHAT' | 'TASKS' | 'NOTES'>('WORKSPACE');
  const [chatInput, setChatInput] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>('');
  const [notesBuffer, setNotesBuffer] = useState<string | null>(null);
  const [isBellaThinking, setIsBellaThinking] = useState(false);

  // Project Space Edit States
  const [isEditingRfc, setIsEditingRfc] = useState(false);
  const [rfcContent, setRfcContent] = useState('');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneEpoch, setNewMilestoneEpoch] = useState('Epoch 2');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);

  // File Upload State
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('ts');
  const [newFileSize, setNewFileSize] = useState('12.4 KB');
  const [isAddingFile, setIsAddingFile] = useState(false);

  // GitHub Repo Link
  const [gitRepoInput, setGitRepoInput] = useState('');
  const [isLinkingGit, setIsLinkingGit] = useState(false);

  // Close on Escape inside the component
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeBrotherhoodNodeId) {
        e.preventDefault();
        setActiveBrotherhoodNodeId(null);
        playCyberSound('click');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeBrotherhoodNodeId, setActiveBrotherhoodNodeId, playCyberSound]);

  if (!activeBrotherhoodNodeId || currentView === 'BROTHERHOOD') return null;

  const node = brotherhoodNodes.find(n => n.id === activeBrotherhoodNodeId);
  if (!node) return null;

  const partnerId = node.architect1Id === currentArchitect.id ? node.architect2Id : node.architect1Id;
  const partner = architects.find(a => a.id === partnerId) || architects[1];

  const currentNotes = notesBuffer !== null ? notesBuffer : node.sharedNotes;

  // Initialize RFC content if not set
  const projectSpace = node.projectSpace || {
    title: `Inicjatywa: ${currentArchitect.name} & ${partner.name}`,
    description: `Wspólna realizacja założeń architektonicznych w suwerennym węźle Brotherhood.`,
    rfcDocument: `# RFC: INICJATYWA ARCHITEKTONICZNA\n\n**Autorzy:** ${currentArchitect.name} & ${partner.name}\n**Świat:** ${partner.worlds?.[0] || 'nexus-dev-hub'}\n\n## 1. Problem Statement\nRozszerzenie suwerennych protokołów komunikacji i architektury modułowej w ekosystemie Nexus.\n\n## 2. Architektura Systemu\n- Moduł synaptyczny\n- Bezpieczna wymiana danych TLS 1.3\n- Zgodność z zaleceniami State Bella\n\n## 3. Kamienie Milowe\n- Prototyp interfejsu (Epoch 1)\n- Wdrożenie produkcyjne (Epoch 2)`,
    targetDeliverable: 'Demonstrator technologii i moduł produkcyjny',
    status: 'PROTOTYPING',
    milestones: [
      { id: 'm1', title: 'Inicjalizacja węzła i repozytorium', targetEpoch: 'Epoch 1', completed: true, description: 'Ustalenie struktury projektu' },
      { id: 'm2', title: 'Implementacja MVP', targetEpoch: 'Epoch 2', completed: false, description: 'Pierwsza wersja do testów w radzie AI' }
    ],
    files: [
      { id: 'f1', name: 'architecture_spec.md', size: '14.2 KB', type: 'md', uploadedBy: currentArchitect.name, uploadedAt: '2025-08-28', url: '#' }
    ]
  };

  const activeRfc = rfcContent || projectSpace.rfcDocument;

  const handleClose = () => {
    setActiveBrotherhoodNodeId(null);
    playCyberSound('click');
    triggerHaptic();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendBrotherhoodMessage(node.id, chatInput.trim());
    setChatInput('');
    playCyberSound('click');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addBrotherhoodTask(node.id, {
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      assignedTo: newTaskAssignee || currentArchitect.id,
      completed: false,
      tag: 'SPRINT'
    });
    setNewTaskTitle('');
    playCyberSound('beep');
    triggerHaptic();
  };

  const handleSaveRfc = () => {
    updateBrotherhoodProjectSpace(node.id, {
      rfcDocument: activeRfc
    });
    setIsEditingRfc(false);
    playCyberSound('success');
  };

  const handleAddMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    addBrotherhoodMilestone(node.id, {
      title: newMilestoneTitle.trim(),
      targetEpoch: newMilestoneEpoch.trim() || 'Epoch 2',
      description: newMilestoneDesc.trim() || undefined
    });
    setNewMilestoneTitle('');
    setNewMilestoneDesc('');
    setIsAddingMilestone(false);
  };

  const handleAddFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    addBrotherhoodFile(node.id, {
      name: newFileName.trim(),
      size: newFileSize.trim() || '15 KB',
      type: newFileType.trim() || 'file',
      url: '#'
    });
    setNewFileName('');
    setIsAddingFile(false);
  };

  const handleLinkGitRepo = (repoUrl: string) => {
    updateBrotherhoodProjectSpace(node.id, {
      githubRepo: repoUrl,
      githubBranch: 'main',
      githubSyncStatus: 'CONNECTED'
    });
    setIsLinkingGit(false);
    setGitRepoInput('');
  };

  const handleBellaAssistance = async () => {
    setIsBellaThinking(true);
    playCyberSound('synapse');
    triggerHaptic();

    try {
      const res = await fetch('/api/bella/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Please synthesize a joint action sprint plan and RFC expansion for Brotherhood Node pairing between ${currentArchitect.name} (${currentArchitect.specializations.join(', ')}) and ${partner.name} (${partner.specializations.join(', ')}). Target deliverable: ${projectSpace.targetDeliverable}.`,
          architectProfile: currentArchitect,
          currentView: 'BROTHERHOOD'
        })
      });
      const data = await res.json();
      sendBrotherhoodMessage(node.id, `🤖 [STATE BELLA CO-MEDIATOR]:\n${data.reply}`);
      playCyberSound('success');
    } catch (err) {
      sendBrotherhoodMessage(node.id, `🤖 [STATE BELLA]: Synergized plan for "${projectSpace.title}": 1. Finalize module RFC contracts 2. Link GitHub branch 3. Verify deliverables with AI Council.`);
    } finally {
      setIsBellaThinking(false);
    }
  };

  return (
    <div
      id="brotherhood-node-modal"
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-5xl h-[92vh] max-h-[850px] rounded-2xl nexus-glass border-2 border-purple-500/50 bg-[#090d16]/98 flex flex-col justify-between shadow-[0_0_60px_rgba(168,85,247,0.3)] overflow-hidden"
      >
        {/* Top Header */}
        <div className="p-3.5 sm:p-4 border-b border-purple-500/25 bg-gradient-to-r from-[#0a0f1d] via-[#090d16] to-purple-950/40 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              id="brotherhood-back-btn"
              onClick={handleClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 hover:border-purple-300 text-purple-200 hover:text-white text-xs font-cyber transition-all shadow-[0_0_12px_rgba(168,85,247,0.25)] group"
              title={language === 'PL' ? 'Wróć do listy węzłów Brotherhood (ESC)' : 'Back to Brotherhood Nodes (ESC)'}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-bold">{language === 'PL' ? 'POWRÓT' : 'BACK'}</span>
            </button>

            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-400 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.2)] shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-cyber font-bold text-sm sm:text-base text-white tracking-wider">
                  BROTHERHOOD NODE WORKSPACE
                </span>
                <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-purple-900/50 text-purple-300 border border-purple-500/30">
                  {node.matchScore}% COMPATIBILITY
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono-tech rounded bg-emerald-950/50 text-emerald-300 border border-emerald-500/30">
                  {node.status}
                </span>
              </div>
              <p className="text-[11px] font-mono-tech text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Pair: {currentArchitect.name} × {partner.name}</span>
                <span>•</span>
                <span className="text-purple-300 truncate max-w-xs">{projectSpace.title}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBellaAssistance}
              disabled={isBellaThinking}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-300 text-xs font-cyber transition-all shadow-[0_0_12px_rgba(168,85,247,0.2)]"
            >
              <Brain className={`w-3.5 h-3.5 ${isBellaThinking ? 'animate-spin text-cyan-400' : ''}`} />
              <span className="hidden sm:inline">Ask Bella Co-Mediator</span>
            </button>
            <button
              id="brotherhood-close-btn"
              onClick={handleClose}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#0d131f] hover:bg-red-950/50 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-300 transition-all text-xs font-mono-tech"
              title="Close Workspace (ESC)"
            >
              <span className="hidden md:inline text-[10px] text-slate-400">ESC</span>
              <X className="w-4 h-4 text-purple-300 hover:text-red-400" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-purple-500/10 bg-[#080b11]/80 overflow-x-auto scrollbar-none">
          {[
            { key: 'WORKSPACE', label: language === 'PL' ? 'PRZEGLĄD & 6D' : 'OVERVIEW & 6D', icon: Layers },
            { key: 'PROJECT_SPACE', label: language === 'PL' ? 'PRZESTRZEŃ PROJEKTU & RFC' : 'PROJECT SPACE & RFC', icon: FolderGit2 },
            { key: 'CHAT', label: language === 'PL' ? 'CZAT SZYFROWANY' : 'ENCRYPTED CHAT', icon: MessageSquare },
            { key: 'TASKS', label: language === 'PL' ? 'SPRINT & ZADANIA' : 'SPRINT TASKS', icon: CheckSquare },
            { key: 'NOTES', label: language === 'PL' ? 'NOTATNIK ROBOCZY' : 'SCRATCHPAD', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as any);
                  playCyberSound('click');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-all shrink-0 ${
                  isSel
                    ? 'bg-purple-500/20 border border-purple-400 text-purple-200 font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-purple-950/20'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSel ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Workspace Body */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto font-sans">
          {/* TAB 1: WORKSPACE OVERVIEW & 6-DIMENSION ANALYSIS */}
          {activeTab === 'WORKSPACE' && (
            <div className="space-y-5">
              {/* Partner Profiles Comparison Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0d131f] border border-cyan-500/30 space-y-2">
                  <div className="flex items-center gap-3">
                    <img src={currentArchitect.avatar} alt={currentArchitect.name} className="w-12 h-12 rounded-xl object-cover border border-cyan-400" />
                    <div>
                      <div className="font-cyber font-bold text-sm text-white">{currentArchitect.name} (Ty)</div>
                      <div className="text-[11px] font-mono-tech text-cyan-400">{currentArchitect.handle} • {currentArchitect.role}</div>
                      <div className="text-[10px] font-mono-tech text-slate-400">Ranga: {currentArchitect.rank}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1 border-t border-cyan-500/15">
                    {currentArchitect.specializations.map(s => (
                      <span key={s} className="px-1.5 py-0.5 text-[9px] font-mono-tech rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0d131f] border border-purple-500/30 space-y-2">
                  <div className="flex items-center gap-3">
                    <img src={partner.avatar} alt={partner.name} className="w-12 h-12 rounded-xl object-cover border border-purple-400" />
                    <div>
                      <div className="font-cyber font-bold text-sm text-white">{partner.name}</div>
                      <div className="text-[11px] font-mono-tech text-purple-400">{partner.handle} • {partner.role}</div>
                      <div className="text-[10px] font-mono-tech text-slate-400">Ranga: {partner.rank}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1 border-t border-purple-500/15">
                    {partner.specializations.map(s => (
                      <span key={s} className="px-1.5 py-0.5 text-[9px] font-mono-tech rounded bg-purple-950/60 text-purple-300 border border-purple-500/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* State Bella Match Rationale */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-cyan-950/30 to-purple-950/40 border border-purple-400/30 space-y-2">
                <div className="flex items-center gap-2 font-cyber font-bold text-xs text-purple-300">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>STATE BELLA MATCH RATIONALE:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {node.complementaryRationale}
                </p>
              </div>

              {/* 6-Dimension Analysis Grid */}
              {node.dimensionAnalysis && (
                <div className="p-4 rounded-xl bg-[#070b13] border border-purple-500/20 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono-tech">
                    <span className="text-purple-300 font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>ANALIZA 6-WYMIAROWA PARY ARCHITEKTÓW (BROTHERHOOD ENGINE)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Silnik Dopasowania Nexus</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                    {node.dimensionAnalysis.competencyMatch && (
                      <div className="p-3 rounded-xl bg-[#0b101c] border border-purple-500/15 space-y-1">
                        <div className="text-[10px] font-mono-tech text-purple-300 font-bold flex items-center gap-1">
                          <Code2 className="w-3 h-3 text-purple-400" />
                          <span>KOMPETENCJE</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{node.dimensionAnalysis.competencyMatch}</p>
                      </div>
                    )}
                    {node.dimensionAnalysis.projectSynergy && (
                      <div className="p-3 rounded-xl bg-[#0b101c] border border-cyan-500/15 space-y-1">
                        <div className="text-[10px] font-mono-tech text-cyan-300 font-bold flex items-center gap-1">
                          <Layers className="w-3 h-3 text-cyan-400" />
                          <span>PROJEKTY & ŚWIATY</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{node.dimensionAnalysis.projectSynergy}</p>
                      </div>
                    )}
                    {node.dimensionAnalysis.interestAlignment && (
                      <div className="p-3 rounded-xl bg-[#0b101c] border border-amber-500/15 space-y-1">
                        <div className="text-[10px] font-mono-tech text-amber-300 font-bold flex items-center gap-1">
                          <Brain className="w-3 h-3 text-amber-400" />
                          <span>WIZJA & ZAINTERESOWANIA</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{node.dimensionAnalysis.interestAlignment}</p>
                      </div>
                    )}
                    {node.dimensionAnalysis.goalAlignment && (
                      <div className="p-3 rounded-xl bg-[#0b101c] border border-emerald-500/15 space-y-1">
                        <div className="text-[10px] font-mono-tech text-emerald-300 font-bold flex items-center gap-1">
                          <Compass className="w-3 h-3 text-emerald-400" />
                          <span>CELE STRATEGICZNE</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{node.dimensionAnalysis.goalAlignment}</p>
                      </div>
                    )}
                    {node.dimensionAnalysis.workStyleComplementarity && (
                      <div className="p-3 rounded-xl bg-[#0b101c] border border-pink-500/15 space-y-1">
                        <div className="text-[10px] font-mono-tech text-pink-300 font-bold flex items-center gap-1">
                          <Zap className="w-3 h-3 text-pink-400" />
                          <span>STYL PRACY</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{node.dimensionAnalysis.workStyleComplementarity}</p>
                      </div>
                    )}
                    {node.dimensionAnalysis.experienceSynergy && (
                      <div className="p-3 rounded-xl bg-[#0b101c] border border-violet-500/15 space-y-1">
                        <div className="text-[10px] font-mono-tech text-violet-300 font-bold flex items-center gap-1">
                          <Shield className="w-3 h-3 text-violet-400" />
                          <span>DOŚWIADCZENIE & RANGA</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{node.dimensionAnalysis.experienceSynergy}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Links & Summaries */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0d131f] border border-cyan-500/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-cyber font-bold text-cyan-300">
                    <span>Wspólny Sprint ({node.sharedTasks.filter(t => t.completed).length}/{node.sharedTasks.length})</span>
                    <button onClick={() => setActiveTab('TASKS')} className="text-cyan-400 hover:underline text-[10px] font-mono-tech">
                      Otwórz zadania →
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {node.sharedTasks.slice(0, 4).map(t => (
                      <div
                        key={t.id}
                        onClick={() => toggleBrotherhoodTask(node.id, t.id)}
                        className="flex items-center gap-2 p-2 rounded-lg bg-[#080b11] hover:bg-cyan-950/30 cursor-pointer text-xs transition-colors"
                      >
                        {t.completed ? <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" /> : <Square className="w-4 h-4 text-slate-500 shrink-0" />}
                        <span className={`truncate ${t.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{t.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0d131f] border border-purple-500/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-cyber font-bold text-purple-300">
                    <span>Ostatnie wiadomości w kanale</span>
                    <button onClick={() => setActiveTab('CHAT')} className="text-purple-400 hover:underline text-[10px] font-mono-tech">
                      Otwórz czat →
                    </button>
                  </div>
                  <div className="space-y-2 max-h-36 overflow-y-auto text-xs">
                    {node.messages.slice(-2).map(m => (
                      <div key={m.id} className="p-2 rounded-lg bg-[#080b11] border border-purple-500/10">
                        <div className="text-[10px] font-mono-tech text-purple-400 font-bold">{m.senderName}:</div>
                        <div className="text-slate-300 truncate">{m.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECT SPACE (RFC, MILESTONES, FILES & GITHUB) */}
          {activeTab === 'PROJECT_SPACE' && (
            <div className="space-y-5">
              {/* Project Space Header Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#0a0e1a] to-cyan-950/40 border border-cyan-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono-tech text-cyan-400 font-bold tracking-wider uppercase">
                      PRYWATNA PRZESTRZEŃ INŻYNIERYJNA BROTHERHOOD
                    </span>
                    <h3 className="font-cyber font-bold text-lg text-white mt-0.5">
                      {projectSpace.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-sans max-w-2xl mt-1">
                      {projectSpace.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono-tech font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      STATUS: {projectSpace.status || 'PROTOTYPING'}
                    </span>
                    {projectSpace.worldSlug && (
                      <span className="text-[10px] font-mono-tech text-slate-400">
                        Świat: <strong className="text-purple-300">{projectSpace.worldSlug}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* GitHub Integration Badge & Actions */}
                <div className="pt-3 border-t border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0d131f] border border-purple-500/30 text-xs font-mono-tech">
                      <Github className="w-3.5 h-3.5 text-purple-300" />
                      <span className="text-slate-400">GitHub Repo:</span>
                      {projectSpace.githubRepo ? (
                        <a
                          href={projectSpace.githubRepo}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>{projectSpace.githubRepo.replace('https://github.com/', '')}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-500 italic">Niepołączone</span>
                      )}
                    </div>

                    {projectSpace.githubBranch && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#0d131f] border border-cyan-500/20 text-[10px] font-mono-tech text-cyan-300">
                        <GitBranch className="w-3 h-3 text-cyan-400" />
                        <span>{projectSpace.githubBranch}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsLinkingGit(!isLinkingGit)}
                      className="px-3 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-300 text-xs font-mono-tech transition-colors flex items-center gap-1.5"
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>{projectSpace.githubRepo ? 'Zmień repozytorium' : 'Połącz z GitHub'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsGitHubModalOpen(true);
                        playCyberSound('click');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#0d131f] hover:bg-purple-950/40 border border-slate-700 text-slate-300 text-xs font-mono-tech"
                      title="Centrum integracji GitHub"
                    >
                      <Github className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Expandable GitHub Link Form */}
                {isLinkingGit && (
                  <div className="p-3 rounded-xl bg-[#080c14] border border-purple-500/30 space-y-2 text-xs">
                    <div className="font-mono-tech text-purple-300 font-bold text-[11px]">
                      Przypisz repozytorium GitHub do tego Węzła Brotherhood:
                    </div>
                    {githubState.repos.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono-tech text-slate-400">Twoje zsynchronizowane repozytoria:</span>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                          {githubState.repos.slice(0, 6).map(repo => (
                            <button
                              key={repo.id}
                              onClick={() => handleLinkGitRepo(repo.html_url)}
                              className="px-2 py-1 rounded bg-[#0f172a] hover:bg-purple-900/50 border border-slate-700 hover:border-purple-400 text-[11px] text-cyan-300 font-mono-tech transition-colors"
                            >
                              {repo.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={gitRepoInput}
                        onChange={e => setGitRepoInput(e.target.value)}
                        placeholder="https://github.com/twoj-login/repo-projektu"
                        className="flex-1 bg-[#0d131f] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono-tech"
                      />
                      <button
                        onClick={() => {
                          if (gitRepoInput.trim()) handleLinkGitRepo(gitRepoInput.trim());
                        }}
                        className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs rounded-lg"
                      >
                        Połącz
                      </button>
                      <button
                        onClick={() => setIsLinkingGit(false)}
                        className="px-2 py-1.5 text-slate-400 hover:text-white text-xs"
                      >
                        Anuluj
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* RFC Document Section */}
              <div className="p-4 rounded-xl bg-[#090d16] border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-purple-400" />
                    <span className="font-cyber font-bold text-xs sm:text-sm text-white">
                      DOKUMENTACJA RFC (REQUEST FOR COMMENTS)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditingRfc ? (
                      <>
                        <button
                          onClick={handleSaveRfc}
                          className="flex items-center gap-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-cyber font-bold text-xs rounded-lg"
                        >
                          <Check className="w-3 h-3" />
                          <span>Zapisz RFC</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingRfc(false);
                            setRfcContent('');
                          }}
                          className="px-2 py-1 text-xs font-mono-tech text-slate-400 hover:text-white"
                        >
                          Anuluj
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setRfcContent(projectSpace.rfcDocument);
                          setIsEditingRfc(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-300 text-xs font-mono-tech rounded-lg"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edytuj RFC</span>
                      </button>
                    )}
                  </div>
                </div>

                {isEditingRfc ? (
                  <textarea
                    value={activeRfc}
                    onChange={e => setRfcContent(e.target.value)}
                    rows={12}
                    className="w-full bg-[#05080e] border border-purple-500/30 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 font-mono-tech leading-relaxed focus:outline-none focus:border-cyan-400 resize-y"
                    placeholder="Wpisz treść specyfikacji RFC w formacie Markdown..."
                  />
                ) : (
                  <div className="p-4 rounded-xl bg-[#05080e] border border-slate-800 text-xs sm:text-sm text-slate-300 font-mono-tech whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                    {projectSpace.rfcDocument}
                  </div>
                )}
              </div>

              {/* Milestones & Files Two-Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Milestones Roadmap */}
                <div className="p-4 rounded-xl bg-[#090d16] border border-cyan-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-cyber font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>KAMIE NIE MILOWE PROJEKTU</span>
                    </span>
                    <button
                      onClick={() => setIsAddingMilestone(!isAddingMilestone)}
                      className="text-[11px] font-mono-tech text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Nowy kamień</span>
                    </button>
                  </div>

                  {isAddingMilestone && (
                    <form onSubmit={handleAddMilestoneSubmit} className="p-3 rounded-lg bg-[#0d131f] border border-cyan-500/30 space-y-2 text-xs">
                      <input
                        type="text"
                        value={newMilestoneTitle}
                        onChange={e => setNewMilestoneTitle(e.target.value)}
                        placeholder="Nazwa kamienia milowego..."
                        className="w-full bg-[#05080e] border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                        required
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMilestoneEpoch}
                          onChange={e => setNewMilestoneEpoch(e.target.value)}
                          placeholder="Np. Epoch 2.1"
                          className="w-1/3 bg-[#05080e] border border-slate-700 rounded p-2 text-white text-xs font-mono-tech"
                        />
                        <input
                          type="text"
                          value={newMilestoneDesc}
                          onChange={e => setNewMilestoneDesc(e.target.value)}
                          placeholder="Krótki opis rezultatu..."
                          className="flex-1 bg-[#05080e] border border-slate-700 rounded p-2 text-white text-xs"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsAddingMilestone(false)}
                          className="px-2.5 py-1 text-slate-400 hover:text-white"
                        >
                          Anuluj
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-cyan-500 text-black font-bold font-cyber rounded text-xs"
                        >
                          Dodaj
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {(projectSpace.milestones || []).map(m => (
                      <div
                        key={m.id}
                        onClick={() => toggleBrotherhoodMilestone(node.id, m.id)}
                        className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#05080e] hover:bg-cyan-950/20 border border-slate-800 cursor-pointer transition-colors"
                      >
                        {m.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-xs font-medium truncate ${m.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                              {m.title}
                            </span>
                            <span className="px-1.5 py-0.2 text-[9px] font-mono-tech rounded bg-purple-900/40 text-purple-300 shrink-0">
                              {m.targetEpoch}
                            </span>
                          </div>
                          {m.description && (
                            <p className="text-[10px] text-slate-400 line-clamp-1">{m.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Files Repository */}
                <div className="p-4 rounded-xl bg-[#090d16] border border-purple-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-cyber font-bold text-xs text-purple-300 flex items-center gap-1.5">
                      <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>PLIKI & ARTEFAKTY</span>
                    </span>
                    <button
                      onClick={() => setIsAddingFile(!isAddingFile)}
                      className="text-[11px] font-mono-tech text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Załącz plik</span>
                    </button>
                  </div>

                  {isAddingFile && (
                    <form onSubmit={handleAddFileSubmit} className="p-3 rounded-lg bg-[#0d131f] border border-purple-500/30 space-y-2 text-xs">
                      <input
                        type="text"
                        value={newFileName}
                        onChange={e => setNewFileName(e.target.value)}
                        placeholder="Nazwa pliku (np. module_schema.json)..."
                        className="w-full bg-[#05080e] border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-purple-400"
                        required
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newFileType}
                          onChange={e => setNewFileType(e.target.value)}
                          placeholder="Rozszerzenie (np. json, ts)"
                          className="w-1/2 bg-[#05080e] border border-slate-700 rounded p-2 text-white text-xs font-mono-tech"
                        />
                        <input
                          type="text"
                          value={newFileSize}
                          onChange={e => setNewFileSize(e.target.value)}
                          placeholder="Rozmiar (np. 14 KB)"
                          className="w-1/2 bg-[#05080e] border border-slate-700 rounded p-2 text-white text-xs font-mono-tech"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsAddingFile(false)}
                          className="px-2.5 py-1 text-slate-400 hover:text-white"
                        >
                          Anuluj
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-purple-500 text-black font-bold font-cyber rounded text-xs"
                        >
                          Załącz
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {(projectSpace.files || []).map(f => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#05080e] border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                          <div className="truncate">
                            <div className="font-mono-tech text-slate-200 truncate">{f.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {f.size} • Przesłane przez {f.uploadedBy}
                            </div>
                          </div>
                        </div>

                        <a
                          href={f.url || '#'}
                          download={f.name}
                          className="p-1.5 rounded-lg hover:bg-purple-950/40 text-purple-300 hover:text-white transition-colors"
                          title="Pobierz"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE ENCRYPTED CHAT */}
          {activeTab === 'CHAT' && (
            <div className="flex flex-col h-full justify-between space-y-3">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {node.messages.map(m => {
                  const isMe = m.senderId === currentArchitect.id;
                  return (
                    <div key={m.id} className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                        <img
                          src={m.senderAvatar || partner.avatar}
                          alt="avatar"
                          className="w-7 h-7 rounded-lg object-cover border border-purple-400 shrink-0 mt-0.5"
                        />
                      )}
                      <div
                        className={`max-w-[80%] p-3 rounded-xl text-xs sm:text-sm ${
                          isMe
                            ? 'bg-purple-900/40 border border-purple-400/40 text-purple-100'
                            : 'bg-[#0d131f] border border-cyan-500/20 text-slate-200'
                        }`}
                      >
                        <div className="text-[10px] font-mono-tech text-slate-400 mb-1 flex items-center justify-between gap-4">
                          <span className="font-bold">{m.senderName}</span>
                          <span className="text-[9px] opacity-70">
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-purple-500/20">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder={`Wiadomość do ${partner.name}...`}
                  className="flex-1 bg-[#0d131f] border border-purple-500/30 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-400 font-sans"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-black font-cyber font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Wyślij</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: SPRINT TASKS */}
          {activeTab === 'TASKS' && (
            <div className="space-y-4">
              <form onSubmit={handleAddTask} className="p-3.5 rounded-xl bg-[#0d131f] border border-purple-500/20 space-y-2">
                <div className="text-xs font-mono-tech text-purple-300 font-bold">
                  Dodaj nowe zadanie sprintowe dla Węzła:
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    placeholder="Np. Napisać interfejs WebSocket dla synchronizacji stanu..."
                    className="flex-1 bg-[#070b13] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-400"
                  />
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="bg-[#070b13] border border-purple-500/30 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none font-mono-tech"
                  >
                    <option value="LOW">Niski priorytet</option>
                    <option value="MEDIUM">Średni priorytet</option>
                    <option value="HIGH">Wysoki priorytet</option>
                    <option value="CRITICAL">Krytyczny</option>
                  </select>
                  <select
                    value={newTaskAssignee}
                    onChange={e => setNewTaskAssignee(e.target.value)}
                    className="bg-[#070b13] border border-purple-500/30 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none font-mono-tech"
                  >
                    <option value={currentArchitect.id}>Przypisz: Ty ({currentArchitect.name})</option>
                    <option value={partner.id}>Przypisz: {partner.name}</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-black font-cyber font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Dodaj</span>
                  </button>
                </div>
              </form>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {node.sharedTasks.map(t => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0d131f] hover:bg-purple-950/20 border border-purple-500/10 text-xs transition-all gap-3"
                  >
                    <div
                      onClick={() => toggleBrotherhoodTask(node.id, t.id)}
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    >
                      {t.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <span className={`truncate ${t.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {t.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {t.priority && (
                        <span
                          className={`px-2 py-0.5 text-[9px] font-mono-tech rounded font-bold ${
                            t.priority === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : t.priority === 'HIGH'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                          }`}
                        >
                          {t.priority}
                        </span>
                      )}

                      <button
                        onClick={() => deleteBrotherhoodTask(node.id, t.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        title="Usuń zadanie"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SHARED ARCHITECTURE NOTES */}
          {activeTab === 'NOTES' && (
            <div className="space-y-3 h-full flex flex-col">
              <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400">
                <span>Wspólny notatnik architektoniczny i szkice koncepcyjne</span>
                <button
                  onClick={() => {
                    if (notesBuffer !== null) updateBrotherhoodNotes(node.id, notesBuffer);
                    playCyberSound('success');
                  }}
                  className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs rounded-lg flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Zapisz Notatki</span>
                </button>
              </div>
              <textarea
                value={currentNotes}
                onChange={e => setNotesBuffer(e.target.value)}
                rows={14}
                className="flex-1 w-full bg-[#0d131f] border border-purple-500/20 rounded-xl p-3 text-xs sm:text-sm text-slate-200 font-mono-tech focus:outline-none focus:border-purple-400 resize-none leading-relaxed"
                placeholder="Zapisujcie wspólne notatki, schematy, decyzje architektoniczne..."
              />
            </div>
          )}
        </div>

        {/* Bottom Workspace Return & Status Footer */}
        <div className="p-3 sm:px-5 bg-[#06080e]/95 border-t border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-tech text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="text-[11px] text-slate-300">
              {language === 'PL' ? 'Aktywny bezpieczny kanał synaptyczny z' : 'Active encrypted synaptic channel with'}{' '}
              <strong className="text-purple-300">{partner.name}</strong>
            </span>
          </div>

          <button
            id="brotherhood-footer-return-btn"
            onClick={handleClose}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 hover:border-purple-300 text-purple-200 hover:text-white font-cyber font-bold text-xs transition-all shadow-[0_0_12px_rgba(168,85,247,0.2)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'PL' ? 'POWRÓT DO LISTY WĘZŁÓW' : 'RETURN TO BROTHERHOOD'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
