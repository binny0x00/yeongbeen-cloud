<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'

import { editorExtensions } from '@content-domain/editor/extensions'
import { editorJsonToMarkdown, markdownToEditorJson } from '@content-domain/editor/markdown'

const model = defineModel<Record<string, unknown>>({ required: true })
const props = defineProps<{ locale: 'ko' | 'en' }>()
const { t } = useI18n()
const uploadProgress = ref<number | null>(null)
const uploadError = ref('')
const failedFiles = ref<File[]>([])
const pendingUploadNodes = ref<Record<string, unknown>[]>([])
const slashOpen = ref(false)

const editor = useEditor({
  content: model.value,
  editorProps: {
    attributes: { class: 'editor-surface min-h-[480px] outline-none' },
    handleKeyDown: (_view, event) => {
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        slashOpen.value = true
        return true
      }
      if (event.key === 'Escape' && slashOpen.value) {
        slashOpen.value = false
        return true
      }
      return false
    },
  },
  extensions: editorExtensions({
    placeholder: props.locale === 'ko' ? '당신의 서사를 시작하세요…' : 'Start your story…',
  }),
  onUpdate: ({ editor }) => {
    model.value = editor.getJSON()
  },
})

watch(
  model,
  value => {
    if (!editor.value || JSON.stringify(editor.value.getJSON()) === JSON.stringify(value)) return
    editor.value.commands.setContent(value)
  },
  { deep: true },
)

onBeforeUnmount(() => editor.value?.destroy())

function insert(type: string): void {
  const chain = editor.value?.chain().focus()
  if (!chain) return
  if (type === 'callout')
    chain
      .insertContent({
        type: 'callout',
        attrs: { tone: 'info' },
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Callout' }] }],
      })
      .run()
  if (type === 'table') chain.insertTable({ cols: 3, rows: 3, withHeaderRow: true }).run()
  if (type === 'mermaidBlock')
    chain
      .insertContent({
        type,
        attrs: { code: window.prompt('Mermaid source', 'graph TD\nA[Start] --> B[End]') ?? '' },
      })
      .run()
  if (type === 'mathBlock')
    chain
      .insertContent({ type, attrs: { code: window.prompt('LaTeX source', 'E = mc^2') ?? '' } })
      .run()
  if (type === 'videoEmbed') {
    const url = window.prompt('Video URL')
    if (url) chain.insertContent({ type, attrs: { label: 'Video', url } }).run()
  }
  if (type === 'footnote')
    chain
      .insertContent({ type, attrs: { label: '1', text: window.prompt('Footnote') ?? '' } })
      .run()
}

function setLink(): void {
  const url = window.prompt('Link URL', editor.value?.getAttributes('link').href ?? 'https://')
  if (url === null) return
  if (!url) editor.value?.chain().focus().unsetLink().run()
  else editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

function exportMarkdown(): void {
  const markdown = editorJsonToMarkdown(model.value)
  const anchor = document.createElement('a')
  anchor.href = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown' }))
  anchor.download = `document-${props.locale}.md`
  anchor.click()
  URL.revokeObjectURL(anchor.href)
}

async function importMarkdown(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  model.value = markdownToEditorJson(await file.text())
}

function putFile(uploadUrl: string, file: File, attempt = 1): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('PUT', uploadUrl)
    request.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
    request.upload.addEventListener('progress', event => {
      if (event.lengthComputable)
        uploadProgress.value = Math.max(5, Math.round((event.loaded / event.total) * 90))
    })
    request.addEventListener('load', () => {
      if (request.status >= 200 && request.status < 300) resolve()
      else if (attempt < 3) void putFile(uploadUrl, file, attempt + 1).then(resolve, reject)
      else reject(new Error(`Upload failed (${request.status})`))
    })
    request.addEventListener('error', () => {
      if (attempt < 3) void putFile(uploadUrl, file, attempt + 1).then(resolve, reject)
      else reject(new Error('Upload failed'))
    })
    request.send(file)
  })
}

async function uploadFile(file: File): Promise<Record<string, unknown>> {
  const signed = await $fetch<{ mediaId: string; publicUrl: string; uploadUrl: string }>(
    '/api/v1/admin/media/sign',
    {
      body: {
        filename: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
      },
      method: 'POST',
    },
  )
  await putFile(signed.uploadUrl, file)
  uploadProgress.value = 90
  const alt = window.prompt('대체 텍스트(alt)', file.name) ?? file.name
  const caption = window.prompt('Caption', '') ?? ''
  await $fetch('/api/v1/admin/media/complete', {
    body: { alt, caption, mediaId: signed.mediaId },
    method: 'POST',
  })
  return file.type.startsWith('image/')
    ? { attrs: { alt, src: signed.publicUrl, title: caption }, type: 'image' }
    : {
        attrs: { label: file.name, mimeType: file.type, url: signed.publicUrl },
        type: 'fileAttachment',
      }
}

async function uploadFiles(files: File[], resume = false): Promise<void> {
  uploadError.value = ''
  failedFiles.value = []
  if (!resume) pendingUploadNodes.value = []
  uploadProgress.value = 5
  try {
    for (const [index, file] of files.entries()) {
      try {
        pendingUploadNodes.value.push(await uploadFile(file))
      } catch (error) {
        failedFiles.value = files.slice(index)
        throw error
      }
    }
    const nodes = pendingUploadNodes.value
    const allImages = nodes.length > 1 && nodes.every(node => node.type === 'image')
    editor.value
      ?.chain()
      .focus()
      .insertContent(allImages ? { content: nodes, type: 'mediaGallery' } : nodes)
      .run()
    pendingUploadNodes.value = []
    uploadProgress.value = 100
  } catch (error) {
    uploadError.value = error instanceof Error ? error.message : 'Upload failed'
  } finally {
    window.setTimeout(() => {
      uploadProgress.value = null
    }, 500)
  }
}

async function retryUpload(): Promise<void> {
  if (failedFiles.value.length) await uploadFiles(failedFiles.value, true)
}

async function upload(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  input.value = ''
  if (files.length) await uploadFiles(files)
}
</script>

<template>
  <section class="s3-panel overflow-hidden" :aria-label="`${locale} editor`">
    <RichTextEditorMenus
      v-if="editor"
      :editor="editor"
      :slash-open="slashOpen"
      @close-slash="slashOpen = false"
      @export-markdown="exportMarkdown"
      @import-markdown="importMarkdown"
      @insert="insert"
      @set-link="setLink"
      @upload="upload"
    />
    <p
      v-if="uploadProgress !== null"
      class="type-label border-b border-border px-4 py-2"
      aria-live="polite"
    >
      {{ t('admin.toolbar.uploading') }} {{ uploadProgress }}%
    </p>
    <div
      v-if="uploadError"
      class="flex items-center justify-between gap-3 border-b border-danger px-4 py-2"
      role="alert"
    >
      <span>{{ uploadError }}</span>
      <DsButton variant="secondary" @click="retryUpload">{{ t('admin.toolbar.retry') }}</DsButton>
    </div>
    <EditorContent :editor="editor" class="p-5" />
  </section>
</template>

<style scoped>
.editor-surface :deep(h2) {
  margin: 2rem 0 1rem;
  font-size: 1.75rem;
  font-weight: 700;
}
.editor-surface :deep(p) {
  margin: 0.75rem 0;
  line-height: 1.8;
}
.editor-surface :deep(ul),
.editor-surface :deep(ol) {
  padding-left: 1.5rem;
}
.editor-surface :deep([data-callout]) {
  margin: 1rem 0;
  border-left: 5px solid var(--color-accent);
  background: var(--color-canvas);
  padding: 1rem;
}
.editor-surface :deep(table) {
  width: 100%;
  border-collapse: collapse;
}
.editor-surface :deep([data-gallery]) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 0.75rem;
}
.editor-surface :deep([data-gallery] img) {
  width: 100%;
  height: auto;
}
.editor-surface :deep(td),
.editor-surface :deep(th) {
  border: 1px solid var(--color-border);
  padding: 0.5rem;
}
</style>
