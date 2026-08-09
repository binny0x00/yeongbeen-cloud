import { and, count, desc, eq, inArray } from 'drizzle-orm'

import { getDatabase } from '../../content/infrastructure/drizzle/database'
import {
  document,
  documentLike,
  documentLocalization,
  notification,
} from '../../content/infrastructure/drizzle/schema'

export class DrizzleReactionRepository {
  async getLike(documentId: string, userId?: string) {
    const database = getDatabase()
    const [[total], own] = await Promise.all([
      database
        .select({ value: count() })
        .from(documentLike)
        .where(eq(documentLike.documentId, documentId)),
      userId
        ? database
            .select({ userId: documentLike.userId })
            .from(documentLike)
            .where(and(eq(documentLike.documentId, documentId), eq(documentLike.userId, userId)))
            .limit(1)
        : Promise.resolve([]),
    ])
    return { count: total?.value ?? 0, liked: own.length > 0 }
  }

  async listNotifications(userId: string) {
    const rows = await getDatabase()
      .select()
      .from(notification)
      .where(eq(notification.recipientId, userId))
      .orderBy(desc(notification.createdAt))
      .limit(100)
    return rows.map(row => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
      readAt: row.readAt?.toISOString() ?? null,
    }))
  }

  async markNotificationsRead(userId: string, ids?: string[]) {
    if (ids?.length === 0) return 0
    const updated = await getDatabase()
      .update(notification)
      .set({ readAt: new Date() })
      .where(
        and(eq(notification.recipientId, userId), ids ? inArray(notification.id, ids) : undefined),
      )
      .returning({ id: notification.id })
    return updated.length
  }

  async setLike(input: { documentId: string; liked: boolean; userId: string }) {
    return getDatabase().transaction(async transaction => {
      const [target] = await transaction
        .select({ allowLikes: document.allowLikes })
        .from(document)
        .innerJoin(documentLocalization, eq(documentLocalization.documentId, document.id))
        .where(and(eq(document.id, input.documentId), eq(documentLocalization.state, 'PUBLISHED')))
        .limit(1)
      if (!target?.allowLikes) throw new Error('Likes are unavailable')
      if (input.liked)
        await transaction
          .insert(documentLike)
          .values({ documentId: input.documentId, userId: input.userId })
          .onConflictDoNothing()
      else
        await transaction
          .delete(documentLike)
          .where(
            and(
              eq(documentLike.documentId, input.documentId),
              eq(documentLike.userId, input.userId),
            ),
          )
      const [total] = await transaction
        .select({ value: count() })
        .from(documentLike)
        .where(eq(documentLike.documentId, input.documentId))
      return { count: total?.value ?? 0, liked: input.liked }
    })
  }
}
