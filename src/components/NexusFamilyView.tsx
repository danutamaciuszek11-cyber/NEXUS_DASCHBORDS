import React from 'react';
import { ArrowLeft, GitBranch } from 'lucide-react';
import { NexusFamilyPortal } from '../family/App';

interface NexusFamilyViewProps {
  onBackToGateway: () => void;
  onSwitchToCreator: () => void;
  onSwitchToUser: () => void;
}

export const NexusFamilyView: React.FC<NexusFamilyViewProps> = ({
  onBackToGateway = () => {},
  onSwitchToCreator = () => {},
  onSwitchToUser = () => {},
}) => {
  return (
    <div className="w-full min-h-screen bg-[#06080e] flex flex-col relative text-white">
      {/* Topmost Gateway Navigation Strip */}
      <div className="w-full bg-[#080B12]/95 border-b border-[#A855F7]/30 px-3 sm:px-6 py-2 flex items-center justify-between text-xs font-mono-tech z-50 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToGateway}
            className="px-3 py-1 rounded-lg bg-[#121827] hover:bg-[#1A2234] border border-[#A855F7]/40 text-[#A855F7] hover:text-white flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_10px_rgba(168,85,247,0.15)]"
            title="Powrót do 3 Bram Nexus Gateway"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-bold">POWRÓT DO GATEWAY</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7] animate-pulse" />
            <span className="text-white font-bold tracking-wider font-sans uppercase">
              BRAMA 03: RODZINA NEXUS
            </span>
            <span className="text-[#64748B] hidden md:inline">|</span>
            <a
              href="https://github.com/danutamaciuszek11-cyber/NEXUS_FAMILI.git"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1 text-[#A855F7] hover:text-white transition-colors"
            >
              <GitBranch className="w-3 h-3" />
              <span>NEXUS_FAMILI.git ↗</span>
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchToUser}
            className="px-2.5 py-1 rounded bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 text-[#00E5FF] text-[11px] transition-colors cursor-pointer"
            title="Przejdź do Bramy 01 (Użytkownik)"
          >
            BRAMA 01 (USER)
          </button>
          <button
            onClick={onSwitchToCreator}
            className="px-2.5 py-1 rounded bg-[#00D9A6]/10 hover:bg-[#00D9A6]/20 border border-[#00D9A6]/30 text-[#00D9A6] text-[11px] transition-colors cursor-pointer"
            title="Przejdź do Bramy 02 (Twórca)"
          >
            BRAMA 02 (CREATOR)
          </button>
        </div>
      </div>

      {/* DIRECT FULL NEXUS_FAMILI SYSTEM */}
      <div className="flex-1 w-full">
        <NexusFamilyPortal />
      </div>
    </div>
  );
};

export default NexusFamilyView;
