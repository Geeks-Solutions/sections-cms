<template>
  <div class="articles-preview flex flex-col md:flex-row gap-6 md:gap-24 px-5 md:px-24 py-2">
    <div v-if="image" class="image-wrapper">
      <img :src="image" :alt="imageAlt" class="md:min-w-[440px] md:w-440px h-180px xs:h-240px md:h-280px object-cover" />
    </div>
    <div class="flex flex-col gap-4 w-full justify-between preview-block-wrapper">

      <div class="flex flex-col gap-4 w-full content-block-wrapper">
        <div class="flex flex-row justify-between">
          <div class="flex flex-row gap-2 items-end title-wrapper">
            <h2 class="title">{{ title }}</h2>
          </div>
          <div></div>
        </div>

        <gWysiwygContent tag="p" :classes="`html-content desc`" :html-content="content" />
      </div>

      <nuxt-link :to="path" class="button-selector">
        {{ $t('blogs.readPost') }}
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

<style>
.articles-preview .title {
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.articles-preview .desc * {
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
