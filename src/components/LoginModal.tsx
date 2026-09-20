import React, { useState } from 'react';
import { signInWithEmail, signUpWithEmail, loginWithGoogle } from '../core/firebase';
import { Lock, Mail, AlertCircle, CheckCircle, ArrowRight, ShieldCheck, Terminal, X, HelpCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onOpenDiagnostics?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess = () => {},
  onOpenDiagnostics,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<{ friendly: string; technical: string } | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    setValidationError(null);
    setAuthError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setValidationError('Wprowadź adres e-mail.');
      return false;
    }
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setValidationError('Wprowadź poprawny adres e-mail (np. user@nexus.io).');
      return false;
    }
    if (!password) {
      setValidationError('Wprowadź hasło.');
      return false;
    }
    if (password.length < 6) {
      setValidationError('Hasło musi składać się z minimum 6 znaków.');
      return false;
    }
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setAuthError(null);
    setAuthSuccess(null);

    try {
      if (mode === 'signin') {
        const res = await signInWithEmail(email, password);
        if (res.error) {
          setAuthError(res.error);
        } else if (res.user) {
          setAuthSuccess(`Uwierzytelniono pomyślnie jako: ${res.user.email}`);
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 800);
        }
      } else {
        const res = await signUpWithEmail(email, password);
        if (res.error) {
          setAuthError(res.error);
        } else if (res.user) {
          setAuthSuccess(`Konto utworzone pomyślnie dla: ${res.user.email}`);
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 800);
        }
      }
    } catch (err: any) {
      setAuthError({
        friendly: 'Wystąpił nieoczekiwany błąd uwierzytelniania.',
        technical: err.message || 'unknown_exception',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setValidationError(null);
    setAuthError(null);
    setAuthSuccess(null);

    try {
      const res = await loginWithGoogle();
      if (res.error) {
        setAuthError(res.error);
      } else if (res.user) {
        setAuthSuccess(`Uwierzytelniono przez Google: ${res.user.email}`);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setAuthError({
        friendly: 'Błąd sesji Google Auth.',
        technical: err.message || 'google_popup_exception',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#070913] border border-[#00E5FF]/40 rounded-2xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(0,229,255,0.25)] relative overflow-hidden font-mono-tech">
        {/* Top ambient glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#00E5FF]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#A855F7]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A2234] pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                NEXUS IDENTITY ACCESS
              </h2>
              <span className="text-[10px] text-[#64748B]">
                Weryfikacja tożsamości Firebase Authentication
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Sign In / Sign Up */}
        <div className="flex rounded-lg bg-[#0C101C] p-1 border border-[#1A2234] mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setAuthError(null);
              setValidationError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold uppercase rounded transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                : 'text-[#64748B] hover:text-white'
            }`}
          >
            LOGOWANIE
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setAuthError(null);
              setValidationError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold uppercase rounded transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                : 'text-[#64748B] hover:text-white'
            }`}
          >
            REJESTRACJA
          </button>
        </div>

        {/* Real Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-[#00E5FF]" />
              Adres E-mail
            </label>
            <input
              id="nexus-auth-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="architekt@nexus.corp"
              disabled={loading}
              className="w-full px-3.5 py-2.5 bg-[#090C16] border border-[#1A2234] focus:border-[#00E5FF] focus:outline-none rounded-lg text-white text-xs placeholder-[#475569] transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-[#00E5FF]" />
              Hasło dostępowe
            </label>
            <input
              id="nexus-auth-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={loading}
              className="w-full px-3.5 py-2.5 bg-[#090C16] border border-[#1A2234] focus:border-[#00E5FF] focus:outline-none rounded-lg text-white text-xs placeholder-[#475569] transition-all"
            />
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="p-2.5 bg-[#FF3B5C]/10 border border-[#FF3B5C]/30 rounded-lg text-xs text-[#FF3B5C] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Auth Error Banner (Section 11) */}
          {authError && (
            <div className="p-3 bg-[#FF3B5C]/10 border border-[#FF3B5C]/40 rounded-lg space-y-1 text-left">
              <div className="text-xs font-bold text-[#FF3B5C] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError.friendly}</span>
              </div>
              <div className="text-[10px] font-mono text-[#CBD5E1] bg-[#05070D] p-1.5 rounded border border-[#FF3B5C]/20 break-all">
                <span className="text-[#64748B]">Szczegóły techniczne: </span>
                <span className="text-amber-400 font-bold">{authError.technical}</span>
              </div>
              {authError.technical === 'auth/unauthorized-domain' && (
                <div className="text-[10px] text-[#94A3B8] pt-1">
                  Dodaj domenę podglądu w konsoli Firebase &rarr; Authentication &rarr; Settings &rarr; Authorized domains.
                </div>
              )}
              {authError.technical === 'auth/operation-not-allowed' && (
                <div className="text-[10px] text-[#94A3B8] pt-1">
                  Włącz metodę logowania 'Email/Hasło' w konsoli Firebase &rarr; Authentication &rarr; Sign-in method.
                </div>
              )}
            </div>
          )}

          {/* Auth Success Banner */}
          {authSuccess && (
            <div className="p-3 bg-[#00D9A6]/10 border border-[#00D9A6]/40 rounded-lg text-xs text-[#00D9A6] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            id="nexus-auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#00E5FF] hover:bg-[#00c2d6] text-[#05070D] font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.25)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-[#05070D] border-t-transparent rounded-full animate-spin" />
                <span>WERYFIKACJA FIREBASE...</span>
              </span>
            ) : (
              <>
                <span>{mode === 'signin' ? 'ZALOGUJ DO NEXUSA' : 'UTWÓRZ KONTO'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-[#1A2234]" />
          <span className="px-3 text-[10px] text-[#64748B] uppercase">LUB</span>
          <div className="flex-1 border-t border-[#1A2234]" />
        </div>

        {/* Google Sign-In Provider */}
        <button
          id="nexus-auth-google-btn"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-[#0C101C] hover:bg-[#121827] border border-[#1A2234] hover:border-[#00E5FF]/40 text-white text-xs font-bold uppercase transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.4)] disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>ZALOGUJ PRZEZ GOOGLE</span>
        </button>

        {/* Footer info & Diagnostics launcher */}
        <div className="mt-4 pt-3 border-t border-[#121827] flex items-center justify-between text-[10px] text-[#64748B]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D9A6]" />
            Real Firebase Auth
          </span>
          {onOpenDiagnostics && (
            <button
              type="button"
              onClick={onOpenDiagnostics}
              className="text-[#A855F7] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Terminal className="w-3 h-3" />
              <span>NEXUS AUTH DIAGNOSTICS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
