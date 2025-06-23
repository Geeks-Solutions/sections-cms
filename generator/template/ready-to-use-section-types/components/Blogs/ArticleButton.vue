<template>
  <global-link :link="path" :lang="lang" :default-lang="defaultLang" class="w-full">
    <div class="flex flex-row w-full gap-2">
      <div class="button-selector">
        {{ $t('blogs.readPost') }}
      </div>
    </div>
  </global-link>
</template>

<script>

export default {
  name: "ArticleButton",
  props: {
    path: {
      type: String,
      default: ""
    },
    lang: {
      type: String,
      default: "en"
    },
    defaultLang: {
      type: String,
      default: "en"
    },
  }
}
</script>
