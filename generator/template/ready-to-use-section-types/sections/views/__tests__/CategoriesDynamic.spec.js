import { shallowMount } from "@vue/test-utils";
import CategoriesDynamic from "../categories_dynamic.vue";

describe('totalPages computed property', () => {

  const factory = (propsData = {}, routePath = '') => {
    return shallowMount(CategoriesDynamic, {
      mocks: {
        ...global.mocks,
        updateQueryStringValue: jest.fn(),
        $store: {
          commit: jest.fn()
        }
      }
    });
  };

  it('emits refresh-section without sort key in qs', async () => {
    const wrapper = factory({});

    jest.mock('@/utils/constants', () => ({
      updateQueryStringValue: jest.fn()
    }))

    const item = { original_title: 'Test Category' }

    await wrapper.vm.categoryClicked(item)

    // Find emitted events
    const emitted = wrapper.emitted('refresh-section')
    expect(emitted).toBeTruthy()
    expect(emitted.length).toBe(1)

    const eventPayload = emitted[0][0] // First call, first argument

    expect(eventPayload).toHaveProperty('qs')
    expect(eventPayload.qs).toHaveProperty('categories_titles')
    expect(Array.isArray(eventPayload.qs.categories_titles)).toBe(true)
    expect(eventPayload.qs.categories_titles).toContain('Test Category')

    // This is the key part: make sure 'sort' is NOT in qs
    expect(eventPayload.qs.sort).toBeUndefined()
  })

});
