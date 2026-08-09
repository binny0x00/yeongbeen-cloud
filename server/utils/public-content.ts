import type { H3Event } from 'h3'

import { GetPublicContent, ListPublicContent } from '@content-domain/application/public-content'
import {
  DrizzlePublicContentRepository,
  PostgresSearchAdapter,
} from '@content-domain/infrastructure/drizzle/postgres-public-content'
import type { ListPublicContentInput } from '@content-domain/ports/public-content-repository'
import { publicContentQuerySchema } from '../../shared/schemas/api/content'

const repository = new DrizzlePublicContentRepository()
const listPublicContent = new ListPublicContent(repository, new PostgresSearchAdapter())
const getPublicContent = new GetPublicContent(repository)

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
  return listPublicContent.execute({ ...parsed.data, kind })
}

export async function getPublic(event: H3Event, kind: ListPublicContentInput['kind']) {
  const slug = getRouterParam(event, 'slug')
  const locale = String(getQuery(event).locale ?? 'ko')
  if (!slug || (locale !== 'ko' && locale !== 'en')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid slug or locale' })
  }
  const item = await getPublicContent.execute(kind, locale, slug)
  if (!item) throw createError({ statusCode: 404, statusMessage: 'Content not found' })
  setHeader(event, 'Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  return item
}
