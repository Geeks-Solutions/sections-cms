<template>
  <div v-if="selectedLayout === 'horizontalMasonry'"
       class="horizontal-masonry-wrapper grid auto-rows-[250px] grid-flow-row-dense grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4"
  >
    <div
      v-for="(image, imageIdx) in images"
      :key="`horizontal-masonry-${imageIdx}`"
      :class="[
                'relative cursor-pointer',
                image.media.metadata && image.media.metadata.height && image.media.metadata.width && image.media.metadata.height <= image.media.metadata.width ? 'col-span-2' : ''
              ]"
      @click="$emit('openPreview', image)"
    >
      <img
        v-if="image.media && image.media.url"
        :src="image.media.url"
        :alt="image.media.seo_tag ? image.media.seo_tag : ''"
        class="w-full h-full object-cover hover:opacity-90 transition-opacity"
        :class="{'mobileHidden': image.mediaMobile && image.mediaMobile.url}"
      />
      <img
        v-if="image.mediaMobile && image.mediaMobile.url"
        :src="image.mediaMobile.url"
        :alt="image.mediaMobile.seo_tag ? image.mediaMobile.seo_tag : ''"
        class="w-full h-full object-cover hover:opacity-90 transition-opacity md:hidden"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: 'GalleryLayoutHorizontalMasonry',
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
