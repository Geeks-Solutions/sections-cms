<template>
  <div v-if="totalPages > 1" class="flex flex-row w-full border-t border-Gray_200 justify-between py-3 px-2 xs:px-6">

    <div class="flex flex-row items-center button-selector gap-2 py-2 md:py-2.5 px-3.5 md:px-4" :class="currentPage > 1 ? 'md:cursor-pointer' : ''" @click="currentPage > 1 ? $emit('page-changed', currentPage - 1) : null">
      <img src="@/assets/icons/previous.svg" alt="previous" class="w-14px h-auto" />
      <div>
        {{ $t('blogs.previous') }}
      </div>
    </div>

    <div class="flex justify-center items-center gap-0.5 mobileHidden">
      <div
          v-for="(page, index) in computedPages"
          :key="`pagination-${page}-${index}`"
          :class="{
        'bg-white text-Gray_800': currentPage === page,
        'text-Gray_600 cursor-pointer': currentPage !== page
      }"
          class="pagination w-25px xs:w-40px h-25px xs:h-40px text-center content-center rounded-full"
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
        'bg-Gray_50 text-Gray_800': currentPage === page,
        'text-Gray_600': currentPage !== page
      }"
          class="pagination-m w-25px xs:w-40px h-25px xs:h-40px text-center content-center"
          @click="page !== '...' ? $emit('page-changed', page) : null"
      >
        {{ page }}
      </div>
    </div>

    <div class="flex flex-row items-center button-selector gap-2 py-2 md:py-2.5 px-3.5 md:px-4" :class="currentPage < totalPages ? 'md:cursor-pointer' : ''" @click="currentPage < totalPages ? $emit('page-changed', currentPage + 1) : null">
      <div>
        {{ $t('blogs.next') }}
      </div>
      <img src="@/assets/icons/next.svg" alt="next" class="w-14px h-auto" />
    </div>

  </div>
</template>

<script>
export default {
  name: "ListPagination",
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    totalPages: {
      type: Number,
      default: 1
    }
  },
  computed: {
    computedPages() {
      const pages = [];
      if (this.totalPages <= 6) {
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else if (this.currentPage <= this.totalPages - 6) {
        pages.push(this.currentPage, this.currentPage + 1, this.currentPage + 2, '...', this.totalPages - 2, this.totalPages - 1, this.totalPages);
      } else {
        pages.push(this.totalPages - 5, this.totalPages - 4, this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, this.totalPages);
      }
      return pages;
    },
    computedPagesMobile() {
      const pages = [];
      if (this.totalPages <= 3) {
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else if (this.currentPage !== this.totalPages) {
        pages.push(this.currentPage, '...', this.totalPages);
      } else {
        pages.push(1, '...', this.totalPages);
      }
      return pages;
    }
  }
}
</script>
