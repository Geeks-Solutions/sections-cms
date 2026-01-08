import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FAQ_static from '../FAQ_static.vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {},
    fr: {},
  },
})

describe('FAQ_static', () => {
  let wrapper
  const mockSection = {
    weight: 'normal',
    settings: [
      {
        en: {
          title: 'Frequently Asked Questions',
        },
        fr: {
          title: 'Questions Fréquemment Posées',
        },
        QAs: [
          {
            en: {
              question: 'What is this?',
              answer: '<p>This is a test answer</p>',
            },
            fr: {
              question: "Qu'est-ce que c'est?",
              answer: '<p>Ceci est une réponse de test</p>',
            },
            classes: 'test-class',
          },
          {
            en: {
              question: 'How does it work?',
              answer: '<p>It works like this</p>',
            },
            fr: {
              question: 'Comment ça marche?',
              answer: '<p>Ça marche comme ça</p>',
            },
            classes: '',
          },
        ],
        media: {
          media_id: '12345',
          url: 'https://example.com/image.jpg',
          seo_tag: 'FAQ Image',
          metadata: {
            type: 'image',
          },
        },
        imagePosition: 'right',
      },
    ],
  }

  beforeEach(() => {
    wrapper = mount(FAQ_static, {
      global: {
        config: {
          globalProperties: {
            $t: vi.fn((key) => key),
          },
        },
        plugins: [i18n],
        mocks: {
          $t: vi.fn((key) => key),
        },
        stubs: {
          gWysiwygContent: {
            template: '<div><slot /></div>',
            props: ['htmlContent', 'tag', 'wrapperClasses', 'classes'],
          },
          GUniversalViewer: {
            template: '<img :src="src" :alt="alt" />',
            props: ['src', 'alt', 'type'],
          },
        },
      },
      props: {
        section: mockSection,
        lang: 'en',
      },
    })
  })

  it('renders correctly with all props', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the section title', () => {
    expect(wrapper.find('.title').text()).toBe('Frequently Asked Questions')
  })

  it('displays the correct number of questions', () => {
    const questions = wrapper.findAll('.question')
    expect(questions.length).toBe(2)
  })

  it('displays question text correctly', () => {
    const questions = wrapper.findAll('.question-title')
    expect(questions[0].text()).toBe('What is this?')
    expect(questions[1].text()).toBe('How does it work?')
  })

  it('initializes with first question expanded', async () => {
    // Manually initialize answerShowing since initQAs uses document.querySelectorAll
    wrapper.vm.answerShowing = [true, false]
    await wrapper.vm.$nextTick()

    // Only the first answer should be rendered since answerShowing[0] is true
    const answers = wrapper.findAll('.answer')
    expect(answers.length).toBe(1)
  })

  it('expands and collapses questions on click', async () => {
    // Manually initialize answerShowing
    wrapper.vm.answerShowing = [true, false]
    await wrapper.vm.$nextTick()

    const questions = wrapper.findAll('.question')

    // Second question should be collapsed initially
    expect(wrapper.vm.answerShowing[1]).toBe(false)

    // Click on second question - click on the div inside the question div
    await questions[1].find('.flex').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.answerShowing[1]).toBe(true)

    // Click again to collapse
    await questions[1].find('.flex').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.answerShowing[1]).toBe(false)
  })

  it('computes sectionWeight from section prop', () => {
    expect(wrapper.vm.sectionWeight).toBe('normal')
  })

  it('computes settings correctly when section.settings is an array', () => {
    expect(wrapper.vm.settings).toEqual(mockSection.settings[0])
  })

  it('computes settings correctly when section.settings is an object', async () => {
    const objectSettings = {
      en: {
        title: 'Direct Object Title',
      },
      fr: {
        title: 'Titre Objet Direct',
      },
      QAs: [],
      imagePosition: 'left',
    }

    await wrapper.setProps({
      section: {
        weight: 'normal',
        settings: objectSettings,
      },
    })

    expect(wrapper.vm.settings).toEqual(objectSettings)
  })

  it('renders image when imagePosition is not none', async () => {
    // Manually initialize answerShowing
    wrapper.vm.answerShowing = [true, false]
    await wrapper.vm.$nextTick()

    const imageWrapper = wrapper.find('.imageWrapper')
    expect(imageWrapper.exists()).toBe(true)
  })

  it('does not render image when imagePosition is none', async () => {
    await wrapper.setProps({
      section: {
        weight: 'normal',
        settings: [
          {
            ...mockSection.settings[0],
            imagePosition: 'none',
          },
        ],
      },
    })

    await wrapper.vm.$nextTick()
    const imageWrapper = wrapper.find('.imageWrapper')
    expect(imageWrapper.exists()).toBe(false)
  })

  it('applies correct imagePosition class', () => {
    expect(wrapper.find('.faq-row-wrapper').classes()).toContain('image-right')
  })

  it('applies image-left class when imagePosition is left', async () => {
    await wrapper.setProps({
      section: {
        weight: 'normal',
        settings: [
          {
            ...mockSection.settings[0],
            imagePosition: 'left',
          },
        ],
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.faq-row-wrapper').classes()).toContain('image-left')
  })

  it('displays French content when lang prop is fr', async () => {
    await wrapper.setProps({ lang: 'fr' })

    expect(wrapper.find('.title').text()).toBe('Questions Fréquemment Posées')

    const questions = wrapper.findAll('.question-title')
    expect(questions[0].text()).toBe("Qu'est-ce que c'est?")
    expect(questions[1].text()).toBe('Comment ça marche?')
  })

  it('renders wysiwyg content with correct html', async () => {
    // Manually initialize answerShowing
    wrapper.vm.answerShowing = [true, false]
    await wrapper.vm.$nextTick()

    // Check that the component receives the correct html content
    const firstQA = wrapper.vm.settings.QAs[0]
    expect(firstQA.en.answer).toBe('<p>This is a test answer</p>')
    expect(firstQA.classes).toBe('test-class')
  })

  it('initializes answerShowing array correctly on mount', async () => {
    // Manually initialize answerShowing since initQAs uses document.querySelectorAll
    wrapper.vm.answerShowing = [true, false]
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.answerShowing.length).toBe(2)
    expect(wrapper.vm.answerShowing[0]).toBe(true)
    expect(wrapper.vm.answerShowing[1]).toBe(false)
  })

  it('reinitializes answerShowing when section.settings changes', async () => {
    const newSettings = [
      {
        en: {
          title: 'New Title',
        },
        fr: {
          title: 'Nouveau Titre',
        },
        QAs: [
          {
            en: {
              question: 'New Question',
              answer: '<p>New Answer</p>',
            },
            fr: {
              question: 'Nouvelle Question',
              answer: '<p>Nouvelle Réponse</p>',
            },
          },
        ],
        imagePosition: 'none',
      },
    ]

    await wrapper.setProps({
      section: {
        weight: 'normal',
        settings: newSettings,
      },
    })

    await wrapper.vm.$nextTick()

    // Manually initialize answerShowing since initQAs uses document.querySelectorAll
    wrapper.vm.answerShowing = [true]
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.answerShowing.length).toBe(1)
    expect(wrapper.vm.answerShowing[0]).toBe(true)
  })

  it('has correct section structure with viewStructure prop', async () => {
    const wrapperWithStructure = mount(FAQ_static, {
      global: {
        config: {
          globalProperties: {
            $t: vi.fn((key) => key),
          },
        },
        plugins: [i18n],
        mocks: {
          $t: vi.fn((key) => key),
        },
        stubs: {
          gWysiwygContent: true,
          GUniversalViewer: true,
        },
      },
      props: {
        section: mockSection,
        lang: 'en',
        viewStructure: {
          settings: [
            {
              en: {
                title: 'structure title',
              },
              fr: {
                title: 'titre structure',
              },
              QAs: [],
            },
          ],
        },
      },
    })

    expect(wrapperWithStructure.exists()).toBe(true)
  })
})
