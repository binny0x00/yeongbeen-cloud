import { aiAssistRequestSchema } from '../../../../../shared/schemas/api/ai-assistance'

export default defineEventHandler(async event => {
  const session = await requirePermission(event, 'content:write')
  const parsed = aiAssistRequestSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({
      data: parsed.error.flatten(),
      statusCode: 400,
      statusMessage: 'Invalid input',
    })
  }
  if (!(await adminDocumentRepository.findById(parsed.data.documentId))) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  }

  try {
    const response = await assistWriting.execute({
      ...parsed.data,
      safetyIdentifier: safetyIdentifier(session.user.id),
      userId: session.user.id,
    })
    return {
      meta: { model: response.model, requestId: response.requestId, usage: response.usage },
      result: response.result,
    }
  } catch (error) {
    throwAiAssistanceError(error)
  }
})
