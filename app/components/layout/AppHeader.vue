<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { locale } = useI18n()
</script>

<template>
  <header class="flex min-h-11 w-full items-center justify-between desktop:min-h-12">
    <NuxtLink :to="localePath('/')" aria-label="Yeongbeen Cloud 홈" class="type-mono-sm text-ink">
      <span class="desktop:hidden">YB.CLOUD</span>
      <span class="hidden desktop:inline">YEONGBEEN.CLOUD</span>
    </NuxtLink>

    <div class="flex items-center gap-4 desktop:gap-8">
      <nav aria-label="주요 섹션" class="hidden items-start gap-8 tablet:flex">
        <NavigationLink :to="localePath('/portfolio')" :active="route.path.includes('/portfolio')">
          WORK
        </NavigationLink>
        <NavigationLink :to="localePath('/posts')" :active="route.path.includes('/posts')">
          NOTES
        </NavigationLink>
        <NavigationLink :to="localePath('/about')" :active="route.path.includes('/about')">
          ABOUT
        </NavigationLink>
      </nav>

      <NotificationBell />
      <NuxtLink
        :to="switchLocalePath(locale === 'ko' ? 'en' : 'ko')"
        class="type-label inline-flex min-h-11 items-center text-ink-muted hover:text-ink"
        :aria-label="locale === 'ko' ? 'Switch to English' : '한국어로 전환'"
      >
        {{ locale === 'ko' ? 'EN' : 'KO' }}
      </NuxtLink>
      <ThemeToggle />
    </div>
  </header>
</template>
