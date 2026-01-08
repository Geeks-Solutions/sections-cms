import { describe, it, test, expect, beforeEach, vi } from 'vitest'
import { shallowMount, mount } from '@vue/test-utils'
import InteractiveDisplay from '../InteractiveDisplay.vue'

describe('InteractiveDisplay', () => {
  let wrapper

  const createWrapper = (props = {}, shallow = true) => {
    const mountFn = shallow ? shallowMount : mount
    return mountFn(InteractiveDisplay, {
      props: {
        selectedLang: 'en',
        defaultLang: 'en',
        locales: ['en', 'fr'],
        ...props,
      },
      global: {
        stubs: {
          gAutoComplete: true,
          LazyEditorWysiwyg: true,
          LazyFormLink: true,
          LazySectionsFormsFieldSets: true,
          LazyMediasUploadMedia: true,
        },
      },
    })
  }

  beforeEach(() => {
    wrapper = createWrapper()
  })

  test('displays error message when videoLink is empty and error is true', async () => {
    wrapper = createWrapper({}, false)
    await wrapper.setData({ errors: { videoLink: true } })
    expect(wrapper.find('.text-error').exists()).toBe(true)
  })

  test('updates videoLink when input changes', async () => {
    wrapper = createWrapper({}, false)
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
    await wrapper.vm.addMedia()
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
})
