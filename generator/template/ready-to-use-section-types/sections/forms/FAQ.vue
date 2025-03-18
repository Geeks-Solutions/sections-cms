<template>
  <div class="QAWr">

    <div class="mt-4 mb-4">
      <UploadMedia :media-label="$t('forms.media')" :upload-text="$t('forms.uploadMedia')" :change-text="$t('forms.changeMedia')" :seo-tag="$t('forms.seoTag')" :media="settings[0].media && Object.keys(settings[0].media).length > 0 ? [settings[0].media] : []" @uploadContainerClicked="selectedMediaIndex = 0; $emit('openMediaModal', settings[0].media && Object.keys(settings[0].media).length > 0 ? settings[0].media.media_id : null)" @removeUploadedImage="removeMedia(0)" />
    </div>

    <div class="flex flex-col items-start justify-start mt-8">
      <label for="dropdown" class="block mb-2 text-sm font-medium text-gray-700">{{ $t('forms.imagePosition') }}</label>
      <select
        id="dropdown"
        v-model="settings[0].imagePosition"
        class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="left">{{ $t('forms.imageLeft') }}</option>
        <option value="right">{{ $t('forms.imageRight') }}</option>
        <option value="none">{{ $t('forms.imageNone') }}</option>
      </select>
    </div>

    <div class="flex flex-col items-start justify-start mt-8">
      <div class="flex">
        <label class="mr-4 font-bold">{{ $t("Title") }}</label>
      </div>
      <input
        v-model="settings[0][siteLang].title"
        type="text"
        value=""
        :placeholder="$t('Title')"
        :class="['py-4 pl-6 border rounded-xl h-48px w-344px focus:outline-none', errors.title ? 'border-error' : 'border-FieldGray']"
      />
    </div>

    <div class="flex flex-col mt-4">

      <FieldSets :array-data-pop="settings[0].QAs" :fieldset-group="'qa'" :legend-label="$t('QA')" @array-updated="(data) => $set(settings[0], 'QAs', data)" @remove-fieldset="(object, idx) => removeQA(idx)">
        <template #default="{ object, idx }">
          <div class="flex flex-row w-full justify-between">
            <div class="flex flex-col w-full items-start justify-start">
              <div class="flex flex-row w-full justify-between mt-6">
                <label class="mr-4 font-medium">{{ $t("Question") }}</label>
              </div>
              <input
                v-model="object[siteLang].question"
                type="text"
                value=""
                :placeholder="$t('Question')"
                class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-full
            focus:outline-none
          "
              />
            </div>

          </div>

          <div class="flex flex-col items-start justify-start mt-8">
            <label class="mr-4 font-medium">{{ $t("Answer") }}</label>
            <wysiwyg :quill-key="`object-${idx}`" :html="object[siteLang].answer" :css-classes-prop="object.classes" @cssClassesChanged="(v) => $set(object, 'classes', v)" @wysiwygMedia="wysiwygMediaAdded" @settingsUpdate="(content) => updateQAAnswer(content, idx)"/>
          </div>
        </template>
      </FieldSets>

      <div
        class="add-button underline cursor-pointer mt-2"
        :class="{ disabled: settings[0].QAs.length === 4 }"
        @click="addQA()"
      >
        <div class="p3 bold text">{{ $t("ADD NEW Container") }}</div>
      </div>


    </div>

  </div>
</template>

<script>
import UploadMedia from "@geeks.solutions/nuxt-sections/lib/src/components/Medias/UploadMedia.vue";
import wysiwyg from "@geeks.solutions/nuxt-sections/lib/src/components/Editor/wysiwyg.vue";
import FieldSets from '@geeks.solutions/nuxt-sections/lib/src/components/SectionsForms/FieldSets.vue'

export default {
  name: "FAQ",
  components: {
    FieldSets,
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
        name: 'wysiwygMedia'
      }
    ]
  },
  data() {
    return {
      settings: [
        {
          en: {
            title: ''
          },
          fr: {
            title: ''
          },
          QAs: [],
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
        buttonText: false
      },
      siteLang: 'en',
      selectedMediaIndex: 0
    }
  },
  watch: {
    selectedLang: {
      handler(val) {
        this.siteLang = val
      },
      deep: true,
      immediate: true
    },
    settings(val) {
      if (Array.isArray(val) === false ) {
        this.settings = [val]
      }
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
    wysiwygMediaAdded(media) {
      this.settings.push({
        wysiwygMedia: media,
        wysiwygLang: this.selectedLang
      })
    },
    updateQAAnswer(content, idx) {
      this.settings[0].QAs[idx][this.siteLang].answer = content
    },
    addQA() {
      this.settings[0].QAs.push({
        en: {
          question: '',
          answer: ''
        },
        fr: {
          question: '',
          answer: ''
        },
        classes: ''
      })
    },
    removeQA(idx) {
      this.settings[0].QAs = this.settings[0].QAs.filter((img, i) => idx !== i)
    },
    removeMedia(idx) {
      this.settings[idx].media = {}
    },
    validate() {
      if (Array.isArray(this.settings)) {
        this.settings.forEach((ob, index) => {
          if (ob.wysiwygLang) {
            if (!JSON.stringify(this.settings[0].QAs.map(qa => qa)).includes(ob.wysiwygMedia.media_id)) {
              this.settings.splice(index, 1)
            }
          }
          if (ob.media && !ob.media.url) {
            delete ob.media
          }
        })
      }
      let valid = true;
      this.errors.title = false;
      if (!this.settings[0].en.title) {
        this.errors.title = true;
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
}
</script>
