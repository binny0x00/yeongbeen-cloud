<script setup lang="ts">
const active = ref(0)
const props = defineProps<{ items: Array<{ alt: string; caption?: string; src: string }> }>()
const activeItem = computed(() => props.items[active.value])
</script>

<template>
  <figure class="s3-panel flex flex-col gap-3 p-6">
    <div class="overflow-hidden rounded-xl bg-inverse">
      <img
        v-if="activeItem"
        :src="activeItem.src"
        :alt="activeItem.alt"
        class="aspect-video w-full object-cover"
      />
    </div>
    <figcaption class="font-mono text-xs">{{ activeItem?.caption }}</figcaption>
    <div v-if="items.length > 1" class="flex min-h-11 gap-2" aria-label="미디어 선택">
      <button
        v-for="(item, index) in items"
        :key="item.src"
        type="button"
        class="size-11 rounded-[var(--s3-radius-control)] border font-mono text-xs"
        :class="active === index ? 'border-transparent bg-accent' : 'border-border bg-surface'"
        :aria-label="`${index + 1}번 미디어 보기`"
        @click="active = index"
      >
        {{ String(index + 1).padStart(2, '0') }}
      </button>
    </div>
  </figure>
</template>
