import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  ShieldAlert, 
  RefreshCw, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Terminal,
  Activity
} from 'lucide-react';
import { nexusLogger } from '../services/loggerService';

interface Props {
  children: ReactNode;
  moduleName?: string;
  fallbackTitle?: string;
  onReset?: () => void;
  showMinimalFallback?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isDetailsExpanded: boolean;
  isCopied: boolean;
  timestamp: number;
}

export class NexusErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isDetailsExpanded: false,
      isCopied: false,
      timestamp: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      timestamp: Date.now()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Zgłoszenie błędu do centralnego systemu telemetrii Nexusa
    nexusLogger.fatal(
      'UI',
      this.props.moduleName || 'NexusErrorBoundary',
      error.message || 'Nieoczekiwany wyjątek komponentu React',
      error,
      {
        componentStack: errorInfo.componentStack,
        url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: Date.now()
      }
    );
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isDetailsExpanded: false,
      isCopied: false
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  handleCopyDiagnostic = () => {
    if (!this.state.error) return;
    const diagnosticReport = {
      timestamp: new Date(this.state.timestamp).toISOString(),
      module: this.props.moduleName || 'NexusErrorBoundary',
      errorName: this.state.error.name,
      errorMessage: this.state.error.message,
      stack: this.state.error.stack,
      componentStack: this.state.errorInfo?.componentStack,
      recentLogs: nexusLogger.getLogs({ level: 'ERROR_AND_FATAL' }).slice(0, 10)
    };

    navigator.clipboard.writeText(JSON.stringify(diagnosticReport, null, 2));
    this.setState({ isCopied: true });
    setTimeout(() => this.setState({ isCopied: false }), 2500);
  };

  handleSafeResetStorage = () => {
    if (typeof window !== 'undefined') {
      if (confirm('Czy na pewno chcesz zresetować pamięć lokalną w trybie awaryjnym? Twoje książki i zakładki w chmurze pozostaną bezpieczne.')) {
        try {
          localStorage.removeItem('nexusbook_draft_books');
          localStorage.removeItem('nexus_crash_telemetry');
        } catch {
          // ignore
        }
        window.location.reload();
      }
    }
  };

  render() {
    if (this.state.hasError) {
      const { moduleName = 'Węzeł Główny', fallbackTitle } = this.props;
      const error = this.state.error;

      // Zminimalizowany fallback dla małych widżetów
      if (this.props.showMinimalFallback) {
        return (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>BŁĄD MODUŁU: {moduleName}</span>
              </div>
              <button
                onClick={this.handleReset}
                className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[10px] flex items-center gap-1 cursor-pointer transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                <span>PONÓW</span>
              </button>
            </div>
            <p className="text-[11px] text-white/70 line-clamp-2">
              {error?.message || 'Wystąpił nieoczekiwany błąd w tym widżecie.'}
            </p>
          </div>
        );
      }

      // Pełnoekranowy lub modułowy ekran ratunkowy Nexusa
      return (
        <div className="min-h-[400px] w-full p-6 sm:p-8 rounded-2xl bg-slate-950/95 border border-red-500/40 shadow-2xl backdrop-blur-xl flex flex-col justify-center items-center text-center space-y-6 my-auto font-sans">
          {/* Header Icon & Status */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/40 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/10">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-red-600 text-white font-mono text-[9px] font-bold tracking-widest uppercase">
              FAIL-SAFE
            </span>
          </div>

          {/* Titles & Message */}
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/30 text-red-400 font-mono text-[11px] tracking-wider uppercase">
              <Activity className="w-3.5 h-3.5" />
              <span>PROTOKÓŁ IZOLACJI AWARII NEXUSA</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {fallbackTitle || `Węzeł interfejsu [${moduleName}] napotkał wyjątek`}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Architektura Nexusa zabezpieczyła stan systemu i odizolowała komponent, zapobiegając utracie danych. Szczegóły awarii zostały zarejestrowane w rejestrze telemetrii.
            </p>
          </div>

          {/* User-friendly Highlight Card */}
          <div className="w-full max-w-xl p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 text-left font-mono text-xs text-red-200/90 flex items-start gap-3">
            <Terminal className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1 overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-red-400 block tracking-wider">
                KOMUNIKAT SYSTEMOWY:
              </span>
              <p className="text-white text-xs font-semibold break-words">
                {error?.name || 'Error'}: {error?.message || 'Nieznany błąd wykonania'}
              </p>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-xl">
            <button
              onClick={this.handleReset}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ZRESETUJ WĘZEŁ</span>
            </button>

            <button
              onClick={this.handleReload}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>ODŚWIEŻ ARCHIWUM</span>
            </button>

            <button
              onClick={this.handleCopyDiagnostic}
              className="px-3.5 py-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              {this.state.isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{this.state.isCopied ? 'SKOPIOWANO JSON' : 'KOPIUJ RAPORT'}</span>
            </button>

            <button
              onClick={() => nexusLogger.downloadLogsAsFile()}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-all"
              title="Pobierz pełny dziennik zdarzeń .json"
            >
              <Download className="w-4 h-4" />
              <span>POBIERZ LOGI</span>
            </button>
          </div>

          {/* Technical Diagnostics Accordion */}
          <div className="w-full max-w-xl text-left border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => this.setState({ isDetailsExpanded: !this.state.isDetailsExpanded })}
              className="w-full flex items-center justify-between py-2 text-xs font-mono text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                SZCZEGÓŁY TECHNICZNE DLA ARCHITEKTA
              </span>
              {this.state.isDetailsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {this.state.isDetailsExpanded && (
              <div className="mt-3 p-4 rounded-xl bg-black/80 border border-white/15 font-mono text-[11px] text-slate-300 space-y-3 overflow-x-auto max-h-60 select-text">
                <div>
                  <span className="text-red-400 font-bold block mb-1">Stack Trace:</span>
                  <pre className="text-white/80 whitespace-pre-wrap leading-relaxed text-[10px]">
                    {error?.stack || 'Brak śladu stosu wywołań.'}
                  </pre>
                </div>
                {this.state.errorInfo?.componentStack && (
                  <div>
                    <span className="text-cyan-400 font-bold block mb-1">Component Stack:</span>
                    <pre className="text-white/70 whitespace-pre-wrap leading-relaxed text-[10px]">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Czas: {new Date(this.state.timestamp).toLocaleString()}</span>
                  <button
                    onClick={this.handleSafeResetStorage}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Tryb awaryjny (wyczyść cache)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
