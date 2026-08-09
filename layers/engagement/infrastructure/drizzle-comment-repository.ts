import { and, asc, eq, inArray, isNull, or, sql } from 'drizzle-orm'

import { getDatabase } from '../../content/infrastructure/drizzle/database'
import {
  comment,
  commentReport,
  document,
  documentLocalization,
  notification,
  user,
  userBlock,
} from '../../content/infrastructure/drizzle/schema'
import { CommentPolicy } from '../domain/comment-policy'
import type { CommentView } from '../ports/engagement-repository'

const policy = new CommentPolicy()

function view(row: {
  authorId: string
  body: string
  createdAt: Date
  id: string
  image: string | null
  locale: 'ko' | 'en'
  name: string
  parentId: string | null
  status: CommentView['status']
  updatedAt: Date
}): CommentView {
  const deleted = row.status === 'DELETED'
  return {
    author: deleted ? null : { id: row.authorId, image: row.image, name: row.name },
    body: deleted ? null : row.body,
    createdAt: row.createdAt.toISOString(),
    id: row.id,
    locale: row.locale,
    parentId: row.parentId,
    status: row.status,
    updatedAt: row.updatedAt.toISOString(),
  }
}

export class DrizzleCommentRepository {
  async createComment(input: {
    authorId: string
    body: string
    documentId: string
    locale: 'ko' | 'en'
    moderationReason?: string
    parentId?: string
    status: 'ACTIVE' | 'PENDING'
  }): Promise<CommentView> {
    return getDatabase().transaction(async transaction => {
      const [target] = await transaction
        .select({ allowComments: document.allowComments })
        .from(document)
        .innerJoin(documentLocalization, eq(documentLocalization.documentId, document.id))
        .where(
          and(
            eq(document.id, input.documentId),
            eq(documentLocalization.locale, input.locale),
            eq(documentLocalization.state, 'PUBLISHED'),
          ),
        )
        .limit(1)
      if (!target?.allowComments) throw new Error('Comments are unavailable')
      const [blocked] = await transaction
        .select({ userId: userBlock.userId })
        .from(userBlock)
        .where(
          and(
            eq(userBlock.userId, input.authorId),
            or(isNull(userBlock.expiresAt), sql`${userBlock.expiresAt} > now()`),
          ),
        )
        .limit(1)
      if (blocked) throw new Error('User is blocked from commenting')

      let parentAuthorId: string | undefined
      if (input.parentId) {
        const [parent] = await transaction
          .select({
            authorId: comment.authorId,
            documentId: comment.documentId,
            locale: comment.locale,
            parentId: comment.parentId,
            status: comment.status,
          })
          .from(comment)
          .where(eq(comment.id, input.parentId))
          .limit(1)
        if (!parent) throw new Error('Reply target not found')
        if (parent.status !== 'ACTIVE') throw new Error('Reply target is unavailable')
        policy.assertCanReply(parent, input.documentId, input.locale)
        parentAuthorId = parent.authorId
      }

      const [created] = await transaction
        .insert(comment)
        .values({
          authorId: input.authorId,
          body: input.body,
          documentId: input.documentId,
          locale: input.locale,
          moderationReason: input.moderationReason,
          parentId: input.parentId,
          status: input.status,
        })
        .returning()
      if (!created) throw new Error('Unable to create comment')
      if (input.status === 'ACTIVE' && parentAuthorId && parentAuthorId !== input.authorId)
        await transaction.insert(notification).values({
          actorId: input.authorId,
          message: 'notifications.reply',
          recipientId: parentAuthorId,
          resourceId: created.id,
          type: 'REPLY',
        })
      const [author] = await transaction
        .select({ image: user.image, name: user.name })
        .from(user)
        .where(eq(user.id, input.authorId))
      if (!author) throw new Error('Comment author not found')
      return view({ ...created, ...author })
    })
  }

  async deleteComment(input: { actorId: string; canModerate: boolean; commentId: string }) {
    const current = await this.getComment(input.commentId)
    if (!current) return false
    policy.assertCanMutate(input.actorId, current.authorId, input.canModerate)
    const [deleted] = await getDatabase()
      .update(comment)
      .set({ body: '', deletedAt: new Date(), moderationReason: null, status: 'DELETED' })
      .where(eq(comment.id, input.commentId))
      .returning({ id: comment.id })
    return Boolean(deleted)
  }

  async editComment(input: {
    actorId: string
    body: string
    commentId: string
    moderationReason?: string
    status: 'ACTIVE' | 'PENDING'
  }) {
    const [updated] = await getDatabase()
      .update(comment)
      .set({
        body: input.body,
        moderationReason: input.moderationReason,
        status: input.status,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(comment.id, input.commentId),
          eq(comment.authorId, input.actorId),
          inArray(comment.status, ['ACTIVE', 'PENDING']),
        ),
      )
      .returning()
    if (!updated) return null
    const [author] = await getDatabase()
      .select({ image: user.image, name: user.name })
      .from(user)
      .where(eq(user.id, updated.authorId))
    return author ? view({ ...updated, ...author }) : null
  }

  async getComment(id: string) {
    const [result] = await getDatabase()
      .select({
        authorId: comment.authorId,
        documentId: comment.documentId,
        locale: comment.locale,
        parentId: comment.parentId,
      })
      .from(comment)
      .where(eq(comment.id, id))
      .limit(1)
    return result ?? null
  }

  async listComments(documentId: string, locale: 'ko' | 'en', viewerId?: string) {
    const rows = await getDatabase()
      .select({
        authorId: comment.authorId,
        body: comment.body,
        createdAt: comment.createdAt,
        id: comment.id,
        image: user.image,
        locale: comment.locale,
        name: user.name,
        parentId: comment.parentId,
        status: comment.status,
        updatedAt: comment.updatedAt,
      })
      .from(comment)
      .innerJoin(user, eq(user.id, comment.authorId))
      .where(
        and(
          eq(comment.documentId, documentId),
          eq(comment.locale, locale),
          or(
            inArray(comment.status, ['ACTIVE', 'DELETED']),
            viewerId ? eq(comment.authorId, viewerId) : undefined,
          ),
        ),
      )
      .orderBy(asc(comment.createdAt))
    return rows.map(view)
  }

  async reportComment(input: { commentId: string; reason: string; reporterId: string }) {
    await getDatabase()
      .insert(commentReport)
      .values(input)
      .onConflictDoUpdate({
        set: { createdAt: new Date(), reason: input.reason, status: 'OPEN' },
        target: [commentReport.reporterId, commentReport.commentId],
      })
  }
}
