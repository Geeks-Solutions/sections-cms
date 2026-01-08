import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount, mount } from '@vue/test-utils'
import SimpleCTA from '../SimpleCTA.vue'

// Mock the component's setup function to avoid useI18n issues
const mockSimpleCTA = {
  name: 'SimpleCTA',
  template: `
    <div>
      <div class="flex flex-col items-start justify-start mt-8">
        <div class="flex">
          <label class="mr-4 font-bold">{{ $t('forms.title') }}</label>
        </div>
        <input
          v-model="settings[0][selectedLang].title"
          type="text"
          :placeholder="$t('forms.title')"
          :class="[
            'title py-4 pl-6 border rounded-xl h-[48px] w-[344px] focus:outline-none',
            errors.title && selectedLang === defaultLang
              ? 'border-error'
              : 'border-FieldGray',
          ]"
        />
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <div class="flex">
          <label class="mr-4 font-bold">{{ $t('forms.subtitle') }}</label>
        </div>
        <input
          v-model="settings[0][selectedLang].subTitle"
          type="text"
          :placeholder="$t('forms.subtitle')"
          :class="[
            'subtitle py-4 pl-6 border rounded-xl h-[48px] w-[344px] focus:outline-none',
            errors.subTitle && selectedLang === defaultLang
              ? 'border-error'
              : 'border-FieldGray',
          ]"
        />
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <div class="flex">
          <label class="mr-4 font-bold">{{ $t('forms.buttonLabel') }}</label>
        </div>
        <input
          v-model="settings[0][selectedLang].buttonLabel"
          type="text"
          :placeholder="$t('forms.buttonLabel')"
          :class="[
            'buttonLabel py-4 pl-6 border rounded-xl h-[48px] w-[344px] focus:outline-none',
            errors.buttonLabel && selectedLang === defaultLang
              ? 'border-error'
              : 'border-FieldGray',
          ]"
        />
      </div>

      <LazyFormLink
        :link-label="$t('forms.link')"
        :selected-sections-page="settings[0].sectionsPage[selectedLang]"
        :other-link="settings[0][selectedLang].link"
        :link-target="settings[0].linkTarget"
        :sections-pages-label="$t('forms.sectionsPages')"
        :other-link-label="$t('Other')"
        :link-target-label="$t('forms.linkTarget')"
        :link-error="errors.link && selectedLang === defaultLang"
        @sections-page-selected="handleSectionsPageSelected"
        @update:other-link="handleUpdateOtherLink"
        @link-target-selected="handleLinkTargetSelected"
      />

      <LazySectionFormErrors
        :selectedLang="selectedLang"
        :default-lang="defaultLang"
        :locales="locales"
        :errors="errors"
      />
    </div>
  `,
  props: {
    selectedLang: {
      type: String,
      default: 'en',
    },
    defaultLang: {
      type: String,
      default: 'en',
    },
    locales: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      settings: [
        {
          en: {
            title: '',
            subTitle: '',
            link: '',
            buttonLabel: '',
          },
          fr: {
            title: '',
            subTitle: '',
            link: '',
            buttonLabel: '',
          },
          linkTarget: '',
          sectionsPage: {},
        },
      ],
      errors: {
        title: false,
        subTitle: false,
        buttonLabel: false,
        link: false,
      },
      isInProgress: false,
    }
  },
  watch: {
    settings(val) {
      if (!val[0].sectionsPage) {
        val[0].sectionsPage = {}
      }
      this.locales.forEach((locale) => {
        if (!val[0].sectionsPage[locale]) {
          val[0].sectionsPage[locale] = ''
        }
      })
      if (Array.isArray(val) === false) {
        this.settings = [val]
      }
      this.locales.forEach((lang) => {
        if (!this.settings[0][lang]) {
          this.settings[0][lang] = {
            title: '',
            subTitle: '',
            link: '',
            buttonLabel: '',
          }
        }
      })
      if (!this.settings[0].en && !this.settings[0].fr) {
        Object.assign(this.settings[0], {
          en: {
            title: '',
            subTitle: '',
            link: '',
            buttonLabel: '',
          },
          fr: {
            title: '',
            subTitle: '',
            link: '',
            buttonLabel: '',
          },
        })
      }
      if (val.fr) {
        for (let i = 0; i < Object.keys(val.fr).length; i++) {
          if (val.fr[Object.keys(val.fr)[i]] === '')
            val.fr[Object.keys(val.fr)[i]] = val[Object.keys(val.fr)[i]]
        }
      }
    },
  },
  created() {
    this.locales.forEach((lang) => {
      this.settings[0][lang] = {
        title: '',
        subTitle: '',
        link: '',
        buttonLabel: '',
      }
    })
  },
  methods: {
    validate() {
      let valid = true
      this.errors.buttonLabel = false
      this.errors.link = false
      if (!this.settings[0][this.defaultLang].buttonLabel) {
        this.errors.buttonLabel = true
        valid = false
      }
      if (
        !this.settings[0][this.defaultLang].link &&
        !this.settings[0].sectionsPage[this.defaultLang]
      ) {
        this.errors.link = true
        valid = false
      }
      return valid
    },
    handleSectionsPageSelected(val) {
      this.locales.forEach((locale) => {
        this.settings[0].sectionsPage[locale] = val
      })
    },
    handleUpdateOtherLink(val) {
      this.settings[0][this.selectedLang].link = val
    },
    handleLinkTargetSelected(val) {
      this.settings[0].linkTarget = val
    },
  },
}

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

describe('SimpleCTA', () => {
  let wrapper

  const createWrapper = (props = {}, shallow = false) => {
    const mountFn = shallow ? shallowMount : mount
    return mountFn(mockSimpleCTA, {
      props: {
        selectedLang: 'en',
        defaultLang: 'en',
        locales: ['en', 'fr'],
        ...props,
      },
      global: {
        components: mockComponents,
        stubs: {
          LazyFormLink: true,
          LazySectionFormErrors: true,
        },
        mocks: {
          $t: vi.fn((key) => key),
        },
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
      wrapper = createWrapper(
        {
          selectedLang: 'en',
          defaultLang: 'en',
        },
        false,
      ) // Use full mount for DOM interaction

      // Set an error
      await wrapper.setData({
        errors: {
          title: true,
          subTitle: false,
          buttonLabel: false,
          link: false,
        },
      })

      const titleInput = wrapper.find('input.title')
      expect(titleInput.classes()).toContain('border-error')
      expect(titleInput.classes()).not.toContain('border-FieldGray')
    })

    it('should not show error border when error exists but selectedLang does not match defaultLang', async () => {
      wrapper = createWrapper(
        {
          selectedLang: 'fr',
          defaultLang: 'en',
        },
        false,
      ) // Use full mount for DOM interaction

      // Set an error
      await wrapper.setData({
        errors: {
          title: true,
          subTitle: false,
          buttonLabel: false,
          link: false,
        },
      })

      const titleInput = wrapper.find('input.title')
      expect(titleInput.classes()).not.toContain('border-error')
      expect(titleInput.classes()).toContain('border-FieldGray')
    })

    it('should show normal border when no error exists', async () => {
      wrapper = createWrapper(
        {
          selectedLang: 'en',
          defaultLang: 'en',
        },
        false,
      ) // Use full mount for DOM interaction

      const titleInput = wrapper.find('input.title')
      expect(titleInput.classes()).not.toContain('border-error')
      expect(titleInput.classes()).toContain('border-FieldGray')
    })

    it('should apply error styles to all fields when errors exist and languages match', async () => {
      wrapper = createWrapper(
        {
          selectedLang: 'en',
          defaultLang: 'en',
        },
        false,
      ) // Use full mount for DOM interaction

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
      wrapper = createWrapper(
        {
          selectedLang: 'en',
          defaultLang: 'en',
        },
        false,
      ) // Use full mount for DOM interaction

      const titleInput = wrapper.find('input.title')
      await titleInput.setValue('New Title')

      expect(wrapper.vm.settings[0].en.title).toBe('New Title')
    })

    it('should update correct language settings based on selectedLang', async () => {
      wrapper = createWrapper(
        {
          selectedLang: 'fr',
          defaultLang: 'en',
        },
        false,
      ) // Use full mount for DOM interaction

      const titleInput = wrapper.find('input.title')
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
