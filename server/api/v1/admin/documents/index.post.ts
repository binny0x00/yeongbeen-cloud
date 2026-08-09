import { CreateDocument } from '@content-domain/application/admin-documents'
import { createDocumentSchema } from '../../../../../shared/schemas/api/admin-document'

export default defineEventHandler(async event => {
  const session = await requirePermission(event, 'content:write')
  const parsed = createDocumentSchema.safeParse(await readBody(event))
  if (!parsed.success)
    throw createError({
      data: parsed.error.flatten(),
      statusCode: 400,
      statusMessage: 'Invalid document',
    })
  setResponseStatus(event, 201)
  return new CreateDocument(adminDocumentRepository).execute({
    ...parsed.data,
    authorId: session.user.id,
  })
})
