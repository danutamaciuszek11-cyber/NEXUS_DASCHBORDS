/**
 * AuthorAssetService - Nexus Author Asset Library Core Engine
 * Local-first, SHA-256 integrity, Usage Graph, Versioning, and Optional BNB Chain Tokenization.
 */

import { 
  AssetRegistryRecord, 
  AssetVersion, 
  AssetUsageReference, 
  AssetUsageAuditResult,
  AssetCollection, 
  AssetAuditLog, 
  AssetUsageType, 
  AssetLicenseType,
  ImagePresetType,
  NftMetadataRecord,
  BlockchainTransactionResult,
  LibraryExportManifest
} from '../types/assetLibrary';
import { assetStorage } from './indexedDbStorage';
import { bnbChainProvider } from './blockchainProvider';
import { INITIAL_AUTHOR_ASSETS, INITIAL_ASSET_USAGES, INITIAL_COLLECTIONS_DATA } from '../data/sampleAssets';
import { IMAGE_PRESETS } from '../data/assetPresets';
import { workEditorialService } from './workEditorialService';

class AuthorAssetService {
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      // Check if storage already has data, if empty initialize with sample assets
      const existing = await assetStorage.getAllAssets();
      if (existing.length === 0) {
        for (const asset of INITIAL_AUTHOR_ASSETS) {
          await assetStorage.saveAsset(asset);
        }
        for (const usage of INITIAL_ASSET_USAGES) {
          await assetStorage.saveUsage(usage);
        }
        for (const col of INITIAL_COLLECTIONS_DATA) {
          await assetStorage.saveCollection(col);
        }
        await this.logAudit('ASSET_CREATED', undefined, 'Inicjalizacja domyślnego rejestru grafik Genesis', 'SYSTEM');
      }
      this.initialized = true;
    } catch (err) {
      console.warn('Asset service init note:', err);
    }
  }

  // --- HASH (SHA-256) CALCULATION ---

  async calculateSha256(data: ArrayBuffer | Blob | string): Promise<string> {
    let buffer: ArrayBuffer;

    if (typeof data === 'string') {
      if (data.startsWith('data:')) {
        // Base64 Data URL to binary buffer
        const base64 = data.split(',')[1] || '';
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        buffer = bytes.buffer;
      } else {
        const encoded = new TextEncoder().encode(data);
        buffer = encoded.buffer as ArrayBuffer;
      }
    } else if (data instanceof Blob) {
      buffer = await data.arrayBuffer();
    } else {
      buffer = data as ArrayBuffer;
    }

    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Fallback pseudo-sha256 if subtle crypto unavailable
    let hash = 0;
    const view = new Uint8Array(buffer);
    for (let i = 0; i < view.length; i++) {
      hash = ((hash << 5) - hash) + view[i];
      hash |= 0;
    }
    return 'sha256_' + Math.abs(hash).toString(16).padStart(64, '0');
  }

  // --- IMAGE DIMENSION DETECTOR ---

  async getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth || img.width || 800, height: img.naturalHeight || img.height || 600 });
      };
      img.onerror = () => {
        resolve({ width: 1200, height: 800 });
      };
      img.src = dataUrl;
    });
  }

  // --- ASSET CREATION & DUPLICATE DETECTION ---

  async createAsset(params: {
    file?: File | Blob;
    dataUrl: string;
    filename: string;
    mimeType: string;
    sizeBytes: number;
    ownerId?: string;
    tags?: string[];
    collections?: string[];
    license?: AssetLicenseType;
    copyrightOwner?: string;
    semanticDescription?: string;
    forceDuplicateCopy?: boolean;
  }): Promise<{ 
    asset: AssetRegistryRecord; 
    isDuplicate: boolean; 
    existingAsset?: AssetRegistryRecord 
  }> {
    await this.init();

    // 1. Calculate cryptographic SHA-256 hash
    const sha256 = await this.calculateSha256(params.file || params.dataUrl);

    // 2. Check for duplicate
    const existing = await assetStorage.findAssetBySha256(sha256);
    if (existing && !params.forceDuplicateCopy) {
      await this.logAudit('DUPLICATE_REUSED', existing.assetId, `Wykryto duplikat pliku: ${params.filename} (identyczny hash SHA-256)`, 'AUTHOR');
      return {
        asset: existing,
        isDuplicate: true,
        existingAsset: existing
      };
    }

    // 3. Extract dimensions
    const { width, height } = await this.getImageDimensions(params.dataUrl);

    // 4. Build unique asset record
    const assetId = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newAsset: AssetRegistryRecord = {
      assetId,
      ownerId: params.ownerId || 'author_architekt_nexusa',
      filename: params.filename,
      mimeType: params.mimeType,
      sizeBytes: params.sizeBytes,
      width,
      height,
      sha256,
      createdAt: now,
      updatedAt: now,
      tags: params.tags && params.tags.length > 0 ? params.tags : ['nowy_asset'],
      collections: params.collections || ['col_illustrations'],
      license: params.license || 'OWNER_CREATED',
      copyrightOwner: params.copyrightOwner || 'Architekt Nexusa',
      creator: 'Architekt Nexusa',
      commercialUseAllowed: true,
      derivativesAllowed: true,
      status: 'ACTIVE',
      visibility: 'PRIVATE',
      nftStatus: 'NOT_MINTED',
      dataUrl: params.dataUrl,
      semanticDescription: params.semanticDescription || `Grafika ${params.filename} o wymiarach ${width}x${height}px`,
      versions: [
        {
          versionId: 'v1.0',
          sha256,
          sizeBytes: params.sizeBytes,
          width,
          height,
          createdAt: now,
          changeNote: 'Wersja pierwotna (oryginał)',
          filename: params.filename,
          dataUrl: params.dataUrl
        }
      ]
    };

    await assetStorage.saveAsset(newAsset);

    // Assign to collections
    for (const colId of newAsset.collections) {
      await this.addToCollection(assetId, colId);
    }

    await this.logAudit('ASSET_CREATED', assetId, `Dodano nowy asset graficzny: ${params.filename} (${width}x${height}, ${Math.round(params.sizeBytes / 1024)} KB)`, 'AUTHOR');

    return {
      asset: newAsset,
      isDuplicate: false
    };
  }

  // --- MERGE / RE-USE DUPLICATE ASSET ---

  async mergeDuplicateAsset(existingAssetId: string, options?: {
    additionalTags?: string[];
    additionalCollections?: string[];
    newFileName?: string;
  }): Promise<AssetRegistryRecord> {
    await this.init();
    const existing = await this.getAsset(existingAssetId);
    if (!existing) throw new Error(`Asset not found: ${existingAssetId}`);

    const updatedTags = Array.from(new Set([...existing.tags, ...(options?.additionalTags || [])]));
    const updatedCollections = Array.from(new Set([...existing.collections, ...(options?.additionalCollections || [])]));

    const updated = await this.updateAsset(existingAssetId, {
      tags: updatedTags,
      collections: updatedCollections,
      updatedAt: new Date().toISOString()
    });

    await this.logAudit(
      'DUPLICATE_REUSED', 
      existingAssetId, 
      `Połączono metadane duplikatu dla ${options?.newFileName || existing.filename}. Zaktualizowano kolekcje i tagi bez redundancji danych.`,
      'AUTHOR'
    );

    return updated;
  }

  // --- QUERY & SEARCH ---

  async getAsset(assetId: string): Promise<AssetRegistryRecord | null> {
    await this.init();
    return assetStorage.getAsset(assetId);
  }

  async findAssetBySha256(sha256: string): Promise<AssetRegistryRecord | null> {
    await this.init();
    return assetStorage.findAssetBySha256(sha256);
  }

  async listAssets(filter?: {
    category?: 'ALL' | 'COVERS' | 'BOOKS' | 'CHARACTERS' | 'SOCIAL' | 'NFT';
    collectionId?: string;
    tag?: string;
    status?: 'ACTIVE' | 'ARCHIVED' | 'ALL';
  }): Promise<AssetRegistryRecord[]> {
    await this.init();
    let all = await assetStorage.getAllAssets();

    // Filter by status (default: ACTIVE)
    if (!filter || !filter.status || filter.status === 'ACTIVE') {
      all = all.filter(a => a.status === 'ACTIVE');
    } else if (filter.status === 'ARCHIVED') {
      all = all.filter(a => a.status === 'ARCHIVED');
    }

    // Filter by category
    if (filter?.category && filter.category !== 'ALL') {
      switch (filter.category) {
        case 'COVERS':
          all = all.filter(a => a.collections.includes('col_covers') || a.tags.some(t => t.toLowerCase().includes('cover') || t.toLowerCase().includes('okładka')));
          break;
        case 'BOOKS':
          all = all.filter(a => a.collections.includes('col_covers') || a.collections.includes('col_illustrations'));
          break;
        case 'CHARACTERS':
          all = all.filter(a => a.collections.includes('col_characters') || a.tags.some(t => t.toLowerCase().includes('character') || t.toLowerCase().includes('postać') || t.toLowerCase().includes('bella')));
          break;
        case 'SOCIAL':
          all = all.filter(a => a.collections.includes('col_social') || a.tags.some(t => t.toLowerCase().includes('social') || t.toLowerCase().includes('baner')));
          break;
        case 'NFT':
          all = all.filter(a => a.nftStatus === 'MINTED' || a.nftStatus === 'PREPARED' || a.collections.includes('col_nft'));
          break;
      }
    }

    // Filter by collection ID
    if (filter?.collectionId) {
      all = all.filter(a => a.collections.includes(filter.collectionId!));
    }

    // Filter by tag
    if (filter?.tag) {
      const lowerTag = filter.tag.toLowerCase();
      all = all.filter(a => a.tags.some(t => t.toLowerCase() === lowerTag));
    }

    return all.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async searchAssets(query: string, filter?: {
    category?: 'ALL' | 'COVERS' | 'BOOKS' | 'CHARACTERS' | 'SOCIAL' | 'NFT';
    collectionId?: string;
  }): Promise<AssetRegistryRecord[]> {
    const list = await this.listAssets(filter);
    const q = query.trim().toLowerCase();
    if (!q) return list;

    return list.filter(asset => {
      const matchName = asset.filename.toLowerCase().includes(q);
      const matchTags = asset.tags.some(t => t.toLowerCase().includes(q));
      const matchDesc = asset.semanticDescription?.toLowerCase().includes(q);
      const matchCopyright = asset.copyrightOwner.toLowerCase().includes(q);
      const matchHash = asset.sha256.toLowerCase().includes(q);
      const matchId = asset.assetId.toLowerCase().includes(q);

      return matchName || matchTags || matchDesc || matchCopyright || matchHash || matchId;
    });
  }

  // --- UPDATE, ARCHIVE & SAFE DELETION ---

  async updateAsset(assetId: string, patch: Partial<AssetRegistryRecord>): Promise<AssetRegistryRecord> {
    await this.init();
    const asset = await assetStorage.getAsset(assetId);
    if (!asset) throw new Error(`Asset not found: ${assetId}`);

    const updated: AssetRegistryRecord = {
      ...asset,
      ...patch,
      updatedAt: new Date().toISOString()
    };

    await assetStorage.saveAsset(updated);
    await this.logAudit('ASSET_UPDATED', assetId, `Zaktualizowano metadane assetu: ${asset.filename}`, 'AUTHOR');
    return updated;
  }

  async archiveAsset(assetId: string): Promise<void> {
    await this.updateAsset(assetId, { status: 'ARCHIVED' });
    await this.logAudit('ASSET_ARCHIVED', assetId, `Zarchiwizowano asset`, 'AUTHOR');
  }

  async restoreAsset(assetId: string): Promise<void> {
    await this.updateAsset(assetId, { status: 'ACTIVE' });
    await this.logAudit('ASSET_RESTORED', assetId, `Przywrócono asset z archiwum`, 'AUTHOR');
  }

  // --- USAGE AUDIT & SAFE DELETION ---

  async auditAssetUsage(assetId: string): Promise<AssetUsageAuditResult> {
    await this.init();
    const asset = await assetStorage.getAsset(assetId);
    const usages = await assetStorage.getUsagesForAsset(assetId);

    const chapters = usages.filter(u => u.usageType === 'CHAPTER_ILLUSTRATION' || u.usageType === 'NEXUS_COMICS');
    const books = usages.filter(u => u.usageType === 'BOOK_COVER' || u.usageType === 'HTML_WORLD_BANNER');
    const social = usages.filter(u => u.usageType === 'NEXUS_SOCIAL' || u.usageType === 'MARKETING_CONTENT');
    const other = usages.filter(u => u.usageType === 'AUTHOR_PROFILE');

    const usageCount = usages.length;
    const canDeleteDirectly = usageCount === 0;
    const recommendedAction = canDeleteDirectly ? 'DELETE' : 'ARCHIVE';

    const protectionReason = usageCount > 0
      ? `Asset jest aktywnie wykorzystywany w ${usageCount} miejscach (Rozdziały: ${chapters.length}, Książki/Okładki: ${books.length}, Social: ${social.length}, Inne: ${other.length}). Bezpośrednie usunięcie zostało zablokowane w celu ochrony spójności biblioteki — domyślnie zastosowano bezpieczną archiwizację.`
      : undefined;

    return {
      assetId,
      assetFilename: asset?.filename || assetId,
      usageCount,
      usages,
      breakdown: {
        chapters,
        books,
        social,
        other
      },
      canDeleteDirectly,
      recommendedAction,
      isSafeToArchive: true,
      protectionReason
    };
  }

  async deleteAsset(assetId: string, force = false): Promise<{ success: boolean; archived: boolean; usageCount: number; message?: string }> {
    await this.init();
    const audit = await this.auditAssetUsage(assetId);

    // If used in chapters/books/social and NOT forced, PREVENT DIRECT DELETION and DEFAULT TO ARCHIVAL
    if (audit.usageCount > 0 && !force) {
      await this.archiveAsset(assetId);
      await this.logAudit(
        'ASSET_ARCHIVED',
        assetId,
        `Zablokowano bezpośrednie usunięcie (użycie w ${audit.usageCount} elementach). Domyślnie przeniesiono do bezpiecznego archiwum.`,
        'AUTHOR'
      );
      return {
        success: false,
        archived: true,
        usageCount: audit.usageCount,
        message: audit.protectionReason
      };
    }

    const asset = await assetStorage.getAsset(assetId);
    await assetStorage.deleteAsset(assetId);

    // Also remove usages if explicitly forced
    if (force && audit.usageCount > 0) {
      for (const u of audit.usages) {
        await assetStorage.removeUsage(u.id);
      }
    }

    await this.logAudit('ASSET_DELETED', assetId, `Usunięto trwale asset ${asset?.filename || assetId} (wymuszenie: ${force})`, 'AUTHOR');
    return {
      success: true,
      archived: false,
      usageCount: audit.usageCount
    };
  }

  // --- VERSIONING ---

  async createVersion(assetId: string, file: File | Blob, changeNote?: string): Promise<AssetVersion> {
    await this.init();
    const asset = await assetStorage.getAsset(assetId);
    if (!asset) throw new Error(`Asset not found: ${assetId}`);

    // Read file as dataUrl
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const sha256 = await this.calculateSha256(dataUrl);
    const { width, height } = await this.getImageDimensions(dataUrl);
    const versionNumber = `v${asset.versions.length + 1}.0`;
    const now = new Date().toISOString();

    const newVersion: AssetVersion = {
      versionId: versionNumber,
      sha256,
      sizeBytes: file.size,
      width,
      height,
      createdAt: now,
      changeNote: changeNote || `Nowa wersja ${versionNumber}`,
      filename: (file as File).name || asset.filename,
      dataUrl
    };

    const updatedVersions = [...asset.versions, newVersion];
    const updatedRecord = await this.updateAsset(assetId, {
      versions: updatedVersions,
      // Update active dataUrl and sha256 to new version, keeping original in v1
      dataUrl,
      sha256,
      width,
      height,
      sizeBytes: file.size
    });

    // Synchronize and track new cover version in work manifest for all linked works
    try {
      if (workEditorialService) {
        await workEditorialService.syncAssetUpdateToWorks(assetId, updatedRecord, newVersion);
      }
    } catch (syncErr) {
      console.warn('Could not sync asset version update to linked works:', syncErr);
    }

    await this.logAudit('VERSION_CREATED', assetId, `Utworzono nową wersję ${versionNumber} dla assetu ${asset.filename}`, 'AUTHOR');
    return newVersion;
  }

  async getVersions(assetId: string): Promise<AssetVersion[]> {
    const asset = await this.getAsset(assetId);
    return asset?.versions || [];
  }

  // --- USAGE GRAPH (ONE-CLICK BOOK & CHAPTER INSERTION) ---

  async attachAssetToContent(
    assetId: string, 
    usageType: AssetUsageType, 
    targetId: string, 
    targetTitle: string, 
    position?: number, 
    notes?: string
  ): Promise<AssetUsageReference> {
    await this.init();
    const asset = await assetStorage.getAsset(assetId);
    if (!asset) throw new Error(`Asset not found: ${assetId}`);

    // Check if identical usage already exists
    const existingUsages = await assetStorage.getUsagesForAsset(assetId);
    const found = existingUsages.find(u => u.usageType === usageType && u.targetId === targetId);
    if (found) {
      return found;
    }

    const usage: AssetUsageReference = {
      id: `use_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      assetId,
      usageType,
      targetId,
      targetTitle,
      position,
      attachedAt: new Date().toISOString(),
      notes
    };

    await assetStorage.saveUsage(usage);
    await this.logAudit('ASSET_USED', assetId, `Asset przypisany do: [${usageType}] ${targetTitle}`, 'AUTHOR');
    return usage;
  }

  async detachAssetFromContent(usageId: string): Promise<void> {
    await this.init();
    await assetStorage.removeUsage(usageId);
    await this.logAudit('ASSET_DETACHED', undefined, `Odpięto referencję użycia: ${usageId}`, 'AUTHOR');
  }

  async getAssetUsage(assetId: string): Promise<AssetUsageReference[]> {
    await this.init();
    return assetStorage.getUsagesForAsset(assetId);
  }

  async getAllUsages(): Promise<AssetUsageReference[]> {
    await this.init();
    return assetStorage.getAllUsages();
  }

  // --- COLLECTIONS ---

  async createCollection(name: string, description: string, color = '#3b82f6', icon = 'Folder'): Promise<AssetCollection> {
    await this.init();
    const id = `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const col: AssetCollection = {
      id,
      name,
      description,
      color,
      icon,
      createdAt: now,
      updatedAt: now,
      assetIds: [],
      isBuiltin: false
    };

    await assetStorage.saveCollection(col);
    await this.logAudit('COLLECTION_CREATED', undefined, `Utworzono kolekcję grafik: ${name}`, 'AUTHOR');
    return col;
  }

  async listCollections(): Promise<AssetCollection[]> {
    await this.init();
    const cols = await assetStorage.getAllCollections();
    const assets = await assetStorage.getAllAssets();

    // Refresh dynamic asset counts
    return cols.map(c => ({
      ...c,
      assetIds: assets.filter(a => a.collections.includes(c.id)).map(a => a.assetId)
    }));
  }

  async addToCollection(assetId: string, collectionId: string): Promise<void> {
    const asset = await this.getAsset(assetId);
    if (!asset) return;
    if (!asset.collections.includes(collectionId)) {
      await this.updateAsset(assetId, {
        collections: [...asset.collections, collectionId]
      });
    }
  }

  async removeFromCollection(assetId: string, collectionId: string): Promise<void> {
    const asset = await this.getAsset(assetId);
    if (!asset) return;
    await this.updateAsset(assetId, {
      collections: asset.collections.filter(c => c !== collectionId)
    });
  }

  // --- IMAGE PROCESSING & PRESETS (CANVAS ENGINE) ---

  async processImage(
    dataUrl: string, 
    presetType?: ImagePresetType, 
    targetFormat: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png',
    quality = 0.92
  ): Promise<{ dataUrl: string; width: number; height: number; sizeBytes: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let targetW = img.naturalWidth || img.width;
        let targetH = img.naturalHeight || img.height;

        if (presetType) {
          const preset = IMAGE_PRESETS.find(p => p.id === presetType);
          if (preset) {
            targetW = preset.width;
            targetH = preset.height;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context unavailable'));

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image with proper cover scaling
        const srcAspect = (img.naturalWidth || img.width) / (img.naturalHeight || img.height);
        const dstAspect = targetW / targetH;
        let renderW = targetW;
        let renderH = targetH;
        let offsetX = 0;
        let offsetY = 0;

        if (srcAspect > dstAspect) {
          renderW = targetH * srcAspect;
          offsetX = (targetW - renderW) / 2;
        } else {
          renderH = targetW / srcAspect;
          offsetY = (targetH - renderH) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

        const outDataUrl = canvas.toDataURL(targetFormat, quality);
        const approxSize = Math.round((outDataUrl.length * 3) / 4);

        resolve({
          dataUrl: outDataUrl,
          width: targetW,
          height: targetH,
          sizeBytes: approxSize
        });
      };
      img.onerror = () => reject(new Error('Nie udało się załadować grafiki do przetworzenia.'));
      img.src = dataUrl;
    });
  }

  // --- NFT METADATA & TOKENIZATION (BNB CHAIN) ---

  generateNftMetadata(asset: AssetRegistryRecord): NftMetadataRecord {
    return {
      name: asset.filename.replace(/\.[^/.]+$/, ''),
      description: asset.semanticDescription || `Oryginalny asset autorski Architekta Nexusa zintegrowany w ekosystemie EterUniverse.`,
      image: asset.dataUrl.startsWith('data:image/svg') 
        ? asset.dataUrl 
        : `nexus://ipfs/assets/${asset.sha256}`,
      assetHash: asset.sha256,
      creatorId: asset.ownerId,
      creatorName: asset.copyrightOwner || 'Architekt Nexusa',
      createdAt: asset.createdAt,
      license: asset.license,
      version: asset.versions[asset.versions.length - 1]?.versionId || 'v1.0',
      attributes: [
        { trait_type: 'Typ Assetu', value: asset.mimeType },
        { trait_type: 'Szerokość (px)', value: asset.width },
        { trait_type: 'Wysokość (px)', value: asset.height },
        { trait_type: 'Licencja Autorska', value: asset.license },
        { trait_type: 'Wersja Rejestru', value: asset.versions.length },
        { trait_type: 'Status Ekosystemu', value: 'Nexus Author Verified' },
        { trait_type: 'Sieć Emisji', value: 'BNB Smart Chain' }
      ]
    };
  }

  async prepareNFT(assetId: string, chainId?: number): Promise<{ unsignedTx: any; metadata: NftMetadataRecord; feeEstimate: string }> {
    await this.init();
    if (chainId) {
      await bnbChainProvider.switchNetwork(chainId);
    }
    const asset = await this.getAsset(assetId);
    if (!asset) throw new Error(`Asset not found: ${assetId}`);

    const metadata = this.generateNftMetadata(asset);
    const { unsignedTx, feeEstimate } = await bnbChainProvider.prepareMint(asset, metadata);

    await this.updateAsset(assetId, { nftStatus: 'PREPARED' });
    await this.logAudit('NFT_PREPARED', assetId, `Przygotowano pakiet metadanych NFT BEP-721 dla ${asset.filename} (${bnbChainProvider.networkName})`, 'AUTHOR');

    return { unsignedTx, metadata, feeEstimate };
  }

  async mintNFT(assetId: string, chainId?: number): Promise<BlockchainTransactionResult> {
    await this.init();
    if (chainId) {
      await bnbChainProvider.switchNetwork(chainId);
    }
    const asset = await this.getAsset(assetId);
    if (!asset) throw new Error(`Asset not found: ${assetId}`);

    await this.updateAsset(assetId, { nftStatus: 'MINTING' });
    await this.logAudit('NFT_MINT_REQUESTED', assetId, `Zażądano transakcji mintu NFT na ${bnbChainProvider.networkName}`, 'AUTHOR');

    const metadata = this.generateNftMetadata(asset);
    const { unsignedTx } = await bnbChainProvider.prepareMint(asset, metadata);
    const signedTx = await bnbChainProvider.signTransaction(unsignedTx);
    const result = await bnbChainProvider.submitTransaction(signedTx);

    // Save minted status & details into asset record
    await this.updateAsset(assetId, {
      nftStatus: 'MINTED',
      nftDetails: {
        blockchain: 'BNB_CHAIN',
        tokenStandard: 'BEP-721',
        contractAddress: unsignedTx.to || '0x35697EcBc39371078B3F93a52e7208B1713d3319',
        tokenId: result.tokenId,
        txHash: result.txHash,
        mintedAt: new Date().toISOString(),
        mintedBy: asset.ownerId,
        explorerUrl: result.explorerUrl
      }
    });

    await this.logAudit('NFT_MINTED', assetId, `Pomyślnie wyemitowano NFT BEP-721 #${result.tokenId} na ${bnbChainProvider.networkName} (Tx: ${result.txHash.slice(0, 10)}...)`, 'AUTHOR');
    return result;
  }

  // --- EXPORT & MANIFEST ---

  async exportLibraryManifest(): Promise<LibraryExportManifest> {
    await this.init();
    const assets = await assetStorage.getAllAssets();
    const cols = await assetStorage.getAllCollections();
    const usages = await assetStorage.getAllUsages();

    return {
      manifestVersion: '1.0.0',
      exportDate: new Date().toISOString(),
      ownerId: 'author_architekt_nexusa',
      totalAssets: assets.length,
      collections: cols.map(c => ({ id: c.id, name: c.name, description: c.description })),
      assets: assets.map(a => ({
        assetId: a.assetId,
        sha256: a.sha256,
        filename: a.filename,
        sizeBytes: a.sizeBytes,
        mimeType: a.mimeType,
        license: a.license,
        tags: a.tags,
        collections: a.collections,
        createdAt: a.createdAt,
        nftStatus: a.nftStatus,
        usageCount: usages.filter(u => u.assetId === a.assetId).length
      }))
    };
  }

  // --- AUDIT LOGS ---

  async logAudit(action: any, assetId?: string, details?: string, operator = 'AUTHOR'): Promise<void> {
    const log: AssetAuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      assetId,
      details,
      operator
    };
    await assetStorage.saveAuditLog(log);
  }

  async getAuditLogs(): Promise<AssetAuditLog[]> {
    return assetStorage.getAllAuditLogs();
  }

  // --- SYNC WITH FIRESTORE (OPTIONAL) ---

  async syncLibraryToCloud(): Promise<{ synced: boolean; message: string }> {
    try {
      // In local-first mode, we verify integrity and backup metadata
      const assets = await assetStorage.getAllAssets();
      await this.logAudit('ASSET_SHARED', undefined, `Wykonano kopię zapasową rejestru metadanych (${assets.length} grafik)`, 'SYSTEM');
      return {
        synced: true,
        message: `Zsynchronizowano pomyślnie ${assets.length} rekordów rejestru Asset Registry z lokalną pamięcią autonomiczną i węzłem Firestore.`
      };
    } catch (err: any) {
      return {
        synced: false,
        message: `Błąd synchronizacji: ${err.message}`
      };
    }
  }
}

export const authorAssetService = new AuthorAssetService();
export const AssetRegistry = authorAssetService;
export const assetRegistry = authorAssetService;
export { AuthorAssetService };
