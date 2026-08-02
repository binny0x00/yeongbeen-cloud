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
    <SectionEyebrow
      label="OVERVIEW"
      tone="primary"
      class="-ml-4"
      data-hero-item
      style="--hero-order: 0"
    />

    <p class="type-mono-sm text-ink-muted desktop:hidden" data-hero-item style="--hero-order: 1">
      YEONGBEEN CHOI · FRONTEND ENGINEER
    </p>

    <h1
      id="hero-title"
      class="font-display text-[var(--font-size-display-mobile)] leading-[var(--line-height-display-mobile)] font-bold tracking-[var(--letter-spacing-display-mobile)] text-ink desktop:text-[clamp(4rem,5.7vw,5.125rem)] desktop:leading-[0.93] desktop:tracking-[var(--letter-spacing-display-hero)]"
    >
      <span class="block overflow-hidden">
        <span class="block" data-hero-item style="--hero-order: 1">I BUILD INTERFACES</span>
      </span>
      <span class="block overflow-hidden">
        <span class="block" data-hero-item style="--hero-order: 2">THAT FEEL CLEAR</span>
      </span>
      <span class="block overflow-hidden">
        <span class="block" data-hero-item style="--hero-order: 3">AND SHIP RELIABLY.</span>
      </span>
    </h1>

    <p
      aria-hidden="true"
      class="type-handwritten rotate-2 text-ink-accent"
      data-hero-item
      style="--hero-order: 4"
    >
      design × engineering × operations
    </p>

    <div
      class="flex max-w-[856px] flex-col gap-5 pt-6 font-sans text-[16px] leading-7 text-ink-muted desktop:text-[18px] desktop:leading-[31px]"
      data-hero-item
      style="--hero-order: 5"
    >
      <p>
        사람들의 삶의 질을 높이는 기술에 관심을 두고 의공학을 전공하며, 일상에 직접적인 변화를
        만드는 메이커를 꿈꿨습니다. Android Native와 Flutter 앱을 개발하면서 모바일 역시 사람들의
        행동과 경험을 변화시킬 수 있는 기술임을 깨달았습니다.
      </p>
      <p>
        누적 다운로드 10만 회 이상의 서비스 개발에 참여하며 코드가 많은 사용자의 일상에 미치는
        영향과 책임을 체감했습니다. 이를 계기로 성능과 안정성에 관심을 넓혔고, 크래프톤 정글에서
        운영체제와 네트워크, 웹 서버를 직접 구현하며 안정적인 서비스를 뒷받침하는 구조를
        학습했습니다.
      </p>
      <p class="font-semibold text-ink">
        하나의 경험에서 새로운 질문을 발견하고, 그 질문을 다음 배움으로 확장하는 개발자입니다.
      </p>
    </div>

    <div
      class="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2"
      data-hero-item
      style="--hero-order: 6"
    >
      <UiButton to="#projects">VIEW PROJECTS</UiButton>
      <UiTextLink :to="githubUrl" external>GITHUB</UiTextLink>
      <UiTextLink :to="resumeUrl" show-arrow>RÉSUMÉ</UiTextLink>
    </div>

    <p class="type-label pt-4 text-ink" data-hero-item style="--hero-order: 7">
      REACT · TYPESCRIPT · NUXT · VUE · DOCKER · GITHUB ACTIONS · RAILWAY
    </p>
  </section>
</template>
