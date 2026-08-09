export default defineEventHandler(async event => {
  requireCronSecret(event)
  return cleanupOrphanMedia.execute()
})
