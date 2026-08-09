export default defineEventHandler(async event => {
  await requirePermission(event, 'content:write')
  return adminDocumentRepository.list()
})
