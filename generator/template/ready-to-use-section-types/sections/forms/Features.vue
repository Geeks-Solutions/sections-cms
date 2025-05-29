<template>
  <div>

    <div class="flex flex-col items-start justify-start mt-8">
      <label :class="sectionsStyle.fieldLabel">{{ $t("forms.title") }}</label>
      <LazyEditorWysiwyg :html="settings[0].title[selectedLang]" :css-classes-prop="settings[0].titleClasses" @cssClassesChanged="(v) => settings[0]['titleClasses'] = v" @wysiwygMedia="wysiwygMediaAdded" @settingsUpdate="(content) => updateTitleDescription(content, 0)"/>
    </div>

    <div class="flex flex-col items-start justify-start mt-8">
      <label :class="sectionsStyle.fieldLabel">{{ $t("forms.description") }}</label>
      <LazyEditorWysiwyg :html="settings[0].subtitle[selectedLang]" :css-classes-prop="settings[0].subtitleClasses" @cssClassesChanged="(v) => settings[0]['subtitleClasses'] = v" @wysiwygMedia="wysiwygMediaAdded" @settingsUpdate="(content) => updateSubtitleDescription(content, 0)"/>
    </div>

    <div class="flex flex-row justify-center mt-8">
      <h3 :class="sectionsStyle.fieldLabel">{{ $t("forms.featuresBlock") }}</h3>
    </div>

    <div id="media" class="flex flex-col mt-4">
      <LazySectionsFormsFieldSets :array-data-pop="settings[0].features" :fieldset-group="'menu'" :legend-label="$t('forms.feature')" @array-updated="(data) => settings[0]['features'] = data" @remove-fieldset="(object, idx) => removeFeatureBlock(idx)">
        <template #default="{ object, idx }">

          <div>
            <div class="mb-4">
              <LazyMediasUploadMedia :media-label="$t('forms.media')" :upload-text="$t('forms.uploadMedia')" :change-text="$t('forms.changeMedia')" :seo-tag="$t('forms.seoTag')" :media="object.media && Object.keys(object.media).length > 0 ? [object.media] : []" @uploadContainerClicked="selectedMediaIndex = idx; selectedMediaKey = 'media'; $emit('openMediaModal', object.media && Object.keys(object.media).length > 0 ? object.media.media_id : null)" @removeUploadedImage="removeMedia(idx, 'media')" />
              <span v-if="errors.media === true && idx === 0" class="flex text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
            </div>
          </div>

          <div class="flex flex-col items-start justify-start mt-8">
            <label :class="sectionsStyle.fieldLabel">{{ $t("forms.description") }}</label>
            <LazyEditorWysiwyg :html="object.text[selectedLang]" :css-classes-prop="object.textClasses" @cssClassesChanged="(v) => object['textClasses'] = v" @wysiwygMedia="wysiwygMediaAdded" @settingsUpdate="(content) => updateTextDescription(content, idx)"/>
          </div>

        </template>
      </LazySectionsFormsFieldSets>

      <div
        class="add-button underline cursor-pointer mt-2 pb-4"
        @click="addFeatureBlock()"
      >
        <div class="p3 bold text">{{ $t("forms.addFeature") }}</div>
      </div>
    </div>

  </div>
</template>

<script>
import {scrollToFirstError, sectionsStyle} from "@/utils/constants";

export default {
  name: 'Features',
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
        name: 'wysiwygMedias'
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
          subtitle: {
            en: '',
            fr: ''
          },
          text: {
            en: '',
            fr: ''
          },
          titleClasses: '',
          textClasses: '',
          subtitleClasses: '',
          media: {
            media_id: "",
            url: "",
            seo_tag: ""
          },
          wysiwygMediasData: [],
          wysiwygMedias: [],
          medias: [],
          features: [
            {
              text: {
                en: '',
                fr: ''
              },
              textClasses: '',
              media: {
                media_id: "",
                url: "",
                seo_tag: ""
              }
            }
          ]
        }
      ],
      errors: {
        media: false
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
      this.settings[0].features[this.selectedMediaIndex][this.selectedMediaKey] = media
      this.settings[0].medias.push(media)
      this.$emit('closeMediaModal')
    },
    settings: {
      handler(v) {
        if (v && v[0] && v[0].features === undefined) {
          this.settings[0]['features'] = []
          this.settings[0].medias = []
          this.settings.forEach(st => {
            this.settings[0].features.push(JSON.parse(JSON.stringify(st)))
            if (st.media && st.media.media_id) {
              this.settings[0].medias.push(st.media)
            }
          })
        }
      }
    }
  },
  methods: {
    wysiwygMediaAdded(media) {
      if (this.settings[0].wysiwygMediasData === undefined) {
        this.settings[0].wysiwygMediasData = []
      }
      /* eslint-disable-next-line dot-notation */
      this.settings[0]['wysiwygMediasData'].push({
        wysiwygMedia: media,
        wysiwygLang: this.selectedLang
      })
      if (this.settings[0].wysiwygMedias === undefined) {
        this.settings[0].wysiwygMedias = []
      }
      /* eslint-disable-next-line dot-notation */
      this.settings[0]['wysiwygMedias'].push(media)
    },
    updateTitleDescription(content, idx) {
      this.settings[idx].title[this.selectedLang] = content
    },
    updateSubtitleDescription(content, idx) {
      this.settings[idx].subtitle[this.selectedLang] = content
    },
    updateTextDescription(content, idx) {
      this.settings[0].features[idx].text[this.selectedLang] = content
    },
    addFeatureBlock() {
      this.settings[0].features.push({
        text: {
          en: '',
          fr: ''
        },
        textClasses: '',
        media: {
          media_id: "",
          url: "",
          seo_tag: ""
        }
      });
    },
    removeMedia(idx, key) {
      try {
        const mediaIndex = this.settings[0].medias.find(md => md.media_id === this.settings[0].features[idx][key].media_id)
        this.settings[0].medias = this.settings[0].medias.filter((img, i) => mediaIndex !== i)
      } catch {}
      this.settings[0].features[idx][key] = {}
    },
    removeFeatureBlock(idx) {
      if (this.settings[0].features.length > 1) {
        this.settings[0].features = this.settings[0].features.filter((img, i) => idx !== i);
      }
    },
    validate() {
      try {
        if (Array.isArray(this.settings) && this.settings[0].wysiwygMediasData && this.settings[0].wysiwygMediasData.length > 0) {
          this.settings[0].wysiwygMediasData.forEach((ob, index) => {
            if (ob.wysiwygLang) {
              if (!JSON.stringify([...this.settings.map(set => set.title), ...this.settings.map(set => set.text)]).includes(ob.wysiwygMedia.media_id)) {
                this.settings[0].wysiwygMediasData.splice(index, 1)
                this.settings[0].wysiwygMedias.splice(this.settings[0].wysiwygMedias.findIndex(wm => wm.media_id === ob.wysiwygMedia.media_id), 1)
              }
            }
          })
        }
        if (this.settings[0].wysiwygMedias.length === 0) {
          delete this.settings[0].wysiwygMedias
        }
      } catch {}
      for(let i = 0; i < this.settings.length; i++) {
        if (this.settings[i].media && (Object.keys(this.settings[i].media).length === 0 || !this.settings[i].media.media_id || !this.settings[i].media.url)) {
          delete this.settings[i].media
        }
      }
      const valid = true;
      this.errors.media = false;
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
