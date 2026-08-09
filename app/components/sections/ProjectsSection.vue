<script setup lang="ts">
const { t } = useI18n()
</script>
<template>
  <section id="projects" class="flex w-full flex-col gap-5">
    <SectionEyebrow :label="t('nav.portfolio')" class="-ml-4" />
    <PublicContentCollection compact kind="PORTFOLIO" :title="t('portfolio.title')" />
  </section>
</template>
