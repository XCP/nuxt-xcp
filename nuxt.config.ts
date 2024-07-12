// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ["nuxt-fathom", "@nuxt/image", "@nuxtjs/device", "@nuxt/eslint"],
  nitro: {
    storage: {
      data: { driver: 'vercelKV' }
    }
  },
  eslint: {
    config: {
      stylistic: true
    }
  },
  fathom: {
    siteId: "FVFGOFSG"
  },
})