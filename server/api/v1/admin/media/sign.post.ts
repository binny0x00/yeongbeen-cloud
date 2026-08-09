import { randomUUID } from 'node:crypto'

import { R2MediaStorage } from '@content-domain/infrastructure/r2-media-storage'
import { getDatabase } from '@content-domain/infrastructure/drizzle/database'
import { media } from '@content-domain/infrastructure/drizzle/schema'
import { mediaSignSchema } from '../../../../../shared/schemas/api/admin-document'

export default defineEventHandler(async event => {
  const session = await requirePermission(event, 'content:write')
  const parsed = mediaSignSchema.safeParse(await readBody(event))
  if (!parsed.success)
    throw createError({
      data: parsed.error.flatten(),
      statusCode: 400,
      statusMessage: 'Invalid media',
    })
  const extension =
    parsed.data.filename
      .split('.')
      .pop()
      ?.replace(/[^a-z0-9]/gi, '')
      .toLowerCase() || 'bin'
  const objectKey = `media/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`
  const signed = await new R2MediaStorage().signUpload({ ...parsed.data, objectKey })
  const [record] = await getDatabase()
    .insert(media)
    .values({
      createdBy: session.user.id,
      mimeType: parsed.data.mimeType,
      objectKey,
      size: parsed.data.size,
    })
    .returning({ id: media.id })
  if (!record) throw createError({ statusCode: 500, statusMessage: 'Unable to create media' })
  return { ...signed, mediaId: record.id, objectKey }
})
