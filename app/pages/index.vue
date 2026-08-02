<script setup lang="ts">
useSeoMeta({
  title: 'Yeongbeen Cloud',
  description: '최영빈의 프로젝트와 기술 기록을 소개하는 개인 개발 공간입니다.',
})
</script>

<template>
  <div
    class="mx-auto flex w-full max-w-[720px] flex-col gap-16 desktop:grid desktop:max-w-none desktop:grid-cols-[470px_minmax(0,720px)] desktop:items-start desktop:gap-[74px]"
  >
    <HeroSection />
    <div class="flex min-w-0 flex-col gap-[104px]">
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <WritingSection />
    </div>
  </div>
</template>
