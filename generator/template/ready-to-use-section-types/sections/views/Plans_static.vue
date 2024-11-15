<template>
  <div v-if="settings" class="plans plans-wrapper">
	
	<div class="mt-18 pb-20 sectionsPack">
	  
	  <div class="flex w-full justify-center">
		<div class="ql-editor ql-snow mt-14 md:w-full w-fit px-16 md:px-0 title" style="letter-spacing: 4px" v-html="getCurrentTranslation(settings, lang, 'title', 'title_fr')"></div>
	  </div>
	  
	  <div class="flex w-full justify-center">
		<div class="ql-editor ql-snow md:w-full mt-2 px-8 md:px-0 font-light subtitle" v-html="getCurrentTranslation(settings, lang, 'subTitle', 'subTitle_fr')"></div>
	  </div>
	  
	  <div :class="['flex flex-wrap justify-center gap-7 items-center mt-16', (settings[lang] && settings[lang].freeFeatures && settings[lang].freeFeatures !== '') || (settings.freeFeatures && settings.freeFeatures !== '') ? 'md:h-full' : 'md:h-400px']">
		
		<!--        Free-->
		<div class="flex justify-between relative plansBox" :class="!freeHovered && settings.freeMostPopular !== true ? (settings[lang] && settings[lang].freeFeatures && settings[lang].freeFeatures !== '') || (settings.freeFeatures && settings.freeFeatures !== '') ? 'bg-darkBlue py-2 md:w-312px  borderedStyle rounded-md' : 'flex justify-between bg-darkBlue w-312px h-400px rounded-md' : (settings[lang] && settings[lang].freeFeatures && settings[lang].freeFeatures !== '') || (settings.freeFeatures && settings.freeFeatures !== '') ? 'bg-white rounded-md md:w-312px ' : 'bg-white rounded-md md:w-312px md:h-400px'" @mouseover="freeHovered = true" @mouseout="freeHovered = false">
		  <div class="flex flex-col z-10 w-max justify-between py-4 rounded-md" :class="!freeHovered && settings.freeMostPopular !== true ? 'bg-darkBlue rounded-md mx-4 px-0' : 'bg-white px-4'">
			<div v-if="settings.freeMostPopular === true" class="absolute top-0 left-0 transform w-2/3 border-transparent">
			  <img class="absolute popPad" src="@/assets/icons/popularTag.png" alt="" />
			  <div class="absolute popText">
				<div class="relative" :class="$i18n.locale === 'fr' ? 'pl-2' : ''">
                  <span class="absolute text-white w-max transform -rotate-45  p-2">
                    {{ $t('mostPopular') }}
                  </span>
				</div>
			  </div>
			</div>
			<div class="flex items-center border-b border-FieldGray pb-4">
			  <div class="flex justify-center border border-Dark rounded-full w-100px h-100px mr-6" :class="!freeHovered && settings.freeMostPopular !== true ? 'border-white' : ''">
				<img v-if="(settings.freeMedia.files && settings.freeMedia.files[0].url) || (settings.freeMedia.url && settings.freeMedia.url !== '')" format="webp" loading="lazy" :src="settings.freeMedia.url && settings.freeMedia.url !== '' ? settings.freeMedia.url : settings.freeMedia.files[0].url" :alt="settings.freeMedia.seo_tag" class="p-2" />
			  </div>
			  <div class="w-140px plansTitleBox">
				<div class="titleHovered w-80px" :class="!freeHovered && settings.freeMostPopular !== true ? 'title' : ''">{{ getCurrentTranslation(settings, lang, 'freeTitle', 'freeTitle_fr') }}</div>
				<div v-if="settings.freeDescription !== ''" class="ql-editor ql-snow pt-2 pb-0 pl-0 desc" v-html="getCurrentTranslation(settings, lang, 'freeDescription', 'freeDescription_fr')"></div>
			  </div>
			
			</div>
			
			<div class="flex justify-center mt-1">
			  <div v-if="getCurrentTranslation(settings, lang, 'freeCurrency', 'freeCurrency_fr')" class="pt-6" :class="!freeHovered && settings.freeMostPopular !== true ? 'currency' : 'currencyHovered'">{{ getCurrentTranslation(settings, lang, 'freeCurrency', 'freeCurrency_fr') }}</div>
			  <div class="price">{{ settings[lang].freePrice }}</div>
			</div>
			
			<div :class="!freeHovered && settings.freeMostPopular !== true ? 'flex justify-center pt-1 date' : 'flex justify-center pt-1 date'">{{ getCurrentTranslation(settings, lang, 'freeDate', 'freeDate_fr') }}</div>
			
			<div v-if="(settings[lang] && settings[lang].freeFeatures && settings[lang].freeFeatures !== '') || (settings.freeFeatures && settings.freeFeatures !== '')" class="pt-6 flex flex-col h-full justify-between">
			  <div class="pb-4 features">
				<ul v-for="(item, index)  in getFeaturesArray(settings, lang, 'freeFeatures', 'freeFeatures_fr')" :key="`box1-${item}-${index}`" class="flex justify-start items-start md:w-full w-320px pt-1 ">
				  <li class="bpHovered" :class="!freeHovered && settings.freeMostPopular !== true ? 'bp' : ''">{{ item }}</li>
				</ul>
			  </div>
			  
			  <div class="flex justify-center  cursor-pointer" @click="openURL(settings[lang].freeStartLink)">
				<div class="cta">
				  {{ getCurrentTranslation(settings, lang, 'freeStartLabel', 'freeStartLabel_fr') }}
				</div>
			  </div>
			</div>
			
			<div v-else>
			  <div class="flex flex-col justify-between">
				<div v-if="getCurrentTranslation(settings, lang, 'pagesLabel', 'pagesLabel_fr')" class="flex justify-center pt-6 pb-6">
				  <div class="pr-2 bpHovered" :class="!freeHovered && settings.freeMostPopular !== true ? 'bp' : ''">{{ getCurrentTranslation(settings, lang, 'pagesLabel', 'pagesLabel_fr') }}</div>
				  <div :class="!freeHovered && settings.freeMostPopular !== true ? 'text-xl text-white font-medium' : 'text-xl text-purpleInfo font-medium'">{{ settings.freePagesNumber }}</div>
				</div>
				
				<div v-if="getCurrentTranslation(settings, lang, 'freeLink', 'freeLink_fr')" class="flex justify-center pt-1 pb-2 cursor-pointer" @click="navigateURL('freeLink', 'freeLink_fr')">
				  <div class="pr-2" :class="!freeHovered && settings.freeMostPopular !== true ? 'text-white' : 'text-purpleInfo'">
					=>
				  </div>
				  <div class="cta">
					{{ getCurrentTranslation(settings, lang, 'knowMoreLabel', 'knowMoreLabel_fr') }}
				  </div>
				</div>
			  </div>
			</div>
		  
		  </div>
		
		</div>
		
		<!--        Standard-->
		<div class="flex justify-between relative plansBox" :class="!standardHovered && settings.standardMostPopular !== true ? (settings[lang] && settings[lang].standardFeatures && settings[lang].standardFeatures !== '') || (settings.standardFeatures && settings.standardFeatures !== '') ? 'bg-darkBlue py-2 md:w-312px  borderedStyle rounded-md' : 'flex justify-between bg-darkBlue w-312px h-400px rounded-md' : (settings[lang] && settings[lang].standardFeatures && settings[lang].standardFeatures !== '') || (settings.standardFeatures && settings.standardFeatures !== '') ? 'bg-white rounded-md md:w-312px ' : 'bg-white rounded-md md:w-312px md:h-400px'" @mouseover="standardHovered = true" @mouseout="standardHovered = false">
		  <div class="flex flex-col z-10 w-max justify-between py-4 rounded-md" :class="!standardHovered && settings.standardMostPopular !== true ? 'bg-darkBlue rounded-md mx-4 px-0' : 'bg-white px-4'">
			<div v-if="settings.standardMostPopular === true" class="absolute top-0 left-0 transform w-2/3 border-transparent">
			  <img class="absolute popPad" src="@/assets/icons/popularTag.png" alt="" />
			  <div class="absolute popText">
				<div class="relative" :class="$i18n.locale === 'fr' ? 'pl-2' : ''">
                  <span class="absolute text-white w-max transform -rotate-45  p-2">
                    {{ $t('mostPopular') }}
                  </span>
				</div>
			  </div>
			</div>
			<div class="flex items-center border-b border-FieldGray pb-4">
			  <div class="flex justify-center border border-Dark rounded-full w-100px h-100px mr-6" :class="!standardHovered && settings.standardMostPopular !== true ? 'border-white' : ''">
				<img v-if="(settings.standardMedia.files && settings.standardMedia.files[0].url) || (settings.standardMedia.url && settings.standardMedia.url !== '')" format="webp" loading="lazy" :src="settings.standardMedia.url && settings.standardMedia.url !== '' ? settings.standardMedia.url : settings.standardMedia.files[0].url" :alt="settings.standardMedia.seo_tag" class="p-2" />
			  </div>
			  <div class="w-140px plansTitleBox">
				<div class="titleHovered w-80px" :class="!standardHovered && settings.standardMostPopular !== true ? 'title' : ''">{{ getCurrentTranslation(settings, lang, 'standardTitle', 'standardTitle_fr') }}</div>
				<div v-if="settings.standardDescription !== ''" class="ql-editor ql-snow pt-2 pb-0 pl-0 desc" v-html="getCurrentTranslation(settings, lang, 'standardDescription', 'standardDescription_fr')"></div>
			  </div>
			
			</div>
			
			<div class="flex justify-center mt-1">
			  <div v-if="getCurrentTranslation(settings, lang, 'standardCurrency', 'standardCurrency_fr')" class="pt-6" :class="!standardHovered && settings.standardMostPopular !== true ? 'currency' : 'currencyHovered'">{{ getCurrentTranslation(settings, lang, 'standardCurrency', 'standardCurrency_fr') }}</div>
			  <div class="price">{{ settings[lang].standardPrice }}</div>
			</div>
			
			<div :class="!standardHovered && settings.standardMostPopular !== true ? 'flex justify-center pt-1 date' : 'flex justify-center pt-1 date'">{{ getCurrentTranslation(settings, lang, 'standardDate', 'standardDate_fr') }}</div>
			
			<div v-if="(settings[lang] && settings[lang].standardFeatures && settings[lang].standardFeatures !== '') || (settings.standardFeatures && settings.standardFeatures !== '')" class="pt-6 flex flex-col h-full justify-between">
			  <div class="pb-4 features">
				<ul v-for="(item, index)  in getFeaturesArray(settings, lang, 'standardFeatures', 'standardFeatures_fr')" :key="`box2-${item}-${index}`" class="flex justify-start items-start md:w-full w-320px pt-1 ">
				  <li class="bpHovered" :class="!standardHovered && settings.standardMostPopular !== true ? 'bp' : ''">{{ item }}</li>
				</ul>
			  </div>
			  
			  <div class="flex justify-center  cursor-pointer" @click="openURL(settings[lang].standardStartLink)">
				<div class="cta">
				  {{ getCurrentTranslation(settings, lang, 'standardStartLabel', 'standardStartLabel_fr') }}
				</div>
			  </div>
			</div>
			
			<div v-else>
			  <div v-if="getCurrentTranslation(settings, lang, 'pagesLabel', 'pagesLabel_fr')" class="flex justify-center pt-6 pb-6">
				<div class="pr-2 bpHovered" :class="!standardHovered && settings.standardMostPopular !== true ? 'bp' : ''">{{ getCurrentTranslation(settings, lang, 'pagesLabel', 'pagesLabel_fr') }}</div>
				<div :class="!standardHovered && settings.standardMostPopular !== true ? 'pageNumber' : 'pageNumberHovered'">{{ settings.standardPagesNumber }}</div>
			  </div>
			  
			  <div v-if="getCurrentTranslation(settings, lang, 'standardLink', 'standardLink_fr')" class="flex justify-center pt-1 pb-2 cursor-pointer" @click="navigateURL('standardLink', 'standardLink_fr')">
				<div class="pr-2" :class="!standardHovered && settings.standardMostPopular !== true ? 'pageNumber' : 'pageNumberHovered'">
				  =>
				</div>
				<div class="cta">
				  {{ getCurrentTranslation(settings, lang, 'knowMoreLabel', 'knowMoreLabel_fr') }}
				</div>
			  </div>
			</div>
		  
		  </div>
		
		</div>
		
		<!--        Corporate-->
		<div class="flex justify-between relative plansBox" :class="!corporateHovered && settings.corporateMostPopular !== true ? (settings[lang] && settings[lang].corporateFeatures && settings[lang].corporateFeatures !== '') || (settings.corporateFeatures && settings.corporateFeatures !== '') ? 'bg-darkBlue py-2 md:w-312px  borderedStyle rounded-md' : 'flex justify-between bg-darkBlue md:w-312px h-400px rounded-md' : (settings[lang] && settings[lang].corporateFeatures && settings[lang].corporateFeatures !== '') || (settings.corporateFeatures && settings.corporateFeatures !== '') ? 'bg-white rounded-md md:w-312px ' : 'bg-white rounded-md md:w-312px md:h-400px'" @mouseover="corporateHovered = true" @mouseout="corporateHovered = false">
		  <div class="flex flex-col z-10 w-max justify-between py-4 rounded-md" :class="!corporateHovered && settings.corporateMostPopular !== true ? 'bg-darkBlue rounded-md mx-4 px-0' : 'bg-white px-4'">
			<div v-if="settings.corporateMostPopular === true" class="absolute top-0 left-0 transform w-2/3 border-transparent">
			  <img class="absolute popPad" src="@/assets/icons/popularTag.png" alt="" />
			  <div class="absolute popText">
				<div class="relative" :class="$i18n.locale === 'fr' ? 'pl-2' : ''">
                  <span class="absolute text-white w-max transform -rotate-45  p-2">
                    {{ $t('mostPopular') }}
                  </span>
				</div>
			  </div>
			</div>
			<div class="flex items-center border-b border-FieldGray pb-4">
			  <div class="flex justify-center border border-Dark rounded-full w-100px h-100px mr-6" :class="!corporateHovered && settings.corporateMostPopular !== true ? 'border-white' : ''">
				<img v-if="(settings.corporateMedia.files && settings.corporateMedia.files[0].url) || (settings.corporateMedia.url && settings.corporateMedia.url !== '')" format="webp" loading="lazy" :src="settings.corporateMedia.url && settings.corporateMedia.url !== '' ? settings.corporateMedia.url : settings.corporateMedia.files[0].url" :alt="settings.corporateMedia.seo_tag" class="p-2" />
			  </div>
			  <div class="w-140px plansTitleBox">
				<div class="titleHovered w-80px" :class="!corporateHovered && settings.corporateMostPopular !== true ? 'title' : ''">{{ getCurrentTranslation(settings, lang, 'corporateTitle', 'corporateTitle_fr') }}</div>
				<div v-if="settings.corporateDescription !== ''" class="ql-editor ql-snow pt-2 pb-0 pl-0 desc" v-html="getCurrentTranslation(settings, lang, 'corporateDescription', 'corporateDescription_fr')"></div>
			  </div>
			
			</div>
			
			<div class="flex justify-center mt-1">
			  <div v-if="getCurrentTranslation(settings, lang, 'corporateCurrency', 'corporateCurrency_fr')" class="pt-6" :class="!corporateHovered && settings.corporateMostPopular !== true ? 'currency' : 'currencyHovered'">{{ getCurrentTranslation(settings, lang, 'corporateCurrency', 'corporateCurrency_fr') }}</div>
			  <div class="price">{{ settings[lang].corporatePrice }}</div>
			</div>
			
			<div :class="!corporateHovered && settings.corporateMostPopular !== true ? 'flex justify-center pt-1 date' : 'flex justify-center pt-1 date'">{{ getCurrentTranslation(settings, lang, 'corporateDate', 'corporateDate_fr') }}</div>
			
			<div v-if="(settings[lang] && settings[lang].corporateFeatures && settings[lang].corporateFeatures !== '') || (settings.corporateFeatures && settings.corporateFeatures !== '')" class="pt-6 flex flex-col h-full justify-between">
			  <div class="pb-4 features">
				<ul v-for="(item, index)  in getFeaturesArray(settings, lang, 'corporateFeatures', 'corporateFeatures_fr')" :key="`box3-${item}-${index}`" class="flex justify-start items-start md:w-full w-320px pt-1 ">
				  <li class="bpHovered" :class="!corporateHovered && settings.corporateMostPopular !== true ? 'bp' : ''">{{ item }}</li>
				</ul>
			  </div>
			  
			  <div class="flex justify-center  cursor-pointer" @click="openURL(settings[lang].corporateStartLink)">
				<div class="cta">
				  {{ getCurrentTranslation(settings, lang, 'corporateStartLabel', 'corporateStartLabel_fr') }}
				</div>
			  </div>
			</div>
			
			<div v-else>
			  <div v-if="getCurrentTranslation(settings, lang, 'pagesLabel', 'pagesLabel_fr')" class="flex justify-center pt-6 pb-6">
				<div class="pr-2 bpHovered" :class="!corporateHovered && settings.corporateMostPopular !== true ? 'bp' : ''">{{ getCurrentTranslation(settings, lang, 'pagesLabel', 'pagesLabel_fr') }}</div>
				<div :class="!corporateHovered && settings.corporateMostPopular !== true ? 'pageNumber' : 'pageNumberHovered'">{{ settings.corporatePagesNumber }}</div>
			  </div>
			  
			  <div v-if="getCurrentTranslation(settings, lang, 'corporateLink', 'corporateLink_fr')" class="flex justify-center pt-1 pb-2 cursor-pointer" @click="navigateURL('corporateLink', 'corporateLink_fr')">
				<div class="pr-2" :class="!corporateHovered && settings.corporateMostPopular !== true ? 'pageNumber' : 'pageNumberHovered'">
				  =>
				</div>
				<div class="cta">
				  {{ getCurrentTranslation(settings, lang, 'knowMoreLabel', 'knowMoreLabel_fr') }}
				</div>
			  </div>
			</div>
		  
		  </div>
		
		</div>
		
		<!--        Entreprise-->
		<div v-if="getCurrentTranslation(settings, lang, 'entrepriseTitle', 'entrepriseTitle_fr')" class="flex justify-between relative plansBox" :class="!entrepriseHovered && settings.entrepriseMostPopular !== true ? (settings[lang] && settings[lang].entrepriseFeatures && settings[lang].entrepriseFeatures !== '') || (settings.entrepriseFeatures && settings.entrepriseFeatures !== '') ? 'bg-darkBlue py-2 md:w-312px  borderedStyle rounded-md' : 'flex justify-between bg-darkBlue md:w-312px h-400px rounded-md' : (settings[lang] && settings[lang].entrepriseFeatures && settings[lang].entrepriseFeatures !== '') || (settings.entrepriseFeatures && settings.entrepriseFeatures !== '') ? 'bg-white rounded-md md:w-312px ' : 'bg-white rounded-md md:w-312px md:h-400px'" @mouseover="entrepriseHovered = true" @mouseout="entrepriseHovered = false">
		  <div class="flex flex-col z-10 w-max justify-between py-4 rounded-md" :class="!entrepriseHovered && settings.entrepriseMostPopular !== true ? 'bg-darkBlue rounded-md mx-4 px-0' : 'bg-white px-4'">
			<div v-if="settings.entrepriseMostPopular === true" class="absolute top-0 left-0 transform w-2/3 border-transparent">
			  <img class="absolute popPad" src="@/assets/icons/popularTag.png" alt="" />
			  <div class="absolute popText">
				<div class="relative" :class="$i18n.locale === 'fr' ? 'pl-2' : ''">
                  <span class="absolute text-white w-max transform -rotate-45  p-2">
                    {{ $t('mostPopular') }}
                  </span>
				</div>
			  </div>
			</div>
			<div class="flex items-center border-b border-FieldGray pb-4">
			  <div class="flex justify-center border border-Dark rounded-full w-100px h-100px mr-6" :class="!entrepriseHovered && settings.entrepriseMostPopular !== true ? 'border-white' : ''">
				<img v-if="settings.entrepriseMedia && (settings.entrepriseMedia.files && settings.entrepriseMedia.files[0].url) || (settings.entrepriseMedia && settings.entrepriseMedia.url && settings.entrepriseMedia.url !== '')" format="webp" loading="lazy" :src="settings.entrepriseMedia.url && settings.entrepriseMedia.url !== '' ? settings.entrepriseMedia.url : settings.entrepriseMedia.files[0].url" :alt="settings.entrepriseMedia.seo_tag" class="p-2" />
			  </div>
			  <div class="w-140px plansTitleBox">
				<div class="titleHovered w-80px" :class="!entrepriseHovered && settings.entrepriseMostPopular !== true ? 'title' : ''">{{ getCurrentTranslation(settings, lang, 'entrepriseTitle', 'entrepriseTitle_fr') }}</div>
				<div v-if="settings.entrepriseDescription !== ''" class="ql-editor ql-snow pt-2 pb-0 pl-0 desc" v-html="getCurrentTranslation(settings, lang, 'entrepriseDescription', 'entrepriseDescription_fr')"></div>
			  </div>
			
			</div>
			
			<!--            <div v-if="settings[lang].entreprisePrice" class="flex justify-center my-11">-->
			<!--              <div class="text-2xl font-light text-Blue">{{ getCurrentTranslation(settings, lang, 'entreprisePrice', 'entreprisePrice_fr') }}</div>-->
			<!--            </div>-->
			<div class="flex justify-center mt-1">
			  <div v-if="getCurrentTranslation(settings, lang, 'entrepriseCurrency', 'entrepriseCurrency_fr')" class="pt-6" :class="!entrepriseHovered && settings.entrepriseMostPopular !== true ? 'currency' : 'currencyHovered'">{{ getCurrentTranslation(settings, lang, 'entrepriseCurrency', 'entrepriseCurrency_fr') }}</div>
			  <div class="price">{{ settings[lang].entreprisePrice }}</div>
			</div>
			
			<div :class="!entrepriseHovered && settings.entrepriseMostPopular !== true ? 'flex justify-center pt-1 date' : 'flex justify-center pt-1 date'">{{ getCurrentTranslation(settings, lang, 'entrepriseDate', 'entrepriseDate_fr') }}</div>
			
			<div v-if="(settings[lang] && settings[lang].entrepriseFeatures && settings[lang].entrepriseFeatures !== '') || (settings.entrepriseFeatures && settings.entrepriseFeatures !== '')" class="pt-6 flex flex-col h-full justify-between">
			  <div class="pb-4 features">
				<ul v-for="(item, index)  in getFeaturesArray(settings, lang, 'entrepriseFeatures', 'entrepriseFeatures_fr')" :key="`box4-${item}-${index}`" class="flex justify-start items-start md:w-full w-320px pt-1 ">
				  <li class="bpHovered" :class="!entrepriseHovered && settings.entrepriseMostPopular !== true ? 'bp' : ''">{{ item }}</li>
				</ul>
			  </div>
			  <div class="flex justify-center  cursor-pointer" @click="openURL(settings[lang].entrepriseStartLink)">
				<div class="cta">
				  {{ getCurrentTranslation(settings, lang, 'entrepriseStartLabel', 'entrepriseStartLabel_fr') }}
				</div>
			  </div>
			</div>
			
			<div v-else>
			  <div v-if="getCurrentTranslation(settings, lang, 'pagesLabel', 'pagesLabel_fr')" class="flex justify-center pt-6 pb-6">
				<div class="pr-2 bpHovered" :class="!entrepriseHovered && settings.entrepriseMostPopular !== true ? 'bp' : ''">{{ getCurrentTranslation(settings, lang, 'entrepriseCustomFeature', 'entrepriseCustomFeature_fr') }}</div>
				<div class="pr-2 bpHovered" :class="!entrepriseHovered && settings.entrepriseMostPopular !== true ? 'bp' : ''">{{ getCurrentTranslation(settings, lang, 'pagesLabel', 'pagesLabel_fr') }}</div>
				<div :class="!entrepriseHovered && settings.entrepriseMostPopular !== true ? 'pageNumber' : 'pageNumberHovered'">{{ settings.entreprisePagesNumber }}</div>
			  </div>
			  
			  <div v-if="getCurrentTranslation(settings, lang, 'entrepriseLink', 'entrepriseLink_fr')" class="flex justify-center pt-1 pb-2 cursor-pointer" @click="navigateURL('entrepriseLink', 'entrepriseLink_fr')">
				<div class="pr-2" :class="!entrepriseHovered && settings.entrepriseMostPopular !== true ? 'pageNumber' : 'pageNumberHovered'">
				  =>
				</div>
				<div class="cta">
				  {{ getCurrentTranslation(settings, lang, 'knowMoreLabel', 'knowMoreLabel_fr') }}
				</div>
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
  name: 'PlansStatic',
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
			entreprisePrice: "number",
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
			entreprisePrice: "number",
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
	},
	getCurrentTranslation(settings, lang, primaryKey, frKey) {
	  return getTranslation(settings, lang, primaryKey, frKey)
	},
	navigateURL(primaryKey, frKey) {
	  if(this.settings[this.lang]) {
		if(this.lang === 'fr') {
		  this.settings[this.lang][primaryKey] === '' ? this.knowMoreLink(this.settings[frKey]) : this.knowMoreLink(this.settings[this.lang][primaryKey])
		} else this.settings[this.lang][primaryKey] === '' ? this.knowMoreLink(this.settings[primaryKey]) : this.knowMoreLink(this.settings[this.lang][primaryKey])
	  } else return this.lang === 'fr' ? this.knowMoreLink(this.settings[frKey]) : this.knowMoreLink(this.settings[primaryKey])
	},
	knowMoreLink(url) {
	  if (url.includes('http')) {
		window.open(url, '_blank')
	  } else {
		this.$router.push(url)
	  }
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
