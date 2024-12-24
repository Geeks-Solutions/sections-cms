<template>
  <BlogsArticlesCategories :section="section" :lang="lang" @category-clicked="categoryClicked" />
</template>

<script>
import {updateQueryStringValue,BLOGS_LIST_SIZE} from "@/utils/constants";

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
        categoriesTitles = item.map(c => c.title).join(',')
        qs = {
          offset_ca: 0,
          limit_ca: BLOGS_LIST_SIZE
        }
      } else {
        categoriesTitles = item.title
        qs = {
          offset_ca: 0,
          limit_ca: BLOGS_LIST_SIZE
        }
      }
      this.$nuxt.$emit('clearOffset')
      updateQueryStringValue(this.$route.path, {
        'categories_titles[]': null
      }, false)
      updateQueryStringValue(this.$route.path, {
        'categories_titles[]': categoriesTitles,
        'sort{}': JSON.stringify({}),
        ...qs
      }, false)
      this.$emit('refresh-section', {
        qs: {
          'categories_titles': Array.isArray(item) ? categoriesTitles.split(',') : [categoriesTitles],
          sort: {},
          ...qs
        }
      })
    }
  }
};
</script>
