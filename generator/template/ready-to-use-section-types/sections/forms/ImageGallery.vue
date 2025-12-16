<template>
  <div>
    <div class="flex flex-row justify-center mt-8">
      <h3 :class="sectionsStyle.fieldLabel">{{ $t('forms.images') }}</h3>
    </div>

    <div
      id="selectedLayout"
      class="flex flex-col items-start justify-start mt-8"
    >
      <label
        for="dropdown"
        class="block mb-2 text-sm font-medium text-gray-700"
        >{{ $t('forms.selectedLayout') }}</label
      >
      <select
        id="dropdown"
        v-model="settings[0].selectedLayout"
        class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="verticalMasonry">
          {{ $t('forms.verticalMasonry') }}
        </option>
        <option value="horizontalMasonry">
          {{ $t('forms.horizontalMasonry') }}
        </option>
        <option value="grid">{{ $t('forms.grid') }}</option>
        <option value="slider">{{ $t('forms.slider') }}</option>
        <option value="thumbnails">{{ $t('forms.thumbnails') }}</option>
      </select>
      <span
        v-if="errors.selectedLayout === true"
        class="flex text-error text-sm pt-2 pl-2"
        >{{ $t('forms.requiredField') }}</span
      >
    </div>

    <div
      v-if="
        settings[0].selectedLayout === 'slider' ||
        settings[0].selectedLayout === 'thumbnails'
      "
      id="containerHeight"
      class="flex flex-col items-start justify-start mt-8"
    >
      <label
        for="dropdown"
        class="block mb-2 text-sm font-medium text-gray-700"
        >{{ $t('forms.containerHeight') }}</label
      >
      <input
        v-model="settings[0].containerHeight"
        type="text"
        :placeholder="$t('forms.containerHeight')"
        :class="sectionsStyle.input"
      />
    </div>

    <div
      v-if="
        settings[0].selectedLayout === 'slider' ||
        settings[0].selectedLayout === 'thumbnails'
      "
      id="imageFit"
      class="flex flex-col items-start justify-start mt-8"
    >
      <label
        for="dropdown"
        class="block mb-2 text-sm font-medium text-gray-700"
        >{{ $t('forms.imageFit') }}</label
      >
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

    <div id="media" class="flex flex-col mt-4">
      <LazySectionsFormsFieldSets
        :array-data-pop="settings[0].gallery"
        :fieldset-group="'menu'"
        :legend-label="$t('forms.block')"
        @array-updated="(data) => (settings[0]['gallery'] = data)"
        @remove-fieldset="(object, idx) => removeGalleryBlock(idx)"
      >
        <template #default="{ object, idx }">
          <div>
            <div class="mb-4">
              <LazyMediasUploadMedia
                :media-label="
                  idx === 0
                    ? $t('forms.media') + ' (desktop)' + '*'
                    : $t('forms.media') + ' (desktop)'
                "
                :upload-text="$t('forms.uploadMedia')"
                :change-text="$t('forms.changeMedia')"
                :seo-tag="$t('forms.seoTag')"
                :media="
                  object.media && Object.keys(object.media).length > 0
                    ? [object.media]
                    : []
                "
                @uploadContainerClicked="
                  selectedMediaIndex = idx
                  selectedMediaKey = 'media'
                  $emit(
                    'openMediaModal',
                    object.media && Object.keys(object.media).length > 0
                      ? object.media.media_id
                      : null,
                  )
                "
                @removeUploadedImage="removeMedia(idx, 'media')"
              />
              <span
                v-if="errors.media === true && idx === 0"
                class="flex text-error text-sm pt-2 pl-2"
                >{{ $t('forms.requiredField') }}</span
              >
            </div>
          </div>

          <div :id="idx === 0 ? 'mediaMobile' : undefined">
            <div class="mb-4">
              <LazyMediasUploadMedia
                :media-label="
                  idx === 0
                    ? $t('forms.media') + ' (mobile)' + '*'
                    : $t('forms.media') + ' (mobile)'
                "
                :upload-text="$t('forms.uploadMedia')"
                :change-text="$t('forms.changeMedia')"
                :seo-tag="$t('forms.seoTag')"
                :media="
                  object.mediaMobile &&
                  Object.keys(object.mediaMobile).length > 0
                    ? [object.mediaMobile]
                    : []
                "
                @uploadContainerClicked="
                  selectedMediaIndex = idx
                  selectedMediaKey = 'mediaMobile'
                  $emit(
                    'openMediaModal',
                    object.mediaMobile &&
                      Object.keys(object.mediaMobile).length > 0
                      ? object.mediaMobile.media_id
                      : null,
                  )
                "
                @removeUploadedImage="removeMedia(idx, 'mediaMobile')"
              />
              <span
                v-if="errors.mediaMobile === true && idx === 0"
                class="flex text-error text-sm pt-2 pl-2"
                >{{ $t('forms.requiredField') }}</span
              >
            </div>
          </div>
        </template>
      </LazySectionsFormsFieldSets>

      <div
        class="add-button underline cursor-pointer mt-2 pb-4"
        @click="addMedia()"
      >
        <div class="p3 bold text">{{ $t('forms.addImage') }}</div>
      </div>
    </div>
  </div>
</template>

<i18n src="./Shared_i18n.json"></i18n>

<script>
import {
  assignMediaObject,
  scrollToFirstError,
  sectionsStyle,
} from '@/utils/constants'

export default {
  name: 'InteractiveDisplay',
  setup() {
    const { t } = useI18n({
      useScope: 'local',
    })

    return {
      $t: t,
    }
  },
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
        name: 'medias',
      },
    ],
  },
  data() {
    return {
      settings: [
        {
          containerHeight: '',
          imageFit: '',
          selectedLayout: '',
          media: {
            media_id: '',
            url: '',
            seo_tag: '',
          },
          mediaMobile: {
            media_id: '',
            url: '',
            seo_tag: '',
          },
          medias: [],
          gallery: [
            {
              media: {
                media_id: '',
                url: '',
                seo_tag: '',
              },
              mediaMobile: {
                media_id: '',
                url: '',
                seo_tag: '',
              },
            },
          ],
        },
      ],
      errors: {
        media: false,
        mediaMobile: false,
        selectedLayout: false,
      },
      siteLang: 'en',
      sectionsStyle,
      selectedMediaIndex: 0,
      selectedMediaKey: 'media',
    }
  },
  watch: {
    selectedLang(val) {
      this.siteLang = val
    },
    selectedMedia(mediaObject) {
      let media = {}
      console.log('mediaObject', mediaObject)
      media = assignMediaObject(mediaObject)
      this.settings[0].gallery[this.selectedMediaIndex][this.selectedMediaKey] =
        { ...media }
      const index = this.settings[0].medias.findIndex(
        (m) => m.media_id === media.media_id,
      )
      if (index !== -1) {
        this.settings[0].medias[index] = media
      } else {
        this.settings[0].medias.push(media)
      }
      this.$emit('closeMediaModal')
    },
    settings: {
      handler(v) {
        if (v && v[0] && v[0].gallery === undefined) {
          this.settings[0]['gallery'] = []
          this.settings[0].medias = []
          this.settings.forEach((st) => {
            this.settings[0].gallery.push(JSON.parse(JSON.stringify(st)))
            if (st.media && st.media.media_id) {
              this.settings[0].medias.push(st.media)
            }
            if (st.mediaMobile && st.mediaMobile.media_id) {
              this.settings[0].medias.push(st.mediaMobile)
            }
          })
        }
        if (v && v[0] && v[0].videoTitle === undefined) {
          this.settings[0].videoTitle = {
            en: '',
            fr: '',
          }
          this.settings[0].videoText = {
            en: '',
            fr: '',
          }
          this.settings[0].videoTitleClasses = ''
          this.settings[0].videoTextClasses = ''
          this.settings[0].videoCta = {
            en: '',
            fr: '',
          }
          this.settings[0].videoCtaLink = {
            en: '',
            fr: '',
          }
          this.settings[0].videoCtaLinkTarget = ''
        }
      },
    },
  },
  methods: {
    addMedia() {
      this.settings[0].gallery.push({
        media: {
          media_id: '',
          url: '',
          seo_tag: '',
        },
        mediaMobile: {
          media_id: '',
          url: '',
          seo_tag: '',
        },
      })
    },
    removeMedia(idx, key) {
      try {
        const mediaIndex = this.settings[0].medias.find(
          (md) => md.media_id === this.settings[0].gallery[idx][key].media_id,
        )
        this.settings[0].medias = this.settings[0].medias.filter(
          (img, i) => mediaIndex !== i,
        )
      } catch {}
      this.settings[0].gallery[idx][key] = {}
    },
    removeGalleryBlock(idx) {
      if (this.settings[0].gallery.length > 1) {
        this.settings[0].gallery = this.settings[0].gallery.filter(
          (img, i) => idx !== i,
        )
      }
    },
    validate() {
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
      for (let i = 0; i < this.settings.length; i++) {
        if (
          this.settings[i].mediaMobile &&
          (Object.keys(this.settings[i].mediaMobile).length === 0 ||
            !this.settings[i].mediaMobile.media_id ||
            !this.settings[i].mediaMobile.url)
        ) {
          delete this.settings[i].mediaMobile
        }
      }
      let valid = true
      this.errors.media = false
      this.errors.mediaMobile = false
      this.errors.selectedLayout = false
      if (!this.settings[0].selectedLayout) {
        this.errors.selectedLayout = true
        valid = false
      }
      if (
        (!this.settings[0].gallery[0].media ||
          !this.settings[0].gallery[0].media.url) &&
        (!this.settings[0].gallery[0].mediaMobile ||
          !this.settings[0].gallery[0].mediaMobile.url)
      ) {
        if (
          !this.settings[0].gallery[0].media ||
          !this.settings[0].gallery[0].media.url
        ) {
          this.errors.media = true
        } else if (
          !this.settings[0].gallery[0].mediaMobile ||
          !this.settings[0].gallery[0].mediaMobile.url
        ) {
          this.errors.mediaMobile = true
        }
        valid = false
      } else if (
        this.settings[0].gallery[0].media &&
        this.settings[0].gallery[0].media.url
      ) {
        if (
          !this.settings[0].gallery[0].mediaMobile ||
          !this.settings[0].gallery[0].mediaMobile.url
        ) {
          this.errors.mediaMobile = true
          valid = false
        }
      }
      if (!valid) {
        scrollToFirstError(this.errors)
      }
      return valid
    },
  },
}
</script>

<style>
.content-wrapper {
  overflow-x: hidden;
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
  content: '';
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
