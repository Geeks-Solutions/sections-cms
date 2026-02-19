import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ImageGallery from '../ImageGallery.vue'

vi.mock('#app', () => ({
  useI18n: vi.fn(() => ({
    t: vi.fn((key) => key),
    locale: { value: 'en' },
  })),
}))

vi.mock('@/utils/constants', () => ({
  assignMediaObject: vi.fn((media) => media),
  scrollToFirstError: vi.fn(),
  sectionsStyle: {
    fieldLabel: 'test-field-label',
    input: 'test-input',
  },
}))

vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    t: vi.fn((key) => key),
  })),
}))

describe('ImageGallery.vue Form', () => {
  let wrapper

  const createWrapper = (options = {}) => {
    return shallowMount(ImageGallery, {
      props: {
        selectedLang: 'en',
        defaultLang: 'en',
        locales: ['en', 'fr'],
        selectedMedia: null,
        ...options.props,
      },
      global: {
        mocks: {
          $t: vi.fn((key) => key),
        },
        stubs: {
          LazyMediasUploadMedia: true,
          LazySectionsFormsFieldSets: true,
        },
      },
      ...options,
    })
  }

  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('Component Initialization', () => {
    it('should initialize with default settings', () => {
      expect(wrapper.vm.settings).toBeDefined()
      expect(wrapper.vm.settings.length).toBe(1)
      expect(wrapper.vm.settings[0].selectedLayout).toBe('')
      expect(wrapper.vm.settings[0].gallery).toBeDefined()
      expect(wrapper.vm.settings[0].gallery.length).toBe(1)
    })

    it('should initialize with empty errors', () => {
      expect(wrapper.vm.errors.media).toBe(false)
      expect(wrapper.vm.errors.mediaMobile).toBe(false)
      expect(wrapper.vm.errors.selectedLayout).toBe(false)
    })
  })

  describe('Media Management', () => {
    it('should add a new media item to gallery', () => {
      const initialLength = wrapper.vm.settings[0].gallery.length
      wrapper.vm.addMedia()
      expect(wrapper.vm.settings[0].gallery.length).toBe(initialLength + 1)
      expect(wrapper.vm.settings[0].gallery[initialLength]).toEqual({
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
      })
    })

    it('should remove media from gallery block', () => {
      wrapper.vm.settings[0].gallery = [
        {
          media: {
            media_id: '1',
            url: 'https://example.com/image1.jpg',
            seo_tag: 'Image 1',
          },
          mediaMobile: {
            media_id: '2',
            url: 'https://example.com/image1-mobile.jpg',
            seo_tag: 'Image 1 Mobile',
          },
        },
        {
          media: {
            media_id: '3',
            url: 'https://example.com/image2.jpg',
            seo_tag: 'Image 2',
          },
          mediaMobile: {
            media_id: '4',
            url: 'https://example.com/image2-mobile.jpg',
            seo_tag: 'Image 2 Mobile',
          },
        },
      ]

      wrapper.vm.removeMedia(0, 'media')

      expect(wrapper.vm.settings[0].gallery[0].media).toEqual({})
    })

    it('should remove gallery block when more than one exists', () => {
      wrapper.vm.addMedia()
      wrapper.vm.addMedia()
      const initialLength = wrapper.vm.settings[0].gallery.length

      wrapper.vm.removeGalleryBlock(0)

      expect(wrapper.vm.settings[0].gallery.length).toBe(initialLength - 1)
    })

    it('should not remove gallery block when only one exists', () => {
      const initialLength = wrapper.vm.settings[0].gallery.length

      wrapper.vm.removeGalleryBlock(0)

      expect(wrapper.vm.settings[0].gallery.length).toBe(initialLength)
    })
  })

  describe('Validation', () => {
    it('should return false when selectedLayout is empty', () => {
      wrapper.vm.settings[0].selectedLayout = ''
      wrapper.vm.settings[0].gallery[0].media = {
        url: 'https://example.com/image.jpg',
        media_id: '1',
      }
      wrapper.vm.settings[0].gallery[0].mediaMobile = {
        url: 'https://example.com/image-mobile.jpg',
        media_id: '2',
      }

      const result = wrapper.vm.validate()

      expect(result).toBe(false)
      expect(wrapper.vm.errors.selectedLayout).toBe(true)
    })

    it('should return false when gallery has no media', () => {
      wrapper.vm.settings[0].selectedLayout = 'grid'
      wrapper.vm.settings[0].gallery[0].media = {}

      const result = wrapper.vm.validate()

      expect(result).toBe(false)
      expect(wrapper.vm.errors.media).toBe(true)
    })

    it('should return false when gallery has no mediaMobile', () => {
      wrapper.vm.settings[0].selectedLayout = 'grid'
      wrapper.vm.settings[0].gallery[0].media = {
        url: 'https://example.com/image.jpg',
        media_id: '1',
      }
      wrapper.vm.settings[0].gallery[0].mediaMobile = {}

      const result = wrapper.vm.validate()

      expect(result).toBe(false)
      expect(wrapper.vm.errors.mediaMobile).toBe(true)
    })

    it('should return true when all validations pass', () => {
      wrapper.vm.settings[0].selectedLayout = 'grid'
      wrapper.vm.settings[0].gallery[0].media = {
        url: 'https://example.com/image.jpg',
        media_id: '1',
      }
      wrapper.vm.settings[0].gallery[0].mediaMobile = {
        url: 'https://example.com/image-mobile.jpg',
        media_id: '2',
      }

      const result = wrapper.vm.validate()

      expect(result).toBe(true)
      expect(wrapper.vm.errors.selectedLayout).toBe(false)
      expect(wrapper.vm.errors.media).toBe(false)
      expect(wrapper.vm.errors.mediaMobile).toBe(false)
    })

    it('should set empty media objects to empty object during validation', () => {
      wrapper.vm.settings[0].gallery[0].media = {}
      wrapper.vm.settings[0].gallery[0].mediaMobile = {}

      wrapper.vm.validate()

      expect(wrapper.vm.settings[0].gallery[0].media).toEqual({})
      expect(wrapper.vm.settings[0].gallery[0].mediaMobile).toEqual({})
    })
  })

  describe('Media Upload Handling', () => {
    it('should handle upload container clicked for media', () => {
      const object = {
        media: { media_id: '123', url: 'https://example.com/image.jpg' },
      }

      wrapper.vm.handleUploadContainerClicked(0, 'media', object)

      expect(wrapper.vm.selectedMediaIndex).toBe(0)
      expect(wrapper.vm.selectedMediaKey).toBe('media')
      expect(wrapper.emitted('openMediaModal')).toBeTruthy()
      expect(wrapper.emitted('openMediaModal')[0]).toEqual(['123'])
    })

    it('should handle upload container clicked when no media exists', () => {
      const object = {
        media: {},
      }

      wrapper.vm.handleUploadContainerClicked(0, 'media', object)

      expect(wrapper.vm.selectedMediaIndex).toBe(0)
      expect(wrapper.vm.selectedMediaKey).toBe('media')
      expect(wrapper.emitted('openMediaModal')).toBeTruthy()
      expect(wrapper.emitted('openMediaModal')[0]).toEqual([null])
    })

    it('should handle upload container clicked for mediaMobile', () => {
      const object = {
        mediaMobile: {
          media_id: '456',
          url: 'https://example.com/image-mobile.jpg',
        },
      }

      wrapper.vm.handleUploadContainerClicked(0, 'mediaMobile', object)

      expect(wrapper.vm.selectedMediaIndex).toBe(0)
      expect(wrapper.vm.selectedMediaKey).toBe('mediaMobile')
      expect(wrapper.emitted('openMediaModal')).toBeTruthy()
      expect(wrapper.emitted('openMediaModal')[0]).toEqual(['456'])
    })
  })

  describe('Language Selection', () => {
    it('should update siteLang when selectedLang changes', async () => {
      await wrapper.setProps({
        selectedLang: 'fr',
      })

      expect(wrapper.vm.siteLang).toBe('fr')
    })
  })

  describe('Settings Data', () => {
    it('should have gallery defined in settings', () => {
      expect(wrapper.vm.settings[0].gallery).toBeDefined()
      expect(Array.isArray(wrapper.vm.settings[0].gallery)).toBe(true)
    })

    it('should maintain existing gallery when set', () => {
      const existingGallery = [
        {
          media: { url: 'https://example.com/image.jpg', media_id: '1' },
        },
      ]
      wrapper.vm.settings[0].gallery = existingGallery

      expect(wrapper.vm.settings[0].gallery).toEqual(existingGallery)
    })
  })

  describe('Media Selection Handling', () => {
    it('should update gallery when selectedMedia is provided', async () => {
      const mediaObject = {
        media_id: '123',
        url: 'https://example.com/new-image.jpg',
        seo_tag: 'New Image',
      }

      await wrapper.setProps({
        selectedMedia: mediaObject,
      })

      expect(wrapper.vm.settings[0].gallery[0].media).toEqual(mediaObject)
    })

    it('should close media modal after selecting media', async () => {
      const mediaObject = {
        media_id: '123',
        url: 'https://example.com/new-image.jpg',
        seo_tag: 'New Image',
      }

      await wrapper.setProps({
        selectedMedia: mediaObject,
      })

      expect(wrapper.emitted('closeMediaModal')).toBeTruthy()
    })

    it('should add media to medias array if not already present', async () => {
      const mediaObject = {
        media_id: '123',
        url: 'https://example.com/new-image.jpg',
        seo_tag: 'New Image',
      }

      await wrapper.setProps({
        selectedMedia: mediaObject,
      })

      expect(wrapper.vm.settings[0].medias).toContainEqual(mediaObject)
    })
  })
})
