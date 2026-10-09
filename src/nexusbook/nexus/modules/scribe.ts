/**
 * SCRIBE MODULE: Kancelaria Architekta & Terminal Dekretów
 * Notatnik architektoniczny Rodziny Bellas służący do wydawania rozporządzeń
 * oraz natychmiastowego rozgłaszania sygnałów na Most Zdarzeń.
 */

import { NexusNode } from '../core/nexus-node';
import { nexusBus } from '../core/nexus-bus';

export interface DispatchMessage {
  id: string;
  author: string;
  category: 'DEKRET' | 'INSTRUKCJA' | 'IMPULS' | 'NOTATKA';
  message: string;
  timestamp: number;
}

export class ScribeNode extends NexusNode {
  private dispatches: DispatchMessage[] = [
    {
      id: 'disp-1',
      author: 'Architekt Maciej',
      category: 'DEKRET',
      message: 'Ustanawiam plik nexus-atomic.css jako stałą fizyczną wizualną dla całego systemu Nexus.',
      timestamp: Date.now() - 3600000,
    },
    {
      id: 'disp-2',
      author: 'Leo Bellas',
      category: 'INSTRUKCJA',
      message: 'Event Bus przesyła impulsy bez overheadu frameworków – zachowaj czystość klocków Vanilla JS.',
      timestamp: Date.now() - 1800000,
    },
  ];

  constructor() {
    super({
      id: 'node-scribe',
      name: '🖋️ Scribe (Architect Notepad)',
      icon: '🖋️',
      description: 'Kancelaria Architekta – notatnik dekretów i terminal rozgłaszania wiadomości w sieci.',
      bellasOwner: 'Leo Bellas',
      version: '1.0.0-vanilla',
      status: 'ONLINE',
    });
  }

  protected setupSubscriptions(): void {
    // Nasłuchiwanie na przychodzące wiadomości dla rejestracji w kancelarii
    this.listen('bellas:pulse', (evt) => {
      if (evt.payload) {
        this.addDispatch(
          evt.payload.memberName || 'Leo Bellas',
          'IMPULS',
          `Impuls Rodziny: ${evt.payload.pulseMessage}`
        );
      }
    });
  }

  public render(): void {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="space-y-6">
        <!-- New Dispatch Form -->
        <div class="nx-card p-5">
          <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <h3 class="font-bold text-sm tracking-wider uppercase text-amber-400 flex items-center gap-2">
              <span>🖋️ Kancelaria Architekta // Nadajnik Dekretów</span>
            </h3>
            <span class="nx-badge nx-badge-amber">MOST SYGNAŁOWY</span>
          </div>

          <form id="scribe-form" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-mono text-slate-400 mb-1">Autor / Architekt:</label>
                <input 
                  type="text" 
                  id="scribe-author" 
                  value="Architekt Maciej" 
                  class="w-full bg-[#0a0e17] border border-white/10 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div>
                <label class="block text-xs font-mono text-slate-400 mb-1">Kategoria Sygnału:</label>
                <select 
                  id="scribe-category" 
                  class="w-full bg-[#0a0e17] border border-white/10 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                >
                  <option value="DEKRET">📜 DEKRET ARCHITEKTONICZNY</option>
                  <option value="INSTRUKCJA">🛠️ INSTRUKCJA DLA WĘZŁÓW</option>
                  <option value="IMPULS">⚡ IMPULS BEZPOŚREDNI</option>
                  <option value="NOTATKA">📝 NOTATKA SYSTEMOWA</option>
                </select>
              </div>

              <div class="flex items-end">
                <button 
                  type="submit" 
                  class="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 px-4 rounded transition-all font-mono text-sm shadow-lg flex items-center justify-center gap-2"
                >
                  <span>📡 Rozgłoś na Moście</span>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-mono text-slate-400 mb-1">Treść Dekretu lub Wiadomości:</label>
              <textarea 
                id="scribe-message" 
                rows="3" 
                placeholder="Wpisz treść dyspozycji..."
                class="w-full bg-[#0a0e17] border border-white/10 rounded p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono resize-none"
              ></textarea>
            </div>
          </form>
        </div>

        <!-- Dispatch Journal Feed -->
        <div class="nx-card p-5">
          <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <h3 class="font-bold text-sm tracking-wider uppercase text-slate-300 flex items-center gap-2">
              <span>📜 Rejestr Dekretów i Rozporządzeń</span>
            </h3>
            <span class="text-xs font-mono text-slate-500" id="scribe-count">${this.dispatches.length} Dekretów</span>
          </div>

          <div class="space-y-3" id="scribe-feed">
            ${this.renderFeedHtml()}
          </div>
        </div>
      </div>
    `;

    this.attachFormEvents();
  }

  private renderFeedHtml(): string {
    return this.dispatches
      .slice()
      .reverse()
      .map((d) => {
        const dateStr = new Date(d.timestamp).toLocaleTimeString();
        let badgeClass = 'nx-badge-amber';
        if (d.category === 'DEKRET') badgeClass = 'nx-badge-rose';
        if (d.category === 'INSTRUKCJA') badgeClass = 'nx-badge-cyan';
        if (d.category === 'IMPULS') badgeClass = 'nx-badge-emerald';

        return `
          <div class="p-4 bg-[#0a0e17]/90 rounded-lg border border-white/5 hover:border-amber-500/30 transition-all space-y-2">
            <div class="flex items-center justify-between text-xs border-b border-white/5 pb-2">
              <div class="flex items-center gap-2">
                <span class="nx-badge ${badgeClass}">${d.category}</span>
                <span class="font-bold text-slate-200">${d.author}</span>
              </div>
              <span class="text-slate-500 font-mono">${dateStr}</span>
            </div>
            <p class="text-sm text-slate-300 font-mono leading-relaxed pl-1">${d.message}</p>
          </div>
        `;
      })
      .join('');
  }

  private addDispatch(author: string, category: any, message: string): void {
    const newDispatch: DispatchMessage = {
      id: `disp-${Date.now()}`,
      author,
      category,
      message,
      timestamp: Date.now(),
    };

    this.dispatches.push(newDispatch);

    // Broadcast to Event Bus
    this.emit('scribe:dispatch', newDispatch);

    // Refresh Feed if mounted
    if (this.container && this.isMounted) {
      const feedEl = this.container.querySelector('#scribe-feed');
      const countEl = this.container.querySelector('#scribe-count');
      if (feedEl) feedEl.innerHTML = this.renderFeedHtml();
      if (countEl) countEl.textContent = `${this.dispatches.length} Dekretów`;
    }
  }

  private attachFormEvents(): void {
    if (!this.container) return;
    const form = this.container.querySelector('#scribe-form') as HTMLFormElement;
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const authorEl = this.container?.querySelector('#scribe-author') as HTMLInputElement;
      const catEl = this.container?.querySelector('#scribe-category') as HTMLSelectElement;
      const msgEl = this.container?.querySelector('#scribe-message') as HTMLTextAreaElement;

      if (!msgEl || !msgEl.value.trim()) return;

      this.addDispatch(
        authorEl.value.trim() || 'Architekt Maciej',
        catEl.value as any,
        msgEl.value.trim()
      );

      msgEl.value = '';
    });
  }
}
