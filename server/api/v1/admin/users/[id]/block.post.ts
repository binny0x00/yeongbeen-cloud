import { moderationActionSchema } from '../../../../../../shared/schemas/api/engagement'

export default defineEventHandler(async event => {
  const session = await requirePermission(event, 'comment:moderate')
  const userId = getRouterParam(event, 'id')
  const parsed = moderationActionSchema.safeParse(await readBody(event))
  if (!userId || !parsed.success)
    throw createError({ statusCode: 400, statusMessage: 'Invalid block action' })
  if (userId === session.user.id)
    throw createError({ statusCode: 400, statusMessage: 'Cannot block yourself' })
  try {
    await engagementRepository.blockUser({
      blockedBy: session.user.id,
      reason: parsed.data.reason,
      userId,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to block user'
    throw createError({
      statusCode: message === 'User not found' ? 404 : 400,
      statusMessage: message,
    })
  }
  return { blocked: true }
})
