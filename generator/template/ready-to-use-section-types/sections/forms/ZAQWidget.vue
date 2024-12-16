<template>
  <div class="p-4">

    <p class="flex text-start mt-8 gap-1"><span class="flex text-xs text-Gray_800 pb-1">{{ $t('zaq.registerFirst') }}</span> <a href="https://www.zaq.ai/operator/register" target="_blank" class="underline text-Blue text-xs">{{ $t('zaq.here') }}</a></p>

    <div id="websiteId" class="flex flex-col items-start justify-start mt-1 mb-4">
      <label class="mr-4 font-medium">{{ $t("zaq.websiteId") }}</label>
      <span class="text-xs text-Gray_800"></span>
      <input
        v-model="settings[0].websiteId"
        type="text"
        value=""
        :placeholder="$t('zaq.websiteId')"
        :class="sectionsStyle.input"
      />
      <span v-if="errors.websiteId === true" class="flex text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
    </div>

    <div id="sequence" class="mb-4">
      <UploadMedia :is-document="true" :media-label="$t('zaq.sequence')" :upload-text="$t('forms.uploadMedia')" :change-text="$t('forms.changeMedia')" :seo-tag="$t('forms.seoTag')" :media="settings[0].sequence && Object.keys(settings[0].sequence).length > 0 ? [settings[0].sequence] : []" @uploadContainerClicked="selectedMediaKey = 'sequence'; $emit('openMediaModal', settings[0].sequence && Object.keys(settings[0].sequence).length > 0 ? settings[0].sequence.media_id : null)" @removeUploadedImage="removeMedia('sequence')" />
      <span v-if="errors.sequence === true" class="flex text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
    </div>

    <div v-if="sequences && Object.keys(sequences).length > 0" class="mb-4">
      <label class="flex section-module-upload-media-label">{{ $t('zaq.autoStart') }}</label>
      <div class="select-style-chooser w-344px">
        <gAutoComplete
          v-model="settings[0].autoStart"
          :placeholder="$t('zaq.autoStart')"
          :filter-label-prop="'value'"
          :reduce="(option) => option.key"
          :filter-options="computedSequences"
          :filter-searchable="false"
          :close-on-select="true"
          :track-by="'key'"
          @itemSelected="(val) => {settings[0].autoStart = val;}"
        >
        </gAutoComplete>
      </div>
    </div>


    <div class="mb-4">
      <UploadMedia :is-document="true" :media-label="$t('zaq.css')" :upload-text="$t('forms.uploadMedia')" :change-text="$t('forms.changeMedia')" :seo-tag="$t('forms.seoTag')" :media="settings[0].css && Object.keys(settings[0].css).length > 0 ? [settings[0].css] : []" @uploadContainerClicked="selectedMediaKey = 'css'; $emit('openMediaModal', settings[0].css && Object.keys(settings[0].css).length > 0 ? settings[0].css.media_id : null)" @removeUploadedImage="removeMedia('css')" />
      <span class="text-xs text-Gray_800"></span>
    </div>

    <div class="mb-4">
      <label class="flex section-module-upload-media-label">{{ $t('zaq.sendbtnIcon') }}</label>
      <span class="flex text-xs text-Gray_800 pb-1">{{ $t('zaq.recommendedSize') }}</span>
      <UploadMedia :media-label="''" :upload-text="$t('forms.uploadMedia')" :change-text="$t('forms.changeMedia')" :seo-tag="$t('forms.seoTag')" :media="settings[0].sendBtnMedia && Object.keys(settings[0].sendBtnMedia).length > 0 ? [settings[0].sendBtnMedia] : []" @uploadContainerClicked="selectedMediaKey = 'sendBtnMedia'; $emit('openMediaModal', settings[0].sendBtnMedia && Object.keys(settings[0].sendBtnMedia).length > 0 ? settings[0].sendBtnMedia.media_id : null)" @removeUploadedImage="removeMedia('sendBtnMedia')" />
    </div>

    <div class="mb-4">
      <label class="flex section-module-upload-media-label">{{ $t('zaq.typingIcon') }}</label>
      <span class="flex text-xs text-Gray_800 pb-1">{{ $t('zaq.recommendedSize') }}</span>
      <UploadMedia :media-label="''" :upload-text="$t('forms.uploadMedia')" :change-text="$t('forms.changeMedia')" :seo-tag="$t('forms.seoTag')" :media="settings[0].typingIconMedia && Object.keys(settings[0].typingIconMedia).length > 0 ? [settings[0].typingIconMedia] : []" @uploadContainerClicked="selectedMediaKey = 'typingIconMedia'; $emit('openMediaModal', settings[0].typingIconMedia && Object.keys(settings[0].typingIconMedia).length > 0 ? settings[0].typingIconMedia.media_id : null)" @removeUploadedImage="removeMedia('typingIconMedia')" />
    </div>

    <div class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 pb-2 font-bold">{{ $t("zaq.hideBadge") }}</label>
      <span class="text-xs text-Gray_800"></span>
      <input
        v-model="settings[0].hideBadge"
        type="checkbox"
        value=""
        :placeholder="$t('zaq.hideBadge')"
        class="
            h-25px
            w-25px
            pl-6
            border border-FieldGray
            rounded-xl
            focus:outline-none
          "
      />
    </div>

  </div>
</template>

<script>
import UploadMedia from "@geeks.solutions/nuxt-sections/lib/src/components/Medias/UploadMedia.vue";
import {sectionsStyle, scrollToFirstError} from "@/utils/constants";

export default {
  name: 'ZAQWidget',
  components: {
    UploadMedia
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
        name: 'sendBtnMedia'
      },
      {
        type: 'image',
        name: 'typingIconMedia'
      }
    ]
  },
  data() {
    return {
      settings: [
        {
          websiteId: '',
          sequence: {
            media_id: "",
            url: "",
            seo_tag: ""
          },
          css: {
            media_id: "",
            url: "",
            seo_tag: ""
          },
          sendBtnMedia: {
            media_id: "",
            url: "",
            seo_tag: ""
          },
          typingIconMedia: {
            media_id: "",
            url: "",
            seo_tag: ""
          },
          hideBadge: false,
          autoStart: 'None'
        }
      ],
      errors: {
        websiteId: false,
        sequence: false
      },
      siteLang: 'en',
      sectionsStyle,
      selectedMediaKey: 'sequence',
      sequences: null
    }
  },
  computed: {
    computedSequences() {
      return [...Object.keys(this.sequences), 'None'].map(val => {return {key: val, value: val}})
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
      this.$set(this.settings[0], this.selectedMediaKey, media);
      this.$emit('closeMediaModal')
      if (this.selectedMediaKey === 'sequence') {
        this.loadSequences()
      }
    },
    settings(v) {
      if (v && v[0] && v[0].sequence && v[0].sequence.url) {
        this.loadSequences()
      }
    }
  },
  methods: {
    async loadSequences() {
      if (this.settings && this.settings[0] && this.settings[0].sequence && this.settings[0].sequence.url) {
        try {
          const res = await this.$axios.get(this.settings[0].sequence.url);
          this.sequences = res.data;
        } catch (err) {}
      }
    },
    removeMedia(mediaKey) {
      this.settings[0][mediaKey] = {}
    },
    validate() {
      for(const mediaKey of ['sendBtnMedia', 'typingIconMedia']) {
        if (this.settings[0][mediaKey] && (Object.keys(this.settings[0][mediaKey]).length === 0 || !this.settings[0][mediaKey].media_id || !this.settings[0][mediaKey].url)) {
          delete this.settings[0][mediaKey]
        }
      }
      let valid = true;
      this.errors.websiteId = false;
      this.errors.sequence = false;
      if (!this.settings[0].websiteId) {
        this.errors.websiteId = true;
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
</style>
