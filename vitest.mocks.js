import { vi } from 'vitest'

export const useFetch = vi.fn(() => ({
  data: { value: [] },
  status: { value: 'success' },
}))

export const useNuxtApp = vi.fn(() => ({
  $sections: {
    serverUrl: 'https://test-server.com',
    projectId: 'test-project-id',
  },
  $event: vi.fn(),
}))

export const useRoute = vi.fn(() => ({
  path: '/',
  query: {},
  params: {},
}))

export const useRouter = vi.fn(() => ({
  push: vi.fn(),
}))

export const useCookie = vi.fn(() => ({ value: 'test-cookie' }))

export const sectionHeader = {}

export const showToast = vi.fn()

export const createPinia = vi.fn(() => ({}))
export const setActivePinia = vi.fn()
export const defineStore = vi.fn()
export const mapState = vi.fn()
export const mapActions = vi.fn()
export const mapGetters = vi.fn()

// Export useI18n to make it available from #app
export const useI18n = vi.fn((options) => ({
  t: vi.fn((key) => key),
  locale: { value: 'en' },
}))
