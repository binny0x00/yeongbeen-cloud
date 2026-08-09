import { moderationActionSchema } from '../../../../../../shared/schemas/api/engagement'

export default defineEventHandler(async event => {
  const session = await requirePermission(event, 'comment:moderate')
  const commentId = getRouterParam(event, 'id')
  const parsed = moderationActionSchema.safeParse(await readBody(event))
  if (!commentId || !parsed.success)
    throw createError({ statusCode: 400, statusMessage: 'Invalid moderation action' })
  const hidden = await engagementRepository.hideComment({
    actorId: session.user.id,
    commentId,
    reason: parsed.data.reason,
  })
  if (!hidden) throw createError({ statusCode: 404, statusMessage: 'Comment not found' })
  return { hidden: true }
})
