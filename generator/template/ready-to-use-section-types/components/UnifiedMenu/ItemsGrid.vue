<template>
  <div class="category-container-query">
    <div class="item-grid">
      <ItemCard v-for="item in items" :key="`item-${item.id}`" :item="item" :currency-symbol="currencySymbol"
        :lang="lang" :type="type" :show-item-details="showItemDetails" :expanded-items="expandedItems"
        @item-click="$emit('item-click', item)" />
    </div>
  </div>
</template>

<i18n src="../../sections/forms/ServicePackages_i18n.json"></i18n>
<i18n src="../../sections/forms/RestaurantMenu_i18n.json"></i18n>

<script setup>
import ItemCard from './ItemCard.vue'

const { t: $t } = useI18n({ useScope: 'local' })

const props = defineProps({
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
</script>