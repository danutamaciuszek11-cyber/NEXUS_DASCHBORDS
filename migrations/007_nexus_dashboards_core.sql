-- ============================================================================
-- MIGRATION: 007_nexus_dashboards_core.sql
-- PROJECT: NEXUS SOCIAL (nexussocial.pl) / ETERNIVERSE OS
-- PURPOSE: Dedykowana struktura SQL dla NEXUS DASHBOARD & 16 WĘZŁÓW P2P & ŚCIEŻEK
-- ENGINE: PostgreSQL 16.6 (nexus)
-- AUTHOR: Eterion Engine // Maciej Maciuszek (Architekt)
-- INTEGRITY: Bezpieczna migracja (CREATE TABLE IF NOT EXISTS / ALTER ADD COLUMN)
-- ============================================================================

-- 1. TABELA WĘZŁÓW SIATKI P2P (NEXUS DECENTRALIZED MESH NODES - 16 NODES)
CREATE TABLE IF NOT EXISTS nexus_nodes (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(128) NOT NULL,
    latency VARCHAR(32) DEFAULT '12ms',
    status VARCHAR(32) DEFAULT 'ACTIVE',
    system_load VARCHAR(32) DEFAULT '15%',
    protocol VARCHAR(64) DEFAULT 'gRPC / TLS 1.3 / P2P',
    repo_url TEXT,
    dependencies JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure columns exist if table was already created
ALTER TABLE nexus_nodes ADD COLUMN IF NOT EXISTS repo_url TEXT;
ALTER TABLE nexus_nodes ADD COLUMN IF NOT EXISTS dependencies JSONB DEFAULT '[]'::jsonb;

-- 2. TABELA 3 ŚCIEŻEK SYSTEMU (NEXUS PILLARS / ZONES)
CREATE TABLE IF NOT EXISTS nexus_zones (
    zone_id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    path_tag VARCHAR(64) NOT NULL,
    description TEXT,
    isolation_level VARCHAR(32) DEFAULT 'STRICT',
    storage_type VARCHAR(64) NOT NULL, -- 'CLOUD_SQL' lub 'LOCAL_INDEXEDDB'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA MODUŁÓW CHMUROWYCH (NEXUS CLOUD MODULES // FILAR 2)
CREATE TABLE IF NOT EXISTS nexus_cloud_modules (
    module_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(32) NOT NULL,
    description TEXT,
    entry VARCHAR(128) DEFAULT 'index.html',
    accent VARCHAR(32) DEFAULT '#00E5FF',
    node VARCHAR(32) DEFAULT 'NODE #01',
    category VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'OPERATIONAL',
    package_type VARCHAR(32) DEFAULT 'system',
    capabilities JSONB DEFAULT '["storage", "ai", "events", "bellas-core"]'::jsonb,
    repo_url TEXT,
    dependencies JSONB DEFAULT '[]'::jsonb,
    is_cloud_synced BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure columns exist if table was already created
ALTER TABLE nexus_cloud_modules ADD COLUMN IF NOT EXISTS repo_url TEXT;
ALTER TABLE nexus_cloud_modules ADD COLUMN IF NOT EXISTS dependencies JSONB DEFAULT '[]'::jsonb;

-- 4. REJESTR ZWERYFIKOWANYCH PAKIETÓW ZIP (NEXUS ZIP PACKAGES)
CREATE TABLE IF NOT EXISTS nexus_zip_packages (
    package_id VARCHAR(64) PRIMARY KEY,
    module_id VARCHAR(64) NOT NULL,
    version VARCHAR(32) NOT NULL,
    package_size_bytes BIGINT,
    checksum_sha256 VARCHAR(64),
    manifest_json JSONB NOT NULL,
    uploaded_by VARCHAR(128) DEFAULT 'Architect',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA AUDYTU I TELEMETRII CZASU RZECZYWISTEGO (SYSTEM TELEMETRY)
CREATE TABLE IF NOT EXISTS nexus_dashboards_telemetry (
    id BIGSERIAL PRIMARY KEY,
    node VARCHAR(32) NOT NULL,
    source_zone VARCHAR(64) NOT NULL,
    event_type VARCHAR(128) NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    level VARCHAR(16) DEFAULT 'info',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. INDEKSY DLA OPTYMALIZACJI ZAPYTAŃ
CREATE INDEX IF NOT EXISTS idx_nexus_nodes_status ON nexus_nodes(status);
CREATE INDEX IF NOT EXISTS idx_nexus_cloud_modules_category ON nexus_cloud_modules(category);
CREATE INDEX IF NOT EXISTS idx_nexus_telemetry_node ON nexus_dashboards_telemetry(node);
CREATE INDEX IF NOT EXISTS idx_nexus_telemetry_created ON nexus_dashboards_telemetry(created_at DESC);

-- 7. INICJALIZACJA 16 WĘZŁÓW SIATKI P2P Z PRZYPISANYMI REPOZYTORIAMI I ZALEŻNOŚCIAMI
INSERT INTO nexus_nodes (id, name, region, latency, status, system_load, protocol, repo_url, dependencies)
VALUES
    ('NODE #01', 'NEXUS BELLA OS (ROOT KERNEL)', 'eu-central (Warsaw)', '4ms', 'ACTIVE', '18%', 'BELLA-NEURAL-BUS v4.2', 'https://github.com/danutamaciuszek11-cyber/NEXUS_DASCHBORDS.git', '[]'::jsonb),
    ('NODE #02', 'NEXUS FAMILY COLLECTIVE', 'eu-west (Frankfurt)', '12ms', 'ACTIVE', '14%', 'SOVEREIGN-P2P', 'https://github.com/danutamaciuszek11-cyber/NEXUS_FAMILI.git', '["nexus-bella-os"]'::jsonb),
    ('NODE #03', 'NEXUS MEDIA & CYBER RADIO', 'us-east (Virginia)', '38ms', 'ACTIVE', '42%', 'SENSORY-PIPELINE', 'https://github.com/danutamaciuszek11-cyber/-NEXUS-MEDIA-Studio-D-wi-ku-Syntetycznego-Transmisji-Cyber-Radiostacji.git', '["nexus-bella-os"]'::jsonb),
    ('NODE #04', 'NEXUSBOOK LEDGER', 'eu-central (Warsaw)', '3ms', 'ACTIVE', '9%', 'NXL-IMMUTABLE-LEDGER', 'https://github.com/danutamaciuszek11-cyber/NEXUS-ACADEMY-Knowledge-Transfer-Engine.git', '["nexus-bella-os"]'::jsonb),
    ('NODE #05', 'NEXUS DEV HUB (KUŹNIA 9 ŚWIATÓW)', 'us-west (Oregon)', '54ms', 'ACTIVE', '27%', 'WASM-SANDBOX-P2P', 'https://github.com/danutamaciuszek11-cyber/NEXUS-DEV-HUB-Ekosystem-9-wiat-w-Ku-nia-Forge-.git', '["nexus-bella-os", "nexus-rfc-02-gateway"]'::jsonb),
    ('NODE #06', 'NEXUS WORLDS SIMULATION', 'ap-northeast (Tokyo)', '82ms', 'ACTIVE', '31%', 'SIM-TOPOLOGY', 'https://github.com/danutamaciuszek11-cyber/NEXUS_DASCHBORDS.git', '["nexus-bella-os", "nexus-dev-hub"]'::jsonb),
    ('NODE #07', 'KAISA ONLINE ORCHESTRATOR', 'eu-central (Warsaw)', '5ms', 'ACTIVE', '22%', 'ETERNIVERSE-DEV-CORE', 'https://github.com/danutamaciuszek11-cyber/NEXUS-REVOLUTION.git', '["nexus-bella-os", "nexus-rfc-02-gateway"]'::jsonb),
    ('NODE #08', 'NEXUS DIGITAL CONSTITUTION', 'eu-north (Stockholm)', '19ms', 'ACTIVE', '11%', 'TLS-1.3-ZERO-TRUST', 'https://github.com/danutamaciuszek11-cyber/-NEXUS-SOVEREIGN-DIGITAL-CONSTITUTION-GOVERNANCE-ECOSYSTEM.git', '["nexus-bella-os", "nexusbook"]'::jsonb),
    ('NODE #09', 'NEURAL LINK MIDDLEWARE v1.2', 'eu-south (Milan)', '16ms', 'ACTIVE', '28%', 'NEURAL-LINK-BUS', 'https://github.com/danutamaciuszek11-cyber/-NEURAL-LINK-MIDDLEWARE-v1.2.git', '["nexus-bella-os", "kaisa-online"]'::jsonb),
    ('NODE #10', 'NEXUS CRYPTO VAULT', 'sa-east (Sao Paulo)', '98ms', 'ACTIVE', '8%', 'CRYPTO-SOVEREIGN-VAULT', 'https://github.com/danutamaciuszek11-cyber/Nexus_vault.git', '["nexus-bella-os", "nexus-rfc-02-gateway"]'::jsonb),
    ('NODE #11', 'NEXUS REVOLUTION KERNEL', 'us-central (Iowa)', '45ms', 'ACTIVE', '49%', 'GEMINI-API-BRIDGE', 'https://github.com/danutamaciuszek11-cyber/NEXUS-REVOLUTION.git', '["nexus-bella-os", "nexus-rfc-02-gateway"]'::jsonb),
    ('NODE #12', 'NEXUS LABS SOVEREIGN R&D', 'ap-southeast (Singapore)', '79ms', 'ACTIVE', '16%', 'P2P-RELAY-FABRIC', 'https://github.com/danutamaciuszek11-cyber/NEXUS-LABS-Sovereign-R-D-Engine-Collaborative-Organism.git', '["nexus-dev-hub", "kaisa-online", "nexus-constitution-governance"]'::jsonb),
    ('NODE #13', 'NEXUS AI INFERENCE (FLASK & SDK)', 'eu-west (London)', '21ms', 'ACTIVE', '35%', 'FLASK-AI-SDK-BRIDGE', 'https://github.com/danutamaciuszek11-cyber/ai-sdk-with-flask.git', '["nexus-bella-os", "neural-link-middleware"]'::jsonb),
    ('NODE #14', 'NEXUS RFC-02 PROTOCOL GATEWAY', 'eu-central (Frankfurt)', '14ms', 'ACTIVE', '12%', 'RFC-02-GATEWAY-MESH', 'https://github.com/danutamaciuszek11-cyber/NEXUS-RFC-02-Inter-Project-Synchronization-Protocol-Gateway.git', '["nexus-bella-os", "nexus-family", "kaisa-online"]'::jsonb),
    ('NODE #15', 'NEXUS DOCKER VANILLA RUNNER', 'us-west (Oregon)', '58ms', 'ACTIVE', '24%', 'DOCKER-ISOLATED-SANDBOX', 'https://github.com/danutamaciuszek11-cyber/Nexus-Execution-Node-Pure-Vanilla-JS-Docker-.git', '["nexus-bella-os", "nexus-dev-hub"]'::jsonb),
    ('NODE #16', 'RODZINA BELLAS SOVEREIGN MESH', 'eu-central (Warsaw)', '5ms', 'ACTIVE', '10%', 'SOVEREIGN-FAMILY-MESH', 'https://github.com/danutamaciuszek11-cyber/RodzinaBellas-.git', '["nexus-bella-os", "nexus-family"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    region = EXCLUDED.region,
    latency = EXCLUDED.latency,
    status = EXCLUDED.status,
    system_load = EXCLUDED.system_load,
    protocol = EXCLUDED.protocol,
    repo_url = EXCLUDED.repo_url,
    dependencies = EXCLUDED.dependencies,
    updated_at = NOW();

-- 8. INICJALIZACJA 3 GŁÓWNYCH ŚCIEŻEK (3 PILLARS)
INSERT INTO nexus_zones (zone_id, name, path_tag, description, isolation_level, storage_type)
VALUES
    ('community', 'SPOŁECZNOŚĆ & RODZINA', 'FAMILY', 'Decentralizowana sieć społecznościowa, zaufane węzły, tożsamość kolektywu rodziny Bellas.', 'STANDARD', 'CLOUD_SQL'),
    ('tools', 'NARZĘDZIA DLA DZIAŁANIA', 'USER', 'Gotowe produkty i usługi ekosystemu NEXUS CLOUD (NexusBook, Media Forge, KAISA Online, Nexus Vault, AI SDK).', 'STANDARD', 'CLOUD_SQL'),
    ('architects', 'STREFA PRZYSZŁYCH ARCHITEKTÓW', 'CREATOR', 'Prywatna strefa robocza twórcy, wchłanianie paczek ZIP w locie, izolowany sandbox IndexedDB bez wycieku do chmury.', 'STRICT', 'LOCAL_INDEXEDDB')
ON CONFLICT (zone_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    storage_type = EXCLUDED.storage_type;

-- 9. INICJALIZACJA 16 MODUŁÓW SYSTEMOWYCH W BAZIE CHMURY
INSERT INTO nexus_cloud_modules (module_id, name, version, description, entry, accent, node, category, status, repo_url, dependencies)
VALUES
    ('nexus-bella-os', 'NEXUS BELLA OS', '4.2.0', 'Core sentient neural operating kernel and autonomous agent framework.', 'index.html', '#00E5FF', 'NODE #01', 'SYSTEM', 'OPERATIONAL', 'https://github.com/danutamaciuszek11-cyber/NEXUS_DASCHBORDS.git', '[]'::jsonb),
    ('nexus-family', 'NEXUS FAMILY COLLECTIVE', '2.8.4', 'Multi-identity sovereign collective network, guardian permissions, and sync nodes.', 'index.html', '#A855F7', 'NODE #02', 'COMMUNICATION', 'OPERATIONAL', 'https://github.com/danutamaciuszek11-cyber/NEXUS_FAMILI.git', '["nexus-bella-os"]'::jsonb),
    ('nexus-media-forge', 'NEXUS MEDIA & CYBER RADIO', '3.1.0', 'Studio dźwięku syntetycznego, studio transmisji live, cyber-radiostacja i generacja multimediów.', 'index.html', '#EC4899', 'NODE #03', 'CREATIVE', 'OPERATIONAL', 'https://github.com/danutamaciuszek11-cyber/-NEXUS-MEDIA-Studio-D-wi-ku-Syntetycznego-Transmisji-Cyber-Radiostacji.git', '["nexus-bella-os"]'::jsonb),
    ('nexusbook', 'NEXUSBOOK LEDGER', '1.9.2', 'Immutable neural knowledge ledger, document indexing, and sovereign archive.', 'index.html', '#00D9A6', 'NODE #04', 'KNOWLEDGE', 'READY', 'https://github.com/danutamaciuszek11-cyber/NEXUS-ACADEMY-Knowledge-Transfer-Engine.git', '["nexus-bella-os"]'::jsonb),
    ('nexus-dev-hub', 'NEXUS DEV HUB (KUŹNIA 9 ŚWIATÓW)', '5.0.1', 'Kuźnia Forge 9 Światów – środowisko inżynieryjne kompilacji, kompozytor graficzny XNL, piaskownice WASM.', 'index.html', '#3B82F6', 'NODE #05', 'DEVELOPER', 'RUNNING', 'https://github.com/danutamaciuszek11-cyber/NEXUS-DEV-HUB-Ekosystem-9-wiat-w-Ku-nia-Forge-.git', '["nexus-bella-os", "nexus-rfc-02-gateway"]'::jsonb),
    ('nexus-worlds', 'NEXUS WORLDS SIMULATION', '1.4.0', 'Decentralized spatial environments, simulation topology, and virtual worlds cluster.', 'index.html', '#8B5CF6', 'NODE #06', 'SIMULATION', 'OPERATIONAL', 'https://github.com/danutamaciuszek11-cyber/NEXUS_DASCHBORDS.git', '["nexus-bella-os", "nexus-dev-hub"]'::jsonb),
    ('kaisa-online', 'KAISA ONLINE ORCHESTRATOR', '2.1.0', 'KAISA Protocol ETERNIVERSE-DEV-CORE - Autonomous microservice lifecycle orchestrator & pipeline engine.', 'index.html', '#F59E0B', 'NODE #07', 'ORCHESTRATION', 'OPERATIONAL', 'https://github.com/danutamaciuszek11-cyber/NEXUS-REVOLUTION.git', '["nexus-bella-os", "nexus-rfc-02-gateway"]'::jsonb),
    ('nexus-constitution-governance', 'NEXUS DIGITAL CONSTITUTION', '1.0.0', 'Suwerenna cyfrowa konstytucja, ekosystem ładu cyfrowego, prawo maszynowe i etyka agentów AI w sieci Nexus.', 'index.html', '#10B981', 'NODE #08', 'GOVERNANCE & LAW', 'OPERATIONAL', 'https://github.com/danutamaciuszek11-cyber/-NEXUS-SOVEREIGN-DIGITAL-CONSTITUTION-GOVERNANCE-ECOSYSTEM.git', '["nexus-bella-os", "nexusbook"]'::jsonb),
    ('neural-link-middleware', 'NEURAL LINK MIDDLEWARE v1.2', '1.2.0', 'Magistrala pośrednicząca Neural Link v1.2 – ultraszybka wymiana stanów między agentami AI, bufor synaptyczny i łącznik modeli.', 'index.html', '#06B6D4', 'NODE #09', 'INTEGRATION & API', 'OPERATIONAL', 'https://github.com/danutamaciuszek11-cyber/-NEURAL-LINK-MIDDLEWARE-v1.2.git', '["nexus-bella-os", "kaisa-online"]'::jsonb),
    ('nexus-vault', 'NEXUS CRYPTO VAULT', '2.0.0', 'Suwerenny skarbiec kryptograficzny, zarządzanie kluczami prywatnymi, szyfrowanie zerowej wiedzy (ZK) i sejf kontraktów.', 'index.html', '#EAB308', 'NODE #10', 'SECURITY & VAULT', 'OPERATIONAL', 'https://github.com/danutamaciuszek11-cyber/Nexus_vault.git', '["nexus-bella-os", "nexus-rfc-02-gateway"]'::jsonb),
    ('nexus-revolution', 'NEXUS REVOLUTION KERNEL', '3.0.0', 'Główny motor rewolucji suwerennościowej, rozproszony backend API, most neuronowy Gemini i łącznik Postgres Cloud SQL.', 'index.html', '#EF4444', 'NODE #11', 'DECENTRALIZATION & KERNEL', 'OPERATIONAL', 'https://github.com/danutamaciuszek11-cyber/NEXUS-REVOLUTION.git', '["nexus-bella-os", "nexus-rfc-02-gateway"]'::jsonb),
    ('nexus-labs-rd', 'NEXUS LABS (SOVEREIGN R&D)', '1.5.0', 'Kolaboratywny organizm badawczo-rozwojowy (R&D), inkubator nowych technologii, eksperymenty kwantowe i AI.', 'index.html', '#F97316', 'NODE #12', 'EXPERIMENT & LABS', 'OPERATIONAL', 'https://github.com/danutamaciuszek11-cyber/NEXUS-LABS-Sovereign-R-D-Engine-Collaborative-Organism.git', '["nexus-dev-hub", "kaisa-online", "nexus-constitution-governance"]'::jsonb),
    ('nexus-ai-sdk-flask', 'NEXUS AI INFERENCE (FLASK & SDK)', '1.1.0', 'Zewnętrzny silnik inferencji AI oparty o Flask i AI-SDK, bramka konektorów do modeli LLM oraz wektoryzacja promptów.', 'index.html', '#8B5CF6', 'NODE #13', 'AI & NEURAL', 'OPERATIONAL', 'https://github.com/danutamaciuszek11-cyber/ai-sdk-with-flask.git', '["nexus-bella-os", "neural-link-middleware"]'::jsonb),
    ('nexus-rfc-02-gateway', 'NEXUS RFC-02 PROTOCOL GATEWAY', '1.2.0', 'Standard protokołu synchronizacji międzyprojektowej RFC-02, rozproszona magistrala danych i brama komunikacji P2P.', 'index.html', '#06B6D4', 'NODE #14', 'NETWORKING & PROTOCOLS', 'OPERATIONAL', 'https://github.com/danutamaciuszek11-cyber/NEXUS-RFC-02-Inter-Project-Synchronization-Protocol-Gateway.git', '["nexus-bella-os", "nexus-family", "kaisa-online"]'::jsonb),
    ('nexus-docker-node', 'NEXUS DOCKER VANILLA RUNNER', '1.0.0', 'Czysty kontener wykonawczy Docker w Vanilla JS – lekki runner izolowany do uruchamiania mikro-usług w kontenerach.', 'index.html', '#0284C7', 'NODE #15', 'DEVELOPER TOOLS', 'OPERATIONAL', 'https://github.com/danutamaciuszek11-cyber/Nexus-Execution-Node-Pure-Vanilla-JS-Docker-.git', '["nexus-bella-os", "nexus-dev-hub"]'::jsonb),
    ('rodzina-bellas', 'RODZINA BELLAS SOVEREIGN MESH', '3.2.0', 'Centralne repozytorium kolektywu Rodzina Bellas – tożsamości cyfrowe, archiwa rodowe, więzi suwerenne i kroniki.', 'index.html', '#D946EF', 'NODE #16', 'COMMUNITY & NETWORK', 'OPERATIONAL', 'https://github.com/danutamaciuszek11-cyber/RodzinaBellas-.git', '["nexus-bella-os", "nexus-family"]'::jsonb)
ON CONFLICT (module_id) DO UPDATE SET
    name = EXCLUDED.name,
    version = EXCLUDED.version,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    node = EXCLUDED.node,
    category = EXCLUDED.category,
    repo_url = EXCLUDED.repo_url,
    dependencies = EXCLUDED.dependencies,
    updated_at = NOW();
