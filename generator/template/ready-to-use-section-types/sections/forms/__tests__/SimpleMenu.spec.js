import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import SimpleMenu from '../SimpleMenu.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {},
    fr: {},
  },
})

describe('SimpleMenu', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(SimpleMenu, {
      global: {
        plugins: [i18n],
        stubs: {
          LazyMediasUploadMedia: { template: '<div></div>' },
          LazyFormLink: { template: '<div></div>' },
          LazySectionsFormsFieldSets: {
            name: 'LazySectionsFormsFieldSets',
            render() {
              const createLocaleObj = () => ({ en: '', fr: '' })
              const object = {
                menuGroupLabel: createLocaleObj(),
                menuContainerClasses: '',
                menu: [
                  {
                    label: createLocaleObj(),
                    link: createLocaleObj(),
                    page: createLocaleObj(),
                    linkTarget: '',
                    menuItemClasses: '',
                    languageMenu: false,
                  },
                ],
                label: createLocaleObj(),
                link: createLocaleObj(),
                page: createLocaleObj(),
                linkTarget: '',
                menuItemClasses: '',
                languageMenu: false,
              }
              return this.$slots.default
                ? this.$slots.default({ object, idx: 0 })
                : null
            },
          },
          LazySectionFormErrors: { template: '<div></div>' },
        },
        mocks: {
          $t: (key) => key,
        },
      },
      propsData: {
        selectedLang: 'en',
        defaultLang: 'en',
        locales: ['en', 'fr'],
      },
    })
  })

  describe('Menu Container Management', () => {
    it('should initialize with default menu container', () => {
      expect(wrapper.vm.settings[0].menus.length).toBe(1)
      expect(wrapper.vm.settings[0].menus[0]).toHaveProperty('menuGroupLabel')
      expect(wrapper.vm.settings[0].menus[0]).toHaveProperty(
        'menuContainerClasses',
      )
      expect(wrapper.vm.settings[0].menus[0]).toHaveProperty('menu')
    })

    it('should add a new menu container', () => {
      const initialLength = wrapper.vm.settings[0].menus.length
      wrapper.vm.addMenuContainer()
      expect(wrapper.vm.settings[0].menus.length).toBe(initialLength + 1)
    })

    it('should add menu container with required fields', () => {
      wrapper.vm.addMenuContainer()
      const newContainer = wrapper.vm.settings[0].menus[1]
      expect(newContainer).toHaveProperty('menuGroupLabel')
      expect(newContainer).toHaveProperty('menuContainerClasses')
      expect(newContainer).toHaveProperty('menu')
      expect(Array.isArray(newContainer.menu)).toBe(true)
    })

    it('should add menu container with localized label', () => {
      wrapper.vm.addMenuContainer()
      expect(wrapper.vm.settings[0].menus[1].menuGroupLabel).toEqual({
        en: '',
        fr: '',
      })
    })

    it('should add menu container with default menu item', () => {
      wrapper.vm.addMenuContainer()
      expect(wrapper.vm.settings[0].menus[1].menu.length).toBe(1)
      expect(wrapper.vm.settings[0].menus[1].menu[0]).toHaveProperty('label')
      expect(wrapper.vm.settings[0].menus[1].menu[0]).toHaveProperty('link')
      expect(wrapper.vm.settings[0].menus[1].menu[0]).toHaveProperty('page')
      expect(wrapper.vm.settings[0].menus[1].menu[0]).toHaveProperty(
        'linkTarget',
      )
      expect(wrapper.vm.settings[0].menus[1].menu[0]).toHaveProperty(
        'menuItemClasses',
      )
      expect(wrapper.vm.settings[0].menus[1].menu[0]).toHaveProperty(
        'languageMenu',
      )
    })

    it('should remove menu container by index', () => {
      wrapper.vm.addMenuContainer()
      wrapper.vm.addMenuContainer()
      const initialLength = wrapper.vm.settings[0].menus.length
      expect(initialLength).toBe(3)

      wrapper.vm.removeMenuContainer(0)
      expect(wrapper.vm.settings[0].menus.length).toBe(initialLength - 1)
    })

    it('should update menu container array', () => {
      const newData = [
        {
          menuGroupLabel: { en: 'Test Menu' },
          menuContainerClasses: 'test-class',
          menu: [],
        },
      ]
      wrapper.vm.updatedMenuContainerArr(newData)
      expect(wrapper.vm.settings[0].menus).toEqual(newData)
    })
  })

  describe('Menu Item Management', () => {
    it('should initialize with default menu item', () => {
      expect(wrapper.vm.settings[0].menus[0].menu.length).toBe(1)
      expect(wrapper.vm.settings[0].menus[0].menu[0]).toHaveProperty('label')
      expect(wrapper.vm.settings[0].menus[0].menu[0]).toHaveProperty('link')
      expect(wrapper.vm.settings[0].menus[0].menu[0]).toHaveProperty('page')
      expect(wrapper.vm.settings[0].menus[0].menu[0]).toHaveProperty(
        'linkTarget',
      )
      expect(wrapper.vm.settings[0].menus[0].menu[0]).toHaveProperty(
        'menuItemClasses',
      )
      expect(wrapper.vm.settings[0].menus[0].menu[0]).toHaveProperty(
        'languageMenu',
      )
    })

    it('should initialize menu item with localized fields', () => {
      const menuItem = wrapper.vm.settings[0].menus[0].menu[0]
      expect(menuItem.label).toEqual({ en: '', fr: '' })
      expect(menuItem.link).toEqual({ en: '', fr: '' })
      expect(menuItem.page).toEqual({ en: '', fr: '' })
    })

    it('should add menu item to a menu container', () => {
      const initialLength = wrapper.vm.settings[0].menus[0].menu.length
      wrapper.vm.addMenuItem(0)
      expect(wrapper.vm.settings[0].menus[0].menu.length).toBe(
        initialLength + 1,
      )
    })

    it('should add menu item with required fields', () => {
      wrapper.vm.addMenuItem(0)
      const newItem = wrapper.vm.settings[0].menus[0].menu[1]
      expect(newItem).toHaveProperty('label')
      expect(newItem).toHaveProperty('link')
      expect(newItem).toHaveProperty('page')
      expect(newItem).toHaveProperty('linkTarget')
      expect(newItem).toHaveProperty('menuItemClasses')
      expect(newItem).toHaveProperty('languageMenu')
    })

    it('should add menu item with localized fields', () => {
      wrapper.vm.addMenuItem(0)
      const newItem = wrapper.vm.settings[0].menus[0].menu[1]
      expect(newItem.label).toEqual({ en: '', fr: '' })
      expect(newItem.link).toEqual({ en: '', fr: '' })
      expect(newItem.page).toEqual({ en: '', fr: '' })
    })

    it('should add menu item to specific menu container', () => {
      wrapper.vm.addMenuContainer()
      wrapper.vm.addMenuItem(0)
      wrapper.vm.addMenuItem(1)
      expect(wrapper.vm.settings[0].menus[0].menu.length).toBe(2)
      expect(wrapper.vm.settings[0].menus[1].menu.length).toBe(2)
    })

    it('should remove menu item from menu container', () => {
      wrapper.vm.addMenuItem(0)
      const initialLength = wrapper.vm.settings[0].menus[0].menu.length
      expect(initialLength).toBe(2)

      wrapper.vm.removeMenuItem(0, 0)
      expect(wrapper.vm.settings[0].menus[0].menu.length).toBe(
        initialLength - 1,
      )
    })

    it('should remove menu item from specific menu container', () => {
      wrapper.vm.addMenuContainer()
      wrapper.vm.addMenuItem(0)
      wrapper.vm.addMenuItem(1)
      wrapper.vm.removeMenuItem(0, 0)
      expect(wrapper.vm.settings[0].menus[0].menu.length).toBe(1)
      expect(wrapper.vm.settings[0].menus[1].menu.length).toBe(2)
    })

    it('should update menu items array for specific container', () => {
      const newData = [
        {
          label: { en: 'Updated Item' },
          link: { en: '/updated' },
          page: {},
          linkTarget: '',
          menuItemClasses: '',
          languageMenu: false,
        },
      ]
      wrapper.vm.updatedArr(newData, 0)
      expect(wrapper.vm.settings[0].menus[0].menu).toEqual(newData)
    })
  })

  describe('Media Management', () => {
    it('should initialize media with empty object', () => {
      expect(wrapper.vm.settings[0].media).toEqual({
        media_id: '',
        url: '',
        seo_tag: '',
      })
    })

    it('should remove media', () => {
      wrapper.vm.settings[0].media = {
        media_id: 'test-id',
        url: 'https://example.com/test.jpg',
        seo_tag: 'test',
      }
      wrapper.vm.removeMedia()
      expect(wrapper.vm.settings[0].media).toEqual({})
    })

    it('should handle selectedMedia prop change', async () => {
      const mediaObject = {
        id: 'new-id',
        files: [
          {
            url: 'https://example.com/new.jpg',
            thumbnail_url: 'https://example.com/new_thumb.jpg',
            filename: 'new.jpg',
          },
        ],
        seo_tag: 'new',
        metadata: '',
      }
      const expectedMedia = {
        media_id: 'new-id',
        url: 'https://example.com/new.jpg',
        thumbnail_url: 'https://example.com/new_thumb.jpg',
        seo_tag: 'new',
        filename: 'new.jpg',
        headers: {},
        metadata: '',
      }
      await wrapper.setProps({ selectedMedia: mediaObject })
      expect(wrapper.vm.settings[0].media).toEqual(expectedMedia)
    })
  })

  describe('Validation', () => {
    it('should pass validation with valid data', () => {
      wrapper.vm.settings[0].menus[0].menu[0].languageMenu = true
      wrapper.vm.settings[0].menus[0].menu[0].label.en = 'Home'
      expect(wrapper.vm.validate()).toBe(true)
    })

    it('should pass validation with link when not language menu', () => {
      wrapper.vm.settings[0].menus[0].menu[0].languageMenu = false
      wrapper.vm.settings[0].menus[0].menu[0].label.en = 'Home'
      wrapper.vm.settings[0].menus[0].menu[0].link.en = 'https://example.com'
      expect(wrapper.vm.validate()).toBe(true)
    })

    it('should pass validation with page when not language menu', () => {
      wrapper.vm.settings[0].menus[0].menu[0].languageMenu = false
      wrapper.vm.settings[0].menus[0].menu[0].label.en = 'Home'
      wrapper.vm.settings[0].menus[0].menu[0].page.en = '/home'
      expect(wrapper.vm.validate()).toBe(true)
    })

    it('should fail validation when first menu item label is missing', () => {
      wrapper.vm.settings[0].menus[0].menu[0].label.en = ''
      wrapper.vm.settings[0].menus[0].menu[0].languageMenu = false
      wrapper.vm.settings[0].menus[0].menu[0].link.en = 'https://example.com'
      expect(wrapper.vm.validate()).toBe(false)
      expect(wrapper.vm.errors.menu[0].label).toBe(true)
    })

    it('should fail validation when first menu item has no link or page', () => {
      wrapper.vm.settings[0].menus[0].menu[0].label.en = 'Home'
      wrapper.vm.settings[0].menus[0].menu[0].languageMenu = false
      wrapper.vm.settings[0].menus[0].menu[0].link.en = ''
      wrapper.vm.settings[0].menus[0].menu[0].page.en = ''
      expect(wrapper.vm.validate()).toBe(false)
      expect(wrapper.vm.errors.menu[0].link).toBe(true)
    })

    it('should pass validation when language menu is enabled without link', () => {
      wrapper.vm.settings[0].menus[0].menu[0].label.en = 'English'
      wrapper.vm.settings[0].menus[0].menu[0].languageMenu = true
      wrapper.vm.settings[0].menus[0].menu[0].link.en = ''
      wrapper.vm.settings[0].menus[0].menu[0].page.en = ''
      expect(wrapper.vm.validate()).toBe(true)
    })

    it('should reset errors on validation', () => {
      wrapper.vm.settings[0].menus[0].menu[0].label.en = ''
      wrapper.vm.validate()
      expect(wrapper.vm.errors.menu[0].label).toBe(true)

      wrapper.vm.settings[0].menus[0].menu[0].label.en = 'Home'
      wrapper.vm.settings[0].menus[0].menu[0].languageMenu = true
      expect(wrapper.vm.validate()).toBe(true)
      expect(wrapper.vm.errors.menu[0].label).toBe(false)
    })
  })

  describe('Settings Initialization', () => {
    it('should initialize with default settings', () => {
      expect(wrapper.vm.settings[0]).toHaveProperty('media')
      expect(wrapper.vm.settings[0]).toHaveProperty('logoLink')
      expect(wrapper.vm.settings[0]).toHaveProperty('logoPage')
      expect(wrapper.vm.settings[0]).toHaveProperty('logoLinkTarget')
      expect(wrapper.vm.settings[0]).toHaveProperty('logoClasses')
      expect(wrapper.vm.settings[0]).toHaveProperty('menuLabel')
      expect(wrapper.vm.settings[0]).toHaveProperty('classes')
      expect(wrapper.vm.settings[0]).toHaveProperty('menus')
    })

    it('should initialize logoLink as object', () => {
      expect(typeof wrapper.vm.settings[0].logoLink).toBe('object')
    })

    it('should initialize logoPage as object', () => {
      expect(typeof wrapper.vm.settings[0].logoPage).toBe('object')
    })

    it('should initialize menuLabel as object', () => {
      expect(typeof wrapper.vm.settings[0].menuLabel).toBe('object')
    })

    it('should initialize errors structure', () => {
      expect(wrapper.vm.errors).toHaveProperty('menu')
      expect(Array.isArray(wrapper.vm.errors.menu)).toBe(true)
      expect(wrapper.vm.errors.menu[0]).toHaveProperty('label')
      expect(wrapper.vm.errors.menu[0]).toHaveProperty('link')
    })

    it('should initialize sectionsStyle', () => {
      expect(wrapper.vm.sectionsStyle).toBeDefined()
    })
  })

  describe('Watchers', () => {
    it('should update siteLang when selectedLang changes', async () => {
      expect(wrapper.vm.siteLang).toBe('en')
      await wrapper.setProps({ selectedLang: 'fr' })
      expect(wrapper.vm.siteLang).toBe('fr')
    })

    it('should initialize missing properties on settings change', async () => {
      const updatedSettings = [...wrapper.vm.settings]
      updatedSettings[0].logoLink = null
      wrapper.vm.settings = updatedSettings
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.settings[0].logoLink).toEqual({ en: '', fr: '' })
    })

    it('should initialize missing menuLabel on settings change', async () => {
      const updatedSettings = [...wrapper.vm.settings]
      updatedSettings[0].menuLabel = null
      wrapper.vm.settings = updatedSettings
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.settings[0].menuLabel).toEqual({ en: '', fr: '' })
    })

    it('should initialize missing menuGroupLabel on settings change', async () => {
      const updatedSettings = [...wrapper.vm.settings]
      updatedSettings[0].menus = [...updatedSettings[0].menus]
      updatedSettings[0].menus[0].menuGroupLabel = null
      wrapper.vm.settings = updatedSettings
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.settings[0].menus[0].menuGroupLabel).toEqual({
        en: '',
        fr: '',
      })
    })

    it('should initialize missing logoPage on settings change', async () => {
      const updatedSettings = [...wrapper.vm.settings]
      updatedSettings[0].logoPage = null
      wrapper.vm.settings = updatedSettings
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.settings[0].logoPage).toEqual({ en: '', fr: '' })
    })
  })

  describe('Media Validation', () => {
    it('should remove media with empty media_id', () => {
      wrapper.vm.settings[0].media = {
        media_id: '',
        url: '',
        seo_tag: '',
      }
      wrapper.vm.validate()
      expect(wrapper.vm.settings[0].media).toBeUndefined()
    })

    it('should keep media with valid media_id', () => {
      const validMedia = {
        media_id: 'valid-id',
        url: 'https://example.com/image.jpg',
        seo_tag: 'test',
      }
      wrapper.vm.settings[0].media = validMedia
      wrapper.vm.validate()
      expect(wrapper.vm.settings[0].media).toEqual(validMedia)
    })

    it('should remove media with empty url', () => {
      wrapper.vm.settings[0].media = {
        media_id: 'test-id',
        url: '',
        seo_tag: 'test',
      }
      wrapper.vm.validate()
      expect(wrapper.vm.settings[0].media).toBeUndefined()
    })
  })

  describe('Settings Properties', () => {
    it('should set logoLink', () => {
      wrapper.vm.settings[0].logoLink = {
        en: 'https://example.com',
        fr: 'https://example.com/fr',
      }
      expect(wrapper.vm.settings[0].logoLink.en).toBe('https://example.com')
    })

    it('should set logoLinkTarget', () => {
      wrapper.vm.settings[0].logoLinkTarget = '_blank'
      expect(wrapper.vm.settings[0].logoLinkTarget).toBe('_blank')
    })

    it('should set logoClasses', () => {
      wrapper.vm.settings[0].logoClasses = 'custom-logo-class'
      expect(wrapper.vm.settings[0].logoClasses).toBe('custom-logo-class')
    })

    it('should set menuLabel', () => {
      wrapper.vm.settings[0].menuLabel = {
        en: 'Main Menu',
        fr: 'Menu Principal',
      }
      expect(wrapper.vm.settings[0].menuLabel.en).toBe('Main Menu')
    })

    it('should set classes', () => {
      wrapper.vm.settings[0].classes = 'custom-menu-class'
      expect(wrapper.vm.settings[0].classes).toBe('custom-menu-class')
    })

    it('should set menuGroupLabel', () => {
      wrapper.vm.settings[0].menus[0].menuGroupLabel = {
        en: 'Navigation',
        fr: 'Navigation',
      }
      expect(wrapper.vm.settings[0].menus[0].menuGroupLabel.en).toBe(
        'Navigation',
      )
    })

    it('should set menuContainerClasses', () => {
      wrapper.vm.settings[0].menus[0].menuContainerClasses = 'container-class'
      expect(wrapper.vm.settings[0].menus[0].menuContainerClasses).toBe(
        'container-class',
      )
    })

    it('should set menuItemClasses', () => {
      wrapper.vm.settings[0].menus[0].menu[0].menuItemClasses = 'item-class'
      expect(wrapper.vm.settings[0].menus[0].menu[0].menuItemClasses).toBe(
        'item-class',
      )
    })

    it('should set linkTarget', () => {
      wrapper.vm.settings[0].menus[0].menu[0].linkTarget = '_self'
      expect(wrapper.vm.settings[0].menus[0].menu[0].linkTarget).toBe('_self')
    })

    it('should toggle languageMenu', () => {
      expect(wrapper.vm.settings[0].menus[0].menu[0].languageMenu).toBe(false)
      wrapper.vm.settings[0].menus[0].menu[0].languageMenu = true
      expect(wrapper.vm.settings[0].menus[0].menu[0].languageMenu).toBe(true)
    })
  })

  describe('Language Support', () => {
    it('should support multiple locales', async () => {
      await wrapper.setProps({ locales: ['en', 'fr', 'de'] })
      expect(wrapper.vm.locales).toEqual(['en', 'fr', 'de'])
    })

    it('should initialize localized fields for all locales', () => {
      wrapper.vm.addMenuContainer()
      const newContainer = wrapper.vm.settings[0].menus[1]
      expect(newContainer.menuGroupLabel).toHaveProperty('en')
      expect(newContainer.menuGroupLabel).toHaveProperty('fr')
      expect(newContainer.menu[0].label).toHaveProperty('en')
      expect(newContainer.menu[0].label).toHaveProperty('fr')
    })
  })
})
