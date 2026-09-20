import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table keyed by Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  handle: text('handle'),
  role: text('role').default('ARCHITECT'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Audit logs table for persistent security and telemetry tracking
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  timestamp: text('timestamp').notNull(),
  actorId: text('actor_id'),
  actorName: text('actor_name'),
  action: text('action').notNull(),
  target: text('target'),
  details: text('details'),
  severity: text('severity').default('INFO'),
  category: text('category').default('SYSTEM'),
  nodeToken: text('node_token'),
  nodeId: text('node_id'),
  microserviceName: text('microservice_name'),
  endpoint: text('endpoint'),
  statusCode: integer('status_code'),
  latencyMs: integer('latency_ms'),
  signatureHash: text('signature_hash'),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, () => ({}));
