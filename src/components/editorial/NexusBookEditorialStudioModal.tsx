import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  BookOpen, 
  Sparkles, 
  Layers, 
  Image as ImageIcon, 
  UploadCloud, 
  FileText, 
  Save, 
  Send, 
  Eye, 
  Edit3, 
  History, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  Tag, 
  Key, 
  Globe, 
  ExternalLink, 
  Share2, 
  Download, 
  Check, 
  Copy, 
  Clock, 
  Calendar, 
  Hash, 
  FolderPlus, 
  RefreshCw,
  Maximize2,
  ChevronRight,
  BookMarked,
  Sliders,
  Terminal,
  FileCode,
  Layout,
  Wand2,
  Lock,
  Unlock,
  Archive,
  ArrowRight
} from 'lucide-react';
import { 
  Book, 
  Chapter, 
  WorkManifest, 
  WorkCoverVersion, 
  WorkEditorialVersion, 
  WorkAuditRecord, 
  Language, 
  Category, 
  BookStatus,
  PublicationState,
  SeekerId
} from '../../types';
import { AssetRegistryRecord } from '../../types/assetLibrary';
import { workEditorialService } from '../../services/workEditorialService';
import { authorAssetService } from '../../services/authorAssetService';
import { SEEKERS_CONFIG } from '../../data/booksData';
import { soundFx } from '../../utils/audioSystem';
import { AuthorAssetLibraryModal } from '../assetLibrary/AuthorAssetLibraryModal';

interface NexusBookEditorialStudioModalProps {
  isOpen: boolean;
  book: Book | null;
  onClose: () => void;
  onSaveWork: (updatedBook: Book, isPublished: boolean) => void;
  onLaunchReader?: (book: Book, chapterId?: string) => void;
}

type TabType = 
  | 'overview' 
  | 'identity' 
  | 'cover' 
  | 'manifest' 
  | 'descriptions' 
  | 'metadata' 
  | 'content' 
  | 'assets' 
  | 'publishing' 
  | 'versions' 
  | 'audit';

export const NexusBookEditorialStudioModal: React.FC<NexusBookEditorialStudioModalProps> = ({
  isOpen,
  book: initialBook,
  onClose,
  onSaveWork,
  onLaunchReader
}) => {
  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Working Book Draft State
  const [work, setWork] = useState<Book | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Manifest View Mode: 'edit' or 'preview'
  const [manifestViewMode, setManifestViewMode] = useState<'edit' | 'preview'>('edit');

  // Chapter editing sub-state
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  // Asset Library Picker sub-modal
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [assetPickerTarget, setAssetPickerTarget] = useState<'cover' | 'chapter_illustration' | 'gallery'>('cover');

  // Custom Cover URL / File Upload sub-state
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [coverChangeNote, setCoverChangeNote] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Publication snapshot modal / input
  const [publishChangesSummary, setPublishChangesSummary] = useState('');
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  // Manual Version Snapshot Dialog
  const [showSnapshotDialog, setShowSnapshotDialog] = useState(false);
  const [manualSnapshotSummary, setManualSnapshotSummary] = useState('');

  // New Tag / Keyword inputs
  const [newTagInput, setNewTagInput] = useState('');
  const [newKeywordInput, setNewKeywordInput] = useState('');

  // Initialize and ensure backward compatibility when book opens
  useEffect(() => {
    if (isOpen && initialBook) {
      const compatible = workEditorialService.ensureWorkCompatibility(initialBook);
      setWork(compatible);
      setHasUnsavedChanges(false);
      if (compatible.chapters && compatible.chapters.length > 0) {
        setSelectedChapterId(compatible.chapters[0].id);
      }
    }
  }, [isOpen, initialBook]);

  if (!isOpen || !work) return null;

  const seekerCfg = SEEKERS_CONFIG[work.seeker] || SEEKERS_CONFIG['Operator001'];
  const accentColor = work.seekerColor || seekerCfg.color;

  // Helper for updating top-level book fields
  const updateField = <K extends keyof Book>(field: K, value: Book[K]) => {
    setWork(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
    setHasUnsavedChanges(true);
  };

  // Helper for updating manifest fields
  const updateManifestField = <K extends keyof WorkManifest>(field: K, value: WorkManifest[K]) => {
    setWork(prev => {
      if (!prev) return prev;
      const currentManifest = prev.manifest || workEditorialService.buildSynchronizedManifest(prev);
      return {
        ...prev,
        manifest: {
          ...currentManifest,
          [field]: value
        }
      };
    });
    setHasUnsavedChanges(true);
  };

  // --- SAVE DRAFT HANDLER ---
  const handleSaveDraft = async () => {
    if (!work) return;
    setIsSaving(true);
    soundFx.playClick();
    try {
      const saved = await workEditorialService.saveWorkDraft(
        work,
        'Zapisano zmiany redakcyjne dzieła w wersji roboczej',
        'Architekt'
      );
      setWork(saved);
      setHasUnsavedChanges(false);
      onSaveWork(saved, false);
      soundFx.playSuccess();
      showNotification('Wersja robocza została bezpiecznie zapisana.');
    } catch (err: any) {
      console.error('Save draft error:', err);
      showNotification(`Błąd zapisu: ${err?.message || 'Nieznany błąd'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- PUBLISH HANDLER ---
  const handlePublishSubmit = async () => {
    if (!work) return;
    setIsPublishing(true);
    soundFx.playClick();
    try {
      const published = await workEditorialService.publishWork(
        work,
        publishChangesSummary.trim() || 'Oficjalna publikacja zaktualizowanej wersji dzieła',
        'Architekt'
      );
      setWork(published);
      setHasUnsavedChanges(false);
      setShowPublishDialog(false);
      setPublishChangesSummary('');
      onSaveWork(published, true);
      soundFx.playSuccess();
      showNotification(`Dzieło zostało pomyślnie opublikowane jako wersja ${published.currentVersion}!`);
    } catch (err: any) {
      console.error('Publish error:', err);
      showNotification(`Błąd publikacji: ${err?.message || 'Nieznany błąd'}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // --- COVER MANAGEMENT HANDLERS ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Wybrany plik musi być obrazem (JPEG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      soundFx.playSuccess();
      const updated = await workEditorialService.setWorkCover(
        work,
        {
          url: dataUrl,
          filename: file.name,
          mimeType: file.type,
          notes: coverChangeNote.trim() || `Wgrano z pliku lokalnego: ${file.name}`
        },
        'Architekt'
      );
      setWork(updated);
      setHasUnsavedChanges(true);
      setCoverChangeNote('');
      showNotification(`Nowa okładka (${file.name}) została przypisana do dzieła.`);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrlCover = async () => {
    if (!customCoverUrl.trim()) return;
    soundFx.playClick();
    const updated = await workEditorialService.setWorkCover(
      work,
      {
        url: customCoverUrl.trim(),
        filename: 'Okładka z zewnętrznego adresu URL',
        notes: coverChangeNote.trim() || 'Dodano przez bezpośredni URL'
      },
      'Architekt'
    );
    setWork(updated);
    setHasUnsavedChanges(true);
    setCustomCoverUrl('');
    setCoverChangeNote('');
    showNotification('Okładka URL została pomyślnie przypisana.');
  };

  const handleSelectAssetAsCover = async (asset: AssetRegistryRecord) => {
    soundFx.playSuccess();
    const updated = await workEditorialService.setWorkCover(
      work,
      {
        url: asset.dataUrl,
        assetId: asset.assetId,
        filename: asset.filename,
        mimeType: asset.mimeType,
        width: asset.width,
        height: asset.height,
        notes: `Pobrana z Biblioteki Assetów Autora [${asset.assetId}]`
      },
      'Architekt'
    );
    setWork(updated);
    setHasUnsavedChanges(true);
    setShowAssetPicker(false);
    showNotification(`Asset ${asset.filename} (${asset.assetId}) został ustawiony jako okładka.`);
  };

  const handleRestoreCoverVersion = async (versionId: string) => {
    soundFx.playClick();
    try {
      const updated = await workEditorialService.restoreCoverVersion(work, versionId, 'Architekt');
      setWork(updated);
      setHasUnsavedChanges(true);
      showNotification('Poprzednia wersja okładki została przywrócona.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRemoveCover = async () => {
    if (!confirm('Czy na pewno chcesz odpiąć aktywną okładkę dzieła? Wersja archiwalna zostanie zachowana w historii.')) return;
    soundFx.playClick();
    const updated = await workEditorialService.removeWorkCover(work, 'Architekt');
    setWork(updated);
    setHasUnsavedChanges(true);
    showNotification('Aktywna okładka została usunięta.');
  };

  // --- CHAPTER MANAGEMENT HANDLERS ---
  const handleAddChapter = () => {
    soundFx.playClick();
    const newNumber = (work.chapters?.length || 0) + 1;
    const newChId = `ch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newChapter: Chapter = {
      id: newChId,
      number: newNumber,
      title: `Rozdział ${String(newNumber).padStart(2, '0')}: Nowy Wpis`,
      summary: 'Krótki zarys treści rozdziału...',
      content: `# Rozdział ${newNumber}\n\nTutaj wprowadź pełną treść nowego rozdziału...`,
      readTimeMin: 3
    };

    const updatedChapters = [...(work.chapters || []), newChapter];
    const stats = workEditorialService.calculateContentStats(updatedChapters);

    setWork(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        chapters: updatedChapters,
        stats: { ...prev.stats, ...stats }
      };
    });
    setSelectedChapterId(newChId);
    setHasUnsavedChanges(true);
    showNotification(`Utworzono Rozdział ${newNumber}.`);
  };

  const handleUpdateChapter = (chapterId: string, patch: Partial<Chapter>) => {
    setWork(prev => {
      if (!prev) return prev;
      const updatedChapters = (prev.chapters || []).map(ch => {
        if (ch.id === chapterId) {
          const merged = { ...ch, ...patch };
          const words = merged.content ? merged.content.trim().split(/\s+/).filter(Boolean).length : 0;
          merged.readTimeMin = Math.max(1, Math.ceil(words / 200));
          return merged;
        }
        return ch;
      });
      const stats = workEditorialService.calculateContentStats(updatedChapters);
      return {
        ...prev,
        chapters: updatedChapters,
        stats: { ...prev.stats, ...stats }
      };
    });
    setHasUnsavedChanges(true);
  };

  const handleDeleteChapter = (chapterId: string) => {
    if ((work.chapters?.length || 0) <= 1) {
      alert('Dzieło musi posiadać przynajmniej jeden rozdział.');
      return;
    }
    if (!confirm('Czy na pewno chcesz usunąć ten rozdział?')) return;
    soundFx.playClick();

    const filtered = (work.chapters || []).filter(c => c.id !== chapterId);
    // Renumber
    const renumbered = filtered.map((ch, idx) => ({ ...ch, number: idx + 1 }));
    const stats = workEditorialService.calculateContentStats(renumbered);

    setWork(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        chapters: renumbered,
        stats: { ...prev.stats, ...stats }
      };
    });
    if (selectedChapterId === chapterId && renumbered.length > 0) {
      setSelectedChapterId(renumbered[0].id);
    }
    setHasUnsavedChanges(true);
    showNotification('Rozdział został usunięty.');
  };

  const handleMoveChapter = (index: number, direction: 'up' | 'down') => {
    if (!work.chapters) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= work.chapters.length) return;

    soundFx.playClick();
    const list = [...work.chapters];
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);

    const renumbered = list.map((ch, idx) => ({ ...ch, number: idx + 1 }));
    setWork(prev => {
      if (!prev) return prev;
      return { ...prev, chapters: renumbered };
    });
    setHasUnsavedChanges(true);
  };

  // --- VERSION SNAPSHOT RESTORE ---
  const handleRestoreVersionSnapshot = async (versionId: string) => {
    if (!confirm('Czy na pewno chcesz przywrócić stan dzieła z tej migawki wydawniczej? Niezapisane zmiany zostaną nadpisane.')) return;
    soundFx.playClick();
    try {
      const restored = await workEditorialService.restoreEditorialVersion(work, versionId, 'Architekt');
      setWork(restored);
      setHasUnsavedChanges(false);
      showNotification('Pomyślnie przywrócono wersję dzieła.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Notifications helper
  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  // Selected Chapter Object
  const currentChapter = work.chapters?.find(c => c.id === selectedChapterId) || work.chapters?.[0];

  // Publication readiness score
  const readinessChecklist = [
    { label: 'Tytuł dzieła określony', ready: Boolean(work.title && work.title.trim().length > 3) },
    { label: 'Okładka główna przypisana', ready: Boolean(work.coverImageUrl || work.coverAssetId) },
    { label: 'Krótki opis promocyjny', ready: Boolean(work.shortDesc && work.shortDesc.trim().length > 10) },
    { label: 'Długi opis / synopsa', ready: Boolean(work.longDesc && work.longDesc.trim().length > 30) },
    { label: 'Rozdziały treści (min. 1)', ready: Boolean(work.chapters && work.chapters.length > 0) },
    { label: 'Manifest wydawniczy', ready: Boolean(work.manifest?.title) },
    { label: 'Słowa kluczowe i tagi', ready: Boolean(work.tags && work.tags.length > 0) }
  ];
  const readinessPercentage = Math.round((readinessChecklist.filter(r => r.ready).length / readinessChecklist.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md font-sans text-white animate-in fade-in duration-200">
      <div className="w-full max-w-7xl h-[94vh] bg-slate-950 border border-cyan-500/40 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* ========================================================================= */}
        {/* TOP BAR / CONTROL HEADER */}
        {/* ========================================================================= */}
        <header className="px-4 py-3 bg-slate-900/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* Left: Back & Work Title Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (hasUnsavedChanges) {
                  if (!confirm('Posiadasz niezapisane zmiany robocze. Czy na pewno chcesz opuścić Editorial Studio?')) return;
                }
                soundFx.playClick();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>← NexusBook</span>
            </button>

            <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    EDITORIAL STUDIO //
                  </span>
                  <span className="text-xs font-bold text-white max-w-xs sm:max-w-md truncate">
                    {work.title}
                  </span>
                </div>
                {work.subtitle && (
                  <span className="text-[10px] text-white/50 truncate font-mono">
                    {work.subtitle}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center/Right: Status Badges & Action Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Publication State Badge */}
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold flex items-center gap-1.5 border ${
              work.publicationState === 'PUBLISHED' 
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                : work.publicationState === 'SAVED'
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-current" />
              <span>
                {work.publicationState === 'PUBLISHED' 
                  ? `OPUBLIKOWANE (${work.currentVersion || 'v1.0'})` 
                  : work.publicationState === 'SAVED' 
                  ? `ZAPISANY DRAFT (${work.currentVersion || 'v0.9'})` 
                  : `WERSJA ROBOCZA (${work.currentVersion || 'v0.9'})`}
              </span>
            </span>

            {/* Unsaved indicator */}
            {hasUnsavedChanges && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30 animate-pulse">
                NIEZAPISANE ZMIANY
              </span>
            )}

            {/* Save Draft Button */}
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/20 text-white font-mono text-xs flex items-center gap-1.5 cursor-pointer shadow transition-all disabled:opacity-50"
              title="Zapisz bieżący stan jako wersję roboczą"
            >
              <Save className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isSaving ? 'Zapisywanie...' : 'Zapisz Roboczą'}</span>
            </button>

            {/* Preview Manifest Card Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('manifest');
                setManifestViewMode('preview');
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Podgląd Karty</span>
            </button>

            {/* Publish Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                setShowPublishDialog(true);
              }}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold font-mono text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Opublikuj Dzieło</span>
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                if (hasUnsavedChanges) {
                  if (!confirm('Posiadasz niezapisane zmiany robocze. Czy na pewno chcesz zamknąć panel?')) return;
                }
                soundFx.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Status notification bar */}
        {statusMessage && (
          <div className="px-4 py-1.5 bg-cyan-950 border-b border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center justify-between animate-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{statusMessage}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-white/40 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MAIN EDITORIAL WORKSPACE */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* 1. LEFT NAVIGATION DRAWER (EDITORIAL MODULES) */}
          <nav className="w-full md:w-60 bg-slate-950/90 border-r border-white/10 p-3 space-y-1 overflow-y-auto shrink-0 font-mono text-xs custom-scrollbar">
            <div className="px-2 py-1 text-[10px] text-white/40 uppercase tracking-wider font-bold">
              Sekcje Redakcyjne
            </div>

            <button
              onClick={() => { soundFx.playClick(); setActiveTab('overview'); }}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'overview' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Layout className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>01. Przegląd // Overview</span>
            </button>

            <button
              onClick={() => { soundFx.playClick(); setActiveTab('identity'); }}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'identity' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Edit3 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>02. Tożsamość // Identity</span>
            </button>

            <button
              onClick={() => { soundFx.playClick(); setActiveTab('cover'); }}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'cover' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-pink-400 shrink-0" />
              <span>03. Okładka // Cover</span>
            </button>

            <button
              onClick={() => { soundFx.playClick(); setActiveTab('manifest'); }}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'manifest' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>04. Manifest // Wizytówka</span>
            </button>

            <button
              onClick={() => { soundFx.playClick(); setActiveTab('descriptions'); }}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'descriptions' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-400 shrink-0" />
              <span>05. Opisy // Descriptions</span>
            </button>

            <button
              onClick={() => { soundFx.playClick(); setActiveTab('metadata'); }}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'metadata' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4 text-purple-400 shrink-0" />
              <span>06. Metadane // Metadata</span>
            </button>

            <button
              onClick={() => { soundFx.playClick(); setActiveTab('content'); }}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'content' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>07. Treść // Content ({work.chapters?.length || 0})</span>
            </button>

            <button
              onClick={() => { soundFx.playClick(); setActiveTab('assets'); }}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'assets' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>08. Assety // Assets</span>
            </button>

            <div className="pt-2 px-2 text-[10px] text-white/40 uppercase tracking-wider font-bold">
              Dystrybucja & Wersje
            </div>

            <button
              onClick={() => { soundFx.playClick(); setActiveTab('publishing'); }}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'publishing' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Send className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>09. Publikacje // Channels</span>
            </button>

            <button
              onClick={() => { soundFx.playClick(); setActiveTab('versions'); }}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'versions' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <History className="w-4 h-4 text-amber-400 shrink-0" />
              <span>10. Historia Wersji ({work.editorialVersions?.length || 1})</span>
            </button>

            <button
              onClick={() => { soundFx.playClick(); setActiveTab('audit'); }}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'audit' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
              <span>11. Dziennik Audytu</span>
            </button>

            {/* Quick Stats Widget */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1.5 text-[11px]">
              <span className="text-white/40 uppercase text-[9px] block">Telemetria Treści</span>
              <div className="flex justify-between text-white/80">
                <span>Słowa:</span>
                <span className="font-bold text-white">{work.stats?.wordCount?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Strony:</span>
                <span className="font-bold text-white">{work.stats?.pageCount || 1}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Czas czytania:</span>
                <span className="font-bold text-cyan-300">{work.stats?.estReadTimeMin || 1} min</span>
              </div>
            </div>
          </nav>

          {/* 2. TAB CONTENT AREA */}
          <main className="flex-1 bg-slate-900/40 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
            
            {/* ========================================================================= */}
            {/* TAB 1: OVERVIEW / PRZEGLĄD */}
            {/* ========================================================================= */}
            {activeTab === 'overview' && (
              <div className="space-y-6 max-w-5xl mx-auto font-mono">
                {/* Hero Summary Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-white/10 flex flex-col md:flex-row gap-6 items-center md:items-start shadow-xl">
                  {/* Visual Cover */}
                  <div 
                    className="w-36 h-52 bg-black rounded-xl overflow-hidden relative shrink-0 border border-white/20 shadow-2xl flex flex-col justify-between p-3 text-center"
                    style={{
                      background: work.coverImageUrl 
                        ? `url(${work.coverImageUrl}) center/cover no-repeat`
                        : `radial-gradient(circle at 50% 30%, ${accentColor}44, #050505 90%)`
                    }}
                  >
                    {work.coverImageUrl && (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]" />
                    )}
                    <span className="text-[10px] text-right font-bold text-white/60 relative z-10">{work.year}</span>
                    <div className="relative z-10 my-auto">
                      {!work.coverImageUrl && (
                        <span className="text-3xl drop-shadow block" style={{ color: accentColor }}>
                          {work.coverStyle?.symbol || '◈'}
                        </span>
                      )}
                      <span className="text-xs font-bold text-white uppercase line-clamp-2 mt-2 drop-shadow">
                        {work.title}
                      </span>
                    </div>
                    <span className="text-[9px] text-cyan-300 uppercase font-bold relative z-10">{work.language}</span>
                  </div>

                  {/* Identity Summary & Status */}
                  <div className="flex-1 space-y-3 font-sans">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-xs font-mono border border-cyan-500/30">
                        {work.tags?.[0] || 'Manifest'}
                      </span>
                      {work.series && (
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-xs font-mono border border-amber-500/30">
                          Seria: {work.series} (Tom {work.volume || 1})
                        </span>
                      )}
                      <span className="text-xs font-mono text-white/50">ID: {work.id}</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {work.title}
                    </h1>
                    {work.subtitle && (
                      <p className="text-sm font-mono text-cyan-400">{work.subtitle}</p>
                    )}

                    <p className="text-xs text-white/70 line-clamp-3 leading-relaxed">
                      {work.shortDesc || work.longDesc || 'Brak wprowadzonego opisu dzieła.'}
                    </p>

                    {/* Quick Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <button
                        onClick={() => { soundFx.playClick(); setActiveTab('cover'); }}
                        className="px-3 py-1.5 rounded-lg bg-pink-950/60 hover:bg-pink-900/60 border border-pink-500/40 text-pink-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Zarządzaj Okładką</span>
                      </button>

                      <button
                        onClick={() => { soundFx.playClick(); setActiveTab('content'); }}
                        className="px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Edytuj Rozdziały ({work.chapters?.length || 0})</span>
                      </button>

                      {onLaunchReader && (
                        <button
                          onClick={() => {
                            soundFx.playClick();
                            onLaunchReader(work);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                        >
                          <BookMarked className="w-3.5 h-3.5" />
                          <span>Uruchom Czytnik</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Publication Readiness Progress */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span className="font-bold text-sm text-white">Gotowość Wydawnicza Dzieła</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">{readinessPercentage}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${readinessPercentage}%` }}
                    />
                  </div>

                  {/* Checklist Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1 text-xs">
                    {readinessChecklist.map((item, idx) => (
                      <div 
                        key={idx}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                          item.ready ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-900/40 border-white/5 text-white/40'
                        }`}
                      >
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.ready ? 'text-emerald-400' : 'text-white/20'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: TOŻSAMOŚĆ // IDENTITY */}
            {/* ========================================================================= */}
            {activeTab === 'identity' && (
              <div className="space-y-6 max-w-4xl mx-auto font-mono text-xs">
                <div className="pb-2 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-amber-400" />
                      <span>TOŻSAMOŚĆ I DANE GŁÓWNE DZIEŁA</span>
                    </h2>
                    <p className="text-[11px] text-white/50">
                      Główne atrybuty identyfikujące dzieło w katalogu, wyszukiwarce oraz rejestrze autorów.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11px] font-bold text-cyan-300 uppercase flex items-center gap-1">
                      <span>Tytuł Dzieła *</span>
                    </label>
                    <input
                      type="text"
                      value={work.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="Wprowadź tytuł dzieła..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/20 focus:border-cyan-400 text-white text-sm outline-none font-sans font-bold"
                    />
                  </div>

                  {/* Subtitle */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11px] text-white/70 uppercase">
                      Podtytuł / Oficjalna Nazwa Wydawnicza
                    </label>
                    <input
                      type="text"
                      value={work.subtitle || ''}
                      onChange={(e) => updateField('subtitle', e.target.value)}
                      placeholder="Wprowadź podtytuł..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-cyan-400 text-white outline-none"
                    />
                  </div>

                  {/* Author */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-white/70 uppercase">Autor / Twórca</label>
                    <input
                      type="text"
                      value={work.author || ''}
                      onChange={(e) => updateField('author', e.target.value)}
                      placeholder="Architekt Nexusa"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-cyan-400 text-white outline-none"
                    />
                  </div>

                  {/* Language */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-white/70 uppercase">Język Główny</label>
                    <select
                      value={work.language}
                      onChange={(e) => updateField('language', e.target.value as Language)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-cyan-400 text-white outline-none cursor-pointer"
                    >
                      <option value="PL">Polski (PL)</option>
                      <option value="EN">English (EN)</option>
                      <option value="DE">Deutsch (DE)</option>
                      <option value="FR">Français (FR)</option>
                    </select>
                  </div>

                  {/* Series Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-white/70 uppercase">Nazwa Serii / Uniwersum</label>
                    <input
                      type="text"
                      value={work.series || ''}
                      onChange={(e) => updateField('series', e.target.value)}
                      placeholder="np. Kroniki Nexusa, Eteruniverse..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-cyan-400 text-white outline-none"
                    />
                  </div>

                  {/* Volume / Number */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-white/70 uppercase">Numer Tomu / Części</label>
                    <input
                      type="number"
                      value={work.volume || 1}
                      onChange={(e) => updateField('volume', parseInt(e.target.value, 10) || 1)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-cyan-400 text-white outline-none"
                    />
                  </div>

                  {/* Genre */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-white/70 uppercase">Gatunek Literacki</label>
                    <input
                      type="text"
                      value={work.genre || ''}
                      onChange={(e) => updateField('genre', e.target.value)}
                      placeholder="np. Cyberpunk / Hard Sci-Fi / Traktat"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-cyan-400 text-white outline-none"
                    />
                  </div>

                  {/* Year */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-white/70 uppercase">Rok Publikacji</label>
                    <input
                      type="number"
                      value={work.year}
                      onChange={(e) => updateField('year', parseInt(e.target.value, 10) || 2026)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-cyan-400 text-white outline-none"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-white/70 uppercase">Status Dzieła w Bibliotece</label>
                    <select
                      value={work.status}
                      onChange={(e) => updateField('status', e.target.value as BookStatus)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-cyan-400 text-white outline-none cursor-pointer"
                    >
                      <option value="Published">Published (Opublikowane)</option>
                      <option value="In Progress">In Progress (W trakcie pisania)</option>
                      <option value="Classified Draft">Classified Draft (Utajniony Szkic)</option>
                    </select>
                  </div>

                  {/* Seeker Domain */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-white/70 uppercase">Domena / Archetyp Seekera</label>
                    <select
                      value={work.seeker}
                      onChange={(e) => updateField('seeker', e.target.value as SeekerId)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-cyan-400 text-white outline-none cursor-pointer"
                    >
                      {Object.keys(SEEKERS_CONFIG).map((sKey) => (
                        <option key={sKey} value={sKey}>
                          {SEEKERS_CONFIG[sKey as SeekerId].name} ({sKey})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tagline */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11px] text-white/70 uppercase">
                      Promocyjny Tagline / Główne Przesłanie
                    </label>
                    <input
                      type="text"
                      value={work.tagline || ''}
                      onChange={(e) => updateField('tagline', e.target.value)}
                      placeholder="np. 'Gdy system nie pyta o zgodę, jedyną odpowiedzią jest architektura.'"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-cyan-400 text-white outline-none italic"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: OKŁADKA // COVER MANAGEMENT */}
            {/* ========================================================================= */}
            {activeTab === 'cover' && (
              <div className="space-y-6 max-w-4xl mx-auto font-mono text-xs">
                <div className="pb-2 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-pink-400" />
                      <span>ZARZĄDZANIE OKŁADKĄ I WERSJONOWANIE GRAFIK</span>
                    </h2>
                    <p className="text-[11px] text-white/50">
                      Okładka dzieła jest traktowana jako nienaruszalny zasób (Asset), z pełną historią wersji oraz integracją z Author Asset Library.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  
                  {/* Left Column: Visual Active Cover Card */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-pink-500/30 space-y-3 text-center">
                    <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider block">
                      Aktywna Okładka Dzieła
                    </span>

                    <div 
                      className="w-44 h-64 mx-auto bg-black rounded-xl overflow-hidden relative border border-white/20 shadow-2xl flex flex-col justify-between p-3"
                      style={{
                        background: work.coverImageUrl 
                          ? `url(${work.coverImageUrl}) center/cover no-repeat`
                          : `radial-gradient(circle at 50% 30%, ${accentColor}44, #050505 90%)`
                      }}
                    >
                      {work.coverImageUrl && (
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]" />
                      )}
                      <span className="text-[10px] text-right font-bold text-white/60 relative z-10">{work.year}</span>
                      <div className="relative z-10 my-auto">
                        {!work.coverImageUrl && (
                          <span className="text-4xl drop-shadow block" style={{ color: accentColor }}>
                            {work.coverStyle?.symbol || '◈'}
                          </span>
                        )}
                        <span className="text-xs font-bold text-white uppercase line-clamp-2 mt-2 drop-shadow">
                          {work.title}
                        </span>
                      </div>
                      <span className="text-[9px] text-cyan-300 uppercase font-bold relative z-10">{work.language}</span>
                    </div>

                    {work.coverImageUrl ? (
                      <div className="space-y-1.5 pt-2">
                        {work.coverAssetId && (
                          <div className="text-[10px] text-cyan-300 bg-cyan-950/60 py-1 rounded border border-cyan-500/30">
                            Asset ID: <span className="font-bold">{work.coverAssetId}</span>
                          </div>
                        )}
                        <button
                          onClick={handleRemoveCover}
                          className="w-full py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/40 border border-rose-500/30 text-rose-300 text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Odepnij Aktywną Okładkę</span>
                        </button>
                      </div>
                    ) : (
                      <p className="text-[11px] text-white/40 italic">
                        Brak przypisanej grafiki binarnej — używany jest proceduralny generator stylu.
                      </p>
                    )}
                  </div>

                  {/* Right Column: Cover Actions & Upload */}
                  <div className="md:col-span-2 space-y-4">
                    
                    {/* Action 1: Upload from Computer */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <UploadCloud className="w-4 h-4 text-cyan-400" />
                        <span>Wgraj nową okładkę z dysku</span>
                      </span>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={handleFileUpload}
                      />

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={coverChangeNote}
                          onChange={(e) => setCoverChangeNote(e.target.value)}
                          placeholder="Opcjonalna notatka o wersji okładki..."
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white outline-none text-xs"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer text-xs shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Wybierz Plik</span>
                        </button>
                      </div>
                    </div>

                    {/* Action 2: Choose from Author Asset Library */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-pink-400" />
                        <span>Wybierz z Biblioteki Assetów Autora (AST-NX)</span>
                      </span>
                      <p className="text-[11px] text-white/50">
                        Wykorzystaj zarejestrowaną grafikę z rejestru Nexus Asset Library bez ponownego duplikowania danych binarnej.
                      </p>
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setAssetPickerTarget('cover');
                          setShowAssetPicker(true);
                        }}
                        className="w-full py-2.5 rounded-xl bg-pink-950/60 hover:bg-pink-900/60 border border-pink-500/40 text-pink-300 font-bold flex items-center justify-center gap-2 cursor-pointer text-xs"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Przeglądaj Bibliotekę Assetów</span>
                      </button>
                    </div>

                    {/* Action 3: Assign from URL */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span>Podaj bezpośredni adres URL grafiki</span>
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={customCoverUrl}
                          onChange={(e) => setCustomCoverUrl(e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white outline-none text-xs"
                        />
                        <button
                          onClick={handleApplyCustomUrlCover}
                          className="px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-500/40 text-blue-300 font-bold cursor-pointer text-xs shrink-0"
                        >
                          Zastosuj
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Cover Version History Table */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <History className="w-4 h-4 text-amber-400" />
                      <span>Historia Wersji Okładek Dzieła</span>
                    </span>
                    <span className="text-[10px] text-white/50">
                      Zachowanych wersji: {work.coverVersions?.length || 0}
                    </span>
                  </div>

                  {work.coverVersions && work.coverVersions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {work.coverVersions.map((cov, idx) => (
                        <div 
                          key={cov.versionId || idx}
                          className={`p-3 rounded-xl border flex gap-3 items-center ${
                            cov.isCurrent ? 'bg-cyan-950/30 border-cyan-500/50' : 'bg-slate-900/60 border-white/10'
                          }`}
                        >
                          <img 
                            src={cov.url} 
                            alt={cov.filename} 
                            className="w-12 h-16 object-cover rounded border border-white/10 shrink-0 bg-black"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-white truncate block">
                                {cov.filename || `Okładka #${idx + 1}`}
                              </span>
                              {cov.isCurrent && (
                                <span className="text-[9px] font-bold text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/40">
                                  AKTYWNA
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-white/40 block">
                              {new Date(cov.createdAt).toLocaleDateString()}
                            </span>
                            {!cov.isCurrent && (
                              <button
                                onClick={() => handleRestoreCoverVersion(cov.versionId)}
                                className="text-[10px] text-cyan-300 hover:text-cyan-200 font-bold underline cursor-pointer pt-0.5"
                              >
                                Ustaw jako aktualną
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-white/40 italic">
                      Brak zarejestrowanych archiwalnych wersji okładek.
                    </p>
                  )}
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 4: MANIFEST & PUBLIC CARD PREVIEW */}
            {/* ========================================================================= */}
            {activeTab === 'manifest' && (
              <div className="space-y-6 max-w-4xl mx-auto font-mono text-xs">
                
                {/* Mode Switch Header */}
                <div className="pb-2 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-emerald-400" />
                      <span>MANIFEST WYDAWNICZY // WIZYTÓWKA DZIEŁA</span>
                    </h2>
                    <p className="text-[11px] text-white/50">
                      Manifest stanowi oficjalną, publiczną reprezentację dzieła w ekosystemie Nexus i na zewnątrz.
                    </p>
                  </div>

                  <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-white/10">
                    <button
                      onClick={() => { soundFx.playClick(); setManifestViewMode('edit'); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        manifestViewMode === 'edit' ? 'bg-cyan-500 text-black' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      [ EDYCJA MANIFESTU ]
                    </button>
                    <button
                      onClick={() => { soundFx.playClick(); setManifestViewMode('preview'); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        manifestViewMode === 'preview' ? 'bg-emerald-500 text-black' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      [ PODGLĄD WIZYTÓWKI ]
                    </button>
                  </div>
                </div>

                {/* EDIT MODE */}
                {manifestViewMode === 'edit' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] text-white/70 uppercase">Wersja Schematu Manifestu</label>
                        <input
                          type="text"
                          value={work.manifest?.manifestVersion || '1.1.0'}
                          onChange={(e) => updateManifestField('manifestVersion', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-white/70 uppercase">Identyfikator ISBN / Nexus UUID</label>
                        <input
                          type="text"
                          value={work.manifest?.isbn || `NX-ISBN-${work.id.toUpperCase().slice(0, 8)}`}
                          onChange={(e) => updateManifestField('isbn', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white outline-none"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[11px] text-white/70 uppercase">Kanały Dystrybucji Manifestu</label>
                        <div className="p-3 rounded-xl bg-slate-950 border border-white/10 flex flex-wrap gap-2">
                          {['NEXUSBOOK', 'NEXUSSOCIAL', 'NEXUS_MEDIA', 'PDF', 'EPUB', 'AMAZON_KDP'].map((ch) => {
                            const active = (work.manifest?.distributionChannels || []).includes(ch as any);
                            return (
                              <button
                                key={ch}
                                type="button"
                                onClick={() => {
                                  soundFx.playClick();
                                  const current = work.manifest?.distributionChannels || [];
                                  const updated = active ? current.filter(c => c !== ch) : [...current, ch as any];
                                  updateManifestField('distributionChannels', updated);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                  active ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50' : 'bg-slate-900 text-white/40 border-white/5'
                                }`}
                              >
                                {ch}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Raw JSON Inspector for Manifest */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-cyan-400">Wygenerowany Obiekt Manifestu (JSON)</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(work.manifest || workEditorialService.buildSynchronizedManifest(work), null, 2));
                            soundFx.playSuccess();
                            showNotification('Manifest JSON skopiowany do schowka!');
                          }}
                          className="text-[10px] text-white/60 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Kopiuj JSON</span>
                        </button>
                      </div>
                      <pre className="p-3 rounded-xl bg-black/60 border border-white/5 text-[10px] text-emerald-300 max-h-60 overflow-y-auto custom-scrollbar font-mono leading-relaxed">
                        {JSON.stringify(work.manifest || workEditorialService.buildSynchronizedManifest(work), null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* PREVIEW MODE (PUBLIC CARD PREVIEW) */}
                {manifestViewMode === 'preview' && (
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-cyan-500/40 shadow-2xl space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                      
                      {/* Cover */}
                      <div 
                        className="w-48 h-72 bg-black rounded-2xl overflow-hidden relative shrink-0 border border-white/20 shadow-2xl flex flex-col justify-between p-4 text-center"
                        style={{
                          background: work.coverImageUrl 
                            ? `url(${work.coverImageUrl}) center/cover no-repeat`
                            : `radial-gradient(circle at 50% 30%, ${accentColor}44, #050505 90%)`
                        }}
                      >
                        {work.coverImageUrl && (
                          <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]" />
                        )}
                        <span className="text-xs text-right font-bold text-white/60 relative z-10">{work.year}</span>
                        <div className="relative z-10 my-auto">
                          {!work.coverImageUrl && (
                            <span className="text-5xl drop-shadow block" style={{ color: accentColor }}>
                              {work.coverStyle?.symbol || '◈'}
                            </span>
                          )}
                          <span className="text-sm font-extrabold text-white uppercase line-clamp-2 mt-2 drop-shadow">
                            {work.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-cyan-300 uppercase font-bold relative z-10">{work.language}</span>
                      </div>

                      {/* Metadata & Synopsis */}
                      <div className="flex-1 space-y-3 font-sans">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40">
                            {work.tags?.[0] || 'Manifest'}
                          </span>
                          {work.series && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 text-xs font-mono font-bold border border-amber-500/40">
                              {work.series} // Tom {work.volume || 1}
                            </span>
                          )}
                          <span className="text-xs font-mono text-white/50">
                            Wersja: {work.currentVersion || 'v1.0'}
                          </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                          {work.title}
                        </h1>
                        {work.subtitle && (
                          <p className="text-sm font-mono text-cyan-400 font-bold">{work.subtitle}</p>
                        )}
                        <p className="text-xs font-mono text-white/60">
                          Autor: <span className="text-white font-bold">{work.author || 'Architekt Nexusa'}</span>
                        </p>

                        {work.tagline && (
                          <blockquote className="p-3 rounded-xl bg-slate-900/80 border-l-2 border-cyan-400 text-xs text-cyan-200 italic">
                            "{work.tagline}"
                          </blockquote>
                        )}

                        <p className="text-xs text-white/80 leading-relaxed pt-1">
                          {work.longDesc || work.shortDesc}
                        </p>

                        {/* Interactive Reader Button */}
                        <div className="pt-3">
                          <button
                            onClick={() => {
                              if (onLaunchReader) {
                                soundFx.playClick();
                                onLaunchReader(work);
                              }
                            }}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-extrabold font-mono text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>CZYTAJ DZIEŁO ({work.chapters?.length || 0} ROZDZIAŁÓW)</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 5: OPISY // DESCRIPTIONS */}
            {/* ========================================================================= */}
            {activeTab === 'descriptions' && (
              <div className="space-y-6 max-w-4xl mx-auto font-mono text-xs">
                <div className="pb-2 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span>OPISY I MATERIAŁY WYDAWNICZE</span>
                    </h2>
                    <p className="text-[11px] text-white/50">
                      Pełny zestaw opisów: od krótkiej zajawki do katalogu, po obszerną synopsę i notatkę redakcyjną.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 font-sans">
                  {/* Short description */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-cyan-300 font-mono uppercase">
                      Krótki Opis (Zajawka / Teaser do kart i listingów)
                    </label>
                    <textarea
                      rows={3}
                      value={work.shortDesc || ''}
                      onChange={(e) => updateField('shortDesc', e.target.value)}
                      placeholder="Krótki, chwytliwy opis widoczny na miniaturach i w wyszukiwarce..."
                      className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 focus:border-cyan-400 text-white text-xs outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* Long description */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-cyan-300 font-mono uppercase">
                      Długi Opis / Pełna Synopsa Wydawnicza
                    </label>
                    <textarea
                      rows={6}
                      value={work.longDesc || ''}
                      onChange={(e) => updateField('longDesc', e.target.value)}
                      placeholder="Obszerny opis dzieła, wątki filozoficzne, kontekst uniwersum..."
                      className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 focus:border-cyan-400 text-white text-xs outline-none resize-y leading-relaxed"
                    />
                  </div>

                  {/* Author / Editorial Note */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-cyan-300 font-mono uppercase">
                      Notatka Redakcyjna / Słowo Wstępne Autora
                    </label>
                    <textarea
                      rows={4}
                      value={work.editorialNote || work.authorNote || ''}
                      onChange={(e) => {
                        updateField('editorialNote', e.target.value);
                        updateField('authorNote', e.target.value);
                      }}
                      placeholder="Osobisty komentarz autora, wskazówki dotyczące interpretacji lub dedykacja..."
                      className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 focus:border-cyan-400 text-white text-xs outline-none resize-y leading-relaxed italic"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 6: METADANE // METADATA & PLATFORMS */}
            {/* ========================================================================= */}
            {activeTab === 'metadata' && (
              <div className="space-y-6 max-w-4xl mx-auto font-mono text-xs">
                <div className="pb-2 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Tag className="w-4 h-4 text-purple-400" />
                      <span>METADANE, TAGI I LINKI PLATFORMOWE</span>
                    </h2>
                    <p className="text-[11px] text-white/50">
                      Słowa kluczowe SEO, tagi katalogowe oraz zewnętrzne odnośniki do wydań PDF, Wattpad, Amazon KDP i repozytoriów.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Tags Editor */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                    <label className="text-[11px] font-bold text-white uppercase block">
                      Tagi Dzieła ({work.tags?.length || 0})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {work.tags?.map((t, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs flex items-center gap-1.5"
                        >
                          <span>{String(t)}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = work.tags.filter((_, i) => i !== idx);
                              updateField('tags', updated);
                            }}
                            className="text-purple-400 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTagInput.trim()) {
                            e.preventDefault();
                            updateField('tags', [...(work.tags || []), newTagInput.trim()]);
                            setNewTagInput('');
                          }
                        }}
                        placeholder="Wpisz nowy tag i naciśnij Enter..."
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white outline-none text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newTagInput.trim()) return;
                          updateField('tags', [...(work.tags || []), newTagInput.trim()]);
                          setNewTagInput('');
                        }}
                        className="px-4 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-500/40 text-purple-300 font-bold cursor-pointer text-xs"
                      >
                        Dodaj Tag
                      </button>
                    </div>
                  </div>

                  {/* Keywords Editor */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                    <label className="text-[11px] font-bold text-white uppercase block">
                      Słowa Kluczowe SEO ({work.keywords?.length || 0})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {work.keywords?.map((k, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-1.5"
                        >
                          <Hash className="w-3 h-3" />
                          <span>{k}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (work.keywords || []).filter((_, i) => i !== idx);
                              updateField('keywords', updated);
                            }}
                            className="text-cyan-400 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={newKeywordInput}
                        onChange={(e) => setNewKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newKeywordInput.trim()) {
                            e.preventDefault();
                            updateField('keywords', [...(work.keywords || []), newKeywordInput.trim()]);
                            setNewKeywordInput('');
                          }
                        }}
                        placeholder="Wpisz słowo kluczowe..."
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white outline-none text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newKeywordInput.trim()) return;
                          updateField('keywords', [...(work.keywords || []), newKeywordInput.trim()]);
                          setNewKeywordInput('');
                        }}
                        className="px-4 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold cursor-pointer text-xs"
                      >
                        Dodaj Słowo
                      </button>
                    </div>
                  </div>

                  {/* Platform Links */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                    <label className="text-[11px] font-bold text-white uppercase block">
                      Linki do Zewnętrznych Platform Wydawniczych
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-white/50 block mb-1">Amazon KDP / Kindle:</span>
                        <input
                          type="url"
                          value={work.platformLinks?.amazon || ''}
                          onChange={(e) => updateField('platformLinks', { ...work.platformLinks, amazon: e.target.value })}
                          placeholder="https://amazon.com/dp/..."
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-white/50 block mb-1">Wattpad:</span>
                        <input
                          type="url"
                          value={work.platformLinks?.wattpad || ''}
                          onChange={(e) => updateField('platformLinks', { ...work.platformLinks, wattpad: e.target.value })}
                          placeholder="https://wattpad.com/story/..."
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-white/50 block mb-1">Substack:</span>
                        <input
                          type="url"
                          value={work.platformLinks?.substack || ''}
                          onChange={(e) => updateField('platformLinks', { ...work.platformLinks, substack: e.target.value })}
                          placeholder="https://substack.com/..."
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-white/50 block mb-1">Bezpośredni plik PDF:</span>
                        <input
                          type="url"
                          value={work.platformLinks?.pdfUrl || ''}
                          onChange={(e) => updateField('platformLinks', { ...work.platformLinks, pdfUrl: e.target.value })}
                          placeholder="https://.../book.pdf"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 7: TREŚĆ // CONTENT & CHAPTERS */}
            {/* ========================================================================= */}
            {activeTab === 'content' && (
              <div className="space-y-6 max-w-5xl mx-auto font-mono text-xs">
                <div className="pb-2 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-yellow-400" />
                      <span>STRUKTURA I EDYCJA ROZDZIAŁÓW</span>
                    </h2>
                    <p className="text-[11px] text-white/50">
                      Zarządzanie częściami dzieła, edycja treści markdown, zmiana kolejności i przypisywanie ilustracji rozdziałowych.
                    </p>
                  </div>

                  <button
                    onClick={handleAddChapter}
                    className="px-3.5 py-1.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-300 font-bold flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Dodaj Rozdział</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  
                  {/* Left: Chapter list */}
                  <div className="space-y-2 p-3 rounded-2xl bg-slate-950 border border-white/10 max-h-[68vh] overflow-y-auto custom-scrollbar">
                    <span className="text-[10px] text-white/40 uppercase font-bold block mb-1">
                      Kolejność Rozdziałów ({work.chapters?.length || 0})
                    </span>

                    {work.chapters?.map((ch, idx) => (
                      <div
                        key={ch.id}
                        onClick={() => setSelectedChapterId(ch.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                          ch.id === selectedChapterId 
                            ? 'bg-yellow-500/20 border-yellow-500/50 text-white font-bold' 
                            : 'bg-slate-900/60 border-white/5 text-white/70 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-yellow-400/80 block">
                            Rozdział {String(ch.number).padStart(2, '0')}
                          </span>
                          <span className="text-xs truncate block font-sans font-bold">
                            {ch.title}
                          </span>
                        </div>

                        {/* Reorder & delete buttons */}
                        <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            disabled={idx === 0}
                            onClick={() => handleMoveChapter(idx, 'up')}
                            className="p-1 text-white/40 hover:text-white disabled:opacity-20"
                            title="Przesuń wyżej"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            disabled={idx === (work.chapters?.length || 1) - 1}
                            onClick={() => handleMoveChapter(idx, 'down')}
                            className="p-1 text-white/40 hover:text-white disabled:opacity-20"
                            title="Przesuń niżej"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteChapter(ch.id)}
                            className="p-1 text-rose-400 hover:text-rose-300 ml-1"
                            title="Usuń rozdział"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right: Active Chapter Editor */}
                  {currentChapter ? (
                    <div className="md:col-span-2 space-y-4 p-4 rounded-2xl bg-slate-950 border border-white/10">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="text-xs font-bold text-yellow-400">
                          Edycja: Rozdział {String(currentChapter.number).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] text-white/50">
                          Czas czytania: ~{currentChapter.readTimeMin} min
                        </span>
                      </div>

                      <div className="space-y-3 font-sans">
                        <div>
                          <label className="text-[10px] text-white/50 font-mono uppercase block mb-1">
                            Tytuł Rozdziału
                          </label>
                          <input
                            type="text"
                            value={currentChapter.title}
                            onChange={(e) => handleUpdateChapter(currentChapter.id, { title: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold outline-none text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-white/50 font-mono uppercase block mb-1">
                            Krótkie Streszczenie / Zarys
                          </label>
                          <input
                            type="text"
                            value={currentChapter.summary || ''}
                            onChange={(e) => handleUpdateChapter(currentChapter.id, { summary: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white outline-none text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-white/50 font-mono uppercase block mb-1">
                            Pełna Treść Rozdziału (Format Markdown)
                          </label>
                          <textarea
                            rows={14}
                            value={currentChapter.content}
                            onChange={(e) => handleUpdateChapter(currentChapter.id, { content: e.target.value })}
                            className="w-full p-3 rounded-xl bg-black/60 border border-white/10 focus:border-yellow-400 text-white font-mono text-xs outline-none leading-relaxed resize-y custom-scrollbar"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="md:col-span-2 p-8 text-center text-white/40 italic">
                      Wybierz rozdział z listy lub utwórz nowy.
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 8: ASSETY // ASSETS & ILLUSTRATIONS */}
            {/* ========================================================================= */}
            {activeTab === 'assets' && (
              <div className="space-y-6 max-w-4xl mx-auto font-mono text-xs">
                <div className="pb-2 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>ZASOBY MULTIMEDIALNE I ASSETY DZIEŁA</span>
                    </h2>
                    <p className="text-[11px] text-white/50">
                      Rejestr grafik powiązanych z tym dziełem (okładka, ilustracje rozdziałowe, banery, grafiki koncepcyjne).
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setAssetPickerTarget('gallery');
                      setShowAssetPicker(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Dołącz Asset z Biblioteki</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Active Cover Summary Card */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex items-center gap-4">
                    {work.coverImageUrl ? (
                      <img 
                        src={work.coverImageUrl} 
                        alt="Okładka" 
                        className="w-16 h-24 object-cover rounded-lg border border-white/10 bg-black shrink-0" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-16 h-24 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-white/40">
                        Brak
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] text-pink-400 uppercase font-bold block">Główny Asset Okładki</span>
                      <span className="text-xs font-bold text-white block">
                        {work.coverAssetId ? `Asset ID: ${work.coverAssetId}` : 'Okładka lokalna / URL'}
                      </span>
                      <span className="text-[10px] text-white/50 block">
                        Typ zastosowania: BOOK_COVER // Status: Przypisana
                      </span>
                    </div>
                  </div>

                  {/* Chapter Illustrations List */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                    <span className="text-xs font-bold text-white uppercase block">
                      Ilustracje Rozdziałowe ({work.chapters?.filter(c => c.illustrationUrl || c.illustrationAssetId).length || 0})
                    </span>

                    {work.chapters && work.chapters.some(c => c.illustrationUrl || c.illustrationAssetId) ? (
                      <div className="space-y-2">
                        {work.chapters.filter(c => c.illustrationUrl || c.illustrationAssetId).map(ch => (
                          <div key={ch.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-3">
                            <img 
                              src={ch.illustrationUrl} 
                              alt={ch.title} 
                              className="w-12 h-12 object-cover rounded-lg bg-black shrink-0" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] text-yellow-400 block font-bold">Rozdział {ch.number}: {ch.title}</span>
                              <span className="text-[10px] text-white/50 truncate block">{ch.illustrationAssetId || 'Grafika zewnętrzna'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-white/40 italic">
                        Żaden z rozdziałów nie posiada jeszcze przypisanej indywidualnej ilustracji.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 9: PUBLIKACJE // PUBLISHING CHANNELS */}
            {/* ========================================================================= */}
            {activeTab === 'publishing' && (
              <div className="space-y-6 max-w-4xl mx-auto font-mono text-xs">
                <div className="pb-2 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Send className="w-4 h-4 text-emerald-400" />
                      <span>CENTRUM PUBLIKACJI I KANAŁY DYSTRYBUCJI</span>
                    </h2>
                    <p className="text-[11px] text-white/50">
                      Wydaj dzieło do publicznej biblioteki, wygeneruj paczkę wydawniczą lub zaktualizuj rejestr publikacji.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Status Publikacji: {work.status}</span>
                      <span className="text-[11px] text-emerald-300">
                        Aktualna wersja publiczna: {work.currentVersion || 'v1.0'}
                      </span>
                    </div>

                    <button
                      onClick={() => setShowPublishDialog(true)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 text-xs"
                    >
                      <Send className="w-4 h-4" />
                      <span>OPUBLIKUJ NOWĄ WERSJĘ</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-white/70 leading-relaxed font-sans">
                    Publikacja spowoduje automatyczne utworzenie nowej, nienaruszalnej migawki wersji (np. przejście do v2.0), zaktualizowanie publicznego manifestu oraz synchronizację z bazą Firestore i magazynem offline.
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 10: HISTORIA WERSJI // EDITORIAL VERSIONS */}
            {/* ========================================================================= */}
            {activeTab === 'versions' && (
              <div className="space-y-6 max-w-4xl mx-auto font-mono text-xs">
                <div className="pb-2 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <History className="w-4 h-4 text-amber-400" />
                      <span>HISTORIA WERSJI WYDAWNICZYCH</span>
                    </h2>
                    <p className="text-[11px] text-white/50">
                      Nienaruszalne migawki poprzednich publikacji i stanów dzieła z możliwością bezpiecznego przywrócenia.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {work.editorialVersions && work.editorialVersions.length > 0 ? (
                    work.editorialVersions.map((ver, idx) => (
                      <div 
                        key={ver.versionId || idx}
                        className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-500/40 text-xs">
                              {ver.versionNumber}
                            </span>
                            <span className="text-xs font-bold text-white">{ver.title}</span>
                          </div>
                          <span className="text-[10px] text-white/40">
                            {new Date(ver.changedAt).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-xs text-white/70 font-sans">{ver.changesSummary}</p>

                        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-white/50">
                          <span>Autor zmiany: {ver.changedBy}</span>
                          <button
                            onClick={() => handleRestoreVersionSnapshot(ver.versionId)}
                            className="text-cyan-300 hover:text-cyan-200 font-bold underline cursor-pointer"
                          >
                            Przywróć tę wersję
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-white/40 italic">Brak zapisanych migawek wersji.</p>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 11: DZIENNIK AUDYTU // AUDIT TRAIL */}
            {/* ========================================================================= */}
            {activeTab === 'audit' && (
              <div className="space-y-6 max-w-4xl mx-auto font-mono text-xs">
                <div className="pb-2 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-rose-400" />
                      <span>DZIENNIK AUDYTU REDAKCYJNEGO</span>
                    </h2>
                    <p className="text-[11px] text-white/50">
                      Pełny ślad historyczny każdej modyfikacji, dodania okładki, zmiany manifestu i publikacji.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {work.auditHistory && work.auditHistory.length > 0 ? (
                    work.auditHistory.map((log) => (
                      <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-rose-300 text-[11px]">{log.action}</span>
                            <span className="text-[10px] text-white/40">{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-[11px] text-white/80 font-sans">{log.details}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-white/40 italic">Brak wpisów w dzienniku audytu.</p>
                  )}
                </div>
              </div>
            )}

          </main>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SUB-MODAL 1: PUBLISH CONFIRMATION DIALOG */}
      {/* ========================================================================= */}
      {showPublishDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-950 border border-emerald-500/50 rounded-2xl p-6 space-y-4 font-mono text-xs shadow-2xl">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
              <Send className="w-5 h-5" />
              <span>PUBLIKACJA NOWEJ WERSJI DZIEŁA</span>
            </div>

            <p className="text-white/80 font-sans leading-relaxed">
              Czy chcesz zatwierdzić zmiany i wydać nową wersję dzieła <span className="text-white font-bold">"{work.title}"</span>?
            </p>

            <div className="space-y-1.5">
              <label className="text-[10px] text-white/50 uppercase">Podsumowanie Zmian (Wpis do Historii i Manifestu):</label>
              <textarea
                rows={3}
                value={publishChangesSummary}
                onChange={(e) => setPublishChangesSummary(e.target.value)}
                placeholder="np. Zaktualizowano okładkę główną, dodano Rozdział 4 oraz doprecyzowano synopsę..."
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white outline-none text-xs resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowPublishDialog(false)}
                className="flex-1 py-2 rounded-xl border border-white/10 text-white/60 hover:text-white"
              >
                Anuluj
              </button>
              <button
                onClick={handlePublishSubmit}
                disabled={isPublishing}
                className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Check className="w-4 h-4" />
                <span>{isPublishing ? 'Publikowanie...' : 'Opublikuj Teraz'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MODAL 2: AUTHOR ASSET LIBRARY PICKER */}
      {/* ========================================================================= */}
      {showAssetPicker && (
        <AuthorAssetLibraryModal
          isOpen={showAssetPicker}
          onClose={() => setShowAssetPicker(false)}
          onInsertAssetToBook={(asset) => {
            if (assetPickerTarget === 'cover') {
              handleSelectAssetAsCover(asset);
            } else if (assetPickerTarget === 'chapter_illustration' && currentChapter) {
              handleUpdateChapter(currentChapter.id, {
                illustrationAssetId: asset.assetId,
                illustrationUrl: asset.dataUrl
              });
              setShowAssetPicker(false);
              showNotification(`Asset ${asset.filename} przypisany do rozdziału.`);
            }
          }}
        />
      )}

    </div>
  );
};
