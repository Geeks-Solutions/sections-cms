<template>
  <div class="category-tabs-wrapper mb-4 md:mb-8 overflow-x-auto">
    <div class="flex space-x-2 pb-2">
      <div v-for="category in categories" :key="'tab-' + category.id"
        class="category-tab whitespace-nowrap px-3 sm:px-4 py-0 rounded-lg h-8 flex hover:cursor-pointer transition-colors duration-200"
        :class="[
          activeCategory === category.id ? 'active' : ''
        ]" @click="$emit('select-category', category.id)">
        <div class="flex items-center justify-center">
          <div v-if="category.icon && category.icon.url"
            class="icon-container mr-1 flex-shrink-0 w-5 h-5 flex items-center justify-center">
            <img :src="getOptimizedImage(category.icon.url, 20, 20)" :alt="category.icon.seo_tag || category.name[lang]"
              class="icon-image max-w-full max-h-full object-contain" width="20" height="20" loading="lazy" />
          </div>
          <span class="tab-text">{{ category.name[lang] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOptimizedImage } from '../../utils/constants'
export default {
  name: 'CategoryTabs',
  props: {
    categories: {
      type: Array,
      required: true
    },
    activeCategory: {
      type: String,
      required: true
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
  methods: {
   getOptimizedImage
  }
}
</script>

<style scoped>
/* Minimal required styling for scrollbar */
.category-tabs-wrapper {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.category-tabs-wrapper::-webkit-scrollbar {
  height: 6px;
}

.category-tabs-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.category-tabs-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

/* Icon handling */
.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  /* Ensures minimum width even on smaller screens */
}

.icon-image {
  display: block;
  width: auto;
  height: auto;
}

/* Responsive styling for icons */
.category-tabs-wrapper {
  container-type: inline-size;
  container-name: category-tabs;
}

@container category-tabs (max-width: 640px) {
  .icon-container {
    min-width: 16px;
    /* Slightly smaller minimum on smaller containers */
  }
}
</style>