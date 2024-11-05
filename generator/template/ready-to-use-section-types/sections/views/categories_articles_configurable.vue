<template>
  <div v-if="sectionRenderData && sectionRenderData.articles && sectionRenderData.articles.length === 1 && !$route.path.includes(BLOGS_SECTION_PAGE_PATH)">
    <BlogsArticlePreview :path="sectionRenderData.articles[0].path" :image="sectionRenderData.articles[0].medias && sectionRenderData.articles[0].medias[0] && sectionRenderData.articles[0].medias[0].files ? sectionRenderData.articles[0].medias[0].files[0].thumbnail_url : ''" :image-alt="sectionRenderData.articles[0].medias && sectionRenderData.articles[0].medias[0] && sectionRenderData.articles[0].medias[0].files ? sectionRenderData.articles[0].medias[0].files[0].seo_tag : ''" :title="sectionRenderData.articles[0].title" :content="sectionRenderData.articles[0].description" />
  </div>
  <div v-else-if="sectionRenderData">
    <BlogsArticles :section-render-data="sectionRenderData" :section-render-settings="sectionRenderSettings" :total-pages="totalPages" :lang="lang" list-type="listing" @page-changed="(offset) => pageChanged(offset)" />
  </div>
</template>

<script>

import {mapGetters} from "vuex";
import {BLOGS_LIST_SIZE, BLOGS_SECTION_PAGE_PATH} from "@/utils/constants";

export default {
  name: 'CategoriesArticlesConfigurable',
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
  data() {
    return {
      BLOGS_SECTION_PAGE_PATH
    }
  },
  computed: {
    sectionRenderData() {
      if (this.section.render_data && this.section.render_data[0] && this.section.render_data[0].data) {
        return this.section.render_data[0].data
      } else return null
    },
    sectionRenderSettings() {
      if (this.section.render_data && this.section.render_data[0] && this.section.render_data[0].settings) {
        return this.section.render_data[0].settings
      } else return null
    },
    totalPages() {
      if (this.sectionRenderData && this.sectionRenderData.articles) {
        return Math.ceil(this.sectionRenderData.total / BLOGS_LIST_SIZE)
      } else return 1
    },
    ...mapGetters({
      categoriesTitles: 'getCategoriesTitles'
    })
  },
  methods: {
    pageChanged(offset) {
      this.$emit('refresh-section', {
        qs: {
          categories_titles: this.categoriesTitles.includes(',') ? this.categoriesTitles.split(',') : this.categoriesTitles.length > 0 ? [this.categoriesTitles] : [],
          offset_ca: offset.toString()
        }
      })
    }
  }
};
</script>