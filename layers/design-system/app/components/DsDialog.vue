<script setup lang="ts">
const emit = defineEmits<{ cancel: []; confirm: [] }>()
const props = withDefaults(
  defineProps<{
    confirmLabel?: string
    description: string
    eyebrow?: string
    open: boolean
    title: string
  }>(),
  { confirmLabel: '확인', eyebrow: 'CONFIRM' },
)
const dialog = useTemplateRef<HTMLDialogElement>('dialog')
watch(
  () => props.open,
  open => {
    if (open && !dialog.value?.open) dialog.value?.showModal()
    if (!open && dialog.value?.open) dialog.value.close()
  },
)
</script>

<template>
  <dialog
    ref="dialog"
    class="m-auto w-[min(32.5rem,calc(100%-2rem))] rounded-[var(--s3-radius-panel)] bg-surface p-7 text-ink shadow-[var(--s3-shadow-dialog)] backdrop:bg-black/45"
    @cancel.prevent="emit('cancel')"
  >
    <p class="font-mono text-[11px] font-semibold">{{ eyebrow }}</p>
    <h2 class="mt-4 font-display text-2xl font-bold">{{ title }}</h2>
    <p class="mt-3 text-sm leading-6">{{ description }}</p>
    <div class="mt-6 flex justify-end gap-2">
      <DsButton variant="secondary" @click="emit('cancel')">취소</DsButton
      ><DsButton @click="emit('confirm')">{{ confirmLabel }}</DsButton>
    </div>
  </dialog>
</template>
