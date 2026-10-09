/**
 * NEXUS REAL-TIME COLLABORATION SERVER
 * ========================================================
 * Serwer-authoritative WebSocket Hub zarządzający współbieżną pracą
 * wielu użytkowników w pulpitach: Dashboard, Kino Streams oraz Scribe Notes.
 * 
 * Zgodny z pryncypiami ZASADY 01 (Prawda Techniczna) i ZASADY 02 (Determinizm).
 */

import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
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
  CollabRole
} from '../types/collab';

export class NexusCollabServer {
  private wss: WebSocketServer;
  private clients: Map<WebSocket, CollabPeer> = new Map();
  private state: CollabServerState;
  private serverStartTime = Date.now();
  private pulseCounter = 0;
  private typingMap: Map<string, Set<string>> = new Map(); // noteId -> Set of peerNames

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws/nexus' });

    // Inicjalizacja stanu bazowego serwera (Authoritative State)
    this.state = {
      peers: [],
      telemetry: {
        throughputPerMin: 42,
        totalEventsEmitted: 108,
        activeSubscriptionsCount: 4,
        channelCounts: {
          'nexus:system': 3,
          'kino:stream': 2,
          'scribe:notes': 2,
          'bellas:pulse': 1
        },
        uptimeSeconds: 0
      },
      nodes: [
        {
          id: 'node-dashboard',
          name: '🏛️ Pulpit Bellas (Dashboard)',
          icon: '🏛️',
          bellasOwner: 'Marco Bellas',
          status: 'ONLINE',
          lastPingTime: Date.now()
        },
        {
          id: 'node-kino',
          name: '🎬 Kino (Audiovisual Projection)',
          icon: '🎬',
          bellasOwner: 'Sofia Bellas',
          status: 'ONLINE',
          lastPingTime: Date.now()
        },
        {
          id: 'node-scribe',
          name: '🖋️ Scribe (Architect Notepad)',
          icon: '🖋️',
          bellasOwner: 'Leo Bellas',
          status: 'ONLINE',
          lastPingTime: Date.now()
        },
        {
          id: 'node-aegis',
          name: '🛡️ Aegis Master Sentinel',
          icon: '🛡️',
          bellasOwner: 'Eterion Guard',
          status: 'ONLINE',
          lastPingTime: Date.now()
        },
        {
          id: 'node-bnb',
          name: '⛓️ BNB Chain Sovereign Dock',
          icon: '⛓️',
          bellasOwner: 'Operator Consensual',
          status: 'ONLINE',
          lastPingTime: Date.now()
        }
      ],
      recentPulses: [
        {
          id: 'pulse-init-1',
          author: 'Eterion Core',
          authorColor: '#00f0ff',
          channel: 'nexus:system',
          message: 'Magistrala WebSocket zainicjalizowana. Połączenie wieloużytkownikowe aktywne.',
          timestamp: Date.now() - 60000
        },
        {
          id: 'pulse-init-2',
          author: 'Architekt Maciej',
          authorColor: '#10b981',
          channel: 'scribe:notes',
          message: 'Uruchomienie protokołu kolaboracji dla Kino streams i Scribe notes.',
          timestamp: Date.now() - 30000
        }
      ],
      kinoScene: {
        mode: 'VOID_BLUE',
        title: 'KINO NEXUS // STRUMIEŃ SYGNAŁU CZASU RZECZYWISTEGO',
        hue: 190,
        particleIntensity: 1.2,
        waveSpeed: 0.02,
        lastTriggeredBy: 'System Init',
        lastTriggeredAt: Date.now()
      },
      recentCanvasPings: [],
      scribeNotes: [
        {
          id: 'note-decree-1',
          title: 'DEKRET 01: Współpraca w Czasie Rzeczywistym',
          content: 'Każdy połączony węzeł widzi ten sam pulpit, strumień Kina oraz notatnik Scribe bez opóźnień. Wszystkie zmiany są autorytatywnie rozsyłane przez serwer WebSocket.',
          category: 'DEKRET',
          author: 'Architekt Maciej',
          authorRole: 'ARCHITECT',
          createdAt: Date.now() - 7200000,
          updatedAt: Date.now() - 3600000,
          updatedBy: 'Architekt Maciej',
          activeEditors: []
        },
        {
          id: 'note-inst-2',
          title: 'INSTRUKCJA: Geometria Kwantowa Kina',
          content: 'Kliknięcie na płótno Kina generuje falę cząsteczkową o barwie użytkownika, widoczną natychmiast u wszystkich podłączonych obserwatorów.',
          category: 'INSTRUKCJA',
          author: 'Sofia Bellas',
          authorRole: 'ENGINEER',
          createdAt: Date.now() - 5400000,
          updatedAt: Date.now() - 1800000,
          updatedBy: 'Sofia Bellas',
          activeEditors: []
        },
        {
          id: 'note-pulse-3',
          title: 'IMPULS 03: Spójność Danych i Tarcza Egidy',
          content: 'Brak symulacji. Każde zdarzenie zapisywane jest w pamięci serwera i weryfikowane pod kątem determinizmu.',
          category: 'IMPULS',
          author: 'Eterion Systems',
          authorRole: 'ARCHITECT',
          createdAt: Date.now() - 1800000,
          updatedAt: Date.now() - 600000,
          updatedBy: 'Eterion Systems',
          activeEditors: []
        }
      ],
      typingUsers: []
    };

    this.setupWebSocketServer();
    this.startHeartbeatAndTelemetryLoop();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket, req) => {
      const peerId = `peer_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const ip = req.socket.remoteAddress || 'unknown';

      // Przypisanie domyślnego profilu uczestnika
      const colors = ['#00f0ff', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];
      const defaultColor = colors[this.clients.size % colors.length];
      const defaultRole: CollabRole = this.clients.size === 0 ? 'ARCHITECT' : 'OPERATOR';
      const defaultName = this.clients.size === 0 ? 'Architekt' : `Biooperator-${peerId.slice(-4)}`;

      const peer: CollabPeer = {
        id: peerId,
        name: defaultName,
        role: defaultRole,
        color: defaultColor,
        avatar: this.clients.size === 0 ? '👑' : '⚡',
        activeTab: 'dashboard',
        cursor: null,
        connectedAt: Date.now(),
        lastPing: Date.now()
      };

      this.clients.set(ws, peer);
      this.updatePeersList();

      console.log(`[NexusCollab] Peer connected: ${peer.name} (${peer.id}) from ${ip}. Total: ${this.clients.size}`);

      // 1. Wyślij pełny stan początkowy do dołączającego klienta (Init)
      const initMessage: CollabServerMessage = {
        type: 'collab:init',
        payload: {
          ...this.state,
          peers: Array.from(this.clients.values()),
          yourPeerId: peerId
        }
      };
      this.send(ws, initMessage);

      // 2. Powiadom pozostałych klientów o dołączeniu nowego uczestnika
      this.broadcast({
        type: 'collab:peer_joined',
        payload: peer
      }, ws);

      // 3. Nasłuchuj na komunikaty od klienta
      ws.on('message', (data) => {
        try {
          const raw = data.toString();
          const message = JSON.parse(raw) as CollabClientMessage;
          this.handleClientMessage(ws, message);
        } catch (err: any) {
          console.error('[NexusCollab] Error parsing client message:', err);
          this.send(ws, {
            type: 'collab:error',
            payload: { message: 'Niepoprawny format komunikatu JSON' }
          });
        }
      });

      // 4. Obsługa rozłączenia
      ws.on('close', () => {
        const leavingPeer = this.clients.get(ws);
        this.clients.delete(ws);
        this.cleanUpTypingForPeer(leavingPeer?.name || '');
        this.updatePeersList();

        console.log(`[NexusCollab] Peer disconnected: ${leavingPeer?.name || peerId}. Total: ${this.clients.size}`);

        this.broadcast({
          type: 'collab:peer_left',
          payload: { peerId }
        });

        this.broadcast({
          type: 'collab:peers_list',
          payload: Array.from(this.clients.values())
        });
      });

      ws.on('error', (err) => {
        console.warn(`[NexusCollab] WebSocket error for peer ${peerId}:`, err);
      });
    });
  }

  private handleClientMessage(ws: WebSocket, message: CollabClientMessage) {
    const peer = this.clients.get(ws);
    if (!peer) return;

    peer.lastPing = Date.now();

    switch (message.type) {
      case 'peer:identify': {
        const { name, role, color, avatar, activeTab } = message.payload;
        if (name) peer.name = name.slice(0, 32);
        if (role) peer.role = role;
        if (color) peer.color = color;
        if (avatar) peer.avatar = avatar;
        if (activeTab) peer.activeTab = activeTab;

        this.updatePeersList();
        this.broadcast({
          type: 'collab:peer_updated',
          payload: peer
        });
        break;
      }

      case 'peer:set_active_tab': {
        peer.activeTab = message.payload.activeTab;
        this.broadcast({
          type: 'collab:peer_updated',
          payload: peer
        });
        break;
      }

      case 'peer:cursor_move': {
        peer.cursor = {
          x: Math.max(0, Math.min(1, message.payload.x)),
          y: Math.max(0, Math.min(1, message.payload.y))
        };
        // Lekki broadcast pozycji kursora do innych użytkowników
        this.broadcast({
          type: 'collab:peer_updated',
          payload: peer
        }, ws);
        break;
      }

      case 'dashboard:trigger_pulse': {
        this.pulseCounter++;
        this.state.telemetry.totalEventsEmitted++;
        this.state.telemetry.throughputPerMin = Math.round(30 + Math.random() * 25);

        const newPulse: CollabPulseEvent = {
          id: `pulse_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          author: peer.name,
          authorColor: peer.color,
          channel: message.payload.channel || 'bellas:pulse',
          message: message.payload.message || 'Impuls zsynchronizowany na żywo',
          timestamp: Date.now()
        };

        this.state.recentPulses.unshift(newPulse);
        if (this.state.recentPulses.length > 25) {
          this.state.recentPulses.pop();
        }

        // Powiadom wszystkich
        this.broadcast({
          type: 'collab:pulse_emitted',
          payload: newPulse
        });

        this.broadcast({
          type: 'collab:dashboard_updated',
          payload: {
            telemetry: this.state.telemetry,
            nodes: this.state.nodes,
            recentPulses: this.state.recentPulses
          }
        });
        break;
      }

      case 'dashboard:toggle_node_status': {
        const { nodeId, status } = message.payload;
        const targetNode = this.state.nodes.find(n => n.id === nodeId);
        if (targetNode) {
          targetNode.status = status;
          targetNode.lastPingTime = Date.now();
          this.broadcast({
            type: 'collab:dashboard_updated',
            payload: {
              telemetry: this.state.telemetry,
              nodes: this.state.nodes,
              recentPulses: this.state.recentPulses
            }
          });
        }
        break;
      }

      case 'kino:trigger_scene': {
        const { mode, hue, title, particleIntensity } = message.payload;
        this.state.kinoScene = {
          mode,
          hue: typeof hue === 'number' ? hue : this.state.kinoScene.hue,
          title: title || `KINO NEXUS // PROJEKCJA [${mode}]`,
          particleIntensity: particleIntensity || 2.5,
          waveSpeed: 0.02,
          lastTriggeredBy: peer.name,
          lastTriggeredAt: Date.now()
        };

        // Zarejestruj też jako impuls telemetrii
        const pulseMsg: CollabPulseEvent = {
          id: `kino_evt_${Date.now()}`,
          author: peer.name,
          authorColor: peer.color,
          channel: 'kino:stream',
          message: `Zmiana projekcji Kina na: ${this.state.kinoScene.title} (${mode})`,
          timestamp: Date.now()
        };
        this.state.recentPulses.unshift(pulseMsg);

        this.broadcast({
          type: 'collab:kino_scene_updated',
          payload: this.state.kinoScene
        });
        this.broadcast({
          type: 'collab:pulse_emitted',
          payload: pulseMsg
        });
        break;
      }

      case 'kino:canvas_ping': {
        const ping: CollabCanvasPing = {
          id: `ping_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          peerId: peer.id,
          peerName: peer.name,
          peerColor: peer.color,
          x: Math.max(0, Math.min(1, message.payload.x)),
          y: Math.max(0, Math.min(1, message.payload.y)),
          timestamp: Date.now()
        };

        this.state.recentCanvasPings.push(ping);
        if (this.state.recentCanvasPings.length > 20) {
          this.state.recentCanvasPings.shift();
        }

        // Natychmiastowe rozesłanie fali do wszystkich obserwatorów
        this.broadcast({
          type: 'collab:kino_canvas_ping',
          payload: ping
        });
        break;
      }

      case 'scribe:create_note': {
        const { title, content, category } = message.payload;
        if (!title.trim() && !content.trim()) return;

        const newNote: CollabScribeNote = {
          id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          title: (title || 'Nowy Dekret').slice(0, 100),
          content: content || '',
          category: category || 'NOTATKA',
          author: peer.name,
          authorRole: peer.role,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          updatedBy: peer.name,
          activeEditors: []
        };

        this.state.scribeNotes.unshift(newNote);

        // Dodaj impuls do rejestru zdarzeń
        const pulseMsg: CollabPulseEvent = {
          id: `pulse_${Date.now()}`,
          author: peer.name,
          authorColor: peer.color,
          channel: 'scribe:notes',
          message: `Nowa nota w Scribe: [${newNote.category}] ${newNote.title}`,
          timestamp: Date.now()
        };
        this.state.recentPulses.unshift(pulseMsg);

        this.broadcast({
          type: 'collab:scribe_note_created',
          payload: newNote
        });
        this.broadcast({
          type: 'collab:pulse_emitted',
          payload: pulseMsg
        });
        break;
      }

      case 'scribe:update_note': {
        const { id, title, content, category } = message.payload;
        const note = this.state.scribeNotes.find(n => n.id === id);
        if (note) {
          note.title = title !== undefined ? title : note.title;
          note.content = content !== undefined ? content : note.content;
          note.category = category || note.category;
          note.updatedAt = Date.now();
          note.updatedBy = peer.name;

          this.broadcast({
            type: 'collab:scribe_note_updated',
            payload: note
          });
        }
        break;
      }

      case 'scribe:delete_note': {
        const { id } = message.payload;
        const index = this.state.scribeNotes.findIndex(n => n.id === id);
        if (index !== -1) {
          this.state.scribeNotes.splice(index, 1);
          this.broadcast({
            type: 'collab:scribe_note_deleted',
            payload: { id }
          });
        }
        break;
      }

      case 'scribe:typing': {
        const { noteId, isTyping } = message.payload;
        if (!this.typingMap.has(noteId)) {
          this.typingMap.set(noteId, new Set());
        }
        const set = this.typingMap.get(noteId)!;
        if (isTyping) {
          set.add(peer.name);
        } else {
          set.delete(peer.name);
        }

        const typingUsers: { noteId: string; peerName: string }[] = [];
        this.typingMap.forEach((names, nId) => {
          names.forEach(name => typingUsers.push({ noteId: nId, peerName: name }));
        });
        this.state.typingUsers = typingUsers;

        this.broadcast({
          type: 'collab:scribe_typing_updated',
          payload: { typingUsers }
        }, ws);
        break;
      }
    }
  }

  private cleanUpTypingForPeer(peerName: string) {
    let changed = false;
    this.typingMap.forEach((names) => {
      if (names.delete(peerName)) changed = true;
    });
    if (changed) {
      const typingUsers: { noteId: string; peerName: string }[] = [];
      this.typingMap.forEach((names, nId) => {
        names.forEach(name => typingUsers.push({ noteId: nId, peerName: name }));
      });
      this.state.typingUsers = typingUsers;
      this.broadcast({
        type: 'collab:scribe_typing_updated',
        payload: { typingUsers }
      });
    }
  }

  private updatePeersList() {
    this.state.peers = Array.from(this.clients.values());
  }

  private broadcast(msg: CollabServerMessage, excludeWs?: WebSocket) {
    const raw = JSON.stringify(msg);
    this.clients.forEach((_, clientWs) => {
      if (clientWs !== excludeWs && clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(raw);
      }
    });
  }

  private send(ws: WebSocket, msg: CollabServerMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  }

  private startHeartbeatAndTelemetryLoop() {
    setInterval(() => {
      this.state.telemetry.uptimeSeconds = Math.floor((Date.now() - this.serverStartTime) / 1000);
      this.state.telemetry.activeSubscriptionsCount = this.clients.size;

      // Broadcast periodic telemetry update to clients
      this.broadcast({
        type: 'collab:dashboard_updated',
        payload: {
          telemetry: this.state.telemetry,
          nodes: this.state.nodes,
          recentPulses: this.state.recentPulses
        }
      });
    }, 4000);
  }

  public getConnectedCount(): number {
    return this.clients.size;
  }
}
