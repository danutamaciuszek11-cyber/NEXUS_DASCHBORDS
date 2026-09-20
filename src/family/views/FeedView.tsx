import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Radio,
  Plus,
  Zap,
  Hammer,
  Lightbulb,
  Users,
  MessageSquare,
  Send,
  Code,
  Share2,
  Sparkles,
  Tag,
  CheckCircle2,
  Search,
  Bot,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Clock,
  Compass,
  FileCode2,
  Eye
} from 'lucide-react';
import { FeedCategory } from '../types';

export const FeedView: React.FC<{ onOpenNewPostModal?: () => void }> = ({
  onOpenNewPostModal = () => {}
}) => {
  const {
    feedPosts,
    architects,
    currentArchitect,
    reactToFeedPost,
    addFeedComment,
    initiateCollaborationFromPost,
    projectCollaborationSuggestions,
    handleCollaborationDecision,
    projects,
    setCurrentView,
    playCyberSound,
    triggerHaptic,
    language
  } = useNexus();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});
  const [searchFilter, setSearchFilter] = useState('');

  const categories: (FeedCategory | 'ALL')[] = [
    'ALL',
    'UPDATE',
    'IDEA',
    'PROJECT',
    'QUESTION',
    'DISCOVERY',
    'RELEASE',
    'HELP',
    'ART',
    'CODE',
    'RESEARCH'
  ];

  const filteredPosts = feedPosts.filter(p => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const searchLower = searchFilter.toLowerCase();
    const matchesSearch = searchFilter === '' ||
      (p.title || '').toLowerCase().includes(searchLower) ||
      (p.content || '').toLowerCase().includes(searchLower) ||
      (Array.isArray(p.tags) && p.tags.some(t => (typeof t === 'string' ? t : String(t || '')).toLowerCase().includes(searchLower)));
    return matchesCat && matchesSearch;
  });

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;
    addFeedComment(postId, text.trim());
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    playCyberSound('click');
  };

  const getAuthor = (authorId: string) => {
    return architects.find(a => a.id === authorId) || architects[0];
  };

  const getProject = (projectId?: string) => {
    if (!projectId) return null;
    return projects.find(p => p.id === projectId);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Feed Header HUD */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0a0f1d] to-purple-950/40 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950/80 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.4)]">
            <Radio className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-cyber font-bold text-xl sm:text-2xl text-white tracking-wide">
                FAMILY BUILDER FEED
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                ETHOS: BUILDING ONLY
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono-tech mt-0.5">
              {language === 'PL'
                ? 'DON\'T JUST USE NEXUS. BUILD IT. — Strumień postępów, kodów źródłowych, odkryć i dyskusji technicznych'
                : 'DON\'T JUST USE NEXUS. BUILD IT. — Real-time engineering stream of code, releases, research & builds'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (typeof onOpenNewPostModal === 'function') {
                onOpenNewPostModal();
              }
              playCyberSound('beep');
              triggerHaptic();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-cyber font-bold text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)]"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'PL' ? 'Opublikuj Wpis / Kod' : 'Post Update / Code'}</span>
          </button>
        </div>
      </div>

      {/* Bella Project Collaboration Suggestions Banner (if any pending) */}
      {projectCollaborationSuggestions.filter(s => s.status === 'SUGGESTED').length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#0a0f1e] to-cyan-950/60 border border-purple-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="font-cyber font-bold text-xs text-white tracking-wider">
                BELLA PROJECT COLLABORATION PROPOSALS
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                {projectCollaborationSuggestions.filter(s => s.status === 'SUGGESTED').length} PENDING
              </span>
            </div>
            <span className="text-[10px] font-mono-tech text-slate-400">
              Bella suggests • Humans decide
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projectCollaborationSuggestions
              .filter(s => s.status === 'SUGGESTED')
              .map(collab => {
                const arch = architects.find(a => a.id === collab.architectId) || architects[0];
                const proj = getProject(collab.projectId);

                return (
                  <div
                    key={collab.id}
                    className="p-3.5 rounded-xl bg-[#090d16]/90 border border-purple-500/20 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={arch.avatar}
                          alt={arch.name}
                          className="w-7 h-7 rounded-lg object-cover border border-purple-400"
                        />
                        <div>
                          <span className="font-cyber font-bold text-white block text-[11px]">{arch.name}</span>
                          <span className="text-[10px] font-mono-tech text-cyan-400">→ {proj?.title || 'Nexus Project'}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-mono-tech text-purple-300 bg-purple-500/20 rounded">
                        {collab.compatibilityScore}% SYNERGY
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                      {collab.rationale}
                    </p>

                    <div className="pt-2 border-t border-purple-500/10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCollaborationDecision(collab.id, 'DECLINED')}
                          className="px-2.5 py-1 rounded-lg border border-slate-700 text-slate-400 hover:text-white text-[10px] font-mono-tech"
                        >
                          {language === 'PL' ? 'Odrzuć' : 'Decline'}
                        </button>
                        <button
                          onClick={() => handleCollaborationDecision(collab.id, 'POSTPONED')}
                          className="px-2.5 py-1 rounded-lg border border-amber-500/30 text-amber-300 text-[10px] font-mono-tech"
                        >
                          {language === 'PL' ? 'Odłóż' : 'Postpone'}
                        </button>
                      </div>

                      <button
                        onClick={() => handleCollaborationDecision(collab.id, 'ACCEPTED')}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-black font-cyber font-bold text-[10px] flex items-center gap-1 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                      >
                        <Check className="w-3 h-3" />
                        <span>{language === 'PL' ? 'Dołącz do projektu' : 'Add to Project'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="p-3.5 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/60" />
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder={language === 'PL' ? 'Filtruj wpisy wg słów kluczowych, tagów, modułów...' : 'Filter updates by keyword, tags, modules...'}
            className="w-full bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                playCyberSound('click');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono-tech transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'bg-[#0d131f] text-slate-400 border border-cyan-500/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Stream */}
      <div className="space-y-5 max-w-4xl mx-auto">
        {filteredPosts.map(post => {
          const author = getAuthor(post.authorId);
          const isCommentsOpen = expandedComments[post.id];
          const userReaction = post.userReactions[currentArchitect.id];
          const isMe = author.id === currentArchitect.id;

          return (
            <div
              key={post.id}
              className="p-5 sm:p-6 rounded-2xl bg-[#090d16] border border-cyan-500/20 shadow-lg space-y-4 transition-all hover:border-cyan-500/35"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-10 h-10 rounded-xl object-cover border border-cyan-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-cyber font-bold text-sm text-white">{author.name}</span>
                      <span className="text-[10px] font-mono-tech text-cyan-400">@{author.handle}</span>
                      {isMe && (
                        <span className="px-1.5 py-0.2 text-[8px] font-mono-tech rounded bg-cyan-500/20 text-cyan-300">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-mono-tech text-slate-400">
                      {author.role} • {new Date(post.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {post.worldSlug && (
                    <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                      🌍 {post.worldSlug}
                    </span>
                  )}
                  <span className="px-2 py-0.5 text-[9px] font-mono-tech rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-bold">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h3 className="font-cyber font-bold text-base text-white">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map(t => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-[10px] font-mono-tech rounded-md bg-[#0d131f] border border-cyan-500/15 text-slate-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Code Snippet (if attached) */}
              {post.codeSnippet && (
                <div className="rounded-xl overflow-hidden border border-cyan-500/30 bg-[#06080e] font-mono-tech text-xs">
                  <div className="px-3 py-1.5 bg-[#0d131f] border-b border-cyan-500/20 text-cyan-400 text-[10px] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5" />
                      {post.codeSnippet.language.toUpperCase()}
                    </span>
                    <span className="text-slate-500">NEXUS SNIPPET</span>
                  </div>
                  <pre className="p-4 text-cyan-200 overflow-x-auto text-xs leading-relaxed">
                    <code>{post.codeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {/* Reaction, Collaboration & Action Bar */}
              <div className="pt-3 border-t border-cyan-500/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Synapse Reaction ⚡ */}
                  <button
                    onClick={() => reactToFeedPost(post.id, 'synapse')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                      userReaction === 'synapse'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.3)] font-bold'
                        : 'bg-[#0d131f] border-cyan-500/15 text-slate-400 hover:text-cyan-300'
                    }`}
                    title="Synapse / Insight"
                  >
                    <span>⚡</span>
                    <span>{post.reactions.synapse}</span>
                  </button>

                  {/* Built Reaction 🛠️ */}
                  <button
                    onClick={() => reactToFeedPost(post.id, 'built')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                      userReaction === 'built'
                        ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.3)] font-bold'
                        : 'bg-[#0d131f] border-cyan-500/15 text-slate-400 hover:text-purple-300'
                    }`}
                    title="Built / Verified"
                  >
                    <span>🛠️</span>
                    <span>{post.reactions.built}</span>
                  </button>

                  {/* Spark Reaction 💡 */}
                  <button
                    onClick={() => reactToFeedPost(post.id, 'spark')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                      userReaction === 'spark'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)] font-bold'
                        : 'bg-[#0d131f] border-cyan-500/15 text-slate-400 hover:text-amber-300'
                    }`}
                    title="Idea / Spark"
                  >
                    <span>💡</span>
                    <span>{post.reactions.spark}</span>
                  </button>

                  {/* Partner Reaction 🤝 */}
                  <button
                    onClick={() => reactToFeedPost(post.id, 'partner')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                      userReaction === 'partner'
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)] font-bold'
                        : 'bg-[#0d131f] border-cyan-500/15 text-slate-400 hover:text-emerald-300'
                    }`}
                    title="Brotherhood / Partner"
                  >
                    <span>🤝</span>
                    <span>{post.reactions.partner}</span>
                  </button>

                  {/* Review Reaction 🔍 (Code/Architecture Review) */}
                  <button
                    onClick={() => reactToFeedPost(post.id, 'review')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                      userReaction === 'review'
                        ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)] font-bold'
                        : 'bg-[#0d131f] border-cyan-500/15 text-slate-400 hover:text-rose-300'
                    }`}
                    title="Peer Review / RFC Approved"
                  >
                    <span>🔍</span>
                    <span>{post.reactions.review ?? 0}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Initiate Collaboration Direct Action */}
                  {!isMe && (
                    <button
                      onClick={() => {
                        initiateCollaborationFromPost(post);
                        playCyberSound('synapse');
                        triggerHaptic();
                      }}
                      className="px-3 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-mono-tech transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'PL' ? 'Współpracuj z autorem' : 'Initiate Collaboration'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors px-2 py-1"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments.length}</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {isCommentsOpen && (
                <div className="pt-3 border-t border-cyan-500/10 space-y-3">
                  {post.comments.map(c => {
                    const commentAuthor = getAuthor(c.authorId);
                    return (
                      <div key={c.id} className="p-3 rounded-xl bg-[#0c101a] border border-cyan-500/10 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
                          <span className="text-cyan-300 font-cyber font-bold">{commentAuthor.name}</span>
                          <span>{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs text-slate-200 font-sans">{c.content}</p>
                      </div>
                    );
                  })}

                  {/* Add Comment Bar */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleCommentSubmit(post.id)}
                      placeholder={language === 'PL' ? 'Dodaj komentarz architektoniczny / sugestię kodu...' : 'Add an architectural critique / suggestion...'}
                      className="flex-1 bg-[#0d131f] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id)}
                      className="p-2 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

