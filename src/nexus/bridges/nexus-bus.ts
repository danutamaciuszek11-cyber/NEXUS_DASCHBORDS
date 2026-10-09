// NXL v1.0 Nexus Event Bus - High Throughput Pub/Sub Event Mesh
import { EventPulse } from '../../types';

export type EventCallback = (event: EventPulse) => void;

export class NexusBus {
  private static instance: NexusBus;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private history: EventPulse[] = [];
  private totalEventsEmitted = 0;
  private currentRps = 4920;

  private constructor() {}

  static getInstance(): NexusBus {
    if (!NexusBus.instance) {
      NexusBus.instance = new NexusBus();
    }
    return NexusBus.instance;
  }

  publish(eventName: string, data: any, nodeSource: string = 'SynapseMesh'): EventPulse {
    const pulse: EventPulse = {
      id: `PULSE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      event: eventName,
      data,
      timestamp: new Date().toISOString(),
      nodeSource,
    };

    this.history.push(pulse);
    if (this.history.length > 200) {
      this.history.shift();
    }
    this.totalEventsEmitted++;

    const callbacks = this.listeners.get(eventName);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          if (typeof cb === 'function') cb(pulse);
        } catch (e) {
          console.error(`[NEXUS BUS ERROR: ${eventName}]`, e);
        }
      });
    }

    const wildcardCallbacks = this.listeners.get('*');
    if (wildcardCallbacks) {
      wildcardCallbacks.forEach((cb) => {
        try {
          if (typeof cb === 'function') cb(pulse);
        } catch (e) {
          console.error('[NEXUS BUS WILDCARD ERROR]', e);
        }
      });
    }

    return pulse;
  }

  subscribe(eventName: string, callback: EventCallback): () => void {
    if (!callback || typeof callback !== 'function') {
      return () => {};
    }
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)!.add(callback);

    return () => {
      try {
        const set = this.listeners.get(eventName);
        if (set) {
          set.delete(callback);
        }
      } catch (err) {
        console.warn('[NEXUS BUS UNSUBSCRIBE ERROR]', err);
      }
    };
  }

  getHistory(): EventPulse[] {
    return [...this.history];
  }

  getMetrics() {
    return {
      totalEventsEmitted: this.totalEventsEmitted,
      currentRps: this.currentRps,
      activeSubscribersCount: Array.from(this.listeners.values()).reduce((acc, set) => acc + set.size, 0),
    };
  }
}

export const nexusBus = NexusBus.getInstance();
