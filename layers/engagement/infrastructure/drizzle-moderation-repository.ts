import { and, desc, eq, inArray, or } from 'drizzle-orm'

import { getDatabase } from '../../content/infrastructure/drizzle/database'
import {
  comment,
  commentReport,
  notification,
  user,
  userBlock,
} from '../../content/infrastructure/drizzle/schema'

export class DrizzleModerationRepository {
  async approveComment(input: { actorId: string; commentId: string }) {
    return getDatabase().transaction(async transaction => {
      const [approved] = await transaction
        .update(comment)
        .set({ moderationReason: null, status: 'ACTIVE' })
        .where(and(eq(comment.id, input.commentId), eq(comment.status, 'PENDING')))
        .returning({ authorId: comment.authorId, id: comment.id, parentId: comment.parentId })
      if (!approved) return false
      await transaction
        .update(commentReport)
        .set({ status: 'RESOLVED' })
        .where(eq(commentReport.commentId, approved.id))
      if (approved.parentId) {
        const [parent] = await transaction
          .select({ authorId: comment.authorId })
          .from(comment)
          .where(eq(comment.id, approved.parentId))
        if (parent && parent.authorId !== approved.authorId)
          await transaction.insert(notification).values({
            actorId: approved.authorId,
            message: 'notifications.reply',
            recipientId: parent.authorId,
            resourceId: approved.id,
            type: 'REPLY',
          })
      }
      return true
    })
  }

  async blockUser(input: { blockedBy: string; reason: string; userId: string }): Promise<void> {
    const [target] = await getDatabase()
      .select({ role: user.role })
      .from(user)
      .where(eq(user.id, input.userId))
      .limit(1)
    if (!target) throw new Error('User not found')
    if (target.role !== 'MEMBER') throw new Error('Only members can be blocked')
    await getDatabase()
      .insert(userBlock)
      .values(input)
      .onConflictDoUpdate({
        set: { blockedBy: input.blockedBy, createdAt: new Date(), reason: input.reason },
        target: userBlock.userId,
      })
  }

  async hideComment(input: { actorId: string; commentId: string; reason: string }) {
    const [current] = await getDatabase()
      .select({ authorId: comment.authorId })
      .from(comment)
      .where(eq(comment.id, input.commentId))
    if (!current) return false
    const [hidden] = await getDatabase()
      .update(comment)
      .set({ moderationReason: input.reason, status: 'HIDDEN' })
      .where(eq(comment.id, input.commentId))
      .returning({ id: comment.id })
    if (hidden)
      await Promise.all([
        getDatabase().insert(notification).values({
          actorId: input.actorId,
          message: 'notifications.hidden',
          recipientId: current.authorId,
          resourceId: input.commentId,
          type: 'MODERATION',
        }),
        getDatabase()
          .update(commentReport)
          .set({ status: 'RESOLVED' })
          .where(eq(commentReport.commentId, input.commentId)),
      ])
    return Boolean(hidden)
  }

  async listModerationQueue() {
    const rows = await getDatabase()
      .select({
        authorId: comment.authorId,
        authorName: user.name,
        body: comment.body,
        commentId: comment.id,
        createdAt: comment.createdAt,
        moderationReason: comment.moderationReason,
        reportReason: commentReport.reason,
        status: comment.status,
      })
      .from(comment)
      .innerJoin(user, eq(user.id, comment.authorId))
      .leftJoin(
        commentReport,
        and(eq(commentReport.commentId, comment.id), eq(commentReport.status, 'OPEN')),
      )
      .where(or(inArray(comment.status, ['PENDING', 'HIDDEN']), eq(commentReport.status, 'OPEN')))
      .orderBy(desc(comment.createdAt))
      .limit(200)
    return rows.map(row => ({ ...row, createdAt: row.createdAt.toISOString() }))
  }
}
