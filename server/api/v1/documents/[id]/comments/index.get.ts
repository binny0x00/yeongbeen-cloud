import { z } from 'zod/v4'

import { commentQuerySchema } from '../../../../../../shared/schemas/api/engagement'

export default defineEventHandler(async event => {
  const documentId = z.string().uuid().safeParse(getRouterParam(event, 'id'))
  const query = commentQuerySchema.safeParse(getQuery(event))
  if (!documentId.success || !query.success)
    throw createError({ statusCode: 400, statusMessage: 'Invalid comment query' })
  const session = await optionalSession(event)
  return engagementRepository.listComments(documentId.data, query.data.locale, session?.user.id)
})
