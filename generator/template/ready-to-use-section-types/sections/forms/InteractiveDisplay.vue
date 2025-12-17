<template>
  <div>
    <div
      id="videoLink"
      class="flex flex-col items-start justify-start mt-8 ml-2"
    >
      <label :class="sectionsStyle.fieldLabel">{{
        $t('forms.video') + '*'
      }}</label>
      <input
        v-model="settings[0].videoLink"
        type="text"
        :placeholder="$t('forms.videoLink') + '*'"
        :class="sectionsStyle.input"
      />
      <span
        v-if="errors.videoLink === true"
        class="flex text-error text-sm pt-2 pl-2"
        >{{ $t('forms.requiredField') }}</span
      >
    </div>

    <div v-if="settings[0].videoLink">
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
      <div class="my-4 ml-6">
        <label class="flex section-module-upload-media-label">{{
          $t('forms.aspectRatio')
        }}</label>
        <div class="select-style-chooser w-[344px]">
          <gAutoComplete
            :main-filter="settings[0].aspectRatio"
            :placeholder="$t('forms.aspectRatio')"
            :filter-label-prop="'value'"
            :reduce="(option) => option.key"
            :filter-options="[
              { key: '16/9', value: '16:9' },
              { key: '9/16', value: '9:16' },
            ]"
            :filter-searchable="false"
            :close-on-select="true"
            :filter-clearable="true"
            :track-by="'key'"
            @item-selected="
              (val) => {
                settings[0].aspectRatio = val
              }
            "
          >
          </gAutoComplete>
        </div>
      </div>
    </div>

    <!--    Mobile video start  -->
    <div class="flex flex-col items-start justify-start mt-8 ml-2">
      <label :class="sectionsStyle.fieldLabel">{{
        $t('forms.video') + '(Mobile)'
      }}</label>
      <input
        v-model="settings[0].mobileVideoLink"
        type="text"
        :placeholder="$t('forms.videoLink') + '(Mobile)'"
        :class="sectionsStyle.input"
      />
    </div>

    <div v-if="settings[0].mobileVideoLink">
      <div class="flex flex-wrap pt-4 pl-6">
        <div class="pr-4">
          <label class="flex items-center space-x-2">
            <span>{{ $t('forms.autoPlay') }}</span>
            <input
              v-model="settings[0].mobileAutoplay"
              type="checkbox"
              class="toggle-checkbox"
            />
          </label>
        </div>
        <div class="pr-4">
          <label class="flex items-center space-x-2">
            <span>{{ $t('forms.loop') }}</span>
            <input
              v-model="settings[0].mobileLoop"
              type="checkbox"
              class="toggle-checkbox"
            />
          </label>
        </div>
        <div class="pr-4">
          <label class="flex items-center space-x-2">
            <span>{{ $t('forms.removeControls') }}</span>
            <input
              v-model="settings[0].mobileControls"
              type="checkbox"
              class="toggle-checkbox"
            />
          </label>
        </div>
        <div class="pr-4">
          <label class="flex items-center space-x-2">
            <span>{{ $t('forms.whiteProgress') }}</span>
            <input
              v-model="settings[0].mobileWhiteProgress"
              type="checkbox"
              class="toggle-checkbox"
            />
          </label>
        </div>
      </div>
      <div class="my-4 ml-6">
        <label class="flex section-module-upload-media-label">{{
          $t('forms.aspectRatio') + '(Mobile)'
        }}</label>
        <div class="select-style-chooser w-[344px]">
          <gAutoComplete
            :main-filter="settings[0].mobileAspectRatio"
            :placeholder="$t('forms.aspectRatio') + '(Mobile)'"
            :filter-label-prop="'value'"
            :reduce="(option) => option.key"
            :filter-options="[
              { key: '16/9', value: '16:9' },
              { key: '9/16', value: '9:16' },
            ]"
            :filter-searchable="false"
            :close-on-select="true"
            :filter-clearable="true"
            :track-by="'key'"
            @item-selected="
              (val) => {
                settings[0].mobileAspectRatio = val
              }
            "
          >
          </gAutoComplete>
        </div>
      </div>
    </div>
    <!--    Mobile video end  -->

    <div v-if="settings[0].videoLink">
      <div class="flex flex-col items-start justify-start mt-8">
        <label :class="sectionsStyle.fieldLabel">{{ $t('forms.title') }}</label>
        <LazyEditorWysiwyg
          :html="settings[0].videoTitle[selectedLang]"
          :css-classes-prop="settings[0].videoTitleClasses"
          @css-classes-changed="(v) => (settings[0]['videoTitleClasses'] = v)"
          @wysiwyg-media="wysiwygMediaAdded"
          @settings-update="
            (content) => updateVideoTitleDescription(content, 0)
          "
        />
      </div>

      <div class="flex flex-col items-start justify-start mt-8">
        <label :class="sectionsStyle.fieldLabel">{{ $t('forms.text') }}</label>
        <LazyEditorWysiwyg
          :html="settings[0].videoText[selectedLang]"
          :css-classes-prop="settings[0].videoTextClasses"
          @css-classes-changed="(v) => (settings[0]['videoTextClasses'] = v)"
          @wysiwyg-media="wysiwygMediaAdded"
          @settings-update="(content) => updateVideoTextDescription(content, 0)"
        />
      </div>

      <div class="flex flex-col items-start justify-start mt-8">
        <label :class="sectionsStyle.fieldLabel">{{ $t('forms.cta') }}</label>
        <input
          v-model="settings[0].videoCta[selectedLang]"
          type="text"
          :placeholder="$t('forms.cta')"
          :class="sectionsStyle.input"
        />
      </div>

      <LazyFormLink
        :link-label="$t('forms.ctaLink')"
        :selected-sections-page="settings[0].sectionsPage[selectedLang]"
        :other-link="settings[0].videoCtaLink[selectedLang]"
        :link-target="settings[0].videoCtaLinkTarget"
        :sections-pages-label="$t('forms.sectionsPages')"
        :other-link-label="$t('Other')"
        :link-target-label="$t('forms.linkTarget')"
        @sections-page-selected="
          (val) => {
            locales.forEach((locale) => {
              settings[0].sectionsPage[locale] = val
            })
          }
        "
        @update:other-link="
          (val) => {
            settings[0].videoCtaLink[selectedLang] = val
          }
        "
        @link-target-selected="
          (val) => {
            settings[0].videoCtaLinkTarget = val
          }
        "
      />
    </div>

    <div class="flex flex-row justify-center mt-8">
      <h3 :class="sectionsStyle.fieldLabel">{{ $t('forms.carousel') }}</h3>
    </div>

    <div
      id="containerHeight"
      class="flex flex-col items-start justify-start mt-8 ml-2"
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

    <div id="imageFit" class="flex flex-col items-start justify-start mt-8">
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
        :array-data-pop="settings[0].carousels"
        :fieldset-group="'menu'"
        :legend-label="$t('forms.block')"
        @array-updated="(data) => (settings[0]['carousels'] = data)"
        @remove-fieldset="(object, idx) => removeCarouselBlock(idx)"
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
                @upload-container-clicked="
                  openMediaModalHandler(idx, 'media', object.media)
                "
                @remove-uploaded-image="removeMedia(idx, 'media')"
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
                @upload-container-clicked="
                  openMediaModalHandler(idx, 'mediaMobile', object.mediaMobile)
                "
                @remove-uploaded-image="removeMedia(idx, 'mediaMobile')"
              />
              <span
                v-if="errors.mediaMobile === true && idx === 0"
                class="flex text-error text-sm pt-2 pl-2"
                >{{ $t('forms.requiredField') }}</span
              >
            </div>
          </div>

          <div class="flex flex-col items-start justify-start mt-8">
            <label :class="sectionsStyle.fieldLabel">{{
              $t('forms.title')
            }}</label>
            <LazyEditorWysiwyg
              :html="object.title[selectedLang]"
              :css-classes-prop="object.titleClasses"
              @css-classes-changed="(v) => (object['titleClasses'] = v)"
              @wysiwyg-media="wysiwygMediaAdded"
              @settings-update="
                (content) => updateTitleDescription(content, idx)
              "
            />
          </div>

          <div class="flex flex-col items-start justify-start mt-8">
            <label :class="sectionsStyle.fieldLabel">{{
              $t('forms.text')
            }}</label>
            <LazyEditorWysiwyg
              :html="object.text[selectedLang]"
              :css-classes-prop="object.textClasses"
              @css-classes-changed="(v) => (object['textClasses'] = v)"
              @wysiwyg-media="wysiwygMediaAdded"
              @settings-update="
                (content) => updateTextDescription(content, idx)
              "
            />
          </div>

          <div class="flex flex-col items-start justify-start mt-8">
            <label :class="sectionsStyle.fieldLabel">{{
              $t('forms.cta')
            }}</label>
            <input
              v-model="object.cta[selectedLang]"
              type="text"
              :placeholder="$t('forms.cta')"
              :class="sectionsStyle.input"
            />
          </div>

          <LazyFormLink
            :link-label="$t('forms.ctaLink')"
            :selected-sections-page="object.sectionsPage[selectedLang]"
            :other-link="object.ctaLink[selectedLang]"
            :link-target="object.ctaLinkTarget"
            :sections-pages-label="$t('forms.sectionsPages')"
            :other-link-label="$t('Other')"
            :link-target-label="$t('forms.linkTarget')"
            @sections-page-selected="
              (val) => {
                locales.forEach((locale) => {
                  object.sectionsPage[locale] = val
                })
              }
            "
            @update:other-link="
              (val) => {
                object.ctaLink[selectedLang] = val
              }
            "
            @link-target-selected="
              (val) => {
                object.ctaLinkTarget = val
              }
            "
          />
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
      {
        type: 'image',
        name: 'wysiwygMedias',
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
          containerHeight: '',
          imageFit: '',
          cta: {
            en: '',
            fr: '',
          },
          ctaLink: {
            en: '',
            fr: '',
          },
          ctaLinkTarget: '',
          videoLink: '',
          autoplay: false,
          loop: false,
          controls: false,
          whiteProgress: false,
          aspectRatio: '',
          mobileVideoLink: '',
          mobileAutoplay: false,
          mobileLoop: false,
          mobileControls: false,
          mobileWhiteProgress: false,
          mobileAspectRatio: '',
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
          wysiwygMediasData: [],
          wysiwygMedias: [],
          videoTitle: {
            en: '',
            fr: '',
          },
          videoText: {
            en: '',
            fr: '',
          },
          videoTitleClasses: '',
          videoTextClasses: '',
          videoCta: {
            en: '',
            fr: '',
          },
          sectionsPage: {},
          videoCtaLink: {
            en: '',
            fr: '',
          },
          videoCtaLinkTarget: '',
          carousels: [
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
              cta: {
                en: '',
                fr: '',
              },
              ctaLink: {
                en: '',
                fr: '',
              },
              sectionsPage: {},
              ctaLinkTarget: '',
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
        videoLink: false,
        media: false,
        mediaMobile: false,
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
      media = assignMediaObject(mediaObject)
      this.settings[0].carousels[this.selectedMediaIndex][
        this.selectedMediaKey
      ] = media
      this.settings[0].medias.push(media)
      this.$emit('closeMediaModal')
    },
    settings: {
      handler(v) {
        this.locales.forEach((locale) => {
          if (!this.settings[0].sectionsPage) {
            this.settings[0].sectionsPage = {}
          }
          this.settings[0].sectionsPage[locale] = ''
          this.settings[0].carousels.forEach((carousel) => {
            if (!carousel.sectionsPage) {
              carousel.sectionsPage = {}
            }
            if (!carousel.sectionsPage[locale]) {
              carousel.sectionsPage[locale] = ''
            }
          })
        })
        if (v && v[0] && v[0].carousels === undefined) {
          this.settings[0]['carousels'] = []
          this.settings[0].medias = []
          this.settings.forEach((st) => {
            this.settings[0].carousels.push(JSON.parse(JSON.stringify(st)))
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
    wysiwygMediaAdded(media) {
      if (this.settings[0].wysiwygMediasData === undefined) {
        this.settings[0].wysiwygMediasData = []
      }

      this.settings[0]['wysiwygMediasData'].push({
        wysiwygMedia: media,
        wysiwygLang: this.selectedLang,
      })
      if (this.settings[0].wysiwygMedias === undefined) {
        this.settings[0].wysiwygMedias = []
      }

      this.settings[0]['wysiwygMedias'].push(media)
    },
    updateTitleDescription(content, idx) {
      this.settings[0].carousels[idx].title[this.selectedLang] = content
    },
    updateTextDescription(content, idx) {
      this.settings[0].carousels[idx].text[this.selectedLang] = content
    },
    updateVideoTitleDescription(content, idx) {
      this.settings[idx].videoTitle[this.selectedLang] = content
    },
    updateVideoTextDescription(content, idx) {
      this.settings[idx].videoText[this.selectedLang] = content
    },
    addMedia() {
      this.settings[0].carousels.push({
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
        cta: {
          en: '',
          fr: '',
        },
        ctaLink: {
          en: '',
          fr: '',
        },
        sectionsPage: {},
        ctaLinkTarget: '',
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
          (md) => md.media_id === this.settings[0].carousels[idx][key].media_id,
        )
        this.settings[0].medias = this.settings[0].medias.filter(
          (img, i) => mediaIndex !== i,
        )
      } catch {}
      this.settings[0].carousels[idx][key] = {}
    },
    removeCarouselBlock(idx) {
      if (this.settings[0].carousels.length > 1) {
        this.settings[0].carousels = this.settings[0].carousels.filter(
          (img, i) => idx !== i,
        )
      }
    },
    validate() {
      try {
        if (
          Array.isArray(this.settings) &&
          this.settings[0].wysiwygMediasData &&
          this.settings[0].wysiwygMediasData.length > 0
        ) {
          this.settings[0].wysiwygMediasData.forEach((ob, index) => {
            if (ob.wysiwygLang) {
              if (
                !JSON.stringify([
                  ...this.settings.map((set) => set.title),
                  ...this.settings.map((set) => set.text),
                ]).includes(ob.wysiwygMedia.media_id)
              ) {
                this.settings[0].wysiwygMediasData.splice(index, 1)
                this.settings[0].wysiwygMedias.splice(
                  this.settings[0].wysiwygMedias.findIndex(
                    (wm) => wm.media_id === ob.wysiwygMedia.media_id,
                  ),
                  1,
                )
              }
            }
          })
        }
        if (this.settings[0].wysiwygMedias.length === 0) {
          delete this.settings[0].wysiwygMedias
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
      this.errors.videoLink = false
      if (this.settings[0].videoLink) {
        valid = true
      } else if (
        !this.settings[0].videoLink &&
        (!this.settings[0].carousels[0].media ||
          !this.settings[0].carousels[0].media.url) &&
        (!this.settings[0].carousels[0].mediaMobile ||
          !this.settings[0].carousels[0].mediaMobile.url)
      ) {
        if (
          !this.settings[0].carousels[0].media ||
          !this.settings[0].carousels[0].media.url
        ) {
          this.errors.media = true
        } else if (
          !this.settings[0].carousels[0].mediaMobile ||
          !this.settings[0].carousels[0].mediaMobile.url
        ) {
          this.errors.mediaMobile = true
        }
        this.errors.videoLink = true
        valid = false
      } else if (
        this.settings[0].carousels[0].media &&
        this.settings[0].carousels[0].media.url
      ) {
        if (
          !this.settings[0].carousels[0].mediaMobile ||
          !this.settings[0].carousels[0].mediaMobile.url
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
    reduceOption(option) {
      return option.key
    },
    openMediaModalHandler(idx, key, media) {
      this.selectedMediaIndex = idx
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
