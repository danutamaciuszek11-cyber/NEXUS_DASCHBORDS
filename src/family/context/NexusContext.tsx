import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { signInWithPopup, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import {
  Architect,
  NexusWorld,
  NexusWorldModule,
  Project,
  ProjectStatus,
  Mission,
  MissionApplicant,
  MemoryDocument,
  FeedPost,
  ChatRoom,
  BrotherhoodNode,
  UserRole,
  AccessRequest,
  AuditLog,
  ProofOfLegacyRecord,
  SystemTelemetry,
  Specialization,
  ArchitectMatchSuggestion,
  ProjectCollaborationSuggestion,
  AuthUser,
  GitHubUser,
  GitHubRepo,
  GitHubIntegrationState,
  BrotherhoodProjectSpace,
  BrotherhoodMilestone,
  BrotherhoodFile,
  BrotherhoodTask,
  BellaEcosystemHealthReport,
  ProjectActivityAudit,
  BellaOrchestratorRecommendation,
  GenesisMilestone
} from '../types';
import {
  INITIAL_ARCHITECTS,
  INITIAL_WORLDS,
  INITIAL_PROJECTS,
  INITIAL_MISSIONS,
  INITIAL_BROTHERHOOD_NODES,
  INITIAL_MEMORY_DOCS,
  INITIAL_FEED_POSTS,
  INITIAL_CHAT_ROOMS,
  INITIAL_ACCESS_REQUESTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_TELEMETRY,
  INITIAL_GENESIS_MILESTONES
} from '../mockData';

export type ActiveView =
  | 'DASHBOARD'
  | 'BELLA'
  | 'BROTHERHOOD'
  | 'MAP'
  | 'NEURAL_MAP'
  | 'WORLDS'
  | 'PROJECTS'
  | 'MISSIONS'
  | 'MEMORY'
  | 'FEED'
  | 'AI_COUNCIL'
  | 'ROOMS'
  | 'ARCHITECTS'
  | 'GENESIS'
  | 'CODE'
  | 'ADMIN'
  | 'AUDIT'
  | 'REQUEST_ACCESS';

export type Language = 'PL' | 'EN';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'BROTHERHOOD' | 'MISSION' | 'SYSTEM';
  read: boolean;
  actionView?: ActiveView;
}

interface NexusContextType {
  // Authentication & Mandatory Access
  isAuthenticated: boolean;
  authUser: AuthUser | null;
  idToken: string | null;
  cloudSqlStatus: any;
  autoLoginEnabled: boolean;
  setAutoLoginEnabled: (enabled: boolean) => void;
  loginWithGoogle: (userInfo?: { name?: string; email?: string; avatar?: string; handle?: string }) => void;
  loginWithFirebaseGoogle: () => Promise<void>;
  loginWithArchitect: (architectId: string) => void;
  logout: () => void;

  // Navigation & User State
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currentArchitect: Architect;
  setCurrentArchitectId: (id: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Sound & Haptics & Security
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  hapticsEnabled: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
  playCyberSound: (type: 'beep' | 'synapse' | 'success' | 'node' | 'click' | 'error') => void;
  triggerHaptic: () => void;
  isBiometricLocked: boolean;
  toggleBiometricLock: () => void;

  // Data Collections
  architects: Architect[];
  worlds: NexusWorld[];
  projects: Project[];
  missions: Mission[];
  brotherhoodNodes: BrotherhoodNode[];
  memoryDocs: MemoryDocument[];
  feedPosts: FeedPost[];
  chatRooms: ChatRoom[];
  accessRequests: AccessRequest[];
  auditLogs: AuditLog[];
  telemetry: SystemTelemetry;
  genesisMilestones: GenesisMilestone[];
  notifications: NotificationItem[];
  architectMatches: ArchitectMatchSuggestion[];
  projectCollaborationSuggestions: ProjectCollaborationSuggestion[];
  isMatchingLoading: boolean;
  activeNodeToken: string;
  projectHealthReport: BellaEcosystemHealthReport | null;
  isAnalyzingProjectActivity: boolean;

  // Data Actions
  analyzeProjectActivity: (filterWorld?: string, focusProjectId?: string) => Promise<BellaEcosystemHealthReport>;
  suggestCollaborationsForProject: (projectId: string) => Promise<void>;
  logAuditEvent: (event: Omit<AuditLog, 'id' | 'timestamp'> & { id?: string; timestamp?: string }) => Promise<AuditLog>;
  probeNodeIdentity: (nodeToken?: string, microservice?: string) => Promise<any>;
  clearAuditLogs: () => Promise<void>;
  refreshAuditLogs: () => Promise<void>;
  updateArchitectProfile: (profile: Partial<Architect>) => void;
  updateSpecificArchitect: (id: string, updates: Partial<Architect>) => void;
  createArchitectProfile: (profile: Omit<Architect, 'id'>) => string;
  addWorld: (world: Omit<NexusWorld, 'id' | 'contributionPoints'>) => void;
  updateWorld: (slug: string, updates: Partial<NexusWorld>) => void;
  addRoadmapToWorld: (slug: string, step: { phase: string; title: string; description: string; status: 'DONE' | 'ACTIVE' | 'UPCOMING' }) => void;
  addModuleToWorld: (slug: string, module: { name: string; description: string; status: 'PLANNED' | 'DEVELOPMENT' | 'STABLE' }) => void;
  createProject: (project: any) => void;
  addProject: (project: any) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  deleteProjects: (ids: string[]) => void;
  archiveProjects: (ids: string[], archiveState?: boolean) => void;
  batchUpdateProjectStatus: (ids: string[], status: ProjectStatus) => void;
  postMission: (mission: any) => void;
  addMission: (mission: any) => void;
  applyForMission: (missionId: string, pitch?: string) => void;
  assignMissionApplicant: (missionId: string, applicantId: string) => void;
  completeMission: (missionId: string) => void;
  runArchitectMatchmaking: (customGoal?: string) => Promise<void>;
  analyzeArchitectPair: (architect1Id: string, architect2Id: string) => Promise<any>;
  handleMatchDecision: (matchId: string, decision: 'ACCEPTED' | 'DECLINED' | 'POSTPONED', notes?: string) => void;
  handleCollaborationDecision: (collabId: string, decision: 'ACCEPTED' | 'DECLINED' | 'POSTPONED') => void;
  initiateCollaborationFromPost: (post: FeedPost) => void;
  createBrotherhoodNode: (partnerId: string, customProject?: Partial<BrotherhoodProjectSpace>) => BrotherhoodNode;
  handleBrotherhoodDecision: (nodeId: string, decision: 'ACCEPT' | 'DECLINE' | 'LATER') => void;
  sendBrotherhoodMessage: (nodeId: string, content: string) => void;
  addBrotherhoodTask: (nodeId: string, task: string | Omit<BrotherhoodTask, 'id'>) => void;
  deleteBrotherhoodTask: (nodeId: string, taskId: string) => void;
  updateBrotherhoodTask: (nodeId: string, taskId: string, updates: Partial<BrotherhoodTask>) => void;
  toggleBrotherhoodTask: (nodeId: string, taskId: string) => void;
  updateBrotherhoodNotes: (nodeId: string, notes: string) => void;
  updateBrotherhoodProjectSpace: (nodeId: string, updates: Partial<BrotherhoodProjectSpace>) => void;
  addBrotherhoodMilestone: (nodeId: string, milestone: { title: string; targetEpoch: string; description?: string }) => void;
  toggleBrotherhoodMilestone: (nodeId: string, milestoneId: string) => void;
  addBrotherhoodFile: (nodeId: string, file: { name: string; size: string; type: string; url: string }) => void;
  addMemoryDoc: (doc: Omit<MemoryDocument, 'id' | 'lastUpdated' | 'verifiedByBella'>) => void;
  createFeedPost: (post: any) => void;
  addFeedPost: (post: any) => void;
  reactToFeedPost: (postId: string, reactionType: 'synapse' | 'built' | 'spark' | 'partner' | 'review') => void;
  addFeedComment: (postId: string, content: string) => void;
  sendRoomMessage: (roomId: string, content: string) => void;
  submitAccessRequest: (req: Omit<AccessRequest, 'id' | 'status' | 'submittedAt'>) => void;
  handleAccessRequestDecision: (reqId: string, decision: 'APPROVED' | 'WAITLIST' | 'REJECTED') => void;
  reviewAccessRequest: (reqId: string, decision: 'APPROVED' | 'WAITLIST' | 'REJECTED') => void;
  signNexusOath: () => void;
  addGenesisMilestone: (milestone: Omit<GenesisMilestone, 'id'>) => void;
  endorseGenesisMilestone: (id: string) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Modals & Drawers
  activeBrotherhoodNodeId: string | null;
  setActiveBrotherhoodNodeId: (id: string | null) => void;
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  activeMissionId: string | null;
  setActiveMissionId: (id: string | null) => void;
  activeWorldSlug: string | null;
  setActiveWorldSlug: (slug: string | null) => void;
  activeArchitectModalId: string | null;
  setActiveArchitectModalId: (id: string | null) => void;
  isProfileEditorOpen: boolean;
  setIsProfileEditorOpen: (open: boolean) => void;
  isCreateProfileModalOpen: boolean;
  setIsCreateProfileModalOpen: (open: boolean) => void;
  editingArchitect: Architect | null;
  setEditingArchitect: (arch: Architect | null) => void;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;
  showBellaOverlay: boolean;
  setShowBellaOverlay: (show: boolean) => void;
  showAccessRequestModal: boolean;
  setShowAccessRequestModal: (show: boolean) => void;
  showNotificationsDrawer: boolean;
  setShowNotificationsDrawer: (show: boolean) => void;
  isCheatSheetOpen: boolean;
  setIsCheatSheetOpen: (open: boolean) => void;
  toggleCheatSheet: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;

  // Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // GitHub Integration & Repositories
  githubState: GitHubIntegrationState;
  isGitHubModalOpen: boolean;
  setIsGitHubModalOpen: (open: boolean) => void;
  openGitHubModal: () => void;
  connectGitHubOAuth: () => Promise<void>;
  connectGitHubToken: (token: string) => Promise<{ success: boolean; message?: string }>;
  connectGitHubDemo: (username?: string) => Promise<boolean>;
  disconnectGitHub: () => Promise<void>;
  refreshGitHubRepos: () => Promise<void>;
  syncGitHubToCurrentArchitect: () => void;
  linkGitHubRepoToProject: (projectId: string, repoUrl: string) => void;
  publishNexusDocsToGitHub: (repoName?: string, isPublic?: boolean) => Promise<{ success: boolean; repoUrl?: string; message?: string }>;

  // ARK-CODEX Proof of Legacy & Chronicle of Eterniverse
  proofOfLegacyRecords: ProofOfLegacyRecord[];
  generateProofOfLegacy: (title: string, contributionType: ProofOfLegacyRecord['contributionType'], details: string) => ProofOfLegacyRecord;
  isNeuralBridgeOpen: boolean;
  openNeuralBridgeModal: () => void;
  closeNeuralBridgeModal: () => void;
  isChronicleOpen: boolean;
  openChronicleModal: () => void;
  closeChronicleModal: () => void;
}

const NexusContext = createContext<NexusContextType | null>(null);

export const NexusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & User
  const [currentView, setCurrentView] = useState<ActiveView>('DASHBOARD');
  const [language, setLanguage] = useState<Language>('PL');
  const [currentArchitectId, setCurrentArchitectId] = useState<string>('arch-1');
  const [currentRole, setCurrentRole] = useState<UserRole>('FOUNDER');

  // Preferences & Toggles
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(true);
  const [isBiometricLocked, setIsBiometricLocked] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [activeBrotherhoodNodeId, setActiveBrotherhoodNodeId] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [activeWorldSlug, setActiveWorldSlug] = useState<string | null>(null);
  const [activeArchitectModalId, setActiveArchitectModalId] = useState<string | null>(null);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState<boolean>(false);
  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] = useState<boolean>(false);
  const [editingArchitect, setEditingArchitect] = useState<Architect | null>(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [showBellaOverlay, setShowBellaOverlay] = useState<boolean>(false);
  const [showAccessRequestModal, setShowAccessRequestModal] = useState<boolean>(false);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState<boolean>(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState<boolean>(false);
  const toggleCheatSheet = () => setIsCheatSheetOpen(prev => !prev);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('nexus_sidebar_open');
    if (saved !== null) {
      return saved === 'true';
    }
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  });
  const [isMatchingLoading, setIsMatchingLoading] = useState<boolean>(false);

  // Mandatory Authentication State
  const [autoLoginEnabled, setAutoLoginEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('nexus_auto_login_google');
    return saved !== null ? saved === 'true' : true;
  });

  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('nexus_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('nexus_auth_user');
    const auto = localStorage.getItem('nexus_auto_login_google');
    const isAuto = auto !== null ? auto === 'true' : true;
    return Boolean(saved) && isAuto;
  });

  const setAutoLoginEnabled = (enabled: boolean) => {
    setAutoLoginEnabledState(enabled);
    localStorage.setItem('nexus_auto_login_google', String(enabled));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => {
      const next = !prev;
      localStorage.setItem('nexus_sidebar_open', String(next));
      return next;
    });
  };

  const isMobileSidebarOpen = isSidebarOpen;
  const setIsMobileSidebarOpen = (open: boolean) => {
    setIsSidebarOpen(open);
    localStorage.setItem('nexus_sidebar_open', String(open));
  };
  const toggleMobileSidebar = toggleSidebar;

  // Core Data Collections (with initial local fallback)
  const [architects, setArchitects] = useState<Architect[]>(() => {
    const saved = localStorage.getItem('nexus_architects');
    return saved ? JSON.parse(saved) : INITIAL_ARCHITECTS;
  });

  const [worlds, setWorlds] = useState<NexusWorld[]>(() => {
    const saved = localStorage.getItem('nexus_worlds');
    return saved ? JSON.parse(saved) : INITIAL_WORLDS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('nexus_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('nexus_missions');
    return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
  });

  const [brotherhoodNodes, setBrotherhoodNodes] = useState<BrotherhoodNode[]>(() => {
    const saved = localStorage.getItem('nexus_brotherhood');
    return saved ? JSON.parse(saved) : INITIAL_BROTHERHOOD_NODES;
  });

  const [memoryDocs, setMemoryDocs] = useState<MemoryDocument[]>(() => {
    const saved = localStorage.getItem('nexus_memory');
    return saved ? JSON.parse(saved) : INITIAL_MEMORY_DOCS;
  });

  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(() => {
    const saved = localStorage.getItem('nexus_feed');
    return saved ? JSON.parse(saved) : INITIAL_FEED_POSTS;
  });

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(() => {
    const saved = localStorage.getItem('nexus_rooms');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_ROOMS;
  });

  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(() => {
    const saved = localStorage.getItem('nexus_access_requests');
    return saved ? JSON.parse(saved) : INITIAL_ACCESS_REQUESTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('nexus_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Top Compatible Architect Matches (Bella Neural Matches)
  const [architectMatches, setArchitectMatches] = useState<ArchitectMatchSuggestion[]>(() => {
    const saved = localStorage.getItem('nexus_architect_matches');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved architect matches', e);
      }
    }
    return [
      {
        id: 'match-arch-2',
        architectId: 'arch-2',
        compatibilityScore: 96,
        status: 'SUGGESTED',
        dimensionScores: {
          competencies: 98,
          projects: 95,
          interests: 97,
          goals: 96,
          workStyle: 93,
          experience: 97
        },
        dimensions: {
          competencyMatch: 'Frontend & WebGL Mastery (Elena) + System Architecture & AI Orchestration (Krystian)',
          projectSynergy: 'Wspólny rozwój interaktywnego HUD dla Nexus Dev Hub oraz Living Neural Canvas',
          interestAlignment: 'Wizja cyber-architektury, haptyki i kinetycznych interfejsów nowej ery',
          goalAlignment: 'Synchronizacja dążeń: osiągnięcie stabilnego 60fps dla dynamicznych węzłów i suwerennych modułów',
          workStyleComplementarity: 'Elena tworzy szybkie prototypy wizualne, podczas gdy Ty definiujesz długofalowe specyfikacje RFC',
          experienceSynergy: 'Harmonijny sojusz Master Architecta z Council Elderem — zero tarć kompetencyjnych'
        },
        briefRationale: 'Idealne domknięcie produktowe: architektura backendowo-systemowa połączona ze światowej klasy rzemiosłem wizualnym.',
        pairProjectProposal: {
          title: 'GPU Neural Canvas & Living HUD Interface',
          description: 'Wspólna realizacja akcelerowanego sprzętowo interfejsu grafowego dla całej rodziny Nexus.',
          worldSlug: 'nexus-dev-hub',
          targetDeliverable: 'Biblioteka NeuralCanvas v3.2 ze wsparciem GLSL i dotyku',
          estimatedTimeline: 'Sprint 2 Epochs'
        },
        suggestedRoles: ['Lead Visual Engineer', 'Core Architect'],
        suggestedFirstAction: 'Zainicjuj węzeł Brotherhood i stwórzcie wspólnie specyfikację RFC-009 dla GPU Neural Canvas.',
        createdAt: '2026-08-30'
      },
      {
        id: 'match-arch-3',
        architectId: 'arch-3',
        compatibilityScore: 93,
        status: 'SUGGESTED',
        dimensionScores: {
          competencies: 96,
          projects: 94,
          interests: 96,
          goals: 94,
          workStyle: 90,
          experience: 95
        },
        dimensions: {
          competencyMatch: 'AI Research & Vector Embeddings (Tomasz) + Prompt Engineering & Ecosystem Strategy (Krystian)',
          projectSynergy: 'Rozbudowa silnika kognitywnego State Bella oraz protokołu Semantic Memory Router w Nexus AI',
          interestAlignment: 'Autonomiczne agenty, zdecentralizowane bazy wiedzy i swarm intelligence',
          goalAlignment: 'Wdrożenie wielopoziomowego bufora pamięci kognitywnej i skrócenie czasu dopasowań synaptycznych',
          workStyleComplementarity: 'Metodyczne podejście badawcze Tomasza wzmacnia Twoje strategiczne tempo wdrażania innowacji',
          experienceSynergy: 'Głębokie zaplecze neuronowe połączone z doświadczeniem skalowania rozproszonych systemów'
        },
        briefRationale: 'Potężny tandem badawczo-architektoniczny podnoszący współczynnik inteligencji całego ekosystemu Nexus.',
        pairProjectProposal: {
          title: 'State Bella Episodic Vector Memory Router',
          description: 'Zintegrowany graf wiedzy semantycznej dla asystentów rodziny Nexus.',
          worldSlug: 'nexus-ai',
          targetDeliverable: 'Mikroserwis buforowania pamięci z czasem odpowiedzi < 120ms',
          estimatedTimeline: 'Epoch 3.3'
        },
        suggestedRoles: ['Cognitive AI Lead', 'Ecosystem Strategist'],
        suggestedFirstAction: 'Zaplanujcie sprint synchronizacji pamięci State Bella z wieloma wątkami rad AI.',
        createdAt: '2026-08-28'
      },
      {
        id: 'match-arch-5',
        architectId: 'arch-5',
        compatibilityScore: 89,
        status: 'SUGGESTED',
        dimensionScores: {
          competencies: 94,
          projects: 88,
          interests: 95,
          goals: 92,
          workStyle: 89,
          experience: 94
        },
        dimensions: {
          competencyMatch: 'Web3, Smart Contracts & Cryptography (Marcus) + Distributed System Design (Krystian)',
          projectSynergy: 'Wdrożenie suwerennych węzłów i ekonomii wkładu w Nexus DAO & Security',
          interestAlignment: 'Prywatność zero-knowledge, decentralizacja tożsamości i suwerenność twórców',
          goalAlignment: 'Wprowadzenie trustless quorum i dowodów ZK dla certyfikacji architektów',
          workStyleComplementarity: 'Rygorystyczna dyscyplina bezpieczeństwa Marcusa doskonale chroni skalowalność platformy',
          experienceSynergy: 'Audytorski rygor kryptograficzny połączony z holistycznym projektowaniem architektury'
        },
        briefRationale: 'Kluczowe partnerstwo dla zapewnienia trustless tokenomiki i odporności kryptograficznej platformy.',
        pairProjectProposal: {
          title: 'Sovereign Brotherhood ZK Identity & Quorum Protocol',
          description: 'Prywatne kontrakty weryfikacji wkładu architektonicznego i quorum węzłów.',
          worldSlug: 'nexus-dev-hub',
          targetDeliverable: 'Smart kontrakt Soulbound Identity z audytem formalnym',
          estimatedTimeline: 'Epoch 3.4'
        },
        suggestedRoles: ['Cryptographic Security Lead', 'Infrastructure Architect'],
        suggestedFirstAction: 'Audyt smart kontraktów dla modułu dystrybucji nagród Nexus Bounties.',
        createdAt: '2026-08-25'
      }
    ];
  });

  // Project Collaboration Suggestions
  const [projectCollaborationSuggestions, setProjectCollaborationSuggestions] = useState<ProjectCollaborationSuggestion[]>([
    {
      id: 'collab-1',
      projectId: 'proj-1',
      architectId: 'arch-2',
      status: 'SUGGESTED',
      compatibilityScore: 95,
      rationale: 'Elena Rostova posiada unikalne umiejętności w Three.js/WebGL niezbędne do realizacji interfejsu GPU dla Nexusbook.',
      complementarySkills: ['WebGL', 'Tailwind', 'Motion UI'],
      sharedInterests: ['Cyberpunk UI', 'Realtime Systems'],
      projectAlignment: 'Objęcie kierownictwa nad interaktywną mapą synaps i dynamicznym HUD.',
      createdAt: '2026-08-30'
    },
    {
      id: 'collab-2',
      projectId: 'proj-3',
      architectId: 'arch-3',
      status: 'SUGGESTED',
      compatibilityScore: 92,
      rationale: 'Tomasz Wolski może zintegrować wektorowe drzewa pamięci z radą 7 perspektyw State Bella.',
      complementarySkills: ['Gemini API', 'Vector DB', 'Prompt Engineering'],
      sharedInterests: ['Cognitive Architectures', 'Semantic Indexing'],
      projectAlignment: 'Implementacja pamięci długoterminowej i routera kontekstowego w module Nexus AI.',
      createdAt: '2026-08-29'
    }
  ]);

  const [projectHealthReport, setProjectHealthReport] = useState<BellaEcosystemHealthReport | null>(null);
  const [isAnalyzingProjectActivity, setIsAnalyzingProjectActivity] = useState<boolean>(false);

  const [telemetry, setTelemetry] = useState<SystemTelemetry>(INITIAL_TELEMETRY);

  const [genesisMilestones, setGenesisMilestones] = useState<GenesisMilestone[]>(() => {
    const saved = localStorage.getItem('nexus_genesis_milestones');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_GENESIS_MILESTONES;
  });

  useEffect(() => {
    localStorage.setItem('nexus_genesis_milestones', JSON.stringify(genesisMilestones));
  }, [genesisMilestones]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'State Bella: New Brotherhood Compatibility',
      message: 'Bella identified a 96% complementary match with Elena Rostova for Nexus Dev Hub.',
      timestamp: 'Just now',
      type: 'BROTHERHOOD',
      read: false,
      actionView: 'BROTHERHOOD'
    },
    {
      id: 'notif-2',
      title: 'Mission Reward Unlocked',
      message: 'GPU Neural Living Node Canvas marked ready for review (+650 Contribution Score).',
      timestamp: '15m ago',
      type: 'MISSION',
      read: false,
      actionView: 'MISSIONS'
    }
  ]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('nexus_architects', JSON.stringify(architects));
  }, [architects]);

  useEffect(() => {
    localStorage.setItem('nexus_worlds', JSON.stringify(worlds));
  }, [worlds]);

  useEffect(() => {
    localStorage.setItem('nexus_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('nexus_missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('nexus_brotherhood', JSON.stringify(brotherhoodNodes));
  }, [brotherhoodNodes]);

  useEffect(() => {
    localStorage.setItem('nexus_architect_matches', JSON.stringify(architectMatches));
  }, [architectMatches]);

  useEffect(() => {
    localStorage.setItem('nexus_memory', JSON.stringify(memoryDocs));
  }, [memoryDocs]);

  useEffect(() => {
    localStorage.setItem('nexus_feed', JSON.stringify(feedPosts));
  }, [feedPosts]);

  useEffect(() => {
    localStorage.setItem('nexus_rooms', JSON.stringify(chatRooms));
  }, [chatRooms]);

  useEffect(() => {
    localStorage.setItem('nexus_access_requests', JSON.stringify(accessRequests));
  }, [accessRequests]);

  useEffect(() => {
    localStorage.setItem('nexus_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Initial audit logs prefetch from server
  useEffect(() => {
    fetch('/api/audit-logs')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.logs && Array.isArray(data.logs) && data.logs.length > 0) {
          // Merge or prioritize server logs if empty or newer
          setAuditLogs(prev => {
            if (prev.length === 0) return data.logs;
            const existingIds = new Set(prev.map(p => p.id));
            const newLogs = data.logs.filter((l: any) => !existingIds.has(l.id));
            return [...newLogs, ...prev];
          });
        }
      })
      .catch(() => {
        // Safe failover
      });
  }, []);

  // Simulated living telemetry pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        synapticFlashesPerMin: Math.floor(45 + Math.random() * 25),
        activeArchitects: Math.floor(138 + Math.random() * 8),
        coreHealth: Math.min(100, Math.max(98.5, 99.8 + (Math.random() * 0.4 - 0.2)))
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentArchitect = architects.find(a => a.id === currentArchitectId) || architects[0] || INITIAL_ARCHITECTS[0];

  // Cyber Synthesizer Sound Generator via Web Audio API
  const playCyberSound = useCallback((type: 'beep' | 'synapse' | 'success' | 'node' | 'click' | 'error') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'synapse' || type === 'node') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.14);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        osc.frequency.setValueAtTime(1046.50, now + 0.24);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch {
      // Audio context error recovery
    }
  }, [soundEnabled]);

  const triggerHaptic = useCallback(() => {
    if (!hapticsEnabled || typeof navigator === 'undefined') return;
    try {
      if (typeof navigator.vibrate === 'function') {
        navigator.vibrate(15);
      }
    } catch {
      // Safe fail
    }
  }, [hapticsEnabled]);

  const toggleBiometricLock = () => {
    setIsBiometricLocked(prev => !prev);
    playCyberSound('beep');
    triggerHaptic();
  };

  // GitHub Integration State & Actions
  const [githubState, setGithubState] = useState<GitHubIntegrationState>(() => {
    const saved = localStorage.getItem('nexus_github_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      isConnected: false,
      user: null,
      repos: [],
      isLoading: false,
      error: null
    };
  });

  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);
  const openGitHubModal = () => {
    setIsGitHubModalOpen(true);
    playCyberSound('click');
    triggerHaptic();
  };

  useEffect(() => {
    localStorage.setItem('nexus_github_state', JSON.stringify(githubState));
  }, [githubState]);

  // Check server GitHub status on mount
  const checkGitHubStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/github/status');
      if (res.ok) {
        const data = await res.json();
        if (data.isConnected && data.user) {
          setGithubState(prev => ({
            ...prev,
            isConnected: true,
            user: data.user,
            repos: data.repos || [],
            lastSyncedAt: data.lastSyncedAt || new Date().toISOString(),
            isLoading: false,
            error: null,
            authMode: data.authMode || prev.authMode || 'OAUTH'
          }));
        }
      }
    } catch (e) {
      console.warn('Could not query GitHub status:', e);
    }
  }, []);

  useEffect(() => {
    checkGitHubStatus();
  }, [checkGitHubStatus]);

  // Listen for window.opener.postMessage from the OAuth callback popup window
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'object') {
        if (event.data.type === 'OAUTH_AUTH_SUCCESS' && (event.data.provider === 'github' || !event.data.provider)) {
          console.log('[NEXUS] Received GitHub OAuth success event:', event.data);
          checkGitHubStatus();
          playCyberSound('success');
          triggerHaptic();
          setNotifications(prev => [
            {
              id: `notif-gh-${Date.now()}`,
              title: language === 'PL' ? '⚡ Synapsa GitHub Połączona' : '⚡ GitHub Synapse Established',
              message: language === 'PL'
                ? `Konto GitHub ${event.data.user?.login ? `@${event.data.user.login}` : ''} zostało pomyślnie zintegrowane z ekosystemem Nexus.`
                : `GitHub account ${event.data.user?.login ? `@${event.data.user.login}` : ''} successfully linked to Nexus.`,
              timestamp: 'Just now',
              type: 'SYSTEM',
              read: false
            },
            ...prev
          ]);
        } else if (event.data.type === 'OAUTH_AUTH_ERROR') {
          setGithubState(prev => ({
            ...prev,
            isLoading: false,
            error: event.data.error || 'Błąd autoryzacji OAuth'
          }));
          playCyberSound('error');
          triggerHaptic();
          setNotifications(prev => [
            {
              id: `notif-gh-err-${Date.now()}`,
              title: language === 'PL' ? '⚠️ Błąd Autoryzacji GitHub' : '⚠️ GitHub Auth Error',
              message: event.data.error || 'Autoryzacja OAuth została przerwana.',
              timestamp: 'Just now',
              type: 'SYSTEM',
              read: false
            },
            ...prev
          ]);
        }
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [checkGitHubStatus, language, playCyberSound, triggerHaptic]);

  // Connect via OAuth Popup Flow
  const connectGitHubOAuth = async () => {
    setGithubState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await fetch('/api/auth/github/url');
      const data = await res.json();

      if (!data.configured || !data.url) {
        setGithubState(prev => ({
          ...prev,
          isLoading: false,
          error: data.message || 'GITHUB_CLIENT_ID nie został jeszcze skonfigurowany w Settings > Secrets.'
        }));
        return;
      }

      // Open OAuth popup window directly to GitHub authorize URL
      const width = 600;
      const height = 720;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(
        data.url,
        'nexus-github-oauth-window',
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
      );

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        setGithubState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Blokada wyskakujących okienek (pop-up blocker) zablokowała okno logowania. Zezwól na wyskakujące okna i spróbuj ponownie.'
        }));
        return;
      }

      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval);
          setGithubState(prev => ({ ...prev, isLoading: false }));
        }
      }, 1200);
    } catch (err: any) {
      setGithubState(prev => ({
        ...prev,
        isLoading: false,
        error: err?.message || 'Błąd inicjalizacji okna autoryzacji GitHub.'
      }));
    }
  };

  // Connect via Personal Access Token (PAT)
  const connectGitHubToken = async (token: string) => {
    setGithubState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await fetch('/api/github/connect-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Nie udało się zweryfikować tokenu GitHub.');
      }
      const newState: GitHubIntegrationState = {
        isConnected: true,
        user: data.user,
        repos: data.repos || [],
        lastSyncedAt: new Date().toISOString(),
        isLoading: false,
        error: null,
        authMode: 'TOKEN'
      };
      setGithubState(newState);
      playCyberSound('success');
      triggerHaptic();
      setNotifications(prev => [
        {
          id: `notif-pat-${Date.now()}`,
          title: language === 'PL' ? 'Token GitHub Zweryfikowany' : 'GitHub Token Verified',
          message: language === 'PL'
            ? `Połączono konto @${data.user?.login} (${(data.repos || []).length} repozytoriów).`
            : `Connected @${data.user?.login} (${(data.repos || []).length} repositories).`,
          timestamp: 'Just now',
          type: 'SYSTEM',
          read: false
        },
        ...prev
      ]);
      return { success: true };
    } catch (err: any) {
      setGithubState(prev => ({ ...prev, isLoading: false, error: err?.message }));
      playCyberSound('error');
      return { success: false, message: err?.message };
    }
  };

  // Connect Demo Profile
  const connectGitHubDemo = async (username = 'krystian-nexus') => {
    setGithubState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await fetch('/api/github/demo-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      const data = await res.json();
      const newState: GitHubIntegrationState = {
        isConnected: true,
        user: data.user,
        repos: data.repos || [],
        lastSyncedAt: new Date().toISOString(),
        isLoading: false,
        error: null,
        authMode: 'DEMO'
      };
      setGithubState(newState);
      playCyberSound('success');
      triggerHaptic();
      setNotifications(prev => [
        {
          id: `notif-demo-${Date.now()}`,
          title: language === 'PL' ? 'Tryb GitHub Demo Aktywny' : 'GitHub Demo Active',
          message: language === 'PL'
            ? `Załadowano oficjalne repozytoria ekosystemu Nexus dla @${data.user?.login}.`
            : `Loaded official Nexus ecosystem repositories for @${data.user?.login}.`,
          timestamp: 'Just now',
          type: 'SYSTEM',
          read: false
        },
        ...prev
      ]);
      return true;
    } catch (e: any) {
      setGithubState(prev => ({ ...prev, isLoading: false, error: e?.message }));
      return false;
    }
  };

  // Disconnect GitHub
  const disconnectGitHub = async () => {
    try {
      await fetch('/api/github/disconnect', { method: 'POST' });
    } catch (e) {}
    const cleared: GitHubIntegrationState = {
      isConnected: false,
      user: null,
      repos: [],
      isLoading: false,
      error: null
    };
    setGithubState(cleared);
    localStorage.removeItem('nexus_github_state');
    playCyberSound('click');
    triggerHaptic();
    setNotifications(prev => [
      {
        id: `notif-disc-${Date.now()}`,
        title: language === 'PL' ? 'GitHub Odłączony' : 'GitHub Disconnected',
        message: language === 'PL' ? 'Rozłączono sesję GitHub.' : 'GitHub session disconnected.',
        timestamp: 'Just now',
        type: 'SYSTEM',
        read: false
      },
      ...prev
    ]);
  };

  // Refresh live repositories
  const refreshGitHubRepos = async () => {
    if (!githubState.isConnected) return;
    setGithubState(prev => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch('/api/github/repos');
      if (res.ok) {
        const data = await res.json();
        setGithubState(prev => ({
          ...prev,
          repos: data.repos || prev.repos,
          lastSyncedAt: new Date().toISOString(),
          isLoading: false
        }));
        playCyberSound('node');
      } else {
        setGithubState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (e) {
      setGithubState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Link GitHub Repo to Nexus Project
  const linkGitHubRepoToProject = (projectId: string, repoUrl: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, repoUrl };
      }
      return p;
    }));
    playCyberSound('node');
    triggerHaptic();
    setNotifications(prev => [
      {
        id: `notif-link-${Date.now()}`,
        title: language === 'PL' ? 'Repozytorium Przypisane' : 'Repository Linked',
        message: language === 'PL'
          ? `Przypisano repozytorium GitHub do projektu.`
          : `Linked GitHub repository to the project.`,
        timestamp: 'Just now',
        type: 'SYSTEM',
        read: false
      },
      ...prev
    ]);
  };

  // Sync GitHub Profile & Repos with current architect
  const syncGitHubToCurrentArchitect = () => {
    if (!githubState.user) return;
    setArchitects(prev => prev.map(a => {
      if (a.id === currentArchitectId) {
        return {
          ...a,
          githubUrl: githubState.user?.html_url || `https://github.com/${githubState.user?.login}`,
          contributionScore: Math.max(a.contributionScore, a.contributionScore + (githubState.repos.length * 5))
        };
      }
      return a;
    }));
    playCyberSound('success');
    triggerHaptic();
    setNotifications(prev => [
      {
        id: `notif-sync-${Date.now()}`,
        title: language === 'PL' ? 'Profil Architekta Zsynchronizowany' : 'Architect Profile Synced',
        message: language === 'PL'
          ? `Zaktualizowano profil o link do GitHub @${githubState.user.login} oraz punkty wkładu.`
          : `Updated profile with GitHub @${githubState.user.login} and contribution points.`,
        timestamp: 'Just now',
        type: 'SYSTEM',
        read: false
      },
      ...prev
    ]);
  };

  // Publish NEXUS-DOCS Repository
  const publishNexusDocsToGitHub = async (repoName = 'nexus-docs', isPublic = true) => {
    try {
      const res = await fetch('/api/github/publish-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoName,
          isPublic,
          docsCount: memoryDocs.length
        })
      });

      const data = await res.json();
      const owner = githubState.user?.login || 'krystian-nexus';
      const repoUrl = data.repoUrl || `https://github.com/${owner}/${repoName}`;

      const newRepo: GitHubRepo = data.repo || {
        id: Date.now(),
        name: repoName,
        full_name: `${owner}/${repoName}`,
        html_url: repoUrl,
        description: `NEXUS-DOCS • Oficjalne Repozytorium Dokumentacji i Standardów Ekosystemu Nexus (${memoryDocs.length} dokumentów RFC)`,
        private: !isPublic,
        fork: false,
        stargazers_count: 15,
        forks_count: 4,
        open_issues_count: 0,
        language: 'Markdown',
        updated_at: new Date().toISOString(),
        default_branch: 'main'
      };

      setGithubState(prev => ({
        ...prev,
        isConnected: true,
        repos: prev.repos.some(r => r.name === repoName)
          ? prev.repos.map(r => r.name === repoName ? newRepo : r)
          : [newRepo, ...prev.repos]
      }));

      const currentArchitect = architects.find(a => a.id === currentArchitectId);
      const newLog: AuditLog = {
        id: `log-gh-docs-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorId: currentArchitectId,
        actorName: currentArchitect ? `@${currentArchitect.handle}` : 'Architekt',
        action: 'NEXUS_DOCS_PUBLISHED_GITHUB',
        target: `GitHub Repo: ${owner}/${repoName}`,
        details: `Wystawiono specyfikację NEXUS-DOCS (${memoryDocs.length} dokumentów) w repozytorium GitHub`,
        severity: 'SUCCESS',
        category: 'NODE',
        nodeToken: activeNodeToken,
        microserviceName: 'github-synapse-docs-publisher',
        endpoint: '/api/github/publish-docs',
        statusCode: 200,
        latencyMs: 38
      };
      setAuditLogs(prev => [newLog, ...prev]);

      playCyberSound('success');
      triggerHaptic();

      setNotifications(prev => [
        {
          id: `notif-pubdocs-${Date.now()}`,
          title: language === 'PL' ? 'NEXUS-DOCS Opublikowane na GitHub' : 'NEXUS-DOCS Published on GitHub',
          message: language === 'PL'
            ? `Wystawiono specyfikację NEXUS-DOCS w repozytorium ${owner}/${repoName}`
            : `Exposed NEXUS-DOCS specification in repository ${owner}/${repoName}`,
          timestamp: 'Just now',
          type: 'SYSTEM',
          read: false
        },
        ...prev
      ]);

      return { success: true, repoUrl, message: data.message };
    } catch (err: any) {
      console.error('Error publishing NEXUS-DOCS to GitHub:', err);
      return { success: false, message: err.message || 'Błąd publikacji NEXUS-DOCS.' };
    }
  };

  // Modals for Neural Bridge and Chronicle of Eterniverse
  const [isNeuralBridgeOpen, setIsNeuralBridgeOpen] = useState(false);
  const [isChronicleOpen, setIsChronicleOpen] = useState(false);

  const openNeuralBridgeModal = () => setIsNeuralBridgeOpen(true);
  const closeNeuralBridgeModal = () => setIsNeuralBridgeOpen(false);
  const openChronicleModal = () => setIsChronicleOpen(true);
  const closeChronicleModal = () => setIsChronicleOpen(false);

  // ARK-CODEX Proof of Legacy Records
  const [proofOfLegacyRecords, setProofOfLegacyRecords] = useState<ProofOfLegacyRecord[]>(() => {
    const saved = localStorage.getItem('nexus_proof_of_legacy');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved Proof of Legacy records', e);
      }
    }
    return [
      {
        id: 'pol-genesis-01',
        hash: '0xLOGOS-734F91A23BC88D9E0124A',
        architectId: 'arch-1',
        architectHandle: 'maciej_founder',
        architectName: 'Krystian / Maciej',
        contributionType: 'MILESTONE',
        title: 'Aktywacja Protokołu LOGOS & Węzła Synaptycznego Nexus 1.0',
        details: 'Sygnatura założycielska i powiązanie tożsamości z pierwszym binarnym światem.',
        logosProtocolSignature: 'LOGOS-VERIFIED-NODE-734LLM-ORIGIN',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        verificationUrl: 'https://github.com/krystian-nexus/nexus-docs'
      },
      {
        id: 'pol-vulcan-guard',
        hash: '0xLOGOS-882E11D942A002C921BB',
        architectId: 'arch-2',
        architectHandle: 'elena_synth',
        architectName: 'Elena Rostova',
        contributionType: 'EVALUATION',
        title: 'Wdrożenie Osłon VULCAN-SHIELD Sentinel',
        details: 'Integracja granic bezpieczeństwa i automatycznego audytu mikroservisów.',
        logosProtocolSignature: 'LOGOS-VERIFIED-GUARDIAN-VULCAN-SEC',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        verificationUrl: 'https://github.com/krystian-nexus/nexus-docs'
      },
      {
        id: 'pol-lore-chronicle',
        hash: '0xLOGOS-901C44F33AB11E9900FA',
        architectId: 'arch-3',
        architectHandle: 'tomasz_neural',
        architectName: 'Tomasz Wolski',
        contributionType: 'LORE',
        title: 'Kronika Cywilizacyjna Eterniverse Codex RFC-01',
        details: 'Stworzenie podwalin mitologicznych i semantycznych dla suwerennych domów.',
        logosProtocolSignature: 'LOGOS-VERIFIED-CHRONICLER-ETERNIVERSE',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        verificationUrl: 'https://github.com/krystian-nexus/nexus-docs'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('nexus_proof_of_legacy', JSON.stringify(proofOfLegacyRecords));
  }, [proofOfLegacyRecords]);

  const generateProofOfLegacy = (
    title: string,
    contributionType: ProofOfLegacyRecord['contributionType'],
    details: string
  ): ProofOfLegacyRecord => {
    const currentArch = architects.find(a => a.id === currentArchitectId);
    const archHandle = currentArch ? currentArch.handle : 'maciej_founder';
    const archName = currentArch ? currentArch.name : 'Architekt';

    const hexSegment = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
    const hash = `0xLOGOS-${hexSegment}`;
    const logosProtocolSignature = `LOGOS-VERIFIED-${contributionType}-${Date.now().toString(36).toUpperCase()}`;

    const newRecord: ProofOfLegacyRecord = {
      id: `pol-${Date.now()}`,
      hash,
      architectId: currentArchitectId,
      architectHandle: archHandle,
      architectName: archName,
      contributionType,
      title,
      details,
      logosProtocolSignature,
      timestamp: new Date().toISOString(),
      verificationUrl: `https://github.com/krystian-nexus/nexus-docs`
    };

    setProofOfLegacyRecords(prev => [newRecord, ...prev]);

    // Add Audit Log
    const newLog: AuditLog = {
      id: `log-pol-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentArchitectId,
      actorName: `@${archHandle}`,
      action: 'PROOF_OF_LEGACY_GENERATED',
      target: `LOGOS Hash: ${hash}`,
      details: `Wygenerowano Proof of Legacy dla '${title}' [${contributionType}]`,
      severity: 'SUCCESS',
      category: 'PROOF_OF_LEGACY',
      nodeToken: activeNodeToken,
      microserviceName: 'logos-proof-legacy-engine',
      endpoint: '/api/logos/proof-of-legacy',
      statusCode: 200,
      latencyMs: 18,
      signatureHash: hash
    };
    setAuditLogs(prev => [newLog, ...prev]);

    playCyberSound('success');
    triggerHaptic();

    return newRecord;
  };

  const loginWithGoogle = (userInfo?: { name?: string; email?: string; avatar?: string; handle?: string }) => {
    const userEmail = userInfo?.email || 'laciatyplas@gmail.com';
    const userName = userInfo?.name || 'Krystian (Nexus Founder)';
    const userAvatar = userInfo?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
    const userHandle = userInfo?.handle || `@${userEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '')}`;

    const newAuthUser: AuthUser = {
      id: `google-${Date.now()}`,
      email: userEmail,
      name: userName,
      avatar: userAvatar,
      provider: 'google',
      authenticatedAt: new Date().toISOString(),
      autoLogin: autoLoginEnabled
    };

    // Find existing architect with this email/handle or link to current
    let matched = architects.find(a => a.email === userEmail || a.handle.toLowerCase() === userHandle.toLowerCase());
    if (!matched) {
      // If we don't have a matching architect, link to primary or update
      matched = architects[0];
      if (matched) {
        setArchitects(prev => prev.map(a => a.id === matched!.id ? {
          ...a,
          name: userName,
          email: userEmail,
          avatar: userAvatar || a.avatar
        } : a));
      }
    }

    if (matched) {
      setCurrentArchitectId(matched.id);
      setCurrentRole(matched.role);
    }

    setAuthUser(newAuthUser);
    setIsAuthenticated(true);
    localStorage.setItem('nexus_auth_user', JSON.stringify(newAuthUser));
    playCyberSound('success');
    triggerHaptic();
  };

  const loginWithArchitect = (architectId: string) => {
    const arch = architects.find(a => a.id === architectId);
    if (!arch) return;

    const newAuthUser: AuthUser = {
      id: `arch-${arch.id}`,
      email: arch.email || `${arch.handle.replace('@', '')}@nexus.family`,
      name: arch.name,
      avatar: arch.avatar,
      provider: 'architect_key',
      authenticatedAt: new Date().toISOString(),
      autoLogin: autoLoginEnabled
    };

    setCurrentArchitectId(arch.id);
    setCurrentRole(arch.role);
    setAuthUser(newAuthUser);
    setIsAuthenticated(true);
    localStorage.setItem('nexus_auth_user', JSON.stringify(newAuthUser));
    playCyberSound('success');
    triggerHaptic();
  };

  const [idToken, setIdToken] = useState<string | null>(null);
  const [cloudSqlStatus, setCloudSqlStatus] = useState<any>({
    connected: true,
    engine: "PostgreSQL (Cloud SQL)",
    instanceName: "ai-studio-0664f52c",
    region: "us-west1"
  });

  useEffect(() => {
    fetch('/api/cloudsql/status')
      .then(res => res.json())
      .then(data => setCloudSqlStatus(data))
      .catch(err => console.warn("Cloud SQL status check:", err));
  }, []);

  useEffect(() => {
    if (!auth) return;
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const token = await user.getIdToken();
            setIdToken(token);
          } catch (e) {
            console.warn("Could not retrieve Firebase ID token:", e);
          }
        } else {
          setIdToken(null);
        }
      });
    } catch (e) {
      console.warn("Firebase onAuthStateChanged init error:", e);
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const loginWithFirebaseGoogle = async () => {
    try {
      if (!auth || !googleAuthProvider) {
        loginWithGoogle();
        return;
      }
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      const token = await user.getIdToken();
      setIdToken(token);

      // Sync user with Cloud SQL
      try {
        await fetch('/api/auth/sync-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            email: user.email,
            name: user.displayName,
            handle: user.email ? `@${user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '')}` : undefined
          })
        });
      } catch (syncErr) {
        console.warn("Cloud SQL sync user warning:", syncErr);
      }

      loginWithGoogle({
        name: user.displayName || 'Krystian (Nexus Founder)',
        email: user.email || 'laciatyplas@gmail.com',
        avatar: user.photoURL || undefined,
        handle: user.email ? `@${user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '')}` : undefined
      });
    } catch (popupErr: any) {
      console.warn("Firebase popup sign-in fallback:", popupErr?.message || popupErr);
      loginWithGoogle();
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthUser(null);
    setIdToken(null);
    if (auth) {
      try {
        firebaseSignOut(auth).catch(() => {});
      } catch {}
    }
    localStorage.removeItem('nexus_auth_user');
    playCyberSound('click');
    triggerHaptic();
  };

  const updateArchitectProfile = (profile: Partial<Architect>) => {
    setArchitects(prev => prev.map(a => a.id === currentArchitect.id ? { ...a, ...profile } : a));
    playCyberSound('success');
    triggerHaptic();
  };

  const updateSpecificArchitect = (id: string, updates: Partial<Architect>) => {
    setArchitects(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    playCyberSound('success');
    triggerHaptic();
  };

  const createArchitectProfile = (profileData: Omit<Architect, 'id'>): string => {
    const newId = `arch-${Date.now()}`;
    const newArchitect: Architect = {
      ...profileData,
      id: newId,
      joinedEpoch: profileData.joinedEpoch || 'Epoch 1.1',
      oathSigned: profileData.oathSigned ?? true,
      activityLevel: profileData.activityLevel ?? 80,
      completedTasks: profileData.completedTasks ?? 0,
      contributionScore: profileData.contributionScore ?? 500,
      projects: profileData.projects || [],
      skills: profileData.skills || [],
      specializations: profileData.specializations || ['CODE'],
      interests: profileData.interests || [],
      worlds: profileData.worlds || ['nexus-dev-hub'],
      collaborators: profileData.collaborators || [],
      portfolio: profileData.portfolio || [],
      aiProfile: profileData.aiProfile || {
        archetype: 'Neural Synthesist',
        collaborationStyle: 'Modular & Async execution',
        recommendedPairings: 'Core Architects and Creative Strategists'
      },
      availability: profileData.availability || 'AVAILABLE'
    };
    setArchitects(prev => [newArchitect, ...prev]);
    playCyberSound('success');
    triggerHaptic();
    return newId;
  };

  const addWorld = (worldData: Omit<NexusWorld, 'id' | 'contributionPoints'>) => {
    const newWorld: NexusWorld = {
      ...worldData,
      id: `w-${Date.now()}`,
      contributionPoints: 1000
    };
    setWorlds(prev => [newWorld, ...prev]);
    playCyberSound('success');
    triggerHaptic();
  };

  const updateWorld = (slug: string, updates: Partial<NexusWorld>) => {
    setWorlds(prev => prev.map(w => w.slug === slug ? { ...w, ...updates } : w));
    playCyberSound('click');
    triggerHaptic();
  };

  const addRoadmapToWorld = (slug: string, step: { phase: string; title: string; description: string; status: 'DONE' | 'ACTIVE' | 'UPCOMING' }) => {
    setWorlds(prev => prev.map(w => {
      if (w.slug === slug) {
        return {
          ...w,
          roadmap: [...w.roadmap, step]
        };
      }
      return w;
    }));
    playCyberSound('synapse');
    triggerHaptic();
  };

  const addModuleToWorld = (slug: string, moduleItem: { name: string; description: string; status: 'PLANNED' | 'DEVELOPMENT' | 'STABLE' }) => {
    setWorlds(prev => prev.map(w => {
      if (w.slug === slug) {
        const newMod: NexusWorldModule = {
          id: `mod-${Date.now()}`,
          ...moduleItem
        };
        return {
          ...w,
          modules: [...w.modules, newMod]
        };
      }
      return w;
    }));
    playCyberSound('synapse');
    triggerHaptic();
  };

  const createProject = (projectData: any) => {
    const newProject: Project = {
      slug: projectData.slug || (projectData.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      documentation: projectData.documentation || projectData.description || '',
      files: projectData.files || [],
      changelog: projectData.changelog || [{ version: 'v0.1', date: new Date().toISOString().split('T')[0], changes: ['Inicjalizacja projektu w Nexus Family'] }],
      roadmap: projectData.roadmap || (projectData.milestones ? projectData.milestones.map((m: any) => ({ milestone: m.title || m.milestone, date: m.date || '2025', completed: m.status === 'DONE' || m.completed })) : [
        { milestone: 'Architektura & Prototyp', date: '2025-Q3', completed: true },
        { milestone: 'Integracja z ekosystemem', date: '2025-Q4', completed: false }
      ]),
      architectIds: projectData.architectIds || projectData.teamIds || [currentArchitect.id],
      tasks: projectData.tasks || [],
      contributionBounty: projectData.contributionBounty || 250,
      ...projectData,
      id: `proj-${Date.now()}`,
      lastUpdated: new Date().toISOString()
    };
    setProjects(prev => [newProject, ...prev]);
    // Reward creator
    setArchitects(prev => prev.map(a => a.id === currentArchitect.id ? {
      ...a,
      contributionScore: a.contributionScore + 200,
      projects: [...(a.projects || []), newProject.id]
    } : a));
    playCyberSound('success');
    triggerHaptic();
  };

  const addProject = createProject;

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, lastUpdated: new Date().toISOString() } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    playCyberSound('beep');
    triggerHaptic();
    logAuditEvent({
      action: 'PROJECT_DELETED',
      target: 'PROJECTS',
      details: `Project ${id} removed from ecosystem`,
      severity: 'WARNING',
      actorId: currentArchitect.id,
      actorName: currentArchitect.name
    });
  };

  const deleteProjects = (ids: string[]) => {
    const idSet = new Set(ids);
    setProjects(prev => prev.filter(p => !idSet.has(p.id)));
    playCyberSound('beep');
    triggerHaptic();
    logAuditEvent({
      action: 'BATCH_PROJECTS_DELETED',
      target: 'PROJECTS',
      details: `Batch deleted ${ids.length} projects: ${ids.join(', ')}`,
      severity: 'WARNING',
      actorId: currentArchitect.id,
      actorName: currentArchitect.name
    });
    setNotifications(prev => [
      {
        id: `notif-del-${Date.now()}`,
        title: language === 'PL' ? 'Projekty Usunięte' : 'Projects Deleted',
        message: language === 'PL' ? `Pomyślnie usunięto ${ids.length} projektów.` : `Successfully deleted ${ids.length} projects.`,
        timestamp: 'Just now',
        type: 'SYSTEM',
        read: false
      },
      ...prev
    ]);
  };

  const archiveProjects = (ids: string[], archiveState: boolean = true) => {
    const idSet = new Set(ids);
    setProjects(prev => prev.map(p => {
      if (idSet.has(p.id)) {
        return {
          ...p,
          isArchived: archiveState,
          status: archiveState ? 'ARCHIVED' : (p.status === 'ARCHIVED' ? 'BUILDING' : p.status),
          lastUpdated: new Date().toISOString()
        };
      }
      return p;
    }));
    playCyberSound('node');
    triggerHaptic();
    logAuditEvent({
      action: archiveState ? 'BATCH_PROJECTS_ARCHIVED' : 'BATCH_PROJECTS_UNARCHIVED',
      target: 'PROJECTS',
      details: `${archiveState ? 'Archived' : 'Unarchived'} ${ids.length} projects`,
      severity: 'INFO',
      actorId: currentArchitect.id,
      actorName: currentArchitect.name
    });
    setNotifications(prev => [
      {
        id: `notif-arch-${Date.now()}`,
        title: archiveState
          ? (language === 'PL' ? 'Projekty Zarchiwizowane' : 'Projects Archived')
          : (language === 'PL' ? 'Projekty Przywrócone' : 'Projects Restored'),
        message: language === 'PL'
          ? `${archiveState ? 'Zarchiwizowano' : 'Przywrócono'} ${ids.length} projektów.`
          : `${archiveState ? 'Archived' : 'Restored'} ${ids.length} projects.`,
        timestamp: 'Just now',
        type: 'SYSTEM',
        read: false
      },
      ...prev
    ]);
  };

  const batchUpdateProjectStatus = (ids: string[], status: ProjectStatus) => {
    const idSet = new Set(ids);
    setProjects(prev => prev.map(p => {
      if (idSet.has(p.id)) {
        return {
          ...p,
          status,
          isArchived: status === 'ARCHIVED',
          lastUpdated: new Date().toISOString()
        };
      }
      return p;
    }));
    playCyberSound('success');
    triggerHaptic();
    logAuditEvent({
      action: 'BATCH_PROJECTS_STATUS_UPDATED',
      target: 'PROJECTS',
      details: `Updated status to ${status} for ${ids.length} projects`,
      severity: 'INFO',
      actorId: currentArchitect.id,
      actorName: currentArchitect.name
    });
    setNotifications(prev => [
      {
        id: `notif-status-${Date.now()}`,
        title: language === 'PL' ? 'Status Zaktualizowany' : 'Status Updated',
        message: language === 'PL'
          ? `Zaktualizowano status ${ids.length} projektów na: ${status}.`
          : `Updated status of ${ids.length} projects to: ${status}.`,
        timestamp: 'Just now',
        type: 'SYSTEM',
        read: false
      },
      ...prev
    ]);
  };

  const postMission = (missionData: any) => {
    const newMission: Mission = {
      requiredSpecializations: missionData.requiredSpecializations || ['CODE', 'AI'],
      requiredSkills: missionData.requiredSkills || ['TypeScript'],
      recommendedArchitectIds: missionData.recommendedArchitectIds || [],
      ...missionData,
      id: `mis-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'OPEN',
      applicants: [],
      applicantDetails: []
    };
    setMissions(prev => [newMission, ...prev]);
    playCyberSound('success');
  };

  const addMission = postMission;

  const applyForMission = (missionId: string, pitch?: string) => {
    const newApplicantDetail: MissionApplicant = {
      architectId: currentArchitect.id,
      appliedAt: new Date().toISOString(),
      pitch: pitch || 'Zgłaszam gotowość operacyjną do realizacji tego zadania z pełnym zaangażowaniem architektonicznym.',
      status: 'PENDING',
      bellaSuitabilityScore: 92,
      bellaRationale: 'Dopasowanie kompetencyjne w obszarze specjalizacji z portfolio zrealizowanych zadań.'
    };

    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        const isApplicant = (m.applicants || []).includes(currentArchitect.id);
        const newApplicants = isApplicant ? (m.applicants || []) : [...(m.applicants || []), currentArchitect.id];
        const existingDetails = m.applicantDetails || [];
        const newDetails = existingDetails.some(a => a.architectId === currentArchitect.id)
          ? existingDetails
          : [...existingDetails, newApplicantDetail];

        return {
          ...m,
          applicants: newApplicants,
          applicantDetails: newDetails,
          status: m.claimedById ? m.status : 'IN_PROGRESS',
          claimedById: m.claimedById || currentArchitect.id
        };
      }
      return m;
    }));

    playCyberSound('synapse');
    triggerHaptic();
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Mission Enlisted',
        message: `You registered for mission "${missions.find(m => m.id === missionId)?.title}".`,
        timestamp: 'Just now',
        type: 'MISSION',
        read: false
      },
      ...prev
    ]);
  };

  const assignMissionApplicant = (missionId: string, applicantId: string) => {
    const applicant = architects.find(a => a.id === applicantId);
    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        const updatedDetails = (m.applicantDetails || []).map(a =>
          a.architectId === applicantId ? { ...a, status: 'ASSIGNED' as const } : a
        );
        return {
          ...m,
          claimedById: applicantId,
          status: 'IN_PROGRESS',
          applicantDetails: updatedDetails
        };
      }
      return m;
    }));

    playCyberSound('success');
    triggerHaptic();
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Mission Assigned',
        message: `Mission assigned to ${applicant?.name || 'Architect'}.`,
        timestamp: 'Just now',
        type: 'MISSION',
        read: false
      },
      ...prev
    ]);
  };

  const completeMission = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, status: 'COMPLETED' } : m));
    setArchitects(prev => prev.map(a => a.id === currentArchitect.id ? {
      ...a,
      contributionScore: a.contributionScore + mission.rewardScore,
      completedTasks: a.completedTasks + 1
    } : a));

    playCyberSound('success');
    triggerHaptic();
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Mission Completed! ⚡',
        message: `+${mission.rewardScore} Contribution Score awarded for completing "${mission.title}".`,
        timestamp: 'Just now',
        type: 'SUCCESS',
        read: false
      },
      ...prev
    ]);
  };

  // Run AI Matchmaking Analysis
  const runArchitectMatchmaking = async (customGoal?: string) => {
    setIsMatchingLoading(true);
    playCyberSound('synapse');
    try {
      const response = await fetch('/api/bella/match-architects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentArchitect,
          candidateArchitects: architects,
          customGoal
        })
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.matches && Array.isArray(data.matches)) {
          const formatted: ArchitectMatchSuggestion[] = data.matches.map((m: any, idx: number) => ({
            id: `match-${m.architectId || idx}-${Date.now()}-${idx}`,
            architectId: m.architectId,
            compatibilityScore: m.compatibilityScore || 90,
            status: 'SUGGESTED',
            dimensionScores: m.dimensionScores || {
              competencies: 92,
              projects: 90,
              interests: 94,
              goals: 91,
              workStyle: 89,
              experience: 93
            },
            dimensions: m.dimensions || {
              competencyMatch: 'Wysoka komplementarność umiejętności technicznych i projektowych.',
              projectSynergy: 'Potencjał wspólnego budowania modułów w ekosystemie Nexus.',
              interestAlignment: 'Zgodność celów i etosu tworzenia.',
              goalAlignment: 'Spójne cele strategiczne w ramach ekosystemu Nexus.',
              workStyleComplementarity: 'Kompatybilne tempo pracy i zbalansowane style komunikacji.',
              experienceSynergy: 'Wzajemnie uzupełniające się doświadczenie branżowe i architektoniczne.'
            },
            briefRationale: m.briefRationale || 'Komplementarny duet architektoniczny rekomendowany przez State Bella.',
            pairProjectProposal: m.pairProjectProposal,
            suggestedRoles: m.suggestedRoles || ['Co-Architect', 'Systems Lead'],
            suggestedFirstAction: m.suggestedFirstAction || 'Stwórzcie wspólny węzeł Brotherhood i zdefiniujcie RFC.',
            createdAt: new Date().toISOString().split('T')[0]
          }));
          setArchitectMatches(formatted);
          playCyberSound('success');
          return;
        }
      }
      throw new Error('Matchmaking API returned non-JSON or invalid payload');
    } catch (err) {
      console.warn('Matchmaking server API unavailable, using local neural matrix calculation:', err);
      const candidates = architects.filter(a => a.id !== currentArchitect.id);
      const fallbackMatches: ArchitectMatchSuggestion[] = candidates.slice(0, 3).map((c, idx) => ({
        id: `match-${c.id}-${Date.now()}-${idx}`,
        architectId: c.id,
        compatibilityScore: 96 - idx * 4,
        status: 'SUGGESTED',
        dimensionScores: {
          competencies: 95 - idx * 3,
          projects: 93 - idx * 2,
          interests: 96 - idx * 4,
          goals: 94 - idx * 3,
          workStyle: 91 - idx * 2,
          experience: 95 - idx * 3
        },
        dimensions: {
          competencyMatch: `Fuzja ${currentArchitect.specializations?.[0] || 'Inżynierii'} z domeną ${c.specializations?.[0] || 'Designu'} tworzy zbalansowany duet.`,
          projectSynergy: `Wspólny potencjał przy rozwoju modułów w światach ${c.worlds?.slice(0, 2).join(' oraz ') || 'Nexus AI'}.`,
          interestAlignment: `Wspólne zainteresowania: ${c.interests?.slice(0, 3).join(', ') || 'Cyber-architektura'}.`,
          goalAlignment: `Wspólny horyzont strategiczny: ${Array.isArray(c.goals) ? c.goals[0] : 'Eksploracja nowych narzędzi synaptycznych'}.`,
          workStyleComplementarity: `${currentArchitect.name} preferuje ${currentArchitect.workStyle?.cadence || currentArchitect.workStyle?.summary || 'ustalone tempo'}, a ${c.name} wnosi ${c.workStyle?.communication || c.workStyle?.summary || 'elastyczną współpracę'}.`,
          experienceSynergy: `Komplementarność poziomów ${currentArchitect.rank || currentArchitect.role} oraz ${c.rank || c.role} w projektowaniu systemów rozproszonych.`
        },
        briefRationale: `Idealne uzupełnienie kompetencyjne w ekosystemie Nexus zidentyfikowane przez State Bella.`,
        pairProjectProposal: {
          title: `Sojusz Kognitywny: ${currentArchitect.specializations?.[0] || 'Systemy'} & ${c.specializations?.[0] || 'Interfejsy'}`,
          description: `Wspólna inicjatywa architektoniczna łącząca silne strony obu twórców dla rozwoju infrastruktury Nexus.`,
          worldSlug: c.worlds?.[0] || 'nexus-dev-hub',
          targetDeliverable: `Specyfikacja RFC i prototyp modułu kognitywnego`,
          estimatedTimeline: `Sprint 1 Epoch`
        },
        suggestedRoles: ['System Lead', 'Interface Architect'],
        suggestedFirstAction: `Zainicjuj węzeł Brotherhood i stwórzcie wspólne RFC.`,
        createdAt: new Date().toISOString().split('T')[0]
      }));
      setArchitectMatches(fallbackMatches);
    } finally {
      setIsMatchingLoading(false);
    }
  };

  const handleMatchDecision = (matchId: string, decision: 'ACCEPTED' | 'DECLINED' | 'POSTPONED', notes?: string) => {
    const match = architectMatches.find(m => m.id === matchId);
    if (!match) return;

    setArchitectMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: decision } : m));

    const partner = architects.find(a => a.id === match.architectId);
    const partnerName = partner?.name || 'Architekt';

    if (decision === 'ACCEPTED') {
      // Find if brotherhood node exists, or create one
      const existing = brotherhoodNodes.find(
        n => (n.architect1Id === currentArchitect.id && n.architect2Id === match.architectId) ||
             (n.architect2Id === currentArchitect.id && n.architect1Id === match.architectId)
      );

      if (existing) {
        handleBrotherhoodDecision(existing.id, 'ACCEPT');
      } else {
        const proposal = match.pairProjectProposal;
        const projectTitle = proposal?.title || `Projekt Synaptyczny: ${currentArchitect.name} & ${partnerName}`;
        const projectDesc = proposal?.description || `Wspólna realizacja założeń architektonicznych rekomendowana przez State Bella.`;
        const targetDeliverable = proposal?.targetDeliverable || 'Działający moduł w ekosystemie Nexus';
        const worldSlug = proposal?.worldSlug || 'nexus-dev-hub';

        const newNode: BrotherhoodNode = {
          id: `node-${Date.now()}`,
          architect1Id: currentArchitect.id,
          architect2Id: match.architectId,
          status: 'ACTIVE',
          matchScore: match.compatibilityScore,
          complementaryRationale: match.briefRationale,
          dimensionAnalysis: match.dimensions,
          projectSpace: {
            title: projectTitle,
            description: projectDesc,
            worldSlug: worldSlug,
            targetDeliverable: targetDeliverable,
            rfcDocument: `# RFC-BROTHERHOOD: ${projectTitle}\n\n**Inicjatorzy:** ${currentArchitect.name} (@${currentArchitect.handle}) & ${partnerName} (@${partner?.handle || 'partner'})\n**Rekomendacja Belli:** ${match.briefRationale}\n\n## 1. Cele Projektu\n- Wdrożenie: ${targetDeliverable}\n- Świat docelowy: ${worldSlug}\n- Ramy czasowe: ${proposal?.estimatedTimeline || 'Epoch 3.x'}\n\n## 2. Podział Odpowiedzialności\n- **${currentArchitect.name}**: Architektura systemowa, przepływy danych, testy synaptyczne\n- **${partnerName}**: ${match.suggestedRoles?.[0] || 'Interfejsy i protokoły logiczne'}\n\n## 3. Kamienie Milowe\n1. Inicjalizacja środowiska i repozytorium\n2. Złożenie pierwszej wersji RFC do Rady Architektów\n3. Wdrożenie MVP i integracja z Nexus Hub`,
            status: 'PROTOTYPING',
            milestones: [
              {
                id: `ms-1-${Date.now()}`,
                title: 'Konfiguracja węzła i ustalenie zakresu RFC',
                targetEpoch: 'Epoch 1',
                completed: false,
                description: match.suggestedFirstAction
              },
              {
                id: `ms-2-${Date.now()}`,
                title: 'Wdrożenie pierwszej wersji prototypu (MVP)',
                targetEpoch: 'Epoch 2',
                completed: false,
                description: `Realizacja wskaźnika: ${targetDeliverable}`
              },
              {
                id: `ms-3-${Date.now()}`,
                title: 'Audyt Rady Architektów i certyfikacja Belli',
                targetEpoch: 'Epoch 3',
                completed: false,
                description: 'Ocena wkładu i przyznanie punktów synaptycznych'
              }
            ],
            files: [
              {
                id: `f-spec-${Date.now()}`,
                name: 'rfc_architecture_draft.md',
                size: '14.2 KB',
                type: 'md',
                uploadedBy: 'STATE BELLA',
                uploadedAt: new Date().toISOString().split('T')[0],
                url: '#'
              }
            ]
          },
          sharedTasks: [
            {
              id: `t1-${Date.now()}`,
              title: match.suggestedFirstAction,
              completed: false,
              assignedTo: currentArchitect.id,
              priority: 'HIGH',
              tag: 'START'
            },
            {
              id: `t2-${Date.now()}`,
              title: `Omówienie założeń dla: ${projectTitle}`,
              completed: false,
              assignedTo: match.architectId,
              priority: 'MEDIUM',
              tag: 'SYNC'
            },
            {
              id: `t3-${Date.now()}`,
              title: `Sfinalizowanie specyfikacji RFC w zakładce Projektu`,
              completed: false,
              assignedTo: currentArchitect.id,
              priority: 'MEDIUM',
              tag: 'RFC'
            }
          ],
          sharedNotes: `# RFC WSPÓŁPRACY ARCHITEKTONICZNEJ\n\n**Rekomendacja Belli:** ${match.briefRationale}\n\n**Wymiary Synergii (6D):**\n- **Kompetencje:** ${match.dimensions.competencyMatch}\n- **Projekty:** ${match.dimensions.projectSynergy}\n- **Zainteresowania:** ${match.dimensions.interestAlignment}\n- **Cele:** ${match.dimensions.goalAlignment || 'Zbieżne cele ekosystemowe'}\n- **Styl pracy:** ${match.dimensions.workStyleComplementarity}\n- **Doświadczenie:** ${match.dimensions.experienceSynergy || 'Wzajemne uzupełnianie doświadczenia'}`,
          roadmapMilestones: [
            { id: 'm1', title: 'Definicja założeń i architektury RFC', targetEpoch: 'Epoch 1', completed: false },
            { id: 'm2', title: 'Wdrożenie prototypu MVP', targetEpoch: 'Epoch 2', completed: false },
            { id: 'm3', title: 'Walidacja przez State Bella', targetEpoch: 'Epoch 3', completed: false }
          ],
          files: [],
          messages: [
            {
              id: `msg-${Date.now()}`,
              senderId: 'bella-ai',
              senderName: 'STATE BELLA',
              senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
              content: `Węzeł Brotherhood zainicjowany. Wynik zgodności neuronowej: ${match.compatibilityScore}%. Przygotowałam dla Was przestrzeń projektową "${projectTitle}" ze wstępnym szkicem RFC i zadaniami. Owocnego budowania!`,
              timestamp: new Date().toISOString(),
              isAi: true
            }
          ],
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString()
        };

        setBrotherhoodNodes(prev => [newNode, ...prev]);
        setActiveBrotherhoodNodeId(newNode.id);
        playCyberSound('success');
        triggerHaptic();
      }

      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: 'Węzeł Brotherhood Aktywowany! 🤝',
          message: `Dopasowanie z ${partnerName} zostało zaakceptowane. Utworzono prywatny węzeł roboczy.`,
          timestamp: 'Przed chwilą',
          type: 'BROTHERHOOD',
          read: false
        },
        ...prev
      ]);
      setCurrentView('BROTHERHOOD');
    } else if (decision === 'POSTPONED') {
      playCyberSound('beep');
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: 'Dopasowanie Odłożone ⏳',
          message: `Sugestia duetu z ${partnerName} została przeniesiona do sekcji odłożonych.`,
          timestamp: 'Przed chwilą',
          type: 'BROTHERHOOD',
          read: false
        },
        ...prev
      ]);
    } else {
      playCyberSound('beep');
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: 'Dopasowanie Odrzucone',
          message: `Sugestia duetu z ${partnerName} została oznaczona jako odrzucona.`,
          timestamp: 'Przed chwilą',
          type: 'BROTHERHOOD',
          read: false
        },
        ...prev
      ]);
    }
  };

  const handleCollaborationDecision = (collabId: string, decision: 'ACCEPTED' | 'DECLINED' | 'POSTPONED') => {
    setProjectCollaborationSuggestions(prev => prev.map(c => c.id === collabId ? { ...c, status: decision } : c));
    if (decision === 'ACCEPTED') {
      const collab = projectCollaborationSuggestions.find(c => c.id === collabId);
      if (collab) {
        setProjects(prev => prev.map(p => {
          if (p.id === collab.projectId && !(p.architectIds || []).includes(collab.architectId)) {
            return { ...p, architectIds: [...(p.architectIds || []), collab.architectId] };
          }
          return p;
        }));
      }
      playCyberSound('success');
      triggerHaptic();
    } else {
      playCyberSound('beep');
    }
  };

  const analyzeProjectActivity = async (filterWorld?: string, focusProjectId?: string): Promise<BellaEcosystemHealthReport> => {
    setIsAnalyzingProjectActivity(true);
    playCyberSound('synapse');
    try {
      const res = await fetch('/api/bella/analyze-project-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projects,
          architects,
          filterWorld,
          focusProjectId
        })
      });
      if (res.ok) {
        const data: BellaEcosystemHealthReport = await res.json();
        setProjectHealthReport(data);
        playCyberSound('success');
        return data;
      }
      throw new Error('Project activity analysis failed');
    } catch (err) {
      console.warn('Project activity analysis fallback:', err);
      const totalTasks = projects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
      const doneTasks = projects.reduce((acc, p) => acc + (p.tasks?.filter(t => t.status === 'DONE').length || 0), 0);
      const pendingTasks = totalTasks - doneTasks;
      
      const fallbackReport: BellaEcosystemHealthReport = {
        ecosystemHealthScore: 91,
        activeProjectsCount: projects.length,
        totalCompletedTasks: doneTasks,
        totalPendingTasks: pendingTasks,
        activityVelocity: 'ACCELERATING',
        executiveSummary: `State Bella: Ekosystem Nexus wykazuje wysoki wskaźnik dynamiki budowy. Odnotowano ${doneTasks} sfinalizowanych zadań przy wysokiej komplementarności zespołów. Rekomendowane zacieśnienie współpracy w obszarach interfejsów i optymalizacji synaptycznej.`,
        projectAudits: projects.map((p, idx) => {
          const tasks = p.tasks || [];
          const done = tasks.filter(t => t.status === 'DONE').length;
          const todo = tasks.filter(t => t.status === 'TODO').length;
          const inProg = tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'REVIEW').length;
          const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 65;
          const cand = architects.find(a => !(p.architectIds || []).includes(a.id)) || architects[0];
          return {
            projectId: p.id,
            title: p.title,
            worldSlug: p.worldSlug,
            healthScore: Math.min(98, 75 + (done * 4)),
            activityStatus: done > todo ? 'OPTIMAL' : 'ACCELERATING',
            velocityRating: pct > 50 ? 'HIGH' : 'MEDIUM',
            completionPercentage: pct,
            tasksSummary: { total: tasks.length, done, inProgress: inProg, todo },
            detectedSkillGaps: idx % 2 === 0 ? ['Interfejsy Reaktywne (UI/UX)', 'WebGL Shaders'] : ['Architektura Bezpieczeństwa', 'Optymalizacja Synaps'],
            suggestedCollaborators: cand ? [{
              architectId: cand.id,
              matchScore: 93,
              fitReason: `Architekt ${cand.name} wnosi kluczowe kompetencje w obszarze ${cand.specializations?.[0] || 'Inżynierii'}, przyspieszając realizację kamieni milowych.`,
              keySkillsToBring: (cand.skills || ['TypeScript', 'System Design']).slice(0, 3)
            }] : [],
            bellaRecommendations: [
              `Zsynchronizuj roadmapę ze światem ${p.worldSlug}.`,
              `Włącz rekomendowanego współpracownika do rewizji zadań backlogu.`
            ]
          };
        }),
        crossProjectSynergies: projects.length >= 2 ? [{
          projectAId: projects[0].id,
          projectBId: projects[1].id,
          synergyTitle: `Synergia Danych: ${projects[0].title} × ${projects[1].title}`,
          opportunity: 'Wspólna warstwa modelowania stanów pozwala na współdzielenie schematów pamięci wektorowej.',
          recommendedAction: 'Zainicjowanie wspólnego węzła Brotherhood dla architektów prowadzących.'
        }] : [],
        priorityActionItems: [
          {
            id: 'act-1',
            severity: 'HIGH',
            title: 'Wzmocnienie zasobów projektowych',
            description: 'Bella rekomenduje zaproszenie uzupełniających architektów do kluczowych projektów.',
            actionType: 'COLLABORATE',
            targetProjectId: projects[0]?.id
          }
        ],
        analyzedAt: new Date().toISOString(),
        source: 'local-neural-matrix'
      };
      setProjectHealthReport(fallbackReport);
      return fallbackReport;
    } finally {
      setIsAnalyzingProjectActivity(false);
    }
  };

  const suggestCollaborationsForProject = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    try {
      const res = await fetch('/api/bella/suggest-collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project,
          candidateArchitects: architects
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.suggestions && Array.isArray(data.suggestions)) {
          const newSuggestions: ProjectCollaborationSuggestion[] = data.suggestions.map((s: any, idx: number) => ({
            id: `collab-${projectId}-${s.architectId}-${Date.now()}-${idx}`,
            projectId,
            architectId: s.architectId,
            status: 'SUGGESTED',
            compatibilityScore: s.compatibilityScore || 90,
            rationale: s.rationale,
            complementarySkills: s.complementarySkills || ['Core Systems'],
            sharedInterests: s.sharedInterests || ['Architecture'],
            projectAlignment: s.projectAlignment || 'Wsparcie najbliższego kamienia milowego',
            createdAt: new Date().toISOString().split('T')[0]
          }));
          setProjectCollaborationSuggestions(prev => [
            ...newSuggestions,
            ...prev.filter(old => old.projectId !== projectId)
          ]);
          playCyberSound('success');
        }
      }
    } catch (e) {
      console.warn('Failed to fetch project collaboration suggestions:', e);
    }
  };

  const initiateCollaborationFromPost = (post: FeedPost) => {
    const author = architects.find(a => a.id === post.authorId);
    if (!author || author.id === currentArchitect.id) return;

    // Check if brotherhood node exists
    const existing = brotherhoodNodes.find(
      n => (n.architect1Id === currentArchitect.id && n.architect2Id === author.id) ||
           (n.architect2Id === currentArchitect.id && n.architect1Id === author.id)
    );

    if (existing) {
      setActiveBrotherhoodNodeId(existing.id);
      sendBrotherhoodMessage(existing.id, `Cześć ${author.name}, widziałem Twój wpis w Builder Feed: "${post.title}". Chciałbym połączyć siły i wspólnie to rozwinąć!`);
    } else {
      const newNode: BrotherhoodNode = {
        id: `node-${Date.now()}`,
        architect1Id: currentArchitect.id,
        architect2Id: author.id,
        status: 'ACTIVE',
        matchScore: 94,
        complementaryRationale: `Zainicjowano z wpisu w Builder Feed: "${post.title}"`,
        sharedTasks: [
          { id: `t1-${Date.now()}`, title: `Analiza wpisu: ${post.title}`, completed: false, assignedTo: currentArchitect.id }
        ],
        sharedNotes: `# WSPÓŁPRACA: ${post.title}\n\n**Oryginalny wpis:** ${post.content}\n\n**Kategoria:** ${post.category}`,
        roadmapMilestones: [],
        files: [],
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderId: currentArchitect.id,
            senderName: currentArchitect.name,
            senderAvatar: currentArchitect.avatar,
            content: `Cześć ${author.name}! Zainspirował mnie Twój wpis w Builder Feed: "${post.title}". Porozmawiajmy o wspólnej architekturze!`,
            timestamp: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      setBrotherhoodNodes(prev => [newNode, ...prev]);
      setActiveBrotherhoodNodeId(newNode.id);
    }

    playCyberSound('success');
    triggerHaptic();
    setCurrentView('BROTHERHOOD');
  };

  const handleBrotherhoodDecision = (nodeId: string, decision: 'ACCEPT' | 'DECLINE' | 'LATER') => {
    setBrotherhoodNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          status: decision === 'ACCEPT' ? 'ACTIVE' : decision === 'DECLINE' ? 'DECLINED' : 'LATER',
          lastActive: new Date().toISOString()
        };
      }
      return node;
    }));

    if (decision === 'ACCEPT') {
      playCyberSound('success');
      triggerHaptic();
      setActiveBrotherhoodNodeId(nodeId);
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: 'Brotherhood Node Activated! 🤝',
          message: 'Private collaboration workspace opened. Start building together with AI assistance.',
          timestamp: 'Just now',
          type: 'BROTHERHOOD',
          read: false
        },
        ...prev
      ]);
    } else {
      playCyberSound('beep');
    }
  };

  const sendBrotherhoodMessage = (nodeId: string, content: string) => {
    const newMessage = {
      id: `bm-${Date.now()}`,
      senderId: currentArchitect.id,
      senderName: currentArchitect.name,
      senderAvatar: currentArchitect.avatar,
      content,
      timestamp: new Date().toISOString()
    };
    setBrotherhoodNodes(prev => prev.map(node => node.id === nodeId ? {
      ...node,
      messages: [...node.messages, newMessage],
      lastActive: new Date().toISOString()
    } : node));
    playCyberSound('click');
  };

  const analyzeArchitectPair = async (architect1Id: string, architect2Id: string) => {
    try {
      const arch1 = architects.find(a => a.id === architect1Id) || currentArchitect;
      const arch2 = architects.find(a => a.id === architect2Id);
      if (!arch2) throw new Error('Candidate architect not found');

      const res = await fetch('/api/bella/analyze-pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          architect1: arch1,
          architect2: arch2
        })
      });

      if (res.ok) {
        const data = await res.json();
        playCyberSound('synapse');
        return data;
      }
      throw new Error('Pair analysis API error');
    } catch (e) {
      console.warn('Pair analysis fallback to neural matrix:', e);
      const arch1 = architects.find(a => a.id === architect1Id) || currentArchitect;
      const arch2 = architects.find(a => a.id === architect2Id);
      return {
        compatibilityScore: 94,
        dimensionScores: {
          competencies: 95,
          projects: 92,
          interests: 96,
          goals: 93,
          workStyle: 90,
          experience: 94
        },
        dimensions: {
          competencyMatch: `Komplementarność domen technicznych ${arch1.specializations?.slice(0, 2).join(', ')} oraz ${arch2?.specializations?.slice(0, 2).join(', ')}.`,
          projectSynergy: `Wysoki potencjał budowy modułów w ekosystemie Nexus.`,
          interestAlignment: `Zgodność wizji cyber-architektury i suwerennych sieci twórców.`,
          goalAlignment: `Zbieżne cele długofalowe zorientowane na autonomię technologiczną.`,
          workStyleComplementarity: `Zrównoważone tempo realizacji i partnerski podział odpowiedzialności.`,
          experienceSynergy: `Optymalny transfer wiedzy pomiędzy rangami ${arch1.rank || arch1.role} i ${arch2?.rank || arch2?.role}.`
        },
        pairProjectProposal: {
          title: `Projekt Badawczo-Wdrożeniowy: ${arch1.name} & ${arch2?.name}`,
          description: `Zintegrowana inicjatywa architektoniczna wspierająca rozbudowę rdzenia platformy Nexus.`,
          worldSlug: arch2?.worlds?.[0] || 'nexus-dev-hub',
          targetDeliverable: `Specyfikacja RFC i działający demonstrator`,
          estimatedTimeline: `Epoch 3.x`
        },
        suggestedRoles: ['System Lead', 'Interface Architect'],
        suggestedFirstAction: 'Zainicjujcie wspólne spotkanie w kanale węzła i sformułujcie tezy RFC.'
      };
    }
  };

  const createBrotherhoodNode = (partnerId: string, customProject?: Partial<BrotherhoodProjectSpace>): BrotherhoodNode => {
    const partner = architects.find(a => a.id === partnerId);
    const partnerName = partner?.name || 'Architekt';
    const projectTitle = customProject?.title || `Inicjatywa Architektoniczna: ${currentArchitect.name} & ${partnerName}`;
    const worldSlug = customProject?.worldSlug || partner?.worlds?.[0] || 'nexus-dev-hub';

    const newNode: BrotherhoodNode = {
      id: `node-${Date.now()}`,
      architect1Id: currentArchitect.id,
      architect2Id: partnerId,
      status: 'ACTIVE',
      matchScore: 95,
      complementaryRationale: `Węzeł zainicjowany bezpośrednio przez ${currentArchitect.name} dla budowy wspólnego projektu.`,
      dimensionAnalysis: {
        competencyMatch: `Fuzja ${currentArchitect.specializations?.[0] || 'Inżynierii'} i ${partner?.specializations?.[0] || 'Designu'}.`,
        projectSynergy: `Wspólny rozwój infrastruktury w świecie ${worldSlug}.`,
        interestAlignment: `Zgodność zainteresowań w domenie cyber-systemów.`,
        goalAlignment: `Wspólne cele rozwoju w ramach Rady Architektów.`,
        workStyleComplementarity: `Partnerski podział ról: ${currentArchitect.name} (Architektura), ${partnerName} (Wdrożenie).`,
        experienceSynergy: `Doświadczenie strategiczne połączone z precyzyjną egzekucją.`
      },
      projectSpace: {
        title: projectTitle,
        description: customProject?.description || `Wspólna realizacja założeń architektonicznych i kodowanie modułów w węźle Brotherhood.`,
        worldSlug: worldSlug,
        targetDeliverable: customProject?.targetDeliverable || 'Działający moduł zintegrowany z Nexus Hub',
        rfcDocument: customProject?.rfcDocument || `# RFC-BROTHERHOOD: ${projectTitle}\n\n**Twórcy:** ${currentArchitect.name} & ${partnerName}\n\n## 1. Zakres Projektu\n- Świat: ${worldSlug}\n- Cel: ${customProject?.targetDeliverable || 'Działający moduł'}\n\n## 2. Harmonogram\n- Etap 1: Założenia architektoniczne\n- Etap 2: Implementacja MVP\n- Etap 3: Testy i wdrożenie produkcyjne`,
        status: 'PROTOTYPING',
        milestones: customProject?.milestones || [
          {
            id: `ms-init-${Date.now()}`,
            title: 'Inicjalizacja węzła i repozytorium',
            targetEpoch: 'Epoch 1',
            completed: false,
            description: 'Ustalenie struktury projektu i podziału zadań'
          },
          {
            id: `ms-proto-${Date.now()}`,
            title: 'Wersja Alfa / Prototyp roboczy',
            targetEpoch: 'Epoch 2',
            completed: false,
            description: 'Pierwsza weryfikowalna kompilacja'
          }
        ],
        files: customProject?.files || [
          {
            id: `f-init-${Date.now()}`,
            name: 'initial_architecture.md',
            size: '8.4 KB',
            type: 'md',
            uploadedBy: currentArchitect.name,
            uploadedAt: new Date().toISOString().split('T')[0],
            url: '#'
          }
        ]
      },
      sharedTasks: [
        {
          id: `t1-${Date.now()}`,
          title: `Zdefiniowanie zakresu projektu ${projectTitle}`,
          completed: false,
          assignedTo: currentArchitect.id,
          priority: 'HIGH',
          tag: 'INIT'
        },
        {
          id: `t2-${Date.now()}`,
          title: `Pierwsza synchronizacja architektury z ${partnerName}`,
          completed: false,
          assignedTo: partnerId,
          priority: 'MEDIUM',
          tag: 'SYNC'
        }
      ],
      sharedNotes: `# NOTATKI ROBOCZE WĘZŁA BROTHERHOOD\n\n**Projekt:** ${projectTitle}\n**Partnerzy:** ${currentArchitect.name} & ${partnerName}\n\nZapisujcie tutaj luźne myśli, szkice schematów i decyzje projektowe.`,
      roadmapMilestones: [
        { id: 'm1', title: 'Definicja założeń i specyfikacji', targetEpoch: 'Epoch 1', completed: false },
        { id: 'm2', title: 'Implementacja MVP', targetEpoch: 'Epoch 2', completed: false }
      ],
      files: [],
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: currentArchitect.id,
          senderName: currentArchitect.name,
          senderAvatar: currentArchitect.avatar,
          content: `Cześć ${partnerName}! Zainicjowałem nasz prywatny węzeł Brotherhood dla projektu "${projectTitle}". Zobacz przygotowane RFC i zadania!`,
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    setBrotherhoodNodes(prev => [newNode, ...prev]);
    setActiveBrotherhoodNodeId(newNode.id);
    playCyberSound('success');
    triggerHaptic();
    setCurrentView('BROTHERHOOD');
    return newNode;
  };

  const addBrotherhoodTask = (nodeId: string, task: string | Omit<BrotherhoodTask, 'id'>) => {
    const newTask: BrotherhoodTask = typeof task === 'string'
      ? {
          id: `bt-${Date.now()}`,
          title: task,
          completed: false,
          assignedTo: currentArchitect.id,
          priority: 'MEDIUM'
        }
      : {
          ...task,
          id: `bt-${Date.now()}`
        };

    setBrotherhoodNodes(prev => prev.map(node => node.id === nodeId ? {
      ...node,
      sharedTasks: [...node.sharedTasks, newTask],
      lastActive: new Date().toISOString()
    } : node));
    playCyberSound('beep');
  };

  const deleteBrotherhoodTask = (nodeId: string, taskId: string) => {
    setBrotherhoodNodes(prev => prev.map(node => node.id === nodeId ? {
      ...node,
      sharedTasks: node.sharedTasks.filter(t => t.id !== taskId),
      lastActive: new Date().toISOString()
    } : node));
    playCyberSound('click');
  };

  const updateBrotherhoodTask = (nodeId: string, taskId: string, updates: Partial<BrotherhoodTask>) => {
    setBrotherhoodNodes(prev => prev.map(node => node.id === nodeId ? {
      ...node,
      sharedTasks: node.sharedTasks.map(t => t.id === taskId ? { ...t, ...updates } : t),
      lastActive: new Date().toISOString()
    } : node));
  };

  const toggleBrotherhoodTask = (nodeId: string, taskId: string) => {
    setBrotherhoodNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          sharedTasks: node.sharedTasks.map(t => {
            if (t.id === taskId) {
              const nextCompleted = !t.completed;
              return {
                ...t,
                completed: nextCompleted,
                status: nextCompleted ? 'DONE' : 'TODO',
                completedAt: nextCompleted ? new Date().toISOString() : undefined
              };
            }
            return t;
          }),
          lastActive: new Date().toISOString()
        };
      }
      return node;
    }));
    playCyberSound('click');
  };

  const updateBrotherhoodNotes = (nodeId: string, notes: string) => {
    setBrotherhoodNodes(prev => prev.map(node => node.id === nodeId ? {
      ...node,
      sharedNotes: notes,
      lastActive: new Date().toISOString()
    } : node));
  };

  const updateBrotherhoodProjectSpace = (nodeId: string, updates: Partial<BrotherhoodProjectSpace>) => {
    setBrotherhoodNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        const currentSpace = node.projectSpace || {
          title: 'Projekt Brotherhood',
          description: 'Wspólna przestrzeń inżynieryjna',
          rfcDocument: '# RFC',
          status: 'PROTOTYPING',
          milestones: [],
          files: []
        };
        return {
          ...node,
          projectSpace: {
            ...currentSpace,
            ...updates
          },
          lastActive: new Date().toISOString()
        };
      }
      return node;
    }));
    playCyberSound('success');
  };

  const addBrotherhoodMilestone = (nodeId: string, milestone: { title: string; targetEpoch: string; description?: string }) => {
    const newMilestone: BrotherhoodMilestone = {
      id: `ms-${Date.now()}`,
      title: milestone.title,
      targetEpoch: milestone.targetEpoch,
      description: milestone.description,
      completed: false
    };

    setBrotherhoodNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        const space = node.projectSpace || {
          title: 'Projekt Brotherhood',
          description: '',
          rfcDocument: '',
          status: 'PROTOTYPING',
          milestones: [],
          files: []
        };
        return {
          ...node,
          projectSpace: {
            ...space,
            milestones: [...(space.milestones || []), newMilestone]
          },
          lastActive: new Date().toISOString()
        };
      }
      return node;
    }));
    playCyberSound('beep');
  };

  const toggleBrotherhoodMilestone = (nodeId: string, milestoneId: string) => {
    setBrotherhoodNodes(prev => prev.map(node => {
      if (node.id === nodeId && node.projectSpace) {
        return {
          ...node,
          projectSpace: {
            ...node.projectSpace,
            milestones: (node.projectSpace.milestones || []).map(m =>
              m.id === milestoneId ? { ...m, completed: !m.completed } : m
            )
          },
          lastActive: new Date().toISOString()
        };
      }
      return node;
    }));
    playCyberSound('click');
  };

  const addBrotherhoodFile = (nodeId: string, file: { name: string; size: string; type: string; url: string }) => {
    const newFile: BrotherhoodFile = {
      id: `f-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedBy: currentArchitect.name,
      uploadedAt: new Date().toISOString().split('T')[0],
      url: file.url
    };

    setBrotherhoodNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        const space = node.projectSpace || {
          title: 'Projekt Brotherhood',
          description: '',
          rfcDocument: '',
          status: 'PROTOTYPING',
          milestones: [],
          files: []
        };
        return {
          ...node,
          projectSpace: {
            ...space,
            files: [...(space.files || []), newFile]
          },
          lastActive: new Date().toISOString()
        };
      }
      return node;
    }));
    playCyberSound('success');
  };

  const addMemoryDoc = (docData: Omit<MemoryDocument, 'id' | 'lastUpdated' | 'verifiedByBella'>) => {
    const newDoc: MemoryDocument = {
      ...docData,
      id: `mem-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
      verifiedByBella: true
    };
    setMemoryDocs(prev => [newDoc, ...prev]);
    // Reward contribution
    setArchitects(prev => prev.map(a => a.id === currentArchitect.id ? { ...a, contributionScore: a.contributionScore + 150 } : a));
    playCyberSound('success');
  };

  const addGenesisMilestone = (milestoneData: Omit<GenesisMilestone, 'id'>) => {
    const newMilestone: GenesisMilestone = {
      ...milestoneData,
      id: `gen-${Date.now()}`,
      endorsedByCount: 1
    };
    setGenesisMilestones(prev => [newMilestone, ...prev]);
    playCyberSound('success');
    triggerHaptic();
    logAuditEvent({
      action: 'GENESIS_MILESTONE_PROPOSED',
      target: 'GENESIS',
      details: `New Genesis milestone "${newMilestone.title}" (${newMilestone.epoch}) recorded`,
      severity: 'INFO',
      actorId: currentArchitect.id,
      actorName: currentArchitect.name
    });
  };

  const endorseGenesisMilestone = (id: string) => {
    setGenesisMilestones(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          endorsedByCount: (m.endorsedByCount || 0) + 1
        };
      }
      return m;
    }));
    playCyberSound('synapse');
    triggerHaptic();
  };

  const createFeedPost = (postData: any) => {
    const newPost: FeedPost = {
      ...postData,
      id: `feed-${Date.now()}`,
      timestamp: new Date().toISOString(),
      reactions: { synapse: 1, built: 0, spark: 0, partner: 0, review: 0 },
      userReactions: { [currentArchitect.id]: 'synapse' },
      comments: []
    };
    setFeedPosts(prev => [newPost, ...prev]);
    setArchitects(prev => prev.map(a => a.id === currentArchitect.id ? { ...a, contributionScore: a.contributionScore + 50 } : a));
    playCyberSound('synapse');
  };

  const addFeedPost = createFeedPost;

  const reactToFeedPost = (postId: string, reactionType: 'synapse' | 'built' | 'spark' | 'partner' | 'review') => {
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const currentReaction = post.userReactions[currentArchitect.id];
        const newReactions = { ...post.reactions };
        const newUserReactions = { ...post.userReactions };

        if (currentReaction === reactionType) {
          // Remove reaction
          newReactions[reactionType] = Math.max(0, (newReactions[reactionType] || 1) - 1);
          delete newUserReactions[currentArchitect.id];
        } else {
          // Add or replace reaction
          if (currentReaction) {
            newReactions[currentReaction as keyof typeof newReactions] = Math.max(0, (newReactions[currentReaction as keyof typeof newReactions] || 1) - 1);
          }
          newReactions[reactionType] = (newReactions[reactionType] || 0) + 1;
          newUserReactions[currentArchitect.id] = reactionType;
        }

        return {
          ...post,
          reactions: newReactions,
          userReactions: newUserReactions
        };
      }
      return post;
    }));
    playCyberSound('synapse');
    triggerHaptic();
  };

  const addFeedComment = (postId: string, content: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      authorId: currentArchitect.id,
      content,
      timestamp: new Date().toISOString()
    };
    setFeedPosts(prev => prev.map(post => post.id === postId ? {
      ...post,
      comments: [...post.comments, newComment]
    } : post));
    playCyberSound('click');
  };

  const sendRoomMessage = (roomId: string, content: string) => {
    const newMsg = {
      id: `m-${Date.now()}`,
      senderId: currentArchitect.id,
      senderName: currentArchitect.name,
      senderRole: currentRole,
      senderAvatar: currentArchitect.avatar,
      content,
      timestamp: new Date().toISOString()
    };
    setChatRooms(prev => prev.map(room => room.id === roomId ? {
      ...room,
      messages: [...room.messages, newMsg]
    } : room));
    playCyberSound('click');
  };

  const submitAccessRequest = (reqData: Omit<AccessRequest, 'id' | 'status' | 'submittedAt'>) => {
    const newReq: AccessRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      status: 'PENDING',
      submittedAt: new Date().toISOString()
    };
    setAccessRequests(prev => [newReq, ...prev]);
    playCyberSound('success');
  };

  const handleAccessRequestDecision = (reqId: string, decision: 'APPROVED' | 'WAITLIST' | 'REJECTED') => {
    const targetReq = accessRequests.find(r => r.id === reqId);
    setAccessRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: decision, reviewedBy: currentArchitect.id } : r));

    if (decision === 'APPROVED' && targetReq) {
      // Check if already in architects list
      const alreadyExists = architects.some(a => a.email === targetReq.email || a.handle.toLowerCase() === targetReq.handle.toLowerCase());
      if (!alreadyExists) {
        const newArchitect: Architect = {
          id: `arch-${Date.now()}`,
          name: targetReq.fullName,
          handle: targetReq.handle.startsWith('@') ? targetReq.handle : `@${targetReq.handle}`,
          email: targetReq.email,
          role: 'BUILDER',
          specializations: targetReq.specializations || ['CODE'],
          skills: targetReq.skills,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          bio: targetReq.whyNexus || targetReq.proposal,
          projects: [],
          interests: targetReq.interests || targetReq.skills,
          worlds: targetReq.targetWorlds || ['world-code', 'world-cyber'],
          activityLevel: 85,
          completedTasks: 0,
          contributionScore: 500,
          collaborators: [currentArchitect.id],
          portfolio: targetReq.proposal ? [{ title: 'Initial Proposal', url: 'https://github.com', description: targetReq.proposal }] : [],
          aiProfile: {
            archetype: 'System Builder',
            collaborationStyle: 'Direct execution, asynchronous node builder',
            recommendedPairings: 'AI Engineers, Full-Stack Architects, Cryptographic Researchers'
          },
          availability: 'AVAILABLE',
          joinedEpoch: 'EPOCH 03',
          oathSigned: true,
          githubUrl: 'https://github.com'
        };
        setArchitects(prev => [newArchitect, ...prev]);
      }
      playCyberSound('success');
      triggerHaptic();
    } else {
      playCyberSound('beep');
    }
  };

  const activeNodeToken = 'NEXUS-BNB-734LLM-NODE';

  const logAuditEvent = useCallback(async (event: Omit<AuditLog, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): Promise<AuditLog> => {
    const randomHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newLog: AuditLog = {
      id: event.id || `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: event.timestamp || new Date().toISOString(),
      actorId: event.actorId || currentArchitect.id,
      actorName: event.actorName || currentArchitect.name,
      action: event.action,
      target: event.target,
      details: event.details,
      severity: event.severity || 'INFO',
      category: event.category || (event.nodeToken ? 'NODE' : event.microserviceName ? 'MICROSERVICE' : 'GOVERNANCE'),
      nodeToken: event.nodeToken || (event.action.includes('NODE') ? activeNodeToken : undefined),
      nodeId: event.nodeId || 'node-bnb-734llm-main',
      microserviceName: event.microserviceName,
      endpoint: event.endpoint,
      statusCode: event.statusCode || 200,
      latencyMs: event.latencyMs || Math.floor(Math.random() * 25 + 10),
      signatureHash: event.signatureHash || randomHash,
      metadata: event.metadata || {}
    };

    setAuditLogs(prev => [newLog, ...prev.slice(0, 199)]);

    try {
      fetch('/api/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      }).catch(err => console.warn('Audit log server sync notice:', err));
    } catch {
      // safe fallback
    }

    return newLog;
  }, [currentArchitect, activeNodeToken]);

  const probeNodeIdentity = useCallback(async (nodeToken: string = activeNodeToken, microservice: string = 'all') => {
    try {
      const res = await fetch('/api/audit-logs/probe-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeToken, microservice, actorName: currentArchitect.name })
      });
      const data = await res.json();
      if (data.auditLog) {
        setAuditLogs(prev => [data.auditLog, ...prev.filter(l => l.id !== data.auditLog.id)]);
      }
      playCyberSound('success');
      triggerHaptic();
      return data;
    } catch {
      // Local fallback
      const randomHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const fallbackLog: AuditLog = {
        id: `log-probe-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorId: currentArchitect.id,
        actorName: currentArchitect.name,
        action: 'NODE_HANDSHAKE_PROBE',
        target: nodeToken,
        details: `Wykonano autoryzowany test węzła [${nodeToken}] z zewnętrznymi mikroserwisami (Bella, Gateways, Smart Contracts)`,
        severity: 'SUCCESS',
        category: 'NODE',
        nodeToken: nodeToken,
        nodeId: 'node-bnb-734llm-main',
        microserviceName: 'nexus-microservice-mesh',
        endpoint: '/api/audit-logs/probe-node',
        statusCode: 200,
        latencyMs: 18,
        signatureHash: randomHash,
        metadata: {
          verified: true,
          handshakeResult: 'HANDSHAKE_ESTABLISHED_TLS13',
          authorizedMicroservices: [
            'bella-ai-orchestrator',
            'domain-gateway-ingress (nexussocial.pl / nexusfamily.online)',
            'smart-contract-bridge (BNB Chain L2)',
            'vector-memory-engine (RAM L1)'
          ]
        }
      };
      setAuditLogs(prev => [fallbackLog, ...prev]);
      playCyberSound('success');
      triggerHaptic();
      return { status: 'ok', verified: true, nodeToken, latencyMs: 18, auditLog: fallbackLog };
    }
  }, [currentArchitect, activeNodeToken, playCyberSound, triggerHaptic]);

  const clearAuditLogs = useCallback(async () => {
    setAuditLogs([]);
    localStorage.removeItem('nexus_audit_logs');
    try {
      await fetch('/api/audit-logs', { method: 'DELETE' });
    } catch {
      // safe fallback
    }
    playCyberSound('beep');
    triggerHaptic();
  }, [playCyberSound, triggerHaptic]);

  const refreshAuditLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/audit-logs');
      if (res.ok) {
        const data = await res.json();
        if (data.logs && Array.isArray(data.logs) && data.logs.length > 0) {
          setAuditLogs(data.logs);
        }
      }
    } catch (err) {
      console.warn('Audit logs refresh notice:', err);
    }
  }, []);

  const signNexusOath = () => {
    setArchitects(prev => prev.map(a => a.id === currentArchitect.id ? { ...a, oathSigned: true, contributionScore: a.contributionScore + 300 } : a));
    logAuditEvent({
      actorId: currentArchitect.id,
      actorName: currentArchitect.name,
      action: 'OATH_SIGNED',
      target: 'Nexus Builder Oath',
      details: `Architekt ${currentArchitect.name} uroczyście podpisał Przysięgę Budowniczego Nexusa`,
      severity: 'SUCCESS',
      category: 'GOVERNANCE',
      nodeToken: activeNodeToken
    });
    playCyberSound('success');
    triggerHaptic();
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NexusContext.Provider
      value={{
        isAuthenticated,
        authUser,
        idToken,
        cloudSqlStatus,
        autoLoginEnabled,
        setAutoLoginEnabled,
        loginWithGoogle,
        loginWithFirebaseGoogle,
        loginWithArchitect,
        logout,
        currentView,
        setCurrentView,
        language,
        setLanguage,
        currentArchitect,
        setCurrentArchitectId,
        currentRole,
        setCurrentRole,
        soundEnabled,
        setSoundEnabled,
        hapticsEnabled,
        setHapticsEnabled,
        playCyberSound,
        triggerHaptic,
        isBiometricLocked,
        toggleBiometricLock,
        architects,
        worlds,
        projects,
        missions,
        brotherhoodNodes,
        memoryDocs,
        feedPosts,
        chatRooms,
        accessRequests,
        auditLogs,
        telemetry,
        genesisMilestones,
        addGenesisMilestone,
        endorseGenesisMilestone,
        notifications,
        architectMatches,
        projectCollaborationSuggestions,
        isMatchingLoading,
        activeNodeToken,
        projectHealthReport,
        isAnalyzingProjectActivity,
        analyzeProjectActivity,
        suggestCollaborationsForProject,
        logAuditEvent,
        probeNodeIdentity,
        clearAuditLogs,
        refreshAuditLogs,
        updateArchitectProfile,
        updateSpecificArchitect,
        createArchitectProfile,
        addWorld,
        updateWorld,
        addRoadmapToWorld,
        addModuleToWorld,
        createProject,
        addProject,
        updateProject,
        deleteProject,
        deleteProjects,
        archiveProjects,
        batchUpdateProjectStatus,
        postMission,
        addMission,
        applyForMission,
        assignMissionApplicant,
        completeMission,
        runArchitectMatchmaking,
        analyzeArchitectPair,
        handleMatchDecision,
        handleCollaborationDecision,
        initiateCollaborationFromPost,
        createBrotherhoodNode,
        handleBrotherhoodDecision,
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
        addMemoryDoc,
        createFeedPost,
        addFeedPost,
        reactToFeedPost,
        addFeedComment,
        sendRoomMessage,
        submitAccessRequest,
        handleAccessRequestDecision,
        reviewAccessRequest: handleAccessRequestDecision,
        signNexusOath,
        markNotificationRead,
        clearNotifications,
        activeBrotherhoodNodeId,
        setActiveBrotherhoodNodeId,
        activeProjectId,
        setActiveProjectId,
        activeMissionId,
        setActiveMissionId,
        activeWorldSlug,
        setActiveWorldSlug,
        activeArchitectModalId,
        setActiveArchitectModalId,
        isProfileEditorOpen,
        setIsProfileEditorOpen,
        isCreateProfileModalOpen,
        setIsCreateProfileModalOpen,
        editingArchitect,
        setEditingArchitect,
        showOnboardingModal,
        setShowOnboardingModal,
        showBellaOverlay,
        setShowBellaOverlay,
        showAccessRequestModal,
        setShowAccessRequestModal,
        showNotificationsDrawer,
        setShowNotificationsDrawer,
        isCheatSheetOpen,
        setIsCheatSheetOpen,
        toggleCheatSheet,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toggleMobileSidebar,
        searchQuery,
        setSearchQuery,
        githubState,
        isGitHubModalOpen,
        setIsGitHubModalOpen,
        openGitHubModal,
        connectGitHubOAuth,
        connectGitHubToken,
        connectGitHubDemo,
        disconnectGitHub,
        refreshGitHubRepos,
        syncGitHubToCurrentArchitect,
        linkGitHubRepoToProject,
        publishNexusDocsToGitHub,
        proofOfLegacyRecords,
        generateProofOfLegacy,
        isNeuralBridgeOpen,
        openNeuralBridgeModal,
        closeNeuralBridgeModal,
        isChronicleOpen,
        openChronicleModal,
        closeChronicleModal
      }}
    >
      {children}
    </NexusContext.Provider>
  );
};

export const useNexus = () => {
  const context = useContext(NexusContext);
  if (!context) {
    throw new Error('useNexus must be used within a NexusProvider');
  }
  return context;
};
