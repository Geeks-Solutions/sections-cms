import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageGalleryStatic from '../ImageGallery_static.vue'

vi.mock('#app', () => ({
  useI18n: vi.fn(() => ({
    t: vi.fn((key) => key),
    locale: { value: 'en' },
  })),
}))

describe('ImageGalleryStatic.vue', () => {
  let wrapper

  const mockSection = {
    settings: [
      {
        selectedLayout: 'grid',
        gallery: [
          {
            media: {
              url: 'https://example.com/image.jpg',
              seo_tag: 'Example Image',
            },
          },
        ],
      },
    ],
  }

  beforeEach(() => {
    wrapper = mount(ImageGalleryStatic, {
      props: {
        section: mockSection,
        lang: 'en',
      },
      global: {
        stubs: {
          GUniversalViewer: true,
        },
      },
    })
  })

  describe('Component Rendering', () => {
    it('should render when section has settings', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.image-gallery-main-wrapper').exists()).toBe(true)
    })

    it('should not render when section has no settings', async () => {
      await wrapper.setProps({
        section: {},
      })
      expect(wrapper.find('.image-gallery-main-wrapper').exists()).toBe(false)
    })
  })

  describe('Layout Selection', () => {
    it('should render grid layout when selectedLayout is grid', async () => {
      await wrapper.setProps({
        section: {
          settings: [
            {
              selectedLayout: 'grid',
              gallery: [
                {
                  media: {
                    url: 'https://example.com/image.jpg',
                    seo_tag: 'Example Image',
                  },
                },
              ],
            },
          ],
        },
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.selectedLayout).toBe('grid')
      expect(wrapper.find('.grid-wrapper').exists()).toBe(true)
    })

    it('should render vertical masonry layout when selectedLayout is verticalMasonry', async () => {
      await wrapper.setProps({
        section: {
          settings: [
            {
              selectedLayout: 'verticalMasonry',
              gallery: [
                {
                  media: {
                    url: 'https://example.com/image.jpg',
                    seo_tag: 'Example Image',
                  },
                },
              ],
            },
          ],
        },
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.selectedLayout).toBe('verticalMasonry')
      expect(wrapper.find('.vertical-masonry-wrapper').exists()).toBe(true)
    })

    it('should render horizontal masonry layout when selectedLayout is horizontalMasonry', async () => {
      await wrapper.setProps({
        section: {
          settings: [
            {
              selectedLayout: 'horizontalMasonry',
              gallery: [
                {
                  media: {
                    url: 'https://example.com/image.jpg',
                    seo_tag: 'Example Image',
                  },
                },
              ],
            },
          ],
        },
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.selectedLayout).toBe('horizontalMasonry')
      expect(wrapper.find('.horizontal-masonry-wrapper').exists()).toBe(true)
    })

    it('should render slider layout when selectedLayout is slider', async () => {
      await wrapper.setProps({
        section: {
          settings: [
            {
              selectedLayout: 'slider',
              gallery: [
                {
                  media: {
                    url: 'https://example.com/image.jpg',
                    seo_tag: 'Example Image',
                  },
                },
              ],
            },
          ],
        },
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.selectedLayout).toBe('slider')
      expect(wrapper.find('.slider-wrapper').exists()).toBe(true)
    })

    it('should render thumbnails layout when selectedLayout is thumbnails', async () => {
      await wrapper.setProps({
        section: {
          settings: [
            {
              selectedLayout: 'thumbnails',
              gallery: [
                {
                  media: {
                    url: 'https://example.com/image.jpg',
                    seo_tag: 'Example Image',
                  },
                },
              ],
            },
          ],
        },
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.selectedLayout).toBe('thumbnails')
      expect(wrapper.find('.thumbnails-wrapper').exists()).toBe(true)
    })
  })

  describe('Image Preview', () => {
    it('should open preview on image click', async () => {
      const image = {
        media: {
          url: 'https://example.com/image.jpg',
          seo_tag: 'Example Image',
        },
      }

      await wrapper.vm.$nextTick()

      wrapper.vm.openPreview(image)

      expect(wrapper.vm.isPreviewOpen).toBe(true)
      expect(wrapper.vm.selectedImage).toEqual(image)
    })

    it('should close preview when closePreview is called', async () => {
      wrapper.vm.isPreviewOpen = true
      wrapper.vm.selectedImage = {
        media: {
          url: 'https://example.com/image.jpg',
          seo_tag: 'Example Image',
        },
      }

      wrapper.vm.closePreview()

      expect(wrapper.vm.isPreviewOpen).toBe(false)
      expect(wrapper.vm.selectedImage).toBe(null)
    })

    it('should display preview modal when isPreviewOpen is true', async () => {
      wrapper.vm.isPreviewOpen = true
      wrapper.vm.selectedImage = {
        media: {
          url: 'https://example.com/image.jpg',
          seo_tag: 'Example Image',
        },
      }

      await wrapper.vm.$nextTick()

      expect(wrapper.find('.preview-image-wrapper').exists()).toBe(true)
    })

    it('should not display preview modal when isPreviewOpen is false', () => {
      wrapper.vm.isPreviewOpen = false

      expect(wrapper.find('.preview-image-wrapper').exists()).toBe(false)
    })
  })

  describe('Zoom Functionality', () => {
    it('should handle zoom in', async () => {
      wrapper.vm.isPreviewOpen = true
      wrapper.vm.selectedImage = {
        media: {
          url: 'https://example.com/image.jpg',
          seo_tag: 'Example Image',
        },
      }
      wrapper.vm.zoom = 1

      await wrapper.vm.$nextTick()

      const zoomInButton = wrapper.find(
        '.preview-image-controls-row div:nth-child(1)',
      )
      await zoomInButton.trigger('click')

      expect(wrapper.vm.zoom).toBe(1.1)
    })

    it('should handle zoom out', async () => {
      wrapper.vm.isPreviewOpen = true
      wrapper.vm.selectedImage = {
        media: {
          url: 'https://example.com/image.jpg',
          seo_tag: 'Example Image',
        },
      }
      wrapper.vm.zoom = 2

      await wrapper.vm.$nextTick()

      const zoomOutButton = wrapper.find(
        '.preview-image-controls-row div:nth-child(2)',
      )
      await zoomOutButton.trigger('click')

      expect(wrapper.vm.zoom).toBe(1.9)
    })

    it('should not zoom below 1', async () => {
      wrapper.vm.isPreviewOpen = true
      wrapper.vm.selectedImage = {
        media: {
          url: 'https://example.com/image.jpg',
          seo_tag: 'Example Image',
        },
      }
      wrapper.vm.zoom = 1

      await wrapper.vm.$nextTick()

      const zoomOutButton = wrapper.find(
        '.preview-image-controls-row div:nth-child(2)',
      )
      await zoomOutButton.trigger('click')

      expect(wrapper.vm.zoom).toBe(1)
    })

    it('should not zoom above 3', async () => {
      wrapper.vm.isPreviewOpen = true
      wrapper.vm.selectedImage = {
        media: {
          url: 'https://example.com/image.jpg',
          seo_tag: 'Example Image',
        },
      }
      wrapper.vm.zoom = 3

      await wrapper.vm.$nextTick()

      const zoomInButton = wrapper.find(
        '.preview-image-controls-row div:nth-child(1)',
      )
      await zoomInButton.trigger('click')

      expect(wrapper.vm.zoom).toBe(3)
    })

    it('should handle wheel zoom', () => {
      wrapper.vm.zoom = 1

      const event = { deltaY: -100 }
      wrapper.vm.handleZoom(event)

      expect(wrapper.vm.zoom).toBe(1.1)
    })

    it('should handle wheel zoom down', () => {
      wrapper.vm.zoom = 2

      const event = { deltaY: 100 }
      wrapper.vm.handleZoom(event)

      expect(wrapper.vm.zoom).toBe(1.9)
    })
  })

  describe('Computed Properties', () => {
    it('should compute settings correctly', () => {
      expect(wrapper.vm.settings).toEqual(mockSection.settings)
    })

    it('should compute images correctly', () => {
      expect(wrapper.vm.images).toEqual(mockSection.settings[0].gallery)
    })

    it('should return empty array for images when settings is missing', async () => {
      await wrapper.setProps({
        section: { settings: [] },
      })
      expect(wrapper.vm.images).toEqual([])
    })

    it('should compute selectedLayout correctly', () => {
      expect(wrapper.vm.selectedLayout).toBe('grid')
    })

    it('should return undefined for selectedLayout when no settings[0]', async () => {
      await wrapper.setProps({
        section: { settings: [{}] },
      })
      expect(wrapper.vm.selectedLayout).toBeUndefined()
    })
  })

  describe('Preview Reset', () => {
    it('should reset zoom to 1 when opening preview', () => {
      wrapper.vm.zoom = 2
      wrapper.vm.openPreview({
        media: {
          url: 'https://example.com/image.jpg',
          seo_tag: 'Example Image',
        },
      })

      expect(wrapper.vm.zoom).toBe(1)
    })
  })
})
