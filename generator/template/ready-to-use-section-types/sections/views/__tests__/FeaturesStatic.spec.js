import { shallowMount } from '@vue/test-utils';
import FeaturesStatic from '../Features_static.vue';

describe('FeaturesStatic.vue', () => {
  it('ensures all blocks have the same height and width', async () => {
    const wrapper = shallowMount(FeaturesStatic, {
      propsData: {
        section: {
          settings: [
            {
              title: { en: 'Title 1', fr: 'Titre 1' },
              subtitle: { en: 'Subtitle 1', fr: 'Sous-titre 1' },
              text: { en: 'Text 1', fr: 'Texte 1' },
              media: { url: 'image1.jpg', seo_tag: 'Image 1' }
            },
            {
              title: { en: 'Title 2', fr: 'Titre 2' },
              subtitle: { en: 'Subtitle 2', fr: 'Sous-titre 2' },
              text: { en: '<p class="ql-align-center">Enable your users to easily administrate the</p><p class="ql-align-center">pages of their website with a drag and drop</p><p class="ql-align-center">interface (with the <a href="https://www.npmjs.com/package/@geeks.solutions/nuxt-sections" rel="noopener noreferrer" target="_blank" style="color: rgb(3, 177, 199);">nuxt-sections</a> open</p><p class="ql-align-center">source library)</p>', fr: 'Texte 2' },
              media: { url: 'image2.jpg', seo_tag: 'Image 2' }
            }
          ]
        },
        lang: 'en'
      }
    });

    await wrapper.vm.$nextTick();

    const blocks = wrapper.findAll('.image-main-wrapper');
    expect(blocks.length).toBe(2);

    const firstBlock = blocks.at(0).element;
    const secondBlock = blocks.at(1).element;

    expect(firstBlock.offsetHeight).toBe(secondBlock.offsetHeight);
    expect(firstBlock.offsetWidth).toBe(secondBlock.offsetWidth);
  });
});
