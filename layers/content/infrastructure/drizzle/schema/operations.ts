import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { user } from './identity'

export const auditLog = pgTable(
  'audit_log',
  {
    action: text('action').notNull(),
    actorId: text('actor_id').references(() => user.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    id: uuid('id').defaultRandom().primaryKey(),
    ipHash: text('ip_hash'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}).notNull(),
    resourceId: text('resource_id'),
    resourceType: text('resource_type').notNull(),
  },
  table => [
    index('audit_log_resource_idx').on(table.resourceType, table.resourceId),
    index('audit_log_actor_idx').on(table.actorId, table.createdAt),
  ],
)
