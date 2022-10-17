// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: ["@nuxt/content"],
    buildModules: [
        '@nuxtjs/pwa', '@nuxt/typescript-build'
    ],
    pwa: {
        icon: false // disables the icon module
    },
    "meta": [
        {
            "name": "viewport",
            "content": "width=device-width, initial-scale=1"
        },
        {
            "charset": "utf-8"
        }
    ],
    noscript: [
        // <noscript>Javascript is required</noscript>
        { children: 'Javascript is required' }
    ],
    content: {
        // https://content.nuxtjs.org/api/configuration
    }
})
