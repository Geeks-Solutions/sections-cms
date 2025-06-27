<template>
  <div class="w-full">
    <div id="default_sort" class="flex flex-col items-start justify-start">
      <label class="mr-4 font-bold">{{ $t("Sort")+'*' }}</label>
      <span class="text-xs mb-1">{{ $t("sortDesc1") }}</span>
      <span class="text-xs mb-1">{{ $t("sortDesc2") }}</span>
      <input
        v-model="default_sort"
        type="text"
        :placeholder="$t('Sort')"
        :class="inputStyle"
        @input="changeFieldValue"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: "ListDefaultSort",
  props: ["options", "optionsData", "field", "customFormData", "sectionsUserId", "reference", "selectedLang", "locales"],
  data() {
    return {
      configurableReference: null,
      inputStyle: 'py-4 pl-6 border titleBorder rounded-xl h-[48px] w-full focus:outline-none',
      default_sort: "{}"
    }
  },
  watch: {
    reference: {
      handler(value) {
        this.configurableReference = value.value
        if (this.configurableReference.optionsData.default_sort) {
          this.default_sort = JSON.stringify(this.configurableReference.optionsData.default_sort)
        } else {
          this.configurableReference.optionsData.default_sort = {}
          this.configurableReference.options[0].default_sort = {}
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    changeFieldValue() {
      try {
        this.configurableReference.optionsData.default_sort = JSON.parse(this.default_sort)
        this.configurableReference.options[0].default_sort = JSON.parse(this.default_sort)
      } catch {
        this.configurableReference.optionsData.default_sort = {}
        this.configurableReference.options[0].default_sort = {}
      }
    }
  }
}

</script>

<style>
.titleBorder {
  --tw-border-opacity: 1!important;
  border-color: #f2f2f3!important;
  border-color: rgba(242,242,243,var(--tw-border-opacity))!important;
}
</style>
