import { and, desc, eq } from 'drizzle-orm'

import { editorSearchText, renderEditorHtml } from '../../editor/render'
import type {
  AdminDocument,
  AdminDocumentRepository,
  AdminLocalization,
  AdminRevision,
  SaveLocalizationInput,
  SaveLocalizationResult,
} from '../../ports/admin-document-repository'
import { getDatabase } from './database'
import { document, documentLocalization, revision } from './schema'

function localization(row: typeof documentLocalization.$inferSelect): AdminLocalization {
  return {
    contentJson: row.contentJson,
    id: row.id,
    locale: row.locale,
    scheduledAt: row.scheduledAt?.toISOString() ?? null,
    seo: row.seo,
    slug: row.slug,
    state: row.state,
    summary: row.summary,
    title: row.title,
    version: row.version,
  }
}

export class DrizzleAdminDocumentRepository implements AdminDocumentRepository {
  async create(input: {
    authorId: string
    kind: AdminDocument['kind']
    locale: 'ko' | 'en'
    slug: string
    summary: string
    title: string
  }): Promise<AdminDocument> {
    const database = getDatabase()
    const [created] = await database
      .insert(document)
      .values({ authorId: input.authorId, kind: input.kind })
      .returning()
    if (!created) throw new Error('Unable to create document')
    const empty = { content: [{ type: 'paragraph' }], type: 'doc' }
    const localizations = await database
      .insert(documentLocalization)
      .values(
        (['ko', 'en'] as const).map(locale => ({
          contentJson: empty,
          documentId: created.id,
          locale,
          slug: input.slug,
          state: 'DRAFT' as const,
          summary: locale === input.locale ? input.summary : '',
          title: locale === input.locale ? input.title : input.title,
        })),
      )
      .returning()
    return {
      id: created.id,
      kind: created.kind,
      localizations: localizations.map(localization),
      updatedAt: created.updatedAt.toISOString(),
    }
  }

  async findById(id: string): Promise<(AdminDocument & { revisions: AdminRevision[] }) | null> {
    const database = getDatabase()
    const [record] = await database.select().from(document).where(eq(document.id, id)).limit(1)
    if (!record) return null
    const [localizations, revisions] = await Promise.all([
      database.select().from(documentLocalization).where(eq(documentLocalization.documentId, id)),
      database
        .select({
          contentJson: revision.contentJson,
          createdAt: revision.createdAt,
          id: revision.id,
          locale: documentLocalization.locale,
          summary: revision.summary,
          title: revision.title,
          version: revision.version,
        })
        .from(revision)
        .innerJoin(documentLocalization, eq(documentLocalization.id, revision.localizationId))
        .where(eq(documentLocalization.documentId, id))
        .orderBy(desc(revision.createdAt)),
    ])
    return {
      id: record.id,
      kind: record.kind,
      localizations: localizations.map(localization),
      revisions: revisions.map(row => ({ ...row, createdAt: row.createdAt.toISOString() })),
      updatedAt: record.updatedAt.toISOString(),
    }
  }

  async list(): Promise<AdminDocument[]> {
    const database = getDatabase()
    const records = await database.select().from(document).orderBy(desc(document.updatedAt))
    return Promise.all(
      records.map(async record => {
        const rows = await database
          .select()
          .from(documentLocalization)
          .where(eq(documentLocalization.documentId, record.id))
        return {
          id: record.id,
          kind: record.kind,
          localizations: rows.map(localization),
          updatedAt: record.updatedAt.toISOString(),
        }
      }),
    )
  }

  async save(input: SaveLocalizationInput): Promise<SaveLocalizationResult> {
    return getDatabase().transaction(async transaction => {
      const [current] = await transaction
        .select()
        .from(documentLocalization)
        .where(
          and(
            eq(documentLocalization.documentId, input.documentId),
            eq(documentLocalization.locale, input.locale),
          ),
        )
        .limit(1)
      if (!current) throw new Error('Localization not found')
      if (current.version !== input.version)
        return { currentVersion: current.version, status: 'conflict' as const }

      const [updated] = await transaction
        .update(documentLocalization)
        .set({
          contentJson: input.contentJson,
          renderedHtml: renderEditorHtml(input.contentJson),
          searchText: `${input.title} ${input.summary} ${editorSearchText(input.contentJson)}`,
          seo: input.seo,
          slug: input.slug,
          summary: input.summary,
          title: input.title,
          updatedAt: new Date(),
          version: current.version + 1,
        })
        .where(
          and(
            eq(documentLocalization.id, current.id),
            eq(documentLocalization.version, input.version),
          ),
        )
        .returning()
      if (!updated) {
        const [latest] = await transaction
          .select({ version: documentLocalization.version })
          .from(documentLocalization)
          .where(eq(documentLocalization.id, current.id))
        return { currentVersion: latest?.version ?? input.version, status: 'conflict' as const }
      }
      await transaction
        .insert(revision)
        .values({
          contentJson: current.contentJson,
          createdBy: input.userId,
          localizationId: current.id,
          summary: current.summary,
          title: current.title,
          version: current.version,
        })
        .onConflictDoNothing()
      return { localization: localization(updated), status: 'saved' as const }
    })
  }

  async transition(input: {
    documentId: string
    locale: 'ko' | 'en'
    scheduledAt?: Date
    state: AdminLocalization['state']
  }): Promise<AdminLocalization | null> {
    const [updated] = await getDatabase()
      .update(documentLocalization)
      .set({
        publishedAt: input.state === 'PUBLISHED' ? new Date() : undefined,
        scheduledAt: input.state === 'SCHEDULED' ? input.scheduledAt : null,
        state: input.state,
      })
      .where(
        and(
          eq(documentLocalization.documentId, input.documentId),
          eq(documentLocalization.locale, input.locale),
        ),
      )
      .returning()
    return updated ? localization(updated) : null
  }

  async restore(input: {
    documentId: string
    revisionId: string
    userId: string
  }): Promise<AdminLocalization | null> {
    const database = getDatabase()
    const [snapshot] = await database
      .select({
        contentJson: revision.contentJson,
        locale: documentLocalization.locale,
        summary: revision.summary,
        title: revision.title,
      })
      .from(revision)
      .innerJoin(documentLocalization, eq(documentLocalization.id, revision.localizationId))
      .where(
        and(
          eq(revision.id, input.revisionId),
          eq(documentLocalization.documentId, input.documentId),
        ),
      )
      .limit(1)
    if (!snapshot) return null
    const [current] = await database
      .select()
      .from(documentLocalization)
      .where(
        and(
          eq(documentLocalization.documentId, input.documentId),
          eq(documentLocalization.locale, snapshot.locale),
        ),
      )
      .limit(1)
    if (!current) return null
    const result = await this.save({
      contentJson: snapshot.contentJson,
      documentId: input.documentId,
      locale: snapshot.locale,
      seo: current.seo,
      slug: current.slug,
      summary: snapshot.summary,
      title: snapshot.title,
      userId: input.userId,
      version: current.version,
    })
    return result.status === 'saved' ? result.localization : null
  }
}
