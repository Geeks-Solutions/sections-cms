<template>
  <div v-if="settings" class="simple-menu py-2.5" :class="settings.classes">
    <div class="icon-wrapper md:hidden" :class="{'visibleMenu': mobileMenu === true}" @click="mobileMenu = !mobileMenu">
      <div class="icon"></div>
    </div>
    <global-link v-if="settings.media && settings.media.url"
                 :link="settings.logoPage[lang] === 'other' ? settings.logoLink : settings.logoPage && settings.logoPage[lang] ? { ...settings.logoPage, en: '/' + settings.logoPage.en, fr: '/' + settings.logoPage.fr } : '#'"
                 :lang="lang"
                 :default-lang="defaultLang"
                 :form-link-target="settings.logoLinkTarget"
                 class="logo-wrapper">
      <NuxtImg
        :src="settings.media.url"
        :alt="settings.media.seo_tag ? settings.media.seo_tag : ''"
        class="logo w-fit"
        width="300"
           height="300"
        sizes="100%"
           :placeholder="[300, 300, 75, 5]" format="webp"
        loading="lazy"
      />
    </global-link>
    <h3 v-if="settings.menuLabel && settings.menuLabel[lang]">{{ settings.menuLabel[lang] }}</h3>
    <ul v-for="(menuContainer, menuIdx) in settings.menus" :key="`simple-menu-ul-container-${menuIdx}`" :class="[menuContainer.menuContainerClasses, `ul-container-${menuIdx}`]">
      <li v-for="(menuItem, idx) in menuContainer.menu" :key="`simple-menu-${idx}`" :class="[menuItem.menuItemClasses, {'lang': menuItem.languageMenu === true}, {'mobileHidden': idx >= 0}]">
        <global-link v-if="menuItem.languageMenu !== true"
                     :link="menuItem.page[lang] === 'other' ? menuItem.link : { ...menuItem.page, en: '/' + menuItem.page.en, fr: '/' + menuItem.page.fr }"
                     :lang="lang"
                     :default-lang="defaultLang"
                     :form-link-target="menuItem.linkTarget">
          <p>
            {{ menuItem.label[lang] }}
          </p>
        </global-link>
        <global-lang-switcher v-else :label="menuItem.label && menuItem.label[lang] ? menuItem.label[lang] : ''" :lang="lang" :default-lang="defaultLang" />
      </li>
    </ul>
    <transition name="mobile-menu-main-wrapper">
      <div v-show="mobileMenu === true" class="fixed inset-0 mobile-menu-main-wrapper bg-white" :class="{'visibleMenu' : mobileMenu === true}">
        <div class="mobile-menu-wrapper">
          <div class="mobile-menu-close-wrapper" @click="mobileMenu = false">
            <div class="mobile-menu-close"></div>
          </div>
          <ul>
            <li v-for="(menuItem, idx) in settings.menu" :key="`simple-menu-${idx}`" :class="[menuItem.menuItemClasses, {'logo': idx === 0}, {'lang': menuItem.languageMenu === true}]" @click="mobileMenu = !mobileMenu">
              <global-link v-if="menuItem.languageMenu !== true"
                           :link="menuItem.page[lang] === 'other' ? menuItem.link : { ...menuItem.page, en: '/' + menuItem.page.en, fr: '/' + menuItem.page.fr }"
                           :lang="lang"
                           :default-lang="defaultLang"
                           :form-link-target="menuItem.linkTarget">
                <p>
                  {{ menuItem.label[lang] }}
                </p>
              </global-link>
              <global-lang-switcher v-else :label="menuItem.label && menuItem.label[lang] ? menuItem.label[lang] : ''" :lang="lang" :default-lang="defaultLang" />
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import GlobalLangSwitcher from '~/components/GlobalLangSwitcher.vue'

export default {
  name: 'SimpleMenu',
  components: { GlobalLangSwitcher },
  props: {
    section: {
      type: Object,
      default: () => {
      },
    },
    lang: {
      type: String,
      default: "en"
    },
    defaultLang: {
      type: String,
      default: "en"
    },
    locales: {
      type: Array,
      default: () => [],
    },
    viewStructure: {
      settings: [
        {
          menu: [
            {
              label: {
                en: 'title',
                fr: 'title'
              },
              link: {
                en: 'title',
                fr: 'title'
              },
              page: {
                en: 'title',
                fr: 'title'
              }
            },
            {
              label: {
                en: 'title',
                fr: 'title'
              },
              link: {
                en: 'title',
                fr: 'title'
              },
              page: {
                en: 'title',
                fr: 'title'
              }
            },
            {
              label: {
                en: 'title',
                fr: 'title'
              },
              link: {
                en: 'title',
                fr: 'title'
              },
              page: {
                en: 'title',
                fr: 'title'
              }
            },
            {
              label: {
                en: 'title',
                fr: 'title'
              },
              link: {
                en: 'title',
                fr: 'title'
              },
              page: {
                en: 'title',
                fr: 'title'
              }
            },
            {
              label: {
                en: 'title',
                fr: 'title'
              },
              link: {
                en: 'title',
                fr: 'title'
              },
              page: {
                en: 'title',
                fr: 'title'
              }
            },
            {
              label: {
                en: 'title',
                fr: 'title'
              },
              link: {
                en: 'title',
                fr: 'title'
              },
              page: {
                en: 'title',
                fr: 'title'
              }
            },
            {
              label: {
                en: 'title',
                fr: 'title'
              },
              link: {
                en: 'title',
                fr: 'title'
              },
              page: {
                en: 'title',
                fr: 'title'
              }
            }
          ]
        }
      ]
    }
  },
  data() {
    return {
      mobileMenu: false
    }
  },
  computed: {
    settings() {
      if (Array.isArray(this.section.settings)) {
        if (!this.section.settings[0].menus) {
          this.section.settings[0].menus = [
            {
              menuContainerClasses: '',
              menu: this.section.settings[0].menu
            }
          ]
        }
        return this.section.settings[0];
      } else return this.section.settings
    },
  }
};
</script>

<style>
.simple-menu li {
  list-style: disc;
}
.simple-menu ul li.mobile-top {
  display: flex !important;
}
@media screen and (max-width: 768px) {
  .mobileHidden {
    display: none !important;
  }
}
</style>
