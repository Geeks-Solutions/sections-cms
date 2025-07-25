<template>
  <div v-if="settings" class="restaurant-menu py-2.5" :class="settings.classes">
    <div>
      <!-- Restaurant Logo -->
      <div v-if="settings.logo && settings.logo.url" class="text-center mb-6">
        <NuxtImg :src="settings.logo.url" :alt="settings.logo.seo_tag || 'Restaurant Logo'" width="96" height="96"
          class="h-24 object-contain mx-auto" placeholder quality="80" format="webp" preload fetchpriority="high" />
      </div>

      <!-- Menu Title and Subtitle -->
      <div class="mb-8">
        <h2 v-if="menuTitle" class="menu-title mb-2 flex justify-center">
          {{ menuTitle }}
        </h2>
        <p v-if="menuSubtitle" class="menu-subtitle flex justify-center">
          {{ menuSubtitle }}
        </p>
      </div>

      <!-- Shopping Cart Icon - Only render the icon, not full cart -->
      <CartIcon :total-items="totalItems" @click="toggleCart" />

      <SocialLinks :links="socialMediaLinks" :show-whats-app="!!settings.showWhatsApp"
        :whatsapp-number="settings.whatsappNumber || ''"
        :whatsapp-message="settings.whatsappMessage && settings.whatsappMessage[lang] || ''" :cart="cart" :lang="lang"
        :i18n="$t" :type="'restaurant'" />

      <!-- Category View Mode -->
      <div v-if="isCategoryView" class="menu-content">
        <!-- Category Navigation Tabs - Optimized for performance -->
        <CategoryTabs :categories="sortedCategories" :active-category="activeCategory" :lang="lang"
          @select-category="setActiveCategory" />

        <!-- Active Category Description -->
        <div v-if="activeCategoryObj && activeCategoryObj.description && activeCategoryObj.description[lang]"
          class="mb-6 text-center">
          <p class="category-description">{{ activeCategoryObj.description[lang] }}</p>
        </div>

        <!-- Menu Items for Active Category - Using virtual list for large menus -->
        <ItemsGrid :items="getMenuItemsByCategory(activeCategory)" :currency-symbol="settings.currencySymbol"
          :lang="lang" @item-click="openItemModal" />
      </div>

      <!-- List View Mode (Original) - Optimized for performance -->
      <div v-else class="menu-content">
        <CategoryList :categories="sortedCategories" :get-items-by-category="getItemsByCategory"
          :currency-symbol="settings.currencySymbol" :lang="lang" @item-click="openItemModal" />
      </div>
    </div>

    <!-- Item Modal - Conditionally imported and rendered -->
    <ItemModal v-if="showItemModal" :item="selectedItem" :currency-symbol="settings.currencySymbol" :lang="lang"
      :quantity="itemQuantity" :notes="itemNotes" :type="'restaurant'" @close="closeItemModal"
      @update-quantity="updateItemQuantity" @update-notes="updateItemNotes" @add-to-cart="addToCart" />

    <!-- Shopping Cart Sidebar - Conditionally imported and rendered -->
    <ShoppingCart v-if="showCart" :cart="cart" :currency-symbol="settings.currencySymbol"
      :tax-rate="settings.taxRate ? settings.taxRate / 100 : TAX_RATE"
      :enable-tax="settings.enableTax !== undefined ? settings.enableTax : true" :lang="lang" :i18n="$t"
      type="restaurant" :whatsapp-enabled="!!settings.showWhatsApp && !!settings.whatsappNumber"
      :whatsapp-number="settings.whatsappNumber || ''" @close="closeCart" @increment="incrementCartItem"
      @decrement="decrementCartItem" @remove="removeFromCart" @checkout="checkout" />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount, inject } from 'vue'

// Import components directly for better Nuxt 3 compatibility
import CartIcon from '../../components/UnifiedMenu/CartIcon.vue'
import SocialLinks from '../../components/UnifiedMenu/SocialLinks.vue'
import CategoryTabs from '../../components/UnifiedMenu/CategoryTabs.vue'
import ItemsGrid from '../../components/UnifiedMenu/ItemsGrid.vue'
import CategoryList from '../../components/UnifiedMenu/CategoryList.vue'
import ItemModal from '../../components/UnifiedMenu/ItemModal.vue'
import ShoppingCart from '../../components/UnifiedMenu/ShoppingCart.vue'

// Props
const props = defineProps({
  section: {
    type: Object,
    default: () => ({})
  },
  lang: {
    type: String,
    default: "en"
  },
  locales: {
    type: Array,
    default: () => []
  },
  viewStructure: {
    settings: [
      {
        logo: 'image',
        menuTitle: {
          en: 'Our Menu',
          fr: 'Notre Menu'
        },
        menuSubtitle: {
          en: 'Discover our delicious options',
          fr: 'Découvrez nos délicieuses options'
        },
        categories: [
          {
            id: 'drinks-category-id',
            name: {
              en: 'Drinks',
              fr: 'Boissons'
            },
            description: {
              en: 'Category Description',
              fr: 'Description de la catégorie'
            },
            classes: '',
            icon: {
              media_id: '',
              url: '',
              seo_tag: ''
            }
          }
        ],
        menuItems: [
          {
            id: 'item-id',
            categoryId: 'drinks-category-id',
            name: {
              en: 'Item Name',
              fr: 'Nom du plat'
            },
            description: {
              en: 'Item Description',
              fr: 'Description du plat'
            },
            price: 10.99,
            image: 'image',
            featured: true,
            classes: ''
          }
        ],
        currencySymbol: '$',
        classes: '',
        viewMode: 'list',
        enableTax: true,
        taxRate: 10.00
      }
    ]
  }
})

// Reactive data
const cart = ref([])
const showCart = ref(false)
const showItemModal = ref(false)
const selectedItem = ref(null)
const itemQuantity = ref(1)
const itemNotes = ref('')
const activeCategory = ref('')
const isCartLoaded = ref(false)

// Constants
const TAX_RATE = 0.10

const socialIcons = {
  instagram: {
    classes: 'instagram',
    hoverClasses: 'instagram-hover'
  },
  facebook: {
    classes: 'facebook',
    hoverClasses: 'facebook-hover'
  },
  tiktok: {
    classes: 'tiktok',
    hoverClasses: 'tiktok-hover'
  },
  twitter: {
    classes: 'twitter',
    hoverClasses: 'twitter-hover'
  },
  youtube: {
    classes: 'youtube',
    hoverClasses: 'youtube-hover'
  }
}

// Utility functions
const debounce = (fn, delay) => {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Computed properties
const settings = computed(() => {
  if (!props.section?.settings) return {}
  return Array.isArray(props.section.settings) ? props.section.settings[0] : props.section.settings
})

const menuTitle = computed(() => {
  if (settings.value && settings.value.menuTitle && settings.value.menuTitle[props.lang]) {
    return settings.value.menuTitle[props.lang]
  }
  return ''
})

const menuSubtitle = computed(() => {
  if (settings.value && settings.value.menuSubtitle && settings.value.menuSubtitle[props.lang]) {
    return settings.value.menuSubtitle[props.lang]
  }
  return ''
})

const socialMediaLinks = computed(() => {
  if (!settings.value || !settings.value.socialMedia) return []

  return Object.entries(settings.value.socialMedia || {})
    .filter(([platform, url]) => {
      return platform !== 'whatsapp' &&
        url &&
        typeof url === 'string' &&
        url.trim() !== ''
    })
    .map(([platform, url]) => {
      const classes = (socialIcons[platform] || {}).classes || ''
      const hoverClasses = (socialIcons[platform] || {}).hoverClasses || ''

      return {
        type: platform,
        url,
        classes,
        hoverClasses
      }
    })
})

const sortedCategories = computed(() => {
  if (!settings.value || !settings.value.categories) return []
  return [...settings.value.categories]
})

const isCategoryView = computed(() => {
  return settings.value && settings.value.viewMode === 'category'
})

const activeCategoryObj = computed(() => {
  if (!activeCategory.value) return null
  return settings.value.categories.find(cat => cat.id === activeCategory.value)
})

const totalItems = computed(() => {
  return cart.value.reduce((total, item) => total + item.quantity, 0)
})

const cartSubtotal = computed(() => {
  return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const cartTax = computed(() => {
  return cartSubtotal.value * TAX_RATE
})

const cartTotal = computed(() => {
  return cartSubtotal.value + cartTax.value
})

// Methods
const initializeMenuTitles = () => {
  if (settings.value) {
    if (!settings.value.menuTitle) {
      settings.value.menuTitle = {}
    }
    if (!settings.value.menuTitle[props.lang]) {
      settings.value.menuTitle[props.lang] = ''
    }
    if (!settings.value.menuSubtitle) {
      settings.value.menuSubtitle = {}
    }
    if (!settings.value.menuSubtitle[props.lang]) {
      settings.value.menuSubtitle[props.lang] = ''
    }
  }
}

const loadCartFromStorage = () => {
  if (isCartLoaded.value) return

  if (process.client) {
    const savedCart = localStorage.getItem('restaurantMenuCart')
    if (savedCart) {
      try {
        cart.value = JSON.parse(savedCart)
        isCartLoaded.value = true
      } catch (e) {
      }
    }
  }
}

const initializeActiveCategory = () => {
  if (isCategoryView.value && sortedCategories.value.length > 0 && !activeCategory.value) {
    activeCategory.value = sortedCategories.value[0].id
  }
}

const getItemsByCategory = (categoryId) => {
  if (!settings.value.menuItems) return []
  return settings.value.menuItems.filter(item => item.categoryId === categoryId)
}

const getMenuItemsByCategory = (categoryId) => {
  return getItemsByCategory(categoryId)
}

const setActiveCategory = (categoryId) => {
  activeCategory.value = categoryId
}

const openItemModal = (item) => {
  selectedItem.value = item
  itemQuantity.value = 1
  itemNotes.value = ''
  showItemModal.value = true
  if (process.client) {
    document.body.classList.add('overflow-hidden')
  }
}

const closeItemModal = () => {
  showItemModal.value = false
  if (process.client) {
    document.body.classList.remove('overflow-hidden')
  }
}

const updateItemQuantity = (quantity) => {
  itemQuantity.value = quantity
}

const updateItemNotes = (notes) => {
  itemNotes.value = notes
}

const toggleCart = () => {
  if (!isCartLoaded.value) {
    loadCartFromStorage()
  }

  showCart.value = !showCart.value
  if (process.client) {
    if (showCart.value) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }
}

const closeCart = () => {
  showCart.value = false
  if (process.client) {
    document.body.classList.remove('overflow-hidden')
  }
}

const handleKeyEvents = (e) => {
  if (e.key === 'Escape') {
    if (showItemModal.value) closeItemModal()
    if (showCart.value) closeCart()
  }
}

const addToCart = () => {
  if (!selectedItem.value) return

  const newItem = {
    id: selectedItem.value.id,
    name: selectedItem.value.name,
    price: selectedItem.value.price,
    quantity: itemQuantity.value,
    notes: itemNotes.value
  }

  closeItemModal()

  nextTick(() => {
    const existingItemIndex = cart.value.findIndex(item =>
      item.id === newItem.id && item.notes === newItem.notes
    )

    if (existingItemIndex !== -1) {
      cart.value[existingItemIndex].quantity += newItem.quantity
    } else {
      cart.value.push(newItem)
    }

    debouncedSaveCart()

    setTimeout(() => {
      showCart.value = true
    }, 100)
  })
}

const removeFromCart = (index) => {
  cart.value.splice(index, 1)
  debouncedSaveCart()
}

const incrementCartItem = (index) => {
  cart.value[index].quantity++
  debouncedSaveCart()
}

const decrementCartItem = (index) => {
  if (cart.value[index].quantity > 1) {
    cart.value[index].quantity--
    debouncedSaveCart()
  }
}

const debouncedSaveCart = debounce(() => {
  if (process.client) {
    localStorage.setItem('restaurantMenuCart', JSON.stringify(cart.value))
  }
}, 300)

const checkout = () => {
  alert('Your order has been placed!')
  cart.value = []
  debouncedSaveCart()
  closeCart()
}

// Watchers
watch(() => settings.value, () => {
  initializeActiveCategory()
  initializeMenuTitles()
}, { deep: true })

watch(() => props.lang, () => {
  initializeMenuTitles()
})

// Lifecycle hooks
onMounted(() => {
  initializeActiveCategory()
  initializeMenuTitles()

  // Initialize settings properties
  if (settings.value) {
    if (!settings.value.socialMedia) {
      settings.value.socialMedia = {
        instagram: '',
        facebook: '',
        tiktok: '',
        twitter: '',
        youtube: ''
      }
    }

    if (typeof settings.value.showWhatsApp === 'undefined') {
      settings.value.showWhatsApp = false
    }

    if (!settings.value.whatsappNumber) {
      settings.value.whatsappNumber = ''
    }

    if (!settings.value.whatsappMessage) {
      settings.value.whatsappMessage = {}
    }

    if (settings.value.whatsappMessage && !settings.value.whatsappMessage[props.lang]) {
      settings.value.whatsappMessage[props.lang] = 'Hello! I would like to reserve a table.'
    }
  }

  nextTick(() => {
    if (process.client) {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadCartFromStorage)
      } else {
        setTimeout(loadCartFromStorage, 200)
      }
    }
  })

  if (process.client) {
    document.addEventListener('keydown', handleKeyEvents)
  }

  const sectionsThemeComponents = null
  sectionsThemeComponents?.(props.section.name, [
    {
      id: 'global',
      name: useI18n().t('sectionsBuilder.globalSettings'),
      path: '/theme/global_settings'
    }
  ])
})

onBeforeUnmount(() => {
  if (process.client) {
    document.removeEventListener('keydown', handleKeyEvents)
  }
})
</script>
