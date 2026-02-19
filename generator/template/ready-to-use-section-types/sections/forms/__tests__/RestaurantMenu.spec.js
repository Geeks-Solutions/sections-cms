import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import RestaurantMenu from '../RestaurantMenu.vue'

// Setup dynamic UUID mock for each test
const mockUuid = vi.mocked('uuid')?.v4 || vi.fn()
let uuidCounter = 0

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {},
    fr: {},
  },
})

const AutoCompleteStub = {
  name: 'gAutoComplete',
  template: '<div></div>',
}

describe('RestaurantMenu', () => {
  let wrapper

  beforeEach(() => {
    mockUuid.mockImplementation(() => `mock-uuid-${uuidCounter++}`)
    wrapper = shallowMount(RestaurantMenu, {
      global: {
        plugins: [i18n],
        stubs: {
          LazyMediasUploadMedia: true,
          LazySectionsFormsFieldSets: true,
          LazySectionFormErrors: true,
          gAutoComplete: AutoCompleteStub,
        },
        mocks: {
          $t: (key) => key,
        },
      },
      props: {
        selectedLang: 'en',
        defaultLang: 'en',
        locales: ['en', 'fr'],
      },
    })
  })

  describe('Categories Management', () => {
    it('should initialize with empty categories', () => {
      expect(wrapper.vm.settings[0].categories).toEqual([])
    })

    it('should add a category', () => {
      wrapper.vm.addCategory()
      expect(wrapper.vm.settings[0].categories.length).toBe(1)
      expect(wrapper.vm.settings[0].categories[0]).toHaveProperty('id')
      expect(wrapper.vm.settings[0].categories[0]).toHaveProperty('name')
      expect(wrapper.vm.settings[0].categories[0]).toHaveProperty('description')
      expect(wrapper.vm.settings[0].categories[0]).toHaveProperty('classes')
      expect(wrapper.vm.settings[0].categories[0]).toHaveProperty('icon')
    })

    it('should add category with localized name and description', () => {
      wrapper.vm.addCategory()
      expect(wrapper.vm.settings[0].categories[0].name).toEqual({
        en: '',
        fr: '',
      })
      expect(wrapper.vm.settings[0].categories[0].description).toEqual({
        en: '',
        fr: '',
      })
    })

    it('should remove category by index', () => {
      wrapper.vm.addCategory()
      wrapper.vm.addCategory()
      expect(wrapper.vm.settings[0].categories.length).toBe(2)

      wrapper.vm.removeCategory(0)
      expect(wrapper.vm.settings[0].categories.length).toBe(1)
    })

    it('should remove associated menu items when category is removed', () => {
      wrapper.vm.addCategory()
      const categoryId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.addMenuItem(categoryId)
      expect(wrapper.vm.settings[0].menuItems.length).toBe(1)

      wrapper.vm.removeCategory(0)
      expect(wrapper.vm.settings[0].menuItems.length).toBe(0)
    })

    it('should update categories', () => {
      wrapper.vm.addCategory()
      const newCategories = [
        {
          id: 'test-id',
          name: { en: 'Test' },
          description: {},
          classes: '',
          icon: {},
        },
      ]
      wrapper.vm.updateCategories(newCategories)
      expect(wrapper.vm.settings[0].categories).toEqual(newCategories)
    })

    it('should auto-select first category when added', async () => {
      expect(wrapper.vm.selectedCategoryId).toBe('')
      wrapper.vm.addCategory()
      await wrapper.vm.$nextTick()
      const newCategoryId = wrapper.vm.settings[0].categories[0].id
      expect(wrapper.vm.selectedCategoryId).toBe(newCategoryId)
    })

    it('should reset selectedCategoryId when all categories are removed', () => {
      wrapper.vm.addCategory()
      const categoryId = wrapper.vm.selectedCategoryId
      wrapper.vm.removeCategory(0)
      expect(wrapper.vm.selectedCategoryId).toBe('')
    })

    it('should select different category when current is removed and others exist', () => {
      wrapper.vm.addCategory()
      wrapper.vm.addCategory()
      const firstId = wrapper.vm.settings[0].categories[0].id
      const secondId = wrapper.vm.settings[0].categories[1].id
      wrapper.vm.selectedCategoryId = firstId

      wrapper.vm.removeCategory(0)
      expect(wrapper.vm.selectedCategoryId).toBe(secondId)
    })
  })

  describe('Menu Items Management', () => {
    it('should initialize with empty menuItems', () => {
      expect(wrapper.vm.settings[0].menuItems).toEqual([])
    })

    it('should add menu item to a category', () => {
      wrapper.vm.addCategory()
      const categoryId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.addMenuItem(categoryId)

      expect(wrapper.vm.settings[0].menuItems.length).toBe(1)
      expect(wrapper.vm.settings[0].menuItems[0].categoryId).toBe(categoryId)
    })

    it('should add menu item with required fields', () => {
      wrapper.vm.addCategory()
      const categoryId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.addMenuItem(categoryId)

      expect(wrapper.vm.settings[0].menuItems[0]).toHaveProperty('id')
      expect(wrapper.vm.settings[0].menuItems[0]).toHaveProperty('categoryId')
      expect(wrapper.vm.settings[0].menuItems[0]).toHaveProperty('name')
      expect(wrapper.vm.settings[0].menuItems[0]).toHaveProperty('description')
      expect(wrapper.vm.settings[0].menuItems[0]).toHaveProperty('price')
      expect(wrapper.vm.settings[0].menuItems[0]).toHaveProperty('image')
      expect(wrapper.vm.settings[0].menuItems[0]).toHaveProperty('featured')
      expect(wrapper.vm.settings[0].menuItems[0]).toHaveProperty('classes')
      expect(wrapper.vm.settings[0].menuItems[0]).toHaveProperty('hasVariants')
      expect(wrapper.vm.settings[0].menuItems[0]).toHaveProperty('variants')
    })

    it('should not add menu item without categoryId', () => {
      wrapper.vm.addMenuItem(null)
      expect(wrapper.vm.settings[0].menuItems.length).toBe(0)

      wrapper.vm.addMenuItem(undefined)
      expect(wrapper.vm.settings[0].menuItems.length).toBe(0)
    })

    it('should remove menu item by id', () => {
      wrapper.vm.addCategory()
      const categoryId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.addMenuItem(categoryId)
      const itemId = wrapper.vm.settings[0].menuItems[0].id

      wrapper.vm.removeMenuItem(itemId)
      expect(wrapper.vm.settings[0].menuItems.length).toBe(0)
    })

    it('should get menu items by category', () => {
      wrapper.vm.addCategory()
      wrapper.vm.addCategory()
      const cat1Id = wrapper.vm.settings[0].categories[0].id
      const cat2Id = wrapper.vm.settings[0].categories[1].id

      wrapper.vm.addMenuItem(cat1Id)
      wrapper.vm.addMenuItem(cat1Id)
      wrapper.vm.addMenuItem(cat2Id)

      const cat1Items = wrapper.vm.getMenuItemsByCategory(cat1Id)
      const cat2Items = wrapper.vm.getMenuItemsByCategory(cat2Id)

      expect(cat1Items.length).toBe(2)
      expect(cat2Items.length).toBe(1)
    })

    it('should return empty array for invalid categoryId', () => {
      const items = wrapper.vm.getMenuItemsByCategory('invalid-id')
      expect(items).toEqual([])
    })

    it('should update menu items for a category', () => {
      wrapper.vm.addCategory()
      const catId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.addMenuItem(catId)
      wrapper.vm.addCategory()

      const updatedItems = [
        {
          id: 'item1',
          categoryId: catId,
          name: { en: 'Updated' },
          description: {},
          price: '10',
        },
      ]
      wrapper.vm.updateMenuItemsForCategory(catId, updatedItems)

      expect(wrapper.vm.settings[0].menuItems.length).toBe(1)
      expect(wrapper.vm.settings[0].menuItems[0].name.en).toBe('Updated')
    })

    it('should add error entry when adding menu item', () => {
      wrapper.vm.addCategory()
      const catId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.addMenuItem(catId)

      expect(wrapper.vm.errors.menuItems.length).toBe(1)
      expect(wrapper.vm.errors.menuItems[0]).toHaveProperty('id')
      expect(wrapper.vm.errors.menuItems[0]).toHaveProperty('name')
      expect(wrapper.vm.errors.menuItems[0]).toHaveProperty('price')
    })
  })

  describe('Variants Management', () => {
    it('should toggle variants on for menu item', () => {
      wrapper.vm.addCategory()
      const catId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.addMenuItem(catId)
      const itemId = wrapper.vm.settings[0].menuItems[0].id

      wrapper.vm.onVariantsToggle(itemId, true)
      expect(wrapper.vm.settings[0].menuItems[0].variants).toEqual([])
    })

    it('should toggle variants off for menu item', () => {
      wrapper.vm.addCategory()
      const catId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.addMenuItem(catId)
      const itemId = wrapper.vm.settings[0].menuItems[0].id

      wrapper.vm.onVariantsToggle(itemId, true)
      wrapper.vm.onVariantsToggle(itemId, false)

      expect(wrapper.vm.settings[0].menuItems[0].variants).toEqual([])
    })

    it('should add variant to menu item', () => {
      wrapper.vm.addCategory()
      const catId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.addMenuItem(catId)
      const itemId = wrapper.vm.settings[0].menuItems[0].id

      wrapper.vm.addVariant(itemId)
      expect(wrapper.vm.settings[0].menuItems[0].variants.length).toBe(1)
      expect(wrapper.vm.settings[0].menuItems[0].variants[0]).toHaveProperty(
        'id',
      )
      expect(wrapper.vm.settings[0].menuItems[0].variants[0]).toHaveProperty(
        'name',
      )
      expect(wrapper.vm.settings[0].menuItems[0].variants[0]).toHaveProperty(
        'price',
      )
    })

    it('should add variant with localized name', () => {
      wrapper.vm.addCategory()
      const catId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.addMenuItem(catId)
      const itemId = wrapper.vm.settings[0].menuItems[0].id

      wrapper.vm.addVariant(itemId)
      expect(wrapper.vm.settings[0].menuItems[0].variants[0].name).toEqual({
        en: '',
        fr: '',
      })
    })

    it('should remove variant from menu item', () => {
      wrapper.vm.addCategory()
      const catId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.addMenuItem(catId)
      const itemId = wrapper.vm.settings[0].menuItems[0].id

      wrapper.vm.addVariant(itemId)
      wrapper.vm.addVariant(itemId)
      expect(wrapper.vm.settings[0].menuItems[0].variants.length).toBe(2)

      wrapper.vm.removeVariant(itemId, 0)
      expect(wrapper.vm.settings[0].menuItems[0].variants.length).toBe(1)
    })

    it('should update variants for menu item', () => {
      wrapper.vm.addCategory()
      const catId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.addMenuItem(catId)
      const itemId = wrapper.vm.settings[0].menuItems[0].id

      wrapper.vm.addVariant(itemId)

      const updatedVariants = [
        { id: 'variant-1', name: { en: 'Large' }, price: 15 },
      ]
      wrapper.vm.updateVariants(itemId, updatedVariants)

      expect(wrapper.vm.settings[0].menuItems[0].variants).toEqual(
        updatedVariants,
      )
    })
  })

  describe('Branches Management', () => {
    it('should initialize with empty branches', () => {
      expect(wrapper.vm.settings[0].branches).toEqual([])
    })

    it('should add a branch', () => {
      wrapper.vm.addBranch()
      expect(wrapper.vm.settings[0].branches.length).toBe(1)
      expect(wrapper.vm.settings[0].branches[0]).toHaveProperty('id')
      expect(wrapper.vm.settings[0].branches[0]).toHaveProperty('name')
      expect(wrapper.vm.settings[0].branches[0]).toHaveProperty('phone')
    })

    it('should add branch with localized name', () => {
      wrapper.vm.addBranch()
      expect(wrapper.vm.settings[0].branches[0].name).toEqual({
        en: '',
        fr: '',
      })
    })

    it('should remove branch by index', () => {
      wrapper.vm.addBranch()
      wrapper.vm.addBranch()
      expect(wrapper.vm.settings[0].branches.length).toBe(2)

      wrapper.vm.removeBranch(0)
      expect(wrapper.vm.settings[0].branches.length).toBe(1)
    })

    it('should update branches', () => {
      wrapper.vm.addBranch()
      const newBranches = [
        { id: 'branch-1', name: { en: 'Branch 1' }, phone: '+1234567890' },
      ]
      wrapper.vm.updateBranches(newBranches)
      expect(wrapper.vm.settings[0].branches).toEqual(newBranches)
    })
  })

  describe('Media Management', () => {
    it('should initialize medias array on mount', async () => {
      wrapper.vm.initializeMediasArray()
      expect(wrapper.vm.settings[0].medias).toBeDefined()
      expect(Array.isArray(wrapper.vm.settings[0].medias)).toBe(true)
    })

    it('should add media to medias array', () => {
      const media = {
        media_id: 'media-123',
        url: 'https://example.com/image.jpg',
      }
      wrapper.vm.updateMediasArray(media)
      expect(wrapper.vm.settings[0].medias).toContainEqual(media)
    })

    it('should not add duplicate media', () => {
      const media = {
        media_id: 'media-123',
        url: 'https://example.com/image.jpg',
      }
      wrapper.vm.updateMediasArray(media)
      wrapper.vm.updateMediasArray(media)
      expect(
        wrapper.vm.settings[0].medias.filter((m) => m.media_id === 'media-123')
          .length,
      ).toBe(1)
    })

    it('should remove media from medias array', () => {
      const media = {
        media_id: 'media-123',
        url: 'https://example.com/image.jpg',
      }
      wrapper.vm.updateMediasArray(media)
      wrapper.vm.removeFromMediasArray('media-123')
      expect(wrapper.vm.settings[0].medias).not.toContainEqual(media)
    })

    it('should open media modal and set media type', async () => {
      await wrapper.vm.openMediaModal('item-id', 'media-id')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.currentMediaItemId).toBe('item-id')
      expect(wrapper.vm.currentMediaType).toBe('menuItem')
    })

    it('should open category icon modal', async () => {
      await wrapper.vm.openCategoryIconModal('cat-id', 'media-id')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.currentCategoryId).toBe('cat-id')
      expect(wrapper.vm.currentMediaType).toBe('categoryIcon')
    })

    it('should open logo modal', async () => {
      await wrapper.vm.openLogoModal('media-id')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.currentMediaType).toBe('logo')
    })

    it('should remove logo', () => {
      wrapper.vm.settings[0].logo = {
        media_id: 'logo-123',
        url: 'https://example.com/logo.jpg',
      }
      wrapper.vm.removeLogo()
      expect(wrapper.vm.settings[0].logo).toEqual({})
    })

    it('should remove logo media from medias array', () => {
      wrapper.vm.settings[0].medias = [
        { media_id: 'logo-123', url: 'https://example.com/logo.jpg' },
      ]
      wrapper.vm.settings[0].logo = {
        media_id: 'logo-123',
        url: 'https://example.com/logo.jpg',
      }
      wrapper.vm.removeLogo()
      expect(wrapper.vm.settings[0].medias).not.toContainEqual(
        expect.objectContaining({ media_id: 'logo-123' }),
      )
    })

    it('should remove category icon', () => {
      wrapper.vm.addCategory()
      const catId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.settings[0].categories[0].icon = {
        media_id: 'icon-123',
        url: 'https://example.com/icon.jpg',
      }
      wrapper.vm.removeCategoryIcon(catId)
      expect(wrapper.vm.settings[0].categories[0].icon).toEqual({})
    })

    it('should remove menu item image', () => {
      wrapper.vm.addCategory()
      const catId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.addMenuItem(catId)
      const itemId = wrapper.vm.settings[0].menuItems[0].id
      wrapper.vm.settings[0].menuItems[0].image = {
        media_id: 'img-123',
        url: 'https://example.com/img.jpg',
      }
      wrapper.vm.removeItemImage(itemId)
      expect(wrapper.vm.settings[0].menuItems[0].image).toEqual({})
    })

    it('should reset media state', () => {
      wrapper.vm.currentMediaItemId = 'test-id'
      wrapper.vm.currentCategoryId = 'cat-id'
      wrapper.vm.currentMediaType = 'logo'
      wrapper.vm.resetMediaState()
      expect(wrapper.vm.currentMediaItemId).toBeNull()
      expect(wrapper.vm.currentCategoryId).toBeNull()
      expect(wrapper.vm.currentMediaType).toBeNull()
    })
  })

  describe('Validation', () => {
    it('should pass validation with valid data', () => {
      wrapper.vm.addCategory()
      const catId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.settings[0].categories[0].name.en = 'Appetizers'
      wrapper.vm.addMenuItem(catId)
      wrapper.vm.settings[0].menuItems[0].name.en = 'Burger'
      wrapper.vm.settings[0].menuItems[0].price = '10.99'

      expect(wrapper.vm.validate()).toBe(true)
    })

    it('should fail validation when category name is missing', () => {
      wrapper.vm.addCategory()
      wrapper.vm.settings[0].categories[0].name.en = ''
      expect(wrapper.vm.validate()).toBe(false)
      expect(wrapper.vm.errors.categories[0].name).toBe(true)
    })

    it('should fail validation when menu item name is missing', () => {
      wrapper.vm.addCategory()
      const catId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.addMenuItem(catId)
      wrapper.vm.settings[0].categories[0].name.en = 'Test'
      wrapper.vm.settings[0].menuItems[0].name.en = ''
      wrapper.vm.settings[0].menuItems[0].price = '10'

      expect(wrapper.vm.validate()).toBe(false)
      expect(wrapper.vm.errors.menuItems[0].name).toBe(true)
    })

    it('should fail validation when menu item price is missing', () => {
      wrapper.vm.addCategory()
      const catId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.addMenuItem(catId)
      wrapper.vm.settings[0].categories[0].name.en = 'Test'
      wrapper.vm.settings[0].menuItems[0].name.en = 'Burger'
      wrapper.vm.settings[0].menuItems[0].price = ''

      expect(wrapper.vm.validate()).toBe(false)
      expect(wrapper.vm.errors.menuItems[0].price).toBe(true)
    })

    it('should pass validation when price is 0', () => {
      wrapper.vm.addCategory()
      const catId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.addMenuItem(catId)
      wrapper.vm.settings[0].categories[0].name.en = 'Test'
      wrapper.vm.settings[0].menuItems[0].name.en = 'Burger'
      wrapper.vm.settings[0].menuItems[0].price = 0

      expect(wrapper.vm.validate()).toBe(true)
    })

    it('should fail validation when tax is enabled but taxRate is empty', () => {
      wrapper.vm.addCategory()
      wrapper.vm.settings[0].categories[0].name.en = 'Test'
      wrapper.vm.settings[0].enableTax = true
      wrapper.vm.settings[0].taxRate = ''

      expect(wrapper.vm.validate()).toBe(false)
      expect(wrapper.vm.errors.generalSettings.taxRate).toBe(true)
    })

    it('should pass validation when tax is enabled and taxRate is set', () => {
      wrapper.vm.addCategory()
      wrapper.vm.settings[0].categories[0].name.en = 'Test'
      wrapper.vm.settings[0].enableTax = true
      wrapper.vm.settings[0].taxRate = 10

      expect(wrapper.vm.validate()).toBe(true)
    })

    it('should pass validation when tax is disabled and taxRate is empty', () => {
      wrapper.vm.addCategory()
      wrapper.vm.settings[0].categories[0].name.en = 'Test'
      wrapper.vm.settings[0].enableTax = false
      wrapper.vm.settings[0].taxRate = ''

      expect(wrapper.vm.validate()).toBe(true)
    })

    it('should fail validation when branches enabled but branch name missing', () => {
      wrapper.vm.addBranch()
      wrapper.vm.settings[0].enableBranches = true
      wrapper.vm.settings[0].branches[0].name.en = ''
      wrapper.vm.settings[0].branches[0].phone = '+1234567890'

      expect(wrapper.vm.validate()).toBe(false)
      expect(wrapper.vm.errors.branches[0].name).toBe(true)
    })

    it('should fail validation when branches enabled but branch phone missing', () => {
      wrapper.vm.addBranch()
      wrapper.vm.settings[0].enableBranches = true
      wrapper.vm.settings[0].branches[0].name.en = 'Branch 1'
      wrapper.vm.settings[0].branches[0].phone = ''

      expect(wrapper.vm.validate()).toBe(false)
      expect(wrapper.vm.errors.branches[0].phone).toBe(true)
    })

    it('should pass validation when branches enabled with valid data', () => {
      wrapper.vm.addBranch()
      wrapper.vm.settings[0].enableBranches = true
      wrapper.vm.settings[0].branches[0].name.en = 'Branch 1'
      wrapper.vm.settings[0].branches[0].phone = '+1234567890'

      expect(wrapper.vm.validate()).toBe(true)
    })

    it('should get error for menu item field', () => {
      wrapper.vm.addCategory()
      const catId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.addMenuItem(catId)
      const itemId = wrapper.vm.settings[0].menuItems[0].id

      wrapper.vm.errors.menuItems[0].name = true
      expect(wrapper.vm.getErrorForMenuItem(itemId, 'name')).toBe(true)

      wrapper.vm.errors.menuItems[0].name = false
      expect(wrapper.vm.getErrorForMenuItem(itemId, 'name')).toBe(false)
    })
  })

  describe('Settings', () => {
    it('should initialize with default settings', () => {
      expect(wrapper.vm.settings[0].viewMode).toBe('list')
      expect(wrapper.vm.settings[0].currencySymbol).toBe('$')
      expect(wrapper.vm.settings[0].enableTax).toBe(false)
      expect(wrapper.vm.settings[0].showWhatsApp).toBe(false)
      expect(wrapper.vm.settings[0].enableBranches).toBe(false)
    })

    it('should initialize appearance settings with default values', () => {
      expect(wrapper.vm.settings[0].appearance.shoppingCart).toBe(true)
      expect(wrapper.vm.settings[0].appearance.itemDetails).toBe(true)
    })

    it('should initialize social media settings', () => {
      expect(wrapper.vm.settings[0].socialMedia).toHaveProperty('instagram')
      expect(wrapper.vm.settings[0].socialMedia).toHaveProperty('facebook')
      expect(wrapper.vm.settings[0].socialMedia).toHaveProperty('tiktok')
      expect(wrapper.vm.settings[0].socialMedia).toHaveProperty('twitter')
      expect(wrapper.vm.settings[0].socialMedia).toHaveProperty('youtube')
    })

    it('should initialize localized fields for menuTitle and menuSubtitle', () => {
      wrapper.vm.initializeLocalizedFields()
      expect(wrapper.vm.settings[0].menuTitle).toEqual({ en: '', fr: '' })
      expect(wrapper.vm.settings[0].menuSubtitle).toEqual({ en: '', fr: '' })
    })
  })

  describe('Shopping Cart Behavior', () => {
    it('should enable itemDetails when shoppingCart is enabled', () => {
      wrapper.vm.settings[0].appearance.itemDetails = false
      wrapper.vm.onShoppingCartChange()
      expect(wrapper.vm.settings[0].appearance.itemDetails).toBe(true)
    })
  })

  describe('Category Options', () => {
    it('should return empty array when no categories exist', () => {
      const options = wrapper.vm.getCategoryOptions()
      expect(options).toEqual([])
    })

    it('should return category options with id and name', () => {
      wrapper.vm.addCategory()
      const catId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.settings[0].categories[0].name.en = 'Appetizers'

      const options = wrapper.vm.getCategoryOptions()
      expect(options.length).toBe(1)
      expect(options[0]).toHaveProperty('id', catId)
      expect(options[0]).toHaveProperty('name', 'Appetizers')
    })

    it('should fallback to English name if selectedLang name is empty', () => {
      wrapper.vm.addCategory()
      const catId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.settings[0].categories[0].name.en = 'Appetizers'
      wrapper.vm.settings[0].categories[0].name.fr = ''
      wrapper.setProps({ selectedLang: 'fr' })

      const options = wrapper.vm.getCategoryOptions()
      expect(options[0].name).toBe('Appetizers')
    })

    it('should display "New Category" when name is empty', () => {
      wrapper.vm.addCategory()
      const catId = wrapper.vm.settings[0].categories[0].id
      wrapper.vm.settings[0].categories[0].name.en = ''
      wrapper.vm.settings[0].categories[0].name.fr = ''

      const options = wrapper.vm.getCategoryOptions()
      expect(options[0].name).toBe('New Category')
    })
  })

  describe('Lifecycle', () => {
    it('should initialize on mounted', () => {
      expect(wrapper.vm.settings[0]).toBeDefined()
      expect(wrapper.vm.settings[0].appearance).toBeDefined()
    })
  })
})
