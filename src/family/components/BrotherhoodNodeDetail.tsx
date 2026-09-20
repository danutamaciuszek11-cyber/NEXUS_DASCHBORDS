import React, { useState, useEffect, useRef } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Users,
  MessageSquare,
  CheckSquare,
  FileText,
  Send,
  Plus,
  Zap,
  Sparkles,
  Layers,
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
  FileCode,
  LayoutGrid,
  Filter,
  Search,
  CheckCircle2,
  Circle,
  AlertCircle,
  Brain,
  Columns
} from 'lucide-react';
import { BrotherhoodTask, BrotherhoodNode } from '../types';

interface BrotherhoodNodeDetailProps {
  nodeId?: string | null;
  onBack?: () => void;
}

export const BrotherhoodNodeDetail: React.FC<BrotherhoodNodeDetailProps> = ({
  nodeId,
  onBack
}) => {
  const {
    brotherhoodNodes,
    activeBrotherhoodNodeId,
    setActiveBrotherhoodNodeId,
    architects,
    currentArchitect,
    sendBrotherhoodMessage,
    addBrotherhoodTask,
    deleteBrotherhoodTask,
    updateBrotherhoodTask,
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

  const targetNodeId = nodeId || activeBrotherhoodNodeId;
  const node = brotherhoodNodes.find(n => n.id === targetNodeId);

  // Tab selection
  const [activeTab, setActiveTab] = useState<'TASK_BOARD' | 'CHAT' | 'REPOSITORY' | 'OVERVIEW' | 'SPLIT_COCKPIT'>('TASK_BOARD');
  
  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [isBellaThinking, setIsBellaThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Task Board state
  const [taskSearch, setTaskSearch] = useState('');
  const [taskFilterAssignee, setTaskFilterAssignee] = useState<'ALL' | 'ME' | 'PARTNER' | 'JOINT'>('ALL');
  const [taskFilterPriority, setTaskFilterPriority] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>('');
  const [newTaskTag, setNewTaskTag] = useState<string>('SPRINT');

  // RFC & Repository state
  const [isEditingRfc, setIsEditingRfc] = useState(false);
  const [rfcContent, setRfcContent] = useState('');
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneEpoch, setNewMilestoneEpoch] = useState('Epoch 2');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');

  // Files state
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('md');
  const [newFileSize, setNewFileSize] = useState('14.2 KB');

  // GitHub Link state
  const [isLinkingGit, setIsLinkingGit] = useState(false);
  const [gitRepoInput, setGitRepoInput] = useState('');

  // Scroll chat to bottom when messages change
  useEffect(() => {
    if (activeTab === 'CHAT' || activeTab === 'SPLIT_COCKPIT') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [node?.messages.length, activeTab]);

  if (!node) {
    return (
      <div className="p-8 rounded-2xl bg-[#090d16] border border-cyan-500/20 text-center space-y-4">
        <Users className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="font-cyber font-bold text-lg text-white">
          {language === 'PL' ? 'Nie znaleziono węzła Brotherhood' : 'Brotherhood Node Not Found'}
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          {language === 'PL' 
            ? 'Wybierz aktywny węzeł z listy lub zaakceptuj propozycję dopasowania od State Belli.' 
            : 'Select an active node from the list or accept a match proposal from State Bella.'}
        </p>
        {onBack && (
          <button
            onClick={() => onBack?.()}
            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400 text-purple-300 rounded-xl text-xs font-cyber"
          >
            {language === 'PL' ? '← Wróć do listy węzłów' : '← Back to Nodes List'}
          </button>
        )}
      </div>
    );
  }

  const partnerId = node.architect1Id === currentArchitect.id ? node.architect2Id : node.architect1Id;
  const partner = architects.find(a => a.id === partnerId) || architects[1];

  const projectSpace = node.projectSpace || {
    title: `Inicjatywa Architektoniczna: ${currentArchitect.name} & ${partner.name}`,
    description: `Wspólna realizacja założeń architektonicznych w suwerennym węźle Brotherhood.`,
    rfcDocument: `# RFC: INICJATYWA ARCHITEKTONICZNA\n\n**Autorzy:** ${currentArchitect.name} & ${partner.name}\n**Świat:** ${partner.worlds?.[0] || 'nexus-dev-hub'}\n\n## 1. Problem Statement\nRozszerzenie suwerennych protokołów komunikacji i architektury modułowej w ekosystemie Nexus.\n\n## 2. Architektura Systemu\n- Moduł synaptyczny\n- Bezpieczna wymiana danych TLS 1.3\n- Zgodność z zaleceniami State Bella\n\n## 3. Kamienie Milowe\n- Prototyp interfejsu (Epoch 1)\n- Wdrożenie produkcyjne (Epoch 2)`,
    targetDeliverable: 'Demonstrator technologii i moduł produkcyjny',
    status: 'PROTOTYPING',
    milestones: [
      { id: 'm1', title: 'Inicjalizacja węzła i repozytorium', targetEpoch: 'Epoch 1', completed: true, description: 'Ustalenie struktury projektu' },
      { id: 'm2', title: 'Implementacja MVP', targetEpoch: 'Epoch 2', completed: false, description: 'Pierwsza wersja do testów w radzie AI' }
    ],
    files: [
      { id: 'f1', name: 'architecture_spec.md', size: '14.2 KB', type: 'md', uploadedBy: currentArchitect.name, uploadedAt: '2026-09-01', url: '#' }
    ]
  };

  const activeRfc = rfcContent || projectSpace.rfcDocument;

  // Task filtration helper
  const tasks = node.sharedTasks || [];
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const openTasksCount = tasks.length - completedTasksCount;

  const filteredTasks = tasks.filter(task => {
    // Search
    if (taskSearch.trim()) {
      const q = taskSearch.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = (task.description || '').toLowerCase().includes(q);
      const matchTag = (task.tag || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }
    // Assignee
    if (taskFilterAssignee === 'ME' && task.assignedTo !== currentArchitect.id) return false;
    if (taskFilterAssignee === 'PARTNER' && task.assignedTo !== partner.id) return false;
    if (taskFilterAssignee === 'JOINT' && task.assignedTo && task.assignedTo !== 'JOINT') return false;
    // Priority
    if (taskFilterPriority !== 'ALL' && task.priority !== taskFilterPriority) return false;

    return true;
  });

  const todoTasks = filteredTasks.filter(t => !t.completed && (t.status === 'TODO' || !t.status));
  const inProgressTasks = filteredTasks.filter(t => !t.completed && t.status === 'IN_PROGRESS');
  const doneTasks = filteredTasks.filter(t => t.completed || t.status === 'DONE');

  // Task actions
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addBrotherhoodTask(node.id, {
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || undefined,
      priority: newTaskPriority,
      assignedTo: newTaskAssignee || currentArchitect.id,
      completed: false,
      status: 'TODO',
      tag: newTaskTag.trim() || 'SPRINT'
    });

    setNewTaskTitle('');
    setNewTaskDescription('');
    setIsAddingTask(false);
    playCyberSound('beep');
    triggerHaptic();
  };

  const handleMoveTaskStatus = (taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    const isCompleted = newStatus === 'DONE';
    updateBrotherhoodTask(node.id, taskId, {
      status: newStatus,
      completed: isCompleted,
      completedAt: isCompleted ? new Date().toISOString() : undefined
    });
    playCyberSound('click');
  };

  // AI Sprint Generator
  const handleGenerateAiSprint = async () => {
    setIsBellaThinking(true);
    playCyberSound('synapse');

    try {
      const prompt = `State Bella, analyze this Brotherhood pairing between Architect 1 (${currentArchitect.name}, ${currentArchitect.role}, skills: ${currentArchitect.specializations.join(', ')}) and Architect 2 (${partner.name}, ${partner.role}, skills: ${partner.specializations.join(', ')}).
Target Project: ${projectSpace.title}. Deliverable: ${projectSpace.targetDeliverable}.
Generate 3 actionable high-impact sprint tasks. Format strictly as JSON array of objects with keys: title, description, priority (CRITICAL|HIGH|MEDIUM|LOW), assignedTo ("${currentArchitect.id}" or "${partner.id}"), tag.`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          architectProfile: currentArchitect,
          currentView: 'BROTHERHOOD'
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Try parsing JSON or generate structured fallback
        let parsed = null;
        try {
          const match = data.reply.match(/\[[\s\S]*\]/);
          if (match) parsed = JSON.parse(match[0]);
        } catch (e) {
          // ignore parsing error
        }

        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((t: any) => {
            addBrotherhoodTask(node.id, {
              title: t.title || 'Wygenerowane zadanie sprinterskie',
              description: t.description,
              priority: t.priority || 'HIGH',
              assignedTo: t.assignedTo || currentArchitect.id,
              completed: false,
              status: 'TODO',
              tag: t.tag || 'AI-SPRINT'
            });
          });
        } else {
          // Fallback generated tasks
          addBrotherhoodTask(node.id, {
            title: `Sformułowanie kontraktów interfejsowych dla ${projectSpace.title}`,
            description: `Precyzyjne zdefiniowanie schematów wymiany danych pomiędzy modułami.`,
            priority: 'HIGH',
            assignedTo: currentArchitect.id,
            completed: false,
            status: 'TODO',
            tag: 'ARCHITECTURE'
          });
          addBrotherhoodTask(node.id, {
            title: `Weryfikacja implementacji prototypu z ${partner.name}`,
            description: `Wspólna sesja kodowania synaptycznego i walidacji protokołu.`,
            priority: 'MEDIUM',
            assignedTo: partner.id,
            completed: false,
            status: 'TODO',
            tag: 'IMPLEMENTATION'
          });
        }

        sendBrotherhoodMessage(node.id, `🤖 [STATE BELLA]: Zainicjowałam nowy zestaw zadań sprintowych w Tablicy Węzła dopasowanych do profilu ${currentArchitect.name} oraz ${partner.name}.`);
        playCyberSound('success');
      }
    } catch (err) {
      // Offline fallback
      addBrotherhoodTask(node.id, {
        title: `Ustalenie specyfikacji architektury RFC dla ${projectSpace.title}`,
        description: `Weryfikacja założeń technicznych i podział modułów.`,
        priority: 'HIGH',
        assignedTo: currentArchitect.id,
        completed: false,
        status: 'TODO',
        tag: 'RFC'
      });
      addBrotherhoodTask(node.id, {
        title: `Przygotowanie demonstratora w świecie ${projectSpace.worldSlug || 'nexus'}`,
        description: `Wspólna realizacja pierwszego kamienia milowego.`,
        priority: 'MEDIUM',
        assignedTo: partner.id,
        completed: false,
        status: 'TODO',
        tag: 'DEV'
      });
      playCyberSound('success');
    } finally {
      setIsBellaThinking(false);
    }
  };

  // Chat message sending
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sendBrotherhoodMessage(node.id, chatInput.trim());
    setChatInput('');
    playCyberSound('click');
    triggerHaptic();
  };

  // Co-Mediator Bella consultation
  const handleBellaConsultation = async () => {
    setIsBellaThinking(true);
    playCyberSound('synapse');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Co-Mediator State Bella, przeanalizuj bieżący status Węzła Brotherhood pomiędzy ${currentArchitect.name} i ${partner.name}. Zaproponuj kolejny strategiczny krok, usuń ewentualne blokady i wskaż optymalny punkt integracji w projekcie "${projectSpace.title}".`,
          architectProfile: currentArchitect,
          currentView: 'BROTHERHOOD'
        })
      });

      const data = await res.json();
      sendBrotherhoodMessage(node.id, `🤖 [STATE BELLA CO-MEDIATOR]:\n${data.reply}`);
      playCyberSound('success');
    } catch (e) {
      sendBrotherhoodMessage(node.id, `🤖 [STATE BELLA]: Sugestia mediacyjna dla ${currentArchitect.name} i ${partner.name}: Zalecam domknięcie sekcji 2 w dokumencie RFC oraz przypisanie otwartych zadań w Tablicy Zadań.`);
    } finally {
      setIsBellaThinking(false);
    }
  };

  // RFC Save
  const handleSaveRfc = () => {
    updateBrotherhoodProjectSpace(node.id, {
      rfcDocument: activeRfc
    });
    setIsEditingRfc(false);
    playCyberSound('success');
  };

  // Milestone Add
  const handleAddMilestone = (e: React.FormEvent) => {
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
    playCyberSound('beep');
  };

  // File Add
  const handleAddFile = (e: React.FormEvent) => {
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
    playCyberSound('beep');
  };

  // GitHub Link
  const handleLinkGitRepo = (repoUrl: string) => {
    updateBrotherhoodProjectSpace(node.id, {
      githubRepo: repoUrl,
      githubBranch: 'main',
      githubSyncStatus: 'CONNECTED'
    });
    setIsLinkingGit(false);
    setGitRepoInput('');
    playCyberSound('success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Navigation & Pair Identity Bar */}
      <div className="p-4 sm:p-6 rounded-2xl nexus-glass border-2 border-purple-500/40 bg-gradient-to-r from-[#090d16] via-[#0d1424] to-[#0a0f1d] shadow-[0_0_50px_rgba(168,85,247,0.25)] space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={() => {
                  onBack();
                  playCyberSound('click');
                }}
                className="p-2.5 rounded-xl bg-[#080c14] hover:bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:text-white transition-all shadow-md group"
                title={language === 'PL' ? 'Wróć do listy węzłów i Belli' : 'Back to Nodes List'}
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            )}

            {/* Avatars with synapctic glow bridge */}
            <div className="relative flex items-center">
              <div className="relative">
                <img
                  src={currentArchitect.avatar}
                  alt={currentArchitect.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)] z-10"
                />
                <span className="absolute -bottom-1 -left-1 px-1.5 py-0.2 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-400 text-[9px] font-mono-tech font-bold">
                  TY
                </span>
              </div>

              {/* Synapse Connection Pulse */}
              <div className="w-6 sm:w-8 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-ping" />
              </div>

              <div className="relative">
                <img
                  src={partner.avatar}
                  alt={partner.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] z-10"
                />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-purple-950/90 text-purple-300 border border-purple-400 text-[9px] font-mono-tech font-bold">
                  PARTNER
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono-tech font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AKTYWNY WĘZEŁ BROTHERHOOD</span>
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono-tech font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {node.matchScore || 96}% MATCH SYNERGY
                </span>
                <span className="text-xs font-mono-tech text-slate-400">
                  ID: <span className="text-purple-300">{node.id.slice(0, 14)}</span>
                </span>
              </div>

              <h2 className="font-cyber font-bold text-lg sm:text-2xl text-white tracking-wide mt-1">
                {currentArchitect.name} × {partner.name}
              </h2>
              <p className="text-xs text-slate-300 font-sans line-clamp-1 max-w-xl">
                {projectSpace.title}: {projectSpace.description}
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#06080e]/90 border border-purple-500/20 text-xs font-mono-tech">
              <div>
                <span className="text-slate-400 text-[10px] block">ZADANIA</span>
                <span className="text-cyan-300 font-bold">{completedTasksCount}/{tasks.length}</span>
              </div>
              <div className="h-6 w-px bg-purple-500/20" />
              <div>
                <span className="text-slate-400 text-[10px] block">CZAT</span>
                <span className="text-purple-300 font-bold">{node.messages.length}</span>
              </div>
              <div className="h-6 w-px bg-purple-500/20" />
              <div>
                <span className="text-slate-400 text-[10px] block">PLIKI</span>
                <span className="text-emerald-300 font-bold">{(projectSpace.files || []).length}</span>
              </div>
            </div>

            <button
              onClick={handleBellaConsultation}
              disabled={isBellaThinking}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-cyber font-bold text-xs transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] disabled:opacity-50"
            >
              <Brain className={`w-4 h-4 ${isBellaThinking ? 'animate-spin text-cyan-400' : 'text-purple-200'}`} />
              <span>{isBellaThinking ? 'Bella myśli...' : 'Bella Co-Mediator'}</span>
            </button>
          </div>
        </div>

        {/* View Selection Tabs */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-purple-500/20 overflow-x-auto scrollbar-none">
          {[
            { key: 'TASK_BOARD', label: language === 'PL' ? 'TABLICA ZADAŃ (SPRINT BOARD)' : 'SHARED TASK BOARD', icon: CheckSquare, badge: openTasksCount > 0 ? `${openTasksCount} otw.` : undefined },
            { key: 'CHAT', label: language === 'PL' ? 'DEDYKOWANY CZAT PARY' : 'PAIR CHAT THREAD', icon: MessageSquare, badge: `${node.messages.length}` },
            { key: 'REPOSITORY', label: language === 'PL' ? 'REPOZYTORIUM DOKUMENTACJI & RFC' : 'DOCS REPOSITORY & RFC', icon: FolderGit2, badge: `${(projectSpace.files || []).length} plik.` },
            { key: 'OVERVIEW', label: language === 'PL' ? 'ANALIZA 6D & PROFILE' : '6D SYNERGY & PROFILES', icon: Layers },
            { key: 'SPLIT_COCKPIT', label: language === 'PL' ? 'WIDOK ZINTEGROWANY' : 'ALL-IN-ONE COCKPIT', icon: Columns }
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as any);
                  playCyberSound('click');
                  triggerHaptic();
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-cyber transition-all shrink-0 ${
                  isSel
                    ? 'bg-gradient-to-r from-purple-600/30 via-cyan-500/20 to-purple-600/30 border border-purple-400 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-purple-950/20 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSel ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono-tech ${
                    isSel ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/40' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SHARED TASK BOARD (KANBAN COLUMNS & SPRINT) */}
      {/* ========================================================================= */}
      {(activeTab === 'TASK_BOARD' || activeTab === 'SPLIT_COCKPIT') && (
        <div className="space-y-4">
          {/* Action & Filter Controls */}
          <div className="p-4 rounded-xl bg-[#090d16] border border-cyan-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap flex-1">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={taskSearch}
                  onChange={e => setTaskSearch(e.target.value)}
                  placeholder={language === 'PL' ? 'Szukaj zadań...' : 'Search tasks...'}
                  className="w-full bg-[#05080e] border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono-tech"
                />
              </div>

              {/* Assignee Filter */}
              <div className="flex items-center gap-1 bg-[#05080e] p-1 rounded-xl border border-slate-800 text-xs font-mono-tech">
                {(['ALL', 'ME', 'PARTNER', 'JOINT'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => {
                      setTaskFilterAssignee(filter);
                      playCyberSound('click');
                    }}
                    className={`px-2 py-1 rounded-lg transition-colors ${
                      taskFilterAssignee === filter
                        ? 'bg-purple-500/30 text-purple-200 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter === 'ALL' && 'Wszystkie'}
                    {filter === 'ME' && 'Moje'}
                    {filter === 'PARTNER' && partner.name.split(' ')[0]}
                    {filter === 'JOINT' && 'Wspólne'}
                  </button>
                ))}
              </div>

              {/* Priority Filter */}
              <select
                value={taskFilterPriority}
                onChange={e => setTaskFilterPriority(e.target.value as any)}
                className="bg-[#05080e] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 font-mono-tech focus:outline-none focus:border-cyan-400"
              >
                <option value="ALL">Wszystkie priorytety</option>
                <option value="CRITICAL">🔥 CRITICAL</option>
                <option value="HIGH">⚡ HIGH</option>
                <option value="MEDIUM">🔹 MEDIUM</option>
                <option value="LOW">◽ LOW</option>
              </select>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleGenerateAiSprint}
                disabled={isBellaThinking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-300 text-xs font-cyber transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Generuj Sprint z AI</span>
              </button>

              <button
                onClick={() => setIsAddingTask(!isAddingTask)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingTask ? 'Anuluj' : 'Nowe Zadanie'}</span>
              </button>
            </div>
          </div>

          {/* Add Task Collapsible Form */}
          {isAddingTask && (
            <form onSubmit={handleCreateTask} className="p-4 rounded-2xl bg-[#090d16] border-2 border-cyan-500/40 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-cyber font-bold text-xs text-cyan-300 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                  <span>DODAJ NOWE ZADANIE DO WSPÓLNEGO SPRINTU</span>
                </span>
                <span className="text-[10px] font-mono-tech text-slate-400">Prywatna Tablica Węzła</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    placeholder="Tytuł zadania (np. Zaprojektowanie schematu API websocketów)..."
                    className="w-full bg-[#05080e] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
                    required
                  />
                  <textarea
                    value={newTaskDescription}
                    onChange={e => setNewTaskDescription(e.target.value)}
                    placeholder="Opcjonalny opis, wymagania techniczne lub linki do RFC..."
                    rows={2}
                    className="w-full bg-[#05080e] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans resize-none"
                  />
                </div>

                <div className="space-y-2 text-xs font-mono-tech">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Przypisany Architekt:</label>
                    <select
                      value={newTaskAssignee}
                      onChange={e => setNewTaskAssignee(e.target.value)}
                      className="w-full bg-[#05080e] border border-slate-700 rounded-xl p-2 text-white focus:outline-none focus:border-cyan-400 text-xs"
                    >
                      <option value={currentArchitect.id}>{currentArchitect.name} (Ty)</option>
                      <option value={partner.id}>{partner.name} (Partner)</option>
                      <option value="JOINT">Wspólne (Obaj architekci)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Priorytet:</label>
                      <select
                        value={newTaskPriority}
                        onChange={e => setNewTaskPriority(e.target.value as any)}
                        className="w-full bg-[#05080e] border border-slate-700 rounded-xl p-2 text-white focus:outline-none focus:border-cyan-400 text-xs"
                      >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="CRITICAL">CRITICAL</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Tag / Kategoria:</label>
                      <input
                        type="text"
                        value={newTaskTag}
                        onChange={e => setNewTaskTag(e.target.value)}
                        placeholder="SPRINT, RFC, CODE"
                        className="w-full bg-[#05080e] border border-slate-700 rounded-xl p-2 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs rounded-xl"
                >
                  Zapisz i Dodaj do Sprintu
                </button>
              </div>
            </form>
          )}

          {/* Kanban Columns (3 Columns: To Do, In Progress, Done) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* COLUMN 1: TO DO */}
            <div className="p-4 rounded-2xl bg-[#080c14] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Circle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-cyber font-bold text-xs text-slate-200">
                    DO ZROBIENIA (BACKLOG)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-amber-500/20 text-amber-300 font-bold">
                  {todoTasks.length}
                </span>
              </div>

              <div className="space-y-2.5 min-h-[160px]">
                {todoTasks.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs font-mono-tech">
                    Brak zadań w kolejce
                  </div>
                ) : (
                  todoTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      currentArchitect={currentArchitect}
                      partner={partner}
                      onToggle={() => toggleBrotherhoodTask(node.id, task.id)}
                      onDelete={() => deleteBrotherhoodTask(node.id, task.id)}
                      onMoveProgress={() => handleMoveTaskStatus(task.id, 'IN_PROGRESS')}
                      onMoveDone={() => handleMoveTaskStatus(task.id, 'DONE')}
                    />
                  ))
                )}
              </div>
            </div>

            {/* COLUMN 2: IN PROGRESS */}
            <div className="p-4 rounded-2xl bg-[#080c14] border border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="font-cyber font-bold text-xs text-cyan-300">
                    W TRAKCIE REALIZACJI
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-cyan-500/20 text-cyan-300 font-bold">
                  {inProgressTasks.length}
                </span>
              </div>

              <div className="space-y-2.5 min-h-[160px]">
                {inProgressTasks.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs font-mono-tech">
                    Brak aktywnych zadań
                  </div>
                ) : (
                  inProgressTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      currentArchitect={currentArchitect}
                      partner={partner}
                      onToggle={() => toggleBrotherhoodTask(node.id, task.id)}
                      onDelete={() => deleteBrotherhoodTask(node.id, task.id)}
                      onMoveTodo={() => handleMoveTaskStatus(task.id, 'TODO')}
                      onMoveDone={() => handleMoveTaskStatus(task.id, 'DONE')}
                    />
                  ))
                )}
              </div>
            </div>

            {/* COLUMN 3: COMPLETED */}
            <div className="p-4 rounded-2xl bg-[#080c14] border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-cyber font-bold text-xs text-emerald-300">
                    UKOŃCZONE & ZWERYFIKOWANE
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-emerald-500/20 text-emerald-300 font-bold">
                  {doneTasks.length}
                </span>
              </div>

              <div className="space-y-2.5 min-h-[160px]">
                {doneTasks.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs font-mono-tech">
                    Brak ukończonych zadań
                  </div>
                ) : (
                  doneTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      currentArchitect={currentArchitect}
                      partner={partner}
                      onToggle={() => toggleBrotherhoodTask(node.id, task.id)}
                      onDelete={() => deleteBrotherhoodTask(node.id, task.id)}
                      onMoveTodo={() => handleMoveTaskStatus(task.id, 'TODO')}
                      onMoveProgress={() => handleMoveTaskStatus(task.id, 'IN_PROGRESS')}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DEDICATED PAIR CHAT (LIVE THREAD) */}
      {/* ========================================================================= */}
      {(activeTab === 'CHAT' || activeTab === 'SPLIT_COCKPIT') && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080c14] border border-purple-500/30 flex flex-col h-[520px] justify-between space-y-3 shadow-lg">
            {/* Top Chat Channel Meta */}
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span className="font-cyber font-bold text-xs sm:text-sm text-white">
                  SZYFROWANY KANAŁ BEZPOŚREDNI: {currentArchitect.name} ↔ {partner.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono-tech">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>SYNAPSE ACTIVE</span>
                </span>
                <button
                  onClick={handleBellaConsultation}
                  disabled={isBellaThinking}
                  className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[11px] font-mono-tech border border-purple-400/40 flex items-center gap-1"
                >
                  <Brain className="w-3 h-3 text-cyan-400" />
                  <span>Poproś Bellę o moderację</span>
                </button>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {node.messages.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs font-mono-tech">Rozpocznijcie rozmowę projektową.</p>
                </div>
              ) : (
                node.messages.map(m => {
                  const isMe = m.senderId === currentArchitect.id;
                  const isBella = m.senderName.includes('BELLA') || m.content.includes('STATE BELLA');

                  if (isBella) {
                    return (
                      <div key={m.id} className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-400/40 text-xs text-purple-200 space-y-1 shadow-[0_0_15px_rgba(168,85,247,0.15)] my-2">
                        <div className="flex items-center justify-between text-[10px] font-mono-tech text-cyan-400 font-bold">
                          <span className="flex items-center gap-1">
                            <Bot className="w-3.5 h-3.5 text-purple-400" />
                            <span>STATE BELLA (CO-MEDIATOR SYSTEMOWY)</span>
                          </span>
                          <span className="text-slate-400 font-normal">
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap leading-relaxed font-sans text-slate-200">{m.content}</div>
                      </div>
                    );
                  }

                  return (
                    <div key={m.id} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                        <img
                          src={m.senderAvatar || partner.avatar}
                          alt="avatar"
                          className="w-8 h-8 rounded-xl object-cover border border-purple-400 shrink-0 mt-0.5"
                        />
                      )}
                      <div
                        className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm ${
                          isMe
                            ? 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-400/40 text-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                            : 'bg-[#0d131f] border border-cyan-500/20 text-slate-200'
                        }`}
                      >
                        <div className="text-[10px] font-mono-tech text-slate-400 mb-1 flex items-center justify-between gap-4">
                          <span className="font-bold text-cyan-300">{m.senderName}</span>
                          <span className="text-[9px] opacity-70">
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap leading-relaxed font-sans">{m.content}</div>
                      </div>
                      {isMe && (
                        <img
                          src={currentArchitect.avatar}
                          alt="avatar"
                          className="w-8 h-8 rounded-xl object-cover border border-cyan-400 shrink-0 mt-0.5"
                        />
                      )}
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Action Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono-tech">
              <button
                onClick={() => setChatInput(`Cześć ${partner.name}, przejrzyjmy otwarte zadania w sprincie i ustalmy priorytety na dziś.`)}
                className="px-2.5 py-1 rounded-lg bg-[#0d131f] hover:bg-purple-950/40 border border-purple-500/20 text-purple-300 whitespace-nowrap"
              >
                📋 Przegląd zadań
              </button>
              <button
                onClick={() => setChatInput(`Zaktualizowałem dokument RFC w sekcji architektury. Daj znać, co sądzisz o zaproponowanym podziale modułów.`)}
                className="px-2.5 py-1 rounded-lg bg-[#0d131f] hover:bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 whitespace-nowrap"
              >
                📄 Aktualizacja RFC
              </button>
              <button
                onClick={() => setChatInput(`Podpiąłem repozytorium na GitHubie. Możemy zsynchronizować branch i zacząć pisać kod!`)}
                className="px-2.5 py-1 rounded-lg bg-[#0d131f] hover:bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 whitespace-nowrap"
              >
                🚀 Push na GitHub
              </button>
              <button
                onClick={handleBellaConsultation}
                className="px-2.5 py-1 rounded-lg bg-[#0d131f] hover:bg-pink-950/40 border border-pink-500/20 text-pink-300 whitespace-nowrap"
              >
                🤖 Synteza Belli
              </button>
            </div>

            {/* Message Input Bar */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder={`Wpisz wiadomość do ${partner.name} (Wciśnij Enter)...`}
                className="flex-1 bg-[#05080e] border border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-black font-cyber font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Wyślij</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SHARED PROJECT REPOSITORY & RFC DOCUMENTATION */}
      {/* ========================================================================= */}
      {(activeTab === 'REPOSITORY' || activeTab === 'SPLIT_COCKPIT') && (
        <div className="space-y-5">
          {/* Project Header Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0a0f1d] via-[#090d16] to-purple-950/40 border border-cyan-500/30 space-y-4 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono-tech text-cyan-400 font-bold uppercase tracking-wider">
                  WSPÓLNA PRZESTRZEŃ INŻYNIERYJNA & DOKUMENTACJA PROJEKTOWA
                </span>
                <h3 className="font-cyber font-bold text-xl text-white mt-1">
                  {projectSpace.title}
                </h3>
                <p className="text-xs text-slate-300 font-sans max-w-2xl mt-1 leading-relaxed">
                  {projectSpace.description}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="px-3 py-1 rounded-xl text-[10px] font-mono-tech font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  STATUS: {projectSpace.status || 'PROTOTYPING'}
                </span>
                {projectSpace.worldSlug && (
                  <span className="text-[10px] font-mono-tech text-slate-400">
                    Świat docelowy: <strong className="text-purple-300">{projectSpace.worldSlug}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* GitHub Integration Ribbon */}
            <div className="pt-3 border-t border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d131f] border border-purple-500/30 text-xs font-mono-tech">
                  <Github className="w-4 h-4 text-purple-300" />
                  <span className="text-slate-400">GitHub Repository:</span>
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
                    <span className="text-slate-500 italic">Brak połączonego repo</span>
                  )}
                </div>

                {projectSpace.githubBranch && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0d131f] border border-cyan-500/20 text-[10px] font-mono-tech text-cyan-300">
                    <GitBranch className="w-3 h-3 text-cyan-400" />
                    <span>{projectSpace.githubBranch}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLinkingGit(!isLinkingGit)}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-300 text-xs font-mono-tech transition-colors flex items-center gap-1.5"
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>{projectSpace.githubRepo ? 'Zmień repozytorium' : 'Połącz z GitHub'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsGitHubModalOpen(true);
                    playCyberSound('click');
                  }}
                  className="p-2 rounded-xl bg-[#0d131f] hover:bg-purple-950/40 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Otwórz GitHub Sync Hub"
                >
                  <Github className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Collapsible GitHub Link Form */}
            {isLinkingGit && (
              <div className="p-3.5 rounded-xl bg-[#080c14] border border-purple-500/30 space-y-2.5 text-xs animate-in fade-in">
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
                    className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs rounded-lg"
                  >
                    Połącz
                  </button>
                  <button
                    onClick={() => setIsLinkingGit(false)}
                    className="px-2.5 py-1.5 text-slate-400 hover:text-white text-xs"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RFC DOCUMENT SPECIFICATION */}
          <div className="p-5 rounded-2xl bg-[#080c14] border border-purple-500/30 space-y-4 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-purple-400" />
                <div>
                  <h4 className="font-cyber font-bold text-sm sm:text-base text-white">
                    SPECYFIKACJA TECHNICZNA RFC (REQUEST FOR COMMENTS)
                  </h4>
                  <p className="text-[11px] font-mono-tech text-slate-400">
                    Wspólnie edytowalny dokument architektoniczny w formacie Markdown
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isEditingRfc ? (
                  <>
                    <button
                      onClick={handleSaveRfc}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-cyber font-bold text-xs rounded-xl transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Zapisz RFC</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingRfc(false);
                        setRfcContent('');
                      }}
                      className="px-3 py-1.5 text-xs font-mono-tech text-slate-400 hover:text-white"
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
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-300 text-xs font-cyber rounded-xl transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edytuj Treść RFC</span>
                  </button>
                )}
              </div>
            </div>

            {isEditingRfc ? (
              <div className="space-y-2">
                <textarea
                  value={activeRfc}
                  onChange={e => setRfcContent(e.target.value)}
                  rows={14}
                  className="w-full bg-[#05080e] border border-purple-500/40 rounded-xl p-4 text-xs sm:text-sm text-slate-200 font-mono-tech leading-relaxed focus:outline-none focus:border-cyan-400 resize-y"
                  placeholder="Wpisz pełną treść specyfikacji RFC w formacie Markdown..."
                />
                <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
                  <span>Wsparcie składni Markdown (nagłówki #, listy -, kod ```)</span>
                  <span>Liczba znaków: {activeRfc.length}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-6 rounded-xl bg-[#05080e] border border-slate-800 text-xs sm:text-sm text-slate-200 font-mono-tech whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {projectSpace.rfcDocument}
              </div>
            )}
          </div>

          {/* TWO COLUMN GRID: MILESTONES & REPOSITORY FILES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Milestones Roadmap */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#080c14] border border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/15">
                <span className="font-cyber font-bold text-xs text-cyan-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>KAMIENIE MILOWE PROJEKTU (ROADMAP)</span>
                </span>
                <button
                  onClick={() => setIsAddingMilestone(!isAddingMilestone)}
                  className="text-xs font-mono-tech text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nowy kamień</span>
                </button>
              </div>

              {isAddingMilestone && (
                <form onSubmit={handleAddMilestone} className="p-3 rounded-xl bg-[#0d131f] border border-cyan-500/30 space-y-2 text-xs">
                  <input
                    type="text"
                    value={newMilestoneTitle}
                    onChange={e => setNewMilestoneTitle(e.target.value)}
                    placeholder="Nazwa kamienia milowego..."
                    className="w-full bg-[#05080e] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMilestoneEpoch}
                      onChange={e => setNewMilestoneEpoch(e.target.value)}
                      placeholder="Np. Epoch 2.1"
                      className="w-1/3 bg-[#05080e] border border-slate-700 rounded-lg p-2 text-white text-xs font-mono-tech"
                    />
                    <input
                      type="text"
                      value={newMilestoneDesc}
                      onChange={e => setNewMilestoneDesc(e.target.value)}
                      placeholder="Krótki opis oczekiwanego rezultatu..."
                      className="flex-1 bg-[#05080e] border border-slate-700 rounded-lg p-2 text-white text-xs"
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
                      className="px-3.5 py-1 bg-cyan-500 text-black font-cyber font-bold rounded-lg text-xs"
                    >
                      Dodaj
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {(projectSpace.milestones || []).map(m => (
                  <div
                    key={m.id}
                    onClick={() => toggleBrotherhoodMilestone(node.id, m.id)}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-[#05080e] hover:bg-cyan-950/20 border border-slate-800 cursor-pointer transition-colors"
                  >
                    {m.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-bold truncate ${m.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {m.title}
                        </span>
                        <span className="px-2 py-0.2 text-[9px] font-mono-tech rounded bg-purple-900/40 text-purple-300 shrink-0">
                          {m.targetEpoch}
                        </span>
                      </div>
                      {m.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-1">{m.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shared Files & Artifacts */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#080c14] border border-purple-500/20 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-purple-500/15">
                <span className="font-cyber font-bold text-xs text-purple-300 flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-purple-400" />
                  <span>PLIKI & ARTEFAKTY REPOZYTORIUM</span>
                </span>
                <button
                  onClick={() => setIsAddingFile(!isAddingFile)}
                  className="text-xs font-mono-tech text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Załącz plik</span>
                </button>
              </div>

              {isAddingFile && (
                <form onSubmit={handleAddFile} className="p-3 rounded-xl bg-[#0d131f] border border-purple-500/30 space-y-2 text-xs">
                  <input
                    type="text"
                    value={newFileName}
                    onChange={e => setNewFileName(e.target.value)}
                    placeholder="Nazwa pliku (np. synapse_schema.json)..."
                    className="w-full bg-[#05080e] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-purple-400"
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFileType}
                      onChange={e => setNewFileType(e.target.value)}
                      placeholder="Format (np. json, ts, md)"
                      className="w-1/2 bg-[#05080e] border border-slate-700 rounded-lg p-2 text-white text-xs font-mono-tech"
                    />
                    <input
                      type="text"
                      value={newFileSize}
                      onChange={e => setNewFileSize(e.target.value)}
                      placeholder="Rozmiar (np. 14 KB)"
                      className="w-1/2 bg-[#05080e] border border-slate-700 rounded-lg p-2 text-white text-xs font-mono-tech"
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
                      className="px-3.5 py-1 bg-purple-500 text-black font-cyber font-bold rounded-lg text-xs"
                    >
                      Załącz
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {(projectSpace.files || []).map(f => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#05080e] border border-slate-800 text-xs hover:border-purple-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                      <div className="truncate">
                        <div className="font-mono-tech text-slate-200 font-bold truncate">{f.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {f.size} • Dodane przez {f.uploadedBy}
                        </div>
                      </div>
                    </div>

                    <a
                      href={f.url || '#'}
                      download={f.name}
                      className="p-1.5 rounded-lg hover:bg-purple-950/40 text-purple-300 hover:text-white transition-colors"
                      title="Pobierz plik"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: 6D SYNERGY ANALYSIS & PROFILE BREAKDOWN */}
      {/* ========================================================================= */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-5">
          {/* Partner Profiles Comparison Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#080c14] border border-cyan-500/30 space-y-3">
              <div className="flex items-center gap-3">
                <img src={currentArchitect.avatar} alt={currentArchitect.name} className="w-14 h-14 rounded-2xl object-cover border border-cyan-400" />
                <div>
                  <div className="font-cyber font-bold text-base text-white">{currentArchitect.name} (Ty)</div>
                  <div className="text-xs font-mono-tech text-cyan-400">{currentArchitect.handle} • {currentArchitect.role}</div>
                  <div className="text-[11px] font-mono-tech text-slate-400">Ranga: {currentArchitect.rank || 'Lead Architect'}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 pt-2 border-t border-cyan-500/15">
                {currentArchitect.specializations.map(s => (
                  <span key={s} className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#080c14] border border-purple-500/30 space-y-3">
              <div className="flex items-center gap-3">
                <img src={partner.avatar} alt={partner.name} className="w-14 h-14 rounded-2xl object-cover border border-purple-400" />
                <div>
                  <div className="font-cyber font-bold text-base text-white">{partner.name} (Partner)</div>
                  <div className="text-xs font-mono-tech text-purple-400">{partner.handle} • {partner.role}</div>
                  <div className="text-[11px] font-mono-tech text-slate-400">Ranga: {partner.rank || 'Core Architect'}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 pt-2 border-t border-purple-500/15">
                {partner.specializations.map(s => (
                  <span key={s} className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-purple-950/60 text-purple-300 border border-purple-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 6-Dimension Analysis Grid */}
          <div className="p-5 rounded-2xl bg-[#080c14] border border-purple-500/25 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="text-purple-300 font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>SZCZEGÓŁOWA ANALIZA 6-WYMIAROWA PARY (BROTHERHOOD ENGINE)</span>
              </span>
              <span className="text-[10px] text-slate-400">Ocena zgodności AI State Bella: {node.matchScore || 96}%</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0d131f] border border-purple-500/20 space-y-1.5">
                <div className="text-[11px] font-mono-tech text-purple-300 font-bold flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>1. KOMPETENCJE & DOMENY</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {node.dimensionAnalysis?.competencyMatch || `Harmonijna fuzja inżynierii systemowej z designem interakcji.`}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0d131f] border border-cyan-500/20 space-y-1.5">
                <div className="text-[11px] font-mono-tech text-cyan-300 font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>2. PROJEKTY & ŚWIATY</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {node.dimensionAnalysis?.projectSynergy || `Zbieżność w budowie modułów w światach ${partner.worlds?.[0] || 'nexus-dev-hub'}.`}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0d131f] border border-amber-500/20 space-y-1.5">
                <div className="text-[11px] font-mono-tech text-amber-300 font-bold flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-amber-400" />
                  <span>3. WIZJA & ZAINTERESOWANIA</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {node.dimensionAnalysis?.interestAlignment || `Wspólny cel rozwoju suwerennych sieci twórców i systemów rozproszonych.`}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0d131f] border border-emerald-500/20 space-y-1.5">
                <div className="text-[11px] font-mono-tech text-emerald-300 font-bold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>4. CELE STRATEGICZNE</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {node.dimensionAnalysis?.goalAlignment || `Zorientowanie na budowę działających artefaktów i demonstratorów technologicznych.`}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0d131f] border border-pink-500/20 space-y-1.5">
                <div className="text-[11px] font-mono-tech text-pink-300 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-pink-400" />
                  <span>5. STYL PRACY & CADENCE</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {node.dimensionAnalysis?.workStyleComplementarity || `Równowaga pomiędzy szybkim prototypingiem a solidną architekturą.`}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0d131f] border border-violet-500/20 space-y-1.5">
                <div className="text-[11px] font-mono-tech text-violet-300 font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-violet-400" />
                  <span>6. DOŚWIADCZENIE & RANGA</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {node.dimensionAnalysis?.experienceSynergy || `Komplementarny transfer wiedzy pomiędzy poziomami Architektów.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component: Task Card in Kanban Board
interface TaskCardProps {
  task: BrotherhoodTask;
  currentArchitect: any;
  partner: any;
  onToggle: () => void;
  onDelete: () => void;
  onMoveTodo?: () => void;
  onMoveProgress?: () => void;
  onMoveDone?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  currentArchitect,
  partner,
  onToggle,
  onDelete,
  onMoveTodo,
  onMoveProgress,
  onMoveDone
}) => {
  const isMe = task.assignedTo === currentArchitect.id;
  const isJoint = task.assignedTo === 'JOINT' || !task.assignedTo;
  const assigneeName = isMe ? 'Ty' : isJoint ? 'Wspólne' : partner.name.split(' ')[0];
  const assigneeAvatar = isMe ? currentArchitect.avatar : isJoint ? null : partner.avatar;

  const priorityColors = {
    CRITICAL: 'bg-red-500/20 text-red-300 border-red-500/40',
    HIGH: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    MEDIUM: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    LOW: 'bg-slate-700/40 text-slate-300 border-slate-600'
  };

  return (
    <div className={`p-3 rounded-xl bg-[#0b101c] border transition-all space-y-2 group shadow-sm ${
      task.completed ? 'border-emerald-500/20 opacity-75' : 'border-slate-800 hover:border-purple-500/40'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <button
            onClick={() => onToggle?.()}
            className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
            title={task.completed ? 'Oznacz jako nieukończone' : 'Oznacz jako ukończone'}
          >
            {task.completed ? (
              <CheckSquare className="w-4 h-4 text-emerald-400" />
            ) : (
              <Circle className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
            )}
          </button>
          <div className="min-w-0 flex-1">
            <div className={`text-xs font-medium leading-snug break-words ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
              {task.title}
            </div>
            {task.description && (
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed font-sans">
                {task.description}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => onDelete?.()}
          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity p-1"
          title="Usuń zadanie"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Task Metadata & Actions Bar */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap text-[10px] font-mono-tech">
        <div className="flex items-center gap-1.5 flex-wrap">
          {task.priority && (
            <span className={`px-1.5 py-0.2 rounded border ${priorityColors[task.priority] || priorityColors.MEDIUM}`}>
              {task.priority}
            </span>
          )}

          {task.tag && (
            <span className="px-1.5 py-0.2 rounded bg-purple-950/60 text-purple-300 border border-purple-500/20">
              #{task.tag}
            </span>
          )}

          <div className="flex items-center gap-1 px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-300">
            {assigneeAvatar ? (
              <img src={assigneeAvatar} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
            ) : (
              <Users className="w-3 h-3 text-cyan-400" />
            )}
            <span>{assigneeName}</span>
          </div>
        </div>

        {/* Move Column Actions */}
        <div className="flex items-center gap-1">
          {onMoveTodo && (
            <button
              onClick={() => onMoveTodo?.()}
              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Przesuń do Do zrobienia"
            >
              ↩ Do zrobienia
            </button>
          )}
          {onMoveProgress && (
            <button
              onClick={() => onMoveProgress?.()}
              className="px-1.5 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30"
              title="Przesuń do W trakcie"
            >
              ⚡ W trakcie
            </button>
          )}
          {onMoveDone && (
            <button
              onClick={() => onMoveDone?.()}
              className="px-1.5 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30"
              title="Ukończ zadanie"
            >
              ✓ Gotowe
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
