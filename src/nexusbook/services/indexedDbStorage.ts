/**
 * IndexedDB local storage engine for Nexus Author Asset Library
 * Guarantees local-first, privacy-preserving persistence without cloud dependency.
 */

import { AssetRegistryRecord, AssetCollection, AssetUsageReference, AssetAuditLog } from '../types/assetLibrary';
import { nexusLogger } from './loggerService';

const DB_NAME = 'NexusAuthorAssetLibraryDB';
const DB_VERSION = 1;

const STORES = {
  ASSETS: 'assets_registry',
  COLLECTIONS: 'asset_collections',
  USAGES: 'asset_usages',
  AUDIT: 'asset_audit_logs'
} as const;

class IndexedDbStorage {
  private db: IDBDatabase | null = null;
  private isInit = false;

  private async open(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject(new Error('IndexedDB not supported'));
      }

      const req = window.indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;

        // Store 1: Asset Registry Records
        if (!db.objectStoreNames.contains(STORES.ASSETS)) {
          const assetStore = db.createObjectStore(STORES.ASSETS, { keyPath: 'assetId' });
          assetStore.createIndex('sha256', 'sha256', { unique: false });
          assetStore.createIndex('ownerId', 'ownerId', { unique: false });
          assetStore.createIndex('status', 'status', { unique: false });
          assetStore.createIndex('nftStatus', 'nftStatus', { unique: false });
        }

        // Store 2: Collections
        if (!db.objectStoreNames.contains(STORES.COLLECTIONS)) {
          db.createObjectStore(STORES.COLLECTIONS, { keyPath: 'id' });
        }

        // Store 3: Usages
        if (!db.objectStoreNames.contains(STORES.USAGES)) {
          const usageStore = db.createObjectStore(STORES.USAGES, { keyPath: 'id' });
          usageStore.createIndex('assetId', 'assetId', { unique: false });
          usageStore.createIndex('targetId', 'targetId', { unique: false });
        }

        // Store 4: Audit Logs
        if (!db.objectStoreNames.contains(STORES.AUDIT)) {
          const auditStore = db.createObjectStore(STORES.AUDIT, { keyPath: 'id' });
          auditStore.createIndex('timestamp', 'timestamp', { unique: false });
          auditStore.createIndex('assetId', 'assetId', { unique: false });
        }
      };

      req.onsuccess = (e) => {
        this.db = (e.target as IDBOpenDBRequest).result;
        this.isInit = true;
        resolve(this.db);
      };

      req.onerror = () => {
        reject(req.error || new Error('Failed to open IndexedDB'));
      };
    });
  }

  // --- ASSETS ---

  async saveAsset(asset: AssetRegistryRecord): Promise<void> {
    try {
      const db = await this.open();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORES.ASSETS, 'readwrite');
        const store = tx.objectStore(STORES.ASSETS);
        const req = store.put(asset);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // Fallback: localStorage metadata only
      this.saveAssetFallback(asset);
    }
  }

  async getAsset(assetId: string): Promise<AssetRegistryRecord | null> {
    try {
      const db = await this.open();
      return new Promise<AssetRegistryRecord | null>((resolve, reject) => {
        const tx = db.transaction(STORES.ASSETS, 'readonly');
        const store = tx.objectStore(STORES.ASSETS);
        const req = store.get(assetId);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return this.getAssetFallback(assetId);
    }
  }

  async findAssetBySha256(sha256: string): Promise<AssetRegistryRecord | null> {
    try {
      const db = await this.open();
      return new Promise<AssetRegistryRecord | null>((resolve, reject) => {
        const tx = db.transaction(STORES.ASSETS, 'readonly');
        const store = tx.objectStore(STORES.ASSETS);
        const index = store.index('sha256');
        const req = index.get(sha256);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      const all = this.getAllAssetsFallback();
      return all.find(a => a.sha256 === sha256) || null;
    }
  }

  async getAllAssets(): Promise<AssetRegistryRecord[]> {
    try {
      const db = await this.open();
      return new Promise<AssetRegistryRecord[]>((resolve, reject) => {
        const tx = db.transaction(STORES.ASSETS, 'readonly');
        const store = tx.objectStore(STORES.ASSETS);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return this.getAllAssetsFallback();
    }
  }

  async deleteAsset(assetId: string): Promise<void> {
    try {
      const db = await this.open();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORES.ASSETS, 'readwrite');
        const store = tx.objectStore(STORES.ASSETS);
        const req = store.delete(assetId);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      this.deleteAssetFallback(assetId);
    }
  }

  // --- USAGES ---

  async saveUsage(usage: AssetUsageReference): Promise<void> {
    try {
      const db = await this.open();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORES.USAGES, 'readwrite');
        const store = tx.objectStore(STORES.USAGES);
        const req = store.put(usage);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      this.saveUsageFallback(usage);
    }
  }

  async getUsagesForAsset(assetId: string): Promise<AssetUsageReference[]> {
    try {
      const db = await this.open();
      return new Promise<AssetUsageReference[]>((resolve, reject) => {
        const tx = db.transaction(STORES.USAGES, 'readonly');
        const store = tx.objectStore(STORES.USAGES);
        const index = store.index('assetId');
        const req = index.getAll(assetId);
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return this.getAllUsagesFallback().filter(u => u.assetId === assetId);
    }
  }

  async getAllUsages(): Promise<AssetUsageReference[]> {
    try {
      const db = await this.open();
      return new Promise<AssetUsageReference[]>((resolve, reject) => {
        const tx = db.transaction(STORES.USAGES, 'readonly');
        const store = tx.objectStore(STORES.USAGES);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return this.getAllUsagesFallback();
    }
  }

  async removeUsage(usageId: string): Promise<void> {
    try {
      const db = await this.open();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORES.USAGES, 'readwrite');
        const store = tx.objectStore(STORES.USAGES);
        const req = store.delete(usageId);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      this.removeUsageFallback(usageId);
    }
  }

  // --- COLLECTIONS ---

  async saveCollection(col: AssetCollection): Promise<void> {
    try {
      const db = await this.open();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORES.COLLECTIONS, 'readwrite');
        const store = tx.objectStore(STORES.COLLECTIONS);
        const req = store.put(col);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      this.saveCollectionFallback(col);
    }
  }

  async getAllCollections(): Promise<AssetCollection[]> {
    try {
      const db = await this.open();
      return new Promise<AssetCollection[]>((resolve, reject) => {
        const tx = db.transaction(STORES.COLLECTIONS, 'readonly');
        const store = tx.objectStore(STORES.COLLECTIONS);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return this.getAllCollectionsFallback();
    }
  }

  // --- AUDIT LOGS ---

  async saveAuditLog(log: AssetAuditLog): Promise<void> {
    try {
      const db = await this.open();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORES.AUDIT, 'readwrite');
        const store = tx.objectStore(STORES.AUDIT);
        const req = store.put(log);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      this.saveAuditLogFallback(log);
    }
  }

  async getAllAuditLogs(): Promise<AssetAuditLog[]> {
    try {
      const db = await this.open();
      return new Promise<AssetAuditLog[]>((resolve, reject) => {
        const tx = db.transaction(STORES.AUDIT, 'readonly');
        const store = tx.objectStore(STORES.AUDIT);
        const req = store.getAll();
        req.onsuccess = () => resolve((req.result || []).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        req.onerror = () => reject(req.error);
      });
    } catch {
      return this.getAllAuditLogsFallback();
    }
  }

  // --- LOCALSTORAGE FALLBACK IMPLEMENTATION ---

  private saveAssetFallback(asset: AssetRegistryRecord) {
    try {
      const all = this.getAllAssetsFallback();
      const idx = all.findIndex(a => a.assetId === asset.assetId);
      if (idx >= 0) all[idx] = asset;
      else all.unshift(asset);
      localStorage.setItem('nexus_author_assets', JSON.stringify(all));
    } catch (e) {
      console.warn('Fallback storage warning:', e);
    }
  }

  private getAssetFallback(assetId: string): AssetRegistryRecord | null {
    return this.getAllAssetsFallback().find(a => a.assetId === assetId) || null;
  }

  private getAllAssetsFallback(): AssetRegistryRecord[] {
    try {
      const data = localStorage.getItem('nexus_author_assets');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private deleteAssetFallback(assetId: string) {
    try {
      const all = this.getAllAssetsFallback().filter(a => a.assetId !== assetId);
      localStorage.setItem('nexus_author_assets', JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  }

  private saveUsageFallback(usage: AssetUsageReference) {
    try {
      const all = this.getAllUsagesFallback();
      const idx = all.findIndex(u => u.id === usage.id);
      if (idx >= 0) all[idx] = usage;
      else all.push(usage);
      localStorage.setItem('nexus_author_asset_usages', JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  }

  private getAllUsagesFallback(): AssetUsageReference[] {
    try {
      const data = localStorage.getItem('nexus_author_asset_usages');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private removeUsageFallback(usageId: string) {
    try {
      const all = this.getAllUsagesFallback().filter(u => u.id !== usageId);
      localStorage.setItem('nexus_author_asset_usages', JSON.stringify(all));
    } catch (e) {
      nexusLogger.error('STORAGE', 'IndexedDbStorage', 'Błąd usuwania użycia zasobu z localStorage fallback', e);
    }
  }

  private saveCollectionFallback(col: AssetCollection) {
    try {
      const all = this.getAllCollectionsFallback();
      const idx = all.findIndex(c => c.id === col.id);
      if (idx >= 0) all[idx] = col;
      else all.push(col);
      localStorage.setItem('nexus_author_asset_collections', JSON.stringify(all));
    } catch (e) {
      nexusLogger.error('STORAGE', 'IndexedDbStorage', 'Błąd zapisu kolekcji do localStorage fallback', e);
    }
  }

  private getAllCollectionsFallback(): AssetCollection[] {
    try {
      const data = localStorage.getItem('nexus_author_asset_collections');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveAuditLogFallback(log: AssetAuditLog) {
    try {
      const all = this.getAllAuditLogsFallback();
      all.unshift(log);
      localStorage.setItem('nexus_author_asset_audit', JSON.stringify(all.slice(0, 200)));
    } catch (e) {
      nexusLogger.error('STORAGE', 'IndexedDbStorage', 'Błąd zapisu logu audytu do localStorage fallback', e);
    }
  }

  private getAllAuditLogsFallback(): AssetAuditLog[] {
    try {
      const data = localStorage.getItem('nexus_author_asset_audit');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}

export const assetStorage = new IndexedDbStorage();
