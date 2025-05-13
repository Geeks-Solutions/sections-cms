<template>
  <div class="category-container-query">
    <div class="item-grid">
      <div v-for="(item) in items" :key="`item-${item.id}`" class="menu-item flex flex-col md:flex-row cursor-pointer"
        :class="[
          item.classes,
          { 'featured': item.featured },
          { 'menu-item-restaurant': type === 'restaurant' },
          { 'menu-item-service': type === 'service' }
        ]" @click="$emit('item-click', item)">

        <!-- Item Image -->
        <div v-if="item.image && item.image.url" class="item-image-wrapper md:mr-4 mb-4 md:mb-0 flex-shrink-0">
          <nuxt-img :src="item.image.url" :alt="item.image.seo_tag || item.name[lang]"
            class="w-full md:w-20 h-auto md:h-20 max-h-40 object-cover rounded" width="80" height="80" preload
            fetchpriority="high" :modifiers="{
              width: 80,
              height: 80,
              fit: 'cover'
            }" />
        </div>

        <!-- Item Content -->
        <div class="item-content flex-grow">
          <div class="flex flex-col md:flex-row justify-between md:items-start">
            <!-- Item Name and Description in a column -->
            <div class="flex flex-col flex-grow md:mr-4 mb-2 md:mb-0">
              <h4 class="item-name mb-0.5">{{ item.name[lang] }}</h4>
              <p v-if="item.description && item.description[lang]" class="item-description">
                {{ item.description[lang] }}
              </p>
              <div class="flex flex-wrap mt-1.5">
                <!-- Featured badge -->
                <div v-if="item.featured">
                  <div class="badge badge-featured inline-block px-2 py-1 rounded"
                    :class="{ 'badge-restaurant': type === 'restaurant', 'badge-service': type === 'service' }">
                    {{ isService ? $t('ServicePackages.featuredItem') : $t('RestaurantMenu.specialItem') }}
                  </div>
                </div>
                <!-- Availability badge for service items -->
                <div v-if="isService && item.availability === 'limited'">
                  <div class="badge badge-availability inline-block px-2 py-1 rounded ml-2">
                    {{ $t('ServicePackages.limitedAvailability') }}
                  </div>
                </div>
                <!-- Discount badge for service items -->
                <div v-if="isService && item.hasDiscount && calculateDiscountPercentage(item) > 0"
                  class="badge badge-discount inline-block px-2 py-1 rounded-full ml-2">
                  {{ calculateDiscountPercentage(item) }}% OFF
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
                      formatPrice(item.price) }}</span>
                    <span class="item-price-discounted">{{ currencySymbol }}{{ formatPrice(item.discountedPrice)
                    }}</span>
                  </div>
                </div>
                <!-- Standard pricing for items -->
                <div v-else class="item-price">
                  {{ currencySymbol }}{{ formatPrice(item.price) }}
                </div>
              </div>

              <!-- Duration on same row -->
              <div class="flex items-center mt-1">
                <!-- Duration for services -->
                <div v-if="isService && item.duration" class="item-duration">
                  {{ item.duration[lang] }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatPrice } from '@/utils/constants';

export default {
  name: 'ItemsGrid',
  props: {
    items: {
      type: Array,
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
      default: 'restaurant', // 'restaurant' or 'service'
      validator: value => ['restaurant', 'service'].includes(value)
    }
  },
  computed: {
    isService() {
      return this.type === 'service';
    }
  },
  methods: {
    formatPrice,
    calculateDiscountPercentage(item) {
      if (!item.hasDiscount || !item.price || !item.discountedPrice) return 0;
      const originalPrice = parseFloat(item.price);
      const discountedPrice = parseFloat(item.discountedPrice);
      if (originalPrice <= 0 || discountedPrice >= originalPrice) return 0;
      return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
    }
  }
}
</script>