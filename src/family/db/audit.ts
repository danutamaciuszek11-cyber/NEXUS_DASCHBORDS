import { db } from './index.ts';
import { auditLogs } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

export async function getDbAuditLogs(limitCount = 50, category?: string) {
  try {
    if (category && category !== 'ALL') {
      return await db
        .select()
        .from(auditLogs)
        .where(eq(auditLogs.category, category))
        .orderBy(desc(auditLogs.id))
        .limit(limitCount);
    }
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.id)).limit(limitCount);
  } catch (error) {
    console.error("Failed to query audit logs from Cloud SQL:", error);
    throw new Error("Database query failed. Please try again later.", { cause: error });
  }
}

export async function insertDbAuditLog(log: typeof auditLogs.$inferInsert) {
  try {
    const result = await db.insert(auditLogs).values(log).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to insert audit log into Cloud SQL:", error);
    throw new Error("Database insert failed. Please try again later.", { cause: error });
  }
}
