<template>
  <div class="category-tabs-wrapper mb-8 overflow-x-auto">
    <div class="flex space-x-2 pb-2">
      <div v-for="category in categories" :key="'tab-' + category.id"
        class="category-tab whitespace-nowrap px-4 py-0 rounded-lg h-8 flex hover:cursor-pointer transition-colors duration-200"
        :class="[
          activeCategory === category.id ? 'active' : ''
        ]" @click="$emit('select-category', category.id)">
        <div class="flex items-center justify-center">
          <div v-if="category.icon && category.icon.url" class="mr-1">
            <img :src="category.icon.url" :alt="category.icon.seo_tag || category.name[lang]"
              class="w-5 h-5 object-contain" loading="lazy" width="20" height="20" />
          </div>
          {{ category.name[lang] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
</style>