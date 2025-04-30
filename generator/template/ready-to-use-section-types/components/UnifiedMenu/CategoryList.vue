<template>
  <div>
    <template v-for="(category, catIndex) in categories">
      <div class="category-container mb-12" :class="category.classes">
        <div class="flex items-center border-b pb-2 mb-6">
          <!-- Category Icon -->
          <div v-if="category.icon && category.icon.url" class="mr-3">
            <img :src="category.icon.url" :alt="category.icon.seo_tag || category.name[lang]"
              class="w-8 h-8 object-contain" loading="lazy" width="32" height="32" />
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="item in getItemsByCategory(category.id)" :key="`item-${item.id}`"
            class="menu-item flex cursor-pointer" :class="[
              item.classes,
              { 'featured': item.featured },
              { 'menu-item-restaurant': type === 'restaurant' },
              { 'menu-item-service': type === 'service' }
            ]" @click="$emit('item-click', item)">

            <!-- Item Image -->
            <div v-if="item.image && item.image.url" class="item-image-wrapper mr-4 flex-shrink-0">
              <img :src="item.image.url" :alt="item.image.seo_tag || item.name[lang]" loading="lazy"
                class="w-20 h-20 object-cover rounded" width="80" height="80" />
            </div>

            <!-- Item Content -->
            <div class="item-content flex-grow">
              <div class="flex justify-between items-start">
                <h4 class="item-name mb-1">{{ item.name[lang] }}</h4>
                <div class="flex flex-col items-end">
                  <!-- Pricing for service items with potential discount -->
                  <div v-if="isService && item.hasDiscount" class="item-price ml-4">
                    <div class="flex flex-col items-end">
                      <span class="item-price-regular text-sm">{{ currencySymbol }}{{ formatPrice(item.price) }}</span>
                      <span class="item-price-discounted">{{ currencySymbol }}{{ formatPrice(item.discountedPrice)
                        }}</span>
                    </div>
                  </div>
                  <!-- Standard pricing for items -->
                  <div v-else class="item-price ml-4">
                    {{ currencySymbol }}{{ formatPrice(item.price) }}
                  </div>
                  <!-- Duration for services -->
                  <div v-if="isService && item.duration" class="item-duration text-sm ml-4">
                    {{ item.duration }}
                  </div>
                </div>
              </div>

              <p v-if="item.description && item.description[lang]" class="item-description text-sm">
                {{ item.description[lang] }}
              </p>

              <!-- Additional badges -->
              <div class="mt-2 flex flex-wrap gap-2">
                <!-- Featured badge - different based on type -->
                <div v-if="item.featured" class="badge badge-featured inline-block text-xs px-2 py-1 rounded"
                  :class="{ 'badge-restaurant': type === 'restaurant', 'badge-service': type === 'service' }">
                  {{ isService ? $t('ServicePackages.featuredItem') : $t('RestaurantMenu.specialItem') }}
                </div>

                <!-- Discount badge for service items -->
                <div v-if="isService && item.hasDiscount && calculateDiscountPercentage(item) > 0"
                  class="badge badge-discount inline-block text-xs px-2 py-1 rounded-full">
                  {{ calculateDiscountPercentage(item) }}% OFF
                </div>

                <!-- Availability badge for service items -->
                <div v-if="isService && item.availability === 'limited'"
                  class="badge badge-availability inline-block text-xs px-2 py-1 rounded">
                  {{ $t('ServicePackages.limitedAvailability') }}
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
    formatPrice(price) {
      return (Math.round(price * 100) / 100).toFixed(2);
    },
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

<style scoped>
/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .menu-item {
    flex-direction: column;
  }

  .item-image-wrapper {
    margin-bottom: 1rem;
    margin-right: 0;
  }

  .item-image-wrapper img {
    width: 100%;
    height: auto;
    max-height: 12rem;
    object-fit: cover;
  }
}
</style>