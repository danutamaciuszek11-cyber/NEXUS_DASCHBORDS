import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  User,
  Palette,
  Layout,
  Globe,
  Users,
  Cpu,
  Share2,
  Copy,
  Check,
  Zap,
  Flame,
  Globe2,
  Layers,
  Terminal,
  Grid,
  Clock,
  Compass,
  Download,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Plus,
  Radio,
  Sliders,
  Sparkle
} from 'lucide-react';
import { 
  CreatorSoulProfile, 
  CreatorRole, 
  AuraColor, 
  BackgroundMode, 
  MotionStyle, 
  SoulLayoutMode,
  Book 
} from '../types';
import { soundFx } from '../utils/audioSystem';
import { SAMPLE_BOOKS } from '../data/booksData';

interface CreatorSoulEngineModalProps {
  onClose: () => void;
  currentProfile: CreatorSoulProfile | null;
  onSaveProfile: (profile: CreatorSoulProfile) => void;
  books?: Book[];
}

const ALL_ROLES: { id: CreatorRole; label: string; desc: string }[] = [
  { id: 'Writer', label: 'Writer', desc: 'Twórca prozy, esejów i powieści' },
  { id: 'World Builder', label: 'World Builder', desc: 'Architekt uniwersów i geografii' },
  { id: 'Artist', label: 'Artist', desc: 'Twórca wizualny i ilustrator' },
  { id: 'Researcher', label: 'Researcher', desc: 'Badacz, analityk i naukowiec' },
  { id: 'Developer', label: 'Developer', desc: 'Programista i inżynier technologii' },
  { id: 'Entrepreneur', label: 'Entrepreneur', desc: 'Innowator biznesowy i strateg' },
  { id: 'Explorer', label: 'Explorer', desc: 'Odkrywca nowych idei i tematów' },
  { id: 'Community Builder', label: 'Community Builder', desc: 'Lider i animator społeczności' },
  { id: 'AI Architect', label: 'AI Architect', desc: 'Projektant systemów i narzędzi sztucznej inteligencji' },
  { id: 'Designer', label: 'Designer', desc: 'Projektant interfejsów, doświadczeń i grafiki' },
  { id: 'Educator', label: 'Educator', desc: 'Nauczyciel, mentor i popularyzator wiedzy' },
  { id: 'Hybrid Creator', label: 'Hybrid Creator', desc: 'Łączenie wielu dyscyplin twórczych' }
];

const AURA_OPTIONS: { id: AuraColor; label: string; gradient: string; glow: string }[] = [
  { id: 'Cyber Cyan', label: 'Cyber Cyan', gradient: 'from-cyan-500 to-blue-600', glow: 'shadow-cyan-500/30' },
  { id: 'Deep Violet', label: 'Deep Violet', gradient: 'from-purple-600 to-pink-600', glow: 'shadow-purple-500/30' },
  { id: 'Solar Gold', label: 'Solar Gold', gradient: 'from-amber-400 to-orange-500', glow: 'shadow-amber-500/30' },
  { id: 'Crimson Energy', label: 'Crimson Energy', gradient: 'from-rose-500 to-red-600', glow: 'shadow-rose-500/30' },
  { id: 'Forest Organic', label: 'Forest Organic', gradient: 'from-emerald-400 to-teal-600', glow: 'shadow-emerald-500/30' },
  { id: 'Arctic Glass', label: 'Arctic Glass', gradient: 'from-sky-300 to-indigo-500', glow: 'shadow-sky-400/30' },
  { id: 'Void Black', label: 'Void Black', gradient: 'from-slate-700 to-black', glow: 'shadow-slate-600/30' },
  { id: 'Custom RGB', label: 'Custom RGB', gradient: 'from-pink-500 via-cyan-400 to-yellow-400', glow: 'shadow-pink-500/30' }
];

const BACKGROUND_MODES: { id: BackgroundMode; label: string; desc: string }[] = [
  { id: 'Glass Universe', label: 'Glass Universe', desc: 'Półprzezroczyste szkło i neony' },
  { id: 'Dark Terminal', label: 'Dark Terminal', desc: 'Konsola inżynieryjna CJS/CLI' },
  { id: 'Paper Library', label: 'Paper Library', desc: 'Elegancka tekstura papieru i atramentu' },
  { id: 'Holographic Space', label: 'Holographic Space', desc: 'Głębia kosmicznych wiązek światła' },
  { id: 'Minimal White', label: 'Minimal White', desc: 'Przejrzysty, czysty i jasny chłód' },
  { id: 'Neural Grid', label: 'Neural Grid', desc: 'Siatka połączeń neuronowych' }
];

const MOTION_STYLES: { id: MotionStyle; label: string }[] = [
  { id: 'Static', label: 'Static (Spokój)' },
  { id: 'Soft Flow', label: 'Soft Flow (Płynny przepływ)' },
  { id: 'Digital Rain', label: 'Digital Rain (Kod)' },
  { id: 'Cosmic Drift', label: 'Cosmic Drift (Kosmos)' },
  { id: 'Pulse Energy', label: 'Pulse Energy (Rytm)' }
];

const COLLABORATION_TAGS = [
  'Illustrator',
  'Music Composer',
  'Translator',
  'Developer',
  'Editor',
  'Marketing Partner',
  'Voice Actor',
  'Research Partner',
  'Co-author'
];

export const CreatorSoulEngineModal: React.FC<CreatorSoulEngineModalProps> = ({
  onClose,
  currentProfile,
  onSaveProfile,
  books = SAMPLE_BOOKS
}) => {
  // Navigation Tabs inside Soul Engine
  const [activeTab, setActiveTab] = useState<'genesis' | 'visual_dna' | 'space' | 'marketplace' | 'ai_curator' | 'export'>('space');

  // Creator Profile State
  const [handle, setHandle] = useState<string>(currentProfile?.handle || 'maciej');
  const [displayName, setDisplayName] = useState<string>(currentProfile?.displayName || 'Maciej World Architect');
  const [tagline, setTagline] = useState<string>(currentProfile?.tagline || 'Architekt cyfrowych uniwersów i opowieści');
  const [bio, setBio] = useState<string>(currentProfile?.bio || 'Tworzę powieści sci-fi, głębokie systemy magii i interaktywne światy w NexusBook.');
  const [selectedRoles, setSelectedRoles] = useState<CreatorRole[]>(currentProfile?.roles || ['Writer', 'World Builder']);
  
  // Visual DNA
  const [aura, setAura] = useState<AuraColor>(currentProfile?.primaryAura || 'Cyber Cyan');
  const [bgMode, setBgMode] = useState<BackgroundMode>(currentProfile?.backgroundMode || 'Glass Universe');
  const [motion, setMotion] = useState<MotionStyle>(currentProfile?.motionStyle || 'Soft Flow');
  
  // Space Layout
  const [spaceLayout, setSpaceLayout] = useState<SoulLayoutMode>(currentProfile?.spaceLayout || 'galaxy');
  const [featuredBookId, setFeaturedBookId] = useState<string>(currentProfile?.featuredBookId || books[0]?.id || 'b1');

  // Marketplace Collaboration Tags
  const [seekingTags, setSeekingTags] = useState<string[]>(currentProfile?.seekingCollaborators || ['ilustracji', 'współpracy literackiej']);

  // Public Visibility
  const [isPublic, setIsPublic] = useState<boolean>(currentProfile?.isPublic ?? true);

  // Copy URL state
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);
  const [copiedFullHtml, setCopiedFullHtml] = useState<boolean>(false);

  // Custom Atmosphere & Cyberpunk Gate Tuning
  const [customHexColor, setCustomHexColor] = useState<string>(currentProfile?.customHexColor || '#00f2ff');
  const [customSecondaryHex, setCustomSecondaryHex] = useState<string>(currentProfile?.customSecondaryHex || '#ff003c');
  const [enableScanlines, setEnableScanlines] = useState<boolean>(currentProfile?.enableScanlines ?? true);
  const [enableGlitchEffect, setEnableGlitchEffect] = useState<boolean>(currentProfile?.enableGlitchEffect ?? true);
  const [operatorId, setOperatorId] = useState<string>(currentProfile?.operatorId || 'OPR_001');
  const [subjectStats, setSubjectStats] = useState(currentProfile?.subjectStats || {
    cognitiveLoad: 'STABLE',
    realityAnchor: '77% [DEGRADING]',
    protocols: 'ACTIVE',
    location: 'NEXUS CITY',
    objective: 'FREEDOM.EXE'
  });

  // AI Color Composer Prompt
  const [aiComposerPrompt, setAiComposerPrompt] = useState<string>('');
  const [isAiComposing, setIsAiComposing] = useState<boolean>(false);

  // AI Color & Atmosphere Preset Generator
  const handleAiComposeColors = (presetPrompt?: string) => {
    const promptText = (presetPrompt || aiComposerPrompt).toLowerCase();
    soundFx.playClick();
    setIsAiComposing(true);

    setTimeout(() => {
      if (promptText.includes('haker') || promptText.includes('matrix') || promptText.includes('terminal')) {
        setCustomHexColor('#00ff41');
        setCustomSecondaryHex('#ff003c');
        setAura('Custom RGB');
        setBgMode('Dark Terminal');
        setSpaceLayout('terminal');
        setEnableScanlines(true);
        setEnableGlitchEffect(true);
      } else if (promptText.includes('red') || promptText.includes('czerw') || promptText.includes('crimson')) {
        setCustomHexColor('#ff003c');
        setCustomSecondaryHex('#00f2ff');
        setAura('Crimson Energy');
        setBgMode('Neural Grid');
        setEnableScanlines(true);
      } else if (promptText.includes('gold') || promptText.includes('złot') || promptText.includes('solar')) {
        setCustomHexColor('#ffaa00');
        setCustomSecondaryHex('#7000ff');
        setAura('Solar Gold');
        setBgMode('Holographic Space');
      } else if (promptText.includes('violet') || promptText.includes('fiolet') || promptText.includes('void')) {
        setCustomHexColor('#a855f7');
        setCustomSecondaryHex('#00f2ff');
        setAura('Deep Violet');
        setBgMode('Glass Universe');
      } else {
        setCustomHexColor('#00f2ff');
        setCustomSecondaryHex('#ff003c');
        setAura('Cyber Cyan');
        setBgMode('Dark Terminal');
        setEnableScanlines(true);
        setEnableGlitchEffect(true);
      }
      soundFx.playSuccess();
      setIsAiComposing(false);
    }, 400);
  };

  // Generate HTML embed code (Card)
  const generateEmbedHtml = () => {
    return `<div style="font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; border: 2px solid ${customHexColor}; border-radius: 20px; padding: 24px; max-width: 480px; box-shadow: 0 0 40px ${customHexColor}40;">
  <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${customHexColor}; letter-spacing: 2px; margin-bottom: 8px;">NEXUSBOOK CREATOR IDENTITY CARD</div>
  <h2 style="margin: 0 0 4px 0; font-size: 22px; font-weight: 900; color: #ffffff;">${displayName}</h2>
  <div style="font-size: 12px; color: ${customHexColor}; margin-bottom: 12px;">nexusbook.io/${handle.toLowerCase()}</div>
  <p style="font-size: 13px; color: #cbd5e1; font-style: italic; border-left: 3px solid ${customHexColor}; padding-left: 12px; margin: 12px 0;">"${tagline}"</p>
  <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px;">
    ${selectedRoles.map(r => `<span style="background: rgba(255,255,255,0.1); color: #e2e8f0; font-size: 10px; padding: 3px 8px; border-radius: 4px;">${r}</span>`).join('')}
  </div>
  <div style="margin-top: 20px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between;">
    <span>Aura: ${aura}</span>
    <span>Collaboration: ${seekingTags.length > 0 ? seekingTags.join(', ') : 'Closed'}</span>
  </div>
</div>`;
  };

  // Generate Complete Cyberpunk Gate HTML5 (Matching user HTML specification)
  const generateFullCyberpunkHtml = () => {
    return `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEXUSBOOK // ${displayName} [OPERATOR GATE]</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --neon-blue: ${customHexColor};
            --glitch-red: ${customSecondaryHex};
            --void-black: #050505;
            --data-green: #00ff41;
            --glass: rgba(0, 242, 255, 0.05);
            --border-glow: ${customHexColor}40;
        }

        body {
            background-color: var(--void-black);
            color: var(--neon-blue);
            font-family: 'Rajdhani', sans-serif;
            margin: 0;
            padding: 20px;
            overflow-x: hidden;
            background-image: 
                radial-gradient(circle at 50% 50%, rgba(0, 20, 30, 1) 0%, rgba(5, 5, 5, 1) 100%),
                repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px);
            background-size: cover, 100% 3px;
        }

        ${enableScanlines ? `
        body::before {
            content: " ";
            display: block;
            position: fixed;
            top: 0; left: 0; bottom: 0; right: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            z-index: 9999;
            pointer-events: none;
            background-size: 100% 2px, 3px 100%;
        }
        ` : ''}

        .dashboard {
            display: grid;
            grid-template-columns: 350px 1fr 300px;
            grid-gap: 20px;
            max-width: 1400px;
            margin: 0 auto;
        }

        @media (max-width: 1024px) {
            .dashboard { grid-template-columns: 1fr; }
        }

        .identity-card {
            grid-column: 1 / -1;
            border: 1px solid var(--neon-blue);
            padding: 20px;
            background: var(--glass);
            display: flex;
            justify-content: space-between;
            align-items: center;
            clip-path: polygon(0 0, 98% 0, 100% 30%, 100% 100%, 2% 100%, 0 70%);
            border-left: 5px solid var(--neon-blue);
            margin-bottom: 10px;
        }

        .operator-info h1 {
            font-family: 'Orbitron', sans-serif;
            margin: 0;
            font-size: 2.5rem;
            letter-spacing: 5px;
            text-transform: uppercase;
            text-shadow: 0 0 10px var(--neon-blue);
        }

        .status-tag {
            color: var(--glitch-red);
            font-family: 'Share Tech Mono', monospace;
            animation: flicker 2s infinite;
        }

        .profile-container {
            border: 1px solid var(--border-glow);
            padding: 15px;
            background: rgba(0, 0, 0, 0.6);
            position: relative;
        }

        .biometric-scanner {
            width: 100%;
            height: 300px;
            background: url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400') center/cover;
            filter: grayscale(1) contrast(1.5) brightness(0.8) sepia(1) hue-rotate(140deg);
            position: relative;
            border: 1px solid var(--neon-blue);
            margin-bottom: 15px;
        }

        .biometric-scanner::after {
            content: "";
            position: absolute;
            top: 0; left: 0; width: 100%; height: 2px;
            background: var(--neon-blue);
            box-shadow: 0 0 15px var(--neon-blue);
            animation: scan 3s linear infinite;
        }

        .stats-list {
            list-style: none;
            padding: 0;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.9rem;
        }

        .stats-list li {
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px dotted var(--border-glow);
        }

        .library-container {
            border: 1px solid var(--border-glow);
            padding: 20px;
            background: rgba(0, 0, 0, 0.4);
        }

        .section-title {
            font-family: 'Orbitron', sans-serif;
            border-bottom: 2px solid var(--neon-blue);
            padding-bottom: 10px;
            margin-top: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .book-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .book-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(0, 242, 255, 0.1);
            transition: all 0.3s ease;
            position: relative;
            cursor: pointer;
            overflow: hidden;
        }

        .book-card:hover {
            border-color: var(--neon-blue);
            transform: translateY(-5px);
            background: rgba(0, 242, 255, 0.1);
        }

        .book-cover {
            height: 250px;
            width: 100%;
            background: #111;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .book-info {
            padding: 15px;
        }

        .book-title {
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
            color: #fff;
        }

        .book-meta {
            font-size: 0.8rem;
            color: var(--data-green);
            font-family: 'Share Tech Mono', monospace;
        }

        .system-logs {
            border: 1px solid var(--border-glow);
            background: rgba(0,0,0,0.8);
            padding: 15px;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.75rem;
            height: 600px;
            overflow-y: auto;
        }

        .log-entry {
            margin-bottom: 10px;
            border-left: 2px solid var(--data-green);
            padding-left: 8px;
        }

        .log-time { color: var(--neon-blue); }
        .log-warn { color: var(--glitch-red); }

        @keyframes scan {
            0% { top: 0%; }
            100% { top: 100%; }
        }

        @keyframes flicker {
            0% { opacity: 1; }
            5% { opacity: 0.2; }
            10% { opacity: 1; }
            50% { opacity: 1; }
            55% { opacity: 0.5; }
            60% { opacity: 1; }
            100% { opacity: 1; }
        }
    </style>
</head>
<body>

    <div class="dashboard">
        <!-- Identity Header -->
        <header class="identity-card">
            <div class="operator-info">
                <div class="status-tag">&gt;&gt; SYSTEM_ACCESS_GRANTED // AUTH_LEVEL: ${operatorId || 'OPR_001'}</div>
                <h1>${displayName}</h1>
                <div style="letter-spacing: 2px; color: var(--data-green)">PRIMARY NODE: ETERNIVERSE // FRAGMENT: 001 // @${handle.toLowerCase()}</div>
            </div>
            <div class="biometric-pulse" style="text-align: right;">
                <div style="font-size: 0.8rem">NEURAL SYNC</div>
                <div style="font-size: 1.5rem; color: var(--glitch-red)">98.4%</div>
            </div>
        </header>

        <!-- Left Column: Biometrics -->
        <aside class="profile-container">
            <h2 class="section-title">SUBJECT ID</h2>
            <div class="biometric-scanner"></div>
            <ul class="stats-list">
                <li><span>COGNITIVE LOAD</span> <span>${subjectStats.cognitiveLoad || 'STABLE'}</span></li>
                <li><span>REALITY ANCHOR</span> <span>${subjectStats.realityAnchor || '77% [DEGRADING]'}</span></li>
                <li><span>PROTOCOLS</span> <span>${subjectStats.protocols || 'ACTIVE'}</span></li>
                <li><span>LOCATION</span> <span>${subjectStats.location || 'NEXUS CITY'}</span></li>
                <li><span>OBJECTIVE</span> <span>${subjectStats.objective || 'FREEDOM.EXE'}</span></li>
            </ul>
            <div style="margin-top: 30px; border: 1px solid var(--glitch-red); padding: 10px; font-size: 0.8rem; background: rgba(255,0,60,0.1)">
                <span class="log-warn">WARNING:</span> Detective interface active. System surveillance bypass initiated by Operator ${operatorId || 'OPR_001'}.
            </div>
        </aside>

        <!-- Middle Column: Library -->
        <main class="library-container">
            <h2 class="section-title">
                BIBLIOTEKA TWÓRCZOŚCI // ARCHIVES
            </h2>
            <div class="book-grid">
                ${books.map((b, i) => `
                <div class="book-card">
                    <div class="book-cover" style="background: linear-gradient(45deg, #050505, ${customHexColor}40);">
                        <div style="text-align: center; padding: 10px;">
                            <div style="font-size: 0.6rem; color: var(--glitch-red);">PROJECT 00${i + 1}</div>
                            <div style="font-family: 'Orbitron'; font-size: 1.1rem; color: #fff;">${b.title}</div>
                        </div>
                    </div>
                    <div class="book-info">
                        <span class="book-title">${b.title}</span>
                        <span class="book-meta">STATUS: IN_PROGRESS<br>GENRE: ${b.tags?.[0] || 'AI Architecture'}</span>
                    </div>
                </div>
                `).join('')}
            </div>

            <div style="margin-top: 40px;">
                <h2 class="section-title">WIZUALIZACJA RZECZYWISTOŚCI</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div style="height: 150px; background: url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=400') center/cover; border: 1px solid var(--neon-blue); filter: grayscale(1) brightness(0.5) contrast(1.2);">
                        <div style="background: rgba(0,0,0,0.7); padding: 5px; font-size: 0.7rem;">ARCHITEKTURA DANYCH</div>
                    </div>
                    <div style="height: 150px; background: url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400') center/cover; border: 1px solid var(--neon-blue); filter: grayscale(1) brightness(0.5) contrast(1.2);">
                        <div style="background: rgba(0,0,0,0.7); padding: 5px; font-size: 0.7rem;">UKRYTA WARSTWA</div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Right Column: System Terminal -->
        <aside class="system-logs">
            <h3 style="border-bottom: 1px solid var(--data-green); padding-bottom: 5px; color: var(--data-green)">LIVE_FEED</h3>
            <div class="log-entry"><span class="log-time">[12:00:01]</span> Synchronizacja z Nexus rozpoczęta...</div>
            <div class="log-entry"><span class="log-time">[12:00:45]</span> Wykryto nieautoryzowaną świadomość: ${displayName}.</div>
            <div class="log-entry"><span class="log-time">[12:01:12]</span> <span class="log-warn">ALERT:</span> System zaczyna zadawać pytania.</div>
            <div class="log-entry"><span class="log-time">[12:02:30]</span> Protokół ETERNIVERSE załadowany w 100%.</div>
            <div class="log-entry"><span class="log-time">[12:03:00]</span> Wybór użytkownika: WOLNOŚĆ.</div>
            <div class="log-entry" style="color: var(--neon-blue); font-weight: bold;">&gt;_ OCZEKIWANIE NA DECYZJĘ OPERATORA...</div>
            
            <div style="margin-top: 100px; opacity: 0.4; font-size: 0.6rem;">
                RAW_DATA_DUMP: {
                    "id": "${operatorId || 'OPR_001'}",
                    "alias": "${displayName}",
                    "status": "Awakened",
                    "location": "Deep_Grid",
                    "threat_level": "Critical"
                }
            </div>
        </aside>
    </div>

    <footer style="text-align: center; margin-top: 50px; font-family: 'Share Tech Mono'; opacity: 0.5; font-size: 0.8rem; color: var(--neon-blue);">
        &copy; 2026 ETERNIVERSE ARCHIVE // OPERATOR ${operatorId || 'OPR_001'} // SYSTEM OVERRIDE
    </footer>

</body>
</html>`;
  };

  const handleCopyHtml = () => {
    soundFx.playSuccess();
    navigator.clipboard.writeText(generateEmbedHtml());
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2500);
  };

  const handleCopyFullHtml = () => {
    soundFx.playSuccess();
    navigator.clipboard.writeText(generateFullCyberpunkHtml());
    setCopiedFullHtml(true);
    setTimeout(() => setCopiedFullHtml(false), 2500);
  };

  // Save changes locally
  useEffect(() => {
    const updated: CreatorSoulProfile = {
      handle,
      displayName,
      tagline,
      roles: selectedRoles,
      primaryAura: aura,
      backgroundMode: bgMode,
      motionStyle: motion,
      spaceLayout,
      seekingCollaborators: seekingTags,
      featuredBookId,
      bio,
      detectedDNA: calculateDetectedDNA(selectedRoles, aura, bgMode),
      isPublic,
      customHexColor,
      customSecondaryHex,
      enableScanlines,
      enableGlitchEffect,
      operatorId,
      subjectStats,
      createdAt: currentProfile?.createdAt || Date.now()
    };
    onSaveProfile(updated);
  }, [handle, displayName, tagline, selectedRoles, aura, bgMode, motion, spaceLayout, seekingTags, featuredBookId, bio, isPublic, customHexColor, customSecondaryHex, enableScanlines, enableGlitchEffect, operatorId, subjectStats]);

  const toggleRole = (role: CreatorRole) => {
    soundFx.playClick();
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter(r => r !== role));
      }
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const toggleSeekingTag = (tag: string) => {
    soundFx.playClick();
    if (seekingTags.includes(tag)) {
      setSeekingTags(seekingTags.filter(t => t !== tag));
    } else {
      setSeekingTags([...seekingTags, tag]);
    }
  };

  const handleCopyPublicUrl = () => {
    soundFx.playClick();
    const url = `https://nexusbook.io/${handle.toLowerCase().replace(/\s+/g, '')}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const detectedDNA = calculateDetectedDNA(selectedRoles, aura, bgMode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 md:p-6 overflow-hidden animate-in fade-in duration-300 font-sans select-none">
      
      {/* Background Ambient Glow matching chosen Aura */}
      <div className={`absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 ${
        aura === 'Cyber Cyan' ? 'bg-cyan-500/20' :
        aura === 'Deep Violet' ? 'bg-purple-600/20' :
        aura === 'Solar Gold' ? 'bg-amber-500/20' :
        aura === 'Crimson Energy' ? 'bg-rose-600/20' :
        aura === 'Forest Organic' ? 'bg-emerald-500/20' :
        aura === 'Arctic Glass' ? 'bg-sky-400/20' : 'bg-slate-700/20'
      }`} />

      {/* Main Container */}
      <div className="relative w-full max-w-6xl h-[92vh] bg-slate-950/95 border border-cyan-500/30 rounded-2xl shadow-[0_0_90px_rgba(0,220,255,0.2)] overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <header className="px-6 py-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
              aura === 'Cyber Cyan' ? 'from-cyan-500 to-blue-600' :
              aura === 'Deep Violet' ? 'from-purple-600 to-pink-600' :
              aura === 'Solar Gold' ? 'from-amber-400 to-orange-500' :
              aura === 'Crimson Energy' ? 'from-rose-500 to-red-600' :
              aura === 'Forest Organic' ? 'from-emerald-400 to-teal-600' : 'from-sky-300 to-indigo-500'
            } flex items-center justify-center text-white shadow-lg`}>
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white uppercase font-mono bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                  NEXUSBOOK // CREATOR SOUL ENGINE
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold">
                  CREATIVE IDENTITY
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Przestrzeń Twórcza & Autorski Kod Cyfrowy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyPublicUrl}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-xs flex items-center gap-1.5 transition-all"
              title="Kopiuj publiczny link nexusbook.io/..."
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
              <span className="text-[11px]">nexusbook.io/{handle.toLowerCase().replace(/\s+/g, '')}</span>
            </button>

            <button
              onClick={() => {
                soundFx.playModalClose();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer"
              title="Zamknij (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Navigation Bar */}
        <nav className="px-6 py-2 bg-slate-900/60 border-b border-white/10 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0 font-mono text-xs">
          {[
            { id: 'genesis', label: '1. CREATOR GENESIS', icon: User },
            { id: 'visual_dna', label: '2. VISUAL DNA ENGINE', icon: Palette },
            { id: 'space', label: '3. PUBLICATION SPACE (ROOM)', icon: Layout },
            { id: 'marketplace', label: '4. MARKETPLACE IDENTITY', icon: Users },
            { id: 'ai_curator', label: '5. AI CURATOR DNA', icon: Cpu },
            { id: 'export', label: '6. EXPORT IDENTITY CARD', icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`px-3.5 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-600/30 scale-102'
                    : 'bg-slate-900/80 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Modal Main Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-slate-950/50">
          
          {/* TAB 1: CREATOR PROFILE GENESIS */}
          {activeTab === 'genesis' && (
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Genesis Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/60 border border-cyan-500/30 text-center space-y-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold uppercase tracking-widest">
                  WELCOME TO NEXUSBOOK
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight font-mono">
                  CREATE YOUR CREATOR IDENTITY
                </h3>
                <p className="text-xs text-slate-300 max-w-lg mx-auto font-sans leading-relaxed">
                  Zdefiniuj tożsamość twórcy. Nie jesteś ograniczony do jednej roli — połącz pisarstwo, tworzenie światów, sztukę i technologię w profil hybrydowy.
                </p>
              </div>

              {/* Form Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
                
                <div className="space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-white/10">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                      Nazwa Wyświetlana (Display Name):
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs font-sans focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                      Identyfikator (Nexus Handle):
                    </label>
                    <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono">
                      <span className="text-cyan-400 font-bold">nexusbook.io/</span>
                      <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                        className="bg-transparent text-white font-mono focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                      Slogan Twórczy (Tagline):
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs font-sans focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-white/10">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                      Manifest / Bio Autora:
                    </label>
                    <textarea
                      rows={5}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-3.5 text-white text-xs font-sans focus:outline-none focus:border-cyan-400 placeholder:text-slate-600 leading-relaxed"
                    />
                  </div>
                </div>

              </div>

              {/* Roles Selection */}
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/10 space-y-4 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    KIM JESTEŚ? (WYBIERZ ROLĘ LUB PROFILE HYBRYDOWE)
                  </span>
                  <span className="text-[10px] text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/40 font-bold">
                    ZAZNACZONE: {selectedRoles.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {ALL_ROLES.map((roleObj) => {
                    const isSelected = selectedRoles.includes(roleObj.id);
                    return (
                      <button
                        key={roleObj.id}
                        onClick={() => toggleRole(roleObj.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer font-sans space-y-1 ${
                          isSelected
                            ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                            : 'bg-slate-950/60 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="font-bold text-white">{roleObj.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                        <p className="text-[10px] text-slate-400">{roleObj.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: VISUAL DNA ENGINE */}
          {activeTab === 'visual_dna' && (
            <div className="max-w-4xl mx-auto space-y-6 font-sans">
              
              <div className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-400" />
                  <span>VISUAL DNA ENGINE (KREACJA INTERFEJSU TWÓRCZOŚCI)</span>
                </div>
                <span className="text-[10px] text-cyan-400">CYBERPUNK & GATE ATMOSPHERE</span>
              </div>

              {/* AI SOUL COLOR & ATMOSPHERE COMPOSER */}
              <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-cyan-950/80 p-5 rounded-2xl border border-cyan-500/40 space-y-4 font-mono shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase">AI SOUL COLOR & GATE COMPOSER (KOMPOZYTOR ATMOSFERY)</span>
                  </div>
                  <span className="text-[10px] text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/40">GENAI ATMOSPHERE</span>
                </div>

                <p className="text-xs text-slate-300 font-sans">
                  Opisz swój klimat lub przestrzeń (np. <i>"Deszczowy cyberpunkowy detektyw"</i>, <i>"Haker Matrix w ciemnym terminalu"</i>, <i>"Kosmiczny alchemik w fiolecie"</i>), a AI samodzielnie dopasuje kolory, skanery i efekty:
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiComposerPrompt}
                    onChange={(e) => setAiComposerPrompt(e.target.value)}
                    placeholder="Wpisz klimat (np. Cyberpunk Matrix z zielonym lakierem...)"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-xs text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={() => handleAiComposeColors()}
                    disabled={isAiComposing}
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-cyan-600/30 cursor-pointer"
                  >
                    {isAiComposing ? <Sparkles className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-yellow-300" />}
                    <span>{isAiComposing ? 'STWORZONO!' : 'POKOLORUJ BRAMĘ'}</span>
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="text-slate-400">Szybkie klimaty:</span>
                  {[
                    { label: 'Cyber Matrix', prompt: 'matrix terminal' },
                    { label: 'Crimson Cyberpunk', prompt: 'crimson red' },
                    { label: 'Solar Gold Eden', prompt: 'solar gold' },
                    { label: 'Deep Void Alchemist', prompt: 'void violet' },
                  ].map((p) => (
                    <button
                      key={p.label}
                      onClick={() => handleAiComposeColors(p.prompt)}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-400 transition-colors"
                    >
                      ⚡ {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Tuning */}
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/10 space-y-4 font-mono">
                <label className="block text-xs font-bold text-white uppercase flex items-center justify-between">
                  <span>Custom RGB / Neon Color Engine (Własna Paleta Kolorów):</span>
                  <span className="text-cyan-400">{customHexColor} / {customSecondaryHex}</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-2">
                    <span className="text-[11px] text-slate-400 block">PRIMARY NEON COLOR (--neon-blue):</span>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={customHexColor} 
                        onChange={(e) => setCustomHexColor(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input 
                        type="text" 
                        value={customHexColor} 
                        onChange={(e) => setCustomHexColor(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded bg-slate-900 border border-white/10 text-xs text-white uppercase font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-2">
                    <span className="text-[11px] text-slate-400 block">GLITCH / SECONDARY ACCENT (--glitch-red):</span>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={customSecondaryHex} 
                        onChange={(e) => setCustomSecondaryHex(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input 
                        type="text" 
                        value={customSecondaryHex} 
                        onChange={(e) => setCustomSecondaryHex(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded bg-slate-900 border border-white/10 text-xs text-white uppercase font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* CRT Scanlines & Glitch Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setEnableScanlines(!enableScanlines);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                      enableScanlines 
                        ? 'bg-cyan-950/70 border-cyan-400 text-white' 
                        : 'bg-slate-950/60 border-white/5 text-slate-400'
                    }`}
                  >
                    <span>CRT SCANLINES OVERLAY (KINESKOP CRT)</span>
                    {enableScanlines ? <Check className="w-4 h-4 text-cyan-400" /> : <div className="w-4 h-4 border border-slate-600 rounded" />}
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setEnableGlitchEffect(!enableGlitchEffect);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                      enableGlitchEffect 
                        ? 'bg-purple-950/70 border-purple-400 text-white' 
                        : 'bg-slate-950/60 border-white/5 text-slate-400'
                    }`}
                  >
                    <span>CYBER GLITCH ANIMATIONS</span>
                    {enableGlitchEffect ? <Check className="w-4 h-4 text-purple-400" /> : <div className="w-4 h-4 border border-slate-600 rounded" />}
                  </button>
                </div>
              </div>

              {/* 1. Primary Aura Selector */}
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/10 space-y-3 font-mono">
                <label className="block text-xs font-bold text-white uppercase">Primary Aura Preset:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AURA_OPTIONS.map((a) => {
                    const isSelected = aura === a.id;
                    return (
                      <button
                        key={a.id}
                        onClick={() => {
                          soundFx.playClick();
                          setAura(a.id);
                        }}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-slate-800 border-white text-white shadow-xl scale-102 ring-1 ring-white'
                            : 'bg-slate-950/80 border-white/5 text-slate-400 hover:bg-slate-900 hover:text-white'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${a.gradient} ${a.glow} shadow-lg`} />
                        <span className="text-xs font-bold">{a.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Background Mode */}
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/10 space-y-3 font-mono">
                <label className="block text-xs font-bold text-white uppercase">Background Mode (Atmosphere):</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {BACKGROUND_MODES.map((bg) => {
                    const isSelected = bgMode === bg.id;
                    return (
                      <button
                        key={bg.id}
                        onClick={() => {
                          soundFx.playClick();
                          setBgMode(bg.id);
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer font-sans space-y-1 ${
                          isSelected
                            ? 'bg-purple-950/70 border-purple-400 text-white shadow-lg shadow-purple-500/20 ring-1 ring-purple-400'
                            : 'bg-slate-950/60 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-xs font-bold text-white">
                          <span>{bg.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400">{bg.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Motion Style */}
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/10 space-y-3 font-mono">
                <label className="block text-xs font-bold text-white uppercase">Motion Style (Dynamika Interfejsu):</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {MOTION_STYLES.map((m) => {
                    const isSelected = motion === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          soundFx.playClick();
                          setMotion(m.id);
                        }}
                        className={`px-3 py-2 rounded-xl border text-xs text-center font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-600 text-white border-cyan-400'
                            : 'bg-slate-950/80 text-slate-400 border-white/5 hover:bg-slate-900 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: PERSONAL PUBLICATION SPACE (INTERACTIVE SHOWCASE ROOM) */}
          {activeTab === 'space' && (
            <div className="space-y-6">
              
              {/* Showcase Title & Mode Switcher */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-black font-mono uppercase text-white tracking-wide flex items-center gap-2">
                    <span className="text-cyan-400">{handle.toUpperCase()}'S</span> NEXUS CREATOR ROOM
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    Wirtualny salon wystawowy twórczości (Wybierz układ przestrzenny)
                  </p>
                </div>

                {/* 5 Layout Mode Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar font-mono text-xs">
                  {[
                    { id: 'archive', label: 'ARCHIVE', icon: Grid },
                    { id: 'galaxy', label: 'GALAXY', icon: Globe2 },
                    { id: 'timeline', label: 'TIMELINE', icon: Clock },
                    { id: 'story', label: 'STORY PORTAL', icon: Layers },
                    { id: 'terminal', label: 'TERMINAL', icon: Terminal },
                  ].map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = spaceLayout === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => {
                          soundFx.playClick();
                          setSpaceLayout(mode.id as SoulLayoutMode);
                        }}
                        className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-white shadow-lg shadow-purple-500/30'
                            : 'bg-slate-900 text-slate-400 border-white/10 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LAYOUT RENDERER */}
              
              {/* 1. ARCHIVE MODE */}
              {spaceLayout === 'archive' && (
                <div className="space-y-4 font-sans">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-between">
                    <span>LAYOUT: ARCHIVE MODE (Klasyczny widok biblioteczny)</span>
                    <span className="text-cyan-400 font-bold">{books.length} WORK(S) PUBLISHED</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {books.map((b) => (
                      <div key={b.id} className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-cyan-400 transition-all space-y-3 group">
                        <div 
                          className={`w-full h-44 rounded-xl border border-white/10 group-hover:scale-102 transition-transform bg-gradient-to-tr ${b.coverStyle?.bgGradient || 'from-purple-900 to-cyan-900'} flex flex-col items-center justify-center text-center p-3`}
                        >
                          <span className="text-2xl">{b.coverStyle?.symbol || '⚡'}</span>
                          <span className="text-xs font-mono font-bold text-white mt-2">{b.title}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-cyan-400 uppercase">{b.tags?.[0] || 'AI Architecture'}</span>
                          <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 truncate">{b.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1">{b.shortDesc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. GALAXY MODE (Orbital Planets) */}
              {spaceLayout === 'galaxy' && (
                <div className="relative min-h-[420px] rounded-2xl bg-slate-950 border border-cyan-500/30 overflow-hidden flex flex-col items-center justify-center p-8">
                  
                  {/* Orbital Lines SVG */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <circle cx="50%" cy="50%" r="120" stroke="cyan" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                    <circle cx="50%" cy="50%" r="190" stroke="purple" strokeWidth="1" fill="none" />
                  </svg>

                  {/* Core Author Sun */}
                  <div className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-tr from-purple-600 via-cyan-400 to-amber-300 flex flex-col items-center justify-center text-center p-2 shadow-[0_0_60px_rgba(0,220,255,0.4)] animate-pulse">
                    <span className="text-xs font-black font-mono text-white uppercase tracking-wider">{displayName}</span>
                    <span className="text-[9px] font-mono text-slate-900 font-bold uppercase mt-1">CORE NEXUS</span>
                  </div>

                  {/* Orbiting Planetary Books */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {books.slice(0, 5).map((b, idx) => {
                      const angles = [0, 72, 144, 216, 288];
                      const radius = 160;
                      const rad = (angles[idx % angles.length] * Math.PI) / 180;
                      const x = Math.cos(rad) * radius;
                      const y = Math.sin(rad) * radius;

                      return (
                        <div
                          key={b.id}
                          style={{ transform: `translate(${x}px, ${y}px)` }}
                          className="absolute z-20 flex flex-col items-center cursor-pointer group hover:scale-110 transition-all duration-300"
                        >
                          <div className={`w-12 h-12 rounded-full border-2 border-cyan-400 shadow-lg shadow-cyan-400/30 overflow-hidden bg-gradient-to-tr ${b.coverStyle?.bgGradient || 'from-purple-900 to-cyan-900'} flex items-center justify-center text-white text-xs font-bold`}>
                            {b.coverStyle?.symbol || '⚡'}
                          </div>
                          <span className="mt-1.5 px-2 py-0.5 rounded bg-slate-900/90 border border-white/20 text-[10px] font-mono text-white font-bold truncate max-w-[120px] shadow-md group-hover:text-cyan-300">
                            {b.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="absolute bottom-4 left-4 font-mono text-[10px] text-cyan-400">
                    GALAXY MODE // Dzieła krążące po orbicie twórcy
                  </div>
                </div>
              )}

              {/* 3. TIMELINE MODE */}
              {spaceLayout === 'timeline' && (
                <div className="space-y-6 font-sans max-w-3xl mx-auto">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-between">
                    <span>LAYOUT: TIMELINE MODE (Chronologia Tworzenia)</span>
                    <span className="text-purple-400 font-bold">2024 — 2026</span>
                  </div>

                  <div className="relative border-l-2 border-purple-500/40 ml-4 pl-6 space-y-8 font-mono">
                    {books.map((b, i) => (
                      <div key={b.id} className="relative group">
                        <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-purple-500 border-2 border-slate-950 group-hover:bg-cyan-400 transition-colors" />
                        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 group-hover:border-purple-400 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className={`w-16 h-20 rounded-lg border border-white/10 shrink-0 bg-gradient-to-tr ${b.coverStyle?.bgGradient || 'from-purple-900 to-cyan-900'} flex items-center justify-center text-white font-bold text-lg`}>
                            {b.coverStyle?.symbol || '⚡'}
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-purple-400 font-bold">ROK {b.year || (2025 + i)} // CHRONO NODE #{i + 1}</span>
                            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300">{b.title}</h4>
                            <p className="text-xs text-slate-400 font-sans">{b.shortDesc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. STORY PORTAL MODE */}
              {spaceLayout === 'story' && (
                <div className="space-y-6 font-sans">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-between">
                    <span>LAYOUT: STORY PORTAL MODE (Portale Uniwersów)</span>
                    <span className="text-pink-400 font-bold">ENTER WORLD ENGINE</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {books.slice(0, 2).map((b) => (
                      <div key={b.id} className="relative p-6 rounded-2xl bg-slate-900/90 border border-purple-500/30 overflow-hidden space-y-4 group hover:border-pink-400 transition-all">
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="px-2.5 py-1 rounded bg-pink-950 text-pink-300 border border-pink-500/40 font-bold">
                            WORLD PORTAL
                          </span>
                          <span className="text-slate-400 text-[10px]">{b.tags?.[0] || 'AI Architecture'}</span>
                        </div>

                        <div className="flex gap-4 items-center">
                          <div className={`w-24 h-32 rounded-xl border border-white/10 shrink-0 shadow-xl bg-gradient-to-tr ${b.coverStyle?.bgGradient || 'from-purple-900 to-cyan-900'} flex items-center justify-center text-white text-2xl font-bold`}>
                            {b.coverStyle?.symbol || '⚡'}
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-lg font-bold text-white group-hover:text-pink-300">{b.title}</h4>
                            <p className="text-xs text-slate-300 line-clamp-2">{b.shortDesc}</p>
                            
                            <div className="flex items-center gap-2 pt-2 text-[10px] font-mono text-cyan-300">
                              <span className="px-2 py-0.5 rounded bg-slate-800">World Map</span>
                              <span className="px-2 py-0.5 rounded bg-slate-800">Lore</span>
                              <span className="px-2 py-0.5 rounded bg-slate-800">Characters</span>
                            </div>
                          </div>
                        </div>

                        <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30">
                          <span>ENTER WORLD PORTAL</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. TERMINAL MODE (ETERNIVERSE CYBER OPERATOR) */}
              {spaceLayout === 'terminal' && (
                <div className="rounded-2xl bg-[#050505] border border-cyan-500/50 p-6 space-y-6 font-mono text-cyan-400 shadow-[0_0_50px_rgba(0,242,255,0.15)] relative overflow-hidden">
                  
                  {/* CRT Scanline effect overlay if enabled */}
                  {enableScanlines && (
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(0,20,30,0.4)_0%,rgba(5,5,5,0.9)_100%)] opacity-80" />
                  )}

                  {/* Identity Header */}
                  <div className="relative z-10 p-5 rounded-xl bg-slate-950/80 border-l-4 border-cyan-400 border-y border-r border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-[11px] text-red-500 font-bold tracking-widest animate-pulse">
                        &gt;&gt; SYSTEM_ACCESS_GRANTED // AUTH_LEVEL: {operatorId || 'OPR_001'}
                      </div>
                      <h2 className="text-2xl font-black text-white tracking-widest uppercase font-mono drop-shadow-[0_0_10px_rgba(0,242,255,0.8)]">
                        {displayName}
                      </h2>
                      <div className="text-[11px] text-emerald-400 tracking-wider">
                        PRIMARY NODE: ETERNIVERSE // FRAGMENT: 001 // @{handle.toLowerCase()}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">NEURAL SYNC</div>
                      <div className="text-xl font-bold text-red-500 animate-pulse">98.4%</div>
                    </div>
                  </div>

                  {/* 3-Column Operator Layout */}
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left Column: Biometrics */}
                    <div className="lg:col-span-4 p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-4">
                      <div className="border-b border-cyan-500/30 pb-2 text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                        <span>SUBJECT ID</span>
                        <span className="text-red-500 text-[10px]">OPERATOR #{operatorId}</span>
                      </div>

                      {/* Biometric Laser Scanner Box */}
                      <div className="relative w-full h-56 rounded-lg overflow-hidden border border-cyan-400/50 bg-slate-900 group">
                        <img 
                          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400" 
                          alt="Biometric scanner" 
                          className="w-full h-full object-cover grayscale contrast-125 sepia hue-rotate-140"
                        />
                        {/* Laser Line */}
                        <div className="absolute inset-x-0 h-0.5 bg-cyan-400 shadow-[0_0_15px_#00f2ff] animate-ping" />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[9px] text-cyan-300">
                          SCANNER: ACTIVE
                        </div>
                      </div>

                      {/* Stats List */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-slate-400">COGNITIVE LOAD</span>
                          <span className="text-cyan-300 font-bold">{subjectStats.cognitiveLoad || 'STABLE'}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-slate-400">REALITY ANCHOR</span>
                          <span className="text-amber-400 font-bold">{subjectStats.realityAnchor || '77% [DEGRADING]'}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-slate-400">PROTOCOLS</span>
                          <span className="text-emerald-400 font-bold">{subjectStats.protocols || 'ACTIVE'}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-slate-400">LOCATION</span>
                          <span className="text-cyan-300">{subjectStats.location || 'NEXUS CITY'}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-slate-400">OBJECTIVE</span>
                          <span className="text-red-400 font-bold">{subjectStats.objective || 'FREEDOM.EXE'}</span>
                        </div>
                      </div>

                      {/* Warning box */}
                      <div className="p-3 rounded-lg border border-red-500/40 bg-red-950/20 text-[10px] text-red-300 leading-relaxed">
                        <span className="font-bold text-red-500">WARNING:</span> Detective interface active. System surveillance bypass initiated by Operator {operatorId}.
                      </div>
                    </div>

                    {/* Middle Column: Library Archives */}
                    <div className="lg:col-span-8 p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-4">
                      <div className="border-b border-cyan-500/30 pb-2 text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                        <span>BIBLIOTEKA TWÓRCZOŚCI // ARCHIVES</span>
                        <span className="text-cyan-400 text-[10px]">{books.length} WORK(S) REGISTERED</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {books.map((b, i) => (
                          <div 
                            key={b.id} 
                            className="p-3.5 rounded-xl border border-cyan-500/20 bg-slate-900/60 hover:border-cyan-400 hover:bg-slate-900 transition-all space-y-2 group"
                          >
                            <div className="h-32 rounded-lg bg-gradient-to-tr from-black via-slate-900 to-cyan-950 p-3 border border-white/10 flex flex-col justify-between relative overflow-hidden">
                              <span className="text-[9px] text-red-400 font-bold">PROJECT 00{i + 1}</span>
                              <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors font-mono">
                                {b.title}
                              </div>
                              <span className="text-[9px] text-emerald-400">{b.tags?.[0] || 'AI Architecture'}</span>
                            </div>

                            <div className="space-y-1 text-xs">
                              <span className="font-bold text-white truncate block">{b.title}</span>
                              <div className="text-[10px] text-emerald-400">
                                STATUS: IN_PROGRESS<br />
                                GENRE: {b.tags?.[0] || 'AI Architecture'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Reality Visualizer */}
                      <div className="pt-4 border-t border-white/10 space-y-2">
                        <span className="text-xs font-bold text-white uppercase">WIZUALIZACJA RZECZYWISTOŚCI:</span>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="h-28 rounded-xl bg-[url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center border border-cyan-400/40 p-2 text-[10px] text-cyan-300 font-bold flex items-end">
                            <span className="bg-black/80 px-2 py-0.5 rounded">ARCHITEKTURA DANYCH</span>
                          </div>
                          <div className="h-28 rounded-xl bg-[url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center border border-cyan-400/40 p-2 text-[10px] text-cyan-300 font-bold flex items-end">
                            <span className="bg-black/80 px-2 py-0.5 rounded">UKRYTA WARSTWA</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 4: MARKETPLACE IDENTITY */}
          {activeTab === 'marketplace' && (
            <div className="max-w-4xl mx-auto space-y-6 font-sans">
              
              <div className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
                <Users className="w-4 h-4 text-pink-400" />
                <span>CREATOR MARKETPLACE IDENTITY ("SZUKAM LUDZI DO:")</span>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/10 space-y-4 font-mono">
                <p className="text-xs text-slate-300 font-sans">
                  Zaznacz w jakich obszarach poszukujesz partnerów lub wykonawców. Opcje będą publicznie widoczne na Twojej wizytówce twórcy.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {COLLABORATION_TAGS.map((tag) => {
                    const isSelected = seekingTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleSeekingTag(tag)}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer font-mono ${
                          isSelected
                            ? 'bg-pink-950/70 border-pink-400 text-white shadow-lg shadow-pink-500/20'
                            : 'bg-slate-950/60 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <span>☑ {tag}</span>
                        {isSelected && <Check className="w-4 h-4 text-pink-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Public Badge Preview */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-purple-950/60 border border-pink-500/30 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-pink-300 uppercase">PODGLĄD PUBLICZNEJ KARTY KOOPERACJI</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    COLLABORATIONS: OPEN
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-white">{displayName} (@{handle})</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {seekingTags.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-full bg-pink-950/90 text-pink-200 border border-pink-500/40 text-[11px]">
                        Szuka: {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: AI CURATOR DNA */}
          {activeTab === 'ai_curator' && (
            <div className="max-w-4xl mx-auto space-y-6 font-sans">
              
              <div className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>PERSONAL AI CURATOR // DETECTED CREATIVE DNA</span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-5 font-mono">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-lg">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] text-cyan-400 uppercase font-bold">CYFROWA ANALIZA PROFILE</span>
                    <h3 className="text-lg font-black text-white">{detectedDNA.archetype}</h3>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2 text-xs font-sans text-slate-300 leading-relaxed">
                  <p className="font-bold text-cyan-300 font-mono uppercase">Rekomendacje Ewolucji Przestrzeni:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {detectedDNA.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setBgMode('Glass Universe');
                    setAura('Cyber Cyan');
                    setMotion('Soft Flow');
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30"
                >
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span>ZASTOSUJ REKOMENDOWANĄ EWOLUCJĘ (APPLY EVOLUTION)</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 6: EXPORT PROFILE & CARD */}
          {activeTab === 'export' && (
            <div className="max-w-3xl mx-auto space-y-6 font-sans">
              
              <div className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>PUBLICZNA KARTA TWÓRCY & EXPORT</span>
              </div>

              {/* Sharable Card Box */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950 border-2 border-cyan-500/40 shadow-[0_0_80px_rgba(0,220,255,0.25)] space-y-6 font-mono text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 px-6 py-2 bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-bl-2xl">
                  NEXUSBOOK IDENTITY CARD
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-xl">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{displayName}</h3>
                    <p className="text-xs text-cyan-300">nexusbook.io/{handle.toLowerCase()}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2 font-sans">
                      {selectedRoles.map(r => (
                        <span key={r} className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-slate-200">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs font-sans text-slate-300 leading-relaxed italic border-l-2 border-cyan-400 pl-3">
                  "{tagline}"
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="block text-[10px] text-slate-400">PROJECTS</span>
                    <span className="text-lg font-black text-cyan-300">{books.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="block text-[10px] text-slate-400">AURA</span>
                    <span className="text-xs font-bold text-purple-300">{aura}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="block text-[10px] text-slate-400">COLLABORATION</span>
                    <span className="text-xs font-bold text-emerald-400">OPEN ({seekingTags.length})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-[10px] text-slate-400">
                  <span>NEXUSBOOK CREATOR SOUL ENGINE</span>
                  <span>VERIFIED IDENTITY</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopyPublicUrl}
                  className="flex-1 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'SKOPIOWANO LINK!' : 'KOPIUJ PUBLICZNY LINK (NEXUSBOOK.IO)'}</span>
                </button>

                <button
                  onClick={handleCopyFullHtml}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all cursor-pointer ring-1 ring-cyan-400"
                >
                  {copiedFullHtml ? <Check className="w-4 h-4 text-emerald-300" /> : <Terminal className="w-4 h-4 text-yellow-300" />}
                  <span>{copiedFullHtml ? 'SKOPIOWANO KOD BRAMY (FULL HTML5)!' : 'KOPIUJ PEŁNY KOD BRAMY (STANDALONE HTML5)'}</span>
                </button>
              </div>

              {/* HTML Snippet Preview Box */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>STANDALONE CYBERPUNK GATE HTML5 TEMPLATE PREVIEW</span>
                  <span>STANDALONE HTML5 + SCANLINES + BIOMETRICS</span>
                </div>
                <pre className="p-3 rounded-lg bg-slate-900 overflow-x-auto text-[10px] text-cyan-300 border border-slate-800 leading-relaxed max-h-40">
                  {generateFullCyberpunkHtml()}
                </pre>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <footer className="px-6 py-3 bg-slate-900/80 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>NEXUSBOOK CREATOR SOUL ENGINE // ACTIVE</span>
          </div>
          <button
            onClick={() => {
              soundFx.playModalClose();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors cursor-pointer"
          >
            ZAPISZ I ZAMKNIJ
          </button>
        </footer>

      </div>

    </div>
  );
};

function calculateDetectedDNA(roles: CreatorRole[], aura: AuraColor, bgMode: BackgroundMode) {
  const isAI = roles.includes('AI Architect');
  const isWriter = roles.includes('Writer');
  const isWorldBuilder = roles.includes('World Builder');
  const isTech = roles.includes('Developer') || roles.includes('Researcher');
  const isArtist = roles.includes('Artist') || roles.includes('Designer');
  const isEducator = roles.includes('Educator');

  let archetype = 'Hybrid Creative Architect';

  if (isWriter && isAI && isWorldBuilder) {
    archetype = 'Cybernetic World Author';
  } else if (isWriter && isAI) {
    archetype = 'Neural Narrative Architect';
  } else if (isTech && isWriter) {
    archetype = 'Cybernetic Author & World Architect';
  } else if (isArtist && isAI) {
    archetype = 'Algorithmic Visual Designer';
  } else if (isEducator && isWriter) {
    archetype = 'Wisdom Knowledge Architect';
  } else if (isWorldBuilder && isArtist) {
    archetype = 'Cosmic Landscape Master';
  } else if (isWriter) {
    archetype = 'Atmospheric World Storyteller';
  } else if (isTech) {
    archetype = 'Systems & Technology Architect';
  }

  return {
    archetype,
    recommendedStyle: `${aura} + ${bgMode}`,
    recommendations: [
      `Używaj układu space mode "Galaxy" lub "Story Portal" do prezentacji uniwersów.`,
      `Skonfiguruj tagi współpracowników w zakładce Marketplace Identity.`,
      `Włącz animację motion "${bgMode}" w celach budowania głębi wizualnej.`
    ]
  };
}
