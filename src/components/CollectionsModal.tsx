import React, { useState } from 'react';
import { 
  X, 
  FolderPlus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Edit3, 
  BookOpen, 
  Shield, 
  Cpu, 
  Sparkles, 
  Flame, 
  Hourglass, 
  Layers, 
  Compass, 
  TrendingUp, 
  Bookmark, 
  Check, 
  Plus, 
  FileText,
  Star,
  Zap,
  Download,
  FileJson,
  Search,
  Sliders,
  CheckSquare,
  Square
} from 'lucide-react';
import { BookCollection, Book } from '../types';
import { soundFx } from '../utils/audioSystem';

interface CollectionsModalProps {
  collections: BookCollection[];
  allBooks: Book[];
  activeCollectionId: string | null;
  onSelectCollectionFilter: (collectionId: string | null) => void;
  onCreateCollection: (newCol: Omit<BookCollection, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateCollection: (id: string, updates: Partial<BookCollection>) => void;
  onDeleteCollection: (id: string) => void;
  onToggleBookInCollection?: (collectionId: string, bookId: string) => void;
  onRemoveBookFromCollection: (collectionId: string, bookId: string) => void;
  onReorderBookInCollection: (collectionId: string, fromIndex: number, toIndex: number) => void;
  onOpenBook: (book: Book) => void;
  onClose: () => void;
}

const COLOR_PRESETS = [
  '#a855f7', // Purple
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
  '#64748b'  // Slate
];

const ICON_OPTIONS = [
  { id: 'Bookmark', label: 'Zakładka', icon: Bookmark },
  { id: 'Shield', label: 'Tarcza', icon: Shield },
  { id: 'Cpu', label: 'Procesor', icon: Cpu },
  { id: 'Sparkles', label: 'Synapsy', icon: Sparkles },
  { id: 'Flame', label: 'Płomień', icon: Flame },
  { id: 'Hourglass', label: 'Klepsydra', icon: Hourglass },
  { id: 'Star', label: 'Gwiazda', icon: Star },
  { id: 'Zap', label: 'Energia', icon: Zap },
];

export const CollectionsModal: React.FC<CollectionsModalProps> = ({
  collections,
  allBooks,
  activeCollectionId,
  onSelectCollectionFilter,
  onCreateCollection,
  onUpdateCollection,
  onDeleteCollection,
  onToggleBookInCollection,
  onRemoveBookFromCollection,
  onReorderBookInCollection,
  onOpenBook,
  onClose
}) => {
  const [selectedColId, setSelectedColId] = useState<string>(
    activeCollectionId || (collections.length > 0 ? collections[0].id : '')
  );

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddBookPicker, setShowAddBookPicker] = useState(false);
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form states for creation/editing
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formColor, setFormColor] = useState(COLOR_PRESETS[0]);
  const [formIcon, setFormIcon] = useState('Bookmark');
  const [formNotes, setFormNotes] = useState('');
  const [formType, setFormType] = useState<'Kolekcja' | 'Sekwencyjna'>('Kolekcja');
  const [formStatus, setFormStatus] = useState<'W trakcie' | 'Ukończone'>('W trakcie');
  const [formTotalExpected, setFormTotalExpected] = useState<string>('');
  const [formUniverse, setFormUniverse] = useState<string>('');

  const currentCol = collections.find(c => c.id === selectedColId);

  const renderIcon = (iconName: string, className = 'w-4 h-4', style?: React.CSSProperties) => {
    switch (iconName) {
      case 'Shield': return <Shield className={className} style={style} />;
      case 'Cpu': return <Cpu className={className} style={style} />;
      case 'Sparkles': return <Sparkles className={className} style={style} />;
      case 'Flame': return <Flame className={className} style={style} />;
      case 'Hourglass': return <Hourglass className={className} style={style} />;
      case 'Star': return <Star className={className} style={style} />;
      case 'Zap': return <Zap className={className} style={style} />;
      default: return <Bookmark className={className} style={style} />;
    }
  };

  const handleStartCreate = () => {
    soundFx.playClick();
    setFormName('');
    setFormDesc('');
    setFormColor(COLOR_PRESETS[0]);
    setFormIcon('Bookmark');
    setFormNotes('');
    setFormType('Kolekcja');
    setFormStatus('W trakcie');
    setFormTotalExpected('');
    setFormUniverse('');
    setIsEditing(false);
    setIsCreating(true);
  };

  const handleStartEdit = (col: BookCollection) => {
    soundFx.playClick();
    setFormName(col.name);
    setFormDesc(col.description || '');
    setFormColor(col.color || COLOR_PRESETS[0]);
    setFormIcon(col.icon || 'Bookmark');
    setFormNotes(col.notes || '');
    setFormType(col.type || 'Kolekcja');
    setFormStatus(col.status || 'W trakcie');
    setFormTotalExpected(col.totalExpected ? String(col.totalExpected) : '');
    setFormUniverse(col.universe || '');
    setIsCreating(false);
    setIsEditing(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    soundFx.playAddToCollection();
    onCreateCollection({
      name: formName.trim(),
      description: formDesc.trim(),
      color: formColor,
      icon: formIcon,
      notes: formNotes.trim(),
      type: formType,
      status: formStatus,
      totalExpected: formTotalExpected ? parseInt(formTotalExpected, 10) : undefined,
      universe: formUniverse.trim() || undefined,
      bookIds: []
    });

    setIsCreating(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !currentCol) return;

    soundFx.playClick();
    onUpdateCollection(currentCol.id, {
      name: formName.trim(),
      description: formDesc.trim(),
      color: formColor,
      icon: formIcon,
      notes: formNotes.trim(),
      type: formType,
      status: formStatus,
      totalExpected: formTotalExpected ? parseInt(formTotalExpected, 10) : undefined,
      universe: formUniverse.trim() || undefined
    });

    setIsEditing(false);
  };

  const handleDeleteConfirmed = (id: string) => {
    soundFx.playDelete();
    onDeleteCollection(id);
    setConfirmDeleteId(null);
    if (collections.length > 1) {
      const remaining = collections.filter(c => c.id !== id);
      setSelectedColId(remaining[0]?.id || '');
    } else {
      setSelectedColId('');
    }
  };

  const handleAddBookToCurrent = (bookId: string) => {
    if (!currentCol) return;
    soundFx.playAddToCollection();
    if (onToggleBookInCollection) {
      onToggleBookInCollection(currentCol.id, bookId);
    } else {
      onUpdateCollection(currentCol.id, {
        bookIds: [...currentCol.bookIds, bookId]
      });
    }
  };

  // Filter available books to add to current collection
  const availableBooksToAdd = allBooks.filter(b => {
    if (!currentCol) return false;
    const notInCollection = !currentCol.bookIds.includes(b.id);
    if (!bookSearchQuery.trim()) return notInCollection;
    const q = bookSearchQuery.toLowerCase();
    return notInCollection && (
      b.title.toLowerCase().includes(q) ||
      b.seeker.toLowerCase().includes(q) ||
      b.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  const handleExportJSON = (col: BookCollection) => {
    soundFx.playExport();
    const collectionBooks = (col.bookIds || [])
      .map(id => allBooks.find(b => b.id === id))
      .filter((b): b is Book => b !== undefined);

    const exportData = {
      system: 'NEXUSBOOK ARCHIVAL SUITE',
      version: '2.6',
      exportDate: new Date().toISOString(),
      collection: {
        id: col.id,
        name: col.name,
        description: col.description,
        color: col.color,
        icon: col.icon,
        notes: col.notes || '',
        createdAt: col.createdAt,
        updatedAt: col.updatedAt,
        bookCount: collectionBooks.length
      },
      books: collectionBooks.map(b => ({
        id: b.id,
        title: b.title,
        subtitle: b.subtitle,
        seeker: b.seeker,
        status: b.status,
        year: b.year,
        pages: b.stats.pageCount,
        tags: b.tags,
        language: b.language,
        summary: b.shortDesc,
        quotes: b.quotes,
        chapters: b.chapters.map(c => ({
          number: c.number,
          title: c.title,
          readTimeMin: c.readTimeMin,
          summary: c.summary
        }))
      }))
    };

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusbook_kolekcja_${col.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportTXT = (col: BookCollection) => {
    soundFx.playExport();
    const collectionBooks = (col.bookIds || [])
      .map(id => allBooks.find(b => b.id === id))
      .filter((b): b is Book => b !== undefined);

    let report = `================================================================================\n`;
    report += `NEXUSBOOK ARCHIVAL DOSSIER: RAPORT KOLEKCJONERSKI\n`;
    report += `================================================================================\n`;
    report += `Nazwa Kolekcji:  ${col.name}\n`;
    report += `Opis:            ${col.description || 'Brak opisu'}\n`;
    report += `Identyfikator:   ${col.id}\n`;
    report += `Liczba Pozycji:  ${collectionBooks.length}\n`;
    report += `Data Generowania: ${new Date().toLocaleString('pl-PL')}\n`;
    report += `Uwagi Zbiorcze:   ${col.notes || 'Brak dodatkowych uwag.'}\n\n`;

    report += `--------------------------------------------------------------------------------\n`;
    report += `KATALOG BOOK METADATA (${collectionBooks.length}):\n`;
    report += `--------------------------------------------------------------------------------\n\n`;

    collectionBooks.forEach((b, idx) => {
      report += `[POZYCJA #${idx + 1}] ${b.title.toUpperCase()}\n`;
      report += `--------------------------------------------------\n`;
      report += `Podtytuł:       ${b.subtitle || 'Brak'}\n`;
      report += `Wrota Seekera:  ${b.seeker}\n`;
      report += `Status:         ${b.status} | Rok: ${b.year} | Strony: ${b.stats.pageCount} | Język: ${b.language}\n`;
      report += `Kategorie/Tagi: ${b.tags.join(', ')}\n`;
      report += `Opis Skrócony:  ${b.shortDesc}\n\n`;
      
      report += `Spis Rozdziałów (${b.chapters.length}):\n`;
      b.chapters.forEach(c => {
        report += `  - Rozdział 0${c.number}: ${c.title} (${c.readTimeMin} min)\n`;
      });

      if (b.quotes.length > 0) {
        report += `\nWyróżnione Cytaty:\n`;
        b.quotes.forEach(q => {
          report += `  • "${q.text}"\n`;
        });
      }
      report += `\n` + `=`.repeat(80) + `\n\n`;
    });

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusbook_kolekcja_${col.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-hidden animate-in fade-in duration-300">
      
      <div className="w-full max-w-5xl h-[88vh] rounded-3xl bg-slate-950 border border-white/10 shadow-2xl overflow-hidden flex flex-col font-mono text-xs">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-black/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white shadow-lg">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">AUTORSKIE KOLEKCJE NEXUSBOOK</h2>
              <p className="text-[10px] text-white/40">Twórz, zmieniaj nazwy i zarządzaj spersonalizowanymi zbiorami wiedzy</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartCreate}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer text-xs"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Nowa Kolekcja</span>
            </button>

            <button
              onClick={() => {
                soundFx.playModalClose();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content - Split Layout */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          
          {/* Left Panel: List of Collections */}
          <div className="w-full md:w-80 border-r border-white/10 bg-black/25 p-4 space-y-3 overflow-y-auto shrink-0 custom-scrollbar">
            
            <div className="flex items-center justify-between text-[10px] uppercase text-white/40 tracking-wider font-bold mb-1">
              <span>Twoje Kolekcje ({collections.length})</span>
            </div>

            {collections.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-white/10 rounded-2xl text-white/40 space-y-2">
                <Bookmark className="w-6 h-6 mx-auto opacity-30" />
                <p className="text-xs">Brak kolekcji.</p>
                <button
                  onClick={handleStartCreate}
                  className="px-3 py-1.5 bg-purple-600 text-white font-bold rounded-lg text-[10px]"
                >
                  + Stwórz pierwszą
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {collections.map((col) => {
                  const isSelected = selectedColId === col.id && !isCreating;
                  const count = col.bookIds.length;

                  return (
                    <div
                      key={col.id}
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedColId(col.id);
                        setIsCreating(false);
                        setIsEditing(false);
                        setShowAddBookPicker(false);
                      }}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start justify-between gap-2 group cursor-pointer ${
                        isSelected
                          ? 'bg-white/10 border-white/30 text-white shadow-lg'
                          : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                      style={{
                        borderLeftWidth: '4px',
                        borderLeftColor: col.color
                      }}
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <div className="p-2 rounded-xl bg-black/50 mt-0.5 shrink-0" style={{ color: col.color }}>
                          {renderIcon(col.icon)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs truncate text-white">{col.name}</div>
                          <p className="text-[10px] text-white/40 line-clamp-1 mt-0.5 font-sans">
                            {col.description || 'Brak opisu'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-bold shrink-0">
                        {count} {count === 1 ? 'księga' : 'ksiąg'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Panel: Content / Form / Details */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-slate-950 flex flex-col space-y-6">
            
            {/* Create / Edit Collection Form */}
            {isCreating || isEditing ? (
              <form onSubmit={isCreating ? handleCreateSubmit : handleEditSubmit} className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider text-purple-400">
                      {isCreating ? 'Tworzenie Nowej Kolekcji' : 'Edycja & Zmiana Nazwy Kolekcji'}
                    </h3>
                    <p className="text-[10px] text-white/50">
                      {isCreating 
                        ? 'Zdefiniuj nazwę, opis, kolor, ikonę i notatki' 
                        : 'Zaktualizuj nazwę, metadane i atrybuty wizualne'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                    }}
                    className="text-xs text-white/40 hover:text-white"
                  >
                    Anuluj
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1 font-bold">
                      Nazwa Kolekcji *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="np. Cybernetyka & AI, Gnoza i Metafizyka..."
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:border-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1 font-bold">
                      Krótki Opis Kolekcji
                    </label>
                    <input
                      type="text"
                      placeholder="Krótkie podsumowanie idei i motywu przewodniego..."
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:border-purple-500 outline-none"
                    />
                  </div>

                  {/* Color Picker */}
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1 font-bold">
                      Kolor Akcentu
                    </label>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {COLOR_PRESETS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormColor(color)}
                          className={`w-8 h-8 rounded-xl border-2 transition-transform cursor-pointer ${
                            formColor === color ? 'scale-110 border-white shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Icon Picker */}
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1 font-bold">
                      Wybierz Ikonę
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {ICON_OPTIONS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormIcon(item.id)}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                            formIcon === item.id
                              ? 'bg-purple-950 border-purple-500 text-purple-300 font-bold shadow'
                              : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="text-[11px]">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Series Metadata: Type, Status, Expected Total, Universe */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div>
                      <label className="block text-[10px] uppercase text-white/50 mb-1 font-bold">
                        Typ Struktury
                      </label>
                      <div className="flex gap-2">
                        {(['Kolekcja', 'Sekwencyjna'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setFormType(t)}
                            className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-mono transition-all ${
                              formType === t
                                ? 'bg-purple-600 text-white font-bold border-purple-400 shadow'
                                : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-white/50 mb-1 font-bold">
                        Status Publikacji
                      </label>
                      <div className="flex gap-2">
                        {(['W trakcie', 'Ukończone'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setFormStatus(st)}
                            className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-mono transition-all ${
                              formStatus === st
                                ? 'bg-cyan-600 text-white font-bold border-cyan-400 shadow'
                                : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-white/50 mb-1 font-bold">
                        Planowana Liczba Dzieł (np. 80, 14, 1)
                      </label>
                      <input
                        type="number"
                        placeholder="np. 80"
                        value={formTotalExpected}
                        onChange={(e) => setFormTotalExpected(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder:text-white/30 focus:border-purple-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-white/50 mb-1 font-bold">
                        Uniwersum / Ekosystem (np. ETERIVERSE)
                      </label>
                      <input
                        type="text"
                        placeholder="np. Eteruniverse - Świat Psyche"
                        value={formUniverse}
                        onChange={(e) => setFormUniverse(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder:text-white/30 focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1 font-bold">
                      Notatki & Uwagi Kanoniczne
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Wpisz swoje uwagi, wnioski lub plan lektury..."
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:border-purple-500 outline-none font-sans"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 font-bold cursor-pointer"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg cursor-pointer"
                  >
                    {isCreating ? 'Stwórz Kolekcję' : 'Zapisz Zmiany'}
                  </button>
                </div>
              </form>
            ) : currentCol ? (
              /* Selected Collection Detail View */
              <div className="space-y-6">
                
                {/* Collection Banner Header */}
                <div 
                  className="p-6 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col justify-between space-y-4 shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${currentCol.color}25 0%, #030712 100%)`
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
                    <div className="flex items-start gap-3.5">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl shrink-0"
                        style={{ backgroundColor: currentCol.color }}
                      >
                        {renderIcon(currentCol.icon, 'w-6 h-6')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-white leading-tight">{currentCol.name}</h3>
                          <button
                            onClick={() => handleStartEdit(currentCol)}
                            className="p-1 rounded bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                            title="Zmień nazwę / edytuj kolekcję"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-white/60 font-sans mt-1">{currentCol.description || 'Brak opisu kolekcji'}</p>

                        {/* Series Badges */}
                        <div className="flex items-center gap-2 flex-wrap mt-2 font-mono text-[10px]">
                          {currentCol.type && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-900/60 border border-purple-400/40 text-purple-300 font-bold uppercase">
                              {currentCol.type}
                            </span>
                          )}
                          {currentCol.status && (
                            <span className="px-2 py-0.5 rounded-md bg-cyan-900/60 border border-cyan-400/40 text-cyan-300 font-bold">
                              • {currentCol.status}
                            </span>
                          )}
                          {currentCol.totalExpected && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-900/60 border border-amber-400/40 text-amber-300 font-bold">
                              {currentCol.totalExpected} dzieł (kanon)
                            </span>
                          )}
                          {currentCol.universe && (
                            <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-white/80">
                              {currentCol.universe}
                            </span>
                          )}
                        </div>

                        {currentCol.totalExpected && (
                          <div className="mt-3 max-w-md">
                            <div className="flex justify-between text-[10px] font-mono text-white/60 mb-1">
                              <span>Postęp publikacji uniwersum:</span>
                              <span className="font-bold text-cyan-300">
                                {currentCol.bookIds.length} / {currentCol.totalExpected} ({Math.round((currentCol.bookIds.length / currentCol.totalExpected) * 100)}%)
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/10">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all"
                                style={{ width: `${Math.min(100, Math.round((currentCol.bookIds.length / currentCol.totalExpected) * 100))}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Toolbar */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleStartEdit(currentCol)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 text-white/80 font-bold flex items-center gap-1.5 transition-all text-[11px]"
                        title="Zmień nazwę i parametry kolekcji"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Zmień nazwę</span>
                      </button>

                      <button
                        onClick={() => handleExportJSON(currentCol)}
                        className="px-3 py-1.5 rounded-xl bg-purple-950 border border-purple-500/50 hover:bg-purple-900 text-purple-300 font-bold flex items-center gap-1.5 transition-all shadow-md text-[11px]"
                        title="Eksportuj metadane kolekcji w formacie JSON"
                      >
                        <FileJson className="w-3.5 h-3.5" />
                        <span>JSON</span>
                      </button>

                      <button
                        onClick={() => handleExportTXT(currentCol)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/20 hover:bg-slate-800 text-slate-200 font-bold flex items-center gap-1.5 transition-all shadow-md text-[11px]"
                        title="Eksportuj raport TXT"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Raport TXT</span>
                      </button>

                      <button
                        onClick={() => {
                          soundFx.playClick();
                          onSelectCollectionFilter(currentCol.id);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white text-black font-bold flex items-center gap-1.5 hover:bg-white/90 transition-all shadow-md text-[11px]"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Filtruj na Pulpicie</span>
                      </button>

                      {/* Delete Button */}
                      {confirmDeleteId === currentCol.id ? (
                        <div className="flex items-center gap-1 bg-red-950 p-1 rounded-xl border border-red-500">
                          <span className="text-[10px] text-red-300 px-1 font-bold">Usunąć?</span>
                          <button
                            onClick={() => handleDeleteConfirmed(currentCol.id)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded font-bold text-[10px]"
                          >
                            Tak
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white/70 rounded text-[10px]"
                          >
                            Nie
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(currentCol.id)}
                          className="p-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/80 hover:text-white transition-all cursor-pointer"
                          title="Usuń kolekcję"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notes Block */}
                  {currentCol.notes && (
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-3 space-y-1 relative z-10">
                      <div className="text-[10px] uppercase text-amber-400/80 font-bold flex items-center gap-1">
                        <FileText className="w-3 h-3 text-amber-400" />
                        <span>Notatki Autorskie</span>
                      </div>
                      <p className="text-xs text-white/80 font-sans italic">
                        {currentCol.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* List of Contained Books + Add Books Selector */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-xs font-bold uppercase text-white/80 tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <span>Zawarte Książki ({currentCol.bookIds.length})</span>
                    </h4>

                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setShowAddBookPicker(!showAddBookPicker);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 hover:bg-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1.5 transition-all text-[11px] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showAddBookPicker ? 'Ukryj katalog dodawania' : 'Dodaj pozycję do tej kolekcji'}</span>
                    </button>
                  </div>

                  {/* Inline Book Picker Drawer */}
                  {showAddBookPicker && (
                    <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-cyan-400 font-bold uppercase">
                          Katalog pozycji dostępnych do dodania
                        </span>
                        <span className="text-[10px] text-white/40">
                          {availableBooksToAdd.length} pozycji
                        </span>
                      </div>

                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                        <input
                          type="text"
                          placeholder="Filtruj po tytule, wrotach, tagach..."
                          value={bookSearchQuery}
                          onChange={(e) => setBookSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 outline-none focus:border-cyan-400"
                        />
                      </div>

                      {availableBooksToAdd.length === 0 ? (
                        <div className="p-4 text-center text-white/40 text-[11px]">
                          Wszystkie dostępne książki zostały już dodane do tej kolekcji.
                        </div>
                      ) : (
                        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                          {availableBooksToAdd.map(book => (
                            <div 
                              key={book.id}
                              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-xs text-white truncate">{book.title}</div>
                                <div className="text-[10px] text-white/40">{book.seeker} • {book.year} • {book.stats.pageCount} str.</div>
                              </div>

                              <button
                                onClick={() => handleAddBookToCurrent(book.id)}
                                className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Dodaj</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Render Contained Books */}
                  {currentCol.bookIds.length === 0 ? (
                    <div className="p-10 rounded-2xl border border-dashed border-white/10 text-center space-y-3">
                      <BookOpen className="w-10 h-10 text-white/20 mx-auto" />
                      <p className="text-xs text-white/40">Ta kolekcja jest obecnie pusta.</p>
                      <button
                        onClick={() => setShowAddBookPicker(true)}
                        className="px-4 py-2 bg-cyan-500 text-black font-bold rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-lg"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Dodaj pierwszą książkę</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentCol.bookIds.map((bId, idx) => {
                        const book = allBooks.find(b => b.id === bId);
                        if (!book) return null;

                        return (
                          <div 
                            key={bId}
                            className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 flex items-center justify-between gap-3 group transition-all"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <span className="text-[11px] font-mono font-bold text-white/30 w-5 text-center">
                                #{idx + 1}
                              </span>

                              <div 
                                className="w-9 h-12 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center shrink-0 cursor-pointer shadow"
                                onClick={() => {
                                  soundFx.playModalOpen();
                                  onOpenBook(book);
                                }}
                              >
                                <span className="text-base" style={{ color: book.coverStyle.accentColor }}>
                                  {book.coverStyle.symbol}
                                </span>
                              </div>

                              <div className="min-w-0 flex-1">
                                <h5 
                                  onClick={() => {
                                    soundFx.playModalOpen();
                                    onOpenBook(book);
                                  }}
                                  className="font-bold text-xs text-white hover:text-purple-300 transition-colors cursor-pointer truncate"
                                >
                                  {book.title}
                                </h5>
                                <p className="text-[10px] text-white/40 truncate">
                                  {book.seeker} • {book.year} • {book.stats.pageCount} str. {book.subtitle ? `• ${book.subtitle}` : ''}
                                </p>
                              </div>
                            </div>

                            {/* Reorder, Open & Remove controls */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => {
                                  soundFx.playModalOpen();
                                  onOpenBook(book);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-[10px] font-bold flex items-center gap-1"
                              >
                                <BookOpen className="w-3 h-3 text-cyan-400" />
                                <span className="hidden sm:inline">Czytaj</span>
                              </button>

                              <button
                                disabled={idx === 0}
                                onClick={() => {
                                  soundFx.playClick();
                                  onReorderBookInCollection(currentCol.id, idx, idx - 1);
                                }}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 disabled:opacity-20 disabled:pointer-events-none"
                                title="Przesuń wyżej"
                              >
                                <MoveUp className="w-3.5 h-3.5" />
                              </button>

                              <button
                                disabled={idx === currentCol.bookIds.length - 1}
                                onClick={() => {
                                  soundFx.playClick();
                                  onReorderBookInCollection(currentCol.id, idx, idx + 1);
                                }}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 disabled:opacity-20 disabled:pointer-events-none"
                                title="Przesuń niżej"
                              >
                                <MoveDown className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  soundFx.playRemoveFromCollection();
                                  onRemoveBookFromCollection(currentCol.id, book.id);
                                }}
                                className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/20 text-red-400 hover:bg-red-900/60 hover:text-white transition-colors ml-1 cursor-pointer"
                                title="Usuń z kolekcji"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-white/40 space-y-3">
                <Bookmark className="w-10 h-10 mx-auto opacity-20" />
                <p>Wybierz kolekcję z lewego menu lub utwórz nową.</p>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
