<template>
  <footer
    id="contact"
    aria-labelledby="contact-title"
    class="flex w-full flex-col items-start gap-6 overflow-hidden rounded-lg bg-accent p-6 text-[var(--color-text-on-accent)] desktop:p-12"
  >
    <h2
      id="contact-title"
      class="type-display-sm w-full desktop:text-[var(--font-size-display-lg)] desktop:leading-[var(--line-height-display-lg)] desktop:tracking-[var(--letter-spacing-display-lg)]"
    >
      LET’S BUILD<span class="block">SOMETHING.</span>
    </h2>
    <p
      class="type-body-md w-full desktop:max-w-[760px] desktop:text-[var(--font-size-body-lg)] desktop:leading-[var(--line-height-body-lg)]"
    >
      새로운 제품과 팀에 대해 이야기하고 싶다면 편하게 연락해주세요.
    </p>
    <UiButton to="mailto:hello@yeongbeen.cloud" variant="inverse">이메일 보내기</UiButton>
  </footer>
</template>
