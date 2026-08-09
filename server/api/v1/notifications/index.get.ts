export default defineEventHandler(async event => {
  const session = await requireSession(event)
  return engagementRepository.listNotifications(session.user.id)
})
