import React, { useState } from 'react';
import { Globe, BookOpen, ShoppingBag, GraduationCap, Sparkles, Shield, Cpu, ExternalLink, ArrowLeft, Search, Layers, Terminal } from 'lucide-react';
import { eventBus } from '../core/event-bus';
import NexusBookApp from '../nexusbook/NexusBookApp';

interface NexusProductsViewProps {
  onBackToGateway: () => void;
  onSwitchToTools: () => void;
}

interface ProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  badge: string;
  status: 'ONLINE' | 'BETA' | 'DEPLOYING';
  url?: string;
}

const PRODUCTS_CATALOG: ProductItem[] = [
  {
    id: 'nexus-social',
    name: 'NexusSocial',
    category: 'COMMUNITY & NETWORK',
    description: 'Decentralizowana sieć społecznościowa z szyfrowanymi kanałami i feedem agentów AI.',
    icon: 'globe',
    badge: 'POPULAR',
    status: 'ONLINE'
  },
  {
    id: 'nexus-book',
    name: 'NexusBook',
    category: 'CONTENT & KNOWLEDGE',
    description: 'Baza wiedzy, dokumentacja architektoniczna i interaktywne notatki całego ekosystemu.',
    icon: 'book',
    badge: 'CORE',
    status: 'ONLINE'
  },
  {
    id: 'nexus-media',
    name: 'Nexus Media',
    category: 'MEDIA & ASSETS',
    description: 'Generator grafik, audio, wideo i zasobów cyfrowych napędzany przez NEXUS AI.',
    icon: 'sparkles',
    badge: 'AI',
    status: 'ONLINE'
  },
  {
    id: 'nexus-shop',
    name: 'NexusShop',
    category: 'COMMERCE & FULFILLMENT',
    description: 'Sklep z produktami fizycznymi i cyfrowymi, integracja z NEXUSBrandVision i fulfillmentem.',
    icon: 'shopping-bag',
    badge: 'STORE',
    status: 'ONLINE'
  },
  {
    id: 'nexus-academy',
    name: 'Nexus Academy',
    category: 'EDUCATION & SKILLS',
    description: 'Interaktywne kursy programowania, architektury systemów i zarządzania agentami AI.',
    icon: 'graduation-cap',
    badge: 'LEARN',
    status: 'ONLINE'
  },
  {
    id: 'nexus-garden',
    name: 'Nexus Garden',
    category: 'EXPERIMENT & LABS',
    description: 'Piaskownica eksperymentalnych modułów, symulacji sieciowych i interaktywnych canvasów.',
    icon: 'layers',
    badge: 'LABS',
    status: 'BETA'
  },
  {
    id: 'nexus-web3',
    name: 'Web3 / Blockchain',
    category: 'DECENTRALIZATION',
    description: 'Zarządzanie portfelem, smart kontraktami, tokenomiką i węzłami suwerennymi.',
    icon: 'shield',
    badge: 'SECURE',
    status: 'ONLINE'
  },
  {
    id: 'nexus-bridge',
    name: 'Nexus Bridge',
    category: 'INTEGRATION & API',
    description: 'Uniwersalna brama API łącząca zewnętrzne usługi, webhooki i aplikacje zewnętrze.',
    icon: 'cpu',
    badge: 'GATEWAY',
    status: 'ONLINE'
  }
];

export const NexusProductsView: React.FC<NexusProductsViewProps> = ({
  onBackToGateway = () => {},
  onSwitchToTools = () => {},
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'COMMUNITY & NETWORK', 'CONTENT & KNOWLEDGE', 'MEDIA & ASSETS', 'COMMERCE & FULFILLMENT', 'EDUCATION & SKILLS', 'DECENTRALIZATION'];

  const filteredProducts = PRODUCTS_CATALOG.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  const handleLaunchProduct = (p: ProductItem) => {
    if (p.id === 'nexus-book') {
      setActiveApp('nexus-book');
      return;
    }
    eventBus.emit('log', {
      tag: 'PRODUCTS',
      message: `INITIALIZING CLOUD SERVICE: [${p.name.toUpperCase()}]`,
      level: 'success',
    });
    setActiveNotice(`Usługa [${p.name}] aktywna w chmurze NEXUS CLOUD.`);
    setTimeout(() => {
      setActiveNotice(null);
    }, 4000);
  };

  return (
    <>
      {activeApp === 'nexus-book' ? (
        <div className="w-full h-screen overflow-hidden bg-black fixed inset-0 z-50">
          <button
            onClick={() => setActiveApp(null)}
            className="absolute top-4 left-4 z-[60] flex items-center justify-center p-2 rounded-full bg-[#090b14]/80 border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF]/20 hover:text-white backdrop-blur shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all group cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="w-full h-full overflow-y-auto">
            <NexusBookApp />
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-6 w-full flex flex-col gap-6">
      {/* Top Navigation / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#121827]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToGateway}
            className="px-3 py-1.5 rounded-lg bg-[#090C16] hover:bg-[#121827] border border-[#A855F7]/30 text-[#A855F7] text-xs font-mono-tech flex items-center gap-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>POWRÓT DO GATEWAY</span>
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider uppercase font-sans flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#A855F7]" />
              <span>NEXUS PRODUCTS</span>
            </h2>
            <p className="text-xs font-mono-tech text-[#94A3B8]">
              Gotowe produkty, usługi i integracje ekosystemu NEXUS CLOUD
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSwitchToTools}
            className="px-3.5 py-1.5 rounded-lg bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-mono-tech tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>PRZEJDŹ DO NEXUS TOOLS</span>
          </button>
        </div>
      </div>

      {activeNotice && (
        <div className="bg-[#A855F7]/15 border border-[#A855F7]/50 rounded-xl px-4 py-2.5 text-xs font-mono-tech text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D9A6] animate-pulse" />
            {activeNotice}
          </span>
          <button onClick={() => setActiveNotice(null)} className="text-[#94A3B8] hover:text-white text-xs cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#090C16] border border-[#A855F7]/20 p-4 rounded-xl">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            placeholder="Szukaj produktów i usług..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#05070D] border border-[#1A2234] focus:border-[#A855F7] rounded-lg pl-9 pr-4 py-2 text-xs font-mono-tech text-white focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono-tech uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#A855F7] text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'bg-[#05070D] hover:bg-[#121827] text-[#94A3B8] border border-[#1A2234]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-[#090C16] border border-[#A855F7]/20 hover:border-[#A855F7]/60 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 group hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#A855F7]/5 rounded-bl-full pointer-events-none group-hover:bg-[#A855F7]/10 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-0.5 rounded bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-[10px] font-mono-tech uppercase">
                  {p.badge}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono-tech text-[#00D9A6]">
                  <span className="status-dot active bg-[#00D9A6]" />
                  {p.status}
                </span>
              </div>

              <div className="text-[10px] font-mono-tech text-[#64748B] tracking-wider uppercase mb-1">
                // {p.category}
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide mb-2 group-hover:text-[#A855F7] transition-colors">
                {p.name}
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed mb-6 font-sans">
                {p.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#121827] flex items-center justify-between">
              <span className="text-[11px] font-mono-tech text-[#64748B]">
                CLOUD INSTANCE
              </span>
              <button
                onClick={() => handleLaunchProduct(p)}
                className="px-3.5 py-1.5 rounded-lg bg-[#A855F7]/15 hover:bg-[#A855F7] border border-[#A855F7]/50 hover:border-[#A855F7] text-[#A855F7] hover:text-white text-xs font-mono-tech tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>URUCHOM</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
      )}
    </>
  );
};
