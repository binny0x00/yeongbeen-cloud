import { and, asc, eq, inArray, lte } from 'drizzle-orm'

import type { ContentOperationsRepository, OrphanMedia } from '../../ports/content-operations'
import { getDatabase } from './database'
import { documentLocalization, media } from './schema'

export class DrizzleContentOperationsRepository implements ContentOperationsRepository {
  async publishScheduled(now: Date, limit: number): Promise<string[]> {
    return getDatabase().transaction(async transaction => {
      const due = await transaction
        .select({ documentId: documentLocalization.documentId, id: documentLocalization.id })
        .from(documentLocalization)
        .where(
          and(
            eq(documentLocalization.state, 'SCHEDULED'),
            lte(documentLocalization.scheduledAt, now),
          ),
        )
        .orderBy(asc(documentLocalization.scheduledAt), asc(documentLocalization.id))
        .limit(limit)
      if (due.length === 0) return []

      const updated = await transaction
        .update(documentLocalization)
        .set({ publishedAt: now, scheduledAt: null, state: 'PUBLISHED' })
        .where(
          and(
            inArray(
              documentLocalization.id,
              due.map(item => item.id),
            ),
            eq(documentLocalization.state, 'SCHEDULED'),
            lte(documentLocalization.scheduledAt, now),
          ),
        )
        .returning({ documentId: documentLocalization.documentId })
      return [...new Set(updated.map(item => item.documentId))]
    })
  }

  async findOrphanMedia(before: Date, limit: number): Promise<OrphanMedia[]> {
    return getDatabase()
      .select({ id: media.id, objectKey: media.objectKey })
      .from(media)
      .where(and(eq(media.status, 'PENDING'), lte(media.createdAt, before)))
      .orderBy(asc(media.createdAt), asc(media.id))
      .limit(limit)
  }

  async deleteMedia(id: string): Promise<void> {
    await getDatabase()
      .delete(media)
      .where(and(eq(media.id, id), eq(media.status, 'PENDING')))
  }
}
