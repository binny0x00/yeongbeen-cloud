export default defineEventHandler(async event => {
  requireCronSecret(event)
  return publishScheduledContent.execute()
})
