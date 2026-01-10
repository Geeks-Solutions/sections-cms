<template>
  <div class="p-4">
    <div class="mb-4">
      <LazyMediasUploadMedia
        :media-label="$t('forms.logo')"
        :upload-text="$t('forms.uploadMedia')"
        :change-text="$t('forms.changeMedia')"
        :seo-tag="$t('forms.seoTag')"
        :media="
          settings[0].media && Object.keys(settings[0].media).length > 0
            ? [settings[0].media]
            : []
        "
        @uploadContainerClicked="
          $emit(
            'openMediaModal',
            settings[0].media && Object.keys(settings[0].media).length > 0
              ? settings[0].media.media_id
              : null,
          )
        "
        @removeUploadedImage="removeMedia()"
      />
      <span class="flex text-xs text-Gray_800">{{
        $t('forms.logoIconDesc')
      }}</span>
    </div>

    <LazyFormLink
      :link-label="$t('forms.logoLink')"
      :selected-sections-page="settings[0].logoPage[selectedLang]"
      :other-link="settings[0].logoLink[selectedLang]"
      :link-target="settings[0].logoLinkTarget"
      :sections-pages-label="$t('forms.sectionsPages')"
      :other-link-label="$t('Other')"
      :link-target-label="$t('forms.linkTarget')"
      @sections-page-selected="
        (val) => {
          locales.forEach((locale) => {
            settings[0].logoPage[locale] = val
          })
        }
      "
      @update:other-link="
        (val) => {
          settings[0].logoLink[selectedLang] = val
        }
      "
      @link-target-selected="
        (val) => {
          settings[0].logoLinkTarget = val
        }
      "
    />

    <div class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 font-medium">{{ $t('forms.logoCssClasses') }}</label>
      <span class="text-xs text-Gray_800">{{
        $t('forms.logoCssClassesDesc')
      }}</span>
      <input
        v-model="settings[0].logoClasses"
        type="text"
        :placeholder="$t('forms.logoCssClasses')"
        :class="sectionsStyle.input"
      />
    </div>

    <div class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 font-medium">{{ $t('forms.menuLabel') }}</label>
      <input
        v-model="settings[0].menuLabel[selectedLang]"
        type="text"
        :placeholder="$t('forms.menuLabel')"
        :class="sectionsStyle.input"
      />
    </div>

    <div class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 font-medium">{{ $t('forms.cssClasses') }}</label>
      <span class="text-xs text-Gray_800">{{
        $t('forms.cssClassesDesc')
      }}</span>
      <input
        v-model="settings[0].classes"
        type="text"
        :placeholder="$t('forms.cssClasses')"
        :class="sectionsStyle.input"
      />
    </div>
    <span class="flex text-start text-xs text-Gray_800 mt-4">{{
      $t('forms.menuCSSClassDesc')
    }}</span>
    <span class="flex text-start text-xs text-Gray_800 mt-4">{{
      $t('forms.iconDesc')
    }}</span>
    <span class="flex text-start text-xs text-Gray_800 mt-4">{{
      $t('forms.iconCloseDesc')
    }}</span>

    <div id="menu" class="flex flex-col mt-4">
      <LazySectionsFormsFieldSets
        :array-data-pop="settings[0].menus"
        :fieldset-group="'menu-container'"
        :legend-label="$t('forms.menu')"
        @array-updated="(data) => updatedMenuContainerArr(data)"
        @remove-fieldset="(object, idx) => removeMenuContainer(idx)"
      >
        <template #default="{ object: menuContainer, idx: menuIdx }">
          <div class="flex flex-col items-start justify-start mt-8">
            <label class="mr-4 font-medium">{{ $t('forms.menuLabel') }}</label>
            <input
              v-model="menuContainer.menuGroupLabel[selectedLang]"
              type="text"
              :placeholder="$t('forms.menuLabel')"
              :class="sectionsStyle.input"
            />
          </div>
          <LazySectionsFormsFieldSets
            :array-data-pop="menuContainer.menu"
            :fieldset-group="'menu'"
            :legend-label="`${$t('forms.menu')} #${menuIdx + 1} - ${$t('forms.link')}`"
            class="mt-6"
            @array-updated="(data) => updatedArr(data, menuIdx)"
            @remove-fieldset="
              (object, idxItem) => removeMenuItem(menuIdx, idxItem)
            "
          >
            <template #default="{ object, idx }">
              <div class="flex flex-col items-start justify-start mt-8">
                <label class="mr-4 font-medium">{{
                  menuIdx === 0 && idx === 0
                    ? $t('forms.label') + '*'
                    : $t('forms.label')
                }}</label>
                <input
                  v-model="object.label[selectedLang]"
                  type="text"
                  :placeholder="$t('forms.label')"
                  :class="sectionsStyle.input"
                />
                <span
                  v-show="
                    menuIdx === 0 &&
                    idx === 0 &&
                    errors.menu[idx].label === true &&
                    selectedLang === defaultLang
                  "
                  class="text-error text-sm pt-2 pl-2"
                  >{{ $t('forms.requiredField') }}</span
                >
              </div>

              <div class="flex flex-col items-start justify-start mt-8">
                <label class="mr-4 font-medium">{{
                  $t('forms.cssClasses')
                }}</label>
                <span class="flex text-start text-xs text-Gray_800">{{
                  $t('forms.menuCssClassesDesc')
                }}</span>
                <span class="flex text-start text-xs text-Gray_800">{{
                  $t('forms.addedToTopDesc')
                }}</span>
                <input
                  v-model="object.menuItemClasses"
                  type="text"
                  :placeholder="$t('forms.cssClasses')"
                  :class="sectionsStyle.input"
                  @input="
                    menuContainer.menu[idx] = {
                      ...object,
                      menuItemClasses: object.menuItemClasses,
                    }
                  "
                />
              </div>

              <div class="flex flex-col items-start justify-start mt-8">
                <label class="mr-4 pb-2 font-bold">{{
                  $t('forms.languageMenu')
                }}</label>
                <span class="text-xs text-Gray_800 pb-1">{{
                  $t('forms.languageDesc')
                }}</span>
                <input
                  v-model="object.languageMenu"
                  type="checkbox"
                  :placeholder="$t('forms.languageMenu')"
                  class="h-[25px] w-[25px] pl-6 border border-FieldGray rounded-xl focus:outline-none"
                  @change="
                    (event) =>
                      (menuContainer.menu[idx] = {
                        ...object,
                        languageMenu: event.target.checked,
                      })
                  "
                />
              </div>

              <div v-if="menuContainer.menu[idx].languageMenu !== true">
                <LazyFormLink
                  :link-label="
                    menuIdx === 0 && idx === 0
                      ? $t('forms.link') + '*'
                      : $t('forms.link')
                  "
                  :selected-sections-page="
                    menuContainer.menu[idx].page[selectedLang]
                  "
                  :other-link="object.link[selectedLang]"
                  :link-target="menuContainer.menu[idx].linkTarget"
                  :sections-pages-label="$t('forms.sectionsPages')"
                  :other-link-label="$t('Other')"
                  :link-target-label="$t('forms.linkTarget')"
                  :link-error="
                    menuIdx === 0 &&
                    idx === 0 &&
                    errors.menu[idx].link === true &&
                    selectedLang === defaultLang
                  "
                  @sections-page-selected="
                    (val) => {
                      locales.forEach((locale) => {
                        menuContainer.menu[idx].page[locale] = val
                      })
                    }
                  "
                  @update:other-link="
                    (val) => {
                      object.link[selectedLang] = val
                    }
                  "
                  @link-target-selected="
                    (val) => {
                      menuContainer.menu[idx].linkTarget = val
                    }
                  "
                />
              </div>
            </template>
          </LazySectionsFormsFieldSets>

          <div class="flex flex-col items-start justify-start mt-8">
            <label class="mr-4 font-medium">{{
              $t('forms.menuContainerCssClasses')
            }}</label>
            <span class="text-xs text-Gray_800">{{
              $t('forms.menuContainerCssClassesDesc')
            }}</span>
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
            <div class="p3 bold text">
              {{ $t('forms.addMenuItem') }} {{ $t('forms.menu') }}
              {{ menuIdx + 1 }}
            </div>
          </div>
        </template>
      </LazySectionsFormsFieldSets>

      <div
        class="add-button underline cursor-pointer mt-2"
        @click="addMenuContainer()"
      >
        <div class="p3 bold text">{{ $t('forms.addMenuContainer') }}</div>
      </div>
    </div>

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
import {
  sectionsStyle,
  scrollToFirstError,
  assignMediaObject,
} from '@/utils/constants'
import 'vue-select/dist/vue-select.css'

export default {
  name: 'SimpleMenu',
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
      default: 'fr',
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
        name: 'media',
      },
    ],
  },
  data() {
    return {
      settings: [
        {
          media: {
            media_id: '',
            url: '',
            seo_tag: '',
          },
          logoLink: {},
          logoPage: {},
          logoLinkTarget: '',
          logoClasses: '',
          menuLabel: {},
          classes: '',
          menus: [
            {
              menuGroupLabel: {},
              menuContainerClasses: '',
              menu: [
                {
                  label: {},
                  link: {},
                  page: {},
                  linkTarget: '',
                  menuItemClasses: '',
                  languageMenu: false,
                },
              ],
            },
          ],
        },
      ],
      errors: {
        menu: [
          {
            label: false,
            link: false,
          },
        ],
      },
      siteLang: 'en',
      sectionsStyle,
      errorLoadingPagePaths: false,
    }
  },
  watch: {
    selectedLang: {
      handler(val) {
        this.siteLang = val
      },
      deep: true,
      immediate: true,
    },
    settings: {
      handler(v) {
        if (!v[0].logoLink) {
          v[0].logoLink = {}
        }
        if (!v[0].logoPage) {
          v[0].logoPage = {}
        }
        this.locales.forEach((locale) => {
          if (!v[0].menuLabel) {
            v[0].menuLabel = {}
          }
          if (!v[0].menuLabel[locale]) {
            v[0].menuLabel[locale] = ''
          }
          if (!v[0].logoLink[locale]) {
            v[0].logoLink[locale] = ''
          }
          if (!v[0].logoPage[locale]) {
            v[0].logoPage[locale] = ''
          }
          v[0].menus.forEach((menuGroup) => {
            if (!menuGroup.menuGroupLabel) {
              menuGroup.menuGroupLabel = {}
            }
            if (!menuGroup.menuGroupLabel[locale]) {
              menuGroup.menuGroupLabel[locale] = ''
            }
            menuGroup.menu.forEach((menuItem) => {
              if (!menuItem.label) {
                menuItem.label = {}
              }
              if (!menuItem.link) {
                menuItem.link = {}
              }
              if (!menuItem.page) {
                menuItem.page = {}
              }
              if (!menuItem.label[locale]) {
                menuItem.label[locale] = ''
              }
              if (!menuItem.link[locale]) {
                menuItem.link[locale] = ''
              }
              if (!menuItem.page[locale]) {
                menuItem.page[locale] = ''
              }
            })
          })
        })
        if (!v[0].menus) {
          v[0]['menus'] = []
          v[0].menus = [
            {
              menuContainerClasses: '',
              menu: v[0].menu,
            },
          ]
        }
      },
      deep: true,
      immediate: true,
    },
    selectedMedia(mediaObject) {
      let media = {}
      media = assignMediaObject(mediaObject)
      this.settings[0]['media'] = media
      this.$emit('closeMediaModal')
    },
  },
  methods: {
    addMenuContainer() {
      const menuContainer = {
        menuGroupLabel: {},
        menuContainerClasses: '',
        menu: [
          {
            label: {},
            link: {},
            page: {},
            linkTarget: '',
            menuItemClasses: '',
            languageMenu: false,
          },
        ],
      }
      this.locales.forEach((locale) => {
        menuContainer.menuGroupLabel[locale] = ''
        menuContainer.menu[0].label[locale] = ''
        menuContainer.menu[0].link[locale] = ''
        menuContainer.menu[0].page[locale] = ''
      })
      this.settings[0].menus.push(menuContainer)
    },
    addMenuItem(menusIdx) {
      const menuItem = {
        label: {},
        link: {},
        page: {},
        linkTarget: '',
        menuItemClasses: '',
        languageMenu: false,
      }
      this.locales.forEach((locale) => {
        menuItem.label[locale] = ''
        menuItem.link[locale] = ''
        menuItem.page[locale] = ''
      })
      this.settings[0].menus[menusIdx].menu.push(menuItem)
    },
    updatedMenuContainerArr(data) {
      this.settings[0]['menus'] = data
    },
    updatedArr(data, menusIdx) {
      this.settings[0]['menus'][menusIdx]['menu'] = data
    },
    removeMenuContainer(menusIdx) {
      this.settings[0].menus = this.settings[0].menus.filter(
        (ct, i) => menusIdx !== i,
      )
    },
    removeMenuItem(menusIdx, idx) {
      this.settings[0].menus[menusIdx].menu = this.settings[0].menus[
        menusIdx
      ].menu.filter((ct, i) => idx !== i)
    },
    removeMedia() {
      this.settings[0].media = {}
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
      let valid = true
      this.errors.menu[0].link = false
      this.errors.menu[0].label = false
      if (
        this.settings[0].menus[0].menu[0].languageMenu !== true &&
        !this.settings[0].menus[0].menu[0].link[this.defaultLang] &&
        !this.settings[0].menus[0].menu[0].page[this.defaultLang]
      ) {
        this.errors.menu[0].link = true
        valid = false
      }
      if (!this.settings[0].menus[0].menu[0].label[this.defaultLang]) {
        this.errors.menu[0].label = true
        valid = false
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
.vs__actions svg {
  height: auto;
  width: auto;
}
</style>
