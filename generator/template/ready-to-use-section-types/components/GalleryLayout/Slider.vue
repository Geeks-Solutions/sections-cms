<template>
  <div v-if="selectedLayout === 'slider'" class="relative slider-wrapper">
    <div class="aspect-w-16 aspect-h-9 overflow-hidden slides-container" :style="settings[0].containerHeight ? `height: ${settings[0].containerHeight};` : ``">
      <div
        class="flex transition-transform duration-300 ease-in-out w-full h-full slides-inner"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div
          v-for="(image, imageIdx) in images"
          :key="`slider-${imageIdx}`"
          class="w-full flex-shrink-0 cursor-pointer flex items-center justify-center"
          @click="$emit('openPreview', image)"
        >
          <img
            v-if="image.media && image.media.url"
            :src="image.media.url"
            :alt="image.media.seo_tag ? image.media.seo_tag : ''"
            class="w-full h-full"
            :class="{'mobileHidden': image.mediaMobile && image.mediaMobile.url}"
            :style="settings[0].imageFit ? `object-fit: ${settings[0].imageFit};` : ''"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
          />
          <img
            v-if="image.mediaMobile && image.mediaMobile.url"
            :src="image.mediaMobile.url"
            :alt="image.mediaMobile.seo_tag ? image.mediaMobile.seo_tag : ''"
            class="w-full h-full md:hidden"
            :style="settings[0].imageFit ? `object-fit: ${settings[0].imageFit};` : ''"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
          />
        </div>
      </div>
    </div>
    <div
      class="previousSlide absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white md:cursor-pointer"
      @click="$emit('previousSlide')"
    >
      <chevron-left class="w-6 h-6" />
    </div>
    <div
      class="nextSlide absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white md:cursor-pointer"
      @click="$emit('nextSlide')"
    >
      <chevron-right class="w-6 h-6" />
    </div>
    <div class="slider-dots absolute bottom-0 left-0 right-0 flex flex-wrap justify-center pb-4">
      <span v-for="(item, index) in images" :key="index" :class="images.length > 1 ? `slider-dot ${index === currentSlide ? 'active' : ''}` : ``" @click="$emit('goTo', index)"></span>
    </div>
  </div>
</template>

<script>

import ChevronRight from '../icons/chevron-right.vue'
import ChevronLeft from '../icons/chevron-left.vue'

export default {
  name: 'GalleryLayoutSlider',
  components: { ChevronLeft, ChevronRight },
  props: {
    selectedLayout: {
      type: String,
      default: ''
    },
    settings: {
      type: Array,
      default() {
        return []
      }
    },
    images: {
      type: Array,
      default() {
        return []
      }
    },
    currentSlide: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      autoplayInterval: null
    }
  },
  watch: {
    selectedLayout() {
      if (this.selectedLayout === 'slider') {
        this.startAutoplay();
      } else if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
      }
    }
  },
  mounted() {
    if (this.selectedLayout === 'slider') {
      this.startAutoplay();
    }
  },
  beforeDestroy() {
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
        this.$emit('nextSlide');
      } else if (swipeDistance < -swipeThreshold) {
        this.resetAutoplay()
        this.$emit('previousSlide');
      }
    },
    startAutoplay() {
      if (this.images && this.images.length > 1) {
        this.autoplayInterval = setInterval(() => {
          this.$emit('nextSlide');
        }, 5000);
      }
    },
    resetAutoplay() {
      clearInterval(this.autoplayInterval);
      this.startAutoplay();
    }
  }
}
</script>

<style>
.image-gallery .slider-dots .slider-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ddd;
  margin: 2px 4px;
  cursor: pointer;
}
.image-gallery .slider-dots .slider-dot.active {
  background-color: #333;
}
</style>
