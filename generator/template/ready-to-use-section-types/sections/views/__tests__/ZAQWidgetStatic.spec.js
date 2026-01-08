import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ZAQWidgetStatic from '../ZAQWidget_static.vue'

describe('ZAQWidgetStatic.vue', () => {
  let wrapper
  let mockZaQ
  const mockSettings = [
    {
      websiteId: '12345',
      hideBadge: false,
      sequence: { url: 'https://example.com/sequence' },
      autoStart: 'seq1',
      css: { url: 'https://example.com/style.css' },
      sendBtnMedia: { url: 'https://example.com/sendBtn.png' },
      typingIconMedia: { url: 'https://example.com/typingIcon.png' },
    },
  ]

  beforeEach(() => {
    mockZaQ = {
      $emit: vi.fn(),
      removeEventListners: vi.fn(),
      disconnect: vi.fn(),
    }
    global.window.zaq = mockZaQ
    global.process = { browser: true }

    wrapper = mount(ZAQWidgetStatic, {
      props: {
        section: { settings: mockSettings },
        lang: 'en',
      },
      global: {
        mocks: {
          $i18n: { locale: 'en' },
          $t: vi.fn((key) => key),
          $route: {
            query: {},
            params: {},
            path: '/',
          },
        },
        compilerOptions: {
          isCustomElement: (tag) => tag === 'zaq-widget',
        },
        stubs: {
          'client-only': {
            template: '<div><slot></slot></div>',
          },
        },
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    if (wrapper) {
      wrapper.unmount()
    }
    delete global.window.zaq
    delete global.process
  })

  it('renders the wrapper div when settings are provided', () => {
    const wrapperDiv = wrapper.find('.zaq-widget')
    expect(wrapperDiv.exists()).toBe(true)
  })

  it('computes settings correctly from section prop', () => {
    expect(wrapper.vm.settings).toEqual(mockSettings)
  })

  it('renders zaq-widget with correct props', () => {
    const zaqWidget = wrapper.find('zaq-widget')
    expect(zaqWidget.exists()).toBe(true)
    expect(zaqWidget.attributes('website-id')).toBe('12345')
    expect(zaqWidget.attributes('hide-badge')).toBe('false')
    expect(zaqWidget.attributes('lang')).toBe('en')
    expect(zaqWidget.attributes('load-sequence')).toBe(
      'https://example.com/sequence',
    )
    expect(zaqWidget.attributes('css')).toBe('https://example.com/style.css')
    expect(zaqWidget.attributes('session-suffix')).toBe('12345')
  })

  it('renders zaq-widget with correct icons JSON', () => {
    const zaqWidget = wrapper.find('zaq-widget')
    const expectedIcons = JSON.stringify({
      sendBtn: 'https://example.com/sendBtn.png',
      typingIcon: 'https://example.com/typingIcon.png',
    })
    expect(zaqWidget.attributes('icons')).toBe(expectedIcons)
  })

  it('does not render when settings are null', () => {
    const nullWrapper = mount(ZAQWidgetStatic, {
      props: {
        section: { settings: null },
        lang: 'en',
      },
      global: {
        mocks: {
          $i18n: { locale: 'en' },
          $t: vi.fn((key) => key),
          $route: {
            query: {},
            params: {},
            path: '/',
          },
        },
        compilerOptions: {
          isCustomElement: (tag) => tag === 'zaq-widget',
        },
        stubs: {
          'client-only': {
            template: '<div><slot></slot></div>',
          },
        },
      },
    })

    const wrapperDiv = nullWrapper.find('.zaq-widget')
    expect(wrapperDiv.exists()).toBe(false)
  })

  it('cleans up widget state on beforeUnmount', () => {
    const spy = vi.spyOn(global.window.zaq, '$emit')
    const spyRemove = vi.spyOn(global.window.zaq, 'removeEventListners')
    const spyDisconnect = vi.spyOn(global.window.zaq, 'disconnect')

    wrapper.unmount()

    expect(spy).toHaveBeenCalledWith('clearConversations')
    expect(spy).toHaveBeenCalledWith('clearWidgetState')
    expect(spyRemove).toHaveBeenCalled()
    expect(spyDisconnect).toHaveBeenCalled()
  })

  it('sets up widget event handler when autoStart is set', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

    wrapper = mount(ZAQWidgetStatic, {
      props: {
        section: {
          settings: [
            {
              ...mockSettings[0],
              autoStart: 'seq1',
            },
          ],
        },
        lang: 'en',
      },
      global: {
        mocks: {
          $i18n: { locale: 'en' },
          $t: vi.fn((key) => key),
          $route: {
            query: {},
            params: {},
            path: '/',
          },
        },
        compilerOptions: {
          isCustomElement: (tag) => tag === 'zaq-widget',
        },
        stubs: {
          'client-only': {
            template: '<div><slot></slot></div>',
          },
        },
      },
    })

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'zaqWidget',
      expect.any(Function),
      false,
    )
  })

  it('initializes widget with dev bucket when zaq_dev query param is true', () => {
    wrapper = mount(ZAQWidgetStatic, {
      props: {
        section: { settings: mockSettings },
        lang: 'en',
      },
      global: {
        mocks: {
          $i18n: { locale: 'en' },
          $t: vi.fn((key) => key),
          $route: {
            query: { zaq_dev: 'true' },
            params: {},
            path: '/',
          },
        },
        compilerOptions: {
          isCustomElement: (tag) => tag === 'zaq-widget',
        },
        stubs: {
          'client-only': {
            template: '<div><slot></slot></div>',
          },
        },
      },
    })

    const scriptElement = wrapper.vm.scriptElement
    expect(scriptElement).toBeTruthy()
    expect(scriptElement.getAttribute('src')).toContain('zaq-ai-dev')
  })
})
