import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ZAQWidget from '../ZAQWidget.vue'
import { createI18n } from 'vue-i18n'
import zaqTranslations from '../ZAQWidget_i18n.json'

const i18n = createI18n({
  legacy: true,
  locale: 'en',
  fallbackLocale: 'en',
  messages: zaqTranslations,
})

describe('ZAQWidget', () => {
  let wrapper

  const defaultData = {}

  beforeEach(() => {
    wrapper = shallowMount(ZAQWidget, {
      global: {
        config: {
          globalProperties: {
            $t: i18n.global.t,
          },
        },
        plugins: [i18n],
        stubs: {
          LazyMediasUploadMedia: true,
          gAutoComplete: true,
        },
      },
      data() {
        return defaultData
      },
      props: {
        selectedLang: 'en',
        locales: [],
        mediaFields: [
          {
            type: 'image',
            name: 'sendBtnMedia',
          },
          {
            type: 'image',
            name: 'typingIconMedia',
          },
        ],
      },
    })
  })

  it('updates sequences and autoStart when removeMedia is called', async () => {
    await wrapper.setData({
      sequences: { seq1: 'Sequence 1', seq2: 'Sequence 2' },
      settings: [
        {
          websiteId: '123',
          sequence: {
            media_id: '1',
            url: 'http://example.com/sequence',
            seo_tag: 'seq',
          },
          css: {},
          sendBtnMedia: {},
          typingIconMedia: {},
          hideBadge: false,
          autoStart: 'seq1',
        },
      ],
    })

    await wrapper.vm.removeMedia('sequence')

    expect(wrapper.vm.sequences).toBeNull()
    expect(wrapper.vm.settings[0].autoStart).toBe('None')
  })

  it('updates settings when selectedMedia changes', async () => {
    wrapper.vm.selectedMediaKey = 'sequence'
    wrapper.vm.settings = [
      {
        websiteId: '123',
        sequence: {},
        css: {},
        sendBtnMedia: {},
        typingIconMedia: {},
        hideBadge: false,
        autoStart: 'None',
      },
    ]

    const mediaObject = {
      id: '1',
      files: [
        { url: 'http://example.com/sequence', filename: 'seq', headers: {} },
      ],
      seo_tag: 'seq',
    }

    await wrapper.setProps({ selectedMedia: mediaObject })

    expect(wrapper.vm.settings[0].sequence.media_id).toBe('1')
    expect(wrapper.vm.settings[0].sequence.url).toBe(
      'http://example.com/sequence',
    )
    expect(wrapper.vm.settings[0].sequence.seo_tag).toBe('seq')
    expect(wrapper.vm.settings[0].sequence.filename).toBe('seq')
    expect(wrapper.vm.settings[0].autoStart).toBe('None')
  })

  it('updates settings for css when selectedMedia changes', async () => {
    wrapper.vm.selectedMediaKey = 'css'
    wrapper.vm.settings = [
      {
        websiteId: '123',
        sequence: {},
        css: {},
        sendBtnMedia: {},
        typingIconMedia: {},
        hideBadge: false,
        autoStart: 'None',
      },
    ]

    const mediaObject = {
      id: '2',
      files: [
        { url: 'http://example.com/style.css', filename: 'style', headers: {} },
      ],
      seo_tag: 'style',
    }

    await wrapper.setProps({ selectedMedia: mediaObject })

    expect(wrapper.vm.settings[0].css.media_id).toBe('2')
    expect(wrapper.vm.settings[0].css.url).toBe('http://example.com/style.css')
    expect(wrapper.vm.settings[0].css.seo_tag).toBe('style')
    expect(wrapper.vm.settings[0].css.filename).toBe('style')
  })

  it('validates websiteId and returns false when empty', async () => {
    await wrapper.setData({
      settings: [
        {
          websiteId: '',
          sequence: {},
          css: {},
          sendBtnMedia: {},
          typingIconMedia: {},
          hideBadge: false,
          autoStart: 'None',
        },
      ],
    })

    const isValid = wrapper.vm.validate()

    expect(isValid).toBe(false)
    expect(wrapper.vm.errors.websiteId).toBe(true)
  })

  it('validates websiteId and returns true when provided', async () => {
    await wrapper.setData({
      settings: [
        {
          websiteId: '123',
          sequence: {},
          css: {},
          sendBtnMedia: {},
          typingIconMedia: {},
          hideBadge: false,
          autoStart: 'None',
        },
      ],
    })

    const isValid = wrapper.vm.validate()

    expect(isValid).toBe(true)
    expect(wrapper.vm.errors.websiteId).toBe(false)
  })
})
