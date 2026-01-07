import { describe, it, test, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import InteractiveDisplay from '../InteractiveDisplay.vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {},
    fr: {},
  },
})

describe('InteractiveDisplay', () => {
  let wrapper
  const defaultProps = {}
  const defaultData = {}

  beforeEach(() => {
    wrapper = shallowMount(InteractiveDisplay, {
      global: {
        config: {
          globalProperties: {
            $t: vi.fn(),
          },
        },
        plugins: [i18n],
      },
      data() {
        return defaultData
      },
      props: defaultProps,
    })
  })

  test('displays error message when videoLink is empty and error is true', async () => {
    await wrapper.setData({ errors: { videoLink: true } })
    expect(wrapper.find('.text-error').exists()).toBe(true)
  })

  test('updates videoLink when input changes', async () => {
    const input = wrapper.find('input[type="text"]')
    await input.setValue('https://example.com/video.mp4')
    expect(wrapper.vm.settings[0].videoLink).toBe(
      'https://example.com/video.mp4',
    )
  })

  test('adds a new media block when addMedia is called', async () => {
    const initialLength = wrapper.vm.settings[0].carousels.length
    await wrapper.vm.addMedia()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.settings[0].carousels.length).toBe(initialLength + 1)
  })

  test('removes a media block when removeCarouselBlock is called', async () => {
    await wrapper.vm.addMedia() // Ensure there's more than one item
    const initialLength = wrapper.vm.settings[0].carousels.length
    await wrapper.vm.removeCarouselBlock(1)
    expect(wrapper.vm.settings[0].carousels.length).toBe(initialLength - 1)
  })

  it('should remove wysiwygMediasData if media_id is not found in title or text', () => {
    wrapper.vm.settings = [
      {
        title: {
          en: 'Title',
          fr: 'Title',
        },
        text: {
          en: 'Text',
          fr: 'Text',
        },
        cta: {
          en: '',
          fr: '',
        },
        ctaLink: {
          en: '',
          fr: '',
        },
        wysiwygMediasData: [
          {
            wysiwygLang: 'en',
            wysiwygMedia: { media_id: 'not_existing' },
          },
        ],
        wysiwygMedias: [{ media_id: 'not_existing' }],
        carousels: [
          {
            title: {
              en: '',
              fr: '',
            },
            text: {
              en: '',
              fr: '',
            },
            titleClasses: '',
            textClasses: '',
            cta: {
              en: '',
              fr: '',
            },
            ctaLink: {
              en: '',
              fr: '',
            },
            ctaLinkTarget: '',
            media: {
              media_id: '',
              url: '',
              seo_tag: '',
            },
            mediaMobile: {
              media_id: '',
              url: '',
              seo_tag: '',
            },
          },
        ],
      },
    ]

    wrapper.vm.validate()
    wrapper.vm.$nextTick()
    expect(wrapper.vm.settings[0].wysiwygMediasData).toHaveLength(0)
    expect(wrapper.vm.settings[0].wysiwygMedias).toBe(undefined)
  })

  it('should delete wysiwygMedias if it is empty', async () => {
    wrapper.vm.settings = [
      {
        title: {
          en: 'Title',
          fr: 'Title',
        },
        text: {
          en: 'Text',
          fr: 'Text',
        },
        cta: {
          en: '',
          fr: '',
        },
        ctaLink: {
          en: '',
          fr: '',
        },
        wysiwygMediasData: [],
        wysiwygMedias: [],
        carousels: [
          {
            title: {
              en: '',
              fr: '',
            },
            text: {
              en: '',
              fr: '',
            },
            titleClasses: '',
            textClasses: '',
            cta: {
              en: '',
              fr: '',
            },
            ctaLink: {
              en: '',
              fr: '',
            },
            ctaLinkTarget: '',
            media: {
              media_id: '',
              url: '',
              seo_tag: '',
            },
            mediaMobile: {
              media_id: '',
              url: '',
              seo_tag: '',
            },
          },
        ],
      },
    ]

    wrapper.vm.validate()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.settings[0]).not.toHaveProperty('wysiwygMedias')
  })

  it('returns modified videoLink when mobileVideoLink is not set and videoLink is a YouTube link', async () => {
    await vi.resetAllMocks()

    setTimeout(() => {
      wrapper.setProps({
        section: {
          settings: [
            {
              videoLink: 'https://www.youtube.com/watch?v=12345',
              mobileVideoLink: '',
              autoplay: true,
              loop: true,
              controls: false,
              whiteProgress: true,
            },
          ],
        },
      })

      expect(wrapper.vm.computedMobileVideoUrl).toContain(
        'https://www.youtube.com/watch?v=12345',
      )
      expect(wrapper.vm.computedMobileVideoUrl).toContain('autoplay=1')
      expect(wrapper.vm.computedMobileVideoUrl).toContain('mute=1')
      expect(wrapper.vm.computedMobileVideoUrl).toContain('loop=1')
      expect(wrapper.vm.computedMobileVideoUrl).toContain('controls=0')
      expect(wrapper.vm.computedMobileVideoUrl).toContain('color=white')
    }, 1000)
  })

  it('returns modified mobileVideoLink when mobileVideoLink is set and is a YouTube link', () => {
    setTimeout(() => {
      wrapper.setProps({
        section: {
          settings: [
            {
              videoLink: 'https://www.youtube.com/watch?v=12345',
              mobileVideoLink: 'https://www.youtube.com/watch?v=67890',
              mobileAutoplay: false,
              mobileLoop: true,
              mobileControls: true,
              mobileWhiteProgress: false,
            },
          ],
        },
      })

      expect(wrapper.vm.computedMobileVideoUrl).toContain(
        'https://www.youtube.com/watch?v=67890',
      )
      expect(wrapper.vm.computedMobileVideoUrl).not.toContain('autoplay=1')
      expect(wrapper.vm.computedMobileVideoUrl).toContain('loop=1')
      expect(wrapper.vm.computedMobileVideoUrl).toContain('controls=0')
      expect(wrapper.vm.computedMobileVideoUrl).not.toContain('color=white')
    }, 1000)
  })

  it('returns mobileVideoLink when it is set but not a YouTube link', () => {
    setTimeout(() => {
      wrapper.setProps({
        section: {
          settings: [
            {
              videoLink: 'https://www.youtube.com/watch?v=12345',
              mobileVideoLink: 'https://example.com/video.mp4',
            },
          ],
        },
      })

      expect(wrapper.vm.computedMobileVideoUrl).toBe(
        'https://example.com/video.mp4',
      )
    }, 1000)
  })

  it('returns videoLink when mobileVideoLink is empty and videoLink is not a YouTube link', () => {
    setTimeout(() => {
      wrapper.setProps({
        section: {
          settings: [
            {
              videoLink: 'https://example.com/video.mp4',
              mobileVideoLink: '',
            },
          ],
        },
      })

      expect(wrapper.vm.computedMobileVideoUrl).toBe(
        'https://example.com/video.mp4',
      )
    }, 1000)
  })
})
