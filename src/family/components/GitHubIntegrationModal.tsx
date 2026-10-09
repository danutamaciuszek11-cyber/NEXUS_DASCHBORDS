import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Github,
  X,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  GitFork,
  Star,
  Key,
  ShieldCheck,
  Copy,
  Check,
  Terminal,
  Layers,
  Sparkles,
  Unlink,
  BookOpen,
  Code2,
  FolderGit2,
  AlertCircle
} from 'lucide-react';
import { GitHubRepo } from '../types';

export const GitHubIntegrationModal: React.FC = () => {
  const {
    isGitHubModalOpen,
    setIsGitHubModalOpen,
    githubState,
    connectGitHubOAuth,
    connectGitHubToken,
    connectGitHubDemo,
    disconnectGitHub,
    refreshGitHubRepos,
    syncGitHubToCurrentArchitect,
    linkGitHubRepoToProject,
    publishNexusDocsToGitHub,
    memoryDocs,
    projects,
    language,
    playCyberSound,
    triggerHaptic
  } = useNexus();

  const [activeTab, setActiveTab] = useState<'OAUTH' | 'TOKEN' | 'DEMO'>('OAUTH');
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [copiedDev, setCopiedDev] = useState(false);
  const [copiedShared, setCopiedShared] = useState(false);
  const [repoSearch, setRepoSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [selectedProjectForLink, setSelectedProjectForLink] = useState<{ [repoId: number]: string }>({});

  // NEXUS-DOCS Exporter State
  const [docsRepoName, setDocsRepoName] = useState('nexus-docs');
  const [docsIsPublic, setDocsIsPublic] = useState(true);
  const [isPublishingDocs, setIsPublishingDocs] = useState(false);
  const [docsPublishSuccess, setDocsPublishSuccess] = useState<string | null>(null);

  if (!isGitHubModalOpen) return null;

  const devCallbackUrl = 'https://ais-dev-lf5wtdz5vjmqfnaox4jzw7-145398481493.europe-west2.run.app/auth/github/callback';
  const sharedCallbackUrl = 'https://ais-pre-lf5wtdz5vjmqfnaox4jzw7-145398481493.europe-west2.run.app/auth/github/callback';

  const copyToClipboard = (text: string, isDev: boolean) => {
    navigator.clipboard.writeText(text);
    if (isDev) {
      setCopiedDev(true);
      setTimeout(() => setCopiedDev(false), 2000);
    } else {
      setCopiedShared(true);
      setTimeout(() => setCopiedShared(false), 2000);
    }
    playCyberSound('click');
    triggerHaptic();
  };

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setTokenError(language === 'PL' ? 'Wprowadź token GitHub.' : 'Please enter a GitHub token.');
      return;
    }
    setTokenError(null);
    const res = await connectGitHubToken(tokenInput.trim());
    if (!res.success) {
      setTokenError(res.message || (language === 'PL' ? 'Błąd autoryzacji tokenu.' : 'Token validation failed.'));
    } else {
      setTokenInput('');
    }
  };

  const languages = Array.from(
    new Set(githubState.repos.map(r => r.language).filter(Boolean))
  ) as string[];

  const filteredRepos = githubState.repos.filter(repo => {
    const matchesQuery =
      (repo.name || '').toLowerCase().includes(repoSearch.toLowerCase()) ||
      (repo.description || '').toLowerCase().includes(repoSearch.toLowerCase());
    const matchesLang = selectedLanguage === 'ALL' || repo.language === selectedLanguage;
    return matchesQuery && matchesLang;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="github-integration-modal"
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#080c16] border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden"
      >
        {/* Modal Topbar */}
        <div className="px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-[#0a0f1d] to-purple-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-black border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cyber font-bold text-base sm:text-lg text-white tracking-wide">
                  GITHUB SYNAPSE HUB
                </h3>
                {githubState.isConnected ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono-tech">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    CONNECTED {githubState.authMode ? `(${githubState.authMode})` : ''}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-mono-tech">
                    DISCONNECTED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono-tech">
                {language === 'PL'
                  ? 'Dwukierunkowa synteza repozytoriów kodu, kontraktów i wkładu z ekosystemem Nexus'
                  : 'Two-way synchronization of code repositories, contracts and architect contribution with Nexus'}
              </p>
            </div>
          </div>

          <button
            id="close-github-modal-btn"
            onClick={() => {
              setIsGitHubModalOpen(false);
              playCyberSound('click');
            }}
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-red-950/40 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-300 transition-all"
            title="Zamknij (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Active Connection Card */}
          {githubState.isConnected && githubState.user ? (
            <div className="p-5 rounded-2xl bg-[#0c1220] border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.08)]">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={githubState.user.avatar_url}
                      alt={githubState.user.login}
                      className="w-16 h-16 rounded-2xl border-2 border-cyan-400 object-cover shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-black border border-cyan-400">
                      <Github className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-cyber font-bold text-lg text-white">
                        {githubState.user.name || githubState.user.login}
                      </h4>
                      <a
                        href={githubState.user.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono-tech text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
                      >
                        @{githubState.user.login}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    {githubState.user.bio && (
                      <p className="text-xs text-slate-300 mt-1 max-w-xl line-clamp-2">
                        {githubState.user.bio}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] font-mono-tech text-slate-400">
                      <span className="flex items-center gap-1 text-cyan-300">
                        <FolderGit2 className="w-3.5 h-3.5" />
                        <strong>{githubState.user.public_repos}</strong> {language === 'PL' ? 'repozytoriów' : 'repos'}
                      </span>
                      <span>•</span>
                      <span>
                        <strong>{githubState.user.followers}</strong> {language === 'PL' ? 'obserwujących' : 'followers'}
                      </span>
                      {githubState.user.location && (
                        <>
                          <span>•</span>
                          <span>{githubState.user.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                  <button
                    onClick={() => syncGitHubToCurrentArchitect()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-cyber transition-all"
                    title="Synchronizuj profil architekta z kontem GitHub"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{language === 'PL' ? 'Synchronizuj z Profilem' : 'Sync Profile'}</span>
                  </button>

                  <button
                    onClick={() => refreshGitHubRepos()}
                    disabled={githubState.isLoading}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#090e1a] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono-tech transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${githubState.isLoading ? 'animate-spin text-cyan-400' : ''}`} />
                    <span>{language === 'PL' ? 'Odśwież' : 'Refresh'}</span>
                  </button>

                  <button
                    onClick={() => disconnectGitHub()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-mono-tech transition-all"
                  >
                    <Unlink className="w-3.5 h-3.5" />
                    <span>{language === 'PL' ? 'Rozłącz' : 'Disconnect'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Connection Options Tabs */
            <div className="space-y-6">
              <div className="flex border-b border-cyan-500/20 gap-2">
                <button
                  onClick={() => setActiveTab('OAUTH')}
                  className={`flex items-center gap-2 px-4 py-2.5 font-cyber text-xs font-bold border-b-2 transition-all ${
                    activeTab === 'OAUTH'
                      ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Key className="w-4 h-4" />
                  <span>GitHub OAuth 2.0 (Oficjalny)</span>
                </button>
                <button
                  onClick={() => setActiveTab('TOKEN')}
                  className={`flex items-center gap-2 px-4 py-2.5 font-cyber text-xs font-bold border-b-2 transition-all ${
                    activeTab === 'TOKEN'
                      ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>Personal Access Token (PAT)</span>
                </button>
                <button
                  onClick={() => setActiveTab('DEMO')}
                  className={`flex items-center gap-2 px-4 py-2.5 font-cyber text-xs font-bold border-b-2 transition-all ${
                    activeTab === 'DEMO'
                      ? 'border-purple-400 text-purple-300 bg-purple-950/30'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Eksploracja Ekosystemu (Demo)</span>
                </button>
              </div>

              {/* TAB 1: OAuth Flow */}
              {activeTab === 'OAUTH' && (
                <div className="p-6 rounded-2xl bg-[#0c1220] border border-cyan-500/20 space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-cyber font-bold text-white text-base">
                        Autoryzacja OAuth 2.0
                      </h4>
                      <p className="text-xs text-slate-400 font-mono-tech mt-1">
                        {language === 'PL'
                          ? 'Bezpieczne połączenie popupowe. Kliknij poniżej, aby otworzyć oficjalne okno autoryzacji GitHub.'
                          : 'Secure popup authentication flow. Click below to initiate GitHub authorization.'}
                      </p>
                    </div>

                    <button
                      id="launch-github-oauth-btn"
                      onClick={() => connectGitHubOAuth()}
                      disabled={githubState.isLoading}
                      className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-cyber font-bold text-xs tracking-wider transition-all shadow-[0_0_25px_rgba(0,240,255,0.3)] disabled:opacity-50 shrink-0"
                    >
                      <Github className="w-4 h-4" />
                      <span>
                        {githubState.isLoading
                          ? (language === 'PL' ? 'Oczekiwanie na autoryzację...' : 'Awaiting Authorization...')
                          : (language === 'PL' ? 'Połącz z GitHub (OAuth)' : 'Connect with GitHub (OAuth)')}
                      </span>
                    </button>
                  </div>

                  {githubState.error && (
                    <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Uwaga: </strong>
                        <span>{githubState.error}</span>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Możesz również skorzystać z zakładki <strong>Personal Access Token (PAT)</strong> lub <strong>Eksploracja Ekosystemu</strong> poniżej.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Setup Instruction & Callback URLs Box */}
                  <div className="p-4 rounded-xl bg-[#070a12] border border-cyan-500/15 space-y-3 text-xs font-mono-tech">
                    <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span>Instrukcja konfiguracji GitHub OAuth App</span>
                    </div>

                    <p className="text-slate-400 text-[11px]">
                      Jeśli tworzysz własną aplikację OAuth w{' '}
                      <a
                        href="https://github.com/settings/developers"
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 underline inline-flex items-center gap-1"
                      >
                        github.com/settings/developers
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      , podaj poniższe adresy URL w polu <strong>Authorization callback URL</strong>:
                    </p>

                    <div className="space-y-2">
                      <div>
                        <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between">
                          <span>1. Podgląd Developerski (Development Callback URL):</span>
                          <button
                            onClick={() => copyToClipboard(devCallbackUrl, true)}
                            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                          >
                            {copiedDev ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedDev ? 'Skopiowano' : 'Kopiuj'}</span>
                          </button>
                        </div>
                        <code className="block p-2 rounded-lg bg-black/80 border border-slate-800 text-cyan-300 text-[11px] select-all break-all">
                          {devCallbackUrl}
                        </code>
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between">
                          <span>2. Podgląd Udostępniony (Shared/Preview Callback URL):</span>
                          <button
                            onClick={() => copyToClipboard(sharedCallbackUrl, false)}
                            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                          >
                            {copiedShared ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedShared ? 'Skopiowano' : 'Kopiuj'}</span>
                          </button>
                        </div>
                        <code className="block p-2 rounded-lg bg-black/80 border border-slate-800 text-cyan-300 text-[11px] select-all break-all">
                          {sharedCallbackUrl}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Token Flow */}
              {activeTab === 'TOKEN' && (
                <form onSubmit={handleTokenSubmit} className="p-6 rounded-2xl bg-[#0c1220] border border-cyan-500/20 space-y-4">
                  <div>
                    <h4 className="font-cyber font-bold text-white text-base">
                      Autoryzacja przez Personal Access Token (PAT)
                    </h4>
                    <p className="text-xs text-slate-400 font-mono-tech mt-1">
                      {language === 'PL'
                        ? 'Wprowadź swój token GitHub (classic lub fine-grained). Wymagane uprawnienia: read:user, repo.'
                        : 'Enter your GitHub token (classic or fine-grained). Required scopes: read:user, repo.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono-tech text-slate-300 flex items-center justify-between">
                      <span>GitHub Token (ghp_... lub github_pat_...)</span>
                      <a
                        href="https://github.com/settings/tokens"
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline text-[11px] flex items-center gap-1"
                      >
                        Wygeneruj token na GitHub
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </label>
                    <input
                      type="password"
                      value={tokenInput}
                      onChange={e => setTokenInput(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full bg-[#070a12] border border-cyan-500/30 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white font-mono-tech focus:outline-none"
                    />
                  </div>

                  {tokenError && (
                    <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-mono-tech">
                      {tokenError}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={githubState.isLoading}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs transition-all disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{githubState.isLoading ? 'Weryfikacja...' : 'Zweryfikuj i Połącz'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: Demo Flow */}
              {activeTab === 'DEMO' && (
                <div className="p-6 rounded-2xl bg-[#0c1220] border border-purple-500/30 space-y-4">
                  <div>
                    <h4 className="font-cyber font-bold text-white text-base flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Błyskawiczna Eksploracja Ekosystemu Nexus
                    </h4>
                    <p className="text-xs text-slate-300 font-mono-tech mt-1">
                      {language === 'PL'
                        ? 'Nie posiadasz pod ręką tokenu lub aplikacji OAuth? Załaduj zweryfikowane repozytoria ekosystemu Nexus (nexus-family-core, state-bella-matrix, nexus-brotherhood-engine) jednym kliknięciem.'
                        : 'No token or OAuth App configured yet? Instantly test with official Nexus ecosystem repositories with 1-click.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#070a12] border border-purple-500/20 text-xs font-mono-tech text-slate-300 space-y-1">
                    <div className="text-purple-300 font-bold">Oficjalne repozytoria demonstracyjne:</div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-400">
                      <li>krystian-nexus/nexus-family-core (Dual Ingress Gateway)</li>
                      <li>krystian-nexus/state-bella-matrix (Cognitive Synapse)</li>
                      <li>krystian-nexus/nexus-brotherhood-engine (Matchmaking Formula)</li>
                      <li>krystian-nexus/nexus-memory-rfc-base (Decentralized RFCs)</li>
                    </ul>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => connectGitHubDemo()}
                      disabled={githubState.isLoading}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-cyber font-bold text-xs transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{language === 'PL' ? 'Aktywuj Tryb Demonstracyjny' : 'Activate Demo Mode'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Etap 2A: NEXUS-DOCS GitHub Publisher Card */}
          {githubState.isConnected && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1322] via-[#090f1d] to-[#120e24] border border-cyan-500/40 shadow-[0_0_30px_rgba(0,240,255,0.12)] space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-cyber font-bold text-sm sm:text-base text-white tracking-wide">
                        WYSTAWIENIE NEXUS-DOCS NA GITHUBIE
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono-tech">
                        ETAP 2A • SYNAPSE HUB
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono-tech">
                      {language === 'PL'
                        ? `Eksport i rejestracja ${memoryDocs.length} dokumentów RFC i bazy wiedzy pamięci w postaci repozytorium GitHub`
                        : `Export and publish ${memoryDocs.length} memory docs and RFC specifications to GitHub repo`}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono-tech flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {memoryDocs.length} Dokumentów RFC
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div className="space-y-1 md:col-span-1">
                  <label className="text-[11px] font-mono-tech text-slate-300">
                    Nazwa repozytorium GitHub:
                  </label>
                  <input
                    type="text"
                    value={docsRepoName}
                    onChange={e => setDocsRepoName(e.target.value)}
                    placeholder="nexus-docs"
                    className="w-full bg-[#070a12] border border-cyan-500/30 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono-tech focus:outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-1">
                  <label className="text-[11px] font-mono-tech text-slate-300">
                    Widoczność w sieci:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setDocsIsPublic(!docsIsPublic);
                      playCyberSound('click');
                    }}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-mono-tech transition-all flex items-center justify-between ${
                      docsIsPublic
                        ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                        : 'bg-amber-950/50 border-amber-500/40 text-amber-300'
                    }`}
                  >
                    <span>{docsIsPublic ? '🌐 Repozytorium Publiczne (Public)' : '🔒 Repozytorium Prywatne (Private)'}</span>
                    <span className="text-[10px] uppercase font-bold">{docsIsPublic ? 'Public' : 'Private'}</span>
                  </button>
                </div>

                <div className="md:col-span-1">
                  <button
                    type="button"
                    onClick={async () => {
                      setIsPublishingDocs(true);
                      setDocsPublishSuccess(null);
                      const res = await publishNexusDocsToGitHub(docsRepoName.trim() || 'nexus-docs', docsIsPublic);
                      setIsPublishingDocs(false);
                      if (res.success && res.repoUrl) {
                        setDocsPublishSuccess(res.repoUrl);
                      }
                    }}
                    disabled={isPublishingDocs}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-cyber font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50"
                  >
                    <Sparkles className={`w-4 h-4 ${isPublishingDocs ? 'animate-spin' : ''}`} />
                    <span>
                      {isPublishingDocs
                        ? (language === 'PL' ? 'Wystawianie NEXUS-DOCS...' : 'Publishing NEXUS-DOCS...')
                        : (language === 'PL' ? 'Wystaw NEXUS-DOCS na GitHubie' : 'Expose NEXUS-DOCS to GitHub')}
                    </span>
                  </button>
                </div>
              </div>

              {/* Success Notification Bar */}
              {docsPublishSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono-tech flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <strong>Sukces Etapu 2A! </strong>
                      <span>Specyfikacja NEXUS-DOCS została pomyślnie opublikowana na GitHubie.</span>
                    </div>
                  </div>

                  <a
                    href={docsPublishSuccess}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-cyber font-bold text-[11px] flex items-center gap-1.5 shrink-0 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  >
                    <span>Otwórz Repozytorium NEXUS-DOCS</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Repositories Explorer Section */}
          {githubState.isConnected && (
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-cyber font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span>{language === 'PL' ? 'Repozytoria Kodu' : 'Repositories'}</span>
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono-tech">
                    {filteredRepos.length} / {githubState.repos.length}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={repoSearch}
                    onChange={e => setRepoSearch(e.target.value)}
                    placeholder={language === 'PL' ? 'Filtruj repozytoria...' : 'Filter repositories...'}
                    className="bg-[#0c1220] border border-cyan-500/20 focus:border-cyan-400 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none w-full sm:w-48"
                  />

                  {languages.length > 0 && (
                    <select
                      value={selectedLanguage}
                      onChange={e => setSelectedLanguage(e.target.value)}
                      className="bg-[#0c1220] border border-cyan-500/20 text-xs font-mono-tech text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="ALL">{language === 'PL' ? 'Wszystkie języki' : 'All languages'}</option>
                      {languages.map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Repos Grid */}
              {filteredRepos.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#090d16] border border-cyan-500/20 text-center space-y-2">
                  <FolderGit2 className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400 font-mono-tech">
                    {language === 'PL' ? 'Nie znaleziono repozytoriów spełniających kryteria.' : 'No repositories found.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRepos.map(repo => {
                    const linkedProject = projects.find(p => p.repoUrl === repo.html_url);
                    const selectedProjId = selectedProjectForLink[repo.id] || projects[0]?.id;

                    return (
                      <div
                        key={repo.id}
                        className="p-4 rounded-xl bg-[#0c1220] border border-cyan-500/20 hover:border-cyan-400/40 transition-all flex flex-col justify-between gap-3 group"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-cyber font-bold text-sm text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 group-hover:underline break-all"
                            >
                              <span>{repo.name}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>

                            <div className="flex items-center gap-1 shrink-0">
                              {repo.private ? (
                                <span className="px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[10px] font-mono-tech">
                                  Private
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono-tech">
                                  Public
                                </span>
                              )}
                            </div>
                          </div>

                          {repo.description && (
                            <p className="text-xs text-slate-400 font-mono-tech mt-1.5 line-clamp-2">
                              {repo.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] font-mono-tech text-slate-400">
                            {repo.language && (
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                                {repo.language}
                              </span>
                            )}
                            <span className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 text-amber-400" />
                              {repo.stargazers_count}
                            </span>
                            <span className="flex items-center gap-0.5">
                              <GitFork className="w-3 h-3 text-slate-400" />
                              {repo.forks_count}
                            </span>
                            {repo.default_branch && (
                              <span className="text-slate-500">
                                branch: {repo.default_branch}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Link to Nexus Project Bar */}
                        <div className="pt-3 border-t border-cyan-500/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                          {linkedProject ? (
                            <div className="flex items-center gap-1.5 text-[11px] font-mono-tech text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>
                                {language === 'PL' ? 'Przypisano do: ' : 'Linked to: '}
                                <strong>{linkedProject.title}</strong>
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 w-full">
                              <select
                                value={selectedProjId}
                                onChange={e =>
                                  setSelectedProjectForLink(prev => ({
                                    ...prev,
                                    [repo.id]: e.target.value
                                  }))
                                }
                                className="flex-1 bg-[#070a12] border border-cyan-500/20 text-[11px] font-mono-tech text-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-400 truncate"
                              >
                                {projects.map(p => (
                                  <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                              </select>

                              <button
                                onClick={() => linkGitHubRepoToProject(selectedProjId, repo.html_url)}
                                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 hover:text-white text-[11px] font-cyber tracking-wider transition-all shrink-0"
                              >
                                {language === 'PL' ? 'Przypisz' : 'Link'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-cyan-500/20 bg-[#06080e] flex items-center justify-between text-xs font-mono-tech text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px]">Nexus Developer Synapse • Dual Ingress Architecture</span>
          </div>

          <button
            onClick={() => {
              setIsGitHubModalOpen(false);
              playCyberSound('click');
            }}
            className="px-5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-cyber font-bold text-xs transition-all"
          >
            {language === 'PL' ? 'Zamknij' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
