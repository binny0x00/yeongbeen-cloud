import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
  typescript: {
    strict: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
