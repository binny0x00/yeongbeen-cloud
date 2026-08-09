<script setup lang="ts">
const auth = useAuth()
const localePath = useLocalePath()
const { t } = useI18n()

async function signIn(provider: 'google' | 'github'): Promise<void> {
  await auth.signIn.social({ callbackURL: localePath('/'), provider })
}

useSeoMeta({ title: () => t('nav.login') })
</script>

<template>
  <section class="mx-auto flex min-h-[60vh] w-full max-w-[560px] flex-col justify-center gap-6">
    <SectionEyebrow :label="t('nav.login')" class="-ml-4" />
    <h1 class="type-display-lg">{{ t('nav.login') }}</h1>
    <p class="type-body-md text-ink-muted">Google 또는 GitHub의 검증된 이메일로 로그인합니다.</p>
    <DsButton @click="signIn('google')">Continue with Google</DsButton>
    <DsButton variant="secondary" @click="signIn('github')">Continue with GitHub</DsButton>
  </section>
</template>
