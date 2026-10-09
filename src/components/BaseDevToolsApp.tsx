import React, { useState, useEffect } from 'react';
import { NexusHeader } from './base-dev-tools/NexusHeader';
import { NexusProver } from './base-dev-tools/NexusProver';
import { NexusSwarm } from './base-dev-tools/NexusSwarm';
import { NexusNodes } from './base-dev-tools/NexusNodes';
import { NexusRewards } from './base-dev-tools/NexusRewards';
import { NexusZkVM } from './base-dev-tools/NexusZkVM';
import { NexusSimulator } from './base-dev-tools/NexusSimulator';
import { NexusNetwork } from './base-dev-tools/NexusNetwork';
import { NexusProfile } from './base-dev-tools/NexusProfile';
import { AethelAssistant } from './base-dev-tools/AethelAssistant';
import { NexusTab, Language, UserProfile, DEFAULT_NEXUS_PROFILE } from '../types/base-dev-tools';
import { Cpu, ShieldCheck, Globe, Terminal, Sparkles } from 'lucide-react';

const POINTS_STORAGE_KEY = 'nxl_nexus_user_points';
const PROFILE_STORAGE_KEY = 'nxl_nexus_user_profile';

export function BaseDevToolsApp() {
  const [activeTab, setActiveTab] = useState<NexusTab>('prover');
  const [lang, setLang] = useState<Language>('pl');

  const [userPoints, setUserPoints] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(POINTS_STORAGE_KEY);
      if (stored) return parseFloat(stored);
    } catch (e) {
      console.error(e);
    }
    return 148290.5;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_NEXUS_PROFILE;
  });

  // Save points to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem(POINTS_STORAGE_KEY, userPoints.toString());
    } catch (e) {
      console.error(e);
    }
  }, [userPoints]);

  const handleProofGenerated = (points: number, cycles: number) => {
    setUserPoints(prev => {
      const updated = prev + points;
      return parseFloat(updated.toFixed(1));
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-cyan-500 selection:text-neutral-950">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))]" />

      {/* Top Nexus Navigation */}
      <NexusHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        userProfile={userProfile}
        userPoints={userPoints}
      />

      {/* Main Content Area */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {activeTab === 'prover' && (
          <NexusProver
            lang={lang}
            onProofGenerated={handleProofGenerated}
            userPoints={userPoints}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'swarm' && (
          <NexusSwarm
            lang={lang}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'nodes' && (
          <NexusNodes lang={lang} />
        )}

        {activeTab === 'rewards' && (
          <NexusRewards
            lang={lang}
            userPoints={userPoints}
          />
        )}

        {activeTab === 'zkvm' && (
          <NexusZkVM lang={lang} />
        )}

        {activeTab === 'simulator' && (
          <NexusSimulator 
            lang={lang} 
            defaultFromAddress={userProfile.walletAddress}
          />
        )}

        {activeTab === 'network' && (
          <NexusNetwork lang={lang} />
        )}

        {activeTab === 'profile' && (
          <NexusProfile
            lang={lang}
            onProfileUpdated={setUserProfile}
            userPoints={userPoints}
          />
        )}
      </main>

      {/* Futuristic Status Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950/80 text-neutral-500 text-xs font-mono py-8 px-4 sm:px-6 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-300 font-semibold">NXL NEXUS CONSENSUS: STABLE</span>
            <span>·</span>
            <span>EPOCH #14</span>
            <span>·</span>
            <span>zkVM RISC-V 3.4.1</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-neutral-400">
            <span className="hover:text-cyan-400 transition-colors cursor-pointer" onClick={() => setActiveTab('network')}>
              Telemetry Explorer
            </span>
            <span className="hover:text-cyan-400 transition-colors cursor-pointer" onClick={() => setActiveTab('zkvm')}>
              Verifiable zkVM
            </span>
            <span className="hover:text-cyan-400 transition-colors cursor-pointer" onClick={() => setActiveTab('rewards')}>
              Airdrop Allocation
            </span>
            <span className="text-neutral-600">
              © 2026 NXL Nexus Network
            </span>
          </div>
        </div>
      </footer>

      {/* AETHEL - Autonomous Administrative Unit & Quantum Navigator */}
      <AethelAssistant
        currentTab={activeTab}
        onNavigateTab={setActiveTab}
        lang={lang}
      />
    </div>
  );
}

