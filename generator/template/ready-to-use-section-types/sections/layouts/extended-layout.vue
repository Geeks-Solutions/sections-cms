<template>
  <div>
    <div>
      <slot name="region1" class="region1"></slot>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 region2-wrapper">
      <div class="region21-wrapper">
        <slot name="region2-1" class="region21"></slot>
      </div>
      <div class="region22-wrapper">
        <slot name="region2-2" class="region22"></slot>
      </div>
      <div class="region23-wrapper">
        <slot name="region2-3" class="region23"></slot>
      </div>
      <div class="region24-wrapper">
        <slot name="region2-4" class="region24"></slot>
      </div>
    </div>
    <div>
      <slot name="region3" class="region3"></slot>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 region4-wrapper">
      <div class="region41-wrapper">
        <slot name="region4-1" class="region41"></slot>
      </div>
      <div class="region42-wrapper">
        <slot name="region4-2" class="region42"></slot>
      </div>
    </div>
    <div>
      <slot name="region5" class="region5"></slot>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 region6-wrapper">
      <div class="region61-wrapper">
        <slot name="region6-1" class="region61"></slot>
      </div>
      <div class="region62-wrapper">
        <slot name="region6-2" class="region62"></slot>
      </div>
      <div class="region63-wrapper">
        <slot name="region6-3" class="region63"></slot>
      </div>
    </div>
    <div>
      <slot name="region7" class="region7"></slot>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    slotNames: {
      type: Array,
      default() {
        return [
          'region1',
          'region2-1',
          'region2-2',
          'region2-3',
          'region2-4',
          'region3',
          'region4-1',
          'region4-2',
          'region5',
          'region6-1',
          'region6-2',
          'region6-3',
          'region7'
        ]
      },
    },
    lang: {
      type: String,
      default: ''
    },
    locales: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style>
[class^="region2"][class$="-wrapper"],
[class^="region6"][class$="-wrapper"] {
  .text-image .row-wrapper.image-right,
  .faq .faq-row-wrapper.image-right {
    flex-wrap: wrap !important;
  }

  .text-image .row-wrapper.image-left,
  .faq .faq-row-wrapper.image-left {
    flex-wrap: wrap-reverse !important;
  }
}

[class^="region2"][class$="-wrapper"] .text-image .row-wrapper .md\:h-360px,
[class^="region6"][class$="-wrapper"] .text-image .row-wrapper .md\:h-360px {
  height: auto !important;
}

[class^="region2"][class$="-wrapper"] .articles .articles-wrapper,
[class^="region6"][class$="-wrapper"] .articles .articles-wrapper {
  grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
}

[class^="region2"][class$="-wrapper"] .articles,
[class^="region6"][class$="-wrapper"] .articles,
[class^="region4"][class$="-wrapper"] .articles {
  padding-left: 1px !important;
  padding-right: 1rem !important;
}

[class^="region2"][class$="-wrapper"] .articles .article-content-wrapper .title,
[class^="region6"][class$="-wrapper"] .articles .article-content-wrapper .title,
[class^="region4"][class$="-wrapper"] .articles .article-content-wrapper .title,
[class^="region2"][class$="-wrapper"] .articles .article-content-wrapper .desc,
[class^="region6"][class$="-wrapper"] .articles .article-content-wrapper .desc,
[class^="region4"][class$="-wrapper"] .articles .article-content-wrapper .desc {
  text-overflow: ellipsis;
  display: block;
  white-space: nowrap;
}

[class^="region2"][class$="-wrapper"] .articles.carousel .articles-wrapper .card-wrapper .wrapper,
[class^="region6"][class$="-wrapper"] .articles.carousel .articles-wrapper .card-wrapper .wrapper,
[class^="region4"][class$="-wrapper"] .articles.carousel .articles-wrapper .card-wrapper .wrapper,
[class^="region2"][class$="-wrapper"] .articles.carousel .articles-wrapper .card-wrapper .wrapper,
[class^="region6"][class$="-wrapper"] .articles.carousel .articles-wrapper .card-wrapper .wrapper,
[class^="region4"][class$="-wrapper"] .articles.carousel .articles-wrapper .card-wrapper .wrapper {
  width: 300px;
}

[class^="region2"][class$="-wrapper"] .articles.carousel .articles-wrapper,
[class^="region6"][class$="-wrapper"] .articles.carousel .articles-wrapper,
[class^="region4"][class$="-wrapper"] .articles.carousel .articles-wrapper,
[class^="region2"][class$="-wrapper"] .articles.carousel .articles-wrapper,
[class^="region6"][class$="-wrapper"] .articles.carousel .articles-wrapper,
[class^="region4"][class$="-wrapper"] .articles.carousel .articles-wrapper {
  justify-content: start !important;
}

[class^="region2"][class$="-wrapper"] .author-view .wrapper,
[class^="region6"][class$="-wrapper"] .author-view .wrapper,
[class^="region2"][class$="-wrapper"] .author-view .wrapper .btns-wrapper,
[class^="region6"][class$="-wrapper"] .author-view .wrapper .btns-wrapper {
  flex-wrap: wrap;
}

[class^="region2"][class$="-wrapper"] .full-article .body-wrapper .html-content,
[class^="region6"][class$="-wrapper"] .full-article .body-wrapper .html-content,
[class^="region4"][class$="-wrapper"] .full-article .body-wrapper .html-content {
  width: 100% !important;
}

[class^="region2"][class$="-wrapper"] .full-article .full-article-wrapper,
[class^="region6"][class$="-wrapper"] .full-article .full-article-wrapper,
[class^="region4"][class$="-wrapper"] .full-article .full-article-wrapper,
[class^="region2"][class$="-wrapper"] .full-article .body-wrapper,
[class^="region6"][class$="-wrapper"] .full-article .body-wrapper,
[class^="region4"][class$="-wrapper"] .full-article .body-wrapper {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

[class^="region2"][class$="-wrapper"] .full-article .title {
  text-overflow: ellipsis;
  overflow: hidden;
  width: 200px;
}

[class^="region2"][class$="-wrapper"] .articles-preview,
[class^="region6"][class$="-wrapper"] .articles-preview,
[class^="region4"][class$="-wrapper"] .articles-preview {
  flex-wrap: wrap;
  gap: 1.5rem !important;
  padding: 1.25rem 1rem !important;
  .image-wrapper {
    min-height: 300px;
    max-height: 300px;
    img {
      min-width: 100% !important;
      height: 100% !important;
    }
  }
}

[class^="region4"][class$="-wrapper"] .articles-preview .image-wrapper, [class^="region4"][class$="-wrapper"] .articles-preview img {
  width: 100% !important;
}

</style>
