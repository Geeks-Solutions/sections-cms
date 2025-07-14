<template>
  <BlogsFullArticle :section="section" :lang="lang" />
</template>

<script>

export default {
  name: 'FullArticlesDynamic',
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
	  render_data: {
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
	}
  },
  created() {
    this.$emit('seo-support', true)
  },
  mounted() {
    const languageSupport = inject('languageSupport')
    languageSupport?.(this.section.name)
  },
};
</script>
