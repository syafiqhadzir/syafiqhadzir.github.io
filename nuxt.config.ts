// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    buildModules: [
        '@nuxtjs/pwa',
    ],
    pwa: {
        icon: false // disables the icon module
    }
})
