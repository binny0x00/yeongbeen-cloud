<script setup lang="ts">
withDefaults(defineProps<{ external?: boolean; to: string }>(), { external: false })
</script>

<template>
  <NuxtLink
    :to="to"
    :external="external"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noreferrer' : undefined"
    class="inline-flex min-h-11 items-center gap-2 font-mono text-xs font-semibold underline-offset-4 hover:underline"
    ><slot /><span v-if="external" aria-hidden="true">↗</span></NuxtLink
  >
</template>
