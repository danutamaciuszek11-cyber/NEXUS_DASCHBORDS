import React, { useState, useEffect } from 'react';
import { 
  X, 
  Command, 
  Keyboard, 
  Search, 
  Shuffle, 
  Volume2, 
  Sparkles, 
  Code2, 
  Sliders, 
  Bookmark, 
  Compass, 
  Maximize2,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { soundFx } from '../utils/audioSystem';

interface ShortcutItem {
  key: string;
  label: string;
  description: string;
  category: 'Navigation' | 'Actions' | 'Modals' | 'Seekers';
  badgeColor?: string;
}

const SHORTCUT_REGISTRY: ShortcutItem[] = [
  { key: '/', label: 'Przeszukaj Archiwum', description: 'Ustawia kursor w pasku wyszukiwania', category: 'Navigation' },
  { key: '?', label: 'Skróty Klawiszowe', description: 'Otwiera / zamyka ten przewodnik', category: 'Navigation', badgeColor: '#00f2ff' },
  { key: 'R', label: 'Losowe Dzieło', description: 'Wybiera losową książkę lub manifest', category: 'Actions', badgeColor: '#a855f7' },
  { key: 'Esc', label: 'Zamknij / Wstecz', description: 'Zamyka aktywne modale i odznacza pola', category: 'Navigation' },
  { key: 'M', label: 'Wycisz / Włącz Audio', description: 'Przełącza syntetyczne dźwięki interfejsu', category: 'Actions' },
  { key: 'F', label: 'Pełny Ekran', description: 'Przełącza tryb pełnoekranowy przeglądarki', category: 'Actions' },
  { key: 'B', label: 'Zakładki Rozdziałów', description: 'Zapisuj rozdziały w czytniku i skacz z paska bocznego', category: 'Actions', badgeColor: '#f59e0b' },
  { key: 'D', label: 'Baza Danych Firestore', description: 'Otwiera panel statusu, łącza i telemetrii bazy', category: 'Modals', badgeColor: '#10b981' },
  { key: 'A', label: 'Biblioteka Grafik Autora', description: 'Otwiera lokalną bazę grafik, SHA-256 i tokenizację NFT', category: 'Modals', badgeColor: '#00f2ff' },
  { key: 'H', label: 'Kreator Światów HTML', description: 'Otwiera studio manifestów z kodu HTML', category: 'Modals', badgeColor: '#ff3b3b' },
  { key: 'C', label: 'Kolekcje Pilota', description: 'Zarządzanie autorskimi kolekcjami', category: 'Modals' },
  { key: 'Q', label: 'Cytat Dnia', description: 'Wyświetla kwantowy cytat operacyjny', category: 'Modals' },
  { key: '0', label: 'Wszystkie Instancje', description: 'Resetuje filtr seekerów do ALL', category: 'Seekers' },
  { key: '1', label: 'Operator001', description: 'Filtr: Cyberbezpieczeństwo & Architektura', category: 'Seekers', badgeColor: '#ff3b3b' },
  { key: '2', label: 'InterSeeker', description: 'Filtr: Kwantowe AI & Świadomość', category: 'Seekers', badgeColor: '#00f2ff' },
  { key: '3', label: 'TabuSeeker', description: 'Filtr: Wiedza Ukryta & Cenzura', category: 'Seekers', badgeColor: '#a855f7' },
  { key: '4', label: 'BioSeeker', description: 'Filtr: Biologia Syntetyczna & DNA', category: 'Seekers', badgeColor: '#10b981' },
  { key: '5', label: 'ChronoSeeker', description: 'Filtr: Temporalność & Oś Czasu', category: 'Seekers', badgeColor: '#f59e0b' },
  { key: '6', label: 'EterSeeker', description: 'Filtr: Metafizyka & Dusza Maszyny', category: 'Seekers', badgeColor: '#ec4899' },
];

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Navigation' | 'Actions' | 'Modals' | 'Seekers'>('All');
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKey(e.key.toUpperCase());
      setTimeout(() => setPressedKey(null), 400);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = ['All', 'Navigation', 'Actions', 'Modals', 'Seekers'] as const;

  const filteredShortcuts = activeCategory === 'All' 
    ? SHORTCUT_REGISTRY 
    : SHORTCUT_REGISTRY.filter(s => s.category === activeCategory);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-zinc-950/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col max-h-[85vh] relative"
        onClick={e => e.stopPropagation()}
        style={{
          boxShadow: '0 0 40px rgba(0, 242, 255, 0.15), inset 0 0 20px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-red-500 via-cyan-400 to-purple-600" />

        {/* Modal Header */}
        <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black font-mono text-white tracking-wide uppercase">
                  PROTOKÓŁ KONTROLI KLAWIATURY
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  HUD QoL
                </span>
              </div>
              <p className="text-xs text-white/40 font-mono">
                Szybka nawigacja i skróty operacyjne ETERNIVERSE OS
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playModalClose();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors"
            title="Zamknij [Esc]"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Category Tabs Filter */}
        <div className="px-6 py-2.5 bg-zinc-900/60 border-b border-white/5 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playClick();
                setActiveCategory(cat);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all uppercase ${
                activeCategory === cat
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold shadow-sm shadow-cyan-900/50'
                  : 'text-white/50 hover:text-white/90 hover:bg-white/5'
              }`}
            >
              {cat === 'All' ? 'Wszystkie' : cat}
            </button>
          ))}

          {pressedKey && (
            <div className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30 animate-pulse shrink-0">
              <span>Wciśnięto:</span>
              <kbd className="px-1 py-0.2 bg-black border border-cyan-400 rounded text-cyan-300 font-bold">
                {pressedKey}
              </kbd>
            </div>
          )}
        </div>

        {/* Shortcuts List Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredShortcuts.map((item, index) => {
              const isHighlight = pressedKey === item.key.toUpperCase();

              return (
                <div
                  key={index}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isHighlight
                      ? 'bg-cyan-950/90 border-cyan-400 scale-[1.02] shadow-lg shadow-cyan-500/30'
                      : 'bg-zinc-900/50 border-white/10 hover:border-white/20 hover:bg-zinc-900/80'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-white font-mono truncate">
                        {item.label}
                      </span>
                      {item.badgeColor && (
                        <span 
                          className="w-1.5 h-1.5 rounded-full shrink-0" 
                          style={{ backgroundColor: item.badgeColor }}
                        />
                      )}
                    </div>
                    <p className="text-[11px] text-white/50 leading-tight">
                      {item.description}
                    </p>
                  </div>

                  <kbd 
                    className="px-2.5 py-1.5 rounded-lg bg-black border text-xs font-mono font-black text-cyan-300 shadow-inner flex items-center justify-center shrink-0 min-w-[32px]"
                    style={{
                      borderColor: item.badgeColor || 'rgba(0, 242, 255, 0.4)',
                      boxShadow: '0 2px 0 rgba(0, 0, 0, 0.8)'
                    }}
                  >
                    {item.key}
                  </kbd>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <footer className="px-6 py-3 bg-black/60 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Naciśnij dowolny klawisz, aby sprawdzić interakcję</span>
          </div>

          <div className="flex items-center gap-1 text-white/60">
            <span>Naciśnij</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/20 text-white text-[10px]">?</kbd>
            <span>w dowolnym momencie</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
