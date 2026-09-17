import React, { useState } from 'react';
import { Globe, BookOpen, ShoppingBag, GraduationCap, Sparkles, Shield, Cpu, ExternalLink, ArrowLeft, Search, Layers, Terminal } from 'lucide-react';
import { eventBus } from '../core/event-bus';

interface NexusProductsViewProps {
  onBackToGateway: () => void;
  onSwitchToTools: () => void;
  onLaunchModule?: (productId: string) => void;
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
  repoUrl?: string;
  dependencies?: string[];
}

const PRODUCTS_CATALOG: ProductItem[] = [
  {
    id: 'nexus-social',
    name: 'Nexus Family Collective',
    category: 'COMMUNITY & NETWORK',
    description: 'Decentralizowana suwerenna sieć społecznościowa rodziny Bellas, szyfrowane kanały i synchronizacja węzłów.',
    icon: 'globe',
    badge: 'FAMILY',
    status: 'ONLINE',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS_FAMILI.git',
    dependencies: ['nexus-bella-os']
  },
  {
    id: 'nexus-book',
    name: 'NexusBook Ledger',
    category: 'CONTENT & KNOWLEDGE',
    description: 'Baza wiedzy, immutable neural ledger, dokumentacja architektoniczna i suwerenne archiwum.',
    icon: 'book',
    badge: 'CORE',
    status: 'ONLINE',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-ACADEMY-Knowledge-Transfer-Engine.git',
    dependencies: ['nexus-bella-os']
  },
  {
    id: 'nexus-media',
    name: 'Nexus Media & Cyber Radio',
    category: 'MEDIA & ASSETS',
    description: 'Studio dźwięku syntetycznego, studio transmisji live, cyber-radiostacja i generacja multimediów.',
    icon: 'sparkles',
    badge: 'MEDIA',
    status: 'ONLINE',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/-NEXUS-MEDIA-Studio-D-wi-ku-Syntetycznego-Transmisji-Cyber-Radiostacji.git',
    dependencies: ['nexus-bella-os']
  },
  {
    id: 'nexus-constitution-governance',
    name: 'Nexus Digital Constitution',
    category: 'DECENTRALIZATION',
    description: 'Suwerenna cyfrowa konstytucja, ekosystem ładu cyfrowego, prawo maszynowe i etyka agentów AI.',
    icon: 'shield',
    badge: 'CONSTITUTION',
    status: 'ONLINE',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/-NEXUS-SOVEREIGN-DIGITAL-CONSTITUTION-GOVERNANCE-ECOSYSTEM.git',
    dependencies: ['nexus-bella-os', 'nexusbook']
  },
  {
    id: 'nexus-academy',
    name: 'Nexus Academy Knowledge Engine',
    category: 'EDUCATION & SKILLS',
    description: 'Silnik transferu wiedzy, cybernetyczne ścieżki certyfikacji, uniwersytet systemowy i edukacja architektów.',
    icon: 'graduation-cap',
    badge: 'ACADEMY',
    status: 'ONLINE',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-ACADEMY-Knowledge-Transfer-Engine.git',
    dependencies: ['nexusbook', 'kaisa-online']
  },
  {
    id: 'nexus-rfc-02-gateway',
    name: 'Nexus RFC-02 Protocol Gateway',
    category: 'DECENTRALIZATION',
    description: 'Standard protokołu synchronizacji międzyprojektowej RFC-02, rozproszona magistrala danych i brama P2P.',
    icon: 'cpu',
    badge: 'PROTOCOL',
    status: 'ONLINE',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-RFC-02-Inter-Project-Synchronization-Protocol-Gateway.git',
    dependencies: ['nexus-bella-os', 'nexus-family', 'kaisa-online']
  },
  {
    id: 'nexus-revolution',
    name: 'Nexus Revolution Kernel & SQL',
    category: 'DECENTRALIZATION',
    description: 'Główny motor rewolucji suwerennościowej, rozproszony backend API, most neuronowy Gemini i łącznik Postgres Cloud SQL.',
    icon: 'cpu',
    badge: 'KERNEL',
    status: 'ONLINE',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-REVOLUTION.git',
    dependencies: ['nexus-bella-os', 'nexus-rfc-02-gateway']
  },
  {
    id: 'nexus-labs-rd',
    name: 'Nexus Labs Sovereign R&D',
    category: 'EXPERIMENT & LABS',
    description: 'Kolaboratywny organizm badawczo-rozwojowy (R&D), inkubator nowych technologii, eksperymenty kwantowe i AI.',
    icon: 'layers',
    badge: 'LABS',
    status: 'ONLINE',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-LABS-Sovereign-R-D-Engine-Collaborative-Organism.git',
    dependencies: ['nexus-dev-hub', 'kaisa-online', 'nexus-constitution-governance']
  },
  {
    id: 'nexus-dev-hub',
    name: 'Nexus Dev Hub (Kuźnia 9 Światów)',
    category: 'EDUCATION & SKILLS',
    description: 'Kuźnia Forge 9 Światów – środowisko inżynieryjne kompilacji, kompozytor graficzny XNL, piaskownice WASM.',
    icon: 'layers',
    badge: 'FORGE',
    status: 'ONLINE',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-DEV-HUB-Ekosystem-9-wiat-w-Ku-nia-Forge-.git',
    dependencies: ['nexus-bella-os', 'nexus-rfc-02-gateway']
  },
  {
    id: 'kaisa-online',
    name: 'KAISA Online Orchestrator',
    category: 'DECENTRALIZATION',
    description: 'KAISA Protocol ETERNIVERSE-DEV-CORE: Autonomiczny orkiestrator mikrousług, samonaprawiający się pipeline i zero-trust security fabric.',
    icon: 'cpu',
    badge: 'ORCHESTRATOR',
    status: 'ONLINE',
    repoUrl: 'https://github.com/danutamaciuszek11-cyber/NEXUS-REVOLUTION.git',
    dependencies: ['nexus-bella-os', 'nexus-rfc-02-gateway']
  }
];

export const NexusProductsView: React.FC<NexusProductsViewProps> = ({
  onBackToGateway = () => {},
  onSwitchToTools = () => {},
  onLaunchModule,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeCloudProduct, setActiveCloudProduct] = useState<ProductItem | null>(null);

  const categories = ['ALL', 'COMMUNITY & NETWORK', 'CONTENT & KNOWLEDGE', 'MEDIA & ASSETS', 'COMMERCE & FULFILLMENT', 'EDUCATION & SKILLS', 'DECENTRALIZATION'];

  const filteredProducts = PRODUCTS_CATALOG.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleLaunchProduct = (p: ProductItem) => {
    eventBus.emit('log', {
      tag: 'PRODUCTS',
      message: `INITIALIZING CLOUD SERVICE: [${p.name.toUpperCase()}]`,
      level: 'success',
    });
    if (onLaunchModule) {
      onLaunchModule(p.id);
    } else {
      setActiveCloudProduct(p);
    }
  };

  return (
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
              <p className="text-sm text-[#94A3B8] leading-relaxed mb-4 font-sans">
                {p.description}
              </p>

              {/* Dependencies Badges */}
              <div className="flex items-center gap-1.5 mb-5 flex-wrap">
                {p.dependencies && p.dependencies.length > 0 ? (
                  p.dependencies.map((dep) => (
                    <span
                      key={dep}
                      className="px-2 py-0.5 rounded bg-[#121827] border border-[#1E293B] text-[10px] font-mono-tech text-[#94A3B8]"
                      title={`Zależność: ${dep}`}
                    >
                      dep::{dep.replace('nexus-', '').replace('-os', '')}
                    </span>
                  ))
                ) : (
                  <span className="px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[10px] font-mono-tech text-[#00E5FF]">
                    ROOT_CORE
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#121827] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-mono-tech text-[#64748B] hidden sm:inline">
                  CLOUD INSTANCE
                </span>
                {p.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-1 rounded bg-[#1E293B]/60 hover:bg-[#1E293B] text-[#38BDF8] hover:text-white text-[10px] font-mono-tech flex items-center gap-1 transition-colors"
                    title="Otwórz oficjalne repozytorium GitHub"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>REPO</span>
                  </a>
                )}
              </div>
              <button
                onClick={() => handleLaunchProduct(p)}
                className="px-3.5 py-1.5 rounded-lg bg-[#A855F7]/15 hover:bg-[#A855F7] border border-[#A855F7]/50 hover:border-[#A855F7] text-[#A855F7] hover:text-white text-xs font-mono-tech tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
              >
                <span>URUCHOM</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cloud Instance Info Modal */}
      {activeCloudProduct && (
        <div className="fixed inset-0 z-50 bg-[#05070D]/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-mono-tech">
          <div className="w-full max-w-lg bg-[#090C16] border border-[#A855F7]/40 rounded-xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#121827]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7]" />
                <h3 className="text-white text-xs font-bold uppercase tracking-wider">
                  NEXUS CLOUD INSTANCE // {activeCloudProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveCloudProduct(null)}
                className="text-[#64748B] hover:text-white text-xs cursor-pointer px-1.5 py-0.5"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#0C101C] rounded-lg border border-[#121827]">
                <div className="text-[#A855F7] font-bold text-sm mb-1">{activeCloudProduct.name}</div>
                <div className="text-[#94A3B8] text-[11px] leading-relaxed">{activeCloudProduct.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-[#05070D] rounded border border-[#121827]">
                  <span className="text-[10px] text-[#64748B] block">STATUS INSTANCJI</span>
                  <span className="text-[#00D9A6] font-bold">ONLINE (HA CLUSTER)</span>
                </div>
                <div className="p-2.5 bg-[#05070D] rounded border border-[#121827]">
                  <span className="text-[10px] text-[#64748B] block">REGION CLOUD</span>
                  <span className="text-[#00E5FF] font-bold">eu-central-1 (Warsaw)</span>
                </div>
                <div className="p-2.5 bg-[#05070D] rounded border border-[#121827]">
                  <span className="text-[10px] text-[#64748B] block">PROTOCÓŁ</span>
                  <span className="text-white font-bold">gRPC / TLS 1.3 / P2P</span>
                </div>
                <div className="p-2.5 bg-[#05070D] rounded border border-[#121827]">
                  <span className="text-[10px] text-[#64748B] block">LATENCY</span>
                  <span className="text-[#00D9A6] font-bold">&lt; 8 ms</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    alert(`Nawiązano bezpieczne połączenie z instancją chmurową ${activeCloudProduct.name}.`);
                    setActiveCloudProduct(null);
                  }}
                  className="flex-1 py-2 rounded-lg bg-[#A855F7] text-white hover:bg-[#A855F7]/90 font-bold text-xs uppercase tracking-wider cursor-pointer transition-all"
                >
                  POŁĄCZ Z INSTANCJĄ
                </button>
                <button
                  onClick={() => setActiveCloudProduct(null)}
                  className="px-4 py-2 rounded-lg bg-[#0C101C] border border-[#121827] text-[#94A3B8] hover:text-white text-xs uppercase cursor-pointer"
                >
                  ZAMKNIJ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
