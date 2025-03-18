<template>
  <div class="w-full">
    <label class="mr-4 font-bold">{{ 'Full article page'+'*' }}</label>
    <gAutoComplete
      :main-filter="article_page_path"
      :placeholder="$t('forms.aspectRatio')"
      :filter-label-prop="'page'"
      :reduce="(option) => option.path"
      :filter-options="[...sectionsPages]"
      :filter-searchable="false"
      :close-on-select="true"
      :filter-clearable="true"
      :track-by="'path'"
      @itemSelected="
                  (val) => {
                    selectOption(val)
                  }
                "
    >
    </gAutoComplete>
  </div>
</template>

<script>

import {sectionHeader} from "@geeks.solutions/nuxt-sections/lib/src/utils";
import {getSectionsPages} from "@/utils/constants";

export default {
  name: "LinkArticlePagePath",
  props: ["options", "optionsData", "field", "customFormData", "sectionsUserId", "reference", "selectedLang", "locales", "optionValues"],
  data() {
    return {
      configurableReference: null,
      inputStyle: 'py-4 pl-6 border titleBorder rounded-xl h-48px w-full focus:outline-none',
      article_page_path: "",
      sectionsPages: []
    }
  },
  watch: {
    reference(value) {
      this.configurableReference = value
      if (this.configurableReference.optionsData.article_page_path) {
        this.article_page_path = this.configurableReference.optionsData.article_page_path
      }
    }
  },
  async mounted() {
    this.$nuxt.$emit('initLoading', true)
    this.sectionsPages = await getSectionsPages(sectionHeader({token: window.$nuxt.$cookies.get('sections-auth-token')}))
    this.$nuxt.$emit('initLoading', false)
  },
  methods: {
    isSelected(path) {
      return this.article_page_path === path
    },
    selectOption(value) {
      this.article_page_path = value
      this.configurableReference.optionsData.article_page_path = value
      this.configurableReference.options[0].article_page_path = value
    }
  }
}

</script>

<style>
.vs__dropdown-option {
  clear: both;
  color: black !important; /* Overrides most CSS frameworks */
  white-space: nowrap;
  cursor: pointer;
}
.vs__dropdown-option:hover {
  color: white !important;
}
.vs__dropdown-option--highlight {
  color: white !important;
}
</style>
