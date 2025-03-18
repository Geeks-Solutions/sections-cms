const axios = require('axios');

module.exports = (api, options, rootOptions) => {
    if (options.choice === 'nuxt') {
        api.extendPackage({
            dependencies: {
                "@geeks.solutions/nuxt-sections": "^1.0.0",
                "cookie-universal-nuxt": "^2.1.4",
                "vue-metamask": "^2.2.1",
                "web3": "^1.7.3",
                "js-sha256": "^0.9.0"
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
        const lines = contentMain.split(/\r?\n/g)

        const renderIndex1 = lines.findIndex(line => line.match(/plugins:/))
        if (options.choice === 'vue') {
            lines[renderIndex1] = lines[renderIndex1].replace(`[`, `[\r{ src: '~/plugins/sections.js', ssr: false },`)
        } else {
            lines[renderIndex1] = lines[renderIndex1].replace(`[`, `[\r{ src: '~/plugins/vue-lazytube', ssr: false },`)
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

            if(options.addReadyToUseSectionTypes) {

                const enTranslations = `export default {
  "contractAddr": "Contract Address*: ",
  "contractABI": "Contract ABI*: ",
  "tokenType": "Token type: ",
  "imageURL": "Image: ",
  "imageDesc": "Image Description: ",
  "price": "Price: ",
  "totalSupply": "Total Supply: ",
  "maxSupply": "Max Supply: ",
  "maxPerTx": "Max Per Transaction: ",
  "maxBuyPerAddress": "Max Buy Per Address: ",
  "publicSale": "Public Sale: ",
  "contractPause": "Contract paused: ",
  "freePerAddress": "Free per address: ",
  "balance": "NFTs minted per wallet",
  "balanceLabel": "Minted NFTs",
  "amount": "Amount",
  "total": "Total",
  "tokenTotal": "Tokens Total",
  "mintTitle": "Mint NFT",
  "connect": "Connect",
  "pay": "Extra Tip",
  "payPriceError": "Price has to be minimum equal to the price set in the contract X the number of tokens to mint",
  "contractSetTitle": "Contract details",
  "imageSetTitle": "Image details",
  "fill-required-fields": "Please fill the required fields",
  fieldSetTitle: "Contract function names",
  fieldSetTitle2: "Secondary contracts",
  fieldSetDesc: "Put the name of the contract functions to be invoked in order to collect the values indicated in the field label",
  fieldSetDesc2: "Add a new contract set",
  contractID: "Contract ID",
  requiredTokenType: "Token type is required",
  privacyPolicy: "Privacy Policy",
  termsConditions: "Terms & conditions",
  "ADD NEW Container": "ADD NEW Container",
  Title_FR: "Title French",
  Title: "Title English*",
  Text_FR: "Text French",
  Text: "Text English",
  SubTitle: "English Description",
  SubTitle_FR: "English Description",
  enTranslation: "English Translation",
  frTranslation: "French Translation",
  button_text_1: "Button Text 1st Row",
  button_text_2: "Button Text 2nd Row",
  "Terms Policy": "Terms and Policy"
}`

                const frTranslations = `export default {
  "contractAddr": "Contract Address*: ",
  "contractABI": "Contract ABI*: ",
  "tokenType": "Token type: ",
  "imageURL": "Image: ",
  "imageDesc": "Image Description: ",
  "price": "Price: ",
  "totalSupply": "Total Supply: ",
  "maxSupply": "Max Supply: ",
  "maxPerTx": "Max Per Transaction: ",
  "maxBuyPerAddress": "Max Buy Per Address: ",
  "publicSale": "Public Sale: ",
  "contractPause": "Contract paused: ",
  "freePerAddress": "Free per address: ",
  "balance": "NFTs minted per wallet",
  "balanceLabel": "Minted NFTs",
  "amount": "Amount",
  "total": "Total",
  "tokenTotal": "Tokens Total",
  "mintTitle": "Mint NFT",
  "connect": "Connect",
  "pay": "Extra Tip",
  "payPriceError": "Price has to be minimum equal to the price set in the contract X the number of tokens to mint",
  "contractSetTitle": "Contract details",
  "imageSetTitle": "Image details",
  privacyPolicy: "Politique du site",
  termsConditions: "Termes et conditions",
  "ADD NEW Container": "AJOUTER UN NOUVEAU Conteneur",
  Title_FR: "Titre Français",
  Title: "Titre Anglais*",
  Text_FR: "Texte Français",
  Text: "Texte Anglais",
  Text_EN: "Texte Anglais",
  SubTitle: "Description en Anglais",
  SubTitle_FR: "Description Française",
  enTranslation: "Translation Anglaise ",
  frTranslation: "Translation Française",
  button_text_1: "Texte du bouton 1ère ligne",
  button_text_2: "Texte du bouton 2ème ligne",
  "Terms Policy": "Termes et Police"
}`

                fs.writeFileSync(api.resolve('lang/en.js'), enTranslations, {encoding: 'utf-8'})
                fs.writeFileSync(api.resolve('lang/fr.js'), frTranslations, {encoding: 'utf-8'})

            }

            if (options.choice === 'vue') {
                const contentSections = fs.readFileSync(api.resolve('plugins/sections.js'), {encoding: 'utf-8'})
                const linesSections = contentSections.split(/\r?\n/g)

                const renderSectionsIndex1 = linesSections.findIndex(line => line.match(/projectId:/))
                linesSections[renderSectionsIndex1] = linesSections[renderSectionsIndex1].replace(`""`, `"${options.projectId}"`)

                const renderSectionsIndex2 = linesSections.findIndex(line => line.match(/projectUrl:/))
                linesSections[renderSectionsIndex2] = linesSections[renderSectionsIndex2].replace(`""`, `"${options.projectUrl}"`)

                fs.writeFileSync(api.resolve('plugins/sections.js'), linesSections.join(EOL), {encoding: 'utf-8'})
            }

            fs.renameSync(api.resolve('pages/.url.vue'), api.resolve('pages/_url.vue'));
        })
    })
}
