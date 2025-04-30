<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50" @click="$emit('close')">
    <div
      class="absolute right-0 top-0 h-full bg-white w-full max-w-md overflow-y-auto shadow-xl transform transition-transform duration-300"
      @click.stop>
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">{{ $t('RestaurantMenu.cart') || 'Your Cart' }}</h2>
          <div @click="$emit('close')" class="p-2 rounded-full hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" width="24" height="24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <!-- Empty cart message -->
        <div v-if="cart.length === 0" class="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" width="64" height="64">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="text-gray-600">{{ $t('RestaurantMenu.emptyCart') || 'Your cart is empty' }}</p>
          <div @click="$emit('close')"
            class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
            {{ $t('RestaurantMenu.startOrdering') || 'Start Ordering' }}
          </div>
        </div>

        <!-- Cart items -->
        <div v-else>
          <div v-for="(item, index) in cart" :key="`cart-item-${index}`" class="border-b py-4">
            <div class="flex justify-between">
              <div class="flex-1">
                <div class="flex justify-between items-center">
                  <h4 class="font-medium">{{ item.name[lang] }}</h4>
                  <div @click="$emit('remove', index)" class="text-red-500 hover:text-red-700 hover:cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" width="20" height="20">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                </div>
                <div class="flex items-center justify-between mt-2">
                  <div class="flex items-center">
                    <span class="text-gray-600 mr-2">{{ $t('RestaurantMenu.qty') || 'Qty' }}:</span>
                    <div class="flex items-center">
                      <div @click="$emit('decrement', index)"
                        class="px-2 py-0.5 border rounded-l bg-gray-100 hover:bg-gray-200 text-sm cursor-pointer">
                        -
                      </div>
                      <span class="px-2 py-0.5 border-t border-b text-sm">{{ item.quantity }}</span>
                      <div @click="$emit('increment', index)"
                        class="px-2 py-0.5 border rounded-r bg-gray-100 hover:bg-gray-200 text-sm cursor-pointer">
                        +
                      </div>
                    </div>
                  </div>
                  <div class="font-medium">
                    {{ currencySymbol }}{{ formatPrice(item.price * item.quantity) }}
                  </div>
                </div>
                <div v-if="item.notes" class="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {{ item.notes }}
                </div>
              </div>
            </div>
          </div>

          <!-- Order summary -->
          <div class="mt-4 pt-4 border-t">
            <div class="flex justify-between mb-2">
              <span>{{ $t('RestaurantMenu.subtotal') || 'Subtotal' }}:</span>
              <span class="font-medium">{{ currencySymbol }}{{ formatPrice(subtotal) }}</span>
            </div>
            
            <!-- Only show tax if it's enabled -->
            <div v-if="enableTax" class="flex justify-between mb-4">
              <span>{{ $t('RestaurantMenu.tax') || 'Tax' }} ({{ (taxRate * 100).toFixed(2) }}%):</span>
              <span class="font-medium">{{ currencySymbol }}{{ formatPrice(tax) }}</span>
            </div>
            
            <div class="flex justify-between text-lg font-bold">
              <span>{{ $t('RestaurantMenu.total') || 'Total' }}:</span>
              <span>{{ currencySymbol }}{{ formatPrice(total) }}</span>
            </div>
          </div>

          <!-- Checkout button -->
          <div @click="$emit('checkout')"
            class="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 mt-6 flex justify-center items-center">
            {{ $t('RestaurantMenu.checkout') || 'Checkout' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    lang: {
      type: String,
      default: 'en'
    }
  },
  computed: {
    subtotal() {
      return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    tax() {
      return this.enableTax ? this.subtotal * this.taxRate : 0;
    },
    total() {
      return this.subtotal + this.tax;
    }
  },
  methods: {
    formatPrice(price) {
      return (Math.round(price * 100) / 100).toFixed(2);
    }
  }
}
</script>

<style scoped>
/* Simplified styles for better performance */
</style>