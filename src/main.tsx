import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const msg = (error?.message || '').toLowerCase();
    const stack = (error?.stack || '').toLowerCase();
    if (
      msg.includes('could not establish connection') ||
      msg.includes('receiving end does not exist') ||
      msg.includes('message port closed') ||
      msg.includes('extension context invalidated') ||
      msg.includes('metamask') ||
      msg.includes('se is not a function') ||
      msg.includes('t is not a function') ||
      msg.includes('e is not a function') ||
      stack.includes('chrome-extension') ||
      stack.includes('moz-extension') ||
      stack.includes('safari-web-extension')
    ) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[NEXUS RUNTIME] Uncaught Error caught by GlobalErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#05070D] text-white flex flex-col items-center justify-center p-6 text-center font-mono">
          <div className="w-16 h-16 rounded-2xl bg-[#FF3B5C]/15 border border-[#FF3B5C]/30 flex items-center justify-center text-[#FF3B5C] text-3xl mb-4">
            ⚠️
          </div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-[#FF3B5C] mb-2">
            NEXUS OS RECOVERY MODE
          </h1>
          <p className="text-sm text-[#94A3B8] max-w-lg mb-6">
            {this.state.error?.message || 'An unexpected runtime error occurred. System state is protected.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#00E5FF]/20 border border-[#00E5FF] text-[#00E5FF] font-semibold text-xs uppercase tracking-wider hover:bg-[#00E5FF]/30 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)]"
          >
            Restart Nexus Subsystem
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <GlobalErrorBoundary>
        <App />
      </GlobalErrorBoundary>
    </StrictMode>,
  );
}
