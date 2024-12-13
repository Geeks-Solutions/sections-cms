import { shallowMount } from '@vue/test-utils';
import ListPagination from '../ListPagination.vue';

describe('ListPagination.vue', () => {
    it('does not render when totalPages is 1', () => {
        const wrapper = shallowMount(ListPagination, {
            mocks: global.mocks,
            propsData: {
                totalPages: 1,
                currentPage: 1,
            },
        });

        // Check that the wrapper is empty
        expect(wrapper.html()).toBe('');
    });

    it('renders when totalPages is greater than 1', () => {
        const wrapper = shallowMount(ListPagination, {
            mocks: global.mocks,
            propsData: {
                totalPages: 2,
                currentPage: 1,
            },
        });

        // Check that the wrapper contains the expected content
        expect(wrapper.find('.flex').exists()).toBe(true);
    });
});