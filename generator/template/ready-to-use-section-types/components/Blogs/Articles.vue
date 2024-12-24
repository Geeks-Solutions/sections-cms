<template>
  <div class="articles flex flex-col w-full items-center justify-center px-5 md:px-20 py-14 md:py-24 gap-9" :class="listTypeStyle.bg">
    <div v-if="title || description" class="flex flex-col items-center gap-2">
      <h2 v-if="title" v-html="title"></h2>
      <p v-if="description" v-html="description"></p>
    </div>
    <div v-if="sectionRenderData && sectionRenderData.articles"
         :class="[listTypeStyle.listStyle, {'md:justify-center': sectionRenderData.articles.length <= 3}]">
      <div v-for="(object, idx) in sectionRenderData.articles" :key="`article-${object.id}-${idx}`" class="flex flex-col gap-6 justify-between py-5 px-4 wrapper">
        <div class="flex" :class="listTypeStyle.image">
          <div v-if="object.medias && object.medias.length > 0" class="w-full self-center">
            <img :src="object.medias[0].files[0].thumbnail_url" :alt="object.medias[0].seo_tag" class="object-contain w-full md:w-352px h-auto max-h-[300px] object-left" />
          </div>
          <div v-else class="animate-pulse w-full md:w-352px">
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <h2 class="max-h-[56px] overflow-hidden" :class="listTypeStyle.title">
            {{ object.title }}
          </h2>
          <nuxt-link :to="sectionRenderSettings && sectionRenderSettings.article_page_path ? sectionRenderSettings.article_page_path.startsWith('/') ? `${sectionRenderSettings.article_page_path}/${object.path}` : `/${sectionRenderSettings.article_page_path}/${object.path}` : object.path ? `/${object.path}` : ''" class="w-full">
            <div class="flex flex-row w-full gap-2">
              <div class="button-selector">
                {{ $t('blogs.readPost') }}
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div v-if="listType === 'carousel'" class="flex flex-row justify-center w-full">
      <NuxtLink :to="localePath(sectionRenderSettings ? sectionRenderSettings.cta_link : BLOGS_SECTION_PAGE_PATH)">
        <div v-if="sectionRenderSettings && sectionRenderSettings.cta_label" class="button-selector">
		  {{ sectionRenderSettings && sectionRenderSettings.cta_label ? sectionRenderSettings.cta_label[lang] : '' }}
		</div>
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
            bg: 'bg'
          }
        case 'listing':
          return {
            listStyle: 'grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8',
            image: 'h-300px',
            title: '',
            bg: 'bg'
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
