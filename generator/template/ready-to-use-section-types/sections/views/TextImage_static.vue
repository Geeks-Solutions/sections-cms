<template>
  <div v-if="settings" class="text-image">
	
	<div class="flex w-full px-5 md:px-20 py-14 md:py-20 justify-between items-center gap-8" :class="settings[0].imagePosition === 'right' ? 'flex-col md:flex-row' : 'flex-col-reverse md:flex-row-reverse'">
	  <div class="flex flex-col space-y-6" :class="settings[0].imagePosition === 'none' ? '' : 'md:w-640px'">
		<div class="flex flex-row items-center gap-4 md:gap-8">
		  <h2 v-if="settings[0].title[lang]" class="p-0 overflow-hidden" :class="[sectionsStyle.wysiwygHtml]" v-html="settings[0].title[lang]"></h2>
		</div>
		<p v-if="settings[0].text[lang]" class="p-0" :class="[sectionsStyle.wysiwygHtml, 'pt-4']" v-html="settings[0].text[lang]"></p>
	  </div>
	  <div v-if="settings[0].imagePosition !== 'none'" class="w-full md:w-auto gap-4">
		<div :class="'flex h-240px md:h-360px md:row-span-2 md:mt-6'">
		  <img
			   v-if="settings[0].media && settings[0].media.url"
			   :src="settings[0].media.url"
			   :alt="settings[0].media.seo_tag ? settings[0].media.seo_tag : ''"
			   loading="lazy"
			   class="w-full"
			   :class="'h-full object-cover'"
		  />
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
	}
  }
};
</script>
