<script setup lang="ts">
import type { CommentView } from '@engagement/ports/engagement-repository'

const props = defineProps<{ documentId: string; locale: 'ko' | 'en' }>()
const { t } = useI18n()
const localePath = useLocalePath()
const auth = useAuth()
const config = useRuntimeConfig()
const session = ref<Awaited<ReturnType<typeof auth.getSession>>['data']>(null)
const comments = ref<CommentView[]>([])
const like = reactive({ count: 0, liked: false })
const body = ref('')
const parentId = ref<string>()
const turnstileToken = ref<string>()
const turnstileRoot = useTemplateRef<HTMLElement>('turnstileRoot')
const submitting = ref(false)
const errorMessage = ref('')
let turnstileTimer: number | undefined
let turnstileTimeout: number | undefined

const roots = computed(() => comments.value.filter(comment => !comment.parentId))
const replies = computed(() => {
  const result = new Map<string, CommentView[]>()
  for (const comment of comments.value.filter(item => item.parentId))
    result.set(comment.parentId as string, [
      ...(result.get(comment.parentId as string) ?? []),
      comment,
    ])
  return result
})

useHead(() => ({
  script: config.public.turnstileSiteKey
    ? [
        {
          async: true,
          defer: true,
          src: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
        },
      ]
    : [],
}))

async function load(): Promise<void> {
  const [commentData, likeData] = await Promise.all([
    $fetch<CommentView[]>(`/api/v1/documents/${props.documentId}/comments`, {
      query: { locale: props.locale },
    }),
    $fetch<{ count: number; liked: boolean }>(`/api/v1/documents/${props.documentId}/like`),
  ])
  comments.value = commentData
  Object.assign(like, likeData)
}

onMounted(async () => {
  session.value = (await auth.getSession()).data
  await load()
  if (!config.public.turnstileSiteKey || !turnstileRoot.value) return
  turnstileTimer = window.setInterval(() => {
    const turnstile = (
      window as unknown as {
        turnstile?: {
          render(
            element: HTMLElement,
            options: { callback(token: string): void; sitekey: string },
          ): string
        }
      }
    ).turnstile
    if (!turnstile || !turnstileRoot.value) return
    turnstile.render(turnstileRoot.value, {
      callback: token => {
        turnstileToken.value = token
      },
      sitekey: config.public.turnstileSiteKey,
    })
    window.clearInterval(turnstileTimer)
  }, 100)
  turnstileTimeout = window.setTimeout(() => window.clearInterval(turnstileTimer), 10_000)
})

onBeforeUnmount(() => {
  if (turnstileTimer) window.clearInterval(turnstileTimer)
  if (turnstileTimeout) window.clearTimeout(turnstileTimeout)
})

async function toggleLike(): Promise<void> {
  if (!session.value?.user) {
    await navigateTo(localePath('/login'))
    return
  }
  Object.assign(
    like,
    await $fetch(`/api/v1/documents/${props.documentId}/like`, {
      body: { liked: !like.liked },
      method: 'POST',
    }),
  )
}

async function submit(): Promise<void> {
  if (!session.value?.user) {
    await navigateTo(localePath('/login'))
    return
  }
  submitting.value = true
  errorMessage.value = ''
  try {
    await $fetch(`/api/v1/documents/${props.documentId}/comments`, {
      body: {
        body: body.value,
        locale: props.locale,
        parentId: parentId.value,
        turnstileToken: turnstileToken.value,
      },
      method: 'POST',
    })
    body.value = ''
    parentId.value = undefined
    await load()
  } catch (error) {
    errorMessage.value =
      (error as { statusMessage?: string }).statusMessage ?? t('engagement.error')
  } finally {
    submitting.value = false
  }
}

async function edit(comment: CommentView): Promise<void> {
  const next = window.prompt(t('engagement.edit'), comment.body ?? '')
  if (!next) return
  await $fetch(`/api/v1/comments/${comment.id}`, { body: { body: next }, method: 'PATCH' })
  await load()
}

async function remove(comment: CommentView): Promise<void> {
  if (!window.confirm(t('engagement.deleteConfirm'))) return
  await $fetch(`/api/v1/comments/${comment.id}`, { method: 'DELETE' })
  await load()
}

async function report(comment: CommentView): Promise<void> {
  const reason = window.prompt(t('engagement.reportReason'))
  if (!reason) return
  await $fetch(`/api/v1/comments/${comment.id}/report`, { body: { reason }, method: 'POST' })
}

function canEdit(comment: CommentView): boolean {
  return comment.author?.id === session.value?.user.id && comment.status !== 'DELETED'
}
</script>

<template>
  <section class="mt-12 border-t border-border pt-8" :aria-label="t('engagement.title')">
    <div class="flex items-center justify-between gap-4">
      <h2 class="type-heading-lg">{{ t('engagement.title') }}</h2>
      <DsButton variant="secondary" @click="toggleLike"
        >{{ like.liked ? '♥' : '♡' }} {{ like.count }}</DsButton
      >
    </div>
    <form class="mt-6 grid gap-3" @submit.prevent="submit">
      <p v-if="parentId" class="type-label">{{ t('engagement.replying') }}</p>
      <DsTextarea v-model="body" :label="t('engagement.comment')" name="comment" :rows="4" />
      <div v-if="config.public.turnstileSiteKey" ref="turnstileRoot" />
      <p v-if="errorMessage" class="text-danger" role="alert">{{ errorMessage }}</p>
      <div class="flex gap-2">
        <DsButton type="submit" :disabled="submitting || !body.trim()">{{
          t('engagement.submit')
        }}</DsButton>
        <DsButton v-if="parentId" variant="secondary" @click="parentId = undefined">{{
          t('engagement.cancel')
        }}</DsButton>
      </div>
    </form>
    <ol class="mt-8 grid gap-5">
      <li v-for="comment in roots" :key="comment.id" class="s3-panel p-5">
        <p class="type-label">
          {{ comment.author?.name ?? t('engagement.deletedUser') }} ·
          {{ new Date(comment.createdAt).toLocaleString(locale) }}
        </p>
        <p class="mt-2 whitespace-pre-wrap">{{ comment.body ?? t('engagement.deleted') }}</p>
        <p v-if="comment.status === 'PENDING'" class="type-label mt-2 text-ink-muted">
          {{ t('engagement.pending') }}
        </p>
        <div v-if="comment.status !== 'DELETED'" class="mt-3 flex flex-wrap gap-2">
          <button class="type-label min-h-11" type="button" @click="parentId = comment.id">
            {{ t('engagement.reply') }}
          </button>
          <button
            v-if="canEdit(comment)"
            class="type-label min-h-11"
            type="button"
            @click="edit(comment)"
          >
            {{ t('engagement.edit') }}
          </button>
          <button
            v-if="canEdit(comment)"
            class="type-label min-h-11"
            type="button"
            @click="remove(comment)"
          >
            {{ t('engagement.delete') }}
          </button>
          <button
            v-if="session?.user"
            class="type-label min-h-11"
            type="button"
            @click="report(comment)"
          >
            {{ t('engagement.report') }}
          </button>
        </div>
        <ol class="ml-6 mt-4 grid gap-3 border-l border-border pl-4">
          <li v-for="reply in replies.get(comment.id) ?? []" :key="reply.id">
            <p class="type-label">{{ reply.author?.name ?? t('engagement.deletedUser') }}</p>
            <p class="mt-1 whitespace-pre-wrap">{{ reply.body ?? t('engagement.deleted') }}</p>
            <p v-if="reply.status === 'PENDING'" class="type-label mt-2 text-ink-muted">
              {{ t('engagement.pending') }}
            </p>
            <div v-if="reply.status !== 'DELETED'" class="mt-2 flex gap-3">
              <button
                v-if="canEdit(reply)"
                class="type-label min-h-11"
                type="button"
                @click="edit(reply)"
              >
                {{ t('engagement.edit') }}
              </button>
              <button
                v-if="canEdit(reply)"
                class="type-label min-h-11"
                type="button"
                @click="remove(reply)"
              >
                {{ t('engagement.delete') }}
              </button>
              <button
                v-if="session?.user"
                class="type-label min-h-11"
                type="button"
                @click="report(reply)"
              >
                {{ t('engagement.report') }}
              </button>
            </div>
          </li>
        </ol>
      </li>
    </ol>
  </section>
</template>
