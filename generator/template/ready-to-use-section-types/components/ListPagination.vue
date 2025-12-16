<template>
  <div
    v-if="totalPages > 1"
    class="flex flex-row w-full border-t border-Gray_200 justify-between py-3 px-2 xs:px-6 pagination-wrapper"
  >
    <div
      class="flex flex-row items-center button-selector gap-2 py-2 md:py-2.5 px-3.5 md:px-4"
      :class="currentPage > 1 ? 'md:cursor-pointer' : ''"
      @click="currentPage > 1 ? $emit('page-changed', currentPage - 1) : null"
    >
      <div class="w-14px h-auto previous">
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.6666 6H1.33325M1.33325 6L6.33325 11M1.33325 6L6.33325 1"
            stroke="currentColor"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div>
        {{ $t('blogs.previous') }}
      </div>
    </div>

    <div class="flex justify-center items-center gap-0.5 mobileHidden">
      <div
        v-for="(page, index) in computedPages"
        :key="`pagination-${page}-${index}`"
        :class="{
          'bg-white text-Gray_800 page-number-selected': currentPage === page,
          'text-Gray_600 cursor-pointer page-number': currentPage !== page,
        }"
        class="pagination w-[25px] xs:w-[40px] h-[25px] xs:h-[40px] text-center content-center rounded-full"
        @click="page !== '...' ? $emit('page-changed', page) : null"
      >
        {{ page }}
      </div>
    </div>

    <div class="flex justify-center items-center gap-0.5 md:hidden">
      <div
        v-for="(page, index) in computedPagesMobile"
        :key="`pagination-${page}-${index}`"
        :class="{
          'bg-Gray_50 text-Gray_800 page-number-selected': currentPage === page,
          'text-Gray_600 page-number': currentPage !== page,
        }"
        class="pagination-m w-[25px] xs:w-[40px] h-[25px] xs:h-[40px] text-center content-center"
        @click="page !== '...' ? $emit('page-changed', page) : null"
      >
        {{ page }}
      </div>
    </div>

    <div
      class="flex flex-row items-center button-selector gap-2 py-2 md:py-2.5 px-3.5 md:px-4"
      :class="currentPage < totalPages ? 'md:cursor-pointer' : ''"
      @click="
        currentPage < totalPages ? $emit('page-changed', currentPage + 1) : null
      "
    >
      <div>
        {{ $t('blogs.next') }}
      </div>
      <div class="w-14px h-auto next">
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.3335 6H14.6668M14.6668 6L9.66683 1M14.6668 6L9.66683 11"
            stroke="currentColor"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<i18n src="../sections/forms/Blogs_i18n.json"></i18n>

<script>
import { importAsset } from '~/utils/constants.js'

export default {
  name: 'ListPagination',
  setup() {
    const { t } = useI18n({
      useScope: 'local',
    })

    return {
      $t: t,
    }
  },
  methods: { importAsset },
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    totalPages: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    computedPages() {
      const pages = []
      if (this.totalPages <= 6) {
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i)
        }
      } else if (this.currentPage <= this.totalPages - 6) {
        pages.push(
          this.currentPage,
          this.currentPage + 1,
          this.currentPage + 2,
          '...',
          this.totalPages - 2,
          this.totalPages - 1,
          this.totalPages,
        )
      } else {
        pages.push(
          this.totalPages - 5,
          this.totalPages - 4,
          this.totalPages - 3,
          this.totalPages - 2,
          this.totalPages - 1,
          this.totalPages,
        )
      }
      return pages
    },
    computedPagesMobile() {
      const pages = []
      if (this.totalPages <= 3) {
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i)
        }
      } else if (this.currentPage !== this.totalPages) {
        pages.push(this.currentPage, '...', this.totalPages)
      } else {
        pages.push(1, '...', this.totalPages)
      }
      return pages
    },
  },
}
</script>

<style>
.pagination-wrapper .next,
.pagination-wrapper .previous {
  color: #344054;
}
@media screen and (max-width: 768px) {
  .mobileHidden {
    display: none !important;
  }
}
</style>
