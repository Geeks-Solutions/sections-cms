import { shallowMount } from '@vue/test-utils'
import CategoriesArticlesConfigurable from '../categories_articles_configurable.vue'
import { extractQsValue } from '../../../utils/constants'

vi.mock('@/utils/constants', () => ({
  isAnchorOrExternalLink: vi.fn(),
  emitGlobalEvent: vi.fn(),
  isGlobalEvent: vi.fn(),
  linkTarget: vi.fn(),
  extractQsValue: vi.fn(),
  importAsset: vi.fn(),
  BLOGS_LIST_SIZE: 40,
  BLOGS_SECTION_PAGE_PATH: '/blogs',
}))

describe('totalPages computed property', () => {
  const factory = (propsData = {}, routePath = '') => {
    return shallowMount(CategoriesArticlesConfigurable, {
      global: {
        config: {
          globalProperties: {
            $route: { path: routePath },
          },
        },
      },
      data() {
        return {
          // sectionRenderSettings: propsData.sectionRenderSettings || null,
          // sectionRenderData: propsData.sectionRenderData || null,
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
    extractQsValue.mockReturnValue(null)
    const wrapper = factory({
      section: {
        render_data: [
          {
            data: {
              total: 80,
              articles: [{}],
            },
            settings: { default_limit: '' },
          },
        ],
      },
    })
    expect(wrapper.vm.totalPages).toBe(2)
  })

  it('should use sectionRenderSettings.default_limit if available ', () => {
    extractQsValue.mockReturnValue(null)
    const wrapper = factory({ sectionRenderSettings: { default_limit: 5 } })
    expect(wrapper.vm.totalPages).toBe(1)
  })

  it('should use query string value if present', async () => {
    await vi.resetAllMocks()
    extractQsValue.mockReturnValue(40)
    const wrapper = factory(
      {
        section: {
          render_data: [
            {
              data: {
                total: 80,
                articles: [{}],
              },
              settings: { default_limit: '' },
            },
          ],
        },
      },
      '/limit_ca=40',
    )
    expect(wrapper.vm.totalPages).toBe(2)
  })

  it('should compute the correct totalPages based on sectionRenderData', () => {
    extractQsValue.mockReturnValue(null)
    const wrapper = factory({
      section: {
        render_data: [
          {
            data: {
              total: 50,
              articles: [{}],
            },
            settings: { default_limit: 5 },
          },
        ],
      },
    })
    expect(wrapper.vm.totalPages).toBe(10)
  })
})
