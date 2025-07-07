<template>
  <div v-if="product" class="product-details-wrapper main-wrapper py-2.5">

    <div class="flex flex-col md:flex-row justify-center w-full gap-6 row-wrapper">

      <div class="flex flex-col md:w-1/2 medias-block">
        <div v-if="mediaPreview && (mediaPreview.mediaType === 'image' || mediaPreview.mediaType === 'imageType')" class="image-preview md:justify-items-start justify-items-center">
          <img v-if="mediaPreview.media && mediaPreview.media.url" :src="mediaPreview.media.url" :alt="mediaPreview.media.seo_tag" class="rounded-lg md:w-[560px] h-[280px] md:h-[448px]" :style="product.imageFit ? `object-fit: ${product.imageFit};` : ''" />
        </div>
        <div v-if="mediaPreview && mediaPreview.mediaType === 'video'" class="video-preview md:w-[560px] h-[280px] md:h-[448px] content-center">
          <LazyYoutube v-if="mediaPreview.video && mediaPreview.video.url" :src="computedVideoUrl" max-width="1000px" :autoplay="product.autoplay" />
        </div>

        <div v-if="product.productMedias" class="flex flex-row gap-3 overflow-x-scroll mt-8 mx-1.5 medias-list">
          <div v-for="(mediaObject, idx) in product.productMedias" :key="`product-image-${idx}`" class="relative medias-list-item">
            <div v-if="mediaObject && mediaObject.mediaType === 'image'" class="medias-list-image">
              <img v-if="mediaObject.media && mediaObject.media.thumbnail_url" :src="mediaObject.media.thumbnail_url" :alt="mediaObject.media.seo_tag" class="w-[60px] min-w-[60px] h-[60px] object-contain cursor-pointer" draggable="false" :class="(mediaPreview.media && mediaPreview.media?.url === mediaObject.media.url) ? 'p-1 border-2 border-black shadow-md' : ''" @click="mediaPreview = mediaObject" />
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

      <div class="flex flex-col md:w-1/2 rounded-lg px-8 h-max details-main-wrapper self-center">

        <div class="flex flex-col gap-3 py-6 details-wrapper">
          <h2 class="product-name">{{ product.name[lang] }}</h2>

          <gWysiwygContent tag="p" :wrapper-classes="['desc-wrapper']" :classes="`p-0 h-auto pt-4`" :html-content="product.description[lang]" />

          <div class="flex flex-row price-block">
            <div class="currency">{{ product.currency }}</div>
            <div class="price">{{ product.price }}</div>
          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
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
  }
})

const { t: $t, locale } = useI18n({ useScope: 'local' })

const mediaPreview = ref({})

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

mediaPreview.value = props.product.productMedias[0]

watch(props.product, () => {
  mediaPreview.value = props.product.productMedias[0]
})
</script>

<style>
section .product-details-wrapper {
  container: product-details-wrapper / inline-size;
}

@container product-details-wrapper (max-width: 768px) {
  .product-details-wrapper .row-wrapper {
    flex-wrap: wrap;
  }
  .product-details-wrapper .medias-block, .product-details-wrapper .details-main-wrapper {
    width: 100% !important;
  }
  .product-details-wrapper .image-preview img {
    width: auto !important;
    height: auto !important;
  }
  .product-details-wrapper .image-preview {
    justify-items: center !important;
  }
}
@container product-details-wrapper (max-width: 1200px) {
  .product-details-wrapper .video-preview {
    width: auto !important;
    height: auto !important;
  }
}
</style>
