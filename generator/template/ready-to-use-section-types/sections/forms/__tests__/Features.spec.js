import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import Features from '../Features.vue'

describe('Features', () => {
  let wrapper

  const createWrapper = (props = {}, shallow = false) => {
    const mountFn = shallow ? shallowMount : mount
    return mountFn(Features, {
      props: {
        selectedLang: 'en',
        defaultLang: 'en',
        locales: ['en', 'fr'],
        ...props,
      },
      global: {
        stubs: {
          LazyEditorWysiwyg: true,
          LazySectionsFormsFieldSets: true,
          LazyMediasUploadMedia: true,
        },
      },
    })
  }

  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('Component Initialization', () => {
    it('should render with default props', () => {
      wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should initialize with correct settings structure', () => {
      wrapper = createWrapper()
      
      expect(wrapper.vm.settings).toHaveLength(1)
      expect(wrapper.vm.settings[0].title).toEqual({ en: '', fr: '' })
      expect(wrapper.vm.settings[0].subtitle).toEqual({ en: '', fr: '' })
      expect(wrapper.vm.settings[0].features).toBeInstanceOf(Array)
      expect(wrapper.vm.settings[0].features.length).toBeGreaterThan(0)
    })

    it('should initialize with correct default classes', () => {
      wrapper = createWrapper()
      
      expect(wrapper.vm.settings[0].titleClasses).toBe('')
      expect(wrapper.vm.settings[0].subtitleClasses).toBe('')
      expect(wrapper.vm.settings[0].features[0].textClasses).toBe('')
    })

    it('should initialize errors with media as false', () => {
      wrapper = createWrapper()
      
      expect(wrapper.vm.errors).toEqual({ media: false })
    })
  })

  describe('Language Switching', () => {
    it('should update siteLang when selectedLang changes', async () => {
      wrapper = createWrapper({ selectedLang: 'en' })
      await wrapper.vm.$nextTick()
      
      await wrapper.setProps({ selectedLang: 'fr' })
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.siteLang).toBe('fr')
    })
  })

  describe('Title Management', () => {
    it('should update title when updateTitleDescription is called', () => {
      wrapper = createWrapper()
      
      wrapper.vm.updateTitleDescription('<h1>Test Title</h1>', 0)
      
      expect(wrapper.vm.settings[0].title.en).toBe('<h1>Test Title</h1>')
    })

    it('should update title in correct language based on selectedLang', () => {
      wrapper = createWrapper({ selectedLang: 'fr' })
      
      wrapper.vm.updateTitleDescription('<h1>Titre de test</h1>', 0)
      
      expect(wrapper.vm.settings[0].title.fr).toBe('<h1>Titre de test</h1>')
    })
  })

  describe('Subtitle Management', () => {
    it('should update subtitle when updateSubtitleDescription is called', () => {
      wrapper = createWrapper()
      
      wrapper.vm.updateSubtitleDescription('<p>Test Subtitle</p>', 0)
      
      expect(wrapper.vm.settings[0].subtitle.en).toBe('<p>Test Subtitle</p>')
    })
  })

  describe('Feature Text Management', () => {
    it('should update feature text when updateTextDescription is called', () => {
      wrapper = createWrapper()
      
      wrapper.vm.updateTextDescription('<p>Feature text</p>', 0)
      
      expect(wrapper.vm.settings[0].features[0].text.en).toBe('<p>Feature text</p>')
    })
  })

  describe('Feature Block Management', () => {
    it('should add a new feature block when addFeatureBlock is called', () => {
      wrapper = createWrapper()
      const initialLength = wrapper.vm.settings[0].features.length
      
      wrapper.vm.addFeatureBlock()
      
      expect(wrapper.vm.settings[0].features.length).toBe(initialLength + 1)
      expect(wrapper.vm.settings[0].features[initialLength].text).toEqual({ en: '', fr: '' })
      expect(wrapper.vm.settings[0].features[initialLength].media).toEqual({
        media_id: '',
        url: '',
        seo_tag: '',
      })
    })

    it('should add multiple feature blocks', () => {
      wrapper = createWrapper()
      const initialLength = wrapper.vm.settings[0].features.length
      
      wrapper.vm.addFeatureBlock()
      wrapper.vm.addFeatureBlock()
      
      expect(wrapper.vm.settings[0].features.length).toBe(initialLength + 2)
    })

    it('should remove a feature block when removeFeatureBlock is called', () => {
      wrapper = createWrapper()
      wrapper.vm.addFeatureBlock()
      const lengthBeforeRemove = wrapper.vm.settings[0].features.length
      
      wrapper.vm.removeFeatureBlock(1)
      
      expect(wrapper.vm.settings[0].features.length).toBe(lengthBeforeRemove - 1)
    })

    it('should not remove the last feature block', () => {
      wrapper = createWrapper()
      const initialLength = wrapper.vm.settings[0].features.length
      
      wrapper.vm.removeFeatureBlock(0)
      
      expect(wrapper.vm.settings[0].features.length).toBe(initialLength)
    })
  })

  describe('Media Management', () => {
    it('should remove media from feature block when removeMedia is called', () => {
      wrapper = createWrapper()
      wrapper.vm.settings[0].features[0].media = {
        media_id: '123',
        url: 'test.jpg',
        seo_tag: 'Test Image',
      }
      wrapper.vm.settings[0].medias.push({
        media_id: '123',
        url: 'test.jpg',
        seo_tag: 'Test Image',
      })
      
      wrapper.vm.removeMedia(0, 'media')
      
      expect(wrapper.vm.settings[0].features[0].media).toEqual({})
      expect(wrapper.vm.settings[0].medias.length).toBe(1)
    })

    it('should handle media removal gracefully when media index not found', () => {
      wrapper = createWrapper()
      
      expect(() => {
        wrapper.vm.removeMedia(0, 'media')
      }).not.toThrow()
    })

    it('should update selected media index and key when handleUploadContainerClicked is called', () => {
      wrapper = createWrapper()
      const object = { media: { media_id: '123' } }
      
      wrapper.vm.handleUploadContainerClicked(2, object)
      
      expect(wrapper.vm.selectedMediaIndex).toBe(2)
      expect(wrapper.vm.selectedMediaKey).toBe('media')
    })

    it('should emit openMediaModal with media_id when media exists', () => {
      wrapper = createWrapper({ shallow: true })
      const object = { media: { media_id: '123' } }
      
      wrapper.vm.handleUploadContainerClicked(0, object)
      
      expect(wrapper.emitted('openMediaModal')).toBeTruthy()
      expect(wrapper.emitted('openMediaModal')[0]).toEqual(['123'])
    })

    it('should emit openMediaModal with null when media does not exist', () => {
      wrapper = createWrapper({ shallow: true })
      const object = { media: {} }
      
      wrapper.vm.handleUploadContainerClicked(0, object)
      
      expect(wrapper.emitted('openMediaModal')).toBeTruthy()
      expect(wrapper.emitted('openMediaModal')[0]).toEqual([null])
    })
  })

  describe('Wysiwyg Media Handling', () => {
    it('should add wysiwyg media when wysiwygMediaAdded is called', () => {
      wrapper = createWrapper()
      const media = { media_id: '123', url: 'test.jpg', seo_tag: 'Test' }
      
      wrapper.vm.wysiwygMediaAdded(media)
      
      expect(wrapper.vm.settings[0].wysiwygMediasData).toHaveLength(1)
      expect(wrapper.vm.settings[0].wysiwygMediasData[0].wysiwygMedia).toEqual(media)
      expect(wrapper.vm.settings[0].wysiwygMedias).toHaveLength(1)
    })

    it('should track wysiwyg language when media is added', () => {
      wrapper = createWrapper({ selectedLang: 'fr' })
      const media = { media_id: '123', url: 'test.jpg', seo_tag: 'Test' }
      
      wrapper.vm.wysiwygMediaAdded(media)
      
      expect(wrapper.vm.settings[0].wysiwygMediasData[0].wysiwygLang).toBe('fr')
    })
  })

  describe('Validation', () => {
    it('should return true when validation passes', () => {
      wrapper = createWrapper()
      
      const result = wrapper.vm.validate()
      
      expect(result).toBe(true)
      expect(wrapper.vm.errors.media).toBe(false)
    })

    it('should clean up empty media objects on validation', () => {
      wrapper = createWrapper()
      wrapper.vm.settings[0].media = { media_id: '', url: '', seo_tag: '' }
      
      wrapper.vm.validate()
      
      expect(wrapper.vm.settings[0].media).toBeUndefined()
    })

    it('should clean up invalid media objects on validation', () => {
      wrapper = createWrapper()
      wrapper.vm.settings[0].media = { media_id: '123' }
      
      wrapper.vm.validate()
      
      expect(wrapper.vm.settings[0].media).toBeUndefined()
    })

    it('should clean up wysiwygMedias if empty on validation', () => {
      wrapper = createWrapper()
      wrapper.vm.settings[0].wysiwygMedias = []
      
      wrapper.vm.validate()
      
      expect(wrapper.vm.settings[0].wysiwygMedias).toBeUndefined()
    })

    it('should handle validation gracefully with errors', () => {
      wrapper = createWrapper()
      
      expect(() => {
        wrapper.vm.validate()
      }).not.toThrow()
    })
  })

  describe('Media Selection Handling', () => {
    it('should update feature media when selectedMedia prop changes', async () => {
      wrapper = createWrapper()
      wrapper.vm.selectedMediaIndex = 0
      wrapper.vm.selectedMediaKey = 'media'
      
      const mediaObject = {
        id: '123',
        files: [{ url: 'test.jpg', thumbnail_url: 'test-thumb.jpg' }],
        seo_tag: 'Test Image',
      }
      
      await wrapper.setProps({ selectedMedia: mediaObject })
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.settings[0].features[0].media.media_id).toBe('123')
    })

    it('should add media to medias array when selectedMedia prop changes', async () => {
      wrapper = createWrapper()
      wrapper.vm.selectedMediaIndex = 0
      wrapper.vm.selectedMediaKey = 'media'
      
      const mediaObject = {
        id: '123',
        files: [{ url: 'test.jpg', thumbnail_url: 'test-thumb.jpg' }],
        seo_tag: 'Test Image',
      }
      
      await wrapper.setProps({ selectedMedia: mediaObject })
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.settings[0].medias.length).toBeGreaterThan(0)
    })

    it('should emit closeMediaModal when selectedMedia prop changes', async () => {
      wrapper = createWrapper({ shallow: true })
      wrapper.vm.selectedMediaIndex = 0
      wrapper.vm.selectedMediaKey = 'media'
      
      const mediaObject = {
        id: '123',
        files: [{ url: 'test.jpg', thumbnail_url: 'test-thumb.jpg' }],
        seo_tag: 'Test Image',
      }
      
      await wrapper.setProps({ selectedMedia: mediaObject })
      await wrapper.vm.$nextTick()
      
      expect(wrapper.emitted('closeMediaModal')).toBeTruthy()
    })
  })

  describe('CSSEditor Integration', () => {
    it('should allow updating titleClasses', () => {
      wrapper = createWrapper()
      wrapper.vm.settings[0].titleClasses = 'custom-title-class'
      
      expect(wrapper.vm.settings[0].titleClasses).toBe('custom-title-class')
    })

    it('should allow updating subtitleClasses', () => {
      wrapper = createWrapper()
      wrapper.vm.settings[0].subtitleClasses = 'custom-subtitle-class'
      
      expect(wrapper.vm.settings[0].subtitleClasses).toBe('custom-subtitle-class')
    })

    it('should allow updating feature textClasses', () => {
      wrapper = createWrapper()
      wrapper.vm.settings[0].features[0].textClasses = 'custom-text-class'
      
      expect(wrapper.vm.settings[0].features[0].textClasses).toBe('custom-text-class')
    })
  })

  describe('FieldSets Integration', () => {
    it('should allow updating features array directly', () => {
      wrapper = createWrapper()
      const newFeatures = [
        { text: { en: 'New Feature', fr: '' }, textClasses: '', media: {} },
      ]
      wrapper.vm.settings[0].features = newFeatures
      
      expect(wrapper.vm.settings[0].features).toEqual(newFeatures)
    })
  })

  describe('Data Structure Integrity', () => {
    it('should maintain correct feature structure after add/remove operations', () => {
      wrapper = createWrapper()
      
      wrapper.vm.addFeatureBlock()
      wrapper.vm.removeFeatureBlock(0)
      
      const firstFeature = wrapper.vm.settings[0].features[0]
      expect(firstFeature).toHaveProperty('text')
      expect(firstFeature).toHaveProperty('textClasses')
      expect(firstFeature).toHaveProperty('media')
    })

    it('should maintain media array consistency', () => {
      wrapper = createWrapper()
      wrapper.vm.settings[0].features[0].media = {
        media_id: '123',
        url: 'test.jpg',
        seo_tag: 'Test',
      }
      wrapper.vm.removeMedia(0, 'media')
      
      expect(wrapper.vm.settings[0].medias).toBeInstanceOf(Array)
    })
  })

  describe('Component Structure', () => {
    it('should have correct data properties', () => {
      wrapper = createWrapper()
      
      expect(wrapper.vm).toHaveProperty('settings')
      expect(wrapper.vm).toHaveProperty('errors')
      expect(wrapper.vm).toHaveProperty('siteLang')
      expect(wrapper.vm).toHaveProperty('selectedMediaIndex')
      expect(wrapper.vm).toHaveProperty('selectedMediaKey')
    })

    it('should have required methods', () => {
      wrapper = createWrapper()
      
      expect(typeof wrapper.vm.updateTitleDescription).toBe('function')
      expect(typeof wrapper.vm.updateSubtitleDescription).toBe('function')
      expect(typeof wrapper.vm.updateTextDescription).toBe('function')
      expect(typeof wrapper.vm.addFeatureBlock).toBe('function')
      expect(typeof wrapper.vm.removeFeatureBlock).toBe('function')
      expect(typeof wrapper.vm.removeMedia).toBe('function')
      expect(typeof wrapper.vm.validate).toBe('function')
      expect(typeof wrapper.vm.handleUploadContainerClicked).toBe('function')
      expect(typeof wrapper.vm.wysiwygMediaAdded).toBe('function')
    })
  })
})
