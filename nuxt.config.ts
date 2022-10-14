// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
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
    ]
})
