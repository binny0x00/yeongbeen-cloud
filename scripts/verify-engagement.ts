import { eq } from 'drizzle-orm'

import { DrizzleAdminDocumentRepository } from '../layers/content/infrastructure/drizzle/drizzle-admin-document-repository'
import { closeDatabase, getDatabase } from '../layers/content/infrastructure/drizzle/database'
import { document, user } from '../layers/content/infrastructure/drizzle/schema'
import { DrizzleEngagementRepository } from '../layers/engagement/infrastructure/drizzle-engagement-repository'

const runId = `engagement-verifier-${Date.now()}`
const ownerId = `${runId}-owner`
const firstMemberId = `${runId}-member-1`
const secondMemberId = `${runId}-member-2`
const database = getDatabase()
const documents = new DrizzleAdminDocumentRepository()
const engagement = new DrizzleEngagementRepository()
let documentId: string | undefined

try {
  await database.insert(user).values([
    {
      email: `${ownerId}@example.test`,
      emailVerified: true,
      id: ownerId,
      name: 'Owner',
      role: 'OWNER',
    },
    {
      email: `${firstMemberId}@example.test`,
      emailVerified: true,
      id: firstMemberId,
      name: 'First member',
      role: 'MEMBER',
    },
    {
      email: `${secondMemberId}@example.test`,
      emailVerified: true,
      id: secondMemberId,
      name: 'Second member',
      role: 'MEMBER',
    },
  ])
  const created = await documents.create({
    authorId: ownerId,
    kind: 'POST',
    locale: 'ko',
    slug: runId,
    summary: 'Engagement verification',
    title: 'Engagement verification',
  })
  documentId = created.id
  await documents.transition({ documentId, locale: 'ko', state: 'PUBLISHED' })

  const root = await engagement.createComment({
    authorId: firstMemberId,
    body: 'Root comment',
    documentId,
    locale: 'ko',
    status: 'ACTIVE',
  })
  const reply = await engagement.createComment({
    authorId: secondMemberId,
    body: 'Reply',
    documentId,
    locale: 'ko',
    parentId: root.id,
    status: 'ACTIVE',
  })
  await expectFailure(
    engagement.createComment({
      authorId: firstMemberId,
      body: 'Nested reply',
      documentId,
      locale: 'ko',
      parentId: reply.id,
      status: 'ACTIVE',
    }),
    'Only one reply level',
  )

  const firstLike = await engagement.setLike({ documentId, liked: true, userId: firstMemberId })
  const repeatedLike = await engagement.setLike({
    documentId,
    liked: true,
    userId: firstMemberId,
  })
  if (firstLike.count !== 1 || repeatedLike.count !== 1) throw new Error('Like idempotency failed')

  await engagement.reportComment({
    commentId: reply.id,
    reason: 'First report reason',
    reporterId: firstMemberId,
  })
  await engagement.reportComment({
    commentId: reply.id,
    reason: 'Updated report reason',
    reporterId: firstMemberId,
  })
  const notifications = await engagement.listNotifications(firstMemberId)
  if (notifications.length !== 1 || notifications[0]?.type !== 'REPLY')
    throw new Error('Reply notification failed')

  await engagement.deleteComment({ actorId: firstMemberId, canModerate: false, commentId: root.id })
  const listed = await engagement.listComments(documentId, 'ko', firstMemberId)
  const deleted = listed.find(comment => comment.id === root.id)
  if (deleted?.body !== null || deleted.author !== null || deleted.status !== 'DELETED')
    throw new Error('Comment anonymization failed')

  await engagement.blockUser({
    blockedBy: ownerId,
    reason: 'Verification block',
    userId: secondMemberId,
  })
  await expectFailure(
    engagement.createComment({
      authorId: secondMemberId,
      body: 'Blocked comment',
      documentId,
      locale: 'ko',
      status: 'ACTIVE',
    }),
    'blocked',
  )
  console.log('Comments, replies, notifications, likes, reports, deletion, and blocking are ready')
} finally {
  if (documentId) await database.delete(document).where(eq(document.id, documentId))
  for (const id of [firstMemberId, secondMemberId, ownerId])
    await database.delete(user).where(eq(user.id, id))
  await closeDatabase()
}

async function expectFailure(promise: Promise<unknown>, message: string): Promise<void> {
  try {
    await promise
  } catch (error) {
    if (error instanceof Error && error.message.includes(message)) return
    throw error
  }
  throw new Error(`Expected failure containing: ${message}`)
}
