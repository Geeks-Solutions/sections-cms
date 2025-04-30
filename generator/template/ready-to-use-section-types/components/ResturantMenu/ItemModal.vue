<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-lg w-full">
      <div class="relative">
        <!-- Close button - positioned absolute -->
        <div @click="$emit('close')"
          class="absolute top-3 right-3 z-10 close-modal-btn p-2 rounded-full bg-gray-200 bg-opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <!-- Item image - with explicit dimensions -->
        <div v-if="item && item.image && item.image.url" class="w-full h-40">
          <img :src="item.image.url" :alt="item.image.seo_tag || (item.name && item.name[lang])"
            class="w-full h-full object-cover rounded-t-lg" width="400" height="160" />
        </div>

        <!-- Item details -->
        <div class="p-4">
          <div v-if="item" class="mb-3">
            <h3 class="text-lg font-bold mb-1">{{ item.name[lang] }}</h3>
            <p class="text-gray-700 text-sm mb-1">{{ item.description[lang] }}</p>
            <div class="text-lg font-semibold">
              {{ currencySymbol }}{{ formatPrice(item.price) }}
            </div>
          </div>

          <!-- Quantity selector -->
          <div class="flex items-center mb-3">
            <label class="mr-2 font-medium text-sm">{{ $t('RestaurantMenu.quantity') || 'Quantity' }}:</label>
            <div class="flex items-center">
              <div @click="decrementQuantity" class="px-2 h-8 border-2 border-gray-300 rounded-l bg-gray-100">
                -
              </div>
              <input type="number" :value="localQuantity" min="1" @input="updateQuantity($event.target.value)"
                class="w-10 h-8 border-y-2 border-gray-300 text-center p-0 text-sm" />
              <div @click="incrementQuantity" class="px-2 h-8 border-2 border-gray-300 rounded-r bg-gray-100">
                +
              </div>
            </div>
          </div>

          <!-- Special instructions -->
          <div class="mb-4">
            <label class="block font-medium text-sm mb-1">{{ $t('RestaurantMenu.specialInstructions') }}:</label>
            <textarea :value="notes" @input="$emit('update-notes', $event.target.value)"
              class="w-full p-2 border rounded" rows="1"
              :placeholder="$t('RestaurantMenu.specialInstructionsPlaceholder') || 'Any special requests or allergies?'"></textarea>
          </div>

          <!-- Add to cart button -->
          <div @click="$emit('add-to-cart')"
            class="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex justify-center items-center">
            {{ $t('RestaurantMenu.addToCart') || 'Add to Cart' }}
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemModal',
  props: {
    item: {
      type: Object,
      required: true
    },
    currencySymbol: {
      type: String,
      default: ''
    },
    lang: {
      type: String,
      default: 'en'
    },
    quantity: {
      type: Number,
      default: 1
    },
    notes: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localQuantity: this.quantity
    };
  },
  watch: {
    quantity(newVal) {
      this.localQuantity = newVal;
    }
  },
  methods: {
    formatPrice(price) {
      return (Math.round(price * 100) / 100).toFixed(2);
    },
    decrementQuantity() {
      if (this.localQuantity > 1) {
        this.localQuantity--;
        this.$emit('update-quantity', this.localQuantity);
      }
    },
    incrementQuantity() {
      this.localQuantity++;
      this.$emit('update-quantity', this.localQuantity);
    },
    updateQuantity(value) {
      const qty = parseInt(value) || 1;
      this.localQuantity = qty < 1 ? 1 : qty;
      this.$emit('update-quantity', this.localQuantity);
    }
  }
}
</script>

<style scoped>
.close-modal-btn {
  border: none !important;
  margin-right: 0 !important;
  padding: 8px !important;
  border-radius: 9999px !important;
}
</style>