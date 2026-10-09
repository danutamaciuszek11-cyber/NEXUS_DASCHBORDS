# NEXUS OS & NXL v1.0 — KOMPLEKSOWA DOKUMENTACJA TECHNICZNA STACKU TECHNOLOGICZNEGO

**Wersja:** 1.0.0-QUANTUM  
**Architektura:** Capability-Based Distributed Runtime with Immutable Truth Layer  
**Autor:** Eterion (Strategic Systems Architect of Nexus)  
**Status Dokumentu:** OFICJALNY / PRODUKCYJNY  

---

## SPIS TREŚCI

1. [Wprowadzenie i Przegląd Stosu Technologicznego](#1-wprowadzenie-i-przegląd-stosu-technologicznego)
2. [Pełna Specyfikacja API (REST & JSON Endpoints)](#2-pełna-specyfikacja-api-rest--json-endpoints)
   - 2.1. Kompilacja i Egzekucja NXL (`POST /api/nxl/compile`)
   - 2.2. Potok Wdrożeniowy Quantum CI/CD (`POST /api/ci-cd/deploy`)
   - 2.3. Analiza Pakietów ZIP i Detekcja Zagrożeń (`POST /api/zip/analyze`)
   - 2.4. Dziennik Audytowy Bezpieczeństwa Nexus (`GET /api/nexus/audit-log`)
   - 2.5. Telemetria Klastra Synapse Mesh (`GET /api/telemetry/nodes`)
   - 2.6. Zdalny Restart Węzłów Siatki (`POST /api/telemetry/nodes/restart`)
   - 2.7. Logi Klastra i Emisja Zdarzeń (`GET /api/cluster/logs`, `POST /api/cluster/logs/dispatch`)
   - 2.8. Healthcheck i Status Rdzenia (`GET /api/health`, `GET /api/system/status`)
   - 2.9. Dokumentacja i Asystent Bellas AI (`GET /api/documentation`, `POST /api/ai/bellas`)
3. [Architektura Systemowa i Silnik NXL Engine](#3-architektura-systemowa-i-silnik-nxl-engine)
   - 3.1. Warstwy Architektoniczne Silnika
   - 3.2. Potok Kompilacji NXL (Lexer -> Parser -> TypeChecker -> Ledger -> Truth Layer -> Execution Plan)
   - 3.3. Dyskretne Struktury Danych i Reprezentacja AST
4. [Diagramy Przepływu Danych i Topologia](#4-diagramy-przepływu-danych-i-topologia)
   - 4.1. Główny Przepływ Kompilacji i Weryfikacji Prawdy (Truth Assertion Flow)
   - 4.2. Potok Wdrożenia ZIP przez Quantum CI/CD i Tarcze NXL
   - 4.3. Przepływ Zdarzeń w Szynie Synapse Event Mesh
5. [Zabezpieczenia Środowiska Uruchomieniowego](#5-zabezpieczenia-środowiska-uruchomieniowego)
   - 5.1. NXL Immutability Shield i Ochrona Rdzenia
   - 5.2. Silnik Inspekcji ZipAnalyzerNode (Reguły Detekcji i Kwarantanny)
   - 5.3. Model Uprawnień Capability-Based RBAC
   - 5.4. Dziennik Audytowy i Odporność na Wstrzykiwanie Kodu
6. [Protokoły Replikacji Danych i Szyna Synapse Mesh](#6-protokoły-replikacji-danych-i-szyna-synapse-mesh)
   - 6.1. Architektura Szyny Komunikacyjnej `NexusBus`
   - 6.2. Model Spójności (Strong Consistency dla Prawdy, Eventual dla Telemetrii)
   - 6.3. Buforowanie i Integracja z Redis
7. [Mapowanie Usług i Topologia Klastra](#7-mapowanie-usług-i-topologia-klastra)
   - 7.1. Strefy Topologiczne Siatki Synapse Mesh (Strefy A, B, C, D)
   - 7.2. Katalog Węzłów i Monitorowanie Heartbeatów
   - 7.3. Procedura Samoleczenia i Izolacji Awarii (Fault Recovery)
8. [Instrukcja Instalacji i Uruchomienia](#8-instrukcja-instalacji-i-uruchomienia)
   - 8.1. Wymagania Wstępne
   - 8.2. Klonowanie i Instalacja Zależności
   - 8.3. Konfiguracja Zmiennych Środowiskowych
   - 8.4. Uruchomienie Środowiska Deweloperskiego
   - 8.5. Testy Jednostkowe i Zgodności (Genesis Test Suite)
   - 8.6. Budowa i Uruchomienie Produkcyjne
9. [Środowisko Docker i Konteneryzacja Produkcyjna](#9-środowisko-docker-i-konteneryzacja-produkcyjna)
   - 9.1. Tabela Zmiennych Środowiskowych
   - 9.2. Wieloetapowy Plik `Dockerfile`
   - 9.3. Konfiguracja Deweloperska: `docker-compose.dev.yml`
   - 9.4. Konfiguracja Produkcyjna: `docker-compose.yml`

---

## 1. Wprowadzenie i Przegląd Stosu Technologicznego

**NEXUS OS** to modularny, wysoce skalowalny ekosystem technologiczny oparty na paradygmacie **Capability-Based Distributed Runtime with Immutable Truth Layer**. Główną innowacją platformy jest dedykowany język formalny **NXL (Nexus eXecution Language)** v1.0, umożliwiający deterministyczną weryfikację asercji logicznych, ścisłą kontrolę uprawnień tożsamości oraz niezmienne logowanie transakcyjne.

### Składniki Stosu Technologicznego:
- **Język i Środowisko:** TypeScript 5.8, Node.js 20+ (Alpine w kontenerach)
- **Warstwa Wizualna i Interfejs:** React 19, Tailwind CSS v4, Lucide Icons, Recharts, D3 Force Simulation
- **Warstwa Serwera:** Express.js 4.21 z montowanym w trybie dev middlewarem Vite (HMR) oraz kompilacją produkcyjną przez esbuild
- **Silnik NXL (Core Engine):** Deterministyczny silnik leksera, parsera AST, kontrolera typów, silnika Truth Layer i planera egzekucji
- **Szyna Komunikacyjna:** `NexusBus` (In-Memory Pub/Sub) oraz rozszerzalny konektor `Redis 7` dla klastrów rozproszonych
- **Bezpieczeństwo i Autoryzacja:** Firebase Auth (klient) / Firebase Admin SDK + NXL Immutability Shield + `ZipAnalyzerNode`

---

## 2. Pełna Specyfikacja API (REST & JSON Endpoints)

Serwer backendowy udostępnia zunifikowany interfejs REST API działający domyślnie na porcie `3000`.

### 2.1. Kompilacja i Egzekucja NXL (`POST /api/nxl/compile`)
Przetwarza źródłowy kod NXL v1.0 przez pełny 6-stopniowy potok kompilacji i zwraca wygenerowane drzewo AST, raporty prawdy oraz plan wykonawczy.

- **Metoda:** `POST`
- **Ścieżka:** `/api/nxl/compile`
- **Nagłówki:** `Content-Type: application/json`
- **Ciało Żądania (Request Body):**
  ```json
  {
    "source": "define nexus_core\nnode Biooperator : IDENTITY(Biooperator_Architekt)\nstate nexus_root.status : BellasStatus\nset nexus_root.status = BellasStatus.SECURE\nassert nexus_root.status == SECURE"
  }
  ```
- **Kody Odpowiedzi:**
  - `200 OK`: Sukces kompilacji.
  - `400 Bad Request`: Brak parametru `source` lub błąd składniowy NXL.
- **Przykładowa Odpowiedź (200 OK):**
  ```json
  {
    "tokensCount": 18,
    "ast": {
      "type": "Program",
      "statements": [
        { "type": "DefineDeclaration", "name": "nexus_core" },
        { "type": "NodeDeclaration", "name": "Biooperator", "identity": "Biooperator_Architekt" },
        { "type": "StateDeclaration", "target": "nexus_root.status", "stateType": "BellasStatus" },
        { "type": "SetStatement", "target": "nexus_root.status", "value": "SECURE" },
        { "type": "AssertStatement", "condition": "nexus_root.status == SECURE" }
      ]
    },
    "diagnostics": [],
    "truthReports": [
      {
        "assertion": "nexus_root.status == SECURE",
        "result": true,
        "evidence": "State [nexus_root.status] = 'SECURE', Target = 'SECURE'",
        "timestamp": "2026-09-28T12:00:00.000Z"
      }
    ],
    "executionPlans": [
      {
        "step": 1,
        "action": "EVALUATE_ASSERTION",
        "target": "nexus_root.status == SECURE",
        "status": "VALIDATED"
      }
    ],
    "ledger": [
      {
        "txId": "TX-09A8F",
        "action": "SET_STATE",
        "target": "nexus_root.status",
        "timestamp": "2026-09-28T12:00:00.000Z"
      }
    ],
    "success": true
  }
  ```

---

### 2.2. Potok Wdrożeniowy Quantum CI/CD (`POST /api/ci-cd/deploy`)
*Aliasy punktu końcowego:* `/api/quantum-cicd/deploy`, `/api/zip/deploy`

Automatyczny potok dekompresji, analizy statycznej i wdrożenia pakietów ZIP w potoku Quantum CI/CD v3.1.0 z wymuszeniem weryfikacji NXL v1.0.

- **Metoda:** `POST`
- **Ścieżka:** `/api/ci-cd/deploy`
- **Nagłówki:** `Content-Type: application/json`
- **Ciało Żądania (Request Body):**
  ```json
  {
    "base64Data": "UEsDBAoAAAAAA...",
    "fileName": "production_bundle_v3.1.0.zip",
    "targetEnvironment": "production"
  }
  ```
- **Kody Odpowiedzi:**
  - `200 OK`: Pakiet bezpieczny, pomyślnie wdrożony do klastra.
  - `400 Bad Request`: Uszkodzone archiwum ZIP lub brak danych wejściowych.
  - `403 Forbidden`: Naruszenie bezpieczeństwa (`NXL_SECURITY_VIOLATION`), pakiet zablokowany.
- **Przykładowa Odpowiedź w przypadku Naruszenia Bezpieczeństwa (403 Forbidden):**
  ```json
  {
    "success": false,
    "error": "NXL_SECURITY_VIOLATION: Automated deployment aborted by Quantum CI/CD. Detected illegal attempt to modify immutable NXL core files or inject executable payload.",
    "blockedReasons": [
      "Plik 'nexus/src/core/nxl-engine.ts' narusza regułę niezmienności jądra NXL (BLOCKED_IMMUTABLE_NXL)."
    ],
    "report": {
      "packageName": "malicious_payload.zip",
      "totalFiles": 12,
      "nxlProtectedFiles": 1,
      "threatDetected": true,
      "status": "REJECTED_IMMUTABLE_VIOLATION"
    },
    "auditLogEntry": {
      "id": "AUDIT-M2K8-91X4",
      "timestamp": "2026-09-28T12:05:00.000Z",
      "action": "QUANTUM_CICD_DEPLOY_BLOCKED",
      "authority": "ZipAnalyzerNode::QuantumPipeline",
      "severity": "CRITICAL"
    }
  }
  ```

---

### 2.3. Analiza Pakietów ZIP i Detekcja Zagrożeń (`POST /api/zip/analyze`)
Inspekcja plików archiwów ZIP bez bezpośredniego wdrażania. Pozwala przetestować wektory ataków (Path Traversal, Core Overwrite, Malicious Extensions).

- **Metoda:** `POST`
- **Ścieżka:** `/api/zip/analyze`
- **Ciało Żądania:**
  ```json
  {
    "base64Data": "UEsDBAoAAAAAA...",
    "fileName": "inspect_me.zip",
    "sampleThreat": 1
  }
  ```
- **Odpowiedź (200 OK):** Zwraca szczegółowy obiekt `ZipAnalysisReport` z listą wpisów i statusami `ALLOWED` / `BLOCKED_IMMUTABLE_NXL` / `ISOLATED`.

---

### 2.4. Dziennik Audytowy Bezpieczeństwa Nexus (`GET /api/nexus/audit-log`)
*Aliasy punktu końcowego:* `/api/audit/logs`

Pobiera kryptograficznie zabezpieczoną historię zdarzeń audytowych klastra (w tym zablokowane wdrożenia CI/CD, naruszenia reguł niezmienności, operacje tożsamości).

- **Metoda:** `GET`
- **Ścieżka:** `/api/nexus/audit-log?limit=50`
- **Odpowiedź (200 OK):**
  ```json
  {
    "success": true,
    "count": 14,
    "auditLogs": [
      {
        "id": "AUDIT-99A1-XZ12",
        "timestamp": "2026-09-28T12:00:00.000Z",
        "action": "QUANTUM_CICD_DEPLOY_APPROVED",
        "protocol": "NXL-SEC-v1.0",
        "severity": "INFO",
        "authority": "ZipAnalyzerNode::QuantumPipeline",
        "target": "bundle_release_v1.zip",
        "status": "APPROVED",
        "details": {
          "totalFiles": 18,
          "checksum": "a8f9c1e7..."
        }
      }
    ]
  }
  ```

---

### 2.5. Telemetria Klastra Synapse Mesh (`GET /api/telemetry/nodes`)
Zwraca stan 24 węzłów w klastrze siatki Synapse Mesh (obciążenie procesora, przepustowość RPS, opóźnienie w milisekundach, status heartbeat).

- **Metoda:** `GET`
- **Ścieżka:** `/api/telemetry/nodes`
- **Odpowiedź (200 OK):**
  ```json
  {
    "nodes": [
      {
        "nodeId": "SYNAPSE-NODE-01",
        "name": "Alpha-Gateway-Node",
        "status": "ACTIVE",
        "protocol": "NXL-gRPC",
        "loadPercent": 34.5,
        "throughputRps": 520,
        "latencyMs": 0.95,
        "lastHeartbeat": "2026-09-28T12:10:00.000Z"
      }
    ],
    "cluster": {
      "totalNodes": 24,
      "healthyCount": 24,
      "avgLatencyMs": 1.05,
      "totalThroughputRps": 4920
    }
  }
  ```

---

### 2.6. Zdalny Restart Węzłów Siatki (`POST /api/telemetry/nodes/restart`)
Inicjuje miękki restart i re-synchronizację stanu wybranych węzłów siatki.

- **Metoda:** `POST`
- **Ścieżka:** `/api/telemetry/nodes/restart`
- **Ciało Żądania:**
  ```json
  {
    "nodeIds": ["SYNAPSE-NODE-01", "SYNAPSE-NODE-04"]
  }
  ```
- **Odpowiedź (200 OK):**
  ```json
  {
    "success": true,
    "restarted": ["SYNAPSE-NODE-01", "SYNAPSE-NODE-04"],
    "timestamp": "2026-09-28T12:11:00.000Z"
  }
  ```

---

### 2.7. Logi Klastra i Emisja Zdarzeń (`GET /api/cluster/logs`, `POST /api/cluster/logs/dispatch`)
- **`GET /api/cluster/logs`**: Pobiera strumień ostatnich 300 zdarzeń klastrowych z podziałem na klastry `Quantum CI/CD`, `Synapse Mesh` i `System Kernel`.
- **`POST /api/cluster/logs/dispatch`**: Emituje syntetyczne zdarzenie do szyny zdarzeń.
  - Ciało żądania: `{ "cluster": "Quantum CI/CD", "action": "TRIGGER_PIPELINE_STEP" }`

---

### 2.8. Healthcheck i Status Rdzenia (`GET /api/health`, `GET /api/system/status`)
- **`GET /api/health`**: Służy dla sond liveness/readiness kontenera Docker i Kubernetes. Zwraca kod `200 OK` i `{ "status": "healthy", "uptime": 1204.5 }`.
- **`GET /api/system/status`**: Zwraca kompleksową informację o wersji, pamięci RAM i stanie silnika NXL.

---

### 2.9. Dokumentacja i Asystent Bellas AI (`GET /api/documentation`, `POST /api/ai/bellas`)
- **`GET /api/documentation`**: Pobiera pełną zawartość niniejszej dokumentacji w formacie Markdown dla wbudowanej przeglądarki w UI.
- **`POST /api/ai/bellas`**: Łączy się z modelem Gemini API dla asystenta architektonicznego Biooperatora.

---

## 3. Architektura Systemowa i Silnik NXL Engine

System operacyjny NEXUS zaprojektowany został w układzie hierarchicznym z bezwzględnym rozdzieleniem warstwy obliczeniowej od warstwy gwarancji logicznych.

```
+-------------------------------------------------------------------------+
|                              NEXUS UI                                   |
|   (React 19 SPA, Tailwind CSS v4, D3 Force Simulation, Visual Panels)   |
+-------------------------------------------------------------------------+
                                    |
                            HTTP / REST / WS
                                    v
+-------------------------------------------------------------------------+
|                            EXPRESS SERVER                               |
|       (REST Routes, CI/CD Deployment Gateway, ZipAnalyzerNode Hook)     |
+-------------------------------------------------------------------------+
                                    |
                    +---------------+---------------+
                    v                               v
+-----------------------------------+   +---------------------------------+
|          NXL CORE ENGINE          |   |       SYNAPSE EVENT MESH        |
|  - Lexer & Parser (AST)           |   |  - NexusBus (Pub/Sub)           |
|  - TypeChecker & Capability RBAC  |   |  - 24-Node Topology Ring        |
|  - Truth Layer (Assert Evaluator) |   |  - Redis Cluster Connector      |
|  - NXL State Ledger               |   |  - Heartbeat & Telemetry        |
+-----------------------------------+   +---------------------------------+
                    |                               |
                    +---------------+---------------+
                                    v
+-------------------------------------------------------------------------+
|                       IMMUTABLE STORAGE & LOGS                          |
|    - ZipAnalyzer Immutability Shield (NXL Core Lockdown)                |
|    - Cryptographic Audit Log Ledger (Immutable Memory Store)            |
|    - Firebase Firestore (Persistence & Identity Vault)                  |
+-------------------------------------------------------------------------+
```

### 3.1. Warstwy Architektoniczne Silnika
1. **Warstwa Językowa (Lexer & Parser):** Przetwarza ciąg znaków języka NXL na sekwencję tokenów i konstruuje typowane drzewo AST (`NxlAST`).
2. **Warstwa Weryfikacji Semantycznej (TypeChecker):** Weryfikuje poprawność typów tożsamości, ról, stanów oraz gwarantuje, że węzły odwołują się wyłącznie do zarejestrowanych zmiennych.
3. **Warstwa Niezmiennej Prawdy (Truth Layer):** Wykonuje operatory asercji logicznych (`assert`) i generuje raporty dowodowe (`NxlTruthReport`). W przypadku fałszu, cała transakcja jest oznaczana jako niespełniona.
4. **Rejestr Stanu (NXL State Ledger):** Przechowuje sekwencyjny rejestr wszystkich modyfikacji stanów z unikalnym znacznikiem czasu i identyfikatorem transakcji.
5. **Planer Egzekucji (Execution Planner):** Tłumaczy zweryfikowany kod NXL na kroki wykonawcze dla agentów klastra.

### 3.2. Potok Kompilacji NXL
Kompilacja przebiega deterministycznie w 6 fazach:
```
ŹRÓDŁO NXL
    |
    v
[1. LEKSER] ----> Sekwencja Tokenów (KEYWORDS, IDENTIFIERS, OPERATORS)
    |
    v
[2. PARSER] ----> Abstrakcyjne Drzewo Składniowe (NxlAST)
    |
    v
[3. TYPE CHECKER] ----> Walidacja Typów, Tożsamości i Uprawnień
    |
    v
[4. STATE EVALUATOR] -> Aplikacja modyfikacji zmiennych do Mapy Stanów
    |
    v
[5. TRUTH LAYER] ------> Weryfikacja asercji logicznych (Assert Evaluator)
    |
    v
[6. PLANNER & LEDGER] -> Generowanie Planu Egzekucji i Wpisu do Księgi
```

---

## 4. Diagramy Przepływu Danych i Topologia

### 4.1. Główny Przepływ Kompilacji i Weryfikacji Prawdy
```
Użytkownik / API              NXLRuntime                 Truth Layer             NXL Ledger
      |                           |                           |                       |
      |--- POST /api/nxl/compile ->|                          |                       |
      |                           |--- Parsuj & Waliduj ----->|                       |
      |                           |                           |                       |
      |                           |--- Wykonaj Asercje ------>|                       |
      |                           |                           |-- Oblicz dowód logiczny
      |                           |<-- NxlTruthReport --------|                       |
      |                           |                                                   |
      |                           |--- Zapisz Transakcję do Księgi ------------------>|
      |<-- 200 OK (AST + Raporty)-|                                                   |
```

### 4.2. Potok Wdrożenia ZIP przez Quantum CI/CD i Tarcze NXL
```
Klient CI/CD / Admin           POST /api/ci-cd/deploy        ZipAnalyzerNode          Nexus Audit Log
      |                                  |                          |                        |
      |--- Wyślij Pakiet ZIP (Base64) -->|                          |                        |
      |                                  |--- Decompress & Scan --->|                        |
      |                                  |                          |-- Sprawdź *.nxl        |
      |                                  |                          |-- Sprawdź core/*       |
      |                                  |                          |-- Sprawdź skrypty .exe |
      |                                  |                          |                        |
      |                                  |   [WYKRYTO NARUSZENIE]   |                        |
      |                                  |<-- NXL_SECURITY_VIOLATION|                        |
      |                                  |                          |--- Zapisz Audyt ------>|
      |<-- 403 Forbidden (Audit ID) -----|                          |    (CRITICAL Severity) |
```

---

## 5. Zabezpieczenia Środowiska Uruchomieniowego

Środowisko Nexus OS wdraża koncepcję **Zero-Trust Defense-in-Depth**.

### 5.1. NXL Immutability Shield i Ochrona Rdzenia
Wszystkie pliki systemowe jądra NXL podlegają bezwzględnej ochronie przed modyfikacją podczas działania aplikacji. Pliki i ścieżki objęte blokadą immutability:
- Pliki z rozszerzeniem `*.nxl` (m.in. `genesis.nxl`)
- Pliki w katalogu `nexus/src/core/*` oraz `src/nexus/nxl-engine/*`
- Pliki binarne i wykonywalne skrypty powłoki (`.exe`, `.sh`, `.bat`, `.cmd`, `.bin`)

### 5.2. Silnik Inspekcji `ZipAnalyzerNode`
Każdy pakiet ZIP wprowadzany do klastra (przez API CI/CD lub panel administratora) jest analizowany pod kątem sygnatur zagrożeń:
1. **Reguła `BLOCKED_IMMUTABLE_NXL`:** Próba nadpisania plików `.nxl` lub jądra systemu natychmiast przerywa proces i zwraca błąd `403`.
2. **Reguła `ISOLATED_EXECUTABLE`:** Pliki wykonywalne są izolowane w kwarantannie.
3. **Walidacja Sum Kontrolnych (Checksum CRC32 / SHA-256):** Wykrywanie manipulacji integralnością pakietu w tranzycie.

### 5.3. Model Uprawnień Capability-Based RBAC
Każda tożsamość (`IDENTITY`) zdefiniowana w kodzie NXL posiada ściśle określone zdolności (`CAPABILITY`), np.:
- `Biooperator_Architekt`: Pełne uprawnienia do modyfikacji rejestru i kompilacji.
- `AegisSecurityOfficer`: Odczyt logów audytowych i wymuszanie kwarantanny.
- `GuestUser`: Dostęp wyłącznie w trybie tylko-do-odczytu.

---

## 6. Protokoły Replikacji Danych i Szyna Synapse Mesh

Szyna zdarzeń **NexusBus** obsługuje komunikację wewnętrzną o wysokiej przepustowości (do 5000 zdarzeń na sekundę) z zachowaniem determinizmu kolejkowania.

### 6.1. Model Spójności (Consistency Model):
1. **Silna Spójność (Strong Consistency) dla Warstwy Bezpieczeństwa:** Walidacja reguł NXL, autoryzacja oraz wpisy do dziennika audytowego są wykonywane synchronicznie i blokująco przed zwróceniem odpowiedzi.
2. **Spójność Ostateczna (Eventual Consistency) dla Telemetrii:** Statystyki węzłów, przepustowość RPS oraz logi klastrowe są rozgłaszane asynchronicznie i agregowane z oknem czasowym 2500 ms.

---

## 7. Mapowanie Usług i Topologia Klastra

Klaster Synapse Mesh składa się z 24 węzłów wirtualnych zorganizowanych w pierścień topologiczny o 4 strefach:

| Strefa Topologiczna | Identyfikatory Węzłów | Rola w Klastrze | Średnie Opóźnienie |
|---|---|---|---|
| **Strefa A (Gateway Core)** | `SYNAPSE-NODE-01` .. `06` | Przyjmowanie ruchu, routing API, autoryzacja wstępna | 0.85 ms |
| **Strefa B (NXL Execution)** | `SYNAPSE-NODE-07` .. `12` | Kompilacja kodu NXL, ewaluacja asercji prawdy | 1.10 ms |
| **Strefa C (CI/CD Pipeline)** | `SYNAPSE-NODE-13` .. `18` | Analiza ZIP, potok wdrożeniowy, skanowanie podatności | 0.95 ms |
| **Strefa D (Ledger & Audit)** | `SYNAPSE-NODE-19` .. `24` | Zapisywanie logów audytowych, replikacja stanu | 1.25 ms |

---

## 8. Instrukcja Instalacji i Uruchomienia

### 8.1. Wymagania Wstępne:
- **Node.js:** Wersja `20.0.0` lub nowsza
- **npm:** Wersja `10.x` lub nowsza
- **Docker & Docker Compose:** Wersja `24.x+` (opcjonalnie dla uruchomienia kontenerowego)

### 8.2. Klonowanie i Instalacja Zależności:
```bash
# 1. Klonowanie repozytorium
git clone https://github.com/nexus-core/nexus-os.git
cd nexus-os

# 2. Instalacja zależności projektowych (w tym deweloperskich)
npm install
```

### 8.3. Konfiguracja Zmiennych Środowiskowych:
Skopiuj plik wzorcowy `.env.example` do pliku roboczego `.env`:
```bash
cp .env.example .env
```
Uzupełnij klucz `GEMINI_API_KEY`, jeżeli planujesz korzystać z asystenta Bellas AI.

### 8.4. Uruchomienie Środowiska Deweloperskiego:
```bash
npm run dev
```
Aplikacja oraz backend Express.js zintegrowany z Vite będą dostępne pod adresem: `http://localhost:3000`.

### 8.5. Testy Jednostkowe i Zgodności (Genesis Test Suite):
Przed wdrożeniem produkcyjnym uruchom zestaw 89 testów weryfikujących integralność osłony NXL Immutability Shield:
```bash
npm run test
```

### 8.6. Budowa i Uruchomienie Produkcyjne:
```bash
# Budowa aplikacji klienckiej oraz paczkowanie serwera do /dist
npm run build

# Uruchomienie skompilowanego serwera produkcyjnego
npm start
```

---

## 9. Środowisko Docker i Konteneryzacja Produkcyjna

### 9.1. Tabela Zmiennych Środowiskowych

| Zmienna | Typ | Wymagana | Domyślna Wartość | Opis |
|---|---|---|---|---|
| `PORT` | Number | Nie | `3000` | Port nasłuchiwania serwera HTTP wewnątrz kontenera |
| `NODE_ENV` | String | Tak | `production` | Tryb działania środowiska (`development` / `production`) |
| `HOST` | String | Nie | `0.0.0.0` | Interfejs sieciowy powiązany z serwerem Express |
| `GEMINI_API_KEY` | String | Nie | `""` | Klucz API dla funkcji sztucznej inteligencji AI Studio |
| `REDIS_URL` | String | Nie | `redis://nexus-redis:6379` | Adres URL klastra Redis do synchronizacji zdarzeń |
| `NXL_ENFORCE_IMMUTABILITY` | Boolean | Nie | `true` | Wymuszenie blokady nadpisywania plików jądra NXL |
| `JWT_SECRET` | String | Na prod | `nexus-quantum-secret-key` | Sól kryptograficzna do podpisywania sesji |

---

### 9.2. Wieloetapowy Plik `Dockerfile`
Plik `Dockerfile` zoptymalizowany pod kątem minimalnego rozmiaru obrazu oraz bezpieczeństwa kontenera:

```dockerfile
# ==============================================================================
# NEXUS OS — MULTI-STAGE DOCKERFILE
# ==============================================================================
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache curl python3 make g++

COPY package*.json ./

# --- STAGE 2: Development Runtime Environment ---
FROM base AS development
ENV NODE_ENV=development
ENV PORT=3000
ENV HOST=0.0.0.0

RUN npm install
COPY . .

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["npm", "run", "dev"]

# --- STAGE 3: Production Build Pipeline ---
FROM base AS builder
ENV NODE_ENV=production
RUN npm ci
COPY . .
RUN npm run build

# --- STAGE 4: Production Runtime Environment ---
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY package*.json ./
RUN npm ci --only=production && apk add --no-cache curl

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/TECHNICAL_DOCUMENTATION.md ./TECHNICAL_DOCUMENTATION.md
COPY --from=builder /app/public ./public

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "dist/server.cjs"]
```

---

### 9.3. Konfiguracja Deweloperska: `docker-compose.dev.yml`
Zapewnia Hot Module Replacement (HMR) oraz automatyczne mapowanie plików z hosta:

```yaml
version: '3.8'

services:
  nexus-os-dev:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
    container_name: nexus_os_dev
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/dist
    env_file:
      - .env
    environment:
      - NODE_ENV=development
      - PORT=3000
      - HOST=0.0.0.0
    command: npm run dev
```

---

### 9.4. Konfiguracja Produkcyjna: `docker-compose.yml`
Produkcyjny zestaw zawierający warstwę aplikacji Nexus OS, zintegrowaną bazę cache Redis, limity zasobów procesora i pamięci RAM oraz automatyczne sondy liveness/readiness:

```yaml
version: '3.8'

networks:
  nexus-production-network:
    name: nexus-production-network
    driver: bridge

volumes:
  nexus-redis-data:
    name: nexus-redis-data
    driver: local

services:
  # Warstwa Aplikacyjna i Silnik NXL Engine
  nexus-os:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    container_name: nexus_os_core
    restart: always
    ports:
      - "3000:3000"
    env_file:
      - .env
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOST=0.0.0.0
      - REDIS_URL=redis://nexus-redis:6379
      - NXL_ENFORCE_IMMUTABILITY=true
    depends_on:
      nexus-redis:
        condition: service_healthy
    networks:
      - nexus-production-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 15s
    logging:
      driver: "json-file"
      options:
        max-size: "20m"
        max-file: "5"
    deploy:
      resources:
        limits:
          cpus: '2.00'
          memory: 2048M
        reservations:
          cpus: '0.25'
          memory: 512M

  # System Klastrowania i Szyny Zdarzeń (Redis Cache / PubSub)
  nexus-redis:
    image: redis:7-alpine
    container_name: nexus_redis_cache
    restart: always
    command: redis-server --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - nexus-redis-data:/data
    networks:
      - nexus-production-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

*NEXUS OS — Zintegrowana prawda, zabezpieczona kryptograficznie.*  
*Dokument zatwierdzony przez: Eterion, Strategic Systems Architect of Nexus.*
