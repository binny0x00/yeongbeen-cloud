import { SaveLocalization } from '@content-domain/application/admin-documents'
import { saveLocalizationSchema } from '../../../../../../shared/schemas/api/admin-document'

export default defineEventHandler(async event => {
  const session = await requirePermission(event, 'content:write')
  const documentId = getRouterParam(event, 'id')
  if (!documentId) throw createError({ statusCode: 400, statusMessage: 'Document id required' })
  const parsed = saveLocalizationSchema.safeParse(await readBody(event))
  if (!parsed.success)
    throw createError({
      data: parsed.error.flatten(),
      statusCode: 400,
      statusMessage: 'Invalid content',
    })
  const result = await new SaveLocalization(adminDocumentRepository).execute({
    ...parsed.data,
    documentId,
    userId: session.user.id,
  })
  if (result.status === 'conflict') {
    throw createError({
      data: { currentVersion: result.currentVersion },
      statusCode: 409,
      statusMessage: 'Version conflict',
    })
  }
  await invalidatePublicContentCache()
  return result.localization
})
