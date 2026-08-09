import { z } from 'zod/v4'

export default defineEventHandler(async event => {
  const session = await requirePermission(event, 'content:write')
  const documentId = getRouterParam(event, 'id')
  const parsed = z.object({ revisionId: z.string().uuid() }).safeParse(await readBody(event))
  if (!documentId || !parsed.success)
    throw createError({ statusCode: 400, statusMessage: 'Invalid restore request' })
  const result = await adminDocumentRepository.restore({
    documentId,
    revisionId: parsed.data.revisionId,
    userId: session.user.id,
  })
  if (!result) throw createError({ statusCode: 404, statusMessage: 'Revision not found' })
  await invalidatePublicContentCache()
  return result
})
