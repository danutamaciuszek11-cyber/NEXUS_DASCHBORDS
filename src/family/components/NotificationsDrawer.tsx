import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  Users,
  Target,
  ShieldAlert,
  Info,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { NotificationItem } from '../context/NexusContext';

export const NotificationsDrawer: React.FC = () => {
  const {
    showNotificationsDrawer,
    setShowNotificationsDrawer,
    notifications,
    markNotificationRead,
    clearNotifications,
    setCurrentView,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'BROTHERHOOD' | 'MISSION' | 'SYSTEM'>('ALL');

  if (!showNotificationsDrawer) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'UNREAD') return !n.read;
    if (activeFilter === 'BROTHERHOOD') return n.type === 'BROTHERHOOD';
    if (activeFilter === 'MISSION') return n.type === 'MISSION';
    if (activeFilter === 'SYSTEM') return n.type === 'SYSTEM' || n.type === 'WARNING';
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'BROTHERHOOD':
        return <Users className="w-4 h-4 text-pink-400" />;
      case 'MISSION':
        return <Target className="w-4 h-4 text-emerald-400" />;
      case 'WARNING':
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      case 'SUCCESS':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTypeBadge = (type: NotificationItem['type']) => {
    switch (type) {
      case 'BROTHERHOOD':
        return 'bg-pink-950/60 text-pink-300 border-pink-500/40';
      case 'MISSION':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
      case 'WARNING':
        return 'bg-amber-950/60 text-amber-300 border-amber-500/40';
      case 'SUCCESS':
        return 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    if (!notif.read) {
      markNotificationRead(notif.id);
    }
    if (notif.actionView) {
      setCurrentView(notif.actionView);
      playCyberSound('synapse');
      triggerHaptic();
      setShowNotificationsDrawer(false);
    } else {
      playCyberSound('click');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={() => {
          setShowNotificationsDrawer(false);
          playCyberSound('click');
        }}
      />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-md bg-[#080c14] border-l border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col h-full overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-[#0a0f1d] to-purple-950/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cyber font-bold text-sm tracking-wider text-white">
                  {language === 'PL' ? 'TELEMETRIA I POWIADOMIENIA' : 'TELEMETRY & ALERTS'}
                </h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-cyan-500 text-black font-mono-tech text-[10px] font-bold shadow-[0_0_8px_#00f0ff]">
                    {unreadCount} {language === 'PL' ? 'NOWE' : 'NEW'}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-mono-tech text-slate-400">
                {language === 'PL' ? 'Systemowe powiadomienia i alerty sieci Nexus' : 'Nexus network real-time alerts'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowNotificationsDrawer(false);
              playCyberSound('click');
            }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Toolbar & Quick Actions */}
        <div className="p-3 border-b border-cyan-500/10 bg-[#060911] space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {(['ALL', 'UNREAD', 'BROTHERHOOD', 'MISSION', 'SYSTEM'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => {
                    setActiveFilter(f);
                    playCyberSound('beep');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-tech transition-all shrink-0 border ${
                    activeFilter === f
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.2)] font-bold'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono-tech pt-1 text-slate-400 border-t border-cyan-500/10">
            <span>
              {language === 'PL' ? 'Liczba alertów:' : 'Total alerts:'} {filteredNotifications.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  notifications.forEach(n => markNotificationRead(n.id));
                  playCyberSound('click');
                }}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors text-[10px]"
              >
                <CheckCheck className="w-3 h-3" />
                <span>{language === 'PL' ? 'Oznacz przeczytane' : 'Mark all read'}</span>
              </button>
              <button
                onClick={() => {
                  clearNotifications();
                  playCyberSound('click');
                }}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors text-[10px]"
              >
                <Trash2 className="w-3 h-3" />
                <span>{language === 'PL' ? 'Wyczyść' : 'Clear all'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6 text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Bell className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="font-cyber text-xs font-bold text-slate-400">
                  {language === 'PL' ? 'BRAK POWIADOMIEN' : 'NO NOTIFICATIONS'}
                </p>
                <p className="text-[10px] font-mono-tech text-slate-600 mt-1">
                  {language === 'PL' ? 'Wszystkie alerty i zgłoszenia są czyste' : 'All clear. No active alerts in queue'}
                </p>
              </div>
            </div>
          ) : (
            filteredNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-[#0d131f]/60 border-slate-800/80 hover:border-cyan-500/30 text-slate-300'
                    : 'bg-gradient-to-r from-cyan-950/40 via-[#0e1626] to-purple-950/30 border-cyan-500/40 text-white shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:border-cyan-400'
                }`}
              >
                {!notif.read && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff] animate-ping" />
                )}

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-black/40 border border-slate-800 shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-1.5 py-0.2 rounded border text-[9px] font-mono-tech font-bold ${getTypeBadge(notif.type)}`}>
                        {notif.type}
                      </span>
                      <span className="text-[10px] font-mono-tech text-slate-500">
                        {notif.timestamp}
                      </span>
                    </div>

                    <h4 className="text-xs font-cyber font-bold group-hover:text-cyan-300 transition-colors truncate">
                      {notif.title}
                    </h4>

                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed mt-1">
                      {notif.message}
                    </p>

                    {notif.actionView && (
                      <div className="flex items-center gap-1 text-[10px] font-mono-tech text-cyan-400 group-hover:text-cyan-300 mt-2">
                        <span>{language === 'PL' ? 'Otwórz widok' : 'Open View'} ({notif.actionView})</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Status */}
        <div className="p-3 border-t border-cyan-500/20 bg-[#060911] flex items-center justify-between text-[10px] font-mono-tech text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            <span>NEXUS TELEMETRY GATEWAY: ONLINE</span>
          </div>
          <span>LATENCY: 12ms</span>
        </div>
      </div>
    </div>
  );
};
