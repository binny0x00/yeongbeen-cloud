<script setup lang="ts">
const route = useRoute()

const activeSection = computed(() => {
  const section = route.hash.replace('#', '')

  if (section === 'writing') return 'writing'
  if (section === 'about') return 'about'

  return 'projects'
})
</script>

<template>
  <header class="flex h-10 w-full items-center justify-between desktop:h-12">
    <NuxtLink to="/" aria-label="Yeongbeen Cloud 홈" class="type-mono-sm text-ink">
      <span class="desktop:hidden">YB.CLOUD</span>
      <span class="hidden desktop:inline">YEONGBEEN.CLOUD</span>
    </NuxtLink>

    <div class="flex items-center gap-4 desktop:gap-8">
      <nav aria-label="주요 섹션" class="hidden items-start gap-8 tablet:flex">
        <NavigationLink to="/#projects" :active="activeSection === 'projects'">
          WORK
        </NavigationLink>
        <NavigationLink to="/#writing" :active="activeSection === 'writing'">
          NOTES
        </NavigationLink>
        <NavigationLink to="/#about" :active="activeSection === 'about'"> ABOUT </NavigationLink>
      </nav>

      <ThemeToggle />
    </div>
  </header>
</template>
