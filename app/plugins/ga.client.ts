export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const gaId = String(config.public.gaId || '').trim()
  if (!gaId) return

  useHead({
    script: [
      {
        key: 'ga4-src',
        src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`,
        async: true,
      },
      {
        key: 'ga4-config',
        innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`,
      },
    ],
  })
})
