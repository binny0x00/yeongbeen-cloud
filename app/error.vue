<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const isNotFound = computed(() => props.error.statusCode === 404)
const heading = computed(() => (isNotFound.value ? 'PAGE NOT FOUND.' : 'SOMETHING BROKE.'))
const errorTitle = computed(() => (isNotFound.value ? '페이지를 찾을 수 없음' : '오류 발생'))
const description = computed(() =>
  isNotFound.value
    ? '요청한 페이지를 찾을 수 없습니다. 주소를 확인하거나 홈에서 다시 시작해주세요.'
    : '예상하지 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
)

useHead({
  title: errorTitle,
})

useSeoMeta({
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="min-h-screen bg-canvas px-[var(--layout-page-gutter)] py-8 text-ink desktop:py-16">
    <NuxtRouteAnnouncer />
    <main
      class="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-[var(--layout-content-max)] flex-col justify-between gap-16"
    >
      <NuxtLink
        to="/"
        class="type-mono-sm w-fit underline-offset-4 hover:text-ink-accent hover:underline"
      >
        YB.CLOUD
      </NuxtLink>

      <section class="flex max-w-[900px] flex-col items-start gap-6" aria-labelledby="error-title">
        <p class="type-mono-sm text-ink-accent">ERROR / {{ error.statusCode }}</p>
        <h1
          id="error-title"
          class="type-display-sm desktop:text-[var(--font-size-display-lg)] desktop:leading-[var(--line-height-display-lg)] desktop:tracking-[var(--letter-spacing-display-lg)]"
        >
          {{ heading }}
        </h1>
        <p class="type-body-lg max-w-[640px] text-ink-muted">{{ description }}</p>
        <button
          type="button"
          class="type-label min-h-8 cursor-pointer rounded-sm bg-accent px-4 py-2 text-[var(--color-text-on-accent)] transition-colors hover:bg-inverse hover:text-ink-inverse"
          @click="clearError({ redirect: '/' })"
        >
          홈으로 돌아가기
        </button>
      </section>

      <p class="type-mono-sm text-ink-muted">YEONGBEEN.CLOUD / NUXT + TYPESCRIPT</p>
    </main>
  </div>
</template>
