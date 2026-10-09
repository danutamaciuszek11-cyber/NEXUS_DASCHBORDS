import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Camera, 
  Upload, 
  Trash2, 
  Check, 
  Copy, 
  Sparkles, 
  Save, 
  RefreshCw, 
  Wallet, 
  Github, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  Award,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { UserProfile, DEFAULT_NEXUS_PROFILE, Language } from '../../types/base-dev-tools';

const STORAGE_KEY = 'nxl_nexus_user_profile';

const AVATAR_PRESETS = [
  {
    id: 'nexus-cyan',
    label: 'Nexus Cyan',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2309090b"/><circle cx="50" cy="50" r="34" stroke="%2306b6d4" stroke-width="6" fill="none"/><circle cx="50" cy="50" r="16" fill="%2306b6d4"/><path d="M50 10v16M50 74v16M10 50h16M74 50h16" stroke="%2322d3ee" stroke-width="4"/></svg>`
  },
  {
    id: 'zkvm-matrix',
    label: 'zkVM Core',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23020617"/><rect x="25" y="25" width="50" height="50" rx="10" fill="%231e293b" stroke="%2338bdf8" stroke-width="4"/><path d="M35 50h30M50 35v30" stroke="%2338bdf8" stroke-width="4"/><circle cx="50" cy="50" r="6" fill="%23f8fafc"/></svg>`
  },
  {
    id: 'emerald-prover',
    label: 'Emerald Node',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23064e3b"/><polygon points="50,15 85,50 50,85 15,50" fill="%2310b981"/><circle cx="50" cy="50" r="14" fill="%23ecfdf5"/></svg>`
  },
  {
    id: 'superchain-purple',
    label: 'Superchain',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23312e81"/><path d="M50 18 L82 36 L82 72 L50 90 L18 72 L18 36 Z" fill="%236366f1"/><path d="M50 18 L50 90 M18 36 L82 72 M18 72 L82 36" stroke="%23e0e7ff" stroke-width="3"/></svg>`
  },
  {
    id: 'fire-turbo',
    label: 'Turbo Rig',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23431407"/><circle cx="50" cy="50" r="32" fill="%23ea580c"/><path d="M50 28 L62 48 L44 54 L56 74 L36 50 L48 46 Z" fill="%23fff7ed"/></svg>`
  },
];

interface NexusProfileProps {
  lang: Language;
  onProfileUpdated?: (profile: UserProfile) => void;
  userPoints: number;
}

export function NexusProfile({ lang, onProfileUpdated, userPoints }: NexusProfileProps) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_NEXUS_PROFILE;
  });

  const [formState, setFormState] = useState<UserProfile>(profile);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormState(profile);
  }, [profile]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(lang === 'pl' ? 'Wybierz poprawny plik graficzny (PNG, JPG, SVG, WebP).' : 'Please upload an image file.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setFormState(prev => ({ ...prev, avatarUrl: dataUrl }));
        } else {
          setFormState(prev => ({ ...prev, avatarUrl: event.target?.result as string }));
        }
        setIsUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const validateUsername = (name: string): boolean => {
    if (!name.trim()) {
      setUsernameError(lang === 'pl' ? 'Nazwa użytkownika jest wymagana.' : 'Username is required.');
      return false;
    }
    if (name.length < 3) {
      setUsernameError(lang === 'pl' ? 'Minimum 3 znaki.' : 'Minimum 3 characters.');
      return false;
    }
    if (name.length > 28) {
      setUsernameError(lang === 'pl' ? 'Maksymalnie 28 znaków.' : 'Maximum 28 characters.');
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      setUsernameError(lang === 'pl' ? 'Tylko litery, cyfry, myślniki i podkreślenia.' : 'Only letters, numbers, underscores and hyphens allowed.');
      return false;
    }
    setUsernameError(null);
    return true;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUsername(formState.username)) return;

    const updated: UserProfile = {
      ...formState,
      username: formState.username.trim(),
      bio: formState.bio.trim(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setProfile(updated);
      setIsSaved(true);
      if (onProfileUpdated) onProfileUpdated(updated);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert(lang === 'pl' ? 'Nie udało się zapisać profilu w pamięci przeglądarki.' : 'Failed to save profile to local storage.');
    }
  };

  const handleReset = () => {
    if (window.confirm(lang === 'pl' ? 'Zresetować profil do ustawień domyślnych?' : 'Reset profile to default demo settings?')) {
      localStorage.removeItem(STORAGE_KEY);
      setProfile(DEFAULT_NEXUS_PROFILE);
      setFormState(DEFAULT_NEXUS_PROFILE);
      setUsernameError(null);
      if (onProfileUpdated) onProfileUpdated(DEFAULT_NEXUS_PROFILE);
    }
  };

  const maxBioLength = 160;
  const bioLength = formState.bio.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Form Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-6 mb-8">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-600" />
              {lang === 'pl' ? 'Profil Operatora NXL Nexus' : 'NXL Nexus Operator Profile'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              {lang === 'pl' 
                ? 'Dostosuj swoją tożsamość węzła obliczeniowego, awatar i dane adresowe.' 
                : 'Configure your compute node identity, avatar, and linked verifiable credentials.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="self-start sm:self-center text-xs font-medium text-neutral-500 hover:text-neutral-800 flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'pl' ? 'Resetuj Domyślne' : 'Reset Defaults'}</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Avatar Section */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-neutral-900">
              {lang === 'pl' ? 'Awatar Operatora / Zdjęcie Profilowe' : 'Operator Avatar & Profile Picture'}
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-neutral-950 border-2 border-neutral-800 shadow-inner flex items-center justify-center">
                  {formState.avatarUrl ? (
                    <img 
                      src={formState.avatarUrl} 
                      alt={formState.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white font-bold text-3xl font-mono">
                      {formState.username.charAt(0).toUpperCase() || 'N'}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center text-white text-xs font-medium gap-1"
                >
                  <Camera className="w-5 h-5" />
                  <span>Change</span>
                </button>
              </div>

              <div className="space-y-3 flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Przetwarzanie...' : (lang === 'pl' ? 'Wgraj Zdjęcie' : 'Upload Image')}</span>
                  </button>

                  {formState.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setFormState(prev => ({ ...prev, avatarUrl: '' }))}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{lang === 'pl' ? 'Usuń' : 'Remove'}</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-neutral-500">
                  {lang === 'pl' 
                    ? 'Automatycznie kompresowane do formatu Data URL (PNG, JPG, SVG).' 
                    : 'Optimized via client canvas to ensure fast, lightweight local storage.'}
                </p>
              </div>
            </div>

            {/* Presets */}
            <div className="pt-2">
              <span className="block text-xs font-medium text-neutral-600 mb-2">
                {lang === 'pl' ? 'Lub wybierz stylizowany awatar NXL Nexus:' : 'Or select an NXL Nexus avatar preset:'}
              </span>
              <div className="flex flex-wrap gap-2.5">
                {AVATAR_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormState(prev => ({ ...prev, avatarUrl: p.svg }))}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white hover:border-cyan-500 transition-all text-xs text-neutral-700"
                  >
                    <img src={p.svg} alt={p.label} className="w-6 h-6 rounded-lg object-cover" />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Username & Role */}
          <div className="border-t border-neutral-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-900">
                {lang === 'pl' ? 'Nazwa Użytkownika (Username) *' : 'Operator Username *'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 text-sm font-mono">
                  @
                </span>
                <input
                  type="text"
                  value={formState.username}
                  onChange={(e) => {
                    setFormState(prev => ({ ...prev, username: e.target.value }));
                    if (usernameError) validateUsername(e.target.value);
                  }}
                  className={`w-full rounded-xl border ${
                    usernameError ? 'border-red-400' : 'border-neutral-300 focus:border-cyan-500'
                  } pl-8 pr-4 py-2.5 text-sm font-mono focus:ring-1 focus:ring-cyan-500 outline-none`}
                />
              </div>

              {usernameError ? (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {usernameError}
                </p>
              ) : (
                <p className="text-xs text-neutral-500 font-mono">
                  Node Handle: <span className="text-cyan-700 font-bold">{formState.username}.nexus</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-900">
                {lang === 'pl' ? 'Rola w Ekosystemie NXL' : 'Ecosystem Role'}
              </label>
              <select
                value={formState.role || 'Nexus Prover Node Operator'}
                onChange={(e) => setFormState(prev => ({ ...prev, role: e.target.value }))}
                className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm focus:border-cyan-500 outline-none"
              >
                <option value="Nexus Prover Node Operator">Nexus Prover Node Operator</option>
                <option value="zkVM Algorithm Researcher">zkVM Algorithm Researcher</option>
                <option value="Superchain Compute Validator">Superchain Compute Validator</option>
                <option value="Smart Contract Developer">Smart Contract Developer</option>
                <option value="Kaspa / NXL Miner & Enthusiast">Kaspa / NXL Miner & Enthusiast</option>
              </select>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-neutral-900">
                {lang === 'pl' ? 'Krótki Opis (Bio)' : 'Operator Bio'}
              </label>
              <span className={`text-xs ${bioLength > maxBioLength ? 'text-red-500 font-semibold' : 'text-neutral-400'}`}>
                {bioLength}/{maxBioLength}
              </span>
            </div>
            <textarea
              rows={3}
              value={formState.bio}
              onChange={(e) => {
                if (e.target.value.length <= maxBioLength + 10) {
                  setFormState(prev => ({ ...prev, bio: e.target.value }));
                }
              }}
              placeholder={lang === 'pl' ? 'Napisz coś o swoim węźle, mocy obliczeniowej lub projektach...' : 'Tell the network about your compute cluster or projects...'}
              className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-cyan-500 outline-none resize-y"
            />
          </div>

          {/* Wallet Address & Socials */}
          <div className="border-t border-neutral-100 pt-6 space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-cyan-600" />
              {lang === 'pl' ? 'Adres Portfela & Integracje' : 'Wallet Address & Socials'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1 sm:col-span-1">
                <label className="block text-xs font-medium text-neutral-600">Base / EVM Address</label>
                <input
                  type="text"
                  value={formState.walletAddress || ''}
                  onChange={(e) => setFormState(prev => ({ ...prev, walletAddress: e.target.value }))}
                  placeholder="0x..."
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs font-mono focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-600">Farcaster / Warpcast</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neutral-400 text-xs">@</span>
                  <input
                    type="text"
                    value={formState.farcasterHandle || ''}
                    onChange={(e) => setFormState(prev => ({ ...prev, farcasterHandle: e.target.value }))}
                    placeholder="handle"
                    className="w-full rounded-xl border border-neutral-300 pl-7 pr-3 py-2 text-xs focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-600">GitHub Profile</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neutral-400 text-xs">github.com/</span>
                  <input
                    type="text"
                    value={formState.githubHandle || ''}
                    onChange={(e) => setFormState(prev => ({ ...prev, githubHandle: e.target.value }))}
                    placeholder="username"
                    className="w-full rounded-xl border border-neutral-300 pl-24 pr-3 py-2 text-xs focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t border-neutral-100 pt-6 flex items-center justify-between">
            <div>
              {isSaved && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" />
                  {lang === 'pl' ? 'Profil został zapisany w pamięci!' : 'Profile saved successfully!'}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md text-xs"
            >
              <Save className="w-4 h-4" />
              <span>{lang === 'pl' ? 'Zapisz Profil' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Live Operator Card Preview */}
      <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 sm:p-8 text-white space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-neutral-200">
              {lang === 'pl' ? 'Podgląd Karty Identyfikacyjnej NXL Prover' : 'NXL Operator Identity Card Preview'}
            </h3>
          </div>
          <span className="text-xs text-cyan-400 font-mono">STATUS: VERIFIED OPERATOR</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center flex-shrink-0">
              {formState.avatarUrl ? (
                <img src={formState.avatarUrl} alt={formState.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-cyan-600 flex items-center justify-center font-bold text-xl text-white font-mono">
                  {formState.username.charAt(0).toUpperCase() || 'N'}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-white tracking-tight">
                  {formState.username || 'Anonymous Operator'}
                </h4>
                <span className="text-xs text-cyan-400 font-mono">
                  @{formState.username}.nexus
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {formState.role || 'Nexus Prover Node Operator'} · Tier: <span className="text-cyan-400 font-bold">{formState.nxlTier}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-800/80">
              {formState.walletAddress ? `${formState.walletAddress.slice(0, 6)}...${formState.walletAddress.slice(-4)}` : 'No wallet linked'}
            </span>
          </div>
        </div>

        <div className="text-xs text-neutral-300 leading-relaxed bg-neutral-900/60 p-4 rounded-xl border border-neutral-800">
          {formState.bio || 'Operating high-efficiency zkVM nodes for the NXL Nexus verifiable compute layer.'}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80">
            <span className="text-neutral-500 block text-[10px] uppercase">Lifetime Points</span>
            <span className="text-cyan-400 font-bold text-sm">{userPoints.toLocaleString(undefined, { maximumFractionDigits: 0 })} NXL</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80">
            <span className="text-neutral-500 block text-[10px] uppercase">Node Rank</span>
            <span className="text-white font-bold text-sm">#6 Global</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80">
            <span className="text-neutral-500 block text-[10px] uppercase">Epoch Joined</span>
            <span className="text-neutral-300 font-bold text-sm">Testnet 14</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80">
            <span className="text-neutral-500 block text-[10px] uppercase">Network Tier</span>
            <span className="text-emerald-400 font-bold text-sm">{formState.nxlTier} (1.5x)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

