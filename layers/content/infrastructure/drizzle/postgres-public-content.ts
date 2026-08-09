import { and, asc, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm'

import type { PublicContentItem } from '../../../../shared/schemas/api/content'
import type {
  ListPublicContentInput,
  PublicContentDetail,
  PublicContentPage,
  PublicContentRepository,
  SearchPort,
} from '../../ports/public-content-repository'
import { getDatabase } from './database'
import {
  careerRecord,
  document,
  documentLocalization,
  documentTag,
  portfolioRecord,
  postRecord,
  tag,
} from './schema'

function decodeCursor(cursor?: string): number {
  if (!cursor) return 0
  try {
    const value = Number(Buffer.from(cursor, 'base64url').toString('utf8'))
    return Number.isSafeInteger(value) && value >= 0 ? value : 0
  } catch {
    return 0
  }
}

function encodeCursor(offset: number): string {
  return Buffer.from(String(offset)).toString('base64url')
}

export class PostgresSearchAdapter implements SearchPort {
  async findDocumentIds(input: {
    kind: ListPublicContentInput['kind']
    limit: number
    locale: 'ko' | 'en'
    query: string
  }): Promise<string[]> {
    const rows = await getDatabase()
      .select({ id: document.id })
      .from(documentLocalization)
      .innerJoin(document, eq(document.id, documentLocalization.documentId))
      .where(
        and(
          eq(document.kind, input.kind),
          eq(documentLocalization.locale, input.locale),
          eq(documentLocalization.state, 'PUBLISHED'),
          or(
            ilike(documentLocalization.searchText, `%${input.query}%`),
            sql`${documentLocalization.searchText} % ${input.query}`,
          ),
        ),
      )
      .orderBy(desc(sql`similarity(${documentLocalization.searchText}, ${input.query})`))
      .limit(input.limit)
    return rows.map(row => row.id)
  }
}

export class DrizzlePublicContentRepository implements PublicContentRepository {
  async findBySlug(
    kind: ListPublicContentInput['kind'],
    locale: 'ko' | 'en',
    slug: string,
  ): Promise<PublicContentDetail | null> {
    const [row] = await getDatabase()
      .select({
        contentJson: documentLocalization.contentJson,
        id: document.id,
        kind: document.kind,
        locale: documentLocalization.locale,
        publishedAt: documentLocalization.publishedAt,
        renderedHtml: documentLocalization.renderedHtml,
        seo: documentLocalization.seo,
        slug: documentLocalization.slug,
        summary: documentLocalization.summary,
        title: documentLocalization.title,
      })
      .from(documentLocalization)
      .innerJoin(document, eq(document.id, documentLocalization.documentId))
      .where(
        and(
          eq(document.kind, kind),
          eq(documentLocalization.locale, locale),
          eq(documentLocalization.slug, slug),
          eq(documentLocalization.state, 'PUBLISHED'),
        ),
      )
      .limit(1)
    if (!row) return null
    const [tags, metadata] = await Promise.all([
      this.tagsFor([row.id]),
      this.metadataFor(kind, [row.id]),
    ])
    return {
      ...row,
      contentJson: row.contentJson,
      metadata: metadata.get(row.id) ?? {},
      publishedAt: row.publishedAt?.toISOString() ?? null,
      seo: row.seo,
      tags: tags.get(row.id) ?? [],
    }
  }

  async list(input: ListPublicContentInput): Promise<PublicContentPage> {
    const database = getDatabase()
    const offset = decodeCursor(input.cursor)
    const tagCondition = input.tag
      ? sql`EXISTS (
          SELECT 1 FROM ${documentTag}
          INNER JOIN ${tag} ON ${tag.id} = ${documentTag.tagId}
          WHERE ${documentTag.documentId} = ${document.id} AND ${tag.slug} = ${input.tag}
        )`
      : undefined
    const order =
      input.sort === 'title'
        ? asc(documentLocalization.title)
        : input.sort === 'oldest'
          ? asc(documentLocalization.publishedAt)
          : desc(documentLocalization.publishedAt)
    const rows = await database
      .select({
        id: document.id,
        kind: document.kind,
        locale: documentLocalization.locale,
        publishedAt: documentLocalization.publishedAt,
        slug: documentLocalization.slug,
        summary: documentLocalization.summary,
        title: documentLocalization.title,
      })
      .from(documentLocalization)
      .innerJoin(document, eq(document.id, documentLocalization.documentId))
      .where(
        and(
          eq(document.kind, input.kind),
          eq(documentLocalization.locale, input.locale),
          eq(documentLocalization.state, 'PUBLISHED'),
          input.searchIds ? inArray(document.id, input.searchIds) : undefined,
          tagCondition,
        ),
      )
      .orderBy(order, asc(document.id))
      .limit(input.limit + 1)
      .offset(offset)
    const hasNext = rows.length > input.limit
    const pageRows = rows.slice(0, input.limit)
    const ids = pageRows.map(row => row.id)
    const [tags, metadata] = await Promise.all([
      this.tagsFor(ids),
      this.metadataFor(input.kind, ids),
    ])
    const items: PublicContentItem[] = pageRows.map(row => ({
      ...row,
      metadata: metadata.get(row.id) ?? {},
      publishedAt: row.publishedAt?.toISOString() ?? null,
      tags: tags.get(row.id) ?? [],
    }))
    return { items, nextCursor: hasNext ? encodeCursor(offset + input.limit) : null }
  }

  private async tagsFor(ids: string[]): Promise<Map<string, string[]>> {
    const result = new Map<string, string[]>()
    if (ids.length === 0) return result
    const rows = await getDatabase()
      .select({ documentId: documentTag.documentId, name: tag.name })
      .from(documentTag)
      .innerJoin(tag, eq(tag.id, documentTag.tagId))
      .where(inArray(documentTag.documentId, ids))
      .orderBy(asc(tag.name))
    for (const row of rows)
      result.set(row.documentId, [...(result.get(row.documentId) ?? []), row.name])
    return result
  }

  private async metadataFor(
    kind: ListPublicContentInput['kind'],
    ids: string[],
  ): Promise<Map<string, Record<string, unknown>>> {
    const result = new Map<string, Record<string, unknown>>()
    if (ids.length === 0) return result
    if (kind === 'PORTFOLIO') {
      const rows = await getDatabase()
        .select({ id: portfolioRecord.documentId, metadata: portfolioRecord.metadata })
        .from(portfolioRecord)
        .where(inArray(portfolioRecord.documentId, ids))
      for (const row of rows) result.set(row.id, row.metadata)
    }
    if (kind === 'POST') {
      const rows = await getDatabase()
        .select({
          category: postRecord.category,
          id: postRecord.documentId,
          seriesOrder: postRecord.seriesOrder,
          seriesSlug: postRecord.seriesSlug,
        })
        .from(postRecord)
        .where(inArray(postRecord.documentId, ids))
      for (const row of rows) result.set(row.id, row)
    }
    if (kind === 'CAREER') {
      const rows = await getDatabase()
        .select({
          endedAt: careerRecord.endedAt,
          id: careerRecord.documentId,
          organization: careerRecord.organization,
          recordType: careerRecord.recordType,
          role: careerRecord.role,
          startedAt: careerRecord.startedAt,
        })
        .from(careerRecord)
        .where(inArray(careerRecord.documentId, ids))
      for (const row of rows) result.set(row.id, row)
    }
    return result
  }
}
