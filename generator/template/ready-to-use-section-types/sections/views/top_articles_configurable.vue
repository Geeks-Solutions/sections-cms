<template>
  <BlogsArticles :section-render-data="sectionRenderData" :section-render-settings="sectionRenderSettings" :lang="lang" list-type="listing" />
</template>

<script>

export default {
  name: 'TopArticlesConfigurable',
  props: {
    section: {
      type: Object,
      default: () => {},
    },
    lang: {
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
        return this.section.render_data[0].data
      } else return null
    },
    sectionRenderSettings() {
      if (this.section.render_data && this.section.render_data[0] && this.section.render_data[0].settings) {
        return this.section.render_data[0].settings
      } else return null
    }
  }
};
</script>

<style>
.grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem; /* 6 * 0.25rem = 1.5rem for gap-6 */
}

/* Grid columns for medium screens and above */
@media (min-width: 768px) { /* Tailwind's md breakpoint */
  .md\:grid-cols-3 {
	grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .md\:gap-8 {
	gap: 2rem; /* 8 * 0.25rem = 2rem for gap-8 */
  }
}
</style>
