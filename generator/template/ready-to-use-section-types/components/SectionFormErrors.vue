<template>
  <div>
    <span
      v-if="showSectionError && selectedLang !== defaultLang"
      id="required-fields"
      class="flexSections sections-required-field-error"
      >{{ $t('checkRequiredField', { lang: defaultLang }) }}</span
    >
  </div>
</template>

<script>
export default {
  name: 'SectionFormErrors',
  props: {
    selectedLang: {
      type: String,
      default: 'en',
    },
    defaultLang: {
      type: String,
      default: 'en',
    },
    locales: {
      type: Array,
      default() {
        return []
      },
    },
    errors: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    showSectionError() {
      try {
        const hasTrueValue = (obj) => {
          if (Array.isArray(obj)) {
            return obj.some((item) => hasTrueValue(item))
          } else if (typeof obj === 'object' && obj !== null) {
            return Object.values(obj).some((value) => hasTrueValue(value))
          } else {
            return obj === true
          }
        }
        return hasTrueValue(this.errors)
      } catch {
        return false
      }
    },
  },
}
</script>
