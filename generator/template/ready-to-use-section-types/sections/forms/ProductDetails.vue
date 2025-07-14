<template>
  <div class="p-4">

    <div id="name" class="flex flex-col items-start justify-start mt-8">
      <label :class="sectionsStyle.fieldLabel">{{ $t("forms.name") + '*' }}</label>
      <input
        v-model="settings[0].name[selectedLang]"
        type="text"
        :placeholder="$t('forms.name')"
        :class="sectionsStyle.input"
      />
      <span v-show="errors[`name`] === true && selectedLang === defaultLang"
            class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
    </div>

    <div id="description" class="flex flex-col items-start justify-start mt-8">
      <label :class="sectionsStyle.fieldLabel">{{ $t("forms.description") }}</label>
      <LazyEditorWysiwyg :html="settings[0].description[selectedLang]" :css-classes-prop="settings[0].descriptionClasses" @cssClassesChanged="(v) => settings[0]['descriptionClasses'] = v" @settingsUpdate="(content) => updateTextDescription(content)"/>
      <span v-if="errors.description === true && selectedLang === defaultLang" class="flex text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
    </div>

    <div id="price" class="flex flex-col items-start justify-start mt-8">
      <label :class="sectionsStyle.fieldLabel">{{ $t("productDetails.price") + '*' }}</label>
      <input
        v-model="settings[0].price"
        type="number"
        :placeholder="$t('productDetails.price')"
        :class="sectionsStyle.input"
      />
      <span v-show="errors[`price`] === true"
            class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
    </div>

    <div id="currency" class="flex flex-col items-start justify-start mt-8">
      <label :class="sectionsStyle.fieldLabel">{{ $t('productDetails.currency') + '*' }}</label>
      <input
        v-model="settings[0].currency"
        type="text"
        :placeholder="$t('productDetails.currency')"
        :class="sectionsStyle.input"
      />
      <span v-show="errors[`currency`] === true"
            class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
    </div>

    <div class="flex flex-col items-start justify-start mt-8">
      <label for="dropdown" class="block mb-2 text-sm font-medium text-gray-700">{{ $t('productDetails.currencyPosition') }}</label>
      <select
        id="dropdown"
        v-model="settings[0].currencyPosition"
        class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="left">{{ $t('productDetails.left') }}</option>
        <option value="right">{{ $t('productDetails.right') }}</option>
      </select>
    </div>

    <div class="flex flex-col items-start mt-8">
      <label :class="sectionsStyle.fieldLabel">{{ $t('productDetails.videoControls') }}</label>
      <span class="flex text-start text-xs mb-1 text-gray-700">{{ $t('productDetails.videoOptions') }}</span>
    </div>

    <div class="flex flex-wrap pt-4 pl-6">
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

    <div id="imageFit" class="flex flex-col items-start justify-start mt-8">
      <label for="dropdown" class="flex section-module-upload-media-label">{{ $t('forms.imageFit') }}</label>
      <span class="text-start text-xs text-gray-700 mb-1">{{ $t('productDetails.imageFitDesc') }}</span>
      <select
        id="dropdown"
        v-model="settings[0].imageFit"
        class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="cover">{{ $t('forms.cover') }}</option>
        <option value="contain">{{ $t('forms.contain') }}</option>
        <option value="fill">{{ $t('forms.fill') }}</option>
        <option value="none">{{ $t('forms.none') }}</option>
      </select>
    </div>

    <div id="ctaLabel" class="flex flex-col items-start justify-start mt-8">
      <label :class="sectionsStyle.fieldLabel">{{ $t("forms.ctaLabel") }}</label>
      <input
        v-model="settings[0].ctaLabel[selectedLang]"
        type="text"
        :placeholder="$t('forms.ctaLabel')"
        :class="sectionsStyle.input"
      />
    </div>

    <LazyFormLink
      :link-label="$t('forms.ctaLink')"
      :selected-sections-page="settings[0].sectionsPage[selectedLang]"
      :other-link="settings[0].ctaLink[selectedLang]"
      :link-target="settings[0].linkTarget"
      :sections-pages-label="$t('forms.sectionsPages')"
      :other-link-label="$t('Other')"
      :link-target-label="$t('forms.linkTarget')"
      @sections-page-selected="(val) => {locales.forEach(locale => { settings[0].sectionsPage[locale] = val })}"
      @update:other-link="(val) => {settings[0].ctaLink[selectedLang] = val}"
      @link-target-selected="(val) => {settings[0].linkTarget = val}"
    />

    <div id="media" class="flex flex-col mt-4">

      <LazySectionsFormsFieldSets :array-data-pop="private_data.productMedias" :fieldset-group="'productDetails'" :legend-label="$t('forms.media')" @array-updated="(data) => private_data.productMedias = data" @remove-fieldset="(object, idx) => removeProductMediaBlock(idx)">
        <template #default="{ object, idx }">

          <div class="my-4">
            <label class="flex section-module-upload-media-label">{{ $t('productDetails.mediaType') }}</label>
            <div class="select-style-chooser w-[344px]">
              <gAutoComplete
                :main-filter="object.mediaType"
                :placeholder="$t('productDetails.mediaType')"
                :filter-label-prop="'value'"
                :reduce="(option) => option.key"
                :filter-options="mediaTypes"
                :filter-searchable="false"
                :close-on-select="true"
                :filter-clearable="true"
                :track-by="'key'"
                @itemSelected="(val) => {object.mediaType = val;}"
              >
              </gAutoComplete>
            </div>
          </div>

          <div v-if="object.mediaType === 'image'">
            <div class="mb-4">
              <LazyMediasUploadMedia :media-label="idx === 0 ? $t('forms.media') + '*' : $t('forms.media')" :upload-text="$t('forms.uploadMedia')" :change-text="$t('forms.changeMedia')" :seo-tag="$t('forms.seoTag')" :media="object.media && Object.keys(object.media).length > 0 ? [object.media] : []" @uploadContainerClicked="selectedMediaIndex = idx; $emit('openMediaModal', object.media && Object.keys(object.media).length > 0 ? object.media.media_id : null)" @removeUploadedImage="removeProductMedia(idx, 'media')" />
              <span v-if="errors.media === true && idx === 0" class="flex text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
            </div>
          </div>

          <div v-else-if="object.mediaType === 'video'" class="flex flex-col items-start justify-start mt-8 ml-2">
            <label :class="sectionsStyle.fieldLabel">{{ $t("forms.video") }}</label>
            <span class="text-xs text-Gray_800">{{ $t("productDetails.videoEmbedDesc") }}</span>
            <input
              v-model="object.video.url"
              type="text"
              :placeholder="$t('forms.videoLink')"
              :class="sectionsStyle.input"
            />
            <span v-if="errors.media === true" class="flex text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
          </div>

        </template>
      </LazySectionsFormsFieldSets>

      <div
        class="add-button underline cursor-pointer mt-2 pb-4"
        @click="addProductMedia()"
      >
        <div class="p3 bold text">{{ $t("productDetails.addMedia") }}</div>
      </div>
    </div>

    <LazySectionFormErrors :selectedLang="selectedLang" :default-lang="defaultLang" :locales="locales" :errors="errors" />

  </div>
</template>

<i18n src="./Shared_i18n.json"></i18n>
<i18n src="./ProductDetails_i18n.json"></i18n>

<script>
import {sectionsStyle, scrollToFirstError} from "@/utils/constants";

export default {
  name: 'TextImage',
  setup() {
    const { t } = useI18n({
      useScope: 'local'
    })

    return {
      $t: t,
      t
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
        name: 'medias'
      }
    ]
  },
  data() {
    return {
      private_data: {
        productMedias: [
          {
            mediaType: "image",
            media: {
              media_id: "",
              url: "",
              thumbnail_url: "",
              seo_tag: "",
            },
            video: {
              url: ""
            }
          }
        ],
        medias: []
      },
      settings: [
        {
          name: {
            en: '',
            fr: ''
          },
          description: {
            en: '',
            fr: ''
          },
          descriptionClasses: '',
          price: null,
          currency: '',
          currencyPosition: '',
          autoplay: false,
          loop: false,
          controls: false,
          whiteProgress: false,
          imageFit: '',
          ctaLabel: {
            en: '',
            fr: ''
          },
          ctaLink: {
            en: '',
            fr: ''
          },
          sectionsPage: {},
          linkTarget: '',
          productMedias: []
        }
      ],
      errors: {
        name: false,
        description: false,
        price: false,
        currency: false,
        media: false
      },
      siteLang: 'en',
      sectionsStyle,
      selectedMediaIndex: 0,
      mediaTypes: [
        {
          key: 'image',
          value: this.t('forms.image')
        },
        {
          key: 'video',
          value: this.t('forms.video')
        }
      ]
    }
  },
  watch: {
    settings(v) {
      this.locales.forEach(locale => {
        for(const key of ['sectionsPage', 'ctaLabel', 'ctaLink']) {
          if (!v[0][key]) {
            v[0][key] = {}
          }
          if (!v[0][key][locale]) {
            v[0][key][locale] = ''
          }
        }
      })
    },
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
      media.thumbnail_url = mediaObject.files[0].thumbnail_url;
      media.seo_tag = mediaObject.seo_tag;
      media.filename = mediaObject.files[0].filename;
      if (mediaObject.files[0].headers) {
        media.headers = mediaObject.files[0].headers
      }
      const mediaIndex = this.private_data.medias.findIndex(media => media.media_id === mediaObject.id)
      if (mediaIndex !== -1) {
        this.private_data.medias[mediaIndex] = media
      } else {
        this.private_data.medias.push(media)
      }
      this.private_data.productMedias[this.selectedMediaIndex]['media'] = media
      this.$emit('closeMediaModal')
    },
    private_data: {
      handler() {
        this.buildProductMediaSettings(this.private_data.productMedias)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    buildProductMediaSettings(settings) {
      if (settings) {
        this.settings[0].productMedias = []
        settings.forEach(productMedia => {
          if (productMedia.mediaType === 'image') {
            this.settings[0].productMedias.push({
              mediaType: productMedia.mediaType,
              media: productMedia.media ? {
                media_id: productMedia.media.media_id,
                seo_tag: productMedia.media.seo_tag,
                url: productMedia.media.url,
                thumbnail_url: productMedia.media.thumbnail_url
              } : undefined
            })
          } else {
            this.settings[0].productMedias.push({
              mediaType: productMedia.mediaType,
              video: productMedia.video
            })
          }
        })
      }
    },
    updateTextDescription(content) {
      this.settings[0].description[this.selectedLang] = content
    },
    removeProductMedia(idx) {
      try {
        const mediaIndex = this.private_data.medias.find(md => this.private_data.productMedias[idx].media && md.media_id === this.private_data.productMedias[idx].media.media_id)
        this.private_data.medias = this.private_data.medias.filter((img, i) => mediaIndex !== i)
        this.private_data.productMedias[idx].media = {
          media_id: "",
          url: "",
          thumbnail_url: "",
          seo_tag: "",
        }
      } catch {}
    },
    removeProductMediaBlock(idx) {
      if (this.private_data.productMedias.length > 1) {
        this.private_data.productMedias = this.private_data.productMedias.filter((img, i) => idx !== i);
      }
      try {
        const mediaIndex = this.private_data.medias.find(md => md.media_id === this.private_data.productMedias[idx].media.media_id)
        this.private_data.medias = this.private_data.medias.filter((img, i) => mediaIndex !== i)
        delete this.private_data.productMedias[idx].media
      } catch {}
    },
    addProductMedia() {
      this.private_data.productMedias.push({
        mediaType: "image",
        media: {
          media_id: "",
          url: "",
          thumbnail_url: "",
          seo_tag: "",
        },
        video: {
          url: ""
        }
      });
    },
    validate() {
      this.private_data.productMedias = this.private_data.productMedias.filter((item, index) => {
        if (index === 0) return true;
        if (item.mediaType === 'image') {
          return !!item.media?.url; // keep only if media.url is non-empty
        }
        if (item.mediaType === 'video') {
          return !!item.video?.url; // keep only if video.url is non-empty
        }
        return true; // keep if mediaType is something else
      });
      this.settings[0].productMedias = this.settings[0].productMedias.filter((item, index) => {
        if (index === 0) return true;
        if (item.mediaType === 'image') {
          return !!item.media?.url; // keep only if media.url is non-empty
        }
        if (item.mediaType === 'video') {
          return !!item.video?.url; // keep only if video.url is non-empty
        }
        return true; // keep if mediaType is something else
      });

      let valid = true;
      this.errors.name = false;
      this.errors.description = false;
      this.errors.price = false;
      this.errors.currency = false;
      this.errors.media = false;
      if (!this.settings[0].name[this.defaultLang]) {
        this.errors.name = true;
        valid = false;
      }
      if (!this.settings[0].price) {
        this.errors.price = true;
        valid = false;
      }
      if (!this.settings[0].currency) {
        this.errors.currency = true;
        valid = false;
      }
      if (this.settings[0].productMedias[0].mediaType === 'image') {
        if (!this.settings[0].productMedias[0].media || !this.settings[0].productMedias[0].media.url) {
          this.errors.media = true;
          valid = false
        }
      } else {
        if (!this.settings[0].productMedias[0].video || !this.settings[0].productMedias[0].video.url) {
          this.errors.media = true;
          valid = false
        }
      }
      if (!valid) {
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
.array-list-fieldsets > div:first-of-type > fieldset:first-of-type span span {
  display: none;
}
.toggle-checkbox {
  width: 40px;
  height: 20px;
  appearance: none;
  background: #e2e8f0;
  border-radius: 9999px;
  position: relative;
  outline: none;
  cursor: pointer;
  transition: background-color 0.2s;
}
.toggle-checkbox:checked {
  background: #31a9db;
}
.toggle-checkbox:before {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s;
}
.toggle-checkbox:checked:before {
  transform: translateX(20px);
}
</style>
