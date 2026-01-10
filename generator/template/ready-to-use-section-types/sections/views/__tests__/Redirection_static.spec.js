import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Redirection_static from '../Redirection_static.vue'

const mockWysiwygContent = {
  name: 'GWysiwygContent',
  template: '<div><slot></slot></div>',
  props: ['tag', 'wrapperClasses', 'classes', 'htmlContent'],
}

const mockI18n = {
  locale: 'en',
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers()
})

describe('Redirection_static', () => {
  let wrapper

  const createWrapper = (props = {}) => {
    return mount(Redirection_static, {
      props: {
        lang: 'en',
        section: {
          settings: [
            {
              en: {
                message: 'You will be redirected shortly',
                redirectionUrl: 'https://example.com',
              },
              fr: {
                message: 'Vous serez redirigé sous peu',
                redirectionUrl: 'https://example.fr',
              },
              timeToRedirect: '3',
            },
          ],
        },
        ...props,
      },
      global: {
        components: {
          GWysiwygContent: mockWysiwygContent,
        },
        mocks: {
          $i18n: mockI18n,
          $t: vi.fn((key) => key),
        },
        stubs: {
          GWysiwygContent: mockWysiwygContent,
        },
      },
    })
  }

  describe('Component Rendering', () => {
    it('should render when section has settings', () => {
      wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should not render when section has no settings', () => {
      wrapper = createWrapper({ section: {} })
      expect(wrapper.find('div').exists()).toBe(false)
    })

    it('should render gWysiwygContent with correct message', () => {
      wrapper = createWrapper()
      const wysiwyg = wrapper.findComponent(mockWysiwygContent)
      expect(wysiwyg.exists()).toBe(true)
      expect(wysiwyg.props('htmlContent')).toBe(
        'You will be redirected shortly',
      )
    })

    it('should render French message when lang is fr', () => {
      wrapper = createWrapper({ lang: 'fr' })
      const wysiwyg = wrapper.findComponent(mockWysiwygContent)
      expect(wysiwyg.props('htmlContent')).toBe('Vous serez redirigé sous peu')
    })
  })

  describe('Settings Computed Property', () => {
    it('should return first element when section.settings is an array', () => {
      wrapper = createWrapper()
      expect(wrapper.vm.settings).toEqual({
        en: {
          message: 'You will be redirected shortly',
          redirectionUrl: 'https://example.com',
        },
        fr: {
          message: 'Vous serez redirigé sous peu',
          redirectionUrl: 'https://example.fr',
        },
        timeToRedirect: '3',
      })
    })

    it('should return settings object when section.settings is not an array', () => {
      wrapper = createWrapper({
        section: {
          settings: {
            en: {
              message: 'Direct settings message',
              redirectionUrl: 'https://direct.com',
            },
            timeToRedirect: '5',
          },
        },
      })
      expect(wrapper.vm.settings).toEqual({
        en: {
          message: 'Direct settings message',
          redirectionUrl: 'https://direct.com',
        },
        timeToRedirect: '5',
      })
    })

    it('should return undefined when section has no settings', () => {
      wrapper = createWrapper({ section: {} })
      expect(wrapper.vm.settings).toBeUndefined()
    })
  })

  describe('Redirection Logic', () => {
    it('should not redirect when settings is null', () => {
      wrapper = createWrapper({ section: {} })
      const openLinkSpy = vi.spyOn(wrapper.vm, 'openLink')

      vi.advanceTimersByTime(3000)

      expect(openLinkSpy).not.toHaveBeenCalled()
    })

    it('should not redirect when timeToRedirect is empty', () => {
      wrapper = createWrapper({
        section: {
          settings: [
            {
              en: {
                message: 'Test',
                redirectionUrl: 'https://example.com',
              },
              timeToRedirect: '',
            },
          ],
        },
      })
      const openLinkSpy = vi.spyOn(wrapper.vm, 'openLink')

      vi.advanceTimersByTime(1000)

      expect(openLinkSpy).not.toHaveBeenCalled()
    })

    it('should not redirect when timeToRedirect is not provided', () => {
      wrapper = createWrapper({
        section: {
          settings: [
            {
              en: {
                message: 'Test',
                redirectionUrl: 'https://example.com',
              },
            },
          ],
        },
      })
      const openLinkSpy = vi.spyOn(wrapper.vm, 'openLink')

      vi.advanceTimersByTime(1000)

      expect(openLinkSpy).not.toHaveBeenCalled()
    })

    it('should not redirect when redirectionUrl is empty', () => {
      wrapper = createWrapper({
        section: {
          settings: [
            {
              en: {
                message: 'Test',
                redirectionUrl: '',
              },
              timeToRedirect: '2',
            },
          ],
        },
      })
      const openLinkSpy = vi.spyOn(wrapper.vm, 'openLink')

      vi.advanceTimersByTime(2000)

      expect(openLinkSpy).not.toHaveBeenCalled()
    })

    it('should not redirect when redirectionUrl is not provided', () => {
      wrapper = createWrapper({
        section: {
          settings: [
            {
              en: {
                message: 'Test',
              },
              timeToRedirect: '2',
            },
          ],
        },
      })
      const openLinkSpy = vi.spyOn(wrapper.vm, 'openLink')

      vi.advanceTimersByTime(2000)

      expect(openLinkSpy).not.toHaveBeenCalled()
    })

    it('should not redirect when lang-specific redirectionUrl is missing', () => {
      wrapper = createWrapper({
        lang: 'fr',
        section: {
          settings: [
            {
              en: {
                message: 'Test',
                redirectionUrl: 'https://example.com',
              },
              fr: {
                message: 'Test FR',
                redirectionUrl: '',
              },
              timeToRedirect: '2',
            },
          ],
        },
      })
      const openLinkSpy = vi.spyOn(wrapper.vm, 'openLink')

      vi.advanceTimersByTime(2000)

      expect(openLinkSpy).not.toHaveBeenCalled()
    })

    it('should verify openLink method is callable with correct parameters', () => {
      wrapper = createWrapper()
      window.open = vi.fn()

      wrapper.vm.openLink('https://test.com')

      expect(window.open).toHaveBeenCalledWith('https://test.com', '_self')
    })
  })

  describe('Methods', () => {
    it('should open link with window.open using _self target', () => {
      window.open = vi.fn()
      wrapper = createWrapper()
      wrapper.vm.openLink('https://example.com')

      expect(window.open).toHaveBeenCalledWith('https://example.com', '_self')
    })
  })

  describe('Props Defaults', () => {
    it('should default lang to en', () => {
      wrapper = createWrapper({ lang: undefined })
      expect(wrapper.vm.lang).toBe('en')
    })

    it('should handle section as empty object', () => {
      wrapper = createWrapper({ section: {} })
      expect(wrapper.vm.section).toEqual({})
    })
  })

  describe('gWysiwygContent Props', () => {
    it('should pass correct props to gWysiwygContent', () => {
      wrapper = createWrapper({
        section: {
          settings: [
            {
              en: {
                message: 'Test message',
                redirectionUrl: 'https://example.com',
              },
              timeToRedirect: '2',
              classes: 'custom-class',
            },
          ],
        },
      })
      const wysiwyg = wrapper.findComponent(mockWysiwygContent)
      expect(wysiwyg.props('tag')).toBe('p')
      expect(wysiwyg.props('wrapperClasses')).toBe('custom-class')
      expect(wysiwyg.props('classes')).toBe(
        'mobileTitleStyle mt-4 md:mx-4 title w-full',
      )
    })
  })
})
