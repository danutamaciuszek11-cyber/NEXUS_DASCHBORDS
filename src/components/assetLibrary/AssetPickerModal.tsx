import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Check, 
  Image as ImageIcon, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Plus, 
  FileCheck 
} from 'lucide-react';
import { AssetRegistryRecord, AssetCollection } from '../../types/assetLibrary';
import { authorAssetService } from '../../services/authorAssetService';
import { soundFx } from '../../utils/audioSystem';

interface AssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: AssetRegistryRecord) => void;
  title?: string;
  subtitle?: string;
  filterCategory?: 'ALL' | 'COVERS' | 'BOOKS' | 'CHARACTERS' | 'SOCIAL';
}

export const AssetPickerModal: React.FC<AssetPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset,
  title = 'Wybierz grafikę z biblioteki autora',
  subtitle = 'Wybierz istniejący asset bez duplikowania pliku na dysku',
  filterCategory = 'ALL'
}) => {
  const [assets, setAssets] = useState<AssetRegistryRecord[]>([]);
  const [collections, setCollections] = useState<AssetCollection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCol, setSelectedCol] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'COVERS' | 'BOOKS' | 'CHARACTERS' | 'SOCIAL'>(filterCategory);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    loadAssets();
  }, [isOpen, activeTab, selectedCol]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const [list, cols] = await Promise.all([
        authorAssetService.listAssets({
          category: activeTab,
          collectionId: selectedCol || undefined,
          status: 'ACTIVE'
        }),
        authorAssetService.listCollections()
      ]);
      setAssets(list);
      setCollections(cols);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredAssets = assets.filter(a => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.filename.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q)) ||
      a.semanticDescription?.toLowerCase().includes(q)
    );
  });

  const selectedAsset = assets.find(a => a.assetId === selectedAssetId);

  const handleConfirm = () => {
    if (selectedAsset) {
      soundFx.playClick();
      onSelectAsset(selectedAsset);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] font-sans">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-400 font-bold uppercase tracking-wider">
                  ASSET REGISTRY
                </span>
              </h2>
              <p className="text-xs text-white/50">{subtitle}</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls & Search */}
        <div className="p-4 border-b border-white/10 bg-slate-900/50 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj po nazwie, tagu lub opisie semantycznym..."
                className="w-full pl-9 pr-4 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>

            {/* Collection Select */}
            <select
              value={selectedCol || ''}
              onChange={(e) => setSelectedCol(e.target.value || null)}
              className="w-full sm:w-56 px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white/80 focus:outline-none focus:border-cyan-400 font-mono"
            >
              <option value="">Wszystkie kolekcje</option>
              {collections.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.assetIds.length})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Categories Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
            {(['ALL', 'COVERS', 'BOOKS', 'CHARACTERS', 'SOCIAL'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab);
                }}
                className={`px-3 py-1 rounded-lg uppercase transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-cyan-500 text-black font-bold shadow-sm' 
                    : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
                }`}
              >
                {tab === 'ALL' ? 'Wszystkie' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Assets Grid View */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/40 space-y-3 font-mono text-xs">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span>Ładowanie biblioteki assetów...</span>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/40 space-y-3 text-center">
              <ImageIcon className="w-12 h-12 text-white/20" />
              <p className="text-sm font-medium">Brak grafik spełniających kryteria.</p>
              <p className="text-xs text-white/30 max-w-sm">
                Dodaj nową grafikę w głównym panelu Biblioteki Grafik Autora.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredAssets.map(asset => {
                const isSelected = selectedAssetId === asset.assetId;

                return (
                  <div
                    key={asset.assetId}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedAssetId(asset.assetId);
                    }}
                    onDoubleClick={() => {
                      soundFx.playClick();
                      onSelectAsset(asset);
                      onClose();
                    }}
                    className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all flex flex-col bg-slate-900/60 ${
                      isSelected 
                        ? 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/20 scale-[1.02]' 
                        : 'border-white/10 hover:border-white/30 hover:bg-slate-900'
                    }`}
                  >
                    {/* Image Preview Box */}
                    <div className="aspect-[4/3] w-full bg-black/80 relative overflow-hidden flex items-center justify-center">
                      <img
                        src={asset.dataUrl}
                        alt={asset.filename}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Selected Checkmark Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 p-1 rounded-full bg-cyan-400 text-black shadow">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Dimensions Overlay */}
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] font-mono text-white/80">
                        {asset.width}×{asset.height}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1 font-mono">
                      <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors" title={asset.filename}>
                        {asset.filename}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-white/40">
                        <span>{Math.round(asset.sizeBytes / 1024)} KB</span>
                        <span className="text-cyan-400 font-bold uppercase">{asset.mimeType.split('/')[1]}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer / Confirmation */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/60 flex items-center justify-between">
          <div className="text-xs font-mono text-white/50 truncate max-w-sm">
            {selectedAsset ? (
              <span className="text-cyan-300 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">Wybrano: {selectedAsset.filename} ({selectedAsset.width}×{selectedAsset.height})</span>
              </span>
            ) : (
              <span>Kliknij grafikę, aby wybrać lub kliknij podwójnie, aby wstawić.</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="px-4 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 hover:text-white font-mono text-xs transition-colors"
            >
              Anuluj
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedAsset}
              className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:pointer-events-none text-black font-bold font-mono text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Wstaw Wybrany Asset</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
