<script setup lang="ts">
type SectionId = 'about' | 'contact' | 'experience' | 'projects' | 'writing'

const sections: ReadonlyArray<{ id: SectionId; label: string }> = [
  { id: 'about', label: 'OVERVIEW' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'writing', label: 'NOTES' },
  { id: 'contact', label: 'CONTACT' },
]

const activeSection = ref<SectionId>('about')
let sectionObserver: IntersectionObserver | undefined

function setActiveSection(section: SectionId) {
  activeSection.value = section
}

onMounted(() => {
  if (!('IntersectionObserver' in window)) return

  sectionObserver = new IntersectionObserver(
    entries => {
      const visibleEntry = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

      if (visibleEntry?.target.id) {
        activeSection.value = visibleEntry.target.id as SectionId
      }
    },
    {
      rootMargin: '-18% 0px -62% 0px',
      threshold: [0, 0.15, 0.4],
    },
  )

  sections.forEach(({ id }) => {
    const section = document.getElementById(id)

    if (section) sectionObserver?.observe(section)
  })
})

onBeforeUnmount(() => sectionObserver?.disconnect())
</script>

<template>
  <aside
    aria-label="개발자 정보 및 섹션 탐색"
    class="sticky top-0 hidden h-dvh w-[440px] flex-col overflow-y-auto px-12 py-[72px] desktop:flex desktop:pl-16"
  >
    <div class="flex min-h-full flex-col">
      <div class="flex flex-col items-start gap-[18px]">
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
      </div>

      <div class="my-10 h-0.5 w-[88px] bg-accent" aria-hidden="true" />

      <nav aria-label="페이지 섹션" class="flex flex-col">
        <a
          v-for="section in sections"
          :key="section.id"
          :href="`#${section.id}`"
          :aria-current="activeSection === section.id ? 'location' : undefined"
          class="group flex min-h-11 items-center gap-4 font-mono text-[13px] font-semibold tracking-[0.08em] text-ink-muted transition-colors duration-150 hover:text-ink"
          :class="activeSection === section.id && 'text-ink'"
          @click="setActiveSection(section.id)"
        >
          <span
            aria-hidden="true"
            class="h-0.5 transition-[width,background-color] duration-200"
            :class="
              activeSection === section.id
                ? 'w-8 bg-accent'
                : 'w-4 bg-border group-hover:w-6 group-hover:bg-accent'
            "
          />
          {{ section.label }}
        </a>
      </nav>

      <div class="mt-auto flex flex-col gap-5 pt-10">
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
            to="/resume"
            class="type-mono-sm text-ink-muted transition-colors hover:text-ink"
          >
            RÉSUMÉ ↗
          </NuxtLink>
        </nav>

        <ThemeToggle />
      </div>
    </div>
  </aside>
</template>
