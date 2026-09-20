import { NexusModule } from '../core/types';
import { shouldSyncToCloud } from '../core/firebase';

export async function syncModuleToCloudSQL(module: NexusModule, authorUid?: string): Promise<boolean> {
  // Sovereign check: Local modules must never be sent to Cloud SQL
  if (!shouldSyncToCloud(module)) {
    return false;
  }

  let sqlSuccess = false;

  // 2. Cloud API Gateway on nexussocial.pl (HTTP Endpoint)
  try {
    if (typeof fetch !== 'undefined') {
      await fetch('https://nexussocial.pl/api/nexus/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          node: module.node || 'NODE #01',
          source_zone: 'ECOSYSTEM_SYNC',
          event_type: 'MODULE_CLOUD_REGISTER',
          payload: {
            moduleId: module.id,
            name: module.name,
            version: module.version,
            repoUrl: module.repoUrl,
            dependencies: module.dependencies,
            category: module.category,
            status: module.status,
          },
          level: 'info',
        }),
      });
      sqlSuccess = true;
    }
  } catch {
    // Graceful offline fallback
  }

  return sqlSuccess;
}

export async function recordSystemTelemetry(node: string, event: string, details?: string, level: string = 'info'): Promise<void> {

  try {
    if (typeof fetch !== 'undefined') {
      await fetch('https://nexussocial.pl/api/nexus/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          node,
          source_zone: 'TELEMETRY_BUS',
          event_type: event,
          payload: { details, timestamp: Date.now() },
          level,
        }),
      });
    }
  } catch {
    // Graceful offline
  }
}
