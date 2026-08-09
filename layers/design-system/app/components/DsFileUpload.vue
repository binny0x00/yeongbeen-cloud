<script setup lang="ts">
const emit = defineEmits<{ select: [files: FileList] }>()
withDefaults(defineProps<{ accept?: string; label?: string; multiple?: boolean }>(), {
  accept: undefined,
  label: '파일을 끌어놓거나 선택하세요',
  multiple: false,
})
</script>

<template>
  <label
    class="flex min-h-31 cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--s3-radius-control)] border border-dashed border-border bg-surface p-4 text-center text-sm text-ink hover:border-stroke-strong"
    ><span class="font-mono text-xl" aria-hidden="true">↑</span><span>{{ label }}</span
    ><input
      class="sr-only"
      type="file"
      :accept="accept"
      :multiple="multiple"
      @change="
        event => {
          const files = (event.target as HTMLInputElement).files
          if (files) emit('select', files)
        }
      "
  /></label>
</template>
