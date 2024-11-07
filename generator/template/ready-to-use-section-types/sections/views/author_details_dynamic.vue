<template>
  <BlogsAuthorView :section="section" :lang="lang" />
</template>

<script>

export default {
  name: 'AuthorDetailsDynamic',
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
		"total_views": "string",
		"total_blogs": "string",
		"social_media": "image",
		"profile_image": "image",
		"id": "65b21f7f1353160007b6ccc0",
		"full_name": "string",
		"biography": "string"
	  }
	}
  }
};
</script>
