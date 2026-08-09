import { index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

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

export const aiUsage = pgTable(
  'ai_usage',
  {
    action: text('action').notNull(),
    actorId: text('actor_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    documentId: text('document_id').notNull(),
    errorCode: text('error_code'),
    estimatedCostMicroUsd: integer('estimated_cost_micro_usd'),
    id: uuid('id').defaultRandom().primaryKey(),
    inputTokens: integer('input_tokens').default(0).notNull(),
    locale: text('locale').notNull(),
    model: text('model').notNull(),
    outputTokens: integer('output_tokens').default(0).notNull(),
    promptVersion: text('prompt_version').notNull(),
    providerRequestId: text('provider_request_id'),
    status: text('status').notNull(),
    totalTokens: integer('total_tokens').default(0).notNull(),
  },
  table => [
    index('ai_usage_actor_created_idx').on(table.actorId, table.createdAt),
    index('ai_usage_document_created_idx').on(table.documentId, table.createdAt),
  ],
)
