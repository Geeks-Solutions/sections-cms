module.exports = (api, options, rootOptions) => {
    if (options.choice === 'nuxt') {
        api.extendPackage({
            dependencies: {
                "vue-metamask": "^2.2.1",
                "web3": "^1.7.3",
                "js-sha256": "^0.9.0",
                "@geeks.solutions/nuxt-sections": "^1.1.5",
                "@googlemaps/js-api-loader": "^1.16.6",
                "@nuxtjs/gtm": "^2.4.0",
                "consola": "^3.0.1",
                "core-js": "^3.25.3",
                "hooper": "^0.3.4",
                "leaflet": "^1.9.4",
                "nuxt": "^2.15.8",
                "@nuxtjs/i18n": "^9.5.3",
                "vue": "2.7.10",
                "vue-dragscroll": "^3.0.1",
                "nuxt-lazytube": "^0.2.2",
                "vue-server-renderer": "2.7.10",
                "vue-template-compiler": "2.7.10",
                "nuxt3-leaflet": "^1.0.13",
                "uuid": "3.4.0",
                "@nuxt/image": "^0.7.1"
            },
            "devDependencies": {
                "@babel/eslint-parser": "^7.14.7",
                "@nuxtjs/eslint-config": "^6.0.1",
                "@nuxtjs/eslint-module": "^3.0.2",
                "@nuxtjs/tailwindcss": "^6.14.0",
                "@vue/test-utils": "^1.3.0",
                "babel-core": "7.0.0-bridge.0",
                "babel-jest": "^27.4.4",
                "eslint": "^7.29.0",
                "eslint-config-prettier": "^8.3.0",
                "eslint-plugin-nuxt": "^2.0.0",
                "eslint-plugin-vue": "^7.12.1",
                "jest": "^27.4.4",
                "postcss": "^8.4.17",
                "tailwindcss-pixel-dimensions": "^1.0.2",
                "vue-jest": "^3.0.4"
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
        api.extendPackage({
            devDependencies: {
                "@nuxtjs/tailwindcss": "^6.6.8",
                "tailwindcss-pixel-dimensions": "^1.0.2",
                "consola": "^3.1.0"
            }
        })
    }
}

module.exports.hooks = (api, options) => {

    api.afterInvoke(() => {
        const {EOL} = require('os')
        const fs = require('fs')
        const contentMain = fs.readFileSync(api.resolve('nuxt.config.js'), {encoding: 'utf-8'})
        let lines = contentMain.split(/\r?\n/g)

        const renderIndex0 = lines.findIndex(line => line.match(/export default/))
        if (options.choice === 'nuxt') {
            lines[renderIndex0] = lines[renderIndex0].replace(`{`, `{\rcomponents: true,`)
        }

        const renderIndex01 = lines.findIndex(line => line.match(/css:/))
        if (options.choice === 'nuxt') {
            lines[renderIndex01] = lines[renderIndex01].replace(`[`, `\r'~/assets/css/default.css',`)
        }

        const renderIndex1 = lines.findIndex(line => line.match(/plugins:/))
        if (options.choice === 'vue') {
            lines[renderIndex1] = lines[renderIndex1].replace(`[`, `[\r{ src: '~/plugins/sections.js', ssr: false },`)
        } else {
            lines[renderIndex1] = lines[renderIndex1].replace(`[`, `[\r{ src: '~/plugins/vue-lazytube', ssr: false },\r{ src: '~/plugins/vue-dragscroll.js', ssr: false }`)
        }

        if(options.addReadyToUseSectionTypes) {
            const renderIndex4 = lines.findIndex(line => line.match(/buildModules:/))
            lines[renderIndex4] = lines[renderIndex4].replace(`[`, `[\r
    '@nuxtjs/tailwindcss',`)
        }

        const renderIndex2 = lines.findIndex(line => line.match(/modules:/))
        if (options.choice === 'nuxt') {
            lines[renderIndex2] = lines[renderIndex2].replace(`[`, `[\r
    '@geeks.solutions/nuxt-sections',\r
    '@nuxtjs/axios',\r
    'cookie-universal-nuxt',\r
    '@nuxt/image',\r
    [
      "@nuxtjs/i18n",
      {
        lazy: true,
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
        loadLanguagesAsync: true,
        langDir: "lang/",
        defaultLocale: "en"
      }
    ],\r
    [
      "vue-toastification/nuxt",
      {
        transition: "Vue-Toastification__fade",
        maxToasts: 20,
        newestOnTop: true
      }
    ]`)
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

        const renderIndex3 = lines.findIndex(line => line.match(/build:/))
        if (options.choice === 'nuxt') {
            lines[renderIndex3] = lines[renderIndex3].replace(`build: {`, `publicRuntimeConfig: {\r
    sections: {
      projectId: "${options.projectId}",
      projectUrl: "${options.projectUrl}",
      environment: ""
    }
  },\r\r
  build: {`)
        }

        fs.writeFileSync(api.resolve('nuxt.config.js'), lines.join(EOL), {encoding: 'utf-8'})

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
