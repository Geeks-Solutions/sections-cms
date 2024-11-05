<template>
  <div class="flex flex-col md:flex-row gap-6 md:gap-24 px-5 md:px-24 py-10 md:py-20">
    <div v-if="image">
      <img :src="image" :alt="imageAlt" class="md:min-w-[440px] md:w-440px h-180px xs:h-240px md:h-280px object-cover rounded-2xl" />
    </div>
    <div class="flex flex-col gap-4 w-full">

      <div class="flex flex-row justify-between">
        <div class="flex flex-row gap-2 items-end">
          <div></div>
          <div class="text-xl xs:text-3xl font-extrabold text-Gray_900">{{ title }}</div>
        </div>
		<div></div>
      </div>

      <div class="text-base md:text-xl text-Gray_800" v-html="content"></div>

      <nuxt-link :to="path ? localePath(`/${path}`) : ''" class="w-full">
        <Button :label="$t('blogs.readStory')" type="primary" size="lg" @button-clicked="() => {}" />
      </nuxt-link>

    </div>
  </div>
</template>

<script>
export default {
  name: "ArticlePreview",
  props: {
    image: {
      type: String,
      default: ""
    },
    imageAlt: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    path: {
      type: String,
      default: ""
    }
  }
}
</script>
