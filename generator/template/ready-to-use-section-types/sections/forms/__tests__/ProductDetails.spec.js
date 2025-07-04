import { shallowMount } from "@vue/test-utils";
import ProductDetails from "../ProductDetails.vue";
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      forms: {
        name: 'Name',
        description: 'Description',
        requiredField: 'This field is required',
        autoPlay: 'Auto Play',
        loop: 'Loop',
        removeControls: 'Remove Controls',
        whiteProgress: 'White Progress',
        block: 'Block',
        media: 'Media',
        uploadMedia: 'Upload Media',
        changeMedia: 'Change Media',
        seoTag: 'SEO Tag',
        video: 'Video',
        videoLink: 'Video Link',
        videoLinkDesc: 'Enter video URL',
        image: 'Image'
      },
      productDetails: {
        price: 'Price',
        currency: 'Currency',
        mediaType: 'Media Type',
        addMedia: 'Add Media'
      }
    },
    fr: {}
  }
})

describe('ProductDetails', () => {
  let wrapper;
  const defaultProps = {
    selectedLang: 'en',
    defaultLang: 'en',
    locales: ['en', 'fr'],
    selectedMedia: {},
    mediaFields: [
      {
        type: 'image',
        name: 'medias'
      }
    ]
  };

  const defaultData = {
    private_data: {
      productMedias: [
        {
          mediaType: "image",
          media: {
            media_id: "",
            url: "",
            thumbnail_url: "",
            seo_tag: "",
          },
          video: {
            url: ""
          }
        }
      ],
      medias: []
    },
    settings: [
      {
        name: {
          en: '',
          fr: ''
        },
        description: {
          en: '',
          fr: ''
        },
        descriptionClasses: '',
        price: null,
        currency: '',
        autoplay: false,
        loop: false,
        controls: false,
        whiteProgress: false,
        productMedias: []
      }
    ],
    errors: {
      name: false,
      description: false,
      price: false,
      currency: false,
      media: false
    }
  };

  beforeEach(() => {
    wrapper = shallowMount(ProductDetails, {
      global: {
        config: {
          globalProperties: {
            $t: vi.fn((key) => {
              const keys = key.split('.');
              let result = i18n.global.messages.en;
              for (const k of keys) {
                result = result[k];
              }
              return result || key;
            })
          }
        },
        plugins: [i18n]
      },
      data() {
        return defaultData
      },
      propsData: defaultProps
    });
  });

  describe('Component Initialization', () => {
    test('renders correctly with default props', () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('#name').exists()).toBe(true);
      expect(wrapper.find('#description').exists()).toBe(true);
      expect(wrapper.find('#price').exists()).toBe(true);
      expect(wrapper.find('#currency').exists()).toBe(true);
      expect(wrapper.find('#media').exists()).toBe(true);
    });

    test('initializes with correct default data', () => {
      expect(wrapper.vm.settings[0].name.en).toBe('');
      expect(wrapper.vm.settings[0].price).toBe(null);
      expect(wrapper.vm.settings[0].currency).toBe('');
      expect(wrapper.vm.settings[0].autoplay).toBe(false);
      expect(wrapper.vm.private_data.productMedias).toHaveLength(1);
      expect(wrapper.vm.private_data.productMedias[0].mediaType).toBe('image');
    });
  });

  describe('Form Input Updates', () => {
    test('updates name when input changes', async () => {
      const nameInput = wrapper.find('#name input');
      await nameInput.setValue('Test Product');
      expect(wrapper.vm.settings[0].name.en).toBe('Test Product');
    });

    test('updates price when input changes', async () => {
      const priceInput = wrapper.find('#price input');
      await priceInput.setValue('99.99');
      expect(wrapper.vm.settings[0].price).toBe(99.99);
    });

    test('updates checkbox values correctly', async () => {
      const autoplayCheckbox = wrapper.find('input[type="checkbox"]');
      await autoplayCheckbox.setChecked(true);
      expect(wrapper.vm.settings[0].autoplay).toBe(true);
    });
  });

  describe('Media Management', () => {
    test('adds a new media block when addProductMedia is called', async () => {
      const initialLength = wrapper.vm.private_data.productMedias.length;
      await wrapper.vm.addProductMedia();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.private_data.productMedias.length).toBe(initialLength + 1);
    });

    test('removes a media block when removeProductMediaBlock is called', async () => {
      await wrapper.vm.addProductMedia(); // Ensure there's more than one item
      const initialLength = wrapper.vm.private_data.productMedias.length;
      await wrapper.vm.removeProductMediaBlock(1);
      expect(wrapper.vm.private_data.productMedias.length).toBe(initialLength - 1);
    });

    test('does not remove media block if only one exists', async () => {
      await vi.resetAllMocks();
      await wrapper.vm.removeProductMediaBlock(1);
      await wrapper.vm.removeProductMediaBlock(0);
      expect(wrapper.vm.private_data.productMedias.length).toBe(1);
    });

    test('removes product media correctly', async () => {
      await wrapper.vm.removeProductMedia(0);
      expect(wrapper.vm.private_data.productMedias[0].media.media_id).toBe('');
      expect(wrapper.vm.private_data.productMedias[0].media.url).toBe('');
    });
  });

  describe('Media Selection and Handling', () => {
    test('handles selectedMedia prop changes', async () => {
      const mockMedia = {
        id: 'test-id',
        files: [{
          url: 'https://example.com/test.jpg',
          thumbnail_url: 'https://example.com/test-thumb.jpg',
          filename: 'test.jpg'
        }],
        seo_tag: 'Test SEO'
      };

      await wrapper.setProps({ selectedMedia: mockMedia });
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.private_data.productMedias[0].media.media_id).toBe('test-id');
      expect(wrapper.vm.private_data.productMedias[0].media.url).toBe('https://example.com/test.jpg');
      expect(wrapper.vm.private_data.productMedias[0].media.seo_tag).toBe('Test SEO');
    });

    test('builds product media settings correctly', async () => {
      const testMedias = [
        {
          mediaType: 'image',
          media: {
            media_id: 'test-id',
            url: 'https://example.com/test.jpg',
            thumbnail_url: 'https://example.com/test-thumb.jpg',
            seo_tag: 'Test SEO'
          }
        },
        {
          mediaType: 'video',
          video: {
            url: 'https://example.com/video.mp4'
          }
        }
      ];

      await wrapper.vm.buildProductMediaSettings(testMedias);
      expect(wrapper.vm.settings[0].productMedias).toHaveLength(2);
      expect(wrapper.vm.settings[0].productMedias[0].mediaType).toBe('image');
      expect(wrapper.vm.settings[0].productMedias[1].mediaType).toBe('video');
    });
  });

  describe('Description Updates', () => {
    test('updates text description when called', async () => {
      const testContent = '<p>Test description content</p>';
      await wrapper.vm.updateTextDescription(testContent);
      expect(wrapper.vm.settings[0].description.en).toBe(testContent);
    });
  });

  describe('Language Handling', () => {
    test('updates siteLang when selectedLang prop changes', async () => {
      await wrapper.setProps({ selectedLang: 'fr' });
      expect(wrapper.vm.siteLang).toBe('fr');
    });
  });

  describe('Validation', () => {
    test('validates required fields correctly', async () => {
      wrapper.vm.settings[0].name.en = ''
      wrapper.vm.settings[0].description.en = ''
      wrapper.vm.settings[0].price = null
      wrapper.vm.settings[0].productMedias[0].media = {}
      const result = wrapper.vm.validate();
      expect(result).toBe(false);
      expect(wrapper.vm.errors.name).toBe(true);
      expect(wrapper.vm.errors.description).toBe(true);
      expect(wrapper.vm.errors.price).toBe(true);
      expect(wrapper.vm.errors.currency).toBe(true);
      expect(wrapper.vm.errors.media).toBe(true);
    });

    test('passes validation when all required fields are filled', async () => {
      await wrapper.setData({
        settings: [
          {
            name: {
              en: 'Test Product',
              fr: 'Test Product FR'
            },
            description: {
              en: '<p>Test description</p>',
              fr: '<p>Test description FR</p>'
            },
            price: 99.99,
            currency: 'USD',
            productMedias: [
              {
                mediaType: 'image',
                media: {
                  media_id: 'test-id',
                  url: 'https://example.com/test.jpg'
                }
              }
            ]
          }
        ]
      });

      const result = wrapper.vm.validate();
      expect(result).toBe(true);
      expect(wrapper.vm.errors.name).toBe(false);
      expect(wrapper.vm.errors.description).toBe(false);
      expect(wrapper.vm.errors.price).toBe(false);
      expect(wrapper.vm.errors.currency).toBe(false);
      expect(wrapper.vm.errors.media).toBe(false);
    });

    test('validates video media correctly', async () => {
      await wrapper.setData({
        settings: [
          {
            name: {
              en: 'Test Product',
              fr: 'Test Product FR'
            },
            description: {
              en: '<p>Test description</p>',
              fr: '<p>Test description FR</p>'
            },
            price: 99.99,
            currency: 'USD',
            productMedias: [
              {
                mediaType: 'video',
                video: {
                  url: 'https://example.com/video.mp4'
                }
              }
            ]
          }
        ]
      });

      const result = wrapper.vm.validate();
      expect(result).toBe(true);
      expect(wrapper.vm.errors.media).toBe(false);
    });

    test('fails validation for empty video URL', async () => {
      await wrapper.setData({
        settings: [
          {
            name: {
              en: 'Test Product',
              fr: 'Test Product FR'
            },
            description: {
              en: '<p>Test description</p>',
              fr: '<p>Test description FR</p>'
            },
            price: 99.99,
            currency: 'USD',
            productMedias: [
              {
                mediaType: 'video',
                video: {
                  url: ''
                }
              }
            ]
          }
        ]
      });

      const result = wrapper.vm.validate();
      expect(result).toBe(false);
      expect(wrapper.vm.errors.media).toBe(true);
    });

    test('filters out empty media blocks during validation', async () => {
      await wrapper.setData({
        private_data: {
          productMedias: [
            {
              mediaType: 'image',
              media: {
                media_id: 'test-id',
                url: 'https://example.com/test.jpg'
              }
            },
            {
              mediaType: 'image',
              media: {
                media_id: '',
                url: ''
              }
            }
          ]
        }
      });

      await wrapper.vm.validate();
      expect(wrapper.vm.private_data.productMedias).toHaveLength(1);
    });
  });

  describe('Error Display', () => {
    test('displays error message when name is empty and error is true', async () => {
      await wrapper.setData({ errors: { name: true } });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('#name .text-error').exists()).toBe(true);
    });

    test('displays error message when description is empty and error is true', async () => {
      await wrapper.setData({ errors: { description: true } });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('#description .text-error').exists()).toBe(true);
    });

    test('displays error message when price is empty and error is true', async () => {
      await wrapper.setData({ errors: { price: true } });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('#price .text-error').exists()).toBe(true);
    });

    test('displays error message when currency is empty and error is true', async () => {
      await wrapper.setData({ errors: { currency: true } });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('#currency .text-error').exists()).toBe(true);
    });
  });

  describe('Currency and Media Type Options', () => {
    test('has correct currency options', () => {
      expect(wrapper.vm.currencies).toEqual([
        { key: '€', value: 'EUR' },
        { key: '$', value: 'USD' }
      ]);
    });

    test('has correct media type options', () => {
      expect(wrapper.vm.mediaTypes).toHaveLength(2);
      expect(wrapper.vm.mediaTypes[0].key).toBe('image');
      expect(wrapper.vm.mediaTypes[1].key).toBe('video');
    });
  });

  describe('Component Events', () => {
    test('emits closeMediaModal when selectedMedia changes', async () => {
      const mockMedia = {
        id: 'test-id',
        files: [{
          url: 'https://example.com/test.jpg',
          thumbnail_url: 'https://example.com/test-thumb.jpg',
          filename: 'test.jpg'
        }],
        seo_tag: 'Test SEO'
      };

      await wrapper.setProps({ selectedMedia: mockMedia });
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('closeMediaModal')).toBeTruthy();
    });
  });

  describe('Watchers', () => {
    test('updates private_data when productMedias change', async () => {
      const newMedias = [
        {
          mediaType: 'image',
          media: {
            media_id: 'new-id',
            url: 'https://example.com/new.jpg'
          }
        }
      ];

      await wrapper.setData({
        private_data: {
          ...wrapper.vm.private_data,
          productMedias: newMedias
        }
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.vm.settings[0].productMedias).toHaveLength(1);
      expect(wrapper.vm.settings[0].productMedias[0].media.media_id).toBe('new-id');
    });
  });
});

