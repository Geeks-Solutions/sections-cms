<template>
  <div class="articles-preview flex flex-col md:flex-row gap-6 md:gap-24 py-5 px-4">
    <div v-if="image" class="flex image-wrapper min-h-[300px] max-h-[300px]">
      <NuxtImg :src="image" :alt="imageAlt" class="md:min-w-[440px] w-full md:w-440px object-cover"
               width="300"
               height="300"
               :placeholder="[300, 300, 75, 5]"
               loading="lazy"/>
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
.articles-preview .desc, .articles-preview .title {
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

section .article-preview-wrapper {
  container: article-preview-wrapper / inline-size;
}

@container article-preview-wrapper (max-width: 768px) {
  .articles-preview {
    flex-wrap: wrap;
    gap: 1.5rem !important;
    padding: 1.25rem 1rem !important;
    .image-wrapper {
      min-height: 300px;
      max-height: 300px;
      img {
        min-width: 100% !important;
      }
    }
  }

  .articles-preview .image-wrapper, .articles-preview img {
    width: 100% !important;
  }
}
</style>
