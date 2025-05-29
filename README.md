# vue-cli-plugin-sections

A Vue js plugin to install and configure [@geeks.solutions/vue-sections](https://www.npmjs.com/package/@geeks.solutions/vue-sections) OR [@geeks.solutions/nuxt-sections](https://www.npmjs.com/package/@geeks.solutions/nuxt-sections) library.

### How to install vue-cli-plugin-sections plugin:

* Have Node version: 22.16.0 installed

* Create a new nuxt js 3 app: Run `npm create nuxt <your-project-name>` and follow the below selection when prompted, then open it in your editor (if using Nuxt js 3)
 
  - Which package manager would you like to use?: npm
  - Would you like to install any of the official modules?: None, Press Enter to skip

* Run `npm install @geeks.solutions/vue-cli-plugin-sections`
  Or if plugin is forked and downloaded to your local machine, add it as a dependency like `"@geeks.solutions/vue-cli-plugin-sections": "file:path-to-the-forked-library",`, and Run `npm install`

* Run `npm install -g @vue/cli` (if using Nuxt js 3)

### How to run the plugin:

* Run `vue invoke '@geeks.solutions/vue-cli-plugin-sections'`

The plugin will prompt you to answer three questions:

````
? What version of sections would you like to install on your project:: Nuxt js
? What is your project url: http://localhost:8000
? What is your project ID: 1d23few45rw213qd6
````

### What does the plugin perform:

#### If Vue js is selected from the first question:

 * Add "@geeks.solutions/vue-sections" to you package.json + its required dependencies and install them:
    - "bootstrap-vue"
    - "cookie-universal-nuxt"
    - "nuxt-i18n"

 * Update nuxt.config.js with plugin and modules required by vue-sections.

 * Create file configuration with your project url and id under /plugins/sections.js.

 * Create file configuration for i18n required by the library under /lang/en.js

 * Create a configured first page with sections under /pages/url.vue only if answered yes on the third question
``? Add vue-sections configuration with first sections page Yes``

 * Add 12 fully customizable and ready to use section types only if answered yes on the fourth question
``? Add 13 ready to use section types to your project Yes``

 * If you answered yes for adding 13 ready to use section types, you should find all declarations of `@geeks.solutions/nuxt-sections/lib/src/utils` (`wysiwyg.vue` under `sections/base/components/` and `nftSection.vue` under `sections/forms/`) and replace them by `@geeks.solutions/vue-sections` for the sections to work correctly


#### If Nuxt js is selected from the first question:

 * Add "@geeks.solutions/nuxt-sections" to you package.json + its required dependencies and install them:
   - '@nuxt/image',
   - '@nuxtjs/i18n',
   - '@nuxtjs/tailwindcss',
   - 'nuxt-lazytube',
   - 'nuxt3-leaflet'

 * Update nuxt.config.ts with modules and runtimeConfig required by nuxt-sections.
 
 * Create file configuration for i18n required by the library under /i18n/lang/en.js /i18n/lang/fr.js

 * Create a configured first page with sections under /pages/_url.vue

 * Update nitro configuration to enable Text Compressions with gzip and brotli (Better for page speed performance)

 * Add 13 fully customizable and ready to use section types + the required Tailwind configurations for them only if answered yes on the fourth question
``? Add 13 ready to use section types to your project Yes``

### Contribute

To contribute and add new sections, read our [contributors guidelines](https://github.com/Geeks-Solutions/vue-cli-plugin-sections/wiki/contributors-guidelines).
For guidelines on creating new section components specifically, please see our [Section Contribution Guidelines](CONTRIBUTING_SECTIONS.md).