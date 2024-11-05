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
          }
        }
      ],
      errors: {
        title: false,
        subTitle: false,
        link: false
      },
      isInProgress: false,
      selectedLang: 'en'
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
      if (!this.settings[0].en.title) {
        this.errors.title = true;
        valid = false;
      }
      if (!this.settings[0].en.subTitle) {
        this.errors.subTitle = true;
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
