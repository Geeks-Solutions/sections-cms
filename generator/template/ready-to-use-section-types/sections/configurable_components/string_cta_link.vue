<template>
  <div class="w-full">
    <div id="cta_link" class="flex flex-col items-start justify-start">
      <label class="mr-4 font-bold">{{ $t("forms.ctaLink") }}</label>
      <input
        v-model="cta_link"
        type="text"
        :placeholder="$t('forms.ctaLink')"
        :class="inputStyle"
        @input="changeFieldValue"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: "StringCtaLink",
  props: ["options", "optionsData", "field", "customFormData", "sectionsUserId", "reference", "selectedLang", "locales"],
  data() {
    return {
      configurableReference: null,
      inputStyle: 'py-4 pl-6 border titleBorder rounded-xl h-[48px] w-full focus:outline-none',
      cta_link: ""
    }
  },
  watch: {
    reference: {
      handler(value) {
        this.configurableReference = value.value
        if (this.configurableReference.optionsData.cta_link && typeof this.configurableReference.optionsData.cta_link === 'string') {
          this.cta_link = this.configurableReference.optionsData.cta_link
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    changeFieldValue() {
      this.configurableReference.optionsData.cta_link = this.cta_link
      this.configurableReference.options[0].cta_link = this.cta_link
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
