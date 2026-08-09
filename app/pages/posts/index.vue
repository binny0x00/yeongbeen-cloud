<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({ title: () => t('posts.title'), description: () => t('posts.description') })
</script>
<template>
  <PublicContentCollection
    kind="POST"
    :title="t('posts.title')"
    :description="t('posts.description')"
  />
</template>
