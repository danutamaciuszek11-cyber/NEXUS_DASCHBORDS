import React, { useState, useEffect } from 'react';
import { NexusProvider, useNexus } from './context/NexusContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BellaOverlay } from './components/BellaOverlay';
import { OnboardingModal } from './components/OnboardingModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { MissionDetailModal } from './components/MissionDetailModal';
import { BrotherhoodNodeModal } from './components/BrotherhoodNodeModal';
import { NewProjectModal } from './components/NewProjectModal';
import { NewMissionModal } from './components/NewMissionModal';
import { NewPostModal } from './components/NewPostModal';
import { NewDocModal } from './components/NewDocModal';
import { ArchitectProfileModal } from './components/ArchitectProfileModal';
import { ArchitectProfileEditorModal } from './components/ArchitectProfileEditorModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { NexusAuthLanding } from './components/NexusAuthLanding';
import { GitHubIntegrationModal } from './components/GitHubIntegrationModal';
import { NeuralInterfaceBridgeModal } from './components/NeuralInterfaceBridgeModal';
import { ChronicleOfEterniverseModal } from './components/ChronicleOfEterniverseModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { PanelLeftOpen } from 'lucide-react';

import { DashboardView } from './views/DashboardView';
import { BellaView } from './views/BellaView';
import { BrotherhoodView } from './views/BrotherhoodView';
import { NeuralMapView } from './views/NeuralMapView';
import { WorldsView } from './views/WorldsView';
import { ProjectsView } from './views/ProjectsView';
import { MissionsView } from './views/MissionsView';
import { MemoryView } from './views/MemoryView';
import { FeedView } from './views/FeedView';
import { AICouncilView } from './views/AICouncilView';
import { RoomsView } from './views/RoomsView';
import { ArchitectsView } from './views/ArchitectsView';
import { GenesisView } from './views/GenesisView';
import { CodeView } from './views/CodeView';
import { RequestAccessView } from './views/RequestAccessView';
import { AdminView } from './views/AdminView';
import { AuditTrail } from './components/AuditTrail';

const MainLayout: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isSidebarOpen,
    toggleSidebar,
    isCheatSheetOpen,
    setIsCheatSheetOpen,
    toggleCheatSheet,
    showBellaOverlay,
    setShowBellaOverlay,
    language,
    setLanguage,
    soundEnabled,
    setSoundEnabled,
    playCyberSound,
    triggerHaptic,
    activeBrotherhoodNodeId,
    setActiveBrotherhoodNodeId,
    activeProjectId,
    setActiveProjectId,
    activeMissionId,
    setActiveMissionId,
    activeArchitectModalId,
    setActiveArchitectModalId,
    isProfileEditorOpen,
    setIsProfileEditorOpen,
    editingArchitect,
    setEditingArchitect,
    showNotificationsDrawer,
    setShowNotificationsDrawer
  } = useNexus();

  // Modals state
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewMissionModalOpen, setIsNewMissionModalOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);

  // Global Copy Event Handler for subtle Audio & Haptic Feedback on Ctrl+C / Clipboard Copy
  useEffect(() => {
    const handleCopy = () => {
      const selectedText = window.getSelection()?.toString();
      if (selectedText && selectedText.length > 0) {
        playCyberSound('click');
        triggerHaptic();
      }
    };
    window.addEventListener('copy', handleCopy);
    return () => window.removeEventListener('copy', handleCopy);
  }, [playCyberSound, triggerHaptic]);

  // Global Keyboard Shortcuts Matrix
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      // Escape: Dismiss active overlays or modals
      if (e.key === 'Escape') {
        if (isCheatSheetOpen) {
          e.preventDefault();
          setIsCheatSheetOpen(false);
          playCyberSound('click');
          return;
        }
        if (showNotificationsDrawer) {
          e.preventDefault();
          setShowNotificationsDrawer(false);
          playCyberSound('click');
          return;
        }
        if (showBellaOverlay) {
          e.preventDefault();
          setShowBellaOverlay(false);
          return;
        }
        if (activeBrotherhoodNodeId) {
          e.preventDefault();
          setActiveBrotherhoodNodeId(null);
          playCyberSound('click');
          return;
        }
        if (activeProjectId) {
          e.preventDefault();
          setActiveProjectId(null);
          playCyberSound('click');
          return;
        }
        if (activeMissionId) {
          e.preventDefault();
          setActiveMissionId(null);
          playCyberSound('click');
          return;
        }
        if (activeArchitectModalId) {
          e.preventDefault();
          setActiveArchitectModalId(null);
          playCyberSound('click');
          return;
        }
        if (isProfileEditorOpen) {
          e.preventDefault();
          setIsProfileEditorOpen(false);
          return;
        }
        if (isNewProjectModalOpen) {
          e.preventDefault();
          setIsNewProjectModalOpen(false);
          return;
        }
        if (isNewMissionModalOpen) {
          e.preventDefault();
          setIsNewMissionModalOpen(false);
          return;
        }
        if (isNewPostModalOpen) {
          e.preventDefault();
          setIsNewPostModalOpen(false);
          return;
        }
        if (isNewDocModalOpen) {
          e.preventDefault();
          setIsNewDocModalOpen(false);
          return;
        }
      }

      // Cheat Sheet Matrix Overlay: ? or Shift + / or Ctrl+/ or Cmd+/
      if (
        (e.key === '?' && !isEditable) ||
        ((e.ctrlKey || e.metaKey) && e.key === '/')
      ) {
        e.preventDefault();
        toggleCheatSheet();
        playCyberSound('click');
        triggerHaptic();
        return;
      }

      // Sidebar Toggle: Ctrl+B / Cmd+B
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
        playCyberSound('click');
        triggerHaptic();
        return;
      }

      // State Bella AI Overlay: Ctrl+Space or Cmd+K
      if (
        ((e.ctrlKey || e.metaKey) && (e.code === 'Space' || e.key.toLowerCase() === 'k'))
      ) {
        e.preventDefault();
        setShowBellaOverlay(!showBellaOverlay);
        playCyberSound('synapse');
        triggerHaptic();
        return;
      }

      // Allow all native system Ctrl / Cmd keyboard shortcuts (e.g., Ctrl+C for copy, Ctrl+V, Ctrl+A, Ctrl+X)
      if (e.ctrlKey || e.metaKey) return;

      // If user is currently typing in an input/textarea, prevent single-key navigation
      if (isEditable) return;

      // Single Key or Alt + Key Navigation
      const key = e.key.toLowerCase();
      const withAlt = e.altKey;

      switch (key) {
        // FEED (Builder Feed)
        case 'f':
          e.preventDefault();
          setCurrentView('FEED');
          playCyberSound('click');
          triggerHaptic();
          break;

        // MISSIONS (Tablica Misji)
        case 'm':
          e.preventDefault();
          setCurrentView('MISSIONS');
          playCyberSound('click');
          triggerHaptic();
          break;

        // MAP (Family Neural Map)
        case 'n':
          e.preventDefault();
          setCurrentView('MAP');
          playCyberSound('node');
          triggerHaptic();
          break;

        // DASHBOARD (Centrum Operacji)
        case 'd':
          e.preventDefault();
          setCurrentView('DASHBOARD');
          playCyberSound('click');
          triggerHaptic();
          break;

        // PROJECTS (Hub Projektów)
        case 'p':
          e.preventDefault();
          setCurrentView('PROJECTS');
          playCyberSound('click');
          triggerHaptic();
          break;

        // MEMORY (Nexus Memory & RFCs)
        case 'r':
          e.preventDefault();
          setCurrentView('MEMORY');
          playCyberSound('click');
          triggerHaptic();
          break;

        // AI COUNCIL (Rada AI)
        case 'c':
          e.preventDefault();
          setCurrentView('AI_COUNCIL');
          playCyberSound('synapse');
          triggerHaptic();
          break;

        // WORLDS (Światy Nexusa)
        case 'w':
          e.preventDefault();
          setCurrentView('WORLDS');
          playCyberSound('click');
          triggerHaptic();
          break;

        // BELLA (State Bella AI View)
        case 'b':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setCurrentView('BELLA');
            playCyberSound('synapse');
            triggerHaptic();
          }
          break;

        // CODE (Kodeks Architekta)
        case 'k':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setCurrentView('CODE');
            playCyberSound('click');
            triggerHaptic();
          }
          break;

        // ROOMS (Pokoje Współpracy)
        case 'e':
          e.preventDefault();
          setCurrentView('ROOMS');
          playCyberSound('click');
          triggerHaptic();
          break;

        // ARCHITECTS (Katalog Architektów)
        case 'u':
          e.preventDefault();
          setCurrentView('ARCHITECTS');
          playCyberSound('node');
          triggerHaptic();
          break;

        // GENESIS (Genesis Timeline)
        case 'g':
          e.preventDefault();
          setCurrentView('GENESIS');
          playCyberSound('click');
          triggerHaptic();
          break;

        // Quick Language Toggle
        case 'l':
          if (!withAlt && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setLanguage(language === 'PL' ? 'EN' : 'PL');
            playCyberSound('click');
            triggerHaptic();
          }
          break;

        // Quick Audio FX Toggle
        case 's':
          if (!withAlt && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setSoundEnabled(!soundEnabled);
            triggerHaptic();
          }
          break;

        // Global Search Focus
        case '/':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            const searchInput = document.getElementById('global-search-input') as HTMLInputElement | null;
            searchInput?.focus();
            playCyberSound('click');
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    setCurrentView,
    toggleSidebar,
    isCheatSheetOpen,
    setIsCheatSheetOpen,
    toggleCheatSheet,
    showBellaOverlay,
    setShowBellaOverlay,
    activeBrotherhoodNodeId,
    setActiveBrotherhoodNodeId,
    activeProjectId,
    setActiveProjectId,
    activeMissionId,
    setActiveMissionId,
    activeArchitectModalId,
    setActiveArchitectModalId,
    isProfileEditorOpen,
    isNewProjectModalOpen,
    isNewMissionModalOpen,
    isNewPostModalOpen,
    isNewDocModalOpen,
    language,
    setLanguage,
    soundEnabled,
    setSoundEnabled,
    playCyberSound,
    triggerHaptic
  ]);

  const renderActiveView = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <DashboardView />;
      case 'BELLA':
        return <BellaView />;
      case 'BROTHERHOOD':
        return <BrotherhoodView />;
      case 'MAP':
      case 'NEURAL_MAP':
        return <NeuralMapView />;
      case 'WORLDS':
        return <WorldsView />;
      case 'PROJECTS':
        return <ProjectsView onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)} />;
      case 'MISSIONS':
        return <MissionsView onOpenNewMissionModal={() => setIsNewMissionModalOpen(true)} />;
      case 'MEMORY':
        return <MemoryView onOpenNewDocModal={() => setIsNewDocModalOpen(true)} />;
      case 'FEED':
        return <FeedView onOpenNewPostModal={() => setIsNewPostModalOpen(true)} />;
      case 'AI_COUNCIL':
        return <AICouncilView />;
      case 'ROOMS':
        return <RoomsView />;
      case 'ARCHITECTS':
        return <ArchitectsView />;
      case 'GENESIS':
        return <GenesisView />;
      case 'CODE':
        return <CodeView />;
      case 'REQUEST_ACCESS':
        return <RequestAccessView />;
      case 'ADMIN':
        return <AdminView />;
      case 'AUDIT':
        return <AuditTrail />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#06080e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top HUD Navigation */}
      <Navbar />

      {/* Main Body Grid with smooth sidebar width adaptation */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Cyber Sidebar (slide-out / collapsible) */}
        <Sidebar />

        {/* Floating Quick Open Button when Sidebar is Hidden on Desktop */}
        {!isSidebarOpen && (
          <button
            id="floating-sidebar-open-btn"
            onClick={() => {
              toggleSidebar();
              playCyberSound('click');
              triggerHaptic();
            }}
            className="hidden lg:flex fixed left-4 top-20 z-30 items-center gap-2 px-3 py-1.5 rounded-xl bg-[#080b11]/95 border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 hover:bg-cyan-950/70 shadow-[0_0_20px_rgba(0,240,255,0.25)] backdrop-blur-md text-xs font-cyber tracking-wider transition-all duration-200 group animate-in fade-in slide-in-from-left-4"
            title={language === 'PL' ? 'Wysuń menu boczne (Ctrl+B)' : 'Expand Sidebar (Ctrl+B)'}
          >
            <PanelLeftOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>{language === 'PL' ? 'Pokaż menu' : 'Open Menu'}</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-900/50 text-cyan-400 font-mono-tech border border-cyan-500/30">
              ⌘B
            </span>
          </button>
        )}

        {/* Dynamic Center Stage View */}
        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 transition-all duration-300 ease-out ${
            isSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'
          }`}
        >
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Overlays & Modals */}
      <BellaOverlay />
      <KeyboardShortcutsModal />
      <OnboardingModal />
      <ProjectDetailModal />
      <MissionDetailModal />
      <BrotherhoodNodeModal />
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
      <NewMissionModal
        isOpen={isNewMissionModalOpen}
        onClose={() => setIsNewMissionModalOpen(false)}
      />
      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
      />
      <NewDocModal
        isOpen={isNewDocModalOpen}
        onClose={() => setIsNewDocModalOpen(false)}
      />
      <ArchitectProfileModal
        architectId={activeArchitectModalId}
        isOpen={Boolean(activeArchitectModalId)}
        onClose={() => setActiveArchitectModalId(null)}
        onEdit={(arch) => {
          setActiveArchitectModalId(null);
          setEditingArchitect(arch);
          setIsProfileEditorOpen(true);
        }}
      />
      <ArchitectProfileEditorModal
        architectToEdit={editingArchitect}
        isOpen={isProfileEditorOpen}
        onClose={() => {
          setIsProfileEditorOpen(false);
          setEditingArchitect(null);
        }}
        onSaved={(arch) => {
          setActiveArchitectModalId(arch.id);
        }}
      />
      <GitHubIntegrationModal />
      <NeuralInterfaceBridgeModal />
      <ChronicleOfEterniverseModal />
      <NotificationsDrawer />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useNexus();

  if (!isAuthenticated) {
    return <NexusAuthLanding />;
  }

  return <MainLayout />;
};

export function NexusFamilyPortal() {
  return (
    <NexusProvider>
      <AppContent />
    </NexusProvider>
  );
}

export default NexusFamilyPortal;
