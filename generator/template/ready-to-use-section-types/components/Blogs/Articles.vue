<template>
  <div v-if="sectionRenderData && sectionRenderData.articles && sectionRenderData.articles.length > 0" class="articles flex flex-col w-full items-center justify-center px-5 md:px-20 py-2 gap-9" :class="listTypeStyle.bg">
    <div v-if="title || description" class="flex flex-col items-center gap-2 main-content-wrapper">
      <h2 v-if="title && title[lang]">
        <gWysiwygContent tag="span" :classes="`html-content title p-0`" :html-content="title[lang]" />
      </h2>
      <p v-if="description && description[lang]">
        <gWysiwygContent tag="span" :classes="`html-content desc p-0`" :html-content="description[lang]" />
      </p>
    </div>
    <div v-if="sectionRenderData && sectionRenderData.articles"
         class="articles-wrapper"
         :class="[listTypeStyle.listStyle, {'md:justify-center': sectionRenderData.articles.length <= 3}]">
      <div v-for="(object, idx) in sectionRenderData.articles" :key="`article-${object.id}-${idx}`" class="flex flex-col card-wrapper" :class="{'flex-1': listType === 'carousel'}">
        <nuxt-link :to="localePath(sectionRenderSettings && sectionRenderSettings.article_page_path ? sectionRenderSettings.article_page_path.startsWith('/') ? `${sectionRenderSettings.article_page_path}/${object.path}` : `/${sectionRenderSettings.article_page_path}/${object.path}` : object.path ? `/${object.path}` : '')" class="w-full h-full">
          <div class="flex flex-col gap-6 h-full py-5 px-4 wrapper">
            <div class="flex" :class="listTypeStyle.image">
              <div v-if="object.medias && object.medias.length > 0" class="flex w-full self-start min-h-[300px] max-h-[300px]">
                <img :src="object.medias[0].files[0].thumbnail_url" :alt="object.medias[0].seo_tag" class="object-cover w-full" />
              </div>
              <div v-else class="animate-pulse w-full md:w-352px">
              </div>
            </div>
            <div class="flex flex-col gap-4 justify-between h-full article-content-wrapper">
              <div class="flex flex-col gap-4">
                <h2 class="overflow-hidden title" :class="listTypeStyle.title">
                  {{ object.title }}
                </h2>
                <gWysiwygContent tag="h4" :classes="`overflow-hidden desc p-0 ${listTypeStyle.title}`" :html-content="object.description" />
              </div>
              <nuxt-link :to="localePath(sectionRenderSettings && sectionRenderSettings.article_page_path ? sectionRenderSettings.article_page_path.startsWith('/') ? `${sectionRenderSettings.article_page_path}/${object.path}` : `/${sectionRenderSettings.article_page_path}/${object.path}` : object.path ? `/${object.path}` : '')" class="w-full">
                <div class="flex flex-row w-full gap-2">
                  <div class="button-selector">
                    {{ $t('blogs.readPost') }}
                  </div>
                </div>
              </nuxt-link>
            </div>
          </div>
        </nuxt-link>
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
            image: 'h-full',
            title: 'w-266px',
            bg: 'bg'
          }
        case 'listing':
          return {
            listStyle: 'grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8',
            image: '',
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
    let blogsListSize = BLOGS_LIST_SIZE
    if (this.sectionRenderSettings && this.sectionRenderSettings.default_limit) {
      blogsListSize = this.sectionRenderSettings.default_limit
    }
    if (extractQsValue('limit_ca', this.$route.path)) {
      blogsListSize = extractQsValue('limit_ca', this.$route.path)
    }
    this.currentPage = Math.floor(extractQsValue('offset_ca') / blogsListSize) + 1
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
        let blogsListSize = BLOGS_LIST_SIZE
        if (this.sectionRenderSettings && this.sectionRenderSettings.default_limit) {
          blogsListSize = this.sectionRenderSettings.default_limit
        }
        if (extractQsValue('limit_ca', this.$route.path)) {
          blogsListSize = extractQsValue('limit_ca', this.$route.path)
        }
        const offset = (page - 1) * blogsListSize
        this.$emit('page-changed', offset)
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
.article-content-wrapper .title {
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 2;
}
.article-content-wrapper .desc {
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  height: auto;
}
</style>
