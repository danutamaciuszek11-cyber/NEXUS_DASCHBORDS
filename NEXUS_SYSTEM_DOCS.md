# NEXUS SYSTEM ARCHITECTURE & PROTOCOLS (NXL v1.0)
**Document ID:** `DOC-NEXUS-NXL-GENESIS-2026`  
**Classification:** NEXUS ROOT SYSTEM ARCHITECTURE  
**Target Specification:** NXL v1.0.0-QUANTUM  
**Author:** Eterion (Chief Systems Architect of Nexus) & Architekt Wiktor  
**Seal Authority:** `0xROOT_MARCO_ARCHITECT_SEAL_9918`  
**Date:** 2026-09-16  

---

## EXECUTIVE SYSTEM OVERVIEW

The **NEXUS OS** is a capability-based distributed operating environment and multi-agent coordination system driven by **NXL v1.0 (Nexus Intention Language)**. It bridges human architectural intent, immutable state tracking, autonomous multi-agent workflows, real-time telemetry, and resilient micro-node cluster execution.

Rather than relying on loosely typed scripting or non-deterministic executions, NEXUS mandates **deterministic state progression**, **cryptographic authority validation**, and **immutable system kernel protection** via the **Truth Layer 2.0** and the **NXL Immutability Shield**.

```
+-----------------------------------------------------------------------------------+
|                                     NEXUS OS                                      |
+-----------------------------------------------------------------------------------+
|   UI & Presentation (React 19, Tailwind CSS, Scribe IDE, Visual Cinema, Mesh)    |
+-----------------------------------------------------------------------------------+
|   Express API & Runtime Gateways (/api/nxl/compile, /api/zip/analyze, /cluster)   |
+-----------------------------------------------------------------------------------+
|               NXL Core Engine: Lexer -> Parser -> AST -> Validator                |
+-----------------------------------------------------------------------------------+
|   Truth Layer 2.0 (Assertion Engine)  |  State Ledger (Append-Only Mutex)        |
+-----------------------------------------------------------------------------------+
|   Security Vault (0xROOT Auth)        |  Access Manager (Capability PDP / PEP)    |
+-----------------------------------------------------------------------------------+
|   NXL Immutability Shield             |  Zip Package Threat Interceptor           |
+-----------------------------------------------------------------------------------+
|   Synapse Mesh (24 Micro-nodes)       |  dRPC BSC Dock (Web3 Cryptographic Bridge)|
+-----------------------------------------------------------------------------------+
```

---

## 1. SYSTEM DESIGN & CORE ARCHITECTURE

### 1.1 Architectural Philosophy: The Five Layers
NEXUS unifies five foundational operational tiers:
1. **Deterministic Architecture:** Strict TypeScript typing, modular class hierarchies, zero unverified mutations, and explicit state schemas.
2. **Agentic Systematics:** Separation of *Identity*, *Capability*, *Memory*, *Tools*, and *Execution Contracts* (Bellas Family Agents: Marco, Elena, Leo, Sofia).
3. **Immutability & Truth:** Declarative specifications (`genesis.nxl`) compiled to immutable Directed Acyclic Graphs (DAGs), where assertions produce tamper-proof proof logs (`truthReports`).
4. **Resilient Micro-clustering:** A mesh of 24 synchronized node instances running continuous health checks and telemetry heartbeats.
5. **Boundary Defense:** Strict immutability shields preventing arbitrary file overwrites, directory traversals, or rogue runtime mutations.

---

### 1.2 NXL v1.0 Grammar & Kernel Subsystems

NXL is a high-level intention language specifically crafted for declare-and-verify systems orchestration. Its compiler pipeline consists of 6 dedicated modules:

```
[NXL Source Code]
       |
       v
  [1. NxlLexer] --------> [Tokens Stream: IDENTIFIER, KEYWORD, EQUALS, etc.]
       |
       v
  [2. NxlParser] -------> [ManifestAstNode: nodes, relations, states, grants, asserts]
       |
       v
 [3. NxlValidator] -----> [Diagnostic Collector: Syntax, References, Type safety]
       |
       v
   [4. NxlGraph] -------> [Intention DAG: Node entities, capabilities, bi-directional links]
       |
       v
[5. Truth Layer 2.0] ---> [Assertion Evaluator -> truthReports with tangible evidence]
       |
       v
 [6. State Ledger] -----> [Append-Only Mutation Log: versioned state progression]
```

#### A. Lexical Analyzer (`NxlLexer`)
- **Location:** `src/nexus/core/nxl/lexer.ts`
- **Grammar Keywords:** `define`, `node`, `relate`, `state`, `set`, `capability`, `grant`, `policy`, `permit`, `deny`, `assert`, `IDENTITY`, `SIGNATURE`.
- **Token Format:**
  ```typescript
  export interface NxlToken {
    type: TokenType;
    value: string;
    line: number;
    column: number;
  }
  ```

#### B. Syntactic Parser (`NxlParser`)
- **Location:** `src/nexus/core/nxl/parser.ts`
- Converts the token stream into a structured AST `ManifestAstNode`.
- Supports bidirectional node relations (`relate NodeA <-> NodeB`), capability allocations (`grant NodeA -> capability.name`), policy definitions with explicit effects (`permit` or `deny`), and assertion constraints (`assert state.path == VALUE`).

#### C. Type System & Enums (`NxlTypeSystem`)
- **Location:** `src/nexus/core/nxl/type-system.ts`
- **Supported Enums & Primitives:**
  - `BellasStatus`: `SECURE`, `ACTIVE`, `WARNING`, `LOCKED`, `DEGRADED`
  - `ClusterState`: `STABLE`, `SYNCING`, `ISOLATED`, `FAILOVER`
  - `Number`: Real integers and floating-point telemetry values
  - `String`: Literal string identifiers and cryptographic signatures
  - `Boolean`: `true` | `false`
- Rejects undeclared types or mismatched assignments at compile time.

#### D. Intention Graph Engine (`NxlGraph`)
- **Location:** `src/nexus/core/nxl/graph.ts`
- Materializes parsed nodes, relational edges, and capability sets into an in-memory graph.
- Implements capability resolution:
  ```typescript
  hasCapability(nodeId: string, capability: string): boolean
  ```

#### E. Truth Layer 2.0 & Proof Engine
- **Location:** `src/nexus/core/nxl/expression.ts` & `src/nexus/core/nxl/runtime.ts`
- Evaluates declarative assertions (`assert path == value`).
- For every evaluated assertion, generates an immutable `NxlTruthReport`:
  - `assertion`: String condition evaluated
  - `result`: Boolean `true` or `false`
  - `evidence`: State extraction verification trace (e.g. `State [nexus_root.status] = 'SECURE', Target = 'SECURE'`)
  - `timestamp`: ISO-8601 evaluation timestamp
  - `runtimeVersion`: `1.0.0-QUANTUM-TRUTH-2.0`

#### F. State Ledger (`NxlLedgerEntry`)
- Guarantees sequential, append-only records of all state modifications:
  - `version`: Monotonically increasing version integer
  - `target`: State path mutated (e.g. `nexus_root.status`)
  - `previousValue`: State before transformation
  - `newValue`: State after transformation
  - `valueType`: Schema type
  - `timestamp`: Mutation time
  - `reason`: Causality trace (e.g. `NXL Set Assignment`)

---

## 2. DATA FLOW SPECIFICATION

### 2.1 Full Compilation & Execution Pipeline
When a client submits an NXL source payload to `POST /api/nxl/compile`, the data flows through deterministic verification gates:

```
[Client / Scribe IDE]
         |
         | HTTP POST { source: string }
         v
[Express API Gateway: /api/nxl/compile]
         |
         | 1. Tokenization
         v
    [NxlLexer]
         |
         | 2. AST Construction
         v
    [NxlParser]
         |
         +-----------------------------+
         |                             |
         v                             v
  [NxlValidator]                [NxlGraph.build]
(Syntax & Ref Check)         (Node & Relation Graph)
         |                             |
         +--------------+--------------+
                        |
                        v
              [Truth Layer 2.0]
         (Evaluates AST Assertions)
                        |
                        v
              [NxlTransform & Ledger]
         (Records State Mutations)
                        |
                        v
              [NxlExecutor Plans]
         (Generates Micro-Step Plans)
                        |
                        v
[Response 200 OK: AST, Truth Reports, Ledger, Execution Plans]
```

---

### 2.2 Event-Driven Architecture (`NexusBus`)
Modules in NEXUS decouple state updates via a centralized singleton event bus (`src/nexus/bridges/nexus-bus.ts`):

- **Event Schema:**
  ```typescript
  export interface NexusEvent<T = any> {
    id: string;
    topic: string;
    sender: string;
    timestamp: string;
    payload: T;
  }
  ```
- **Primary Event Channels:**
  - `ZIP_ANALYSIS_COMPLETED`: Broadcasts security reports after archive extraction.
  - `BSC_TRANSACTION_VERIFIED`: Broadcasts confirmed blockchain settlement events.
  - `CLUSTER_HEARTBEAT_PULSE`: Distributes telemetry updates across the mesh.
  - `SCRIBE_MANIFEST_COMMITTED`: Notifies agents of approved genesis changes.

---

### 2.3 ZIP Package Inspection & Threat Shield Pipeline
Any archive uploaded through the client or API undergoes deep in-memory inspection by the `ZipAnalyzer`:

```
[Incoming ZIP Stream / Buffer]
              |
              v
     [JSZip In-Memory Parse]
              |
   +----------+-------------------------------------------------------+
   | Iterate Entries (relativePath)                                   |
   |                                                                  |
   | 1. Is extension .nxl?                     -> THREAT: BLOCKED     |
   | 2. Does path contain 'nexus/src/core'?    -> THREAT: BLOCKED     |
   | 3. Does path contain 'src/nexus/core'?    -> THREAT: BLOCKED     |
   | 4. Contains directory traversal '..'?     -> THREAT: BLOCKED     |
   | 5. Starts with absolute '/' or '\'?       -> THREAT: BLOCKED     |
   | 6. Ends in executable (.exe, .sh, .bat)?  -> THREAT: BLOCKED     |
   |                                                                  |
   | IF THREAT:                                                       |
   |   action = 'BLOCKED_IMMUTABLE_NXL'                               |
   |   threatsIntercepted++                                           |
   | ELSE:                                                            |
   |   action = 'ALLOWED'                                             |
   |   Calculate Simulated SHA-256 Checksum                           |
   +------------------------------------------------------------------+
              |
              v
[Compile ZipAnalysisReport]
  - id: 'ZIP-XXXX'
  - status: threatsIntercepted > 0 ? 'THREATS_BLOCKED' : 'CLEAN'
  - nxlSecurityCheck: 'PASS_IMMUTABLE_PROTECTED'
              |
              v
[Publish ZIP_ANALYSIS_COMPLETED -> NexusBus]
```

---

## 3. SECURITY POLICIES & THREAT MITIGATION

### 3.1 NXL Immutability Shield
The **NXL Immutability Shield** is the fundamental barrier protecting the core system from unauthorized file writes, code injections, and structural corruptions.

1. **Rule 1 — Absolute Protection of `*.nxl` Files:**
   No dynamic process, archive extraction, or user request is allowed to overwrite or create files matching `*.nxl` outside the cryptographic Scribe pipeline.
2. **Rule 2 — Kernel Core Quarantine:**
   Paths containing `/nexus/src/core/`, `nexus/src/core/`, `src/nexus/core/`, or `nexus/js/core/` are read-only at runtime. Any write request targeting these paths is instantly rejected.
3. **Rule 3 — Zero Directory Traversal:**
   Paths with `..`, `../`, or rooted indicators (`/etc/`, `C:\`) trigger an immediate `SECURITY_SHIELD` violation.
4. **Rule 4 — Executable & Script Prohibition:**
   Extraction or ingestion of `.exe`, `.sh`, `.bat`, or `.cmd` binary scripts is intercepted and quarantined.

```typescript
// Enforced by NxlRuntimeCore and ZipAnalyzer
validateFileWritePermission(filePath: string, signature?: string): { permitted: boolean; reason: string }
```

---

### 3.2 0xROOT Cryptographic Certificate Authority
All administrative operations, kernel sealing, high-value blockchain bridge invocations, and mesh reconfigurations require a valid **0xROOT** cryptographic seal.

- **Prefix Requirement:** Signatures must strictly begin with `0xROOT`.
- **Known Root Authorities:**
  - `0xROOT_MARCO_ARCHITECT_SEAL_9918` (Biooperator / Chief Architect)
  - `0xROOT_ELENA_LIGHT_ENG_8812` (Lead Light & Mesh Engineer)
  - `0xROOT_LEO_BRIDGE_GUARDIAN_7734` (Bridge & Web3 Guardian)
  - `0xROOT_SOFIA_CURATOR_6621` (Curator & Manifest Validator)
- **Policy Enforcement:**
  If a transaction, seal application, or write attempt supplies an unsigned payload or a non-`0xROOT` signature (e.g. `0xDEV_TEST`, `0xNONE`), `SecurityVault.validateTransactionAuth` returns `authorized: false` with an explicit violation log.

---

### 3.3 Access Manager: Capability-Based PDP & PEP
The `AccessManager` operates as a Policy Decision Point (PDP) and Policy Enforcement Point (PEP):
1. **Explicit AST Deny Policy:** Evaluated first. If an explicit `deny` policy exists for `(nodeId, capability)`, access is unconditionally rejected.
2. **Explicit AST Permit Policy:** If a `permit` policy matches, access is granted.
3. **Direct Graph Capability Grants:** Checks whether the node was explicitly assigned the capability via `grant Node -> capability`.
4. **Default Deny:** If no explicit grant or permit exists, returns `effect: DENY`.

---

### 3.4 Secret Hygiene & Isolation
- **Client-Side Zero Secrets:** Frontend components NEVER receive or store API keys, private keys, or root secrets.
- **Server-Side Proxying:** Any external service interaction (e.g., Gemini API, dRPC nodes) is proxied through server-side endpoints with lazy initialization and environment variable protection (`process.env.GEMINI_API_KEY`).

---

## 4. CLUSTER PROTOCOLS & SYNAPSE MESH

### 4.1 Synapse Mesh Topology
The **Synapse Mesh** is an interconnected cluster of **24 autonomous micro-nodes** providing distributed consensus, health tracking, and load balancing across the NEXUS system.

```
+---------------------------------------------------------------+
|                   SYNAPSE MESH (24 NODES)                     |
+-------------------------------+-------------------------------+
|  Zone A: Core Genesis Nodes   |  Zone B: Computational Relays |
|  - Node-01 (Nexus Primus)     |  - Node-07 (Synapse Router A) |
|  - Node-02 (Bellas Core)      |  - Node-08 (Synapse Router B) |
|  - Node-03 (Truth Sentry)     |  - Node-09 (Neural Link M)    |
|  - Node-04 (Immutability Gate)|  - Node-10 (Neural Link K)    |
|  - Node-05 (Ledger Vault)     |  ...                          |
|  - Node-06 (Scribe Engine)    |  - Node-16 (Compute Core)     |
+-------------------------------+-------------------------------+
|  Zone C: Web3 & Bridges       |  Zone D: Edge Telemetry       |
|  - Node-17 (dRPC Bridge 01)   |  - Node-21 (Gateway Alpha)    |
|  - Node-18 (dRPC Bridge 02)   |  - Node-22 (Gateway Beta)     |
|  - Node-19 (BSC Anchor Alpha) |  - Node-23 (Audit Beacon)     |
|  - Node-20 (BSC Anchor Beta)  |  - Node-24 (Failover Sentry)  |
+-------------------------------+-------------------------------+
```

### 4.2 Telemetry Protocol & Heartbeat Specifications
Every 3 seconds, all 24 nodes transmit a synchronous heartbeat across the mesh:

- **Instance State Matrix:**
  - `ONLINE`: Normal operational state, CPU < 70%, latency < 50ms.
  - `SYNCING`: Replicating state ledger from prime nodes.
  - `DEGRADED`: Transient packet loss or elevated compute load.
  - `FAILOVER`: Backup node activated to replace an unresponsive replica.
- **Cluster Aggregates (`ClusterMetrics`):**
  ```typescript
  export interface ClusterMetrics {
    instancesCount: number;      // Fixed at 24
    activeNodesCount: number;    // Number of ONLINE nodes
    averageLatencyMs: number;    // Rolling cluster latency
    totalMemoryMb: number;       // Aggregated allocated memory
    throughputRps: number;       // Requests Per Second processed
    securityAlertsCount: number; // Intercepted threat count
  }
  ```

---

### 4.3 Quantum CI/CD v3.1.0 Protocol
The Continuous Integration and Continuous Deployment engine orchestrates build immutability:
- **Build Target:** Deterministic single-pass bundling using `esbuild` for server-side CommonJS and `vite` for client-side assets.
- **Verification Gates:**
  1. `tsc --noEmit` Type Verification
  2. AST Grammar & Validation Diagnostics Check
  3. Truth Layer Assertion Testing
  4. Zip Threat Shield Integrity Verification
  5. Cryptographic 0xROOT Authorization Audit

---

### 4.4 Cluster REST Endpoints

| Method | Path | Access Control | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Kernel liveness and runtime identity check. |
| `GET` | `/api/cluster/telemetry` | Operator / Agent | Real-time health metrics of all 24 micro-nodes. |
| `POST` | `/api/nxl/compile` | Biooperator | Full AST compilation, truth verification, and plan generation. |
| `POST` | `/api/zip/analyze` | Public / Upload | Real-time ZIP extraction and threat interceptor. |
| `POST` | `/api/bsc/verify` | Biooperator (0xROOT) | Blockchain transaction confirmation and anchor verification. |

---

## 5. BELLAS AGENT FAMILY SPECIFICATION

The Bellas family consists of four specialized autonomous agents coordinated by the NXL runtime:

| Agent Name | Architectural Identity | Signature Seal | Primary Capabilities |
|---|---|---|---|
| **Marco (Architekt)** | `Biooperator_Architekt` | `0xROOT_MARCO_ARCHITECT_SEAL_9918` | `ai.synthesize`, `nexus.core.seal`, `system.bootstrap` |
| **Elena (Inżynier)** | `Elena_Light_Eng` | `0xROOT_ELENA_LIGHT_ENG_8812` | `synapse.mesh.deploy`, `cluster.route`, `telemetry.monitor` |
| **Leo (Strażnik)** | `Leo_Bridge_Guardian` | `0xROOT_LEO_BRIDGE_GUARDIAN_7734` | `drpc.bsc.anchor`, `security.vault.override`, `threat.intercept`|
| **Sofia (Kuratorka)**| `Sofia_Curator` | `0xROOT_SOFIA_CURATOR_6621` | `scribe.manifest.write`, `ast.curate`, `truth.validate` |

---

## 6. AUDIT & VERIFICATION MATRIX

To verify that any deployment complies with this specification, run the **Genesis Test Suite**:
```bash
npm test
# Equivalent to: npx tsx tests/genesis.test.ts
```

The Genesis Test Suite verifies:
- [x] NXL Lexer, Parser, AST, and Type System correctness.
- [x] Truth Layer 2.0 evaluation and evidence logging.
- [x] NXL Immutability Shield blocking unauthorized file writes to `*.nxl` and core paths.
- [x] Interception of Directory Traversal (`..`) and malicious scripts in ZIP archives.
- [x] 0xROOT cryptographic signature verification on transactions and kernel seals.
- [x] Default-deny capability enforcement via AccessManager PDP.
- [x] Synapse Mesh 24-node topology, telemetry heartbeats, and dRPC Web3 bridge operations.

---
*Signed and sealed into the Nexus Immutable Ledger by Eterion.*  
*Certificate: `0xROOT_MARCO_ARCHITECT_SEAL_9918`*
