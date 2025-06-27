import { shallowMount } from "@vue/test-utils";
import TextImage from "../TextImage.vue";
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {},
    fr: {}
  }
})

describe('TextImage', () => {
  let wrapper;
  const defaultProps = {

  };
  const defaultData = {

  };

  beforeEach(() => {
    wrapper = shallowMount(TextImage, {
      global: {
        config: {
          globalProperties: {
            $t: vi.fn()
          }
        },
        plugins: [i18n]
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

  it('validates WYSIWYG media presence in settings', () => {
    const media = { media_id: '67890', url: 'https://example.com/image.jpg' };
    wrapper.vm.settings[0].title.en = `<img src='${media.url}' media-id='${media.media_id}' />`
    wrapper.vm.settings[0].text.en = `<img src='${media.url}' media-id='${media.media_id}' />`

    wrapper.vm.wysiwygMediaAdded(media);

    expect(wrapper.vm.validate()).toBe(true);
  });

  it('removes media if not found in any settings object', () => {
    const media = { media_id: '99999', url: 'https://example.com/image.png' };
    wrapper.vm.wysiwygMediaAdded(media);
    expect(wrapper.vm.settings.some(obj => obj.wysiwygMedia?.media_id === '99999')).toBe(true);

    wrapper.vm.validate();
    expect(wrapper.vm.settings.some(obj => obj.wysiwygMedia?.media_id === '99999')).toBe(false);
  });

  it('fails validation if title is missing', () => {
    wrapper.vm.settings[0].title.en = '';
    expect(wrapper.vm.validate()).toBe(false);
    expect(wrapper.vm.errors.title).toBe(true);
  });

  it('passes validation if title and text are present', () => {
    wrapper.vm.settings[0].title.en = 'Valid Title';
    wrapper.vm.settings[0].text.en = 'Valid Text';
    expect(wrapper.vm.validate()).toBe(true);
    expect(wrapper.vm.errors.title).toBe(false);
    expect(wrapper.vm.errors.text).toBe(false);
  })

  it('removes unused media objects', () => {
    const media1 = { media_id: '11111', url: 'https://example.com/media1.jpg' };
    // const media2 = { media_id: '22222', url: 'https://example.com/media2.jpg' };

    wrapper.vm.settings = [
      {
        title: {
          en: '',
          fr: ''
        },
        text: {
          en: '',
          fr: ''
        },
        media: {
          media_id: "",
          url: "",
          seo_tag: ""
        },
        imagePosition: "none"
      }
    ]

    wrapper.vm.wysiwygMediaAdded(media1);

    wrapper.setProps({
      selectedLang: 'fr'
    });
    wrapper.vm.wysiwygMediaAdded(media1);

    wrapper.vm.validate();
    expect(wrapper.vm.settings.some(obj => obj.wysiwygMedia?.media_id === '22222')).toBe(false);
  });

  it('keeps media if found in any settings object', () => {
    const media = { media_id: '33333', url: 'https://example.com/media3.jpg' };

    wrapper.vm.settings = [
      {
        title: {
          en: '',
          fr: `<img src='${media.url}' media-id='${media.media_id}' />`
        },
        text: {
          en: '',
          fr: ''
        },
        media: {
          media_id: "",
          url: "",
          seo_tag: ""
        },
        imagePosition: "none"
      }
    ]

    wrapper.setProps({
      selectedLang: 'fr'
    });
    wrapper.vm.wysiwygMediaAdded(media);

    wrapper.vm.validate();
    expect(wrapper.vm.settings.some(obj => obj.wysiwygMedia?.media_id === '33333')).toBe(true);
  });

});
