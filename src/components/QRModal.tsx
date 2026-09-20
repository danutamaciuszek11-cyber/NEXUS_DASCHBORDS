import React from 'react';
import { X, Share2, Download, Check, Sparkles } from 'lucide-react';
import { Book } from '../types';
import { generateSvgQrCode } from '../utils/qrGenerator';
import { soundFx } from '../utils/audioSystem';

interface QRModalProps {
  book: Book;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ book, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const shareUrl = `https://nexusbook.eterniverse.os/book/${book.id}`;
  const qrSvg = generateSvgQrCode(shareUrl, 220, book.seekerColor || '#00f0ff');

  const handleCopyLink = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-hidden animate-in fade-in duration-300">
      
      <div 
        className="w-full max-w-sm rounded-3xl bg-slate-950 border border-white/10 shadow-2xl p-6 text-center space-y-5 font-mono"
        style={{
          boxShadow: `0 0 30px ${book.seekerColor}30`
        }}
      >
        <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5" />
            GENERATOR QR NEXUSBOOK
          </span>
          <button
            onClick={() => {
              soundFx.playModalClose();
              onClose();
            }}
            className="p-1 rounded bg-slate-900 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <span 
            className="text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase"
            style={{ color: book.seekerColor, borderColor: `${book.seekerColor}40` }}
          >
            {book.seeker}
          </span>
          <h3 className="text-lg font-extrabold text-white mt-1">
            {book.title}
          </h3>
          <p className="text-xs text-slate-400">
            Zeskanuj kod QR, aby natychmiastowo zsynchronizować czytnik mobilny.
          </p>
        </div>

        {/* QR Matrix */}
        <div 
          className="p-3 bg-slate-950 rounded-2xl border border-white/10 inline-block shadow-inner"
          dangerouslySetInnerHTML={{ __html: qrSvg }}
        />

        <div className="space-y-2 text-xs">
          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/50 text-slate-200 font-bold flex items-center justify-center gap-2 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? 'LINK SKOPIOWANY!' : 'KOPIUJ BEZPOŚREDNI LINK'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
