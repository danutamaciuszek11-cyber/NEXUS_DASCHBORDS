import React, { useState, useEffect, useRef } from 'react';
import { ModuleImageArea } from './ModuleImageArea';
import { StatusBadge } from './StatusBadge';
import { NexusModule } from '../core/types';

interface ModuleCardProps {
  module: NexusModule;
  onOpen: (module: NexusModule) => void;
  onContextMenu: (e: React.MouseEvent, module: NexusModule) => void;
  onAddImage: (moduleId: string, file: File) => void;
  onDropZipOnCard?: (file: File) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  onOpen = (_: any) => {},
  onContextMenu = (_: any, __: any) => {},
  onAddImage = (_: any, __: any) => {},
  onDropZipOnCard = (_: any) => {},
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.zip') && onDropZipOnCard) {
        onDropZipOnCard(file);
      } else if (file.type.startsWith('image/')) {
        onAddImage(module.id, file);
      }
    }
  };

  const accentColor = module.accent || '#00E5FF';

  return (
    <div
      id={`module-card-${module.id}`}
      className={`nexus-card group flex flex-col justify-between transition-all duration-200 select-none ${
        isDragOver ? 'ring-2 ring-[#00E5FF] scale-[1.01]' : ''
      }`}
      style={{
        borderColor: isHovered ? `${accentColor}80` : 'rgba(0, 229, 255, 0.16)',
        boxShadow: isHovered
          ? `0 0 20px ${accentColor}25, inset 0 0 12px ${accentColor}08`
          : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={(e) => onContextMenu(e, module)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Card Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            {/* Tech Icon / Indicator */}
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 8px ${accentColor}`,
              }}
            />
            <h2
              className="font-bold text-white text-[15px] tracking-wider truncate font-sans"
              title={module.name}
            >
              {module.name}
            </h2>
          </div>
          <StatusBadge status={module.status} accent={accentColor} />
        </div>

        {/* Description */}
        <p className="text-[#94A3B8] text-[13px] leading-relaxed line-clamp-2 h-10">
          {module.description}
        </p>
      </div>

      {/* 4-Image Hover Engine Area */}
      <div className="px-4 py-1">
        <ModuleImageArea
          images={module.images}
          accent={accentColor}
          moduleName={module.name}
          onAddImage={(file) => onAddImage(module.id, file)}
        />
      </div>

      {/* Card Footer: Technical Metadata + Open Module Control */}
      <div className="p-4 pt-3 mt-auto border-t border-[#121827] bg-[#0A0E1A]/60 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] font-mono-tech text-[#64748B]">
          <span className="text-[#94A3B8]">MOD::{module.version}</span>
          <span>•</span>
          <span style={{ color: `${accentColor}CC` }}>{module.node}</span>
        </div>

        <button
          id={`open-btn-${module.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpen(module);
          }}
          className="px-3.5 py-1.5 rounded text-[11px] font-mono-tech tracking-wider uppercase transition-all duration-200 border cursor-pointer flex items-center gap-1.5"
          style={{
            borderColor: isHovered ? accentColor : 'rgba(0, 229, 255, 0.28)',
            color: isHovered ? '#05070D' : accentColor,
            backgroundColor: isHovered ? accentColor : 'transparent',
            boxShadow: isHovered ? `0 0 14px ${accentColor}60` : 'none',
          }}
        >
          <span>OPEN MODULE</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      {/* Drag Overlay visual if user drags a ZIP or image directly onto this card */}
      {isDragOver && (
        <div className="absolute inset-0 bg-[#070A12]/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20 border border-[#00E5FF]">
          <span className="text-[#00E5FF] font-mono-tech text-xs tracking-widest uppercase mb-1">
            [ DROP TO UPDATE PACKAGE / IMAGES ]
          </span>
          <span className="text-[#94A3B8] text-[11px]">Accepts .ZIP package or images (PNG, JPG, SVG)</span>
        </div>
      )}
    </div>
  );
};
