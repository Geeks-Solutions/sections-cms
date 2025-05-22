<template>
  <div class="w-full">
    <div id="base_url" class="flex flex-col items-start justify-start">
      <label class="mr-4 font-bold">{{ $t("forms.baseUrl")+'*' }}</label>
      <input
        v-model="base_url"
        type="text"
        :placeholder="$t('forms.baseUrl')"
        :class="inputStyle"
        @input="changeFieldValue"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: "StringBaseUrl",
  props: ["options", "optionsData", "field", "customFormData", "sectionsUserId", "reference", "selectedLang", "locales"],
  data() {
    return {
      configurableReference: null,
      inputStyle: 'py-4 pl-6 border titleBorder rounded-xl h-[48px] w-full focus:outline-none',
      base_url: ""
    }
  },
  watch: {
    reference: {
      handler(value) {
        this.configurableReference = value.value
        if (this.configurableReference.optionsData.base_url && typeof this.configurableReference.optionsData.base_url === 'string') {
          this.base_url = this.configurableReference.optionsData.base_url
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    changeFieldValue() {
      this.configurableReference.optionsData.base_url = this.base_url
      this.configurableReference.options[0].base_url = this.base_url
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
