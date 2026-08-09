import { notificationReadSchema } from '../../../../shared/schemas/api/engagement'

export default defineEventHandler(async event => {
  const session = await requireSession(event)
  const parsed = notificationReadSchema.safeParse(await readBody(event))
  if (!parsed.success)
    throw createError({ statusCode: 400, statusMessage: 'Invalid notification request' })
  return {
    updated: await engagementRepository.markNotificationsRead(session.user.id, parsed.data.ids),
  }
})
