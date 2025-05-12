<template>
  <div>
    <template v-for="(category, catIndex) in categories">
      <div class="category-container mb-12" :class="category.classes" :key="`cat-${catIndex}`">
        <div class="flex items-center border-b pb-2 mb-6">
          <!-- Category Icon -->
          <div v-if="category.icon && category.icon.url" class="mr-3">
            <img :src="getOptimizedImage(category.icon.url, 32, 32)" :alt="category.icon.seo_tag || category.name[lang]"
              class="icon-image max-w-full max-h-full object-contain" width="32" height="32" loading="lazy" />
          </div>

          <!-- Category Name -->
          <h3 class="category-name">
            {{ category.name[lang] }}
          </h3>
        </div>

        <p v-if="category.description && category.description[lang]" class="category-description mb-6">
          {{ category.description[lang] }}
        </p>

        <!-- Items Grid for this category -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          <div v-for="item in getItemsByCategory(category.id)" :key="`item-${item.id}`"
            class="menu-item flex flex-col md:flex-row cursor-pointer" :class="[
              item.classes,
              { 'featured': item.featured },
              { 'menu-item-restaurant': type === 'restaurant' },
              { 'menu-item-service': type === 'service' }
            ]" @click="$emit('item-click', item)">

            <!-- Item Image -->
            <div v-if="item.image && item.image.url" class="item-image-wrapper md:mr-4 mb-4 md:mb-0 flex-shrink-0">
              <img :src="getOptimizedImage(item.image.url, 80, 80)" :alt="item.image.seo_tag || item.name[lang]"
                class="w-full md:w-20 h-auto md:h-20 max-h-40 object-cover rounded" width="80" height="80"
                loading="lazy" />
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
  </div>
</template>

<script>

import { formatPrice, getOptimizedImage } from '@/utils/constants.js'; // Assuming this utility function is defined in your project
export default {
  name: 'CategoryList',
  props: {
    categories: {
      type: Array,
      required: true
    },
    getItemsByCategory: {
      type: Function,
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
    getOptimizedImage,
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