# NEXUS OS & NXL v1.0 — KOMPLEKSOWA DOKUMENTACJA TECHNICZNA

**Wersja:** 1.0.0-QUANTUM  
**Architektura:** Capability-Based Distributed Runtime with Immutable Truth Layer  
**Autor:** Eterion (Strategic Systems Architect of Nexus)

---

## Spis Treści
1. [Specyfikacja API (REST & JSON Endpoints)](#1-specyfikacja-api-rest--json-endpoints)
2. [Architektura Systemowa (NXL Engine)](#2-architektura-systemowa-nxl-engine)
3. [Schematy Przepływu Danych](#3-schematy-przepływu-danych)
4. [Zabezpieczenia Środowiska Uruchomieniowego](#4-zabezpieczenia-środowiska-uruchomieniowego)
5. [Replikacja Danych i Mapowanie Usług (Synapse Mesh)](#5-replikacja-danych-i-mapowanie-usług-synapse-mesh)
6. [Instrukcja Instalacji i Uruchomienia](#6-instrukcja-instalacji-i-uruchomienia)
7. [Środowisko Docker i Zmienne Środowiskowe](#7-środowisko-docker-i-zmienne-środowiskowe)

---

## 1. Specyfikacja API (REST & JSON Endpoints)

Wszystkie punkty końcowe API są obsługiwane przez zintegrowany serwer Express na porcie `3000` z włączoną kontrolą dostępu przez NXL Capability Layer. 

### 1.1 Kompilacja i Egzekucja NXL (`POST /api/nxl/compile`)
Przekazuje kod źródłowy NXL v1.0 przez pełny potok kompilacji (Lekser -> Parser -> TypeChecker -> Ledger -> Truth Layer -> Execution Plan).

- **Payload żądania:**
  ```json
  {
    "source": "define nexus_core\nnode Biooperator : IDENTITY(Biooperator_Architekt)\nstate nexus_root.status : BellasStatus\nset nexus_root.status = BellasStatus.SECURE\nassert nexus_root.status == SECURE"
  }
  ```
- **Odpowiedź (200 OK):**
  ```json
  {
    "tokensCount": 18,
    "ast": { ... },
    "diagnostics": [],
    "truthReports": [
      {
        "assertion": "nexus_root.status == SECURE",
        "result": true,
        "evidence": "State [nexus_root.status] = 'SECURE', Target = 'SECURE'",
        "timestamp": "2026-09-16T01:00:00.000Z"
      }
    ],
    "executionPlans": [],
    "ledger": [ ... ],
    "success": true
  }
  ```

### 1.2 Analiza Pakietów ZIP (`POST /api/zip/analyze`)
Inspekcja archiwalnych pakietów ZIP w czasie rzeczywistym z egzekwowaniem osłony **NXL Immutability Shield**. Zabezpiecza przed próbami wstrzyknięcia do plików rdzenia.

- **Payload żądania:**
  ```json
  {
    "base64Data": "UEsDBAoAAAAAA...",
    "fileName": "package_v1.zip",
    "sampleThreat": false
  }
  ```
- **Odpowiedź (200 OK):**
  ```json
  {
    "id": "ZIP-9A8B7C6D",
    "status": "THREATS_BLOCKED",
    "threatsIntercepted": 1,
    "files": [ ... ]
  }
  ```

### 1.3 Pobieranie Telemetrii Klastra (`GET /api/cluster/telemetry`)
Zwraca na żywo metryki obciążenia, status, ilość instancji i punktację dla klastrów Synapse Mesh, Agent Sandbox oraz Quantum CI/CD.

- **Odpowiedź (200 OK):**
  Zwraca obiekt konfiguracyjny (np. `{ "quantumCiCd": { ... }, "synapseMesh": { ... }, "ledgerEntries": [ ... ] }`) zawierający metryki opóźnień (latency), przepustowości (RPS) i aktywności (Ledger).

### 1.4 Dokumentacja Techniczna (`GET /api/documentation`)
Zwraca zawartość niniejszej specyfikacji Markdown dla dynamicznego wczytywania i generowania w IDE Scribe.

### 1.5 Status i Diagnostyka (`GET /api/health`)
Endpoint używany przez systemy orchestracji (np. Docker, Kubernetes) do weryfikacji dostępności usługi, zwracający czyste `{ "status": "ok" }`.

---

## 2. Architektura Systemowa (NXL Engine)

NEXUS OS opiera się na innowacyjnym silniku NXL v1.0, zaprojektowanym wokół następujących głównych modułów:

1. **Lexer (Analizator Leksykalny):** Zamienia ciągi znaków NXL na stabilne tokeny (`KEYWORD`, `IDENTIFIER`, `LITERAL`).
2. **Parser (Analizator Składniowy):** Przetwarza tokeny w Abstrakcyjne Drzewo Składniowe (AST), definiując węzły (`Nodes`), zależności (`Relations`), stany (`States`) oraz dyrektywy bezpieczeństwa (`Capabilities & Policies`).
3. **Type System (System Typów):** Statycznie sprawdza relacje i zgodność przypisań typów do struktury klastrów.
4. **Runtime & Ledger (Środowisko Uruchomieniowe):** Centralny komponent (`NXLRuntime`) z globalną mapą stanów, wbudowanym systemem audytów (Audit Logs) oraz niezmiennym rejestrem zmian (Ledger).
5. **Truth Layer (Warstwa Prawdy):** Moduł weryfikacji stanu. Kategoryzuje asercje zdefiniowane jako klauzule `assert` w NXL. Weryfikuje dowody i zapisuje ostateczny stan systemu do raportu `NxlTruthReport`.
6. **Execution Engine (Generowanie Zadań):** Moduł odpowiedzialny za transkrypcję abstrakcji ze zwalidowanych plików z pomocą warunków `when X execute Y` do docelowych akcji klastra (Execution Plans).

---

## 3. Schematy Przepływu Danych

### 3.1 Przepływ Kompilacji i Weryfikacji (NXL Pipeline)
```text
[ Kod Źródłowy NXL (Biooperator) ]
       |
       v
  [ NxlLexer ] ----> Ekstrakcja Tokenów (Keywords, Identifiers)
       |
       v
  [ NxlParser ] ---> Tworzy Drzewo AST (Nodes, States, Rules)
       |
       v
[ NxlTypeSystem ] -> Statyczna Kontrola Typów & Walidacja Relacji
       |
       v
 [ NXLRuntime ] ---> Rejestracja Wersji w Ledgerze (v1 -> v2)
       |
       +---> [ Truth Layer ] ---------> Generowanie Raportu Prawdy
       |
       +---> [ Capability Layer ] ----> Generowanie Planu Egzekucji
```

### 3.2 Przepływ Analizy i Bezpieczeństwa Archiwów (ZIP Analyzer)
```text
[ Upload ZIP / Zgłoszenie z API lub klienta ]
       |
       v
 [ JSZip Buffer & Extractor ]
       |
       v
[ ZipAnalyzer.analyzeBuffer() ]
       |
       +---> Czy plik próbuje nadpisać *.nxl lub /nexus/js/core/?
                 |
                 +-- TAK --> [ BLOCKED_IMMUTABLE_NXL ] -> Wzrost Licznika Zagrożeń (Alert)
                 |
                 +-- NIE --> [ ALLOWED ] --------------> Bezpieczna Ekstrakcja
       |
       v
 [ Publikacja Raportu na NexusBus -> Zapis w Audycie Bezpieczeństwa ]
```

---

## 4. Zabezpieczenia Środowiska Uruchomieniowego

Architektura Nexus implementuje rygorystyczny mechanizm kontroli bezpieczeństwa, zwany **NXL Immutability Shield**.

### 4.1 NXL Immutability Shield
- **Zasada 1 (Blokada zapisu `.nxl`):** Żaden dynamiczny proces uruchomieniowy czy zadanie dekompresji (ZipAnalyzer) nie może nadpisać ani utworzyć plików pasujących do wzorca `*.nxl` poza ściśle autoryzowanym potokiem Scribe.
- **Zasada 2 (Kwarantanna Kodu Rdzenia):** Ścieżki rdzenia systemowego, np. `/nexus/src/core/`, `src/nexus/core/` lub `/nexus/js/core/`, są całkowicie zamrożone (Read-Only) w trakcie działania.
- **Zasada 3 (Zero Traversal):** Zablokowana możliwość ominięcia środowiska plików (np. ścieżki z `../` lub root `/etc/` w pakietach ZIP) wyzwala natychmiastowy wyjątek bezpieczeństwa.
- **Zasada 4 (Blokada Wykonywalnych):** Ekstrakcja wirusów, np. skryptów i binarek (`.exe`, `.sh`, `.bat`), jest wyłapywana z przypisaniem akcji `BLOCKED_IMMUTABLE_NXL`.

### 4.2 Certyfikaty 0xROOT
Wszystkie krytyczne operacje (sealing w IDE Scribe, weryfikacja plików i transakcje Blockchain) wymagają cyfrowego podpisu prefiksowanego **`0xROOT`**. Znane autorytety (Identity Agents):
- `0xROOT_MARCO_ARCHITECT_SEAL_9918` (Biooperator / Architect)
- `0xROOT_ELENA_LIGHT_ENG_8812` (Inżynieria Mesh)
- `0xROOT_LEO_BRIDGE_GUARDIAN_7734` (Ochrona Mostów)
- `0xROOT_SOFIA_CURATOR_6621` (Kuratorka Manifestu)

### 4.3 Zarządzanie Uprawnieniami (Capability-Based PDP)
Wykorzystuje się model wzorowany na architekturach PDP (Policy Decision Point) oraz PEP (Policy Enforcement Point). Prawa są definiowane wprost przez instrukcję `grant` i sprawdzane przy każdej próbie uzyskania dostępu do chronionej podsieci (`ai.synthesize`, `zip.extraction`, `file.write`). Jeśli polityka nie przyzna jawnie pozwolenia, żądanie jest odrzucane (Default Deny).

---

## 5. Replikacja Danych i Mapowanie Usług (Synapse Mesh)

Struktura komunikacyjna systemu to **Synapse Mesh Cluster (24 Mikrowęzły)** oraz **Quantum CI/CD (16 potoków weryfikacyjnych)**.

### 5.1 Topologia Klastra
```text
+---------------------------------------------------------------+
|                   SYNAPSE MESH (24 NODES)                     |
+-------------------------------+-------------------------------+
|  Zone A: Core Genesis Nodes   |  Zone B: Computational Relays |
|  - Node-01 (Nexus Primus)     |  - Node-07 (Synapse Router A) |
|  - Node-02 (Bellas Core)      |  - Node-08 (Synapse Router B) |
|  - Node-03 (Truth Sentry)     |  - Node-09 (Neural Link M)    |
|  - Node-04 (Immutability Gate)|  - Node-10 (Neural Link K)    |
+-------------------------------+-------------------------------+
|  Zone C: Web3 & Bridges       |  Zone D: Edge Telemetry       |
|  - Node-17 (dRPC Bridge 01)   |  - Node-21 (Gateway Alpha)    |
|  - Node-18 (dRPC Bridge 02)   |  - Node-22 (Gateway Beta)     |
|  - Node-19 (BSC Anchor Alpha) |  - Node-23 (Audit Beacon)     |
+-------------------------------+-------------------------------+
```

### 5.2 Protokół Replikacji Danych (Ledger Consensus)
1. **Heartbeat Protocol:** Każde 3 sekundy węzły zgłaszają metryki za pomocą szyny `Nexus Event Bus`. Reaguje ona asynchronicznie dystrybuując logi zdarzeń.
2. **State Syncing:** Obiekty transakcyjne (zmiany stanów, nadanie capabilities) zarejestrowane w instancji `NXLRuntime` są propagowane do puli zadań roboczych wszystkich podpiętych klientów i widoków aplikacji.
3. **Eventual Consistency:** System stosuje asynchroniczną spójność dla rejestrów telemetrii z wektorami wersjonowania, zachowując przy tym silną spójność na warstwie bezpieczeństwa (NXL Core Validation jest atomowe).

---

## 6. Instrukcja Instalacji i Uruchomienia

Aby wdrożyć Nexus OS na lokalnej maszynie, postępuj zgodnie z poniższymi instrukcjami. Projekt opiera się na React 19 (TypeScript), Vite oraz Express.js z wbudowanym serwerem plików.

### Wymagania wstępne:
- Node.js (v20.0 lub nowszy)
- npm (v10.x lub nowszy)
- Środowisko Docker i Docker Compose (dla instalacji kontenerowej)

### Krok 1: Klonowanie repozytorium i instalacja zależności
```bash
# Sklonuj repozytorium do katalogu
git clone <adres_repozytorium_nexus>
cd nexus-os

# Zainstaluj zależności projektowe (frontend i serwer backendowy)
npm install
```

### Krok 2: Skonfigurowanie zmiennych środowiskowych
Utwórz plik konfiguracyjny `.env` skopiowany bezpośrednio ze wzorca `.env.example`:
```bash
cp .env.example .env
```
Należy uzupełnić co najmniej zmienną `GEMINI_API_KEY`, aby odblokować możliwości warstwy inteligentnej Biooperatora oraz weryfikacji asercji.

### Krok 3: Uruchomienie lokalne – Środowisko Deweloperskie
NEXUS OS łączy serwer Express.js i architekturę kliencką (Middleware Vite dla HMR) w jeden proces. Używamy `tsx` do rozruchu serwera TypeScriptowego bez procesu transpilacji do dysku:
```bash
npm run dev
```
Aplikacja oraz szyna API będzie dostępna pod adresem: `http://localhost:3000`

### Krok 4: Weryfikacja Testów Zabezpieczeń Systemowych (Genesis Suite)
Aby potwierdzić hermetyczność osłony Immutable Shield (wszystkie 89 asercji), należy uruchomić wewnętrzny test środowiskowy:
```bash
npm run test
```
Jeżeli weryfikacja zwróci wynik `PASS`, system można bezpiecznie wdrożyć.

### Krok 5: Budowa i uruchomienie produkcyjne (Standalone Node.js)
```bash
# Budowa aplikacji klienta (Vite) oraz paczkowanie pliku serwera (esbuild) do katalogu /dist
npm run build

# Uruchomienie gotowego serwera aplikacyjnego
npm start
```

---

## 7. Środowisko Docker i Zmienne Środowiskowe

Architektura konteneryzacji NEXUS zdefiniowana jest wieloetapowym plikiem `Dockerfile` zapewniającym odpowiednią separację środowisk, redukcję wielkości obrazu produkcyjnego oraz odpowiedni caching budowy warstw.

### Lista Zmiennych Środowiskowych
| Zmienna | Opis | Domyślnie |
|---|---|---|
| `PORT` | Wewnętrzny port kontenera dla serwera Express | `3000` |
| `NODE_ENV` | Tryb uruchomienia (kontroluje podłączanie Middleware Vite i błędy) | `development` / `production` |
| `GEMINI_API_KEY` | Klucz API dla usług sztucznej inteligencji AI Studio | (wymagany) |
| `NXL_ENFORCE_IMMUTABILITY` | Hard-lock dla osłony bezpieczeństwa Truth Layer | `true` |
| `JWT_SECRET` | Kryptograficzna sól operacji tożsamości dla tokenów operacyjnych | (wymagany na prod) |
| `BSC_RPC_URL` | Adres węzła szyny stanu blockchain dla logowania Ledger NXL | `https://bsc-dataseed.binance.org/` |

### Docker Compose — Środowisko Deweloperskie (`docker-compose.dev.yml`)
Środowisko to nakierowane jest na wysoką iteracyjność programisty. Obraz budowany jest z etapu (stage) pośredniego `builder`, a kod źródłowy hosta jest "bindowany" (Bind Mounts), gwarantując pełen wgląd `tsx` do naniesionych zmian, bez przeładowywania obrazów Dockera.

```yaml
version: '3.8'
services:
  nexus-os-dev:
    build:
      context: .
      dockerfile: Dockerfile
      target: builder
    container_name: nexus_os_dev
    ports:
      - "3000:3000"
    volumes:
      # Mapuje główny katalog projektu
      - .:/app
      # Zapobiega nadpisywaniu zależności node_modules dla danego os'a
      - /app/node_modules
    env_file:
      - .env
    environment:
      - NODE_ENV=development
      - PORT=3000
    command: npm run dev
```

### Docker Compose — Środowisko Produkcyjne (`docker-compose.yml`)
Środowisko w pełni odporne na błędy, zoptymalizowane pod kontem użycia zasobów produkcyjnych. Obraz tworzony jest w stage `runner`, odrzucając zbędne zależności. Konfiguracja domyślnie podłącza się i wymusza uruchomienie węzła cache, implementując również odświeżanie logowania w celu zablokowania przepełnienia woluminu na dysku.

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
  # Warstwa Aplikacyjna NEXUS
  nexus-os:
    build:
      context: .
      dockerfile: Dockerfile
      target: runner
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

  # System Klastrowania Wydarzeń Synapse (Event Bus Cache)
  nexus-redis:
    image: redis:7-alpine
    container_name: nexus_redis_cache
    restart: always
    command: redis-server --appendonly yes --requirepass ""
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
*NEXUS OS — Zintegrowana prawda, zabezpieczona kryptograficznie.* Zespół autorski dziękuje za zaufanie w tworzeniu odpornych na przyszłość platform chmurowych.
