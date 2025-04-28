<template>
  <BlogsArticlesCategories :section="section" :lang="lang" @category-clicked="categoryClicked" />
</template>

<script>
import {updateQueryStringValue} from "@/utils/constants";

export default {
  name: 'CategoriesDynamic',
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
		  "title": "string",
		  "id": "integer",
		  "count": "integer"
		},
		{
		  "title": "string",
		  "id": "integer",
		  "count": "integer"
		},
		{
		  "title": "string",
		  "id": "integer",
		  "count": "integer"
		},
		{
		  "title": "string",
		  "id": "integer",
		  "count": "integer"
		},
		{
		  "title": "string",
		  "id": "integer",
		  "count": "integer"
		},
		{
		  "title": "string",
		  "id": "integer",
		  "count": "integer"
		},
		{
		  "title": "string",
		  "id": "integer",
		  "count": "integer"
		},
		{
		  "title": "string",
		  "id": "integer",
		  "count": "integer"
		},
		{
		  "title": "string",
		  "id": "integer",
		  "count": "integer"
		},
		{
		  "title": "string",
		  "id": "integer",
		  "count": "integer"
		},
		{
		  "title": "string",
		  "id": "integer",
		  "count": "integer"
		},
		{
		  "title": "string",
		  "id": "integer",
		  "count": "integer"
		},
		{
		  "title": "string",
		  "id": "integer",
		  "count": "integer"
		},
		{
		  "title": "string",
		  "id": "integer",
		  "count": "integer"
		}
	  ]
	}
  },
  methods: {
    categoryClicked(item) {
      let qs
      let categoriesTitles
      if (Array.isArray(item)) {
        categoriesTitles = item.map(c => c.original_title).join(',')
        qs = {
          offset_ca: 0
        }
      } else {
        categoriesTitles = item.original_title
        qs = {
          offset_ca: 0
        }
      }
      this.$store.commit('setCategoriesTitles', categoriesTitles)
      this.$nuxt.$emit('clearOffset')
      updateQueryStringValue(this.$route.path, {
        'categories_titles[]': null
      }, false)
      updateQueryStringValue(this.$route.path, {
        'categories_titles[]': categoriesTitles,
        ...qs
      }, false)
      this.$emit('refresh-section', {
        qs: {
          'categories_titles': Array.isArray(item) ? categoriesTitles.split(',') : [categoriesTitles],
          ...qs
        }
      })
    }
  }
};
</script>
