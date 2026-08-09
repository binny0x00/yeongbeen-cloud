import { SetDocumentLike } from '@engagement/application/engagement'
import { likeSchema } from '../../../../../shared/schemas/api/engagement'

export default defineEventHandler(async event => {
  const session = await requirePermission(event, 'comment:write')
  const documentId = getRouterParam(event, 'id')
  const parsed = likeSchema.safeParse(await readBody(event))
  if (!documentId || !parsed.success)
    throw createError({ statusCode: 400, statusMessage: 'Invalid like request' })
  try {
    return await new SetDocumentLike(engagementRepository, engagementRateLimit).execute({
      documentId,
      liked: parsed.data.liked,
      userId: session.user.id,
    })
  } catch (error) {
    throwEngagementError(error)
  }
})
