<template>
  <div class="fixed inset-0 cart-modal-overlay z-50" @click="$emit('close')">
    <div
      class="absolute right-0 top-0 h-full cart-sidebar w-full max-w-md overflow-y-auto shadow-xl"
      @click.stop
    >
      <div class="cart-container">
        <div class="cart-header flex justify-between items-center">
          <h2 class="cart-title">
            {{
              isService
                ? $t('ServicePackages.yourCart')
                : $t('RestaurantMenu.cart')
            }}
          </h2>
          <div @click="$emit('close')" class="cart-close-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="cart-close-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="24"
              height="24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <!-- Empty cart message -->
        <div
          v-if="cart.length === 0"
          class="empty-cart-message flex flex-col items-center"
        >
          <!-- Different icon based on type -->
          <svg
            v-if="isService"
            xmlns="http://www.w3.org/2000/svg"
            class="empty-cart-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="64"
            height="64"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="empty-cart-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="64"
            height="64"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p>
            {{
              isService
                ? $t('ServicePackages.emptyCart')
                : $t('RestaurantMenu.emptyCart')
            }}
          </p>
          <div
            @click="$emit('close')"
            class="empty-cart-button"
            :class="isService ? 'service-theme' : 'restaurant-theme'"
          >
            {{
              isService
                ? $t('ServicePackages.startBooking')
                : $t('RestaurantMenu.startOrdering')
            }}
          </div>
        </div>

        <!-- Cart items -->
        <div v-else class="cart-items-container flex flex-col gap-4">
          <!-- Loop through cart items -->
          <div
            v-for="(item, index) in cart"
            :key="`cart-item-${index}`"
            class="cart-item"
          >
            <!-- Item header with name and remove button -->
            <div
              class="cart-item-header flex justify-between items-center mb-3"
            >
              <h3 class="cart-item-name">{{ getItemName(item) }}</h3>
              <button @click="$emit('remove', index)" class="cart-item-remove">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="cart-remove-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            <!-- Item quantity and price row -->
            <div class="cart-item-controls flex justify-between items-center">
              <!-- Quantity controls -->
              <div class="quantity-control-wrapper flex items-center">
                <label class="cart-item-label qty-label"
                  >{{
                    isService
                      ? $t('ServicePackages.qty')
                      : $t('RestaurantMenu.qty')
                  }}:</label
                >
                <div class="cart-qty-control">
                  <button
                    @click="$emit('decrement', index)"
                    class="cart-qty-minus"
                  >
                    −
                  </button>
                  <span class="cart-qty-value">{{ item.quantity }}</span>
                  <button
                    @click="$emit('increment', index)"
                    class="cart-qty-plus"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Item price -->
              <div class="cart-price-wrapper">
                <!-- Service with discounted price -->
                <div
                  v-if="isService && item.hasDiscount"
                  class="cart-discounted-price"
                >
                  <span class="cart-item-price-original"
                    >{{ currencySymbol
                    }}{{ formatPrice(item.price * item.quantity) }}</span
                  >
                  <span class="cart-item-price-discounted"
                    >{{ currencySymbol
                    }}{{
                      formatPrice(item.discountedPrice * item.quantity)
                    }}</span
                  >
                </div>
                <!-- Regular pricing -->
                <div v-else class="cart-item-price">
                  {{ currencySymbol
                  }}{{ formatPrice(item.price * item.quantity) }}
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
            <div class="cart-subtotal mb-3 flex justify-between">
              <h3 class="cart-subtotal-label">
                {{
                  isService
                    ? $t('ServicePackages.subtotal')
                    : $t('RestaurantMenu.subtotal')
                }}:
              </h3>
              <span class="cart-subtotal-value"
                >{{ currencySymbol }}{{ formatPrice(subtotal) }}</span
              >
            </div>

            <!-- Service fee (for services only) -->
            <div
              v-if="isService && enableServiceFee"
              class="cart-service-fee mb-3 flex justify-between"
            >
              <h3 class="cart-summary-label">
                {{ $t('ServicePackages.serviceFee') }} ({{
                  (serviceFeeRate * 100).toFixed(2)
                }}%):
              </h3>
              <span class="cart-summary-value"
                >{{ currencySymbol }}{{ formatPrice(serviceFee) }}</span
              >
            </div>

            <!-- Tax (if enabled) -->
            <div v-if="enableTax" class="cart-tax mb-3 flex justify-between">
              <h3 class="cart-summary-label">
                {{
                  isService
                    ? $t('ServicePackages.tax')
                    : $t('RestaurantMenu.tax')
                }}
                ({{ (taxRate * 100).toFixed(2) }}%):
              </h3>
              <span class="cart-summary-value"
                >{{ currencySymbol }}{{ formatPrice(tax) }}</span
              >
            </div>

            <!-- Total -->
            <div class="cart-total my-3 flex justify-between items-center">
              <h3 class="cart-total-label">
                {{
                  isService
                    ? $t('ServicePackages.total')
                    : $t('RestaurantMenu.total')
                }}:
              </h3>
              <h3 class="cart-total-value">
                {{ currencySymbol }}{{ formatPrice(total) }}
              </h3>
            </div>
          </div>

          <div v-if="cart.length > 0" class="checkout-buttons w-full">
            <!-- WhatsApp checkout button when WhatsApp is enabled -->
            <a
              v-if="whatsappEnabled"
              :href="whatsappUrl"
              target="_blank"
              rel="noopener"
              class="whatsapp-checkout-button w-full flex items-center justify-center"
              :class="isService ? 'service-theme' : 'restaurant-theme'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
                class="mr-2"
              >
                <path
                  d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"
                />
              </svg>
              {{
                isService
                  ? $t('ServicePackages.orderViaWhatsApp')
                  : $t('RestaurantMenu.orderViaWhatsApp')
              }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<i18n src="../../sections/forms/ServicePackages_i18n.json"></i18n>
<i18n src="../../sections/forms/RestaurantMenu_i18n.json"></i18n>

<script setup>
import { computed } from 'vue'
import { formatPrice, generateWhatsAppMessage } from '@/utils/constants'

const { t: $t } = useI18n({ useScope: 'local' })

const props = defineProps({
  cart: {
    type: Array,
    required: true,
  },
  currencySymbol: {
    type: String,
    default: '$',
  },
  taxRate: {
    type: Number,
    default: 0.1,
  },
  enableTax: {
    type: Boolean,
    default: true,
  },
  serviceFeeRate: {
    type: Number,
    default: 0.05, // 5% service fee (for services only)
  },
  enableServiceFee: {
    type: Boolean,
    default: false, // Only used for services
  },
  lang: {
    type: String,
    default: 'en',
  },
  type: {
    type: String,
    default: 'restaurant', // 'restaurant' or 'service'
    validator: (value) => ['restaurant', 'service'].includes(value),
  },
  // Add WhatsApp related props
  whatsappEnabled: {
    type: Boolean,
    default: false,
  },
  whatsappNumber: {
    type: String,
    default: '',
  },
  whatsappMessage: {
    type: String,
    default: '',
  },
  i18n: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits([
  'close',
  'remove',
  'increment',
  'decrement',
  'checkout',
])

// Computed properties
const isService = computed(() => props.type === 'service')

const subtotal = computed(() => {
  return props.cart.reduce((total, item) => {
    // Use discounted price for service items if available
    const price =
      isService.value && item.hasDiscount
        ? item.discountedPrice || item.price
        : item.price
    return total + price * item.quantity
  }, 0)
})

const serviceFee = computed(() => {
  return isService.value && props.enableServiceFee
    ? subtotal.value * props.serviceFeeRate
    : 0
})

const tax = computed(() => {
  return props.enableTax
    ? (subtotal.value + serviceFee.value) * props.taxRate
    : 0
})

const total = computed(() => {
  return subtotal.value + serviceFee.value + tax.value
})

const whatsappUrl = computed(() => {
  if (!props.whatsappNumber) return '#'

  const phoneNumber = props.whatsappNumber.replace(/[^0-9+]/g, '')

  const message = generateWhatsAppMessage(
    props.cart,
    props.type,
    props.lang,
    props.i18n,
    props.currencySymbol,
    total.value,
  )

  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
})

// Methods
const getItemName = (item) => {
  if (typeof item.name === 'object') {
    return item.name[props.lang] || item.name.en || 'Item'
  }
  return item.name || 'Item'
}

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (e) {
    return dateString
  }
}
</script>

<style scoped>
.cart-sidebar {
  background-color: var(--bg-color);
}
</style>
