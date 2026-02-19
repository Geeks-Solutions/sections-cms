import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import PlansStatic from '../Plans_static.vue'

vi.mock('@/utils/constants', () => ({
  default: {},
}))

describe('PlansStatic.vue', () => {
  const globalConfig = {
    stubs: {
      gWysiwygContent: { template: '<div><slot /></div>' },
      GUniversalViewer: { template: '<div></div>' },
      'global-link': { template: '<div><slot /></div>' },
    },
    config: {
      globalProperties: {
        $i18n: { locale: 'en' },
      },
    },
  }

  it('renders plans with correct data', () => {
    const wrapper = shallowMount(PlansStatic, {
      global: globalConfig,
      props: {
        section: {
          settings: [
            {
              title: { en: 'Our Plans', fr: 'Nos forfaits' },
              subTitle: {
                en: 'Choose the best plan for you',
                fr: 'Choisissez le meilleur forfait',
              },
              globalCtaLabel: { en: 'Get Started', fr: 'Commencer' },
              plans: [
                {
                  title: { en: 'Basic Plan', fr: 'Forfait de base' },
                  description: {
                    en: '<p>Perfect for beginners</p>',
                    fr: '<p>Parfait pour les débutants</p>',
                  },
                  classes: 'custom-class',
                  media: {
                    media_id: 'media123',
                    url: 'https://example.com/image.jpg',
                    seo_tag: 'Plan Image',
                    files: [{ url: 'https://example.com/image.jpg' }],
                  },
                  price: { en: '9.99', fr: '9.99' },
                  currency: { en: '$', fr: '$' },
                  frequency: { en: '/month', fr: '/mois' },
                  ctaLabel: { en: 'Sign Up', fr: "S'inscrire" },
                  ctaLink: { en: '/signup', fr: '/inscription' },
                  sectionsPage: { en: '/signup', fr: '/inscription' },
                  ctaLinkTarget: '_self',
                  features: {
                    en: 'Feature1-Feature2-Feature3',
                    fr: 'Fonctionnalité1-Fonctionnalité2-Fonctionnalité3',
                  },
                  customFeatures: {
                    en: 'Custom feature text',
                    fr: 'Texte de fonctionnalité personnalisé',
                  },
                  mostPopular: false,
                },
              ],
            },
          ],
        },
        lang: 'en',
        defaultLang: 'en',
      },
    })

    expect(wrapper.find('.plans').exists()).toBe(true)
    expect(wrapper.find('.plans-wrapper').exists()).toBe(true)
  })

  it('displays most popular badge when plan has mostPopular set to true', () => {
    const wrapper = shallowMount(PlansStatic, {
      global: globalConfig,
      props: {
        section: {
          settings: [
            {
              title: { en: 'Our Plans', fr: 'Nos forfaits' },
              subTitle: {
                en: 'Choose the best plan for you',
                fr: 'Choisissez le meilleur forfait',
              },
              globalCtaLabel: { en: 'Get Started', fr: 'Commencer' },
              plans: [
                {
                  title: { en: 'Premium Plan', fr: 'Forfait premium' },
                  description: {
                    en: '<p>Best value for money</p>',
                    fr: '<p>Meilleur rapport qualité-prix</p>',
                  },
                  classes: 'custom-class',
                  media: {
                    media_id: 'media456',
                    url: 'https://example.com/premium.jpg',
                    seo_tag: 'Premium Image',
                    files: [{ url: 'https://example.com/premium.jpg' }],
                  },
                  price: { en: '19.99', fr: '19.99' },
                  currency: { en: '$', fr: '$' },
                  frequency: { en: '/month', fr: '/mois' },
                  ctaLabel: { en: 'Sign Up', fr: "S'inscrire" },
                  ctaLink: { en: '/premium', fr: '/premium' },
                  sectionsPage: { en: '/premium', fr: '/premium' },
                  ctaLinkTarget: '_self',
                  features: {
                    en: 'Feature1-Feature2',
                    fr: 'Fonctionnalité1-Fonctionnalité2',
                  },
                  customFeatures: {
                    en: 'All premium features',
                    fr: 'Toutes les fonctionnalités premium',
                  },
                  mostPopular: true,
                },
              ],
            },
          ],
        },
        lang: 'en',
        defaultLang: 'en',
      },
    })

    const planBox = wrapper.find('.plansBox')
    expect(planBox.classes()).toContain('mostPopular')
  })

  it('hides plans without title in current language', () => {
    const wrapper = shallowMount(PlansStatic, {
      global: globalConfig,
      props: {
        section: {
          settings: [
            {
              title: { en: 'Our Plans', fr: 'Nos forfaits' },
              subTitle: {
                en: 'Choose the best plan for you',
                fr: 'Choisissez le meilleur forfait',
              },
              globalCtaLabel: { en: 'Get Started', fr: 'Commencer' },
              plans: [
                {
                  title: { en: 'English Only Plan', fr: '' },
                  description: {
                    en: '<p>Available in English only</p>',
                    fr: '',
                  },
                  classes: '',
                  media: {
                    media_id: 'media789',
                    url: 'https://example.com/english.jpg',
                    seo_tag: 'English Plan Image',
                    files: [{ url: 'https://example.com/english.jpg' }],
                  },
                  price: { en: '14.99', fr: '' },
                  currency: { en: '$', fr: '' },
                  frequency: { en: '/month', fr: '' },
                  ctaLabel: { en: 'Buy Now', fr: '' },
                  ctaLink: { en: '/buy', fr: '' },
                  sectionsPage: { en: '/buy', fr: '' },
                  ctaLinkTarget: '_blank',
                  features: { en: 'Feature A-Feature B', fr: '' },
                  customFeatures: { en: 'Special feature', fr: '' },
                  mostPopular: false,
                },
              ],
            },
          ],
        },
        lang: 'en',
        defaultLang: 'en',
      },
    })

    expect(wrapper.find('.plansBox').exists()).toBe(true)
  })

  it('displays features split by dash character', () => {
    const wrapper = shallowMount(PlansStatic, {
      global: globalConfig,
      props: {
        section: {
          settings: [
            {
              title: { en: 'Feature Plan', fr: 'Plan de fonctionnalité' },
              subTitle: {
                en: 'Features showcase',
                fr: 'Présentation des fonctionnalités',
              },
              globalCtaLabel: { en: 'Learn More', fr: 'En savoir plus' },
              plans: [
                {
                  title: {
                    en: 'Full Features',
                    fr: 'Fonctionnalités complètes',
                  },
                  description: {
                    en: '<p>All features included</p>',
                    fr: '<p>Toutes les fonctionnalités incluses</p>',
                  },
                  classes: '',
                  media: {
                    media_id: 'media000',
                    url: 'https://example.com/features.jpg',
                    seo_tag: 'Features Image',
                    files: [{ url: 'https://example.com/features.jpg' }],
                  },
                  price: { en: '29.99', fr: '29.99' },
                  currency: { en: '$', fr: '$' },
                  frequency: { en: '/month', fr: '/mois' },
                  ctaLabel: { en: 'Subscribe', fr: "S'abonner" },
                  ctaLink: { en: '/subscribe', fr: '/sabonner' },
                  sectionsPage: { en: '/subscribe', fr: '/sabonner' },
                  ctaLinkTarget: '_self',
                  features: {
                    en: 'Feature 1-Feature 2-Feature 3-Feature 4',
                    fr: 'Fonctionnalité 1-Fonctionnalité 2-Fonctionnalité 3-Fonctionnalité 4',
                  },
                  customFeatures: {
                    en: 'Bonus features included',
                    fr: 'Fonctionnalités bonus incluses',
                  },
                  mostPopular: false,
                },
              ],
            },
          ],
        },
        lang: 'en',
        defaultLang: 'en',
      },
    })

    const features = wrapper.findAll('.bp')
    expect(features.length).toBe(4)
  })
})
