<template>
  <div class="category-tabs mb-8 overflow-x-auto">
    <div class="flex space-x-2 pb-2">
      <div v-for="category in categories" :key="'tab-' + category.id"
        class="category-tab whitespace-nowrap px-4 py-0 rounded-lg focus:outline-none transition-colors duration-200 h-8 flex hover:cursor-pointer"
        :class="[
          activeCategory === category.id
            ? 'bg-blue-800 text-white'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
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
    }
  }
}
</script>

<style scoped>
.category-tabs {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.category-tabs::-webkit-scrollbar {
  height: 6px;
}

.category-tabs::-webkit-scrollbar-track {
  background: transparent;
}

.category-tabs::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
</style>