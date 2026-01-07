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
      sequenceName: 'testSequence',
      css: { url: 'https://example.com/style.css' },
      sendBtnMedia: { url: 'https://example.com/sendBtn.png' },
      typingIconMedia: { url: 'https://example.com/typingIcon.png' },
    },
  ]

  beforeEach(() => {
    // Mock window.zaq
    mockZaQ = {
      $emit: vi.fn(),
      removeEventListners: vi.fn(),
      disconnect: vi.fn(),
    }
    global.window.zaq = mockZaQ

    // Mock the zaq-widget component as a stub
    wrapper = mount(ZAQWidgetStatic, {
      props: {
        section: { settings: mockSettings },
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
        stubs: {
          'client-only': true,
          'zaq-widget': true,
        },
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('renders zaq-widget when settings are provided', async () => {
    // Find the stubbed zaq-widget
    const zaqWidget = wrapper.findComponent({ name: 'zaq-widget' })
    expect(zaqWidget.exists()).toBe(true)
  })
})
