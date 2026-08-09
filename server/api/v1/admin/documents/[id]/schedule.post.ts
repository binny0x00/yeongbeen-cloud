import { TransitionDocument } from '@content-domain/application/admin-documents'
import { scheduleDocumentSchema } from '../../../../../../shared/schemas/api/admin-document'

export default defineEventHandler(async event => {
  await requirePermission(event, 'content:publish')
  const documentId = getRouterParam(event, 'id')
  const parsed = scheduleDocumentSchema.safeParse(await readBody(event))
  if (!documentId || !parsed.success)
    throw createError({ statusCode: 400, statusMessage: 'Invalid schedule request' })
  const result = await new TransitionDocument(adminDocumentRepository).execute({
    documentId,
    locale: parsed.data.locale,
    scheduledAt: parsed.data.scheduledAt,
    state: 'SCHEDULED',
  })
  if (!result) throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  await invalidatePublicContentCache()
  return result
})
