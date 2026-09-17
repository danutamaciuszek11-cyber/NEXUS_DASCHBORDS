import { db } from './index';
import { cloudModules, systemTelemetry } from './schema';
import { NexusModule } from '../core/types';
import { shouldSyncToCloud } from '../core/firebase';

export async function syncModuleToCloudSQL(module: NexusModule, authorUid?: string): Promise<boolean> {
  // Sovereign check: Local modules must never be sent to Cloud SQL
  if (!shouldSyncToCloud(module)) {
    return false;
  }

  try {
    await db.insert(cloudModules).values({
      moduleId: module.id,
      name: module.name,
      version: module.version,
      description: module.description,
      category: module.category,
      node: module.node,
      status: module.status,
      accent: module.accent,
      authorUid: authorUid || null,
    }).onConflictDoUpdate({
      target: cloudModules.moduleId,
      set: {
        name: module.name,
        version: module.version,
        description: module.description,
        status: module.status,
        updatedAt: new Date(),
      }
    });
    return true;
  } catch (err) {
    // Cloud SQL might not be configured in local dev environment; log gracefully
    console.debug('[CLOUD SQL SYNC SKIPPED OR OFFLINE]', err);
    return false;
  }
}

export async function recordSystemTelemetry(node: string, event: string, details?: string, level: string = 'info'): Promise<void> {
  try {
    await db.insert(systemTelemetry).values({
      node,
      event,
      details,
      level,
    });
  } catch {
    // Silent fail if local without live PostgreSQL pool
  }
}
