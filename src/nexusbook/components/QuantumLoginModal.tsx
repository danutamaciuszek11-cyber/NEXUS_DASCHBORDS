import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Radio, 
  User, 
  Plus, 
  Check, 
  Compass, 
  LogOut,
  Flame,
  Key,
  Upload,
  Image as ImageIcon,
  Eye,
  Lock,
  Globe,
  Share2,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Copy,
  CheckCheck
} from 'lucide-react';
import { PilotProfile, PilotRole, PublishingPortalConnection } from '../types';
import { soundFx } from '../utils/audioSystem';
import { NEXUS_NODE_TOKEN } from '../lib/nodeIdentity';
import { loginWithGoogle, logoutFromFirebase } from '../lib/firebase';
import { processLocalAvatarFile, NEXUS_AVATAR_PRESETS } from '../utils/avatarUtils';
import { DEFAULT_PUBLISHING_PORTALS } from '../data/publishingPortalsData';
import { PREDEFINED_BELLAS_ROLES, BellasRoleId } from '../data/bellasRoles';

interface QuantumLoginModalProps {
  currentPilot: PilotProfile | null;
  onSavePilot: (pilot: PilotProfile) => void;
  onLogoutPilot: () => void;
  onClose: () => void;
  defaultTab?: 'auth' | 'guest' | 'portals';
}

export const QuantumLoginModal: React.FC<QuantumLoginModalProps> = ({
  currentPilot,
  onSavePilot,
  onLogoutPilot,
  onClose,
  defaultTab = 'auth'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const launchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'auth' | 'guest' | 'portals'>(defaultTab);

  // Form states initialized with existing pilot or defaults
  const [designatorName, setDesignatorName] = useState(
    currentPilot?.designatorName || (currentPilot?.isGuest ? 'Gość Obserwator' : 'Architekt Maciej')
  );
  const [vesselClass, setVesselClass] = useState(currentPilot?.vesselClass || 'Nexus Core Vessel v.1');
  const [missionObjectives, setMissionObjectives] = useState(
    currentPilot?.missionObjectives || 'Zarządzanie biblioteką manifestów, archiwizacja Eterniverse i koordynacja agentów Bellas.'
  );
  const [role, setRole] = useState<PilotRole>(currentPilot?.role || (currentPilot?.isGuest ? 'GUEST' : 'ARCHITECT'));
  const [email, setEmail] = useState(currentPilot?.email || '');
  const [encryptionKey, setEncryptionKey] = useState(
    currentPilot?.encryptionKey || 'AES-Q256-NEXUS-' + Math.floor(1000 + Math.random() * 9000)
  );

  const [specializations, setSpecializations] = useState<string[]>(
    currentPilot?.specializations || ['#Architektura-Nexusa', '#Eterniverse-Base', '#NXL-Contracts', '#Bellas-AI']
  );
  const [newTagInput, setNewTagInput] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);

  // Avatar states (URL or Base64 from device memory)
  const [avatarUrl, setAvatarUrl] = useState(
    currentPilot?.avatarUrl || NEXUS_AVATAR_PRESETS[0].url
  );
  const [isProcessingAvatar, setIsProcessingAvatar] = useState(false);
  const [avatarFeedback, setAvatarFeedback] = useState<string | null>(null);
  const [isDragOverAvatar, setIsDragOverAvatar] = useState(false);

  // External Publishing Portals state
  const [portals, setPortals] = useState<PublishingPortalConnection[]>(() => {
    if (currentPilot?.connectedPortals && currentPilot.connectedPortals.length > 0) {
      return currentPilot.connectedPortals;
    }
    return DEFAULT_PUBLISHING_PORTALS;
  });
  const [testingPortalId, setTestingPortalId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; message: string } | null>(null);

  // Launching / Google Auth progress
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [unauthorizedDomainInfo, setUnauthorizedDomainInfo] = useState<{
    hostname: string;
    projectId: string;
  } | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Canvas particle animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
    }[] = [];

    const colors = ['#00f0ff', '#ff007a', '#7000ff', '#00ff8c', '#ffaa00'];

    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const particleCount = window.innerWidth < 768 ? 40 : 100;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.8,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.15
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      particles.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x -= dx * 0.015;
          p.y -= dy * 0.015;
        }
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    initCanvas();
    animate();

    window.addEventListener('resize', initCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', initCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Keyboard shortcut ESC and timer cleanup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLaunching && !isGoogleLoading) {
        soundFx.playModalClose();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (launchIntervalRef.current) {
        clearInterval(launchIntervalRef.current);
      }
    };
  }, [onClose, isLaunching, isGoogleLoading]);

  // File Upload from device memory
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingAvatar(true);
      setAvatarFeedback('Optymalizuję obraz z pamięci urządzenia...');
      soundFx.playClick();

      const base64Avatar = await processLocalAvatarFile(file);
      setAvatarUrl(base64Avatar);
      setAvatarFeedback('Zdjęcie wczytane pomyślnie!');
      soundFx.playSave();
      setTimeout(() => setAvatarFeedback(null), 3000);
    } catch (err: any) {
      console.error(err);
      setAvatarFeedback(err?.message || 'Błąd wczytywania pliku.');
      soundFx.playDelete();
    } finally {
      setIsProcessingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAvatarDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOverAvatar(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      setIsProcessingAvatar(true);
      setAvatarFeedback('Wczytuję z pamięci urządzenia...');
      soundFx.playClick();

      const base64Avatar = await processLocalAvatarFile(file);
      setAvatarUrl(base64Avatar);
      setAvatarFeedback('Zdjęcie awatara zaktualizowane!');
      soundFx.playSave();
      setTimeout(() => setAvatarFeedback(null), 3000);
    } catch (err: any) {
      console.error(err);
      setAvatarFeedback(err?.message || 'Błąd odczytu pliku.');
      soundFx.playDelete();
    } finally {
      setIsProcessingAvatar(false);
    }
  };

  // Google Authentication Handler
  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setAuthError(null);
      setUnauthorizedDomainInfo(null);
      soundFx.playClick();

      const user = await loginWithGoogle();

      const googlePilot: PilotProfile = {
        designatorName: user.displayName || 'Google Pilot',
        vesselClass: 'Google Auth Synapse Cruiser',
        missionObjectives: 'Eksploracja i zarządzanie bazą wiedzy Eterniverse.',
        specializations: ['#Google-Identity', '#Nexus-Sync', '#Eterniverse-Core'],
        avatarUrl: user.photoURL || avatarUrl,
        neuralSyncPct: 99.4,
        encryptionKey: 'GOOGLE-GSI-' + user.uid.substring(0, 10).toUpperCase(),
        authenticated: true,
        authenticatedAt: Date.now(),
        isGuest: false,
        role: 'ARCHITECT',
        email: user.email || undefined,
        authProvider: 'google',
        clearanceLevel: 5,
        connectedPortals: portals
      };

      onSavePilot(googlePilot);
      soundFx.playSave();
      onClose();
    } catch (err: any) {
      console.warn('Google Auth notice:', err?.code || err?.message);
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('auth/unauthorized-domain')) {
        const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'ais-dev-...';
        setUnauthorizedDomainInfo({
          hostname: currentHost,
          projectId: 'gen-lang-client-0866070478'
        });
        setAuthError('Bieżąca domena podglądu nie jest autoryzowana w konsoli Firebase Auth (auth/unauthorized-domain).');
      } else if (err?.code === 'auth/popup-blocked') {
        setUnauthorizedDomainInfo(null);
        setAuthError('Przeglądarka zablokowała okno popup logowania Google. Zezwól na wyskakujące okienka lub użyj autoryzacji poniżej.');
      } else if (err?.code === 'auth/cancelled-popup-request' || err?.code === 'auth/popup-closed-by-user') {
        setUnauthorizedDomainInfo(null);
        setAuthError('Logowanie Google zostało anulowane przez użytkownika.');
      } else {
        setUnauthorizedDomainInfo(null);
        setAuthError(err?.message || 'Nie udało się zalogować przez Google. Sprawdź połączenie.');
      }
      soundFx.playDelete();
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Immediate bypass for sandbox / unauthorized-domain preview environments
  const handleBypassDomainAndLoginAsArchitect = () => {
    soundFx.playSave();
    const architectPilot: PilotProfile = {
      designatorName: designatorName || 'Architekt Maciej',
      vesselClass: vesselClass || 'Nexus Core Vessel [Omega-Master]',
      missionObjectives: missionObjectives || 'Koordynacja ekosystemu Nexusa i Eterniverse.',
      specializations: specializations.length > 0 ? specializations : ['#Architektura-Nexusa', '#Nexus-Omega', '#Eterniverse-Core'],
      avatarUrl: avatarUrl || NEXUS_AVATAR_PRESETS[0].url,
      neuralSyncPct: 99.8,
      encryptionKey: encryptionKey || 'AES-Q256-NEXUS-777',
      authenticated: true,
      authenticatedAt: Date.now(),
      isGuest: false,
      role: 'ARCHITECT',
      email: email || 'nikodemrataj6@gmail.com',
      authProvider: 'quantum_seed',
      clearanceLevel: 5,
      connectedPortals: portals
    };

    onSavePilot(architectPilot);
    soundFx.playModalOpen();
    onClose();
  };

  // Guest Mode Activation Handler
  const handleActivateGuestMode = () => {
    soundFx.playExport();
    const guestProfile: PilotProfile = {
      designatorName: 'Gość Obserwator',
      vesselClass: 'Tryb Obserwatora [READ-ONLY]',
      missionObjectives: 'Przeglądanie dzieł, czytanie manifestów, wgląd w archiwum bez uprawnień modyfikacji.',
      specializations: ['#Obserwator', '#Czytnik-Manifestów', '#Podgląd-Tylko'],
      avatarUrl: NEXUS_AVATAR_PRESETS[4].url,
      neuralSyncPct: 65.0,
      encryptionKey: 'GUEST-OBSERVER-READONLY',
      authenticated: true,
      authenticatedAt: Date.now(),
      isGuest: true,
      role: 'GUEST',
      authProvider: 'guest',
      clearanceLevel: 0,
      connectedPortals: portals.map(p => ({ ...p, status: 'DISCONNECTED' }))
    };

    onSavePilot(guestProfile);
    soundFx.playModalOpen();
    onClose();
  };

  // Bellas Predefined Role 1-Click Fast Login
  const handleSelectBellasMember = (roleId: BellasRoleId) => {
    soundFx.playSuccess();
    const bRole = PREDEFINED_BELLAS_ROLES[roleId];
    if (!bRole) return;

    const profile: PilotProfile = {
      designatorName: bRole.name,
      vesselClass: bRole.assignedNodeName,
      missionObjectives: bRole.quote,
      specializations: bRole.permissions.map(p => `#${p}`),
      avatarUrl: NEXUS_AVATAR_PRESETS[roleId === 'marco' ? 0 : roleId === 'elena' ? 1 : roleId === 'leo' ? 2 : 3]?.url || avatarUrl,
      neuralSyncPct: 99.8,
      encryptionKey: `AES-Q256-BELLAS-${roleId.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      authenticated: true,
      authenticatedAt: Date.now(),
      isGuest: false,
      role: (roleId === 'marco' || roleId === 'architect') ? 'ARCHITECT' : roleId === 'leo' ? 'PILOT' : roleId === 'sofia' ? 'CHRONICLER' : 'SENTINEL',
      email: `${roleId}@bellas.eterniverse.nexus`,
      authProvider: 'quantum_seed',
      clearanceLevel: bRole.clearanceLevel,
      connectedPortals: portals
    };

    onSavePilot(profile);
    soundFx.playModalOpen();
    onClose();
  };

  // Standard Pilot Submission / Traversal Launch
  const handleIgniteEngine = () => {
    if (isLaunching) return;
    soundFx.playExport();
    setIsLaunching(true);
    setLaunchProgress(0);

    let progress = 0;
    if (launchIntervalRef.current) {
      clearInterval(launchIntervalRef.current);
    }

    launchIntervalRef.current = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        if (launchIntervalRef.current) {
          clearInterval(launchIntervalRef.current);
          launchIntervalRef.current = null;
        }
        setLaunchProgress(100);

        const profile: PilotProfile = {
          designatorName: designatorName || 'Architekt Maciej',
          vesselClass: vesselClass || 'Nexus Core Vessel',
          missionObjectives: missionObjectives || 'Koordynacja ekosystemu Nexusa i Eterniverse.',
          specializations: specializations.length > 0 ? specializations : ['#Architektura-Nexusa'],
          avatarUrl: avatarUrl,
          neuralSyncPct: 98.8,
          encryptionKey: encryptionKey || 'AES-Q256-NEXUS-777',
          authenticated: true,
          authenticatedAt: Date.now(),
          isGuest: false,
          role: role,
          email: email || undefined,
          authProvider: 'quantum_seed',
          clearanceLevel: role === 'ARCHITECT' ? 5 : role === 'PILOT' ? 4 : role === 'SENTINEL' ? 3 : 2,
          connectedPortals: portals
        };

        setTimeout(() => {
          onSavePilot(profile);
          soundFx.playModalOpen();
          onClose();
        }, 80);
      } else {
        setLaunchProgress(progress);
      }
    }, 70);
  };

  // Portal Testing / Handshake
  const handleTestPortal = (portalId: string) => {
    soundFx.playClick();
    setTestingPortalId(portalId);
    setTestResult(null);

    setTimeout(() => {
      const portal = portals.find(p => p.id === portalId);
      const isConnected = portal?.status === 'CONNECTED';
      const now = Date.now();

      // Update handshake time
      setPortals(prev => prev.map(p => {
        if (p.id === portalId) {
          return {
            ...p,
            status: 'CONNECTED',
            lastHandshakeAt: now
          };
        }
        return p;
      }));

      setTestResult({
        id: portalId,
        success: true,
        message: `Węzeł [${portal?.name}] pomyślnie zsynchronizowany. Protokół NXL Handshake: OK (Kod 200).`
      });
      soundFx.playSave();
      setTestingPortalId(null);
    }, 1200);
  };

  const handleTogglePortalStatus = (portalId: string) => {
    soundFx.playClick();
    setPortals(prev => prev.map(p => {
      if (p.id === portalId) {
        const nextStatus = p.status === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED';
        return {
          ...p,
          status: nextStatus,
          lastHandshakeAt: nextStatus === 'CONNECTED' ? Date.now() : p.lastHandshakeAt
        };
      }
      return p;
    }));
  };

  const handleUpdatePortalField = (portalId: string, field: keyof PublishingPortalConnection, value: any) => {
    setPortals(prev => prev.map(p => {
      if (p.id === portalId) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    let formatted = newTagInput.trim();
    if (!formatted.startsWith('#')) formatted = `#${formatted}`;
    if (!specializations.includes(formatted)) {
      soundFx.playClick();
      setSpecializations([...specializations, formatted]);
    }
    setNewTagInput('');
    setShowAddTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    soundFx.playClick();
    setSpecializations(specializations.filter(t => t !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#030307]/95 font-sans select-none animate-in fade-in duration-300">
      
      {/* Background Deep Space Particles Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Main Quantum Frame Box */}
      <div className="relative z-10 w-[96vw] max-w-[1140px] max-h-[92vh] md:h-[88vh] bg-[#080914]/90 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_20px_80px_rgba(0,0,0,0.9)] rounded-2xl overflow-hidden flex flex-col">
        
        {/* Top Cyan / Pink Laser Border */}
        <div className="h-[2px] bg-gradient-to-r from-purple-500 via-cyan-400 to-pink-500 shrink-0" />

        {/* Modal Top Header with Tabs */}
        <div className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-black/40 shrink-0">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
              <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '20s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black font-mono uppercase tracking-widest text-white">
                  NEXUS AUTHENTICATION & NODE GATEWAY
                </h2>
                {currentPilot?.isGuest && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    TRYB GOŚCIA
                  </span>
                )}
                {currentPilot?.authenticated && !currentPilot.isGuest && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    AUTORYZOWANY: {currentPilot.role || 'PILOT'}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-mono text-white/50 tracking-wider">
                Rejestr tożsamości NXL, integracja Google i węzły portali publikacyjnych
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 font-mono text-xs">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('auth');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'auth'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Autoryzacja Pilota</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('guest');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'guest'
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Tryb Gościa [Podgląd]</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('portals');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'portals'
                  ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Węzły Publikacji ({portals.filter(p => p.status === 'CONNECTED').length}/{portals.length})</span>
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              soundFx.playModalClose();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Zamknij (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Multi-Column Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-[340px_1fr]">
          
          {/* LEFT SIDEBAR: AVATAR HUD & TELEMETRY */}
          <aside className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/10 bg-black/30 font-mono flex flex-col gap-6 overflow-y-auto custom-scrollbar">
            
            {/* Avatar Orbital Section with Drag & Drop */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                <span>ZDJĘCIE AWATARA</span>
                <span className="text-[9px] text-white/40">PAMIĘĆ WEWNĘTRZNA</span>
              </div>

              {/* Orbital Avatar Ring with Drop Support */}
              <div 
                className={`relative w-[180px] h-[180px] mx-auto shrink-0 transition-all ${
                  isDragOverAvatar ? 'scale-105' : ''
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverAvatar(true);
                }}
                onDragLeave={() => setIsDragOverAvatar(false)}
                onDrop={handleAvatarDrop}
              >
                {/* Outer Ring 1 */}
                <div className={`absolute inset-0 border border-cyan-400/30 border-dashed rounded-full animate-[spin_25s_linear_infinite] ${
                  isDragOverAvatar ? 'border-cyan-300 border-2' : ''
                }`} />
                {/* Inner Ring 2 */}
                <div className="absolute inset-2 border border-pink-500/30 rounded-full animate-[spin_18s_linear_infinite_reverse]" />
                
                {/* Center Image */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[136px] h-[136px] rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,242,255,0.3)] group cursor-pointer bg-slate-950"
                  title="Kliknij, aby wybrać zdjęcie z pamięci wewnętrznej"
                >
                  <img 
                    src={avatarUrl} 
                    alt="Pilot Avatar"
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-bold text-cyan-300 p-2 text-center">
                    <Upload className="w-4 h-4 mb-1 text-cyan-400 animate-bounce" />
                    <span>ZMIEŃ Z DYSKU</span>
                  </div>
                </div>

                {isProcessingAvatar && (
                  <div className="absolute inset-0 rounded-full bg-black/80 flex items-center justify-center text-cyan-400 text-xs">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  </div>
                )}
              </div>

              {/* Feedback toast */}
              {avatarFeedback && (
                <div className="p-2 rounded bg-cyan-950/60 border border-cyan-400/40 text-[10px] text-cyan-300 text-center font-bold">
                  {avatarFeedback}
                </div>
              )}

              {/* Hidden File Input */}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
                onChange={handleAvatarFileChange}
                className="hidden" 
              />

              {/* Upload from device buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Wybierz z Pamięci</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setAvatarUrl(NEXUS_AVATAR_PRESETS[0].url);
                  }}
                  className="py-2 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-[11px]"
                  title="Przywróć domyślny"
                >
                  Reset
                </button>
              </div>

              {/* Fast Presets selector */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[9px] uppercase tracking-widest text-white/40 block">LUB WYBIERZ PROFIL NEXUS:</span>
                <div className="flex items-center justify-between gap-1">
                  {NEXUS_AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        soundFx.playClick();
                        setAvatarUrl(preset.url);
                      }}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                        avatarUrl === preset.url ? 'border-cyan-400 scale-110 shadow-[0_0_10px_#00f0ff]' : 'border-white/20 hover:border-white/50 opacity-70 hover:opacity-100'
                      }`}
                      title={`${preset.name} - ${preset.role}`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover rounded-full" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Node Token Authorization */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[10px] space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3 h-3" />
                  <span>NEXUS NODE TOKEN</span>
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-500/20 rounded text-[9px] text-emerald-300">
                  AKTYWNY
                </span>
              </div>
              <div className="text-[11px] font-bold text-white tracking-wider truncate select-all bg-black/60 px-2 py-1 rounded border border-white/5">
                {NEXUS_NODE_TOKEN}
              </div>
              <p className="text-[9px] text-emerald-300/60 leading-tight">
                Podpis kryptograficzny węzła Firestore & BNB Smart Chain
              </p>
            </div>

            {/* Logout button if authenticated */}
            {currentPilot?.authenticated && (
              <div className="mt-auto pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    soundFx.playDelete();
                    logoutFromFirebase().catch(() => {});
                    onLogoutPilot();
                  }}
                  className="w-full py-2 rounded-lg bg-rose-950/60 border border-rose-500/40 hover:bg-rose-900 text-rose-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Wyloguj Profil</span>
                </button>
              </div>
            )}

          </aside>

          {/* RIGHT MAIN WORKSPACE: TAB CONTENT */}
          <main className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex flex-col justify-between">
            
            {/* --- TAB 1: PILOT AUTHENTICATION & REGISTRATION --- */}
            {activeTab === 'auth' && (
              <div className="space-y-6">
                
                {/* Google One-Click Login Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-cyan-950/30 border border-cyan-500/30 shadow-lg space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span>Błyskawiczne Logowanie</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        Zaloguj się kontem Google
                      </h3>
                      <p className="text-xs text-white/60">
                        Pobiera profil, awatar i przypisuje węzeł Architekta w bazie Nexusa.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleGoogleLogin}
                        disabled={isGoogleLoading}
                        className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs font-mono flex items-center gap-2 transition-all shadow-md hover:shadow-cyan-500/20 disabled:opacity-50 cursor-pointer shrink-0"
                      >
                        {isGoogleLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-cyan-600" />
                        ) : (
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                          </svg>
                        )}
                        <span>{isGoogleLoading ? 'ŁĄCZENIE...' : 'ZALOGUJ PRZEZ GOOGLE'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleBypassDomainAndLoginAsArchitect}
                        title="Błyskawiczna autoryzacja z uprawnieniami Architekta poziomu 5"
                        className="py-2.5 px-3.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 hover:text-cyan-100 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                      >
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        <span className="hidden sm:inline">SZYBKI ARCHITEKT</span>
                      </button>
                    </div>
                  </div>

                  {unauthorizedDomainInfo && (
                    <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 space-y-3 text-xs text-amber-200 font-mono">
                      <div className="flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                              OCHRONA DOMENY FIREBASE AUTH [auth/unauthorized-domain]
                            </span>
                            <span className="text-[10px] text-amber-400/70">Wymagana konfiguracja</span>
                          </div>
                          <p className="text-white/80 text-[11px] leading-relaxed">
                            Bieżący podgląd aplikacji działa na nowej domenie kontenera Cloud Run (<code className="text-cyan-300 font-bold">{unauthorizedDomainInfo.hostname}</code>). Firebase Authentication wymaga wpisania tej domeny na listę zaufanych domen w konsoli projektu Google Firebase.
                          </p>

                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="bg-black/60 px-2.5 py-1 rounded border border-white/15 text-cyan-300 select-all font-mono text-[10px] max-w-full truncate">
                              {unauthorizedDomainInfo.hostname}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(unauthorizedDomainInfo.hostname);
                                setCopiedDomain(true);
                                soundFx.playClick();
                                setTimeout(() => setCopiedDomain(false), 2500);
                              }}
                              className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              {copiedDomain ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedDomain ? 'SKOPIOWANO DOMENĘ' : 'KOPIUJ DOMENĘ'}</span>
                            </button>
                            <a
                              href={`https://console.firebase.google.com/project/${unauthorizedDomainInfo.projectId}/authentication/settings`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center gap-1 transition-all"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>OTWÓRZ USTAWIENIA FIREBASE</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-amber-500/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                        <div className="text-[11px] text-amber-300/90 font-sans">
                          Nie chcesz teraz konfigurować konsoli Firebase?
                        </div>
                        <button
                          type="button"
                          onClick={handleBypassDomainAndLoginAsArchitect}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer transition-all"
                        >
                          <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                          <span>ZALOGUJ JAKO ARCHITEKT (BYPASS DOMENY)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {authError && !unauthorizedDomainInfo && (
                    <div className="p-2.5 rounded-lg bg-red-950/70 border border-red-500/40 text-xs text-red-300 font-mono flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{authError}</span>
                    </div>
                  )}
                </div>

                {/* Bellas Family Predefined Roles 1-Click Fast Login */}
                <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        Tożsamości Rodziny Bellas (1-Click Fast Auth)
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">Predefiniowane Role RBAC</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(['marco', 'elena', 'leo', 'sofia'] as BellasRoleId[]).map((rKey) => {
                      const r = PREDEFINED_BELLAS_ROLES[rKey];
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => handleSelectBellasMember(r.id)}
                          className="p-3 rounded-xl bg-stone-950/80 border border-white/10 hover:border-cyan-500/50 hover:bg-stone-900 text-left flex items-center justify-between group transition-all cursor-pointer shadow-sm"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="text-xl p-1.5 rounded-lg bg-white/5">{r.avatar}</div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                                {r.name}
                              </div>
                              <div className="text-[10px] text-stone-400 font-mono truncate">
                                {r.title}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-cyan-300 font-bold shrink-0 ml-2">
                            Lvl {r.clearanceLevel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-white/10" />
                  <span className="flex-shrink mx-4 font-mono text-[10px] text-white/40 uppercase tracking-widest">
                    LUB RĘCZNA KONFIGURACJA KRYPTONIMU
                  </span>
                  <div className="flex-grow border-t border-white/10" />
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Designator Name */}
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-1.5">
                        KRYPTONIM / NAZWA PILOTA
                      </label>
                      <input
                        type="text"
                        value={designatorName}
                        onChange={(e) => setDesignatorName(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-white font-sans text-sm focus:outline-none transition-all shadow-inner"
                        placeholder="np. Architekt Maciej"
                      />
                    </div>

                    {/* Vessel Class */}
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-1.5">
                        KLASA STATKU / STANOWISKO
                      </label>
                      <input
                        type="text"
                        value={vesselClass}
                        onChange={(e) => setVesselClass(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-white font-sans text-sm focus:outline-none transition-all shadow-inner"
                        placeholder="np. Nexus Core Vessel v.1"
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Clearance Role */}
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-1.5">
                        RANGA / POZIOM UPRAWNIEŃ (CLEARANCE)
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as PilotRole)}
                        className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="ARCHITECT">ARCHITECT (Clearance Omega - Pełne uprawnienia zapisu/publikacji)</option>
                        <option value="PILOT">PILOT (Clearance L4 - Tworzenie kolekcji, adnotacje)</option>
                        <option value="CHRONICLER">CHRONICLER (Clearance L2 - Czytanie i notatki)</option>
                        <option value="SENTINEL">SENTINEL (Clearance L3 - Audyt bezpieczeństwa i węzłów)</option>
                      </select>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-1.5">
                        ADRES EMAIL (OPCJONALNY)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-white font-sans text-sm focus:outline-none transition-all shadow-inner"
                        placeholder="kontakt@eterniverse.nexus"
                      />
                    </div>

                  </div>

                  {/* Mission Objectives */}
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-1.5">
                      CELE OPERACYJNE W NEXUSIE
                    </label>
                    <textarea
                      rows={2}
                      value={missionObjectives}
                      onChange={(e) => setMissionObjectives(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-cyan-400 rounded-xl px-4 py-2 text-white font-sans text-xs focus:outline-none transition-all shadow-inner"
                      placeholder="Zdefiniuj zadania operacyjne w systemie..."
                    />
                  </div>

                  {/* Specializations Tags */}
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-2">
                      SPECJALIZACJE I MODUŁY WĘZŁA
                    </label>
                    
                    <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                      {specializations.map((tag) => (
                        <span 
                          key={tag}
                          className="px-3 py-1 rounded-lg border border-purple-500/40 bg-purple-950/40 text-purple-300 flex items-center gap-1.5 group cursor-pointer hover:border-red-500/50 hover:text-red-300"
                          onClick={() => handleRemoveTag(tag)}
                          title="Kliknij, aby usunąć"
                        >
                          <span>{tag}</span>
                          <X className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                        </span>
                      ))}

                      {showAddTag ? (
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-cyan-500 rounded-lg px-2.5 py-0.5">
                          <input
                            type="text"
                            autoFocus
                            placeholder="#Moduł"
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddTag();
                              if (e.key === 'Escape') setShowAddTag(false);
                            }}
                            className="bg-transparent text-cyan-300 text-xs font-mono focus:outline-none w-24"
                          />
                          <button onClick={handleAddTag} className="text-cyan-400 hover:text-white">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            soundFx.playClick();
                            setShowAddTag(true);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-white/20 bg-white/5 hover:border-cyan-400 text-white/70 hover:text-cyan-300 text-xs flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Dodaj tag</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>

                {/* Footer Action Button */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[11px] font-mono text-white/50">
                    Klucz: <span className="text-cyan-400 font-bold">{encryptionKey}</span>
                  </div>

                  <button
                    onClick={handleIgniteEngine}
                    disabled={isLaunching}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-mono font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
                  >
                    <Flame className="w-4 h-4 text-orange-600" />
                    <span>{isLaunching ? `INICJALIZACJA ${launchProgress}%` : 'ZATWIERDŹ I WEJDŹ DO NEXUSA'}</span>
                  </button>
                </div>

              </div>
            )}

            {/* --- TAB 2: GUEST MODE (OBSERVER) --- */}
            {activeTab === 'guest' && (
              <div className="space-y-6">
                
                <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/40 shadow-xl space-y-4">
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
                      <Eye className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                        TRYB OBSERWATORA [READ-ONLY]
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1">
                        Eksploracja Bazy Nexusa jako Gość
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-white/80 leading-relaxed font-sans">
                    Tryb Gościa pozwala na pełny wgląd w archiwum NexusBook, czytanie wszystkich manifestów, odtwarzanie nagrań lektorskich audio, przeglądanie osi czasu i statystyk bez konieczności podawania hasła czy logowania przez Google.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs pt-2">
                    <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/30 space-y-1.5">
                      <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>DOZWOLONE W TRYBIE GOŚCIA:</span>
                      </div>
                      <ul className="space-y-1 text-white/70 text-[11px] list-disc list-inside">
                        <li>Czytanie wszystkich książek i manifestów</li>
                        <li>Odtwarzanie ścieżek dźwiękowych i audio</li>
                        <li>Przeglądanie osi czasu Seekers i statystyk</li>
                        <li>Przeglądanie światów HTML i cytatów dnia</li>
                        <li>Wgląd w strukturę węzłów i telemetrię</li>
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/40 border border-rose-500/30 space-y-1.5">
                      <div className="text-rose-400 font-bold flex items-center gap-1.5">
                        <Lock className="w-4 h-4" />
                        <span>ZABLOKOWANE DLA OCHRONY DANYCH:</span>
                      </div>
                      <ul className="space-y-1 text-white/70 text-[11px] list-disc list-inside">
                        <li>Edycja i tworzenie dzieł w Editorial Studio</li>
                        <li>Dodawanie i usuwanie grafik z Asset Library</li>
                        <li>Importowanie nowych plików PDF / Substack</li>
                        <li>Tworzenie i modyfikowanie własnych kolekcji</li>
                        <li>Zapisywanie trwałych zakładek i adnotacji</li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[11px] font-mono text-amber-300/70">
                      W każdej chwili możesz powrócić do logowania i odblokować pełne uprawnienia.
                    </span>

                    <button
                      onClick={handleActivateGuestMode}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-mono font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>WEJDŹ DO NEXUSA JAKO GOŚĆ</span>
                    </button>
                  </div>

                </div>

              </div>
            )}

            {/* --- TAB 3: EXTERNAL PUBLISHING PORTALS --- */}
            {activeTab === 'portals' && (
              <div className="space-y-6">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                      <Share2 className="w-4 h-4 text-purple-400" />
                      <span>WĘZŁY POŁĄCZEŃ Z PORTALAMI PUBLIKACYJNYMI</span>
                    </h3>
                    <p className="text-xs text-white/60">
                      Skonfiguruj połączenia z zewnętrznymi platformami publikacji esejów, kodu NXL i komunikatów.
                    </p>
                  </div>

                  <span className="text-xs font-mono text-cyan-400 font-bold px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30">
                    Protokół NXL Gateway v1.0
                  </span>
                </div>

                {/* Test Feedback Toast */}
                {testResult && (
                  <div className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between gap-2 animate-in fade-in ${
                    testResult.success 
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
                      : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>{testResult.message}</span>
                    </div>
                    <button 
                      onClick={() => setTestResult(null)}
                      className="text-white/40 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Portals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {portals.map((portal) => {
                    const isConnected = portal.status === 'CONNECTED';
                    const isTesting = testingPortalId === portal.id;

                    return (
                      <div 
                        key={portal.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                          isConnected 
                            ? 'bg-slate-900/80 border-cyan-500/40 shadow-sm' 
                            : 'bg-black/40 border-white/10 opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isConnected ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-white/5 text-white/50'
                            }`}>
                              <Globe className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-xs">{portal.name}</h4>
                              <p className="text-[10px] text-white/50">{portal.accountHandle || portal.nxlNodeAddress}</p>
                            </div>
                          </div>

                          {/* Toggle Switch */}
                          <button
                            type="button"
                            onClick={() => handleTogglePortalStatus(portal.id)}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                              isConnected 
                                ? 'bg-emerald-500 text-black shadow-sm' 
                                : 'bg-white/10 text-white/60 hover:bg-white/20'
                            }`}
                          >
                            {isConnected ? 'POŁĄCZONY' : 'ROZŁĄCZ'}
                          </button>
                        </div>

                        {/* Config Inputs */}
                        <div className="space-y-2 pt-1 border-t border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] text-white/40 uppercase w-20 shrink-0">Konto / Cel:</span>
                            <input
                              type="text"
                              value={portal.accountHandle || ''}
                              onChange={(e) => handleUpdatePortalField(portal.id, 'accountHandle', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] text-white/90 focus:outline-none focus:border-cyan-400"
                              placeholder="@handle lub webhook URL"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[9px] text-white/40 uppercase w-20 shrink-0">Tryb Uprawnień:</span>
                            <select
                              value={portal.permissionMode}
                              onChange={(e) => handleUpdatePortalField(portal.id, 'permissionMode', e.target.value)}
                              className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-[10px] text-cyan-300 focus:outline-none"
                            >
                              <option value="READ_ONLY">READ_ONLY (Tylko odczyt)</option>
                              <option value="MANUAL_DISPATCH">MANUAL_DISPATCH (Zatwierdzaj każdy dispatch)</option>
                              <option value="AUTO_PUBLISH">AUTO_PUBLISH (Automatyczna synchronizacja)</option>
                            </select>
                          </div>
                        </div>

                        {/* Handshake Ping Test */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                          <span className="text-white/40">
                            {portal.lastHandshakeAt 
                              ? `Handshake: ${new Date(portal.lastHandshakeAt).toLocaleTimeString()}`
                              : 'Brak aktywnego pinga'}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleTestPortal(portal.id)}
                            disabled={isTesting}
                            className="px-2.5 py-1 rounded bg-white/5 hover:bg-cyan-950 hover:border-cyan-400 border border-white/10 text-cyan-300 text-[10px] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                            <span>{isTesting ? 'TESTOWANIE...' : 'TESTUJ WĘZEŁ'}</span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playSave();
                      if (currentPilot) {
                        onSavePilot({
                          ...currentPilot,
                          connectedPortals: portals
                        });
                      }
                      setActiveTab('auth');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>ZAPISZ KONFIGURACJĘ WĘZŁÓW</span>
                  </button>
                </div>

              </div>
            )}

          </main>

        </div>

      </div>

    </div>
  );
};
