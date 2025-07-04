<template>
  <div v-if="settings" class="product-details">
    <ProductDetailsComponent :product="settings" :lang="lang" />
  </div>
</template>

<script>

export default {
  name: 'ProductDetailsStatic',
  props: {
    section: {
      type: Object,
      default: () => {},
    },
    lang: {
      type: String,
      default: "en"
    },
    viewStructure: {
      settings: [
        {
          name: {
            en: 'string',
            fr: ''
          },
          description: {
            en: 'text',
            fr: ''
          },
          descriptionClasses: '',
          price: 123,
          currency: '$',
          autoplay: false,
          loop: false,
          controls: false,
          whiteProgress: false,
          productMedias: [
            {
              "mediaType": "imageType",
              "media": {
                "media_id": "img2",
                "url": "https://dummyimage.com/600x400/dddddd/000000.png&text=Image2",
                "thumbnail_url": "https://dummyimage.com/600x400/dddddd/000000.png&text=Image2",
                "seo_tag": "Sample Image 2"
              }
            },
            {
              "mediaType": "imageType",
              "media": {
                "media_id": "img2",
                "url": "https://dummyimage.com/600x400/dddddd/000000.png&text=Image2",
                "thumbnail_url": "https://dummyimage.com/600x400/dddddd/000000.png&text=Image2",
                "seo_tag": "Sample Image 2"
              }
            },
            {
              "mediaType": "imageType",
              "media": {
                "media_id": "img1",
                "url": "https://dummyimage.com/600x400/dddddd/000000.png&text=Image1",
                "thumbnail_url": "https://dummyimage.com/600x400/dddddd/000000.png&text=Image1",
                "seo_tag": "Sample Image 1"
              }
            }
          ]
        }
      ]
    }
  },
  computed: {
    settings() {
      if (this.section.settings && this.section.settings[0]) {
        return this.section.settings[0]
      }
    }
  }
};
</script>
