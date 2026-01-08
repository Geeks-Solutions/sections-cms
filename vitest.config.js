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
        '**/*.spec.js',
        '**/__tests__/**',
        '**/GoogleMaps.vue',
        '**/GoogleMaps_static.vue',
        '**/nft_mint_whitelist.vue',
        '**/RestaurantMenu.vue',
        '**/ServicePackages.vue',
        '**/SimpleMenu.vue',
        '**/server/**',
      ],
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
    },
  },
})
