<script setup lang="ts">
interface ExperienceItem {
  category: string
  description: string
  mobileDescription: string
  technologies: string
  title: string
}

const experiences: ExperienceItem[] = [
  {
    category: 'TEAM PROJECT',
    description:
      '발표 리포트의 정보 우선순위를 다시 정의하고 공통 카드·차트 구조를 적용해 복잡한 분석 결과를 더 빠르게 읽을 수 있도록 개선했습니다.',
    mobileDescription: '발표 분석 정보를 공통 카드와 차트 구조로 재설계했습니다.',
    technologies: 'REACT · TYPESCRIPT · REST API',
    title: 'Frontend Engineer · Orbit',
  },
  {
    category: 'CS PROGRAM',
    description:
      '운영체제·네트워크·자료구조를 학습하고 Pintos와 시스템 프로젝트를 수행하며 웹 화면 뒤에서 일어나는 실행 흐름을 이해했습니다.',
    mobileDescription: '운영체제·네트워크·자료구조를 학습하고 시스템 프로젝트를 수행했습니다.',
    technologies: 'C · PINTOS · ALGORITHM',
    title: 'KRAFTON JUNGLE',
  },
]
</script>

<template>
  <section
    aria-labelledby="experience-title"
    class="flex w-full flex-col items-start gap-4 desktop:gap-6"
  >
    <h2 id="experience-title" class="sr-only">Experience</h2>
    <SectionLabel :index="2" label="EXPERIENCE" />

    <ol class="w-full">
      <li
        v-for="experience in experiences"
        :key="experience.title"
        class="flex w-full flex-col items-start gap-3 border-t border-border py-6 desktop:flex-row desktop:gap-12 desktop:py-8"
      >
        <p class="type-mono-sm w-full shrink-0 text-ink-muted desktop:w-[180px]">
          {{ experience.category }}
        </p>
        <div class="flex min-w-0 flex-1 flex-col items-start gap-3">
          <h3
            class="w-full font-sans text-[20px] leading-[28px] font-semibold text-ink desktop:text-[28px] desktop:leading-[36px] desktop:tracking-[-0.4px]"
          >
            {{ experience.title }}
          </h3>
          <p
            class="w-full font-sans text-[14px] leading-[22px] text-ink-muted desktop:text-[16px] desktop:leading-[26px]"
          >
            <span class="desktop:hidden">
              {{ experience.mobileDescription }}
            </span>
            <span class="hidden desktop:inline">
              {{ experience.description }}
            </span>
          </p>
          <p class="type-mono-sm w-full text-ink-muted">
            {{ experience.technologies }}
          </p>
        </div>
      </li>
    </ol>
  </section>
</template>
