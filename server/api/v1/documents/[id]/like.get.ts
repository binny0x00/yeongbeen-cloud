import { z } from 'zod/v4'

export default defineEventHandler(async event => {
  const documentId = z.string().uuid().safeParse(getRouterParam(event, 'id'))
  if (!documentId.success)
    throw createError({ statusCode: 400, statusMessage: 'Invalid document id' })
  const session = await optionalSession(event)
  return engagementRepository.getLike(documentId.data, session?.user.id)
})
