import { shallowMount } from "@vue/test-utils";
import Redirection from "../Redirection.vue";

describe('Redirection', () => {
  let wrapper;
  const defaultProps = {

  };
  const defaultData = {

  };

  beforeEach(() => {
    wrapper = shallowMount(Redirection, {
      mocks: global.mocks,
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

    wrapper.vm.settings = [
      {
        en: {
          message: '',
          redirectionUrl: 'url'
        },
        fr: {
          message: '',
          redirectionUrl: ''
        },
        timeToRedirect: '123'
      }
    ]

    wrapper.vm.settings[0].en.message = `<img src='${media.url}' media-id='${media.media_id}' />`

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

  it('removes unused media objects', () => {
    const media1 = { media_id: '11111', url: 'https://example.com/media1.jpg' };
    // const media2 = { media_id: '22222', url: 'https://example.com/media2.jpg' };

    wrapper.vm.settings = [
      {
        en: {
          message: '',
          redirectionUrl: ''
        },
        fr: {
          message: '',
          redirectionUrl: ''
        },
        timeToRedirect: ''
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
        en: {
          message: '',
          redirectionUrl: ''
        },
        fr: {
          message: `<img src='${media.url}' media-id='${media.media_id}' />`,
          redirectionUrl: ''
        },
        timeToRedirect: ''
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
