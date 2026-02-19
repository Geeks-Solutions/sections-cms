import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SimpleMenuStatic from '../SimpleMenu_static.vue'

const mockGlobalLink = {
  template: '<a><slot></slot></a>',
  props: ['link', 'lang', 'defaultLang', 'formLinkTarget'],
}

const mockGlobalLangSwitcher = {
  template: '<div><slot></slot></div>',
  props: ['label', 'lang', 'defaultLang'],
  emits: ['langSwitched'],
}

describe('SimpleMenuStatic', () => {
  let wrapper

  const createWrapper = (props = {}) => {
    const baseSettings = {
      classes: 'custom-menu-class',
      media: {
        url: 'logo.jpg',
        seo_tag: 'Website Logo',
        metadata: { type: 'image' },
      },
      logoPage: {
        en: 'home',
        fr: 'accueil',
      },
      logoLink: {
        en: 'https://example.com',
        fr: 'https://example.fr',
      },
      logoLinkTarget: '_self',
      menuLabel: {
        en: 'Main Menu',
        fr: 'Menu Principal',
      },
      menus: [
        {
          menuGroupLabel: {
            en: 'Navigation',
            fr: 'Navigation',
          },
          menuContainerClasses: 'nav-links',
          menu: [
            {
              label: {
                en: 'Home',
                fr: 'Accueil',
              },
              link: {
                en: 'https://example.com',
                fr: 'https://example.fr',
              },
              page: {
                en: 'home',
                fr: 'accueil',
              },
              linkTarget: '_self',
              menuItemClasses: 'nav-item',
              languageMenu: false,
            },
            {
              label: {
                en: 'About',
                fr: 'À propos',
              },
              link: {
                en: 'https://example.com/about',
                fr: 'https://example.fr/a-propos',
              },
              page: {
                en: 'about',
                fr: 'a-propos',
              },
              linkTarget: '_blank',
              menuItemClasses: 'nav-item',
              languageMenu: false,
            },
            {
              label: {
                en: 'English',
                fr: 'Français',
              },
              link: '',
              page: {
                en: '',
                fr: '',
              },
              linkTarget: '_self',
              menuItemClasses: 'lang-item',
              languageMenu: true,
            },
          ],
        },
        {
          menuGroupLabel: {
            en: 'Services',
            fr: 'Services',
          },
          menuContainerClasses: 'service-links',
          menu: [
            {
              label: {
                en: 'Products',
                fr: 'Produits',
              },
              link: {
                en: 'https://example.com/products',
                fr: 'https://example.fr/produits',
              },
              page: {
                en: 'products',
                fr: 'produits',
              },
              linkTarget: '_self',
              menuItemClasses: 'service-item',
              languageMenu: false,
            },
          ],
        },
      ],
    }

    const settings = props.section ? [baseSettings] : [baseSettings]

    const finalProps = {
      lang: props.lang || 'en',
      defaultLang: props.defaultLang || 'en',
      section: { settings: settings },
      locales: props.locales || ['en', 'fr'],
    }

    return mount(SimpleMenuStatic, {
      props: finalProps,
      global: {
        components: {
          'global-link': mockGlobalLink,
          'global-lang-switcher': mockGlobalLangSwitcher,
        },
        stubs: {
          'g-universal-viewer': true,
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

    it('should initialize mobileMenu as false', () => {
      wrapper = createWrapper()
      expect(wrapper.vm.mobileMenu).toBe(false)
    })
  })

  describe('Computed Properties - Settings', () => {
    it('should compute settings correctly from section.settings[0]', () => {
      wrapper = createWrapper()
      const settings = wrapper.vm.settings

      expect(settings).toHaveProperty('classes', 'custom-menu-class')
      expect(settings).toHaveProperty('menus')
      expect(settings.menus).toHaveLength(2)
    })

    it('should handle array settings correctly', () => {
      wrapper = createWrapper()
      const settings = wrapper.vm.settings

      expect(settings.menus).toBeInstanceOf(Array)
      expect(settings.menus[0]).toHaveProperty('menu')
      expect(settings.menus[0].menu).toBeInstanceOf(Array)
    })
  })

  describe('Logo Rendering', () => {
    it('should render logo when media exists', () => {
      wrapper = createWrapper()

      expect(wrapper.find('.logo-wrapper').exists()).toBe(true)
    })
  })

  describe('Menu Label', () => {
    it('should render menu label when it exists', () => {
      wrapper = createWrapper()

      expect(wrapper.find('h3').text()).toBe('Main Menu')
    })

    it('should render menu label in correct language', () => {
      wrapper = createWrapper({ lang: 'fr' })

      expect(wrapper.find('h3').text()).toBe('Menu Principal')
    })
  })

  describe('Menu Items', () => {
    it('should render menu items', () => {
      wrapper = createWrapper()
      const menuItems = wrapper.findAll('.ul-container-0 li')

      expect(menuItems.length).toBeGreaterThanOrEqual(3)
    })

    it('should render menu item labels', () => {
      wrapper = createWrapper()
      const firstItem = wrapper.find('.ul-container-0 li:first-child p')

      expect(firstItem.text()).toBe('Home')
    })

    it('should render menu item labels in correct language', () => {
      wrapper = createWrapper({ lang: 'fr' })
      const firstItem = wrapper.find('.ul-container-0 li:first-child p')

      expect(firstItem.text()).toBe('Accueil')
    })

    it('should apply menu item classes', () => {
      wrapper = createWrapper()
      const firstItem = wrapper.find('.ul-container-0 li:first-child')

      expect(firstItem.classes()).toContain('nav-item')
    })

    it('should apply lang class for language menu items', () => {
      wrapper = createWrapper()
      const langItem = wrapper.findAll('.ul-container-0 li')[2]

      expect(langItem.classes()).toContain('lang')
    })
  })

  describe('Language Menu Switcher', () => {
    it('should render global-lang-switcher for language menu items', () => {
      wrapper = createWrapper()
      const langSwitchers = wrapper.findAllComponents({
        name: 'GlobalLangSwitcher',
      })

      expect(langSwitchers.length).toBeGreaterThanOrEqual(1)
    })

    it('should pass correct label to lang switcher', () => {
      wrapper = createWrapper()
      const langSwitcher = wrapper.findAllComponents({
        name: 'GlobalLangSwitcher',
      })[0]

      expect(langSwitcher.props('label')).toBe('English')
    })

    it('should pass correct lang to lang switcher', () => {
      wrapper = createWrapper()
      const langSwitcher = wrapper.findAllComponents({
        name: 'GlobalLangSwitcher',
      })[0]

      expect(langSwitcher.props('lang')).toBe('en')
    })

    it('should emit lang-switched event', async () => {
      wrapper = createWrapper()
      const langSwitcher = wrapper.findAllComponents({
        name: 'GlobalLangSwitcher',
      })[0]

      langSwitcher.vm.$emit('lang-switched', 'fr')

      expect(wrapper.emitted('refresh-section')).toBeTruthy()
      expect(wrapper.emitted('refresh-section')[0]).toEqual([
        { qs: { language: 'fr' } },
      ])
    })
  })

  describe('Mobile Menu', () => {
    it('should render mobile menu icon wrapper', () => {
      wrapper = createWrapper()

      expect(wrapper.find('.icon-wrapper').exists()).toBe(true)
    })

    it('should toggle mobile menu when icon is clicked', async () => {
      wrapper = createWrapper()
      expect(wrapper.vm.mobileMenu).toBe(false)

      await wrapper.find('.icon-wrapper').trigger('click')
      expect(wrapper.vm.mobileMenu).toBe(true)

      await wrapper.find('.icon-wrapper').trigger('click')
      expect(wrapper.vm.mobileMenu).toBe(false)
    })

    it('should render mobile menu wrapper', async () => {
      wrapper = createWrapper()
      await wrapper.setData({ mobileMenu: true })

      expect(wrapper.find('.mobile-menu-main-wrapper').exists()).toBe(true)
    })

    it('should add visibleMenu class when mobile menu is open', async () => {
      wrapper = createWrapper()
      await wrapper.setData({ mobileMenu: true })

      const iconWrapper = wrapper.find('.icon-wrapper')
      expect(iconWrapper.classes()).toContain('visibleMenu')
    })

    it('should close mobile menu when close button is clicked', async () => {
      wrapper = createWrapper()
      await wrapper.setData({ mobileMenu: true })
      expect(wrapper.vm.mobileMenu).toBe(true)

      await wrapper.find('.mobile-menu-close-wrapper').trigger('click')
      expect(wrapper.vm.mobileMenu).toBe(false)
    })

    it('should close mobile menu when menu item is clicked', async () => {
      wrapper = createWrapper()
      await wrapper.setData({ mobileMenu: true })

      await wrapper
        .find('.mobile-menu-wrapper .ul-container-0 li')
        .trigger('click')
      expect(wrapper.vm.mobileMenu).toBe(false)
    })

    it('should render mobile menu group labels', async () => {
      wrapper = createWrapper()
      await wrapper.setData({ mobileMenu: true })
      const mobileLabels = wrapper.findAll('.menu-group-label.mobile')

      expect(mobileLabels).toHaveLength(2)
    })
  })

  describe('Global Links', () => {
    it('should use page link when page is not "other"', () => {
      wrapper = createWrapper()
      const links = wrapper.findAllComponents({ name: 'GlobalLink' })

      expect(links.length).toBeGreaterThan(0)
      const firstLink = links[0]
      expect(firstLink.props('link')).toHaveProperty('en', '/home')
    })

    it('should pass lang prop to global links', () => {
      wrapper = createWrapper({ lang: 'fr' })
      const links = wrapper.findAllComponents({ name: 'GlobalLink' })

      links.forEach((link) => {
        expect(link.props('lang')).toBe('fr')
      })
    })

    it('should pass defaultLang prop to global links', () => {
      wrapper = createWrapper({ defaultLang: 'en' })
      const links = wrapper.findAllComponents({ name: 'GlobalLink' })

      links.forEach((link) => {
        expect(link.props('defaultLang')).toBe('en')
      })
    })

    it('should pass linkTarget to global links', () => {
      wrapper = createWrapper()
      const links = wrapper.findAllComponents({ name: 'GlobalLink' })

      const secondLink = links[2]
      expect(secondLink.props('formLinkTarget')).toBe('_blank')
    })
  })

  describe('Methods', () => {
    it('should have langSwitched method', () => {
      wrapper = createWrapper()

      expect(typeof wrapper.vm.langSwitched).toBe('function')
    })

    it('should emit refresh-section event with correct payload when lang is switched', () => {
      wrapper = createWrapper()

      wrapper.vm.langSwitched('de')

      expect(wrapper.emitted('refresh-section')).toBeTruthy()
      expect(wrapper.emitted('refresh-section')[0]).toEqual([
        { qs: { language: 'de' } },
      ])
    })
  })

  describe('Component Structure', () => {
    it('should have simple-menu class', () => {
      wrapper = createWrapper()

      expect(wrapper.find('.simple-menu').exists()).toBe(true)
    })

    it('should have custom classes from settings', () => {
      wrapper = createWrapper()

      expect(wrapper.find('.simple-menu').classes()).toContain(
        'custom-menu-class',
      )
    })

    it('should render ul elements with correct classes', () => {
      wrapper = createWrapper()
      const uls = wrapper.findAll('ul')

      expect(uls.length).toBeGreaterThanOrEqual(2)
      expect(uls[0].classes()).toContain('nav-links')
      expect(uls[1].classes()).toContain('service-links')
    })
  })

  describe('Responsive Behavior', () => {
    it('should hide mobile menu on desktop', () => {
      wrapper = createWrapper()

      expect(wrapper.find('.icon-wrapper').classes()).not.toContain(
        'visibleMenu',
      )
    })

    it('should show mobile menu wrapper when mobileMenu is true', async () => {
      wrapper = createWrapper()
      await wrapper.setData({ mobileMenu: true })

      expect(wrapper.find('.mobile-menu-main-wrapper').exists()).toBe(true)
      expect(wrapper.find('.mobile-menu-main-wrapper').classes()).toContain(
        'visibleMenu',
      )
    })
  })
})
