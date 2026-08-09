import type { H3Event } from 'h3'

import { GetPublicContent, ListPublicContent } from '@content-domain/application/public-content'
import {
  DrizzlePublicContentRepository,
  PostgresSearchAdapter,
} from '@content-domain/infrastructure/drizzle/postgres-public-content'
import { RedisPublicContentCache } from '@content-domain/infrastructure/redis-public-content-cache'
import type { ListPublicContentInput } from '@content-domain/ports/public-content-repository'
import { publicContentQuerySchema } from '../../shared/schemas/api/content'

const repository = new DrizzlePublicContentRepository()
const listPublicContent = new ListPublicContent(repository, new PostgresSearchAdapter())
const getPublicContent = new GetPublicContent(repository)
const cache = new RedisPublicContentCache()

async function cached<T>(key: string, resolve: () => Promise<T>): Promise<T> {
  if (!process.env.REDIS_URL) return resolve()
  try {
    const hit = await cache.get<T>(key)
    if (hit !== null) return hit
  } catch (error) {
    console.error('Public content cache read failed', error)
  }
  const value = await resolve()
  try {
    await cache.set(key, value, 60)
  } catch (error) {
    console.error('Public content cache write failed', error)
  }
  return value
}

export async function listPublic(event: H3Event, kind: ListPublicContentInput['kind']) {
  const parsed = publicContentQuerySchema.safeParse(getQuery(event))
  if (!parsed.success) {
    throw createError({
      data: parsed.error.flatten(),
      statusCode: 400,
      statusMessage: 'Invalid query',
    })
  }
  setHeader(event, 'Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  const input = { ...parsed.data, kind }
  const key = `list:${Buffer.from(JSON.stringify(input)).toString('base64url')}`
  return cached(key, () => listPublicContent.execute(input))
}

export async function getPublic(event: H3Event, kind: ListPublicContentInput['kind']) {
  const slug = getRouterParam(event, 'slug')
  const locale = String(getQuery(event).locale ?? 'ko')
  if (!slug || (locale !== 'ko' && locale !== 'en')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid slug or locale' })
  }
  const item = await cached(`detail:${kind}:${locale}:${slug}`, () =>
    getPublicContent.execute(kind, locale, slug),
  )
  if (!item) throw createError({ statusCode: 404, statusMessage: 'Content not found' })
  setHeader(event, 'Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  return item
}
