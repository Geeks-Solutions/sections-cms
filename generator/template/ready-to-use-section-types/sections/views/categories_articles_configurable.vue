<template>
  <div ref="BlogsArticles">
    <div v-if="sectionRenderData">
      <BlogsArticles :section-render-data="sectionRenderData" :section-render-settings="sectionRenderSettings" :total-pages="totalPages" :lang="lang" :default-lang="defaultLang" list-type="listing" @page-changed="(offset) => pageChanged(offset)" />
    </div>
  </div>
</template>

<script>

import { useSectionsStore } from '~/stores/index.js'
import { mapState } from 'pinia'
import { BLOGS_LIST_SIZE, BLOGS_SECTION_PAGE_PATH, extractQsValue, updateQueryStringValue } from '@/utils/constants'
import { useCookie } from '#imports'

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
    },
    defaultLang: {
      type: String,
      default: "en"
    },
	viewStructure: {
	  render_data: [
		{
		  "settings": {
			"article_page_path": "string"
		  },
		  "data": {
			"total": 'integer',
			"count": 'integer',
			"articles": [
			  {
				"views": "integer",
				"viewing_time": "integer",
				"updated_at": "integer",
				"title": "string",
				"suggested": [
				  {
					"views": "integer",
					"viewing_time": "integer",
					"updated_at": "integer",
					"title": "string",
					"suggested": {
					  "title": "string"
					},
					"published": "boolean",
					"path": "string",
					"medias": [
					  "image"
					],
					"inserted_at": "integer",
					"id": "integer",
					"edited": "string",
					"description": "text",
					"created": "string",
					"categories": {
					  "title": "string"
					},
					"body": "text",
					"author_id": "string"
				  },
				  {
					"views": "integer",
					"viewing_time": "integer",
					"updated_at": "integer",
					"title": "string",
					"suggested": {
					  "title": "string"
					},
					"published": "boolean",
					"path": "string",
					"medias": "array",
					"inserted_at": "integer",
					"id": "integer",
					"edited": "string",
					"description": "text",
					"created": "string",
					"categories": {
					  "title": "string"
					},
					"body": "text",
					"author_id": "string"
				  }
				],
				"published": "boolean",
				"path": "string",
				"medias": [
				  "image"
				],
				"inserted_at": "integer",
				"id": "integer",
				"edited": "string",
				"description": "text",
				"created": "string",
				"categories": [
				  {
					"title": "string",
					"id": "integer",
					"count": "integer"
				  }
				],
				"body": "text",
				"author_id": "string"
			  },
			  {
				"views": "integer",
				"viewing_time": "integer",
				"updated_at": "integer",
				"title": "string",
				"suggested": [
				  {
					"views": "integer",
					"viewing_time": "integer",
					"updated_at": "integer",
					"title": "string",
					"suggested": {
					  "title": "string"
					},
					"published": "boolean",
					"path": "string",
					"medias": [
					  "image"
					],
					"inserted_at": "integer",
					"id": "integer",
					"edited": "string",
					"description": "text",
					"created": "string",
					"categories": {
					  "title": "string"
					},
					"body": "text",
					"author_id": "string"
				  },
				  {
					"views": "integer",
					"viewing_time": "integer",
					"updated_at": "integer",
					"title": "string",
					"suggested": {
					  "title": "string"
					},
					"published": "boolean",
					"path": "string",
					"medias": "array",
					"inserted_at": "integer",
					"id": "integer",
					"edited": "string",
					"description": "text",
					"created": "string",
					"categories": {
					  "title": "string"
					},
					"body": "text",
					"author_id": "string"
				  }
				],
				"published": "boolean",
				"path": "string",
				"medias": [
				  "image"
				],
				"inserted_at": "integer",
				"id": "integer",
				"edited": "string",
				"description": "text",
				"created": "string",
				"categories": [
				  {
					"title": "string",
					"id": "integer",
					"count": "integer"
				  }
				],
				"body": "text",
				"author_id": "string"
			  },
			  {
				"views": "integer",
				"viewing_time": "integer",
				"updated_at": "integer",
				"title": "string",
				"suggested": [
				  {
					"views": "integer",
					"viewing_time": "integer",
					"updated_at": "integer",
					"title": "string",
					"suggested": {
					  "title": "string"
					},
					"published": "boolean",
					"path": "string",
					"medias": [
					  "image"
					],
					"inserted_at": "integer",
					"id": "integer",
					"edited": "string",
					"description": "text",
					"created": "string",
					"categories": {
					  "title": "string"
					},
					"body": "text",
					"author_id": "string"
				  },
				  {
					"views": "integer",
					"viewing_time": "integer",
					"updated_at": "integer",
					"title": "string",
					"suggested": {
					  "title": "string"
					},
					"published": "boolean",
					"path": "string",
					"medias": "array",
					"inserted_at": "integer",
					"id": "integer",
					"edited": "string",
					"description": "text",
					"created": "string",
					"categories": {
					  "title": "string"
					},
					"body": "text",
					"author_id": "string"
				  }
				],
				"published": "boolean",
				"path": "string",
				"medias": [
				  "image"
				],
				"inserted_at": "integer",
				"id": "integer",
				"edited": "string",
				"description": "text",
				"created": "string",
				"categories": [
				  {
					"title": "string",
					"id": "integer",
					"count": "integer"
				  }
				],
				"body": "text",
				"author_id": "string"
			  }
			]
		  }
		}
	  ]
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
      let blogsListSize = BLOGS_LIST_SIZE
      if (this.sectionRenderSettings && this.sectionRenderSettings.default_limit) {
        blogsListSize = this.sectionRenderSettings.default_limit
      }
      if (extractQsValue('limit_ca', this.$route.path)) {
        extractQsValue('limit_ca', this.$route.path)
        blogsListSize = extractQsValue('limit_ca', this.$route.path)
      }
      if (this.sectionRenderData && this.sectionRenderData.articles) {
        return Math.ceil(this.sectionRenderData.total / blogsListSize)
      } else return 1
    },
    ...mapState(useSectionsStore, ['categoriesTitles'])
  },
  watch: {
    sectionRenderData() {
      if (this.$refs && this.$refs.BlogsArticles && !useCookie('sections-auth-token').value) {
        this.$nextTick(() => {
          this.$refs.BlogsArticles.scrollIntoView({ behavior: 'smooth'})
        })
      }
    }
  },
  methods: {
    pageChanged(offset) {
      updateQueryStringValue(this.$route.path, {
        offset_ca: offset
      }, false)
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
