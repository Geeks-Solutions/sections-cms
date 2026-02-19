import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      include: [
        'generator/template/ready-to-use-section-types/sections/forms/*.vue',
        'generator/template/ready-to-use-section-types/sections/views/*.vue',
        'generator/template/ready-to-use-section-types/sections/**/*.js',
      ],
      exclude: [
        'node_modules/',
        'coverage/',
        '**/__tests__/**',
        '**/nft_mint_whitelist.vue',
        '**/ServicePackages.vue',
        '**/server/**',
      ],
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(
        new URL('./generator/template/ready-to-use-section-types', import.meta.url)
      ),
      '~': fileURLToPath(
        new URL('./generator/template/ready-to-use-section-types', import.meta.url)
      ),
      '#app': fileURLToPath(new URL('./vitest.mocks.js', import.meta.url)),
      '#imports': fileURLToPath(new URL('./vitest.mocks.js', import.meta.url)),
      'vue-select/dist/vue-select.css': fileURLToPath(new URL('./stub.css', import.meta.url)),
    },
  },
})
