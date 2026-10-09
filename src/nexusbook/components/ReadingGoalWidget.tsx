import React, { useState, useEffect } from 'react';
import {
  Target,
  CheckCircle2,
  Award,
  Sparkles,
  Plus,
  Minus,
  Edit3,
  Calendar,
  Flame,
  BookOpen,
  TrendingUp,
  Clock,
  Zap,
  Check,
  RotateCcw,
  BookMarked
} from 'lucide-react';
import { Book } from '../types';
import { soundFx } from '../utils/audioSystem';
import {
  getStoredReadingGoal,
  saveStoredReadingGoal,
  calculateGoalProgress,
  MonthlyReadingGoal,
  GoalProgressResult,
  toggleBookCompletedForGoal
} from '../utils/readingGoalStorage';

interface ReadingGoalWidgetProps {
  books: Book[];
  onSelectBook?: (book: Book) => void;
  className?: string;
  variant?: 'full' | 'compact';
}

export const ReadingGoalWidget: React.FC<ReadingGoalWidgetProps> = ({
  books = [],
  onSelectBook,
  className = '',
  variant = 'full'
}) => {
  const [goal, setGoal] = useState<MonthlyReadingGoal>(getStoredReadingGoal);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempTarget, setTempTarget] = useState<number>(goal.targetBooks);
  const [showCompletedList, setShowCompletedList] = useState<boolean>(false);
  const [showInProgressList, setShowInProgressList] = useState<boolean>(false);

  // Synchronize with storage updates
  useEffect(() => {
    const handleUpdate = () => {
      setGoal(getStoredReadingGoal());
    };

    window.addEventListener('nexus:reading_goal_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('nexus:reading_goal_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const progress: GoalProgressResult = calculateGoalProgress(books, goal);

  const handleSaveTarget = (newTarget: number) => {
    soundFx.playSuccess();
    const updated = saveStoredReadingGoal({ targetBooks: newTarget });
    setGoal(updated);
    setTempTarget(updated.targetBooks);
    setIsEditing(false);
  };

  const handleQuickPreset = (val: number) => {
    soundFx.playClick();
    setTempTarget(val);
    handleSaveTarget(val);
  };

  const handleToggleCompleted = (bookId: string) => {
    soundFx.playClick();
    toggleBookCompletedForGoal(bookId);
    setGoal(getStoredReadingGoal());
  };

  const statusConfig = {
    COMPLETED: {
      badge: 'CEL OSIĄGNIĘTY 🏆',
      bg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
      barColor: 'from-emerald-400 via-teal-400 to-cyan-400',
      glow: 'shadow-emerald-500/30'
    },
    AHEAD: {
      badge: 'WYPRZEDZASZ PLAN ⚡',
      bg: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300',
      barColor: 'from-cyan-400 via-blue-500 to-indigo-500',
      glow: 'shadow-cyan-500/30'
    },
    ON_TRACK: {
      badge: 'RÓWNE TEMPO ✨',
      bg: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
      barColor: 'from-amber-400 via-orange-400 to-yellow-400',
      glow: 'shadow-amber-500/30'
    },
    BEHIND: {
      badge: 'WYMAGA SKUPIENIA ⏳',
      bg: 'bg-purple-950/80 border-purple-500/40 text-purple-300',
      barColor: 'from-purple-500 via-pink-500 to-rose-400',
      glow: 'shadow-purple-500/30'
    }
  };

  const currentStatus = statusConfig[progress.paceStatus];

  return (
    <div
      className={`rounded-3xl bg-gradient-to-b from-[#091122]/95 to-[#040711]/95 border border-cyan-500/30 p-5 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl ${className}`}
    >
      {/* Background Decorative Ambient Radial Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Target className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                MIESIĘCZNY CEL CZYTELNICZY
                <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 border border-white/10 uppercase">
                  {progress.monthName} {progress.year}
                </span>
              </h4>
            </div>
            <p className="text-xs text-stone-400">
              Personalizowany target wolumenu przeczytanych dzieł i telemetria tempa
            </p>
          </div>
        </div>

        {/* Goal Action Buttons */}
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${currentStatus.bg}`}>
            {currentStatus.badge}
          </span>

          <button
            onClick={() => {
              soundFx.playModalOpen();
              setIsEditing(!isEditing);
              setTempTarget(goal.targetBooks);
            }}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-cyan-300 flex items-center gap-1.5 transition-all font-bold cursor-pointer"
            title="Dostosuj miesięczny cel"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Zamknij' : 'Zmień Cel'}</span>
          </button>
        </div>
      </div>

      {/* Target Editor Drawer (Inline) */}
      {isEditing && (
        <div className="relative z-10 my-4 p-4 rounded-2xl bg-black/80 border border-cyan-500/40 space-y-3 font-mono animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Ustaw docelową liczbę książek na {progress.monthName.toLowerCase()}:</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTempTarget(Math.max(1, tempTarget - 1))}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-xl font-black text-cyan-300">
                {tempTarget}
              </span>
              <button
                onClick={() => setTempTarget(Math.min(50, tempTarget + 1))}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSaveTarget(tempTarget)}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold shadow-lg shadow-cyan-500/20 cursor-pointer ml-2"
              >
                Zapisz
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-[11px]">
            <span className="text-stone-400">Szybkie ustawienia:</span>
            {[2, 4, 6, 8, 12].map((preset) => (
              <button
                key={preset}
                onClick={() => handleQuickPreset(preset)}
                className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  goal.targetBooks === preset
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 font-bold'
                    : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                }`}
              >
                {preset} {preset === 2 || preset === 4 ? 'książki' : 'książek'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Progress Metric Hero Display */}
      <div className="relative z-10 py-4 space-y-4 font-mono">
        
        {/* Counter and Percent Row */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[11px] text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>Stan Realizacji Celu:</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {progress.completedCount}
              </span>
              <span className="text-lg sm:text-xl font-bold text-stone-400">
                / {progress.targetBooks} {progress.targetBooks === 1 ? 'książka' : progress.targetBooks < 5 ? 'książki' : 'książek'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300 tracking-tight">
              {progress.percentage}%
            </div>
            <div className="text-[11px] text-stone-400">
              Pozostało: <strong className="text-white">{progress.daysRemaining} dni</strong> do końca miesiąca
            </div>
          </div>
        </div>

        {/* Dynamic Glowing Progress Bar Container */}
        <div className="space-y-1.5">
          <div className="w-full h-4 sm:h-5 rounded-full bg-black/60 border border-white/10 p-0.5 overflow-hidden shadow-inner relative">
            
            {/* Background Milestone Tick Lines (25%, 50%, 75%) */}
            <div className="absolute inset-0 flex justify-between px-[25%] pointer-events-none opacity-20">
              <div className="w-px h-full bg-white" />
              <div className="w-px h-full bg-white" />
              <div className="w-px h-full bg-white" />
            </div>

            {/* Filled Progress Gradient Bar */}
            <div
              className={`h-full rounded-full bg-gradient-to-r ${currentStatus.barColor} transition-all duration-1000 ease-out relative shadow-lg ${
                progress.isGoalMet ? 'animate-pulse shadow-emerald-500/50' : ''
              }`}
              style={{ width: `${Math.max(4, progress.percentage)}%` }}
            >
              {/* Shimmer Light Reflection */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
            </div>
          </div>

          {/* Milestone Labels */}
          <div className="flex justify-between text-[10px] text-stone-500 font-mono px-1">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span className={progress.isGoalMet ? 'text-emerald-400 font-bold' : ''}>
              100% {progress.isGoalMet ? '🎉' : '🎯'}
            </span>
          </div>
        </div>

        {/* Telemetry Pacing & Insight Message Box */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-stone-300">
            <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{progress.pacingMessage}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px] text-stone-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dzień <strong>{progress.currentDay}/{progress.daysInMonth}</strong></span>
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Estymacja: <strong>~{progress.projectedPaceBooks} ks.</strong></span>
            </span>
          </div>
        </div>

      </div>

      {/* Accordion / Tab toggles for Completed & In-Progress Books */}
      {variant === 'full' && (
        <div className="relative z-10 pt-3 border-t border-white/10 space-y-3 font-mono text-xs">
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowCompletedList(!showCompletedList);
                }}
                className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
                  showCompletedList
                    ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-stone-400 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ukończone Dzieła ({progress.completedBooks.length})</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowInProgressList(!showInProgressList);
                }}
                className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
                  showInProgressList
                    ? 'bg-cyan-950 border-cyan-500/50 text-cyan-300'
                    : 'bg-white/5 border-white/10 text-stone-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>W Trakcie Czytania ({progress.inProgressBooks.length})</span>
              </button>

            </div>

            <div className="text-[11px] text-stone-500">
              Kliknij książkę, aby otworzyć czytnik lub oznaczyć postęp
            </div>
          </div>

          {/* Completed Books List Expandable */}
          {showCompletedList && (
            <div className="p-3.5 rounded-2xl bg-black/60 border border-emerald-500/30 space-y-2 animate-in fade-in duration-200">
              {progress.completedBooks.length === 0 ? (
                <div className="text-stone-500 text-center py-2">
                  Brak ukończonych książek w bieżącym miesiącu. Przeczytaj wszystkie rozdziały lub oznacz dzieło poniżej.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {progress.completedBooks.map(b => (
                    <div
                      key={b.id}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/40 flex items-center justify-between gap-2 group transition-all"
                    >
                      <div 
                        onClick={() => onSelectBook?.(b)}
                        className="flex items-center gap-2 min-w-0 cursor-pointer flex-1"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                            {b.title}
                          </p>
                          <p className="text-[10px] text-stone-400 truncate">
                            {b.series || b.subtitle || 'Dzieło ukończone'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleCompleted(b.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-stone-400 hover:text-red-300 transition-colors cursor-pointer"
                        title="Usuń z ukończonych w tym miesiącu"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* In-Progress Books List Expandable */}
          {showInProgressList && (
            <div className="p-3.5 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-2 animate-in fade-in duration-200">
              {progress.inProgressBooks.length === 0 ? (
                <div className="text-stone-500 text-center py-2">
                  Brak otwartych książek z częściowym postępem. Otwórz dowolne dzieło w czytniku, aby rozpocząć!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {progress.inProgressBooks.map(({ book, percentage, readChaptersCount }) => (
                    <div
                      key={book.id}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 flex flex-col justify-between gap-2 group transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div 
                          onClick={() => onSelectBook?.(book)}
                          className="min-w-0 cursor-pointer flex-1"
                        >
                          <p className="font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                            {book.title}
                          </p>
                          <p className="text-[10px] text-stone-400">
                            {readChaptersCount} / {book.chapters?.length || 0} rozdz. ({percentage}%)
                          </p>
                        </div>

                        <button
                          onClick={() => handleToggleCompleted(book.id)}
                          className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold transition-all cursor-pointer shrink-0"
                          title="Oznacz całość jako przeczytaną na ten miesiąc"
                        >
                          Oznacz 100%
                        </button>
                      </div>

                      {/* Mini Progress Bar */}
                      <div className="w-full h-1.5 rounded-full bg-stone-900 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
