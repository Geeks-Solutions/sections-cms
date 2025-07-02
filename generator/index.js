module.exports = (api, options, rootOptions) => {
    if (options.choice === 'nuxt') {
        api.extendPackage({
            dependencies: {
                "@geeks.solutions/nuxt-sections": "3.0.6",
                "@googlemaps/js-api-loader": "^1.16.6",
                "@gtm-support/vue-gtm": "^3.1.0",
                "leaflet": "^1.9.4",
                "nuxt": "^3.17.1",
                "@nuxtjs/i18n": "^9.5.3",
                "@nuxt/image": "^1.10.0",
                "vue-dragscroll": "^4.0.6",
                "nuxt-lazytube": "^0.2.2",
                "nuxt3-leaflet": "^1.0.13",
                "uuid": "3.4.0",
                "pinia": "^3.0.2",
                "@pinia/nuxt": "^0.11.0",
                "h3-compression": "^0.3.2"
            },
            "devDependencies": {
                "@nuxt/eslint": "^1.3.0",
                "@nuxt/eslint-config": "^1.3.0",
                "@nuxt/test-utils": "^3.17.2",
                "@nuxtjs/tailwindcss": "^6.14.0",
                "@testing-library/vue": "^8.1.0",
                "@vue/test-utils": "^2.4.6",
                "eslint": "^9.25.1",
                "happy-dom": "^17.4.6",
                "vitest": "^3.1.2"
            }
        })
        api.render('./template/nuxt-sections-first-page', {
            ...options
        })

    } else {
        api.extendPackage({
            dependencies: {
                "@geeks.solutions/vue-sections": "^1.0.23",
                "bootstrap-vue": "^2.21.2",
                "cookie-universal-nuxt": "^2.1.4",
                "nuxt-i18n": "^6.20.5",
                "vue-metamask": "^2.2.1",
                "web3": "^1.7.3",
                "js-sha256": "^0.9.0"
            }
        })
        api.render('./template/vue-sections', {
            ...options,
        })
        if (options.addSectionsFiles) {
            api.render('./template/vue-sections-first-page', {
                ...options
            })
        }
    }

    if (options.addReadyToUseSectionTypes) {
        api.render('./template/ready-to-use-section-types', {
            ...options,
        })
    }
}

module.exports.hooks = (api, options) => {

    api.afterInvoke(() => {
        const {EOL} = require('os')
        const fs = require('fs')
        const contentMain = fs.readFileSync(api.resolve('nuxt.config.ts'), {encoding: 'utf-8'})
        let lines = contentMain.split(/\r?\n/g)

        const renderIndex0 = lines.findIndex(line => line.match(/export default/))
        if (options.choice === 'nuxt') {
            lines[renderIndex0] = lines[renderIndex0].replace(`{`, `{
  \rmodules: [\r
    '@geeks.solutions/nuxt-sections',\r
    '@nuxt/image',\r
    '@nuxtjs/i18n',\r
    '@nuxtjs/tailwindcss',\r
    'nuxt-lazytube',\r
    'nuxt3-leaflet',\r
    '@pinia/nuxt'\r],
  \rcss: ['~/assets/css/default.css'],
  \rplugins: ['~/plugins/vue-dragscroll.js'],
  \ri18n: {
    detectBrowserLanguage: false,
    defaultLocale: "en",
    locales: [
      {
        name: "French",
        code: "fr",
        iso: "fr",
        file: "fr.js"
      },
      {
        name: "English",
        code: "en",
        iso: "en",
        file: "en.js"
      }
    ],
    langDir: "lang/"
  },\r
  runtimeConfig: {
    public: {
      sections: {
        projectId: "${options.projectId}",
        projectUrl: "${options.projectUrl}",
        environment: ""
      }
    }
  },\r
  vite: {
    optimizeDeps: {
      include: ['quill', '@devdcodes9/quill-emojijs', 'quill-table-ui'],
    }
  },\r
  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true
    }
  },`)
        }

        const renderIndex1 = lines.findIndex(line => line.match(/plugins:/))
        if (options.choice === 'vue') {
            lines[renderIndex1] = lines[renderIndex1].replace(`[`, `[\r{ src: '~/plugins/sections.js', ssr: false },`)
        }


        const renderIndex2 = lines.findIndex(line => line.match(/modules:/))
        if (options.choice === 'nuxt') {

        } else {
            lines[renderIndex2] = lines[renderIndex2].replace(`[`, `[\r'bootstrap-vue/nuxt',
    [
      "nuxt-i18n",
      {
        lazy: true,
        locales: [
          {
            name: "English",
            code: "en",
            iso: "en",
            file: "en.js"
          }
        ],
        loadLanguagesAsync: true,
        langDir: "lang/",
        defaultLocale: "en"
      }
    ],`)
        }

        fs.writeFileSync(api.resolve('nuxt.config.ts'), lines.join(EOL), {encoding: 'utf-8'})

        api.onCreateComplete(async () => {

            if (options.choice === 'vue') {
                const contentSections = fs.readFileSync(api.resolve('plugins/sections.js'), {encoding: 'utf-8'})
                const linesSections = contentSections.split(/\r?\n/g)

                const renderSectionsIndex1 = linesSections.findIndex(line => line.match(/projectId:/))
                linesSections[renderSectionsIndex1] = linesSections[renderSectionsIndex1].replace(`""`, `"${options.projectId}"`)

                const renderSectionsIndex2 = linesSections.findIndex(line => line.match(/projectUrl:/))
                linesSections[renderSectionsIndex2] = linesSections[renderSectionsIndex2].replace(`""`, `"${options.projectUrl}"`)

                fs.writeFileSync(api.resolve('plugins/sections.js'), linesSections.join(EOL), {encoding: 'utf-8'})
            }

        })
    })
}
