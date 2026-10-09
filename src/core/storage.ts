import { NexusModule } from './types';

const DB_NAME = 'NEXUS_DB';
const DB_VERSION = 2;
const STORE_MODULES = 'modules';
const STORE_FILES = 'moduleFiles';
const STORE_IMAGES = 'moduleImages';
const STORE_SETTINGS = 'settings';

class NexusStorage {
  private dbPromise: Promise<IDBDatabase | null>;
  private memoryModules: Map<string, NexusModule> = new Map();
  private memoryFiles: Map<string, Record<string, string>> = new Map();
  private memoryBlobs: Map<string, Blob> = new Map();

  constructor() {
    this.dbPromise = this.initDB();
  }

  private initDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
      return Promise.resolve(null);
    }
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: any) => {
          const db = event.target.result as IDBDatabase;
          if (!db.objectStoreNames.contains(STORE_MODULES)) {
            db.createObjectStore(STORE_MODULES, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORE_FILES)) {
            db.createObjectStore(STORE_FILES, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORE_IMAGES)) {
            db.createObjectStore(STORE_IMAGES, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
            db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          console.warn('[NEXUS STORAGE] IndexedDB open failed, using memory fallback.');
          resolve(null);
        };
      } catch (e) {
        console.warn('[NEXUS STORAGE] IndexedDB exception, using memory fallback.', e);
        resolve(null);
      }
    });
  }

  async getAllModules(): Promise<NexusModule[]> {
    try {
      const db = await this.dbPromise;
      if (!db) {
        return Array.from(this.memoryModules.values());
      }
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_MODULES, 'readonly');
          const store = tx.objectStore(STORE_MODULES);
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve(Array.from(this.memoryModules.values()));
        } catch {
          resolve(Array.from(this.memoryModules.values()));
        }
      });
    } catch {
      return Array.from(this.memoryModules.values());
    }
  }

  async saveModule(module: NexusModule): Promise<void> {
    this.memoryModules.set(module.id, module);
    if (module.files) {
      this.memoryFiles.set(module.id, module.files);
    }
    try {
      const db = await this.dbPromise;
      if (!db) return;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction([STORE_MODULES, STORE_FILES, STORE_IMAGES], 'readwrite');
          tx.objectStore(STORE_MODULES).put(module);
          if (module.files) {
            tx.objectStore(STORE_FILES).put({ id: module.id, files: module.files });
          }
          if (module.images) {
            tx.objectStore(STORE_IMAGES).put({ id: module.id, images: module.images });
          }
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    } catch {
      // Memory fallback saved
    }
  }

  async deleteModule(id: string): Promise<void> {
    this.memoryModules.delete(id);
    this.memoryFiles.delete(id);
    this.memoryBlobs.delete(id);
    try {
      const db = await this.dbPromise;
      if (!db) return;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction([STORE_MODULES, STORE_FILES, STORE_IMAGES], 'readwrite');
          tx.objectStore(STORE_MODULES).delete(id);
          tx.objectStore(STORE_FILES).delete(id);
          tx.objectStore(STORE_IMAGES).delete(id);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    } catch {
      // Memory fallback deleted
    }
  }

  async getModuleFiles(id: string): Promise<Record<string, string> | null> {
    if (this.memoryFiles.has(id)) {
      return this.memoryFiles.get(id) || null;
    }
    try {
      const db = await this.dbPromise;
      if (!db) return null;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_FILES, 'readonly');
          const req = tx.objectStore(STORE_FILES).get(id);
          req.onsuccess = () => resolve(req.result ? req.result.files : null);
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    } catch {
      return null;
    }
  }

  async savePackageBlob(id: string, blob: Blob): Promise<void> {
    this.memoryBlobs.set(id, blob);
    try {
      const db = await this.dbPromise;
      if (!db) return;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_FILES, 'readwrite');
          const store = tx.objectStore(STORE_FILES);
          store.put({ id: `${id}_raw_blob`, blob, savedAt: Date.now() });
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    } catch {
      // Memory fallback saved
    }
  }

  async getPackageBlob(id: string): Promise<Blob | null> {
    if (this.memoryBlobs.has(id)) {
      return this.memoryBlobs.get(id) || null;
    }
    try {
      const db = await this.dbPromise;
      if (!db) return null;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_FILES, 'readonly');
          const req = tx.objectStore(STORE_FILES).get(`${id}_raw_blob`);
          req.onsuccess = () => resolve(req.result ? req.result.blob : null);
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    } catch {
      return null;
    }
  }

  // Settings storage
  getPref<T>(key: string, defaultValue: T): T {
    try {
      const v = localStorage.getItem(`nexus_pref_${key}`);
      return v ? JSON.parse(v) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  setPref<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`nexus_pref_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('Could not set localStorage preference', e);
    }
  }
}

export const storage = new NexusStorage();
