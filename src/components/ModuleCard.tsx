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

        {/* Dependencies & Git Repo Tag */}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {module.dependencies && module.dependencies.length > 0 ? (
            module.dependencies.map((dep) => (
              <span
                key={dep}
                className="px-1.5 py-0.5 rounded bg-[#121827] border border-[#1E293B] text-[10px] font-mono-tech text-[#94A3B8]"
                title={`Wymaga zależności: ${dep}`}
              >
                dep::{dep.replace('nexus-', '').replace('-os', '')}
              </span>
            ))
          ) : (
            <span className="px-1.5 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[10px] font-mono-tech text-[#00E5FF]">
              ROOT_CORE
            </span>
          )}

          {module.repoUrl && (
            <a
              href={module.repoUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="ml-auto px-1.5 py-0.5 rounded bg-[#1E293B]/50 hover:bg-[#1E293B] text-[10px] font-mono-tech text-[#38BDF8] hover:text-white transition-colors flex items-center gap-1"
              title="Otwórz oficjalne repozytorium GitHub"
            >
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GIT</span>
            </a>
          )}
        </div>
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
