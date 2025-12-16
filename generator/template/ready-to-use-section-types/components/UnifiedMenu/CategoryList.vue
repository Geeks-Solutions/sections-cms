<template>
  <div>
    <template v-for="(category, catIndex) in categories" :key="`cat-${catIndex}`">
      <div class="category-container category-container-query mb-12" :class="category.classes">
        <div class="flex items-center border-b pb-2 mb-6">
          <!-- Category Icon -->
          <div v-if="category.icon && category.icon.url" class="mr-3">
            <GUniversalViewer :src="category.icon.url" :alt="category.icon.seo_tag || category.name[lang]"
              :type="category.icon.metadata?.type || 'image'" class="icon-image max-w-full max-h-full object-contain"
              width="32" height="32" loading="lazy" :modifiers="{
                width: 32,
                height: 32,
                fit: 'contain'
              }" />
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
        <div class="item-grid">
          <template v-if="getCategoryItems(category.id).length > 0">
            <ItemCard v-for="item in getCategoryItems(category.id)" :key="`item-${item.id}`" :item="item"
              :currency-symbol="currencySymbol" :lang="lang" :type="type" :show-item-details="showItemDetails"
              :expanded-items="expandedItems" @item-click="$emit('item-click', item)" />
          </template>
          <template v-else>
            <div class="text-center py-8 text-gray-500">
              <p>{{ $t('RestaurantMenu.noItemsInCategory') }}</p>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<i18n src="../../sections/forms/ServicePackages_i18n.json"></i18n>
<i18n src="../../sections/forms/RestaurantMenu_i18n.json"></i18n>

<script setup>
import { computed } from 'vue'
import ItemCard from './ItemCard.vue'

const { t: $t } = useI18n({ useScope: 'local' })

const props = defineProps({
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

const emit = defineEmits(['item-click'])

// Computed properties
const isService = computed(() => props.type === 'service')

// Methods
const getCategoryItems = (categoryId) => {
  if (!categoryId || !props.getItemsByCategory) {
    return []
  }

  try {
    const result = props.getItemsByCategory(categoryId)
    // Ensure we always return an array, never a Promise or other object
    if (!Array.isArray(result)) {
      return []
    }
    return result
  } catch (error) {
    return []
  }
}
</script>