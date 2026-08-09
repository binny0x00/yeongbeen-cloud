import { and, eq } from 'drizzle-orm'
import { z } from 'zod/v4'

import { getDatabase } from '@content-domain/infrastructure/drizzle/database'
import { media } from '@content-domain/infrastructure/drizzle/schema'

export default defineEventHandler(async event => {
  const session = await requirePermission(event, 'content:write')
  const parsed = z
    .object({ alt: z.string().max(300), caption: z.string().max(500), mediaId: z.string().uuid() })
    .safeParse(await readBody(event))
  if (!parsed.success)
    throw createError({ statusCode: 400, statusMessage: 'Invalid media completion' })
  const [updated] = await getDatabase()
    .update(media)
    .set({ alt: parsed.data.alt, caption: parsed.data.caption, status: 'READY' })
    .where(and(eq(media.id, parsed.data.mediaId), eq(media.createdBy, session.user.id)))
    .returning()
  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Media not found' })
  return updated
})
