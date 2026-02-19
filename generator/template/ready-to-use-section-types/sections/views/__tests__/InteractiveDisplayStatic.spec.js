import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import InteractiveDisplayStatic from '../InteractiveDisplay_static.vue'

// Mock vue-i18n to provide $i18n
vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    locale: { value: 'en' },
  })),
}))

const mockI18n = {
  locale: 'en',
}

// Mock global-link component
const mockGlobalLink = {
  name: 'global-link',
  template: '<a><slot></slot></a>',
  props: ['link', 'lang', 'defaultLang', 'formLinkTarget'],
}

// Mock GUniversalViewer
const mockGUniversalViewer = {
  name: 'GUniversalViewer',
  template: '<img :src="src" :alt="alt" />',
  props: [
    'src',
    'alt',
    'type',
    'class',
    'width',
    'height',
    'placeholder',
    'format',
    'loading',
  ],
}

// Mock gWysiwygContent
const mockGWysiwygContent = {
  name: 'gWysiwygContent',
  template: '<div><slot></slot></div>',
  props: ['tag', 'wrapperClasses', 'classes', 'htmlContent'],
}

describe('InteractiveDisplayStatic.vue', () => {
  let wrapper

  const mockSection = {
    settings: [
      {
        title: { en: 'Title', fr: 'Titre' },
        text: { en: 'Some text', fr: 'Du texte' },
        cta: { en: 'Click me', fr: 'Cliquez moi' },
        ctaLink: { en: 'https://link.com', fr: 'https://lien.com' },
        videoLink: '',
        media: 'image',
        mediaMobile: 'image',
      },
    ],
  }

  const createWrapper = (props = {}) => {
    return shallowMount(InteractiveDisplayStatic, {
      props: {
        section: mockSection,
        lang: 'en',
        ...props,
      },
      global: {
        components: {
          'global-link': mockGlobalLink,
          GUniversalViewer: mockGUniversalViewer,
          gWysiwygContent: mockGWysiwygContent,
        },
        mocks: {
          $i18n: mockI18n,
        },
        stubs: {
          'global-link': mockGlobalLink,
          GUniversalViewer: mockGUniversalViewer,
          gWysiwygContent: mockGWysiwygContent,
        },
      },
    })
  }

  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('renders <global-link> when cta exists in block', () => {
    const globalLink = wrapper.findComponent({ name: 'global-link' })

    expect(globalLink.exists()).toBe(true)
  })

  it('does not render <global-link> when cta does not exist in block', async () => {
    wrapper = createWrapper({
      section: {
        settings: [
          {
            title: { en: 'Title', fr: 'Titre' },
            text: { en: 'Some text', fr: 'Du texte' },
            cta: { en: '', fr: '' },
            ctaLink: { en: 'https://link.com', fr: 'https://lien.com' },
            videoLink: '',
          },
        ],
      },
    })

    await wrapper.vm.$nextTick()

    const globalLink = wrapper.findComponent({ name: 'global-link' })

    expect(globalLink.exists()).toBe(false)
  })

  it('renders <global-link> based on video cta in settings', async () => {
    wrapper = createWrapper({
      section: {
        settings: [
          {
            videoTitle: { en: 'title' },
            videoText: { en: 'desc' },
            videoCta: { en: 'Watch now' },
            videoCtaLink: { en: 'https://link.com' },
            videoLink: 'https://youtube.com/watch?v=123',
          },
        ],
      },
    })

    await wrapper.vm.$nextTick()

    const globalLink = wrapper.findComponent({ name: 'global-link' })

    expect(globalLink.exists()).toBe(true)
  })

  it('does not render <global-link> when video cta does not exist in settings', async () => {
    await vi.resetAllMocks()
    wrapper = createWrapper({
      section: {
        settings: [
          {
            title: { en: 'title', fr: 'titre' },
            text: { en: 'desc', fr: 'description' },
            cta: { en: '', fr: '' },
            ctaLink: { en: '', fr: '' },
            ctaLinkTarget: '',
            media: { url: '', media_id: '', seo_tag: '' },
            mediaMobile: { url: '', media_id: '', seo_tag: '' },
            videoLink: '',
          },
        ],
      },
    })

    await wrapper.vm.$nextTick()

    const globalLink = wrapper.findComponent({ name: 'global-link' })

    expect(globalLink.exists()).toBe(false)
  })
})
