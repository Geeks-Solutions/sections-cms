<template>
  <div v-if="sectionRenderData" class="author-view flex flex-col">
    <div class="flex flex-col items-center px-4 md:px-20 pb-2">
      <div class="flex flex-col md:flex-row justify-between wrapper pt-6 w-full md:w-720px">
        <div v-if="sectionRenderData.profile_image || sectionRenderData.full_name || sectionRenderData.biography" class="flex flex-row gap-4">
          <img v-if="sectionRenderData.profile_image && sectionRenderData.profile_image.files && sectionRenderData.profile_image.files[0] && sectionRenderData.profile_image.files[0].thumbnail_url" :src="sectionRenderData.profile_image.files[0].thumbnail_url" alt="Author profile" class="min-w-[56px] w-56px h-56px rounded-full object-cover" />
          <div class="flex flex-col">
            <p v-if="sectionRenderData.full_name" class="name">{{ sectionRenderData.full_name }}</p>
            <p v-if="sectionRenderData.biography && sectionRenderData.biography[lang]" class="bio">{{ sectionRenderData.biography[lang] }}</p>
          </div>
        </div>
        <div v-else></div>
        <div class="flex flex-row gap-3 btns-wrapper">
          <div class="relative inline-block">
            <div class="flex flex-row py-2.5 px-4 gap-2 md:cursor-pointer button-selector" @click="copyArticleLink">
              <p>{{ $t('blogs.copyLink') }}</p>
            </div>
            <span
              v-if="showTooltip"
              class="absolute top-0 left-1/2 whitespace-nowrap transform -translate-x-1/2 -translate-y-full mt-1 px-2 py-1 bg-black text-white text-sm rounded copied-tooltip"
            >
              {{ $t('blogs.copied') }}
            </span>
          </div>
		  <div class="flex flex-row rounded-lg p-2.5 gap-2 md:cursor-pointer" @click="shareSocial('twitter')">
			<div class="twitter min-w-20px w-20px h-20px"></div>
		  </div>
		  <div class="flex flex-row rounded-lg p-2.5 gap-2 md:cursor-pointer" @click="shareSocial('facebook')">
			<div class="facebook min-w-20px w-20px h-20px"></div>
		  </div>
		  <div class="flex flex-row rounded-lg p-2.5 gap-2 md:cursor-pointer" @click="shareSocial('linkedin')">
			<div class="linkedin min-w-20px w-20px h-20px"></div>
		  </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {copyText} from "@/utils/constants";

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
  data() {
    return {
      showTooltip: false
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
    copyArticleLink() {
      copyText(window.location)
      this.showTooltip = true;
      setTimeout(() => {
        this.showTooltip = false;
      }, 1000);
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
