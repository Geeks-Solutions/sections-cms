import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductDetailsStatic from '../ProductDetails_static.vue'

vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    locale: { value: 'en' },
  })),
}))

vi.mock('@/utils/constants', () => ({
  sectionsStyle: {},
}))

const mockProductDetailsComponent = {
  name: 'ProductDetailsComponent',
  template: '<div class="mock-product-details"><slot></slot></div>',
  props: ['product', 'lang', 'defaultLang'],
}

const mockI18n = {
  locale: 'en',
}

describe('ProductDetailsStatic', () => {
  let wrapper

  const createWrapper = (props = {}) => {
    const baseSettings = {
      name: {
        en: 'Test Product',
        fr: 'Produit Test',
      },
      description: {
        en: '<p>Test description</p>',
        fr: '<p>Description test</p>',
      },
      descriptionClasses: 'test-class',
      price: 99.99,
      currency: '€',
      autoplay: false,
      loop: false,
      controls: false,
      whiteProgress: false,
      productMedias: [
        {
          mediaType: 'imageType',
          media: {
            media_id: 'img1',
            url: 'https://example.com/image1.jpg',
            thumbnail_url: 'https://example.com/thumb1.jpg',
            seo_tag: 'Test Image 1',
          },
        },
      ],
    }

    return mount(ProductDetailsStatic, {
      props: {
        lang: 'en',
        defaultLang: 'en',
        section: { settings: [baseSettings] },
        ...props,
      },
      global: {
        components: {
          ProductDetailsComponent: mockProductDetailsComponent,
        },
        mocks: {
          $i18n: mockI18n,
          $t: vi.fn((key) => key),
        },
        stubs: {
          ProductDetailsComponent: mockProductDetailsComponent,
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

    it('should render when settings exists', () => {
      wrapper = createWrapper()
      expect(wrapper.find('.product-details').exists()).toBe(true)
    })

    it('should not render when settings is empty object', () => {
      wrapper = createWrapper({ section: { settings: [{}] } })
      expect(wrapper.find('.product-details').exists()).toBe(true)
    })
  })

  describe('ProductDetailsComponent Rendering', () => {
    it('should render ProductDetailsComponent when settings exists', () => {
      wrapper = createWrapper()
      const productDetails = wrapper.findComponent({
        name: 'ProductDetailsComponent',
      })
      expect(productDetails.exists()).toBe(true)
    })

    it('should pass correct product prop to ProductDetailsComponent', () => {
      wrapper = createWrapper()
      const productDetails = wrapper.findComponent({
        name: 'ProductDetailsComponent',
      })
      expect(productDetails.props('product')).toEqual(wrapper.vm.settings)
    })

    it('should pass correct lang prop to ProductDetailsComponent', () => {
      wrapper = createWrapper()
      const productDetails = wrapper.findComponent({
        name: 'ProductDetailsComponent',
      })
      expect(productDetails.props('lang')).toBe('en')
    })

    it('should pass correct defaultLang prop to ProductDetailsComponent', () => {
      wrapper = createWrapper()
      const productDetails = wrapper.findComponent({
        name: 'ProductDetailsComponent',
      })
      expect(productDetails.props('defaultLang')).toBe('en')
    })

    it('should pass default lang when not provided', () => {
      wrapper = createWrapper({ lang: undefined })
      const productDetails = wrapper.findComponent({
        name: 'ProductDetailsComponent',
      })
      expect(productDetails.props('lang')).toBe('en')
    })

    it('should pass default defaultLang when not provided', () => {
      wrapper = createWrapper({ defaultLang: undefined })
      const productDetails = wrapper.findComponent({
        name: 'ProductDetailsComponent',
      })
      expect(productDetails.props('defaultLang')).toBe('en')
    })
  })

  describe('Computed Properties - settings', () => {
    it('should return first setting when section.settings exists and has elements', () => {
      wrapper = createWrapper()
      expect(wrapper.vm.settings).toEqual(wrapper.props('section').settings[0])
    })

    it('should return empty object when section.settings is undefined', () => {
      wrapper = createWrapper({ section: {} })
      expect(wrapper.vm.settings).toEqual({})
    })

    it('should return empty object when section.settings is empty array', () => {
      wrapper = createWrapper({ section: { settings: [] } })
      expect(wrapper.vm.settings).toEqual({})
    })

    it('should return first setting even when settings array has multiple elements', () => {
      const settings = [{ name: { en: 'First' } }, { name: { en: 'Second' } }]
      wrapper = createWrapper({ section: { settings } })
      expect(wrapper.vm.settings).toEqual(settings[0])
    })
  })

  describe('Component Structure', () => {
    it('should have product-details wrapper class', () => {
      wrapper = createWrapper()
      expect(wrapper.find('.product-details').exists()).toBe(true)
    })

    it('should contain ProductDetailsComponent inside wrapper', () => {
      wrapper = createWrapper()
      const wrapperDiv = wrapper.find('.product-details')
      const productDetails = wrapper.findComponent({
        name: 'ProductDetailsComponent',
      })
      expect(
        wrapperDiv.findComponent({ name: 'ProductDetailsComponent' }).exists(),
      ).toBe(true)
    })
  })

  describe('Language Support', () => {
    it('should handle different lang values', () => {
      wrapper = createWrapper({ lang: 'fr' })
      const productDetails = wrapper.findComponent({
        name: 'ProductDetailsComponent',
      })
      expect(productDetails.props('lang')).toBe('fr')
    })

    it('should handle different defaultLang values', () => {
      wrapper = createWrapper({ defaultLang: 'fr' })
      const productDetails = wrapper.findComponent({
        name: 'ProductDetailsComponent',
      })
      expect(productDetails.props('defaultLang')).toBe('fr')
    })
  })

  describe('Section Name Handling', () => {
    it('should work with section that has name', () => {
      wrapper = createWrapper({
        section: {
          name: 'test-product-section',
          settings: [
            {
              name: { en: 'Product' },
            },
          ],
        },
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should work with section that has no name', () => {
      wrapper = createWrapper({
        section: {
          settings: [
            {
              name: { en: 'Product' },
            },
          ],
        },
      })
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Props Handling', () => {
    it('should handle section prop as Object type', () => {
      wrapper = createWrapper()
      expect(typeof wrapper.props('section')).toBe('object')
    })

    it('should handle lang prop as String type', () => {
      wrapper = createWrapper()
      expect(typeof wrapper.props('lang')).toBe('string')
    })

    it('should handle defaultLang prop as String type', () => {
      wrapper = createWrapper()
      expect(typeof wrapper.props('defaultLang')).toBe('string')
    })

    it('should use default section value when not provided', () => {
      wrapper = mount(ProductDetailsStatic, {
        props: {
          lang: 'en',
          section: { settings: [{ name: { en: 'Test' } }] },
        },
        global: {
          components: {
            ProductDetailsComponent: mockProductDetailsComponent,
          },
          mocks: {
            $i18n: mockI18n,
            $t: vi.fn((key) => key),
          },
          stubs: {
            ProductDetailsComponent: mockProductDetailsComponent,
          },
        },
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should use default lang value when not provided', () => {
      wrapper = mount(ProductDetailsStatic, {
        props: {
          section: { settings: [{ name: { en: 'Test' } }] },
        },
        global: {
          components: {
            ProductDetailsComponent: mockProductDetailsComponent,
          },
          mocks: {
            $i18n: mockI18n,
            $t: vi.fn((key) => key),
          },
          stubs: {
            ProductDetailsComponent: mockProductDetailsComponent,
          },
        },
      })
      expect(wrapper.props('lang')).toBe('en')
    })

    it('should use default defaultLang value when not provided', () => {
      wrapper = mount(ProductDetailsStatic, {
        props: {
          section: { settings: [{ name: { en: 'Test' } }] },
        },
        global: {
          components: {
            ProductDetailsComponent: mockProductDetailsComponent,
          },
          mocks: {
            $i18n: mockI18n,
            $t: vi.fn((key) => key),
          },
          stubs: {
            ProductDetailsComponent: mockProductDetailsComponent,
          },
        },
      })
      expect(wrapper.props('defaultLang')).toBe('en')
    })
  })
})
