import { vi } from 'vitest'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  createI18n: vi.fn((config) => ({
    global: {
      locale: config.locale || 'en',
      messages: config.messages || {},
    },
  })),
  useI18n: vi.fn(() => ({
    t: vi.fn((key) => key),
    locale: { value: 'en' },
  })),
}))

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    put: vi.fn(),
    get: vi.fn(),
  },
  post: vi.fn(),
  put: vi.fn(),
  get: vi.fn(),
}))

// Global window mocks
global.window = global.window || {}
global.window.$nuxt = {
  $cookies: {
    get: vi.fn((key) => {
      if (key === 'meta-project-id') {
        return 'mocked-project-id'
      }
      return null
    }),
  },
  $emit: vi.fn(),
}

// Global mocks object for use in tests
global.mocks = {
  $cookies: {
    get: vi.fn(() => '1'),
    set: vi.fn(),
    remove: vi.fn(),
    getAll: vi.fn(),
  },
  $t: vi.fn((key) => key),
  $i18n: {
    locale: 'en',
  },
  $config: vi.fn(),
  $axios: {
    put: vi.fn(),
    post: vi.fn(),
    get: vi.fn(),
  },
  $route: {
    query: {},
    params: {},
    path: '/',
  },
  $router: {
    push: vi.fn(),
  },
  $toast: {
    show: vi.fn(),
  },
  localePath: vi.fn((path) => path),
  $nuxt: {
    $emit: vi.fn(),
  },
}
