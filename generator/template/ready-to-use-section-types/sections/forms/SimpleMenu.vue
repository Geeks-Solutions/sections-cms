<template>
  <div class="p-4">

    <div class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 font-medium">{{ $t("forms.menuLabel") }}</label>
      <input
        v-model="settings[0].menuLabel[selectedLang]"
        type="text"
        value=""
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
        value=""
        :placeholder="$t('forms.cssClasses')"
        :class="sectionsStyle.input"
      />
    </div>

    <div id="menu" class="flex flex-col mt-4">
      <div v-for="(object, idx) in settings[0].menu" :key="`menu-${idx}`" class="flex flex-col">

        <fieldset class="fieldSetStyle border border-solid border-gray-300 p-3 mt-2">
          <legend class="w-auto px-16">{{ $t("forms.link") }} #{{ idx + 1 }}:
            <span v-if="idx !== 0"
                  class="cursor-pointer text-xl pl-4 text-Blue"
                  @click="removeMenuItem(idx)">x</span>
          </legend>

          <div class="flex flex-col items-start justify-start mt-8">
            <label class="mr-4 font-medium">{{ idx === 0 ? $t("forms.label") + '*' : $t("forms.label") }}</label>
            <input
              v-model="object.label[selectedLang]"
              type="text"
              value=""
              :placeholder="$t('forms.label')"
              :class="sectionsStyle.input"
            />
            <span v-show="idx === 0 && errors.menu[idx].label === true && siteLang === 'en'"
                  class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
          </div>

          <div class="flex flex-col items-start justify-start mt-8">
            <label class="mr-4 font-medium">{{ $t("forms.cssClasses") }}</label>
            <span class="text-xs text-Gray_800">{{ $t("forms.menuCssClassesDesc") }}</span>
            <span v-if="idx === 0" class="text-xs text-Gray_800">{{ $t("forms.logoIconDesc") }}</span>
            <input
              v-model="object.menuItemClasses"
              type="text"
              value=""
              :placeholder="$t('forms.cssClasses')"
              :class="sectionsStyle.input"
            />
          </div>

          <div class="flex flex-col items-start justify-start mt-8">
            <label class="mr-4 pb-2 font-bold">{{ $t("Language menu") }}</label>
            <span class="text-xs text-Gray_800 pb-1">{{ $t("forms.languageDesc") }}</span>
            <input
              v-model="object.languageMenu"
              type="checkbox"
              value=""
              :placeholder="$t('Language menu')"
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

          <div v-if="object.languageMenu !== true">
            <div class="flex flex-col items-start justify-start mt-8">
              <label class="mr-4 font-medium">{{ idx === 0 ? $t("forms.link") + '*' : $t("forms.link") }}</label>
              <label class="mr-4 font-bold">{{ 'Sections pages' }}</label>
              <div>
                <div class="selectMultipleOptions">
                  <div v-for="(item, pageIdx) in [...sectionsPages, {id: 'other', page: 'Other', path: 'other'}]"
                       :key="`${item.page}-${pageIdx}`" class="multiple-options-wrapper">
                    <div class="single-multiple-option"
                         :class="isSelected(item.path, idx) ? 'multiple-options-selected' : ''"
                         @click="selectOption(item.path, idx)">{{ item.page }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="object.page[selectedLang] === 'other'" class="flex flex-col items-start justify-start mt-8">
              <label class="mr-4 font-medium">{{ $t("Other") }}</label>
              <link-description class="pb-1"/>
              <input
                v-model="object.link[selectedLang]"
                type="text"
                value=""
                :placeholder="$t('forms.link')"
                :class="sectionsStyle.input"
              />
            </div>
            <span v-show="idx === 0 && errors.menu[idx].link === true && siteLang === 'en'"
                  class="text-error text-sm pt-2 pl-2">{{ $t('forms.requiredField') }}</span>
          </div>

        </fieldset>

      </div>
      <div
        class="add-button underline cursor-pointer mt-2"
        @click="addMenuItem()"
      >
        <div class="p3 bold text">{{ $t("forms.addMenuItem") }}</div>
      </div>
    </div>

  </div>
</template>

<script>
import {sectionHeader} from "@geeks.solutions/nuxt-sections/lib/src/utils";
import {getSectionsPages, sectionsStyle, scrollToFirstError} from "@/utils/constants";
import 'vue-select/dist/vue-select.css';

export default {
  name: 'SimpleMenu',
  props: {
    selectedLang: {
      type: String,
      default: 'fr'
    },
    locales: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      settings: [
        {
          menuLabel: {},
          logoLink: {},
          classes: '',
          menu: [
            {
              label: {},
              link: {},
              page: {},
              menuItemClasses: '',
              languageMenu: false
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
      sectionsPages: []
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
      this.locales.forEach(locale => {
        if (!v[0].menuLabel) {
          v[0].menuLabel = {}
        }
      })
    }
  },
  async mounted() {
    this.$nuxt.$emit('initLoading', true)
    this.sectionsPages = await getSectionsPages(sectionHeader({token: window.$nuxt.$cookies.get('sections-auth-token')}))
    this.$nuxt.$emit('initLoading', false)
  },
  methods: {
    isSelected(path, idx) {
      return this.settings[0].menu[idx].page[this.selectedLang] === path
    },
    selectOption(value, idx) {
      if (this.isSelected(value, idx) === true) {
        this.locales.forEach(locale => {
          this.$set(this.settings[0].menu[idx].page, locale, '')
        })
      } else {
        this.locales.forEach(locale => {
          this.$set(this.settings[0].menu[idx].page, locale, value)
        })
      }
    },
    addMenuItem() {
      const menuItem = {
        label: {},
        link: {},
        page: {},
        menuItemClasses: '',
        languageMenu: false
      }
      this.locales.forEach(locale => {
        menuItem.label[locale] = ''
        menuItem.link[locale] = ''
        menuItem.page[locale] = ''
      })
      this.settings[0].menu.push(menuItem);
    },
    removeMenuItem(idx) {
      this.$set(this.settings[0], 'menu', this.settings[0].menu.filter((ct, i) => idx !== i))
    },
    validate() {
      let valid = true;
      this.errors.menu[0].link = false;
      this.errors.menu[0].label = false;
      if (this.settings[0].menu[0].languageMenu !== true && !this.settings[0].menu[0].link.en && !this.settings[0].menu[0].page.en) {
        this.errors.menu[0].link = true;
        valid = false;
      }
      if (!this.settings[0].menu[0].label.en) {
        this.errors.menu[0].label = true;
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

.selectMultipleOptions {
  border-radius: 0.75rem;
  border-width: 1px;
  border-radius: 0.75rem;
  overflow-y: scroll;
  align-items: flex-start;
  flex-direction: column;
  max-width: 32rem;
  height: 250px;
  display: flex;
  margin-top: 0.5rem;
}

.single-multiple-option {
  padding-left: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  width: 100%;
  text-align: start;
}

.multiple-options-wrapper {
  width: 100%;
}

.multiple-options-selected {
  background: #C2C2C2;
}
</style>
