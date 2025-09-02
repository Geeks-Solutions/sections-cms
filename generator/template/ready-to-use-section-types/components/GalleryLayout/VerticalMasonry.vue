<template>
  <div v-if="selectedLayout === 'verticalMasonry'" class="vertical-masonry-wrapper columns-1 sm:columns-2 md:columns-3 gap-4">
    <div
      v-for="(image, imageIdx) in images"
      :key="`vertical-masonry-${imageIdx}`"
      class="break-inside-avoid mb-4 cursor-pointer"
      @click="$emit('openPreview', image)"
    >
      <GUniversalViewer
        v-if="image.media && image.media.url"
        :src="image.media.url"
        :alt="image.media.seo_tag ? image.media.seo_tag : ''"
        :type="image.media.metadata?.type || 'image'"
        class="w-full h-auto hover:opacity-90 transition-opacity"
        :class="{'mobileHidden': image.mediaMobile && image.mediaMobile.url}"
        width="300"
           height="300"
           :placeholder="[300, 300, 75, 5]" format="webp"
        loading="lazy"
      />
      <GUniversalViewer
        v-if="image.mediaMobile && image.mediaMobile.url"
        :src="image.mediaMobile.url"
        :alt="image.mediaMobile.seo_tag ? image.mediaMobile.seo_tag : ''"
        :type="image.mediaMobile.metadata?.type || 'image'"
        class="w-full h-auto hover:opacity-90 transition-opacity md:hidden"
        width="300"
           height="300"
           :placeholder="[300, 300, 75, 5]" format="webp"
        loading="lazy"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: 'GalleryLayoutVerticalMasonry',
  props: {
    selectedLayout: {
      type: String,
      default: ""
    },
    images: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>
