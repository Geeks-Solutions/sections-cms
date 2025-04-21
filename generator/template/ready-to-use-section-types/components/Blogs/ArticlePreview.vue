<template>
  <div class="articles-preview flex flex-col md:flex-row gap-6 md:gap-24 py-5 px-4">
    <div v-if="image" class="flex image-wrapper min-h-[300px] max-h-[300px]">
      <img :src="image" :alt="imageAlt" class="md:min-w-[440px] w-full md:w-440px object-cover" />
    </div>
    <div class="flex flex-col gap-4 w-full justify-between preview-block-wrapper">

      <div class="flex flex-col gap-4 w-full content-block-wrapper">
        <div class="flex flex-row justify-between">
          <div class="flex flex-row gap-2 items-end title-wrapper">
            <h2 class="title">{{ title }}</h2>
          </div>
          <div></div>
        </div>

        <gWysiwygContent tag="p" :classes="`html-content desc p-0`" :html-content="content" />
      </div>

      <BlogsArticleButton :path="path" />

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
