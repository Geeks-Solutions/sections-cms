import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoriesDynamic from '../categories_dynamic.vue'
import BlogsArticlesCategories from '../../../components/Blogs/ArticlesCategories.vue'

const mockCreatePinia = vi.fn(() => ({}))
const mockSetActivePinia = vi.fn()

vi.mock('pinia', () => ({
  createPinia: mockCreatePinia,
  setActivePinia: mockSetActivePinia,
  defineStore: vi.fn(),
}))

vi.mock('@/utils/constants', () => ({
  updateQueryStringValue: vi.fn(),
  importAsset: vi.fn(),
}))

const mockSectionsStore = {
  setCategoriesTitles: vi.fn(),
}

vi.mock('~/stores/index.js', () => ({
  useSectionsStore: vi.fn(() => mockSectionsStore),
}))

vi.mock('#app', () => ({
  useNuxtApp: vi.fn(() => ({
    $event: vi.fn(),
  })),
}))

global.inject = vi.fn((key) => {
  if (key === 'languageSupport') {
    return vi.fn()
  }
  return null
})

global.useNuxtApp = vi.fn(() => ({
  $event: vi.fn(),
}))

describe('CategoriesDynamic.vue', () => {
  let wrapper

  beforeEach(() => {
    mockCreatePinia.mockReturnValue({})
    mockSetActivePinia.mockImplementation(() => {})
    vi.clearAllMocks()
  })

  const factory = (propsData = {}, routePath = '/test') => {
    return mount(CategoriesDynamic, {
      props: {
        section: {
          name: 'test-section',
          render_data: [
            {
              id: 1,
              title: 'Category 1',
              count: 10,
              original_title: 'Category 1',
            },
            {
              id: 2,
              title: 'Category 2',
              count: 20,
              original_title: 'Category 2',
            },
          ],
        },
        lang: 'en',
        ...propsData,
      },
      global: {
        mocks: {
          $route: { path: routePath },
          $t: vi.fn((key) => key),
        },
        provide: {
          languageSupport: vi.fn(),
        },
        components: {
          BlogsArticlesCategories,
        },
      },
    })
  }

  it('emits refresh-section with single category item', async () => {
    wrapper = factory()

    const item = { original_title: 'Test Category' }

    await wrapper.vm.categoryClicked(item)

    expect(mockSectionsStore.setCategoriesTitles).toHaveBeenCalledWith(
      'Test Category',
    )

    const emitted = wrapper.emitted('refresh-section')
    expect(emitted).toBeTruthy()
    expect(emitted.length).toBe(1)

    const eventPayload = emitted[0][0]

    expect(eventPayload).toHaveProperty('qs')
    expect(eventPayload.qs).toHaveProperty('categories_titles')
    expect(Array.isArray(eventPayload.qs.categories_titles)).toBe(true)
    expect(eventPayload.qs.categories_titles).toContain('Test Category')
    expect(eventPayload.qs.offset_ca).toBe(0)
    expect(eventPayload.qs.sort).toBeUndefined()
  })

  it('emits refresh-section with array of categories', async () => {
    wrapper = factory()

    const items = [
      { original_title: 'Category 1' },
      { original_title: 'Category 2' },
      { original_title: 'Category 3' },
    ]

    await wrapper.vm.categoryClicked(items)

    expect(mockSectionsStore.setCategoriesTitles).toHaveBeenCalledWith(
      'Category 1,Category 2,Category 3',
    )

    const emitted = wrapper.emitted('refresh-section')
    expect(emitted).toBeTruthy()
    expect(emitted.length).toBe(1)

    const eventPayload = emitted[0][0]

    expect(eventPayload).toHaveProperty('qs')
    expect(eventPayload.qs).toHaveProperty('categories_titles')
    expect(Array.isArray(eventPayload.qs.categories_titles)).toBe(true)
    expect(eventPayload.qs.categories_titles).toEqual([
      'Category 1',
      'Category 2',
      'Category 3',
    ])
    expect(eventPayload.qs.offset_ca).toBe(0)
    expect(eventPayload.qs.sort).toBeUndefined()
  })

  it('renders BlogsArticlesCategories component', () => {
    wrapper = factory()

    const blogsCategoriesComponent = wrapper.findComponent(
      BlogsArticlesCategories,
    )
    expect(blogsCategoriesComponent.exists()).toBe(true)
    expect(blogsCategoriesComponent.props('section')).toEqual(
      wrapper.props('section'),
    )
    expect(blogsCategoriesComponent.props('lang')).toBe('en')
  })

  it('passes category-clicked events to BlogsArticlesCategories', () => {
    wrapper = factory()

    const blogsCategoriesComponent = wrapper.findComponent(
      BlogsArticlesCategories,
    )
    const item = { original_title: 'Test Category' }

    blogsCategoriesComponent.vm.$emit('category-clicked', item)

    const emitted = wrapper.emitted('refresh-section')
    expect(emitted).toBeTruthy()
    expect(emitted.length).toBe(1)
  })
})
