type EditorNode = {
  attrs?: Record<string, unknown>
  content?: EditorNode[]
  text?: string
  type?: string
}

function inline(nodes: EditorNode[] = []): string {
  return nodes.map(node => node.text ?? inline(node.content)).join('')
}

export function editorJsonToMarkdown(document: Record<string, unknown>): string {
  const root = document as EditorNode
  const lines: string[] = []
  for (const node of root.content ?? []) {
    if (node.type === 'heading')
      lines.push(`${'#'.repeat(Number(node.attrs?.level ?? 2))} ${inline(node.content)}`)
    else if (node.type === 'bulletList') {
      for (const item of node.content ?? []) lines.push(`- ${inline(item.content)}`)
    } else if (node.type === 'orderedList') {
      for (const [index, item] of (node.content ?? []).entries())
        lines.push(`${index + 1}. ${inline(item.content)}`)
    } else if (node.type === 'codeBlock') lines.push(`\`\`\`\n${inline(node.content)}\n\`\`\``)
    else if (node.type === 'blockquote') lines.push(`> ${inline(node.content)}`)
    else if (node.type === 'horizontalRule') lines.push('---')
    else lines.push(inline(node.content) || String(node.attrs?.code ?? ''))
  }
  return lines.join('\n\n').trim()
}

export function markdownToEditorJson(markdown: string): Record<string, unknown> {
  const content: EditorNode[] = []
  let list: EditorNode[] = []
  const flush = () => {
    if (list.length) content.push({ content: list, type: 'bulletList' })
    list = []
  }
  for (const source of markdown.split(/\r?\n/)) {
    const line = source.trim()
    if (!line) {
      flush()
      continue
    }
    const heading = /^(#{1,6})\s+(.+)$/.exec(line)
    if (heading) {
      flush()
      content.push({
        attrs: { level: heading[1]?.length ?? 2 },
        content: [{ text: heading[2] ?? '', type: 'text' }],
        type: 'heading',
      })
    } else if (/^[-*]\s+/.test(line)) {
      list.push({
        content: [
          { content: [{ text: line.replace(/^[-*]\s+/, ''), type: 'text' }], type: 'paragraph' },
        ],
        type: 'listItem',
      })
    } else {
      flush()
      content.push({ content: [{ text: line, type: 'text' }], type: 'paragraph' })
    }
  }
  flush()
  return { content, type: 'doc' }
}
