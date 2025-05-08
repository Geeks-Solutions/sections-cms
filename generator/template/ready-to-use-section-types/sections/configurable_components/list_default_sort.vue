<template>
  <div class="w-full">
    <div id="default_sort" class="flex flex-col items-start justify-start">
      <label class="mr-4 font-bold">{{ $t("forms.defaultSort")+'*' }}</label>
      <input
        v-model="default_sort[0][1]"
        type="text"
        value=""
        :placeholder="$t('forms.defaultSort')"
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
      inputStyle: 'py-4 pl-6 border titleBorder rounded-xl h-48px w-full focus:outline-none',
      default_sort: [
          [
            "values.release_date",
            ""
          ]
      ]
    }
  },
  watch: {
    reference(value) {
      this.configurableReference = value
      if (this.configurableReference.optionsData.default_sort) {
        this.default_sort = this.configurableReference.optionsData.default_sort
      }
    }
  },
  methods: {
    changeFieldValue() {
      this.configurableReference.optionsData.default_sort = this.default_sort
      this.configurableReference.options[0].default_sort = this.default_sort
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
