import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      link: [
        { href: '/favicon.svg', rel: 'icon', type: 'image/svg+xml' },
        { href: '/site.webmanifest', rel: 'manifest' },
      ],
      meta: [{ content: '#ffe45e', name: 'theme-color' }],
    },
  },
  compatibilityDate: '2025-07-15',
  components: [{ path: '~/components', pathPrefix: false }],
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
