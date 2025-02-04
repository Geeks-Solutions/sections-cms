<template>
  <div v-if="settings" class="interactive-display">
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
                <h2 v-if="block.title[lang]" class="text-center overflow-hidden p-0" :class="sectionsStyle.wysiwygHtml" v-html="block.title[lang]"></h2>
                <p v-if="block.text[lang]" class="text-center p-0" :class="sectionsStyle.wysiwygHtml" v-html="block.text[lang]"></p>
              </div>
              <global-link :link="block.ctaLink" :lang="lang">
                <div class="button-selector">
				  {{ block.cta[lang] }}
				</div>
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
      <iframe :src="computedVideoUrl" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" allow="autoplay;" />
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
    },
	viewStructure: {
	  settings: [
		{
		  title: {
			en: 'string',
			fr: 'string'
		  },
		  text: {
			en: 'string',
			fr: 'string'
		  },
		  cta: {
			en: 'string',
			fr: 'string'
		  },
		  ctaLink: {
			en: 'string',
			fr: 'string'
		  },
		  videoLink: '',
		  media: 'image',
		  mediaMobile: 'image'
		}
	  ]
	}
  },
  data() {
    return {
      currentIndex: 0,
      autoplayInterval: null,
      sectionsStyle,
      videoUrl: ''
    }
  },
  computed: {
    settings() {
      return this.section.settings
    },
    computedVideoUrl() {
      if (this.settings && this.settings[0] && this.settings[0].videoLink && this.isYouTubeLink(this.settings[0].videoLink)) {
        const v = this.settings[0]
        try {
          const url = new URL(v.videoLink);
          const params = url.searchParams;

          params.set("hl", this.$i18n.locale);
          params.set("rel", "0");

          if (v.autoplay) {
            params.set("autoplay", "1");
            params.set("mute", "1");
          } else {
            params.delete("autoplay");
            params.delete("mute");
          }

          if (v.loop) {
            const videoId = this.extractVideoId(url.href);
            if (videoId) {
              params.set("loop", "1");
              params.set("playlist", videoId);
            }
          } else {
            params.delete("loop");
            params.delete("playlist");
          }

          if (v.controls) {
            params.set("controls", "0");
            params.set("disablekb", "1");
          } else {
            params.delete("controls");
            params.delete("disablekb");
          }

          if (v.whiteProgress) {
            params.set("color", "white");
          } else {
            params.delete("color");
          }

          return url.toString();
        } catch {
          return ''
        }
      } else return this.settings[0].videoLink
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
    },
    extractVideoId(url) {
      const regex = /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    },
    isYouTubeLink(url) {
      try {
        const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)(\/.*)?$/;
        return regex.test(url);
      } catch {
        return false
      }
    }
  }
};
</script>

<style>
.interactive-display .carousel-container {
  max-width: 100%;
  overflow: hidden;
}

.interactive-display .carousel-inner {
  display: flex;
  transition: transform 0.5s ease;
}

.interactive-display .carousel-slide {
  width: 100%;
  opacity: 0;
  transition: opacity 1.5s ease;
}

.interactive-display .carousel-slide.active {
  flex: 0 0 auto;
  opacity: 1;
}

.interactive-display .carousel-dots .carousel-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ddd;
  margin: 0 4px;
  cursor: pointer;
}

.interactive-display .carousel-dots .carousel-dot.active {
  background-color: #333;
}
</style>
