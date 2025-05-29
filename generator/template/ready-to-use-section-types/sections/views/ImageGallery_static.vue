<template>
  <div v-if="settings" :ref="selectedLayout === 'thumbnails' ? 'thumbsWrapper' : ''" class="py-2.5 image-gallery-main-wrapper">
    <div class="max-w-7xl mx-auto image-gallery-main-inner">
      <div class="w-full image-gallery">
        <!-- Gallery Container -->
        <div class="w-full image-gallery-container">
          <!-- Vertical Masonry -->
          <GalleryLayoutVerticalMasonry :selected-layout="selectedLayout" :images="images" @openPreview="openPreview" />

          <!-- Horizontal Masonry -->
          <GalleryLayoutHorizontalMasonry :selected-layout="selectedLayout" :images="images" @openPreview="openPreview" />

          <!-- Grid -->
          <GalleryLayoutGrid :selected-layout="selectedLayout" :images="images" @openPreview="openPreview" />

          <!-- Slider -->
          <GalleryLayoutSlider :selected-layout="selectedLayout" :settings="settings" :images="images" :current-slide="currentSlide" @openPreview="openPreview" @previousSlide="previousSlide" @nextSlide="nextSlide" @goTo="goTo" />

          <!-- Thumbnails -->
          <GalleryLayoutThumbnails :selected-layout="selectedLayout" :settings="settings" :images="images" :current-slide="currentSlide" :thumbs-wrapper-width="thumbsWrapperWidth" @openPreview="openPreview" @updateCurrentSlide="(imageIdx) => currentSlide = imageIdx" />

        </div>

        <!-- Preview Modal -->
        <div
          v-if="isPreviewOpen"
          class="fixed inset-0 z-50 preview-image-wrapper flex items-center justify-center preview-image-wrapper"
          @click.self="closePreview"
        >
          <div class="relative w-full max-w-4xl max-h-screen overflow-visible shadow-xl preview-image-inner">
            <div class="relative flex justify-center items-center p-4 preview-image-wrapper-inner">
              <NuxtImg
                v-if="selectedImage && selectedImage.media && selectedImage.media.url"
                :src="selectedImage.media.url"
                :alt="selectedImage.media.seo_tag ? selectedImage.media.seo_tag : ''"
                class="w-auto max-w-full max-h-[80vh] object-contain transition-transform duration-200"
                :class="{'mobileHidden': selectedImage && selectedImage.mediaMobile && selectedImage.mediaMobile.url}"
                :style="{ transform: `scale(${zoom})` }"
                width="300"
           height="300"
           :placeholder="[300, 300, 75, 5]"
                loading="lazy"
                @wheel.prevent="handleZoom"
              />
              <NuxtImg
                v-if="selectedImage && selectedImage.mediaMobile && selectedImage.mediaMobile.url"
                :src="selectedImage.mediaMobile.url"
                :alt="selectedImage.mediaMobile.seo_tag ? selectedImage.mediaMobile.seo_tag : ''"
                class="w-auto max-w-full max-h-[80vh] object-contain transition-transform duration-200 md:hidden"
                :style="{ transform: `scale(${zoom})` }"
                width="300"
           height="300"
           :placeholder="[300, 300, 75, 5]"
                loading="lazy"
                @wheel.prevent="handleZoom"
              />
            </div>
          </div>
          <div class="absolute top-0 right-0 flex preview-image-controls-row">
            <div class="p-2 preview-image-controls md:cursor-pointer" @click="zoom = Math.min(3, zoom + 0.1)">
              <plus class="w-5 h-5" />
            </div>
            <div class="p-2 preview-image-controls md:cursor-pointer" @click="zoom = Math.max(1, zoom - 0.1)">
              <minus class="w-5 h-5" />
            </div>
            <div class="p-2 preview-image-controls md:cursor-pointer" @click="closePreview">
              <x-mark class="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import XMark from '../../components/icons/xMark.vue';
import Minus from '../../components/icons/minus.vue';
import Plus from '../../components/icons/plus.vue';
import GalleryLayoutHorizontalMasonry from '../../components/GalleryLayout/HorizontalMasonry.vue'
import GalleryLayoutVerticalMasonry from '../../components/GalleryLayout/VerticalMasonry.vue'
import GalleryLayoutGrid from '../../components/GalleryLayout/Grid.vue'
import GalleryLayoutSlider from '../../components/GalleryLayout/Slider.vue'
import GalleryLayoutThumbnails from '../../components/GalleryLayout/Thumbnails.vue'

export default {
  name: "ImageGallery",
  components: { GalleryLayoutThumbnails, GalleryLayoutSlider, GalleryLayoutGrid, GalleryLayoutHorizontalMasonry, GalleryLayoutVerticalMasonry, Plus, Minus, XMark },
  props: {
    section: {
      type: Object,
      default: () => {
        return {
          settings: [
            {}
          ]
        }
      },
    },
    lang: {
      type: String,
      default: "en"
    },
    viewStructure: {
      settings: [
        {
          selectedLayout: "grid",
          gallery: [
            {
              media: 'image',
              mediaMobile: 'image'
            },
            {
              media: 'image',
              mediaMobile: 'image'
            },
            {
              media: 'image',
              mediaMobile: 'image'
            },
            {
              media: 'image',
              mediaMobile: 'image'
            },
            {
              media: 'image',
              mediaMobile: 'image'
            },
            {
              media: 'image',
              mediaMobile: 'image'
            },
            {
              media: 'image',
              mediaMobile: 'image'
            },
            {
              media: 'image',
              mediaMobile: 'image'
            },
            {
              media: 'image',
              mediaMobile: 'image'
            },
            {
              media: 'image',
              mediaMobile: 'image'
            },
            {
              media: 'image',
              mediaMobile: 'image'
            },
            {
              media: 'image',
              mediaMobile: 'image'
            }
          ]
        }
      ]
    }
  },
  data() {
    return {
      currentSlide: 0,
      isPreviewOpen: false,
      selectedImage: null,
      zoom: 1,
      thumbsWrapperWidth: 0
    }
  },
  computed: {
    settings() {
      return this.section.settings
    },
    images() {
      if (this.settings && this.settings[0]) {
        return this.settings[0].gallery
      } else return []
    },
    selectedLayout() {
      if (this.settings && this.settings[0]) {
        return this.settings[0].selectedLayout
      } else return ''
    }
  },
  watch: {
    selectedLayout() {
      if (this.selectedLayout === 'thumbnails' && this.$refs.thumbsWrapper) {
        this.thumbsWrapperWidth = this.$refs.thumbsWrapper.clientWidth
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.thumbsWrapper) {
        this.thumbsWrapperWidth = this.$refs.thumbsWrapper.clientWidth
      }
    })
  },
  methods: {
    openPreview(image) {
      this.selectedImage = image
      this.isPreviewOpen = true
      this.zoom = 1
    },
    closePreview() {
      this.isPreviewOpen = false
      this.selectedImage = null
    },
    handleZoom(event) {
      const delta = event.deltaY > 0 ? -0.1 : 0.1
      this.zoom = Math.max(1, Math.min(3, this.zoom + delta))
    },
    previousSlide() {
      this.currentSlide = (this.currentSlide - 1 + this.images.length) % this.images.length
    },
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.images.length
    },
    goTo(idx) {
      this.currentSlide = idx
    }
  }
}
</script>

<style>
.image-gallery .preview-image-wrapper {
  background: #1e1e1e;
  background: rgba(17, 17, 17, 0.7);
}
.image-gallery .preview-image-controls {
  background: rgba(35, 35, 35, 0.65);
  fill: white;
  width: 45px;
  height: 45px;
  place-items: center;
  align-content: center;
}
.image-gallery .slides-container {
  height: 480px;
}
@media screen and (max-width: 768px) {
  .mobileHidden {
    display: none !important;
  }
}
</style>
