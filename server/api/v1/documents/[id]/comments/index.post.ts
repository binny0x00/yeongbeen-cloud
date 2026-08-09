import { CreateComment } from '@engagement/application/engagement'
import { createCommentSchema } from '../../../../../../shared/schemas/api/engagement'

export default defineEventHandler(async event => {
  const session = await requirePermission(event, 'comment:write')
  const documentId = getRouterParam(event, 'id')
  const parsed = createCommentSchema.safeParse(await readBody(event))
  if (!documentId || !parsed.success)
    throw createError({ statusCode: 400, statusMessage: 'Invalid comment' })
  try {
    setResponseStatus(event, 201)
    return await new CreateComment(
      engagementRepository,
      engagementRateLimit,
      engagementVerification,
      engagementModeration,
    ).execute({
      ...parsed.data,
      authorId: session.user.id,
      documentId,
      ipAddress: getRequestIP(event, { xForwardedFor: true }),
    })
  } catch (error) {
    throwEngagementError(error)
  }
})
