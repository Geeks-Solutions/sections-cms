<template>
  <div v-if="section && section.render_data" class="articles-categories flex flex-col items-center w-full space-y-4 md:space-y-8 py-2">

    <h2 class="cursor-pointer hover:underline" @click="$emit('category-clicked', section.render_data)">{{ $t('blogs.allCategories') }}</h2>

    <div class="flex md:grid flex-wrap md:grid-cols-5 justify-items-center justify-center gap-x-4 md:gap-x-8 gap-y-4 px-4 md:px-0">
      <p v-for="(articleCategory, idx) in section.render_data" :key="`article-category-${idx}`" class="text-center md:whitespace-nowrap cursor-pointer hover:underline content-center" @click="$emit('category-clicked', articleCategory)">
        {{ articleCategory.title }}
      </p>
    </div>

  </div>
</template>

<script>
export default {
  name: "ArticlesCategories",
  props: {
    section: {
      type: Object,
      default: () => {},
    },
    lang: {
      type: String,
      default: "en"
    }
  }
}
</script>
