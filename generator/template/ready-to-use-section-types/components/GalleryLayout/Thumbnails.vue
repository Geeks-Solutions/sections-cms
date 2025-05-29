<template>
  <div v-if="selectedLayout === 'thumbnails'" class="space-y-4 thumbnails-wrapper">
    <div class="aspect-w-16 aspect-h-9 overflow-hidden slides-container"
         :style="settings[0].containerHeight ? `height: ${settings[0].containerHeight};` : ``">
      <NuxtImg
        v-if="images[currentSlide].media && images[currentSlide].media.url"
        :src="images[currentSlide].media.url"
        :alt="images[currentSlide].media.seo_tag ? images[currentSlide].media.seo_tag : ''"
        class="w-full h-full cursor-pointer"
        :class="{'mobileHidden': images[currentSlide].mediaMobile && images[currentSlide].mediaMobile.url}"
        :style="settings[0].imageFit ? `object-fit: ${settings[0].imageFit};` : ''"
        width="300"
           height="300"
           :placeholder="[300, 300, 75, 5]"
        loading="lazy"
        @click="$emit('openPreview', images[currentSlide])"
      />
      <NuxtImg
        v-if="images[currentSlide].mediaMobile && images[currentSlide].mediaMobile.url"
        :src="images[currentSlide].mediaMobile.url"
        :alt="images[currentSlide].mediaMobile.seo_tag ? images[currentSlide].mediaMobile.seo_tag : ''"
        class="w-full h-full cursor-pointer md:hidden"
        :style="settings[0].imageFit ? `object-fit: ${settings[0].imageFit};` : ''"
        width="300"
           height="300"
           :placeholder="[300, 300, 75, 5]"
        loading="lazy"
        @click="$emit('openPreview', images[currentSlide])"
      />
    </div>
    <div class="relative">
      <div class="overflow-x-hidden p-2">
        <div
          class="flex transition-transform duration-300 ease-in-out gap-2"
          :class="canScrollThumbnailsLeft === true || canScrollRight === true ? '' : 'justify-center'"
          :style="{ transform: `translateX(-${thumbnailScroll}px)` }"
        >
          <div
            v-for="(image, imageIdx) in images"
            :key="`thumbnails-${imageIdx}`"
            :class="[
                  'cursor-pointer flex-shrink-0 w-24 aspect-w-1 aspect-h-1 overflow-hidden hover:ring-2 hover:ring-slate-900',
                  currentSlide === imageIdx ? 'ring-2 ring-slate-900' : ''
                ]"
            @click="$emit('updateCurrentSlide', imageIdx)"
          >
            <NuxtImg
              v-if="image.media && image.media.url"
              :src="image.media.url"
              :alt="image.media.seo_tag ? image.media.seo_tag : ''"
              class="w-full h-full object-cover"
              :class="[{'opacity-70': currentSlide !== imageIdx}, {'mobileHidden': image.mediaMobile && image.mediaMobile.url}]"
              width="300"
           height="300"
           :placeholder="[300, 300, 75, 5]"
              loading="lazy"
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
              @touchend="handleThumbnailsTouchEnd"
            />
            <NuxtImg
              v-if="image.mediaMobile && image.mediaMobile.url"
              :src="image.mediaMobile.url"
              :alt="image.mediaMobile.seo_tag ? image.mediaMobile.seo_tag : ''"
              class="w-full h-full object-cover md:hidden"
              :class="{'opacity-70': currentSlide !== imageIdx}"
              width="300"
           height="300"
           :placeholder="[300, 300, 75, 5]"
              loading="lazy"
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
              @touchend="handleThumbnailsTouchEnd"
            />
          </div>
        </div>
      </div>
      <div
        v-if="canScrollThumbnailsLeft"
        class="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white md:cursor-pointer"
        @click="scrollThumbnails('left')"
      >
        <chevron-left class="w-4 h-4" />
      </div>
      <div
        v-if="canScrollRight === true"
        class="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white md:cursor-pointer"
        @click="scrollThumbnails('right')"
      >
        <chevron-right class="w-4 h-4" />
      </div>
    </div>
  </div>
</template>

<script>

import ChevronRight from '../icons/chevron-right.vue'
import ChevronLeft from '../icons/chevron-left.vue'

export default {
  name: 'GalleryLayoutThumbnails',
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
    },
    thumbsWrapperWidth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      thumbnailScroll: 0,
      canScrollRight: false
    }
  },
  computed: {
    canScrollThumbnailsLeft() {
      return this.thumbnailScroll > 0
    }
  },
  watch: {
    selectedLayout() {
      if (this.selectedLayout === 'thumbnails') {
        this.canScrollThumbnailsRight();
      }
    },
    thumbsWrapperWidth: {
      handler() {
        if (this.thumbsWrapperWidth !== null && this.thumbsWrapperWidth !== undefined) {
          this.canScrollThumbnailsRight();
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.canScrollThumbnailsRight();
  },
  methods: {
    canScrollThumbnailsRight() {
      this.$nextTick(() => {
        if (process.client) {
          const thumbnailWidth = 96
          const containerWidth = this.thumbsWrapperWidth ? this.thumbsWrapperWidth - 96 : 0
          const totalWidth = this.images.length * (thumbnailWidth + 8)
          this.canScrollRight = this.thumbnailScroll < totalWidth - containerWidth
        } else this.canScrollRight = false
      })
    },
    handleTouchStart(event) {
      this._touchStartX = event.touches[0].clientX;
    },
    handleTouchMove(event) {
      this._touchEndX = event.touches[0].clientX;
    },
    handleThumbnailsTouchEnd() {
      const swipeThreshold = 50; // Minimum swipe distance in pixels to trigger change
      const swipeDistance = this._touchStartX - this._touchEndX;

      if (swipeDistance > swipeThreshold) {
        if (this.canScrollRight === true) {
          this.scrollThumbnails('right')
        }
      } else if (swipeDistance < -swipeThreshold) {
        this.scrollThumbnails('left')
      }
    },
    scrollThumbnails(direction) {
      const scrollAmount = 96 // 24rem
      if (direction === 'left') {
        this.thumbnailScroll = Math.max(0, this.thumbnailScroll - scrollAmount)
      } else {
        this.thumbnailScroll += scrollAmount
      }
      this.canScrollThumbnailsRight();
    }
  }
}
</script>
