/**
 * NEXUS ECOSYSTEM CORE EXPORTS
 * =======================================================
 * Zcentralizowany punkt wejścia dla stanu, magistrali zdarzeń,
 * węzłów i interfejsów ekosystemu Nexus.
 */

// Centralized State Management (Zustand + Pub/Sub)
export {
  useNexusStore,
  nexusStore,
  type NexusState,
  type NexusModalType,
  type DiagnosticsTabType,
  type BnbDockingState
} from './core/nexus-store';

// Pub/Sub Event Bus
export {
  nexusBus,
  NexusBus,
  type NexusEvent,
  type NexusEventListener,
  type BusMetrics
} from './core/nexus-bus';

// Nexus Engine & Bellas Roster
export {
  nexusCore,
  NexusCore,
  type BellasMember
} from './core/nexus-core';

// Micro-Node Life Cycle Base
export {
  NexusNode,
  type NodeMetadata
} from './core/nexus-node';

// BNB Chain Sovereign Docking Client & Gateway
export {
  nexusClient,
  dockToNexus,
  fetchLast10Blocks,
  getProcessedBlocks,
  type ProcessedBlock,
  type TelemetryTruthClassification,
  type DockingResult,
  type NexusBnbDockConfig,
  DEFAULT_BNB_CONFIG
} from '../lib/nexusBnbDock';

// AEGIS Master Gate (ZASADA 01 & ZASADA 02)
export {
  verifyDeterministicMath,
  verifyNodeToken,
  executeAegisMasterGate,
  type AegisValidationResult,
  type AegisTransactionMath,
  type TruthClassification
} from '../lib/aegisMasterGate';

