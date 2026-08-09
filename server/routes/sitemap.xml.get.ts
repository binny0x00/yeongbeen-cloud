import { DrizzlePublicContentRepository } from '@content-domain/infrastructure/drizzle/postgres-public-content'

function escapeXml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

export default defineEventHandler(async event => {
  const repository = new DrizzlePublicContentRepository()
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')
  const staticPaths = ['', '/portfolio', '/posts', '/about', '/login']
  const urls: string[] = []

  for (const locale of ['ko', 'en'] as const) {
    for (const path of staticPaths) urls.push(`${siteUrl}/${locale}${path}`)
    for (const kind of ['PORTFOLIO', 'POST'] as const) {
      const page = await repository.list({ kind, limit: 50, locale, sort: 'recent' })
      const segment = kind === 'POST' ? 'posts' : 'portfolio'
      for (const item of page.items) urls.push(`${siteUrl}/${locale}/${segment}/${item.slug}`)
    }
  }

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=300, stale-while-revalidate=3600')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n')}
</urlset>`
})
