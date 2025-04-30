<template>
  <div>
    <template v-for="(category, catIndex) in categories">
      <div class="category-container mb-12" :class="category.classes">
        <div class="flex items-center border-b-2 border-gray-300 pb-2 mb-6">
          <!-- Category Icon -->
          <div v-if="category.icon && category.icon.url" class="mr-3">
            <img :src="category.icon.url" :alt="category.icon.seo_tag || category.name[lang]"
              class="w-8 h-8 object-contain" loading="lazy" width="32" height="32" />
          </div>

          <!-- Category Name -->
          <h3 class="text-2xl font-semibold">
            {{ category.name[lang] }}
          </h3>
        </div>

        <p v-if="category.description && category.description[lang]" class="mb-6">
          {{ category.description[lang] }}
        </p>

        <!-- Menu Items for this category -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="item in getItemsByCategory(category.id)" :key="`item-${item.id}`"
            class="menu-item flex cursor-pointer" :class="[item.classes, { 'featured': item.featured }]"
            @click="$emit('item-click', item)">
            <!-- Item Image -->
            <div v-if="item.image && item.image.url" class="menu-item-image mr-4 flex-shrink-0">
              <img :src="item.image.url" :alt="item.image.seo_tag || item.name[lang]" loading="lazy"
                class="w-20 h-20 object-cover rounded" width="80" height="80" />
            </div>

            <!-- Item Content -->
            <div class="menu-item-content flex-grow">
              <div class="flex justify-between items-start">
                <h4 class="text-lg font-semibold mb-1">{{ item.name[lang] }}</h4>
                <div class="menu-item-price font-medium ml-4">
                  {{ currencySymbol }}{{ formatPrice(item.price) }}
                </div>
              </div>
              <p v-if="item.description && item.description[lang]" class="text-sm text-gray-600">
                {{ item.description[lang] }}
              </p>
              <div v-if="item.featured"
                class="featured-badge mt-2 inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                {{ $t('RestaurantMenu.specialItem') || 'Special Item' }}
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
  .menu-item {
    flex-direction: column;
  }

  .menu-item-image {
    margin-bottom: 1rem;
    margin-right: 0;
  }

  .menu-item-image img {
    width: 100%;
    height: auto;
    max-height: 12rem;
    object-fit: cover;
  }
}
</style>