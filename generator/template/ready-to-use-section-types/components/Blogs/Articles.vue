<template>
  <div v-if="sectionRenderData && sectionRenderData.articles && sectionRenderData.articles.length === 1" class="article-preview-wrapper flex flex-col gap-9 py-2.5">
    <BlogsArticleTitleDescription :title="title" :description="description" :lang="lang" />
    <BlogsArticlePreview :path="sectionRenderSettings && sectionRenderSettings.article_page_path ? sectionRenderSettings.article_page_path.startsWith('/') ? `${sectionRenderSettings.article_page_path}/${sectionRenderData.articles[0].path}` : `/${sectionRenderSettings.article_page_path}/${sectionRenderData.articles[0].path}` : sectionRenderData.articles[0].path ? `/${sectionRenderData.articles[0].path}` : ''" :image="sectionRenderData.articles[0].medias && sectionRenderData.articles[0].medias[0] && sectionRenderData.articles[0].medias[0].files ? sectionRenderData.articles[0].medias[0].files[0].thumbnail_url : ''" :image-alt="sectionRenderData.articles[0].medias && sectionRenderData.articles[0].medias[0] && sectionRenderData.articles[0].medias[0].files ? sectionRenderData.articles[0].medias[0].files[0].seo_tag : ''" :title="sectionRenderData.articles[0].title" :content="sectionRenderData.articles[0].description" />
    <div v-if="listType === 'listing'" class="w-full">
      <ListPagination :current-page="currentPage" :total-pages="totalPages" @page-changed="(page) => pageChanged(page)" />
    </div>
  </div>
  <div v-else-if="sectionRenderData && sectionRenderData.articles && sectionRenderData.articles.length > 0" class="articles flex flex-col w-full items-center justify-center py-2.5 gap-9" :class="[listTypeStyle.bg, listType]">
    <BlogsArticleTitleDescription :title="title" :description="description" :lang="lang" />
    <div v-if="sectionRenderData && sectionRenderData.articles"
         v-dragscroll="isDragScrollEnabled"
         class="articles-wrapper"
         :class="[listTypeStyle.listStyle, {'md:justify-center': sectionRenderData.articles.length <= 3}]">
      <div v-for="(object, idx) in sectionRenderData.articles" :key="`article-${object.id}-${idx}`" class="flex flex-col card-wrapper" :draggable="!isDragScrollEnabled" :class="{'flex-1': listType === 'carousel'}">
        <nuxt-link :to="localePath(sectionRenderSettings && sectionRenderSettings.article_page_path ? sectionRenderSettings.article_page_path.startsWith('/') ? `${sectionRenderSettings.article_page_path}/${object.path}` : `/${sectionRenderSettings.article_page_path}/${object.path}` : object.path ? `/${object.path}` : '')" :draggable="!isDragScrollEnabled" class="w-full h-full">
          <div class="flex flex-col gap-6 h-full py-5 px-4 wrapper" :class="{'w-[300px]': listType === 'carousel' && sectionRenderData.articles.length > 3}" :draggable="!isDragScrollEnabled">
            <div class="flex" :class="listTypeStyle.image">
              <div v-if="object.medias && object.medias.length > 0" class="flex w-full self-start min-h-[300px] max-h-[300px]">
                <img :src="object.medias[0].files[0].thumbnail_url" :alt="object.medias[0].seo_tag" :draggable="!isDragScrollEnabled" class="object-cover w-full" />
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
              <BlogsArticleButton :path="sectionRenderSettings && sectionRenderSettings.article_page_path ? sectionRenderSettings.article_page_path.startsWith('/') ? `${sectionRenderSettings.article_page_path}/${object.path}` : `/${sectionRenderSettings.article_page_path}/${object.path}` : object.path ? `/${object.path}` : ''" />
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
    <div v-if="listType === 'carousel' && sectionRenderSettings && sectionRenderSettings.cta_label && sectionRenderSettings.cta_label[lang]" class="flex flex-row justify-center w-full">
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
      BLOGS_SECTION_PAGE_PATH,
      isDragScrollEnabled: false
    }
  },
  computed: {
    listTypeStyle() {
      switch (this.listType) {
        case 'carousel':
          return {
            listStyle: 'flex flex-row gap-4 md:px-2 pb-2 w-full overflow-x-auto',
            image: 'h-full',
            title: '',
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
    this.isDragScrollEnabled = this.$el && this.$el.clientWidth && this.$el.clientWidth > 768
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
@media screen and (max-width: 768px) {
  .suggested_articles .article-content-wrapper .title {
    width: 266px;
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

section .articles {
  container: articles / inline-size;
}

@container articles (max-width: 768px) {
  .articles .articles-wrapper {
    grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
  }

  .articles {
    padding-left: 1px !important;
    padding-right: 1rem !important;
  }

  .articles.carousel .articles-wrapper .card-wrapper .wrapper {
    width: 300px;
  }

  .articles.carousel .articles-wrapper {
    justify-content: start !important;
  }
}
</style>
