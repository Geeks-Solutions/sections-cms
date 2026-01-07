import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ImageGalleryStatic from '../ImageGallery_static.vue'

// Mock the gallery layout components
const Grid = {
  template:
    '<div class="grid-wrapper"><div class="grid-img-wrapper"></div></div>',
}
const VerticalMasonry = {
  template: '<div class="vertical-masonry-wrapper"></div>',
}
const HorizontalMasonry = {
  template: '<div class="horizontal-masonry-wrapper"></div>',
}
const Slider = { template: '<div class="slider-wrapper"></div>' }
const Thumbnails = { template: '<div class="thumbnails-wrapper"></div>' }

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
    wrapper = shallowMount(ImageGalleryStatic, {
      global: {
        stubs: {
          GalleryLayoutGrid: Grid,
          GalleryLayoutVerticalMasonry: VerticalMasonry,
          GalleryLayoutHorizontalMasonry: HorizontalMasonry,
          GalleryLayoutSlider: Slider,
          GalleryLayoutThumbnails: Thumbnails,
        },
      },
      props: {
        section: mockSection,
        lang: 'en',
      },
    })
  })

  it('opens preview on image click', async () => {
    const image = {
      media: { url: 'https://example.com/image.jpg', seo_tag: 'Example Image' },
    }

    await wrapper.vm.$nextTick()

    const imageElement = wrapper.find('.grid-wrapper .grid-img-wrapper')
    await imageElement.trigger('click')

    expect(wrapper.vm.isPreviewOpen).toBe(true)
    expect(wrapper.vm.selectedImage).toEqual(image)
  })

  it('should render the correct layout based on selectedLayout prop', async () => {
    const layouts = {
      verticalMasonry: 'vertical-masonry',
      horizontalMasonry: 'horizontal-masonry',
      grid: 'grid',
      slider: 'slider',
      thumbnails: 'thumbnails',
    }

    // await vi.resetAllMocks()

    for (const layout of Object.keys(layouts)) {
      wrapper.setProps({
        section: {
          settings: [
            {
              gallery: [
                {
                  media: {
                    url: 'https://example.com/image.jpg',
                    seo_tag: 'Example Image',
                  },
                },
              ],
              selectedLayout: layout,
            },
          ],
        },
      })
      await wrapper.vm.$nextTick(() => {
        const layoutWrapper = wrapper.find(`.${layouts[layout]}-wrapper`)
        expect(layoutWrapper.exists()).toBe(true)
      })
    }
  })
})
