import { NexusModule, ModuleStatus } from './types';
import { storage } from './storage';
import { eventBus } from './event-bus';
import { ImageManager } from './image-manager';
import { ZipManager } from './zip-manager';
import { auth, syncModuleToCloud, deleteModuleFromCloud } from './firebase';
import { CapabilityAPI } from './nexus-core';

export class ModuleRegistry {
  private modules: Map<string, NexusModule> = new Map();
  private initialized: boolean = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    // 1. Load from IndexedDB
    const storedModules = await storage.getAllModules();
    if (storedModules.length > 0) {
      storedModules.forEach((m) => this.modules.set(m.id, m));
      // Auto-integrate KAISA ONLINE if not yet present in existing local DB
      if (!this.modules.has('kaisa-online')) {
        await this.registerKaisaModule();
      }
    } else {
      // Seed default native NEXUS modules inspired by NEXUS interfaces
      await this.seedDefaultModules();
    }

    this.initialized = true;
    eventBus.emit('registry:updated', this.getAll());
    eventBus.emit('log', {
      tag: 'REGISTRY',
      message: `${this.modules.size} MODULES LOADED INTO RUNTIME`,
      level: 'info',
    });
  }

  getAll(): NexusModule[] {
    return Array.from(this.modules.values()).sort((a, b) => a.installedAt - b.installedAt);
  }

  get(id: string): NexusModule | undefined {
    return this.modules.get(id);
  }

  getCapabilityAPI(moduleId: string): CapabilityAPI {
    return {
      moduleId,
      ai: {
        generateText: async (prompt: string) => {
          eventBus.emit('log', {
            tag: 'CAPABILITY:AI',
            message: `Module [${moduleId}] requested AI text generation`,
            level: 'info',
          });
          return `[Nexus AI Response to ${moduleId}]: Processed "${prompt}" securely via Bellas Core runtime bridge.`;
        },
      },
      storage: {
        get: async (key: string) => {
          const mod = this.modules.get(moduleId);
          if (!mod || !mod.files) return null;
          return mod.files[key] || null;
        },
        set: async (key: string, value: any) => {
          const mod = this.modules.get(moduleId);
          if (mod) {
            if (!mod.files) mod.files = {};
            mod.files[key] = typeof value === 'string' ? value : JSON.stringify(value);
            await storage.saveModule(mod);
            if (auth.currentUser) {
              await syncModuleToCloud(auth.currentUser.uid, mod);
            }
            eventBus.emit('registry:updated', this.getAll());
          }
        },
        remove: async (key: string) => {
          const mod = this.modules.get(moduleId);
          if (mod && mod.files) {
            delete mod.files[key];
            await storage.saveModule(mod);
            if (auth.currentUser) {
              await syncModuleToCloud(auth.currentUser.uid, mod);
            }
            eventBus.emit('registry:updated', this.getAll());
          }
        },
      },
      events: {
        emit: (event: string, payload: any) => {
          eventBus.emit(`module:${moduleId}:${event}`, payload);
          eventBus.emit(event, { moduleId, payload });
        },
        on: (event: string, callback: (payload: any) => void) => {
          return eventBus.on(event, (data: any) => {
            callback(data);
          });
        },
      },
      bellasCore: {
        request: async (capabilityName: string, payload?: any) => {
          eventBus.emit('log', {
            tag: 'BELLAS CORE',
            message: `Module [${moduleId}] requested capability: ${capabilityName}`,
            level: 'info',
          });
          return { status: 'success', mediatedBy: 'BellasCore', capability: capabilityName, payload };
        },
      },
    };
  }

  async register(module: NexusModule, saveToStorage: boolean = true): Promise<void> {
    if (!module.shellConfig) {
      module.shellConfig = {
        sandbox: 'allow-scripts allow-forms allow-same-origin',
        isolationLevel: 'strict',
        defaultMode: 'window',
        allowAi: true,
        allowStorage: true,
        allowEvents: true,
      };
    }
    this.modules.set(module.id, module);

    if (saveToStorage) {
      await storage.saveModule(module);
      if (auth.currentUser) {
        await syncModuleToCloud(auth.currentUser.uid, module);
      }
    }

    eventBus.emit('registry:updated', this.getAll());
    eventBus.emit('log', {
      tag: 'REGISTRY',
      message: `MODULE REGISTERED: [${module.name}]`,
      level: 'success',
    });
  }

  async updateStatus(id: string, status: ModuleStatus): Promise<void> {
    const mod = this.modules.get(id);
    if (mod) {
      mod.status = status;
      await storage.saveModule(mod);
      if (auth.currentUser) {
        await syncModuleToCloud(auth.currentUser.uid, mod);
      }
      eventBus.emit('registry:updated', this.getAll());
    }
  }

  async addModuleImage(id: string, imageDataUrl: string): Promise<boolean> {
    const mod = this.modules.get(id);
    if (!mod) return false;

    if (mod.images.length >= 4) {
      // Replace the last image if at maximum 4
      mod.images[mod.images.length - 1] = imageDataUrl;
    } else {
      mod.images.push(imageDataUrl);
    }

    await storage.saveModule(mod);
    if (auth.currentUser) {
      await syncModuleToCloud(auth.currentUser.uid, mod);
    }

    eventBus.emit('registry:updated', this.getAll());
    eventBus.emit('log', {
      tag: 'IMAGE',
      message: `IMAGE ADDED TO [${mod.name}] (${mod.images.length}/4)`,
      level: 'info',
    });
    return true;
  }

  async replaceModuleImage(id: string, index: number, imageDataUrl: string): Promise<boolean> {
    const mod = this.modules.get(id);
    if (!mod || index < 0 || index >= mod.images.length) return false;

    mod.images[index] = imageDataUrl;
    await storage.saveModule(mod);
    if (auth.currentUser) {
      await syncModuleToCloud(auth.currentUser.uid, mod);
    }

    eventBus.emit('registry:updated', this.getAll());
    return true;
  }

  async removeModuleImage(id: string, index: number): Promise<boolean> {
    const mod = this.modules.get(id);
    if (!mod || index < 0 || index >= mod.images.length) return false;

    mod.images.splice(index, 1);
    await storage.saveModule(mod);
    if (auth.currentUser) {
      await syncModuleToCloud(auth.currentUser.uid, mod);
    }

    eventBus.emit('registry:updated', this.getAll());
    return true;
  }

  async remove(id: string): Promise<void> {
    const mod = this.modules.get(id);
    const modName = mod?.name || id;
    this.modules.delete(id);
    await storage.deleteModule(id);

    if (auth.currentUser) {
      await deleteModuleFromCloud(auth.currentUser.uid, id);
    }

    eventBus.emit('registry:updated', this.getAll());
    eventBus.emit('log', {
      tag: 'REGISTRY',
      message: `MODULE PURGED: [${modName}]`,
      level: 'warn',
    });
  }

  /**
   * Reset to native system modules
   */
  async resetToDefaults(): Promise<void> {
    this.modules.clear();
    const existing = await storage.getAllModules();
    for (const m of existing) {
      await storage.deleteModule(m.id);
    }
    await this.seedDefaultModules();
    eventBus.emit('registry:updated', this.getAll());
  }

  private async seedDefaultModules(): Promise<void> {
    const defaultList: Omit<NexusModule, 'installedAt'>[] = [
      {
        id: 'nexus-bella-os',
        name: 'NEXUS BELLA OS',
        version: '4.2.0',
        description: 'Core sentient neural operating kernel and autonomous agent framework.',
        entry: 'index.html',
        accent: '#00E5FF', // Cyan
        status: 'OPERATIONAL',
        node: 'NODE #01',
        category: 'SYSTEM',
        packageType: 'system',
        images: [
          ImageManager.generateDefaultModuleSvg('NEXUS BELLA OS', '#00E5FF', 'NODE #01', 1),
          ImageManager.generateDefaultModuleSvg('NEXUS BELLA OS', '#00E5FF', 'NODE #01', 2),
          ImageManager.generateDefaultModuleSvg('NEXUS BELLA OS', '#00E5FF', 'NODE #01', 3),
          ImageManager.generateDefaultModuleSvg('NEXUS BELLA OS', '#00E5FF', 'NODE #01', 4),
        ],
      },
      {
        id: 'nexus-family',
        name: 'NEXUS FAMILY',
        version: '2.8.4',
        description: 'Multi-identity sovereign collective network, guardian permissions, and sync nodes.',
        entry: 'index.html',
        accent: '#A855F7', // Violet
        status: 'OPERATIONAL',
        node: 'NODE #02',
        category: 'COMMUNICATION',
        packageType: 'system',
        images: [
          ImageManager.generateDefaultModuleSvg('NEXUS FAMILY', '#A855F7', 'NODE #02', 1),
          ImageManager.generateDefaultModuleSvg('NEXUS FAMILY', '#A855F7', 'NODE #02', 2),
          ImageManager.generateDefaultModuleSvg('NEXUS FAMILY', '#A855F7', 'NODE #02', 3),
          ImageManager.generateDefaultModuleSvg('NEXUS FAMILY', '#A855F7', 'NODE #02', 4),
        ],
      },
      {
        id: 'nexus-media-forge',
        name: 'NEXUS MEDIA FORGE',
        version: '3.1.0',
        description: 'High-throughput sensory generation, audio synth matrix, and media pipeline.',
        entry: 'index.html',
        accent: '#EC4899', // Magenta
        status: 'OPERATIONAL',
        node: 'NODE #03',
        category: 'CREATIVE',
        packageType: 'system',
        images: [
          ImageManager.generateDefaultModuleSvg('NEXUS MEDIA FORGE', '#EC4899', 'NODE #03', 1),
          ImageManager.generateDefaultModuleSvg('NEXUS MEDIA FORGE', '#EC4899', 'NODE #03', 2),
          ImageManager.generateDefaultModuleSvg('NEXUS MEDIA FORGE', '#EC4899', 'NODE #03', 3),
          ImageManager.generateDefaultModuleSvg('NEXUS MEDIA FORGE', '#EC4899', 'NODE #03', 4),
        ],
      },
      {
        id: 'nexusbook',
        name: 'NEXUSBOOK',
        version: '1.9.2',
        description: 'Immutable neural knowledge ledger, document indexing, and sovereign archive.',
        entry: 'index.html',
        accent: '#00D9A6', // Green
        status: 'READY',
        node: 'NODE #04',
        category: 'KNOWLEDGE',
        packageType: 'system',
        images: [
          ImageManager.generateDefaultModuleSvg('NEXUSBOOK', '#00D9A6', 'NODE #04', 1),
          ImageManager.generateDefaultModuleSvg('NEXUSBOOK', '#00D9A6', 'NODE #04', 2),
          ImageManager.generateDefaultModuleSvg('NEXUSBOOK', '#00D9A6', 'NODE #04', 3),
          ImageManager.generateDefaultModuleSvg('NEXUSBOOK', '#00D9A6', 'NODE #04', 4),
        ],
      },
      {
        id: 'nexus-dev-hub',
        name: 'NEXUS DEV HUB',
        version: '5.0.1',
        description: 'Engineering workbench, compiler pipelines, WASM sandboxes, and XNL visualizer.',
        entry: 'index.html',
        accent: '#3B82F6', // Blue
        status: 'RUNNING',
        node: 'NODE #05',
        category: 'DEVELOPER',
        packageType: 'system',
        images: [
          ImageManager.generateDefaultModuleSvg('NEXUS DEV HUB', '#3B82F6', 'NODE #05', 1),
          ImageManager.generateDefaultModuleSvg('NEXUS DEV HUB', '#3B82F6', 'NODE #05', 2),
          ImageManager.generateDefaultModuleSvg('NEXUS DEV HUB', '#3B82F6', 'NODE #05', 3),
          ImageManager.generateDefaultModuleSvg('NEXUS DEV HUB', '#3B82F6', 'NODE #05', 4),
        ],
      },
      {
        id: 'nexus-worlds',
        name: 'NEXUS WORLDS',
        version: '1.4.0',
        description: 'Decentralized spatial environments, simulation topology, and virtual worlds cluster.',
        entry: 'index.html',
        accent: '#8B5CF6', // Purple
        status: 'OPERATIONAL',
        node: 'NODE #06',
        category: 'SIMULATION',
        packageType: 'system',
        images: [
          ImageManager.generateDefaultModuleSvg('NEXUS WORLDS', '#8B5CF6', 'NODE #06', 1),
          ImageManager.generateDefaultModuleSvg('NEXUS WORLDS', '#8B5CF6', 'NODE #06', 2),
          ImageManager.generateDefaultModuleSvg('NEXUS WORLDS', '#8B5CF6', 'NODE #06', 3),
          ImageManager.generateDefaultModuleSvg('NEXUS WORLDS', '#8B5CF6', 'NODE #06', 4),
        ],
      },
      {
        id: 'kaisa-online',
        name: 'KAISA ONLINE',
        version: '2.1.0',
        description: 'KAISA Protocol ETERNIVERSE-DEV-CORE - Autonomous microservice lifecycle orchestrator & pipeline engine.',
        entry: 'index.html',
        accent: '#F59E0B', // Amber / Gold
        status: 'OPERATIONAL',
        node: 'NODE #07',
        category: 'ORCHESTRATION',
        packageType: 'system',
        images: [
          ImageManager.generateDefaultModuleSvg('KAISA ONLINE', '#F59E0B', 'NODE #07', 1),
          ImageManager.generateDefaultModuleSvg('KAISA ONLINE', '#F59E0B', 'NODE #07', 2),
          ImageManager.generateDefaultModuleSvg('KAISA ONLINE', '#F59E0B', 'NODE #07', 3),
          ImageManager.generateDefaultModuleSvg('KAISA ONLINE', '#F59E0B', 'NODE #07', 4),
        ],
      },
    ];

    let t = Date.now() - 100000;
    for (const item of defaultList) {
      t += 10000;
      const fullModule: NexusModule = {
        ...item,
        installedAt: t,
        shellConfig: {
          sandbox: 'allow-scripts allow-forms allow-same-origin',
          isolationLevel: 'strict',
          defaultMode: 'window',
          allowAi: true,
          allowStorage: true,
          allowEvents: true,
        },
      };
      this.modules.set(fullModule.id, fullModule);
      await storage.saveModule(fullModule);
    }
  }

  private async registerKaisaModule(): Promise<void> {
    const kaisaMod: NexusModule = {
      id: 'kaisa-online',
      name: 'KAISA ONLINE',
      version: '2.1.0',
      description: 'KAISA Protocol ETERNIVERSE-DEV-CORE - Autonomous microservice lifecycle orchestrator & pipeline engine.',
      entry: 'index.html',
      accent: '#F59E0B',
      status: 'OPERATIONAL',
      node: 'NODE #07',
      category: 'ORCHESTRATION',
      packageType: 'system',
      installedAt: Date.now(),
      images: [
        ImageManager.generateDefaultModuleSvg('KAISA ONLINE', '#F59E0B', 'NODE #07', 1),
        ImageManager.generateDefaultModuleSvg('KAISA ONLINE', '#F59E0B', 'NODE #07', 2),
        ImageManager.generateDefaultModuleSvg('KAISA ONLINE', '#F59E0B', 'NODE #07', 3),
        ImageManager.generateDefaultModuleSvg('KAISA ONLINE', '#F59E0B', 'NODE #07', 4),
      ],
      shellConfig: {
        sandbox: 'allow-scripts allow-forms allow-same-origin',
        isolationLevel: 'strict',
        defaultMode: 'window',
        allowAi: true,
        allowStorage: true,
        allowEvents: true,
      },
    };
    this.modules.set(kaisaMod.id, kaisaMod);
    await storage.saveModule(kaisaMod);
    eventBus.emit('log', {
      tag: 'KAISA CORE',
      message: 'KAISA ONLINE [ETERNIVERSE-DEV-CORE] LOADED INTO REGISTRY',
      level: 'success',
    });
  }
}

export const moduleRegistry = new ModuleRegistry();
