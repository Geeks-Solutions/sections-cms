import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ServicePackages_static from '../ServicePackages_static.vue'

describe('ServicePackages_static.vue', () => {
  const mockSection = {
    settings: [
      {
        logo: {
          url: 'https://example.com/logo.png',
          seo_tag: 'Test Logo',
          metadata: { type: 'image' },
        },
        pageTitle: {
          en: 'Our Services',
          fr: 'Nos Services',
        },
        pageSubtitle: {
          en: 'Book your next experience',
          fr: 'Réservez votre prochaine expérience',
        },
        categories: [
          {
            id: 'cat1',
            name: { en: 'Category 1', fr: 'Catégorie 1' },
            description: { en: 'Description 1', fr: 'Description 1' },
          },
          {
            id: 'cat2',
            name: { en: 'Category 2', fr: 'Catégorie 2' },
            description: { en: 'Description 2', fr: 'Description 2' },
          },
        ],
        serviceItems: [
          {
            id: 'item1',
            categoryId: 'cat1',
            name: { en: 'Service 1', fr: 'Service 1' },
            description: { en: 'Description', fr: 'Description' },
            price: 100,
            duration: { en: '1 hour', fr: '1 heure' },
            hasDiscount: false,
          },
          {
            id: 'item2',
            categoryId: 'cat2',
            name: { en: 'Service 2', fr: 'Service 2' },
            description: { en: 'Description', fr: 'Description' },
            price: 200,
            duration: { en: '2 hours', fr: '2 heures' },
            hasDiscount: true,
            discountedPrice: 150,
          },
        ],
        currencySymbol: '$',
        viewMode: 'list',
        businessType: 'travel',
        enableTax: true,
        taxRate: 10.0,
        enableServiceFee: true,
        serviceFeeRate: 5.0,
        socialMedia: {
          instagram: 'https://instagram.com/test',
          facebook: 'https://facebook.com/test',
        },
        showWhatsApp: true,
        whatsappNumber: '+1234567890',
        whatsappMessage: {
          en: 'Hello! I would like to book a service.',
        },
      },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('renders component when settings are provided', () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('handles empty settings gracefully', () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: { settings: null },
          lang: 'en',
        },
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.settings).toBeDefined()
    })

    it('renders page title', () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      const title = wrapper.find('.menu-title')
      expect(title.text()).toBe('Our Services')
    })

    it('renders with correct business type class', () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      expect(wrapper.classes()).toContain('business-travel')
    })
  })

  describe('Categories and Items', () => {
    it('displays categories in list view mode', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.sortedCategories).toHaveLength(2)
    })

    it('returns items filtered by category', () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      const cat1Items = wrapper.vm.getItemsByCategory('cat1')

      expect(cat1Items).toHaveLength(1)
      expect(cat1Items[0].id).toBe('item1')
    })

    it('returns empty array for non-existent category', () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      const items = wrapper.vm.getItemsByCategory('non-existent')

      expect(items).toHaveLength(0)
    })
  })

  describe('Cart Functionality', () => {
    it('calculates cart subtotal correctly', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      wrapper.vm.cart = [
        { id: 'item1', price: 100, hasDiscount: false, quantity: 2 },
      ]

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.cartSubtotal).toBe(200)
    })

    it('calculates cart tax correctly', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      wrapper.vm.cart = [
        { id: 'item1', price: 100, hasDiscount: false, quantity: 2 },
      ]

      await wrapper.vm.$nextTick()

      const expectedTax = (200 + 10) * 0.1
      expect(wrapper.vm.cartTax).toBe(expectedTax)
    })

    it('calculates cart service fee correctly', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      wrapper.vm.cart = [
        { id: 'item1', price: 100, hasDiscount: false, quantity: 2 },
      ]

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.cartServiceFee).toBe(10)
    })

    it('calculates cart total correctly', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      wrapper.vm.cart = [
        { id: 'item1', price: 100, hasDiscount: false, quantity: 2 },
      ]

      await wrapper.vm.$nextTick()

      const expectedTotal = 200 + 10 + (200 + 10) * 0.1
      expect(wrapper.vm.cartTotal).toBe(expectedTotal)
    })

    it('calculates total items in cart', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      wrapper.vm.cart = [
        { id: 'item1', price: 100, quantity: 2 },
        { id: 'item2', price: 200, quantity: 3 },
      ]

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.totalItems).toBe(5)
    })

    it('removes item from cart', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      wrapper.vm.cart = [{ id: 'item1', price: 100, quantity: 2 }]

      await wrapper.vm.$nextTick()
      wrapper.vm.removeFromCart(0)

      expect(wrapper.vm.cart).toHaveLength(0)
    })

    it('increments cart item quantity', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      wrapper.vm.cart = [{ id: 'item1', price: 100, quantity: 1 }]

      await wrapper.vm.$nextTick()
      wrapper.vm.incrementCartItem(0)

      expect(wrapper.vm.cart[0].quantity).toBe(2)
    })

    it('decrements cart item quantity', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      wrapper.vm.cart = [{ id: 'item1', price: 100, quantity: 3 }]

      await wrapper.vm.$nextTick()
      wrapper.vm.decrementCartItem(0)

      expect(wrapper.vm.cart[0].quantity).toBe(2)
    })

    it('does not decrement below 1', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      wrapper.vm.cart = [{ id: 'item1', price: 100, quantity: 1 }]

      await wrapper.vm.$nextTick()
      wrapper.vm.decrementCartItem(0)

      expect(wrapper.vm.cart[0].quantity).toBe(1)
    })

    it('toggles cart visibility', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      expect(wrapper.vm.showCart).toBe(false)

      wrapper.vm.toggleCart()

      expect(wrapper.vm.showCart).toBe(true)

      wrapper.vm.toggleCart()

      expect(wrapper.vm.showCart).toBe(false)
    })

    it('closes cart', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      wrapper.vm.toggleCart()
      expect(wrapper.vm.showCart).toBe(true)

      wrapper.vm.closeCart()

      expect(wrapper.vm.showCart).toBe(false)
    })

    it('clears cart on checkout', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      wrapper.vm.cart = [{ id: 'item1', price: 100, quantity: 1 }]

      await wrapper.vm.$nextTick()
      wrapper.vm.checkout()

      expect(wrapper.vm.cart).toHaveLength(0)
    })
  })

  describe('Item Modal', () => {
    it('opens item modal', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      const item = mockSection.settings[0].serviceItems[0]
      wrapper.vm.openItemModal(item)

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.showItemModal).toBe(true)
      expect(wrapper.vm.selectedItem).toEqual(item)
      expect(wrapper.vm.itemQuantity).toBe(1)
      expect(wrapper.vm.itemNotes).toBe('')
    })

    it('closes item modal', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      const item = mockSection.settings[0].serviceItems[0]
      wrapper.vm.openItemModal(item)
      wrapper.vm.closeItemModal()

      expect(wrapper.vm.showItemModal).toBe(false)
    })

    it('updates item quantity', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      const item = mockSection.settings[0].serviceItems[0]
      wrapper.vm.openItemModal(item)
      wrapper.vm.updateItemQuantity(5)

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.itemQuantity).toBe(5)
    })

    it('updates item notes', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      const item = mockSection.settings[0].serviceItems[0]
      wrapper.vm.openItemModal(item)
      wrapper.vm.updateItemNotes('Test notes')

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.itemNotes).toBe('Test notes')
    })

    it('updates selected date', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      const item = mockSection.settings[0].serviceItems[0]
      wrapper.vm.openItemModal(item)
      wrapper.vm.updateSelectedDate('2024-01-15')

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.selectedDate).toBe('2024-01-15')
    })
  })

  describe('Social Media Links', () => {
    it('generates social media links', () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      const links = wrapper.vm.socialMediaLinks

      expect(links).toHaveLength(2)
      expect(links[0].type).toBe('instagram')
      expect(links[0].url).toBe('https://instagram.com/test')
      expect(links[0].classes).toBe('instagram')
      expect(links[1].type).toBe('facebook')
    })

    it('filters empty social media links', () => {
      const sectionWithEmptyLinks = {
        settings: [
          {
            ...mockSection.settings[0],
            socialMedia: {
              instagram: '',
              facebook: 'https://facebook.com/test',
            },
          },
        ],
      }

      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: sectionWithEmptyLinks,
          lang: 'en',
        },
      })

      const links = wrapper.vm.socialMediaLinks

      expect(links).toHaveLength(1)
      expect(links[0].type).toBe('facebook')
    })

    it('excludes whatsapp from social media links', () => {
      const sectionWithWhatsApp = {
        settings: [
          {
            ...mockSection.settings[0],
            socialMedia: {
              instagram: 'https://instagram.com/test',
              whatsapp: 'https://wa.me/1234567890',
            },
          },
        ],
      }

      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: sectionWithWhatsApp,
          lang: 'en',
        },
      })

      const links = wrapper.vm.socialMediaLinks

      expect(links).toHaveLength(1)
      expect(links[0].type).toBe('instagram')
    })
  })

  describe('Tax and Service Fee', () => {
    it('handles tax disabled', async () => {
      const sectionWithoutTax = {
        settings: [
          {
            ...mockSection.settings[0],
            enableTax: false,
          },
        ],
      }

      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: sectionWithoutTax,
          lang: 'en',
        },
      })

      wrapper.vm.cart = [{ id: 'item1', price: 100, quantity: 1 }]

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.cartTax).toBe(0)
    })

    it('handles service fee disabled', async () => {
      const sectionWithoutServiceFee = {
        settings: [
          {
            ...mockSection.settings[0],
            enableServiceFee: false,
          },
        ],
      }

      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: sectionWithoutServiceFee,
          lang: 'en',
        },
      })

      wrapper.vm.cart = [{ id: 'item1', price: 100, quantity: 1 }]

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.cartServiceFee).toBe(0)
    })
  })

  describe('Discounted Items', () => {
    it('uses discounted price when available', async () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      wrapper.vm.cart = [
        {
          id: 'item2',
          price: 200,
          hasDiscount: true,
          discountedPrice: 150,
          quantity: 1,
        },
      ]

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.cartSubtotal).toBe(150)
    })
  })

  describe('Category View Mode', () => {
    it('sets active category on mount in category view mode', async () => {
      const categoryViewSection = {
        settings: [
          {
            ...mockSection.settings[0],
            viewMode: 'category',
          },
        ],
      }

      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: categoryViewSection,
          lang: 'en',
        },
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isCategoryView).toBe(true)
      expect(wrapper.vm.activeCategory).toBe('cat1')
    })

    it('displays active category description', async () => {
      const categoryViewSection = {
        settings: [
          {
            ...mockSection.settings[0],
            viewMode: 'category',
          },
        ],
      }

      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: categoryViewSection,
          lang: 'en',
        },
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.activeCategoryObj?.id).toBe('cat1')
      expect(wrapper.vm.activeCategoryObj?.description?.en).toBe(
        'Description 1',
      )
    })
  })

  describe('WhatsApp Integration', () => {
    it('returns correct WhatsApp message', () => {
      const wrapper = shallowMount(ServicePackages_static, {
        props: {
          section: mockSection,
          lang: 'en',
        },
      })

      const message = wrapper.vm.getWhatsAppMessage()

      expect(message).toBe('Hello! I would like to book a service.')
    })
  })
})
