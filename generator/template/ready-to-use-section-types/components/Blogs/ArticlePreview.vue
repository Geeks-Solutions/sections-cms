<template>
  <div class="articles-preview flex flex-col md:flex-row gap-6 md:gap-24 px-5 md:px-24 py-2">
    <div v-if="image">
      <img :src="image" :alt="imageAlt" class="md:min-w-[440px] md:w-440px h-180px xs:h-240px md:h-280px object-cover" />
    </div>
    <div class="flex flex-col gap-4 w-full">

      <div class="flex flex-row justify-between">
        <div class="flex flex-row gap-2 items-end">
          <div></div>
          <h2>{{ title }}</h2>
        </div>
		<div></div>
      </div>

      <p class="html-content" v-html="content"></p>

      <nuxt-link :to="path" class="button-selector w-full">
        {{ $t('blogs.readStory') }}
      </nuxt-link>

    </div>
  </div>
</template>

<script>
export default {
  name: "ArticlePreview",
  props: {
    image: {
      type: String,
      default: ""
    },
    imageAlt: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    path: {
      type: String,
      default: ""
    }
  }
}
</script>
