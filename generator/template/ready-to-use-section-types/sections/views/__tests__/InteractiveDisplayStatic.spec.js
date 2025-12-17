import { shallowMount } from '@vue/test-utils'
import InteractiveDisplayStatic from '../InteractiveDisplay_static.vue'

// vi.mock('~/components/GlobalLink.vue', () => ({
//   name: 'GlobalLink',
//   render: () => {} // mock render function
// }))

describe('InteractiveDisplayStatic.vue', () => {
  let wrapper

  const mockSection = {
    settings: [
      {
        title: { en: 'Title', fr: 'Titre' },
        text: { en: 'Some text', fr: 'Du texte' },
        cta: { en: 'Click me', fr: 'Cliquez moi' },
        ctaLink: { en: 'https://link.com', fr: 'https://lien.com' },
        videoLink: '',
        media: 'image',
        mediaMobile: 'image',
      },
    ],
  }

  beforeEach(() => {
    wrapper = shallowMount(InteractiveDisplayStatic, {
      propsData: {
        section: mockSection,
        lang: 'en',
      },
    })
  })

  it('renders <global-link> when cta exists in block', () => {
    const block = wrapper.vm.migratedSettings[0]
    block.cta = { en: 'Click me' }

    wrapper.vm.$forceUpdate()

    const globalLink = wrapper.findComponent({ name: 'GlobalLink' })

    expect(globalLink.exists()).toBe(true)
  })

  it('does not render <global-link> when cta does not exist in block', async () => {
    const block = wrapper.vm.migratedSettings[0]
    block.cta = { en: '' }

    await wrapper.vm.$nextTick()

    const globalLink = wrapper.findComponent({ name: 'GlobalLink' })

    expect(globalLink.exists()).toBe(false)
  })

  it('renders <global-link> based on video cta in settings', async () => {
    const settings = wrapper.vm.settings
    settings[0].videoCta = { en: 'Watch now' }
    settings[0].videoTitle = { en: 'title' }
    settings[0].videoText = { en: 'desc' }
    settings[0].videoLink = 'Link'

    await wrapper.vm.$nextTick()

    const globalLink = wrapper.findComponent({ name: 'GlobalLink' })

    expect(globalLink.exists()).toBe(true)
  })

  it('does not render <global-link> when video cta does not exist in settings', async () => {
    await vi.resetAllMocks()
    const settings = wrapper.vm.settings
    settings[0].videoTitle = { en: 'title' }
    settings[0].videoText = { en: 'desc' }
    settings[0].videoLink = ''
    settings[0].videoCta = { en: '' }

    await wrapper.vm.$nextTick()

    const globalLink = wrapper.findComponent({ name: 'GlobalLink' })

    expect(globalLink.exists()).toBe(false)
  })
})
