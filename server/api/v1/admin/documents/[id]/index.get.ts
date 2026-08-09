export default defineEventHandler(async event => {
  await requirePermission(event, 'content:write')
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Document id required' })
  const result = await adminDocumentRepository.findById(id)
  if (!result) throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  return result
})
