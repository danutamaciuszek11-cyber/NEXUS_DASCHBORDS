/**
 * NEXUS-BUS: Lekki Most Zdarzeń (Event Bus Bridge)
 * Implementuje architekturę Pub/Sub z buforem telemetrii.
 */

export interface NexusEvent<T = any> {
  id: string;
  channel: string;
  sourceNodeId: string;
  timestamp: number;
  payload: T;
}

export type NexusEventListener<T = any> = (event: NexusEvent<T>) => void;

export interface BusMetrics {
  totalEventsEmitted: number;
  activeSubscriptionsCount: number;
  channelCounts: Record<string, number>;
  throughputPerMin: number;
}

export class NexusBus {
  private static instance: NexusBus;
  private listeners: Map<string, Set<{ id: string; fn: NexusEventListener }>> = new Map();
  private historyBuffer: NexusEvent[] = [];
  private maxHistorySize = 100;
  private totalEventsEmitted = 0;
  private channelCounts: Record<string, number> = {};
  private eventTimestamps: number[] = [];

  private constructor() {
    // Rejestracja natywnego nasłuchu dla celów telemetrii
  }

  public static getInstance(): NexusBus {
    if (!NexusBus.instance) {
      NexusBus.instance = new NexusBus();
    }
    return NexusBus.instance;
  }

  /**
   * Subskrypcja do kanału w Moście Zdarzeń.
   * Zwraca unikalny ID subskrypcji ułatwiający czyszczenie.
   */
  public subscribe<T = any>(
    channel: string,
    callback: NexusEventListener<T>,
    subscriberId: string = 'anon'
  ): () => void {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set());
    }

    const subObj = { id: subscriberId, fn: callback };
    this.listeners.get(channel)!.add(subObj);

    // Dynamiczna funkcja wyrejestrowująca
    return () => {
      const channelSet = this.listeners.get(channel);
      if (channelSet) {
        channelSet.delete(subObj);
        if (channelSet.size === 0) {
          this.listeners.delete(channel);
        }
      }
    };
  }

  /**
   * Emisja impulsów w Moście Zdarzeń.
   */
  public emit<T = any>(channel: string, sourceNodeId: string, payload: T): NexusEvent<T> {
    const event: NexusEvent<T> = {
      id: `nx-evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      channel,
      sourceNodeId,
      timestamp: Date.now(),
      payload,
    };

    // Aktualizacja metryk telemetrii
    this.totalEventsEmitted++;
    this.channelCounts[channel] = (this.channelCounts[channel] || 0) + 1;
    this.eventTimestamps.push(event.timestamp);
    if (this.eventTimestamps.length > 500) {
      this.eventTimestamps.shift();
    }

    // Bufor historii
    this.historyBuffer.unshift(event);
    if (this.historyBuffer.length > this.maxHistorySize) {
      this.historyBuffer.pop();
    }

    // Powiadomienie subskrybentów
    const subscribers = this.listeners.get(channel);
    if (subscribers) {
      subscribers.forEach((sub) => {
        try {
          sub.fn(event);
        } catch (err) {
          console.error(`[NexusBus Error] Node '${sub.id}' crashed on channel '${channel}':`, err);
        }
      });
    }

    // Powiadomienie globalnego nasłuchu (np. konsola mostu)
    const wildcardSubs = this.listeners.get('*');
    if (wildcardSubs) {
      wildcardSubs.forEach((sub) => {
        try {
          sub.fn(event);
        } catch (err) {
          console.error(`[NexusBus Error] Wildcard listener failed:`, err);
        }
      });
    }

    return event;
  }

  public getHistory(): NexusEvent[] {
    return [...this.historyBuffer];
  }

  public getMetrics(): BusMetrics {
    const now = Date.now();
    const oneMinAgo = now - 60000;
    const recentEvents = this.eventTimestamps.filter((t) => t >= oneMinAgo).length;

    let activeSubCount = 0;
    this.listeners.forEach((set) => {
      activeSubCount += set.size;
    });

    return {
      totalEventsEmitted: this.totalEventsEmitted,
      activeSubscriptionsCount: activeSubCount,
      channelCounts: { ...this.channelCounts },
      throughputPerMin: recentEvents,
    };
  }

  public clearHistory(): void {
    this.historyBuffer = [];
  }
}

export const nexusBus = NexusBus.getInstance();
