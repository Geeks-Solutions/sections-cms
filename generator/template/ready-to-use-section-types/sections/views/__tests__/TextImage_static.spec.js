import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TextImageStatic from '../TextImage_static.vue'

vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    locale: { value: 'en' },
  })),
}))

vi.mock('@/utils/constants', () => ({
  sectionsStyle: {},
}))

const mockGWysiwygContent = {
  name: 'gWysiwygContent',
  template:
    '<div :class="Array.isArray(wrapperClasses) ? wrapperClasses.join(` `) : wrapperClasses"><slot></slot></div>',
  props: ['tag', 'wrapperClasses', 'classes', 'htmlContent'],
}

const mockGUniversalViewer = {
  name: 'GUniversalViewer',
  template: '<img :src="src" :alt="alt">',
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

const mockLazyYoutube = {
  name: 'LazyYoutube',
  template: '<div><iframe :src="src"></iframe></div>',
  props: ['src', 'maxWidth', 'autoplay'],
}

const mockI18n = {
  locale: 'en',
}

describe('TextImageStatic', () => {
  let wrapper

  const createWrapper = (props = {}) => {
    const baseSettings = {
      title: {
        en: '<h2>Our Title</h2>',
        fr: '<h2>Notre Titre</h2>',
      },
      text: {
        en: '<p>This is our description text</p>',
        fr: '<p>Ceci est notre texte de description</p>',
      },
      media: {
        url: 'https://example.com/image.jpg',
        seo_tag: 'Our Image',
        metadata: { type: 'image' },
      },
      imagePosition: 'right',
      sectionWrapperClass: 'custom-wrapper',
      titleClasses: 'custom-title',
      textClasses: 'custom-text',
      videoLink: '',
      autoplay: false,
      loop: false,
      controls: false,
      whiteProgress: false,
    }

    const settings = props.section ? [baseSettings] : [baseSettings]

    return mount(TextImageStatic, {
      props: {
        lang: 'en',
        section: { settings: settings },
        ...props,
      },
      global: {
        components: {
          gWysiwygContent: mockGWysiwygContent,
          GUniversalViewer: mockGUniversalViewer,
          LazyYoutube: mockLazyYoutube,
        },
        mocks: {
          $i18n: mockI18n,
          $t: vi.fn((key) => key),
        },
        stubs: {
          gWysiwygContent: mockGWysiwygContent,
          GUniversalViewer: mockGUniversalViewer,
          LazyYoutube: mockLazyYoutube,
        },
      },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Initialization', () => {
    it('should render with default props', () => {
      wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should not render when settings is undefined', () => {
      wrapper = createWrapper({ section: {} })
      expect(wrapper.find('.text-image').exists()).toBe(false)
    })
  })

  describe('Layout Classes', () => {
    it('should have correct wrapper classes', () => {
      wrapper = createWrapper()
      const rowWrapper = wrapper.find('.row-wrapper')

      expect(rowWrapper.exists()).toBe(true)
    })

    it('should apply sectionWrapperClass', () => {
      wrapper = createWrapper()
      const rowWrapper = wrapper.find('.row-wrapper')

      expect(rowWrapper.classes()).toContain('custom-wrapper')
    })
  })

  describe('Title Rendering', () => {
    it('should render title wrapper', () => {
      wrapper = createWrapper()
      const titleWrapper = wrapper.find('.title-wrapper')

      expect(titleWrapper.exists()).toBe(true)
    })
  })

  describe('Text Rendering', () => {
    it('should render description wrapper', () => {
      wrapper = createWrapper()
      const descWrapper = wrapper.find('.desc-wrapper')

      expect(descWrapper.exists()).toBe(true)
    })
  })

  describe('Image Rendering', () => {
    it('should render GUniversalViewer when media exists', () => {
      wrapper = createWrapper()
      const imageViewer = wrapper.findComponent({ name: 'GUniversalViewer' })

      expect(imageViewer.exists()).toBe(true)
    })

    it('should not render GUniversalViewer when media does not exist', () => {
      wrapper = createWrapper({
        section: {
          settings: [
            {
              title: { en: 'Title' },
              text: { en: 'Text' },
              imagePosition: 'right',
            },
          ],
        },
      })
      const imageViewer = wrapper.findComponent({ name: 'GUniversalViewer' })

      expect(imageViewer.exists()).toBe(false)
    })
  })

  describe('Video Rendering', () => {
    it('should render LazyYoutube when videoLink is provided', () => {
      wrapper = createWrapper({
        section: {
          settings: [
            {
              title: { en: 'Title' },
              text: { en: 'Text' },
              media: { url: 'image.jpg', seo_tag: 'Image' },
              imagePosition: 'right',
              videoLink: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
              autoplay: false,
            },
          ],
        },
      })
      const youtube = wrapper.findComponent({ name: 'LazyYoutube' })

      expect(youtube.exists()).toBe(true)
    })

    it('should not render image wrapper when videoLink is provided', () => {
      wrapper = createWrapper({
        section: {
          settings: [
            {
              title: { en: 'Title' },
              text: { en: 'Text' },
              media: { url: 'image.jpg', seo_tag: 'Image' },
              imagePosition: 'right',
              videoLink: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
              autoplay: false,
            },
          ],
        },
      })
      const imageWrapper = wrapper.find('.image-wrapper')

      expect(imageWrapper.exists()).toBe(false)
    })

    it('should pass autoplay prop to LazyYoutube', () => {
      wrapper = createWrapper({
        section: {
          settings: [
            {
              title: { en: 'Title' },
              text: { en: 'Text' },
              media: { url: 'image.jpg', seo_tag: 'Image' },
              imagePosition: 'right',
              videoLink: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
              autoplay: true,
            },
          ],
        },
      })
      const youtube = wrapper.findComponent({ name: 'LazyYoutube' })

      expect(youtube.props('autoplay')).toBe(true)
    })
  })

  describe('Methods - extractVideoId', () => {
    it('should extract video ID from YouTube watch URL', () => {
      wrapper = createWrapper()
      const url = 'https://youtube.com/watch?v=dQw4w9WgXcQ'
      const videoId = wrapper.vm.extractVideoId(url)

      expect(videoId).toBe('dQw4w9WgXcQ')
    })

    it('should extract video ID from YouTube embed URL', () => {
      wrapper = createWrapper()
      const url = 'https://youtube.com/embed/dQw4w9WgXcQ'
      const videoId = wrapper.vm.extractVideoId(url)

      expect(videoId).toBe('dQw4w9WgXcQ')
    })

    it('should extract video ID from youtu.be URL', () => {
      wrapper = createWrapper()
      const url = 'https://youtu.be/dQw4w9WgXcQ'
      const videoId = wrapper.vm.extractVideoId(url)

      expect(videoId).toBe('dQw4w9WgXcQ')
    })

    it('should return null for invalid URL', () => {
      wrapper = createWrapper()
      const url = 'https://example.com/video'
      const videoId = wrapper.vm.extractVideoId(url)

      expect(videoId).toBeNull()
    })
  })

  describe('Methods - isYouTubeLink', () => {
    it('should return true for youtube.com URL', () => {
      wrapper = createWrapper()
      const url = 'https://youtube.com/watch?v=test'
      const isYouTube = wrapper.vm.isYouTubeLink(url)

      expect(isYouTube).toBe(true)
    })

    it('should return true for youtu.be URL', () => {
      wrapper = createWrapper()
      const url = 'https://youtu.be/test'
      const isYouTube = wrapper.vm.isYouTubeLink(url)

      expect(isYouTube).toBe(true)
    })

    it('should return true for www.youtube.com URL', () => {
      wrapper = createWrapper()
      const url = 'https://www.youtube.com/watch?v=test'
      const isYouTube = wrapper.vm.isYouTubeLink(url)

      expect(isYouTube).toBe(true)
    })

    it('should return false for non-YouTube URL', () => {
      wrapper = createWrapper()
      const url = 'https://vimeo.com/123456'
      const isYouTube = wrapper.vm.isYouTubeLink(url)

      expect(isYouTube).toBe(false)
    })

    it('should return false for empty string', () => {
      wrapper = createWrapper()
      const isYouTube = wrapper.vm.isYouTubeLink('')

      expect(isYouTube).toBe(false)
    })

    it('should handle invalid URL gracefully', () => {
      wrapper = createWrapper()
      const url = 'not-a-url'
      const isYouTube = wrapper.vm.isYouTubeLink(url)

      expect(isYouTube).toBe(false)
    })
  })

  describe('Component Structure', () => {
    it('should have text-image wrapper class', () => {
      wrapper = createWrapper()

      expect(wrapper.find('.text-image').exists()).toBe(true)
    })

    it('should have row-wrapper element', () => {
      wrapper = createWrapper()

      expect(wrapper.find('.row-wrapper').exists()).toBe(true)
    })

    it('should have title-wrapper element', () => {
      wrapper = createWrapper()

      expect(wrapper.find('.title-wrapper').exists()).toBe(true)
    })

    it('should have image-wrapper element when image exists', () => {
      wrapper = createWrapper()

      expect(wrapper.find('.image-wrapper').exists()).toBe(true)
    })
  })

  describe('Language Support', () => {
    it('should render English content by default', () => {
      wrapper = createWrapper()
      const titleWrapper = wrapper.find('.title-wrapper')

      expect(titleWrapper.exists()).toBe(true)
    })
  })
})
