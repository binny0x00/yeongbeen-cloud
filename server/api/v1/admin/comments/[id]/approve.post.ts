export default defineEventHandler(async event => {
  const session = await requirePermission(event, 'comment:moderate')
  const commentId = getRouterParam(event, 'id')
  if (!commentId) throw createError({ statusCode: 400, statusMessage: 'Comment id required' })
  const approved = await engagementRepository.approveComment({
    actorId: session.user.id,
    commentId,
  })
  if (!approved) throw createError({ statusCode: 404, statusMessage: 'Pending comment not found' })
  return { approved: true }
})
