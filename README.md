# vue-cli-plugin-sections

A Vue js plugin to install and configure [@geeks.solutions/vue-sections](https://www.npmjs.com/package/@geeks.solutions/vue-sections) OR [@geeks.solutions/nuxt-sections](https://www.npmjs.com/package/@geeks.solutions/nuxt-sections) library.

### How to install vue-cli-plugin-sections plugin:

 - npm i @geeks.solutions/vue-cli-plugin-sections

### How to run the plugin:

 - vue invoke @geeks.solutions/vue-cli-plugin-sections

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

 * Add 3 fully customizable and ready to use section types only if answered yes on the fourth question
``? Add 3 ready to use section types to your project Yes``

 * If you answered yes for adding 3 ready to use section types, you should find all declarations of `@geeks.solutions/nuxt-sections/lib/src/utils` (`wysiwyg.vue` under `sections/base/components/` and `nftSection.vue` under `sections/forms/`) and replace them by `@geeks.solutions/vue-sections` for the sections to work correctly


#### If Nuxt js is selected from the first question:

 * Add "@geeks.solutions/nuxt-sections" to you package.json + its required dependencies and install them:
    - "cookie-universal-nuxt"

 * Update nuxt.config.js with modules and publicRuntimeConfig required by nuxt-sections.
 
 * Create file configuration for i18n required by the library under /lang/en.js /lang/fr.js

 * Create a configured first page with sections under /pages/_url.vue

 * Add 3 fully customizable and ready to use section types + the required Tailwind configurations for them only if answered yes on the fourth question
``? Add 3 ready to use section types to your project Yes``

