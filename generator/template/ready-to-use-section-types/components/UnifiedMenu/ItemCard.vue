<template>
  <div class="menu-item flex flex-col md:flex-row cursor-pointer" :class="[
    item.classes,
    { 'featured': item.featured },
    { 'menu-item-restaurant': type === 'restaurant' },
    { 'menu-item-service': type === 'service' }
  ]" @click="$emit('item-click', item)">

    <!-- Item Image -->
    <div v-if="item.image && item.image.url" class="item-image-wrapper md:mr-4 mb-4 md:mb-0 flex-shrink-0">
      <GUniversalViewer :src="item.image.url" :alt="item.image.seo_tag || item.name[lang]"
        :type="item.image.metadata?.type || 'image'" class="w-full md:w-20 h-auto md:h-20 max-h-40 object-cover rounded"
        width="80" height="80" preload fetchpriority="high" />
    </div>

    <!-- Item Content -->
    <div class="item-content flex-grow">
      <div class="flex flex-col md:flex-row justify-between md:items-start">
        <!-- Item Name and Description in a column -->
        <div class="flex flex-col flex-grow md:mr-4 mb-2 md:mb-0">
          <h4 class="item-name mb-0.5">{{ item.name[lang] }}</h4>
          <div v-if="item.description && item.description[lang]">
            <p :class="['item-description', { 'item-description-expanded': !showItemDetails && isExpanded(item.id) }]">
              {{ item.description[lang] }}
            </p>
            <span v-if="!showItemDetails && shouldShowReadMore(item.description[lang])"
              class="text-blue-600 hover:text-blue-800 cursor-pointer font-medium text-sm"
              @click.stop="$emit('item-click', item)">
              {{ isExpanded(item.id) ? 'Read less' : 'Read more' }}
            </span>
          </div>

          <!-- Variant prices display -->
          <div v-if="!isService && item.hasVariants && item.variants && item.variants.length > 0" class="mt-2">
            <div class="flex flex-wrap gap-2">
              <span v-for="variant in item.variants" :key="variant.id"
                class="variant-price-button px-2 py-1 rounded-md text-xs border">
                {{ variant.name[lang] }} - {{ currencySymbol }}{{ formatPrice(variant.price, currencySymbol) }}
              </span>
            </div>
          </div>

          <div class="flex flex-wrap mt-1.5">
            <!-- Featured badge -->
            <div v-if="item.featured">
              <div class="badge badge-featured inline-block px-2 py-1 rounded mr-2 mb-2"
                :class="{ 'badge-restaurant': type === 'restaurant', 'badge-service': type === 'service' }">
                {{ isService ? $t('ServicePackages.featuredItem') : $t('RestaurantMenu.specialItem') }}
              </div>
            </div>
            <!-- Availability badge for service items -->
            <div v-if="isService && item.availability === 'limited'">
              <div class="badge badge-availability inline-block px-2 py-1 rounded mr-2 mb-2">
                {{ $t('ServicePackages.limitedAvailability') }}
              </div>
            </div>
            <!-- Discount badge for service items -->
            <div v-if="isService && item.hasDiscount && calculateDiscountPercentage(item) > 0">
              <div class="badge badge-discount inline-block px-2 py-1 rounded-full">
                {{ calculateDiscountPercentage(item) }}% OFF
              </div>
            </div>
          </div>
        </div>

        <!-- Price, Duration Column -->
        <div class="flex flex-col md:items-end flex-shrink-0">
          <div class="flex items-center">
            <!-- Pricing for service items with potential discount -->
            <div v-if="isService && item.hasDiscount" class="item-price">
              <div class="flex md:flex-col md:items-end">
                <span class="item-price-regular line-through mr-2 md:mr-0">{{ currencySymbol }}{{
                  formatPrice(item.price, currencySymbol) }}</span>
                <span class="item-price-discounted">{{ currencySymbol }}{{ formatPrice(item.discountedPrice,
                  currencySymbol)
                  }}</span>
              </div>
            </div>
            <!-- Standard pricing for items (with variant support) -->
            <div v-else class="item-price">
              {{ currencySymbol }}{{ getItemPriceDisplay(item) }}
            </div>
          </div>

          <!-- Duration on same row -->
          <div class="flex items-center mt-1">
            <!-- Duration for services -->
            <div v-if="isService && item.duration" class="item-duration">
              {{ typeof item.duration === 'object' ? item.duration[lang] : item.duration }}
            </div>
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
import { formatPrice } from '@/utils/constants'

const { t: $t } = useI18n({ useScope: 'local' })

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
  type: {
    type: String,
    default: 'restaurant',
    validator: value => ['restaurant', 'service'].includes(value)
  },
  showItemDetails: {
    type: Boolean,
    default: true
  },
  expandedItems: {
    type: Set,
    default: () => new Set()
  }
})

defineEmits(['item-click'])

// Computed properties
const isService = computed(() => props.type === 'service')

// Get price display for an item (handles variants)
const getItemPriceDisplay = (item) => {
  // For items with variants, show price range
  if (!isService.value && item.hasVariants && item.variants && item.variants.length > 0) {
    const prices = item.variants.map(v => parseFloat(v.price)).filter(p => !isNaN(p))
    if (prices.length > 0) {
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      if (minPrice === maxPrice) {
        return formatPrice(minPrice, props.currencySymbol)
      }
      return `${formatPrice(minPrice, props.currencySymbol)} - ${formatPrice(maxPrice, props.currencySymbol)}`
    }
  }
  // For items without variants, show regular price
  return formatPrice(item.price, props.currencySymbol)
}

const shouldShowReadMore = (text) => {
  return text && text.length > 100
}

const isExpanded = (itemId) => {
  return props.expandedItems.has(itemId)
}

const calculateDiscountPercentage = (item) => {
  if (!item.hasDiscount || !item.price || !item.discountedPrice) return 0
  const originalPrice = parseFloat(item.price)
  const discountedPrice = parseFloat(item.discountedPrice)
  if (originalPrice <= 0 || discountedPrice >= originalPrice) return 0
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}
</script>