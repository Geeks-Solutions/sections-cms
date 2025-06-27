import { shallowMount } from "@vue/test-utils";
import ZAQWidget from "../ZAQWidget.vue";

vi.mock('#app', () => ({
  useFetch: vi.fn()
}))

import { useFetch } from '#app'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {},
    fr: {}
  }
})

describe('ZAQWidget', () => {
  let wrapper;

  const defaultData = {

  };

  beforeEach(() => {
    wrapper = shallowMount(ZAQWidget, {
      global: {
        config: {
          globalProperties: {
            $t: vi.fn()
          }
        },
        plugins: [i18n]
      },
      data() {
        return defaultData
      },
      propsData: {
        selectedLang: 'en',
        locales: [],
        mediaFields: [
          {
            type: 'image',
            name: 'sendBtnMedia'
          },
          {
            type: 'image',
            name: 'typingIconMedia'
          }
        ]
      }
    });
  });

  it('updates sequences and autoStart when removeMedia is called', async () => {
    await wrapper.setData({
      sequences: { 'seq1': 'Sequence 1', 'seq2': 'Sequence 2' },
      settings: [
        {
          websiteId: '123',
          sequence: { media_id: '1', url: 'http://example.com/sequence', seo_tag: 'seq' },
          css: {},
          sendBtnMedia: {},
          typingIconMedia: {},
          hideBadge: false,
          autoStart: 'seq1'
        }
      ]
    })

    await wrapper.vm.removeMedia('sequence')

    expect(wrapper.vm.sequences).toBeNull()
    expect(wrapper.vm.settings[0].autoStart).toBe('None')
  })

  it('updates sequences and autoStart when selectedMedia changes', async () => {
    wrapper.vm.selectedMediaKey = 'sequence'
    wrapper.vm.settings = [
      {
        websiteId: '123',
        sequence: {},
        css: {},
        sendBtnMedia: {},
        typingIconMedia: {},
        hideBadge: false,
        autoStart: 'None'
      }
    ]

    const mediaObject = {
      id: '1',
      files: [{ url: 'http://example.com/sequence', filename: 'seq', headers: {} }],
      seo_tag: 'seq'
    }
    await wrapper.vm.$options.watch.selectedMedia.call(wrapper.vm, mediaObject)

    expect(wrapper.vm.settings[0].sequence.media_id).toBe('1')
    expect(wrapper.vm.settings[0].sequence.url).toBe('http://example.com/sequence')
    expect(wrapper.vm.settings[0].sequence.seo_tag).toBe('seq')
    expect(wrapper.vm.settings[0].autoStart).toBe('None')

    await vi.resetAllMocks()

    const mockResponse = { data: { 'seq1': 'Sequence 1', 'seq2': 'Sequence 2' } }
    useFetch.mockResolvedValue({
      data: mockResponse.data,
      pending: false,
      error: null,
      refresh: vi.fn()
    })

    // Call loadSequences method
    await wrapper.vm.loadSequences()

    // Check if sequences are loaded correctly
    expect(wrapper.vm.sequences).toEqual(mockResponse.data)
  })

});
