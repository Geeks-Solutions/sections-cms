<template>
  <div class="text-start">
    <div class="flex flex-col items-start justify-start mt-8">
      <label v-if="linkLabel" class="mr-4 font-bold">{{ linkLabel }}</label>
      <label v-if="sectionsPagesLabel" class="mr-4 font-bold">{{ sectionsPagesLabel }}</label>
      <span v-if="errorLoadingPagePaths" class="flex text-start text-xs text-error pb-2">{{ $t("SectionsPagesError") }}</span>
      <gAutoComplete
        :main-filter="selectedSectionsPage"
        :placeholder="sectionsPagesLabel"
        :filter-label-prop="'page'"
        :reduce="(option) => option.path"
        :filter-options="[...sectionsPages, {id: 'other', page: 'Other', path: 'other'}]"
        :filter-searchable="false"
        :close-on-select="true"
        :filter-clearable="true"
        :track-by="'path'"
        @itemSelected="
                  (val) => {
                    $emit('sections-page-selected', val)
                  }
                "
      >
      </gAutoComplete>
    </div>

    <div v-if="selectedSectionsPage === 'other'" class="flex flex-col items-start justify-start mt-8">
      <label v-if="otherLinkLabel" class="mr-4 font-medium">{{ otherLinkLabel }}</label>
      <link-description class="pb-1"/>
      <input
        :value="otherLink"
        type="text"
        :placeholder="$t('forms.link')"
        :class="sectionsStyle.input"
        @input="(evt) => {$emit('update:otherLink', evt.target.value)}"
      />
    </div>

    <span v-show="linkError === true"
          class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>

    <div class="my-4">
      <label v-if="linkTargetLabel" class="flex section-module-upload-media-label">{{ linkTargetLabel }}</label>
      <div class="select-style-chooser w-[344px]">
        <gAutoComplete
          :main-filter="linkTarget"
          :placeholder="linkTargetLabel"
          :filter-label-prop="'value'"
          :reduce="(option) => option.key"
          :filter-options="[{key: '_self', value: $t('forms.selfTarget')}, {key: '_blank', value: $t('forms.blankTarget')}]"
          :filter-searchable="false"
          :close-on-select="true"
          :filter-clearable="true"
          :track-by="'key'"
          @itemSelected="(val) => {$emit('link-target-selected', val)}"
        >
        </gAutoComplete>
      </div>
    </div>
  </div>
</template>

<i18n src="../sections/forms/Shared_i18n.json"></i18n>

<script>
import { sectionHeader, sectionsStyle, useCookie } from '#imports'
import { getSectionsPages } from '@/utils/constants.js'

export default {
  name: 'FormLink',
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
    selectedSectionsPage: {
      type: String,
      default: ''
    },
    otherLink: {
      type: String,
      default: ''
    },
    linkTarget: {
      type: String,
      default: ''
    },
    linkLabel: {
      type: String,
      default: ''
    },
    sectionsPagesLabel: {
      type: String,
      default: ''
    },
    otherLinkLabel: {
      type: String,
      default: ''
    },
    linkTargetLabel: {
      type: String,
      default: ''
    },
    selectedLang: {
      type: String,
      default: 'fr'
    },
    locales: {
      type: Array,
      default() {
        return []
      }
    },
    linkError: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sectionsStyle,
      sectionsPages: [],
      errorLoadingPagePaths: false
    }
  },
  async mounted() {
    this.sectionsPages = await getSectionsPages(sectionHeader({token: useCookie('sections-auth-token').value}))
    if (!this.sectionsPages || this.sectionsPages.length === 0) {
      this.errorLoadingPagePaths = true
    }
  }
}
</script>
