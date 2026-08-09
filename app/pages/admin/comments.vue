<script setup lang="ts">
definePageMeta({ middleware: 'admin' })
const { t } = useI18n()
const { data: queue, refresh } = await useFetch<
  Array<{
    authorId: string
    authorName: string
    body: string
    commentId: string
    createdAt: string
    moderationReason: string | null
    reportReason: string | null
    status: string
  }>
>('/api/v1/admin/comments')

async function hide(commentId: string): Promise<void> {
  const reason = window.prompt(t('admin.moderationReason'))
  if (!reason) return
  await $fetch(`/api/v1/admin/comments/${commentId}/hide`, { body: { reason }, method: 'POST' })
  await refresh()
}

async function approve(commentId: string): Promise<void> {
  await $fetch(`/api/v1/admin/comments/${commentId}/approve`, { method: 'POST' })
  await refresh()
}

async function block(userId: string): Promise<void> {
  const reason = window.prompt(t('admin.blockReason'))
  if (!reason) return
  await $fetch(`/api/v1/admin/users/${userId}/block`, { body: { reason }, method: 'POST' })
  await refresh()
}
</script>

<template>
  <div class="flex w-full max-w-[980px] flex-col gap-8">
    <header>
      <SectionEyebrow label="MODERATION" class="-ml-4" />
      <h1 class="type-display-lg">{{ t('admin.commentManagement') }}</h1>
    </header>
    <p v-if="!queue?.length" class="s3-panel p-6 text-ink-muted">
      {{ t('admin.moderationEmpty') }}
    </p>
    <article
      v-for="(item, index) in queue ?? []"
      :key="`${item.commentId}-${index}`"
      class="s3-panel p-6"
    >
      <p class="type-label">
        {{ item.status }} · {{ item.authorName }} · {{ new Date(item.createdAt).toLocaleString() }}
      </p>
      <p class="mt-3 whitespace-pre-wrap">{{ item.body }}</p>
      <p v-if="item.moderationReason || item.reportReason" class="mt-3 text-sm text-ink-muted">
        {{ item.moderationReason ?? item.reportReason }}
      </p>
      <div class="mt-4 flex gap-2">
        <DsButton v-if="item.status === 'PENDING'" @click="approve(item.commentId)">{{
          t('admin.approveComment')
        }}</DsButton>
        <DsButton variant="secondary" @click="hide(item.commentId)">{{
          t('admin.hideComment')
        }}</DsButton>
        <DsButton variant="secondary" @click="block(item.authorId)">{{
          t('admin.blockUser')
        }}</DsButton>
      </div>
    </article>
  </div>
</template>
