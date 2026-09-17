import React, { useEffect, useRef } from 'react';
import { NexusModule } from '../core/types';

interface ContextMenuProps {
  x: number;
  y: number;
  module: NexusModule;
  onClose: () => void;
  onOpen: () => void;
  onReload: () => void;
  onReplaceZip: () => void;
  onAddImages: () => void;
  onViewInfo: () => void;
  onExportZip: () => void;
  onRemove: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  module,
  onClose = () => {},
  onOpen = () => {},
  onReload = () => {},
  onReplaceZip = () => {},
  onAddImages = () => {},
  onViewInfo = () => {},
  onExportZip = () => {},
  onRemove = () => {},
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Keep menu within viewport bounds
  const adjustedX = Math.min(x, window.innerWidth - 240);
  const adjustedY = Math.min(y, window.innerHeight - 340);

  const accentColor = module.accent || '#00E5FF';

  return (
    <div
      id="nexus-module-context-menu"
      ref={menuRef}
      className="fixed z-50 w-60 bg-[#090C16] border border-[#00E5FF]/40 rounded-lg shadow-[0_0_24px_rgba(0,0,0,0.85),0_0_14px_rgba(0,229,255,0.18)] overflow-hidden py-1 text-[11px] font-mono-tech select-none backdrop-blur-md animate-fadeIn"
      style={{ left: `${adjustedX}px`, top: `${adjustedY}px` }}
    >
      {/* Header with module name and node */}
      <div className="px-3 py-2 border-b border-[#121827] bg-[#0C101C]/90 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 truncate">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: accentColor, boxShadow: `0 0 6px ${accentColor}` }}
          />
          <span className="text-[10px] text-white uppercase tracking-wider font-bold truncate">
            {module.name}
          </span>
        </div>
        <span className="text-[9px] text-[#64748B] shrink-0">{module.node}</span>
      </div>

      <div className="py-1">
        {/* 1. Open Module */}
        <button
          id="context-open-module"
          onClick={() => {
            onOpen();
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 text-[#00E5FF] hover:bg-[#00E5FF]/10 flex items-center gap-2.5 cursor-pointer transition-colors"
        >
          <span className="text-[#00E5FF]">▶</span>
          <span>Open Module</span>
        </button>

        {/* 2. Reload Module */}
        <button
          id="context-reload-module"
          onClick={() => {
            onReload();
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 text-[#E2E8F0] hover:bg-white/5 flex items-center gap-2.5 cursor-pointer transition-colors"
        >
          <span className="text-[#94A3B8]">↻</span>
          <span>Reload Module</span>
        </button>

        {/* 3. Export Module ZIP */}
        <button
          id="context-export-zip"
          onClick={() => {
            onExportZip();
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 text-[#00D9A6] hover:bg-[#00D9A6]/10 flex items-center gap-2.5 cursor-pointer transition-colors"
        >
          <span className="text-[#00D9A6]">⇩</span>
          <span>Export ZIP</span>
        </button>

        {/* 4. Replace Module ZIP */}
        <button
          id="context-replace-zip"
          onClick={() => {
            onReplaceZip();
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 text-[#E2E8F0] hover:bg-white/5 flex items-center gap-2.5 cursor-pointer transition-colors"
        >
          <span className="text-[#94A3B8]">⇪</span>
          <span>Replace Module ZIP</span>
        </button>

        {/* 5. Add Images */}
        <button
          id="context-add-images"
          onClick={() => {
            onAddImages();
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 text-[#E2E8F0] hover:bg-white/5 flex items-center gap-2.5 cursor-pointer transition-colors"
        >
          <span className="text-[#94A3B8]">+</span>
          <span>Add Images</span>
          <span className="ml-auto text-[9px] text-[#64748B]">({module.images.length}/4)</span>
        </button>

        {/* 6. View Module Info */}
        <button
          id="context-view-info"
          onClick={() => {
            onViewInfo();
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 text-[#E2E8F0] hover:bg-white/5 flex items-center gap-2.5 cursor-pointer transition-colors"
        >
          <span className="text-[#94A3B8]">ℹ</span>
          <span>View Module Info</span>
        </button>

        <div className="h-[1px] bg-[#121827] my-1" />

        {/* 7. Remove Module */}
        <button
          id="context-remove-module"
          onClick={() => {
            onRemove();
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 text-[#FF3B5C] hover:bg-[#FF3B5C]/10 flex items-center gap-2.5 cursor-pointer transition-colors"
        >
          <span>✕</span>
          <span>Remove Module</span>
        </button>
      </div>
    </div>
  );
};
