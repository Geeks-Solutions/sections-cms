<template>
  <div class="p-4">

    <div id="websiteId" class="flex flex-col items-start justify-start mt-8 mb-4">
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

    <div id="sequenceName" class="flex flex-col items-start justify-start mt-8 mb-4">
      <label class="mr-4 font-medium">{{ $t("zaq.sequenceName") }}</label>
      <span class="text-xs text-Gray_800"></span>
      <input
        v-model="settings[0].sequenceName"
        type="text"
        value=""
        :placeholder="$t('zaq.sequenceName')"
        :class="sectionsStyle.input"
      />
      <span v-if="errors.sequenceName === true" class="flex text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
    </div>

    <div id="sequence" class="mb-4">
      <UploadMedia :is-document="true" :media-label="$t('zaq.sequence')" :upload-text="$t('forms.uploadMedia')" :change-text="$t('forms.changeMedia')" :seo-tag="$t('forms.seoTag')" :media="settings[0].sequence && Object.keys(settings[0].sequence).length > 0 ? [settings[0].sequence] : []" @uploadContainerClicked="selectedMediaKey = 'sequence'; $emit('openMediaModal', settings[0].sequence && Object.keys(settings[0].sequence).length > 0 ? settings[0].sequence.media_id : null)" @removeUploadedImage="removeMedia('sequence')" />
      <span v-if="errors.sequence === true" class="flex text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
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
          sequenceName: '',
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
          hideBadge: false
        }
      ],
      errors: {
        websiteId: false,
        sequenceName: false,
        sequence: false
      },
      siteLang: 'en',
      sectionsStyle,
      selectedMediaKey: 'sequence'
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
    }
  },
  methods: {
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
      this.errors.sequenceName = false;
      this.errors.sequence = false;
      if (!this.settings[0].websiteId) {
        this.errors.websiteId = true;
        valid = false;
      }
      if (!this.settings[0].sequenceName) {
        this.errors.sequenceName = true;
        valid = false;
      }
      if (!this.settings[0].sequence || !this.settings[0].sequence.url) {
        this.errors.sequence = true;
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
