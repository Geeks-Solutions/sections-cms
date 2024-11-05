<template>
  <div v-if="sectionRenderData" class="flex flex-col">
    <div class="flex flex-col bg-white gap-16 px-4 md:px-20 py-10 md:py-24">
      <div class="flex flex-col items-center gap-6">
        <div class="flex flex-col items-center gap-3">
          <div class="text-center text-sm md:text-base font-semibold text-Primary_Color_700">{{ $t('blogs.published', {time: parseTime(sectionRenderData.updated_at)}) }}</div>
          <div class="text-center text-2xl md:text-5xl font-bold text-Gray_900">{{ sectionRenderData.title }}</div>
        </div>
        <div class="text-center text-base md:text-xl text-Gray_600" v-html="sectionRenderData.description"></div>
      </div>
      <img v-if="articleImage" :src="articleImage" :alt="articleImageAlt ? articleImageAlt : ''" class="h-227px md:h-560px object-cover md:px-8" />
    </div>
    <div class="flex flex-col items-center bg-white px-4 md:px-20">
      <div class="text-base md:text-lg text-Gray_600 md:w-720px" v-html="sectionRenderData.body"></div>
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
