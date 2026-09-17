import React from 'react';
import { Shield, Sparkles, Box, Users, Wrench, Flame, X } from 'lucide-react';

interface NexusAboutModalProps {
  onClose: () => void;
}

export const NexusAboutModal: React.FC<NexusAboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#05070D]/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-mono-tech">
      <div className="w-full max-w-3xl bg-[#090C16] border border-[#A855F7]/40 rounded-xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#121827]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#A855F7] shadow-[0_0_10px_#A855F7]" />
            <div>
              <h3 className="text-white text-sm font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#A855F7]" />
                NEXUS ECOSYSTEM ARCHITECTURE MANIFEST
              </h3>
              <p className="text-[11px] text-[#64748B]">ONE CORE • THREE PATHS • ONE NEXUS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#121827] border border-[#1A2234] flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#FF3B5C]/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-[#94A3B8] leading-relaxed">
          <div className="p-4 bg-[#0C101C] rounded-lg border border-[#121827]">
            <span className="text-[#00E5FF] font-bold text-sm block mb-1 uppercase tracking-wider">
              FILOZOFIA TRZECH ŚCIEŻEK (3 PILLARS)
            </span>
            <p>
              Architektura NEXUS dzieli ekosystem na trzy suwerenne warstwy, zapewniając idealny balans pomiędzy współdzieloną chmurą a absolutną prywatnością danych lokalnych:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Pillar 1 */}
            <div className="p-3.5 bg-[#0C101C] rounded-lg border border-[#A855F7]/30 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#A855F7] font-bold uppercase">
                <Users className="w-4 h-4" />
                <span>1. SPOŁECZNOŚĆ</span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Nexus Family & NexusSocial. Bezpieczna komunikacja, tożsamości suwerenne, współdzielona pamięć rodziny i zaufanych węzłów sieciowych.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-3.5 bg-[#0C101C] rounded-lg border border-[#00E5FF]/30 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#00E5FF] font-bold uppercase">
                <Wrench className="w-4 h-4" />
                <span>2. NARZĘDZIA</span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                NEXUS Products & Cloud Services (NexusBook, Media Forge, KAISA Online). Gotowe usługi operacyjne, baza wiedzy i generatywne silniki AI.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-3.5 bg-[#0C101C] rounded-lg border border-[#00D9A6]/30 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#00D9A6] font-bold uppercase">
                <Box className="w-4 h-4" />
                <span>3. ARCHITEKCI</span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Strefa Twórców i Przyszłych Architektów. Bezpośredni zrzut pakietów ZIP, wchłanianie warstw w locie, izolowany sandbox IndexedDB bez wycieku do chmury.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#0C101C] rounded-lg border border-[#121827] space-y-2">
            <span className="text-[#00D9A6] font-bold text-xs uppercase block">
              // GWARANCJA SUWERENNOŚCI DANYCH (DUAL-TIER STORAGE)
            </span>
            <p className="text-[11px]">
              - <strong className="text-white">Cloud Tier:</strong> Produkty globalne i tożsamości synchronizują się z PostgreSQL Cloud SQL oraz Firestore.<br />
              - <strong className="text-white">Local Tier:</strong> Pakiety ZIP, moduły robocze i prywatne projekty użytkownika w strefie CREATOR pozostają w 100% lokalnie w IndexedDB na urządzeniu użytkownika.
            </p>
          </div>

          <div className="text-[10px] text-[#64748B] flex items-center justify-between pt-2 border-t border-[#121827]">
            <span>ARCHITECT: MACIEJ / ETERION</span>
            <span>ENGINE: NEXUS BELLA CORE v4.2</span>
          </div>
        </div>
      </div>
    </div>
  );
};
