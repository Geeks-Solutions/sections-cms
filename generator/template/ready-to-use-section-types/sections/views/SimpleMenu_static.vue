<template>
  <div v-if="settings" class="simple-menu py-2.5" :class="settings.classes">
    <div class="icon-wrapper md:hidden" :class="{'visibleMenu': mobileMenu === true}" @click="mobileMenu = !mobileMenu">
      <div class="icon"></div>
    </div>
    <global-link v-if="settings.media && settings.media.url"
                 :link="settings.logoPage[lang] === 'other' ? settings.logoLink : settings.logoPage && settings.logoPage[lang] ? { ...settings.logoPage, en: '/' + settings.logoPage.en, fr: '/' + settings.logoPage.fr } : '#'"
                 :lang="lang"
                 :form-link-target="settings.logoLinkTarget"
                 class="logo-wrapper">
      <img
        :src="settings.media.url"
        :alt="settings.media.seo_tag ? settings.media.seo_tag : ''"
        loading="lazy"
        class="logo"
      />
    </global-link>
    <h3 v-if="settings.menuLabel && settings.menuLabel[lang]">{{ settings.menuLabel[lang] }}</h3>
    <ul>
      <li v-for="(menuItem, idx) in settings.menu" :key="`simple-menu-${idx}`" :class="[menuItem.menuItemClasses, {'lang': menuItem.languageMenu === true}, {'mobileHidden': idx >= 0}]">
        <global-link v-if="menuItem.languageMenu !== true"
                     :link="menuItem.page[lang] === 'other' ? menuItem.link : { ...menuItem.page, en: '/' + menuItem.page.en, fr: '/' + menuItem.page.fr }"
                     :lang="lang"
                     :form-link-target="menuItem.linkTarget">
          <p>
            {{ menuItem.label[lang] }}
          </p>
        </global-link>
        <nuxt-link v-else
                   :to="switchLocalePath(lang === 'fr' ? 'en' : 'fr')"
        >
          {{ menuItem.label && menuItem.label[lang] ? menuItem.label[lang] : '' }}
        </nuxt-link>
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
                           :form-link-target="menuItem.linkTarget">
                <p>
                  {{ menuItem.label[lang] }}
                </p>
              </global-link>
              <nuxt-link v-else
                         :to="switchLocalePath(lang === 'fr' ? 'en' : 'fr')"
              >
                {{ menuItem.label && menuItem.label[lang] ? menuItem.label[lang] : '' }}
              </nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { useSwitchLocalePath } from '#imports'

export default {
  name: 'SimpleMenu',
  setup() {
    const switchLocalePath = useSwitchLocalePath()

    return {
      switchLocalePath,
    }
  },
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
