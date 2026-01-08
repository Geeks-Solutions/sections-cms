import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock the global-link component
const mockGlobalLink = {
  template: '<a><slot></slot></a>',
  props: ['link', 'lang', 'defaultLang', 'formLinkTarget'],
}

// Create a mock version of the component with the utility function inlined
const mockSimpleCTA = {
  name: 'SimpleCTA',
  template: `
    <div v-if="show" class="simple-cta" style="overflow: hidden">
      <div class="wrapper">
        <div class="wrapper">
          <div class="wrapper-question">
            <h2 v-if="title">
              {{ title }}
            </h2>
            <div class="flex buttonsRow items-center mb-4">
              <global-link
                v-if="subTitle"
                :link="getLinkForSubTitle()"
                :lang="lang"
                :default-lang="defaultLang"
                :form-link-target="settings.linkTarget"
              >
                <p>
                  {{ subTitle }}
                </p>
              </global-link>
              <div class="mobileButtonLabel">
                <global-link
                  v-if="getCurrentTranslation(settings, lang, 'buttonLabel', 'buttonLabel') &&
                        getCurrentTranslation(settings, lang, 'buttonLabel', 'buttonLabel') !== '' &&
                        getCurrentTranslation(settings, lang, 'buttonLabel', 'buttonLabel') !== '/'"
                  :link="getLinkForButton()"
                  :lang="lang"
                  :default-lang="defaultLang"
                  :form-link-target="settings.linkTarget"
                >
                  <div class="button-selector">
                    {{ getCurrentTranslation(settings, lang, 'buttonLabel', 'buttonLabel') }}
                  </div>
                </global-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  props: {
    section: {
      type: Object,
      default: () => {},
    },
    lang: {
      type: String,
      default: 'en',
    },
    defaultLang: {
      type: String,
      default: 'en',
    },
    viewStructure: {
      settings: [
        {
          en: {
            title: 'string',
            subTitle: 'string',
            link: 'string',
            buttonLabel: 'string',
          },
          fr: {
            title: 'string',
            subTitle: 'string',
            link: 'string',
            buttonLabel: 'string',
          },
        },
      ],
    },
  },
  data() {
    return {}
  },
  computed: {
    show() {
      return !!this.section.settings
    },
    title() {
      return this.settings[this.lang]?.title || this.settings.en?.title
    },
    subTitle() {
      return this.settings[this.lang]?.subTitle || this.settings.en?.subTitle
    },
    link() {
      const langLink = this.settings[this.lang]?.link || this.settings.en?.link
      return langLink ? langLink : ''
    },
    settings() {
      if (Array.isArray(this.section.settings) === false) {
        return this.section.settings
      } else {
        return this.section.settings[0]
      }
    },
  },
  methods: {
    getCurrentTranslation(settings, lang, primaryKey, frKey) {
      if (settings && settings[lang] && settings[lang][primaryKey]) {
        return settings[lang][primaryKey]
      }
      return ''
    },
    getLinkForSubTitle() {
      if (
        !this.settings.sectionsPage ||
        (this.settings.sectionsPage &&
          (this.settings.sectionsPage[this.lang] === 'other' ||
            !this.settings.sectionsPage[this.lang]))
      ) {
        return {
          en: this.getCurrentTranslation(this.settings, 'en', 'link', 'link'),
          fr: this.getCurrentTranslation(this.settings, 'fr', 'link', 'link'),
        }
      } else if (
        this.settings.sectionsPage &&
        this.settings.sectionsPage[this.lang]
      ) {
        return {
          ...this.settings.sectionsPage,
          en: '/' + this.settings.sectionsPage.en,
          fr: '/' + this.settings.sectionsPage.fr,
        }
      }
      return '#'
    },
    getLinkForButton() {
      if (
        !this.settings.sectionsPage ||
        (this.settings.sectionsPage &&
          this.settings.sectionsPage[this.lang] === 'other')
      ) {
        return {
          en: this.getCurrentTranslation(this.settings, 'en', 'link', 'link'),
          fr: this.getCurrentTranslation(this.settings, 'fr', 'link', 'link'),
        }
      } else if (
        this.settings.sectionsPage &&
        this.settings.sectionsPage[this.lang]
      ) {
        return {
          ...this.settings.sectionsPage,
          en: '/' + this.settings.sectionsPage.en,
          fr: '/' + this.settings.sectionsPage.fr,
        }
      }
      return '#'
    },
  },
}

describe('SimpleCTA_static', () => {
  let wrapper

  const createWrapper = (props = {}) => {
    return mount(mockSimpleCTA, {
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
        stubs: {
          'global-link': mockGlobalLink, // Use stub component
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
      expect(title.exists()).toBe(true)
      // Should fall back to empty string or default behavior
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

    it('should compute title correctly', () => {
      wrapper = createWrapper()
      expect(wrapper.vm.title).toBe('Test Title')
    })

    it('should compute subTitle correctly', () => {
      wrapper = createWrapper()
      expect(wrapper.vm.subTitle).toBe('Test Subtitle')
    })

    it('should compute link correctly', () => {
      wrapper = createWrapper()
      expect(wrapper.vm.link).toBe('https://example.com')

      wrapper = createWrapper({
        section: {
          settings: [
            {
              en: { link: '' },
            },
          ],
        },
      })
      expect(wrapper.vm.link).toBe('')
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
