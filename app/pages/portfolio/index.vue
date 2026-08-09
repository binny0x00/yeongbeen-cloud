<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({ title: () => t('portfolio.title'), description: () => t('portfolio.description') })
</script>
<template>
  <PublicContentCollection
    kind="PORTFOLIO"
    :title="t('portfolio.title')"
    :description="t('portfolio.description')"
  />
</template>
