<template>
  <div ref="plansForm">

    <div id="title" class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 font-bold">{{ $t("plans.title") }}</label>
      <LazyEditorWysiwyg :html="settings[0].title[siteLang]" :css-classes-prop="settings[0].titleClasses" @cssClassesChanged="(v) => settings[0]['titleClasses'] = v" @wysiwygMedia="wysiwygMediaAdded" @settingsUpdate="updateTitle"/>
    </div>

    <div id="subTitle" class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 font-bold">{{ $t("plans.subtitle") }}</label>
      <LazyEditorWysiwyg :html="settings[0].subTitle[siteLang]" :css-classes-prop="settings[0].subTitleClasses" @cssClassesChanged="(v) => settings[0]['subTitleClasses'] = v" @wysiwygMedia="wysiwygMediaAdded" @settingsUpdate="updateSubTitle"/>
    </div>


    <LazySectionsFormsFieldSets :array-data-pop="settings[0].plans" :fieldset-group="'plans'" :legend-label="$t('plans.plan')" @array-updated="(data) => settings[0]['plans'] = data" @remove-fieldset="(object, idx) => (idx) => {}">
      <template #default="{ plan, idx }">
        <div :id="`media-${idx}`" class="mt-8">
          <LazyMediasUploadMedia :media-label="$t('plans.media')" :upload-text="$t('plans.uploadMedia')" :change-text="$t('plans.changeMedia')" :seo-tag="$t('plans.seoTag')" :media="settings[0].plans[idx].media && Object.keys(settings[0].plans[idx].media).length > 0 ? [settings[0].plans[idx].media] : []" @uploadContainerClicked="uploadMedia(idx)" @removeUploadedImage="mediaFieldIndex = idx; removeMedia(idx)" />
        </div>

        <div class="flex flex-row gap-4">
          <div :id="`title-${idx}`" class="flex flex-col items-start justify-start mt-8">
            <label class="mr-4 font-bold">{{ $t("plans.title") }}</label>
            <input
              v-model="settings[0].plans[idx].title[siteLang]"
              type="text"
              :placeholder="$t('plans.title')"
              class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-[48px]
            w-[220px]
            focus:outline-none
          "
            />
            <span v-show="errors[`title-${idx}`] === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
          </div>

          <div class="flex flex-col items-start justify-start mt-8">
            <label class="mr-4 pb-2 font-bold">{{ $t("plans.mostPopular") }}</label>
            <input
              v-model="settings[0].plans[idx].mostPopular"
              type="checkbox"
              :placeholder="$t('plans.mostPopular')"
              class="
            h-[25px]
            w-[25px]
            pl-6
            border border-FieldGray
            rounded-xl
            focus:outline-none
          "
            />
          </div>
        </div>

        <div class="flex flex-col items-start justify-start mt-8">
          <label class="mr-4 font-bold">{{ $t("plans.description") }}</label>
          <LazyEditorWysiwyg :html="settings[0].plans[idx].description[siteLang]" :css-classes-prop="settings[0].plans[idx].classes" @cssClassesChanged="(v) => plan['classes'] = v" @wysiwygMedia="wysiwygMediaAdded" @settingsUpdate="(content) => updateDescription(content, idx)"/>
        </div>

        <div class="flex flex-row gap-4">
          <div :id="`currency-${idx}`" class="flex flex-col items-start justify-start mt-8">
            <label class="mr-4 font-bold">{{ $t("plans.currency") }}</label>
            <input
              v-model="settings[0].plans[idx].currency[siteLang]"
              type="text"
              :placeholder="$t('plans.currency')"
              class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-[48px]
            w-[220px]
            focus:outline-none
          "
            />
          </div>

          <div class="flex flex-col items-start justify-start mt-8">
            <label class="mr-4 font-bold">{{ $t("plans.price") }}</label>
            <input
              v-model="settings[0].plans[idx].price[siteLang]"
              type="text"
              :placeholder="$t('plans.price')"
              class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-[48px]
            w-[220px]
            focus:outline-none
          "
            />
          </div>
        </div>

        <div :id="`frequency-${idx}`" class="flex flex-col items-start justify-start mt-8">
          <label class="mr-4 font-bold">{{ $t("plans.frequency") }}</label>
          <input
            v-model="settings[0].plans[idx].frequency[siteLang]"
            type="text"
            :placeholder="$t('plans.frequency')"
            class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-[48px]
            w-[344px]
            focus:outline-none
          "
          />
        </div>

        <div class="flex flex-col items-start justify-start mt-8">
          <label class="mr-4 font-bold">{{ $t("plans.customFeatures") }}</label>
          <input
            v-model="settings[0].plans[idx].customFeatures[siteLang]"
            type="text"
            :placeholder="$t('plans.customFeatures')"
            class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-[48px]
            w-[344px]
            focus:outline-none
          "
          />
        </div>

        <div class="flex flex-col items-start justify-start mt-8">
          <label class="mr-4 font-bold">{{ $t("plans.features") }}</label>
          <textarea
            v-model="settings[0].plans[idx].features[siteLang]"
            :placeholder="$t('plans.features')"
            class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-[200px]
            w-[344px]
            focus:outline-none
          "
          />
        </div>

        <div class="flex flex-col items-start justify-start mt-8">
          <label class="mr-4 font-bold">{{ $t("plans.ctaLabel") }}</label>
          <span class="text-sm">{{ $t("plans.ctaLabelDesc") }}</span>
          <input
            v-model="settings[0].plans[idx].ctaLabel[siteLang]"
            type="text"
            :placeholder="$t('plans.ctaLabel')"
            class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-[48px]
            w-[344px]
            focus:outline-none
          "
          />
        </div>

        <div class="flex flex-col items-start justify-start mt-8">
          <label class="mr-4 font-bold">{{ $t("plans.ctaLink") }}</label>
          <input
            v-model="settings[0].plans[idx].ctaLink[siteLang]"
            type="text"
            :placeholder="$t('plans.ctaLink')"
            class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-[48px]
            w-[344px]
            focus:outline-none
          "
          />
          <link-description />
        </div>

        <div class="my-4">
          <label class="flex section-module-upload-media-label">{{ $t('forms.linkTarget') }}</label>
          <div class="select-style-chooser w-[344px]">
            <gAutoComplete
              :main-filter="settings[0].plans[idx].ctaLinkTarget"
              :placeholder="$t('forms.linkTarget')"
              :filter-label-prop="'value'"
              :reduce="(option) => option.key"
              :filter-options="[{key: '_self', value: $t('forms.selfTarget')}, {key: '_blank', value: $t('forms.blankTarget')}]"
              :filter-searchable="false"
              :close-on-select="true"
              :filter-clearable="true"
              :track-by="'key'"
              @itemSelected="(val) => {settings[0].plans[idx].ctaLinkTarget = val;}"
            >
            </gAutoComplete>
          </div>
        </div>
      </template>
    </LazySectionsFormsFieldSets>

    <div class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 font-bold">{{ $t("plans.globalCtaLabel") }}</label>
      <input
        v-model="settings[0].globalCtaLabel[siteLang]"
        type="text"
        :placeholder="$t('plans.globalCtaLabel')"
        class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-[48px]
            w-[344px]
            focus:outline-none
          "
      />
    </div>

  </div>
</template>

<i18n src="./Plans_i18n.json"></i18n>

<script>
import {scrollToFirstError} from "@/utils/constants";

export default {
  name: 'Plans',
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
        name: 'medias'
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
          medias: [],
          plans: [],
          title: {
            en: '',
            fr: ''
          },
          subTitle: {
            en: '',
            fr: ''
          },
          titleClasses: '',
          subTitleClasses: '',
          globalCtaLabel: {
            en: '',
            fr: ''
          }
        }
      ],
      errors: {

      },
      siteLang: 'en',
      mediaFieldIndex: ''
    }
  },
  watch: {
    selectedLang: {
      handler(val) {
        this.siteLang = val
        setTimeout(() => {
          if (this.$refs.plansForm) {
            const targetElement = this.$refs.plansForm.querySelector('#title');
            if (targetElement) {
              targetElement.scrollIntoView()
            }
          }
        }, 300);
      },
      deep: true,
      immediate: true
    },
    selectedMedia(mediaObject) {
      const media = {
        media_id: "",
        url: "",
        seo_tag: "",
        files: [
          {
            filename: "",
            url: ""
          }
        ],
        headers: {}
      };
      media.files[0].url = mediaObject.files[0].url;
      media.files[0].filename = mediaObject.files[0].filename;
      media.media_id = mediaObject.id;
      media.url = mediaObject.files[0].url;
      media.seo_tag = mediaObject.seo_tag;
      if (mediaObject.files[0].headers) {
        media.headers = mediaObject.files[0].headers
      }
      if (this.settings[0].plans[this.mediaFieldIndex].media.media_id) {
        const mediaIndex = this.settings[0].medias.findIndex(media => media.media_id === this.settings[0].plans[this.mediaFieldIndex].media.media_id)
        if (mediaIndex !== -1) {
          this.settings[0].medias[mediaIndex] = media
        } else {
          this.settings[0].medias.push(media)
        }
      } else {
        this.settings[0].medias.push(media)
      }
      this.settings[0].plans[this.mediaFieldIndex]['media'] = media
      this.$emit('closeMediaModal')
    }
  },
  created() {
    if (this.settings[0].plans && this.settings[0].plans.length === 0) {
      const plansCount = 4
      for (let i = 0; i < plansCount; i++) {
        this.settings[0].plans.push({
          title: {
            en: '',
            fr: ''
          },
          description: {
            en: '',
            fr: ''
          },
          classes: '',
          price: {
            en: '',
            fr: ''
          },
          currency: {
            en: '',
            fr: ''
          },
          frequency: {
            en: '',
            fr: ''
          },
          ctaLabel: {
            en: '',
            fr: ''
          },
          ctaLink: {
            en: '',
            fr: ''
          },
          ctaLinkTarget: '',
          features: {
            en: '',
            fr: ''
          },
          customFeatures: {
            en: '',
            fr: ''
          },
          mostPopular: false,
          media: {
            media_id: "",
            url: "",
            seo_tag: "",
            files: [
              {
                filename: "",
                url: ""
              }
            ]
          }
        })
      }
    }
  },
  methods: {
    updateTitle(content) {
      this.settings[0].title[this.siteLang] = content
    },
    updateSubTitle(content) {
      this.settings[0].subTitle[this.siteLang] = content
    },
    updateDescription(content, idx) {
      this.settings[0].plans[idx].description[this.siteLang] = content
    },
    wysiwygMediaAdded(media) {
      this.settings.push({
        wysiwygMedia: media,
        wysiwygLang: this.selectedLang
      })
    },
    uploadMedia(idx) {
      this.mediaFieldIndex = idx;
      this.$emit('openMediaModal', Object.keys(this.settings[0].plans[idx].media).length > 0 ? this.settings[0].plans[idx].media.media_id : null)
    },
    removeMedia(idx) {
      const removeAtIndex = this.settings[0].medias.findIndex(media => media.media_id === this.settings[0].plans[idx].media.media_id)
      this.settings[0].medias.splice(removeAtIndex, 1)
      this.settings[0].plans[idx].media = {}
    },
    validate() {
      if (Array.isArray(this.settings)) {
        this.settings.forEach((ob, index) => {
          if (ob.wysiwygLang && this.settings[0] !== undefined) {
            if (!JSON.stringify(this.settings[0]).includes(ob.wysiwygMedia.url)) {
              this.settings.splice(index, 1)
            }
          }
        })
      }
      this.errors = {}
      const valid = true;
      if (!valid) {
        setTimeout(() => document.getElementById('required-fields').scrollIntoView(), 1000)
        scrollToFirstError(this.errors)
      }
      return valid;
    },
  },
}
</script>

<style>
.shadow {
  box-shadow: 4px 2px 10px rgba(0, 0, 0, 0.1);
}
.fieldsets .array-list-fieldsets .controls span:has(.trash-icon) {
  display: none;
}
</style>
