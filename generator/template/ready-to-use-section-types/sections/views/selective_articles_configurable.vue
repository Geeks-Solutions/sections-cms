<template>
  <BlogsArticles :section-render-data="sectionRenderData" :section-render-settings="section.render_data && section.render_data[0] && section.render_data[0].settings ? section.render_data[0].settings : {}" :lang="lang" :title="$t('blogs.beautifulIdeas')" :description="$t('blogs.discoverFavorites')" />
</template>

<script>

export default {
  name: 'SelectiveArticlesConfigurable',
  props: {
    section: {
      type: Object,
      default: () => {},
    },
    lang: {
      type: String,
      default: "en"
    }
  },
  computed: {
    sectionRenderData() {
      if (this.section.render_data && this.section.render_data[0] && this.section.render_data[0].data) {
        return this.section.render_data && this.section.render_data[0] && this.section.render_data[0].data
      } else return null
    }
  }
};
</script>