import { TransitionDocument } from '@content-domain/application/admin-documents'
import { z } from 'zod/v4'

export default defineEventHandler(async event => {
  await requirePermission(event, 'content:publish')
  const documentId = getRouterParam(event, 'id')
  const parsed = z.object({ locale: z.enum(['ko', 'en']) }).safeParse(await readBody(event))
  if (!documentId || !parsed.success)
    throw createError({ statusCode: 400, statusMessage: 'Invalid publish request' })
  const result = await new TransitionDocument(adminDocumentRepository).execute({
    documentId,
    locale: parsed.data.locale,
    state: 'PUBLISHED',
  })
  if (!result) throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  return result
})
