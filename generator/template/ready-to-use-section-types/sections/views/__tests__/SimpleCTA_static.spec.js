import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SimpleCTA_static from '../SimpleCTA_static.vue'

// Mock vue-i18n to provide $i18n
vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    locale: { value: 'en' },
  })),
}))

// Mock @/utils/constants
vi.mock('@/utils/constants', () => ({
  getTranslation: vi.fn((settings, lang, primaryKey, frKey) => {
    if (settings[lang]) {
      if (lang === 'fr') {
        return settings[lang][primaryKey] === ''
          ? settings[frKey]
          : settings[lang][primaryKey]
      } else
        return settings[lang][primaryKey] === ''
          ? settings[primaryKey]
          : settings[lang][primaryKey]
    } else return lang === 'fr' ? settings[frKey] : settings[primaryKey]
  }),
}))

// Mock the global-link component
const mockGlobalLink = {
  name: 'global-link',
  template: '<a><slot></slot></a>',
  props: ['link', 'lang', 'defaultLang', 'formLinkTarget'],
}

// Mock $t function
const mockI18n = {
  locale: 'en',
}

describe('SimpleCTA_static', () => {
  let wrapper

  const createWrapper = (props = {}) => {
    return mount(SimpleCTA_static, {
      props: {
        lang: 'en',
        defaultLang: 'en',
        section: {
          settings: [
            {
              en: {
                title: 'Test Title',
                subTitle: 'Test Subtitle',
                link: 'https://example.com',
                buttonLabel: 'Click Me',
              },
              fr: {
                title: 'Titre Test',
                subTitle: 'Sous-titre Test',
                link: 'https://example.fr',
                buttonLabel: 'Cliquez ici',
              },
              linkTarget: '_self',
              sectionsPage: {},
            },
          ],
        },
        ...props,
      },
      global: {
        components: {
          'global-link': mockGlobalLink,
        },
        mocks: {
          $i18n: mockI18n,
          $t: vi.fn((key) => key),
        },
        stubs: {
          'global-link': mockGlobalLink,
        },
      },
    })
  }

  describe('Component Rendering', () => {
    it('should render when section has settings', () => {
      wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.simple-cta').exists()).toBe(true)
    })

    it('should not render when section has no settings', () => {
      wrapper = createWrapper({
        section: {},
      })
      expect(wrapper.find('.simple-cta').exists()).toBe(false)
    })

    it('should display title when present', () => {
      wrapper = createWrapper()
      const title = wrapper.find('h2')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Test Title')
    })

    it('should not display title when empty', () => {
      wrapper = createWrapper({
        section: {
          settings: [
            {
              en: {
                title: '',
                subTitle: 'Test Subtitle',
                link: 'https://example.com',
                buttonLabel: 'Click Me',
              },
            },
          ],
        },
      })
      const title = wrapper.find('h2')
      expect(title.exists()).toBe(false)
    })
  })

  describe('Link Handling', () => {
    it('should render subtitle link when subtitle exists', () => {
      wrapper = createWrapper()
      const subtitleLink = wrapper.find('.buttonsRow a')
      expect(subtitleLink.exists()).toBe(true)
    })

    it('should render button when buttonLabel exists and is valid', () => {
      wrapper = createWrapper()
      const button = wrapper.find('.button-selector')
      expect(button.exists()).toBe(true)
      expect(button.text()).toBe('Click Me')
    })

    it('should not render button when buttonLabel is empty', () => {
      wrapper = createWrapper({
        section: {
          settings: [
            {
              en: {
                title: 'Test Title',
                subTitle: 'Test Subtitle',
                link: 'https://example.com',
                buttonLabel: '',
              },
            },
          ],
        },
      })
      const button = wrapper.find('.button-selector')
      expect(button.exists()).toBe(false)
    })

    it('should not render button when buttonLabel is "/"', () => {
      wrapper = createWrapper({
        section: {
          settings: [
            {
              en: {
                title: 'Test Title',
                subTitle: 'Test Subtitle',
                link: 'https://example.com',
                buttonLabel: '/',
              },
            },
          ],
        },
      })
      const button = wrapper.find('.button-selector')
      expect(button.exists()).toBe(false)
    })
  })

  describe('Language Support', () => {
    it('should display French content when lang is fr', () => {
      wrapper = createWrapper({
        lang: 'fr',
      })
      const title = wrapper.find('h2')
      const button = wrapper.find('.button-selector')

      expect(title.text()).toBe('Titre Test')
      expect(button.text()).toBe('Cliquez ici')
    })

    it('should handle missing language gracefully', () => {
      wrapper = createWrapper({
        lang: 'es',
        section: {
          settings: [
            {
              en: {
                title: 'Test Title',
                subTitle: 'Test Subtitle',
                link: 'https://example.com',
                buttonLabel: 'Click Me',
              },
            },
          ],
        },
      })
      const title = wrapper.find('h2')
      // Should not render title when language doesn't exist
      expect(title.exists()).toBe(false)
    })
  })

  describe('Settings Computation', () => {
    it('should handle array settings correctly', () => {
      wrapper = createWrapper()
      expect(wrapper.vm.settings).toEqual(
        expect.objectContaining({
          en: expect.objectContaining({
            title: 'Test Title',
            subTitle: 'Test Subtitle',
            link: 'https://example.com',
            buttonLabel: 'Click Me',
          }),
        }),
      )
    })

    it('should handle non-array settings correctly', () => {
      wrapper = createWrapper({
        section: {
          settings: {
            en: {
              title: 'Test Title',
              subTitle: 'Test Subtitle',
              link: 'https://example.com',
              buttonLabel: 'Click Me',
            },
          },
        },
      })
      expect(wrapper.vm.settings).toEqual(
        expect.objectContaining({
          en: expect.objectContaining({
            title: 'Test Title',
          }),
        }),
      )
    })
  })

  describe('Computed Properties', () => {
    it('should compute show correctly', () => {
      wrapper = createWrapper()
      expect(wrapper.vm.show).toBe(true)

      wrapper = createWrapper({ section: {} })
      expect(wrapper.vm.show).toBe(false)
    })

    it('should compute settings correctly', () => {
      wrapper = createWrapper()
      expect(wrapper.vm.settings).toEqual(
        expect.objectContaining({
          en: expect.objectContaining({
            title: 'Test Title',
            subTitle: 'Test Subtitle',
            link: 'https://example.com',
            buttonLabel: 'Click Me',
          }),
        }),
      )
    })

    it('should handle non-array settings correctly', () => {
      wrapper = createWrapper({
        section: {
          settings: {
            en: {
              title: 'Test Title',
              subTitle: 'Test Subtitle',
              link: 'https://example.com',
              buttonLabel: 'Click Me',
            },
          },
        },
      })
      expect(wrapper.vm.settings).toEqual(
        expect.objectContaining({
          en: expect.objectContaining({
            title: 'Test Title',
          }),
        }),
      )
    })
  })

  describe('Translation Method', () => {
    it('should call getCurrentTranslation method correctly', () => {
      wrapper = createWrapper()
      const result = wrapper.vm.getCurrentTranslation(
        { en: { title: 'Test' } },
        'en',
        'title',
        'title',
      )
      expect(result).toBe('Test')
    })
  })

  describe('Structure and Styles', () => {
    it('should have correct CSS classes', () => {
      wrapper = createWrapper()
      expect(wrapper.find('.simple-cta').exists()).toBe(true)
      expect(wrapper.find('.wrapper').exists()).toBe(true)
      expect(wrapper.find('.wrapper-question').exists()).toBe(true)
      expect(wrapper.find('.buttonsRow').exists()).toBe(true)
    })

    it('should have mobile button label container', () => {
      wrapper = createWrapper()
      expect(wrapper.find('.mobileButtonLabel').exists()).toBe(true)
    })
  })
})
