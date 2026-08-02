<script setup lang="ts">
useSeoMeta({
  title: 'Résumé · Yeongbeen Cloud',
  description: 'Frontend Engineer 최영빈의 주요 경험과 기술을 소개합니다.',
})
</script>

<template>
  <article class="flex w-full max-w-[856px] flex-col gap-16">
    <header class="flex flex-col gap-5">
      <NuxtLink to="/" class="type-label text-ink-muted hover:text-ink">← HOME</NuxtLink>
      <SectionEyebrow label="RÉSUMÉ" class="-ml-4" />
      <h1 class="type-display-lg">
        <span class="block">YEONGBEEN</span>
        <span class="block">CHOI</span>
      </h1>
      <p class="type-body-lg max-w-[700px] text-ink-muted">
        사람들의 삶에 직접적인 변화를 만드는 기술에 관심을 두고, 경험에서 발견한 질문을 다음
        배움으로 확장하는 Frontend Engineer입니다.
      </p>
    </header>

    <ExperienceSection />

    <section class="flex flex-col gap-5" aria-labelledby="resume-stack">
      <SectionEyebrow label="CORE STACK" class="-ml-4" />
      <h2 id="resume-stack" class="type-heading-lg">NUXT · VUE · TYPESCRIPT</h2>
      <p class="type-body-md text-ink-muted">
        Docker · GitHub Actions · Railway · Cloudflare · React · REST API
      </p>
    </section>
  </article>
</template>
