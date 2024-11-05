<template>
  <div v-if="settings" class="ImageCarouselOrVideo">
    <div v-if="!settings[0].videoLink" class="carousel-container relative overflow-hidden h-480px md:h-auto">
      <div class="carousel-inner h-full">
        <div v-for="(block, index) in settings" :key="`carousel-media-block-${index}`" class="relative h-full" :class="`carousel-slide ${index === currentIndex ? 'active' : ''}`">
          <img
              v-if="block.media && block.media.url"
              :src="block.media.url"
              :alt="block.media.seo_tag ? block.media.seo_tag : ''"
			  loading="lazy"
              class="w-full h-full md:h-auto object-cover mobileHidden"
          />
          <img
              v-if="block.mediaMobile && block.mediaMobile.url"
              :src="block.mediaMobile.url"
              :alt="block.mediaMobile.seo_tag ? block.mediaMobile.seo_tag : ''"
			  loading="lazy"
              class="w-full h-full md:h-auto object-cover md:hidden"
          />
          <div v-if="(block.title[lang] || block.text[lang] || block.cta[lang]) && index === currentIndex" class="absolute top-0 w-full h-full">
            <div class="flex flex-col h-full justify-center items-center space-y-10">
              <div class="flex flex-col gap-2 md:gap-4">
                <div v-if="block.title[lang]" class="text-4xl md:text-7xl text-center font-bold overflow-hidden text-white p-0" :class="sectionsStyle.wysiwygHtml" v-html="block.title[lang]"></div>
                <div v-if="block.text[lang]" class="text-base md:text-2xl text-center text-white p-0" :class="sectionsStyle.wysiwygHtml" v-html="block.text[lang]"></div>
              </div>
              <global-link :link="block.ctaLink" :lang="lang">
                <Button :label="block.cta[lang]" type="outlined" size="2xl" />
              </global-link>
            </div>
          </div>
        </div>
      </div>
      <div class="carousel-dots absolute bottom-0 left-0 right-0 flex justify-center pb-4">
        <span v-for="(item, index) in settings" :key="index" :class="settings.length > 1 ? `carousel-dot ${index === currentIndex ? 'active' : ''}` : ``" @click="goTo(index)"></span>
      </div>
    </div>
    <div v-else class="w-full relative h-700px">
<!--  For youtube videos, the following must be added to the end of the embedded url `?autoplay=1&mute=1` for the video to autoplay -->
      <iframe :src="settings[0].videoLink" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" allow="autoplay;" />
    </div>
  </div>
</template>

<script>
import {sectionsStyle} from "@/utils/constants";

export default {
  name: 'InteractiveDisplayStatic',
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
      currentIndex: 0,
      autoplayInterval: null,
      sectionsStyle
    }
  },
  computed: {
    settings() {
      return this.section.settings
    }
  },
  mounted() {
    this.startAutoplay();
  },
  beforeDestroy() {
    clearInterval(this.autoplayInterval);
  },
  methods: {
    goTo(index) {
      this.currentIndex = index;
      this.resetAutoplay();
    },
    next() {
      this.currentIndex = (this.currentIndex + 1) % this.settings.length;
    },
    startAutoplay() {
      if (this.settings && this.settings.length > 1) {
        this.autoplayInterval = setInterval(() => {
          this.next();
        }, 5000);
      }
    },
    resetAutoplay() {
      clearInterval(this.autoplayInterval);
      this.startAutoplay();
    }
  }
};
</script>
