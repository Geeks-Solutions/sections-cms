<template>
  <div v-if="settings" class="service-packages py-2.5" :class="[settings.classes, `business-${settings.businessType}`]"
    :style="{ backgroundColor: settings.backgroundColor || 'transparent' }">
    <div class="px-4">
      <!-- Business Logo -->
      <div v-if="settings.logo && settings.logo.url" class="text-center mb-6">
        <img :src="settings.logo.url" :alt="settings.logo.seo_tag || 'Business Logo'"
          class="h-24 object-contain mx-auto" width="96" height="96" loading="lazy" />
      </div>

      <!-- Page Title and Subtitle -->
      <div class="text-center mb-8">
        <h2 v-if="settings.pageTitle && settings.pageTitle[lang]" class="text-3xl font-bold mb-2">
          {{ settings.pageTitle[lang] }}
        </h2>
        <p v-if="settings.pageSubtitle && settings.pageSubtitle[lang]" class="text-lg">
          {{ settings.pageSubtitle[lang] }}
        </p>
      </div>

      <SocialLinks :links="socialMediaLinks" :show-whats-app="!!settings.showWhatsApp"
        :whatsapp-number="settings.whatsappNumber || ''"
        :whatsapp-message="settings.whatsappMessage && settings.whatsappMessage[lang] || ''" :cart="cart"
        :lang="lang" />

      <!-- Shopping Cart Icon -->
      <CartIcon :total-items="totalItems" cart-type="service" @click="toggleCart" />

      <!-- Category View Mode -->
      <div v-if="isCategoryView" class="service-content">
        <!-- Category Navigation Tabs -->
        <CategoryTabs :categories="sortedCategories" :active-category="activeCategory" :lang="lang" type="service"
          @select-category="setActiveCategory" />

        <!-- Active Category Description -->
        <div v-if="activeCategoryObj && activeCategoryObj.description && activeCategoryObj.description[lang]"
          class="mb-6 text-center">
          <p class="text-gray-700">{{ activeCategoryObj.description[lang] }}</p>
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

    <!-- Item Modal -->
    <ItemModal v-if="showItemModal" :item="selectedItem" :currency-symbol="settings.currencySymbol" :lang="lang"
      :quantity="itemQuantity" :notes="itemNotes" :selected-date="selectedDate" :selected-time-slot="selectedTimeSlot"
      type="service" :show-date-time-pickers="showDateTimePickers" @close="closeItemModal"
      @update-quantity="updateItemQuantity" @update-notes="updateItemNotes" @update-date="updateSelectedDate"
      @update-time-slot="updateSelectedTimeSlot" @add-to-cart="addToCart" />

    <!-- Shopping Cart Sidebar -->
    <ShoppingCart v-if="showCart" :cart="cart" :currency-symbol="settings.currencySymbol"
      :tax-rate="settings.taxRate ? settings.taxRate / 100 : TAX_RATE"
      :enable-tax="settings.enableTax !== undefined ? settings.enableTax : true"
      :service-fee-rate="settings.serviceFeeRate ? settings.serviceFeeRate / 100 : SERVICE_FEE_RATE"
      :enable-service-fee="settings.enableServiceFee !== undefined ? settings.enableServiceFee : true" :lang="lang"
      type="service" @close="closeCart" @increment="incrementCartItem" @decrement="decrementCartItem"
      @remove="removeFromCart" @checkout="checkout" />
  </div>
</template>

<script>
// Import shared components
import CartIcon from '../../components/UnifiedMenu/CartIcon.vue';
import SocialLinks from '../../components/UnifiedMenu/SocialLinks.vue';

// Dynamically import shared components
const CategoryTabs = () => import('../../components/UnifiedMenu/CategoryTabs.vue');
const ItemsGrid = () => import('../../components/UnifiedMenu/ItemsGrid.vue');
const CategoryList = () => import('../../components/UnifiedMenu/CategoryList.vue');
const ItemModal = () => import('../../components/UnifiedMenu/ItemModal.vue');
const ShoppingCart = () => import('../../components/UnifiedMenu/ShoppingCart.vue');

// Utility functions for debouncing
const debounce = (fn, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

export default {
  name: 'ServicePackages',
  components: {
    CartIcon,
    SocialLinks,
    CategoryTabs,
    ItemsGrid,
    CategoryList,
    ItemModal,
    ShoppingCart
  },
  props: {
    section: {
      type: Object,
      default: () => { },
    },
    lang: {
      type: String,
      default: "en"
    },
    locales: {
      type: Array,
      default: () => [],
    },
    viewStructure: {
      settings: [
        {
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
              order: 0,
              icon: {
                media_id: '',
                url: '',
                seo_tag: ''
              }
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
              image: {
                media_id: '',
                url: '',
                seo_tag: ''
              },
              availability: 'available',
              featured: false,
              classes: ''
            }
          ],
          pageTitle: {
            en: 'Our Services',
            fr: 'Nos Services'
          },
          pageSubtitle: {
            en: 'Book your next experience with us',
            fr: 'Réservez votre prochaine expérience avec nous'
          },
          currencySymbol: '$',
          classes: '',
          logo: {
            media_id: '',
            url: '',
            seo_tag: ''
          },
          backgroundColor: '#ffffff',
          viewMode: 'list', // list or category
          businessType: 'travel', // travel, spa, or salon
          enableTax: true,
          taxRate: 10.00,
          enableServiceFee: true,
          serviceFeeRate: 5.00
        }
      ]
    },
    // Additional props specific to services
    showDateTimePickers: {
      type: Boolean,
      default: true // Enable date/time pickers by default
    }
  },
  data() {
    return {
      cart: [],
      showCart: false,
      showItemModal: false,
      selectedItem: null,
      itemQuantity: 1,
      itemNotes: '',
      selectedDate: new Date().toISOString().split('T')[0], // Default to today
      selectedTimeSlot: '',
      activeCategory: '',
      TAX_RATE: 0.10, // 10% tax rate
      SERVICE_FEE_RATE: 0.05, // 5% service fee rate
      isCartLoaded: false, // Track if cart has been loaded from storage
      socialIcons: {
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
    };
  },
  watch: {
    cart: {
      handler(newCart) {
        // Update localStorage whenever cart changes
        this.debouncedSaveCart();
      },
      deep: true
    }
  },
  computed: {
    socialMediaLinks() {
      // Default to empty array if no social media
      if (!this.settings || !this.settings.socialMedia) return [];

      // Convert settings.socialMedia to an array of link objects
      return Object.entries(this.settings.socialMedia || {})
        .filter(([platform, url]) => {
          // Filter out empty URLs and WhatsApp
          return platform !== 'whatsapp' &&
            url &&
            typeof url === 'string' &&
            url.trim() !== '';
        })
        .map(([platform, url]) => {
          // Get the icon classes
          const classes = (this.socialIcons[platform] || {}).classes || '';
          const hoverClasses = (this.socialIcons[platform] || {}).hoverClasses || '';

          return {
            type: platform,
            url,
            classes,
            hoverClasses
          };
        });
    },
    settings() {
      // Make sure section exists and has settings
      if (!this.section || !this.section.settings) {
        return {
          categories: [],
          serviceItems: [],
          viewMode: 'list', // Default value
          businessType: 'travel', // Default value
          socialMedia: {}, // Empty social media object
          showWhatsApp: false,
          whatsappNumber: '',
          whatsappMessage: {}
        };
      }

      // Return settings array item or direct settings object with defaults
      let settings;
      if (Array.isArray(this.section.settings)) {
        settings = this.section.settings[0] || {};
      } else {
        settings = this.section.settings || {};
      }

      // Ensure required properties exist
      if (!settings.socialMedia) settings.socialMedia = {};
      if (typeof settings.showWhatsApp === 'undefined') settings.showWhatsApp = false;
      if (!settings.whatsappNumber) settings.whatsappNumber = '';
      if (!settings.whatsappMessage) settings.whatsappMessage = {};

      return settings;
    },
    sortedCategories() {
      if (!this.settings.categories) return [];

      return [...this.settings.categories].sort((a, b) => {
        return (a.order || 0) - (b.order || 0);
      });
    },
    isCategoryView() {
      return this.settings.viewMode === 'category';
    },
    activeCategoryObj() {
      if (!this.activeCategory) return null;
      return this.settings.categories.find(cat => cat.id === this.activeCategory);
    },
    totalItems() {
      return this.cart.reduce((total, item) => total + item.quantity, 0);
    },
    cartSubtotal() {
      return this.cart.reduce((total, item) => {
        // Use discounted price if available
        const price = item.hasDiscount ? (item.discountedPrice || item.price) : item.price;
        return total + (price * item.quantity);
      }, 0);
    },
    cartServiceFee() {
      return this.settings.enableServiceFee ? this.cartSubtotal * (this.settings.serviceFeeRate / 100 || this.SERVICE_FEE_RATE) : 0;
    },
    cartTax() {
      return this.settings.enableTax ? (this.cartSubtotal + this.cartServiceFee) * (this.settings.taxRate / 100 || this.TAX_RATE) : 0;
    },
    cartTotal() {
      return this.cartSubtotal + this.cartServiceFee + this.cartTax;
    }
  },
  created() {
    // Set initial active category if in category view mode
    if (this.isCategoryView && this.sortedCategories.length > 0) {
      this.activeCategory = this.sortedCategories[0].id;
    }

    // Initialize socialMedia if it doesn't exist
    if (!this.settings.socialMedia) {
      this.settings.socialMedia = {};
    }

    // Initialize WhatsApp settings if they don't exist
    if (typeof this.settings.showWhatsApp === 'undefined') {
      this.settings.showWhatsApp = false;
    }

    if (!this.settings.whatsappNumber) {
      this.settings.whatsappNumber = '';
    }

    if (!this.settings.whatsappMessage) {
      this.settings.whatsappMessage = {};
    }

    // Initialize whatsappMessage for the current language if not set
    if (!this.settings.whatsappMessage[this.lang]) {
      this.$set(this.settings.whatsappMessage, this.lang, 'Hello! I would like to book a service.');
    }
  },
  mounted() {
    // Defer non-critical initialization
    this.$nextTick(() => {
      // Load cart using idle callback if available, or defer with setTimeout
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(this.loadCartFromStorage);
      } else {
        setTimeout(this.loadCartFromStorage, 200);
      }
    });

    // Use event delegation for keyboard events
    document.addEventListener('keydown', this.handleKeyEvents);
  },
  beforeDestroy() {
    // Clean up event listeners
    document.removeEventListener('keydown', this.handleKeyEvents);
  },
  methods: {
    // Load cart from storage (deferred)
    loadCartFromStorage() {
      if (this.isCartLoaded) return;

      const savedCart = localStorage.getItem('servicePackagesCart');
      if (savedCart) {
        try {
          this.cart = JSON.parse(savedCart);
          this.isCartLoaded = true;
        } catch (e) {
          console.error('Error loading cart from localStorage:', e);
        }
      }
    },
    // Optimized method to get items by category
    getItemsByCategory(categoryId) {
      if (!this.settings.serviceItems) return [];
      return this.settings.serviceItems.filter(item => item.categoryId === categoryId);
    },
    // Alias for consistency
    getServiceItemsByCategory(categoryId) {
      return this.getItemsByCategory(categoryId);
    },
    // Set active category (for category view)
    setActiveCategory(categoryId) {
      this.activeCategory = categoryId;
    },
    // Format price with better performance
    formatPrice(price) {
      return (Math.round(price * 100) / 100).toFixed(2);
    },
    // Item modal methods
    openItemModal(item) {
      this.selectedItem = item;
      this.itemQuantity = 1;
      this.itemNotes = '';
      this.selectedDate = new Date().toISOString().split('T')[0]; // Default to today
      this.selectedTimeSlot = '';
      this.showItemModal = true;
      document.body.classList.add('overflow-hidden');
    },
    closeItemModal() {
      this.showItemModal = false;
      document.body.classList.remove('overflow-hidden');
    },
    updateItemQuantity(quantity) {
      this.itemQuantity = quantity;
    },
    updateItemNotes(notes) {
      this.itemNotes = notes;
    },
    updateSelectedDate(date) {
      this.selectedDate = date;
    },
    updateSelectedTimeSlot(timeSlot) {
      this.selectedTimeSlot = timeSlot;
    },
    // Cart toggle methods
    toggleCart() {
      // Make sure cart is loaded before showing
      if (!this.isCartLoaded) {
        this.loadCartFromStorage();
      }

      this.showCart = !this.showCart;
      if (this.showCart) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    },
    closeCart() {
      this.showCart = false;
      document.body.classList.remove('overflow-hidden');
    },
    // Efficient event handling with delegation
    handleKeyEvents(e) {
      if (e.key === 'Escape') {
        if (this.showItemModal) this.closeItemModal();
        if (this.showCart) this.closeCart();
      }
    },
    // Cart operations
    addToCart() {
      if (!this.selectedItem) return;

      const newItem = {
        id: this.selectedItem.id,
        name: this.selectedItem.name,
        price: this.selectedItem.price,
        hasDiscount: this.selectedItem.hasDiscount,
        discountedPrice: this.selectedItem.discountedPrice,
        quantity: this.itemQuantity,
        notes: this.itemNotes,
        date: this.showDateTimePickers ? this.selectedDate : null,
        timeSlot: this.showDateTimePickers ? this.selectedTimeSlot : null,
        duration: this.selectedItem.duration
      };

      // Close modal first for better perceived performance
      this.closeItemModal();

      // Then update cart in next tick to avoid blocking the UI
      this.$nextTick(() => {
        // Check if item already exists in cart with same date/time
        const existingItemIndex = this.findExistingCartItem(newItem);

        if (existingItemIndex !== -1) {
          // Update existing item quantity
          this.cart[existingItemIndex].quantity += newItem.quantity;
        } else {
          // Add new item to cart
          this.cart.push(newItem);
        }

        // Save cart to localStorage with debounce
        this.debouncedSaveCart();

        // Show cart after a small delay for better UX
        setTimeout(() => {
          this.showCart = true;
        }, 100);
      });
    },
    // Find existing cart item
    findExistingCartItem(newItem) {
      if (this.showDateTimePickers) {
        // For services with date/time, check if same service is booked at the same time
        return this.cart.findIndex(item =>
          item.id === newItem.id &&
          item.date === newItem.date &&
          item.timeSlot === newItem.timeSlot &&
          item.notes === newItem.notes
        );
      } else {
        // For services without date/time, just check ID and notes
        return this.cart.findIndex(item =>
          item.id === newItem.id && item.notes === newItem.notes
        );
      }
    },
    removeFromCart(index) {
      this.cart.splice(index, 1);
      this.debouncedSaveCart();
    },
    incrementCartItem(index) {
      this.cart[index].quantity++;
      this.debouncedSaveCart();
    },
    decrementCartItem(index) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity--;
        this.debouncedSaveCart();
      }
    },
    // Debounced method to avoid excessive localStorage writes
    debouncedSaveCart: debounce(function () {
      localStorage.setItem('servicePackagesCart', JSON.stringify(this.cart));
    }, 300),
    checkout() {
      // Here you would typically integrate with a booking/payment system
      alert(this.$t('ServicePackages.bookingConfirmed') || 'Your booking has been confirmed!');
      this.cart = [];
      this.debouncedSaveCart();
      this.closeCart();
    },
    // Helper method to optimize images
    getOptimizedImage(url, width, height) {
      if (!url) return '';
      // This is a placeholder for an image optimization service
      return `${url}?width=${width}&height=${height}`;
    }
  }
}
</script>
<style>
/* Critical CSS only */
.service-packages {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Featured item styling */
.service-packages .featured {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
}

/* Basic service item styling */
.service-packages .service-item {
  border-radius: 0.25rem;
  padding: 1rem;
  transition: background-color 0.2s;
}

.service-packages .service-item:hover {
  background-color: #f9fafb;
}

/* Business type specific styling */
.service-packages.business-travel .featured {
  border-left-color: #3b82f6;
  /* Blue for travel */
}

.service-packages.business-spa .featured {
  border-left-color: #10b981;
  /* Green for spa */
}

.service-packages.business-salon .featured {
  border-left-color: #ec4899;
  /* Pink for salon */
}

.social-media-links svg {
  transition: transform 0.2s ease;
}

.social-media-links a:hover svg {
  transform: scale(1.1);
}
</style>