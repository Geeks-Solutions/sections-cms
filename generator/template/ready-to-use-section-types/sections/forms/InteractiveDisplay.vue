<template>
  <div>

    <div id="videoLink" class="flex flex-col items-start justify-start mt-8 ml-2">
      <label :class="sectionsStyle.fieldLabel">{{ $t("forms.video") + '*' }}</label>
      <input
          v-model="settings[0].videoLink"
          type="text"
          :placeholder="$t('forms.videoLink') + '*'"
          :class="sectionsStyle.input"
      />
      <span v-if="errors.videoLink === true" class="flex text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
    </div>

    <div class="flex flex-row justify-center mt-8">
      <h3 :class="sectionsStyle.fieldLabel">{{ $t("forms.carousel") }}</h3>
    </div>
    <div id="media" class="flex flex-col mt-4">
      <div v-for="(object, idx) in settings" :key="`object-${idx}`" class="flex flex-col">
        <fieldset class="fieldSetStyle border border-solid border-gray-300 p-3 mt-2">
          <legend class="w-auto px-16">{{ $t("forms.block") }} #{{ idx + 1 }}: <span class="cursor-pointer text-xl pl-4 text-Blue" @click="removeCarouselBlock(idx)">x</span></legend>

          <div>
            <div class="mb-4">
              <UploadMedia :media-label="idx === 0 ? $t('forms.media') + ' (desktop)' + '*' : $t('forms.media') + ' (desktop)'" :upload-text="$t('forms.uploadMedia')" :change-text="$t('forms.changeMedia')" :seo-tag="$t('forms.seoTag')" :media="object.media && Object.keys(object.media).length > 0 ? [object.media] : []" @uploadContainerClicked="selectedMediaIndex = idx; selectedMediaKey = 'media'; $emit('openMediaModal', object.media && Object.keys(object.media).length > 0 ? object.media.media_id : null)" @removeUploadedImage="removeMedia(idx, 'media')" />
              <span v-if="errors.media === true && idx === 0" class="flex text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
            </div>
          </div>

          <div :id="idx === 0 ? 'mediaMobile' : undefined">
            <div class="mb-4">
              <UploadMedia :media-label="idx === 0 ? $t('forms.media') + ' (mobile)' + '*' : $t('forms.media') + ' (mobile)'" :upload-text="$t('forms.uploadMedia')" :change-text="$t('forms.changeMedia')" :seo-tag="$t('forms.seoTag')" :media="object.mediaMobile && Object.keys(object.mediaMobile).length > 0 ? [object.mediaMobile] : []" @uploadContainerClicked="selectedMediaIndex = idx; selectedMediaKey = 'mediaMobile'; $emit('openMediaModal', object.mediaMobile && Object.keys(object.mediaMobile).length > 0 ? object.mediaMobile.media_id : null)" @removeUploadedImage="removeMedia(idx, 'mediaMobile')" />
              <span v-if="errors.mediaMobile === true && idx === 0" class="flex text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
            </div>
          </div>

          <div class="flex flex-col items-start justify-start mt-8">
            <label :class="sectionsStyle.fieldLabel">{{ $t("forms.title") }}</label>
            <wysiwyg :html="settings[idx].title[selectedLang]" @settingsUpdate="(content) => updateTitleDescription(content, idx)"/>
          </div>

          <div class="flex flex-col items-start justify-start mt-8">
            <label :class="sectionsStyle.fieldLabel">{{ $t("forms.text") }}</label>
            <wysiwyg :html="settings[idx].text[selectedLang]" @settingsUpdate="(content) => updateTextDescription(content, idx)"/>
          </div>

          <div class="flex flex-col items-start justify-start mt-8">
            <label :class="sectionsStyle.fieldLabel">{{ $t("forms.cta") }}</label>
            <input
                v-model="settings[idx].cta[selectedLang]"
                type="text"
                :placeholder="$t('forms.cta')"
                :class="sectionsStyle.input"
            />
          </div>

          <div class="flex flex-col items-start justify-start mt-8">
            <label :class="sectionsStyle.fieldLabel">{{ $t("forms.ctaLink") }}</label>
            <input
                v-model="settings[idx].ctaLink[selectedLang]"
                type="text"
                :placeholder="$t('forms.ctaLink')"
                :class="sectionsStyle.input"
            />
          </div>
        </fieldset>
      </div>
      <div
          class="add-button underline cursor-pointer mt-2 pb-4"
          @click="addMedia()"
      >
        <div class="p3 bold text">{{ $t("forms.addImage") }}</div>
      </div>
    </div>

  </div>
</template>

<script>
import UploadMedia from "@geeks.solutions/nuxt-sections/lib/src/components/Medias/UploadMedia.vue";
import wysiwyg from "@geeks.solutions/nuxt-sections/lib/src/components/Editor/wysiwyg.vue";
import {scrollToFirstError, sectionsStyle} from "@/utils/constants";

export default {
  name: 'InteractiveDisplay',
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
      },
      {
        type: 'image',
        name: 'mediaMobile'
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
          cta: {
            en: '',
            fr: ''
          },
          ctaLink: {
            en: '',
            fr: ''
          },
          videoLink: '',
          media: {
            media_id: "",
            url: "",
            seo_tag: ""
          },
          mediaMobile: {
            media_id: "",
            url: "",
            seo_tag: ""
          }
        }
      ],
      errors: {
        videoLink: false,
        media: false,
        mediaMobile: false
      },
      siteLang: 'en',
      sectionsStyle,
      selectedMediaIndex: 0,
      selectedMediaKey: 'media'
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
      this.$set(this.settings[this.selectedMediaIndex], this.selectedMediaKey, media)
      this.$emit('closeMediaModal')
    }
  },
  methods: {
    updateTitleDescription(content, idx) {
      this.settings[idx].title[this.selectedLang] = content
    },
    updateTextDescription(content, idx) {
      this.settings[idx].text[this.selectedLang] = content
    },
    addMedia() {
      this.settings.push({
        media: {
          media_id: "",
          url: "",
          seo_tag: ""
        },
        mediaMobile: {
          media_id: "",
          url: "",
          seo_tag: ""
        },
        title: {
          en: '',
          fr: ''
        },
        text: {
          en: '',
          fr: ''
        },
        cta: {
          en: '',
          fr: ''
        },
        ctaLink: {
          en: '',
          fr: ''
        },
      });
    },
    removeMedia(idx, key) {
      this.settings[idx][key] = {}
    },
    removeCarouselBlock(idx) {
      if (idx !== 0) {
        this.settings = this.settings.filter((img, i) => idx !== i);
      }
    },
    validate() {
      for(let i = 0; i < this.settings.length; i++) {
        if (this.settings[i].media && (Object.keys(this.settings[i].media).length === 0 || !this.settings[i].media.media_id || !this.settings[i].media.url)) {
          delete this.settings[i].media
        }
      }
      for(let i = 0; i < this.settings.length; i++) {
        if (this.settings[i].mediaMobile && (Object.keys(this.settings[i].mediaMobile).length === 0 || !this.settings[i].mediaMobile.media_id || !this.settings[i].mediaMobile.url)) {
          delete this.settings[i].mediaMobile
        }
      }
      let valid = true;
      this.errors.media = false;
      this.errors.mediaMobile = false;
      this.errors.videoLink = false;
      if (this.settings[0].videoLink) {
		valid = true;
	  } else if (!this.settings[0].videoLink && (!this.settings[0].media || !this.settings[0].media.url) && (!this.settings[0].mediaMobile || !this.settings[0].mediaMobile.url)) {
        if (!this.settings[0].media || !this.settings[0].media.url) {
          this.errors.media = true;
        } else if (!this.settings[0].mediaMobile || !this.settings[0].mediaMobile.url) {
          this.errors.mediaMobile = true;
        }
        this.errors.videoLink = true;
        valid = false;
      } else if (this.settings[0].media && this.settings[0].media.url) {
        if (!this.settings[0].mediaMobile || !this.settings[0].mediaMobile.url) {
          this.errors.mediaMobile = true;
          valid = false;
        }
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
</style>
