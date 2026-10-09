/**
 * NEXUS REAL-TIME COLLABORATION TYPES
 * ========================================================
 * Typy protokołu WebSocket dla synchronizacji w czasie rzeczywistym
 * pomiędzy połączonymi klientami: Dashboard, Kino Streams oraz Scribe Notes.
 */

export type CollabRole = 'ARCHITECT' | 'OPERATOR' | 'SEEKER' | 'ENGINEER' | 'GUEST';

export type CollabTab = 'dashboard' | 'kino' | 'scribe';

export interface CollabPeer {
  id: string;
  name: string;
  role: CollabRole;
  color: string;
  avatar: string;
  activeTab: CollabTab;
  cursor?: { x: number; y: number } | null;
  connectedAt: number;
  lastPing: number;
}

export interface CollabTelemetry {
  throughputPerMin: number;
  totalEventsEmitted: number;
  activeSubscriptionsCount: number;
  channelCounts: Record<string, number>;
  uptimeSeconds: number;
}

export interface CollabNodeStatus {
  id: string;
  name: string;
  icon: string;
  bellasOwner: string;
  status: 'ONLINE' | 'SYNCHRONIZING' | 'OFFLINE';
  lastPingTime: number;
}

export interface CollabPulseEvent {
  id: string;
  author: string;
  authorColor: string;
  channel: string;
  message: string;
  timestamp: number;
}

export interface CollabKinoScene {
  mode: 'VOID_BLUE' | 'CORE_EMERALD' | 'BELLAS_AMBER' | 'QUANTUM_VIOLET' | 'SUPERNOVA';
  title: string;
  hue: number;
  particleIntensity: number;
  waveSpeed: number;
  lastTriggeredBy: string;
  lastTriggeredAt: number;
}

export interface CollabCanvasPing {
  id: string;
  peerId: string;
  peerName: string;
  peerColor: string;
  x: number; // 0 to 1 relative
  y: number; // 0 to 1 relative
  timestamp: number;
}

export interface CollabScribeNote {
  id: string;
  title: string;
  content: string;
  category: 'DEKRET' | 'INSTRUKCJA' | 'IMPULS' | 'NOTATKA';
  author: string;
  authorRole: CollabRole;
  createdAt: number;
  updatedAt: number;
  updatedBy: string;
  activeEditors: string[];
}

export interface CollabServerState {
  peers: CollabPeer[];
  telemetry: CollabTelemetry;
  nodes: CollabNodeStatus[];
  recentPulses: CollabPulseEvent[];
  kinoScene: CollabKinoScene;
  recentCanvasPings: CollabCanvasPing[];
  scribeNotes: CollabScribeNote[];
  typingUsers: { noteId: string; peerName: string }[];
}

// WebSocket message envelope
export type CollabClientMessage =
  | { type: 'peer:identify'; payload: { name: string; role: CollabRole; color: string; avatar: string; activeTab: CollabTab } }
  | { type: 'peer:set_active_tab'; payload: { activeTab: CollabTab } }
  | { type: 'peer:cursor_move'; payload: { x: number; y: number } }
  | { type: 'dashboard:trigger_pulse'; payload: { channel: string; message: string } }
  | { type: 'dashboard:toggle_node_status'; payload: { nodeId: string; status: 'ONLINE' | 'SYNCHRONIZING' | 'OFFLINE' } }
  | { type: 'kino:trigger_scene'; payload: { mode: CollabKinoScene['mode']; hue: number; title: string; particleIntensity?: number } }
  | { type: 'kino:canvas_ping'; payload: { x: number; y: number } }
  | { type: 'scribe:create_note'; payload: { title: string; content: string; category: CollabScribeNote['category'] } }
  | { type: 'scribe:update_note'; payload: { id: string; title: string; content: string; category: CollabScribeNote['category'] } }
  | { type: 'scribe:delete_note'; payload: { id: string } }
  | { type: 'scribe:typing'; payload: { noteId: string; isTyping: boolean } };

export type CollabServerMessage =
  | { type: 'collab:init'; payload: CollabServerState & { yourPeerId: string } }
  | { type: 'collab:peer_joined'; payload: CollabPeer }
  | { type: 'collab:peer_left'; payload: { peerId: string } }
  | { type: 'collab:peer_updated'; payload: CollabPeer }
  | { type: 'collab:peers_list'; payload: CollabPeer[] }
  | { type: 'collab:dashboard_updated'; payload: { telemetry: CollabTelemetry; nodes: CollabNodeStatus[]; recentPulses: CollabPulseEvent[] } }
  | { type: 'collab:pulse_emitted'; payload: CollabPulseEvent }
  | { type: 'collab:kino_scene_updated'; payload: CollabKinoScene }
  | { type: 'collab:kino_canvas_ping'; payload: CollabCanvasPing }
  | { type: 'collab:scribe_note_created'; payload: CollabScribeNote }
  | { type: 'collab:scribe_note_updated'; payload: CollabScribeNote }
  | { type: 'collab:scribe_note_deleted'; payload: { id: string } }
  | { type: 'collab:scribe_typing_updated'; payload: { typingUsers: { noteId: string; peerName: string }[] } }
  | { type: 'collab:error'; payload: { message: string } };
