<template>
  <div class="md:cursor-pointer" @click="switchLang">
    {{ label }}
  </div>
</template>

<script>
export default {
  name: 'GlobalLangSwitcher',
  props: {
    label: {
      type: String,
      default: '',
    },
    lang: {
      type: String,
      default: 'en',
    },
    defaultLang: {
      type: String,
      default: 'en',
    },
  },
  methods: {
    switchLang() {
      const updatedLang = this.lang === 'fr' ? 'en' : 'fr'
      const currentState = history.state || {}
      if (updatedLang !== this.defaultLang) {
        let newPath = `/${updatedLang}${this.$route.fullPath}`
        if (this.$route.fullPath.startsWith(`/${updatedLang}`)) {
          newPath = newPath.replace(`/${updatedLang}`, '')
        }
        history.replaceState(currentState, '', newPath)
      } else if (updatedLang === this.defaultLang) {
        let newPath = this.$route.fullPath
        if (newPath.startsWith(`/${this.lang}`)) {
          newPath = newPath.replace(`/${this.lang}`, '')
        }
        history.replaceState(currentState, '', newPath)
      }
      this.$i18n.locale = updatedLang
      this.$i18n.setLocale(updatedLang)
      this.$emit('lang-switched', updatedLang)
    },
  },
}
</script>
