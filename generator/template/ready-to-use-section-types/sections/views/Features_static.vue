<template>
  <div
    v-if="settings"
    :ref="`features-wrapper-${sectionWeight}`"
    class="py-2.5 features"
  >
    <gWysiwygContent
      v-if="settings[0].title[lang]"
      tag="div"
      :classes="`title`"
      :html-content="settings[0].title[lang]"
    />
    <gWysiwygContent
      v-if="settings[0].subtitle[lang]"
      tag="div"
      :classes="`subtitle`"
      :html-content="settings[0].subtitle[lang]"
    />

    <div
      class="flex flex-wrap gap-4 md:gap-0 justify-center items-stretch blocks-wrapper"
      :class="settings[0].sectionWrapperClass"
    >
      <div
        v-for="(container, idx) in migratedSettings"
        :key="`block-container-${idx}`"
        class="flex flex-col z-10 min-h-[206px] my-3 md:mx-3 items-center md:justify-center justify-start self-center w-full md:w-[448px] rounded-md shadow image-main-wrapper"
        :class="`image-main-wrapper-${sectionWeight}`"
      >
        <div class="flex flex-col items-center image-wrapper">
          <div
            class="image-wrapper-inner"
            :class="`image-wrapper-inner-${idx}`"
          >
            <GUniversalViewer
              v-if="container.media && container.media.url"
              :src="container.media.url"
              :alt="container.media.seo_tag ? container.media.seo_tag : ''"
              :type="container.media.metadata?.type || 'image'"
              class="p-4"
              :class="
                container.media.metadata?.type === 'lottie'
                  ? 'w-[150px] h-[150px]'
                  : 'w-fit'
              "
              width="300"
              height="300"
              sizes="100%"
              :placeholder="[300, 300, 75, 5]"
              format="webp"
              loading="lazy"
            />
          </div>
          <gWysiwygContent
            tag="div"
            :wrapper-classes="[container.textClasses, 'image-desc-wrapper']"
            :classes="`pb-4 px-4 p-0 text`"
            :html-content="container.text[lang]"
          />
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
      default: 'en',
    },
    viewStructure: {
      settings: [
        {
          title: {
            en: 'string',
            fr: 'string',
          },
          subtitle: {
            en: 'string',
            fr: 'string',
          },
          text: {
            en: 'string',
            fr: 'string',
          },
          media: 'image',
        },
        {
          title: {
            en: 'string',
            fr: 'string',
          },
          subtitle: {
            en: 'string',
            fr: 'string',
          },
          text: {
            en: 'string',
            fr: 'string',
          },
          media: 'image',
        },
        {
          title: {
            en: 'string',
            fr: 'string',
          },
          subtitle: {
            en: 'string',
            fr: 'string',
          },
          text: {
            en: 'string',
            fr: 'string',
          },
          media: 'image',
        },
        {
          title: {
            en: 'string',
            fr: 'string',
          },
          subtitle: {
            en: 'string',
            fr: 'string',
          },
          text: {
            en: 'string',
            fr: 'string',
          },
          media: 'image',
        },
      ],
    },
  },
  computed: {
    settings() {
      return this.section.settings
    },
    sectionWeight() {
      if (this.section && this.section.weight) {
        return this.section.weight
      } else return '0'
    },
    migratedSettings() {
      if (
        this.settings &&
        this.settings[0] &&
        this.settings[0].features === undefined
      ) {
        return this.section.settings
      } else if (this.settings) {
        return this.section.settings[0].features
      } else return []
    },
  },
  watch: {
    'section.settings': {
      handler() {
        this.setEqualHeights()
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.setEqualHeights()
    const sectionsThemeComponents = null
    sectionsThemeComponents?.(this.section.name, [
      {
        id: 'global',
        name: this.$t('sectionsBuilder.globalSettings'),
        path: '/theme/global_settings',
      },
    ])
  },
  methods: {
    setEqualHeights() {
      try {
        if (
          window.innerWidth >= 1024 &&
          this.$el &&
          this.$el.querySelectorAll(`.image-main-wrapper-${this.sectionWeight}`)
        ) {
          this.$nextTick(() => {
            const containerWrapper =
              this.$refs[`features-wrapper-${this.sectionWeight}`]
            if (containerWrapper && containerWrapper.clientWidth >= 1024) {
              const items = this.$el.querySelectorAll(
                `.image-main-wrapper-${this.sectionWeight}`,
              )
              if (items.length) {
                // Wait for images to load before setting heights
                const images = [...containerWrapper.querySelectorAll('img')]
                let loadedCount = 0

                const checkAllLoaded = () => {
                  loadedCount++
                  if (loadedCount === images.length) {
                    adjustHeights()
                  }
                }

                // If no images, adjust heights immediately
                if (images.length === 0) {
                  adjustHeights()
                } else {
                  images.forEach((img) => {
                    if (img.complete) {
                      checkAllLoaded()
                    } else {
                      img.onload = checkAllLoaded
                      img.onerror = checkAllLoaded
                    }
                  })
                }

                function adjustHeights() {
                  let maxHeight = 0

                  items.forEach((item) => {
                    // Measure without removing height first
                    const prevHeight = item.style.height
                    item.style.height = 'auto'
                    maxHeight = Math.max(maxHeight, item.offsetHeight)
                    item.style.height = prevHeight
                  })

                  // Now apply the new height
                  items.forEach((item) => {
                    item.style.height = `${maxHeight}px`
                  })
                }
              }
            } else if (
              this.$el &&
              this.$el.querySelectorAll(
                `.image-main-wrapper-${this.sectionWeight}`,
              )
            ) {
              const items = this.$el.querySelectorAll(
                `.image-main-wrapper-${this.sectionWeight}`,
              )
              if (items.length) {
                items.forEach((item) => {
                  item.style.height = 'auto'
                })
              }
            }
          })
        } else if (
          this.$el &&
          this.$el.querySelectorAll(`.image-main-wrapper-${this.sectionWeight}`)
        ) {
          const items = this.$el.querySelectorAll(
            `.image-main-wrapper-${this.sectionWeight}`,
          )
          if (items.length) {
            items.forEach((item) => {
              item.style.height = 'auto'
            })
          }
        }
      } catch {}
    },
  },
}
</script>

<style>
@media (min-width: 768px) {
  .md\:w-448px {
    width: 448px !important;
  }
}
</style>
