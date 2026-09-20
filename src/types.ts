// NEXUS OS TypeScript System Types

export type BellasRole = 'Marco (Architekt)' | 'Elena (Inżynier Światła)' | 'Leo (Strażnik Mostów)' | 'Sofia (Kuratorka)';

export interface BellasMember {
  id: string;
  name: string;
  role: BellasRole;
  aura: 'emerald' | 'cyan' | 'amber' | 'rose';
  status: 'ACTIVE' | 'CONTEMPLATION' | 'SYNCED';
  signature: string;
  lastPulse: string;
}

export interface SynapseNodeStatus {
  nodeId: string;
  name: string;
  protocol: 'gRPC' | 'REST' | 'NXL-NATIVE';
  status: 'OPERATIONAL' | 'SYNCED' | 'HEAVY_LOAD' | 'FAILOVER';
  loadPercent: number;
  throughputRps: number;
  latencyMs: number;
  lastHeartbeat: string;
}

export interface ClusterInstance {
  id: string;
  name: string;
  type: 'Quantum CI/CD' | 'Synapse Mesh' | 'Agent Sandbox';
  status: 'STABLE' | 'OPERATIONAL' | 'SYNCED' | 'WARNING';
  instancesCount: number;
  commitCount: number;
  xpPoints: number;
  guardian: string;
  loadPercent: number;
  throughputRps: number;
  latencyMs: number;
  version: string;
  nodes?: SynapseNodeStatus[];
}

export interface NexusSessionSnapshot {
  timestamp: string;
  savedAtFormatted: string;
  xpPoints: number;
  role?: string;
  telemetry: {
    quantumCiCd: ClusterInstance;
    synapseMesh: ClusterInstance;
    agentSandbox: ClusterInstance;
    ledgerEntries: NxlLedgerEntry[];
  };
}

export interface NxlToken {
  type: string;
  value: string;
  line: number;
  column: number;
}

export interface NxlAstNode {
  type: string;
  [key: string]: any;
}

export interface NxlDiagnostic {
  level: 'ERROR' | 'WARNING' | 'INFO';
  message: string;
  line?: number;
  column?: number;
  hint?: string;
}

export interface NxlTruthReport {
  assertion: string;
  result: boolean;
  evidence: string;
  timestamp: string;
  runtimeVersion: string;
}

export interface NxlLedgerEntry {
  version: number;
  target: string;
  previousValue: any;
  newValue: any;
  valueType: string;
  timestamp: string;
  reason: string;
}

export interface NxlExecutionPlan {
  id: string;
  intent: string;
  authority: string;
  capability: string;
  truthStatus: 'PASS' | 'FAIL';
  capabilityStatus: 'GRANTED' | 'DENIED';
  status: 'PENDING' | 'AUTHORIZED' | 'DISPATCHED' | 'REJECTED';
  targetAdapter: string;
  timestamp: string;
}

export interface ZipAnalysisFileEntry {
  name: string;
  size: number;
  compressedSize: number;
  isNxlFile: boolean;
  isProtected: boolean;
  action: 'ALLOWED' | 'BLOCKED_IMMUTABLE_NXL' | 'ISOLATED';
  checksum?: string;
}

export interface ZipAnalysisReport {
  id: string;
  sourceUrl?: string;
  fileName?: string;
  totalFiles: number;
  totalSize: number;
  threatsIntercepted: number;
  status: 'CLEAN' | 'THREATS_BLOCKED' | 'FAILED';
  files: ZipAnalysisFileEntry[];
  timestamp: string;
  nxlSecurityCheck: 'PASS_IMMUTABLE_PROTECTED' | 'FAIL';
}

export interface EventPulse {
  id: string;
  event: string;
  data: any;
  timestamp: string;
  nodeSource?: string;
}

export type ClusterType = 'Synapse Mesh' | 'Quantum CI/CD' | 'Agent Sandbox' | 'System Kernel';
export type LogLevel = 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' | 'TRACE';

export interface ClusterLogEntry {
  id: string;
  timestamp: string;
  cluster: ClusterType;
  nodeId?: string;
  level: LogLevel;
  stage?: string;
  message: string;
  details?: Record<string, any>;
  durationMs?: number;
}


// NEXUSBOOK TYPES
export type SeekerId = 
  | 'InterSeeker'
  | 'BioSeeker'
  | 'EterSeeker'
  | 'TabuSeeker'
  | 'ChronoSeeker'
  | 'MirrorSeeker'
  | 'SpiritSeeker'
  | 'ObfitoSeeker'
  | 'Operator001';

export type Language = 'PL' | 'EN' | 'DE' | 'FR';

export type Category = 
  | 'Fantasy' 
  | 'Psychologia' 
  | 'AI' 
  | 'Filozofia' 
  | 'Manifest' 
  | 'Science Fiction' 
  | 'Biografia'
  | 'Metafizyka'
  | 'Cyberbezpieczeństwo';

export type BookStatus = 'Published' | 'In Progress' | 'Classified Draft';

export interface Chapter {
  id: string;
  number: number;
  title: string;
  summary?: string;
  content: string;
  readTimeMin: number;
  illustrationAssetId?: string;
  illustrationUrl?: string;
  illustrationCaption?: string;
}

export interface QuoteItem {
  id: string;
  text: string;
  chapterTitle?: string;
  tags?: string[];
}

export interface PlatformLinks {
  amazon?: string;
  wattpad?: string;
  pinterest?: string;
  substack?: string;
  github?: string;
  orcid?: string;
  pdfUrl?: string;
  audioUrl?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  caption: string;
  svgGradient: [string, string];
  patternType: 'grid' | 'circles' | 'cyber' | 'waves' | 'dots';
}

export interface WorkCoverVersion {
  versionId: string;
  assetId?: string;
  url: string;
  thumbnailUrl?: string;
  filename?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  createdAt: string;
  isCurrent: boolean;
  notes?: string;
}

export type PublicationState = 'DRAFT' | 'SAVED' | 'PUBLISHED' | 'ARCHIVED';

export interface WorkManifest {
  manifestVersion: string;
  workId: string;
  title: string;
  subtitle?: string;
  author: string;
  tagline?: string;
  shortDescription: string;
  longDescription: string;
  editorialNote?: string;
  category: string;
  genre: string;
  language: Language;
  series?: string;
  volume?: number | string;
  year: number;
  tags: string[];
  keywords: string[];
  status: BookStatus;
  publicationState: PublicationState;
  coverUrl?: string;
  coverAssetId?: string;
  coverVersions?: WorkCoverVersion[];
  publishedAt?: string;
  lastEditedAt?: string;
  isbn?: string;
  distributionChannels?: ('NEXUSBOOK' | 'NEXUSSOCIAL' | 'NEXUS_MEDIA' | 'PDF' | 'EPUB' | 'AMAZON_KDP')[];
}

export interface WorkEditorialVersion {
  versionNumber: string; // e.g. "v1.0", "v1.1", "v2.0"
  workId: string;
  versionId: string;
  title: string;
  status: BookStatus;
  publicationState: PublicationState;
  changedBy: string;
  changedAt: string;
  changesSummary: string;
  coverVersion?: string;
  manifestVersion?: string;
  contentVersion?: string;
  snapshot: Partial<Book>;
}

export type WorkAuditAction = 
  | 'WORK_CREATED'
  | 'WORK_UPDATED'
  | 'COVER_ADDED'
  | 'COVER_CHANGED'
  | 'COVER_REMOVED'
  | 'COVER_RESTORED'
  | 'MANIFEST_UPDATED'
  | 'DESCRIPTION_UPDATED'
  | 'METADATA_UPDATED'
  | 'CHAPTER_ADDED'
  | 'CHAPTER_UPDATED'
  | 'CHAPTER_REMOVED'
  | 'CHAPTERS_REORDERED'
  | 'VERSION_CREATED'
  | 'VERSION_PUBLISHED'
  | 'VERSION_RESTORED';

export interface WorkAuditRecord {
  id: string;
  workId: string;
  timestamp: string;
  action: WorkAuditAction;
  userId: string;
  details?: string;
  previousValue?: any;
  newValue?: any;
  versionId?: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author?: string;
  series?: string;
  volume?: number | string;
  genre?: string;
  tagline?: string;
  editorialNote?: string;
  seeker: SeekerId;
  seekerColor: string; // HEX or Tailwind color
  status: BookStatus;
  publicationState?: PublicationState;
  currentVersion?: string;
  year: number;
  language: Language;
  tags: (Category | string)[];
  keywords?: string[];
  shortDesc: string;
  longDesc: string;
  authorNote: string;
  tableOfContents: string[];
  quotes: QuoteItem[];
  playlist?: { title: string; artist: string; duration: string }[];
  chapters: Chapter[];
  stats: {
    pageCount: number;
    wordCount: number;
    readerCount: number;
    estReadTimeMin: number;
    votesCount?: number;
    partsCount?: number;
  };
  platformLinks: PlatformLinks;
  coverStyle: {
    bgGradient: string;
    accentColor: string;
    pattern: 'matrix' | 'geometric' | 'holo' | 'brutalist' | 'circuit';
    symbol: string;
  };
  coverAssetId?: string;
  coverImageUrl?: string;
  coverVersions?: WorkCoverVersion[];
  manifest?: WorkManifest;
  editorialVersions?: WorkEditorialVersion[];
  auditHistory?: WorkAuditRecord[];
  attachedAssetIds?: string[];
  gallery?: GalleryImage[];
  relatedBookIds?: string[];
  timelineYear: number;
  isFeatured?: boolean;
  isManifesto?: boolean;
  customHtmlWorld?: {
    htmlCode: string;
    themeColor?: string;
    terminalActive?: boolean;
    worldName?: string;
    authorName?: string;
  };
  createdAt?: number | string;
  updatedAt?: number | string;
  publishedAt?: number | string;
}

export interface SeekerConfig {
  id: SeekerId;
  name: string;
  tagline: string;
  color: string; // CSS color
  glowColor: string;
  bgGradient: string;
  iconName: string;
  description: string;
}

export interface ReadingProgress {
  bookId: string;
  chapterId: string;
  percentage: number;
  lastReadTimestamp: number;
}

export interface SystemStats {
  totalBooks: number;
  publishedCount: number;
  draftsCount: number;
  languagesCount: number;
  totalPages: number;
  totalWords: number;
  totalReaders: number;
}

export interface DashboardModuleItem {
  id: 'hero_banner' | 'quote_of_day' | 'recently_added' | 'featured_books' | 'custom_collections' | 'series_seekers' | 'chrono_timeline' | 'telemetry_stats';
  label: string;
  enabled: boolean;
  description: string;
}

export interface BookCollection {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  notes?: string;
  bookIds: string[];
  createdAt: number;
  updatedAt: number;
  type?: 'Kolekcja' | 'Sekwencyjna' | 'Archiwum';
  status?: 'W trakcie' | 'Ukończone';
  totalExpected?: number;
  universe?: string;
}

export interface BookAnnotation {
  id: string;
  bookId: string;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  selectedText: string;
  note?: string;
  color: 'yellow' | 'cyan' | 'purple' | 'emerald';
  createdAt: number;
}

export interface ChapterBookmark {
  id: string;
  bookId: string;
  bookTitle: string;
  seeker: SeekerId;
  seekerColor: string;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  previewText?: string;
  createdAt: number;
}

export interface ChapterNote {
  id: string;
  bookId: string;
  bookTitle?: string;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface BookProgressData {
  bookId: string;
  readChapterIds: string[];
  bookmarkedChapterIds: string[];
  totalChapters: number;
  completedChaptersCount: number;
  percentage: number;
  isCompleted: boolean;
}

export interface UserDashboardConfig {
  defaultSeekerFilter: SeekerId | 'ALL';
  soundEnabled: boolean;
  ambientLightMode: 'dark' | 'oled' | 'cinema' | 'light';
  pinnedBookIds: string[];
  quickShortcuts: string[];
  showParticles: boolean;
  hapticsEnabled: boolean;
  dashboardModules?: DashboardModuleItem[];
}

export interface PilotProfile {
  designatorName: string;
  vesselClass: string;
  missionObjectives: string;
  specializations: string[];
  avatarUrl: string;
  neuralSyncPct: number;
  encryptionKey: string;
  authenticated: boolean;
  authenticatedAt?: number;
}

export type CreatorRole = 
  | 'Writer' 
  | 'World Builder' 
  | 'Artist' 
  | 'Researcher' 
  | 'Developer' 
  | 'Entrepreneur' 
  | 'Explorer' 
  | 'Community Builder' 
  | 'AI Architect'
  | 'Designer'
  | 'Educator'
  | 'Hybrid Creator';

export type AuraColor = 
  | 'Cyber Cyan' 
  | 'Deep Violet' 
  | 'Solar Gold' 
  | 'Crimson Energy' 
  | 'Forest Organic' 
  | 'Arctic Glass' 
  | 'Void Black' 
  | 'Custom RGB';

export type BackgroundMode = 
  | 'Glass Universe' 
  | 'Dark Terminal' 
  | 'Paper Library' 
  | 'Holographic Space' 
  | 'Minimal White' 
  | 'Neural Grid';

export type MotionStyle = 
  | 'Static' 
  | 'Soft Flow' 
  | 'Digital Rain' 
  | 'Cosmic Drift' 
  | 'Pulse Energy';

export type SoulLayoutMode = 'archive' | 'galaxy' | 'timeline' | 'story' | 'terminal';

export interface CreatorSoulProfile {
  handle: string;
  displayName: string;
  tagline: string;
  roles: CreatorRole[];
  primaryAura: AuraColor;
  backgroundMode: BackgroundMode;
  motionStyle: MotionStyle;
  spaceLayout: SoulLayoutMode;
  seekingCollaborators: string[];
  featuredBookId?: string;
  bio: string;
  detectedDNA?: {
    archetype: string;
    recommendedStyle: string;
    recommendations: string[];
  };
  isPublic: boolean;
  customRgb?: string;
  customHexColor?: string;
  customSecondaryHex?: string;
  enableScanlines?: boolean;
  enableGlitchEffect?: boolean;
  operatorId?: string;
  subjectStats?: {
    cognitiveLoad?: string;
    realityAnchor?: string;
    protocols?: string;
    location?: string;
    objective?: string;
  };
  createdAt: number;
}

export type GuideModelOption = 
  | 'gemini-3.8-flash'
  | 'gemini-3.5-flash'
  | 'gemini-3.1-flash-lite'
  | 'gemini-3.1-pro-preview';

export interface GuideChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  model?: string;
  searchQueries?: string[];
  sources?: Array<{ title?: string; uri?: string }>;
  isError?: boolean;
}

