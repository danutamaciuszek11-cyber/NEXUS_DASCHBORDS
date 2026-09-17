export type ModuleStatus =
  | 'OPERATIONAL'
  | 'READY'
  | 'RUNNING'
  | 'INSTALLING'
  | 'OFFLINE'
  | 'ERROR'
  | 'UPDATE AVAILABLE';

export interface NexusManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  entry: string; // e.g., 'index.html'
  script?: string; // e.g., 'module.js'
  style?: string; // e.g., 'style.css'
  icon?: string;
  images?: string[];
  accent?: string;
  node?: string;
  category?: string;
  author?: string;
  capabilities?: string[];
  repoUrl?: string;
  dependencies?: string[];
}

export interface ModuleShellConfig {
  sandbox: string;
  isolationLevel: 'strict' | 'standard' | 'lax';
  defaultMode: 'window' | 'panel' | 'fullscreen';
  allowAi: boolean;
  allowStorage: boolean;
  allowEvents: boolean;
}

export interface NexusModule {
  id: string;
  name: string;
  version: string;
  description: string;
  entry: string;
  script?: string;
  style?: string;
  icon?: string;
  images: string[];
  accent: string;
  status: ModuleStatus;
  node: string;
  category: string;
  installedAt: number;
  packageType: 'system' | 'custom-zip';
  files?: Record<string, string>; // In-memory path -> data URL or text
  blobUrl?: string; // Blob URL for iframe execution if HTML entry
  capabilities?: string[];
  shellConfig?: ModuleShellConfig;
  repoUrl?: string;
  dependencies?: string[];
}

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  tag: string;
  message: string;
  level?: 'info' | 'warn' | 'error' | 'success';
}

export interface NexusUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface ModuleConflict {
  existingModule: NexusModule;
  newManifest: NexusManifest;
  pendingFile: File | Blob;
}
