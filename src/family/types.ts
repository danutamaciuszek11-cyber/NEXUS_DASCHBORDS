export type UserRole = 'FOUNDER' | 'NEXUS ADMIN' | 'ARCHITECT' | 'BUILDER' | 'MENTOR' | 'AI' | 'GUEST';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  provider: 'google' | 'architect_key' | 'guest';
  authenticatedAt: string;
  autoLogin: boolean;
}

export type Specialization = 
  | 'CODE'
  | 'AI'
  | 'DESIGN'
  | 'WRITING'
  | 'MUSIC'
  | 'VIDEO'
  | 'WEB3'
  | 'COMMUNITY'
  | 'MARKETING'
  | 'RESEARCH'
  | 'ENGINEERING'
  | 'ARCHITECTURE'
  | 'INFRASTRUCTURE'
  | 'PHILOSOPHY'
  | 'EDUCATION'
  | 'SECURITY'
  | 'FINANCE'
  | 'CREATIVE'
  | 'OTHER';

export type MemoryCategory = 'PROTOCOL' | 'ARCHITECTURE' | 'VISION' | 'RFC' | 'GUIDE' | 'LORE';

export type ProjectStatus = 'IDEA' | 'PROTOTYPE' | 'BUILDING' | 'BETA' | 'LIVE' | 'PAUSED' | 'ARCHIVED';

export type MissionDifficulty = 'INITIATE' | 'ADEPT' | 'ARCHITECT' | 'MASTERMIND';

export type FeedCategory = 
  | 'UPDATE'
  | 'IDEA'
  | 'PROJECT'
  | 'QUESTION'
  | 'DISCOVERY'
  | 'RELEASE'
  | 'HELP'
  | 'ART'
  | 'CODE'
  | 'RESEARCH';

export type RoomType = 'PUBLIC FAMILY' | 'WORLD ROOMS' | 'PROJECT ROOMS' | 'BROTHERHOOD ROOMS' | 'PRIVATE ROOMS';

export interface PortfolioItem {
  title: string;
  url: string;
  description: string;
  tags?: string[];
}

export interface AIProfileEntry {
  id: string;
  name: string;
  model: string;
  role: string;
  resonance: number;
  systemPrompt?: string;
}

export interface Architect {
  id: string;
  handle: string; // Pseudonym / handle (@handle)
  pseudonym?: string; // Optional custom display alias
  name: string;
  avatar: string;
  bio: string;
  role: UserRole;
  specializations: Specialization[];
  skills: string[];
  projects: string[]; // Project IDs
  interests: string[];
  worlds: string[]; // World slugs
  activityLevel: number; // 0 - 100
  completedTasks: number;
  contributionScore: number;
  collaborators: string[]; // Architect IDs
  portfolio: PortfolioItem[];
  aiProfile: {
    archetype: string;
    collaborationStyle: string;
    recommendedPairings: string;
    model?: string;
    resonance?: number;
  };
  aiProfiles?: AIProfileEntry[];
  availability: 'AVAILABLE' | 'BUILDING' | 'DEEP_FOCUS' | 'OFFLINE';
  brotherhoodPartnerId?: string;
  goals?: string[];
  workStyle?: {
    cadence?: string;
    communication?: string;
    focus?: string;
    velocity?: string;
    autonomy?: string;
    summary?: string;
  };
  experience?: {
    level?: 'INITIATE' | 'ADEPT' | 'SENIOR_BUILDER' | 'MASTER_ARCHITECT' | 'COUNCIL_ELDER';
    yearsInTech?: number;
    epochsActive?: number;
    signatureAccomplishment?: string;
    background?: string;
  };
  joinedEpoch: string;
  oathSigned: boolean;
  rank?: string;
  email?: string;
  githubUrl?: string;
  xHandle?: string;
}

export interface DimensionBreakdown {
  score: number; // 0 - 100
  title: string;
  details: string;
  keyHighlights: string[];
}

export interface ArchitectMatchSuggestion {
  id: string;
  architectId: string;
  compatibilityScore: number; // 0 - 100
  status: 'SUGGESTED' | 'ACCEPTED' | 'DECLINED' | 'POSTPONED';
  declineReason?: string;
  postponeNotes?: string;
  dimensions: {
    competencyMatch: string;
    projectSynergy: string;
    interestAlignment: string;
    workStyleComplementarity: string;
    goalAlignment?: string;
    experienceSynergy?: string;
    goalsSynergy?: string;
    experienceBalance?: string;
    [key: string]: string | undefined;
  };
  dimensionScores?: {
    competencies: number;
    projects: number;
    interests: number;
    goals: number;
    workStyle: number;
    experience: number;
  };
  briefRationale: string;
  suggestedRoles: string[];
  suggestedFirstAction: string;
  pairProjectProposal?: {
    title: string;
    worldSlug?: string;
    description: string;
    deliverables?: string[];
    targetDeliverable?: string;
    estimatedTimeline?: string;
  };
  createdNodeId?: string;
  createdAt: string;
}

export interface ProjectCollaborationSuggestion {
  id: string;
  projectId: string;
  architectId: string;
  status: 'SUGGESTED' | 'ACCEPTED' | 'DECLINED' | 'POSTPONED';
  compatibilityScore: number;
  rationale: string;
  complementarySkills: string[];
  sharedInterests: string[];
  projectAlignment: string;
  createdAt: string;
}

export interface BrotherhoodTask {
  id: string;
  title: string;
  description?: string;
  assignedTo?: string; // architectId or 'JOINT'
  completed: boolean;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate?: string;
  priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  tag?: string;
  completedAt?: string;
}

export interface BrotherhoodMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isAi?: boolean;
}

export interface BrotherhoodMilestone {
  id: string;
  title: string;
  targetEpoch: string;
  completed: boolean;
  description?: string;
}

export interface BrotherhoodFile {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  uploadedBy: string;
  timestamp?: string;
  uploadedAt?: string;
}

export interface BrotherhoodProjectSpace {
  id?: string;
  title: string;
  tagline?: string;
  description: string;
  worldSlug?: string;
  targetDeliverable?: string;
  rfcDocument: string;
  repositoryUrl?: string;
  githubRepo?: string;
  githubBranch?: string;
  githubSyncStatus?: 'CONNECTED' | 'SYNCED' | 'NOT_LINKED';
  linkedProjectId?: string;
  status: 'INCEPTION' | 'PROTOTYPING' | 'REFINING' | 'DEPLOYED';
  milestones: BrotherhoodMilestone[];
  files: BrotherhoodFile[];
}

export interface BrotherhoodNode {
  id: string;
  architect1Id: string;
  architect2Id: string;
  status: 'SUGGESTED' | 'ACTIVE' | 'DECLINED' | 'LATER';
  matchScore: number; // 0 - 100
  complementaryRationale: string;
  dimensionAnalysis?: {
    competencyMatch?: string;
    projectSynergy?: string;
    interestAlignment?: string;
    goalAlignment?: string;
    workStyleComplementarity?: string;
    experienceSynergy?: string;
    [key: string]: string | undefined;
  };
  sharedTasks: BrotherhoodTask[];
  sharedNotes: string;
  roadmapMilestones: { id: string; title: string; targetEpoch: string; completed: boolean }[];
  files: { name: string; size: string; type: string; url: string }[];
  messages: BrotherhoodMessage[];
  projectSpace?: BrotherhoodProjectSpace;
  createdAt: string;
  lastActive: string;
}

export interface NexusWorldModule {
  id: string;
  name: string;
  description: string;
  status: 'PLANNED' | 'DEVELOPMENT' | 'STABLE';
}

export interface NexusWorld {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  colorAccent: string;
  leadArchitectIds: string[];
  memberIds: string[];
  projectIds: string[];
  modules: NexusWorldModule[];
  roadmap: { phase: string; title: string; description: string; status: 'DONE' | 'ACTIVE' | 'UPCOMING' }[];
  documentationUrl?: string;
  status: 'OPERATIONAL' | 'INCUBATING' | 'SCALING';
  contributionPoints: number;
}

export interface ProjectTask {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  assigneeId?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  worldSlug: string;
  ownerId: string;
  architectIds: string[];
  status: ProjectStatus;
  roadmap: { milestone: string; date: string; completed: boolean }[];
  tasks: ProjectTask[];
  documentation: string;
  files: { name: string; size: string; type: string }[];
  changelog: { version: string; date: string; changes: string[] }[];
  contributionBounty: number;
  lastUpdated: string;
  isArchived?: boolean;
  aiCouncilScore?: number;
  repoUrl?: string;
  resonanceVelocity?: number; // Velocity Metric (0 - 100%)
  velocityTier?: 'ALPHA_ACCELERATOR' | 'HIGH_RESONANCE' | 'STEADY_FLOW';
  isEterniverseCore?: boolean; // Core vs Supporting project
}

export interface MissionApplicant {
  architectId: string;
  appliedAt: string;
  pitch: string;
  status: 'PENDING' | 'ASSIGNED' | 'REJECTED';
  bellaSuitabilityScore?: number;
  bellaRationale?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  worldSlug: string;
  projectId?: string;
  requiredSpecializations: Specialization[];
  requiredSkills: string[];
  difficulty: MissionDifficulty;
  deadline: string;
  rewardScore: number;
  applicants: string[]; // Architect IDs
  applicantDetails?: MissionApplicant[];
  claimedById?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  createdBy: string;
  recommendedArchitectIds: string[];
  createdAt: string;
}

export interface MemoryDocument {
  id: string;
  title: string;
  category: 'PROTOCOL' | 'ARCHITECTURE' | 'VISION' | 'RFC' | 'GUIDE' | 'LORE';
  authorId: string;
  worldSlug?: string;
  tags: string[];
  summary: string;
  content: string;
  lastUpdated: string;
  version: string;
  verifiedByBella: boolean;
}

export interface FeedComment {
  id: string;
  authorId: string;
  content: string;
  timestamp: string;
}

export interface FeedPost {
  id: string;
  authorId: string;
  category: FeedCategory;
  title: string;
  content: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  tags?: string[];
  worldSlug?: string;
  projectSlug?: string;
  timestamp: string;
  reactions: {
    synapse: number; // ⚡
    built: number;   // 🛠️
    spark: number;   // 💡
    partner: number; // 🤝
    review?: number; // 🔍
  };
  userReactions: { [userId: string]: string };
  comments: FeedComment[];
}

export interface AICouncilReview {
  id: string;
  projectTitle: string;
  timestamp: string;
  architect: string;
  engineer: string;
  designer: string;
  researcher: string;
  security: string;
  strategist: string;
  creative: string;
  nexusSynthesis: string;
  actionSteps: string[];
  readinessScore: number;
}

export interface RoomMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  content: string;
  timestamp: string;
  pinned?: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  slug: string;
  type: RoomType;
  worldSlug?: string;
  projectId?: string;
  brotherhoodId?: string;
  description: string;
  participants: string[];
  pinnedKnowledge: string[];
  messages: RoomMessage[];
}

export interface AccessRequest {
  id: string;
  fullName: string;
  handle: string;
  email: string;
  specializations: Specialization[];
  skills: string[];
  interests: string[];
  targetWorlds: string[];
  proposal: string;
  whyNexus: string;
  status: 'PENDING' | 'APPROVED' | 'WAITLIST' | 'REJECTED';
  submittedAt: string;
  reviewedBy?: string;
}

export type AuditCategory = 'NODE' | 'MICROSERVICE' | 'AI_AGENT' | 'GOVERNANCE' | 'SECURITY' | 'STORAGE' | 'PROOF_OF_LEGACY';

export interface ProofOfLegacyRecord {
  id: string;
  hash: string; // Cryptographic SHA-256 signature hash (0xLOGOS-...)
  architectId: string;
  architectHandle: string;
  architectName: string;
  contributionType: 'RFC_DOC' | 'CODE_COMMIT' | 'MILESTONE' | 'DECISION' | 'EVALUATION' | 'LORE';
  title: string;
  details: string;
  logosProtocolSignature: string;
  timestamp: string;
  hospiceEntryId?: string;
  verificationUrl?: string;
  checkpointVersion?: string; // e.g. "NEXUS v0.3"
  eternionEchoImpact?: string; // Lore narrative from @tomasz_wolski
}

export interface SingularityCheckpoint {
  id: string;
  nexusVersion: string; // "NEXUS v0.1", "NEXUS v0.2", "NEXUS v0.3-SINGULARITY"
  logosHash: string;
  title: string;
  createdTime: string;
  activeAgentsCount: number;
  systemResonanceScore: number; // 0 - 100%
  eternionEchoNarrative: string; // Tomasz Wolski (@tomasz_wolski) Lore description
  systemStateSnapshot: {
    projectsCount: number;
    openMissionsCount: number;
    brotherhoodStability: number;
    activeRules: string[];
  };
}

export interface PredictiveConflictResult {
  riskScore: number; // 0 - 100%
  safeZoneStatus: 'SAFE_ZONE_AUTONOMOUS' | 'SAFE_ZONE_REQUIRES_EVALUATION' | 'CRITICAL_RISK_SHIELD_BLOCK';
  detectedContradictions: string[];
  vulcanShieldRecommendation: string;
  suggestedMitigationCode: string;
}

export interface BinaryWorldLogicNode {
  id: string;
  name: string;
  type: 'RULE' | 'ENTITY' | 'SYNAPSE' | 'GOVERNANCE';
  binaryState: '1' | '0' | 'RESONANT';
  lawDescription: string;
  connectedNodes: string[];
}
export type AuditSeverity = 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL' | 'SECURITY';

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  action: string;
  target: string;
  details: string;
  severity: AuditSeverity;
  category?: AuditCategory;
  nodeToken?: string;
  nodeId?: string;
  microserviceName?: string;
  endpoint?: string;
  statusCode?: number;
  latencyMs?: number;
  signatureHash?: string;
  metadata?: Record<string, any>;
}

export interface GenesisMilestone {
  id?: string;
  epoch: string;
  date: string;
  title: string;
  subtitle?: string;
  description: string;
  longNarrative?: string;
  category: 'CORE' | 'WORLD' | 'AI' | 'COMMUNITY' | 'PROJECT' | 'ARCHITECT' | 'GOVERNANCE';
  architectsInvolved: string[];
  projectIds?: string[];
  worldSlug?: string;
  memoryDocId?: string;
  icon: string;
  impactScore?: number;
  significanceTag?: string;
  keyDeliverables?: string[];
  quote?: {
    text: string;
    author: string;
  };
  nodeCoordinates?: { x: number; y: number };
  endorsedByCount?: number;
}

export interface SystemTelemetry {
  activeArchitects: number;
  synapticFlashesPerMin: number;
  totalProjects: number;
  completedMissions: number;
  brotherhoodNodes: number;
  memoryIndexSize: string;
  coreHealth: number; // 0 - 100%
  networkThroughput: string;
}

export interface BellaReasoningStep {
  id: string;
  stage: 'INTENT' | 'MEMORY_SCAN' | 'SKILL_MATCH' | 'GOVERNANCE_CHECK' | 'SYNTHESIS';
  label: string;
  thought: string;
  latencyMs: number;
  confidence: number;
  status: 'pending' | 'active' | 'completed';
}

export interface BellaReasoningTrace {
  steps: BellaReasoningStep[];
  totalLatencyMs: number;
  tokensPerSec: number;
  model: string;
  verdictConfidence: number;
  gatewayHost: string;
}

export interface DomainGatewayInfo {
  domain: string;
  isRegistered: boolean; // nexussocial.pl and nexusfamily.online are actively purchased/registered (1-year active license)
  registrationPeriod?: string; // e.g., '1 ROK (AKTYWNA)'
  domainRole?: 'PRIMARY_PROD_INGRESS' | 'GLOBAL_FAMILY_CANOPY' | 'WORLD_SUBPATH_GATEWAY';
  status: 'ACTIVE_PROD' | 'RESERVED_ROUTING' | 'PLANNED';
  dnsStatus: 'VERIFIED' | 'ROUTING_SUBPATH' | 'PENDING';
  sslStatus: 'ACTIVE_TLS_1_3' | 'INHERITED_GATEWAY' | 'UNCONFIGURED';
  worldSlug: string;
  worldName: string;
  canonicalUrl: string;
  gatewayRoute: string;
  primaryOwner: string;
  monthlyBandwidth: string;
  latencyAvg: string;
  features: string[];
}

export interface DomainProbeResult {
  domain: string;
  timestamp: string;
  httpStatus: number;
  responseTimeMs: number;
  dnsResolvedIp: string;
  tlsVersion: string;
  isLive: boolean;
  activeNodes: number;
  isRegistered?: boolean;
  registrationPeriod?: string;
  ingressMode?: string;
}

export interface SemanticCluster {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  colorAccent: string;
  centroidKeywords: string[];
  docIds: string[];
  vectorCoordinates: { x: number; y: number; z: number };
  avgRelevance: number;
}

export interface SemanticMemoryMatch {
  doc: MemoryDocument;
  cluster: SemanticCluster;
  similarityScore: number; // 0 - 100
  matchedKeywords: string[];
  cacheTier: 'L1_HOT_RAM' | 'L2_VECTOR_CENTROID' | 'COLD_INDEX';
  retrievalLatencyMs: number;
  relevanceSnippet: string;
}

export interface MemoryCacheTelemetry {
  l1HitCount: number;
  l2HitCount: number;
  missCount: number;
  hitRatioPercent: number;
  avgRetrievalLatencyMs: number;
  cachedVectorEntries: number;
  memoryFootprintKb: number;
  lastPrewarmedAt: string;
  status: 'OPTIMAL_WARM' | 'INDEXING' | 'COLD';
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  public_gists?: number;
  followers: number;
  following: number;
  created_at: string;
  email?: string | null;
  company?: string | null;
  location?: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
}

export interface GitHubIntegrationState {
  isConnected: boolean;
  user: GitHubUser | null;
  repos: GitHubRepo[];
  lastSyncedAt?: string;
  isLoading: boolean;
  error?: string | null;
  authMode?: 'OAUTH' | 'TOKEN' | 'DEMO';
}

export interface ProjectActivityAudit {
  projectId: string;
  title: string;
  worldSlug: string;
  healthScore: number;
  activityStatus: 'OPTIMAL' | 'NEEDS_ATTENTION' | 'STALLED' | 'ACCELERATING';
  velocityRating: 'HIGH' | 'MEDIUM' | 'LOW';
  completionPercentage: number;
  tasksSummary: { total: number; done: number; inProgress: number; todo: number };
  detectedSkillGaps: string[];
  suggestedCollaborators: {
    architectId: string;
    matchScore: number;
    fitReason: string;
    keySkillsToBring: string[];
  }[];
  bellaRecommendations: string[];
  bottleneckNotice?: string;
}

export interface CrossProjectSynergy {
  projectAId: string;
  projectBId: string;
  synergyTitle: string;
  opportunity: string;
  recommendedAction: string;
}

export interface BellaOrchestratorRecommendation {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  title: string;
  description: string;
  actionType: 'COLLABORATE' | 'MISSION' | 'BROTHERHOOD' | 'SYNC';
  targetProjectId?: string;
  targetArchitectId?: string;
}

export interface BellaEcosystemHealthReport {
  ecosystemHealthScore: number;
  activeProjectsCount: number;
  totalCompletedTasks: number;
  totalPendingTasks: number;
  activityVelocity: 'HIGH' | 'MODERATE' | 'ACCELERATING';
  projectAudits: ProjectActivityAudit[];
  crossProjectSynergies: CrossProjectSynergy[];
  executiveSummary: string;
  priorityActionItems: BellaOrchestratorRecommendation[];
  analyzedAt: string;
  source?: string;
}

