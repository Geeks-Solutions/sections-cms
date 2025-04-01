<template>
  <div>
	<div class="flex flex-col items-start justify-start mt-8">
	  <div class="flex">
		<label class="mr-4 font-bold">{{ $t("Title") }}</label>
	  </div>
	  <input
		   v-model="settings[0][selectedLang].title"
		   type="text"
		   value=""
		   :placeholder="$t('Title')"
		   :class="['py-4 pl-6 border rounded-xl h-48px w-344px focus:outline-none', errors.title ? 'border-error' : 'border-FieldGray']"
	  />
	</div>

	<div class="flex flex-col items-start justify-start mt-4">
	  <div class="flex">
		<label class="mr-4 font-bold">{{ $t("Subtitle") }}</label>
	  </div>
	  <input
		   v-model="settings[0][selectedLang].subTitle"
		   type="text"
		   value=""
		   :placeholder="$t('Subtitle')"
		   :class="['py-4 pl-6 border rounded-xl h-48px w-344px focus:outline-none', errors.subTitle ? 'border-error' : 'border-FieldGray']"
	  />
	</div>

	<div class="flex flex-col items-start justify-start mt-4">
	  <div class="flex">
		<label class="mr-4 font-bold">{{ $t("Button Label") }}</label>
	  </div>
	  <input
		   v-model="settings[0][selectedLang].buttonLabel"
		   type="text"
		   value=""
		   :placeholder="$t('Button Label')"
		   :class="['py-4 pl-6 border rounded-xl h-48px w-344px focus:outline-none', errors.buttonLabel ? 'border-error' : 'border-FieldGray']"
	  />
	</div>

	<div class="flex flex-col items-start justify-start mt-4">
	  <div class="flex">
		<label class="mr-4 font-bold">{{ $t("Link") }}</label>
	  </div>
	  <input
		   v-model="settings[0][selectedLang].link"
		   type="text"
		   value=""
		   :placeholder="$t('Link')"
		   :class="['py-4 pl-6 border rounded-xl h-48px w-344px focus:outline-none', errors.link ? 'border-error' : 'border-FieldGray']"
	  />
	  <link-description />
	</div>

    <div class="my-4">
      <label class="flex section-module-upload-media-label">{{ $t('forms.linkTarget') }}</label>
      <div class="select-style-chooser w-344px">
        <gAutoComplete
          :main-filter="settings[0].linkTarget"
          :placeholder="$t('forms.linkTarget')"
          :filter-label-prop="'value'"
          :reduce="(option) => option.key"
          :filter-options="[{key: '_self', value: $t('forms.selfTarget')}, {key: '_blank', value: $t('forms.blankTarget')}]"
          :filter-searchable="false"
          :close-on-select="true"
          :filter-clearable="true"
          :track-by="'key'"
          @itemSelected="(val) => {settings[0].linkTarget = val;}"
        >
        </gAutoComplete>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "SimpleCTA",
  props: {
    selectedLang: {
      type: String,
      default: 'en'
    },
    locales: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      settings: [
        {
          en: {
            title: '',
            subTitle: '',
            link: '',
            buttonLabel: ''
          },
          fr: {
            title: '',
            subTitle: '',
            link: '',
            buttonLabel: ''
          },
          linkTarget: ''
        }
      ],
      errors: {
        title: false,
        subTitle: false,
        buttonLabel: false,
        link: false
      },
      isInProgress: false
    };
  },
  watch: {
    settings(val) {
      if (Array.isArray(val) === false ) {
        this.settings = [val]
      }
      this.locales.forEach(lang => {
        if(!this.settings[0][lang]) {
          this.settings[0][lang] = {
            title: '',
            subTitle: '',
            link: '',
            buttonLabel: ''
          }
        }
      })
      if (!this.settings[0].en && !this.settings[0].fr) {
        Object.assign(this.settings[0], {
          en: {
            title: '',
            subTitle: '',
            link: '',
            buttonLabel: ''
          },
          fr: {
            title: '',
            subTitle: '',
            link: '',
            buttonLabel: ''
          },
        })
      }
      if(val.fr) {
        for(let i = 0; i < Object.keys(val.fr).length; i++) {
          if(val.fr[Object.keys(val.fr)[i]] === '') val.fr[Object.keys(val.fr)[i]] = val[Object.keys(val.fr)[i]]
        }
      }
    }
  },
  created() {
    this.locales.forEach(lang => {
      this.settings[0][lang] = {
        title: '',
        subTitle: '',
        link: '',
        buttonLabel: ''
      }
    })
  },
  methods: {
    validate() {
      let valid = true;
      if (!this.settings[0].en.buttonLabel) {
        this.errors.buttonLabel = true;
        valid = false;
      }
      if (!this.settings[0].en.link) {
        this.errors.link = true;
        valid = false;
      }
      if (!valid) {
        this.$root.$emit("toast", {
          type: "Error",
          message: this.$t("fill-required-fields")
        });
      }
      return valid;
    }
  }
};
</script>

<style>
</style>
