<script setup lang="ts">
withDefaults(
  defineProps<{
    githubUrl?: string
    resumeUrl?: string
  }>(),
  {
    githubUrl: 'https://github.com/binny0x00',
    resumeUrl: '/resume',
  },
)
</script>

<template>
  <section
    id="about"
    aria-labelledby="hero-title"
    class="flex min-h-[720px] w-full scroll-mt-8 flex-col items-start gap-6 desktop:min-h-[900px]"
  >
    <SectionEyebrow label="OVERVIEW" tone="primary" class="-ml-4" />

    <p class="type-mono-sm text-ink-muted desktop:hidden">YEONGBEEN CHOI · FRONTEND ENGINEER</p>

    <h1
      id="hero-title"
      class="font-display text-[var(--font-size-display-mobile)] leading-[var(--line-height-display-mobile)] font-bold tracking-[var(--letter-spacing-display-mobile)] text-ink desktop:text-[clamp(4rem,5.7vw,5.125rem)] desktop:leading-[0.93] desktop:tracking-[var(--letter-spacing-display-hero)]"
    >
      <span class="block">I BUILD INTERFACES</span>
      <span class="block">THAT FEEL CLEAR</span>
      <span class="block">AND SHIP RELIABLY.</span>
    </h1>

    <p aria-hidden="true" class="type-handwritten rotate-2 text-ink-accent">
      design × engineering × operations
    </p>

    <div
      class="flex max-w-[856px] flex-col gap-5 pt-6 font-sans text-[16px] leading-7 text-ink-muted desktop:text-[18px] desktop:leading-[31px]"
    >
      <p>
        사용자에게는 명확하고, 팀에게는 오래 유지되는 화면을 만듭니다. React와 TypeScript에서 시작해
        Nuxt, Docker, CI/CD까지 제품이 실제로 운영되는 전체 흐름을 이해하고 개선합니다.
      </p>
      <p>
        AI는 속도를 높이는 도구로 활용하되, 구조와 품질, 검증에 대한 책임은 개발자가 가져야 한다고
        믿습니다.
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
      <UiButton to="#projects">VIEW PROJECTS</UiButton>
      <UiTextLink :to="githubUrl" external>GITHUB</UiTextLink>
      <UiTextLink :to="resumeUrl" show-arrow>RÉSUMÉ</UiTextLink>
    </div>

    <p class="type-label pt-4 text-ink">
      NUXT · TYPESCRIPT · VUE · DOCKER · GITHUB ACTIONS · RAILWAY
    </p>
  </section>
</template>
