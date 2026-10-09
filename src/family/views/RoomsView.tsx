import React, { useState, useRef, useEffect } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  MessageSquare,
  Send,
  Users,
  Pin,
  Hash,
  Lock,
  Globe,
  FolderGit2,
  Shield,
  Sparkles,
  User
} from 'lucide-react';
import { RoomType } from '../types';

export const RoomsView: React.FC = () => {
  const {
    chatRooms,
    architects,
    currentArchitect,
    currentRole,
    sendRoomMessage,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const [activeRoomId, setActiveRoomId] = useState<string>(chatRooms[0]?.id || 'room-family');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeRoom = chatRooms.find(r => r.id === activeRoomId) || chatRooms[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeRoom?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeRoom) return;

    sendRoomMessage(activeRoom.id, messageInput.trim());
    setMessageInput('');
    playCyberSound('click');
    triggerHaptic();
  };

  const getRoomIcon = (type: RoomType) => {
    switch (type) {
      case 'PUBLIC FAMILY':
        return Globe;
      case 'WORLD ROOMS':
        return Hash;
      case 'PROJECT ROOMS':
        return FolderGit2;
      case 'BROTHERHOOD ROOMS':
        return Users;
      case 'PRIVATE ROOMS':
        return Lock;
      default:
        return MessageSquare;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header HUD */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0a0f1d] to-purple-950/40 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950/80 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.4)]">
            <MessageSquare className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-cyber font-bold text-xl sm:text-2xl text-white tracking-wide">
                FAMILY COLLABORATION ROOMS
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                REAL-TIME SYNAPSE
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono-tech mt-0.5">
              {language === 'PL'
                ? 'Pokoje tematyczne, światowe i projektowe dla Architektów Nexusa'
                : 'Thematic, world, and project rooms for continuous architectural coordination'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Room Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
        {/* Left: Rooms List (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#090d16] border border-cyan-500/25 p-4 flex flex-col justify-between overflow-y-auto space-y-3">
          <div className="space-y-2">
            <div className="px-2 text-[10px] font-mono-tech uppercase text-cyan-400/70 tracking-wider">
              {language === 'PL' ? 'KANAŁY OPERACYJNE' : 'OPERATIONAL CHANNELS'}
            </div>

            <div className="space-y-1.5">
              {chatRooms.map(room => {
                const Icon = getRoomIcon(room.type);
                const isSelected = activeRoom?.id === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => {
                      setActiveRoomId(room.id);
                      playCyberSound('click');
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-cyan-500/20 border border-cyan-400 text-white shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                        : 'bg-[#0d131f] border border-cyan-500/10 text-slate-300 hover:text-white hover:bg-cyan-950/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'}`} />
                      <div className="truncate">
                        <p className="font-cyber font-bold text-xs truncate">{room.name}</p>
                        <p className="text-[10px] font-mono-tech text-slate-400 truncate">{room.type}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 shrink-0">
                      {room.messages.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Active Room Chat (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-[#080b12] border border-cyan-500/25 flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* Room Header */}
          <div className="p-4 bg-[#06080e] border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400 text-cyan-300 flex items-center justify-center">
                <Hash className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-cyber font-bold text-sm text-white">{activeRoom.name}</h3>
                <p className="text-[11px] font-mono-tech text-slate-400">{activeRoom.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400">
              <Users className="w-4 h-4" />
              <span>{activeRoom.participants.length} Active</span>
            </div>
          </div>

          {/* Pinned Knowledge Banner (if any) */}
          {activeRoom.pinnedKnowledge && activeRoom.pinnedKnowledge.length > 0 && (
            <div className="px-4 py-2 bg-cyan-950/40 border-b border-cyan-500/15 flex items-center gap-2 text-[11px] font-mono-tech text-cyan-300">
              <Pin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">Pinned: {activeRoom.pinnedKnowledge.join(' • ')}</span>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {activeRoom.messages.map(msg => {
              const isMe = msg.senderId === currentArchitect.id;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-xl object-cover border border-cyan-500/40 shrink-0"
                  />
                  <div
                    className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                      isMe
                        ? 'bg-cyan-950/40 border border-cyan-500/40 text-slate-100'
                        : 'bg-[#0d131f] border border-cyan-500/20 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] font-mono-tech text-slate-400 pb-1 border-b border-cyan-500/10">
                      <span className="font-cyber font-bold text-cyan-400">{msg.senderName}</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="font-sans leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-[#06080e] border-t border-cyan-500/20">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                placeholder={`Napisz wiadomość w #${activeRoom.slug}...`}
                className="flex-1 bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold disabled:opacity-40 transition-colors shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
