import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  Zap, 
  X, 
  Tag,
  ArrowRight
} from 'lucide-react';
import { Book } from '../types';
import { soundFx } from '../utils/audioSystem';

interface TimelineViewProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export type TimelineEra = 'ALL' | '2024' | '2025' | '2026' | '2027';
export type ZoomLevel = 'compact' | 'normal' | 'expanded';

interface TimelineEventDetail {
  id: string;
  year: number;
  title: string;
  subtitle?: string;
  description: string;
  book?: Book;
  tag: string;
  significance: 'CRITICAL_NODE' | 'MILESTONE' | 'PUBLICATION';
}

export const TimelineView: React.FC<TimelineViewProps> = ({ books, onSelectBook }) => {
  const [selectedEra, setSelectedEra] = useState<TimelineEra>('ALL');
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('normal');
  const [timelineSearch, setTimelineSearch] = useState('');
  const [inspectedEvent, setInspectedEvent] = useState<TimelineEventDetail | null>(null);

  // ChronoSeeker Theme Colors
  const CHRONO_COLOR = '#a855f7'; // Purple / Violet

  // Generate timeline events from books + key milestones
  const timelineEvents: TimelineEventDetail[] = React.useMemo(() => {
    const list: TimelineEventDetail[] = [
      {
        id: 'evt_2024_init',
        year: 2024,
        title: 'Aktywacja Protokołu Eterniverse OS',
        subtitle: 'Narodziny pierwszego węzła wiedzy',
        description: 'Pierwsza krystalizacja idei suwerenności intelektualnej i inicjacja systemu ośmiu Brama-Seekerów.',
        tag: 'SYSTEM_INIT',
        significance: 'CRITICAL_NODE'
      },
      ...books.map(b => ({
        id: `evt_book_${b.id}`,
        year: b.year,
        title: b.title,
        subtitle: b.subtitle,
        description: b.shortDesc,
        book: b,
        tag: b.seeker,
        significance: 'PUBLICATION' as const
      })),
      {
        id: 'evt_2027_singularity',
        year: 2027,
        title: 'Punkt Osobliwości Archivalnej',
        subtitle: 'Pełna synchroniczność z umysłem cyfrowym',
        description: 'Planowana konwergencja wszystkich manifestów autorskich i otwarcie bezgranicznej biblioteki.',
        tag: 'FUTURE_NODE',
        significance: 'MILESTONE'
      }
    ];

    return list.sort((a, b) => a.year - b.year);
  }, [books]);

  // Filter events by Era and Search
  const filteredEvents = timelineEvents.filter(evt => {
    const matchesEra = selectedEra === 'ALL' || (selectedEra === '2027' ? evt.year >= 2027 : evt.year === parseInt(selectedEra));
    const matchesSearch = !timelineSearch.trim() || 
      evt.title.toLowerCase().includes(timelineSearch.toLowerCase()) ||
      evt.description.toLowerCase().includes(timelineSearch.toLowerCase()) ||
      evt.tag.toLowerCase().includes(timelineSearch.toLowerCase());
    return matchesEra && matchesSearch;
  });

  const yearsList = [2024, 2025, 2026, 2027];

  return (
    <div className="w-full rounded-2xl bg-black/40 backdrop-blur-md border border-purple-500/20 p-6 space-y-6 shadow-2xl relative overflow-hidden font-mono">
      
      {/* Background Animated Data Stream grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'radial-gradient(#a855f7 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-500/20 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-bold tracking-wider text-sm">
            <Zap className="w-4 h-4 animate-pulse" />
            <h2 className="uppercase">CHRONOSEEKER • TIMEFLOW TRAJECTORY & CHRONOLOGY</h2>
          </div>
          <p className="text-[10px] text-white/40 mt-0.5">
            Interaktywny osiowy moduł wydań i milowych punktów w latach 2024–2027+
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Era Filter Selector */}
          <div className="flex items-center bg-white/5 border border-purple-500/30 rounded-lg p-0.5 text-[10px]">
            <span className="px-2 text-white/40 uppercase font-bold">ERA:</span>
            {(['ALL', '2024', '2025', '2026', '2027'] as const).map(era => (
              <button
                key={era}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedEra(era);
                }}
                className={`px-2 py-1 rounded transition-all ${
                  selectedEra === era
                    ? 'bg-purple-600 text-white font-bold shadow-md'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {era === 'ALL' ? 'Wszystkie' : era === '2027' ? '2027+' : era}
              </button>
            ))}
          </div>

          {/* Zoom Level Control */}
          <div className="flex items-center bg-white/5 border border-purple-500/30 rounded-lg p-1 text-[10px] gap-1">
            <button
              onClick={() => {
                soundFx.playClick();
                setZoomLevel(prev => prev === 'expanded' ? 'normal' : 'compact');
              }}
              className="p-1 rounded hover:bg-white/10 text-white/70"
              title="Zmniejsz widok"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-purple-300 font-bold uppercase">{zoomLevel}</span>
            <button
              onClick={() => {
                soundFx.playClick();
                setZoomLevel(prev => prev === 'compact' ? 'normal' : 'expanded');
              }}
              className="p-1 rounded hover:bg-white/10 text-white/70"
              title="Powiększ widok"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Timeline Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Filtruj oś..."
              value={timelineSearch}
              onChange={(e) => setTimelineSearch(e.target.value)}
              className="bg-white/5 border border-purple-500/30 rounded-lg py-1 pl-8 pr-3 text-[10px] text-white placeholder:text-white/30 outline-none focus:border-purple-400 w-32"
            />
          </div>

        </div>
      </div>

      {/* Main Interactive Timeline Axis */}
      <div className="relative pt-6 pb-4 overflow-x-auto custom-scrollbar">
        
        {/* Glowing Purple Core Stream Line */}
        <div 
          className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-purple-700 via-purple-500 to-indigo-500 shadow-[0_0_15px_#a855f7] pointer-events-none rounded-full"
        />

        {/* Timeline Columns by Year */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 min-w-[750px] relative z-10 transition-all duration-300 ${
          zoomLevel === 'compact' ? 'gap-3' : zoomLevel === 'expanded' ? 'gap-8' : 'gap-6'
        }`}>
          {yearsList.map(yr => {
            const yrEvents = filteredEvents.filter(e => e.year === yr || (yr === 2027 && e.year > 2027));
            const isSelectedYear = selectedEra === 'ALL' || selectedEra === yr.toString();

            return (
              <div 
                key={yr}
                className={`space-y-4 transition-opacity duration-300 ${
                  isSelectedYear ? 'opacity-100' : 'opacity-40'
                }`}
              >
                {/* Year Node Badge Header */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center shadow-[0_0_10px_#a855f7] shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  </div>
                  <span className="text-xl font-black text-white tracking-tighter">
                    {yr === 2027 ? '2027+' : yr}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300">
                    {yrEvents.length} pozycji
                  </span>
                </div>

                {/* Event Cards List */}
                <div className="space-y-3 pt-2">
                  {yrEvents.length === 0 ? (
                    <div className="p-4 rounded-xl bg-white/5 border border-purple-500/10 text-center font-mono text-[10px] text-white/30">
                      BRAK ZAPISÓW DLA TEJ ERY
                    </div>
                  ) : (
                    yrEvents.map(evt => {
                      const isBook = !!evt.book;
                      const bookColor = evt.book?.seekerColor || CHRONO_COLOR;

                      return (
                        <div
                          key={evt.id}
                          onClick={() => {
                            soundFx.playClick();
                            setInspectedEvent(evt);
                          }}
                          className={`group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer shadow-lg hover:scale-[1.02] ${
                            zoomLevel === 'compact' ? 'p-2 space-y-1' : 'p-4 space-y-2'
                          } ${
                            evt.significance === 'CRITICAL_NODE'
                              ? 'bg-purple-950/60 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                              : 'bg-white/5 border-white/10 hover:border-purple-400/50 hover:bg-purple-500/10'
                          }`}
                          style={{
                            borderLeftWidth: '4px',
                            borderLeftColor: bookColor
                          }}
                        >
                          {/* Tag & Type */}
                          <div className="flex items-center justify-between text-[9px] font-mono">
                            <span className="font-bold uppercase" style={{ color: bookColor }}>
                              {evt.tag}
                            </span>
                            <span className="text-white/40">
                              {evt.year}
                            </span>
                          </div>

                          {/* Event Title */}
                          <h4 className="font-bold text-xs text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                            {evt.title}
                          </h4>

                          {/* Subtitle / Description preview in normal/expanded zoom */}
                          {zoomLevel !== 'compact' && (
                            <p className="text-[10px] text-white/50 line-clamp-2 font-sans">
                              {evt.subtitle || evt.description}
                            </p>
                          )}

                          {/* Action Hint */}
                          <div className="pt-1 flex items-center justify-between text-[9px] text-purple-400 font-bold opacity-80 group-hover:opacity-100">
                            <span>{isBook ? 'CZYTAJ KSIĄŻKĘ' : 'SZCZEGÓŁY WĘZŁA'}</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Event Inspector Modal Popup */}
      {inspectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-slate-950 border border-purple-500/40 shadow-2xl overflow-hidden font-mono text-xs">
            
            <div className="p-4 border-b border-purple-500/20 bg-purple-950/40 flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>CHRONOSEEKER • EVENT INSPECTOR</span>
              </div>
              <button
                onClick={() => {
                  soundFx.playModalClose();
                  setInspectedEvent(null);
                }}
                className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-[10px] text-purple-400 font-bold">
                <span>WĘZEŁ ARCHIWALNY #{inspectedEvent.id}</span>
                <span>ROK {inspectedEvent.year}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{inspectedEvent.title}</h3>
                {inspectedEvent.subtitle && (
                  <p className="text-xs text-purple-300 mt-0.5">{inspectedEvent.subtitle}</p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs font-sans leading-relaxed">
                {inspectedEvent.description}
              </div>

              {inspectedEvent.book && (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase text-purple-400 font-bold">Powiązana Dzieło</span>
                    <h5 className="font-bold text-xs text-white truncate">{inspectedEvent.book.title}</h5>
                    <p className="text-[10px] text-white/40">{inspectedEvent.book.stats.pageCount} stron • {inspectedEvent.book.language}</p>
                  </div>
                  <button
                    onClick={() => {
                      soundFx.playModalOpen();
                      const b = inspectedEvent.book!;
                      setInspectedEvent(null);
                      onSelectBook(b);
                    }}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-lg"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Otwórz</span>
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-purple-500/20 bg-black/40 flex justify-end">
              <button
                onClick={() => setInspectedEvent(null)}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold"
              >
                Zamknij
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
