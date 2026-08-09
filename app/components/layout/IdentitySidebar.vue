<script setup lang="ts">
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const { locale } = useI18n()
const sections = [
  { label: 'OVERVIEW', path: '/' },
  { label: 'PORTFOLIO', path: '/portfolio' },
  { label: 'POSTS', path: '/posts' },
  { label: 'ABOUT', path: '/about' },
  { label: 'CONTACT', path: '/#contact' },
]
</script>

<template>
  <aside
    aria-label="개발자 정보 및 섹션 탐색"
    class="identity-sidebar sticky top-0 hidden h-dvh w-[440px] flex-col overflow-y-auto px-12 py-[72px] desktop:flex desktop:pl-16"
  >
    <div class="flex min-h-full flex-col">
      <div class="identity-sidebar__intro flex flex-col items-start gap-[18px]">
        <p class="type-mono-sm text-ink">YEONGBEEN.CLOUD / 2026</p>

        <p class="type-display-identity text-ink" aria-label="Yeongbeen Choi">
          <span class="block">YEONGBEEN</span>
          <span class="block">CHOI</span>
        </p>

        <p aria-hidden="true" class="type-handwritten rotate-[4deg] text-ink-accent">
          build with intent
        </p>

        <p class="font-mono text-[14px] leading-5 font-medium text-ink">FRONTEND ENGINEER</p>
        <p class="type-body-md max-w-[300px] text-ink-muted">
          재사용 가능한 UI와 안정적인 운영 흐름을 함께 설계합니다.
        </p>

        <PetCompanion />
      </div>

      <div class="identity-sidebar__divider my-7 h-0.5 w-[88px] bg-accent" aria-hidden="true" />

      <nav aria-label="페이지 섹션" class="flex flex-col">
        <NuxtLink
          v-for="section in sections"
          :key="section.path"
          :to="localePath(section.path)"
          :aria-current="route.path === localePath(section.path) ? 'page' : undefined"
          class="identity-sidebar__nav-link group flex min-h-11 items-center gap-4 font-mono text-[13px] font-semibold tracking-[0.08em] text-ink-muted transition-colors duration-150 hover:text-ink"
          :class="route.path === localePath(section.path) && 'text-ink'"
        >
          <span
            aria-hidden="true"
            class="h-0.5 transition-[width,background-color] duration-200"
            :class="
              route.path === localePath(section.path)
                ? 'w-8 bg-accent'
                : 'w-4 bg-border group-hover:w-6 group-hover:bg-accent'
            "
          />
          {{ section.label }}
        </NuxtLink>
      </nav>

      <div class="identity-sidebar__footer mt-auto flex flex-col gap-5 pt-10">
        <div class="flex min-h-11 items-center gap-5">
          <NuxtLink
            :to="switchLocalePath(locale === 'ko' ? 'en' : 'ko')"
            class="type-label inline-flex min-h-11 items-center text-ink-muted hover:text-ink"
            :aria-label="locale === 'ko' ? 'Switch to English' : '한국어로 전환'"
          >
            LANGUAGE / {{ locale === 'ko' ? 'EN' : 'KO' }}
          </NuxtLink>
          <NotificationBell />
        </div>
        <nav aria-label="외부 링크" class="flex flex-wrap gap-x-4 gap-y-2">
          <a
            href="https://github.com/binny0x00"
            target="_blank"
            rel="noreferrer"
            class="type-mono-sm text-ink-muted transition-colors hover:text-ink"
          >
            GITHUB ↗
          </a>
          <a
            href="mailto:hello@yeongbeen.cloud"
            class="type-mono-sm text-ink-muted transition-colors hover:text-ink"
          >
            EMAIL ↗
          </a>
          <NuxtLink
            :to="localePath('/about')"
            class="type-mono-sm text-ink-muted transition-colors hover:text-ink"
          >
            ABOUT ↗
          </NuxtLink>
        </nav>

        <ThemeToggle />
      </div>
    </div>
  </aside>
</template>

<style scoped>
@media (min-width: 75rem) and (max-height: 51.25rem) {
  .identity-sidebar {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }

  .identity-sidebar__intro {
    gap: 0.625rem;
  }

  .identity-sidebar__divider {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .identity-sidebar__nav-link {
    min-height: 2.25rem;
  }

  .identity-sidebar__footer {
    gap: 0.75rem;
    padding-top: 1rem;
  }

  :deep(.pet-companion) {
    width: 300px;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0;
  }

  :deep(.pet-companion__stage) {
    width: 80px;
    height: 64px;
    flex: 0 0 80px;
  }

  :deep(.pet-companion__image) {
    right: 8px;
    width: 64px;
    height: 64px;
  }

  :deep(.pet-companion__dot) {
    top: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
  }
}
</style>
