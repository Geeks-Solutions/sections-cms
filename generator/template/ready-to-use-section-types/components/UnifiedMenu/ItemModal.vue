<template>
  <div class="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="item-modal-content rounded-lg shadow-xl max-w-lg w-full" :class="{ 'max-w-2xl': isService }">
      <div class="relative">
        <!-- Close button -->
        <div @click="$emit('close')" class="modal-close-button absolute top-3 right-3 z-10 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <!-- Item image -->
        <div v-if="item && item.image && item.image.url" :class="isService ? 'h-64' : 'h-52'">
          <NuxtImg :src="item.image.url" :alt="item.image.seo_tag || (item.name && item.name[lang])"
            class="modal-image w-full h-full object-cover rounded-t-lg" width="400" height="160" :modifiers="{
              width: 400,
              height: 160,
              fit: 'cover'
            }" />
        </div>

        <div class="p-6">
          <!-- Item header -->
          <div class="flex flex-col justify-between items-start mb-2">
            <h3 class="modal-item-name">{{ item.name[lang] }}</h3>
            <div class="flex items-center ">
              <!-- Original price if discounted -->
              <span v-if="isService && item.hasDiscount" class="item-price-regular line-through mr-2">{{
                formatPrice(item.price) }}</span>
              <!-- Current price -->
              <span class="modal-item-price mr-2">{{ currencySymbol }}{{ formatPrice(isService &&
                item.hasDiscount ?
                item.discountedPrice : item.price) }}</span>
              <div v-if="isService && item.hasDiscount && calculateDiscountPercentage(item) > 0"
                class="badge-discount inline-block rounded-full px-3 py-1 ">
                {{ calculateDiscountPercentage(item) }}% OFF
              </div>
            </div>
          </div>

          <!-- Item description -->
          <p class="modal-item-description mb-2">{{ item.description[lang] }}</p>

          <!-- Item features as bullet points - FIXED HEIGHT SCROLLABLE LIST -->
          <div v-if="isService && item.details && item.details.length > 0" class="mb-4">
            <ul class="feature-list overflow-y-auto max-h-[61px] lg:max-h-[87px]">
              <li v-for="(detail, index) in item.details" :key="index" class="feature-list-item">
                {{ typeof detail === 'object' ? detail[lang] : detail }}
              </li>
            </ul>
          </div>
          <div v-else-if="isService" class="mb-4">
            <ul class="feature-list overflow-y-auto max-h-[61px] lg:max-h-[200px]">
              <li v-if="item.duration && item.duration[lang] != ''" class="feature-list-item">
                {{ typeof item.duration === 'object' ? item.duration[lang] : item.duration }} service
              </li>
              <li v-for="(feature, index) in parseFeatures(item.description[lang])" :key="index"
                class="feature-list-item">
                {{ feature }}
              </li>
            </ul>
          </div>

          <!-- Date picker for services -->
          <!-- <div v-if="isService && showDateTimePickers" class="mb-4">
            <label class="input-label block mb-2">Select Date:</label>
            <input 
              type="date" 
              :value="selectedDate" 
              @input="updateDate($event.target.value)"
              :min="minDate"
              class="w-full p-3 border rounded-lg"
            />
          </div> -->

          <!-- Time slot picker for services -->
          <!-- <div v-if="isService && showDateTimePickers" class="mb-4">
            <label class="input-label block mb-2">Select Time:</label>
            <select 
              :value="selectedTimeSlot" 
              @change="updateTimeSlot($event.target.value)"
              class="w-full p-3 border rounded-lg"
            >
              <option value="">Choose a time slot</option>
              <option v-for="slot in timeSlots" :key="slot" :value="slot">{{ slot }}</option>
            </select>
          </div> -->

          <!-- Quantity control - Updated to match mockup -->
          <div class="flex items-center mb-2">
            <label class="input-label mr-4">{{ isService ? 'Quantity' : 'Quantity' }}:</label>
            <div class="custom-quantity-control flex items-center">
              <button @click="decrementQuantity" class="item-qty-minus flex items-center justify-center rounded-full">
                −
              </button>
              <input type="text" :value="localQuantity" min="1" @input="updateQuantity($event.target.value)"
                class="item-qty-value w-12 text-center" readonly />
              <button @click="incrementQuantity" class="item-qty-plus flex items-center justify-center rounded-full">
                +
              </button>
            </div>
          </div>

          <!-- Special instructions - Updated styling -->
          <div class="mb-4">
            <label class="input-label block mb-2">{{ isService ? 'Special Requests' : 'Special Instructions' }}:</label>
            <textarea :value="notes" @input="$emit('update-notes', $event.target.value)"
              class="special-request-textarea p-4 border rounded-lg w-full"
              :placeholder="isService ? 'Any special requests for your service...' : 'Any special instructions...'"></textarea>
          </div>

          <!-- Add to cart button - Updated to match mockup -->
          <button @click="addToCart" class="add-to-cart-button w-full py-4 rounded-lg flex justify-center items-center"
            :class="{ 'add-to-cart-service': isService, 'add-to-cart-restaurant': !isService }">
            {{ isService ? 'Add to Cart' : 'Add to Cart' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { formatPrice } from "@/utils/constants"

const props = defineProps({
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
})

const emit = defineEmits([
  'close',
  'update-quantity',
  'update-notes',
  'update-date',
  'update-time-slot',
  'add-to-cart'
])

// Reactive data
const localQuantity = ref(props.quantity)
const timeSlots = ref(['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'])
const minDate = ref(new Date().toISOString().split('T')[0]) // Today's date as minimum

// Computed properties
const isService = computed(() => props.type === 'service')



const calculateDiscountPercentage = (item) => {
  if (!item.hasDiscount || !item.price || !item.discountedPrice) return 0
  const originalPrice = parseFloat(item.price)
  const discountedPrice = parseFloat(item.discountedPrice)
  if (originalPrice <= 0 || discountedPrice >= originalPrice) return 0
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

const decrementQuantity = () => {
  if (localQuantity.value > 1) {
    localQuantity.value--
    emit('update-quantity', localQuantity.value)
  }
}

const incrementQuantity = () => {
  localQuantity.value++
  emit('update-quantity', localQuantity.value)
}

const updateQuantity = (value) => {
  const qty = parseInt(value) || 1
  localQuantity.value = qty < 1 ? 1 : qty
  emit('update-quantity', localQuantity.value)
}

const updateDate = (date) => {
  emit('update-date', date)
}

const updateTimeSlot = (slot) => {
  emit('update-time-slot', slot)
}

const parseFeatures = (description) => {
  // A helper method to parse features from description if no details provided
  if (!description) return []

  // Try to split by periods, commas, or bullet points
  let features = description.split(/[.•]/)
  features = features.filter(item => item.trim().length > 0)

  // If we have reasonable features, return them
  if (features.length > 1) {
    return features.map(f => f.trim())
  }

  // Otherwise return empty array - we'll just show the description
  return []
}

const addToCart = () => {
  // Validation for service bookings with date/time
  if (isService.value && props.showDateTimePickers) {
    if (!props.selectedDate) {
      alert('Please select a date for your service')
      return
    }
    // Uncomment if time slot is required
    // if (!props.selectedTimeSlot && timeSlots.value.length > 0) {
    //   alert('Please select a time slot for your service')
    //   return
    // }
  }

  emit('add-to-cart')
}

// Watch for quantity prop changes
watch(() => props.quantity, (newVal) => {
  localQuantity.value = newVal
})
</script>

<style scoped>
.item-modal-content {
  background-color: var(--bg-color);
}
</style>