<template>
  <div class="w-full">
    <div id="default_limit" class="flex flex-col items-start justify-start">
      <label class="mr-4 font-bold">{{ $t("forms.defaultLimit")+'*' }}</label>
      <input
        v-model="default_limit"
        type="text"
        value=""
        :placeholder="$t('forms.defaultLimit')"
        :class="inputStyle"
        @input="changeFieldValue"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: "IntegerDefaultLimit",
  props: ["options", "optionsData", "field", "customFormData", "sectionsUserId", "reference", "selectedLang", "locales"],
  data() {
    return {
      configurableReference: null,
      inputStyle: 'py-4 pl-6 border titleBorder rounded-xl h-48px w-full focus:outline-none',
      default_limit: ""
    }
  },
  watch: {
    reference(value) {
      this.configurableReference = value
      if (this.configurableReference.optionsData.default_limit) {
        this.default_limit = Number(this.configurableReference.optionsData.default_limit)
      }
    }
  },
  methods: {
    changeFieldValue() {
      this.configurableReference.optionsData.default_limit = Number(this.default_limit)
      this.configurableReference.options[0].default_limit = Number(this.default_limit)
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
