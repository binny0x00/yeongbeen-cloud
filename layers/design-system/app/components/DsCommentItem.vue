<script setup lang="ts">
defineProps<{ author: string; body: string; date: string; reply?: boolean }>()
</script>

<template>
  <article class="flex gap-4 border-b border-border bg-surface p-6" :class="reply ? 'ml-10' : ''">
    <DsAvatar :label="author" size="sm" />
    <div class="min-w-0 flex-1">
      <header class="flex items-center gap-2">
        <strong class="font-display text-base">{{ author }}</strong
        ><time class="font-mono text-[11px] text-ink-muted">{{ date }}</time>
      </header>
      <p class="mt-2 text-sm leading-6 text-ink">{{ body }}</p>
      <div class="mt-2 min-h-11"><slot name="actions" /></div>
    </div>
  </article>
</template>
