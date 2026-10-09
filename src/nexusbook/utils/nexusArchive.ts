import { Book, BookCollection, ChapterBookmark, PilotProfile, UserDashboardConfig } from '../types';
import { NEXUS_NODE_TOKEN } from '../lib/nodeIdentity';
import { getStoredReadChapters, saveStoredReadChapters } from './readingProgress';
import { getStoredAnnotations, saveStoredAnnotations } from './annotationStorage';
import { saveStoredBookmarks } from './bookmarkStorage';

export interface NexusArchiveMetadata {
  archiveVersion: 'NEXUS_ARCHIVE_V1';
  system: 'ETERNIVERSE / NEXUS OS';
  nodeToken: string;
  exportedAt: string;
  timestamp: number;
  stats: {
    customBooksCount: number;
    totalBooksCount: number;
    collectionsCount: number;
    bookmarksCount: number;
    annotationsCount: number;
    readChaptersCount: number;
  };
}

export interface NexusArchivePackage {
  metadata: NexusArchiveMetadata;
  data: {
    customBooks: Book[];
    collections: BookCollection[];
    bookmarks: ChapterBookmark[];
    annotations?: any[];
    readChapters?: string[];
    pilotProfile?: PilotProfile | null;
    userConfig?: Partial<UserDashboardConfig> | null;
  };
}

export interface ArchiveValidationResult {
  isValid: boolean;
  package?: NexusArchivePackage;
  error?: string;
  summary?: {
    customBooksCount: number;
    collectionsCount: number;
    bookmarksCount: number;
    exportedAt?: string;
    version?: string;
  };
}

/**
 * Builds a structured JSON archive of locally stored books, collections, and bookmarks.
 */
export function generateNexusArchive(
  booksList: Book[],
  collections: BookCollection[],
  bookmarks: ChapterBookmark[]
): NexusArchivePackage {
  // Extract custom or user-modified books
  const customBooks = booksList.filter(
    b => b.id.startsWith('html_world_') || b.customHtmlWorld || (b as any).isUserCustom
  );

  let pilotProfile: PilotProfile | null = null;
  try {
    const rawPilot = localStorage.getItem('nexusbook_pilot_profile');
    if (rawPilot) pilotProfile = JSON.parse(rawPilot);
  } catch (e) {
    console.warn('Failed to serialize pilot profile for archive:', e);
  }

  let userConfig: Partial<UserDashboardConfig> | null = null;
  try {
    const rawConfig = localStorage.getItem('nexusbook_user_config');
    if (rawConfig) userConfig = JSON.parse(rawConfig);
  } catch (e) {
    console.warn('Failed to serialize user config for archive:', e);
  }

  const annotations = getStoredAnnotations();
  const readChapters = getStoredReadChapters();
  const timestamp = Date.now();
  const exportedAt = new Date(timestamp).toISOString();

  const metadata: NexusArchiveMetadata = {
    archiveVersion: 'NEXUS_ARCHIVE_V1',
    system: 'ETERNIVERSE / NEXUS OS',
    nodeToken: NEXUS_NODE_TOKEN,
    exportedAt,
    timestamp,
    stats: {
      customBooksCount: customBooks.length,
      totalBooksCount: booksList.length,
      collectionsCount: collections.length,
      bookmarksCount: bookmarks.length,
      annotationsCount: annotations.length,
      readChaptersCount: readChapters.length
    }
  };

  return {
    metadata,
    data: {
      customBooks,
      collections,
      bookmarks,
      annotations,
      readChapters,
      pilotProfile,
      userConfig
    }
  };
}

/**
 * Initiates browser download of the structured JSON archive.
 */
export function downloadNexusArchiveFile(archive: NexusArchivePackage, customFilename?: string): string {
  const jsonContent = JSON.stringify(archive, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const timestampStr = new Date(archive.metadata.timestamp)
    .toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, 19);
  const filename = customFilename || `nexus-archive-${timestampStr}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return filename;
}

/**
 * Validates incoming JSON string for archive compliance.
 */
export function validateAndParseArchive(rawJson: string): ArchiveValidationResult {
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') {
      return { isValid: false, error: 'Plik nie zawiera prawidłowego obiektu JSON.' };
    }

    // Check for standard structured format
    if (parsed.metadata && parsed.data) {
      const customBooks = Array.isArray(parsed.data.customBooks) 
        ? parsed.data.customBooks 
        : Array.isArray(parsed.data.books) 
          ? parsed.data.books 
          : [];
      const collections = Array.isArray(parsed.data.collections) ? parsed.data.collections : [];
      const bookmarks = Array.isArray(parsed.data.bookmarks) ? parsed.data.bookmarks : [];

      return {
        isValid: true,
        package: {
          metadata: {
            archiveVersion: parsed.metadata.archiveVersion || 'NEXUS_ARCHIVE_V1',
            system: parsed.metadata.system || 'ETERNIVERSE / NEXUS OS',
            nodeToken: parsed.metadata.nodeToken || 'NODE_EXTERNAL',
            exportedAt: parsed.metadata.exportedAt || new Date().toISOString(),
            timestamp: parsed.metadata.timestamp || Date.now(),
            stats: {
              customBooksCount: customBooks.length,
              totalBooksCount: customBooks.length,
              collectionsCount: collections.length,
              bookmarksCount: bookmarks.length,
              annotationsCount: Array.isArray(parsed.data.annotations) ? parsed.data.annotations.length : 0,
              readChaptersCount: Array.isArray(parsed.data.readChapters) ? parsed.data.readChapters.length : 0
            }
          },
          data: {
            customBooks,
            collections,
            bookmarks,
            annotations: Array.isArray(parsed.data.annotations) ? parsed.data.annotations : [],
            readChapters: Array.isArray(parsed.data.readChapters) ? parsed.data.readChapters : [],
            pilotProfile: parsed.data.pilotProfile || null,
            userConfig: parsed.data.userConfig || null
          }
        },
        summary: {
          customBooksCount: customBooks.length,
          collectionsCount: collections.length,
          bookmarksCount: bookmarks.length,
          exportedAt: parsed.metadata.exportedAt,
          version: parsed.metadata.archiveVersion || 'v1.0'
        }
      };
    }

    // Check for legacy or flat format: { books: [...], collections: [...] }
    const customBooks = Array.isArray(parsed.customBooks) 
      ? parsed.customBooks 
      : Array.isArray(parsed.books) 
        ? parsed.books 
        : [];
    const collections = Array.isArray(parsed.collections) ? parsed.collections : [];
    const bookmarks = Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [];

    if (customBooks.length === 0 && collections.length === 0 && bookmarks.length === 0) {
      return { 
        isValid: false, 
        error: 'Archiwum nie zawiera żadnych rozpoznawalnych książek, kolekcji ani zakładek.' 
      };
    }

    return {
      isValid: true,
      package: {
        metadata: {
          archiveVersion: 'NEXUS_ARCHIVE_V1',
          system: 'ETERNIVERSE / NEXUS OS',
          nodeToken: parsed.nodeToken || 'NODE_IMPORTED',
          exportedAt: parsed.exportedAt || new Date().toISOString(),
          timestamp: parsed.timestamp || Date.now(),
          stats: {
            customBooksCount: customBooks.length,
            totalBooksCount: customBooks.length,
            collectionsCount: collections.length,
            bookmarksCount: bookmarks.length,
            annotationsCount: Array.isArray(parsed.annotations) ? parsed.annotations.length : 0,
            readChaptersCount: Array.isArray(parsed.readChapters) ? parsed.readChapters.length : 0
          }
        },
        data: {
          customBooks,
          collections,
          bookmarks,
          annotations: Array.isArray(parsed.annotations) ? parsed.annotations : [],
          readChapters: Array.isArray(parsed.readChapters) ? parsed.readChapters : [],
          pilotProfile: parsed.pilotProfile || null,
          userConfig: parsed.userConfig || null
        }
      },
      summary: {
        customBooksCount: customBooks.length,
        collectionsCount: collections.length,
        bookmarksCount: bookmarks.length,
        exportedAt: parsed.exportedAt,
        version: 'Flat JSON'
      }
    };
  } catch (e: any) {
    return {
      isValid: false,
      error: `Błąd parsowania JSON: ${e?.message || 'Nieprawidłowa składnia'}`
    };
  }
}
