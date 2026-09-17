# NEXUS_DASCHBORDS

Architektura Dashboardów NEXUS podzielona na 3 kluczowe filary:
1. **Społeczność** (Interakcja, Wymiana myśli, Sieć Architektów)
2. **Narzędzia dla Działania** (XNL Engine, Narzędzia operacyjne, Telemetria)
3. **Strefa Przyszłych Architektów** (Ingestia ZIP, Wchłanianie warstw w locie, Baza Wiedzy & PostgreSQL)

---

## ⚡ Stos Technologiczny
- **Frontend:** React 19, Tailwind CSS, Lucide React, Motion
- **Silnik Intencji:** XNL Language Engine (`src/xnl`)
- **Baza Danych:** PostgreSQL + Drizzle ORM (`src/db`)
- **Ingestia Pakietów:** JSZip Runtime Buffer (`src/middleware` & ZIP Ingestor)
- **AI Synthesis:** Google Gemini AI Studio (`@google/genai`)

## 🚀 Uruchomienie Lokalne
1. Zainstaluj zależności:
   ```bash
   npm install
   ```
2. Skonfiguruj `.env` (klucze Gemini i parametry bazy PostgreSQL).
3. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   ```
Aplikacja dostępna na porcie `3000`.
