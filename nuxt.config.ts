import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  components: [{ path: '~/components', pathPrefix: false }],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  typescript: {
    strict: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
