import { shallowMount } from "@vue/test-utils";
import CategoriesArticlesConfigurable from "../categories_articles_configurable.vue";
import { extractQsValue } from '../../../utils/constants'

jest.mock('@/utils/constants', () => ({
  extractQsValue: jest.fn(),
  BLOGS_LIST_SIZE: 40
}));

describe('totalPages computed property', () => {

  const factory = (propsData = {}, routePath = '') => {
    return shallowMount(CategoriesArticlesConfigurable, {
      mocks: {
        ...global.mocks,
        $route: { path: routePath }
      },
      data() {
        return {
          sectionRenderSettings: propsData.sectionRenderSettings || null,
          sectionRenderData: propsData.sectionRenderData || null,
          BLOGS_SECTION_PAGE_PATH: '/blogs'
        };
      }
    });
  };

  it('should default to BLOGS_LIST_SIZE when no conditions are met', () => {
    extractQsValue.mockReturnValue(null);
    const wrapper = factory({
      sectionRenderSettings: { default_limit: "" },
      sectionRenderData: { total: 80, articles: [{}] }
    });
    expect(wrapper.vm.totalPages).toBe(2);
  });

  it('should use sectionRenderSettings.default_limit if available ', () => {
    extractQsValue.mockReturnValue(null);
    const wrapper = factory({ sectionRenderSettings: { default_limit: 5 } });
    expect(wrapper.vm.totalPages).toBe(1);
  });

  it('should use query string value if present', async () => {
    await jest.resetAllMocks()
    extractQsValue.mockReturnValue(40);
    const wrapper = factory({
      sectionRenderSettings: { default_limit: "" },
      sectionRenderData: { total: 80, articles: [{}] }
    }, '/limit_ca=40');
    expect(wrapper.vm.totalPages).toBe(2);
  });

  it('should compute the correct totalPages based on sectionRenderData', () => {
    extractQsValue.mockReturnValue(null);
    const wrapper = factory({
      sectionRenderSettings: { default_limit: 5 },
      sectionRenderData: { total: 50, articles: [{}] }
    });
    expect(wrapper.vm.totalPages).toBe(10);
  });
});
