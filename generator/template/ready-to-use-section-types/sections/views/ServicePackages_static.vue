<template>
  <div v-if="settings" class="service-packages py-2.5" :class="[settings.classes, `business-${settings.businessType}`]"
    :style="{ backgroundColor: settings.backgroundColor || 'transparent' }">
    <div class="md:px-4">
      <!-- Business Logo -->
      <div v-if="settings.logo && settings.logo.url" class="text-center mb-6">
        <NuxtImg :src="settings.logo.url" :alt="settings.logo.seo_tag || 'Business Logo'"
          class="h-24 object-contain mx-auto" width="96" height="96" preload fetchpriority="high" quality="80"
          format="webp" fit="contain" />
      </div>

      <!-- Page Title and Subtitle -->
      <div class="mb-4 md:mb-8">
        <h2 v-if="settings.pageTitle && settings.pageTitle[lang]" class="menu-title mb-2 flex justify-center">
          {{ settings.pageTitle[lang] }}
        </h2>
        <p v-if="isInitialRenderComplete && settings.pageSubtitle && settings.pageSubtitle[lang]"
          class="menu-subtitle flex justify-center">
          {{ settings.pageSubtitle[lang] }}
        </p>
      </div>

      <!-- Shopping Cart Icon -->
      <CartIcon :total-items="totalItems" cart-type="service" @click="toggleCart" />

      <div style="display: none;" aria-hidden="true">
        <SocialLinks :links="[]" :show-whats-app="false" :whatsapp-number="''" :i18n="$t" :whatsapp-message="getWhatsAppMessage()"
          :cart="[]" :lang="lang" />
        <CategoryTabs :categories="[]" :active-category="''" :lang="lang" type="service" />
        <CategoryList :categories="[]" :get-items-by-category="getEmptyItems" :currency-symbol="'$'" :lang="lang"
          type="service" />
        <ItemsGrid :items="[]" :currency-symbol="'$'" :lang="lang" type="service" />
      </div>

      <div v-if="isInitialRenderComplete">
        <SocialLinks :links="socialMediaLinks" :show-whats-app="!!settings.showWhatsApp"
          :whatsapp-number="settings.whatsappNumber || ''"
          :whatsapp-message="settings.whatsappMessage && settings.whatsappMessage[lang] || ''" :cart="cart" :lang="lang" :i18n="$t"
          :type="'service'" />

        <!-- Category View Mode -->
        <div v-if="isCategoryView" class="service-content">
          <!-- Category Navigation Tabs -->
          <CategoryTabs :categories="sortedCategories" :active-category="activeCategory" :lang="lang" type="service"
            @select-category="setActiveCategory" />

          <!-- Active Category Description -->
          <div v-if="activeCategoryObj && activeCategoryObj.description && activeCategoryObj.description[lang]"
            class="mb-6 text-center">
            <p class="category-description">{{ activeCategoryObj.description[lang] }}</p>
          </div>

          <!-- Service Items for Active Category -->
          <ItemsGrid :items="getServiceItemsByCategory(activeCategory)" :currency-symbol="settings.currencySymbol"
            :lang="lang" type="service" @item-click="openItemModal" />
        </div>

        <!-- List View Mode -->
        <div v-else class="service-content">
          <CategoryList :categories="sortedCategories" :get-items-by-category="getItemsByCategory"
            :currency-symbol="settings.currencySymbol" :lang="lang" type="service" @item-click="openItemModal" />
        </div>
      </div>
      <div v-else class="loading-placeholder">
        <!-- Placeholder content while JavaScript initializes -->
        <div class="animate-pulse mb-8">
          <!-- Category header placeholder -->
          <div class="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div class="h-px w-full bg-gray-200 mb-8"></div>

          <!-- Service items placeholder -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <div class="flex">
              <div class="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0"></div>
              <div class="ml-4 flex-grow">
                <div class="h-5 bg-gray-200 rounded w-2/5 mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div class="flex flex-col items-end justify-start ml-4">
                <div class="h-5 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Item Modal -->
    <ItemModal v-if="showItemModal" :item="selectedItem" :currency-symbol="settings.currencySymbol" :lang="lang"
      :quantity="itemQuantity" :notes="itemNotes" :selected-date="selectedDate" :selected-time-slot="selectedTimeSlot"
      type="service" :show-date-time-pickers="showDateTimePickers" @close="closeItemModal"
      @update-quantity="updateItemQuantity" @update-notes="updateItemNotes" @update-date="updateSelectedDate"
      @update-time-slot="updateSelectedTimeSlot" @add-to-cart="addToCart" />

    <!-- Shopping Cart Sidebar - Load on demand -->
    <ShoppingCart v-if="showCart" :cart="cart" :currency-symbol="settings.currencySymbol"
      :tax-rate="settings.taxRate ? settings.taxRate / 100 : TAX_RATE"
      :enable-tax="settings.enableTax !== undefined ? settings.enableTax : true"
      :service-fee-rate="settings.serviceFeeRate ? settings.serviceFeeRate / 100 : SERVICE_FEE_RATE"
      :enable-service-fee="settings.enableServiceFee !== undefined ? settings.enableServiceFee : true" :lang="lang" :i18n="$t"
      type="service" :whatsapp-enabled="!!settings.showWhatsApp && !!settings.whatsappNumber"
      :whatsapp-number="settings.whatsappNumber || ''" @close="closeCart" @increment="incrementCartItem"
      @decrement="decrementCartItem" @remove="removeFromCart" @checkout="checkout" />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

// Import shared components
import CartIcon from '../../components/UnifiedMenu/CartIcon.vue'
import SocialLinks from '../../components/UnifiedMenu/SocialLinks.vue'

// Dynamically import shared components (these will be async imports in Nuxt 3)
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
    type: Object,
    default: () => ({
      settings: [
        {
          logo: 'image',
          pageTitle: {
            en: 'Our Services',
            fr: 'Nos Services'
          },
          pageSubtitle: {
            en: 'Book your next experience with us',
            fr: 'Réservez votre prochaine expérience avec nous'
          },
          categories: [
            {
              id: 'category-id',
              name: {
                en: 'Category Name',
                fr: 'Nom de la catégorie'
              },
              description: {
                en: 'Category Description',
                fr: 'Description de la catégorie'
              },
              classes: '',
              icon: 'image'
            }
          ],
          serviceItems: [
            {
              id: 'item-id',
              categoryId: 'category-id',
              name: {
                en: 'Item Name',
                fr: 'Nom du service'
              },
              description: {
                en: 'Item Description',
                fr: 'Description du service'
              },
              price: 10.99,
              duration: '1 hour',
              details: [
                {
                  en: 'Detail point 1',
                  fr: 'Point de détail 1'
                }
              ],
              image: 'image',
              availability: 'available',
              featured: false,
              classes: ''
            }
          ],
          currencySymbol: '$',
          classes: '',
          backgroundColor: '#ffffff',
          viewMode: 'list',
          businessType: 'travel',
          enableTax: true,
          taxRate: 10.00,
          enableServiceFee: true,
          serviceFeeRate: 5.00
        }
      ]
    })
  },
  showDateTimePickers: {
    type: Boolean,
    default: true
  }
})

// Reactive data
const isInitialRenderComplete = ref(false)
const cart = ref([])
const showCart = ref(false)
const showItemModal = ref(false)
const selectedItem = ref(null)
const itemQuantity = ref(1)
const itemNotes = ref('')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const selectedTimeSlot = ref('')
const activeCategory = ref('')
const isCartLoaded = ref(false)

// Constants
const TAX_RATE = 0.10
const SERVICE_FEE_RATE = 0.05

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

const settings = computed(() => {
  if (!props.section || !props.section.settings) {
    return {
      categories: [],
      serviceItems: [],
      viewMode: 'list',
      businessType: 'travel',
      socialMedia: {},
      showWhatsApp: false,
      whatsappNumber: '',
      whatsappMessage: {},
      pageTitle: {},
      pageSubtitle: {},
      currencySymbol: '$',
      menuTitle: {},
      menuSubtitle: {}
    }
  }

  let settingsData
  if (Array.isArray(props.section.settings)) {
    settingsData = props.section.settings[0] || {}
  } else {
    settingsData = props.section.settings || {}
  }

  // Ensure required properties exist
  if (!settingsData.socialMedia) settingsData.socialMedia = {}
  if (typeof settingsData.showWhatsApp === 'undefined') settingsData.showWhatsApp = false
  if (!settingsData.whatsappNumber) settingsData.whatsappNumber = ''
  if (!settingsData.whatsappMessage) settingsData.whatsappMessage = {}
  if (!settingsData.pageTitle) settingsData.pageTitle = {}
  if (!settingsData.pageSubtitle) settingsData.pageSubtitle = {}
  if (!settingsData.menuTitle) settingsData.menuTitle = {}
  if (!settingsData.menuSubtitle) settingsData.menuSubtitle = {}
  if (!settingsData.categories) settingsData.categories = []
  if (!settingsData.serviceItems) settingsData.serviceItems = []

  return settingsData
})

const sortedCategories = computed(() => {
  if (!settings.value || !settings.value.categories) return []
  return [...settings.value.categories]
})

const isCategoryView = computed(() => {
  return settings.value.viewMode === 'category'
})

const activeCategoryObj = computed(() => {
  if (!activeCategory.value) return null
  return settings.value.categories.find(cat => cat.id === activeCategory.value)
})

const totalItems = computed(() => {
  return cart.value.reduce((total, item) => total + item.quantity, 0)
})

const cartSubtotal = computed(() => {
  return cart.value.reduce((total, item) => {
    const price = item.hasDiscount ? (item.discountedPrice || item.price) : item.price
    return total + (price * item.quantity)
  }, 0)
})

const cartServiceFee = computed(() => {
  return settings.value.enableServiceFee ? cartSubtotal.value * (settings.value.serviceFeeRate / 100 || SERVICE_FEE_RATE) : 0
})

const cartTax = computed(() => {
  return settings.value.enableTax ? (cartSubtotal.value + cartServiceFee.value) * (settings.value.taxRate / 100 || TAX_RATE) : 0
})

const cartTotal = computed(() => {
  return cartSubtotal.value + cartServiceFee.value + cartTax.value
})

// Methods
const getEmptyItems = () => {
  return []
}

const getWhatsAppMessage = () => {
  if (settings.value && settings.value.whatsappMessage &&
    settings.value.whatsappMessage[props.lang]) {
    return settings.value.whatsappMessage[props.lang]
  }
  return 'Hello! I would like to book a service.'
}

const initializeActiveCategory = () => {
  if (isCategoryView.value && sortedCategories.value.length > 0 && !activeCategory.value) {
    activeCategory.value = sortedCategories.value[0].id
  }
}

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
    const savedCart = localStorage.getItem('servicePackagesCart')
    if (savedCart) {
      try {
        cart.value = JSON.parse(savedCart)
        isCartLoaded.value = true
      } catch (e) {
      }
    }
  }
}

// Fixed: Return array directly, not a function
const getItemsByCategory = (categoryId) => {
  if (!settings.value || !settings.value.serviceItems) return []
  return settings.value.serviceItems.filter(item => item.categoryId === categoryId)
}

const getServiceItemsByCategory = (categoryId) => {
  return getItemsByCategory(categoryId)
}

const setActiveCategory = (categoryId) => {
  activeCategory.value = categoryId
}

const openItemModal = (item) => {
  selectedItem.value = item
  itemQuantity.value = 1
  itemNotes.value = ''
  selectedDate.value = new Date().toISOString().split('T')[0]
  selectedTimeSlot.value = ''
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

const updateSelectedDate = (date) => {
  selectedDate.value = date
}

const updateSelectedTimeSlot = (timeSlot) => {
  selectedTimeSlot.value = timeSlot
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
    hasDiscount: selectedItem.value.hasDiscount,
    discountedPrice: selectedItem.value.discountedPrice,
    quantity: itemQuantity.value,
    notes: itemNotes.value,
    date: props.showDateTimePickers ? selectedDate.value : null,
    timeSlot: props.showDateTimePickers ? selectedTimeSlot.value : null,
    duration: selectedItem.value.duration
  }

  closeItemModal()

  nextTick(() => {
    const existingItemIndex = findExistingCartItem(newItem)

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

const findExistingCartItem = (newItem) => {
  if (props.showDateTimePickers) {
    return cart.value.findIndex(item =>
      item.id === newItem.id &&
      item.date === newItem.date &&
      item.timeSlot === newItem.timeSlot &&
      item.notes === newItem.notes
    )
  } else {
    return cart.value.findIndex(item =>
      item.id === newItem.id && item.notes === newItem.notes
    )
  }
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
    localStorage.setItem('servicePackagesCart', JSON.stringify(cart.value))
  }
}, 300)

const checkout = () => {
  alert('Your booking has been confirmed!')
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

watch(() => cart.value, () => {
  debouncedSaveCart()
}, { deep: true })

// Lifecycle hooks
onMounted(() => {
  initializeActiveCategory()
  initializeMenuTitles()

  nextTick(() => {
    if (process.client) {
      window.requestAnimationFrame(() => {
        isInitialRenderComplete.value = true
      })
    }
  })

  if (process.client) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        loadCartFromStorage()
      })
    } else {
      setTimeout(() => {
        loadCartFromStorage()
      }, 500)
    }

    document.addEventListener('keydown', handleKeyEvents)
  }
})

onBeforeUnmount(() => {
  if (process.client) {
    document.removeEventListener('keydown', handleKeyEvents)
  }
})
</script>