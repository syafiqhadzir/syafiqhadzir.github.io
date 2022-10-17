// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@nuxt/content'],
  buildModules: [
    '@nuxtjs/pwa', '@nuxt/typescript-build'
  ],
  pwa: {
    icon: false // disables the icon module
  },
  content: {
    // https://content.nuxtjs.org/api/configuration
  }
})
