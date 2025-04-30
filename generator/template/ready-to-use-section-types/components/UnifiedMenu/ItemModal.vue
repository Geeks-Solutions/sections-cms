<template>
  <div class="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-lg w-full" :class="{ 'max-w-2xl': isService }">
      <div class="relative">
        <!-- Close button -->
        <div @click="$emit('close')"
          class="modal-close-button absolute top-3 right-3 z-10 p-2 rounded-full hover:cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <!-- Item image -->
        <div v-if="item && item.image && item.image.url" :class="isService ? 'h-64' : 'h-52'">
          <img :src="item.image.url" :alt="item.image.seo_tag || (item.name && item.name[lang])"
            class="modal-image w-full h-full object-cover rounded-t-lg" width="400" height="160" />
        </div>

        <div class="p-6">
          <!-- Item header -->
          <div class="flex justify-between items-start mb-4">
            <h3 class="modal-item-name text-xl">{{ item.name[lang] }}</h3>
            <div class="flex items-baseline">
              <!-- Original price if discounted -->
              <span v-if="isService && item.hasDiscount" class="item-price-regular text-sm mr-2">${{
                formatPrice(item.price) }}</span>
              <!-- Current price -->
              <span class="modal-item-price text-xl">{{ currencySymbol }}{{ formatPrice(isService && item.hasDiscount ?
                item.discountedPrice : item.price) }}</span>
            </div>
          </div>

          <!-- Discount badge -->
          <div v-if="isService && item.hasDiscount && calculateDiscountPercentage(item) > 0"
            class="badge-discount inline-block mb-3 rounded-full px-3 py-1 text-sm">
            {{ calculateDiscountPercentage(item) }}% OFF
          </div>

          <!-- Item description -->
          <p class="modal-item-description mb-4">{{ item.description[lang] }}</p>

          <!-- Item features as bullet points -->
          <ul v-if="isService && item.details && item.details.length > 0" class="mb-6 list-disc pl-5">
            <li v-for="(detail, index) in item.details" :key="index" class="mb-1">
              {{ detail[lang] }}
            </li>
          </ul>
          <ul v-else-if="isService" class="mb-6 list-disc pl-5">
            <li v-if="item.duration" class="mb-1">{{ item.duration }} service</li>
            <li v-for="(feature, index) in parseFeatures(item.description[lang])" :key="index" class="mb-1">
              {{ feature }}
            </li>
          </ul>

          <!-- Date & Time pickers for services -->
          <!-- <template v-if="isService && showDateTimePickers">
            <div class="mb-4">
              <label class="block mb-1 text-sm">{{ $t('ServicePackages.selectDate') }}:</label>
              <input type="date" :value="selectedDate" @input="updateDate($event.target.value)"
                class="w-full p-2 border rounded" :min="minDate" />
            </div>

            <div v-if="timeSlots.length > 0" class="mb-6">
              <label class="block mb-1 text-sm">{{ $t('ServicePackages.selectTime') }}:</label>
              <div class="grid grid-cols-3 gap-2">
                <div v-for="(slot, index) in timeSlots" :key="index"
                  class="time-slot text-center p-2 border rounded cursor-pointer text-sm"
                  :class="{ 'time-slot-selected': selectedTimeSlot === slot }" @click="updateTimeSlot(slot)">
                  {{ slot }}
                </div>
              </div>
            </div>
          </template> -->

          <!-- Quantity control -->
          <div class="flex items-center mb-4">
            <label class="mr-2 text-sm">{{ $t(isService ? 'ServicePackages.quantity' : 'RestaurantMenu.quantity')
              }}:</label>
            <div class="flex items-center justify-center">
              <button @click="decrementQuantity"
                class="quantity-button w-8 h-8 border flex items-center justify-center rounded-l">
                -
              </button>
              <input type="number" :value="localQuantity" min="1" @input="updateQuantity($event.target.value)"
                class="w-12 h-8 border-t border-b text-center p-0" />
              <button @click="incrementQuantity"
                class="quantity-button w-8 h-8 border flex items-center justify-center rounded-r">
                +
              </button>
            </div>
          </div>

          <!-- Special instructions -->
          <div class="mb-6">
            <label class="block mb-1 text-sm">{{ $t(isService ? 'ServicePackages.specialRequests' :
              'RestaurantMenu.specialInstructions') }}:</label>
            <textarea :value="notes" @input="$emit('update-notes', $event.target.value)"
              class="w-full p-2 border rounded" rows="2"
              :placeholder="$t(isService ? 'ServicePackages.specialRequestsPlaceholder' : 'RestaurantMenu.specialInstructionsPlaceholder')"></textarea>
          </div>

          <!-- Add to cart button -->
          <button @click="addToCart" class="add-to-cart-button w-full py-3 rounded-lg flex justify-center items-center"
            :class="{ 'add-to-cart-service': isService, 'add-to-cart-restaurant': !isService }">
            {{ $t(isService ? 'ServicePackages.addToCart' : 'RestaurantMenu.addToCart') }}
          </button>
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
      default: '$'
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
    },
    selectedDate: {
      type: String,
      default: ''
    },
    selectedTimeSlot: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'restaurant', // 'restaurant' or 'service'
      validator: value => ['restaurant', 'service'].includes(value)
    },
    showDateTimePickers: {
      type: Boolean,
      default: false // Only show date/time pickers when explicitly enabled
    }
  },
  data() {
    return {
      localQuantity: this.quantity,
      timeSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'],
      minDate: new Date().toISOString().split('T')[0] // Today's date as minimum
    };
  },
  computed: {
    isService() {
      return this.type === 'service';
    }
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
    calculateDiscountPercentage(item) {
      if (!item.hasDiscount || !item.price || !item.discountedPrice) return 0;
      const originalPrice = parseFloat(item.price);
      const discountedPrice = parseFloat(item.discountedPrice);
      if (originalPrice <= 0 || discountedPrice >= originalPrice) return 0;
      return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
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
    },
    updateDate(date) {
      this.$emit('update-date', date);
    },
    updateTimeSlot(slot) {
      this.$emit('update-time-slot', slot);
    },
    parseFeatures(description) {
      // A helper method to parse features from description if no details provided
      if (!description) return [];

      // Try to split by periods, commas, or bullet points
      let features = description.split(/[.•]/);
      features = features.filter(item => item.trim().length > 0);

      // If we have reasonable features, return them
      if (features.length > 1) {
        return features.map(f => f.trim());
      }

      // Otherwise return empty array - we'll just show the description
      return [];
    },
    addToCart() {
      // Validation for service bookings with date/time
      if (this.isService && this.showDateTimePickers) {
        if (!this.selectedDate) {
          alert(this.$t('ServicePackages.selectDateRequired'));
          return;
        }

        if (!this.selectedTimeSlot && this.timeSlots.length > 0) {
          alert(this.$t('ServicePackages.selectTimeRequired'));
          return;
        }
      }

      this.$emit('add-to-cart');
    }
  }
}
</script>