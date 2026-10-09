import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Code2, 
  RotateCcw, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Edit3, 
  Terminal, 
  Globe, 
  Layers,
  Shield,
  Zap
} from 'lucide-react';
import { Book } from '../types';
import { soundFx } from '../utils/audioSystem';

interface HtmlWorldViewerModalProps {
  book: Book | null;
  onClose: () => void;
  onOpenStudioForBook?: (book: Book) => void;
}

export const HtmlWorldViewerModal: React.FC<HtmlWorldViewerModalProps> = ({
  book,
  onClose,
  onOpenStudioForBook
}) => {
  const [isFullscreenIframe, setIsFullscreenIframe] = useState(false);
  const [copied, setCopied] = useState(false);
  const [keyCounter, setKeyCounter] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  if (!book || !book.customHtmlWorld) return null;

  const htmlCode = book.customHtmlWorld.htmlCode;
  const worldName = book.customHtmlWorld.worldName || book.title;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    soundFx.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${book.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_world.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    soundFx.playSuccess();
  };

  const handleReload = () => {
    soundFx.playClick();
    setKeyCounter(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in duration-200">
      
      {/* Top HUD Control Bar */}
      {!isFullscreenIframe && (
        <header className="h-16 px-4 md:px-6 bg-zinc-950/90 border-b border-white/10 flex items-center justify-between shrink-0 select-none z-10">
          <div className="flex items-center gap-3 truncate">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shrink-0"
              style={{ backgroundColor: book.seekerColor || '#ff3b3b' }}
            >
              <Zap className="w-4 h-4 text-white animate-pulse" />
            </div>

            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/30 uppercase font-bold tracking-wider">
                  HTML WORLD // MANIFEST
                </span>
                <span className="text-xs font-mono text-white/50 hidden md:inline">
                  {book.seeker}
                </span>
              </div>
              <h2 className="text-sm md:text-base font-black text-white truncate tracking-tight">
                {worldName}
              </h2>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={handleReload}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
              title="Odśwież Świat"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Odśwież</span>
            </button>

            <button
              onClick={handleCopyCode}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
              title="Kopiuj Kod HTML"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Skopiowano' : 'Kopiuj Kod'}</span>
            </button>

            <button
              onClick={handleDownloadHtml}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
              title="Pobierz Plik HTML"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Pobierz HTML</span>
            </button>

            {onOpenStudioForBook && (
              <button
                onClick={() => {
                  soundFx.playModalOpen();
                  onOpenStudioForBook(book);
                }}
                className="px-3 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-cyan-950/50"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edytuj Świat</span>
              </button>
            )}

            <button
              onClick={() => setIsFullscreenIframe(true)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              title="Pełny Ekran Bez Paska"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundFx.playModalClose();
                onClose();
              }}
              className="p-2 rounded-lg bg-red-950/50 hover:bg-red-900/80 text-red-200 border border-red-500/30 transition-colors ml-2"
              title="Zamknij Świat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>
      )}

      {/* Embedded Sandboxed Live Frame */}
      <div className="flex-1 relative w-full h-full bg-black overflow-hidden">
        {/* Floating exit fullscreen button when in total fullbleed */}
        {isFullscreenIframe && (
          <button
            onClick={() => setIsFullscreenIframe(false)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-xl bg-black/80 hover:bg-red-900 text-white border border-white/20 shadow-2xl backdrop-blur-md transition-all flex items-center gap-2 text-xs font-mono font-bold"
          >
            <Minimize2 className="w-4 h-4 text-cyan-400" />
            <span>Przywróć HUD</span>
          </button>
        )}

        <iframe
          key={keyCounter}
          ref={iframeRef}
          srcDoc={htmlCode}
          title={worldName}
          className="w-full h-full border-none bg-black"
          sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-forms"
        />
      </div>

    </div>
  );
};
