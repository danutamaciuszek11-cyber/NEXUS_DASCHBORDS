// NEXUS Event Bus - Decoupled inter-module communication
export type EventHandler<T = any> = (data: T) => void;

class NexusEventBus {
  private listeners: Map<string, Set<EventHandler>> = new Map();

  on<T = any>(event: string, handler: EventHandler<T>): () => void {
    if (!handler || typeof handler !== 'function') {
      return () => {};
    }
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    return () => {
      try {
        this.off(event, handler);
      } catch (err) {
        console.warn(`[EVENT_BUS UNSUBSCRIBE ERROR: ${event}]`, err);
      }
    };
  }

  off(event: string, handler: EventHandler): void {
    if (!event || !this.listeners.has(event)) return;
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit<T = any>(event: string, data?: T): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((h) => {
        try {
          if (typeof h === 'function') {
            h(data);
          }
        } catch (err) {
          console.error(`[NEXUS EVENT ERROR: ${event}]`, err);
        }
      });
    }
  }
}

export const eventBus = new NexusEventBus();
