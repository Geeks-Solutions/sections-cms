import { defineVitestConfig } from '@nuxt/test-utils/config'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('./', import.meta.url))

export default defineVitestConfig({
  plugins: [],
  test: {
    globals: true,
    environment: 'nuxt',
    setupFiles: [],
    server: {
      deps: {
        inline: [/vue-router/],
      },
    },
    testTimeout: 5000,
  },
  resolve: {
    alias: {
      '~': rootDir,
      '@': rootDir,
      '#app': fileURLToPath(
        new URL('./node_modules/nuxt/dist/app', import.meta.url),
      ),
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
})
