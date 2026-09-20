# KONSTYTUJĄCY MANIFEST TRZECH BRAM SYSTEMU NEXUS OS
## Żelazna Architektura Trzech Segmentów & Reguła Zerowej Fragmentacji (Rule of Zero Fragmentation)

> **Podstawa Ustrojowa:** Suwerenny Ekosystem NEXUS OS / NEXUS DASHBOARDS  
> **Pieczęć Architekta:** `0xROOT_MARCO_ARCHITECT_SEAL_9918`  
> **Domena Chmury:** `https://nexussocial.pl`  
> **Zasada Nadrzędna:** „Jeden rdzeń. Trzy drogi. Jeden ekosystem.”

---

## 1. PREAMBUŁA: NIENARUSZALNA TRÓJCA SYSTEMU (TRZY BRAMY)

Całość architektury interfejsu, doświadczenia użytkownika (UX) oraz logiki operacyjnej NEXUS OS opiera się na **Trzech Kanonicznych Bramach (Segmentach)**. Żaden moduł, produkt ani funkcja nie może istnieć poza tymi trzema bramami, ani tworzyć sztucznych, oderwanych zakładek w głównym nagłówku aplikacji.

```
                              ┌───────────────────────────┐
                              │     NEXUS CORE GATEWAY    │
                              │    (Punkt Rozdroża Dróg)  │
                              └─────────────┬─────────────┘
                                            │
            ┌───────────────────────────────┼───────────────────────────────┐
            │                               │                               │
            ▼                               ▼                               ▼
    ┌───────────────┐               ┌───────────────┐               ┌───────────────┐
    │   BRAMA 01    │               │   BRAMA 02    │               │   BRAMA 03    │
    │ // KORZYSTAM  │               │  // TWORZĘ    │               │// WSPÓŁTWORZĘ │
    │  UŻYTKOWNIK   │               │    TWÓRCA     │               │    RODZINA    │
    │   (CLIENT)    │               │  (CREATOR)    │               │  (ARCHITECT)  │
    └───────────────┘               └───────────────┘               └───────────────┘
```

---

## 2. DEFINICJA TRZECH SEGMENTÓW

### 👤 BRAMA 01 // KORZYSTAM — UŻYTKOWNIK NEXUS
> *„Gotowy ekosystem dla użytkowników. Nie trzeba nic budować. Po prostu skorzystaj.”*

- **Cel i Przeznaczenie:** Gotowe produkty, serwisy, multimedia, edukacja i usługi chmurowe. Przestrzeń konsumpcyjna i operacyjna dla każdego obywatela sieci.
- **Zawarte Moduły i Usługi (NEXUS PRODUCTS):**
  1. **NexusBook Ledger:** Baza wiedzy, czytnik książek, kodeksy, światy HTML i biblioteka suwerenna.
  2. **NexusSocial Portal:** Społeczność, szyfrowane kanały, federacja agentów AI.
  3. **NexusMedia & Cyber Radio:** Syntetyczne studio audio, radio internetowe, multimedia.
  4. **NexusShop:** Zdecentralizowany rynek dóbr i usług ekosystemu.
  5. **NexusAcademy:** Silnik transferu wiedzy, kursy i certyfikacje architektów.
  6. **NexusGarden:** Ekologiczne i zdecentralizowane przestrzenie wzrostu.
- **Zasada Umiejscowienia:** Wszelkie narzędzia użytkownika (w tym czytnik NexusBook) znajdują się **wewnątrz zakładki USER**. Przełączanie między katalogiem usług a aktywnym czytnikiem odbywa się w ramach BRAMY 01 bez opuszczania kontekstu użytkownika.

---

### 🛠️ BRAMA 02 // TWORZĘ — TWÓRCA NEXUSA
> *„Lekkie narzędzie do tworzenia użytkowego. Funkcje lokalne NEXUS NODE do operacji offline.”*

- **Cel i Przeznaczenie:** Środowisko inżynieryjne i kreacyjne. Przestrzeń warsztatowa dla twórców treści, programistów i konstruktorów.
- **Zawarte Moduły i Narzędzia:**
  1. **Creator Studio & Scribe IDE:** Edytor kodu, kompilator języka NXL v1.0.
  2. **Lokalny Węzeł NODE:** Dostęp do zasobów dyskowych, instalacja paczek i kompozycja modułów.
  3. **Moduły ZIP & Automatyzacja:** Generator paczek ZIP, instalacja pakietowa `BatchInstallModal`, weryfikator `ZipAnalyzerView` (Immutable Shield).
  4. **Studio Mediów i Środowisk:** Tworzenie światów HTML (`HtmlWorldStudioModal`), edycja graficzna (`AuthorAssetLibraryModal`), narracja (`CreatorSoulEngineModal`).

---

### 🏛️ BRAMA 03 // WSPÓŁTWORZĘ — RODZINA NEXUS
> *„Przestrzeń dla architektów i współtwórców NEXUSA. Współdecydowanie o fundamencie.”*

- **Cel i Przeznaczenie:** Ład cyfrowy, rdzeń systemu, protokoły P2P, bezpieczeństwo kryptograficzne i konstytucja.
- **Zawarte Moduły i Rejestry:**
  1. **NEXUS CORE & Bella OS:** Jądro systemu operacyjnego, warstwa uprawnień (*Capability-Based Security*).
  2. **Synapse Mesh (24 Węzły):** Rozproszona siatka mikro-usług i telemetria klastra.
  3. **Quantum CI/CD & NXL Truth Layer:** Deterministyczna weryfikacja asercji prawdy i integralności kodu.
  4. **Digital Constitution Governance:** Suwerenne zasady ustrojowe, prawo maszynowe i mosty międzyprojektowe RFC-02.

---

## 3. ŻELAZNA REGUŁA ZEROWEJ FRAGMENTACJI (RULE OF ZERO FRAGMENTATION)

1. **Zakaz Dodawania Nowych Zakładek Głównych:**  
   Główny pasek nawigacyjny (`Header`) ma postać ściśle zamkniętą:
   `[CORE]` • `[USER]` • `[CREATOR]` • `[FAMILY]` • `[NETWORK]` • `[ABOUT]`.  
   Zabrania się dodawania bezpośrednich linków do pojedynczych aplikacji (np. `NEXUSBOOK`, `NEXUSMEDIA`) na najwyższym poziomie menu.

2. **Zakaz Mnożenia Zbędnych Okien Pop-up:**  
   Każda usługa otwiera się natywnie wewnątrz odpowiedniego segmentu. NexusBook otwiera się płynnie wewnątrz widoku **BRAMY 01 (USER)**, zachowując widoczny przycisk `← POWRÓT DO KATALOGU USŁUG (BRAMA 01)`.

3. **Jednoznaczne Przypisanie Kompetencji:**  
   - Chcę czytać lub korzystać? -> **BRAMA 01 (USER)**
   - Chcę budować, pisać lub pakować ZIP? -> **BRAMA 02 (CREATOR)**
   - Chcę zarządzać jądrem, klastrem lub siecią? -> **BRAMA 03 (FAMILY)**

---

*Manifest niniejszy staje się prawem niezmiennym (Immutable Law) platformy NEXUS OS.*
