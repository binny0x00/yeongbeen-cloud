import { generateHTML } from '@tiptap/html'
import sanitizeHtml from 'sanitize-html'

import { editorExtensions } from './extensions'

export function renderEditorHtml(content: Record<string, unknown>): string {
  const html = generateHTML(content, editorExtensions())
  return sanitizeHtml(html, {
    allowedAttributes: {
      '*': ['class', 'data-*'],
      a: ['href', 'rel', 'target'],
      img: ['alt', 'height', 'loading', 'src', 'title', 'width'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'aside',
      'figure',
      'figcaption',
      'img',
      'mark',
      'sup',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ]),
  })
}

export function editorSearchText(content: Record<string, unknown>): string {
  const values: string[] = []
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const value = node as { attrs?: Record<string, unknown>; content?: unknown[]; text?: unknown }
    if (typeof value.text === 'string') values.push(value.text)
    for (const key of ['alt', 'code', 'label'] as const) {
      const attribute = value.attrs?.[key]
      if (typeof attribute === 'string') values.push(attribute)
    }
    value.content?.forEach(walk)
  }
  walk(content)
  return values.join(' ').replace(/\s+/g, ' ').trim()
}
