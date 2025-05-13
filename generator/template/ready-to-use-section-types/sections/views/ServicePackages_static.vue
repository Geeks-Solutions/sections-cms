<template>
  <div v-if="settings" class="service-packages py-2.5" :class="[settings.classes, `business-${settings.businessType}`]"
    :style="{ backgroundColor: settings.backgroundColor || 'transparent' }">
    <div class="md:px-4">
      <!-- Business Logo -->
      <div v-if="settings.logo && settings.logo.url" class="text-center mb-6">
        <nuxt-img :src="settings.logo.url" :alt="settings.logo.seo_tag || 'Business Logo'"
          class="h-24 object-contain mx-auto" width="96" height="96" loading="eager" quality="80" format="webp"
          fit="contain" />
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
        <SocialLinks :links="[]" :show-whats-app="false" :whatsapp-number="''" :whatsapp-message="getWhatsAppMessage()"
          :cart="[]" :lang="lang" />
        <CategoryTabs :categories="[]" :active-category="''" :lang="lang" type="service" />
        <CategoryList :categories="[]" :get-items-by-category="getEmptyItems" :currency-symbol="'$'" :lang="lang"
          type="service" />
        <ItemsGrid :items="[]" :currency-symbol="'$'" :lang="lang" type="service" />
      </div>

      <div v-if="isInitialRenderComplete">
        <SocialLinks :links="socialMediaLinks" :show-whats-app="!!settings.showWhatsApp"
          :whatsapp-number="settings.whatsappNumber || ''"
          :whatsapp-message="settings.whatsappMessage && settings.whatsappMessage[lang] || ''" :cart="cart" :lang="lang"
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
      :enable-service-fee="settings.enableServiceFee !== undefined ? settings.enableServiceFee : true" :lang="lang"
      type="service" :whatsapp-enabled="!!settings.showWhatsApp && !!settings.whatsappNumber"
      :whatsapp-number="settings.whatsappNumber || ''" @close="closeCart" @increment="incrementCartItem"
      @decrement="decrementCartItem" @remove="removeFromCart" @checkout="checkout" />
  </div>
</template>

<script>
// Import shared components
import CartIcon from '../../components/UnifiedMenu/CartIcon.vue';
import SocialLinks from '../../components/UnifiedMenu/SocialLinks.vue';
// Import utils if available, otherwise define the function locally

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
            },
            {
              id: 'category-id1',
              name: {
                en: 'Category Name',
                fr: 'Nom de la catégorie'
              },
              description: {
                en: '',
                fr: ''
              },
              classes: '',
              icon: 'image'
            },
            {
              id: 'category-id1',
              name: {
                en: 'Category Name',
                fr: 'Nom de la catégorie'
              },
              description: {
                en: '',
                fr: ''
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
            },
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
            },
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
            },
            {
              id: 'item-id',
              categoryId: 'category-id1',
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
      isInitialRenderComplete: false,
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
      if (!this.settings || !this.settings.categories) return [];

      // Return categories in their original order without sorting by order property
      return [...this.settings.categories];
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
  watch: {
    settings: {
      handler() {
        // Re-initialize when settings change
        this.initializeActiveCategory();
        this.initializeMenuTitles();
      },
      deep: true
    },

    // Watch for section settings changes directly
    "section.settings": {
      handler() {
        // Re-initialize when settings change
        this.initializeActiveCategory();
        this.initializeMenuTitles();
      },
      deep: true
    },

    // Watch for language changes
    lang() {
      this.initializeMenuTitles();
    },
    cart: {
      handler(newCart) {
        // Update localStorage whenever cart changes
        this.debouncedSaveCart();
      },
      deep: true
    }
  },
  created() {
    // Set initial active category if in category view mode
    this.initializeActiveCategory();
    this.initializeMenuTitles();
  },
  mounted() {
    // Activate initial render after hydration
    this.$nextTick(() => {
      // Use requestAnimationFrame to prioritize rendering
      window.requestAnimationFrame(() => {
        this.isInitialRenderComplete = true;
      });
    });

    // Defer cart loading until after initial render
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        this.loadCartFromStorage();
      });
    } else {
      setTimeout(() => {
        this.loadCartFromStorage();
      }, 500);
    }

    // Set up event listeners
    document.addEventListener('keydown', this.handleKeyEvents);
  },
  beforeDestroy() {
    // Clean up event listeners
    document.removeEventListener('keydown', this.handleKeyEvents);
  },
  methods: {
    // Fix #1: Add the missing empty items helper
    getEmptyItems() {
      return [];
    },

    // Fix #2: Handle whatsappMessage type issue
    getWhatsAppMessage() {
      // Fix the whatsappMessage type by returning a string
      if (this.settings && this.settings.whatsappMessage &&
        this.settings.whatsappMessage[this.lang]) {
        return this.settings.whatsappMessage[this.lang];
      }
      return 'Hello! I would like to book a service.';
    },
    initializeActiveCategory() {
      if (this.isCategoryView && this.sortedCategories.length > 0 && !this.activeCategory) {
        this.activeCategory = this.sortedCategories[0].id;
      }
    },
    initializeMenuTitles() {
      if (this.settings) {
        // Initialize menuTitle if it doesn't exist
        if (!this.settings.menuTitle) {
          this.$set(this.settings, 'menuTitle', {});
        }

        // Initialize menuTitle for the current language
        if (!this.settings.menuTitle[this.lang]) {
          this.$set(this.settings.menuTitle, this.lang, '');
        }

        // Initialize menuSubtitle if it doesn't exist
        if (!this.settings.menuSubtitle) {
          this.$set(this.settings, 'menuSubtitle', {});
        }

        // Initialize menuSubtitle for the current language
        if (!this.settings.menuSubtitle[this.lang]) {
          this.$set(this.settings.menuSubtitle, this.lang, '');
        }
      }
    },
    // Load cart from storage (deferred)
    loadCartFromStorage() {
      if (this.isCartLoaded) return;

      const savedCart = localStorage.getItem('servicePackagesCart');
      if (savedCart) {
        try {
          this.cart = JSON.parse(savedCart);
          this.isCartLoaded = true;
        } catch (e) {
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
    }
  }
};
</script>
