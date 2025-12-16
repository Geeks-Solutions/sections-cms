import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SimpleCTA from '../SimpleCTA.vue'
import { createI18n } from 'vue-i18n'

// Mock the components that are not defined in the test environment
const mockComponents = {
  'link-description': {
    template: '<div>Link Description</div>',
  },
  gAutoComplete: {
    template: '<div>AutoComplete</div>',
    props: [
      'mainFilter',
      'placeholder',
      'filterLabelProp',
      'reduce',
      'filterOptions',
      'filterSearchable',
      'closeOnSelect',
      'filterClearable',
      'trackBy',
    ],
    emits: ['itemSelected'],
  },
  LazySectionFormErrors: {
    template: '<div>Form Errors</div>',
    props: ['selectedLang', 'defaultLang', 'locales', 'errors'],
  },
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {},
    fr: {},
  },
})

describe('SimpleCTA', () => {
  let wrapper

  const createWrapper = (props = {}) => {
    return mount(SimpleCTA, {
      props: {
        selectedLang: 'en',
        defaultLang: 'en',
        locales: ['en', 'fr'],
        ...props,
      },
      global: {
        components: mockComponents,
        config: {
          globalProperties: {
            $t: vi.fn((key) => key),
          },
        },
        plugins: [i18n],
      },
    })
  }

  describe('Component Initialization', () => {
    it('should render with default props', () => {
      wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should initialize with empty settings for all locales', () => {
      wrapper = createWrapper({ locales: ['en', 'fr', 'es'] })

      expect(wrapper.vm.settings[0].en).toEqual({
        title: '',
        subTitle: '',
        link: '',
        buttonLabel: '',
      })
      expect(wrapper.vm.settings[0].fr).toEqual({
        title: '',
        subTitle: '',
        link: '',
        buttonLabel: '',
      })
      expect(wrapper.vm.settings[0].es).toEqual({
        title: '',
        subTitle: '',
        link: '',
        buttonLabel: '',
      })
    })

    it('should initialize errors as false', () => {
      wrapper = createWrapper()

      expect(wrapper.vm.errors).toEqual({
        title: false,
        subTitle: false,
        buttonLabel: false,
        link: false,
      })
    })
  })

  describe('Error Display Logic', () => {
    it('should show error border when error exists and selectedLang matches defaultLang', async () => {
      wrapper = createWrapper({
        selectedLang: 'en',
        defaultLang: 'en',
      })

      // Set an error
      await wrapper.setData({
        errors: {
          title: true,
          subTitle: false,
          buttonLabel: false,
          link: false,
        },
      })

      const titleInput = wrapper.find('input[placeholder="Title"]')
      expect(titleInput.classes()).toContain('border-error')
      expect(titleInput.classes()).not.toContain('border-FieldGray')
    })

    it('should not show error border when error exists but selectedLang does not match defaultLang', async () => {
      wrapper = createWrapper({
        selectedLang: 'fr',
        defaultLang: 'en',
      })

      // Set an error
      await wrapper.setData({
        errors: {
          title: true,
          subTitle: false,
          buttonLabel: false,
          link: false,
        },
      })

      const titleInput = wrapper.find('input[placeholder="Title"]')
      expect(titleInput.classes()).not.toContain('border-error')
      expect(titleInput.classes()).toContain('border-FieldGray')
    })

    it('should show normal border when no error exists', async () => {
      wrapper = createWrapper({
        selectedLang: 'en',
        defaultLang: 'en',
      })

      const titleInput = wrapper.find('input[placeholder="Title"]')
      expect(titleInput.classes()).not.toContain('border-error')
      expect(titleInput.classes()).toContain('border-FieldGray')
    })

    it('should apply error styles to all fields when errors exist and languages match', async () => {
      wrapper = createWrapper({
        selectedLang: 'en',
        defaultLang: 'en',
      })

      // Set errors for all fields
      await wrapper.setData({
        errors: { title: true, subTitle: true, buttonLabel: true, link: true },
      })

      const titleInput = wrapper.find('input.title')
      const subtitleInput = wrapper.find('input.subtitle')
      const buttonLabelInput = wrapper.find('input.buttonLabel')

      expect(titleInput.classes()).toContain('border-error')
      expect(subtitleInput.classes()).toContain('border-error')
      expect(buttonLabelInput.classes()).toContain('border-error')
    })
  })

  describe('Validation Logic', () => {
    it('should validate successfully when required fields are filled', async () => {
      wrapper = createWrapper({
        selectedLang: 'en',
        defaultLang: 'en',
      })

      // Set required fields
      await wrapper.setData({
        settings: [
          {
            en: {
              title: 'Test Title',
              subTitle: 'Test Subtitle',
              link: 'https://example.com',
              buttonLabel: 'Click Me',
            },
            fr: {
              title: '',
              subTitle: '',
              link: '',
              buttonLabel: '',
            },
            linkTarget: '_self',
          },
        ],
      })

      const isValid = wrapper.vm.validate()
      expect(isValid).toBe(true)
      expect(wrapper.vm.errors.buttonLabel).toBe(false)
      expect(wrapper.vm.errors.link).toBe(false)
    })

    it('should fail validation when buttonLabel is missing in defaultLang', async () => {
      wrapper = createWrapper({
        selectedLang: 'en',
        defaultLang: 'en',
      })

      // Set only link, missing buttonLabel
      await wrapper.setData({
        settings: [
          {
            en: {
              title: 'Test Title',
              subTitle: 'Test Subtitle',
              link: 'https://example.com',
              buttonLabel: '',
            },
            fr: {
              title: '',
              subTitle: '',
              link: '',
              buttonLabel: '',
            },
            linkTarget: '_self',
          },
        ],
      })

      const isValid = wrapper.vm.validate()
      expect(isValid).toBe(false)
      expect(wrapper.vm.errors.buttonLabel).toBe(true)
      expect(wrapper.vm.errors.link).toBe(false)
    })

    it('should fail validation when link is missing in defaultLang', async () => {
      wrapper = createWrapper({
        selectedLang: 'en',
        defaultLang: 'en',
      })

      // Set only buttonLabel, missing link
      await wrapper.setData({
        settings: [
          {
            en: {
              title: 'Test Title',
              subTitle: 'Test Subtitle',
              link: '',
              buttonLabel: 'Click Me',
            },
            fr: {
              title: '',
              subTitle: '',
              link: '',
              buttonLabel: '',
            },
            linkTarget: '_self',
          },
        ],
      })

      const isValid = wrapper.vm.validate()
      expect(isValid).toBe(false)
      expect(wrapper.vm.errors.buttonLabel).toBe(false)
      expect(wrapper.vm.errors.link).toBe(true)
    })

    it('should fail validation when both required fields are missing', async () => {
      wrapper = createWrapper({
        selectedLang: 'en',
        defaultLang: 'en',
      })

      // Both required fields are empty
      await wrapper.setData({
        settings: [
          {
            en: {
              title: 'Test Title',
              subTitle: 'Test Subtitle',
              link: '',
              buttonLabel: '',
            },
            fr: {
              title: '',
              subTitle: '',
              link: '',
              buttonLabel: '',
            },
            linkTarget: '_self',
          },
        ],
      })

      const isValid = wrapper.vm.validate()
      expect(isValid).toBe(false)
      expect(wrapper.vm.errors.buttonLabel).toBe(true)
      expect(wrapper.vm.errors.link).toBe(true)
    })

    it('should validate based on defaultLang regardless of selectedLang', async () => {
      wrapper = createWrapper({
        selectedLang: 'fr',
        defaultLang: 'en',
      })

      // Fill French fields but leave English (default) fields empty
      await wrapper.setData({
        settings: [
          {
            en: {
              title: '',
              subTitle: '',
              link: '',
              buttonLabel: '',
            },
            fr: {
              title: 'Titre français',
              subTitle: 'Sous-titre français',
              link: 'https://example.fr',
              buttonLabel: 'Cliquez ici',
            },
            linkTarget: '_self',
          },
        ],
      })

      const isValid = wrapper.vm.validate()
      expect(isValid).toBe(false)
      expect(wrapper.vm.errors.buttonLabel).toBe(true)
      expect(wrapper.vm.errors.link).toBe(true)
    })

    it('should validate successfully when defaultLang is not English', async () => {
      wrapper = createWrapper({
        selectedLang: 'fr',
        defaultLang: 'fr',
      })

      // Fill French fields (which is now the default language)
      await wrapper.setData({
        settings: [
          {
            en: {
              title: '',
              subTitle: '',
              link: '',
              buttonLabel: '',
            },
            fr: {
              title: 'Titre français',
              subTitle: 'Sous-titre français',
              link: 'https://example.fr',
              buttonLabel: 'Cliquez ici',
            },
            linkTarget: '_self',
          },
        ],
      })

      const isValid = wrapper.vm.validate()
      expect(isValid).toBe(true)
      expect(wrapper.vm.errors.buttonLabel).toBe(false)
      expect(wrapper.vm.errors.link).toBe(false)
    })
  })

  describe('Input Binding', () => {
    it('should update settings when input values change', async () => {
      wrapper = createWrapper({
        selectedLang: 'en',
        defaultLang: 'en',
      })

      const titleInput = wrapper.find('input[placeholder="Title"]')
      await titleInput.setValue('New Title')

      expect(wrapper.vm.settings[0].en.title).toBe('New Title')
    })

    it('should update correct language settings based on selectedLang', async () => {
      wrapper = createWrapper({
        selectedLang: 'fr',
        defaultLang: 'en',
      })

      const titleInput = wrapper.find('input[placeholder="Title"]')
      await titleInput.setValue('Nouveau Titre')

      expect(wrapper.vm.settings[0].fr.title).toBe('Nouveau Titre')
      expect(wrapper.vm.settings[0].en.title).toBe('')
    })
  })

  describe('Error Reset', () => {
    it('should reset errors before validation', async () => {
      wrapper = createWrapper()

      // Set some errors manually
      await wrapper.setData({
        errors: { title: true, subTitle: true, buttonLabel: true, link: true },
      })

      // Fill required fields
      await wrapper.setData({
        settings: [
          {
            en: {
              title: 'Test',
              subTitle: 'Test',
              link: 'https://example.com',
              buttonLabel: 'Click',
            },
            fr: {
              title: '',
              subTitle: '',
              link: '',
              buttonLabel: '',
            },
            linkTarget: '_self',
          },
        ],
      })

      // Validation should reset errors for successful validation
      const isValid = wrapper.vm.validate()
      expect(isValid).toBe(true)

      // Errors should be reset/cleared for valid fields
      expect(wrapper.vm.errors.buttonLabel).toBe(false)
      expect(wrapper.vm.errors.link).toBe(false)
    })
  })
})
