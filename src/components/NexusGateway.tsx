import React from 'react';
import { motion } from 'motion/react';
import { Zap, ArrowRight, Sparkles, Globe, Cpu, Shield, Box, Compass } from 'lucide-react';

interface NexusGatewayProps {
  onSelectUser: () => void;
  onSelectCreator: () => void;
  onSelectFamily: () => void;
}

export const NexusGateway: React.FC<NexusGatewayProps> = ({
  onSelectUser = () => {},
  onSelectCreator = () => {},
  onSelectFamily = () => {},
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
    >
      {/* Background Cyberpunk Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#A855F7]/5 rounded-full blur-3xl pointer-events-none" />

      {/* NEXUS CORE Central Topology Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center max-w-3xl mx-auto mb-10 z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-xs font-mono-tech mb-4 tracking-widest uppercase shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <Zap className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
          <span>NEXUS CORE ACTIVE // JEDEN RDZEŃ. TRZY BRAMY. JEDEN NEXUS.</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-wider mb-3 uppercase font-sans">
          WITAJ W <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-white to-[#A855F7]">NEXUS</span>
        </h2>

        <p className="text-base md:text-lg text-[#94A3B8] font-mono-tech mb-2">
          „Jeden rdzeń. Trzy drogi. Jeden ekosystem.”
        </p>

        <div className="text-xs font-mono-tech text-[#00E5FF] tracking-widest uppercase">
          JAK CHCESZ KORZYSTAĆ Z NEXUSA?
        </div>
      </motion.div>

      {/* Three Grand Portals / Gates Layout */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch relative z-10 my-4"
      >
        
        {/* BRAMA 01 — NEXUS USER */}
        <motion.div
          whileHover={{ scale: 1.02, boxShadow: '0 0 45px rgba(0, 229, 255, 0.45)', borderColor: 'rgba(0, 229, 255, 0.9)' }}
          transition={{ duration: 0.3 }}
          className="bg-[#090C16]/90 border border-[#00E5FF]/30 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-[0_0_30px_rgba(0,229,255,0.08)] group relative overflow-hidden cursor-pointer"
          onClick={onSelectUser}
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#00E5FF]/5 rounded-bl-full pointer-events-none group-hover:bg-[#00E5FF]/20 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.25)] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] transition-all text-2xl">
                👤
              </div>
              <span className="px-2.5 py-1 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-mono-tech tracking-wider uppercase">
                BRAMA 01
              </span>
            </div>

            <div className="text-[11px] font-mono-tech text-[#00E5FF] tracking-widest uppercase mb-1">
              // KORZYSTAM
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide mb-2 group-hover:text-[#00E5FF] transition-colors">
              NEXUS USER
            </h3>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-6 font-sans">
              „Gotowy ekosystem dla użytkowników.”
            </p>

            <div className="space-y-2 mb-8 text-xs font-mono-tech text-[#CBD5E1]">
              <div className="flex items-center gap-2 bg-[#0C101C] p-2.5 rounded-lg border border-[#1A2234]">
                <Globe className="w-4 h-4 text-[#00E5FF]" />
                <span>NexusSocial & Book & Media</span>
              </div>
              <div className="flex items-center gap-2 bg-[#0C101C] p-2.5 rounded-lg border border-[#1A2234]">
                <Compass className="w-4 h-4 text-[#00D9A6]" />
                <span>NexusShop & Academy & Garden</span>
              </div>
              <div className="text-[11px] text-[#64748B] pt-1">
                Społeczność, media, treści i podstawowe integracje w chmurze.
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#121827]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onSelectUser}
              className="w-full py-3.5 px-6 rounded-xl bg-[#00E5FF] hover:bg-[#00c2d6] text-[#05070D] font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_35px_rgba(0,229,255,0.7)]"
            >
              <span>WEJDŹ DO NEXUS</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-[#64748B] font-mono-tech text-center mt-2 leading-tight">
              Nie musisz nic budować. Po prostu korzystaj.
            </p>
          </div>
        </motion.div>

        {/* BRAMA 02 — NEXUS CREATOR */}
        <motion.div
          whileHover={{ scale: 1.02, boxShadow: '0 0 45px rgba(0, 217, 166, 0.45)', borderColor: 'rgba(0, 217, 166, 0.9)' }}
          transition={{ duration: 0.3 }}
          className="bg-[#090C16]/90 border border-[#00D9A6]/30 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-[0_0_30px_rgba(0,217,166,0.08)] group relative overflow-hidden cursor-pointer"
          onClick={onSelectCreator}
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#00D9A6]/5 rounded-bl-full pointer-events-none group-hover:bg-[#00D9A6]/20 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#00D9A6]/10 border border-[#00D9A6]/40 flex items-center justify-center text-[#00D9A6] shadow-[0_0_20px_rgba(0,217,166,0.25)] group-hover:shadow-[0_0_30px_rgba(0,217,166,0.6)] transition-all text-2xl">
                🛠️
              </div>
              <span className="px-2.5 py-1 rounded bg-[#00D9A6]/10 border border-[#00D9A6]/30 text-[#00D9A6] text-[10px] font-mono-tech tracking-wider uppercase">
                BRAMA 02
              </span>
            </div>

            <div className="text-[11px] font-mono-tech text-[#00D9A6] tracking-widest uppercase mb-1">
              // TWORZĘ
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide mb-2 group-hover:text-[#00D9A6] transition-colors">
              NEXUS CREATOR
            </h3>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-6 font-sans">
              „Lekkie narzędzia do tworzenia własnych projektów.”
            </p>

            <div className="space-y-2 mb-8 text-xs font-mono-tech text-[#CBD5E1]">
              <div className="flex items-center gap-2 bg-[#0C101C] p-2.5 rounded-lg border border-[#1A2234]">
                <Cpu className="w-4 h-4 text-[#00D9A6]" />
                <span>Creator Studio & Lokalny NODE</span>
              </div>
              <div className="flex items-center gap-2 bg-[#0C101C] p-2.5 rounded-lg border border-[#1A2234]">
                <Box className="w-4 h-4 text-[#00E5FF]" />
                <span>Moduły ZIP & Automatyzacja</span>
              </div>
              <div className="text-[11px] text-[#64748B] pt-1">
                Media, grafika, tekst, audio, video i modularne workspace'y.
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#121827]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onSelectCreator}
              className="w-full py-3.5 px-6 rounded-xl bg-[#00D9A6] hover:bg-[#00bf91] text-[#05070D] font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,217,166,0.3)] hover:shadow-[0_0_35px_rgba(0,217,166,0.7)]"
            >
              <span>URUCHOM CREATOR</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-[#64748B] font-mono-tech text-center mt-2 leading-tight">
              Wykorzystaj lokalny NEXUS NODE do operacji offline.
            </p>
          </div>
        </motion.div>

        {/* BRAMA 03 — NEXUS FAMILY */}
        <motion.div
          whileHover={{ scale: 1.02, boxShadow: '0 0 45px rgba(168, 85, 247, 0.45)', borderColor: 'rgba(168, 85, 247, 0.9)' }}
          transition={{ duration: 0.3 }}
          className="bg-[#090C16]/90 border border-[#A855F7]/30 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-[0_0_30px_rgba(168,85,247,0.08)] group relative overflow-hidden cursor-pointer"
          onClick={onSelectFamily}
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#A855F7]/5 rounded-bl-full pointer-events-none group-hover:bg-[#A855F7]/20 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#A855F7]/10 border border-[#A855F7]/40 flex items-center justify-center text-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.25)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all text-2xl">
                🏛️
              </div>
              <span className="px-2.5 py-1 rounded bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-[10px] font-mono-tech tracking-wider uppercase">
                BRAMA 03
              </span>
            </div>

            <div className="text-[11px] font-mono-tech text-[#A855F7] tracking-widest uppercase mb-1">
              // WSPÓŁTWORZĘ
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide mb-2 group-hover:text-[#A855F7] transition-colors">
              NEXUS FAMILY
            </h3>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-6 font-sans">
              „Przestrzeń dla architektów i współtwórców NEXUSA.”
            </p>

            <div className="space-y-2 mb-8 text-xs font-mono-tech text-[#CBD5E1]">
              <div className="flex items-center gap-2 bg-[#0C101C] p-2.5 rounded-lg border border-[#1A2234]">
                <Shield className="w-4 h-4 text-[#A855F7]" />
                <span>NEXUS CORE & Bella OS</span>
              </div>
              <div className="flex items-center gap-2 bg-[#0C101C] p-2.5 rounded-lg border border-[#1A2234]">
                <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                <span>Protokoły, Bridge & Governance</span>
              </div>
              <div className="text-[11px] text-[#64748B] pt-1">
                Rozwój architektury, infrastruktury i bezpieczeństwa systemu.
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#121827]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onSelectFamily}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#7928CA] hover:opacity-95 text-white font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)]"
            >
              <span>WEJDŹ DO FAMILY</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-[#64748B] font-mono-tech text-center mt-2 leading-tight">
              Współtwórz fundamenty całego ekosystemu.
            </p>
          </div>
        </motion.div>

      </motion.div>

      {/* Footer Closing Slogan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 text-center z-10"
      >
        <div className="inline-block px-6 py-2.5 rounded-xl bg-[#090C16] border border-[#1A2234] text-xs font-mono-tech text-[#00E5FF] tracking-[0.25em] uppercase shadow-lg">
          „ONE CORE. THREE PATHS. ONE NEXUS.”
        </div>
      </motion.div>
    </motion.div>
  );
};
