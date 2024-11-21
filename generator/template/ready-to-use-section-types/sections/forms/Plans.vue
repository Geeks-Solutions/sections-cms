<template>
  <div>
	
	<div id="title" class="flex flex-col items-start justify-start mt-8">
	  <label class="mr-4 font-bold">{{ $t("boxTitle") }}</label>
	  <wysiwyg :html="settings[0].title[siteLang]" @wysiwygMedia="wysiwygMediaAdded" @settingsUpdate="updateTitle"/>
	</div>
	
	<div id="subTitle" class="flex flex-col items-start justify-start mt-8">
	  <label class="mr-4 font-bold">{{ $t("SubTitle") }}</label>
	  <wysiwyg :html="settings[0].subTitle[siteLang]" @wysiwygMedia="wysiwygMediaAdded" @settingsUpdate="updateSubTitle"/>
	</div>
	
	<fieldset v-for="(plan, idx) in settings[0].plans" :key="`plan-${idx}`" class="fieldSetStyle border border-solid border-gray-300 p-3 mt-2">
	  <legend class="w-auto px-16">{{ `${$t("plans.plan")} ${idx + 1}` }}</legend>
	  
	  <div :id="`media-${idx}`" class="mt-8">
		<UploadMedia :media-label="$t('Media')" :upload-text="$t('Upload')" :change-text="$t('Change')" :seo-tag="$t('seoTag')" :media="plan.media && Object.keys(plan.media).length > 0 ? [plan.media] : []" @uploadContainerClicked="uploadMedia(idx)" @removeUploadedImage="mediaFieldIndex = idx; removeMedia(idx)" />
	  </div>
	  
	  <div class="flex flex-row gap-4">
		<div :id="`title-${idx}`" class="flex flex-col items-start justify-start mt-8">
		  <label class="mr-4 font-bold">{{ $t("plans.title") + ' *' }}</label>
		  <input
			   v-model="plan.title[siteLang]"
			   type="text"
			   value=""
			   :placeholder="$t('plans.title') + ' *'"
			   class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-220px
            focus:outline-none
          "
		  />
		  <span v-show="errors[`title-${idx}`] === true && siteLang === 'en'" class="text-error text-sm pt-2 pl-2">{{ $t('requiredField') }}</span>
		</div>
		
		<div class="flex flex-col items-start justify-start mt-8">
		  <label class="mr-4 pb-2 font-bold">{{ $t("plans.mostPopular") }}</label>
		  <input
			   v-model="plan.mostPopular"
			   type="checkbox"
			   value=""
			   :placeholder="$t('plans.mostPopular')"
			   class="
            h-25px
            w-25px
            pl-6
            border border-FieldGray
            rounded-xl
            focus:outline-none
          "
		  />
		</div>
	  </div>
	  
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("plans.description") }}</label>
		<wysiwyg :html="plan.description[siteLang]" @wysiwygMedia="wysiwygMediaAdded" @settingsUpdate="(content) => updateDescription(content, idx)"/>
	  </div>
	  
	  <div class="flex flex-row gap-4">
		<div :id="`currency-${idx}`" class="flex flex-col items-start justify-start mt-8">
		  <label class="mr-4 font-bold">{{ $t("plans.currency") }}</label>
		  <input
			   v-model="plan.currency[siteLang]"
			   type="text"
			   value=""
			   :placeholder="$t('currency')"
			   class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-220px
            focus:outline-none
          "
		  />
		</div>
		
		<div class="flex flex-col items-start justify-start mt-8">
		  <label class="mr-4 font-bold">{{ $t("plans.price") }}</label>
		  <input
			   v-model="plan.price[siteLang]"
			   type="text"
			   value=""
			   :placeholder="$t('plans.price')"
			   class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-220px
            focus:outline-none
          "
		  />
		</div>
	  </div>
	  
	  <div :id="`frequency-${idx}`" class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("plans.frequency") }}</label>
		<input
			 v-model="plan.frequency[siteLang]"
			 type="text"
			 value=""
			 :placeholder="$t('plans.frequency')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
	  </div>
	  
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("plans.customFeatures") }}</label>
		<input
			 v-model="plan.customFeatures[siteLang]"
			 type="text"
			 value=""
			 :placeholder="$t('plans.customFeatures')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
	  </div>
	  
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("plans.features") }}</label>
		<textarea
			 v-model="plan.features[siteLang]"
			 :placeholder="$t('plans.features')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-200px
            w-344px
            focus:outline-none
          "
		/>
	  </div>
	  
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("plans.ctaLabel") }}</label>
		<span class="text-sm">{{ $t("plans.ctaLabelDesc") }}</span>
		<input
			 v-model="plan.ctaLabel[siteLang]"
			 type="text"
			 value=""
			 :placeholder="$t('plans.ctaLabel')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
	  </div>
	  
	  <div class="flex flex-col items-start justify-start mt-8">
		<label class="mr-4 font-bold">{{ $t("plans.ctaLink") }}</label>
		<input
			 v-model="plan.ctaLink[siteLang]"
			 type="text"
			 value=""
			 :placeholder="$t('plans.ctaLink')"
			 class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
		/>
		<link-description />
	  </div>
	
	</fieldset>
	
	<div class="flex flex-col items-start justify-start mt-8">
	  <label class="mr-4 font-bold">{{ $t("plans.globalCtaLabel") }}</label>
	  <input
		   v-model="settings[0].globalCtaLabel[siteLang]"
		   type="text"
		   value=""
		   :placeholder="$t('plans.globalCtaLabel')"
		   class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-344px
            focus:outline-none
          "
	  />
	</div>
	
	<span v-show="!Object.values(errors).every((v) => v === false) && siteLang === 'fr'" id="required-fields" class="text-error text-sm pt-2 pl-2">{{ $t('checkRequiredField') }}</span>
  
  </div>
</template>

<script>
import UploadMedia from "@geeks.solutions/nuxt-sections/lib/src/components/Medias/UploadMedia.vue";
import wysiwyg from "@geeks.solutions/nuxt-sections/lib/src/components/Editor/wysiwyg.vue";
import {scrollToFirstError} from "@/utils/constants";

export default {
  name: 'Plans',
  components: {
	UploadMedia,
	wysiwyg
  },
  props: {
	selectedLang: {
	  type: String,
	  default: 'en'
	},
	selectedMedia: {},
	locales: {
	  type: Array,
	  default() {
		return []
	  }
	},
	mediaFields: [
	  {
		type: 'image',
		name: 'medias'
	  },
	  {
		type: 'image',
		name: 'wysiwygMedia'
	  }
	]
  },
  data() {
	return {
	  settings: [
		{
		  medias: [],
		  plans: [],
		  title: {
			en: '',
			fr: ''
		  },
		  subTitle: {
			en: '',
			fr: ''
		  },
		  globalCtaLabel: {
			en: '',
			fr: ''
		  }
		}
	  ],
	  errors: {
		
	  },
	  siteLang: 'en',
	  mediaFieldIndex: ''
	}
  },
  watch: {
	selectedLang(val) {
	  this.siteLang = val
	},
	selectedMedia(mediaObject) {
	  const media = {
		media_id: "",
		url: "",
		seo_tag: "",
		files: [
		  {
			filename: "",
			url: ""
		  }
		],
		headers: {}
	  };
	  media.files[0].url = mediaObject.files[0].url;
	  media.files[0].filename = mediaObject.files[0].filename;
	  media.media_id = mediaObject.id;
	  media.url = mediaObject.files[0].url;
	  media.seo_tag = mediaObject.seo_tag;
	  if (mediaObject.files[0].headers) {
		media.headers = mediaObject.files[0].headers
	  }
	  if (this.settings[0].plans[this.mediaFieldIndex].media.media_id) {
		const mediaIndex = this.settings[0].medias.findIndex(media => media.media_id === this.settings[0].plans[this.mediaFieldIndex].media.media_id)
		if (mediaIndex !== -1) {
		  this.$set(this.settings[0].medias, mediaIndex, media);
		} else {
		  this.settings[0].medias.push(media)
		}
	  } else {
		this.settings[0].medias.push(media)
	  }
	  this.$set(this.settings[0].plans[this.mediaFieldIndex],'media' , media);
	  this.$emit('closeMediaModal')
	}
  },
  created() {
	if (this.settings[0].plans && this.settings[0].plans.length === 0) {
	  const plansCount = 4
	  for (let i = 0; i < plansCount; i++) {
		this.settings[0].plans.push({
		  title: {
			en: '',
			fr: ''
		  },
		  description: {
			en: '',
			fr: ''
		  },
		  price: {
			en: '',
			fr: ''
		  },
		  currency: {
			en: '',
			fr: ''
		  },
		  frequency: {
			en: '',
			fr: ''
		  },
		  ctaLabel: {
			en: '',
			fr: ''
		  },
		  ctaLink: {
			en: '',
			fr: ''
		  },
		  features: {
			en: '',
			fr: ''
		  },
		  customFeatures: {
			en: '',
			fr: ''
		  },
		  mostPopular: false,
		  media: {
			media_id: "",
			url: "",
			seo_tag: "",
			files: [
			  {
				filename: "",
				url: ""
			  }
			]
		  }
		})
	  }
	}
  },
  methods: {
	updateTitle(content) {
	  this.settings[0].title[this.siteLang] = content
	},
	updateSubTitle(content) {
	  this.settings[0].subTitle[this.siteLang] = content
	},
	updateDescription(content, idx) {
	  this.settings[0].plans[idx].description[this.siteLang] = content
	},
	wysiwygMediaAdded(media) {
	  this.settings.push({
		wysiwygMedia: media,
		wysiwygLang: this.siteLang
	  })
	},
	uploadMedia(idx) {
	  this.mediaFieldIndex = idx;
	  this.$emit('openMediaModal', Object.keys(this.settings[0].plans[idx].media).length > 0 ? this.settings[0].plans[idx].media.media_id : null)
	},
	removeMedia(idx) {
	  const removeAtIndex = this.settings[0].medias.findIndex(media => media.media_id === this.settings[0].plans[idx].media.media_id)
	  this.settings[0].medias.splice(removeAtIndex, 1)
	  this.settings[0].plans[idx].media = {}
	},
	validate() {
	  if (Array.isArray(this.settings)) {
		this.settings.forEach((ob, index) => {
		  if (ob.wysiwygLang && this.settings[0][ob.wysiwygLang] !== undefined) {
			if (!JSON.stringify(this.settings[0][ob.wysiwygLang]).includes(ob.wysiwygMedia.url)) {
			  this.settings.splice(index, 1)
			}
		  }
		})
	  }
	  this.errors = {}
	  const valid = true;
	  if (!valid) {
		setTimeout(() => document.getElementById('required-fields').scrollIntoView(), 1000)
		this.$root.$emit("toast", {
		  type: "Error",
		  message: this.$t("fill-required-fields")
		});
		scrollToFirstError(this.errors)
	  }
	  return valid;
	},
  },
}
</script>

<style>
.shadow {
  box-shadow: 4px 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
