import { EditComment } from '@engagement/application/engagement'
import { editCommentSchema } from '../../../../shared/schemas/api/engagement'

export default defineEventHandler(async event => {
  const session = await requirePermission(event, 'comment:write')
  const commentId = getRouterParam(event, 'id')
  const parsed = editCommentSchema.safeParse(await readBody(event))
  if (!commentId || !parsed.success)
    throw createError({ statusCode: 400, statusMessage: 'Invalid comment edit' })
  try {
    return await new EditComment(
      engagementRepository,
      engagementRateLimit,
      engagementModeration,
    ).execute({ actorId: session.user.id, body: parsed.data.body, commentId })
  } catch (error) {
    throwEngagementError(error)
  }
})
