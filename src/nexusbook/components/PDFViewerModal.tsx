import React, { useState } from 'react';
import { 
  X, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Maximize2,
  Printer,
  Bookmark
} from 'lucide-react';
import { Book } from '../types';
import { soundFx } from '../utils/audioSystem';

interface PDFViewerModalProps {
  book: Book;
  onClose: () => void;
}

export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  book,
  onClose
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');

  const totalPages = book.stats.pageCount || 120;

  const handleZoomIn = () => {
    soundFx.playClick();
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    soundFx.playClick();
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      soundFx.playPageTurn();
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      soundFx.playPageTurn();
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 md:p-6 overflow-hidden animate-in fade-in duration-300">
      
      <div 
        className="w-full max-w-5xl h-[92vh] rounded-3xl bg-slate-950 border border-white/10 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* PDF Top Control Bar */}
        <div className="p-4 border-b border-white/10 bg-slate-900 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <span className="text-[10px] uppercase text-slate-400">PDF READER FORMAT</span>
              <h3 className="font-bold text-white truncate max-w-xs">{book.title}.pdf</h3>
            </div>
          </div>

          {/* Search Bar inside Document */}
          <div className="flex items-center gap-2 bg-slate-950 border border-white/10 px-3 py-1.5 rounded-xl text-slate-300">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input 
              type="text"
              placeholder="Szukaj w dokumencie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-32 md:w-44"
            />
          </div>

          {/* Page Navigation */}
          <div className="flex items-center gap-2 bg-slate-950 border border-white/10 px-3 py-1 rounded-xl">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white font-bold">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-950 border border-white/10 p-1 rounded-xl">
            <button onClick={handleZoomOut} className="p-1 hover:text-white text-slate-400">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-1 text-white text-[11px] font-bold">{zoomLevel}%</span>
            <button onClick={handleZoomIn} className="p-1 hover:text-white text-slate-400">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playClick();
                alert(`Pobieranie oficjalnego wydania PDF: ${book.title}`);
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">POBIERZ</span>
            </button>

            <button
              onClick={() => {
                soundFx.playModalClose();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-950 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* PDF Simulated Document Page Display */}
        <div className="flex-1 overflow-auto p-6 md:p-12 bg-slate-900/40 custom-scrollbar flex justify-center">
          <div 
            className="bg-slate-950 border border-white/20 shadow-2xl p-8 md:p-14 rounded-2xl text-slate-200 font-serif space-y-6 transition-transform duration-200"
            style={{
              width: `${(650 * zoomLevel) / 100}px`,
              minHeight: `${(850 * zoomLevel) / 100}px`
            }}
          >
            {/* Header of PDF Page */}
            <div className="border-b border-white/10 pb-4 flex justify-between font-mono text-[10px] text-slate-500 uppercase tracking-widest">
              <span>ETERNIVERSE OS • OFFICIAL PDF ARCHIVE</span>
              <span>KOD MODUŁU: {book.id}</span>
            </div>

            <div className="text-center py-6 space-y-2 font-mono">
              <span 
                className="text-xs font-bold px-3 py-1 rounded-full border uppercase"
                style={{ color: book.seekerColor, borderColor: `${book.seekerColor}40` }}
              >
                {book.seeker}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wider">
                {book.title}
              </h1>
              <p className="text-xs text-slate-400 font-sans italic">
                {book.subtitle}
              </p>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-slate-300 font-sans text-justify">
              <p className="first-letter:text-4xl first-letter:font-mono first-letter:text-cyan-400 first-letter:float-left first-letter:mr-2">
                Strona {currentPage} dokumentu cyfrowego. Niniejszy plik reprezentuje autentyczny, niezmodyfikowany zapis wiedzy zebranej w ramach ramowej architektury ETERNIVERSE OS.
              </p>
              <p>
                {book.longDesc}
              </p>
              <div className="p-4 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs text-cyan-300">
                CYTAT KLUCZOWY STRONY {currentPage}:
                <br />
                "{book.quotes[0]?.text || 'Świadomość to system operacyjny nowej ery.'}"
              </div>
              <p>
                Wszystkie rozdziały zostały zweryfikowane pod kątem spójności semantycznej i zintegrowane z globalnym indeksem wyszukiwania NEXUSBOOK.
              </p>
            </div>

            {/* Footer of PDF Page */}
            <div className="border-t border-white/10 pt-4 flex justify-between font-mono text-[10px] text-slate-500">
              <span>NEXUSBOOK ARCHIVE © 2026</span>
              <span>STRONA {currentPage} Z {totalPages}</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
