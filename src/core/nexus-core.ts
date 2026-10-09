import { moduleRegistry } from './module-registry';
import { NexusZipManager } from './zip/zip-manager';
import { storage } from './storage';
import { eventBus } from './event-bus';
import { NexusModule, ModuleConflict } from './types';
import { ImageManager } from './image-manager';
import { auth, onAuthStateChanged, fetchUserModulesFromCloud } from './firebase';

export interface CapabilityAPI {
  moduleId: string;
  ai: {
    generateText: (prompt: string) => Promise<string>;
    generateImage?: (prompt: string) => Promise<string>;
  };
  storage: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<void>;
    remove: (key: string) => Promise<void>;
  };
  events: {
    emit: (event: string, payload: any) => void;
    on: (event: string, callback: (payload: any) => void) => () => void;
  };
  bellasCore: {
    request: (capabilityName: string, payload?: any) => Promise<any>;
  };
}

export interface NexusCoreState {
  isInitialized: boolean;
  activeSection: string;
  totalModules: number;
  operationalCount: number;
  systemReady: boolean;
  adminMode: boolean;
}

class NexusCore {
  private state: NexusCoreState = {
    isInitialized: false,
    activeSection: 'PULPIT PC',
    totalModules: 0,
    operationalCount: 0,
    systemReady: true,
    adminMode: false,
  };

  async boot(): Promise<void> {
    if (this.state.isInitialized) return;

    eventBus.emit('log', {
      tag: 'NEXUS CORE',
      message: 'ONLINE',
      level: 'info',
    });

    await moduleRegistry.init();

    // Listen to Firebase auth state
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        eventBus.emit('log', {
          tag: 'FIREBASE',
          message: `AUTHENTICATED CLOUD NODE [${user.email}]`,
          level: 'success',
        });
        const cloudMods = await fetchUserModulesFromCloud(user.uid);
        if (cloudMods && cloudMods.length > 0) {
          for (const cm of cloudMods) {
            if (cm.id && !moduleRegistry.get(cm.id)) {
              await moduleRegistry.register(cm as NexusModule, true);
            }
          }
        }
      } else {
        eventBus.emit('log', {
          tag: 'FIREBASE',
          message: 'GUEST IDENTITY ACTIVE (LOCAL STORAGE ENFORCED)',
          level: 'info',
        });
      }
    });

    this.updateStats();

    eventBus.on('registry:updated', () => {
      this.updateStats();
    });

    this.state.isInitialized = true;
    eventBus.emit('log', {
      tag: 'NEXUS CORE',
      message: 'ONLINE // CENTRAL MODULE CONTROL READY',
      level: 'success',
    });
  }

  private updateStats(): void {
    const all = moduleRegistry.getAll();
    this.state.totalModules = all.length;
    this.state.operationalCount = all.filter(
      (m) => m.status === 'OPERATIONAL' || m.status === 'RUNNING' || m.status === 'READY'
    ).length;
    eventBus.emit('core:state', { ...this.state });
  }

  getState(): NexusCoreState {
    return { ...this.state };
  }

  setAdminMode(active: boolean): void {
    this.state.adminMode = active;
    eventBus.emit('core:state', { ...this.state });
    eventBus.emit('log', {
      tag: 'NEXUS CORE',
      message: active ? 'ADMIN MODE ENABLED' : 'ADMIN MODE DISABLED // RETURNED TO DASHBOARD',
      level: active ? 'warn' : 'info',
    });
  }

  toggleAdminMode(): boolean {
    const next = !this.state.adminMode;
    this.setAdminMode(next);
    return next;
  }

  setActiveSection(section: string): void {
    this.state.activeSection = section;
    eventBus.emit('core:state', { ...this.state });
    eventBus.emit('log', {
      tag: 'NAV',
      message: `BELLA OS SECTION SWITCH: [${section}]`,
      level: 'info',
    });
  }

  /**
   * Installs or updates a module from a ZIP file following real pipeline stages:
   * 1. PACKAGE RECEIVED
   * 2. VALIDATING ZIP
   * 3. VALIDATING MANIFEST
   * 4. EXTRACTING FILES
   * 5. REGISTERING MODULE
   * 6. GENERATING TILE
   * 7. MODULE READY
   */
  async installZipModule(
    file: File | Blob,
    onStep?: (step: string) => void,
    forceOverwrite: boolean = false
  ): Promise<{ success: boolean; module?: NexusModule; conflict?: ModuleConflict; error?: string }> {
    try {
      if (typeof onStep === 'function') onStep('PACKAGE RECEIVED');
      eventBus.emit('log', {
        tag: 'ZIP',
        message: 'IMPORT START',
        level: 'info',
      });
      await new Promise((r) => setTimeout(r, 160));

      const res = await NexusZipManager.extractZip(file, (stage) => {
        if (typeof onStep === 'function') onStep(stage);
        eventBus.emit('log', { tag: 'ZIP', message: `${stage}...`, level: 'info' });
      });

      if (!res.valid || !res.manifest) {
        throw new Error(res.error || 'INVALID PACKAGE FORMAT');
      }

      eventBus.emit('log', {
        tag: 'MANIFEST',
        message: 'VALID',
        level: 'success',
      });

      const manifest = res.manifest;

      // Duplicate Check: Check if module already exists
      const existing = moduleRegistry.get(manifest.id);
      if (existing && !forceOverwrite) {
        eventBus.emit('log', {
          tag: 'MODULE',
          message: `MODULE ALREADY INSTALLED: [${manifest.id}] (Current v${existing.version}, New v${manifest.version})`,
          level: 'warn',
        });
        return {
          success: false,
          conflict: {
            existingModule: existing,
            newManifest: manifest,
            pendingFile: file,
          },
          error: 'MODULE ALREADY INSTALLED',
        };
      }

      if (typeof onStep === 'function') onStep('REGISTERING MODULE');
      await new Promise((r) => setTimeout(r, 180));

      const nodeIndex = moduleRegistry.getAll().length + 1;
      const nodeTag = manifest.node || existing?.node || `NODE #${nodeIndex < 10 ? '0' + nodeIndex : nodeIndex}`;

      const newModule: NexusModule = {
        id: manifest.id,
        name: manifest.name,
        version: manifest.version || '1.0.0',
        description: manifest.description || 'Custom installed NEXUS module.',
        entry: manifest.entry || 'index.html',
        script: manifest.script || 'module.js',
        style: manifest.style || 'style.css',
        icon: manifest.icon,
        accent: manifest.accent || '#00E5FF',
        status: 'READY',
        node: nodeTag,
        category: manifest.category || 'EXTENSIONS',
        installedAt: Date.now(),
        packageType: 'custom-zip',
        images:
          res.images && res.images.length > 0
            ? res.images
            : [
                ImageManager.generateDefaultModuleSvg(manifest.name, manifest.accent || '#00E5FF', nodeTag, 1),
              ],
        files: res.files,
      };

      await moduleRegistry.register(newModule, true);
      await storage.saveModule(newModule);
      await storage.savePackageBlob(newModule.id, file);

      eventBus.emit('log', {
        tag: 'STORAGE',
        message: `SAVED TO INDEXEDDB: [${newModule.id}] (${Object.keys(newModule.files || {}).length} files)`,
        level: 'info',
      });
      eventBus.emit('log', {
        tag: 'REGISTRY',
        message: `MODULE REGISTERED: [${newModule.id}]`,
        level: 'info',
      });

      if (typeof onStep === 'function') onStep('GENERATING TILE');
      await new Promise((r) => setTimeout(r, 180));
      eventBus.emit('log', {
        tag: 'UI',
        message: 'TILE GENERATED',
        level: 'info',
      });

      if (typeof onStep === 'function') onStep('MODULE READY');
      eventBus.emit('log', {
        tag: 'STATUS',
        message: `${newModule.name} READY`,
        level: 'success',
      });

      return { success: true, module: newModule };
    } catch (err: any) {
      const errMsg = err.message || 'PACKAGE PROCESSING FAILED';
      eventBus.emit('log', {
        tag: 'ZIP ERROR',
        message: errMsg,
        level: 'error',
      });
      return { success: false, error: errMsg };
    }
  }
}

export const nexusCore = new NexusCore();
