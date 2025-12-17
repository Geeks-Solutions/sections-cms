<template>
  <div class="p-4">
    <div
      id="videoLink"
      class="flex flex-col items-start justify-start mt-8 ml-2"
    >
      <label :class="sectionsStyle.fieldLabel">{{ $t('forms.video') }}</label>
      <span class="text-xs text-Gray_800">{{ $t('forms.videoLinkDesc') }}</span>
      <input
        v-model="settings[0].videoLink"
        type="text"
        :placeholder="$t('forms.videoLink')"
        :class="sectionsStyle.input"
      />
      <span
        v-if="errors.videoLink === true"
        class="flex text-error text-sm pt-2 pl-2"
        >{{ $t('forms.requiredField') }}</span
      >
    </div>

    <div v-if="settings[0].videoLink" class="flex flex-wrap pt-4 pl-6">
      <div class="pr-4">
        <label class="flex items-center space-x-2">
          <span>{{ $t('forms.autoPlay') }}</span>
          <input
            v-model="settings[0].autoplay"
            type="checkbox"
            class="toggle-checkbox"
          />
        </label>
      </div>
      <div class="pr-4">
        <label class="flex items-center space-x-2">
          <span>{{ $t('forms.loop') }}</span>
          <input
            v-model="settings[0].loop"
            type="checkbox"
            class="toggle-checkbox"
          />
        </label>
      </div>
      <div class="pr-4">
        <label class="flex items-center space-x-2">
          <span>{{ $t('forms.removeControls') }}</span>
          <input
            v-model="settings[0].controls"
            type="checkbox"
            class="toggle-checkbox"
          />
        </label>
      </div>
      <div class="pr-4">
        <label class="flex items-center space-x-2">
          <span>{{ $t('forms.whiteProgress') }}</span>
          <input
            v-model="settings[0].whiteProgress"
            type="checkbox"
            class="toggle-checkbox"
          />
        </label>
      </div>
    </div>

    <div class="mt-4 mb-4">
      <LazyMediasUploadMedia
        :media-label="$t('forms.media')"
        :upload-text="$t('forms.uploadMedia')"
        :change-text="$t('forms.changeMedia')"
        :seo-tag="$t('forms.seoTag')"
        :media="
          settings[0].media && Object.keys(settings[0].media).length > 0
            ? [settings[0].media]
            : []
        "
        @upload-container-clicked="openMediaModalHandler(0, settings[0].media)"
        @remove-uploaded-image="removeMedia(0)"
      />
    </div>

    <div class="flex flex-col items-start justify-start mt-8">
      <label
        for="dropdown"
        class="block mb-2 text-sm font-medium text-gray-700"
        >{{ $t('forms.imagePosition') }}</label
      >
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

    <div
      id="sectionWrapperClass"
      class="flex flex-col items-start justify-start mt-8 ml-2"
    >
      <label :class="sectionsStyle.fieldLabel">{{
        $t('forms.sectionWrapperClass')
      }}</label>
      <input
        v-model="settings[0].sectionWrapperClass"
        type="text"
        :placeholder="$t('forms.sectionWrapperClass')"
        :class="sectionsStyle.input"
      />
    </div>

    <div id="title" class="flex flex-col items-start justify-start mt-8">
      <label :class="sectionsStyle.fieldLabel">{{
        $t('forms.title') + '*'
      }}</label>
      <LazyEditorWysiwyg
        :html="settings[0].title[selectedLang]"
        :css-classes-prop="settings[0].titleClasses"
        @css-classes-changed="(v) => (settings[0]['titleClasses'] = v)"
        @wysiwyg-media="wysiwygMediaAdded"
        @settings-update="(content) => updateTitleDescription(content)"
      />
      <span
        v-if="errors.title === true && selectedLang === defaultLang"
        class="flex text-error text-sm pt-2 pl-2"
        >{{ $t('forms.requiredField') }}</span
      >
    </div>

    <div id="text" class="flex flex-col items-start justify-start mt-8">
      <label :class="sectionsStyle.fieldLabel">{{
        $t('forms.text') + '*'
      }}</label>
      <LazyEditorWysiwyg
        :html="settings[0].text[selectedLang]"
        :css-classes-prop="settings[0].textClasses"
        @css-classes-changed="(v) => (settings[0]['textClasses'] = v)"
        @wysiwyg-media="wysiwygMediaAdded"
        @settings-update="(content) => updateTextDescription(content)"
      />
      <span
        v-if="errors.text === true && selectedLang === defaultLang"
        class="flex text-error text-sm pt-2 pl-2"
        >{{ $t('forms.requiredField') }}</span
      >
    </div>

    <LazySectionFormErrors
      :selected-lang="selectedLang"
      :default-lang="defaultLang"
      :locales="locales"
      :errors="errors"
    />
  </div>
</template>

<i18n src="./Shared_i18n.json"></i18n>

<script>
import {
  sectionsStyle,
  scrollToFirstError,
  assignMediaObject,
} from '@/utils/constants'

export default {
  name: 'TextImage',
  props: {
    selectedLang: {
      type: String,
      default: 'en',
    },
    defaultLang: {
      type: String,
      default: 'en',
    },
    selectedMedia: {},
    locales: {
      type: Array,
      default() {
        return []
      },
    },
    mediaFields: [
      {
        type: 'image',
        name: 'media',
      },
      {
        type: 'image',
        name: 'wysiwygMedia',
      },
    ],
  },
  setup() {
    const { t } = useI18n({
      useScope: 'local',
    })

    return {
      $t: t,
    }
  },
  data() {
    return {
      settings: [
        {
          title: {
            en: '',
            fr: '',
          },
          text: {
            en: '',
            fr: '',
          },
          titleClasses: '',
          textClasses: '',
          media: {
            media_id: '',
            url: '',
            seo_tag: '',
          },
          sectionWrapperClass: '',
          imagePosition: 'none',
          videoLink: '',
          autoplay: false,
          loop: false,
          controls: false,
          whiteProgress: false,
        },
      ],
      errors: {
        title: false,
        text: false,
        media: false,
      },
      siteLang: 'en',
      sectionsStyle,
      selectedMediaIndex: 0,
    }
  },
  watch: {
    selectedLang(val) {
      this.siteLang = val
    },
    selectedMedia(mediaObject) {
      let media = {}
      media = assignMediaObject(mediaObject)
      this.settings[this.selectedMediaIndex]['media'] = media
      this.$emit('closeMediaModal')
    },
  },
  methods: {
    wysiwygMediaAdded(media) {
      this.settings.push({
        wysiwygMedia: media,
        wysiwygLang: this.selectedLang,
      })
    },
    updateTitleDescription(content) {
      this.settings[0].title[this.selectedLang] = content
    },
    updateTextDescription(content) {
      this.settings[0].text[this.selectedLang] = content
    },
    removeMedia(idx) {
      this.settings[idx].media = {}
    },
    validate() {
      try {
        if (Array.isArray(this.settings)) {
          this.settings.forEach((ob, index) => {
            if (ob.wysiwygLang) {
              if (
                !JSON.stringify({
                  title: { ...this.settings[0].title },
                  text: { ...this.settings[0].text },
                }).includes(ob.wysiwygMedia.media_id)
              ) {
                this.settings.splice(index, 1)
              }
            }
          })
        }
      } catch {}
      for (let i = 0; i < this.settings.length; i++) {
        if (
          this.settings[i].media &&
          (Object.keys(this.settings[i].media).length === 0 ||
            !this.settings[i].media.media_id ||
            !this.settings[i].media.url)
        ) {
          delete this.settings[i].media
        }
      }
      let valid = true
      this.errors.title = false
      this.errors.text = false
      this.errors.media = false
      // Quill uses "<p><br></p>" for an empty editor, so we check for it to ensure the field is treated as required.
      if (
        !this.settings[0].title[this.defaultLang] ||
        this.settings?.[0]?.title?.[this.defaultLang] === '<p><br></p>'
      ) {
        this.errors.title = true
        valid = false
      }
      // Quill uses "<p><br></p>" for an empty editor, so we check for it to ensure the field is treated as required.
      if (
        !this.settings[0].text[this.defaultLang] ||
        this.settings?.[0]?.text?.[this.defaultLang] === '<p><br></p>'
      ) {
        this.errors.text = true
        valid = false
      }
      if (!valid) {
        scrollToFirstError(this.errors)
      }
      return valid
    },
    openMediaModalHandler(idx, media) {
      this.selectedMediaIndex = idx
      this.$emit(
        'openMediaModal',
        media && Object.keys(media).length > 0 ? media.media_id : null,
      )
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
