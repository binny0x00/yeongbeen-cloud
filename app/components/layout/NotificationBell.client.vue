<script setup lang="ts">
const auth = useAuth()
const { t } = useI18n()
const session = ref<Awaited<ReturnType<typeof auth.getSession>>['data']>(null)
const open = ref(false)
const notifications = ref<
  Array<{ createdAt: string; id: string; message: string; readAt: string | null }>
>([])
const unread = computed(() => notifications.value.filter(item => !item.readAt).length)

onMounted(async () => {
  try {
    session.value = (await auth.getSession()).data
    if (session.value?.user) notifications.value = await $fetch('/api/v1/notifications')
  } catch {
    session.value = null
  }
})

async function toggle(): Promise<void> {
  open.value = !open.value
  if (!open.value || !unread.value) return
  await $fetch('/api/v1/notifications', { body: {}, method: 'PATCH' })
  notifications.value = notifications.value.map(item => ({
    ...item,
    readAt: new Date().toISOString(),
  }))
}
</script>

<template>
  <div v-if="session?.user" class="relative">
    <button
      class="type-label relative min-h-11 min-w-11"
      type="button"
      :aria-label="t('notifications.title')"
      @click="toggle"
    >
      🔔<span v-if="unread" class="absolute right-0 top-0 rounded-full bg-accent px-1 text-ink">{{
        unread
      }}</span>
    </button>
    <div
      v-if="open"
      class="absolute right-0 z-50 mt-2 w-80 border border-border bg-surface p-3 shadow-xl"
    >
      <p v-if="!notifications.length" class="text-sm text-ink-muted">
        {{ t('notifications.empty') }}
      </p>
      <ul v-else class="grid gap-2">
        <li
          v-for="item in notifications"
          :key="item.id"
          class="border-b border-border py-2 text-sm"
        >
          {{ t(item.message) }}
        </li>
      </ul>
    </div>
  </div>
</template>
