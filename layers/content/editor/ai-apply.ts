interface EditorNode {
  attrs?: Record<string, unknown>
  content?: EditorNode[]
  type?: string
}

export function withFirstImageAlt(
  document: Record<string, unknown>,
  altText: string,
): { document: Record<string, unknown>; updated: boolean } {
  const copy = JSON.parse(JSON.stringify(document)) as EditorNode
  let updated = false

  function visit(node: EditorNode): void {
    if (updated) return
    if (node.type === 'image') {
      node.attrs = { ...node.attrs, alt: altText }
      updated = true
      return
    }
    node.content?.forEach(visit)
  }

  visit(copy)
  return { document: copy as Record<string, unknown>, updated }
}
