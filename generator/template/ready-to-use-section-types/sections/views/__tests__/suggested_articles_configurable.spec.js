import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import SuggestedArticlesConfigurable from '../suggested_articles_configurable.vue'

const mockBlogsArticles = {
  name: 'BlogsArticles',
  template: '<div class="blogs-articles"><slot></slot></div>',
  props: ['sectionRenderData', 'sectionRenderSettings', 'lang', 'defaultLang'],
}

global.inject = vi.fn((key) => {
  if (key === 'languageSupport') {
    return vi.fn()
  }
  return null
})

describe('SuggestedArticlesConfigurable', () => {
  let wrapper

  const createWrapper = (propsData = {}) => {
    return shallowMount(SuggestedArticlesConfigurable, {
      global: {
        components: {
          BlogsArticles: mockBlogsArticles,
        },
        mocks: {
          $i18n: {
            locale: 'en',
          },
          $t: vi.fn((key) => key),
        },
        provide: {
          languageSupport: vi.fn(),
        },
        stubs: {
          BlogsArticles: mockBlogsArticles,
        },
      },
      props: {
        lang: 'en',
        defaultLang: 'en',
        section: {
          render_data: [
            {
              data: [
                {
                  id: 1,
                  title: 'Test Article 1',
                  suggested: [
                    {
                      id: 2,
                      title: 'Suggested Article 1',
                    },
                    {
                      id: 3,
                      title: 'Suggested Article 2',
                    },
                  ],
                },
                {
                  id: 4,
                  title: 'Test Article 2',
                  suggested: [
                    {
                      id: 5,
                      title: 'Suggested Article 3',
                    },
                  ],
                },
              ],
              settings: {
                article_page_path: '/articles',
              },
            },
          ],
        },
        ...propsData,
      },
    })
  }

  describe('Component Rendering', () => {
    it('should render when section has render_data', () => {
      wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should render BlogsArticles component', () => {
      wrapper = createWrapper()
      const blogsArticles = wrapper.findComponent(mockBlogsArticles)
      expect(blogsArticles.exists()).toBe(true)
    })

    it('should pass correct props to BlogsArticles', () => {
      wrapper = createWrapper()
      const blogsArticles = wrapper.findComponent(mockBlogsArticles)

      expect(blogsArticles.props('sectionRenderData')).toBeDefined()
      expect(blogsArticles.props('sectionRenderData').articles).toHaveLength(2)
      expect(blogsArticles.props('sectionRenderSettings')).toEqual({
        article_page_path: '/articles',
      })
      expect(blogsArticles.props('lang')).toBe('en')
      expect(blogsArticles.props('defaultLang')).toBe('en')
    })
  })

  describe('sectionRenderData Computed Property', () => {
    it('should return data array when section.render_data[0].data exists', () => {
      wrapper = createWrapper()
      expect(wrapper.vm.sectionRenderData).toHaveLength(2)
      expect(wrapper.vm.sectionRenderData[0].title).toBe('Test Article 1')
      expect(wrapper.vm.sectionRenderData[1].title).toBe('Test Article 2')
    })

    it('should return null when section.render_data is empty', () => {
      wrapper = createWrapper({
        section: {
          render_data: [],
        },
      })
      expect(wrapper.vm.sectionRenderData).toBeNull()
    })

    it('should return null when section.render_data[0] is missing', () => {
      wrapper = createWrapper({
        section: {
          render_data: [null],
        },
      })
      expect(wrapper.vm.sectionRenderData).toBeNull()
    })

    it('should return null when section.render_data[0].data is missing', () => {
      wrapper = createWrapper({
        section: {
          render_data: [
            {
              settings: {},
            },
          ],
        },
      })
      expect(wrapper.vm.sectionRenderData).toBeNull()
    })

    it('should handle articles with suggested articles', () => {
      wrapper = createWrapper()
      const firstArticle = wrapper.vm.sectionRenderData[0]
      expect(firstArticle.suggested).toBeDefined()
      expect(firstArticle.suggested).toHaveLength(2)
      expect(firstArticle.suggested[0].title).toBe('Suggested Article 1')
    })
  })

  describe('sectionRenderSettings Computed Property', () => {
    it('should return settings object when section.render_data[0].settings exists', () => {
      wrapper = createWrapper()
      expect(wrapper.vm.sectionRenderSettings).toEqual({
        article_page_path: '/articles',
      })
    })

    it('should return null when section.render_data is empty', () => {
      wrapper = createWrapper({
        section: {
          render_data: [],
        },
      })
      expect(wrapper.vm.sectionRenderSettings).toBeNull()
    })

    it('should return null when section.render_data[0] is missing', () => {
      wrapper = createWrapper({
        section: {
          render_data: [null],
        },
      })
      expect(wrapper.vm.sectionRenderSettings).toBeNull()
    })

    it('should return null when section.render_data[0].settings is missing', () => {
      wrapper = createWrapper({
        section: {
          render_data: [
            {
              data: [],
            },
          ],
        },
      })
      expect(wrapper.vm.sectionRenderSettings).toBeNull()
    })
  })

  describe('Props Handling', () => {
    it('should use provided lang prop', () => {
      wrapper = createWrapper({
        lang: 'fr',
      })
      const blogsArticles = wrapper.findComponent(mockBlogsArticles)
      expect(blogsArticles.props('lang')).toBe('fr')
    })

    it('should use provided defaultLang prop', () => {
      wrapper = createWrapper({
        defaultLang: 'en',
      })
      const blogsArticles = wrapper.findComponent(mockBlogsArticles)
      expect(blogsArticles.props('defaultLang')).toBe('en')
    })

    it('should default lang to en', () => {
      wrapper = createWrapper({
        lang: undefined,
      })
      expect(wrapper.vm.lang).toBe('en')
    })

    it('should default defaultLang to en', () => {
      wrapper = createWrapper({
        defaultLang: undefined,
      })
      expect(wrapper.vm.defaultLang).toBe('en')
    })
  })

  describe('Data Structure Validation', () => {
    it('should pass articles with all required fields', () => {
      wrapper = createWrapper()
      const article = wrapper.vm.sectionRenderData[0]

      expect(article).toHaveProperty('id')
      expect(article).toHaveProperty('title')
      expect(article).toHaveProperty('suggested')
      expect(article.suggested[0]).toHaveProperty('id')
      expect(article.suggested[0]).toHaveProperty('title')
    })

    it('should handle articles with complete suggested article structure', () => {
      wrapper = createWrapper({
        section: {
          render_data: [
            {
              data: [
                {
                  id: 1,
                  title: 'Main Article',
                  suggested: [
                    {
                      id: 2,
                      title: 'Suggested 1',
                      path: '/suggested-1',
                      medias: ['image1.jpg'],
                      published: true,
                      author_id: 'author1',
                      categories: {
                        title: 'Category 1',
                      },
                      body: 'Content',
                      description: 'Description',
                      created: '2024-01-01',
                      edited: '2024-01-02',
                      inserted_at: 1234567890,
                      views: 100,
                      viewing_time: 60,
                      updated_at: 1234567890,
                    },
                  ],
                },
              ],
              settings: {},
            },
          ],
        },
      })

      const suggestedArticle = wrapper.vm.sectionRenderData[0].suggested[0]
      expect(suggestedArticle.path).toBe('/suggested-1')
      expect(suggestedArticle.published).toBe(true)
      expect(suggestedArticle.categories.title).toBe('Category 1')
    })

    it('should handle articles with categories array', () => {
      wrapper = createWrapper({
        section: {
          render_data: [
            {
              data: [
                {
                  id: 1,
                  title: 'Article with Categories',
                  suggested: [],
                  categories: [
                    { id: 1, title: 'Category 1', count: 10 },
                    { id: 2, title: 'Category 2', count: 5 },
                  ],
                },
              ],
              settings: {},
            },
          ],
        },
      })

      const article = wrapper.vm.sectionRenderData[0]
      expect(article.categories).toHaveLength(2)
      expect(article.categories[0].title).toBe('Category 1')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty suggested array', () => {
      wrapper = createWrapper({
        section: {
          render_data: [
            {
              data: [
                {
                  id: 1,
                  title: 'Article without suggestions',
                  suggested: [],
                },
              ],
              settings: {},
            },
          ],
        },
      })

      expect(wrapper.vm.sectionRenderData[0].suggested).toHaveLength(0)
    })

    it('should handle article without suggested property', () => {
      wrapper = createWrapper({
        section: {
          render_data: [
            {
              data: [
                {
                  id: 1,
                  title: 'Article without suggestions property',
                },
              ],
              settings: {},
            },
          ],
        },
      })

      expect(wrapper.vm.sectionRenderData[0]).not.toHaveProperty('suggested')
    })

    it('should handle multiple suggested articles with mixed structure', () => {
      wrapper = createWrapper({
        section: {
          render_data: [
            {
              data: [
                {
                  id: 1,
                  title: 'Main Article',
                  suggested: [
                    {
                      id: 2,
                      title: 'Suggested 1',
                      medias: ['image1.jpg'],
                    },
                    {
                      id: 3,
                      title: 'Suggested 2',
                      medias: [],
                    },
                  ],
                },
              ],
              settings: {},
            },
          ],
        },
      })

      const suggested = wrapper.vm.sectionRenderData[0].suggested
      expect(suggested).toHaveLength(2)
      expect(suggested[0].medias).toHaveLength(1)
      expect(suggested[1].medias).toHaveLength(0)
    })
  })

  describe('Mounted Hook', () => {
    it('should call languageSupport on mount', () => {
      const languageSupport = vi.fn()
      global.inject.mockImplementation((key) => {
        if (key === 'languageSupport') {
          return languageSupport
        }
        return null
      })

      wrapper = createWrapper()
      expect(languageSupport).toHaveBeenCalled()
    })
  })
})
