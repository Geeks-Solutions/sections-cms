<template>
  <div v-if="sectionRenderData" class="author-view flex flex-col">
    <div class="flex flex-col items-center bg-white px-4 md:px-20 pb-24">
      <div class="flex flex-col md:flex-row justify-between wrapper pt-6 w-full md:w-720px">
        <div v-if="sectionRenderData.profile_image || sectionRenderData.full_name || sectionRenderData.biography" class="flex flex-row gap-4">
          <img v-if="sectionRenderData.profile_image && sectionRenderData.profile_image.files && sectionRenderData.profile_image.files[0] && sectionRenderData.profile_image.files[0].thumbnail_url" :src="sectionRenderData.profile_image.files[0].thumbnail_url" alt="Author profile" class="min-w-[56px] w-56px h-56px rounded-full object-cover" />
          <div class="flex flex-col">
            <p class="name" v-if="sectionRenderData.full_name">{{ sectionRenderData.full_name }}</p>
            <p class="bio" v-if="sectionRenderData.biography && sectionRenderData.biography[lang]">{{ sectionRenderData.biography[lang] }}</p>
          </div>
        </div>
        <div v-else></div>
        <div class="flex flex-row gap-3 md:pb-4">
          <div class="flex flex-row rounded-lg py-2.5 px-4 gap-2 bg-white border border-Gray_300 shadow cursor-pointer" @click="copyArticleLink">
            <IconsCopy />
            <div class="text-sm font-semibold text-Gray_700">{{ $t('Copy link') }}</div>
          </div>
          <div class="flex flex-row rounded-lg p-2.5 gap-2 bg-white border border-Gray_300 shadow cursor-pointer" @click="shareSocial('twitter')">
            <IconsTwitter />
          </div>
          <div class="flex flex-row rounded-lg p-2.5 gap-2 bg-white border border-Gray_300 shadow cursor-pointer" @click="shareSocial('facebook')">
            <IconsFacebook />
          </div>
          <div class="flex flex-row rounded-lg p-2.5 gap-2 bg-white border border-Gray_300 shadow cursor-pointer" @click="shareSocial('linkedin')">
            <IconsLinkedin />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {copyText, parseTime} from "@/utils/constants";

export default {
  name: "AuthorView",
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
    }
  },
  methods: {
    parseTime,
    copyArticleLink() {
      copyText(window.location)
    },
    shareSocial(social) {
      switch (social) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location)}`)
          return;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location)}`)
          return;
        case 'linkedin':
          window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location)}`)
      }
    }
  }
}
</script>
