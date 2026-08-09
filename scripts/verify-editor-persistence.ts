import { eq } from 'drizzle-orm'

import { DrizzleAdminDocumentRepository } from '../layers/content/infrastructure/drizzle/drizzle-admin-document-repository'
import { closeDatabase, getDatabase } from '../layers/content/infrastructure/drizzle/database'
import { document, user } from '../layers/content/infrastructure/drizzle/schema'

const verifierId = `editor-verifier-${Date.now()}`
const database = getDatabase()
const repository = new DrizzleAdminDocumentRepository()
let documentId: string | undefined

try {
  await database.insert(user).values({
    email: `${verifierId}@example.test`,
    emailVerified: true,
    id: verifierId,
    name: 'Editor Verifier',
    role: 'OWNER',
  })

  const created = await repository.create({
    authorId: verifierId,
    kind: 'POST',
    locale: 'ko',
    slug: verifierId,
    summary: 'Persistence verification',
    title: 'Editor verification',
  })
  documentId = created.id
  const korean = created.localizations.find(localization => localization.locale === 'ko')
  if (!korean) throw new Error('Korean localization was not created')

  const contentJson = {
    content: [{ content: [{ text: 'Version two', type: 'text' }], type: 'paragraph' }],
    type: 'doc',
  }
  const saved = await repository.save({
    contentJson,
    documentId,
    locale: 'ko',
    seo: { title: 'Version two' },
    slug: verifierId,
    summary: 'Version two',
    title: 'Version two',
    userId: verifierId,
    version: korean.version,
  })
  if (saved.status !== 'saved' || saved.localization.version !== korean.version + 1)
    throw new Error('Versioned save failed')

  const conflict = await repository.save({
    contentJson,
    documentId,
    locale: 'ko',
    seo: {},
    slug: verifierId,
    summary: 'Stale write',
    title: 'Stale write',
    userId: verifierId,
    version: korean.version,
  })
  if (conflict.status !== 'conflict' || conflict.currentVersion !== saved.localization.version)
    throw new Error('Optimistic conflict detection failed')

  const persisted = await repository.findById(documentId)
  const firstRevision = persisted?.revisions.find(revision => revision.locale === 'ko')
  if (!firstRevision || firstRevision.version !== korean.version)
    throw new Error('Revision snapshot was not created')

  const restored = await repository.restore({
    documentId,
    revisionId: firstRevision.id,
    userId: verifierId,
  })
  if (!restored || restored.version !== saved.localization.version + 1)
    throw new Error('Revision restore failed')

  console.log('Editor save, conflict detection, revision snapshot, and restore are ready')
} finally {
  if (documentId) await database.delete(document).where(eq(document.id, documentId))
  await database.delete(user).where(eq(user.id, verifierId))
  await closeDatabase()
}
