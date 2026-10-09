/**
 * NEXUS-NODE: Standardowy Klocek Mikrowęzła
 * Każąca klasa bazowa zapewniająca jednolity cykl życia:
 * mount(), render(), unmount(), emit(), listen().
 */

import { nexusBus, NexusEventListener, NexusEvent } from './nexus-bus';

export interface NodeMetadata {
  id: string;
  name: string;
  icon: string;
  description: string;
  bellasOwner: string; // Członek rodziny Bellas opiekujący się węzłem
  version: string;
  status: 'ONLINE' | 'STANDBY' | 'BUSY' | 'ERROR';
}

export abstract class NexusNode {
  public metadata: NodeMetadata;
  protected container: HTMLElement | null = null;
  private unsubscribes: Array<() => void> = [];
  protected isMounted: boolean = false;

  constructor(metadata: NodeMetadata) {
    this.metadata = metadata;
  }

  /**
   * Montowanie węzła w konenerze DOM.
   */
  public mount(targetElement: HTMLElement): void {
    this.container = targetElement;
    this.isMounted = true;
    this.metadata.status = 'ONLINE';
    
    // Inicjalizacja subskrypcji zdarzeń
    this.setupSubscriptions();
    
    // Pierwszy render
    this.render();

    // Emisja sygnału wejścia w sieć
    this.emit('nexus:system', {
      type: 'NODE_MOUNTED',
      nodeId: this.metadata.id,
      name: this.metadata.name,
    });
  }

  /**
   * Odmontowywanie węzła i czyszczenie pamięci.
   */
  public unmount(): void {
    if (!this.isMounted) return;

    // Emisja sygnału wyjścia z sieci
    this.emit('nexus:system', {
      type: 'NODE_UNMOUNTED',
      nodeId: this.metadata.id,
    });

    // Zwalnianie subskrypcji Mostu
    this.unsubscribes.forEach((unsub) => unsub());
    this.unsubscribes = [];

    // Czyszczenie DOM
    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }

    this.isMounted = false;
    this.metadata.status = 'STANDBY';
  }

  /**
   * Rejestracja subskrypcji w Moście Zdarzeń z automatycznym czyszczeniem.
   */
  protected listen<T = any>(channel: string, callback: NexusEventListener<T>): void {
    const unsub = nexusBus.subscribe<T>(channel, callback, this.metadata.id);
    this.unsubscribes.push(unsub);
  }

  /**
   * Wysyłanie impulsu do Mostu Zdarzeń.
   */
  protected emit<T = any>(channel: string, payload: T): NexusEvent<T> {
    return nexusBus.emit<T>(channel, this.metadata.id, payload);
  }

  /**
   * Abstrakcyjna metoda renderująca HTML/Canvas wewnątrz container.
   */
  public abstract render(): void;

  /**
   * Metoda konfiguracyjna subskrypcji specyficzna dla konkretnego klocka.
   */
  protected abstract setupSubscriptions(): void;
}
