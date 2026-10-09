import React, { useState, useEffect, useRef } from 'react';

interface ModuleImageAreaProps {
  images: string[];
  accent: string;
  moduleName: string;
  onAddImage: (file: File) => void;
}

export const ModuleImageArea: React.FC<ModuleImageAreaProps> = ({
  images,
  accent,
  moduleName,
  onAddImage = (_: File) => {},
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const safeImages = images.slice(0, 4);
  const hasImages = safeImages.length > 0;

  // 4-Image Hover Engine
  // On hover: cycle through image 1 -> image 2 -> image 3 -> image 4 -> image 1
  // On leave: return to image 1
  useEffect(() => {
    if (isHovered && safeImages.length > 1) {
      // Fast, elegant crossfade cadence (approx 850ms per frame)
      intervalRef.current = window.setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % safeImages.length);
      }, 850);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentIndex(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, safeImages.length]);

  // Mobile / Touch support: tapping advances to next frame
  const handleTouchAdvance = (e: React.MouseEvent | React.TouchEvent) => {
    // Only if not triggering add file
    if (safeImages.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % safeImages.length);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAddImage(e.target.files[0]);
    }
  };

  return (
    <div
      className="relative w-full h-36 rounded-lg overflow-hidden bg-[#070A14] border border-[#121827] group/img cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleTouchAdvance}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />

      {hasImages ? (
        <>
          {/* Images stacked for instant CSS crossfade */}
          {safeImages.map((src, idx) => (
            <div
              key={idx}
              className="absolute inset-0 transition-opacity duration-300 ease-in-out pointer-events-none"
              style={{
                opacity: idx === currentIndex ? 1 : 0,
                zIndex: idx === currentIndex ? 10 : 1,
              }}
            >
              <img
                src={src}
                alt={`${moduleName} frame ${idx + 1}`}
                className="w-full h-full object-cover object-center select-none"
                loading="lazy"
              />
            </div>
          ))}

          {/* Vignette / Cybernetic scan overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C101C]/80 via-transparent to-transparent pointer-events-none z-10" />

          {/* Sequence indicators (Frame 1 2 3 4) */}
          {safeImages.length > 1 && (
            <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5 bg-[#05070D]/85 backdrop-blur-xs px-2 py-0.5 rounded border border-[#1A2234]">
              <span className="text-[9px] font-mono-tech text-[#64748B]">SEQ</span>
              <div className="flex gap-1">
                {safeImages.map((_, idx) => (
                  <span
                    key={idx}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                    style={{
                      backgroundColor: idx === currentIndex ? accent : '#1E293B',
                      boxShadow: idx === currentIndex ? `0 0 6px ${accent}` : 'none',
                    }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono-tech" style={{ color: accent }}>
                0{currentIndex + 1}/0{safeImages.length}
              </span>
            </div>
          )}

          {/* Plus button to add / replace image if less than 4 or on demand */}
          <button
            title="Add or replace module image (up to 4)"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="absolute top-2 right-2 z-20 w-6 h-6 rounded bg-[#070A12]/90 border border-white/10 hover:border-[#00E5FF] text-[#94A3B8] hover:text-[#00E5FF] flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-200"
          >
            <span className="text-xs font-mono-tech">+</span>
          </button>
        </>
      ) : (
        /* Empty Image State */
        <div
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-[#64748B] hover:text-[#00E5FF] hover:border-[#00E5FF]/40 border border-dashed border-white/10 rounded-lg transition-all"
        >
          <span className="text-base font-mono-tech mb-1">+</span>
          <span className="text-[11px] font-mono-tech tracking-wider uppercase">ADD MODULE IMAGE</span>
          <span className="text-[9px] text-[#475569] mt-0.5 font-mono-tech">UP TO 4 (PNG, JPG, SVG)</span>
        </div>
      )}
    </div>
  );
};
