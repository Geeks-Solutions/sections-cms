import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import FeaturesStatic from '../Features_static.vue'

describe('FeaturesStatic.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('ensures all blocks have the same height and width', async () => {
    const wrapper = shallowMount(FeaturesStatic, {
      props: {
        section: {
          settings: [
            {
              title: { en: 'Title 1', fr: 'Titre 1' },
              subtitle: { en: 'Subtitle 1', fr: 'Sous-titre 1' },
              text: { en: 'Text 1', fr: 'Texte 1' },
              media: { url: 'image1.jpg', seo_tag: 'Image 1' },
            },
            {
              title: { en: 'Title 2', fr: 'Titre 2' },
              subtitle: { en: 'Subtitle 2', fr: 'Sous-titre 2' },
              text: {
                en: '<p class="ql-align-center">Enable your users to easily administrate the</p><p class="ql-align-center">pages of their website with a drag and drop</p><p class="ql-align-center">interface (with the <a href="https://www.npmjs.com/package/@geeks.solutions/nuxt-sections" rel="noopener noreferrer" target="_blank" style="color: rgb(3, 177, 199);">nuxt-sections</a> open</p><p class="ql-align-center">source library)</p>',
                fr: 'Texte 2',
              },
              media: { url: 'image2.jpg', seo_tag: 'Image 2' },
            },
          ],
        },
        lang: 'en',
      },
    })

    await wrapper.vm.$nextTick()

    const blocks = wrapper.findAll('.image-main-wrapper')
    expect(blocks.length).toBe(2)

    const firstBlock = blocks.at(0).element
    const secondBlock = blocks.at(1).element

    expect(firstBlock.offsetHeight).toBe(secondBlock.offsetHeight)
    expect(firstBlock.offsetWidth).toBe(secondBlock.offsetWidth)
  })

  it('does not render when settings is falsy', () => {
    const wrapper = shallowMount(FeaturesStatic, {
      props: {
        section: { settings: null },
        lang: 'en',
      },
    })

    expect(wrapper.find('.features').exists()).toBe(false)
  })

  it('applies custom sectionWrapperClass when provided', () => {
    const wrapper = shallowMount(FeaturesStatic, {
      props: {
        section: {
          settings: [
            {
              title: { en: 'Title 1', fr: 'Titre 1' },
              subtitle: { en: 'Subtitle 1', fr: 'Sous-titre 1' },
              text: { en: 'Text 1', fr: 'Texte 1' },
              media: { url: 'image1.jpg', seo_tag: 'Image 1' },
              sectionWrapperClass: 'custom-class',
            },
          ],
        },
        lang: 'en',
      },
    })

    const blocksWrapper = wrapper.find('.blocks-wrapper')
    expect(blocksWrapper.classes()).toContain('custom-class')
  })

  describe('computed properties', () => {
    it('settings returns section.settings', () => {
      const wrapper = shallowMount(FeaturesStatic, {
        props: {
          section: {
            settings: [
              {
                title: { en: 'Title' },
                subtitle: { en: 'Subtitle' },
                text: { en: 'Text' },
              },
            ],
          },
          lang: 'en',
        },
      })

      expect(wrapper.vm.settings).toEqual([
        {
          title: { en: 'Title' },
          subtitle: { en: 'Subtitle' },
          text: { en: 'Text' },
        },
      ])
    })

    it('sectionWeight returns section.weight when it exists', () => {
      const wrapper = shallowMount(FeaturesStatic, {
        props: {
          section: {
            weight: '5',
            settings: [
              {
                title: { en: 'Title' },
                subtitle: { en: 'Subtitle' },
                text: { en: 'Text' },
              },
            ],
          },
          lang: 'en',
        },
      })

      expect(wrapper.vm.sectionWeight).toBe('5')
    })

    it('sectionWeight returns "0" when section.weight does not exist', () => {
      const wrapper = shallowMount(FeaturesStatic, {
        props: {
          section: {
            settings: [
              {
                title: { en: 'Title' },
                subtitle: { en: 'Subtitle' },
                text: { en: 'Text' },
              },
            ],
          },
          lang: 'en',
        },
      })

      expect(wrapper.vm.sectionWeight).toBe('0')
    })

    it('migratedSettings returns section.settings when settings[0].features is undefined', () => {
      const wrapper = shallowMount(FeaturesStatic, {
        props: {
          section: {
            settings: [
              {
                title: { en: 'Global Title' },
                subtitle: { en: 'Subtitle' },
                text: { en: 'Text' },
              },
              {
                title: { en: 'Feature 1' },
                subtitle: { en: 'Subtitle 1' },
                text: { en: 'Text 1' },
              },
              {
                title: { en: 'Feature 2' },
                subtitle: { en: 'Subtitle 2' },
                text: { en: 'Text 2' },
              },
            ],
          },
          lang: 'en',
        },
      })

      expect(wrapper.vm.migratedSettings.length).toBe(3)
    })

    it('migratedSettings returns section.settings[0].features when features exists', () => {
      const wrapper = shallowMount(FeaturesStatic, {
        props: {
          section: {
            settings: [
              {
                title: { en: 'Global Title' },
                subtitle: { en: 'Subtitle' },
                features: [
                  {
                    title: { en: 'Feature 1' },
                    subtitle: { en: 'Subtitle 1' },
                    text: { en: 'Text 1' },
                  },
                  {
                    title: { en: 'Feature 2' },
                    subtitle: { en: 'Subtitle 2' },
                    text: { en: 'Text 2' },
                  },
                ],
              },
            ],
          },
          lang: 'en',
        },
      })

      expect(wrapper.vm.migratedSettings.length).toBe(2)
      expect(wrapper.vm.migratedSettings[0].title.en).toBe('Feature 1')
    })

    it('migratedSettings returns empty array when settings is falsy', () => {
      const wrapper = shallowMount(FeaturesStatic, {
        props: {
          section: { settings: null },
          lang: 'en',
        },
      })

      expect(wrapper.vm.migratedSettings).toEqual([])
    })
  })

  describe('methods', () => {
    it('handles error gracefully in setEqualHeights', () => {
      const wrapper = shallowMount(FeaturesStatic, {
        props: {
          section: { settings: null },
          lang: 'en',
        },
      })

      expect(() => wrapper.vm.setEqualHeights()).not.toThrow()
    })

    it('calls setEqualHeights when section.settings changes', async () => {
      const setEqualHeightsSpy = vi.fn()
      const wrapper = shallowMount(FeaturesStatic, {
        props: {
          section: {
            settings: [
              {
                title: { en: 'Title 1' },
                subtitle: { en: 'Subtitle' },
                text: { en: 'Text 1' },
              },
            ],
          },
          lang: 'en',
        },
      })

      wrapper.vm.setEqualHeights = setEqualHeightsSpy

      await wrapper.setProps({
        section: {
          settings: [
            {
              title: { en: 'Title 2' },
              subtitle: { en: 'Subtitle' },
              text: { en: 'Text 2' },
            },
          ],
        },
      })

      expect(setEqualHeightsSpy).toHaveBeenCalled()
    })
  })

  describe('language support', () => {
    it('defaults to English when lang is not provided', () => {
      const wrapper = shallowMount(FeaturesStatic, {
        props: {
          section: {
            settings: [
              {
                title: { en: 'Title EN', fr: 'Titre FR' },
                subtitle: { en: 'Subtitle' },
                text: { en: 'Text EN' },
              },
            ],
          },
        },
      })

      const blocks = wrapper.findAll('.image-main-wrapper')
      expect(blocks.length).toBe(1)
    })

    it('renders with French language content when lang is set to fr', () => {
      const wrapper = shallowMount(FeaturesStatic, {
        props: {
          section: {
            settings: [
              {
                title: { en: 'Title EN', fr: 'Titre FR' },
                subtitle: { en: 'Subtitle EN', fr: 'Sous-titre FR' },
                text: { en: 'Text EN', fr: 'Texte FR' },
              },
            ],
          },
          lang: 'fr',
        },
      })

      const blocks = wrapper.findAll('.image-main-wrapper')
      expect(blocks.length).toBe(1)
    })
  })

  describe('media handling', () => {
    it('renders feature blocks when media has url', () => {
      const wrapper = shallowMount(FeaturesStatic, {
        props: {
          section: {
            settings: [
              {
                title: { en: 'Title 1', fr: 'Titre 1' },
                subtitle: { en: 'Subtitle 1', fr: 'Sous-titre 1' },
                text: { en: 'Text 1', fr: 'Texte 1' },
                media: {
                  url: 'image.jpg',
                  seo_tag: 'Alt Text',
                  metadata: { type: 'image' },
                },
              },
            ],
          },
          lang: 'en',
        },
      })

      const blocks = wrapper.findAll('.image-main-wrapper')
      expect(blocks.length).toBe(1)
    })

    it('does not render GUniversalViewer when media.url is missing', () => {
      const wrapper = shallowMount(FeaturesStatic, {
        props: {
          section: {
            settings: [
              {
                title: { en: 'Title 1', fr: 'Titre 1' },
                subtitle: { en: 'Subtitle 1', fr: 'Sous-titre 1' },
                text: { en: 'Text 1', fr: 'Texte 1' },
                media: { seo_tag: 'Image 1' },
              },
            ],
          },
          lang: 'en',
        },
      })

      const blocks = wrapper.findAll('.image-main-wrapper')
      expect(blocks.length).toBe(1)
    })
  })
})
