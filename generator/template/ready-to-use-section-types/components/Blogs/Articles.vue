<template>
  <div class="flex flex-col w-full items-center justify-center px-5 md:px-20 py-14 md:py-24 gap-9" :class="listTypeStyle.bg">
    <div v-if="title || description" class="flex flex-col items-center gap-2">
      <div v-if="title" class="text-3xl md:text-4xl font-bold text-Gray_800">{{ title }}</div>
      <div v-if="description" class="text-xs xs:text-base md:text-xl text-Gray_800">{{ description }}</div>
    </div>
    <div v-if="sectionRenderData && sectionRenderData.articles"
         :class="[listTypeStyle.listStyle, {'md:justify-center': sectionRenderData.articles.length <= 3}]">
      <div v-for="object in sectionRenderData.articles" :key="object.id" class="flex flex-col gap-6 justify-between py-5 px-4 bg-white rounded-2xl hover:border hover:border-black hover:shadow">
        <div class="flex" :class="listTypeStyle.image">
          <div v-if="object.medias && object.medias.length > 0" class="w-full">
            <img :src="object.medias[0].files[0].thumbnail_url" :alt="object.medias[0].seo_tag" class="object-cover w-full md:w-352px h-full rounded-lg" />
          </div>
          <div v-else class="bg-BgGrey animate-pulse w-full md:w-352px rounded-lg">
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <div class="text-lg font-bold text-Gray_900 max-h-[56px] overflow-hidden" :class="listTypeStyle.title">
            {{ object.title }}
          </div>
          <nuxt-link :to="sectionRenderSettings && sectionRenderSettings.article_page_path ? sectionRenderSettings.article_page_path.startsWith('/') ? `${sectionRenderSettings.article_page_path}/${object.path}` : `/${sectionRenderSettings.article_page_path}/${object.path}` : object.path ? `/${object.path}` : ''" class="w-full">
            <div class="flex flex-row w-full gap-2">
              <div class="text-sm text-Primary_Color_700 font-semibold">
                {{ $t('Read post') }}
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div v-if="listType === 'carousel'" class="flex flex-row justify-center w-full">
      <NuxtLink :to="localePath(sectionRenderSettings ? sectionRenderSettings.cta_link : BLOGS_SECTION_PAGE_PATH)">
        <Button v-if="sectionRenderSettings && sectionRenderSettings.cta_label" :label="sectionRenderSettings && sectionRenderSettings.cta_label ? sectionRenderSettings.cta_label[lang] : ''" type="primary" size="xl" />
      </NuxtLink>
    </div>
    <div v-else-if="listType === 'listing'" class="w-full">
      <ListPagination :current-page="currentPage" :total-pages="totalPages" @page-changed="(page) => pageChanged(page)" />
    </div>
  </div>
</template>

<script>

import {BLOGS_LIST_SIZE, BLOGS_SECTION_PAGE_PATH,extractQsValue} from "@/utils/constants";


export default {
  name: 'Articles',
  props: {
    sectionRenderData: {
      type: Object,
      default: () => {},
    },
    sectionRenderSettings: {
      type: Object,
      default: () => {},
    },
    lang: {
      type: String,
      default: "en"
    },
    listType: {
      type: String,
      default: "carousel"
    },
    title: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    totalPages: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      currentPage: 1,
      BLOGS_SECTION_PAGE_PATH
    }
  },
  computed: {
    listTypeStyle() {
      switch (this.listType) {
        case 'carousel':
          return {
            listStyle: 'flex flex-row gap-4 md:px-2 pb-2 w-full overflow-x-auto',
            image: 'w-266px h-300px',
            title: 'w-266px',
            bg: 'bg-BgGrey'
          }
        case 'listing':
          return {
            listStyle: 'grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8',
            image: 'h-300px',
            title: '',
            bg: 'bg-Gray_50'
          }
        default:
          return {

          }
      }
    }
  },
  mounted() {
    this.currentPage = Math.floor(extractQsValue('offset_ca') / BLOGS_LIST_SIZE) + 1
    if (this.$nuxt) {
      this.$nuxt.$on('sectionViewRefreshed', () => {
        this.$nuxt.$emit('initLoading', false)
      })
      this.$nuxt.$on('clearOffset', () => {
        this.currentPage = 1
      })
    }
  },
  methods: {
    pageChanged(page) {
      if (page !== this.currentPage) {
        this.$nuxt.$emit('initLoading', true)
        this.currentPage = page
      }
    }
  }
};
</script>

<style>
.selective_articles {
  .view-component {
    overflow: hidden;
  }
}
</style>
