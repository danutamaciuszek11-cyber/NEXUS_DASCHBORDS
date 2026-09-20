import React from 'react';
import { 
  X, 
  Sliders, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Check, 
  Zap, 
  RotateCcw,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  GripVertical
} from 'lucide-react';
import { SeekerId, UserDashboardConfig, DashboardModuleItem } from '../types';
import { SEEKERS_CONFIG } from '../data/booksData';
import { DEFAULT_DASHBOARD_MODULES } from '../data/collectionsData';
import { soundFx } from '../utils/audioSystem';

interface CustomDashboardModalProps {
  config: UserDashboardConfig;
  onSaveConfig: (newConfig: UserDashboardConfig) => void;
  onClose: () => void;
}

export const CustomDashboardModal: React.FC<CustomDashboardModalProps> = ({
  config,
  onSaveConfig,
  onClose
}) => {
  const [localConfig, setLocalConfig] = React.useState<UserDashboardConfig>(() => ({
    ...config,
    dashboardModules: config.dashboardModules && config.dashboardModules.length > 0
      ? config.dashboardModules
      : DEFAULT_DASHBOARD_MODULES.map(m => ({ ...m }))
  }));

  const handleToggleSound = () => {
    soundFx.playClick();
    setLocalConfig(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleToggleParticles = () => {
    soundFx.playClick();
    setLocalConfig(prev => ({ ...prev, showParticles: !prev.showParticles }));
  };

  const handleToggleHaptics = () => {
    soundFx.playClick();
    setLocalConfig(prev => ({ ...prev, hapticsEnabled: !prev.hapticsEnabled }));
  };

  const handleSelectDefaultSeeker = (id: SeekerId | 'ALL') => {
    soundFx.playClick();
    setLocalConfig(prev => ({ ...prev, defaultSeekerFilter: id }));
  };

  const handleSelectAmbientMode = (mode: 'dark' | 'oled' | 'cinema' | 'light') => {
    soundFx.playClick();
    setLocalConfig(prev => ({ ...prev, ambientLightMode: mode }));
  };

  const handleToggleModule = (modId: string) => {
    soundFx.playClick();
    setLocalConfig(prev => {
      const current = prev.dashboardModules || DEFAULT_DASHBOARD_MODULES.map(m => ({ ...m }));
      const updated = current.map(m => m.id === modId ? { ...m, enabled: !m.enabled } : m);
      return { ...prev, dashboardModules: updated };
    });
  };

  const handleMoveModule = (fromIdx: number, toIdx: number) => {
    soundFx.playClick();
    setLocalConfig(prev => {
      const current = [...(prev.dashboardModules || DEFAULT_DASHBOARD_MODULES.map(m => ({ ...m })))];
      if (toIdx < 0 || toIdx >= current.length) return prev;
      const [moved] = current.splice(fromIdx, 1);
      current.splice(toIdx, 0, moved);
      return { ...prev, dashboardModules: current };
    });
  };

  const handleSave = () => {
    soundFx.playClick();
    onSaveConfig(localConfig);
    onClose();
  };

  const modulesList = localConfig.dashboardModules || DEFAULT_DASHBOARD_MODULES.map(m => ({ ...m }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-hidden animate-in fade-in duration-300">
      
      <div className="w-full max-w-2xl rounded-2xl bg-slate-950 border border-white/10 shadow-2xl overflow-hidden font-mono text-xs">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold">
            <Sliders className="w-4 h-4" />
            <span>KONFIGURACJA SEKCJI PULPITU I DŹWIĘKU</span>
          </div>
          <button
            onClick={() => {
              soundFx.playModalClose();
              onClose();
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs text-white/80 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Reorderable Dashboard Modules Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase text-purple-400 tracking-widest font-bold">
                DASHBOARD MODULES & REORDERING (DRAG / MOVE)
              </span>
              <span className="text-[10px] text-white/30">Włącz, wyłącz lub zmień kolejność sekcji</span>
            </div>

            <div className="space-y-2">
              {modulesList.map((mod, idx) => (
                <div
                  key={mod.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    mod.enabled
                      ? 'bg-white/5 border-white/10 hover:border-purple-500/40 text-white'
                      : 'bg-black/40 border-white/5 opacity-50 text-white/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <GripVertical className="w-4 h-4 text-white/30 cursor-grab shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-xs flex items-center gap-2">
                        <span>{mod.label}</span>
                        {mod.enabled ? (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-normal">
                            Aktywny
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950 border border-red-500/30 text-red-400 font-normal">
                            Ukryty
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-white/40 font-sans truncate">{mod.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Toggle Visibility */}
                    <button
                      type="button"
                      onClick={() => handleToggleModule(mod.id)}
                      className={`p-1.5 rounded border transition-colors ${
                        mod.enabled
                          ? 'bg-purple-950/60 border-purple-500/40 text-purple-300'
                          : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                      title={mod.enabled ? 'Ukryj na pulpicie' : 'Pokaż na pulpicie'}
                    >
                      {mod.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveModule(idx, idx - 1)}
                      className="p-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 disabled:opacity-20 disabled:pointer-events-none"
                      title="Przesuń wyżej"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={idx === modulesList.length - 1}
                      onClick={() => handleMoveModule(idx, idx + 1)}
                      className="p-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 disabled:opacity-20 disabled:pointer-events-none"
                      title="Przesuń niżej"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ambient Lighting Mode */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[10px] uppercase text-white/40 tracking-widest font-bold">
              OŚWIETLENIE OTOCZENIA & ADAPTACJA EKRANU
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['dark', 'oled', 'cinema', 'light'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleSelectAmbientMode(m)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 uppercase font-bold transition-all ${
                    localConfig.ambientLightMode === m
                      ? 'bg-blue-950 border-blue-500 text-blue-300 shadow-md'
                      : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  {m === 'light' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
                  <span>{m}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Audio & Haptic System Settings */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase text-white/40 tracking-widest font-bold">
              SYSTEM DŹWIĘKÓW & HAPTYKA
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleToggleSound}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  localConfig.soundEnabled
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  {localConfig.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>DŹWIĘKI</span>
                </div>
                {localConfig.soundEnabled && <Check className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleToggleHaptics}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  localConfig.hapticsEnabled
                    ? 'bg-purple-950 border-purple-500 text-purple-400'
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>HAPTYKA</span>
                </div>
                {localConfig.hapticsEnabled && <Check className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleToggleParticles}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  localConfig.showParticles
                    ? 'bg-amber-950 border-amber-500 text-amber-400'
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>CZĄSTECZKI</span>
                </div>
                {localConfig.showParticles && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Default Seeker Filter */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase text-white/40 tracking-widest font-bold">
              DOMYŚLNA BRAMA WIEDZY
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectDefaultSeeker('ALL')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  localConfig.defaultSeekerFilter === 'ALL'
                    ? 'bg-white/10 border-white text-white font-bold'
                    : 'bg-white/5 border-white/10 text-white/50'
                }`}
              >
                Wszystkie Bramy
              </button>
              {(Object.keys(SEEKERS_CONFIG) as SeekerId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSelectDefaultSeeker(id)}
                  className={`p-2.5 rounded-xl border text-left truncate transition-all ${
                    localConfig.defaultSeekerFilter === id
                      ? 'bg-white/10 border text-white font-bold'
                      : 'bg-white/5 border-white/10 text-white/50'
                  }`}
                  style={{
                    borderColor: localConfig.defaultSeekerFilter === id ? SEEKERS_CONFIG[id].color : undefined
                  }}
                >
                  {SEEKERS_CONFIG[id].name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setLocalConfig({
                defaultSeekerFilter: 'ALL',
                soundEnabled: true,
                ambientLightMode: 'dark',
                pinnedBookIds: [],
                quickShortcuts: [],
                showParticles: true,
                hapticsEnabled: true,
                dashboardModules: DEFAULT_DASHBOARD_MODULES.map(m => ({ ...m }))
              });
            }}
            className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET DOMYŚLNE</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg transition-transform active:scale-95"
          >
            ZAPISZ KONFIGURACJĘ
          </button>
        </div>

      </div>

    </div>
  );
};

