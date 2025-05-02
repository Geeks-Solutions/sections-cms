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
            <div class="flex justify-between">
              <h3 class="text-lg font-bold mb-1">{{ item.name[lang] }}</h3>
              <div class="flex flex-col items-end">
                <div class="text-lg font-semibold">
                  {{ currencySymbol }}{{ formatPrice(item.price) }}
                </div>
                <div v-if="item.duration" class="text-sm text-gray-600">
                  {{ item.duration }}
                </div>
              </div>
            </div>
            <p class="text-gray-700 text-sm mb-1">{{ item.description[lang] }}</p>
            
            <!-- Additional Service Details -->
            <div v-if="item.details" class="mt-2 mb-3 text-sm">
              <div v-for="(detail, index) in item.details" :key="index" class="flex items-start mb-1">
                <div class="text-blue-500 mr-2">•</div>
                <div>{{ detail[lang] }}</div>
              </div>
            </div>
            
            <!-- Availability info -->
            <div v-if="item.availability === 'limited'" class="mt-2 mb-3 bg-orange-100 p-2 rounded text-sm text-orange-800">
              {{ $t('ServicePackages.limitedAvailabilityNote') || 'This service has limited availability. Book soon to secure your spot.' }}
            </div>
          </div>

          <!-- Date picker for services -->
          <div v-if="showDatePicker" class="mb-3">
            <label class="block font-medium text-sm mb-1">{{ $t('ServicePackages.selectDate') || 'Select Date' }}:</label>
            <input type="date" :value="selectedDate" @input="updateDate($event.target.value)"
              class="w-full p-2 border rounded" :min="minDate" />
          </div>

          <!-- Time slot selector for services -->
          <div v-if="showTimeSlots && timeSlots.length > 0" class="mb-3">
            <label class="block font-medium text-sm mb-1">{{ $t('ServicePackages.selectTime') || 'Select Time' }}:</label>
            <div class="grid grid-cols-3 gap-2">
              <div v-for="(slot, index) in timeSlots" :key="index"
                class="text-center p-2 border rounded cursor-pointer text-sm"
                :class="selectedTimeSlot === slot ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'"
                @click="updateTimeSlot(slot)">
                {{ slot }}
              </div>
            </div>
          </div>

          <!-- Quantity selector -->
          <div class="flex items-center mb-3">
            <label class="mr-2 font-medium text-sm">{{ $t('ServicePackages.quantity') || 'Quantity' }}:</label>
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
            <label class="block font-medium text-sm mb-1">{{ $t('ServicePackages.specialRequests') || 'Special Requests' }}:</label>
            <textarea :value="notes" @input="$emit('update-notes', $event.target.value)"
              class="w-full p-2 border rounded" rows="1"
              :placeholder="$t('ServicePackages.specialRequestsPlaceholder') || 'Any special requests or accommodations?'"></textarea>
          </div>

          <!-- Book service button -->
          <div @click="addToCart"
            class="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex justify-center items-center">
            {{ $t('ServicePackages.bookNow') || 'Book Now' }}
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
    }
  },
  data() {
    return {
      localQuantity: this.quantity,
      showDatePicker: true, // Show date picker for most services
      showTimeSlots: true, // Show time slots for most services
      timeSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'],
      minDate: new Date().toISOString().split('T')[0] // Today's date as minimum
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
    },
    updateDate(date) {
      this.$emit('update-date', date);
    },
    updateTimeSlot(slot) {
      this.$emit('update-time-slot', slot);
    },
    addToCart() {
      if (!this.selectedDate && this.showDatePicker) {
        alert(this.$t('ServicePackages.selectDateRequired') || 'Please select a date');
        return;
      }
      
      if (!this.selectedTimeSlot && this.showTimeSlots && this.timeSlots.length > 0) {
        alert(this.$t('ServicePackages.selectTimeRequired') || 'Please select a time slot');
        return;
      }
      
      this.$emit('add-to-cart');
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