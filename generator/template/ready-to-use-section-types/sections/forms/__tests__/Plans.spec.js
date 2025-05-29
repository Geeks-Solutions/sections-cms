import { shallowMount } from "@vue/test-utils";
import Plans from "../Plans.vue";

describe('Plans', () => {
  let wrapper;
  const defaultProps = {

  };
  const defaultData = {

  };

  beforeEach(() => {
    wrapper = shallowMount(Plans, {
      global: {
        config: {
          globalProperties: {
            $t: vi.fn()
          }
        }
      },
      data() {
        return defaultData
      },
      propsData: defaultProps
    });
  });

  it('adds WYSIWYG media correctly in settings', () => {
    const media = { media_id: '12345', url: 'https://example.com/image.jpg' };
    wrapper.vm.wysiwygMediaAdded(media);

    expect(wrapper.vm.settings).toContainEqual(
      expect.objectContaining({ wysiwygMedia: media, wysiwygLang: 'en' })
    );
  });

  it('validates WYSIWYG media presence in plans', () => {
    const media = { media_id: '67890', url: 'https://example.com/image.jpg' };
    wrapper.vm.settings[0].plans.push(
      {
        title: {
          en: `<img src='${media.url}' media-id='${media.media_id}' />`,
          fr: ''
        },
        description: {
          en: '',
          fr: ''
        },
        price: {
          en: '',
          fr: ''
        },
        currency: {
          en: '',
          fr: ''
        },
        frequency: {
          en: '',
          fr: ''
        },
        ctaLabel: {
          en: '',
          fr: ''
        },
        ctaLink: {
          en: '',
          fr: ''
        },
        ctaLinkTarget: '',
        features: {
          en: '',
          fr: ''
        },
        customFeatures: {
          en: '',
          fr: ''
        },
        mostPopular: false,
        media: {
          media_id: "",
          url: "",
          seo_tag: "",
          files: [
            {
              filename: "",
              url: ""
            }
          ]
        }
      });
    wrapper.vm.wysiwygMediaAdded(media);

    expect(wrapper.vm.validate()).toBe(true);
  });

  it('removes media if not found in any plans', () => {
    const media = { media_id: '99999', url: 'https://example.com/image.png' };
    wrapper.vm.wysiwygMediaAdded(media);
    expect(wrapper.vm.settings.some(obj => obj.wysiwygMedia?.media_id === '99999')).toBe(true);

    wrapper.vm.validate();
    expect(wrapper.vm.settings.some(obj => obj.wysiwygMedia?.media_id === '99999')).toBe(false);
  });

  it('removes unused media objects', () => {
    const media1 = { media_id: '11111', url: 'https://example.com/media1.jpg' };
    const media2 = { media_id: '22222', url: 'https://example.com/media2.jpg' };

    wrapper.vm.wysiwygMediaAdded(media1);

    wrapper.setProps({
      selectedLang: 'fr'
    });
    wrapper.vm.wysiwygMediaAdded(media2);

    wrapper.vm.settings[0].plans.push({
      title: {
        en: `<img src='${media1.url}' media-id='${media1.media_id}' />`,
        fr: ''
      },
      description: {
        en: '',
        fr: ''
      },
      price: {
        en: '',
        fr: ''
      },
      currency: {
        en: '',
        fr: ''
      },
      frequency: {
        en: '',
        fr: ''
      },
      ctaLabel: {
        en: '',
        fr: ''
      },
      ctaLink: {
        en: '',
        fr: ''
      },
      ctaLinkTarget: '',
      features: {
        en: '',
        fr: ''
      },
      customFeatures: {
        en: '',
        fr: ''
      },
      mostPopular: false,
      media: {
        media_id: "",
        url: "",
        seo_tag: "",
        files: [
          {
            filename: "",
            url: ""
          }
        ]
      }
    });

    wrapper.vm.validate();
    expect(wrapper.vm.settings.some(obj => obj.wysiwygMedia?.media_id === '22222')).toBe(false);
  });

  it('keeps media if found in any plans', () => {
    const media = { media_id: '33333', url: 'https://example.com/media3.jpg' };
    wrapper.vm.wysiwygMediaAdded(media);
    wrapper.vm.settings[0].plans.push({
      title: {
        en: '',
        fr: ''
      },
      description: {
        en: `<img src='${media.url}' media-id='${media.media_id}' />`,
        fr: ''
      },
      price: {
        en: '',
        fr: ''
      },
      currency: {
        en: '',
        fr: ''
      },
      frequency: {
        en: '',
        fr: ''
      },
      ctaLabel: {
        en: '',
        fr: ''
      },
      ctaLink: {
        en: '',
        fr: ''
      },
      ctaLinkTarget: '',
      features: {
        en: '',
        fr: ''
      },
      customFeatures: {
        en: '',
        fr: ''
      },
      mostPopular: false,
      media: {
        media_id: "",
        url: "",
        seo_tag: "",
        files: [
          {
            filename: "",
            url: ""
          }
        ]
      }
    });

    wrapper.vm.validate();
    expect(wrapper.vm.settings.some(obj => obj.wysiwygMedia?.media_id === '33333')).toBe(true);
  });

});
