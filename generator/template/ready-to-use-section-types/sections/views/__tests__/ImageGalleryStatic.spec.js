import { shallowMount } from "@vue/test-utils";
import ImageGalleryStatic from "../ImageGallery_static.vue";

describe('ImageGalleryStatic.vue', () => {
  let wrapper

  const mockSection = {
    settings: [
      {
        selectedLayout: 'grid',
        gallery: [
          {
            media: {
                "url": "https://example.com/image.jpg",
                "seo_tag": "Example Image"
            }
          }
        ]
      },
    ],
  }

  beforeEach(() => {
    wrapper = shallowMount(ImageGalleryStatic, {
      propsData: {
        section: mockSection,
        lang: 'en',
      }
    })
  })

  it('opens preview on image click', async () => {
    const image = { media: { url: 'https://example.com/image.jpg', seo_tag: 'Example Image' } };
    wrapper.setData({ images: [image], selectedLayout: 'grid' });

    const imageElement = wrapper.find('.grid-wrapper .grid-img-wrapper');
    await imageElement.trigger('click');

    expect(wrapper.vm.isPreviewOpen).toBe(true);
    expect(wrapper.vm.selectedImage).toEqual(image);
  });

  it('should render the correct layout based on selectedLayout prop', async () => {
    const layouts = ['vertical-masonry', 'horizontal-masonry', 'grid', 'slider', 'thumbnails'];

    await jest.resetAllMocks()
    for (const layout of layouts) {
      wrapper.setProps({
        section: {
          settings: [
            {
              selectedLayout: layout
            }
          ]
        }
      });
      await wrapper.vm.$nextTick(() => {
        const layoutWrapper = wrapper.find(`.${layout}-wrapper`);
        expect(layoutWrapper.exists()).toBe(true);
      });
    }
  });
})
