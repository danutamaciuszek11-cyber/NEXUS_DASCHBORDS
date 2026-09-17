-- ============================================================================
-- MIGRATION: 007_nexus_dashboards_core.sql
-- PROJECT: NEXUS SOCIAL (nexussocial.pl) / ETERNIVERSE OS
-- PURPOSE: Dedykowana struktura SQL dla NEXUS DASHBOARD & 3 ŚCIEŻEK SUWERENNOŚCI
-- ENGINE: PostgreSQL 16.6 (nexus)
-- AUTHOR: Eterion Engine // Maciej Maciuszek (Architekt)
-- INTEGRITY: Bezpieczna migracja (CREATE TABLE IF NOT EXISTS) - ZERO ryzyka dla bazy nexus
-- ============================================================================

-- 1. TABELA WĘZŁÓW SIATKI P2P (NEXUS DECENTRALIZED MESH NODES)
CREATE TABLE IF NOT EXISTS nexus_nodes (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(128) NOT NULL,
    latency VARCHAR(32) DEFAULT '12ms',
    status VARCHAR(32) DEFAULT 'ACTIVE',
    system_load VARCHAR(32) DEFAULT '15%',
    protocol VARCHAR(64) DEFAULT 'gRPC / TLS 1.3 / P2P',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
    is_cloud_synced BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- 7. INICJALIZACJA 12 WĘZŁÓW SIATKI P2P
INSERT INTO nexus_nodes (id, name, region, latency, status, system_load, protocol)
VALUES
    ('NODE #01', 'NEXUS BELLA CORE', 'eu-central (Warsaw)', '4ms', 'ACTIVE', '18%', 'BELLA-NEURAL-BUS v4.2'),
    ('NODE #02', 'FAMILY COLLECTIVE', 'eu-west (Frankfurt)', '12ms', 'ACTIVE', '14%', 'SOVEREIGN-P2P'),
    ('NODE #03', 'MEDIA SYNTH MATRIX', 'us-east (Virginia)', '38ms', 'ACTIVE', '42%', 'SENSORY-PIPELINE'),
    ('NODE #04', 'NEXUSBOOK LEDGER', 'eu-central (Warsaw)', '3ms', 'ACTIVE', '9%', 'NXL-IMMUTABLE-LEDGER'),
    ('NODE #05', 'DEV HUB WASM BOX', 'us-west (Oregon)', '54ms', 'ACTIVE', '27%', 'WASM-SANDBOX-P2P'),
    ('NODE #06', 'WORLDS SIMULATION', 'ap-northeast (Tokyo)', '82ms', 'ACTIVE', '31%', 'SIM-TOPOLOGY'),
    ('NODE #07', 'KAISA ORCHESTRATOR', 'eu-central (Warsaw)', '5ms', 'ACTIVE', '22%', 'ETERNIVERSE-DEV-CORE'),
    ('NODE #08', 'P2P ZERO-TRUST EDGE', 'eu-north (Stockholm)', '19ms', 'ACTIVE', '11%', 'TLS-1.3-ZERO-TRUST'),
    ('NODE #09', 'NEURAL ROUTER #09', 'eu-south (Milan)', '24ms', 'ACTIVE', '15%', 'NEURAL-ROUTE-v2'),
    ('NODE #10', 'CRYPTO VAULT MESH', 'sa-east (Sao Paulo)', '98ms', 'ACTIVE', '8%', 'CRYPTO-SOVEREIGN-VAULT'),
    ('NODE #11', 'AI INFERENCE CLOUD', 'us-central (Iowa)', '45ms', 'ACTIVE', '49%', 'GEMINI-API-BRIDGE'),
    ('NODE #12', 'ETERNIVERSE RELAY', 'ap-southeast (Singapore)', '79ms', 'ACTIVE', '16%', 'P2P-RELAY-FABRIC')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    region = EXCLUDED.region,
    latency = EXCLUDED.latency,
    status = EXCLUDED.status,
    system_load = EXCLUDED.system_load,
    protocol = EXCLUDED.protocol,
    updated_at = NOW();

-- 8. INICJALIZACJA 3 GŁÓWNYCH ŚCIEŻEK (3 PILLARS)
INSERT INTO nexus_zones (zone_id, name, path_tag, description, isolation_level, storage_type)
VALUES
    ('community', 'SPOŁECZNOŚĆ & RODZINA', 'FAMILY', 'Decentralizowana sieć społecznościowa, zaufane węzły, tożsamość kolektywu rodziny Bellas.', 'STANDARD', 'CLOUD_SQL'),
    ('tools', 'NARZĘDZIA DLA DZIAŁANIA', 'USER', 'Gotowe produkty i usługi ekosystemu NEXUS CLOUD (NexusBook, Media Forge, KAISA Online).', 'STANDARD', 'CLOUD_SQL'),
    ('architects', 'STREFA PRZYSZŁYCH ARCHITEKTÓW', 'CREATOR', 'Prywatna strefa robocza twórcy, wchłanianie paczek ZIP w locie, izolowany sandbox IndexedDB bez wycieku do chmury.', 'STRICT', 'LOCAL_INDEXEDDB')
ON CONFLICT (zone_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    storage_type = EXCLUDED.storage_type;

-- 9. INICJALIZACJA MODUŁÓW SYSTEMOWYCH W BAZIE CHMURY
INSERT INTO nexus_cloud_modules (module_id, name, version, description, entry, accent, node, category, status)
VALUES
    ('nexus-bella-os', 'NEXUS BELLA OS', '4.2.0', 'Core sentient neural operating kernel and autonomous agent framework.', 'index.html', '#00E5FF', 'NODE #01', 'SYSTEM', 'OPERATIONAL'),
    ('nexus-family', 'NEXUS FAMILY', '2.8.4', 'Multi-identity sovereign collective network, guardian permissions, and sync nodes.', 'index.html', '#A855F7', 'NODE #02', 'COMMUNICATION', 'OPERATIONAL'),
    ('nexus-media-forge', 'NEXUS MEDIA FORGE', '3.1.0', 'High-throughput sensory generation, audio synth matrix, and media pipeline.', 'index.html', '#EC4899', 'NODE #03', 'CREATIVE', 'OPERATIONAL'),
    ('nexusbook', 'NEXUSBOOK', '1.9.2', 'Immutable neural knowledge ledger, document indexing, and sovereign archive.', 'index.html', '#00D9A6', 'NODE #04', 'KNOWLEDGE', 'READY'),
    ('nexus-dev-hub', 'NEXUS DEV HUB', '5.0.1', 'Engineering workbench, compiler pipelines, WASM sandboxes, and XNL visualizer.', 'index.html', '#3B82F6', 'NODE #05', 'DEVELOPER', 'RUNNING'),
    ('nexus-worlds', 'NEXUS WORLDS', '1.4.0', 'Decentralized spatial environments, simulation topology, and virtual worlds cluster.', 'index.html', '#8B5CF6', 'NODE #06', 'SIMULATION', 'OPERATIONAL'),
    ('kaisa-online', 'KAISA ONLINE', '2.1.0', 'KAISA Protocol ETERNIVERSE-DEV-CORE - Autonomous microservice lifecycle orchestrator & pipeline engine.', 'index.html', '#F59E0B', 'NODE #07', 'ORCHESTRATION', 'OPERATIONAL')
ON CONFLICT (module_id) DO UPDATE SET
    name = EXCLUDED.name,
    version = EXCLUDED.version,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    updated_at = NOW();
