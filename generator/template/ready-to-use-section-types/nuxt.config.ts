// export default defineNuxtConfig({
//   modules: [
//     "@geeks.solutions/nuxt-sections",
//     "@nuxt/image",
//     "@nuxtjs/i18n",
//     "@nuxtjs/tailwindcss",
//     "nuxt-lazytube",
//     "nuxt3-leaflet"
//   ],
//   i18n: {
//     strategy: "no_prefix",
//     detectBrowserLanguage: false,
//     defaultLocale: "en",
//     locales: [
//       {
//         name: "French",
//         code: "fr",
//         iso: "fr",
//         file: "fr.js"
//       },
//       {
//         name: "English",
//         code: "en",
//         iso: "en",
//         file: "en.js"
//       }
//     ],
//     langDir: "lang/"
//   },
//   tailwindcss: {
//
//   },
//   plugins: [
//   ],
//   devtools: { enabled: true },
//   compatibilityDate: '2025-05-13',
//   runtimeConfig: {
//     public: {
//       sections: {
//         projectId: process.env.NUXT_ENV_SECTIONS_PROJECT_ID,
//         projectUrl: process.env.NUXT_ENV_SECTIONS_PROJECT_URL,
//         environment: process.env.NUXT_ENV_SECTIONS_ENV,
//         queryStringSupport: process.env.NUXT_ENV_SECTIONS_QUERY_STRING_SUPPORT,
//         // projectLocales: process.env.NUXT_ENV_SECTIONS_LOCALES ?? 'en,fr',
//         cname: process.env.NUXT_ENV_SECTIONS_CNAME
//       },
//       SIGNATURE_PACKAGES: process.env.NUXT_ENV_SIGNATURE_PACKAGES
//     }
//   }
// })
