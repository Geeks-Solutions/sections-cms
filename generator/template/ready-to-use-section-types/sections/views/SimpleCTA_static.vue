<template>
  <div
      v-if="show"
      class="container-blue"
      style="overflow: hidden"
  >
    <div class="bg-dark-blue">
      <div class="container-blue">
        <div class="container-blue-question">
          <p class="question">
            {{ getCurrentTranslation(settings, lang, 'title', 'title') }}
          </p>
          <div class="flex buttonsRow items-center mb-4">
            <a :href="getCurrentTranslation(settings, lang, 'link', 'link')" :target="settings.inNewTab ? '_blank' : '_self'" style="text-decoration: none">
              <p class="contact text-white" :class="getCurrentTranslation(settings, lang, 'buttonLabel', 'buttonLabel') && getCurrentTranslation(settings, lang, 'buttonLabel', 'buttonLabel') !== '' && getCurrentTranslation(settings, lang, 'buttonLabel', 'buttonLabel') !== '/' ? 'contactMargin' : ''">
                {{ getCurrentTranslation(settings, lang, 'subTitle', 'subTitle') }}
              </p>
            </a>
            <div class="mobileButtonLabel">
			  <global-link v-if="getCurrentTranslation(settings, lang, 'buttonLabel', 'buttonLabel') && getCurrentTranslation(settings, lang, 'buttonLabel', 'buttonLabel') !== '' && getCurrentTranslation(settings, lang, 'buttonLabel', 'buttonLabel') !== '/'"
				   :link="getCurrentTranslation(settings, lang, 'link', 'link')" :lang="lang">
				<Button :label="getCurrentTranslation(settings, lang, 'buttonLabel', 'buttonLabel')" type="outlined" />
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
      default: {}
    },
    lang: {
      type: String,
      default: "en"
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
.container-blue {
  background: #05c0cc;
  width: 100%;
}

.container-blue-question {
  margin-left: 198px;
  padding-top: 36px;
}

.question {
  color: #00131f;
  font-family: 'Courier New', Courier, monospace;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  padding: 0;
  margin: 0;
}

.contact {
  font-family: 'Raleway', sans-serif;
  font-style: normal;
  font-weight: 900;
  font-size: 40px;
  line-height: 47px;
  cursor: pointer;
  text-decoration: none;
}

.buttonLabel {
  height: fit-content;
  font-family: 'Raleway', sans-serif;
}

.mobileButtonLabel {
  margin-left: 0.5rem;
}

.buttonsRow {
  flex-wrap: wrap;
}

@media only screen and (max-width: 1200px) {
  .container-blue {
    width: 100%;
    margin-top: 0%;
  }

  .container-blue-question {
    margin-left: 0;
    padding-top: 15px;
    padding-left: 2vmin;
  }

  .question {
    font-style: normal;
    font-weight: normal;
    font-size: 22px;
    padding: 0;
    margin: 0;
  }

  .contact {
    font-size: 27px;
    font-weight: 700;
  }
  .contactMargin {
    margin-bottom: 0;
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
