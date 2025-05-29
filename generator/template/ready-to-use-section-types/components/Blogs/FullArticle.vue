<template>
  <div v-if="sectionRenderData" class="full-article flex flex-col">
    <div class="flex flex-col gap-16 py-10 md:py-8 full-article-wrapper">
      <div class="flex flex-col items-center gap-6">
        <div class="flex flex-col items-center gap-3">
          <h4 class="text-center published">{{ $t('blogs.published', {time: parseTime(sectionRenderData.updated_at)}) }}</h4>
          <h1 class="text-center title">{{ sectionRenderData.title }}</h1>
        </div>
        <gWysiwygContent tag="p" :classes="`text-center html-content`" :html-content="sectionRenderData.description" />
      </div>
      <NuxtImg v-if="articleImage" :src="articleImage" :alt="articleImageAlt ? articleImageAlt : ''" class="w-fit max-w-full self-center object-contain"
           sizes="100%"
           width="300"
           height="300"
           :placeholder="[300, 300, 75, 5]"
           loading="lazy"/>
    </div>
    <div class="flex flex-col items-center body-wrapper">
      <gWysiwygContent tag="p" :classes="`html-content`" :html-content="sectionRenderData.body" />
    </div>
  </div>
</template>

<script>
import {parseTime} from "@/utils/constants";

export default {
  name: "FullArticle",
  props: {
    section: {
      type: Object,
      default: () => {},
    },
    lang: {
      type: String,
      default: "en"
    }
  },
  computed: {
    sectionRenderData() {
      if (this.section && this.section.render_data) {
        return this.section.render_data
      } else return null
    },
    articleImage() {
      if (this.sectionRenderData && this.sectionRenderData.medias && this.sectionRenderData.medias[0] && this.sectionRenderData.medias[0].files) {
        return this.sectionRenderData.medias[0].files[0].url
      } else return ''
    },
    articleImageAlt() {
      if (this.sectionRenderData.medias && this.sectionRenderData.medias[0] && this.sectionRenderData.medias[0].files) {
        return this.sectionRenderData.medias[0].files[0].seo_tag
      } else return ''
    }
  },
  methods: {
    parseTime
  }
}
</script>

<style>
.section-view .view-component:has(.full-article) {
  overflow: visible;
}

section .full-article {
  container: full-article / inline-size;
}

@container full-article (max-width: 768px) {
  .full-article .body-wrapper .html-content {
    width: 100% !important;
  }

  .full-article .title {
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
  }
}
</style>
