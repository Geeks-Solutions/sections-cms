<template>
  <div v-if="settings" class="text-image">

	<div class="flex w-full py-2.5 justify-between items-center gap-8 row-wrapper" :class="[settings[0].imagePosition === 'right' ? 'flex-col md:flex-row image-right' : 'flex-col-reverse md:flex-row-reverse image-left', settings[0].sectionWrapperClass]">
	  <div class="flex flex-col space-y-6" :class="settings[0].imagePosition === 'none' ? '' : 'md:w-[640px]'">
      <div class="title-wrapper">
        <gWysiwygContent v-if="settings[0].title[lang]" tag="h2" :wrapper-classes="settings[0].titleClasses" :classes="`p-0 overflow-hidden h-auto`" :html-content="settings[0].title[lang]" />
      </div>
      <gWysiwygContent v-if="settings[0].text[lang]" tag="p" :wrapper-classes="[settings[0].textClasses, 'desc-wrapper']" :classes="`p-0 h-auto pt-4`" :html-content="settings[0].text[lang]" />
	  </div>
	  <div v-if="settings[0].imagePosition !== 'none'" class="w-full gap-4" :class="{'md:w-auto': !settings[0].videoLink}">
		<div v-if="!settings[0].videoLink" :class="['flex h-[240px] md:h-[360px] md:row-span-2 md:mt-6 image-wrapper']">
      <NuxtImg
        v-if="settings[0].media && settings[0].media.url"
        :src="settings[0].media.url"
        :alt="settings[0].media.seo_tag ? settings[0].media.seo_tag : ''"
        class="w-full"
        :class="'h-full object-contain'"
        width="300"
           height="300"
           :placeholder="[300, 300, 75, 5]" format="webp"
        loading="lazy"
      />
		</div>
      <div v-else class="w-full relative">
        <!--  For youtube videos, the following must be added to the end of the embedded url `?autoplay=1&mute=1` for the video to autoplay -->
        <LazyYoutube :src="computedVideoUrl" max-width="1000px" :autoplay="settings[0].autoplay" />
<!--        <iframe :src="computedVideoUrl" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" allow="autoplay;" />-->
      </div>
	  </div>
	</div>

  </div>
</template>

<script>
import {sectionsStyle} from "@/utils/constants";

export default {
  name: 'TextImageStatic',
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
		  title: {
			en: 'string',
			fr: 'string'
		  },
		  text: {
			en: 'wysiwyg',
			fr: 'wysiwyg'
		  },
		  media: 'image',
		  imagePosition: "right"
		}
	  ]
	}
  },
  data() {
	return {
	  sectionsStyle
	}
  },
  computed: {
	settings() {
	  return this.section.settings
	},
    computedVideoUrl() {
      if (this.settings && this.settings[0] && this.settings[0].videoLink && this.isYouTubeLink(this.settings[0].videoLink)) {
        const v = this.settings[0]
        try {
          const url = new URL(v.videoLink);
          const params = url.searchParams;

          params.set("hl", this.$i18n.locale);
          params.set("rel", "0");

          if (v.autoplay) {
            params.set("autoplay", "1");
            params.set("mute", "1");
          } else {
            params.delete("autoplay");
            params.delete("mute");
          }

          if (v.loop) {
            const videoId = this.extractVideoId(url.href);
            if (videoId) {
              params.set("loop", "1");
              params.set("playlist", videoId);
            }
          } else {
            params.delete("loop");
            params.delete("playlist");
          }

          if (v.controls) {
            params.set("controls", "0");
            params.set("disablekb", "1");
          } else {
            params.delete("controls");
            params.delete("disablekb");
          }

          if (v.whiteProgress) {
            params.set("color", "white");
          } else {
            params.delete("color");
          }

          return url.toString();
        } catch {
          return ''
        }
      } else return this.settings[0].videoLink
    }
  },
  methods: {
    extractVideoId(url) {
      const regex = /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    },
    isYouTubeLink(url) {
      try {
        const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)(\/.*)?$/;
        return regex.test(url);
      } catch {
        return false
      }
    }
  },
  mounted() {
    const sectionsThemeComponents = null
    sectionsThemeComponents?.(this.section.name, [
      {
        id: 'global',
        name: this.$t('sectionsBuilder.globalSettings'),
        path: '/theme/global_settings'
      }
    ])
  }
};
</script>

<style>
button.ly-button-wrapper svg {
  height: auto;
  width: auto;
}

section .text-image {
  container: text-image / inline-size;
}

@container text-image (max-width: 768px) {
  .text-image .row-wrapper.image-right {
    flex-wrap: wrap !important;
  }

  .text-image .row-wrapper.image-left {
    flex-wrap: wrap-reverse !important;
  }

  .text-image .row-wrapper .image-wrapper {
    height: auto !important;
  }
}

</style>
