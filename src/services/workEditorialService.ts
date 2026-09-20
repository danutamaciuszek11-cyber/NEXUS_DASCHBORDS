/**
 * workEditorialService.ts - NexusBook Editorial & Publishing Engine
 * Comprehensive editorial control, manifest synchronization, cover versioning,
 * content structure management, immutable snapshots, and multi-channel publication.
 */

import { 
  Book, 
  Chapter, 
  WorkManifest, 
  WorkCoverVersion, 
  WorkEditorialVersion, 
  WorkAuditRecord, 
  WorkAuditAction, 
  PublicationState,
  Language,
  Category
} from '../types';
import { AssetRegistryRecord, AssetVersion } from '../types/assetLibrary';
import { SAMPLE_BOOKS } from '../data/booksData';
import { authorAssetService } from './authorAssetService';
import { saveCustomBookToCloud } from '../utils/firestoreSync';

class WorkEditorialService {
  
  /**
   * Guarantees 100% backward compatibility for existing books,
   * injecting safe editorial defaults without altering immutable IDs.
   */
  ensureWorkCompatibility(book: Book): Book {
    if (!book) return book;

    const now = new Date().toISOString();
    const currentVersion = book.currentVersion || (book.status === 'Published' ? 'v1.0' : 'v0.9-draft');
    const publicationState: PublicationState = book.publicationState || (book.status === 'Published' ? 'PUBLISHED' : 'DRAFT');

    // Setup cover versions if existing cover exists
    let coverVersions: WorkCoverVersion[] = book.coverVersions ? [...book.coverVersions] : [];
    if (coverVersions.length === 0 && (book.coverImageUrl || book.coverAssetId)) {
      coverVersions = [{
        versionId: `cov_${book.id}_v1`,
        url: book.coverImageUrl || '',
        assetId: book.coverAssetId,
        filename: 'Okładka Pierwotna (v1)',
        createdAt: typeof book.createdAt === 'string' ? book.createdAt : now,
        isCurrent: true,
        notes: 'Wygenerowana lub przypisana w pierwotnej wersji dzieła'
      }];
    }

    // Setup default manifest
    const manifest: WorkManifest = book.manifest || {
      manifestVersion: '1.0.0',
      workId: book.id,
      title: book.title || 'Bez tytułu',
      subtitle: book.subtitle || '',
      author: book.author || 'Architekt Nexusa',
      tagline: book.tagline || (book.quotes?.[0]?.text?.slice(0, 120) || ''),
      shortDescription: book.shortDesc || '',
      longDescription: book.longDesc || '',
      editorialNote: book.editorialNote || book.authorNote || '',
      category: (book.tags?.[0] as string) || 'Manifest',
      genre: book.genre || (book.tags?.[1] as string) || 'Cyberpunk / Filozofia',
      language: book.language || 'PL',
      series: book.series || '',
      volume: book.volume || 1,
      year: book.year || new Date().getFullYear(),
      tags: book.tags ? book.tags.map(t => String(t)) : ['NexusBook'],
      keywords: book.keywords || ['nexus', 'eterniverse', 'cyberpunk', 'świadomość'],
      status: book.status || 'Classified Draft',
      publicationState: publicationState,
      coverUrl: book.coverImageUrl,
      coverAssetId: book.coverAssetId,
      coverVersions: coverVersions,
      publishedAt: book.publishedAt ? String(book.publishedAt) : (book.status === 'Published' ? now : undefined),
      lastEditedAt: typeof book.updatedAt === 'string' ? book.updatedAt : now,
      distributionChannels: ['NEXUSBOOK', 'PDF', 'NEXUSSOCIAL']
    };

    // Setup default audit history
    const auditHistory: WorkAuditRecord[] = book.auditHistory ? [...book.auditHistory] : [
      {
        id: `aud_${book.id}_init`,
        workId: book.id,
        timestamp: typeof book.createdAt === 'string' ? book.createdAt : now,
        action: 'WORK_CREATED',
        userId: 'Architekt',
        details: `Zainicjalizowano dzieło w systemie NexusBook [${book.title}]`
      }
    ];

    // Setup editorial versions
    const editorialVersions: WorkEditorialVersion[] = book.editorialVersions ? [...book.editorialVersions] : [
      {
        versionNumber: currentVersion,
        workId: book.id,
        versionId: `ver_${book.id}_initial`,
        title: book.title,
        status: book.status,
        publicationState: publicationState,
        changedBy: 'Architekt',
        changedAt: typeof book.createdAt === 'string' ? book.createdAt : now,
        changesSummary: 'Pierwotna wersja wydawnicza dzieła',
        coverVersion: coverVersions[0]?.versionId,
        manifestVersion: '1.0.0',
        contentVersion: '1.0',
        snapshot: {
          title: book.title,
          subtitle: book.subtitle,
          shortDesc: book.shortDesc,
          longDesc: book.longDesc,
          chapters: book.chapters
        }
      }
    ];

    return {
      ...book,
      subtitle: book.subtitle || '',
      author: book.author || 'Architekt Nexusa',
      series: book.series || '',
      volume: book.volume || 1,
      genre: book.genre || 'Cyberpunk / Filozofia',
      tagline: book.tagline || (book.quotes?.[0]?.text?.slice(0, 120) || ''),
      editorialNote: book.editorialNote || book.authorNote || '',
      keywords: book.keywords || ['nexus', 'eterniverse', 'cyberpunk', 'świadomość'],
      currentVersion,
      publicationState,
      coverVersions,
      manifest,
      editorialVersions,
      auditHistory,
      attachedAssetIds: book.attachedAssetIds || [],
      createdAt: book.createdAt || now,
      updatedAt: book.updatedAt || now
    };
  }

  /**
   * Recalculates real word count, page count, and estimated read time.
   */
  calculateContentStats(chapters: Chapter[]) {
    let totalWords = 0;
    chapters.forEach(ch => {
      const words = ch.content ? ch.content.trim().split(/\s+/).filter(Boolean).length : 0;
      totalWords += words;
    });

    const pageCount = Math.max(1, Math.ceil(totalWords / 280));
    const estReadTimeMin = Math.max(1, Math.ceil(totalWords / 200));

    return {
      wordCount: totalWords,
      pageCount,
      estReadTimeMin
    };
  }

  /**
   * Synchronizes Manifest object with main Book attributes.
   */
  buildSynchronizedManifest(book: Book, publicationState?: PublicationState): WorkManifest {
    const now = new Date().toISOString();
    const state = publicationState || book.publicationState || (book.status === 'Published' ? 'PUBLISHED' : 'DRAFT');

    return {
      manifestVersion: book.manifest?.manifestVersion || '1.1.0',
      workId: book.id,
      title: book.title,
      subtitle: book.subtitle || '',
      author: book.author || 'Architekt Nexusa',
      tagline: book.tagline || '',
      shortDescription: book.shortDesc || '',
      longDescription: book.longDesc || '',
      editorialNote: book.editorialNote || book.authorNote || '',
      category: (book.tags?.[0] as string) || 'Manifest',
      genre: book.genre || 'Cyberpunk / Filozofia',
      language: book.language,
      series: book.series || '',
      volume: book.volume || 1,
      year: book.year,
      tags: book.tags ? book.tags.map(t => String(t)) : [],
      keywords: book.keywords || [],
      status: book.status,
      publicationState: state,
      coverUrl: book.coverImageUrl,
      coverAssetId: book.coverAssetId,
      coverVersions: book.coverVersions,
      publishedAt: state === 'PUBLISHED' ? (book.publishedAt ? String(book.publishedAt) : now) : undefined,
      lastEditedAt: now,
      isbn: book.manifest?.isbn || `NX-ISBN-${book.id.toUpperCase().slice(0, 8)}`,
      distributionChannels: book.manifest?.distributionChannels || ['NEXUSBOOK', 'PDF', 'NEXUSSOCIAL']
    };
  }

  /**
   * Adds an audit log entry to the work's historical trail.
   */
  createAuditRecord(
    workId: string, 
    action: WorkAuditAction, 
    details: string, 
    userId = 'Architekt',
    previousValue?: any, 
    newValue?: any,
    versionId?: string
  ): WorkAuditRecord {
    return {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      workId,
      timestamp: new Date().toISOString(),
      action,
      userId,
      details,
      previousValue,
      newValue,
      versionId
    };
  }

  /**
   * Saves work as a working draft (local persistence + cloud sync).
   */
  async saveWorkDraft(book: Book, changesSummary = 'Zaktualizowano wersję roboczą dzieła', author = 'Architekt'): Promise<Book> {
    const compatible = this.ensureWorkCompatibility(book);
    const now = new Date().toISOString();
    const stats = this.calculateContentStats(compatible.chapters);

    const audit = this.createAuditRecord(
      compatible.id,
      'WORK_UPDATED',
      changesSummary,
      author,
      { title: compatible.title, status: compatible.status },
      { title: compatible.title, status: compatible.status }
    );

    const updatedManifest = this.buildSynchronizedManifest({
      ...compatible,
      stats: { ...compatible.stats, ...stats },
      updatedAt: now
    }, 'SAVED');

    const updatedBook: Book = {
      ...compatible,
      stats: { ...compatible.stats, ...stats },
      publicationState: 'SAVED',
      manifest: updatedManifest,
      updatedAt: now,
      auditHistory: [audit, ...(compatible.auditHistory || [])]
    };

    this.persistWorkLocallyAndCloud(updatedBook);
    return updatedBook;
  }

  /**
   * Publishes the work, creates an immutable version snapshot,
   * updates status to Published, and distributes to channels.
   */
  async publishWork(book: Book, changesSummary = 'Oficjalna publikacja dzieła w ekosystemie Nexus', author = 'Architekt'): Promise<Book> {
    const compatible = this.ensureWorkCompatibility(book);
    const now = new Date().toISOString();
    const stats = this.calculateContentStats(compatible.chapters);

    // Calculate next version number
    const currentVer = compatible.currentVersion || 'v1.0';
    let nextVerNumber = 'v1.0';
    const match = currentVer.match(/v?(\d+)(\.(\d+))?/);
    if (match) {
      const major = parseInt(match[1], 10) || 1;
      nextVerNumber = `v${major + 1}.0`;
    } else {
      nextVerNumber = 'v2.0';
    }

    const versionSnapshot: WorkEditorialVersion = {
      versionNumber: nextVerNumber,
      workId: compatible.id,
      versionId: `ver_${compatible.id}_${Date.now()}`,
      title: compatible.title,
      status: 'Published',
      publicationState: 'PUBLISHED',
      changedBy: author,
      changedAt: now,
      changesSummary,
      coverVersion: compatible.coverVersions?.find(c => c.isCurrent)?.versionId,
      manifestVersion: compatible.manifest?.manifestVersion || '1.1.0',
      contentVersion: nextVerNumber,
      snapshot: {
        title: compatible.title,
        subtitle: compatible.subtitle,
        author: compatible.author,
        shortDesc: compatible.shortDesc,
        longDesc: compatible.longDesc,
        coverImageUrl: compatible.coverImageUrl,
        coverAssetId: compatible.coverAssetId,
        chapters: JSON.parse(JSON.stringify(compatible.chapters)),
        tags: [...compatible.tags],
        stats: { ...compatible.stats, ...stats }
      }
    };

    const audit = this.createAuditRecord(
      compatible.id,
      'VERSION_PUBLISHED',
      `Opublikowano nową wersję dzieła [${nextVerNumber}]: ${changesSummary}`,
      author,
      { currentVersion: compatible.currentVersion, publicationState: compatible.publicationState },
      { currentVersion: nextVerNumber, publicationState: 'PUBLISHED' },
      versionSnapshot.versionId
    );

    const updatedManifest = this.buildSynchronizedManifest({
      ...compatible,
      status: 'Published',
      currentVersion: nextVerNumber,
      publishedAt: now,
      updatedAt: now
    }, 'PUBLISHED');

    const updatedBook: Book = {
      ...compatible,
      status: 'Published',
      publicationState: 'PUBLISHED',
      currentVersion: nextVerNumber,
      publishedAt: now,
      updatedAt: now,
      stats: { ...compatible.stats, ...stats },
      manifest: updatedManifest,
      editorialVersions: [versionSnapshot, ...(compatible.editorialVersions || [])],
      auditHistory: [audit, ...(compatible.auditHistory || [])]
    };

    this.persistWorkLocallyAndCloud(updatedBook);
    return updatedBook;
  }

  /**
   * Adds or updates a work cover, maintaining version history and asset registry links.
   */
  async setWorkCover(
    book: Book, 
    coverInput: {
      url: string;
      assetId?: string;
      filename?: string;
      mimeType?: string;
      width?: number;
      height?: number;
      notes?: string;
    },
    author = 'Architekt'
  ): Promise<Book> {
    const compatible = this.ensureWorkCompatibility(book);
    const now = new Date().toISOString();

    const newCoverVersionNumber = (compatible.coverVersions?.length || 0) + 1;
    const newCoverVersion: WorkCoverVersion = {
      versionId: `cov_${compatible.id}_v${newCoverVersionNumber}_${Date.now().toString(36)}`,
      assetId: coverInput.assetId,
      url: coverInput.url,
      thumbnailUrl: coverInput.url,
      filename: coverInput.filename || `Okładka v${newCoverVersionNumber}`,
      mimeType: coverInput.mimeType || 'image/jpeg',
      width: coverInput.width,
      height: coverInput.height,
      createdAt: now,
      isCurrent: true,
      notes: coverInput.notes || `Okładka dodana w panelu redakcyjnym (v${newCoverVersionNumber})`
    };

    // Mark previous covers as not current
    const updatedCoverVersions = [
      newCoverVersion,
      ...(compatible.coverVersions || []).map(c => ({ ...c, isCurrent: false }))
    ];

    const audit = this.createAuditRecord(
      compatible.id,
      compatible.coverImageUrl ? 'COVER_CHANGED' : 'COVER_ADDED',
      `Zaktualizowano okładkę dzieła do wersji v${newCoverVersionNumber} (${coverInput.filename || 'nowy plik'})`,
      author,
      { coverImageUrl: compatible.coverImageUrl, coverAssetId: compatible.coverAssetId },
      { coverImageUrl: coverInput.url, coverAssetId: coverInput.assetId }
    );

    // Register usage in AuthorAssetLibrary if assetId exists
    if (coverInput.assetId) {
      try {
        await authorAssetService.attachAssetToContent(
          coverInput.assetId,
          'BOOK_COVER',
          compatible.id,
          `Okładka dzieła: ${compatible.title}`,
          undefined,
          `Wersja okładki v${newCoverVersionNumber}`
        );
      } catch (err) {
        console.warn('Could not register asset usage in library:', err);
      }
    }

    const updatedBook: Book = {
      ...compatible,
      coverImageUrl: coverInput.url,
      coverAssetId: coverInput.assetId,
      coverVersions: updatedCoverVersions,
      updatedAt: now,
      auditHistory: [audit, ...(compatible.auditHistory || [])]
    };

    updatedBook.manifest = this.buildSynchronizedManifest(updatedBook);
    this.persistWorkLocallyAndCloud(updatedBook);
    return updatedBook;
  }

  /**
   * Restores a previously used cover from the cover version history.
   */
  async restoreCoverVersion(book: Book, versionId: string, author = 'Architekt'): Promise<Book> {
    const compatible = this.ensureWorkCompatibility(book);
    const targetCover = compatible.coverVersions?.find(c => c.versionId === versionId);
    if (!targetCover) throw new Error(`Nie odnaleziono wersji okładki: ${versionId}`);

    const now = new Date().toISOString();
    const updatedCoverVersions = (compatible.coverVersions || []).map(c => ({
      ...c,
      isCurrent: c.versionId === versionId
    }));

    const audit = this.createAuditRecord(
      compatible.id,
      'COVER_RESTORED',
      `Przywrócono poprzednią wersję okładki [${targetCover.filename || targetCover.versionId}]`,
      author,
      { coverImageUrl: compatible.coverImageUrl },
      { coverImageUrl: targetCover.url }
    );

    const updatedBook: Book = {
      ...compatible,
      coverImageUrl: targetCover.url,
      coverAssetId: targetCover.assetId,
      coverVersions: updatedCoverVersions,
      updatedAt: now,
      auditHistory: [audit, ...(compatible.auditHistory || [])]
    };

    updatedBook.manifest = this.buildSynchronizedManifest(updatedBook);
    this.persistWorkLocallyAndCloud(updatedBook);
    return updatedBook;
  }

  /**
   * Removes current cover without destroying history records.
   */
  async removeWorkCover(book: Book, author = 'Architekt'): Promise<Book> {
    const compatible = this.ensureWorkCompatibility(book);
    const now = new Date().toISOString();

    const updatedCoverVersions = (compatible.coverVersions || []).map(c => ({
      ...c,
      isCurrent: false
    }));

    const audit = this.createAuditRecord(
      compatible.id,
      'COVER_REMOVED',
      'Usunięto aktywną okładkę dzieła (przełączono na generator stylów)',
      author,
      { coverImageUrl: compatible.coverImageUrl },
      { coverImageUrl: undefined }
    );

    const updatedBook: Book = {
      ...compatible,
      coverImageUrl: undefined,
      coverAssetId: undefined,
      coverVersions: updatedCoverVersions,
      updatedAt: now,
      auditHistory: [audit, ...(compatible.auditHistory || [])]
    };

    updatedBook.manifest = this.buildSynchronizedManifest(updatedBook);
    this.persistWorkLocallyAndCloud(updatedBook);
    return updatedBook;
  }

  /**
   * Restores an entire work state from an immutable editorial version snapshot.
   */
  async restoreEditorialVersion(book: Book, versionId: string, author = 'Architekt'): Promise<Book> {
    const compatible = this.ensureWorkCompatibility(book);
    const targetVersion = compatible.editorialVersions?.find(v => v.versionId === versionId);
    if (!targetVersion || !targetVersion.snapshot) {
      throw new Error(`Nie odnaleziono migawki wersji: ${versionId}`);
    }

    const now = new Date().toISOString();
    const snap = targetVersion.snapshot;

    const audit = this.createAuditRecord(
      compatible.id,
      'VERSION_RESTORED',
      `Przywrócono stan dzieła z migawki wydawniczej [${targetVersion.versionNumber}]`,
      author,
      { currentVersion: compatible.currentVersion, title: compatible.title },
      { currentVersion: targetVersion.versionNumber, title: snap.title }
    );

    const restoredBook: Book = {
      ...compatible,
      ...snap,
      updatedAt: now,
      auditHistory: [audit, ...(compatible.auditHistory || [])]
    };

    restoredBook.manifest = this.buildSynchronizedManifest(restoredBook);
    this.persistWorkLocallyAndCloud(restoredBook);
    return restoredBook;
  }

  /**
   * Helper: Persists book modifications to localStorage and Cloud Firestore.
   */
  private persistWorkLocallyAndCloud(book: Book): void {
    try {
      const saved = localStorage.getItem('nexusbook_custom_books');
      let customBooks: Book[] = saved ? JSON.parse(saved) : [];
      const idx = customBooks.findIndex(b => b.id === book.id);
      if (idx >= 0) {
        customBooks[idx] = book;
      } else {
        customBooks.unshift(book);
      }
      localStorage.setItem('nexusbook_custom_books', JSON.stringify(customBooks));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }

    // Async save to Cloud Firestore
    saveCustomBookToCloud(book).catch(err => {
      console.warn('Firestore cloud sync for editorial book failed (saved locally):', err);
    });
  }

  /**
   * Retrieves all known works from custom persistent storage and default catalog.
   */
  getAllKnownWorks(): Book[] {
    try {
      const saved = localStorage.getItem('nexusbook_custom_books');
      const custom: Book[] = saved ? JSON.parse(saved) : [];
      const customIds = new Set(custom.map(b => b.id));
      const defaults = SAMPLE_BOOKS.filter(b => !customIds.has(b.id));
      return [...custom, ...defaults].map(b => this.ensureWorkCompatibility(b));
    } catch (e) {
      return SAMPLE_BOOKS.map(b => this.ensureWorkCompatibility(b));
    }
  }

  /**
   * Retrieves a specific work by ID.
   */
  getWorkById(workId: string): Book | null {
    const all = this.getAllKnownWorks();
    return all.find(b => b.id === workId) || null;
  }

  /**
   * Explicitly links an asset as the cover art for an existing work,
   * creating a new cover version in the work manifest and registering asset usage.
   */
  async linkAssetAsCover(
    bookId: string, 
    asset: AssetRegistryRecord, 
    changeNotes?: string, 
    author = 'Architekt'
  ): Promise<{ updatedBook: Book; updatedAsset: AssetRegistryRecord }> {
    const book = this.getWorkById(bookId);
    if (!book) throw new Error(`Nie odnaleziono dzieła o ID: ${bookId}`);

    const updatedBook = await this.setWorkCover(
      book,
      {
        url: asset.dataUrl,
        assetId: asset.assetId,
        filename: asset.filename,
        width: asset.width,
        height: asset.height,
        notes: changeNotes || `Przypisano okładkę z Author Asset Library (${asset.assetId})`
      },
      author
    );

    // Attach usage reference in authorAssetService
    try {
      await authorAssetService.attachAssetToContent(
        asset.assetId,
        'BOOK_COVER',
        updatedBook.id,
        `Okładka dzieła: ${updatedBook.title}`,
        undefined,
        changeNotes || `Okładka przypisana do dzieła ${updatedBook.title} (${updatedBook.id})`
      );
    } catch (err) {
      console.warn('Could not register asset usage in library:', err);
    }

    // Dispatch custom window event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nexusbook:work-cover-updated', {
        detail: { book: updatedBook, assetId: asset.assetId }
      }));
    }

    return { updatedBook, updatedAsset: asset };
  }

  /**
   * Unlinks an asset cover from a work, restoring generic styling.
   */
  async unlinkAssetCover(
    bookId: string,
    assetId: string,
    author = 'Architekt'
  ): Promise<Book> {
    const book = this.getWorkById(bookId);
    if (!book) throw new Error(`Nie odnaleziono dzieła o ID: ${bookId}`);

    const updatedBook = await this.removeWorkCover(book, author);

    // Find and remove usage reference
    try {
      const usages = await authorAssetService.getAssetUsage(assetId);
      const bookUsage = usages.find(u => u.usageType === 'BOOK_COVER' && u.targetId === bookId);
      if (bookUsage) {
        await authorAssetService.detachAssetFromContent(bookUsage.id);
      }
    } catch (err) {
      console.warn('Could not detach asset usage:', err);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nexusbook:work-cover-updated', {
        detail: { book: updatedBook, assetId }
      }));
    }

    return updatedBook;
  }

  /**
   * Tracks and synchronizes asset modifications (new versions or graphic changes)
   * across all works that link to this asset as their cover art.
   * Generates a new WorkCoverVersion entry in the work's manifest and audit record.
   */
  async syncAssetUpdateToWorks(
    assetId: string, 
    updatedAsset: AssetRegistryRecord, 
    newVersion?: AssetVersion,
    author = 'System Asset Library'
  ): Promise<Book[]> {
    const allWorks = this.getAllKnownWorks();
    const usages = await authorAssetService.getAssetUsage(assetId);
    const targetWorkIdsFromUsages = new Set(
      usages.filter(u => u.usageType === 'BOOK_COVER').map(u => u.targetId)
    );

    const matchedWorks = allWorks.filter(
      b => b.coverAssetId === assetId || targetWorkIdsFromUsages.has(b.id)
    );

    if (matchedWorks.length === 0) return [];

    const updatedWorks: Book[] = [];
    const now = new Date().toISOString();
    const newUrl = newVersion?.dataUrl || updatedAsset.dataUrl;
    const newWidth = newVersion?.width || updatedAsset.width;
    const newHeight = newVersion?.height || updatedAsset.height;
    const newFilename = newVersion?.filename || updatedAsset.filename;
    const verLabel = newVersion?.versionId || `v${updatedAsset.versions.length}.0`;

    for (const book of matchedWorks) {
      const compatible = this.ensureWorkCompatibility(book);
      const newCoverVersionNumber = (compatible.coverVersions?.length || 0) + 1;

      const newCoverVersion: WorkCoverVersion = {
        versionId: `cov_${compatible.id}_ast_${Date.now().toString(36)}_${newCoverVersionNumber}`,
        assetId: assetId,
        url: newUrl,
        thumbnailUrl: newUrl,
        filename: newFilename,
        mimeType: updatedAsset.mimeType || 'image/jpeg',
        width: newWidth,
        height: newHeight,
        createdAt: now,
        isCurrent: true,
        notes: `Automatyczna aktualizacja z biblioteki assetów: ${assetId} (${verLabel})`
      };

      const updatedCoverVersions = [
        newCoverVersion,
        ...(compatible.coverVersions || []).map(c => ({ ...c, isCurrent: false }))
      ];

      const audit = this.createAuditRecord(
        compatible.id,
        'COVER_CHANGED',
        `Zsynchronizowano wersję okładki z rejestru assetów [${assetId} -> ${verLabel}]`,
        author,
        { coverImageUrl: compatible.coverImageUrl, coverAssetId: compatible.coverAssetId },
        { coverImageUrl: newUrl, coverAssetId: assetId, assetVersion: verLabel }
      );

      const updatedBook: Book = {
        ...compatible,
        coverImageUrl: newUrl,
        coverAssetId: assetId,
        coverVersions: updatedCoverVersions,
        updatedAt: now,
        auditHistory: [audit, ...(compatible.auditHistory || [])]
      };

      updatedBook.manifest = this.buildSynchronizedManifest(updatedBook);
      this.persistWorkLocallyAndCloud(updatedBook);
      updatedWorks.push(updatedBook);
    }

    if (typeof window !== 'undefined' && updatedWorks.length > 0) {
      window.dispatchEvent(new CustomEvent('nexusbook:work-cover-updated', {
        detail: { books: updatedWorks, assetId }
      }));
    }

    return updatedWorks;
  }
}

export const workEditorialService = new WorkEditorialService();
