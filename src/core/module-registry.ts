import { NexusModule, ModuleStatus } from './types';
import { storage } from './storage';
import { eventBus } from './event-bus';
import { ImageManager } from './image-manager';
import { auth, syncModuleToCloud, deleteModuleFromCloud } from './firebase';
import { CapabilityAPI } from './nexus-core';
import { syncModuleToCloudSQL } from '../db/sync';

export const SYSTEM_ECOSYSTEM_MODULES: Omit<NexusModule, 'installedAt'>[] = [
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
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS_DASCHBORDS.git',
    dependencies: [],
    images: [
      ImageManager.generateDefaultModuleSvg('NEXUS BELLA OS', '#00E5FF', 'NODE #01', 1),
      ImageManager.generateDefaultModuleSvg('NEXUS BELLA OS', '#00E5FF', 'NODE #01', 2),
      ImageManager.generateDefaultModuleSvg('NEXUS BELLA OS', '#00E5FF', 'NODE #01', 3),
      ImageManager.generateDefaultModuleSvg('NEXUS BELLA OS', '#00E5FF', 'NODE #01', 4),
    ],
  },
  {
    id: 'nexus-family',
    name: 'NEXUS FAMILY COLLECTIVE',
    version: '2.8.4',
    description: 'Multi-identity sovereign collective network, guardian permissions, and sync nodes.',
    entry: 'index.html',
    accent: '#A855F7', // Violet
    status: 'OPERATIONAL',
    node: 'NODE #02',
    category: 'COMMUNICATION',
    packageType: 'system',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS_FAMILI.git',
    dependencies: ['nexus-bella-os'],
    images: [
      ImageManager.generateDefaultModuleSvg('NEXUS FAMILY', '#A855F7', 'NODE #02', 1),
      ImageManager.generateDefaultModuleSvg('NEXUS FAMILY', '#A855F7', 'NODE #02', 2),
      ImageManager.generateDefaultModuleSvg('NEXUS FAMILY', '#A855F7', 'NODE #02', 3),
      ImageManager.generateDefaultModuleSvg('NEXUS FAMILY', '#A855F7', 'NODE #02', 4),
    ],
  },
  {
    id: 'nexus-media-forge',
    name: 'NEXUS MEDIA & CYBER RADIO',
    version: '3.1.0',
    description: 'Studio dźwięku syntetycznego, studio transmisji na żywo, cyber-radiostacja i generacja multimediów sensorycznych.',
    entry: 'index.html',
    accent: '#EC4899', // Magenta
    status: 'OPERATIONAL',
    node: 'NODE #03',
    category: 'CREATIVE',
    packageType: 'system',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/-NEXUS-MEDIA-Studio-D-wi-ku-Syntetycznego-Transmisji-Cyber-Radiostacji.git',
    dependencies: ['nexus-bella-os'],
    images: [
      ImageManager.generateDefaultModuleSvg('NEXUS MEDIA & CYBER RADIO', '#EC4899', 'NODE #03', 1),
      ImageManager.generateDefaultModuleSvg('NEXUS MEDIA & CYBER RADIO', '#EC4899', 'NODE #03', 2),
      ImageManager.generateDefaultModuleSvg('NEXUS MEDIA & CYBER RADIO', '#EC4899', 'NODE #03', 3),
      ImageManager.generateDefaultModuleSvg('NEXUS MEDIA & CYBER RADIO', '#EC4899', 'NODE #03', 4),
    ],
  },
  {
    id: 'nexusbook',
    name: 'NEXUSBOOK LEDGER',
    version: '1.9.2',
    description: 'Immutable neural knowledge ledger, document indexing, and sovereign archive.',
    entry: 'index.html',
    accent: '#00D9A6', // Green
    status: 'READY',
    node: 'NODE #04',
    category: 'KNOWLEDGE',
    packageType: 'system',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-ACADEMY-Knowledge-Transfer-Engine.git',
    dependencies: ['nexus-bella-os'],
    images: [
      ImageManager.generateDefaultModuleSvg('NEXUSBOOK', '#00D9A6', 'NODE #04', 1),
      ImageManager.generateDefaultModuleSvg('NEXUSBOOK', '#00D9A6', 'NODE #04', 2),
      ImageManager.generateDefaultModuleSvg('NEXUSBOOK', '#00D9A6', 'NODE #04', 3),
      ImageManager.generateDefaultModuleSvg('NEXUSBOOK', '#00D9A6', 'NODE #04', 4),
    ],
  },
  {
    id: 'nexus-dev-hub',
    name: 'NEXUS DEV HUB (KUŹNIA 9 ŚWIATÓW)',
    version: '5.0.1',
    description: 'Kuźnia Forge 9 Światów – środowisko inżynieryjne kompilacji, kompozytor graficzny XNL, piaskownice WASM.',
    entry: 'index.html',
    accent: '#3B82F6', // Blue
    status: 'RUNNING',
    node: 'NODE #05',
    category: 'DEVELOPER',
    packageType: 'system',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-DEV-HUB-Ekosystem-9-wiat-w-Ku-nia-Forge-.git',
    dependencies: ['nexus-bella-os', 'nexus-rfc-02-gateway'],
    images: [
      ImageManager.generateDefaultModuleSvg('NEXUS DEV HUB', '#3B82F6', 'NODE #05', 1),
      ImageManager.generateDefaultModuleSvg('NEXUS DEV HUB', '#3B82F6', 'NODE #05', 2),
      ImageManager.generateDefaultModuleSvg('NEXUS DEV HUB', '#3B82F6', 'NODE #05', 3),
      ImageManager.generateDefaultModuleSvg('NEXUS DEV HUB', '#3B82F6', 'NODE #05', 4),
    ],
  },
  {
    id: 'nexus-worlds',
    name: 'NEXUS WORLDS SIMULATION',
    version: '1.4.0',
    description: 'Decentralized spatial environments, simulation topology, and virtual worlds cluster.',
    entry: 'index.html',
    accent: '#8B5CF6', // Purple
    status: 'OPERATIONAL',
    node: 'NODE #06',
    category: 'SIMULATION',
    packageType: 'system',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS_DASCHBORDS.git',
    dependencies: ['nexus-bella-os', 'nexus-dev-hub'],
    images: [
      ImageManager.generateDefaultModuleSvg('NEXUS WORLDS', '#8B5CF6', 'NODE #06', 1),
      ImageManager.generateDefaultModuleSvg('NEXUS WORLDS', '#8B5CF6', 'NODE #06', 2),
      ImageManager.generateDefaultModuleSvg('NEXUS WORLDS', '#8B5CF6', 'NODE #06', 3),
      ImageManager.generateDefaultModuleSvg('NEXUS WORLDS', '#8B5CF6', 'NODE #06', 4),
    ],
  },
  {
    id: 'kaisa-online',
    name: 'KAISA ONLINE ORCHESTRATOR',
    version: '2.1.0',
    description: 'KAISA Protocol ETERNIVERSE-DEV-CORE - Autonomous microservice lifecycle orchestrator & pipeline engine.',
    entry: 'index.html',
    accent: '#F59E0B', // Amber / Gold
    status: 'OPERATIONAL',
    node: 'NODE #07',
    category: 'ORCHESTRATION',
    packageType: 'system',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-REVOLUTION.git',
    dependencies: ['nexus-bella-os', 'nexus-rfc-02-gateway'],
    images: [
      ImageManager.generateDefaultModuleSvg('KAISA ONLINE', '#F59E0B', 'NODE #07', 1),
      ImageManager.generateDefaultModuleSvg('KAISA ONLINE', '#F59E0B', 'NODE #07', 2),
      ImageManager.generateDefaultModuleSvg('KAISA ONLINE', '#F59E0B', 'NODE #07', 3),
      ImageManager.generateDefaultModuleSvg('KAISA ONLINE', '#F59E0B', 'NODE #07', 4),
    ],
  },
  {
    id: 'nexus-constitution-governance',
    name: 'NEXUS DIGITAL CONSTITUTION',
    version: '1.0.0',
    description: 'Suwerenna cyfrowa konstytucja, ekosystem ładu cyfrowego, prawo maszynowe i etyka agentów AI w sieci Nexus.',
    entry: 'index.html',
    accent: '#10B981', // Emerald Green
    status: 'OPERATIONAL',
    node: 'NODE #08',
    category: 'GOVERNANCE & LAW',
    packageType: 'system',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/-NEXUS-SOVEREIGN-DIGITAL-CONSTITUTION-GOVERNANCE-ECOSYSTEM.git',
    dependencies: ['nexus-bella-os', 'nexusbook'],
    images: [
      ImageManager.generateDefaultModuleSvg('CONSTITUTION & GOVERNANCE', '#10B981', 'NODE #08', 1),
      ImageManager.generateDefaultModuleSvg('CONSTITUTION & GOVERNANCE', '#10B981', 'NODE #08', 2),
      ImageManager.generateDefaultModuleSvg('CONSTITUTION & GOVERNANCE', '#10B981', 'NODE #08', 3),
      ImageManager.generateDefaultModuleSvg('CONSTITUTION & GOVERNANCE', '#10B981', 'NODE #08', 4),
    ],
  },
  {
    id: 'neural-link-middleware',
    name: 'NEURAL LINK MIDDLEWARE v1.2',
    version: '1.2.0',
    description: 'Magistrala pośrednicząca Neural Link v1.2 – ultraszybka wymiana stanów między agentami AI, bufor synaptyczny i łącznik modeli.',
    entry: 'index.html',
    accent: '#06B6D4', // Electric Cyan
    status: 'OPERATIONAL',
    node: 'NODE #09',
    category: 'INTEGRATION & API',
    packageType: 'system',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/-NEURAL-LINK-MIDDLEWARE-v1.2.git',
    dependencies: ['nexus-bella-os', 'kaisa-online'],
    images: [
      ImageManager.generateDefaultModuleSvg('NEURAL LINK BUS', '#06B6D4', 'NODE #09', 1),
      ImageManager.generateDefaultModuleSvg('NEURAL LINK BUS', '#06B6D4', 'NODE #09', 2),
      ImageManager.generateDefaultModuleSvg('NEURAL LINK BUS', '#06B6D4', 'NODE #09', 3),
      ImageManager.generateDefaultModuleSvg('NEURAL LINK BUS', '#06B6D4', 'NODE #09', 4),
    ],
  },
  {
    id: 'nexus-vault',
    name: 'NEXUS CRYPTO VAULT',
    version: '2.0.0',
    description: 'Suwerenny skarbiec kryptograficzny, zarządzanie kluczami prywatnymi, szyfrowanie zerowej wiedzy (ZK) i sejf kontraktów.',
    entry: 'index.html',
    accent: '#EAB308', // Gold
    status: 'OPERATIONAL',
    node: 'NODE #10',
    category: 'SECURITY & VAULT',
    packageType: 'system',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/Nexus_vault.git',
    dependencies: ['nexus-bella-os', 'nexus-rfc-02-gateway'],
    images: [
      ImageManager.generateDefaultModuleSvg('NEXUS VAULT', '#EAB308', 'NODE #10', 1),
      ImageManager.generateDefaultModuleSvg('NEXUS VAULT', '#EAB308', 'NODE #10', 2),
      ImageManager.generateDefaultModuleSvg('NEXUS VAULT', '#EAB308', 'NODE #10', 3),
      ImageManager.generateDefaultModuleSvg('NEXUS VAULT', '#EAB308', 'NODE #10', 4),
    ],
  },
  {
    id: 'nexus-revolution',
    name: 'NEXUS REVOLUTION KERNEL',
    version: '3.0.0',
    description: 'Główny motor rewolucji suwerennościowej, rozproszony backend API, most neuronowy Gemini i łącznik Postgres Cloud SQL.',
    entry: 'index.html',
    accent: '#EF4444', // Crimson Red
    status: 'OPERATIONAL',
    node: 'NODE #11',
    category: 'DECENTRALIZATION & KERNEL',
    packageType: 'system',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-REVOLUTION.git',
    dependencies: ['nexus-bella-os', 'nexus-rfc-02-gateway'],
    images: [
      ImageManager.generateDefaultModuleSvg('NEXUS REVOLUTION', '#EF4444', 'NODE #11', 1),
      ImageManager.generateDefaultModuleSvg('NEXUS REVOLUTION', '#EF4444', 'NODE #11', 2),
      ImageManager.generateDefaultModuleSvg('NEXUS REVOLUTION', '#EF4444', 'NODE #11', 3),
      ImageManager.generateDefaultModuleSvg('NEXUS REVOLUTION', '#EF4444', 'NODE #11', 4),
    ],
  },
  {
    id: 'nexus-labs-rd',
    name: 'NEXUS LABS (SOVEREIGN R&D)',
    version: '1.5.0',
    description: 'Kolaboratywny organizm badawczo-rozwojowy (R&D), inkubator nowych technologii, eksperymenty kwantowe i AI.',
    entry: 'index.html',
    accent: '#F97316', // Orange
    status: 'OPERATIONAL',
    node: 'NODE #12',
    category: 'EXPERIMENT & LABS',
    packageType: 'system',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-LABS-Sovereign-R-D-Engine-Collaborative-Organism.git',
    dependencies: ['nexus-dev-hub', 'kaisa-online', 'nexus-constitution-governance'],
    images: [
      ImageManager.generateDefaultModuleSvg('NEXUS LABS R&D', '#F97316', 'NODE #12', 1),
      ImageManager.generateDefaultModuleSvg('NEXUS LABS R&D', '#F97316', 'NODE #12', 2),
      ImageManager.generateDefaultModuleSvg('NEXUS LABS R&D', '#F97316', 'NODE #12', 3),
      ImageManager.generateDefaultModuleSvg('NEXUS LABS R&D', '#F97316', 'NODE #12', 4),
    ],
  },
  {
    id: 'nexus-ai-sdk-flask',
    name: 'NEXUS AI INFERENCE (FLASK & SDK)',
    version: '1.1.0',
    description: 'Zewnętrzny silnik inferencji AI oparty o Flask i AI-SDK, bramka konektorów do modeli LLM oraz wektoryzacja promptów.',
    entry: 'index.html',
    accent: '#8B5CF6', // Violet
    status: 'OPERATIONAL',
    node: 'NODE #13',
    category: 'AI & NEURAL',
    packageType: 'system',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/ai-sdk-with-flask.git',
    dependencies: ['nexus-bella-os', 'neural-link-middleware'],
    images: [
      ImageManager.generateDefaultModuleSvg('AI INFERENCE FLASK', '#8B5CF6', 'NODE #13', 1),
      ImageManager.generateDefaultModuleSvg('AI INFERENCE FLASK', '#8B5CF6', 'NODE #13', 2),
      ImageManager.generateDefaultModuleSvg('AI INFERENCE FLASK', '#8B5CF6', 'NODE #13', 3),
      ImageManager.generateDefaultModuleSvg('AI INFERENCE FLASK', '#8B5CF6', 'NODE #13', 4),
    ],
  },
  {
    id: 'nexus-rfc-02-gateway',
    name: 'NEXUS RFC-02 PROTOCOL GATEWAY',
    version: '1.2.0',
    description: 'Standard protokołu synchronizacji międzyprojektowej RFC-02, rozproszona magistrala danych i brama komunikacji P2P.',
    entry: 'index.html',
    accent: '#06B6D4', // Electric Cyan
    status: 'OPERATIONAL',
    node: 'NODE #14',
    category: 'NETWORKING & PROTOCOLS',
    packageType: 'system',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-RFC-02-Inter-Project-Synchronization-Protocol-Gateway.git',
    dependencies: ['nexus-bella-os', 'nexus-family', 'kaisa-online'],
    images: [
      ImageManager.generateDefaultModuleSvg('RFC-02 GATEWAY', '#06B6D4', 'NODE #14', 1),
      ImageManager.generateDefaultModuleSvg('RFC-02 GATEWAY', '#06B6D4', 'NODE #14', 2),
      ImageManager.generateDefaultModuleSvg('RFC-02 GATEWAY', '#06B6D4', 'NODE #14', 3),
      ImageManager.generateDefaultModuleSvg('RFC-02 GATEWAY', '#06B6D4', 'NODE #14', 4),
    ],
  },
  {
    id: 'nexus-docker-node',
    name: 'NEXUS DOCKER VANILLA RUNNER',
    version: '1.0.0',
    description: 'Czysty kontener wykonawczy Docker w Vanilla JS – lekki runner izolowany do uruchamiania mikro-usług w kontenerach.',
    entry: 'index.html',
    accent: '#0284C7', // Sky Blue
    status: 'OPERATIONAL',
    node: 'NODE #15',
    category: 'DEVELOPER TOOLS',
    packageType: 'system',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/Nexus-Execution-Node-Pure-Vanilla-JS-Docker-.git',
    dependencies: ['nexus-bella-os', 'nexus-dev-hub'],
    images: [
      ImageManager.generateDefaultModuleSvg('DOCKER VANILLA RUNNER', '#0284C7', 'NODE #15', 1),
      ImageManager.generateDefaultModuleSvg('DOCKER VANILLA RUNNER', '#0284C7', 'NODE #15', 2),
      ImageManager.generateDefaultModuleSvg('DOCKER VANILLA RUNNER', '#0284C7', 'NODE #15', 3),
      ImageManager.generateDefaultModuleSvg('DOCKER VANILLA RUNNER', '#0284C7', 'NODE #15', 4),
    ],
  },
  {
    id: 'rodzina-bellas',
    name: 'RODZINA BELLAS SOVEREIGN MESH',
    version: '3.2.0',
    description: 'Centralne repozytorium kolektywu Rodzina Bellas – tożsamości cyfrowe, archiwa rodowe, więzi suwerenne i kroniki.',
    entry: 'index.html',
    accent: '#D946EF', // Fuchsia
    status: 'OPERATIONAL',
    node: 'NODE #16',
    category: 'COMMUNITY & NETWORK',
    packageType: 'system',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/RodzinaBellas-.git',
    dependencies: ['nexus-bella-os', 'nexus-family'],
    images: [
      ImageManager.generateDefaultModuleSvg('RODZINA BELLAS MESH', '#D946EF', 'NODE #16', 1),
      ImageManager.generateDefaultModuleSvg('RODZINA BELLAS MESH', '#D946EF', 'NODE #16', 2),
      ImageManager.generateDefaultModuleSvg('RODZINA BELLAS MESH', '#D946EF', 'NODE #16', 3),
      ImageManager.generateDefaultModuleSvg('RODZINA BELLAS MESH', '#D946EF', 'NODE #16', 4),
    ],
  },
];

export class ModuleRegistry {
  private modules: Map<string, NexusModule> = new Map();
  private initialized: boolean = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    // 1. Load from IndexedDB
    const storedModules = await storage.getAllModules();
    if (storedModules.length > 0) {
      storedModules.forEach((m) => this.modules.set(m.id, m));
      // Auto-synchronize all 16 ecosystem repositories and dependencies into existing storage
      await this.syncEcosystemRepositories();
    } else {
      // Seed all default native NEXUS modules with repoUrls & dependencies
      await this.seedDefaultModules();
    }

    this.initialized = true;
    eventBus.emit('registry:updated', this.getAll());
    eventBus.emit('log', {
      tag: 'REGISTRY',
      message: `${this.modules.size} MODULES LOADED (16 SOVEREIGN REPOSITORIES & DEPENDENCY GRAPH READY)`,
      level: 'info',
    });
  }

  getAll(): NexusModule[] {
    return Array.from(this.modules.values()).sort((a, b) => a.installedAt - b.installedAt);
  }

  get(id: string): NexusModule | undefined {
    return this.modules.get(id);
  }

  /**
   * Returns list of modules that the given module directly depends on.
   */
  getDependencies(moduleId: string): NexusModule[] {
    const mod = this.modules.get(moduleId);
    if (!mod || !mod.dependencies) return [];
    return mod.dependencies
      .map((depId) => this.modules.get(depId))
      .filter((m): m is NexusModule => m !== undefined);
  }

  /**
   * Returns list of modules that depend on the given module.
   */
  getDependents(moduleId: string): NexusModule[] {
    return Array.from(this.modules.values()).filter(
      (m) => m.dependencies && m.dependencies.includes(moduleId)
    );
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
            await syncModuleToCloudSQL(mod, auth.currentUser?.uid);
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
      await syncModuleToCloudSQL(module, auth.currentUser?.uid);
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
      await syncModuleToCloudSQL(mod, auth.currentUser?.uid);
      eventBus.emit('registry:updated', this.getAll());
    }
  }

  async addModuleImage(id: string, imageDataUrl: string): Promise<boolean> {
    const mod = this.modules.get(id);
    if (!mod) return false;

    if (mod.images.length >= 4) {
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

  async resetToDefaults(): Promise<void> {
    this.modules.clear();
    const existing = await storage.getAllModules();
    for (const m of existing) {
      await storage.deleteModule(m.id);
    }
    await this.seedDefaultModules();
    eventBus.emit('registry:updated', this.getAll());
  }

  private async syncEcosystemRepositories(): Promise<void> {
    let t = Date.now();
    for (const ecoMod of SYSTEM_ECOSYSTEM_MODULES) {
      const existing = this.modules.get(ecoMod.id);
      if (!existing) {
        t += 1000;
        const newMod: NexusModule = {
          ...ecoMod,
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
        this.modules.set(newMod.id, newMod);
        await storage.saveModule(newMod);
        // Sync to cloud
        syncModuleToCloudSQL(newMod).catch(() => {});
      } else {
        // Update repo URL, dependencies, node, and category if updated in standard ecosystem
        existing.repoUrl = ecoMod.repoUrl;
        existing.dependencies = ecoMod.dependencies;
        existing.node = ecoMod.node;
        existing.category = ecoMod.category;
        if (!existing.description) existing.description = ecoMod.description;
        await storage.saveModule(existing);
        // Sync to cloud
        syncModuleToCloudSQL(existing).catch(() => {});
      }
    }
  }

  private async seedDefaultModules(): Promise<void> {
    let t = Date.now() - 160000;
    for (const item of SYSTEM_ECOSYSTEM_MODULES) {
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
      // Sync to cloud
      syncModuleToCloudSQL(fullModule).catch(() => {});
    }
  }
}

export const moduleRegistry = new ModuleRegistry();
