<template>
  <div>
    <div class="flex flex-col items-start justify-start mt-8">
      <div class="flex">
        <label class="mr-4 font-bold">{{ $t('forms.title') }}</label>
      </div>
      <input
        v-model="settings[0][selectedLang].title"
        type="text"
        :placeholder="$t('forms.title')"
        :class="[
          'title py-4 pl-6 border rounded-xl h-[48px] w-[344px] focus:outline-none',
          errors.title && selectedLang === defaultLang
            ? 'border-error'
            : 'border-FieldGray',
        ]"
      />
    </div>

    <div class="flex flex-col items-start justify-start mt-4">
      <div class="flex">
        <label class="mr-4 font-bold">{{ $t('forms.subtitle') }}</label>
      </div>
      <input
        v-model="settings[0][selectedLang].subTitle"
        type="text"
        :placeholder="$t('forms.subtitle')"
        :class="[
          'subtitle py-4 pl-6 border rounded-xl h-[48px] w-[344px] focus:outline-none',
          errors.subTitle && selectedLang === defaultLang
            ? 'border-error'
            : 'border-FieldGray',
        ]"
      />
    </div>

    <div class="flex flex-col items-start justify-start mt-4">
      <div class="flex">
        <label class="mr-4 font-bold">{{ $t('forms.buttonLabel') }}</label>
      </div>
      <input
        v-model="settings[0][selectedLang].buttonLabel"
        type="text"
        :placeholder="$t('forms.buttonLabel')"
        :class="[
          'buttonLabel py-4 pl-6 border rounded-xl h-[48px] w-[344px] focus:outline-none',
          errors.buttonLabel && selectedLang === defaultLang
            ? 'border-error'
            : 'border-FieldGray',
        ]"
      />
    </div>

    <LazyFormLink
      :link-label="$t('forms.link')"
      :selected-sections-page="settings[0].sectionsPage[selectedLang]"
      :other-link="settings[0][selectedLang].link"
      :link-target="settings[0].linkTarget"
      :sections-pages-label="$t('forms.sectionsPages')"
      :other-link-label="$t('Other')"
      :link-target-label="$t('forms.linkTarget')"
      :link-error="errors.link && selectedLang === defaultLang"
      @sections-page-selected="
        (val) => {
          locales.forEach((locale) => {
            settings[0].sectionsPage[locale] = val
          })
        }
      "
      @update:other-link="
        (val) => {
          settings[0][selectedLang].link = val
        }
      "
      @link-target-selected="
        (val) => {
          settings[0].linkTarget = val
        }
      "
    />

    <LazySectionFormErrors
      :selectedLang="selectedLang"
      :default-lang="defaultLang"
      :locales="locales"
      :errors="errors"
    />
  </div>
</template>

<i18n src="./Shared_i18n.json"></i18n>

<script>
export default {
  name: 'SimpleCTA',
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
    locales: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      settings: [
        {
          en: {
            title: '',
            subTitle: '',
            link: '',
            buttonLabel: '',
          },
          fr: {
            title: '',
            subTitle: '',
            link: '',
            buttonLabel: '',
          },
          linkTarget: '',
          sectionsPage: {},
        },
      ],
      errors: {
        title: false,
        subTitle: false,
        buttonLabel: false,
        link: false,
      },
      isInProgress: false,
    }
  },
  watch: {
    settings(val) {
      if (!val[0].sectionsPage) {
        val[0].sectionsPage = {}
      }
      this.locales.forEach((locale) => {
        if (!val[0].sectionsPage[locale]) {
          val[0].sectionsPage[locale] = ''
        }
      })
      if (Array.isArray(val) === false) {
        this.settings = [val]
      }
      this.locales.forEach((lang) => {
        if (!this.settings[0][lang]) {
          this.settings[0][lang] = {
            title: '',
            subTitle: '',
            link: '',
            buttonLabel: '',
          }
        }
      })
      if (!this.settings[0].en && !this.settings[0].fr) {
        Object.assign(this.settings[0], {
          en: {
            title: '',
            subTitle: '',
            link: '',
            buttonLabel: '',
          },
          fr: {
            title: '',
            subTitle: '',
            link: '',
            buttonLabel: '',
          },
        })
      }
      if (val.fr) {
        for (let i = 0; i < Object.keys(val.fr).length; i++) {
          if (val.fr[Object.keys(val.fr)[i]] === '')
            val.fr[Object.keys(val.fr)[i]] = val[Object.keys(val.fr)[i]]
        }
      }
    },
  },
  created() {
    this.locales.forEach((lang) => {
      this.settings[0][lang] = {
        title: '',
        subTitle: '',
        link: '',
        buttonLabel: '',
      }
    })
  },
  methods: {
    validate() {
      let valid = true
      this.errors.buttonLabel = false
      this.errors.link = false
      if (!this.settings[0][this.defaultLang].buttonLabel) {
        this.errors.buttonLabel = true
        valid = false
      }
      if (
        !this.settings[0][this.defaultLang].link &&
        !this.settings[0].sectionsPage[this.defaultLang]
      ) {
        this.errors.link = true
        valid = false
      }
      return valid
    },
  },
}
</script>

<style></style>
