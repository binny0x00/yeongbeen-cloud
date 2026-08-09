import { eq } from 'drizzle-orm'

import { getDatabase } from '../../layers/content/infrastructure/drizzle/database'
import {
  document,
  documentLocalization,
  postRecord,
  user,
} from '../../layers/content/infrastructure/drizzle/schema'

export const SPRINT3_OWNER_ID = 'sprint3-owner'
export const SPRINT3_POST_ID = '30000000-0000-4000-8000-000000000001'

const localizations = [
  {
    id: '30000000-0000-4000-8000-000000000002',
    locale: 'ko' as const,
    slug: 'sprint-3-content-platform',
    summary: '웹툰 감성 디자인 시스템과 대규모 콘텐츠 아키텍처를 함께 설계한 기록입니다.',
    title: 'Sprint 3 콘텐츠 플랫폼',
  },
  {
    id: '30000000-0000-4000-8000-000000000003',
    locale: 'en' as const,
    slug: 'sprint-3-content-platform',
    summary: 'A build log for a webtoon-inspired design system and scalable content architecture.',
    title: 'Sprint 3 Content Platform',
  },
]

export async function seedSprint3(): Promise<void> {
  const database = getDatabase()
  await database
    .insert(user)
    .values({
      email: process.env.SPRINT3_SEED_OWNER_EMAIL ?? 'sprint3-seed@local.invalid',
      emailVerified: true,
      id: SPRINT3_OWNER_ID,
      name: 'Yeongbeen',
      role: 'OWNER',
    })
    .onConflictDoUpdate({
      set: { emailVerified: true, name: 'Yeongbeen', role: 'OWNER', updatedAt: new Date() },
      target: user.id,
    })
  await database
    .insert(document)
    .values({ authorId: SPRINT3_OWNER_ID, id: SPRINT3_POST_ID, kind: 'POST' })
    .onConflictDoUpdate({ set: { kind: 'POST', updatedAt: new Date() }, target: document.id })

  for (const item of localizations) {
    const contentJson = {
      content: [
        {
          content: [{ text: item.summary, type: 'text' }],
          type: 'paragraph',
        },
      ],
      type: 'doc',
    }
    await database
      .insert(documentLocalization)
      .values({
        contentJson,
        documentId: SPRINT3_POST_ID,
        id: item.id,
        locale: item.locale,
        publishedAt: new Date('2026-08-09T00:00:00.000Z'),
        renderedHtml: `<p>${item.summary}</p>`,
        searchText: `${item.title} ${item.summary}`,
        seo: { description: item.summary, title: item.title },
        slug: item.slug,
        state: 'PUBLISHED',
        summary: item.summary,
        title: item.title,
      })
      .onConflictDoUpdate({
        set: {
          contentJson,
          publishedAt: new Date('2026-08-09T00:00:00.000Z'),
          renderedHtml: `<p>${item.summary}</p>`,
          searchText: `${item.title} ${item.summary}`,
          seo: { description: item.summary, title: item.title },
          state: 'PUBLISHED',
          summary: item.summary,
          title: item.title,
          updatedAt: new Date(),
        },
        target: documentLocalization.id,
      })
  }

  const [existingPostRecord] = await database
    .select({ documentId: postRecord.documentId })
    .from(postRecord)
    .where(eq(postRecord.documentId, SPRINT3_POST_ID))
    .limit(1)
  if (!existingPostRecord) {
    await database.insert(postRecord).values({
      category: 'PROJECT',
      documentId: SPRINT3_POST_ID,
      seriesOrder: 3,
      seriesSlug: 'building-yeongbeen-cloud',
    })
  }
}
