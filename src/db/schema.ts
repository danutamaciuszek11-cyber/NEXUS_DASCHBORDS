import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Define the 'users' table.
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'entries' table with a foreign key to 'users'.
export const entries = pgTable('entries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  content: text('content').notNull(),
  date: text('date').notNull(), // Expected format: YYYY-MM-DD
  createdAt: timestamp('created_at').defaultNow(),
});

// Define relationships for the 'users' table.
export const usersRelations = relations(users, ({ many }) => ({
  entries: many(entries),
}));

// Define relationships for the 'entries' table.
export const entriesRelations = relations(entries, ({ one }) => ({
  author: one(users, {
    fields: [entries.userId],
    references: [users.id],
  }),
}));

// Cloud-Tier Module Registry for PostgreSQL Cloud SQL (Community / Products / Bella OS)
export const cloudModules = pgTable('cloud_modules', {
  id: serial('id').primaryKey(),
  moduleId: text('module_id').notNull().unique(),
  name: text('name').notNull(),
  version: text('version').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  node: text('node').notNull(),
  status: text('status').notNull(),
  accent: text('accent').notNull(),
  authorUid: text('author_uid'),
  repoUrl: text('repo_url'),
  dependencies: text('dependencies'), // JSON array string
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// System Mesh Telemetry for Cloud SQL
export const systemTelemetry = pgTable('system_telemetry', {
  id: serial('id').primaryKey(),
  node: text('node').notNull(),
  event: text('event').notNull(),
  details: text('details'),
  level: text('level').default('info'),
  createdAt: timestamp('created_at').defaultNow(),
});
