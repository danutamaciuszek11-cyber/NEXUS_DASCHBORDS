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
  category?: Category | string;
  isCustom?: boolean;
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
  imageUrl?: string;
  coverUrl?: string;
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

export type PilotRole = 'ARCHITECT' | 'PILOT' | 'CHRONICLER' | 'SENTINEL' | 'GUEST';
export type AuthProviderType = 'google' | 'quantum_seed' | 'local_storage' | 'guest';

export interface PublishingPortalConnection {
  id: string; // e.g. 'substack', 'medium', 'github', 'twitter_x', 'discord', 'telegram', 'wattpad', 'amazon_kdp'
  name: string;
  category: 'editorial' | 'code' | 'broadcast' | 'community' | 'store';
  icon: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'PENDING_CONFIG';
  endpointOrWebhook?: string;
  apiKeyOrToken?: string;
  accountHandle?: string;
  permissionMode: 'READ_ONLY' | 'AUTO_PUBLISH' | 'MANUAL_DISPATCH';
  lastHandshakeAt?: number;
  nxlNodeAddress?: string;
}

export interface PilotProfile {
  designatorName: string;
  callsign?: string;
  vesselClass: string;
  missionObjectives: string;
  specializations: string[];
  avatarUrl: string;
  neuralSyncPct: number;
  encryptionKey: string;
  authenticated: boolean;
  authenticatedAt?: number;
  isGuest?: boolean;
  role?: PilotRole;
  email?: string;
  authProvider?: AuthProviderType;
  clearanceLevel?: number; // 0 for Guest, 2 for Chronicler, 3 for Sentinel, 4 for Pilot, 5 for Architect
  connectedPortals?: PublishingPortalConnection[];
  customAvatarBase64?: string;
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

// ==========================================
// NEXUS TELEMETRY & LOGGING ARCHITECTURE
// ==========================================

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export type LogCategory = 
  | 'CORE' 
  | 'UI' 
  | 'AUTH' 
  | 'STORAGE' 
  | 'NETWORK' 
  | 'AUDIO' 
  | 'AI' 
  | 'BLOCKCHAIN' 
  | 'EDITORIAL' 
  | 'SYSTEM';

export interface NexusLogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  category: LogCategory;
  module: string;
  message: string;
  userFriendlyMessage?: string;
  details?: Record<string, any> | string;
  stack?: string;
  componentStack?: string;
  handled: boolean;
  notifyUser?: boolean;
  url?: string;
  count?: number;
}

export interface LoggerFilterOptions {
  level?: LogLevel | 'ALL' | 'ERROR_AND_FATAL';
  category?: LogCategory | 'ALL';
  searchTerm?: string;
  module?: string;
}

export interface LoggerStats {
  totalLogs: number;
  debugCount: number;
  infoCount: number;
  warnCount: number;
  errorCount: number;
  fatalCount: number;
  lastErrorTimestamp?: number;
  activeErrorCount: number;
}

