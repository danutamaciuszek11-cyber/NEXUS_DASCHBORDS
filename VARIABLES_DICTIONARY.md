# SŁOWNIK ZMIENNYCH ŚRODOWISKOWYCH I REJESTRÓW SYSTEMU NEXUS OS & NXL v1.0

> **Wersja:** 1.0.0-QUANTUM  
> **Serwer / Domena Chmury:** `https://nexussocial.pl`  
> **Architektura:** Quantum CI/CD, Synapse Mesh (24 Węzły), NXL Immutable Truth Layer  
> **Główny Architekt:** Architekt Wiktor & Eterion

---

## 1. Tabela Głównych Zmiennych Środowiskowych (`.env`)

| Zmienna | Typ | Domyślna wartość | Wymagane | Przeznaczenie i Rola Architektoniczna |
| :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | `string` | `development` / `production` | **TAK** | Tryb uruchomieniowy aplikacji (`development`, `production`). Wpływa na optymalizację Vite i tryb serwowania statycznego. |
| `PORT` | `number` | `3000` | **TAK** | Port nasłuchu serwera jądra Express / Vite w kontenerze i lokalnie. |
| `HOST` | `string` | `0.0.0.0` | **TAK** | Adres bindowania interfejsu sieciowego (dostęp lokalny i w sieci LAN/VPN). |
| `APP_URL` | `string` | `https://nexussocial.pl` | **TAK** | Oficjalny punkt wejściowy URL całego ekosystemu Nexus Cloud. |
| `GEMINI_API_KEY` | `secret` | `MY_GEMINI_API_KEY` | **TAK** (dla AI) | Klucz autoryzacji Google GenAI (`@google/genai`) dla agenta Eteriona i syntezy kodu NXL. |
| `SQL_HOST` | `string` | `nexussocial.pl` | **TAK** (dla bazy) | Host serwera bazy danych PostgreSQL 16.6 w chmurze Cloud SQL. |
| `SQL_DB_NAME` | `string` | `nexus_db` | **TAK** | Nazwa głównej relacyjnej bazy danych ekosystemu Nexus. |
| `SQL_USER` | `string` | `nexus_admin` | **TAK** | Użytkownik bazy danych z uprawnieniami do tabel modułów i telemetrii. |
| `SQL_PASSWORD` | `secret` | *(sekret)* | **TAK** | Hasło autoryzacyjne bazy danych PostgreSQL. |
| `SQL_ADMIN_USER` | `string` | `postgres` | Opcjonalne | Użytkownik administracyjny (root/dba) do migracji i zakładania ról. |
| `SQL_ADMIN_PASSWORD` | `secret` | *(sekret)* | Opcjonalne | Hasło użytkownika administracyjnego do migracji DDL. |
| `REDIS_URL` | `string` | `redis://localhost:6379` | **TAK** (dla Mesh) | Szyna zdarzeń Synapse Mesh i rozproszony stan klastra w pamięci Redis. |
| `SYNAPSE_MESH_INSTANCES` | `number` | `24` | **TAK** | Liczba instancji i mikro-węzłów w topologii Synapse Mesh. |
| `NXL_ENFORCE_IMMUTABILITY` | `boolean` | `true` | **TAK** | Wymusza osłonę **Immutable Shield** — blokuje modyfikacje rdzenia przez pakiety zewnętrzne. |
| `NXL_IMMUTABILITY_KEY` | `secret` | `0xROOT_MARCO_...` | **TAK** | Klucz kryptograficzny weryfikujący integralność manifestów NXL Genesis. |
| `BSC_RPC_URL` | `string` | `https://bsc-dataseed.binance.org/` | Opcjonalne | Połączenie RPC z siecią Binance Smart Chain poprzez most dRPC Dock. |
| `VITE_NEXUS_API_GATEWAY` | `string` | `https://nexussocial.pl/api/nexus/telemetry` | **TAK** | Adres bramy API dla klienta w przeglądarce (synchronizacja 16 węzłów). |
| `VITE_FIREBASE_API_KEY` | `secret` | *(klucz web)* | Opcjonalne | Klucz API klienta Firebase do autentykacji użytkowników. |
| `VITE_FIREBASE_PROJECT_ID` | `string` | `gen-lang-client-0697604390` | Opcjonalne | Identyfikator projektu Firebase. |

---

## 2. Zmienne i Stałe Języka NXL (Truth Layer & State Ledger)

Zdefiniowane w manifeście Genesis NXL (`src/nxl/genesis.nxl` oraz `src/nexus/nxl/genesis.nxl`):

| Zmienna Stanu (NXL State) | Typ NXL | Wartość początkowa | Rola w Systemie |
| :--- | :--- | :--- | :--- |
| `nexus_root.status` | `BellasStatus` | `SECURE` | Globalny status bezpieczeństwa rdzenia suwerennego państwa Bellas. |
| `synapse_mesh.nodes` | `Number` | `24` | Zweryfikowana liczba aktywnych mikro-węzłów w siatce Synapse Mesh. |
| `quantum_cicd.status` | `ClusterState` | `STABLE` | Stan zautomatyzowanego potoku Quantum CI/CD. |

### Capabilities i Prawa Dostępu (NXL Grants)
- `capability ai.synthesize` – Przyznana: `Marco_Architekt`
- `capability nexus.core.seal` – Przyznana: `Marco_Architekt`
- `capability synapse.mesh.deploy` – Przyznana: `Elena_LightEngine`

---

## 3. Zmienne Klastrowe i Kontenerowe (Docker & Kubernetes)

### W `docker-compose.yml` (Produkcja):
- `services.nexus-os.environment`:
  - `NODE_ENV=production`
  - `PORT=3000`
  - `HOST=0.0.0.0`
  - `REDIS_URL=redis://nexus-redis:6379`
- `services.nexus-os.deploy.resources`:
  - `limits.cpus: '2.00'`, `limits.memory: 2048M`
  - `reservations.cpus: '0.25'`, `reservations.memory: 512M`

### W `deploy-config.yaml` (Kubernetes Manifest):
- `spec.replicas`: `24`
- `spec.strategy`: `RollingUpdate` (`maxSurge: 4`, `maxUnavailable: 0`)
- `spec.template.spec.containers[0].resources`:
  - `requests`: `cpu: 100m`, `memory: 128Mi`
  - `limits`: `cpu: 500m`, `memory: 512Mi`
- `securityContext`:
  - `runAsNonRoot: true`
  - `runAsUser: 10001`
  - `capabilities.drop: ["ALL"]`

---

## 4. Punkty Końcowe API Bramy (`server.ts`)

- `GET /api/health` – Status weryfikacji zdrowia środowiska NXL i Node.js
- `GET /api/cluster/telemetry` – Pobieranie metryk opóźnień, przepustowości i węzłów
- `GET /api/cluster/logs` – Strumień dziennika zdarzeń klastra w pamięci pierścieniowej
- `POST /api/cluster/logs/dispatch` – Wstrzykiwanie zadań testowych do szyny zdarzeń
- `POST /api/nxl/compile` – Kompilator i weryfikator asercji języka NXL v1.0
- `POST /api/zip/analyze` – Silnik inspekcji archiwów ZIP z blokadą naruszeń integralności
- `POST /api/zip/mass-analysis` – Równoległy audyt 24 węzłów Synapse i 16 potoków CI/CD
- `POST /api/architect/generate` – Generacja architektury przez sztuczną inteligencję (Gemini)
- `GET /api/documentation` – Udostępnienie pełnego manifestu dokumentacji technicznej
