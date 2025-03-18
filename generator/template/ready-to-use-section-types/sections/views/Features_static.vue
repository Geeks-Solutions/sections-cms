<template>
  <div v-if="settings" class="my-14 features ql-snow">

    <div v-if="settings[0].title[lang]" class="ql-editor ql-snow px-8 md:px-0 title" v-html="settings[0].title[lang]"></div>
    <div v-if="settings[0].subtitle[lang]" class="ql-editor ql-snow subtitle" v-html="settings[0].subtitle[lang]"></div>

    <div class="flex flex-wrap gap-4 md:gap-0 justify-center md:mt-14 items-stretch mx-4 md:mx-8 blocks-wrapper">

      <div v-for="(container,idx) in migratedSettings" :key="`block-container-${idx}`" class="flex flex-col z-10 min-h-[206px] my-3 md:mx-3 items-center md:justify-center justify-start self-center w-full md:w-448px rounded-md shadow image-main-wrapper">

        <div class="flex flex-col items-center image-wrapper">
          <img
            v-if="container.media && container.media.url"
            :src="container.media.url"
            :alt="container.media.seo_tag ? container.media.seo_tag : ''"
            loading="lazy"
            class="p-4"
          />
          <div class="ql-editor ql-snow pb-4 px-4 p-0 text" v-html="container.text[lang]"></div>
        </div>

      </div>

    </div>

  </div>
</template>

<script>

export default {
  name: 'SectionFeaturesStatic',
  props: {
    section: {
      type: Object,
      default: () => {},
    },
    lang: {
      type: String,
      default: "en"
    },
    viewStructure: {
      settings: [
        {
          title: {
            en: 'string',
            fr: 'string'
          },
          subtitle: {
            en: 'string',
            fr: 'string'
          },
          text: {
            en: 'string',
            fr: 'string'
          },
          media: 'image'
        },
        {
          title: {
            en: 'string',
            fr: 'string'
          },
          subtitle: {
            en: 'string',
            fr: 'string'
          },
          text: {
            en: 'string',
            fr: 'string'
          },
          media: 'image'
        },
        {
          title: {
            en: 'string',
            fr: 'string'
          },
          subtitle: {
            en: 'string',
            fr: 'string'
          },
          text: {
            en: 'string',
            fr: 'string'
          },
          media: 'image'
        },
        {
          title: {
            en: 'string',
            fr: 'string'
          },
          subtitle: {
            en: 'string',
            fr: 'string'
          },
          text: {
            en: 'string',
            fr: 'string'
          },
          media: 'image'
        },
      ]
    }
  },
  computed: {
    settings() {
      return this.section.settings;
    },
    migratedSettings() {
      if (this.settings && this.settings[0] && this.settings[0].features === undefined) {
        return this.section.settings
      } else if (this.settings) {
        return this.section.settings[0].features
      } else return []
    }
  },
  mounted() {
    this.setEqualHeights()
  },
  methods: {
    setEqualHeights() {
      try {
        if (window.innerWidth >= 768) {
          this.$nextTick(() => {
            const items = this.$el.querySelectorAll('.image-main-wrapper');
            if (items) {
              let maxHeight = 0;

              items.forEach(item => {
                item.style.height = 'auto';
              });

              items.forEach(item => {
                maxHeight = Math.max(maxHeight, item.offsetHeight + 99);
              });

              items.forEach(item => {
                item.style.height = `${maxHeight}px`;
              });
            }
          });
        } else {
          const items = this.$el.querySelectorAll('.image-main-wrapper');
          if (items) {
            items.forEach(item => {
              item.style.height = 'auto';
            });
          }
        }
      } catch {}
    }
  }
};
</script>

<style>
@media (min-width: 768px) {
  .md\:w-448px {
    width: 448px !important;
  }
}
</style>
