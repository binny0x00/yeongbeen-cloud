<script setup lang="ts">
const contentRail = useTemplateRef<HTMLElement>('contentRail')
useRevealMotion(contentRail)

useSeoMeta({
  title: 'Yeongbeen Cloud',
  description:
    '사람들의 삶에 직접적인 변화를 만드는 기술을 탐구하고, 하나의 경험에서 발견한 질문을 다음 배움으로 확장하는 개발자 최영빈의 포트폴리오입니다.',
})
</script>

<template>
  <div ref="contentRail" class="flex w-full max-w-[856px] flex-col gap-[104px]">
    <div class="w-full" data-reveal data-reveal-variant="hero">
      <HeroSection />
    </div>
    <div class="w-full" data-reveal>
      <ExperienceSection />
    </div>
    <div class="w-full" data-reveal>
      <ProjectsSection />
    </div>
    <div class="w-full" data-reveal>
      <WritingSection />
    </div>
    <div class="w-full" data-reveal>
      <ContactFooter />
    </div>
  </div>
</template>
