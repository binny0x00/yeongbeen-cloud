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
    aria-labelledby="hero-title"
    class="flex w-full flex-col items-start gap-4 desktop:w-[470px] desktop:gap-6"
  >
    <div class="type-mono-sm flex h-[18px] w-full justify-between">
      <p class="text-ink">AVAILABLE / 2026</p>
      <p class="text-ink-muted">SEOUL, KR</p>
    </div>

    <h1
      id="hero-title"
      class="font-display text-[44px] leading-[46px] tracking-[-0.88px] text-ink desktop:text-[58px] desktop:leading-[60px] desktop:tracking-[-1.16px]"
    >
      <span class="block">YEONGBEEN</span>
      <span class="block">CHOI</span>
    </h1>

    <span
      aria-hidden="true"
      class="h-2 w-[104px] rounded-full bg-accent-secondary desktop:h-2.5 desktop:w-[136px]"
    />

    <div
      class="flex w-full flex-col gap-4 overflow-hidden rounded-lg bg-accent p-6 text-[var(--color-text-on-accent)]"
    >
      <p class="type-mono-sm">01 / PERSONAL DEVELOPER SPACE</p>
      <p
        class="font-display text-[31px] leading-[35px] tracking-[-0.31px] desktop:text-[38px] desktop:leading-[42px] desktop:tracking-[-0.38px]"
      >
        <span class="desktop:hidden">
          <span class="block">BUILDING FOR</span>
          <span class="block">THE WEB.</span>
        </span>
        <span class="hidden desktop:inline">
          <span class="block">BUILDING</span>
          <span class="block">FOR THE WEB.</span>
        </span>
      </p>
      <div class="flex h-[30px] w-full items-center justify-between">
        <p class="text-[15px] font-semibold whitespace-nowrap">FRONTEND ENGINEER</p>
        <span
          class="rounded-full bg-accent-secondary px-3 py-2 font-mono text-[11px] leading-none whitespace-nowrap"
        >
          NUXT + TS
        </span>
      </div>
    </div>

    <p class="text-[16px] leading-[25px] text-ink-muted desktop:text-[17px] desktop:leading-[27px]">
      재사용 가능한 인터페이스와 안정적인 배포 흐름을 설계하며, 아이디어를 실제 서비스로 연결합니다.
    </p>

    <div class="flex items-center gap-4">
      <UiButton to="#projects">PROJECTS</UiButton>
      <UiTextLink :to="githubUrl" external>GITHUB</UiTextLink>
      <UiTextLink :to="resumeUrl" show-arrow>RÉSUMÉ</UiTextLink>
    </div>

    <p class="font-mono text-[10px] leading-normal text-ink-muted desktop:text-[11px]">
      <span class="desktop:hidden">NUXT · TYPESCRIPT · A11Y · CI/CD</span>
      <span class="hidden desktop:inline"> NUXT · TYPESCRIPT · ACCESSIBILITY · CI/CD </span>
    </p>
  </section>
</template>
