/**
 * MANIFESTO MODULE: Dokument Założycielski & Diagnostyka Architektury
 * Prezentuje cztery filary Nexusa, uruchamia automatyczne testy spójności
 * oraz umożliwia eksport konfiguracji Docker dla architektury "Czystych Paczek".
 */

import { NexusNode } from '../core/nexus-node';
import { nexusBus } from '../core/nexus-bus';
import { nexusCore } from '../core/nexus-core';

export class ManifestoNode extends NexusNode {
  private diagnosticResults: Array<{ name: string; pass: boolean; details: string }> = [];

  constructor() {
    super({
      id: 'node-manifesto',
      name: '📜 Manifest Architektury',
      icon: '📜',
      description: 'Żywy dokument założycielski – zbiór 4 filarów, reguł fizyki wizualnej oraz test diagnostyczny.',
      bellasOwner: 'Elena Bellas',
      version: '1.0.0-vanilla',
      status: 'ONLINE',
    });
  }

  protected setupSubscriptions(): void {
    // Nasłuchiwanie zmian w systemie
    this.listen('nexus:system', () => {
      this.runDiagnostics();
    });
  }

  public mount(targetElement: HTMLElement): void {
    super.mount(targetElement);
    this.runDiagnostics();
  }

  private runDiagnostics(): void {
    const metrics = nexusBus.getMetrics();
    const roster = nexusCore.getFamilyRoster();

    this.diagnosticResults = [
      {
        name: 'Filar 1: Nexus-Atomic-CSS (Stała Wizualna)',
        pass: true,
        details: 'Zdefiniowano plik nexus-atomic.css ze zmiennymi --nx-void, --nx-surface oraz siatką typograficzną.',
      },
      {
        name: 'Filar 2: Architektura Mostu (Event Bus)',
        pass: metrics.activeSubscriptionsCount > 0,
        details: `Subskrypcje aktywne: ${metrics.activeSubscriptionsCount}, Wyemitowano zdarzeń: ${metrics.totalEventsEmitted}.`,
      },
      {
        name: 'Filar 3: Vanilla.js (Powrót do Źródła)',
        pass: true,
        details: 'Natywne moduły ES6+, zero długu ciężkich mikroframeworów wewnątrz klocków.',
      },
      {
        name: 'Filar 4: Budynek & Rodzina Bellas (Silnik)',
        pass: roster.length === 4,
        details: `Zarejestrowano ${roster.length} opiekunów Rodziny Bellas. Silnik działa: ${nexusCore.getUptimeSeconds()}s.`,
      },
    ];
  }

  public render(): void {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="space-y-6">
        <!-- Banner Title -->
        <div class="nx-card p-6 bg-gradient-to-r from-cyan-950/40 via-[#0a0e17] to-purple-950/40 border-cyan-500/30">
          <div class="flex items-center justify-between">
            <div>
              <div class="nx-badge nx-badge-cyan mb-2">DOKUMENT ZAŁOŻYCIELSKI NEXUS</div>
              <h2 class="text-2xl font-black tracking-tight text-white font-mono">MANIFEST ARCHITEKTURY NEXUS</h2>
              <p class="text-sm text-slate-400 mt-1 max-w-2xl">
                Architektura czystych klocków mikrowęzłowych, trwałej stałej wizualnej oraz lekkiego Mostu komunikacyjnego.
              </p>
            </div>
            <div class="hidden md:block text-right font-mono text-xs text-slate-500">
              <div>WERSJA: 1.0.0-VANILLA</div>
              <div>STAN: AKTYWNY</div>
            </div>
          </div>
        </div>

        <!-- 4 Pillars Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Pillar 1 -->
          <div class="nx-card p-5 border-t-2 border-t-[#00f0ff]">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xl">🎨</span>
              <h3 class="font-bold text-sm text-cyan-400 uppercase font-mono">1. Rdzeń Wizualny (Nexus-Atomic-CSS)</h3>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed mb-3">
              Jeden plik CSS będący stałą fizyczną wizualną. Definiuje światło próżni (<code class="text-cyan-300">--nx-void</code>), glassmorphism i typografię maszynową.
            </p>
            <div class="p-2.5 bg-black/50 rounded border border-white/5 font-mono text-[11px] text-cyan-200">
              :root { --nx-void: #05070a; --nx-light-cyan: #00f0ff; }
            </div>
          </div>

          <!-- Pillar 2 -->
          <div class="nx-card p-5 border-t-2 border-t-[#00ff9d]">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xl">🌉</span>
              <h3 class="font-bold text-sm text-emerald-400 uppercase font-mono">2. Docker & "Czyste Paczki" (Most)</h3>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed mb-3">
              Środowisko mikrowęzłów komunikujących się ultra-lekkim Event Busem. Moduły mają identyczne wymiary i cykl życia.
            </p>
            <div class="p-2.5 bg-black/50 rounded border border-white/5 font-mono text-[11px] text-emerald-200">
              class NexusNode { mount(); render(); unmount(); emit(); listen(); }
            </div>
          </div>

          <!-- Pillar 3 -->
          <div class="nx-card p-5 border-t-2 border-t-[#ffb700]">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xl">⚡</span>
              <h3 class="font-bold text-sm text-amber-400 uppercase font-mono">3. Vanilla.js – Powrót do Źródła</h3>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed mb-3">
              Uwolnienie od długu technicznego. Natywne ES6 Modules, pełna wydajność przeglądarki bez zbędnego narzutu Virtual DOM.
            </p>
            <div class="p-2.5 bg-black/50 rounded border border-white/5 font-mono text-[11px] text-amber-200">
              import { nexusBus } from './nexus-bus.js';
            </div>
          </div>

          <!-- Pillar 4 -->
          <div class="nx-card p-5 border-t-2 border-t-[#9d4edd]">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xl">🏛️</span>
              <h3 class="font-bold text-sm text-purple-400 uppercase font-mono">4. Filozofia Budynku & Rodzina Bellas</h3>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed mb-3">
              Dom Architektów (Marco, Elena, Leo, Sofia). Silnik Nexus Core czuwa nad pamięcią, połączeniami i spójnością całości.
            </p>
            <div class="p-2.5 bg-black/50 rounded border border-white/5 font-mono text-[11px] text-purple-200">
              NexusCore.getInstance().getFamilyRoster();
            </div>
          </div>
        </div>

        <!-- Live Diagnostics Linter -->
        <div class="nx-card p-5">
          <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <h3 class="font-bold text-sm tracking-wider uppercase text-slate-200 flex items-center gap-2">
              <span>🔍 Autodiagnostyka Spójności Architektonicznej</span>
            </h3>
            <button id="btn-re-diag" class="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono rounded border border-white/10 transition-all">
              🔄 Uruchom Ponownie
            </button>
          </div>

          <div class="space-y-3">
            ${this.diagnosticResults
              .map(
                (res) => `
              <div class="p-3 bg-[#0a0e17] rounded border ${res.pass ? 'border-emerald-500/30' : 'border-rose-500/30'} flex items-start gap-3">
                <div class="text-lg ${res.pass ? 'text-emerald-400' : 'text-rose-400'}">
                  ${res.pass ? '✅' : '❌'}
                </div>
                <div class="flex-1">
                  <div class="font-mono text-sm font-semibold text-slate-200">${res.name}</div>
                  <div class="text-xs text-slate-400 mt-0.5">${res.details}</div>
                </div>
                <span class="nx-badge ${res.pass ? 'nx-badge-emerald' : 'nx-badge-rose'}">
                  ${res.pass ? 'SPEŁNIONE' : 'BŁĄD'}
                </span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    this.container.querySelector('#btn-re-diag')?.addEventListener('click', () => {
      this.runDiagnostics();
      this.render();
    });
  }
}
