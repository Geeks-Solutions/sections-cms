<template>
  <div class="p-4">

    <div class="mb-4">
      <UploadMedia :media-label="$t('forms.media')" :upload-text="$t('forms.uploadMedia')" :change-text="$t('forms.changeMedia')" :seo-tag="$t('forms.seoTag')" :media="settings[0].media && Object.keys(settings[0].media).length > 0 ? [settings[0].media] : []" @uploadContainerClicked="selectedMediaIndex = 0; $emit('openMediaModal', settings[0].media && Object.keys(settings[0].media).length > 0 ? settings[0].media.media_id : null)" @removeUploadedImage="removeMedia(0)" />
    </div>

    <div id="title" class="flex flex-col items-start justify-start mt-8">
      <label :class="sectionsStyle.fieldLabel">{{ $t("forms.title") + '*' }}</label>
      <wysiwyg :html="settings[0].title[selectedLang]" @settingsUpdate="(content) => updateTitleDescription(content)"/>
      <span v-if="errors.title === true" class="flex text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
    </div>

    <div id="text" class="flex flex-col items-start justify-start mt-8">
      <label :class="sectionsStyle.fieldLabel">{{ $t("forms.text") + '*' }}</label>
      <wysiwyg :html="settings[0].text[selectedLang]" @settingsUpdate="(content) => updateTextDescription(content)"/>
      <span v-if="errors.text === true " class="flex text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
    </div>

    <div class="flex flex-col items-start justify-start mt-8">
	  <label for="dropdown" class="block mb-2 text-sm font-medium text-gray-700">Choose an option:</label>
	  <select
		   id="dropdown"
		   v-model="settings[0].imagePosition"
		   class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
	  >
		<option value="left">Left</option>
		<option value="right">Right</option>
		<option value="none">None</option>
	  </select>
    </div>

  </div>
</template>

<script>
import UploadMedia from "@geeks.solutions/nuxt-sections/lib/src/components/Medias/UploadMedia.vue";
import wysiwyg from "@geeks.solutions/nuxt-sections/lib/src/components/Editor/wysiwyg.vue";
import {sectionsStyle, scrollToFirstError} from "@/utils/constants";

export default {
  name: 'TextImage',
  components: {
    UploadMedia,
    wysiwyg
  },
  props: {
    selectedLang: {
      type: String,
      default: 'en'
    },
    selectedMedia: {},
    locales: {
      type: Array,
      default() {
        return []
      }
    },
    mediaFields: [
      {
        type: 'image',
        name: 'media'
      }
    ]
  },
  data() {
    return {
      settings: [
        {
          title: {
            en: '',
            fr: ''
          },
          text: {
            en: '',
            fr: ''
          },
          media: {
            media_id: "",
            url: "",
            seo_tag: ""
          },
          imagePosition: "none"
        }
      ],
      errors: {
        title: false,
        text: false,
        media: false
      },
      siteLang: 'en',
      sectionsStyle,
      selectedMediaIndex: 0
    }
  },
  watch: {
    selectedLang(val) {
      this.siteLang = val
    },
    selectedMedia(mediaObject) {
      const media = {
        media_id: "",
        url: "",
        seo_tag: "",
        filename: "",
        headers: {}
      };
      media.media_id = mediaObject.id;
      media.url = mediaObject.files[0].url;
      media.seo_tag = mediaObject.seo_tag;
      media.filename = mediaObject.files[0].filename;
      if (mediaObject.files[0].headers) {
        media.headers = mediaObject.files[0].headers
      }
      this.$set(this.settings[this.selectedMediaIndex], 'media', media);
      this.$emit('closeMediaModal')
    }
  },
  methods: {
    updateTitleDescription(content) {
      this.settings[0].title[this.selectedLang] = content
    },
    updateTextDescription(content) {
      this.settings[0].text[this.selectedLang] = content
    },
    addMedia() {
      if (this.settings.length < 4) {
        this.settings.push({
          media: {
            media_id: "",
            url: "",
            seo_tag: ""
          }
        });
      }
    },
    removeMedia(idx) {
      this.settings[idx].media = {}
    },
    validate() {
      for(let i = 0; i < this.settings.length; i++) {
        if (this.settings[i].media && (Object.keys(this.settings[i].media).length === 0 || !this.settings[i].media.media_id || !this.settings[i].media.url)) {
          delete this.settings[i].media
        }
      }
      let valid = true;
      this.errors.title = false;
      this.errors.text = false;
      this.errors.media = false;
      if (!this.settings[0].title.en) {
        this.errors.title = true;
        valid = false;
      }
      if (!this.settings[0].text.en) {
        this.errors.text = true;
        valid = false;
      }
      if (!valid) {
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
.lightMode input:checked ~ .dot {
  transform: translateX(100%);
  background-color: #131310 !important;
}
</style>
