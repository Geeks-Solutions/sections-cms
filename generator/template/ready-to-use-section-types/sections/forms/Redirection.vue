<template>
  <div>
    <div id="message" class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 font-bold">{{ $t("forms.message") }}</label>
      <wysiwyg :html="settings[0][selectedLang].message" :css-classes-prop="settings[0].classes" @cssClassesChanged="(v) => $set(settings[0], 'classes', v)" @wysiwygMedia="wysiwygMediaAdded" @settingsUpdate="updateMessageDescription"/>
      <span v-show="selectedLang === 'en' && errors.message" class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
    </div>
    <div class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 font-medium">{{ $t("forms.redirectionUrl") }}</label>
      <div class="flex flex-row items-center gap-1 pb-2">
        <svg id="Layer_1" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="122.879px" height="97.311px" viewBox="0 0 122.879 97.311" enable-background="new 0 0 122.879 97.311" xml:space="preserve" style="height: 20px; width: 20px;"><g><path fill="red" fill-rule="evenodd" clip-rule="evenodd" d="M65.45,1.972l55.594,87.323c1.673,2.63,3.117,8.016,0,8.016H1.837 c-3.118,0-1.676-5.386,0-8.016L57.431,1.972C59.106-0.658,63.774-0.656,65.45,1.972L65.45,1.972z M56.578,74.146h9.682v8.561 h-9.682V74.146L56.578,74.146z M66.254,68.217H56.58c-0.964-11.756-2.982-19.216-2.982-30.955c0-4.331,3.51-7.842,7.841-7.842 c4.332,0,7.842,3.511,7.842,7.842C69.282,48.996,67.236,56.471,66.254,68.217L66.254,68.217z"></path></g></svg>
        <span class="mr-4 text-xs font-bold text-start">{{ $t("forms.redirectionWarning") }}</span>
      </div>
      <input
        v-model="settings[0][selectedLang].redirectionUrl"
        type="text"
        value=""
        :placeholder="$t('forms.redirectionUrl')"
        class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
      />
      <span v-show="selectedLang === 'en' && errors.redirectionUrl" class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
    </div>
    <div class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 font-medium">{{ $t("forms.timeToRedirect") }}</label>
      <input
        v-model="settings[0].timeToRedirect"
        type="number"
        value=""
        :placeholder="$t('forms.timeToRedirect')"
        class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
      />
      <span v-show="selectedLang === 'en' && errors.timeToRedirect" class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
    </div>
  </div>
</template>

<script>
import wysiwyg from "@geeks.solutions/nuxt-sections/lib/src/components/Editor/wysiwyg.vue";
import {scrollToFirstError} from "@/utils/constants";

export default {
  name: 'Redirection',
  components: {
    wysiwyg
  },
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
    },
    mediaFields: [
      {
        type: 'image',
        name: 'wysiwygMedia'
      }
    ]
  },
  data() {
    return {
      settings: [
        {
          en: {
            message: '',
            redirectionUrl: ''
          },
          fr: {
            message: '',
            redirectionUrl: ''
          },
          timeToRedirect: '',
          classes: ''
        }
      ],
      errors: {
        message: false,
        redirectionUrl: false,
        timeToRedirect: false
      },
      siteLang: 'en'
    }
  },
  watch: {
    selectedLang(val) {
      this.siteLang = val
    },
    settings() {
      this.locales.forEach(lang => {
        if(!this.settings[0][lang]) {
          this.settings[0][lang] = {
            message: '',
            redirectionUrl: ''
          }
        }
      })
    }
  },
  created() {
    this.locales.forEach(lang => {
      this.settings[0][lang] = {
        message: '',
        redirectionUrl: ''
      }
    })
  },
  methods: {
    wysiwygMediaAdded(media) {
      this.settings.push({
        wysiwygMedia: media,
        wysiwygLang: this.selectedLang
      })
    },
    updateMessageDescription(content) {
      this.settings[0][this.selectedLang].message = content
    },
    validate() {
      if (Array.isArray(this.settings)) {
        this.settings.forEach((ob, index) => {
          if (ob.wysiwygLang) {
            if (!JSON.stringify(this.settings[0]).includes(ob.wysiwygMedia.media_id)) {
              this.settings.splice(index, 1)
            }
          }
        })
      }
      let valid = true;
      this.errors.message = false;
      this.errors.redirectionUrl = false;
      this.errors.timeToRedirect = false;
      if (!this.settings[0].en.message) {
        this.errors.message = true;
        valid = false;
      }
      if (!this.settings[0].en.redirectionUrl) {
        this.errors.redirectionUrl = true;
        valid = false;
      }
      if (!this.settings[0].timeToRedirect) {
        this.errors.timeToRedirect = true;
        valid = false;
      }
      if (!valid) {
        setTimeout(() => document.getElementById('required-fields').scrollIntoView(), 1000)
        this.$root.$emit("toast", {
          type: "Error",
          message: this.$t("fill-required-fields")
        });
        scrollToFirstError(this.errors)
      }
      return valid;
    },
  },
}
</script>

<style>
.content-wrapper {
  overflow-x: hidden;
}
</style>
