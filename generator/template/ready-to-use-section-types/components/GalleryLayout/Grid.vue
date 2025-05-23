<template>
  <div v-if="selectedLayout === 'grid'"
       class="grid-wrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    <div
      v-for="(image, imageIdx) in images"
      :key="`grid-${imageIdx}`"
      class="cursor-pointer aspect-w-1 aspect-h-1 grid-img-wrapper"
      @click="$emit('openPreview', image)"
    >
      <NuxtImg
        v-if="image.media && image.media.url"
        :src="image.media.url"
        :alt="image.media.seo_tag ? image.media.seo_tag : ''"
        class="w-full h-full object-cover hover:opacity-90 transition-opacity md:aspect-square"
        :class="{'mobileHidden': image.mediaMobile && image.mediaMobile.url}"
        width="300"
        height="300"
        :placeholder="[300, 300, 75, 5]"
        loading="lazy"
      />
      <NuxtImg
        v-if="image.mediaMobile && image.mediaMobile.url"
        :src="image.mediaMobile.url"
        :alt="image.mediaMobile.seo_tag ? image.mediaMobile.seo_tag : ''"
        class="w-full h-full object-cover hover:opacity-90 transition-opacity md:hidden md:aspect-square"
        width="300"
        height="300"
        :placeholder="[300, 300, 75, 5]"
        loading="lazy"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: 'GalleryLayoutGrid',
  props: {
    selectedLayout: {
      type: String,
      default: ''
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
