import { describe, expect, it } from 'vitest'

import { editorJsonToMarkdown, markdownToEditorJson } from '../../layers/content/editor/markdown'
import { editorSearchText, renderEditorHtml } from '../../layers/content/editor/render'

const document = {
  content: [
    { content: [{ text: 'Sprint 3', type: 'text' }], type: 'heading', attrs: { level: 2 } },
    { content: [{ text: '안전한 본문', type: 'text' }], type: 'paragraph' },
  ],
  type: 'doc',
}

describe('editor persistence pipeline', () => {
  it('renders and sanitizes Tiptap JSON on the server', () => {
    const html = renderEditorHtml(document)
    expect(html).toContain('<h2>Sprint 3</h2>')
    expect(html).toContain('<p>안전한 본문</p>')
    expect(html).not.toContain('<script')
    expect(editorSearchText(document)).toBe('Sprint 3 안전한 본문')
  })

  it('supports Markdown import and export without changing the canonical JSON format', () => {
    const imported = markdownToEditorJson('## Title\n\nParagraph\n\n- One\n- Two')
    expect(imported).toMatchObject({ type: 'doc' })
    const markdown = editorJsonToMarkdown(imported)
    expect(markdown).toContain('## Title')
    expect(markdown).toContain('- One')
  })

  it('renders custom blocks while removing unsafe link schemes', () => {
    const customDocument = {
      content: [
        {
          attrs: { label: 'Download', mimeType: 'text/plain', url: 'javascript:alert(1)' },
          type: 'fileAttachment',
        },
        { attrs: { code: 'graph TD\nA-->B' }, type: 'mermaidBlock' },
      ],
      type: 'doc',
    }
    const html = renderEditorHtml(customDocument)
    expect(html).toContain('Download')
    expect(html).toContain('graph TD')
    expect(html).not.toContain('javascript:')
    expect(editorSearchText(customDocument)).toBe('Download graph TD A-->B')
  })
})
