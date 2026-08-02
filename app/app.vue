<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const siteName = 'Yeongbeen Cloud'
const siteDescription = '최영빈의 프로젝트와 기술 기록을 소개하는 개인 개발 공간입니다.'
const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')
const canonicalUrl = computed(() => `${siteUrl}${route.path}`)
const socialImageUrl = `${siteUrl}/og-image.png`

useHead(() => ({
  link: [{ href: canonicalUrl.value, rel: 'canonical' }],
  titleTemplate: title => (title && title !== siteName ? `${title} · ${siteName}` : siteName),
}))

useSeoMeta({
  description: siteDescription,
  ogDescription: siteDescription,
  ogImage: socialImageUrl,
  ogImageAlt: 'Yeongbeen Cloud — Projects, writing and experiments by Yeongbeen Choi',
  ogImageHeight: 630,
  ogImageWidth: 1200,
  ogLocale: 'ko_KR',
  ogSiteName: siteName,
  ogTitle: siteName,
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
  twitterCard: 'summary_large_image',
  twitterDescription: siteDescription,
  twitterImage: socialImageUrl,
  twitterTitle: siteName,
})
</script>

<template>
  <div id="app">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
