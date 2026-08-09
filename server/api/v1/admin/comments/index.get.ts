export default defineEventHandler(async event => {
  await requirePermission(event, 'comment:moderate')
  return engagementRepository.listModerationQueue()
})
