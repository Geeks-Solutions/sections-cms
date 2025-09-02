<template>
  <div v-if="product" class="product-details-wrapper main-wrapper py-2.5">

    <div class="flex flex-col md:flex-row justify-center w-full gap-6 row-wrapper">

      <div class="flex flex-col md:w-1/2 medias-block items-center">
        <div v-if="mediaPreview && Object.keys(mediaPreview).length > 0 && (mediaPreview.mediaType === 'image' || mediaPreview.mediaType === 'imageType')" class="image-preview md:justify-items-start justify-items-center md:cursor-pointer" @click="openPreview(mediaPreview)">
          <GUniversalViewer
            v-if="mediaPreview.media && mediaPreview.media.url"
            :src="mediaPreview.media.url"
            :alt="mediaPreview.media.seo_tag"
            :type="mediaPreview.media.metadata?.type || 'image'"
            class="rounded-lg md:w-[560px] h-[280px] md:h-[310px]"
            :style="product.imageFit ? `object-fit: ${product.imageFit};` : ''"
            width="300"
            height="300"
            :placeholder="[300, 300, 75, 5]" format="webp"
            loading="lazy"/>
        </div>
        <div v-if="mediaPreview && mediaPreview.mediaType === 'video'" class="video-preview md:w-[560px] h-[280px] md:h-[310px] content-center">
          <LazyYoutube v-if="mediaPreview.video && mediaPreview.video.url" :src="computedVideoUrl" max-width="1000px" :autoplay="product.autoplay" />
        </div>

        <div v-if="product.productMedias && product.productMedias.length > 1" class="flex flex-row gap-3 overflow-x-scroll max-w-full mt-4 mx-1.5 medias-list">
          <div v-for="(mediaObject, idx) in product.productMedias" :key="`product-image-${idx}`" class="relative medias-list-item">
            <div v-if="mediaObject && mediaObject.mediaType === 'image'" class="medias-list-image">
              <GUniversalViewer
                v-if="(mediaObject.media && mediaObject.media.thumbnail_url) || (mediaObject.media && mediaObject.media.url)"
                :src="mediaObject.media.metadata?.type === 'lottie' ? mediaObject.media.url : mediaObject.media.thumbnail_url"
                :alt="mediaObject.media.seo_tag"
                :type="mediaObject.media.metadata?.type || 'image'"
                class="w-[60px] min-w-[60px] h-[60px] object-contain cursor-pointer"
                draggable="false"
                :class="(mediaPreview.media && mediaPreview.media?.url === mediaObject.media.url) ? 'p-1 border-2 border-black shadow-md' : ''"
                width="300"
                height="300"
                :placeholder="[300, 300, 75, 5]" format="webp"
                loading="lazy"
                @click="showPreview(mediaObject)" />
            </div>
            <div v-if="mediaObject && mediaObject.mediaType === 'video'" class="medias-list-video w-[60px] min-w-[60px] h-[60px] content-center pointer-events-auto md:cursor-pointer" :class="(mediaPreview.video && mediaPreview.video?.url === mediaObject.video?.url) ? 'px-1 pt-1 pb-2.5 border-2 border-black shadow-md' : ''" @click="mediaPreview = mediaObject">
              <LazyYoutube v-if="mediaObject.video && mediaObject.video.url" :src="mediaObject.video.url" max-width="60px" class="pointer-events-none">
                <template #button>
                  <div></div>
                </template>
              </LazyYoutube>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:w-1/2 rounded-lg px-8 justify-between details-main-wrapper">

        <div class="flex flex-col gap-3 pb-6 details-wrapper">
          <h2 class="product-name">{{ product.name[lang] }}</h2>

          <div class="flex self-start price-block" :class="product.currencyPosition && product.currencyPosition === 'right' ? 'flex-row-reverse' : 'flex-row'">
            <div class="currency text-3xl">{{ product.currency }}</div>
            <div class="price text-3xl">{{ product.price }}</div>
          </div>

          <gWysiwygContent v-if="product.description[lang] && product.description[lang] !== '<p><br></p>'" tag="p" :wrapper-classes="['desc-wrapper']" :classes="`p-0 h-auto pt-4`" :html-content="product.description[lang]" />

        </div>

        <global-link v-if="product.ctaLabel && product.ctaLabel[lang]"
                     :link="product.sectionsPage[lang] === 'other' ? product.ctaLink : product.sectionsPage && product.sectionsPage[lang] ? { ...product.sectionsPage, en: '/' + product.sectionsPage.en, fr: '/' + product.sectionsPage.fr } : '#'"
                     :lang="lang"
                     :default-lang="defaultLang"
                     :form-link-target="product.linkTarget"
                     class="button-wrapper w-max"
                     :class="product.productMedias && product.productMedias.length > 1 ? 'btn-bottom-align' : ''">
          <div class="button-selector">
            {{ product.ctaLabel[lang] }}
          </div>
        </global-link>

      </div>

    </div>

    <!-- Preview Modal -->
    <div
      v-if="isPreviewOpen"
      class="fixed inset-0 z-50 preview-image-wrapper flex items-center justify-center preview-image-wrapper"
      @click.self="closePreview"
    >
      <div class="relative w-full max-w-4xl max-h-screen overflow-visible shadow-xl preview-image-inner">
        <div class="relative flex justify-center items-center p-4 preview-image-wrapper-inner">
          <GUniversalViewer
            v-if="selectedImage && selectedImage.media && selectedImage.media.url"
            :src="selectedImage.media.url"
            :alt="selectedImage.media.seo_tag ? selectedImage.media.seo_tag : ''"
            :type="selectedImage.media.metadata?.type || 'image'"
            class="w-auto max-w-full max-h-[80vh] object-contain transition-transform duration-200"
            :style="{ transform: `scale(${zoom})` }"
            width="300"
            height="300"
            :placeholder="[300, 300, 75, 5]" format="webp"
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
</template>

<script setup>
import Plus from '~/components/icons/plus.vue'
import XMark from '~/components/icons/xMark.vue'
import Minus from '~/components/icons/minus.vue'

const props = defineProps({
  product: {
    type: Object,
    default() {
      return {}
    }
  },
  lang: {
    type: String,
    default: "en"
  },
  defaultLang: {
    type: String,
    default: "en"
  }
})

const { t: $t, locale } = useI18n({ useScope: 'local' })

const mediaPreview = ref({})

const isPreviewOpen = ref(false)

const selectedImage = ref(null)

const zoom = ref(1)

const computedVideoUrl = computed(() => {
  if (props.product && mediaPreview.value.video?.url && isYouTubeLink(mediaPreview.value.video?.url)) {
    const v = props.product
    try {
      const url = new URL(mediaPreview.value.video?.url);
      const params = url.searchParams;

      params.set("hl", locale.value);
      params.set("rel", "0");

      if (v.autoplay) {
        params.set("autoplay", "1");
        params.set("mute", "1");
      } else {
        params.delete("autoplay");
        params.delete("mute");
      }

      if (v.loop) {
        const videoId = extractVideoId(url.href);
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
  } else return mediaPreview.value.video?.url
})

function extractVideoId(url) {
  const regex = /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function isYouTubeLink(url) {
  try {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)(\/.*)?$/;
    return regex.test(url);
  } catch {
    return false
  }
}

function openPreview(image) {
  selectedImage.value = image
  isPreviewOpen.value = true
  zoom.value = 1
}

function closePreview() {
  isPreviewOpen.value = false
  selectedImage.value = null
}

function handleZoom(event) {
  const delta = event.deltaY > 0 ? -0.1 : 0.1
  zoom.value = Math.max(1, Math.min(3, zoom.value + delta))
}

const showPreview = async (mediaObject) => {
  mediaPreview.value = {}
  await nextTick()
  mediaPreview.value = mediaObject
}

mediaPreview.value = props.product.productMedias[0]

watch(props.product, () => {
  mediaPreview.value = props.product.productMedias[0]
})
</script>

<style>
section .product-details-wrapper {
  container: product-details-wrapper / inline-size;
}

.product-details-wrapper .button-wrapper.btn-bottom-align {
  margin-bottom: 91px;
}

@container product-details-wrapper (max-width: 1200px) {
  .product-details-wrapper .video-preview {
    width: 100% !important;
    height: auto !important;
  }
}

@container product-details-wrapper (max-width: 768px) {
  .product-details-wrapper .row-wrapper {
    flex-wrap: wrap;
  }
  .product-details-wrapper .medias-block, .product-details-wrapper .details-main-wrapper {
    width: 100% !important;
  }
  .product-details-wrapper .image-preview img {
    width: 280px !important;
    height: 280px !important;
  }
  .product-details-wrapper .image-preview {
    justify-items: center !important;
  }
  .product-details-wrapper .button-wrapper.btn-bottom-align {
    margin-bottom: 0;
  }
  .product-details-wrapper .video-preview {
    width: 100% !important;
    height: auto !important;
  }
}
.product-details-wrapper .preview-image-wrapper {
  background: #1e1e1e;
  background: rgba(17, 17, 17, 0.7);
}
.product-details-wrapper .preview-image-controls {
  background: rgba(35, 35, 35, 0.65);
  fill: white;
  width: 45px;
  height: 45px;
  place-items: center;
  align-content: center;
}
</style>
