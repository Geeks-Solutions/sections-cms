<template>
  <div class="w-full">
    <label class="mr-4 font-bold">{{ 'Full article page'+'*' }}</label>
    <div>
      <div class="selectMultipleOptions">
        <div v-for="(item, pageIdx) in sectionsPages" :key="`${item.page}-${pageIdx}`" class="multiple-options-wrapper">
          <div class="single-multiple-option" :class="isSelected(item.path) ? 'multiple-options-selected' : ''" @click="selectOption(item.path)">{{ item.page }}</div>
        </div>
      </div>
    </div>
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
.selectMultipleOptions {
  border-radius: 0.75rem;
  border-width: 1px;
  border-radius: 0.75rem;
  overflow-y: scroll;
  align-items: flex-start;
  flex-direction: column;
  max-width: 32rem;
  height: 250px;
  display: flex;
  margin-top: 0.5rem;
}

.single-multiple-option {
  padding-left: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  width: 100%;
}

.multiple-options-wrapper {
  width: 100%;
}

.multiple-options-selected {
  background: #C2C2C2;
}
</style>
