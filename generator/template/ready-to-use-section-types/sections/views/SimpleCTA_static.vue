<template>
  <div
      v-if="show"
      class="simple-cta"
      style="overflow: hidden"
  >
    <div class="wrapper">
      <div class="wrapper">
        <div class="wrapper-question">
          <h2>
            {{ getCurrentTranslation(settings, lang, 'title', 'title') }}
          </h2>
          <div class="flex buttonsRow items-center mb-4">
			<global-link :link="{en: getCurrentTranslation(settings, 'en', 'link', 'link'), fr: getCurrentTranslation(settings, 'fr', 'link', 'link')}" :lang="lang">
              <p>
                {{ getCurrentTranslation(settings, lang, 'subTitle', 'subTitle') }}
              </p>
            </global-link>
            <div class="mobileButtonLabel">
			  <global-link v-if="getCurrentTranslation(settings, lang, 'buttonLabel', 'buttonLabel') && getCurrentTranslation(settings, lang, 'buttonLabel', 'buttonLabel') !== '' && getCurrentTranslation(settings, lang, 'buttonLabel', 'buttonLabel') !== '/'"
				   :link="{en: getCurrentTranslation(settings, 'en', 'link', 'link'), fr: getCurrentTranslation(settings, 'fr', 'link', 'link')}" :lang="lang">
				<div class="button-selector">
				  {{ getCurrentTranslation(settings, lang, 'buttonLabel', 'buttonLabel') }}
				</div>
			  </global-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getTranslation} from "@/utils/constants";

export default {
  name: "SimpleCTA",
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
			title: 'string',
			subTitle: 'string',
			link: 'string',
			buttonLabel: 'string'
		  },
		  fr: {
			title: 'string',
			subTitle: 'string',
			link: 'string',
			buttonLabel: 'string'
		  }
		}
	  ]
	}
  },
  data() {
    return {

    };
  },
  computed: {
    show() {
      return !!this.section.settings;
    },
    title() {
      return this.section.settings.title
    },
    subTitle() {
      return this.section.settings.subTitle
    },
    link() {
      return this.section.settings.link ? this.section.settings.link : ''
    },
    settings() {
      if (Array.isArray(this.section.settings) === false) {
        return this.section.settings;
      } else {
        return this.section.settings[0];
      }
    }
  },
  methods: {
    getCurrentTranslation(settings, lang, primaryKey, frKey) {
      if(getTranslation(settings, lang, primaryKey, frKey)) {
        return getTranslation(settings, lang, primaryKey, frKey)
      } else return '/'
    }
  }
}
</script>

<style scoped>
.wrapper {
  width: 100%;
}

.wrapper-question {
  margin-left: 198px;
  padding-top: 36px;
}

.mobileButtonLabel {
  margin-left: 0.5rem;
}

.buttonsRow {
  flex-wrap: wrap;
}

@media only screen and (max-width: 1200px) {
  .wrapper {
    width: 100%;
    margin-top: 0%;
  }

  .wrapper-question {
    margin-left: 0;
    padding-top: 15px;
    padding-left: 2vmin;
  }

  .mobileButtonLabel {
    width: 100%;
    text-align: center;
    margin-left: 0;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
}
</style>
