<template>
  <div class="p-4">
    <p class="flex text-start mt-8 gap-1">
      <span class="flex text-xs text-Gray_800 pb-1">{{
        $t('zaq.registerFirst')
      }}</span>
      <a
        href="https://www.zaq.ai/operator/register"
        target="_blank"
        class="underline text-Blue text-xs"
        >{{ $t('zaq.here') }}</a
      >
    </p>

    <div
      id="websiteId"
      class="flex flex-col items-start justify-start mt-1 mb-4"
    >
      <label class="mr-4 font-medium">{{ $t('zaq.websiteId') }}</label>
      <span class="text-xs text-Gray_800"></span>
      <input
        v-model="settings[0].websiteId"
        type="text"
        :placeholder="$t('zaq.websiteId')"
        :class="sectionsStyle.input"
      />
      <span
        v-if="errors.websiteId === true"
        class="flex text-error text-sm pt-2 pl-2"
        >{{ $t('forms.requiredField') }}</span
      >
    </div>

    <div id="sequence" class="mb-4">
      <LazyMediasUploadMedia
        :is-document="true"
        :media-label="$t('zaq.sequence')"
        :upload-text="$t('zaq.uploadMedia')"
        :change-text="$t('zaq.changeMedia')"
        :seo-tag="$t('zaq.seoTag')"
        :media="
          settings[0].sequence && Object.keys(settings[0].sequence).length > 0
            ? [settings[0].sequence]
            : []
        "
        @upload-container-clicked="
          openMediaModalHandler('sequence', settings[0].sequence)
        "
        @remove-uploaded-image="removeMedia('sequence')"
      />
      <span
        v-if="errors.sequence === true"
        class="flex text-error text-sm pt-2 pl-2"
        >{{ $t('forms.requiredField') }}</span
      >
    </div>

    <div v-if="sequences && Object.keys(sequences).length > 0" class="mb-4">
      <label class="flex section-module-upload-media-label">{{
        $t('zaq.autoStart')
      }}</label>
      <div class="select-style-chooser w-[344px]">
        <gAutoComplete
          :main-filter="settings[0].autoStart"
          :placeholder="$t('zaq.autoStart')"
          :filter-label-prop="'value'"
          :reduce="(option) => option.key"
          :filter-options="computedSequences"
          :filter-searchable="false"
          :close-on-select="true"
          :track-by="'key'"
          @item-selected="
            (val) => {
              settings[0].autoStart = val
            }
          "
        >
        </gAutoComplete>
      </div>
      <span class="flex flex-row text-start text-xs text-Gray_800 mt-2">{{
        $t('forms.linksDescription4')
      }}</span>
    </div>

    <div class="mb-4">
      <LazyMediasUploadMedia
        :is-document="true"
        :media-label="$t('zaq.css')"
        :upload-text="$t('zaq.uploadMedia')"
        :change-text="$t('zaq.changeMedia')"
        :seo-tag="$t('zaq.seoTag')"
        :media="
          settings[0].css && Object.keys(settings[0].css).length > 0
            ? [settings[0].css]
            : []
        "
        @upload-container-clicked="
          openMediaModalHandler('css', settings[0].css)
        "
        @remove-uploaded-image="removeMedia('css')"
      />
      <span class="text-xs text-Gray_800"></span>
    </div>

    <div class="mb-4">
      <label class="flex section-module-upload-media-label">{{
        $t('zaq.sendbtnIcon')
      }}</label>
      <span class="flex text-xs text-Gray_800 pb-1">{{
        $t('zaq.recommendedSize')
      }}</span>
      <LazyMediasUploadMedia
        :media-label="''"
        :upload-text="$t('zaq.uploadMedia')"
        :change-text="$t('zaq.changeMedia')"
        :seo-tag="$t('zaq.seoTag')"
        :media="
          settings[0].sendBtnMedia &&
          Object.keys(settings[0].sendBtnMedia).length > 0
            ? [settings[0].sendBtnMedia]
            : []
        "
        @upload-container-clicked="
          openMediaModalHandler('sendBtnMedia', settings[0].sendBtnMedia)
        "
        @remove-uploaded-image="removeMedia('sendBtnMedia')"
      />
    </div>

    <div class="mb-4">
      <label class="flex section-module-upload-media-label">{{
        $t('zaq.typingIcon')
      }}</label>
      <span class="flex text-xs text-Gray_800 pb-1">{{
        $t('zaq.recommendedSize')
      }}</span>
      <LazyMediasUploadMedia
        :media-label="''"
        :upload-text="$t('zaq.uploadMedia')"
        :change-text="$t('zaq.changeMedia')"
        :seo-tag="$t('zaq.seoTag')"
        :media="
          settings[0].typingIconMedia &&
          Object.keys(settings[0].typingIconMedia).length > 0
            ? [settings[0].typingIconMedia]
            : []
        "
        @upload-container-clicked="
          openMediaModalHandler('typingIconMedia', settings[0].typingIconMedia)
        "
        @remove-uploaded-image="removeMedia('typingIconMedia')"
      />
    </div>

    <div class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 pb-2 font-bold">{{ $t('zaq.hideBadge') }}</label>
      <span class="text-xs text-Gray_800"></span>
      <input
        v-model="settings[0].hideBadge"
        type="checkbox"
        :placeholder="$t('zaq.hideBadge')"
        class="h-[25px] w-[25px] pl-6 border border-FieldGray rounded-xl focus:outline-none"
      />
    </div>
  </div>
</template>

<i18n src="./ZAQWidget_i18n.json"></i18n>

<script>
import { sectionsStyle, scrollToFirstError } from '@/utils/constants'
import { useCookie } from '#imports'
import { useFetch } from '#app'

export default {
  name: 'ZAQWidget',
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
        name: 'sendBtnMedia',
      },
      {
        type: 'image',
        name: 'typingIconMedia',
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
          websiteId: '',
          sequence: {
            media_id: '',
            url: '',
            seo_tag: '',
          },
          css: {
            media_id: '',
            url: '',
            seo_tag: '',
          },
          sendBtnMedia: {
            media_id: '',
            url: '',
            seo_tag: '',
          },
          typingIconMedia: {
            media_id: '',
            url: '',
            seo_tag: '',
          },
          hideBadge: false,
          autoStart: 'None',
        },
      ],
      errors: {
        websiteId: false,
        sequence: false,
      },
      siteLang: 'en',
      sectionsStyle,
      selectedMediaKey: 'sequence',
      sequences: null,
    }
  },
  computed: {
    computedSequences() {
      return [...Object.keys(this.sequences), 'None'].map((val) => {
        return { key: val, value: val }
      })
    },
  },
  watch: {
    selectedLang(val) {
      this.siteLang = val
    },
    selectedMedia(mediaObject) {
      const media = {
        media_id: '',
        url: '',
        seo_tag: '',
        filename: '',
        headers: {},
      }
      media.media_id = mediaObject.id
      media.url = mediaObject.files[0].url
      media.seo_tag = mediaObject.seo_tag
      media.filename = mediaObject.files[0].filename
      if (mediaObject.files[0].headers) {
        media.headers = mediaObject.files[0].headers
      }
      this.settings[0][this.selectedMediaKey] = media
      this.$emit('closeMediaModal')
      this.settings[0].autoStart = 'None'
      if (this.selectedMediaKey === 'sequence') {
        this.loadSequences()
      }
    },
    settings(v) {
      if (v && v[0] && v[0].sequence && v[0].sequence.url) {
        this.loadSequences()
      }
    },
  },
  methods: {
    async loadSequences() {
      if (
        this.settings &&
        this.settings[0] &&
        this.settings[0].sequence &&
        this.settings[0].sequence.url
      ) {
        try {
          const res = await useFetch(this.settings[0].sequence.url, {
            method: 'GET',
          })
          this.sequences = res.data
        } catch (err) {}
      }
    },
    removeMedia(mediaKey) {
      this.settings[0][mediaKey] = {}
      this.settings[0].autoStart = 'None'
      this.sequences = null
    },
    validate() {
      try {
        const allCookies = [] // this.$cookies.getAll();
        Object.keys(allCookies).forEach((cookieName) => {
          if (cookieName.startsWith('zaq_')) {
            useCookie(cookieName).value = null
          }
        })
      } catch {}
      for (const mediaKey of ['sendBtnMedia', 'typingIconMedia']) {
        if (
          this.settings[0][mediaKey] &&
          (Object.keys(this.settings[0][mediaKey]).length === 0 ||
            !this.settings[0][mediaKey].media_id ||
            !this.settings[0][mediaKey].url)
        ) {
          delete this.settings[0][mediaKey]
        }
      }
      let valid = true
      this.errors.websiteId = false
      this.errors.sequence = false
      if (!this.settings[0].websiteId) {
        this.errors.websiteId = true
        valid = false
      }
      if (!valid) {
        scrollToFirstError(this.errors)
      }
      return valid
    },
    openMediaModalHandler(key, media) {
      this.selectedMediaKey = key
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
</style>
