import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: {
    '@admin': fileURLToPath(new URL('./layers/admin', import.meta.url)),
    '@content-domain': fileURLToPath(new URL('./layers/content', import.meta.url)),
    '@design-system': fileURLToPath(new URL('./layers/design-system', import.meta.url)),
    '@engagement': fileURLToPath(new URL('./layers/engagement', import.meta.url)),
    '@identity': fileURLToPath(new URL('./layers/identity', import.meta.url)),
  },
  app: {
    head: {
      link: [
        { href: '/favicon.svg', rel: 'icon', type: 'image/svg+xml' },
        { href: '/site.webmanifest', rel: 'manifest' },
      ],
      meta: [{ content: '#f9f7f1', name: 'theme-color' }],
    },
  },
  compatibilityDate: '2025-07-15',
  components: [
    { path: '~/components', pathPrefix: false },
    {
      path: fileURLToPath(new URL('./layers/design-system/app/components', import.meta.url)),
      pathPrefix: false,
    },
  ],
  extends: [
    './layers/design-system',
    './layers/content',
    './layers/identity',
    './layers/engagement',
    './layers/admin',
  ],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL ?? 'https://yeongbeen.cloud',
    defaultLocale: 'ko',
    detectBrowserLanguage: {
      cookieKey: 'yb_locale',
      redirectOn: 'root',
      useCookie: true,
    },
    langDir: 'locales',
    locales: [
      { code: 'ko', file: 'ko.json', language: 'ko-KR', name: '한국어' },
      { code: 'en', file: 'en.json', language: 'en-US', name: 'English' },
    ],
    strategy: 'prefix',
  },
  modules: ['@nuxtjs/i18n', '@nuxt/eslint'],
  runtimeConfig: {
    githubOwner: 'binny0x00',
    githubRepositories: 'yeongbeen-cloud',
    githubToken: '',
    public: {
      siteUrl: 'https://yeongbeen.cloud',
    },
  },
  typescript: {
    strict: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
