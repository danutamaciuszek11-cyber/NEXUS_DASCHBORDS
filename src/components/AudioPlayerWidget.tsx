import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  X, 
  Headphones, 
  Radio, 
  Sliders
} from 'lucide-react';
import { Book } from '../types';
import { soundFx } from '../utils/audioSystem';

interface AudioPlayerWidgetProps {
  book: Book;
  onClose: () => void;
}

export const AudioPlayerWidget: React.FC<AudioPlayerWidgetProps> = ({
  book,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const playlist = book.playlist || [
    { title: `${book.title} - Rozdział 1 Audio`, artist: 'ETERNIVERSE Audio Lab', duration: '12:45' },
    { title: `${book.title} - Rozdział 2 Audio`, artist: 'ETERNIVERSE Audio Lab', duration: '18:10' }
  ];

  const currentTrack = playlist[currentTrackIdx] || playlist[0];

  // Visualizer Animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const renderWave = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 28;
      const barWidth = canvas.width / barCount;

      for (let i = 0; i < barCount; i++) {
        const heightMultiplier = isPlaying 
          ? Math.sin(frame * 0.1 + i * 0.4) * 0.5 + 0.5 
          : 0.1;
        
        const barHeight = Math.max(4, heightMultiplier * canvas.height * 0.85);
        const x = i * barWidth;
        const y = canvas.height - barHeight;

        const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
        grad.addColorStop(0, book.seekerColor || '#00f0ff');
        grad.addColorStop(1, '#050a14');

        ctx.fillStyle = grad;
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
      }

      animId = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => cancelAnimationFrame(animId);
  }, [isPlaying, book.seekerColor]);

  // Simulated progress timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const togglePlay = () => {
    soundFx.playClick();
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    soundFx.playClick();
    setCurrentTrackIdx(prev => (prev + 1) % playlist.length);
    setProgress(0);
  };

  const handlePrevTrack = () => {
    soundFx.playClick();
    setCurrentTrackIdx(prev => (prev - 1 + playlist.length) % playlist.length);
    setProgress(0);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md p-5 rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-white/20 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-300">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <Headphones className="w-4 h-4" />
          <span>AUDIOBOOK STREAM • ETERNIVERSE</span>
        </div>
        <button
          onClick={() => {
            soundFx.playModalClose();
            onClose();
          }}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Track info & visualizer */}
      <div className="flex items-center gap-4">
        <div 
          className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center font-mono text-2xl text-white font-bold shrink-0"
          style={{ backgroundColor: `${book.seekerColor}40` }}
        >
          {book.coverStyle.symbol}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-mono text-sm font-bold text-white truncate">
            {currentTrack.title}
          </h4>
          <p className="font-mono text-xs text-slate-400 truncate">
            {currentTrack.artist} • {book.title}
          </p>

          {/* Canvas Waveform */}
          <canvas 
            ref={canvasRef} 
            width={200} 
            height={24} 
            className="w-full h-6 mt-1 rounded bg-slate-900 border border-white/5"
          />
        </div>
      </div>

      {/* Seek Bar */}
      <div className="space-y-1 font-mono text-[10px] text-slate-400">
        <div 
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pct = (clickX / rect.width) * 100;
            setProgress(pct);
          }}
          className="w-full h-2 rounded-full bg-slate-900 border border-white/10 cursor-pointer relative overflow-hidden"
        >
          <div 
            className="h-full bg-amber-400 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between">
          <span>04:12</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex items-center justify-between pt-1 font-mono text-xs">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevTrack}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="p-3 rounded-2xl font-bold text-black shadow-lg transition-transform active:scale-95"
            style={{ backgroundColor: book.seekerColor || '#ffd700' }}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={handleNextTrack}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <span className="text-[10px] px-2 py-1 rounded bg-slate-900 text-slate-500 border border-white/5">
          HQ 320k
        </span>
      </div>

    </div>
  );
};
