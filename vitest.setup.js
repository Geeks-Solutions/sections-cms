import { vi } from 'vitest'

// Mock pinia
vi.mock('pinia', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    createPinia: vi.fn(() => ({})),
    setActivePinia: vi.fn(),
    defineStore: vi.fn(),
  }
})

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

// Make useI18n globally available (for Nuxt components that don't import it)
global.useI18n = vi.fn((options) => ({
  t: vi.fn((key) => key),
  locale: { value: 'en' },
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

// Mock #app imports
vi.mock('#app', () => ({
  useFetch: vi.fn(() => ({
    data: { value: [] },
    status: { value: 'success' },
  })),
  useNuxtApp: vi.fn(() => ({
    $sections: {
      serverUrl: 'https://test-server.com',
      projectId: 'test-project-id',
    },
    $event: vi.fn(),
  })),
  useRoute: vi.fn(() => ({
    path: '/',
    query: {},
    params: {},
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

// Mock leaflet
vi.mock('leaflet', () => ({
  default: {
    icon: vi.fn((options) => options),
    marker: vi.fn(() => ({})),
  },
}))

// Mock uuid
let uuidCounter = 0
vi.mock('uuid', () => ({
  v4: vi.fn(() => `mock-uuid-${uuidCounter++}`),
}))

// Mock @googlemaps/js-api-loader
const mockGoogleMaps = {
  Map: vi.fn().mockImplementation(() => ({
    setCenter: vi.fn(),
    setZoom: vi.fn(),
    fitBounds: vi.fn(),
    getZoom: vi.fn().mockReturnValue(10),
  })),
  LatLngBounds: vi.fn().mockImplementation(() => ({
    extend: vi.fn(),
    getCenter: vi.fn().mockReturnValue({ lat: () => 48.8566, lng: () => 2.3522 }),
  })),
  InfoWindow: vi.fn().mockImplementation(() => ({
    setContent: vi.fn(),
    open: vi.fn(),
    close: vi.fn(),
    addListener: vi.fn(),
  })),
  AdvancedMarkerElement: vi.fn().mockImplementation((options) => ({
    position: options.position,
    setMap: vi.fn(),
    addListener: vi.fn((event, callback) => {
      if (event === 'gmp-click') {
        setTimeout(() => callback(), 0)
      }
    }),
  })),
}

vi.mock('@googlemaps/js-api-loader', () => ({
  Loader: vi.fn().mockImplementation(() => ({
    importLibrary: vi.fn().mockResolvedValue(mockGoogleMaps),
  })),
}))

// Mock #imports imports
vi.mock('#imports', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  useRoute: vi.fn(() => ({
    path: '/',
    query: {},
    params: {},
  })),
  useCookie: vi.fn(() => ({ value: 'test-cookie' })),
  sectionHeader: {},
  showToast: vi.fn(),
}))
