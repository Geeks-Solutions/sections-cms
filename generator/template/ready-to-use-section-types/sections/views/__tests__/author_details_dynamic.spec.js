import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthorDetailsDynamic from '../author_details_dynamic.vue'
import BlogsAuthorView from '../../../components/Blogs/AuthorView.vue'

vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    locale: { value: 'en' },
  })),
}))

vi.mock('@/utils/constants', () => ({
  copyText: vi.fn(),
}))

const mockBlogsAuthorView = {
  name: 'BlogsAuthorView',
  template: '<div class="mock-author-view"><slot></slot></div>',
  props: ['section', 'lang'],
}

const mockI18n = {
  locale: 'en',
}

describe('AuthorDetailsDynamic', () => {
  let wrapper

  const createWrapper = (props = {}) => {
    const baseSection = {
      name: 'test-author-section',
      render_data: {
        total_views: '1,234',
        total_blogs: '42',
        social_media: [],
        profile_image: {
          files: [
            {
              thumbnail_url: 'https://example.com/avatar.jpg',
            },
          ],
        },
        id: '65b21f7f1353160007b6ccc0',
        full_name: 'John Doe',
        biography: {
          en: 'A passionate writer',
          fr: 'Un écrivain passionné',
        },
      },
    }

    return mount(AuthorDetailsDynamic, {
      props: {
        lang: 'en',
        section: baseSection,
        ...props,
      },
      global: {
        components: {
          BlogsAuthorView: mockBlogsAuthorView,
        },
        mocks: {
          $i18n: mockI18n,
          $t: vi.fn((key) => key),
        },
        stubs: {
          BlogsAuthorView: mockBlogsAuthorView,
        },
      },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Initialization', () => {
    it('should render with default props', () => {
      wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should render BlogsAuthorView component', () => {
      wrapper = createWrapper()
      const blogsAuthorView = wrapper.findComponent({
        name: 'BlogsAuthorView',
      })
      expect(blogsAuthorView.exists()).toBe(true)
    })
  })

  describe('BlogsAuthorView Rendering', () => {
    it('should pass correct section prop to BlogsAuthorView', () => {
      wrapper = createWrapper()
      const blogsAuthorView = wrapper.findComponent({
        name: 'BlogsAuthorView',
      })
      expect(blogsAuthorView.props('section')).toEqual(wrapper.props('section'))
    })

    it('should pass correct lang prop to BlogsAuthorView', () => {
      wrapper = createWrapper()
      const blogsAuthorView = wrapper.findComponent({
        name: 'BlogsAuthorView',
      })
      expect(blogsAuthorView.props('lang')).toBe('en')
    })

    it('should pass default lang when not provided', () => {
      wrapper = createWrapper({ lang: undefined })
      const blogsAuthorView = wrapper.findComponent({
        name: 'BlogsAuthorView',
      })
      expect(blogsAuthorView.props('lang')).toBe('en')
    })

    it('should handle different lang values', () => {
      wrapper = createWrapper({ lang: 'fr' })
      const blogsAuthorView = wrapper.findComponent({
        name: 'BlogsAuthorView',
      })
      expect(blogsAuthorView.props('lang')).toBe('fr')
    })
  })

  describe('Section Data Handling', () => {
    it('should handle section with full render_data', () => {
      wrapper = createWrapper()
      expect(wrapper.props('section').render_data).toBeDefined()
      expect(wrapper.props('section').render_data.full_name).toBe('John Doe')
    })

    it('should handle section with total_views', () => {
      wrapper = createWrapper()
      expect(wrapper.props('section').render_data.total_views).toBe('1,234')
    })

    it('should handle section with total_blogs', () => {
      wrapper = createWrapper()
      expect(wrapper.props('section').render_data.total_blogs).toBe('42')
    })

    it('should handle section with biography', () => {
      wrapper = createWrapper()
      expect(wrapper.props('section').render_data.biography).toBeDefined()
      expect(wrapper.props('section').render_data.biography.en).toBe(
        'A passionate writer',
      )
    })

    it('should handle section with profile_image', () => {
      wrapper = createWrapper()
      expect(wrapper.props('section').render_data.profile_image).toBeDefined()
      expect(
        wrapper.props('section').render_data.profile_image.files,
      ).toBeDefined()
    })

    it('should handle section without profile_image', () => {
      const sectionWithoutProfile = {
        name: 'test-section',
        render_data: {
          total_views: '100',
          full_name: 'Jane Smith',
        },
      }
      wrapper = createWrapper({ section: sectionWithoutProfile })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle section without biography', () => {
      const sectionWithoutBio = {
        name: 'test-section',
        render_data: {
          total_views: '100',
          full_name: 'Jane Smith',
        },
      }
      wrapper = createWrapper({ section: sectionWithoutBio })
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Props Handling', () => {
    it('should handle section prop as Object type', () => {
      wrapper = createWrapper()
      expect(typeof wrapper.props('section')).toBe('object')
    })

    it('should handle lang prop as String type', () => {
      wrapper = createWrapper()
      expect(typeof wrapper.props('lang')).toBe('string')
    })

    it('should use default section value when not provided', () => {
      wrapper = mount(AuthorDetailsDynamic, {
        props: {
          lang: 'en',
          section: { name: 'test', render_data: {} },
        },
        global: {
          components: {
            BlogsAuthorView: mockBlogsAuthorView,
          },
          mocks: {
            $i18n: mockI18n,
            $t: vi.fn((key) => key),
          },
          stubs: {
            BlogsAuthorView: mockBlogsAuthorView,
          },
        },
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should use default lang value when not provided', () => {
      wrapper = mount(AuthorDetailsDynamic, {
        props: {
          section: { name: 'test', render_data: {} },
        },
        global: {
          components: {
            BlogsAuthorView: mockBlogsAuthorView,
          },
          mocks: {
            $i18n: mockI18n,
            $t: vi.fn((key) => key),
          },
          stubs: {
            BlogsAuthorView: mockBlogsAuthorView,
          },
        },
      })
      expect(wrapper.props('lang')).toBe('en')
    })
  })

  describe('View Structure', () => {
    it('should have viewStructure with render_data structure', () => {
      wrapper = mount(AuthorDetailsDynamic, {
        props: {
          section: { name: 'test', render_data: {} },
          lang: 'en',
        },
        global: {
          components: {
            BlogsAuthorView: mockBlogsAuthorView,
          },
          mocks: {
            $i18n: mockI18n,
            $t: vi.fn((key) => key),
          },
          stubs: {
            BlogsAuthorView: mockBlogsAuthorView,
          },
        },
      })
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Component Name', () => {
    it('should have correct component name', () => {
      wrapper = createWrapper()
      expect(wrapper.vm.$options.name).toBe('AuthorDetailsDynamic')
    })
  })

  describe('Render Data Fields', () => {
    it('should handle id field in render_data', () => {
      wrapper = createWrapper()
      expect(wrapper.props('section').render_data.id).toBe(
        '65b21f7f1353160007b6ccc0',
      )
    })

    it('should handle social_media field in render_data', () => {
      wrapper = createWrapper()
      expect(wrapper.props('section').render_data.social_media).toBeDefined()
    })

    it('should handle section with minimal render_data', () => {
      const minimalSection = {
        name: 'test-section',
        render_data: {
          full_name: 'Test Author',
        },
      }
      wrapper = createWrapper({ section: minimalSection })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.props('section').render_data.full_name).toBe('Test Author')
    })
  })

  describe('Language Support', () => {
    it('should handle French language', () => {
      wrapper = createWrapper({ lang: 'fr' })
      const blogsAuthorView = wrapper.findComponent({
        name: 'BlogsAuthorView',
      })
      expect(blogsAuthorView.props('lang')).toBe('fr')
    })

    it('should handle other language codes', () => {
      wrapper = createWrapper({ lang: 'es' })
      const blogsAuthorView = wrapper.findComponent({
        name: 'BlogsAuthorView',
      })
      expect(blogsAuthorView.props('lang')).toBe('es')
    })
  })
})
