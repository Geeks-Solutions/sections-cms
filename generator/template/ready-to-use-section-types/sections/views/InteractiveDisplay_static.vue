<template>
  <div v-if="settings" class="interactive-display">
    <div v-if="!settings[0].videoLink" class="carousel-container relative overflow-hidden" :style="settings[0].containerHeight ? `height: ${settings[0].containerHeight};` : ``"
         @touchstart="handleTouchStart"
         @touchmove="handleTouchMove"
         @touchend="handleTouchEnd">
      <div class="carousel-inner h-full">
        <div v-for="(block, index) in migratedSettings" :key="`carousel-media-block-${index}`" class="relative h-full" :class="`carousel-slide ${index === currentIndex ? 'active' : ''}`">
          <NuxtImg
              v-if="block.media && block.media.url"
              :src="block.media.url"
              :alt="block.media.seo_tag ? block.media.seo_tag : ''"
              class="w-full h-full mobileHidden"
              :style="settings[0].imageFit ? `object-fit: ${settings[0].imageFit};` : ''"
              width="300"
           height="300"
           :placeholder="[300, 300, 75, 5]" format="webp"
              loading="lazy"
          />
          <NuxtImg
              v-if="block.mediaMobile && block.mediaMobile.url"
              :src="block.mediaMobile.url"
              :alt="block.mediaMobile.seo_tag ? block.mediaMobile.seo_tag : ''"
              class="w-full h-full md:h-auto object-cover md:hidden"
              :style="settings[0].imageFit ? `object-fit: ${settings[0].imageFit};` : ''"
              width="300"
           height="300"
           :placeholder="[300, 300, 75, 5]" format="webp"
              loading="lazy"
          />
          <div v-if="(block.title[lang] || block.text[lang] || block.cta[lang]) && index === currentIndex" class="absolute top-0 w-full h-full">
            <div class="flex flex-col h-full justify-center items-center space-y-10">
              <div class="flex flex-col gap-2 md:gap-4">
                <h2 v-if="block.title[lang]">
                  <gWysiwygContent tag="span" :wrapper-classes="block.titleClasses" :classes="`text-center overflow-hidden p-0`" :html-content="block.title[lang]" />
                </h2>
                <p v-if="block.text[lang]">
                  <gWysiwygContent tag="span" :wrapper-classes="block.textClasses" :classes="`text-center p-0`" :html-content="block.text[lang]" />
                </p>
              </div>
              <global-link v-if="block.cta && block.cta[lang]" :link="!block.sectionsPage || (block.sectionsPage && (block.sectionsPage[lang] === 'other' || !block.sectionsPage[lang])) ? block.ctaLink : block.sectionsPage && block.sectionsPage[lang] ? { ...block.sectionsPage, en: '/' + block.sectionsPage.en, fr: '/' + block.sectionsPage.fr } : '#'" :lang="lang" :default-lang="defaultLang" :form-link-target="block.ctaLinkTarget">
                <div class="button-selector">
				  {{ block.cta[lang] }}
				</div>
              </global-link>
            </div>
          </div>
        </div>
      </div>
      <div class="carousel-dots absolute bottom-0 left-0 right-0 flex justify-center pb-4">
        <span v-for="(item, index) in migratedSettings" :key="index" :class="migratedSettings.length > 1 ? `carousel-dot ${index === currentIndex ? 'active' : ''}` : ``" @click="goTo(index)"></span>
      </div>
    </div>
    <div v-else class="w-full relative video-wrapper">
<!--  For youtube videos, the following must be added to the end of the embedded url `?autoplay=1&mute=1` for the video to autoplay -->

      <div class="mobileHidden" :style="settings[0].aspectRatio ? `aspect-ratio: ${settings[0].aspectRatio}` : 'aspect-ratio: 16/9'">
        <iframe :src="computedVideoUrl" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" allow="autoplay;" />
      </div>
      <div class="md:hidden" :style="settings[0].mobileAspectRatio ? `aspect-ratio: ${settings[0].mobileAspectRatio}` : 'aspect-ratio: 9/16'">
        <iframe :src="computedMobileVideoUrl" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" allow="autoplay;" />
      </div>

      <div v-if="((settings[0].videoTitle && settings[0].videoTitle[lang]) || (settings[0].videoText && settings[0].videoText[lang]) || (settings[0].videoCta && settings[0].videoCta[lang]))" class="absolute top-0 w-full h-full pointer-events-none">
        <div class="flex flex-col h-full justify-center items-center space-y-10">
          <div class="flex flex-col gap-2 md:gap-4">
            <h2 v-if="settings[0].videoTitle[lang]">
              <gWysiwygContent tag="span" :wrapper-classes="settings[0].videoTitleClasses" :classes="`text-center overflow-hidden p-0`" :html-content="settings[0].videoTitle[lang]" />
            </h2>
            <p v-if="settings[0].videoText[lang]">
              <gWysiwygContent tag="span" :wrapper-classes="settings[0].videoTextClasses" :classes="`text-center p-0`" :html-content="settings[0].videoText[lang]" />
            </p>
          </div>
          <global-link v-if="settings[0].videoCta && settings[0].videoCta[lang]" :link="!settings[0].sectionsPage || (settings[0].sectionsPage && (settings[0].sectionsPage[lang] === 'other' || !settings[0].sectionsPage[lang])) ? settings[0].videoCtaLink : settings[0].sectionsPage && settings[0].sectionsPage[lang] ? { ...settings[0].sectionsPage, en: '/' + settings[0].sectionsPage.en, fr: '/' + settings[0].sectionsPage.fr } : '#'" :lang="lang" :default-lang="defaultLang" :form-link-target="settings[0].videoCtaLinkTarget" class="pointer-events-auto">
            <div class="button-selector">
              {{ settings[0].videoCta[lang] }}
            </div>
          </global-link>
        </div>
      </div>
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
    defaultLang: {
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
    migratedSettings() {
      if (this.settings && this.settings[0] && this.settings[0].carousels === undefined) {
        return this.section.settings
      } else if (this.settings) {
        return this.section.settings[0].carousels
      } else return []
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
    },
    computedMobileVideoUrl() {
      if (this.settings && this.settings[0] && !this.settings[0].mobileVideoLink && this.settings[0].videoLink && this.isYouTubeLink(this.settings[0].videoLink)) {
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
      } else if (this.settings && this.settings[0] && this.settings[0].mobileVideoLink && this.isYouTubeLink(this.settings[0].mobileVideoLink)) {
        const v = this.settings[0]
        try {
          const url = new URL(v.mobileVideoLink);
          const params = url.searchParams;

          params.set("hl", this.$i18n.locale);
          params.set("rel", "0");

          if (v.mobileAutoplay) {
            params.set("autoplay", "1");
            params.set("mute", "1");
          } else {
            params.delete("autoplay");
            params.delete("mute");
          }

          if (v.mobileLoop) {
            const videoId = this.extractVideoId(url.href);
            if (videoId) {
              params.set("loop", "1");
              params.set("playlist", videoId);
            }
          } else {
            params.delete("loop");
            params.delete("playlist");
          }

          if (v.mobileControls) {
            params.set("controls", "0");
            params.set("disablekb", "1");
          } else {
            params.delete("controls");
            params.delete("disablekb");
          }

          if (v.mobileWhiteProgress) {
            params.set("color", "white");
          } else {
            params.delete("color");
          }

          return url.toString();
        } catch {
          return ''
        }
      } else return this.settings[0].mobileVideoLink ? this.settings[0].mobileVideoLink : this.settings[0].videoLink
    }
  },
  mounted() {
    this.startAutoplay();
    const sectionsThemeComponents = null
    sectionsThemeComponents?.(this.section.name, [
      {
        id: 'global',
        name: this.$t('sectionsBuilder.globalSettings'),
        path: '/theme/global_settings'
      }
    ])
  },
  beforeUnmount() {
    clearInterval(this.autoplayInterval);
  },
  methods: {
    handleTouchStart(event) {
      this._touchStartX = event.touches[0].clientX;
    },
    handleTouchMove(event) {
      this._touchEndX = event.touches[0].clientX;
    },
    handleTouchEnd() {
      const swipeThreshold = 50; // Minimum swipe distance in pixels to trigger change
      const swipeDistance = this._touchStartX - this._touchEndX;

      if (swipeDistance > swipeThreshold) {
        this.resetAutoplay()
        this.next();
      } else if (swipeDistance < -swipeThreshold) {
        this.resetAutoplay()
        this.previous();
      }
    },
    goTo(index) {
      this.currentIndex = index;
      this.resetAutoplay();
    },
    next() {
      this.currentIndex = (this.currentIndex + 1) % this.migratedSettings.length;
    },
    previous() {
      if (this.currentIndex === 0) {
        this.currentIndex = this.migratedSettings.length
      }
      this.currentIndex = (this.currentIndex - 1) % this.migratedSettings.length;
    },
    startAutoplay() {
      if (this.migratedSettings && this.migratedSettings.length > 1) {
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
  height: 480px;
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

@media screen and (max-width: 768px) {
  .mobileHidden {
    display: none !important;
  }
}
</style>
