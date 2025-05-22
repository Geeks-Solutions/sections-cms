import { shallowMount } from "@vue/test-utils";
import FAQ from "../FAQ.vue";

describe('FAQ', () => {
  let wrapper;
  const defaultProps = {

  };
  const defaultData = {

  };

  beforeEach(() => {
    wrapper = shallowMount(FAQ, {
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

  it('validates WYSIWYG media presence in QAs', () => {
    const media = { media_id: '67890', url: 'https://example.com/image.jpg' };
    wrapper.vm.settings[0].en.title = 'Title'
    wrapper.vm.settings[0].QAs.push({
      en: { question: 'Test question', answer: `<img src='${media.url}' media-id='${media.media_id}' />` },
      fr: { question: 'Question test', answer: '' }
    });
    wrapper.vm.wysiwygMediaAdded(media);

    expect(wrapper.vm.validate()).toBe(true);
  });

  it('removes media if not found in any QA answers', () => {
    const media = { media_id: '99999', url: 'https://example.com/image.png' };
    wrapper.vm.wysiwygMediaAdded(media);
    expect(wrapper.vm.settings.some(obj => obj.wysiwygMedia?.media_id === '99999')).toBe(true);

    wrapper.vm.validate();
    expect(wrapper.vm.settings.some(obj => obj.wysiwygMedia?.media_id === '99999')).toBe(false);
  });

  it('fails validation if title is missing', () => {
    wrapper.vm.settings[0].en.title = '';
    expect(wrapper.vm.validate()).toBe(false);
    expect(wrapper.vm.errors.title).toBe(true);
  });

  it('passes validation if title is present', () => {
    wrapper.vm.settings[0].en.title = 'Valid Title';
    expect(wrapper.vm.validate()).toBe(true);
    expect(wrapper.vm.errors.title).toBe(false);
  });

  it('removes unused media objects', () => {
    const media1 = { media_id: '11111', url: 'https://example.com/media1.jpg' };
    const media2 = { media_id: '22222', url: 'https://example.com/media2.jpg' };

    wrapper.vm.wysiwygMediaAdded(media1);

    wrapper.setProps({
      selectedLang: 'fr'
    });
    wrapper.vm.wysiwygMediaAdded(media2);

    wrapper.vm.settings[0].QAs.push({
      en: { question: 'Some question', answer: `<img src='${media1.url}' data-media-id='${media1.media_id}' />` },
      fr: { question: '', answer: '' }
    });

    wrapper.vm.validate();
    expect(wrapper.vm.settings.some(obj => obj.wysiwygMedia?.media_id === '22222')).toBe(false);
  });

  it('keeps media if found in any QA answer', () => {
    const media = { media_id: '33333', url: 'https://example.com/media3.jpg' };
    wrapper.vm.wysiwygMediaAdded(media);
    wrapper.vm.settings[0].QAs.push({
      en: { question: 'Another question', answer: `<img src='${media.url}' data-media-id='${media.media_id}' />` },
      fr: { question: '', answer: '' }
    });

    wrapper.vm.validate();
    expect(wrapper.vm.settings.some(obj => obj.wysiwygMedia?.media_id === '33333')).toBe(true);
  });

});
