<template>
  <div v-if="sectionRenderData" class="full-article flex flex-col">
    <div class="flex flex-col gap-16 px-4 md:px-20 py-10 md:py-24">
      <div class="flex flex-col items-center gap-6">
        <div class="flex flex-col items-center gap-3">
          <h4 class="text-center">{{ $t('blogs.published', {time: parseTime(sectionRenderData.updated_at)}) }}</h4>
          <h1 class="text-center">{{ sectionRenderData.title }}</h1>
        </div>
        <p class="text-center html-content" v-html="sectionRenderData.description"></p>
      </div>
      <img v-if="articleImage" :src="articleImage" :alt="articleImageAlt ? articleImageAlt : ''" class="w-fit max-w-full self-center object-contain" />
    </div>
    <div class="flex flex-col items-center px-4 md:px-20">
      <p class="md:w-720px html-content" v-html="sectionRenderData.body"></p>
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
