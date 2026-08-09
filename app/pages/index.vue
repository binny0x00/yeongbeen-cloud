<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
useSeoMeta({ title: 'Yeongbeen Cloud', description: () => t('home.description') })
</script>

<template>
  <div class="flex w-full max-w-[856px] flex-col gap-[104px]">
    <section id="about" class="flex min-h-[70vh] flex-col items-start justify-center gap-6">
      <SectionEyebrow :label="t('home.eyebrow')" class="-ml-4" />
      <h1 class="type-display-lg max-w-[820px]">{{ t('home.title') }}</h1>
      <p class="type-body-lg max-w-[700px] text-ink-muted">{{ t('home.description') }}</p>
      <div class="flex flex-wrap gap-3">
        <DsButton :to="localePath('/portfolio')">{{ t('home.portfolioCta') }}</DsButton>
        <DsButton :to="localePath('/posts')" variant="secondary">{{ t('home.postsCta') }}</DsButton>
      </div>
    </section>

    <section id="projects" class="flex flex-col gap-5">
      <SectionEyebrow :label="t('nav.portfolio')" class="-ml-4" />
      <PublicContentCollection
        compact
        kind="PORTFOLIO"
        :title="t('portfolio.title')"
        :description="t('portfolio.description')"
      />
      <UiTextLink :to="localePath('/portfolio')" show-arrow>{{
        t('home.portfolioCta')
      }}</UiTextLink>
    </section>

    <section id="writing" class="flex flex-col gap-5">
      <SectionEyebrow :label="t('nav.posts')" class="-ml-4" />
      <PublicContentCollection
        compact
        kind="POST"
        :title="t('posts.title')"
        :description="t('posts.description')"
      />
      <UiTextLink :to="localePath('/posts')" show-arrow>{{ t('home.postsCta') }}</UiTextLink>
    </section>

    <ContactFooter id="contact" />
  </div>
</template>
