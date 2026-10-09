import React, { useState } from 'react';
import { 
  ShieldAlert, 
  X, 
  Lock, 
  CheckCircle2, 
  Key, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  Search,
  SlidersHorizontal,
  Check,
  XCircle,
  Cpu,
  Radio,
  Video,
  FileText,
  Database,
  Layers,
  UserCheck,
  Info
} from 'lucide-react';
import { 
  PREDEFINED_BELLAS_ROLES, 
  BellasRoleId, 
  getRoleDefinition,
  NexusPermission,
  BellasRoleDefinition
} from '../data/bellasRoles';
import { soundFx } from '../utils/audioSystem';
import { nexusBus } from '../nexus/core/nexus-bus';

interface RolePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredPermission?: string;
  requiredRoleName?: string;
  actionTitle?: string;
  actionDescription?: string;
  currentRole?: string | null;
  onSwitchRole: (newRole: BellasRoleId) => void;
  onOpenLogin: () => void;
}

interface PermissionGroup {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  primaryRole: string;
  permissions: {
    key: NexusPermission;
    label: string;
    description: string;
  }[];
}

const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: 'architect_core',
    title: 'Konfiguracja Rdzenia & Moduły (Architect Scope)',
    description: 'Uprawnienia zarządcze do konfiguracji rdzenia systemu, modułów, bazy danych i ustawień globalnych.',
    icon: <Cpu className="w-4 h-4 text-cyan-400" />,
    color: '#00f0ff',
    primaryRole: 'Architect',
    permissions: [
      { key: 'admin:all', label: 'Pełny Dostęp Administracyjny (Admin:All)', description: 'Nieboczny dostęp do wszystkich podsystemów Nexusa.' },
      { key: 'config:manage', label: 'Zarządzanie Konfiguracją Rdzenia', description: 'Edycja kluczowych parametrów systemowych i protokołów.' },
      { key: 'modules:manage', label: 'Zarządzanie Modułami Systemu', description: 'Instalacja, aktywacja i konfiguracja modułów aplikacyjnych.' },
      { key: 'nodes:manage', label: 'Zarządzanie Węzłami & Bazą', description: 'Uprawnienia do rekonfiguracji węzłów Firestore / BNB.' }
    ]
  },
  {
    id: 'engineer_bus',
    title: 'Magistrala Zdarzeń & Wydajność (Engineer Scope)',
    description: 'Nadzór nad Event Busem (NexusBus), telemetrią sieciową, diagnostyką wydajnościową i logami.',
    icon: <Radio className="w-4 h-4 text-purple-400" />,
    color: '#a855f7',
    primaryRole: 'Engineer',
    permissions: [
      { key: 'eventbus:manage', label: 'Zarządzanie Event Busem (NexusBus)', description: 'Nadzór nad magistralą komunikatów, filtrowanie i priorytety.' },
      { key: 'eventbus:broadcast', label: 'Nadawanie na Magistrali Zdarzeń', description: 'Rozgłaszanie zdarzeń systemowych do aktywnych mikro-węzłów.' },
      { key: 'nodes:performance', label: 'Monit Wydajności & Latencji Węzłów', description: 'Dostęp do diagnostyki klatek, buforów i czasu reakcji.' },
      { key: 'nodes:diagnostics', label: 'Diagnostyka Węzłów & Recharts', description: 'Podgląd grafów bloków i telemetrii operacyjnej.' },
      { key: 'telemetry:view', label: 'Dostęp do Logów & Telemetrii', description: 'Odczyt dziennika zdarzeń i błędów w czasie rzeczywistym.' },
      { key: 'light:theme', label: 'Silnik Światła & Motywów CSS', description: 'Modyfikacja parametrów renderowania i barw próżni.' }
    ]
  },
  {
    id: 'curator_content',
    title: 'Kino & Scribe Kancelaria (Curator Scope)',
    description: 'Moduły narracyjne, Projekcja Kino Canvas 60 FPS, Scribe Kancelaria Dekretów i Publikacje.',
    icon: <Video className="w-4 h-4 text-emerald-400" />,
    color: '#10b981',
    primaryRole: 'Curator',
    permissions: [
      { key: 'kino:curate', label: 'Kuratela Projekcji Kino Canvas', description: 'Sterowanie strumieniem audiowizualnym i światami w Kinie.' },
      { key: 'kino:playback', label: 'Odtwarzanie Mediów Kino', description: 'Uruchamianie projekcji i ścieżek dźwiękowych.' },
      { key: 'scribe:write', label: 'Tworzenie Wpisów w Scribe', description: 'Sporządzanie notatek, manifestów i szkiców w Kancelarii.' },
      { key: 'scribe:decree', label: 'Wydawanie Dekretów Scribe', description: 'Publikacja wiążących dekretów w archiwum systemowym.' },
      { key: 'editorial:publish', label: 'Publikacja Dzieł Redakcyjnych', description: 'Wypuszczanie opublikowanych wydań książek i manifestów.' },
      { key: 'media:manage', label: 'Zarządzanie Zasobami Mediów', description: 'Zarządzanie grafikami, okładkami i biblioteką assetów.' }
    ]
  },
  {
    id: 'security_sentinel',
    title: 'Skarbiec & Bezpieczeństwo AEGIS (Sentinel Scope)',
    description: 'Skarbiec kryptograficzny, certyfikaty, autoryzacja oraz audyty bezpieczeństwa.',
    icon: <ShieldCheck className="w-4 h-4 text-amber-400" />,
    color: '#f59e0b',
    primaryRole: 'Sentinel',
    permissions: [
      { key: 'vault:unlock', label: 'Odblokowanie Skarbca AEGIS', description: 'Dostęp do zakodowanych kluczy i certyfikatów.' },
      { key: 'security:audit', label: 'Audyt Uprawnień & Dziennik Bezpieczeństwa', description: 'Przegląd rejestru wywołań chronionych i naruszeń.' },
      { key: 'bnb:dock', label: 'Dokowanie Węzła BNB Chain', description: 'Inicjalizacja i przełączanie statusu splątania bloków.' },
      { key: 'manifesto:edit', label: 'Edycja Manifestu Suwerenności', description: 'Modyfikacja zasad i suwerennych wytycznych nadrzędnych.' }
    ]
  }
];

export const RolePermissionModal: React.FC<RolePermissionModalProps> = ({
  isOpen,
  onClose,
  requiredPermission,
  requiredRoleName,
  actionTitle = 'Dostęp Chroniony Modułu',
  actionDescription = 'Wymagane odpowiednie uprawnienia RBAC do wykonania tej operacji.',
  currentRole,
  onSwitchRole,
  onOpenLogin
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'matrix' | 'modules'>('roster');
  const [searchTerm, setSearchTerm] = useState('');
  const [customPermissions, setCustomPermissions] = useState<Record<string, NexusPermission[]>>({});

  if (!isOpen) return null;

  const currentRoleDef = getRoleDefinition(currentRole);

  const handleRoleSelect = (roleId: BellasRoleId) => {
    soundFx.playSuccess();
    onSwitchRole(roleId);
    nexusBus.emit('AUTH', 'ROLE_CHANGED', { newRole: roleId, timestamp: Date.now() });
    onClose();
  };

  const primaryRolesList: BellasRoleId[] = ['architect', 'engineer', 'curator', 'sentinel', 'guest'];
  const bellasRosterList: BellasRoleId[] = ['marco', 'elena', 'leo', 'sofia'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#080d1a] border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/50 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Glow Top Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-purple-950/40 border-b border-cyan-500/30">
          <button
            onClick={() => {
              soundFx.playModalClose();
              onClose();
            }}
            className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl shrink-0 shadow-lg"
                style={{
                  backgroundColor: `${currentRoleDef.color}15`,
                  borderColor: `${currentRoleDef.color}50`,
                  boxShadow: `0 0 20px ${currentRoleDef.color}20`
                }}
              >
                {currentRoleDef.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    NEXUS RBAC SECURITY ENGINE
                  </span>
                  <span className="text-xs font-mono text-stone-400 hidden sm:inline">ROLES & PERMISSIONS</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1 flex items-center gap-2">
                  <span>Zarządzanie Rolami i Uprawnieniami</span>
                </h2>
              </div>
            </div>

            {/* Current Active Role Badge */}
            <div className="px-3 py-1.5 rounded-2xl bg-black/60 border border-cyan-500/30 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <div>
                <div className="text-[9px] font-mono uppercase text-stone-400">Aktywny Profil</div>
                <div className="text-xs font-bold text-cyan-300 font-mono">{currentRoleDef.name}</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/10 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('roster');
              }}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'roster'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/10'
                  : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Wybór Roli Systemowych</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('matrix');
              }}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'matrix'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/10'
                  : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Macierz Uprawnień (Matrix)</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('modules');
              }}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'modules'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/10'
                  : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dostęp do Modułów</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Permission Restriction Intercept Warning (if triggered by guard) */}
          {requiredPermission && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-stone-300 leading-relaxed">
                  <p className="font-semibold text-amber-200">
                    Odmowa Dostępu: Bieżący profil <span className="text-white font-bold">{currentRoleDef.name}</span> nie posiada uprawnienia <code className="px-1.5 py-0.5 rounded bg-black/60 text-amber-300 font-mono">{requiredPermission}</code>
                  </p>
                  <p className="mt-1 text-stone-400">
                    Akcja: <span className="text-stone-200 font-semibold">{actionTitle}</span> — {actionDescription}. Przełącz rolę poniżej na profil z odpowiednimi uprawnieniami (np. <span className="text-cyan-300 font-semibold">{requiredRoleName || 'Architekt / Inżynier / Kurator'}</span>).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: ROLE ROSTER */}
          {activeTab === 'roster' && (
            <div className="space-y-6">
              
              {/* Primary Roles Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2 font-bold">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Główne Role Systemowe Nexus</span>
                  </h3>
                  <span className="text-[10px] font-mono text-stone-400">Dedykowane Zakresy Odpowiedzialności</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {primaryRolesList.map((rKey) => {
                    const r = PREDEFINED_BELLAS_ROLES[rKey];
                    const isCurrent = currentRoleDef.id === r.id;

                    return (
                      <div
                        key={r.id}
                        onClick={() => handleRoleSelect(r.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                          isCurrent 
                            ? 'bg-cyan-950/40 border-cyan-400 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-400/50' 
                            : 'bg-black/50 border-white/10 hover:border-cyan-500/40 hover:bg-stone-900/80'
                        }`}
                      >
                        {isCurrent && (
                          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold border border-cyan-400/40 flex items-center gap-1">
                            <Check className="w-3 h-3" /> AKTYWNA
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <div 
                              className="w-10 h-10 rounded-xl border flex items-center justify-center text-xl shrink-0"
                              style={{
                                backgroundColor: `${r.color}15`,
                                borderColor: `${r.color}40`
                              }}
                            >
                              {r.avatar}
                            </div>
                            <div>
                              <div className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                                {r.name}
                              </div>
                              <div className="text-[10px] font-mono text-stone-400" style={{ color: r.color }}>
                                {r.badge}
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed mb-3">
                            {r.roleDescription}
                          </p>

                          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px] font-mono text-stone-400">
                            <div className="text-[10px] uppercase font-bold text-stone-500">Główny Zakres:</div>
                            <div className="text-stone-300 text-[10px] leading-tight">{r.primaryScope}</div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                          <span className="text-[10px] text-stone-400">Clearance Lvl {r.clearanceLevel}</span>
                          <span className="text-cyan-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1 text-[11px]">
                            <span>Przełącz</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bellas Roster Section */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-purple-400 flex items-center gap-2 font-bold">
                    <span>🏛️ Roster Tożsamości Rodziny Bellas</span>
                  </h3>
                  <span className="text-[10px] font-mono text-stone-400">Spersonalizowane Profile Architektury</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {bellasRosterList.map((rKey) => {
                    const r = PREDEFINED_BELLAS_ROLES[rKey];
                    const isCurrent = currentRoleDef.id === r.id;

                    return (
                      <button
                        key={r.id}
                        onClick={() => handleRoleSelect(r.id)}
                        className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between group ${
                          isCurrent 
                            ? 'bg-purple-950/40 border-purple-400 shadow-lg shadow-purple-500/10' 
                            : 'bg-black/50 border-white/10 hover:border-purple-500/40 hover:bg-stone-900'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-2xl p-2 rounded-xl bg-white/5">{r.avatar}</div>
                          <div>
                            <div className="font-bold text-xs text-white group-hover:text-purple-300 transition-colors">
                              {r.name}
                            </div>
                            <div className="text-[10px] font-mono text-purple-400">
                              Lvl {r.clearanceLevel} • {r.title.split('(')[0]}
                            </div>
                          </div>
                        </div>

                        <div className="text-[10px] text-stone-400 italic line-clamp-2 mt-1">
                          "{r.quote}"
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PERMISSION MATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-5">
              
              {/* Search & Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Szukaj uprawnienia (np. config, eventbus, kino, scribe)..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-white placeholder-stone-500 focus:outline-none focus:border-cyan-500/60"
                  />
                </div>

                <div className="text-xs font-mono text-stone-400 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Uprawnienia profilu <strong className="text-cyan-300">{currentRoleDef.name}</strong></span>
                </div>
              </div>

              {/* Permission Groups Matrix */}
              <div className="space-y-4">
                {PERMISSION_GROUPS.map((group) => {
                  const filteredPermissions = group.permissions.filter(p => 
                    p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.description.toLowerCase().includes(searchTerm.toLowerCase())
                  );

                  if (filteredPermissions.length === 0) return null;

                  return (
                    <div key={group.id} className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-white/5">{group.icon}</div>
                          <div>
                            <h4 className="text-xs font-bold font-mono text-white flex items-center gap-2">
                              <span>{group.title}</span>
                              <span className="px-2 py-0.5 rounded text-[9px] bg-white/5 text-stone-400 border border-white/10">
                                Primary: {group.primaryRole}
                              </span>
                            </h4>
                            <p className="text-[10px] text-stone-400">{group.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                        {filteredPermissions.map((perm) => {
                          const isGranted = currentRoleDef.permissions.includes('admin:all') || currentRoleDef.permissions.includes(perm.key);

                          return (
                            <div
                              key={perm.key}
                              className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                                isGranted 
                                  ? 'bg-cyan-950/20 border-cyan-500/30 text-stone-200' 
                                  : 'bg-stone-950/40 border-white/5 text-stone-500 opacity-60'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <code className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/60 text-cyan-300">
                                    {perm.key}
                                  </code>
                                  <span className="text-xs font-bold text-white">{perm.label}</span>
                                </div>
                                <p className="text-[10px] text-stone-400 leading-tight">
                                  {perm.description}
                                </p>
                              </div>

                              <div className="shrink-0 mt-0.5">
                                {isGranted ? (
                                  <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 text-[10px] font-mono font-bold px-2">
                                    <Check className="w-3 h-3" /> TAK
                                  </span>
                                ) : (
                                  <span className="p-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1 text-[10px] font-mono font-bold px-2">
                                    <XCircle className="w-3 h-3" /> BRAK
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 3: MODULE ACCESS */}
          {activeTab === 'modules' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold font-mono text-cyan-300">
                    Moduły Dostępne dla Roli: {currentRoleDef.name}
                  </h4>
                  <p className="text-[10px] text-stone-400">
                    Granulowany podgląd dozwolonych i zastrzeżonych sekcji w interfejsie Nexus.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/40">
                  {currentRoleDef.badge}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Allowed Modules */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Dozwolone Moduły ({currentRoleDef.allowedModules.length})</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentRoleDef.allowedModules.map((mod) => (
                      <span
                        key={mod}
                        className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center gap-1.5"
                      >
                        <Check className="w-3 h-3" />
                        <span>{mod}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Restricted Modules */}
                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase text-red-400 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>Zastrzeżone Moduły ({currentRoleDef.restrictedModules.length})</span>
                  </h4>
                  {currentRoleDef.restrictedModules.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {currentRoleDef.restrictedModules.map((mod) => (
                        <span
                          key={mod}
                          className="px-2.5 py-1 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-xs flex items-center gap-1.5"
                        >
                          <Lock className="w-3 h-3 text-red-400" />
                          <span>{mod}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs font-mono text-stone-400 italic">
                      Brak zastrzeżeń — rola posiada pełny dostęp globalny (Omega Clearance).
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-black/80 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              soundFx.playModalOpen();
              onClose();
              onOpenLogin();
            }}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 font-mono text-xs flex items-center gap-2 transition-colors border border-white/10"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>Kwantowa Autoryzacja Google / Token Węzła</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playModalClose();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 border border-cyan-400/50"
            >
              Zamknij Studio Rol
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

