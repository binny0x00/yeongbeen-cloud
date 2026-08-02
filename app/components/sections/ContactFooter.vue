<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="flex w-full flex-col gap-12">
    <section
      id="contact"
      aria-labelledby="contact-title"
      class="flex w-full scroll-mt-8 flex-col items-start gap-[22px]"
    >
      <SectionEyebrow label="CONTACT" class="-ml-4" />

      <h2 id="contact-title" class="type-display-lg">
        <span class="block">LET’S BUILD</span>
        <span class="block">SOMETHING CLEAR.</span>
      </h2>

      <p aria-hidden="true" class="type-handwritten rotate-[4deg] text-ink-accent">say hi!</p>

      <p class="type-body-md max-w-[700px] text-ink-muted">
        새로운 제품과 더 나은 사용자 경험에 관한 이야기를 기다리고 있습니다.
      </p>

      <a
        href="mailto:hello@yeongbeen.cloud"
        aria-label="hello@yeongbeen.cloud로 이메일 보내기"
        class="font-mono text-[15px] leading-[22px] font-semibold text-ink underline-offset-4 transition-colors hover:text-ink-accent-primary hover:underline"
      >
        HELLO@YEONGBEEN.CLOUD&nbsp; ↗
      </a>

      <!-- prettier-ignore -->
      <img src="/yellow-point.png" alt="" width="14" height="14">

      <p class="type-label text-ink-muted">
        DESIGNED IN FIGMA · BUILT WITH NUXT · DEPLOYED ON RAILWAY · PROTECTED BY CLOUDFLARE
      </p>
    </section>

    <div
      class="flex flex-col gap-4 border-t border-border pt-6 text-ink-muted tablet:flex-row tablet:items-center tablet:justify-between"
    >
      <p class="type-mono-sm">© {{ currentYear }} YEONGBEEN CHOI</p>
      <nav aria-label="푸터 링크" class="flex items-center gap-6 text-ink">
        <UiTextLink to="https://github.com/binny0x00" external>GitHub</UiTextLink>
        <UiTextLink to="/resume" :show-arrow="false">Resume</UiTextLink>
      </nav>
    </div>
  </footer>
</template>
