<template>
  <div class="p-4">

    <div class="mb-4">
      <LazyMediasUploadMedia :media-label="$t('forms.logo')" :upload-text="$t('forms.uploadMedia')" :change-text="$t('forms.changeMedia')" :seo-tag="$t('forms.seoTag')" :media="settings[0].media && Object.keys(settings[0].media).length > 0 ? [settings[0].media] : []" @uploadContainerClicked="$emit('openMediaModal', settings[0].media && Object.keys(settings[0].media).length > 0 ? settings[0].media.media_id : null)" @removeUploadedImage="removeMedia()" />
      <span class="flex text-xs text-Gray_800">{{ $t("forms.logoIconDesc") }}</span>
    </div>

    <div class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 font-medium">{{ $t("forms.logoLink") }}</label>
      <label class="mr-4 font-bold">{{ $t('forms.sectionsPages') }}</label>
      <span v-if="errorLoadingPagePaths" class="flex text-start text-xs text-error pb-2">{{ $t("SectionsPagesError") }}</span>
      <gAutoComplete
        :main-filter="settings[0].logoPage[selectedLang]"
        :placeholder="$t('forms.aspectRatio')"
        :filter-label-prop="'page'"
        :reduce="(option) => option.path"
        :filter-options="[...sectionsPages, {id: 'other', page: 'Other', path: 'other'}]"
        :filter-searchable="false"
        :close-on-select="true"
        :filter-clearable="true"
        :track-by="'path'"
        @itemSelected="
                  (val) => {
                    locales.forEach(locale => { settings[0].logoPage[locale] = val })
                  }
                "
      >
      </gAutoComplete>
    </div>

    <div v-if="settings[0].logoPage[selectedLang] === 'other'" class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 font-medium">{{ $t("Other") }}</label>
      <link-description class="pb-1"/>
      <input
        v-model="settings[0].logoLink[selectedLang]"
        type="text"
        :placeholder="$t('forms.link')"
        :class="sectionsStyle.input"
      />
    </div>

    <div class="my-4">
      <label class="flex section-module-upload-media-label">{{ $t('forms.linkTarget') }}</label>
      <div class="select-style-chooser w-[344px]">
        <gAutoComplete
          :main-filter="settings[0].logoLinkTarget"
          :placeholder="$t('forms.linkTarget')"
          :filter-label-prop="'value'"
          :reduce="(option) => option.key"
          :filter-options="[{key: '_self', value: $t('forms.selfTarget')}, {key: '_blank', value: $t('forms.blankTarget')}]"
          :filter-searchable="false"
          :close-on-select="true"
          :filter-clearable="true"
          :track-by="'key'"
          @itemSelected="(val) => {settings[0].logoLinkTarget = val;}"
        >
        </gAutoComplete>
      </div>
    </div>

    <div class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 font-medium">{{ $t("forms.logoCssClasses") }}</label>
      <span class="text-xs text-Gray_800">{{ $t("forms.logoCssClassesDesc") }}</span>
      <input
        v-model="settings[0].logoClasses"
        type="text"
        :placeholder="$t('forms.logoCssClasses')"
        :class="sectionsStyle.input"
      />
    </div>

    <div class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 font-medium">{{ $t("forms.menuLabel") }}</label>
      <input
        v-model="settings[0].menuLabel[selectedLang]"
        type="text"
        :placeholder="$t('forms.menuLabel')"
        :class="sectionsStyle.input"
      />
    </div>

    <div class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 font-medium">{{ $t("forms.cssClasses") }}</label>
      <span class="text-xs text-Gray_800">{{ $t("forms.cssClassesDesc") }}</span>
      <input
        v-model="settings[0].classes"
        type="text"
        :placeholder="$t('forms.cssClasses')"
        :class="sectionsStyle.input"
      />
    </div>
    <span class="flex text-start text-xs text-Gray_800 mt-4">{{ $t("forms.iconDesc") }}</span>
    <span class="flex text-start text-xs text-Gray_800 mt-4">{{ $t("forms.iconCloseDesc") }}</span>

    <div id="menu" class="flex flex-col mt-4">

      <LazySectionsFormsFieldSets :array-data-pop="settings[0].menus" :fieldset-group="'menu-container'" :legend-label="$t('forms.menu')" @array-updated="(data) => updatedMenuContainerArr(data)" @remove-fieldset="(object, idx) => removeMenuContainer(idx)">
        <template #default="{ object: menuContainer, idx: menuIdx }">
          <LazySectionsFormsFieldSets :array-data-pop="menuContainer.menu" :fieldset-group="'menu'" :legend-label="`${$t('forms.menu')} #${menuIdx + 1} - ${$t('forms.link')}`" class="mt-6" @array-updated="(data) => updatedArr(data, menuIdx)" @remove-fieldset="(object, idxItem) => removeMenuItem(menuIdx, idxItem)">
            <template #default="{ object, idx }">
              <div class="flex flex-col items-start justify-start mt-8">
                <label class="mr-4 font-medium">{{ menuIdx === 0 && idx === 0 ? $t("forms.label") + '*' : $t("forms.label") }}</label>
                <input
                  v-model="object.label[selectedLang]"
                  type="text"
                  :placeholder="$t('forms.label')"
                  :class="sectionsStyle.input"
                />
                <span v-show="menuIdx === 0 && idx === 0 && errors.menu[idx].label === true && selectedLang === defaultLang"
                      class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
              </div>

              <div class="flex flex-col items-start justify-start mt-8">
                <label class="mr-4 font-medium">{{ $t("forms.cssClasses") }}</label>
                <span class="flex text-start text-xs text-Gray_800">{{ $t("forms.menuCssClassesDesc") }}</span>
                <span class="flex text-start text-xs text-Gray_800">{{ $t("forms.addedToTopDesc") }}</span>
                <input
                  v-model="object.menuItemClasses"
                  type="text"
                  :placeholder="$t('forms.cssClasses')"
                  :class="sectionsStyle.input"
                  @input="menuContainer.menu[idx] = {...object, menuItemClasses: object.menuItemClasses}"
                />
              </div>

              <div class="flex flex-col items-start justify-start mt-8">
                <label class="mr-4 pb-2 font-bold">{{ $t("forms.languageMenu") }}</label>
                <span class="text-xs text-Gray_800 pb-1">{{ $t("forms.languageDesc") }}</span>
                <input
                  v-model="object.languageMenu"
                  type="checkbox"
                  :placeholder="$t('forms.languageMenu')"
                  class="
            h-[25px]
            w-[25px]
            pl-6
            border border-FieldGray
            rounded-xl
            focus:outline-none
          "
                  @change="(event) => menuContainer.menu[idx] = {...object, languageMenu: event.target.checked}"
                />
              </div>

              <div v-if="menuContainer.menu[idx].languageMenu !== true">
                <div class="flex flex-col items-start justify-start mt-8">
                  <label class="mr-4 font-medium">{{ menuIdx === 0 && idx === 0 ? $t("forms.link") + '*' : $t("forms.link") }}</label>
                  <label class="mr-4 font-bold">{{ $t('forms.sectionsPages') }}</label>
                  <span v-if="errorLoadingPagePaths" class="flex text-start text-xs text-error pb-2">{{ $t("SectionsPagesError") }}</span>
                  <gAutoComplete
                    :main-filter="menuContainer.menu[idx].page[selectedLang]"
                    :placeholder="$t('forms.sectionsPages')"
                    :filter-label-prop="'page'"
                    :reduce="(option) => option.path"
                    :filter-options="[...sectionsPages, {id: 'other', page: 'Other', path: 'other'}]"
                    :filter-searchable="false"
                    :close-on-select="true"
                    :filter-clearable="true"
                    :track-by="'path'"
                    @itemSelected="
                  (val) => {
                    locales.forEach(locale => { menuContainer.menu[idx].page[locale] = val })
                  }
                "
                  >
                  </gAutoComplete>
                </div>

                <div v-if="object.page[selectedLang] === 'other'" class="flex flex-col items-start justify-start mt-8">
                  <label class="mr-4 font-medium">{{ $t("Other") }}</label>
                  <link-description class="pb-1"/>
                  <input
                    v-model="object.link[selectedLang]"
                    type="text"
                    :placeholder="$t('forms.link')"
                    :class="sectionsStyle.input"
                  />
                </div>
                <span v-show="menuIdx === 0 && idx === 0 && errors.menu[idx].link === true && selectedLang === defaultLang"
                      class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
              </div>

              <div v-if="menuContainer.menu[idx].languageMenu !== true">
                <div class="my-4">
                  <label class="flex section-module-upload-media-label">{{ $t('forms.linkTarget') }}</label>
                  <div class="select-style-chooser w-[344px]">
                    <gAutoComplete
                      :main-filter="menuContainer.menu[idx].linkTarget"
                      :placeholder="$t('forms.linkTarget')"
                      :filter-label-prop="'value'"
                      :reduce="(option) => option.key"
                      :filter-options="[{key: '_self', value: $t('forms.selfTarget')}, {key: '_blank', value: $t('forms.blankTarget')}]"
                      :filter-searchable="false"
                      :close-on-select="true"
                      :filter-clearable="true"
                      :track-by="'key'"
                      @itemSelected="(val) => {menuContainer.menu[idx].linkTarget = val;}"
                    >
                    </gAutoComplete>
                  </div>
                </div>
              </div>
            </template>
          </LazySectionsFormsFieldSets>

          <div class="flex flex-col items-start justify-start mt-8">
            <label class="mr-4 font-medium">{{ $t("forms.menuContainerCssClasses") }}</label>
            <span class="text-xs text-Gray_800">{{ $t("forms.menuContainerCssClassesDesc") }}</span>
            <input
              v-model="menuContainer.menuContainerClasses"
              type="text"
              :placeholder="$t('forms.menuContainerCssClasses')"
              :class="sectionsStyle.input"
            />
          </div>

          <div
            class="add-button underline cursor-pointer mt-2"
            @click="addMenuItem(menuIdx)"
          >
            <div class="p3 bold text">{{ $t("forms.addMenuItem") }} {{ $t("forms.menu") }} {{ menuIdx + 1 }}</div>
          </div>
        </template>
      </LazySectionsFormsFieldSets>

      <div
        class="add-button underline cursor-pointer mt-2"
        @click="addMenuContainer()"
      >
        <div class="p3 bold text">{{ $t("forms.addMenuContainer") }}</div>
      </div>
    </div>

    <LazySectionFormErrors :selectedLang="selectedLang" :default-lang="defaultLang" :locales="locales" :errors="errors" />

  </div>
</template>

<i18n src="./Shared_i18n.json"></i18n>

<script>
import {sectionHeader, useCookie} from "#imports";
import {getSectionsPages, sectionsStyle, scrollToFirstError} from "@/utils/constants";
import 'vue-select/dist/vue-select.css';

export default {
  name: 'SimpleMenu',
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
      default: 'fr'
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
        name: 'media'
      }
    ]
  },
  data() {
    return {
      settings: [
        {
          media: {
            media_id: "",
            url: "",
            seo_tag: ""
          },
          logoLink: {},
          logoPage: {},
          logoLinkTarget: '',
          logoClasses: '',
          menuLabel: {},
          classes: '',
          menus: [
            {
              menuContainerClasses: '',
              menu: [
                {
                  label: {},
                  link: {},
                  page: {},
                  linkTarget: '',
                  menuItemClasses: '',
                  languageMenu: false
                }
              ]
            }
          ]
        }
      ],
      errors: {
        menu: [
          {
            label: false,
            link: false
          }
        ]
      },
      siteLang: 'en',
      sectionsStyle,
      sectionsPages: [],
      errorLoadingPagePaths: false
    }
  },
  watch: {
    selectedLang: {
      handler(val) {
        this.siteLang = val
      },
      deep: true,
      immediate: true
    },
    settings(v) {
      if (!v[0].logoLink) {
        v[0].logoLink = {}
      }
      if (!v[0].logoPage) {
        v[0].logoPage = {}
      }
      this.locales.forEach(locale => {
        if (!v[0].menuLabel) {
          v[0].menuLabel = {}
        }
        if (!v[0].logoLink[locale]) {
          v[0].logoLink[locale] = ''
        }
        if (!v[0].logoPage[locale]) {
          v[0].logoLink[locale] = ''
        }
      })
      if (!v[0].menus) {
        v[0]['menus'] = []
        v[0].menus = [
          {
            menuContainerClasses: '',
            menu: v[0].menu
          }
        ]
      }
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
      this.settings[0]['media'] = media
      this.$emit('closeMediaModal')
    }
  },
  async mounted() {
    this.sectionsPages = await getSectionsPages(sectionHeader({token: useCookie('sections-auth-token').value}))
    if (!this.sectionsPages || this.sectionsPages.length === 0) {
      this.errorLoadingPagePaths = true
    }
  },
  methods: {
    addMenuContainer() {
      const menuContainer = {
        menuContainerClasses: '',
        menu: [
          {
            label: {},
            link: {},
            page: {},
            linkTarget: '',
            menuItemClasses: '',
            languageMenu: false
          }
        ]
      }
      this.locales.forEach(locale => {
        menuContainer.menu[0].label[locale] = ''
        menuContainer.menu[0].link[locale] = ''
        menuContainer.menu[0].page[locale] = ''
      })
      this.settings[0].menus.push(menuContainer);
    },
    addMenuItem(menusIdx) {
      const menuItem = {
        label: {},
        link: {},
        page: {},
        linkTarget: '',
        menuItemClasses: '',
        languageMenu: false
      }
      this.locales.forEach(locale => {
        menuItem.label[locale] = ''
        menuItem.link[locale] = ''
        menuItem.page[locale] = ''
      })
      this.settings[0].menus[menusIdx].menu.push(menuItem);
    },
    updatedMenuContainerArr(data) {
      this.settings[0]['menus'] = data
    },
    updatedArr(data, menusIdx) {
      this.settings[0]['menus'][menusIdx]['menu'] = data
    },
    removeMenuContainer(menusIdx) {
      this.settings[0].menus = this.settings[0].menus.filter((ct, i) => menusIdx !== i)
    },
    removeMenuItem(menusIdx, idx) {
      this.settings[0].menus[menusIdx].menu = this.settings[0].menus[menusIdx].menu.filter((ct, i) => idx !== i)
    },
    removeMedia() {
      this.settings[0].media = {}
    },
    validate() {
      for(let i = 0; i < this.settings.length; i++) {
        if (this.settings[i].media && (Object.keys(this.settings[i].media).length === 0 || !this.settings[i].media.media_id || !this.settings[i].media.url)) {
          delete this.settings[i].media
        }
      }
      let valid = true;
      this.errors.menu[0].link = false;
      this.errors.menu[0].label = false;
      if (this.settings[0].menus[0].menu[0].languageMenu !== true && !this.settings[0].menus[0].menu[0].link[this.defaultLang] && !this.settings[0].menus[0].menu[0].page[this.defaultLang]) {
        this.errors.menu[0].link = true;
        valid = false;
      }
      if (!this.settings[0].menus[0].menu[0].label[this.defaultLang]) {
        this.errors.menu[0].label = true;
        valid = false;
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
.vs__actions svg {
  height: auto;
  width: auto;
}
</style>
