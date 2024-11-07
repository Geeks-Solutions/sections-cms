<template>
  <div v-if="settings">
	
	<div class="mt-18 mb-20">
	  
	  <div class="flex w-full justify-center">
		<div class="ql-editor ql-snow mt-14 md:w-full w-fit text-4xl px-16 md:px-0" style="letter-spacing: 4px" v-html="getCurrentTranslation(settings, lang, 'title', 'title_fr')"></div>
	  </div>
	  
	  <div class="flex w-full justify-center">
		<div class="ql-editor ql-snow md:w-full mt-2 px-8 md:px-0  " v-html="getCurrentTranslation(settings, lang, 'subTitle', 'subTitle_fr')"></div>
	  </div>
	  
	  <div :class="['flex flex-wrap justify-center gap-7 items-center mt-16', (settings[lang] && settings[lang].freeFeatures && settings[lang].freeFeatures !== '') || (settings.freeFeatures && settings.freeFeatures !== '') ? 'md:h-full' : 'md:h-400px']">
		
		<!--        Free-->
		<div class="flex justify-between relative" :class="freeHovered || settings.freeMostPopular === true ? (settings[lang] && settings[lang].freeFeatures && settings[lang].freeFeatures !== '') || (settings.freeFeatures && settings.freeFeatures !== '') ? ' py-2 px-4 md:w-312px h-855px borderedStyle rounded-md ' : 'flex justify-between normalBorder w-312px h-400px rounded-md ' : (settings[lang] && settings[lang].freeFeatures && settings[lang].freeFeatures !== '') || (settings.freeFeatures && settings.freeFeatures !== '') ? ' md:w-312px md:h-855px' : ' md:w-312px md:h-400px'" @mouseover="freeHovered = true" @mouseout="freeHovered = false">
		  <div class="flex flex-col z-10 w-max  px-4 pt-4 rounded-md " :class="freeHovered || settings.freeMostPopular === true ? ' rounded-md ' : ''">
			<div v-if="settings.freeMostPopular === true" class="absolute top-0 left-1/2 transform -translate-x-1/2 w-2/3 border-transparent">
			  <span class="absolute popular w-max top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45  p-2">{{ $t('mostPopular') }}</span>
			</div>
			<div class="flex items-center border-b border-FieldGray pb-4">
			  <div class="flex justify-center border border-Dark rounded-full w-100px h-100px mr-6" :class="freeHovered || settings.freeMostPopular === true ? '' : ''">
				<img v-if="(settings.freeMedia.files && settings.freeMedia.files[0].url) || (settings.freeMedia.url && settings.freeMedia.url !== '')" format="webp" loading="lazy" :src="settings.freeMedia.url && settings.freeMedia.url !== '' ? settings.freeMedia.url : settings.freeMedia.files[0].url" :alt="settings.freeMedia.seo_tag" class="p-2" />
			  </div>
			  <div class="w-140px">
				<h2 class="  w-80px " :class="freeHovered || settings.freeMostPopular === true ? '' : ''">{{ getCurrentTranslation(settings, lang, 'freeTitle', 'freeTitle_fr') }}</h2>
				<p v-if="settings.freeDescription !== ''" class="ql-editor ql-snow pt-2 pb-0 pl-0 text-sm  text-grayText" v-html="getCurrentTranslation(settings, lang, 'freeDescription', 'freeDescription_fr')"></p>
			  </div>
			
			</div>
			
			<div class="flex justify-center mt-1">
			  <div class="pt-6 " :class="freeHovered || settings.freeMostPopular === true ? ' text-4xl' : 'text-2xl'">€</div>
			  <h1>{{ settings.freePrice }}</h1>
			</div>
			
			<p :class="freeHovered || settings.freeMostPopular === true ? 'flex justify-center pt-1 text-sm  text-grayText' : 'flex justify-center pt-1 text-sm  text-grayText'">{{ getCurrentTranslation(settings, lang, 'freeDate', 'freeDate_fr') }}</p>
			
			<div v-if="(settings[lang] && settings[lang].freeFeatures && settings[lang].freeFeatures !== '') || (settings.freeFeatures && settings.freeFeatures !== '')" class="pt-6 flex flex-col h-full justify-between">
			  <div>
				<div v-for="item  in getFeaturesArray(settings, lang, 'freeFeatures', 'freeFeatures_fr')" :key="item" class="flex justify-start items-start md:w-full w-320px pt-1 pl-3 pr-3">
				  <div class="icon pt-1.5 mr-3" :class="freeHovered === true || settings.freeMostPopular === true ? 'freeHovered' : 'free'">
				  </div>
				  <p class="  " :class="freeHovered || settings.freeMostPopular === true ? '' : ''">{{ item }}</p>
				</div>
			  </div>
			  
			  <div class="flex justify-center pb-10 cursor-pointer" @click="openURL(settings[lang].freeStartLink)">
				<p class="  ">
				  {{ getCurrentTranslation(settings, lang, 'freeStartLabel', 'freeStartLabel_fr') }}
				</p>
			  </div>
			</div>
			
			<div v-else>
			  <div class="flex flex-col justify-between">
				<div class="flex justify-center pt-6 pb-6">
				  <div class="icon mr-1" :class="freeHovered === true || settings.freeMostPopular === true ? 'freeHovered' : 'free'">
				  </div>
				  <div class="pr-2  " :class="freeHovered || settings.freeMostPopular === true ? '' : ''">{{ getCurrentTranslation(settings, lang, 'pagesLabel', 'pagesLabel_fr') }}</div>
				  <div class=" " :class="freeHovered || settings.freeMostPopular === true ? '  ' : '  '">{{ settings.freePagesNumber }}</div>
				</div>
				
				<div class="flex justify-center pt-1 pb-2 cursor-pointer" @click="navigateURL('freeLink', 'freeLink_fr')">
				  <div class=" pr-2" :class="freeHovered || settings.freeMostPopular === true ? '' : ''">
					=>
				  </div>
				  <p class=" ">
					{{ getCurrentTranslation(settings, lang, 'knowMoreLabel', 'knowMoreLabel_fr') }}
				  </p>
				</div>
			  </div>
			</div>
		  
		  </div>
		
		</div>
		
		<!--        Standard-->
		<div class="flex justify-between relative" :class="standardHovered || settings.standardMostPopular === true ? (settings[lang] && settings[lang].standardFeatures && settings[lang].standardFeatures !== '') || (settings.standardFeatures && settings.standardFeatures !== '') ? ' py-2 px-4 md:w-312px h-855px borderedStyle rounded-md ' : 'flex justify-between normalBorder w-312px h-400px rounded-md ' : (settings[lang] && settings[lang].standardFeatures && settings[lang].standardFeatures !== '') || (settings.standardFeatures && settings.standardFeatures !== '') ? ' md:w-312px md:h-855px' : ' md:w-312px md:h-400px'" @mouseover="standardHovered = true" @mouseout="standardHovered = false">
		  <div class="flex flex-col z-10 w-max  px-4 pt-4 rounded-md " :class="standardHovered || settings.standardMostPopular === true ? ' rounded-md ' : ''">
			<div v-if="settings.standardMostPopular === true" class="absolute top-0 left-1/2 transform -translate-x-1/2 w-2/3 border-transparent">
			  <span class="absolute popular w-max top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45  p-2">{{ $t('mostPopular') }}</span>
			</div>
			<div class="flex items-center border-b border-FieldGray pb-4">
			  <div class="flex justify-center border border-Dark rounded-full w-100px h-100px mr-6" :class="standardHovered || settings.standardMostPopular === true ? '' : ''">
				<img v-if="(settings.standardMedia.files && settings.standardMedia.files[0].url) || (settings.standardMedia.url && settings.standardMedia.url !== '')" format="webp" loading="lazy" :src="settings.standardMedia.url && settings.standardMedia.url !== '' ? settings.standardMedia.url : settings.standardMedia.files[0].url" :alt="settings.standardMedia.seo_tag" class="p-2" />
			  </div>
			  <div class="w-140px">
				<h2 class="  w-80px " :class="standardHovered || settings.standardMostPopular === true ? '' : ''">{{ getCurrentTranslation(settings, lang, 'standardTitle', 'standardTitle_fr') }}</h2>
				<p v-if="settings.standardDescription !== ''" class="pt-2 text-sm  text-grayText">{{ getCurrentTranslation(settings, lang, 'standardDescription', 'standardDescription_fr') }}</p>
			  </div>
			
			</div>
			
			<div class="flex justify-center mt-1">
			  <div class="pt-6 " :class="standardHovered || settings.standardMostPopular === true ? ' text-4xl' : 'text-2xl'">€</div>
			  <h1>{{ settings.standardPrice }}</h1>
			</div>
			
			<p :class="standardHovered || settings.standardMostPopular === true ? 'flex justify-center pt-1 text-sm  text-grayText' : 'flex justify-center pt-1 text-sm  text-grayText'">{{ getCurrentTranslation(settings, lang, 'standardDate', 'standardDate_fr') }}</p>
			
			<div v-if="(settings[lang] && settings[lang].standardFeatures && settings[lang].standardFeatures !== '') || (settings.standardFeatures && settings.standardFeatures !== '')" class="pt-6 flex flex-col h-full justify-between">
			  <div>
				<div v-for="item  in getFeaturesArray(settings, lang, 'standardFeatures', 'standardFeatures_fr')" :key="item" class="flex justify-start items-start md:w-full w-320px pt-1 pl-3 pr-3">
				  <div class="icon pt-1.5 mr-3" :class="standardHovered === true || settings.standardMostPopular === true ? 'standardHovered' : 'standard'">
				  </div>
				  <p class="  " :class="standardHovered || settings.standardMostPopular === true ? '' : ''">{{ item }}</p>
				</div>
			  </div>
			  
			  <div class="flex justify-center pb-10 cursor-pointer" @click="openURL(settings[lang].standardStartLink)">
				<p class="  ">
				  {{ getCurrentTranslation(settings, lang, 'standardStartLabel', 'standardStartLabel_fr') }}
				</p>
			  </div>
			</div>
			
			<div v-else>
			  <div class="flex justify-center pt-6 pb-6">
				<div class="icon mr-1" :class="standardHovered === true || settings.standardMostPopular === true ? 'standardHovered' : 'standard'">
				</div>
				<p class="pr-2  " :class="standardHovered || settings.standardMostPopular === true ? '' : ''">{{ getCurrentTranslation(settings, lang, 'pagesLabel', 'pagesLabel_fr') }}</p>
				<div class=" " :class="standardHovered || settings.standardMostPopular === true ? '' : ''">{{ settings.standardPagesNumber }}</div>
			  </div>
			  
			  <div class="flex justify-center pt-1 pb-2 cursor-pointer" @click="navigateURL('standardLink', 'standardLink_fr')">
				<div class=" pr-2" :class="standardHovered || settings.standardMostPopular === true ? '' : ''">
				  =>
				</div>
				<p class=" ">
				  {{ getCurrentTranslation(settings, lang, 'knowMoreLabel', 'knowMoreLabel_fr') }}
				</p>
			  </div>
			</div>
		  
		  </div>
		
		</div>
		
		<!--        Corporate-->
		<div class="flex justify-between relative" :class="corporateHovered || settings.corporateMostPopular === true ? (settings[lang] && settings[lang].corporateFeatures && settings[lang].corporateFeatures !== '') || (settings.corporateFeatures && settings.corporateFeatures !== '') ? ' py-2 px-4 md:w-312px h-855px borderedStyle rounded-md ' : 'flex justify-between normalBorder md:w-312px h-400px rounded-md ' : (settings[lang] && settings[lang].corporateFeatures && settings[lang].corporateFeatures !== '') || (settings.corporateFeatures && settings.corporateFeatures !== '') ? ' md:w-312px md:h-855px' : ' md:w-312px md:h-400px'" @mouseover="corporateHovered = true" @mouseout="corporateHovered = false">
		  <div class="flex flex-col z-10 w-max  px-4 pt-4 rounded-md " :class="corporateHovered || settings.corporateMostPopular === true ? ' rounded-md ' : ''">
			<div v-if="settings.corporateMostPopular === true" class="absolute top-0 left-1/2 transform -translate-x-1/2 w-2/3 border-transparent">
			  <span class="absolute popular w-max top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45  p-2">{{ $t('mostPopular') }}</span>
			</div>
			<div class="flex items-center border-b border-FieldGray pb-4">
			  <div class="flex justify-center border border-Dark rounded-full w-100px h-100px mr-6" :class="corporateHovered || settings.corporateMostPopular === true ? '' : ''">
				<img  v-if="(settings.corporateMedia.files && settings.corporateMedia.files[0].url) || (settings.corporateMedia.url && settings.corporateMedia.url !== '')" format="webp" loading="lazy" :src="settings.corporateMedia.url && settings.corporateMedia.url !== '' ? settings.corporateMedia.url : settings.corporateMedia.files[0].url" :alt="settings.corporateMedia.seo_tag" class="p-2" />
			  </div>
			  <div class="w-140px">
				<h2 class="  w-80px " :class="corporateHovered || settings.corporateMostPopular === true ? '' : ''">{{ getCurrentTranslation(settings, lang, 'corporateTitle', 'corporateTitle_fr') }}</h2>
				<p v-if="settings.corporateDescription !== ''" class="pt-2 text-sm  text-grayText">{{ getCurrentTranslation(settings, lang, 'corporateDescription', 'corporateDescription_fr') }}</p>
			  </div>
			
			</div>
			
			<div class="flex justify-center mt-1">
			  <div class="pt-6 " :class="corporateHovered || settings.corporateMostPopular === true ? ' text-4xl' : 'text-2xl'">€</div>
			  <h1>{{ settings.corporatePrice }}</h1>
			</div>
			
			<p :class="corporateHovered || settings.corporateMostPopular === true ? 'flex justify-center pt-1 text-sm  text-grayText' : 'flex justify-center pt-1 text-sm  text-grayText'">{{ getCurrentTranslation(settings, lang, 'corporateDate', 'corporateDate_fr') }}</p>
			
			<div v-if="(settings[lang] && settings[lang].corporateFeatures && settings[lang].corporateFeatures !== '') || (settings.corporateFeatures && settings.corporateFeatures !== '')" class="pt-6 flex flex-col h-full justify-between">
			  <div>
				<div v-for="item  in getFeaturesArray(settings, lang, 'corporateFeatures', 'corporateFeatures_fr')" :key="item" class="flex justify-start items-start md:w-full w-320px pt-1 pl-3 pr-3">
				  <div class="icon pt-1.5 mr-3" :class="corporateHovered === true || settings.corporateMostPopular === true ? 'corporateHovered' : 'corporate'">
				  </div>
				  <p class="  " :class="corporateHovered || settings.corporateMostPopular === true ? '' : ''">{{ item }}</p>
				</div>
			  </div>
			  
			  <div class="flex justify-center pb-10 cursor-pointer" @click="openURL(settings[lang].corporateStartLink)">
				<p class="  ">
				  {{ getCurrentTranslation(settings, lang, 'corporateStartLabel', 'corporateStartLabel_fr') }}
				</p>
			  </div>
			</div>
			
			<div v-else>
			  <div class="flex justify-center pt-6 pb-6">
				<div class="icon mr-1" :class="corporateHovered === true || settings.corporateMostPopular === true ? 'corporateHovered' : 'corporate'">
				</div>
				<p class="pr-2  " :class="corporateHovered || settings.corporateMostPopular === true ? '' : ''">{{ getCurrentTranslation(settings, lang, 'pagesLabel', 'pagesLabel_fr') }}</p>
				<div class=" " :class="corporateHovered || settings.corporateMostPopular === true ? '' : ''">{{ settings.corporatePagesNumber }}</div>
			  </div>
			  
			  <div class="flex justify-center pt-1 pb-2 cursor-pointer" @click="navigateURL('corporateLink', 'corporateLink_fr')">
				<div class=" pr-2" :class="corporateHovered || settings.corporateMostPopular === true ? '' : ''">
				  =>
				</div>
				<p class=" ">
				  {{ getCurrentTranslation(settings, lang, 'knowMoreLabel', 'knowMoreLabel_fr') }}
				</p>
			  </div>
			</div>
		  
		  </div>
		
		</div>
		
		<!--        Entreprise-->
		<div class="flex justify-between relative" :class="entrepriseHovered || settings.entrepriseMostPopular === true ? (settings[lang] && settings[lang].entrepriseFeatures && settings[lang].entrepriseFeatures !== '') || (settings.entrepriseFeatures && settings.entrepriseFeatures !== '') ? ' py-2 px-4 md:w-312px h-855px borderedStyle rounded-md ' : 'flex justify-between normalBorder md:w-312px h-400px rounded-md ' : (settings[lang] && settings[lang].entrepriseFeatures && settings[lang].entrepriseFeatures !== '') || (settings.entrepriseFeatures && settings.entrepriseFeatures !== '') ? ' md:w-312px md:h-855px' : ' md:w-312px md:h-400px'" @mouseover="entrepriseHovered = true" @mouseout="entrepriseHovered = false">
		  <div class="flex flex-col z-10 w-max px-4 pt-4 rounded-md " :class="entrepriseHovered || settings.entrepriseMostPopular === true ? ' rounded-md ' : ''">
			<div v-if="settings.entrepriseMostPopular === true" class="absolute top-0 left-1/2 transform -translate-x-1/2 w-2/3 border-transparent">
			  <span class="absolute popular w-max top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45  p-2">{{ $t('mostPopular') }}</span>
			</div>
			<div class="flex items-center border-b border-FieldGray pb-4">
			  <div class="flex justify-center border border-Dark rounded-full w-100px h-100px mr-6" :class="entrepriseHovered || settings.entrepriseMostPopular === true ? '' : ''">
				<img  v-if="(settings.entrepriseMedia.files && settings.entrepriseMedia.files[0].url) || (settings.entrepriseMedia.url && settings.entrepriseMedia.url !== '')" format="webp" loading="lazy" :src="settings.entrepriseMedia.url && settings.entrepriseMedia.url !== '' ? settings.entrepriseMedia.url : settings.entrepriseMedia.files[0].url" :alt="settings.entrepriseMedia.seo_tag" class="p-2" />
			  </div>
			  <div class="w-140px">
				<h2 class="  w-80px " :class="entrepriseHovered || settings.entrepriseMostPopular === true ? '' : ''">{{ getCurrentTranslation(settings, lang, 'entrepriseTitle', 'entrepriseTitle_fr') }}</h2>
				<p v-if="settings.entrepriseDescription !== ''" class="pt-2 text-sm  text-grayText">{{ getCurrentTranslation(settings, lang, 'entrepriseDescription', 'entrepriseDescription_fr') }}</p>
			  </div>
			
			</div>
			
			<!--            <div v-if="settings[lang].entreprisePrice" class="flex justify-center my-11">-->
			<!--              <div class="text-2xl  ">{{ getCurrentTranslation(settings, lang, 'entreprisePrice', 'entreprisePrice_fr') }}</div>-->
			<!--            </div>-->
			<div class="flex justify-center mt-1">
			  <div class="pt-6 " :class="entrepriseHovered || settings.entrepriseMostPopular === true ? ' text-4xl' : 'text-2xl'">€</div>
			  <h1>{{ settings.entreprisePrice }}</h1>
			</div>
			
			<p :class="entrepriseHovered || settings.entrepriseMostPopular === true ? 'flex justify-center pt-1 text-sm  text-grayText' : 'flex justify-center pt-1 text-sm  text-grayText'">{{ getCurrentTranslation(settings, lang, 'entrepriseDate', 'entrepriseDate_fr') }}</p>
			
			<div v-if="(settings[lang] && settings[lang].entrepriseFeatures && settings[lang].entrepriseFeatures !== '') || (settings.entrepriseFeatures && settings.entrepriseFeatures !== '')" class="pt-6 flex flex-col h-full justify-between">
			  <div>
				<div v-for="item  in getFeaturesArray(settings, lang, 'entrepriseFeatures', 'entrepriseFeatures_fr')" :key="item" class="flex justify-start items-start md:w-full w-320px pt-1 pl-3 pr-3">
				  <div class="icon pt-1.5 mr-3" :class="entrepriseHovered === true || settings.entrepriseMostPopular === true ? 'entrepriseHovered' : 'entreprise'">
				  </div>
				  <p class="  " :class="entrepriseHovered || settings.entrepriseMostPopular === true ? '' : ''">{{ item }}</p>
				</div>
			  </div>
			  <div class="flex justify-center pb-10 cursor-pointer" @click="openURL(settings[lang].entrepriseStartLink)">
				<p class="  ">
				  {{ getCurrentTranslation(settings, lang, 'entrepriseStartLabel', 'entrepriseStartLabel_fr') }}
				</p>
			  </div>
			</div>
			
			<div v-else>
			  <div class="flex justify-center pt-6 pb-6">
				<div class="icon mr-3" :class="entrepriseHovered === true || settings.entrepriseMostPopular === true ? 'entrepriseHovered' : 'entreprise'">
				</div>
				<p class="pr-2  " :class="entrepriseHovered || settings.entrepriseMostPopular === true ? '' : ''">{{ getCurrentTranslation(settings, lang, 'entrepriseCustomFeature', 'entrepriseCustomFeature_fr') }}</p>
				<p class="pr-2  " :class="entrepriseHovered || settings.entrepriseMostPopular === true ? '' : ''">{{ getCurrentTranslation(settings, lang, 'pagesLabel', 'pagesLabel_fr') }}</p>
				<p class=" " :class="entrepriseHovered || settings.entrepriseMostPopular === true ? '' : ''">{{ settings.entreprisePagesNumber }}</p>
			  </div>
			  
			  <div class="flex justify-center pt-1 pb-2 cursor-pointer" @click="navigateURL('entrepriseLink', 'entrepriseLink_fr')">
				<div class=" pr-2" :class="entrepriseHovered || settings.entrepriseMostPopular === true ? '' : ''">
				  =>
				</div>
				<p class=" ">
				  {{ getCurrentTranslation(settings, lang, 'knowMoreLabel', 'knowMoreLabel_fr') }}
				</p>
			  </div>
			</div>
		  
		  </div>
		
		</div>
	  
	  
	  </div>
	  
	</div>
  
  </div>
</template>

<script>
import {getArray, getTranslation} from "@/utils/constants";

export default {
  name: 'SectionPackages',
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
		  en: {
			title: "html",
			subTitle: "string",
			freeTitle: "string",
			freeDescription: "html",
			freeDate: "string",
			freeLink: "string",
			freeStartLabel: "string",
			freeStartLink: "string",
			standardTitle: "string",
			standardDescription: "string",
			standardDate: "string",
			standardLink: "string",
			standardStartLabel: "string",
			standardStartLink: "string",
			corporateTitle: "string",
			corporateDescription: "string",
			corporateDate: "string",
			corporateLink: "string",
			corporateStartLabel: "string",
			corporateStartLink: "string",
			entrepriseTitle: "string",
			entrepriseDescription: "string",
			entreprisePrice: "string",
			entrepriseDate: "string",
			entrepriseLink: "string",
			entrepriseStartLabel: "string",
			entrepriseStartLink: "string",
			freeFeatures: "string",
			standardFeatures: "string",
			corporateFeatures: "string",
			entrepriseFeatures: "string",
			entrepriseCustomFeature: "string",
			pagesLabel: "string",
			knowMoreLabel: "string"
		  },
		  fr: {
			title: "html",
			subTitle: "string",
			freeTitle: "string",
			freeDescription: "html",
			freeDate: "string",
			freeLink: "string",
			freeStartLabel: "string",
			freeStartLink: "string",
			standardTitle: "string",
			standardDescription: "string",
			standardDate: "string",
			standardLink: "string",
			standardStartLabel: "string",
			standardStartLink: "string",
			corporateTitle: "string",
			corporateDescription: "string",
			corporateDate: "string",
			corporateLink: "string",
			corporateStartLabel: "string",
			corporateStartLink: "string",
			entrepriseTitle: "string",
			entrepriseDescription: "string",
			entreprisePrice: "string",
			entrepriseDate: "string",
			entrepriseLink: "string",
			entrepriseStartLabel: "string",
			entrepriseStartLink: "string",
			freeFeatures: "string",
			standardFeatures: "string",
			corporateFeatures: "string",
			entrepriseFeatures: "string",
			entrepriseCustomFeature: "string",
			pagesLabel: "string",
			knowMoreLabel: "string"
		  },
		  freePrice: "number",
		  freePagesNumber: "integer",
		  freeMostPopular: "boolean",
		  freeMedia: "image",
		  standardPrice: "number",
		  standardPagesNumber: "integer",
		  standardMostPopular: "boolean",
		  standardMedia: "image",
		  corporatePrice: "number",
		  corporatePagesNumber: "integer",
		  corporateMostPopular: "boolean",
		  corporateMedia: "image",
		  entreprisePrice: "number",
		  entreprisePagesNumber: "integer",
		  entrepriseMostPopular: "boolean",
		  entrepriseMedia: "image"
		}
	  ]
	}
  },
  data() {
	return {
	  percenInViewPort: 0,
	  addOpacity: false,
	  isVisible: false,
	  freeHovered: false,
	  standardHovered: false,
	  corporateHovered: false,
	  entrepriseHovered: false,
	};
  },
  computed: {
	settings() {
	  if(Array.isArray(this.section.settings)) {
		return this.section.settings[0];
	  } else return this.section.settings
	},
  },
  methods: {
	viewHandler(e) {
	  this.percenInViewPort = e.percentInView === 0 ? 1 : e.percentInView;
	  const percenInViewPort = e.percentInView;
	  if (percenInViewPort > 0) {
		this.isVisible = true;
	  }
	  if (percenInViewPort === 1) {
		this.addOpacity = true;
	  }
	},
	getCurrentTranslation(settings, lang, primaryKey, frKey) {
	  return getTranslation(settings, lang, primaryKey, frKey)
	},
	navigateURL(primaryKey, frKey) {
	  if(this.settings[this.lang]) {
		if(this.lang === 'fr') {
		  this.settings[this.lang][primaryKey] === '' ? this.$router.push(this.settings[frKey]) : this.$router.push(this.settings[this.lang][primaryKey])
		} else this.settings[this.lang][primaryKey] === '' ? this.$router.push(this.settings[primaryKey]) : this.$router.push(this.settings[this.lang][primaryKey])
	  } else return this.lang === 'fr' ? this.$router.push(this.settings[frKey]) : this.$router.push(this.settings[primaryKey])
	},
	openURL(url) {
	  window.open(url, '_blank')
	},
	getFeaturesArray(settings, lang, primaryKey, frKey) {
	  return getArray(settings, lang, primaryKey, frKey)
	}
  }
};
</script>

<style>
.wys-wrapper {
  width: 87%;
  margin: 0 auto;
}
.wys-wrapper .title {
  max-width: 470px;
}

.view-component {
  overflow: initial !important;
}

h1 span {
  line-height: 1.3em;
}

.blueShapeStyle {
  top: 28rem !important;
  z-index: -10 !important;
}

@media only screen and (max-width: 640px) {
  .blueShapeStyle {
	top: 5rem !important;
	z-index: -10 !important;
  }
}
</style>
