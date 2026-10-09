import React, { useState, useRef } from 'react';

interface EmptyModuleSlotProps {
  onDropZip: (file: File) => void;
  onDropFiles?: (files: File[]) => void;
  onSelectZip: () => void;
  onGenerateSample?: () => void;
}

export const EmptyModuleSlot: React.FC<EmptyModuleSlotProps> = ({
  onDropZip = (_: any) => {},
  onDropFiles,
  onSelectZip = () => {},
  onGenerateSample = () => {},
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validZips = Array.from(e.dataTransfer.files as FileList).filter(
        (f: File) => f.name.endsWith('.zip') || f.type.includes('zip')
      );
      if (validZips.length === 0) return;
      if (validZips.length > 1 && onDropFiles) {
        onDropFiles(validZips);
      } else {
        onDropZip(validZips[0]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validZips = Array.from(e.target.files as FileList).filter(
        (f: File) => f.name.endsWith('.zip') || f.type.includes('zip')
      );
      if (validZips.length === 0) return;
      if (validZips.length > 1 && onDropFiles) {
        onDropFiles(validZips);
      } else {
        onDropZip(validZips[0]);
      }
      e.target.value = '';
    }
  };

  return (
    <div
      id="nexus-empty-module-slot"
      className={`nexus-slot-card p-6 flex flex-col items-center justify-center text-center min-h-[340px] cursor-pointer transition-all duration-200 select-none ${
        isDragOver ? 'dragover' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".zip,application/zip,application/x-zip-compressed"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Cybernetic Cross Reticle */}
      <div className="w-12 h-12 rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/5 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
        <span className="text-[#00E5FF] font-mono-tech text-xl font-light">+</span>
      </div>

      <div className="text-[13px] font-mono-tech tracking-[0.2em] text-[#00E5FF] uppercase font-bold mb-2">
        MODULE SLOT
      </div>

      <div className="text-[12px] font-mono-tech tracking-wider text-[#94A3B8] uppercase mb-1">
        DROP ZIP PACKAGE
      </div>

      <div className="text-[11px] font-mono-tech text-[#64748B] uppercase mb-4">
        OR SELECT PACKAGE
      </div>

      <div className="flex flex-col gap-2 w-full max-w-[220px]">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="w-full py-1.5 px-3 rounded text-[11px] font-mono-tech tracking-wider uppercase bg-[#0C101C] border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#05070D] transition-all cursor-pointer shadow-sm"
        >
          SELECT .ZIP FILE
        </button>

        {onGenerateSample && (
          <button
            type="button"
            title="Create and test an authentic NEXUS package instantly"
            onClick={(e) => {
              e.stopPropagation();
              onGenerateSample();
            }}
            className="w-full py-1 px-2 rounded text-[10px] font-mono-tech tracking-wider uppercase text-[#A855F7] border border-[#A855F7]/30 hover:border-[#A855F7] hover:bg-[#A855F7]/10 transition-all cursor-pointer"
          >
            + TEST SAMPLE ZIP
          </button>
        )}
      </div>

      <div className="mt-4 text-[10px] font-mono-tech text-[#475569]">
        AUTO-READS MANIFEST.JSON
      </div>
    </div>
  );
};
