<template>
  <global-link
    :link="path"
    :lang="lang"
    :default-lang="defaultLang"
    class="w-full"
  >
    <div class="flex flex-row w-full gap-2">
      <div class="button-selector">
        {{ $t('blogs.readPost') }}
      </div>
    </div>
  </global-link>
</template>

<i18n src="../../sections/forms/Blogs_i18n.json"></i18n>

<script>
export default {
  name: 'ArticleButton',
  setup() {
    const { t } = useI18n({
      useScope: 'local',
    })

    return {
      $t: t,
    }
  },
  props: {
    path: {
      type: String,
      default: '',
    },
    lang: {
      type: String,
      default: 'en',
    },
    defaultLang: {
      type: String,
      default: 'en',
    },
  },
}
</script>
