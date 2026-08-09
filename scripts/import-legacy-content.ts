import { createHash } from 'node:crypto'

import { and, eq, inArray, sql } from 'drizzle-orm'

import { closeDatabase, getDatabase } from '../layers/content/infrastructure/drizzle/database'
import {
  careerRecord,
  document,
  documentLocalization,
  documentTag,
  portfolioRecord,
  tag,
  user,
} from '../layers/content/infrastructure/drizzle/schema'
import {
  contentChecksum,
  legacyCareers,
  legacyProjectMetadata,
  loadLegacyProjects,
} from '../layers/content/infrastructure/migration/legacy-content'

const mode = process.argv.includes('--verify')
  ? 'verify'
  : process.argv.includes('--rollback')
    ? 'rollback'
    : 'import'

function ownerEmail(): string {
  const email = (process.env.OWNER_EMAILS ?? '').split(',')[0]?.trim().toLowerCase()
  if (!email) throw new Error('OWNER_EMAILS must contain the initial owner email')
  return email
}

function ownerId(email: string): string {
  return `migration_${createHash('sha256').update(email).digest('hex').slice(0, 24)}`
}

function tagSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function parsePeriod(value: string): { endedAt: Date | null; startedAt: Date | null } {
  const matches = [...value.matchAll(/(\d{4})\.(\d{2})/g)]
  const toDate = (match: RegExpMatchArray | undefined) =>
    match ? new Date(`${match[1]}-${match[2]}-01T00:00:00.000Z`) : null
  return { endedAt: toDate(matches[1]), startedAt: toDate(matches[0]) }
}

async function ensureOwner(email: string): Promise<string> {
  const db = getDatabase()
  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1)
  if (existing) return existing.id

  const id = ownerId(email)
  await db.insert(user).values({
    email,
    emailVerified: true,
    id,
    name: 'Yeongbeen Choi',
    role: 'OWNER',
  })
  return id
}

async function syncTags(documentId: string, names: readonly string[]): Promise<void> {
  const db = getDatabase()
  for (const name of names) {
    const slug = tagSlug(name)
    const [saved] = await db
      .insert(tag)
      .values({ name, slug })
      .onConflictDoUpdate({ set: { name }, target: tag.slug })
      .returning({ id: tag.id })
    if (!saved) throw new Error(`Unable to persist tag: ${name}`)
    await db.insert(documentTag).values({ documentId, tagId: saved.id }).onConflictDoNothing()
  }
}

async function importContent(): Promise<void> {
  const db = getDatabase()
  const authorId = await ensureOwner(ownerEmail())
  const projects = await loadLegacyProjects()

  for (const project of projects) {
    const sourceKey = `legacy:project:${project.slug}`
    const [saved] = await db
      .insert(document)
      .values({
        allowComments: true,
        allowLikes: true,
        authorId,
        kind: 'PORTFOLIO',
        sourceChecksum: project.checksum,
        sourceImportedAt: new Date(),
        sourceKey,
      })
      .onConflictDoUpdate({
        set: { sourceChecksum: project.checksum, sourceImportedAt: new Date() },
        target: document.sourceKey,
      })
      .returning({ id: document.id })
    if (!saved) throw new Error(`Unable to persist ${sourceKey}`)

    const localization = {
      contentJson: project.tiptap,
      documentId: saved.id,
      renderedHtml: project.html,
      searchText: project.searchText,
      seo: { description: project.frontmatter.description, title: project.frontmatter.title },
      slug: project.slug,
      summary: project.frontmatter.description,
      title: project.frontmatter.title,
    }
    await db
      .insert(documentLocalization)
      .values({
        ...localization,
        locale: 'ko',
        publishedAt: project.frontmatter.publishedAt,
        state: 'PUBLISHED',
      })
      .onConflictDoUpdate({
        set: { ...localization, publishedAt: project.frontmatter.publishedAt, state: 'PUBLISHED' },
        target: [documentLocalization.documentId, documentLocalization.locale],
      })
    await db
      .insert(documentLocalization)
      .values({ ...localization, locale: 'en', state: 'DRAFT' })
      .onConflictDoUpdate({
        set: { ...localization, state: 'DRAFT' },
        target: [documentLocalization.documentId, documentLocalization.locale],
      })

    const period = parsePeriod(project.frontmatter.period)
    await db
      .insert(portfolioRecord)
      .values({
        documentId: saved.id,
        endedAt: period.endedAt,
        metadata: {
          ...legacyProjectMetadata[project.slug],
          category: project.frontmatter.category,
          featured: project.frontmatter.featured,
          order: project.frontmatter.order,
          period: project.frontmatter.period,
          repository: project.frontmatter.repository,
          role: project.frontmatter.role,
          status: project.frontmatter.status,
          website: project.frontmatter.website,
          youtube: project.frontmatter.youtube,
        },
        organization: project.frontmatter.category,
        recordType: 'PROJECT',
        startedAt: period.startedAt,
      })
      .onConflictDoUpdate({
        set: {
          endedAt: period.endedAt,
          metadata: sql`excluded.metadata`,
          organization: project.frontmatter.category,
          startedAt: period.startedAt,
        },
        target: portfolioRecord.documentId,
      })
    await syncTags(saved.id, project.frontmatter.tags)
  }

  for (const career of legacyCareers) {
    const sourceKey = `legacy:career:${career.slug}`
    const checksum = contentChecksum(career)
    const [saved] = await db
      .insert(document)
      .values({
        allowComments: false,
        allowLikes: false,
        authorId,
        kind: 'CAREER',
        sourceChecksum: checksum,
        sourceImportedAt: new Date(),
        sourceKey,
      })
      .onConflictDoUpdate({
        set: { sourceChecksum: checksum, sourceImportedAt: new Date() },
        target: document.sourceKey,
      })
      .returning({ id: document.id })
    if (!saved) throw new Error(`Unable to persist ${sourceKey}`)

    const contentJson = {
      content: [{ content: [{ text: career.description, type: 'text' }], type: 'paragraph' }],
      type: 'doc',
    }
    for (const locale of ['ko', 'en'] as const) {
      await db
        .insert(documentLocalization)
        .values({
          contentJson,
          documentId: saved.id,
          locale,
          searchText: `${career.title} ${career.description} ${career.technologies.join(' ')}`,
          slug: career.slug,
          state: locale === 'ko' ? 'PUBLISHED' : 'DRAFT',
          summary: career.description,
          title: career.title,
        })
        .onConflictDoUpdate({
          set: {
            contentJson,
            searchText: `${career.title} ${career.description} ${career.technologies.join(' ')}`,
            state: locale === 'ko' ? 'PUBLISHED' : 'DRAFT',
            summary: career.description,
            title: career.title,
          },
          target: [documentLocalization.documentId, documentLocalization.locale],
        })
    }
    const period = parsePeriod(career.period)
    await db
      .insert(careerRecord)
      .values({
        documentId: saved.id,
        endedAt: period.endedAt,
        organization: career.organization,
        recordType: 'PROGRAM',
        role: career.role,
        startedAt: period.startedAt,
      })
      .onConflictDoUpdate({
        set: {
          endedAt: period.endedAt,
          organization: career.organization,
          role: career.role,
          startedAt: period.startedAt,
        },
        target: careerRecord.documentId,
      })
    await syncTags(saved.id, career.technologies)
  }
}

async function verifyContent(): Promise<void> {
  const db = getDatabase()
  const projects = await loadLegacyProjects()
  const sources = [
    ...projects.map(project => `legacy:project:${project.slug}`),
    ...legacyCareers.map(career => `legacy:career:${career.slug}`),
  ]
  const rows = await db
    .select({ checksum: document.sourceChecksum, sourceKey: document.sourceKey })
    .from(document)
    .where(inArray(document.sourceKey, sources))
  if (rows.length !== sources.length) {
    throw new Error(`Expected ${sources.length} imported documents, found ${rows.length}`)
  }

  const expectedChecksums = new Map([
    ...projects.map(project => [`legacy:project:${project.slug}`, project.checksum] as const),
    ...legacyCareers.map(
      career => [`legacy:career:${career.slug}`, contentChecksum(career)] as const,
    ),
  ])
  for (const row of rows) {
    if (!row.sourceKey || expectedChecksums.get(row.sourceKey) !== row.checksum) {
      throw new Error(`Checksum mismatch: ${row.sourceKey ?? 'unknown source'}`)
    }
  }

  const [{ localizationCount }] = await db
    .select({ localizationCount: sql<number>`count(*)::integer` })
    .from(documentLocalization)
    .innerJoin(document, eq(document.id, documentLocalization.documentId))
    .where(
      and(inArray(document.sourceKey, sources), inArray(documentLocalization.locale, ['ko', 'en'])),
    )
  if (localizationCount !== sources.length * 2) {
    throw new Error(`Expected ${sources.length * 2} localizations, found ${localizationCount}`)
  }
  console.log(`Verified ${rows.length} documents and ${localizationCount} localizations`)
}

async function rollbackContent(): Promise<void> {
  const db = getDatabase()
  const rows = await db
    .delete(document)
    .where(sql`${document.sourceKey} LIKE 'legacy:%'`)
    .returning({ id: document.id })
  console.log(`Rolled back ${rows.length} legacy documents`)
}

try {
  if (mode === 'import') await importContent()
  if (mode === 'verify') await verifyContent()
  if (mode === 'rollback') await rollbackContent()
} finally {
  await closeDatabase()
}
