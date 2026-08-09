<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const siteName = 'Yeongbeen Cloud'
const siteDescription =
  '사람들의 삶에 직접적인 변화를 만드는 기술을 탐구하고, 하나의 경험에서 발견한 질문을 다음 배움으로 확장하는 개발자 최영빈의 포트폴리오입니다.'
const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')
const canonicalUrl = computed(() => `${siteUrl}${route.path}`)
const socialImageUrl = `${siteUrl}/og-image.png`
const localeHead = useLocaleHead({ dir: true, lang: true, seo: true })

useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs,
  link: [...(localeHead.value.link ?? []), { href: canonicalUrl.value, rel: 'canonical' }],
  meta: localeHead.value.meta,
  titleTemplate: title => (title && title !== siteName ? `${title} · ${siteName}` : siteName),
}))

useSeoMeta({
  description: siteDescription,
  ogDescription: siteDescription,
  ogImage: socialImageUrl,
  ogImageAlt: 'Yeongbeen Cloud — Projects, writing and experiments by Yeongbeen Choi',
  ogImageHeight: 630,
  ogImageWidth: 1200,
  ogLocale: () => (route.path.startsWith('/en') ? 'en_US' : 'ko_KR'),
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
