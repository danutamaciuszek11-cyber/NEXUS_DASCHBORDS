/**
 * DASHBOARD MODULE: Pulpit Bellas & Telemetria Węzłów
 * Prezentuje w czasie rzeczywistym stan Mostu, Rodziny Bellas oraz rejestracji klocków.
 */

import { NexusNode } from '../core/nexus-node';
import { nexusBus } from '../core/nexus-bus';
import { nexusCore } from '../core/nexus-core';

export class DashboardNode extends NexusNode {
  private timerId: any = null;

  constructor() {
    super({
      id: 'node-dashboard',
      name: '🏛️ Pulpit Bellas (Dashboard)',
      icon: '🏛️',
      description: 'Centrum telemetrii, monitorowania przesyłu zdarzeń i statusu domowników Rodziny Bellas.',
      bellasOwner: 'Marco Bellas',
      version: '1.0.0-vanilla',
      status: 'ONLINE',
    });
  }

  protected setupSubscriptions(): void {
    // Nasłuchiwanie na telemetrię systemu oraz impulsy rodziny
    this.listen('bellas:pulse', () => this.renderTelemetryOnly());
    this.listen('nexus:system', () => this.renderTelemetryOnly());
    this.listen('scribe:dispatch', () => this.renderTelemetryOnly());
  }

  public mount(targetElement: HTMLElement): void {
    super.mount(targetElement);
    // Odświeżanie zegara uptime i przepustowości co sekundę
    this.timerId = setInterval(() => {
      this.updateTimers();
    }, 1000);
  }

  public unmount(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    super.unmount();
  }

  public render(): void {
    if (!this.container) return;

    const metrics = nexusBus.getMetrics();
    const roster = nexusCore.getFamilyRoster();
    const nodes = nexusCore.getAllNodes();

    this.container.innerHTML = `
      <div class="space-y-6">
        <!-- Top Telemetry Row -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="nx-card p-4 border-l-2 border-l-[#00f0ff]">
            <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>PRZEPUSTOWOŚĆ MOŚTU</span>
              <span class="nx-pulse-dot text-[#00f0ff]"></span>
            </div>
            <div class="text-2xl font-bold nx-mono text-[#00f0ff]" id="dash-tp">${metrics.throughputPerMin} <span class="text-xs font-normal text-slate-400">evt/min</span></div>
            <div class="text-[11px] text-slate-500 mt-1">Suma impulsów: ${metrics.totalEventsEmitted}</div>
          </div>

          <div class="nx-card p-4 border-l-2 border-l-[#00ff9d]">
            <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>AKTYWNE SUBSKRYPCJE</span>
              <span class="nx-pulse-dot text-[#00ff9d]"></span>
            </div>
            <div class="text-2xl font-bold nx-mono text-[#00ff9d]">${metrics.activeSubscriptionsCount}</div>
            <div class="text-[11px] text-slate-500 mt-1">Kanały w użyciu: ${Object.keys(metrics.channelCounts).length}</div>
          </div>

          <div class="nx-card p-4 border-l-2 border-l-[#ffb700]">
            <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>RODZINA BELLAS</span>
              <span class="nx-pulse-dot text-[#ffb700]"></span>
            </div>
            <div class="text-2xl font-bold nx-mono text-[#ffb700]">${roster.length} <span class="text-xs font-normal text-slate-400">Osoby</span></div>
            <div class="text-[11px] text-slate-500 mt-1">Status: Wszyscy Gotowi</div>
          </div>

          <div class="nx-card p-4 border-l-2 border-l-[#9d4edd]">
            <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>CZAS PRACY RDZENIA</span>
              <span class="nx-pulse-dot text-[#9d4edd]"></span>
            </div>
            <div class="text-2xl font-bold nx-mono text-[#9d4edd]" id="dash-uptime">${nexusCore.getUptimeSeconds()}s</div>
            <div class="text-[11px] text-slate-500 mt-1">Natywny Silnik Core</div>
          </div>
        </div>

        <!-- Main Dashboard Split: Rodzina Bellas vs Telemetria Kanałów -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Roster Rodziny Bellas -->
          <div class="nx-card p-5">
            <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 class="font-bold text-sm tracking-wider uppercase text-cyan-400 flex items-center gap-2">
                <span>🏛️ Dom Rodziny Bellas</span>
              </h3>
              <span class="nx-badge nx-badge-cyan">STAŁA WIZUALNA</span>
            </div>

            <div class="space-y-3" id="bellas-roster-list">
              ${roster
                .map(
                  (m) => `
                <div class="p-3 bg-[#0a0e17]/80 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-colors flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-xl shadow-inner">
                      ${m.avatar}
                    </div>
                    <div>
                      <div class="font-semibold text-sm text-slate-200 flex items-center gap-2">
                        ${m.name}
                        <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">${m.role}</span>
                      </div>
                      <div class="text-xs text-slate-400 italic mt-0.5">"${m.quote}"</div>
                    </div>
                  </div>
                  <button 
                    data-bellas-id="${m.id}" 
                    class="btn-pulse-trigger text-xs px-2.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded font-mono transition-all flex items-center gap-1">
                    <span>⚡ Impuls</span>
                  </button>
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- Micro-Nodes Registry Status & Channels -->
          <div class="nx-card p-5">
            <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 class="font-bold text-sm tracking-wider uppercase text-emerald-400 flex items-center gap-2">
                <span>🧩 Zarejestrowane Mikrowęzły (Klocki)</span>
              </h3>
              <span class="nx-badge nx-badge-emerald">STANDARD VANILLA</span>
            </div>

            <div class="space-y-3 mb-6">
              ${nodes
                .map(
                  (node) => `
                <div class="p-3 bg-[#0a0e17]/80 rounded-lg border border-white/5 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="text-xl">${node.metadata.icon}</div>
                    <div>
                      <div class="font-medium text-sm text-slate-200">${node.metadata.name}</div>
                      <div class="text-xs text-slate-400">Opiekun: <span class="text-amber-400 font-mono">${node.metadata.bellasOwner}</span></div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="nx-badge nx-badge-emerald">${node.metadata.status}</span>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>

            <!-- Bridge Channels Overview -->
            <div class="pt-3 border-t border-white/10">
              <div class="text-xs font-mono uppercase text-slate-400 mb-2">Aktywne Kanały Mostu (Pub/Sub):</div>
              <div class="flex flex-wrap gap-2">
                ${
                  Object.keys(metrics.channelCounts).length === 0
                    ? '<span class="text-xs text-slate-500 italic">Brak aktywnych kanałów</span>'
                    : Object.entries(metrics.channelCounts)
                        .map(
                          ([ch, count]) => `
                    <span class="nx-badge nx-badge-amber">
                      #${ch}: <strong class="text-white">${count}</strong>
                    </span>
                  `
                        )
                        .join('')
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Rejestracja zdarzeń kliknięcia przycisków impulsów
    const buttons = this.container.querySelectorAll('.btn-pulse-trigger');
    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-bellas-id');
        if (id) {
          nexusCore.triggerBellasPulse(id, 'Ręczny impuls wysłany z Pulpitu Architekta.');
        }
      });
    });
  }

  private renderTelemetryOnly(): void {
    if (!this.container || !this.isMounted) return;
    const tpEl = this.container.querySelector('#dash-tp');
    if (tpEl) {
      const metrics = nexusBus.getMetrics();
      tpEl.innerHTML = `${metrics.throughputPerMin} <span class="text-xs font-normal text-slate-400">evt/min</span>`;
    }
  }

  private updateTimers(): void {
    if (!this.container || !this.isMounted) return;
    const uptimeEl = this.container.querySelector('#dash-uptime');
    if (uptimeEl) {
      uptimeEl.textContent = `${nexusCore.getUptimeSeconds()}s`;
    }
  }
}
