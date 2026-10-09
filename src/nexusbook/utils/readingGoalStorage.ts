/**
 * NEXUS MONTHLY READING GOAL & PACING ENGINE
 * ==========================================
 * Zarządzanie miesięcznym celem czytelniczym (Reading Goal),
 * obliczanie tempa (pacing), wskaźników ukończenia oraz projekcji.
 */

import { Book } from '../types';
import { getBookReadingProgress, getStoredReadChapters } from './readingProgress';

export interface MonthlyReadingGoal {
  targetBooks: number;
  month: number; // 0-11
  year: number;
  targetPagesPerMonth?: number;
  completedBookIds?: string[];
  notes?: string;
  updatedAt: number;
}

export interface GoalProgressResult {
  targetBooks: number;
  completedCount: number;
  completedBooks: Book[];
  inProgressBooks: Array<{ book: Book; percentage: number; readChaptersCount: number }>;
  percentage: number;
  isGoalMet: boolean;
  daysInMonth: number;
  currentDay: number;
  daysRemaining: number;
  projectedPaceBooks: number;
  paceStatus: 'COMPLETED' | 'AHEAD' | 'ON_TRACK' | 'BEHIND';
  pacingMessage: string;
  monthName: string;
  year: number;
}

const STORAGE_KEY_READING_GOAL = 'nexusbook_monthly_reading_goal_v1';
const MONTH_NAMES_PL = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

/**
 * Pobiera bieżący cel czytelniczy z pamięci podręcznej (lub domyślny 4 książki/mc).
 */
export function getStoredReadingGoal(): MonthlyReadingGoal {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const defaultGoal: MonthlyReadingGoal = {
    targetBooks: 4,
    month: currentMonth,
    year: currentYear,
    completedBookIds: [],
    updatedAt: Date.now()
  };

  if (typeof window === 'undefined') return defaultGoal;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_READING_GOAL);
    if (!raw) return defaultGoal;

    const parsed: MonthlyReadingGoal = JSON.parse(raw);
    
    // Jeśli zapisany cel dotyczy innego miesiąca, zachowujemy target, ale resetujemy dla nowego miesiąca
    if (parsed.month !== currentMonth || parsed.year !== currentYear) {
      const rolledOver: MonthlyReadingGoal = {
        targetBooks: parsed.targetBooks || 4,
        month: currentMonth,
        year: currentYear,
        completedBookIds: [],
        updatedAt: Date.now()
      };
      saveStoredReadingGoal(rolledOver);
      return rolledOver;
    }

    return parsed;
  } catch (err) {
    console.error('Error loading reading goal:', err);
    return defaultGoal;
  }
}

/**
 * Zapisuje cel czytelniczy do localStorage i wywołuje zdarzenie synchronizacji.
 */
export function saveStoredReadingGoal(goalData: Partial<MonthlyReadingGoal>): MonthlyReadingGoal {
  const current = getStoredReadingGoal();
  const updated: MonthlyReadingGoal = {
    ...current,
    ...goalData,
    targetBooks: Math.max(1, Math.min(50, goalData.targetBooks ?? current.targetBooks)),
    updatedAt: Date.now()
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_READING_GOAL, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('nexus:reading_goal_updated', { detail: updated }));
    } catch (e) {
      console.error('Error saving reading goal:', e);
    }
  }

  return updated;
}

/**
 * Przełącza ręczne oznaczenie książki jako ukończonej w bieżącym miesiącu.
 */
export function toggleBookCompletedForGoal(bookId: string): boolean {
  const goal = getStoredReadingGoal();
  const list = goal.completedBookIds || [];
  const exists = list.includes(bookId);

  const updatedList = exists
    ? list.filter(id => id !== bookId)
    : [...list, bookId];

  saveStoredReadingGoal({ completedBookIds: updatedList });
  return !exists;
}

/**
 * Oblicza szczegółowy postęp celu czytelniczego na podstawie listy książek i aktywności.
 */
export function calculateGoalProgress(
  books: Book[] = [],
  customGoal?: MonthlyReadingGoal
): GoalProgressResult {
  const goal = customGoal || getStoredReadingGoal();
  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(goal.year, goal.month + 1, 0).getDate();
  const daysRemaining = Math.max(0, daysInMonth - currentDay);
  const monthName = MONTH_NAMES_PL[goal.month] || 'Miesiąc';

  const completedBooksList: Book[] = [];
  const inProgressBooksList: Array<{ book: Book; percentage: number; readChaptersCount: number }> = [];

  const manualCompletedIds = new Set(goal.completedBookIds || []);

  books.forEach(b => {
    const progress = getBookReadingProgress(b);
    const isManuallyCompleted = manualCompletedIds.has(b.id);

    if (progress.isCompleted || isManuallyCompleted) {
      completedBooksList.push(b);
    } else if (progress.percentage > 0) {
      inProgressBooksList.push({
        book: b,
        percentage: progress.percentage,
        readChaptersCount: progress.completedChaptersCount
      });
    }
  });

  const completedCount = completedBooksList.length;
  const targetBooks = Math.max(1, goal.targetBooks);
  const percentage = Math.min(100, Math.round((completedCount / targetBooks) * 100));
  const isGoalMet = completedCount >= targetBooks;

  // Obliczenie tempa czytania (pacing)
  const monthProgressFraction = Math.max(0.05, currentDay / daysInMonth);
  const projectedPaceBooks = Math.round((completedCount / monthProgressFraction) * 10) / 10;

  let paceStatus: 'COMPLETED' | 'AHEAD' | 'ON_TRACK' | 'BEHIND';
  let pacingMessage = '';

  if (isGoalMet) {
    paceStatus = 'COMPLETED';
    pacingMessage = `Cel zrealizowany! Ukończono ${completedCount} z ${targetBooks} książek w tym miesiącu.`;
  } else if (projectedPaceBooks >= targetBooks + 1) {
    paceStatus = 'AHEAD';
    pacingMessage = `Znakomite tempo! Estymacja: ~${projectedPaceBooks} książek do końca ${monthName.toLowerCase()}a.`;
  } else if (projectedPaceBooks >= targetBooks - 0.5) {
    paceStatus = 'ON_TRACK';
    pacingMessage = `Idziesz równym tempem (est. ~${projectedPaceBooks} ks.). Pozostało ${daysRemaining} dni.`;
  } else {
    paceStatus = 'BEHIND';
    const booksLeft = targetBooks - completedCount;
    pacingMessage = `Brakuje ${booksLeft} ${booksLeft === 1 ? 'książki' : 'książek'}. Zostało ${daysRemaining} dni do końca miesiąca.`;
  }

  return {
    targetBooks,
    completedCount,
    completedBooks: completedBooksList,
    inProgressBooks: inProgressBooksList.sort((a, b) => b.percentage - a.percentage),
    percentage,
    isGoalMet,
    daysInMonth,
    currentDay,
    daysRemaining,
    projectedPaceBooks,
    paceStatus,
    pacingMessage,
    monthName,
    year: goal.year
  };
}
