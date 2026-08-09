import { relations } from 'drizzle-orm'
import {
  type AnyPgColumn,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import { document } from './content'
import { user } from './identity'

export const commentStatusEnum = pgEnum('comment_status', [
  'ACTIVE',
  'PENDING',
  'HIDDEN',
  'DELETED',
])
export const notificationTypeEnum = pgEnum('notification_type', ['REPLY', 'MODERATION'])

export const comment = pgTable(
  'comment',
  {
    authorId: text('author_id')
      .notNull()
      .references(() => user.id),
    body: text('body').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    documentId: uuid('document_id')
      .notNull()
      .references(() => document.id, { onDelete: 'cascade' }),
    id: uuid('id').defaultRandom().primaryKey(),
    locale: text('locale').$type<'ko' | 'en'>().notNull(),
    moderationReason: text('moderation_reason'),
    parentId: uuid('parent_id').references((): AnyPgColumn => comment.id, {
      onDelete: 'set null',
    }),
    status: commentStatusEnum('status').default('ACTIVE').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => [
    index('comment_document_locale_created_idx').on(
      table.documentId,
      table.locale,
      table.createdAt,
    ),
    index('comment_parent_idx').on(table.parentId),
    index('comment_author_idx').on(table.authorId, table.createdAt),
  ],
)

export const documentLike = pgTable(
  'document_like',
  {
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    documentId: uuid('document_id')
      .notNull()
      .references(() => document.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  table => [primaryKey({ columns: [table.userId, table.documentId] })],
)

export const commentReport = pgTable(
  'comment_report',
  {
    commentId: uuid('comment_id')
      .notNull()
      .references(() => comment.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    id: uuid('id').defaultRandom().primaryKey(),
    reason: text('reason').notNull(),
    reporterId: text('reporter_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    status: text('status').default('OPEN').notNull(),
  },
  table => [
    uniqueIndex('comment_report_reporter_comment_unique').on(table.reporterId, table.commentId),
    index('comment_report_status_idx').on(table.status, table.createdAt),
  ],
)

export const userBlock = pgTable(
  'user_block',
  {
    blockedBy: text('blocked_by')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    reason: text('reason').notNull(),
    userId: text('user_id')
      .primaryKey()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  table => [index('user_block_expires_idx').on(table.expiresAt)],
)

export const notification = pgTable(
  'notification',
  {
    actorId: text('actor_id').references(() => user.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    id: uuid('id').defaultRandom().primaryKey(),
    message: text('message').notNull(),
    readAt: timestamp('read_at', { withTimezone: true }),
    recipientId: text('recipient_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    resourceId: text('resource_id').notNull(),
    type: notificationTypeEnum('type').notNull(),
  },
  table => [
    index('notification_recipient_read_idx').on(table.recipientId, table.readAt, table.createdAt),
  ],
)

export const commentRelations = relations(comment, ({ one, many }) => ({
  author: one(user, { fields: [comment.authorId], references: [user.id] }),
  document: one(document, { fields: [comment.documentId], references: [document.id] }),
  parent: one(comment, {
    fields: [comment.parentId],
    references: [comment.id],
    relationName: 'replies',
  }),
  replies: many(comment, { relationName: 'replies' }),
}))
