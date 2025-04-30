<template>
  <div class="fixed inset-0 cart-modal-overlay z-50" @click="$emit('close')">
    <div class="absolute right-0 top-0 h-full cart-sidebar w-full max-w-md overflow-y-auto shadow-xl" @click.stop>
      <div class="cart-container">
        <div class="cart-header">
          <h2 class="cart-title">{{ isService ?
            $t('ServicePackages.yourCart') :
            $t('RestaurantMenu.cart') }}</h2>
          <div @click="$emit('close')" class="cart-close-button">
            <svg xmlns="http://www.w3.org/2000/svg" class="cart-close-icon" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" width="24" height="24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <!-- Empty cart message -->
        <div v-if="cart.length === 0" class="empty-cart-message">
          <!-- Different icon based on type -->
          <svg v-if="isService" xmlns="http://www.w3.org/2000/svg" class="empty-cart-icon" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" width="64" height="64">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="empty-cart-icon" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" width="64" height="64">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p>{{ isService ?
            $t('ServicePackages.emptyCart') :
            $t('RestaurantMenu.emptyCart') }}</p>
          <div @click="$emit('close')" class="empty-cart-button"
            :class="isService ? 'service-theme' : 'restaurant-theme'">
            {{ isService ?
              $t('ServicePackages.startBooking') :
              $t('RestaurantMenu.startOrdering') }}
          </div>
        </div>

        <!-- Cart items -->
        <div v-else class="cart-items-container">
          <!-- Loop through cart items -->
          <div v-for="(item, index) in cart" :key="`cart-item-${index}`" class="cart-item">
            <!-- Item header with name and remove button -->
            <div class="cart-item-header flex justify-between items-center">
              <h3 class="cart-item-name">{{ item.name[lang] }}</h3>
              <button @click="$emit('remove', index)" class="cart-item-remove">
                <svg xmlns="http://www.w3.org/2000/svg" class="cart-remove-icon" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <!-- Service-specific date and time information -->
            <div v-if="isService && (item.date || item.timeSlot)" class="cart-item-details">
              <div v-if="item.date" class="cart-item-date">
                <strong>{{ $t('ServicePackages.date') }}:</strong> {{ formatDate(item.date) }}
              </div>
              <div v-if="item.timeSlot" class="cart-item-time">
                <strong>{{ $t('ServicePackages.time') }}:</strong> {{ item.timeSlot }}
              </div>
            </div>

            <!-- Item quantity and price row -->
            <div class="cart-item-controls flex justify-between items-center">
              <!-- Quantity controls -->
              <div class="quantity-control-wrapper">
                <label class="cart-item-label">{{ $t(isService ? 'ServicePackages.qty' : 'RestaurantMenu.qty')
                  }}:</label>
                <div class="cart-qty-control">
                  <button @click="$emit('decrement', index)" class="cart-qty-minus">
                    −
                  </button>
                  <span class="cart-qty-value">{{ item.quantity }}</span>
                  <button @click="$emit('increment', index)" class="cart-qty-plus">
                    +
                  </button>
                </div>
              </div>

              <!-- Item price -->
              <div class="cart-price-wrapper">
                <!-- Service with discounted price -->
                <div v-if="isService && item.hasDiscount" class="cart-discounted-price">
                  <span class="cart-item-price-original">{{ currencySymbol }}{{ formatPrice(item.price *
                    item.quantity) }}</span>
                  <span class="cart-item-price-discounted">{{ currencySymbol }}{{ formatPrice(item.discountedPrice *
                    item.quantity) }}</span>
                </div>
                <!-- Regular pricing -->
                <div v-else class="cart-item-price">
                  {{ currencySymbol }}{{ formatPrice(item.price * item.quantity) }}
                </div>
              </div>
            </div>

            <!-- Special notes/requests -->
            <div v-if="item.notes" class="cart-item-notes">
              {{ item.notes }}
            </div>
          </div>

          <!-- Order summary -->
          <div class="cart-summary">
            <div class="cart-subtotal">
              <span class="cart-subtotal-label">{{ isService ?
                $t('ServicePackages.subtotal') :
                $t('RestaurantMenu.subtotal') }}:</span>
              <span class="cart-subtotal-value">{{ currencySymbol }}{{ formatPrice(subtotal) }}</span>
            </div>

            <!-- Service fee (for services only) -->
            <div v-if="isService && enableServiceFee" class="cart-service-fee">
              <span class="cart-summary-label">{{ $t('ServicePackages.serviceFee') }} ({{ (serviceFeeRate *
                100).toFixed(2)
                }}%):</span>
              <span class="cart-summary-value">{{ currencySymbol }}{{ formatPrice(serviceFee) }}</span>
            </div>

            <!-- Tax (if enabled) -->
            <div v-if="enableTax" class="cart-tax">
              <span class="cart-summary-label">{{ isService ?
                $t('ServicePackages.tax') :
                $t('RestaurantMenu.tax') }} ({{ (taxRate * 100).toFixed(2) }}%):</span>
              <span class="cart-summary-value">{{ currencySymbol }}{{ formatPrice(tax) }}</span>
            </div>

            <!-- Total -->
            <div class="cart-total">
              <span class="cart-total-label">{{ isService ?
                $t('ServicePackages.total') :
                $t('RestaurantMenu.total') }}:</span>
              <span class="cart-total-value">{{ currencySymbol }}{{ formatPrice(total) }}</span>
            </div>
          </div>

          <!-- Checkout button -->
          <button @click="$emit('checkout')" class="checkout-button"
            :class="isService ? 'service-theme' : 'restaurant-theme'">
            {{ isService ?
              $t('ServicePackages.completeBooking') :
              $t('RestaurantMenu.checkout') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatPrice } from '@/utils/constants';

export default {
  name: 'ShoppingCart',
  props: {
    cart: {
      type: Array,
      required: true
    },
    currencySymbol: {
      type: String,
      default: '$'
    },
    taxRate: {
      type: Number,
      default: 0.1
    },
    enableTax: {
      type: Boolean,
      default: true
    },
    serviceFeeRate: {
      type: Number,
      default: 0.05 // 5% service fee (for services only)
    },
    enableServiceFee: {
      type: Boolean,
      default: false // Only used for services
    },
    lang: {
      type: String,
      default: 'en'
    },
    type: {
      type: String,
      default: 'restaurant', // 'restaurant' or 'service'
      validator: value => ['restaurant', 'service'].includes(value)
    }
  },
  computed: {
    isService() {
      return this.type === 'service';
    },
    subtotal() {
      return this.cart.reduce((total, item) => {
        // Use discounted price for service items if available
        const price = (this.isService && item.hasDiscount) ? (item.discountedPrice || item.price) : item.price;
        return total + (price * item.quantity);
      }, 0);
    },
    serviceFee() {
      return (this.isService && this.enableServiceFee) ? this.subtotal * this.serviceFeeRate : 0;
    },
    tax() {
      return this.enableTax ? (this.subtotal + this.serviceFee) * this.taxRate : 0;
    },
    total() {
      return this.subtotal + this.serviceFee + this.tax;
    }
  },
  methods: {
    formatPrice,
    formatDate(dateString) {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (e) {
        return dateString;
      }
    }
  }
}
</script>