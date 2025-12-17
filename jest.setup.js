jest.mock('axios', () => ({
  post: jest.fn(),
  put: jest.fn(),
  get: jest.fn(),
}))

global.window.$nuxt = {
  $cookies: {
    get: jest.fn((key) => {
      if (key === 'meta-project-id') {
        return 'mocked-project-id' // Return the mock value
      }
      return null
    }),
  },
}

global.mocks = {
  $cookies: {
    get: jest.fn(() => '1'),
    set: jest.fn(),
    remove: jest.fn(),
    getAll: jest.fn(),
  },
  $t: jest.fn((key) => key),
  $i18n: jest.fn(),
  $config: jest.fn(),
  $axios: {
    put: require('axios').put, // Mock the $axios.put method
    post: require('axios').post, // Mock the $axios.put method
    get: require('axios').get, // Mock the $axios.put method
  },
  $route: {
    query: jest.fn(), // Mock the $axios.put method
  },
  $router: {
    push: jest.fn(), // Mock the $axios.put method
  },
  $toast: { show: jest.fn() },
  localePath: jest.fn(),
  $nuxt: {
    $emit: jest.fn(),
  },
}
