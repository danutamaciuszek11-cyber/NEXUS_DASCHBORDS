/**
 * NEXUS CUSTOM BOOKS STORAGE & QUOTA RECOVERY MANAGER
 * ==================================================
 * Bezpieczne, zoptymalizowane zarządzanie autorskimi i zaimportowanymi książkami w localStorage.
 * Chroni przed przekroczeniem limitu pamięci podręcznej przeglądarki (QuotaExceededError).
 */

import { Book } from '../types';
import { SAMPLE_BOOKS } from '../data/booksData';

export const CUSTOM_BOOKS_STORAGE_KEY = 'nexusbook_custom_books';

/**
 * Zbiór identyfikatorów domyślnych, wbudowanych dzieł z SAMPLE_BOOKS.
 */
const BUILT_IN_SAMPLE_IDS = new Set<string>(SAMPLE_BOOKS.map(b => b.id));

/**
 * Sprawdza, czy dana książka jest domyślnym, statycznym dziełem systemowym.
 */
export function isBuiltInSampleBookId(bookId: string): boolean {
  return BUILT_IN_SAMPLE_IDS.has(bookId);
}

/**
 * Filtruje listę książek, pozostawiając WYŁĄCZNIE autorskie i zaimportowane pozycje użytkownika.
 * Domyślne dzieła systemowe nie są powielane w localStorage.
 */
export function filterUserCustomBooks(booksList: Book[] = []): Book[] {
  return booksList.filter(b => {
    if (!b || !b.id) return false;

    // Jawne prefiksy wyznaczające dzieła użytkownika
    if (
      b.id.startsWith('html_world_') ||
      b.id.startsWith('imported_') ||
      b.id.startsWith('custom_') ||
      b.id.startsWith('user_') ||
      b.id.startsWith('work_')
    ) {
      return true;
    }

    // Jeśli książka NIE istnieje w statycznym kanonie SAMPLE_BOOKS, jest dziełem użytkownika
    return !BUILT_IN_SAMPLE_IDS.has(b.id);
  });
}

/**
 * Bezpiecznie zapisuje dzieła użytkownika do localStorage, automatycznie obsługując
 * potencjalny błąd QuotaExceededError poprzez czyszczenie zbędnych buforów.
 */
export function safeSaveCustomBooks(booksList: Book[] = []): boolean {
  if (typeof window === 'undefined') return false;

  const userCustomBooks = filterUserCustomBooks(booksList);

  try {
    localStorage.setItem(CUSTOM_BOOKS_STORAGE_KEY, JSON.stringify(userCustomBooks));
    return true;
  } catch (err: any) {
    console.warn('[StorageManager] Przekroczono limit localStorage podczas zapisu custom_books. Uruchamianie procedury odzyskiwania pamięci...', err);

    // 1. Procedura czyszczenia zbędnych / powielonych kluczy tymczasowych
    try {
      localStorage.removeItem('nexusbook_offline_opened_books');
      localStorage.removeItem('nexus_system_logs_v1');
    } catch (e) {
      // Ignorujemy błędy usuwania
    }

    // 2. Próba ponownego zapisu odchudzonego zestawu dzieł autorskich
    try {
      localStorage.setItem(CUSTOM_BOOKS_STORAGE_KEY, JSON.stringify(userCustomBooks));
      console.info('[StorageManager] Odzyskano pamięć. Dzieła autorskie zapisane pomyślnie.');
      return true;
    } catch (e2) {
      // 3. Jeśli pamięć jest nadal przepełniona, stosujemy kompresję kodów HTML w obiekcie
      try {
        const compressedCustom = userCustomBooks.map(b => {
          if (b.customHtmlWorld && b.customHtmlWorld.htmlCode && b.customHtmlWorld.htmlCode.length > 30000) {
            return {
              ...b,
              customHtmlWorld: {
                ...b.customHtmlWorld,
                htmlCode: b.customHtmlWorld.htmlCode.slice(0, 1000) + '\n<!-- [KOD SKOMPRESOWANY DLA LOCALSTORAGE - PEŁNA WERSJA W FIRESTORE] -->'
              }
            };
          }
          return b;
        });

        localStorage.setItem(CUSTOM_BOOKS_STORAGE_KEY, JSON.stringify(compressedCustom));
        console.warn('[StorageManager] Zapisano dzieła autorskie ze skompresowanymi zasobami HTML.');
        return true;
      } catch (e3) {
        console.error('[StorageManager] Krytyczne przepełnienie localStorage. Stan książek pozostaje w pamięci podręcznej i chmurze Firestore.', e3);
        return false;
      }
    }
  }
}

/**
 * Bezpiecznie odczytuje dzieła użytkownika z localStorage.
 */
export function getStoredCustomBooks(): Book[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_BOOKS_STORAGE_KEY);
    if (!raw) return [];

    const parsed: Book[] = JSON.parse(raw);
    return filterUserCustomBooks(parsed);
  } catch (e) {
    console.warn('[StorageManager] Nie udało się odczytać custom_books z localStorage:', e);
    return [];
  }
}
