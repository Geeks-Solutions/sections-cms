<template>
  <div class="QAWr">

    <div class="mt-4 mb-4">
      <LazyMediasUploadMedia :media-label="$t('forms.media')" :upload-text="$t('forms.uploadMedia')" :change-text="$t('forms.changeMedia')" :seo-tag="$t('forms.seoTag')" :media="settings[0].media && Object.keys(settings[0].media).length > 0 ? [settings[0].media] : []" @uploadContainerClicked="selectedMediaIndex = 0; $emit('openMediaModal', settings[0].media && Object.keys(settings[0].media).length > 0 ? settings[0].media.media_id : null)" @removeUploadedImage="removeMedia(0)" />
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
        <label class="mr-4 font-bold">{{ $t("forms.title") }}</label>
      </div>
      <input
        v-model="settings[0][siteLang].title"
        type="text"
        :placeholder="$t('forms.title')"
        :class="['py-4 pl-6 border rounded-xl h-[48px] w-[344px] focus:outline-none', errors.title && selectedLang === defaultLang ? 'border-error' : 'border-FieldGray']"
      />
    </div>

    <div class="flex flex-col mt-4">

      <LazySectionsFormsFieldSets :array-data-pop="settings[0].QAs" :fieldset-group="'qa'" :legend-label="$t('forms.qa')" @array-updated="(data) => settings[0]['QAs'] = data" @remove-fieldset="(object, idx) => removeQA(idx)">
        <template #default="{ object, idx }">
          <div class="flex flex-row w-full justify-between">
            <div class="flex flex-col w-full items-start justify-start">
              <div class="flex flex-row w-full justify-between mt-6">
                <label class="mr-4 font-medium">{{ $t("forms.question") }}</label>
              </div>
              <input
                v-model="object[siteLang].question"
                type="text"
                :placeholder="$t('forms.question')"
                class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-[48px]
            w-full
            focus:outline-none
          "
              />
            </div>

          </div>

          <div class="flex flex-col items-start justify-start mt-8">
            <label class="mr-4 font-medium">{{ $t("forms.answer") }}</label>
            <LazyEditorWysiwyg :quill-key="`object-${idx}`" :html="object[siteLang].answer" :css-classes-prop="object.classes" @cssClassesChanged="(v) => object['classes'] = v" @wysiwygMedia="wysiwygMediaAdded" @settingsUpdate="(content) => updateQAAnswer(content, idx)"/>
          </div>
        </template>
      </LazySectionsFormsFieldSets>

      <div
        class="add-button underline cursor-pointer mt-2"
        :class="{ disabled: settings[0].QAs.length === 4 }"
        @click="addQA()"
      >
        <div class="p3 bold text">{{ $t("forms.addNewContainer") }}</div>
      </div>


    </div>

    <LazySectionFormErrors :selectedLang="selectedLang" :default-lang="defaultLang" :locales="locales" :errors="errors" />

  </div>
</template>

<i18n src="./Shared_i18n.json"></i18n>

<script>

import { assignMediaObject } from '@/utils/constants.js'

export default {
  name: "FAQ",
  setup() {
    const { t } = useI18n({
      useScope: 'local'
    })

    return {
      $t: t
    }
  },
  props: {
    selectedLang: {
      type: String,
      default: 'en'
    },
    defaultLang: {
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
      let media = {}
      media = assignMediaObject(mediaObject)
      this.settings[this.selectedMediaIndex]['media'] = media
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
      if (!this.settings[0][this.defaultLang].title) {
        this.errors.title = true;
        valid = false;
      }
      return valid;
    }
  }
}
</script>
