import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FullArticleDynamic from '../full_article_dynamic.vue'
import BlogsFullArticle from '../../../components/Blogs/FullArticle.vue'

vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    locale: { value: 'en' },
  })),
}))

vi.mock('@/utils/constants', () => ({
  parseTime: vi.fn((timestamp) => 'January 9, 2026'),
}))

const mockBlogsFullArticle = {
  name: 'BlogsFullArticle',
  template: '<div class="mock-full-article"><slot></slot></div>',
  props: ['section', 'lang'],
}

const mockI18n = {
  locale: 'en',
}

global.inject = vi.fn((key) => {
  if (key === 'languageSupport') {
    return vi.fn()
  }
  return null
})

describe('FullArticleDynamic', () => {
  let wrapper

  const createWrapper = (props = {}) => {
    const baseSection = {
      name: 'test-article-section',
      render_data: {
        views: 100,
        viewing_time: 300,
        updated_at: 1704787200,
        title: 'Test Article Title',
        suggested: [
          {
            views: 50,
            viewing_time: 200,
            updated_at: 1704700800,
            title: 'Suggested Article 1',
            suggested: { title: 'Suggested Title 1' },
            published: true,
            path: '/article/1',
            medias: [],
            inserted_at: 1704700800,
            id: 1,
            edited: '2024-01-08',
            description: 'Test description 1',
            created: '2024-01-01',
            categories: { title: 'Test Category' },
            body: 'Test body 1',
            author_id: 'author1',
          },
        ],
        published: true,
        path: '/article/test',
        medias: [],
        inserted_at: 1704787200,
        id: 1,
        edited: '2024-01-09',
        description: 'Test description',
        created: '2024-01-01',
        categories: [
          {
            title: 'Category 1',
            id: 1,
            count: 10,
          },
        ],
        body: 'Test article body',
        author_id: 'author1',
      },
    }

    return mount(FullArticleDynamic, {
      props: {
        lang: 'en',
        section: baseSection,
        ...props,
      },
      global: {
        components: {
          BlogsFullArticle: mockBlogsFullArticle,
        },
        mocks: {
          $i18n: mockI18n,
          $t: vi.fn((key) => key),
        },
        provide: {
          languageSupport: vi.fn(),
        },
        stubs: {
          BlogsFullArticle: mockBlogsFullArticle,
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

    it('should render BlogsFullArticle component', () => {
      wrapper = createWrapper()
      const blogsFullArticle = wrapper.findComponent({
        name: 'BlogsFullArticle',
      })
      expect(blogsFullArticle.exists()).toBe(true)
    })
  })

  describe('BlogsFullArticle Rendering', () => {
    it('should pass correct section prop to BlogsFullArticle', () => {
      wrapper = createWrapper()
      const blogsFullArticle = wrapper.findComponent({
        name: 'BlogsFullArticle',
      })
      expect(blogsFullArticle.props('section')).toEqual(
        wrapper.props('section'),
      )
    })

    it('should pass correct lang prop to BlogsFullArticle', () => {
      wrapper = createWrapper()
      const blogsFullArticle = wrapper.findComponent({
        name: 'BlogsFullArticle',
      })
      expect(blogsFullArticle.props('lang')).toBe('en')
    })

    it('should pass default lang when not provided', () => {
      wrapper = createWrapper({ lang: undefined })
      const blogsFullArticle = wrapper.findComponent({
        name: 'BlogsFullArticle',
      })
      expect(blogsFullArticle.props('lang')).toBe('en')
    })

    it('should handle different lang values', () => {
      wrapper = createWrapper({ lang: 'fr' })
      const blogsFullArticle = wrapper.findComponent({
        name: 'BlogsFullArticle',
      })
      expect(blogsFullArticle.props('lang')).toBe('fr')
    })
  })

  describe('Created Hook', () => {
    it('should emit seo-support event on created', () => {
      wrapper = createWrapper()
      const emitted = wrapper.emitted('seo-support')
      expect(emitted).toBeTruthy()
      expect(emitted.length).toBe(1)
      expect(emitted[0]).toEqual([true])
    })
  })

  describe('Mounted Hook', () => {
    it('should inject and call languageSupport with section name', () => {
      const languageSupportMock = vi.fn()
      global.inject = vi.fn((key) => {
        if (key === 'languageSupport') {
          return languageSupportMock
        }
        return null
      })

      wrapper = createWrapper()
      expect(languageSupportMock).toHaveBeenCalledWith('test-article-section')
    })

    it('should handle when languageSupport is undefined', () => {
      global.inject = vi.fn(() => null)
      wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Section Data Handling', () => {
    it('should handle section with full render_data', () => {
      wrapper = createWrapper()
      expect(wrapper.props('section').render_data).toBeDefined()
      expect(wrapper.props('section').render_data.title).toBe(
        'Test Article Title',
      )
    })

    it('should handle section with suggested articles', () => {
      wrapper = createWrapper()
      expect(wrapper.props('section').render_data.suggested).toBeDefined()
      expect(
        Array.isArray(wrapper.props('section').render_data.suggested),
      ).toBe(true)
    })

    it('should handle section with categories', () => {
      wrapper = createWrapper()
      expect(wrapper.props('section').render_data.categories).toBeDefined()
      expect(
        Array.isArray(wrapper.props('section').render_data.categories),
      ).toBe(true)
    })

    it('should handle section without suggested articles', () => {
      const sectionWithoutSuggested = {
        name: 'test-section',
        render_data: {
          title: 'Article without suggestions',
          published: true,
        },
      }
      wrapper = createWrapper({ section: sectionWithoutSuggested })
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
      wrapper = mount(FullArticleDynamic, {
        props: {
          lang: 'en',
          section: { name: 'test', render_data: {} },
        },
        global: {
          components: {
            BlogsFullArticle: mockBlogsFullArticle,
          },
          mocks: {
            $i18n: mockI18n,
            $t: vi.fn((key) => key),
          },
          provide: {
            languageSupport: vi.fn(),
          },
          stubs: {
            BlogsFullArticle: mockBlogsFullArticle,
          },
        },
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should use default lang value when not provided', () => {
      wrapper = mount(FullArticleDynamic, {
        props: {
          section: { name: 'test', render_data: {} },
        },
        global: {
          components: {
            BlogsFullArticle: mockBlogsFullArticle,
          },
          mocks: {
            $i18n: mockI18n,
            $t: vi.fn((key) => key),
          },
          provide: {
            languageSupport: vi.fn(),
          },
          stubs: {
            BlogsFullArticle: mockBlogsFullArticle,
          },
        },
      })
      expect(wrapper.props('lang')).toBe('en')
    })
  })

  describe('View Structure', () => {
    it('should have viewStructure with render_data structure', () => {
      wrapper = mount(FullArticleDynamic, {
        props: {
          section: { name: 'test', render_data: {} },
          lang: 'en',
        },
        global: {
          components: {
            BlogsFullArticle: mockBlogsFullArticle,
          },
          mocks: {
            $i18n: mockI18n,
            $t: vi.fn((key) => key),
          },
          provide: {
            languageSupport: vi.fn(),
          },
          stubs: {
            BlogsFullArticle: mockBlogsFullArticle,
          },
        },
      })
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Component Name', () => {
    it('should have correct component name', () => {
      wrapper = createWrapper()
      expect(wrapper.vm.$options.name).toBe('FullArticlesDynamic')
    })
  })
})
