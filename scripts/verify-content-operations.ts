import { randomUUID } from 'node:crypto'

import { and, eq } from 'drizzle-orm'

import {
  CleanupOrphanMedia,
  PublishScheduledContent,
} from '../layers/content/application/content-operations'
import { closeDatabase, getDatabase } from '../layers/content/infrastructure/drizzle/database'
import { DrizzleContentOperationsRepository } from '../layers/content/infrastructure/drizzle/drizzle-content-operations'
import {
  document,
  documentLocalization,
  media,
  user,
} from '../layers/content/infrastructure/drizzle/schema'

const database = getDatabase()
const suffix = randomUUID()
const userId = `operations-${suffix}`
const dueDocumentId = randomUUID()
const futureDocumentId = randomUUID()
const oldMediaId = randomUUID()
const newMediaId = randomUUID()
const now = new Date('2026-08-09T12:00:00.000Z')
let invalidations = 0
const deletedObjects: string[] = []

try {
  await database.insert(user).values({
    email: `${userId}@local.invalid`,
    emailVerified: true,
    id: userId,
    name: 'Operations verification',
    role: 'OWNER',
  })
  await database.insert(document).values([
    { authorId: userId, id: dueDocumentId, kind: 'POST' },
    { authorId: userId, id: futureDocumentId, kind: 'POST' },
  ])
  await database.insert(documentLocalization).values([
    {
      documentId: dueDocumentId,
      locale: 'ko',
      scheduledAt: new Date(now.getTime() - 60_000),
      slug: `due-${suffix}`,
      state: 'SCHEDULED',
      title: 'Due',
    },
    {
      documentId: futureDocumentId,
      locale: 'ko',
      scheduledAt: new Date(now.getTime() + 60_000),
      slug: `future-${suffix}`,
      state: 'SCHEDULED',
      title: 'Future',
    },
  ])
  await database.insert(media).values([
    {
      createdAt: new Date(now.getTime() - 25 * 60 * 60 * 1_000),
      createdBy: userId,
      id: oldMediaId,
      mimeType: 'image/png',
      objectKey: `verify/${suffix}/old.png`,
      size: 10,
      status: 'PENDING',
    },
    {
      createdAt: new Date(now.getTime() - 60 * 60 * 1_000),
      createdBy: userId,
      id: newMediaId,
      mimeType: 'image/png',
      objectKey: `verify/${suffix}/new.png`,
      size: 10,
      status: 'PENDING',
    },
  ])

  const repository = new DrizzleContentOperationsRepository()
  const publication = await new PublishScheduledContent(
    repository,
    {
      get: async () => null,
      invalidate: async () => {
        invalidations += 1
      },
      set: async () => undefined,
    },
    { now: () => now },
  ).execute()
  if (publication.published !== 1 || invalidations !== 1) {
    throw new Error('Scheduled publication did not publish exactly one due localization')
  }

  const cleanup = await new CleanupOrphanMedia(
    repository,
    {
      deleteObject: async objectKey => {
        deletedObjects.push(objectKey)
      },
    },
    { now: () => now },
  ).execute()
  if (cleanup.deleted.length !== 1 || deletedObjects.length !== 1) {
    throw new Error('Orphan cleanup did not delete exactly one old pending media object')
  }

  const [due, future, oldMedia, newMedia] = await Promise.all([
    database
      .select({ state: documentLocalization.state })
      .from(documentLocalization)
      .where(eq(documentLocalization.documentId, dueDocumentId)),
    database
      .select({ state: documentLocalization.state })
      .from(documentLocalization)
      .where(eq(documentLocalization.documentId, futureDocumentId)),
    database.select().from(media).where(eq(media.id, oldMediaId)),
    database.select().from(media).where(eq(media.id, newMediaId)),
  ])
  if (
    due[0]?.state !== 'PUBLISHED' ||
    future[0]?.state !== 'SCHEDULED' ||
    oldMedia.length !== 0 ||
    newMedia.length !== 1
  ) {
    throw new Error('Content operations persistence verification failed')
  }
  console.log('Scheduled publication, cache invalidation, and orphan cleanup are ready')
} finally {
  await database.delete(media).where(and(eq(media.createdBy, userId), eq(media.status, 'PENDING')))
  await database.delete(document).where(eq(document.authorId, userId))
  await database.delete(user).where(eq(user.id, userId))
  await closeDatabase()
}
