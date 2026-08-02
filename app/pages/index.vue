<script setup lang="ts">
useSeoMeta({
  title: 'Yeongbeen Cloud',
  description: '최영빈의 프로젝트와 기술 기록을 소개하는 개인 개발 공간입니다.',
})
</script>

<template>
  <div class="flex w-full max-w-[856px] flex-col gap-[104px]">
    <HeroSection />
    <AboutSection />
    <ExperienceSection />
    <ProjectsSection />
    <WritingSection />
    <ContactFooter />
  </div>
</template>
