<template>
  <nuxt-link :to="localePath(path)" class="w-full">
    <div class="flex flex-row w-full gap-2">
      <div class="button-selector">
        {{ $t('blogs.readPost') }}
      </div>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  name: "ArticleButton",
  props: {
    path: {
      type: String,
      default: ""
    }
  }
}
</script>
