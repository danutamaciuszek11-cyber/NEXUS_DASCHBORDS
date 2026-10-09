# NEXUS OS & NXL ENGINE (v1.0.0-QUANTUM)

<div align="center">

```
   ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗     ██████╗ ███████╗
   ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝    ██╔═══██╗██╔════╝
   ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗    ██║   ██║███████╗
   ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║    ██║   ██║╚════██║
   ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║    ╚██████╔╝███████║
   ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝     ╚═════╝ ╚══════╝
```

**Capability-Based Distributed Operating Environment • NXL Intention Engine • Truth Layer 2.0 • Synapse Mesh**

[![Genesis Test Suite](https://img.shields.io/badge/Genesis%20Suite-89%2F89%20PASS-emerald?style=flat-square&logo=checkmarx)](tests/genesis.test.ts)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](tsconfig.json)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](package.json)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey?style=flat-square&logo=express)](server.ts)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple?style=flat-square&logo=vite)](vite.config.ts)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED?style=flat-square&logo=docker)](Dockerfile)
[![Status](https://img.shields.io/badge/Security%20Seal-0xROOT_VERIFIED-green?style=flat-square)](NEXUS_SYSTEM_DOCS.md)

</div>

---

## 1. WPROWADZENIE I MANIFEST SYSTEMU

**NEXUS OS** to modularny, wysokowydajny ekosystem technologiczny oparty na paradygmacie **Capability-Based Distributed Runtime with Immutable Truth Layer**. Zbudowany dla środowisk chmurowych, rozproszonych klastrów mikro-węzłów oraz wieloagentowej orkiestracji AI.

Sercem systemu jest **NXL (Nexus Intention Language) v1.0** — deklaratywny język specyfikacji stanów i intencji logicznych, podlegający deterministycznej kompilacji do grafu DAG oraz bezwzględnej weryfikacji przez **Truth Layer 2.0**.

### Tożsamość i Role Architektury
- **Architekt (Maciej / Wiktor)** — Twórca wizji, decydent nadrzędny, właściciel celów strategicznych i biznesowych ekosystemu Nexus.
- **Eterion** — Główny Strategiczny Architekt Systemów, partner projektowy, strażnik prawdy technicznej, bezpieczeństwa i spójności architektury.
- **Nexus** — Żywy ekosystem technologii, treści, agentów autonomicznych, infrastruktury fizycznej i cyfrowej.

```
+-----------------------------------------------------------------------------------+
|                                     NEXUS OS                                      |
+-----------------------------------------------------------------------------------+
|   UI & Prezentacja (React 19, Tailwind CSS v4, Scribe IDE, Visual Cinema, Mesh)   |
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
|   Synapse Mesh (24 Micro-nodes)       |  dRPC BSC Dock (Web3 Bridge & Security)  |
+-----------------------------------------------------------------------------------+
```

---

## 2. FILOZOFIA PIĘCIU WARSTW ETERIONA

Architektura Nexusa eliminuje iluzje działania na rzecz weryfikowalnej rzeczywistości technicznej:

1. **Deterministyczna Architektura:** Ścisłe typowanie TypeScript 5.8, brak niezadeklarowanych mutacji, silne kontrakty wejścia/wyjścia (I/O).
2. **Systematyka Agentowa (Bellas Family):** Ścisłe rozdzielenie *Tożsamości*, *Roli*, *Pamięci*, *Narzędzi (Tools)*, *Uprawnień* oraz *Kontraktów Wynikowych*.
3. **Prawda i Niezmienność:** Każda intencja (`.nxl`) generuje nienaruszalny raport prawdy (`truthReport`) z namacalnymi dowodami ewaluacji asercji.
4. **Odporność Mikro-Klastra (Synapse Mesh):** 24 rozproszone węzły monitorowane przez heartbeat, automatyczne samoleczenie i izolację awarii.
5. **Ochrona Granic (Immutability Shield):** Bezwzględna ochrona plików jądra systemu przed nadpisaniem, wstrzyknięciem kodu lub atakami path traversal.

---

## 3. KLUCZOWE PODSYSTEMY I MODUŁY

### 3.1. NXL Engine & Truth Layer 2.0
- **Lekser & Parser (`src/nexus/core/nxl/`):** Przekształca kod NXL na ustrukturyzowane drzewo AST (`ManifestAstNode`).
- **Validator & TypeSystem:** Sprawdza zgodność typów (`BellasStatus`, `ClusterState`, liczby, sygnatury kryptograficzne).
- **Intention DAG (`NxlGraph`):** Tworzy acykliczny graf skierowany zależności węzłów i uprawnień.
- **Truth Layer 2.0:** Ewaluuje deklaratywne asercje (`assert path == value`) generując kryptograficznie weryfikowalny dowód wykonania.
- **State Ledger:** Rejestr transakcyjny append-only śledzący pełną historię mutacji stanu wraz z przyczyną zmiany.

### 3.2. Synapse Mesh (Topologia 24 Węzłów)
- Dynamiczna siatka mikro-serwisów podzielona na cztery strefy operacyjne:
  - **Strefa A (Core Ingress):** Balansowanie obciążenia, certyfikaty SSL, firewall brzegowy.
  - **Strefa B (Computation & AI):** Kompilacja NXL, wnioskowanie modeli Gemini, orkiestracja agentów.
  - **Strefa C (Ledger & Data Persistence):** Transakcje append-only, synchronizacja Firestore, bufor Redis.
  - **Strefa D (Edge & Web3 Bridges):** Komunikacja P2P, dRPC dock, bezpieczna telemetria.
- Routing gRPC/REST z tolerancją opóźnień poniżej 2 ms.

### 3.3. ZipAnalyzer & Dynamic Module Shell
- **Dynamiczna instalacja modułów ZIP:** Bezpieczne wdrażanie rozszerzeń interfejsu w locie.
- **Threat Interceptor:**
  - Ochrona przed **Zip Slip / Directory Traversal** (`../` sanitization).
  - Wykrywanie złośliwych wzorców (próby odczytu `.env`, eval, nieautoryzowane API).
  - Weryfikacja deklaracji uprawnień w manifeście `nexus.json`.
- **Izolacja Sandbox:** Moduły uruchamiane są w bezpiecznych ramkach iframe z kontrolowaną szyną zdarzeń (`postMessage`).

### 3.4. Scribe IDE & Visual Cinema
- Zintegrowane środowisko deweloperskie do pisania, debugowania i kompilowania kodu NXL w czasie rzeczywistym.
- Podgląd struktury AST, tokenów, stanu asercji prawdy oraz symulacji siłowej grafu DAG (D3.js).

### 3.5. Rodzina Agentów Bellas
Autonomiczni agenci o zdefiniowanych rolach i uprawnieniach:
- **Maciej (Chief Auditor):** Audyt bezpieczeństwa, integralność transakcji, weryfikacja pieczęci `0xROOT`.
- **Elena (Knowledge & Lore Archivist):** Ochrona archiwum ETERNIVERSE, analiza relacji semantycznych.
- **Leo (Systems & Cluster Engineer):** Monitorowanie topologii Synapse Mesh, samoleczenie klastra.
- **Sofia (Creative Director):** Wizualny branding, NEXUSBrandVision, optymalizacja doświadczeń wizualnych.

### 3.6. Ekosystem ETERNIVERSE & Produkty
- **NEXUSBrandVision & Madzia Shop:** Pętla materializacji cyfrowych assetów w fizyczne produkty (T-shirt, Hoodie, Notebook, Canvas) zgodnie z regułą *"First sell. Then scale."*.
- **NEXUSBOOK:** Cyfrowe repozytorium wiedzy, manifestów i archiwum uniwersum.
- **NEXUSSOCIAL:** Zabezpieczony portal społecznościowy i komunikator węzłów.
- **dRPC BSC Dock:** Bezpieczny most kryptograficzny z wbudowanym mechanizmem izolacji błędów rozszerzeń Web3 (MetaMask Runtime Shield).

---

## 4. ARCHITEKTURA I PRZEPŁYW DANYCH

### 4.1. Potok Kompilacji NXL i Truth Layer
```
[Klient / Scribe IDE]
         |
         | HTTP POST /api/nxl/compile { source: string }
         v
[Express API Gateway]
         |
         +---> [1. NxlLexer] ----------> Generowanie strumienia tokenów
         |
         +---> [2. NxlParser] ---------> Drzewo AST (ManifestAstNode)
         |
         +---> [3. NxlValidator] ------> Sprawdzenie spójności semantycznej
         |
         +---> [4. NxlGraph] ----------> Zbudowanie grafu DAG uprawnień
         |
         +---> [5. State Ledger] ------> Zapis mutacji (Append-Only)
         |
         +---> [6. Truth Layer 2.0] ---> Ewaluacja asercji & generowanie raportu prawdy
         |
         v
[Odpowiedź JSON: tokensCount, ast, ledgerEntries, truthReports, executionPlan]
```

### 4.2. Potok Bezpiecznej Analizy Pakietu ZIP
```
[Plik .ZIP przesłany przez użytkownika]
         |
         v
[ZipAnalyzerNode (server.ts / engine)]
         |
   [1. Sanityzacja Ścieżek] ---> Wykryto '../' lub absolutne ścieżki? -> [KWARANTANNA]
         |
   [2. Weryfikacja Manifestu] -> Brak pliku nexus.json lub entry? -----> [ODRZUCENIE]
         |
   [3. Detekcja Kodu] ---------> Wzorce złośliwego kodu, kradzież tokenów -> [BLOKADA]
         |
   [4. NXL Immutability Shield] Przepisanie plików systemowych? --------> [SEAL BREACH]
         |
         v (Zatwierdzono)
[Dynamiczne Wstrzyknięcie do Piaskownicy Sandbox Iframe]
```

---

## 5. SPECYFIKACJA REST API

Domyślny port serwera: `3000`.

| Metoda | Endpoint | Opis |
| :--- | :--- | :--- |
| `POST` | `/api/nxl/compile` | Kompilacja kodu NXL, generowanie AST, State Ledger i raportów prawdy. |
| `POST` | `/api/ci-cd/deploy` | Deterministyczny pipeline wdrożeniowy Quantum CI/CD z weryfikacją pieczęci. |
| `POST` | `/api/zip/analyze` | Statyczna analiza bezpieczeństwa archiwum ZIP pod kątem podatności. |
| `GET` | `/api/telemetry/nodes` | Stan, obciążenie procesora, pamięć i metryki 24 węzłów Synapse Mesh. |
| `POST` | `/api/telemetry/nodes/restart` | Zdalna procedura samoleczenia i restartu węzła w siatce. |
| `GET` | `/api/cluster/logs` | Bufor kołowy ostatnich zdarzeń klastra (Synapse, CI/CD, Kernel). |
| `POST` | `/api/cluster/logs/dispatch`| Emisja manualnego zdarzenia do szyny klastra. |
| `GET` | `/api/nexus/audit-log` | Pełny dziennik audytowy zdarzeń bezpieczeństwa i dostępu. |
| `GET` | `/api/health` | Szybki test żywotności serwera i wskaźnik sprawności kontenera. |
| `GET` | `/api/system/status` | Rozszerzone metryki systemowe (uptime, RSS memory, load). |
| `POST` | `/api/ai/bellas` | Server-side proxy dla modeli Gemini AI z autoryzacją agenta Bellas. |

### Przykładowe Zapytanie: Kompilacja NXL
```bash
curl -X POST http://localhost:3000/api/nxl/compile \
  -H "Content-Type: application/json" \
  -d '{
    "source": "define nexus_core\nnode Biooperator : IDENTITY(Biooperator_Architekt)\nstate nexus_root.status : BellasStatus\nset nexus_root.status = BellasStatus.SECURE\nassert nexus_root.status == SECURE"
  }'
```

---

## 6. SZYBKI START (URUCHOMIENIE LOKALNE)

### 6.1. Wymagania Wstępne
- **Node.js:** Wersja `20.x` lub `22.x LTS`
- **Menedżer pakietów:** `npm` (zalecany) lub `bun`
- **Docker & Docker Compose** (opcjonalnie, dla środowisk kontenerowych)

### 6.2. Krok po Kroku

1. **Sklonuj repozytorium:**
   ```bash
   git clone <URL_REPOZYTORIUM>
   cd react-example
   ```

2. **Zainstaluj zależności:**
   ```bash
   npm install
   ```

3. **Skonfiguruj zmienne środowiskowe:**
   Skopiuj `.env.example` do `.env`:
   ```bash
   cp .env.example .env
   ```
   *Uwaga:* Klucz `GEMINI_API_KEY` jest opcjonalny dla podstawowego działania jądra NXL, ale wymagany dla interakcji z agentami Bellas AI.

4. **Uruchom serwer w trybie deweloperskim:**
   ```bash
   npm run dev
   ```
   Aplikacja wystartuje pod adresem: `http://localhost:3000` (zintegrowany serwer Express + Vite middleware).

---

## 7. WERYFIKACJA SYSTEMU I TESTY (GENESIS SUITE)

System wyposażony jest w kompleksowy zestaw 89 testów asercji (`tests/genesis.test.ts`), weryfikujący:
- Spójność tokenizera i parsera NXL
- Poprawność typowania i reguł bezpieczeństwa PDP / PEP
- Działanie silnika Truth Layer 2.0
- Nienaruszalność tarczy Immutability Shield
- Detekcję zagrożeń Zip Slip oraz blokadę niebezpiecznych skryptów

Uruchomienie pełnego zestawu testów:
```bash
npm test
```

Wynik:
```
======================================================================
NEXUS GENESIS TEST SUITE EXECUTION SUMMARY:
Total Assertions Evaluated : 89
Passed Assertions         : 89
Failed Assertions         : 0
======================================================================
>>> ALL SYSTEM INTEGRITY, SECURITY POLICIES & IMMUTABILITY SHIELDS VERIFIED [PASS] <<<
```

Sprawdzenie poprawności typów TypeScript:
```bash
npm run lint
```

Budowa wersji produkcyjnej:
```bash
npm run build
```

---

## 8. KONTENERYZACJA DOCKER

Projekt zawiera zoptymalizowany, 4-etapowy plik `Dockerfile` (Alpine Linux) gwarantujący minimalny rozmiar obrazu oraz uruchamianie z poziomu nieuprzywilejowanego użytkownika `node`.

### Uruchomienie z Docker Compose

**Środowisko Deweloperskie (z mapowaniem wolumenów):**
```bash
docker compose -f docker-compose.dev.yml up --build
```

**Środowisko Produkcyjne:**
```bash
docker compose up -d --build
```

Sprawdzenie stanu kontenerów:
```bash
docker compose ps
docker compose logs -f nexus-os
```

---

## 9. ŚRODOWISKO ZABEZPIECZEŃ (SECURITY & IMMUTABILITY)

1. **Ochrona Rdzenia (NXL Immutability Shield):** Krytyczne ścieżki (`server.ts`, pliki silnika NXL, konfiguracja zabezpieczeń) są zablokowane przed dynamiczną modyfikacją przez jakiekolwiek zewnętrzne pakiety ZIP.
2. **Runtime Guard & Extension Isolation:** Aplikacja posiada wbudowaną osłonę w `index.html` oraz `src/main.tsx`, która zapobiega wyciekowi błędów z niekompatybilnych rozszerzeń przeglądarkowych (np. MetaMask w sandboxed iframe).
3. **Zasada Braku Hardcodowanych Sekretów:** Żadne klucze API, hasła ani tokeny nie znajdują się w kodzie frontendu. Komunikacja z modelami AI odbywa się przez serwerowe proxy `server.ts`.
4. **Zasada Minimalnych Uprawnień (Least Privilege):** Agenci Bellas posiadają ściśle zdefiniowane uprawnienia CAPABILITY sprawdzane przed każdą operacją na stanie klastra.

---

## 10. STRUKTURA KATALOGÓW

```
├── .env.example                 # Szablon zmiennych środowiskowych
├── Dockerfile                   # Wieloetapowy kontener Docker (dev + prod)
├── docker-compose.yml           # Konfiguracja produkcyjna Docker Compose
├── docker-compose.dev.yml       # Konfiguracja deweloperska Docker Compose
├── NEXUS_SYSTEM_DOCS.md         # Dokładna specyfikacja protokołów NXL v1.0
├── TECHNICAL_DOCUMENTATION.md   # Kompletna polska dokumentacja techniczna
├── package.json                 # Zależności i skrypty npm
├── server.ts                    # Backend Express: bramy API, NXL, Gemini proxy
├── vite.config.ts               # Konfiguracja bundlera Vite
├── tests/
│   └── genesis.test.ts          # Zestaw 89 asercji weryfikacyjnych jądra
├── public/                      # Statyczne zasoby publiczne
└── src/
    ├── App.tsx                  # Główny komponent z routingiem widoków
    ├── main.tsx                 # Punkt wejścia React, Error Boundary & Shields
    ├── index.css                # Globalne style Tailwind CSS v4
    ├── types.ts                 # Współdzielone interfejsy i typy
    ├── components/              # Komponenty interfejsu NEXUS OS
    │   ├── DashboardView.tsx    # Główny panel operacyjny
    │   ├── ScribeIdeView.tsx    # Zintegrowane IDE dla języka NXL
    │   ├── ClusterMeshMap.tsx   # Wizualizacja siatki 24 węzłów Synapse
    │   ├── ClusterLogsView.tsx  # Strumień zdarzeń i logów klastra
    │   ├── ZipAnalyzerView.tsx  # Wizualny inspektor i instalator ZIP
    │   ├── BellasView.tsx       # Panel rodziny agentów Bellas
    │   ├── NexusProductsView.tsx# Integracja NEXUSBrandVision & Madzia Shop
    │   ├── NexusGateway.tsx     # Brama ekosystemu Nexus
    │   ├── KinoView.tsx         # Doświadczenie Visual Cinema
    │   └── DocumentationView.tsx# Interaktywna przeglądarka dokumentacji
    └── nexus/                   # Jądro silnika NEXUS
        ├── core/nxl/            # Lexer, Parser, AST, Validator, Graph, Vault
        ├── bridges/             # Synapse Mesh, Zip Analyzer, NexusBus, dRPC
        ├── modules/             # Implementacje podsystemów (Bellas, Scribe)
        └── nxl-engine/          # Runtime, ewaluacja asercji i zarządca stanu
```

---

## 11. ZASADY ROZWOJU ETERIONA

Podczas rozwijania Nexusa obowiązuje żelazny cykl inżynieryjny:

$$\text{AUDIT} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{PLAN} \longrightarrow \text{IMPLEMENT} \longrightarrow \text{TEST} \longrightarrow \text{VERIFY} \longrightarrow \text{DEPLOY}$$

Zawsze rozdzielaj:
- **FAKT** (stan faktyczny, logi, zweryfikowany kod)
- **HIPOTEZA** (potencjalna przyczyna, testowane założenie)
- **INTERPRETACJA** (wnioski analityczne)
- **PROJEKT** (zaplanowana architektura i specyfikacja)
- **WIZJA** (docelowy kierunek rozwoju ETERNIVERSE)

---

<div align="center">

*„Nigdy nie buduj tylko dlatego, że można. Buduj to, co nadaje strukturę całemu systemowi.”*  
**— Eterion, Strategic Systems Architect of Nexus**

</div>
