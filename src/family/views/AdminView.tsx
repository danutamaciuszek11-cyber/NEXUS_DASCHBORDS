import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Radio,
  Send,
  Sparkles,
  Award,
  KeyRound,
  FileText,
  Activity,
  Layers,
  Flame,
  ShieldCheck,
  Cpu,
  Server
} from 'lucide-react';
import { UserRole } from '../types';
import { AuditTrail } from '../components/AuditTrail';

type AdminTab = 'AUDIT' | 'REQUESTS' | 'BROADCAST' | 'METRICS';

export const AdminView: React.FC = () => {
  const {
    accessRequests,
    reviewAccessRequest,
    currentRole,
    setCurrentRole,
    worlds,
    projects,
    missions,
    architects,
    memoryDocs,
    auditLogs,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const [activeTab, setActiveTab] = useState<AdminTab>('AUDIT');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const pendingRequests = accessRequests.filter(r => r.status === 'PENDING');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setBroadcastSent(true);
    playCyberSound('beep');
    triggerHaptic();
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMessage('');
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Admin Header HUD */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#0a0f1d] to-cyan-950/40 border border-red-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-950/80 border-2 border-red-400 text-red-300 shadow-[0_0_25px_rgba(239,68,68,0.4)]">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-cyber font-bold text-xl sm:text-2xl text-white tracking-wide">
                NEXUS COMMAND CENTER (ADMIN)
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-red-500/20 text-red-300 border border-red-500/40">
                ROLE: {currentRole}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono-tech mt-0.5">
              {language === 'PL'
                ? 'Rejestr audytu węzłów, zarządzanie mikroserwisami, moderacja zgłoszeń i broadcast'
                : 'Node audit trail, microservice governance, access moderation, and neural broadcast'}
            </p>
          </div>
        </div>

        {/* Role Switcher for preview & testing */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono-tech text-slate-400">TEST AS ROLE:</span>
          {(['ADMIN', 'CORE_ARCHITECT', 'ARCHITECT', 'GUEST'] as UserRole[]).map(r => (
            <button
              key={r}
              onClick={() => {
                setCurrentRole(r);
                playCyberSound('click');
              }}
              className={`px-2.5 py-1 rounded text-[10px] font-mono-tech transition-all ${
                currentRole === r
                  ? 'bg-red-500/30 text-red-200 border border-red-400 font-bold'
                  : 'bg-[#0d131f] text-slate-400 border border-cyan-500/10 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('AUDIT');
            playCyberSound('click');
          }}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'AUDIT'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
              : 'bg-[#09101d] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>ŚCIEŻKA AUDYTU & WĘZŁY (AUDIT TRAIL)</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'AUDIT' ? 'bg-black/20 text-black' : 'bg-cyan-500/20 text-cyan-300'
          }`}>
            {auditLogs.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('REQUESTS');
            playCyberSound('click');
          }}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'REQUESTS'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
              : 'bg-[#09101d] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>WNIOSKI O DOSTĘP (ACCESS QUEUE)</span>
          {pendingRequests.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-bold animate-pulse">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('BROADCAST');
            playCyberSound('click');
          }}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'BROADCAST'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
              : 'bg-[#09101d] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>GLOBALNY BROADCAST</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('METRICS');
            playCyberSound('click');
          }}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'METRICS'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
              : 'bg-[#09101d] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>TELEMETRIA EKOSYSTEMU</span>
        </button>
      </div>

      {/* TAB CONTENT: Persistent Audit Trail */}
      {activeTab === 'AUDIT' && (
        <div className="space-y-6">
          <AuditTrail />
        </div>
      )}

      {/* TAB CONTENT: Access Requests Moderation Queue */}
      {activeTab === 'REQUESTS' && (
        <div className="p-6 rounded-2xl bg-[#090d16] border border-cyan-500/25 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-cyber font-bold text-sm uppercase text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>{language === 'PL' ? 'KOLEJKA WNIOSKÓW O DOSTĘP' : 'ACCESS REQUESTS QUEUE'} ({pendingRequests.length})</span>
            </h3>
            <span className="text-[10px] font-mono-tech text-slate-400">
              Total Requests: {accessRequests.length}
            </span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono-tech text-xs rounded-xl bg-[#0d131f] border border-cyan-500/10">
              Brak oczekujących wniosków w kolejce. Wszystkie aplikacje zostały rozpatrzone.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map(req => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-[#0d131f] border border-cyan-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-cyber font-bold text-sm text-white">{req.fullName}</span>
                      <span className="text-xs font-mono-tech text-cyan-400">@{req.handle}</span>
                      <span className="text-xs text-slate-400">({req.email})</span>
                    </div>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      "{req.whyNexus || req.proposal}"
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {req.specializations.map(s => (
                        <span key={s} className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-purple-950/70 text-purple-300 border border-purple-500/30">
                          {s}
                        </span>
                      ))}
                      {req.skills.map(sk => (
                        <span key={sk} className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-cyan-950/70 text-cyan-300 border border-cyan-500/30">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        reviewAccessRequest(req.id, 'REJECTED');
                        playCyberSound('click');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-950/40 text-xs font-mono-tech transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Odrzuć</span>
                    </button>

                    <button
                      onClick={() => {
                        reviewAccessRequest(req.id, 'APPROVED');
                        playCyberSound('success');
                        triggerHaptic();
                      }}
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-cyber font-bold text-xs transition-colors flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Zatwierdź & Nadaj Dostęp</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Global Broadcast Messenger */}
      {activeTab === 'BROADCAST' && (
        <div className="p-6 rounded-2xl bg-[#090d16] border border-cyan-500/25 space-y-4">
          <h3 className="font-cyber font-bold text-xs uppercase tracking-wider text-cyan-300 flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{language === 'PL' ? 'EMISJA KOMUNIKATU DO CAŁEJ RODZINY (BROADCAST)' : 'GLOBAL NEURAL BROADCAST'}</span>
          </h3>

          <form onSubmit={handleBroadcast} className="space-y-3">
            <textarea
              rows={3}
              value={broadcastMessage}
              onChange={e => setBroadcastMessage(e.target.value)}
              placeholder="Wpisz komunikat o stanie ekosystemu, zbliżającym się sprincie lub premierze modułu..."
              className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
            />

            <div className="flex items-center justify-between">
              {broadcastSent ? (
                <span className="text-xs font-mono-tech text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Komunikat wyemitowany do wszystkich węzłów!
                </span>
              ) : (
                <span className="text-[10px] font-mono-tech text-slate-500">
                  Wiadomość pojawi się na HUD wszystkich zalogowanych Architektów
                </span>
              )}

              <button
                type="submit"
                disabled={!broadcastMessage.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs transition-all disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Wyślij Broadcast</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: Ecosystem Metrics */}
      {activeTab === 'METRICS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#090d16] border border-cyan-500/20 space-y-1">
              <p className="text-[10px] font-mono-tech text-slate-400">ARCHITECTS COUNT</p>
              <p className="font-cyber font-bold text-xl text-cyan-300">{architects.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#090d16] border border-purple-500/20 space-y-1">
              <p className="text-[10px] font-mono-tech text-slate-400">WORLDS & MODULES</p>
              <p className="font-cyber font-bold text-xl text-purple-300">{worlds.length} Worlds</p>
            </div>
            <div className="p-4 rounded-xl bg-[#090d16] border border-emerald-500/20 space-y-1">
              <p className="text-[10px] font-mono-tech text-slate-400">ACTIVE MISSIONS</p>
              <p className="font-cyber font-bold text-xl text-emerald-300">{missions.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#090d16] border border-amber-500/20 space-y-1">
              <p className="text-[10px] font-mono-tech text-slate-400">RFC DOCUMENTS</p>
              <p className="font-cyber font-bold text-xl text-amber-300">{memoryDocs.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
