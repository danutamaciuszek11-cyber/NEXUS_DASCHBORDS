import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  BookOpen, 
  Trash2, 
  Layers, 
  Save, 
  X, 
  RefreshCw, 
  Code2, 
  Eye, 
  Globe, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  Sliders,
  Terminal,
  ExternalLink,
  Plus,
  Cpu
} from 'lucide-react';
import { Book, Chapter, Category, SeekerId } from '../types';
import { analyzeAndAutoTagBook } from '../utils/aiAutoTagger';
import { soundFx } from '../utils/audioSystem';
import { processSubstackContent } from '../utils/substackConverter';
import { 
  executeBatchMigration, 
  create94SamplePdfBatchFiles, 
  BatchMigrationProgress, 
  BatchMigratorController,
  cleanBookMetadata,
  validateAndAssignSeriesCollection
} from '../utils/batchMigrator';
import { BatchMigrationModal } from './BatchMigrationModal';

interface BookImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportBook: (book: Book) => void;
  onImportMultipleBooks?: (books: Book[]) => void;
  onOpenReader?: (book: Book, chapterId?: string) => void;
  onOpenHtmlWorld?: (book: Book) => void;
}

interface ParsedImportItem {
  id: string;
  file?: File;
  fileName: string;
  sourceType: 'file-pdf' | 'file-html' | 'file-txt' | 'file-md' | 'substack-paste';
  title: string;
  subtitle: string;
  author: string;
  publishedDate?: string;
  rawText: string;
  cleanedHtml?: string;
  chapters: Chapter[];
  category: Category;
  tags: string[];
  seeker: SeekerId;
  seekerColor: string;
  wordCount: number;
  estReadTimeMin: number;
  status: 'pending' | 'parsing' | 'analyzed' | 'imported' | 'error';
  errorMessage?: string;
  summary?: string;
  isSubstackSource: boolean;
  cleanStats?: {
    removedElementsCount: number;
    removedBoilerplates: string[];
  };
  customHtmlWorld?: {
    htmlCode: string;
    themeColor?: string;
    terminalActive?: boolean;
    worldName?: string;
    authorName?: string;
  };
}

export const BookImportModal: React.FC<BookImportModalProps> = ({
  isOpen,
  onClose,
  onImportBook,
  onImportMultipleBooks,
  onOpenReader,
  onOpenHtmlWorld
}) => {
  const [items, setItems] = useState<ParsedImportItem[]>([]);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [inputTab, setInputTab] = useState<'files' | 'substack-paste'>('files');
  const [activeDetailTab, setActiveDetailTab] = useState<'chapters' | 'html-code' | 'live-preview' | 'denoise-report'>('chapters');
  
  // Substack paste state
  const [pastedSubstackText, setPastedSubstackText] = useState('');
  const [pastedSubstackTitle, setPastedSubstackTitle] = useState('');
  const [pastedSubstackSubtitle, setPastedSubstackSubtitle] = useState('');
  const [isProcessingSubstackPaste, setIsProcessingSubstackPaste] = useState(false);

  // General Settings
  const [autoCleanSubstack, setAutoCleanSubstack] = useState(true);
  const [generateHtmlWorld, setGenerateHtmlWorld] = useState(true);
  const [copiedHtml, setCopiedHtml] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 94-Book Batch Migration State
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchProgress, setBatchProgress] = useState<BatchMigrationProgress | null>(null);
  const [batchController, setBatchController] = useState<BatchMigratorController | null>(null);
  const batchFileInputRef = useRef<HTMLInputElement>(null);

  const handleStartBatchWithFiles = (filesList: File[] | FileList) => {
    const fileArr = Array.from(filesList);
    if (fileArr.length === 0) return;
    
    soundFx.playClick();
    setShowBatchModal(true);

    const controller = executeBatchMigration(fileArr, {
      chunkSize: 4,
      delayBetweenChunksMs: 80,
      autoTagWithAI: true,
      generateHtmlWorlds: true,
      syncToFirestore: true,
      onProgress: (p) => setBatchProgress(p),
      onComplete: () => {
        soundFx.playSuccess();
      }
    });

    setBatchController(controller);
  };

  const handleLaunch94SampleBatch = () => {
    soundFx.playClick();
    const sampleFiles = create94SamplePdfBatchFiles();
    handleStartBatchWithFiles(sampleFiles);
  };

  if (!isOpen) return null;

  const seekerColors: Record<SeekerId, string> = {
    Operator001: '#ffd700',
    InterSeeker: '#00f0ff',
    BioSeeker: '#00ff88',
    EterSeeker: '#9945ff',
    ChronoSeeker: '#ff3b3b',
    TabuSeeker: '#ffaa00',
    MirrorSeeker: '#94a3b8',
    SpiritSeeker: '#ec4899',
    ObfitoSeeker: '#10b981'
  };

  // Heuristic parser to break raw text (from PDF/text/markdown) into chapters
  const parseTextIntoChapters = (text: string, baseTitle: string): Chapter[] => {
    const lines = text.split(/\r?\n/);
    const chapters: Chapter[] = [];
    let currentChapter: { title: string; contentLines: string[] } | null = null;
    let chapterCounter = 1;

    const chapterHeadingRegex = /^(?:#+\s*)?(?:Rozdział|Chapter|Część|Faza|Akt|Part)\s+([0-9IVXLCDM]+|[A-ZĄĆĘŁŃÓŚŹŻ]+)[\s:.-]*(.*)$/i;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const match = line.match(chapterHeadingRegex);

      if (match) {
        if (currentChapter && currentChapter.contentLines.length > 0) {
          const content = currentChapter.contentLines.join('\n').trim();
          const words = content.split(/\s+/).filter(Boolean).length;
          chapters.push({
            id: `ch_${Date.now()}_${chapters.length + 1}`,
            number: chapterCounter++,
            title: currentChapter.title || `Rozdział ${chapters.length + 1}`,
            summary: content.slice(0, 160) + '...',
            readTimeMin: Math.max(1, Math.ceil(words / 180)),
            content
          });
        }
        const chapterSuffix = match[2] ? match[2].trim() : '';
        const chapterTitle = chapterSuffix ? `${line}` : line;
        currentChapter = { title: chapterTitle, contentLines: [] };
      } else {
        if (!currentChapter) {
          currentChapter = { title: `${baseTitle} — Część I`, contentLines: [] };
        }
        currentChapter.contentLines.push(lines[i]);
      }
    }

    if (currentChapter && currentChapter.contentLines.length > 0) {
      const content = currentChapter.contentLines.join('\n').trim();
      const words = content.split(/\s+/).filter(Boolean).length;
      chapters.push({
        id: `ch_${Date.now()}_${chapters.length + 1}`,
        number: chapterCounter,
        title: currentChapter.title || `Rozdział ${chapters.length + 1}`,
        summary: content.slice(0, 160) + '...',
        readTimeMin: Math.max(1, Math.ceil(words / 180)),
        content
      });
    }

    if (chapters.length === 0) {
      const cleanContent = text.trim() || 'Brak treści do wyświetlenia.';
      const words = cleanContent.split(/\s+/).filter(Boolean).length;
      chapters.push({
        id: `ch_${Date.now()}_1`,
        number: 1,
        title: baseTitle || 'Rozdział Główny',
        summary: cleanContent.slice(0, 160) + '...',
        readTimeMin: Math.max(1, Math.ceil(words / 180)),
        content: cleanContent
      });
    }

    return chapters;
  };

  // Extract raw text from file
  const extractTextFromFile = async (file: File): Promise<string> => {
    if (
      file.type.includes('text') || 
      file.name.endsWith('.txt') || 
      file.name.endsWith('.md') || 
      file.name.endsWith('.json') ||
      file.name.endsWith('.html') ||
      file.name.endsWith('.htm')
    ) {
      return await file.text();
    }

    // If PDF, parse text chunks
    if (file.type.includes('pdf') || file.name.endsWith('.pdf')) {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const textDecoder = new TextDecoder('utf-8');
      const raw = textDecoder.decode(bytes);

      const textMatches: string[] = [];
      const regex = /\((.*?)\)\s*T[jJ]/g;
      let m: RegExpExecArray | null;
      while ((m = regex.exec(raw)) !== null) {
        if (m[1]) {
          const clean = m[1].replace(/\\([()\\])/g, '$1');
          textMatches.push(clean);
        }
      }

      if (textMatches.length > 20) {
        return textMatches.join(' ');
      }

      const cleanAscii = raw
        .replace(/[^\x20-\x7E\xA0-\xFF\u0100-\u017F\n\r]/g, ' ')
        .replace(/\s{3,}/g, '\n\n')
        .trim();

      if (cleanAscii.length > 100) {
        return cleanAscii;
      }

      return `[PDF: ${file.name}]\nDokument został zaimportowany do NexusBook. Zawartość zoptymalizowana do odczytu w czytniku Nexus.`;
    }

    return await file.text().catch(() => `[Plik: ${file.name}]`);
  };

  // Process incoming files from drag-and-drop or file selector
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    soundFx.playClick();
    const newItems: ParsedImportItem[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const isHtml = file.name.endsWith('.html') || file.name.endsWith('.htm') || file.type.includes('html');
      const sanitizedMeta = cleanBookMetadata({
        fileName: file.name,
        title: file.name
      });

      const newItem: ParsedImportItem = {
        id: `import_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        file,
        fileName: file.name,
        sourceType: isHtml ? 'file-html' : (file.name.endsWith('.pdf') ? 'file-pdf' : 'file-txt'),
        title: sanitizedMeta.title,
        subtitle: sanitizedMeta.subtitle || `Importowane dzieło z archiwum // ${file.name}`,
        author: sanitizedMeta.author,
        rawText: '',
        chapters: [],
        category: 'Manifest',
        tags: sanitizedMeta.tags,
        seeker: 'Operator001',
        seekerColor: '#ffd700',
        wordCount: 0,
        estReadTimeMin: 0,
        status: 'parsing',
        isSubstackSource: isHtml || file.name.toLowerCase().includes('substack')
      };

      newItems.push(newItem);
    }

    setItems(prev => [...prev, ...newItems]);
    const startIndex = items.length;
    if (activeItemIndex === null) {
      setActiveItemIndex(startIndex);
    }

    // Process parsing in background
    for (let idx = 0; idx < newItems.length; idx++) {
      const current = newItems[idx];
      const actualIndex = startIndex + idx;

      try {
        const rawContent = await extractTextFromFile(current.file!);
        const isHtml = current.sourceType === 'file-html' || /<[a-z][\s\S]*>/i.test(rawContent);

        let finalTitle = current.title;
        let finalSubtitle = current.subtitle;
        let finalAuthor = current.author;
        let finalChapters: Chapter[] = [];
        let totalWords = 0;
        let estReadTime = 0;
        let cleanedHtml = '';
        let cleanStats: ParsedImportItem['cleanStats'] = undefined;
        let htmlWorldDoc = '';

        if ((isHtml || current.isSubstackSource) && autoCleanSubstack) {
          // Process via Substack Converter
          const subResult = processSubstackContent(rawContent, current.title);
          finalTitle = subResult.title;
          finalSubtitle = subResult.subtitle;
          finalAuthor = subResult.author;
          finalChapters = subResult.chapters;
          totalWords = subResult.stats.wordCount;
          estReadTime = subResult.stats.estReadTimeMin;
          cleanedHtml = subResult.cleanedHtml;
          cleanStats = {
            removedElementsCount: subResult.stats.removedElementsCount,
            removedBoilerplates: subResult.stats.removedBoilerplates
          };
          htmlWorldDoc = subResult.htmlWorldCode;
        } else {
          // Standard text parser
          finalChapters = parseTextIntoChapters(rawContent, current.title);
          totalWords = finalChapters.reduce((sum, ch) => sum + ch.content.split(/\s+/).filter(Boolean).length, 0);
          estReadTime = Math.max(1, Math.ceil(totalWords / 180));
        }

        // Auto-tag with AI
        const tagResult = await analyzeAndAutoTagBook({
          title: finalTitle,
          subtitle: finalSubtitle,
          shortDesc: finalChapters[0]?.summary || rawContent.slice(0, 200),
          htmlContent: cleanedHtml ? cleanedHtml.slice(0, 500) : rawContent.slice(0, 500),
          currentCategory: current.category,
          currentSeeker: current.seeker
        });

        const chosenSeeker = tagResult.recommendedSeeker || 'Operator001';
        const chosenColor = seekerColors[chosenSeeker] || '#ffd700';

        setItems(prev => prev.map((it, i) => {
          if (i === actualIndex) {
            return {
              ...it,
              title: finalTitle,
              subtitle: finalSubtitle,
              author: finalAuthor,
              rawText: rawContent,
              cleanedHtml,
              chapters: finalChapters,
              category: tagResult.suggestedCategory,
              tags: tagResult.suggestedTags,
              seeker: chosenSeeker,
              seekerColor: chosenColor,
              wordCount: totalWords,
              estReadTimeMin: estReadTime,
              status: 'analyzed',
              cleanStats,
              customHtmlWorld: generateHtmlWorld && htmlWorldDoc ? {
                htmlCode: htmlWorldDoc,
                themeColor: chosenColor,
                terminalActive: true,
                worldName: finalTitle,
                authorName: finalAuthor
              } : undefined
            };
          }
          return it;
        }));
      } catch (err: any) {
        setItems(prev => prev.map((it, i) => {
          if (i === actualIndex) {
            return {
              ...it,
              status: 'error',
              errorMessage: err?.message || 'Błąd podczas przetwarzania pliku.'
            };
          }
          return it;
        }));
      }
    }
  };

  // Direct paste Substack article handler
  const handleProcessSubstackPaste = async () => {
    if (!pastedSubstackText.trim()) return;

    soundFx.playClick();
    setIsProcessingSubstackPaste(true);

    try {
      const fallbackTitle = pastedSubstackTitle.trim() || 'ESEJ SUBSTACK';
      const subResult = processSubstackContent(pastedSubstackText, fallbackTitle);

      const title = pastedSubstackTitle.trim() || subResult.title;
      const subtitle = pastedSubstackSubtitle.trim() || subResult.subtitle;
      const author = subResult.author || 'Architekt Nexusa';

      // Auto-tag with AI
      const tagResult = await analyzeAndAutoTagBook({
        title,
        subtitle,
        shortDesc: subResult.chapters[0]?.summary || subResult.cleanedText.slice(0, 200),
        htmlContent: subResult.cleanedHtml.slice(0, 500),
        currentCategory: 'Psychologia',
        currentSeeker: 'BioSeeker'
      });

      const chosenSeeker = tagResult.recommendedSeeker || 'BioSeeker';
      const chosenColor = seekerColors[chosenSeeker] || '#00ff88';

      const newItem: ParsedImportItem = {
        id: `import_sub_${Date.now()}`,
        fileName: `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.html`,
        sourceType: 'substack-paste',
        title,
        subtitle,
        author,
        publishedDate: subResult.publishedDate,
        rawText: pastedSubstackText,
        cleanedHtml: subResult.cleanedHtml,
        chapters: subResult.chapters,
        category: tagResult.suggestedCategory,
        tags: tagResult.suggestedTags,
        seeker: chosenSeeker,
        seekerColor: chosenColor,
        wordCount: subResult.stats.wordCount,
        estReadTimeMin: subResult.stats.estReadTimeMin,
        status: 'analyzed',
        isSubstackSource: true,
        cleanStats: {
          removedElementsCount: subResult.stats.removedElementsCount,
          removedBoilerplates: subResult.stats.removedBoilerplates
        },
        customHtmlWorld: generateHtmlWorld ? {
          htmlCode: subResult.htmlWorldCode,
          themeColor: chosenColor,
          terminalActive: true,
          worldName: title,
          authorName: author
        } : undefined
      };

      setItems(prev => [newItem, ...prev]);
      setActiveItemIndex(0);
      setPastedSubstackText('');
      setPastedSubstackTitle('');
      setPastedSubstackSubtitle('');
      soundFx.playSuccess();
    } catch (err: any) {
      console.error('Error processing Substack paste:', err);
    } finally {
      setIsProcessingSubstackPaste(false);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Convert ParsedImportItem to final Book object
  const buildBookFromItem = (item: ParsedImportItem): Book => {
    const gradients = [
      'from-emerald-950 via-slate-900 to-black',
      'from-cyan-950 via-slate-900 to-black',
      'from-amber-950 via-slate-900 to-black',
      'from-purple-950 via-slate-900 to-black',
      'from-red-950 via-zinc-900 to-black'
    ];
    const chosenGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const preliminaryBook: Partial<Book> = {
      id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      title: item.title,
      subtitle: item.subtitle,
      series: item.isSubstackSource ? 'Archiwum Substack // Zintegrowane Eseje' : undefined,
      seeker: item.seeker,
      seekerColor: item.seekerColor,
      status: 'Published',
      year: new Date().getFullYear(),
      language: 'PL',
      tags: item.tags,
      timelineYear: new Date().getFullYear(),
      isFeatured: true,
      isManifesto: true,
      shortDesc: item.chapters[0]?.summary || `Oryginalny materiał z: ${item.fileName}`,
      longDesc: `Zintegrowany esej zaimportowany do ekosystemu NexusBook. Dzieło zawiera ${item.chapters.length} rozdziałów, ${item.wordCount} słów oraz analizę semantyczną węzła. ${item.cleanStats ? `Oczyszczono ${item.cleanStats.removedElementsCount} elementów szumu Substack.` : ''}`,
      authorNote: ',,Każde słowo prawdy wyrywa przestrzeń z rąk chaosu. Nexus chroni myśl nienaruszoną.,,',
      tableOfContents: item.chapters.map(c => `Rozdział ${c.number}: ${c.title}`),
      quotes: [
        {
          id: `q_${Date.now()}_1`,
          text: item.chapters[0]?.content.slice(0, 180) || 'Prawda jest fundamentem, który nie wymaga aprobaty.',
          chapterTitle: item.chapters[0]?.title || 'Prolog',
          tags: item.tags.slice(0, 3)
        }
      ],
      chapters: item.chapters,
      stats: {
        pageCount: Math.max(1, Math.ceil(item.wordCount / 280)),
        wordCount: item.wordCount,
        readerCount: 1,
        estReadTimeMin: item.estReadTimeMin
      },
      platformLinks: {
        pdfUrl: `#pdf-${item.id}`,
        substack: item.isSubstackSource ? 'https://substack.com' : undefined
      },
      coverStyle: {
        bgGradient: chosenGradient,
        accentColor: item.seekerColor,
        pattern: 'brutalist',
        symbol: item.isSubstackSource ? '⚡' : '📜'
      },
      customHtmlWorld: item.customHtmlWorld
    };

    const validation = validateAndAssignSeriesCollection(preliminaryBook, item.rawText);
    return validation.validatedBook;
  };

  // Import single book
  const handleImportSingle = (index: number) => {
    const item = items[index];
    if (!item || item.chapters.length === 0) return;

    soundFx.playSuccess();
    const finalBook = buildBookFromItem(item);
    onImportBook(finalBook);

    setItems(prev => prev.map((it, i) => i === index ? { ...it, status: 'imported' } : it));
  };

  // Import all ready books at once
  const handleImportAll = () => {
    const readyItems = items.filter(it => (it.status === 'analyzed' || it.status === 'pending') && it.chapters.length > 0);
    if (readyItems.length === 0) return;

    setIsProcessingAll(true);
    soundFx.playSuccess();

    const builtBooks = readyItems.map(buildBookFromItem);
    if (onImportMultipleBooks) {
      onImportMultipleBooks(builtBooks);
    } else {
      builtBooks.forEach(b => onImportBook(b));
    }

    setItems(prev => prev.map(it => {
      if ((it.status === 'analyzed' || it.status === 'pending') && it.chapters.length > 0) {
        return { ...it, status: 'imported' };
      }
      return it;
    }));

    setIsProcessingAll(false);
  };

  // Delete item from queue
  const handleDeleteItem = (index: number) => {
    soundFx.playRemoveFromCollection();
    setItems(prev => prev.filter((_, i) => i !== index));
    if (activeItemIndex === index) {
      setActiveItemIndex(null);
    } else if (activeItemIndex !== null && activeItemIndex > index) {
      setActiveItemIndex(activeItemIndex - 1);
    }
  };

  const handleCopyHtmlCode = () => {
    if (!activeItem?.customHtmlWorld?.htmlCode) return;
    navigator.clipboard.writeText(activeItem.customHtmlWorld.htmlCode);
    setCopiedHtml(true);
    soundFx.playClick();
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleDownloadHtmlFile = () => {
    if (!activeItem?.customHtmlWorld?.htmlCode) return;
    const blob = new Blob([activeItem.customHtmlWorld.htmlCode], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeItem.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_world.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    soundFx.playSuccess();
  };

  const activeItem = activeItemIndex !== null ? items[activeItemIndex] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md">
      <div 
        className="w-full max-w-6xl h-[92vh] bg-slate-950 border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-cyan-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <UploadCloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  SUBSTACK & PDF CONTENT INGESTION ENGINE
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold">
                  DE-NOISER v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Automatyczna konwersja Substack / PDF do czystego HTML Nexusa, eliminacja szumu i tagowanie AI.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playModalClose();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ingestion Source Tabs + Pipeline Controls */}
        <div className="px-4 sm:px-6 py-3 border-b border-white/10 bg-slate-900/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                soundFx.playClick();
                setInputTab('files');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                inputTab === 'files' 
                  ? 'bg-cyan-500 text-black shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              PLIKI (PDF / HTML / TXT)
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setInputTab('substack-paste');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                inputTab === 'substack-paste' 
                  ? 'bg-emerald-500 text-black shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              SUBSTACK INGEST (WKLEJ KOD / TEKST)
            </button>
          </div>

          {/* Pipeline Options Toggle */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
              <input 
                type="checkbox"
                checked={autoCleanSubstack}
                onChange={(e) => setAutoCleanSubstack(e.target.checked)}
                className="rounded border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Oczyszczaj szum Substacka
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
              <input 
                type="checkbox"
                checked={generateHtmlWorld}
                onChange={(e) => setGenerateHtmlWorld(e.target.checked)}
                className="rounded border-white/20 text-purple-500 focus:ring-0 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                Generuj Nexus HTML World
              </span>
            </label>
          </div>
        </div>

        {/* Input Panel Area (Conditional on inputTab) */}
        {inputTab === 'files' ? (
          <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950 shrink-0 space-y-4">
            
            {/* 94-Book Batch Migration Architecture Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
                  <Cpu className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      STRATEGIA MIGRACJI 94 TOMÓW ARCHIWUM PDF
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold">
                      CHUNKED V8 ENGINE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Nieblokujące przetwarzanie w chunkach (3-4 tomy) z podglądem na żywo, macierzą 94 węzłów, estymacją ETA i logami terminala.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                <input 
                  type="file" 
                  ref={batchFileInputRef} 
                  onChange={(e) => e.target.files && handleStartBatchWithFiles(e.target.files)} 
                  multiple 
                  accept=".pdf"
                  className="hidden" 
                />
                <button
                  onClick={() => batchFileInputRef.current?.click()}
                  className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  ZAŁADUJ 94 PLIKI PDF
                </button>

                <button
                  onClick={handleLaunch94SampleBatch}
                  className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-200 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Uruchom symulację wsadową 94 kanonicznych traktatów z podglądem krok po kroku"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  TEST 94 TOMÓW
                </button>
              </div>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => e.target.files && handleFiles(e.target.files)} 
              multiple 
              accept=".pdf,.txt,.md,.json,.html,.htm"
              className="hidden" 
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 sm:p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]' 
                  : 'border-white/15 bg-slate-900/30 hover:border-cyan-500/50 hover:bg-slate-900/60'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-2">
                <UploadCloud className="w-6 h-6 text-cyan-400 animate-bounce" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                Upuść tutaj pliki PDF z 94 książek lub pliki .html z Substacka
              </h3>
              <p className="text-xs text-slate-400 text-center max-w-lg mb-2">
                Silnik automatycznie usunie widgety subskrypcji, tracking UTM i stopki, generując czysty HTML oraz rozdziały.
              </p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
                  WYBIERZ PLIKI Z DYSKU
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  (PDF, HTML, MD, TXT)
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-white/10 bg-slate-950 shrink-0 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Tytuł artykułu (opcjonalnie — wykrywany automatycznie)"
                value={pastedSubstackTitle}
                onChange={(e) => setPastedSubstackTitle(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="Podtytuł / Dekład (opcjonalnie)"
                value={pastedSubstackSubtitle}
                onChange={(e) => setPastedSubstackSubtitle(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="relative">
              <textarea
                rows={3}
                placeholder="Wklej tutaj pobrany kod HTML artykułu ze strony Substack (lub skopiowany tekst wpisu)..."
                value={pastedSubstackText}
                onChange={(e) => setPastedSubstackText(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Silnik Substack De-noiser usunie przyciski 'Subscribe', 'Like', 'Restack' oraz tracking linków.
              </span>
              <button
                onClick={handleProcessSubstackPaste}
                disabled={!pastedSubstackText.trim() || isProcessingSubstackPaste}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30 disabled:opacity-40 cursor-pointer"
              >
                {isProcessingSubstackPaste ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    PRZETWARZANIE SUBSTACK...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    PRZEKONWERTUJ DO HTML NEXUSA
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Content Body: Queue List + Active Preview */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left: Queue Sidebar */}
          <div className="w-full md:w-80 border-r border-white/10 bg-slate-900/30 flex flex-col shrink-0 overflow-hidden">
            <div className="p-3 border-b border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="font-bold flex items-center gap-1.5 text-slate-300">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                KOLEJKA ({items.length})
              </span>
              {items.length > 0 && (
                <button
                  onClick={handleImportAll}
                  disabled={isProcessingAll}
                  className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <Save className="w-3 h-3" />
                  IMPORTUJ WSZYSTKO
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
              {items.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-mono text-xs">
                  Brak pozycji w kolejce. Upuść pliki lub wklej treść z Substacka.
                </div>
              ) : (
                items.map((it, idx) => {
                  const isSelected = activeItemIndex === idx;
                  return (
                    <div
                      key={it.id}
                      onClick={() => {
                        soundFx.playClick();
                        setActiveItemIndex(idx);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-950/50' 
                          : 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="truncate flex-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            {it.isSubstackSource && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/40 text-[9px] font-mono text-emerald-400 font-bold">
                                SUBSTACK
                              </span>
                            )}
                            <h4 className="font-bold text-xs text-white truncate">{it.title}</h4>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono truncate">{it.fileName}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(idx);
                          }}
                          className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                          title="Usuń z kolejki"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] font-mono">
                        <span className="text-slate-400">
                          {it.chapters.length} rozdz. • {it.wordCount} słów
                        </span>
                        {it.status === 'parsing' && (
                          <span className="text-amber-400 flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin" /> De-noising...
                          </span>
                        )}
                        {it.status === 'analyzed' && (
                          <span className="text-cyan-400 flex items-center gap-1 font-bold">
                            <Sparkles className="w-3 h-3" /> Gotowy
                          </span>
                        )}
                        {it.status === 'imported' && (
                          <span className="text-emerald-400 flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-3 h-3" /> W Nexusie
                          </span>
                        )}
                        {it.status === 'error' && (
                          <span className="text-red-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Błąd
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Selected Book Detail & Chapter Preview */}
          <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col">
            {activeItem ? (
              <div className="space-y-6">
                {/* Meta Edit Card */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase border"
                        style={{ color: activeItem.seekerColor, borderColor: `${activeItem.seekerColor}60` }}
                      >
                        {activeItem.seeker}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                        {activeItem.category}
                      </span>
                      {activeItem.cleanStats && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono">
                          ✓ Usunięto {activeItem.cleanStats.removedElementsCount} elementów szumu
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {activeItem.status !== 'imported' ? (
                        <button
                          onClick={() => activeItemIndex !== null && handleImportSingle(activeItemIndex)}
                          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-mono flex items-center gap-2 transition-all shadow-lg shadow-cyan-600/30 cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          ZAPISZ DO NEXUSBOOK
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ZAPISANE W BIBLIOTECE
                          </span>
                          {onOpenReader && (
                            <button
                              onClick={() => {
                                soundFx.playClick();
                                const b = buildBookFromItem(activeItem);
                                onOpenReader(b);
                                onClose();
                              }}
                              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              CZYTAJ TERAZ
                            </button>
                          )}
                          {activeItem.customHtmlWorld && onOpenHtmlWorld && (
                            <button
                              onClick={() => {
                                soundFx.playClick();
                                const b = buildBookFromItem(activeItem);
                                onOpenHtmlWorld(b);
                                onClose();
                              }}
                              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Code2 className="w-3.5 h-3.5" />
                              ŚWIAT HTML
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title & Subtitle Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                        Tytuł Dzieła
                      </label>
                      <input 
                        type="text" 
                        value={activeItem.title} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setItems(prev => prev.map((it, i) => i === activeItemIndex ? { ...it, title: val } : it));
                        }}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                        Podtytuł / Seria
                      </label>
                      <input 
                        type="text" 
                        value={activeItem.subtitle} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setItems(prev => prev.map((it, i) => i === activeItemIndex ? { ...it, subtitle: val } : it));
                        }}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                      Tagi Semantyczne
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {activeItem.tags.map((t, tidx) => (
                        <span key={tidx} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Detail View Sub-Tabs: Chapters | Nexus HTML World | Live Preview | Denoise Report */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setActiveDetailTab('chapters');
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                          activeDetailTab === 'chapters' 
                            ? 'bg-cyan-500 text-black' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        ROZDZIAŁY ({activeItem.chapters.length})
                      </button>

                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setActiveDetailTab('html-code');
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                          activeDetailTab === 'html-code' 
                            ? 'bg-purple-500 text-white' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        NEXUS HTML WORLD
                      </button>

                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setActiveDetailTab('live-preview');
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                          activeDetailTab === 'live-preview' 
                            ? 'bg-emerald-500 text-black' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        PODGLĄD LIVE
                      </button>

                      {activeItem.cleanStats && (
                        <button
                          onClick={() => {
                            soundFx.playClick();
                            setActiveDetailTab('denoise-report');
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                            activeDetailTab === 'denoise-report' 
                              ? 'bg-amber-500 text-black' 
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          RAPORT DE-NOISE
                        </button>
                      )}
                    </div>

                    <span className="text-xs font-mono text-slate-400">
                      {activeItem.wordCount} słów • ~{activeItem.estReadTimeMin} min
                    </span>
                  </div>

                  {/* Sub-Tab 1: Chapters */}
                  {activeDetailTab === 'chapters' && (
                    <div className="space-y-3">
                      {activeItem.chapters.map((ch) => (
                        <div 
                          key={ch.id}
                          className="p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-white/15 transition-all space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-cyan-400 font-bold">
                              ROZDZIAŁ {ch.number}: {ch.title}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">
                              {ch.readTimeMin} min czytania
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 font-sans line-clamp-3 leading-relaxed">
                            {ch.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sub-Tab 2: HTML Code */}
                  {activeDetailTab === 'html-code' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-white/10 font-mono text-xs">
                        <span className="text-slate-400">Czysty dokument HTML World w standardzie ETERNIVERSE OS</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleCopyHtmlCode}
                            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 cursor-pointer transition-all"
                          >
                            {copiedHtml ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            {copiedHtml ? 'SKOPIOWANO' : 'KOPIUJ KOD'}
                          </button>
                          <button
                            onClick={handleDownloadHtmlFile}
                            className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <Download className="w-3 h-3" />
                            POBIERZ .HTML
                          </button>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-white/10 max-h-80 overflow-y-auto custom-scrollbar font-mono text-[11px] text-emerald-300 leading-relaxed">
                        <pre className="whitespace-pre-wrap">
                          {activeItem.customHtmlWorld?.htmlCode || activeItem.cleanedHtml || activeItem.rawText}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Sub-Tab 3: Live Preview */}
                  {activeDetailTab === 'live-preview' && (
                    <div className="rounded-xl border border-white/15 overflow-hidden bg-slate-950 h-96">
                      {activeItem.customHtmlWorld?.htmlCode ? (
                        <iframe
                          title="Podgląd Nexus HTML World"
                          srcDoc={activeItem.customHtmlWorld.htmlCode}
                          className="w-full h-full border-0"
                          sandbox="allow-scripts allow-same-origin"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-500 font-mono text-xs">
                          Brak wygenerowanego kodu HTML World dla tego obiektu.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sub-Tab 4: De-noise Report */}
                  {activeDetailTab === 'denoise-report' && activeItem.cleanStats && (
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10 space-y-4 font-mono text-xs">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-emerald-400 font-bold flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" />
                          RAPORT PURYFIKACJI TREŚCI SUBSTACK
                        </span>
                        <span className="text-slate-400">
                          Usunięto {activeItem.cleanStats.removedElementsCount} elementów śmieciowych
                        </span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-slate-300">
                          Usunięte elementy szumu platformowego:
                        </p>
                        <ul className="space-y-1 list-disc list-inside text-slate-400">
                          <li>Widgety rejestracji i przyciski 'Subscribe to...'</li>
                          <li>Przyciski interakcji 'Like', 'Restack' oraz formularze komentarzy</li>
                          <li>Śledzące parametry analityczne (UTM parameters, referral tags)</li>
                          <li>Banery promocyjne i stopki marketingowe platformy</li>
                        </ul>
                      </div>

                      {activeItem.cleanStats.removedBoilerplates.length > 0 && (
                        <div>
                          <span className="text-amber-400 block mb-1">Przykłady usuniętych fragmentów:</span>
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-white/5 space-y-1 text-slate-500 text-[11px]">
                            {activeItem.cleanStats.removedBoilerplates.map((b, bIdx) => (
                              <div key={bIdx}>✗ "{b}"</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 font-mono">
                <FileText className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-sm font-bold text-slate-400 mb-1">Wybierz pozycję z kolejki po lewej stronie</p>
                <p className="text-xs max-w-sm text-slate-600">
                  Możesz edytować tytuł, sprawdzić podział na rozdziały, podejrzeć wygenerowany kod HTML World oraz natychmiast zapisać dzieło do NexusBook.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-900/80 flex items-center justify-between shrink-0 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NEXUS SUBSTACK PURIFICATION & INGESTION PIPELINE // ETERNIVERSE OS</span>
          </div>
          <button
            onClick={() => {
              soundFx.playModalClose();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
          >
            ZAMKNIJ PANEL
          </button>
        </div>

      </div>

      {/* 94-Book Batch Migration Progress UI Overlay */}
      {showBatchModal && (
        <BatchMigrationModal
          isOpen={showBatchModal}
          progress={batchProgress}
          controller={batchController}
          onClose={() => setShowBatchModal(false)}
          onCommitBooksToLibrary={(books) => {
            if (onImportMultipleBooks) {
              onImportMultipleBooks(books);
            } else {
              books.forEach(b => onImportBook(b));
            }
          }}
        />
      )}
    </div>
  );
};
