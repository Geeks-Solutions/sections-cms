<template>
  <div
    v-if="(title && title[lang]) || (description && description[lang])"
    class="flex flex-col items-center gap-2 main-content-wrapper"
  >
    <h2 v-if="title && title[lang]">
      <gWysiwygContent
        tag="span"
        :classes="`html-content title p-0`"
        :html-content="title[lang]"
      />
    </h2>
    <p v-if="description && description[lang]">
      <gWysiwygContent
        tag="span"
        :classes="`html-content desc p-0`"
        :html-content="description[lang]"
      />
    </p>
  </div>
</template>

<script>
export default {
  name: 'ArticleTitleDescription',
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    lang: {
      type: String,
      default: '',
    },
  },
}
</script>
