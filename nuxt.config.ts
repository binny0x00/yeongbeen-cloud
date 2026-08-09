import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: {
    '@admin': './layers/admin',
    '@content-domain': './layers/content',
    '@design-system': './layers/design-system',
    '@engagement': './layers/engagement',
    '@identity': './layers/identity',
  },
  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      link: [
        { href: '/favicon.svg', rel: 'icon', type: 'image/svg+xml' },
        { href: '/site.webmanifest', rel: 'manifest' },
      ],
      meta: [{ content: '#f9f7f1', name: 'theme-color' }],
    },
  },
  compatibilityDate: '2025-07-15',
  components: [{ path: '~/components', pathPrefix: false }],
  extends: [
    './layers/design-system',
    './layers/content',
    './layers/identity',
    './layers/engagement',
    './layers/admin',
  ],
  content: {
    experimental: {
      sqliteConnector: 'native',
    },
  },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/eslint'],
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
