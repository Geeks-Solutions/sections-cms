import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FAQ from '../FAQ.vue'
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

describe('FAQ', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(FAQ, {
      global: {
        config: {
          globalProperties: {
            $t: vi.fn((key) => key),
          },
        },
        plugins: [i18n],
        mocks: {
          $t: vi.fn((key) => key),
        },
        stubs: {
          LazyMediasUploadMedia: true,
          LazySectionsFormsFieldSets: true,
          LazyEditorWysiwyg: true,
          LazySectionFormErrors: true,
        },
      },
      props: {
        selectedLang: 'en',
        defaultLang: 'en',
        locales: ['en', 'fr'],
      },
    })
  })

  it('adds WYSIWYG media correctly in settings', () => {
    const initialLength = wrapper.vm.settings.length
    const media = { media_id: '12345', url: 'https://example.com/image.jpg' }
    wrapper.vm.wysiwygMediaAdded(media)

    expect(wrapper.vm.settings).toContainEqual(
      expect.objectContaining({ wysiwygMedia: media, wysiwygLang: 'en' }),
    )
    expect(wrapper.vm.settings.length).toBe(initialLength + 1)
  })

  it('validates WYSIWYG media presence in QAs', () => {
    const media = { media_id: '67890', url: 'https://example.com/image.jpg' }
    wrapper.vm.settings[0].en.title = 'Title'
    wrapper.vm.addQA()
    wrapper.vm.settings[0].QAs[0].en.question = 'Test question'
    wrapper.vm.settings[0].QAs[0].en.answer = `<img src='${media.url}' media-id='${media.media_id}' />`
    wrapper.vm.wysiwygMediaAdded(media)

    expect(wrapper.vm.validate()).toBe(true)
    expect(
      wrapper.vm.settings.some((obj) => obj.wysiwygMedia?.media_id === '67890'),
    ).toBe(true)
  })

  it('removes media if not found in any QA answers', () => {
    const media = { media_id: '99999', url: 'https://example.com/image.png' }
    wrapper.vm.wysiwygMediaAdded(media)
    expect(
      wrapper.vm.settings.some((obj) => obj.wysiwygMedia?.media_id === '99999'),
    ).toBe(true)

    wrapper.vm.validate()
    expect(
      wrapper.vm.settings.some((obj) => obj.wysiwygMedia?.media_id === '99999'),
    ).toBe(false)
  })

  it('fails validation if title is missing', () => {
    wrapper.vm.settings[0].en.title = ''
    expect(wrapper.vm.validate()).toBe(false)
    expect(wrapper.vm.errors.title).toBe(true)
  })

  it('passes validation if title is present', () => {
    wrapper.vm.settings[0].en.title = 'Valid Title'
    expect(wrapper.vm.validate()).toBe(true)
    expect(wrapper.vm.errors.title).toBe(false)
  })

  it('removes unused media objects', async () => {
    const media1 = { media_id: '11111', url: 'https://example.com/media1.jpg' }
    const media2 = { media_id: '22222', url: 'https://example.com/media2.jpg' }

    wrapper.vm.addQA()
    wrapper.vm.settings[0].en.title = 'Title'
    wrapper.vm.settings[0].QAs[0].en.question = 'Some question'
    wrapper.vm.settings[0].QAs[0].en.answer = `<img src='${media1.url}' data-media-id='${media1.media_id}' />`

    wrapper.vm.wysiwygMediaAdded(media1)

    await wrapper.setProps({
      selectedLang: 'fr',
    })
    wrapper.vm.wysiwygMediaAdded(media2)

    wrapper.vm.validate()
    expect(
      wrapper.vm.settings.some((obj) => obj.wysiwygMedia?.media_id === '22222'),
    ).toBe(false)
    expect(
      wrapper.vm.settings.some((obj) => obj.wysiwygMedia?.media_id === '11111'),
    ).toBe(true)
  })

  it('keeps media if found in any QA answer', () => {
    const media = { media_id: '33333', url: 'https://example.com/media3.jpg' }
    wrapper.vm.addQA()
    wrapper.vm.settings[0].en.title = 'Title'
    wrapper.vm.settings[0].QAs[0].en.question = 'Another question'
    wrapper.vm.settings[0].QAs[0].en.answer = `<img src='${media.url}' data-media-id='${media.media_id}' />`

    wrapper.vm.wysiwygMediaAdded(media)

    wrapper.vm.validate()
    expect(
      wrapper.vm.settings.some((obj) => obj.wysiwygMedia?.media_id === '33333'),
    ).toBe(true)
  })

  it('removes media with empty url from main settings', () => {
    wrapper.vm.settings[0].media = {
      media_id: 'empty_id',
      url: '',
      seo_tag: '',
    }

    wrapper.vm.validate()

    expect(wrapper.vm.settings[0].media).toBeUndefined()
  })

  it('keeps media with valid url in main settings', () => {
    const validMedia = {
      media_id: 'valid_id',
      url: 'https://example.com/valid.jpg',
      seo_tag: 'valid tag',
    }
    wrapper.vm.settings[0].media = validMedia

    wrapper.vm.validate()

    expect(wrapper.vm.settings[0].media).toEqual(validMedia)
  })

  it('adds QA with correct structure', () => {
    const initialLength = wrapper.vm.settings[0].QAs.length
    wrapper.vm.addQA()

    expect(wrapper.vm.settings[0].QAs.length).toBe(initialLength + 1)
    expect(wrapper.vm.settings[0].QAs[0]).toHaveProperty('en')
    expect(wrapper.vm.settings[0].QAs[0]).toHaveProperty('fr')
    expect(wrapper.vm.settings[0].QAs[0].en).toHaveProperty('question')
    expect(wrapper.vm.settings[0].QAs[0].en).toHaveProperty('answer')
    expect(wrapper.vm.settings[0].QAs[0]).toHaveProperty('classes')
  })

  it('removes QA by index', () => {
    wrapper.vm.addQA()
    wrapper.vm.addQA()
    const initialLength = wrapper.vm.settings[0].QAs.length

    wrapper.vm.removeQA(0)

    expect(wrapper.vm.settings[0].QAs.length).toBe(initialLength - 1)
  })

  it('updates QA answer correctly', () => {
    wrapper.vm.addQA()
    const newAnswer = '<p>New answer content</p>'
    const idx = 0

    wrapper.vm.updateQAAnswer(newAnswer, idx)

    expect(wrapper.vm.settings[0].QAs[idx].en.answer).toBe(newAnswer)
  })

  it('removes media from settings', () => {
    const media = {
      media_id: 'test_id',
      url: 'https://example.com/test.jpg',
      seo_tag: 'test',
    }
    wrapper.vm.settings[0].media = media

    wrapper.vm.removeMedia(0)

    expect(wrapper.vm.settings[0].media).toEqual({})
  })
})
