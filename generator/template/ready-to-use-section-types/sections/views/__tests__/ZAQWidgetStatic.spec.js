import { mount, createLocalVue } from '@vue/test-utils'
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
            typingIconMedia: { url: 'https://example.com/typingIcon.png' }
        }
    ]

    beforeEach(() => {
        // Mock $i18n
        const localVue = createLocalVue()
        localVue.prototype.$i18n = { locale: 'en' }

        // Mock window.zaq
        mockZaQ = { $emit: jest.fn() }
        global.window.zaq = mockZaQ

        // Mock the zaq-widget component as a stub
        wrapper = mount(ZAQWidgetStatic, {
            localVue,
            propsData: {
                section: { settings: mockSettings }
            },
            stubs: {
                'zaq-widget': true  // Mock the zaq-widget component as a simple stub
            }
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
        wrapper.destroy()
    })

    it('renders zaq-widget when settings are provided', async () => {
        // Find the stubbed zaq-widget
        const zaqWidget = wrapper.findComponent({ name: 'zaq-widget' })
        expect(zaqWidget.exists()).toBe(true)
    })
})
