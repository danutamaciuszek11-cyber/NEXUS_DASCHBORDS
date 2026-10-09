/**
 * NEXUS TELEMETRY & LOGGING SERVICE (Eterion Core Engine)
 * Centralna szyna zbierania logów, obsługi wyjątków, monitoringu modułów i telemetrii błędów.
 */

import { LogLevel, LogCategory, NexusLogEntry, LoggerFilterOptions, LoggerStats } from '../types';
import { nexusBus } from '../nexus/core/nexus-bus';

type LogListener = (entry: NexusLogEntry) => void;

class NexusLoggerService {
  private static instance: NexusLoggerService;
  private memoryBuffer: NexusLogEntry[] = [];
  private maxBufferSize = 300;
  private listeners: Set<LogListener> = new Set();
  private isGlobalHandlerAttached = false;
  private storageKey = 'nexus_crash_telemetry';
  private lastLoggedSignature: { sig: string; timestamp: number } = { sig: '', timestamp: 0 };

  private constructor() {
    this.loadPersistedCrashLogs();
    this.initGlobalWindowHandlers();
  }

  public static getInstance(): NexusLoggerService {
    if (!NexusLoggerService.instance) {
      NexusLoggerService.instance = new NexusLoggerService();
    }
    return NexusLoggerService.instance;
  }

  /**
   * Ładowanie logów awarii z pamięci trwałej (localStorage) w celu analizy powypadkowej
   */
  private loadPersistedCrashLogs() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed: NexusLogEntry[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.memoryBuffer = parsed.slice(0, 100);
        }
      }
    } catch {
      // Bezpieczny fallback w przypadku uszkodzenia pamięci podręcznej
    }
  }

  /**
   * Zapisywanie najważniejszych błędów w trwałej pamięci dla analizy powypadkowej
   */
  private persistCrashLogs() {
    if (typeof window === 'undefined') return;
    try {
      const highSeverityLogs = this.memoryBuffer
        .filter(l => l.level === 'WARN' || l.level === 'ERROR' || l.level === 'FATAL')
        .slice(0, 50);
      localStorage.setItem(this.storageKey, JSON.stringify(highSeverityLogs));
    } catch {
      // Ignorujemy błędy limitów localStorage
    }
  }

  /**
   * Podpięcie globalnych nasłuchów okna na nieobsłużone wyjątki i obietnice
   */
  public initGlobalWindowHandlers() {
    if (this.isGlobalHandlerAttached || typeof window === 'undefined') return;
    this.isGlobalHandlerAttached = true;

    // 1. Uncaught JS Runtime Errors
    window.addEventListener('error', (event: ErrorEvent) => {
      // Ignorujemy znane błędy Vite HMR websocket z sandboksa
      if (event.message && event.message.includes('[vite] failed to connect to websocket')) {
        return;
      }
      this.error(
        'SYSTEM',
        'WindowRuntime',
        event.message || 'Nieoczekiwany błąd wykonania skryptu',
        event.error || new Error(event.message),
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        },
        true
      );
    });

    // 2. Unhandled Promise Rejections
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      // Ignorujemy puste obietnice, zamknięcia dialogów lub anulowane zapytania
      if (!event.reason) {
        event.preventDefault?.();
        return;
      }
      if (typeof event.reason === 'object' && Object.keys(event.reason).length === 0) {
        event.preventDefault?.();
        return;
      }

      let reasonMessage = 'Błąd wykonania zadania asynchronicznego';
      let details: any = undefined;
      let errObj: Error | undefined = undefined;

      if (event.reason instanceof Error) {
        errObj = event.reason;
        reasonMessage = event.reason.message || reasonMessage;
      } else if (typeof event.reason === 'string') {
        reasonMessage = event.reason;
      } else if (typeof event.reason === 'object') {
        details = event.reason;
        reasonMessage = event.reason.message || event.reason.error || 'Zgłoszono ostrzeżenie asynchroniczne';
      }

      // Ignorujemy znane nieszkodliwe odrzucenia autoplay/audio policy
      const rawMsg = (reasonMessage + ' ' + (errObj?.message || '')).toLowerCase();
      if (rawMsg.includes('audiocontext') || rawMsg.includes('user gesture') || rawMsg.includes('abort') || rawMsg.includes('play() failed')) {
        event.preventDefault?.();
        return;
      }

      this.warn('CORE', 'AsyncPromise', reasonMessage, details || errObj, false);
    });
  }

  /**
   * Tłumaczenie technicznych błędów na zrozumiały, elegancki język dla użytkownika
   */
  private generateUserFriendlyMessage(
    level: LogLevel,
    category: LogCategory,
    module: string,
    message: string,
    error?: Error | unknown
  ): string {
    const raw = `${message} ${error instanceof Error ? error.message : ''}`.toLowerCase();

    if (raw.includes('auth/unauthorized-domain')) {
      return 'Bieżąca domena podglądu wymaga dodania do Authorized Domains w Firebase Auth lub użycia szybkiego logowania Architekta.';
    }
    if (raw.includes('auth/popup-blocked')) {
      return 'Przeglądarka zablokowała wyskakujące okienko autoryzacji Google. Zezwól na popupy w pasku adresu.';
    }
    if (raw.includes('quotaexceedederror') || raw.includes('storage full')) {
      return 'Osiągnięto limit pamięci przeglądarki. Dane zostały zabezpieczone w pamięci operacyjnej.';
    }
    if (raw.includes('networkerror') || raw.includes('failed to fetch') || raw.includes('offline')) {
      return 'Brak stabilnego połączenia sieciowego. Węzeł kontynuuje bezpieczną pracę w trybie lokalnym offline.';
    }
    if (raw.includes('audiocontext') || raw.includes('user gesture')) {
      return 'Moduł audio oczekuje na pierwszą interakcję z interfejsem (wymóg polityki bezpieczeństwa audio).';
    }
    if (raw.includes('permission-denied')) {
      return 'Brak autoryzacji kryptograficznej do wybranego zasobu w chmurze.';
    }

    if (level === 'FATAL') {
      return `Moduł '${module}' uległ awarii. Uruchomiono mechanizm izolacji błędu (Fail-Safe).`;
    }
    if (level === 'ERROR') {
      return `Wystąpił problem w module '${module}': ${message.length > 90 ? message.slice(0, 90) + '...' : message}`;
    }
    if (level === 'WARN') {
      return `Ostrzeżenie modułu '${module}': ${message.length > 90 ? message.slice(0, 90) + '...' : message}`;
    }

    return message;
  }

  /**
   * Główna metoda rejestracji wpisu telemetrii
   */
  public log(
    level: LogLevel,
    category: LogCategory,
    module: string,
    message: string,
    details?: Record<string, any> | string,
    error?: Error | unknown,
    notifyUser: boolean = false
  ): NexusLogEntry {
    const signature = `${level}:${category}:${module}:${message}`;
    const now = Date.now();

    // Deduplikacja powtarzających się logów w oknie 2 sekund
    if (this.lastLoggedSignature.sig === signature && now - this.lastLoggedSignature.timestamp < 2000) {
      if (this.memoryBuffer.length > 0 && this.memoryBuffer[0]) {
        this.memoryBuffer[0].count = (this.memoryBuffer[0].count || 1) + 1;
        this.memoryBuffer[0].timestamp = now;
        return this.memoryBuffer[0];
      }
    }
    this.lastLoggedSignature = { sig: signature, timestamp: now };

    let stack: string | undefined = undefined;
    if (error instanceof Error) {
      stack = error.stack;
    }

    const userFriendlyMessage = this.generateUserFriendlyMessage(level, category, module, message, error);

    const entry: NexusLogEntry = {
      id: `nx-log-${now}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: now,
      level,
      category,
      module,
      message,
      userFriendlyMessage,
      details,
      stack,
      handled: true,
      notifyUser: notifyUser ?? (level === 'ERROR' || level === 'FATAL'),
      url: typeof window !== 'undefined' ? window.location.pathname : '',
      count: 1
    };

    // Konsola developerska z odpowiednią stylizacją
    this.printToConsole(entry);

    // Zapis do bufora kołowego
    this.memoryBuffer.unshift(entry);
    if (this.memoryBuffer.length > this.maxBufferSize) {
      this.memoryBuffer.pop();
    }

    // Zapis do trwałego bufora awarii w przypadku błędów
    if (level === 'WARN' || level === 'ERROR' || level === 'FATAL') {
      this.persistCrashLogs();
    }

    // Emisja na Most Zdarzeń Nexusa (nexusBus)
    try {
      nexusBus.emit('nexus:log', module, entry);
      if (level === 'ERROR' || level === 'FATAL') {
        nexusBus.emit('nexus:error', module, entry);
      }
    } catch {
      // Ignorujemy błędy Mostu
    }

    // Powiadomienie subskrybentów UI
    this.listeners.forEach(fn => {
      try {
        fn(entry);
      } catch (err) {
        console.error('[NexusLogger] Listener failed:', err);
      }
    });

    return entry;
  }

  /**
   * Kolorowe, strukturalne logowanie do konsoli przeglądarki
   */
  private printToConsole(entry: NexusLogEntry) {
    const time = new Date(entry.timestamp).toLocaleTimeString();
    const prefix = `[NEXUS ${entry.level}] [${entry.category}:${entry.module}] ${time}:`;

    switch (entry.level) {
      case 'DEBUG':
        console.debug(`%c${prefix}`, 'color: #94a3b8; font-weight: bold;', entry.message, entry.details || '');
        break;
      case 'INFO':
        console.info(`%c${prefix}`, 'color: #06b6d4; font-weight: bold;', entry.message, entry.details || '');
        break;
      case 'WARN':
        console.warn(`%c${prefix}`, 'color: #f59e0b; font-weight: bold;', entry.message, entry.details || '');
        break;
      case 'ERROR':
        console.error(`%c${prefix}`, 'color: #ef4444; font-weight: bold;', entry.message, entry.details || '', entry.stack || '');
        break;
      case 'FATAL':
        console.error(`%c${prefix} [CRITICAL HALT]`, 'color: #ffffff; background: #dc2626; font-weight: bold; padding: 2px 6px; border-radius: 4px;', entry.message, entry.details || '', entry.stack || '');
        break;
    }
  }

  // --- API Metody Skrótowe ---

  public debug(category: LogCategory, module: string, message: string, details?: any) {
    return this.log('DEBUG', category, module, message, details, undefined, false);
  }

  public info(category: LogCategory, module: string, message: string, details?: any) {
    return this.log('INFO', category, module, message, details, undefined, false);
  }

  public warn(category: LogCategory, module: string, message: string, details?: any, notifyUser: boolean = false) {
    return this.log('WARN', category, module, message, details, undefined, notifyUser);
  }

  public error(
    category: LogCategory,
    module: string,
    message: string,
    error?: Error | unknown,
    details?: any,
    notifyUser: boolean = true
  ) {
    return this.log('ERROR', category, module, message, details, error, notifyUser);
  }

  public fatal(
    category: LogCategory,
    module: string,
    message: string,
    error?: Error | unknown,
    details?: any
  ) {
    return this.log('FATAL', category, module, message, details, error, true);
  }

  /**
   * Złapanie dowolnego wyjątku w bloku try/catch
   */
  public captureException(error: Error | unknown, context: { module: string; category?: LogCategory; message?: string; notifyUser?: boolean }) {
    const category = context.category || 'CORE';
    const message = context.message || (error instanceof Error ? error.message : 'Zgłoszono wyjątek');
    return this.error(category, context.module, message, error, undefined, context.notifyUser ?? true);
  }

  // --- Subskrypcje i Zarządzanie ---

  public subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getLogs(options: LoggerFilterOptions = {}): NexusLogEntry[] {
    return this.memoryBuffer.filter(entry => {
      if (options.level && options.level !== 'ALL') {
        if (options.level === 'ERROR_AND_FATAL') {
          if (entry.level !== 'ERROR' && entry.level !== 'FATAL') return false;
        } else if (entry.level !== options.level) {
          return false;
        }
      }

      if (options.category && options.category !== 'ALL') {
        if (entry.category !== options.category) return false;
      }

      if (options.module) {
        if (!entry.module.toLowerCase().includes(options.module.toLowerCase())) return false;
      }

      if (options.searchTerm) {
        const query = options.searchTerm.toLowerCase();
        const inMessage = entry.message.toLowerCase().includes(query);
        const inModule = entry.module.toLowerCase().includes(query);
        const inFriendly = entry.userFriendlyMessage?.toLowerCase().includes(query) || false;
        if (!inMessage && !inModule && !inFriendly) return false;
      }

      return true;
    });
  }

  public getStats(): LoggerStats {
    let debugCount = 0;
    let infoCount = 0;
    let warnCount = 0;
    let errorCount = 0;
    let fatalCount = 0;
    let lastErrorTimestamp: number | undefined = undefined;

    this.memoryBuffer.forEach(entry => {
      if (entry.level === 'DEBUG') debugCount += (entry.count || 1);
      if (entry.level === 'INFO') infoCount += (entry.count || 1);
      if (entry.level === 'WARN') warnCount += (entry.count || 1);
      if (entry.level === 'ERROR') {
        errorCount += (entry.count || 1);
        if (!lastErrorTimestamp || entry.timestamp > lastErrorTimestamp) {
          lastErrorTimestamp = entry.timestamp;
        }
      }
      if (entry.level === 'FATAL') {
        fatalCount += (entry.count || 1);
        if (!lastErrorTimestamp || entry.timestamp > lastErrorTimestamp) {
          lastErrorTimestamp = entry.timestamp;
        }
      }
    });

    return {
      totalLogs: this.memoryBuffer.length,
      debugCount,
      infoCount,
      warnCount,
      errorCount,
      fatalCount,
      lastErrorTimestamp,
      activeErrorCount: errorCount + fatalCount
    };
  }

  public clearLogs() {
    this.memoryBuffer = [];
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.storageKey);
      } catch {
        // Ignorujemy błędy pamięci podręcznej
      }
    }
    this.info('SYSTEM', 'Logger', 'Pamięć podręczna logów została wyczyszczona.');
  }

  public exportAsJson(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        system: 'Nexus Architecture - Eterion Engine',
        stats: this.getStats(),
        logs: this.memoryBuffer
      },
      null,
      2
    );
  }

  public downloadLogsAsFile() {
    if (typeof window === 'undefined') return;
    const jsonStr = this.exportAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-diagnostic-logs-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Sonda diagnostyczna do testowania mechanizmu błędów na żądanie
   */
  public triggerDiagnosticProbe(type: 'warn' | 'error' | 'fatal') {
    if (type === 'warn') {
      this.warn(
        'CORE',
        'DiagnosticProbe',
        'Symulowane ostrzeżenie diagnostyczne telemetrii Nexusa.',
        { simulated: true, latencyMs: 42 },
        true
      );
    } else if (type === 'error') {
      this.error(
        'NETWORK',
        'DiagnosticProbe',
        'Symulowany błąd synchronizacji węzła (Test Handled Error).',
        new Error('DiagnosticProbeError: Test pipeline execution simulated'),
        { simulated: true, code: 'ERR_DIAGNOSTIC_PROBE' },
        true
      );
    } else {
      this.fatal(
        'SYSTEM',
        'DiagnosticProbe',
        'Krytyczna próba izolacji błędu (Test Fatal Failure).',
        new Error('DiagnosticFatalError: Simulated core node failure'),
        { simulated: true, integrityScore: 0.12 }
      );
    }
  }
}

export const nexusLogger = NexusLoggerService.getInstance();
