import React, { useState, useEffect, useRef } from 'react';
import { SystemLogEntry } from '../core/types';

interface SystemTerminalProps {
  logs: SystemLogEntry[];
  onClear: () => void;
}

export const SystemTerminal: React.FC<SystemTerminalProps> = ({ logs, onClear = () => {} }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const logContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (logContainerRef.current && !isCollapsed) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, isCollapsed]);

  return (
    <div
      id="nexus-system-terminal"
      className="border border-[#121827] bg-[#05070D]/95 rounded-lg overflow-hidden transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
    >
      {/* Terminal Title Bar */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between px-3.5 py-2 bg-[#090C16] border-b border-[#121827] cursor-pointer hover:bg-[#0C101C] transition-colors select-none"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
          <span className="text-[11px] font-mono-tech tracking-[0.18em] text-[#00E5FF] uppercase font-bold">
            NEXUS SYSTEM TERMINAL
          </span>
          <span className="text-[10px] font-mono-tech text-[#64748B]">
            [{logs.length} LOGS]
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="text-[10px] font-mono-tech text-[#64748B] hover:text-[#94A3B8] px-2 py-0.5 rounded uppercase cursor-pointer"
          >
            CLEAR
          </button>
          <button
            id="toggle-terminal-collapse-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(!isCollapsed);
            }}
            className="text-[10px] font-mono-tech text-[#00E5FF] hover:text-white px-2 py-0.5 rounded border border-[#00E5FF]/30 hover:border-[#00E5FF] uppercase cursor-pointer flex items-center gap-1"
          >
            <span>{isCollapsed ? 'EXPAND TERMINAL ▲' : 'COLLAPSE TERMINAL ▼'}</span>
          </button>
        </div>
      </div>

      {/* Monospace Terminal Logs Body */}
      {!isCollapsed && (
        <div
          ref={logContainerRef}
          className="p-3 font-mono-tech text-[11px] leading-relaxed max-h-44 overflow-y-auto space-y-1 select-text bg-[#05070D]"
        >
          {logs.length === 0 ? (
            <div className="text-[#475569] text-xs">
              [NEXUS CORE] ONLINE — System quiescent.
            </div>
          ) : (
            logs.map((entry) => {
              let tagColor = '#00E5FF';
              let msgColor = '#94A3B8';

              if (entry.level === 'error') {
                tagColor = '#FF3B5C';
                msgColor = '#FF8598';
              } else if (entry.level === 'warn') {
                tagColor = '#FBBF24';
                msgColor = '#FDE68A';
              } else if (entry.level === 'success') {
                tagColor = '#00D9A6';
                msgColor = '#E2E8F0';
              }

              return (
                <div key={entry.id} className="flex items-start gap-2 font-mono-tech">
                  <span className="text-[#475569] shrink-0 text-[10px]">
                    {entry.timestamp}
                  </span>
                  <span className="font-bold shrink-0" style={{ color: tagColor }}>
                    [{entry.tag}]
                  </span>
                  <span className="break-all" style={{ color: msgColor }}>
                    {entry.message}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
