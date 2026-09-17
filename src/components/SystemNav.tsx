import React from 'react';

export interface NavItem {
  id: string;
  label: string;
  iconName: string;
  desc: string;
}

interface SystemNavProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
}

export const BELLA_NAV_ITEMS: NavItem[] = [
  { id: 'BELLA AI', label: 'BELLA AI', iconName: 'sparkles', desc: 'Autonomous Neural Agent' },
  { id: 'EXPERT PLIKÓW', label: 'EXPERT PLIKÓW', iconName: 'folder', desc: 'Sovereign File Manager' },
  { id: 'OCHRONA', label: 'OCHRONA', iconName: 'shield', desc: 'Cryptographic Security' },
  { id: 'PULPIT PC', label: 'PULPIT PC', iconName: 'layout', desc: 'Central Operating Modules' },
  { id: 'GŁOS', label: 'GŁOS', iconName: 'mic', desc: 'Audio Synthesis & Voice' },
  { id: 'NEXUS ROOT', label: 'NEXUS ROOT', iconName: 'cpu', desc: 'Low-Level Kernel Control' },
  { id: 'TOŻSAMOŚĆ', label: 'TOŻSAMOŚĆ', iconName: 'user', desc: 'Identity & Sovereign Keys' },
  { id: 'SUWEREN', label: 'SUWEREN', iconName: 'zap', desc: 'Decentralized Sovereign Mesh' },
];

export const SystemNav: React.FC<SystemNavProps> = ({ activeSection, onSelectSection = (_: any) => {} }) => {
  return (
    <footer
      id="nexus-bottom-nav"
      className="sticky bottom-0 z-30 w-full bg-[#070A12]/95 backdrop-blur-md border-t border-[#121827] px-3 py-2 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        {BELLA_NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`flex-1 min-w-[105px] py-2 px-2.5 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer border relative ${
                isActive
                  ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-white shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                  : 'bg-[#0A0E1A]/60 border-transparent hover:border-white/10 text-[#64748B] hover:text-[#94A3B8]'
              }`}
            >
              {/* Active glow pip */}
              {isActive && (
                <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
              )}
              <span
                className={`text-[11px] font-mono-tech tracking-wider uppercase font-semibold truncate w-full ${
                  isActive ? 'text-[#00E5FF]' : ''
                }`}
              >
                {item.label}
              </span>
              <span className="text-[9px] text-[#475569] truncate w-full font-mono-tech mt-0.5">
                {item.desc}
              </span>
            </button>
          );
        })}
      </div>
    </footer>
  );
};
