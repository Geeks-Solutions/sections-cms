import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import CategoriesArticlesConfigurable from '../categories_articles_configurable.vue'
import { extractQsValue } from '../../../utils/constants'

vi.mock('pinia', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    createPinia: vi.fn(() => ({})),
    setActivePinia: vi.fn(),
    defineStore: vi.fn(),
  }
})

global.inject = vi.fn((key) => {
  if (key === 'languageSupport') {
    return vi.fn()
  }
  return null
})

describe('totalPages computed property', () => {
  const factory = (propsData = {}, routePath = '') => {
    return shallowMount(CategoriesArticlesConfigurable, {
      global: {
        config: {
          globalProperties: {
            $route: { path: routePath },
          },
        },
        provide: {
          languageSupport: vi.fn(),
        },
      },
      data() {
        return {
          BLOGS_SECTION_PAGE_PATH: '/blogs',
        }
      },
      props: {
        section: {
          render_data: [
            {
              data: {},
            },
          ],
        },
        ...propsData,
      },
    })
  }

  it('should default to BLOGS_LIST_SIZE when no conditions are met', () => {
    const wrapper = factory({
      section: {
        render_data: [
          {
            data: {
              total: 24,
              articles: [{}],
            },
            settings: { default_limit: '' },
          },
        ],
      },
    })
    expect(wrapper.vm.totalPages).toBe(2)
  })

  it('should use section.render_data[0].settings.default_limit if available', () => {
    const wrapper = factory({
      section: {
        render_data: [
          {
            data: {
              total: 10,
              articles: [{}],
            },
            settings: { default_limit: 5 },
          },
        ],
      },
    })
    expect(wrapper.vm.totalPages).toBe(2)
  })

  it('should use query string value if present', async () => {
    const wrapper = factory(
      {
        section: {
          render_data: [
            {
              data: {
                total: 24,
                articles: [{}],
              },
              settings: { default_limit: '' },
            },
          ],
        },
      },
      '/limit_ca=6',
    )
    expect(wrapper.vm.totalPages).toBe(4)
  })

  it('should compute the correct totalPages based on sectionRenderData', () => {
    const wrapper = factory({
      section: {
        render_data: [
          {
            data: {
              total: 25,
              articles: [{}],
            },
            settings: { default_limit: 5 },
          },
        ],
      },
    })
    expect(wrapper.vm.totalPages).toBe(5)
  })

  it('should use query string value even when default_limit is set', () => {
    const wrapper = factory(
      {
        section: {
          render_data: [
            {
              data: {
                total: 24,
                articles: [{}],
              },
              settings: { default_limit: 5 },
            },
          ],
        },
      },
      '/limit_ca=8',
    )
    expect(wrapper.vm.totalPages).toBe(3)
  })

  it('should return 1 when sectionRenderData is null', () => {
    const wrapper = factory({
      section: {
        render_data: [],
      },
    })
    expect(wrapper.vm.totalPages).toBe(1)
  })
})
