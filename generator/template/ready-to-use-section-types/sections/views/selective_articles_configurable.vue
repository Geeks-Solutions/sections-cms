<template>
  <BlogsArticles :section-render-data="sectionRenderData" :section-render-settings="section.render_data && section.render_data[0] && section.render_data[0].settings ? section.render_data[0].settings : {}" :lang="lang" :default-lang="defaultLang" :title="sectionRenderSettings && sectionRenderSettings.title ? sectionRenderSettings.title : ''" :description="sectionRenderSettings && sectionRenderSettings.description ? sectionRenderSettings.description : ''" />
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
  computed: {
    sectionRenderData() {
      if (this.section.render_data && this.section.render_data[0] && this.section.render_data[0].data) {
        return this.section.render_data && this.section.render_data[0] && this.section.render_data[0].data
      } else return null
    },
    sectionRenderSettings() {
      if (this.section.render_data && this.section.render_data[0] && this.section.render_data[0].settings) {
        return this.section.render_data[0].settings
      } else return null
    }
  },
  mounted() {
    const languageSupport = inject('languageSupport')
    languageSupport?.(this.section.name)
    const sectionsThemeComponents = null
    sectionsThemeComponents?.(this.section.name, [
      {
        id: 'global',
        name: this.$t('sectionsBuilder.globalSettings'),
        path: '/theme/global_settings'
      }
    ])
  },
};
</script>
