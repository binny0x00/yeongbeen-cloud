<script setup lang="ts">
const { t } = useI18n()
</script>
<template>
  <section id="writing" class="flex w-full flex-col gap-5">
    <SectionEyebrow :label="t('nav.posts')" class="-ml-4" />
    <PublicContentCollection compact kind="POST" :title="t('posts.title')" />
  </section>
</template>
