<script setup lang="ts">
import DragHandle from '@tiptap/extension-drag-handle-vue-3'
import type { Editor } from '@tiptap/vue-3'
import { BubbleMenu, FloatingMenu } from '@tiptap/vue-3/menus'

defineProps<{ editor: Editor; slashOpen: boolean }>()
const emit = defineEmits<{
  closeSlash: []
  exportMarkdown: []
  importMarkdown: [event: Event]
  insert: [type: string]
  setLink: []
  upload: [event: Event]
}>()
const { t } = useI18n()
const fileInput = useTemplateRef<HTMLInputElement>('fileInput')
const markdownInput = useTemplateRef<HTMLInputElement>('markdownInput')

function runSlash(type: string): void {
  emit('insert', type)
  emit('closeSlash')
}
</script>

<template>
  <div
    class="flex flex-wrap gap-1 border-b border-border bg-canvas p-2"
    role="toolbar"
    :aria-label="t('admin.toolbar.formatting')"
  >
    <button
      class="editor-tool"
      type="button"
      :aria-label="t('admin.toolbar.bold')"
      @click="editor.chain().focus().toggleBold().run()"
    >
      B
    </button>
    <button
      class="editor-tool italic"
      type="button"
      aria-label="Italic"
      @click="editor.chain().focus().toggleItalic().run()"
    >
      I
    </button>
    <button
      class="editor-tool underline"
      type="button"
      aria-label="Underline"
      @click="editor.chain().focus().toggleUnderline().run()"
    >
      U
    </button>
    <button
      class="editor-tool"
      type="button"
      aria-label="Heading 2"
      @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
    >
      H2
    </button>
    <button
      class="editor-tool"
      type="button"
      @click="editor.chain().focus().toggleBulletList().run()"
    >
      {{ t('admin.toolbar.list') }}
    </button>
    <button
      class="editor-tool"
      type="button"
      @click="editor.chain().focus().toggleCodeBlock().run()"
    >
      {{ t('admin.toolbar.code') }}
    </button>
    <button class="editor-tool" type="button" @click="emit('setLink')">
      {{ t('admin.toolbar.link') }}
    </button>
    <button class="editor-tool" type="button" @click="emit('insert', 'callout')">
      {{ t('admin.toolbar.callout') }}
    </button>
    <button class="editor-tool" type="button" @click="emit('insert', 'table')">
      {{ t('admin.toolbar.table') }}
    </button>
    <button class="editor-tool" type="button" @click="emit('insert', 'mermaidBlock')">
      {{ t('admin.toolbar.mermaid') }}
    </button>
    <button class="editor-tool" type="button" @click="emit('insert', 'mathBlock')">
      {{ t('admin.toolbar.math') }}
    </button>
    <button class="editor-tool" type="button" @click="emit('insert', 'videoEmbed')">
      {{ t('admin.toolbar.video') }}
    </button>
    <button class="editor-tool" type="button" @click="emit('insert', 'footnote')">
      {{ t('admin.toolbar.footnote') }}
    </button>
    <button class="editor-tool" type="button" @click="fileInput?.click()">
      {{ t('admin.toolbar.media') }}
    </button>
    <button class="editor-tool" type="button" @click="markdownInput?.click()">
      {{ t('admin.toolbar.importMarkdown') }}
    </button>
    <button class="editor-tool" type="button" @click="emit('exportMarkdown')">
      {{ t('admin.toolbar.exportMarkdown') }}
    </button>
    <input ref="fileInput" class="sr-only" type="file" multiple @change="emit('upload', $event)" />
    <input
      ref="markdownInput"
      class="sr-only"
      type="file"
      accept=".md,text/markdown"
      @change="emit('importMarkdown', $event)"
    />
  </div>

  <div
    v-if="slashOpen"
    class="m-3 grid gap-2 border border-border bg-surface p-3 shadow-lg tablet:grid-cols-3"
    role="dialog"
    :aria-label="t('admin.toolbar.slashCommands')"
  >
    <button class="editor-tool" type="button" @click="runSlash('callout')">
      {{ t('admin.toolbar.callout') }}
    </button>
    <button class="editor-tool" type="button" @click="runSlash('table')">
      {{ t('admin.toolbar.table') }}
    </button>
    <button class="editor-tool" type="button" @click="runSlash('mermaidBlock')">
      {{ t('admin.toolbar.mermaid') }}
    </button>
    <button class="editor-tool" type="button" @click="runSlash('mathBlock')">
      {{ t('admin.toolbar.math') }}
    </button>
    <button class="editor-tool" type="button" @click="runSlash('videoEmbed')">
      {{ t('admin.toolbar.video') }}
    </button>
    <button class="editor-tool" type="button" @click="runSlash('footnote')">
      {{ t('admin.toolbar.footnote') }}
    </button>
  </div>

  <BubbleMenu :editor="editor" class="flex gap-1 border border-border bg-surface p-1 shadow-lg">
    <button class="editor-tool" type="button" @click="editor.chain().focus().toggleBold().run()">
      {{ t('admin.toolbar.bold') }}
    </button>
    <button
      class="editor-tool"
      type="button"
      @click="editor.chain().focus().toggleHighlight().run()"
    >
      {{ t('admin.toolbar.highlight') }}
    </button>
    <button class="editor-tool" type="button" @click="emit('setLink')">
      {{ t('admin.toolbar.link') }}
    </button>
  </BubbleMenu>
  <FloatingMenu :editor="editor" class="flex gap-1 border border-border bg-surface p-1 shadow-lg">
    <button class="editor-tool" type="button" @click="emit('insert', 'callout')">
      + {{ t('admin.toolbar.callout') }}
    </button>
    <button class="editor-tool" type="button" @click="emit('insert', 'table')">
      + {{ t('admin.toolbar.table') }}
    </button>
  </FloatingMenu>
  <DragHandle :editor="editor"
    ><button class="editor-tool" type="button" aria-label="Drag block">⋮⋮</button></DragHandle
  >
</template>

<style scoped>
.editor-tool {
  min-height: 2.75rem;
  min-width: 2.75rem;
  border: 1px solid var(--color-border);
  padding: 0.5rem;
  font: 600 0.75rem/1 var(--font-mono);
  background: var(--color-surface);
}
.editor-tool:hover {
  border-color: var(--color-ink);
  background: var(--color-accent);
  color: var(--s3-color-text-on-accent);
}
</style>
