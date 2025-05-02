<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div v-for="(item, index) in items" :key="`service-item-${item.id}`"
      class="service-item flex cursor-pointer" :class="[item.classes, { 'featured': item.featured }]"
      @click="$emit('item-click', item)">
      <!-- Item Image -->
      <div v-if="item.image && item.image.url" class="service-item-image mr-4 flex-shrink-0">
        <img :src="item.image.url" :alt="item.image.seo_tag || item.name[lang]" loading="lazy"
          class="w-20 h-20 object-cover rounded" width="80" height="80" />
      </div>

      <!-- Item Content -->
      <div class="service-item-content flex-grow">
        <div class="flex justify-between items-start">
          <h4 class="text-lg font-semibold mb-1">{{ item.name[lang] }}</h4>
          <div class="flex flex-col items-end">
            <div class="service-item-price font-medium ml-4">
              {{ currencySymbol }}{{ formatPrice(item.price) }}
            </div>
            <div v-if="item.duration" class="text-sm text-gray-600 ml-4">
              {{ item.duration }}
            </div>
          </div>
        </div>
        <p v-if="item.description && item.description[lang]" class="text-sm text-gray-600">
          {{ item.description[lang] }}
        </p>
        <div class="mt-2 flex flex-wrap gap-2">
          <div v-if="item.featured"
            class="featured-badge inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {{ $t('ServicePackages.featuredItem') || 'Featured' }}
          </div>
          <div v-if="item.availability === 'limited'"
            class="availability-badge inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
            {{ $t('ServicePackages.limitedAvailability') || 'Limited Availability' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceItemsGrid',
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
/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .service-item {
    flex-direction: column;
  }

  .service-item-image {
    margin-bottom: 1rem;
    margin-right: 0;
  }

  .service-item-image img {
    width: 100%;
    height: auto;
    max-height: 12rem;
    object-fit: cover;
  }
}
</style>