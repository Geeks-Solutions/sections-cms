<template>
  <div class="w-full">
    <div id="cta_label" class="flex flex-col items-start justify-start">
      <label class="mr-4 font-bold">{{ $t("ctaLabel") }}</label>
      <input
        v-model="cta_label[selectedLang]"
        type="text"
        :placeholder="$t('ctaLabel')"
        :class="inputStyle"
        @input="changeFieldValue"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: "StringCtaLabel",
  props: ["options", "optionsData", "field", "customFormData", "sectionsUserId", "reference", "selectedLang", "locales"],
  data() {
    return {
      configurableReference: null,
      inputStyle: 'py-4 pl-6 border titleBorder rounded-xl h-[48px] w-full focus:outline-none',
      cta_label: {
        en: "",
        fr: ""
      }
    }
  },
  watch: {
    reference: {
      handler(value) {
        this.configurableReference = value.value
        if (this.configurableReference.optionsData.cta_label) {
          this.cta_label = this.configurableReference.optionsData.cta_label
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    changeFieldValue() {
      this.configurableReference.optionsData.cta_label = this.cta_label
      this.configurableReference.options[0].cta_label = this.cta_label
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
