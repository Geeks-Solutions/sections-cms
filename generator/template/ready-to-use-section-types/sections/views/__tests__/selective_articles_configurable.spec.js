import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import SelectiveArticlesConfigurable from '../selective_articles_configurable.vue'

const mockBlogsArticles = {
  name: 'BlogsArticles',
  template: '<div class="blogs-articles"><slot></slot></div>',
  props: [
    'sectionRenderData',
    'sectionRenderSettings',
    'lang',
    'defaultLang',
    'title',
    'description',
  ],
}

global.inject = vi.fn((key) => {
  if (key === 'languageSupport') {
    return vi.fn()
  }
  return null
})

describe('SelectiveArticlesConfigurable', () => {
  let wrapper

  const createWrapper = (propsData = {}) => {
    return shallowMount(SelectiveArticlesConfigurable, {
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
          name: 'selective_articles',
          render_data: [
            {
              data: {
                total: 10,
                count: 3,
                articles: [
                  {
                    id: 1,
                    title: 'Test Article 1',
                    path: '/article-1',
                    medias: ['image1.jpg'],
                    published: true,
                    author_id: 'author1',
                    categories: [{ id: 1, title: 'Category 1', count: 5 }],
                    body: 'Content',
                    description: 'Description 1',
                    created: '2024-01-01',
                    edited: '2024-01-02',
                    inserted_at: 1234567890,
                    views: 100,
                    viewing_time: 60,
                    updated_at: 1234567890,
                    suggested: [],
                  },
                  {
                    id: 2,
                    title: 'Test Article 2',
                    path: '/article-2',
                    medias: ['image2.jpg'],
                    published: true,
                    author_id: 'author2',
                    categories: [{ id: 2, title: 'Category 2', count: 10 }],
                    body: 'Content',
                    description: 'Description 2',
                    created: '2024-01-01',
                    edited: '2024-01-02',
                    inserted_at: 1234567890,
                    views: 200,
                    viewing_time: 120,
                    updated_at: 1234567890,
                    suggested: [],
                  },
                  {
                    id: 3,
                    title: 'Test Article 3',
                    path: '/article-3',
                    medias: ['image3.jpg'],
                    published: true,
                    author_id: 'author3',
                    categories: [{ id: 3, title: 'Category 3', count: 15 }],
                    body: 'Content',
                    description: 'Description 3',
                    created: '2024-01-01',
                    edited: '2024-01-02',
                    inserted_at: 1234567890,
                    views: 300,
                    viewing_time: 180,
                    updated_at: 1234567890,
                    suggested: [],
                  },
                ],
              },
              settings: {
                article_page_path: '/articles',
                title: 'Featured Articles',
                description:
                  'This is a description for the featured articles section',
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
      expect(blogsArticles.props('sectionRenderData').articles).toHaveLength(3)
      expect(blogsArticles.props('sectionRenderSettings')).toEqual({
        article_page_path: '/articles',
        title: 'Featured Articles',
        description: 'This is a description for the featured articles section',
      })
      expect(blogsArticles.props('lang')).toBe('en')
      expect(blogsArticles.props('defaultLang')).toBe('en')
    })

    it('should pass title and description from sectionRenderSettings to BlogsArticles', () => {
      wrapper = createWrapper()
      const blogsArticles = wrapper.findComponent(mockBlogsArticles)

      expect(blogsArticles.props('title')).toBe('Featured Articles')
      expect(blogsArticles.props('description')).toBe(
        'This is a description for the featured articles section',
      )
    })
  })

  describe('sectionRenderData Computed Property', () => {
    it('should return data object when section.render_data[0].data exists', () => {
      wrapper = createWrapper()
      const data = wrapper.vm.sectionRenderData
      expect(data).toBeDefined()
      expect(data.total).toBe(10)
      expect(data.count).toBe(3)
      expect(data.articles).toHaveLength(3)
      expect(data.articles[0].title).toBe('Test Article 1')
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
      wrapper = createWrapper({
        section: {
          render_data: [
            {
              data: {
                total: 1,
                count: 1,
                articles: [
                  {
                    id: 1,
                    title: 'Main Article',
                    suggested: [
                      {
                        id: 2,
                        title: 'Suggested Article 1',
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
                      {
                        id: 3,
                        title: 'Suggested Article 2',
                        path: '/suggested-2',
                        medias: [],
                        published: true,
                        author_id: 'author2',
                        categories: {
                          title: 'Category 2',
                        },
                        body: 'Content',
                        description: 'Description',
                        created: '2024-01-01',
                        edited: '2024-01-02',
                        inserted_at: 1234567890,
                        views: 50,
                        viewing_time: 30,
                        updated_at: 1234567890,
                      },
                    ],
                  },
                ],
              },
              settings: {},
            },
          ],
        },
      })

      const firstArticle = wrapper.vm.sectionRenderData.articles[0]
      expect(firstArticle.suggested).toBeDefined()
      expect(firstArticle.suggested).toHaveLength(2)
      expect(firstArticle.suggested[0].title).toBe('Suggested Article 1')
      expect(firstArticle.suggested[1].title).toBe('Suggested Article 2')
    })
  })

  describe('sectionRenderSettings Computed Property', () => {
    it('should return settings object when section.render_data[0].settings exists', () => {
      wrapper = createWrapper()
      expect(wrapper.vm.sectionRenderSettings).toEqual({
        article_page_path: '/articles',
        title: 'Featured Articles',
        description: 'This is a description for the featured articles section',
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
              data: {},
            },
          ],
        },
      })
      expect(wrapper.vm.sectionRenderSettings).toBeNull()
    })
  })

  describe('Title and Description Handling', () => {
    it('should pass title from sectionRenderSettings to BlogsArticles', () => {
      wrapper = createWrapper({
        section: {
          render_data: [
            {
              data: {
                total: 0,
                count: 0,
                articles: [],
              },
              settings: {
                title: 'Custom Title',
              },
            },
          ],
        },
      })

      const blogsArticles = wrapper.findComponent(mockBlogsArticles)
      expect(blogsArticles.props('title')).toBe('Custom Title')
    })

    it('should pass description from sectionRenderSettings to BlogsArticles', () => {
      wrapper = createWrapper({
        section: {
          render_data: [
            {
              data: {
                total: 0,
                count: 0,
                articles: [],
              },
              settings: {
                description: 'Custom Description',
              },
            },
          ],
        },
      })

      const blogsArticles = wrapper.findComponent(mockBlogsArticles)
      expect(blogsArticles.props('description')).toBe('Custom Description')
    })

    it('should pass empty string for title when sectionRenderSettings is null', () => {
      wrapper = createWrapper({
        section: {
          render_data: [],
        },
      })

      const blogsArticles = wrapper.findComponent(mockBlogsArticles)
      expect(blogsArticles.props('title')).toBe('')
    })

    it('should pass empty string for description when sectionRenderSettings is null', () => {
      wrapper = createWrapper({
        section: {
          render_data: [],
        },
      })

      const blogsArticles = wrapper.findComponent(mockBlogsArticles)
      expect(blogsArticles.props('description')).toBe('')
    })

    it('should pass empty string for title when sectionRenderSettings does not have title', () => {
      wrapper = createWrapper({
        section: {
          render_data: [
            {
              data: {
                total: 0,
                count: 0,
                articles: [],
              },
              settings: {},
            },
          ],
        },
      })

      const blogsArticles = wrapper.findComponent(mockBlogsArticles)
      expect(blogsArticles.props('title')).toBe('')
    })

    it('should pass empty string for description when sectionRenderSettings does not have description', () => {
      wrapper = createWrapper({
        section: {
          render_data: [
            {
              data: {
                total: 0,
                count: 0,
                articles: [],
              },
              settings: {},
            },
          ],
        },
      })

      const blogsArticles = wrapper.findComponent(mockBlogsArticles)
      expect(blogsArticles.props('description')).toBe('')
    })

    it('should pass empty object for sectionRenderSettings to BlogsArticles when it is null', () => {
      wrapper = createWrapper({
        section: {
          render_data: [],
        },
      })

      const blogsArticles = wrapper.findComponent(mockBlogsArticles)
      expect(blogsArticles.props('sectionRenderSettings')).toEqual({})
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
      const article = wrapper.vm.sectionRenderData.articles[0]

      expect(article).toHaveProperty('id')
      expect(article).toHaveProperty('title')
      expect(article).toHaveProperty('path')
      expect(article).toHaveProperty('medias')
      expect(article).toHaveProperty('published')
      expect(article).toHaveProperty('author_id')
      expect(article).toHaveProperty('categories')
      expect(article).toHaveProperty('body')
      expect(article).toHaveProperty('description')
      expect(article).toHaveProperty('created')
      expect(article).toHaveProperty('edited')
      expect(article).toHaveProperty('inserted_at')
      expect(article).toHaveProperty('views')
      expect(article).toHaveProperty('viewing_time')
      expect(article).toHaveProperty('updated_at')
    })

    it('should handle articles with categories array', () => {
      wrapper = createWrapper()
      const article = wrapper.vm.sectionRenderData.articles[0]
      expect(article.categories).toHaveLength(1)
      expect(article.categories[0].title).toBe('Category 1')
    })

    it('should handle articles with suggested articles', () => {
      wrapper = createWrapper({
        section: {
          render_data: [
            {
              data: {
                total: 1,
                count: 1,
                articles: [
                  {
                    id: 1,
                    title: 'Article',
                    suggested: [
                      {
                        id: 2,
                        title: 'Suggested 1',
                      },
                      {
                        id: 3,
                        title: 'Suggested 2',
                      },
                    ],
                  },
                ],
              },
              settings: {},
            },
          ],
        },
      })

      const article = wrapper.vm.sectionRenderData.articles[0]
      expect(article.suggested).toHaveLength(2)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty articles array', () => {
      wrapper = createWrapper({
        section: {
          render_data: [
            {
              data: {
                total: 0,
                count: 0,
                articles: [],
              },
              settings: {},
            },
          ],
        },
      })

      expect(wrapper.vm.sectionRenderData.articles).toHaveLength(0)
    })

    it('should handle article without suggested property', () => {
      wrapper = createWrapper({
        section: {
          render_data: [
            {
              data: {
                total: 1,
                count: 1,
                articles: [
                  {
                    id: 1,
                    title: 'Article without suggestions',
                  },
                ],
              },
              settings: {},
            },
          ],
        },
      })

      expect(wrapper.vm.sectionRenderData.articles[0]).not.toHaveProperty(
        'suggested',
      )
    })

    it('should handle multiple articles with mixed structure', () => {
      wrapper = createWrapper({
        section: {
          render_data: [
            {
              data: {
                total: 3,
                count: 3,
                articles: [
                  {
                    id: 1,
                    title: 'Article 1',
                    suggested: [],
                    medias: ['image1.jpg'],
                  },
                  {
                    id: 2,
                    title: 'Article 2',
                    suggested: [],
                    medias: [],
                  },
                  {
                    id: 3,
                    title: 'Article 3',
                    suggested: [
                      {
                        id: 4,
                        title: 'Suggested',
                      },
                    ],
                    medias: ['image3.jpg'],
                  },
                ],
              },
              settings: {},
            },
          ],
        },
      })

      const articles = wrapper.vm.sectionRenderData.articles
      expect(articles).toHaveLength(3)
      expect(articles[0].medias).toHaveLength(1)
      expect(articles[1].medias).toHaveLength(0)
      expect(articles[2].suggested).toHaveLength(1)
    })
  })

  describe('Mounted Hook', () => {
    it('should call languageSupport on mount with section name', () => {
      const languageSupport = vi.fn()
      global.inject.mockImplementation((key) => {
        if (key === 'languageSupport') {
          return languageSupport
        }
        return null
      })

      wrapper = createWrapper()
      expect(languageSupport).toHaveBeenCalledWith('selective_articles')
    })

    it('should handle null languageSupport gracefully', () => {
      global.inject.mockReturnValue(null)
      wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })
  })
})
