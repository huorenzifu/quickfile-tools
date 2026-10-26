// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
  ],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  compatibilityDate: '2024-11-01',
  app: {
    head: {
      titleTemplate: '%s · QuickFile Tools',
      htmlAttrs: { lang: 'en' },
      meta: [
        {
          name: 'description',
          content: 'Free browser-based image and PDF tools. Files stay on your device.',
        },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  runtimeConfig: {
    public: {
      // Set in Vercel: NUXT_PUBLIC_GA_ID=G-XXXXXXXX
      gaId: '',
      siteUrl: 'https://quickfile-tools.vercel.app',
    },
  },
  nitro: {
    prerender: {
      routes: ['/', '/tools', '/blog', '/about', '/contact', '/privacy', '/terms'],
      crawlLinks: true,
    },
  },
})
