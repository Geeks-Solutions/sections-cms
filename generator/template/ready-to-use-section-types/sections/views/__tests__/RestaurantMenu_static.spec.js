import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RestaurantMenuStatic from '../RestaurantMenu_static.vue'

const mockCartIcon = {
  template:
    '<div class="cart-icon" @click="$emit(\'click\')"><slot></slot></div>',
  props: ['totalItems'],
  emits: ['click'],
}

const mockSocialLinks = {
  template: '<div class="social-links"><slot></slot></div>',
  props: [
    'links',
    'showWhatsApp',
    'whatsappNumber',
    'whatsappMessage',
    'cart',
    'lang',
    'i18n',
    'type',
    'enableBranches',
  ],
}

const mockCategoryTabs = {
  template: '<div class="category-tabs"><slot></slot></div>',
  props: ['categories', 'activeCategory', 'lang'],
  emits: ['selectCategory'],
}

const mockItemsGrid = {
  template: '<div class="items-grid"><slot></slot></div>',
  props: [
    'items',
    'currencySymbol',
    'lang',
    'showItemDetails',
    'expandedItems',
  ],
  emits: ['itemClick'],
}

const mockCategoryList = {
  template: '<div class="category-list"><slot></slot></div>',
  props: [
    'categories',
    'getItemsByCategory',
    'currencySymbol',
    'lang',
    'showItemDetails',
    'expandedItems',
  ],
  emits: ['itemClick'],
}

const mockItemModal = {
  template: '<div class="item-modal" v-if="show"><slot></slot></div>',
  props: [
    'show',
    'item',
    'currencySymbol',
    'lang',
    'quantity',
    'notes',
    'type',
    'selectedVariant',
    'showAddToCart',
  ],
  emits: [
    'close',
    'updateQuantity',
    'updateNotes',
    'selectVariant',
    'addToCart',
  ],
}

const mockShoppingCart = {
  template: '<div class="shopping-cart" v-if="show"><slot></slot></div>',
  props: [
    'show',
    'cart',
    'currencySymbol',
    'taxRate',
    'enableTax',
    'lang',
    'i18n',
    'type',
    'whatsappEnabled',
    'whatsappNumber',
    'enableBranches',
    'branches',
  ],
  emits: ['close', 'increment', 'decrement', 'remove', 'checkout'],
}

describe('RestaurantMenuStatic', () => {
  let wrapper

  const createWrapper = (props = {}) => {
    const baseSettings = {
      logo: {
        url: 'logo.jpg',
        seo_tag: 'Restaurant Logo',
        metadata: { type: 'image' },
      },
      menuTitle: {
        en: 'Our Menu',
        fr: 'Notre Menu',
      },
      menuSubtitle: {
        en: 'Discover our delicious options',
        fr: 'Découvrez nos délicieuses options',
      },
      categories: [
        {
          id: 'drinks-category-id',
          name: {
            en: 'Drinks',
            fr: 'Boissons',
          },
          description: {
            en: 'Category Description',
            fr: 'Description de la catégorie',
          },
          classes: '',
          icon: {
            media_id: '',
            url: '',
            seo_tag: '',
          },
        },
        {
          id: 'food-category-id',
          name: {
            en: 'Food',
            fr: 'Nourriture',
          },
          description: {
            en: 'Food Category Description',
            fr: 'Description de la catégorie nourriture',
          },
          classes: '',
        },
      ],
      menuItems: [
        {
          id: 'item-id-1',
          categoryId: 'drinks-category-id',
          name: {
            en: 'Coca Cola',
            fr: 'Coca Cola',
          },
          description: {
            en: 'Refreshing cola drink',
            fr: 'Boisson rafraîchissante au cola',
          },
          price: 2.99,
          image: 'image1.jpg',
          featured: true,
          classes: '',
        },
        {
          id: 'item-id-2',
          categoryId: 'food-category-id',
          name: {
            en: 'Burger',
            fr: 'Burger',
          },
          description: {
            en: 'Delicious burger',
            fr: 'Délicieux burger',
          },
          price: 8.99,
          image: 'image2.jpg',
          featured: false,
          classes: '',
        },
      ],
      currencySymbol: '$',
      classes: '',
      viewMode: 'category',
      enableTax: true,
      taxRate: 10.0,
      appearance: {
        shoppingCart: true,
        itemDetails: true,
      },
      socialMedia: {
        instagram: 'https://instagram.com/test',
        facebook: 'https://facebook.com/test',
      },
      showWhatsApp: false,
      whatsappNumber: '',
      whatsappMessage: {
        en: 'Hello!',
        fr: 'Bonjour!',
      },
      enableBranches: false,
      branches: [],
    }

    return mount(RestaurantMenuStatic, {
      props: {
        lang: 'en',
        locales: ['en', 'fr'],
        section: {
          settings: baseSettings,
        },
        ...props,
      },
      global: {
        components: {
          CartIcon: mockCartIcon,
          SocialLinks: mockSocialLinks,
          CategoryTabs: mockCategoryTabs,
          ItemsGrid: mockItemsGrid,
          CategoryList: mockCategoryList,
          ItemModal: mockItemModal,
          ShoppingCart: mockShoppingCart,
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
    it('should render the component', () => {
      wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should initialize cart as empty array', () => {
      wrapper = createWrapper()
      expect(wrapper.vm.cart).toEqual([])
    })

    it('should calculate cart subtotal correctly', () => {
      wrapper = createWrapper()
      wrapper.vm.cart = [
        { id: 'item-1', quantity: 2, price: 10 },
        { id: 'item-2', quantity: 1, price: 5 },
      ]

      expect(wrapper.vm.cartSubtotal).toBe(25)
    })

    it('should calculate cart tax correctly', () => {
      wrapper = createWrapper()
      wrapper.vm.cart = [{ id: 'item-1', quantity: 2, price: 10 }]

      expect(wrapper.vm.cartTax).toBe(2)
    })

    it('should calculate cart total correctly', () => {
      wrapper = createWrapper()
      wrapper.vm.cart = [{ id: 'item-1', quantity: 2, price: 10 }]

      expect(wrapper.vm.cartTotal).toBe(22)
    })
  })

  describe('Category Management', () => {
    it('should get items by category', () => {
      wrapper = createWrapper()
      const items = wrapper.vm.getItemsByCategory('drinks-category-id')

      expect(items).toHaveLength(1)
      expect(items[0].id).toBe('item-id-1')
    })

    it('should return empty array for non-existent category', () => {
      wrapper = createWrapper()
      const items = wrapper.vm.getItemsByCategory('non-existent-id')

      expect(items).toEqual([])
    })

    it('should set active category', () => {
      wrapper = createWrapper()
      wrapper.vm.setActiveCategory('food-category-id')

      expect(wrapper.vm.activeCategory).toBe('food-category-id')
    })

    it('should initialize active category to first category', () => {
      wrapper = createWrapper()

      expect(wrapper.vm.activeCategory).toBe('drinks-category-id')
    })
  })

  describe('Item Handling', () => {
    it('should open item modal when itemDetails is enabled', () => {
      wrapper = createWrapper()
      const item = wrapper.vm.settings.menuItems[0]

      wrapper.vm.handleItemClick(item)

      expect(wrapper.vm.showItemModal).toBe(true)
      expect(wrapper.vm.selectedItem).toEqual(item)
    })

    it('should expand item when itemDetails is disabled', () => {
      const baseSettings = {
        logo: {
          url: 'logo.jpg',
          seo_tag: 'Restaurant Logo',
          metadata: { type: 'image' },
        },
        menuTitle: { en: 'Our Menu', fr: 'Notre Menu' },
        menuSubtitle: {
          en: 'Discover our delicious options',
          fr: 'Découvrez nos délicieuses options',
        },
        categories: [
          {
            id: 'cat1',
            name: { en: 'Drinks', fr: 'Boissons' },
            description: { en: 'Cat', fr: 'Cat' },
          },
        ],
        menuItems: [
          {
            id: 'item-1',
            categoryId: 'cat1',
            name: { en: 'Coca', fr: 'Coca' },
            description: { en: 'Desc', fr: 'Desc' },
            price: 2.99,
            image: 'img1.jpg',
            featured: true,
          },
        ],
        currencySymbol: '$',
        classes: '',
        viewMode: 'category',
        enableTax: true,
        taxRate: 10.0,
        appearance: { shoppingCart: true, itemDetails: false },
        socialMedia: { instagram: 'https://instagram.com/test' },
        showWhatsApp: false,
        whatsappNumber: '',
        whatsappMessage: { en: 'Hello!', fr: 'Bonjour!' },
        enableBranches: false,
        branches: [],
      }

      wrapper = createWrapper({
        section: { settings: baseSettings },
      })
      const item = wrapper.vm.settings.menuItems[0]

      wrapper.vm.handleItemClick(item)

      expect(wrapper.vm.expandedItems.has(item.id)).toBe(true)
    })

    it('should open item modal with default values', () => {
      wrapper = createWrapper()
      const item = wrapper.vm.settings.menuItems[0]

      wrapper.vm.openItemModal(item)

      expect(wrapper.vm.selectedItem).toEqual(item)
      expect(wrapper.vm.itemQuantity).toBe(1)
      expect(wrapper.vm.itemNotes).toBe('')
      expect(wrapper.vm.showItemModal).toBe(true)
    })

    it('should select first variant when item has variants', () => {
      wrapper = createWrapper()
      const item = {
        ...wrapper.vm.settings.menuItems[0],
        hasVariants: true,
        variants: [{ id: 'variant-1', name: 'Small', price: 5.99 }],
      }

      wrapper.vm.openItemModal(item)

      expect(wrapper.vm.selectedVariant).toEqual(item.variants[0])
    })

    it('should close item modal', () => {
      wrapper = createWrapper()
      wrapper.vm.showItemModal = true

      wrapper.vm.closeItemModal()

      expect(wrapper.vm.showItemModal).toBe(false)
    })

    it('should update item quantity', () => {
      wrapper = createWrapper()

      wrapper.vm.updateItemQuantity(5)

      expect(wrapper.vm.itemQuantity).toBe(5)
    })

    it('should update item notes', () => {
      wrapper = createWrapper()

      wrapper.vm.updateItemNotes('Extra sauce please')

      expect(wrapper.vm.itemNotes).toBe('Extra sauce please')
    })

    it('should select variant', () => {
      wrapper = createWrapper()
      const variant = { id: 'variant-2', name: 'Large', price: 10.99 }

      wrapper.vm.selectVariant(variant)

      expect(wrapper.vm.selectedVariant).toEqual(variant)
    })
  })

  describe('Cart Management', () => {
    it('should add item to cart', async () => {
      wrapper = createWrapper()
      wrapper.vm.selectedItem = wrapper.vm.settings.menuItems[0]
      wrapper.vm.itemQuantity = 2
      wrapper.vm.itemNotes = 'No ice'

      wrapper.vm.addToCart()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.cart).toHaveLength(1)
      expect(wrapper.vm.cart[0].id).toBe(wrapper.vm.selectedItem.id)
      expect(wrapper.vm.cart[0].quantity).toBe(2)
      expect(wrapper.vm.cart[0].notes).toBe('No ice')
      expect(wrapper.vm.showItemModal).toBe(false)
    })

    it('should add variant item to cart', async () => {
      wrapper = createWrapper()
      const item = {
        ...wrapper.vm.settings.menuItems[0],
        price: 10,
        hasVariants: true,
        variants: [{ id: 'variant-1', name: 'Small', price: 5 }],
      }
      wrapper.vm.selectedItem = item
      wrapper.vm.selectedVariant = item.variants[0]
      wrapper.vm.itemQuantity = 1

      wrapper.vm.addToCart()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.cart).toHaveLength(1)
      expect(wrapper.vm.cart[0].id).toBe(item.id)
      expect(wrapper.vm.cart[0].variant.id).toBe('variant-1')
    })
  })
})
