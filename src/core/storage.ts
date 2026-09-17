import { NexusModule } from './types';

const DB_NAME = 'NEXUS_DB';
const DB_VERSION = 2;
const STORE_MODULES = 'modules';
const STORE_FILES = 'moduleFiles';
const STORE_IMAGES = 'moduleImages';
const STORE_SETTINGS = 'settings';

class NexusStorage {
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
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
      request.onerror = () => reject(request.error);
    });
  }

  async getAllModules(): Promise<NexusModule[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_MODULES, 'readonly');
      const store = tx.objectStore(STORE_MODULES);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async saveModule(module: NexusModule): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_MODULES, STORE_FILES, STORE_IMAGES], 'readwrite');
      
      // 1. Store module record
      tx.objectStore(STORE_MODULES).put(module);

      // 2. Store file contents separately if present
      if (module.files) {
        tx.objectStore(STORE_FILES).put({ id: module.id, files: module.files });
      }

      // 3. Store images
      if (module.images) {
        tx.objectStore(STORE_IMAGES).put({ id: module.id, images: module.images });
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async deleteModule(id: string): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_MODULES, STORE_FILES, STORE_IMAGES], 'readwrite');
      tx.objectStore(STORE_MODULES).delete(id);
      tx.objectStore(STORE_FILES).delete(id);
      tx.objectStore(STORE_IMAGES).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getModuleFiles(id: string): Promise<Record<string, string> | null> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_FILES, 'readonly');
      const req = tx.objectStore(STORE_FILES).get(id);
      req.onsuccess = () => resolve(req.result ? req.result.files : null);
      req.onerror = () => reject(req.error);
    });
  }

  async savePackageBlob(id: string, blob: Blob): Promise<void> {
    // Packaged binary raw storage
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_FILES, 'readwrite');
      const store = tx.objectStore(STORE_FILES);
      store.put({ id: `${id}_raw_blob`, blob, savedAt: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getPackageBlob(id: string): Promise<Blob | null> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_FILES, 'readonly');
      const req = tx.objectStore(STORE_FILES).get(`${id}_raw_blob`);
      req.onsuccess = () => resolve(req.result ? req.result.blob : null);
      req.onerror = () => reject(req.error);
    });
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
