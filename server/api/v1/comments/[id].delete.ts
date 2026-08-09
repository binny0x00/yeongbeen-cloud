import { RolePolicy } from '@identity/domain/role-policy'

export default defineEventHandler(async event => {
  const session = await requireSession(event)
  const commentId = getRouterParam(event, 'id')
  if (!commentId) throw createError({ statusCode: 400, statusMessage: 'Comment id required' })
  try {
    const deleted = await engagementRepository.deleteComment({
      actorId: session.user.id,
      canModerate: new RolePolicy().allows(session.user.role, 'comment:moderate'),
      commentId,
    })
    if (!deleted) throw createError({ statusCode: 404, statusMessage: 'Comment not found' })
    setResponseStatus(event, 204)
    return null
  } catch (error) {
    if (error instanceof Error && error.message === 'Comment permission denied')
      throw createError({ statusCode: 403, statusMessage: error.message })
    throw error
  }
})
