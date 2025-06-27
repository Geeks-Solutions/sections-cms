<template>
  <div v-if="settings" class="plans plans-wrapper">

	<div class="mt-18 pb-20 sectionsPack">

	  <div class="flex w-full ql-snow">
      <gWysiwygContent tag="div" class="w-full" :wrapper-classes="settings.titleClasses" :classes="`mt-14 md:w-full w-fit title`" :html-content="settings.title[lang]" />
	  </div>

	  <div class="flex w-full ql-snow">
      <gWysiwygContent tag="div" class="w-full" :wrapper-classes="settings.subTitleClasses" :classes="`md:w-full mt-2 subtitle`" :html-content="settings.subTitle[lang]" />
	  </div>

	  <div :class="['flex flex-wrap justify-center gap-7 items-center mt-16', (settings.features && settings.features[lang] !== '') ? 'md:h-full' : 'md:h-full']">

		<div v-for="(plan, idx) in settings.plans" :key="`plans-${idx}`" :class="plan.title && plan.title[lang] ? '' : 'hidden'">
		  <div v-if="plan.title && plan.title[lang]" class="flex justify-between relative plansBox md:w-[312px] rounded-md" :class="[{'mostPopular' : plan.mostPopular === true}, `plan-${idx}`]">
			<div class="flex flex-col z-10 w-max justify-between py-4 rounded-md mx-4 px-4 wrapper" :class="{'mostPopular' : plan.mostPopular === true}">
			  <div v-if="plan.mostPopular === true" class="absolute top-0 left-0 transform w-2/3 border-transparent">
				<span class="absolute popPad" />
				<div class="absolute popText">
				  <div class="relative" :class="$i18n.locale === 'fr' ? 'pl-2' : ''">
                  <span class="absolute text-white w-max transform -rotate-45  p-2">
                    {{ $t('plans.mostPopular') }}
                  </span>
				  </div>
				</div>
			  </div>
			  <div class="flex items-center border-b border-FieldGray pb-4">
				<div class="flex justify-center border rounded-full w-[100px] h-[100px] mr-6 img-wrapper" :class="{'mostPopular' : plan.mostPopular === true}">
				  <NuxtImg v-if="plan.media && (plan.media.files && plan.media.files[0].url) || (plan.media && plan.media.url && plan.media.url !== '')" :src="plan.media.url && plan.media.url !== '' ? plan.media.url : plan.media.files[0].url" :alt="plan.media.seo_tag" class="p-2"
                   width="300"
           height="300"
           :placeholder="[300, 300, 75, 5]" format="webp"
                   loading="lazy"/>
				</div>
				<div class="w-[140px] plansTitleBox ql-snow">
				  <div class="title w-[80px]" :class="{'mostPopular' : plan.mostPopular === true}" :title="plan.title[lang]">{{ plan.title[lang] }}</div>
          <gWysiwygContent v-if="plan.description[lang] !== ''" tag="div" :wrapper-classes="plan.classes" :classes="`pt-2 pb-0 pl-0 desc`" :html-content="plan.description[lang]" />
				</div>

			  </div>

			  <div class="flex justify-center mt-1">
				<div v-if="plan.currency[lang]" class="currency" :class="{'mostPopular' : plan.mostPopular === true}">{{ plan.currency[lang] }}</div>
				<div v-if="plan.price[lang]" class="price">{{ plan.price[lang] }}</div>
			  </div>

			  <div v-if="plan.frequency[lang]" class="flex justify-center pt-1 date" :class="{'mostPopular' : plan.mostPopular === true}">{{ plan.frequency[lang] }}</div>

			  <div class="flex justify-center pt-6 pb-6">
				<div class="pr-2 customFeatures" :class="{'mostPopular' : plan.mostPopular === true}">{{ plan.customFeatures[lang] }}</div>
			  </div>

			  <div class="pt-6 flex flex-col h-full justify-between">
				<div class="pb-4 features">
				  <ul v-for="(item, index) in plan.features[lang] && plan.features[lang].includes('-') ? plan.features[lang].split('-') : []" :key="`plan-${item}-${index}`" class="flex justify-start items-start md:w-full w-[250px] max-w-[250px] pt-1 ">
					<li class="bp" :class="{'mostPopular' : plan.mostPopular === true}">{{ item }}</li>
				  </ul>
				</div>
				<div class="flex justify-center cursor-pointer">
				  <global-link :link="plan.ctaLink" :lang="lang" :default-lang="defaultLang" :form-link-target="plan.ctaLinkTarget">
					<div class="flex">
					  <div v-if="(plan.ctaLabel && plan.ctaLabel[lang]) || (settings.globalCtaLabel && settings.globalCtaLabel[lang])" class="pr-2 cta-arrow" :class="{'mostPopular' : plan.mostPopular === true}">
						=>
					  </div>
					  <div class="cta">
						{{ plan.ctaLabel && plan.ctaLabel[lang] ? plan.ctaLabel[lang] : settings.globalCtaLabel && settings.globalCtaLabel[lang] ? settings.globalCtaLabel[lang] : '' }}
					  </div>
					</div>
				  </global-link>
				</div>
			  </div>

			</div>

		  </div>
		</div>


	  </div>

	</div>

  </div>
</template>

<i18n src="../forms/Plans_i18n.json"></i18n>

<script>

export default {
  name: 'PlansStatic',
  setup() {
    const { t } = useI18n({
      useScope: 'local'
    })

    return {
      $t: t
    }
  },
  props: {
	section: {
	  type: Object,
	  default: () => {},
	},
	lang: {
	  type: String,
	  default: "en"
	},
    defaultLang: {
	  type: String,
	  default: "en"
	},
	viewStructure: {
	  settings: [
		{
		  "title": {
			"fr": "string",
			"en": "string"
		  },
		  "subTitle": {
			"fr": "string",
			"en": "string"
		  },
		  "globalCtaLabel": {
			"fr": "string",
			"en": "string"
		  },
		  "plans": [
			{
			  "description": {
				"fr": "string",
				"en": "string"
			  },
			  "media": "image",
			  "title": {
				"fr": "plan",
				"en": "plan"
			  },
			  "features": {
				"fr": "string",
				"en": "string"
			  },
			  "currency": {
				"fr": "$",
				"en": "$"
			  },
			  "price": {
				"fr": "number",
				"en": "number"
			  },
			  "ctaLink": {
				"fr": "string",
				"en": "string"
			  },
			  "ctaLabel": {
				"fr": "string",
				"en": "string"
			  },
			  "customFeatures": {
				"fr": "string",
				"en": "string"
			  },
			  "frequency": {
				"fr": "string",
				"en": "string"
			  },
			  "mostPopular": "boolean"
			},
			{
			  "description": {
				"fr": "string",
				"en": "string"
			  },
			  "media": "image",
			  "title": {
				"fr": "plan",
				"en": "plan"
			  },
			  "features": {
				"fr": "string",
				"en": "string"
			  },
			  "currency": {
				"fr": "$",
				"en": "$"
			  },
			  "price": {
				"fr": "number",
				"en": "number"
			  },
			  "ctaLink": {
				"fr": "string",
				"en": "string"
			  },
			  "ctaLabel": {
				"fr": "string",
				"en": "string"
			  },
			  "customFeatures": {
				"fr": "string",
				"en": "string"
			  },
			  "frequency": {
				"fr": "string",
				"en": "string"
			  },
			  "mostPopular": "boolean"
			},
			{
			  "description": {
				"fr": "string",
				"en": "string"
			  },
			  "media": "image",
			  "title": {
				"fr": "plan",
				"en": "plan"
			  },
			  "features": {
				"fr": "string",
				"en": "string"
			  },
			  "currency": {
				"fr": "$",
				"en": "$"
			  },
			  "price": {
				"fr": "number",
				"en": "number"
			  },
			  "ctaLink": {
				"fr": "string",
				"en": "string"
			  },
			  "ctaLabel": {
				"fr": "string",
				"en": "string"
			  },
			  "customFeatures": {
				"fr": "string",
				"en": "string"
			  },
			  "frequency": {
				"fr": "string",
				"en": "string"
			  },
			  "mostPopular": "boolean"
			},
			{
			  "description": {
				"fr": "string",
				"en": "string"
			  },
			  "media": "image",
			  "title": {
				"fr": "plan",
				"en": "plan"
			  },
			  "features": {
				"fr": "string",
				"en": "string"
			  },
			  "currency": {
				"fr": "$",
				"en": "$"
			  },
			  "price": {
				"fr": "number",
				"en": "number"
			  },
			  "ctaLink": {
				"fr": "string",
				"en": "string"
			  },
			  "ctaLabel": {
				"fr": "string",
				"en": "string"
			  },
			  "customFeatures": {
				"fr": "string",
				"en": "string"
			  },
			  "frequency": {
				"fr": "string",
				"en": "string"
			  },
			  "mostPopular": "boolean"
			}
		  ]
		}
	  ]
	}
  },
  data() {
	return {
	  percenInViewPort: 0,
	  addOpacity: false,
	  isVisible: false,
	  freeHovered: false
	};
  },
  watch: {
	"section.settings": {
	  handler() {
		if (!process.server) {
		  this.adjustBoxesHeight()
		}
	  },
	  deep: true,
	  immediate: true
	}
  },
  computed: {
	settings() {
	  if(Array.isArray(this.section.settings)) {
		return this.section.settings[0];
	  } else return this.section.settings
	},
  },
  mounted() {
	this.adjustBoxesHeight()
  },
  methods: {
	adjustBoxesHeight() {
	  const boxes = document.querySelectorAll('.plansBox');

	  let maxHeight = 0;

	  boxes.forEach(box => {
		box.style.height = `auto`;
	  });

	  boxes.forEach(box => {
		const boxHeight = box.getBoundingClientRect().height;
		maxHeight = Math.max(maxHeight, boxHeight);
	  });

	  boxes.forEach(box => {
		box.style.height = `${maxHeight}px`;
	  });

	  const titleBoxes = document.querySelectorAll('.plansTitleBox');

	  let titleMaxHeight = 0;

	  titleBoxes.forEach(box => {
		box.style.height = `auto`;
	  });

	  titleBoxes.forEach(box => {
		const boxHeight = box.getBoundingClientRect().height;
		titleMaxHeight = Math.max(titleMaxHeight, boxHeight);
	  });

	  titleBoxes.forEach(box => {
		box.style.height = `${titleMaxHeight}px`;
	  });
	}
  }
};
</script>

<style>
.wys-wrapper .title {
  max-width: 470px;
}
.view-component {
  overflow: initial !important;
}
h1 span {
  line-height: 1.3em;
}
.popPad {
  width: 120px;
  top: -10.6px;
  left: -16.6px;
}
.popText {
  top: 5px;
  left: -21px;
}
</style>
