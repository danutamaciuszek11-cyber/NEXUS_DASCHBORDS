import { createHash } from 'crypto';

export type ShieldStatus = 'ACTIVE' | 'DEGRADED' | 'QUARANTINED';

export type ShieldModule = {
  id: string;
  name: string;
  role: string;
  status: ShieldStatus;
  drift: number;
};

export type GuardLog = {
  id: string;
  at: string;
  moduleId: string;
  event: string;
  hash: string;
};

const modules: ShieldModule[] = [
  { id: 'AUTH-MATRIX-01', name: 'AuthMatrix', role: 'Tożsamość i role', status: 'ACTIVE', drift: 0.1 },
  { id: 'CIPHER-STREAM-02', name: 'CipherStream', role: 'Ochrona zapisu', status: 'ACTIVE', drift: 0 },
  { id: 'SENTINEL-NODE-03', name: 'SentinelNode', role: 'Próg odchylenia 85%', status: 'ACTIVE', drift: 0.2 },
  { id: 'IMMUTABLE-LEDGER-05', name: 'ImmutableLedger', role: 'Księga zdarzeń', status: 'ACTIVE', drift: 0 },
];

const ledger: GuardLog[] = [];
let fingerprint = 'FPR-NEXUS-SEC';

function stamp(moduleId: string, event: string) {
  const at = new Date().toISOString();
  const hash = createHash('sha256').update(`${at}|${moduleId}|${event}`).digest('hex').slice(0, 16);
  ledger.unshift({ id: `LOG-${ledger.length + 1}`, at, moduleId, event, hash });
  if (ledger.length > 40) ledger.pop();
}

stamp('CORE', 'SEC_GUARD_POLACZONY');

export function guardSnapshot() {
  const quarantined = modules.filter((item) => item.status === 'QUARANTINED').length;
  return {
    module: 'ETERNIVERSE-SEC-GUARD',
    version: '2.4.1-LTS',
    protocol: 'DEV-CORE-7.3-SECURE',
    source: 'https://github.com/danutamaciuszek11-cyber/ETERNIVERSE-SEC-GUARD',
    nxl: 'src/nxl/sec-guard.nxl',
    status: quarantined > 0 ? 'QUARANTINE' : 'SECURE',
    fingerprint,
    driftLimit: 85,
    modules,
    ledger,
  };
}

export function setDrift(moduleId: string, drift: number) {
  const target = modules.find((item) => item.id === moduleId);
  if (!target) return null;
  const next = Math.max(0, Math.min(100, drift));
  target.drift = next;
  if (next >= 85) {
    target.status = 'QUARANTINED';
    stamp(moduleId, 'QUARANTINE');
  } else if (next >= 60) {
    target.status = 'DEGRADED';
    stamp(moduleId, 'DRIFT_ELEVATED');
  } else if (target.status !== 'QUARANTINED') {
    target.status = 'ACTIVE';
  }
  return guardSnapshot();
}

export function releaseModule(moduleId: string) {
  const target = modules.find((item) => item.id === moduleId);
  if (!target) return null;
  target.status = 'ACTIVE';
  target.drift = 0.5;
  stamp(moduleId, 'QUARANTINE_LIFTED');
  return guardSnapshot();
}

export function rotateFingerprint() {
  fingerprint = `FPR-${createHash('sha256').update(String(Date.now())).digest('hex').slice(0, 8).toUpperCase()}`;
  stamp('CIPHER-STREAM-02', 'KEY_LABEL_ROTATED');
  return guardSnapshot();
}

const ALERTS = new Set(['BEHAVIORAL_DRIFT', 'INTEGRITY_MISMATCH', 'AUTH_FAILURE']);

export function reviewAlert(moduleId: string, alertType: string) {
  const known = ALERTS.has(alertType) ? alertType : 'BEHAVIORAL_DRIFT';
  const target = modules.find((item) => item.id === moduleId);
  stamp(moduleId || 'CORE', `REVIEW_${known}`);
  return {
    engine: 'local',
    severity: known === 'AUTH_FAILURE' ? 'HIGH' : target && target.drift >= 85 ? 'HIGH' : 'MEDIUM',
    summary: `Moduł ${moduleId || 'CORE'} zgłosił ${known}. Straż nie wykonuje śladu wywołań systemowych.`,
    actions: [
      'Zostaw moduł w obserwacji albo w kwarantannie.',
      'Obróć etykietę podpisu w CipherStream.',
      'Wymagaj ponownego logowania Architekta.',
    ],
  };
}
