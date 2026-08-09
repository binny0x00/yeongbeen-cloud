import { DrizzlePublicContentRepository } from '@content-domain/infrastructure/drizzle/postgres-public-content'

function escapeXml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

export default defineEventHandler(async event => {
  const repository = new DrizzlePublicContentRepository()
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')
  const page = await repository.list({ kind: 'POST', limit: 50, locale: 'ko', sort: 'recent' })
  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=300, stale-while-revalidate=3600')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>Yeongbeen Cloud Posts</title>
  <link>${siteUrl}/ko/posts</link>
  <description>프로젝트, 스터디와 기술 기록</description>
${page.items
  .map(
    item => `  <item>
    <title>${escapeXml(item.title)}</title>
    <link>${siteUrl}/ko/posts/${escapeXml(item.slug)}</link>
    <guid>${siteUrl}/ko/posts/${escapeXml(item.slug)}</guid>
    <description>${escapeXml(item.summary)}</description>
    ${item.publishedAt ? `<pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>` : ''}
  </item>`,
  )
  .join('\n')}
</channel></rss>`
})
