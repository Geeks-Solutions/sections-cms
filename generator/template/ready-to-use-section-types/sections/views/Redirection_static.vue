<template>
  <div v-if="settings">
    <gWysiwygContent tag="p" :wrapper-classes="settings.classes" :classes="`mobileTitleStyle mt-4 md:mx-4 title w-full`" :html-content="settings[lang].message" />
  </div>
</template>

<script>
import {useCookie} from '#imports'

export default {
  name: 'RedirectionStatic',
  props: {
    section: {
      type: Object,
      default: () => {},
    },
    lang: {
      type: String,
      default: "en"
    },
	viewStructure: {
	  settings: [
		{
		  en: {
			message: 'text',
			redirectionUrl: 'string'
		  },
		  fr: {
			message: 'text',
			redirectionUrl: 'string'
		  },
		  timeToRedirect: ''
		}
	  ],
	}
  },
  computed: {
    settings() {
      if(Array.isArray(this.section.settings)) {
        return this.section.settings[0];
      } else return this.section.settings
    },
  },
  mounted() {
    if (this.settings && this.settings.timeToRedirect && this.settings[this.lang].redirectionUrl && !useCookie('sections-auth-token').value) {
      setTimeout(() => {
        this.openLink(this.settings[this.lang].redirectionUrl)
      }, Number(this.settings.timeToRedirect) * 1000)
    }
    const sectionsThemeComponents = null
    sectionsThemeComponents?.(this.section.name, [
      {
        id: 'global',
        name: this.$t('sectionsBuilder.globalSettings'),
        path: '/theme/global_settings'
      }
    ])
  },
  methods: {
    openLink(link) {
      window.open(link, '_self')
    }
  }
};
</script>

<style>
.view-component {
  overflow: hidden;
}
.main-section {
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
}
.container-wrapper {
  display: flex;
  position: relative;
  height: 100vh;
  width: 100vw;
}
/*.title {*/
/*  font-family: 'Barlow Semi Condensed Black', sans-serif;*/
/*}*/
</style>
