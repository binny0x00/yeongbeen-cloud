import { ReportComment } from '@engagement/application/engagement'
import { reportCommentSchema } from '../../../../../shared/schemas/api/engagement'

export default defineEventHandler(async event => {
  const session = await requirePermission(event, 'comment:write')
  const commentId = getRouterParam(event, 'id')
  const parsed = reportCommentSchema.safeParse(await readBody(event))
  if (!commentId || !parsed.success)
    throw createError({ statusCode: 400, statusMessage: 'Invalid report' })
  try {
    await new ReportComment(engagementRepository, engagementRateLimit).execute({
      commentId,
      reason: parsed.data.reason,
      reporterId: session.user.id,
    })
    setResponseStatus(event, 204)
    return null
  } catch (error) {
    throwEngagementError(error)
  }
})
