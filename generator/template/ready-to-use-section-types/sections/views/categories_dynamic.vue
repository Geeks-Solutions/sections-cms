<template>
  <BlogsArticlesCategories :section="section" :lang="lang" @category-clicked="categoryClicked" />
</template>

<script>
import {updateQueryStringValue} from "@/utils/constants";
import { useSectionsStore } from '~/stores/index.js'

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
      const sectionsStore = useSectionsStore()
      sectionsStore.setCategoriesTitles(categoriesTitles)
      const { $event } = useNuxtApp()
      $event('clearOffset')
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
