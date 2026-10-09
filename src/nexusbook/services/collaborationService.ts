/**
 * NEXUS REAL-TIME COLLABORATION CLIENT SERVICE
 * ========================================================
 * Klient WebSocket dla protokołu kolaboracji czasu rzeczywistego.
 * Odpowiada za połączenie, synchronizację stanu, rekonwersję zdarzeń,
 * obecność użytkowników (presence awareness) oraz idempotentną obsługę zmian.
 */

import {
  CollabPeer,
  CollabServerState,
  CollabClientMessage,
  CollabServerMessage,
  CollabPulseEvent,
  CollabKinoScene,
  CollabCanvasPing,
  CollabScribeNote,
  CollabNodeStatus,
  CollabRole,
  CollabTab
} from '../types/collab';

export type CollabConnectionStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

type StateListener = (state: CollabServerState & { status: CollabConnectionStatus; myPeerId: string }) => void;
type PingListener = (ping: CollabCanvasPing) => void;
type PulseListener = (pulse: CollabPulseEvent) => void;

class NexusCollaborationService {
  private ws: WebSocket | null = null;
  private status: CollabConnectionStatus = 'DISCONNECTED';
  private myPeerId: string = '';
  private reconnectTimer: any = null;
  private reconnectDelay = 1500;
  private shouldReconnect = true;
  private stateListeners: Set<StateListener> = new Set();
  private pingListeners: Set<PingListener> = new Set();
  private pulseListeners: Set<PulseListener> = new Set();

  private myProfile: {
    name: string;
    role: CollabRole;
    color: string;
    avatar: string;
    activeTab: CollabTab;
  };

  private state: CollabServerState = {
    peers: [],
    telemetry: {
      throughputPerMin: 0,
      totalEventsEmitted: 0,
      activeSubscriptionsCount: 0,
      channelCounts: {},
      uptimeSeconds: 0
    },
    nodes: [],
    recentPulses: [],
    kinoScene: {
      mode: 'VOID_BLUE',
      title: 'KINO NEXUS // STRUMIEŃ SYGNAŁU CZASU RZECZYWISTEGO',
      hue: 190,
      particleIntensity: 1.0,
      waveSpeed: 0.02,
      lastTriggeredBy: 'System',
      lastTriggeredAt: Date.now()
    },
    recentCanvasPings: [],
    scribeNotes: [],
    typingUsers: []
  };

  constructor() {
    // Generate initial identity from local storage or defaults
    const savedName = localStorage.getItem('nexus_collab_name') || this.generateDefaultName();
    const savedRole = (localStorage.getItem('nexus_collab_role') as CollabRole) || 'ARCHITECT';
    const savedColor = localStorage.getItem('nexus_collab_color') || this.generateDefaultColor();

    this.myProfile = {
      name: savedName,
      role: savedRole,
      color: savedColor,
      avatar: savedRole === 'ARCHITECT' ? '🏛️' : '⚡',
      activeTab: 'dashboard'
    };
  }

  private generateDefaultName(): string {
    const pilot = localStorage.getItem('nexusbook_pilot_profile');
    if (pilot) {
      try {
        const parsed = JSON.parse(pilot);
        if (parsed.callsign) return parsed.callsign;
      } catch {}
    }
    const rnd = Math.floor(100 + Math.random() * 900);
    return `Węzeł-${rnd}`;
  }

  private generateDefaultColor(): string {
    const palette = ['#00f0ff', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  public connect(): void {
    if (typeof window === 'undefined') return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.shouldReconnect = true;
    this.setStatus('CONNECTING');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws/nexus`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.setStatus('CONNECTED');
        this.reconnectDelay = 1500;

        // Send identity to server
        this.send({
          type: 'peer:identify',
          payload: this.myProfile
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as CollabServerMessage;
          this.handleServerMessage(message);
        } catch (err) {
          console.error('[CollabService] Failed to parse server message:', err);
        }
      };

      this.ws.onclose = () => {
        this.setStatus('DISCONNECTED');
        this.ws = null;
        if (this.shouldReconnect) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (err) => {
        console.warn('[CollabService] WebSocket connection error:', err);
        this.setStatus('ERROR');
      };
    } catch (err) {
      console.error('[CollabService] Connection failed:', err);
      this.setStatus('ERROR');
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      if (this.shouldReconnect) {
        this.connect();
      }
    }, this.reconnectDelay);
    this.reconnectDelay = Math.min(this.reconnectDelay * 1.5, 10000);
  }

  public disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setStatus('DISCONNECTED');
  }

  private handleServerMessage(message: CollabServerMessage): void {
    switch (message.type) {
      case 'collab:init': {
        const { yourPeerId, ...serverState } = message.payload;
        this.myPeerId = yourPeerId;
        this.state = serverState;
        this.notifyState();
        break;
      }

      case 'collab:peer_joined': {
        const existingIdx = this.state.peers.findIndex((p) => p.id === message.payload.id);
        if (existingIdx >= 0) {
          this.state.peers[existingIdx] = message.payload;
        } else {
          this.state.peers.push(message.payload);
        }
        this.notifyState();
        break;
      }

      case 'collab:peer_left': {
        this.state.peers = this.state.peers.filter((p) => p.id !== message.payload.peerId);
        this.notifyState();
        break;
      }

      case 'collab:peer_updated': {
        const peer = message.payload;
        const idx = this.state.peers.findIndex((p) => p.id === peer.id);
        if (idx >= 0) {
          this.state.peers[idx] = peer;
        } else {
          this.state.peers.push(peer);
        }
        this.notifyState();
        break;
      }

      case 'collab:peers_list': {
        this.state.peers = message.payload;
        this.notifyState();
        break;
      }

      case 'collab:dashboard_updated': {
        this.state.telemetry = message.payload.telemetry;
        this.state.nodes = message.payload.nodes;
        this.state.recentPulses = message.payload.recentPulses;
        this.notifyState();
        break;
      }

      case 'collab:pulse_emitted': {
        const pulse = message.payload;
        // Avoid duplicate pulses
        if (!this.state.recentPulses.some((p) => p.id === pulse.id)) {
          this.state.recentPulses.unshift(pulse);
          if (this.state.recentPulses.length > 25) {
            this.state.recentPulses.pop();
          }
        }
        this.pulseListeners.forEach((fn) => fn(pulse));
        this.notifyState();
        break;
      }

      case 'collab:kino_scene_updated': {
        this.state.kinoScene = message.payload;
        this.notifyState();
        break;
      }

      case 'collab:kino_canvas_ping': {
        const ping = message.payload;
        this.state.recentCanvasPings.push(ping);
        if (this.state.recentCanvasPings.length > 25) {
          this.state.recentCanvasPings.shift();
        }
        this.pingListeners.forEach((fn) => fn(ping));
        this.notifyState();
        break;
      }

      case 'collab:scribe_note_created': {
        const note = message.payload;
        if (!this.state.scribeNotes.some((n) => n.id === note.id)) {
          this.state.scribeNotes.unshift(note);
        }
        this.notifyState();
        break;
      }

      case 'collab:scribe_note_updated': {
        const updated = message.payload;
        const idx = this.state.scribeNotes.findIndex((n) => n.id === updated.id);
        if (idx >= 0) {
          this.state.scribeNotes[idx] = updated;
        } else {
          this.state.scribeNotes.unshift(updated);
        }
        this.notifyState();
        break;
      }

      case 'collab:scribe_note_deleted': {
        this.state.scribeNotes = this.state.scribeNotes.filter((n) => n.id !== message.payload.id);
        this.notifyState();
        break;
      }

      case 'collab:scribe_typing_updated': {
        this.state.typingUsers = message.payload.typingUsers;
        this.notifyState();
        break;
      }
    }
  }

  private send(msg: CollabClientMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  // Public Actions
  public updateProfile(updates: Partial<typeof this.myProfile>): void {
    this.myProfile = { ...this.myProfile, ...updates };
    try {
      if (updates.name) localStorage.setItem('nexus_collab_name', updates.name);
      if (updates.role) localStorage.setItem('nexus_collab_role', updates.role);
      if (updates.color) localStorage.setItem('nexus_collab_color', updates.color);
    } catch {}

    this.send({
      type: 'peer:identify',
      payload: this.myProfile
    });
  }

  public setActiveTab(tab: CollabTab): void {
    this.myProfile.activeTab = tab;
    this.send({
      type: 'peer:set_active_tab',
      payload: { activeTab: tab }
    });
  }

  public sendCursor(x: number, y: number): void {
    this.send({
      type: 'peer:cursor_move',
      payload: { x, y }
    });
  }

  public triggerDashboardPulse(channel: string, message: string): void {
    this.send({
      type: 'dashboard:trigger_pulse',
      payload: { channel, message }
    });
  }

  public toggleNodeStatus(nodeId: string, status: CollabNodeStatus['status']): void {
    this.send({
      type: 'dashboard:toggle_node_status',
      payload: { nodeId, status }
    });
  }

  public triggerKinoScene(
    mode: CollabKinoScene['mode'],
    hue: number,
    title: string,
    particleIntensity = 2.5
  ): void {
    this.send({
      type: 'kino:trigger_scene',
      payload: { mode, hue, title, particleIntensity }
    });
  }

  public sendCanvasPing(x: number, y: number): void {
    this.send({
      type: 'kino:canvas_ping',
      payload: { x, y }
    });
  }

  public createScribeNote(title: string, content: string, category: CollabScribeNote['category']): void {
    this.send({
      type: 'scribe:create_note',
      payload: { title, content, category }
    });
  }

  public updateScribeNote(id: string, title: string, content: string, category: CollabScribeNote['category']): void {
    this.send({
      type: 'scribe:update_note',
      payload: { id, title, content, category }
    });
  }

  public deleteScribeNote(id: string): void {
    this.send({
      type: 'scribe:delete_note',
      payload: { id }
    });
  }

  public sendTyping(noteId: string, isTyping: boolean): void {
    this.send({
      type: 'scribe:typing',
      payload: { noteId, isTyping }
    });
  }

  // State Subscriptions
  private setStatus(newStatus: CollabConnectionStatus): void {
    this.status = newStatus;
    this.notifyState();
  }

  private notifyState(): void {
    const fullState = {
      ...this.state,
      status: this.status,
      myPeerId: this.myPeerId
    };
    this.stateListeners.forEach((listener) => listener(fullState));
  }

  public subscribe(listener: StateListener): () => void {
    this.stateListeners.add(listener);
    // Send immediate snapshot
    listener({
      ...this.state,
      status: this.status,
      myPeerId: this.myPeerId
    });
    return () => this.stateListeners.delete(listener);
  }

  public onCanvasPing(listener: PingListener): () => void {
    this.pingListeners.add(listener);
    return () => this.pingListeners.delete(listener);
  }

  public onPulse(listener: PulseListener): () => void {
    this.pulseListeners.add(listener);
    return () => this.pulseListeners.delete(listener);
  }

  public getState() {
    return {
      ...this.state,
      status: this.status,
      myPeerId: this.myPeerId
    };
  }

  public getMyProfile() {
    return this.myProfile;
  }
}

export const collaborationService = new NexusCollaborationService();
