import { relations, sql } from 'drizzle-orm'
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import { user } from './identity'

export const documentKindEnum = pgEnum('document_kind', ['PORTFOLIO', 'CAREER', 'POST'])
export const localeEnum = pgEnum('locale', ['ko', 'en'])
export const publicationStateEnum = pgEnum('publication_state', [
  'DRAFT',
  'REVIEW',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
])

export const document = pgTable(
  'document',
  {
    allowComments: boolean('allow_comments').default(true).notNull(),
    allowLikes: boolean('allow_likes').default(true).notNull(),
    authorId: text('author_id')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    id: uuid('id').defaultRandom().primaryKey(),
    kind: documentKindEnum('kind').notNull(),
    sourceChecksum: text('source_checksum'),
    sourceImportedAt: timestamp('source_imported_at', { withTimezone: true }),
    sourceKey: text('source_key'),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => [
    index('document_kind_updated_idx').on(table.kind, table.updatedAt),
    index('document_author_idx').on(table.authorId),
    uniqueIndex('document_source_key_unique').on(table.sourceKey),
  ],
)

export const documentLocalization = pgTable(
  'document_localization',
  {
    contentJson: jsonb('content_json')
      .$type<Record<string, unknown>>()
      .default({ type: 'doc', content: [] })
      .notNull(),
    documentId: uuid('document_id')
      .notNull()
      .references(() => document.id, { onDelete: 'cascade' }),
    id: uuid('id').defaultRandom().primaryKey(),
    locale: localeEnum('locale').notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    renderedHtml: text('rendered_html').default('').notNull(),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
    searchText: text('search_text').default('').notNull(),
    seo: jsonb('seo')
      .$type<{ description?: string; image?: string; title?: string }>()
      .default({})
      .notNull(),
    slug: text('slug').notNull(),
    state: publicationStateEnum('state').default('DRAFT').notNull(),
    summary: text('summary').default('').notNull(),
    title: text('title').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    version: integer('version').default(1).notNull(),
  },
  table => [
    uniqueIndex('document_localization_document_locale_unique').on(table.documentId, table.locale),
    uniqueIndex('document_localization_locale_slug_unique').on(table.locale, table.slug),
    index('document_localization_public_idx').on(table.locale, table.state, table.publishedAt),
    check('document_localization_version_positive', sql`${table.version} > 0`),
  ],
)

export const portfolioRecord = pgTable('portfolio_record', {
  documentId: uuid('document_id')
    .primaryKey()
    .references(() => document.id, { onDelete: 'cascade' }),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}).notNull(),
  organization: text('organization'),
  recordType: text('record_type').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }),
})

export const careerRecord = pgTable('career_record', {
  documentId: uuid('document_id')
    .primaryKey()
    .references(() => document.id, { onDelete: 'cascade' }),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  organization: text('organization').notNull(),
  recordType: text('record_type').notNull(),
  role: text('role'),
  startedAt: timestamp('started_at', { withTimezone: true }),
})

export const postRecord = pgTable('post_record', {
  category: text('category').notNull(),
  documentId: uuid('document_id')
    .primaryKey()
    .references(() => document.id, { onDelete: 'cascade' }),
  seriesOrder: integer('series_order'),
  seriesSlug: text('series_slug'),
})

export const revision = pgTable(
  'revision',
  {
    contentJson: jsonb('content_json').$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: text('created_by')
      .notNull()
      .references(() => user.id),
    id: uuid('id').defaultRandom().primaryKey(),
    localizationId: uuid('localization_id')
      .notNull()
      .references(() => documentLocalization.id, { onDelete: 'cascade' }),
    summary: text('summary').default('').notNull(),
    title: text('title').notNull(),
    version: integer('version').notNull(),
  },
  table => [
    uniqueIndex('revision_localization_version_unique').on(table.localizationId, table.version),
  ],
)

export const media = pgTable(
  'media',
  {
    alt: text('alt').default('').notNull(),
    caption: text('caption').default('').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: text('created_by')
      .notNull()
      .references(() => user.id),
    id: uuid('id').defaultRandom().primaryKey(),
    mimeType: text('mime_type').notNull(),
    objectKey: text('object_key').notNull(),
    size: integer('size').notNull(),
    status: text('status').default('PENDING').notNull(),
  },
  table => [uniqueIndex('media_object_key_unique').on(table.objectKey)],
)

export const tag = pgTable(
  'tag',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
  },
  table => [uniqueIndex('tag_slug_unique').on(table.slug)],
)
export const documentTag = pgTable(
  'document_tag',
  {
    documentId: uuid('document_id')
      .notNull()
      .references(() => document.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tag.id, { onDelete: 'cascade' }),
  },
  table => [primaryKey({ columns: [table.documentId, table.tagId] })],
)

export const documentRelations = relations(document, ({ many }) => ({
  localizations: many(documentLocalization),
  revisions: many(revision),
  tags: many(documentTag),
}))
export const localizationRelations = relations(documentLocalization, ({ one, many }) => ({
  document: one(document, { fields: [documentLocalization.documentId], references: [document.id] }),
  revisions: many(revision),
}))
export const revisionRelations = relations(revision, ({ one }) => ({
  localization: one(documentLocalization, {
    fields: [revision.localizationId],
    references: [documentLocalization.id],
  }),
}))
