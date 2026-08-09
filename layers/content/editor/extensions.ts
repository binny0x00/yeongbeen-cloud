import { mergeAttributes, Node } from '@tiptap/core'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'

const Callout = Node.create({
  addAttributes: () => ({ tone: { default: 'info' } }),
  content: 'block+',
  defining: true,
  group: 'block',
  name: 'callout',
  parseHTML: () => [{ tag: 'aside[data-callout]' }],
  renderHTML: ({ HTMLAttributes }) => [
    'aside',
    mergeAttributes(HTMLAttributes, { 'data-callout': HTMLAttributes.tone }),
    0,
  ],
})

const MediaGallery = Node.create({
  content: 'image+',
  group: 'block',
  name: 'mediaGallery',
  parseHTML: () => [{ tag: 'div[data-gallery]' }],
  renderHTML: ({ HTMLAttributes }) => [
    'div',
    mergeAttributes(HTMLAttributes, { 'data-gallery': '' }),
    0,
  ],
})

function atomNode(name: string, tag: string, attributes: Record<string, unknown>) {
  return Node.create({
    addAttributes: () => attributes,
    atom: true,
    group: 'block',
    name,
    parseHTML: () => [{ tag: `${tag}[data-node-type="${name}"]` }],
    renderHTML: ({ HTMLAttributes }) => {
      const { url, ...attributesWithoutUrl } = HTMLAttributes
      const nodeAttributes = mergeAttributes(attributesWithoutUrl, { 'data-node-type': name })
      if (name === 'fileAttachment')
        return [
          'a',
          mergeAttributes(nodeAttributes, {
            href: url,
            rel: 'noopener noreferrer',
            target: '_blank',
          }),
          HTMLAttributes.label,
        ]
      if (name === 'videoEmbed')
        return [
          'figure',
          nodeAttributes,
          ['a', { href: url, rel: 'noopener noreferrer', target: '_blank' }, HTMLAttributes.label],
        ]
      return [tag, nodeAttributes, HTMLAttributes.label ?? HTMLAttributes.code ?? name]
    },
  })
}

const FileAttachment = atomNode('fileAttachment', 'a', {
  label: { default: 'Download file' },
  mimeType: { default: 'application/octet-stream' },
  url: {
    default: '',
    parseHTML: (element: { getAttribute(name: string): string | null }) =>
      element.getAttribute('href') ?? '',
  },
})
const VideoEmbed = atomNode('videoEmbed', 'figure', {
  label: { default: 'Video' },
  url: {
    default: '',
    parseHTML: (element: {
      querySelector(selector: string): { getAttribute(name: string): string | null } | null
    }) => element.querySelector('a')?.getAttribute('href') ?? '',
  },
})
const MermaidBlock = atomNode('mermaidBlock', 'pre', { code: { default: 'graph TD\nA-->B' } })
const MathBlock = atomNode('mathBlock', 'pre', { code: { default: 'E = mc^2' } })
const Footnote = Node.create({
  addAttributes: () => ({ label: { default: '1' }, text: { default: '' } }),
  atom: true,
  group: 'inline',
  inline: true,
  name: 'footnote',
  parseHTML: () => [{ tag: 'sup[data-footnote]' }],
  renderHTML: ({ HTMLAttributes }) => [
    'sup',
    mergeAttributes(HTMLAttributes, { 'data-footnote': HTMLAttributes.text }),
    `[${HTMLAttributes.label}]`,
  ],
})

export function editorExtensions(options: { placeholder?: string } = {}) {
  return [
    StarterKit.configure({ link: false, underline: false }),
    Underline,
    Highlight.configure({ multicolor: true }),
    Link.configure({ autolink: true, openOnClick: false }),
    Image.configure({ allowBase64: false, inline: false }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    TaskList,
    TaskItem.configure({ nested: true }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Placeholder.configure({
      placeholder: options.placeholder ?? '내용을 입력하거나 / 를 눌러 블록을 추가하세요.',
    }),
    Callout,
    MediaGallery,
    FileAttachment,
    VideoEmbed,
    MermaidBlock,
    MathBlock,
    Footnote,
  ]
}
